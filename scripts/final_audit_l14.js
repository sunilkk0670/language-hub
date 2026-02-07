const fs = require('fs');
const path = require('path');

// Load all lessons L1-L14
const allFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json'
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

console.log('=== FINAL AUDIT: L1-L14 ===');
console.log('Total Kanji entries:', allKanji.length);
console.log('Unique Kanji:', kanjiSet.size);
console.log('Duplicates:', duplicates.length);
if (duplicates.length > 0) {
    console.log('Duplicate characters:', duplicates.join(', '));
}

// Check L14 specifically
const l14 = JSON.parse(fs.readFileSync(path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l14.json'), 'utf8'));
console.log('\n=== L14 STATS ===');
console.log('L14 count:', l14.length);

let l14Set = new Set();
let l14InternalDups = [];
l14.forEach(entry => {
    if (l14Set.has(entry.character)) {
        l14InternalDups.push(entry.character);
    }
    l14Set.add(entry.character);
});

console.log('L14 unique:', l14Set.size);
console.log('L14 internal duplicates:', l14InternalDups.length);
if (l14InternalDups.length > 0) {
    console.log('L14 internal dups:', l14InternalDups.join(', '));
}

if (l14.length === 100 && l14Set.size === 100) {
    console.log('\n✅ L14 VERIFIED: 100 unique Kanji!');
} else {
    console.log('\n⚠️ L14 has issues!');
}
