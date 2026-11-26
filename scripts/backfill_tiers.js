/**
 * backfill_tiers.js
 * 
 * Standalone migration script to inspect and backfill `subscriptionTier` and `hasKanjiLiar`
 * for existing users who have `isPro == true`.
 * 
 * SAFETY:
 * - Runs in DRY-RUN mode by default! No changes will be written to Firestore unless
 *   explicitly executed with the `--execute` flag.
 * - Never runs automatically.
 * 
 * USAGE:
 *   Dry run:
 *     node scripts/backfill_tiers.js
 * 
 *   Execute for real:
 *     node scripts/backfill_tiers.js --execute
 * 
 * PREREQUISITES:
 *   - GOOGLE_APPLICATION_CREDENTIALS pointing to service account key, or running in an environment
 *     with default Firebase Admin access.
 *   - PADDLE_API_KEY environment variable (Paddle API read access).
 */

const admin = require('firebase-admin');
const { Paddle, Environment, LogLevel } = require('@paddle/paddle-node-sdk');

// Configuration
const PADDLE_PRICES = {
  STANDARD_ANNUAL:  'pri_01m0735ydpvg1awa1g4p8ecvw1',
  STANDARD_MONTHLY: 'pri_01m072z30dswgwqkbf54q92bb3',
  PREMIUM_ANNUAL:   'pri_01m073eqm3p2dteyfx16ptsc82',
  PREMIUM_MONTHLY:  'pri_01m073bwfc4y5sm6m52x25jwhh',
  KANJI_LIAR:       'pri_01m073vc2nfejgqxzsmsctktx3j',
};

const isExecute = process.argv.includes('--execute');

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

const apiKey = process.env.PADDLE_API_KEY || '';
let paddle = null;
if (apiKey) {
  const isSandbox = apiKey.includes('sdbx');
  paddle = new Paddle(apiKey, {
    environment: isSandbox ? Environment.sandbox : Environment.production,
    logLevel: LogLevel.error,
  });
}

