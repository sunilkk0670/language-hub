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

const rawL10 = [
    { "character": "際", "on_yomi": "SAI", "kun_yomi": "kiwa", "meaning": "International / Occasion", "stroke_count": 14, "mnemonic": "A wall near a festival boundary." },
    { "character": "障", "on_yomi": "SHOU", "kun_yomi": "sawa-ru", "meaning": "Hinder / Obstacle", "stroke_count": 14, "mnemonic": "A hill acting as a barrier or shield." },
    { "character": "害", "on_yomi": "GAI", "kun_yomi": "none", "meaning": "Harm / Damage", "stroke_count": 10, "mnemonic": "A mouth under a roof causing injury." },
    { "character": "権", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Authority / Rights", "stroke_count": 15, "mnemonic": "A wooden scale used to balance power." },
    { "character": "評", "on_yomi": "HYOU", "kun_yomi": "none", "meaning": "Evaluate / Criticize", "stroke_count": 12, "mnemonic": "Words used to judge a level or standard." },
    { "character": "価", "on_yomi": "KA", "kun_yomi": "atai", "meaning": "Value / Price", "stroke_count": 8, "mnemonic": "A person evaluating the worth of an item." },
    { "character": "変", "on_yomi": "HEN", "kun_yomi": "ka-waru", "meaning": "Change / Strange", "stroke_count": 9, "mnemonic": "Walking on a different path with a red heart." },
    { "character": "更", "on_yomi": "KOU", "kun_yomi": "sara", "meaning": "Renew / Again", "stroke_count": 7, "mnemonic": "Correcting a situation once more." },
    { "character": "役", "on_yomi": "YAKU", "kun_yomi": "none", "meaning": "Duty / Service", "stroke_count": 7, "mnemonic": "Steps and a strike for a specific role." },
    { "character": "割", "on_yomi": "KATSU", "kun_yomi": "wa-ru", "meaning": "Divide / Proportion", "stroke_count": 12, "mnemonic": "A knife dividing damage or sections." },
    { "character": "減", "on_yomi": "GEN", "kun_yomi": "he-ru", "meaning": "Decrease / Dwindle", "stroke_count": 12, "mnemonic": "Water that is being sealed off or diminished." },
    { "character": "増", "on_yomi": "ZOU", "kun_yomi": "fu-eru", "meaning": "Increase / Add", "stroke_count": 14, "mnemonic": "Adding earth to a pile over time." },
    { "character": "富", "on_yomi": "FU", "kun_yomi": "to-mu", "meaning": "Wealth / Abundant", "stroke_count": 12, "mnemonic": "A roof over a full jar of wealth." },
    { "character": "源", "on_yomi": "GEN", "kun_yomi": "minamoto", "meaning": "Source / Origin", "stroke_count": 13, "mnemonic": "Water from an original meadow spring." },
    { "character": "液", "on_yomi": "EKI", "kun_yomi": "none", "meaning": "Liquid / Fluid", "stroke_count": 11, "mnemonic": "Water that flows toward a night sky." },
    { "character": "混", "on_yomi": "KON", "kun_yomi": "ma-zaru", "meaning": "Mix / Blend", "stroke_count": 11, "mnemonic": "Water mixing with insects under the sun." },
    { "character": "測", "on_yomi": "SOKU", "kun_yomi": "haka-ru", "meaning": "Measure / Survey", "stroke_count": 12, "mnemonic": "Water and a rule used to check depth." },
    { "character": "圧", "on_yomi": "ATSU", "kun_yomi": "none", "meaning": "Pressure / Force", "stroke_count": 5, "mnemonic": "Earth under a cliff being pressed down." },
    { "character": "移", "on_yomi": "I", "kun_yomi": "utsu-ru", "meaning": "Shift / Move", "stroke_count": 11, "mnemonic": "Grain being moved to a many/new spot." },
    { "character": "退", "on_yomi": "TAI", "kun_yomi": "shirizo-ku", "meaning": "Retreat / Resign", "stroke_count": 9, "mnemonic": "Walking back from an ancient border." },
    { "character": "逆", "on_yomi": "GYAKU", "kun_yomi": "saka-rau", "meaning": "Reverse / Inverse", "stroke_count": 9, "mnemonic": "Walking upside down/opposite to the flow." },
    { "character": "限", "on_yomi": "GEN", "kun_yomi": "kagi-ru", "meaning": "Limit / Boundary", "stroke_count": 9, "mnemonic": "A silver barrier marking a final limit." },
    { "character": "制", "on_yomi": "SEI", "kun_yomi": "none", "meaning": "System / Control", "stroke_count": 8, "mnemonic": "Cutting cloth systematically with a knife." },
    { "character": "格", "on_yomi": "KAKU", "kun_yomi": "none", "meaning": "Status / Standard", "stroke_count": 10, "mnemonic": "Wood that fits a specific platform/rank." },
    { "character": "規", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Rule / Compass", "stroke_count": 11, "mnemonic": "Watching a compass for a standard rule." },
    { "character": "則", "on_yomi": "SOKU", "kun_yomi": "none", "meaning": "Law / Rule", "stroke_count": 9, "mnemonic": "A shell and a knife marking a law." },
    { "character": "憲", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Constitution", "stroke_count": 16, "mnemonic": "An eye over a heart watching the law." },
    { "character": "政", "on_yomi": "SEI", "kun_yomi": "matsurigoto", "meaning": "Politics / Government", "stroke_count": 9, "mnemonic": "Correcting matters with a duty/strike." },
    { "character": "治", "on_yomi": "JI", "kun_yomi": "ona-osu", "meaning": "Govern / Cure", "stroke_count": 8, "mnemonic": "Watering and managing a platform/state." },
    { "character": "済", "on_yomi": "SAI", "kun_yomi": "su-mu", "meaning": "Settle / Finish", "stroke_count": 11, "mnemonic": "Water crossing to settle an account." },
    { "character": "経", "on_yomi": "KEI", "kun_yomi": "he-ru", "meaning": "Manage / Warp", "stroke_count": 11, "mnemonic": "Threads passing through a warp." },
    { "character": "営", "on_yomi": "EI", "kun_yomi": "itona-mu", "meaning": "Management / Run", "stroke_count": 12, "mnemonic": "Managing fire under a roof; a business." },
    { "character": "企", "on_yomi": "KI", "kun_yomi": "kuwada-teru", "meaning": "Enterprise / Plan", "stroke_count": 6, "mnemonic": "Stopping under a roof to plan a project." },
    { "character": "業", "on_yomi": "GYOU", "kun_yomi": "waza", "meaning": "Industry / Task", "stroke_count": 13, "mnemonic": "Drums and tools used in production work." },
    { "character": "資", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Capital / Resource", "stroke_count": 13, "mnemonic": "Next to shells (money); a resource." },
    { "character": "情", "on_yomi": "JOU", "kun_yomi": "none", "meaning": "Condition / Sentiment", "stroke_count": 11, "mnemonic": "Pure heart/feeling in a situation." },
    { "character": "報", "on_yomi": "HOU", "kun_yomi": "muku-iru", "meaning": "Report / Reward", "stroke_count": 12, "mnemonic": "Handcuffing for a formal report." },
    { "character": "告", "on_yomi": "KOKU", "kun_yomi": "tsu-geru", "meaning": "Announce / Inform", "stroke_count": 7, "mnemonic": "Mouth speaking at an altar." },
    { "character": "認", "on_yomi": "NIN", "kun_yomi": "mito-meru", "meaning": "Recognize / Admit", "stroke_count": 14, "mnemonic": "Words used to acknowledge a truth." },
    { "character": "識", "on_yomi": "SHIKI", "kun_yomi": "none", "meaning": "Knowledge / Discern", "stroke_count": 19, "mnemonic": "Words and a mark of deep understanding." },
    { "character": "覚", "on_yomi": "KAKU", "kun_yomi": "obo-eru", "meaning": "Memorize / Awake", "stroke_count": 12, "mnemonic": "Seeing something under a roof to remember." },
    { "character": "信", "on_yomi": "SHIN", "kun_yomi": "shin-jiru", "meaning": "Trust / Believe", "stroke_count": 9, "mnemonic": "A person standing by their word." },
    { "character": "頼", "on_yomi": "RAI", "kun_yomi": "tano-mu", "meaning": "Request / Rely", "stroke_count": 16, "mnemonic": "Bundling items to request assistance." },
    { "character": "許", "on_yomi": "KYO", "kun_yomi": "yuru-su", "meaning": "Permit / Forgive", "stroke_count": 11, "mnemonic": "Words spoken at noon; official permission." },
    { "character": "可", "on_yomi": "KA", "kun_yomi": "none", "meaning": "Possible / Can", "stroke_count": 5, "mnemonic": "A mouth expressing power; permission." },
    { "character": "能", "on_yomi": "NOU", "kun_yomi": "none", "meaning": "Ability / Talent", "stroke_count": 10, "mnemonic": "A bear-like shape representing talent." },
    { "character": "力", "on_yomi": "RYOKU", "kun_yomi": "chikara", "meaning": "Power / Strength", "stroke_count": 2, "mnemonic": "A muscle or arm exerting power." },
    { "character": "強", "on_yomi": "KYOU", "kun_yomi": "tsuyo-i", "meaning": "Strong", "stroke_count": 11, "mnemonic": "An insect with a powerful bow." },
    { "character": "弱", "on_yomi": "JAKU", "kun_yomi": "yowa-i", "meaning": "Weak", "stroke_count": 10, "mnemonic": "Two small bows with feathers; flimsy." },
    { "character": "勝", "on_yomi": "SHOU", "kun_yomi": "ka-tsu", "meaning": "Victory / Win", "stroke_count": 12, "mnemonic": "Power and a boat/flesh; hard victory." },
    { "character": "負", "on_yomi": "FU", "kun_yomi": "ma-keru", "meaning": "Lose / Defeat", "stroke_count": 9, "mnemonic": "A person carrying a burden of shells." },
    { "character": "戦", "on_yomi": "SEN", "kun_yomi": "tataka-u", "meaning": "War / Battle", "stroke_count": 13, "mnemonic": "A weapon used to hunt or battle." },
    { "character": "争", "on_yomi": "SOU", "kun_yomi": "araso-u", "meaning": "Dispute / Conflict", "stroke_count": 6, "mnemonic": "Two hands pulling a stick/conflict." },
    { "character": "軍", "on_yomi": "GUN", "kun_yomi": "none", "meaning": "Army / Military", "stroke_count": 9, "mnemonic": "A vehicle under a cover; a chariot." },
    { "character": "兵", "on_yomi": "HEI", "kun_yomi": "none", "meaning": "Soldier / Troops", "stroke_count": 7, "mnemonic": "Two hands holding an axe/weapon." },
    { "character": "職", "on_yomi": "SHOKU", "kun_yomi": "none", "meaning": "Employment / Job", "stroke_count": 18, "mnemonic": "Hearing a command to do work." },
    { "character": "務", "on_yomi": "MU", "kun_yomi": "tsuto-meru", "meaning": "Task / Duty", "stroke_count": 11, "mnemonic": "Spear and power used for official work." },
    { "character": "任", "on_yomi": "NIN", "kun_yomi": "maka-seru", "meaning": "Duty / Entrust", "stroke_count": 6, "mnemonic": "A person taking on a burden." },
    { "character": "望", "on_yomi": "BOU", "kun_yomi": "nozo-mu", "meaning": "Hope / Desire", "stroke_count": 11, "mnemonic": "Person watching moon from earth." },
    { "character": "願", "on_yomi": "GAN", "kun_yomi": "nega-u", "meaning": "Wish / Request", "stroke_count": 19, "mnemonic": "A head bowing for a wish." },
    { "character": "欲", "on_yomi": "YOKU", "kun_yomi": "ho-shii", "meaning": "Want / Greed", "stroke_count": 11, "mnemonic": "A person yawning for more valley." },
    { "character": "求", "on_yomi": "KYUU", "kun_yomi": "moto-meru", "meaning": "Seek / Request", "stroke_count": 7, "mnemonic": "Water dots; seeking a stream." },
    { "character": "探", "on_yomi": "TAN", "kun_yomi": "saga-su", "meaning": "Search / Probe", "stroke_count": 11, "mnemonic": "Hand searching a hole in a tree." },
    { "character": "検", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Examination", "stroke_count": 12, "mnemonic": "Wood and a seal used for checking." },
    { "character": "査", "on_yomi": "SA", "kun_yomi": "none", "meaning": "Investigation", "stroke_count": 9, "mnemonic": "Inspecting wood on a platform." },
    { "character": "験", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Test / Effect", "stroke_count": 18, "mnemonic": "A horse at a gate for an exam." },
    { "character": "試", "on_yomi": "SHI", "kun_yomi": "kokoro-miru", "meaning": "Try / Test", "stroke_count": 13, "mnemonic": "Testing words for a challenge." },
    { "character": "効", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Effect / Efficacy", "stroke_count": 8, "mnemonic": "Applying power for a result." },
    { "character": "果", "on_yomi": "KA", "kun_yomi": "ha-tasu", "meaning": "Result / Fruit", "stroke_count": 8, "mnemonic": "Fruit on a tree in the field." },
    { "character": "成", "on_yomi": "SEI", "kun_yomi": "na-ru", "meaning": "Become / Form", "stroke_count": 6, "mnemonic": "Power/weapon to complete a victory." },
    { "character": "功", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Merit / Success", "stroke_count": 5, "mnemonic": "Work performed with power; merit." },
    { "character": "完", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Perfect / Finish", "stroke_count": 7, "mnemonic": "Roof built perfectly to the top." },
    { "character": "了", "on_yomi": "RYOU", "kun_yomi": "none", "meaning": "Complete / Understand", "stroke_count": 2, "mnemonic": "A person with arms finished; done." },
    { "character": "終", "on_yomi": "SHUU", "kun_yomi": "o-waru", "meaning": "End / Finish", "stroke_count": 11, "mnemonic": "Winter is the end of the year's thread." },
    { "character": "予", "on_yomi": "YO", "kun_yomi": "none", "meaning": "In advance", "stroke_count": 4, "mnemonic": "Shuttle used in weaving; pre-planned." },
    { "character": "約", "on_yomi": "YAKU", "kun_yomi": "none", "meaning": "Promise / Approx", "stroke_count": 9, "mnemonic": "Tying threads for a promise." },
    { "character": "期", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Period / Term", "stroke_count": 12, "mnemonic": "Moon over a village/sieve; a cycle." },
    { "character": "準", "on_yomi": "JUN", "kun_yomi": "none", "meaning": "Standard / Level", "stroke_count": 13, "mnemonic": "Water at the same level as a falcon." },
    { "character": "備", "on_yomi": "BI", "kun_yomi": "sona-eru", "meaning": "Equip / Prepare", "stroke_count": 12, "mnemonic": "A person with a quiver of arrows." },
    { "character": "案", "on_yomi": "AN", "kun_yomi": "none", "meaning": "Plan / Suggest", "stroke_count": 10, "mnemonic": "Peaceful thought under a tree." },
    { "character": "設", "on_yomi": "SETSU", "kun_yomi": "mou-keru", "meaning": "Establish / Setup", "stroke_count": 11, "mnemonic": "Words used to set up a plan." },
    { "character": "置", "on_yomi": "CHI", "kun_yomi": "o-ku", "meaning": "Place / Put", "stroke_count": 13, "mnemonic": "A net marking a direct/correct spot." },
    { "character": "示", "on_yomi": "JI", "kun_yomi": "shime-su", "meaning": "Show / Indicate", "stroke_count": 5, "mnemonic": "An altar showing an omen/sign." },
    { "character": "表", "on_yomi": "HYOU", "kun_yomi": "omote", "meaning": "Surface / Table", "stroke_count": 8, "mnemonic": "A person wearing fur outside." },
    { "character": "現", "on_yomi": "GEN", "kun_yomi": "arawa-reru", "meaning": "Present / Actual", "stroke_count": 11, "mnemonic": "A jewel appearing to the eye." },
    { "character": "在", "on_yomi": "ZAI", "kun_yomi": "aru", "meaning": "Exist / Located", "stroke_count": 6, "mnemonic": "Earth marking a location." },
    { "character": "状", "on_yomi": "JOU", "kun_yomi": "none", "meaning": "Status / Letter", "stroke_count": 7, "mnemonic": "Condition marked by a dog-seal." },
    { "character": "態", "on_yomi": "TAI", "kun_yomi": "none", "meaning": "Appearance / State", "stroke_count": 14, "mnemonic": "The heart/state of an ability." },
    { "character": "象", "on_yomi": "ZOU", "kun_yomi": "none", "meaning": "Elephant / Image", "stroke_count": 12, "mnemonic": "The shape or image of an elephant." },
    { "character": "境", "on_yomi": "KYOU", "kun_yomi": "sakai", "meaning": "Boundary / State", "stroke_count": 14, "mnemonic": "Earth with a mirror/boundary line." },
    { "character": "域", "on_yomi": "IKI", "kun_yomi": "none", "meaning": "Region / Zone", "stroke_count": 11, "mnemonic": "Earth with a wall around it." },
    { "character": "型", "on_yomi": "KEI", "kun_yomi": "kata", "meaning": "Model / Mold", "stroke_count": 9, "mnemonic": "Earth shaped into a formal mold." },
    { "character": "式", "on_yomi": "SHIKI", "kun_yomi": "none", "meaning": "Formula / Style", "stroke_count": 6, "mnemonic": "A ceremony/rule involving a weapon." },
    { "character": "法", "on_yomi": "HOU", "kun_yomi": "none", "meaning": "Law / Method", "stroke_count": 8, "mnemonic": "Water that goes away; natural law." }
];

let internalDups = new Set();
let baselineDups = new Set();
let uniqueL10 = [];
let seenInL10 = new Set();

rawL10.forEach(entry => {
    if (seenInL10.has(entry.character)) {
        internalDups.add(entry.character);
    } else if (baseline.has(entry.character)) {
        baselineDups.add(entry.character);
    } else {
        uniqueL10.push(entry);
    }
    seenInL10.add(entry.character);
});

console.log('Internal Duplicates:', Array.from(internalDups).join(', '));
console.log('Baseline Duplicates:', Array.from(baselineDups).join(', '));
console.log('Unique L10 Count:', uniqueL10.length);
console.log('Need to replace:', (Array.from(internalDups).length + Array.from(baselineDups).length), 'Kanji');
