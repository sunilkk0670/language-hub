const fs = require('fs');
const path = require('path');

const files = [
    'kanji_mastery_l1.json',
    'kanji_mastery_l2.json',
    'kanji_mastery_l3.json',
    'kanji_mastery_l4.json',
    'kanji_mastery_l5.json',
    'kanji_mastery_l6.json',
    'kanji_mastery_l7.json',
    'kanji_mastery_l8.json',
    'kanji_mastery_l9.json',
    'kanji_mastery_l10.json',
    'kanji_mastery_l11.json'
];

let allKanji = new Map();
let duplicates = [];

files.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach((entry, index) => {
            if (allKanji.has(entry.character)) {
                duplicates.push({
                    character: entry.character,
                    first: allKanji.get(entry.character),
                    second: { file, index: index + 1 }
                });
            } else {
                allKanji.set(entry.character, { file, index: index + 1 });
            }
        });
    }
});

console.log('Total unique Kanji L1-L10:', allKanji.size);
if (duplicates.length > 0) {
    console.log('Duplicates found:', JSON.stringify(duplicates, null, 2));
} else {
    console.log('✅ No duplicates found!');
}
