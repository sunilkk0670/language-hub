const fs = require('fs');
const path = require('path');

// Load L12 and baseline
const l12Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l12.json');
let l12Data = JSON.parse(fs.readFileSync(l12Path, 'utf8'));

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

console.log('L12 count:', l12Data.length);
console.log('Need:', 100 - l12Data.length);

// 14 more truly unique N2/N1 Kanji - diverse advanced vocabulary
const final14 = [
    { "character": "誠", "on_yomi": "SEI", "kun_yomi": "makoto", "meaning": "Sincerity / Truth", "stroke_count": 13, "mnemonic": "Words spoken to achieve成; sincerity." },
    { "character": "誤", "on_yomi": "GO", "kun_yomi": "ayama-ru", "meaning": "Mistake / Error", "stroke_count": 14, "mnemonic": "Words spoken with my吾; mistake." },
    { "character": "誌", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Magazine / Journal", "stroke_count": 14, "mnemonic": "Words recorded with intent志; journal." },
    { "character": "誰", "on_yomi": "SUI", "kun_yomi": "dare", "meaning": "Who / Someone", "stroke_count": 15, "mnemonic": "Words asking about a bird隹; who." },
    { "character": "課", "on_yomi": "KA", "kun_yomi": "none", "meaning": "Section / Lesson", "stroke_count": 15, "mnemonic": "Words spoken with fruit果; lesson/section." },
    { "character": "調", "on_yomi": "CHOU", "kun_yomi": "shira-beru", "meaning": "Investigate / Tune", "stroke_count": 15, "mnemonic": "Words spoken with a week周; investigate." },
    { "character": "諾", "on_yomi": "DAKU", "kun_yomi": "none", "meaning": "Consent", "stroke_count": 15, "mnemonic": "Words若 spoken; consent." },
    { "character": "謀", "on_yomi": "BOU", "kun_yomi": "haka-ru", "meaning": "Conspire", "stroke_count": 16, "mnemonic": "Words某 spoken; conspire." },
    { "character": "謡", "on_yomi": "YOU", "kun_yomi": "utai", "meaning": "Song", "stroke_count": 16, "mnemonic": "Words搖 spoken; song." },
    { "character": "謙", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Humble", "stroke_count": 17, "mnemonic": "Words兼 spoken; humble." },
    { "character": "謹", "on_yomi": "KIN", "kun_yomi": "tsutsushi-mu", "meaning": "Discreet", "stroke_count": 17, "mnemonic": "Words堇 spoken; discreet." },
    { "character": "詠", "on_yomi": "EI", "kun_yomi": "yo-mu", "meaning": "Recite", "stroke_count": 12, "mnemonic": "Words永 spoken; recite." },
    { "character": "諮", "on_yomi": "SHI", "kun_yomi": "haka-ru", "meaning": "Consult", "stroke_count": 16, "mnemonic": "Words咨 spoken; consult." },
    { "character": "諭", "on_yomi": "YU", "kun_yomi": "sato-su", "meaning": "Admonish", "stroke_count": 16, "mnemonic": "Words兪 spoken; admonish." }
];

let added = 0;
final14.forEach(entry => {
    if (!seenInL12.has(entry.character) && !baseline.has(entry.character) && l12Data.length < 100) {
        l12Data.push(entry);
        seenInL12.add(entry.character);
        added++;
        console.log(`Added: ${entry.character} - ${entry.meaning}`);
    }
});

console.log('\nAdded:', added);
console.log('Final L12 count:', l12Data.length);

fs.writeFileSync(l12Path, JSON.stringify(l12Data, null, 2), 'utf8');
console.log('Saved kanji_mastery_l12.json');
