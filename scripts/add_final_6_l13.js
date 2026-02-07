const fs = require('fs');
const path = require('path');

// Load L13 and baseline
const l13Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l13.json');
let l13Data = JSON.parse(fs.readFileSync(l13Path, 'utf8'));

const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

let seenInL13 = new Set();
l13Data.forEach(entry => seenInL13.add(entry.character));

console.log('L13 count:', l13Data.length);
console.log('Need:', 100 - l13Data.length);

// Final 6 unique N2/N1 Kanji
const final6 = [
    { "character": "碧", "on_yomi": "HEKI", "kun_yomi": "none", "meaning": "Blue / Green / Jade", "stroke_count": 14, "mnemonic": "Stone石 with white白 and king王; jade green." },
    { "character": "磐", "on_yomi": "BAN", "kun_yomi": "none", "meaning": "Rock / Crag", "stroke_count": 15, "mnemonic": "Stone石 on a boat般; solid rock." },
    { "character": "礁", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Reef / Shoal", "stroke_count": 17, "mnemonic": "Stone石 focus焦; reef." },
    { "character": "祁", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Pray / Auspicious", "stroke_count": 8, "mnemonic": "Altar示 with a sign; prayer." },
    { "character": "禄", "on_yomi": "ROKU", "kun_yomi": "none", "meaning": "Salary / Blessing", "stroke_count": 12, "mnemonic": "Altar示 with valley谷; blessing/salary." },
    { "character": "禎", "on_yomi": "TEI", "kun_yomi": "none", "meaning": "Lucky / Auspicious", "stroke_count": 13, "mnemonic": "Altar示 with upright貞; auspicious." }
];

let added = 0;
final6.forEach(entry => {
    if (!seenInL13.has(entry.character) && !baseline.has(entry.character) && l13Data.length < 100) {
        l13Data.push(entry);
        seenInL13.add(entry.character);
        added++;
        console.log(`Added: ${entry.character} - ${entry.meaning}`);
    }
});

console.log('\nAdded:', added);
console.log('Final L13 count:', l13Data.length);

if (l13Data.length === 100) {
    console.log('✅ L13 COMPLETE WITH 100 KANJI!');
}

fs.writeFileSync(l13Path, JSON.stringify(l13Data, null, 2), 'utf8');
console.log('Saved kanji_mastery_l13.json');
