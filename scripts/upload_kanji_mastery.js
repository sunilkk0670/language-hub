const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();
const firestoreDataDir = path.join(__dirname, '..', 'firestore_data');

async function uploadKanjiMastery() {
    console.log('\n' + '='.repeat(80));
    console.log('UPLOADING KANJI MASTERY TO FIRESTORE');
    console.log('='.repeat(80) + '\n');

    const lessons = [
        { id: 'L1', file: 'kanji_mastery_l1.json', name: 'N5 Foundation', level: 'N5' },
        { id: 'L2', file: 'kanji_mastery_l2.json', name: 'N4 Basics Part 1', level: 'N4' },
        { id: 'L3', file: 'kanji_mastery_l3.json', name: 'N4 Basics Part 2', level: 'N4' },
        { id: 'L4', file: 'kanji_mastery_l4.json', name: 'N4 Basics Part 3', level: 'N4' },
        { id: 'L5', file: 'kanji_mastery_l5.json', name: 'N3 Basics Part 1', level: 'N3' },
        { id: 'L6', file: 'kanji_mastery_l6.json', name: 'N3 Basics Part 2', level: 'N3' },
        { id: 'L7', file: 'kanji_mastery_l7.json', name: 'N3 Mastery Part 3', level: 'N3' },
        { id: 'L8', file: 'kanji_mastery_l8.json', name: 'N3 Mastery Part 4', level: 'N3' },
        { id: 'L9', file: 'kanji_mastery_l9.json', name: 'N3 Mastery Part 5', level: 'N3' },
        { id: 'L10', file: 'kanji_mastery_l10.json', name: 'N3 Mastery Part 6', level: 'N3' },
        { id: 'L11', file: 'kanji_mastery_l11.json', name: 'N3 Completion', level: 'N3' },
        { id: 'L12', file: 'kanji_mastery_l12.json', name: 'N2 Foundation Part 1', level: 'N2' },
        { id: 'L13', file: 'kanji_mastery_l13.json', name: 'N2 Foundation Part 2', level: 'N2' },
        { id: 'L14', file: 'kanji_mastery_l14.json', name: 'N2 Mastery Part 1', level: 'N2' },
        { id: 'L15', file: 'kanji_mastery_l15.json', name: 'N2 Mastery Part 2', level: 'N2' },
        { id: 'L16', file: 'kanji_mastery_l16.json', name: 'N2 Mastery Part 3', level: 'N2' },
        { id: 'L17', file: 'kanji_mastery_l17.json', name: 'N2 Mastery Part 4', level: 'N2' },
        { id: 'L18', file: 'kanji_mastery_l18.json', name: 'N1 Advanced Part 1', level: 'N1' },
        { id: 'L19', file: 'kanji_mastery_l19.json', name: 'N1 Advanced Part 2', level: 'N1' },
        { id: 'L20', file: 'kanji_mastery_l20.json', name: 'N1 Advanced Part 3', level: 'N1' },
        { id: 'L21', file: 'kanji_mastery_l21.json', name: 'N1 Completion', level: 'N1' }
    ];

    // Ensure top-level document exists
    console.log('📂 Setting up mastery_modules/japanese_kanji');
    await db.collection('mastery_modules').doc('japanese_kanji').set({
        language: 'Japanese',
        type: 'Kanji',
        total_lessons: 21,
        total_kanji: 2100,
        last_updated: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    for (const lesson of lessons) {
        const filePath = path.join(firestoreDataDir, lesson.file);
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️ Skip ${lesson.id}: File ${lesson.file} not found.`);
            continue;
        }

        const kanjiData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        console.log(`📤 Uploading ${lesson.id}: ${lesson.name} (${lesson.level})`);
        console.log(`   Kanji Count: ${kanjiData.length}`);

        // Upload to mastery_modules/japanese_kanji/lessons/LX
        const docRef = db.collection('mastery_modules')
            .doc('japanese_kanji')
            .collection('lessons')
            .doc(lesson.id);

        await docRef.set({
            lesson_id: lesson.id,
            name: lesson.name,
            level: lesson.level,
            kanji_data: kanjiData,
            order: parseInt(lesson.id.replace('L', '')),
            updated_at: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: false });

        console.log(`   ✅ Uploaded successfully\n`);
    }

    console.log('='.repeat(80));
    console.log('✅ KANJI UPLOAD COMPLETE');
    console.log('='.repeat(80));

    process.exit(0);
}

uploadKanjiMastery().catch(error => {
    console.error('❌ Upload failed:', error);
    process.exit(1);
});
