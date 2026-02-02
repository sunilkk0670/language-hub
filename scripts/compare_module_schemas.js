const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

(async () => {
    // Check German module structure
    const germanDoc = await db.collection('languages').doc('german')
        .collection('levels').doc('a1')
        .collection('modules').doc('de_a1_m01').get();

    console.log('=== GERMAN MODULE STRUCTURE ===');
    const germanData = germanDoc.data();
    console.log('Fields:', Object.keys(germanData));
    console.log('\nSample:', JSON.stringify(germanData, null, 2).substring(0, 500));

    // Check Portuguese module structure
    const ptDoc = await db.collection('languages').doc('portuguese')
        .collection('levels').doc('a1')
        .collection('modules').doc('pt_a1_m01').get();

    console.log('\n\n=== PORTUGUESE MODULE STRUCTURE ===');
    const ptData = ptDoc.data();
    console.log('Fields:', Object.keys(ptData));
    console.log('\nSample:', JSON.stringify(ptData, null, 2).substring(0, 500));
})();
