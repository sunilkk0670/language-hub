const modules = require('../firestore_data/pa_a1_modules.json');
const fs = require('fs');
const path = require('path');

modules.forEach(mod => {
    const filename = path.join(__dirname, '..', 'firestore_data', `${mod.moduleId}.json`);
    fs.writeFileSync(filename, JSON.stringify(mod, null, 4));
    console.log(`✓ Created ${mod.moduleId}.json`);
});

console.log('\n✅ Split complete! Created individual module files.');
