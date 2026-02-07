const fs = require('fs');
const path = require('path');

// Full L20 raw data from user
const l20Raw = [
    { "character": "炒", "on_yomi": "SHOU", "kun_yomi": "ita-meru", "meaning": "Stir-fry / Roast", "stroke_count": 8, "mnemonic": "Fire and few/little; a quick fry with little oil." },
    { "character": "灼", "on_yomi": "SHAKU", "kun_yomi": "ara-ta", "meaning": "Burning / Miraculous", "stroke_count": 7, "mnemonic": "Fire and a dipper; intense burning light." },
    { "character": "炉", "on_yomi": "RO", "kun_yomi": "none", "meaning": "Hearth / Furnace", "stroke_count": 8, "mnemonic": "Fire at the household/door; a fireplace." },
    { "character": "炊", "on_yomi": "SUI", "kun_yomi": "ta-ku", "meaning": "Cook / Boil (rice)", "stroke_count": 8, "mnemonic": "Fire and a person yawning; steam from cooking." },
    { "character": "炙", "on_yomi": "SHA", "kun_yomi": "abu-ru", "meaning": "Roast / Grill", "stroke_count": 8, "mnemonic": "Flesh/meat over a fire; grilling." },
    { "character": "炸", "on_yomi": "SAKU", "kun_yomi": "none", "meaning": "Explode / Fry", "stroke_count": 9, "mnemonic": "Fire and work/production; a sudden burst/fry." },
    { "character": "炯", "on_yomi": "KEI", "kun_yomi": "none", "meaning": "Shining / Clear", "stroke_count": 9, "mnemonic": "Fire inside a perimeter/hall; clear light." },
    { "character": "炮", "on_yomi": "HOU", "kun_yomi": "none", "meaning": "Roast / Burn", "stroke_count": 9, "mnemonic": "Fire and a wrap/enclosure; roasting inside." },
    { "character": "烙", "on_yomi": "RAKU", "kun_yomi": "none", "meaning": "Brand / Sear", "stroke_count": 10, "mnemonic": "Fire and each/every; branding a mark." },
    { "character": "焉", "on_yomi": "EN", "kun_yomi": "none", "meaning": "How / Why / End", "stroke_count": 11, "mnemonic": "A bird above fire; a final state/question." },
    { "character": "焙", "on_yomi": "HOU", "kun_yomi": "none", "meaning": "Roast / Toast", "stroke_count": 12, "mnemonic": "Fire and a stand/official spot; toasting." },
    { "character": "焚", "on_yomi": "FUN", "kun_yomi": "ta-ku", "meaning": "Burn / Kindle", "stroke_count": 12, "mnemonic": "Forest on fire; kindling a large flame." },
    { "character": "煉", "on_yomi": "REN", "kun_yomi": "ne-ru", "meaning": "Refine / Knead with fire", "stroke_count": 13, "mnemonic": "Fire and selecting/boiling; refining metal." },
    { "character": "煌", "on_yomi": "KOU", "kun_yomi": "kagaya-ku", "meaning": "Glitter / Sparkle", "stroke_count": 13, "mnemonic": "Fire and an emperor/majesty; brilliant glitter." },
    { "character": "煎", "on_yomi": "SEN", "kun_yomi": "i-ru", "meaning": "Roast / Parch / Brew", "stroke_count": 13, "mnemonic": "Fire under a roof/front; parching tea." },
    { "character": "煽", "on_yomi": "SEN", "kun_yomi": "ao-gu", "meaning": "Fan / Instigate", "stroke_count": 14, "mnemonic": "Fire and a door/wing; fanning a flame/emotion." },
    { "character": "熔", "on_yomi": "YOU", "kun_yomi": "to-keru", "meaning": "Melt / Fuse", "stroke_count": 14, "mnemonic": "Fire in a valley/capacity; melting into a state." },
    { "character": "熨", "on_yomi": "I", "kun_yomi": "none", "meaning": "Iron (clothes)", "stroke_count": 15, "mnemonic": "Fire and a person pressing down with a hand." },
    { "character": "熾", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Blazing / Intense", "stroke_count": 16, "mnemonic": "Fire and a record/mark; a blazing intense fire." },
    { "character": "燗", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Warming sake", "stroke_count": 16, "mnemonic": "Fire and a gate/sun; heating liquid/sake." },
    { "character": "燃", "on_yomi": "NEN", "kun_yomi": "mo-eru", "meaning": "Burn / Blaze", "stroke_count": 16, "mnemonic": "Fire and meat/dog; a consuming blaze." },
    { "character": "燈", "on_yomi": "TOU", "kun_yomi": "tomoshibi", "meaning": "Lamp / Light", "stroke_count": 16, "mnemonic": "Fire climbing a tower/pedestal; a lamp." },
    { "character": "燐", "on_yomi": "RIN", "kun_yomi": "none", "meaning": "Phosphorus", "stroke_count": 16, "mnemonic": "Fire and a neighbor/aligned fire; glowing chemically." },
    { "character": "燔", "on_yomi": "HAN", "kun_yomi": "none", "meaning": "Burn / Roast", "stroke_count": 16, "mnemonic": "Fire and a turn/number; sacrificial roasting." },
    { "character": "燕", "on_yomi": "EN", "kun_yomi": "tsubame", "meaning": "Swallow (bird)", "stroke_count": 16, "mnemonic": "A bird over fire/earth; the shape of a swallow." },
    { "character": "燦", "on_yomi": "SAN", "kun_yomi": "none", "meaning": "Brilliant / Splendid", "stroke_count": 17, "mnemonic": "Fire and three/many suns; brilliant light." },
    { "character": "燭", "on_yomi": "SHOKU", "kun_yomi": "none", "meaning": "Candle / Light", "stroke_count": 17, "mnemonic": "Fire and an insect/track; a small flame/candle." },
    { "character": "燧", "on_yomi": "SUI", "kun_yomi": "none", "meaning": "Flint / Signal fire", "stroke_count": 17, "mnemonic": "Fire and following/accompanying; making sparks." },
    { "character": "燮", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Harmonize / Cook", "stroke_count": 17, "mnemonic": "Words between fires; harmonizing through heat." },
    { "character": "燻", "on_yomi": "KUN", "kun_yomi": "ibu-su", "meaning": "Smoke / Smolder", "stroke_count": 18, "mnemonic": "Fire and a heavy/black fragrance; smoking." },
    { "character": "燼", "on_yomi": "JIN", "kun_yomi": "none", "meaning": "Embers / Cinders", "stroke_count": 18, "mnemonic": "Fire and exhaust/limit; the last embers." },
    { "character": "燿", "on_yomi": "YOU", "kun_yomi": "kagaya-ku", "meaning": "Shine / Glitter", "stroke_count": 18, "mnemonic": "Fire and a bird/wing; shining brilliantly." },
    { "character": "爆", "on_yomi": "BAKU", "kun_yomi": "none", "meaning": "Explode / Burst", "stroke_count": 19, "mnemonic": "Fire and a violent sun/heat; an explosion." },
    { "character": "爍", "on_yomi": "SHAKU", "kun_yomi": "none", "meaning": "Glitter / Sparkle", "stroke_count": 19, "mnemonic": "Fire and happiness/joy; sparkling splendor." },
    { "character": "爐", "on_yomi": "RO", "kun_yomi": "none", "meaning": "Hearth / Kiln", "stroke_count": 20, "mnemonic": "Fire and a vessel/supervisor; a large kiln." },
    { "character": "爛", "on_yomi": "RAN", "kun_yomi": "tada-reru", "meaning": "Brilliant / Sore / Fester", "stroke_count": 21, "mnemonic": "Fire and an orchid/gate; brilliant but burning." },
    { "character": "爨", "on_yomi": "SAN", "kun_yomi": "kashigu", "meaning": "Cook / Kitchen", "stroke_count": 29, "mnemonic": "Hands and fire under a wood/roof building." },
    { "character": "贖", "on_yomi": "SHOKU", "kun_yomi": "agana-u", "meaning": "Redeem / Ransom", "stroke_count": 22, "mnemonic": "Shells/money and selling/buying; redeeming a debt." },
    { "character": "賎", "on_yomi": "SEN", "kun_yomi": "iya-shii", "meaning": "Lowly / Cheap", "stroke_count": 15, "mnemonic": "Shells and a balance/scraps; of low value." },
    { "character": "贅", "on_yomi": "ZEI", "kun_yomi": "none", "meaning": "Luxury / Extravagance", "stroke_count": 18, "mnemonic": "Shells and a specialty/specialized item; luxury." },
    { "character": "贈", "on_yomi": "ZOU", "kun_yomi": "oku-ru", "meaning": "Present / Give / Gift", "stroke_count": 18, "mnemonic": "Shells and a multi-level hall; giving a gift." },
    { "character": "贋", "on_yomi": "GAN", "kun_yomi": "nise", "meaning": "Counterfeit / Fake", "stroke_count": 19, "mnemonic": "Shells and a cliff/hall; fake money." },
    { "character": "贍", "on_yomi": "SEN", "kun_yomi": "none", "meaning": "Sufficient / Plentiful", "stroke_count": 20, "mnemonic": "Shells and an area/district being full." },
    { "character": "贏", "on_yomi": "EI", "kun_yomi": "none", "meaning": "Surplus / Gain / Profit", "stroke_count": 20, "mnemonic": "Shells inside a perimeter of gain." },
    { "character": "贐", "on_yomi": "SHIN", "kun_yomi": "hanamuke", "meaning": "Farewell gift", "stroke_count": 21, "mnemonic": "Shells given at the limit/exhaustion of a journey." },
    { "character": "贓", "on_yomi": "ZOU", "kun_yomi": "none", "meaning": "Stolen goods / Bribery", "stroke_count": 21, "mnemonic": "Shells hidden inside a building/organ." },
    { "character": "贔", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Favor / Patronage", "stroke_count": 21, "mnemonic": "Three shells together; heavy financial support." },
    { "character": "鳥", "on_yomi": "CHOU", "kun_yomi": "tori", "meaning": "Bird", "stroke_count": 11, "mnemonic": "The shape of a bird with crest and tail." },
    { "character": "鳳", "on_yomi": "HOU", "kun_yomi": "none", "meaning": "Phoenix (male)", "stroke_count": 14, "mnemonic": "Bird inside an enclosure; mythical phoenix." },
    { "character": "鳴", "on_yomi": "MEI", "kun_yomi": "na-ku", "meaning": "Chirp / Cry / Bark", "stroke_count": 14, "mnemonic": "Mouth and a bird; the sound of an animal." },
    { "character": "鳶", "on_yomi": "EN", "kun_yomi": "tobi", "meaning": "Black kite / Hawk", "stroke_count": 14, "mnemonic": "Bird and a hammer/strike; a bird of prey." },
    { "character": "鴨", "on_yomi": "OU", "kun_yomi": "kamo", "meaning": "Wild duck", "stroke_count": 16, "mnemonic": "Bird and first/armor; a sturdy duck." },
    { "character": "鶏", "on_yomi": "KEI", "kun_yomi": "niwatori", "meaning": "Chicken / Hen", "stroke_count": 19, "mnemonic": "Hand and a bird; domestic chicken." },
    { "character": "鵬", "on_yomi": "HOU", "kun_yomi": "none", "meaning": "Giant bird (legendary)", "stroke_count": 19, "mnemonic": "Bird and moon/friend; a massive bird." },
    { "character": "鶚", "on_yomi": "GAKU", "kun_yomi": "none", "meaning": "Osprey", "stroke_count": 20, "mnemonic": "Bird and a shell/peak; a fish hawk." },
    { "character": "鵠", "on_yomi": "KOKU", "kun_yomi": "kugui", "meaning": "Swan / Goal", "stroke_count": 18, "mnemonic": "Bird and a report/inform; a white swan." },
    { "character": "鶫", "on_yomi": "none", "kun_yomi": "tsugumi", "meaning": "Thrush", "stroke_count": 19, "mnemonic": "Bird and a forest/east; a woodland bird." },
    { "character": "鶴", "on_yomi": "KAKU", "kun_yomi": "tsuru", "meaning": "Crane / Stork", "stroke_count": 21, "mnemonic": "Bird found near a peak/summit; long-necked." },
    { "character": "鶸", "on_yomi": "none", "kun_yomi": "hiwa", "meaning": "Siskin (bird)", "stroke_count": 21, "mnemonic": "Bird and weak/bow; a small fragile bird." },
    { "character": "鶯", "on_yomi": "OU", "kun_yomi": "uguisu", "meaning": "Bush warbler", "stroke_count": 21, "mnemonic": "Bird and fire/crown; the herald of spring." },
    { "character": "鶺", "on_yomi": "SEKI", "kun_yomi": "none", "meaning": "Wagtail", "stroke_count": 21, "mnemonic": "Bird and spine/back; a bird that wags." },
    { "character": "鶩", "on_yomi": "BOKU", "kun_yomi": "none", "meaning": "Duck / Tame", "stroke_count": 21, "mnemonic": "Bird and duty/work; a domesticated duck." },
    { "character": "鶲", "on_yomi": "none", "kun_yomi": "hitaki", "meaning": "Flycatcher", "stroke_count": 21, "mnemonic": "Bird and an old man/feathers; a small bird." },
    { "character": "鶻", "on_yomi": "KOTSU", "kun_yomi": "none", "meaning": "Falcon", "stroke_count": 21, "mnemonic": "Bird and a bone/frame; a strong predator." },
    { "character": "鷽", "on_yomi": "GAKU", "kun_yomi": "none", "meaning": "Bullfinch", "stroke_count": 24, "mnemonic": "Bird under a roof study/gate." },
    { "character": "鴇", "on_yomi": "HOU", "kun_yomi": "toki", "meaning": "Ibis / Wild goose", "stroke_count": 16, "mnemonic": "Bird and a dagger/spoon; long-billed." },
    { "character": "鴉", "on_yomi": "A", "kun_yomi": "karasu", "meaning": "Crow / Raven", "stroke_count": 15, "mnemonic": "Bird and a gap/tooth; the black raven." },
    { "character": "鴫", "on_yomi": "none", "kun_yomi": "shigi", "meaning": "Snipe", "stroke_count": 16, "mnemonic": "Bird and a field/earth; a wading bird." },
    { "character": "鸛", "on_yomi": "KAN", "kun_yomi": "kounotori", "meaning": "Stork", "stroke_count": 28, "mnemonic": "Bird and a supervisor/watch; a large stork." }
];

// Load baseline (L1-L19)
const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json',
    'kanji_mastery_l16.json', 'kanji_mastery_l17.json', 'kanji_mastery_l18.json',
    'kanji_mastery_l19.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

console.log('=== L20 RAW DATA AUDIT ===');
console.log('Baseline unique count (L1-L19):', baseline.size);
console.log('L20 raw count:', l20Raw.length);

// Check for internal duplicates in L20
let seenInL20 = new Set();
let internalDups = new Set();
l20Raw.forEach(entry => {
    if (seenInL20.has(entry.character)) {
        internalDups.add(entry.character);
    }
    seenInL20.add(entry.character);
});

// Check for baseline duplicates
let baselineDups = new Set();
l20Raw.forEach(entry => {
    if (baseline.has(entry.character)) {
        baselineDups.add(entry.character);
    }
});

// Get unique L20
let uniqueL20 = [];
let uniqueSet = new Set();
l20Raw.forEach(entry => {
    if (!uniqueSet.has(entry.character) && !baseline.has(entry.character)) {
        uniqueL20.push(entry);
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

console.log('Unique L20 Count:', uniqueL20.length);
console.log('Need to replace:', 100 - uniqueL20.length, 'Kanji');

if (uniqueL20.length === 100) {
    console.log('\n✅ L20 is perfect! Zero duplicates!');
}
