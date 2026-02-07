const fs = require('fs');
const path = require('path');

// Load all lessons L1-L18
const allFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json',
    'kanji_mastery_l16.json', 'kanji_mastery_l17.json', 'kanji_mastery_l18.json'
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

console.log('=== FINAL AUDIT: L1-L18 ===');
console.log('Total Kanji entries:', allKanji.length);
console.log('Unique Kanji:', kanjiSet.size);
console.log('Duplicates:', duplicates.length);
if (duplicates.length > 0) {
    console.log('Duplicate characters:', duplicates.join(', '));
}

// Check L18 specifically
const l18 = JSON.parse(fs.readFileSync(path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l18.json'), 'utf8'));
console.log('\n=== L18 STATS ===');
console.log('L18 count:', l18.length);

let l18Set = new Set();
let l18InternalDups = [];
l18.forEach(entry => {
    if (l18Set.has(entry.character)) {
        l18InternalDups.push(entry.character);
    }
    l18Set.add(entry.character);
});

console.log('L18 unique:', l18Set.size);
console.log('L18 internal duplicates:', l18InternalDups.length);
if (l18InternalDups.length > 0) {
    console.log('L18 internal dups:', l18InternalDups.join(', '));
}

if (l18.length === 100 && l18Set.size === 100) {
    console.log('\n✅ L18 VERIFIED: 100 unique Kanji!');
} else {
    console.log('\n⚠️ L18 has issues!');
}
