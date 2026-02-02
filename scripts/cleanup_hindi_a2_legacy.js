const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function cleanupLegacyModules() {
    try {
        console.log('--- CLEANING UP LEGACY HINDI A2 MODULES ---\n');

        const modulesCol = db.collection('languages').doc('hindi').collection('levels').doc('a2').collection('modules');
        const snapshot = await modulesCol.get();

        if (snapshot.empty) {
            console.log('No modules found.');
            return;
        }

        let deleteCount = 0;
        const batch = db.batch();

        snapshot.forEach(doc => {
            const id = doc.id;
            // Keep only modules that follow our naming convention hi_a2_mXX
            if (!id.startsWith('hi_a2_m')) {
                console.log(`Marking for deletion: ${id}`);
                batch.delete(doc.ref);
                deleteCount++;
            }
        });

        if (deleteCount > 0) {
            await batch.commit();
            console.log(`\n✅ Successfully deleted ${deleteCount} legacy documents.`);
        } else {
            console.log('\nNo legacy documents found to delete.');
        }

        process.exit(0);

    } catch (error) {
        console.error('❌ Cleanup failed:', error);
        process.exit(1);
    }
}

cleanupLegacyModules();
