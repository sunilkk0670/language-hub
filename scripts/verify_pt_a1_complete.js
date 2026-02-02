const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function verify() {
    const levelDoc = await db.collection('languages').doc('portuguese').collection('levels').doc('a1').get();
    console.log('A1 Level Metadata:', JSON.stringify(levelDoc.data(), null, 2));

    const m09 = await db.collection('languages').doc('portuguese').collection('levels').doc('a1').collection('modules').doc('pt_a1_m09').get();
    const m10 = await db.collection('languages').doc('portuguese').collection('levels').doc('a1').collection('modules').doc('pt_a1_m10').get();

    console.log('M09 exists:', m09.exists, 'Lessons:', m09.exists ? m09.data().lessons.length : 0);
    console.log('M10 exists:', m10.exists, 'Lessons:', m10.exists ? m10.data().lessons.length : 0);
}

verify();
