const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function deleteLegacyModules() {
    try {
        console.log('Deleting legacy Portuguese A2 modules...');

        const legacyIds = [
            'portuguese_a2_m1',
            'portuguese_a2_m2',
            'portuguese_a2_m3',
            'portuguese_a2_m4',
            'portuguese_a2_m5'
        ];

        const batch = db.batch();
        const modulesCol = db.collection('languages').doc('portuguese').collection('levels').doc('a2').collection('modules');

        legacyIds.forEach(id => {
            const docRef = modulesCol.doc(id);
            batch.delete(docRef);
            console.log(`- Queued for deletion: ${id}`);
        });

        await batch.commit();
        console.log('\n✅ Legacy modules deleted successfully.');

    } catch (error) {
        console.error('Deletion failed:', error);
    }
}

deleteLegacyModules();
