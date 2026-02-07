const fs = require('fs');
const path = require('path');

// Load baseline (L1-L11)
const baselineFiles = [
    'kanji_mastery_l1.json',
    'kanji_mastery_l2.json',
    'kanji_mastery_l3.json',
    'kanji_mastery_l4.json',
    'kanji_mastery_l5.json',
    'kanji_mastery_l6.json',
    'kanji_mastery_l7.json',
    'kanji_mastery_l8.json',
    'kanji_mastery_l9.json',
    'kanji_mastery_l10.json',
    'kanji_mastery_l11.json'
];

let baseline = new Set();
baselineFiles.forEach(file => {
    const filePath = path.join('c:\\Users\\Sindhu\\Desktop\\chirp-polly\\firestore_data', file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        data.forEach(entry => baseline.add(entry.character));
    }
});

console.log('Baseline unique count (L1-L11):', baseline.size);

// L12 raw data - user provided
const l12Raw = [
    { "character": "党", "on_yomi": "TOU", "kun_yomi": "none", "meaning": "Political Party / Group", "stroke_count": 10, "mnemonic": "A group under one roof with a brotherly bond." },
    { "character": "頑", "on_yomi": "GAN", "kun_yomi": "none", "meaning": "Stubborn / Robust", "stroke_count": 13, "mnemonic": "A head that is as hard as a rock." },
    { "character": "凝", "on_yomi": "GYOU", "kun_yomi": "ko-ru", "meaning": "Freeze / Stiff / Absorbed", "stroke_count": 16, "mnemonic": "Ice and a person standing still in focus." },
    { "character": "範", "on_yomi": "HAN", "kun_yomi": "none", "meaning": "Example / Model / Range", "stroke_count": 15, "mnemonic": "Bamboo slips showing a formal pattern/rule." },
    { "character": "拠", "on_yomi": "KYO", "kun_yomi": "none", "meaning": "Foothold / Based on", "stroke_count": 8, "mnemonic": "A hand holding a place for a base." },
    { "character": "遭", "on_yomi": "SOU", "kun_yomi": "a-u", "meaning": "Encounter / Meet (Disaster)", "stroke_count": 14, "mnemonic": "Walking toward a curved/difficult meeting." },
    { "character": "伺", "on_yomi": "SHI", "kun_yomi": "ukaga-u", "meaning": "Pay respects / Visit / Inquire", "stroke_count": 7, "mnemonic": "A person peering/inquiring with respect." },
    { "character": "徹", "on_yomi": "TETSU", "kun_yomi": "none", "meaning": "Penetrate / Thorough", "stroke_count": 15, "mnemonic": "Walking and striking through to the end." },
    { "character": "撤", "on_yomi": "TETSU", "kun_yomi": "none", "meaning": "Withdraw / Remove", "stroke_count": 15, "mnemonic": "A hand removing items thoroughly." },
    { "character": "邸", "on_yomi": "TEI", "kun_yomi": "yashiki", "meaning": "Residence / Mansion", "stroke_count": 7, "mnemonic": "A large building in a specific district." },
    { "character": "範", "on_yomi": "HAN", "kun_yomi": "none", "meaning": "Range / Scope", "stroke_count": 15, "mnemonic": "Bamboo pattern marking a boundary/range." },
    { "character": "掲", "on_yomi": "KEI", "kun_yomi": "kaka-geru", "meaning": "Display / Post / Raise", "stroke_count": 11, "mnemonic": "Hand raising a sign under the sun." },
    { "character": "卸", "on_yomi": "SHA", "kun_yomi": "oro-su", "meaning": "Wholesale", "stroke_count": 9, "mnemonic": "Stopping a seal to distribute goods." },
    { "character": "奮", "on_yomi": "FUN", "kun_yomi": "furu-u", "meaning": "Stirred up / Excited", "stroke_count": 16, "mnemonic": "A bird in a field flapping its wings in excitement." },
    { "character": "獲", "on_yomi": "KAKU", "kun_yomi": "e-ru", "meaning": "Seize / Get / Capture", "stroke_count": 17, "mnemonic": "A dog-animal seizing a bird in the grass." },
    { "character": "詳", "on_yomi": "SHOU", "kun_yomi": "kuwa-shii", "meaning": "Detailed / Full", "stroke_count": 13, "mnemonic": "Words as clear and detailed as a sheep." },
    { "character": "耐", "on_yomi": "TAI", "kun_yomi": "ta-eru", "meaning": "Endure / Bear", "stroke_count": 9, "mnemonic": "A beard and a measurement; enduring over time." },
    { "character": "鋭", "on_yomi": "EI", "kun_yomi": "uru-doi", "meaning": "Sharp / Weapon", "stroke_count": 15, "mnemonic": "Metal that is refined and sharp." },
    { "character": "猛", "on_yomi": "MOU", "kun_yomi": "none", "meaning": "Fierce / Violent", "stroke_count": 11, "mnemonic": "A dog-animal that is fierce and wild." },
    { "character": "鑑", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Specimen / Take heed", "stroke_count": 23, "mnemonic": "Looking into metal/mirror to inspect a sample." },
    { "character": "嘱", "on_yomi": "SHOKU", "kun_yomi": "none", "meaning": "Entrust / Request", "stroke_count": 15, "mnemonic": "A mouth speaking a request for duty." },
    { "character": "棄", "on_yomi": "KI", "kun_yomi": "su-teru", "meaning": "Abandon / Discard", "stroke_count": 13, "mnemonic": "Discarding a child/basket in the woods." },
    { "character": "卑", "on_yomi": "HI", "kun_yomi": "iya-shii", "meaning": "Lowly / Vile / Mean", "stroke_count": 9, "mnemonic": "A hand holding a lowly tool." },
    { "character": "誇", "on_yomi": "KO", "kun_yomi": "poko-ru", "meaning": "Boast / Pride", "stroke_count": 13, "mnemonic": "Words that are big/extravagant." },
    { "character": "癖", "on_yomi": "HEKI", "kun_yomi": "kuse", "meaning": "Habit / Peculiarity", "stroke_count": 18, "mnemonic": "A sickness or habit related to a habit/inclination." },
    { "character": "蓄", "on_yomi": "CHIKU", "kun_yomi": "takawa-eru", "meaning": "Amass / Store / Save", "stroke_count": 13, "mnemonic": "Grass over a field with many items stored." },
    { "character": "剰", "on_yomi": "JOU", "kun_yomi": "none", "meaning": "Surplus / Excess", "stroke_count": 11, "mnemonic": "A knife cutting a surplus from a ride/vehicle." },
    { "character": "虐", "on_yomi": "GYAKU", "kun_yomi": "shiita-geru", "meaning": "Tyrannize / Oppress", "stroke_count": 9, "mnemonic": "A tiger's claw striking downward." },
    { "character": "喚", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Shout / Summon", "stroke_count": 12, "mnemonic": "A mouth shouting for exchange." },
    { "character": "浸", "on_yomi": "SHIN", "kun_yomi": "hita-su", "meaning": "Immerse / Soak", "stroke_count": 10, "mnemonic": "Water and a hand cleaning/soaking a broom." },
    { "character": "煩", "on_yomi": "BAN", "kun_yomi": "wazu-rau", "meaning": "Anxiety / Trouble", "stroke_count": 13, "mnemonic": "Fire in the head causing trouble." },
    { "character": "塊", "on_yomi": "KAI", "kun_yomi": "katamari", "meaning": "Lump / Clod", "stroke_count": 13, "mnemonic": "Earth shaped into a spirit/lump." },
    { "character": "傑", "on_yomi": "KETSU", "kun_yomi": "none", "meaning": "Greatness / Hero", "stroke_count": 13, "mnemonic": "A person standing tall like a tree in a hero's shape." },
    { "character": "憤", "on_yomi": "FUN", "kun_yomi": "ikidou-ru", "meaning": "Resentment / Anger", "stroke_count": 15, "mnemonic": "A heart feeling a stir/burst of anger." },
    { "character": "弊", "on_yomi": "HEI", "kun_yomi": "none", "meaning": "Evil / Abuse / Humble", "stroke_count": 15, "mnemonic": "Tattered cloth representing humble/bad status." },
    { "character": "怠", "on_yomi": "TAI", "kun_yomi": "okota-ru", "meaning": "Neglect / Lazy", "stroke_count": 9, "mnemonic": "A heart that has reached its end; lazy." },
    { "character": "携", "on_yomi": "KEI", "kun_yomi": "tazu-saeru", "meaning": "Carry / Portable", "stroke_count": 13, "mnemonic": "A hand carrying a bird; portable." },
    { "character": "及", "on_yomi": "KYUU", "kun_yomi": "oyo-bu", "meaning": "Exert / Influence", "stroke_count": 3, "mnemonic": "A hand reaching to catch up." },
    { "character": "墜", "on_yomi": "TSUI", "kun_yomi": "none", "meaning": "Crash / Fall / Drop", "stroke_count": 15, "mnemonic": "A line of items falling to the earth." },
    { "character": "彰", "on_yomi": "SHOU", "kun_yomi": "none", "meaning": "Patron / Clear", "stroke_count": 14, "mnemonic": "Standing at a gate with a clear badge/mark." },
    { "character": "唆", "on_yomi": "SA", "kun_yomi": "soso-nokasu", "meaning": "Instigate / Tempt", "stroke_count": 10, "mnemonic": "A mouth speaking a quick/sharp word to tempt." },
    { "character": "糾", "on_yomi": "KYUU", "kun_yomi": "none", "meaning": "Twist / Investigate", "stroke_count": 9, "mnemonic": "Threads being twisted together to investigate." },
    { "character": "枢", "on_yomi": "SUU", "kun_yomi": "none", "meaning": "Hinge / Pivot", "stroke_count": 8, "mnemonic": "A wooden door-hinge area." },
    { "character": "賦", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Levy / Tribute / Ode", "stroke_count": 15, "mnemonic": "Shells/money given for a martial tribute." },
    { "character": "梗", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Stem / Block / Outline", "stroke_count": 11, "mnemonic": "Wood that is stiff/correct like a stem." },
    { "character": "綻", "on_yomi": "TAN", "kun_yomi": "horoko-biru", "meaning": "Unravel / Ripped", "stroke_count": 14, "mnemonic": "Threads becoming set/fixed in a rip." },
    { "character": "閑", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Leisure / Idle", "stroke_count": 12, "mnemonic": "A tree inside a gate; quiet/idle." },
    { "character": "嘱", "on_yomi": "SHOKU", "kun_yomi": "none", "meaning": "Entrust / Commission", "stroke_count": 15, "mnemonic": "A mouth speaking a request for duty." },
    { "character": "泌", "on_yomi": "HITSU", "kun_yomi": "none", "meaning": "Ooze / Secrete", "stroke_count": 8, "mnemonic": "Water that is small/hidden and oozes out." },
    { "character": "禍", "on_yomi": "KA", "kun_yomi": "none", "meaning": "Calamity / Evil", "stroke_count": 13, "mnemonic": "An omen/altar showing a crooked calamity." },
    { "character": "逐", "on_yomi": "CHIKU", "kun_yomi": "none", "meaning": "Pursue / Chase", "stroke_count": 10, "mnemonic": "Walking a pig/animal along a road; chasing." },
    { "character": "逸", "on_yomi": "ITSU", "kun_yomi": "none", "meaning": "Deviate / Elude", "stroke_count": 10, "mnemonic": "A rabbit escaping/running along a road." },
    { "character": "捉", "on_yomi": "SOKU", "kun_yomi": "tora-eru", "meaning": "Catch / Grasp", "stroke_count": 10, "mnemonic": "A hand catching a foot/step." },
    { "character": "紛", "on_yomi": "FUN", "kun_yomi": "magi-reru", "meaning": "Distract / Confuse", "stroke_count": 10, "mnemonic": "Threads becoming diverged/confused." },
    { "character": "憾", "on_yomi": "KAN", "kun_yomi": "none", "meaning": "Regret / Remorse", "stroke_count": 16, "mnemonic": "A heart feeling the feeling/touch of regret." },
    { "character": "憧", "on_yomi": "SHOU", "kun_yomi": "ako-gareru", "meaning": "Yearn / Adore", "stroke_count": 15, "mnemonic": "A heart that is childlike/pure in yearning." },
    { "character": "悟", "on_yomi": "GO", "kun_yomi": "sato-ru", "meaning": "Enlightenment / Perceive", "stroke_count": 10, "mnemonic": "A heart and five mouths; understanding clearly." },
    { "character": "憬", "on_yomi": "KEI", "kun_yomi": "none", "meaning": "Long for / Yearn", "stroke_count": 15, "mnemonic": "A heart and a scenery; yearning for a place." },
    { "character": "憩", "on_yomi": "KEI", "kun_yomi": "iko-i", "meaning": "Recess / Rest", "stroke_count": 16, "mnemonic": "Breath, nose, and heart; resting the self." },
    { "character": "糾", "on_yomi": "KYUU", "kun_yomi": "none", "meaning": "Twist / Investigate", "stroke_count": 9, "mnemonic": "Threads twisted to find the truth." },
    { "character": "罷", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Quit / Stop", "stroke_count": 15, "mnemonic": "A net over a bird; stopping movement." },
    { "character": "耗", "on_yomi": "MOU", "kun_yomi": "none", "meaning": "Decrease / Waste", "stroke_count": 10, "mnemonic": "A plow and hair; wasting away." },
    { "character": "醸", "on_yomi": "JOU", "kun_yomi": "kamo-su", "meaning": "Brew / Cause", "stroke_count": 20, "mnemonic": "Sake and a helper; brewing/causing." },
    { "character": "呈", "on_yomi": "TEI", "kun_yomi": "none", "meaning": "Display / Present", "stroke_count": 7, "mnemonic": "A mouth presenting a king's message." },
    { "character": "堪", "on_yomi": "KAN", "kun_yomi": "ta-eru", "meaning": "Endure / Bear", "stroke_count": 13, "mnemonic": "Earth that can withstand/bear a weight." },
    { "character": "諮", "on_yomi": "SHI", "kun_yomi": "haka-ru", "meaning": "Consult / Inquire", "stroke_count": 16, "mnemonic": "Words used to consult with an elder." },
    { "character": "諭", "on_yomi": "YU", "kun_yomi": "sato-su", "meaning": "Admonish / Persuade", "stroke_count": 16, "mnemonic": "Words used for a formal lecture/admonishing." },
    { "character": "諮", "on_yomi": "SHI", "kun_yomi": "haka-ru", "meaning": "Inquire", "stroke_count": 16, "mnemonic": "Consulting with words." },
    { "character": "諾", "on_yomi": "DAKU", "kun_yomi": "none", "meaning": "Consent / Agreement", "stroke_count": 15, "mnemonic": "Words used for a formal approval." },
    { "character": "謀", "on_yomi": "BOU", "kun_yomi": "haka-ru", "meaning": "Conspire / Plan", "stroke_count": 16, "mnemonic": "Words used for a strategic/secret plan." },
    { "character": "謡", "on_yomi": "YOU", "kun_yomi": "utai", "meaning": "Song / Noh chant", "stroke_count": 16, "mnemonic": "Words spoken like a folk song." },
    { "character": "謙", "on_yomi": "KEN", "kun_yomi": "none", "meaning": "Humble / Modest", "stroke_count": 17, "mnemonic": "Words spoken with a double/concurrent heart." },
    { "character": "謹", "on_yomi": "KIN", "kun_yomi": "tsutsushi-mu", "meaning": "Discreet / Reverent", "stroke_count": 17, "mnemonic": "Words spoken with careful focus." },
    { "character": "遜", "on_yomi": "SON", "kun_yomi": "none", "meaning": "Humble / Modest", "stroke_count": 13, "mnemonic": "Walking/following in a grandson's manner." },
    { "character": "諷", "on_yomi": "FUU", "kun_yomi": "none", "meaning": "Satire / Chant", "stroke_count": 16, "mnemonic": "Words that blow like the wind; satire." },
    { "character": "諭", "on_yomi": "YU", "kun_yomi": "sato-su", "meaning": "Persuade", "stroke_count": 16, "mnemonic": "Formal lecture with words." },
    { "character": "譜", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Musical score / Genealogy", "stroke_count": 19, "mnemonic": "Words showing a standard broad score." },
    { "character": "諫", "on_yomi": "KAN", "kun_yomi": "isa-meru", "meaning": "Admonish / Remonstrate", "stroke_count": 16, "mnemonic": "Words spoken for a simple/pure truth." },
    { "character": "諧", "on_yomi": "KAI", "kun_yomi": "none", "meaning": "Harmony / Joke", "stroke_count": 16, "mnemonic": "Words that harmonize/match well." },
    { "character": "豁", "on_yomi": "KATSU", "kun_yomi": "none", "meaning": "Open / Empty / Wide", "stroke_count": 17, "mnemonic": "A valley with a damage/cut; wide open." },
    { "character": "謹", "on_yomi": "KIN", "kun_yomi": "tsutsushi-mu", "meaning": "Humble", "stroke_count": 17, "mnemonic": "Careful, focused speech." },
    { "character": "誼", "on_yomi": "GI", "kun_yomi": "none", "meaning": "Friendship / Intimacy", "stroke_count": 15, "mnemonic": "Words spoken for a proper friendship." },
    { "character": "謳", "on_yomi": "OU", "kun_yomi": "none", "meaning": "Extol / Declare", "stroke_count": 18, "mnemonic": "Words spoken in a loud area/district." },
    { "character": "謬", "on_yomi": "BYUU", "kun_yomi": "ayamari", "meaning": "Error / Fallacy", "stroke_count": 18, "mnemonic": "Words that are bent/twisted; a mistake." },
    { "character": "訃", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Obituary / Death notice", "stroke_count": 9, "mnemonic": "Words about a person who is 'divined' out/deceased." },
    { "character": "詫", "on_yomi": "TA", "kun_yomi": "wabi-ru", "meaning": "Apologize", "stroke_count": 13, "mnemonic": "Words spoken for a home/settlement." },
    { "character": "詭", "on_yomi": "KI", "kun_yomi": "none", "meaning": "Deceive / Weird", "stroke_count": 13, "mnemonic": "Words that are dangerous/on a cliff." },
    { "character": "詠", "on_yomi": "EI", "kun_yomi": "yo-mu", "meaning": "Recite / Compose (poetry)", "stroke_count": 12, "mnemonic": "Words that flow forever like a poem." },
    { "character": "誂", "on_yomi": "CHOU", "kun_yomi": "atsura-eru", "meaning": "Order / Custom-made", "stroke_count": 13, "mnemonic": "Words spoken to pick and choose an order." },
    { "character": "誣", "on_yomi": "FU", "kun_yomi": "none", "meaning": "Slander / Libel", "stroke_count": 14, "mnemonic": "Words used by a shaman/witch; slander." },
    { "character": "談", "on_yomi": "DAN", "kun_yomi": "none", "meaning": "Talk / Discourse", "stroke_count": 15, "mnemonic": "Words spoken around a fire; a talk." },
    { "character": "請", "on_yomi": "SEI", "kun_yomi": "ko-u", "meaning": "Request / Solicit", "stroke_count": 15, "mnemonic": "Words that are clean/clear for a request." },
    { "character": "諸", "on_yomi": "SHO", "kun_yomi": "moro-moro", "meaning": "Various / Many", "stroke_count": 15, "mnemonic": "Many words spoken by various people." },
    { "character": "評", "on_yomi": "HYOU", "kun_yomi": "none", "meaning": "Criticism / Evaluate", "stroke_count": 12, "mnemonic": "Words judging a level/flat standard." },
    { "character": "講", "on_yomi": "KOU", "kun_yomi": "none", "meaning": "Lecture / Structure", "stroke_count": 17, "mnemonic": "Words organized in a structure for a lecture." },
    { "character": "謝", "on_yomi": "SHA", "kun_yomi": "ayama-ru", "meaning": "Thank / Apologize", "stroke_count": 17, "mnemonic": "Words used to shoot out/dismiss an error." },
    { "character": "該", "on_yomi": "GAI", "kun_yomi": "none", "meaning": "Applicable / Relevant", "stroke_count": 13, "mnemonic": "Words spoken about a child/relevant person." },
    { "character": "認", "on_yomi": "NIN", "kun_yomi": "mito-meru", "meaning": "Recognize / Acknowledge", "stroke_count": 14, "mnemonic": "Words used to tolerate/admit a truth." },
    { "character": "誕", "on_yomi": "TAN", "kun_yomi": "none", "meaning": "Birth / Deception", "stroke_count": 15, "mnemonic": "Words spoken as a child/extension of life." },
    { "character": "誘", "on_yomi": "YUU", "kun_yomi": "saso-u", "meaning": "Invite / Entice", "stroke_count": 14, "mnemonic": "Words used for an excellent invitation." }
];

let internalDups = new Set();
let baselineDups = new Set();
let uniqueL12 = [];
let seenInL12 = new Set();

l12Raw.forEach(entry => {
    if (seenInL12.has(entry.character)) {
        internalDups.add(entry.character);
    } else if (baseline.has(entry.character)) {
        baselineDups.add(entry.character);
    } else {
        uniqueL12.push(entry);
    }
    seenInL12.add(entry.character);
});

console.log('\nInternal Duplicates:', Array.from(internalDups).join(', ') || 'None');
console.log('Baseline Duplicates:', Array.from(baselineDups).join(', ') || 'None');
console.log('Unique L12 Count:', uniqueL12.length);
console.log('Need to replace:', 100 - uniqueL12.length, 'Kanji');
