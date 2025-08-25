// ===== CRÔNICAS DOS EMISSÁRIOS - EXPANSÃO 1: AS TERRAS DE AKARI =====

// Esta função adiciona o conteúdo da expansão ao GAME_DATA principal.
// Isso mantém o conteúdo modular e organizado.
function loadExpansion1() {

    // ===== NOVOS CENÁRIOS (MAPA 2) =====
    Object.assign(GAME_DATA.scenarios, {
        PicosSerrilhados: {
            name: 'Picos Serrilhados',
            mapId: 'akari', // Identificador do novo mapa
            level: 7, // Continua a progressão de nível
            emoji: '🏔️',
            description: 'Montanhas áridas e imponentes que cortam os céus. O vento uiva com histórias de fortunas perdidas e de uma solidão profunda. Cristais de éter pulsam com uma luz fraca nas rochas.',
            background: 'linear-gradient(135deg, #6c757d 0%, #495057 50%, #343a40 100%)',
            music: 'mountain_theme', // Pode reutilizar ou adicionar uma nova
            connections: [], // Por enquanto, sem conexões
            npcs: ['minerador_solitario'],
        }
    });

    // ===== NOVOS PERSONAGENS (MAPA 2) =====
    Object.assign(GAME_DATA.characters, {
        minerador_solitario: {
            name: 'Gideon',
            title: 'Minerador Solitário',
            emoji: '⛏️',
            description: 'Um homem robusto, coberto de poeira de cristal. Seus olhos, no entanto, não buscam riquezas, mas parecem procurar algo que ele perdeu há muito tempo.',
            personality: 'Determinado, teimoso e profundamente triste. Ele evita contato, não por raiva, mas por uma vergonha que o consome.',
            background: 'Gideon era um artesão famoso em uma cidade distante. Ele apostou toda a fortuna de sua família em uma expedição de mineração que falhou, levando sua família à ruína. Em vez de encarar a vergonha, ele fugiu para estas montanhas, dizendo a si mesmo que só voltaria se encontrasse o lendário "Coração de Cristal".',
            currentProblem: 'Ele está preso em um ciclo de autopunição. A busca incessante pelo cristal não é por riqueza, mas uma penitência que ele se impôs. Ele não se permite parar, descansar ou se perdoar.',
            questId: 'penitencia_cristalina'
        }
    });

    // ===== NOVAS MISSÕES (MAPA 2) =====
    Object.assign(GAME_DATA.quests, {
        penitencia_cristalina: {
            id: 'penitencia_cristalina',
            title: 'A Penitência Cristalina',
            description: 'Ajude Gideon a perceber que o verdadeiro tesouro que ele busca não é um cristal, mas o auto-perdão.',
            scenario: 'PicosSerrilhados',
            npc: 'minerador_solitario',
            type: 'self_forgiveness',
            difficulty: 'intermediate',
            requiredPotion: 'COMPAIXAO', // Uma nova receita
            status: 'available',
            objectives: [
                'Encontre Gideon nos Picos Serrilhados',
                'Descubra a verdadeira razão de sua busca obsessiva',
                'Crie a poção da COMPAIXÃO (por si mesmo)',
                'Ajude-o a encontrar um caminho para o auto-perdão'
            ],
            rewards: {
                experience: 500,
                items: ['semente_esperanca'],
            },
            dialogueTree: {
                start: {
                    text: "Não perca seu tempo aqui, viajante. Não há nada nestas montanhas além de pedra, poeira e promessas vazias. Volte para seu caminho.",
                    options: [
                        { text: "O que você procura com tanto afinco?", next: "seek_question" },
                        { text: "Sinto um grande fardo em seus ombros.", next: "empathy_response" }
                    ]
                },
                seek_question: {
                    text: "Procuro o Coração de Cristal. Uma lenda. Uma tolice. Mas é tudo que me resta. Não posso parar. Não até encontrá-lo.",
                    options: [
                        { text: "Por que você não pode parar?", next: "cant_stop" },
                    ]
                },
                empathy_response: {
                    text: "Fardo... (ele para de cavar por um momento, o olhar perdido). É mais pesado que qualquer rocha que já carreguei. Mas é meu para carregar. É minha penitência.",
                    options: [
                        { text: "Que penitência é essa?", next: "penitence_story" }
                    ]
                },
                cant_stop: {
                    text: "Porque parar significa encarar o que eu deixei para trás. A falha. A ruína. É mais fácil quebrar pedras do que encarar a mim mesmo.",
                    options: [
                        { text: "Talvez você precise de compaixão, não de um cristal.", next: "minigame_trigger" }
                    ]
                },
                penitence_story: {
                    text: "Eu destruí minha família com minha ganância. Perdi tudo. Esta busca... esta exaustão... é a punição que eu mereço. Só posso voltar como um herói, ou não voltar.",
                    options: [
                        { text: "O primeiro passo para a redenção é a autocompaixão.", next: "minigame_trigger" }
                    ]
                },
                minigame_trigger: {
                    text: "Compaixão... por mim? Eu não mereço. Eu mereço a dureza desta rocha. Como posso ter compaixão por alguém que causou tanta dor?",
                    options: [
                        { text: "Vamos criar uma poção para ajudá-lo a ver.", next: "minigame_start" }
                    ]
                },
                minigame_success: {
                    text: "(Gideon bebe a poção e sua picareta cai de suas mãos. Pela primeira vez, lágrimas rolam por seu rosto empoeirado.) A compaixão... ela não apaga o erro. Ela me dá forças para tentar consertá-lo. O Coração de Cristal... nunca foi uma pedra. Era o que faltava aqui dentro.",
                    options: [
                        { text: "Agora você pode começar sua verdadeira jornada: a de volta para casa.", next: "quest_complete" }
                    ]
                },
                quest_complete: {
                    text: "Obrigado, Emissário. Você me mostrou que o caminho de volta não se constrói com cristais, mas com coragem e humildade. Eu... eu vou voltar. Vou tentar consertar as coisas. Obrigado.",
                    options: [],
                    reward: true
                }
            }
        }
    });

    // ===== NOVAS RECEITAS (MAPA 2) =====
    Object.assign(GAME_DATA.recipes, {
        'COMPAIXAO': { 
            ingredients: ['tristeza', 'alegria'], 
            emoji: '❤️‍🩹', 
            description: 'A capacidade de sentir pelo outro, equilibrando a dor com a lembrança da felicidade.',
            effect: 'Permite sentir empatia profunda e o desejo de aliviar o sofrimento, inclusive o próprio.',
            hint: 'Dica: A verdadeira compaixão reconhece a TRISTEZA, mas é alimentada pela memória da ALEGRIA.'
        }
    });
}

// Executa a função para carregar a expansão
loadExpansion1();
