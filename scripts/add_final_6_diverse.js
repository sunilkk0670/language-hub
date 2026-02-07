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

// 6 completely new unique N2/N1 Kanji - from DIVERSE radical families (NOT 貝 or 言)
const final6Diverse = [
    { "character": "勅", "on_yomi": "CHOKU", "kun_yomi": "none", "meaning": "Imperial order", "stroke_count": 9, "mnemonic": "Power力 from a bundle束; imperial command." },
    { "character": "勲", "on_yomi": "KUN", "kun_yomi": "none", "meaning": "Merit / Meritorious deed", "stroke_count": 15, "mnemonic": "Power力 and smoke熏; distinguished service." },
    { "character": "薫", "on_yomi": "KUN", "kun_yomi": "kaoru", "meaning": "Fragrance / Scent", "stroke_count": 16, "mnemonic": "Grass艹 and smoke熏; fragrant aroma." },
    { "character": "勘", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Intuition / Perception", "stroke_count": 11, "mnemonic": "Power力 to investigate甚; intuition." },
    { "character": "勧", "on_yomi": "KAN", "kun_yomi": "susu-meru", "meaning": "Recommend / Advise", "stroke_count": 13, "mnemonic": "Power力 with many雚 words; recommendation." },
    { "character": "勃", "on_yomi": "BOTSU", "kun_yomi": "none", "meaning": "Sudden / Vigorous", "stroke_count": 9, "mnemonic": "Power力 that is not不; sudden rise." }
];

let added = 0;
final6Diverse.forEach(entry => {
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
