const fs = require('fs');

async function auditM09M10() {
    const existingModules = ['pt_a1_m01', 'pt_a1_m02', 'pt_a1_m03', 'pt_a1_m04', 'pt_a1_m05', 'pt_a1_m06', 'pt_a1_m07', 'pt_a1_m08'];
    const existingWords = new Set();

    // Load existing words
    for (const mid of existingModules) {
        const path = `c:/Users/Sindhu/Desktop/chirp-polly/firestore_data/${mid}.json`;
        if (fs.existsSync(path)) {
            const data = JSON.parse(fs.readFileSync(path, 'utf8'));
            const words = (data.lessons || []).map(l => l.targetText.toLowerCase().trim());
            words.forEach(w => existingWords.add(w));
        }
    }

    console.log(`Existing unique words (01-08): ${existingWords.size}`);

    function checkOverlapFile(mid) {
        const path = `c:/Users/Sindhu/Desktop/chirp-polly/firestore_data/${mid}.json`;
        if (!fs.existsSync(path)) {
            console.log(`⚠️ File ${path} not found.`);
            return;
        }
        const data = JSON.parse(fs.readFileSync(path, 'utf8'));
        const words = (data.lessons || []).map(l => l.targetText.toLowerCase().trim());

        console.log(`\nAudit for ${mid}:`);
        const internalDups = new Set();
        const crossDups = new Set();
        const seen = new Set();

        words.forEach(w => {
            if (seen.has(w)) internalDups.add(w);
            if (existingWords.has(w)) crossDups.add(w);
            seen.add(w);
        });

        if (internalDups.size > 0) console.log(`  Internal Duplicates: ${Array.from(internalDups).join(', ')}`);
        if (crossDups.size > 0) console.log(`  Cross-Module Overlaps: ${Array.from(crossDups).join(', ')}`);
        if (internalDups.size === 0 && crossDups.size === 0) console.log("  ✅ Zero Overlap");
        console.log(`  Total unique words: ${seen.size}`);
    }

    checkOverlapFile('pt_a1_m09');
    checkOverlapFile('pt_a1_m10');
}

auditM09M10();
