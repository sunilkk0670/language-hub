const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'ja_a1_m1': 'After this, you can greet others, introduce yourself, and use essential Japanese politeness.',
    'ja_a1_m2': 'After this, you can count, tell the time, and handle basic money transactions in Yen.',
    'ja_a1_m3': 'After this, you can introduce your family and describe people using basic Japanese adjectives.',
    'ja_a1_m4': 'After this, you can order at a Ramen shop, read basic menus, and express food preferences.',
    'ja_a1_m5': 'After this, you can describe your daily schedule and use basic verbs for movement and actions.',
    'ja_a1_m6': 'After this, you can ask for directions, navigate city spots, and describe where things are.',
    'ja_a1_m7': 'After this, you can discuss your interests, sports, and what you do in your free time.',
    'ja_a1_m8': 'After this, you can talk about the climate, describe the seasons, and discuss the environment.',
    'ja_a1_m9': 'After this, you can name body parts, describe how you feel, and seek basic medical help.',
    'ja_a1_m10': 'After this, you will have solidified your A1 foundation and be ready for basic Japanese travel.',
};

async function patchJapaneseA1Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Japanese A1 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/japanese/levels/a1/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Japanese A1 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchJapaneseA1Outcomes();
