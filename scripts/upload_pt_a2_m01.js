const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function uploadA2M01() {
    try {
        console.log('Uploading Portuguese A2 Module 01 (Order 11)...\n');

        const mid = 'pt_a2_m01';
        const data = JSON.parse(fs.readFileSync(`../firestore_data/${mid}.json`, 'utf8'));

        await db.collection('languages').doc('portuguese')
            .collection('levels').doc('a2')
            .collection('modules').doc(mid).set({
                theme: data.theme,
                order: data.order,
                lessons: data.lessons,
                liarGameData: data.liarGameData || null
            });

        console.log(`✓ Uploaded ${mid}: ${data.theme} (${data.lessons.length} lessons)`);

        // Update Level Metadata
        await db.collection('languages').doc('portuguese')
            .collection('levels').doc('a2').update({
                count: 1,
                wordCount: 100,
                status: 'In Progress'
            });

        console.log('\n✅ Module 11 uploaded successfully! Total words in A2: 100.');

    } catch (error) {
        console.error('Upload failed:', error);
    }
}

uploadA2M01();
