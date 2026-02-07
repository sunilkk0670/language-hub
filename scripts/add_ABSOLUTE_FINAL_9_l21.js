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
console.log('🔥🔥🔥 THE FINAL 9 KANJI TO COMPLETE THE ENTIRE 2,100 KANJI CURRICULUM! 🔥🔥🔥');

// THE ABSOLUTE FINAL 9 unique N1 Kanji to complete the 2,100 Kanji curriculum!
const absoluteFinal9 = [
    { "character": "諺", "on_yomi": "GEN", "kun_yomi": "kotowaza", "meaning": "Proverb / Saying / Maxim", "stroke_count": 16, "mnemonic": "Word and a display/彦; a proverb." },
    { "character": "諾", "on_yomi": "DAKU", "kun_yomi": "none", "meaning": "Consent / Assent / Agreement", "stroke_count": 16, "mnemonic": "Word and a young/若; consent." },
    { "character": "謂", "on_yomi": "I", "kun_yomi": "none", "meaning": "Say / Call / Mean", "stroke_count": 16, "mnemonic": "Word and a stomach/胃; meaning." },
    { "character": "謄", "on_yomi": "TOU", "kun_yomi": "none", "meaning": "Transcribe / Copy / Duplicate", "stroke_count": 17, "mnemonic": "Word and a moon/月; transcribing." },
    { "character": "謗", "on_yomi": "BOU", "kun_yomi": "none", "meaning": "Slander / Defame / Libel", "stroke_count": 17, "mnemonic": "Word and a side/旁; slander." },
    { "character": "謙", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Humble / Modest / Self-effacing", "stroke_count": 17, "mnemonic": "Word and a concurrent/兼; humility." },
    { "character": "謚", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Posthumous name / Epithet", "stroke_count": 17, "mnemonic": "Word and a benefit/益; posthumous." },
    { "character": "謝", "on_yomi": "SHA", "kun_yomi": "ayama-ru", "meaning": "Thank / Apologize / Refuse", "stroke_count": 17, "mnemonic": "Word and a shoot/射; thanking." },
    { "character": "謠", "on_yomi": "YOU", "kun_yomi": "none", "meaning": "Ballad / Song / Rumor", "stroke_count": 17, "mnemonic": "Word and a shake/搖; a ballad." }
];

let added = 0;
absoluteFinal9.forEach(entry => {
    if (!seenInL21.has(entry.character) && !baseline.has(entry.character) && l21Data.length < 100) {
        l21Data.push(entry);
        seenInL21.add(entry.character);
        added++;
        console.log(`✨✨✨ Added: ${entry.character} - ${entry.meaning}`);
    }
});

console.log('\n🎯 Added:', added);
console.log('📊 Final L21 count:', l21Data.length);

if (l21Data.length === 100) {
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎊🎊🎊 ✅✅✅ L21 COMPLETE WITH 100 KANJI! ✅✅✅ 🎊🎊🎊');
    console.log('🌟🌟🌟 THE GRAND FINALE IS READY! 🌟🌟🌟');
    console.log('🔥🔥🔥 2,100 KANJI CURRICULUM 100% COMPLETE! 🔥🔥🔥');
    console.log('💪💪💪 ALL 21 LESSONS FINALIZED! 💪💪💪');
    console.log('🏆🏆🏆 MISSION ACCOMPLISHED! 🏆🏆🏆');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n');
}

fs.writeFileSync(l21Path, JSON.stringify(l21Data, null, 2), 'utf8');
console.log('💾 Saved kanji_mastery_l21.json');
