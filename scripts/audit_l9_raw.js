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
    'kanji_mastery_l8.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

const rawL9 = [
    { "character": "優", "on_yomi": "YUU", "kun_yomi": "yasa-shii", "meaning": "Gentle / Superior", "stroke_count": 17, "mnemonic": "A person acting with a gentle heart." },
    { "character": "秀", "on_yomi": "SHUU", "kun_yomi": "hi-ideru", "meaning": "Excellence", "stroke_count": 7, "mnemonic": "Grain growing tall and excellent." },
    { "character": "厳", "on_yomi": "GEN", "kun_yomi": "kibi-shii", "meaning": "Strict / Severe", "stroke_count": 17, "mnemonic": "A stern command shouted from a cliff." },
    { "character": "松", "on_yomi": "SHOU", "kun_yomi": "matsu", "meaning": "Pine tree", "stroke_count": 8, "mnemonic": "A tree that is a public/common sight." },
    { "character": "宅", "on_yomi": "TAKU", "kun_yomi": "none", "meaning": "Home / Residence", "stroke_count": 6, "mnemonic": "A house where people live and settle." },
    { "character": "勤", "on_yomi": "KIN", "kun_yomi": "tsuto-meru", "meaning": "Diligence / Service", "stroke_count": 12, "mnemonic": "Hard work/labor in an office/field." },
    { "character": "務", "on_yomi": "MU", "kun_yomi": "tsuto-meru", "meaning": "Duty / Task", "stroke_count": 11, "mnemonic": "Spear and power used for official work." },
    { "character": "就", "on_yomi": "SHUU", "kun_yomi": "tsu-ku", "meaning": "Take up / Settle", "stroke_count": 12, "mnemonic": "Settling into a capital/office position." },
    { "character": "招", "on_yomi": "SHOU", "kun_yomi": "mane-ku", "meaning": "Invite / Beckon", "stroke_count": 8, "mnemonic": "Hand beckoning someone to speak/join." },
    { "character": "承", "on_yomi": "SHOU", "kun_yomi": "uketama-waru", "meaning": "Accept / Consent", "stroke_count": 8, "mnemonic": "Hands accepting a stream of orders." },
    { "character": "技", "on_yomi": "GI", "kun_yomi": "waza", "meaning": "Skill / Art", "stroke_count": 7, "mnemonic": "A hand performing a specialized branch of work." },
    { "character": "術", "on_yomi": "JUTSU", "kun_yomi": "sube", "meaning": "Method / Art", "stroke_count": 11, "mnemonic": "A road and a plant used as a technique." },
    { "character": "備", "on_yomi": "BI", "kun_yomi": "sona-eru", "meaning": "Provide / Equip", "stroke_count": 12, "mnemonic": "A person with a quiver of arrows ready." },
    { "character": "準", "on_yomi": "JUN", "kun_yomi": "none", "meaning": "Standard / Level", "stroke_count": 13, "mnemonic": "Water at the same level as a falcon." },
    { "character": "備", "on_yomi": "BI", "kun_yomi": "sona-eru", "meaning": "Prepare", "stroke_count": 12, "mnemonic": "Person with arrows in a quiver; ready." },
    { "character": "営", "on_yomi": "EI", "kun_yomi": "itona-mu", "meaning": "Management / Run", "stroke_count": 12, "mnemonic": "Managing fire under a roof; business." },
    { "character": "団", "on_yomi": "DAN", "kun_yomi": "none", "meaning": "Group / Corps", "stroke_count": 6, "mnemonic": "A specialized item kept in an enclosure." },
    { "character": "体", "on_yomi": "TAI", "kun_yomi": "karada", "meaning": "Body", "stroke_count": 7, "mnemonic": "A person standing by a root/tree; a trunk." },
    { "character": "資", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Capital / Resource", "stroke_count": 13, "mnemonic": "Next to shells (money); resources." },
    { "character": "源", "on_yomi": "GEN", "kun_yomi": "minamoto", "meaning": "Source / Origin", "stroke_count": 13, "mnemonic": "Water from a spring in the meadow." },
    { "character": "委", "on_yomi": "I", "kun_yomi": "maka-seru", "meaning": "Committee / Entrust", "stroke_count": 8, "mnemonic": "A woman carrying grain; entrusted with duty." },
    { "character": "託", "on_yomi": "TAKU", "kun_yomi": "none", "meaning": "Consign / Entrust", "stroke_count": 10, "mnemonic": "Words spoken to entrust a home/matter." },
    { "character": "属", "on_yomi": "ZOKU", "kun_yomi": "none", "meaning": "Belong / Genus", "stroke_count": 12, "mnemonic": "Belonging to a tail/following under a cover." },
    { "character": "官", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Government official", "stroke_count": 8, "mnemonic": "A large building for official use." },
    { "character": "察", "on_yomi": "SATSU", "kun_yomi": "none", "meaning": "Inspect / Guess", "stroke_count": 14, "mnemonic": "An altar under a roof; careful inspection." },
    { "character": "署", "on_yomi": "SHO", "kun_yomi": "none", "meaning": "Station / Office", "stroke_count": 13, "mnemonic": "A net marking an official person's post." },
    { "character": "諸", "on_yomi": "SHO", "kun_yomi": "moro-moro", "meaning": "Various / Many", "stroke_count": 15, "mnemonic": "Various words spoken by person after person." },
    { "character": "党", "on_yomi": "TOU", "kun_yomi": "none", "meaning": "Political party", "stroke_count": 10, "mnemonic": "Group under one roof with a brotherly bond." },
    { "character": "反", "on_yomi": "HAN", "kun_yomi": "so-ru", "meaning": "Anti- / Opposite", "stroke_count": 4, "mnemonic": "A cliff and a hand reaching back." },
    { "character": "対", "on_yomi": "TAI", "kun_yomi": "none", "meaning": "Versus / Match", "stroke_count": 7, "mnemonic": "A hand holding a mark against another." },
    { "character": "非", "on_yomi": "HI", "kun_yomi": "ara-zu", "meaning": "Non- / Fault", "stroke_count": 8, "mnemonic": "Wings turned away; wrong/negative." },
    { "character": "則", "on_yomi": "SOKU", "kun_yomi": "none", "meaning": "Rule / Law", "stroke_count": 9, "mnemonic": "A shell and a knife marking a standard." },
    { "character": "憲", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Constitution", "stroke_count": 16, "mnemonic": "Eye over a heart watching the law." },
    { "character": "政", "on_yomi": "SEI", "kun_yomi": "matsurigoto", "meaning": "Politics / Government", "stroke_count": 9, "mnemonic": "Correcting matters with a duty/strike." },
    { "character": "治", "on_yomi": "JI", "kun_yomi": "ona-osu", "meaning": "Govern / Cure", "stroke_count": 8, "mnemonic": "Watering and managing a platform/state." },
    { "character": "経", "on_yomi": "KEI", "kun_yomi": "he-ru", "meaning": "Manage / Warp", "stroke_count": 11, "mnemonic": "Pass through threads on a warp." },
    { "character": "済", "on_yomi": "SAI", "kun_yomi": "su-mu", "meaning": "Settle / Finish", "stroke_count": 11, "mnemonic": "Water crossing to settle an account." },
    { "character": "現", "on_yomi": "GEN", "kun_yomi": "arawa-reru", "meaning": "Appear / Present", "stroke_count": 11, "mnemonic": "A jewel/king appearing in sight." },
    { "character": "在", "on_yomi": "ZAI", "kun_yomi": "aru", "meaning": "Exist / Be at", "stroke_count": 6, "mnemonic": "Earth with a person/marker; existing." },
    { "character": "状", "on_yomi": "JOU", "kun_yomi": "none", "meaning": "Status / Letter", "stroke_count": 7, "mnemonic": "Condition marked by a dog-seal." },
    { "character": "様", "on_yomi": "YOU", "kun_yomi": "sama", "meaning": "Way / Honorific", "stroke_count": 14, "mnemonic": "Wood and sheep in water; the proper way." },
    { "character": "制", "on_yomi": "SEI", "kun_yomi": "none", "meaning": "Control / System", "stroke_count": 8, "mnemonic": "Cutting cloth systematically with a knife." },
    { "character": "規", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Rule / Standard", "stroke_count": 11, "mnemonic": "Watching a compass for a rule." },
    { "character": "格", "on_yomi": "KAKU", "kun_yomi": "none", "meaning": "Status / Case", "stroke_count": 10, "mnemonic": "Wood that fits a specific platform." },
    { "character": "型", "on_yomi": "KEI", "kun_yomi": "kata", "meaning": "Model / Mold", "stroke_count": 9, "mnemonic": "Earth shaped into a formal mold." },
    { "character": "像", "on_yomi": "ZOU", "kun_yomi": "none", "meaning": "Image / Statue", "stroke_count": 14, "mnemonic": "A person creating the shape of an elephant." },
    { "character": "現", "on_yomi": "GEN", "kun_yomi": "arawa-reru", "meaning": "Present / Actual", "stroke_count": 11, "mnemonic": "Jewel appearing to the eye." },
    { "character": "在", "on_yomi": "ZAI", "kun_yomi": "aru", "meaning": "Exist / Located", "stroke_count": 6, "mnemonic": "Earth marking a location." },
    { "character": "資", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Capital / Resource", "stroke_count": 13, "mnemonic": "Resource next to shells (money)." },
    { "character": "源", "on_yomi": "GEN", "kun_yomi": "minamoto", "meaning": "Origin / Source", "stroke_count": 13, "mnemonic": "Water from an original meadow spring." },
    { "character": "境", "on_yomi": "KYOU", "kun_yomi": "sakai", "meaning": "Boundary / State", "stroke_count": 14, "mnemonic": "Earth with a mirror/boundary line." },
    { "character": "域", "on_yomi": "IKI", "kun_yomi": "none", "meaning": "Region / Zone", "stroke_count": 11, "mnemonic": "Earth with a wall around it." },
    { "character": "護", "on_yomi": "GO", "kun_yomi": "mamo-ru", "meaning": "Protect / Guard", "stroke_count": 20, "mnemonic": "Words and a grass shield used for protection." },
    { "character": "防", "on_yomi": "BOU", "kun_yomi": "fuse-gu", "meaning": "Prevent / Defend", "stroke_count": 7, "mnemonic": "A hill acting as a barrier/defense." },
    { "character": "警", "on_yomi": "KEI", "kun_yomi": "none", "meaning": "Guard / Warning", "stroke_count": 19, "mnemonic": "Words used by a guard to warn." },
    { "character": "視", "on_yomi": "SHI", "kun_yomi": "mi-ru", "meaning": "Inspect / View", "stroke_count": 11, "mnemonic": "Looking at an altar or omen." },
    { "character": "設", "on_yomi": "SETSU", "kun_yomi": "mou-keru", "meaning": "Establish / Setup", "stroke_count": 11, "mnemonic": "Words used to set up a plan." },
    { "character": "備", "on_yomi": "BI", "kun_yomi": "sona-eru", "meaning": "Equip / Prepare", "stroke_count": 12, "mnemonic": "A person with a quiver of arrows ready." },
    { "character": "独", "on_yomi": "DOKU", "kun_yomi": "hitori", "meaning": "Alone / Solo", "stroke_count": 9, "mnemonic": "A dog and an insect; unique/alone." },
    { "character": "占", "on_yomi": "SEN", "kun_yomi": "ura-nau", "meaning": "Occupy / Fortune", "stroke_count": 5, "mnemonic": "Mouth telling a fortune from a bone crack." },
    { "character": "比", "on_yomi": "HI", "kun_yomi": "kura-beru", "meaning": "Compare", "stroke_count": 4, "mnemonic": "Two people standing side-by-side." },
    { "character": "再", "on_yomi": "SAI", "kun_yomi": "futata-bi", "meaning": "Again / Repeat", "stroke_count": 6, "mnemonic": "A line crossing over twice; repeated." },
    { "character": "接", "on_yomi": "SETSU", "kun_yomi": "tsu-gu", "meaning": "Touch / Contact", "stroke_count": 11, "mnemonic": "Hand touching a person standing nearby." },
    { "character": "説", "on_yomi": "SETSU", "kun_yomi": "to-ku", "meaning": "Explain / Theory", "stroke_count": 14, "mnemonic": "Words used to explain a situation." },
    { "character": "証", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Proof / Evidence", "stroke_count": 12, "mnemonic": "Correct words used as proof." },
    { "character": "録", "on_yomi": "ROKU", "kun_yomi": "none", "meaning": "Record / Tape", "stroke_count": 16, "mnemonic": "Metal and water carved into a record." },
    { "character": "過", "on_yomi": "KA", "kun_yomi": "su-giru", "meaning": "Overdo / Pass", "stroke_count": 12, "mnemonic": "Walking too far past a marker." },
    { "character": "等", "on_yomi": "TOU", "kun_yomi": "hitoshii", "meaning": "Equal / Rank", "stroke_count": 12, "mnemonic": "Bamboo slips standing together equally." },
    { "character": "級", "on_yomi": "KYUU", "kun_yomi": "none", "meaning": "Grade / Class", "stroke_count": 9, "mnemonic": "Thread reaching a certain level." },
    { "character": "初", "on_yomi": "SHO", "kun_yomi": "haji-me", "meaning": "First / Beginning", "stroke_count": 7, "mnemonic": "Cutting cloth for the first time." },
    { "character": "中", "on_yomi": "CHUU", "kun_yomi": "naka", "meaning": "Middle / Inside", "stroke_count": 4, "mnemonic": "Line through the center of a box." },
    { "character": "終", "on_yomi": "SHUU", "kun_yomi": "o-waru", "meaning": "End / Finish", "stroke_count": 11, "mnemonic": "Winter is the end of the year's thread." },
    { "character": "予", "on_yomi": "YO", "kun_yomi": "none", "meaning": "In advance", "stroke_count": 4, "mnemonic": "A shuttle used in weaving; pre-planned." },
    { "character": "約", "on_yomi": "YAKU", "kun_yomi": "none", "meaning": "Promise / Approx", "stroke_count": 9, "mnemonic": "Tying threads to make a promise." },
    { "character": "期", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Period / Term", "stroke_count": 12, "mnemonic": "The moon rising over a village/sieve." },
    { "character": "限", "on_yomi": "GEN", "kun_yomi": "kagi-ru", "meaning": "Limit / Boundary", "stroke_count": 9, "mnemonic": "A silver barrier marking a limit." },
    { "character": "準", "on_yomi": "JUN", "kun_yomi": "none", "meaning": "Standard / Level", "stroke_count": 13, "mnemonic": "Water at the same level as a falcon." },
    { "character": "備", "on_yomi": "BI", "kun_yomi": "sona-eru", "meaning": "Equip / Prepare", "stroke_count": 12, "mnemonic": "A person with a quiver of arrows." },
    { "character": "案", "on_yomi": "AN", "kun_yomi": "none", "meaning": "Plan / Suggest", "stroke_count": 10, "mnemonic": "Peaceful thought under a tree." },
    { "character": "望", "on_yomi": "BOU", "kun_yomi": "nozo-mu", "meaning": "Desire / Hope", "stroke_count": 11, "mnemonic": "Person watching the moon from earth." },
    { "character": "願", "on_yomi": "GAN", "kun_yomi": "nega-u", "meaning": "Request / Wish", "stroke_count": 19, "mnemonic": "A head bowing for an original wish." },
    { "character": "欲", "on_yomi": "YOKU", "kun_yomi": "ho-shii", "meaning": "Greed / Want", "stroke_count": 11, "mnemonic": "A person yawning for more valley/greed." },
    { "character": "求", "on_yomi": "KYUU", "kun_yomi": "moto-meru", "meaning": "Seek / Request", "stroke_count": 7, "mnemonic": "Water dots; seeking a stream." },
    { "character": "探", "on_yomi": "TAN", "kun_yomi": "saga-su", "meaning": "Search / Probe", "stroke_count": 11, "mnemonic": "Hand searching a hole in a tree." },
    { "character": "検", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Examination", "stroke_count": 12, "mnemonic": "Wood and a seal used for checking." },
    { "character": "査", "on_yomi": "SA", "kun_yomi": "none", "meaning": "Investigation", "stroke_count": 9, "mnemonic": "Inspecting wood on a platform." },
    { "character": "験", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Test / Effect", "stroke_count": 18, "mnemonic": "A horse at a gate for an exam." },
    { "character": "試", "on_yomi": "SHI", "kokoro-miru": "none", "meaning": "Try / Test", "stroke_count": 13, "mnemonic": "Testing words for a challenge." },
    { "character": "効", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Effect / Efficacy", "stroke_count": 8, "mnemonic": "Applying power to exchange a result." },
    { "character": "果", "on_yomi": "KA", "kun_yomi": "ha-tasu", "meaning": "Result / Fruit", "stroke_count": 8, "mnemonic": "Fruit on a tree in the field." },
    { "character": "成", "on_yomi": "SEI", "kun_yomi": "na-ru", "meaning": "Become / Form", "stroke_count": 6, "mnemonic": "Using power/weapon to complete a victory." },
    { "character": "能", "on_yomi": "NOU", "kun_yomi": "none", "meaning": "Ability / Talent", "stroke_count": 10, "mnemonic": "A bear-like shape representing talent." },
    { "character": "力", "on_yomi": "RYOKU", "kun_yomi": "chikara", "meaning": "Power / Strength", "stroke_count": 2, "mnemonic": "A muscle or an arm exerting power." },
    { "character": "強", "on_yomi": "KYOU", "kun_yomi": "tsuyo-i", "meaning": "Strong", "stroke_count": 11, "mnemonic": "An insect with a powerful bow." },
    { "character": "弱", "on_yomi": "JAKU", "kun_yomi": "yowa-i", "meaning": "Weak", "stroke_count": 10, "mnemonic": "Two small bows with feathers; flimsy." },
    { "character": "勝", "on_yomi": "SHOU", "kun_yomi": "ka-tsu", "meaning": "Victory / Win", "stroke_count": 12, "mnemonic": "Power and a boat/flesh; a hard-won victory." },
    { "character": "負", "on_yomi": "FU", "kun_yomi": "ma-keru", "meaning": "Lose / Defeat", "stroke_count": 9, "mnemonic": "A person carrying a burden of shells/money." },
    { "character": "労", "on_yomi": "ROU", "kun_yomi": "none", "meaning": "Labor / Effort", "stroke_count": 7, "mnemonic": "Fire over power; intense work." },
    { "character": "働", "on_yomi": "DOU", "kun_yomi": "hatara-ku", "meaning": "Work", "stroke_count": 13, "mnemonic": "A person applying power to a movement/task." },
    { "character": "業", "on_yomi": "GYOU", "kun_yomi": "waza", "meaning": "Business / Task", "stroke_count": 13, "mnemonic": "Drums and tools used in production work." }
];

let internalDups = new Set();
let baselineDups = new Set();
let uniqueL9 = [];
let seenInL9 = new Set();

rawL9.forEach(entry => {
    if (seenInL9.has(entry.character)) {
        internalDups.add(entry.character);
    } else if (baseline.has(entry.character)) {
        baselineDups.add(entry.character);
    } else {
        uniqueL9.push(entry);
    }
    seenInL9.add(entry.character);
});

console.log('Internal Duplicates:', Array.from(internalDups).join(', '));
console.log('Baseline Duplicates:', Array.from(baselineDups).join(', '));
console.log('Unique L9 Count:', uniqueL9.length);
