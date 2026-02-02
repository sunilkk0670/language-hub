const fs = require('fs');

const baseline = new Set(JSON.parse(fs.readFileSync('pt_a1_baseline.json', 'utf8')));

const m11_candidates = [
    "Passaporte", "Visto", "Embarque", "Desembarque", "Conexão", "Escala", "Portão", "Pista", "Decolagem", "Aterrissagem", "Bagagem", "Mala", "Mochila", "Carrinho", "Alfândega", "Imigração", "Passagem", "Bilhete", "Reserva", "Confirmação", "Atraso", "Cancelamento", "Destino", "Origem", "Passageiro", "Tripulação", "Comissário", "Piloto", "Copiloto", "Assento", "Poltrona", "Janela", "Corredor", "Classe econômica", "Classe executiva", "Primeira classe", "Cartão de embarque", "Check-in", "Check-out", "Recepção", "Hospedagem", "Acomodação", "Pousada", "Resort", "Albergue", "Tarifa", "Imposto", "Seguro", "Assistência", "Itinerário", "Roteiro", "Mapa", "Guia", "Excursão", "Passeio", "Traslado", "Transfer", "Aluguel", "Locação", "Veículo", "Automóvel", "Caminhonete", "Motocicleta", "Scooter", "Capacete", "Combustível", "Gasolina", "Diesel", "Lubrificante", "Pneu", "Motor", "Freio", "Acelerador", "Volante", "Marcha", "Farol", "Sinalização", "Placa", "Radar", "Multa", "Pedágio", "Rodovia", "Autoestrada", "Viaduto", "Túnel", "Ponte", "Cais", "Porto", "Navio", "Cruzeiro", "Balsa", "Barco", "Lancha", "Veleiro", "Âncora", "Farol", "Bússola", "Navegação", "Embarcação", "Tripulante"
];

const overlaps = m11_candidates.filter(w => baseline.has(w.toLowerCase().trim()));
console.log('Overlaps in M11:', overlaps);

const unique_m11 = m11_candidates.filter(w => !baseline.has(w.toLowerCase().trim()));
console.log('Unique words in M11:', unique_m11.length);
