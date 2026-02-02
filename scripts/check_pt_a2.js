const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function checkA2() {
    const a2Doc = await db.collection('languages').doc('portuguese').collection('levels').doc('a2').get();
    if (a2Doc.exists) {
        console.log('A2 Level Metadata:', JSON.stringify(a2Doc.data(), null, 2));
    } else {
        console.log('A2 Level Metadata does not exist.');
    }
}

checkA2();
