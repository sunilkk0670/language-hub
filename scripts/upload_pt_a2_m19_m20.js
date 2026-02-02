const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function uploadM19M20() {
    try {
        console.log('Uploading Portuguese A2 Modules 19 & 20...\n');

        const modules = [
            { id: 'pt_a2_m09', file: 'pt_a2_m09' },
            { id: 'pt_a2_m10', file: 'pt_a2_m10' }
        ];

        for (const mod of modules) {
            const data = JSON.parse(fs.readFileSync(`../firestore_data/${mod.file}.json`, 'utf8'));

            await db.collection('languages').doc('portuguese')
                .collection('levels').doc('a2')
                .collection('modules').doc(mod.id).set({
                    theme: data.theme,
                    order: data.order,
                    lessons: data.lessons,
                    liarGameData: data.liarGameData || null
                });

            console.log(`✓ Uploaded ${mod.id}: ${data.theme} (${data.lessons.length} lessons)`);
        }

        // Final Meta Update
        await db.collection('languages').doc('portuguese')
            .collection('levels').doc('a2').update({
                count: 10,
                wordCount: 1000,
                status: 'Complete'
            });

        console.log('\n✅ Modules 19 & 20 uploaded successfully!');
        console.log('🏆 Portuguese A2 is now COMPLETE with 1,000 unique words.');

    } catch (error) {
        console.error('Upload failed:', error);
    }
}

uploadM19M20();
