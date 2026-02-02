const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function checkHindi() {
    const levelRef = db.doc('languages/hindi/levels/a1');
    const doc = await levelRef.get();
    console.log('--- HINDI A1 METADATA ---');
    console.log(JSON.stringify(doc.data(), null, 2));

    const modulesRef = levelRef.collection('modules');
    const snapshot = await modulesRef.get();
    console.log(`Modules count in collection: ${snapshot.size}`);
}

checkHindi();
