const fs = require('fs');
const path = require('path');

async function auditPortugueseA1() {
    try {
        console.log('Auditing Portuguese A1 Modules 01-04 for duplicates...\n');

        const modules = ['pt_a1_m01', 'pt_a1_m02', 'pt_a1_m03', 'pt_a1_m04'];
        const wordMap = new Map(); // word -> [moduleIds]
        const moduleCounts = {};

        for (const mid of modules) {
            const localPath = `c:/Users/Sindhu/Desktop/chirp-polly/firestore_data/${mid}.json`;
            if (!fs.existsSync(localPath)) {
                console.log(`⚠️ Warning: Local file for ${mid} not found at ${localPath}`);
                continue;
            }

            const data = JSON.parse(fs.readFileSync(localPath, 'utf8'));
            let words = [];

            // Handle both 'lessons' and 'vocabulary' schemas
            if (data.lessons) {
                words = data.lessons.map(l => l.targetText ? l.targetText.toLowerCase().trim() : null).filter(Boolean);
            } else if (data.vocabulary) {
                words = data.vocabulary.map(v => v.word ? v.word.toLowerCase().trim() : null).filter(Boolean);
            }

            moduleCounts[mid] = words.length;

            words.forEach(word => {
                if (!wordMap.has(word)) {
                    wordMap.set(word, []);
                }
                wordMap.get(word).push(mid);
            });
        }

        console.log('\n--- Duplicate Report ---');
        let duplicates = 0;
        for (const [word, moduleIds] of wordMap.entries()) {
            if (moduleIds.length > 1) {
                console.log(`❌ Duplicate: "${word}" found in: ${moduleIds.join(', ')}`);
                duplicates++;
            }
        }

        if (duplicates === 0) {
            console.log('✅ CLEAN: No duplicates across any of the 4 modules.');
        } else {
            console.log(`\nFound ${duplicates} duplicate entries in total.`);
        }

        console.log('\n--- Lesson Counts ---');
        for (const mid of modules) {
            console.log(`${mid}: ${moduleCounts[mid] || 0} lessons`);
        }

    } catch (error) {
        console.error('Audit failed:', error);
    }
}

auditPortugueseA1();
