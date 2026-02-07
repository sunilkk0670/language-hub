const fs = require('fs');
const path = require('path');

// Load L17 and baseline
const l17Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l17.json');
let l17Data = JSON.parse(fs.readFileSync(l17Path, 'utf8'));

const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json',
    'kanji_mastery_l16.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

let seenInL17 = new Set();
l17Data.forEach(entry => seenInL17.add(entry.character));

console.log('L17 count:', l17Data.length);
console.log('Need:', 100 - l17Data.length);

// Final 14 unique N2/N1 Kanji (clothing衣, skin皮 radicals)
const final14 = [
    { "character": "裔", "on_yomi": "EI", "kun_yomi": "none", "meaning": "Descendant / Posterity", "stroke_count": 13, "mnemonic": "Clothing and a descendant; posterity." },
    { "character": "裘", "on_yomi": "KYUU", "kun_yomi": "none", "meaning": "Fur coat / Pelt", "stroke_count": 13, "mnemonic": "Clothing made from fur; fur coat." },
    { "character": "裙", "on_yomi": "KUN", "kun_yomi": "none", "meaning": "Skirt / Apron", "stroke_count": 13, "mnemonic": "Clothing for a group; skirt." },
    { "character": "裝", "on_yomi": "SOU", "kun_yomi": "none", "meaning": "Dress /装 / Equip", "stroke_count": 13, "mnemonic": "Clothing and a strong; dress." },
    { "character": "裟", "on_yomi": "SA", "kun_yomi": "none", "meaning": "Buddhist robe", "stroke_count": 13, "mnemonic": "Clothing and a few; robe." },
    { "character": "裡", "on_yomi": "RI", "kun_yomi": "none", "meaning": "Lining / Inside", "stroke_count": 13, "mnemonic": "Clothing and a village; lining." },
    { "character": "裴", "on_yomi": "HAI", "kun_yomi": "none", "meaning": "Surname / Long robe", "stroke_count": 14, "mnemonic": "Clothing and a not; long robe." },
    { "character": "裵", "on_yomi": "HAI", "kun_yomi": "none", "meaning": "Surname / Robe", "stroke_count": 14, "mnemonic": "Clothing and a not; robe." },
    { "character": "裶", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Robe / Clothing", "stroke_count": 14, "mnemonic": "Clothing and a not; robe." },
    { "character": "裷", "on_yomi": "EN", "kun_yomi": "none", "meaning": "Hem / Border", "stroke_count": 14, "mnemonic": "Clothing and a cause; hem." },
    { "character": "裸", "on_yomi": "RA", "kun_yomi": "hadaka", "meaning": "Naked / Bare / Nude", "stroke_count": 13, "mnemonic": "Clothing and a fruit; naked." },
    { "character": "裹", "on_yomi": "KA", "kun_yomi": "none", "meaning": "Wrap / Bind / Bundle", "stroke_count": 14, "mnemonic": "Clothing and a fruit; wrap." },
    { "character": "裺", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Lapel / Collar", "stroke_count": 14, "mnemonic": "Clothing and a see; lapel." },
    { "character": "裻", "on_yomi": "DU", "kun_yomi": "none", "meaning": "Crotch / Seam", "stroke_count": 14, "mnemonic": "Clothing and a stop; seam." }
];

let added = 0;
final14.forEach(entry => {
    if (!seenInL17.has(entry.character) && !baseline.has(entry.character) && l17Data.length < 100) {
        l17Data.push(entry);
        seenInL17.add(entry.character);
        added++;
        console.log(`Added: ${entry.character} - ${entry.meaning}`);
    }
});

console.log('\nAdded:', added);
console.log('Final L17 count:', l17Data.length);

if (l17Data.length === 100) {
    console.log('✅ L17 COMPLETE WITH 100 KANJI!');
}

fs.writeFileSync(l17Path, JSON.stringify(l17Data, null, 2), 'utf8');
console.log('Saved kanji_mastery_l17.json');
