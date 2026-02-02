const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function uploadB1M09M10() {
    try {
        const modules = ['pt_b1_m09', 'pt_b1_m10'];

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

        // Final update for B1 level
        await db.collection('languages').doc('portuguese')
            .collection('levels').doc('b1').update({
                count: 10,
                wordCount: 1000,
                status: 'Complete'
            });

        console.log('\n✅ Modules 29 and 30 uploaded! Portuguese B1 is now COMPLETE.');

    } catch (error) {
        console.error('Upload failed:', error);
    }
}

uploadB1M09M10();
