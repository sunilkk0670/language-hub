import * as functions from "firebase-functions/v2";
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";
import * as crypto from "crypto";

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp();
}
const db = getFirestore();

// Retrieve environment secrets
const PADDLE_API_KEY = () => process.env.PADDLE_API_KEY || "";
const PADDLE_WEBHOOK_SECRET = () => process.env.PADDLE_WEBHOOK_SECRET || "";

// LIVE Paddle Price IDs
export const LIVE_PRICE_IDS = {
  STANDARD_MONTHLY: "pri_01m072z30dswgwqkbf54q92bb3",
  STANDARD_ANNUAL:  "pri_01m0735ydpvg1awa1g4p8ecvw1",
  PREMIUM_MONTHLY:  "pri_01m073bwfc4y5sm6m52x25jwhh",
  PREMIUM_ANNUAL:   "pri_01m073eqm3p2dteyfx16ptsc82",
  KANJI_LIAR:       "pri_01m073vc2nfejgqxzsmsctktx3j",
};

// SANDBOX Paddle Price IDs
export const SANDBOX_PRICE_IDS = {
  STANDARD_MONTHLY: "pri_01kzqeheharqanpynxcggdzcfa",
  STANDARD_ANNUAL:  "pri_01kzqehevbgw84djd650vdbchj",
  PREMIUM_MONTHLY:  "pri_01kzqehfgpmc9m8tgx9rky2h9c",
  PREMIUM_ANNUAL:   "pri_01kzqehftf246rapzhfh23an91",
  KANJI_LIAR:       "pri_01kzqehgctn7wn5awajj4tdc6z",
};

// Compatibility export
export const PADDLE_PRICES = LIVE_PRICE_IDS;

export function getPriceIdsForEnvironment(apiKey: string = PADDLE_API_KEY()): typeof LIVE_PRICE_IDS {
  const isSandbox = apiKey.startsWith("test_") || apiKey.includes("sdbx");
  return isSandbox ? SANDBOX_PRICE_IDS : LIVE_PRICE_IDS;
}

export function isKnownPriceId(priceId: string): boolean {
  return (
    Object.values(LIVE_PRICE_IDS).includes(priceId) ||
    Object.values(SANDBOX_PRICE_IDS).includes(priceId)
  );
}

export function resolvePriceTier(priceId: string): "standard" | "premium" | "kanji_liar" | null {
  if (
    priceId === LIVE_PRICE_IDS.STANDARD_ANNUAL ||
    priceId === LIVE_PRICE_IDS.STANDARD_MONTHLY ||
    priceId === SANDBOX_PRICE_IDS.STANDARD_ANNUAL ||
    priceId === SANDBOX_PRICE_IDS.STANDARD_MONTHLY
  ) {
    return "standard";
  }
  if (
    priceId === LIVE_PRICE_IDS.PREMIUM_ANNUAL ||
    priceId === LIVE_PRICE_IDS.PREMIUM_MONTHLY ||
    priceId === SANDBOX_PRICE_IDS.PREMIUM_ANNUAL ||
    priceId === SANDBOX_PRICE_IDS.PREMIUM_MONTHLY
  ) {
    return "premium";
  }
  if (
    priceId === LIVE_PRICE_IDS.KANJI_LIAR ||
    priceId === SANDBOX_PRICE_IDS.KANJI_LIAR
  ) {
    return "kanji_liar";
  }
  return null;
}

export function extractPriceIds(eventData: any): string[] {
  const ids: string[] = [];
  if (Array.isArray(eventData.items)) {
    for (const item of eventData.items) {
      if (item.price?.id) ids.push(item.price.id);
      else if (item.priceId) ids.push(item.priceId);
      else if (item.price_id) ids.push(item.price_id);
    }
  }
  if (Array.isArray(eventData.details?.lineItems)) {
    for (const item of eventData.details.lineItems) {
      if (item.price?.id) ids.push(item.price.id);
      else if (item.priceId) ids.push(item.priceId);
      else if (item.price_id) ids.push(item.price_id);
    }
  }
  return ids;
}

/**
 * Verify Paddle HMAC-SHA256 signature against the raw webhook request body.
 * Header format: ts=1671552777;h1=0a39...
 */
