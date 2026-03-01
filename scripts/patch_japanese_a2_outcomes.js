const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'ja_a2_m11': 'After this, you can handle Japanese office etiquette, simple meetings, and work communication.',
    'ja_a2_m12': 'After this, you can navigate complex Japanese transit systems and manage long-distance travel.',
    'ja_a2_m13': 'After this, you can describe detailed symptoms at a clinic and discuss healthy lifestyle habits.',
    'ja_a2_m14': 'After this, you can discuss your passions in detail and coordinate social outings with friends.',
    'ja_a2_m15': 'After this, you can describe your living environment and handle various household interactions.',
    'ja_a2_m16': 'After this, you can navigate Japanese boutiques, discuss styles, and handle complex purchases.',
    'ja_a2_m17': 'After this, you can name body parts in detail and explain physical sensations or concerns.',
    'ja_a2_m18': 'After this, you can discuss environmental topics and describe the unique Japanese landscape.',
    'ja_a2_m19': 'After this, you can discuss your professional background and career goals in Japanese.',
    'ja_a2_m20': 'After this, you can understand basic Japanese news topics and engage in simple societal debates.',
};

async function patchJapaneseA2Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Japanese A2 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/japanese/levels/a2/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Japanese A2 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchJapaneseA2Outcomes();
