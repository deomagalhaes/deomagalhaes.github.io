/**
 * NEXUS VAULT — Aba 2: Gestão Fitotécnica de Bonsai (Capacidade: +100 Plantas)
 * Guia Botânico Expandido (26 Espécies), Calendário Sazonal Dinâmico (Hemisfério Sul),
 * Histórico Detalhado de Manejos, Controle de Aramação/Desarame e Manejo em Lote One-Handed
 */
(function (global) {
    'use strict';

    // =========================================================================
    // 1. GUIA BOTÂNICO EXPANDIDO FITOTÉCNICO (26 ESPÉCIES CONSAGRADAS)
    // =========================================================================
    const SPECIES_GUIDE_DB = [
        {
            popular: 'Jabuticabeira Sabará',
            scientific: 'Plinia cauliflora',
            family: 'Myrtaceae',
            origin: 'Nativa Brasileira (Mata Atlântica)',
            sun: 'Sol Pleno a Meia-Sombra',
            water: 'Muito Alta (Substrato nunca deve secar 100%)',
            repotSeason: 'Nov a Jan (Pico do calor e início das chuvas)',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Casca de Pinus / 10% Carvão moído',
            pruningGuide: 'Poda de manutenção constante nos ápices para estimular floração no tronco. Poda drástica apenas no verão.',
            wiringGuide: 'Galhos lenhosos rígidos e quebradiços. Aramar brotos semi-lenhosos com alumínio. Retirar em 60–90 dias.',
            fertGuide: 'Adubação orgânica abundante (Bokashi / Torta de mamona com farinha de ossos) na primavera/verão.',
            sensitivities: 'Muito sensível à falta d’água; ferrugem da jabuticabeira em épocas muito úmidas.'
        },
        {
            popular: 'Caliandra Rosa',
            scientific: 'Calliandra brevipes',
            family: 'Fabaceae',
            origin: 'Nativa da América do Sul / Brasil',
            sun: 'Sol Pleno (essencial para floração abundante)',
            water: 'Moderada a Alta (drenagem perfeita)',
            repotSeason: 'Set a Nov (Início da primavera)',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Pinus / 10% Pedrisco',
            pruningGuide: 'Crescimento vigoroso. Podar ápices após floradas para manter a compacidade da copa.',
            wiringGuide: 'Madeira extremamente frágil e quebradiça. Prefira modelar com poda de direcionamento ou tensores.',
            fertGuide: 'NPK rico em Fósforo (P) no fim do inverno/primavera para potencializar botões florais.',
            sensitivities: 'Cochonilhas de carapaça em ramos internos sem ventilação.'
        },
        {
            popular: 'Caliandra Vermelha',
            scientific: 'Calliandra tweedii',
            family: 'Fabaceae',
            origin: 'Nativa Brasileira (Sul / Sudeste)',
            sun: 'Sol Pleno',
            water: 'Moderada (tolerante a pequenos períodos de seca relativa)',
            repotSeason: 'Out a Dez',
            repotCycleMonths: 24,
            substrate: '70% Caqueira / 20% Casca Pinus / 10% Carvão',
            pruningGuide: 'Pinçar novas brotações deixando 2 a 3 pares de folíolos.',
            wiringGuide: 'Aramar com cuidado extremo; madeira estala sem aviso. Proteger com ráfia se for vergar galhos grossos.',
            fertGuide: 'Orgânico a cada 30 dias na primavera; suspender no auge do inverno.',
            sensitivities: 'Sensível a geadas fortes e ventos frios contínuos.'
        },
        {
            popular: 'Pitangueira',
            scientific: 'Eugenia uniflora',
            family: 'Myrtaceae',
            origin: 'Nativa Brasileira',
            sun: 'Sol Pleno (folhas avermelham com sol forte e frio suave)',
            water: 'Alta (gosta de umidade constante sem encharcamento)',
            repotSeason: 'Out a Jan',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Pinus / 10% Pedrisco',
            pruningGuide: 'Excelente resposta à poda de redução. Ramificação fina espetacular. Desfolha parcial no verão.',
            wiringGuide: 'Casca lisa e delicada que esfolia naturalmente. Usar arame encapado ou fita para não marcar o tronco.',
            fertGuide: 'Adubo balanceado na brotação; reforço de potássio no outono para engorda do nebari.',
            sensitivities: 'Pulgões em brotos novos e fungos foliares no excesso de sombra.'
        },
        {
            popular: 'Junípero Shimpaku',
            scientific: 'Juniperus chinensis',
            family: 'Cupressaceae',
            origin: 'Ásia (Japão / China)',
            sun: 'Sol Pleno rigoroso (mínimo 5 a 6h de sol direto)',
            water: 'Moderada (deixar o substrato secar ligeiramente na superfície antes de regar)',
            repotSeason: 'Ago a Out (Fim de inverno / início da primavera no Hemisfério Sul)',
            repotCycleMonths: 36,
            substrate: '50% Akadama (ou Caqueira fina) / 30% Púmice / 20% Rocha Vulcânica ou Pedrisco',
            pruningGuide: 'Nunca usar tesoura na folhagem verde escamiforme (as pontas queimam de marrom). Pinçar com a ponta dos dedos.',
            wiringGuide: 'Excelente flexibilidade. Tolera curvas dramáticas com ráfia. Arame de cobre ou alumínio espesso.',
            fertGuide: 'Adubação orgânica constante (Biogold ou Bokashi) de Setembro a Maio.',
            sensitivities: 'Ácaros vermelhos em períodos secos; apodrecimento radicular se o solo reter água excessiva.'
        },
        {
            popular: 'Junípero Procumbens',
            scientific: 'Juniperus procumbens nana',
            family: 'Cupressaceae',
            origin: 'Japão',
            sun: 'Sol Pleno',
            water: 'Moderada (boa drenagem)',
            repotSeason: 'Ago a Set',
            repotCycleMonths: 36,
            substrate: '50% Caqueira / 30% Púmice / 20% Pedrisco',
            pruningGuide: 'Limpeza de agulhas velhas e ramos descendentes indesejados no outono. Pinçagem no verão.',
            wiringGuide: 'Ideal para estilos Kengai (cascata) e Han-Kengai. Manter arame de 6 a 9 meses monitorando marcas.',
            fertGuide: 'Orgânico sólido em sachês a cada 45 dias.',
            sensitivities: 'Sensível ao excesso de calor no vaso preto; sombrear raízes no verão causticante.'
        },
        {
            popular: 'Acer Palmatum',
            scientific: 'Acer palmatum',
            family: 'Sapindaceae',
            origin: 'Japão / Coreia',
            sun: 'Meia-Sombra / Sol da manhã suave (sol da tarde queima as bordas das folhas)',
            water: 'Constante e equilibrada (raízes finas muito sensíveis à dessecação)',
            repotSeason: 'Jul a Ago (Final do inverno, logo antes das gemas intumescerem)',
            repotCycleMonths: 12,
            substrate: '50% Akadama / 30% Púmice / 20% Turfa/Pinus lavado',
            pruningGuide: 'Poda de ramificação fina no final do outono/inverno. Pinçagem do par central na primeira brotação primaveril.',
            wiringGuide: 'Casca verde muito macia e suscetível a cicatrizes eternas. Usar alumínio frouxo e retirar em 40–60 dias.',
            fertGuide: 'Muito comedida na primavera (para manter entre-nós curtos); reforço orgânico suave no outono.',
            sensitivities: 'Ventos secos, ar seco, água com cloro alto e sol causticante acima de 32°C.'
        },
        {
            popular: 'Acer Burgeriano (Tridente)',
            scientific: 'Acer buergerianum',
            family: 'Sapindaceae',
            origin: 'Leste Asiático',
            sun: 'Sol Pleno (muito mais resistente que o Palmatum)',
            water: 'Alta no verão, moderada nas outras estações',
            repotSeason: 'Jul a Ago',
            repotCycleMonths: 12,
            substrate: '50% Caqueira / 30% Púmice / 20% Pinus',
            pruningGuide: 'Crescimento radicular e aéreo explosivo. Tolera desfolha total no meio da primavera para redução de folha.',
            wiringGuide: 'Ramos engrossam em semanas no auge do vigor. Revisar arames a cada 3 semanas na primavera!',
            fertGuide: 'Adubação generosa após a primeira brotação maturar.',
            sensitivities: 'Excelente rusticidade; atentar para fungos oídio em outonos úmidos.'
        },
        {
            popular: 'Bougainvillea (Primavera)',
            scientific: 'Bougainvillea glabra',
            family: 'Nyctaginaceae',
            origin: 'Nativa Brasileira',
            sun: 'Sol Pleno intenso (imprescindível para brácteas coloridas)',
            water: 'Baixa a Moderada (estresse hídrico leve estimula floração)',
            repotSeason: 'Out a Fev (Apenas no calor estabelecido; detesta raiz fria e úmida)',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Pinus / 10% Areia grossa ou Pedrisco',
            pruningGuide: 'Poda drástica após a floração. Cortar galhos longos deixando 2 gemas.',
            wiringGuide: 'Galhos velhos quebram como vidro. Modelar ramos jovens ainda verdes e flexíveis.',
            fertGuide: 'Farinha de osso e adubos fosfatados estimulam floração constante.',
            sensitivities: 'Raízes quebradiças no transplante (não desembaraçar com força excessiva).'
        },
        {
            popular: 'Ficus Tiger Bark',
            scientific: 'Ficus microcarpa',
            family: 'Moraceae',
            origin: 'Sudeste Asiático',
            sun: 'Sol Pleno a Meia-Sombra brilhante',
            water: 'Moderada a Alta (adapta-se com vigor formidável)',
            repotSeason: 'Out a Fev (Meses mais quentes do ano)',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Pinus / 10% Carvão',
            pruningGuide: 'Tolera qualquer nível de poda, rebrotando até de madeira antiga sem nenhuma folha remanescente.',
            wiringGuide: 'Flexibilidade excepcional. Cicatrizes fecham rápido se cobertas com pasta cicatrizante.',
            fertGuide: 'Adubação rica em Nitrogênio e matéria orgânica durante todo o período vegetativo.',
            sensitivities: 'Trips (enrola as folhas novas) e sensibilidade ao frio abaixo de 8°C.'
        },
        {
            popular: 'Ulmus (Olmo Chinês)',
            scientific: 'Ulmus parvifolia',
            family: 'Ulmaceae',
            origin: 'China / Japão',
            sun: 'Sol Pleno a Meia-Sombra',
            water: 'Moderada (substrato levemente úmido)',
            repotSeason: 'Jul a Set (Fim do inverno)',
            repotCycleMonths: 18,
            substrate: '60% Caqueira / 30% Púmice / 10% Pinus',
            pruningGuide: 'Excelente capacidade de ramificação fina. Método "clip and grow" funciona com perfeição.',
            wiringGuide: 'Aramar ramos jovens na primavera; casca desenvolve cortiça madura com a idade que deve ser protegida.',
            fertGuide: 'Equilibrado primavera e outono.',
            sensitivities: 'Lagartas desfolhadoras e pulgões nas brotações tenras.'
        },
        {
            popular: 'Azaleia Satsuki',
            scientific: 'Rhododendron indicum',
            family: 'Ericaceae',
            origin: 'Japão',
            sun: 'Meia-Sombra a Sol da manhã',
            water: 'Constante, água livre de calcário (aprecia pH ácido entre 5.0 e 5.5)',
            repotSeason: 'Nov a Dez (Imediatamente após o término da floração!)',
            repotCycleMonths: 24,
            substrate: '80% Kanuma (ou Caqueira ácida lavada com Turfa de Sphagnum) / 20% Púmice',
            pruningGuide: 'Dominância basal (a base cresce mais rápido que o topo). Podar forte na base e suave no ápice.',
            wiringGuide: 'Ramos lenhosos quebram facilmente. Aramar antes da formação dos botões florais com cuidado.',
            fertGuide: 'Adubo específico para plantas acidófilas; nunca usar adubos com cal ou calcário.',
            sensitivities: 'Clorose férrica se o solo ficar alcalino; brocas de tronco.'
        },
        {
            popular: 'Piracanta',
            scientific: 'Pyracantha coccinea',
            family: 'Rosaceae',
            origin: 'Sul da Europa e Ásia',
            sun: 'Sol Pleno',
            water: 'Moderada a Alta no período de frutificação',
            repotSeason: 'Ago a Out',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Pinus / 10% Pedrisco',
            pruningGuide: 'Poda de contenção no verão. Espinhos afiados devem ser desbastados nas áreas de trabalho.',
            wiringGuide: 'Madeira flexível quando jovem, mas espessa muito rápido. Remover arames antes do verão.',
            fertGuide: 'Adubação rica em P-K no outono estimula frutos abundantes e brilhantes.',
            sensitivities: 'Pulgões e fogo bacteriano em climas muito quentes e úmidos sem circulação de ar.'
        },
        {
            popular: 'Serissa (Árvore das Mil Estrelas)',
            scientific: 'Serissa foetida',
            family: 'Rubiaceae',
            origin: 'Sudeste Asiático',
            sun: 'Meia-Sombra iluminada (evitar sol escaldante do meio-dia)',
            water: 'Moderada constante (detesta ressecamento total e encharcamento)',
            repotSeason: 'Set a Nov',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Turfa / 10% Carvão',
            pruningGuide: 'Pinçar novas brotações para manter o formato arredondado dos patamares.',
            wiringGuide: 'Ramos finos e delicados. Usar arames de calibre reduzido (1.0 a 1.5mm).',
            fertGuide: 'Adubação líquida orgânica suave a cada 15 dias na primavera/verão.',
            sensitivities: 'Derruba folhas se mudar bruscamente de lugar ou receber rajadas de vento frio.'
        },
        {
            popular: 'Cerejeira do Rio Grande',
            scientific: 'Eugenia involucrata',
            family: 'Myrtaceae',
            origin: 'Nativa Brasileira (Sul / Sudeste)',
            sun: 'Sol Pleno',
            water: 'Alta (substrato sempre fresco)',
            repotSeason: 'Out a Dez',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Pinus / 10% Carvão',
            pruningGuide: 'Brotação avermelhada exuberante. Podar deixando 2 pares de folhas após o crescimento do ramo.',
            wiringGuide: 'Madeira dura e resistente. Aramação de direcionamento na primavera.',
            fertGuide: 'Orgânico rico em matéria vegetal decomposta e farinha de ossos.',
            sensitivities: 'Ferrugem em períodos excessivamente chuvosos; atentar para drenagem do vaso.'
        },
        {
            popular: 'Araçá Amarelo',
            scientific: 'Psidium cattleianum',
            family: 'Myrtaceae',
            origin: 'Nativa Brasileira',
            sun: 'Sol Pleno',
            water: 'Alta no verão; moderada no inverno',
            repotSeason: 'Out a Jan',
            repotCycleMonths: 24,
            substrate: '65% Caqueira / 25% Pinus / 10% Carvão',
            pruningGuide: 'Excelente capacidade de brotação de madeira velha. Tronco descasca revelando tons suaves.',
            wiringGuide: 'Aramar com cuidado nas pontas; casca lisa descasca facilmente sob fricção de arame solto.',
            fertGuide: 'Bokashi mensal durante a primavera e o verão.',
            sensitivities: 'Mosca-das-frutas durante o amadurecimento dos frutos.'
        },
        {
            popular: 'Ipê-Amarelo',
            scientific: 'Handroanthus albus',
            family: 'Bignoniaceae',
            origin: 'Nativa Brasileira',
            sun: 'Sol Pleno absoluto',
            water: 'Moderada (reduzir significativamente a rega no inverno para induzir floração)',
            repotSeason: 'Set a Out (Logo após o término da floração de inverno/primavera)',
            repotCycleMonths: 24,
            substrate: '70% Caqueira / 20% Casca Pinus / 10% Pedrisco',
            pruningGuide: 'Poda de redução de entrenós logo após as brotações iniciais. Folhas compostas exigem desfolha.',
            wiringGuide: 'Ramos engrossam de maneira rápida e vigorosa. Checar arames a cada 30 dias.',
            fertGuide: 'Fósforo alto no final do outono; suspender adubos nitrogenados no inverno.',
            sensitivities: 'Lagartas devoradoras de folhas na brotação de primavera.'
        },
        {
            popular: 'Amoreira',
            scientific: 'Morus nigra',
            family: 'Moraceae',
            origin: 'Ásia / Aclimatada no Brasil',
            sun: 'Sol Pleno',
            water: 'Alta (consome muita água no verão)',
            repotSeason: 'Jul a Ago (Inverno, em repouso vegetativo)',
            repotCycleMonths: 12,
            substrate: '60% Caqueira / 30% Pinus / 10% Pedrisco',
            pruningGuide: 'Vigor incomparável. Desfolha de verão reduz o tamanho das folhas para 20% do original.',
            wiringGuide: 'Madeira mole e suculenta que ganha rigidez rápida. Aramar ramos verdes.',
            fertGuide: 'Adubação pesada durante todo o crescimento ativo.',
            sensitivities: 'Cochonilhas e formigas cortadeiras.'
        },
        {
            popular: 'Romãzeira Anã',
            scientific: 'Punica granatum nana',
            family: 'Lythraceae',
            origin: 'Mediterrâneo / Ásia',
            sun: 'Sol Pleno (essencial para flores laranjas e frutificação)',
            water: 'Moderada (deixar a camada superior do vaso secar entre as regas)',
            repotSeason: 'Ago a Out',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Púmice ou Pedrisco / 10% Pinus',
            pruningGuide: 'Corta-se ramos que já floresceram para estimular novas pontas produtivas.',
            wiringGuide: 'Galhos finos e retorcidos fáceis de modelar. Tronco ganha aspecto retorcido milenar com o tempo.',
            fertGuide: 'Adubo balanceado na primavera e rico em potássio no outono.',
            sensitivities: 'Oídio foliar se mantida em ambientes úmidos sem sol direto.'
        },
        {
            popular: 'Pinheiro Negro Japonês',
            scientific: 'Pinus thunbergii',
            family: 'Pinaceae',
            origin: 'Japão',
            sun: 'Sol Pleno absoluto e boa ventilação',
            water: 'Controlada (raízes necessitam de aeração com fungos micorrizas saudáveis)',
            repotSeason: 'Jul a Ago (Inverno profundo no Hemisfério Sul)',
            repotCycleMonths: 36,
            substrate: '50% Caqueira grossa / 30% Púmice / 20% Rocha Vulcânica (nunca usar matéria orgânica pura)',
            pruningGuide: 'Técnica de Mekiri (corte de velas na primavera) e Desagulhamento (Mekaki) no outono para equilibrar vigor.',
            wiringGuide: 'Aramação pesada no inverno com arame de cobre recozido. Pode permanecer no galho por 12 meses.',
            fertGuide: 'Orgânico sólido a partir do fim da primavera, após o amadurecimento das novas agulhas.',
            sensitivities: 'Morte de micorrizas por excesso de umidade no fundo do vaso; broca das pontas.'
        },
        {
            popular: 'Resedá (Flor-de-Merenda)',
            scientific: 'Lagerstroemia indica',
            family: 'Lythraceae',
            origin: 'Ásia',
            sun: 'Sol Pleno',
            water: 'Moderada a Alta',
            repotSeason: 'Jul a Set',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Pinus / 10% Pedrisco',
            pruningGuide: 'Poda invernal das inflorescências velhas. Casca marmorizada descama naturalmente no verão.',
            wiringGuide: 'Madeira bastante flexível quando jovem. Muito plástica para estilos verticais informais.',
            fertGuide: 'Adubação primaveril regular.',
            sensitivities: 'Muito suscetível ao fungo oídio nas folhas e botões em primaveras abafadas.'
        },
        {
            popular: 'Buxinho',
            scientific: 'Buxus sempervirens',
            family: 'Buxaceae',
            origin: 'Europa e Mediterrâneo',
            sun: 'Sol Pleno a Meia-Sombra',
            water: 'Moderada (boa drenagem)',
            repotSeason: 'Ago a Out',
            repotCycleMonths: 36,
            substrate: '60% Caqueira / 25% Pinus / 15% Pedrisco',
            pruningGuide: 'Crescimento lento e controlado. Poda de tesoura mantendo tufos compactos de folhagem perene.',
            wiringGuide: 'Madeira extremamente densa e dura. Dificilmente verga galhos grossos sem cortes ou tensores.',
            fertGuide: 'Adubação orgânica equilibrada.',
            sensitivities: 'Ácaros em clima seco e fungo Cylindrocladium em umidade excessiva.'
        },
        {
            popular: 'Carmona (Chá de Fukien)',
            scientific: 'Carmona retusa',
            family: 'Boraginaceae',
            origin: 'China / Sudeste Asiático',
            sun: 'Muita luminosidade / Sol filtrado ou pleno matinal',
            water: 'Moderada (substrato úmido sem água parada)',
            repotSeason: 'Nov a Jan (Espécie puramente tropical)',
            repotCycleMonths: 24,
            substrate: '50% Caqueira / 30% Turfa / 20% Pedrisco',
            pruningGuide: 'Poda constante de pontas para manter o contorno das copas.',
            wiringGuide: 'Galhos jovens e macios. Proteger a casca com fita de proteção.',
            fertGuide: 'Orgânico suave todo o ano, com pausa nos meses mais frios.',
            sensitivities: 'Intolerante ao frio abaixo de 12°C. Pulgões e moscas brancas.'
        },
        {
            popular: 'Jacarandá Mimoso',
            scientific: 'Jacaranda mimosifolia',
            family: 'Bignoniaceae',
            origin: 'América do Sul (Brasil / Argentina)',
            sun: 'Sol Pleno',
            water: 'Moderada',
            repotSeason: 'Set a Nov',
            repotCycleMonths: 24,
            substrate: '70% Caqueira / 20% Pinus / 10% Pedrisco',
            pruningGuide: 'Folhagem plumosa bipinada que requer pinçagem frequente para reduzir o comprimento das folhas.',
            wiringGuide: 'Ramos crescem retos e eretos; aramação precoce é mandatória para dar movimento.',
            fertGuide: 'Balanço NPK 10-10-10 na primavera.',
            sensitivities: 'Sensível a ventos fortes que quebram folhas plumosas tenras.'
        },
        {
            popular: 'Pitecolóbio (Chuva de Ouro)',
            scientific: 'Chloroleucon tortum',
            family: 'Fabaceae',
            origin: 'Nativa da Restinga Brasileira',
            sun: 'Sol Pleno rigoroso',
            water: 'Baixa a Moderada (muito tolerante à seca relativa)',
            repotSeason: 'Nov a Fev (Apenas com calor forte)',
            repotCycleMonths: 24,
            substrate: '70% Caqueira / 20% Areia grossa / 10% Casca Pinus',
            pruningGuide: 'Tronco escultural com caneluras tortuosas magníficas. Espinhos devem ser podados para manejo.',
            wiringGuide: 'Aramar com arame de alumínio encapado quando os ramos ainda tiverem coloração verde.',
            fertGuide: 'Adubação fosfatada leve no verão.',
            sensitivities: 'Detesta frio intenso e solos encharcados sem drenagem imediata.'
        },
        {
            popular: 'Ficus Retusa',
            scientific: 'Ficus retusa',
            family: 'Moraceae',
            origin: 'Ásia Tropical',
            sun: 'Sol Pleno a Meia-Sombra',
            water: 'Moderada a Alta',
            repotSeason: 'Out a Fev',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Pinus / 10% Pedrisco',
            pruningGuide: 'Tolera podas drásticas de redução e cicatriza com vigor exemplar.',
            wiringGuide: 'Excelente maleabilidade; vigiar arame para não estrangular os ramos em rápido crescimento.',
            fertGuide: 'NPK balanceado + matéria orgânica na primavera/verão.',
            sensitivities: 'Cochonilhas e trips.'
        }
    ];

    const SPECIES_DICT = SPECIES_GUIDE_DB.map((s) => ({
        popular: s.popular,
        scientific: s.scientific
    }));

    const SUBSTRATE_PRESETS = [
        '60% Caqueira / 30% Pinus / 10% Pedrisco',
        '70% Caqueira / 20% Casca Pinus / 10% Carvão',
        '50% Akadama / 30% Púmice / 20% Rocha Vulcânica',
        '50% Caqueira / 40% Turfa Fibrosa / 10% Areia Grossa',
        '80% Kanuma Ácida / 20% Púmice (Azaleias)'
    ];

    const STAGES = ['Muda', 'Pré-bonsai', 'Bonsai', 'Yamadori'];
    const POTS = ['Cerâmica', 'Treino', 'Escorredor/Chão', 'Laje'];

    // =========================================================================
    // 2. CALENDÁRIO SAZONAL FITOTÉCNICO DINÂMICO (HEMISFÉRIO SUL / BRASIL)
    // =========================================================================
    const SEASONAL_CALENDAR_SH = [
        {
            monthIndex: 0,
            name: 'Janeiro',
            season: 'Verão',
            seasonIcon: 'sun-medium',
            seasonBadgeCls: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
            climateNotice: 'Calor intenso, chuvas fortes frequentes e radiação UV no pico.',
            priorities: [
                'Rega rigorosa: verificar vasos menores 2x ao dia (início da manhã e fim da tarde).',
                'Pinçagem contínua de brotações apicais para conter dominância e ramificar patamares.',
                'Vigiar arames de primavera: galhos engrossam rápido e podem ficar marcados em dias.',
                'Transplante seguro apenas de espécies tropicais plenas (Ficus, Jabuticabeira, Pitecolóbio).'
            ],
            speciesInFocus: ['Jabuticabeira', 'Ficus', 'Bougainvillea', 'Pitecolóbio', 'Araçá']
        },
        {
            monthIndex: 1,
            name: 'Fevereiro',
            season: 'Verão',
            seasonIcon: 'sun-medium',
            seasonBadgeCls: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
            climateNotice: 'Fim do auge do verão, umidade do ar elevada e dias longos.',
            priorities: [
                'Prevenção contra fungos foliares (ferrugem e oídio) em ambientes sem boa circulação de ar.',
                'Adubação orgânica rica em potássio e fósforo (iniciar preparação de reservas outonais).',
                'Proteção térmica das raízes: sombrear vasos pretos de plástico expostos ao sol poente.',
                'Poda de contenção em mudas e exemplares de crescimento acelerado (Amoreira, Caliandra).'
            ],
            speciesInFocus: ['Bougainvillea', 'Caliandra Rosa', 'Ficus Tiger Bark', 'Amoreira']
        },
        {
            monthIndex: 2,
            name: 'Março',
            season: 'Outono',
            seasonIcon: 'leaf',
            seasonBadgeCls: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
            climateNotice: 'Transição climática: noites mais frescas, diminuição gradual das chuvas.',
            priorities: [
                'Momento chave para adubação rica em P e K para espessamento de troncos e nebari.',
                'Reduzir ligeiramente a frequência de regas conforme a evaporação diária diminui.',
                'Limpeza sanitária: remover folhas amarelas, ervas invasoras e restos de adubo exaurido.',
                'Planejamento de aramações estruturais de outono.'
            ],
            speciesInFocus: ['Acer Burgeriano', 'Piracanta', 'Ulmus', 'Romãzeira']
        },
        {
            monthIndex: 3,
            name: 'Abril',
            season: 'Outono',
            seasonIcon: 'leaf',
            seasonBadgeCls: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
            climateNotice: 'Dias amenos, noites frias e ar seco. Caducifólias começam a mudar de cor.',
            priorities: [
                'Desfrutar da coloração outonal de Acers e caducifólias sem mover a planta bruscamente.',
                'Aramação estrutural ideal: madeira madura, fluxo de seiva desacelerando.',
                'Aplicação preventiva de óleo de neem ou calda sulfocálcica muito diluída contra cochonilhas.',
                'Diminuir adubações nitrogenadas para não induzir brotações tenras que queimarão no frio.'
            ],
            speciesInFocus: ['Acer Palmatum', 'Junípero Shimpaku', 'Pinheiro Negro', 'Ipê-Amarelo']
        },
        {
            monthIndex: 4,
            name: 'Maio',
            season: 'Outono',
            seasonIcon: 'leaf',
            seasonBadgeCls: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
            climateNotice: 'Seca e frio se estabelecem no Sudeste/Sul. Plantas entram em dormência.',
            priorities: [
                'Suspender fertilização de caducifólias em processo de desfolha natural.',
                'Trabalhos em madeira morta (Jin e Shari) em coníferas com aplicação de calda sulfocálcica pura.',
                'Manter Juníperos e Pinheiros em sol pleno para absorver todo o calor diurno possível.',
                'Ajustar rega matinal (nunca regar à noite para não manter raízes geladas de madrugada).'
            ],
            speciesInFocus: ['Junípero Procumbens', 'Pinheiro Negro', 'Buxinho', 'Serissa']
        },
        {
            monthIndex: 5,
            name: 'Junho',
            season: 'Inverno',
            seasonIcon: 'snowflake',
            seasonBadgeCls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
            climateNotice: 'Dias mais curtos do ano, geadas ocasionais e baixíssima umidade do ar.',
            priorities: [
                'Proteção contra geadas para tropicais delicadas (Carmona, Ficus jovens, Serissa).',
                'Poda drástica estrutural em caducifólias totalmente desfolhadas (visão clara da arquitetura de galhos).',
                'Selar todos os cortes acima de 3mm com pasta cicatrizante japonesa de alta aderência.',
                'Rega espaçada: apenas quando a superfície do substrato estiver seca.'
            ],
            speciesInFocus: ['Acer Burgeriano', 'Acer Palmatum', 'Ulmus', 'Amoreira']
        },
        {
            monthIndex: 6,
            name: 'Julho',
            season: 'Inverno',
            seasonIcon: 'snowflake',
            seasonBadgeCls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
            climateNotice: 'Pico do inverno. Período clássico de repouso vegetativo profundo.',
            priorities: [
                'Início da janela de transplante para caducifólias clássicas e coníferas (Pinus e Juníperos).',
                'Poda severa de raízes grossas e ancoragem perfeita no vaso com arames de fundo.',
                'Limpeza detalhada de cascas velhas e musgos que acumulam umidade excessiva no colo.',
                'Manter o substrato novo protegido de ventos fortes congelantes pós-transplante.'
            ],
            speciesInFocus: ['Pinheiro Negro', 'Acer Burgeriano', 'Ulmus', 'Amoreira']
        },
        {
            monthIndex: 7,
            name: 'Agosto',
            season: 'Inverno',
            seasonIcon: 'snowflake',
            seasonBadgeCls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
            climateNotice: 'Fim de inverno, ar muito seco, primeiros botões de Ipês e gemas intumescendo.',
            priorities: [
                'Janela máxima de transplante: transplantar antes que as gemas abram as primeiras folhas!',
                'Preparação de substratos (peneirar poeira de caqueira, akadama e casca de pinus).',
                'Atenção especial à hidratação em dias com umidade relativa do ar abaixo de 25%.',
                'Poda de raízes e troca de vasos de exemplares com ciclo vencido.'
            ],
            speciesInFocus: ['Ipê-Amarelo', 'Acer Palmatum', 'Piracanta', 'Junípero Shimpaku']
        },
        {
            monthIndex: 8,
            name: 'Setembro',
            season: 'Primavera',
            seasonIcon: 'sprout',
            seasonBadgeCls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
            climateNotice: 'Início oficial da primavera. Explosão de brotações novas e florações.',
            priorities: [
                'Retomada gradual da adubação orgânica assim que a primeira brotação estiver aberta.',
                'Pinçagem de pontas com dedos ou tesoura fina para evitar o alongamento de entrenós.',
                'Transplante de frutíferas nativas e espécies de brotação mais tardia (Caliandras).',
                'Monitoramento intensivo de pulgões e lagartas atraídas pelas brotações tenras.'
            ],
            speciesInFocus: ['Caliandra Rosa', 'Ipê-Amarelo', 'Azaleia Satsuki', 'Pitangueira']
        },
        {
            monthIndex: 9,
            name: 'Outubro',
            season: 'Primavera',
            seasonIcon: 'sprout',
            seasonBadgeCls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
            climateNotice: 'Calor em ascensão, chuvas de primavera começam a regularizar o ar.',
            priorities: [
                'Adubação plena em ritmo quinzenal/mensal (Bokashi / Osmocote / Torta com Farinha de Ossos).',
                'Desfolha seletiva ou parcial em exemplares com folhas excessivamente grandes.',
                'Revisão periódica de arames aplicados no outono/inverno (risco de morder a casca).',
                'Transplante seguro de nativas que exigem solo quente (Pitanga, Cerejeira do Rio Grande).'
            ],
            speciesInFocus: ['Pitangueira', 'Cerejeira do Rio Grande', 'Bougainvillea', 'Caliandra Vermelha']
        },
        {
            monthIndex: 10,
            name: 'Novembro',
            season: 'Primavera',
            seasonIcon: 'sprout',
            seasonBadgeCls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
            climateNotice: 'Calor constante, umidade elevada, crescimento vegetativo em velocidade máxima.',
            priorities: [
                'Poda de Azaleias logo após o término da florada (remover cálices de flores velhas).',
                'Transplante da Jabuticabeira Sabará no pico de calor e água.',
                'Controle de ervas invasoras que competem por nutrientes nos vasos.',
                'Regas diárias garantidas; inspecionar drenos obstruídos por raízes após as chuvas.'
            ],
            speciesInFocus: ['Jabuticabeira', 'Azaleia Satsuki', 'Ficus Retusa', 'Pitecolóbio']
        },
        {
            monthIndex: 11,
            name: 'Dezembro',
            season: 'Verão',
            seasonIcon: 'sun-medium',
            seasonBadgeCls: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
            climateNotice: 'Solstício de Verão: dias mais longos e sol quente das 11h às 15h.',
            priorities: [
                'Manter bancadas limpas e arejadas para evitar proliferação de fungos e ácaros.',
                'Adubação de manutenção em sachês protegidos contra lavagem por chuvas torrenciais.',
                'Revisão de amarração e tensores de copa.',
                'Férias/Viagens: certificar sistema de irrigação automática ou gotejamento programado.'
            ],
            speciesInFocus: ['Jabuticabeira', 'Ficus Tiger Bark', 'Bougainvillea', 'Serissa']
        }
    ];

    let plants = [];
    let selectedIds = new Set();
    let filters = {
        search: '',
        species: 'ALL',
        bench: 'ALL',
        stage: 'ALL',
        statusMode: 'ALL', // ALL | OVERDUE | FERT_OVERDUE | REPOT_OVERDUE | WIRING_ALERT | NEXT_7D
        sortBy: 'URGENCY'  // URGENCY | ID | SPECIES | BENCH
    };
    let editingId = null;
    let selectedCalendarMonth = new Date().getMonth();

    // =========================================================================
    // 3. MODELO DE DADOS & PERSISTÊNCIA
    // =========================================================================
    function createInitialPlants() {
        const C = global.VaultCore;
        const t = C.todayISO();
        return [
            {
                id: 'B-001',
                popularName: 'Jabuticabeira Sabará',
                scientificName: 'Plinia cauliflora',
                bench: 'Sol Pleno A',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '60% Caqueira / 30% Pinus / 10% Pedrisco',
                lastFertilization: C.addDaysISO(t, -36),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -18),
                repotCycleMonths: 24,
                lastStyling: C.addDaysISO(t, -75),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 4),
                nextInterventionType: 'Poda de limpeza interna + Biogold',
                notes: 'Tronco descascando uniforme; manter rega abundante no calor.',
                logs: [
                    { date: C.addDaysISO(t, -36), type: 'Adubação (+30d)', detail: 'Osmocote 15-09-12 + Torta de mamona' },
                    { date: C.addDaysISO(t, -75), type: 'Poda de Manutenção / Pinçagem', detail: 'Seleção de patamares secundários' }
                ]
            },
            {
                id: 'B-002',
                popularName: 'Caliandra Rosa',
                scientificName: 'Calliandra brevipes',
                bench: 'Sol Pleno A',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '60% Caqueira / 30% Pinus / 10% Pedrisco',
                lastFertilization: C.addDaysISO(t, -12),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -25),
                repotCycleMonths: 24,
                lastStyling: C.addDaysISO(t, -40),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 2),
                nextInterventionType: 'Transplante e poda de raízes finas',
                notes: 'Raízes já preenchendo drenagem do vaso esmaltado oval.',
                logs: [
                    { date: C.addDaysISO(t, -12), type: 'Adubação (+30d)', detail: 'Adubo orgânico líquido NPK balanceado' }
                ]
            },
            {
                id: 'B-003',
                popularName: 'Junípero Shimpaku',
                scientificName: 'Juniperus chinensis',
                bench: 'Sol Pleno B',
                stage: 'Pré-bonsai',
                pot: 'Treino',
                substrate: '50% Akadama / 30% Púmice / 20% Rocha Vulcânica',
                lastFertilization: C.addDaysISO(t, -50),
                fertCycleDays: 45,
                lastRepot: C.addMonthsISO(t, -14),
                repotCycleMonths: 36,
                lastStyling: C.addDaysISO(t, -60),
                wiringDueDate: C.addDaysISO(t, 25),
                nextInterventionDate: C.addDaysISO(t, 14),
                nextInterventionType: 'Revisão de arame de cobre (evitar marca)',
                notes: 'Shari principal tratado com calda sulfocálcica.',
                logs: [
                    { date: C.addDaysISO(t, -50), type: 'Adubação (+45d)', detail: 'Bokashi fermentado em sachês' },
                    { date: C.addDaysISO(t, -60), type: 'Aramação', detail: 'Aramação completa de ramos primários com cobre 2.5mm' }
                ]
            },
            {
                id: 'B-004',
                popularName: 'Pitangueira',
                scientificName: 'Eugenia uniflora',
                bench: 'Engorda / Chão',
                stage: 'Yamadori',
                pot: 'Escorredor/Chão',
                substrate: '70% Caqueira / 20% Casca Pinus / 10% Carvão',
                lastFertilization: C.addDaysISO(t, -18),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -10),
                repotCycleMonths: 18,
                lastStyling: C.addDaysISO(t, -90),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 20),
                nextInterventionType: 'Seleção de brotações de sacrifício',
                notes: 'Nebari de 14 cm em consolidação no escorredor.',
                logs: [
                    { date: C.addDaysISO(t, -18), type: 'Adubação (+30d)', detail: 'Adubação rica em nitrogênio para engorda' }
                ]
            },
            {
                id: 'B-005',
                popularName: 'Acer Burgeriano (Tridente)',
                scientificName: 'Acer buergerianum',
                bench: 'Meia-Sombra 50%',
                stage: 'Bonsai',
                pot: 'Laje',
                substrate: '50% Akadama / 30% Púmice / 20% Rocha Vulcânica',
                lastFertilization: C.addDaysISO(t, -8),
                fertCycleDays: 45,
                lastRepot: C.addMonthsISO(t, -13),
                repotCycleMonths: 12,
                lastStyling: C.addDaysISO(t, -30),
                wiringDueDate: C.addDaysISO(t, 10),
                nextInterventionDate: C.addDaysISO(t, 5),
                nextInterventionType: 'Pinçagem de entrenós curtos',
                notes: 'Bosque de 5 troncos sobre laje de ardósia.',
                logs: [
                    { date: C.addDaysISO(t, -8), type: 'Adubação (+45d)', detail: 'Pellets orgânicos de liberação lenta' },
                    { date: C.addDaysISO(t, -30), type: 'Aramação', detail: 'Aramação fina de ápices com alumínio 1.5mm' }
                ]
            },
            {
                id: 'B-006',
                popularName: 'Bougainvillea (Primavera)',
                scientificName: 'Bougainvillea glabra',
                bench: 'Sol Pleno B',
                stage: 'Muda',
                pot: 'Treino',
                substrate: '60% Caqueira / 30% Pinus / 10% Pedrisco',
                lastFertilization: C.addDaysISO(t, -5),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -4),
                repotCycleMonths: 12,
                lastStyling: C.addDaysISO(t, -25),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 25),
                nextInterventionType: 'Movimento inicial de tronco com arame alumínio',
                notes: 'Estaca lenhosa com ótima resposta radicular.',
                logs: [
                    { date: C.addDaysISO(t, -5), type: 'Adubação (+30d)', detail: 'Forth Bonsai diluído metade da dose' }
                ]
            }
        ];
    }

    function normalizePlant(p, idx) {
        const C = global.VaultCore;
        const logs = Array.isArray(p.logs) ? p.logs : (Array.isArray(p.history) ? p.history : []);
        return {
            id: String(p.id || `B-${String(idx + 1).padStart(3, '0')}`).trim(),
            popularName: String(p.popularName || 'Espécie sem nome').trim(),
            scientificName: String(p.scientificName || '').trim(),
            bench: String(p.bench || 'Geral').trim(),
            stage: STAGES.includes(p.stage) ? p.stage : 'Pré-bonsai',
            pot: POTS.includes(p.pot) ? p.pot : 'Treino',
            substrate: String(p.substrate || SUBSTRATE_PRESETS[0]).trim(),
            lastFertilization: p.lastFertilization || C.todayISO(),
            fertCycleDays: Number(p.fertCycleDays) || 30,
            lastRepot: p.lastRepot || C.todayISO(),
            repotCycleMonths: Number(p.repotCycleMonths) || 24,
            lastStyling: p.lastStyling || '',
            wiringDueDate: p.wiringDueDate || '',
            nextInterventionDate: p.nextInterventionDate || '',
            nextInterventionType: String(p.nextInterventionType || p.nextInterventionNote || '').trim(),
            notes: String(p.notes || '').trim(),
            logs
        };
    }

    function loadData() {
        const C = global.VaultCore;
        const raw = localStorage.getItem(C.STORAGE_KEYS.BONSAI);
        if (raw === null) {
            plants = createInitialPlants();
            saveData(false);
        } else {
            const parsed = C.store.get(C.STORAGE_KEYS.BONSAI, []);
            plants = Array.isArray(parsed) ? parsed.map(normalizePlant) : [];
        }
        const validSet = new Set(plants.map((p) => p.id));
        selectedIds.forEach((id) => {
            if (!validSet.has(id)) selectedIds.delete(id);
        });
    }

    function saveData(notify = false) {
        const C = global.VaultCore;
        C.store.set(C.STORAGE_KEYS.BONSAI, plants);
        if (notify) C.toast('Acervo de Bonsai salvo localmente.', 'success', 2000);
    }

    function computePlantMetrics(p) {
        const C = global.VaultCore;
        const nextFertIso = C.addDaysISO(p.lastFertilization, p.fertCycleDays);
        const fertDiff = C.daysDiffFromToday(nextFertIso);

        const nextRepotIso = C.addMonthsISO(p.lastRepot, p.repotCycleMonths);
        const repotDiff = C.daysDiffFromToday(nextRepotIso);

        const customDiff = p.nextInterventionDate ? C.daysDiffFromToday(p.nextInterventionDate) : null;
        const wiringDiff = p.wiringDueDate ? C.daysDiffFromToday(p.wiringDueDate) : null;

        const isFertOverdue = fertDiff !== null && fertDiff < 0;
        const isRepotOverdue = repotDiff !== null && repotDiff < 0;
        const isWiringOverdue = wiringDiff !== null && wiringDiff < 0;
        const isAnyOverdue = isFertOverdue || isRepotOverdue || isWiringOverdue || (customDiff !== null && customDiff < 0);

        const isDue7d =
            (fertDiff !== null && fertDiff >= 0 && fertDiff <= 7) ||
            (repotDiff !== null && repotDiff >= 0 && repotDiff <= 7) ||
            (wiringDiff !== null && wiringDiff >= 0 && wiringDiff <= 7) ||
            (customDiff !== null && customDiff >= 0 && customDiff <= 7);

        const urgencyScore = Math.min(
            fertDiff ?? 9999,
            repotDiff ?? 9999,
            wiringDiff ?? 9999,
            customDiff ?? 9999
        );

        return {
            nextFertIso,
            fertDiff,
            nextRepotIso,
            repotDiff,
            wiringDiff,
            customDiff,
            isFertOverdue,
            isRepotOverdue,
            isWiringOverdue,
            isAnyOverdue,
            isDue7d,
            urgencyScore
        };
    }

    function generateNextId() {
        const maxNum = plants.reduce((max, p) => {
            const m = String(p.id).match(/^B-(\d+)$/i);
            if (m) {
                const n = parseInt(m[1], 10);
                return n > max ? n : max;
            }
            return max;
        }, 0);
        return `B-${String(maxNum + 1).padStart(3, '0')}`;
    }

    function getFilteredPlants() {
        const q = filters.search.trim().toLowerCase();
        let list = plants.map((p) => ({ plant: p, m: computePlantMetrics(p) }));

        if (q) {
            list = list.filter(({ plant: p }) =>
                p.id.toLowerCase().includes(q) ||
                p.popularName.toLowerCase().includes(q) ||
                p.scientificName.toLowerCase().includes(q) ||
                p.bench.toLowerCase().includes(q) ||
                p.substrate.toLowerCase().includes(q) ||
                p.notes.toLowerCase().includes(q)
            );
        }

        if (filters.species !== 'ALL') {
            list = list.filter(({ plant: p }) => p.popularName === filters.species);
        }

        if (filters.bench !== 'ALL') {
            list = list.filter(({ plant: p }) => p.bench === filters.bench);
        }

        if (filters.stage !== 'ALL') {
            list = list.filter(({ plant: p }) => p.stage === filters.stage);
        }

        if (filters.statusMode === 'OVERDUE') {
            list = list.filter(({ m }) => m.isAnyOverdue);
        } else if (filters.statusMode === 'FERT_OVERDUE') {
            list = list.filter(({ m }) => m.isFertOverdue);
        } else if (filters.statusMode === 'REPOT_OVERDUE') {
            list = list.filter(({ m }) => m.isRepotOverdue);
        } else if (filters.statusMode === 'WIRING_ALERT') {
            list = list.filter(({ m }) => m.wiringDiff !== null && (m.isWiringOverdue || m.wiringDiff <= 7));
        } else if (filters.statusMode === 'NEXT_7D') {
            list = list.filter(({ m }) => m.isDue7d);
        }

        list.sort((a, b) => {
            if (filters.sortBy === 'URGENCY') return a.m.urgencyScore - b.m.urgencyScore;
            if (filters.sortBy === 'ID') return a.plant.id.localeCompare(b.plant.id, undefined, { numeric: true });
            if (filters.sortBy === 'SPECIES') return a.plant.popularName.localeCompare(b.plant.popularName, 'pt-BR');
            if (filters.sortBy === 'BENCH') return a.plant.bench.localeCompare(b.plant.bench, 'pt-BR');
            return 0;
        });

        return list;
    }

    // =========================================================================
    // 4. AÇÕES EM LOTE (BATCH MANAGEMENT)
    // =========================================================================
    function applyBatchFertilization(cycleDays) {
        const C = global.VaultCore;
        if (selectedIds.size === 0) {
            C.toast('Nenhuma planta selecionada para adubação em lote.', 'warning');
            return;
        }
        const today = C.todayISO();
        let count = 0;
        plants.forEach((p) => {
            if (selectedIds.has(p.id)) {
                p.lastFertilization = today;
                p.fertCycleDays = cycleDays;
                p.logs.unshift({
                    date: today,
                    type: `Adubação (+${cycleDays}d)`,
                    detail: `Adubação em lote registrada hoje. Próximo alerta em +${cycleDays} dias.`
                });
                count++;
            }
        });
        saveData(false);
        renderAll();
        C.toast(`${count} planta(s) adubadas com sucesso! Próximo ciclo: +${cycleDays} dias.`, 'success');
    }

    function applyBatchRepot() {
        const C = global.VaultCore;
        if (selectedIds.size === 0) {
            C.toast('Selecione as plantas para registrar transplante.', 'warning');
            return;
        }
        const today = C.todayISO();
        let count = 0;
        plants.forEach((p) => {
            if (selectedIds.has(p.id)) {
                p.lastRepot = today;
                p.logs.unshift({
                    date: today,
                    type: 'Transplante & Raízes',
                    detail: `Transplante em lote registrado hoje. Reiniciado ciclo de ${p.repotCycleMonths} meses.`
                });
                count++;
            }
        });
        saveData(false);
        renderAll();
        C.toast(`Transplante registrado para ${count} planta(s).`, 'success');
    }

    function applyBatchSchedule(dateISO, interventionType) {
        const C = global.VaultCore;
        if (selectedIds.size === 0 || !dateISO || !interventionType) {
            C.toast('Preencha a data e o tipo de manejo para o lote.', 'warning');
            return;
        }
        let count = 0;
        plants.forEach((p) => {
            if (selectedIds.has(p.id)) {
                p.nextInterventionDate = dateISO;
                p.nextInterventionType = interventionType;
                p.logs.unshift({
                    date: C.todayISO(),
                    type: 'Agendamento em Lote',
                    detail: `Previsto para ${C.formatDateBR(dateISO)}: ${interventionType}`
                });
                count++;
            }
        });
        saveData(false);
        renderAll();
        C.toast(`Agendado para ${count} planta(s): ${interventionType} (${C.formatDateBR(dateISO)})`, 'success');
    }

    function deleteSelectedBatch() {
        const C = global.VaultCore;
        if (selectedIds.size === 0) return;
        const msg = `Excluir permanentemente as ${selectedIds.size} planta(s) selecionadas do seu acervo?`;
        if (!window.confirm(msg)) return;
        plants = plants.filter((p) => !selectedIds.has(p.id));
        const delCount = selectedIds.size;
        selectedIds.clear();
        saveData(false);
        renderAll();
        C.toast(`${delCount} exemplar(es) removido(s) do acervo.`, 'info');
    }

    function exportBonsaiCSV() {
        const C = global.VaultCore;
        const targetList = selectedIds.size > 0
            ? plants.filter((p) => selectedIds.has(p.id)).map((p) => ({ plant: p, m: computePlantMetrics(p) }))
            : getFilteredPlants();

        const headers = [
            'ID', 'Nome Popular', 'Nome Científico', 'Bancada/Setor', 'Estágio', 'Vaso', 'Substrato',
            'Última Adubação', 'Ciclo Adubação (d)', 'Próx. Adubação', 'Saldo Adubação (d)',
            'Último Transplante', 'Ciclo Transplante (m)', 'Próx. Transplante', 'Última Estilização',
            'Desarame Previsto', 'Próx. Intervenção', 'Tipo Intervenção', 'Observações'
        ];

        const rows = targetList.map(({ plant: p, m }) => [
            p.id, p.popularName, p.scientificName, p.bench, p.stage, p.pot, p.substrate,
            p.lastFertilization, p.fertCycleDays, m.nextFertIso, m.fertDiff,
            p.lastRepot, p.repotCycleMonths, m.nextRepotIso, p.lastStyling,
            p.wiringDueDate || '', p.nextInterventionDate, p.nextInterventionType, p.notes
        ]);

        C.exportCSV(`bonsai-acervo-${C.todayISO()}.csv`, headers, rows);
        C.toast(`Exportado CSV com ${rows.length} planta(s).`, 'success');
    }

    function clonePlantBatch(sourcePlant, copies) {
        const C = global.VaultCore;
        const qty = Math.max(1, Math.min(100, parseInt(copies, 10) || 1));
        const today = C.todayISO();
        for (let i = 0; i < qty; i++) {
            const newId = generateNextId();
            plants.push({
                ...JSON.parse(JSON.stringify(sourcePlant)),
                id: newId,
                logs: [
                    {
                        date: today,
                        type: 'Cadastro em Lote',
                        detail: `Clonado a partir de ${sourcePlant.id} (${sourcePlant.popularName})`
                    }
                ]
            });
        }
        saveData(false);
        renderAll();
        C.toast(`${qty} muda(s)/exemplar(es) clonados com IDs sequenciais!`, 'success');
    }

    // =========================================================================
    // 5. RENDERIZAÇÃO DE INTERFACE E SHELL
    // =========================================================================
    function formatStatusBadge(daysDiff, labelPrefix) {
        if (daysDiff === null || isNaN(daysDiff)) {
            return `<span class="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-400">—</span>`;
        }
        if (daysDiff < 0) {
            return `<span class="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">${labelPrefix ? labelPrefix + ': ' : ''}${Math.abs(daysDiff)}d atraso</span>`;
        }
        if (daysDiff === 0) {
            return `<span class="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">${labelPrefix ? labelPrefix + ': ' : ''}HOJE</span>`;
        }
        if (daysDiff <= 7) {
            return `<span class="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-500/15 text-amber-200 border border-amber-500/30">${labelPrefix ? labelPrefix + ': ' : ''}em ${daysDiff}d</span>`;
        }
        return `<span class="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">${labelPrefix ? labelPrefix + ': ' : ''}+${daysDiff}d</span>`;
    }

    function stageColorClass(stage) {
        switch (stage) {
            case 'Bonsai': return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
            case 'Pré-bonsai': return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
            case 'Yamadori': return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
            default: return 'bg-slate-700/50 text-slate-300 border-slate-600';
        }
    }

    function mountShell() {
        const panel = document.getElementById('tab-panel-bonsai');
        if (!panel) return;

        panel.innerHTML = `
            <div class="space-y-5 pb-28">
                <!-- Cabeçalho Técnico + Ações Principais -->
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-[#0f172a] border border-[#1e293b] rounded-xl p-4">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Módulo Fitotécnico</span>
                            <span class="text-xs font-mono text-slate-400">Alta Densidade • +100 Exemplares</span>
                        </div>
                        <h2 class="text-lg sm:text-xl font-bold text-slate-100 mt-1">Gestão de Acervo de Bonsai, Ciclos Nutricionais e Calendário Sazonal</h2>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                        <button type="button" id="btn-bonsai-guide" class="min-h-[44px] px-3.5 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition">
                            <i data-lucide="book-open" class="w-4 h-4 text-cyan-400"></i>
                            <span>Guia Botânico (26 Espécies)</span>
                        </button>
                        <button type="button" id="btn-bonsai-new" class="min-h-[44px] px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-sm flex items-center gap-2 transition">
                            <i data-lucide="plus-circle" class="w-4 h-4"></i>
                            <span>Nova Planta</span>
                        </button>
                        <button type="button" id="btn-bonsai-export-csv" class="min-h-[44px] px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium flex items-center gap-2 transition">
                            <i data-lucide="file-spreadsheet" class="w-4 h-4 text-cyan-400"></i>
                            <span>Exportar CSV</span>
                        </button>
                    </div>
                </div>

                <!-- 4 KPIs Interativos em Tempo Real -->
                <div id="bonsai-kpi-grid" class="grid grid-cols-2 lg:grid-cols-4 gap-3"></div>

                <!-- PAINEL DINÂMICO: CALENDÁRIO SAZONAL DO HEMISFÉRIO SUL -->
                <div id="bonsai-seasonal-panel" class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-3">
                        <div class="flex items-center gap-2">
                            <i data-lucide="calendar" class="w-5 h-5 text-amber-400"></i>
                            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-100 font-mono">Calendário Sazonal do Hemisfério Sul (Brasil)</h3>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs text-slate-400">Consultar Mês:</span>
                            <select id="seasonal-month-select" class="min-h-[38px] px-3 py-1 rounded-lg bg-[#090d16] border border-slate-700 text-xs font-mono text-cyan-300 font-semibold focus:outline-none focus:border-cyan-500">
                                ${SEASONAL_CALENDAR_SH.map((m) => `
                                    <option value="${m.monthIndex}" ${m.monthIndex === selectedCalendarMonth ? 'selected' : ''}>
                                        ${m.name} (${m.season})
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                    <div id="seasonal-content-container"></div>
                </div>

                <!-- Barra de Busca Instantânea + Filtros Combináveis -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div class="md:col-span-4 relative">
                            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none"></i>
                            <input type="text" id="bonsai-search" placeholder="Buscar ID (B-001), espécie, substrato, nota..."
                                class="w-full min-h-[44px] pl-10 pr-3 py-2 rounded-lg bg-[#090d16] border border-[#1e293b] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500">
                        </div>
                        <div class="md:col-span-3">
                            <select id="bonsai-filter-species" aria-label="Filtrar por espécie"
                                class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-[#1e293b] text-sm text-slate-200 focus:outline-none focus:border-cyan-500">
                                <option value="ALL">Todas as Espécies</option>
                            </select>
                        </div>
                        <div class="md:col-span-2">
                            <select id="bonsai-filter-bench" aria-label="Filtrar por bancada"
                                class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-[#1e293b] text-sm text-slate-200 focus:outline-none focus:border-cyan-500">
                                <option value="ALL">Todas Bancadas</option>
                            </select>
                        </div>
                        <div class="md:col-span-3 flex gap-2">
                            <select id="bonsai-filter-stage" aria-label="Filtrar por estágio"
                                class="w-1/2 min-h-[44px] px-2.5 py-2 rounded-lg bg-[#090d16] border border-[#1e293b] text-sm text-slate-200 focus:outline-none focus:border-cyan-500">
                                <option value="ALL">Estágio: Todos</option>
                                <option value="Muda">Muda</option>
                                <option value="Pré-bonsai">Pré-bonsai</option>
                                <option value="Bonsai">Bonsai</option>
                                <option value="Yamadori">Yamadori</option>
                            </select>
                            <select id="bonsai-sort-by" aria-label="Ordenar por"
                                class="w-1/2 min-h-[44px] px-2.5 py-2 rounded-lg bg-[#090d16] border border-[#1e293b] text-sm text-slate-200 focus:outline-none focus:border-cyan-500">
                                <option value="URGENCY">Ordem: Urgência</option>
                                <option value="ID">Ordem: Código ID</option>
                                <option value="SPECIES">Ordem: Espécie</option>
                                <option value="BENCH">Ordem: Bancada</option>
                            </select>
                        </div>
                    </div>

                    <!-- Chips Rápidos de Filtro + Seleção de Lote Mobile -->
                    <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                        <div class="flex flex-wrap items-center gap-2">
                            <button type="button" data-bonsai-status-chip="ALL" class="min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold border transition">
                                Todos
                            </button>
                            <button type="button" data-bonsai-status-chip="OVERDUE" class="min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5">
                                <i data-lucide="flame" class="w-3.5 h-3.5 text-rose-400"></i>
                                <span>Atrasados (Geral)</span>
                            </button>
                            <button type="button" data-bonsai-status-chip="WIRING_ALERT" class="min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5">
                                <i data-lucide="circle-dot" class="w-3.5 h-3.5 text-cyan-400"></i>
                                <span>Alerta de Aramação</span>
                            </button>
                            <button type="button" data-bonsai-status-chip="NEXT_7D" class="min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5">
                                <i data-lucide="calendar-clock" class="w-3.5 h-3.5 text-amber-400"></i>
                                <span>Próximos 7 Dias</span>
                            </button>
                        </div>

                        <div class="flex flex-wrap items-center gap-2">
                            <button type="button" id="btn-bonsai-select-visible" class="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-cyan-300 flex items-center gap-1.5">
                                <i data-lucide="check-square" class="w-3.5 h-3.5"></i>
                                <span>Selecionar Visíveis</span>
                            </button>
                            <button type="button" id="btn-bonsai-clear-sel" class="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-400">
                                Limpar Seleção
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Lista / Tabela Responsiva de Plantas -->
                <div id="bonsai-list-container" class="space-y-2"></div>

                <!-- Barra Flutuante de Ação em Lote (One-Handed Smartphone) -->
                <div id="bonsai-batch-bar" class="hidden fixed bottom-16 md:bottom-4 left-3 right-3 md:left-6 md:right-6 z-40 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/50 rounded-2xl p-3 shadow-2xl">
                    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div class="flex items-center justify-between lg:justify-start gap-3">
                            <span id="bonsai-batch-count" class="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-mono text-xs font-bold">0 selecionadas</span>
                            <span class="text-xs text-slate-400 hidden sm:inline">Manejo instantâneo com registro automático no histórico individual</span>
                        </div>
                        <div class="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
                            <button type="button" id="btn-batch-fert-30" class="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition">
                                <i data-lucide="sprout" class="w-4 h-4"></i>
                                <span>Adubação Hoje (+30d)</span>
                            </button>
                            <button type="button" id="btn-batch-fert-45" class="min-h-[44px] px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition">
                                <i data-lucide="leaf" class="w-4 h-4"></i>
                                <span>Adubação Hoje (+45d)</span>
                            </button>
                            <button type="button" id="btn-batch-repot" class="min-h-[44px] px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition">
                                <i data-lucide="layers" class="w-4 h-4"></i>
                                <span>Transplante Hoje</span>
                            </button>
                            <button type="button" id="btn-batch-schedule-toggle" class="min-h-[44px] px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition">
                                <i data-lucide="calendar-plus" class="w-4 h-4"></i>
                                <span>Agendar Lote</span>
                            </button>
                            <button type="button" id="btn-batch-delete" class="min-h-[44px] px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-semibold text-xs flex items-center justify-center gap-1.5 col-span-2 sm:col-span-1 transition">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                <span>Excluir</span>
                            </button>
                        </div>
                    </div>
                    <!-- Subbarra expansível de agendamento em lote -->
                    <div id="bonsai-batch-schedule-box" class="hidden mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
                        <input type="date" id="batch-sched-date" class="min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-xs font-mono text-slate-100">
                        <input type="text" id="batch-sched-type" placeholder="Ex.: Desfolha parcial, Aramação, Calda sulfocálcica..."
                            class="flex-1 min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-slate-100">
                        <button type="button" id="btn-batch-sched-apply" class="min-h-[44px] px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs">
                            Confirmar Agendamento
                        </button>
                    </div>
                </div>
            </div>

            <!-- MODAL DE CADASTRO / EDIÇÃO / CLONAGEM / HISTÓRICO DETALHADO -->
            <div id="bonsai-modal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
                    <div class="sticky top-0 z-10 bg-[#0f172a]/95 backdrop-blur border-b border-[#1e293b] px-5 py-4 flex items-center justify-between">
                        <div>
                            <h3 id="bonsai-modal-title" class="text-base sm:text-lg font-bold text-slate-100">Ficha Fitotécnica da Planta</h3>
                            <p class="text-xs text-slate-400">Campos integrados ao motor de alertas e histórico individual</p>
                        </div>
                        <button type="button" id="btn-bonsai-modal-close" class="min-h-[40px] min-w-[40px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <form id="bonsai-form" class="p-5 space-y-4">
                        <datalist id="bonsai-species-datalist">
                            ${SPECIES_GUIDE_DB.map((s) => `<option value="${s.popular}">${s.scientific} (${s.family})</option>`).join('')}
                        </datalist>

                        <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
                            <div class="sm:col-span-3">
                                <label class="block text-xs font-mono text-slate-400 mb-1">Código ID *</label>
                                <input type="text" id="bf-id" required class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-cyan-300">
                            </div>
                            <div class="sm:col-span-5">
                                <label class="block text-xs font-mono text-slate-400 mb-1">Espécie (Nome Popular) *</label>
                                <input type="text" id="bf-popular" list="bonsai-species-datalist" required placeholder="Ex.: Jabuticabeira Sabará"
                                    class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-sm text-slate-100">
                            </div>
                            <div class="sm:col-span-4">
                                <label class="block text-xs font-mono text-slate-400 mb-1">Nome Científico</label>
                                <input type="text" id="bf-scientific" placeholder="Ex.: Plinia cauliflora"
                                    class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-sm italic text-slate-300">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label class="block text-xs font-mono text-slate-400 mb-1">Bancada / Setor *</label>
                                <input type="text" id="bf-bench" required placeholder="Ex.: Sol Pleno A"
                                    class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-sm text-slate-100">
                            </div>
                            <div>
                                <label class="block text-xs font-mono text-slate-400 mb-1">Estágio Evolutivo</label>
                                <select id="bf-stage" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-sm text-slate-100">
                                    ${STAGES.map((st) => `<option value="${st}">${st}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-mono text-slate-400 mb-1">Tipo de Vaso</label>
                                <select id="bf-pot" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-sm text-slate-100">
                                    ${POTS.map((pt) => `<option value="${pt}">${pt}</option>`).join('')}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-mono text-slate-400 mb-1">Composição de Substrato</label>
                            <input type="text" id="bf-substrate" placeholder="Ex.: 60% Caqueira / 30% Pinus / 10% Pedrisco"
                                class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-sm text-slate-100">
                            <div class="flex flex-wrap gap-1.5 mt-1.5">
                                ${SUBSTRATE_PRESETS.map((pr) => `<button type="button" data-sub-preset="${pr}" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700">${pr}</button>`).join('')}
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
                            <div>
                                <label class="block text-xs font-mono text-slate-400 mb-1">Última Adubação</label>
                                <input type="date" id="bf-last-fert" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-100">
                            </div>
                            <div>
                                <label class="block text-xs font-mono text-slate-400 mb-1">Ciclo Adubação</label>
                                <select id="bf-fert-cycle" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-100">
                                    <option value="30">A cada 30 dias</option>
                                    <option value="45">A cada 45 dias</option>
                                    <option value="15">A cada 15 dias (líquido)</option>
                                    <option value="60">A cada 60 dias (inverno)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-mono text-slate-400 mb-1">Último Transplante</label>
                                <input type="date" id="bf-last-repot" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-100">
                            </div>
                            <div>
                                <label class="block text-xs font-mono text-slate-400 mb-1">Ciclo Transplante</label>
                                <select id="bf-repot-cycle" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-100">
                                    <option value="12">12 meses (1 ano)</option>
                                    <option value="18">18 meses (1,5 ano)</option>
                                    <option value="24" selected>24 meses (2 anos)</option>
                                    <option value="36">36 meses (3 anos)</option>
                                </select>
                            </div>
                        </div>

                        <!-- Seção de Aramação & Alerta de Desarme -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#090d16]/70 border border-slate-800/80 rounded-xl p-3">
                            <div>
                                <label class="block text-xs font-mono text-cyan-300 mb-1">Última Aramação / Estilização</label>
                                <input type="date" id="bf-last-styling" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-100">
                            </div>
                            <div>
                                <label class="block text-xs font-mono text-cyan-300 mb-1">Data Limite de Desaramamento</label>
                                <input type="date" id="bf-wiring-due" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-100">
                                <span class="text-[10px] text-slate-400">Gera alerta para não estrangular a casca</span>
                            </div>
                            <div>
                                <label class="block text-xs font-mono text-amber-300 mb-1">Próx. Manejo (Data & Tipo)</label>
                                <div class="grid grid-cols-2 gap-1.5">
                                    <input type="date" id="bf-next-date" class="min-h-[44px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-[11px] text-slate-100">
                                    <input type="text" id="bf-next-type" placeholder="Ex: Pinçar ápices" class="min-h-[44px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-slate-100">
                                </div>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-mono text-slate-400 mb-1">Observações Fitotécnicas</label>
                            <textarea id="bf-notes" rows="2" placeholder="Vigor apical, evolução do nebari, pragas tratadas, vaso futuro..."
                                class="w-full px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-sm text-slate-100"></textarea>
                        </div>

                        <!-- Clonador Rápido de Lote de Mudas -->
                        <div id="bonsai-clone-panel" class="hidden bg-slate-900/80 border border-cyan-500/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <p class="text-xs font-semibold text-cyan-300">Clonar Planta (Lote de Mudas / Estacas)</p>
                                <p class="text-[11px] text-slate-400">Cria cópias idênticas na mesma bancada/substrato com códigos sequenciais automáticos.</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <input type="number" id="bf-clone-qty" min="1" max="100" value="10"
                                    class="w-20 min-h-[40px] px-2.5 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-center text-slate-100">
                                <button type="button" id="btn-bf-clone-exec" class="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs whitespace-nowrap">
                                    Gerar Clones
                                </button>
                            </div>
                        </div>

                        <!-- Histórico Estruturado de Manejos da Planta -->
                        <div id="bonsai-history-section" class="hidden border-t border-slate-800 pt-3 space-y-2">
                            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <span class="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">Histórico de Intervenções Realizadas</span>
                                <div class="flex flex-wrap items-center gap-1.5">
                                    <select id="bf-quick-log-category" class="px-2 py-1 rounded bg-[#090d16] border border-slate-700 text-xs text-cyan-300">
                                        <option value="Poda de Manutenção / Pinçagem">Poda Manutenção</option>
                                        <option value="Poda Estrutural">Poda Estrutural</option>
                                        <option value="Aramação">Aramação</option>
                                        <option value="Desaramamento">Desaramamento</option>
                                        <option value="Transplante & Raízes">Transplante</option>
                                        <option value="Adubação Orgânica">Adubação Orgânica</option>
                                        <option value="Tratamento Fitossanitário">Fitossanitário</option>
                                        <option value="Madeira Morta (Jin/Shari)">Jin/Shari</option>
                                    </select>
                                    <input type="text" id="bf-quick-log-input" placeholder="Detalhe do manejo..."
                                        class="px-2.5 py-1 rounded bg-[#090d16] border border-slate-700 text-xs text-slate-200 w-44">
                                    <button type="button" id="btn-bf-add-log" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-emerald-300 border border-slate-700">+ Log</button>
                                </div>
                            </div>
                            <div id="bf-logs-list" class="max-h-40 overflow-y-auto space-y-1 pr-1"></div>
                        </div>

                        <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                            <button type="button" id="btn-bf-delete-single" class="hidden min-h-[44px] px-4 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                                Excluir Exemplar
                            </button>
                            <div class="flex items-center gap-2 ml-auto">
                                <button type="button" id="btn-bf-cancel" class="min-h-[44px] px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm">
                                    Cancelar
                                </button>
                                <button type="submit" class="min-h-[44px] px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm">
                                    Salvar Ficha
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- MODAL DO GUIA BOTÂNICO EXPANDIDO (26 ESPÉCIES) -->
            <div id="bonsai-guide-modal" class="hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto">
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
                    <div class="bg-[#0f172a] border-b border-[#1e293b] p-4 flex items-center justify-between shrink-0">
                        <div class="flex items-center gap-2">
                            <i data-lucide="book-open" class="w-5 h-5 text-cyan-400"></i>
                            <div>
                                <h3 class="text-base sm:text-lg font-bold text-slate-100">Guia Fitotécnico Avançado por Espécie</h3>
                                <p class="text-xs text-slate-400">26 Espécies Consagradas no Brasil • Parâmetros Sazonais do Hemisfério Sul</p>
                            </div>
                        </div>
                        <button type="button" id="btn-guide-modal-close" class="min-h-[40px] min-w-[40px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <div class="p-4 bg-[#090d16] border-b border-slate-800 shrink-0">
                        <div class="relative">
                            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none"></i>
                            <input type="text" id="guide-search-input" placeholder="Buscar por espécie (ex: Jabuticaba, Shimpaku, Acer), família ou bioma..."
                                class="w-full min-h-[44px] pl-10 pr-3 py-2 rounded-lg bg-[#0f172a] border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500">
                        </div>
                    </div>

                    <div id="guide-species-list" class="flex-1 overflow-y-auto p-4 space-y-4"></div>
                </div>
            </div>
        `;

        bindEvents();
    }

    // =========================================================================
    // 6. RENDERIZAÇÃO DE KPIS, CALENDÁRIO SAZONAL E PLANTAS
    // =========================================================================
    function renderKPIs() {
        const grid = document.getElementById('bonsai-kpi-grid');
        if (!grid) return;

        let fertOverdue = 0;
        let repotOverdue = 0;
        let wiringAlert = 0;
        let due7d = 0;
        const stageCounts = { Muda: 0, 'Pré-bonsai': 0, Bonsai: 0, Yamadori: 0 };

        plants.forEach((p) => {
            const m = computePlantMetrics(p);
            if (m.isFertOverdue) fertOverdue++;
            if (m.isRepotOverdue) repotOverdue++;
            if (m.wiringDiff !== null && (m.isWiringOverdue || m.wiringDiff <= 7)) wiringAlert++;
            if (m.isDue7d) due7d++;
            stageCounts[p.stage] = (stageCounts[p.stage] || 0) + 1;
        });

        grid.innerHTML = `
            <button type="button" data-kpi-filter="ALL" class="text-left bg-[#0f172a] hover:bg-slate-900 border ${filters.statusMode === 'ALL' ? 'border-cyan-500/60' : 'border-[#1e293b]'} rounded-xl p-3.5 transition">
                <div class="flex items-center justify-between text-xs text-slate-400">
                    <span>Total no Acervo</span>
                    <i data-lucide="trees" class="w-4 h-4 text-emerald-400"></i>
                </div>
                <div class="text-2xl font-mono font-bold text-slate-100 mt-1">${plants.length}</div>
                <div class="text-[11px] font-mono text-slate-400 mt-1 truncate">
                    ${stageCounts['Bonsai'] || 0} Bonsai • ${stageCounts['Pré-bonsai'] || 0} Pré • ${stageCounts['Muda'] || 0} Mudas
                </div>
            </button>

            <button type="button" data-kpi-filter="FERT_OVERDUE" class="text-left bg-[#0f172a] hover:bg-slate-900 border ${filters.statusMode === 'FERT_OVERDUE' ? 'border-rose-500' : 'border-[#1e293b]'} rounded-xl p-3.5 transition">
                <div class="flex items-center justify-between text-xs text-slate-400">
                    <span>Atrasadas Adubação</span>
                    <i data-lucide="sprout" class="w-4 h-4 ${fertOverdue > 0 ? 'text-rose-400' : 'text-slate-500'}"></i>
                </div>
                <div class="text-2xl font-mono font-bold ${fertOverdue > 0 ? 'text-rose-400' : 'text-emerald-400'} mt-1">${fertOverdue}</div>
                <div class="text-[11px] text-slate-400 mt-1">Nutrição vencida (30/45 dias)</div>
            </button>

            <button type="button" data-kpi-filter="WIRING_ALERT" class="text-left bg-[#0f172a] hover:bg-slate-900 border ${filters.statusMode === 'WIRING_ALERT' ? 'border-cyan-400' : 'border-[#1e293b]'} rounded-xl p-3.5 transition">
                <div class="flex items-center justify-between text-xs text-slate-400">
                    <span>Alertas de Aramação</span>
                    <i data-lucide="circle-dot" class="w-4 h-4 ${wiringAlert > 0 ? 'text-cyan-400' : 'text-slate-500'}"></i>
                </div>
                <div class="text-2xl font-mono font-bold ${wiringAlert > 0 ? 'text-cyan-300' : 'text-slate-300'} mt-1">${wiringAlert}</div>
                <div class="text-[11px] text-slate-400 mt-1">Desaramamento para evitar marcas</div>
            </button>

            <button type="button" data-kpi-filter="NEXT_7D" class="text-left bg-[#0f172a] hover:bg-slate-900 border ${filters.statusMode === 'NEXT_7D' ? 'border-amber-500' : 'border-[#1e293b]'} rounded-xl p-3.5 transition">
                <div class="flex items-center justify-between text-xs text-slate-400">
                    <span>Janela dos 7 Dias</span>
                    <i data-lucide="bell-ring" class="w-4 h-4 text-amber-400"></i>
                </div>
                <div class="text-2xl font-mono font-bold text-amber-300 mt-1">${due7d}</div>
                <div class="text-[11px] text-slate-400 mt-1">Intervenções programadas da semana</div>
            </button>
        `;

        grid.querySelectorAll('[data-kpi-filter]').forEach((btn) => {
            btn.addEventListener('click', () => {
                filters.statusMode = btn.getAttribute('data-kpi-filter');
                renderAll();
            });
        });
    }

    function renderSeasonalPanel() {
        const container = document.getElementById('seasonal-content-container');
        if (!container) return;
        const C = global.VaultCore;

        const cal = SEASONAL_CALENDAR_SH[selectedCalendarMonth] || SEASONAL_CALENDAR_SH[new Date().getMonth()];
        const isCurrentMonth = selectedCalendarMonth === new Date().getMonth();

        // Identifica no acervo as plantas que são das espécies em foco
        const focusPlantsInCollection = plants.filter((p) =>
            cal.speciesInFocus.some((sp) => p.popularName.toLowerCase().includes(sp.toLowerCase()))
        );

        container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                <div class="lg:col-span-4 bg-[#090d16] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-mono uppercase tracking-wider text-slate-400">Estação & Mês Vigente</span>
                            ${isCurrentMonth ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">MÊS ATUAL</span>' : ''}
                        </div>
                        <div class="flex items-center gap-2.5 mt-2">
                            <span class="text-xl sm:text-2xl font-bold text-slate-100">${cal.name}</span>
                            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cal.seasonBadgeCls}">${cal.season}</span>
                        </div>
                        <p class="text-xs text-slate-300 mt-2 italic">${cal.climateNotice}</p>
                    </div>

                    <div class="mt-3 pt-3 border-t border-slate-800">
                        <span class="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">Espécies em Foco:</span>
                        <div class="flex flex-wrap gap-1">
                            ${cal.speciesInFocus.map((sp) => `<span class="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 font-medium">${sp}</span>`).join('')}
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-8 bg-[#090d16] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                    <div>
                        <span class="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold block mb-2">
                            Diretrizes Fitotécnicas Prioritárias de ${cal.name}:
                        </span>
                        <ul class="space-y-1.5 text-xs text-slate-300">
                            ${cal.priorities.map((item) => `
                                <li class="flex items-start gap-2">
                                    <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5"></i>
                                    <span>${item}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>

                    <div class="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span class="text-slate-400">
                            Exemplares no seu acervo deste grupo: <strong class="text-cyan-300">${focusPlantsInCollection.length} planta(s)</strong>
                        </span>
                        ${focusPlantsInCollection.length > 0 ? `
                            <button type="button" id="btn-filter-seasonal-focus" class="text-cyan-400 hover:text-cyan-300 font-medium underline flex items-center gap-1">
                                <span>Filtrar exemplares na lista</span>
                                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        const filterBtn = document.getElementById('btn-filter-seasonal-focus');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => {
                filters.search = cal.speciesInFocus[0] || '';
                document.getElementById('bonsai-search').value = filters.search;
                renderPlantList();
            });
        }

        C.refreshIcons(container);
    }

    function renderPlantList() {
        const container = document.getElementById('bonsai-list-container');
        if (!container) return;
        const C = global.VaultCore;

        const filtered = getFilteredPlants();

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-8 text-center text-slate-400">
                    <i data-lucide="sprout" class="w-10 h-10 mx-auto text-slate-600 mb-2"></i>
                    <p class="text-sm font-medium">Nenhum exemplar corresponde aos filtros selecionados.</p>
                    <p class="text-xs text-slate-500 mt-1">Altere a busca ou redefina o chip de status para exibir plantas.</p>
                </div>
            `;
            C.refreshIcons(container);
            return;
        }

        container.innerHTML = filtered.map(({ plant: p, m }) => {
            const checked = selectedIds.has(p.id);
            const borderHighlight = m.isAnyOverdue
                ? 'border-rose-500/40 bg-rose-950/10'
                : (m.wiringDiff !== null && m.wiringDiff <= 7 ? 'border-cyan-500/40 bg-cyan-950/10' : 'border-[#1e293b] bg-[#0f172a]');

            return `
                <div class="border ${borderHighlight} rounded-xl p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3 transition">
                    <!-- Checkbox + Identificação da Planta -->
                    <div class="flex items-start gap-3 min-w-0 flex-1">
                        <label class="pt-1 flex items-center">
                            <input type="checkbox" data-plant-check="${C.esc(p.id)}" ${checked ? 'checked' : ''}
                                class="w-5 h-5 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500 cursor-pointer">
                        </label>
                        <div class="min-w-0 flex-1">
                            <div class="flex flex-wrap items-center gap-1.5">
                                <span class="font-mono text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded">${C.esc(p.id)}</span>
                                <span class="px-2 py-0.5 rounded text-[11px] font-medium border ${stageColorClass(p.stage)}">${C.esc(p.stage)}</span>
                                <span class="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">${C.esc(p.bench)}</span>
                            </div>
                            <div class="font-semibold text-sm sm:text-base text-slate-100 truncate mt-1">${C.esc(p.popularName)}</div>
                            <div class="text-xs italic text-slate-400 truncate">${C.esc(p.scientificName || p.pot)} • Vaso: ${C.esc(p.pot)}</div>
                        </div>
                    </div>

                    <!-- Indicadores Fitotécnicos (Adubação / Transplante / Aramação) -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 text-xs">
                        <div class="bg-[#090d16]/80 border border-slate-800/90 rounded-lg p-2">
                            <div class="flex items-center justify-between gap-1">
                                <span class="text-[11px] text-slate-400">Adubação (${p.fertCycleDays}d)</span>
                                ${formatStatusBadge(m.fertDiff, '')}
                            </div>
                            <div class="font-mono text-[11px] text-slate-300 mt-1">Últ.: ${C.formatDateBR(p.lastFertilization)} → Próx.: ${C.formatDateBR(m.nextFertIso)}</div>
                        </div>

                        <div class="bg-[#090d16]/80 border border-slate-800/90 rounded-lg p-2">
                            <div class="flex items-center justify-between gap-1">
                                <span class="text-[11px] text-slate-400">Transplante (${p.repotCycleMonths}m)</span>
                                ${formatStatusBadge(m.repotDiff, '')}
                            </div>
                            <div class="font-mono text-[11px] text-slate-300 mt-1">Últ.: ${C.formatDateBR(p.lastRepot)} • ${C.esc(p.substrate.slice(0, 24))}${p.substrate.length > 24 ? '…' : ''}</div>
                        </div>

                        <div class="bg-[#090d16]/80 border border-slate-800/90 rounded-lg p-2">
                            <div class="flex items-center justify-between gap-1">
                                <span class="text-[11px] text-slate-400">Aramação / Manejo</span>
                                ${p.wiringDueDate ? formatStatusBadge(m.wiringDiff, 'Desarame') : (p.nextInterventionDate ? formatStatusBadge(m.customDiff, '') : '<span class="text-[11px] font-mono text-slate-500">Livre</span>')}
                            </div>
                            <div class="text-[11px] text-slate-300 truncate mt-1" title="${C.esc(p.nextInterventionType || p.notes)}">
                                ${C.esc(p.nextInterventionType || p.notes || 'Sem pendência específica')}
                            </div>
                        </div>
                    </div>

                    <!-- Botões Rápidos Individuais -->
                    <div class="flex items-center justify-end gap-1.5 shrink-0 pt-1 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                        <button type="button" data-quick-fert="${C.esc(p.id)}" title="Registrar Adubação Hoje (+${p.fertCycleDays}d)"
                            class="min-h-[42px] px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition">
                            <i data-lucide="sprout" class="w-3.5 h-3.5"></i>
                            <span>+${p.fertCycleDays}d</span>
                        </button>
                        <button type="button" data-edit-plant="${C.esc(p.id)}" title="Abrir Ficha Completa / Clonar / Histórico"
                            class="min-h-[42px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition">
                            <i data-lucide="sliders-horizontal" class="w-3.5 h-3.5 text-cyan-400"></i>
                            <span>Ficha</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Listeners
        container.querySelectorAll('[data-plant-check]').forEach((chk) => {
            chk.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-plant-check');
                if (e.target.checked) selectedIds.add(id);
                else selectedIds.delete(id);
                renderPlantList();
            });
        });

        container.querySelectorAll('[data-quick-fert]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-quick-fert');
                const target = plants.find((item) => item.id === id);
                if (!target) return;
                const today = C.todayISO();
                target.lastFertilization = today;
                target.logs.unshift({
                    date: today,
                    type: `Adubação (+${target.fertCycleDays}d)`,
                    detail: 'Adubação rápida individual registrada'
                });
                saveData(false);
                renderAll();
                C.toast(`${target.id} (${target.popularName}) adubada hoje (+${target.fertCycleDays}d).`, 'success', 2200);
            });
        });

        container.querySelectorAll('[data-edit-plant]').forEach((btn) => {
            btn.addEventListener('click', () => openModal(btn.getAttribute('data-edit-plant')));
        });

        updateBatchBar();
        C.refreshIcons(container);
    }

    function updateBatchBar() {
        const bar = document.getElementById('bonsai-batch-bar');
        const cnt = document.getElementById('bonsai-batch-count');
        if (!bar || !cnt) return;
        if (selectedIds.size > 0) {
            bar.classList.remove('hidden');
            cnt.textContent = `${selectedIds.size} selecionada${selectedIds.size > 1 ? 's' : ''}`;
        } else {
            bar.classList.add('hidden');
        }
    }

    // =========================================================================
    // 7. MODAL DE CADASTRO / EDIÇÃO / HISTÓRICO
    // =========================================================================
    function openModal(plantId) {
        const modal = document.getElementById('bonsai-modal');
        if (!modal) return;
        const C = global.VaultCore;
        editingId = plantId || null;
        const existing = editingId ? plants.find((p) => p.id === editingId) : null;

        document.getElementById('bonsai-modal-title').textContent = existing
            ? `Editar Exemplar ${existing.id} — ${existing.popularName}`
            : 'Cadastrar Nova Planta no Acervo';

        document.getElementById('bf-id').value = existing ? existing.id : generateNextId();
        document.getElementById('bf-popular').value = existing ? existing.popularName : '';
        document.getElementById('bf-scientific').value = existing ? existing.scientificName : '';
        document.getElementById('bf-bench').value = existing ? existing.bench : 'Sol Pleno A';
        document.getElementById('bf-stage').value = existing ? existing.stage : 'Pré-bonsai';
        document.getElementById('bf-pot').value = existing ? existing.pot : 'Treino';
        document.getElementById('bf-substrate').value = existing ? existing.substrate : SUBSTRATE_PRESETS[0];
        document.getElementById('bf-last-fert').value = existing ? existing.lastFertilization : C.todayISO();
        document.getElementById('bf-fert-cycle').value = String(existing ? existing.fertCycleDays : 30);
        document.getElementById('bf-last-repot').value = existing ? existing.lastRepot : C.todayISO();
        document.getElementById('bf-repot-cycle').value = String(existing ? existing.repotCycleMonths : 24);
        document.getElementById('bf-last-styling').value = existing ? existing.lastStyling : '';
        document.getElementById('bf-wiring-due').value = existing ? existing.wiringDueDate : '';
        document.getElementById('bf-next-date').value = existing ? existing.nextInterventionDate : '';
        document.getElementById('bf-next-type').value = existing ? existing.nextInterventionType : '';
        document.getElementById('bf-notes').value = existing ? existing.notes : '';

        const clonePanel = document.getElementById('bonsai-clone-panel');
        const histSection = document.getElementById('bonsai-history-section');
        const delBtn = document.getElementById('btn-bf-delete-single');

        if (existing) {
            clonePanel.classList.remove('hidden');
            histSection.classList.remove('hidden');
            delBtn.classList.remove('hidden');
            renderModalLogs(existing);
        } else {
            clonePanel.classList.add('hidden');
            histSection.classList.add('hidden');
            delBtn.classList.add('hidden');
        }

        modal.classList.remove('hidden');
        C.refreshIcons(modal);
    }

    function renderModalLogs(plant) {
        const listEl = document.getElementById('bf-logs-list');
        if (!listEl) return;
        const C = global.VaultCore;
        if (!plant.logs || plant.logs.length === 0) {
            listEl.innerHTML = `<p class="text-xs text-slate-500 italic">Nenhum manejo registrado ainda.</p>`;
            return;
        }
        listEl.innerHTML = plant.logs.map((lg) => `
            <div class="flex items-center justify-between gap-2 text-xs bg-[#090d16] border border-slate-800 rounded px-2.5 py-1.5">
                <div>
                    <span class="font-mono text-cyan-400">${C.formatDateBR(lg.date)}</span>
                    <span class="font-semibold text-slate-200 ml-1.5">${C.esc(lg.type)}</span>
                    <span class="text-slate-400 ml-1">— ${C.esc(lg.detail)}</span>
                </div>
            </div>
        `).join('');
    }

    function closeModal() {
        const modal = document.getElementById('bonsai-modal');
        if (modal) modal.classList.add('hidden');
        editingId = null;
    }

    // =========================================================================
    // 8. MODAL DO GUIA BOTÂNICO EXPANDIDO
    // =========================================================================
    function openGuideModal() {
        const modal = document.getElementById('bonsai-guide-modal');
        if (!modal) return;
        renderGuideSpeciesList('');
        modal.classList.remove('hidden');
        global.VaultCore.refreshIcons(modal);
    }

    function closeGuideModal() {
        const modal = document.getElementById('bonsai-guide-modal');
        if (modal) modal.classList.add('hidden');
    }

    function renderGuideSpeciesList(query) {
        const listEl = document.getElementById('guide-species-list');
        if (!listEl) return;
        const C = global.VaultCore;
        const q = String(query || '').trim().toLowerCase();

        const filtered = SPECIES_GUIDE_DB.filter((s) =>
            !q ||
            s.popular.toLowerCase().includes(q) ||
            s.scientific.toLowerCase().includes(q) ||
            s.family.toLowerCase().includes(q) ||
            s.origin.toLowerCase().includes(q)
        );

        if (filtered.length === 0) {
            listEl.innerHTML = `<p class="text-center text-slate-500 py-6 text-sm">Nenhuma espécie encontrada para "${C.esc(q)}".</p>`;
            return;
        }

        listEl.innerHTML = filtered.map((s) => `
            <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div>
                        <div class="flex items-center gap-2">
                            <h4 class="text-base font-bold text-slate-100">${C.esc(s.popular)}</h4>
                            <span class="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">${C.esc(s.family)}</span>
                        </div>
                        <p class="text-xs italic text-slate-400">${C.esc(s.scientific)} • ${C.esc(s.origin)}</p>
                    </div>
                    <button type="button" data-use-species="${C.esc(s.popular)}" class="min-h-[36px] px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition">
                        <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
                        <span>Cadastrar com estes parâmetros</span>
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                    <div class="bg-[#090d16] border border-slate-800 rounded-lg p-2.5">
                        <span class="text-[11px] font-mono uppercase tracking-wider text-amber-300 block mb-1">Sol & Rega:</span>
                        <p class="text-slate-300"><strong class="text-slate-200">Sol:</strong> ${C.esc(s.sun)}</p>
                        <p class="text-slate-300 mt-1"><strong class="text-slate-200">Rega:</strong> ${C.esc(s.water)}</p>
                    </div>

                    <div class="bg-[#090d16] border border-slate-800 rounded-lg p-2.5">
                        <span class="text-[11px] font-mono uppercase tracking-wider text-cyan-300 block mb-1">Transplante & Solo:</span>
                        <p class="text-slate-300"><strong class="text-slate-200">Época:</strong> ${C.esc(s.repotSeason)}</p>
                        <p class="text-slate-300 mt-1"><strong class="text-slate-200">Substrato:</strong> ${C.esc(s.substrate)}</p>
                    </div>

                    <div class="bg-[#090d16] border border-slate-800 rounded-lg p-2.5">
                        <span class="text-[11px] font-mono uppercase tracking-wider text-emerald-300 block mb-1">Podas & Nutrição:</span>
                        <p class="text-slate-300">${C.esc(s.pruningGuide)}</p>
                    </div>
                </div>

                <div class="bg-[#090d16]/70 border border-slate-800/80 rounded-lg p-2.5 text-xs space-y-1">
                    <p class="text-slate-300"><strong class="text-cyan-300">Aramação:</strong> ${C.esc(s.wiringGuide)}</p>
                    <p class="text-slate-300"><strong class="text-rose-300">Sensibilidades:</strong> ${C.esc(s.sensitivities)}</p>
                </div>
            </div>
        `).join('');

        listEl.querySelectorAll('[data-use-species]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const spName = btn.getAttribute('data-use-species');
                const found = SPECIES_GUIDE_DB.find((s) => s.popular === spName);
                if (!found) return;
                closeGuideModal();
                openModal(null);
                document.getElementById('bf-popular').value = found.popular;
                document.getElementById('bf-scientific').value = found.scientific;
                document.getElementById('bf-substrate').value = found.substrate;
                document.getElementById('bf-repot-cycle').value = String(found.repotCycleMonths || 24);
                document.getElementById('bf-notes').value = `Parâmetros do Guia Botânico: ${found.pruningGuide} Aramação: ${found.wiringGuide}`;
            });
        });

        C.refreshIcons(listEl);
    }

    // =========================================================================
    // 9. LISTENERS & INICIALIZAÇÃO
    // =========================================================================
    function bindEvents() {
        const C = global.VaultCore;

        document.getElementById('btn-bonsai-new').addEventListener('click', () => openModal(null));
        document.getElementById('btn-bonsai-guide').addEventListener('click', openGuideModal);
        document.getElementById('btn-guide-modal-close').addEventListener('click', closeGuideModal);
        document.getElementById('btn-bonsai-export-csv').addEventListener('click', exportBonsaiCSV);

        const guideSearch = document.getElementById('guide-search-input');
        if (guideSearch) {
            guideSearch.addEventListener('input', (e) => {
                renderGuideSpeciesList(e.target.value);
            });
        }

        const seasonSelect = document.getElementById('seasonal-month-select');
        if (seasonSelect) {
            seasonSelect.addEventListener('change', (e) => {
                selectedCalendarMonth = parseInt(e.target.value, 10);
                renderSeasonalPanel();
            });
        }

        document.getElementById('bonsai-search').addEventListener('input', (e) => {
            filters.search = e.target.value;
            renderPlantList();
        });

        document.getElementById('bonsai-filter-species').addEventListener('change', (e) => {
            filters.species = e.target.value;
            renderPlantList();
        });

        document.getElementById('bonsai-filter-bench').addEventListener('change', (e) => {
            filters.bench = e.target.value;
            renderPlantList();
        });

        document.getElementById('bonsai-filter-stage').addEventListener('change', (e) => {
            filters.stage = e.target.value;
            renderPlantList();
        });

        document.getElementById('bonsai-sort-by').addEventListener('change', (e) => {
            filters.sortBy = e.target.value;
            renderPlantList();
        });

        document.querySelectorAll('[data-bonsai-status-chip]').forEach((chip) => {
            chip.addEventListener('click', () => {
                filters.statusMode = chip.getAttribute('data-bonsai-status-chip');
                renderAll();
            });
        });

        document.getElementById('btn-bonsai-select-visible').addEventListener('click', () => {
            const visible = getFilteredPlants();
            visible.forEach(({ plant }) => selectedIds.add(plant.id));
            renderPlantList();
            C.toast(`${visible.length} planta(s) visível(is) selecionada(s).`, 'info', 2000);
        });

        document.getElementById('btn-bonsai-clear-sel').addEventListener('click', () => {
            selectedIds.clear();
            renderPlantList();
        });

        // Ações em lote
        document.getElementById('btn-batch-fert-30').addEventListener('click', () => applyBatchFertilization(30));
        document.getElementById('btn-batch-fert-45').addEventListener('click', () => applyBatchFertilization(45));
        document.getElementById('btn-batch-repot').addEventListener('click', applyBatchRepot);
        document.getElementById('btn-batch-delete').addEventListener('click', deleteSelectedBatch);

        const schedBox = document.getElementById('bonsai-batch-schedule-box');
        document.getElementById('btn-batch-schedule-toggle').addEventListener('click', () => {
            schedBox.classList.toggle('hidden');
            const dtIn = document.getElementById('batch-sched-date');
            if (!dtIn.value) dtIn.value = C.addDaysISO(C.todayISO(), 7);
        });

        document.getElementById('btn-batch-sched-apply').addEventListener('click', () => {
            const dt = document.getElementById('batch-sched-date').value;
            const tp = document.getElementById('batch-sched-type').value.trim();
            applyBatchSchedule(dt, tp);
            schedBox.classList.add('hidden');
        });

        // Modal
        document.getElementById('btn-bonsai-modal-close').addEventListener('click', closeModal);
        document.getElementById('btn-bf-cancel').addEventListener('click', closeModal);

        document.getElementById('bf-popular').addEventListener('input', (e) => {
            const val = e.target.value.trim().toLowerCase();
            const found = SPECIES_GUIDE_DB.find((s) => s.popular.toLowerCase() === val);
            const sciInput = document.getElementById('bf-scientific');
            const subInput = document.getElementById('bf-substrate');
            if (found) {
                if (!sciInput.value.trim()) sciInput.value = found.scientific;
                if (!subInput.value.trim()) subInput.value = found.substrate;
            }
        });

        document.querySelectorAll('[data-sub-preset]').forEach((btn) => {
            btn.addEventListener('click', () => {
                document.getElementById('bf-substrate').value = btn.getAttribute('data-sub-preset');
            });
        });

        document.getElementById('btn-bf-add-log').addEventListener('click', () => {
            if (!editingId) return;
            const target = plants.find((p) => p.id === editingId);
            const cat = document.getElementById('bf-quick-log-category').value;
            const inp = document.getElementById('bf-quick-log-input');
            if (!target || !inp.value.trim()) return;
            target.logs.unshift({
                date: C.todayISO(),
                type: cat,
                detail: inp.value.trim()
            });
            inp.value = '';
            saveData(false);
            renderModalLogs(target);
        });

        document.getElementById('btn-bf-clone-exec').addEventListener('click', () => {
            if (!editingId) return;
            const src = plants.find((p) => p.id === editingId);
            const qty = document.getElementById('bf-clone-qty').value;
            if (!src) return;
            closeModal();
            clonePlantBatch(src, qty);
        });

        document.getElementById('btn-bf-delete-single').addEventListener('click', () => {
            if (!editingId) return;
            if (!window.confirm(`Excluir o exemplar ${editingId}?`)) return;
            plants = plants.filter((p) => p.id !== editingId);
            selectedIds.delete(editingId);
            saveData(false);
            closeModal();
            renderAll();
            C.toast('Exemplar excluído.', 'warning');
        });

        document.getElementById('bonsai-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const newId = document.getElementById('bf-id').value.trim();
            const conflict = plants.find((p) => p.id.toLowerCase() === newId.toLowerCase() && p.id !== editingId);
            if (conflict) {
                C.toast(`Já existe uma planta com o código ${newId}.`, 'error');
                return;
            }

            const existing = editingId ? plants.find((p) => p.id === editingId) : null;
            const record = normalizePlant({
                id: newId,
                popularName: document.getElementById('bf-popular').value,
                scientificName: document.getElementById('bf-scientific').value,
                bench: document.getElementById('bf-bench').value,
                stage: document.getElementById('bf-stage').value,
                pot: document.getElementById('bf-pot').value,
                substrate: document.getElementById('bf-substrate').value,
                lastFertilization: document.getElementById('bf-last-fert').value,
                fertCycleDays: Number(document.getElementById('bf-fert-cycle').value),
                lastRepot: document.getElementById('bf-last-repot').value,
                repotCycleMonths: Number(document.getElementById('bf-repot-cycle').value),
                lastStyling: document.getElementById('bf-last-styling').value,
                wiringDueDate: document.getElementById('bf-wiring-due').value,
                nextInterventionDate: document.getElementById('bf-next-date').value,
                nextInterventionType: document.getElementById('bf-next-type').value,
                notes: document.getElementById('bf-notes').value,
                logs: existing ? existing.logs : [{ date: C.todayISO(), type: 'Cadastro Inicial', detail: 'Exemplar incluído no acervo' }]
            }, plants.length);

            if (existing) {
                const idx = plants.findIndex((p) => p.id === editingId);
                plants[idx] = record;
            } else {
                plants.unshift(record);
            }

            saveData(true);
            closeModal();
            renderAll();
        });
    }

    function syncFilterSelects() {
        const spSel = document.getElementById('bonsai-filter-species');
        const bnSel = document.getElementById('bonsai-filter-bench');
        const C = global.VaultCore;

        if (spSel) {
            const speciesSet = Array.from(new Set(plants.map((p) => p.popularName))).sort((a, b) => a.localeCompare(b, 'pt-BR'));
            if (filters.species !== 'ALL' && !speciesSet.includes(filters.species)) filters.species = 'ALL';
            spSel.innerHTML = `<option value="ALL">Todas as Espécies (${speciesSet.length})</option>` +
                speciesSet.map((s) => `<option value="${C.esc(s)}" ${filters.species === s ? 'selected' : ''}>${C.esc(s)}</option>`).join('');
        }

        if (bnSel) {
            const benchSet = Array.from(new Set(plants.map((p) => p.bench))).sort((a, b) => a.localeCompare(b, 'pt-BR'));
            if (filters.bench !== 'ALL' && !benchSet.includes(filters.bench)) filters.bench = 'ALL';
            bnSel.innerHTML = `<option value="ALL">Todas Bancadas (${benchSet.length})</option>` +
                benchSet.map((b) => `<option value="${C.esc(b)}" ${filters.bench === b ? 'selected' : ''}>${C.esc(b)}</option>`).join('');
        }
    }

    function renderAll() {
        renderKPIs();
        renderSeasonalPanel();
        syncFilterSelects();
        renderPlantList();
        global.VaultCore.refreshIcons();
    }

    function init() {
        mountShell();
        loadData();
        renderAll();

        window.addEventListener('vault:restored', () => {
            loadData();
            renderAll();
        });
    }

    global.VaultTabBonsai = { init, renderAll };
})(window);
