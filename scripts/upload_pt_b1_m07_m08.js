const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function uploadB1M07M08() {
    try {
        const modules = ['pt_b1_m07', 'pt_b1_m08'];

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
        // Total words in B1: 800 (M01 to M08)
        await db.collection('languages').doc('portuguese')
            .collection('levels').doc('b1').update({
                count: 8,
                wordCount: 800
            });

        console.log('\n✅ Modules 27 and 28 uploaded successfully! Total words in B1: 800.');

    } catch (error) {
        console.error('Upload failed:', error);
    }
}

uploadB1M07M08();
