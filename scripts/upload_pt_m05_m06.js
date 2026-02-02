const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function uploadM05M06() {
    try {
        console.log('Uploading Portuguese A1 Modules 05 & 06...\n');

        const modules = ['pt_a1_m05', 'pt_a1_m06'];

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
        // Total words: 600
        await db.collection('languages').doc('portuguese')
            .collection('levels').doc('a1').update({
                count: 6,
                wordCount: 600
            });

        console.log('\n✅ Modules 05 & 06 uploaded successfully! Total words: 600.');

    } catch (error) {
        console.error('Upload failed:', error);
    }
}

uploadM05M06();
