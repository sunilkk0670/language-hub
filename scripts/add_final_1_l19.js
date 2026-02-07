const fs = require('fs');
const path = require('path');

// Load L19 and baseline
const l19Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l19.json');
let l19Data = JSON.parse(fs.readFileSync(l19Path, 'utf8'));

const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json',
    'kanji_mastery_l16.json', 'kanji_mastery_l17.json', 'kanji_mastery_l18.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

let seenInL19 = new Set();
l19Data.forEach(entry => seenInL19.add(entry.character));

console.log('L19 count:', l19Data.length);
console.log('Need:', 100 - l19Data.length);

// Final 1 unique N1 Kanji (insect虫 radical)
const final1 = [
    { "character": "蟲", "on_yomi": "CHUU", "kun_yomi": "mushi", "meaning": "Insect / Bug / Worm", "stroke_count": 18, "mnemonic": "Three insects together; the concept of bugs." }
];

let added = 0;
final1.forEach(entry => {
    if (!seenInL19.has(entry.character) && !baseline.has(entry.character) && l19Data.length < 100) {
        l19Data.push(entry);
        seenInL19.add(entry.character);
        added++;
        console.log(`Added: ${entry.character} - ${entry.meaning}`);
    }
});

console.log('\nAdded:', added);
console.log('Final L19 count:', l19Data.length);

if (l19Data.length === 100) {
    console.log('✅ L19 COMPLETE WITH 100 KANJI!');
}

fs.writeFileSync(l19Path, JSON.stringify(l19Data, null, 2), 'utf8');
console.log('Saved kanji_mastery_l19.json');
