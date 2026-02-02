const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function fixPortugueseModuleSchema() {
    try {
        console.log('Fixing Portuguese module schema to match German pattern...\n');

        const modulesRef = db.collection('languages').doc('portuguese')
            .collection('levels').doc('a1')
            .collection('modules');

        const snapshot = await modulesRef.get();

        for (const doc of snapshot.docs) {
            const data = doc.data();

            // Transform vocabulary array to lessons array
            const lessons = data.vocabulary.map(item => ({
                targetText: item.word,
                phoneticTranscription: item.phonetic,
                english: item.translation,
                radicalBreakdown: "" // Portuguese doesn't have radical breakdown
            }));

            // Create the corrected module data
            const correctedData = {
                theme: data.name, // Rename 'name' to 'theme'
                order: data.order,
                lessons: lessons, // Rename 'vocabulary' to 'lessons' with transformed structure
                liarGameData: data.liar_game_traps && data.liar_game_traps.length > 0 ? {
                    trap: data.liar_game_traps[0].term,
                    correctVersion: data.liar_game_traps[0].nuance,
                    explanation: `Trap level: ${data.liar_game_traps[0].trap_level}`
                } : null
            };

            // Remove null liarGameData if it doesn't exist
            if (!correctedData.liarGameData) {
                delete correctedData.liarGameData;
            }

            // Update the document
            await doc.ref.set(correctedData);
            console.log(`✓ Fixed ${doc.id}: ${correctedData.theme} (${correctedData.lessons.length} lessons)`);
        }

        console.log('\n✅ Portuguese module schema fixed successfully!');
        console.log('Modules now use theme/lessons structure like German');

    } catch (error) {
        console.error('Error fixing schema:', error);
    }
}

fixPortugueseModuleSchema();
