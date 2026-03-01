const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'sa_a1_m01': 'After this, you can master Devanagari basics, greet others, and introduce yourself in Sanskrit.',
    'sa_a1_m02': 'After this, you can tell the time, name colors, and describe your daily routine and surroundings.',
    'sa_a1_m03': 'After this, you can name various animals and discuss elements of the natural world and environment.',
    'sa_a1_m04': 'After this, you can express your feelings, name body parts, and discuss basic health and well-being.',
    'sa_a1_m05': 'After this, you can describe everyday actions and use essential verbs to talk about your life.',
    'sa_a1_m06': 'After this, you can master spatial relationships, use adverbs of time, and describe complex schedules.',
    'sa_a1_m07': 'After this, you can count confidently and handle various quantities and measurements in Sanskrit.',
    'sa_a1_m08': 'After this, you can discuss the five elements (Pancha Bhoota) and deeper aspects of the natural world.',
    'sa_a1_m09': 'After this, you can describe your living space, household objects, and basic architectural features.',
    'sa_a1_m10': 'After this, you will have completed A1 and can discuss Vedic food concepts and name various ingredients.',
};

async function patchSanskritA1Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Sanskrit A1 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/sanskrit/levels/a1/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Sanskrit A1 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchSanskritA1Outcomes();
