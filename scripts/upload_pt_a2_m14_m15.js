const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function uploadM14M15() {
    try {
        console.log('Uploading Portuguese A2 Modules 14 & 15...\n');

        const modules = ['pt_a2_m04', 'pt_a2_m05'];

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
        // M11-M13 were 300, M14 is 100, M15 is 100 -> Total 500 words, count 5 modules
        await db.collection('languages').doc('portuguese')
            .collection('levels').doc('a2').update({
                count: 5,
                wordCount: 500
            });

        console.log('\n✅ Modules 14 & 15 uploaded successfully! Total words in A2: 500.');

    } catch (error) {
        console.error('Upload failed:', error);
    }
}

uploadM14M15();
