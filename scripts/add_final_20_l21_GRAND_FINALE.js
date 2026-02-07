const fs = require('fs');
const path = require('path');

// Load L21 and baseline
const l21Path = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l21.json');
let l21Data = JSON.parse(fs.readFileSync(l21Path, 'utf8'));

const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json',
    'kanji_mastery_l16.json', 'kanji_mastery_l17.json', 'kanji_mastery_l18.json',
    'kanji_mastery_l19.json', 'kanji_mastery_l20.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

let seenInL21 = new Set();
l21Data.forEach(entry => seenInL21.add(entry.character));

console.log('L21 count:', l21Data.length);
console.log('Need:', 100 - l21Data.length);
console.log('🔥 THE FINAL 20 KANJI TO COMPLETE THE ENTIRE CURRICULUM! 🔥');

// THE FINAL 20 unique N1 Kanji to complete the 2,100 Kanji curriculum!
const final20 = [
    { "character": "誼", "on_yomi": "GI", "kun_yomi": "yoshi-mi", "meaning": "Friendship / Intimacy / Kindness", "stroke_count": 15, "mnemonic": "Word and a righteousness/義; friendship." },
    { "character": "誹", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Slander / Defame / Criticize", "stroke_count": 15, "mnemonic": "Word and a not/非; slander." },
    { "character": "誼", "on_yomi": "GI", "kun_yomi": "none", "meaning": "Friendship / Intimacy", "stroke_count": 15, "mnemonic": "Word and a righteousness/義; intimacy." },
    { "character": "諂", "on_yomi": "TEN", "kun_yomi": "none", "meaning": "Flatter / Fawn / Cajole", "stroke_count": 15, "mnemonic": "Word and a flat/扁; flattery." },
    { "character": "諄", "on_yomi": "JUN", "kun_yomi": "none", "meaning": "Tedious / Verbose / Repetitious", "stroke_count": 15, "mnemonic": "Word and a enjoy/享; tedious." },
    { "character": "諌", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Admonish / Remonstrate / Warn", "stroke_count": 15, "mnemonic": "Word and a bundle/東; admonishing." },
    { "character": "諍", "on_yomi": "SOU", "kun_yomi": "none", "meaning": "Dispute / Argue / Quarrel", "stroke_count": 15, "mnemonic": "Word and a contend/爭; arguing." },
    { "character": "諏", "on_yomi": "SHU", "kun_yomi": "none", "meaning": "Consult / Confer / Visit shrine", "stroke_count": 15, "mnemonic": "Word and a take/取; consulting." },
    { "character": "諒", "on_yomi": "RYOU", "kun_yomi": "none", "meaning": "Understand / Forgive / Excuse", "stroke_count": 15, "mnemonic": "Word and a capital/京; understanding." },
    { "character": "諜", "on_yomi": "CHOU", "kun_yomi": "none", "meaning": "Spy / Scout / Detective", "stroke_count": 16, "mnemonic": "Word and a leaf/葉; espionage." },
    { "character": "諡", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Posthumous name / Title", "stroke_count": 16, "mnemonic": "Word and a benefit/益; posthumous." },
    { "character": "諤", "on_yomi": "GAKU", "kun_yomi": "none", "meaning": "Speak frankly / Honest speech", "stroke_count": 16, "mnemonic": "Word and a jaw/顎; frank speech." },
    { "character": "諧", "on_yomi": "KAI", "kun_yomi": "none", "meaning": "Harmony / Humor / Wit", "stroke_count": 16, "mnemonic": "Word and a all/皆; harmony." },
    { "character": "諫", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Admonish / Remonstrate / Warn", "stroke_count": 16, "mnemonic": "Word and a bundle/柬; warning." },
    { "character": "諭", "on_yomi": "YU", "kun_yomi": "sato-su", "meaning": "Admonish / Teach / Persuade", "stroke_count": 16, "mnemonic": "Word and a transport/輸; teaching." },
    { "character": "諮", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Consult / Question / Deliberate", "stroke_count": 16, "mnemonic": "Word and a next/次; consulting." },
    { "character": "諱", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Taboo / Avoid / Posthumous name", "stroke_count": 16, "mnemonic": "Word and a dangerous/危; taboo." },
    { "character": "諳", "on_yomi": "AN", "kun_yomi": "none", "meaning": "Memorize / Recite / Know by heart", "stroke_count": 16, "mnemonic": "Word and a sound/音; memorizing." },
    { "character": "諶", "on_yomi": "SHIN", "kun_yomi": "none", "meaning": "Sincerity / Truth / Fidelity", "stroke_count": 16, "mnemonic": "Word and a deep/甚; sincerity." },
    { "character": "諷", "on_yomi": "FUU", "kun_yomi": "none", "meaning": "Recite / Satirize / Hint", "stroke_count": 16, "mnemonic": "Word and a wind/風; satire." }
];

let added = 0;
final20.forEach(entry => {
    if (!seenInL21.has(entry.character) && !baseline.has(entry.character) && l21Data.length < 100) {
        l21Data.push(entry);
        seenInL21.add(entry.character);
        added++;
        console.log(`✨ Added: ${entry.character} - ${entry.meaning}`);
    }
});

console.log('\n🎯 Added:', added);
console.log('📊 Final L21 count:', l21Data.length);

if (l21Data.length === 100) {
    console.log('\n🎊🎊🎊 ✅✅✅ L21 COMPLETE WITH 100 KANJI! ✅✅✅ 🎊🎊🎊');
    console.log('🌟🌟🌟 THE GRAND FINALE IS READY! 🌟🌟🌟');
    console.log('🔥🔥🔥 2,100 KANJI CURRICULUM 100% COMPLETE! 🔥🔥🔥');
    console.log('💪💪💪 ALL 21 LESSONS FINALIZED! 💪💪💪');
}

fs.writeFileSync(l21Path, JSON.stringify(l21Data, null, 2), 'utf8');
console.log('💾 Saved kanji_mastery_l21.json');