export function verifyPaddleSignature(
  rawBody: string,
  signatureHeader: string,
  secretKey: string
): boolean {
  if (!rawBody || !signatureHeader || !secretKey) return false;
  try {
    const parts = signatureHeader.split(";").reduce((acc, part) => {
      const [key, val] = part.split("=");
      if (key && val) acc[key.trim()] = val.trim();
      return acc;
    }, {} as Record<string, string>);

    const ts = parts["ts"];
    const h1 = parts["h1"];
    if (!ts || !h1) return false;

    const payloadToSign = `${ts}:${rawBody}`;
    const computed = crypto.createHmac("sha256", secretKey).update(payloadToSign).digest("hex");

    if (computed.length !== h1.length) return false;
    return crypto.timingSafeEqual(Buffer.from(computed, "utf8"), Buffer.from(h1, "utf8"));
  } catch (e) {
    console.error("Error verifying Paddle signature:", e);
    return false;
  }
}

// Lazily initialize Paddle SDK
let _paddle: Paddle | null = null;
export function getPaddle(): Paddle {
  if (!_paddle) {
    const apiKey = PADDLE_API_KEY();
    const isSandbox = apiKey.startsWith("test_") || apiKey.includes("sdbx");
    _paddle = new Paddle(apiKey, {
      environment: isSandbox ? Environment.sandbox : Environment.production,
      logLevel: LogLevel.error,
    });
  }
  return _paddle;
}

/**
 * Core event processing logic isolated for unit testability and idempotency.
 */
