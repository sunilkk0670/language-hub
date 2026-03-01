const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const outcomes = {
    'pt_b1_m01': 'After this, you can analyze digital trends, discuss social media\'s impact, and critique online news.',
    'pt_b1_m02': 'After this, you can debate environmental policies, sustainability, and green initiatives.',
    'pt_b1_m03': 'After this, you can appreciate Portuguese literature and discuss complex philosophical ideas.',
    'pt_b1_m04': 'After this, you can discuss historical eras, heritage protection, and cultural evolution.',
    'pt_b1_m05': 'After this, you can discuss technological breakthroughs and the ethics of modern innovation.',
    'pt_b1_m06': 'After this, you can handle professional negotiations and discuss global market trends.',
    'pt_b1_m07': 'After this, you can understand legal systems, discuss civic rights, and handle formal documentation.',
    'pt_b1_m08': 'After this, you can navigate healthcare systems and discuss medical ethics and wellness goals.',
    'pt_b1_m09': 'After this, you can critique artistic works, discuss cultural movements, and express creative views.',
    'pt_b1_m10': 'After this, you will have mastered B1 and can fluently discuss global affairs and future predictions.',
};

async function patchPortugueseB1Outcomes() {
    try {
        console.log('🚀 Patching outcome fields for Portuguese B1 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/portuguese/levels/b1/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued: ${moduleId}`);
        }

        await batch.commit();
        console.log('\n✅ All 10 Portuguese B1 modules patched successfully!');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchPortugueseB1Outcomes();
