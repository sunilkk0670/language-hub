const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function reuploadAllPortugueseA1() {
    try {
        console.log('Re-uploading corrected Portuguese A1 Modules 01-04...\n');

        const modules = ['pt_a1_m01', 'pt_a1_m02', 'pt_a1_m03', 'pt_a1_m04'];

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

            console.log(`✓ Re-uploaded ${mid}: ${data.theme} (${data.lessons.length} lessons)`);
        }

        // Update Level Metadata
        await db.collection('languages').doc('portuguese')
            .collection('levels').doc('a1').set({
                id: 'a1',
                name: 'A1',
                levelId: 'a1',
                description: 'Beginner - Basic phrases and vocabulary',
                order: 1,
                count: 4,
                moduleCount: 10,
                status: 'In Progress',
                wordCount: 400
            }, { merge: true });

        console.log('\n✅ Portuguese A1 sync complete. 400 unique words across 4 modules.');

    } catch (error) {
        console.error('Re-upload failed:', error);
    }
}

reuploadAllPortugueseA1();
