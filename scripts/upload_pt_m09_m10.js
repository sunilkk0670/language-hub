const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function uploadM09M10() {
    try {
        console.log('Uploading Portuguese A1 Modules 09 & 10...\n');

        const modules = ['pt_a1_m09', 'pt_a1_m10'];

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
        // Total words: 1000
        await db.collection('languages').doc('portuguese')
            .collection('levels').doc('a1').update({
                count: 10,
                wordCount: 1000,
                status: 'Complete'
            });

        console.log('\n✅ Modules 09 & 10 uploaded successfully! Total words: 1000. Level Status: Complete.');

    } catch (error) {
        console.error('Upload failed:', error);
    }
}

uploadM09M10();
