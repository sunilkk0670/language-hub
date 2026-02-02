const fs = require('fs');

async function auditM07M08() {
    const existingModules = ['pt_a1_m01', 'pt_a1_m02', 'pt_a1_m03', 'pt_a1_m04', 'pt_a1_m05', 'pt_a1_m06'];
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

    console.log(`Existing unique words (01-06): ${existingWords.size}`);

    const m07_raw = [
        "Natureza", "Animal", "Cachorro", "Gato", "Pássaro", "Peixe", "Cavalo", "Vaca", "Porco", "Galinha", "Leão", "Tigre", "Elefante", "Macaco", "Cobra", "Inseto", "Árvore", "Flor", "Planta", "Grama", "Floresta", "Montanha", "Rio", "Lago", "Mar", "Oceano", "Ilha", "Céu", "Sol", "Lua", "Estrela", "Nuvem", "Chuva", "Vento", "Neve", "Gelo", "Tempestade", "Trovão", "Relâmpago", "Clima", "Calor", "Frio", "Umidade", "Seco", "Molhado", "Terra", "Pedra", "Areia", "Ouro", "Prata", "Meio ambiente", "Ecosistema", "Planeta", "Mundo", "Espaço", "Universo", "Nascer do sol", "Pôr do sol", "Ar", "Fogo", "Fumaça", "Luz", "Sombra", "Caminho", "Campo", "Fazenda", "Deserto", "Selva", "Onda", "Maré", "Costa", "Baía", "Cascata", "Vulcão", "Terremoto", "Estação", "Inverno", "Verão", "Outono", "Primavera", "Bicho", "Formiga", "Abelha", "Aranha", "Borboleta", "Mosquito", "Rato", "Coelho", "Tartaruga", "Jacaré", "Urso", "Lobo", "Raposa", "Cervo", "Baleia", "Tubarão", "Golfinho", "Pinguim", "Proteção", "Preservar"
    ];

    const m08_raw = [
        "Corpo", "Cabeça", "Cabelo", "Rosto", "Olho", "Orelha", "Nariz", "Boca", "Dente", "Língua", "Pescoço", "Ombro", "Braço", "Cotovelo", "Mão", "Dedo", "Unha", "Peito", "Barriga", "Costas", "Cintura", "Quadril", "Perna", "Joelho", "Tornozelo", "Pé", "Coração", "Pulmão", "Sangue", "Osso", "Pele", "Músculo", "Saúde", "Doença", "Dor", "Febre", "Gripe", "Tosse", "Resfriado", "Alergia", "Cansaço", "Sono", "Fome", "Sede", "Remédio", "Pílula", "Vacina", "Receita", "Médico", "Médica", "Enfermeiro", "Hospital", "Clínica", "Farmácia", "Ambulância", "Emergência", "Tratamento", "Exame", "Cirurgia", "Fratura", "Corte", "Ferida", "Sangramento", "Queimadura", "Enjoado", "Tonto", "Desmaio", "Higiene", "Banho", "Escovar", "Lavar", "Limpar", "Sabonete", "Shampoo", "Pasta de dente", "Escova de dentes", "Fio dental", "Toalha", "Desodorante", "Perfume", "Óculos", "Lentes de contato", "Muleta", "Cadeira de rodas", "Gesso", "Curativo", "Peso", "Altura", "Dieta", "Exercício", "Academia", "Esporte", "Energia", "Força", "Vitalidade", "Respiração", "Digestão", "Metabolismo", "Imunidade", "Recuperação"
    ];

    function checkOverlap(words, name) {
        console.log(`\nAudit for ${name}:`);
        const internalDups = new Set();
        const crossDups = new Set();
        const seen = new Set();

        words.forEach(w => {
            const lower = w.toLowerCase().trim();
            if (seen.has(lower)) internalDups.add(lower);
            if (existingWords.has(lower)) crossDups.add(lower);
            seen.add(lower);
        });

        if (internalDups.size > 0) console.log(`  Internal Duplicates: ${Array.from(internalDups).join(', ')}`);
        if (crossDups.size > 0) console.log(`  Cross-Module Overlaps: ${Array.from(crossDups).join(', ')}`);
        if (internalDups.size === 0 && crossDups.size === 0) console.log("  ✅ Zero Overlap");
        console.log(`  Total unique words: ${seen.size}`);
    }

    checkOverlap(m07_raw, "Module 07");
    checkOverlap(m08_raw, "Module 08");
}

auditM07M08();
