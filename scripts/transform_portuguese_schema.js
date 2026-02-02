const fs = require('fs');
const path = require('path');

const dataDir = 'c:/Users/Sindhu/Desktop/chirp-polly/firestore_data';

function transformModule(mid) {
    const filePath = path.join(dataDir, `${mid}.json`);
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (data.vocabulary) {
        console.log(`Transforming ${mid} to lessons schema...`);
        const lessons = data.vocabulary.map(v => ({
            targetText: v.word,
            english: v.translation,
            phoneticTranscription: v.phonetic,
            radicalBreakdown: ""
        }));

        const transformed = {
            module_id: data.module_id,
            theme: data.name || data.theme,
            order: data.order,
            lessons: lessons,
            liarGameData: data.liar_game_traps && data.liar_game_traps.length > 0 ? {
                trap: data.liar_game_traps[0].term || data.liar_game_traps[0].trap,
                correctVersion: data.liar_game_traps[0].nuance || data.liar_game_traps[0].correctVersion,
                explanation: `Trap level: ${data.liar_game_traps[0].trap_level || "High"}`
            } : (data.liarGameData || null)
        };

        if (!transformed.liarGameData) delete transformed.liarGameData;

        fs.writeFileSync(filePath, JSON.stringify(transformed, null, 2));
        console.log(`✅ Transformed ${mid}.json`);
    } else {
        console.log(`${mid}.json is already in lessons schema.`);
    }
}

transformModule('pt_a1_m01');
transformModule('pt_a1_m02');
transformModule('pt_a1_m03');
transformModule('pt_a1_m04');
