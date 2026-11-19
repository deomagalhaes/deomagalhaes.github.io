/**
 * Catálogo Modular de Escalas e Testes Complementares (Esteira Integrada)
 * Plataforma Clínica Segura — Deo Magalhães (CRP 04/42784)
 *
 * GOVERNANÇA DE INTEGRAÇÃO AUTOMÁTICA (Pilar 3.2 em .agents/rules/regras-esteira.md):
 * Sempre que a esteira publicar um novo teste em `testes/teste-slug.html`,
 * adicione o objeto estruturado correspondente no TOPO deste array `window.SESSAO_CATALOGO_EXTRA`.
 *
 * O motor de `sessao/index.html` consome este catálogo automaticamente para:
 *  - Gerar o card no seletor (com busca e filtro por aba)
 *  - Executar a sessão trancada cronometrada
 *  - Codificar e enviar o protocolo via WhatsApp (sem exibir o laudo ao paciente)
 *  - Destrancar via senha exclusiva do neuropsicólogo e emitir o Laudo A4 timbrado
 *
 * PROIBIÇÕES ESTRITAS:
 *  - Zero notação LaTeX bruta nos textos. Use apenas Unicode nativo e HTML semântico.
 *  - Autor canônico obrigatório: Deo Magalhães (CRP 04/42784), sem títulos médicos abreviados.
 *  - IDs únicos em MAIÚSCULAS com sublinhado (ex: "EMUC_DA", "ECSCM", "EFICA").
 */

