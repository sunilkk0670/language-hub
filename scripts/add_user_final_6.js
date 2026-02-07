const fs = require('fs');
const path = require('path');

// Load L12
const l12Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l12.json');
let l12Data = JSON.parse(fs.readFileSync(l12Path, 'utf8'));

console.log('Current L12 count:', l12Data.length);

// Final 6 user-provided unique Kanji
const final6UserProvided = [
    { "character": "廉", "on_yomi": "REN", "kun_yomi": "none", "meaning": "Low price / Honorable / Bargain", "stroke_count": 13, "mnemonic": "A building廠 with a sickle刂; low price/honorable." },
    { "character": "彙", "on_yomi": "I", "kun_yomi": "none", "meaning": "Collection / Same kind", "stroke_count": 13, "mnemonic": "Hedgehog彑 gathering items; collection (語彙 vocabulary)." },
    { "character": "塑", "on_yomi": "SO", "kun_yomi": "none", "meaning": "Model / Molding / Plasticity", "stroke_count": 13, "mnemonic": "Earth土 shaped with a tool朔; molding/plasticity." },
    { "character": "愉", "on_yomi": "YU", "kun_yomi": "none", "meaning": "Pleasant / Joyful / Happy", "stroke_count": 13, "mnemonic": "Heart心 feeling pleasant愉; joyful." },
    { "character": "箇", "on_yomi": "KO", "kun_yomi": "none", "meaning": "Counter for items / Individual", "stroke_count": 14, "mnemonic": "Bamboo竹 with an individual個; counter for items." },
    { "character": "搾", "on_yomi": "SAKU", "kun_yomi": "shibo-ru", "meaning": "Squeeze / Exploit / Press", "stroke_count": 13, "mnemonic": "Hand扌 squeezing窄; squeeze/press." }
];

// Add them to L12
final6UserProvided.forEach(entry => {
    l12Data.push(entry);
    console.log(`Added: ${entry.character} - ${entry.meaning}`);
});

console.log('\nFinal L12 count:', l12Data.length);

if (l12Data.length === 100) {
    console.log('✅ L12 COMPLETE WITH 100 KANJI!');
}

// Save
fs.writeFileSync(l12Path, JSON.stringify(l12Data, null, 2), 'utf8');
console.log('Saved kanji_mastery_l12.json');
