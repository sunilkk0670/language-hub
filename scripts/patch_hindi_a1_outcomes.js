const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'hi_a1_m01': 'After this, you can master the Hindi script basics, greet others, and introduce yourself.',
    'hi_a1_m02': 'After this, you can count, tell the time, and discuss dates and schedules confidently.',
    'hi_a1_m03': 'After this, you can talk about your family members and describe your social circle.',
    'hi_a1_m04': 'After this, you can name common ingredients, discuss meals, and navigate a kitchen.',
    'hi_a1_m05': 'After this, you can describe your daily activities and use common verbs for everyday tasks.',
    'hi_a1_m06': 'After this, you can describe your living space and ask for or give simple directions.',
    'hi_a1_m07': 'After this, you can discuss your studies, your workplace, and basic professional roles.',
    'hi_a1_m08': 'After this, you can talk about the environment, describe the weather, and name animals.',
    'hi_a1_m09': 'After this, you can describe how you feel, identify body parts, and talk about clothes.',
    'hi_a1_m10': 'After this, you will have solidified your A1 foundation and can express emotions and descriptions.',
};

async function patchHindiA1Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Hindi A1 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/hindi/levels/a1/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Hindi A1 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchHindiA1Outcomes();
