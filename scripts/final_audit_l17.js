const fs = require('fs');
const path = require('path');

// Load all lessons L1-L17
const allFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json',
    'kanji_mastery_l16.json', 'kanji_mastery_l17.json'
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

console.log('=== FINAL AUDIT: L1-L17 ===');
console.log('Total Kanji entries:', allKanji.length);
console.log('Unique Kanji:', kanjiSet.size);
console.log('Duplicates:', duplicates.length);
if (duplicates.length > 0) {
    console.log('Duplicate characters:', duplicates.join(', '));
}

// Check L17 specifically
const l17 = JSON.parse(fs.readFileSync(path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l17.json'), 'utf8'));
console.log('\n=== L17 STATS ===');
console.log('L17 count:', l17.length);

let l17Set = new Set();
let l17InternalDups = [];
l17.forEach(entry => {
    if (l17Set.has(entry.character)) {
        l17InternalDups.push(entry.character);
    }
    l17Set.add(entry.character);
});

console.log('L17 unique:', l17Set.size);
console.log('L17 internal duplicates:', l17InternalDups.length);
if (l17InternalDups.length > 0) {
    console.log('L17 internal dups:', l17InternalDups.join(', '));
}

if (l17.length === 100 && l17Set.size === 100) {
    console.log('\n✅ L17 VERIFIED: 100 unique Kanji!');
} else {
    console.log('\n⚠️ L17 has issues!');
}
