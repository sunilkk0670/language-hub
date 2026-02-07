const fs = require('fs');
const path = require('path');

// Full L21 raw data from user
const l21Raw = [
    { "character": "駁", "on_yomi": "BAKU", "kun_yomi": "none", "meaning": "Refute / Contradict / Mixed", "stroke_count": 14, "mnemonic": "A horse and a cross/crossing; clashing or refuting." },
    { "character": "馴", "on_yomi": "JUN", "kun_yomi": "na-reru", "meaning": "Tame / Familiar / Accustomed", "stroke_count": 13, "mnemonic": "A horse and a stream/river; flowing into a tame state." },
    { "character": "馳", "on_yomi": "CHI", "kun_yomi": "ha-seru", "meaning": "Run / Gallop / Dispatch", "stroke_count": 13, "mnemonic": "A horse and a person/also; galloping quickly." },
    { "character": "馼", "on_yomi": "BUN", "kun_yomi": "none", "meaning": "Red-maned horse", "stroke_count": 14, "mnemonic": "A horse with a literary/patterned mane." },
    { "character": "駐", "on_yomi": "CHUU", "kun_yomi": "none", "meaning": "Station / Reside / Park", "stroke_count": 15, "mnemonic": "A horse stopping at a pillar or station." },
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
    { "character": "精", "on_yomi": "SEI", "kun_yomi": "none", "meaning": "Refined / Spirit / Vitality", "stroke_count": 14, "mnemonic": "Rice that is blue/pure and clean; refined energy." },
    { "character": "糖", "on_yomi": "TOU", "kun_yomi": "none", "meaning": "Sugar", "stroke_count": 16, "mnemonic": "Rice and a building standing on earth; sweet." },
    { "character": "糞", "on_yomi": "FUN", "kun_yomi": "kuso", "meaning": "Excrement / Feces", "stroke_count": 17, "mnemonic": "Rice and different items discarded as waste." },
    { "character": "糟", "on_yomi": "SOU", "kun_yomi": "kasu", "meaning": "Dregs / Sediment / Waste", "stroke_count": 17, "mnemonic": "Rice and an official/manager's leftovers; dregs." },
    { "character": "糠", "on_yomi": "KOU", "kun_yomi": "nuka", "meaning": "Rice bran", "stroke_count": 17, "mnemonic": "Rice and a healthy/stable measure; bran." },
    { "character": "糧", "on_yomi": "RYOU", "kun_yomi": "kate", "meaning": "Provisions / Food / Rations", "stroke_count": 18, "mnemonic": "Rice measured out for the village; sustenance." },
    { "character": "糯", "on_yomi": "DA", "kun_yomi": "mochi", "meaning": "Glutinous rice", "stroke_count": 20, "mnemonic": "Rice that is soft and sticky like a helper." },
    { "character": "糴", "on_yomi": "TEKI", "kun_yomi": "none", "meaning": "Buying grain", "stroke_count": 22, "mnemonic": "Rice and entering; buying grain into storage." },
    { "character": "糶", "on_yomi": "CHOU", "kun_yomi": "none", "meaning": "Selling grain", "stroke_count": 25, "mnemonic": "Rice and a dipper; selling grain out." },
    { "character": "糾", "on_yomi": "KYUU", "kun_yomi": "none", "meaning": "Twist / Investigate / Examine", "stroke_count": 9, "mnemonic": "Threads being twisted together to find the truth." },
    { "character": "約", "on_yomi": "YAKU", "kun_yomi": "none", "meaning": "Promise / Approx / Contract", "stroke_count": 9, "mnemonic": "Tying threads to make a firm promise." },
    { "character": "級", "on_yomi": "KYUU", "kun_yomi": "none", "meaning": "Grade / Level / Class", "stroke_count": 9, "mnemonic": "Thread reaching a certain level or step." },
    { "character": "綱", "on_yomi": "KOU", "kun_yomi": "tsuna", "meaning": "Rope / Cord / Cable", "stroke_count": 14, "mnemonic": "Threads that are strong like a hill or mountain." },
    { "character": "網", "on_yomi": "MOU", "kun_yomi": "ami", "meaning": "Net / Network", "stroke_count": 14, "mnemonic": "Threads and a net/boundary; a network." },
    { "character": "綿", "on_yomi": "MEN", "kun_yomi": "wata", "meaning": "Cotton / Wadding", "stroke_count": 14, "mnemonic": "Threads that are soft like a towel or cloth." },
    { "character": "総", "on_yomi": "SOU", "kun_yomi": "none", "meaning": "General / Whole / Total", "stroke_count": 14, "mnemonic": "Threads bundled for a public or whole view." },
    { "character": "綴", "on_yomi": "TEI", "kun_yomi": "tsuzu-ru", "meaning": "Compose / Spell / Bind", "stroke_count": 14, "mnemonic": "Threads and a stop/stay; binding a text." },
    { "character": "練", "on_yomi": "REN", "kun_yomi": "ne-ru", "meaning": "Practice / Refine / Train", "stroke_count": 14, "mnemonic": "Threads boiled and selected for refinement." },
    { "character": "緯", "on_yomi": "I", "kun_yomi": "none", "meaning": "Latitude / Woof", "stroke_count": 15, "mnemonic": "Threads and a leather/hide; horizontal weave." },
    { "character": "縁", "on_yomi": "EN", "kun_yomi": "fuchi", "meaning": "Relation / Edge / Fate", "stroke_count": 15, "mnemonic": "Threads and a pig/decision; a fated connection." },
    { "character": "縄", "on_yomi": "JOU", "kun_yomi": "nawa", "meaning": "Rope / Cord", "stroke_count": 15, "mnemonic": "Threads and a frog/eel; a twisted cord." },
    { "character": "縦", "on_yomi": "JUU", "kun_yomi": "tate", "meaning": "Vertical / Length", "stroke_count": 16, "mnemonic": "Threads and a follower/accompany; vertical line." },
    { "character": "縛", "on_yomi": "BAKU", "kun_yomi": "shiba-ru", "meaning": "Bind / Restrain / Tie", "stroke_count": 16, "mnemonic": "Tying specialized threads to restrain someone." },
    { "character": "緻", "on_yomi": "CHI", "kun_yomi": "none", "meaning": "Delicate / Precise / Fine", "stroke_count": 16, "mnemonic": "Threads woven with a focused, delicate result." },
    { "character": "繕", "on_yomi": "ZEN", "kun_yomi": "tsukuro-u", "meaning": "Repair / Mend / Patch", "stroke_count": 18, "mnemonic": "Threads used to restore a proper or just state." },
    { "character": "繭", "on_yomi": "KEN", "kun_yomi": "mayu", "meaning": "Cocoon", "stroke_count": 18, "mnemonic": "Threads covering a worm/insect in a grass shell." },
    { "character": "纂", "on_yomi": "SAN", "kun_yomi": "none", "meaning": "Compile / Edit", "stroke_count": 19, "mnemonic": "Bamboo slips and threads; compiling a text." },
    { "character": "纏", "on_yomi": "TEN", "kun_yomi": "mato-meru", "meaning": "Settle / Collect / Gather", "stroke_count": 21, "mnemonic": "Threads and a store; gathering items together." },
    { "character": "纜", "on_yomi": "RAN", "kun_yomi": "tomozuna", "meaning": "Cable / Hawser / Rope", "stroke_count": 27, "mnemonic": "Threads that are thick and seen as a sample." },
    { "character": "言", "on_yomi": "GEN", "kun_yomi": "koto", "meaning": "Word / Say / Speech", "stroke_count": 7, "mnemonic": "A mouth speaking a sound/thought." },
    { "character": "計", "on_yomi": "KEI", "kun_yomi": "haka-ru", "meaning": "Plan / Measure / Gauge", "stroke_count": 9, "mnemonic": "Words and a cross; a calculated plan." },
    { "character": "訓", "on_yomi": "KUN", "kun_yomi": "none", "meaning": "Instruction / Lesson / Reading", "stroke_count": 10, "mnemonic": "Words that flow like a river; a lesson." },
    { "character": "記", "on_yomi": "KI", "kun_yomi": "shiru-su", "meaning": "Record / Write down", "stroke_count": 10, "mnemonic": "Words and self; writing a personal record." },
    { "character": "訪", "on_yomi": "HOU", "kun_yomi": "tazu-neru", "meaning": "Visit / Call on", "stroke_count": 11, "mnemonic": "Words and a direction/side; a social visit." },
    { "character": "許", "on_yomi": "KYO", "kun_yomi": "yuru-su", "meaning": "Permit / Forgive / Allow", "stroke_count": 11, "mnemonic": "Words spoken at noon; official permission." },
    { "character": "訳", "on_yomi": "YAKU", "kun_yomi": "wake", "meaning": "Translation / Reason / Meaning", "stroke_count": 11, "mnemonic": "Words and a scale/balance; translating meaning." },
    { "character": "訴", "on_yomi": "SO", "kun_yomi": "utta-eru", "meaning": "Accuse / Sue / Appeal", "stroke_count": 12, "mnemonic": "Words used for a formal/stable claim." },
    { "character": "診", "on_yomi": "SHIN", "kun_yomi": "mi-ru", "meaning": "Diagnosis / Examine", "stroke_count": 12, "mnemonic": "Words and a person/hair; examining a patient." },
    { "character": "証", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Evidence / Proof / Certificate", "stroke_count": 12, "mnemonic": "Words that are correct used as proof." },
    { "character": "詐", "on_yomi": "SA", "kun_yomi": "itsuwa-ru", "meaning": "Lie / Deceive / Fraud", "stroke_count": 12, "mnemonic": "Words used by a person/leader to deceive." },
    { "character": "詔", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Imperial edict", "stroke_count": 12, "mnemonic": "Words used to summon/altar; a decree." },
    { "character": "詠", "on_yomi": "EI", "kun_yomi": "yo-mu", "meaning": "Recite / Compose poetry", "stroke_count": 12, "mnemonic": "Words that flow forever like a poem." },
    { "character": "誇", "on_yomi": "KO", "kun_yomi": "poko-ru", "meaning": "Boast / Pride / Glory", "stroke_count": 13, "mnemonic": "Words that are big or extravagant." },
    { "character": "詳", "on_yomi": "SHOU", "kun_yomi": "kuwa-shii", "meaning": "Detailed / Full / Minute", "stroke_count": 13, "mnemonic": "Words as clear and detailed as a sheep." },
    { "character": "詫", "on_yomi": "TA", "kun_yomi": "wabi-ru", "meaning": "Apologize", "stroke_count": 13, "mnemonic": "Words spoken for a home or settlement." },
    { "character": "該", "on_yomi": "GAI", "kun_yomi": "none", "meaning": "Applicable / Relevant", "stroke_count": 13, "mnemonic": "Words spoken about a child/relevant person." },
    { "character": "詰", "on_yomi": "KITSU", "kun_yomi": "tsu-mu", "meaning": "Pack / Stuffed / Rebuke", "stroke_count": 13, "mnemonic": "Words and a person/hall; packing or rebuking." },
    { "character": "誌", "on_yomi": "SHI", "kun_yomi": "none", "meaning": "Magazine / Document", "stroke_count": 14, "mnemonic": "Words that are stored or recorded." },
    { "character": "認", "on_yomi": "NIN", "kun_yomi": "mito-meru", "meaning": "Recognize / Acknowledge / Admit", "stroke_count": 14, "mnemonic": "Words used to tolerate or admit a truth." },
    { "character": "誕", "on_yomi": "TAN", "kun_yomi": "none", "meaning": "Birth / Deception", "stroke_count": 15, "mnemonic": "Words spoken as a child/extension of life." },
    { "character": "誘", "on_yomi": "YUU", "kun_yomi": "saso-u", "meaning": "Invite / Entice / Lure", "stroke_count": 14, "mnemonic": "Words used for an excellent invitation." },
    { "character": "語", "on_yomi": "GO", "kun_yomi": "kata-ru", "meaning": "Language / Word / Narrative", "stroke_count": 14, "mnemonic": "Words and five mouths; a language." },
    { "character": "誠", "on_yomi": "SEI", "kun_yomi": "makoto", "meaning": "Sincerity / Truth / Fidelity", "stroke_count": 13, "mnemonic": "Words that form/become a true reality." },
    { "character": "誓", "on_yomi": "SEI", "kun_yomi": "chika-u", "meaning": "Oath / Vow / Pledge", "stroke_count": 14, "mnemonic": "Words spoken with a breakable/axe-like vow." },
    { "character": "誤", "on_yomi": "GO", "kun_yomi": "ayama-ru", "meaning": "Error / Mistake / Blunder", "stroke_count": 14, "mnemonic": "Words and a person/hall; a vocal slip/error." },
    { "character": "説", "on_yomi": "SETSU", "kun_yomi": "to-ku", "meaning": "Explain / Theory / Opinion", "stroke_count": 14, "mnemonic": "Words used to explain a situation." },
    { "character": "読", "on_yomi": "DOKU", "kun_yomi": "yo-mu", "meaning": "Read", "stroke_count": 14, "mnemonic": "Words and a shell/seller; reading for value." },
    { "character": "誰", "on_yomi": "SUI", "kun_yomi": "dare", "meaning": "Who", "stroke_count": 15, "mnemonic": "Words used to identify a person." },
    { "character": "課", "on_yomi": "KA", "kun_yomi": "none", "meaning": "Section / Lesson / Tax", "stroke_count": 15, "mnemonic": "Words and fruit/result; an official section." },
    { "character": "調", "on_yomi": "CHOU", "kun_yomi": "shira-beru", "meaning": "Survey / Tone / Investigate", "stroke_count": 15, "mnemonic": "Words used for a formal survey or tone." },
    { "character": "談", "on_yomi": "DAN", "kun_yomi": "none", "meaning": "Talk / Discourse / Chat", "stroke_count": 15, "mnemonic": "Words spoken around a fire; a discussion." },
    { "character": "請", "on_yomi": "SEI", "kun_yomi": "ko-u", "meaning": "Solicit / Request / Petition", "stroke_count": 15, "mnemonic": "Words that are clean/clear for a request." },
    { "character": "諭", "on_yomi": "YU", "kun_yomi": "sato-su", "meaning": "Admonish / Persuade", "stroke_count": 16, "mnemonic": "Words used for a formal lecture or admonishment." },
    { "character": "諸", "on_yomi": "SHO", "kun_yomi": "moro-moro", "meaning": "Various / Many / All", "stroke_count": 15, "mnemonic": "Various words spoken by many people." },
    { "character": "謎", "on_yomi": "MEI", "kun_yomi": "nazo", "meaning": "Riddle / Mystery / Puzzle", "stroke_count": 15, "mnemonic": "Words that are a lost/obscured walk; a puzzle." },
    { "character": "誹", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Slander / Libel", "stroke_count": 15, "mnemonic": "Words that are negative/wrong; slander." },
    { "character": "謙", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Humble / Modest", "stroke_count": 17, "mnemonic": "Words spoken with a double/concurrent heart." },
    { "character": "講", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Lecture / Structure", "stroke_count": 17, "mnemonic": "Words organized in a structure for a lecture." },
    { "character": "謝", "on_yomi": "SHA", "kun_yomi": "ayama-ru", "meaning": "Thank / Apologize / Dismiss", "stroke_count": 17, "mnemonic": "Words used to shoot out/dismiss an error." },
    { "character": "謹", "on_yomi": "KIN", "kun_yomi": "tsutsushi-mu", "meaning": "Discreet / Reverent", "stroke_count": 17, "mnemonic": "Words spoken with careful focus." },
    { "character": "識", "on_yomi": "SHIKI", "kun_yomi": "none", "meaning": "Knowledge / Discern / Know", "stroke_count": 19, "mnemonic": "Words and a mark of deep understanding." },
    { "character": "譜", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Musical score / Genealogy", "stroke_count": 19, "mnemonic": "Words showing a standard broad score." },
    { "character": "警", "on_yomi": "KEI", "kun_yomi": "none", "meaning": "Guard / Warning", "stroke_count": 19, "mnemonic": "Words used by a guard to warn/protect." },
    { "character": "議", "on_yomi": "GI", "kun_yomi": "none", "meaning": "Deliberation / Debate", "stroke_count": 20, "mnemonic": "Words used to discuss justice and truth." },
    { "character": "譲", "on_yomi": "JOU", "kun_yomi": "yuzu-ru", "meaning": "Concede / Hand over", "stroke_count": 20, "mnemonic": "Words used for a formal concession." },
    { "character": "譴", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Reprimand / Blame", "stroke_count": 21, "mnemonic": "Words used to send a person away in blame." },
    { "character": "讃", "on_yomi": "SAN", "kun_yomi": "ho-meru", "meaning": "Praise / Extol", "stroke_count": 22, "mnemonic": "Words used for formal assistance and praise." }
];

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

console.log('=== L21 RAW DATA AUDIT (THE GRAND FINALE!) ===');
console.log('Baseline unique count (L1-L20):', baseline.size);
console.log('L21 raw count:', l21Raw.length);

// Check for internal duplicates in L21
let seenInL21 = new Set();
let internalDups = new Set();
l21Raw.forEach(entry => {
    if (seenInL21.has(entry.character)) {
        internalDups.add(entry.character);
    }
    seenInL21.add(entry.character);
});

// Check for baseline duplicates
let baselineDups = new Set();
l21Raw.forEach(entry => {
    if (baseline.has(entry.character)) {
        baselineDups.add(entry.character);
    }
});

// Get unique L21
let uniqueL21 = [];
let uniqueSet = new Set();
l21Raw.forEach(entry => {
    if (!uniqueSet.has(entry.character) && !baseline.has(entry.character)) {
        uniqueL21.push(entry);
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

console.log('Unique L21 Count:', uniqueL21.length);
console.log('Need to add:', 100 - uniqueL21.length, 'Kanji');

if (uniqueL21.length === 100) {
    console.log('\n✅ L21 is perfect! Zero duplicates! THE GRAND FINALE IS READY!');
}
