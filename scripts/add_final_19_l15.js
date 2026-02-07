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

// Final 19 unique N2/N1 Kanji
const final19 = [
    { "character": "訃", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Death notice / Obituary", "stroke_count": 9, "mnemonic": "Words about one who is deceased." },
    { "character": "詠", "on_yomi": "EI", "kun_yomi": "yo-mu", "meaning": "Compose poetry / Recite", "stroke_count": 12, "mnemonic": "Words flowing like a poem." },
    { "character": "誂", "on_yomi": "CHOU", "kun_yomi": "atsura-eru", "meaning": "Custom-made / Order", "stroke_count": 13, "mnemonic": "Words spoken to pick an order." },
    { "character": "詣", "on_yomi": "KEI", "kun_yomi": "mai-ru", "meaning": "Visit a temple / Pilgrimage", "stroke_count": 13, "mnemonic": "Words spoken while visiting a shrine/gate." },
    { "character": "詮", "on_yomi": "SEN", "kun_yomi": "none", "meaning": "Elucidate / Result", "stroke_count": 13, "mnemonic": "Words that provide a final result/pure point." },
    { "character": "謎", "on_yomi": "MEI", "kun_yomi": "nazo", "meaning": "Riddle / Mystery / Puzzle", "stroke_count": 15, "mnemonic": "Words that are a lost/obscured walk; a puzzle." },
    { "character": "諦", "on_yomi": "TEI", "kun_yomi": "aki-rameru", "meaning": "Abandon / Resign / Clear", "stroke_count": 16, "mnemonic": "Words spoken to achieve a clear/emperor-like state." },
    { "character": "諺", "on_yomi": "GEN", "kun_yomi": "kotowaza", "meaning": "Proverb / Saying", "stroke_count": 16, "mnemonic": "Words used by an accomplished/virtuous person." },
    { "character": "諜", "on_yomi": "CHOU", "kun_yomi": "none", "meaning": "Spying / Reconnaissance", "stroke_count": 16, "mnemonic": "Words recorded on a leaf-like slip; spying." },
    { "character": "諱", "on_yomi": "KI", "kun_yomi": "imi-na", "meaning": "Taboo / Posthumous name", "stroke_count": 16, "mnemonic": "Words that are forbidden or skin/hide-like." },
    { "character": "謂", "on_yomi": "I", "kun_yomi": "iwa-re", "meaning": "Reason / Origin / Oral tradition", "stroke_count": 16, "mnemonic": "Words spoken about a stomach/origin; tradition." },
    { "character": "諧", "on_yomi": "KAI", "kun_yomi": "none", "meaning": "Harmony / Joke", "stroke_count": 16, "mnemonic": "Words that harmonize well." },
    { "character": "謬", "on_yomi": "BYUU", "kun_yomi": "ayamari", "meaning": "Error / Fallacy", "stroke_count": 18, "mnemonic": "Words that are twisted; a mistake." },
    { "character": "謳", "on_yomi": "OU", "kun_yomi": "none", "meaning": "Extol / Declare", "stroke_count": 18, "mnemonic": "Words spoken in a loud district." },
    { "character": "謙", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Humble / Modest", "stroke_count": 17, "mnemonic": "Words spoken with a double heart." },
    { "character": "謹", "on_yomi": "KIN", "kun_yomi": "tsutsushi-mu", "meaning": "Discreet / Reverent", "stroke_count": 17, "mnemonic": "Words spoken with careful focus." },
    { "character": "誼", "on_yomi": "GI", "kun_yomi": "none", "meaning": "Friendship / Intimacy", "stroke_count": 15, "mnemonic": "Words for a proper friendship." },
    { "character": "詭", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Deceive / Cunning", "stroke_count": 13, "mnemonic": "Dangerous cliff words." },
    { "character": "諾", "on_yomi": "DAKU", "kun_yomi": "none", "meaning": "Agreement / Consent", "stroke_count": 15, "mnemonic": "Words for formal approval." }
];

let added = 0;
final19.forEach(entry => {
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
