const fs = require('fs');
const path = require('path');

// Load L15 and baseline
const l15Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l15.json');
let l15Data = JSON.parse(fs.readFileSync(l15Path, 'utf8'));

const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

let seenInL15 = new Set();
l15Data.forEach(entry => seenInL15.add(entry.character));

console.log('L15 count:', l15Data.length);
console.log('Need:', 100 - l15Data.length);

// Final 11 unique N2/N1 Kanji
const final11 = [
    { "character": "訊", "on_yomi": "JIN", "kun_yomi": "none", "meaning": "Inquire / Question", "stroke_count": 10, "mnemonic": "Words and a ten; inquire." },
    { "character": "訛", "on_yomi": "KA", "kun_yomi": "namari", "meaning": "Accent / Dialect / Mistake", "stroke_count": 11, "mnemonic": "Words and a change; dialect." },
    { "character": "訣", "on_yomi": "KETSU", "kun_yomi": "none", "meaning": "Parting / Farewell / Secret", "stroke_count": 11, "mnemonic": "Words and a decide; parting." },
    { "character": "訥", "on_yomi": "TOTSU", "kun_yomi": "none", "meaning": "Slow of speech / Inarticulate", "stroke_count": 11, "mnemonic": "Words and a inside; slow speech." },
    { "character": "訴", "on_yomi": "SO", "kun_yomi": "utta-eru", "meaning": "Sue / Accuse / Appeal", "stroke_count": 12, "mnemonic": "Words and a retreat; sue." },
    { "character": "診", "on_yomi": "SHIN", "kun_yomi": "mi-ru", "meaning": "Diagnose / Examine", "stroke_count": 12, "mnemonic": "Words and a examine; diagnose." },
    { "character": "註", "on_yomi": "CHUU", "kun_yomi": "none", "meaning": "Annotation / Note", "stroke_count": 12, "mnemonic": "Words and a master; annotation." },
    { "character": "詔", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Imperial edict", "stroke_count": 12, "mnemonic": "Words and a summon; edict." },
    { "character": "詐", "on_yomi": "SA", "kun_yomi": "none", "meaning": "Lie / Deceive / Fraud", "stroke_count": 12, "mnemonic": "Words and a at; fraud." },
    { "character": "詞", "on_yomi": "SHI", "kun_yomi": "kotoba", "meaning": "Part of speech / Word", "stroke_count": 12, "mnemonic": "Words and a director; part of speech." },
    { "character": "詢", "on_yomi": "JUN", "kun_yomi": "none", "meaning": "Consult / Inquire", "stroke_count": 13, "mnemonic": "Words and a follow; consult." }
];

let added = 0;
final11.forEach(entry => {
    if (!seenInL15.has(entry.character) && !baseline.has(entry.character) && l15Data.length < 100) {
        l15Data.push(entry);
        seenInL15.add(entry.character);
        added++;
        console.log(`Added: ${entry.character} - ${entry.meaning}`);
    }
});

console.log('\nAdded:', added);
console.log('Final L15 count:', l15Data.length);

if (l15Data.length === 100) {
    console.log('✅ L15 COMPLETE WITH 100 KANJI!');
}

fs.writeFileSync(l15Path, JSON.stringify(l15Data, null, 2), 'utf8');
console.log('Saved kanji_mastery_l15.json');
