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


        // Futuramente, as novas missões 'perfeicao_flexivel', 'fluidez_constante' e 'decisao_equilibrada' seriam adicionadas aqui.
    });

    

    console.log("✅ Expansão 1 carregada com sucesso!");
}

// Executa a função para carregar a expansão assim que o script for lido.
loadExpansion1();
