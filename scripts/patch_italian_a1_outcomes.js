const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'ita_a1_m01': 'After this, you can master Italian grammar basics, greet locals, and introduce yourself.',
    'ita_a1_m02': 'After this, you can describe your daily activities and use common verbs for everyday tasks.',
    'ita_a1_m03': 'After this, you can handle simple social interactions and describe your surroundings.',
    'ita_a1_m04': 'After this, you can talk about your interests and navigate common places in an Italian city.',
    'ita_a1_m05': 'After this, you can describe your home and confidently handle basic shopping transactions.',
    'ita_a1_m06': 'After this, you can navigate public transport, book travel, and ask for directions in Italian.',
    'ita_a1_m07': 'After this, you can discuss your job, professional background, and education.',
    'ita_a1_m08': 'After this, you can describe how you feel, identify body parts, and talk to a doctor.',
    'ita_a1_m09': 'After this, you can talk about the environment, weather, and the natural beauty of Italy.',
    'ita_a1_m10': 'After this, you will have solidified your A1 foundation and be ready for elementary Italian conversations.',
};

async function patchItalianA1Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Italian A1 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/italian/levels/a1/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Italian A1 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchItalianA1Outcomes();
