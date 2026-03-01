const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'es_b1_m1': 'After this, you can express complex emotions, discuss relationship dynamics, and resolve social conflicts.',
    'es_b1_m2': 'After this, you can discuss the impact of social media, understand digital trends, and critique online news.',
    'es_b1_m3': 'After this, you can navigate flexible work environments, discuss global mobility, and handle professional networking.',
    'es_b1_m4': 'After this, you can explain Spanish cultural nuances, discuss traditions, and compare international customs.',
    'es_b1_m5': 'After this, you can discuss economic habits, manage financial advice, and debate consumer rights.',
    'es_b1_m6': 'After this, you can discuss lifelong learning, plan career advancements, and handle job interviews.',
    'es_b1_m7': 'After this, you can debate climate policies, propose sustainable solutions, and discuss future technology.',
    'es_b1_m8': 'After this, you can navigate the healthcare system, discuss medical ethics, and explain complex wellness goals.',
    'es_b1_m9': 'After this, you can engage in political discussions, understand civic duties, and debate societal reforms.',
    'es_b1_m10': 'After this, you will have mastered B1 and can use advanced Spanish idioms to express your personality fluently.',
};

async function patchSpanishB1Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Spanish B1 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/spanish/levels/b1/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Spanish B1 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchSpanishB1Outcomes();
