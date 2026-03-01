const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'sa_b1_m01': 'After this, you can analyze complex epic verses and understand the sophisticated syntax of classical literature.',
    'sa_b1_m02': 'After this, you can engage in formal Sanskrit debates and master the logic of classical philosophical schools.',
    'sa_b1_m03': 'After this, you can explore traditional scientific treatises and understand ancient mathematical concepts.',
    'sa_b1_m04': 'After this, you can discuss classical political strategy, ethical governance, and statecraft (Arthashastra).',
    'sa_b1_m05': 'After this, you can explore the nature of reality and study advanced metaphysical concepts in the Vedanta tradition.',
    'sa_b1_m06': 'After this, you can understand the linguistic structure of rituals and the depth of spiritual terminology.',
    'sa_b1_m07': 'After this, you can master the intricate rules of Paninian grammar and the evolution of Sanskrit words.',
    'sa_b1_m08': 'After this, you can describe classical art forms and discuss the symbolic language of sacred iconography.',
    'sa_b1_m09': 'After this, you can explore the theory behind classical music and the aesthetics of traditional performance.',
    'sa_b1_m10': 'After this, you will have mastered B1 and can explore ancient theories of the universe and higher consciousness.',
};

async function patchSanskritB1Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Sanskrit B1 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/sanskrit/levels/b1/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Sanskrit B1 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchSanskritB1Outcomes();
