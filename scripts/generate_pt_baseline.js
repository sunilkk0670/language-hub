const fs = require('fs');
const path = require('path');

function getA1Baseline() {
    const baseline = new Set();
    for (let i = 1; i <= 10; i++) {
        const mid = `pt_a1_m${String(i).padStart(2, '0')}`;
        const filePath = `c:/Users/Sindhu/Desktop/chirp-polly/firestore_data/${mid}.json`;
        if (fs.existsSync(filePath)) {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            (data.lessons || []).forEach(l => {
                baseline.add(l.targetText.toLowerCase().trim());
            });
        }
    }
    return Array.from(baseline).sort();
}

const baseline = getA1Baseline();
console.log(`A1 Baseline: ${baseline.length} unique words.`);
fs.writeFileSync('c:/Users/Sindhu/Desktop/chirp-polly/scripts/pt_a1_baseline.json', JSON.stringify(baseline, null, 2));
