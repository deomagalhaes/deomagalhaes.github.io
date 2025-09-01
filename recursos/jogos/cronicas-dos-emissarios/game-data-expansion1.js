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
        },

            // ===== SISTEMA DE FACÇÕES E REPUTAÇÃO (MAPA 2) =====
    
    // Definição das Facções
    factions: {
        cristalinos: {
            name: 'Os Cristalinos',
            philosophy: 'A perfeição é o único caminho para a verdade',
            color: '#E0E7FF',
            emoji: '💎',
            reputation: 0,
            cognitiveDistortion: 'pensamento_dicotomico',
            cnvNeed: 'clareza_ordem',
            description: 'Perfeccionistas que buscam ordem e precisão em todas as coisas. Valorizam protocolos e atenção aos detalhes.',
            headquarters: 'LaboratorioCristalino'
        },
        fluidos: {
            name: 'Os Fluidos',
            philosophy: 'A mudança é a única constante, flexibilidade é força',
            color: '#A7F3D0',
            emoji: '🌊',
            reputation: 0,
            cognitiveDistortion: 'evitacao_compromissos',
            cnvNeed: 'liberdade_espontaneidade',
            description: 'Adaptáveis e criativos, abraçam a mudança e a inovação. Valorizam flexibilidade e soluções não convencionais.',
            headquarters: 'JardimFluido'
        },
        equilibristas: {
            name: 'Os Equilibristas',
            philosophy: 'Toda verdade tem múltiplas faces, harmonia é sabedoria',
            color: '#FDE68A',
            emoji: '⚖️',
            reputation: 0,
            cognitiveDistortion: 'indecisao_patologica',
            cnvNeed: 'harmonia_compreensao',
            description: 'Mediadores naturais que buscam harmonia e compreensão mútua. Valorizam consenso e múltiplas perspectivas.',
            headquarters: 'SalaoEquilibrio'
        }
    },

    // Novos Cenários das Facções
    scenarios: {
        PracaConvergencia: {
            name: 'Praça da Convergência',
            mapId: 'akari',
            level: 8,
            emoji: '🏛️',
            description: 'Um espaço neutro onde as três facções se encontram. Mosaicos no chão representam as diferentes filosofias em harmonia.',
            background: 'linear-gradient(135deg, #E0E7FF 0%, #A7F3D0 50%, #FDE68A 100%)',
            music: 'convergence_theme',
            connections: ['LaboratorioCristalino', 'JardimFluido', 'SalaoEquilibrio'],
            npcs: ['mediador_anciao']
        },
        LaboratorioCristalino: {
            name: 'Laboratório Cristalino',
            mapId: 'akari',
            level: 9,
            emoji: '🔬',
            description: 'Sede dos Cristalinos. Ambiente perfeitamente ordenado com cristais geometricamente dispostos e instrumentos de precisão.',
            background: 'linear-gradient(180deg, #E0E7FF 0%, #C7D2FE 50%, #A5B4FC 100%)',
            music: 'crystal_precision_theme',
            connections: ['PracaConvergencia'],
            npcs: ['arquiteta_cristal']
        },
        JardimFluido: {
            name: 'Jardim Fluido',
            mapId: 'akari',
            level: 10,
            emoji: '🌿',
            description: 'Sede dos Fluidos. Um jardim em constante transformação onde plantas e água dançam em formas sempre mutáveis.',
            background: 'linear-gradient(45deg, #A7F3D0 0%, #6EE7B7 30%, #34D399 70%, #10B981 100%)',
            music: 'flowing_garden_theme',
            connections: ['PracaConvergencia'],
            npcs: ['dançarina_correntes']
        },
        SalaoEquilibrio: {
            name: 'Salão do Equilíbrio',
            mapId: 'akari',
            level: 11,
            emoji: '⚖️',
            description: 'Sede dos Equilibristas. Um salão circular com elementos das três facções harmoniosamente integrados.',
            background: 'radial-gradient(circle, #FDE68A 0%, #FCD34D 40%, #F59E0B 80%)',
            music: 'harmony_hall_theme',
            connections: ['PracaConvergencia'],
            npcs: ['sabio_equilibrio']
        }
    },

    // Novos Personagens das Facções
    characters: {
        mediador_anciao: {
            name: 'Ancião Harmonius',
            title: 'Mediador da Convergência',
            emoji: '🧙‍♂️',
            description: 'Um sábio ancião que há décadas facilita o diálogo entre as facções. Seus olhos refletem a sabedoria de quem compreende todas as perspectivas.',
            currentProblem: 'As tensões entre as facções estão aumentando e ele precisa de ajuda para restaurar o equilíbrio.',
            questId: 'diplomacia_convergente',
            faction: 'equilibristas'
        },
        arquiteta_cristal: {
            name: 'Mestra Geometria',
            title: 'Arquiteta dos Cristalinos',
            emoji: '👩‍🔬',
            description: 'Uma perfeccionista brilhante que projeta estruturas cristalinas de beleza matemática. Cada linha que traça segue proporções áureas.',
            currentProblem: 'Está obcecada em criar o cristal perfeito, mas sua rigidez está impedindo a inovação.',
            questId: 'perfeicao_flexivel',
            faction: 'cristalinos'
        },
        dançarina_correntes: {
            name: 'Luna Fluência',
            title: 'Dançarina das Correntes',
            emoji: '💃',
            description: 'Uma artista que expressa a filosofia Fluida através de movimentos que nunca se repetem. Cada gesto é uma nova descoberta.',
            currentProblem: 'Sua constante mudança está causando instabilidade em seus relacionamentos.',
            questId: 'fluidez_constante',
            faction: 'fluidos'
        },
        sabio_equilibrio: {
            name: 'Mestre Ponderação',
            title: 'Sábio do Equilíbrio',
            emoji: '🧘‍♂️',
            description: 'Um filósofo que dedica sua vida a compreender todos os lados de cada questão. Sua sabedoria vem da capacidade de ver múltiplas verdades.',
            currentProblem: 'Sua indecisão constante está paralisando decisões importantes para sua facção.',
            questId: 'decisao_equilibrada',
            faction: 'equilibristas'
        }
    },

    // Novas Missões das Facções
    quests: {
        diplomacia_convergente: {
            id: 'diplomacia_convergente',
            title: 'A Diplomacia da Convergência',
            description: 'Ajude o Ancião Harmonius a mediar um conflito crescente entre as três facções e restaurar a harmonia na Praça da Convergência.',
            scenario: 'PracaConvergencia',
            npc: 'mediador_anciao',
            type: 'faction_diplomacy',
            difficulty: 'advanced',
            requiredPotion: 'MEDIAÇÃO',
            status: 'available',
            objectives: [
                'Converse com representantes das três facções',
                'Identifique as necessidades subjacentes de cada grupo',
                'Crie a poção MEDIAÇÃO usando empatia, paciência e sabedoria',
                'Facilite um diálogo construtivo entre as facções',
                'Estabeleça um acordo que honre as necessidades de todos'
            ],
            rewards: {
                experience: 750,
                items: ['emblema_mediador'],
                factionReputation: {
                    cristalinos: 10,
                    fluidos: 10,
                    equilibristas: 25
                }
            },
            dialogueTree: {
                start: {
                    text: "Jovem Emissário, as tensões entre as facções nunca estiveram tão altas. Cada grupo se fecha em suas certezas, esquecendo que a verdade tem muitas faces.",
                    options: [
                        { text: "Como posso ajudar a restaurar a harmonia?", next: "help_offer" },
                        { text: "Por que as facções estão em conflito?", next: "conflict_explanation" },
                        { text: "Cada facção deveria resolver seus próprios problemas.", next: "dismissive_response" }
                    ]
                },
                help_offer: {
                    text: "Sua disposição em ajudar já é um primeiro passo. Preciso que você visite cada facção, ouça suas preocupações reais - não apenas suas posições - e depois nos ajude a encontrar um caminho comum.",
                    options: [
                        { text: "Vou conversar com cada facção com mente aberta.", next: "empathetic_approach", factionChange: { equilibristas: 5 } },
                        { text: "Vou mostrar a cada uma por que estão erradas.", next: "confrontational_approach", factionChange: { equilibristas: -5 } }
                    ]
                },
                conflict_explanation: {
                    text: "Os Cristalinos acusam os Fluidos de serem irresponsáveis. Os Fluidos veem os Cristalinos como rígidos demais. E nós, Equilibristas, somos vistos como indecisos por ambos.",
                    options: [
                        { text: "Cada perspectiva tem sua validade.", next: "balanced_view", factionChange: { equilibristas: 3 } },
                        { text: "Alguém precisa estar certo nessa situação.", next: "binary_thinking", factionChange: { equilibristas: -3 } }
                    ]
                }
            }
        },
        
        perfeicao_flexivel: {
            id: 'perfeicao_flexivel',
            title: 'A Perfeição Flexível',
            description: 'Ajude Mestra Geometria a compreender que a verdadeira perfeição pode incluir imperfeições intencionais e adaptabilidade.',
            scenario: 'LaboratorioCristalino',
            npc: 'arquiteta_cristal',
            type: 'cognitive_restructuring',
            difficulty: 'intermediate',
            requiredPotion: 'DIPLOMACIA',
            status: 'available',
            objectives: [
                'Examine os projetos "imperfeitos" de Mestra Geometria',
                'Identifique a distorção cognitiva do pensamento dicotômico',
                'Crie a poção DIPLOMACIA usando esperança, sabedoria e calma',
                'Demonstre como imperfeições podem criar beleza única',
                'Ajude-a a aceitar que perfeição pode incluir flexibilidade'
            ],
            rewards: {
                experience: 600,
                items: ['cristal_flexivel'],
                factionReputation: {
                    cristalinos: 20,
                    fluidos: 5,
                    equilibristas: 5
                }
            }
        },

        fluidez_constante: {
            id: 'fluidez_constante',
            title: 'A Fluidez Constante',
            description: 'Ajude Luna Fluência a encontrar pontos de estabilidade em sua natureza fluida sem perder sua essência criativa.',
            scenario: 'JardimFluido',
            npc: 'dançarina_correntes',
            type: 'emotional_regulation',
            difficulty: 'intermediate',
            requiredPotion: 'ASSERTIVIDADE',
            status: 'available',
            objectives: [
                'Observe a dança de Luna e identifique padrões',
                'Reconheça como a mudança constante afeta relacionamentos',
                'Crie a poção ASSERTIVIDADE usando coragem, autoconfiança e compaixão',
                'Ensine técnicas de comunicação sobre necessidades de mudança',
                'Ajude-a a criar "âncoras" emocionais estáveis'
            ],
            rewards: {
                experience: 600,
                items: ['essencia_fluidez'],
                factionReputation: {
                    cristalinos: 5,
                    fluidos: 20,
                    equilibristas: 5
                }
            }
        },

        decisao_equilibrada: {
            id: 'decisao_equilibrada',
            title: 'A Decisão Equilibrada',
            description: 'Ajude Mestre Ponderação a superar sua indecisão patológica e tomar decisões sábias mesmo com informações incompletas.',
            scenario: 'SalaoEquilibrio',
            npc: 'sabio_equilibrio',
            type: 'decision_making',
            difficulty: 'intermediate',
            requiredPotion: 'LIDERANÇA',
            status: 'available',
            objectives: [
                'Analise as decisões pendentes de Mestre Ponderação',
                'Identifique como a indecisão está prejudicando sua facção',
                'Crie a poção LIDERANÇA usando coragem, sabedoria e esperança',
                'Ensine técnicas de tomada de decisão com incerteza',
                'Ajude-o a tomar uma decisão importante para sua facção'
            ],
            rewards: {
                experience: 600,
                items: ['balança_sabedoria'],
                factionReputation: {
                    cristalinos: 5,
                    fluidos: 5,
                    equilibristas: 20
                }
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
