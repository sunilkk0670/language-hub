const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Outcome strings for each English A2 module
const outcomes = {
    'en_a2_m01': "After this, you can tell stories about your past, share memories, and describe key life events.",
    'en_a2_m02': "After this, you can talk about your upcoming goals, make arrangements, and discuss future dreams.",
    'en_a2_m03': "After this, you can compare items, express what you like most, and justify your choices.",
    'en_a2_m04': "After this, you can articulate how you feel and give your personal perspective on various topics.",
    'en_a2_m05': "After this, you can describe different environments and talk confidently about your work setting.",
    'en_a2_m06': "After this, you can navigate international travel, book tickets, and explain transit routes.",
    'en_a2_m07': "After this, you can engage in polite small talk, accept or decline invitations, and meet new people.",
    'en_a2_m08': "After this, you can discuss your favorite movies, books, and digital media in detail.",
    'en_a2_m09': "After this, you can describe the natural world, talk about the weather, and discuss environmental topics.",
    'en_a2_m10': "After this, you can discuss complex ideas and use the language skills needed for everyday problem-solving.",
};

async function patchOutcomes() {
    try {
        console.log('🚀 Patching outcome fields for English A2 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/english/levels/a2/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued update for ${moduleId}: \"${outcome}\"`);
        }

        await batch.commit();

        console.log('\n✅ All 10 English A2 modules patched with outcome field successfully!');
    } catch (error) {
        console.error('❌ Error patching outcomes:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchOutcomes();
