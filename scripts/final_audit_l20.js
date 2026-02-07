const fs = require('fs');
const path = require('path');

// Load all lessons L1-L20
const allFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json',
    'kanji_mastery_l16.json', 'kanji_mastery_l17.json', 'kanji_mastery_l18.json',
    'kanji_mastery_l19.json', 'kanji_mastery_l20.json'
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

console.log('=== FINAL AUDIT: L1-L20 ===');
console.log('Total Kanji entries:', allKanji.length);
console.log('Unique Kanji:', kanjiSet.size);
console.log('Duplicates:', duplicates.length);
if (duplicates.length > 0) {
    console.log('Duplicate characters:', duplicates.join(', '));
}

// Check L20 specifically
const l20 = JSON.parse(fs.readFileSync(path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l20.json'), 'utf8'));
console.log('\n=== L20 STATS ===');
console.log('L20 count:', l20.length);

let l20Set = new Set();
let l20InternalDups = [];
l20.forEach(entry => {
    if (l20Set.has(entry.character)) {
        l20InternalDups.push(entry.character);
    }
    l20Set.add(entry.character);
});

console.log('L20 unique:', l20Set.size);
console.log('L20 internal duplicates:', l20InternalDups.length);
if (l20InternalDups.length > 0) {
    console.log('L20 internal dups:', l20InternalDups.join(', '));
}

if (l20.length === 100 && l20Set.size === 100) {
    console.log('\n✅ L20 VERIFIED: 100 unique Kanji!');
} else {
    console.log('\n⚠️ L20 has issues!');
}
