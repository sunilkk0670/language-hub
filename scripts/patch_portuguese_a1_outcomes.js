const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'pt_a1_m01': 'After this, you can master basic Portuguese greetings and introduce yourself with confidence.',
    'pt_a1_m02': 'After this, you can count, tell the time, and discuss schedules and calendar dates.',
    'pt_a1_m03': 'After this, you can talk about your family members and describe people and relationships.',
    'pt_a1_m04': 'After this, you can order at a pastelaria, read menus, and discuss your favorite drinks.',
    'pt_a1_m05': 'After this, you can describe your living space and discuss your everyday household routines.',
    'pt_a1_m06': 'After this, you can navigate city landmarks, ask for directions, and explore new places.',
    'pt_a1_m07': 'After this, you can talk about the climate, describe the environment, and name animals.',
    'pt_a1_m08': 'After this, you can name body parts, describe physical feelings, and seek basic medical help.',
    'pt_a1_m09': 'After this, you can describe clothing, ask for prices, and go shopping in a local market.',
    'pt_a1_m10': 'After this, you will have solidified your A1 foundation and be ready for elementary conversations.',
};

async function patchPortugueseA1Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Portuguese A1 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/portuguese/levels/a1/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Portuguese A1 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchPortugueseA1Outcomes();
