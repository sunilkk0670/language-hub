// strip_false_friend_tags.js
// Removes " [FALSE FRIEND TRAP]" from meaning fields in Spanish _full.json files,
// adds "isLiarTrap": true to those items as a hidden flag, and re-uploads to Firestore.

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('./serviceAccountKey.json');
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const TAG = ' [FALSE FRIEND TRAP]';
const DATA_DIR = path.join(__dirname, '..', 'firestore_data');
const FILES = [
    { file: 'spanish_a1_full.json', level: 'a1' },
    { file: 'spanish_a2_full.json', level: 'a2' },
    { file: 'spanish_b1_full.json', level: 'b1' },
];

async function main() {
    console.log('\n🧹 Stripping [FALSE FRIEND TRAP] tags from Spanish modules…\n');
    let totalStripped = 0;
    let totalUploaded = 0;

    for (const { file, level } of FILES) {
        const filePath = path.join(DATA_DIR, file);
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        let strippedInFile = 0;

        raw.modules = raw.modules.map(mod => {
            mod.vocabularyItems = mod.vocabularyItems.map(item => {
                if (item.meaning && item.meaning.includes(TAG)) {
                    item.meaning = item.meaning.replace(TAG, '').trim();
                    item.isLiarTrap = true;
                    strippedInFile++;
                }
                return item;
            });
            return mod;
        });

        // Write cleaned JSON back
        fs.writeFileSync(filePath, JSON.stringify(raw, null, 2), 'utf8');
        console.log(`📝 ${file} — stripped ${strippedInFile} tags`);
        totalStripped += strippedInFile;

        // Re-upload each module
        for (const mod of raw.modules) {
            await db.collection('languages').doc('spanish')
                .collection('levels').doc(level)
                .collection('modules').doc(mod.moduleId).set({
                    moduleId: mod.moduleId,
                    theme: mod.theme,
                    order: mod.order,
                    vocabularyItems: mod.vocabularyItems,
                    count: mod.count,
                    liarGameData: mod.liarGameData,
                });
            console.log(`  ✅ ${mod.moduleId}  order:${mod.order}  count:${mod.count}`);
            totalUploaded++;
        }
        console.log();
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Done — ${totalStripped} tags stripped, ${totalUploaded} modules re-uploaded`);

    // Quick spot-check
    const sample = raw_spot();
    console.log('\n🔍 Spot-check (first trap item of es_a1_m1):');
    const a1 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'spanish_a1_full.json'), 'utf8'));
    const m1 = a1.modules.find(m => m.moduleId === 'es_a1_m1');
    const trapItems = m1.vocabularyItems.filter(v => v.isLiarTrap);
    trapItems.slice(0, 2).forEach(v => console.log(`  word:"${v.word}"  meaning:"${v.meaning}"  isLiarTrap:${v.isLiarTrap}`));

    process.exit(0);
}

function raw_spot() { } // placeholder

main().catch(e => { console.error('❌', e); process.exit(1); });
