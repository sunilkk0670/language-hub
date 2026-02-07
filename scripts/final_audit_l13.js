const fs = require('fs');
const path = require('path');

// Load all lessons L1-L13
const allFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json'
];

let allKanji = [];
let kanjiSet = new Set();
let duplicates = [];

allFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => {
            if (kanjiSet.has(entry.character)) {
                duplicates.push(entry.character);
            } else {
                kanjiSet.add(entry.character);
            }
            allKanji.push(entry.character);
        });
    }
});

console.log('=== FINAL AUDIT: L1-L13 ===');
console.log('Total Kanji entries:', allKanji.length);
console.log('Unique Kanji:', kanjiSet.size);
console.log('Duplicates:', duplicates.length);
if (duplicates.length > 0) {
    console.log('Duplicate characters:', duplicates.join(', '));
}

// Check L13 specifically
const l13 = JSON.parse(fs.readFileSync(path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l13.json'), 'utf8'));
console.log('\n=== L13 STATS ===');
console.log('L13 count:', l13.length);

let l13Set = new Set();
let l13InternalDups = [];
l13.forEach(entry => {
    if (l13Set.has(entry.character)) {
        l13InternalDups.push(entry.character);
    }
    l13Set.add(entry.character);
});

console.log('L13 unique:', l13Set.size);
console.log('L13 internal duplicates:', l13InternalDups.length);
if (l13InternalDups.length > 0) {
    console.log('L13 internal dups:', l13InternalDups.join(', '));
}

if (l13.length === 100 && l13Set.size === 100) {
    console.log('\n✅ L13 VERIFIED: 100 unique Kanji!');
} else {
    console.log('\n⚠️ L13 has issues!');
}
