const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'sa_a2_m01': 'After this, you can discuss lineage, complex kinship ties, and traditional social roles.',
    'sa_a2_m02': 'After this, you can use sophisticated verb forms to describe continuous and complex actions.',
    'sa_a2_m03': 'After this, you can describe ancient and modern city layouts and discuss travel and transit.',
    'sa_a2_m04': 'After this, you can express deep psychological states and discuss intellectual concepts.',
    'sa_a2_m05': 'After this, you can name detailed body parts and discuss Ayurvedic health principles.',
    'sa_a2_m06': 'After this, you can discuss celestial movements (Jyotisha) and deeper natural phenomena.',
    'sa_a2_m07': 'After this, you can master traditional Vedic units of time and complex mathematical measures.',
    'sa_a2_m08': 'After this, you can understand classical concepts of Dharma, Rajniti, and social order.',
    'sa_a2_m09': 'After this, you can discuss Vedic agricultural practices and the science of traditional cuisine.',
    'sa_a2_m10': 'After this, you will have mastered A2 and can appreciate Sanskrit poetry, drama, and fine arts.',
};

async function patchSanskritA2Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Sanskrit A2 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/sanskrit/levels/a2/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Sanskrit A2 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchSanskritA2Outcomes();
