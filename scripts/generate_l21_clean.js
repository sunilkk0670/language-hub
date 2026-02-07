const fs = require('fs');
const path = require('path');

// Load baseline (L1-L20)
const baselineFiles = [
    'kanji_mastery_l1.json', 'kanji_mastery_l2.json', 'kanji_mastery_l3.json',
    'kanji_mastery_l4.json', 'kanji_mastery_l5.json', 'kanji_mastery_l6.json',
    'kanji_mastery_l7.json', 'kanji_mastery_l8.json', 'kanji_mastery_l9.json',
    'kanji_mastery_l10.json', 'kanji_mastery_l11.json', 'kanji_mastery_l12.json',
    'kanji_mastery_l13.json', 'kanji_mastery_l14.json', 'kanji_mastery_l15.json',
    'kanji_mastery_l16.json', 'kanji_mastery_l17.json', 'kanji_mastery_l18.json',
    'kanji_mastery_l19.json', 'kanji_mastery_l20.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

console.log('Generating clean L21 - THE GRAND FINALE...');
console.log('Baseline size:', baseline.size);

const finalL21 = [];
const seenInL21 = new Set();

// Add all unique Kanji from user data (33 unique)
const userUniqueKanji = [
    { "character": "駁", "on_yomi": "BAKU", "kun_yomi": "none", "meaning": "Refute / Contradict / Mixed", "stroke_count": 14, "mnemonic": "A horse and a cross/crossing; clashing or refuting." },
    { "character": "馴", "on_yomi": "JUN", "kun_yomi": "na-reru", "meaning": "Tame / Familiar / Accustomed", "stroke_count": 13, "mnemonic": "A horse and a stream/river; flowing into a tame state." },
    { "character": "馳", "on_yomi": "CHI", "kun_yomi": "ha-seru", "meaning": "Run / Gallop / Dispatch", "stroke_count": 13, "mnemonic": "A horse and a person/also; galloping quickly." },
    { "character": "馼", "on_yomi": "BUN", "kun_yomi": "none", "meaning": "Red-maned horse", "stroke_count": 14, "mnemonic": "A horse with a literary/patterned mane." },
    { "character": "騨", "on_yomi": "TAN", "kun_yomi": "none", "meaning": "Dapple-grey horse", "stroke_count": 19, "mnemonic": "A horse with a simple/pure patterned skin." },
    { "character": "驍", "on_yomi": "GYOU", "kun_yomi": "none", "meaning": "Brave / Good horse", "stroke_count": 22, "mnemonic": "A horse and a high/shining peak; a brave steed." },
    { "character": "驟", "on_yomi": "SHUU", "kun_yomi": "none", "meaning": "Sudden / Frequent", "stroke_count": 24, "mnemonic": "A horse and a bunch/cluster; a sudden stampede." },
    { "character": "驥", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Great horse / Talent", "stroke_count": 27, "mnemonic": "A horse with a specialized/field-like talent." },
    { "character": "驩", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Joy / Happy horse", "stroke_count": 28, "mnemonic": "A horse and an owl/shouting; a joyful trot." },
    { "character": "驫", "on_yomi": "HYOU", "kun_yomi": "none", "meaning": "Horses running", "stroke_count": 30, "mnemonic": "Three horses together; a massive stampede." },
    { "character": "粒", "on_yomi": "RYUU", "kun_yomi": "tsubu", "meaning": "Grain / Particle", "stroke_count": 11, "mnemonic": "Rice that stands up as a single grain." },
    { "character": "粗", "on_yomi": "SO", "kun_yomi": "ara-i", "meaning": "Coarse / Rough", "stroke_count": 11, "mnemonic": "Rice in its original or coarse state." },
    { "character": "粘", "on_yomi": "NEN", "kun_yomi": "neba-ru", "meaning": "Sticky / Glutinous / Persist", "stroke_count": 11, "mnemonic": "Rice that sticks to a point or station." },
    { "character": "粧", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Cosmetics / Adorn", "stroke_count": 12, "mnemonic": "Rice and a hall standing together; makeup." },
    { "character": "粥", "on_yomi": "SHUKU", "kun_yomi": "kayu", "meaning": "Rice porridge / Gruel", "stroke_count": 12, "mnemonic": "Rice and a bow; thin, weak porridge." },
    { "character": "糖", "on_yomi": "TOU", "kun_yomi": "none", "meaning": "Sugar", "stroke_count": 16, "mnemonic": "Rice and a building standing on earth; sweet." },
    { "character": "糞", "on_yomi": "FUN", "kun_yomi": "kuso", "meaning": "Excrement / Feces", "stroke_count": 17, "mnemonic": "Rice and different items discarded as waste." },
    { "character": "糟", "on_yomi": "SOU", "kun_yomi": "kasu", "meaning": "Dregs / Sediment / Waste", "stroke_count": 17, "mnemonic": "Rice and an official/manager's leftovers; dregs." },
    { "character": "糠", "on_yomi": "KOU", "kun_yomi": "nuka", "meaning": "Rice bran", "stroke_count": 17, "mnemonic": "Rice and a healthy/stable measure; bran." },
    { "character": "糧", "on_yomi": "RYOU", "kun_yomi": "kate", "meaning": "Provisions / Food / Rations", "stroke_count": 18, "mnemonic": "Rice measured out for the village; sustenance." },
    { "character": "糯", "on_yomi": "DA", "kun_yomi": "mochi", "meaning": "Glutinous rice", "stroke_count": 20, "mnemonic": "Rice that is soft and sticky like a helper." },
    { "character": "糴", "on_yomi": "TEKI", "kun_yomi": "none", "meaning": "Buying grain", "stroke_count": 22, "mnemonic": "Rice and entering; buying grain into storage." },
    { "character": "糶", "on_yomi": "CHOU", "kun_yomi": "none", "meaning": "Selling grain", "stroke_count": 25, "mnemonic": "Rice and a dipper; selling grain out." },
    { "character": "綴", "on_yomi": "TEI", "kun_yomi": "tsuzu-ru", "meaning": "Compose / Spell / Bind", "stroke_count": 14, "mnemonic": "Threads and a stop/stay; binding a text." },
    { "character": "緯", "on_yomi": "I", "kun_yomi": "none", "meaning": "Latitude / Woof", "stroke_count": 15, "mnemonic": "Threads and a leather/hide; horizontal weave." },
    { "character": "縦", "on_yomi": "JUU", "kun_yomi": "tate", "meaning": "Vertical / Length", "stroke_count": 16, "mnemonic": "Threads and a follower/accompany; vertical line." },
    { "character": "縛", "on_yomi": "BAKU", "kun_yomi": "shiba-ru", "meaning": "Bind / Restrain / Tie", "stroke_count": 16, "mnemonic": "Tying specialized threads to restrain someone." },
    { "character": "緻", "on_yomi": "CHI", "kun_yomi": "none", "meaning": "Delicate / Precise / Fine", "stroke_count": 16, "mnemonic": "Threads woven with a focused, delicate result." },
    { "character": "繕", "on_yomi": "ZEN", "kun_yomi": "tsukuro-u", "meaning": "Repair / Mend / Patch", "stroke_count": 18, "mnemonic": "Threads used to restore a proper or just state." },
    { "character": "繭", "on_yomi": "KEN", "kun_yomi": "mayu", "meaning": "Cocoon", "stroke_count": 18, "mnemonic": "Threads covering a worm/insect in a grass shell." },
    { "character": "纂", "on_yomi": "SAN", "kun_yomi": "none", "meaning": "Compile / Edit", "stroke_count": 19, "mnemonic": "Bamboo slips and threads; compiling a text." },
    { "character": "纏", "on_yomi": "TEN", "kun_yomi": "mato-meru", "meaning": "Settle / Collect / Gather", "stroke_count": 21, "mnemonic": "Threads and a store; gathering items together." },
    { "character": "纜", "on_yomi": "RAN", "kun_yomi": "tomozuna", "meaning": "Cable / Hawser / Rope", "stroke_count": 27, "mnemonic": "Threads that are thick and seen as a sample." }
];

userUniqueKanji.forEach(entry => {
    if (!baseline.has(entry.character) && !seenInL21.has(entry.character)) {
        finalL21.push(entry);
        seenInL21.add(entry.character);
    }
});

console.log('Added unique from user data:', finalL21.length);

// Now add 67 new unique N1 Kanji (horse馬, rice米, thread糸, word言 radicals)
const additional67 = [
    { "character": "駄", "on_yomi": "DA", "kun_yomi": "none", "meaning": "Burdensome / Pack horse / Futile", "stroke_count": 14, "mnemonic": "A horse and a large/big burden; a pack horse." },
    { "character": "駅", "on_yomi": "EKI", "kun_yomi": "none", "meaning": "Station", "stroke_count": 14, "mnemonic": "A horse and a measure/post; a station." },
    { "character": "駆", "on_yomi": "KU", "kun_yomi": "ka-keru", "meaning": "Run / Drive / Gallop", "stroke_count": 14, "mnemonic": "A horse and a district/area; galloping." },
    { "character": "駒", "on_yomi": "KU", "kun_yomi": "koma", "meaning": "Pony / Horse / Piece (shogi)", "stroke_count": 15, "mnemonic": "A horse and a phrase/sentence; a small horse." },
    { "character": "駕", "on_yomi": "GA", "kun_yomi": "none", "meaning": "Palanquin / Vehicle", "stroke_count": 15, "mnemonic": "A horse and a frame/addition; a carriage." },
    { "character": "駿", "on_yomi": "SHUN", "kun_yomi": "none", "meaning": "Excellent horse / Swift", "stroke_count": 17, "mnemonic": "A horse and a high/peak; a swift steed." },
    { "character": "騎", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Ride / Cavalry", "stroke_count": 18, "mnemonic": "A horse that is strange/odd; riding." },
    { "character": "騒", "on_yomi": "SOU", "kun_yomi": "sawa-gu", "meaning": "Noisy / Disturbance", "stroke_count": 18, "mnemonic": "A horse and insects/bugs; a commotion." },
    { "character": "験", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Test / Verify / Effect", "stroke_count": 18, "mnemonic": "A horse and a check/inspect; testing." },
    { "character": "騰", "on_yomi": "TOU", "kun_yomi": "none", "meaning": "Rise / Soar / Advance", "stroke_count": 20, "mnemonic": "A horse and a moon/month; rising up." },
    { "character": "驚", "on_yomi": "KYOU", "kun_yomi": "odoro-ku", "meaning": "Surprise / Astonish", "stroke_count": 22, "mnemonic": "A horse and respect/awe; being startled." },
    { "character": "粉", "on_yomi": "FUN", "kun_yomi": "kona", "meaning": "Powder / Flour", "stroke_count": 10, "mnemonic": "Rice and a divide/split; ground powder." },
    { "character": "粋", "on_yomi": "SUI", "kun_yomi": "iki", "meaning": "Essence / Refined / Chic", "stroke_count": 10, "mnemonic": "Rice and ten/complete; pure essence." },
    { "character": "粛", "on_yomi": "SHUKU", "kun_yomi": "none", "meaning": "Solemn / Respectful / Purge", "stroke_count": 11, "mnemonic": "Rice and a person/respect; solemn." },
    { "character": "粗", "on_yomi": "SO", "kun_yomi": "ara-i", "meaning": "Coarse / Rough / Crude", "stroke_count": 11, "mnemonic": "Rice and a moreover/also; rough." },
    { "character": "粘", "on_yomi": "NEN", "kun_yomi": "neba-ru", "meaning": "Sticky / Adhesive", "stroke_count": 11, "mnemonic": "Rice and a point/occupy; sticky." },
    { "character": "粟", "on_yomi": "ZOKU", "kun_yomi": "awa", "meaning": "Millet / Grain", "stroke_count": 12, "mnemonic": "West and rice; a grain type." },
    { "character": "粧", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Makeup / Adorn", "stroke_count": 12, "mnemonic": "Rice and a building/hall; cosmetics." },
    { "character": "粳", "on_yomi": "KOU", "kun_yomi": "uruchi", "meaning": "Non-glutinous rice", "stroke_count": 13, "mnemonic": "Rice and a more/further; regular rice." },
    { "character": "粽", "on_yomi": "SAKU", "kun_yomi": "chimaki", "meaning": "Rice dumpling", "stroke_count": 14, "mnemonic": "Rice and a bundle/wrap; wrapped rice." },
    { "character": "糀", "on_yomi": "KOU", "kun_yomi": "kouji", "meaning": "Rice malt / Koji", "stroke_count": 14, "mnemonic": "Rice and a flower/bloom; fermented rice." },
    { "character": "糊", "on_yomi": "KO", "kun_yomi": "nori", "meaning": "Paste / Glue / Starch", "stroke_count": 15, "mnemonic": "Rice and a lake/old; sticky paste." },
    { "character": "糎", "on_yomi": "SENCHI", "kun_yomi": "none", "meaning": "Centimeter", "stroke_count": 9, "mnemonic": "Rice and a unit/measure; metric unit." },
    { "character": "糒", "on_yomi": "HI", "kun_yomi": "hoshii", "meaning": "Dried rice / Provisions", "stroke_count": 16, "mnemonic": "Rice and a prepare/ready; dried food." },
    { "character": "糖", "on_yomi": "TOU", "kun_yomi": "none", "meaning": "Sugar / Sweet", "stroke_count": 16, "mnemonic": "Rice and a building/hall; sweetness." },
    { "character": "糜", "on_yomi": "BI", "kun_yomi": "none", "meaning": "Porridge / Decay", "stroke_count": 17, "mnemonic": "Rice and a deer/beauty; soft porridge." },
    { "character": "糞", "on_yomi": "FUN", "kun_yomi": "kuso", "meaning": "Feces / Excrement", "stroke_count": 17, "mnemonic": "Rice and a different/various; waste." },
    { "character": "糟", "on_yomi": "SOU", "kun_yomi": "kasu", "meaning": "Dregs / Lees", "stroke_count": 17, "mnemonic": "Rice and a chief/official; leftovers." },
    { "character": "糠", "on_yomi": "KOU", "kun_yomi": "nuka", "meaning": "Rice bran / Chaff", "stroke_count": 17, "mnemonic": "Rice and a healthy/well; outer layer." },
    { "character": "糧", "on_yomi": "RYOU", "kun_yomi": "kate", "meaning": "Food / Provisions", "stroke_count": 18, "mnemonic": "Rice and a quantity/measure; rations." },
    { "character": "糯", "on_yomi": "DA", "kun_yomi": "mochi", "meaning": "Glutinous rice / Sticky rice", "stroke_count": 20, "mnemonic": "Rice and a soft/weak; sticky rice." },
    { "character": "糲", "on_yomi": "REI", "kun_yomi": "none", "meaning": "Unpolished rice", "stroke_count": 25, "mnemonic": "Rice and a severe/strict; rough rice." },
    { "character": "紀", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Chronicle / Record / Era", "stroke_count": 9, "mnemonic": "Thread and self/oneself; recording." },
    { "character": "紅", "on_yomi": "KOU", "kun_yomi": "beni", "meaning": "Crimson / Red / Rouge", "stroke_count": 9, "mnemonic": "Thread and a craft/work; red dye." },
    { "character": "紋", "on_yomi": "MON", "kun_yomi": "none", "meaning": "Crest / Pattern / Mon", "stroke_count": 10, "mnemonic": "Thread and a sentence/text; a pattern." },
    { "character": "納", "on_yomi": "NOU", "kun_yomi": "osa-meru", "meaning": "Supply / Accept / Pay", "stroke_count": 10, "mnemonic": "Thread and a inside/within; storing." },
    { "character": "紐", "on_yomi": "CHUU", "kun_yomi": "himo", "meaning": "String / Cord / Strap", "stroke_count": 10, "mnemonic": "Thread and a ball/circle; a cord." },
    { "character": "純", "on_yomi": "JUN", "kun_yomi": "none", "meaning": "Pure / Genuine / Unmixed", "stroke_count": 10, "mnemonic": "Thread and a tun/屯; pure thread." },
    { "character": "紗", "on_yomi": "SHA", "kun_yomi": "none", "meaning": "Gauze / Thin silk", "stroke_count": 10, "mnemonic": "Thread and a few/little; thin fabric." },
    { "character": "紡", "on_yomi": "BOU", "kun_yomi": "tsumuugu", "meaning": "Spin / Spinning", "stroke_count": 10, "mnemonic": "Thread and a direction/side; spinning." },
    { "character": "索", "on_yomi": "SAKU", "kun_yomi": "none", "meaning": "Search / Rope / Cord", "stroke_count": 10, "mnemonic": "Thread and a ten/complete; searching." },
    { "character": "紫", "on_yomi": "SHI", "kun_yomi": "murasaki", "meaning": "Purple / Violet", "stroke_count": 12, "mnemonic": "This and thread; purple dye." },
    { "character": "累", "on_yomi": "RUI", "kun_yomi": "none", "meaning": "Accumulate / Involve / Trouble", "stroke_count": 11, "mnemonic": "Thread and a rice/field; piling up." },
    { "character": "紺", "on_yomi": "KON", "kun_yomi": "none", "meaning": "Navy blue / Dark blue", "stroke_count": 11, "mnemonic": "Thread and a sweet/gan; deep blue." },
    { "character": "紬", "on_yomi": "CHUU", "kun_yomi": "tsumugi", "meaning": "Pongee / Tsumugi silk", "stroke_count": 11, "mnemonic": "Thread and a reason/cause; woven silk." },
    { "character": "紳", "on_yomi": "SHIN", "kun_yomi": "none", "meaning": "Gentleman / Sash", "stroke_count": 11, "mnemonic": "Thread and a extend/stretch; a sash." },
    { "character": "紹", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Introduce / Inherit", "stroke_count": 11, "mnemonic": "Thread and a summon/call; introducing." },
    { "character": "紺", "on_yomi": "KON", "kun_yomi": "none", "meaning": "Dark blue / Navy", "stroke_count": 11, "mnemonic": "Thread and a sweet/pleasant; navy blue." },
    { "character": "終", "on_yomi": "SHUU", "kun_yomi": "o-waru", "meaning": "End / Finish / Complete", "stroke_count": 11, "mnemonic": "Thread and a winter/end; finishing." },
    { "character": "組", "on_yomi": "SO", "kun_yomi": "kumi", "meaning": "Group / Set / Assemble", "stroke_count": 11, "mnemonic": "Thread and a moreover/also; organizing." },
    { "character": "経", "on_yomi": "KEI", "kun_yomi": "he-ru", "meaning": "Pass / Sutra / Longitude", "stroke_count": 11, "mnemonic": "Thread and a path/go; passing through." },
    { "character": "結", "on_yomi": "KETSU", "kun_yomi": "musu-bu", "meaning": "Tie / Bind / Join", "stroke_count": 12, "mnemonic": "Thread and a good/auspicious; tying." },
    { "character": "絞", "on_yomi": "KOU", "kun_yomi": "shibo-ru", "meaning": "Strangle / Wring / Squeeze", "stroke_count": 12, "mnemonic": "Thread and a mix/cross; wringing." },
    { "character": "絡", "on_yomi": "RAKU", "kun_yomi": "kara-mu", "meaning": "Entwine / Connect / Link", "stroke_count": 12, "mnemonic": "Thread and a each/every; entangling." },
    { "character": "絢", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Brilliant / Gorgeous", "stroke_count": 12, "mnemonic": "Thread and a revolve/rotate; gorgeous." },
    { "character": "給", "on_yomi": "KYUU", "kun_yomi": "none", "meaning": "Supply / Provide / Salary", "stroke_count": 12, "mnemonic": "Thread and a together/combine; supplying." },
    { "character": "統", "on_yomi": "TOU", "kun_yomi": "su-beru", "meaning": "Unify / Control / Lineage", "stroke_count": 12, "mnemonic": "Thread and a fill/충; unifying." },
    { "character": "絵", "on_yomi": "KAI", "kun_yomi": "e", "meaning": "Picture / Painting / Drawing", "stroke_count": 12, "mnemonic": "Thread and a meeting/会; a picture." },
    { "character": "絶", "on_yomi": "ZETSU", "kun_yomi": "ta-eru", "meaning": "Discontinue / Sever / Cut off", "stroke_count": 12, "mnemonic": "Thread and a color/色; cutting off." },
    { "character": "絹", "on_yomi": "KEN", "kun_yomi": "kinu", "meaning": "Silk", "stroke_count": 13, "mnemonic": "Thread and a mouth/opening; silk fabric." },
    { "character": "継", "on_yomi": "KEI", "kun_yomi": "tsu-gu", "meaning": "Inherit / Succeed / Continue", "stroke_count": 13, "mnemonic": "Thread and a rice/米; continuing." },
    { "character": "続", "on_yomi": "ZOKU", "kun_yomi": "tsuzu-ku", "meaning": "Continue / Series / Sequel", "stroke_count": 13, "mnemonic": "Thread and a sell/売; continuing." },
    { "character": "維", "on_yomi": "I", "kun_yomi": "none", "meaning": "Maintain / Fiber / Rope", "stroke_count": 14, "mnemonic": "Thread and a turkey/隹; maintaining." },
    { "character": "綜", "on_yomi": "SOU", "kun_yomi": "none", "meaning": "Arrange / Synthesize", "stroke_count": 14, "mnemonic": "Thread and a religion/宗; synthesizing." },
    { "character": "綸", "on_yomi": "RIN", "kun_yomi": "none", "meaning": "Silk thread / Fishing line", "stroke_count": 14, "mnemonic": "Thread and a wheel/倫; silk thread." },
    { "character": "綺", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Beautiful / Elegant / Figured", "stroke_count": 14, "mnemonic": "Thread and a strange/奇; elegant." },
    { "character": "綾", "on_yomi": "RIN", "kun_yomi": "aya", "meaning": "Twill / Pattern / Figured cloth", "stroke_count": 14, "mnemonic": "Thread and a hill/陵; patterned fabric." }
];

let added = 0;
additional67.forEach(entry => {
    if (!seenInL21.has(entry.character) && !baseline.has(entry.character) && finalL21.length < 100) {
        finalL21.push(entry);
        seenInL21.add(entry.character);
        added++;
    }
});

console.log('Added:', added);
console.log('Final L21 count:', finalL21.length);

// Save
const outputPath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', 'kanji_mastery_l21.json');
fs.writeFileSync(outputPath, JSON.stringify(finalL21, null, 2), 'utf8');
console.log('Saved kanji_mastery_l21.json');

if (finalL21.length === 100) {
    console.log('✅✅✅ L21 COMPLETE WITH 100 KANJI! THE GRAND FINALE IS READY! ✅✅✅');
    console.log('🎊🎊🎊 2,100 KANJI CURRICULUM COMPLETE! 🎊🎊🎊');
}
