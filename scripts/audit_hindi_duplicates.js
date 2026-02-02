const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../firestore_data');
const files = fs.readdirSync(dataDir).filter(f => (f.startsWith('hi_a1_m') || f.startsWith('hi_a2_m') || f.startsWith('hi_b1_m')) && f.endsWith('.json'));

let allWords = [];
let wordMap = {};
let duplicates = [];

console.log(`--- HINDI A1 DUPLICATE AUDIT (M01 - M${files.length.toString().padStart(2, '0')}) ---\n`);

files.sort().forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    const items = data.lessons || data.vocabulary || [];

    items.forEach(item => {
        const word = item.word.trim();
        if (wordMap[word]) {
            duplicates.push({
                word: word,
                firstFound: wordMap[word],
                currentFile: file
            });
        } else {
            wordMap[word] = file;
            allWords.push(word);
        }
    });
});

console.log(`Total Words Scanned: ${allWords.length + duplicates.length}`);
console.log(`Unique Words: ${allWords.length}`);
console.log(`Duplicates Found: ${duplicates.length}`);

if (duplicates.length > 0) {
    console.log('\n--- DUPLICATE DETAILS ---');
    duplicates.forEach(d => {
        console.log(`❌ "${d.word}" found in ${d.currentFile} (Already exists in ${d.firstFound})`);
    });
} else {
    console.log('\n✅ 100% CLEAN: Zero overlaps found across all 600 words.');
}
