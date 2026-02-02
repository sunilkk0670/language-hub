const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

// Load the Portuguese A1 module data
const ptA1M01 = require('../firestore_data/pt_a1_m01.json');
const ptA1M02 = require('../firestore_data/pt_a1_m02.json');

async function uploadPortugueseA1Modules() {
    try {
        console.log('Starting Portuguese A1 Modules 01 & 02 upload...\n');

        // Upload Module 01 with proper document ID
        console.log('Uploading Portuguese A1 Module 01...');
        const m01Ref = db.collection('languages').doc('portuguese')
            .collection('levels').doc('a1')
            .collection('modules').doc(ptA1M01.module_id);

        await m01Ref.set(ptA1M01);
        console.log(`✓ Uploaded: ${ptA1M01.name} (${ptA1M01.vocabulary.length} words) - ID: ${ptA1M01.module_id}`);

        // Upload Module 02 with proper document ID
        console.log('\nUploading Portuguese A1 Module 02...');
        const m02Ref = db.collection('languages').doc('portuguese')
            .collection('levels').doc('a1')
            .collection('modules').doc(ptA1M02.module_id);

        await m02Ref.set(ptA1M02);
        console.log(`✓ Uploaded: ${ptA1M02.name} (${ptA1M02.vocabulary.length} words) - ID: ${ptA1M02.module_id}`);

        // Update Portuguese A1 level metadata
        console.log('\nUpdating Portuguese A1 level metadata...');
        const a1LevelRef = db.collection('languages').doc('portuguese')
            .collection('levels').doc('a1');

        await a1LevelRef.set({
            id: 'a1',
            name: 'A1',
            levelId: 'a1',
            description: 'Beginner - Basic phrases and vocabulary',
            order: 1,
            count: 2,
            moduleCount: 10,
            status: 'In Progress',
            wordCount: 200
        }, { merge: true });

        console.log('✓ Updated A1 level metadata');

        console.log('\n✅ Portuguese A1 Modules 01 & 02 uploaded successfully!');
        console.log('Total modules uploaded: 2');
        console.log('Total words: 200');
        console.log('Path: languages/portuguese/levels/a1/modules');

    } catch (error) {
        console.error('Error uploading modules:', error);
    }
}

uploadPortugueseA1Modules();