async function runBackfill() {
  console.log('===============================================================');
  console.log(`ChirPolly Subscription Tier Backfill [${isExecute ? 'LIVE EXECUTION' : 'DRY-RUN MODE'}]`);
  console.log('===============================================================');
  if (!isExecute) {
    console.log('NOTE: Dry-run only. No writes will occur. Pass --execute to apply changes.\n');
  }

  const usersSnapshot = await db.collection('users').where('isPro', '==', true).get();
  console.log(`Found ${usersSnapshot.size} user(s) with isPro == true.\n`);

  const results = {
    totalScanned: usersSnapshot.size,
    toPremium: [],
    toStandardDetermined: [],
    toStandardFallback: [],
    noPaddleCustomer: [], // (a) isPro with no Paddle customer
    kanjiLiarOnly: [],     // (b) Only purchase was Kanji Liar
    alreadyMigrated: [],
  };

  for (const doc of usersSnapshot.docs) {
    const user = doc.data();
    const uid = doc.id;
    const email = user.email || 'no-email';
    const existingTier = user.subscriptionTier;
    const subscriptionId = user.subscriptionId;
    const customerId = user.customerId;

    // Check if user already has an explicit, non-free tier
    if (existingTier === 'premium' || (existingTier === 'standard' && user.hasKanjiLiar !== undefined)) {
      results.alreadyMigrated.push({ uid, email, tier: existingTier });
      continue;
    }

    let determinedTier = null;
    let hasKanji = user.hasKanjiLiar || false;
    let paddleFound = false;

    if (paddle) {
      try {
        // 1. Try finding subscription by subscriptionId if present
        if (subscriptionId) {
          const sub = await paddle.subscriptions.get(subscriptionId);
          if (sub) {
            paddleFound = true;
            for (const item of sub.items) {
              const pId = item.price ? item.price.id : item.priceId;
              if (pId === PADDLE_PRICES.PREMIUM_ANNUAL || pId === PADDLE_PRICES.PREMIUM_MONTHLY) {
                determinedTier = 'premium';
              } else if (pId === PADDLE_PRICES.STANDARD_ANNUAL || pId === PADDLE_PRICES.STANDARD_MONTHLY) {
                if (!determinedTier) determinedTier = 'standard';
              } else if (pId === PADDLE_PRICES.KANJI_LIAR) {
                hasKanji = true;
              }
            }
          }
        }

        // 2. Try looking up by customer email or customerId if not found yet
        if (!paddleFound && customerId) {
          const subCollection = await paddle.subscriptions.list({ customerId: [customerId] });
          const subs = await subCollection.next();
          if (subs && subs.length > 0) {
            paddleFound = true;
            for (const s of subs) {
              for (const item of s.items) {
                const pId = item.price ? item.price.id : item.priceId;
                if (pId === PADDLE_PRICES.PREMIUM_ANNUAL || pId === PADDLE_PRICES.PREMIUM_MONTHLY) {
                  determinedTier = 'premium';
                } else if (pId === PADDLE_PRICES.STANDARD_ANNUAL || pId === PADDLE_PRICES.STANDARD_MONTHLY) {
                  if (!determinedTier) determinedTier = 'standard';
                } else if (pId === PADDLE_PRICES.KANJI_LIAR) {
                  hasKanji = true;
                }
              }
            }
          }
        }
      } catch (err) {
        // Paddle lookup failed or not found
      }
    }

    // Classify user
    if (hasKanji && !determinedTier) {
      // (b) User whose ONLY purchase was Kanji Liar (erroneously marked isPro in legacy code)
      results.kanjiLiarOnly.push({ uid, email, currentTier: existingTier });
      if (isExecute) {
        await doc.ref.set({
          isPro: false,
          subscriptionTier: 'free',
          hasKanjiLiar: true,
        }, { merge: true });
      }
    } else if (determinedTier === 'premium') {
      results.toPremium.push({ uid, email, subscriptionId });
      if (isExecute) {
        await doc.ref.set({
          subscriptionTier: 'premium',
          hasKanjiLiar: hasKanji,
        }, { merge: true });
      }
    } else if (determinedTier === 'standard') {
      results.toStandardDetermined.push({ uid, email, subscriptionId });
      if (isExecute) {
        await doc.ref.set({
          subscriptionTier: 'standard',
          hasKanjiLiar: hasKanji,
        }, { merge: true });
      }
    } else {
      // Undeterminable or no Paddle customer
      if (!paddleFound && !subscriptionId && !customerId) {
        // (a) isPro user with no Paddle customer on record
        results.noPaddleCustomer.push({ uid, email });
      }
      // Safety rule: Fall back to 'standard' so user never loses baseline paid access
      results.toStandardFallback.push({ uid, email });
      if (isExecute) {
        await doc.ref.set({
          subscriptionTier: 'standard',
          hasKanjiLiar: hasKanji,
        }, { merge: true });
      }
    }
  }

  // Print Summary Report
  console.log('--- BACKFILL SUMMARY REPORT ---');
  console.log(`Total isPro users scanned: ${results.totalScanned}`);
  console.log(`Already properly configured: ${results.alreadyMigrated.length}`);
  console.log(`Resolved to 'premium': ${results.toPremium.length}`);
  console.log(`Resolved to 'standard' (Paddle confirmed): ${results.toStandardDetermined.length}`);
  console.log(`Fallback to 'standard' (Undeterminable): ${results.toStandardFallback.length}`);
  console.log(`(a) isPro users with NO Paddle record: ${results.noPaddleCustomer.length}`);
  console.log(`(b) Users whose ONLY purchase was Kanji Liar: ${results.kanjiLiarOnly.length}`);
  console.log('-------------------------------\n');

  if (results.toPremium.length > 0) {
    console.log('Resolved to Premium:');
    results.toPremium.forEach(u => console.log(`  - [${u.uid}] ${u.email} (sub: ${u.subscriptionId})`));
  }
  if (results.toStandardFallback.length > 0) {
    console.log('Fallback to Standard (Undeterminable):');
    results.toStandardFallback.forEach(u => console.log(`  - [${u.uid}] ${u.email}`));
  }
  if (results.noPaddleCustomer.length > 0) {
    console.log('(a) isPro users with NO Paddle record on file:');
    results.noPaddleCustomer.forEach(u => console.log(`  - [${u.uid}] ${u.email}`));
  }
  if (results.kanjiLiarOnly.length > 0) {
    console.log('(b) Users whose ONLY purchase was Kanji Liar (reset to free + hasKanjiLiar: true):');
    results.kanjiLiarOnly.forEach(u => console.log(`  - [${u.uid}] ${u.email}`));
  }

  console.log(`\nBackfill script finished. Mode: ${isExecute ? 'EXECUTED' : 'DRY-RUN ONLY'}.`);
}

runBackfill().catch(err => {
  console.error('Backfill script encountered an error:', err);
  process.exit(1);
});
