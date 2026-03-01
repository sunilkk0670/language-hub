const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'es_a2_m1': 'After this, you can narrate your life story, talk about past experiences, and share memories.',
    'es_a2_m2': 'After this, you can manage professional emails, discuss career paths, and handle office meetings.',
    'es_a2_m3': 'After this, you can describe complex symptoms, discuss healthy habits, and seek medical advice.',
    'es_a2_m4': 'After this, you can navigate any Spanish-speaking city, book complex tours, and discuss local attractions.',
    'es_a2_m5': 'After this, you can understand Spanish news snippets, discuss movies, and follow trending topics.',
    'es_a2_m6': 'After this, you can discuss environmental issues, recycling, and your connection to nature.',
    'es_a2_m7': 'After this, you can express deep opinions, navigate social nuances, and build lasting friendships.',
    'es_a2_m8': 'After this, you can handle apartment viewings, discuss rental contracts, and describe interior design.',
    'es_a2_m9': 'After this, you can discuss academic goals, career ambitions, and your plans for the next few years.',
    'es_a2_m10': 'After this, you will have completed A2 and can use common Spanish idioms to sound more like a native.',
};

async function patchSpanishA2Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Spanish A2 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/spanish/levels/a2/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Spanish A2 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchSpanishA2Outcomes();
