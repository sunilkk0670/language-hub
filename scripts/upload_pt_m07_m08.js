const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function uploadM07M08() {
    try {
        console.log('Uploading Portuguese A1 Modules 07 & 08...\n');

        const modules = ['pt_a1_m07', 'pt_a1_m08'];

        for (const mid of modules) {
            const data = JSON.parse(fs.readFileSync(`../firestore_data/${mid}.json`, 'utf8'));

            await db.collection('languages').doc('portuguese')
                .collection('levels').doc('a1')
                .collection('modules').doc(mid).set({
                    theme: data.theme,
                    order: data.order,
                    lessons: data.lessons,
                    liarGameData: data.liarGameData || null
                });

            console.log(`✓ Uploaded ${mid}: ${data.theme} (${data.lessons.length} lessons)`);
        }

        // Update Level Metadata
        // Total words: 800
        await db.collection('languages').doc('portuguese')
            .collection('levels').doc('a1').update({
                count: 8,
                wordCount: 800
            });

        console.log('\n✅ Modules 07 & 08 uploaded successfully! Total words: 800.');

    } catch (error) {
        console.error('Upload failed:', error);
    }
}

uploadM07M08();
