const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'ita_b1_m01': 'After this, you can narrate complex stories, share detailed memories, and talk about your past in depth.',
    'ita_b1_m02': 'After this, you can express your convictions, argue your point of view, and debate social topics.',
    'ita_b1_m03': 'After this, you can describe subtle emotions, discuss mental well-being, and handle social nuances.',
    'ita_b1_m04': 'After this, you can discuss career ambitions, handle professional interviews, and plan your work future.',
    'ita_b1_m05': 'After this, you can talk about scientific breakthroughs, technological innovations, and the logic of discovery.',
    'ita_b1_m06': 'After this, you can understand Italian news, discuss current affairs, and engage in societal debates.',
    'ita_b1_m07': 'After this, you can critique artistic works, discuss cultural movements, and express your creative side.',
    'ita_b1_m08': 'After this, you can debate environmental policies, sustainability, and the future of our planet.',
    'ita_b1_m09': 'After this, you can manage unconventional travel situations and discuss adventures with native-like detail.',
    'ita_b1_m10': 'After this, you will have mastered Italian B1 and be ready for advanced, fluent communication.',
};

async function patchItalianB1Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Italian B1 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/italian/levels/b1/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Italian B1 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchItalianB1Outcomes();
