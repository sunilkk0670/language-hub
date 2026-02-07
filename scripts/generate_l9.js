const fs = require('fs');
const path = require('path');

const baselineDataFiles = [
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
baselineDataFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

const candidates = [
    { "character": "秀", "on_yomi": "SHUU", "kun_yomi": "hi-ideru", "meaning": "Excellence", "stroke_count": 7, "mnemonic": "Grain growing tall and excellent." },
    { "character": "松", "on_yomi": "SHOU", "kun_yomi": "matsu", "meaning": "Pine tree", "stroke_count": 8, "mnemonic": "A tree that is a public/common sight." },
    { "character": "宅", "on_yomi": "TAKU", "kun_yomi": "none", "meaning": "Home / Residence", "stroke_count": 6, "mnemonic": "A house where people live and settle." },
    { "character": "勤", "on_yomi": "KIN", "kun_yomi": "tsuto-meru", "meaning": "Diligence / Service", "stroke_count": 12, "mnemonic": "Hard work/labor in an office/field." },
    { "character": "就", "on_yomi": "SHUU", "kun_yomi": "tsu-ku", "meaning": "Take up / Settle", "stroke_count": 12, "mnemonic": "Settling into a capital/office position." },
    { "character": "託", "on_yomi": "TAKU", "kun_yomi": "none", "meaning": "Consign / Entrust", "stroke_count": 10, "mnemonic": "Words spoken to entrust a home/matter." },
    { "character": "憲", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Constitution", "stroke_count": 16, "mnemonic": "Eye over a heart watching the law." },
    { "character": "律", "on_yomi": "RITSU", "kun_yomi": "none", "meaning": "Law / Rhythm", "stroke_count": 9, "mnemonic": "A set of steps and a brush/writing; law." },
    { "character": "判", "on_yomi": "HAN", "kun_yomi": "waka-ru", "meaning": "Judge / Stamp", "stroke_count": 7, "mnemonic": "Half-stamp used as a signature." },
    { "character": "刑", "on_yomi": "KEI", "kun_yomi": "none", "meaning": "Penalty / Punishment", "stroke_count": 6, "mnemonic": "Sword/knife at a scaffold/post." },
    { "character": "罰", "on_yomi": "BATSU", "kun_yomi": "none", "meaning": "Penalty / Fine", "stroke_count": 14, "mnemonic": "Net for catching and words for judgment." },
    { "character": "裁", "on_yomi": "SAI", "kun_yomi": "saba-ku", "meaning": "Judge / Cut", "stroke_count": 12, "mnemonic": "Cutting clothes according to a pattern/judgment." },
    { "character": "執", "on_yomi": "SHITSU", "kun_yomi": "to-ru", "meaning": "Administer / Execute", "stroke_count": 11, "mnemonic": "Hand and a specialized tool being handled." },
    { "character": "府", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Government office / Prefecture", "stroke_count": 8, "mnemonic": "A large building for official use." },
    { "character": "省", "on_yomi": "SHOU", "kun_yomi": "kaeri-miru", "meaning": "Ministry / Reflect", "stroke_count": 9, "mnemonic": "Looking with a small/keen eye; reflect." },
    { "character": "庁", "on_yomi": "CHOU", "kun_yomi": "none", "meaning": "Agency / Office", "stroke_count": 5, "mnemonic": "A large building for a local agency." },
    { "character": "衆", "on_yomi": "SHUU", "kun_yomi": "none", "meaning": "Masses / Public", "stroke_count": 12, "mnemonic": "Three people under a big sun; the masses." },
    { "character": "参", "on_yomi": "SAN", "kun_yomi": "mai-ru", "meaning": "Participate / Visit", "stroke_count": 8, "mnemonic": "Connecting three points with hair/feet." },
    { "character": "継", "on_yomi": "KEI", "kun_yomi": "tsu-gu", "meaning": "Inherit / Succeed", "stroke_count": 13, "mnemonic": "Thread (糸) and a grain/mark (米/乚) of legacy." },
    { "character": "績", "on_yomi": "SEKI", "kun_yomi": "none", "meaning": "Achievements / Merit", "stroke_count": 17, "mnemonic": "Thread and money (責); earning results." },
    { "character": "権", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Rights / Power", "stroke_count": 15, "mnemonic": "Wood and a bird marking authority." },
    { "character": "財", "on_yomi": "ZAI", "kun_yomi": "none", "meaning": "Wealth / Assets", "stroke_count": 10, "mnemonic": "Shells (money) that exist/remain." },
    { "character": "贈", "on_yomi": "ZOU", "kun_yomi": "oku-ru", "meaning": "Gift / Present", "stroke_count": 18, "mnemonic": "Shells (money) given for an occasion (曽)." },
    { "character": "賞", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Prize / Award", "stroke_count": 15, "mnemonic": "Official shells (money) given for an official sign." },
    { "character": "税", "on_yomi": "ZEI", "kun_yomi": "none", "meaning": "Tax", "stroke_count": 12, "mnemonic": "Grain (禾) and an exchange/transfer." },
    { "character": "銭", "on_yomi": "SEN", "kun_yomi": "zeni", "meaning": "Coin / Money", "stroke_count": 14, "mnemonic": "Metal (金) used as a small amount." },
    { "character": "額", "on_yomi": "GAKU", "kun_yomi": "hitai", "meaning": "Amount / Forehead", "stroke_count": 18, "mnemonic": "Header/head marking an official amount/top." },
    { "character": "純", "on_yomi": "JUN", "kun_yomi": "none", "meaning": "Pure", "stroke_count": 10, "mnemonic": "Thread that is of high quality/pure." },
    { "character": "粋", "on_yomi": "SUI", "kun_yomi": "iki", "meaning": "Pure / Chic", "stroke_count": 10, "mnemonic": "Rice grain that is refined/pure." },
    { "character": "精", "on_yomi": "SEI", "kun_yomi": "none", "meaning": "Spirit / Refined", "stroke_count": 14, "mnemonic": "Rice grain that is clean and pure spirit." },
    { "character": "憤", "on_yomi": "FUN", "kun_yomi": "iki-doru", "meaning": "Indignant", "stroke_count": 15, "mnemonic": "Heart feeling a violent/angry pulse." },
    { "character": "悦", "on_yomi": "ETSU", "kun_yomi": "none", "meaning": "Joy / Delight", "stroke_count": 10, "mnemonic": "Heart feeling a gentle/positive flow." },
    { "character": "哀", "on_yomi": "AI", "kun_yomi": "awa-re", "meaning": "Pathetic / Sorrow", "stroke_count": 9, "mnemonic": "A mouth wrapped in clothes/sorrow." },
    { "character": "愁", "on_yomi": "SHUU", "kun_yomi": "ure-i", "meaning": "Sorrow / Grief", "stroke_count": 13, "mnemonic": "Autumn (秋) in the heart (心); sadness." },
    { "character": "憶", "on_yomi": "OKU", "kun_yomi": "none", "meaning": "Memories / Recall", "stroke_count": 15, "mnemonic": "Heart and an idea/thought occurring again." },
    { "character": "括", "on_yomi": "KATSU", "kun_yomi": "none", "meaning": "Fasten / Summarize", "stroke_count": 9, "mnemonic": "Hand and a tongue; speaking to summarize." },
    { "character": "訂", "on_yomi": "TEI", "kun_yomi": "none", "meaning": "Revise / Correct", "stroke_count": 9, "mnemonic": "Words spoken to set something right (丁)." },
    { "character": "糾", "on_yomi": "KYUU", "kun_yomi": "adasu", "meaning": "Twist / Investigate", "stroke_count": 9, "mnemonic": "Thread (糸) being twisted together." },
    { "character": "練", "on_yomi": "REN", "kun_yomi": "ne-ru", "meaning": "Practice / Refine", "stroke_count": 14, "mnemonic": "Thread and a task/work showing effort." },
    { "character": "給", "on_yomi": "KYUU", "kun_yomi": "none", "meaning": "Salary / Supply", "stroke_count": 12, "mnemonic": "Thread and a set/match; a total supply." },
    { "character": "締", "on_yomi": "TEI", "kun_yomi": "shi-meru", "meaning": "Tighten / Tie", "stroke_count": 15, "mnemonic": "Thread and an imperial mark; a firm bond." },
    { "character": "維", "on_yomi": "I", "kun_yomi": "none", "meaning": "Maintain / Fiber", "stroke_count": 14, "mnemonic": "Thread and a bird indicating a link." },
    { "character": "綱", "on_yomi": "KOU", "kun_yomi": "tsuna", "meaning": "Cable / Rope", "stroke_count": 14, "mnemonic": "Thread and a hill/mountain peak; a strong rope." },
    { "character": "網", "on_yomi": "MOU", "kun_yomi": "ami", "meaning": "Net / Network", "stroke_count": 14, "mnemonic": "Thread and a frame/enclosure; a catching net." },
    { "character": "総", "on_yomi": "SOU", "kun_yomi": "none", "meaning": "General / Total", "stroke_count": 14, "mnemonic": "Thread and a public/window view; general." },
    { "character": "緒", "on_yomi": "SHO", "kun_yomi": "o", "meaning": "Beginning / Cord", "stroke_count": 14, "mnemonic": "Thread and a person acting as a source." },
    { "character": "織", "on_yomi": "SHIKI", "kun_yomi": "o-ru", "meaning": "Weave / Fabric", "stroke_count": 18, "mnemonic": "Thread and a mark of deep knowledge/pattern." },
    { "character": "繕", "on_yomi": "ZEN", "kun_yomi": "tsukuro-u", "meaning": "Repair / Mend", "stroke_count": 18, "mnemonic": "Thread and a task that is good/virtuous (善)." },
    { "character": "繭", "on_yomi": "KEN", "kun_yomi": "mayu", "meaning": "Cocoon", "stroke_count": 18, "mnemonic": "Grass and an insect inside a thread shell." },
    { "character": "繰", "on_yomi": "SOU", "kun_yomi": "ku-ru", "meaning": "Spin / Wind", "stroke_count": 19, "mnemonic": "Thread and many hands in a tree; winding." },
    { "character": "缶", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Can / Tin", "stroke_count": 6, "mnemonic": "A container with a small opening; a jar." },
    { "character": "罷", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Dismiss / Cease", "stroke_count": 15, "mnemonic": "A net and ability; stopping talent." },
    { "character": "羅", "on_yomi": "RA", "kun_yomi": "none", "meaning": "Gauze / Rome", "stroke_count": 19, "mnemonic": "A net and a bird flying in a pattern." },
    { "character": "翻", "on_yomi": "HON", "kun_yomi": "hirugae-su", "meaning": "Flip / Translate", "stroke_count": 18, "mnemonic": "Wings and a specialty/task; flipping over." },
    { "character": "訳", "on_yomi": "YAKU", "kun_yomi": "wake", "meaning": "Translation / Reason", "stroke_count": 7, "mnemonic": "Words and a scale of measurement; meaning." },
    { "character": "診", "on_yomi": "SHIN", "kun_yomi": "mi-ru", "meaning": "Diagnosis", "stroke_count": 12, "mnemonic": "Words used by an official (参) for checkup." },
    { "character": "詳", "on_yomi": "SHOU", "kun_yomi": "kuwa-shii", "meaning": "Detailed", "stroke_count": 13, "mnemonic": "Words that describe items like sheep; detailed." },
    { "character": "詠", "on_yomi": "EI", "kun_yomi": "yo-mu", "meaning": "Recite / Poetry", "stroke_count": 12, "mnemonic": "Words used for a timeless/long flow (永)." },
    { "character": "詩", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Poem", "stroke_count": 13, "mnemonic": "Words spoken at a temple/special place." },
    { "character": "詰", "on_yomi": "KITSU", "kun_yomi": "tsu-meru", "meaning": "Stuffed / Pressed", "stroke_count": 13, "mnemonic": "Words that are auspicious/fixed (吉); tight." },
    { "character": "謡", "on_yomi": "YOU", "kun_yomi": "utai", "meaning": "Noh chant / Folk song", "stroke_count": 16, "mnemonic": "Words with a bright/vibrant flow (揺)." },
    { "character": "謙", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Humble", "stroke_count": 17, "mnemonic": "Words spoken to bridge the gap (兼)." },
    { "character": "誰", "on_yomi": "SUI", "kun_yomi": "dare", "meaning": "Who", "stroke_count": 15, "mnemonic": "Words asking about a person/bird." },
    { "character": "謝", "on_yomi": "SHA", "kun_yomi": "ayama-ru", "meaning": "Apologize / Thank", "stroke_count": 17, "mnemonic": "Words that hit the mark/aim." },
    { "character": "譲", "on_yomi": "JOU", "kun_yomi": "yuzu-ru", "meaning": "Concede / Transfer", "stroke_count": 20, "mnemonic": "Words and a path that is helpful/diverse (襄)." },
    { "character": "豚", "on_yomi": "TON", "kun_yomi": "buta", "meaning": "Pork / Pig", "stroke_count": 11, "mnemonic": "Meat (月) of a beast/hog (豕)." },
    { "character": "象", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Elephant / Image", "stroke_count": 12, "mnemonic": "The large shape of an elephant." },
    { "character": "豪", "on_yomi": "GOU", "kun_yomi": "none", "meaning": "Splendid / Australia", "stroke_count": 14, "mnemonic": "A tall/noble building with a pig/hog." },
    { "character": "賄", "on_yomi": "WAI", "kun_yomi": "makanau", "meaning": "Bribe / Feed", "stroke_count": 13, "mnemonic": "Shells (money) that match/possess." },
    { "character": "賦", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Levy / Endow", "stroke_count": 15, "mnemonic": "Shells (money) and a military/task (武)." },
    { "character": "賢", "on_yomi": "KEN", "kun_yomi": "kashi-koi", "meaning": "Wise / Clever", "stroke_count": 16, "mnemonic": "Shells (money) and deep subjects." },
    { "character": "購", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Purchase", "stroke_count": 17, "mnemonic": "Shells (money) that are a match/joint set." },
    {
        "character": "賛", "(truncated 11520 bytes)
const finalL9 = [];
        candidates.forEach(entry => {
            if (!baseline.has(entry.character) && finalL9.length < 100) {
                finalL9.push(entry);
            }
        });

        fs.writeFileSync('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data\\kanji_mastery_l9.json', JSON.stringify(finalL9, null, 2));
        console.log('Saved 100 unique Kanji to kanji_mastery_l9.json');
