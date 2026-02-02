const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function deleteLegacyPunjabiModules() {
    try {
        console.log('Deleting legacy Punjabi A1 modules...\n');

        const legacyModuleIds = [
            'punjabi_a1_m1',
            'punjabi_a1_m2',
            'punjabi_a1_m3',
            'punjabi_a1_m4',
            'punjabi_a1_m5'
        ];

        const modulesRef = db.collection('languages').doc('punjabi')
            .collection('levels').doc('a1')
            .collection('modules');

        for (const moduleId of legacyModuleIds) {
            const docRef = modulesRef.doc(moduleId);
            const doc = await docRef.get();

            if (doc.exists) {
                await docRef.delete();
                console.log(`✓ Deleted: ${moduleId}`);
            } else {
                console.log(`⊘ Not found: ${moduleId} (already deleted or never existed)`);
            }
        }

        console.log('\n✅ Legacy module cleanup complete!');
        console.log('All legacy punjabi_a1_m1-m5 documents have been removed.');
        console.log('Only the new pa_a1_m01 module remains.');

    } catch (error) {
        console.error('Error deleting legacy modules:', error);
    }
}

deleteLegacyPunjabiModules();
