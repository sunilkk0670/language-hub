const fs = require('fs');
const path = require('path');

// Load L20 and baseline
const l20Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l20.json');
let l20Data = JSON.parse(fs.readFileSync(l20Path, 'utf8'));

const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json',
    'kanji_mastery_l16.json', 'kanji_mastery_l17.json', 'kanji_mastery_l18.json',
    'kanji_mastery_l19.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

let seenInL20 = new Set();
l20Data.forEach(entry => seenInL20.add(entry.character));

console.log('L20 count:', l20Data.length);
console.log('Need:', 100 - l20Data.length);

// Final 1 unique N1 Kanji (bird鳥 radical)
const final1 = [
    { "character": "鷦", "on_yomi": "SHOU", "kun_yomi": "misosazai", "meaning": "Wren", "stroke_count": 23, "mnemonic": "Bird and a focus/burn; tiny wren." }
];

let added = 0;
final1.forEach(entry => {
    if (!seenInL20.has(entry.character) && !baseline.has(entry.character) && l20Data.length < 100) {
        l20Data.push(entry);
        seenInL20.add(entry.character);
        added++;
        console.log(`Added: ${entry.character} - ${entry.meaning}`);
    }
});

console.log('\nAdded:', added);
console.log('Final L20 count:', l20Data.length);

if (l20Data.length === 100) {
    console.log('✅ L20 COMPLETE WITH 100 KANJI!');
}

fs.writeFileSync(l20Path, JSON.stringify(l20Data, null, 2), 'utf8');
console.log('Saved kanji_mastery_l20.json');
