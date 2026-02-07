const fs = require('fs');
const path = require('path');

// Load baseline (L1-L10)
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
    'kanji_mastery_l10.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

// L11 raw data
const l11Raw = [
    { "character": "総", "on_yomi": "SOU", "kun_yomi": "none", "meaning": "General / Whole", "stroke_count": 14, "mnemonic": "Threads bundled for a public/whole view." },
    { "character": "領", "on_yomi": "RYOU", "kun_yomi": "none", "meaning": "Territory / Domain", "stroke_count": 14, "mnemonic": "Leading the head of a territory." },
    { "character": "域", "on_yomi": "IKI", "kun_yomi": "none", "meaning": "Zone / Region", "stroke_count": 11, "mnemonic": "Earth with a boundary wall around it." },
    { "character": "省", "on_yomi": "SHOU", "kun_yomi": "habu-ku", "meaning": "Omit / Ministry", "stroke_count": 9, "mnemonic": "Looking with a small/focused eye; an office." },
    { "character": "庁", "on_yomi": "CHOU", "kun_yomi": "none", "meaning": "Government Office", "stroke_count": 5, "mnemonic": "An official building with a street/marker." },
    { "character": "府", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Urban Prefecture", "stroke_count": 8, "mnemonic": "Official items kept under a roof." },
    { "character": "県", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Prefecture", "stroke_count": 9, "mnemonic": "An eye and hook marking a district." },
    { "character": "市", "on_yomi": "SHI", "kun_yomi": "ichi", "meaning": "City / Market", "stroke_count": 5, "mnemonic": "A lid over a scale for a market." },
    { "character": "区", "on_yomi": "KU", "kun_yomi": "none", "meaning": "Ward / District", "stroke_count": 4, "mnemonic": "A box marking a specific area." },
    { "character": "町", "on_yomi": "CHOU", "kun_yomi": "machi", "meaning": "Town", "stroke_count": 7, "mnemonic": "Rice fields and a street marker." },
    { "character": "村", "on_yomi": "SON", "kun_yomi": "mura", "meaning": "Village", "stroke_count": 7, "mnemonic": "A tree near a community/inch." },
    { "character": "様", "on_yomi": "YOU", "kun_yomi": "sama", "meaning": "Way / Honorific", "stroke_count": 14, "mnemonic": "Wood and sheep in water; the proper way." },
    { "character": "他", "on_yomi": "TA", "kun_yomi": "hoka", "meaning": "Other", "stroke_count": 5, "mnemonic": "A person standing by another person." },
    { "character": "各", "on_yomi": "KAKU", "kun_yomi": "ono-ono", "meaning": "Each / Every", "stroke_count": 6, "mnemonic": "A footprint and a mouth; each step." },
    { "character": "諸", "on_yomi": "SHO", "kun_yomi": "moro-moro", "meaning": "Various / Many", "stroke_count": 15, "mnemonic": "Various words spoken by many people." },
    { "character": "専", "on_yomi": "SEN", "kun_yomi": "moppa-ra", "meaning": "Exclusive / Solely", "stroke_count": 9, "mnemonic": "A shuttle used in exclusive weaving." },
    { "character": "門", "on_yomi": "MON", "kun_yomi": "kado", "meaning": "Gate / Specialty", "stroke_count": 8, "mnemonic": "Double swinging doors of an entrance." },
    { "character": "系", "on_yomi": "KEI", "kun_yomi": "none", "meaning": "Lineage / System", "stroke_count": 7, "mnemonic": "A line of silk threads; a system." },
    { "character": "列", "on_yomi": "RETSU", "kun_yomi": "none", "meaning": "Row / Line", "stroke_count": 6, "mnemonic": "A knife cutting things into a line/row." },
    { "character": "等", "on_yomi": "TOU", "kun_yomi": "hitoshii", "meaning": "Equal / Rank", "stroke_count": 12, "mnemonic": "Bamboo slips standing together equally." },
    { "character": "級", "on_yomi": "KYUU", "kun_yomi": "none", "meaning": "Level / Grade", "stroke_count": 9, "mnemonic": "Thread reaching a certain level/step." },
    { "character": "段", "on_yomi": "DAN", "kun_yomi": "none", "meaning": "Step / Grade", "stroke_count": 9, "mnemonic": "Climbing steps with a weapon/tool." },
    { "character": "個", "on_yomi": "KO", "kun_yomi": "none", "meaning": "Individual / Item", "stroke_count": 10, "mnemonic": "A person standing by an ancient item." },
    { "character": "枚", "on_yomi": "MAI", "kun_yomi": "none", "meaning": "Sheet / Counter", "stroke_count": 8, "mnemonic": "A tree being struck into thin sheets." },
    { "character": "副", "on_yomi": "FUKU", "kun_yomi": "none", "meaning": "Deputy / Vice", "stroke_count": 11, "mnemonic": "A knife and a full jar; a second part." },
    { "character": "複", "on_yomi": "FUKU", "kun_yomi": "none", "meaning": "Complex / Double", "stroke_count": 14, "mnemonic": "Clothing with double layers; complex." },
    { "character": "欠", "on_yomi": "KETSU", "kun_yomi": "ka-ku", "meaning": "Lack / Gap", "stroke_count": 4, "mnemonic": "A person yawning; a gap in breath." },
    { "character": "点", "on_yomi": "TEN", "kun_yomi": "none", "meaning": "Point / Score", "stroke_count": 9, "mnemonic": "Fortune telling and fire marking a point." },
    { "character": "数", "on_yomi": "SUU", "kun_yomi": "kazu", "meaning": "Number / Count", "stroke_count": 13, "mnemonic": "A woman counting items with a stick." },
    { "character": "量", "on_yomi": "RYOU", "kun_yomi": "none", "meaning": "Quantity / Amount", "stroke_count": 12, "mnemonic": "Sun over a village; measuring weight." },
    { "character": "算", "on_yomi": "SAN", "kun_yomi": "none", "meaning": "Calculate / Count", "stroke_count": 14, "mnemonic": "Bamboo slips and hands calculating." },
    { "character": "額", "on_yomi": "GAKU", "kun_yomi": "hitai", "meaning": "Amount / Forehead", "stroke_count": 18, "mnemonic": "The head/top of a total value." },
    { "character": "度", "on_yomi": "DO", "kun_yomi": "tabi", "meaning": "Degree / Times", "stroke_count": 9, "mnemonic": "Measuring under a roof with a hand." },
    { "character": "回", "on_yomi": "KAI", "kun_yomi": "mawa-su", "meaning": "Times / Rotate", "stroke_count": 6, "mnemonic": "A circle within a square." },
    { "character": "倍", "on_yomi": "BAI", "kun_yomi": "none", "meaning": "Double / Times", "stroke_count": 10, "mnemonic": "A person standing by a multi-leveled pile." },
    { "character": "比", "on_yomi": "HI", "kun_yomi": "kura-beru", "meaning": "Compare", "stroke_count": 4, "mnemonic": "Two people standing side-by-side." },
    { "character": "対", "on_yomi": "TAI", "kun_yomi": "none", "meaning": "Versus / Match", "stroke_count": 7, "mnemonic": "A hand holding a mark against another." },
    { "character": "反", "on_yomi": "HAN", "kun_yomi": "so-ru", "meaning": "Opposite / Anti-", "stroke_count": 4, "mnemonic": "A cliff and a hand reaching back." },
    { "character": "非", "on_yomi": "HI", "kun_yomi": "ara-zu", "meaning": "Non- / Fault", "stroke_count": 8, "mnemonic": "Wings turned away; wrong/negative." },
    { "character": "否", "on_yomi": "HI", "kun_yomi": "ina", "meaning": "Negate / No", "stroke_count": 7, "mnemonic": "A mouth saying 'no' to a negative sign." },
    { "character": "能", "on_yomi": "NOU", "kun_yomi": "none", "meaning": "Ability / Talent", "stroke_count": 10, "mnemonic": "A bear-like shape representing talent." },
    { "character": "可", "on_yomi": "KA", "kun_yomi": "none", "meaning": "Can / Possible", "stroke_count": 5, "mnemonic": "A mouth expressing power; permission." },
    { "character": "若", "on_yomi": "JAKU", "kun_yomi": "waka-i", "meaning": "Young", "stroke_count": 8, "mnemonic": "Grass and a woman; youth/freshness." },
    { "character": "老", "on_yomi": "ROU", "kun_yomi": "o-iru", "meaning": "Old / Elder", "stroke_count": 6, "mnemonic": "An elder leaning on a staff." },
    { "character": "初", "on_yomi": "SHO", "kun_yomi": "haji-me", "meaning": "First / Beginning", "stroke_count": 7, "mnemonic": "Cutting cloth for the first time." },
    { "character": "再", "on_yomi": "SAI", "kun_yomi": "futata-bi", "meaning": "Again / Repeat", "stroke_count": 6, "mnemonic": "A line crossing over twice; repeated." },
    { "character": "新", "on_yomi": "SHIN", "kun_yomi": "atara-shii", "meaning": "New", "stroke_count": 13, "mnemonic": "Standing by a tree with an axe for wood." },
    { "character": "旧", "on_yomi": "KYUU", "kun_yomi": "furu-i", "meaning": "Old / Former", "stroke_count": 5, "mnemonic": "Sun passing by a pillar of time." },
    { "character": "中", "on_yomi": "CHUU", "kun_yomi": "naka", "meaning": "Middle / Inside", "stroke_count": 4, "mnemonic": "A line through the center of a box." },
    { "character": "了", "on_yomi": "RYOU", "kun_yomi": "none", "meaning": "Complete / Done", "stroke_count": 2, "mnemonic": "A person with arms finished; done." }
];

let internalDups = new Set();
let baselineDups = new Set();
let uniqueL11 = [];
let seenInL11 = new Set();

l11Raw.forEach(entry => {
    if (seenInL11.has(entry.character)) {
        internalDups.add(entry.character);
    } else if (baseline.has(entry.character)) {
        baselineDups.add(entry.character);
    } else {
        uniqueL11.push(entry);
    }
    seenInL11.add(entry.character);
});

console.log('\nInternal Duplicates:', Array.from(internalDups).join(', ') || 'None');
console.log('Baseline Duplicates:', Array.from(baselineDups).join(', ') || 'None');
console.log('Unique L11 Count:', uniqueL11.length);
console.log('Need to replace:', 50 - uniqueL11.length, 'Kanji');
