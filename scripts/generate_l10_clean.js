const fs = require('fs');
const path = require('path');

const baselineFiles = [
    'kanji_mastery_l1.json',
    'kanji_mastery_l2.json',
    'kanji_mastery_l3.json',
    'kanji_mastery_l4.json',
    'kanji_mastery_l5.json',
    'kanji_mastery_l6.json',
    'kanji_mastery_l7.json',
    'kanji_mastery_l8.json',
    'kanji_mastery_l9.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

// N3-appropriate Kanji pool
const candidates = [
    // Retained from user's list (verified unique)
    { "character": "更", "on_yomi": "KOU", "kun_yomi": "sara", "meaning": "Renew / Again", "stroke_count": 7, "mnemonic": "Correcting a situation once more." },
    { "character": "割", "on_yomi": "KATSU", "kun_yomi": "wa-ru", "meaning": "Divide / Proportion", "stroke_count": 12, "mnemonic": "A knife dividing damage or sections." },
    { "character": "減", "on_yomi": "GEN", "kun_yomi": "he-ru", "meaning": "Decrease / Dwindle", "stroke_count": 12, "mnemonic": "Water that is being sealed off or diminished." },
    { "character": "増", "on_yomi": "ZOU", "kun_yomi": "fu-eru", "meaning": "Increase / Add", "stroke_count": 14, "mnemonic": "Adding earth to a pile over time." },
    { "character": "液", "on_yomi": "EKI", "kun_yomi": "none", "meaning": "Liquid / Fluid", "stroke_count": 11, "mnemonic": "Water that flows toward a night sky." },
    { "character": "圧", "on_yomi": "ATSU", "kun_yomi": "none", "meaning": "Pressure / Force", "stroke_count": 5, "mnemonic": "Earth under a cliff being pressed down." },
    { "character": "移", "on_yomi": "I", "kun_yomi": "utsu-ru", "meaning": "Shift / Move", "stroke_count": 11, "mnemonic": "Grain being moved to a many/new spot." },
    { "character": "逆", "on_yomi": "GYAKU", "kun_yomi": "saka-rau", "meaning": "Reverse / Inverse", "stroke_count": 9, "mnemonic": "Walking upside down/opposite to the flow." },
    // New unique N3 Kanji
    { "character": "拡", "on_yomi": "KAKU", "kun_yomi": "none", "meaning": "Expand / Enlarge", "stroke_count": 8, "mnemonic": "Hand spreading wide; expansion." },
    { "character": "掛", "on_yomi": "KA", "kun_yomi": "ka-keru", "meaning": "Hang / Suspend", "stroke_count": 11, "mnemonic": "Hand hanging an item on a hook." },
    { "character": "携", "on_yomi": "KEI", "kun_yomi": "tazusa-eru", "meaning": "Carry / Portable", "stroke_count": 13, "mnemonic": "Hand holding a bird/item; carrying." },
    { "character": "摘", "on_yomi": "TEKI", "kun_yomi": "tsu-mu", "meaning": "Pluck / Extract", "stroke_count": 14, "mnemonic": "Hand picking a suitable item." },
    { "character": "擦", "on_yomi": "SATSU", "kun_yomi": "su-ru", "meaning": "Rub / Scrape", "stroke_count": 17, "mnemonic": "Hand rubbing to investigate察." },
    { "character": "敏", "on_yomi": "BIN", "kun_yomi": "none", "meaning": "Agile / Quick", "stroke_count": 10, "mnemonic": "Every/each strike done quickly." },
    { "character": "敬", "on_yomi": "KEI", "kun_yomi": "uyama-u", "meaning": "Respect / Honor", "stroke_count": 12, "mnemonic": "Striking with respect/reverence." },
    { "character": "敵", "on_yomi": "TEKI", "kun_yomi": "none", "meaning": "Enemy / Opponent", "stroke_count": 15, "mnemonic": "Striking a suitable/matched foe." },
    { "character": "斉", "on_yomi": "SEI", "kun_yomi": "none", "meaning": "Simultaneous / Equal", "stroke_count": 8, "mnemonic": "Items aligned at the same level." },
    { "character": "旋", "on_yomi": "SEN", "kun_yomi": "none", "meaning": "Rotation / Revolve", "stroke_count": 11, "mnemonic": "A flag spinning in circles." },
    { "character": "旧", "on_yomi": "KYUU", "kun_yomi": "none", "meaning": "Old / Former", "stroke_count": 5, "mnemonic": "An old sun/day marker." },
    { "character": "昇", "on_yomi": "SHOU", "kun_yomi": "nobo-ru", "meaning": "Ascend / Rise", "stroke_count": 8, "mnemonic": "Sun rising upward." },
    { "character": "昭", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Bright / Clear", "stroke_count": 9, "mnemonic": "Sun召 shining brightly." },
    { "character": "暁", "on_yomi": "GYOU", "kun_yomi": "akatsuki", "meaning": "Dawn / Daybreak", "stroke_count": 12, "mnemonic": "Sun尭 at early morning." },
    { "character": "暴", "on_yomi": "BOU", "kun_yomi": "aba-reru", "meaning": "Violence / Outrage", "stroke_count": 15, "mnemonic": "Sun and rice/water; violent storm." },
    { "character": "曇", "on_yomi": "DON", "kun_yomi": "kumo-ru", "meaning": "Cloudy / Overcast", "stroke_count": 16, "mnemonic": "Sun雲 covered by clouds." },
    { "character": "曲", "on_yomi": "KYOKU", "kun_yomi": "ma-garu", "meaning": "Bend / Melody", "stroke_count": 6, "mnemonic": "A bent/curved shape or tune." },
    { "character": "朗", "on_yomi": "ROU", "kun_yomi": "hoga-raka", "meaning": "Cheerful / Clear", "stroke_count": 10, "mnemonic": "Moon良 shining brightly/clearly." },
    { "character": "朱", "on_yomi": "SHU", "kun_yomi": "none", "meaning": "Vermillion / Red", "stroke_count": 6, "mnemonic": "A tree/wood with red color." },
    { "character": "朴", "on_yomi": "BOKU", "kun_yomi": "none", "meaning": "Simple / Honest", "stroke_count": 6, "mnemonic": "A tree/wood in卜 simple form." },
    { "character": "机", "on_yomi": "KI", "kun_yomi": "tsukue", "meaning": "Desk", "stroke_count": 6, "mnemonic": "Wood几 shaped into a desk." },
    { "character": "枚", "on_yomi": "MAI", "kun_yomi": "none", "meaning": "Counter for flat objects", "stroke_count": 8, "mnemonic": "Wood攵 counted as sheets." },
    { "character": "析", "on_yomi": "SEKI", "kun_yomi": "none", "meaning": "Analyze / Divide", "stroke_count": 8, "mnemonic": "Wood斤 split/analyzed with axe." },
    { "character": "柄", "on_yomi": "HEI", "kun_yomi": "gara", "meaning": "Pattern / Handle", "stroke_count": 9, "mnemonic": "Wood丙 with a pattern/handle." },
    { "character": "柔", "on_yomi": "JUU", "kun_yomi": "yawa-rakai", "meaning": "Soft / Gentle", "stroke_count": 9, "mnemonic": "Spear矛 that is soft/flexible." },
    { "character": "柱", "on_yomi": "CHUU", "kun_yomi": "hashira", "meaning": "Pillar / Post", "stroke_count": 9, "mnemonic": "Wood主 standing as a pillar." },
    { "character": "栄", "on_yomi": "EI", "kun_yomi": "saka-eru", "meaning": "Prosperity / Glory", "stroke_count": 9, "mnemonic": "Tree営 flourishing/prospering." },
    { "character": "核", "on_yomi": "KAKU", "kun_yomi": "none", "meaning": "Nucleus / Core", "stroke_count": 10, "mnemonic": "Wood亥 at the core/center." },
    { "character": "根", "on_yomi": "KON", "kun_yomi": "ne", "meaning": "Root / Origin", "stroke_count": 10, "mnemonic": "Wood艮 at the root/base." },
    { "character": "桁", "on_yomi": "none", "kun_yomi": "keta", "meaning": "Digit / Beam", "stroke_count": 10, "mnemonic": "Wood行 forming a beam/digit." },
    { "character": "桃", "on_yomi": "TOU", "kun_yomi": "momo", "meaning": "Peach", "stroke_count": 10, "mnemonic": "Wood兆 bearing peach fruit." },
    { "character": "桑", "on_yomi": "SOU", "kun_yomi": "kuwa", "meaning": "Mulberry", "stroke_count": 10, "mnemonic": "Three又 hands on wood; mulberry." },
    { "character": "梅", "on_yomi": "BAI", "kun_yomi": "ume", "meaning": "Plum", "stroke_count": 10, "mnemonic": "Wood每 bearing plum fruit." },
    { "character": "暦", "on_yomi": "REKI", "kun_yomi": "koyomi", "meaning": "Calendar", "stroke_count": 14, "mnemonic": "Sun and a cliff厂; marking days." },
    { "character": "欧", "on_yomi": "OU", "kun_yomi": "none", "meaning": "Europe", "stroke_count": 8, "mnemonic": "A region marked by区 and yawning欠." },
    { "character": "欲", "on_yomi": "YOKU", "kun_yomi": "ho-shii", "meaning": "Want / Greed", "stroke_count": 11, "mnemonic": "A person yawning for more valley." },
    { "character": "歓", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Delight / Joy", "stroke_count": 15, "mnemonic": "Yawning欠 with joy/happiness観." },
    { "character": "歴", "on_yomi": "REKI", "kun_yomi": "none", "meaning": "History / Career", "stroke_count": 14, "mnemonic": "Stopping止 at a cliff厂 to mark history." },
    { "character": "殊", "on_yomi": "SHU", "kun_yomi": "none", "meaning": "Especially / Special", "stroke_count": 10, "mnemonic": "Death歹 of a vermillion朱 special thing." },
    { "character": "殖", "on_yomi": "SHOKU", "kun_yomi": "none", "meaning": "Multiply / Breed", "stroke_count": 12, "mnemonic": "Death歹 and straight直; reproduction." },
    { "character": "毒", "on_yomi": "DOKU", "kun_yomi": "none", "meaning": "Poison / Toxic", "stroke_count": 8, "mnemonic": "Mother母 with a weapon/poison." },
    { "character": "氏", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Clan / Mr.", "stroke_count": 4, "mnemonic": "A family氏 name marker." },
    { "character": "汚", "on_yomi": "O", "kun_yomi": "kita-nai", "meaning": "Dirty / Pollute", "stroke_count": 6, "mnemonic": "Water汁 that is dirty/polluted." },
    { "character": "沈", "on_yomi": "CHIN", "kun_yomi": "shizu-mu", "meaning": "Sink / Submerge", "stroke_count": 7, "mnemonic": "Water氵 sinking冗 down." },
    { "character": "沖", "on_yomi": "CHUU", "kun_yomi": "none", "meaning": "Offshore / Open sea", "stroke_count": 7, "mnemonic": "Water氵 in the middle中 of the sea." },
    { "character": "沢", "on_yomi": "TAKU", "kun_yomi": "sawa", "meaning": "Swamp / Marsh", "stroke_count": 7, "mnemonic": "Water氵 and a hand尺; a marsh." },
    { "character": "河", "on_yomi": "KA", "kun_yomi": "kawa", "meaning": "River", "stroke_count": 8, "mnemonic": "Water氵 that can可 flow; a river." },
    { "character": "沸", "on_yomi": "FUTSU", "kun_yomi": "wa-ku", "meaning": "Boil / Seethe", "stroke_count": 8, "mnemonic": "Water氵 that is not弗 calm; boiling." },
    { "character": "油", "on_yomi": "YU", "kun_yomi": "abura", "meaning": "Oil", "stroke_count": 8, "mnemonic": "Water氵 from由 a source; oil." },
    { "character": "泉", "on_yomi": "SEN", "kun_yomi": "izumi", "meaning": "Spring / Fountain", "stroke_count": 9, "mnemonic": "White白 water氵; a spring." },
    { "character": "泊", "on_yomi": "HAKU", "kun_yomi": "to-maru", "meaning": "Anchor / Stay overnight", "stroke_count": 8, "mnemonic": "Water氵 and white白; mooring." },
    { "character": "泌", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Secrete / Ooze", "stroke_count": 8, "mnemonic": "Water氵 that must必 come out; secretion." },
    { "character": "泣", "on_yomi": "KYUU", "kun_yomi": "na-ku", "meaning": "Cry / Weep", "stroke_count": 8, "mnemonic": "Water氵 from standing立; tears." },
    { "character": "泥", "on_yomi": "DEI", "kun_yomi": "doro", "meaning": "Mud", "stroke_count": 8, "mnemonic": "Water氵 and a spoon匕; mud." },
    { "character": "注", "on_yomi": "CHUU", "kun_yomi": "soso-gu", "meaning": "Pour / Concentrate", "stroke_count": 8, "mnemonic": "Water氵 and a master主; pouring." },
    { "character": "泳", "on_yomi": "EI", "kun_yomi": "oyo-gu", "meaning": "Swim", "stroke_count": 8, "mnemonic": "Water氵 and eternity永; swimming." },
    { "character": "洋", "on_yomi": "YOU", "kun_yomi": "none", "meaning": "Ocean / Western", "stroke_count": 9, "mnemonic": "Water氵 and sheep羊; the ocean." },
    { "character": "洗", "on_yomi": "SEN", "kun_yomi": "ara-u", "meaning": "Wash", "stroke_count": 9, "mnemonic": "Water氵 and before先; washing." },
    { "character": "洞", "on_yomi": "DOU", "kun_yomi": "hora", "meaning": "Cave / Den", "stroke_count": 9, "mnemonic": "Water氵 and same同; a cave." },
    { "character": "津", "on_yomi": "SHIN", "kun_yomi": "tsu", "meaning": "Harbor / Ferry", "stroke_count": 9, "mnemonic": "Water氵 and a crossing聿; a port." },
    { "character": "洪", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Flood", "stroke_count": 9, "mnemonic": "Water氵 and together共; flooding." },
    { "character": "活", "on_yomi": "KATSU", "kun_yomi": "none", "meaning": "Lively / Active", "stroke_count": 9, "mnemonic": "Water氵 and tongue舌; vitality." },
    { "character": "派", "on_yomi": "HA", "kun_yomi": "none", "meaning": "Faction /派", "stroke_count": 9, "mnemonic": "Water氵 and a branch脈; a派." },
    { "character": "流", "on_yomi": "RYUU", "kun_yomi": "naga-reru", "meaning": "Flow / Stream", "stroke_count": 10, "mnemonic": "Water氵 flowing in a stream." },
    { "character": "浄", "on_yomi": "JOU", "kun_yomi": "none", "meaning": "Pure / Clean", "stroke_count": 9, "mnemonic": "Water氵 that is pure争; clean." },
    { "character": "浅", "on_yomi": "SEN", "kun_yomi": "asa-i", "meaning": "Shallow", "stroke_count": 9, "mnemonic": "Water氵 that is shallow戔." },
    { "character": "浜", "on_yomi": "HIN", "kun_yomi": "hama", "meaning": "Beach / Seashore", "stroke_count": 10, "mnemonic": "Water氵 and a guest賓; a beach." },
    { "character": "浦", "on_yomi": "HO", "kun_yomi": "ura", "meaning": "Bay / Inlet", "stroke_count": 10, "mnemonic": "Water氵 and a shop甫; a bay." },
    { "character": "浪", "on_yomi": "ROU", "kun_yomi": "nami", "meaning": "Wave", "stroke_count": 10, "mnemonic": "Water氵 and good良; waves." },
    { "character": "浮", "on_yomi": "FU", "kun_yomi": "u-ku", "meaning": "Float", "stroke_count": 11, "mnemonic": "Water氵 and a child孚; floating." },
    { "character": "浴", "on_yomi": "YOKU", "kun_yomi": "a-biru", "meaning": "Bathe", "stroke_count": 10, "mnemonic": "Water氵 and a valley谷; bathing." },
    { "character": "海", "on_yomi": "KAI", "kun_yomi": "umi", "meaning": "Sea / Ocean", "stroke_count": 9, "mnemonic": "Water氵 and every毎; the sea." },
    { "character": "浸", "on_yomi": "SHIN", "kun_yomi": "hita-su", "meaning": "Immerse / Soak", "stroke_count": 10, "mnemonic": "Water氵 and a broom帚; soaking." },
    { "character": "消", "on_yomi": "SHOU", "kun_yomi": "ki-eru", "meaning": "Extinguish / Vanish", "stroke_count": 10, "mnemonic": "Water氵 and moon月; disappearing." },
    { "character": "涙", "on_yomi": "RUI", "kun_yomi": "namida", "meaning": "Tears", "stroke_count": 10, "mnemonic": "Water氵 and a door戸; tears." },
    { "character": "涯", "on_yomi": "GAI", "kun_yomi": "none", "meaning": "Horizon / Shore", "stroke_count": 11, "mnemonic": "Water氵 and a cliff崖; the shore." },
    { "character": "液", "on_yomi": "EKI", "kun_yomi": "none", "meaning": "Liquid / Fluid", "stroke_count": 11, "mnemonic": "Water氵 and night夜; liquid." },
    { "character": "淡", "on_yomi": "TAN", "kun_yomi": "awa-i", "meaning": "Pale / Light", "stroke_count": 11, "mnemonic": "Water氵 and fire炎; pale." },
    { "character": "淫", "on_yomi": "IN", "kun_yomi": "none", "meaning": "Lewd / Excessive", "stroke_count": 11, "mnemonic": "Water氵 and a tool工; excess." },
    { "character": "深", "on_yomi": "SHIN", "kun_yomi": "fuka-i", "meaning": "Deep", "stroke_count": 11, "mnemonic": "Water氵 and a hole穴; deep." },
    { "character": "添", "on_yomi": "TEN", "kun_yomi": "so-eru", "meaning": "Append / Add", "stroke_count": 11, "mnemonic": "Water氵 and heaven天; adding." },
    { "character": "清", "on_yomi": "SEI", "kun_yomi": "kiyo-i", "meaning": "Pure / Clear", "stroke_count": 11, "mnemonic": "Water氵 and blue青; clear." },
    { "character": "渇", "on_yomi": "KATSU", "kun_yomi": "kawa-ku", "meaning": "Thirst / Dry", "stroke_count": 11, "mnemonic": "Water氵 and a sun日; thirsty." },
    { "character": "済", "on_yomi": "SAI", "kun_yomi": "su-mu", "meaning": "Settle / Finish", "stroke_count": 11, "mnemonic": "Water氵 and a crossing斉; settling." },
    { "character": "渉", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Ford / Negotiate", "stroke_count": 10, "mnemonic": "Water氵 and a step步; crossing." },
    { "character": "渋", "on_yomi": "JUU", "kun_yomi": "shibu-i", "meaning": "Astringent / Reluctant", "stroke_count": 11, "mnemonic": "Water氵 and stop止; reluctant." },
    { "character": "渓", "on_yomi": "KEI", "kun_yomi": "none", "meaning": "Valley / Ravine", "stroke_count": 11, "mnemonic": "Water氵 and a valley谷; ravine." },
    { "character": "減", "on_yomi": "GEN", "kun_yomi": "he-ru", "meaning": "Decrease / Dwindle", "stroke_count": 12, "mnemonic": "Water氵 and a seal咸; decreasing." },
    { "character": "渡", "on_yomi": "TO", "kun_yomi": "wata-ru", "meaning": "Cross / Ferry", "stroke_count": 12, "mnemonic": "Water氵 and a person度; crossing." },
    { "character": "渦", "on_yomi": "KA", "kun_yomi": "uzu", "meaning": "Whirlpool / Eddy", "stroke_count": 12, "mnemonic": "Water氵 and a nest渦; whirlpool." },
    { "character": "温", "on_yomi": "ON", "kun_yomi": "atata-kai", "meaning": "Warm", "stroke_count": 12, "mnemonic": "Water氵 and a dish皿; warm." },
    { "character": "測", "on_yomi": "SOKU", "kun_yomi": "haka-ru", "meaning": "Measure / Survey", "stroke_count": 12, "mnemonic": "Water氵 and a rule則; measuring." }
];

let finalL10 = [];
let seenChars = new Set();

candidates.forEach(entry => {
    if (!baseline.has(entry.character) && !seenChars.has(entry.character) && finalL10.length < 100) {
        finalL10.push(entry);
        seenChars.add(entry.character);
    }
});

console.log('Generated L10 count:', finalL10.length);
console.log('Unique:', finalL10.length === new Set(finalL10.map(e => e.character)).size);

fs.writeFileSync(
    'c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data\\kanji_mastery_l10.json',
    JSON.stringify(finalL10, null, 2),
    'utf8'
);
console.log('✅ L10 written to file');
