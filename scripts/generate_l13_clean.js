const fs = require('fs');
const path = require('path');

// User-provided L13 raw data (same as before)
const l13Raw = [
    { "character": "癒", "on_yomi": "YU", "kun_yomi": "iya-su", "meaning": "Healing / Cure", "stroke_count": 18, "mnemonic": "A person in a sickbed receiving a heart/comfort for healing." },
    { "character": "痕", "on_yomi": "KON", "kun_yomi": "ato", "meaning": "Scar / Mark / Trace", "stroke_count": 11, "mnemonic": "A lingering mark or scar left on a sick/injured person." },
    { "character": "痩", "on_yomi": "SOU", "kun_yomi": "ya-seru", "meaning": "Thin / Emaciated", "stroke_count": 12, "mnemonic": "A person in a sickbed appearing thin/gaunt." },
    { "character": "痴", "on_yomi": "CHI", "kun_yomi": "none", "meaning": "Stupid / Foolish / Infatuation", "stroke_count": 13, "mnemonic": "A person with a sickness/folly in their mind." },
    { "character": "綻", "on_yomi": "TAN", "kun_yomi": "horoko-biru", "meaning": "Unravel / Rip / Rent", "stroke_count": 14, "mnemonic": "Threads becoming set or fixed in a ripped state." },
    { "character": "緻", "on_yomi": "CHI", "kun_yomi": "none", "meaning": "Fine / Delicate / Precise", "stroke_count": 16, "mnemonic": "Threads woven with a focused and delicate result." },
    { "character": "繭", "on_yomi": "KEN", "kun_yomi": "mayu", "meaning": "Cocoon", "stroke_count": 18, "mnemonic": "Threads covering a worm/insect in a grass-like shell." },
    { "character": "縛", "on_yomi": "BAKU", "kun_yomi": "shiba-ru", "meaning": "Bind / Tie / Restrain", "stroke_count": 16, "mnemonic": "Tying specialized threads to restrain someone." },
    { "character": "憶", "on_yomi": "OKU", "kun_yomi": "none", "meaning": "Recollection / Memory", "stroke_count": 16, "mnemonic": "A heart holding onto an idea/meaning from the past." },
    { "character": "惧", "on_yomi": "GU", "kun_yomi": "oso-reru", "meaning": "Fear / Dread / Awe", "stroke_count": 11, "mnemonic": "A heart feeling dread toward an official tool/sign." },
    { "character": "憧", "on_yomi": "SHOU", "kun_yomi": "ako-gareru", "meaning": "Yearn / Long for", "stroke_count": 15, "mnemonic": "A heart feeling childlike/pure yearning." },
    { "character": "憾", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Regret / Remorse", "stroke_count": 16, "mnemonic": "A heart feeling the heavy touch of regret." },
    { "character": "憬", "on_yomi": "KEI", "kun_yomi": "none", "meaning": "Long for / Yearn", "stroke_count": 15, "mnemonic": "A heart and a bright scenery; yearning for a distant place." },
    { "character": "嘲", "on_yomi": "CHOU", "kun_yomi": "azu-keru", "meaning": "Ridicule / Mock", "stroke_count": 15, "mnemonic": "A mouth speaking a bright/morning word in mockery." },
    { "character": "嘱", "on_yomi": "SHOKU", "kun_yomi": "none", "meaning": "Entrust / Commission", "stroke_count": 15, "mnemonic": "A mouth speaking an official request for duty." },
    { "character": "嘘", "on_yomi": "KYO", "kun_yomi": "uso", "meaning": "Lie / Falsehood", "stroke_count": 14, "mnemonic": "A mouth speaking an empty or imaginary word." },
    { "character": "喝", "on_yomi": "KATSU", "kun_yomi": "none", "meaning": "Scold / Shout / Hoarse", "stroke_count": 12, "mnemonic": "A mouth shouting for an exchange or scolding." },
    { "character": "喚", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Summon / Call out", "stroke_count": 12, "mnemonic": "A mouth calling out to exchange information." },
    { "character": "嗅", "on_yomi": "KYUU", "kun_yomi": "ka-gu", "meaning": "Smell / Sniff", "stroke_count": 13, "mnemonic": "A mouth/nose sniffing around like a dog." },
    { "character": "嘆", "on_yomi": "TAN", "kun_yomi": "nage-ku", "meaning": "Sigh / Lament", "stroke_count": 13, "mnemonic": "A mouth yawning or sighing with intense grief." },
    { "character": "曖", "on_yomi": "AI", "kun_yomi": "none", "meaning": "Obscure / Vague", "stroke_count": 17, "mnemonic": "The sun covered by a love-like shadow; vague." },
    { "character": "昧", "on_yomi": "MAI", "kun_yomi": "none", "meaning": "Obscure / Dark", "stroke_count": 9, "mnemonic": "The sun is not yet out; obscure/dark." },
    { "character": "旺", "on_yomi": "OU", "kun_yomi": "none", "meaning": "Flourishing / Vigorous", "stroke_count": 8, "mnemonic": "The sun over a king; flourishing power." },
    { "character": "昭", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Shining / Bright", "stroke_count": 9, "mnemonic": "The sun shining brightly over an altar/summon." },
    { "character": "暇", "on_yomi": "KA", "kun_yomi": "hima", "meaning": "Leisure / Free time", "stroke_count": 13, "mnemonic": "Sunlight over a borrowed/given time; leisure." },
    { "character": "眺", "on_yomi": "CHOU", "kun_yomi": "naga-meru", "meaning": "Stare / View / Gaze", "stroke_count": 11, "mnemonic": "Eye looking toward a sign or distant point." },
    { "character": "睦", "on_yomi": "BOKU", "kun_yomi": "mutsu-mu", "meaning": "Harmonious / Friendly", "stroke_count": 13, "mnemonic": "Eyes meeting in a friendly/land-based harmony." },
    { "character": "睡", "on_yomi": "SUI", "kun_yomi": "none", "meaning": "Drowsy / Sleep", "stroke_count": 13, "mnemonic": "The eye drooping like a hanging plant." },
    { "character": "督", "on_yomi": "TOKU", "kun_yomi": "none", "meaning": "Supervise / Command", "stroke_count": 13, "mnemonic": "An eye supervising a specialized task." },
    { "character": "瞬", "on_yomi": "SHUN", "kun_yomi": "matata-ku", "meaning": "Wink / Instant / Twinkle", "stroke_count": 18, "mnemonic": "The eye performing a quick dance; a wink." },
    { "character": "矯", "on_yomi": "KYOU", "kun_yomi": "ta-meru", "meaning": "Rectify / Correct", "stroke_count": 17, "mnemonic": "An arrow being straightened for a high goal." },
    { "character": "砕", "on_yomi": "SAI", "kun_yomi": "kuda-ku", "meaning": "Smash / Break", "stroke_count": 9, "mnemonic": "A stone being broken into nine pieces." },
    { "character": "碑", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Monolith / Tombstone", "stroke_count": 13, "mnemonic": "A stone marking a lowly/mean person's grave." },
    { "character": "礎", "on_yomi": "SO", "kun_yomi": "ishizue", "meaning": "Foundation / Cornerstone", "stroke_count": 18, "mnemonic": "A stone used as a stable pedestal/foundation." },
    { "character": "禍", "on_yomi": "KA", "kun_yomi": "none", "meaning": "Evil / Calamity / Curse", "stroke_count": 13, "mnemonic": "An altar showing a crooked/evil omen." },
    { "character": "禅", "on_yomi": "ZEN", "kun_yomi": "none", "meaning": "Zen / Meditation", "stroke_count": 13, "mnemonic": "An altar showing a single/simple truth; Zen." },
    { "character": "祥", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Auspicious / Good omen", "stroke_count": 10, "mnemonic": "An altar showing a sheep; a positive sign." },
    { "character": "祉", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Welfare / Happiness", "stroke_count": 8, "mnemonic": "An altar showing a stable/stopped omen." },
    { "character": "髄", "on_yomi": "ZUI", "kun_yomi": "none", "meaning": "Marrow / Essence / Pith", "stroke_count": 19, "mnemonic": "Bone and accompanying/following; the core marrow." },
    { "character": "骸", "on_yomi": "GAI", "kun_yomi": "mukuro", "meaning": "Skeleton / Corpse", "stroke_count": 16, "mnemonic": "Bone of a person/child on a cliff; a corpse." },
    { "character": "騰", "on_yomi": "TOU", "kun_yomi": "none", "meaning": "Leaping / Inflation / Rising", "stroke_count": 20, "mnemonic": "A horse rising up like the moon." },
    { "character": "駒", "on_yomi": "KU", "kun_yomi": "koma", "meaning": "Pony / Chess piece", "stroke_count": 15, "mnemonic": "A horse used for sentences or game pieces." },
    { "character": "駐", "on_yomi": "CHUU", "kun_yomi": "none", "meaning": "Reside / Station / Park", "stroke_count": 15, "mnemonic": "A horse stopping at a pillar/station." },
    { "character": "駆", "on_yomi": "KU", "kun_yomi": "ka-keru", "meaning": "Drive / Run / Gallop", "stroke_count": 14, "mnemonic": "A horse running toward a district." },
    { "character": "騒", "on_yomi": "SOU", "kun_yomi": "sawa-gu", "meaning": "Noise / Boisterous / Disturbance", "stroke_count": 18, "mnemonic": "A horse reacting to a noisy insect/disturbance." },
    { "character": "験", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Verification / Effect", "stroke_count": 18, "mnemonic": "A horse at a ritual gate for verification." },
    { "character": "驚", "on_yomi": "KYOU", "kun_yomi": "odoro-ku", "meaning": "Surprise / Amaze", "stroke_count": 22, "mnemonic": "A horse reacting to a respectful warning." },
    { "character": "駅", "on_yomi": "EKI", "kun_yomi": "none", "meaning": "Station", "stroke_count": 14, "mnemonic": "A horse at a building for travel." },
    { "character": "骨", "on_yomi": "KOTSU", "kun_yomi": "hone", "meaning": "Bone", "stroke_count": 10, "mnemonic": "A skull/top over the body's frame." },
    { "character": "魅", "on_yomi": "MI", "kun_yomi": "none", "meaning": "Fascination / Charm / Enchant", "stroke_count": 15, "mnemonic": "A ghost/spirit with a minor/understated charm." },
    { "character": "魂", "on_yomi": "KON", "kun_yomi": "tamashii", "meaning": "Soul / Spirit", "stroke_count": 14, "mnemonic": "A cloud-like ghost or spirit." },
    { "character": "魔", "on_yomi": "MA", "kun_yomi": "none", "meaning": "Demon / Devil / Witch", "stroke_count": 21, "mnemonic": "A ghost/spirit in a forest under a cover." },
    { "character": "鮮", "on_yomi": "SEN", "kun_yomi": "aza-yakka", "meaning": "Fresh / Vivid", "stroke_count": 17, "mnemonic": "Fish and sheep; the essence of freshness." },
    { "character": "鯨", "on_yomi": "GEI", "kun_yomi": "kujira", "meaning": "Whale", "stroke_count": 19, "mnemonic": "A fish that is as large as a capital building." },
    { "character": "鳥", "on_yomi": "CHOU", "kun_yomi": "tori", "meaning": "Bird", "stroke_count": 11, "mnemonic": "A bird with a crest and tail feathers." },
    { "character": "鶏", "on_yomi": "KEI", "kun_yomi": "niwatori", "meaning": "Chicken / Hen", "stroke_count": 19, "mnemonic": "A hand and bird; a domestic chicken." },
    { "character": "鶴", "on_yomi": "KAKU", "kun_yomi": "tsuru", "meaning": "Crane / Stork", "stroke_count": 21, "mnemonic": "A bird found near a peak/summit." },
    { "character": "鹿", "on_yomi": "ROKU", "kun_yomi": "shika", "meaning": "Deer", "stroke_count": 11, "mnemonic": "An animal under a cover with horns." },
    { "character": "麓", "on_yomi": "ROKU", "kun_yomi": "fumoto", "meaning": "Foot of a mountain", "stroke_count": 19, "mnemonic": "Forest and deer at the base of a mountain." },
    { "character": "麗", "on_yomi": "REI", "kun_yomi": "uru-washii", "meaning": "Lovely / Beautiful", "stroke_count": 19, "mnemonic": "Deer under a double/concurrent cover; beautiful." },
    { "character": "麟", "on_yomi": "RIN", "kun_yomi": "none", "meaning": "Kirin / Giraffe / Genius", "stroke_count": 24, "mnemonic": "A deer-like creature that is legendary/bright." },
    { "character": "麦", "on_yomi": "BAKU", "kun_yomi": "mugi", "meaning": "Wheat / Barley / Oat", "stroke_count": 7, "mnemonic": "Walking toward the grain/wheat." },
    { "character": "麺", "on_yomi": "MEN", "kun_yomi": "none", "meaning": "Noodles", "stroke_count": 16, "mnemonic": "Wheat/barley used for a face/surface; noodles." },
    { "character": "麻", "on_yomi": "MA", "kun_yomi": "asa", "meaning": "Hemp / Flax / Numb", "stroke_count": 11, "mnemonic": "Forest plants kept under a cover; hemp." },
    { "character": "磨", "on_yomi": "MA", "kun_yomi": "miga-ku", "meaning": "Grind / Polish", "stroke_count": 16, "mnemonic": "Hemp and stone used to polish/grind." },
    { "character": "黄金", "on_yomi": "OUGON", "kun_yomi": "none", "meaning": "Gold / Golden", "stroke_count": 19, "mnemonic": "Yellow metal; pure gold." },
    { "character": "黎", "on_yomi": "REI", "kun_yomi": "none", "meaning": "Dark / Black / Many", "stroke_count": 15, "mnemonic": "Grains that are dark or many." },
    { "character": "黙", "on_yomi": "MOKU", "kun_yomi": "dama-ru", "meaning": "Silence / Mute", "stroke_count": 15, "mnemonic": "A dog and fire; a silent, dark state." },
    { "character": "黛", "on_yomi": "TAI", "kun_yomi": "mayuzumi", "meaning": "Black eyebrow pencil", "stroke_count": 17, "mnemonic": "Black stone used for eyebrow makeup." },
    { "character": "鼓", "on_yomi": "KO", "kun_yomi": "tsuzumi", "meaning": "Drum / Beat / Rouse", "stroke_count": 13, "mnemonic": "Hand striking a skin drum/instrument." },
    { "character": "鼠", "on_yomi": "SHO", "kun_yomi": "nezumi", "meaning": "Rat / Mouse", "stroke_count": 13, "mnemonic": "Teeth and tail of a rodent." },
    { "character": "鼻", "on_yomi": "BI", "kun_yomi": "hana", "meaning": "Nose", "stroke_count": 14, "mnemonic": "Self and a field showing the nose/breath." },
    { "character": "齋", "on_yomi": "SAI", "kun_yomi": "none", "meaning": "Purification / Dietary restriction", "stroke_count": 17, "mnemonic": "Showing grain in a sacred hall for ritual." },
    { "character": "齎", "on_yomi": "SAI", "kun_yomi": "mota-rasu", "meaning": "Bring / Cause", "stroke_count": 21, "mnemonic": "Shells (money) brought to a sacred hall." },
    { "character": "齢", "on_yomi": "REI", "kun_yomi": "yowai", "meaning": "Age / Years", "stroke_count": 17, "mnemonic": "Teeth and an order; the years of one's life." },
    { "character": "龍", "on_yomi": "RYUU", "kun_yomi": "tatsu", "meaning": "Dragon", "stroke_count": 16, "mnemonic": "The shape of a dragon with a crest." },
    { "character": "襲", "on_yomi": "SHUU", "kun_yomi": "oso-u", "meaning": "Attack / Succeed to", "stroke_count": 22, "mnemonic": "Dragon/clothing; heavy, layered attack." },
    { "character": "籠", "on_yomi": "ROU", "kun_yomi": "kago", "meaning": "Basket / Cage", "stroke_count": 22, "mnemonic": "Bamboo and a dragon; a large basket/cage." },
    { "character": "亀", "on_yomi": "KI", "kun_yomi": "kame", "meaning": "Turtle / Tortoise", "stroke_count": 11, "mnemonic": "Shape of a turtle's shell and tail." },
    { "character": "黽", "on_yomi": "BO", "kun_yomi": "none", "meaning": "Frog / Toad / Exert", "stroke_count": 13, "mnemonic": "Shape of a frog; exerting effort." },
    { "character": "鼎", "on_yomi": "TEI", "kun_yomi": "kanae", "meaning": "Three-legged kettle / Tripod", "stroke_count": 13, "mnemonic": "Shape of an ancient three-legged pot." },
    { "character": "齊", "on_yomi": "SEI", "kun_yomi": "none", "meaning": "Aligned / Equal", "stroke_count": 14, "mnemonic": "Grains aligned in a sacred manner." },
    { "character": "龔", "on_yomi": "KYOU", "kun_yomi": "none", "meaning": "Present / Respect / Give", "stroke_count": 22, "mnemonic": "Dragon and dragon; a grand presentation." },
    { "character": "龕", "on_yomi": "GAN", "kun_yomi": "none", "meaning": "Niche / Shrine / Alcove", "stroke_count": 22, "mnemonic": "Dragon inside a cover; a sacred niche." },
    { "character": "龜", "on_yomi": "KI", "kun_yomi": "kame", "meaning": "Turtle / Tortoise", "stroke_count": 16, "mnemonic": "Ancient shape of a turtle shell." },
    { "character": "龠", "on_yomi": "YAKU", "kun_yomi": "none", "meaning": "Flute / Pipe / Measure", "stroke_count": 17, "mnemonic": "Mouth and bamboo; a ritual flute." },
    { "character": "龢", "on_yomi": "KA", "kun_yomi": "none", "meaning": "Harmony / Harmonious", "stroke_count": 22, "mnemonic": "Rice and flute; harmonic ritual." },
    { "character": "龣", "on_yomi": "KAKU", "kun_yomi": "none", "meaning": "Ancient ritual instrument", "stroke_count": 25, "mnemonic": "Complex flute/instrument for ritual." },
    { "character": "龤", "on_yomi": "KAI", "kun_yomi": "none", "meaning": "Harmony / Accord", "stroke_count": 26, "mnemonic": "A flute and a harmonizing sound." }
];

// Load baseline (L1-L12)
const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

// Filter unique from user data
let seenInL13 = new Set();
let finalL13 = [];

l13Raw.forEach(entry => {
    if (!seenInL13.has(entry.character) && !baseline.has(entry.character)) {
        finalL13.push(entry);
        seenInL13.add(entry.character);
    }
});

console.log('Unique from user data:', finalL13.length);

// Add 30 more unique N2/N1 Kanji to reach 100
const additional30 = [
    { "character": "痘", "on_yomi": "TOU", "kun_yomi": "none", "meaning": "Pox / Smallpox", "stroke_count": 12, "mnemonic": "Sickness疒 with beans豆; pox." },
    { "character": "瘍", "on_yomi": "YOU", "kun_yomi": "none", "meaning": "Ulcer / Boil", "stroke_count": 14, "mnemonic": "Sickness疒 with sun陽; ulcer." },
    { "character": "瘤", "on_yomi": "RYUU", "kun_yomi": "kobu", "meaning": "Tumor / Lump", "stroke_count": 14, "mnemonic": "Sickness疒 with a flow瘤; tumor." },
    { "character": "癖", "on_yomi": "HEKI", "kun_yomi": "kuse", "meaning": "Habit / Peculiarity", "stroke_count": 18, "mnemonic": "Sickness疒 with a wall壁; bad habit." },
    { "character": "癌", "on_yomi": "GAN", "kun_yomi": "none", "meaning": "Cancer", "stroke_count": 17, "mnemonic": "Sickness疒 like a rock岩; cancer." },
    { "character": "縫", "on_yomi": "HOU", "kun_yomi": "nu-u", "meaning": "Sew / Stitch", "stroke_count": 16, "mnemonic": "Thread糸 meeting逢; sewing." },
    { "character": "繊", "on_yomi": "SEN", "kun_yomi": "none", "meaning": "Fiber / Slender", "stroke_count": 17, "mnemonic": "Thread糸 that is fine纖; fiber." },
    { "character": "繕", "on_yomi": "ZEN", "kun_yomi": "tsukuro-u", "meaning": "Mend / Repair", "stroke_count": 18, "mnemonic": "Thread糸 for good善; mending." },
    { "character": "繰", "on_yomi": "SOU", "kun_yomi": "ku-ru", "meaning": "Reel / Wind / Repeat", "stroke_count": 19, "mnemonic": "Thread糸 being wound喿; reeling." },
    { "character": "纏", "on_yomi": "TEN", "kun_yomi": "matou", "meaning": "Wear / Wrap / Coil", "stroke_count": 21, "mnemonic": "Thread糸 wrapped around廛; coiling." },
    { "character": "憤", "on_yomi": "FUN", "kun_yomi": "ikidoo-ru", "meaning": "Resent / Be indignant", "stroke_count": 15, "mnemonic": "Heart心 with anger賁; resentment." },
    { "character": "憩", "on_yomi": "KEI", "kun_yomi": "iko-u", "meaning": "Rest / Repose", "stroke_count": 16, "mnemonic": "Heart心 at rest息; repose." },
    { "character": "懇", "on_yomi": "KON", "kun_yomi": "none", "meaning": "Sociable / Kind", "stroke_count": 17, "mnemonic": "Heart心 with roots根; kindness." },
    { "character": "懐", "on_yomi": "KAI", "kun_yomi": "natsu-kashii", "meaning": "Pocket / Yearn for", "stroke_count": 16, "mnemonic": "Heart心 cherishing懐; nostalgia." },
    { "character": "懲", "on_yomi": "CHOU", "kun_yomi": "ko-riru", "meaning": "Punish / Discipline", "stroke_count": 18, "mnemonic": "Heart心 being disciplined徴; punishment." },
    { "character": "嘩", "on_yomi": "KA", "kun_yomi": "none", "meaning": "Noisy / Boisterous", "stroke_count": 13, "mnemonic": "Mouth口 with flowers華; noisy." },
    { "character": "嘱", "on_yomi": "SHOKU", "kun_yomi": "none", "meaning": "Entrust / Request", "stroke_count": 15, "mnemonic": "Mouth口 with a request属; entrust." },
    { "character": "噴", "on_yomi": "FUN", "kun_yomi": "fu-ku", "meaning": "Spout / Erupt", "stroke_count": 15, "mnemonic": "Mouth口 spouting賁; eruption." },
    { "character": "噛", "on_yomi": "GOU", "kun_yomi": "ka-mu", "meaning": "Bite / Chew", "stroke_count": 15, "mnemonic": "Mouth口 biting齧; chewing." },
    { "character": "嚇", "on_yomi": "KAKU", "kun_yomi": "odo-su", "meaning": "Threaten / Menace", "stroke_count": 17, "mnemonic": "Mouth口 threatening赫; menace." },
    { "character": "曙", "on_yomi": "SHO", "kun_yomi": "akebono", "meaning": "Dawn / Daybreak", "stroke_count": 17, "mnemonic": "Sun日 with signature署; dawn." },
    { "character": "曝", "on_yomi": "BAKU", "kun_yomi": "sara-su", "meaning": "Expose / Bleach", "stroke_count": 19, "mnemonic": "Sun日 exposing暴; bleaching." },
    { "character": "瞭", "on_yomi": "RYOU", "kun_yomi": "none", "meaning": "Clear / Obvious", "stroke_count": 17, "mnemonic": "Eye目 seeing clearly瞭; obvious." },
    { "character": "瞑", "on_yomi": "MEI", "kun_yomi": "none", "meaning": "Close eyes / Dark", "stroke_count": 16, "mnemonic": "Eye目 in darkness冥; closed eyes." },
    { "character": "瞥", "on_yomi": "BETSU", "kun_yomi": "none", "meaning": "Glimpse / Glance", "stroke_count": 16, "mnemonic": "Eye目 glancing敝; glimpse." },
    { "character": "砲", "on_yomi": "HOU", "kun_yomi": "none", "meaning": "Cannon / Gun", "stroke_count": 10, "mnemonic": "Stone石 wrapped包; cannon." },
    { "character": "硝", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Nitrate / Saltpeter", "stroke_count": 12, "mnemonic": "Stone石 that melts消; nitrate." },
    { "character": "硫", "on_yomi": "RYUU", "kun_yomi": "none", "meaning": "Sulfur", "stroke_count": 12, "mnemonic": "Stone石 that flows流; sulfur." },
    { "character": "碗", "on_yomi": "WAN", "kun_yomi": "none", "meaning": "Bowl / Cup", "stroke_count": 13, "mnemonic": "Stone石 bowl宛; cup." },
    { "character": "磁", "on_yomi": "JI", "kun_yomi": "none", "meaning": "Magnet / Porcelain", "stroke_count": 14, "mnemonic": "Stone石 with magnetism慈; magnet." }
];

let added = 0;
additional30.forEach(entry => {
    if (!seenInL13.has(entry.character) && !baseline.has(entry.character) && finalL13.length < 100) {
        finalL13.push(entry);
        seenInL13.add(entry.character);
        added++;
    }
});

console.log('Added:', added);
console.log('Final L13 count:', finalL13.length);

// Save
const outputPath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l13.json');
fs.writeFileSync(outputPath, JSON.stringify(finalL13, null, 2), 'utf8');
console.log('Saved kanji_mastery_l13.json');

if (finalL13.length === 100) {
    console.log('✅ L13 COMPLETE WITH 100 KANJI!');
}
