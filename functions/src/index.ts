import * as functions from "firebase-functions/v2";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Environment, LogLevel, Paddle } from "@paddle/paddle-node-sdk";

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

// Retrieve environment secrets
const PADDLE_API_KEY = () => process.env.PADDLE_API_KEY || "";
const PADDLE_WEBHOOK_SECRET = () => process.env.PADDLE_WEBHOOK_SECRET || "";

// Lazily initialize Paddle SDK to avoid timeouts during deployment introspection
let _paddle: Paddle | null = null;
function getPaddle(): Paddle {
  if (!_paddle) {
    const apiKey = PADDLE_API_KEY();
    const isSandbox = apiKey.includes("sdbx");
    _paddle = new Paddle(apiKey, {
      environment: isSandbox ? Environment.sandbox : Environment.production,
      logLevel: LogLevel.error,
    });
  }
  return _paddle;
}

/**
 * HTTP Cloud Function to handle Paddle Webhooks
 * We use the v2 API which allows us to access the raw request body.
 */
export const paddleWebhook = functions.https.onRequest(
  { secrets: ["PADDLE_API_KEY", "PADDLE_WEBHOOK_SECRET"] },
  async (req, res) => {
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
    const event = getPaddle().webhooks.unmarshal(rawBody, PADDLE_WEBHOOK_SECRET(), signature);

    if (!event) {
      res.status(400).send("Failed to unmarshal event");
      return;
    }

    console.log(`Received Paddle event: ${event.eventType} (ID: ${event.eventId})`);

    // 4. Extract data and customData
    const eventData = event.data as any;
    const customData = eventData.customData || eventData.custom_data || {};
    const userId = customData.userId || customData.user_id;

    if (!userId) {
      console.log(`No userId found in customData/custom_data for event ${event.eventId}. Skipping user update.`);
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
export const createCustomerPortalSession = functions.https.onCall(
  { secrets: ["PADDLE_API_KEY"] },
  async (request) => {
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

    const subscription = await getPaddle().subscriptions.get(subscriptionId);

    // 4. Return the management URL to the client
    return {
      url: subscription.managementUrls?.updatePaymentMethod || subscription.managementUrls?.cancel || "", 
    };
  } catch (error) {
    console.error("Error creating portal session:", error);
    throw new functions.https.HttpsError("internal", "Failed to create portal session.");
  }
});

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
