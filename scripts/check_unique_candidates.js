const fs = require('fs');
const path = require('path');

// Load all baseline + L12
const allFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json'
];

let allKanji = new Set();
allFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => allKanji.add(entry.character));
    }
});

console.log('Total unique Kanji in L1-L12:', allKanji.size);

// Load L12
const l12Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l12.json');
let l12Data = JSON.parse(fs.readFileSync(l12Path, 'utf8'));
console.log('L12 count:', l12Data.length);
console.log('Need:', 100 - l12Data.length, 'more');

// Generate 19 truly unique N2/N1 Kanji not in any lesson
const uniqueN2N1 = [
    { "character": "罷", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Quit / Stop", "stroke_count": 15, "mnemonic": "A net over a bird; stopping movement." },
    { "character": "紛", "on_yomi": "FUN", "kun_yomi": "magi-reru", "meaning": "Distract / Confuse", "stroke_count": 10, "mnemonic": "Threads becoming diverged/confused." },
    { "character": "携", "on_yomi": "KEI", "kun_yomi": "tazu-saeru", "meaning": "Carry / Portable", "stroke_count": 13, "mnemonic": "A hand carrying a bird; portable." },
    { "character": "及", "on_yomi": "KYUU", "kun_yomi": "oyo-bu", "meaning": "Exert / Influence", "stroke_count": 3, "mnemonic": "A hand reaching to catch up." },
    { "character": "泌", "on_yomi": "HITSU", "kun_yomi": "none", "meaning": "Ooze / Secrete", "stroke_count": 8, "mnemonic": "Water that is small/hidden and oozes out." },
    { "character": "諮", "on_yomi": "SHI", "kun_yomi": "haka-ru", "meaning": "Consult / Inquire", "stroke_count": 16, "mnemonic": "Words used to consult with an elder." },
    { "character": "諭", "on_yomi": "YU", "kun_yomi": "sato-su", "meaning": "Admonish / Persuade", "stroke_count": 16, "mnemonic": "Words used for a formal lecture/admonishing." },
    { "character": "諾", "on_yomi": "DAKU", "kun_yomi": "none", "meaning": "Consent / Agreement", "stroke_count": 15, "mnemonic": "Words used for a formal approval." },
    { "character": "謀", "on_yomi": "BOU", "kun_yomi": "haka-ru", "meaning": "Conspire / Plan", "stroke_count": 16, "mnemonic": "Words used for a strategic/secret plan." },
    { "character": "謡", "on_yomi": "YOU", "kun_yomi": "utai", "meaning": "Song / Noh chant", "stroke_count": 16, "mnemonic": "Words spoken like a folk song." },
    { "character": "謙", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Humble / Modest", "stroke_count": 17, "mnemonic": "Words spoken with a double/concurrent heart." },
    { "character": "謹", "on_yomi": "KIN", "kun_yomi": "tsutsushi-mu", "meaning": "Discreet / Reverent", "stroke_count": 17, "mnemonic": "Words spoken with careful focus." },
    { "character": "詠", "on_yomi": "EI", "kun_yomi": "yo-mu", "meaning": "Recite / Compose", "stroke_count": 12, "mnemonic": "Words that flow forever like a poem." },
    { "character": "請", "on_yomi": "SEI", "kun_yomi": "ko-u", "meaning": "Request / Solicit", "stroke_count": 15, "mnemonic": "Words that are clean/clear for a request." },
    { "character": "諸", "on_yomi": "SHO", "kun_yomi": "moro-moro", "meaning": "Various / Many", "stroke_count": 15, "mnemonic": "Many words spoken by various people." },
    { "character": "評", "on_yomi": "HYOU", "kun_yomi": "none", "meaning": "Criticism / Evaluate", "stroke_count": 12, "mnemonic": "Words judging a level/flat standard." },
    { "character": "講", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Lecture / Structure", "stroke_count": 17, "mnemonic": "Words organized in a structure for a lecture." },
    { "character": "謝", "on_yomi": "SHA", "kun_yomi": "ayama-ru", "meaning": "Thank / Apologize", "stroke_count": 17, "mnemonic": "Words used to shoot out/dismiss an error." },
    { "character": "認", "on_yomi": "NIN", "kun_yomi": "mito-meru", "meaning": "Recognize / Acknowledge", "stroke_count": 14, "mnemonic": "Words used to tolerate/admit a truth." }
];

// Check which are truly unique
let seenInL12 = new Set();
l12Data.forEach(entry => seenInL12.add(entry.character));

let baseline = new Set();
const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json'
];
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

console.log('\nChecking candidates:');
uniqueN2N1.forEach(entry => {
    const inBaseline = baseline.has(entry.character);
    const inL12 = seenInL12.has(entry.character);
    if (inBaseline || inL12) {
        console.log(`${entry.character} - DUPLICATE (baseline: ${inBaseline}, L12: ${inL12})`);
    } else {
        console.log(`${entry.character} - UNIQUE ✓`);
    }
});
