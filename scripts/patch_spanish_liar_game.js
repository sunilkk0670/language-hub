// patch_spanish_liar_game.js
// Patches Spanish A1/A2/B1 modules: replaces positions 94-100 with False Friend traps
// Sets meaningful liarGameData per module, enforces count:100, preserves order.
// Then uploads all 30 modules to Firestore.

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const TRAPS = require('./spanish_false_friends');

// ── Firebase init ─────────────────────────────────────────
const serviceAccount = require('./serviceAccountKey.json');
if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// ── Config ────────────────────────────────────────────────
const FILES = [
    { file: 'spanish_a1_full.json', level: 'a1', orderOffset: 0 },
    { file: 'spanish_a2_full.json', level: 'a2', orderOffset: 10 },
    { file: 'spanish_b1_full.json', level: 'b1', orderOffset: 20 },
];
const DATA_DIR = path.join(__dirname, '..', 'firestore_data');

// ── Patch one module ──────────────────────────────────────
function patchModule(mod, levelIndex) {
    const { moduleId } = mod;
    const trapData = TRAPS[moduleId];

    if (!trapData) {
        console.warn(`  ⚠️  No trap data found for ${moduleId} – skipping`);
        return mod;
    }

    // Current vocabulary (may have Var N duplicates)
    let vocab = mod.vocabularyItems || [];

    // Keep first 93 genuine entries (trim from end)
    vocab = vocab.slice(0, 93);

    // Append 7 False Friend trap items
    const trapVocab = trapData.map(t => t.vocab);
    vocab.push(...trapVocab);

    // Pull liarGameData from first trap in module
    const firstTrap = trapData[0].liar;

    return {
        ...mod,
        vocabularyItems: vocab,
        count: vocab.length,            // enforce 100
        liarGameData: {
            trap: firstTrap.trap,
            correctVersion: firstTrap.correctVersion,
            explanation: firstTrap.explanation,
        },
    };
}

// ── Upload one module to Firestore ────────────────────────
async function uploadModule(level, mod) {
    const docId = mod.moduleId;
    const ref = db.collection('languages').doc('spanish')
        .collection('levels').doc(level)
        .collection('modules').doc(docId);

    await ref.set({
        moduleId: mod.moduleId,
        theme: mod.theme,
        order: mod.order,
        vocabularyItems: mod.vocabularyItems,
        count: mod.count,
        liarGameData: mod.liarGameData,
    });

    console.log(`  ✅ ${docId} (order:${mod.order}) — ${mod.count} words — trap: "${mod.liarGameData.trap}"`);
}

// ── Main ──────────────────────────────────────────────────
async function main() {
    console.log('\n🔧 Spanish Liar Game Patch — starting\n');

    let totalModules = 0;

    for (const { file, level, orderOffset } of FILES) {
        const filePath = path.join(DATA_DIR, file);
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        console.log(`\n📚 Processing ${file} (${raw.modules.length} modules)…`);

        const patched = raw.modules.map((mod, idx) => {
            // Enforce correct order field regardless of stored value
            const correctOrder = orderOffset + idx + 1;
            return patchModule({ ...mod, order: correctOrder }, idx);
        });

        // Write patched JSON back
        fs.writeFileSync(filePath, JSON.stringify({ modules: patched }, null, 2), 'utf8');
        console.log(`  📝 Written ${file}`);

        // Upload to Firestore
        for (const mod of patched) {
            await uploadModule(level, mod);
            totalModules++;
        }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ PATCH COMPLETE — ${totalModules} modules uploaded`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // ── Spot-check output ─────────────────────────────────
    const a1 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'spanish_a1_full.json'), 'utf8'));
    const a2 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'spanish_a2_full.json'), 'utf8'));
    const b1 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'spanish_b1_full.json'), 'utf8'));

    console.log('🔍 Spot-check:');
    const checks = [
        a1.modules.find(m => m.moduleId === 'es_a1_m1'),
        a2.modules.find(m => m.moduleId === 'es_a2_m5'),
        b1.modules.find(m => m.moduleId === 'es_b1_m9'),
    ];
    for (const m of checks) {
        if (!m) continue;
        const last = m.vocabularyItems[m.vocabularyItems.length - 1];
        console.log(`  ${m.moduleId}  order:${m.order}  count:${m.count}  trap:"${m.liarGameData.trap}"  last-word:"${last.word}"`);
    }

    process.exit(0);
}

main().catch(e => { console.error('❌', e); process.exit(1); });
