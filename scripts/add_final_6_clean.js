const fs = require('fs');
const path = require('path');

// Load L12 and baseline
const l12Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l12.json');
let l12Data = JSON.parse(fs.readFileSync(l12Path, 'utf8'));

const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

let seenInL12 = new Set();
l12Data.forEach(entry => seenInL12.add(entry.character));

console.log('L12 count:', l12Data.length);
console.log('Need:', 100 - l12Data.length);

// Final 6 unique N2/N1 Kanji - from diverse radical families
const final6 = [
    { "character": "賜", "on_yomi": "SHI", "kun_yomi": "tamawa-ru", "meaning": "Grant / Bestow", "stroke_count": 15, "mnemonic": "Shells貝 given易; imperial grant." },
    { "character": "賓", "on_yomi": "HIN", "kun_yomi": "none", "meaning": "Guest / Visitor", "stroke_count": 15, "mnemonic": "Shells貝 for a guest宾; honored visitor." },
    { "character": "賠", "on_yomi": "BAI", "kun_yomi": "none", "meaning": "Compensate / Indemnify", "stroke_count": 15, "mnemonic": "Shells貝 to accompany陪; compensation." },
    { "character": "賂", "on_yomi": "RO", "kun_yomi": "none", "meaning": "Bribe", "stroke_count": 13, "mnemonic": "Shells貝 on a path路; bribe." },
    { "character": "賊", "on_yomi": "ZOKU", "kun_yomi": "none", "meaning": "Thief / Rebel", "stroke_count": 13, "mnemonic": "Shells貝 and a halberd戈; thief." },
    { "character": "賜", "on_yomi": "SHI", "kun_yomi": "tamawa-ru", "meaning": "Bestow", "stroke_count": 15, "mnemonic": "Shells貝 given易; bestow." }
];

let added = 0;
final6.forEach(entry => {
    if (!seenInL12.has(entry.character) && !baseline.has(entry.character) && l12Data.length < 100) {
        l12Data.push(entry);
        seenInL12.add(entry.character);
        added++;
        console.log(`Added: ${entry.character} - ${entry.meaning}`);
    } else {
        console.log(`Skipped: ${entry.character} - already exists`);
    }
});

console.log('\nAdded:', added);
console.log('Final L12 count:', l12Data.length);

if (l12Data.length === 100) {
    console.log('✅ L12 COMPLETE WITH 100 KANJI!');
} else {
    console.log(`⚠️ Still need ${100 - l12Data.length} more Kanji`);
}

fs.writeFileSync(l12Path, JSON.stringify(l12Data, null, 2), 'utf8');
console.log('Saved kanji_mastery_l12.json');
