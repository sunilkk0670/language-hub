const fs = require('fs');
const path = require('path');

// User-provided L14 raw data (same as audit script - truncated for brevity)
const l14Raw = [
    { "character": "弄", "on_yomi": "ROU", "kun_yomi": "ize-ru", "meaning": "Tinker / Play with / Tamper", "stroke_count": 7, "mnemonic": "Hands playing with a jewel or item." },
    // ... (rest of the 100 Kanji from user data)
];

// Since the list is long, I'll load it from the audit script's data structure
const l14RawFull = require('./audit_l14_raw.js');

// Load baseline (L1-L13)
const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

console.log('Generating clean L14...');
console.log('Baseline size:', baseline.size);

// Since we have the raw data embedded in audit script, let me recreate it here
// I'll extract the 39 unique Kanji and add 61 new ones

const finalL14 = [];
const seenInL14 = new Set();

// First, add the unique Kanji from user data (39 total)
const userUniqueKanji = [
    { "character": "弄", "on_yomi": "ROU", "kun_yomi": "ize-ru", "meaning": "Tinker / Play with / Tamper", "stroke_count": 7, "mnemonic": "Hands playing with a jewel or item." },
    { "character": "旦", "on_yomi": "TAN", "kun_yomi": "asahi", "meaning": "Dawn / Morning / Master", "stroke_count": 5, "mnemonic": "The sun rising over a flat line; dawn." },
    { "character": "旨", "on_yomi": "SHI", "kun_yomi": "mune", "meaning": "Delicious / Intent / Purport", "stroke_count": 6, "mnemonic": "A spoon holding a sun/delicious meaning." },
    { "character": "旬", "on_yomi": "SHUN", "kun_yomi": "none", "meaning": "Season / 10-day period", "stroke_count": 6, "mnemonic": "The sun inside a cycle/ten-day span." },
    { "character": "晒", "on_yomi": "SAI", "kun_yomi": "sara-su", "meaning": "Bleach / Expose", "stroke_count": 10, "mnemonic": "The sun over a western/bleached field." },
    { "character": "晦", "on_yomi": "KAI", "kun_yomi": "kurai", "meaning": "Dark / Obscure", "stroke_count": 11, "mnemonic": "The sun and a person on a hill/cliff; obscured." },
    { "character": "晰", "on_yomi": "SEKI", "kun_yomi": "none", "meaning": "Clear / Distinct", "stroke_count": 12, "mnemonic": "Sunlight making an axe/tree distinct and clear." },
    { "character": "普", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Universal / Wide / General", "stroke_count": 12, "mnemonic": "Sun shining over two rows/aligned things." },
    { "character": "晶", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Crystal / Sparkle", "stroke_count": 12, "mnemonic": "Three suns together; brilliant sparkle/crystal." },
    { "character": "暉", "on_yomi": "KI", "kun_yomi": "kagaya-ku", "meaning": "Radiance / Shine", "stroke_count": 13, "mnemonic": "The sun over a car/wheel; radiating light." },
    { "character": "暢", "on_yomi": "CHOU", "kun_yomi": "none", "meaning": "Free / Easy / Smooth", "stroke_count": 14, "mnemonic": "The sun over an easy/smooth field." },
    { "character": "暫", "on_yomi": "ZAN", "kun_yomi": "shibara-ku", "meaning": "Temporarily / Momentary", "stroke_count": 15, "mnemonic": "The sun over a car/short journey." },
    { "character": "噌", "on_yomi": "SOU", "kun_yomi": "none", "meaning": "Miso / Noise", "stroke_count": 15, "mnemonic": "A mouth and a specialized/multi-level sound." },
    { "character": "嬉", "on_yomi": "KI", "kun_yomi": "ure-shii", "meaning": "Glad / Happy", "stroke_count": 15, "mnemonic": "A woman and a drum; joy/happiness." },
    { "character": "憚", "on_yomi": "TAN", "kun_yomi": "habaka-ru", "meaning": "Hesitate / Fear", "stroke_count": 15, "mnemonic": "A heart feeling a simple/pure barrier of fear." },
    { "character": "壇", "on_yomi": "DAN", "kun_yomi": "none", "meaning": "Podium / Altar / Stage", "stroke_count": 16, "mnemonic": "Earth with a multi-level hall; a stage." },
    { "character": "壌", "on_yomi": "JOU", "kun_yomi": "tsuchi", "meaning": "Soil / Earth / Land", "stroke_count": 17, "mnemonic": "Earth and a helper; rich soil." },
    { "character": "壕", "on_yomi": "GOU", "kun_yomi": "none", "meaning": "Trench / Ditch / Moat", "stroke_count": 17, "mnemonic": "Earth and a tall building; a deep moat." },
    { "character": "凛", "on_yomi": "RIN", "kun_yomi": "none", "meaning": "Cold / Dignified / Brave", "stroke_count": 15, "mnemonic": "Ice and a person under a roof; dignified cold." },
    { "character": "凌", "on_yomi": "RYOU", "kun_yomi": "shino-gu", "meaning": "Endure / Surpass", "stroke_count": 10, "mnemonic": "Ice and a path/steps; surpassing a cold." },
    { "character": "凡", "on_yomi": "BON", "kun_yomi": "none", "meaning": "Mediocre / Ordinary", "stroke_count": 3, "mnemonic": "A table with one item; simple/ordinary." },
    { "character": "夙", "on_yomi": "SHUKU", "kun_yomi": "tsuto-ni", "meaning": "Early", "stroke_count": 6, "mnemonic": "Moon inside an enclosure; early morning." },
    { "character": "凧", "on_yomi": "none", "kun_yomi": "tako", "meaning": "Kite", "stroke_count": 5, "mnemonic": "Wind and a cloth/towel; a kite." },
    { "character": "凩", "on_yomi": "none", "kun_yomi": "kogarashi", "meaning": "Winter wind", "stroke_count": 6, "mnemonic": "Wind and a tree; cold winter wind." },
    { "character": "凪", "on_yomi": "none", "kun_yomi": "nagi", "meaning": "Lull / Calm", "stroke_count": 6, "mnemonic": "Wind and a stop/cessation; a lull." },
    { "character": "凶", "on_yomi": "KYOU", "kun_yomi": "none", "meaning": "Evil / Bad luck / Disaster", "stroke_count": 4, "mnemonic": "A cross/mark inside a container; bad omen." },
    { "character": "凹", "on_yomi": "OU", "kun_yomi": "kubo-mu", "meaning": "Concave / Hollow", "stroke_count": 5, "mnemonic": "The shape of a hollow/concave item." },
    { "character": "凸", "on_yomi": "TOTSU", "kun_yomi": "deko", "meaning": "Convex / Protrude", "stroke_count": 5, "mnemonic": "The shape of a protruding/convex item." },
    { "character": "刑", "on_yomi": "KEI", "kun_yomi": "none", "meaning": "Punishment / Penalty", "stroke_count": 6, "mnemonic": "A knife and a frame/well; a sentence." },
    { "character": "削", "on_yomi": "SAKU", "kun_yomi": "kezu-ru", "meaning": "Whittle / Erase / Sharpen", "stroke_count": 9, "mnemonic": "A knife being used to whittle down a shape." },
    { "character": "剖", "on_yomi": "BOU", "kun_yomi": "none", "meaning": "Divide / Dissect", "stroke_count": 10, "mnemonic": "A knife and a stand/official point; dissect." },
    { "character": "剛", "on_yomi": "GOU", "kun_yomi": "none", "meaning": "Sturdy / Strong", "stroke_count": 10, "mnemonic": "A knife that is hard and rigid like a mountain." },
    { "character": "剤", "on_yomi": "ZAI", "kun_yomi": "none", "meaning": "Agent / Medicine / Drug", "stroke_count": 10, "mnemonic": "A knife used to align/simultaneous components." },
    { "character": "剽", "on_yomi": "HYOU", "kun_yomi": "none", "meaning": "Plunder / Threaten", "stroke_count": 13, "mnemonic": "A knife and a Western measurement/marker." },
    { "character": "剣", "on_yomi": "KEN", "kun_yomi": "tsurugi", "meaning": "Sword / Blade", "stroke_count": 10, "mnemonic": "A person under a roof with a sword." },
    { "character": "剥", "on_yomi": "HAKU", "kun_yomi": "ha-gu", "meaning": "Peel / Expose", "stroke_count": 10, "mnemonic": "A knife used to peel the skin/claws off." },
    { "character": "勇", "on_yomi": "YUU", "kun_yomi": "isa-mu", "meaning": "Courage / Brave", "stroke_count": 9, "mnemonic": "A person under a lid using power; bravery." },
    { "character": "勾", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Hook / Bent", "stroke_count": 4, "mnemonic": "The shape of a hook inside a curve." },
    { "character": "撥", "on_yomi": "HATSU", "kun_yomi": "ha-neru", "meaning": "Reject / Plectrum / Snap", "stroke_count": 15, "mnemonic": "A hand using a plectrum/device to snap or repel." }
];

userUniqueKanji.forEach(entry => {
    if (!baseline.has(entry.character) && !seenInL14.has(entry.character)) {
        finalL14.push(entry);
        seenInL14.add(entry.character);
    }
});

console.log('Added unique from user data:', finalL14.length);

// Now add 61 new unique N2/N1 Kanji
const additional61 = [
    { "character": "撒", "on_yomi": "SATSU", "kun_yomi": "ma-ku", "meaning": "Scatter / Sprinkle", "stroke_count": 15, "mnemonic": "A hand scattering grass or items into the air." },
    { "character": "擢", "on_yomi": "TEKI", "kun_yomi": "nuku", "meaning": "Select / Pull out", "stroke_count": 17, "mnemonic": "A hand selecting a bird/high-quality item." },
    { "character": "擦", "on_yomi": "SATSU", "kun_yomi": "su-ru", "meaning": "Rub / Chafe / Friction", "stroke_count": 17, "mnemonic": "A hand rubbing something under a roof; checking." },
    { "character": "攀", "on_yomi": "HAN", "kun_yomi": "yo-jiru", "meaning": "Climb / Scale", "stroke_count": 19, "mnemonic": "Hands and wood used to scale a height." },
    { "character": "攪", "on_yomi": "KOU", "kun_yomi": "kaki-mawasu", "meaning": "Stir / Disturb / Confuse", "stroke_count": 23, "mnemonic": "A hand stirring and seeing through a mix." },
    { "character": "撲", "on_yomi": "BOKU", "kun_yomi": "none", "meaning": "Strike / Beat / Attack", "stroke_count": 15, "mnemonic": "Hand striking a tree; attack." },
    { "character": "撫", "on_yomi": "BU", "kun_yomi": "na-deru", "meaning": "Stroke / Pat / Caress", "stroke_count": 15, "mnemonic": "Hand stroking with care; caress." },
    { "character": "撮", "on_yomi": "SATSU", "kun_yomi": "tsu-mu", "meaning": "Photograph / Pinch", "stroke_count": 15, "mnemonic": "Hand taking/pinching; photograph." },
    { "character": "播", "on_yomi": "HAN", "kun_yomi": "ma-ku", "meaning": "Sow / Scatter / Broadcast", "stroke_count": 15, "mnemonic": "Hand sowing seeds; broadcast." },
    { "character": "擁", "on_yomi": "YOU", "kun_yomi": "none", "meaning": "Embrace / Hug / Possess", "stroke_count": 16, "mnemonic": "Hand embracing; possess." },
    { "character": "擾", "on_yomi": "JOU", "kun_yomi": "none", "meaning": "Disturb / Agitate", "stroke_count": 18, "mnemonic": "Hand disturbing; agitate." },
    { "character": "攣", "on_yomi": "REN", "kun_yomi": "none", "meaning": "Cramp / Spasm", "stroke_count": 23, "mnemonic": "Hand with a cramp; spasm." },
    { "character": "曳", "on_yomi": "EI", "kun_yomi": "hi-ku", "meaning": "Pull / Drag", "stroke_count": 6, "mnemonic": "Sun being pulled; drag." },
    { "character": "曝", "on_yomi": "BAKU", "kun_yomi": "sara-su", "meaning": "Expose / Bleach", "stroke_count": 19, "mnemonic": "Sun exposing; bleach." },
    { "character": "曙", "on_yomi": "SHO", "kun_yomi": "akebono", "meaning": "Dawn / Daybreak", "stroke_count": 17, "mnemonic": "Sun with signature; dawn." },
    { "character": "曼", "on_yomi": "MAN", "kun_yomi": "none", "meaning": "Graceful / Long", "stroke_count": 11, "mnemonic": "Sun and eye; graceful." },
    { "character": "朧", "on_yomi": "ROU", "kun_yomi": "oboro", "meaning": "Hazy / Dim", "stroke_count": 16, "mnemonic": "Moon hazy; dim." },
    { "character": "朕", "on_yomi": "CHIN", "kun_yomi": "none", "meaning": "Imperial 'I' / Sign", "stroke_count": 10, "mnemonic": "Moon and a sign; imperial I." },
    { "character": "朔", "on_yomi": "SAKU", "kun_yomi": "none", "meaning": "First day of month / North", "stroke_count": 10, "mnemonic": "Moon at start; first day." },
    { "character": "朽", "on_yomi": "KYUU", "kun_yomi": "ku-chiru", "meaning": "Decay / Rot", "stroke_count": 6, "mnemonic": "Tree decaying; rot." },
    { "character": "杭", "on_yomi": "KOU", "kun_yomi": "kui", "meaning": "Stake / Post", "stroke_count": 8, "mnemonic": "Tree as a stake; post." },
    { "character": "杉", "on_yomi": "SAN", "kun_yomi": "sugi", "meaning": "Cedar / Cryptomeria", "stroke_count": 7, "mnemonic": "Tree with three lines; cedar." },
    { "character": "枢", "on_yomi": "SUU", "kun_yomi": "none", "meaning": "Pivot / Hinge / Center", "stroke_count": 8, "mnemonic": "Tree as a pivot; hinge." },
    { "character": "枯", "on_yomi": "KO", "kun_yomi": "ka-reru", "meaning": "Wither / Die / Dry up", "stroke_count": 9, "mnemonic": "Tree withering; dry up." },
    { "character": "柵", "on_yomi": "SAKU", "kun_yomi": "none", "meaning": "Fence / Palisade", "stroke_count": 9, "mnemonic": "Tree as a fence; palisade." },
    { "character": "柿", "on_yomi": "SHI", "kun_yomi": "kaki", "meaning": "Persimmon", "stroke_count": 9, "mnemonic": "Tree with a market; persimmon." },
    { "character": "栓", "on_yomi": "SEN", "kun_yomi": "none", "meaning": "Plug / Stopper / Cork", "stroke_count": 10, "mnemonic": "Tree as a plug; cork." },
    { "character": "栖", "on_yomi": "SEI", "kun_yomi": "su", "meaning": "Nest / Roost", "stroke_count": 10, "mnemonic": "Tree with a west; nest." },
    { "character": "栗", "on_yomi": "RITSU", "kun_yomi": "kuri", "meaning": "Chestnut", "stroke_count": 10, "mnemonic": "Tree with a west; chestnut." },
    { "character": "桁", "on_yomi": "KETA", "kun_yomi": "none", "meaning": "Beam / Digit / Girder", "stroke_count": 10, "mnemonic": "Tree as a beam; girder." },
    { "character": "桂", "on_yomi": "KEI", "kun_yomi": "katsura", "meaning": "Cinnamon / Katsura tree", "stroke_count": 10, "mnemonic": "Tree with a soil; cinnamon." },
    { "character": "桃", "on_yomi": "TOU", "kun_yomi": "momo", "meaning": "Peach", "stroke_count": 10, "mnemonic": "Tree with a sign; peach." },
    { "character": "桐", "on_yomi": "TOU", "kun_yomi": "kiri", "meaning": "Paulownia", "stroke_count": 10, "mnemonic": "Tree with a same; paulownia." },
    { "character": "桑", "on_yomi": "SOU", "kun_yomi": "kuwa", "meaning": "Mulberry", "stroke_count": 10, "mnemonic": "Tree with a again; mulberry." },
    { "character": "桜", "on_yomi": "OU", "kun_yomi": "sakura", "meaning": "Cherry blossom", "stroke_count": 10, "mnemonic": "Tree with a woman; cherry." },
    { "character": "梁", "on_yomi": "RYOU", "kun_yomi": "none", "meaning": "Beam / Crossbeam", "stroke_count": 11, "mnemonic": "Tree as a beam; crossbeam." },
    { "character": "梗", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Stalk / Outline / Gist", "stroke_count": 11, "mnemonic": "Tree with a more; stalk." },
    { "character": "梢", "on_yomi": "SHOU", "kun_yomi": "kozue", "meaning": "Treetop / Twig", "stroke_count": 11, "mnemonic": "Tree with a small; treetop." },
    { "character": "梨", "on_yomi": "RI", "kun_yomi": "nashi", "meaning": "Pear", "stroke_count": 11, "mnemonic": "Tree with a benefit; pear." },
    { "character": "梯", "on_yomi": "TEI", "kun_yomi": "none", "meaning": "Ladder / Stairs", "stroke_count": 11, "mnemonic": "Tree as a ladder; stairs." },
    { "character": "梱", "on_yomi": "KON", "kun_yomi": "none", "meaning": "Packing / Bale", "stroke_count": 11, "mnemonic": "Tree for packing; bale." },
    { "character": "棄", "on_yomi": "KI", "kun_yomi": "su-teru", "meaning": "Abandon / Discard", "stroke_count": 13, "mnemonic": "Tree being abandoned; discard." },
    { "character": "棋", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Chess / Shogi", "stroke_count": 12, "mnemonic": "Tree with a chess; shogi." },
    { "character": "棚", "on_yomi": "none", "kun_yomi": "tana", "meaning": "Shelf / Rack", "stroke_count": 12, "mnemonic": "Tree as a shelf; rack." },
    { "character": "棟", "on_yomi": "TOU", "kun_yomi": "mune", "meaning": "Ridge / Ridgepole", "stroke_count": 12, "mnemonic": "Tree as a ridge; ridgepole." },
    { "character": "棺", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Coffin / Casket", "stroke_count": 12, "mnemonic": "Tree as a coffin; casket." },
    { "character": "椅", "on_yomi": "I", "kun_yomi": "none", "meaning": "Chair / Seat", "stroke_count": 12, "mnemonic": "Tree as a chair; seat." },
    { "character": "椎", "on_yomi": "TSUI", "kun_yomi": "none", "meaning": "Chinquapin / Vertebra", "stroke_count": 12, "mnemonic": "Tree with a vertebra; chinquapin." },
    { "character": "椋", "on_yomi": "RYOU", "kun_yomi": "mukku", "meaning": "Aphananthe / Type of tree", "stroke_count": 12, "mnemonic": "Tree with a capital; aphananthe." },
    { "character": "椛", "on_yomi": "none", "kun_yomi": "momiji", "meaning": "Autumn leaves / Maple", "stroke_count": 12, "mnemonic": "Tree with a flower; maple." },
    { "character": "椿", "on_yomi": "CHIN", "kun_yomi": "tsubaki", "meaning": "Camellia", "stroke_count": 13, "mnemonic": "Tree with a spring; camellia." },
    { "character": "楊", "on_yomi": "YOU", "kun_yomi": "none", "meaning": "Willow / Poplar", "stroke_count": 13, "mnemonic": "Tree with a sun; willow." },
    { "character": "楓", "on_yomi": "FUU", "kun_yomi": "kaede", "meaning": "Maple", "stroke_count": 13, "mnemonic": "Tree with a wind; maple." },
    { "character": "楠", "on_yomi": "NAN", "kun_yomi": "kusunoki", "meaning": "Camphor tree", "stroke_count": 13, "mnemonic": "Tree with a south; camphor." },
    { "character": "楯", "on_yomi": "JUN", "kun_yomi": "tate", "meaning": "Shield", "stroke_count": 13, "mnemonic": "Tree as a shield; shield." },
    { "character": "楼", "on_yomi": "ROU", "kun_yomi": "none", "meaning": "Tower / Turret", "stroke_count": 13, "mnemonic": "Tree as a tower; turret." },
    { "character": "榎", "on_yomi": "KA", "kun_yomi": "enoki", "meaning": "Hackberry / Enoki", "stroke_count": 14, "mnemonic": "Tree with a summer; hackberry." },
    { "character": "榊", "on_yomi": "none", "kun_yomi": "sakaki", "meaning": "Sacred Shinto tree", "stroke_count": 14, "mnemonic": "Tree with a god; sacred tree." },
    { "character": "榛", "on_yomi": "SHIN", "kun_yomi": "hashibami", "meaning": "Hazel / Filbert", "stroke_count": 14, "mnemonic": "Tree with a hazel; filbert." },
    { "character": "槍", "on_yomi": "SOU", "kun_yomi": "yari", "meaning": "Spear / Lance", "stroke_count": 14, "mnemonic": "Tree as a spear; lance." },
    { "character": "槌", "on_yomi": "TSUI", "kun_yomi": "tsuchi", "meaning": "Mallet / Hammer", "stroke_count": 14, "mnemonic": "Tree as a mallet; hammer." }
];

let added = 0;
additional61.forEach(entry => {
    if (!seenInL14.has(entry.character) && !baseline.has(entry.character) && finalL14.length < 100) {
        finalL14.push(entry);
        seenInL14.add(entry.character);
        added++;
    }
});

console.log('Added:', added);
console.log('Final L14 count:', finalL14.length);

// Save
const outputPath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l14.json');
fs.writeFileSync(outputPath, JSON.stringify(finalL14, null, 2), 'utf8');
console.log('Saved kanji_mastery_l14.json');

if (finalL14.length === 100) {
    console.log('✅ L14 COMPLETE WITH 100 KANJI!');
}
