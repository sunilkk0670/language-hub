const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function cleanupHindiB1Legacy() {
    try {
        console.log('--- CLEANING UP LEGACY HINDI B1 MODULES ---\n');

        const level = 'b1';
        const modulesCol = db.collection('languages').doc('hindi').collection('levels').doc(level).collection('modules');
        const snapshot = await modulesCol.get();

        if (snapshot.empty) {
            console.log('No modules found.');
            return;
        }

        let deleteCount = 0;
        const batch = db.batch();

        snapshot.forEach(doc => {
            const id = doc.id;
            // Keep only modules that follow our naming convention hi_b1_mXX
            if (!id.startsWith(`hi_${level}_m`)) {
                console.log(`Marking for deletion: ${id}`);
                batch.delete(doc.ref);
                deleteCount++;
            }
        });

        if (deleteCount > 0) {
            await batch.commit();
            console.log(`\n✅ Successfully deleted ${deleteCount} legacy documents from B1.`);
        } else {
            console.log('\nNo legacy documents found to delete in B1.');
        }

        process.exit(0);

    } catch (error) {
        console.error('❌ Cleanup failed:', error);
        process.exit(1);
    }
}

cleanupHindiB1Legacy();
