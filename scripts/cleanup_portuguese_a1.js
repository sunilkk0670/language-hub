const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function cleanupPortugueseModules() {
    try {
        console.log('Starting cleanup of Portuguese A1 modules...\n');

        const modulesRef = db.collection('languages').doc('portuguese')
            .collection('levels').doc('a1')
            .collection('modules');

        const snapshot = await modulesRef.get();

        if (snapshot.empty) {
            console.log('No modules found to delete.');
            return;
        }

        console.log(`Found ${snapshot.size} module(s) to delete:`);

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
            console.log(`  - Deleting: ${doc.id}`);
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log('\n✅ All Portuguese A1 modules deleted successfully!');

    } catch (error) {
        console.error('Error cleaning up modules:', error);
    }
}

cleanupPortugueseModules();
