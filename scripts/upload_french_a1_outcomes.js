const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');
const path = require('path');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function uploadFrenchA1Outcomes() {
    try {
        console.log('========================================');
        console.log('  FRENCH A1 OUTCOMES DEPLOYMENT');
        console.log('  Uploading Modules 1-10 with Outcomes');
        console.log('========================================\n');

        const modules = [
            'french_a1_m1.json',
            'french_a1_m2.json',
            'french_a1_m3.json',
            'french_a1_m4.json',
            'french_a1_m5.json',
            'french_a1_m6.json',
            'french_a1_m7.json',
            'french_a1_m8.json',
            'french_a1_m9.json',
            'french_a1_m10.json'
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
                .collection('levels').doc('a1')
                .collection('modules').doc(moduleId)
                .set(data, { merge: true });

            console.log(`✅ ${moduleId} uploaded successfully!\n`);
        }

        // UPDATE LEVEL METADATA
        console.log('========================================');
        console.log('  UPDATING LEVEL METADATA');
        console.log('========================================\n');

        console.log('Updating French A1 level metadata...');
        await db.collection('languages').doc('french')
            .collection('levels').doc('a1')
            .set({
                levelId: 'a1',
                name: 'A1',
                description: 'Beginner - Essential phrases and vocabulary',
                moduleCount: 10,
                count: 10,
                status: 'Complete',
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        console.log('✅ French A1 metadata updated\n');

        console.log('========================================');
        console.log('  🎉 DEPLOYMENT COMPLETE!');
        console.log('========================================');

        process.exit(0);

    } catch (error) {
        console.error('❌ Upload failed:', error);
        process.exit(1);
    }
}

uploadFrenchA1Outcomes();
