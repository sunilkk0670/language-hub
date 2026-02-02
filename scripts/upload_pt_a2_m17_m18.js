const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function uploadM17M18() {
    try {
        console.log('Uploading Portuguese A2 Modules 17 & 18...\n');

        const modules = ['pt_a2_m07', 'pt_a2_m08'];

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
        // M11-M16 were 600, M17 is 100, M18 is 100 -> Total 800 words, count 8 modules
        await db.collection('languages').doc('portuguese')
            .collection('levels').doc('a2').update({
                count: 8,
                wordCount: 800
            });

        console.log('\n✅ Modules 17 & 18 uploaded successfully! Total words in A2: 800.');

    } catch (error) {
        console.error('Upload failed:', error);
    }
}

uploadM17M18();
