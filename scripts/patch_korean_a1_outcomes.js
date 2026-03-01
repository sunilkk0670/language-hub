const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'ko_a1_m01': 'After this, you can use proper honorifics, greet locals, and introduce yourself politely.',
    'ko_a1_m02': 'After this, you can talk about your family and use the correct Korean titles for people.',
    'ko_a1_m03': 'After this, you can order at a restaurant and follow traditional Korean dining manners.',
    'ko_a1_m04': 'After this, you can master Korean counting units and handle shopping transactions in Won.',
    'ko_a1_m05': 'After this, you can tell the time and describe your daily schedule using essential verbs.',
    'ko_a1_m06': 'After this, you can navigate Korean streets, ask for directions, and find your way around.',
    'ko_a1_m07': 'After this, you can discuss your favorite activities and what you enjoy doing in your free time.',
    'ko_a1_m08': 'After this, you can talk about the climate and describe Korea\'s distinct four seasons.',
    'ko_a1_m09': 'After this, you can name body parts and describe basic health concerns or feelings.',
    'ko_a1_m10': 'After this, you will have completed A1 and be ready for basic everyday interactions in Korea.',
};

async function patchKoreanA1Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Korean A1 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/korean/levels/a1/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Korean A1 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchKoreanA1Outcomes();
