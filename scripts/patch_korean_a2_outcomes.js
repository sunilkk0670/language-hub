const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'ko_a2_m01': 'After this, you can navigate complex social situations and use advanced politeness levels.',
    'ko_a2_m02': 'After this, you can discuss your professional life and handle basic office communication in Korean.',
    'ko_a2_m03': 'After this, you can manage intercity travel and navigate diverse transportation modes comfortably.',
    'ko_a2_m04': 'After this, you can describe your living space and discuss real estate or moving in Korea.',
    'ko_a2_m05': 'After this, you can explain physical symptoms in detail and seek specific medical assistance.',
    'ko_a2_m06': 'After this, you can handle detailed shopping queries and manage everyday errands with ease.',
    'ko_a2_m07': 'After this, you can understand K-drama snippets, discuss movies, and follow trending Korean media.',
    'ko_a2_m08': 'After this, you can describe landscapes and engage in simple discussions about sustainability.',
    'ko_a2_m09': 'After this, you can use digital terminology and discuss modern technology and messaging trends.',
    'ko_a2_m10': 'After this, you will have mastered A2 and can discuss Korean holidays, customs, and traditional values.',
};

async function patchKoreanA2Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Korean A2 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/korean/levels/a2/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Korean A2 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchKoreanA2Outcomes();
