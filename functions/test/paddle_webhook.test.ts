import { describe, it, beforeEach } from "mocha";
import { expect } from "chai";
import * as crypto from "crypto";
import {
  handlePaddleWebhookEvent,
  verifyPaddleSignature,
  LIVE_PRICE_IDS,
  SANDBOX_PRICE_IDS,
} from "../src/index.js";

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

describe("Paddle Webhook & Signature Unit Tests", () => {
  let mockDb: MockFirestore;
  const testSecret = "pdl_ntfset_01testsecret1234567890abcdef";

  beforeEach(() => {
    mockDb = new MockFirestore();
  });

  describe("HMAC Signature Verification", () => {
    it("verifies valid HMAC-SHA256 signature", () => {
      const rawBody = JSON.stringify({ eventId: "evt_test", eventType: "transaction.completed" });
      const ts = Math.floor(Date.now() / 1000).toString();
      const hash = crypto.createHmac("sha256", testSecret).update(`${ts}:${rawBody}`).digest("hex");
      const signatureHeader = `ts=${ts};h1=${hash}`;

      const isValid = verifyPaddleSignature(rawBody, signatureHeader, testSecret);
      expect(isValid).to.be.true;
    });

    it("rejects invalid or tampered HMAC signature", () => {
      const rawBody = JSON.stringify({ eventId: "evt_test", eventType: "transaction.completed" });
      const ts = Math.floor(Date.now() / 1000).toString();
      const signatureHeader = `ts=${ts};h1=0000000000000000000000000000000000000000000000000000000000000000`;

      const isValid = verifyPaddleSignature(rawBody, signatureHeader, testSecret);
      expect(isValid).to.be.false;
    });

    it("rejects missing signature headers", () => {
      const rawBody = JSON.stringify({ eventId: "evt_test" });
      expect(verifyPaddleSignature(rawBody, "", testSecret)).to.be.false;
      expect(verifyPaddleSignature("", "ts=123;h1=abc", testSecret)).to.be.false;
    });
  });

  describe("Event Processing & Entitlements", () => {
    it("1. new standard (LIVE): grants isPro=true and subscriptionTier='standard'", async () => {
      const event = {
        eventId: "evt_new_std_live_001",
        eventType: "transaction.completed",
        data: {
          id: "txn_001",
          status: "completed",
          customData: { userId: "user_test_std" },
          items: [{ price: { id: LIVE_PRICE_IDS.STANDARD_ANNUAL } }],
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

      // Verify idempotency record written AFTER user doc
      const eventDoc = mockDb.getData("paddle_events/evt_new_std_live_001");
      expect(eventDoc).to.exist;
    });

    it("2. new standard (SANDBOX): recognizes sandbox price ID and sets standard tier", async () => {
      const event = {
        eventId: "evt_new_std_sandbox_002",
        eventType: "transaction.completed",
        data: {
          id: "txn_sdbx_002",
          status: "completed",
          customData: { userId: "user_sdbx_std" },
          items: [{ price: { id: SANDBOX_PRICE_IDS.STANDARD_MONTHLY } }],
          currentBillingPeriod: { endsAt: "2026-12-26T00:00:00Z" },
        },
      };

      const result = await handlePaddleWebhookEvent(event, mockDb as any);
      expect(result.status).to.equal("processed");

      const userDoc = mockDb.getData("users/user_sdbx_std");
      expect(userDoc.isPro).to.be.true;
      expect(userDoc.subscriptionTier).to.equal("standard");
    });

    it("3. new premium (LIVE & SANDBOX): grants isPro=true and subscriptionTier='premium'", async () => {
      const eventLive = {
        eventId: "evt_new_prem_live_003",
        eventType: "subscription.created",
        data: {
          id: "sub_prem_003",
          status: "active",
          customData: { userId: "user_prem_live" },
          items: [{ price: { id: LIVE_PRICE_IDS.PREMIUM_ANNUAL } }],
          currentBillingPeriod: { endsAt: "2027-11-26T00:00:00Z" },
        },
      };

      const resLive = await handlePaddleWebhookEvent(eventLive, mockDb as any);
      expect(resLive.status).to.equal("processed");
      const userLive = mockDb.getData("users/user_prem_live");
      expect(userLive.isPro).to.be.true;
      expect(userLive.subscriptionTier).to.equal("premium");

      const eventSandbox = {
        eventId: "evt_new_prem_sdbx_003b",
        eventType: "subscription.created",
        data: {
          id: "sub_prem_sdbx_003b",
          status: "active",
          customData: { userId: "user_prem_sdbx" },
          items: [{ price: { id: SANDBOX_PRICE_IDS.PREMIUM_MONTHLY } }],
          currentBillingPeriod: { endsAt: "2026-12-26T00:00:00Z" },
        },
      };

      const resSdbx = await handlePaddleWebhookEvent(eventSandbox, mockDb as any);
      expect(resSdbx.status).to.equal("processed");
      const userSdbx = mockDb.getData("users/user_prem_sdbx");
      expect(userSdbx.isPro).to.be.true;
      expect(userSdbx.subscriptionTier).to.equal("premium");
    });

    it("4. scheduled cancellation: scheduled_change.action === 'cancel' keeps access until effectiveAt", async () => {
      const effectiveAt = "2027-05-15T00:00:00Z";
      const event = {
        eventId: "evt_sched_cancel_004",
        eventType: "subscription.updated",
        data: {
          id: "sub_sched_004",
          status: "active",
          customData: { userId: "user_sched_cancel" },
          items: [{ price: { id: LIVE_PRICE_IDS.PREMIUM_ANNUAL } }],
          scheduledChange: {
            action: "cancel",
            effectiveAt: effectiveAt,
          },
        },
      };

      const result = await handlePaddleWebhookEvent(event, mockDb as any);
      expect(result.status).to.equal("processed");

      const userDoc = mockDb.getData("users/user_sched_cancel");
      expect(userDoc.isPro).to.be.true;
      expect(userDoc.subscriptionStatus).to.equal("scheduled_cancel");
      expect(userDoc.subscriptionTier).to.equal("premium");
      expect(userDoc.planExpiresAt).to.equal(effectiveAt);
    });

    it("5. subscription.past_due: retains access and marks status 'past_due'", async () => {
      mockDb.store.set("users/user_past_due", {
        isPro: true,
        subscriptionTier: "standard",
        subscriptionStatus: "active",
      });

      const event = {
        eventId: "evt_past_due_005",
        eventType: "subscription.past_due",
        data: {
          id: "sub_pd_005",
          customData: { userId: "user_past_due" },
        },
      };

      const result = await handlePaddleWebhookEvent(event, mockDb as any);
      expect(result.status).to.equal("processed");

      const userDoc = mockDb.getData("users/user_past_due");
      expect(userDoc.isPro).to.be.true;
      expect(userDoc.subscriptionStatus).to.equal("past_due");
    });

    it("6. subscription.paused & resumed: pauses access then re-activates on resume", async () => {
      mockDb.store.set("users/user_pause_resume", {
        isPro: true,
        subscriptionTier: "premium",
        subscriptionStatus: "active",
      });

      // Pause event
      const eventPause = {
        eventId: "evt_paused_006",
        eventType: "subscription.paused",
        data: {
          id: "sub_pr_006",
          customData: { userId: "user_pause_resume" },
        },
      };

      await handlePaddleWebhookEvent(eventPause, mockDb as any);
      const userPaused = mockDb.getData("users/user_pause_resume");
      expect(userPaused.isPro).to.be.false;
      expect(userPaused.subscriptionTier).to.equal("free");
      expect(userPaused.subscriptionStatus).to.equal("paused");

      // Resume event
      const eventResume = {
        eventId: "evt_resumed_006b",
        eventType: "subscription.resumed",
        data: {
          id: "sub_pr_006",
          customData: { userId: "user_pause_resume" },
          items: [{ price: { id: LIVE_PRICE_IDS.PREMIUM_ANNUAL } }],
          currentBillingPeriod: { endsAt: "2027-11-26T00:00:00Z" },
        },
      };

      await handlePaddleWebhookEvent(eventResume, mockDb as any);
      const userResumed = mockDb.getData("users/user_pause_resume");
      expect(userResumed.isPro).to.be.true;
      expect(userResumed.subscriptionTier).to.equal("premium");
      expect(userResumed.subscriptionStatus).to.equal("active");
      expect(userResumed.planExpiresAt).to.equal("2027-11-26T00:00:00Z");
    });

    it("7. strict refund: only approved full refund revokes access; partial or pending refund does not", async () => {
      mockDb.store.set("users/user_refund_test", {
        isPro: true,
        subscriptionTier: "standard",
        subscriptionStatus: "active",
      });

      // 7a. Partial refund: should NOT revoke
      const eventPartial = {
        eventId: "evt_partial_ref_007a",
        eventType: "adjustment.created",
        data: {
          action: "refund",
          status: "approved",
          type: "partial",
          customData: { userId: "user_refund_test" },
          subscriptionId: "sub_ref_007",
        },
      };

      await handlePaddleWebhookEvent(eventPartial, mockDb as any);
      const userAfterPartial = mockDb.getData("users/user_refund_test");
      expect(userAfterPartial.isPro).to.be.true;
      expect(userAfterPartial.subscriptionTier).to.equal("standard");

      // 7b. Pending approval refund: should NOT revoke
      const eventPending = {
        eventId: "evt_pending_ref_007b",
        eventType: "adjustment.created",
        data: {
          action: "refund",
          status: "pending_approval",
          type: "full",
          customData: { userId: "user_refund_test" },
          subscriptionId: "sub_ref_007",
        },
      };

      await handlePaddleWebhookEvent(eventPending, mockDb as any);
      const userAfterPending = mockDb.getData("users/user_refund_test");
      expect(userAfterPending.isPro).to.be.true;
      expect(userAfterPending.subscriptionTier).to.equal("standard");

      // 7c. Approved full refund: DOES revoke
      const eventFullApproved = {
        eventId: "evt_full_ref_007c",
        eventType: "adjustment.created",
        data: {
          action: "refund",
          status: "approved",
          type: "full",
          customData: { userId: "user_refund_test" },
          subscriptionId: "sub_ref_007",
        },
      };

      await handlePaddleWebhookEvent(eventFullApproved, mockDb as any);
      const userAfterApproved = mockDb.getData("users/user_refund_test");
      expect(userAfterApproved.isPro).to.be.false;
      expect(userAfterApproved.subscriptionTier).to.equal("free");
      expect(userAfterApproved.subscriptionStatus).to.equal("refunded");
    });

    it("8. Kanji-only purchase: sets hasKanjiLiar=true without granting Pro (Sandbox & Live)", async () => {
      const eventLive = {
        eventId: "evt_kanji_live_008",
        eventType: "transaction.completed",
        data: {
          id: "txn_kanji_live",
          status: "completed",
          customData: { userId: "user_kanji_live" },
          items: [{ price: { id: LIVE_PRICE_IDS.KANJI_LIAR } }],
        },
      };

      await handlePaddleWebhookEvent(eventLive, mockDb as any);
      const userLive = mockDb.getData("users/user_kanji_live");
      expect(userLive.hasKanjiLiar).to.be.true;
      expect(userLive.isPro).to.be.undefined;

      const eventSandbox = {
        eventId: "evt_kanji_sdbx_008b",
        eventType: "transaction.completed",
        data: {
          id: "txn_kanji_sdbx",
          status: "completed",
          customData: { userId: "user_kanji_sdbx" },
          items: [{ price: { id: SANDBOX_PRICE_IDS.KANJI_LIAR } }],
        },
      };

      await handlePaddleWebhookEvent(eventSandbox, mockDb as any);
      const userSdbx = mockDb.getData("users/user_kanji_sdbx");
      expect(userSdbx.hasKanjiLiar).to.be.true;
      expect(userSdbx.isPro).to.be.undefined;
    });

    it("9. duplicate event: skips already processed event ID", async () => {
      const event = {
        eventId: "evt_dup_009",
        eventType: "transaction.completed",
        data: {
          id: "txn_dup_009",
          status: "completed",
          customData: { userId: "user_dup" },
          items: [{ price: { id: LIVE_PRICE_IDS.STANDARD_ANNUAL } }],
        },
      };

      const first = await handlePaddleWebhookEvent(event, mockDb as any);
      expect(first.status).to.equal("processed");

      const second = await handlePaddleWebhookEvent(event, mockDb as any);
      expect(second.status).to.equal("duplicate");
    });

    it("10. bundle transaction: subscription plus Kanji Liar grants both correctly", async () => {
      const event = {
        eventId: "evt_bundle_010",
        eventType: "transaction.completed",
        data: {
          id: "txn_bundle_010",
          status: "completed",
          customData: { userId: "user_bundle" },
          items: [
            { price: { id: LIVE_PRICE_IDS.STANDARD_ANNUAL } },
            { price: { id: LIVE_PRICE_IDS.KANJI_LIAR } },
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

    it("11. unknown price ID: grants nothing and records ignored", async () => {
      const event = {
        eventId: "evt_unknown_011",
        eventType: "transaction.completed",
        data: {
          id: "txn_unknown_011",
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
});
