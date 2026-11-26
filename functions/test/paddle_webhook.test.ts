import { describe, it } from "mocha";
import { expect } from "chai";
import { handlePaddleWebhookEvent, PADDLE_PRICES } from "../src/index.js";

/**
 * In-memory Mock Firestore for unit testing the webhook event handler.
 */
class MockDocumentReference {
  constructor(private path: string, private store: Map<string, any>) {}

  async get(): Promise<{ exists: boolean; data: () => any }> {
    const data = this.store.get(this.path);
    return {
      exists: data !== undefined,
      data: () => data,
    };
  }

  async set(data: any, options?: { merge?: boolean }): Promise<void> {
    if (options?.merge && this.store.has(this.path)) {
      const existing = this.store.get(this.path);
      this.store.set(this.path, { ...existing, ...data });
    } else {
      this.store.set(this.path, data);
    }
  }
}

class MockCollectionReference {
  constructor(private colName: string, private store: Map<string, any>) {}

  doc(docId: string): MockDocumentReference {
    return new MockDocumentReference(`${this.colName}/${docId}`, this.store);
  }
}

class MockFirestore {
  public store = new Map<string, any>();

  collection(name: string): MockCollectionReference {
    return new MockCollectionReference(name, this.store);
  }

  getData(path: string): any {
    return this.store.get(path);
  }
}

