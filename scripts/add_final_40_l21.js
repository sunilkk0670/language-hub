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

// Final 40 unique N1 Kanji (thread糸, word言, and misc radicals)
const final40 = [
    { "character": "緑", "on_yomi": "RYOKU", "kun_yomi": "midori", "meaning": "Green / Verdant", "stroke_count": 14, "mnemonic": "Thread and a record/録; green color." },
    { "character": "線", "on_yomi": "SEN", "kun_yomi": "none", "meaning": "Line / Wire / Track", "stroke_count": 15, "mnemonic": "Thread and a spring/泉; a line." },
    { "character": "締", "on_yomi": "TEI", "kun_yomi": "shi-meru", "meaning": "Tighten / Tie / Fasten", "stroke_count": 15, "mnemonic": "Thread and an emperor/帝; tightening." },
    { "character": "編", "on_yomi": "HEN", "kun_yomi": "a-mu", "meaning": "Compile / Edit / Knit", "stroke_count": 15, "mnemonic": "Thread and a flat/扁; weaving." },
    { "character": "緩", "on_yomi": "KAN", "kun_yomi": "yuru-i", "meaning": "Loose / Slow / Lenient", "stroke_count": 15, "mnemonic": "Thread and a slow/緩; loosening." },
    { "character": "縁", "on_yomi": "EN", "kun_yomi": "fuchi", "meaning": "Edge / Relation / Fate", "stroke_count": 15, "mnemonic": "Thread and a pig/豕; connection." },
    { "character": "縄", "on_yomi": "JOU", "kun_yomi": "nawa", "meaning": "Rope / Cord", "stroke_count": 15, "mnemonic": "Thread and a frog/黽; twisted rope." },
    { "character": "縞", "on_yomi": "KOU", "kun_yomi": "shima", "meaning": "Stripe / Stripe pattern", "stroke_count": 16, "mnemonic": "Thread and a marquis/侯; striped." },
    { "character": "縫", "on_yomi": "HOU", "kun_yomi": "nu-u", "meaning": "Sew / Stitch", "stroke_count": 16, "mnemonic": "Thread and a meet/逢; sewing." },
    { "character": "縮", "on_yomi": "SHUKU", "kun_yomi": "chiji-mu", "meaning": "Shrink / Contract / Reduce", "stroke_count": 17, "mnemonic": "Thread and a lodge/宿; shrinking." },
    { "character": "績", "on_yomi": "SEKI", "kun_yomi": "none", "meaning": "Achievement / Merit / Spinning", "stroke_count": 17, "mnemonic": "Thread and a accumulate/積; achievement." },
    { "character": "繁", "on_yomi": "HAN", "kun_yomi": "shige-ru", "meaning": "Luxuriant / Prosperous / Busy", "stroke_count": 16, "mnemonic": "Thread and every/敏; flourishing." },
    { "character": "繊", "on_yomi": "SEN", "kun_yomi": "none", "meaning": "Fiber / Slender / Fine", "stroke_count": 17, "mnemonic": "Thread and a thousand/韱; fine fiber." },
    { "character": "繋", "on_yomi": "KEI", "kun_yomi": "tsuna-gu", "meaning": "Connect / Tie / Link", "stroke_count": 17, "mnemonic": "Thread and a system/系; connecting." },
    { "character": "繰", "on_yomi": "SOU", "kun_yomi": "ku-ru", "meaning": "Reel / Wind / Repeat", "stroke_count": 19, "mnemonic": "Thread and a goods/喿; reeling." },
    { "character": "繹", "on_yomi": "YAKU", "kun_yomi": "none", "meaning": "Unravel / Deduce / Explain", "stroke_count": 19, "mnemonic": "Thread and a easy/睪; unraveling." },
    { "character": "繻", "on_yomi": "JU", "kun_yomi": "none", "meaning": "Silk fabric / Satin", "stroke_count": 19, "mnemonic": "Thread and a demand/需; silk." },
    { "character": "纈", "on_yomi": "KETSU", "kun_yomi": "none", "meaning": "Tie-dye / Figured cloth", "stroke_count": 20, "mnemonic": "Thread and a decide/穴; tie-dye." },
    { "character": "纉", "on_yomi": "SAN", "kun_yomi": "none", "meaning": "Inherit / Succeed", "stroke_count": 20, "mnemonic": "Thread and a continue/算; inheriting." },
    { "character": "續", "on_yomi": "ZOKU", "kun_yomi": "none", "meaning": "Continue / Sequel", "stroke_count": 21, "mnemonic": "Thread and a sell/賣; continuing." },
    { "character": "訂", "on_yomi": "TEI", "kun_yomi": "none", "meaning": "Revise / Correct / Decide", "stroke_count": 9, "mnemonic": "Word and a nail/丁; correcting." },
    { "character": "訃", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Obituary / Death notice", "stroke_count": 9, "mnemonic": "Word and a not/卜; death news." },
    { "character": "計", "on_yomi": "KEI", "kun_yomi": "haka-ru", "meaning": "Measure / Plan / Total", "stroke_count": 9, "mnemonic": "Word and a ten/十; calculating." },
    { "character": "訊", "on_yomi": "JIN", "kun_yomi": "none", "meaning": "Inquire / Question", "stroke_count": 10, "mnemonic": "Word and a inquire/卂; questioning." },
    { "character": "討", "on_yomi": "TOU", "kun_yomi": "u-tsu", "meaning": "Chastise / Attack / Defeat", "stroke_count": 10, "mnemonic": "Word and a inch/寸; attacking." },
    { "character": "訟", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Lawsuit / Litigation", "stroke_count": 11, "mnemonic": "Word and a public/公; legal suit." },
    { "character": "訣", "on_yomi": "KETSU", "kun_yomi": "none", "meaning": "Farewell / Secret / Knack", "stroke_count": 11, "mnemonic": "Word and a decide/夬; parting words." },
    { "character": "訥", "on_yomi": "TOTSU", "kun_yomi": "none", "meaning": "Slow of speech / Inarticulate", "stroke_count": 11, "mnemonic": "Word and a inside/内; hesitant speech." },
    { "character": "訪", "on_yomi": "HOU", "kun_yomi": "tazu-neru", "meaning": "Visit / Call on / Interview", "stroke_count": 11, "mnemonic": "Word and a direction/方; visiting." },
    { "character": "設", "on_yomi": "SETSU", "kun_yomi": "mou-keru", "meaning": "Establish / Set up / Install", "stroke_count": 11, "mnemonic": "Word and a few/殳; establishing." },
    { "character": "許", "on_yomi": "KYO", "kun_yomi": "yuru-su", "meaning": "Permit / Allow / Approve", "stroke_count": 11, "mnemonic": "Word and a noon/午; permission." },
    { "character": "訳", "on_yomi": "YAKU", "kun_yomi": "wake", "meaning": "Translation / Reason / Meaning", "stroke_count": 11, "mnemonic": "Word and a scale/尺; translating." },
    { "character": "訴", "on_yomi": "SO", "kun_yomi": "utta-eru", "meaning": "Sue / Accuse / Appeal", "stroke_count": 12, "mnemonic": "Word and a moreover/斥; appealing." },
    { "character": "診", "on_yomi": "SHIN", "kun_yomi": "mi-ru", "meaning": "Diagnose / Examine / Checkup", "stroke_count": 12, "mnemonic": "Word and a hair/彡; diagnosing." },
    { "character": "註", "on_yomi": "CHUU", "kun_yomi": "none", "meaning": "Annotation / Note / Comment", "stroke_count": 12, "mnemonic": "Word and a master/主; annotating." },
    { "character": "詞", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Part of speech / Word / Poetry", "stroke_count": 12, "mnemonic": "Word and a director/司; words." },
    { "character": "詠", "on_yomi": "EI", "kun_yomi": "yo-mu", "meaning": "Recite / Compose / Poem", "stroke_count": 12, "mnemonic": "Word and a forever/永; poetry." },
    { "character": "詣", "on_yomi": "KEI", "kun_yomi": "mou-deru", "meaning": "Visit shrine / Go / Reach", "stroke_count": 13, "mnemonic": "Word and a climax/旨; pilgrimage." },
    { "character": "試", "on_yomi": "SHI", "kun_yomi": "kokoro-miru", "meaning": "Test / Try / Attempt", "stroke_count": 13, "mnemonic": "Word and a type/式; testing." },
    { "character": "詩", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Poem / Poetry / Verse", "stroke_count": 13, "mnemonic": "Word and a temple/寺; poetry." }
];

let added = 0;
final40.forEach(entry => {
    if (!seenInL21.has(entry.character) && !baseline.has(entry.character) && l21Data.length < 100) {
        l21Data.push(entry);
        seenInL21.add(entry.character);
        added++;
        console.log(`Added: ${entry.character} - ${entry.meaning}`);
    }
});

console.log('\nAdded:', added);
console.log('Final L21 count:', l21Data.length);

if (l21Data.length === 100) {
    console.log('✅✅✅ L21 COMPLETE WITH 100 KANJI! THE GRAND FINALE IS READY! ✅✅✅');
    console.log('🎊🎊🎊 2,100 KANJI CURRICULUM COMPLETE! 🎊🎊🎊');
}

fs.writeFileSync(l21Path, JSON.stringify(l21Data, null, 2), 'utf8');
console.log('Saved kanji_mastery_l21.json');
