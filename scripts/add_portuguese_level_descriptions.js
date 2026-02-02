const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function addPortugueseLevelDescriptions() {
    try {
        console.log('Adding Portuguese level descriptions...\n');

        const levelsRef = db.collection('languages').doc('portuguese').collection('levels');

        // A1 Level
        await levelsRef.doc('a1').set({
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
        console.log('✓ Updated A1 level with description');

        // A2 Level
        await levelsRef.doc('a2').set({
            id: 'a2',
            name: 'A2',
            levelId: 'a2',
            description: 'Elementary - Travel, Work and Media',
            order: 2,
            count: 0,
            moduleCount: 10,
            status: 'Not Started',
            wordCount: 0
        }, { merge: true });
        console.log('✓ Updated A2 level with description');

        // B1 Level
        await levelsRef.doc('b1').set({
            id: 'b1',
            name: 'B1',
            levelId: 'b1',
            description: 'Intermediate - Philosophy, Law and Abstract Science',
            order: 3,
            count: 0,
            moduleCount: 10,
            status: 'Not Started',
            wordCount: 0
        }, { merge: true });
        console.log('✓ Updated B1 level with description');

        console.log('\n✅ Portuguese level descriptions added successfully!');

    } catch (error) {
        console.error('Error adding level descriptions:', error);
    }
}

addPortugueseLevelDescriptions();
