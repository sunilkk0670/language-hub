const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Sindhu/Desktop/chirp-polly/firestore_data';
const urduMarkers = /[ज़फ़ख़क़ग़]/;
const commonUrduWords = [
    'शुक्रिया', 'मदद', 'दोस्त', 'दुश्मन', 'शहर', 'किताब', 'कलम', 'बाजार', 'दुकान',
    'रास्ता', 'ज़िंदगी', 'सफ़ेद', 'हवा', 'जमीन', 'आसमान', 'लेकिन', 'मगर', 'अगर',
    'सिर्फ', 'बिल्कुल', 'शायद', 'कोशिश', 'इंतज़ार', 'सवाल', 'जवाब', 'आदमी', 'औरत',
    'गुस्सा', 'खुश', 'दुख', 'नुकसान', 'फायदा', 'खराब', 'साफ', 'जिम्मेदार', 'वक्त',
    'इतिहास', 'इबादत', 'इश्क', 'नफरत', 'हकीकत', 'झूठ', 'सच', 'गरीब', 'अमीर',
    'खतरा', 'हिफाजत', 'इरादा', 'इशारा', 'इलाज', 'इनाम', 'इल्जाम', 'इंतजाम'
];

const results = [];

fs.readdirSync(dir).forEach(file => {
    if (file.startsWith('hi_') && file.endsWith('.json')) {
        const filePath = path.join(dir, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const lessons = content.lessons || content.vocabulary || [];

        lessons.forEach((l, index) => {
            const word = l.word;
            let found = false;

            if (urduMarkers.test(word)) found = true;
            if (commonUrduWords.some(uw => word.includes(uw))) found = true;

            if (found) {
                results.push({
                    file,
                    index,
                    word: l.word,
                    translation: l.translation
                });
            }
        });
    }
});

console.log(JSON.stringify(results, null, 2));
