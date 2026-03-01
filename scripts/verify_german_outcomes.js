const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function verifyOutcomes() {
    const samples = [
        { level: 'a1', id: 'de_a1_m01' },
        { level: 'a2', id: 'de_a2_m01' },
        { level: 'b1', id: 'de_b1_m01' }
    ];

    console.log('🔍 Verifying German Outcomes in Firestore...\n');

    for (const sample of samples) {
        const docRef = db.doc(`languages/german/levels/${sample.level}/modules/${sample.id}`);
        const doc = await docRef.get();

        if (doc.exists) {
            const data = doc.data();
            console.log(`✅ Level ${sample.level.toUpperCase()} [${sample.id}]:`);
            console.log(`   Theme: ${data.theme}`);
            console.log(`   Outcome: ${data.outcome || '❌ MISSING'}`);
        } else {
            console.log(`❌ Level ${sample.level.toUpperCase()} [${sample.id}]: DOCUMENT NOT FOUND`);
        }
    }
    process.exit(0);
}

verifyOutcomes();
