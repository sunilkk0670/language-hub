const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'es_a1_m1': 'After this, you can master Spanish pronunciation, basic greetings, and personal introductions.',
    'es_a1_m2': 'After this, you can use essential verbs to express needs, ask questions, and hold simple conversations.',
    'es_a1_m3': 'After this, you can describe your household routine, tell the time, and talk about your daily habits.',
    'es_a1_m4': 'After this, you can navigate airports, use public transport, and ask for directions in Spanish.',
    'es_a1_m5': 'After this, you can discuss your hobbies, make plans with friends, and handle social invitations.',
    'es_a1_m6': 'After this, you can describe the weather, talk about the environment, and name common animals.',
    'es_a1_m7': 'After this, you can discuss your profession, office tasks, and educational background.',
    'es_a1_m8': 'After this, you can express how you feel, describe personality traits, and share your moods.',
    'es_a1_m9': 'After this, you can discuss Spanish traditions, festivals, and cultural nuances confidently.',
    'es_a1_m10': 'After this, you will have solidified your A1 foundation and be ready for intermediate Spanish topics.',
};

async function patchSpanishA1Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Spanish A1 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/spanish/levels/a1/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Spanish A1 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchSpanishA1Outcomes();