describe("Paddle Webhook Event Handler Unit Tests", () => {
  let mockDb: MockFirestore;

  beforeEach(() => {
    mockDb = new MockFirestore();
  });

  it("1. new standard: grants isPro=true and subscriptionTier='standard'", async () => {
    const event = {
      eventId: "evt_new_std_001",
      eventType: "transaction.completed",
      data: {
        id: "txn_001",
        status: "completed",
        customData: { userId: "user_test_std" },
        items: [{ price: { id: PADDLE_PRICES.STANDARD_ANNUAL } }],
        currentBillingPeriod: { endsAt: "2027-11-26T00:00:00Z" },
      },
    };

    const result = await handlePaddleWebhookEvent(event, mockDb as any);
    expect(result.status).to.equal("processed");

    const userDoc = mockDb.getData("users/user_test_std");
    expect(userDoc).to.exist;
    expect(userDoc.isPro).to.be.true;
    expect(userDoc.subscriptionTier).to.equal("standard");
    expect(userDoc.subscriptionStatus).to.equal("completed");
    expect(userDoc.planExpiresAt).to.equal("2027-11-26T00:00:00Z");

    const eventDoc = mockDb.getData("paddle_events/evt_new_std_001");
    expect(eventDoc).to.exist;
  });

  it("2. new premium: grants isPro=true and subscriptionTier='premium'", async () => {
    const event = {
      eventId: "evt_new_prem_002",
      eventType: "subscription.created",
      data: {
        id: "sub_prem_002",
        status: "active",
        customData: { userId: "user_test_prem" },
        items: [{ price: { id: PADDLE_PRICES.PREMIUM_ANNUAL } }],
        currentBillingPeriod: { endsAt: "2027-11-26T00:00:00Z" },
      },
    };

    const result = await handlePaddleWebhookEvent(event, mockDb as any);
    expect(result.status).to.equal("processed");

    const userDoc = mockDb.getData("users/user_test_prem");
    expect(userDoc).to.exist;
    expect(userDoc.isPro).to.be.true;
    expect(userDoc.subscriptionTier).to.equal("premium");
    expect(userDoc.subscriptionId).to.equal("sub_prem_002");
  });

  it("3. plan change: updates subscriptionTier from standard to premium", async () => {
    // Initial standard state
    mockDb.store.set("users/user_plan_change", {
      isPro: true,
      subscriptionTier: "standard",
      subscriptionId: "sub_change_003",
    });

    const event = {
      eventId: "evt_upgrade_003",
      eventType: "subscription.updated",
      data: {
        id: "sub_change_003",
        status: "active",
        customData: { userId: "user_plan_change" },
        items: [{ price: { id: PADDLE_PRICES.PREMIUM_MONTHLY } }],
        currentBillingPeriod: { endsAt: "2026-12-26T00:00:00Z" },
      },
    };

    const result = await handlePaddleWebhookEvent(event, mockDb as any);
    expect(result.status).to.equal("processed");

    const userDoc = mockDb.getData("users/user_plan_change");
    expect(userDoc.subscriptionTier).to.equal("premium");
    expect(userDoc.isPro).to.be.true;
    expect(userDoc.planExpiresAt).to.equal("2026-12-26T00:00:00Z");
  });

  it("4. cancel: retains access until end of billing cycle or revokes when expired", async () => {
    // Future end date
    const futureDate = new Date(Date.now() + 86400000 * 14).toISOString();
    const eventFuture = {
      eventId: "evt_cancel_future_004",
      eventType: "subscription.canceled",
      data: {
        id: "sub_004",
        status: "canceled",
        customData: { userId: "user_cancel_future" },
        currentBillingPeriod: { endsAt: futureDate },
      },
    };

    const resFuture = await handlePaddleWebhookEvent(eventFuture, mockDb as any);
    expect(resFuture.status).to.equal("processed");
    const userFuture = mockDb.getData("users/user_cancel_future");
    expect(userFuture.isPro).to.be.true;
    expect(userFuture.subscriptionStatus).to.equal("canceled");
    expect(userFuture.planExpiresAt).to.equal(futureDate);

    // Immediate / already expired cancellation
    const pastDate = new Date(Date.now() - 86400000).toISOString();
    const eventExpired = {
      eventId: "evt_cancel_past_005",
      eventType: "subscription.canceled",
      data: {
        id: "sub_005",
        status: "canceled",
        customData: { userId: "user_cancel_past" },
        currentBillingPeriod: { endsAt: pastDate },
      },
    };

    const resExpired = await handlePaddleWebhookEvent(eventExpired, mockDb as any);
    expect(resExpired.status).to.equal("processed");
    const userExpired = mockDb.getData("users/user_cancel_past");
    expect(userExpired.isPro).to.be.false;
    expect(userExpired.subscriptionTier).to.equal("free");
    expect(userExpired.subscriptionStatus).to.equal("canceled");
  });

  it("5. refund: revokes subscription access and resets tier to free", async () => {
    mockDb.store.set("users/user_refund", {
      isPro: true,
      subscriptionTier: "premium",
      subscriptionStatus: "active",
    });

    const event = {
      eventId: "evt_refund_006",
      eventType: "adjustment.created",
      data: {
        action: "refund",
        customData: { userId: "user_refund" },
        subscriptionId: "sub_refund_006",
        items: [{ price: { id: PADDLE_PRICES.PREMIUM_ANNUAL } }],
      },
    };

    const result = await handlePaddleWebhookEvent(event, mockDb as any);
    expect(result.status).to.equal("processed");

    const userDoc = mockDb.getData("users/user_refund");
    expect(userDoc.isPro).to.be.false;
    expect(userDoc.subscriptionTier).to.equal("free");
    expect(userDoc.subscriptionStatus).to.equal("refunded");
  });

  it("6. Kanji-only: sets hasKanjiLiar=true without granting Pro or subscription tier", async () => {
    const event = {
      eventId: "evt_kanji_007",
      eventType: "transaction.completed",
      data: {
        id: "txn_kanji_007",
        status: "completed",
        customData: { userId: "user_kanji_only" },
        items: [{ price: { id: PADDLE_PRICES.KANJI_LIAR } }],
      },
    };

    const result = await handlePaddleWebhookEvent(event, mockDb as any);
    expect(result.status).to.equal("processed");

    const userDoc = mockDb.getData("users/user_kanji_only");
    expect(userDoc).to.exist;
    expect(userDoc.hasKanjiLiar).to.be.true;
    expect(userDoc.isPro).to.be.undefined;
    expect(userDoc.subscriptionTier).to.be.undefined;
  });

  it("7. duplicate event: idempotently skips already processed event ID", async () => {
    const event = {
      eventId: "evt_duplicate_008",
      eventType: "transaction.completed",
      data: {
        id: "txn_008",
        status: "completed",
        customData: { userId: "user_duplicate" },
        items: [{ price: { id: PADDLE_PRICES.STANDARD_ANNUAL } }],
      },
    };

    // First call
    const firstResult = await handlePaddleWebhookEvent(event, mockDb as any);
    expect(firstResult.status).to.equal("processed");

    // Second call with same eventId
    const secondResult = await handlePaddleWebhookEvent(event, mockDb as any);
    expect(secondResult.status).to.equal("duplicate");
    expect(secondResult.message).to.include("already processed");
  });

  it("8. bundle transaction: subscription plus Kanji Liar grants both correctly", async () => {
    const event = {
      eventId: "evt_bundle_009",
      eventType: "transaction.completed",
      data: {
        id: "txn_bundle_009",
        status: "completed",
        customData: { userId: "user_bundle" },
        items: [
          { price: { id: PADDLE_PRICES.STANDARD_ANNUAL } },
          { price: { id: PADDLE_PRICES.KANJI_LIAR } },
        ],
        currentBillingPeriod: { endsAt: "2027-11-26T00:00:00Z" },
      },
    };

    const result = await handlePaddleWebhookEvent(event, mockDb as any);
    expect(result.status).to.equal("processed");

    const userDoc = mockDb.getData("users/user_bundle");
    expect(userDoc.isPro).to.be.true;
    expect(userDoc.subscriptionTier).to.equal("standard");
    expect(userDoc.hasKanjiLiar).to.be.true;
  });

  it("9. unknown price ID: grants nothing and records ignored", async () => {
    const event = {
      eventId: "evt_unknown_010",
      eventType: "transaction.completed",
      data: {
        id: "txn_unknown_010",
        status: "completed",
        customData: { userId: "user_unknown" },
        items: [{ price: { id: "pri_totally_unknown_price_9999" } }],
      },
    };

    const result = await handlePaddleWebhookEvent(event, mockDb as any);
    expect(result.status).to.equal("ignored");

    const userDoc = mockDb.getData("users/user_unknown");
    expect(userDoc).to.be.undefined;
  });
});
