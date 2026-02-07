const fs = require('fs');
const path = require('path');

// Full L17 raw data from user
const l17Raw = [
    { "character": "塊", "on_yomi": "KAI", "kun_yomi": "katamari", "meaning": "Mass / Lump / Clod", "stroke_count": 13, "mnemonic": "Earth shaped into a spirit/soul; a lump." },
    { "character": "塑", "on_yomi": "SO", "kun_yomi": "none", "meaning": "Molding / Model", "stroke_count": 13, "mnemonic": "Earth and the moon; moon-shape molding." },
    { "character": "塔", "on_yomi": "TOU", "kun_yomi": "none", "meaning": "Pagoda / Tower / Steeple", "stroke_count": 12, "mnemonic": "Earth and grass over a person; tall tower." },
    { "character": "塗", "on_yomi": "TO", "kun_yomi": "nu-ru", "meaning": "Coat / Smear / Paint", "stroke_count": 13, "mnemonic": "Water and earth used to smear/paint a wall." },
    { "character": "塙", "on_yomi": "none", "kun_yomi": "hanawa", "meaning": "Projecting plateau / Mound", "stroke_count": 13, "mnemonic": "Earth that is high and bright/shining." },
    { "character": "墨", "on_yomi": "BOKU", "kun_yomi": "sumi", "meaning": "Black ink", "stroke_count": 14, "mnemonic": "Black soot combined with earth to make ink." },
    { "character": "墳", "on_yomi": "FUN", "kun_yomi": "none", "meaning": "Burial mound / Tomb", "stroke_count": 15, "mnemonic": "Earth over a person who has passed away." },
    { "character": "墓", "on_yomi": "BO", "kun_yomi": "haka", "meaning": "Grave / Tomb", "stroke_count": 13, "mnemonic": "Grass and sun over earth; burial ground." },
    { "character": "墜", "on_yomi": "TSUI", "kun_yomi": "none", "meaning": "Drop / Fall / Crash", "stroke_count": 15, "mnemonic": "A line of items falling onto the earth." },
    { "character": "壇", "on_yomi": "DAN", "kun_yomi": "none", "meaning": "Altar / Podium / Stage", "stroke_count": 16, "mnemonic": "Earth supporting a multi-level hall; a stage." },
    { "character": "壊", "on_yomi": "KAI", "kun_yomi": "kowa-su", "meaning": "Break / Demolish / Destroy", "stroke_count": 16, "mnemonic": "Earth being broken into clothing/pieces." },
    { "character": "壌", "on_yomi": "JOU", "kun_yomi": "tsuchi", "meaning": "Soil / Earth / Land", "stroke_count": 17, "mnemonic": "Earth and a helper; rich, cultivated soil." },
    { "character": "壕", "on_yomi": "GOU", "kun_yomi": "none", "meaning": "Ditch / Moat / Trench", "stroke_count": 17, "mnemonic": "Earth and a tall building; a deep moat." },
    { "character": "魅", "on_yomi": "MI", "kun_yomi": "none", "meaning": "Charm / Enchant / Fascination", "stroke_count": 15, "mnemonic": "A ghost/spirit with an understated/minor charm." },
    { "character": "魂", "on_yomi": "KON", "kun_yomi": "tamashii", "meaning": "Soul / Spirit", "stroke_count": 14, "mnemonic": "A cloud-like spirit or ghost." },
    { "character": "魔", "on_yomi": "MA", "kun_yomi": "none", "meaning": "Demon / Devil / Witch", "stroke_count": 21, "mnemonic": "A ghost/spirit in a forest under a cover." },
    { "character": "醜", "on_yomi": "SHUU", "kun_yomi": "miniku-i", "meaning": "Ugly / Shameful", "stroke_count": 17, "mnemonic": "Sake and a ghost; looking like a monster." },
    { "character": "魏", "on_yomi": "GI", "kun_yomi": "none", "meaning": "High / Kingdom of Wei", "stroke_count": 18, "mnemonic": "A ghost/spirit in a high building/hall." },
    { "character": "魑", "on_yomi": "CHI", "kun_yomi": "none", "meaning": "Mountain demon", "stroke_count": 21, "mnemonic": "A ghost/spirit that is leaving the forest." },
    { "character": "魁", "on_yomi": "KAI", "kun_yomi": "none", "meaning": "Pioneer / Leader / Head", "stroke_count": 14, "mnemonic": "A ghost/spirit leading a dipper/measure; head." },
    { "character": "魃", "on_yomi": "BATSU", "kun_yomi": "none", "meaning": "Drought / Drought demon", "stroke_count": 14, "mnemonic": "A ghost/spirit causing a drought/hand." },
    { "character": "魍", "on_yomi": "MOU", "kun_yomi": "none", "meaning": "Mountain spirits", "stroke_count": 18, "mnemonic": "Ghostly spirits in a net/boundary." },
    { "character": "魎", "on_yomi": "RYOU", "kun_yomi": "none", "meaning": "Mountain spirit", "stroke_count": 18, "mnemonic": "Ghostly spirit that is concurrent/double." },
    { "character": "魘", "on_yomi": "EN", "kun_yomi": "none", "meaning": "Nightmare", "stroke_count": 24, "mnemonic": "Ghostly spirit causing a covering/dream." },
    { "character": "皮", "on_yomi": "HI", "kun_yomi": "kawa", "meaning": "Hide / Skin / Pelts", "stroke_count": 5, "mnemonic": "Hand peeling the skin/hide off an animal." },
    { "character": "彼", "on_yomi": "HI", "kun_yomi": "kare", "meaning": "He / Him", "stroke_count": 8, "mnemonic": "Walking a path with a skin/hide; him." },
    { "character": "波", "on_yomi": "HA", "kun_yomi": "nami", "meaning": "Wave", "stroke_count": 8, "mnemonic": "Water moving on the skin/hide of the ocean." },
    { "character": "披", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Expose / Open / Publish", "stroke_count": 8, "mnemonic": "A hand peeling back a skin/hide to expose." },
    { "character": "破", "on_yomi": "HA", "kun_yomi": "yabu-ru", "meaning": "Break / Tear / Rend", "stroke_count": 10, "mnemonic": "Stone hitting skin and breaking it." },
    { "character": "被", "on_yomi": "HI", "kun_yomi": "kou-muru", "meaning": "Incur / Suffer / Receive", "stroke_count": 10, "mnemonic": "Clothing and hide/skin covering the body." },
    { "character": "疲", "on_yomi": "HI", "kun_yomi": "tsuka-reru", "meaning": "Fatigue", "stroke_count": 10, "mnemonic": "Sickbed skin person." },
    { "character": "婆", "on_yomi": "BA", "kun_yomi": "none", "meaning": "Old woman / Grandmother", "stroke_count": 11, "mnemonic": "Wave/skin and a woman; grandmother." },
    { "character": "頗", "on_yomi": "HA", "kun_yomi": "suko-buru", "meaning": "Extremely / Greatly", "stroke_count": 14, "mnemonic": "Skin/hide and a head; extremely/greatly." },
    { "character": "皺", "on_yomi": "SHUU", "kun_yomi": "none", "meaning": "Wrinkle / Crease / Rumple", "stroke_count": 15, "mnemonic": "A grass shield over a skin/hide; wrinkles." },
    { "character": "祟", "on_yomi": "SUI", "kun_yomi": "tata-ru", "meaning": "Haunt", "stroke_count": 10, "mnemonic": "Mountain altar omen." },
    { "character": "禁", "on_yomi": "KIN", "kun_yomi": "none", "meaning": "Prohibit", "stroke_count": 13, "mnemonic": "Forbidden forest altar." },
    { "character": "禅", "on_yomi": "ZEN", "kun_yomi": "none", "meaning": "Zen", "stroke_count": 13, "mnemonic": "Simple truth altar." },
    { "character": "禍", "on_yomi": "KA", "kun_yomi": "none", "meaning": "Curse", "stroke_count": 13, "mnemonic": "Crooked altar evil." },
    { "character": "禄", "on_yomi": "ROKU", "kun_yomi": "none", "meaning": "Pension", "stroke_count": 13, "mnemonic": "Stable income omen." },
    { "character": "礼", "on_yomi": "REI", "kun_yomi": "none", "meaning": "Bowing / Rite / Ritual", "stroke_count": 5, "mnemonic": "Altar and a person bowing in ritual." },
    { "character": "社", "on_yomi": "SHA", "kun_yomi": "yashiro", "meaning": "Shrine / Company / Society", "stroke_count": 7, "mnemonic": "Earth and an altar; a sacred society." },
    { "character": "祈", "on_yomi": "KI", "kun_yomi": "ino-ru", "meaning": "Pray / Wish", "stroke_count": 8, "mnemonic": "An axe and an altar; praying for strength." },
    { "character": "祉", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Welfare / Happiness", "stroke_count": 8, "mnemonic": "Altar showing stable/stopped omen." },
    { "character": "祖", "on_yomi": "SO", "kun_yomi": "none", "meaning": "Ancestor / Founder / Pioneer", "stroke_count": 9, "mnemonic": "An altar showing a multi-level hall; ancestors." },
    { "character": "祝", "on_yomi": "SHUKU", "kun_yomi": "iwa-u", "meaning": "Congratulate / Celebrate", "stroke_count": 9, "mnemonic": "A person under a lid at an altar; celebration." },
    { "character": "神", "on_yomi": "SHIN", "kun_yomi": "kami", "meaning": "God / Deity / Spirit", "stroke_count": 9, "mnemonic": "An altar showing a lead/bolt; divinity." },
    { "character": "祥", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Auspicious / Good omen / Happiness", "stroke_count": 10, "mnemonic": "An altar showing a sheep; a positive sign." },
    { "character": "票", "on_yomi": "HYOU", "kun_yomi": "none", "meaning": "Ballot / Label / Ticket", "stroke_count": 11, "mnemonic": "Western sun over an altar; a formal label." },
    { "character": "祭", "on_yomi": "SAI", "kun_yomi": "matsu-ri", "meaning": "Ritual", "stroke_count": 11, "mnemonic": "Flesh altar rite." },
    { "character": "視", "on_yomi": "SHI", "kun_yomi": "mi-ru", "meaning": "Inspection / View", "stroke_count": 11, "mnemonic": "Eye and an altar showing an omen/sign." },
    { "character": "禎", "on_yomi": "TEI", "kun_yomi": "none", "meaning": "Auspicious / Good luck", "stroke_count": 13, "mnemonic": "An altar showing a correct/stable hall." },
    { "character": "福", "on_yomi": "FUKU", "kun_yomi": "none", "meaning": "Blessing / Luck / Fortune", "stroke_count": 13, "mnemonic": "An altar and a full jar; abundant blessings." },
    { "character": "禝", "on_yomi": "SHOKU", "kun_yomi": "none", "meaning": "God of grain", "stroke_count": 14, "mnemonic": "An altar showing grain/harvest." },
    { "character": "禦", "on_yomi": "GYO", "kun_yomi": "fuse-gu", "meaning": "Defend / Protect / Resis", "stroke_count": 18, "mnemonic": "An altar used for defense/protection." },
    { "character": "禱", "on_yomi": "TOU", "kun_yomi": "ino-ru", "meaning": "Pray", "stroke_count": 19, "mnemonic": "An altar showing a long/寿 prayer." },
    { "character": "禰", "on_yomi": "NEI", "kun_yomi": "none", "meaning": "Shrine", "stroke_count": 19, "mnemonic": "An altar showing an ancestral line." },
    { "character": "禧", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Happiness / Good luck / Joy", "stroke_count": 17, "mnemonic": "An altar showing joy/shining sun." },
    { "character": "禪", "on_yomi": "ZEN", "kun_yomi": "none", "meaning": "Zen / Meditation", "stroke_count": 17, "mnemonic": "Ancient altar showing simple truth." },
    { "character": "禮", "on_yomi": "REI", "kun_yomi": "none", "meaning": "Ritual / Manners", "stroke_count": 18, "mnemonic": "Ancient altar showing high ritual." },
    { "character": "襟", "on_yomi": "KIN", "kun_yomi": "eri", "meaning": "Collar", "stroke_count": 18, "mnemonic": "Forest cloth lapel." },
    { "character": "襖", "on_yomi": "OU", "kun_yomi": "fusuma", "meaning": "Opaque sliding door / Screen", "stroke_count": 18, "mnemonic": "Clothing used as a cover/enclosure." },
    { "character": "襦", "on_yomi": "JU", "kun_yomi": "none", "meaning": "Undergarment / Bodice", "stroke_count": 19, "mnemonic": "Clothing that is thin/rainy; underlayer." },
    { "character": "襪", "on_yomi": "BATSU", "kun_yomi": "none", "meaning": "Socks / Stockings", "stroke_count": 21, "mnemonic": "Clothing used for steps/walking." },
    { "character": "襯", "on_yomi": "SHIN", "kun_yomi": "none", "meaning": "Undergarment / Lining", "stroke_count": 21, "mnemonic": "Clothing used for a intimate/parental feel." },
    { "character": "襷", "on_yomi": "none", "kun_yomi": "tasuki", "meaning": "Tasuki / Cord (for sleeves)", "stroke_count": 22, "mnemonic": "Clothing and a lift/shaping hand." },
    { "character": "袴", "on_yomi": "none", "kun_yomi": "hakama", "meaning": "Hakama / Skirt", "stroke_count": 11, "mnemonic": "House cloth building." },
    { "character": "裳", "on_yomi": "SHOU", "kun_yomi": "mo", "meaning": "Lower garment", "stroke_count": 14, "mnemonic": "Bright hall cloth." },
    { "character": "褪", "on_yomi": "TAI", "kun_yomi": "a-seru", "meaning": "Fade", "stroke_count": 15, "mnemonic": "Retreat cloth move." },
    { "character": "裃", "on_yomi": "none", "kun_yomi": "kamishimo", "meaning": "Kamishimo / Samurai dress", "stroke_count": 12, "mnemonic": "Clothing and up/down; formal samurai suit." },
    { "character": "裄", "on_yomi": "none", "kun_yomi": "yuki", "meaning": "Sleeve length", "stroke_count": 11, "mnemonic": "Clothing and a path/row; measuring sleeves." },
    { "character": "裨", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Supplement / Aid / Support", "stroke_count": 13, "mnemonic": "Clothing and a humble/lowly person's aid." }
];

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

console.log('=== L17 RAW DATA AUDIT ===');
console.log('Baseline unique count (L1-L16):', baseline.size);
console.log('L17 raw count:', l17Raw.length);

// Check for internal duplicates in L17
let seenInL17 = new Set();
let internalDups = new Set();
l17Raw.forEach(entry => {
    if (seenInL17.has(entry.character)) {
        internalDups.add(entry.character);
    }
    seenInL17.add(entry.character);
});

// Check for baseline duplicates
let baselineDups = new Set();
l17Raw.forEach(entry => {
    if (baseline.has(entry.character)) {
        baselineDups.add(entry.character);
    }
});

// Get unique L17
let uniqueL17 = [];
let uniqueSet = new Set();
l17Raw.forEach(entry => {
    if (!uniqueSet.has(entry.character) && !baseline.has(entry.character)) {
        uniqueL17.push(entry);
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

console.log('Unique L17 Count:', uniqueL17.length);
console.log('Need to replace:', 100 - uniqueL17.length, 'Kanji');

if (uniqueL17.length === 100) {
    console.log('\n✅ L17 is perfect! Zero duplicates!');
}
