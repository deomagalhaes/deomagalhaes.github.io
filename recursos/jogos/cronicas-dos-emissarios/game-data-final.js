// ===== CRÔNICAS DOS EMISSÁRIOS - DADOS DO JOGO (VERSÃO FINAL) =====
// Arquivo modular para fácil atualização de conteúdo

const GAME_DATA = {
    // ===== CONFIGURAÇÕES BÁSICAS =====
    version: "2.1.0",
    saveKey: 'emissariesChroniclesSave_v2',
    
    // ===== POÇÕES E RECEITAS =====
    potions: {
        alegria: { name: 'Alegria', color: '#FBBF24', emoji: '😄', description: 'Essência dourada da felicidade pura' },
        tristeza: { name: 'Tristeza', color: '#60A5FA', emoji: '😢', description: 'Lágrimas cristalinas da melancolia' },
        raiva: { name: 'Raiva', color: '#F87171', emoji: '😠', description: 'Chamas ardentes da indignação' },
        medo: { name: 'Medo', color: '#A855F7', emoji: '😨', description: 'Sombras violetas da incerteza' },
        surpresa: { name: 'Surpresa', color: '#34D399', emoji: '😮', description: 'Faíscas verdes do inesperado' },
        calma: { name: 'Calma', color: '#818CF8', emoji: '😌', description: 'Brisa serena da tranquilidade' },
        esperança: { name: 'Esperança', color: '#FDE047', emoji: '🌟', description: 'Luz dourada do amanhã' },
        compaixao: { name: 'Compaixão', color: '#FB7185', emoji: '💝', description: 'Calor rosado do coração' },
        sabedoria: { name: 'Sabedoria', color: '#A78BFA', emoji: '🦉', description: 'Conhecimento ancestral cristalizado' }
    },

    recipes: {
        'EMPATIA': { 
            ingredients: ['tristeza', 'calma'], 
            emoji: '🤝', 
            description: 'A capacidade de compreender e compartilhar os sentimentos alheios',
            effect: 'Permite entender profundamente as emoções dos outros',
            hint: 'Dica: Para entender os outros, precisamos da serenidade da CALMA e da profundidade da TRISTEZA.'
        },
            'GRATIDAO': { 
            ingredients: ['alegria', 'sabedoria'], 
            emoji: '🙏', 
            description: 'O reconhecimento das bênçãos e alegrias do passado, mesmo diante da perda.',
            effect: 'Transforma sentimentos de arrependimento e tristeza em aceitação e paz.',
            hint: 'Dica: A gratidão floresce quando a ALEGRIA de uma memória é vista através da lente da SABEDORIA.'
        },

        'PACIENCIA': { 
            ingredients: ['raiva', 'calma'], 
            emoji: '🧘', 
            description: 'A virtude de manter a serenidade diante das adversidades',
            effect: 'Concede resistência a provocações e impulsos destrutivos',
            hint: 'Dica: A paciência nasce quando transformamos a RAIVA através da CALMA.'
        },
        'CORAGEM': { 
            ingredients: ['medo', 'alegria'], 
            emoji: '🦁', 
            description: 'A força para enfrentar o desconhecido com determinação',
            effect: 'Permite superar medos e tomar decisões difíceis',
            hint: 'Dica: A coragem surge quando enfrentamos o MEDO com a força da ALEGRIA.'
        },
        'ESPERANCA': { 
            ingredients: ['tristeza', 'esperança'], 
            emoji: '🌅', 
            description: 'A luz que brilha mesmo nas horas mais sombrias',
            effect: 'Restaura a fé no futuro e nas possibilidades',
            hint: 'Dica: A esperança verdadeira nasce da TRISTEZA transformada pela própria ESPERANÇA.'
        },
        'PERDAO': { 
            ingredients: ['raiva', 'compaixao'], 
            emoji: '🕊️', 
            description: 'A libertação do peso do ressentimento',
            effect: 'Cura feridas emocionais e restaura relacionamentos',
            hint: 'Dica: O perdão acontece quando a RAIVA é suavizada pela COMPAIXÃO.'
        },
        'AUTOCONFIANCA': { 
            ingredients: ['medo', 'sabedoria'], 
            emoji: '💪', 
            description: 'A força interior que vem do autoconhecimento',
            effect: 'Fortalece a autoestima e a determinação',
            hint: 'Dica: A autoconfiança cresce quando o MEDO é iluminado pela SABEDORIA.'
        },
        'GRATIDAO': { 
            ingredients: ['alegria', 'sabedoria'], 
            emoji: '🙏', 
            description: 'O reconhecimento das bênçãos da vida',
            effect: 'Transforma perspectivas e atrai positividade',
            hint: 'Dica: A gratidão floresce quando a ALEGRIA encontra a SABEDORIA.'
        },
        'SABEDORIA': { 
            ingredients: ['esperança', 'medo'], 
            emoji: '🦉', 
            description: 'A clareza que surge ao encarar a incerteza com esperança',
            effect: 'Permite ver soluções além das dualidades e dos dilemas',
            hint: 'Dica: A verdadeira sabedoria não é a ausência de MEDO, mas a capacidade de agir com ESPERANÇA apesar dele.'
        },
        'HARMONIA': { 
            ingredients: ['calma', 'compaixao'], 
            emoji: '☯️', 
            description: 'O equilíbrio perfeito entre todas as forças',
            effect: 'Restaura o equilíbrio natural e a paz interior',
            hint: 'Dica: A harmonia nasce da união entre CALMA e COMPAIXÃO.'
        }
    },

    // ===== ITENS E FERRAMENTAS =====
    items: {
        diario_empatia: {
            name: 'Diário da Empatia',
            emoji: '📖',
            description: 'Um livro mágico que registra automaticamente as histórias e sentimentos das pessoas que você conhece.',
            type: 'knowledge',
            effect: 'Permite revisar informações sobre personagens encontrados'
        },
        lente_compreensao: {
            name: 'Lente da Compreensão',
            emoji: '🔍',
            description: 'Uma lente cristalina que revela as motivações ocultas por trás das ações das pessoas.',
            type: 'detector',
            effect: 'Mostra informações adicionais sobre NPCs e suas necessidades'
        },
        cristal_harmonia: {
            name: 'Cristal da Harmonia',
            emoji: '💎',
            description: 'Um cristal que brilha na presença de conflitos emocionais, ajudando a identificar onde sua ajuda é necessária.',
            type: 'detector',
            effect: 'Detecta conflitos próximos e sugere soluções'
        },
        pergaminho_sabedoria: {
            name: 'Pergaminho da Sabedoria',
            emoji: '📜',
            description: 'Contém citações e conselhos de grandes sábios sobre resolução de conflitos e inteligência emocional.',
            type: 'knowledge',
            effect: 'Fornece dicas úteis durante diálogos difíceis'
        },
        amuleto_protecao: {
            name: 'Amuleto de Proteção',
            emoji: '🛡️',
            description: 'Um amuleto encantado que protege contra a absorção de emoções negativas durante conflitos intensos.',
            type: 'protection',
            effect: 'Reduz o impacto de emoções destrutivas'
        },
        semente_esperanca: {
            name: 'Semente da Esperança',
            emoji: '🌱',
            description: 'Uma semente mágica que cresce em lugares onde a harmonia foi restaurada.',
            type: 'special',
            effect: 'Simboliza a renovação e o crescimento após conflitos resolvidos'
        }
    },

    // ===== CENÁRIOS E LOCAIS =====
    scenarios: {
        VilaDaForja: {
            name: 'Vila da Forja',
            mapId: 'elara',
            level: 1,
            emoji: '🏘️',
            description: 'Uma vila acolhedora onde o som dos martelos ecoa pelas ruas de pedra. O aroma de metal quente e pão fresco se mistura no ar. Aqui, artesãos dedicados criam não apenas ferramentas, mas também laços de comunidade.',
            background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #CD853F 100%)',
            music: 'village_theme',
            connections: ['FlorestasSussurrantes', 'MercadoCentral'],
            npcs: ['balthazar', 'elena_ferreiro'],
            quests: ['ferreiro_sobrecarregado', 'rivalidade_artesaos'],
            firstVisit: true
        },
        
        FlorestasSussurrantes: {
            name: 'Florestas Sussurrantes',
            mapId: 'elara',
            level: 2,
            emoji: '🌲',
            description: 'Uma floresta mística onde as árvores antigas guardam segredos milenares. A luz filtrada pelas copas cria padrões dançantes no chão coberto de musgo. Sussurros de sabedoria ecoam entre as folhas, e a própria natureza parece viva e consciente.',
            background: 'linear-gradient(135deg, #228B22 0%, #32CD32 50%, #90EE90 100%)',
            music: 'forest_theme',
            connections: ['VilaDaForja', 'MontanhasCristalinas'],
            npcs: ['guardiao_floresta', 'crianca_perdida'],
            quests: ['equilibrio_natural', 'medo_escuridao'],
            firstVisit: false
        },

        MercadoCentral: {
            name: 'Mercado Central',
            mapId: 'elara',
            level: 2,
            emoji: '🏪',
            description: 'O coração comercial de Elara, onde mercadores de todas as terras se reúnem. Barracas coloridas exibem produtos exóticos, enquanto o burburinho de negociações e risadas preenche o ar. Aqui, cada transação é uma oportunidade de conexão humana.',
            background: 'linear-gradient(135deg, #FF6347 0%, #FFD700 50%, #FF8C00 100%)',
            music: 'market_theme',
            connections: ['VilaDaForja', 'LagoReflexos'],
            npcs: ['marcus_mercador', 'sofia_comerciante'],
            quests: ['rivalidade_mercadores', 'rivalidade_mercadores_sofia', 'cliente_insatisfeito'],
            firstVisit: false
        },

        MontanhasCristalinas: {
            name: 'Montanhas Cristalinas',
            mapId: 'elara',
            level: 3,
            emoji: '⛰️',
            description: 'Picos majestosos onde cristais mágicos crescem das rochas milenares. O ar rarefeito carrega ecos de cantos ancestrais e a energia pura da terra. Aqui, a solidão ensina lições profundas sobre força interior e autoconhecimento.',
            background: 'linear-gradient(135deg, #4682B4 0%, #87CEEB 50%, #E0F6FF 100%)',
            music: 'mountain_theme',
            connections: ['FlorestasSussurrantes', 'CidadeFlutuante'],
            npcs: ['ermitao_sabio', 'minerador_solitario'],
            quests: ['busca_interior', 'medo_alturas'],
            firstVisit: false
        },

        LagoReflexos: {
            name: 'Lago dos Reflexos',
            mapId: 'elara',
            level: 3,
            emoji: '🏞️',
            description: 'Um lago sereno cujas águas cristalinas refletem não apenas rostos, mas também verdades interiores. Aqui, a contemplação silenciosa revela respostas que a mente agitada não consegue encontrar. As águas sussurram segredos do coração.',
            background: 'linear-gradient(135deg, #4169E1 0%, #87CEFA 50%, #E6F3FF 100%)',
            music: 'lake_theme',
            connections: ['MercadoCentral', 'DesertoIlusoes'],
            npcs: ['oraculo_aguas', 'pescador_filosofo'],
            quests: ['verdade_interior', 'reconciliacao_passado'],
            firstVisit: false
        },

        CidadeFlutuante: {
            name: 'Cidade Flutuante',
            mapId: 'elara',
            level: 4,
            emoji: '🏰',
            description: 'Uma cidade mágica suspensa nas nuvens, onde a arquitetura desafia a gravidade e a imaginação. Pontes de luz conectam torres etéreas, e o conhecimento flui como o vento entre os habitantes que escolheram viver acima das limitações terrestres.',
            background: 'linear-gradient(135deg, #9370DB 0%, #BA55D3 50%, #DDA0DD 100%)',
            music: 'floating_theme',
            connections: ['MontanhasCristalinas', 'TorreSabedoria'],
            npcs: ['arquiteto_sonhos', 'estudante_voador'],
            quests: ['medo_voar', 'construcao_impossivel'],
            firstVisit: false
        },

        DesertoIlusoes: {
            name: 'Deserto das Ilusões',
            mapId: 'elara',
            level: 4,
            emoji: '🏜️',
            description: 'Um deserto onde miragens revelam desejos ocultos e medos reprimidos. As dunas douradas guardam segredos sobre a natureza da realidade e da percepção. Aqui, a verdade se esconde atrás de véus de areia e luz.',
            background: 'linear-gradient(135deg, #DAA520 0%, #F4A460 50%, #FFEBCD 100%)',
            music: 'desert_theme',
            connections: ['LagoReflexos', 'CavernasEcoantes'],
            npcs: ['nomade_visionario', 'mercador_ilusoes'],
            quests: ['realidade_ilusao', 'sede_conhecimento'],
            firstVisit: false
        },

        CavernasEcoantes: {
            name: 'Cavernas Ecoantes',
            mapId: 'elara',
            level: 5,
            emoji: '🕳️',
            description: 'Cavernas profundas onde cada palavra ressoa com poder ancestral. As paredes de cristal amplificam não apenas sons, mas também emoções e memórias. Aqui, o silêncio tem voz e os ecos revelam verdades esquecidas.',
            background: 'linear-gradient(135deg, #2F4F4F 0%, #696969 50%, #A9A9A9 100%)',
            music: 'cave_theme',
            connections: ['DesertoIlusoes', 'TorreSabedoria'],
            npcs: ['guardiao_ecos', 'crianca_eco'],
            quests: ['silencio_interior', 'eco_perdido'],
            firstVisit: false
        },

        TorreSabedoria: {
            name: 'Torre da Sabedoria',
            mapId: 'elara',
            level: 6,
            emoji: '🗼',
            description: 'A torre mais alta de Elara, onde os maiores sábios estudam os mistérios da existência. Cada andar revela um novo nível de compreensão sobre a natureza humana, e no topo, a sabedoria suprema aguarda aqueles dignos de alcançá-la.',
            background: 'linear-gradient(135deg, #4B0082 0%, #663399 50%, #9370DB 100%)',
            music: 'wisdom_theme',
            connections: ['CidadeFlutuante', 'CavernasEcoantes'],
            npcs: ['mestre_sabedoria', 'bibliotecario_antigo'],
            quests: ['teste_sabedoria', 'conhecimento_supremo'],
            firstVisit: false
        }
    },

    // ===== PERSONAGENS (NPCs) =====
    characters: {
        balthazar: {
            name: 'Balthazar',
            title: 'Mestre Ferreiro',
            emoji: '👨‍🔧',
            description: 'Um ferreiro experiente com mãos calejadas e coração generoso. Seus olhos cansados revelam o peso de muitas responsabilidades, mas sua dedicação ao ofício nunca vacila.',
            personality: 'Trabalhador, dedicado, mas sobrecarregado. Tem dificuldade em delegar tarefas e aceitar ajuda.',
            background: 'Trabalha na forja há 30 anos. Recentemente perdeu dois aprendizes que se mudaram para a capital em busca de melhores oportunidades.',
            currentProblem: 'Está sobrecarregado com pedidos e não consegue manter a qualidade de seu trabalho, sentindo-se frustrado e exausto.',
            questId: 'ferreiro_sobrecarregado'
        },

                mestre_sabedoria: {
            name: 'Lyra',
            title: 'Mestra da Sabedoria',
            emoji: '👑',
            description: 'Uma figura serena cuja idade é impossível de determinar. Ela não se senta em um trono, mas em um simples assento no centro de uma biblioteca circular, sob um teto de estrelas. Sua presença irradia uma calma e clareza absolutas.',
            personality: 'Sábia, observadora e profundamente empática. Ela fala com gentileza, mas cada palavra carrega o peso do conhecimento. Ela não julga, apenas compreende.',
            background: 'Lyra é a Emissária original, a primeira a perceber que os conflitos de Elara não nasciam da maldade, mas da dor. Ela fundou a Torre para preservar o conhecimento e guiar as futuras gerações de Emissários. Ela observou toda a jornada do jogador em silêncio.',
            currentProblem: 'Nenhum problema pessoal. Seu "desafio" para o jogador é um teste final: verificar se ele realmente absorveu as lições de sua jornada e se está pronto para carregar o manto de um verdadeiro Sábio Empático.',
            questId: 'conhecimento_supremo'
        },

                guardiao_ecos: {
            name: 'Silas',
            title: 'Guardião dos Ecos',
            emoji: '🗿',
            description: 'Uma entidade feita de pedra e cristal, cujos contornos mudam suavemente. Ele não fala com uma boca, mas com os ecos da própria caverna. Ele é a personificação de todas as palavras não ditas e sentimentos reprimidos que buscaram refúgio ali.',
            personality: 'Solitário, melancólico e sobrecarregado. Ele carrega o peso de incontáveis arrependimentos e segredos que não são seus, o que o deixou quase paralisado por uma tristeza empática.',
            background: 'Silas nasceu do primeiro segredo sussurrado nesta caverna. Ao longo dos milênios, ele absorveu todos os ecos de palavras de amor nunca declaradas, pedidos de desculpas nunca feitos e verdades nunca reveladas. Agora, o peso de tantos sentimentos reprimidos está se tornando insuportável.',
            currentProblem: 'Ele está sobrecarregado com um "eco" de profunda tristeza de alguém que nunca conseguiu expressar seu perdão. A intensidade desse eco está desestabilizando a caverna e o próprio Silas, que não consegue mais distinguir suas emoções das dos outros.',
            questId: 'eco_perdido'
        },

                nomade_visionario: {
            name: 'Zara',
            title: 'Nômade Visionária',
            emoji: '🏜️',
            description: 'Uma mulher cujos olhos refletem o vasto céu do deserto. Ela se move com as dunas, tratando as miragens não como enganos, mas como possibilidades. Sua fala é enigmática, como o próprio deserto.',
            personality: 'Sábia, enigmática e desapegada. Ela vê a verdade e a ilusão como duas faces da mesma moeda e acredita que as pessoas se apegam a ilusões por necessidade.',
            background: 'Zara e seu clã eram guardiões de um oásis real. Uma grande seca o destruiu, forçando seu povo a se dispersar. Em vez de se lamentar, Zara abraçou o deserto e suas ilusões, encontrando uma nova forma de sabedoria na aceitação da impermanência.',
            currentProblem: 'Ela encontrou um jovem mercador que vende "Água de Miragem" (uma ilusão de alívio) para viajantes sedentos. Zara não sabe se deve intervir e destruir a ilusão reconfortante do mercador ou permitir que ele continue, pois entende a dor que o levou a criar essa farsa.',
            questId: 'realidade_ilusao'
        },

                arquiteto_sonhos: {
            name: 'Icarus',
            title: 'Arquiteto de Sonhos',
            emoji: '🏛️',
            description: 'Um arquiteto genial, responsável por projetar as magníficas torres flutuantes da cidade. Ele está sempre olhando para cima, mas seus ombros estão curvados pelo peso de suas ambições.',
            personality: 'Visionário e perfeccionista, mas atormentado pela ansiedade. Ele tem um medo paralisante de que suas criações, que desafiam a gravidade, possam um dia desabar.',
            background: 'Icarus herdou o título de Arquiteto-Chefe de sua mentora, que construiu as fundações da cidade. Ele se sente na obrigação de superar o trabalho dela, o que o leva a projetar estruturas cada vez mais ousadas e instáveis.',
            currentProblem: 'Ele está paralisado pelo medo de uma falha catastrófica. Esse medo o impede de aprovar a construção de uma nova e necessária ponte de luz que conectaria a cidade a uma área de estudos, isolando uma parte da comunidade.',
            questId: 'construcao_impossivel'
        },


        pescador_filosofo: {
            name: 'Nereus',
            title: 'Pescador Filósofo',
            emoji: '🎣',
            description: 'Um pescador idoso que passa seus dias olhando para as águas do Lago dos Reflexos. Ele raramente pesca peixes; em vez disso, parece estar pescando memórias e pensamentos perdidos.',
            personality: 'Melancólico, pensativo e gentil. Carrega um grande peso em seu coração, o que o torna distante, mas não hostil.',
            background: 'Em sua juventude, Nereus teve uma forte discussão com seu melhor amigo por um mal-entendido. O amigo partiu em uma longa viagem e nunca mais voltou. Nereus vive com o arrependimento de nunca ter se desculpado.',
            currentProblem: 'Ele está preso no passado, incapaz de se perdoar pelo que aconteceu. O reflexo no lago só lhe mostra o rosto de seu eu mais jovem e raivoso, impedindo-o de seguir em frente.',
            questId: 'reconciliacao_passado'
        },


        elena_ferreiro: {
            name: 'Elena',
            title: 'Jovem Artesã',
            emoji: '👩‍🔧',
            description: 'Uma jovem talentosa que trabalha com metais preciosos. Seus olhos brilham com paixão pela arte, mas também com a frustração de quem sente que seu potencial não é reconhecido.',
            personality: 'Ambiciosa, criativa, mas impaciente. Quer provar seu valor rapidamente e às vezes age de forma precipitada.',
            background: 'Filha de um ferreiro de outra vila. Veio para aprender com Balthazar, mas sente que não está progredindo na velocidade que gostaria.',
            currentProblem: 'Sente-se subestimada e em conflito com outros artesãos mais experientes, criando tensão no ambiente de trabalho.',
            questId: 'rivalidade_artesaos'
        },

        guardiao_floresta: {
            name: 'Sylvanus',
            title: 'Guardião da Floresta',
            emoji: '🧙‍♂️',
            description: 'Um ser ancestral que protege a floresta há séculos. Sua sabedoria é profunda como as raízes das árvores antigas, mas sua paciência com os humanos está se esgotando devido aos danos causados à natureza.',
            personality: 'Sábio, protetor, mas crescentemente desconfiado dos humanos. Luta entre seu amor pela natureza e sua responsabilidade de coexistir.',
            background: 'Testemunhou a destruição de muitas florestas ao longo dos séculos. Viu espécies desaparecerem e ecossistemas serem devastados pela ganância humana.',
            currentProblem: 'Conflito interno entre preservar a floresta a qualquer custo e encontrar uma forma de coexistência harmoniosa com os humanos.',
            questId: 'equilibrio_natural'
        },

        crianca_perdida: {
            name: 'Lily',
            title: 'Criança Perdida',
            emoji: '👧',
            description: 'Uma menina de 8 anos que se perdeu na floresta enquanto colhia flores. Seus olhos estão cheios de lágrimas e medo, mas há uma centelha de coragem esperando para ser despertada.',
            personality: 'Assustada, vulnerável, mas corajosa no fundo. Tem um coração puro e uma conexão natural com a natureza.',
            background: 'Saiu para colher flores silvestres para decorar o quarto da mãe doente, mas se perdeu quando a noite chegou mais cedo que o esperado.',
            currentProblem: 'Está perdida na floresta escura e tem muito medo dos ruídos noturnos e das sombras entre as árvores.',
            questId: 'medo_escuridao'
        },

        marcus_mercador: {
            name: 'Marcus',
            title: 'Mercador Veterano',
            emoji: '👨‍💼',
            description: 'Um comerciante experiente que domina o mercado há décadas. Sua barba grisalha e olhar perspicaz revelam anos de negociações bem-sucedidas, mas também uma resistência crescente às mudanças.',
            personality: 'Orgulhoso, competitivo, mas justo no fundo. Valoriza tradições e tem dificuldade em aceitar inovações que considera arriscadas.',
            background: 'Construiu seu império comercial do zero, começando como um simples vendedor ambulante. Vê Sofia como uma ameaça ao seu legado e às tradições do mercado.',
            currentProblem: 'Rivalidade destrutiva com Sofia está prejudicando ambos os negócios e criando um ambiente tóxico no mercado.',
            questId: 'rivalidade_mercadores'
        },

                ermitao_sabio: {
            name: 'Kaelen',
            title: 'Ermitão Sábio',
            emoji: '🧘‍♂️',
            description: 'Um homem de idade indefinida, com olhos que parecem conter a vastidão do céu. Ele vive em solidão nas Montanhas Cristalinas, não por odiar o mundo, mas por amá-lo o suficiente para querer compreendê-lo de longe.',
            personality: 'Calmo, introspectivo e enigmático. Fala em frases curtas e profundas, incentivando mais a reflexão do que dando respostas diretas.',
            background: 'Antigamente, Kaelen era um conselheiro de reis, mas se desiludiu com o poder e a política. Ele se retirou para as montanhas em busca de sabedoria interior e para se libertar das amarras do próprio ego e das expectativas alheias.',
            currentProblem: 'Ele busca a autoconfiança final para se libertar de um antigo medo: o medo de que sua sabedoria seja inútil para o mundo. Ele precisa de ajuda para fortalecer sua convicção interior.',
            questId: 'busca_interior'
        },


        sofia_comerciante: {
            name: 'Sofia',
            title: 'Comerciante Inovadora',
            emoji: '👩‍💼',
            description: 'Uma jovem empreendedora com ideias revolucionárias para o comércio. Seus olhos brilham com visão de futuro, mas sua impaciência com métodos antigos causa atritos constantes.',
            personality: 'Inovadora, energética, mas às vezes desrespeitosa com tradições. Acredita que mudança é sempre melhor, mesmo quando não é necessária.',
            background: 'Veio da capital com novas técnicas de negócio e tecnologias comerciais. Quer modernizar o mercado tradicional, mas não compreende o valor das práticas estabelecidas.',
            currentProblem: 'Conflito com Marcus está impedindo suas inovações de serem aceitas e criando divisões entre os comerciantes locais.',
            questId: 'rivalidade_mercadores_sofia'
        }
    },

    // ===== MISSÕES (QUESTS) =====
    quests: {
        ferreiro_sobrecarregado: {
            id: 'ferreiro_sobrecarregado',
            title: 'O Fardo do Mestre',
            description: 'Ajude Balthazar a lidar com sua sobrecarga de trabalho e encontrar um equilíbrio saudável entre responsabilidade e bem-estar.',
            scenario: 'VilaDaForja',
            npc: 'balthazar',
            type: 'emotional_support',
            difficulty: 'beginner',
            requiredPotion: 'PACIENCIA',
            status: 'available',
            objectives: [
                'Converse com Balthazar sobre seus problemas',
                'Crie a poção PACIÊNCIA no mini-game',
                'Ajude-o a aceitar ajuda de outros'
            ],
            rewards: {
                experience: 100,
                items: ['lente_compreensao'],
                newLocation: 'FlorestasSussurrantes'
            },
            dialogueTree: {
                start: {
                    text: "Ah, um Emissário! Que bom que chegou... Estou com tantos pedidos que mal consigo respirar. Talvez você possa me ajudar a encontrar uma solução?",
                    options: [
                        { text: "Conte-me sobre seus problemas", next: "problem_explanation" },
                        { text: "Vejo que está sobrecarregado", next: "empathy_response" }
                    ]
                },
                problem_explanation: {
                    text: "Veja só, tenho pedidos para três semanas, mas apenas duas mãos. Meus antigos aprendizes partiram, e eu... bem, sempre fui teimoso demais para pedir ajuda.",
                    options: [
                        { text: "Que tal treinar novos aprendizes?", next: "suggestion_apprentices" },
                        { text: "Você precisa de uma poção para ter paciência", next: "minigame_trigger" }
                    ]
                },
                empathy_response: {
                    text: "É... você entende. Às vezes sinto que vou desabar sob o peso de todas essas responsabilidades.",
                    options: [
                        { text: "Vamos criar uma poção para te ajudar", next: "minigame_trigger" }
                    ]
                },
                suggestion_apprentices: {
                    text: "Treinar novos aprendizes... você tem razão, mas preciso de paciência para isso. Ando tão irritado ultimamente...",
                    options: [
                        { text: "Posso ajudar com uma poção da paciência", next: "minigame_trigger" }
                    ]
                },
                minigame_trigger: {
                    text: "Uma poção da paciência? Isso seria perfeito! Você sabe como fazer?",
                    options: [
                        { text: "Vamos ao caldeirão!", next: "minigame_start" }
                    ]
                },
                minigame_success: {
                    text: "Incrível! Sinto uma calma que não tinha há meses. Você tem razão - preciso aceitar ajuda e treinar novos aprendizes. Obrigado, Emissário!",
                    options: [
                        { text: "Fico feliz em ter ajudado!", next: "quest_complete" }
                    ]
                },
                quest_complete: {
                    text: "Você me ensinou uma lição valiosa sobre aceitar ajuda. Como recompensa, tome esta Lente da Compreensão. E ouvi dizer que há problemas na Floresta Sussurrante... talvez precise de você lá.",
                    options: [],
                    reward: true
                }
            }
        },

                conhecimento_supremo: {
            id: 'conhecimento_supremo',
            title: 'O Conhecimento Supremo',
            description: 'Converse com Lyra, a Mestra da Sabedoria, e prove que você compreendeu a verdadeira natureza da empatia para completar sua jornada.',
            scenario: 'TorreSabedoria',
            npc: 'mestre_sabedoria',
            type: 'validation',
            difficulty: 'final',
            requiredPotion: null, // Nenhuma poção necessária
            status: 'available',
            objectives: [
                'Alcançar o topo da Torre da Sabedoria',
                'Responder às perguntas da Mestra Lyra',
                'Demonstrar a sabedoria adquirida em sua jornada'
            ],
            rewards: {
                experience: 1000,
                items: [],
                achievement: 'sabio_empatico'
            },
            dialogueTree: {
                start: {
                    text: "Seja bem-vindo, Emissário. Eu o observei desde a Vila da Forja. Vi você acalmar a raiva, consolar o medo e transformar o arrependimento. Sua jornada foi longa. Agora, o teste final. Diga-me: o que você aprendeu sobre a Paciência?",
                    options: [
                        { text: "Que ela é a arte de esperar o momento certo.", next: "wrong_answer" },
                        { text: "Que ela nasce quando a calma transforma a raiva. (Lição de Balthazar)", next: "question_2" }
                    ]
                },
                question_2: {
                    text: "Correto. Você ouviu o coração do ferreiro. Agora, diga-me: qual a natureza da Coragem?",
                    options: [
                        { text: "É a completa ausência de medo.", next: "wrong_answer" },
                        { text: "É agir com esperança apesar do medo. (Lição de Lily e Icarus)", next: "question_3" }
                    ]
                },
                question_3: {
                    text: "Você compreendeu bem. E o Perdão, o que ele é?",
                    options: [
                        { text: "É esquecer o erro que foi cometido.", next: "wrong_answer" },
                        { text: "É libertar a si mesmo do peso da raiva através da compaixão. (Lição de Nereus)", next: "final_answer" }
                    ]
                },
                final_answer: {
                    text: "Sim. Você não apenas resolveu conflitos, você os compreendeu. Você não curou pessoas, você as ajudou a se curarem. Você não é mais um aprendiz. Você é um Sábio Empático, um farol para este mundo.",
                    options: [
                        { text: "Obrigado, Mestra. Foi uma honra.", next: "quest_complete" }
                    ]
                },
                wrong_answer: {
                    text: "Sua resposta é verdadeira, mas incompleta. A sabedoria não está na superfície, mas nas profundezas da experiência. Volte quando tiver refletido mais sobre as lições que aprendeu.",
                    options: [
                        { text: "Eu irei refletir.", next: "end_dialogue" }
                    ]
                },
                quest_complete: {
                    text: "A jornada nunca termina, Sábio Emissário. Elara é vasta... e há outros continentes além deste. Eu lhe concedo acesso ao Mapa-Múndi. Explore, aprenda e continue a espalhar a compreensão.",
                    options: [],
                    reward: true,
                    unlocks: "world_map" // << NOVA PROPRIEDADE
                }
            }
        },

                eco_perdido: {
            id: 'eco_perdido',
            title: 'O Eco Perdido',
            description: 'Ajude Silas, o Guardião dos Ecos, a liberar uma emoção antiga e poderosa que ameaça consumir a ele e às Cavernas Ecoantes.',
            scenario: 'CavernasEcoantes',
            npc: 'guardiao_ecos',
            type: 'emotional_release',
            difficulty: 'expert',
            requiredPotion: 'GRATIDAO', // Uma nova receita!
            status: 'available',
            objectives: [
                'Enfrente a energia opressora das Cavernas Ecoantes',
                'Use o Amuleto de Proteção para se aproximar de Silas',
                'Crie a poção da GRATIDÃO para transformar o eco de arrependimento',
                'Ajude Silas a liberar o eco preso'
            ],
            rewards: {
                experience: 400,
                items: [],
                newLocation: 'TorreSabedoria' // Conecta o caminho final!
            },
            dialogueTree: {
                start: {
                    text: "(A própria caverna sussurra em sua mente, uma cacofonia de tristeza) ...pesado... tão pesado... por que não disse?... por que não falei?... pesado...",
                    options: [
                        { text: "Quem está aí?", next: "approach_fail", requiresItem: "amuleto_protecao", requirementFails: true },
                        { text: "Aproximar-se com o Amuleto de Proteção brilhando.", next: "approach_success", requiresItem: "amuleto_protecao" }
                    ]
                },
                approach_fail: {
                    text: "(A onda de tristeza é avassaladora. Você sente o peso de mil arrependimentos e precisa recuar. É impossível se concentrar.)",
                    options: [
                        { text: "Recuar. (Preciso de alguma proteção contra essa energia.)", next: "end_dialogue" }
                    ]
                },
                approach_success: {
                    text: "(O seu amuleto brilha, criando uma aura de calma ao seu redor. A cacofonia se acalma, e uma forma se define nas sombras.) Eu sou... o que foi deixado para trás. Sou Silas. Sua luz... alivia o fardo. Mas um eco... um eco de perdão nunca dado... ele grita mais alto.",
                    options: [
                        { text: "Conte-me sobre este eco.", next: "echo_story" },
                        { text: "Como posso ajudar a libertá-lo?", next: "how_to_help" }
                    ]
                },
                echo_story: {
                    text: "É de um pai que nunca disse ao filho que o perdoava. O filho partiu, e o pai viveu o resto de seus dias em silêncio. O arrependimento dele ecoa aqui, uma ferida aberta. O perdão não pode mais ser entregue... mas talvez o sentimento possa ser transformado.",
                    options: [
                        { text: "Como podemos transformar o arrependimento?", next: "minigame_trigger" }
                    ]
                },
                how_to_help: {
                    text: "O arrependimento é a dor pelo que não foi feito. Para curá-lo, precisamos focar no que *foi* bom. Na alegria que existiu. Precisamos de... gratidão. Uma poção de gratidão poderia transformar a energia deste eco.",
                    options: [
                        { text: "Vou criar a Poção da Gratidão.", next: "minigame_start" }
                    ]
                },
                minigame_trigger: {
                    text: "Transformar a dor do arrependimento em uma celebração do que foi vivido... com a alquimia da gratidão. Sim... é a única maneira. Você pode fazer isso, Emissário?",
                    options: [
                        { text: "Sim, eu posso.", next: "minigame_start" }
                    ]
                },
                minigame_success: {
                    text: "(Você derrama a poção em um cristal que pulsa com uma luz triste. A luz muda de um cinza melancólico para um dourado caloroso.) O eco... ele não grita mais. Ele canta. Uma canção de saudade, mas de paz. Você o libertou. E a mim também. Obrigado.",
                    options: [
                        { text: "A paz é a maior recompensa.", next: "quest_complete" }
                    ]
                },
                quest_complete: {
                    text: "Os ecos agora sussurram sua história. Eles dizem que você está pronto. O caminho para o pico de Elara, para a Torre da Sabedoria, está agora aberto para você. Vá, e complete sua jornada.",
                    options: [],
                    reward: true
                }
            }
        },
                realidade_ilusao: {
            id: 'realidade_ilusao',
            title: 'Realidade e Ilusão',
            description: 'Ajude Zara, a Nômade Visionária, a decidir o que fazer com um mercador que vende falsas esperanças no coração do Deserto das Ilusões.',
            scenario: 'DesertoIlusoes',
            npc: 'nomade_visionario',
            type: 'moral_dilemma',
            difficulty: 'expert',
            requiredPotion: 'SABEDORIA', // Uma nova receita!
            status: 'available',
            objectives: [
                'Encontre Zara no Deserto das Ilusões',
                'Use a Lente da Compreensão para decifrar seus enigmas',
                'Crie a poção da SABEDORIA',
                'Ajude-a a encontrar uma solução equilibrada para o dilema'
            ],
            rewards: {
                experience: 350,
                items: [],
                newLocation: 'CavernasEcoantes'
            },
            dialogueTree: {
                start: {
                    text: "O sol tece véus de luz na areia, Emissário. Diga-me, o que é mais real: a água que se vê, mas não se pode beber, ou a sede que se sente, mas não se pode ver?",
                    options: [
                        { text: "A sede é mais real.", next: "wrong_path" },
                        { text: "A água que se vê é mais real.", next: "wrong_path" },
                        { text: "Ambos são reais em seus próprios termos.", next: "wisdom_path", requiresItem: "lente_compreensao", hiddenText: " (Usar Lente da Compreensão)" }
                    ]
                },
                wrong_path: {
                    text: "Sua resposta é como uma pegada na areia. O vento logo a apagará. Pense novamente. A verdade aqui tem muitas faces.",
                    options: [
                        { text: "Vou refletir sobre isso.", next: "start" }
                    ]
                },
                wisdom_path: {
                    text: "Você vê além do véu. Bom. Há um jovem mercador perto daqui. Ele vende a água que se vê, mas não se bebe. Ele sacia a esperança, mas não a sede. Devo destruir sua ilusão e revelar a dura verdade?",
                    options: [
                        { text: "Sim, a verdade deve prevalecer.", next: "harsh_truth" },
                        { text: "Não, a ilusão dele talvez seja necessária.", next: "kind_lie" },
                        { text: "Precisamos de sabedoria para encontrar um terceiro caminho.", next: "minigame_trigger" }
                    ]
                },
                harsh_truth: {
                    text: "Uma verdade dura pode quebrar um espírito já seco. Não é tão simples. Precisamos de mais do que apenas a verdade; precisamos de sabedoria.",
                    options: [
                        { text: "Entendo. Vamos buscar essa sabedoria.", next: "minigame_trigger" }
                    ]
                },
                kind_lie: {
                    text: "Uma mentira gentil pode se tornar uma prisão de areia. Não é tão simples. Precisamos de mais do que apenas compaixão; precisamos de sabedoria.",
                    options: [
                        { text: "Entendo. Vamos buscar essa sabedoria.", next: "minigame_trigger" }
                    ]
                },
                minigame_trigger: {
                    text: "Sabedoria... sim. A poção que une o que se sabe com o que se sente. Você pode destilar tal essência, Emissário?",
                    options: [
                        { text: "Eu tentarei.", next: "minigame_start" }
                    ]
                },
                minigame_success: {
                    text: "A clareza... Agora eu vejo. Não devo destruir a ilusão dele, nem devo permiti-la. Devo ensiná-lo a encontrar um oásis real. Guiá-lo da ilusão para a esperança, e da esperança para a realidade. Essa é a sabedoria.",
                    options: [
                        { text: "Um caminho sábio e empático.", next: "quest_complete" }
                    ]
                },
                quest_complete: {
                    text: "Você trouxe equilíbrio ao deserto, Emissário. Sua jornada o leva agora às profundezas. Abaixo da areia, existem as Cavernas Ecoantes. Lá, as palavras não se perdem. Elas esperam. Vá, e ouça o que elas têm a dizer.",
                    options: [],
                    reward: true
                }
            }
        },

                construcao_impossivel: {
            id: 'construcao_impossivel',
            title: 'A Construção Impossível',
            description: 'Ajude Icarus, o Arquiteto de Sonhos, a superar seu medo paralisante da falha e a encontrar a coragem para construir uma nova ponte para o futuro da cidade.',
            scenario: 'CidadeFlutuante',
            npc: 'arquiteto_sonhos',
            type: 'emotional_support',
            difficulty: 'advanced',
            requiredPotion: 'CORAGEM', // Uma nova aplicação para uma poção já conhecida
            status: 'available',
            objectives: [
                'Converse com Icarus na Cidade Flutuante',
                'Entenda a origem de seu medo de falhar',
                'Crie a poção da CORAGEM',
                'Inspire-o a confiar em seu próprio trabalho e a agir'
            ],
            rewards: {
                experience: 300,
                items: ['cristal_harmonia'],
                newLocation: 'TorreSabedoria' // Desbloqueia o local final!
            },
            dialogueTree: {
                start: {
                    text: "Bem-vindo à Cidade Flutuante, Emissário. Admire a vista, mas não se aproxime demais das bordas. Tudo aqui é... precário. Um sopro de vento mais forte e tudo pode vir abaixo.",
                    options: [
                        { text: "Suas construções parecem magníficas para mim.", next: "praise_response" },
                        { text: "Você parece muito preocupado.", next: "empathy_response" }
                    ]
                },
                praise_response: {
                    text: "Magníficas? Ou perigosamente ambiciosas? Há uma linha tênue entre genialidade e loucura. Temo que eu a tenha cruzado há muito tempo.",
                    options: [
                        { text: "O que alimenta esse medo?", next: "fear_explanation" },
                        { text: "A coragem é necessária para criar grandes coisas.", next: "minigame_trigger" }
                    ]
                },
                empathy_response: {
                    text: "Preocupado é um eufemismo. Eu não durmo. Cada rangido, cada estalo... imagino tudo desabando. O peso de milhares de vidas está sobre meus projetos. Sobre meus ombros.",
                    options: [
                        { text: "Esse fardo é pesado demais para carregar sozinho.", next: "burden_response" },
                        { text: "Você precisa de coragem para confiar em si mesmo.", next: "minigame_trigger" }
                    ]
                },
                fear_explanation: {
                    text: "O medo de que meu legado seja uma pilha de escombros no fundo do céu. Preciso construir uma nova ponte, mas... e se eu errar o cálculo? E se eu falhar?",
                    options: [
                        { text: "A inação também é uma forma de falha.", next: "inaction_response" },
                        { text: "Vamos forjar a coragem que você precisa.", next: "minigame_start" }
                    ]
                },
                burden_response: {
                    text: "Mas quem mais pode carregá-lo? A responsabilidade é minha. A falha seria minha. Preciso de força... de coragem para dar o próximo passo.",
                    options: [
                        { text: "A coragem não é a ausência de medo, mas a ação apesar dele.", next: "minigame_start" }
                    ]
                },
                inaction_response: {
                    text: "Você... você tem razão. Ao não construir a ponte, já estou falhando com a minha comunidade. Mas como superar este pavor?",
                    options: [
                        { text: "Com uma dose de alquimia emocional.", next: "minigame_start" }
                    ]
                },
                minigame_trigger: {
                    text: "Coragem... Sim. É exatamente o que me falta. Você pode criar tal essência, Emissário? Algo que me permita enfrentar meus próprios demônios arquitetônicos?",
                    options: [
                        { text: "Considere feito.", next: "minigame_start" }
                    ]
                },
                minigame_success: {
                    text: "Incrível. O medo ainda está aqui, mas... ele não me paralisa mais. Ele é apenas um sussurro, não um grito. Sinto a força para pegar minhas ferramentas e confiar em meu conhecimento. A ponte será construída.",
                    options: [
                        { text: "Sua visão construirá um futuro seguro.", next: "quest_complete" }
                    ]
                },
                quest_complete: {
                    text: "Você me ajudou a reconectar com meu propósito. Leve este Cristal. Ele o ajudará a ver a harmonia... ou a falta dela. Minha nova ponte levará à base da Torre da Sabedoria. É o lugar mais estável de todo o reino. Vá, talvez os sábios de lá possam guiá-lo.",
                    options: [],
                    reward: true
                }
            }
        },

                reconciliacao_passado: {
            id: 'reconciliacao_passado',
            title: 'O Reflexo do Arrependimento',
            description: 'Ajude Nereus a se reconciliar com seu passado e a perdoar a si mesmo para que possa encontrar paz nas águas do Lago dos Reflexos.',
            scenario: 'LagoReflexos',
            npc: 'pescador_filosofo',
            type: 'emotional_healing',
            difficulty: 'intermediate',
            requiredPotion: 'PERDAO', // Reutilizando uma poção poderosa
            status: 'available',
            objectives: [
                'Converse com Nereus à beira do lago',
                'Descubra a fonte de seu arrependimento',
                'Crie a poção do PERDÃO',
                'Ajude-o a se perdoar e a mudar seu reflexo interior'
            ],
            rewards: {
                experience: 220,
                items: ['semente_esperanca'],
                newLocation: 'DesertoIlusoes' // Conectando ao próximo local
            },
            dialogueTree: {
                start: {
                    text: "Olá, jovem viajante. Veio admirar os reflexos? Tenha cuidado. Às vezes, eles mostram mais do que gostaríamos de ver...",
                    options: [
                        { text: "O que o seu reflexo lhe mostra?", next: "reflection_question" },
                        { text: "Sinto uma grande tristeza em suas palavras.", next: "empathy_response" }
                    ]
                },
                reflection_question: {
                    text: "Ele me mostra um jovem tolo, de coração endurecido pela raiva. Um jovem que deixou o orgulho falar mais alto que a amizade. Um rosto que não consigo esquecer.",
                    options: [
                        { text: "O passado não pode ser mudado, mas o presente sim.", next: "present_focus" },
                        { text: "Talvez seja hora de perdoar esse jovem.", next: "minigame_trigger" }
                    ]
                },
                empathy_response: {
                    text: "A tristeza é uma companheira antiga. Ela se senta aqui comigo, todos os dias, enquanto lanço minha linha para um passado que nunca posso rebobinar. Deixei um amigo partir com palavras duras...",
                    options: [
                        { text: "O arrependimento é pesado de carregar.", next: "regret_acknowledgement" },
                        { text: "O perdão pode aliviar esse fardo.", next: "minigame_trigger" }
                    ]
                },
                present_focus: {
                    text: "Você fala com sabedoria, mas meu coração está ancorado no ontem. Como posso navegar no hoje se estou preso na tempestade de ontem?",
                    options: [
                        { text: "Uma poção do perdão pode acalmar essa tempestade.", next: "minigame_trigger" }
                    ]
                },
                regret_acknowledgement: {
                    text: "É o peixe mais pesado que já fisguei, e não consigo cortá-lo da linha. Ele me puxa para o fundo do lago, para as memórias escuras.",
                    options: [
                        { text: "Vamos criar algo para cortar essa linha.", next: "minigame_start" }
                    ]
                },
                minigame_trigger: {
                    text: "Perdoar... a mim mesmo? É a coisa mais difícil de se fazer. Você acredita que uma poção pode realmente alcançar as profundezas da alma?",
                    options: [
                        { text: "Ela pode nos mostrar o caminho.", next: "minigame_start" }
                    ]
                },
                minigame_success: {
                    text: "É como se a superfície do lago se acalmasse pela primeira vez em anos. O reflexo... mudou. Ainda vejo o jovem, mas agora... vejo também a tristeza dele, o arrependimento. E sinto compaixão. Por ele. Por mim.",
                    options: [
                        { text: "Agora você pode finalmente encontrar a paz.", next: "quest_complete" }
                    ]
                },
                quest_complete: {
                    text: "Você me devolveu o lago, Emissário. E a mim mesmo. Leve esta Semente. Plante-a onde a esperança precisa florescer. Meu amigo partiu em direção ao Deserto das Ilusões. Talvez... talvez você encontre respostas lá que eu nunca pude procurar.",
                    options: [],
                    reward: true
                }
            }
        },

                busca_interior: {
            id: 'busca_interior',
            title: 'A Busca Interior',
            description: 'Ajude Kaelen, o Ermitão Sábio, a superar sua última dúvida e a encontrar a verdadeira autoconfiança em seu propósito.',
            scenario: 'MontanhasCristalinas',
            npc: 'ermitao_sabio',
            type: 'emotional_support',
            difficulty: 'advanced',
            requiredPotion: 'AUTOCONFIANCA',
            status: 'available',
            objectives: [
                'Converse com Kaelen nas Montanhas Cristalinas',
                'Entenda a natureza de sua dúvida existencial',
                'Crie a poção da AUTOCONFIANÇA',
                'Ajude-o a reafirmar o valor de sua jornada'
            ],
            rewards: {
                experience: 250,
                items: ['pergaminho_sabedoria'], // Um item que pode ser repetido ou um novo
                newLocation: 'CidadeFlutuante'
            },
            dialogueTree: {
                start: {
                    text: "O vento sussurrou sua chegada, Emissário. Você sobe alto. Mas a questão é: por que sobe? O que busca aqui no topo do mundo?",
                    options: [
                        { text: "Busco ajudar quem precisa. E você?", next: "purpose_question" },
                        { text: "Sinto uma incerteza emanando de você.", next: "empathy_response" }
                    ]
                },
                purpose_question: {
                    text: "Eu busco o silêncio. Mas até no silêncio, uma dúvida ecoa... a dúvida do propósito. Depois de tantos anos, será que minha sabedoria serve para algo além destas pedras?",
                    options: [
                        { text: "A sabedoria tem valor em si mesma.", next: "wisdom_value" },
                        { text: "Talvez você precise fortalecer sua confiança.", next: "minigame_trigger" }
                    ]
                },
                empathy_response: {
                    text: "Seus sentidos são aguçados. Sim. Há uma sombra de medo em meu coração. O medo de que minha vida tenha sido uma busca egoísta, disfarçada de sabedoria.",
                    options: [
                        { text: "Sua busca inspira outros, como eu.", next: "inspiration_response" },
                        { text: "Vamos transformar esse medo em autoconfiança.", next: "minigame_trigger" }
                    ]
                },
                wisdom_value: {
                    text: "Palavras gentis. Mas a confiança não vem de fora. Ela deve nascer de dentro, transformando o medo em força.",
                    options: [
                        { text: "Posso ajudar com uma poção para isso.", next: "minigame_trigger" }
                    ]
                },
                inspiration_response: {
                    text: "Sua jornada até aqui prova que a busca não foi em vão. Você só precisa acreditar nisso. Uma poção pode catalisar essa crença.",
                    options: [
                        { text: "Vamos criar a poção da Autoconfiança.", next: "minigame_start" }
                    ]
                },
                minigame_trigger: {
                    text: "Autoconfiança... a alquimia da alma. Sim, Emissário. O medo só pode ser superado pela sabedoria que floresce em confiança. Mostre-me como se faz.",
                    options: [
                        { text: "Vamos ao caldeirão.", next: "minigame_start" }
                    ]
                },
                minigame_success: {
                    text: "Ah... sinto a clareza. O medo não era um inimigo, mas um mestre. Ele me ensinou a humildade. Agora, com a autoconfiança, entendo meu verdadeiro propósito: ser um farol, não um porto. Apenas brilhar.",
                    options: [
                        { text: "Fico feliz que tenha encontrado sua paz.", next: "quest_complete" }
                    ]
                },
                quest_complete: {
                    text: "Sua ajuda foi um espelho que me permitiu ver a mim mesmo. Leve este Pergaminho. Que ele o guie. Acima de nós, flutua uma cidade de sonhos e medos. Talvez sua jornada o leve até lá.",
                    options: [],
                    reward: true
                }
            }
        },


        rivalidade_artesaos: {
            id: 'rivalidade_artesaos',
            title: 'Forjando Harmonia',
            description: 'Ajude Elena a encontrar seu lugar entre os artesãos e resolver o conflito geracional através da compreensão mútua.',
            scenario: 'VilaDaForja',
            npc: 'elena_ferreiro',
            type: 'conflict_resolution',
            difficulty: 'intermediate',
            requiredPotion: 'EMPATIA',
            status: 'available',
            objectives: [
                'Entenda a frustração de Elena',
                'Crie a poção EMPATIA',
                'Ajude-a a ver a perspectiva dos outros artesãos'
            ],
            rewards: {
                experience: 150,
                items: ['cristal_harmonia'],
                newLocation: 'MercadoCentral'
            },
            dialogueTree: {
                start: {
                    text: "Você é um Emissário? Perfeito! Talvez possa me ajudar com esses artesãos teimosos que não reconhecem meu talento!",
                    options: [
                        { text: "Conte-me o que está acontecendo", next: "problem_explanation" },
                        { text: "Vejo que está frustrada", next: "empathy_response" }
                    ]
                },
                problem_explanation: {
                    text: "Trabalho duro todos os dias, mas eles me tratam como uma criança. Minhas ideias são sempre ignoradas! Como posso provar meu valor?",
                    options: [
                        { text: "Talvez precisemos entender melhor os outros", next: "empathy_suggestion" },
                        { text: "Que tal uma poção da empatia?", next: "minigame_trigger" }
                    ]
                },
                empathy_response: {
                    text: "Sim! Finalmente alguém que me entende! Tenho tanto a oferecer, mas ninguém me dá uma chance real.",
                    options: [
                        { text: "Vamos criar uma poção para ver melhor", next: "minigame_trigger" }
                    ]
                },
                empathy_suggestion: {
                    text: "Entender os outros? Mas eles é que deveriam me entender! Embora... talvez você tenha razão.",
                    options: [
                        { text: "Uma poção da empatia pode ajudar", next: "minigame_trigger" }
                    ]
                },
                minigame_trigger: {
                    text: "Uma poção da empatia? Isso me ajudaria a entender melhor os outros artesãos?",
                    options: [
                        { text: "Vamos descobrir juntos!", next: "minigame_start" }
                    ]
                },
                minigame_success: {
                    text: "Nossa... agora consigo ver! Eles não me ignoram por maldade. Têm medo que eu mude tradições que amam. E eu... preciso mostrar respeito antes de esperar reconhecimento.",
                    options: [
                        { text: "Exato! Respeito mútuo é a chave", next: "quest_complete" }
                    ]
                },
                quest_complete: {
                    text: "Obrigada por me ajudar a ver além da minha frustração. Tome este Cristal da Harmonia - ele detecta conflitos que precisam de resolução. Ouvi que há tensões no Mercado Central...",
                    options: [],
                    reward: true
                }
            }
        },

        equilibrio_natural: {
            id: 'equilibrio_natural',
            title: 'O Guardião e a Harmonia',
            description: 'Ajude Sylvanus a encontrar um equilíbrio entre a proteção da natureza e a coexistência com os humanos.',
            scenario: 'FlorestasSussurrantes',
            npc: 'guardiao_floresta',
            type: 'conflict_resolution',
            difficulty: 'advanced',
            requiredPotion: 'HARMONIA',
            status: 'available',
            objectives: [
                'Compreenda a dor de Sylvanus',
                'Crie a poção HARMONIA',
                'Encontre um caminho de coexistência'
            ],
            rewards: {
                experience: 200,
                items: ['semente_esperanca'],
                newLocation: 'MontanhasCristalinas'
            },
            dialogueTree: {
                start: {
                    text: "Um Emissário... há muito não vejo um. Você vem em paz ou traz mais destruição como os outros humanos?",
                    options: [
                        { text: "Venho em paz, para ajudar", next: "peace_response" },
                        { text: "Que destruição você menciona?", next: "destruction_explanation" }
                    ]
                },
                peace_response: {
                    text: "Paz... uma palavra bonita, mas vazia quando vejo minhas árvores caindo e meus animais fugindo. Como posso confiar em mais um humano?",
                    options: [
                        { text: "Entendo sua dor", next: "understanding_response" },
                        { text: "Nem todos os humanos são iguais", next: "defense_humans" }
                    ]
                },
                destruction_explanation: {
                    text: "Séculos de florestas derrubadas, rios poluídos, criaturas caçadas até a extinção. Os humanos tomam e tomam, mas nunca devolvem. Como posso proteger o que resta?",
                    options: [
                        { text: "Deve haver uma forma de coexistir", next: "coexistence_suggestion" },
                        { text: "Vamos buscar harmonia juntos", next: "minigame_trigger" }
                    ]
                },
                understanding_response: {
                    text: "Você... realmente entende? Não é apenas sobre árvores e animais. É sobre o equilíbrio que mantém tudo vivo. Sem ele, todos sofrem.",
                    options: [
                        { text: "Vamos restaurar esse equilíbrio", next: "minigame_trigger" }
                    ]
                },
                defense_humans: {
                    text: "Talvez... mas como distinguir os que respeitam dos que destroem? Meu coração está cansado de ser traído.",
                    options: [
                        { text: "A harmonia pode curar essa dor", next: "minigame_trigger" }
                    ]
                },
                coexistence_suggestion: {
                    text: "Coexistir... seria possível? Mas precisaria de algo mais que palavras. Precisaria de verdadeira harmonia entre nossos mundos.",
                    options: [
                        { text: "Vamos criar essa harmonia", next: "minigame_trigger" }
                    ]
                },
                minigame_trigger: {
                    text: "Harmonia... sim, talvez seja isso que precisamos. Você pode criar tal poção?",
                    options: [
                        { text: "Juntos podemos tentar", next: "minigame_start" }
                    ]
                },
                minigame_success: {
                    text: "Sinto... sinto a paz retornando ao meu coração. Você me mostrou que alguns humanos ainda se importam. Talvez possamos trabalhar juntos para proteger e preservar.",
                    options: [
                        { text: "A natureza e humanidade podem prosperar juntas", next: "quest_complete" }
                    ]
                },
                quest_complete: {
                    text: "Você restaurou minha fé na possibilidade de harmonia. Esta Semente da Esperança crescerá onde quer que você plante paz. As Montanhas Cristalinas aguardam sua sabedoria...",
                    options: [],
                    reward: true
                }
            }
        },

        medo_escuridao: {
            id: 'medo_escuridao',
            title: 'Luz na Escuridão',
            description: 'Ajude a pequena Lily a superar seu medo da escuridão e encontrar a coragem para seguir em frente.',
            scenario: 'FlorestasSussurrantes',
            npc: 'crianca_perdida',
            type: 'emotional_support',
            difficulty: 'beginner',
            requiredPotion: 'CORAGEM',
            status: 'available',
            objectives: [
                'Conforte Lily em seu medo',
                'Crie a poção CORAGEM',
                'Ajude-a a encontrar força interior'
            ],
            rewards: {
                experience: 120,
                items: ['pergaminho_sabedoria']
            },
            dialogueTree: {
                start: {
                    text: "Você... você pode me ajudar? Estou perdida e está ficando escuro... tenho muito medo!",
                    options: [
                        { text: "Não se preocupe, estou aqui para ajudar", next: "comfort_response" },
                        { text: "O que você estava fazendo aqui?", next: "story_explanation" }
                    ]
                },
                comfort_response: {
                    text: "Você... você realmente vai me ajudar? Mas e se os monstros da escuridão vierem?",
                    options: [
                        { text: "Não há monstros, apenas sombras", next: "reassurance" },
                        { text: "Vamos criar uma poção da coragem juntas", next: "minigame_trigger" }
                    ]
                },
                story_explanation: {
                    text: "Eu só queria flores bonitas para a mamãe... ela está doente e pensei que flores fariam ela sorrir. Mas agora não sei onde estou e tem ruídos estranhos!",
                    options: [
                        { text: "Que gesto lindo! Sua mãe ficaria orgulhosa", next: "praise_response" },
                        { text: "Que tal uma poção para te dar coragem?", next: "minigame_trigger" }
                    ]
                },
                reassurance: {
                    text: "Apenas sombras? Mas elas parecem tão assustadoras... e os ruídos...",
                    options: [
                        { text: "Vamos encontrar coragem dentro de você", next: "minigame_trigger" }
                    ]
                },
                praise_response: {
                    text: "Você acha? Eu queria tanto fazer ela sorrir... mas agora estou com tanto medo!",
                    options: [
                        { text: "Sua coragem de vir aqui por ela é admirável", next: "minigame_trigger" }
                    ]
                },
                minigame_trigger: {
                    text: "Uma poção da coragem? Isso vai fazer eu não ter mais medo?",
                    options: [
                        { text: "Vai te ajudar a ser corajosa!", next: "minigame_start" }
                    ]
                },
                minigame_success: {
                    text: "Uau! Sinto uma força especial dentro de mim! Ainda tenho um pouquinho de medo, mas agora sei que posso ser corajosa! Obrigada!",
                    options: [
                        { text: "A coragem estava dentro de você o tempo todo", next: "quest_complete" }
                    ]
                },
                quest_complete: {
                    text: "Você me ensinou que posso enfrentar meus medos! Tome este pergaminho - minha vovó disse que tem palavras sábias. Agora vou colher as flores e voltar para casa!",
                    options: [],
                    reward: true
                }
            }
        },

            rivalidade_mercadores_sofia: {
            id: 'rivalidade_mercadores_sofia',
            title: 'Ponte Entre Gerações',
            description: 'Resolva o conflito entre Marcus e Sofia, unindo experiência e inovação para o bem de todos.',
            scenario: 'MercadoCentral',
            npc: 'sofia_comerciante',
            type: 'conflict_resolution',
            difficulty: 'advanced',
            requiredPotion: 'PERDAO',
            status: 'available',
            objectives: [
                'Entenda ambos os lados do conflito',
                'Crie a poção PERDÃO',
                'Facilite a reconciliação entre Marcus e Sofia'
            ],
            rewards: {
                experience: 200,
                items: ['amuleto_protecao'],
                newLocation: 'LagoReflexos'
            },
            dialogueTree: {
                start: {
                    text: "Que bom que você chegou! Esse senhor teimoso se recusa a aceitar qualquer inovação! Está preso no passado! Talvez você possa me ajudar a fazê-lo ver que o futuro é agora!",
                    options: [
                        { text: "Conte-me sobre o conflito", next: "problem_explanation" },
                        { text: "Ambos têm valor a oferecer", next: "balanced_response" }
                    ]
                },
                problem_explanation: {
                    text: "Venho da capital com técnicas modernas que poderiam revolucionar este mercado! Mas Marcus e os outros veteranos me veem como uma ameaça, não como uma aliada!",
                    options: [
                        { text: "E se vocês trabalhassem juntos?", next: "cooperation_suggestion" },
                        { text: "Que tal uma poção do perdão?", next: "minigame_trigger" }
                    ]
                },
                balanced_response: {
                    text: "Valor? Eles só querem manter tudo como está! Embora... admito que algumas tradições deles têm seu mérito...",
                    options: [
                        { text: "Vamos trabalhar o perdão", next: "minigame_trigger" }
                    ]
                },
                cooperation_suggestion: {
                    text: "Trabalhar juntos? Depois de tudo que ele fez? Seria preciso um milagre... ou muita capacidade de perdoar.",
                    options: [
                        { text: "Posso ajudar com uma poção do perdão", next: "minigame_trigger" }
                    ]
                },
                minigame_trigger: {
                    text: "Uma poção do perdão? Isso me ajudaria a... deixar a raiva de lado?",
                    options: [
                        { text: "E abrir espaço para colaboração", next: "minigame_start" }
                    ]
                },
                minigame_success: {
                    text: "Incrível... sinto o peso da raiva saindo dos meus ombros. Você tem razão - Marcus e eu podemos aprender um com o outro. Experiência e inovação juntas são imbatíveis!",
                    options: [
                        { text: "Agora vocês podem construir algo incrível", next: "quest_complete" }
                    ]
                },
                quest_complete: {
                    text: "Obrigado por me ajudar a ver além da minha teimosia. Este Amuleto de Proteção vai te proteger de energias negativas. E se for ao Lago dos Reflexos, cuidado - há alguém lá lutando com verdades difíceis...",
                    options: [],
                    reward: true
                }
            }
            },


        rivalidade_mercadores: {
            id: 'rivalidade_mercadores',
            title: 'Ponte Entre Gerações',
            description: 'Resolva o conflito entre Marcus e Sofia, unindo experiência e inovação para o bem de todos.',
            scenario: 'MercadoCentral',
            npc: 'marcus_mercador',
            type: 'conflict_resolution',
            difficulty: 'advanced',
            requiredPotion: 'PERDAO',
            status: 'available',
            objectives: [
                'Entenda ambos os lados do conflito',
                'Crie a poção PERDÃO',
                'Facilite a reconciliação entre Marcus e Sofia'
            ],
            rewards: {
                experience: 200,
                items: ['amuleto_protecao'],
                newLocation: 'LagoReflexos'
            },
            dialogueTree: {
                start: {
                    text: "Um Emissário? Bom, talvez você possa fazer Sofia entender que experiência conta mais que inovação desenfreada!",
                    options: [
                        { text: "Conte-me sobre o conflito", next: "problem_explanation" },
                        { text: "Ambos têm valor a oferecer", next: "balanced_response" }
                    ]
                },
                problem_explanation: {
                    text: "Trabalho neste mercado há 40 anos! Essa jovem chega com suas ideias modernas e acha que sabe tudo! Não respeita nossas tradições nem nossa experiência!",
                    options: [
                        { text: "E se vocês trabalhassem juntos?", next: "cooperation_suggestion" },
                        { text: "Que tal uma poção do perdão?", next: "minigame_trigger" }
                    ]
                },
                balanced_response: {
                    text: "Valor? Ela só quer destruir tudo que construí! Embora... admito que algumas ideias dela não são totalmente ruins...",
                    options: [
                        { text: "Vamos trabalhar o perdão", next: "minigame_trigger" }
                    ]
                },
                cooperation_suggestion: {
                    text: "Trabalhar juntos? Depois de tudo que ela fez? Seria preciso um milagre... ou muita capacidade de perdoar.",
                    options: [
                        { text: "Posso ajudar com uma poção do perdão", next: "minigame_trigger" }
                    ]
                },
                minigame_trigger: {
                    text: "Uma poção do perdão? Isso me ajudaria a... deixar a raiva de lado?",
                    options: [
                        { text: "E abrir espaço para colaboração", next: "minigame_start" }
                    ]
                },
                minigame_success: {
                    text: "Incrível... sinto o peso da raiva saindo dos meus ombros. Você tem razão - Sofia e eu podemos aprender um com o outro. Experiência e inovação juntas são imbatíveis!",
                    options: [
                        { text: "Agora vocês podem construir algo incrível", next: "quest_complete" }
                    ]
                },
                quest_complete: {
                    text: "Obrigado por me ajudar a ver além da minha teimosia. Este Amuleto de Proteção vai te proteger de energias negativas. E se for ao Lago dos Reflexos, cuidado - há alguém lá lutando com verdades difíceis...",
                    options: [],
                    reward: true
                }
            }
        }
    },

    // ===== SISTEMA DE PROGRESSÃO =====
    progression: {
        levels: {
            1: { name: 'Aprendiz Emissário', experience: 0, maxExperience: 100 },
            2: { name: 'Emissário Iniciante', experience: 100, maxExperience: 250 },
            3: { name: 'Emissário Experiente', experience: 250, maxExperience: 500 },
            4: { name: 'Mestre Emissário', experience: 500, maxExperience: 1000 },
            5: { name: 'Grande Sábio da Empatia', experience: 1000, maxExperience: 9999 }
        }
    },

    // ===== CONQUISTAS =====
    achievements: {
        primeiro_emissario: {
            name: 'Primeiro Passo',
            description: 'Complete sua primeira missão como Emissário',
            emoji: '🌟',
            unlocked: false
        },
        alquimista_emocional: {
            name: 'Alquimista Emocional',
            description: 'Crie 5 poções diferentes',
            emoji: '🧪',
            unlocked: false
        },
        mediador_mestre: {
            name: 'Mediador Mestre',
            description: 'Resolva 3 conflitos entre personagens',
            emoji: '⚖️',
            unlocked: false
        },
        explorador_elara: {
            name: 'Explorador de Elara',
            description: 'Visite todos os cenários disponíveis',
            emoji: '🗺️',
            unlocked: false
        },
        sabio_empatico: {
            name: 'Sábio Empático',
            description: 'Complete todas as missões disponíveis',
            emoji: '🏆',
            unlocked: false
        }
    },

    // ===== ÁUDIO E MÚSICA =====
    audio: {
        backgroundMusic: {
            menu_theme: "https://pixabay.com/pt/music/irlanda-medieval-music-irish-celtic-ireland-knight-king-queen-background-311693/",
            village_theme: "https://pixabay.com/pt/music/irlanda-medieval-music-irish-celtic-ireland-knight-king-queen-background-311693/",
            forest_theme: "https://www.bensound.com/bensound-music/bensound-relaxing.mp3",
            market_theme: "https://www.bensound.com/bensound-music/bensound-jazzyfrenchy.mp3",
            mountain_theme: "https://www.bensound.com/bensound-music/bensound-epic.mp3",
            lake_theme: "https://www.bensound.com/bensound-music/bensound-peaceful.mp3",
            floating_theme: "https://www.bensound.com/bensound-music/bensound-dreams.mp3",
            desert_theme: "https://www.bensound.com/bensound-music/bensound-oriental.mp3",
            cave_theme: "https://www.bensound.com/bensound-music/bensound-deepblue.mp3",
            wisdom_theme: "https://www.bensound.com/bensound-music/bensound-inspire.mp3"
        }
    },

    // ===== NARRATIVA E DICAS =====
    narrative: {
        tips: [
            "Lembre-se: a empatia começa com a escuta atenta.",
            "Cada conflito é uma oportunidade de crescimento mútuo.",
            "As melhores soluções surgem quando entendemos todos os lados.",
            "Paciência é a chave para resolver problemas complexos.",
            "Suas palavras têm o poder de curar ou ferir - escolha sabiamente.",
            "A verdadeira força vem da vulnerabilidade e da honestidade.",
            "Perdoar não significa esquecer, mas libertar-se do peso da raiva.",
            "Cada pessoa carrega uma história - procure compreendê-la.",
            "A sabedoria cresce quando compartilhamos nossos aprendizados.",
            "Lembre-se: você está aqui para ajudar, não para julgar.",
            "A harmonia nasce quando diferentes perspectivas se encontram.",
            "Coragem não é ausência de medo, mas ação apesar dele.",
            "A gratidão transforma o que temos em suficiente.",
            "Autoconfiança cresce com cada pequeno ato de coragem.",
            "A esperança é a luz que brilha mesmo na escuridão mais profunda."
        ]
    }
};