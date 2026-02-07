const fs = require('fs');
const path = require('path');

// Load L16 and baseline
const l16Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l16.json');
let l16Data = JSON.parse(fs.readFileSync(l16Path, 'utf8'));

const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

let seenInL16 = new Set();
l16Data.forEach(entry => seenInL16.add(entry.character));

console.log('L16 count:', l16Data.length);
console.log('Need:', 100 - l16Data.length);

// Final 1 unique N2/N1 Kanji
const final1 = [
    { "character": "庹", "on_yomi": "TAKU", "kun_yomi": "none", "meaning": "Fathom / Measure", "stroke_count": 11, "mnemonic": "Roof and a hand measuring; fathom." }
];

let added = 0;
final1.forEach(entry => {
    if (!seenInL16.has(entry.character) && !baseline.has(entry.character) && l16Data.length < 100) {
        l16Data.push(entry);
        seenInL16.add(entry.character);
        added++;
        console.log(`Added: ${entry.character} - ${entry.meaning}`);
    }
});

console.log('\nAdded:', added);
console.log('Final L16 count:', l16Data.length);

if (l16Data.length === 100) {
    console.log('✅ L16 COMPLETE WITH 100 KANJI!');
}

fs.writeFileSync(l16Path, JSON.stringify(l16Data, null, 2), 'utf8');
console.log('Saved kanji_mastery_l16.json');
