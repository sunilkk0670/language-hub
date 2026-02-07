const fs = require('fs');
const path = require('path');

// Load baseline (L1-L16)
const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json',
    'kanji_mastery_l16.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

console.log('Generating clean L17...');
console.log('Baseline size:', baseline.size);

const finalL17 = [];
const seenInL17 = new Set();

// First, add the 35 unique Kanji from user data
const userUniqueKanji = [
    { "character": "塔", "on_yomi": "TOU", "kun_yomi": "none", "meaning": "Pagoda / Tower / Steeple", "stroke_count": 12, "mnemonic": "Earth and grass over a person; tall tower." },
    { "character": "塗", "on_yomi": "TO", "kun_yomi": "nu-ru", "meaning": "Coat / Smear / Paint", "stroke_count": 13, "mnemonic": "Water and earth used to smear/paint a wall." },
    { "character": "塙", "on_yomi": "none", "kun_yomi": "hanawa", "meaning": "Projecting plateau / Mound", "stroke_count": 13, "mnemonic": "Earth that is high and bright/shining." },
    { "character": "墨", "on_yomi": "BOKU", "kun_yomi": "sumi", "meaning": "Black ink", "stroke_count": 14, "mnemonic": "Black soot combined with earth to make ink." },
    { "character": "墳", "on_yomi": "FUN", "kun_yomi": "none", "meaning": "Burial mound / Tomb", "stroke_count": 15, "mnemonic": "Earth over a person who has passed away." },
    { "character": "魏", "on_yomi": "GI", "kun_yomi": "none", "meaning": "High / Kingdom of Wei", "stroke_count": 18, "mnemonic": "A ghost/spirit in a high building/hall." },
    { "character": "魑", "on_yomi": "CHI", "kun_yomi": "none", "meaning": "Mountain demon", "stroke_count": 21, "mnemonic": "A ghost/spirit that is leaving the forest." },
    { "character": "魁", "on_yomi": "KAI", "kun_yomi": "none", "meaning": "Pioneer / Leader / Head", "stroke_count": 14, "mnemonic": "A ghost/spirit leading a dipper/measure; head." },
    { "character": "魃", "on_yomi": "BATSU", "kun_yomi": "none", "meaning": "Drought / Drought demon", "stroke_count": 14, "mnemonic": "A ghost/spirit causing a drought/hand." },
    { "character": "魍", "on_yomi": "MOU", "kun_yomi": "none", "meaning": "Mountain spirits", "stroke_count": 18, "mnemonic": "Ghostly spirits in a net/boundary." },
    { "character": "魎", "on_yomi": "RYOU", "kun_yomi": "none", "meaning": "Mountain spirit", "stroke_count": 18, "mnemonic": "Ghostly spirit that is concurrent/double." },
    { "character": "魘", "on_yomi": "EN", "kun_yomi": "none", "meaning": "Nightmare", "stroke_count": 24, "mnemonic": "Ghostly spirit causing a covering/dream." },
    { "character": "彼", "on_yomi": "HI", "kun_yomi": "kare", "meaning": "He / Him", "stroke_count": 8, "mnemonic": "Walking a path with a skin/hide; him." },
    { "character": "波", "on_yomi": "HA", "kun_yomi": "nami", "meaning": "Wave", "stroke_count": 8, "mnemonic": "Water moving on the skin/hide of the ocean." },
    { "character": "披", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Expose / Open / Publish", "stroke_count": 8, "mnemonic": "A hand peeling back a skin/hide to expose." },
    { "character": "破", "on_yomi": "HA", "kun_yomi": "yabu-ru", "meaning": "Break / Tear / Rend", "stroke_count": 10, "mnemonic": "Stone hitting skin and breaking it." },
    { "character": "疲", "on_yomi": "HI", "kun_yomi": "tsuka-reru", "meaning": "Fatigue", "stroke_count": 10, "mnemonic": "Sickbed skin person." },
    { "character": "婆", "on_yomi": "BA", "kun_yomi": "none", "meaning": "Old woman / Grandmother", "stroke_count": 11, "mnemonic": "Wave/skin and a woman; grandmother." },
    { "character": "頗", "on_yomi": "HA", "kun_yomi": "suko-buru", "meaning": "Extremely / Greatly", "stroke_count": 14, "mnemonic": "Skin/hide and a head; extremely/greatly." },
    { "character": "皺", "on_yomi": "SHUU", "kun_yomi": "none", "meaning": "Wrinkle / Crease / Rumple", "stroke_count": 15, "mnemonic": "A grass shield over a skin/hide; wrinkles." },
    { "character": "祟", "on_yomi": "SUI", "kun_yomi": "tata-ru", "meaning": "Haunt", "stroke_count": 10, "mnemonic": "Mountain altar omen." },
    { "character": "礼", "on_yomi": "REI", "kun_yomi": "none", "meaning": "Bowing / Rite / Ritual", "stroke_count": 5, "mnemonic": "Altar and a person bowing in ritual." },
    { "character": "祖", "on_yomi": "SO", "kun_yomi": "none", "meaning": "Ancestor / Founder / Pioneer", "stroke_count": 9, "mnemonic": "An altar showing a multi-level hall; ancestors." },
    { "character": "祝", "on_yomi": "SHUKU", "kun_yomi": "iwa-u", "meaning": "Congratulate / Celebrate", "stroke_count": 9, "mnemonic": "A person under a lid at an altar; celebration." },
    { "character": "票", "on_yomi": "HYOU", "kun_yomi": "none", "meaning": "Ballot / Label / Ticket", "stroke_count": 11, "mnemonic": "Western sun over an altar; a formal label." },
    { "character": "禝", "on_yomi": "SHOKU", "kun_yomi": "none", "meaning": "God of grain", "stroke_count": 14, "mnemonic": "An altar showing grain/harvest." },
    { "character": "禦", "on_yomi": "GYO", "kun_yomi": "fuse-gu", "meaning": "Defend / Protect / Resis", "stroke_count": 18, "mnemonic": "An altar used for defense/protection." },
    { "character": "禱", "on_yomi": "TOU", "kun_yomi": "ino-ru", "meaning": "Pray", "stroke_count": 19, "mnemonic": "An altar showing a long/寿 prayer." },
    { "character": "禰", "on_yomi": "NEI", "kun_yomi": "none", "meaning": "Shrine", "stroke_count": 19, "mnemonic": "An altar showing an ancestral line." },
    { "character": "禧", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Happiness / Good luck / Joy", "stroke_count": 17, "mnemonic": "An altar showing joy/shining sun." },
    { "character": "禪", "on_yomi": "ZEN", "kun_yomi": "none", "meaning": "Zen / Meditation", "stroke_count": 17, "mnemonic": "Ancient altar showing simple truth." },
    { "character": "禮", "on_yomi": "REI", "kun_yomi": "none", "meaning": "Ritual / Manners", "stroke_count": 18, "mnemonic": "Ancient altar showing high ritual." },
    { "character": "襖", "on_yomi": "OU", "kun_yomi": "fusuma", "meaning": "Opaque sliding door / Screen", "stroke_count": 18, "mnemonic": "Clothing used as a cover/enclosure." },
    { "character": "襦", "on_yomi": "JU", "kun_yomi": "none", "meaning": "Undergarment / Bodice", "stroke_count": 19, "mnemonic": "Clothing that is thin/rainy; underlayer." },
    { "character": "襪", "on_yomi": "BATSU", "kun_yomi": "none", "meaning": "Socks / Stockings", "stroke_count": 21, "mnemonic": "Clothing used for steps/walking." },
    { "character": "襯", "on_yomi": "SHIN", "kun_yomi": "none", "meaning": "Undergarment / Lining", "stroke_count": 21, "mnemonic": "Clothing used for a intimate/parental feel." },
    { "character": "襷", "on_yomi": "none", "kun_yomi": "tasuki", "meaning": "Tasuki / Cord (for sleeves)", "stroke_count": 22, "mnemonic": "Clothing and a lift/shaping hand." },
    { "character": "裃", "on_yomi": "none", "kun_yomi": "kamishimo", "meaning": "Kamishimo / Samurai dress", "stroke_count": 12, "mnemonic": "Clothing and up/down; formal samurai suit." },
    { "character": "裄", "on_yomi": "none", "kun_yomi": "yuki", "meaning": "Sleeve length", "stroke_count": 11, "mnemonic": "Clothing and a path/row; measuring sleeves." }
];

userUniqueKanji.forEach(entry => {
    if (!baseline.has(entry.character) && !seenInL17.has(entry.character)) {
        finalL17.push(entry);
        seenInL17.add(entry.character);
    }
});

console.log('Added unique from user data:', finalL17.length);

// Now add 65 new unique N2/N1 Kanji (earth土, spirit鬼, altar示, skin皮, clothing衣 radicals)
const additional65 = [
    { "character": "坑", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Pit / Mine / Hole", "stroke_count": 7, "mnemonic": "Earth and a resist; pit." },
    { "character": "坪", "on_yomi": "TSUBO", "kun_yomi": "tsubo", "meaning": "Tsubo / Unit of area", "stroke_count": 8, "mnemonic": "Earth and a flat; tsubo." },
    { "character": "垂", "on_yomi": "SUI", "kun_yomi": "ta-reru", "meaning": "Droop / Hang / Dangle", "stroke_count": 8, "mnemonic": "Earth and a thousand; hanging." },
    { "character": "垣", "on_yomi": "EN", "kun_yomi": "kaki", "meaning": "Fence / Wall", "stroke_count": 9, "mnemonic": "Earth and a self; fence." },
    { "character": "埋", "on_yomi": "MAI", "kun_yomi": "u-meru", "meaning": "Bury / Fill up", "stroke_count": 10, "mnemonic": "Earth and a village; bury." },
    { "character": "埴", "on_yomi": "SHOKU", "kun_yomi": "none", "meaning": "Clay / Loam", "stroke_count": 11, "mnemonic": "Earth and a straight; clay." },
    { "character": "埼", "on_yomi": "none", "kun_yomi": "saki", "meaning": "Cape / Peninsula", "stroke_count": 11, "mnemonic": "Earth and a strange; cape." },
    { "character": "堀", "on_yomi": "KORI", "kun_yomi": "hori", "meaning": "Moat / Canal / Ditch", "stroke_count": 11, "mnemonic": "Earth and a bend; moat." },
    { "character": "堆", "on_yomi": "TAI", "kun_yomi": "none", "meaning": "Pile up / Heap", "stroke_count": 11, "mnemonic": "Earth and a bird; pile." },
    { "character": "堕", "on_yomi": "DA", "kun_yomi": "none", "meaning": "Degenerate / Lazy / Fall", "stroke_count": 12, "mnemonic": "Earth and a left; fall." },
    { "character": "堤", "on_yomi": "TEI", "kun_yomi": "tsutsumi", "meaning": "Dike / Bank / Embankment", "stroke_count": 12, "mnemonic": "Earth and a yes; dike." },
    { "character": "堰", "on_yomi": "EN", "kun_yomi": "seki", "meaning": "Dam / Weir", "stroke_count": 12, "mnemonic": "Earth and a gate; dam." },
    { "character": "塀", "on_yomi": "HEI", "kun_yomi": "none", "meaning": "Fence / Wall", "stroke_count": 12, "mnemonic": "Earth and a screen; fence." },
    { "character": "塁", "on_yomi": "RUI", "kun_yomi": "none", "meaning": "Base / Fort / Rampart", "stroke_count": 12, "mnemonic": "Earth and a rice field; fort." },
    { "character": "塚", "on_yomi": "CHOU", "kun_yomi": "tsuka", "meaning": "Mound / Hillock", "stroke_count": 12, "mnemonic": "Earth and a bean; mound." },
    { "character": "塵", "on_yomi": "JIN", "kun_yomi": "chiri", "meaning": "Dust / Dirt / Trash", "stroke_count": 14, "mnemonic": "Earth and a deer; dust." },
    { "character": "塹", "on_yomi": "ZAN", "kun_yomi": "none", "meaning": "Trench / Moat / Ditch", "stroke_count": 14, "mnemonic": "Earth and a cut; trench." },
    { "character": "境", "on_yomi": "KYOU", "kun_yomi": "sakai", "meaning": "Boundary / Border / Region", "stroke_count": 14, "mnemonic": "Earth and a sound; boundary." },
    { "character": "墟", "on_yomi": "KYO", "kun_yomi": "none", "meaning": "Ruins / Remains", "stroke_count": 14, "mnemonic": "Earth and a tiger; ruins." },
    { "character": "墾", "on_yomi": "KON", "kun_yomi": "none", "meaning": "Cultivate / Reclaim", "stroke_count": 16, "mnemonic": "Earth and a difficult; cultivate." },
    { "character": "壁", "on_yomi": "HEKI", "kun_yomi": "kabe", "meaning": "Wall / Partition", "stroke_count": 16, "mnemonic": "Earth and a avoid; wall." },
    { "character": "壇", "on_yomi": "DAN", "kun_yomi": "none", "meaning": "Podium / Altar", "stroke_count": 16, "mnemonic": "Earth and a special; altar." },
    { "character": "壓", "on_yomi": "ATSU", "kun_yomi": "none", "meaning": "Pressure / Oppress", "stroke_count": 17, "mnemonic": "Earth and a cover; pressure." },
    { "character": "壘", "on_yomi": "RUI", "kun_yomi": "none", "meaning": "Rampart / Base", "stroke_count": 18, "mnemonic": "Earth and a accumulate; rampart." },
    { "character": "壙", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Tomb / Grave", "stroke_count": 18, "mnemonic": "Earth and a wide; tomb." },
    { "character": "壜", "on_yomi": "TAN", "kun_yomi": "none", "meaning": "Bottle / Jar", "stroke_count": 19, "mnemonic": "Earth and a single; jar." },
    { "character": "壟", "on_yomi": "ROU", "kun_yomi": "none", "meaning": "Mound / Ridge", "stroke_count": 19, "mnemonic": "Earth and a dragon; mound." },
    { "character": "壤", "on_yomi": "JOU", "kun_yomi": "none", "meaning": "Soil / Loam", "stroke_count": 20, "mnemonic": "Earth and a sound; soil." },
    { "character": "魄", "on_yomi": "HAKU", "kun_yomi": "none", "meaning": "Soul / Spirit / Vigor", "stroke_count": 14, "mnemonic": "White ghost; spirit." },
    { "character": "魅", "on_yomi": "MI", "kun_yomi": "none", "meaning": "Fascinate / Charm", "stroke_count": 15, "mnemonic": "Ghost and a not; charm." },
    { "character": "魍", "on_yomi": "MOU", "kun_yomi": "none", "meaning": "Spirits / Demons", "stroke_count": 18, "mnemonic": "Ghost and a net; spirits." },
    { "character": "魎", "on_yomi": "RYOU", "kun_yomi": "none", "meaning": "Demon / Spirit", "stroke_count": 18, "mnemonic": "Ghost and a both; demon." },
    { "character": "魑", "on_yomi": "CHI", "kun_yomi": "none", "meaning": "Demon / Monster", "stroke_count": 21, "mnemonic": "Ghost and a leave; monster." },
    { "character": "魘", "on_yomi": "EN", "kun_yomi": "none", "meaning": "Nightmare / Suffocate", "stroke_count": 24, "mnemonic": "Ghost and a cover; nightmare." },
    { "character": "祀", "on_yomi": "SHI", "kun_yomi": "matsu-ru", "meaning": "Enshrine / Worship", "stroke_count": 7, "mnemonic": "Altar and a self; enshrine." },
    { "character": "祁", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Numerous / Abundant", "stroke_count": 8, "mnemonic": "Altar and a axe; abundant." },
    { "character": "祇", "on_yomi": "GI", "kun_yomi": "none", "meaning": "Earth god / Shinto", "stroke_count": 8, "mnemonic": "Altar and a self; earth god." },
    { "character": "祐", "on_yomi": "YUU", "kun_yomi": "none", "meaning": "Help / Protect / Bless", "stroke_count": 9, "mnemonic": "Altar and a right; bless." },
    { "character": "祓", "on_yomi": "FUTSU", "kun_yomi": "hara-u", "meaning": "Purify / Exorcise", "stroke_count": 9, "mnemonic": "Altar and a dog; purify." },
    { "character": "祕", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Secret / Mystery", "stroke_count": 10, "mnemonic": "Altar and a necessary; secret." },
    { "character": "祠", "on_yomi": "SHI", "kun_yomi": "hokora", "meaning": "Shrine / Mausoleum", "stroke_count": 10, "mnemonic": "Altar and a director; shrine." },
    { "character": "祟", "on_yomi": "SUI", "kun_yomi": "tata-ru", "meaning": "Curse / Haunt", "stroke_count": 10, "mnemonic": "Mountain and altar; curse." },
    { "character": "祢", "on_yomi": "NEI", "kun_yomi": "none", "meaning": "Ancestral shrine", "stroke_count": 10, "mnemonic": "Altar and a you; ancestral." },
    { "character": "祺", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Auspicious / Lucky", "stroke_count": 12, "mnemonic": "Altar and a strange; lucky." },
    { "character": "祿", "on_yomi": "ROKU", "kun_yomi": "none", "meaning": "Salary / Fief", "stroke_count": 13, "mnemonic": "Altar and a valley; salary." },
    { "character": "禀", "on_yomi": "HIN", "kun_yomi": "none", "meaning": "Endowment / Report", "stroke_count": 13, "mnemonic": "Altar and a rice; endowment." },
    { "character": "禊", "on_yomi": "KEI", "kun_yomi": "none", "meaning": "Purification / Ablution", "stroke_count": 13, "mnemonic": "Altar and a contract; purification." },
    { "character": "禎", "on_yomi": "TEI", "kun_yomi": "none", "meaning": "Lucky / Auspicious", "stroke_count": 13, "mnemonic": "Altar and a correct; lucky." },
    { "character": "禔", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Happiness / Blessing", "stroke_count": 14, "mnemonic": "Altar and a is; blessing." },
    { "character": "禕", "on_yomi": "I", "kun_yomi": "none", "meaning": "Rare / Beautiful", "stroke_count": 14, "mnemonic": "Altar and a rare; beautiful." },
    { "character": "禖", "on_yomi": "BAI", "kun_yomi": "none", "meaning": "Pray for children", "stroke_count": 14, "mnemonic": "Altar and a plum; pray." },
    { "character": "禛", "on_yomi": "SHIN", "kun_yomi": "none", "meaning": "Sincerity / Truth", "stroke_count": 14, "mnemonic": "Altar and a true; sincerity." },
    { "character": "禡", "on_yomi": "BA", "kun_yomi": "none", "meaning": "Military sacrifice", "stroke_count": 14, "mnemonic": "Altar and a horse; sacrifice." },
    { "character": "禢", "on_yomi": "TAI", "kun_yomi": "none", "meaning": "Pray / Blessing", "stroke_count": 15, "mnemonic": "Altar and a belt; pray." },
    { "character": "禤", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Surname / Blessing", "stroke_count": 15, "mnemonic": "Altar and a display; blessing." },
    { "character": "禥", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Pray / Blessing", "stroke_count": 15, "mnemonic": "Altar and a strange; pray." },
    { "character": "禦", "on_yomi": "GYO", "kun_yomi": "none", "meaning": "Defend / Protect", "stroke_count": 18, "mnemonic": "Altar and a defend; protect." },
    { "character": "禨", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Auspicious / Lucky", "stroke_count": 18, "mnemonic": "Altar and a machine; lucky." },
    { "character": "禩", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Sacrifice / Offering", "stroke_count": 18, "mnemonic": "Altar and a heir; sacrifice." },
    { "character": "禪", "on_yomi": "ZEN", "kun_yomi": "none", "meaning": "Zen / Meditation", "stroke_count": 17, "mnemonic": "Altar and a simple; zen." },
    { "character": "禫", "on_yomi": "TAN", "kun_yomi": "none", "meaning": "End of mourning", "stroke_count": 19, "mnemonic": "Altar and a single; mourning." },
    { "character": "禬", "on_yomi": "GUI", "kun_yomi": "none", "meaning": "Exorcism / Purify", "stroke_count": 19, "mnemonic": "Altar and a return; exorcism." },
    { "character": "禭", "on_yomi": "SUI", "kun_yomi": "none", "meaning": "Burial clothes", "stroke_count": 19, "mnemonic": "Altar and a follow; burial." },
    { "character": "禮", "on_yomi": "REI", "kun_yomi": "none", "meaning": "Courtesy / Rite", "stroke_count": 18, "mnemonic": "Altar and a ritual; courtesy." },
    { "character": "禰", "on_yomi": "NEI", "kun_yomi": "none", "meaning": "Ancestral tablet", "stroke_count": 19, "mnemonic": "Altar and a you; ancestral." }
];

let added = 0;
additional65.forEach(entry => {
    if (!seenInL17.has(entry.character) && !baseline.has(entry.character) && finalL17.length < 100) {
        finalL17.push(entry);
        seenInL17.add(entry.character);
        added++;
    }
});

console.log('Added:', added);
console.log('Final L17 count:', finalL17.length);

// Save
const outputPath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l17.json');
fs.writeFileSync(outputPath, JSON.stringify(finalL17, null, 2), 'utf8');
console.log('Saved kanji_mastery_l17.json');

if (finalL17.length === 100) {
    console.log('✅ L17 COMPLETE WITH 100 KANJI!');
}
