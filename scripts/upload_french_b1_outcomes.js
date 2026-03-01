const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

if (!admin.apps.length) {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function uploadFrenchB1Outcomes() {
    console.log('Starting French B1 outcomes upload...');

    const modulesDir = './firestore_data';
    const b1Files = [
        'fr_b1_m21.json',
        'fr_b1_m22.json',
        'fr_b1_m23.json',
        'fr_b1_m24.json',
        'fr_b1_m25.json',
        'fr_b1_m26.json',
        'fr_b1_m27.json',
        'fr_b1_m28.json',
        'fr_b1_m29.json',
        'fr_b1_m30.json'
    ];

    for (const fileName of b1Files) {
        const filePath = path.join(modulesDir, fileName);
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const moduleId = data.moduleId || data.id;

            console.log(`Uploading ${moduleId}...`);
            await db.collection('languages').doc('french')
                .collection('levels').doc('b1')
                .collection('modules').doc(moduleId)
                .set(data, { merge: true });
        } else {
            console.warn(`File not found: ${filePath}`);
        }
    }

    console.log('Updating French B1 level metadata...');
    await db.collection('languages').doc('french')
        .collection('levels').doc('b1')
        .set({
            count: 10,
            totalModules: 10,
            status: 'Complete'
        }, { merge: true });

    console.log('French B1 upload complete!');
}

uploadFrenchB1Outcomes().catch(console.error);
