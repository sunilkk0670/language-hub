const fs = require('fs');

async function auditM12M13() {
    const baseline = new Set(JSON.parse(fs.readFileSync('pt_baseline_full.json', 'utf8')));
    console.log(`Baseline size: ${baseline.size}`);

    function checkFile(mid) {
        const path = `c:/Users/Sindhu/Desktop/chirp-polly/firestore_data/${mid}.json`;
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

    checkFile('pt_a2_m02');
    checkFile('pt_a2_m03');
}

auditM12M13();
