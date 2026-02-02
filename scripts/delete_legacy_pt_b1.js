const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function deleteLegacyDocs() {
    try {
        const legacyDocs = [
            'portuguese_b1_m1',
            'portuguese_b1_m2',
            'portuguese_b1_m3',
            'portuguese_b1_m4',
            'portuguese_b1_m5'
        ];

        console.log('Cleaning up legacy Portuguese B1 documents...\n');

        for (const docId of legacyDocs) {
            await db.collection('languages').doc('portuguese')
                .collection('levels').doc('b1')
                .collection('modules').doc(docId).delete();
            console.log(`🗑️ Deleted: ${docId}`);
        }

        console.log('\n✅ Cleanup complete! Only pt_b1_m01 and pt_b1_m02 remain.');
    } catch (error) {
        console.error('Cleanup failed:', error);
    }
}

deleteLegacyDocs();
