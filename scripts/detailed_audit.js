const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../firestore_data');
const files = fs.readdirSync(dataDir).filter(f => (f.startsWith('hi_a1_m') || f.startsWith('hi_a2_m') || f.startsWith('hi_b1_m')) && f.endsWith('.json'));

let wordMap = {};
let duplicates = [];

files.sort().forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    const items = data.lessons || data.vocabulary || [];

    items.forEach((item, index) => {
        const word = item.word.trim();
        const translation = item.translation || item.meaning;
        if (wordMap[word]) {
            duplicates.push({
                word: word,
                translation: translation,
                file: file,
                index: index,
                originalFile: wordMap[word]
            });
        } else {
            wordMap[word] = file;
        }
    });
});

console.log(JSON.stringify(duplicates, null, 2));
