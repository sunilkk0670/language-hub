const fs = require('fs');
const path = require('path');

// Full L19 raw data from user (counting all entries)
const l19Raw = [
    { "character": "蒔", "on_yomi": "SHI", "kun_yomi": "ma-ku", "meaning": "Sow / Plant", "stroke_count": 13, "mnemonic": "Grass and time; sowing seeds for a season." },
    { "character": "蔑", "on_yomi": "BETSU", "kun_yomi": "sagesu-mu", "meaning": "Contempt / Scorn", "stroke_count": 14, "mnemonic": "Grass over an eye and a boundary; looking down on others." },
    { "character": "蔽", "on_yomi": "HEI", "kun_yomi": "none", "meaning": "Cover / Hide / Shelter", "stroke_count": 15, "mnemonic": "Grass and tattered cloth; covering or hiding a state." },
    { "character": "蕾", "on_yomi": "RAI", "kun_yomi": "tsubomi", "meaning": "Bud", "stroke_count": 16, "mnemonic": "Grass and thunder; a flower bud waiting to burst open." },
    { "character": "薔", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Rose", "stroke_count": 17, "mnemonic": "Grass and a wall/granary; the pattern of a rose flower." },
    { "character": "薇", "on_yomi": "BI", "kun_yomi": "none", "meaning": "Fern / Osmunda", "stroke_count": 18, "mnemonic": "Grass and a mountain/path; a wild fern." },
    { "character": "薯", "on_yomi": "SHO", "kun_yomi": "none", "meaning": "Potato / Yam", "stroke_count": 16, "mnemonic": "Grass and a person/specialist building; a cultivated tuber." },
    { "character": "薦", "on_yomi": "SEN", "kun_yomi": "susu-meru", "meaning": "Recommend / Advise", "stroke_count": 16, "mnemonic": "Grass over a bird/deer; offering/recommending quality." },
    { "character": "薪", "on_yomi": "SHIN", "kun_yomi": "maki", "meaning": "Firewood / Fuel", "stroke_count": 16, "mnemonic": "Grass and new wood used for fuel." },
    { "character": "薫", "on_yomi": "KUN", "kun_yomi": "kao-ru", "meaning": "Fragrance / Scent", "stroke_count": 16, "mnemonic": "Grass and a heavy/black scent; deep fragrance." },
    { "character": "藁", "on_yomi": "KOU", "kun_yomi": "wara", "meaning": "Straw", "stroke_count": 18, "mnemonic": "Grass and high wood; dried straw." },
    { "character": "藍", "on_yomi": "RAN", "kun_yomi": "ai", "meaning": "Indigo", "stroke_count": 18, "mnemonic": "Grass and a supervisor/dish; the deep blue of indigo dye." },
    { "character": "蘭", "on_yomi": "RAN", "kun_yomi": "none", "meaning": "Orchid / Holland", "stroke_count": 19, "mnemonic": "Grass and a gate/silk; the delicate orchid flower." },
    { "character": "虻", "on_yomi": "BOU", "kun_yomi": "abu", "meaning": "Horsefly / Gadfly", "stroke_count": 9, "mnemonic": "Insect and a death/disappear mark; a biting fly." },
    { "character": "蚤", "on_yomi": "SOU", "kun_yomi": "nomi", "meaning": "Flea", "stroke_count": 9, "mnemonic": "Insect and a claw/hand; a small jumping pest." },
    { "character": "蛋", "on_yomi": "TAN", "kun_yomi": "none", "meaning": "Egg", "stroke_count": 11, "mnemonic": "Insect and a path/altar; a smooth egg shell." },
    { "character": "蛮", "on_yomi": "BAN", "kun_yomi": "none", "meaning": "Barbarian / Savage", "stroke_count": 12, "mnemonic": "Insect and a word/thread; a primitive/savage state." },
    { "character": "蛾", "on_yomi": "GA", "kun_yomi": "none", "meaning": "Moth", "stroke_count": 13, "mnemonic": "Insect and me/self; the butterfly-like moth." },
    { "character": "蜂", "on_yomi": "HOU", "kun_yomi": "hachi", "meaning": "Bee / Wasp", "stroke_count": 13, "mnemonic": "Insect and a move/peak; a flying stinger." },
    { "character": "蜀", "on_yomi": "SHOKU", "kun_yomi": "none", "meaning": "Moth / State of Shu", "stroke_count": 13, "mnemonic": "Insect under a net/cover; an ancient region." },
    { "character": "蛹", "on_yomi": "YOU", "kun_yomi": "sanagi", "meaning": "Chrysalis / Pupa", "stroke_count": 13, "mnemonic": "Insect in a hall/building; the pupa stage." },
    { "character": "蜘", "on_yomi": "CHI", "kun_yomi": "none", "meaning": "Spider", "stroke_count": 14, "mnemonic": "Insect and knowledge/arrow; the clever spider." },
    { "character": "蜚", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Cockroach / Flying insect", "stroke_count": 14, "mnemonic": "Insect and wings/negative; a resilient pest." },
    { "character": "螂", "on_yomi": "ROU", "kun_yomi": "none", "meaning": "Praying mantis", "stroke_count": 15, "mnemonic": "Insect in a specific district/hall." },
    { "character": "蝦", "on_yomi": "KA", "kun_yomi": "ebi", "meaning": "Shrimp / Prawn", "stroke_count": 15, "mnemonic": "Insect/creature and a skin/hide; a shrimp shell." },
    { "character": "蝕", "on_yomi": "SHOKU", "kun_yomi": "mushi-bamu", "meaning": "Erosion / Eclipse", "stroke_count": 15, "mnemonic": "Insect eating food; corroding or eroding." },
    { "character": "蝶", "on_yomi": "CHOU", "kun_yomi": "none", "meaning": "Butterfly", "stroke_count": 15, "mnemonic": "Insect and a world/generation leaf; a butterfly." },
    { "character": "螺", "on_yomi": "RA", "kun_yomi": "none", "meaning": "Spiral / Snail / Screw", "stroke_count": 17, "mnemonic": "Insect and silk threads/connection; a spiral shell." },
    { "character": "蟹", "on_yomi": "KAI", "kun_yomi": "kani", "meaning": "Crab", "stroke_count": 19, "mnemonic": "Insect and a horn/knife solution; the shelled crab." },
    { "character": "蠍", "on_yomi": "KATSU", "kun_yomi": "sasori", "meaning": "Scorpion", "stroke_count": 21, "mnemonic": "Insect and a shell/bone peak; a stinging scorpion." },
    { "character": "魯", "on_yomi": "RO", "kun_yomi": "none", "meaning": "Foolish / State of Lu", "stroke_count": 11, "mnemonic": "Fish and a mouth; ancient foolish name." },
    { "character": "鮎", "on_yomi": "DEN", "kun_yomi": "ayu", "meaning": "Sweetfish / Trout", "stroke_count": 16, "mnemonic": "Fish and a field; a common river fish." },
    { "character": "鮒", "on_yomi": "FU", "kun_yomi": "funa", "meaning": "Crucian carp", "stroke_count": 16, "mnemonic": "Fish and a person/attachment mark." },
    { "character": "鮓", "on_yomi": "SA", "kun_yomi": "sushi", "meaning": "Sushi", "stroke_count": 16, "mnemonic": "Fish and ancient items/records; fermented fish." },
    { "character": "鮪", "on_yomi": "I", "kun_yomi": "maguro", "meaning": "Tuna", "stroke_count": 17, "mnemonic": "Fish and a right/member; the king of fish." },
    { "character": "鮫", "on_yomi": "KOU", "kun_yomi": "same", "meaning": "Shark", "stroke_count": 17, "mnemonic": "Fish and an exchange/crossing; the shark." },
    { "character": "鮭", "on_yomi": "KEI", "kun_yomi": "sake", "meaning": "Salmon", "stroke_count": 17, "mnemonic": "Fish and earth/ivy; the red river fish." },
    { "character": "鮮", "on_yomi": "SEN", "kun_yomi": "aza-yakka", "meaning": "Vivid / Fresh", "stroke_count": 17, "mnemonic": "Fish and sheep; the essence of freshness." },
    { "character": "鯉", "on_yomi": "RI", "kun_yomi": "koi", "meaning": "Carp", "stroke_count": 18, "mnemonic": "Fish and a village; the pond/village fish." },
    { "character": "鯖", "on_yomi": "SEI", "kun_yomi": "maba", "meaning": "Mackerel", "stroke_count": 19, "mnemonic": "Fish that is blue/pure; a silver fish." },
    { "character": "鯛", "on_yomi": "CHOU", "kun_yomi": "tai", "meaning": "Sea bream", "stroke_count": 19, "mnemonic": "Fish and a perimeter/cycle; the circular bream." },
    { "character": "鯨", "on_yomi": "GEI", "kun_yomi": "kujira", "meaning": "Whale", "stroke_count": 19, "mnemonic": "Fish as large as a capital building." },
    { "character": "鰭", "on_yomi": "KI", "kun_yomi": "hire", "meaning": "Fin", "stroke_count": 21, "mnemonic": "Fish and an elder/expert check; a stabilizer fin." },
    { "character": "鰹", "on_yomi": "KATSU", "kun_yomi": "katsuo", "meaning": "Bonito", "stroke_count": 22, "mnemonic": "Fish and hard/rigid mountain rock." },
    { "character": "鰻", "on_yomi": "MAN", "kun_yomi": "unagi", "meaning": "Eel", "stroke_count": 22, "mnemonic": "Fish and a long/wide sun; a long eel." },
    { "character": "鱈", "on_yomi": "SETSU", "kun_yomi": "tara", "meaning": "Cod", "stroke_count": 22, "mnemonic": "Fish found in the snow; a winter fish." },
    { "character": "鱒", "on_yomi": "SON", "kun_yomi": "masu", "meaning": "Trout", "stroke_count": 23, "mnemonic": "Fish and a respectful/honored state." },
    { "character": "鱗", "on_yomi": "RIN", "kun_yomi": "uroko", "meaning": "Scales", "stroke_count": 24, "mnemonic": "Fish and a neighbor/fire; overlapping scales." },
    { "character": "竈", "on_yomi": "SOU", "kun_yomi": "kamado", "meaning": "Kitchen stove / Furnace", "stroke_count": 21, "mnemonic": "A hole in the earth for fire and grain." },
    { "character": "窃", "on_yomi": "SETSU", "kun_yomi": "none", "meaning": "Steal / Secretly", "stroke_count": 9, "mnemonic": "A hole and a knife; stealing in secret." },
    { "character": "窒", "on_yomi": "CHITSU", "kun_yomi": "none", "meaning": "Choke / Nitrogen / Plug", "stroke_count": 11, "mnemonic": "A hole that is blocked or arrived at; choking." },
    { "character": "窓", "on_yomi": "SOU", "kun_yomi": "mado", "meaning": "Window", "stroke_count": 11, "mnemonic": "A hole in the wall with a heart and a roof." },
    { "character": "窟", "on_yomi": "KUTSU", "kun_yomi": "none", "meaning": "Cavern / Cave / Den", "stroke_count": 13, "mnemonic": "A hole where a person bends inside." },
    { "character": "窪", "on_yomi": "WA", "kun_yomi": "kubo", "meaning": "Depression / Hollow", "stroke_count": 14, "mnemonic": "A hole with water/earth; a hollow spot." },
    { "character": "窮", "on_yomi": "KYUU", "kun_yomi": "kiwa-maru", "meaning": "Destitute / Extreme", "stroke_count": 15, "mnemonic": "A hole where one is bent like a bow; extreme poverty." },
    { "character": "窯", "on_yomi": "YOU", "kun_yomi": "kama", "meaning": "Kiln / Oven", "stroke_count": 15, "mnemonic": "A hole used for a sheep-like sacrificial fire; a kiln." },
    { "character": "窺", "on_yomi": "KI", "kun_yomi": "ukaga-u", "meaning": "Peep / Peer", "stroke_count": 16, "mnemonic": "A hole and a compass; peering carefully." },
    { "character": "竄", "on_yomi": "ZAN", "kun_yomi": "none", "meaning": "Flee / Hide / Tamper", "stroke_count": 18, "mnemonic": "A hole where rats are hiding; tampering." },
    { "character": "竿", "on_yomi": "KAN", "kun_yomi": "sao", "meaning": "Pole / Rod", "stroke_count": 9, "mnemonic": "Bamboo and a dry/shield; a long rod." },
    { "character": "筋", "on_yomi": "KIN", "kun_yomi": "suji", "meaning": "Sinew / Muscle", "stroke_count": 12, "mnemonic": "Bamboo-like fibers in the flesh." },
    { "character": "笙", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Reed organ / Instrument", "stroke_count": 11, "mnemonic": "Bamboo and birth; a living instrument." },
    { "character": "笛", "on_yomi": "TEKI", "kun_yomi": "fue", "meaning": "Flute / Whistle", "stroke_count": 11, "mnemonic": "Bamboo and a lead/opening; a flute." },
    { "character": "笠", "on_yomi": "RYUU", "kun_yomi": "kasa", "meaning": "Bamboo hat", "stroke_count": 11, "mnemonic": "Hat over a person." },
    { "character": "筐", "on_yomi": "KYOU", "kun_yomi": "none", "meaning": "Bamboo basket", "stroke_count": 12, "mnemonic": "Hole in a box." },
    { "character": "筏", "on_yomi": "BATSU", "kun_yomi": "ikada", "meaning": "Raft", "stroke_count": 12, "mnemonic": "Generation bamboo float." },
    { "character": "筑", "on_yomi": "CHIKU", "kun_yomi": "none", "meaning": "Bamboo instrument", "stroke_count": 12, "mnemonic": "Hand bamboo zither." },
    { "character": "筒", "on_yomi": "TOU", "kun_yomi": "tsutsu", "meaning": "Tube", "stroke_count": 12, "mnemonic": "Same bamboo cylinder." },
    { "character": "答", "on_yomi": "TOU", "kun_yomi": "kota-eru", "meaning": "Reply", "stroke_count": 12, "mnemonic": "Fit bamboo answer." },
    { "character": "策", "on_yomi": "SAKU", "kun_yomi": "none", "meaning": "Scheme", "stroke_count": 12, "mnemonic": "Thorn bamboo plan." },
    { "character": "筍", "on_yomi": "JUN", "kun_yomi": "takenoko", "meaning": "Bamboo shoot", "stroke_count": 12, "mnemonic": "Bamboo and a cycle/sun; seasonal shoot." },
    { "character": "箝", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Muzzle / Gag", "stroke_count": 14, "mnemonic": "Bamboo and a sweet/mouth piece; a gag." },
    { "character": "箸", "on_yomi": "none", "kun_yomi": "hashi", "meaning": "Chopsticks", "stroke_count": 15, "mnemonic": "Bamboo person specialist." },
    { "character": "箱", "on_yomi": "none", "kun_yomi": "hako", "meaning": "Box", "stroke_count": 15, "mnemonic": "Bamboo tree hall." },
    { "character": "範", "on_yomi": "HAN", "kun_yomi": "none", "meaning": "Scope", "stroke_count": 15, "mnemonic": "Bamboo pattern rule." },
    { "character": "篤", "on_yomi": "TOU", "kun_yomi": "none", "meaning": "Devout", "stroke_count": 16, "mnemonic": "Bamboo horse sincere." },
    { "character": "篩", "on_yomi": "SHI", "kun_yomi": "furui", "meaning": "Sieve", "stroke_count": 19, "mnemonic": "Bamboo elder expert." },
    { "character": "簡", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Simple", "stroke_count": 18, "mnemonic": "Bamboo gate note." },
    { "character": "簾", "on_yomi": "REN", "kun_yomi": "sudare", "meaning": "Bamboo blind", "stroke_count": 19, "mnemonic": "Bamboo roof screen." },
    { "character": "簿", "on_yomi": "BO", "kun_yomi": "none", "meaning": "Ledger", "stroke_count": 19, "mnemonic": "Bamboo tool record." },
    { "character": "籍", "on_yomi": "SEKI", "kun_yomi": "none", "meaning": "Register", "stroke_count": 20, "mnemonic": "Bamboo ancient registry." },
    { "character": "籠", "on_yomi": "ROU", "kun_yomi": "kago", "meaning": "Basket", "stroke_count": 22, "mnemonic": "Bamboo dragon cage." }
];

// Load baseline (L1-L18)
const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json',
    'kanji_mastery_l16.json', 'kanji_mastery_l17.json', 'kanji_mastery_l18.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

console.log('=== L19 RAW DATA AUDIT ===');
console.log('Baseline unique count (L1-L18):', baseline.size);
console.log('L19 raw count:', l19Raw.length);

// Check for internal duplicates in L19
let seenInL19 = new Set();
let internalDups = new Set();
l19Raw.forEach(entry => {
    if (seenInL19.has(entry.character)) {
        internalDups.add(entry.character);
    }
    seenInL19.add(entry.character);
});

// Check for baseline duplicates
let baselineDups = new Set();
l19Raw.forEach(entry => {
    if (baseline.has(entry.character)) {
        baselineDups.add(entry.character);
    }
});

// Get unique L19
let uniqueL19 = [];
let uniqueSet = new Set();
l19Raw.forEach(entry => {
    if (!uniqueSet.has(entry.character) && !baseline.has(entry.character)) {
        uniqueL19.push(entry);
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

console.log('Unique L19 Count:', uniqueL19.length);
console.log('Need to replace:', 100 - uniqueL19.length, 'Kanji');

if (uniqueL19.length === 100) {
    console.log('\n✅ L19 is perfect! Zero duplicates!');
}
