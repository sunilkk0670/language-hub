import { describe, it, before, after, beforeEach } from "mocha";
import * as fs from "fs";
import * as path from "path";
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";

describe("Firestore Security Rules Unit Tests", () => {
  let testEnv: RulesTestEnvironment;

  before(async () => {
    const rules = fs.readFileSync(path.resolve(__dirname, "../../firestore.rules"), "utf8");
    testEnv = await initializeTestEnvironment({
      projectId: "chirpolly-security-test",
      firestore: {
        rules: rules,
        host: "127.0.0.1",
        port: 8080,
      },
    });
  });

  after(async () => {
    if (testEnv) {
      await testEnv.cleanup();
    }
  });

  beforeEach(async () => {
    if (testEnv) {
      await testEnv.clearFirestore();
    }
  });

  it("1. new-user signup: user can create own profile document with default fields", async () => {
    const aliceAuth = testEnv.authenticatedContext("alice_uid");
    const aliceDb = aliceAuth.firestore();

    await assertSucceeds(
      aliceDb.collection("users").doc("alice_uid").set({
        uid: "alice_uid",
        email: "alice@example.com",
        displayName: "Alice",
        createdAt: new Date().toISOString(),
      })
    );
  });

  it("2. cannot set own isPro, subscriptionTier, or hasKanjiLiar on creation", async () => {
    const attackerAuth = testEnv.authenticatedContext("attacker_uid");
    const attackerDb = attackerAuth.firestore();

    // Attempting to self-grant isPro
    await assertFails(
      attackerDb.collection("users").doc("attacker_uid").set({
        uid: "attacker_uid",
        email: "attacker@example.com",
        isPro: true,
      })
    );

    // Attempting to self-grant premium tier
    await assertFails(
      attackerDb.collection("users").doc("attacker_uid").set({
        uid: "attacker_uid",
        email: "attacker@example.com",
        subscriptionTier: "premium",
      })
    );

    // Attempting to self-grant hasKanjiLiar
    await assertFails(
      attackerDb.collection("users").doc("attacker_uid").set({
        uid: "attacker_uid",
        email: "attacker@example.com",
        hasKanjiLiar: true,
      })
    );
  });

  it("3. cannot update own isPro, subscriptionTier, or hasKanjiLiar", async () => {
    // Seed initial user document via admin context
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection("users").doc("bob_uid").set({
        uid: "bob_uid",
        email: "bob@example.com",
        isPro: false,
        subscriptionTier: "free",
        hasKanjiLiar: false,
      });
    });

    const bobAuth = testEnv.authenticatedContext("bob_uid");
    const bobDb = bobAuth.firestore();

    // Updating isPro should fail
    await assertFails(
      bobDb.collection("users").doc("bob_uid").update({
        isPro: true,
      })
    );

    // Updating subscriptionTier should fail
    await assertFails(
      bobDb.collection("users").doc("bob_uid").update({
        subscriptionTier: "premium",
      })
    );

    // Updating hasKanjiLiar should fail
    await assertFails(
      bobDb.collection("users").doc("bob_uid").update({
        hasKanjiLiar: true,
      })
    );
  });

  it("4. can update displayName and progress", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection("users").doc("carol_uid").set({
        uid: "carol_uid",
        email: "carol@example.com",
        displayName: "Carol Old",
        isPro: false,
        subscriptionTier: "free",
      });
    });

    const carolAuth = testEnv.authenticatedContext("carol_uid");
    const carolDb = carolAuth.firestore();

    // Update displayName
    await assertSucceeds(
      carolDb.collection("users").doc("carol_uid").update({
        displayName: "Carol New",
      })
    );

    // Write to progress subcollection
    await assertSucceeds(
      carolDb
        .collection("users")
        .doc("carol_uid")
        .collection("progress")
        .doc("japanese")
        .set({
          level: "a1",
          currentModule: 2,
          lastCompletedAt: new Date().toISOString(),
        })
    );
  });

  it("5. cannot read another user's document", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection("users").doc("dave_uid").set({
        uid: "dave_uid",
        email: "dave@example.com",
        displayName: "Dave Private",
      });
    });

    const eveAuth = testEnv.authenticatedContext("eve_uid");
    const eveDb = eveAuth.firestore();

    // Eve trying to read Dave's document should fail
    await assertFails(eveDb.collection("users").doc("dave_uid").get());
  });

  it("6. cannot exceed tier cap for AI usage", async () => {
    // Seed free user (cap = 5)
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection("users").doc("frank_free").set({
        uid: "frank_free",
        email: "frank@example.com",
        isPro: false,
        subscriptionTier: "free",
      });
    });

    const frankAuth = testEnv.authenticatedContext("frank_free");
    const frankDb = frankAuth.firestore();
    const today = "2026-11-26";

    // 1st request: valid (requestCount: 1 <= 5)
    await assertSucceeds(
      frankDb
        .collection("users")
        .doc("frank_free")
        .collection("ai_usage")
        .doc(today)
        .set({
          userId: "frank_free",
          date: today,
          requestCount: 1,
          dailyLimit: 9999, // dailyLimit tampering ignored by rule
        })
    );

    // Jump straight to 6 (exceeds free tier cap 5)
    await assertFails(
      frankDb
        .collection("users")
        .doc("frank_free")
        .collection("ai_usage")
        .doc(today)
        .set({
          userId: "frank_free",
          date: today,
          requestCount: 6,
        })
    );
  });
});
