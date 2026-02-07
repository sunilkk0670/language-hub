const fs = require('fs');
const path = require('path');

// Load L14 and baseline
const l14Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l14.json');
let l14Data = JSON.parse(fs.readFileSync(l14Path, 'utf8'));

const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

let seenInL14 = new Set();
l14Data.forEach(entry => seenInL14.add(entry.character));

console.log('L14 count:', l14Data.length);
console.log('Need:', 100 - l14Data.length);

// Final 3 unique N2/N1 Kanji
const final3 = [
    { "character": "汎", "on_yomi": "HAN", "kun_yomi": "none", "meaning": "Pan- / Wide / General", "stroke_count": 6, "mnemonic": "Water and a divination; pan." },
    { "character": "汰", "on_yomi": "TA", "kun_yomi": "none", "meaning": "Select / Excessive", "stroke_count": 7, "mnemonic": "Water and a big; select." },
    { "character": "沃", "on_yomi": "YOKU", "kun_yomi": "none", "meaning": "Fertile / Rich / Irrigate", "stroke_count": 7, "mnemonic": "Water and a person; fertile." }
];

let added = 0;
final3.forEach(entry => {
    if (!seenInL14.has(entry.character) && !baseline.has(entry.character) && l14Data.length < 100) {
        l14Data.push(entry);
        seenInL14.add(entry.character);
        added++;
        console.log(`Added: ${entry.character} - ${entry.meaning}`);
    }
});

console.log('\nAdded:', added);
console.log('Final L14 count:', l14Data.length);

if (l14Data.length === 100) {
    console.log('✅ L14 COMPLETE WITH 100 KANJI!');
}

fs.writeFileSync(l14Path, JSON.stringify(l14Data, null, 2), 'utf8');
console.log('Saved kanji_mastery_l14.json');
