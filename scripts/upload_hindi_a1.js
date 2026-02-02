const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const fs = require('fs');
const path = require('path');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function fixHindiA1() {
    try {
        console.log('--- PURGING AND RE-UPLOADING HINDI A1 ---\n');

        const modulesCol = db.collection('languages').doc('hindi')
            .collection('levels').doc('a1')
            .collection('modules');

        // 1. Purge existing modules
        const snapshot = await modulesCol.get();
        if (snapshot.size > 0) {
            console.log(`Deleting ${snapshot.size} existing modules...`);
            const batch = db.batch();
            snapshot.forEach(doc => batch.delete(doc.ref));
            await batch.commit();
            console.log('✅ Purge complete.\n');
        }

        // 2. Ensure Language Metadata
        console.log('Updating Hindi language document...');
        await db.collection('languages').doc('hindi').set({
            languageId: 'hindi',
            name: 'Hindi',
            nativeScript: 'हिन्दी',
            flag: '🇮🇳',
            enabled: true,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // 3. Ensure Level Metadata
        console.log('Updating A1 level metadata...');
        await db.collection('languages').doc('hindi')
            .collection('levels').doc('a1')
            .set({
                levelId: 'a1',
                name: 'A1',
                description: 'Beginner - Basic phrases and vocabulary',
                moduleCount: 1, // Set to 1 for now as we only have m01
                status: 'In Progress',
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

        // 4. Upload fresh Module 1
        const filePath = path.join(__dirname, '../firestore_data/hi_a1_m01.json');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const docId = data.moduleId || data.module_id || 'hi_a1_m01';
        console.log(`Uploading Fresh Module: ${docId} (${data.theme})`);

        await modulesCol.doc(docId).set(data);

        console.log('\n✅ Hindi A1 Fixed and Live!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Fix failed:', error);
        process.exit(1);
    }
}

fixHindiA1();
