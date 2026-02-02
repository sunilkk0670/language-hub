const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function checkHindiModules() {
    try {
        const snapshot = await db.collection('languages').doc('hindi')
            .collection('levels').doc('a1')
            .collection('modules').get();

        console.log(`Found ${snapshot.size} modules for Hindi A1:`);
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log(`- ID: ${doc.id}, Theme: ${data.theme || data.name || 'N/A'}, Order: ${data.order}, Words: ${data.vocabulary ? data.vocabulary.length : (data.lessons ? data.lessons.length : 'N/A')}`);
        });

    } catch (error) {
        console.error('Error fetching modules:', error);
    }
}

checkHindiModules();
