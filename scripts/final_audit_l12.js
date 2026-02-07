const fs = require('fs');
const path = require('path');

// Load all lessons L1-L12
const allFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json'
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

console.log('=== FINAL AUDIT: L1-L12 ===');
console.log('Total Kanji entries:', allKanji.length);
console.log('Unique Kanji:', kanjiSet.size);
console.log('Duplicates:', duplicates.length);
if (duplicates.length > 0) {
    console.log('Duplicate characters:', duplicates.join(', '));
}

// Check L12 specifically
const l12 = JSON.parse(fs.readFileSync(path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l12.json'), 'utf8'));
console.log('\n=== L12 STATS ===');
console.log('L12 count:', l12.length);

let l12Set = new Set();
let l12InternalDups = [];
l12.forEach(entry => {
    if (l12Set.has(entry.character)) {
        l12InternalDups.push(entry.character);
    }
    l12Set.add(entry.character);
});

console.log('L12 unique:', l12Set.size);
console.log('L12 internal duplicates:', l12InternalDups.length);
if (l12InternalDups.length > 0) {
    console.log('L12 internal dups:', l12InternalDups.join(', '));
}

if (l12.length === 100 && l12Set.size === 100) {
    console.log('\n✅ L12 VERIFIED: 100 unique Kanji!');
} else {
    console.log('\n⚠️ L12 has issues!');
}
