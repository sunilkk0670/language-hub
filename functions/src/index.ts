import * as functions from "firebase-functions/v2";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

// Retrieve environment secrets
const PADDLE_API_KEY = process.env.PADDLE_API_KEY || "";
const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET || "";

// Initialize Paddle SDK
const paddle = new Paddle(PADDLE_API_KEY, {
  environment: Environment.sandbox, // Use sandbox for development
  logLevel: LogLevel.error,
});

/**
 * HTTP Cloud Function to handle Paddle Webhooks
 * We use the v2 API which allows us to access the raw request body.
 */
export const paddleWebhook = functions.https.onRequest(async (req, res) => {
  // 1. Verify the request is a POST request
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  // 2. Get the signature from headers
  const signature = req.headers["paddle-signature"];
  if (typeof signature !== "string") {
    res.status(400).send("Missing Paddle Signature");
    return;
  }

  try {
    // 3. Unmarshal and verify the webhook signature using the RAW body
    const rawBody = (req as any).rawBody.toString();
    const event = paddle.webhooks.unmarshal(rawBody, PADDLE_WEBHOOK_SECRET, signature);

    if (!event) {
      res.status(400).send("Failed to unmarshal event");
      return;
    }

    console.log(`Received Paddle event: ${event.eventType} (ID: ${event.eventId})`);

    // 4. Extract data and customData
    const eventData = event.data as any;
    const customData = eventData.customData || {};
    const userId = customData.userId;

    if (!userId) {
      console.log(`No userId found in customData for event ${event.eventId}. Skipping user update.`);
      res.status(200).send("OK (No userId)");
      return;
    }

    // 5. Handle relevant events idempotently
    switch (event.eventType) {
      case "transaction.completed":
      case "subscription.created":
      case "subscription.updated": {
        // We look for a subscription ID. A transaction might result in a subscription.
        const subscriptionId = eventData.subscriptionId || (event.eventType.startsWith("subscription") ? eventData.id : null);
        const status = eventData.status || "completed";
        
        // Active or trailing statuses usually mean they are pro.
        const isPro = status === "active" || status === "trialing" || status === "completed" || status === "past_due";
        
        await db.collection("users").doc(userId).set({
          isPro: isPro,
          subscriptionId: subscriptionId || null,
          subscriptionStatus: status,
        }, { merge: true });
        
        console.log(`Updated user ${userId} to Pro=${isPro}, SubId=${subscriptionId}`);
        break;
      }
      
      case "subscription.canceled": {
        await db.collection("users").doc(userId).set({
          isPro: false,
          subscriptionStatus: "canceled",
        }, { merge: true });
        
        console.log(`Canceled subscription for user ${userId}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.eventType}`);
    }

    // Always return 200 OK to acknowledge receipt
    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook verification failed:", error);
    res.status(400).send("Webhook verification failed");
  }
});

/**
 * Callable Function to create a Customer Portal Session
 */
export const createCustomerPortalSession = functions.https.onCall(async (request) => {
  // 1. Check if user is authenticated
  if (!request.auth || !request.auth.uid) {
    throw new functions.https.HttpsError("unauthenticated", "User must be logged in to access the portal.");
  }

  const userId = request.auth.uid;

  try {
    // 2. Fetch the user's subscription or customer details from Firestore
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError("not-found", "User document not found.");
    }

    const userData = userDoc.data() || {};
    const subscriptionId = userData.subscriptionId;
    const customerId = userData.customerId; // Optional: If we save customerId during checkout

    if (!subscriptionId && !customerId) {
      throw new functions.https.HttpsError("failed-precondition", "No active subscription found for this user.");
    }

    // 3. Fetch the subscription to get management URLs
    if (!subscriptionId) {
       throw new functions.https.HttpsError("failed-precondition", "No active subscription found for this user.");
    }

    const subscription = await paddle.subscriptions.get(subscriptionId);

    // 4. Return the management URL to the client
    return {
      url: subscription.managementUrls?.updatePaymentMethod || subscription.managementUrls?.cancel || "", 
    };
  } catch (error) {
    console.error("Error creating portal session:", error);
    throw new functions.https.HttpsError("internal", "Failed to create portal session.");
  }
});
