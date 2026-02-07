const fs = require('fs');
const path = require('path');

// Load current L12
const l12Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l12.json');
let l12Data = JSON.parse(fs.readFileSync(l12Path, 'utf8'));

console.log('Current L12 count:', l12Data.length);

// Load baseline
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

// Final 19 unique N2/N1 Kanji - carefully selected to avoid duplicates
const finalKanji = [
    { "character": "勉", "on_yomi": "BEN", "kun_yomi": "tsuto-meru", "meaning": "Exertion / Endeavor", "stroke_count": 10, "mnemonic": "Power力 to avoid免; diligence." },
    { "character": "励", "on_yomi": "REI", "kun_yomi": "hage-mu", "meaning": "Encourage / Strive", "stroke_count": 7, "mnemonic": "Power力 from a cliff厂; encouragement." },
    { "character": "劣", "on_yomi": "RETSU", "kun_yomi": "oto-ru", "meaning": "Inferior / Weak", "stroke_count": 6, "mnemonic": "Small少 power力; inferior." },
    { "character": "匂", "on_yomi": "none", "kun_yomi": "nio-u", "meaning": "Fragrance / Smell", "stroke_count": 4, "mnemonic": "A wrap勹 with scent; fragrance." },
    { "character": "匙", "on_yomi": "none", "kun_yomi": "saji", "meaning": "Spoon", "stroke_count": 11, "mnemonic": "A wrap勹 for a tool是; spoon." },
    { "character": "匝", "on_yomi": "SOU", "kun_yomi": "none", "meaning": "Revolve / Encircle", "stroke_count": 5, "mnemonic": "A wrap勹 going around; revolve." },
    { "character": "匡", "on_yomi": "KYOU", "kun_yomi": "none", "meaning": "Correct / Rectify", "stroke_count": 7, "mnemonic": "A wrap勹 with a king王; correct." },
    { "character": "匠", "on_yomi": "SHOU", "kun_yomi": "takumi", "meaning": "Artisan / Craftsman", "stroke_count": 6, "mnemonic": "A wrap勹 with an axe斤; craftsman." },
    { "character": "匣", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Box / Case", "stroke_count": 7, "mnemonic": "A wrap勹 with a lid甲; box." },
    { "character": "匪", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Bandit / Negation", "stroke_count": 10, "mnemonic": "A wrap勹 that is not非; bandit." },
    { "character": "匿", "on_yomi": "TOKU", "kun_yomi": "none", "meaning": "Hide / Conceal", "stroke_count": 10, "mnemonic": "A wrap勹 with若 inside; hide." },
    { "character": "匹", "on_yomi": "HITSU", "kun_yomi": "none", "meaning": "Equal / Counter", "stroke_count": 4, "mnemonic": "A wrap勹 with a person儿; equal." },
    { "character": "區", "on_yomi": "KU", "kun_yomi": "none", "meaning": "Ward / District", "stroke_count": 11, "mnemonic": "A wrap勹 with品 inside; district." },
    { "character": "医", "on_yomi": "I", "kun_yomi": "none", "meaning": "Medicine / Doctor", "stroke_count": 7, "mnemonic": "A wrap勹 with矢 arrow; medicine." },
    { "character": "匁", "on_yomi": "MONME", "kun_yomi": "none", "meaning": "Monme (weight)", "stroke_count": 4, "mnemonic": "A wrap勹 with a dot; weight unit." },
    { "character": "勺", "on_yomi": "SHAKU", "kun_yomi": "none", "meaning": "Ladle / Volume", "stroke_count": 3, "mnemonic": "A small勹 spoon; ladle." },
    { "character": "勁", "on_yomi": "KEI", "kun_yomi": "none", "meaning": "Strong / Sturdy", "stroke_count": 9, "mnemonic": "Power力 through径; strong." },
    { "character": "劫", "on_yomi": "GOU", "kun_yomi": "none", "meaning": "Threat / Eon", "stroke_count": 7, "mnemonic": "Power力 to rob去; threat." },
    { "character": "劾", "on_yomi": "GAI", "kun_yomi": "none", "meaning": "Censure / Impeach", "stroke_count": 8, "mnemonic": "Power力 to harm亥; impeachment." }
];

let added = 0;
finalKanji.forEach(entry => {
    if (!seenInL12.has(entry.character) && !baseline.has(entry.character) && l12Data.length < 100) {
        l12Data.push(entry);
        seenInL12.add(entry.character);
        added++;
    }
});

console.log('Added:', added);
console.log('Final L12 count:', l12Data.length);

fs.writeFileSync(l12Path, JSON.stringify(l12Data, null, 2), 'utf8');
console.log('Saved kanji_mastery_l12.json');
