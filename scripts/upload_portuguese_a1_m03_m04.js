const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

// Load the module data
const pt_a1_m03 = require('../firestore_data/pt_a1_m03.json');
const pt_a1_m04 = require('../firestore_data/pt_a1_m04.json');

async function uploadPortugueseModules() {
    try {
        console.log('Starting Portuguese A1 Modules 03 & 04 upload...\n');

        const portugueseRef = db.collection('languages').doc('portuguese');
        const a1LevelRef = portugueseRef.collection('levels').doc('a1');
        const modulesRef = a1LevelRef.collection('modules');

        // Upload Module 03
        await modulesRef.doc(pt_a1_m03.module_id).set({
            theme: pt_a1_m03.theme,
            order: pt_a1_m03.order,
            lessons: pt_a1_m03.lessons,
            liarGameData: pt_a1_m03.liarGameData
        });
        console.log(`✓ Uploaded ${pt_a1_m03.module_id}: ${pt_a1_m03.theme} (${pt_a1_m03.lessons.length} lessons)`);

        // Upload Module 04
        await modulesRef.doc(pt_a1_m04.module_id).set({
            theme: pt_a1_m04.theme,
            order: pt_a1_m04.order,
            lessons: pt_a1_m04.lessons,
            liarGameData: pt_a1_m04.liarGameData
        });
        console.log(`✓ Uploaded ${pt_a1_m04.module_id}: ${pt_a1_m04.theme} (${pt_a1_m04.lessons.length} lessons)`);

        // Update A1 level metadata
        const totalWords = pt_a1_m03.lessons.length + pt_a1_m04.lessons.length + 200; // 200 from m01 & m02
        await a1LevelRef.set({
            id: 'a1',
            name: 'A1',
            levelId: 'a1',
            description: 'Beginner - Basic phrases and vocabulary',
            order: 1,
            count: 4,
            moduleCount: 10,
            status: 'In Progress',
            wordCount: totalWords
        }, { merge: true });
        console.log(`\n✓ Updated A1 level metadata: ${totalWords} total words, 4 modules`);

        console.log('\n✅ Portuguese A1 Modules 03 & 04 uploaded successfully!');
        console.log('Total progress: 400/1000 words (40% complete)');

    } catch (error) {
        console.error('Error uploading modules:', error);
    }
}

uploadPortugueseModules();
