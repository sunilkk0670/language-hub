const fs = require('fs');
const path = require('path');

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

console.log('Generating clean L15...');
console.log('Baseline size:', baseline.size);

const finalL15 = [];
const seenInL15 = new Set();

// First, add the 37 unique Kanji from user data
const userUniqueKanji = [
    { "character": "鋳", "on_yomi": "CHUU", "kun_yomi": "i-ru", "meaning": "Casting / Minting", "stroke_count": 15, "mnemonic": "Metal melted and poured into a mold for life/use." },
    { "character": "鍛", "on_yomi": "TAN", "kun_yomi": "kita-eru", "meaning": "Forge / Discipline", "stroke_count": 17, "mnemonic": "Metal struck in sections for strength/discipline." },
    { "character": "鍵", "on_yomi": "KEN", "kun_yomi": "kagi", "meaning": "Key", "stroke_count": 17, "mnemonic": "Metal used to build a standard/gate rule." },
    { "character": "鎌", "on_yomi": "REN", "kun_yomi": "kama", "meaning": "Sickle / Scythe", "stroke_count": 18, "mnemonic": "Metal concurrently used for reaping." },
    { "character": "鎖", "on_yomi": "SA", "kun_yomi": "kusari", "meaning": "Chain / Blockade", "stroke_count": 18, "mnemonic": "Metal shells tied together to form a barrier/chain." },
    { "character": "鎧", "on_yomi": "GAI", "kun_yomi": "yoroi", "meaning": "Armor", "stroke_count": 18, "mnemonic": "Metal used to cover and protect like a shell." },
    { "character": "鎮", "on_yomi": "CHIN", "kun_yomi": "shizu-meru", "meaning": "Tranquilize / Appease", "stroke_count": 18, "mnemonic": "Metal that is true and heavy to calm things down." },
    { "character": "鏡", "on_yomi": "KYOU", "kun_yomi": "kagami", "meaning": "Mirror", "stroke_count": 19, "mnemonic": "Metal showing a clear standing reflection." },
    { "character": "鐘", "on_yomi": "SHOU", "kun_yomi": "kane", "meaning": "Bell / Chime", "stroke_count": 20, "mnemonic": "Metal that is a child of the village sound." },
    { "character": "飢", "on_yomi": "KI", "kun_yomi": "u-eru", "meaning": "Hunger / Starve", "stroke_count": 10, "mnemonic": "Eating/food that is only a desk/empty." },
    { "character": "飽", "on_yomi": "HOU", "kun_yomi": "a-kiru", "meaning": "Satiated / Bored", "stroke_count": 13, "mnemonic": "Food/eating until you are full/wrapped up." },
    { "character": "飼", "on_yomi": "SHI", "kun_yomi": "ka-u", "meaning": "Domesticate / Raise animal", "stroke_count": 13, "mnemonic": "Food/eating given to an officer/manager." },
    { "character": "餅", "on_yomi": "HEI", "kun_yomi": "mochi", "meaning": "Rice cake", "stroke_count": 14, "mnemonic": "Food/eating that is simultaneous/aligned." },
    { "character": "餌", "on_yomi": "JI", "kun_yomi": "esa", "meaning": "Bait / Feed", "stroke_count": 15, "mnemonic": "Food/eating that is an ear/listening for animals." },
    { "character": "餓", "on_yomi": "GA", "kun_yomi": "none", "meaning": "Starve / Hungry", "stroke_count": 15, "mnemonic": "Food/eating that I/me lack entirely." },
    { "character": "饗", "on_yomi": "KYOU", "kun_yomi": "none", "meaning": "Banquet / Feast", "stroke_count": 22, "mnemonic": "Food/eating and a village/hometown spirit." },
    { "character": "衣", "on_yomi": "I", "kun_yomi": "koromo", "meaning": "Garment / Clothing", "stroke_count": 6, "mnemonic": "The shape of a person's upper clothing." },
    { "character": "衷", "on_yomi": "CHUU", "kun_yomi": "none", "meaning": "Inmost / Sincere", "stroke_count": 10, "mnemonic": "The center of one's clothing/heart." },
    { "character": "袋", "on_yomi": "TAI", "kun_yomi": "fukuro", "meaning": "Sack / Bag", "stroke_count": 11, "mnemonic": "Clothing used to substitute/carry items." },
    { "character": "袖", "on_yomi": "SHUU", "kun_yomi": "sode", "meaning": "Sleeve", "stroke_count": 10, "mnemonic": "Clothing and a field; the sleeve of a garment." },
    { "character": "装", "on_yomi": "SOU", "kun_yomi": "yosoo-u", "meaning": "Attire / Equip", "stroke_count": 12, "mnemonic": "Clothing and a scholar/warrior; dressing up." },
    { "character": "裕", "on_yomi": "YUU", "kun_yomi": "none", "meaning": "Abundant / Fertile", "stroke_count": 12, "mnemonic": "Clothing and a valley; rich capacity." },
    { "character": "製", "on_yomi": "SEI", "kun_yomi": "none", "meaning": "Manufacture", "stroke_count": 14, "mnemonic": "Clothing and a system; a formal product." },
    { "character": "褐", "on_yomi": "KATSU", "kun_yomi": "none", "meaning": "Brown / Coarse cloth", "stroke_count": 13, "mnemonic": "Clothing that is coarse like a shell." },
    { "character": "襟", "on_yomi": "KIN", "kun_yomi": "eri", "meaning": "Collar / Lapel", "stroke_count": 18, "mnemonic": "Clothing and a forbidden/forest area." },
    { "character": "褪", "on_yomi": "TAI", "kun_yomi": "a-seru", "meaning": "Discolor / Fade", "stroke_count": 15, "mnemonic": "Clothing and a retreat; fading away." },
    { "character": "悟", "on_yomi": "GO", "kun_yomi": "sato-ru", "meaning": "Perceive / Enlighten", "stroke_count": 10, "mnemonic": "Heart and five mouths; clear understanding." },
    { "character": "憩", "on_yomi": "KEI", "kun_yomi": "iko-i", "meaning": "Rest / Recess", "stroke_count": 16, "mnemonic": "Breath and heart; resting the self." },
    { "character": "糾", "on_yomi": "KYUU", "kun_yomi": "none", "meaning": "Examine / Twist", "stroke_count": 9, "mnemonic": "Threads twisted to find truth." },
    { "character": "罷", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Stop / Quit", "stroke_count": 15, "mnemonic": "A net over a bird; stopping movement." },
    { "character": "耗", "on_yomi": "MOU", "kun_yomi": "none", "meaning": "Waste / Decrease", "stroke_count": 10, "mnemonic": "A plow and hair; wasting away." },
    { "character": "呈", "on_yomi": "TEI", "kun_yomi": "none", "meaning": "Present / Display", "stroke_count": 7, "mnemonic": "A mouth presenting a king's message." },
    { "character": "堪", "on_yomi": "KAN", "kun_yomi": "ta-eru", "meaning": "Bear / Endure", "stroke_count": 13, "mnemonic": "Earth withstanding a heavy weight." },
    { "character": "謡", "on_yomi": "YOU", "kun_yomi": "utai", "meaning": "Noh chant / Song", "stroke_count": 16, "mnemonic": "Words spoken like a folk song." },
    { "character": "遜", "on_yomi": "SON", "kun_yomi": "none", "meaning": "Humble", "stroke_count": 13, "mnemonic": "Walking in a grandson's manner." },
    { "character": "諷", "on_yomi": "FUU", "kun_yomi": "none", "meaning": "Satire / Chant", "stroke_count": 16, "mnemonic": "Words blowing like the wind; satire." },
    { "character": "譜", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Musical score / Genealogy", "stroke_count": 19, "mnemonic": "Words showing a standard score." }
];

userUniqueKanji.forEach(entry => {
    if (!baseline.has(entry.character) && !seenInL15.has(entry.character)) {
        finalL15.push(entry);
        seenInL15.add(entry.character);
    }
});

console.log('Added unique from user data:', finalL15.length);

// Now add 63 new unique N2/N1 Kanji
const additional63 = [
    { "character": "釘", "on_yomi": "TEI", "kun_yomi": "kugi", "meaning": "Nail / Peg", "stroke_count": 10, "mnemonic": "Metal and a nail; nail." },
    { "character": "釜", "on_yomi": "FU", "kun_yomi": "kama", "meaning": "Kettle / Cauldron", "stroke_count": 10, "mnemonic": "Metal and a father; kettle." },
    { "character": "釣", "on_yomi": "CHOU", "kun_yomi": "tsu-ru", "meaning": "Fishing / Angling", "stroke_count": 11, "mnemonic": "Metal and a ladle; fishing." },
    { "character": "鈍", "on_yomi": "DON", "kun_yomi": "nibu-i", "meaning": "Dull / Blunt", "stroke_count": 12, "mnemonic": "Metal and a tun; dull." },
    { "character": "鈴", "on_yomi": "REI", "kun_yomi": "suzu", "meaning": "Bell / Small bell", "stroke_count": 13, "mnemonic": "Metal and a command; bell." },
    { "character": "鉛", "on_yomi": "EN", "kun_yomi": "namari", "meaning": "Lead (metal)", "stroke_count": 13, "mnemonic": "Metal and a marsh; lead." },
    { "character": "鉢", "on_yomi": "HATSU", "kun_yomi": "hachi", "meaning": "Bowl / Pot", "stroke_count": 13, "mnemonic": "Metal and a book; bowl." },
    { "character": "鉱", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Ore / Mineral", "stroke_count": 13, "mnemonic": "Metal and a wide; ore." },
    { "character": "銅", "on_yomi": "DOU", "kun_yomi": "none", "meaning": "Copper", "stroke_count": 14, "mnemonic": "Metal and a same; copper." },
    { "character": "銃", "on_yomi": "JUU", "kun_yomi": "none", "meaning": "Gun / Rifle", "stroke_count": 14, "mnemonic": "Metal and a fill; gun." },
    { "character": "銑", "on_yomi": "SEN", "kun_yomi": "none", "meaning": "Pig iron / Refine", "stroke_count": 14, "mnemonic": "Metal and a first; pig iron." },
    { "character": "銘", "on_yomi": "MEI", "kun_yomi": "none", "meaning": "Inscription", "stroke_count": 14, "mnemonic": "Metal and a name; inscription." },
    { "character": "銚", "on_yomi": "CHOU", "kun_yomi": "none", "meaning": "Sake pot", "stroke_count": 14, "mnemonic": "Metal and a sign; sake pot." },
    { "character": "鋸", "on_yomi": "KYO", "kun_yomi": "nokogiri", "meaning": "Saw", "stroke_count": 16, "mnemonic": "Metal and a residence; saw." },
    { "character": "鋼", "on_yomi": "KOU", "kun_yomi": "hagane", "meaning": "Steel", "stroke_count": 16, "mnemonic": "Metal and a ridge; steel." },
    { "character": "錠", "on_yomi": "JOU", "kun_yomi": "none", "meaning": "Lock / Tablet", "stroke_count": 16, "mnemonic": "Metal and a fixed; lock." },
    { "character": "錘", "on_yomi": "SUI", "kun_yomi": "tsumu", "meaning": "Weight / Spindle", "stroke_count": 16, "mnemonic": "Metal and a hang; weight." },
    { "character": "錦", "on_yomi": "KIN", "kun_yomi": "nishiki", "meaning": "Brocade / Fine fabric", "stroke_count": 16, "mnemonic": "Metal and a white; brocade." },
    { "character": "錨", "on_yomi": "BYOU", "kun_yomi": "ikari", "meaning": "Anchor", "stroke_count": 16, "mnemonic": "Metal and a seedling; anchor." },
    { "character": "錬", "on_yomi": "REN", "kun_yomi": "none", "meaning": "Refine / Temper", "stroke_count": 16, "mnemonic": "Metal and a east; refine." },
    { "character": "錯", "on_yomi": "SAKU", "kun_yomi": "none", "meaning": "Confused / Mix", "stroke_count": 16, "mnemonic": "Metal and a past; confused." },
    { "character": "錐", "on_yomi": "SUI", "kun_yomi": "kiri", "meaning": "Gimlet / Awl", "stroke_count": 16, "mnemonic": "Metal and a vertebra; awl." },
    { "character": "錆", "on_yomi": "SEI", "kun_yomi": "sabi", "meaning": "Rust", "stroke_count": 16, "mnemonic": "Metal and a blue; rust." },
    { "character": "錫", "on_yomi": "SEKI", "kun_yomi": "none", "meaning": "Tin / Pewter", "stroke_count": 16, "mnemonic": "Metal and a easy; tin." },
    { "character": "錨", "on_yomi": "BYOU", "kun_yomi": "ikari", "meaning": "Anchor", "stroke_count": 16, "mnemonic": "Metal and a seedling; anchor." },
    { "character": "鍋", "on_yomi": "KA", "kun_yomi": "nabe", "meaning": "Pot / Pan", "stroke_count": 17, "mnemonic": "Metal and a nest; pot." },
    { "character": "鍬", "on_yomi": "SHUU", "kun_yomi": "kuwa", "meaning": "Hoe / Spade", "stroke_count": 17, "mnemonic": "Metal and a autumn; hoe." },
    { "character": "鍼", "on_yomi": "SHIN", "kun_yomi": "hari", "meaning": "Needle / Acupuncture", "stroke_count": 17, "mnemonic": "Metal and a salty; needle." },
    { "character": "鎚", "on_yomi": "TSUI", "kun_yomi": "tsuchi", "meaning": "Hammer / Mallet", "stroke_count": 17, "mnemonic": "Metal and a vertebra; hammer." },
    { "character": "鎗", "on_yomi": "SOU", "kun_yomi": "yari", "meaning": "Spear", "stroke_count": 18, "mnemonic": "Metal and a warehouse; spear." },
    { "character": "鎔", "on_yomi": "YOU", "kun_yomi": "none", "meaning": "Melt / Fuse", "stroke_count": 18, "mnemonic": "Metal and a contain; melt." },
    { "character": "鏃", "on_yomi": "ZOKU", "kun_yomi": "yajiiri", "meaning": "Arrowhead", "stroke_count": 18, "mnemonic": "Metal and a family; arrowhead." },
    { "character": "鏡", "on_yomi": "KYOU", "kun_yomi": "kagami", "meaning": "Mirror", "stroke_count": 19, "mnemonic": "Metal and a stand; mirror." },
    { "character": "鏝", "on_yomi": "MAN", "kun_yomi": "kote", "meaning": "Trowel", "stroke_count": 19, "mnemonic": "Metal and a graceful; trowel." },
    { "character": "鐙", "on_yomi": "TOU", "kun_yomi": "abumi", "meaning": "Stirrup", "stroke_count": 20, "mnemonic": "Metal and a lamp; stirrup." },
    { "character": "鐸", "on_yomi": "TAKU", "kun_yomi": "none", "meaning": "Large bell", "stroke_count": 21, "mnemonic": "Metal and a translate; large bell." },
    { "character": "鑓", "on_yomi": "SOU", "kun_yomi": "yari", "meaning": "Spear / Lance", "stroke_count": 23, "mnemonic": "Metal and a warehouse; spear." },
    { "character": "鑢", "on_yomi": "RYO", "kun_yomi": "yasuri", "meaning": "File / Rasp", "stroke_count": 24, "mnemonic": "Metal and a consider; file." },
    { "character": "飴", "on_yomi": "I", "kun_yomi": "ame", "meaning": "Candy / Syrup", "stroke_count": 13, "mnemonic": "Food and a platform; candy." },
    { "character": "飲", "on_yomi": "IN", "kun_yomi": "no-mu", "meaning": "Drink", "stroke_count": 12, "mnemonic": "Food and a lack; drink." },
    { "character": "飾", "on_yomi": "SHOKU", "kun_yomi": "kaza-ru", "meaning": "Decorate / Ornament", "stroke_count": 13, "mnemonic": "Food and a towel; decorate." },
    { "character": "餃", "on_yomi": "GYOU", "kun_yomi": "none", "meaning": "Dumpling / Gyoza", "stroke_count": 15, "mnemonic": "Food and a mix; dumpling." },
    { "character": "餐", "on_yomi": "SAN", "kun_yomi": "none", "meaning": "Meal / Dinner", "stroke_count": 16, "mnemonic": "Food and a again; meal." },
    { "character": "餡", "on_yomi": "AN", "kun_yomi": "none", "meaning": "Bean paste / Filling", "stroke_count": 17, "mnemonic": "Food and a relax; bean paste." },
    { "character": "饅", "on_yomi": "MAN", "kun_yomi": "none", "meaning": "Bun / Steamed bun", "stroke_count": 20, "mnemonic": "Food and a graceful; bun." },
    { "character": "饉", "on_yomi": "KIN", "kun_yomi": "none", "meaning": "Famine / Crop failure", "stroke_count": 17, "mnemonic": "Food and a all; famine." },
    { "character": "饋", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Present food / Offer", "stroke_count": 20, "mnemonic": "Food and a precious; present." },
    { "character": "袴", "on_yomi": "KO", "kun_yomi": "hakama", "meaning": "Hakama / Trousers", "stroke_count": 11, "mnemonic": "Clothing and a fit; hakama." },
    { "character": "袷", "on_yomi": "KOU", "kun_yomi": "awase", "meaning": "Lined kimono", "stroke_count": 11, "mnemonic": "Clothing and a fit; lined kimono." },
    { "character": "袱", "on_yomi": "FUKU", "kun_yomi": "none", "meaning": "Cloth wrapper", "stroke_count": 11, "mnemonic": "Clothing and a dog; wrapper." },
    { "character": "袿", "on_yomi": "KEI", "kun_yomi": "none", "meaning": "Kimono / Robe", "stroke_count": 11, "mnemonic": "Clothing and a circle; kimono." },
    { "character": "裟", "on_yomi": "SA", "kun_yomi": "none", "meaning": "Buddhist surplice", "stroke_count": 13, "mnemonic": "Clothing and a few; surplice." },
    { "character": "裳", "on_yomi": "SHOU", "kun_yomi": "mo", "meaning": "Skirt / Lower garment", "stroke_count": 14, "mnemonic": "Clothing and a still; skirt." },
    { "character": "裴", "on_yomi": "HAI", "kun_yomi": "none", "meaning": "Long robe", "stroke_count": 14, "mnemonic": "Clothing and a not; long robe." },
    { "character": "裨", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Help / Benefit", "stroke_count": 14, "mnemonic": "Clothing and a low; help." },
    { "character": "裲", "on_yomi": "RYOU", "kun_yomi": "none", "meaning": "Sleeveless garment", "stroke_count": 14, "mnemonic": "Clothing and a both; sleeveless." },
    { "character": "褌", "on_yomi": "KON", "kun_yomi": "fundoshi", "meaning": "Loincloth", "stroke_count": 14, "mnemonic": "Clothing and a army; loincloth." },
    { "character": "褓", "on_yomi": "HOU", "kun_yomi": "none", "meaning": "Swaddling cloth", "stroke_count": 14, "mnemonic": "Clothing and a protect; swaddling." },
    { "character": "褝", "on_yomi": "DAN", "kun_yomi": "none", "meaning": "Unlined garment", "stroke_count": 14, "mnemonic": "Clothing and a single; unlined." },
    { "character": "褞", "on_yomi": "ON", "kun_yomi": "none", "meaning": "Warm clothing", "stroke_count": 15, "mnemonic": "Clothing and a warm; warm clothing." },
    { "character": "褥", "on_yomi": "JOKU", "kun_yomi": "none", "meaning": "Cushion / Mattress", "stroke_count": 15, "mnemonic": "Clothing and a if; cushion." },
    { "character": "褪", "on_yomi": "TAI", "kun_yomi": "a-seru", "meaning": "Fade / Discolor", "stroke_count": 15, "mnemonic": "Clothing and a retreat; fade." },
    { "character": "褫", "on_yomi": "CHI", "kun_yomi": "none", "meaning": "Strip / Deprive", "stroke_count": 15, "mnemonic": "Clothing and a know; strip." }
];

let added = 0;
additional63.forEach(entry => {
    if (!seenInL15.has(entry.character) && !baseline.has(entry.character) && finalL15.length < 100) {
        finalL15.push(entry);
        seenInL15.add(entry.character);
        added++;
    }
});

console.log('Added:', added);
console.log('Final L15 count:', finalL15.length);

// Save
const outputPath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l15.json');
fs.writeFileSync(outputPath, JSON.stringify(finalL15, null, 2), 'utf8');
console.log('Saved kanji_mastery_l15.json');

if (finalL15.length === 100) {
    console.log('✅ L15 COMPLETE WITH 100 KANJI!');
}
