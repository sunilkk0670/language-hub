const fs = require('fs');
const path = require('path');

// Load all lessons L1-L15
const allFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json'
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

console.log('=== FINAL AUDIT: L1-L15 ===');
console.log('Total Kanji entries:', allKanji.length);
console.log('Unique Kanji:', kanjiSet.size);
console.log('Duplicates:', duplicates.length);
if (duplicates.length > 0) {
    console.log('Duplicate characters:', duplicates.join(', '));
}

// Check L15 specifically
const l15 = JSON.parse(fs.readFileSync(path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l15.json'), 'utf8'));
console.log('\n=== L15 STATS ===');
console.log('L15 count:', l15.length);

let l15Set = new Set();
let l15InternalDups = [];
l15.forEach(entry => {
    if (l15Set.has(entry.character)) {
        l15InternalDups.push(entry.character);
    }
    l15Set.add(entry.character);
});

console.log('L15 unique:', l15Set.size);
console.log('L15 internal duplicates:', l15InternalDups.length);
if (l15InternalDups.length > 0) {
    console.log('L15 internal dups:', l15InternalDups.join(', '));
}

if (l15.length === 100 && l15Set.size === 100) {
    console.log('\n✅ L15 VERIFIED: 100 unique Kanji!');
} else {
    console.log('\n⚠️ L15 has issues!');
}
