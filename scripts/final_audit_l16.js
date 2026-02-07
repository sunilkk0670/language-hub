const fs = require('fs');
const path = require('path');

// Load all lessons L1-L16
const allFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json',
    'kanji_mastery_l16.json'
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

console.log('=== FINAL AUDIT: L1-L16 ===');
console.log('Total Kanji entries:', allKanji.length);
console.log('Unique Kanji:', kanjiSet.size);
console.log('Duplicates:', duplicates.length);
if (duplicates.length > 0) {
    console.log('Duplicate characters:', duplicates.join(', '));
}

// Check L16 specifically
const l16 = JSON.parse(fs.readFileSync(path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l16.json'), 'utf8'));
console.log('\n=== L16 STATS ===');
console.log('L16 count:', l16.length);

let l16Set = new Set();
let l16InternalDups = [];
l16.forEach(entry => {
    if (l16Set.has(entry.character)) {
        l16InternalDups.push(entry.character);
    }
    l16Set.add(entry.character);
});

console.log('L16 unique:', l16Set.size);
console.log('L16 internal duplicates:', l16InternalDups.length);
if (l16InternalDups.length > 0) {
    console.log('L16 internal dups:', l16InternalDups.join(', '));
}

if (l16.length === 100 && l16Set.size === 100) {
    console.log('\n✅ L16 VERIFIED: 100 unique Kanji!');
} else {
    console.log('\n⚠️ L16 has issues!');
}
