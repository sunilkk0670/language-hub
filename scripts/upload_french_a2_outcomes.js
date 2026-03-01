const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
// Make sure you have the service account key or are logged in via Firebase CLI
if (!admin.apps.length) {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function uploadFrenchA2Outcomes() {
    try {
        console.log('🚀 Starting French A2 Outcomes upload...');

        const modules = [
            'french_a2_m11.json',
            'french_a2_m12.json',
            'french_a2_m13.json',
            'french_a2_m14.json',
            'french_a2_m15.json',
            'french_a2_m16.json',
            'french_a2_m17.json',
            'french_a2_m18.json',
            'french_a2_m19.json',
            'french_a2_m20.json'
        ];

        for (const moduleFile of modules) {
            const filePath = path.join(__dirname, `../firestore_data/${moduleFile}`);
            if (!fs.existsSync(filePath)) {
                console.error(`❌ File not found: ${filePath}`);
                continue;
            }

            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const moduleId = data.moduleId || data.id;

            console.log(`🚀 Uploading: ${moduleId} (${data.theme || data.name})`);

            await db.collection('languages').doc('french')
                .collection('levels').doc('a2')
                .collection('modules').doc(moduleId)
                .set(data, { merge: true });

            console.log(`✅ ${moduleId} uploaded successfully!\n`);
        }

        // UPDATE LEVEL METADATA
        console.log('Updating French A2 level metadata...');
        await db.collection('languages').doc('french')
            .collection('levels').doc('a2')
            .set({
                levelId: 'a2',
                name: 'A2',
                description: 'Pre-Intermediate - Common situations and detailed descriptions',
                moduleCount: 10,
                count: 10,
                status: 'Complete',
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        console.log('✅ French A2 metadata updated\n');

        console.log('🎉 French A2 outcomes deployment finished successfully!');

    } catch (error) {
        console.error('❌ Error uploading outcomes:', error);
    }
}

uploadFrenchA2Outcomes();