export async function handlePaddleWebhookEvent(
  event: any,
  firestoreDb: FirebaseFirestore.Firestore = db
): Promise<{ status: string; message: string }> {
  const eventId = event.eventId;
  const eventType = event.eventType;

  if (!eventId) {
    throw new Error("Missing eventId in event payload");
  }

  // 1. Idempotency Check: check if event was already processed
  const eventRef = firestoreDb.collection("paddle_events").doc(eventId);
  const eventDoc = await eventRef.get();
  if (eventDoc.exists) {
    console.log(`Event ${eventId} (${eventType}) was already processed. Skipping duplicate.`);
    return { status: "duplicate", message: "Event already processed" };
  }

  // 2. Extract event data and customData
  const eventData = event.data || {};
  const customData = eventData.customData || eventData.custom_data || {};
  const userId = customData.userId || customData.user_id;

  if (!userId) {
    console.log(`No userId found in customData for event ${eventId}. Skipping user update.`);
    // Only record idempotency event after skipping
    await eventRef.set({
      eventId,
      eventType,
      processedAt: new Date().toISOString(),
      skipped: true,
      reason: "No userId found",
    });
    return { status: "skipped", message: "No userId found" };
  }

  const userRef = firestoreDb.collection("users").doc(userId);

  // 3. Process events
  switch (eventType) {
    case "transaction.completed":
    case "subscription.created":
    case "subscription.updated": {
      const priceIds = extractPriceIds(eventData);
      console.log(`Event ${eventType} for user ${userId} with price IDs:`, priceIds);

      // Validate unknown price IDs
      const unknownIds = priceIds.filter((id) => !isKnownPriceId(id));
      if (unknownIds.length > 0) {
        console.error(`Unknown price ID(s) received for user ${userId}:`, unknownIds);
      }

      // Check for standalone Kanji Liar add-on purchase
      const boughtKanjiLiar = priceIds.some((id) => resolvePriceTier(id) === "kanji_liar");

      // Determine subscription tier from recognized price IDs
      let subscriptionTier: "standard" | "premium" | null = null;
      if (priceIds.some((id) => resolvePriceTier(id) === "premium")) {
        subscriptionTier = "premium";
      } else if (priceIds.some((id) => resolvePriceTier(id) === "standard")) {
        subscriptionTier = "standard";
      }

      // If price IDs were provided but NONE matched known IDs and no sub event, grant nothing!
      if (
        priceIds.length > 0 &&
        !boughtKanjiLiar &&
        subscriptionTier === null &&
        !eventType.startsWith("subscription")
      ) {
        console.error(`Transaction contains only unknown price IDs (${priceIds.join(", ")}). Granting nothing.`);
        await eventRef.set({
          eventId,
          eventType,
          userId,
          processedAt: new Date().toISOString(),
          error: "Unknown price IDs only",
        });
        return { status: "ignored", message: "Unknown price IDs" };
      }

      // Determine billing period end / plan expiration
      const billingPeriodEndsAt =
        eventData.currentBillingPeriod?.endsAt ||
        eventData.current_billing_period?.ends_at ||
        null;
      const scheduledChange = eventData.scheduledChange || eventData.scheduled_change;
      const scheduledCancelAt =
        scheduledChange && scheduledChange.action === "cancel"
          ? scheduledChange.effectiveAt || scheduledChange.effective_at
          : null;

      const planExpiresAt = scheduledCancelAt || billingPeriodEndsAt || null;

      const subscriptionId =
        eventData.subscriptionId ||
        eventData.subscription_id ||
        (eventType.startsWith("subscription") ? eventData.id : null);
      const rawStatus = eventData.status || "active";

      // Build updates map
      const updates: Record<string, any> = {};

      if (boughtKanjiLiar) {
        updates.hasKanjiLiar = true;
        console.log(`Granting hasKanjiLiar=true to user ${userId}`);
      }

      if (subscriptionTier !== null || eventType.startsWith("subscription")) {
        // Scheduled cancellation handling: status remains active until scheduled cancel date
        if (scheduledCancelAt) {
          updates.isPro = true;
          updates.subscriptionStatus = "scheduled_cancel";
          if (subscriptionTier) updates.subscriptionTier = subscriptionTier;
          updates.planExpiresAt = planExpiresAt;
        } else if (rawStatus === "paused") {
          updates.isPro = false;
          updates.subscriptionTier = "free";
          updates.subscriptionStatus = "paused";
        } else if (rawStatus === "canceled") {
          // Check if current period has ended
          const isExpired = billingPeriodEndsAt ? new Date(billingPeriodEndsAt) <= new Date() : true;
          if (isExpired) {
            updates.isPro = false;
            updates.subscriptionTier = "free";
            updates.subscriptionStatus = "canceled";
          } else {
            updates.isPro = true;
            updates.subscriptionStatus = "canceled";
            updates.planExpiresAt = billingPeriodEndsAt;
          }
        } else {
          // active, trialing, completed, past_due
          const isPro =
            rawStatus === "active" ||
            rawStatus === "trialing" ||
            rawStatus === "completed" ||
            rawStatus === "past_due";
          updates.isPro = isPro;
          updates.subscriptionStatus = rawStatus;
          if (subscriptionTier) {
            updates.subscriptionTier = subscriptionTier;
          }
          if (planExpiresAt) {
            updates.planExpiresAt = planExpiresAt;
          }
        }

        if (subscriptionId) {
          updates.subscriptionId = subscriptionId;
        }
      }

      if (Object.keys(updates).length > 0) {
        // 1. Write user updates FIRST
        await userRef.set(updates, { merge: true });
        console.log(`Updated user ${userId} with:`, updates);
      }
      break;
    }

    case "subscription.past_due": {
      // Payment failure retry in progress; keep access during grace period
      await userRef.set(
        {
          subscriptionStatus: "past_due",
        },
        { merge: true }
      );
      console.log(`Marked subscription past_due for user ${userId}`);
      break;
    }

    case "subscription.paused": {
      // Paused: revoke access
      await userRef.set(
        {
          isPro: false,
          subscriptionTier: "free",
          subscriptionStatus: "paused",
        },
        { merge: true }
      );
      console.log(`Paused subscription for user ${userId}`);
      break;
    }

    case "subscription.resumed": {
      // Resumed: re-activate access
      const priceIds = extractPriceIds(eventData);
      let tier: "standard" | "premium" = "standard";
      if (priceIds.some((id) => resolvePriceTier(id) === "premium")) {
        tier = "premium";
      }
      const endsAt =
        eventData.currentBillingPeriod?.endsAt ||
        eventData.current_billing_period?.ends_at ||
        null;

      await userRef.set(
        {
          isPro: true,
          subscriptionTier: tier,
          subscriptionStatus: "active",
          planExpiresAt: endsAt,
        },
        { merge: true }
      );
      console.log(`Resumed subscription for user ${userId} (Tier=${tier})`);
      break;
    }

    case "subscription.canceled": {
      // In Paddle, check if ends_at is in the future
      const billingPeriodEndsAt =
        eventData.currentBillingPeriod?.endsAt ||
        eventData.current_billing_period?.ends_at ||
        null;
      const isStillInPeriod = billingPeriodEndsAt && new Date(billingPeriodEndsAt) > new Date();

      if (isStillInPeriod) {
        // Customer paid through billing period end; retain access until planExpiresAt
        await userRef.set(
          {
            isPro: true,
            subscriptionStatus: "canceled",
            planExpiresAt: billingPeriodEndsAt,
          },
          { merge: true }
        );
        console.log(`Subscription canceled for user ${userId}, access valid until ${billingPeriodEndsAt}`);
      } else {
        // Immediate cancellation / already expired
        await userRef.set(
          {
            isPro: false,
            subscriptionTier: "free",
            subscriptionStatus: "canceled",
            planExpiresAt: null,
          },
          { merge: true }
        );
        console.log(`Canceled subscription for user ${userId} (Access immediately revoked)`);
      }
      break;
    }

    case "adjustment.created":
    case "adjustment.updated": {
      // Strict refund handling: only revoke access when action === 'refund' AND status === 'approved'
      // and verify it is a full refund rather than a partial adjustment/credit.
      const action = eventData.action; // 'refund' | 'chargeback' | 'credit'
      const status = eventData.status; // 'pending_approval' | 'approved' | 'rejected' | 'reversed'
      const isPartial = eventData.type === "partial";

      if (action !== "refund" && action !== "chargeback") {
        console.log(`Ignoring adjustment event with non-refund action: ${action}`);
        break;
      }

      if (status !== "approved" && status !== undefined && status !== null) {
        console.log(`Adjustment for user ${userId} is not approved (status: ${status}). Skipping revocation.`);
        break;
      }

      if (isPartial) {
        console.log(`Adjustment for user ${userId} is a partial refund. Retaining active subscription access.`);
        break;
      }

      console.log(`Processing approved full ${action} adjustment for user ${userId}`);
      const priceIds = extractPriceIds(eventData);
      const updates: Record<string, any> = {};

      if (priceIds.some((id) => resolvePriceTier(id) === "kanji_liar")) {
        updates.hasKanjiLiar = false;
        console.log(`Revoking Kanji Liar add-on for refunded user ${userId}`);
      }

      const isSubRefund =
        eventData.subscriptionId ||
        priceIds.some((id) => {
          const t = resolvePriceTier(id);
          return t === "standard" || t === "premium";
        });

      if (isSubRefund || (!updates.hasKanjiLiar && priceIds.length === 0)) {
        updates.isPro = false;
        updates.subscriptionTier = "free";
        updates.subscriptionStatus = "refunded";
        updates.planExpiresAt = null;
        console.log(`Revoking subscription for refunded user ${userId}`);
      }

      if (Object.keys(updates).length > 0) {
        await userRef.set(updates, { merge: true });
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${eventType}`);
  }

  // 4. Mark event as processed ONLY AFTER user document update succeeds (ensures retries work on failure)
  await eventRef.set({
    eventId,
    eventType,
    userId,
    processedAt: new Date().toISOString(),
  });

  return { status: "processed", message: `Event ${eventId} handled successfully` };
}

/**
 * HTTP Cloud Function to handle Paddle Webhooks
 */
export const paddleWebhook = functions.https.onRequest(
  { secrets: ["PADDLE_API_KEY", "PADDLE_WEBHOOK_SECRET"] },
  async (req, res) => {
    // 1. Verify POST
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    // 2. Verify signature header
    const signature = req.headers["paddle-signature"];
    if (typeof signature !== "string") {
      res.status(400).send("Missing Paddle Signature");
      return;
    }

    try {
      // 3. Verify signature on RAW body before parsing
      const rawBody = (req as any).rawBody.toString();
      const secret = PADDLE_WEBHOOK_SECRET();

      const isValid = verifyPaddleSignature(rawBody, signature, secret);
      if (!isValid) {
        console.error("Invalid Paddle signature received");
        res.status(400).send("Invalid Paddle Signature");
        return;
      }

      const event = JSON.parse(rawBody);

      if (!event || !event.eventId || !event.eventType) {
        res.status(400).send("Malformed event payload");
        return;
      }

      console.log(`Received valid Paddle event: ${event.eventType} (ID: ${event.eventId})`);

      // 4. Delegate to business logic handler
      await handlePaddleWebhookEvent(event);

      res.status(200).send("OK");
    } catch (error) {
      console.error("Webhook processing failed:", error);
      res.status(500).send("Webhook processing error");
    }
  }
);

/**
 * Callable Function to create a Customer Portal Session
 */
export const createCustomerPortalSession = functions.https.onCall(
  { secrets: ["PADDLE_API_KEY"] },
  async (request) => {
    if (!request.auth || !request.auth.uid) {
      throw new functions.https.HttpsError("unauthenticated", "User must be logged in to access the portal.");
    }

    const userId = request.auth.uid;

    try {
      const userDoc = await db.collection("users").doc(userId).get();
      if (!userDoc.exists) {
        throw new functions.https.HttpsError("not-found", "User document not found.");
      }

      const userData = userDoc.data() || {};
      const subscriptionId = userData.subscriptionId;

      if (!subscriptionId) {
        throw new functions.https.HttpsError("failed-precondition", "No active subscription found for this user.");
      }

      const subscription = await getPaddle().subscriptions.get(subscriptionId);

      return {
        url: subscription.managementUrls?.updatePaymentMethod || subscription.managementUrls?.cancel || "",
      };
    } catch (error) {
      console.error("Error creating portal session:", error);
      throw new functions.https.HttpsError("internal", "Failed to create portal session.");
    }
  }
);

import * as functionsV1 from "firebase-functions/v1";

/**
 * Auth trigger to send a welcome email when a new user signs up.
 */
export const sendWelcomeEmail = functionsV1.runWith({ secrets: ["RESEND_API_KEY"] }).auth.user().onCreate(
  async (user: functionsV1.auth.UserRecord) => {
    const email = user.email;
    const displayName = user.displayName || "there";

    if (!email) {
      console.log("User does not have an email. Skipping welcome email.");
      return;
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured in environment secrets.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f7f9fc; color: #333333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
            .logo { font-size: 28px; font-weight: bold; color: #6A4CBC; margin-bottom: 24px; text-align: center; }
            .greeting { font-size: 20px; font-weight: 600; margin-bottom: 16px; }
            .body-text { font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 24px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #6A4CBC, #FF6B6B); color: #ffffff !important; padding: 14px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px; text-align: center; box-shadow: 0 4px 6px rgba(106, 76, 188, 0.2); }
            .footer { margin-top: 40px; border-top: 1px solid #eeeeee; padding-top: 20px; font-size: 12px; color: #999999; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">ChirPolly 🦜</div>
            <div class="greeting">Hi ${displayName},</div>
            <p class="body-text">
              Welcome to <strong>ChirPolly</strong>! We are absolutely thrilled to have you join our language learning community. 
              Our mission is to help you master languages naturally through engaging, interactive conversations and real-world exercises.
            </p>
            <p class="body-text">
              To get you started on your journey, we've unlocked the <strong>Level A1 (Beginner)</strong> module for you right away. Start learning today!
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://chirpolly.com" class="cta-button">Get Started with Level A1</a>
            </div>
            <p class="body-text" style="font-size: 14px; color: #777777;">
              If you have any questions or feedback along the way, simply reply to this email. We're here to help!
            </p>
            <div class="footer">
              © ${new Date().getFullYear()} ChirPolly. All rights reserved.<br>
              You received this email because you signed up for ChirPolly.
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const response = await (globalThis as any).fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "ChirPolly <onboarding@resend.dev>",
          to: [email],
          subject: "Welcome to ChirPolly! 🦜",
          html: htmlContent,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Resend API error (${response.status}): ${errorText}`);
      }

      console.log(`Successfully sent welcome email to ${email}`);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }
  }
);
