const fs = require('fs');
const path = require('path');

// User-provided L14 raw data
const l14Raw = [
    { "character": "弄", "on_yomi": "ROU", "kun_yomi": "ize-ru", "meaning": "Tinker / Play with / Tamper", "stroke_count": 7, "mnemonic": "Hands playing with a jewel or item." },
    { "character": "彙", "on_yomi": "I", "kun_yomi": "none", "meaning": "Collection / Category", "stroke_count": 13, "mnemonic": "A hedgehog-like bundle representing a collection/vocabulary." },
    { "character": "傲", "on_yomi": "GOU", "kun_yomi": "none", "meaning": "Arrogant / Proud", "stroke_count": 13, "mnemonic": "A person standing tall and striking out in pride." },
    { "character": "僅", "on_yomi": "KIN", "kun_yomi": "wazu-ka", "meaning": "Mere / Trifle / Tiny", "stroke_count": 13, "mnemonic": "A person holding onto a tiny, yellowed bit of value." },
    { "character": "僭", "on_yomi": "SEN", "kun_yomi": "none", "meaning": "Presumption / Usurp", "stroke_count": 14, "mnemonic": "A person with a hidden knife/intent taking a lead." },
    { "character": "儘", "on_yomi": "JIN", "kun_yomi": "mama", "meaning": "As it is / In accordance with", "stroke_count": 16, "mnemonic": "A person acting as an exhaust/total reflection of a state." },
    { "character": "侶", "on_yomi": "RYO", "kun_yomi": "tomoga-ri", "meaning": "Companion / Partner", "stroke_count": 9, "mnemonic": "A person standing by a multi-level house/spine; a partner." },
    { "character": "倦", "on_yomi": "KEN", "kun_yomi": "una-reru", "meaning": "Fatigue / Weary", "stroke_count": 10, "mnemonic": "A person bent over/rolled up in exhaustion." },
    { "character": "儲", "on_yomi": "CHO", "kun_yomi": "mou-keru", "meaning": "Profit / Earnings", "stroke_count": 17, "mnemonic": "A person acting as a trust/committee for money/profit." },
    { "character": "僻", "on_yomi": "HEKI", "kun_yomi": "higa-mu", "meaning": "Prejudice / Remote / Biased", "stroke_count": 15, "mnemonic": "A person standing on a remote cliff; a biased view." },
    { "character": "儚", "on_yomi": "BOU", "kun_yomi": "haka-nai", "meaning": "Fleeting / Evanescent", "stroke_count": 13, "mnemonic": "A person and a dream/vision; fleeting." },
    { "character": "撰", "on_yomi": "SEN", "kun_yomi": "era-bu", "meaning": "Compose / Edit / Select", "stroke_count": 15, "mnemonic": "A hand selecting and coordinating a text." },
    { "character": "撥", "on_yomi": "HATSU", "kun_yomi": "ha-neru", "meaning": "Reject / Plectrum / Snap", "stroke_count": 15, "mnemonic": "A hand using a plectrum/device to snap or repel." },
    { "character": "撒", "on_yomi": "SATSU", "kun_yomi": "ma-ku", "meaning": "Scatter / Sprinkle", "stroke_count": 15, "mnemonic": "A hand scattering grass or items into the air." },
    { "character": "擬", "on_yomi": "GI", "kun_yomi": "none", "meaning": "Mimic / Pseudo / Imitate", "stroke_count": 17, "mnemonic": "A hand making a comparison to doubt/suspect." },
    { "character": "擢", "on_yomi": "TEKI", "kun_yomi": "nuku", "meaning": "Select / Pull out", "stroke_count": 17, "mnemonic": "A hand selecting a bird/high-quality item." },
    { "character": "擦", "on_yomi": "SATSU", "kun_yomi": "su-ru", "meaning": "Rub / Chafe / Friction", "stroke_count": 17, "mnemonic": "A hand rubbing something under a roof; checking." },
    { "character": "攀", "on_yomi": "HAN", "kun_yomi": "yo-jiru", "meaning": "Climb / Scale", "stroke_count": 19, "mnemonic": "Hands and wood used to scale a height." },
    { "character": "攪", "on_yomi": "KOU", "kun_yomi": "kaki-mawasu", "meaning": "Stir / Disturb / Confuse", "stroke_count": 23, "mnemonic": "A hand stirring and seeing through a mix." },
    { "character": "旦", "on_yomi": "TAN", "kun_yomi": "asahi", "meaning": "Dawn / Morning / Master", "stroke_count": 5, "mnemonic": "The sun rising over a flat line; dawn." },
    { "character": "旨", "on_yomi": "SHI", "kun_yomi": "mune", "meaning": "Delicious / Intent / Purport", "stroke_count": 6, "mnemonic": "A spoon holding a sun/delicious meaning." },
    { "character": "旬", "on_yomi": "SHUN", "kun_yomi": "none", "meaning": "Season / 10-day period", "stroke_count": 6, "mnemonic": "The sun inside a cycle/ten-day span." },
    { "character": "晒", "on_yomi": "SAI", "kun_yomi": "sara-su", "meaning": "Bleach / Expose", "stroke_count": 10, "mnemonic": "The sun over a western/bleached field." },
    { "character": "晦", "on_yomi": "KAI", "kun_yomi": "kurai", "meaning": "Dark / Obscure", "stroke_count": 11, "mnemonic": "The sun and a person on a hill/cliff; obscured." },
    { "character": "晰", "on_yomi": "SEKI", "kun_yomi": "none", "meaning": "Clear / Distinct", "stroke_count": 12, "mnemonic": "Sunlight making an axe/tree distinct and clear." },
    { "character": "普", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Universal / Wide / General", "stroke_count": 12, "mnemonic": "Sun shining over two rows/aligned things." },
    { "character": "晶", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Crystal / Sparkle", "stroke_count": 12, "mnemonic": "Three suns together; brilliant sparkle/crystal." },
    { "character": "暁", "on_yomi": "GYOU", "kun_yomi": "akatuki", "meaning": "Dawn / Daybreak / Event", "stroke_count": 12, "mnemonic": "The sun rising at a peak/summit." },
    { "character": "暑", "on_yomi": "SHO", "kun_yomi": "atsu-i", "meaning": "Hot (Weather)", "stroke_count": 12, "mnemonic": "The sun over a person/specialist; hot." },
    { "character": "暇", "on_yomi": "KA", "kun_yomi": "hima", "meaning": "Leisure / Free time", "stroke_count": 13, "mnemonic": "Sunlight over borrowed/given time." },
    { "character": "暗", "on_yomi": "AN", "kun_yomi": "kura-i", "meaning": "Dark / Gloomy", "stroke_count": 13, "mnemonic": "The sun hidden behind a sound." },
    { "character": "暉", "on_yomi": "KI", "kun_yomi": "kagaya-ku", "meaning": "Radiance / Shine", "stroke_count": 13, "mnemonic": "The sun over a car/wheel; radiating light." },
    { "character": "暖", "on_yomi": "DAN", "kun_yomi": "atata-kai", "meaning": "Warm (Weather)", "stroke_count": 13, "mnemonic": "Sunlight and a hand/friend; warmth." },
    { "character": "暢", "on_yomi": "CHOU", "kun_yomi": "none", "meaning": "Free / Easy / Smooth", "stroke_count": 14, "mnemonic": "The sun over an easy/smooth field." },
    { "character": "暫", "on_yomi": "ZAN", "kun_yomi": "shibara-ku", "meaning": "Temporarily / Momentary", "stroke_count": 15, "mnemonic": "The sun over a car/short journey." },
    { "character": "暴", "on_yomi": "BOU", "kun_yomi": "aba-reru", "meaning": "Violent / Expose", "stroke_count": 15, "mnemonic": "Sun over water and rice; violent heat." },
    { "character": "嘱", "on_yomi": "SHOKU", "kun_yomi": "none", "meaning": "Entrust / Request", "stroke_count": 15, "mnemonic": "A mouth speaking a request for duty." },
    { "character": "嘲", "on_yomi": "CHOU", "kun_yomi": "azu-keru", "meaning": "Ridicule / Mock", "stroke_count": 15, "mnemonic": "A mouth speaking a bright/morning word in mockery." },
    { "character": "噌", "on_yomi": "SOU", "kun_yomi": "none", "meaning": "Miso / Noise", "stroke_count": 15, "mnemonic": "A mouth and a specialized/multi-level sound." },
    { "character": "嬉", "on_yomi": "KI", "kun_yomi": "ure-shii", "meaning": "Glad / Happy", "stroke_count": 15, "mnemonic": "A woman and a drum; joy/happiness." },
    { "character": "憚", "on_yomi": "TAN", "kun_yomi": "habaka-ru", "meaning": "Hesitate / Fear", "stroke_count": 15, "mnemonic": "A heart feeling a simple/pure barrier of fear." },
    { "character": "憬", "on_yomi": "KEI", "kun_yomi": "none", "meaning": "Yearn / Long for", "stroke_count": 15, "mnemonic": "A heart viewing a bright scenery; yearning." },
    { "character": "憧", "on_yomi": "SHOU", "kun_yomi": "ako-gareru", "meaning": "Adore / Yearn", "stroke_count": 15, "mnemonic": "A heart feeling a childlike yearning." },
    { "character": "憾", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Regret / Remorse", "stroke_count": 16, "mnemonic": "A heart feeling the heavy touch of regret." },
    { "character": "憶", "on_yomi": "OKU", "kun_yomi": "none", "meaning": "Recollection / Memory", "stroke_count": 16, "mnemonic": "A heart holding onto an idea/meaning." },
    { "character": "癒", "on_yomi": "YU", "kun_yomi": "iya-su", "meaning": "Healing / Cure", "stroke_count": 18, "mnemonic": "A person in a sickbed receiving heart/comfort." },
    { "character": "壁", "on_yomi": "HEKI", "kun_yomi": "kabe", "meaning": "Wall / Barrier", "stroke_count": 16, "mnemonic": "Earth with a person/building on a cliff." },
    { "character": "壇", "on_yomi": "DAN", "kun_yomi": "none", "meaning": "Podium / Altar / Stage", "stroke_count": 16, "mnemonic": "Earth with a multi-level hall; a stage." },
    { "character": "壊", "on_yomi": "KAI", "kun_yomi": "kowa-su", "meaning": "Destroy / Break", "stroke_count": 16, "mnemonic": "Earth being broken into clothing/pieces." },
    { "character": "壌", "on_yomi": "JOU", "kun_yomi": "tsuchi", "meaning": "Soil / Earth / Land", "stroke_count": 17, "mnemonic": "Earth and a helper; rich soil." },
    { "character": "壕", "on_yomi": "GOU", "kun_yomi": "none", "meaning": "Trench / Ditch / Moat", "stroke_count": 17, "mnemonic": "Earth and a tall building; a deep moat." },
    { "character": "凝", "on_yomi": "GYOU", "kun_yomi": "ko-ru", "meaning": "Stiff / Absorbed / Congeal", "stroke_count": 16, "mnemonic": "Ice and a person standing still in focus." },
    { "character": "凍", "on_yomi": "TOU", "kun_yomi": "koo-ru", "meaning": "Frozen / Freeze", "stroke_count": 10, "mnemonic": "Ice over a path/eastern sun." },
    { "character": "凄", "on_yomi": "SEI", "kun_yomi": "sugo-i", "meaning": "Amazing / Dreadful", "stroke_count": 10, "mnemonic": "Ice and a wife/legal wife; a powerful cold." },
    { "character": "准", "on_yomi": "JUN", "kun_yomi": "none", "meaning": "Semi- / Quasi- / Associate", "stroke_count": 10, "mnemonic": "Ice and a falcon; almost level/standard." },
    { "character": "凋", "on_yomi": "CHOU", "kun_yomi": "shibo-mu", "meaning": "Wither / Decline", "stroke_count": 10, "mnemonic": "Ice and a perimeter/cycle; withered." },
    { "character": "凛", "on_yomi": "RIN", "kun_yomi": "none", "meaning": "Cold / Dignified / Brave", "stroke_count": 15, "mnemonic": "Ice and a person under a roof; dignified cold." },
    { "character": "凄", "on_yomi": "SEI", "kun_yomi": "sugo-i", "meaning": "Amazing", "stroke_count": 10, "mnemonic": "Powerful cold." },
    { "character": "凋", "on_yomi": "CHOU", "kun_yomi": "shibo-mu", "meaning": "Decline", "stroke_count": 10, "mnemonic": "Ice and a cycle." },
    { "character": "凌", "on_yomi": "RYOU", "kun_yomi": "shino-gu", "meaning": "Endure / Surpass", "stroke_count": 10, "mnemonic": "Ice and a path/steps; surpassing a cold." },
    { "character": "凝", "on_yomi": "GYOU", "kun_yomi": "ko-ru", "meaning": "Absorbed", "stroke_count": 16, "mnemonic": "Standing still/frozen in focus." },
    { "character": "准", "on_yomi": "JUN", "kun_yomi": "none", "meaning": "Associate", "stroke_count": 10, "mnemonic": "Almost level/ice falcon." },
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
    { "character": "剰", "on_yomi": "JOU", "kun_yomi": "none", "meaning": "Surplus / Excess", "stroke_count": 11, "mnemonic": "A knife cutting a surplus from a ride/vehicle." },
    { "character": "副", "on_yomi": "FUKU", "kun_yomi": "none", "meaning": "Deputy / Vice / Copy", "stroke_count": 11, "mnemonic": "A knife and a full jar; a second part." },
    { "character": "剰", "on_yomi": "JOU", "kun_yomi": "none", "meaning": "Excess", "stroke_count": 11, "mnemonic": "Knife cutting from a ride." },
    { "character": "副", "on_yomi": "FUKU", "kun_yomi": "none", "meaning": "Deputy", "stroke_count": 11, "mnemonic": "Knife and a full jar." },
    { "character": "割", "on_yomi": "KATSU", "kun_yomi": "wa-ru", "meaning": "Divide / Split / Ratio", "stroke_count": 12, "mnemonic": "A knife dividing damage or sections." },
    { "character": "創", "on_yomi": "SOU", "kun_yomi": "tsuku-ru", "meaning": "Create / Genesis", "stroke_count": 12, "mnemonic": "A knife used to mark a start/warehouse." },
    { "character": "剽", "on_yomi": "HYOU", "kun_yomi": "none", "meaning": "Plunder / Threaten", "stroke_count": 13, "mnemonic": "A knife and a Western measurement/marker." },
    { "character": "劇", "on_yomi": "GEKI", "kun_yomi": "none", "meaning": "Drama / Play", "stroke_count": 15, "mnemonic": "A tiger and a knife/weapon; intense drama." },
    { "character": "剣", "on_yomi": "KEN", "kun_yomi": "tsurugi", "meaning": "Sword / Blade", "stroke_count": 10, "mnemonic": "A person under a roof with a sword." },
    { "character": "剖", "on_yomi": "BOU", "kun_yomi": "none", "meaning": "Dissect", "stroke_count": 10, "mnemonic": "Knife and a stand." },
    { "character": "剥", "on_yomi": "HAKU", "kun_yomi": "ha-gu", "meaning": "Peel / Expose", "stroke_count": 10, "mnemonic": "A knife used to peel the skin/claws off." },
    { "character": "剰", "on_yomi": "JOU", "kun_yomi": "none", "meaning": "Surplus", "stroke_count": 11, "mnemonic": "Cutting from a surplus vehicle." },
    { "character": "劇", "on_yomi": "GEKI", "kun_yomi": "none", "meaning": "Drama", "stroke_count": 15, "mnemonic": "Tiger and knife/weapon." },
    { "character": "励", "on_yomi": "REI", "kun_yomi": "hage-mu", "meaning": "Encourage / Diligence", "stroke_count": 7, "mnemonic": "A scorpion/cliff and power; intense effort." },
    { "character": "劾", "on_yomi": "GAI", "kun_yomi": "none", "meaning": "Examine / Impeach", "stroke_count": 8, "mnemonic": "A person under a lid with power; investigating." },
    { "character": "効", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Effect / Efficacy", "stroke_count": 8, "mnemonic": "Applying power to exchange a result." },
    { "character": "勅", "on_yomi": "CHOKU", "kun_yomi": "none", "meaning": "Imperial decree", "stroke_count": 9, "mnemonic": "A bundle/message and power; a decree." },
    { "character": "勇", "on_yomi": "YUU", "kun_yomi": "isa-mu", "meaning": "Courage / Brave", "stroke_count": 9, "mnemonic": "A person under a lid using power; bravery." },
    { "character": "勃", "on_yomi": "BOTSU", "kun_yomi": "none", "meaning": "Uprising / Sudden", "stroke_count": 9, "mnemonic": "A child/son using power; a sudden rise." },
    { "character": "勉", "on_yomi": "BEN", "kun_yomi": "tsuto-meru", "meaning": "Exertion / Diligence", "stroke_count": 10, "mnemonic": "A rabbit using power; intense struggle." },
    { "character": "勘", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Intuition / Check", "stroke_count": 11, "mnemonic": "A sweet/heavy burden check with power." },
    { "character": "勧", "on_yomi": "KAN", "kun_yomi": "susu-meru", "meaning": "Advise / Encourage", "stroke_count": 13, "mnemonic": "A bird and power; encouraging a flight." },
    { "character": "勲", "on_yomi": "KUN", "kun_yomi": "none", "meaning": "Merit / Honor", "stroke_count": 15, "mnemonic": "Power and fire; the reward of intense work." },
    { "character": "勾", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Hook / Bent", "stroke_count": 4, "mnemonic": "The shape of a hook inside a curve." },
    { "character": "勺", "on_yomi": "SHAKU", "kun_yomi": "none", "meaning": "Dipper / Ladle / Unit", "stroke_count": 3, "mnemonic": "The shape of a small dipper/unit." }
];

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

console.log('=== L14 RAW DATA AUDIT ===');
console.log('Baseline unique count (L1-L13):', baseline.size);
console.log('L14 raw count:', l14Raw.length);

// Check for internal duplicates in L14
let seenInL14 = new Set();
let internalDups = new Set();
l14Raw.forEach(entry => {
    if (seenInL14.has(entry.character)) {
        internalDups.add(entry.character);
    }
    seenInL14.add(entry.character);
});

// Check for baseline duplicates
let baselineDups = new Set();
l14Raw.forEach(entry => {
    if (baseline.has(entry.character)) {
        baselineDups.add(entry.character);
    }
});

// Get unique L14
let uniqueL14 = [];
let uniqueSet = new Set();
l14Raw.forEach(entry => {
    if (!uniqueSet.has(entry.character) && !baseline.has(entry.character)) {
        uniqueL14.push(entry);
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

console.log('Unique L14 Count:', uniqueL14.length);
console.log('Need to replace:', 100 - uniqueL14.length, 'Kanji');

if (uniqueL14.length === 100) {
    console.log('\n✅ L14 is perfect! Zero duplicates!');
}
