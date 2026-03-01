// cleanup_spanish_duplicate_modules.js
// Deletes the stale zero-padded Spanish module documents (es_a1_m01…m09, etc.)
// that were created by a previous upload script — leaving only the canonical
// unpadded IDs (es_a1_m1…m10, es_a2_m1…m10, es_b1_m1…m10).

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

const LEVELS = ['a1', 'a2', 'b1'];

// Zero-padded IDs that should NOT exist (m01–m09; m10 has no ambiguity but
// we check both formats to be safe)
function zeroPaddedIds(level) {
    const ids = [];
    for (let i = 1; i <= 10; i++) {
        const padded = `es_${level}_m${String(i).padStart(2, '0')}`;
        ids.push(padded);
    }
    return ids;
}

async function cleanup() {
    console.log('\n🧹 Cleaning up stale zero-padded Spanish module docs…\n');
    let deleted = 0;

    for (const level of LEVELS) {
        const targets = zeroPaddedIds(level);
        for (const docId of targets) {
            const ref = db.collection('languages').doc('spanish')
                .collection('levels').doc(level)
                .collection('modules').doc(docId);

            const snap = await ref.get();
            if (snap.exists) {
                await ref.delete();
                console.log(`  🗑️  Deleted ${docId}`);
                deleted++;
            } else {
                console.log(`  ⬜  ${docId} not found (already clean)`);
            }
        }
        console.log();
    }

    // Final count check
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✅ Cleanup complete — ${deleted} stale documents deleted`);
    console.log(`\n📋 Remaining module counts per level:`);
    for (const level of LEVELS) {
        const snap = await db.collection('languages').doc('spanish')
            .collection('levels').doc(level)
            .collection('modules').get();
        console.log(`  ${level.toUpperCase()}: ${snap.size} modules`);
        snap.docs.sort((a, b) => a.id.localeCompare(b.id)).forEach(d =>
            console.log(`    ${d.id}  order:${d.data().order}  count:${d.data().count}`)
        );
    }

    process.exit(0);
}

cleanup().catch(e => { console.error('❌', e); process.exit(1); });
