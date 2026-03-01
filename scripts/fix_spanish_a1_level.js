const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function fixSpanishA1Level() {
    const ref = db.collection('languages').doc('spanish').collection('levels').doc('a1');
    const snap = await ref.get();

    if (!snap.exists) {
        console.log('❌ Document languages/spanish/levels/a1 does not exist!');
        process.exit(1);
    }

    const current = snap.data();
    console.log('Current data:', JSON.stringify(current, null, 2));

    await ref.update({
        name: 'A1 Beginner',
        description: 'Basic Spanish - Greetings, Numbers, and Basics',
    });

    console.log('✅ Spanish A1 level updated successfully!');
    const updated = (await ref.get()).data();
    console.log('Updated name:', updated.name);
    console.log('Updated description:', updated.description);
    process.exit(0);
}

fixSpanishA1Level().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
