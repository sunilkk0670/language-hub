const fs = require('fs');
const path = require('path');

// User-provided L16 raw data
const l16Raw = [
    { "character": "逸", "on_yomi": "ITSU", "kun_yomi": "none", "meaning": "Deviate / Elude / Idleness", "stroke_count": 10, "mnemonic": "A rabbit escaping/running along a road path." },
    { "character": "逼", "on_yomi": "HITSU", "kun_yomi": "none", "meaning": "Urge / Coerce / Close", "stroke_count": 13, "mnemonic": "Walking a path that is full and pressing close." },
    { "character": "逾", "on_yomi": "YU", "kun_yomi": "none", "meaning": "Surpass / Exceed", "stroke_count": 13, "mnemonic": "Walking a path that exceeds a certain point/mark." },
    { "character": "遒", "on_yomi": "SHUU", "kun_yomi": "none", "meaning": "Vigorous / Force / Strong", "stroke_count": 11, "mnemonic": "Walking a path with power/sake; vigorous force." },
    { "character": "遑", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Leisure / Spare time", "stroke_count": 13, "mnemonic": "Walking a path under the sun; leisure time." },
    { "character": "遐", "on_yomi": "KA", "kun_yomi": "none", "meaning": "Distant / Remote / Far", "stroke_count": 13, "mnemonic": "A path that is distant and coarse like a hide." },
    { "character": "邀", "on_yomi": "YOU", "kun_yomi": "none", "meaning": "Invite / Meet / Summon", "stroke_count": 17, "mnemonic": "Walking a path to invite/summon a visitor." },
    { "character": "邂", "on_yomi": "KAI", "kun_yomi": "none", "meaning": "Unexpected meeting", "stroke_count": 17, "mnemonic": "Walking a path to a meeting with a horn/mark." },
    { "character": "邃", "on_yomi": "SUI", "kun_yomi": "none", "meaning": "Deep / Profound / Remote", "stroke_count": 18, "mnemonic": "A path that is deep and cave-like/profound." },
    { "character": "邁", "on_yomi": "MAI", "kun_yomi": "none", "meaning": "Stride / Excel / Go", "stroke_count": 13, "mnemonic": "A path that is wide/many and excelled." },
    { "character": "躬", "on_yomi": "KYUU", "kun_yomi": "mi-zukara", "meaning": "Personally / Self / Body", "stroke_count": 10, "mnemonic": "The body and a bow; bowing personally." },
    { "character": "躯", "on_yomi": "KU", "kun_yomi": "mukuro", "meaning": "Corpse / Body / Frame", "stroke_count": 11, "mnemonic": "The body inside a district or frame." },
    { "character": "躾", "on_yomi": "none", "kun_yomi": "shitsuke", "meaning": "Discipline / Training", "stroke_count": 15, "mnemonic": "The body achieving a beautiful/refined state." },
    { "character": "酬", "on_yomi": "SHUU", "kun_yomi": "none", "meaning": "Reward / Repay / Retribution", "stroke_count": 13, "mnemonic": "Sake jar and a state; rewarding a helper/guest." },
    { "character": "酪", "on_yomi": "RAKU", "kun_yomi": "none", "meaning": "Dairy / Whey / Broth", "stroke_count": 13, "mnemonic": "Sake jar and each/every; dairy/whey distribution." },
    { "character": "醍", "on_yomi": "DAI", "kun_yomi": "none", "meaning": "Whey / Good taste", "stroke_count": 16, "mnemonic": "Sake jar and the sun/is; essence of good taste." },
    { "character": "醐", "on_yomi": "GO", "kun_yomi": "none", "meaning": "Butter / Ghee", "stroke_count": 16, "mnemonic": "Sake jar and an ancient person/moon; ghee." },
    { "character": "醸", "on_yomi": "JOU", "kun_yomi": "kamo-su", "meaning": "Brew / Cause / Foment", "stroke_count": 20, "mnemonic": "Sake jar and a helper; brewing/causing." },
    { "character": "醒", "on_yomi": "SEI", "kun_yomi": "none", "meaning": "Awaken / Sober up", "stroke_count": 16, "mnemonic": "Sake jar and a star; waking up at night/sobering." },
    { "character": "醗", "on_yomi": "HATSU", "kun_yomi": "none", "meaning": "Ferment / Brew", "stroke_count": 16, "mnemonic": "Sake jar and departure; starting the brew." },
    { "character": "廉", "on_yomi": "REN", "kun_yomi": "none", "meaning": "Honorable / Bargain / Low price", "stroke_count": 13, "mnemonic": "Roof and a hand showing a fair/honest price." },
    { "character": "廊", "on_yomi": "ROU", "kun_yomi": "none", "meaning": "Corridor / Hall / Gallery", "stroke_count": 12, "mnemonic": "Long corridor under a roof in a specific district." },
    { "character": "廓", "on_yomi": "KAKU", "kun_yomi": "none", "meaning": "Fortification / District", "stroke_count": 14, "mnemonic": "Wide walled area under a roof." },
    { "character": "廟", "on_yomi": "BYOU", "kun_yomi": "tamaya", "meaning": "Shrine / Mausoleum", "stroke_count": 15, "mnemonic": "Roof over a sacred hall for ancestors." },
    { "character": "廠", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Workshop / Factory", "stroke_count": 15, "mnemonic": "Roof over a specialized honor/work field." },
    { "character": "廖", "on_yomi": "RYOU", "kun_yomi": "none", "meaning": "Silent / Empty", "stroke_count": 14, "mnemonic": "Roof over a person in a quiet valley." },
    { "character": "廃", "on_yomi": "HAI", "kun_yomi": "suta-reru", "meaning": "Abolish / Obsolete / Waste", "stroke_count": 12, "mnemonic": "Roof and a departure; an abandoned building." },
    { "character": "慶", "on_yomi": "KEI", "kun_yomi": "yoroko-bu", "meaning": "Rejoice / Congratulate", "stroke_count": 15, "mnemonic": "Heart under a roof and a deer; joyful celebration." },
    { "character": "庇", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Eaves / Protect / Shield", "stroke_count": 7, "mnemonic": "A roof and a comparison/shielding hand." },
    { "character": "庄", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Manor / Village / Villa", "stroke_count": 6, "mnemonic": "Earth and a roof; a small country estate." },
    { "character": "庇護", "on_yomi": "HIGO", "kun_yomi": "none", "meaning": "Patronage / Protection", "stroke_count": 21, "mnemonic": "Protecting a hall/building with shields." },
    { "character": "廁", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Toilet / Privy", "stroke_count": 12, "mnemonic": "A roof and a rule/measure; private room." },
    { "character": "庸", "on_yomi": "YOU", "kun_yomi": "none", "meaning": "Mediocre / Ordinary / Use", "stroke_count": 11, "mnemonic": "Roof and a person using a tool; commonplace." },
    { "character": "廂", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Eaves / Side room", "stroke_count": 12, "mnemonic": "Roof and a tree/shining side; eaves." },
    { "character": "庶", "on_yomi": "SHO", "kun_yomi": "none", "meaning": "Common / All / Populace", "stroke_count": 11, "mnemonic": "Fire and a roof; many hearths/commoners." },
    { "character": "廁", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Privy", "stroke_count": 12, "mnemonic": "Rule roof." },
    { "character": "廂", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Side room", "stroke_count": 12, "mnemonic": "Tree roof." },
    { "character": "庵", "on_yomi": "AN", "kun_yomi": "iori", "meaning": "Hermitage / Retreat", "stroke_count": 11, "mnemonic": "Roof over a person/big area; a small retreat." },
    { "character": "庚", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Age / Year / Seventh", "stroke_count": 8, "mnemonic": "A roof over a person/hand; counting time." },
    { "character": "廁", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Toilet", "stroke_count": 12, "mnemonic": "Rule under roof." },
    { "character": "廓", "on_yomi": "KAKU", "kun_yomi": "none", "meaning": "Fortification", "stroke_count": 14, "mnemonic": "Walled area." },
    { "character": "廟", "on_yomi": "BYOU", "kun_yomi": "tamaya", "meaning": "Shrine", "stroke_count": 15, "mnemonic": "Sacred hall." },
    { "character": "廠", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Factory", "stroke_count": 15, "mnemonic": "Specialized hall." },
    { "character": "廖", "on_yomi": "RYOU", "kun_yomi": "none", "meaning": "Silent", "stroke_count": 14, "mnemonic": "Valley roof." },
    { "character": "庚", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Seventh", "stroke_count": 8, "mnemonic": "Hand roof age." },
    { "character": "廓", "on_yomi": "KAKU", "kun_yomi": "none", "meaning": "District", "stroke_count": 14, "mnemonic": "Walled roof." },
    { "character": "蹂", "on_yomi": "JUU", "kun_yomi": "none", "meaning": "Trample / Crush", "stroke_count": 16, "mnemonic": "A foot crushing something under it like a snake." },
    { "character": "蹄", "on_yomi": "TEI", "kun_yomi": "hizume", "meaning": "Hoof", "stroke_count": 16, "mnemonic": "A foot that is determined and hard like a hoof." },
    { "character": "踵", "on_yomi": "SHOU", "kun_yomi": "kakato", "meaning": "Heel", "stroke_count": 16, "mnemonic": "A foot and a heavy/duty mark; the heel." },
    { "character": "躁", "on_yomi": "SOU", "kun_yomi": "none", "meaning": "Fidgety / Impatient", "stroke_count": 20, "mnemonic": "A foot and a tree/birds; moving restlessly." },
    { "character": "躇", "on_yomi": "CHO", "kun_yomi": "none", "meaning": "Hesitate", "stroke_count": 19, "mnemonic": "A foot and a building/stopping; hesitating." },
    { "character": "蹲", "on_yomi": "SON", "kun_yomi": "none", "meaning": "Crouch / Squat", "stroke_count": 19, "mnemonic": "A foot and a person standing; squatting down." },
    { "character": "躍", "on_yomi": "YAKU", "kun_yomi": "odo-ru", "meaning": "Leap / Skip / Jump", "stroke_count": 21, "mnemonic": "A foot jumping like a bird/falcon." },
    { "character": "躓", "on_yomi": "CHI", "kun_yomi": "none", "meaning": "Stumble", "stroke_count": 22, "mnemonic": "A foot and a matter/quality; stumbling over value." },
    { "character": "蹴", "on_yomi": "SHUU", "kun_yomi": "ke-ru", "meaning": "Kick", "stroke_count": 19, "mnemonic": "A foot striking out at a target." },
    { "character": "蹈", "on_yomi": "TOU", "kun_yomi": "none", "meaning": "Tread / Trample / Step", "stroke_count": 17, "mnemonic": "A foot and a measurement/dipper; treading." },
    { "character": "蹂", "on_yomi": "JUU", "kun_yomi": "none", "meaning": "Trample", "stroke_count": 16, "mnemonic": "Foot snake crush." },
    { "character": "蹄", "on_yomi": "TEI", "kun_yomi": "hizume", "meaning": "Hoof", "stroke_count": 16, "mnemonic": "Determined foot." },
    { "character": "踵", "on_yomi": "SHOU", "kun_yomi": "kakato", "meaning": "Heel", "stroke_count": 16, "mnemonic": "Duty foot heel." },
    { "character": "躁", "on_yomi": "SOU", "kun_yomi": "none", "meaning": "Impatient", "stroke_count": 20, "mnemonic": "Moving foot tree." },
    { "character": "躍", "on_yomi": "YAKU", "kun_yomi": "odo-ru", "meaning": "Jump", "stroke_count": 21, "mnemonic": "Falcon foot leap." },
    { "character": "趾", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Toe", "stroke_count": 11, "mnemonic": "Stop footprint foot." },
    { "character": "跨", "on_yomi": "KO", "kun_yomi": "mata-gu", "meaning": "Straddle", "stroke_count": 13, "mnemonic": "Big area foot straddle." },
    { "character": "跪", "on_yomi": "KI", "kun_yomi": "hizamazu-ku", "meaning": "Kneel", "stroke_count": 13, "mnemonic": "Respect person foot." },
    { "character": "踪", "on_yomi": "SOU", "kun_yomi": "none", "meaning": "Trace / Footprint / Trail", "stroke_count": 15, "mnemonic": "A foot and an ancestor/hall; marking a trail." },
    { "character": "跋", "on_yomi": "BATSU", "kun_yomi": "none", "meaning": "Tread / Step / Epilogue", "stroke_count": 12, "mnemonic": "A foot and a hand/friend; stepping along." },
    { "character": "践", "on_yomi": "SEN", "kun_yomi": "none", "meaning": "Tread / Practice / Carry out", "stroke_count": 13, "mnemonic": "A foot and two small weapons; carrying out a task." },
    { "character": "踉", "on_yomi": "RYOU", "kun_yomi": "none", "meaning": "Stumble / Reel / Totter", "stroke_count": 14, "mnemonic": "A foot and a good/proper state; staggering." },
    { "character": "踝", "on_yomi": "KA", "kun_yomi": "kurubushi", "meaning": "Ankle", "stroke_count": 15, "mnemonic": "A foot and fruit/result; the ankle bone." },
    { "character": "踟", "on_yomi": "CHI", "kun_yomi": "none", "meaning": "Hesitate", "stroke_count": 15, "mnemonic": "A foot and knowledge/arrow; hesitating." },
    { "character": "蹉", "on_yomi": "SA", "kun_yomi": "none", "meaning": "Slip / Error / Stumble", "stroke_count": 17, "mnemonic": "A foot and differences/scraps; a slip." },
    { "character": "踪", "on_yomi": "SOU", "kun_yomi": "none", "meaning": "Trail", "stroke_count": 15, "mnemonic": "Ancestor foot mark." },
    { "character": "践", "on_yomi": "SEN", "kun_yomi": "none", "meaning": "Carry out", "stroke_count": 13, "mnemonic": "Task foot practice." },
    { "character": "踉", "on_yomi": "RYOU", "kun_yomi": "none", "meaning": "Totter", "stroke_count": 14, "mnemonic": "Proper foot stagger." },
    { "character": "踝", "on_yomi": "KA", "kun_yomi": "kurubushi", "meaning": "Ankle", "stroke_count": 15, "mnemonic": "Fruit ankle foot." },
    { "character": "踟", "on_yomi": "CHI", "kun_yomi": "none", "meaning": "Hesitate", "stroke_count": 15, "mnemonic": "Arrow knowledge foot." },
    { "character": "蹉", "on_yomi": "SA", "kun_yomi": "none", "meaning": "Slip", "stroke_count": 17, "mnemonic": "Error difference foot." },
    { "character": "躑", "on_yomi": "TEKI", "kun_yomi": "none", "meaning": "Totter", "stroke_count": 22, "mnemonic": "A foot tottering near a district/building." },
    { "character": "躇", "on_yomi": "CHO", "kun_yomi": "none", "meaning": "Hesitate", "stroke_count": 19, "mnemonic": "Building foot stop." },
    { "character": "蹲", "on_yomi": "SON", "kun_yomi": "none", "meaning": "Squat", "stroke_count": 19, "mnemonic": "Person foot standing." },
    { "character": "躓", "on_yomi": "CHI", "kun_yomi": "none", "meaning": "Stumble", "stroke_count": 22, "mnemonic": "Value foot quality." },
    { "character": "蹈", "on_yomi": "TOU", "kun_yomi": "none", "meaning": "Tread", "stroke_count": 17, "mnemonic": "Measure foot dipper." },
    { "character": "躑", "on_yomi": "TEKI", "kun_yomi": "none", "meaning": "Totter", "stroke_count": 22, "mnemonic": "District building foot." },
    { "character": "迹", "on_yomi": "SEKI", "kun_yomi": "ato", "meaning": "Remains / Trace / Mark", "stroke_count": 10, "mnemonic": "Walking a path that is red/clear; a trace." },
    { "character": "逾", "on_yomi": "YU", "kun_yomi": "none", "meaning": "Exceed", "stroke_count": 13, "mnemonic": "Mark path exceed." },
    { "character": "逼", "on_yomi": "HITSU", "kun_yomi": "none", "meaning": "Coerce", "stroke_count": 13, "mnemonic": "Full pressing path." },
    { "character": "遁", "on_yomi": "TON", "kun_yomi": "none", "meaning": "Escape / Flee / Hide", "stroke_count": 13, "mnemonic": "Walking a path to shield or flee/hide." },
    { "character": "遘", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Encounter / Meet", "stroke_count": 14, "mnemonic": "Walking a path to a formal meeting/encounter." },
    { "character": "遏", "on_yomi": "ATSU", "kun_yomi": "none", "meaning": "Prevent / Stop / Check", "stroke_count": 13, "mnemonic": "Walking a path to stop an omen/sign." },
    { "character": "遁", "on_yomi": "TON", "kun_yomi": "none", "meaning": "Hide", "stroke_count": 13, "mnemonic": "Shield path flee." },
    { "character": "遘", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Encounter", "stroke_count": 14, "mnemonic": "Formal meeting path." },
    { "character": "遏", "on_yomi": "ATSU", "kun_yomi": "none", "meaning": "Check", "stroke_count": 13, "mnemonic": "Sign stop path." },
    { "character": "遄", "on_yomi": "SEN", "kun_yomi": "none", "meaning": "Hurry / Rapid / Fast", "stroke_count": 12, "mnemonic": "Walking a path that is dedicated/specialized; fast." },
    { "character": "遑", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Leisure", "stroke_count": 13, "mnemonic": "Sun path leisure." },
    { "character": "遒", "on_yomi": "SHUU", "kun_yomi": "none", "meaning": "Strong", "stroke_count": 11, "mnemonic": "Sake path force." },
    { "character": "邂", "on_yomi": "KAI", "kun_yomi": "none", "meaning": "Meet", "stroke_count": 17, "mnemonic": "Unexpected horn path." },
    { "character": "邃", "on_yomi": "SUI", "kun_yomi": "none", "meaning": "Profound", "stroke_count": 18, "mnemonic": "Cave path deep." },
    { "character": "迹", "on_yomi": "SEKI", "kun_yomi": "ato", "meaning": "Trace", "stroke_count": 10, "mnemonic": "Red clear path." },
    { "character": "躅", "on_yomi": "CHOKU", "kun_yomi": "none", "meaning": "Trace / Footprint / Hesitate", "stroke_count": 20, "mnemonic": "A foot and an insect/insect-track; a trace." },
    { "character": "躅", "on_yomi": "CHOKU", "kun_yomi": "none", "meaning": "Trace", "stroke_count": 20, "mnemonic": "Insect track foot." }
];

// Load baseline (L1-L15)
const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

console.log('=== L16 RAW DATA AUDIT ===');
console.log('Baseline unique count (L1-L15):', baseline.size);
console.log('L16 raw count:', l16Raw.length);

// Check for internal duplicates in L16
let seenInL16 = new Set();
let internalDups = new Set();
l16Raw.forEach(entry => {
    if (seenInL16.has(entry.character)) {
        internalDups.add(entry.character);
    }
    seenInL16.add(entry.character);
});

// Check for baseline duplicates
let baselineDups = new Set();
l16Raw.forEach(entry => {
    if (baseline.has(entry.character)) {
        baselineDups.add(entry.character);
    }
});

// Get unique L16
let uniqueL16 = [];
let uniqueSet = new Set();
l16Raw.forEach(entry => {
    if (!uniqueSet.has(entry.character) && !baseline.has(entry.character)) {
        uniqueL16.push(entry);
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

console.log('Unique L16 Count:', uniqueL16.length);
console.log('Need to replace:', 100 - uniqueL16.length, 'Kanji');

if (uniqueL16.length === 100) {
    console.log('\n✅ L16 is perfect! Zero duplicates!');
}
