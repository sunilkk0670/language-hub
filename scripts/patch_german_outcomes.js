const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

// Outcome strings for German modules
const outcomes = {
    // A1 Modules
    'a1': {
        'de_a1_m01': 'Master core greetings, pronouns, and the three German grammatical genders.',
        'de_a1_m02': 'Describe family members and household objects with correct articles.',
        'de_a1_m03': 'Navigate food markets and restaurants using basic dining vocabulary.',
        'de_a1_m04': 'Ask for directions and understand travel-related announcements.',
        'de_a1_m05': 'Discuss clothing preferences and handle basic shopping transactions.',
        'de_a1_m06': 'Communicate basic health issues and daily physical routines.',
        'de_a1_m07': 'Talk about professional roles and educational backgrounds.',
        'de_a1_m08': 'Describe hobbies, sports, and favorite leisure activities.',
        'de_a1_m09': 'Use vocabulary related to digital media and everyday technology.',
        'de_a1_m10': 'Engage in basic social interactions and understand key cultural norms.',
    },
    // A2 Modules
    'a2': {
        'de_a2_m01': 'Detail job responsibilities and professional qualifications.',
        'de_a2_m02': 'Describe complex symptoms and understand medical advice.',
        'de_a2_m03': 'Manage daily organizational tasks and appointments.',
        'de_a2_m04': 'Discuss travel plans and narrate past vacation experiences.',
        'de_a2_m05': 'Participate in social gatherings and maintain simple conversations.',
        'de_a2_m06': 'Talk about natural environments, weather, and environmental protection.',
        'de_a2_m07': 'Discuss specific workplace scenarios and academic topics.',
        'de_a2_m08': 'Express a wide range of emotions and personal opinions.',
        'de_a2_m09': 'Explore cultural events, history, and traditions in depth.',
        'de_a2_m10': 'Review A2 grammar and solidify foundational fluency.',
    },
    // B1 Modules
    'b1': {
        'de_b1_m01': 'Nuanced relationship vocabulary and expressing emotional states.',
        'de_b1_m02': 'Digital ethics and participating in tech/social media debates.',
        'de_b1_m03': 'Job interview preparation and discussing workplace rights.',
        'de_b1_m04': 'Historical milestones and discussing national identity/heritage.',
        'de_b1_m05': 'Financial literacy and discussing consumer habits.',
        'de_b1_m06': 'Academic research terminology and career planning.',
        'de_b1_m07': 'Discussing climate change and sustainability basics.',
        'de_b1_m08': 'Medical terminology and navigating healthcare systems.',
        'de_b1_m09': 'Legal rights and participating in civic duty dialogues.',
        'de_b1_m10': 'German idiomatic mastery and complex linguistic nuances.',
    }
};

async function patchGermanOutcomes() {
    try {
        console.log('🚀 Patching outcome fields for German modules (A1-B1)...\n');

        const batch = db.batch();
        let count = 0;

        for (const [level, moduleData] of Object.entries(outcomes)) {
            console.log(`\n--- Level ${level.toUpperCase()} ---`);
            for (const [moduleId, outcome] of Object.entries(moduleData)) {
                const docRef = db.doc(`languages/german/levels/${level}/modules/${moduleId}`);
                batch.update(docRef, { outcome });
                console.log(`✏️  Queued update for ${moduleId}: "${outcome}"`);
                count++;
            }
        }

        await batch.commit();

        console.log(`\n✅ Successfully patched ${count} German modules with outcome fields!`);
    } catch (error) {
        console.error('❌ Error patching German outcomes:', error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

patchGermanOutcomes();
