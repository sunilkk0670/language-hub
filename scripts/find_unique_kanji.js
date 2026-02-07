const fs = require('fs');
const path = require('path');

const files = [
    'kanji_mastery_l1.json',
    'kanji_mastery_l2.json',
    'kanji_mastery_l3.json',
    'kanji_mastery_l4.json',
    'kanji_mastery_l5.json',
    'kanji_mastery_l6.json',
    'kanji_mastery_l7.json',
    'kanji_mastery_l8.json',
    'kanji_mastery_l9.json'
];

let baseline = new Set();
files.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

// N3/N2 Kanji candidates that might be missing
const candidates = "避拠監企抑圏併棄飾獲輝爆脱拒抵拠契壊襲融震躍捜搬潜爆".split(""); // Some of these might be in baseline
// Adding more:
const more = "範微召枯伺劣削励墓郊郭郡脈脂".split("");

let newUnique = [];
[...candidates, ...more].forEach(c => {
    if (!baseline.has(c) && !newUnique.includes(c)) {
        newUnique.push(c);
    }
});

console.log('Found', newUnique.length, 'unique Kanji:', newUnique.join(', '));
