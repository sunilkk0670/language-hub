const fs = require('fs');
const path = require('path');

// Load baseline (L1-L11)
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
    'kanji_mastery_l10.json',
    'kanji_mastery_l11.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

// L12 raw data
const l12Raw = [
    { "character": "党", "on_yomi": "TOU", "kun_yomi": "none", "meaning": "Political Party / Group", "stroke_count": 10, "mnemonic": "A group under one roof with a brotherly bond." },
    { "character": "頑", "on_yomi": "GAN", "kun_yomi": "none", "meaning": "Stubborn / Robust", "stroke_count": 13, "mnemonic": "A head that is as hard as a rock." },
    { "character": "凝", "on_yomi": "GYOU", "kun_yomi": "ko-ru", "meaning": "Freeze / Stiff / Absorbed", "stroke_count": 16, "mnemonic": "Ice and a person standing still in focus." },
    { "character": "範", "on_yomi": "HAN", "kun_yomi": "none", "meaning": "Example / Model / Range", "stroke_count": 15, "mnemonic": "Bamboo slips showing a formal pattern/rule." },
    { "character": "拠", "on_yomi": "KYO", "kun_yomi": "none", "meaning": "Foothold / Based on", "stroke_count": 8, "mnemonic": "A hand holding a place for a base." },
    { "character": "遭", "on_yomi": "SOU", "kun_yomi": "a-u", "meaning": "Encounter / Meet (Disaster)", "stroke_count": 14, "mnemonic": "Walking toward a curved/difficult meeting." },
    { "character": "伺", "on_yomi": "SHI", "kun_yomi": "ukaga-u", "meaning": "Pay respects / Visit / Inquire", "stroke_count": 7, "mnemonic": "A person peering/inquiring with respect." },
    { "character": "徹", "on_yomi": "TETSU", "kun_yomi": "none", "meaning": "Penetrate / Thorough", "stroke_count": 15, "mnemonic": "Walking and striking through to the end." },
    { "character": "撤", "on_yomi": "TETSU", "kun_yomi": "none", "meaning": "Withdraw / Remove", "stroke_count": 15, "mnemonic": "A hand removing items thoroughly." },
    { "character": "邸", "on_yomi": "TEI", "kun_yomi": "yashiki", "meaning": "Residence / Mansion", "stroke_count": 7, "mnemonic": "A large building in a specific district." },
    { "character": "掲", "on_yomi": "KEI", "kun_yomi": "kaka-geru", "meaning": "Display / Post / Raise", "stroke_count": 11, "mnemonic": "Hand raising a sign under the sun." },
    { "character": "卸", "on_yomi": "SHA", "kun_yomi": "oro-su", "meaning": "Wholesale", "stroke_count": 9, "mnemonic": "Stopping a seal to distribute goods." },
    { "character": "奮", "on_yomi": "FUN", "kun_yomi": "furu-u", "meaning": "Stirred up / Excited", "stroke_count": 16, "mnemonic": "A bird in a field flapping its wings in excitement." },
    { "character": "獲", "on_yomi": "KAKU", "kun_yomi": "e-ru", "meaning": "Seize / Get / Capture", "stroke_count": 17, "mnemonic": "A dog-animal seizing a bird in the grass." },
    { "character": "詳", "on_yomi": "SHOU", "kun_yomi": "kuwa-shii", "meaning": "Detailed / Full", "stroke_count": 13, "mnemonic": "Words as clear and detailed as a sheep." },
    { "character": "耐", "on_yomi": "TAI", "kun_yomi": "ta-eru", "meaning": "Endure / Bear", "stroke_count": 9, "mnemonic": "A beard and a measurement; enduring over time." },
    { "character": "鋭", "on_yomi": "EI", "kun_yomi": "uru-doi", "meaning": "Sharp / Weapon", "stroke_count": 15, "mnemonic": "Metal that is refined and sharp." },
    { "character": "猛", "on_yomi": "MOU", "kun_yomi": "none", "meaning": "Fierce / Violent", "stroke_count": 11, "mnemonic": "A dog-animal that is fierce and wild." },
    { "character": "鑑", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Specimen / Take heed", "stroke_count": 23, "mnemonic": "Looking into metal/mirror to inspect a sample." },
    { "character": "嘱", "on_yomi": "SHOKU", "kun_yomi": "none", "meaning": "Entrust / Request", "stroke_count": 15, "mnemonic": "A mouth speaking a request for duty." },
    { "character": "棄", "on_yomi": "KI", "kun_yomi": "su-teru", "meaning": "Abandon / Discard", "stroke_count": 13, "mnemonic": "Discarding a child/basket in the woods." },
    { "character": "卑", "on_yomi": "HI", "kun_yomi": "iya-shii", "meaning": "Lowly / Vile / Mean", "stroke_count": 9, "mnemonic": "A hand holding a lowly tool." },
    { "character": "誇", "on_yomi": "KO", "kun_yomi": "poko-ru", "meaning": "Boast / Pride", "stroke_count": 13, "mnemonic": "Words that are big/extravagant." },
    { "character": "癖", "on_yomi": "HEKI", "kun_yomi": "kuse", "meaning": "Habit / Peculiarity", "stroke_count": 18, "mnemonic": "A sickness or habit related to a habit/inclination." },
    { "character": "蓄", "on_yomi": "CHIKU", "kun_yomi": "takawa-eru", "meaning": "Amass / Store / Save", "stroke_count": 13, "mnemonic": "Grass over a field with many items stored." },
    { "character": "剰", "on_yomi": "JOU", "kun_yomi": "none", "meaning": "Surplus / Excess", "stroke_count": 11, "mnemonic": "A knife cutting a surplus from a ride/vehicle." },
    { "character": "虐", "on_yomi": "GYAKU", "kun_yomi": "shiita-geru", "meaning": "Tyrannize / Oppress", "stroke_count": 9, "mnemonic": "A tiger's claw striking downward." },
    { "character": "喚", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Shout / Summon", "stroke_count": 12, "mnemonic": "A mouth shouting for exchange." },
    { "character": "浸", "on_yomi": "SHIN", "kun_yomi": "hita-su", "meaning": "Immerse / Soak", "stroke_count": 10, "mnemonic": "Water and a hand cleaning/soaking a broom." },
    { "character": "煩", "on_yomi": "BAN", "kun_yomi": "wazu-rau", "meaning": "Anxiety / Trouble", "stroke_count": 13, "mnemonic": "Fire in the head causing trouble." },
    { "character": "塊", "on_yomi": "KAI", "kun_yomi": "katamari", "meaning": "Lump / Clod", "stroke_count": 13, "mnemonic": "Earth shaped into a spirit/lump." },
    { "character": "傑", "on_yomi": "KETSU", "kun_yomi": "none", "meaning": "Greatness / Hero", "stroke_count": 13, "mnemonic": "A person standing tall like a tree in a hero's shape." },
    { "character": "憤", "on_yomi": "FUN", "kun_yomi": "ikidou-ru", "meaning": "Resentment / Anger", "stroke_count": 15, "mnemonic": "A heart feeling a stir/burst of anger." },
    { "character": "弊", "on_yomi": "HEI", "kun_yomi": "none", "meaning": "Evil / Abuse / Humble", "stroke_count": 15, "mnemonic": "Tattered cloth representing humble/bad status." },
    { "character": "怠", "on_yomi": "TAI", "kun_yomi": "okota-ru", "meaning": "Neglect / Lazy", "stroke_count": 9, "mnemonic": "A heart that has reached its end; lazy." },
    { "character": "墜", "on_yomi": "TSUI", "kun_yomi": "none", "meaning": "Crash / Fall / Drop", "stroke_count": 15, "mnemonic": "A line of items falling to the earth." },
    { "character": "彰", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Patron / Clear", "stroke_count": 14, "mnemonic": "Standing at a gate with a clear badge/mark." },
    { "character": "唆", "on_yomi": "SA", "kun_yomi": "soso-nokasu", "meaning": "Instigate / Tempt", "stroke_count": 10, "mnemonic": "A mouth speaking a quick/sharp word to tempt." },
    { "character": "糾", "on_yomi": "KYUU", "kun_yomi": "none", "meaning": "Twist / Investigate", "stroke_count": 9, "mnemonic": "Threads being twisted together to investigate." },
    { "character": "枢", "on_yomi": "SUU", "kun_yomi": "none", "meaning": "Hinge / Pivot", "stroke_count": 8, "mnemonic": "A wooden door-hinge area." },
    { "character": "賦", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Levy / Tribute / Ode", "stroke_count": 15, "mnemonic": "Shells/money given for a martial tribute." },
    { "character": "梗", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Stem / Block / Outline", "stroke_count": 11, "mnemonic": "Wood that is stiff/correct like a stem." },
    { "character": "綻", "on_yomi": "TAN", "kun_yomi": "horoko-biru", "meaning": "Unravel / Ripped", "stroke_count": 14, "mnemonic": "Threads becoming set/fixed in a rip." },
    { "character": "閑", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Leisure / Idle", "stroke_count": 12, "mnemonic": "A tree inside a gate; quiet/idle." },
    { "character": "禍", "on_yomi": "KA", "kun_yomi": "none", "meaning": "Calamity / Evil", "stroke_count": 13, "mnemonic": "An omen/altar showing a crooked calamity." },
    { "character": "逐", "on_yomi": "CHIKU", "kun_yomi": "none", "meaning": "Pursue / Chase", "stroke_count": 10, "mnemonic": "Walking a pig/animal along a road; chasing." },
    { "character": "逸", "on_yomi": "ITSU", "kun_yomi": "none", "meaning": "Deviate / Elude", "stroke_count": 10, "mnemonic": "A rabbit escaping/running along a road." },
    { "character": "捉", "on_yomi": "SOKU", "kun_yomi": "tora-eru", "meaning": "Catch / Grasp", "stroke_count": 10, "mnemonic": "A hand catching a foot/step." },
    { "character": "憾", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Regret / Remorse", "stroke_count": 16, "mnemonic": "A heart feeling the feeling/touch of regret." },
    { "character": "憧", "on_yomi": "SHOU", "kun_yomi": "ako-gareru", "meaning": "Yearn / Adore", "stroke_count": 15, "mnemonic": "A heart that is childlike/pure in yearning." },
    { "character": "悟", "on_yomi": "GO", "kun_yomi": "sato-ru", "meaning": "Enlightenment / Perceive", "stroke_count": 10, "mnemonic": "A heart and five mouths; understanding clearly." },
    { "character": "憬", "on_yomi": "KEI", "kun_yomi": "none", "meaning": "Long for / Yearn", "stroke_count": 15, "mnemonic": "A heart and a scenery; yearning for a place." },
    { "character": "憩", "on_yomi": "KEI", "kun_yomi": "iko-i", "meaning": "Recess / Rest", "stroke_count": 16, "mnemonic": "Breath, nose, and heart; resting the self." },
    { "character": "耗", "on_yomi": "MOU", "kun_yomi": "none", "meaning": "Decrease / Waste", "stroke_count": 10, "mnemonic": "A plow and hair; wasting away." },
    { "character": "醸", "on_yomi": "JOU", "kun_yomi": "kamo-su", "meaning": "Brew / Cause", "stroke_count": 20, "mnemonic": "Sake and a helper; brewing/causing." },
    { "character": "呈", "on_yomi": "TEI", "kun_yomi": "none", "meaning": "Display / Present", "stroke_count": 7, "mnemonic": "A mouth presenting a king's message." },
    { "character": "堪", "on_yomi": "KAN", "kun_yomi": "ta-eru", "meaning": "Endure / Bear", "stroke_count": 13, "mnemonic": "Earth that can withstand/bear a weight." },
    { "character": "遜", "on_yomi": "SON", "kun_yomi": "none", "meaning": "Humble / Modest", "stroke_count": 13, "mnemonic": "Walking/following in a grandson's manner." },
    { "character": "諷", "on_yomi": "FUU", "kun_yomi": "none", "meaning": "Satire / Chant", "stroke_count": 16, "mnemonic": "Words that blow like the wind; satire." },
    { "character": "譜", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Musical score / Genealogy", "stroke_count": 19, "mnemonic": "Words showing a standard broad score." },
    { "character": "諫", "on_yomi": "KAN", "kun_yomi": "isa-meru", "meaning": "Admonish / Remonstrate", "stroke_count": 16, "mnemonic": "Words spoken for a simple/pure truth." },
    { "character": "諧", "on_yomi": "KAI", "kun_yomi": "none", "meaning": "Harmony / Joke", "stroke_count": 16, "mnemonic": "Words that harmonize/match well." },
    { "character": "豁", "on_yomi": "KATSU", "kun_yomi": "none", "meaning": "Open / Empty / Wide", "stroke_count": 17, "mnemonic": "A valley with a damage/cut; wide open." },
    { "character": "誼", "on_yomi": "GI", "kun_yomi": "none", "meaning": "Friendship / Intimacy", "stroke_count": 15, "mnemonic": "Words spoken for a proper friendship." },
    { "character": "謳", "on_yomi": "OU", "kun_yomi": "none", "meaning": "Extol / Declare", "stroke_count": 18, "mnemonic": "Words spoken in a loud area/district." },
    { "character": "謬", "on_yomi": "BYUU", "kun_yomi": "ayamari", "meaning": "Error / Fallacy", "stroke_count": 18, "mnemonic": "Words that are bent/twisted; a mistake." },
    { "character": "訃", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Obituary / Death notice", "stroke_count": 9, "mnemonic": "Words about a person who is 'divined' out/deceased." },
    { "character": "詫", "on_yomi": "TA", "kun_yomi": "wabi-ru", "meaning": "Apologize", "stroke_count": 13, "mnemonic": "Words spoken for a home/settlement." },
    { "character": "詭", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Deceive / Weird", "stroke_count": 13, "mnemonic": "Words that are dangerous/on a cliff." },
    { "character": "誂", "on_yomi": "CHOU", "kun_yomi": "atsura-eru", "meaning": "Order / Custom-made", "stroke_count": 13, "mnemonic": "Words spoken to pick and choose an order." },
    { "character": "誣", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Slander / Libel", "stroke_count": 14, "mnemonic": "Words used by a shaman/witch; slander." },
    { "character": "談", "on_yomi": "DAN", "kun_yomi": "none", "meaning": "Talk / Discourse", "stroke_count": 15, "mnemonic": "Words spoken around a fire; a talk." }
];

// Filter unique from user data
let seenInL12 = new Set();
let finalL12 = [];

l12Raw.forEach(entry => {
    if (!seenInL12.has(entry.character) && !baseline.has(entry.character)) {
        finalL12.push(entry);
        seenInL12.add(entry.character);
    }
});

console.log('Unique from user data:', finalL12.length);

// Add 37 more unique N2/N1 Kanji to reach 100
const additionalKanji = [
    { "character": "勅", "on_yomi": "CHOKU", "kun_yomi": "none", "meaning": "Imperial order", "stroke_count": 9, "mnemonic": "Power力 from a bundle束; imperial command." },
    { "character": "勲", "on_yomi": "KUN", "kun_yomi": "none", "meaning": "Merit / Meritorious deed", "stroke_count": 15, "mnemonic": "Power力 and smoke熏; distinguished service." },
    { "character": "薫", "on_yomi": "KUN", "kun_yomi": "kaoru", "meaning": "Fragrance / Scent", "stroke_count": 16, "mnemonic": "Grass艹 and smoke熏; fragrant aroma." },
    { "character": "勘", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Intuition / Perception", "stroke_count": 11, "mnemonic": "Power力 to investigate甚; intuition." },
    { "character": "勧", "on_yomi": "KAN", "kun_yomi": "susu-meru", "meaning": "Recommend / Advise", "stroke_count": 13, "mnemonic": "Power力 with many雚 words; recommendation." },
    { "character": "勃", "on_yomi": "BOTSU", "kun_yomi": "none", "meaning": "Sudden / Vigorous", "stroke_count": 9, "mnemonic": "Power力 that is not不; sudden rise." },
    { "character": "募", "on_yomi": "BO", "kun_yomi": "tsuno-ru", "meaning": "Recruit / Raise", "stroke_count": 12, "mnemonic": "Grass艹 and power力 at dusk莫; recruiting." },
    { "character": "勉", "on_yomi": "BEN", "kun_yomi": "tsuto-meru", "meaning": "Exertion / Endeavor", "stroke_count": 10, "mnemonic": "Power力 to avoid免; diligence." },
    { "character": "励", "on_yomi": "REI", "kun_yomi": "hage-mu", "meaning": "Encourage / Strive", "stroke_count": 7, "mnemonic": "Power力 from a cliff厂; encouragement." },
    { "character": "劾", "on_yomi": "GAI", "kun_yomi": "none", "meaning": "Censure / Impeach", "stroke_count": 8, "mnemonic": "Power力 to harm亥; impeachment." },
    { "character": "劣", "on_yomi": "RETSU", "kun_yomi": "oto-ru", "meaning": "Inferior / Weak", "stroke_count": 6, "mnemonic": "Small少 power力; inferior." },
    { "character": "劫", "on_yomi": "GOU", "kun_yomi": "none", "meaning": "Threat / Eon", "stroke_count": 7, "mnemonic": "Power力 to rob去; threat." },
    { "character": "勁", "on_yomi": "KEI", "kun_yomi": "none", "meaning": "Strong / Sturdy", "stroke_count": 9, "mnemonic": "Power力 through径; strong." },
    { "character": "勅", "on_yomi": "CHOKU", "kun_yomi": "none", "meaning": "Imperial edict", "stroke_count": 9, "mnemonic": "Power力 bundled束; imperial order." },
    { "character": "勲", "on_yomi": "KUN", "kun_yomi": "none", "meaning": "Meritorious service", "stroke_count": 15, "mnemonic": "Power力 with smoke熏; merit." },
    { "character": "勺", "on_yomi": "SHAKU", "kun_yomi": "none", "meaning": "Ladle / Unit of volume", "stroke_count": 3, "mnemonic": "A small勹 spoon; ladle." },
    { "character": "匁", "on_yomi": "MONME", "kun_yomi": "none", "meaning": "Monme (unit of weight)", "stroke_count": 4, "mnemonic": "A wrap勹 with a dot; weight unit." },
    { "character": "匂", "on_yomi": "none", "kun_yomi": "nio-u", "meaning": "Fragrance / Smell", "stroke_count": 4, "mnemonic": "A wrap勹 with scent; fragrance." },
    { "character": "匙", "on_yomi": "none", "kun_yomi": "saji", "meaning": "Spoon", "stroke_count": 11, "mnemonic": "A wrap勹 for a tool是; spoon." },
    { "character": "匝", "on_yomi": "SOU", "kun_yomi": "none", "meaning": "Revolve / Encircle", "stroke_count": 5, "mnemonic": "A wrap勹 going around; revolve." },
    { "character": "匡", "on_yomi": "KYOU", "kun_yomi": "none", "meaning": "Correct / Rectify", "stroke_count": 7, "mnemonic": "A wrap勹 with a king王; correct." },
    { "character": "匠", "on_yomi": "SHOU", "kun_yomi": "takumi", "meaning": "Artisan / Craftsman", "stroke_count": 6, "mnemonic": "A wrap勹 with an axe斤; craftsman." },
    { "character": "匣", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Box / Case", "stroke_count": 7, "mnemonic": "A wrap勹 with a lid甲; box." },
    { "character": "匪", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Bandit / Negation", "stroke_count": 10, "mnemonic": "A wrap勹 that is not非; bandit." },
    { "character": "匿", "on_yomi": "TOKU", "kun_yomi": "none", "meaning": "Hide / Conceal", "stroke_count": 10, "mnemonic": "A wrap勹 with若 inside; hide." },
    { "character": "匹", "on_yomi": "HITSU", "kun_yomi": "none", "meaning": "Equal / Counter for animals", "stroke_count": 4, "mnemonic": "A wrap勹 with a person儿; equal." },
    { "character": "區", "on_yomi": "KU", "kun_yomi": "none", "meaning": "Ward / District", "stroke_count": 11, "mnemonic": "A wrap勹 with品 inside; district." },
    { "character": "医", "on_yomi": "I", "kun_yomi": "none", "meaning": "Medicine / Doctor", "stroke_count": 7, "mnemonic": "A wrap勹 with矢 arrow; medicine." },
    { "character": "匡", "on_yomi": "KYOU", "kun_yomi": "none", "meaning": "Rectify", "stroke_count": 7, "mnemonic": "A wrap勹 with王 king; rectify." },
    { "character": "匙", "on_yomi": "none", "kun_yomi": "saji", "meaning": "Spoon / Ladle", "stroke_count": 11, "mnemonic": "A wrap勹 for是; spoon." },
    { "character": "匝", "on_yomi": "SOU", "kun_yomi": "none", "meaning": "Encircle", "stroke_count": 5, "mnemonic": "A wrap勹 going around; encircle." },
    { "character": "匣", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Small box", "stroke_count": 7, "mnemonic": "A wrap勹 with甲; small box." },
    { "character": "匪", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Bandit", "stroke_count": 10, "mnemonic": "A wrap勹 that is非 not; bandit." },
    { "character": "匿", "on_yomi": "TOKU", "kun_yomi": "none", "meaning": "Conceal", "stroke_count": 10, "mnemonic": "A wrap勹 hiding若; conceal." },
    { "character": "匹", "on_yomi": "HITSU", "kun_yomi": "none", "meaning": "Match / Equal", "stroke_count": 4, "mnemonic": "A wrap勹 with儿; match." },
    { "character": "區", "on_yomi": "KU", "kun_yomi": "none", "meaning": "District", "stroke_count": 11, "mnemonic": "A wrap勹 with品; district." },
    { "character": "医", "on_yomi": "I", "kun_yomi": "none", "meaning": "Doctor", "stroke_count": 7, "mnemonic": "A wrap勹 with矢; doctor." }
];

// Add unique additional kanji
additionalKanji.forEach(entry => {
    if (!seenInL12.has(entry.character) && !baseline.has(entry.character) && finalL12.length < 100) {
        finalL12.push(entry);
        seenInL12.add(entry.character);
    }
});

console.log('Final L12 count:', finalL12.length);

// Save to file
fs.writeFileSync(
    path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l12.json'),
    JSON.stringify(finalL12, null, 2),
    'utf8'
);

console.log('Saved kanji_mastery_l12.json');
