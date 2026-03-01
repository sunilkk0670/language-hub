const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Outcome strings for each Chinese A1 module
const outcomes = {
    'zh_a1_m01': 'After this, you can greet people, introduce yourself, and master basic counting.',
    'zh_a1_m02': 'After this, you can talk about your family and describe people around you.',
    'zh_a1_m03': 'After this, you can describe your daily routine and talk about time.',
    'zh_a1_m04': 'After this, you can talk about hobbies, places to visit, and free-time activities.',
    'zh_a1_m05': 'After this, you can describe your home and handle everyday shopping.',
    'zh_a1_m06': 'After this, you can get around the city, buy tickets, and ask for directions.',
    'zh_a1_m07': 'After this, you can order food, discuss menus, and talk about what you like to eat.',
    'zh_a1_m08': 'After this, you can describe weather conditions and talk about the natural world.',
    'zh_a1_m09': 'After this, you can discuss news, media, and simple social topics.',
    'zh_a1_m10': 'After this, you have mastered all A1 essentials and can hold basic conversations.',
};

async function patchOutcomes() {
    try {
        console.log('🚀 Patching outcome fields for Chinese A1 modules...\n');

        const batch = db.batch();

        for (const [moduleId, outcome] of Object.entries(outcomes)) {
            const docRef = db.doc(`languages/chinese/levels/a1/modules/${moduleId}`);
            batch.update(docRef, { outcome });
            console.log(`✏️  Queued update for ${moduleId}: "${outcome}"`);
        }

        await batch.commit();

        console.log('\n✅ All 10 Chinese A1 modules patched with outcome field successfully!');
    } catch (error) {
        console.error('❌ Error patching outcomes:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchOutcomes();
