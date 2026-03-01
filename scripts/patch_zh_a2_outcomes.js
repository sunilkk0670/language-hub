const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Outcome strings for each Chinese A2 module
const outcomes = {
    'zh_a2_m01': 'After this, you can express opinions, describe personalities, and deepen your social bonds.',
    'zh_a2_m02': 'After this, you can describe how you feel, discuss health habits, and visit a doctor.',
    'zh_a2_m03': 'After this, you can discuss cultural traditions and navigate complex travel itineraries.',
    'zh_a2_m04': 'After this, you can talk about your career goals, workplace tasks, and professional skills.',
    'zh_a2_m05': 'After this, you can discuss digital trends, use social media terms, and talk about gadgets.',
    'zh_a2_m06': 'After this, you can discuss current events, community issues, and read simple news reports.',
    'zh_a2_m07': 'After this, you can talk about sustainability, geography, and environmental protection.',
    'zh_a2_m08': 'After this, you can weigh options, give advice, and make confident daily choices.',
    'zh_a2_m09': 'After this, you can appreciate local arts, discuss entertainment, and share your creative interests.',
    'zh_a2_m10': 'After this, you will have completed the A2 level and can confidently handle most daily interactions.',
};

async function patchOutcomes() {
    try {
        console.log('🚀 Patching outcome fields for Chinese A2 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/chinese/levels/a2/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued update for ${moduleId}: "${outcome}"`);
        }

        await batch.commit();

        console.log('\n✅ All 10 Chinese A2 modules patched with outcome field successfully!');
    } catch (error) {
        console.error('❌ Error patching outcomes:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchOutcomes();
