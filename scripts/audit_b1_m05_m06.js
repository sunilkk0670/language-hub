const fs = require('fs');

async function auditB1Modules() {
    const baselinePath = 'c:/Users/Sindhu/Desktop/chirp-polly/scripts/pt_baseline_full.json';
    const baseline = new Set(JSON.parse(fs.readFileSync(baselinePath, 'utf8')).map(w => w.toLowerCase().trim()));
    console.log(`Baseline size: ${baseline.size}`);

    function checkFile(mid) {
        const path = `c:/Users/Sindhu/Desktop/chirp-polly/firestore_data/${mid}.json`;
        if (!fs.existsSync(path)) return;

        const data = JSON.parse(fs.readFileSync(path, 'utf8'));
        const words = (data.lessons || []).map(l => l.targetText.toLowerCase().trim());

        console.log(`\nAudit for ${mid}:`);
        const internalDups = new Set();
        const crossDups = new Set();
        const seen = new Set();

        words.forEach(w => {
            if (seen.has(w)) internalDups.add(w);
            if (baseline.has(w)) crossDups.add(w);
            seen.add(w);
        });

        if (internalDups.size > 0) console.log(`  Internal Duplicates: ${Array.from(internalDups).join(', ')}`);
        if (crossDups.size > 0) console.log(`  Cross-Module Overlaps: ${Array.from(crossDups).join(', ')}`);
        if (internalDups.size === 0 && crossDups.size === 0) console.log("  ✅ Zero Overlap");
        console.log(`  Total unique words: ${seen.size}`);
    }

    checkFile('pt_b1_m05');
    checkFile('pt_b1_m06');
}

auditB1Modules();
