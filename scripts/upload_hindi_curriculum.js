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

async function uploadHindiCurriculum() {
    try {
        console.log('--- UPLOADING HINDI CURRICULUM ---\n');

        // 1. Update Language Metadata
        console.log('Updating Hindi language document...');
        await db.collection('languages').doc('hindi').set({
            languageId: 'hindi',
            name: 'Hindi',
            nativeScript: 'हिन्दी',
            flag: '🇮🇳',
            enabled: true,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // 2. Process Levels
        const levels = ['a1', 'a2', 'b1'];
        const dataDir = path.join(__dirname, '../firestore_data');

        for (const level of levels) {
            console.log(`\n--- Processing Level ${level.toUpperCase()} ---`);
            const files = fs.readdirSync(dataDir).filter(f => f.startsWith(`hi_${level}_m`) && f.endsWith('.json'));

            if (files.length === 0) {
                console.log(`No files found for level ${level}.`);
                continue;
            }

            console.log(`Found ${files.length} module files for level ${level}.`);

            const levelDocRef = db.collection('languages').doc('hindi').collection('levels').doc(level);
            const modulesCol = levelDocRef.collection('modules');

            let totalVocabularyCount = 0;

            for (const file of files) {
                const filePath = path.join(dataDir, file);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                const docId = data.moduleId || data.module_id;

                console.log(`Uploading ${docId}: ${data.theme || data.name}...`);
                await modulesCol.doc(docId).set(data);

                const count = (data.lessons || data.vocabulary || []).length;
                totalVocabularyCount += count;
            }

            // Update Level Metadata
            console.log(`Updating ${level.toUpperCase()} metadata (Modules: ${files.length}, Words: ${totalVocabularyCount})...`);

            let description = '';
            if (level === 'a1') description = 'Beginner - Basic phrases and vocabulary';
            else if (level === 'a2') description = 'Elementary - Travel, Work and Media';
            else if (level === 'b1') description = 'Intermediate - Philosophy, Law and Abstract Science';

            await levelDocRef.set({
                levelId: level,
                name: level.toUpperCase(),
                description: description,
                moduleCount: 10,
                currentCount: files.length,
                wordCount: totalVocabularyCount,
                status: files.length >= 10 ? 'Complete' : 'In Progress',
                lastUpdated: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        }

        console.log('\n✅ Hindi curriculum upload complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Upload failed:', error);
        process.exit(1);
    }
}

uploadHindiCurriculum();
