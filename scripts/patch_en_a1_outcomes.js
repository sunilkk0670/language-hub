const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Outcome strings for each English A1 module
const outcomes = {
    'en_a1_m01': 'After this, you can identify yourself and others, and use essential sentence structures.',
    'en_a1_m02': 'After this, you can introduce your family and describe what you do for a living.',
    'en_a1_m03': 'After this, you can tell the time and talk about your typical daily schedule.',
    'en_a1_m04': 'After this, you can order a meal, read basic menus, and express food preferences.',
    'en_a1_m05': 'After this, you can navigate your surroundings and ask for or give simple directions.',
    'en_a1_m06': 'After this, you can handle money transactions, ask for prices, and go shopping.',
    'en_a1_m07': 'After this, you can describe the weather and talk about your favorite times of the year.',
    'en_a1_m08': 'After this, you can name parts of the body and explain simple health symptoms.',
    'en_a1_m09': 'After this, you can talk about what you enjoy doing in your free time.',
    'en_a1_m10': 'After this, you can use basic tech terms and handle common travel interactions.',
};

async function patchOutcomes() {
    try {
        console.log('🚀 Patching outcome fields for English A1 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/english/levels/a1/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued update for ${moduleId}: "${outcome}"`);
        }

        await batch.commit();

        console.log('\n✅ All 10 English A1 modules patched with outcome field successfully!');
    } catch (error) {
        console.error('❌ Error patching outcomes:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchOutcomes();
