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

// 19 truly unique N2/N1 Kanji - advanced formal/literary vocabulary
const finalUnique = [
    { "character": "請", "on_yomi": "SEI", "kun_yomi": "ko-u", "meaning": "Request / Solicit", "stroke_count": 15, "mnemonic": "Words that are clean/clear for a request." },
    { "character": "該", "on_yomi": "GAI", "kun_yomi": "none", "meaning": "Applicable / Relevant", "stroke_count": 13, "mnemonic": "Words spoken about a child/relevant person." },
    { "character": "誕", "on_yomi": "TAN", "kun_yomi": "none", "meaning": "Birth / Deception", "stroke_count": 15, "mnemonic": "Words spoken as a child/extension of life." },
    { "character": "誘", "on_yomi": "YUU", "kun_yomi": "saso-u", "meaning": "Invite / Entice", "stroke_count": 14, "mnemonic": "Words used for an excellent invitation." },
    { "character": "誓", "on_yomi": "SEI", "kun_yomi": "chika-u", "meaning": "Vow / Swear", "stroke_count": 14, "mnemonic": "Words spoken with a clear oath." },
    { "character": "諾", "on_yomi": "DAKU", "kun_yomi": "none", "meaning": "Consent / Agreement", "stroke_count": 15, "mnemonic": "Words used for a formal approval." },
    { "character": "謀", "on_yomi": "BOU", "kun_yomi": "haka-ru", "meaning": "Conspire / Plan", "stroke_count": 16, "mnemonic": "Words used for a strategic/secret plan." },
    { "character": "謡", "on_yomi": "YOU", "kun_yomi": "utai", "meaning": "Song / Noh chant", "stroke_count": 16, "mnemonic": "Words spoken like a folk song." },
    { "character": "謙", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Humble / Modest", "stroke_count": 17, "mnemonic": "Words spoken with a double/concurrent heart." },
    { "character": "謹", "on_yomi": "KIN", "kun_yomi": "tsutsushi-mu", "meaning": "Discreet / Reverent", "stroke_count": 17, "mnemonic": "Words spoken with careful focus." },
    { "character": "詠", "on_yomi": "EI", "kun_yomi": "yo-mu", "meaning": "Recite / Compose", "stroke_count": 12, "mnemonic": "Words that flow forever like a poem." },
    { "character": "諮", "on_yomi": "SHI", "kun_yomi": "haka-ru", "meaning": "Consult / Inquire", "stroke_count": 16, "mnemonic": "Words used to consult with an elder." },
    { "character": "諭", "on_yomi": "YU", "kun_yomi": "sato-su", "meaning": "Admonish / Persuade", "stroke_count": 16, "mnemonic": "Words used for a formal lecture/admonishing." },
    { "character": "誼", "on_yomi": "GI", "kun_yomi": "none", "meaning": "Friendship / Intimacy", "stroke_count": 15, "mnemonic": "Words spoken for a proper friendship." },
    { "character": "謳", "on_yomi": "OU", "kun_yomi": "none", "meaning": "Extol / Declare", "stroke_count": 18, "mnemonic": "Words spoken in a loud area/district." },
    { "character": "謬", "on_yomi": "BYUU", "kun_yomi": "ayamari", "meaning": "Error / Fallacy", "stroke_count": 18, "mnemonic": "Words that are bent/twisted; a mistake." },
    { "character": "訃", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Obituary / Death notice", "stroke_count": 9, "mnemonic": "Words about a person who is 'divined' out/deceased." },
    { "character": "詫", "on_yomi": "TA", "kun_yomi": "wabi-ru", "meaning": "Apologize", "stroke_count": 13, "mnemonic": "Words spoken for a home/settlement." },
    { "character": "詭", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Deceive / Weird", "stroke_count": 13, "mnemonic": "Words that are dangerous/on a cliff." }
];

let added = 0;
finalUnique.forEach(entry => {
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
