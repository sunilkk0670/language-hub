const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'hi_b1_m01': 'After this, you can discuss complex spiritual concepts, moral dilemmas, and Indian philosophy.',
    'hi_b1_m02': 'After this, you can understand legal systems, discuss public policy, and navigate administrative tasks.',
    'hi_b1_m03': 'After this, you can analyze market trends, discuss global trade, and handle professional negotiations.',
    'hi_b1_m04': 'After this, you can appreciate Hindi literature, analyze classical poetry, and express artistic critiques.',
    'hi_b1_m05': 'After this, you can discuss mental processes, behavioral patterns, and the science of the mind.',
    'hi_b1_m06': 'After this, you can engage in diplomatic discourse and discuss international affairs and geopolitics.',
    'hi_b1_m07': 'After this, you can discuss historical artifacts, ancient inscriptions, and the roots of civilization.',
    'hi_b1_m08': 'After this, you can debate ecological conservation and propose solutions for environmental sustainability.',
    'hi_b1_m09': 'After this, you can discuss theories of the universe, astronomical phenomena, and abstract physics.',
    'hi_b1_m10': 'After this, you will have mastered the B1 level and can use complex idioms to speak with native-like depth.',
};

async function patchHindiB1Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Hindi B1 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/hindi/levels/b1/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Hindi B1 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchHindiB1Outcomes();
