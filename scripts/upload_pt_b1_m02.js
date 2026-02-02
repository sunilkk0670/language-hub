const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function uploadB1M02() {
    try {
        console.log('Uploading Portuguese B1 Module 02...\n');

        const mid = 'pt_b1_m02';
        const data = JSON.parse(fs.readFileSync(`../firestore_data/${mid}.json`, 'utf8'));

        await db.collection('languages').doc('portuguese')
            .collection('levels').doc('b1')
            .collection('modules').doc(mid).set({
                theme: data.theme,
                order: data.order,
                lessons: data.lessons,
                liarGameData: data.liarGameData || null
            });

        console.log(`✓ Uploaded ${mid}: ${data.theme} (${data.lessons.length} lessons)`);

        // Update Level Metadata
        await db.collection('languages').doc('portuguese')
            .collection('levels').doc('b1').update({
                count: 2,
                wordCount: 200
            });

        console.log('\n✅ Module 22 uploaded successfully! Total words in B1: 200.');

    } catch (error) {
        console.error('Upload failed:', error);
    }
}

uploadB1M02();
