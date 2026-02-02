const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function uploadM16() {
    try {
        console.log('Uploading Portuguese A2 Module 16...\n');

        const mid = 'pt_a2_m06';
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
        // M11-M15 were 500, M16 is 100 -> Total 600 words, count 6 modules
        await db.collection('languages').doc('portuguese')
            .collection('levels').doc('a2').update({
                count: 6,
                wordCount: 600
            });

        console.log('\n✅ Module 16 uploaded successfully! Total words in A2: 600.');

    } catch (error) {
        console.error('Upload failed:', error);
    }
}

uploadM16();
