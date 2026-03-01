const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'ko_b1_m01': 'After this, you can discuss current events, understand news reports, and debate social topics.',
    'ko_b1_m02': 'After this, you can handle professional networking, discuss career growth, and manage workplace meetings.',
    'ko_b1_m03': 'After this, you can express complex feelings, discuss personality traits, and share deep personal insights.',
    'ko_b1_m04': 'After this, you can manage unconventional travel situations and discuss local Korean hidden gems.',
    'ko_b1_m05': 'After this, you can discuss wellness trends, long-term health goals, and modern lifestyle choices.',
    'ko_b1_m06': 'After this, you can master deep cultural nuances, formal honorifics, and traditional Korean social rules.',
    'ko_b1_m07': 'After this, you can discuss cutting-edge innovations, digital ethics, and the future of technology.',
    'ko_b1_m08': 'After this, you can appreciate Korean literary works, critique fine arts, and discuss cultural masterpieces.',
    'ko_b1_m09': 'After this, you can understand legal systems, discuss ethical dilemmas, and handle formal administrative topics.',
    'ko_b1_m10': 'After this, you will have mastered B1 and can use complex Korean particles and nuances fluently.',
};

async function patchKoreanB1Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Korean B1 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/korean/levels/b1/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Korean B1 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchKoreanB1Outcomes();