window.SESSAO_CATALOGO_EXTRA = [
    {
        id: "EMUC_DA",
        code: "T-57",
        shortTitle: "EMUC-DA (Urgência Crônica)",
        fullTitle: "Escala de Urgência Crônica e Dependência de Adrenalina (EMUC-DA / T-57)",
        cardDescription: "20 itens (4 dimensões). Dependência de pressão, intolerância à quietude e custo autonômico.",
        category: "Regulação & Estresse",
        icon: "flame",
        accentColor: "amber",
        protocolPrefix: "DM-EST-",
        instruction: "Leia cada afirmação abaixo e assinale o quanto ela reflete seu funcionamento habitual nos <strong>últimos meses</strong>.",
        options: [
            { value: 1, label: "Discordo Totalmente", desc: "Não reflete" },
            { value: 2, label: "Discordo Parcialmente", desc: "Pouco frequente" },
            { value: 3, label: "Concordo Parcialmente", desc: "Frequente" },
            { value: 4, label: "Concordo Totalmente", desc: "Reflete muito" }
        ],
        subscales: [
            {
                id: "pressao",
                label: "Ativação por Pressão (LC-NE)",
                desc: "Dependência do pânico de prazo para vencer a inércia executiva e experimentar foco.",
                color: "bg-amber-600"
            },
            {
                id: "quietude",
                label: "Intolerância à Quietude (Alostase)",
                desc: "Rebaixamento motivacional no repouso, tédio inquieto em períodos calmos e fuga do silêncio.",
                color: "bg-indigo-600"
            },
            {
                id: "crises",
                label: "Fabricação de Crises",
                desc: "Acúmulo de compromissos no limite, adiamento estratégico e confusão entre correria e relevância.",
                color: "bg-orange-600"
            },
            {
                id: "autonomico",
                label: "Custo Autonômico (dlPFC / Vagal)",
                desc: "Visão em túnel sob pressão, ressaca pós-entrega e desgaste físico acumulado pela carga simpática.",
                color: "bg-rose-600"
            }
        ],
        items: [
            { id: 1, text: "Sinto que só consigo engatar de verdade e produzir em alta velocidade quando o prazo está quase estourando.", domain: "pressao", domainLabel: "Ativação por Pressão", reverse: false },
            { id: 2, text: "Tarefas importantes com prazo confortável me deixam apático(a) ou travado(a) até que se tornem emergências urgentes.", domain: "pressao", domainLabel: "Ativação por Pressão", reverse: false },
            { id: 3, text: "Costumo dizer (ou acreditar intimamente) que 'trabalho muito melhor sob pressão extrema'.", domain: "pressao", domainLabel: "Ativação por Pressão", reverse: false },
            { id: 4, text: "Experimento uma sensação quase eufórica de clareza e energia quando preciso resolver um grande problema de última hora.", domain: "pressao", domainLabel: "Ativação por Pressão", reverse: false },
            { id: 5, text: "Sem a sensação física de urgência (coração acelerado, risco de atraso), tenho grande dificuldade para manter o ritmo em projetos contínuos.", domain: "pressao", domainLabel: "Ativação por Pressão", reverse: false },

            { id: 6, text: "Em fins de semana calmos ou férias sem cronograma, sinto uma inquietação física incômoda, como se estivesse perdendo algo importante.", domain: "quietude", domainLabel: "Intolerância à Quietude", reverse: false },
            { id: 7, text: "Atividades cotidianas tranquilas (ler devagar, caminhar sem pressa, esperar em uma fila) me parecem insuportavelmente lentas e irritantes.", domain: "quietude", domainLabel: "Intolerância à Quietude", reverse: false },
            { id: 8, text: "Quando não há nenhuma pendência urgente na agenda, sinto um vazio cinzento ou uma vontade súbita de procurar estímulos intensos.", domain: "quietude", domainLabel: "Intolerância à Quietude", reverse: false },
            { id: 9, text: "Tenho dificuldade para permanecer em silêncio sem checar mensagens, acelerar áudios ou preencher cada minuto com alguma tarefa.", domain: "quietude", domainLabel: "Intolerância à Quietude", reverse: false },
            { id: 10, text: "Estar completamente 'em dia' e sem pressão parece estranho, quase como se eu tivesse perdido parte da minha identidade ativa.", domain: "quietude", domainLabel: "Intolerância à Quietude", reverse: false },

            { id: 11, text: "Frequentemente assumo mais compromissos do que o tempo razoável comporta, sabendo que terei de correr para dar conta.", domain: "crises", domainLabel: "Fabricação de Crises", reverse: false },
            { id: 12, text: "Costumo sair atrasado(a) ou deixar deslocamentos e preparativos no limite exato dos minutos para sentir 'emoção' ou agilidade.", domain: "crises", domainLabel: "Fabricação de Crises", reverse: false },
            { id: 13, text: "Mesmo quando prometo a mim mesmo(a) começar com antecedência, acabo adiando até que o problema vire uma pequena crise.", domain: "crises", domainLabel: "Fabricação de Crises", reverse: false },
            { id: 14, text: "No trabalho ou em casa, tendo a priorizar o que grita mais alto no momento, negligenciando o que é importante mas não é urgente.", domain: "crises", domainLabel: "Fabricação de Crises", reverse: false },
            { id: 15, text: "Percebo que, quando minha vida entra nos eixos por algumas semanas, acabo criando algum desafio ou conflito desnecessário para agitar as coisas.", domain: "crises", domainLabel: "Fabricação de Crises", reverse: false },

            { id: 16, text: "Logo após terminar uma maratona de entrega sob pressão, sinto uma 'ressaca' física intensa (exaustão, dor de cabeça, irritabilidade ou apagão).", domain: "autonomico", domainLabel: "Custo Autonômico", reverse: false },
            { id: 17, text: "Sob urgência intensa, sinto que perco visão estratégica de conjunto e passo a reagir no impulso apenas ao que está na minha frente.", domain: "autonomico", domainLabel: "Custo Autonômico", reverse: false },
            { id: 18, text: "Meu sono costuma ficar picado ou superficial porque a mente continua acelerada repassando pendências e prazos noturnos.", domain: "autonomico", domainLabel: "Custo Autonômico", reverse: false },
            { id: 19, text: "Sinto tensão recorrente na mandíbula, ombros ou estômago mesmo quando o dia nem apresentou uma ameaça real grave.", domain: "autonomico", domainLabel: "Custo Autonômico", reverse: false },
            { id: 20, text: "Tenho consciência de que viver correndo para 'apagar incêndios' está drenando minha saúde e minha capacidade de desfrutar do presente.", domain: "autonomico", domainLabel: "Custo Autonômico", reverse: false }
        ],
        cutoffs: [
            {
                max: 35,
                label: "Baixa Dependência de Urgência / Cadência Executiva Preservada",
                badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
                summary: "O sistema Locus Coeruleus–Noradrenalina demonstra alternância fluida entre foco engajado e repouso genuíno, sem dependência crônica de crises ou picos simpáticos artificiais para iniciar tarefas importantes."
            },
            {
                max: 52,
                label: "Dependência Moderada de Pressão / Oscilação Inércia-Correria",
                badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-300",
                summary: "Embora haja desempenho funcional aparente, observam-se sinais de utilização recorrente da adrenalina de última hora como mecanismo compensatório para vencer o adiamento em tarefas menos estimulantes, com desgaste moderado no pós-entrega."
            },
            {
                max: 68,
                label: "Urgência Crônica Elevada / Desregulação Alostática do Ritmo",
                badgeClass: "bg-orange-100 text-orange-800 border-orange-300",
                summary: "O organismo apresenta habituação a um ponto de ajuste elevado de pressão: sem ameaça imediata ou prazo estourando, o sistema perde tração executiva e a quietude desperta inquietação, comprometendo a clareza estratégica do córtex pré-frontal (Arnsten) e gerando sobrecarga autonômica."
            },
            {
                max: 80,
                label: "Adicção Severa à Urgência / Exaustão Noradrenérgica",
                badgeClass: "bg-red-100 text-red-800 border-red-300",
                summary: "Padrão crônico de operação em modo de emergência, alternando entre apagamento de incêndios em alta rotação e colapsos físicos após entregas. Recomenda-se investigação diferencial para TDAH, burnout e esquemas de padrões inflexíveis, além de intervenções de regulação vagal e recalibração alostática."
            }
        ],
        references: [
            "Aston-Jones, G., &amp; Cohen, J. D. (2005). <em>An integrative theory of locus coeruleus-norepinephrine function: adaptive gain and optimal performance</em>. Annual Review of Neuroscience, 28, 403-450.",
            "Arnsten, A. F. T. (2009). <em>Stress signalling pathways that impair prefrontal cortex structure and function</em>. Nature Reviews Neuroscience, 10(6), 410-422.",
            "Koob, G. F., &amp; Le Moal, M. (2001). <em>Drug addiction, dysregulation of reward, and allostasis</em>. Neuropsychopharmacology, 24(2), 97-129.",
            "Steel, P. (2007). <em>The nature of procrastination: a meta-analytic and theoretical review of quintessential self-regulatory failure</em>. Psychological Bulletin, 133(1), 65-94."
        ]
    }
];
