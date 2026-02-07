const fs = require('fs');
const path = require('path');

// User-provided L15 raw data
const l15Raw = [
    { "character": "鋳", "on_yomi": "CHUU", "kun_yomi": "i-ru", "meaning": "Casting / Minting", "stroke_count": 15, "mnemonic": "Metal melted and poured into a mold for life/use." },
    { "character": "銭", "on_yomi": "SEN", "kun_yomi": "zeni", "meaning": "Coin / Small change", "stroke_count": 14, "mnemonic": "Metal used as a small unit of money." },
    { "character": "銘", "on_yomi": "MEI", "kun_yomi": "none", "meaning": "Inscription / Signature", "stroke_count": 14, "mnemonic": "Metal engraved with a name/signature." },
    { "character": "鋭", "on_yomi": "EI", "kun_yomi": "uru-doi", "meaning": "Sharp / Agile", "stroke_count": 15, "mnemonic": "Metal that is refined and sharp." },
    { "character": "鋳", "on_yomi": "CHUU", "kun_yomi": "i-ru", "meaning": "Minting", "stroke_count": 15, "mnemonic": "Molding metal." },
    { "character": "鋭", "on_yomi": "EI", "kun_yomi": "uru-doi", "meaning": "Agile", "stroke_count": 15, "mnemonic": "Sharp metal." },
    { "character": "録", "on_yomi": "ROKU", "kun_yomi": "none", "meaning": "Record / Transcript", "stroke_count": 16, "mnemonic": "Metal and water used to carve a permanent record." },
    { "character": "鍛", "on_yomi": "TAN", "kun_yomi": "kita-eru", "meaning": "Forge / Discipline", "stroke_count": 17, "mnemonic": "Metal struck in sections for strength/discipline." },
    { "character": "鍵", "on_yomi": "KEN", "kun_yomi": "kagi", "meaning": "Key", "stroke_count": 17, "mnemonic": "Metal used to build a standard/gate rule." },
    { "character": "鎌", "on_yomi": "REN", "kun_yomi": "kama", "meaning": "Sickle / Scythe", "stroke_count": 18, "mnemonic": "Metal concurrently used for reaping." },
    { "character": "鎖", "on_yomi": "SA", "kun_yomi": "kusari", "meaning": "Chain / Blockade", "stroke_count": 18, "mnemonic": "Metal shells tied together to form a barrier/chain." },
    { "character": "鎧", "on_yomi": "GAI", "kun_yomi": "yoroi", "meaning": "Armor", "stroke_count": 18, "mnemonic": "Metal used to cover and protect like a shell." },
    { "character": "鎮", "on_yomi": "CHIN", "kun_yomi": "shizu-meru", "meaning": "Tranquilize / Appease", "stroke_count": 18, "mnemonic": "Metal that is true and heavy to calm things down." },
    { "character": "鏡", "on_yomi": "KYOU", "kun_yomi": "kagami", "meaning": "Mirror", "stroke_count": 19, "mnemonic": "Metal showing a clear standing reflection." },
    { "character": "鐘", "on_yomi": "SHOU", "kun_yomi": "kane", "meaning": "Bell / Chime", "stroke_count": 20, "mnemonic": "Metal that is a child of the village sound." },
    { "character": "鑑", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Inspect / Specimen", "stroke_count": 23, "mnemonic": "Looking into metal to inspect a sample." },
    { "character": "飢", "on_yomi": "KI", "kun_yomi": "u-eru", "meaning": "Hunger / Starve", "stroke_count": 10, "mnemonic": "Eating/food that is only a desk/empty." },
    { "character": "飯", "on_yomi": "HAN", "kun_yomi": "meshi", "meaning": "Meal / Cooked rice", "stroke_count": 12, "mnemonic": "Food/eating and a return/repeat." },
    { "character": "飽", "on_yomi": "HOU", "kun_yomi": "a-kiru", "meaning": "Satiated / Bored", "stroke_count": 13, "mnemonic": "Food/eating until you are full/wrapped up." },
    { "character": "飼", "on_yomi": "SHI", "kun_yomi": "ka-u", "meaning": "Domesticate / Raise animal", "stroke_count": 13, "mnemonic": "Food/eating given to an officer/manager." },
    { "character": "餅", "on_yomi": "HEI", "kun_yomi": "mochi", "meaning": "Rice cake", "stroke_count": 14, "mnemonic": "Food/eating that is simultaneous/aligned." },
    { "character": "餌", "on_yomi": "JI", "kun_yomi": "esa", "meaning": "Bait / Feed", "stroke_count": 15, "mnemonic": "Food/eating that is an ear/listening for animals." },
    { "character": "餓", "on_yomi": "GA", "kun_yomi": "none", "meaning": "Starve / Hungry", "stroke_count": 15, "mnemonic": "Food/eating that I/me lack entirely." },
    { "character": "館", "on_yomi": "KAN", "kun_yomi": "yakata", "meaning": "Public building / Hall", "stroke_count": 16, "mnemonic": "A building where you eat food." },
    { "character": "饗", "on_yomi": "KYOU", "kun_yomi": "none", "meaning": "Banquet / Feast", "stroke_count": 22, "mnemonic": "Food/eating and a village/hometown spirit." },
    { "character": "衣", "on_yomi": "I", "kun_yomi": "koromo", "meaning": "Garment / Clothing", "stroke_count": 6, "mnemonic": "The shape of a person's upper clothing." },
    { "character": "衷", "on_yomi": "CHUU", "kun_yomi": "none", "meaning": "Inmost / Sincere", "stroke_count": 10, "mnemonic": "The center of one's clothing/heart." },
    { "character": "袋", "on_yomi": "TAI", "kun_yomi": "fukuro", "meaning": "Sack / Bag", "stroke_count": 11, "mnemonic": "Clothing used to substitute/carry items." },
    { "character": "袖", "on_yomi": "SHUU", "kun_yomi": "sode", "meaning": "Sleeve", "stroke_count": 10, "mnemonic": "Clothing and a field; the sleeve of a garment." },
    { "character": "被", "on_yomi": "HI", "kun_yomi": "kou-muru", "meaning": "Incur / Suffer", "stroke_count": 10, "mnemonic": "Clothing and a hide/skin covering the body." },
    { "character": "裁", "on_yomi": "SAI", "kun_yomi": "tata-su", "meaning": "Judge / Cut cloth", "stroke_count": 12, "mnemonic": "Clothing and a weapon/strike to cut a pattern." },
    { "character": "装", "on_yomi": "SOU", "kun_yomi": "yosoo-u", "meaning": "Attire / Equip", "stroke_count": 12, "mnemonic": "Clothing and a scholar/warrior; dressing up." },
    { "character": "裕", "on_yomi": "YUU", "kun_yomi": "none", "meaning": "Abundant / Fertile", "stroke_count": 12, "mnemonic": "Clothing and a valley; rich capacity." },
    { "character": "裸", "on_yomi": "RA", "kun_yomi": "hadaka", "meaning": "Nude / Bare", "stroke_count": 13, "mnemonic": "Clothing and fruit/result; exposed." },
    { "character": "製", "on_yomi": "SEI", "kun_yomi": "none", "meaning": "Manufacture", "stroke_count": 14, "mnemonic": "Clothing and a system; a formal product." },
    { "character": "複", "on_yomi": "FUKU", "kun_yomi": "none", "meaning": "Double / Duplicate", "stroke_count": 14, "mnemonic": "Clothing with double layers; a repeat." },
    { "character": "褐", "on_yomi": "KATSU", "kun_yomi": "none", "meaning": "Brown / Coarse cloth", "stroke_count": 13, "mnemonic": "Clothing that is coarse like a shell." },
    { "character": "褒", "on_yomi": "HOU", "kun_yomi": "ho-meru", "meaning": "Laud / Praise", "stroke_count": 15, "mnemonic": "Clothing and a hall; dressing in honor." },
    { "character": "襟", "on_yomi": "KIN", "kun_yomi": "eri", "meaning": "Collar / Lapel", "stroke_count": 18, "mnemonic": "Clothing and a forbidden/forest area." },
    { "character": "裏", "on_yomi": "RI", "kun_yomi": "ura", "meaning": "Reverse / Inside", "stroke_count": 13, "mnemonic": "Clothing and a village; the inner side." },
    { "character": "裾", "on_yomi": "KYO", "kun_yomi": "suso", "meaning": "Hem / Skirt", "stroke_count": 13, "mnemonic": "Clothing and a seat/place; the hem." },
    { "character": "褒", "on_yomi": "HOU", "kun_yomi": "ho-meru", "meaning": "Extol", "stroke_count": 15, "mnemonic": "Honor hall clothing." },
    { "character": "裸", "on_yomi": "RA", "kun_yomi": "hadaka", "meaning": "Bare", "stroke_count": 13, "mnemonic": "Exposed clothing." },
    { "character": "裾", "on_yomi": "KYO", "kun_yomi": "suso", "meaning": "Cuffs", "stroke_count": 13, "mnemonic": "Seat place cloth." },
    { "character": "褪", "on_yomi": "TAI", "kun_yomi": "a-seru", "meaning": "Discolor / Fade", "stroke_count": 15, "mnemonic": "Clothing and a retreat; fading away." },
    { "character": "憾", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Remorse / Regret", "stroke_count": 16, "mnemonic": "A heart feeling the heavy touch of regret." },
    { "character": "憧", "on_yomi": "SHOU", "kun_yomi": "ako-gareru", "meaning": "Adore / Yearn", "stroke_count": 15, "mnemonic": "A heart feeling childlike yearning." },
    { "character": "憬", "on_yomi": "KEI", "kun_yomi": "none", "meaning": "Long for", "stroke_count": 15, "mnemonic": "Heart viewing a bright scenery." },
    { "character": "憶", "on_yomi": "OKU", "kun_yomi": "none", "meaning": "Memory", "stroke_count": 16, "mnemonic": "Heart holding an idea." },
    { "character": "悟", "on_yomi": "GO", "kun_yomi": "sato-ru", "meaning": "Perceive / Enlighten", "stroke_count": 10, "mnemonic": "Heart and five mouths; clear understanding." },
    { "character": "憩", "on_yomi": "KEI", "kun_yomi": "iko-i", "meaning": "Rest / Recess", "stroke_count": 16, "mnemonic": "Breath and heart; resting the self." },
    { "character": "糾", "on_yomi": "KYUU", "kun_yomi": "none", "meaning": "Examine / Twist", "stroke_count": 9, "mnemonic": "Threads twisted to find truth." },
    { "character": "罷", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Stop / Quit", "stroke_count": 15, "mnemonic": "A net over a bird; stopping movement." },
    { "character": "耗", "on_yomi": "MOU", "kun_yomi": "none", "meaning": "Waste / Decrease", "stroke_count": 10, "mnemonic": "A plow and hair; wasting away." },
    { "character": "呈", "on_yomi": "TEI", "kun_yomi": "none", "meaning": "Present / Display", "stroke_count": 7, "mnemonic": "A mouth presenting a king's message." },
    { "character": "堪", "on_yomi": "KAN", "kun_yomi": "ta-eru", "meaning": "Bear / Endure", "stroke_count": 13, "mnemonic": "Earth withstanding a heavy weight." },
    { "character": "謡", "on_yomi": "YOU", "kun_yomi": "utai", "meaning": "Noh chant / Song", "stroke_count": 16, "mnemonic": "Words spoken like a folk song." },
    { "character": "謙", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Modest / Humble", "stroke_count": 17, "mnemonic": "Words spoken with a double heart." },
    { "character": "謹", "on_yomi": "KIN", "kun_yomi": "tsutsushi-mu", "meaning": "Reverent / Discreet", "stroke_count": 17, "mnemonic": "Words spoken with careful focus." },
    { "character": "遜", "on_yomi": "SON", "kun_yomi": "none", "meaning": "Humble", "stroke_count": 13, "mnemonic": "Walking in a grandson's manner." },
    { "character": "諷", "on_yomi": "FUU", "kun_yomi": "none", "meaning": "Satire / Chant", "stroke_count": 16, "mnemonic": "Words blowing like the wind; satire." },
    { "character": "譜", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Musical score / Genealogy", "stroke_count": 19, "mnemonic": "Words showing a standard score." },
    { "character": "諧", "on_yomi": "KAI", "kun_yomi": "none", "meaning": "Joke / Harmony", "stroke_count": 16, "mnemonic": "Words that harmonize well." },
    { "character": "誼", "on_yomi": "GI", "kun_yomi": "none", "meaning": "Intimacy / Friendship", "stroke_count": 15, "mnemonic": "Words for a proper friendship." },
    { "character": "謳", "on_yomi": "OU", "kun_yomi": "none", "meaning": "Declare / Extol", "stroke_count": 18, "mnemonic": "Words spoken in a loud district." },
    { "character": "謬", "on_yomi": "BYUU", "kun_yomi": "ayamari", "meaning": "Fallacy / Error", "stroke_count": 18, "mnemonic": "Words that are twisted; a mistake." },
    { "character": "訃", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Death notice", "stroke_count": 9, "mnemonic": "Words about one who is deceased." },
    { "character": "詠", "on_yomi": "EI", "kun_yomi": "yo-mu", "meaning": "Compose poetry / Recite", "stroke_count": 12, "mnemonic": "Words flowing like a poem." },
    { "character": "誂", "on_yomi": "CHOU", "kun_yomi": "atsura-eru", "meaning": "Custom-made / Order", "stroke_count": 13, "mnemonic": "Words spoken to pick an order." },
    { "character": "諮", "on_yomi": "SHI", "kun_yomi": "haka-ru", "meaning": "Consult", "stroke_count": 16, "mnemonic": "Words used for an elder consult." },
    { "character": "諾", "on_yomi": "DAKU", "kun_yomi": "none", "meaning": "Agreement", "stroke_count": 15, "mnemonic": "Words for formal approval." },
    { "character": "謀", "on_yomi": "BOU", "kun_yomi": "haka-ru", "meaning": "Conspire", "stroke_count": 16, "mnemonic": "Words for a secret plan." },
    { "character": "諫", "on_yomi": "KAN", "kun_yomi": "isa-meru", "meaning": "Remonstrate", "stroke_count": 16, "mnemonic": "Words for a pure truth." },
    { "character": "豁", "on_yomi": "KATSU", "kun_yomi": "none", "meaning": "Wide / Open", "stroke_count": 17, "mnemonic": "A valley with a cut; wide open." },
    { "character": "詫", "on_yomi": "TA", "kun_yomi": "wabi-ru", "meaning": "Apologize", "stroke_count": 13, "mnemonic": "Words spoken for home/settlement." },
    { "character": "詭", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Deceive", "stroke_count": 13, "mnemonic": "Dangerous cliff words." },
    { "character": "談", "on_yomi": "DAN", "kun_yomi": "none", "meaning": "Discourse", "stroke_count": 15, "mnemonic": "Fire talk words." },
    { "character": "請", "on_yomi": "SEI", "kun_yomi": "ko-u", "meaning": "Solicit", "stroke_count": 15, "mnemonic": "Clear clean request words." },
    { "character": "諸", "on_yomi": "SHO", "kun_yomi": "moro-moro", "meaning": "Various", "stroke_count": 15, "mnemonic": "Many words many people." },
    { "character": "評", "on_yomi": "HYOU", "kun_yomi": "none", "meaning": "Evaluate", "stroke_count": 12, "mnemonic": "Judging flat standard words." },
    { "character": "講", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Lecture", "stroke_count": 17, "mnemonic": "Organized lecture words." },
    { "character": "該", "on_yomi": "GAI", "kun_yomi": "none", "meaning": "Relevant", "stroke_count": 13, "mnemonic": "Relevant child words." },
    { "character": "誕", "on_yomi": "TAN", "kun_yomi": "none", "meaning": "Birth", "stroke_count": 15, "mnemonic": "Life extension words." },
    { "character": "誘", "on_yomi": "YUU", "kun_yomi": "saso-u", "meaning": "Entice", "stroke_count": 14, "mnemonic": "Excellent invitation words." },
    { "character": "詣", "on_yomi": "KEI", "kun_yomi": "mai-ru", "meaning": "Visit a temple / Pilgrimage", "stroke_count": 13, "mnemonic": "Words spoken while visiting a shrine/gate." },
    { "character": "詮", "on_yomi": "SEN", "kun_yomi": "none", "meaning": "Elucidate / Result", "stroke_count": 13, "mnemonic": "Words that provide a final result/pure point." },
    { "character": "誰", "on_yomi": "SUI", "kun_yomi": "dare", "meaning": "Who", "stroke_count": 15, "mnemonic": "Words spoken to identify a person/subject." },
    { "character": "謎", "on_yomi": "MEI", "kun_yomi": "nazo", "meaning": "Riddle / Mystery / Puzzle", "stroke_count": 15, "mnemonic": "Words that are a lost/obscured walk; a puzzle." },
    { "character": "諦", "on_yomi": "TEI", "kun_yomi": "aki-rameru", "meaning": "Abandon / Resign / Clear", "stroke_count": 16, "mnemonic": "Words spoken to achieve a clear/emperor-like state." },
    { "character": "諭", "on_yomi": "YU", "kun_yomi": "sato-su", "meaning": "Admonish / Persuade", "stroke_count": 16, "mnemonic": "Words used for a formal lecture/meeting." },
    { "character": "諺", "on_yomi": "GEN", "kun_yomi": "kotowaza", "meaning": "Proverb / Saying", "stroke_count": 16, "mnemonic": "Words used by an accomplished/virtuous person." },
    { "character": "諜", "on_yomi": "CHOU", "kun_yomi": "none", "meaning": "Spying / Reconnaissance", "stroke_count": 16, "mnemonic": "Words recorded on a leaf-like slip; spying." },
    { "character": "諧", "on_yomi": "KAI", "kun_yomi": "none", "meaning": "Harmony", "stroke_count": 16, "mnemonic": "Harmonious words." },
    { "character": "諫", "on_yomi": "KAN", "kun_yomi": "isa-meru", "meaning": "Admonish", "stroke_count": 16, "mnemonic": "Pure truth words." },
    { "character": "諱", "on_yomi": "KI", "kun_yomi": "imi-na", "meaning": "Taboo / Posthumous name", "stroke_count": 16, "mnemonic": "Words that are forbidden or skin/hide-like." },
    { "character": "謂", "on_yomi": "I", "kun_yomi": "iwa-re", "meaning": "Reason / Origin / Oral tradition", "stroke_count": 16, "mnemonic": "Words spoken about a stomach/origin; tradition." },
    { "character": "謙", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Humble", "stroke_count": 17, "mnemonic": "Humble heart words." },
    { "character": "謹", "on_yomi": "KIN", "kun_yomi": "tsutsushi-mu", "meaning": "Discreet", "stroke_count": 17, "mnemonic": "Careful focus words." },
    { "character": "謳", "on_yomi": "OU", "kun_yomi": "none", "meaning": "Extol", "stroke_count": 18, "mnemonic": "Loud district words." },
    { "character": "謬", "on_yomi": "BYUU", "kun_yomi": "ayamari", "meaning": "Error", "stroke_count": 18, "mnemonic": "Twisted mistake words." }
];

// Load baseline (L1-L14)
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

console.log('=== L15 RAW DATA AUDIT ===');
console.log('Baseline unique count (L1-L14):', baseline.size);
console.log('L15 raw count:', l15Raw.length);

// Check for internal duplicates in L15
let seenInL15 = new Set();
let internalDups = new Set();
l15Raw.forEach(entry => {
    if (seenInL15.has(entry.character)) {
        internalDups.add(entry.character);
    }
    seenInL15.add(entry.character);
});

// Check for baseline duplicates
let baselineDups = new Set();
l15Raw.forEach(entry => {
    if (baseline.has(entry.character)) {
        baselineDups.add(entry.character);
    }
});

// Get unique L15
let uniqueL15 = [];
let uniqueSet = new Set();
l15Raw.forEach(entry => {
    if (!uniqueSet.has(entry.character) && !baseline.has(entry.character)) {
        uniqueL15.push(entry);
        uniqueSet.add(entry.character);
    }
});

console.log('\n=== RESULTS ===');
console.log('Internal Duplicates:', internalDups.size);
if (internalDups.size > 0) {
    console.log('  Characters:', Array.from(internalDups).join(', '));
}

console.log('Baseline Duplicates:', baselineDups.size);
if (baselineDups.size > 0) {
    console.log('  Characters:', Array.from(baselineDups).join(', '));
}

console.log('Unique L15 Count:', uniqueL15.length);
console.log('Need to replace:', 100 - uniqueL15.length, 'Kanji');

if (uniqueL15.length === 100) {
    console.log('\n✅ L15 is perfect! Zero duplicates!');
}
