const fs = require('fs');
const path = require('path');

// Load current L12
const l12Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l12.json');
let l12Data = JSON.parse(fs.readFileSync(l12Path, 'utf8'));

console.log('Current L12 count:', l12Data.length);

// Load baseline to check for duplicates
const baselineFiles = [
    'kanji_mastery_l1.json',
    'kanji_mastery_l2.json',
    'kanji_mastery_l3.json',
    'kanji_mastery_l4.json',
    'kanji_mastery_l5.json',
    'kanji_mastery_l6.json',
    'kanji_mastery_l7.json',
    'kanji_mastery_l8.json',
    'kanji_mastery_l9.json',
    'kanji_mastery_l10.json',
    'kanji_mastery_l11.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

// Track what's already in L12
let seenInL12 = new Set();
l12Data.forEach(entry => seenInL12.add(entry.character));

// Add 23 more unique N2/N1 Kanji
const additionalKanji = [
    { "character": "党", "on_yomi": "TOU", "kun_yomi": "none", "meaning": "Political Party", "stroke_count": 10, "mnemonic": "A group under one roof with a brotherly bond." },
    { "character": "凝", "on_yomi": "GYOU", "kun_yomi": "ko-ru", "meaning": "Freeze / Absorbed", "stroke_count": 16, "mnemonic": "Ice and a person standing still in focus." },
    { "character": "範", "on_yomi": "HAN", "kun_yomi": "none", "meaning": "Example / Model", "stroke_count": 15, "mnemonic": "Bamboo slips showing a formal pattern/rule." },
    { "character": "拠", "on_yomi": "KYO", "kun_yomi": "none", "meaning": "Foothold / Based on", "stroke_count": 8, "mnemonic": "A hand holding a place for a base." },
    { "character": "遭", "on_yomi": "SOU", "kun_yomi": "a-u", "meaning": "Encounter / Meet", "stroke_count": 14, "mnemonic": "Walking toward a curved/difficult meeting." },
    { "character": "伺", "on_yomi": "SHI", "kun_yomi": "ukaga-u", "meaning": "Pay respects / Inquire", "stroke_count": 7, "mnemonic": "A person peering/inquiring with respect." },
    { "character": "撤", "on_yomi": "TETSU", "kun_yomi": "none", "meaning": "Withdraw / Remove", "stroke_count": 15, "mnemonic": "A hand removing items thoroughly." },
    { "character": "邸", "on_yomi": "TEI", "kun_yomi": "yashiki", "meaning": "Residence / Mansion", "stroke_count": 7, "mnemonic": "A large building in a specific district." },
    { "character": "掲", "on_yomi": "KEI", "kun_yomi": "kaka-geru", "meaning": "Display / Post", "stroke_count": 11, "mnemonic": "Hand raising a sign under the sun." },
    { "character": "奮", "on_yomi": "FUN", "kun_yomi": "furu-u", "meaning": "Stirred up / Excited", "stroke_count": 16, "mnemonic": "A bird in a field flapping its wings in excitement." },
    { "character": "獲", "on_yomi": "KAKU", "kun_yomi": "e-ru", "meaning": "Seize / Capture", "stroke_count": 17, "mnemonic": "A dog-animal seizing a bird in the grass." },
    { "character": "詳", "on_yomi": "SHOU", "kun_yomi": "kuwa-shii", "meaning": "Detailed / Full", "stroke_count": 13, "mnemonic": "Words as clear and detailed as a sheep." },
    { "character": "棄", "on_yomi": "KI", "kun_yomi": "su-teru", "meaning": "Abandon / Discard", "stroke_count": 13, "mnemonic": "Discarding a child/basket in the woods." },
    { "character": "浸", "on_yomi": "SHIN", "kun_yomi": "hita-su", "meaning": "Immerse / Soak", "stroke_count": 10, "mnemonic": "Water and a hand cleaning/soaking a broom." },
    { "character": "傑", "on_yomi": "KETSU", "kun_yomi": "none", "meaning": "Greatness / Hero", "stroke_count": 13, "mnemonic": "A person standing tall like a tree in a hero's shape." },
    { "character": "憤", "on_yomi": "FUN", "kun_yomi": "ikidou-ru", "meaning": "Resentment / Anger", "stroke_count": 15, "mnemonic": "A heart feeling a stir/burst of anger." },
    { "character": "糾", "on_yomi": "KYUU", "kun_yomi": "none", "meaning": "Twist / Investigate", "stroke_count": 9, "mnemonic": "Threads being twisted together to investigate." },
    { "character": "泌", "on_yomi": "HITSU", "kun_yomi": "none", "meaning": "Ooze / Secrete", "stroke_count": 8, "mnemonic": "Water that is small/hidden and oozes out." },
    { "character": "諮", "on_yomi": "SHI", "kun_yomi": "haka-ru", "meaning": "Consult / Inquire", "stroke_count": 16, "mnemonic": "Words used to consult with an elder." },
    { "character": "諭", "on_yomi": "YU", "kun_yomi": "sato-su", "meaning": "Admonish / Persuade", "stroke_count": 16, "mnemonic": "Words used for a formal lecture/admonishing." },
    { "character": "諾", "on_yomi": "DAKU", "kun_yomi": "none", "meaning": "Consent / Agreement", "stroke_count": 15, "mnemonic": "Words used for a formal approval." },
    { "character": "謀", "on_yomi": "BOU", "kun_yomi": "haka-ru", "meaning": "Conspire / Plan", "stroke_count": 16, "mnemonic": "Words used for a strategic/secret plan." },
    { "character": "謡", "on_yomi": "YOU", "kun_yomi": "utai", "meaning": "Song / Noh chant", "stroke_count": 16, "mnemonic": "Words spoken like a folk song." },
    { "character": "謙", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Humble / Modest", "stroke_count": 17, "mnemonic": "Words spoken with a double/concurrent heart." },
    { "character": "謹", "on_yomi": "KIN", "kun_yomi": "tsutsushi-mu", "meaning": "Discreet / Reverent", "stroke_count": 17, "mnemonic": "Words spoken with careful focus." },
    { "character": "詠", "on_yomi": "EI", "kun_yomi": "yo-mu", "meaning": "Recite / Compose", "stroke_count": 12, "mnemonic": "Words that flow forever like a poem." }
];

let added = 0;
additionalKanji.forEach(entry => {
    if (!seenInL12.has(entry.character) && !baseline.has(entry.character) && l12Data.length < 100) {
        l12Data.push(entry);
        seenInL12.add(entry.character);
        added++;
    }
});

console.log('Added:', added);
console.log('New L12 count:', l12Data.length);

// Save
fs.writeFileSync(l12Path, JSON.stringify(l12Data, null, 2), 'utf8');
console.log('Saved kanji_mastery_l12.json');
