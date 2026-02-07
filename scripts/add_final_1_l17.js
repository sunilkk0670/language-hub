const fs = require('fs');
const path = require('path');

// Load L17 and baseline
const l17Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l17.json');
let l17Data = JSON.parse(fs.readFileSync(l17Path, 'utf8'));

const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json',
    'kanji_mastery_l16.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

let seenInL17 = new Set();
l17Data.forEach(entry => seenInL17.add(entry.character));

console.log('L17 count:', l17Data.length);
console.log('Need:', 100 - l17Data.length);

// Final 1 unique N2/N1 Kanji (clothing衣 radical)
const final1 = [
    { "character": "裾", "on_yomi": "KYO", "kun_yomi": "suso", "meaning": "Hem / Skirt / Cuff", "stroke_count": 14, "mnemonic": "Clothing and a reside; hem." }
];

let added = 0;
final1.forEach(entry => {
    if (!seenInL17.has(entry.character) && !baseline.has(entry.character) && l17Data.length < 100) {
        l17Data.push(entry);
        seenInL17.add(entry.character);
        added++;
        console.log(`Added: ${entry.character} - ${entry.meaning}`);
    }
});

console.log('\nAdded:', added);
console.log('Final L17 count:', l17Data.length);

if (l17Data.length === 100) {
    console.log('✅ L17 COMPLETE WITH 100 KANJI!');
}

fs.writeFileSync(l17Path, JSON.stringify(l17Data, null, 2), 'utf8');
console.log('Saved kanji_mastery_l17.json');
