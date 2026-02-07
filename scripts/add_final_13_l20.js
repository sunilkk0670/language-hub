const fs = require('fs');
const path = require('path');

// Load L20 and baseline
const l20Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l20.json');
let l20Data = JSON.parse(fs.readFileSync(l20Path, 'utf8'));

const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json',
    'kanji_mastery_l16.json', 'kanji_mastery_l17.json', 'kanji_mastery_l18.json',
    'kanji_mastery_l19.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

let seenInL20 = new Set();
l20Data.forEach(entry => seenInL20.add(entry.character));

console.log('L20 count:', l20Data.length);
console.log('Need:', 100 - l20Data.length);

// Final 13 unique N1 Kanji (bird鳥, shell貝 radicals)
const final13 = [
    { "character": "鴛", "on_yomi": "EN", "kun_yomi": "oshi", "meaning": "Mandarin duck", "stroke_count": 16, "mnemonic": "Bird and a night/evening; paired ducks." },
    { "character": "鴦", "on_yomi": "OU", "kun_yomi": "none", "meaning": "Female mandarin duck", "stroke_count": 16, "mnemonic": "Bird and a center/middle; paired bird." },
    { "character": "鴻", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Swan / Great bird", "stroke_count": 17, "mnemonic": "Water and bird; majestic swan." },
    { "character": "鵁", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Grebe (bird)", "stroke_count": 17, "mnemonic": "Bird and a cross/exchange; water bird." },
    { "character": "鵄", "on_yomi": "SHI", "kun_yomi": "tobi", "meaning": "Kite / Hawk", "stroke_count": 18, "mnemonic": "Bird and a corpse/body; bird of prey." },
    { "character": "鵞", "on_yomi": "GA", "kun_yomi": "none", "meaning": "Goose", "stroke_count": 18, "mnemonic": "Bird and me/self; domestic goose." },
    { "character": "鵤", "on_yomi": "KYOKU", "kun_yomi": "none", "meaning": "Woodpecker", "stroke_count": 18, "mnemonic": "Bird and a music/song; tapping bird." },
    { "character": "鵲", "on_yomi": "JAKU", "kun_yomi": "kasasagi", "meaning": "Magpie", "stroke_count": 19, "mnemonic": "Bird and a past/former; clever magpie." },
    { "character": "鶉", "on_yomi": "SHUN", "kun_yomi": "uzura", "meaning": "Quail", "stroke_count": 19, "mnemonic": "Bird and a sun/enjoy; small quail." },
    { "character": "鶇", "on_yomi": "TOU", "kun_yomi": "tsugumi", "meaning": "Thrush", "stroke_count": 19, "mnemonic": "Bird and a winter/east; woodland bird." },
    { "character": "鶩", "on_yomi": "BOKU", "kun_yomi": "none", "meaning": "Wild duck", "stroke_count": 21, "mnemonic": "Bird and duty/work; domesticated duck." },
    { "character": "鷁", "on_yomi": "GEKI", "kun_yomi": "none", "meaning": "Cormorant / Waterfowl", "stroke_count": 23, "mnemonic": "Bird and a drama/intense; fishing bird." },
    { "character": "鷓", "on_yomi": "SHA", "kun_yomi": "none", "meaning": "Partridge", "stroke_count": 23, "mnemonic": "Bird and a person/specialist; game bird." }
];

let added = 0;
final13.forEach(entry => {
    if (!seenInL20.has(entry.character) && !baseline.has(entry.character) && l20Data.length < 100) {
        l20Data.push(entry);
        seenInL20.add(entry.character);
        added++;
        console.log(`Added: ${entry.character} - ${entry.meaning}`);
    }
});

console.log('\nAdded:', added);
console.log('Final L20 count:', l20Data.length);

if (l20Data.length === 100) {
    console.log('✅ L20 COMPLETE WITH 100 KANJI!');
}

fs.writeFileSync(l20Path, JSON.stringify(l20Data, null, 2), 'utf8');
console.log('Saved kanji_mastery_l20.json');
