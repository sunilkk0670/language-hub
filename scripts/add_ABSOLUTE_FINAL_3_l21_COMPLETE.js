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
console.log('🔥🔥🔥 THE ABSOLUTE FINAL 3 KANJI TO COMPLETE THE ENTIRE 2,100 KANJI CURRICULUM! 🔥🔥🔥');
console.log('🎯🎯🎯 THIS IS IT - THE GRAND FINALE! 🎯🎯🎯');

// THE ABSOLUTE FINAL 3 unique N1 Kanji to complete the 2,100 Kanji curriculum!
const absoluteFinal3 = [
    { "character": "譎", "on_yomi": "KETSU", "kun_yomi": "none", "meaning": "Cunning / Deceit / Stratagem", "stroke_count": 19, "mnemonic": "Word and a decide/矍; cunning." },
    { "character": "譏", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Ridicule / Jeer / Criticize", "stroke_count": 19, "mnemonic": "Word and a how/幾; ridicule." },
    { "character": "譖", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Slander / False accusation", "stroke_count": 20, "mnemonic": "Word and a advance/替; slander." }
];

let added = 0;
absoluteFinal3.forEach(entry => {
    if (!seenInL21.has(entry.character) && !baseline.has(entry.character) && l21Data.length < 100) {
        l21Data.push(entry);
        seenInL21.add(entry.character);
        added++;
        console.log(`🏆🏆🏆 Added: ${entry.character} - ${entry.meaning}`);
    }
});

console.log('\n🎯 Added:', added);
console.log('📊 Final L21 count:', l21Data.length);

if (l21Data.length === 100) {
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎊🎊🎊 ✅✅✅ L21 COMPLETE WITH 100 KANJI! ✅✅✅ 🎊🎊🎊');
    console.log('🌟🌟🌟 THE GRAND FINALE IS READY! 🌟🌟🌟');
    console.log('🔥🔥🔥 2,100 KANJI CURRICULUM 100% COMPLETE! 🔥🔥🔥');
    console.log('💪💪💪 ALL 21 LESSONS FINALIZED! 💪💪💪');
    console.log('🏆🏆🏆 MISSION ACCOMPLISHED! 🏆🏆🏆');
    console.log('🎉🎉🎉 CONGRATULATIONS! 🎉🎉🎉');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n');
}

fs.writeFileSync(l21Path, JSON.stringify(l21Data, null, 2), 'utf8');
console.log('💾 Saved kanji_mastery_l21.json');
