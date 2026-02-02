const fs = require('fs');
const path = require('path');

const dataDir = 'c:/Users/Sindhu/Desktop/chirp-polly/firestore_data';

function fixModule(filename, replacements) {
    const filePath = path.join(dataDir, filename);
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Determine the array name
    const arrayName = data.lessons ? 'lessons' : 'vocabulary';
    const textKey = data.lessons ? 'targetText' : 'word';
    const translationKey = data.lessons ? 'english' : 'translation';
    const phoneticKey = data.lessons ? 'phoneticTranscription' : 'phonetic';

    let changed = false;
    data[arrayName].forEach((item, index) => {
        const word = item[textKey].toLowerCase().trim();
        if (replacements[word]) {
            // Check if we should replace based on specific translation or just all occurrences
            if (typeof replacements[word] === 'string') {
                item[textKey] = replacements[word];
                changed = true;
            } else if (replacements[word][item[translationKey]]) {
                item[textKey] = replacements[word][item[translationKey]];
                changed = true;
            } else if (replacements[word].all) {
                item[textKey] = replacements[word].all;
                changed = true;
            }
        }
    });

    if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`✅ Fixed ${filename}`);
    }
}

// Special handling for M02 internal duplicates
function fixM02() {
    const filePath = path.join(dataDir, 'pt_a1_m02.json');
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const vocabulary = data.vocabulary;

    // Fix Segundo (time) at index 64 (zero-based)
    if (vocabulary[64].word === 'Segundo' && vocabulary[64].translation === 'Second (time)') {
        vocabulary[64].word = 'Instante';
        vocabulary[64].translation = 'Instant';
        vocabulary[64].phonetic = 'In-stan-chee';
    }

    // Fix Tarde (late) at index 74 (zero-based)
    if (vocabulary[74].word === 'Tarde' && vocabulary[74].translation === 'Late') {
        vocabulary[74].word = 'Atrasado';
        vocabulary[74].translation = 'Late/Delayed';
        vocabulary[74].phonetic = 'A-tra-zah-doo';
    }

    // Fix Devagar (slow) at index 98 (zero-based)
    if (vocabulary[98].word === 'Devagar' && vocabulary[98].translation === 'Slow') {
        vocabulary[98].word = 'Lento';
        vocabulary[98].translation = 'Slow';
        vocabulary[98].phonetic = 'Len-too';
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('✅ Fixed M02 internal duplicates');
}

// Fix M03 overlaps
fixModule('pt_a1_m03.json', {
    'velho': 'Idoso',
    'ajudar': 'Auxiliar',
    'nascimento': 'Naturalidade'
});

// Fix M04 overlaps
fixModule('pt_a1_m04.json', {
    'mais': 'Extra',
    'menos': 'Reduzido'
});

// Fix M02 internals
fixM02();
