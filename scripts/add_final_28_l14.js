const fs = require('fs');
const path = require('path');

// Load L14 and baseline
const l14Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l14.json');
let l14Data = JSON.parse(fs.readFileSync(l14Path, 'utf8'));

const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

let seenInL14 = new Set();
l14Data.forEach(entry => seenInL14.add(entry.character));

console.log('L14 count:', l14Data.length);
console.log('Need:', 100 - l14Data.length);

// Final 28 unique N2/N1 Kanji
const final28 = [
    { "character": "槽", "on_yomi": "SOU", "kun_yomi": "none", "meaning": "Tub / Tank / Vat", "stroke_count": 15, "mnemonic": "Tree as a tub; tank." },
    { "character": "樋", "on_yomi": "TOU", "kun_yomi": "toi", "meaning": "Gutter / Trough", "stroke_count": 15, "mnemonic": "Tree as a gutter; trough." },
    { "character": "樟", "on_yomi": "SHOU", "kun_yomi": "kusunoki", "meaning": "Camphor tree", "stroke_count": 15, "mnemonic": "Tree with a chapter; camphor." },
    { "character": "樺", "on_yomi": "KA", "kun_yomi": "kaba", "meaning": "Birch", "stroke_count": 15, "mnemonic": "Tree with a flower; birch." },
    { "character": "橋", "on_yomi": "KYOU", "kun_yomi": "hashi", "meaning": "Bridge", "stroke_count": 16, "mnemonic": "Tree as a bridge; bridge." },
    { "character": "橘", "on_yomi": "KITSU", "kun_yomi": "tachibana", "meaning": "Mandarin orange", "stroke_count": 16, "mnemonic": "Tree with a lucky; orange." },
    { "character": "檀", "on_yomi": "DAN", "kun_yomi": "none", "meaning": "Sandalwood", "stroke_count": 17, "mnemonic": "Tree with a single; sandalwood." },
    { "character": "檎", "on_yomi": "KIN", "kun_yomi": "none", "meaning": "Apple", "stroke_count": 17, "mnemonic": "Tree with a bird; apple." },
    { "character": "檜", "on_yomi": "KAI", "kun_yomi": "hinoki", "meaning": "Cypress / Hinoki", "stroke_count": 17, "mnemonic": "Tree with a meeting; cypress." },
    { "character": "櫓", "on_yomi": "RO", "kun_yomi": "yagura", "meaning": "Oar / Tower / Turret", "stroke_count": 19, "mnemonic": "Tree as an oar; turret." },
    { "character": "欄", "on_yomi": "RAN", "kun_yomi": "none", "meaning": "Column / Railing", "stroke_count": 20, "mnemonic": "Tree as a railing; column." },
    { "character": "欺", "on_yomi": "GI", "kun_yomi": "azamu-ku", "meaning": "Deceive / Cheat", "stroke_count": 12, "mnemonic": "Lack and a person; deceive." },
    { "character": "欽", "on_yomi": "KIN", "kun_yomi": "none", "meaning": "Respect / Revere", "stroke_count": 12, "mnemonic": "Lack and a gold; respect." },
    { "character": "款", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Article / Clause / Goodwill", "stroke_count": 12, "mnemonic": "Lack and a scholar; article." },
    { "character": "歎", "on_yomi": "TAN", "kun_yomi": "nage-ku", "meaning": "Sigh / Lament", "stroke_count": 15, "mnemonic": "Lack and a big; lament." },
    { "character": "歪", "on_yomi": "WAI", "kun_yomi": "yuuga-mu", "meaning": "Crooked / Warp / Distort", "stroke_count": 9, "mnemonic": "Not and a correct; crooked." },
    { "character": "殆", "on_yomi": "TAI", "kun_yomi": "ayau-i", "meaning": "Almost / Nearly / Dangerous", "stroke_count": 9, "mnemonic": "Death and a pedestal; almost." },
    { "character": "殉", "on_yomi": "JUN", "kun_yomi": "none", "meaning": "Martyrdom / Die for", "stroke_count": 10, "mnemonic": "Death and a follow; martyrdom." },
    { "character": "殊", "on_yomi": "SHU", "kun_yomi": "koto", "meaning": "Especially / Particularly", "stroke_count": 10, "mnemonic": "Death and a vermillion; especially." },
    { "character": "殖", "on_yomi": "SHOKU", "kun_yomi": "fu-eru", "meaning": "Multiply / Increase", "stroke_count": 12, "mnemonic": "Death and a straight; multiply." },
    { "character": "殴", "on_yomi": "OU", "kun_yomi": "nagu-ru", "meaning": "Beat / Strike / Hit", "stroke_count": 8, "mnemonic": "Death and a ward; beat." },
    { "character": "殻", "on_yomi": "KAKU", "kun_yomi": "kara", "meaning": "Shell / Husk / Hull", "stroke_count": 11, "mnemonic": "Death and a士; shell." },
    { "character": "殿", "on_yomi": "DEN", "kun_yomi": "tono", "meaning": "Palace / Hall / Lord", "stroke_count": 13, "mnemonic": "Death and a buttocks; palace." },
    { "character": "毀", "on_yomi": "KI", "kun_yomi": "kowa-su", "meaning": "Break / Destroy / Demolish", "stroke_count": 13, "mnemonic": "Earth and a lance; destroy." },
    { "character": "毅", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Resolute / Firm / Determined", "stroke_count": 15, "mnemonic": "Lance and a hair; resolute." },
    { "character": "毬", "on_yomi": "KYUU", "kun_yomi": "mari", "meaning": "Ball / Sphere", "stroke_count": 11, "mnemonic": "Hair and a request; ball." },
    { "character": "毯", "on_yomi": "TAN", "kun_yomi": "none", "meaning": "Carpet / Rug", "stroke_count": 12, "mnemonic": "Hair and a fire; carpet." },
    { "character": "氾", "on_yomi": "HAN", "kun_yomi": "none", "meaning": "Overflow / Flood", "stroke_count": 5, "mnemonic": "Water and a divination; overflow." }
];

let added = 0;
final28.forEach(entry => {
    if (!seenInL14.has(entry.character) && !baseline.has(entry.character) && l14Data.length < 100) {
        l14Data.push(entry);
        seenInL14.add(entry.character);
        added++;
        console.log(`Added: ${entry.character} - ${entry.meaning}`);
    }
});

console.log('\nAdded:', added);
console.log('Final L14 count:', l14Data.length);

if (l14Data.length === 100) {
    console.log('✅ L14 COMPLETE WITH 100 KANJI!');
}

fs.writeFileSync(l14Path, JSON.stringify(l14Data, null, 2), 'utf8');
console.log('Saved kanji_mastery_l14.json');
