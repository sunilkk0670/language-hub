const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'ita_a2_m01': 'After this, you can narrate your life story, share past memories, and talk about travel experiences.',
    'ita_a2_m02': 'After this, you can describe your emotions, discuss healthy habits, and seek medical advice in Italian.',
    'ita_a2_m03': 'After this, you can navigate Italian cities, understand local traditions, and manage complex travel plans.',
    'ita_a2_m04': 'After this, you can manage office interactions, discuss your career path, and handle professional meetings.',
    'ita_a2_m05': 'After this, you can understand news snippets, discuss digital trends, and use Italian on social media.',
    'ita_a2_m06': 'After this, you can discuss Italian news, societal changes, and engage in simple topical debates.',
    'ita_a2_m07': 'After this, you can discuss sustainability, describe the Italian landscape, and talk about nature protection.',
    'ita_a2_m08': 'After this, you can build deeper friendships, express opinions, and navigate complex social situations.',
    'ita_a2_m09': 'After this, you can share your passions, discuss sports, and coordinate group leisure activities.',
    'ita_a2_m10': 'After this, you will have mastered Italian A2 and be fully prepared for intermediate (B1) independence.',
};

async function patchItalianA2Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Italian A2 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/italian/levels/a2/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Italian A2 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchItalianA2Outcomes();
