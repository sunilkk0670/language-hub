const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Outcome strings for each Chinese B1 module
const outcomes = {
    'zh_b1_m01': 'After this, you can tell detailed stories, recount past events, and share life experiences.',
    'zh_b1_m02': 'After this, you can debate complex topics, defend your ideas, and express strong beliefs.',
    'zh_b1_m03': 'After this, you can articulate subtle feelings, express empathy, and handle sensitive conversations.',
    'zh_b1_m04': 'After this, you can discuss long-term goals, professional ambitions, and career development.',
    'zh_b1_m05': 'After this, you can discuss modern innovations, scientific concepts, and logical reasoning.',
    'zh_b1_m06': 'After this, you can analyze news reports, discuss social issues, and understand editorial content.',
    'zh_b1_m07': 'After this, you can critique films, discuss artistic styles, and express your creative vision.',
    'zh_b1_m08': 'After this, you can explore historical narratives and discuss deep-rooted cultural philosophies.',
    'zh_b1_m09': 'After this, you can narrate travel adventures and handle unpredictable situations while traveling.',
    'zh_b1_m10': 'After this, you will have mastered the B1 level and can navigate the language with true independence.',
};

async function patchOutcomes() {
    try {
        console.log('🚀 Patching outcome fields for Chinese B1 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/chinese/levels/b1/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued update for ${moduleId}: "${outcome}"`);
        }

        await batch.commit();

        console.log('\n✅ All 10 Chinese B1 modules patched with outcome field successfully!');
    } catch (error) {
        console.error('❌ Error patching outcomes:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchOutcomes();
