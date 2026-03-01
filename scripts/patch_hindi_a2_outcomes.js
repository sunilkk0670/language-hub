const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'hi_a2_m01': 'After this, you can navigate diverse travel scenarios and discuss various modes of transport.',
    'hi_a2_m02': 'After this, you can communicate in professional settings and understand Hindi office etiquette.',
    'hi_a2_m03': 'After this, you can discuss academic topics, learning goals, and educational experiences.',
    'hi_a2_m04': 'After this, you can explain health concerns, understand medical advice, and navigate pharmacies.',
    'hi_a2_m05': 'After this, you can share your interests, discuss sports, and engage in various leisure activities.',
    'hi_a2_m06': 'After this, you can understand news reports, discuss media trends, and navigate the digital world.',
    'hi_a2_m07': 'After this, you can discuss environmental issues, describe landscapes, and talk about nature.',
    'hi_a2_m08': 'After this, you can appreciate Hindi arts, discuss cultural traditions, and explore historical facts.',
    'hi_a2_m09': 'After this, you can discuss technological advancements and understand basic scientific concepts.',
    'hi_a2_m10': 'After this, you will have completed the A2 level and can express yourself on a wide range of topics.',
};

async function patchHindiA2Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Hindi A2 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/hindi/levels/a2/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Hindi A2 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchHindiA2Outcomes();
