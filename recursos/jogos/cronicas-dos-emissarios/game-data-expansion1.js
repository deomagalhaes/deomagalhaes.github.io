// ===== CRÔNICAS DOS EMISSÁRIOS - EXPANSÃO 1: AS TERRAS DE AKARI =====

function loadExpansion1() {
    console.log("📜 Carregando Expansão 1: As Terras de Akari...");

    // Adicione estes objetos ao seu GAME_DATA principal

// Estados emocionais base para o jogador e NPCs
GAME_DATA.emotionalStates = {
    // Estado inicial do jogador
    akari: { calma: 70, empatia: 60, assertividade: 50, resiliencia: 60 },
    // Estado do oponente
    mediador_anciao: { calma: 80, empatia: 40, assertividade: 70, resiliencia: 85 }
};

// Definição do que cada ação faz no combate
GAME_DATA.emotionalActions = {
    empathize: {
        name: "Empatizar",
        emoji: "💙",
        message: "Você tenta entender o ponto de vista dele, diminuindo a tensão.",
        effects: {
            self: { calma: 5, empatia: 10, assertividade: -5, resiliencia: 0 },
            opponent: { calma: 10, empatia: 5, assertividade: -10, resiliencia: 0 }
        }
    },
    reason: {
        name: "Argumentar",
        emoji: "🧠",
        message: "Você apresenta um argumento lógico, mas ele parece mais focado no sentimento.",
        effects: {
            self: { calma: 0, empatia: -5, assertividade: 10, resiliencia: 0 },
            opponent: { calma: -5, empatia: -5, assertividade: 5, resiliencia: 0 }
        }
    },
    attack: {
        name: "Atacar",
        emoji: "💥",
        message: "Sua agressividade aumenta a hostilidade dele e desestabiliza você!",
        effects: { // Agressão tem um custo alto
            self: { calma: -15, empatia: -10, assertividade: 5, resiliencia: -5 },
            opponent: { calma: -10, empatia: -15, assertividade: 15, resiliencia: 0 }
        }
    }
};



    // ===== NOVOS CENÁRIOS (MAPA: AKARI) =====
    Object.assign(GAME_DATA.scenarios, {
        PracaConvergencia: {
            name: 'Praça da Convergência',
            mapId: 'akari',
            level: 8,
            emoji: '🏛️',
            description: 'O ponto de encontro central de Akari, onde as três grandes facções se encontram. Mosaicos no chão representam as diferentes filosofias em uma harmonia tênue e frágil.',
            background: 'linear-gradient(135deg, #E0E7FF 0%, #A7F3D0 50%, #FDE68A 100%)',
            music: 'market_theme', // Reutilizando ou crie 'convergence_theme'
            connections: ['LaboratorioCristalino', 'JardimFluido', 'SalaoEquilibrio'],
            npcs: ['mediador_anciao']
        },
        LaboratorioCristalino: {
            name: 'Laboratório Cristalino',
            mapId: 'akari',
            level: 9,
            emoji: '🔬',
            description: 'A sede dos Cristalinos. Um ambiente de ordem impecável, onde cristais geometricamente perfeitos pulsam com uma luz fria e lógica. O ar é estéril e silencioso.',
            background: 'linear-gradient(180deg, #E0E7FF 0%, #C7D2FE 50%, #A5B4FC 100%)',
            music: 'mountain_theme', // Reutilizando ou crie 'crystal_theme'
            connections: ['PracaConvergencia'],
            npcs: ['arquiteta_cristal']
        },
        JardimFluido: {
            name: 'Jardim Fluido',
            mapId: 'akari',
            level: 9,
            emoji: '🌿',
            description: 'O domínio dos Fluidos. Um jardim orgânico e caótico que está em constante transformação. Plantas exóticas crescem e murcham em ciclos rápidos, e riachos mudam de curso a cada hora.',
            background: 'linear-gradient(45deg, #A7F3D0 0%, #6EE7B7 30%, #34D399 70%, #10B981 100%)',
            music: 'forest_theme', // Reutilizando ou crie 'fluid_theme'
            connections: ['PracaConvergencia'],
            npcs: ['dancarino_correntes']
        },
        SalaoEquilibrio: {
            name: 'Salão do Equilíbrio',
            mapId: 'akari',
            level: 9,
            emoji: '⚖️',
            description: 'O refúgio dos Equilibristas. Um salão circular onde elementos das outras duas facções são integrados em uma harmonia pacífica. O som suave de sinos de vento preenche o ar.',
            background: 'radial-gradient(circle, #FDE68A 0%, #FCD34D 40%, #F59E0B 80%)',
            music: 'lake_theme', // Reutilizando ou crie 'harmony_theme'
            connections: ['PracaConvergencia'],
            npcs: ['sabio_equilibrio']
        }
    });

    // ===== NOVAS FACÇÕES =====
    Object.assign(GAME_DATA.factions, {
        cristalinos: {
            name: 'Os Cristalinos',
            philosophy: 'A perfeição é o único caminho para a verdade.',
            emoji: '💎',
            description: 'Perfeccionistas que buscam ordem e precisão. Valorizam protocolos e lógica acima de tudo, mas sua rigidez pode levar ao pensamento "tudo ou nada".'
        },
        fluidos: {
            name: 'Os Fluidos',
            philosophy: 'A mudança é a única constante; flexibilidade é força.',
            emoji: '🌊',
            description: 'Adaptáveis e criativos, abraçam a mudança e a inovação. Valorizam a espontaneidade, mas podem ter dificuldade com compromissos e estrutura.'
        },
        equilibristas: {
            name: 'Os Equilibristas',
            philosophy: 'Toda verdade tem múltiplas faces; harmonia é sabedoria.',
            emoji: '⚖️',
            description: 'Mediadores naturais que buscam harmonia e compreensão mútua. Valorizam o consenso, mas sua busca por equilíbrio pode levar à indecisão.'
        }
    });

    // ===== NOVOS PERSONAGENS (NPCS) =====
    Object.assign(GAME_DATA.characters, {
        mediador_anciao: {
            name: 'Ancião Harmonius',
            title: 'Mediador da Convergência',
            emoji: '🧘‍♂️',
            description: 'Um sábio que há décadas facilita o diálogo entre as facções. Seus olhos refletem a sabedoria de quem compreende todas as perspectivas.',
            personality: 'Paciente, sábio, mas cansado. Sente o peso da crescente divisão entre as facções e teme que a harmonia esteja se perdendo.',
            background: 'Foi um dos fundadores da Praça da Convergência, um projeto para unir as diferentes filosofias de Akari.',
            currentProblem: 'As tensões entre as facções estão no auge devido a um projeto de recurso compartilhado. Ele precisa de um olhar de fora para ajudar a mediar.',
            questId: 'diplomacia_convergente',
            faction: 'equilibristas'
        },
        arquiteta_cristal: {
            name: 'Mestra Livia',
            title: 'Arquiteta dos Cristalinos',
            emoji: '👩‍🔬',
            description: 'Uma perfeccionista brilhante que projeta estruturas de cristal. Sua busca pela perfeição a cega para outras possibilidades.',
            personality: 'Lógica, precisa, e com uma visão de "certo ou errado". Acha difícil lidar com a "bagunça" das emoções e da flexibilidade.',
            background: 'Desde jovem, encontrou conforto na ordem e na previsibilidade da geometria. Para ela, um cristal imperfeito é uma falha pessoal.',
            currentProblem: 'Está obcecada em criar um "Cristal de Foco" perfeito para o projeto compartilhado, rejeitando qualquer material que não seja 100% puro, o que está paralisando o progresso.',
            questId: 'perfeicao_flexivel',
            faction: 'cristalinos'
        },
        dancarino_correntes: {
            name: 'Kael',
            title: 'Dançarino das Correntes',
            emoji: '🕺',
            description: 'Um artista que expressa a filosofia Fluida através de movimentos que nunca se repetem. Sua energia é contagiante, mas inconstante.',
            personality: 'Criativo, espontâneo e avesso a qualquer tipo de rotina ou compromisso. Vive o momento, mas tem dificuldade em construir algo duradouro.',
            background: 'Cresceu em uma comunidade que valoriza a liberdade acima de tudo. Para ele, planos e promessas são como gaiolas.',
            currentProblem: 'Sua incapacidade de se comprometer com um design para o projeto compartilhado está frustrando as outras facções. Ele traz novas ideias todos os dias, impedindo qualquer avanço.',
            questId: 'fluidez_constante',
            faction: 'fluidos'
        },
        sabio_equilibrio: {
            name: 'Mestre Ponderon',
            title: 'Sábio do Equilíbrio',
            emoji: '🤔',
            description: 'Um filósofo que dedica sua vida a compreender todos os lados de cada questão. Sua sabedoria vem da capacidade de ver múltiplas verdades.',
            personality: 'Atencioso, compreensivo e extremamente cauteloso. Ele tem tanto medo de tomar a decisão errada que muitas vezes não toma nenhuma.',
            background: 'Testemunhou uma decisão precipitada que levou a um grande desastre em sua juventude, o que o traumatizou e o tornou excessivamente cauteloso.',
            currentProblem: 'Sua indecisão sobre qual abordagem apoiar no projeto compartilhado está criando um impasse, pois sua facção é o voto de minerva.',
            questId: 'decisao_equilibrada',
            faction: 'equilibristas'
        }
    });

    // ===== NOVAS MISSÕES =====
    Object.assign(GAME_DATA.quests, {
        diplomacia_convergente: {
            id: 'diplomacia_convergente',
            title: 'A Diplomacia da Convergência',
            description: 'Ajude o Ancião Harmonius a mediar o conflito crescente entre as três facções e restaurar a harmonia na Praça da Convergência.',
            scenario: 'PracaConvergencia',
            npc: 'mediador_anciao',
            type: 'faction_diplomacy',
            difficulty: 'advanced',
            requiredPotion: 'HARMONIA',
            status: 'available',
            objectives: [
                'Converse com representantes das três facções.',
                'Identifique as necessidades subjacentes de cada grupo.',
                'Crie a poção da HARMONIA.',
                'Facilite um diálogo construtivo entre as facções.'
            ],
            rewards: {
                experience: 750,
                items: [], // Poderia ser um item que aumenta reputação
                factionReputation: { cristalinos: 10, fluidos: 10, equilibristas: 20 }
            },
            dialogueTree: {
                start: {
                    text: "Emissário, que bom vê-lo. As energias em Akari estão dissonantes. As facções, que antes se complementavam, agora se repelem. Preciso de sua ajuda para encontrar a harmonia novamente.",
                    options: [
                        { text: "Qual é a raiz do conflito?", next: "conflict_explanation" },
                        { text: "Farei o que puder para ajudar.", next: "offer_help" },
                        { text: "Isso é perda de tempo. Eles precisam de uma lição, não de conversa.", choiceId: "iniciar_conflito", next: "confrontation_start" }
                    ]
                },
                conflict_explanation: {
                    text: "Estamos tentando construir um novo Condutor de Energia Etérea. Os Cristalinos exigem perfeição absoluta, os Fluidos querem experimentar com designs orgânicos, e os Equilibristas não conseguem decidir um caminho. O projeto está parado.",
                    options: [
                        { text: "Entendo. Vou conversar com todos.", next: "minigame_trigger" }
                    ]
                },
                offer_help: {
                    text: "Sua disposição já é um bálsamo. Para unir três pontos de vista tão distintos, precisaremos de uma poderosa poção da Harmonia. Você pode criá-la?",
                    options: [
                        { text: "Sim, vou preparar a poção da Harmonia.", next: "minigame_start" }
                    ]
                },

                confrontation_start: {
    text: "Sua impaciência é um reflexo da própria dissonância que busco curar! Se acredita que o confronto é o caminho, então sinta o peso do desequilíbrio que você mesmo provoca!",
    options: [{text: "Batalha!", next: "confrontation_start"}
    ]
},

                minigame_trigger: {
                    text: "Para mediar esta conversa, precisaremos de uma poção que inspire a Harmonia. Ela nos ajudará a encontrar o ponto de equilíbrio entre ordem, caos e ponderação.",
                    options: [
                        { text: "Vou criá-la agora mesmo.", next: "minigame_start" }
                    ]
                },
                minigame_success: {
                    text: "Excelente. Com esta poção, podemos iniciar a mediação. Sua tarefa agora é visitar cada líder de facção. Ouça-os, compreenda-os, e então os traga para a Praça para conversarmos.",
                    options: [
                        { text: "Considera feito. A harmonia prevalecerá.", next: "quest_complete" }
                    ]
                },
                quest_complete: {
                    text: "Você preparou o terreno para a paz, Emissário. A jornada será longa, mas o primeiro passo foi dado. Você ganhou o respeito das três facções.",
                    options: [],
                    reward: true
                }
            }
        },

        // Adicione este objeto dentro de GAME_DATA.quests, junto com 'diplomacia_convergente'

    conflito_cristalino: {
    id: 'conflito_cristalino',
    title: 'Conflito Cristalino',
    description: 'Um confronto direto com o Ancião Harmonius sobre a melhor forma de resolver o impasse.',
    type: 'emotional_combat', // TIPO CORRETO!
    npc: 'mediador_anciao',
    status: 'hidden', // Missão não visível na lista normal
    emotionalCombat: {
        winConditions: { selfCalma: 80, opponentEmpatia: 60 },
        loseConditions: { selfCalma: 20, opponentAssertividade: 90, aggressiveActions: 3 }
    },
    // ===== SUBSTITUA ESTE BLOCO INTEIRO NA MISSÃO 'conflito_cristalino' =====

dialogueTree: {
    start: {
        text: "Você sente a tensão aumentar. Harmonius parece desapontado, mas firme. 'A impaciência raramente constrói pontes, Emissário. Mostre-me como sua abordagem pode trazer um resultado melhor.'",
        options: [
            { text: "Tentar acalmar a situação.", action: "empathize", next: "round_2_calm" },
            { text: "Argumentar logicamente.", action: "reason", next: "round_2_logic" },
            { text: "Insistir que seu método é o certo.", action: "attack", next: "round_2_aggressive" }
        ]
    },

    // --- NÓS DA SEGUNDA RODADA (PREENCHIDOS) ---
    round_2_calm: {
        text: "Harmonius respira fundo, a tensão em seus ombros diminui um pouco. 'Acalmar é o primeiro passo, mas e a solução? O que propõe?'",
        options: [
            { text: "Sugerir uma mediação com um novo foco.", action: "empathize", next: "final_empathy" },
            { text: "Apontar as falhas de cada facção.", action: "reason", next: "final_logic" }
        ]
    },
    round_2_logic: {
        text: "Seus argumentos são precisos, mas Harmonius balança a cabeça. 'A lógica não cura corações divididos. Eles não precisam de mais razões, precisam de um terreno comum.'",
        options: [
            { text: "Concordar e focar na empatia.", action: "empathize", next: "final_empathy" },
            { text: "Dobrar a aposta na lógica.", action: "attack", next: "final_aggressive" }
        ]
    },
    round_2_aggressive: {
        text: "A expressão de Harmonius endurece. 'A força só gera resistência. Você está se tornando parte do problema, não da solução.' A assertividade dele aumenta drasticamente.",
        options: [
            { text: "Recuar e pedir desculpas.", action: "empathize", next: "round_2_calm" },
            { text: "Continuar a pressionar.", action: "attack", next: "final_aggressive" }
        ]
    },

    // --- NÓS FINAIS (RESULTADOS) ---
    final_empathy: {
        text: "Você sente a conexão se restabelecer. Harmonius assente. 'Sim... é disso que precisamos. Um novo começo, guiado pela compreensão.'",
        isEnd: true, // Propriedade para indicar o fim do combate
        outcome: 'success' // Resultado da batalha
    },
    final_logic: {
        text: "Ao focar apenas nos erros, você aprofunda as feridas. O conflito se torna insuperável.",
        isEnd: true,
        outcome: 'failure'
    },
    final_aggressive: {
        text: "Sua insistência quebrou qualquer chance de diálogo. Harmonius se retira, e o peso do fracasso recai sobre você.",
        isEnd: true,
        outcome: 'failure'
    }
}
    }


        perfeicao_flexivel: {
            id: 'perfeicao_flexivel',
            title: 'A Perfeição Flexível',
            description: 'Ajude a Mestra Livia a compreender que a verdadeira perfeição pode incluir imperfeições que trazem beleza e funcionalidade.',
            scenario: 'LaboratorioCristalino',
            npc: 'arquiteta_cristal',
            type: 'perfectionism_balance',
            difficulty: 'intermediate',
            requiredPotion: 'FLEXIBILIDADE',
            status: 'available',
            objectives: [
                'Converse com Mestra Livia sobre sua obsessão pela perfeição.',
                'Demonstre como pequenas imperfeições podem ser valiosas.',
                'Crie a poção da FLEXIBILIDADE.',
                'Ajude-a a aceitar um design "imperfeito" mas funcional.'
            ],
            rewards: {
                experience: 500,
                items: ['cristal_harmonico'],
                factionReputation: { cristalinos: 15, equilibristas: 5 }
            },
            dialogueTree: {
                start: {
                    text: "Emissário, observe este cristal. Há uma minúscula imperfeição na estrutura molecular. É inaceitável! Como posso usar algo falho no projeto da Convergência?",
                    options: [
                        { text: "Essa imperfeição pode ser única e valiosa.", next: "challenge_perfection" },
                        { text: "Você tem razão, a perfeição é essencial.", next: "agree_perfection" },
                        { text: "E se essa 'falha' trouxer uma qualidade especial?", next: "reframe_flaw" }
                    ]
                },
                challenge_perfection: {
                    text: "Única? Valiosa? Impossível! A perfeição é matemática, é absoluta. Não há espaço para... para... caos em minha obra!",
                    options: [
                        { text: "Vou mostrar como a flexibilidade pode ser perfeita.", next: "minigame_start" },
                        { text: "Talvez devêssemos repensar o conceito de perfeição.", next: "philosophy_discussion" }
                    ]
                },
                agree_perfection: {
                    text: "Finalmente alguém que compreende! Mas então, como resolver este impasse? Não posso usar materiais imperfeitos, mas os Fluidos insistem em suas 'variações orgânicas'.",
                    options: [
                        { text: "E se houvesse uma forma de unir ordem e variação?", next: "bridge_concepts" }
                    ]
                },
                reframe_flaw: {
                    text: "Qualidade especial? Explique-se. Como uma falha pode ser... benéfica?",
                    options: [
                        { text: "Vou criar uma poção para demonstrar.", next: "minigame_start" },
                        { text: "Pense nas veias de uma folha - imperfeitas, mas funcionais.", next: "nature_analogy" }
                    ]
                },
                philosophy_discussion: {
                    text: "Repensar a perfeição? Isso é... perturbador. Minha vida inteira foi dedicada à precisão absoluta. Como posso questionar isso agora?",
                    options: [
                        { text: "A verdadeira perfeição inclui adaptabilidade.", next: "minigame_start" }
                    ]
                },
                bridge_concepts: {
                    text: "Unir ordem e variação... isso soa contraditório. Mas... talvez haja uma lógica que eu não esteja vendo.",
                    options: [
                        { text: "Deixe-me preparar algo que pode ajudar.", next: "minigame_start" }
                    ]
                },
                nature_analogy: {
                    text: "As veias de uma folha... nunca pensei nisso. Elas são irregulares, mas cada uma tem uma função. Interessante...",
                    options: [
                        { text: "Exato! Vou criar uma poção da Flexibilidade.", next: "minigame_start" }
                    ]
                },
                minigame_success: {
                    text: "Esta poção... sinto uma clareza diferente. Como se pudesse ver a beleza na variação. Talvez... talvez a perfeição não seja rigidez, mas harmonia entre ordem e adaptação.",
                    options: [
                        { text: "Agora você compreende a verdadeira perfeição.", next: "quest_complete" }
                    ]
                },
                quest_complete: {
                    text: "Obrigada, Emissário. Vou redesenhar o Cristal de Foco para incluir essas 'imperfeições funcionais'. Talvez isso seja exatamente o que o projeto precisa.",
                    options: [],
                    reward: true
                }
            }
        },

        fluidez_constante: {
            id: 'fluidez_constante',
            title: 'A Fluidez Constante',
            description: 'Ajude Kael a encontrar um equilíbrio entre sua natureza fluida e a necessidade de compromissos duradouros.',
            scenario: 'JardimFluido',
            npc: 'dancarino_correntes',
            type: 'commitment_balance',
            difficulty: 'intermediate',
            requiredPotion: 'COMPROMISSO',
            status: 'available',
            objectives: [
                'Converse com Kael sobre sua dificuldade com compromissos.',
                'Mostre como a constância pode coexistir com a fluidez.',
                'Crie a poção do COMPROMISSO.',
                'Ajude-o a se comprometer com um design para o projeto.'
            ],
            rewards: {
                experience: 500,
                items: ['semente_adaptavel'],
                factionReputation: { fluidos: 15, equilibristas: 5 }
            },
            dialogueTree: {
                start: {
                    text: "Ah, Emissário! Que bom que chegou! Tenho dezessete novas ideias para o projeto hoje! Ou talvez dezoito... ou seria melhor começar do zero? O que acha?",
                    options: [
                        { text: "Suas ideias são valiosas, mas precisamos escolher uma.", next: "choice_anxiety" },
                        { text: "Que tal explorarmos todas elas primeiro?", next: "enable_chaos" },
                        { text: "E se combinássemos as melhores partes de cada uma?", next: "synthesis_approach" }
                    ]
                },
                choice_anxiety: {
                    text: "Escolher uma? Mas e se eu escolher errado? E se houver algo melhor amanhã? Não posso me prender a uma única ideia - isso vai contra minha natureza!",
                    options: [
                        { text: "Compreendo seu medo. Vamos trabalhar nisso juntos.", next: "empathy_approach" },
                        { text: "Às vezes, escolher é um ato de coragem.", next: "courage_discussion" }
                    ]
                },
                enable_chaos: {
                    text: "Sim! Você entende! Vamos explorar tudo! Podemos fazer um design que muda a cada dia, ou talvez a cada hora! Seria revolucionário!",
                    options: [
                        { text: "Mas como os outros vão trabalhar com algo sempre mudando?", next: "reality_check" }
                    ]
                },
                synthesis_approach: {
                    text: "Combinar... isso é interessante. Mas como manter a essência fluida se tudo ficar fixo em uma forma final?",
                    options: [
                        { text: "E se a forma final incluísse capacidade de adaptação?", next: "adaptive_design" }
                    ]
                },
                empathy_approach: {
                    text: "Você realmente compreende... A maioria das pessoas não entende que para mim, cada escolha é como uma pequena morte. Mata todas as outras possibilidades.",
                    options: [
                        { text: "Vou preparar algo que pode ajudar com isso.", next: "minigame_start" }
                    ]
                },
                courage_discussion: {
                    text: "Coragem? Nunca pensei nisso dessa forma. Sempre vi as escolhas como limitações, não como atos corajosos...",
                    options: [
                        { text: "Deixe-me mostrar uma nova perspectiva.", next: "minigame_start" }
                    ]
                },
                reality_check: {
                    text: "Os outros... sim, eles precisam de algo estável para trabalhar. Mas como posso dar estabilidade sem trair minha natureza?",
                    options: [
                        { text: "Vamos encontrar um meio termo.", next: "minigame_start" }
                    ]
                },
                adaptive_design: {
                    text: "Capacidade de adaptação... como um rio que mantém seu curso mas se adapta às pedras... Isso faz sentido!",
                    options: [
                        { text: "Exato! Vou preparar uma poção para fortalecer essa ideia.", next: "minigame_start" }
                    ]
                },
                minigame_success: {
                    text: "Esta poção... sinto uma força estranha. Como se pudesse me comprometer sem me perder. Talvez... talvez eu possa criar algo duradouro que ainda seja verdadeiramente meu.",
                    options: [
                        { text: "Agora você pode ser fluido E constante.", next: "quest_complete" }
                    ]
                },
                quest_complete: {
                    text: "Obrigado, Emissário. Vou me comprometer com um design base para o projeto - mas um que pode evoluir com o tempo. Isso é... libertador!",
                    options: [],
                    reward: true
                }
            }
        },

        decisao_equilibrada: {
            id: 'decisao_equilibrada',
            title: 'A Decisão Equilibrada',
            description: 'Ajude Mestre Ponderon a superar sua paralisia decisória e encontrar coragem para tomar decisões importantes.',
            scenario: 'SalaoEquilibrio',
            npc: 'sabio_equilibrio',
            type: 'decision_courage',
            difficulty: 'intermediate',
            requiredPotion: 'DECISAO',
            status: 'available',
            objectives: [
                'Converse com Mestre Ponderon sobre sua indecisão.',
                'Ajude-o a compreender que nem toda decisão precisa ser perfeita.',
                'Crie a poção da DECISÃO.',
                'Encoraje-o a tomar uma posição no projeto da Convergência.'
            ],
            rewards: {
                experience: 500,
                items: ['balanca_sabedoria'],
                factionReputation: { equilibristas: 15, cristalinos: 5, fluidos: 5 }
            },
            dialogueTree: {
                start: {
                    text: "Emissário, que dilema terrível! Cada facção apresenta argumentos válidos. Os Cristalinos têm razão sobre a precisão, os Fluidos sobre a adaptabilidade... Como posso escolher sem causar injustiça?",
                    options: [
                        { text: "Nem toda decisão precisa ser perfeita.", next: "perfection_pressure" },
                        { text: "Qual é o seu maior medo ao decidir?", next: "fear_exploration" },
                        { text: "E se não decidir também for uma escolha?", next: "inaction_consequence" }
                    ]
                },
                perfection_pressure: {
                    text: "Não perfeita? Mas uma decisão errada pode causar tanto sofrimento! Lembro-me de quando era jovem... uma escolha precipitada levou ao desastre. Não posso repetir isso.",
                    options: [
                        { text: "Conte-me sobre essa experiência passada.", next: "trauma_exploration" },
                        { text: "Você aprendeu desde então. Não é mais aquela pessoa.", next: "growth_recognition" }
                    ]
                },
                fear_exploration: {
                    text: "Meu maior medo? Causar dor desnecessária. Cada decisão afeta vidas, e eu... eu carrego o peso de todas as consequências possíveis.",
                    options: [
                        { text: "Mas a indecisão também causa sofrimento.", next: "inaction_pain" },
                        { text: "Você não pode controlar todas as consequências.", next: "control_illusion" }
                    ]
                },
                inaction_consequence: {
                    text: "Não decidir... sim, isso também é uma escolha, não é? E talvez seja a pior de todas, pois mantém todos em suspense e impede o progresso.",
                    options: [
                        { text: "Exato. Às vezes, uma decisão imperfeita é melhor que nenhuma.", next: "action_courage" }
                    ]
                },
                trauma_exploration: {
                    text: "Foi há décadas... Eu era jovem e confiante. Tomei uma decisão rápida sobre a distribuição de recursos, e isso levou a conflitos que duraram anos. Desde então, questiono cada escolha.",
                    options: [
                        { text: "Mas você também evitou muitos conflitos com sua sabedoria.", next: "wisdom_recognition" },
                        { text: "Vamos trabalhar para curar essa ferida antiga.", next: "healing_approach" }
                    ]
                },
                growth_recognition: {
                    text: "Não sou mais aquela pessoa... isso é verdade. Aprendi muito, desenvolvi sabedoria. Talvez... talvez seja hora de confiar nesse crescimento.",
                    options: [
                        { text: "Sua sabedoria atual pode guiar suas decisões.", next: "minigame_start" }
                    ]
                },
                inaction_pain: {
                    text: "Você tem razão. Vejo o sofrimento nos olhos dos outros enquanto esperam. Minha indecisão se tornou uma fonte de dor que eu queria evitar.",
                    options: [
                        { text: "Vamos encontrar coragem para agir.", next: "minigame_start" }
                    ]
                },
                control_illusion: {
                    text: "Controlar todas as consequências... isso é impossível, não é? Talvez minha busca por controle total seja o que me paralisa.",
                    options: [
                        { text: "A sabedoria está em aceitar a incerteza.", next: "minigame_start" }
                    ]
                },
                action_courage: {
                    text: "Uma decisão imperfeita... isso requer coragem que não sei se possuo. Mas talvez seja hora de encontrá-la.",
                    options: [
                        { text: "Vou ajudá-lo a encontrar essa coragem.", next: "minigame_start" }
                    ]
                },
                wisdom_recognition: {
                    text: "É verdade... minha cautela evitou muitos problemas. Talvez eu possa usar essa mesma sabedoria para tomar decisões construtivas.",
                    options: [
                        { text: "Sua sabedoria é um dom. Vamos usá-la.", next: "minigame_start" }
                    ]
                },
                healing_approach: {
                    text: "Curar essa ferida... nunca pensei nisso dessa forma. Talvez seja hora de perdoar meu eu mais jovem e seguir em frente.",
                    options: [
                        { text: "Vou preparar algo para ajudar nessa cura.", next: "minigame_start" }
                    ]
                },
                minigame_success: {
                    text: "Esta poção... sinto uma clareza que não tinha há décadas. A coragem de decidir, mesmo na incerteza. Posso fazer isso... posso escolher um caminho para o bem de todos.",
                    options: [
                        { text: "Sua decisão será sábia e necessária.", next: "quest_complete" }
                    ]
                },
                quest_complete: {
                    text: "Obrigado, Emissário. Tomarei uma decisão sobre o projeto. Não será perfeita, mas será feita com sabedoria e amor. Isso é suficiente.",
                    options: [],
                    reward: true
                }
            }
        }
    });

    // ===== NOVAS RECEITAS DE POÇÕES =====
    Object.assign(GAME_DATA.recipes, {
        'FLEXIBILIDADE': {
            ingredients: ['rigidez', 'adaptacao'],
            emoji: '🌿',
            description: 'A capacidade de manter a essência enquanto se adapta às circunstâncias',
            effect: 'Permite ver a beleza na imperfeição e encontrar força na adaptabilidade'
        },
        'COMPROMISSO': {
            ingredients: ['liberdade', 'responsabilidade'],
            emoji: '🤝',
            description: 'O equilíbrio entre autonomia pessoal e responsabilidade coletiva',
            effect: 'Fortalece a capacidade de fazer promessas duradouras sem perder a identidade'
        },
        'DECISAO': {
            ingredients: ['sabedoria', 'coragem'],
            emoji: '⚡',
            description: 'A força para escolher um caminho mesmo na incerteza',
            effect: 'Dissolve a paralisia decisória e fortalece a confiança nas próprias escolhas'
        },
        'HARMONIA': {
            ingredients: ['ordem', 'caos'],
            emoji: '☯️',
            description: 'O equilíbrio perfeito entre estrutura e flexibilidade',
            effect: 'Permite mediar conflitos e encontrar pontos de convergência entre opostos'
        }
    });

    // ===== NOVOS INGREDIENTES EMOCIONAIS =====
    Object.assign(GAME_DATA.potions, {
        rigidez: {
            name: 'Rigidez',
            color: '#6B7280',
            emoji: '🗿',
            description: 'A tendência de manter estruturas fixas e resistir à mudança'
        },
        adaptacao: {
            name: 'Adaptação',
            color: '#10B981',
            emoji: '🌱',
            description: 'A capacidade natural de se ajustar a novas circunstâncias'
        },
        liberdade: {
            name: 'Liberdade',
            color: '#3B82F6',
            emoji: '🕊️',
            description: 'O impulso de manter autonomia e evitar limitações'
        },
        responsabilidade: {
            name: 'Responsabilidade',
            color: '#F59E0B',
            emoji: '⚖️',
            description: 'O senso de dever e compromisso com outros e com objetivos maiores'
        },
        ordem: {
            name: 'Ordem',
            color: '#8B5CF6',
            emoji: '📐',
            description: 'A busca por estrutura, previsibilidade e organização'
        },
        caos: {
            name: 'Caos',
            color: '#EF4444',
            emoji: '🌪️',
            description: 'A energia da mudança, criatividade e imprevisibilidade'
        }
    });

    // ===== NOVOS ITENS DE RECOMPENSA =====
    Object.assign(GAME_DATA.items, {
        cristal_harmonico: {
            name: 'Cristal Harmônico',
            emoji: '💎',
            description: 'Um cristal que vibra em perfeita harmonia, unindo ordem e beleza natural',
            type: 'tool',
            effect: 'Revela a beleza oculta nas imperfeições aparentes'
        },
        semente_adaptavel: {
            name: 'Semente Adaptável',
            emoji: '🌰',
            description: 'Uma semente que cresce de forma diferente em cada solo, mas sempre floresce',
            type: 'tool',
            effect: 'Inspira flexibilidade mantendo a essência pessoal'
        },
        balanca_sabedoria: {
            name: 'Balança da Sabedoria',
            emoji: '⚖️',
            description: 'Uma balança que pesa não apenas prós e contras, mas também a coragem necessária para decidir',
            type: 'tool',
            effect: 'Facilita a tomada de decisões equilibradas e corajosas'
        }
    });

    console.log("✅ Expansão 1 carregada com sucesso!");
}

// Executa a função para carregar a expansão assim que o script for lido.
loadExpansion1();
