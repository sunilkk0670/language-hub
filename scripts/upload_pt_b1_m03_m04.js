const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function uploadB1M03M04() {
    try {
        const modules = ['pt_b1_m03', 'pt_b1_m04'];

        for (const mid of modules) {
            console.log(`Uploading ${mid}...`);
            const data = JSON.parse(fs.readFileSync(`../firestore_data/${mid}.json`, 'utf8'));

            await db.collection('languages').doc('portuguese')
                .collection('levels').doc('b1')
                .collection('modules').doc(mid).set({
                    theme: data.theme,
                    order: data.order,
                    lessons: data.lessons,
                    liarGameData: data.liarGameData || null
                });

            console.log(`✓ Uploaded ${mid}: ${data.theme}`);
        }

        // Update Level Metadata
        // Total words in B1: 400 (M01, M02, M03, M04)
        await db.collection('languages').doc('portuguese')
            .collection('levels').doc('b1').update({
                count: 4,
                wordCount: 400
            });

        console.log('\n✅ Modules 23 and 24 uploaded successfully! Total words in B1: 400.');

    } catch (error) {
        console.error('Upload failed:', error);
    }
}

uploadB1M03M04();
