const fs = require('fs');
const path = require('path');

// Load L18 and baseline
const l18Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l18.json');
let l18Data = JSON.parse(fs.readFileSync(l18Path, 'utf8'));

const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json',
    'kanji_mastery_l16.json', 'kanji_mastery_l17.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

let seenInL18 = new Set();
l18Data.forEach(entry => seenInL18.add(entry.character));

console.log('L18 count:', l18Data.length);
console.log('Need:', 100 - l18Data.length);

// Final 17 unique N1 Kanji (jade王, field田, white白, dish皿 radicals)
const final17 = [
    { "character": "珈", "on_yomi": "KA", "kun_yomi": "none", "meaning": "Ornamental hairpin", "stroke_count": 9, "mnemonic": "A king/jewel and a add/plus; ornament." },
    { "character": "珞", "on_yomi": "RAKU", "kun_yomi": "none", "meaning": "Necklace / Jewel", "stroke_count": 10, "mnemonic": "A king/jewel and a each/every; necklace." },
    { "character": "珮", "on_yomi": "HAI", "kun_yomi": "none", "meaning": "Pendant / Ornament", "stroke_count": 11, "mnemonic": "A king/jewel and a stand/person; pendant." },
    { "character": "珪", "on_yomi": "KEI", "kun_yomi": "none", "meaning": "Jade tablet / Silicon", "stroke_count": 10, "mnemonic": "A king/jewel and a earth/soil; jade tablet." },
    { "character": "珸", "on_yomi": "GO", "kun_yomi": "none", "meaning": "Jade name", "stroke_count": 11, "mnemonic": "A king/jewel and a five/go; jade name." },
    { "character": "琁", "on_yomi": "SEN", "kun_yomi": "none", "meaning": "Beautiful jade", "stroke_count": 11, "mnemonic": "A king/jewel and a revolve/rotate; jade." },
    { "character": "琅", "on_yomi": "ROU", "kun_yomi": "none", "meaning": "Gem / Tinkling", "stroke_count": 11, "mnemonic": "A king/jewel and a good/excellent; gem." },
    { "character": "琇", "on_yomi": "SHUU", "kun_yomi": "none", "meaning": "Beautiful jade", "stroke_count": 11, "mnemonic": "A king/jewel and a excellent/elegant; jade." },
    { "character": "琊", "on_yomi": "YA", "kun_yomi": "none", "meaning": "Gem / Place name", "stroke_count": 11, "mnemonic": "A king/jewel and a tooth/fang; gem." },
    { "character": "琬", "on_yomi": "WAN", "kun_yomi": "none", "meaning": "Scepter / Jade", "stroke_count": 12, "mnemonic": "A king/jewel and a evening/perfect; scepter." },
    { "character": "琰", "on_yomi": "EN", "kun_yomi": "none", "meaning": "Gem / Luster", "stroke_count": 12, "mnemonic": "A king/jewel and a flame/fire; luster." },
    { "character": "琲", "on_yomi": "HAI", "kun_yomi": "none", "meaning": "String of beads", "stroke_count": 12, "mnemonic": "A king/jewel and a not/negative; beads." },
    { "character": "琳", "on_yomi": "RIN", "kun_yomi": "none", "meaning": "Gem / Beautiful jade", "stroke_count": 12, "mnemonic": "A king/jewel and a forest/trees; gem." },
    { "character": "琴", "on_yomi": "KIN", "kun_yomi": "koto", "meaning": "Koto / Harp", "stroke_count": 12, "mnemonic": "Two kings/jewels and a now/present; koto." },
    { "character": "琺", "on_yomi": "HOU", "kun_yomi": "none", "meaning": "Enamel", "stroke_count": 12, "mnemonic": "A king/jewel and a treasure/law; enamel." },
    { "character": "琿", "on_yomi": "KON", "kun_yomi": "none", "meaning": "Jade / Beautiful stone", "stroke_count": 13, "mnemonic": "A king/jewel and a mix/confused; jade." },
    { "character": "瑁", "on_yomi": "BAI", "kun_yomi": "none", "meaning": "Tortoiseshell / Agate", "stroke_count": 13, "mnemonic": "A king/jewel and a hat/crown; tortoiseshell." }
];

let added = 0;
final17.forEach(entry => {
    if (!seenInL18.has(entry.character) && !baseline.has(entry.character) && l18Data.length < 100) {
        l18Data.push(entry);
        seenInL18.add(entry.character);
        added++;
        console.log(`Added: ${entry.character} - ${entry.meaning}`);
    }
});

console.log('\nAdded:', added);
console.log('Final L18 count:', l18Data.length);

if (l18Data.length === 100) {
    console.log('✅ L18 COMPLETE WITH 100 KANJI!');
}

fs.writeFileSync(l18Path, JSON.stringify(l18Data, null, 2), 'utf8');
console.log('Saved kanji_mastery_l18.json');
