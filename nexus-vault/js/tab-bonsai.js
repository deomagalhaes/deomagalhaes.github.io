/**
 * NEXUS VAULT — Aba 2: Gestão Fitotécnica de Bonsai (Capacidade: +100 Plantas)
 * Guia Botânico Expandido (40 Espécies), Calendário Sazonal Dinâmico (Hemisfério Sul),
 * Histórico Detalhado de Manejos, Controle de Aramação/Desarame e Manejo em Lote One-Handed
 */
(function (global) {
    'use strict';

    // =========================================================================
    // 1. GUIA BOTÂNICO EXPANDIDO FITOTÉCNICO (40 ESPÉCIES CONSAGRADAS)
    // =========================================================================
    const SPECIES_GUIDE_DB = [
        // --- 1. Espécies Solicitadas do Acervo Pessoal ---
        {
            popular: 'Acerola',
            scientific: 'Malpighia emarginata',
            family: 'Malpighiaceae',
            origin: 'América Central e Norte da América do Sul',
            sun: 'Sol Pleno rigoroso (mínimo 6h diárias para florescer e frutificar com vigor)',
            water: 'Moderada a Alta no período de crescimento ativo; suporta secas moderadas, mas derruba frutos se faltar água na florada',
            repotSeason: 'Out a Jan (Calor estabelecido e início das chuvas de verão)',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Casca de Pinus / 10% Carvão moído',
            pruningGuide: 'Ramificação muito rápida e vigorosa. Podar após a frutificação deixando 2 pares de folhas. Pinçar ápices com frequência para conter ramos ladrões verticais.',
            wiringGuide: 'Ramos semi-lenhosos verdes dobram bem; ramos maduros endurecem rápido e quebram sob torção excessiva. Aramar brotações do ano.',
            fertGuide: 'Adubação rica em Fósforo e Potássio (farinha de osso ou NPK 04-14-08) na primavera/verão para induzir floradas e frutificações sucessivas.',
            sensitivities: 'Muito sensível a frio intenso e geadas abaixo de 10°C; atentar para mosca-das-frutas e pulgões nas gemas apicais.'
        },
        {
            popular: 'Amora (Amoreira-preta)',
            scientific: 'Morus nigra',
            family: 'Moraceae',
            origin: 'Ásia / Aclimatada em todo o território brasileiro',
            sun: 'Sol Pleno constante',
            water: 'Alta (consumo hídrico expressivo durante o verão em plena folhagem)',
            repotSeason: 'Jul a Ago (Inverno, em repouso vegetativo antes do despertar das gemas)',
            repotCycleMonths: 18,
            substrate: '60% Caqueira / 30% Casca de Pinus / 10% Pedrisco',
            pruningGuide: 'Vigor incomparável. Desfolha total no meio do verão reduz as folhas a 20% do tamanho original e multiplica a ramificação terciária. Poda estrutural no inverno.',
            wiringGuide: 'Madeira mole e suculenta na brotação que engrossa em semanas. Vigiar arames a cada 20–30 dias no calor para não morder o córtex.',
            fertGuide: 'Adubação pesada com matéria orgânica (Bokashi) e biofertilizante de Setembro a Abril.',
            sensitivities: 'Cochonilhas nas axilas foliares e formigas cortadeiras atraídas pela brotação doce.'
        },
        {
            popular: 'Buxinho',
            scientific: 'Buxus sempervirens',
            family: 'Buxaceae',
            origin: 'Europa e Bacia do Mediterrâneo',
            sun: 'Sol Pleno a Meia-Sombra ventilada',
            water: 'Moderada (drenagem perfeita; raízes finas não toleram encharcamento)',
            repotSeason: 'Ago a Out (Fim do inverno / início da primavera)',
            repotCycleMonths: 36,
            substrate: '60% Caqueira / 25% Casca Pinus / 15% Pedrisco',
            pruningGuide: 'Crescimento lento e extremamente controlado. Poda com tesoura fina esculpindo patamares densos e compactos. Excelente resposta ao método "clip and grow".',
            wiringGuide: 'Madeira extremamente densa, dura e fibrosa. Ramos grossos dificilmente vergam sem tensores ou ráfia protetora.',
            fertGuide: 'Adubação orgânica equilibrada em pellets sólidos a cada 45 dias na primavera/verão.',
            sensitivities: 'Ácaros em clima seco e fungo Cylindrocladium em condições de excesso de umidade no colo.'
        },
        {
            popular: 'Caliandra-rosa (Esponjinha)',
            scientific: 'Calliandra brevipes',
            family: 'Fabaceae',
            origin: 'Nativa Brasileira (Mata Atlântica e Sudeste)',
            sun: 'Sol Pleno (indispensável para floração plumosa abundante)',
            water: 'Moderada a Alta (drenagem rápida e eficiente)',
            repotSeason: 'Set a Nov (Início da primavera)',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Casca Pinus / 10% Pedrisco',
            pruningGuide: 'Crescimento vigoroso. Podar ápices logo após o término de cada florada para manter a copa compacta e forçar novas gemas laterais.',
            wiringGuide: 'Madeira extremamente frágil e quebradiça que estala sem aviso. Prefira conduzir por poda de direcionamento e tensores de ancoragem.',
            fertGuide: 'NPK rico em Fósforo (P) no final do inverno para maximizar a quantidade de botões florais esponjosos.',
            sensitivities: 'Cochonilhas de carapaça em ramos internos sem insolação e folhas danificadas por geada.'
        },
        {
            popular: 'Caliandra-vermelha',
            scientific: 'Calliandra tweedii',
            family: 'Fabaceae',
            origin: 'Nativa Brasileira (Sul e Sudeste)',
            sun: 'Sol Pleno',
            water: 'Moderada (tolerante a estiagens curtas; nunca manter encharcada)',
            repotSeason: 'Out a Dez',
            repotCycleMonths: 24,
            substrate: '70% Caqueira / 20% Casca Pinus / 10% Carvão moído',
            pruningGuide: 'Pinçar novas brotações deixando 2 a 3 pares de folíolos plumosos.',
            wiringGuide: 'Aramar com muito cuidado apenas ramos semi-lenhosos flexíveis. Proteger o tronco com ráfia se for aplicar tensores.',
            fertGuide: 'Adubação orgânica mensal na primavera; suspender no auge do inverno.',
            sensitivities: 'Sensível a ventos frios encanados de inverno e sombreamento prolongado.'
        },
        {
            popular: 'Duranta (Pingo-de-ouro / Violeteira)',
            scientific: 'Duranta erecta',
            family: 'Verbenaceae',
            origin: 'América Tropical (Nativa do Brasil e América do Sul)',
            sun: 'Sol Pleno intenso (essencial para folhas com tom dourado vivo e floradas roxas)',
            water: 'Alta (consome muita água no calor devido à transpiração e vigor vegetativo acelerado)',
            repotSeason: 'Set a Dez',
            repotCycleMonths: 18,
            substrate: '60% Caqueira / 30% Casca Pinus / 10% Pedrisco',
            pruningGuide: 'Crescimento explosivo. Podar brotos a cada 15-20 dias na primavera para induzir ramificação fina e densa. Tolera podas drásticas no tronco com rebrote espetacular.',
            wiringGuide: 'Ramos jovens são flexíveis, mas engrossam muito rápido. Desaramar em 30–45 dias no verão para não deixar marcas permanentes.',
            fertGuide: 'Adubação rica em Nitrogênio e matéria orgânica na fase de formação; balanceada com fósforo para induzir floradas e frutinhos dourados.',
            sensitivities: 'Lagartas desfolhadoras nas brotações tenras e nematóides se cultivada em solo argiloso pesado.'
        },
        {
            popular: 'Érica-falsa / Cufea (Flor rosa da foto)',
            scientific: 'Cuphea gracilis / Cuphea hyssopifolia',
            family: 'Lythraceae',
            origin: 'Brasil e América Tropical',
            sun: 'Sol Pleno a Meia-Sombra luminosa (o sol direto garante floração rosa contínua o ano todo)',
            water: 'Moderada a Alta (aprecia solo sempre fresco e levemente úmido, sem empoçamento)',
            repotSeason: 'Out a Jan',
            repotCycleMonths: 18,
            substrate: '60% Caqueira fina / 30% Casca Pinus fina / 10% Areia grossa',
            pruningGuide: 'Pinçagem frequente dos ponteiros florais com tesoura fina para compactar a copa em pequenas almofadas verdes e floridas. Excelente para mame, shohin e estilo vassoura.',
            wiringGuide: 'Ramos muito finos e lenhosos. Conduzir prioritariamente por poda ou usar arames ultrafinos (0.8 a 1.2 mm) sem apertar os nós.',
            fertGuide: 'Adubação orgânica líquida a cada 15 dias de Setembro a Março; pausar no inverno.',
            sensitivities: 'Desidratação rápida do torrão em vasos rasos sob calor forte; proteger raízes no pico da tarde.'
        },
        {
            popular: 'Figueira-benjamim (Fícus)',
            scientific: 'Ficus benjamina',
            family: 'Moraceae',
            origin: 'Ásia Tropical e Austrália (Clássica aclimatada no Brasil)',
            sun: 'Sol Pleno a Meia-Sombra bem iluminada',
            water: 'Moderada a Alta (vigor excepcional e grande plasticidade radicular)',
            repotSeason: 'Nov a Fev (Meses mais quentes do ano, quando emite raízes aéreas com vigor)',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Casca Pinus / 10% Carvão moído',
            pruningGuide: 'Tolera qualquer intensidade de poda, rebrotando até de madeira antiga sem folhas. Desfolha total de verão reduz o limbo foliar a menos da metade.',
            wiringGuide: 'Flexibilidade excepcional. Cicatriza rápido cortes quando protegidos com pasta selante. Cuidar para não deixar arame estrangular ramos em crescimento.',
            fertGuide: 'Adubação generosa rica em matéria orgânica e nitrogênio durante todo o período quente.',
            sensitivities: 'Derruba folhas pontualmente se movido de ambiente bruscamente; tripes em brotos tenros.'
        },
        {
            popular: 'Fruta-dos-milagres',
            scientific: 'Synsepalum dulcificum',
            family: 'Sapotaceae',
            origin: 'África Ocidental Tropical',
            sun: 'Meia-Sombra a Sol da manhã suave (folhagem sofre com sol abrasador das 12h às 15h)',
            water: 'Alta e constante (o torrão nunca deve secar 100%; manter umidade ambiental alta)',
            repotSeason: 'Nov a Jan (Exige calor consolidado acima de 22°C para emissão radicular)',
            repotCycleMonths: 30,
            substrate: '60% Caqueira ácida lavada / 30% Turfa de Sphagnum / 10% Púmice (pH ácido obrigatório: 4.5 a 5.5)',
            pruningGuide: 'Crescimento lento e comedido. Poda suave de pontas mantendo ramos de base para espessamento de tronco. Não fazer desfolha drástica.',
            wiringGuide: 'Ramos lentos para fixar novas posições. Manter arame de alumínio por 6 a 8 meses monitorando a casca.',
            fertGuide: 'Adubos orgânicos especiais para plantas acidófilas (torta de mamona/algodão e quelato de ferro). Nunca usar água dura calcária ou calcário.',
            sensitivities: 'Clorose férrica imediata em solos alcalinos (folhas amarelam entre as nervuras); intolerante ao frio abaixo de 12°C.'
        },
        {
            popular: 'Ixora (Mini-ixora)',
            scientific: 'Ixora coccinea compacta',
            family: 'Rubiaceae',
            origin: 'Ásia Tropical / Índia',
            sun: 'Sol Pleno (indispensável para buquês florais densos e compactos)',
            water: 'Moderada a Alta (substrato fresco, permeável e bem drenado)',
            repotSeason: 'Out a Dez',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Casca Pinus / 10% Carvão moído',
            pruningGuide: 'Podar após a floração, cortando logo acima do último nó com folhas maduras para estimular brotações duplas bifurcadas.',
            wiringGuide: 'Ramos rígidos e fibrosos. Modelar com arame quando ainda semi-verdes; cuidado com quebras nas axilas.',
            fertGuide: 'Fósforo abundante na primavera/verão associado a micronutrientes (ferro e magnésio).',
            sensitivities: 'Sensível a ventos frios de inverno e geadas; clorose se o solo for excessivamente alcalino.'
        },
        {
            popular: 'Jabuticaba (Sabará / Híbrida)',
            scientific: 'Plinia cauliflora / Plinia jaboticaba',
            family: 'Myrtaceae',
            origin: 'Nativa Brasileira (Mata Atlântica)',
            sun: 'Sol Pleno a Meia-Sombra luminosa',
            water: 'Muito Alta (espécie de beira de rio; o substrato deve estar sempre fresco e úmido, sem estagnar)',
            repotSeason: 'Nov a Jan (Pico do calor e início das chuvas; transplantar no frio é de altíssimo risco)',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Casca de Pinus compostada / 10% Carvão vegetal moído',
            pruningGuide: 'Pinçar ápices apicais continuamente para reverter a força da seiva para o tronco e ramos primários, estimulando floração caulinar e frutificação. Poda drástica somente no verão.',
            wiringGuide: 'Galhos lenhosos muito duros e quebradiços. Aramar brotos semi-lenhosos novos; proteger a casca lisa com ráfia para não marcar.',
            fertGuide: 'Adubação orgânica abundante (Bokashi, farinha de ossos e torta de mamona) na primavera/verão.',
            sensitivities: 'Extremamente sensível à falta pontual de água (desidratação causa queima de folhas em 24h); ferrugem da jabuticaba em épocas de muita chuva e pouco vento.'
        },
        {
            popular: 'Junípero Jacaré',
            scientific: 'Juniperus horizontalis / Juniperus squamata',
            family: 'Cupressaceae',
            origin: 'América do Norte e Ásia',
            sun: 'Sol Pleno rigoroso (mínimo de 5h a 6h de sol direto diariamente)',
            water: 'Moderada (deixar a superfície do substrato secar ligeiramente antes de regar novamente)',
            repotSeason: 'Ago a Out (Fim de inverno / início da primavera no Hemisfério Sul)',
            repotCycleMonths: 36,
            substrate: '50% Caqueira / 30% Púmice / 20% Pedrisco (drenagem extrema sem terra vegetal comum)',
            pruningGuide: 'Nunca usar tesoura na massa verde escamiforme (as pontas cortadas oxidam e ficam marrons). Pinçar com a ponta dos dedos torcendo suavemente.',
            wiringGuide: 'Excelente maleabilidade e rusticidade para estilos cascata (Kengai), semi-cascata e Bunjin. Permite torções dramáticas se protegido com ráfia.',
            fertGuide: 'Adubação orgânica sólida em sachês (Biogold ou Bokashi) de Setembro a Maio; pausar no inverno.',
            sensitivities: 'Ácaros vermelhos em períodos quentes e secos; apodrecimento radicular se o solo reter água em excesso.'
        },
        {
            popular: 'Limão-cravo (Limão-rosa)',
            scientific: 'Citrus × limonia',
            family: 'Rutaceae',
            origin: 'Híbrido Cítrico da Ásia / Muito rústico no Brasil',
            sun: 'Sol Pleno pleno e direto',
            water: 'Moderada a Alta durante o crescimento dos frutos; controlar água no outono para induzir floração',
            repotSeason: 'Set a Nov',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Casca Pinus / 10% Pedrisco ou Areia Grossa',
            pruningGuide: 'Poda de limpeza de ramos internos que cruzam a copa. Eliminar espinhos desnecessários com alicate côncavo para facilitar a modelagem e o manuseio.',
            wiringGuide: 'Ramos verdes são flexíveis e fáceis de conduzir; proteger a casca e retirar arame antes que morda o câmbio vascular.',
            fertGuide: 'Adubação rica em micronutrientes (Zinco, Manganês, Boro, Ferro) e matéria orgânica com torta de mamona.',
            sensitivities: 'Minador-dos-citros (larva que desenha labirintos prateados nas folhas jovens) e pulgões escuros.'
        },
        {
            popular: 'Mexerica Ponkan',
            scientific: 'Citrus reticulata',
            family: 'Rutaceae',
            origin: 'Ásia / Muito cultivada no Sudeste e Sul do Brasil',
            sun: 'Sol Pleno constante',
            water: 'Moderada (drenagem perfeita)',
            repotSeason: 'Set a Nov',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Casca Pinus / 10% Carvão moído',
            pruningGuide: 'Poda logo após a colheita dos frutos. Desbastar o excesso de frutinhos em bonsai para não exaurir a árvore (manter no máximo 2 a 3 frutos por planta).',
            wiringGuide: 'Aramar ramos semi-lenhosos de 1 a 2 anos com alumínio na primavera.',
            fertGuide: 'NPK 04-14-08 na pré-floração associado a Bokashi trimestral.',
            sensitivities: 'Minador-dos-citros e cochonilhas brancas nas axilas dos galhos.'
        },
        {
            popular: 'Pau-ferro (Jucá)',
            scientific: 'Libidibia ferrea',
            family: 'Fabaceae',
            origin: 'Nativa Brasileira (Mata Atlântica e Caatinga)',
            sun: 'Sol Pleno rigoroso',
            water: 'Moderada (alta tolerância à estiagem; drenagem rápida)',
            repotSeason: 'Out a Jan (Exclusivamente com calor estabelecido)',
            repotCycleMonths: 24,
            substrate: '70% Caqueira / 20% Casca Pinus / 10% Carvão moído',
            pruningGuide: 'Casca marmorizada espetacular que descama em placas revelando tons brancos, verdes e cinzas. Pinçar folhas bipinadas para reduzir entrenós e tamanho dos folíolos.',
            wiringGuide: 'Madeira de densidade altíssima ("ferro") que endurece rápido. Aramar enquanto os ramos tiverem casca verde.',
            fertGuide: 'Adubação moderada; planta leguminosa com bactérias fixadoras de nitrogênio no solo.',
            sensitivities: 'Muito sensível a frio intenso e geadas (risco de morte dos ramos finos abaixo de 6°C).'
        },
        {
            popular: 'Pitanga',
            scientific: 'Eugenia uniflora',
            family: 'Myrtaceae',
            origin: 'Nativa Brasileira',
            sun: 'Sol Pleno (o sol direto colore a brotação nova em tons bronze e avermelhados exuberantes)',
            water: 'Alta e constante (gosta de solo úmido sem encharcamento estagnado)',
            repotSeason: 'Out a Jan',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Casca Pinus / 10% Pedrisco',
            pruningGuide: 'Excelente capacidade de redução e ramificação fina. Desfolha parcial no verão para reduzir folhas e estimular brotos internos.',
            wiringGuide: 'Casca lisa e avermelhada que esfolia naturalmente. Usar arame encapado ou fita para não machucar o tronco delicado.',
            fertGuide: 'Adubação balanceada na brotação; reforço de potássio no outono para engorda do nebari.',
            sensitivities: 'Pulgões em brotações tenras e manchas foliares se mantida em locais muito sombreados.'
        },
        {
            popular: 'Piteco / Tataré',
            scientific: 'Chloroleucon tortum',
            family: 'Fabaceae',
            origin: 'Nativa da Restinga Brasileira (Sudeste/Litoral)',
            sun: 'Sol Pleno absoluto',
            water: 'Baixa a Moderada (planta xerofítica de restinga; excelente resistência à seca relativa)',
            repotSeason: 'Nov a Fev (Apenas no pico do calor para recuperação radicular)',
            repotCycleMonths: 30,
            substrate: '70% Caqueira / 20% Areia grossa ou Pedrisco / 10% Casca Pinus',
            pruningGuide: 'Tronco canelado, retorcido e escultural único. Poda de manutenção nos ramos laterais para evidenciar o movimento do tronco.',
            wiringGuide: 'Galhos verdes dobram bem; galhos castanhos quebram facilmente. Podar espinhos antes de aramar.',
            fertGuide: 'Adubação orgânica suave com farinha de ossos na primavera/verão.',
            sensitivities: 'Intolerante ao frio intenso de inverno sem proteção e sensível a solos com drenagem deficiente.'
        },
        {
            popular: 'Piteco-cortiçoso (Jurema-branca)',
            scientific: 'Chloroleucon mangense / Pithecellobium tortum var. corticosum',
            family: 'Fabaceae',
            origin: 'Caatinga e Cerrado Brasileiro',
            sun: 'Sol Pleno abrasador',
            water: 'Baixa a Moderada (altíssima resistência à aridez)',
            repotSeason: 'Nov a Jan',
            repotCycleMonths: 36,
            substrate: '75% Caqueira / 15% Areia grossa de rio / 10% Carvão moído',
            pruningGuide: 'Casca profundamente corticosa, fendida e rugosa, que confere aspecto milenar imediato. Podar com tesoura afiada preservando as placas de cortiça intactas.',
            wiringGuide: 'Aramar apenas brotos finos. Jamais apoiar alicates pesados sobre a casca cortiçosa, pois ela quebra e perde o valor estético.',
            fertGuide: 'Adubação orgânica leve espaçada a cada 60 dias.',
            sensitivities: 'Raízes apodrecem rapidamente com excesso de água no inverno frio; detesta sombra e solo asfixiante.'
        },
        {
            popular: 'Primavera (Buganvília)',
            scientific: 'Bougainvillea spectabilis / Bougainvillea glabra',
            family: 'Nyctaginaceae',
            origin: 'Nativa Brasileira',
            sun: 'Sol Pleno inegociável (mínimo de 6h a 8h de sol direto para florescer intensamente)',
            water: 'Moderada a Baixa (estresse hídrico leve e controlado após maturação da brotação induz floração espetacular de brácteas)',
            repotSeason: 'Out a Fev (Somente no calor forte estabelecido)',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Casca Pinus / 10% Pedrisco',
            pruningGuide: 'Poda drástica após a perda das flores. Cortar ramos longos deixando 2 a 3 gemas. Eliminar brotos ladrões verticais.',
            wiringGuide: 'Madeira velha e rígida quebra como vidro. Modelar ramos novos enquanto ainda verdes e flexíveis.',
            fertGuide: 'Farta em Fósforo e Potássio na primavera; evitar excesso de nitrogênio (que produz só folhas e zero flores).',
            sensitivities: 'Raízes finas e quebradiças no transplante (nunca lavar com pressão nem desembaraçar com força excessiva).'
        },
        {
            popular: 'Rainha-do-abismo ("Seeninja")',
            scientific: 'Sinningia leucotricha',
            family: 'Gesneriaceae',
            origin: 'Nativa Brasileira (Endêmica dos penhascos rochosos do Paraná)',
            sun: 'Meia-Sombra bem iluminada / Sol suave da manhã (sol causticante do meio-dia queima a penugem prateada)',
            water: 'Baixa a Moderada (batata/cáudice suculento armazena água; regar o substrato sem molhar a folhagem aveludada)',
            repotSeason: 'Set a Nov (Início da primavera, quando o tubérculo desperta e emite novas hastes)',
            repotCycleMonths: 36,
            substrate: '50% Caqueira fina / 30% Púmice ou Perlita / 20% Turfa/Casca de pinus moída (drenagem perfeita)',
            pruningGuide: 'No outono/inverno as hastes aéreas secam naturalmente. Cortar rente ao tubérculo e suspender regas no período de dormência.',
            wiringGuide: 'Não se aplica aramação clássica de galhos. Condução por direcionamento de luz e exposição artística do tubérculo exposto sobre rocha (estilo Ishitsuki / Kusamono de grande porte).',
            fertGuide: 'Adubação líquida suave diluída a 1/4 da dose a cada 30 dias na primavera.',
            sensitivities: 'Apodrecimento do cáudice por excesso de umidade no inverno frio; fungos se a folhagem penugenta ficar molhada à noite.'
        },
        {
            popular: 'Rosa-do-deserto',
            scientific: 'Adenium obesum',
            family: 'Apocynaceae',
            origin: 'África Subsaariana e Península Arábica',
            sun: 'Sol Pleno direto o dia inteiro (indispensável para espessamento do cáudice e floração)',
            water: 'Baixa (regar abundantemente, mas deixar o substrato secar 100% entre as regas; no inverno reduzir a quase zero)',
            repotSeason: 'Out a Fev (Somente em temperaturas acima de 22°C)',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 25% Pedrisco ou Areia grossa / 15% Carvão moído (zero retenção de água acumulada)',
            pruningGuide: 'Poda de bifurcação e redução de hastes estioladas na primavera. Selar cortes com cola instantânea ou canela em pó para evitar podridão.',
            wiringGuide: 'Condução com arame macio em hastes jovens ou estilização por poda e elevação do cáudice radicular no transplante.',
            fertGuide: 'Adubo específico para cactos/suculentas ou NPK 04-14-08 na primavera.',
            sensitivities: 'Podridão bacteriana do cáudice (Erwinia) por umidade excessiva em solo frio; cochonilhas de raiz.'
        },
        {
            popular: 'Serissa variegata (Árvore-das-mil-estrelas)',
            scientific: 'Serissa japonica \'Variegata\' / Serissa foetida variegata',
            family: 'Rubiaceae',
            origin: 'Sudeste Asiático (China / Japão)',
            sun: 'Meia-Sombra bem iluminada ou Sol filtrado da manhã (evitar sol direto das 12h às 15h para não queimar as margens brancas/cremes das folhas)',
            water: 'Moderada e constante (o substrato nunca deve secar 100%, mas não tolera prato com água)',
            repotSeason: 'Set a Nov (Primavera amena)',
            repotCycleMonths: 24,
            substrate: '60% Caqueira / 30% Casca Pinus fina / 10% Carvão moído',
            pruningGuide: 'Pinçar brotos novos após as floradas estreladas para manter a compacidade da copa variegada.',
            wiringGuide: 'Ramos finos e flexíveis. Usar arame fino de alumínio (1.0 a 1.5 mm).',
            fertGuide: 'Adubação orgânica líquida a cada 15 dias na primavera; dosagem reduzida em relação às espécies verdes normais.',
            sensitivities: 'Derruba folhas se mudar repentinamente de local ou sofrer corrente de ar frio seco; ácaros em ambientes fechados.'
        },
        {
            popular: 'Tamarindo',
            scientific: 'Tamarindus indica',
            family: 'Fabaceae',
            origin: 'África Tropical / Muito adaptado ao Nordeste e Sudeste do Brasil',
            sun: 'Sol Pleno forte e direto',
            water: 'Baixa a Moderada (raízes profundas e resistentes; tolera pequenos períodos de seca)',
            repotSeason: 'Nov a Jan (Meses quentes com sol pleno)',
            repotCycleMonths: 36,
            substrate: '65% Caqueira / 25% Areia grossa / 10% Casca Pinus',
            pruningGuide: 'Folhas compostas pinadas que fecham ao anoitecer. Poda de redução após a primavera para manter a escala em bonsai.',
            wiringGuide: 'Casca enrugada e tronco que ganha textura rugosa formidável. Aramar galhos jovens de 1 ano; madeira velha é muito dura.',
            fertGuide: 'Orgânica com cinzas vegetais e farinha de ossos na primavera/verão.',
            sensitivities: 'Sensível a frio abaixo de 10°C; fungos foliares em excesso de umidade na sombra.'
        },

        // --- 2. Espécies Clássicas Complementares da Arte do Bonsai ---
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
                'Transplante seguro apenas de espécies tropicais plenas (Ficus, Jabuticaba, Piteco, Acerola).'
            ],
            speciesInFocus: ['Jabuticaba', 'Figueira-benjamim', 'Acerola', 'Piteco', 'Fruta-dos-milagres', 'Duranta']
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
                'Poda de contenção em mudas e exemplares de crescimento acelerado (Amora, Caliandras, Duranta).'
            ],
            speciesInFocus: ['Primavera', 'Caliandra-rosa', 'Caliandra-vermelha', 'Amora', 'Rosa-do-deserto']
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
                'Planejamento de aramações estruturais de outono para leguminosas e caducifólias.'
            ],
            speciesInFocus: ['Pau-ferro', 'Tamarindo', 'Piteco-cortiçoso', 'Mexerica Ponkan', 'Limão-cravo']
        },
        {
            monthIndex: 3,
            name: 'Abril',
            season: 'Outono',
            seasonIcon: 'leaf',
            seasonBadgeCls: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
            climateNotice: 'Dias amenos, noites frias e ar seco. Caducifólias começam a mudar de cor.',
            priorities: [
                'Aramação estrutural ideal: madeira madura, fluxo de seiva desacelerando.',
                'Aplicação preventiva de óleo de neem ou calda sulfocálcica muito diluída contra cochonilhas.',
                'Diminuir adubações nitrogenadas para não induzir brotações tenras que queimarão no frio.',
                'Limpeza de acículas velhas e folhas secas em juníperos e folhosas perenes.'
            ],
            speciesInFocus: ['Junípero Jacaré', 'Buxinho', 'Érica-falsa', 'Ixora', 'Serissa']
        },
        {
            monthIndex: 4,
            name: 'Maio',
            season: 'Outono',
            seasonIcon: 'leaf',
            seasonBadgeCls: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
            climateNotice: 'Seca e frio se estabelecem no Sudeste/Sul. Plantas entram em dormência.',
            priorities: [
                'Suspender fertilização de caducifólias e suculentas/caudiciformes que entram em dormência.',
                'Redução drástica de rega para Rainha-do-abismo e Rosa-do-deserto (risco de podridão de tubérculo).',
                'Trabalhos em madeira morta (Jin e Shari) em Juníperos com aplicação de calda sulfocálcica pura.',
                'Ajustar rega matinal (nunca regar à noite para não manter raízes geladas de madrugada).'
            ],
            speciesInFocus: ['Rainha-do-abismo', 'Rosa-do-deserto', 'Junípero Jacaré', 'Buxinho', 'Serissa variegata']
        },
        {
            monthIndex: 5,
            name: 'Junho',
            season: 'Inverno',
            seasonIcon: 'snowflake',
            seasonBadgeCls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
            climateNotice: 'Dias mais curtos do ano, geadas ocasionais e baixíssima umidade do ar.',
            priorities: [
                'Proteção contra geadas para tropicais delicadas (Figueiras jovens, Serissa, Ixora).',
                'Poda drástica estrutural em caducifólias totalmente desfolhadas (Amora, caducifólias clássicas).',
                'Selar todos os cortes acima de 3mm com pasta cicatrizante de alta aderência.',
                'Rega espaçada: apenas quando a superfície do substrato estiver visivelmente seca.'
            ],
            speciesInFocus: ['Amora', 'Figueira-benjamim', 'Buxinho', 'Junípero Jacaré', 'Pau-ferro']
        },
        {
            monthIndex: 6,
            name: 'Julho',
            season: 'Inverno',
            seasonIcon: 'snowflake',
            seasonBadgeCls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
            climateNotice: 'Pico do inverno. Período clássico de repouso vegetativo profundo.',
            priorities: [
                'Início da janela de transplante para caducifólias clássicas, Buxinho e coníferas (Junípero Jacaré).',
                'Poda de raízes grossas e ancoragem sólida no vaso com arames de fixação pelo fundo.',
                'Limpeza detalhada de cascas velhas e musgos que acumulam umidade excessiva no colar da raiz.',
                'Manter vasos recém-mexidos abrigados de ventos secos e frios.'
            ],
            speciesInFocus: ['Junípero Jacaré', 'Buxinho', 'Amora', 'Pau-ferro']
        },
        {
            monthIndex: 7,
            name: 'Agosto',
            season: 'Inverno',
            seasonIcon: 'snowflake',
            seasonBadgeCls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
            climateNotice: 'Fim de inverno, ar muito seco, gemas intumescendo anunciando brotação.',
            priorities: [
                'Janela máxima de transplante: transplantar antes que as gemas abram as primeiras folhas!',
                'Preparação de substratos (peneirar caqueira, pedrisco, cacos cerâmicos e casca de pinus).',
                'Atenção especial à hidratação em dias com umidade relativa do ar abaixo de 25%.',
                'Poda de formação em cítricos (Limão-cravo, Mexerica Ponkan) e arbustivas (Duranta).'
            ],
            speciesInFocus: ['Limão-cravo', 'Mexerica Ponkan', 'Duranta', 'Piteco-cortiçoso', 'Buxinho']
        },
        {
            monthIndex: 8,
            name: 'Setembro',
            season: 'Primavera',
            seasonIcon: 'sprout',
            seasonBadgeCls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
            climateNotice: 'Início oficial da primavera. Explosão de brotações novas e floradas.',
            priorities: [
                'Retomada gradual da adubação orgânica (Bokashi / Torta de Mamona) assim que abrir a brotação.',
                'Pinçagem de pontas com tesoura fina ou dedos para evitar alongamento de entrenós.',
                'Transplante de nativas com brotação precoce e floríferas (Caliandras, Primavera, Pitanga).',
                'Monitoramento intensivo de pulgões e lagartas nas folhas novas.'
            ],
            speciesInFocus: ['Caliandra-rosa', 'Caliandra-vermelha', 'Primavera', 'Pitanga', 'Érica-falsa']
        },
        {
            monthIndex: 9,
            name: 'Outubro',
            season: 'Primavera',
            seasonIcon: 'sprout',
            seasonBadgeCls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
            climateNotice: 'Calor em ascensão, chuvas de primavera começam a regularizar a umidade.',
            priorities: [
                'Adubação plena em ritmo quinzenal/mensal (Bokashi / Osmocote / Farinha de Ossos).',
                'Desfolha seletiva ou parcial em exemplares vigorosos (Acerola, Pitanga, Amora).',
                'Revisão periódica de arames aplicados no outono/inverno para não ferir o córtex.',
                'Transplante seguro de nativas e tropicais que exigem calor ativo de solo.'
            ],
            speciesInFocus: ['Pitanga', 'Acerola', 'Fruta-dos-milagres', 'Serissa variegata', 'Ixora']
        },
        {
            monthIndex: 10,
            name: 'Novembro',
            season: 'Primavera',
            seasonIcon: 'sprout',
            seasonBadgeCls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
            climateNotice: 'Calor constante, umidade elevada, crescimento vegetativo em velocidade máxima.',
            priorities: [
                'Transplante ideal da Jabuticaba (Sabará / Híbrida) no pico de calor e umidade.',
                'Despertar pleno da Rainha-do-abismo: regar ao redor do bulbo com luminosidade abundante.',
                'Atenção ao Piteco / Tataré: responder ao crescimento rápido com podas de ramificação frequentes.',
                'Regas diárias garantidas; inspecionar drenos para evitar apodrecimento radicular.'
            ],
            speciesInFocus: ['Jabuticaba', 'Piteco', 'Tamarindo', 'Rainha-do-abismo', 'Rosa-do-deserto']
        },
        {
            monthIndex: 11,
            name: 'Dezembro',
            season: 'Verão',
            seasonIcon: 'sun-medium',
            seasonBadgeCls: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
            climateNotice: 'Solstício de Verão: dias mais longos e sol quente das 11h às 15h.',
            priorities: [
                'Manter bancadas limpas e arejadas para evitar proliferação de ácaros e cochonilhas.',
                'Adubação de manutenção em sachês protegidos contra a lavagem de chuvas torrenciais.',
                'Revisão de tensores e amarração de copas em formação.',
                'Garantir rega contínua para frutíferas em fase de formação de frutos (Jabuticaba, Pitanga, Acerola).'
            ],
            speciesInFocus: ['Figueira-benjamim', 'Acerola', 'Jabuticaba', 'Duranta', 'Caliandra-rosa']
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
    let currentProcedureFilter = 'ALL';

    // =========================================================================
    // 2.1. MOTOR FITOTÉCNICO ASTROBOTÂNICO & PROCEDIMENTO IDEAL
    // =========================================================================
    function getMoonPhase(targetDate = new Date()) {
        const refNewMoon = new Date('2000-01-06T18:14:00Z').getTime();
        const synodicMonthMs = 29.53058867 * 86400000;
        const diff = targetDate.getTime() - refNewMoon;
        const cycles = diff / synodicMonthMs;
        const phaseFraction = cycles - Math.floor(cycles);
        const moonAge = phaseFraction * 29.53058867;
        const illumination = Math.round(((1 - Math.cos(2 * Math.PI * phaseFraction)) / 2) * 100);

        let phaseName = '';
        let phaseGroup = ''; // 'NOVA', 'CRESCENTE', 'CHEIA', 'MINGUANTE'
        let sapDynamic = '';
        let badgeCls = '';
        let phaseIcon = '';

        if (moonAge < 1.84 || moonAge >= 27.69) {
            phaseName = 'Lua Nova';
            phaseGroup = 'NOVA';
            phaseIcon = 'circle';
            sapDynamic = 'Seiva concentrada nas raízes e base do tronco. Mínima sangria vascular aérea; período seguro para podas estruturais drásticas, redução de troncos e escultura de madeira morta.';
            badgeCls = 'bg-slate-800 text-slate-300 border-slate-700';
        } else if (moonAge < 7.38) {
            phaseName = 'Lua Crescente (Côncava)';
            phaseGroup = 'CRESCENTE';
            phaseIcon = 'moon';
            sapDynamic = 'Fluxo ascendente ativo. Seiva subindo com pressão positiva em direção aos ramos, nutrindo tecidos jovens; excelente para estaquia e início de alporquias.';
            badgeCls = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
        } else if (moonAge < 9.22) {
            phaseName = 'Quarto Crescente';
            phaseGroup = 'CRESCENTE';
            phaseIcon = 'moon';
            sapDynamic = 'Pressão hidrostática vascular e atividade hormonal em rápida expansão aérea. Janela cirúrgica ideal para enxertia e alporquia acelerada.';
            badgeCls = 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40';
        } else if (moonAge < 14.77) {
            phaseName = 'Gibosa Crescente';
            phaseGroup = 'CRESCENTE';
            phaseIcon = 'moon';
            sapDynamic = 'Máximo acúmulo de auxinas e carboidratos nos ramos superiores e botões florais. Alto vigor regenerativo para propagação vegetativa.';
            badgeCls = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
        } else if (moonAge < 16.61) {
            phaseName = 'Lua Cheia';
            phaseGroup = 'CHEIA';
            phaseIcon = 'sun';
            sapDynamic = 'Seiva no ápice foliar, flores e frutos. Turgor celular máximo em toda a copa; excelente para nutrição orgânica de solo, mas EVITAR podas severas de ramos grossos.';
            badgeCls = 'bg-amber-500/20 text-amber-200 border-amber-500/40';
        } else if (moonAge < 22.15) {
            phaseName = 'Gibosa Minguante';
            phaseGroup = 'MINGUANTE';
            phaseIcon = 'moon';
            sapDynamic = 'Início do refluxo da seiva em direção ao sistema radicular. Copa desacelerando; transição para manipulação e poda de raízes com mínima perda de turgor.';
            badgeCls = 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
        } else if (moonAge < 23.99) {
            phaseName = 'Quarto Minguante';
            phaseGroup = 'MINGUANTE';
            phaseIcon = 'moon';
            sapDynamic = 'Seiva concentrando-se firmemente nas raízes e solo. Momento clássico e perfeito para poda de raízes, lavagem de torrão e transplante de evolução.';
            badgeCls = 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40';
        } else {
            phaseName = 'Lua Minguante (Balsâmica)';
            phaseGroup = 'MINGUANTE';
            phaseIcon = 'moon';
            sapDynamic = 'Seiva totalmente resguardada na base do nebari e substrato. Risco quase nulo de estresse hídrico aéreo pós-transplante ou desfolha.';
            badgeCls = 'bg-slate-700/50 text-slate-300 border-slate-600';
        }

        let nextBoundaryAge = 7.38;
        let nextPhaseName = 'Quarto Crescente';
        if (moonAge < 7.38) {
            nextBoundaryAge = 7.38;
            nextPhaseName = 'Quarto Crescente';
        } else if (moonAge < 14.77) {
            nextBoundaryAge = 14.77;
            nextPhaseName = 'Lua Cheia';
        } else if (moonAge < 22.15) {
            nextBoundaryAge = 22.15;
            nextPhaseName = 'Quarto Minguante';
        } else {
            nextBoundaryAge = 29.53;
            nextPhaseName = 'Lua Nova';
        }
        const daysToNextPhase = Math.max(0.5, Number((nextBoundaryAge - moonAge).toFixed(1)));

        return {
            moonAge: Number(moonAge.toFixed(1)),
            illumination,
            phaseName,
            phaseGroup,
            phaseIcon,
            sapDynamic,
            badgeCls,
            daysToNextPhase,
            nextPhaseName,
            optimalWindowDays: Math.round(daysToNextPhase)
        };
    }

    function getSeasonAndClimate(targetDate = new Date()) {
        const m = targetDate.getMonth();
        const seasons = [
            { season: 'Verão', climate: 'Calor intenso, chuvas fortes convectivas e radiação UV elevada. Evapotranspiração no pico.' },
            { season: 'Verão', climate: 'Auge térmico, noites quentes e umidade do ar elevada. Vigor vegetativo explosivo em tropicais.' },
            { season: 'Outono', climate: 'Transição climática: noites mais frescas, diminuição de chuvas e fluxo vascular desacelerando.' },
            { season: 'Outono', climate: 'Dias amenos, ar mais seco e noites frias. Madeira lignificando e consolidando reservas.' },
            { season: 'Outono', climate: 'Frio e estiagem se estabelecendo. Caducifólias e caudiciformes entrando em dormência vegetativa.' },
            { season: 'Inverno', climate: 'Dias mais curtos do ano, geadas ocasionais e baixíssima umidade. Seiva em repouso estacional profundo.' },
            { season: 'Inverno', climate: 'Pico do inverno. Período de dormência máxima, ideal para grandes cirurgias radiculares e madeira morta.' },
            { season: 'Inverno', climate: 'Fim do inverno, clima muito seco, gemas intumescendo anunciando o despertar da brotação.' },
            { season: 'Primavera', climate: 'Equinócio de primavera: explosão de brotações novas, floradas e aumento súbito do consumo hídrico.' },
            { season: 'Primavera', climate: 'Calor em ascensão e início das chuvas regulares. Solo aquecido estimulando raízes novas.' },
            { season: 'Primavera', climate: 'Clima quente e úmido constante. Momento supremo para transplantes de espécies tropicais nativas.' },
            { season: 'Verão', climate: 'Solstício de verão: dias mais longos, insolação intensa das 11h às 15h e chuvas de fim de tarde.' }
        ];
        return seasons[m] || seasons[0];
    }

    const PROCEDURES_CATALOG = [
        {
            id: 'ALPORQUIA',
            category: 'ALPORQUIA',
            categoryBadge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
            title: 'Alporquia Aérea (Air Layering)',
            subtitle: 'Propagação clonal de alta precisão aproveitando galhos grossos com conicidade',
            idealMoons: ['CRESCENTE', 'CHEIA'],
            avoidMoons: ['NOVA'],
            idealSeasons: ['Primavera', 'Verão'],
            avoidSeasons: ['Inverno'],
            suitableStages: ['Pré-bonsai', 'Bonsai', 'Yamadori'],
            speciesKeywords: ['Primavera', 'Bougainvillea', 'Jabuticaba', 'Pitanga', 'Acerola', 'Figueira', 'Ficus', 'Amora', 'Tamarindo', 'Duranta', 'Pau-ferro'],
            avoidKeywords: ['Rainha-do-abismo', 'Rosa-do-deserto', 'Érica-falsa'],
            tools: 'Canivete de enxertia afiado, pó enraizador AIB (3000-6000 ppm), musgo esfagno lavado e esterilizado, plástico filme transparente, papel alumínio e arames de amarração.',
            steps: [
                'Escolher um galho lenhoso vigoroso que já possua conicidade ou movimento interessante.',
                'Fazer dois cortes paralelos na casca, distanciados em cerca de 1,5x o diâmetro do galho.',
                'Remover completamente o anel de casca e raspar com o dorso da lâmina a camada verde (câmbio) para impedir que a ponte de seiva se refaça.',
                'Pincelar hormônio enraizador AIB na borda superior do anel (onde a seiva elaborada desce e se acumula).',
                'Umedecer o musgo esfagno (espremendo o excesso) e moldá-lo firmemente ao redor do anel.',
                'Envolver com filme plástico bem vedado e cobrir com papel alumínio (face brilhante para fora) para proteger raízes jovens do calor e luz direta.',
                'Aguardar emissão radicular (45 a 90 dias conforme a espécie) antes de desmamar a nova planta.'
            ],
            biologicalNote: 'O fluxo de seiva ascendente ativo combinado com dias longos e calor estimula acúmulo de auxinas acima do anelamento, disparando a formação de calo e raízes adventícias com taxa de sucesso superior a 90%.'
        },
        {
            id: 'ESTAQUIA',
            category: 'ESTAQUIA',
            categoryBadge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
            title: 'Estaquia Lenhosa / Semilenhosa',
            subtitle: 'Multiplicação rápida aproveitando ponteiras e podas de estruturação',
            idealMoons: ['CRESCENTE'],
            avoidMoons: ['NOVA', 'MINGUANTE'],
            idealSeasons: ['Primavera', 'Verão'],
            avoidSeasons: ['Inverno'],
            suitableStages: ['Muda', 'Pré-bonsai', 'Bonsai'],
            speciesKeywords: ['Figueira', 'Ficus', 'Duranta', 'Caliandra', 'Serissa', 'Amora', 'Érica-falsa', 'Bougainvillea', 'Ixora'],
            avoidKeywords: ['Rainha-do-abismo', 'Rosa-do-deserto', 'Junípero'],
            tools: 'Tesoura de poda fina desinfetada, hormônio AIB ou pó de canela, substrato inerte (areia grossa lavada + vermiculita 50/50), borrifador e estufa úmida.',
            steps: [
                'Cortar estacas de 10 a 15 cm com 2 a 3 nós, realizando corte em bisel (45°) logo abaixo de um nó.',
                'Retirar as folhas inferiores, mantendo apenas 2 ou 3 folhas superiores cortadas pela metade para reduzir evapotranspiração.',
                'Mergulhar a base em água e aplicar pó de hormônio enraizador AIB na ponta do bisel.',
                'Plantar em substrato inerte bem umedecido sem enterrar demais (cerca de 3 a 4 cm de profundidade).',
                'Manter sob meia-sombra protegida de vento e com umidade constante no ar (estufa plástica se necessário).'
            ],
            biologicalNote: 'A pressão positiva de seiva da Lua Crescente impulsiona o turgor das gemas axilares, prevenindo a desidratação precoce do tecido enquanto os primórdios radiculares se desenvolvem no substrato morno.'
        },
        {
            id: 'PODA_RAIZES',
            category: 'RAIZES',
            categoryBadge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
            title: 'Poda de Raízes e Penteamento Radicular',
            subtitle: 'Renovação do sistema absorvente e estímulo ao crescimento radial do nebari',
            idealMoons: ['MINGUANTE', 'NOVA'],
            avoidMoons: ['CHEIA', 'CRESCENTE'],
            idealSeasons: ['Inverno', 'Primavera'],
            avoidSeasons: [],
            suitableStages: ['Pré-bonsai', 'Bonsai', 'Yamadori'],
            speciesKeywords: ['Buxinho', 'Junípero', 'Pau-ferro', 'Piteco', 'Fruta-dos-milagres', 'Pitanga', 'Limão-cravo', 'Mexerica', 'Jabuticaba'],
            avoidKeywords: ['Rosa-do-deserto', 'Rainha-do-abismo'],
            tools: 'Hashi ou gancho de raízes de aço, tesoura de poda pesada de raízes, borrifador com água e solução de vitamina B1 / tiamina.',
            steps: [
                'Retirar a planta do vaso soltando os arames de ancoragem pelo fundo.',
                'Pentear suavemente as raízes com o gancho, começando pelas bordas periféricas em direção ao centro do torrão.',
                'Eliminar raízes grossas pivotantes que crescem para baixo sem radicelas absorventes.',
                'Reduzir de 25% a 40% da massa radicular externa, preservando as raízes capilares finas próximas ao colo.',
                'Pulverizar solução anti-estresse (B1 / enraizador líquido) durante todo o trabalho para nunca deixar secar.',
                'Replantar com drenagem nova e ancorar firmemente com arames antes de palitar o novo substrato.'
            ],
            biologicalNote: 'Na Lua Minguante, a seiva está recolhida no sistema radicular e a copa consome o mínimo de água, minimizando o risco de colapso celular ou murcha por corte de raízes.'
        },
        {
            id: 'LAVAGEM_RAIZES',
            category: 'RAIZES',
            categoryBadge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
            title: 'Lavagem de Raízes (Root Washing / Desmanche de Torrão)',
            subtitle: 'Substituição total de terra argilosa pesada ou compactada por substrato granular',
            idealMoons: ['MINGUANTE'],
            avoidMoons: ['CHEIA'],
            idealSeasons: ['Primavera', 'Inverno'],
            avoidSeasons: ['Verão'],
            suitableStages: ['Muda', 'Pré-bonsai', 'Yamadori'],
            speciesKeywords: ['Buxinho', 'Junípero', 'Piteco', 'Pau-ferro', 'Amora', 'Duranta', 'Jabuticaba', 'Acerola'],
            avoidKeywords: ['Bougainvillea', 'Rosa-do-deserto', 'Rainha-do-abismo'],
            tools: 'Bacia ampla com água sem cloro, mangueira com bico de jato suave (névoa/chuveirinho), hashi de bambu e pasta cicatrizante para raízes grossas.',
            steps: [
                'Mergulhar o torrão na bacia de água por 15-20 minutos para amolecer a argila compactada.',
                'Aplicar jato suave de água removendo a terra velha sem puxar ou romper as raízes capilares.',
                'Desembaraçar as raízes radialmente a partir da base do tronco (formação de nebari em estrela).',
                'Cortar raízes podres, cruzadas ou enroladas no fundo do pote antigo.',
                'Assentar no novo vaso sobre uma camada cônica de substrato granulado seco (caqueira/pinus/pedrisco).',
                'Palitar pacientemente com hashi entre todas as raízes para eliminar bolsas de ar sem compactar.'
            ],
            biologicalNote: 'Procedimento cirúrgico de alto impacto. Na Lua Minguante sob temperatura amena de primavera, a árvore metaboliza o choque sem a perda hídrica que o calor do verão provocaria em raízes nuas.'
        },
        {
            id: 'TRANSPLANTE_EVOLUCAO',
            category: 'TRANSPLANTE',
            categoryBadge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
            title: 'Transplante de Evolução para Vaso Definitivo',
            subtitle: 'Passagem de pote de treinamento para vaso de cerâmica nobre esmaltado ou não-esmaltado',
            idealMoons: ['MINGUANTE', 'NOVA'],
            avoidMoons: ['CHEIA'],
            idealSeasons: ['Primavera', 'Verão', 'Inverno'],
            avoidSeasons: [],
            suitableStages: ['Pré-bonsai', 'Bonsai'],
            speciesKeywords: ['Jabuticaba', 'Pitanga', 'Caliandra', 'Figueira', 'Piteco', 'Pau-ferro', 'Acerola', 'Buxinho', 'Junípero', 'Tamarindo', 'Duranta'],
            avoidKeywords: [],
            tools: 'Vaso de cerâmica compatível com o estilo (oval/retangular/redondo), telas de drenagem, arames de cobre/alumínio de fixação, substrato balanceado peneirado.',
            steps: [
                'Preparar o novo vaso com telas plásticas presas nos orifícios de drenagem e passar os arames de ancoragem pelo fundo.',
                'Colocar uma camada de drenagem de pedrisco/cacos cerâmicos (1 a 2 cm).',
                'Adicionar camada inicial de substrato e posicionar a planta com a frente e inclinação corretas do estilo.',
                'Fixar a planta amarrando os arames firmemente sobre o nebari (protegendo a casca com pedaço de mangueira).',
                'Preencher com substrato granulado e palitar com hashi até o completo preenchimento de todos os vazios.',
                'Realizar primeira rega abundante por imersão ou chuveirinho até a água sair cristalina pelo dreno.',
                'Manter em local protegido de vento e sol forte direto por 15 a 20 dias.'
            ],
            biologicalNote: 'A acomodação em vaso definitivo requer ancoragem imóvel. A Lua Minguante acelera a ancoragem de novas radicelas periféricas no substrato virgem antes do próximo ciclo de brotação foliar.'
        },
        {
            id: 'TRANSPLANTE_PARCIAL',
            category: 'TRANSPLANTE',
            categoryBadge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
            title: 'Transplante Parcial de Manutenção (Slip Potting)',
            subtitle: 'Aumento de espaço ou reposição de substrato sem desmanchar o torrão central',
            idealMoons: ['MINGUANTE', 'NOVA', 'CRESCENTE'],
            avoidMoons: [],
            idealSeasons: ['Primavera', 'Verão', 'Outono'],
            avoidSeasons: ['Inverno'],
            suitableStages: ['Muda', 'Pré-bonsai', 'Bonsai', 'Yamadori'],
            speciesKeywords: ['Bougainvillea', 'Rosa-do-deserto', 'Serissa', 'Ixora', 'Mexerica', 'Limão-cravo', 'Fruta-dos-milagres', 'Érica-falsa'],
            avoidKeywords: [],
            tools: 'Vaso ligeiramente maior (ou o mesmo limpo), substrato fresco novo, hashi e regador fino.',
            steps: [
                'Retirar o exemplar do vaso com extremo cuidado para não partir o torrão intacto.',
                'Raspar superficialmente apenas a camada externa e o fundo onde as raízes estiverem enoveladas.',
                'Reposicionar no vaso com nova camada de drenagem e substrato fértil fresco nas laterais.',
                'Palitar as bordas para preencher os espaços sem pressionar o miolo do torrão.',
                'Regar generosamente; a planta não sofre interrupção no ciclo de crescimento.'
            ],
            biologicalNote: 'Técnica perfeita para espécies sensíveis que detestam intervenção radicular agressiva (como Bougainvillea e Serissa) ou quando é necessário aliviar o esgotamento nutricional fora da época tradicional.'
        },
        {
            id: 'PODA_DRASTICA',
            category: 'PODA_DRASTICA',
            categoryBadge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
            title: 'Poda Drástica Estrutural / Rebaixamento de Tronco',
            subtitle: 'Corte radical para criação de conicidade acentuada, eliminação de bifurcações e novo ápice',
            idealMoons: ['NOVA', 'MINGUANTE'],
            avoidMoons: ['CHEIA', 'CRESCENTE'],
            idealSeasons: ['Inverno', 'Primavera'],
            avoidSeasons: ['Verão'],
            suitableStages: ['Muda', 'Pré-bonsai', 'Yamadori'],
            speciesKeywords: ['Piteco', 'Piteco-cortiçoso', 'Acerola', 'Amora', 'Duranta', 'Pau-ferro', 'Figueira', 'Tamarindo'],
            avoidKeywords: ['Junípero', 'Buxinho', 'Rainha-do-abismo'],
            tools: 'Alicate côncavo ou esférico japonês afiado, serrote de poda fina, lâmina bisturi e pasta cicatrizante japonesa com fungicida (Top Jin M ou similar).',
            steps: [
                'Analisar a linha de tronco e identificar o broto ou ramo que assumirá a nova liderança apical.',
                'Realizar corte inclinado em bisel suave, com a parte mais alta logo acima do ramo líder selecionado.',
                'Escanear o corte com o alicate esférico para criar uma concavidade que cicatrizará plana no futuro.',
                'Selar imediatamente o corte com pasta cicatrizante de alta aderência antes que o câmbio oxide.',
                'Reduzir a rega pela metade (árvore sem copa consome muito menos água; risco de podridão radicular se encharcar).'
            ],
            biologicalNote: 'Na Lua Nova, a sangria vascular é mínima porque os tecidos aéreos estão sob pressão negativa e a seiva repousa na base. Os cortes cicatrizam mais rápido sem perda de açúcares vitais.'
        },
        {
            id: 'PODA_RAMIFICACAO',
            category: 'PODA_RAMIFICACAO',
            categoryBadge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
            title: 'Poda de Ramificação Fina, Pinçagem & Desfolha',
            subtitle: 'Manutenção da densidade dos patamares, redução do tamanho das folhas e contenção de vigor',
            idealMoons: ['MINGUANTE', 'CRESCENTE'],
            avoidMoons: [],
            idealSeasons: ['Primavera', 'Verão'],
            avoidSeasons: ['Inverno'],
            suitableStages: ['Bonsai', 'Pré-bonsai'],
            speciesKeywords: ['Érica-falsa', 'Buxinho', 'Serissa', 'Ixora', 'Pitanga', 'Caliandra', 'Junípero', 'Mexerica', 'Limão-cravo', 'Acerola'],
            avoidKeywords: ['Rainha-do-abismo', 'Rosa-do-deserto'],
            tools: 'Tesoura fina de pinçagem (Hasami), pinça de desfolha e borrifador foliar.',
            steps: [
                'Inspecionar os patamares de galhos e localizar os brotos que ultrapassam a silhueta geométrica da copa.',
                'Aguardar o broto emitir de 4 a 6 folhas e podar de volta para 1 ou 2 pares de folhas com gemas direcionadas para fora.',
                'Em coníferas (Junípero Jacaré), pinçar as pontas escamadas apenas com a ponta dos dedos, nunca com tesoura.',
                'Realizar desfolha parcial em folhas gigantes para permitir que a luz solar penetre no interior da copa.',
                'Manter fertilização rica em potássio para fortalecer os novos entrenós curtos.'
            ],
            biologicalNote: 'Estimula a quebra da dominância apical (auxina) e desperta as gemas dormentes internas (citocininas), densificando os patamares verdes sem alongar entrenós.'
        },
        {
            id: 'ARAMACAO_ESTRUTURAL',
            category: 'ESTRUTURA',
            categoryBadge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
            title: 'Aramação e Posicionamento de Galhos',
            subtitle: 'Orientação espacial milimétrica de ramos primários e secundários com alumínio anodizado',
            idealMoons: ['MINGUANTE', 'NOVA'],
            avoidMoons: ['CHEIA'],
            idealSeasons: ['Outono', 'Inverno', 'Primavera'],
            avoidSeasons: ['Verão'],
            suitableStages: ['Pré-bonsai', 'Bonsai', 'Yamadori'],
            speciesKeywords: ['Junípero', 'Pau-ferro', 'Piteco', 'Tamarindo', 'Buxinho', 'Duranta', 'Bougainvillea'],
            avoidKeywords: ['Rosa-do-deserto', 'Rainha-do-abismo'],
            tools: 'Arames de alumínio anodizado (bitolas 1.5mm a 4.0mm), alicate corta-arame, alicate de jin e ráfia úmida para proteção de casca.',
            steps: [
                'Suspender a rega no dia anterior para que os galhos percam o excesso de turgor e fiquem flexíveis.',
                'Proteger ramos de casca lisa ou propensa a rachar envolvendo com ráfia úmida bem tensionada.',
                'Ancorar o arame firmemente em um ponto fixo (tronco ou ramo oposto em ângulo de 45°).',
                'Passar as espirais com ângulo constante de 45°, sem estrangular nem deixar folgas.',
                'Posicionar o galho com as duas mãos, usando os polegares como ponto de apoio do lado de fora da curva.',
                'Anotar data de revisão para remover o arame antes que morda a casca (verificar a cada 30-45 dias).'
            ],
            biologicalNote: 'Na Lua Minguante ou sob madeira madura de outono, o turgor das células vegetais é menor, reduzindo drasticamente o risco de fratura do galho durante a dobra e prevenindo marcas prematuras.'
        },
        {
            id: 'MADEIRA_MORTA',
            category: 'ESTRUTURA',
            categoryBadge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
            title: 'Escultura de Madeira Morta (Jin, Shari e Sabamiki)',
            subtitle: 'Envelhecimento artístico de troncos e galhos secos com aplicação de calda sulfocálcica',
            idealMoons: ['NOVA', 'MINGUANTE'],
            avoidMoons: ['CHEIA', 'CRESCENTE'],
            idealSeasons: ['Outono', 'Inverno'],
            avoidSeasons: ['Verão'],
            suitableStages: ['Bonsai', 'Pré-bonsai', 'Yamadori'],
            speciesKeywords: ['Junípero', 'Bougainvillea', 'Piteco-cortiçoso', 'Piteco', 'Buxinho', 'Pitanga'],
            avoidKeywords: ['Rainha-do-abismo', 'Rosa-do-deserto', 'Érica-falsa'],
            tools: 'Alicate de Jin, goivas de entalhe em madeira, escova de aço de latão, maçarico culinário leve e calda sulfocálcica pura com pincel pequeno.',
            steps: [
                'Identificar veios mortos e delimitar com canivete a linha viva de casca que nutre a copa.',
                'Descarnar a casca do galho com alicate de Jin puxando fibras longitudinais no sentido natural do veio.',
                'Esculpir ranhuras e fendas com goiva criando aspecto de erosão por vento e tempestades.',
                'Queimar levemente fiapos soltos com maçarico e escovar com cerdas de aço.',
                'Umedecer a madeira morta com borrifador de água e aplicar calda sulfocálcica pura com pincel sem encostar na casca viva.',
                'Deixar secar ao sol por 24 horas até adquirir tom branco-marfim característico.'
            ],
            biologicalNote: 'O ar seco e a seiva dormente do outono/inverno proporcionam a absorção perfeita da calda protetora na madeira exposta, impedindo fungos de podridão sem irritar o fluxo de câmbio ativo.'
        },
        {
            id: 'REPOUSO_CAUDICIFORME',
            category: 'ESTRUTURA',
            categoryBadge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
            title: 'Manejo de Caudiciformes & Regulação de Dormência',
            subtitle: 'Proteção de cáudice escultural, suspensão controlada de rega e prevenção de podridão',
            idealMoons: ['MINGUANTE', 'NOVA'],
            avoidMoons: ['CHEIA'],
            idealSeasons: ['Outono', 'Inverno', 'Primavera'],
            avoidSeasons: [],
            suitableStages: ['Bonsai', 'Pré-bonsai'],
            speciesKeywords: ['Rainha-do-abismo', 'Rosa-do-deserto'],
            avoidKeywords: ['Jabuticaba', 'Pitanga', 'Amora'],
            tools: 'Pincel macio, canela em pó com própolis, medidor de umidade de solo e estrado ventilado.',
            steps: [
                'Na aproximação do outono/inverno, suspender gradativamente as regas da Rainha-do-abismo e Rosa-do-deserto.',
                'Se houver perda natural das folhas da Rainha-do-abismo, manter o tubérculo em local seco e iluminado sem regar o bulbo.',
                'Inspecionar a firmeza do cáudice com leve pressão dos dedos: se estiver túrgido, não regar.',
                'Na primavera, retomar regas periféricas apenas quando as primeiras folhas aveludadas despontarem no topo.',
                'Aplicar pó de canela em eventuais microferimentos para blindagem fúngica.'
            ],
            biologicalNote: 'Caudiciformes e rupícolas necessitam de estresse hídrico sazonal para florescer e preservar suas reservas sem colapsar por fungos radiculares anaeróbicos.'
        },
        {
            id: 'DESFOLHA_TOTAL',
            category: 'DESFOLHA',
            categoryBadge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
            title: 'Desfolha Total de Verão (Redução Foliar e Ramificação Terciária)',
            subtitle: 'Técnica cirúrgica para forçar nova brotação compacta com entrenós curtos e folhas reduzidas',
            idealMoons: ['CRESCENTE', 'CHEIA'],
            avoidMoons: ['NOVA'],
            idealSeasons: ['Verão'],
            avoidSeasons: ['Inverno', 'Outono'],
            suitableStages: ['Bonsai', 'Pré-bonsai'],
            speciesKeywords: ['Amora', 'Morus', 'Ficus', 'Figueira', 'Acerola', 'Jabuticaba', 'Buxinho'],
            avoidKeywords: ['Rainha-do-abismo', 'Rosa-do-deserto', 'Junípero', 'Pinus'],
            tools: 'Tesoura de desfolha de ponta fina bem afiada, fertilizante líquido prévio e borrifador.',
            steps: [
                'Confirmar vigor impecável da planta; nunca desfolhar árvores recém-transplantadas ou debilitadas.',
                'Cortar cada folha no meio do pecíolo com a ponta da tesoura, preservando a gema axilar intacta.',
                'Deixar o toco de pecíolo secar naturalmente; ele cairá sozinho em 7 a 10 dias sem ferir o ramo.',
                'Proteger o vaso em meia-sombra ventilada por 5 dias após o corte.',
                'Reduzir as regas em 60%, pois sem folhas a árvore consome pouca água até o estouro das novas gemas.'
            ],
            biologicalNote: 'Com seiva ativa na Lua Crescente/Cheia de verão, as gemas dormentes explodem simultaneamente, dividindo a força entre dezenas de brotos que nascem com folhas 50% a 70% menores.'
        },
        {
            id: 'PINCAGEM_APICAL',
            category: 'PINCAGEM',
            categoryBadge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
            title: 'Pinçagem Apical Contínua & Condução de Brotação Fina',
            subtitle: 'Contenção cirúrgica de dominância apical para redirecionar seiva para o interior dos patamares',
            idealMoons: ['CRESCENTE', 'CHEIA'],
            avoidMoons: ['NOVA'],
            idealSeasons: ['Primavera', 'Verão'],
            avoidSeasons: ['Inverno'],
            suitableStages: ['Bonsai', 'Pré-bonsai', 'Muda'],
            speciesKeywords: ['Tataré', 'Piteco', 'Duranta', 'Caliandra', 'Serissa', 'Alecrim', 'Buxinho', 'Jabuticaba'],
            avoidKeywords: ['Rainha-do-abismo'],
            tools: 'Pinça fitotécnica japonesa de aço inox ou dedos limpos para não oxidar tecidos tenros.',
            steps: [
                'Identificar ramos novos que estão ultrapassando o perfil da copa projetada.',
                'Aguardar o broto emitir 3 a 4 pares de folíolos e remover o ápice terminal tenro com a pinça.',
                'Deixar 1 a 2 nós bem direcionados para a direção em que se deseja expandir a ramificação.',
                'Repetir a cada 15-20 dias durante a estação de crescimento ativo.'
            ],
            biologicalNote: 'A remoção do meristema apical corta temporariamente a produção de auxinas no topo, liberando as citocininas para ativar as gemas dormentes da base e manter a copa densa.'
        },
        {
            id: 'CALDA_SULFOCALCICA',
            category: 'FITOSSANITARIO',
            categoryBadge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
            title: 'Tratamento Fitossanitário de Inverno & Proteção de Madeira Morta',
            subtitle: 'Assepsia fúngica com calda sulfocálcica, eliminação de ácaros e clareamento escultural de Jin e Shari',
            idealMoons: ['MINGUANTE', 'NOVA'],
            avoidMoons: ['CHEIA'],
            idealSeasons: ['Outono', 'Inverno'],
            avoidSeasons: ['Verão'],
            suitableStages: ['Bonsai', 'Pré-bonsai', 'Yamadori'],
            speciesKeywords: ['Junípero', 'Shimpaku', 'Buxinho', 'Jabuticaba', 'Pitanga', 'Amora', 'Pau-ferro'],
            avoidKeywords: ['Rosa-do-deserto', 'Rainha-do-abismo'],
            tools: 'Calda sulfocálcica diluída (1:30 para pulverização de copa, pura para Jin/Shari), pincel fino e plástico.',
            steps: [
                'Cobrir cuidadosamente o substrato com saco plástico para não alterar o pH da terra.',
                'Em dias nublados e frescos de inverno, pulverizar a diluição 1:30 em troncos e galhos desfolhados.',
                'Para Jin e Shari, molhar previamente a madeira morta e aplicar a calda pura com pincel fino.',
                'Aguardar 24h em local protegido para fixação do enxofre e clareamento da fibra de madeira.'
            ],
            biologicalNote: 'O enxofre e o cálcio atuam em sinergia esterilizando fungos de casca e madeira, além de petrificar a madeira morta contra podridão sem irritar o sistema radicular dormente.'
        },
        {
            id: 'ADUBACAO_FLORACAO',
            category: 'NUTRICAO',
            categoryBadge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
            title: 'Adubação de Indução Floral (Fósforo e Potássio Reforçados)',
            subtitle: 'Nutrição específica para formação abundante de botões florais e fixação de frutinhos',
            idealMoons: ['CRESCENTE', 'CHEIA'],
            avoidMoons: ['NOVA'],
            idealSeasons: ['Inverno', 'Primavera'],
            avoidSeasons: [],
            suitableStages: ['Bonsai', 'Pré-bonsai'],
            speciesKeywords: ['Jabuticaba', 'Pitanga', 'Acerola', 'Bougainvillea', 'Primavera', 'Caliandra', 'Amora', 'Romã', 'Cereja'],
            avoidKeywords: [],
            tools: 'Farinha de osso calcinada, cinzas de madeira ou NPK 04-14-08 com micronutrientes, porta-adubos.',
            steps: [
                'Aplicar a dose recomendada na periferia do vaso, longe do contato direto com o nebari.',
                'Inserir em porta-adubos para evitar atração de pássaros e perda por lavagem de rega.',
                'Regar suavemente após a aplicação para ativar os microrganismos benéficos do solo.',
                'Manter sol pleno diário para potencializar a fotossíntese e a conversão de carboidratos florais.'
            ],
            biologicalNote: 'O balanço NPK direcionado para P e K estimula a síntese de florígeno e reduz a dominância vegetativa de brotos verdes longos, convertendo gemas foliares em gemas florais férteis.'
        },
        {
            id: 'PODA_ESTRUTURAL_INVERNO',
            category: 'PODA_DRASTICA',
            categoryBadge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
            title: 'Poda Estrutural de Inverno & Seleção de Ramos Primários',
            subtitle: 'Cirurgia de arquitetura em dormência sem perda de seiva e com total visibilidade da ramificação',
            idealMoons: ['NOVA', 'MINGUANTE'],
            avoidMoons: ['CHEIA'],
            idealSeasons: ['Inverno'],
            avoidSeasons: ['Verão', 'Primavera'],
            suitableStages: ['Muda', 'Pré-bonsai', 'Bonsai', 'Yamadori'],
            speciesKeywords: ['Amora', 'Pau-ferro', 'Tamarindo', 'Acerola', 'Buxinho', 'Romã', 'Figueira'],
            avoidKeywords: ['Rainha-do-abismo', 'Rosa-do-deserto'],
            tools: 'Alicate côncavo reto, serrote japonês dobrável, pasta selante cicatrizante japonesa com fungicida e álcool 70%.',
            steps: [
                'Inspecionar a estrutura do tronco desfolhado sem a interferência da massa verde.',
                'Eliminar galhos que cruzam o tronco, galhos paralelos no mesmo nó e galhos direcionados para dentro da silhueta.',
                'Realizar cortes rentes e limpos com alicate côncavo para garantir cicatrização plana sem calombos.',
                'Selar imediatamente todo corte superior a 3mm com pasta cicatrizante japonesa.',
                'Suspender fertilização rica em N e manter a árvore em local protegido de geadas e ventos encanados secos.'
            ],
            biologicalNote: 'A dormência invernal sob Lua Nova mantém os vasos de xilema e floema com fluxo basal reduzido, permitindo grandes intervenções com zero perda de energia metabólica e cicatrização perfeita.'
        },
        {
            id: 'PINCAGEM_PINUS_VELAS',
            category: 'PINCAGEM',
            categoryBadge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
            title: 'Pinçagem de Velas e Brotações em Coníferas (Técnica Mekiri)',
            subtitle: 'Equilíbrio cirúrgico de vigor entre ápice dominante e ramos fracos da base em juníperos e pinheiros',
            idealMoons: ['CRESCENTE', 'CHEIA'],
            avoidMoons: ['NOVA'],
            idealSeasons: ['Primavera', 'Verão'],
            avoidSeasons: ['Inverno'],
            suitableStages: ['Bonsai', 'Pré-bonsai'],
            speciesKeywords: ['Junípero', 'Shimpaku', 'Pinus', 'Cipreste', 'Tuia'],
            avoidKeywords: ['Rosa-do-deserto', 'Rainha-do-abismo', 'Érica-falsa'],
            tools: 'Pontas dos dedos limpas (nunca usar tesoura metálica em acículas tenras para evitar pontas amarronzadas).',
            steps: [
                'Identificar as velas ou tufos de escamas que ultrapassam a densidade do patamar.',
                'Segurar a base da vela com o polegar e indicador de uma mão e quebrar suavemente o terço superior com a outra mão.',
                'Pinçar primeiro as velas mais fortes do topo da árvore; 10 dias depois, pinçar as velas médias e deixar intactas as fracas da base.',
                'Manter o exemplar sob sol pleno para induzir rebrote homogêneo e acículas compactas.',
                'Proteger as raízes de excesso hídrico durante a emissão das novas agulhas.'
            ],
            biologicalNote: 'A quebra escalonada redistribui as auxinas da copa para os galhos inferiores, equalizando a força vegetativa da conífera e evitando que a base seque por sombreamento.'
        },
        {
            id: 'DESFOLHA_PARCIAL_EQUILIBRIO',
            category: 'DESFOLHA',
            categoryBadge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
            title: 'Desfolha Parcial Seletiva para Entrada de Luz Interna',
            subtitle: 'Remoção cirúrgica de folhas gigantes do topo para nutrir brotos dormentes interiores sem estressar a planta',
            idealMoons: ['CRESCENTE', 'MINGUANTE'],
            avoidMoons: ['NOVA'],
            idealSeasons: ['Primavera', 'Verão'],
            avoidSeasons: ['Inverno'],
            suitableStages: ['Bonsai', 'Pré-bonsai'],
            speciesKeywords: ['Figueira', 'Ficus', 'Amora', 'Jabuticaba', 'Pitanga', 'Acerola', 'Piteco'],
            avoidKeywords: ['Junípero', 'Rainha-do-abismo', 'Rosa-do-deserto'],
            tools: 'Tesoura japonesa fina de desfolha (Hasami) e borrifador foliar.',
            steps: [
                'Localizar as folhas de sombra excessivamente largas nos patamares superiores que bloqueiam o sol para os ramos de dentro.',
                'Cortar a folha preservando a metade do pecíolo, sem atingir a gema da axila.',
                'Deixar intactas as folhas menores dos ramos fracos e internos.',
                'Pulverizar água fresca ao entardecer para hidratar os novos brotinhos agora expostos à luz.',
                'Observar a explosão de novas ramificações terciárias em 10 a 14 dias.'
            ],
            biologicalNote: 'A penetração da luz solar nas gemas latentes de ramos interiores ativa fitocromos e citocininas, revitalizando ramificações que morreriam por senescência natural sob sombra densa.'
        },
        {
            id: 'PODA_LIMPEZA_SANITARIA',
            category: 'PODA_RAMIFICACAO',
            categoryBadge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
            title: 'Poda Fitossanitária de Limpeza & Eliminação de Ladrões',
            subtitle: 'Remoção de galhos secos, espinhos de área de trabalho e brotações de colo (chupões de nebari)',
            idealMoons: ['MINGUANTE', 'NOVA'],
            avoidMoons: [],
            idealSeasons: ['Outono', 'Inverno', 'Primavera', 'Verão'],
            avoidSeasons: [],
            suitableStages: ['Muda', 'Pré-bonsai', 'Bonsai', 'Yamadori'],
            speciesKeywords: ['Acerola', 'Limão-cravo', 'Mexerica Ponkan', 'Caliandra', 'Duranta', 'Piteco', 'Tamarindo'],
            avoidKeywords: [],
            tools: 'Tesoura de poda fina, alicate corta-arame e pincel com solução fúngica preventiva.',
            steps: [
                'Inspecionar a base do nebari e cortar rentes quaisquer brotos ladrões que drenam a seiva do tronco principal.',
                'Remover folhas secas caídas sobre o substrato que abrigam caracóis, lesmas e fungos.',
                'Eliminar galhos secos sem câmbio verde cortando até a margem do tecido são.',
                'Desbastar espinhos afiados nas zonas onde serão passados arames ou tensores.',
                'Desinfetar as lâminas com álcool 70% entre uma planta e outra para impedir transmissão de patógenos.'
            ],
            biologicalNote: 'A assepsia mecânica elimina vetores de contaminação e garante que 100% da transpiração e nutrientes do solo fluam exclusivamente para a copa estrutural estilizada.'
        }
    ];

    function evaluateIdealProcedures(plantsList, targetDate = new Date()) {
        const moon = getMoonPhase(targetDate);
        const seasonInfo = getSeasonAndClimate(targetDate);
        const results = [];

        plantsList.forEach((plant) => {
            const m = computePlantMetrics(plant);
            const popName = (plant.popularName || '').toLowerCase();
            const sciName = (plant.scientificName || '').toLowerCase();

            PROCEDURES_CATALOG.forEach((proc) => {
                let score = 50;

                // 1. Alinhamento Lunar
                if (proc.idealMoons.includes(moon.phaseGroup)) {
                    score += 26;
                } else if (proc.avoidMoons.includes(moon.phaseGroup)) {
                    score -= 32;
                } else {
                    score += 6;
                }

                // 2. Alinhamento Sazonal & Climático
                if (proc.idealSeasons.includes(seasonInfo.season)) {
                    score += 22;
                } else if (proc.avoidSeasons.includes(seasonInfo.season)) {
                    score -= 30;
                } else {
                    score += 5;
                }

                // 3. Adequação ao Estágio da Planta
                if (proc.suitableStages.includes(plant.stage)) {
                    score += 12;
                } else {
                    score -= 10;
                }

                // 4. Afinidade Específica com a Espécie
                const isAffinity = proc.speciesKeywords.some((k) =>
                    popName.includes(k.toLowerCase()) || sciName.includes(k.toLowerCase())
                );
                const isAvoid = proc.avoidKeywords.some((k) =>
                    popName.includes(k.toLowerCase()) || sciName.includes(k.toLowerCase())
                );

                if (isAvoid) {
                    score -= 45;
                } else if (isAffinity) {
                    score += 22;
                }

                // 5. Ajuste Fisiológico Baseado no Histórico Real & Calendário Fitotécnico
                if (proc.category === 'TRANSPLANTE' || proc.category === 'RAIZES') {
                    if (m.isRepotOverdue) score += 15;
                    if (m.repotDiff !== null && m.repotDiff > (plant.repotCycleMonths * 30 - 120)) {
                        score -= 40;
                    }
                }

                // Análise do Histórico de Podas e Intervenções da Planta
                const pruningLogs = (plant.logs || []).filter(lg => lg.type && (lg.type.toLowerCase().includes('poda') || lg.type.toLowerCase().includes('pinçagem') || lg.type.toLowerCase().includes('desfolha')));
                const lastPruningLog = pruningLogs.length > 0 ? pruningLogs[0] : null;
                const effectivePruneDate = plant.lastPruning || (lastPruningLog && lastPruningLog.date ? lastPruningLog.date : null);
                const daysSinceLastPrune = effectivePruneDate ? Math.abs(global.VaultCore.daysDiffFromToday(effectivePruneDate) || 999) : 999;

                if (proc.category === 'PODA_RAMIFICACAO' || proc.category === 'DESFOLHA' || proc.category === 'ESTRUTURA' || proc.category === 'PINCAGEM') {
                    if (daysSinceLastPrune < 30) {
                        // Evita poda, pinçagem severa ou desfolha repetida em menos de 30 dias para preservar reservas de amido
                        score -= 35;
                    } else if (daysSinceLastPrune > 60 && (plant.stage === 'Bonsai' || plant.stage === 'Pré-bonsai')) {
                        // Árvore vigorosa sem manejo recente se beneficia de refinamento apical e contenção
                        score += 18;
                    }
                }

                // Especificidades botânicas finas da flora brasileira e espécies clássicas
                if (popName.includes('jabuticaba') || sciName.includes('myrciaria')) {
                    if (proc.id === 'PODA_LIMPEZA_SANITARIA' || proc.id === 'PINCAGEM_APICAL') {
                        if (seasonInfo.season === 'Outono' || seasonInfo.season === 'Verão') score += 22;
                    }
                    if (proc.category === 'PODA_DRASTICA' && (seasonInfo.season === 'Inverno')) {
                        score -= 30; // Evitar corte pesado no frio para não estagnar gemas dormentes
                    }
                }
                if (popName.includes('pitanga') || sciName.includes('eugenia')) {
                    if (proc.category === 'PODA_RAMIFICACAO' && (moon.phaseGroup === 'CRESCENTE' || moon.phaseGroup === 'CHEIA')) {
                        score += 20;
                    }
                }
                if (popName.includes('caliandra') || sciName.includes('calliandra')) {
                    if (proc.category === 'PINCAGEM' && seasonInfo.season === 'Verão') {
                        score += 24; // Resposta explosiva a pinçagem contínua de ponteiras
                    }
                }
                if (popName.includes('piteco') || popName.includes('tataré') || sciName.includes('chloroleucon')) {
                    if (proc.category === 'PODA_RAMIFICACAO' || proc.category === 'ESTRUTURA') {
                        if (moon.phaseGroup === 'CRESCENTE' || moon.phaseGroup === 'MINGUANTE') score += 20;
                    }
                }
                if (popName.includes('ipê') || sciName.includes('handroanthus')) {
                    if (proc.category === 'ESTRUTURA' && seasonInfo.season === 'Inverno') {
                        score += 22; // Janela ideal pré-brotação de primavera
                    }
                }
                if (popName.includes('buxinho') || sciName.includes('buxus')) {
                    if (proc.category === 'PODA_RAMIFICACAO' && moon.phaseGroup === 'MINGUANTE') {
                        score += 18; // Poda de contenção com mínima sangria
                    }
                }
                if (popName.includes('junípero') || popName.includes('pinheiro') || sciName.includes('juniperus')) {
                    if (proc.id === 'PINCAGEM_VERDE_PINUS' && (moon.phaseGroup === 'MINGUANTE' || moon.phaseGroup === 'NOVA')) {
                        score += 22;
                    }
                    if (proc.category === 'MADEIRA_MORTA' && (moon.phaseGroup === 'NOVA' || moon.phaseGroup === 'MINGUANTE')) {
                        score += 24; // Ideal para Jin e Shari
                    }
                }
                if (popName.includes('ficus') || popName.includes('figueira') || sciName.includes('ficus')) {
                    if (proc.category === 'DESFOLHA' && seasonInfo.season === 'Verão') {
                        score += 25;
                    }
                }

                if (proc.category === 'ESTRUTURA' && plant.lastStyling) {
                    const daysSinceStyle = Math.abs(global.VaultCore.daysDiffFromToday(plant.lastStyling) || 0);
                    if (daysSinceStyle > 120) score += 10;
                }

                if (proc.category === 'PODA_RAMIFICACAO' && plant.stage === 'Bonsai') {
                    score += 8;
                }

                const finalScore = Math.max(15, Math.min(98, score));

                if (finalScore >= 70) {
                    results.push({
                        score: finalScore,
                        procedure: proc,
                        plant,
                        metrics: m,
                        moon,
                        seasonInfo,
                        whyNow: `${moon.phaseName} (${moon.illumination}% iluminada) + ${seasonInfo.season} (${seasonInfo.climate.split('.')[0]}): ${proc.biologicalNote}`
                    });
                }
            });
        });

        results.sort((a, b) => b.score - a.score);
        return results;
    }

    // =========================================================================
    // 3. MODELO DE DADOS & PERSISTÊNCIA
    // =========================================================================
    // 3. INICIALIZADOR DAS 23 ESPÉCIES DO ACERVO PESSOAL
    // =========================================================================
    function createInitialPlants() {
        const C = global.VaultCore;
        const t = C.todayISO();
        return [
            {
                id: 'B-001',
                popularName: 'Acerola',
                scientificName: 'Malpighia emarginata',
                bench: 'Bancada Frutíferas',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco',
                lastFertilization: C.addDaysISO(t, -20),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -14),
                repotCycleMonths: 24,
                lastStyling: C.addDaysISO(t, -45),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 10),
                nextInterventionType: 'Poda de contenção de brotos longos e adubação rica em P/K',
                notes: 'Excelente resposta à poda. Manter sol pleno para estimular botões florais e frutificação.',
                logs: [
                    { date: C.addDaysISO(t, -20), type: 'Adubação (+30d)', detail: 'Bokashi + Farinha de ossos' },
                    { date: C.addDaysISO(t, -45), type: 'Poda de Manutenção / Pinçagem', detail: 'Condução de patamares secundários' }
                ]
            },
            {
                id: 'B-002',
                popularName: 'Amora (Amoreira-preta)',
                scientificName: 'Morus nigra',
                bench: 'Bancada Sol Pleno A',
                stage: 'Pré-bonsai',
                pot: 'Treino',
                substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco',
                lastFertilization: C.addDaysISO(t, -15),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -8),
                repotCycleMonths: 12,
                lastStyling: C.addDaysISO(t, -30),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 5),
                nextInterventionType: 'Pinçagem apical para redução do limbo foliar',
                notes: 'Crescimento explosivo. Exige rega constante e desfolha seletiva no verão para diminuir folhas.',
                logs: [
                    { date: C.addDaysISO(t, -15), type: 'Adubação (+30d)', detail: 'Adubo orgânico completo NPK' }
                ]
            },
            {
                id: 'B-003',
                popularName: 'Buxinho',
                scientificName: 'Buxus sempervirens',
                bench: 'Bancada Meia-Sombra',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '40% Caqueira / 30% Cacos Cerâmicos / 30% Terra Vegetal',
                lastFertilization: C.addDaysISO(t, -40),
                fertCycleDays: 45,
                lastRepot: C.addMonthsISO(t, -22),
                repotCycleMonths: 36,
                lastStyling: C.addDaysISO(t, -60),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 14),
                nextInterventionType: 'Poda de detalhamento de copas densas com tesoura fina',
                notes: 'Madeira densa e crescimento lento; não desfolhar totalmente. Aramação cuidadosa com proteção.',
                logs: [
                    { date: C.addDaysISO(t, -40), type: 'Adubação (+45d)', detail: 'Torta de mamona e cinzas' }
                ]
            },
            {
                id: 'B-004',
                popularName: 'Caliandra-rosa (Esponjinha)',
                scientificName: 'Calliandra brevipes',
                bench: 'Bancada Sol Pleno A',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '60% Caqueira / 30% Casca Pinus / 10% Pedrisco',
                lastFertilization: C.addDaysISO(t, -12),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -18),
                repotCycleMonths: 24,
                lastStyling: C.addDaysISO(t, -40),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 7),
                nextInterventionType: 'Pinçagem de ramificação fina e reforço de adubação orgânica',
                notes: 'Floração em pompons róseos. Ramos secam se podados sem gema ativa; aramar só brotos verdes.',
                logs: [
                    { date: C.addDaysISO(t, -12), type: 'Adubação (+30d)', detail: 'Osmocote 15-09-12 + Bokashi' }
                ]
            },
            {
                id: 'B-005',
                popularName: 'Caliandra-vermelha',
                scientificName: 'Calliandra tweedii',
                bench: 'Bancada Sol Pleno A',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '60% Caqueira / 30% Casca Pinus / 10% Pedrisco',
                lastFertilization: C.addDaysISO(t, -25),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -16),
                repotCycleMonths: 24,
                lastStyling: C.addDaysISO(t, -50),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 6),
                nextInterventionType: 'Limpeza de cálices florais secos e poda direcional',
                notes: 'Exige sol pleno constante para florescer. Folhas fecham à noite e sob frio/seca.',
                logs: [
                    { date: C.addDaysISO(t, -25), type: 'Adubação (+30d)', detail: 'Adubo orgânico líquido de floração' }
                ]
            },
            {
                id: 'B-006',
                popularName: 'Duranta (Pingo-de-ouro / Violeteira)',
                scientificName: 'Duranta erecta',
                bench: 'Bancada Sol Pleno B',
                stage: 'Pré-bonsai',
                pot: 'Treino',
                substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco',
                lastFertilization: C.addDaysISO(t, -10),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -10),
                repotCycleMonths: 18,
                lastStyling: C.addDaysISO(t, -35),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 12),
                nextInterventionType: 'Poda de contenção de brotação vigorosa e remoção de espinhos axilares',
                notes: 'Espinhos nos ramos juvenis. Grande flexibilidade e velocidade para formar patamares.',
                logs: [
                    { date: C.addDaysISO(t, -10), type: 'Adubação (+30d)', detail: 'Torta de mamona + Bokashi' }
                ]
            },
            {
                id: 'B-007',
                popularName: 'Érica-falsa / Cufea (Flor rosa da foto)',
                scientificName: 'Cuphea gracilis',
                bench: 'Bancada Mame & Shohin',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco',
                lastFertilization: C.addDaysISO(t, -14),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -12),
                repotCycleMonths: 18,
                lastStyling: C.addDaysISO(t, -28),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 4),
                nextInterventionType: 'Pinçagem fina de pontas floridas para manter copa compacta',
                notes: 'Floração rosa contínua o ano todo. Substrato úmido sem encharcar; porte Shohin gracioso.',
                logs: [
                    { date: C.addDaysISO(t, -14), type: 'Adubação (+30d)', detail: 'Biofertilizante foliar diluído' }
                ]
            },
            {
                id: 'B-008',
                popularName: 'Figueira-benjamim (Fícus)',
                scientificName: 'Ficus benjamina',
                bench: 'Bancada Sol Pleno B',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco',
                lastFertilization: C.addDaysISO(t, -18),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -14),
                repotCycleMonths: 24,
                lastStyling: C.addDaysISO(t, -70),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 8),
                nextInterventionType: 'Desfolha parcial de verão e condução de raízes aéreas',
                notes: 'Látex abundante; vigor incrível no verão tropical. Excelente fusão de troncos e raízes sobre rocha.',
                logs: [
                    { date: C.addDaysISO(t, -18), type: 'Adubação (+30d)', detail: 'Osmocote 14-14-14' }
                ]
            },
            {
                id: 'B-009',
                popularName: 'Fruta-dos-milagres',
                scientificName: 'Synsepalum dulcificum',
                bench: 'Bancada Meia-Sombra',
                stage: 'Pré-bonsai',
                pot: 'Treino',
                substrate: '50% Terra Vegetal Ácida / 30% Caqueira / 20% Casca Pinus',
                lastFertilization: C.addDaysISO(t, -35),
                fertCycleDays: 45,
                lastRepot: C.addMonthsISO(t, -20),
                repotCycleMonths: 36,
                lastStyling: C.addDaysISO(t, -80),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 15),
                nextInterventionType: 'Aplicação de quelato de ferro e checagem de pH do substrato',
                notes: 'Exige pH ácido (4.5 a 5.8). Regar apenas com água desclorada; folhas sensíveis a calcário.',
                logs: [
                    { date: C.addDaysISO(t, -35), type: 'Adubação (+45d)', detail: 'Bokashi ácido + Quelato de Ferro' }
                ]
            },
            {
                id: 'B-010',
                popularName: 'Ixora (Mini-ixora)',
                scientificName: 'Ixora coccinea compacta',
                bench: 'Bancada Mame & Shohin',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '50% Caqueira / 30% Terra Vegetal / 20% Casca Pinus',
                lastFertilization: C.addDaysISO(t, -22),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -15),
                repotCycleMonths: 24,
                lastStyling: C.addDaysISO(t, -45),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 9),
                nextInterventionType: 'Poda de limpeza de inflorescências exauridas e adubação P',
                notes: 'Flores em buquê denso. Proteger de ventos frios abaixo de 12°C no inverno.',
                logs: [
                    { date: C.addDaysISO(t, -22), type: 'Adubação (+30d)', detail: 'Adubo orgânico de floração rico em fósforo' }
                ]
            },
            {
                id: 'B-011',
                popularName: 'Jabuticaba (Sabará / Híbrida)',
                scientificName: 'Plinia cauliflora',
                bench: 'Bancada Frutíferas',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '60% Caqueira / 30% Casca Pinus / 10% Pedrisco',
                lastFertilization: C.addDaysISO(t, -36),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -18),
                repotCycleMonths: 24,
                lastStyling: C.addDaysISO(t, -75),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 4),
                nextInterventionType: 'Poda de ladrões internos + Bokashi reforçado',
                notes: 'Tronco descascando uniforme com belo aspecto marmorizado; manter alta hidratação no verão.',
                logs: [
                    { date: C.addDaysISO(t, -36), type: 'Adubação (+30d)', detail: 'Osmocote 15-09-12 + Torta de mamona' },
                    { date: C.addDaysISO(t, -75), type: 'Poda de Manutenção / Pinçagem', detail: 'Seleção de patamares secundários' }
                ]
            },
            {
                id: 'B-012',
                popularName: 'Junípero Jacaré',
                scientificName: 'Juniperus horizontalis',
                bench: 'Bancada Coníferas',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '50% Akadama / 30% Púmice / 20% Rocha Vulcânica',
                lastFertilization: C.addDaysISO(t, -48),
                fertCycleDays: 45,
                lastRepot: C.addMonthsISO(t, -26),
                repotCycleMonths: 36,
                lastStyling: C.addDaysISO(t, -60),
                wiringDueDate: C.addDaysISO(t, 20),
                nextInterventionDate: C.addDaysISO(t, 11),
                nextInterventionType: 'Pinçagem de escamas com ponta dos dedos e revisão de tensores',
                notes: 'Estilo Han-Kengai (semi-cascata). Shari natural na curva principal tratado com calda sulfocálcica.',
                logs: [
                    { date: C.addDaysISO(t, -48), type: 'Adubação (+45d)', detail: 'Bokashi em sachês' },
                    { date: C.addDaysISO(t, -60), type: 'Aramação', detail: 'Aramação de galho cascata com cobre 2.0mm' }
                ]
            },
            {
                id: 'B-013',
                popularName: 'Limão-cravo (Limão-rosa)',
                scientificName: 'Citrus × limonia',
                bench: 'Bancada Frutíferas',
                stage: 'Pré-bonsai',
                pot: 'Treino',
                substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco',
                lastFertilization: C.addDaysISO(t, -16),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -11),
                repotCycleMonths: 24,
                lastStyling: C.addDaysISO(t, -40),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 13),
                nextInterventionType: 'Raleio de frutos para poupar reservas e adubação com micronutrientes',
                notes: 'Frutos perfumados. Vigiar cochonilhas de carapaça; aplicar calda de óleo de neem.',
                logs: [
                    { date: C.addDaysISO(t, -16), type: 'Adubação (+30d)', detail: 'Adubo cítrico específico' }
                ]
            },
            {
                id: 'B-014',
                popularName: 'Mexerica Ponkan',
                scientificName: 'Citrus reticulata',
                bench: 'Bancada Frutíferas',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco',
                lastFertilization: C.addDaysISO(t, -24),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -19),
                repotCycleMonths: 24,
                lastStyling: C.addDaysISO(t, -55),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 8),
                nextInterventionType: 'Pinçagem de brotos novos e adubação orgânica de outono/inverno',
                notes: 'Aroma cítrico intenso. Condução em estilo ereto informal (Moyogi) com copa cônica.',
                logs: [
                    { date: C.addDaysISO(t, -24), type: 'Adubação (+30d)', detail: 'Torta de mamona + Cinzas ricas em potássio' }
                ]
            },
            {
                id: 'B-015',
                popularName: 'Pau-ferro (Jucá)',
                scientificName: 'Libidibia ferrea',
                bench: 'Bancada Nativas Sol Pleno',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco',
                lastFertilization: C.addDaysISO(t, -26),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -17),
                repotCycleMonths: 24,
                lastStyling: C.addDaysISO(t, -85),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 6),
                nextInterventionType: 'Poda de ramificação fina e inspeção de marcas de arame',
                notes: 'Casca descamante marmorizada verde e cinza espetacular. Folíolos fecham ao entardecer.',
                logs: [
                    { date: C.addDaysISO(t, -26), type: 'Adubação (+30d)', detail: 'Bokashi + Silicato' }
                ]
            },
            {
                id: 'B-016',
                popularName: 'Pitanga',
                scientificName: 'Eugenia uniflora',
                bench: 'Bancada Frutíferas',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco',
                lastFertilization: C.addDaysISO(t, -18),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -10),
                repotCycleMonths: 18,
                lastStyling: C.addDaysISO(t, -90),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 16),
                nextInterventionType: 'Pinçagem de brotações avermelhadas e reforço de rega',
                notes: 'Tronco canelado com belo nebari de 12 cm. Brotações novas nascem em tom rubro intenso.',
                logs: [
                    { date: C.addDaysISO(t, -18), type: 'Adubação (+30d)', detail: 'Adubação orgânica equilibrada' }
                ]
            },
            {
                id: 'B-017',
                popularName: 'Piteco / Tataré',
                scientificName: 'Chloroleucon tortum',
                bench: 'Bancada Nativas Sol Pleno',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '60% Caqueira / 30% Casca Pinus / 10% Pedrisco',
                lastFertilization: C.addDaysISO(t, -14),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -13),
                repotCycleMonths: 24,
                lastStyling: C.addDaysISO(t, -45),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 5),
                nextInterventionType: 'Pinçagem frequente de brotos de crescimento rápido',
                notes: 'Madeira extremamente contorcida e casca lisa em tons claros. Cicatriza cortes com facilidade.',
                logs: [
                    { date: C.addDaysISO(t, -14), type: 'Adubação (+30d)', detail: 'Torta de mamona com farinha de ossos' }
                ]
            },
            {
                id: 'B-018',
                popularName: 'Piteco-cortiçoso (Jurema-branca)',
                scientificName: 'Chloroleucon mangense',
                bench: 'Bancada Nativas Sol Pleno',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '60% Caqueira / 30% Casca Pinus / 10% Pedrisco',
                lastFertilization: C.addDaysISO(t, -28),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -16),
                repotCycleMonths: 24,
                lastStyling: C.addDaysISO(t, -65),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 7),
                nextInterventionType: 'Limpeza de poeira e líquens da casca cortiçosa e ajuste de tensores',
                notes: 'Casca suberosa (cortiça grossa) com fissuras profundas de árvore anciã. Altíssima rusticidade.',
                logs: [
                    { date: C.addDaysISO(t, -28), type: 'Adubação (+30d)', detail: 'Bokashi fermentado tradicional' }
                ]
            },
            {
                id: 'B-019',
                popularName: 'Primavera (Buganvília)',
                scientificName: 'Bougainvillea spectabilis',
                bench: 'Bancada Sol Pleno B',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '60% Caqueira / 30% Casca Pinus / 10% Pedrisco',
                lastFertilization: C.addDaysISO(t, -27),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -15),
                repotCycleMonths: 24,
                lastStyling: C.addDaysISO(t, -50),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 3),
                nextInterventionType: 'Estresse hídrico leve e adubação rica em fósforo para florada',
                notes: 'Brácteas magenta intensas. Raízes frágeis como giz no transplante: nunca desmanchar o torrão à força.',
                logs: [
                    { date: C.addDaysISO(t, -27), type: 'Adubação (+30d)', detail: 'Adubo rico em fósforo e potássio' }
                ]
            },
            {
                id: 'B-020',
                popularName: 'Rainha-do-abismo ("Seeninja")',
                scientificName: 'Sinningia leucotricha',
                bench: 'Bancada Caudiciformes & Rocha',
                stage: 'Bonsai',
                pot: 'Laje',
                substrate: '60% Pedrisco / 20% Cacos Cerâmicos / 20% Terra Vegetal',
                lastFertilization: C.addDaysISO(t, -42),
                fertCycleDays: 45,
                lastRepot: C.addMonthsISO(t, -24),
                repotCycleMonths: 36,
                lastStyling: C.addDaysISO(t, -90),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 18),
                nextInterventionType: 'Inspeção do tubérculo prateado e suspensão de regas no repouso',
                notes: 'Cáudice tuberoso lanoso prateado rupícola. Montado sobre placa de ardósia natural.',
                logs: [
                    { date: C.addDaysISO(t, -42), type: 'Adubação (+45d)', detail: 'Fertilizante diluído em 1/4 da dose' }
                ]
            },
            {
                id: 'B-021',
                popularName: 'Rosa-do-deserto',
                scientificName: 'Adenium obesum',
                bench: 'Bancada Caudiciformes & Rocha',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '60% Pedrisco / 20% Cacos Cerâmicos / 20% Terra Vegetal',
                lastFertilization: C.addDaysISO(t, -32),
                fertCycleDays: 45,
                lastRepot: C.addMonthsISO(t, -18),
                repotCycleMonths: 24,
                lastStyling: C.addDaysISO(t, -40),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 12),
                nextInterventionType: 'Poda de ramificação apical dos galhos suculentos e selamento',
                notes: 'Cáudice basal escultural largo. Substrato de secagem ultra rápida; tolerância zero a encharcamento.',
                logs: [
                    { date: C.addDaysISO(t, -32), type: 'Adubação (+45d)', detail: 'Osmocote para cactos e suculentas' }
                ]
            },
            {
                id: 'B-022',
                popularName: 'Serissa variegata (Árvore-das-mil-estrelas)',
                scientificName: 'Serissa japonica \'Variegata\'',
                bench: 'Bancada Mame & Shohin',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco',
                lastFertilization: C.addDaysISO(t, -17),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -11),
                repotCycleMonths: 18,
                lastStyling: C.addDaysISO(t, -30),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 5),
                nextInterventionType: 'Pinçagem contínua para preservar padrão variegata e folhagem densa',
                notes: 'Flores brancas estreladas delicadas. Manter em local fixo sem oscilações bruscas de microclima.',
                logs: [
                    { date: C.addDaysISO(t, -17), type: 'Adubação (+30d)', detail: 'Bokashi suave em sachê' }
                ]
            },
            {
                id: 'B-023',
                popularName: 'Tamarindo',
                scientificName: 'Tamarindus indica',
                bench: 'Bancada Sol Pleno B',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '50% Caqueira / 30% Casca Pinus / 20% Pedrisco',
                lastFertilization: C.addDaysISO(t, -21),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -15),
                repotCycleMonths: 24,
                lastStyling: C.addDaysISO(t, -55),
                wiringDueDate: '',
                nextInterventionDate: C.addDaysISO(t, 9),
                nextInterventionType: 'Poda de seleção de ramificação alternada e aramação com ráfia',
                notes: 'Folhagem pinada leve que recolhe à noite. Tronco áspero de rápida lignificação.',
                logs: [
                    { date: C.addDaysISO(t, -21), type: 'Adubação (+30d)', detail: 'Adubação orgânica completa NPK' }
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
            lastPruning: p.lastPruning || '',
            wiringDueDate: p.wiringDueDate || '',
            nextInterventionDate: p.nextInterventionDate || '',
            nextInterventionType: String(p.nextInterventionType || p.nextInterventionNote || '').trim(),
            notes: String(p.notes || '').trim(),
            logs
        };
    }

    function ensurePersonalSpeciesSeeded(interactive = false) {
        const C = global.VaultCore;
        const initial = createInitialPlants();

        // Se o acervo contiver apenas as 6 plantas iniciais de teste antigas:
        const isLegacySample = plants.length <= 6 && plants.some((p) => p.popularName.includes('Shimpaku') || p.popularName.includes('Burgeriano'));
        if (isLegacySample) {
            plants = initial;
            saveData(false);
            if (interactive) C.toast('Acervo atualizado: 23 espécies do seu acervo sincronizadas!', 'success', 2500);
            return;
        }

        let addedCount = 0;
        initial.forEach((initP) => {
            const exists = plants.some((p) => {
                const pPop = (p.popularName || '').toLowerCase();
                const iPop = (initP.popularName || '').toLowerCase();
                const pSci = (p.scientificName || '').toLowerCase();
                const iSci = (initP.scientificName || '').toLowerCase();
                return (
                    pPop === iPop ||
                    (pPop.length > 4 && iPop.includes(pPop)) ||
                    (iPop.length > 4 && pPop.includes(iPop)) ||
                    (pSci && iSci && pSci === iSci)
                );
            });
            if (!exists) {
                const newId = generateNextId();
                const copy = { ...initP, id: newId };
                plants.push(normalizePlant(copy, plants.length));
                addedCount++;
            }
        });

        if (addedCount > 0) {
            saveData(false);
            if (interactive) C.toast(`${addedCount} nova(s) espécie(s) adicionada(s) ao acervo!`, 'success', 2500);
        } else if (interactive) {
            C.toast('Todas as 23 espécies já constam no seu acervo!', 'info', 2000);
        }
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
        ensurePersonalSpeciesSeeded(false);
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
                        <button type="button" id="btn-bonsai-ideal-procedure" class="min-h-[44px] px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-950/90 to-emerald-950/90 hover:from-cyan-900 hover:to-emerald-900 border border-cyan-400/50 text-cyan-200 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-cyan-950/40 transition" title="Diagnóstico Astrobotânico e Sazonal de Intervenções Ideais">
                            <i data-lucide="compass" class="w-4 h-4 text-cyan-300"></i>
                            <span>Procedimento Ideal</span>
                        </button>
                        <button type="button" id="btn-bonsai-guide" class="min-h-[44px] px-3.5 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition">
                            <i data-lucide="book-open" class="w-4 h-4 text-cyan-400"></i>
                            <span>Guia Botânico (40 Espécies)</span>
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
                    <!-- Régua de 12 Chips de Meses -->
                    <div class="flex items-center gap-1 overflow-x-auto pb-1 border-t border-slate-800/80 pt-2.5">
                        ${SEASONAL_CALENDAR_SH.map((m) => `
                            <button type="button" data-month-chip="${m.monthIndex}" class="month-chip px-2.5 py-1 rounded-md text-[11px] font-mono transition whitespace-nowrap ${m.monthIndex === selectedCalendarMonth ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'bg-[#090d16] text-slate-400 hover:text-slate-200 border border-slate-800'}">
                                ${m.name.slice(0, 3)}
                            </button>
                        `).join('')}
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

                        <!-- Seção de Poda, Aramação & Alerta de Desarme -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#090d16]/70 border border-slate-800/80 rounded-xl p-3">
                            <div>
                                <label class="block text-xs font-mono text-emerald-300 mb-1">Última Poda Realizada</label>
                                <input type="date" id="bf-last-pruning" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-100">
                                <span class="text-[10px] text-slate-400">Poda estrutural ou pinçagem</span>
                            </div>
                            <div>
                                <label class="block text-xs font-mono text-cyan-300 mb-1">Última Aramação</label>
                                <input type="date" id="bf-last-styling" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-100">
                            </div>
                            <div>
                                <label class="block text-xs font-mono text-cyan-300 mb-1">Limite de Desaramamento</label>
                                <input type="date" id="bf-wiring-due" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-100">
                                <span class="text-[10px] text-slate-400">Prevenção contra marcas</span>
                            </div>
                            <div>
                                <label class="block text-xs font-mono text-amber-300 mb-1">Próx. Manejo (Data &amp; Tipo)</label>
                                <div class="grid grid-cols-2 gap-1.5">
                                    <input type="date" id="bf-next-date" class="min-h-[44px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-[11px] text-slate-100">
                                    <input type="text" id="bf-next-type" placeholder="Ex: Pinçar" class="min-h-[44px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-slate-100">
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

            <!-- MODAL DO GUIA BOTÂNICO EXPANDIDO (40 ESPÉCIES) -->
            <div id="bonsai-guide-modal" class="hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto">
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
                    <div class="bg-[#0f172a] border-b border-[#1e293b] p-4 flex items-center justify-between shrink-0">
                        <div class="flex items-center gap-2">
                            <i data-lucide="book-open" class="w-5 h-5 text-cyan-400"></i>
                            <div>
                                <h3 class="text-base sm:text-lg font-bold text-slate-100">Guia Fitotécnico Avançado por Espécie</h3>
                                <p class="text-xs text-slate-400">40 Espécies Consagradas no Brasil • Parâmetros Sazonais do Hemisfério Sul</p>
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

            <!-- MODAL DE PROCEDIMENTO IDEAL (MOTOR ASTROBOTÂNICO & SAZONAL) -->
            <div id="bonsai-procedure-modal" class="hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 overflow-y-auto">
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
                    <!-- Cabeçalho Técnico -->
                    <div class="bg-[#0f172a] border-b border-[#1e293b] p-4 flex items-center justify-between shrink-0">
                        <div class="flex items-center gap-3">
                            <div class="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                                <i data-lucide="compass" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h3 class="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                                    <span>Motor de Decisão Fitotécnica • Procedimento Ideal</span>
                                    <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">Astrobotânica & Sazonalidade</span>
                                </h3>
                                <p class="text-xs text-slate-400">Cruzamento de Estação, Clima, Fase da Lua e Fisiologia das Espécies do Seu Acervo</p>
                            </div>
                        </div>
                        <button type="button" id="btn-procedure-modal-close" class="min-h-[40px] min-w-[40px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <!-- Banner Cósmico & Climático em Tempo Real -->
                    <div id="procedure-cosmic-banner" class="p-4 bg-[#090d16] border-b border-slate-800 shrink-0"></div>

                    <!-- Filtros Rápidos por Tipo de Procedimento -->
                    <div class="p-3 bg-[#0c1220] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 shrink-0">
                        <div class="flex flex-wrap items-center gap-1.5" id="procedure-filter-chips">
                            <button type="button" data-proc-filter="ALL" class="proc-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 text-slate-950 transition">Todas as Melhores</button>
                            <button type="button" data-proc-filter="ALPORQUIA" class="proc-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">Alporquia</button>
                            <button type="button" data-proc-filter="ESTAQUIA" class="proc-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">Estaquia</button>
                            <button type="button" data-proc-filter="RAIZES" class="proc-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">Poda & Lavagem de Raízes</button>
                            <button type="button" data-proc-filter="TRANSPLANTE" class="proc-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">Transplantes</button>
                            <button type="button" data-proc-filter="PODA_DRASTICA" class="proc-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">Poda Drástica</button>
                            <button type="button" data-proc-filter="PODA_RAMIFICACAO" class="proc-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">Pinçagem & Ramificação</button>
                            <button type="button" data-proc-filter="DESFOLHA" class="proc-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">Desfolha</button>
                            <button type="button" data-proc-filter="ESTRUTURA" class="proc-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">Aramação & Jin</button>
                            <button type="button" data-proc-filter="FITOSSANITARIO" class="proc-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">Calda Sulfocálcica</button>
                            <button type="button" data-proc-filter="NUTRICAO" class="proc-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">Indução Floral</button>
                        </div>
                        <div class="text-xs text-slate-400 font-mono" id="procedure-match-count">0 recomendações</div>
                    </div>

                    <!-- Conteúdo Rolável: Cards de Recomendações Cirúrgicas -->
                    <div id="procedure-recommendations-list" class="flex-1 overflow-y-auto p-4 space-y-4 max-h-[58vh]"></div>
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

    function updateMonthChipsUI() {
        document.querySelectorAll('.month-chip').forEach((btn) => {
            const idx = parseInt(btn.getAttribute('data-month-chip'), 10);
            const isAct = idx === selectedCalendarMonth;
            btn.className = `month-chip px-2.5 py-1 rounded-md text-[11px] font-mono transition whitespace-nowrap ${isAct ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm' : 'bg-[#090d16] text-slate-400 hover:text-slate-200 border border-slate-800'}`;
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

        // Próximas intervenções agendadas no acervo
        const upcomingInterventions = plants
            .filter((p) => p.nextInterventionDate)
            .sort((a, b) => a.nextInterventionDate.localeCompare(b.nextInterventionDate))
            .slice(0, 3);

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

            <!-- Próximas Intervenções Agendadas no Acervo -->
            ${upcomingInterventions.length > 0 ? `
                <div class="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
                    <div class="flex items-center justify-between">
                        <span class="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
                            <i data-lucide="calendar-clock" class="w-3.5 h-3.5"></i>
                            <span>Próximas Intervenções Agendadas do Acervo:</span>
                        </span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        ${upcomingInterventions.map((up) => {
                            const diff = C.daysDiffFromToday(up.nextInterventionDate);
                            return `
                                <div class="bg-[#090d16] border border-slate-800 rounded-lg p-2.5 flex items-center justify-between gap-2 text-xs">
                                    <div class="min-w-0">
                                        <div class="flex items-center gap-1.5">
                                            <span class="font-mono text-cyan-300 font-bold">${up.id}</span>
                                            <span class="text-slate-200 font-medium truncate">${up.popularName}</span>
                                        </div>
                                        <div class="text-[11px] text-amber-300/90 truncate mt-0.5">${up.nextInterventionType || 'Manejo agendado'}</div>
                                        <div class="text-[10px] font-mono text-slate-400">${C.formatDateBR(up.nextInterventionDate)} (${diff === 0 ? 'Hoje' : diff > 0 ? `em ${diff}d` : `atrasado ${Math.abs(diff)}d`})</div>
                                    </div>
                                    <button type="button" data-complete-intervention="${up.id}" title="Marcar como concluído hoje"
                                        class="px-2 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold shrink-0 transition">
                                        Concluir
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            ` : ''}
        `;

        const filterBtn = document.getElementById('btn-filter-seasonal-focus');
        if (filterBtn) {
            filterBtn.addEventListener('click', () => {
                filters.search = cal.speciesInFocus[0] || '';
                document.getElementById('bonsai-search').value = filters.search;
                renderPlantList();
            });
        }

        container.querySelectorAll('[data-complete-intervention]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-complete-intervention');
                const target = plants.find(p => p.id === id);
                if (!target) return;
                const today = C.todayISO();
                const type = target.nextInterventionType || 'Intervenção agendada';
                if (!Array.isArray(target.logs)) target.logs = [];
                target.logs.unshift({
                    date: today,
                    type: type,
                    detail: 'Concluído via painel sazonal'
                });
                target.nextInterventionDate = '';
                target.nextInterventionType = '';
                saveData(false);
                renderAll();
                C.toast(`Manejo de ${target.id} (${target.popularName}) marcado como concluído.`, 'success', 2200);
            });
        });

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

            const pPruningLogs = (p.logs || []).filter(lg => lg.type && (lg.type.toLowerCase().includes('poda') || lg.type.toLowerCase().includes('pinçagem') || lg.type.toLowerCase().includes('desfolha')));
            const derivedLastPrune = p.lastPruning || (pPruningLogs.length > 0 ? pPruningLogs[0].date : '');
            const pruneDiff = derivedLastPrune ? Math.abs(C.daysDiffFromToday(derivedLastPrune) || 0) : null;

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
                            <div class="text-xs italic text-slate-400 truncate">
                                ${C.esc(p.scientificName || p.pot)} • Vaso: ${C.esc(p.pot)}
                                ${pruneDiff !== null ? `<span class="ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 not-italic">✂ Poda há ${pruneDiff}d</span>` : ''}
                            </div>
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
                        <button type="button" data-quick-prune="${C.esc(p.id)}" title="Registrar Poda de Manutenção Hoje"
                            class="min-h-[42px] px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1 transition">
                            <i data-lucide="scissors" class="w-3.5 h-3.5"></i>
                            <span>Poda</span>
                        </button>
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

        container.querySelectorAll('[data-quick-prune]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-quick-prune');
                const target = plants.find((item) => item.id === id);
                if (!target) return;
                const today = C.todayISO();
                const moon = getMoonPhase();
                target.lastPruning = today;
                if (!Array.isArray(target.logs)) target.logs = [];
                target.logs.unshift({
                    date: today,
                    type: 'Poda de Manutenção / Pinçagem',
                    detail: `Poda rápida registrada sob ${moon.phaseName}`
                });
                saveData(false);
                renderAll();
                C.toast(`Poda rápida registrada em ${target.id} (${target.popularName}).`, 'success', 2200);
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
        document.getElementById('bf-last-pruning').value = existing ? (existing.lastPruning || '') : '';
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

    let modalLogsFilter = 'ALL';

    function renderModalLogs(plant) {
        const listEl = document.getElementById('bf-logs-list');
        if (!listEl) return;
        const C = global.VaultCore;
        if (!plant.logs || plant.logs.length === 0) {
            listEl.innerHTML = `<p class="text-xs text-slate-500 italic">Nenhum manejo registrado ainda.</p>`;
            return;
        }

        const pruningLogs = plant.logs.filter(lg => lg.type && (lg.type.toLowerCase().includes('poda') || lg.type.toLowerCase().includes('pinçagem') || lg.type.toLowerCase().includes('desfolha')));
        const fertLogs = plant.logs.filter(lg => lg.type && lg.type.toLowerCase().includes('adubação'));
        const repotLogs = plant.logs.filter(lg => lg.type && (lg.type.toLowerCase().includes('transplante') || lg.type.toLowerCase().includes('raiz')));

        let displayedLogs = plant.logs;
        if (modalLogsFilter === 'PRUNING') displayedLogs = pruningLogs;
        else if (modalLogsFilter === 'FERT') displayedLogs = fertLogs;
        else if (modalLogsFilter === 'REPOT') displayedLogs = repotLogs;

        const summaryHtml = `
            <div class="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-1.5 border-b border-slate-800">
                <span>Histórico: <strong>${plant.logs.length}</strong> manejos (<strong>${pruningLogs.length}</strong> podas)</span>
                <div class="flex items-center gap-1">
                    <button type="button" data-modal-log-filter="ALL" class="px-1.5 py-0.5 rounded text-[10px] ${modalLogsFilter === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'}">Todos</button>
                    <button type="button" data-modal-log-filter="PRUNING" class="px-1.5 py-0.5 rounded text-[10px] ${modalLogsFilter === 'PRUNING' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'}">Podas (${pruningLogs.length})</button>
                    <button type="button" data-modal-log-filter="FERT" class="px-1.5 py-0.5 rounded text-[10px] ${modalLogsFilter === 'FERT' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'}">Adubação (${fertLogs.length})</button>
                    <button type="button" data-modal-log-filter="REPOT" class="px-1.5 py-0.5 rounded text-[10px] ${modalLogsFilter === 'REPOT' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'}">Raízes (${repotLogs.length})</button>
                </div>
            </div>
        `;

        const logsHtml = displayedLogs.length === 0
            ? `<p class="text-xs text-slate-500 italic py-1">Nenhum registro nesta categoria.</p>`
            : displayedLogs.map((lg) => {
                const isPruning = lg.type && (lg.type.toLowerCase().includes('poda') || lg.type.toLowerCase().includes('pinçagem') || lg.type.toLowerCase().includes('desfolha'));
                const isFert = lg.type && lg.type.toLowerCase().includes('adubação');
                const isRepot = lg.type && (lg.type.toLowerCase().includes('transplante') || lg.type.toLowerCase().includes('raiz'));

                let badgeHtml = '';
                if (isPruning) badgeHtml = '<span class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Poda</span>';
                else if (isFert) badgeHtml = '<span class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">Adubação</span>';
                else if (isRepot) badgeHtml = '<span class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Raízes</span>';

                return `
                    <div class="flex items-center justify-between gap-2 text-xs bg-[#090d16] border border-slate-800 rounded px-2.5 py-1.5">
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="font-mono text-cyan-400">${C.formatDateBR(lg.date)}</span>
                            ${badgeHtml}
                            <span class="font-semibold text-slate-200">${C.esc(lg.type)}</span>
                            <span class="text-slate-400">— ${C.esc(lg.detail)}</span>
                        </div>
                    </div>
                `;
            }).join('');

        listEl.innerHTML = summaryHtml + `<div class="space-y-1 mt-1.5">${logsHtml}</div>`;

        listEl.querySelectorAll('[data-modal-log-filter]').forEach((btn) => {
            btn.addEventListener('click', () => {
                modalLogsFilter = btn.getAttribute('data-modal-log-filter');
                renderModalLogs(plant);
            });
        });
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
    // 8.1. MODAL DO PROCEDIMENTO IDEAL (ASTROBOTÂNICA EM AÇÃO)
    // =========================================================================
    function openProcedureModal() {
        const modal = document.getElementById('bonsai-procedure-modal');
        if (!modal) return;
        currentProcedureFilter = 'ALL';
        renderProcedureModal('ALL');
        modal.classList.remove('hidden');
        global.VaultCore.refreshIcons(modal);
    }

    function closeProcedureModal() {
        const modal = document.getElementById('bonsai-procedure-modal');
        if (modal) modal.classList.add('hidden');
    }

    function renderProcedureModal(filterCategory = 'ALL') {
        currentProcedureFilter = filterCategory;
        const C = global.VaultCore;
        const today = new Date();
        const moon = getMoonPhase(today);
        const seasonInfo = getSeasonAndClimate(today);

        document.querySelectorAll('.proc-filter-btn').forEach((btn) => {
            const cat = btn.getAttribute('data-proc-filter');
            if (cat === filterCategory) {
                btn.className = 'proc-filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 text-slate-950 transition';
            } else {
                btn.className = 'proc-filter-btn px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition';
            }
        });

        const bannerEl = document.getElementById('procedure-cosmic-banner');
        if (bannerEl) {
            bannerEl.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                    <div class="md:col-span-5 bg-[#0f172a] border border-[#1e293b] rounded-xl p-3.5 flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between">
                                <span class="text-[11px] font-mono uppercase tracking-wider text-slate-400">Fase Lunar em Tempo Real</span>
                                <div class="flex items-center gap-1">
                                    <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono ${moon.badgeCls}">${moon.moonAge}d do ciclo</span>
                                    <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Janela: +${moon.optimalWindowDays}d até ${moon.nextPhaseName}</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-2.5 mt-2">
                                <i data-lucide="${moon.phaseIcon}" class="w-6 h-6 text-amber-300"></i>
                                <div>
                                    <h4 class="text-base sm:text-lg font-bold text-slate-100">${moon.phaseName}</h4>
                                    <span class="text-xs text-slate-400 font-mono">${moon.illumination}% do disco iluminado</span>
                                </div>
                            </div>
                        </div>
                        <div class="mt-2.5 pt-2.5 border-t border-slate-800 text-xs text-slate-300">
                            <strong class="text-amber-300">Fisiologia Vascular:</strong> ${moon.sapDynamic}
                        </div>
                    </div>

                    <div class="md:col-span-7 bg-[#0f172a] border border-[#1e293b] rounded-xl p-3.5 flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between">
                                <span class="text-[11px] font-mono uppercase tracking-wider text-slate-400">Contexto Sazonal & Agroclimático</span>
                                <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Hemisfério Sul • Brasil</span>
                            </div>
                            <div class="flex items-center gap-2.5 mt-2">
                                <i data-lucide="sun-medium" class="w-6 h-6 text-emerald-400"></i>
                                <div>
                                    <h4 class="text-base sm:text-lg font-bold text-slate-100">${seasonInfo.season} (${C.formatDateBR(C.todayISO())})</h4>
                                    <p class="text-xs text-slate-300 italic">${seasonInfo.climate}</p>
                                </div>
                            </div>
                        </div>
                        <div class="mt-2.5 pt-2.5 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                            <span><strong class="text-cyan-300">Acervo Analisado:</strong> ${plants.length} plantas ativas</span>
                            <span class="text-slate-400">Cruzamento fisiológico multivariado</span>
                        </div>
                    </div>
                </div>

                <!-- Previsão Astrobotânica dos Próximos 14 Dias -->
                <div class="mt-3.5 pt-3 border-t border-slate-800/90 space-y-2">
                    <span class="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-semibold block">
                        Planejamento Fitotécnico das Próximas 2 Semanas (Janelas Cirúrgicas Futuras):
                    </span>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        ${[3, 7, 10, 14].map((offset) => {
                            const d = new Date();
                            d.setDate(d.getDate() + offset);
                            const mForecast = getMoonPhase(d);
                            let reco = '';
                            if (mForecast.phaseGroup === 'CRESCENTE') reco = 'Alporquias, estaquia e brotação';
                            else if (mForecast.phaseGroup === 'CHEIA') reco = 'Turgor alto: nutrição foliar e solo';
                            else if (mForecast.phaseGroup === 'MINGUANTE') reco = 'Poda de raízes e transplantes';
                            else reco = 'Poda drástica e esculturas';
                            return `
                                <div class="bg-[#0f172a] border border-slate-800 rounded-lg p-2.5 text-xs space-y-1">
                                    <div class="flex items-center justify-between text-[10px] font-mono">
                                        <span class="text-slate-400">+${offset}d (${C.formatDateBR(d.toISOString().slice(0, 10))})</span>
                                        <span class="px-1.5 py-0.2 rounded ${mForecast.badgeCls}">${mForecast.phaseGroup}</span>
                                    </div>
                                    <div class="font-bold text-slate-200 text-[11px] truncate">${mForecast.phaseName}</div>
                                    <div class="text-[10px] text-emerald-400 truncate">${reco}</div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }

        const allMatches = evaluateIdealProcedures(plants, today);
        const filtered = filterCategory === 'ALL'
            ? allMatches
            : allMatches.filter((m) => m.procedure.category === filterCategory);

        const countEl = document.getElementById('procedure-match-count');
        if (countEl) {
            countEl.textContent = `${filtered.length} intervenção(ões) altamente recomendada(s)`;
        }

        const listEl = document.getElementById('procedure-recommendations-list');
        if (!listEl) return;

        if (filtered.length === 0) {
            listEl.innerHTML = `
                <div class="p-8 text-center bg-[#090d16] border border-slate-800 rounded-xl space-y-2">
                    <i data-lucide="info" class="w-8 h-8 text-slate-500 mx-auto"></i>
                    <p class="text-sm font-semibold text-slate-300">Nenhuma intervenção com janela perfeita nesta categoria hoje.</p>
                    <p class="text-xs text-slate-500">A combinação de fase lunar e estágio das plantas não atinge o limiar seguro de 70% de compatibilidade para esta categoria. Selecione 'Todas as Melhores' para ver as janelas ativas.</p>
                </div>
            `;
            C.refreshIcons(listEl);
            return;
        }

        listEl.innerHTML = filtered.map((rec, idx) => {
            const p = rec.plant;
            const proc = rec.procedure;
            const isTop = idx === 0 && filterCategory === 'ALL';

            return `
                <div class="bg-[#0f172a] border ${isTop ? 'border-cyan-500/50 shadow-lg shadow-cyan-950/30' : 'border-[#1e293b]'} rounded-xl p-4 space-y-3.5">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 border-b border-slate-800 pb-3">
                        <div class="flex items-center gap-2.5 flex-wrap">
                            <span class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${rec.score >= 90 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'}">
                                ${rec.score}% COMPATIBILIDADE
                            </span>
                            <span class="px-2 py-0.5 rounded text-xs font-mono border ${proc.categoryBadge}">
                                ${C.esc(proc.title)}
                            </span>
                            ${isTop ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40">★ MELHOR JANELA CIRÚRGICA DE HOJE</span>' : ''}
                        </div>

                        <div class="text-xs font-mono text-slate-400">
                            Exemplar Alvo: <strong class="text-slate-100 font-semibold">[${p.id}] ${C.esc(p.popularName)}</strong>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
                        <div class="lg:col-span-4 bg-[#090d16] border border-slate-800 rounded-lg p-3 space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold text-slate-100">${C.esc(p.popularName)}</span>
                                <span class="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">${p.stage}</span>
                            </div>
                            <p class="text-[11px] italic text-slate-400">${C.esc(p.scientificName)}</p>
                            <div class="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-800/80">
                                <p><strong class="text-slate-400">Bancada:</strong> ${C.esc(p.bench)}</p>
                                <p><strong class="text-slate-400">Vaso Atual:</strong> ${C.esc(p.pot)}</p>
                                <p><strong class="text-slate-400">Último Transplante:</strong> ${C.formatDateBR(p.lastRepot)}</p>
                                <p><strong class="text-slate-400">Última Adubação:</strong> ${C.formatDateBR(p.lastFertilization)}</p>
                            </div>
                        </div>

                        <div class="lg:col-span-8 bg-[#090d16] border border-slate-800 rounded-lg p-3 space-y-2.5 flex flex-col justify-between">
                            <div>
                                <span class="text-[11px] font-mono uppercase tracking-wider text-amber-300 font-semibold block mb-1">
                                    Confluência Cósmica & Biológica (Por Que Agora?):
                                </span>
                                <p class="text-xs text-slate-200 leading-relaxed">${rec.whyNow}</p>
                            </div>

                            <div class="pt-2 border-t border-slate-800/80">
                                <span class="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-semibold block mb-1">
                                    Insumos e Ferramentas Recomendadas:
                                </span>
                                <p class="text-xs text-slate-400">${C.esc(proc.tools)}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-[#090d16]/70 border border-slate-800/80 rounded-lg p-3 space-y-2">
                        <span class="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-semibold block">
                            Protocolo de Execução Passo a Passo:
                        </span>
                        <ol class="list-decimal list-inside space-y-1 text-xs text-slate-300 leading-relaxed">
                            ${proc.steps.map((st) => `<li>${C.esc(st)}</li>`).join('')}
                        </ol>
                    </div>

                    <div class="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
                        <button type="button" data-sched-proc="${p.id}" data-proc-title="${C.esc(proc.title)}" class="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition">
                            <i data-lucide="clock" class="w-3.5 h-3.5 text-amber-400"></i>
                            <span>Agendar p/ Esta Semana</span>
                        </button>
                        <button type="button" data-apply-proc="${p.id}" data-proc-title="${C.esc(proc.title)}" data-proc-cat="${proc.category}" class="min-h-[38px] px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition">
                            <i data-lucide="check" class="w-4 h-4"></i>
                            <span>Registrar Execução no Histórico de ${p.id}</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        listEl.querySelectorAll('[data-apply-proc]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const pId = btn.getAttribute('data-apply-proc');
                const pTitle = btn.getAttribute('data-proc-title');
                const pCat = btn.getAttribute('data-proc-cat');
                applyProcedureToPlant(pId, pTitle, pCat);
            });
        });

        listEl.querySelectorAll('[data-sched-proc]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const pId = btn.getAttribute('data-sched-proc');
                const pTitle = btn.getAttribute('data-proc-title');
                scheduleProcedureForPlant(pId, pTitle);
            });
        });

        C.refreshIcons(listEl);
        if (bannerEl) C.refreshIcons(bannerEl);
    }

    function applyProcedureToPlant(plantId, procTitle, procCat) {
        const C = global.VaultCore;
        const target = plants.find((p) => p.id === plantId);
        if (!target) return;

        if (procCat === 'TRANSPLANTE' || procCat === 'RAIZES') {
            target.lastRepot = C.todayISO();
        } else if (procCat === 'ESTRUTURA') {
            target.lastStyling = C.todayISO();
        } else if (procCat === 'PODA_DRASTICA' || procCat === 'PODA_RAMIFICACAO' || procCat === 'DESFOLHA' || procCat === 'PINCAGEM') {
            target.lastPruning = C.todayISO();
        } else if (procCat === 'NUTRICAO') {
            target.lastFertilization = C.todayISO();
        }

        const moon = getMoonPhase();
        if (!Array.isArray(target.logs)) target.logs = [];
        target.logs.unshift({
            date: C.todayISO(),
            type: procTitle,
            detail: `Procedimento ideal executado sob alinhamento fitotécnico de ${moon.phaseName}.`
        });

        saveData(false);
        renderAll();
        renderProcedureModal(currentProcedureFilter);
        C.toast(`Intervenção '${procTitle}' registrada com sucesso no histórico de ${target.popularName} (${target.id})!`, 'success', 3000);
    }

    function scheduleProcedureForPlant(plantId, procTitle) {
        const C = global.VaultCore;
        const target = plants.find((p) => p.id === plantId);
        if (!target) return;

        target.nextInterventionDate = C.addDaysISO(C.todayISO(), 3);
        target.nextInterventionType = procTitle;

        saveData(false);
        renderAll();
        renderProcedureModal(currentProcedureFilter);
        C.toast(`Intervenção '${procTitle}' agendada para daqui a 3 dias em ${target.popularName}!`, 'info', 2500);
    }

    // =========================================================================
    // 9. LISTENERS & INICIALIZAÇÃO
    // =========================================================================
    function bindEvents() {
        const C = global.VaultCore;

        const btnIdealProc = document.getElementById('btn-bonsai-ideal-procedure');
        if (btnIdealProc) {
            btnIdealProc.addEventListener('click', openProcedureModal);
        }

        const btnProcClose = document.getElementById('btn-procedure-modal-close');
        if (btnProcClose) {
            btnProcClose.addEventListener('click', closeProcedureModal);
        }

        document.querySelectorAll('.proc-filter-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const cat = btn.getAttribute('data-proc-filter');
                renderProcedureModal(cat);
            });
        });

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
                updateMonthChipsUI();
                renderSeasonalPanel();
            });
        }

        document.querySelectorAll('[data-month-chip]').forEach((btn) => {
            btn.addEventListener('click', () => {
                selectedCalendarMonth = parseInt(btn.getAttribute('data-month-chip'), 10);
                if (seasonSelect) seasonSelect.value = String(selectedCalendarMonth);
                updateMonthChipsUI();
                renderSeasonalPanel();
            });
        });

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
            const logDate = C.todayISO();
            target.logs.unshift({
                date: logDate,
                type: cat,
                detail: inp.value.trim()
            });
            if (cat.toLowerCase().includes('poda') || cat.toLowerCase().includes('pinçagem') || cat.toLowerCase().includes('desfolha')) {
                target.lastPruning = logDate;
            }
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
                lastPruning: document.getElementById('bf-last-pruning').value,
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
