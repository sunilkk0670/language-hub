const fs = require('fs');
const path = require('path');

// Load L15 and baseline
const l15Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l15.json');
let l15Data = JSON.parse(fs.readFileSync(l15Path, 'utf8'));

const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

let seenInL15 = new Set();
l15Data.forEach(entry => seenInL15.add(entry.character));

console.log('L15 count:', l15Data.length);
console.log('Need:', 100 - l15Data.length);

// Final 2 unique N2/N1 Kanji
const final2 = [
    { "character": "詰", "on_yomi": "KITSU", "kun_yomi": "tsu-meru", "meaning": "Pack / Cram / Rebuke", "stroke_count": 13, "mnemonic": "Words and a good luck; pack." },
    { "character": "詳", "on_yomi": "SHOU", "kun_yomi": "kuwa-shii", "meaning": "Detailed / Full", "stroke_count": 13, "mnemonic": "Words and a sheep; detailed." }
];

let added = 0;
final2.forEach(entry => {
    if (!seenInL15.has(entry.character) && !baseline.has(entry.character) && l15Data.length < 100) {
        l15Data.push(entry);
        seenInL15.add(entry.character);
        added++;
        console.log(`Added: ${entry.character} - ${entry.meaning}`);
    }
});

console.log('\nAdded:', added);
console.log('Final L15 count:', l15Data.length);

if (l15Data.length === 100) {
    console.log('✅ L15 COMPLETE WITH 100 KANJI!');
}

fs.writeFileSync(l15Path, JSON.stringify(l15Data, null, 2), 'utf8');
console.log('Saved kanji_mastery_l15.json');
