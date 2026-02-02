const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function uploadM12M13() {
    try {
        console.log('Uploading Portuguese A2 Modules 12 & 13...\n');

        const modules = ['pt_a2_m02', 'pt_a2_m03'];

        for (const mid of modules) {
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
        }

        // Update Level Metadata
        // M11 was 100, M12 is 100, M13 is 100 -> Total 300 words, count 3 modules
        await db.collection('languages').doc('portuguese')
            .collection('levels').doc('a2').update({
                count: 3,
                wordCount: 300
            });

        console.log('\n✅ Modules 12 & 13 uploaded successfully! Total words in A2: 300.');

    } catch (error) {
        console.error('Upload failed:', error);
    }
}

uploadM12M13();
