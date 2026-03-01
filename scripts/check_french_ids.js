const admin = require('firebase-admin');
const fs = require('fs');

if (!admin.apps.length) {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function checkFrenchModules() {
    const levels = ['a1', 'a2', 'b1'];
    for (const level of levels) {
        console.log(`\n--- Level: ${level} ---`);
        const snapshot = await db.collection('languages').doc('french')
            .collection('levels').doc(level)
            .collection('modules').get();

        snapshot.docs.forEach(doc => {
            console.log(`Document ID: ${doc.id}`);
            // console.log(`Data ID: ${doc.data().moduleId || doc.data().id}`);
        });
    }
}

checkFrenchModules();
