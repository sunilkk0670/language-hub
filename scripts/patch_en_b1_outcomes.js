const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Outcome strings for each English B1 module
const outcomes = {
    'en_b1_m01': 'After this, you can participate in meetings, handle professional emails, and discuss projects.',
    'en_b1_m02': 'After this, you can understand international news and discuss social and economic trends.',
    'en_b1_m03': 'After this, you can discuss physical and mental health, lifestyle choices, and work-life balance.',
    'en_b1_m04': 'After this, you can describe cultural traditions, social norms, and their impact on society.',
    'en_b1_m05': 'After this, you can discuss digital breakthroughs, AI, and the future of technology.',
    'en_b1_m06': 'After this, you can debate climate change, sustainability, and renewable energy sources.',
    'en_b1_m07': 'After this, you can handle complex travel arrangements and discuss the hospitality industry.',
    'en_b1_m08': 'After this, you can analyze film and literature and discuss the influence of mass media.',
    'en_b1_m09': 'After this, you can discuss academic paths, teaching methods, and lifelong learning goals.',
    'en_b1_m10': 'After this, you can express viewpoints on moral dilemmas and discuss philosophical ideas.',
};

async function patchOutcomes() {
    try {
        console.log('🚀 Patching outcome fields for English B1 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/english/levels/b1/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued update for ${moduleId}: "${outcome}"`);
        }

        await batch.commit();

        console.log('\n✅ All 10 English B1 modules patched with outcome field successfully!');
    } catch (error) {
        console.error('❌ Error patching outcomes:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchOutcomes();
