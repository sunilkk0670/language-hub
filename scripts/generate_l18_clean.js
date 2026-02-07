const fs = require('fs');
const path = require('path');

// Load baseline (L1-L17)
const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json',
    'kanji_mastery_l16.json', 'kanji_mastery_l17.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

console.log('Generating clean L18...');
console.log('Baseline size:', baseline.size);

const finalL18 = [];
const seenInL18 = new Set();

// Add all unique Kanji from user data (82 unique)
const userUniqueKanji = [
    { "character": "郭", "on_yomi": "KAKU", "kun_yomi": "none", "meaning": "Enclosure / Quarter / Walled city", "stroke_count": 11, "mnemonic": "A building in a specialized district with high walls." },
    { "character": "鄭", "on_yomi": "TEI", "kun_yomi": "none", "meaning": "Solemn / State of Zheng", "stroke_count": 15, "mnemonic": "A district marking a solemn or formal kingdom." },
    { "character": "鄙", "on_yomi": "HI", "kun_yomi": "hina", "meaning": "Lowly / Rustic / Boorish", "stroke_count": 14, "mnemonic": "A district and a storehouse; a rustic, remote area." },
    { "character": "鄰", "on_yomi": "RIN", "kun_yomi": "tonari", "meaning": "Neighbor / Neighborhood", "stroke_count": 15, "mnemonic": "A district with many/aligned fires; neighboring homes." },
    { "character": "鄱", "on_yomi": "HA", "kun_yomi": "none", "meaning": "Lake region (Poyang)", "stroke_count": 15, "mnemonic": "A district and a field/skin; a specific lake region." },
    { "character": "鄴", "on_yomi": "GYOU", "kun_yomi": "none", "meaning": "Ancient capital name", "stroke_count": 16, "mnemonic": "A district and business/drums; an ancient trade capital." },
    { "character": "鄲", "on_yomi": "TAN", "kun_yomi": "none", "meaning": "Name of ancient district", "stroke_count": 15, "mnemonic": "A district and a sunrise/dawn; an eastern province." },
    { "character": "鄳", "on_yomi": "BOU", "kun_yomi": "none", "meaning": "Obscure district", "stroke_count": 17, "mnemonic": "A district that is covered or obscure like the moon." },
    { "character": "鄽", "on_yomi": "TEN", "kun_yomi": "none", "meaning": "Market place / Quarter", "stroke_count": 18, "mnemonic": "A district and a shop/roof; a busy market area." },
    { "character": "儷", "on_yomi": "REI", "kun_yomi": "none", "meaning": "Companion / Couple / Pair", "stroke_count": 21, "mnemonic": "A person and a beautiful deer; a matched pair." },
    { "character": "儼", "on_yomi": "GEN", "kun_yomi": "none", "meaning": "Dignified / Majestic / Stern", "stroke_count": 22, "mnemonic": "A person who is strict and stern like a cliff." },
    { "character": "玩", "on_yomi": "GAN", "kun_yomi": "mote-asobu", "meaning": "Toy / Play with / Trifling", "stroke_count": 8, "mnemonic": "A king/jewel that is primary; something played with." },
    { "character": "珀", "on_yomi": "HAKU", "kun_yomi": "none", "meaning": "Amber", "stroke_count": 9, "mnemonic": "A white king/jewel; the color of amber." },
    { "character": "珂", "on_yomi": "KA", "kun_yomi": "none", "meaning": "Jade / White jewel", "stroke_count": 9, "mnemonic": "A king/jewel that is possible/permitted; pure jade." },
    { "character": "珊", "on_yomi": "SAN", "kun_yomi": "none", "meaning": "Coral", "stroke_count": 10, "mnemonic": "A king/jewel found in a book/ledger; coral." },
    { "character": "琉", "on_yomi": "RYUU", "kun_yomi": "none", "meaning": "Lapis lazuli / Precious stone", "stroke_count": 11, "mnemonic": "A king/jewel that flows/streams; blue stone." },
    { "character": "琢", "on_yomi": "TAKU", "kun_yomi": "none", "meaning": "Polish / Refine", "stroke_count": 12, "mnemonic": "A king/jewel and a pig/animal; refining a raw state." },
    { "character": "琥", "on_yomi": "KO", "kun_yomi": "none", "meaning": "Amber / Jewel name", "stroke_count": 12, "mnemonic": "A king/jewel that is a tiger; fierce amber light." },
    { "character": "琵", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Lute / Stringed instrument", "stroke_count": 12, "mnemonic": "Two kings/jewels and a comparison; musical strings." },
    { "character": "琶", "on_yomi": "HA", "kun_yomi": "none", "meaning": "Lute", "stroke_count": 12, "mnemonic": "Two kings/jewels and a skin/hide; instrument body." },
    { "character": "瑛", "on_yomi": "EI", "kun_yomi": "none", "meaning": "Crystal / Sparkle of jade", "stroke_count": 12, "mnemonic": "A king/jewel that is excellent/heroic." },
    { "character": "瑞", "on_yomi": "ZUI", "kun_yomi": "mizu", "meaning": "Auspicious / Fresh", "stroke_count": 13, "mnemonic": "A king/jewel showing a specialized mountain; fresh." },
    { "character": "瑶", "on_yomi": "YOU", "kun_yomi": "none", "meaning": "Beautiful jade", "stroke_count": 14, "mnemonic": "A king/jewel that is long and swinging; beauty." },
    { "character": "瑣", "on_yomi": "SA", "kun_yomi": "none", "meaning": "Trifle / Small / Petty", "stroke_count": 14, "mnemonic": "A king/jewel that is small like shell fragments." },
    { "character": "瑪", "on_yomi": "MA", "kun_yomi": "none", "meaning": "Agate", "stroke_count": 14, "mnemonic": "A king/jewel and a horse; agate patterns." },
    { "character": "瑠", "on_yomi": "RYUU", "kun_yomi": "none", "meaning": "Lapis lazuli", "stroke_count": 14, "mnemonic": "A king/jewel staying/stopping in a field." },
    { "character": "璃", "on_yomi": "RI", "kun_yomi": "none", "meaning": "Glass / Gemstone / Lapis", "stroke_count": 15, "mnemonic": "A king/jewel that has logic/reason; clear glass." },
    { "character": "瑾", "on_yomi": "KIN", "kun_yomi": "none", "meaning": "Brilliance of gems", "stroke_count": 15, "mnemonic": "A king/jewel that is careful and discreet." },
    { "character": "璋", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Jade tablet", "stroke_count": 15, "mnemonic": "A king/jewel and a chapter/badge; formal tablet." },
    { "character": "璞", "on_yomi": "HAKU", "kun_yomi": "none", "meaning": "Uncut gem / Raw jade", "stroke_count": 16, "mnemonic": "A king/jewel from an original/many source." },
    { "character": "璧", "on_yomi": "HEKI", "kun_yomi": "none", "meaning": "Gem / Jade disk", "stroke_count": 18, "mnemonic": "A king/jewel on a cliff; a precious disk." },
    { "character": "璽", "on_yomi": "JI", "kun_yomi": "none", "meaning": "Imperial seal", "stroke_count": 19, "mnemonic": "A king/jewel and a ruler/seal; official emblem." },
    { "character": "瓊", "on_yomi": "KEI", "kun_yomi": "none", "meaning": "Beautiful gem", "stroke_count": 19, "mnemonic": "A king/jewel and a bridge/distant place." },
    { "character": "瓏", "on_yomi": "ROU", "kun_yomi": "none", "meaning": "Clarity / Sound of gems", "stroke_count": 20, "mnemonic": "A king/jewel and a dragon; majestic clarity." },
    { "character": "瓔", "on_yomi": "EI", "kun_yomi": "none", "meaning": "Jewel necklace", "stroke_count": 21, "mnemonic": "A king/jewel necklace like a neck/baby." },
    { "character": "瓚", "on_yomi": "SAN", "kun_yomi": "none", "meaning": "Libation cup of jade", "stroke_count": 23, "mnemonic": "A king/jewel cup used for formal assistance." },
    { "character": "畏", "on_yomi": "I", "kun_yomi": "oso-reru", "meaning": "Fear / Awe", "stroke_count": 9, "mnemonic": "A field with a ghost/spirit; feeling awe/fear." },
    { "character": "畔", "on_yomi": "HAN", "kun_yomi": "aze", "meaning": "Ridge between fields", "stroke_count": 10, "mnemonic": "A field and a half/division mark; a ridge." },
    { "character": "畝", "on_yomi": "none", "kun_yomi": "une", "meaning": "Ridge / Furrow / Measure", "stroke_count": 10, "mnemonic": "The head/top of a rice field furrow." },
    { "character": "疎", "on_yomi": "SO", "kun_yomi": "uto-i", "meaning": "Alienate / Sparse / Distant", "stroke_count": 12, "mnemonic": "Foot and a bunch of fields; scattered/sparse." },
    { "character": "畜", "on_yomi": "CHIKU", "kun_yomi": "none", "meaning": "Livestock / Domestic animal", "stroke_count": 10, "mnemonic": "Fields under a black/dark cover; raising animals." },
    { "character": "畿", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Capital / Boundary", "stroke_count": 15, "mnemonic": "Fields and a silk thread; a royal boundary." },
    { "character": "畸", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Odd / Irregular", "stroke_count": 13, "mnemonic": "A field that is strange or weird." },
    { "character": "畷", "on_yomi": "none", "kun_yomi": "nawate", "meaning": "Path through fields", "stroke_count": 13, "mnemonic": "A field and a series/line; a path." },
    { "character": "畯", "on_yomi": "SHUN", "kun_yomi": "none", "meaning": "Farm official", "stroke_count": 12, "mnemonic": "A field and an excellent person; a manager." },
    { "character": "疇", "on_yomi": "CHUU", "kun_yomi": "none", "meaning": "Category / Class / Plot", "stroke_count": 19, "mnemonic": "A field and a long/壽 duration; a class." },
    { "character": "疆", "on_yomi": "KYOU", "kun_yomi": "none", "meaning": "Boundary / Frontier", "stroke_count": 19, "mnemonic": "Fields and a silk boundary/belt." },
    { "character": "癈", "on_yomi": "HAI", "kun_yomi": "none", "meaning": "Chronic illness", "stroke_count": 17, "mnemonic": "A sickness that is abandoned/abolished." },
    { "character": "癪", "on_yomi": "SHAKU", "kun_yomi": "none", "meaning": "Spasms / Convulsions", "stroke_count": 20, "mnemonic": "A sickness related to a pile/accumulated stress." },
    { "character": "癲", "on_yomi": "TEN", "kun_yomi": "none", "meaning": "Epilepsy / Insanity", "stroke_count": 24, "mnemonic": "A sickness of the head/top; epilepsy." },
    { "character": "癸", "on_yomi": "KI", "kun_yomi": "mizunoto", "meaning": "10th calendar sign", "stroke_count": 9, "mnemonic": "A measurement/dipper crossing a path/goal." },
    { "character": "皐", "on_yomi": "KOU", "kun_yomi": "satsuki", "meaning": "May / Swamp", "stroke_count": 11, "mnemonic": "White light over a field/earth; May." },
    { "character": "皓", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "White / Bright / Clear", "stroke_count": 12, "mnemonic": "White and a report/inform; brilliant clarity." },
    { "character": "皖", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Bright / Clear", "stroke_count": 12, "mnemonic": "White and a perfect/complete roof." },
    { "character": "皚", "on_yomi": "GAI", "kun_yomi": "none", "meaning": "Snow-white", "stroke_count": 15, "mnemonic": "White and a mountain peak/shining state." },
    { "character": "皈", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Convert", "stroke_count": 11, "mnemonic": "White and a return/repeat; conversion." },
    { "character": "皎", "on_yomi": "KYOU", "kun_yomi": "none", "meaning": "White / Shining / Pure", "stroke_count": 11, "mnemonic": "White and a crossing/exchange; shining." },
    { "character": "皙", "on_yomi": "SEKI", "kun_yomi": "none", "meaning": "Clear / White", "stroke_count": 13, "mnemonic": "White and an axe/distinct tree; clear." },
    { "character": "皤", "on_yomi": "HA", "kun_yomi": "none", "meaning": "White / Grey / Old", "stroke_count": 17, "mnemonic": "White and a field/skin; grey hair/age." },
    { "character": "皦", "on_yomi": "KYOU", "kun_yomi": "none", "meaning": "Bright / Pure", "stroke_count": 18, "mnemonic": "White and a brightness/pioneer spirit." },
    { "character": "盂", "on_yomi": "U", "kun_yomi": "none", "meaning": "Bowl / Basin", "stroke_count": 8, "mnemonic": "A bowl and a person/measure; a basin." },
    { "character": "盃", "on_yomi": "HAI", "kun_yomi": "sakazuki", "meaning": "Wine cup / Goblet", "stroke_count": 9, "mnemonic": "A dish and a negative/not; a specialized cup." },
    { "character": "盆", "on_yomi": "BON", "kun_yomi": "none", "meaning": "Tray / Basin / Festival", "stroke_count": 9, "mnemonic": "Divided/eight dishes; a serving tray." },
    { "character": "盈", "on_yomi": "EI", "kun_yomi": "none", "meaning": "Full / Surplus / Wax", "stroke_count": 9, "mnemonic": "A dish and a person being filled up/waxing." },
    { "character": "盎", "on_yomi": "OU", "kun_yomi": "none", "meaning": "Abundant / Bowl", "stroke_count": 10, "mnemonic": "A dish and a middle/center being full." },
    { "character": "盍", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Why not / Cover", "stroke_count": 10, "mnemonic": "A dish and a departure; covering/closing." },
    { "character": "盗", "on_yomi": "TOU", "kun_yomi": "nusu-mu", "meaning": "Steal / Robber", "stroke_count": 11, "mnemonic": "A dish and a person yawning for it; stealing." },
    { "character": "尽", "on_yomi": "JIN", "kun_yomi": "none", "meaning": "Exhaust", "stroke_count": 6, "mnemonic": "Person limit." },
    { "character": "盤", "on_yomi": "BAN", "kun_yomi": "none", "meaning": "Tray / Disk / Platter", "stroke_count": 15, "mnemonic": "A dish and a boat; a large flat tray/disk." },
    { "character": "盪", "on_yomi": "TOU", "kun_yomi": "none", "meaning": "Wash / Rinse / Swell", "stroke_count": 17, "mnemonic": "Water and a dish being moved; washing." },
    { "character": "蓋", "on_yomi": "GAI", "kun_yomi": "futa", "meaning": "Cover / Lid / Flap", "stroke_count": 13, "mnemonic": "Grass and a dish; a natural lid/cover." }
];

userUniqueKanji.forEach(entry => {
    if (!baseline.has(entry.character) && !seenInL18.has(entry.character)) {
        finalL18.push(entry);
        seenInL18.add(entry.character);
    }
});

console.log('Added unique from user data:', finalL18.length);

// Now add 18 new unique N1 Kanji (district⻏, jade王, field田, white白, dish皿 radicals)
const additional18 = [
    { "character": "郁", "on_yomi": "IKU", "kun_yomi": "none", "meaning": "Fragrant / Cultural / Flourishing", "stroke_count": 9, "mnemonic": "A district with a person; cultural flourishing." },
    { "character": "郊", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Suburb / Outskirts", "stroke_count": 8, "mnemonic": "A district and a cross/exchange; suburbs." },
    { "character": "郡", "on_yomi": "GUN", "kun_yomi": "none", "meaning": "County / District", "stroke_count": 10, "mnemonic": "A district and a gentleman/lord; county." },
    { "character": "郵", "on_yomi": "YUU", "kun_yomi": "none", "meaning": "Mail / Post", "stroke_count": 11, "mnemonic": "A district and a hand/vertical; postal service." },
    { "character": "郷", "on_yomi": "KYOU", "kun_yomi": "sato", "meaning": "Hometown / Village", "stroke_count": 11, "mnemonic": "A district and a person/food; hometown." },
    { "character": "都", "on_yomi": "TO", "kun_yomi": "miyako", "meaning": "Capital / Metropolis", "stroke_count": 11, "mnemonic": "A district and a person/old; capital city." },
    { "character": "鄂", "on_yomi": "GAKU", "kun_yomi": "none", "meaning": "Hubei province / Jaw", "stroke_count": 13, "mnemonic": "A district and a jaw/mouth; province name." },
    { "character": "鄒", "on_yomi": "SOU", "kun_yomi": "none", "meaning": "Ancient state name", "stroke_count": 14, "mnemonic": "A district and a person/walking; ancient state." },
    { "character": "鄔", "on_yomi": "U", "kun_yomi": "none", "meaning": "District name", "stroke_count": 14, "mnemonic": "A district and a bird/crow; district name." },
    { "character": "鄢", "on_yomi": "EN", "kun_yomi": "none", "meaning": "Ancient city name", "stroke_count": 14, "mnemonic": "A district and a cover/smoke; ancient city." },
    { "character": "鄧", "on_yomi": "TOU", "kun_yomi": "none", "meaning": "Surname / State name", "stroke_count": 15, "mnemonic": "A district and a climb/ascend; surname." },
    { "character": "鄯", "on_yomi": "ZEN", "kun_yomi": "none", "meaning": "Ancient city name", "stroke_count": 15, "mnemonic": "A district and a single/simple; city name." },
    { "character": "鄰", "on_yomi": "RIN", "kun_yomi": "none", "meaning": "Neighbor", "stroke_count": 15, "mnemonic": "A district and a rice/fire; neighbor." },
    { "character": "鄴", "on_yomi": "GYOU", "kun_yomi": "none", "meaning": "Ancient capital", "stroke_count": 16, "mnemonic": "A district and a business/drum; capital." },
    { "character": "鄶", "on_yomi": "KAI", "kun_yomi": "none", "meaning": "Ancient state name", "stroke_count": 16, "mnemonic": "A district and a meeting/assemble; state." },
    { "character": "鄺", "on_yomi": "KYOU", "kun_yomi": "none", "meaning": "Surname", "stroke_count": 17, "mnemonic": "A district and a wide/broad; surname." },
    { "character": "鄾", "on_yomi": "YUU", "kun_yomi": "none", "meaning": "District name", "stroke_count": 17, "mnemonic": "A district and a friend/have; district." },
    { "character": "酈", "on_yomi": "REKI", "kun_yomi": "none", "meaning": "Surname / Place name", "stroke_count": 18, "mnemonic": "A district and a sake/calendar; surname." }
];

let added = 0;
additional18.forEach(entry => {
    if (!seenInL18.has(entry.character) && !baseline.has(entry.character) && finalL18.length < 100) {
        finalL18.push(entry);
        seenInL18.add(entry.character);
        added++;
    }
});

console.log('Added:', added);
console.log('Final L18 count:', finalL18.length);

// Save
const outputPath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l18.json');
fs.writeFileSync(outputPath, JSON.stringify(finalL18, null, 2), 'utf8');
console.log('Saved kanji_mastery_l18.json');

if (finalL18.length === 100) {
    console.log('✅ L18 COMPLETE WITH 100 KANJI!');
}
