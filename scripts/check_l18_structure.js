const fs = require('fs');
const path = require('path');

// Full L18 raw data from user (first 50 to verify structure)
const l18Raw = [
    { "character": "郭", "on_yomi": "KAKU", "kun_yomi": "none", "meaning": "Enclosure / Quarter / Walled city", "stroke_count": 11, "mnemonic": "A building in a specialized district with high walls." },
    { "character": "鄭", "on_yomi": "TEI", "kun_yomi": "none", "meaning": "Solemn / State of Zheng", "stroke_count": 15, "mnemonic": "A district marking a solemn or formal kingdom." },
    { "character": "鄙", "on_yomi": "HI", "kun_yomi": "hina", "meaning": "Lowly / Rustic / Boorish", "stroke_count": 14, "mnemonic": "A district and a storehouse; a rustic, remote area." },
    { "character": "鄰", "on_yomi": "RIN", "kun_yomi": "tonari", "meaning": "Neighbor / Neighborhood", "stroke_count": 15, "mnemonic": "A district with many/aligned fires; neighboring homes." },
    { "character": "鄱", "on_yomi": "HA", "kun_yomi": "none", "meaning": "Lake region (Poyang)", "stroke_count": 15, "mnemonic": "A district and a field/skin; a specific lake region." },
    { "character": "鄴", "on_yomi": "GYOU", "kun_yomi": "none", "meaning": "Ancient capital name", "stroke_count": 16, "mnemonic": "A district and business/drums; an ancient trade capital." },
    { "character": "鄲", "on_yomi": "TAN", "kun_yomi": "none", "meaning": "Name of ancient district", "stroke_count": 15, "mnemonic": "A district and a sunrise/dawn; an eastern province." },
    { "character": "鄳", "on_yomi": "BOU", "kun_yomi": "none", "meaning": "Obscure district", "stroke_count": 17, "mnemonic": "A district that is covered or obscure like the moon." },
    { "character": "鄽", "on_yomi": "TEN", "kun_yomi": "none", "meaning": "Market place / Quarter", "stroke_count": 18, "mnemonic": "A district and a shop/roof; a busy market area." },
    { "character": "儷", "on_yomi": "REI", "kun_yomi": "none", "meaning": "Companion / Couple / Pair", "stroke_count": 21, "mnemonic": "A person and a beautiful deer; a matched pair." },
    { "character": "儼", "on_yomi": "GEN", "kun_yomi": "none", "meaning": "Dignified / Majestic / Stern", "stroke_count": 22, "mnemonic": "A person who is strict and stern like a cliff." },
    { "character": "玩", "on_yomi": "GAN", "kun_yomi": "mote-asobu", "meaning": "Toy / Play with / Trifling", "stroke_count": 8, "mnemonic": "A king/jewel that is primary; something played with." },
    { "character": "珀", "on_yomi": "HAKU", "kun_yomi": "none", "meaning": "Amber", "stroke_count": 9, "mnemonic": "A white king/jewel; the color of amber." },
    { "character": "珂", "on_yomi": "KA", "kun_yomi": "none", "meaning": "Jade / White jewel", "stroke_count": 9, "mnemonic": "A king/jewel that is possible/permitted; pure jade." },
    { "character": "珊", "on_yomi": "SAN", "kun_yomi": "none", "meaning": "Coral", "stroke_count": 10, "mnemonic": "A king/jewel found in a book/ledger; coral." },
    { "character": "琉", "on_yomi": "RYUU", "kun_yomi": "none", "meaning": "Lapis lazuli / Precious stone", "stroke_count": 11, "mnemonic": "A king/jewel that flows/streams; blue stone." },
    { "character": "琢", "on_yomi": "TAKU", "kun_yomi": "none", "meaning": "Polish / Refine", "stroke_count": 12, "mnemonic": "A king/jewel and a pig/animal; refining a raw state." },
    { "character": "琥", "on_yomi": "KO", "kun_yomi": "none", "meaning": "Amber / Jewel name", "stroke_count": 12, "mnemonic": "A king/jewel that is a tiger; fierce amber light." },
    { "character": "琵", "on_yomi": "HI", "kun_yomi": "none", "meaning": "Lute / Stringed instrument", "stroke_count": 12, "mnemonic": "Two kings/jewels and a comparison; musical strings." },
    { "character": "琶", "on_yomi": "HA", "kun_yomi": "none", "meaning": "Lute", "stroke_count": 12, "mnemonic": "Two kings/jewels and a skin/hide; instrument body." }
];

console.log('L18 raw data loaded. Sample count:', l18Raw.length);
console.log('Note: This is a partial check. Full audit will process all entries.');
