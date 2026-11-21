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
        id: "EMRP_AS",
        code: "T-62",
        shortTitle: "EMRP-AS (Ruminação Pós-Evento)",
        fullTitle: "Escala Multidimensional de Ruminação Pós-Evento e Autópsia Social (EMRP-AS / T-62)",
        cardDescription: "20 itens (4 dimensões). Reencenação episódica na DMN, perspectiva do observador (Clark & Wells), autópsia contrafactual (OFC) e bloqueio do esquecimento ativo.",
        category: "Regulação & Estresse",
        icon: "rotate-ccw",
        accentColor: "teal",
        protocolPrefix: "DM-PEP-",
        instruction: "Leia cada afirmação abaixo e assinale o quanto ela reflete seu funcionamento habitual após interações sociais nos <strong>últimos meses</strong>.",
        options: [
            { value: 1, label: "Discordo Totalmente", desc: "Não reflete" },
            { value: 2, label: "Discordo Parcialmente", desc: "Pouco frequente" },
            { value: 3, label: "Concordo Parcialmente", desc: "Frequente" },
            { value: 4, label: "Concordo Totalmente", desc: "Reflete muito" }
        ],
        subscales: [
            {
                id: "reencenacao_dmn",
                label: "Reencenação Episódica Compulsiva (DMN / Hipocampo)",
                desc: "Repetição involuntária de diálogos, entonações e gestos horas ou dias após o encerramento de uma interação social.",
                color: "bg-teal-600"
            },
            {
                id: "leitura_mental_vergonha",
                label: "Viés de Leitura Mental e Vergonha Retrospectiva (Clark & Wells / dACC)",
                desc: "Interpretação punitiva de sinais sociais neutros e reconstrução da cena sob a perspectiva distorcida do observador.",
                color: "bg-indigo-600"
            },
            {
                id: "autopsia_contrafactual",
                label: "Autópsia Contrafactual e Desejo de Reescrever (OFC / \"E se...\")",
                desc: "Simulação obsessiva de respostas ideais não dadas e tentativa estéril de editar mentalmente um passado já consumado.",
                color: "bg-amber-600"
            },
            {
                id: "bloqueio_esquecimento",
                label: "Bloqueio do Esquecimento Ativo e Hiperalerta Noturno (Nietzsche / Reconsolidação)",
                desc: "Dificuldade em encerrar psiquicamente o episódio, impacto no sono e regravação punitiva da memória.",
                color: "bg-rose-600"
            }
        ],
        items: [
            { id: 1, text: "Após uma conversa importante, reunião ou encontro social, minha mente volta a repassar repetidamente o que eu disse e fiz, como um filme que não desliga.", domain: "reencenacao_dmn", domainLabel: "Reencenação Episódica", reverse: false },
            { id: 2, text: "Costumo reler várias vezes mensagens ou e-mails que já enviei para verificar se o tom pareceu seco, estranho ou inadequado.", domain: "reencenacao_dmn", domainLabel: "Reencenação Episódica", reverse: false },
            { id: 3, text: "Mesmo quando tento me distrair com trabalho ou lazer, trechos de um diálogo encerrado invadem minha atenção de forma automática.", domain: "reencenacao_dmn", domainLabel: "Reencenação Episódica", reverse: false },
            { id: 4, text: "Ao me lembrar de uma interação, foco quase exclusivamente em um pequeno tropeço ou silêncio constrangedor e apago os momentos em que tudo fluiu bem.", domain: "reencenacao_dmn", domainLabel: "Reencenação Episódica", reverse: false },
            { id: 5, text: "Sinto que preciso 'analisar tudo até o fim' depois de sair de um ambiente social para tentar entender se me comportei de maneira aceitável.", domain: "reencenacao_dmn", domainLabel: "Reencenação Episódica", reverse: false },

            { id: 6, text: "Quando relembro um encontro, imagino a cena vista de fora e tenho a sensação nítida de que pareci tolo(a), ansioso(a) ou desajeitado(a) aos olhos dos outros.", domain: "leitura_mental_vergonha", domainLabel: "Vergonha / dACC", reverse: false },
            { id: 7, text: "Se alguém demora a responder uma mensagem ou exibe um rosto sério durante uma conversa, concluo rapidamente que disse algo errado ou desagradável.", domain: "leitura_mental_vergonha", domainLabel: "Vergonha / dACC", reverse: false },
            { id: 8, text: "Muitas vezes sinto uma onda súbita de vergonha física (calor no rosto, aperto no peito) ao recordar uma fala antiga que ninguém mais parece lembrar.", domain: "leitura_mental_vergonha", domainLabel: "Vergonha / dACC", reverse: false },
            { id: 9, text: "Costumo assumir que comentários neutros ou olhares breves das pessoas depois que eu falo significam reprovação silenciosa ou tédio com a minha presença.", domain: "leitura_mental_vergonha", domainLabel: "Vergonha / dACC", reverse: false },
            { id: 10, text: "Mesmo quando recebo um retorno positivo após uma exposição ou conversa, desconfio que foi apenas educação e continuo procurando onde falhei.", domain: "leitura_mental_vergonha", domainLabel: "Vergonha / dACC", reverse: false },

            { id: 11, text: "Passo longos minutos ensaiando mentalmente respostas mais inteligentes, firmes ou elegantes que eu 'deveria ter dado' na hora da conversa.", domain: "autopsia_contrafactual", domainLabel: "Autópsia Contrafactual", reverse: false },
            { id: 12, text: "Fico preso(a) em pensamentos do tipo 'se eu não tivesse falado aquilo, tudo teria sido diferente', mesmo quando não há nada para corrigir.", domain: "autopsia_contrafactual", domainLabel: "Autópsia Contrafactual", reverse: false },
            { id: 13, text: "Sinto forte impulso de mandar uma mensagem extra horas depois para me justificar ou esclarecer algo que provavelmente ninguém interpretou mal.", domain: "autopsia_contrafactual", domainLabel: "Autópsia Contrafactual", reverse: false },
            { id: 14, text: "Acredito que, se eu ficar remoendo meus erros sociais com rigor suficiente, conseguirei evitar passar vergonha novamente no futuro.", domain: "autopsia_contrafactual", domainLabel: "Autópsia Contrafactual", reverse: false },
            { id: 15, text: "Quanto mais analiso o que deveria ter feito em uma situação passada, mais incompetente ou ansioso(a) me sinto para o próximo encontro.", domain: "autopsia_contrafactual", domainLabel: "Autópsia Contrafactual", reverse: false },

            { id: 16, text: "Ao deitar para dormir depois de um dia cheio de interações, meu cérebro liga um tribunal retrospectivo que atrasa o sono ou me acorda de madrugada.", domain: "bloqueio_esquecimento", domainLabel: "Bloqueio Noturno", reverse: false },
            { id: 17, text: "Tenho grande dificuldade de 'virar a página' após uma gafe leve ou mal-entendido social, carregando o mal-estar por dias inteiros.", domain: "bloqueio_esquecimento", domainLabel: "Bloqueio Noturno", reverse: false },
            { id: 18, text: "Lembro com detalhes dolorosos de constrangimentos sociais ocorridos há anos, e quando eles surgem ainda me sinto tão mal quanto na época.", domain: "bloqueio_esquecimento", domainLabel: "Bloqueio Noturno", reverse: false },
            { id: 19, text: "Acabo evitando novos convites, falas em grupo ou encontros espontâneos para não ter de enfrentar o desgaste mental de ficar me julgando depois.", domain: "bloqueio_esquecimento", domainLabel: "Bloqueio Noturno", reverse: false },
            { id: 20, text: "Sinto que o peso das conversas antigas que não consigo soltar rouba a espontaneidade e a alegria de estar presente com as pessoas hoje.", domain: "bloqueio_esquecimento", domainLabel: "Bloqueio Noturno", reverse: false }
        ],
        cutoffs: [
            {
                max: 35,
                label: "Encerramento Saudável / Esquecimento Ativo Preservado",
                badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
                summary: "Processa interações sociais e eventuais gafes sem ficar preso ao tribunal retrospectivo, preservando a força plástica do esquecimento ativo (Nietzsche) e o repouso noturno."
            },
            {
                max: 52,
                label: "Autópsia Social Pontual / Revisão Pós-Evento Moderada",
                badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-300",
                summary: "Após situações de maior exposição, a DMN tende a revisar falas e buscar sinais de aprovação, mas ainda consegue encerrar o episódio após algum tempo."
            },
            {
                max: 68,
                label: "Ruminação Pós-Evento Elevada / Loop de Autópsia Social",
                badgeClass: "bg-orange-100 text-orange-800 border-orange-300",
                summary: "Padrão consistente do ciclo de Clark & Wells: a perspectiva do observador e a simulação contrafactual no OFC reabrem conversas encerradas, gerando vergonha somática e desgaste noturno."
            },
            {
                max: 80,
                label: "Autópsia Social Crônica / Sequestro da DMN e Bloqueio do Presente",
                badgeClass: "bg-red-100 text-red-800 border-red-300",
                summary: "A memória episódica e o alarme de dor social (dACC/Ínsula) mantêm encontros passados abertos indefinidamente, prejudicando o sono e levando à evitação social. Recomenda-se TCC para ansiedade social / ACT."
            }
        ],
        references: [
            "Abbott, M. J., & Rapee, R. M. (2004). Post-event rumination and negative self-appraisal in social phobia before and after treatment. <em>Journal of Abnormal Psychology</em>, 113(1), 136-144.",
            "Brozovich, F., & Heimberg, R. G. (2008). An analysis of post-event processing in social anxiety disorder. <em>Clinical Psychology Review</em>, 28(6), 891-903.",
            "Clark, D. M., & Wells, A. (1995). A cognitive model of social phobia. In R. G. Heimberg et al. (Eds.), <em>Social Phobia: Diagnosis, Assessment, and Treatment</em> (pp. 69-93). Guilford Press.",
            "Nader, K., Schafe, G. E., & Le Doux, J. E. (2000). Fear memories require protein synthesis in the amygdala for reconsolidation after retrieval. <em>Nature</em>, 406, 722-726."
        ]
    },
    {
        id: "EMIT_FE",
        code: "T-61",
        shortTitle: "EMIT-FE (Intolerância ao Tédio)",
        fullTitle: "Escala de Intolerância ao Tédio, Fome de Estímulos e Desconexão Contemplativa (EMIT-FE / T-61)",
        cardDescription: "20 itens (4 dimensões). Fome dopaminérgica de estímulos, aversão ao silêncio interior (Wilson), falha atencional (Ínsula–CEN) e erosão contemplativa.",
        category: "Funções Executivas",
        icon: "sparkles",
        accentColor: "teal",
        protocolPrefix: "DM-TED-",
        instruction: "Leia cada afirmação abaixo e assinale o quanto ela reflete seu funcionamento habitual diante de pausas e silêncio nos <strong>últimos meses</strong>.",
        options: [
            { value: 1, label: "Discordo Totalmente", desc: "Não reflete" },
            { value: 2, label: "Discordo Parcialmente", desc: "Pouco frequente" },
            { value: 3, label: "Concordo Parcialmente", desc: "Frequente" },
            { value: 4, label: "Concordo Totalmente", desc: "Reflete muito" }
        ],
        subscales: [
            {
                id: "fome_estimulos",
                label: "Fome de Estímulos e Busca Dopaminérgica (Estriado / Hipernovidade)",
                desc: "Reflexo automático de checar telas em micro-pausas, necessidade de ruído de fundo contínuo e dependência de novidade fásica.",
                color: "bg-teal-600"
            },
            {
                id: "aversao_silencio",
                label: "Aversão ao Silêncio Interior e Fuga do Pensamento (Wilson / DMN)",
                desc: "Desconforto agudo ao ficar a sós com a própria consciência sem distrações e uso de estímulos externos para silenciar emoções internas.",
                color: "bg-indigo-600"
            },
            {
                id: "falha_atencional",
                label: "Falha de Engajamento Atencional (Eastwood / Ínsula–CEN)",
                desc: "Incapacidade de sustentar interesse em atividades de cadência lenta, bloqueio executivo no arranque e sensação de tempo arrastado.",
                color: "bg-amber-600"
            },
            {
                id: "erosao_contemplativa",
                label: "Erosão Contemplativa e Inquietação Somática (Pascal / Han)",
                desc: "Perda da capacidade de descanso reparador no ócio, sensação de culpa ao desacelerar e desaparecimento da incubação criativa.",
                color: "bg-rose-600"
            }
        ],
        items: [
            { id: 1, text: "Basta esperar trinta segundos em uma fila, semáforo ou carregamento de página para minha mão buscar automaticamente o celular.", domain: "fome_estimulos", domainLabel: "Fome de Estímulos", reverse: false },
            { id: 2, text: "Preciso manter algum som de fundo (vídeos, podcasts, música ou televisão) ligado durante tarefas simples ou até para dormir, pois o silêncio me incomoda.", domain: "fome_estimulos", domainLabel: "Fome de Estímulos", reverse: false },
            { id: 3, text: "Costumo alternar rapidamente entre várias abas, aplicativos ou vídeos curtos quando um conteúdo leva mais de alguns segundos para me prender.", domain: "fome_estimulos", domainLabel: "Fome de Estímulos", reverse: false },
            { id: 4, text: "Ao assistir a um filme ou ouvir uma aula, sinto forte impulso de checar mensagens ou rolar outro feed ao mesmo tempo para 'preencher' o ritmo.", domain: "fome_estimulos", domainLabel: "Fome de Estímulos", reverse: false },
            { id: 5, text: "Quando fico sem acesso à internet ou a distrações imediatas, sinto uma espécie de 'coceira mental' em busca de qualquer estímulo novo.", domain: "fome_estimulos", domainLabel: "Fome de Estímulos", reverse: false },

            { id: 6, text: "Ficar dez ou quinze minutos sentado(a) em silêncio absoluto, apenas com os próprios pensamentos e sem nada para fazer, parece-me penoso ou angustiante.", domain: "aversao_silencio", domainLabel: "Aversão ao Silêncio", reverse: false },
            { id: 7, text: "Quando o ambiente fica quieto demais, minha mente imediatamente traz preocupações, lembranças incômodas ou autocríticas que me fazem buscar uma distração.", domain: "aversao_silencio", domainLabel: "Aversão ao Silêncio", reverse: false },
            { id: 8, text: "Percebo que preencho minha agenda ou consumo conteúdo compulsivamente principalmente para não entrar em contato com o que estou sentindo por dentro.", domain: "aversao_silencio", domainLabel: "Aversão ao Silêncio", reverse: false },
            { id: 9, text: "Prefiro realizar uma tarefa irritante, cansativa ou até causar um pequeno conflito ao meu redor do que permanecer em ociosidade silenciosa.", domain: "aversao_silencio", domainLabel: "Aversão ao Silêncio", reverse: false },
            { id: 10, text: "Ao final de um dia exaustivo, mesmo sem energia, continuo consumindo estímulos até tarde porque desligar tudo me deixa desconfortável comigo mesmo(a).", domain: "aversao_silencio", domainLabel: "Aversão ao Silêncio", reverse: false },

            { id: 11, text: "Tenho grande dificuldade em ler um livro denso ou estudar por mais de dez minutos seguidos sem que o cérebro comece a 'implorar' por uma pausa estimulante.", domain: "falha_atencional", domainLabel: "Falha Atencional", reverse: false },
            { id: 12, text: "Muitas vezes sinto tédio profundo mesmo estando cercado(a) de opções de lazer, cursos ou entretenimento, sem conseguir me conectar com nenhuma delas.", domain: "falha_atencional", domainLabel: "Falha Atencional", reverse: false },
            { id: 13, text: "Atividades cotidianas de ritmo natural (cozinhar em silêncio, caminhar sem fones, conversar sem checar o telefone) parecem-me lentas demais e quase irritantes.", domain: "falha_atencional", domainLabel: "Falha Atencional", reverse: false },
            { id: 14, text: "Costumo acelerar áudios e vídeos para 1.5x ou 2x porque a cadência normal da fala humana me provoca impaciência atencional.", domain: "falha_atencional", domainLabel: "Falha Atencional", reverse: false },
            { id: 15, text: "Quando tento focar em uma tarefa importante que exige paciência inicial, sinto um peso físico na cabeça e desisto nos primeiros minutos por tédio.", domain: "falha_atencional", domainLabel: "Falha Atencional", reverse: false },

            { id: 16, text: "Mesmo em momentos legítimos de descanso ou fim de semana, sinto inquietação no corpo e culpa por 'não estar produzindo ou consumindo algo útil'.", domain: "erosao_contemplativa", domainLabel: "Erosão Contemplativa", reverse: false },
            { id: 17, text: "Quase nunca me permito contemplar uma paisagem, o céu ou uma obra de arte sem tentar fotografar, postar ou passar rapidamente para a próxima coisa.", domain: "erosao_contemplativa", domainLabel: "Erosão Contemplativa", reverse: false },
            { id: 18, text: "Percebo que minha capacidade de ter ideias originais, devanear livremente ou refletir com profundidade sobre a própria vida diminuiu nos últimos anos.", domain: "erosao_contemplativa", domainLabel: "Erosão Contemplativa", reverse: false },
            { id: 19, text: "Quando passo horas preenchendo o tédio com estímulos digitais, termino mais drenado(a), irritado(a) e vazio(a) do que quando comecei.", domain: "erosao_contemplativa", domainLabel: "Erosão Contemplativa", reverse: false },
            { id: 20, text: "Sinto que perdi o prazer simples de 'apenas estar presente' em um lugar tranquilo sem precisar fazer nada para justificar aquele momento.", domain: "erosao_contemplativa", domainLabel: "Erosão Contemplativa", reverse: false }
        ],
        cutoffs: [
            {
                max: 35,
                label: "Presença Contemplativa Preservada / Baixa Intolerância ao Tédio",
                badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
                summary: "Tolera com serenidade o silêncio interior e os intervalos sem estímulos digitais, preservando a alternância saudável entre Rede Executiva (CEN) e Rede de Modo Padrão (DMN)."
            },
            {
                max: 52,
                label: "Inquietação Atencional Moderada / Fome Pontual de Estímulos",
                badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-300",
                summary: "Sustenta atividades estruturadas, mas já manifesta reflexo condicionado de preencher lacunas de espera com telas ou áudios acelerados, reduzindo momentos de incubação contemplativa."
            },
            {
                max: 68,
                label: "Intolerância Elevada ao Tédio / Dependência de Hiperestimulação",
                badgeClass: "bg-orange-100 text-orange-800 border-orange-300",
                summary: "Padrão consistente de desregulação fásica no Estriado Ventral e conflito DMN–CEN na Ínsula Anterior: a ausência de estímulo externo gera agitação visceral imediata e reduz restauração no ócio."
            },
            {
                max: 80,
                label: "Intolerância Severa ao Silêncio Interior / Desacoplamento Contemplativo",
                badgeClass: "bg-red-100 text-red-800 border-red-300",
                summary: "A quietude e a falta de novidade disparam forte sofrimento aversivo (padrão Wilson et al.), levando à saturação dopaminérgica, exaustão pré-frontal e fuga experiencial. Recomenda-se protocolo ACT/TCC e higiene atencional."
            }
        ],
        references: [
            "Danckert, J., & Merrifield, C. (2018). Boredom, sustained attention and the default mode network. <em>Experimental Brain Research</em>, 236(9), 2507-2518.",
            "Eastwood, J. D., et al. (2012). The unengaged mind: defining boredom in terms of attention. <em>Perspectives on Psychological Science</em>, 7(5), 482-495.",
            "Han, B.-C. (2023). <em>Vita Contemplativa: Ou Sobre a Inatividade</em>. Petrópolis: Vozes.",
            "Wilson, T. D., et al. (2014). Just think: the challenges of the disengaged mind. <em>Science</em>, 345(6192), 75-77."
        ]
    },
    {
        id: "EMPD_AM",
        code: "T-60",
        shortTitle: "EMPD-AM (Paralisia Decisória)",
        fullTitle: "Escala de Paralisia Decisória, Arrependimento Antecipado e Maximização (EMPD-AM / T-60)",
        cardDescription: "20 itens (4 dimensões). Hiperbusca maximizadora, simulação contrafactual (OFC), evitação da renúncia e FOMO pós-escolha.",
        category: "Funções Executivas",
        icon: "git-branch",
        accentColor: "teal",
        protocolPrefix: "DM-DEC-",
        instruction: "Leia cada afirmação abaixo e assinale o quanto ela reflete seu funcionamento habitual diante de decisões nos <strong>últimos meses</strong>.",
        options: [
            { value: 1, label: "Discordo Totalmente", desc: "Não reflete" },
            { value: 2, label: "Discordo Parcialmente", desc: "Pouco frequente" },
            { value: 3, label: "Concordo Parcialmente", desc: "Frequente" },
            { value: 4, label: "Concordo Totalmente", desc: "Reflete muito" }
        ],
        subscales: [
            {
                id: "maximizacao",
                label: "Hiperbusca Maximizadora e Sobrecarga de Opções (dACC / Schwartz)",
                desc: "Coleta exaustiva de alternativas, dificuldade de adotar critérios suficientes (satisficing) e conflito diante de escolhas equivalentes.",
                color: "bg-teal-600"
            },
            {
                id: "contrafactual",
                label: "Simulação Contrafactual e Arrependimento Antecipado (OFC / Coricelli)",
                desc: "Projeção de dor futura pelo caminho descartado, cálculo obsessivo de 'e se?' e medo paralisante de errar irreversivelmente.",
                color: "bg-indigo-600"
            },
            {
                id: "evitacao",
                label: "Evitação Decisória e Adiamento da Renúncia (Aversão à Perda)",
                desc: "Manutenção de portas entreabertas, procrastinação de compromissos e delegação passiva da escolha ao tempo ou a terceiros.",
                color: "bg-amber-600"
            },
            {
                id: "fomo",
                label: "Custo Emocional, FOMO Existencial e Erosão Pós-Escolha (DMN / Sartre)",
                desc: "Insatisfação após decidir, comparação contínua com vidas não vividas, exaustão mental e perda de presença no caminho escolhido.",
                color: "bg-rose-600"
            }
        ],
        items: [
            { id: 1, text: "Antes de tomar uma decisão importante (ou até cotidiana), pesquiso exaustivamente dezenas de alternativas com medo de deixar passar uma opção melhor.", domain: "maximizacao", domainLabel: "Hiperbusca Maximizadora", reverse: false },
            { id: 2, text: "Mesmo quando encontro uma alternativa que atende bem ao que preciso, continuo procurando para ter certeza de que é a melhor possível.", domain: "maximizacao", domainLabel: "Hiperbusca Maximizadora", reverse: false },
            { id: 3, text: "Quanto mais opções tenho à minha frente, mais minha mente trava e mais difícil fica concluir uma escolha simples.", domain: "maximizacao", domainLabel: "Hiperbusca Maximizadora", reverse: false },
            { id: 4, text: "Costumo pedir opiniões a várias pessoas diferentes sobre uma mesma escolha e acabo ainda mais confuso(a) com os argumentos contrários.", domain: "maximizacao", domainLabel: "Hiperbusca Maximizadora", reverse: false },
            { id: 5, text: "Tenho dificuldade em aceitar uma solução 'boa o suficiente', pois sinto que se não for a ideal terei fracassado na escolha.", domain: "maximizacao", domainLabel: "Hiperbusca Maximizadora", reverse: false },

            { id: 6, text: "Antes mesmo de decidir, já imagino com riqueza de detalhes o quanto vou me arrepender se a opção escolhida apresentar algum defeito depois.", domain: "contrafactual", domainLabel: "Simulação Contrafactual", reverse: false },
            { id: 7, text: "Quando preciso escolher um caminho, meu foco recai muito mais sobre tudo o que estou perdendo ao descartar os outros do que sobre o que estou ganhando.", domain: "contrafactual", domainLabel: "Simulação Contrafactual", reverse: false },
            { id: 8, text: "Sinto um aperto físico ou vertigem quando uma decisão fecha definitivamente outras possibilidades de carreira, vínculo ou estilo de vida.", domain: "contrafactual", domainLabel: "Simulação Contrafactual", reverse: false },
            { id: 9, text: "Repasso mentalmente cenários hipotéticos de 'e se eu tivesse escolhido diferente?' mesmo diante de decisões reversíveis ou pequenas.", domain: "contrafactual", domainLabel: "Simulação Contrafactual", reverse: false },
            { id: 10, text: "Trato escolhas comuns como se fossem sentenças definitivas e irremediáveis, exigindo garantia absoluta de que não haverá frustração futura.", domain: "contrafactual", domainLabel: "Simulação Contrafactual", reverse: false },

            { id: 11, text: "Adio decisões importantes por semanas ou meses porque mantê-las em aberto me dá a sensação provisória de que ainda não perdi nenhuma opção.", domain: "evitacao", domainLabel: "Evitação da Renúncia", reverse: false },
            { id: 12, text: "Muitas vezes espero que o prazo expire ou que outra pessoa decida por mim para não carregar o peso de ter escolhido errado.", domain: "evitacao", domainLabel: "Evitação da Renúncia", reverse: false },
            { id: 13, text: "Já perdi oportunidades concretas (vagas, projetos, experiências ou vínculos) porque demorei demais tentando ter certeza absoluta antes de agir.", domain: "evitacao", domainLabel: "Evitação da Renúncia", reverse: false },
            { id: 14, text: "Tenho dificuldade em assumir compromissos firmes de longo prazo porque a ideia de renunciar às demais possibilidades me sufoca.", domain: "evitacao", domainLabel: "Evitação da Renúncia", reverse: false },
            { id: 15, text: "Prefiro manter planos vagos ou 'planos B' permanentes do que me dedicar integralmente a uma única direção.", domain: "evitacao", domainLabel: "Evitação da Renúncia", reverse: false },

            { id: 16, text: "Mesmo depois de fazer uma boa escolha, continuo olhando para o lado e me perguntando se as alternativas descartadas não teriam me feito mais feliz.", domain: "fomo", domainLabel: "FOMO & Custo Pós-Escolha", reverse: false },
            { id: 17, text: "Sinto esgotamento mental ao final de processos simples de decisão, como se tivesse corrido uma maratona cognitiva.", domain: "fomo", domainLabel: "FOMO & Custo Pós-Escolha", reverse: false },
            { id: 18, text: "Quando algo dá errado após uma decisão minha, culpo-me severamente por não ter previsto aquela falha durante a análise.", domain: "fomo", domainLabel: "FOMO & Custo Pós-Escolha", reverse: false },
            { id: 19, text: "Percebo que a comparação constante com caminhos alternativos me impede de aproveitar e construir valor real na escolha que já fiz.", domain: "fomo", domainLabel: "FOMO & Custo Pós-Escolha", reverse: false },
            { id: 20, text: "Tenho a sensação de que minha vida está parada em uma sala de espera porque não consigo encerrar dúvidas e seguir em uma direção clara.", domain: "fomo", domainLabel: "FOMO & Custo Pós-Escolha", reverse: false }
        ],
        cutoffs: [
            {
                max: 35,
                label: "Perfil Satisficer Preservado / Baixa Paralisia Decisória",
                badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
                summary: "Utiliza critérios claros de suficiência alinhados a valores pessoais, tolera bem a renúncia inerente à escolha e investe energia pós-decisão sem ruminação contrafactual excessiva."
            },
            {
                max: 52,
                label: "Maximização Moderada / Atrito Contrafactual Pontual",
                badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-300",
                summary: "Avança na maior parte das decisões cotidianas, mas tende a pesquisar além do necessário e calcular o custo das portas fechadas no OFC diante de opções equivalentes."
            },
            {
                max: 68,
                label: "Paralisia Decisória Elevada / Hipercomputação de Arrependimento",
                badgeClass: "bg-orange-100 text-orange-800 border-orange-300",
                summary: "Padrão consistente de sobrecarga no dACC, simulação contrafactual intensa no OFC e adiamento protetivo para evitar o luto simbólico das opções descartadas, gerando fadiga executiva e FOMO."
            },
            {
                max: 80,
                label: "Paralisia Decisória Severa / Vertigem da Liberdade e Esquiva Experiencial",
                badgeClass: "bg-red-100 text-red-800 border-red-300",
                summary: "Medo de escolher errado e arrependimento antecipado sequestram a tomada de decisão, mantendo o sujeito paralisado em análises infinitas ou delegação passiva. Recomenda-se protocolo ACT/TCC de compromisso e avaliação executiva."
            }
        ],
        references: [
            "Camille, N., et al. (2004). The involvement of the orbitofrontal cortex in the experience of regret. <em>Science</em>, 304(5674), 1167-1170.",
            "Coricelli, G., et al. (2005). Regret and its avoidance: a neuroimaging study of choice behavior. <em>Nature Neuroscience</em>, 8(9), 1255-1262.",
            "Kahneman, D. (2012). <em>Rápido e Devagar: Duas Formas de Pensar</em>. Rio de Janeiro: Objetiva.",
            "Schwartz, B. (2007). <em>O Paradoxo da Escolha: Por Que Mais É Menos</em>. São Paulo: A Girafa."
        ]
    },

    {
        id: "EMCH_SR",
        code: "T-59",
        shortTitle: "EMCH-SR (Ciúme & Vigilância)",
        fullTitle: "Escala de Ciúme Cognitivo, Hipervigilância Afetiva e Segurança Relacional (EMCH-SR / T-59)",
        cardDescription: "20 itens (4 dimensões). Checagem compulsiva, intrusão na DMN, busca de reasseguramento e custo somático.",
        category: "Apego & Vínculos",
        icon: "eye",
        accentColor: "amber",
        protocolPrefix: "DM-CIU-",
        instruction: "Leia cada afirmação abaixo e assinale o quanto ela reflete seu funcionamento habitual em relações afetivas nos <strong>últimos meses</strong>.",
        options: [
            { value: 1, label: "Discordo Totalmente", desc: "Não reflete" },
            { value: 2, label: "Discordo Parcialmente", desc: "Pouco frequente" },
            { value: 3, label: "Concordo Parcialmente", desc: "Frequente" },
            { value: 4, label: "Concordo Totalmente", desc: "Reflete muito" }
        ],
        subscales: [
            {
                id: "vigilancia",
                label: "Vigilância e Checagem Compulsiva (dACC / Estriado)",
                desc: "Monitoramento contínuo de sinais digitais, horários, microexpressões e rastros na tentativa de detectar ameaças precoces.",
                color: "bg-amber-600"
            },
            {
                id: "intrusao",
                label: "Intrusão Imaginativa e Simulação (DMN / Amígdala)",
                desc: "Produção involuntária de cenas de traição, leitura hiperativa de silêncios neutros (STS) e angústia diante de hipóteses mentais.",
                color: "bg-indigo-600"
            },
            {
                id: "controle",
                label: "Reasseguramento e Controle Relacional (Leahy)",
                desc: "Interrogatórios repetitivos, testes velados de lealdade e exigência de certeza absoluta como comportamento de segurança.",
                color: "bg-rose-600"
            },
            {
                id: "custo",
                label: "Custo Emocional e Erosão da Confiança (Ínsula)",
                desc: "Repercussão autonômica visceral (circuito PANIC/GRIEF), intolerância à incerteza afetiva e desgaste progressivo do vínculo.",
                color: "bg-orange-600"
            }
        ],
        items: [
            { id: 1, text: "Quando meu(minha) parceiro(a) demora a responder uma mensagem, checo repetidamente se esteve online ou interagindo em redes sociais.", domain: "vigilancia", domainLabel: "Vigilância e Checagem", reverse: false },
            { id: 2, text: "Sinto um impulso intenso de olhar o celular, histórico ou conversas do(a) parceiro(a) para ter certeza de que nada está sendo escondido.", domain: "vigilancia", domainLabel: "Vigilância e Checagem", reverse: false },
            { id: 3, text: "Presto atenção excessiva a olhares, curtidas, comentários ou interações do(a) parceiro(a) com terceiros em busca de sinais suspeitos.", domain: "vigilancia", domainLabel: "Vigilância e Checagem", reverse: false },
            { id: 4, text: "Costumo cruzar horários, histórias ou detalhes do que a outra pessoa me contou para verificar se há contradições ocultas.", domain: "vigilancia", domainLabel: "Vigilância e Checagem", reverse: false },
            { id: 5, text: "Mesmo quando não encontro nenhum indício concreto de traição, sinto que preciso continuar alerta para não ser pego(a) desprevenido(a).", domain: "vigilancia", domainLabel: "Vigilância e Checagem", reverse: false },

            { id: 6, text: "Minha mente cria imagens mentais vívidas e perturbadoras do(a) meu(minha) parceiro(a) demonstrando interesse ou intimidade com outra pessoa.", domain: "intrusao", domainLabel: "Intrusão Imaginativa", reverse: false },
            { id: 7, text: "Quando há uma lacuna de informação ou mudança súbita de humor no outro, imagino imediatamente o pior cenário de infidelidade ou abandono.", domain: "intrusao", domainLabel: "Intrusão Imaginativa", reverse: false },
            { id: 8, text: "Mesmo sabendo racionalmente que não há provas, uma cena imaginada de traição provoca em mim angústia intensa como se já tivesse acontecido.", domain: "intrusao", domainLabel: "Intrusão Imaginativa", reverse: false },
            { id: 9, text: "Passo longos períodos ruminando conversas passadas ou suposições sobre possíveis rivais afetivos.", domain: "intrusao", domainLabel: "Intrusão Imaginativa", reverse: false },
            { id: 10, text: "Interpreto silêncios neutros, cansaço ou distração do(a) parceiro(a) como sinais de desinteresse ou envolvimento com outrem.", domain: "intrusao", domainLabel: "Intrusão Imaginativa", reverse: false },

            { id: 11, text: "Faço perguntas repetitivas para confirmar se o(a) parceiro(a) ainda me ama, me acha atraente ou se sentiu atração por alguém.", domain: "controle", domainLabel: "Reasseguramento e Controle", reverse: false },
            { id: 12, text: "Sinto necessidade de saber com exatidão onde o(a) parceiro(a) está, com quem conversa e o que está fazendo para conseguir relaxar.", domain: "controle", domainLabel: "Reasseguramento e Controle", reverse: false },
            { id: 13, text: "Quando a ansiedade aperta, faço testes sutis ou provocações indiretas para medir a reação e a lealdade do outro.", domain: "controle", domainLabel: "Reasseguramento e Controle", reverse: false },
            { id: 14, text: "Sinto desconforto acentuado quando o(a) parceiro(a) sai sozinho(a) ou mantém amizades e espaços individuais sem a minha presença.", domain: "controle", domainLabel: "Reasseguramento e Controle", reverse: false },
            { id: 15, text: "Peço garantias de exclusividade e transparência que só me acalmam por alguns minutos antes que a dúvida retorne.", domain: "controle", domainLabel: "Reasseguramento e Controle", reverse: false },

            { id: 16, text: "Quando o ciúme dispara, sinto taquicardia, aperto no peito, nó no estômago ou dificuldade de concentração em outras tarefas.", domain: "custo", domainLabel: "Custo Emocional", reverse: false },
            { id: 17, text: "Minhas desconfianças e questionamentos frequentes já geraram desgaste, afastamento ou brigas recorrentes no relacionamento.", domain: "custo", domainLabel: "Custo Emocional", reverse: false },
            { id: 18, text: "Tenho dificuldade em tolerar qualquer grau de incerteza sobre o futuro do vínculo sem tentar controlar o comportamento do outro.", domain: "custo", domainLabel: "Custo Emocional", reverse: false },
            { id: 19, text: "Sinto que, no fundo, temo não ser suficiente e que qualquer pessoa mais interessante poderia me substituir facilmente.", domain: "custo", domainLabel: "Custo Emocional", reverse: false },
            { id: 20, text: "Percebo que a tentativa constante de evitar ser traído(a) está me impedindo de viver o afeto com leveza e tranquilidade.", domain: "custo", domainLabel: "Custo Emocional", reverse: false }
        ],
        cutoffs: [
            {
                max: 35,
                label: "Segurança Relacional Preservada / Baixa Hipervigilância",
                badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
                summary: "Boa tolerância às ambiguidades cotidianas da vida a dois, preservando a autonomia do parceiro e distinguindo intuições proporcionais de simulações catastróficas sem checagens compulsivas."
            },
            {
                max: 52,
                label: "Vigilância Moderada / Intolerância Pontual à Incerteza",
                badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-300",
                summary: "Confiança preservada na maior parte do tempo, porém com checagens digitais pontuais, ruminação breve e busca de confirmação afetiva em momentos de lacuna comunicacional."
            },
            {
                max: 68,
                label: "Ciúme Obsessivo Elevado / Hipervigilância Afetiva Ativa",
                badgeClass: "bg-orange-100 text-orange-800 border-orange-300",
                summary: "Padrão consistente de monitoramento estriatal, criação de cenas aversivas na DMN e busca recorrente de reasseguramento (Leahy), gerando dor social no dACC/ínsula e desgaste da intimidade."
            },
            {
                max: 80,
                label: "Hipervigilância Severa / Sequestro Imaginativo e Risco de Erosão do Vínculo",
                badgeClass: "bg-red-100 text-red-800 border-red-300",
                summary: "Medo de perda em alarme contínuo, transformando ambiguidades neutras em certezas de traição com alto custo somático. Recomenda-se avaliação de esquemas de Abandono/Desconfiança e protocolo cognitivo-comportamental (EPR e regulação emocional)."
            }
        ],
        references: [
            "Buss, D. M. (2000). <em>The Dangerous Passion: Why Jealousy Is as Necessary as Love and Sex</em>. New York: Free Press.",
            "Leahy, R. L. (2018). <em>The Jealousy Cure: Learn to Trust, Overcome Possessiveness, and Save Your Relationship</em>. Oakland: New Harbinger.",
            "Panksepp, J., &amp; Biven, L. (2012). <em>The Archaeology of Mind: Neuroevolutionary Origins of Human Emotions</em>. New York: W. W. Norton.",
            "Takahashi, H., et al. (2006). Men and women show distinct brain activations during imagery of sexual and emotional infidelity. <em>NeuroImage</em>, 32(3), 1299-1307."
        ]
    },
    {
        id: "EMRR_HP",
        code: "T-58",
        shortTitle: "EMRR-HP (Raiva Reprimida)",
        fullTitle: "Escala de Raiva Reprimida, Ressentimento e Hostilidade Passiva (EMRR-HP / T-58)",
        cardDescription: "20 itens (4 dimensões). Supressão expressiva, ressentimento ruminal, hostilidade passiva e custo somático.",
        category: "Regulação & Estresse",
        icon: "shield-alert",
        accentColor: "rose",
        protocolPrefix: "DM-RAI-",
        instruction: "Leia cada afirmação abaixo e assinale o quanto ela reflete seu comportamento habitual em situações de conflito ou violação de limites nos <strong>últimos meses</strong>.",
        options: [
            { value: 1, label: "Discordo Totalmente", desc: "Não reflete" },
            { value: 2, label: "Discordo Parcialmente", desc: "Pouco frequente" },
            { value: 3, label: "Concordo Parcialmente", desc: "Frequente" },
            { value: 4, label: "Concordo Totalmente", desc: "Reflete muito" }
        ],
        subscales: [
            {
                id: "supressao",
                label: "Supressão Inibitória da Raiva (dlPFC)",
                desc: "Censura imediata da indignação no momento do conflito por medo de rejeição, perda de afeto ou julgamento moral.",
                color: "bg-rose-600"
            },
            {
                id: "ressentimento",
                label: "Ressentimento Ruminal Silencioso (dACC)",
                desc: "Reencenação mental de ofensas, manutenção de placares internos de injustiça e amargura não verbalizada.",
                color: "bg-amber-600"
            },
            {
                id: "passivo",
                label: "Hostilidade Passiva (Stonewalling)",
                desc: "Uso de silêncio punitivo, ironia disfarçada, atrasos sutis ou retirada de calor afetivo como protesto oculto.",
                color: "bg-indigo-600"
            },
            {
                id: "somatico",
                label: "Custo Somático e Carga Autonômica (Ínsula)",
                desc: "Repercussão física da supressão expressiva: bruxismo, rigidez cervical, aperto gástrico e exaustão pós-conflito.",
                color: "bg-orange-600"
            }
        ],
        items: [
            { id: 1, text: "Quando alguém ultrapassa um limite meu ou quebra um combinado importante, sorrio e digo que 'não foi nada', mesmo sentindo incômodo por dentro.", domain: "supressao", domainLabel: "Supressão Inibitória", reverse: false },
            { id: 2, text: "Acredito intimamente que demonstrar irritação ou desagrado faz com que eu pareça uma pessoa agressiva, difícil ou ingrata.", domain: "supressao", domainLabel: "Supressão Inibitória", reverse: false },
            { id: 3, text: "Faço grande esforço para manter o rosto neutro e a voz calma mesmo quando estou fervendo de indignação diante de uma injustiça.", domain: "supressao", domainLabel: "Supressão Inibitória", reverse: false },
            { id: 4, text: "Prefiro engolir minha frustração no trabalho ou na família a correr o risco de gerar um clima tenso ou desagradar pessoas próximas.", domain: "supressao", domainLabel: "Supressão Inibitória", reverse: false },
            { id: 5, text: "Muitas vezes só percebo que fiquei com muita raiva horas ou dias depois, quando a conversa já terminou há muito tempo.", domain: "supressao", domainLabel: "Supressão Inibitória", reverse: false },

            { id: 6, text: "Depois de engolir um desaforo, passo dias ensaiando mentalmente no banho ou no trânsito tudo o que gostaria de ter respondido na cara da pessoa.", domain: "ressentimento", domainLabel: "Ressentimento Ruminal", reverse: false },
            { id: 7, text: "Costumo guardar uma espécie de 'placar silencioso' das vezes em que cedi, ajudei ou fui injustiçado(a) sem reconhecimento.", domain: "ressentimento", domainLabel: "Ressentimento Ruminal", reverse: false },
            { id: 8, text: "Mesmo quando digo que perdoei ou superei um episódio, continuo revivendo internamente a mágoa sempre que encontro a pessoa.", domain: "ressentimento", domainLabel: "Ressentimento Ruminal", reverse: false },
            { id: 9, text: "Sinto que acumulo pequenas frustrações cotidianas até que um detalhe mínimo desencadeia uma explosão ou um rompimento definitivo.", domain: "ressentimento", domainLabel: "Ressentimento Ruminal", reverse: false },
            { id: 10, text: "Quando me sinto desrespeitado(a), espero secretamente que o outro 'adivinhe' por que estou magoado(a) sem que eu precise falar abertamente.", domain: "ressentimento", domainLabel: "Ressentimento Ruminal", reverse: false },

            { id: 11, text: "Quando estou chateado(a) com alguém, tendo a responder com mensagens monossilábicas ('ok', 'tanto faz', 'deixa pra lá') em vez de expor o problema.", domain: "passivo", domainLabel: "Hostilidade Passiva", reverse: false },
            { id: 12, text: "Às vezes faço piadas ácidas ou comentários irônicos bem-educados para alfinetar quem me feriu sem assumir confronto direto.", domain: "passivo", domainLabel: "Hostilidade Passiva", reverse: false },
            { id: 13, text: "Durante ou após desentendimentos, fecho-me em um silêncio frio (dando 'gelo') para fazer o outro sentir o peso do erro que cometeu.", domain: "passivo", domainLabel: "Hostilidade Passiva", reverse: false },
            { id: 14, text: "Quando concordo em fazer algo contrariado(a), acabo procrastinando, atrasando ou executando sem cuidado como forma inconsciente de protesto.", domain: "passivo", domainLabel: "Hostilidade Passiva", reverse: false },
            { id: 15, text: "Se o outro insiste em saber o que houve, nego que esteja com raiva mesmo estando claramente distante ou irritado(a).", domain: "passivo", domainLabel: "Hostilidade Passiva", reverse: false },

            { id: 16, text: "Após situações em que engoli minha irritação para evitar briga, sinto forte tensão na mandíbula (ranger dentes), pescoço ou ombros.", domain: "somatico", domainLabel: "Custo Somático", reverse: false },
            { id: 17, text: "Sinto nó na garganta, aperto no estômago ou dor de cabeça tensional quando preciso me mostrar simpático(a) com quem me desagradou.", domain: "somatico", domainLabel: "Custo Somático", reverse: false },
            { id: 18, text: "Percebo meu coração disparar ou um calor súbito no peito durante atritos relacionais, travando minha capacidade de articular argumentos claros.", domain: "somatico", domainLabel: "Custo Somático", reverse: false },
            { id: 19, text: "Sinto exaustão física profunda no fim do dia por sustentar uma fachada de paciência e cordialidade diante de demandas injustas.", domain: "somatico", domainLabel: "Custo Somático", reverse: false },
            { id: 20, text: "Tenho consciência de que não conseguir dizer 'não' com clareza na hora certa está desgastando minha saúde e esfriando meus vínculos.", domain: "somatico", domainLabel: "Custo Somático", reverse: false }
        ],
        cutoffs: [
            {
                max: 35,
                label: "Baixa Repressão / Expressão Assertiva Preservada",
                badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
                summary: "Reconhecimento funcional da raiva como sinal legítimo de fronteira (Harmon-Jones), com boa capacidade de verbalizar limites de modo direto e respeitoso sem acúmulo crônico de ressentimento ou protesto passivo."
            },
            {
                max: 52,
                label: "Supressão Moderada / Tendência Pontual ao Protesto Indireto",
                badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-300",
                summary: "Embora haja manejo adequado na maioria das interações, observam-se episódios pontuais de silenciamento em relações de maior apego ou hierarquia, seguidos por ruminação moderada ou distanciamento sutil."
            },
            {
                max: 68,
                label: "Raiva Reprimida Elevada / Ressentimento e Hostilidade Passiva Ativos",
                badgeClass: "bg-orange-100 text-orange-800 border-orange-300",
                summary: "Padrão consistente de supressão expressiva (dlPFC) com manutenção da reatividade simpática e amigdalar (Gross & Levenson), alimentando ruminação hostil (dACC/DMN), stonewalling (Gottman) e repercussão somática."
            },
            {
                max: 80,
                label: "Supressão Crônica Severa / Sobrecarga Somática e Ressentimento Arraigado",
                badgeClass: "bg-red-100 text-red-800 border-red-300",
                summary: "Censura rígida das próprias fronteiras associada a alto custo autonômico (tensão mandibular/cervical, fadiga relacional) e ciclos intensos de mágoa silenciosa. Recomenda-se investigação de esquemas de Subjugação e Inibição Emocional e treino clínico de assertividade."
            }
        ],
        references: [
            "Beck, A. T. (1999). <em>Prisoners of Hate: The Cognitive Basis of Anger, Hostility, and Violence</em>. New York: HarperCollins.",
            "Gottman, J. M., &amp; Silver, N. (2016). <em>Sete Princípios para o Casamento Dar Certo</em>. Rio de Janeiro: Objetiva.",
            "Gross, J. J., &amp; Levenson, R. W. (1997). Hiding feelings: the acute effects of inhibiting negative and positive emotion. <em>Journal of Abnormal Psychology</em>, 106(1), 95-103.",
            "Harmon-Jones, E., &amp; Allen, J. J. B. (1998). Anger and frontal brain activity: EEG asymmetry consistent with approach motivation despite negative affective valence. <em>Journal of Personality and Social Psychology</em>, 74(5), 1310-1316."
        ]
    },
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
    },
    {
        "id":  "EMCC_HR",
        "code":  "T-56",
        "shortTitle":  "EMCC-HR (Compulsão por Controle e H...)",
        "fullTitle":  "Escala de Compulsão por Controle e Hiper-Responsabilidade (EMCC-HR / T-56)",
        "cardDescription":  "20 itens (4 dim.). Microgerenciamento e Ilusão de Controle (dlPFC / CSTC), Hiper-Responsabilidade Inflada e Cul....",
        "category":  "Regulação Emocional",
        "icon":  "compass",
        "accentColor":  "teal",
        "protocolPrefix":  "DM-REG-",
        "instruction":  "Instruções e Fundamentação Clínica: A EMCC-HR (T-56) avalia os quatro vetores neuropsicológicos do controle defensivo e da hiper-responsabilidade propostos por Paul Salkovskis, Ellen Langer, Dan Grupe e Stephen Porges: (1) Microgerenciamento e Ilusão de Controle (dlPFC / CSTC)...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Microgerenciamento e Ilusão de Controle (dlPFC / CSTC)",
                              "desc":  "Avalia a necessidade compulsiva de revisar detalhes, ensaiar cenários e regular variáveis fora do alcance direto.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Hiper-Responsabilidade Inflada e Culpa Antecipatória (dACC)",
                              "desc":  "Avalia a crença de que prevenir danos ou frustrações alheias é obrigação moral pessoal absoluta.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Aversão à Delegação e Medo da Contingência (BNST)",
                              "desc":  "Avalia o alarme antecipatório diante da perda de domínio direto, do tempo alheio e do imprevisto.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Custo Autonômico e Exaustão Executiva (Tônus Vagal)",
                              "desc":  "Avalia a sobrecarga somática, a rigidez corporal e o esgotamento produzidos pela vigilância contínua.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Reviso repetidamente mensagens, planilhas ou compromissos já conferidos, porque sinto que um descuido mínimo meu pode desencadear um problema grave.",
                          "domain":  "dim1",
                          "domainLabel":  "Microgerenciamento e Ilusão de Controle (dlPFC / CSTC)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Antes de qualquer conversa ou evento importante, minha mente cria dezenas de roteiros de contingência (\"Plano A, B, C e D\") para não ser pego de surpresa.",
                          "domain":  "dim1",
                          "domainLabel":  "Microgerenciamento e Ilusão de Controle (dlPFC / CSTC)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Sinto uma urgência interna de organizar e ajustar o ambiente ou a agenda das pessoas próximas para evitar atritos ou imprevistos.",
                          "domain":  "dim1",
                          "domainLabel":  "Microgerenciamento e Ilusão de Controle (dlPFC / CSTC)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Quando algo dá certo após eu ter me desgastado checando tudo, concluo que só funcionou por causa da minha vigilância constante.",
                          "domain":  "dim1",
                          "domainLabel":  "Microgerenciamento e Ilusão de Controle (dlPFC / CSTC)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Tenho grande dificuldade de improvisar ou mudar de rota de última hora sem experimentar irritação intensa ou sensação de perda de chão.",
                          "domain":  "dim1",
                          "domainLabel":  "Microgerenciamento e Ilusão de Controle (dlPFC / CSTC)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Quando algo sai errado em um projeto coletivo ou na dinâmica familiar, minha primeira reação automática é buscar onde eu falhei ou o que deixei de prever.",
                          "domain":  "dim2",
                          "domainLabel":  "Hiper-Responsabilidade Inflada e Culpa Antecipatória (dACC)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Sinto que se eu não me antecipar aos riscos por todo mundo à minha volta, alguém acabará se prejudicando por minha omissão.",
                          "domain":  "dim2",
                          "domainLabel":  "Hiper-Responsabilidade Inflada e Culpa Antecipatória (dACC)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Carrego uma culpa desproporcional quando preciso descansar, dizer \"não\" ou deixar uma pendência para o dia seguinte.",
                          "domain":  "dim2",
                          "domainLabel":  "Hiper-Responsabilidade Inflada e Culpa Antecipatória (dACC)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Mesmo sabendo que não posso controlar o humor ou as escolhas dos outros, sinto-me responsável por manter a harmonia e o bem-estar do ambiente.",
                          "domain":  "dim2",
                          "domainLabel":  "Hiper-Responsabilidade Inflada e Culpa Antecipatória (dACC)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Acredito internamente que \"baixar a guarda\" ou relaxar demais é irresponsabilidade que atrai problemas inesperados.",
                          "domain":  "dim2",
                          "domainLabel":  "Hiper-Responsabilidade Inflada e Culpa Antecipatória (dACC)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Prefiro fazer uma tarefa cansativa sozinho a delegá-la, porque não confio que o outro seguirá o padrão de qualidade ou o prazo que julgo seguro.",
                          "domain":  "dim3",
                          "domainLabel":  "Aversão à Delegação e Medo da Contingência (BNST)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Quando delego algo importante, continuo monitorando passo a passo ou acabo refazendo parte do trabalho em segredo para ficar tranquilo.",
                          "domain":  "dim3",
                          "domainLabel":  "Aversão à Delegação e Medo da Contingência (BNST)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Situações em que preciso apenas esperar uma resposta, exame, decisão ou movimento de terceiros disparam forte angústia de impotência em mim.",
                          "domain":  "dim3",
                          "domainLabel":  "Aversão à Delegação e Medo da Contingência (BNST)",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "No fundo, sinto que depender de outras pessoas ou das circunstâncias me deixa indefeso diante de decepções ou abandonos.",
                          "domain":  "dim3",
                          "domainLabel":  "Aversão à Delegação e Medo da Contingência (BNST)",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Mesmo em momentos de lazer, férias ou celebrações, fico mentalmente gerenciando horários, logística e possíveis falhas dos outros.",
                          "domain":  "dim3",
                          "domainLabel":  "Aversão à Delegação e Medo da Contingência (BNST)",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Percebo meu corpo frequentemente tenso (ombros elevados, mandíbula travada, respiração curta ou desconforto gástrico) como se estivesse sempre de plantão.",
                          "domain":  "dim4",
                          "domainLabel":  "Custo Autonômico e Exaustão Executiva (Tônus Vagal)",
                          "reverse":  false
                      },
                      {
                          "id":  17,
                          "text":  "À noite, minha mente continua revisando o que precisa ser resolvido ou prevenido no dia seguinte, dificultando o relaxamento e o sono profundo.",
                          "domain":  "dim4",
                          "domainLabel":  "Custo Autonômico e Exaustão Executiva (Tônus Vagal)",
                          "reverse":  false
                      },
                      {
                          "id":  18,
                          "text":  "Pessoas que convivem comigo frequentemente comentam que pareço rígido, impaciente ou incapaz de simplesmente deixar as coisas fluírem.",
                          "domain":  "dim4",
                          "domainLabel":  "Custo Autonômico e Exaustão Executiva (Tônus Vagal)",
                          "reverse":  false
                      },
                      {
                          "id":  19,
                          "text":  "Sinto uma exaustão mental crônica por carregar sozinho decisões, prazos e preocupações que não deveriam depender apenas de mim.",
                          "domain":  "dim4",
                          "domainLabel":  "Custo Autonômico e Exaustão Executiva (Tônus Vagal)",
                          "reverse":  false
                      },
                      {
                          "id":  20,
                          "text":  "Percebo que tentar controlar cada detalhe me dá apenas um alívio momentâneo, seguido por uma sensação ainda maior de cansaço e aprisionamento.",
                          "domain":  "dim4",
                          "domainLabel":  "Custo Autonômico e Exaustão Executiva (Tônus Vagal)",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  37,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  53,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  67,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  80,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EMLO_IC",
        "code":  "T-55",
        "shortTitle":  "EMLO-IC (Limerência e Idealização R...)",
        "fullTitle":  "Escala de Limerência e Idealização Romântica Compulsiva (EMLO-IC / T-55)",
        "cardDescription":  "20 itens (4 dim.). Intrusão Cognitiva e Loop Obsessivo (Circuito CSTC), Vigilância de Micro-Sinais e Busca Dopa....",
        "category":  "Relacionamentos \u0026 Apego",
        "icon":  "users",
        "accentColor":  "rose",
        "protocolPrefix":  "DM-REL-",
        "instruction":  "Instruções e Fundamentação Clínica: A EMLO-IC (T-55) avalia os quatro vetores neuropsicológicos da limerência descritos por Dorothy Tennov, Helen Fisher e Donatella Marazziti: (1) Intrusão Cognitiva e Loop Obsessivo (CSTC) , (2) Vigilância de Micro-Sinais e Busca Dopaminérgica...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Intrusão Cognitiva e Loop Obsessivo (Circuito CSTC)",
                              "desc":  "Avalia a perda de controle executivo voluntário diante de pensamentos involuntários e ensaios mentais repetitivos sobre a pessoa-alvo.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Vigilância de Micro-Sinais e Busca Dopaminérgica (VTA / RPE)",
                              "desc":  "Avalia a compulsão por monitorar disponibilidade e a dependência de migalhas de reciprocidade sob reforço intermitente.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Cristalização Idealizada e Apagamento da Alteridade Real",
                              "desc":  "Avalia a distorção perceptual que magnifica qualidades projetadas e minimiza evidências objetivas de incompatibilidade.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Desregulação Autonômica e Impacto na Vida Prática",
                              "desc":  "Avalia a reatividade física (peito, sono, apetite) diante do distanciamento e o prejuízo sobre a autonomia cotidiana.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Pensamentos sobre essa pessoa invadem minha mente involuntariamente durante o trabalho, estudos ou descanso, mesmo quando tento me concentrar em outra tarefa.",
                          "domain":  "dim1",
                          "domainLabel":  "Intrusão Cognitiva e Loop Obsessivo (Circuito CSTC)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Passo longos períodos ensaiando diálogos imaginários, cenários futuros ou respostas perfeitas que eu gostaria de viver com essa pessoa.",
                          "domain":  "dim1",
                          "domainLabel":  "Intrusão Cognitiva e Loop Obsessivo (Circuito CSTC)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Quando acordo ou antes de dormir, essa pessoa costuma ser o primeiro e o último pensamento automático do meu dia.",
                          "domain":  "dim1",
                          "domainLabel":  "Intrusão Cognitiva e Loop Obsessivo (Circuito CSTC)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Mesmo reconhecendo racionalmente que pensar tanto nela me prejudica, sinto que não consigo \"desligar\" o circuito mental à vontade.",
                          "domain":  "dim1",
                          "domainLabel":  "Intrusão Cognitiva e Loop Obsessivo (Circuito CSTC)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Releio mensagens antigas, áudios ou recordações de encontros passados repetidamente para extrair sinais de interesse oculto.",
                          "domain":  "dim1",
                          "domainLabel":  "Intrusão Cognitiva e Loop Obsessivo (Circuito CSTC)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Sinto um impulso recorrente de checar se a pessoa está online, visualizou meu status ou interagiu em redes sociais.",
                          "domain":  "dim2",
                          "domainLabel":  "Vigilância de Micro-Sinais e Busca Dopaminérgica (VTA / RPE)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Uma única resposta calorosa ou um elogio breve após dias de silêncio me causam uma euforia desproporcional que apaga toda a frustração anterior.",
                          "domain":  "dim2",
                          "domainLabel":  "Vigilância de Micro-Sinais e Busca Dopaminérgica (VTA / RPE)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Analiso o tempo de resposta, a escolha de emojis ou o tom exato de cada frase tentando decifrar se ela gosta de mim na mesma intensidade.",
                          "domain":  "dim2",
                          "domainLabel":  "Vigilância de Micro-Sinais e Busca Dopaminérgica (VTA / RPE)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Percebo que meu interesse e minha fixação aumentam justamente quando a pessoa se torna mais distante, ocupada ou ambígua.",
                          "domain":  "dim2",
                          "domainLabel":  "Vigilância de Micro-Sinais e Busca Dopaminérgica (VTA / RPE)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Pessoas totalmente disponíveis, previsíveis e claras quanto ao interesse por mim costumam parecer \"sem graça\" perto da adrenalina da incerteza.",
                          "domain":  "dim2",
                          "domainLabel":  "Vigilância de Micro-Sinais e Busca Dopaminérgica (VTA / RPE)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Tenho tendência a justificar ou reinterpretar comportamentos frios, incoerentes ou desatenciosos dessa pessoa como \"medo de se envolver\" ou \"excesso de trabalho\".",
                          "domain":  "dim3",
                          "domainLabel":  "Cristalização Idealizada e Apagamento da Alteridade Real",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Sinto que essa pessoa é única e insubstituível, e que ninguém mais no mundo poderia me proporcionar o mesmo encaixe ou brilho existencial.",
                          "domain":  "dim3",
                          "domainLabel":  "Cristalização Idealizada e Apagamento da Alteridade Real",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Evito conversar diretamente para esclarecer o que somos ou receber um \"não\" definitivo, porque prefiro manter a porta entreaberta da esperança.",
                          "domain":  "dim3",
                          "domainLabel":  "Cristalização Idealizada e Apagamento da Alteridade Real",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "No fundo, sinto que se essa pessoa finalmente me escolhesse por inteiro, minha insegurança e sensação de insuficiência seriam curadas.",
                          "domain":  "dim3",
                          "domainLabel":  "Cristalização Idealizada e Apagamento da Alteridade Real",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Mesmo conhecendo pouco a rotina real e os defeitos concretos dessa pessoa, sinto uma intimidade profunda e quase \"destinada\" com ela.",
                          "domain":  "dim3",
                          "domainLabel":  "Cristalização Idealizada e Apagamento da Alteridade Real",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Quando percebo frieza, demora incomum ou risco de rejeição, sinto sintomas físicos intensos (aperto no peito, nó no estômago, taquicardia ou tremor).",
                          "domain":  "dim4",
                          "domainLabel":  "Desregulação Autonômica e Impacto na Vida Prática",
                          "reverse":  false
                      },
                      {
                          "id":  17,
                          "text":  "Meu humor do dia inteiro depende diretamente de como foi minha última interação (ou falta de interação) com essa pessoa.",
                          "domain":  "dim4",
                          "domainLabel":  "Desregulação Autonômica e Impacto na Vida Prática",
                          "reverse":  false
                      },
                      {
                          "id":  18,
                          "text":  "Deixo de aproveitar compromissos, amizades ou projetos pessoais importantes porque fico aguardando ou orbitando a disponibilidade dela.",
                          "domain":  "dim4",
                          "domainLabel":  "Desregulação Autonômica e Impacto na Vida Prática",
                          "reverse":  false
                      },
                      {
                          "id":  19,
                          "text":  "Sinto uma sensação semelhante à abstinência física quando tento ficar alguns dias sem nenhum contato ou notícia dessa pessoa.",
                          "domain":  "dim4",
                          "domainLabel":  "Desregulação Autonômica e Impacto na Vida Prática",
                          "reverse":  false
                      },
                      {
                          "id":  20,
                          "text":  "Olhando com honestidade, percebo que passo mais tempo sofrendo pela ansiedade dessa conexão do que experimentando paz e bem-estar reais.",
                          "domain":  "dim4",
                          "domainLabel":  "Desregulação Autonômica e Impacto na Vida Prática",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  37,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  53,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  67,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  80,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EMHI_D",
        "code":  "T-54",
        "shortTitle":  "EMHI-D (Hiper-Racionalização e Int...)",
        "fullTitle":  "Escala Multidimensional de Hiper-Racionalização e Intelectualização Defensiva (EMHI-D / T-54)",
        "cardDescription":  "20 itens (4 dim.). Analitismo Defensivo e Abstração do Afeto (dlPFC como Escudo), Desacoplamento Somático-Inter....",
        "category":  "Metacognição \u0026 Lógica",
        "icon":  "brain",
        "accentColor":  "blue",
        "protocolPrefix":  "DM-MET-",
        "instruction":  "Aviso Científico e Psicoeducativo: Esta escala dimensional foi estruturada com base na literatura clínica sobre mecanismos de defesa cognitivos (Anna Freud; Defense Style Questionnaire - DSQ-40), nos modelos de Felt Sense e Focusing (Eugene Gendlin), na neurobiologia da recons...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Analitismo Defensivo e Abstração do Afeto (dlPFC como Escudo)",
                              "desc":  "Avalia a tendência automática de converter emoções ameaçadoras ou íntimas em teorias, discursos técnicos ou explicações abstratas.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Desacoplamento Somático-Interoceptivo (Desconexão da Ínsula Anterior)",
                              "desc":  "Avalia a dificuldade de perceber os sinais viscerais do corpo no momento presente e o distanciamento do Felt Sense.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Ilusão do Insight Suficiente (Hiato Entre Compreender e Elaborar)",
                              "desc":  "Avalia a crença de que entender cognitivamente a causa de um padrão equivale a superá-lo, gerando frustração pela persistência dos sintomas.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Análise-Paralisia e Controle Epistêmico (Sequestro pela DMN)",
                              "desc":  "Avalia a ruminação explicativa interminável que substitui a entrega, a espontaneidade e a ação encarnada nos vínculos.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando alguém me pergunta como estou me sentindo em um momento difícil, costumo responder com uma explicação lógica do contexto em vez de expressar a emoção em si.",
                          "domain":  "dim1",
                          "domainLabel":  "Analitismo Defensivo e Abstração do Afeto (dlPFC como Escudo)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Diante de conflitos afetivos, sinto alívio ao rotular o comportamento meu ou do outro com termos psicológicos, como se estivesse analisando um caso externo.",
                          "domain":  "dim1",
                          "domainLabel":  "Analitismo Defensivo e Abstração do Afeto (dlPFC como Escudo)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Sinto desconforto ou vulnerabilidade excessiva se não conseguir encontrar uma justificativa racional imediata para minha tristeza, raiva ou angústia.",
                          "domain":  "dim1",
                          "domainLabel":  "Analitismo Defensivo e Abstração do Afeto (dlPFC como Escudo)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Em discussões ou sessões terapêuticas, percebo que falo muito rápido e construo argumentos longos sempre que o assunto começa a tocar em feridas reais.",
                          "domain":  "dim1",
                          "domainLabel":  "Analitismo Defensivo e Abstração do Afeto (dlPFC como Escudo)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Tenho o hábito de consumir artigos, vídeos ou livros sobre saúde mental para me sentir no controle, mas evito me expor às emoções que esses conteúdos descrevem.",
                          "domain":  "dim1",
                          "domainLabel":  "Analitismo Defensivo e Abstração do Afeto (dlPFC como Escudo)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Tenho grande dificuldade de localizar fisicamente onde uma emoção está acontecendo no meu corpo (peito, garganta, estômago, ombros) no momento em que a vivo.",
                          "domain":  "dim2",
                          "domainLabel":  "Desacoplamento Somático-Interoceptivo (Desconexão da Ínsula Anterior)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Muitas vezes só percebo que estou estressado ou sobrecarregado quando meu corpo adoece (dor de cabeça, gastrite, insônia ou trava muscular súbita).",
                          "domain":  "dim2",
                          "domainLabel":  "Desacoplamento Somático-Interoceptivo (Desconexão da Ínsula Anterior)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Sinto que vivo quase inteiramente \"da cabeça para cima\", como se meu corpo fosse apenas um veículo que transporta meus pensamentos.",
                          "domain":  "dim2",
                          "domainLabel":  "Desacoplamento Somático-Interoceptivo (Desconexão da Ínsula Anterior)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Exercícios de escaneamento corporal ou respiração silenciosa me deixam inquieto porque parece que estou \"perdendo tempo\" sem resolver nada objetivamente.",
                          "domain":  "dim2",
                          "domainLabel":  "Desacoplamento Somático-Interoceptivo (Desconexão da Ínsula Anterior)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Quando sinto vontade de chorar ou um nó na garganta, minha mente imediatamente busca explicações racionais até que a sensação física se dissolva ou trave.",
                          "domain":  "dim2",
                          "domainLabel":  "Desacoplamento Somático-Interoceptivo (Desconexão da Ínsula Anterior)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Sinto profunda frustração por entender exatamente a origem dos meus padrões emocionais, mas continuar reagindo da mesma maneira na prática.",
                          "domain":  "dim3",
                          "domainLabel":  "Ilusão do Insight Suficiente (Hiato Entre Compreender e Elaborar)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Acredito que, se eu pensar com lógica suficiente sobre um problema emocional, eventualmente encontrarei a resposta definitiva que fará a angústia desaparecer.",
                          "domain":  "dim3",
                          "domainLabel":  "Ilusão do Insight Suficiente (Hiato Entre Compreender e Elaborar)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Costumo sentir uma sensação de superioridade ou alívio enganoso por já ter \"decifrado\" meus traumas, mesmo quando minha vida relacional continua bloqueada.",
                          "domain":  "dim3",
                          "domainLabel":  "Ilusão do Insight Suficiente (Hiato Entre Compreender e Elaborar)",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Julgo que sentir medo ou tristeza por algo que \"não faz sentido lógico\" é um sinal de fraqueza cognitiva que devo corrigir com argumentos.",
                          "domain":  "dim3",
                          "domainLabel":  "Ilusão do Insight Suficiente (Hiato Entre Compreender e Elaborar)",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Quando recebo apoio puramente afetivo sem soluções práticas ou explicações lógicas, sinto que o acolhimento foi inútil ou insuficiente.",
                          "domain":  "dim3",
                          "domainLabel":  "Ilusão do Insight Suficiente (Hiato Entre Compreender e Elaborar)",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Passo horas repassando diálogos ou eventos afetivos na mente tentando encontrar a explicação \"exata\" do que o outro quis dizer, sem tomar uma atitude real.",
                          "domain":  "dim4",
                          "domainLabel":  "Análise-Paralisia e Controle Epistêmico (Sequestro pela DMN)",
                          "reverse":  false
                      },
                      {
                          "id":  17,
                          "text":  "Evito tomar decisões importantes na vida pessoal ou afetiva enquanto não tiver analisado todas as variáveis possíveis e neutralizado o risco de erro emocional.",
                          "domain":  "dim4",
                          "domainLabel":  "Análise-Paralisia e Controle Epistêmico (Sequestro pela DMN)",
                          "reverse":  false
                      },
                      {
                          "id":  18,
                          "text":  "Pessoas próximas já comentaram que pareço distante, excessivamente técnico ou \"frio\" justamente nos momentos em que o vínculo exigia presença emocional.",
                          "domain":  "dim4",
                          "domainLabel":  "Análise-Paralisia e Controle Epistêmico (Sequestro pela DMN)",
                          "reverse":  false
                      },
                      {
                          "id":  19,
                          "text":  "Tenho dificuldade de simplesmente me entregar a momentos de prazer, música ou intimidade sem que um \"narrador interno\" fique analisando e avaliando a experiência.",
                          "domain":  "dim4",
                          "domainLabel":  "Análise-Paralisia e Controle Epistêmico (Sequestro pela DMN)",
                          "reverse":  false
                      },
                      {
                          "id":  20,
                          "text":  "Sinto que minha mente está exausta de tanto pensar sobre mim mesmo, mas ainda assim não consigo desligar o fluxo de teorias e interpretações.",
                          "domain":  "dim4",
                          "domainLabel":  "Análise-Paralisia e Controle Epistêmico (Sequestro pela DMN)",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  37,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  53,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  67,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  80,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EME_AA",
        "code":  "T-53",
        "shortTitle":  "EME-AA (Esquiva Experiencial, Anes...)",
        "fullTitle":  "Escala Multidimensional de Esquiva Experiencial, Anestesia Afetiva e Supressão Emocional (EME-AA / T-53)",
        "cardDescription":  "20 itens (4 dim.). Aversão ao Desconforto e Medo de Sentir (Intolerância Afetiva / dACC e Amígdala), Anestesia....",
        "category":  "Regulação Emocional",
        "icon":  "compass",
        "accentColor":  "teal",
        "protocolPrefix":  "DM-REG-",
        "instruction":  "Aviso Científico e Psicoeducativo: Esta escala dimensional foi estruturada com base nos modelos teóricos da Terapia de Aceitação e Compromisso (ACT - Hayes, Strosahl \u0026 Wilson) , no Acceptance and Action Questionnaire (AAQ-2) , no Brief Experiential Avoidance Questionnaire (BEA...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Aversão ao Desconforto e Medo de Sentir (Intolerância Afetiva / dACC e Amígdala)",
                              "desc":  "Avalia a intolerância a sensações viscerais incômodas e a crença de que emoções difíceis são ameaças destrutivas que precisam ser eliminadas.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Anestesia Emocional e Supressão Somática (Emotional Numbing / Ínsula Anterior)",
                              "desc":  "Mede o grau de embotamento afetivo, a desconexão dos marcadores corporais e a sensação de viver como um observador distante de si mesmo.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Fuga Comportamental e Distração Compulsiva (Vias Dopaminérgicas / Reforço Negativo)",
                              "desc":  "Identifica o uso compulsivo de distrações externas (telas, hiperocupação no trabalho, consumo e substâncias) para anestesiar tensões internas.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Perda de Flexibilidade Psicológica e Estreitamento Existencial (ACT / Rigidez Cognitiva)",
                              "desc":  "Mede o custo vital da esquiva: desistência de valores significativos, aprisionamento na rotina segura e empobrecimento da agência pessoal.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando surge uma sensação de ansiedade, tristeza ou aperto no peito, meu impulso imediato é tentar fazê-la desaparecer a qualquer custo.",
                          "domain":  "dim1",
                          "domainLabel":  "Aversão ao Desconforto e Medo de Sentir (Intolerância Afetiva / dACC e Amígdala)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Considero inaceitável ou perigoso experimentar tristeza profunda, medo ou vulnerabilidade diante dos outros.",
                          "domain":  "dim1",
                          "domainLabel":  "Aversão ao Desconforto e Medo de Sentir (Intolerância Afetiva / dACC e Amígdala)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Tenho receio de que, se eu me permitir sentir certas emoções, perderei completamente o controle sobre meus pensamentos e comportamentos.",
                          "domain":  "dim1",
                          "domainLabel":  "Aversão ao Desconforto e Medo de Sentir (Intolerância Afetiva / dACC e Amígdala)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Faço esforços conscientes constantes para evitar situações, pessoas, conversas ou memórias que possam despertar sensações incômodas.",
                          "domain":  "dim1",
                          "domainLabel":  "Aversão ao Desconforto e Medo de Sentir (Intolerância Afetiva / dACC e Amígdala)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Acredito firmemente que, para construir uma vida saudável e produtiva, é obrigatório eliminar primeiro as sensações de medo e insegurança.",
                          "domain":  "dim1",
                          "domainLabel":  "Aversão ao Desconforto e Medo de Sentir (Intolerância Afetiva / dACC e Amígdala)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Com frequência, sinto-me como se estivesse vivendo atrás de uma vidraça fumê, sem conseguir me comover ou me envolver genuinamente com a vida.",
                          "domain":  "dim2",
                          "domainLabel":  "Anestesia Emocional e Supressão Somática (Emotional Numbing / Ínsula Anterior)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Percebo que não consigo mais sentir com clareza as emoções positivas (alegria espontânea, entusiasmo, ternura amorosa) como sentia no passado.",
                          "domain":  "dim2",
                          "domainLabel":  "Anestesia Emocional e Supressão Somática (Emotional Numbing / Ínsula Anterior)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Diante de conflitos relacionais ou momentos dolorosos, meu corpo tende a \u0027desligar\u0027 ou ficar dormente, adotando uma postura fria ou impassível.",
                          "domain":  "dim2",
                          "domainLabel":  "Anestesia Emocional e Supressão Somática (Emotional Numbing / Ínsula Anterior)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Pessoas próximas ou familiares já me disseram que pareço excessivamente intelectualizado, impenetrável ou distante do próprio afeto.",
                          "domain":  "dim2",
                          "domainLabel":  "Anestesia Emocional e Supressão Somática (Emotional Numbing / Ínsula Anterior)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Tenho grande dificuldade para identificar com precisão o que está acontecendo no meu corpo (tensões, respiração, batimentos) em fases de estresse.",
                          "domain":  "dim2",
                          "domainLabel":  "Anestesia Emocional e Supressão Somática (Emotional Numbing / Ínsula Anterior)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Sempre que fico sozinho em silêncio ou sinto um vazio incômodo, abro no mesmo instante o celular para navegar nas redes ou ver vídeos.",
                          "domain":  "dim3",
                          "domainLabel":  "Fuga Comportamental e Distração Compulsiva (Vias Dopaminérgicas / Reforço Negativo)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Utilizo o excesso de trabalho, tarefas burocráticas ou rotinas hiperocupadas como uma blindagem para não pensar em dores pessoais não resolvidas.",
                          "domain":  "dim3",
                          "domainLabel":  "Fuga Comportamental e Distração Compulsiva (Vias Dopaminérgicas / Reforço Negativo)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Costumo recorrer com frequência a alimentos específicos, compras por impulso, séries maratonadas ou álcool/medicamentos para calar angústias do dia.",
                          "domain":  "dim3",
                          "domainLabel":  "Fuga Comportamental e Distração Compulsiva (Vias Dopaminérgicas / Reforço Negativo)",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Experimento uma inquietação ou pavor visceral quando sou forçado a vivenciar momentos prolongados de inatividade sem estímulos externos.",
                          "domain":  "dim3",
                          "domainLabel":  "Fuga Comportamental e Distração Compulsiva (Vias Dopaminérgicas / Reforço Negativo)",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Quando uma conversa íntima ameaça tocar em feridas ou vulnerabilidades, mudo rapidamente de assunto, faço uma ironia ou encerro a interação.",
                          "domain":  "dim3",
                          "domainLabel":  "Fuga Comportamental e Distração Compulsiva (Vias Dopaminérgicas / Reforço Negativo)",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Já desisti de sonhos vocacionais, projetos audaciosos ou relacionamentos promissores pelo pavor do desconforto emocional que poderiam provocar.",
                          "domain":  "dim4",
                          "domainLabel":  "Perda de Flexibilidade Psicológica e Estreitamento Existencial (ACT / Rigidez Cognitiva)",
                          "reverse":  false
                      },
                      {
                          "id":  17,
                          "text":  "Minha vida cotidiana tornou-se estreita e previsível, desenhada quase exclusivamente para me proteger contra crises, críticas e imprevisibilidades.",
                          "domain":  "dim4",
                          "domainLabel":  "Perda de Flexibilidade Psicológica e Estreitamento Existencial (ACT / Rigidez Cognitiva)",
                          "reverse":  false
                      },
                      {
                          "id":  18,
                          "text":  "Diante de decisões que poderiam transformar minha história mas envolvem risco de rejeição, prefiro recuar e suportar a frustração já conhecida.",
                          "domain":  "dim4",
                          "domainLabel":  "Perda de Flexibilidade Psicológica e Estreitamento Existencial (ACT / Rigidez Cognitiva)",
                          "reverse":  false
                      },
                      {
                          "id":  19,
                          "text":  "Sinto que gasto uma quantidade enorme de energia vital tentando gerenciar meus humores e medos, sobrando pouco ânimo para viver de verdade.",
                          "domain":  "dim4",
                          "domainLabel":  "Perda de Flexibilidade Psicológica e Estreitamento Existencial (ACT / Rigidez Cognitiva)",
                          "reverse":  false
                      },
                      {
                          "id":  20,
                          "text":  "Se eu pudesse escolher entre uma vida rica em significado com dores inevitáveis e uma vida neutra sem nenhuma dor, frequentemente preferiria não sentir nada.",
                          "domain":  "dim4",
                          "domainLabel":  "Perda de Flexibilidade Psicológica e Estreitamento Existencial (ACT / Rigidez Cognitiva)",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  37,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  53,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  67,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  80,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EMSV_VE",
        "code":  "T-52",
        "shortTitle":  "EMSV-VE (Sentido de Vida, Vazio Exi...)",
        "fullTitle":  "Escala Multidimensional de Sentido de Vida, Vazio Existencial e Vontade de Sentido (EMSV-VE / T-52)",
        "cardDescription":  "16 itens (4 dim.). Presença de Sentido e Propósito Eudaimônico (vmPFC / Coerência), Frustração Existencial e Se....",
        "category":  "Humor \u0026 Existencial",
        "icon":  "sun",
        "accentColor":  "emerald",
        "protocolPrefix":  "DM-HUM-",
        "instruction":  "Aviso Científico e Psicoeducativo: Esta escala foi estruturada com base nos postulados da Logoterapia e Análise Existencial de Viktor Frankl , no Purpose in Life Test (PIL - Crumbaugh \u0026 Maholick) e nas pesquisas contemporâneas em neurociência afetiva sobre bem-estar eudaimônic...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Presença de Sentido e Propósito Eudaimônico (vmPFC / Coerência)",
                              "desc":  "Mede a clareza sobre seus objetivos vitais e a sensação de que seu cotidiano possui relevância e direção duradoura.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Frustração Existencial e Sensação de Vazio (Vácuo Noogênico)",
                              "desc":  "Mede a intensidade de sensações de desvitalização, futilidade, cinismo defensivo e tédio crônico (itens invertidos no cálculo global).",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Vontade de Sentido e Agência Autodirigida (dlPFC / Autonomia)",
                              "desc":  "Mede a determinação ativa em buscar significado, aprender com a vida e agir com responsabilidade pessoal.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Resiliência Axiológica e Valores de Atitude (Frankl / Soberania)",
                              "desc":  "Mede a capacidade de sustentar integridade moral, dignidade e propósito mesmo diante de perdas, crises e dores inevitáveis.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Tenho uma compreensão clara daquilo que torna a minha vida significativa e digna de ser vivida.",
                          "domain":  "dim1",
                          "domainLabel":  "Presença de Sentido e Propósito Eudaimônico (vmPFC / Coerência)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "As metas e projetos pelos quais trabalho refletem genuinamente meus valores mais profundos, e não apenas pressões sociais.",
                          "domain":  "dim1",
                          "domainLabel":  "Presença de Sentido e Propósito Eudaimônico (vmPFC / Coerência)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Ao acordar pela manhã, sinto entusiasmo por saber que minhas ações do dia farão diferença para alguém ou para o mundo.",
                          "domain":  "dim1",
                          "domainLabel":  "Presença de Sentido e Propósito Eudaimônico (vmPFC / Coerência)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Mesmo nos dias exaustivos, consigo reconhecer que meu cansaço foi investido em algo que realmente importa.",
                          "domain":  "dim1",
                          "domainLabel":  "Presença de Sentido e Propósito Eudaimônico (vmPFC / Coerência)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Com frequência sou assaltado por uma sensação silenciosa de que minha rotina é um teatro sem sentido ou relevância real.",
                          "domain":  "dim2",
                          "domainLabel":  "Frustração Existencial e Sensação de Vazio (Vácuo Noogênico)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Recorro com frequência a distrações digitais, compras ou comida para silenciar um sentimento incômodo de vazio interior.",
                          "domain":  "dim2",
                          "domainLabel":  "Frustração Existencial e Sensação de Vazio (Vácuo Noogênico)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Sinto que conquistei estabilidade material ou profissional, mas essas conquistas não preencheram o descompasso que sinto por dentro.",
                          "domain":  "dim2",
                          "domainLabel":  "Frustração Existencial e Sensação de Vazio (Vácuo Noogênico)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Pego-me frequentemente pensando com cinismo: \u0027Tanto faz o que eu faço, nada realmente importa no final das contas\u0027.",
                          "domain":  "dim2",
                          "domainLabel":  "Frustração Existencial e Sensação de Vazio (Vácuo Noogênico)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Não espero passivamente que as circunstâncias me façam feliz; assumo a responsabilidade por construir meu próprio horizonte.",
                          "domain":  "dim3",
                          "domainLabel":  "Vontade de Sentido e Agência Autodirigida (dlPFC / Autonomia)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Dedico tempo e esforço para projetos de aprendizado ou contribuição social que não visam apenas ganho financeiro imediato.",
                          "domain":  "dim3",
                          "domainLabel":  "Vontade de Sentido e Agência Autodirigida (dlPFC / Autonomia)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Quando descubro que um caminho profissional ou pessoal perdeu a coerência ética, tenho coragem de recalcular a rota.",
                          "domain":  "dim3",
                          "domainLabel":  "Vontade de Sentido e Agência Autodirigida (dlPFC / Autonomia)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Sinto que sou autor das minhas escolhas e recuso o papel de vítima indefesa das circunstâncias cotidianas.",
                          "domain":  "dim3",
                          "domainLabel":  "Vontade de Sentido e Agência Autodirigida (dlPFC / Autonomia)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Quando enfrento um sofrimento que não posso mudar, busco transformar essa dor em amadurecimento moral e empatia com o outro.",
                          "domain":  "dim4",
                          "domainLabel":  "Resiliência Axiológica e Valores de Atitude (Frankl / Soberania)",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Encontro força interior para persistir em momentos difíceis lembrando das pessoas que amo ou das causas pelas quais luto.",
                          "domain":  "dim4",
                          "domainLabel":  "Resiliência Axiológica e Valores de Atitude (Frankl / Soberania)",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Acredito firmemente que mesmo as experiências mais duras e traumáticas do meu passado podem ser resignificadas para servir ao bem de outros.",
                          "domain":  "dim4",
                          "domainLabel":  "Resiliência Axiológica e Valores de Atitude (Frankl / Soberania)",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Sei que ninguém pode me tirar a liberdade de escolher qual atitude adotarei frente a qualquer situação adversa.",
                          "domain":  "dim4",
                          "domainLabel":  "Resiliência Axiológica e Valores de Atitude (Frankl / Soberania)",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  34,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  51,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  66,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  80,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EMCS_PS",
        "code":  "",
        "shortTitle":  "EMCS-PS (Codependência, Papel de Sa...)",
        "fullTitle":  "Escala Multidimensional de Codependência, Papel de Salvador e Desconexão do Self (EMCS-PS)",
        "cardDescription":  "16 itens (4 dim.). Compulsão por Cuidado e Resgate do Outro, Medo Visceral do Abandono e da Rejeição, Supressão....",
        "category":  "Relacionamentos \u0026 Apego",
        "icon":  "users",
        "accentColor":  "rose",
        "protocolPrefix":  "DM-REL-",
        "instruction":  "Sobre a Escala: A EMCS-PS é um instrumento psicoeducativo baseado na literatura clínica de apego (Bowlby), esquemas desadaptativos de auto-sacrifício (Young), triangulação dramática (Karpman) e neurobiologia da dor social (Eisenberger \u0026 Lieberman). Avalia 16 indicadores clínic...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Compulsão por Cuidado e Resgate do Outro",
                              "desc":  "Mede a tendência automática e involuntária de assumir a resolução dos problemas e crises alheias.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Medo Visceral do Abandono e da Rejeição",
                              "desc":  "Avalia a hiper-reatividade da dor social no dACC diante da perspectiva de desagradar ou afastar vínculos.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Supressão das Próprias Necessidades e Auto-Sacrifício",
                              "desc":  "Mede a desconexão interoceptiva e o hábito de anular as próprias vontades para priorizar o outro.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Dificuldade de Estabelecer Limites e Autonomia Relacional",
                              "desc":  "Mede a vulnerabilidade a invasões de fronteiras e o ressentimento gerado pela incapacidade de sustentar o \u0027não\u0027.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando percebo alguém próximo passando por um dilema ou erro, sinto um impulso quase incontrolável de intervir imediatamente para resolver.",
                          "domain":  "dim1",
                          "domainLabel":  "Compulsão por Cuidado e Resgate do Outro",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Fico pensando obsessivamente em soluções para crises financeiras, profissionais ou afetivas de pessoas que nem sequer me pediram ajuda.",
                          "domain":  "dim1",
                          "domainLabel":  "Compulsão por Cuidado e Resgate do Outro",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Costumo atrair parceiros ou amigos emocionalmente imaturos, caóticos ou dependentes, sentindo que tenho a \u0027missão\u0027 de transformá-los.",
                          "domain":  "dim1",
                          "domainLabel":  "Compulsão por Cuidado e Resgate do Outro",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Sinto-me mais seguro e valorizado em uma relação quando o outro depende substancialmente de mim para funcionar no dia a dia.",
                          "domain":  "dim1",
                          "domainLabel":  "Compulsão por Cuidado e Resgate do Outro",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Se alguém que amo fica em silêncio ou demonstra descontentamento, sinto um aperto imediato no peito e assumo que a culpa é minha.",
                          "domain":  "dim2",
                          "domainLabel":  "Medo Visceral do Abandono e da Rejeição",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "A mera possibilidade de ser rejeitado ou abandonado me causa uma ansiedade física tão avassaladora que sou capaz de qualquer concessão para evitá-la.",
                          "domain":  "dim2",
                          "domainLabel":  "Medo Visceral do Abandono e da Rejeição",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "No fundo, tenho a crença inconsciente de que se eu não for extremamente prestativo e útil, as pessoas perderão o interesse em ficar comigo.",
                          "domain":  "dim2",
                          "domainLabel":  "Medo Visceral do Abandono e da Rejeição",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Sinto um pavor paralisante de conflitos ou discussões abertas, preferindo ceder e pedir desculpas mesmo quando sei que estou com a razão.",
                          "domain":  "dim2",
                          "domainLabel":  "Medo Visceral do Abandono e da Rejeição",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Quando me perguntam o que eu gostaria de comer, assistir ou fazer no fim de semana, com frequência percebo que não tenho a menor ideia.",
                          "domain":  "dim3",
                          "domainLabel":  "Supressão das Próprias Necessidades e Auto-Sacrifício",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Ignoro sinais claros de cansaço extremo, sono ou dor corporal para cumprir compromissos ou favores que prometi aos outros.",
                          "domain":  "dim3",
                          "domainLabel":  "Supressão das Próprias Necessidades e Auto-Sacrifício",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Cuidar de mim mesmo (comprar algo para mim, tirar um dia de folga ou descansar) desperta uma sensação corrosiva de culpa e egoísmo.",
                          "domain":  "dim3",
                          "domainLabel":  "Supressão das Próprias Necessidades e Auto-Sacrifício",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Sinto que minha identidade só existe quando estou desempenhando um papel útil na vida de alguém; sem isso, sinto um vazio insuportável.",
                          "domain":  "dim3",
                          "domainLabel":  "Supressão das Próprias Necessidades e Auto-Sacrifício",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Dizer \u0027não\u0027 a um pedido de ajuda de familiares, amigos ou colegas me custa tanta angústia mental que acabo dizendo \u0027sim\u0027 contra a minha vontade.",
                          "domain":  "dim4",
                          "domainLabel":  "Dificuldade de Estabelecer Limites e Autonomia Relacional",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Com frequência me pego tomado por um ressentimento amargo e silencioso contra as pessoas que ajudo, pensando: \u0027Depois de tudo o que eu fiz por elas!\u0027.",
                          "domain":  "dim4",
                          "domainLabel":  "Dificuldade de Estabelecer Limites e Autonomia Relacional",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Tenho extrema dificuldade em pedir ajuda quando estou sobrecarregado, acreditando que \u0027tenho que dar conta de tudo sozinho\u0027.",
                          "domain":  "dim4",
                          "domainLabel":  "Dificuldade de Estabelecer Limites e Autonomia Relacional",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Permito repetidamente que pessoas ultrapassem meus limites de privacidade, tempo ou dinheiro para evitar o desconforto de uma conversa difícil.",
                          "domain":  "dim4",
                          "domainLabel":  "Dificuldade de Estabelecer Limites e Autonomia Relacional",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  34,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  51,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  66,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  80,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EMCS_LIDE",
        "code":  "",
        "shortTitle":  "EMCS-LIDE (Culpa do Sobrevivente, Lea...)",
        "fullTitle":  "Escala Multidimensional de Culpa do Sobrevivente, Lealdades Invisíveis e Dívida Existencial (EMCS-LIDE)",
        "cardDescription":  "20 itens (4 dim.). Culpa por Prosperidade e Dissenso de Destino, Lealdade pelo Sofrimento Compartilhado, Respon....",
        "category":  "Trauma \u0026 Esquemas",
        "icon":  "shield-alert",
        "accentColor":  "purple",
        "protocolPrefix":  "DM-TRM-",
        "instruction":  "Orientações para Preenchimento: Este instrumento clínico avalia como seu sistema nervoso e seus esquemas relacionais processam o sucesso, a estabilidade material e a felicidade pessoal em relação à sua família de origem e grupo de pertencimento. Responda a cada uma das 20 afir...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Culpa por Prosperidade e Dissenso de Destino",
                              "desc":  "Mede a aflição e o constrangimento somático ao atingir patamares de vida superiores aos dos familiares de origem.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Lealdade pelo Sofrimento Compartilhado",
                              "desc":  "Avalia a crença inconsciente de que o pertencimento à família exige carregar dores e limitações semelhantes.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Responsabilidade Onipotente e Papel de Salvador",
                              "desc":  "Mede a compulsão de resgatar familiares adultos, assumindo o papel de sustentáculo e amortecedor de crises.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Auto-Repressão do Merecimento e Tributo Inconsciente",
                              "desc":  "Avalia atos de sabotagem orçamentária, somatizações ou boicote afetivo como compensação por estar bem.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando as coisas dão muito certo para mim (dinheiro, carreira ou amor), sinto um incômodo inexplicável ou vergonha ao encontrar meus familiares.",
                          "domain":  "dim1",
                          "domainLabel":  "Culpa por Prosperidade e Dissenso de Destino",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Sinto-me desconfortável em falar sobre minhas conquistas ou meu conforto material para meus pais ou irmãos, temendo feri-los ou parecer arrogante.",
                          "domain":  "dim1",
                          "domainLabel":  "Culpa por Prosperidade e Dissenso de Destino",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Costumo esconder compras de itens de maior valor ou viagens para não parecer que estou \"abandonando\" a simplicidade da minha família de origem.",
                          "domain":  "dim1",
                          "domainLabel":  "Culpa por Prosperidade e Dissenso de Destino",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "A pergunta \"por que eu tive essas chances se meus pais sofreram tanto?\" ecoa por dentro com um sentimento corrosivo de injustiça e peso moral.",
                          "domain":  "dim1",
                          "domainLabel":  "Culpa por Prosperidade e Dissenso de Destino",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Ao receber elogios ou bônus relevantes, a primeira reação física é um aperto na garganta ou no peito, como se estivesse usurpando algo alheio.",
                          "domain":  "dim1",
                          "domainLabel":  "Culpa por Prosperidade e Dissenso de Destino",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "No fundo, sinto que ter uma vida leve e despreocupada seria uma traição invisível ao sacrifício e sofrimento dos meus antepassados.",
                          "domain":  "dim2",
                          "domainLabel":  "Lealdade pelo Sofrimento Compartilhado",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Sinto-me mais conectado e acolhido no meu clã quando também tenho problemas graves para lamentar em conjunto nas reuniões de família.",
                          "domain":  "dim2",
                          "domainLabel":  "Lealdade pelo Sofrimento Compartilhado",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Experimentar alegria plena sem ressalvas gera um receio imediato de que algo terrível vai acontecer para me castigar.",
                          "domain":  "dim2",
                          "domainLabel":  "Lealdade pelo Sofrimento Compartilhado",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Percebo que repito certos hábitos de escassez (guardar comida vencida, usar roupas gastas, recusar conforto) apenas para manter fidelidade às minhas origens.",
                          "domain":  "dim2",
                          "domainLabel":  "Lealdade pelo Sofrimento Compartilhado",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Quando penso em morar longe ou construir um estilo de vida diferente do padrão familiar, sinto um medo infantil de ser rejeitado ou excluído.",
                          "domain":  "dim2",
                          "domainLabel":  "Lealdade pelo Sofrimento Compartilhado",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Sinto que é minha obrigação moral e financeira resolver as crises de parentes adultos que tomam decisões imprudentes de forma crônica.",
                          "domain":  "dim3",
                          "domainLabel":  "Responsabilidade Onipotente e Papel de Salvador",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Dizer \"não\" a um pedido de ajuda financeira ou emocional da minha família me causa uma angústia somática tão insuportável que acabo cedendo.",
                          "domain":  "dim3",
                          "domainLabel":  "Responsabilidade Onipotente e Papel de Salvador",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Assumo com frequência o papel de terapeuta, advogado ou provedor de pais e irmãos, colocando meus próprios planos em segundo plano.",
                          "domain":  "dim3",
                          "domainLabel":  "Responsabilidade Onipotente e Papel de Salvador",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Se alguém da minha família sofre ou fracassa, sinto-me pessoalmente culpado, como se eu tivesse negligenciado minha responsabilidade de salvação.",
                          "domain":  "dim3",
                          "domainLabel":  "Responsabilidade Onipotente e Papel de Salvador",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Sinto que ganho meu direito de existir na família apenas quando estou sendo útil, socorrendo ou resolvendo emergências alheias.",
                          "domain":  "dim3",
                          "domainLabel":  "Responsabilidade Onipotente e Papel de Salvador",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Pouco tempo depois de alcançar uma conquista importante, cometo erros financeiros graves, desorganizo meu orçamento ou perco recursos.",
                          "domain":  "dim4",
                          "domainLabel":  "Auto-Repressão do Merecimento e Tributo Inconsciente",
                          "reverse":  false
                      },
                      {
                          "id":  17,
                          "text":  "Desenvolvo dores físicas inexplicáveis, enxaquecas ou fadiga incapacitante justamente quando a minha rotina profissional e pessoal está estável.",
                          "domain":  "dim4",
                          "domainLabel":  "Auto-Repressão do Merecimento e Tributo Inconsciente",
                          "reverse":  false
                      },
                      {
                          "id":  18,
                          "text":  "Costumo escolher relacionamentos afetivos caóticos, desgastantes ou financeiramente dependentes que reproduzem o sofrimento da minha infância.",
                          "domain":  "dim4",
                          "domainLabel":  "Auto-Repressão do Merecimento e Tributo Inconsciente",
                          "reverse":  false
                      },
                      {
                          "id":  19,
                          "text":  "Empresto dinheiro que me fará falta para pessoas que claramente não têm como pagar, apenas para me desvencilhar da culpa de ter acumulado reserva.",
                          "domain":  "dim4",
                          "domainLabel":  "Auto-Repressão do Merecimento e Tributo Inconsciente",
                          "reverse":  false
                      },
                      {
                          "id":  20,
                          "text":  "Sinto uma estranha sensação de alívio psíquico quando passo por uma crise ou prejuízo material, como se a dívida moral tivesse sido temporariamente paga.",
                          "domain":  "dim4",
                          "domainLabel":  "Auto-Repressão do Merecimento e Tributo Inconsciente",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  42,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  64,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  82,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  100,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EMAS_AS",
        "code":  "",
        "shortTitle":  "EMAS-AS (Auto-Sabotagem, Aversão à...)",
        "fullTitle":  "Escala Multidimensional de Auto-Sabotagem, Aversão à Serenidade e Tolerância ao Bem-Estar (EMAS-AS)",
        "cardDescription":  "20 itens (4 dim.). Aversão à Calmaria e Ansiedade Antecipatória de Catástrofe (ACAC), Comportamentos Ativos de....",
        "category":  "Trauma \u0026 Esquemas",
        "icon":  "shield-alert",
        "accentColor":  "purple",
        "protocolPrefix":  "DM-TRM-",
        "instruction":  "Instruções e Fundamentação Científica: Este instrumento avalia como seu sistema nervoso lida com momentos de estabilidade, paz afetiva e conquistas positivas. Para cada afirmação a seguir, assinale a opção que melhor descreve sua experiência somática e seus comportamentos espo...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "1 Nunca / Raramente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "2 Ocasionalmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "3 Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "4 Muito Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "5 Quase Sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Aversão à Calmaria e Ansiedade Antecipatória de Catástrofe (ACAC)",
                              "desc":  "Mede a hipervigilância do BNST e a incapacidade fisiológica de confiar que a estabilidade é segura.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Comportamentos Ativos de Auto-Sabotagem e Provocação de Crises (CAAS)",
                              "desc":  "Mede a ação motora compensatória para restaurar a profecia do desastre e restabelecer o controle preditivo.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Desconfiança do Afeto, Intimidade e Valência Positiva (DAIV)",
                              "desc":  "Avalia a desativação do apego e a aversão ao acolhimento (Upper Limit Problem relacional).",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Rigidez de Alerta e Incapacidade de Relaxamento Somático (RARS)",
                              "desc":  "Avalia a falha do freio vagal ventral e o rebote simpático corporal ao tentar repousar.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando minha vida entra em um período pacífico e sem emergências, sinto um aperto no peito e a certeza de que algo terrível vai acontecer.",
                          "domain":  "dim1",
                          "domainLabel":  "Aversão à Calmaria e Ansiedade Antecipatória de Catástrofe (ACAC)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Tenho a sensação de que relaxar de verdade é perigoso, como se eu estivesse \u0027baixando a guarda\u0027 para ser atacado de surpresa.",
                          "domain":  "dim1",
                          "domainLabel":  "Aversão à Calmaria e Ansiedade Antecipatória de Catástrofe (ACAC)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Quando as coisas dão certo além das minhas expectativas, sou invadido por um medo quase supersticioso de que o destino vai me cobrar o preço.",
                          "domain":  "dim1",
                          "domainLabel":  "Aversão à Calmaria e Ansiedade Antecipatória de Catástrofe (ACAC)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Acho o silêncio de um fim de semana sem compromissos inquietante e agoniante, sentindo urgência de inventar tarefas para me ocupar.",
                          "domain":  "dim1",
                          "domainLabel":  "Aversão à Calmaria e Ansiedade Antecipatória de Catástrofe (ACAC)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Costumo antecipar mentalmente cenários de luto, demissão ou ruína financeira logo após vivenciar um momento de grande celebração.",
                          "domain":  "dim1",
                          "domainLabel":  "Aversão à Calmaria e Ansiedade Antecipatória de Catástrofe (ACAC)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Pego-me puxando discussões ásperas ou desenterrando mágoas antigas com pessoas queridas exatamente quando estamos em perfeita harmonia.",
                          "domain":  "dim2",
                          "domainLabel":  "Comportamentos Ativos de Auto-Sabotagem e Provocação de Crises (CAAS)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Costumo procrastinar gravemente tarefas decisivas ou cometer erros descuidados quando estou na reta final de uma conquista profissional importante.",
                          "domain":  "dim2",
                          "domainLabel":  "Comportamentos Ativos de Auto-Sabotagem e Provocação de Crises (CAAS)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Quando consigo juntar uma boa reserva financeira, sinto um impulso quase incontrolável de fazer gastos impulsivos e desnecessários.",
                          "domain":  "dim2",
                          "domainLabel":  "Comportamentos Ativos de Auto-Sabotagem e Provocação de Crises (CAAS)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Prefiro quebrar um acordo ou romper um projeto por conta própria antes que a outra parte possa eventualmente falhar comigo.",
                          "domain":  "dim2",
                          "domainLabel":  "Comportamentos Ativos de Auto-Sabotagem e Provocação de Crises (CAAS)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Estranhamente, sinto uma onda de alívio e clareza mental quando uma crise de fato se instala, como se o mundo finalmente fizesse sentido.",
                          "domain":  "dim2",
                          "domainLabel":  "Comportamentos Ativos de Auto-Sabotagem e Provocação de Crises (CAAS)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Quando alguém me elogia calorosamente ou demonstra afeto sincero, sinto vontade de me esquivar ou desqualificar o mérito.",
                          "domain":  "dim3",
                          "domainLabel":  "Desconfiança do Afeto, Intimidade e Valência Positiva (DAIV)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Desconfio de relacionamentos que fluem sem dramas; acho que a falta de conflito é sinal de frieza ou falsidade.",
                          "domain":  "dim3",
                          "domainLabel":  "Desconfiança do Afeto, Intimidade e Valência Positiva (DAIV)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Sinto uma voz interna sussurrando que se as pessoas conhecerem minhas fragilidades mais profundas, inevitavelmente me abandonarão.",
                          "domain":  "dim3",
                          "domainLabel":  "Desconfiança do Afeto, Intimidade e Valência Positiva (DAIV)",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Tenho tendência a me afastar emocionalmente de parceiros ou amigos logo após vivenciar um momento de grande proximidade e intimidade.",
                          "domain":  "dim3",
                          "domainLabel":  "Desconfiança do Afeto, Intimidade e Valência Positiva (DAIV)",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Sinto vergonha ou desconforto corporal quando sou o centro das atenções por motivos puramente positivos e festivos.",
                          "domain":  "dim3",
                          "domainLabel":  "Desconfiança do Afeto, Intimidade e Valência Positiva (DAIV)",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Meu corpo mantém músculos contraídos (ombros, mandíbula, abdômen) mesmo quando estou deitado em repouso absoluto.",
                          "domain":  "dim4",
                          "domainLabel":  "Rigidez de Alerta e Incapacidade de Relaxamento Somático (RARS)",
                          "reverse":  false
                      },
                      {
                          "id":  17,
                          "text":  "Sinto culpa intolerável quando passo algumas horas sem produzir nada útil ou sem resolver problemas.",
                          "domain":  "dim4",
                          "domainLabel":  "Rigidez de Alerta e Incapacidade de Relaxamento Somático (RARS)",
                          "reverse":  false
                      },
                      {
                          "id":  18,
                          "text":  "Práticas lentas de relaxamento (como meditação guiada ou respiração pausada) me deixam mais ansioso e agitado do que calmo.",
                          "domain":  "dim4",
                          "domainLabel":  "Rigidez de Alerta e Incapacidade de Relaxamento Somático (RARS)",
                          "reverse":  false
                      },
                      {
                          "id":  19,
                          "text":  "Preciso de estímulos de adrenalina (prazos no limite, sobrecarga de trabalho, discussões) para me sentir acordado e motivado.",
                          "domain":  "dim4",
                          "domainLabel":  "Rigidez de Alerta e Incapacidade de Relaxamento Somático (RARS)",
                          "reverse":  false
                      },
                      {
                          "id":  20,
                          "text":  "Considero a frase \u0027tudo vai ficar bem\u0027 uma ilusão ingênua; acredito que só quem espera o pior está verdadeiramente protegido.",
                          "domain":  "dim4",
                          "domainLabel":  "Rigidez de Alerta e Incapacidade de Relaxamento Somático (RARS)",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  42,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  64,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  82,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  100,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EMCS_VSR",
        "code":  "T-48",
        "shortTitle":  "EMCS-VSR (Comparação Social e Vulner...)",
        "fullTitle":  "Escala Multidimensional de Comparação Social e Vulnerabilidade ao Status Relativo (EMCS-VSR / T-48)",
        "cardDescription":  "20 itens (4 dim.). Monitoramento Compulsivo do Outro e Comparação Ascendente (MCCA), Dor Social de Desvantagem....",
        "category":  "Relacionamentos \u0026 Apego",
        "icon":  "users",
        "accentColor":  "rose",
        "protocolPrefix":  "DM-REL-",
        "instruction":  "Objetivo Psicoeducativo: A comparação social compulsiva ocorre quando a percepção de valor pessoal deixa de ser ancorada em princípios intrínsecos e passa a depender do status relativo frente a terceiros. Este instrumento autoaplicável avalia o nível de vigilância comparativa,...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "1 Nunca / Raramente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "2 Ocasionalmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "3 Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "4 Muito Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "5 Quase Sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Monitoramento Compulsivo do Outro e Comparação Ascendente (MCCA)",
                              "desc":  "Avalia a frequência e intensidade com que você monitora o progresso, posses e estilo de vida alheios.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Dor Social de Desvantagem e Alarme Cingulado (DSAC)",
                              "desc":  "Avalia a repercussão somática, o aperto visceral e a angústia ao constatar desvantagem relativa.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Ressentimento Defensivo, Inveja Maligna e Schadenfreude (RDIM)",
                              "desc":  "Avalia a presença de hostilidade velada, desqualificação defensiva do outro e alívio com o tropeço alheio.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Autoestima Contingente e Flutuação de Valor (ACFV)",
                              "desc":  "Avalia a fragilidade do autoconceito e a dependência do reconhecimento comparativo externo para se sentir digno.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Ao abrir redes sociais, pego-me checando involuntariamente o sucesso profissional, estilo de vida ou bens materiais de pessoas da minha idade.",
                          "domain":  "dim1",
                          "domainLabel":  "Monitoramento Compulsivo do Outro e Comparação Ascendente (MCCA)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Costumo medir a qualidade das minhas conquistas comparando-as imediatamente com o que meus colegas ou amigos estão alcançando.",
                          "domain":  "dim1",
                          "domainLabel":  "Monitoramento Compulsivo do Outro e Comparação Ascendente (MCCA)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Presto atenção minuciosa em detalhes como marcas de roupas, veículos, viagens e cargos das pessoas ao meu redor em eventos ou reuniões.",
                          "domain":  "dim1",
                          "domainLabel":  "Monitoramento Compulsivo do Outro e Comparação Ascendente (MCCA)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Sinto um impulso persistente de descobrir quanto outras pessoas da minha área ganham ou quanto cobraram por determinados serviços.",
                          "domain":  "dim1",
                          "domainLabel":  "Monitoramento Compulsivo do Outro e Comparação Ascendente (MCCA)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Mesmo quando algo vai bem na minha vida, minha mente busca alguém que tenha feito melhor ou de forma mais rápida.",
                          "domain":  "dim1",
                          "domainLabel":  "Monitoramento Compulsivo do Outro e Comparação Ascendente (MCCA)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Saber do sucesso estrondoso de alguém próximo me gera uma sensação física de peso no peito, desânimo ou aperto no estômago.",
                          "domain":  "dim2",
                          "domainLabel":  "Dor Social de Desvantagem e Alarme Cingulado (DSAC)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Sinto uma sensação dolorosa de estar \u0027ficando para trás\u0027 na vida enquanto todos ao meu redor parecem avançar a passos largos.",
                          "domain":  "dim2",
                          "domainLabel":  "Dor Social de Desvantagem e Alarme Cingulado (DSAC)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "A notícia de uma grande conquista de terceiros já arruinou o meu bom humor ou a produtividade pelo restante do dia.",
                          "domain":  "dim2",
                          "domainLabel":  "Dor Social de Desvantagem e Alarme Cingulado (DSAC)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Experimento um sentimento difuso de vergonha ou inadequação quando preciso relatar minha rotina simples perto de pessoas de alto prestígio.",
                          "domain":  "dim2",
                          "domainLabel":  "Dor Social de Desvantagem e Alarme Cingulado (DSAC)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Tenho a sensação de que, não importa o quanto eu trabalhe, nunca será suficiente para me equiparar aos meus padrões de referência.",
                          "domain":  "dim2",
                          "domainLabel":  "Dor Social de Desvantagem e Alarme Cingulado (DSAC)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Quando vejo alguém ser muito elogiado, minha mente tenta encontrar defeitos ocultos, privilégios familiares ou atalhos que essa pessoa usou.",
                          "domain":  "dim3",
                          "domainLabel":  "Ressentimento Defensivo, Inveja Maligna e Schadenfreude (RDIM)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Já experimentei um alívio secreto ou discreta satisfação ao saber que uma pessoa de grande sucesso cometeu um erro grave ou passou por um revés.",
                          "domain":  "dim3",
                          "domainLabel":  "Ressentimento Defensivo, Inveja Maligna e Schadenfreude (RDIM)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Custa-me parabenizar genuinamente e com entusiasmo sincero amigos que conseguiram vitórias que eu desejava para mim.",
                          "domain":  "dim3",
                          "domainLabel":  "Ressentimento Defensivo, Inveja Maligna e Schadenfreude (RDIM)",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Tendo a achar injusto que pessoas que considero intelectualmente ou tecnicamente inferiores a mim tenham mais visibilidade ou dinheiro.",
                          "domain":  "dim3",
                          "domainLabel":  "Ressentimento Defensivo, Inveja Maligna e Schadenfreude (RDIM)",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Sinto que o mundo distribui recompensas de forma totalmente arbitrária e isso me deixa amargurado ou com vontade de desistir.",
                          "domain":  "dim3",
                          "domainLabel":  "Ressentimento Defensivo, Inveja Maligna e Schadenfreude (RDIM)",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Minha sensação de valor pessoal oscila drasticamente dependendo de eu estar em vantagem ou em desvantagem no meu grupo social.",
                          "domain":  "dim4",
                          "domainLabel":  "Autoestima Contingente e Flutuação de Valor (ACFV)",
                          "reverse":  false
                      },
                      {
                          "id":  17,
                          "text":  "Tenho dificuldade de desfrutar de momentos simples se sinto que eles não são \u0027instagramáveis\u0027 ou impressionantes para os outros.",
                          "domain":  "dim4",
                          "domainLabel":  "Autoestima Contingente e Flutuação de Valor (ACFV)",
                          "reverse":  false
                      },
                      {
                          "id":  18,
                          "text":  "Se alguém do meu convívio adquire um bem superior ao meu (ex: celular, carro, viagem), sinto necessidade quase imediata de atualizar os meus.",
                          "domain":  "dim4",
                          "domainLabel":  "Autoestima Contingente e Flutuação de Valor (ACFV)",
                          "reverse":  false
                      },
                      {
                          "id":  19,
                          "text":  "Preciso que pessoas influentes ou admiradas validem explicitamente o meu trabalho para que eu acredite que ele realmente tem valor.",
                          "domain":  "dim4",
                          "domainLabel":  "Autoestima Contingente e Flutuação de Valor (ACFV)",
                          "reverse":  false
                      },
                      {
                          "id":  20,
                          "text":  "Sinto que minha identidade é frágil e que posso ser \u0027apagado\u0027 ou esquecido se parar de competir e exibir resultados públicos.",
                          "domain":  "dim4",
                          "domainLabel":  "Autoestima Contingente e Flutuação de Valor (ACFV)",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  42,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  64,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  82,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  100,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EVGAE",
        "code":  "T-47",
        "shortTitle":  "EVGAE (Vulnerabilidade ao Gasligh...)",
        "fullTitle":  "Escala de Vulnerabilidade ao Gaslighting e Autodúvida Epistêmica (EVGAE / T-47)",
        "cardDescription":  "20 itens (4 dim.). Erosão da Confiança Perceptiva e Sensorial (ECPS), Terceirização do Critério de Realidade (T....",
        "category":  "Relacionamentos \u0026 Apego",
        "icon":  "users",
        "accentColor":  "rose",
        "protocolPrefix":  "DM-REL-",
        "instruction":  "Objetivo Psicoeducativo: O gaslighting epistêmico é uma forma de manipulação e invalidação na qual a vítima é levada a desacreditar de suas próprias percepções sensoriais, memórias e sentimentos legítimos. Este instrumento autoaplicável avalia o nível de erosão da certeza inte...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "1 Nunca / Raramente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "2 Ocasionalmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "3 Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "4 Muito Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "5 Quase Sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Erosão da Confiança Perceptiva e Sensorial (ECPS)",
                              "desc":  "Avalia a frequência com que você duvida do que viu, ouviu ou sentiu após ser contrariado.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Terceirização do Critério de Realidade (TCRV)",
                              "desc":  "Mede a dependência da aprovação e versão do outro para validar a própria vida.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Alarme Contínuo e Hipervigilância de Autoculpa (ACHA)",
                              "desc":  "Avalia o estado de alerta, desculpas compulsivas e resposta de fawning/apaziguamento.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Supressão da Agência Decisória e Paralisia Metacognitiva (SADPM)",
                              "desc":  "Avalia a inibição da autonomia de escolha e a perda da autoridade em primeira pessoa.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando alguém nega com firmeza ter dito algo que me magoou, começo a achar que posso ter interpretado mal ou inventado a lembrança.",
                          "domain":  "dim1",
                          "domainLabel":  "Erosão da Confiança Perceptiva e Sensorial (ECPS)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Sinto necessidade frequente de conferir mensagens antigas, fotos ou registros para provar a mim mesmo que determinados fatos realmente aconteceram.",
                          "domain":  "dim1",
                          "domainLabel":  "Erosão da Confiança Perceptiva e Sensorial (ECPS)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Ao relatar um acontecimento importante, uso ressalvas constantes como \"posso estar enganado\" ou \"talvez seja só impressão minha\".",
                          "domain":  "dim1",
                          "domainLabel":  "Erosão da Confiança Perceptiva e Sensorial (ECPS)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Se o outro afirma que minha reação emocional é \"exagerada\" ou \"loucura\", passo a me culpar e desconsidero o que meu corpo estava sentindo.",
                          "domain":  "dim1",
                          "domainLabel":  "Erosão da Confiança Perceptiva e Sensorial (ECPS)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Tenho a sensação assustadora de que minha memória recente está falhando gravemente nas discussões do dia a dia.",
                          "domain":  "dim1",
                          "domainLabel":  "Erosão da Confiança Perceptiva e Sensorial (ECPS)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Costumo perguntar a terceiros se determinada atitude ou sentimento meu foi normal ou se estou de fato \"fora da realidade\".",
                          "domain":  "dim2",
                          "domainLabel":  "Terceirização do Critério de Realidade (TCRV)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Sinto que a versão que o outro apresenta sobre os conflitos soa sempre mais articulada, lógica e autorizada do que a minha.",
                          "domain":  "dim2",
                          "domainLabel":  "Terceirização do Critério de Realidade (TCRV)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Adoto a opinião do outro mesmo quando minhas impressões mais íntimas apontavam para o sentido exatamente oposto.",
                          "domain":  "dim2",
                          "domainLabel":  "Terceirização do Critério de Realidade (TCRV)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Evito expressar pontos de vista em público por medo de ser corrigido e exposto como alguém confuso ou desinformado.",
                          "domain":  "dim2",
                          "domainLabel":  "Terceirização do Critério de Realidade (TCRV)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Tenho a sensação de que dependo do consentimento de outra pessoa para ter certeza de quem eu sou e do que estou fazendo.",
                          "domain":  "dim2",
                          "domainLabel":  "Terceirização do Critério de Realidade (TCRV)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Peço desculpas repetidamente ao longo do dia, mesmo quando não sei claramente o que posso ter feito de errado.",
                          "domain":  "dim3",
                          "domainLabel":  "Alarme Contínuo e Hipervigilância de Autoculpa (ACHA)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Vivo com a sensação constante de \"pisar em ovos\", calculando minuciosamente cada palavra para evitar reações de desdém ou raiva.",
                          "domain":  "dim3",
                          "domainLabel":  "Alarme Contínuo e Hipervigilância de Autoculpa (ACHA)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Quando há qualquer tensão ou mau humor no ambiente, assumo imediatamente a hipótese de que a culpa é minha.",
                          "domain":  "dim3",
                          "domainLabel":  "Alarme Contínuo e Hipervigilância de Autoculpa (ACHA)",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Sinto um aperto visceral no peito ou estômago antes de conversar sobre qualquer assunto delicado ou discordância.",
                          "domain":  "dim3",
                          "domainLabel":  "Alarme Contínuo e Hipervigilância de Autoculpa (ACHA)",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Tento justificar e defender os comportamentos grosseiros de terceiros para amigos e familiares, escondendo o que realmente acontece.",
                          "domain":  "dim3",
                          "domainLabel":  "Alarme Contínuo e Hipervigilância de Autoculpa (ACHA)",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Sinto uma angústia desproporcional para tomar decisões simples (como escolher uma roupa, o que almoçar ou planejar o fim de semana).",
                          "domain":  "dim4",
                          "domainLabel":  "Supressão da Agência Decisória e Paralisia Metacognitiva (SADPM)",
                          "reverse":  false
                      },
                      {
                          "id":  17,
                          "text":  "Tenho a sensação de que antes eu era uma pessoa muito mais confiante, decidida e alegre, e que me transformei em alguém frágil e inseguro.",
                          "domain":  "dim4",
                          "domainLabel":  "Supressão da Agência Decisória e Paralisia Metacognitiva (SADPM)",
                          "reverse":  false
                      },
                      {
                          "id":  18,
                          "text":  "Fico paralisado diante de cobranças ou prazos no trabalho por medo extremo de que meu raciocínio esteja fundamentalmente errado.",
                          "domain":  "dim4",
                          "domainLabel":  "Supressão da Agência Decisória e Paralisia Metacognitiva (SADPM)",
                          "reverse":  false
                      },
                      {
                          "id":  19,
                          "text":  "Abandonei atividades, amizades ou interesses que eu gostava porque o outro criticava ou afirmava que eram fúteis.",
                          "domain":  "dim4",
                          "domainLabel":  "Supressão da Agência Decisória e Paralisia Metacognitiva (SADPM)",
                          "reverse":  false
                      },
                      {
                          "id":  20,
                          "text":  "Sinto que perdi o direito legítimo de dizer \"não\" ou de sustentar minha palavra quando alguém manifesta descontentamento.",
                          "domain":  "dim4",
                          "domainLabel":  "Supressão da Agência Decisória e Paralisia Metacognitiva (SADPM)",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  42,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  64,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  82,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  100,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EDC_RD",
        "code":  "T-46",
        "shortTitle":  "EDC-RD (Dissonância Cognitiva e Ra...)",
        "fullTitle":  "Escala de Dissonância Cognitiva e Racionalização Defensiva (EDC-RD / T-46)",
        "cardDescription":  "20 itens (4 dim.). Tensão de Incoerência e Alarme Aversivo (TIAA), Racionalização Pós-Decisão e Supressão da Dú....",
        "category":  "Metacognição \u0026 Lógica",
        "icon":  "brain",
        "accentColor":  "blue",
        "protocolPrefix":  "DM-MET-",
        "instruction":  "Objetivo Psicoeducativo: A Escala de Dissonância Cognitiva e Racionalização Defensiva (EDC-RD) avalia como seu cérebro lida com contradições internas, erros de conduta e informações que ameaçam seu autoconceito. Quando nossas ações colidem com nossos valores, o córtex cingulad...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Tensão de Incoerência e Alarme Aversivo (TIAA)",
                              "desc":  "Monitora a reatividade afetiva e física imediata ao perceber incoerências entre ações e valores (eixo dACC-Ínsula).",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Racionalização Pós-Decisão e Supressão da Dúvida (RPDD)",
                              "desc":  "Avalia a velocidade com que a mente recruta defesas verbais para justificar escolhas incoerentes (dlPFC defensivo).",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Blindagem Identitária e Rejeição de Evidências (BIRE)",
                              "desc":  "Mede a relutância em admitir equívocos conceituais e a tendência a desqualificar fatos que contrariam crenças do Ego.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Distorção Retrospectiva da Memória e Autoengano (DRMA)",
                              "desc":  "Avalia a tendência a reescrever o passado para manter uma narrativa de coerência contínua (o \"Intérprete\" hipocampal).",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando ajo de forma contrária a um princípio meu, sinto um aperto físico imediato ou mal-estar visceral.",
                          "domain":  "dim1",
                          "domainLabel":  "Tensão de Incoerência e Alarme Aversivo (TIAA)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Fico inquieto e agitado mentalmente quando percebo que quebrei uma promessa que fiz a mim mesmo.",
                          "domain":  "dim1",
                          "domainLabel":  "Tensão de Incoerência e Alarme Aversivo (TIAA)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Saber que cometi um deslize ético ou moral consome minha atenção e dificulta meu foco em outras tarefas.",
                          "domain":  "dim1",
                          "domainLabel":  "Tensão de Incoerência e Alarme Aversivo (TIAA)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Experimento uma urgência interna quase insuportável de resolver ou remediar qualquer contradição em minhas atitudes.",
                          "domain":  "dim1",
                          "domainLabel":  "Tensão de Incoerência e Alarme Aversivo (TIAA)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "A percepção de que posso estar sendo hipócrita em alguma área da minha vida me provoca forte angústia existencial.",
                          "domain":  "dim1",
                          "domainLabel":  "Tensão de Incoerência e Alarme Aversivo (TIAA)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Logo após fazer algo que não deveria, encontro rapidamente uma justificativa racional que me faz sentir em paz.",
                          "domain":  "dim2",
                          "domainLabel":  "Racionalização Pós-Decisão e Supressão da Dúvida (RPDD)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Costumo usar frases como \"eu mereço isso hoje\" ou \"foi uma exceção necessária\" para atenuar a quebra de regras pessoais.",
                          "domain":  "dim2",
                          "domainLabel":  "Racionalização Pós-Decisão e Supressão da Dúvida (RPDD)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Quando escolho um caminho e ele dá errado, convenço-me de que \"as circunstâncias externas tornavam qualquer outra opção impossível\".",
                          "domain":  "dim2",
                          "domainLabel":  "Racionalização Pós-Decisão e Supressão da Dúvida (RPDD)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Após tomar uma decisão difícil, desvalorizo imediatamente todas as qualidades da alternativa que rejeitei.",
                          "domain":  "dim2",
                          "domainLabel":  "Racionalização Pós-Decisão e Supressão da Dúvida (RPDD)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Tenho facilidade em argumentar logicamente para defender decisões que, no íntimo, sei que foram tomadas por pura impulsividade.",
                          "domain":  "dim2",
                          "domainLabel":  "Racionalização Pós-Decisão e Supressão da Dúvida (RPDD)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Quando alguém aponta um erro objetivo em algo que afirmei, minha primeira reação espontânea é rebater ou desqualificar a pessoa.",
                          "domain":  "dim3",
                          "domainLabel":  "Blindagem Identitária e Rejeição de Evidências (BIRE)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Admitir publicamente que mudei de opinião porque estava errado sobre um tema central parece uma derrota dolorosa.",
                          "domain":  "dim3",
                          "domainLabel":  "Blindagem Identitária e Rejeição de Evidências (BIRE)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Tendo a ignorar ou desmerecer notícias e estudos científicos que contradigam meus posicionamentos prévios.",
                          "domain":  "dim3",
                          "domainLabel":  "Blindagem Identitária e Rejeição de Evidências (BIRE)",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Em discussões acaloradas, foco mais em encontrar falhas na fala do outro do que em verificar se meu próprio argumento se sustenta.",
                          "domain":  "dim3",
                          "domainLabel":  "Blindagem Identitária e Rejeição de Evidências (BIRE)",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "A ideia de que posso ter passado anos sustentando uma ilusão sobre alguém ou sobre mim mesmo me apavora a ponto de preferir não investigar.",
                          "domain":  "dim3",
                          "domainLabel":  "Blindagem Identitária e Rejeição de Evidências (BIRE)",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Percebo com frequência que minha memória de uma discussão suavizou minhas próprias falhas e amplificou os excessos do outro.",
                          "domain":  "dim4",
                          "domainLabel":  "Distorção Retrospectiva da Memória e Autoengano (DRMA)",
                          "reverse":  false
                      },
                      {
                          "id":  17,
                          "text":  "Quando um projeto dá certo, afirmo para mim mesmo que \"eu já sabia desde o começo\", mesmo que estivesse cheio de dúvidas.",
                          "domain":  "dim4",
                          "domainLabel":  "Distorção Retrospectiva da Memória e Autoengano (DRMA)",
                          "reverse":  false
                      },
                      {
                          "id":  18,
                          "text":  "Costumo reinterpretar minhas motivações antigas para que elas pareçam mais nobres e calculadas do que realmente foram na época.",
                          "domain":  "dim4",
                          "domainLabel":  "Distorção Retrospectiva da Memória e Autoengano (DRMA)",
                          "reverse":  false
                      },
                      {
                          "id":  19,
                          "text":  "Prefiro acreditar em uma versão romantizada do meu passado do que admitir períodos em que agi com covardia ou egoísmo.",
                          "domain":  "dim4",
                          "domainLabel":  "Distorção Retrospectiva da Memória e Autoengano (DRMA)",
                          "reverse":  false
                      },
                      {
                          "id":  20,
                          "text":  "Quando sou confrontado com gravações, mensagens antigas ou registros que desmentem minha versão, sinto uma desorientação profunda e tento achar brechas no registro.",
                          "domain":  "dim4",
                          "domainLabel":  "Distorção Retrospectiva da Memória e Autoengano (DRMA)",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  42,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  64,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  82,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  100,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EHIS_DA",
        "code":  "T-45",
        "shortTitle":  "EHIS-DA (Hiperindependência Defensi...)",
        "fullTitle":  "Escala de Hiperindependência Defensiva e Desativação do Apego (EHIS-DA / T-45)",
        "cardDescription":  "16 itens (4 dim.). Supressão de Necessidades e Bloqueio de Vulnerabilidade (SNBV), Medo de Dependência e Descon....",
        "category":  "Relacionamentos \u0026 Apego",
        "icon":  "users",
        "accentColor":  "rose",
        "protocolPrefix":  "DM-REL-",
        "instruction":  "Fundamentação Psicométrica: Estruturada a partir da literatura clássica de Apego Adulto (Bowlby, 1982; Mikulincer \u0026 Shaver, 2016), da Terapia do Esquema (Young et al., 2008) e da Teoria da Linha de Base Social (Coan \u0026 Sbarra, 2015), esta escala quantifica os mecanismos de desa...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Raramente / Nunca",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Ocasionalmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Moderadamente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Quase Sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Supressão de Necessidades e Bloqueio de Vulnerabilidade (SNBV)",
                              "desc":  "Tendência a esconder fragilidades pessoais, dor física ou cansaço para evitar parecer necessitado ou fraco.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Medo de Dependência e Desconfiança da Ajuda Alheia (MDDA)",
                              "desc":  "Sensação de que depender de terceiros gera vulnerabilidade a abusos, cobranças ou perda da liberdade.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Desativação Emocional e Intelectualização do Estresse (DEIE)",
                              "desc":  "Uso de racionalização lógica excessiva e distanciamento afetivo para bloquear sentimentos incômodos.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Custo Psicofisiológico e Tensão Somática da Solidão (CPTS)",
                              "desc":  "Manifestação corporal da sobrecarga alostática e exaustão gerada por carregar tudo sem suporte social.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Mesmo quando estou física ou emocionalmente exausto, prefiro continuar sozinho a admitir para alguém que preciso de descanso ou apoio.",
                          "domain":  "dim1",
                          "domainLabel":  "Supressão de Necessidades e Bloqueio de Vulnerabilidade (SNBV)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Sinto um desconforto agudo ou até vergonha quando alguém me vê chorando ou percebe que perdi o controle de uma situação.",
                          "domain":  "dim1",
                          "domainLabel":  "Supressão de Necessidades e Bloqueio de Vulnerabilidade (SNBV)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Costumo me apresentar perante a família, amigos e colegas como a pessoa forte que resolve os problemas de todos, mas nunca compartilha os próprios.",
                          "domain":  "dim1",
                          "domainLabel":  "Supressão de Necessidades e Bloqueio de Vulnerabilidade (SNBV)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Quando alguém me pergunta com sinceridade \"como você está?\", minha resposta automática é \"está tudo ótimo/sob controle\", mesmo que tudo esteja desmoronando por dentro.",
                          "domain":  "dim1",
                          "domainLabel":  "Supressão de Necessidades e Bloqueio de Vulnerabilidade (SNBV)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Aceitar um favor ou presente significativo me causa ansiedade, pois sinto que fiquei devendo uma dívida moral eterna que não posso controlar.",
                          "domain":  "dim2",
                          "domainLabel":  "Medo de Dependência e Desconfiança da Ajuda Alheia (MDDA)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Acredito profundamente que, se eu depender de outra pessoa para coisas essenciais, ela eventualmente me desapontará, me abandonará ou usará isso contra mim.",
                          "domain":  "dim2",
                          "domainLabel":  "Medo de Dependência e Desconfiança da Ajuda Alheia (MDDA)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Tenho enorme dificuldade em delegar tarefas no trabalho ou em casa, pois acho que ninguém fará com o mesmo cuidado e acabo refazendo tudo sozinho.",
                          "domain":  "dim2",
                          "domainLabel":  "Medo de Dependência e Desconfiança da Ajuda Alheia (MDDA)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "A ideia de precisar financeiramente, clinicamente ou operacionalmente de alguém no futuro me aterroriza mais do que quase qualquer outra coisa.",
                          "domain":  "dim2",
                          "domainLabel":  "Medo de Dependência e Desconfiança da Ajuda Alheia (MDDA)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Diante de um conflito relacional ou rompimento afetivo, meu impulso imediato é buscar explicações lógicas e práticas em vez de me permitir sentir a tristeza.",
                          "domain":  "dim3",
                          "domainLabel":  "Desativação Emocional e Intelectualização do Estresse (DEIE)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Quando alguém começa a demonstrar carinho ou intimidade emocional intensa comigo, sinto uma vontade instintiva de me afastar ou mudar de assunto.",
                          "domain":  "dim3",
                          "domainLabel":  "Desativação Emocional e Intelectualização do Estresse (DEIE)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Tenho facilidade em \"desligar\" o que sinto como quem aperta um interruptor mental, focando 100% no trabalho ou em tarefas utilitárias.",
                          "domain":  "dim3",
                          "domainLabel":  "Desativação Emocional e Intelectualização do Estresse (DEIE)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Costumo considerar demonstrações de carência emocional de outras pessoas como \"drama\", fraqueza ou imaturidade desnecessária.",
                          "domain":  "dim3",
                          "domainLabel":  "Desativação Emocional e Intelectualização do Estresse (DEIE)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Sinto uma exaustão profunda e crônica no corpo, como se estivesse segurando um peso colossal sozinho sem direito a desarmar a guarda.",
                          "domain":  "dim4",
                          "domainLabel":  "Custo Psicofisiológico e Tensão Somática da Solidão (CPTS)",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Apresento tensões físicas persistentes (como mandíbula travada, bruxismo, dores cervicais ou aperto gástrico) que pioram quando estou cercado de demandas.",
                          "domain":  "dim4",
                          "domainLabel":  "Custo Psicofisiológico e Tensão Somática da Solidão (CPTS)",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Mesmo quando estou no meio de muitas pessoas queridas, experimento um sentimento silencioso e desolador de estar fundamentalmente sozinho no mundo.",
                          "domain":  "dim4",
                          "domainLabel":  "Custo Psicofisiológico e Tensão Somática da Solidão (CPTS)",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Meu sono costuma ser leve ou entrecortado, como se parte do meu cérebro precisasse continuar de sentinela para vigiar a própria segurança à noite.",
                          "domain":  "dim4",
                          "domainLabel":  "Custo Psicofisiológico e Tensão Somática da Solidão (CPTS)",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  34,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  51,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  66,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  80,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "ECC_SA",
        "code":  "T-44",
        "shortTitle":  "ECC-SA (Catastrofização Cognitiva...)",
        "fullTitle":  "Escala de Catastrofização Cognitiva e Simulação de Ameaça (ECC-SA / T-44)",
        "cardDescription":  "16 itens (4 dim.). Magnificação da Ameaça e Superestimação de Risco (MASR), Ruminação Antecipatória e Hiperfoco....",
        "category":  "Ansiedade \u0026 Estresse",
        "icon":  "activity",
        "accentColor":  "amber",
        "protocolPrefix":  "DM-EST-",
        "instruction":  "Fundamentação Psicométrica: Este instrumento foi estruturado a partir dos modelos clínicos da Pain Catastrophizing Scale (Sullivan et al., 1995) e da Terapia Cognitiva dos Transtornos de Ansiedade (Beck \u0026 Clark, 2012), adaptado para mapear a tendência do cérebro preditivo de t...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Raramente / Nunca",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Ocasionalmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Moderadamente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Quase Sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Magnificação da Ameaça e Superestimação de Risco (MASR)",
                              "desc":  "Tendência a inflacionar a gravidade e a probabilidade de eventos desfavoráveis antes de averiguar os fatos.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Ruminação Antecipatória e Hiperfoco no Perigo (RAHP)",
                              "desc":  "Incapacidade de interromper pensamentos intrusivos e simulações repetitivas de tragédia futura.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Desamparo Preditivo e Sensação de Incompetência (DPSI)",
                              "desc":  "Crença de que, caso a adversidade ocorra, você não terá recursos psicológicos para suportar o impacto.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Reatividade Somática e Alarme Visceral (RSAV)",
                              "desc":  "Manifestação corporal imediata da amígdala (taquicardia, aperto gástrico, sufocamento) diante da imaginação.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando recebo uma mensagem sucinta de trabalho (como \"precisamos conversar\"), meu cérebro assume imediatamente que serei demitido ou duramente punido.",
                          "domain":  "dim1",
                          "domainLabel":  "Magnificação da Ameaça e Superestimação de Risco (MASR)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Ao notar um sintoma físico incomum (como uma pontada no peito ou dor de cabeça), imagino de pronto um quadro terminal ou irreversível.",
                          "domain":  "dim1",
                          "domainLabel":  "Magnificação da Ameaça e Superestimação de Risco (MASR)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Tenho dificuldade em considerar desfechos intermediários ou neutros: para mim, as situações tendem a ser um sucesso absoluto ou uma ruína completa.",
                          "domain":  "dim1",
                          "domainLabel":  "Magnificação da Ameaça e Superestimação de Risco (MASR)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Se algo dá errado em uma pequena etapa do dia, sinto que tudo o mais entrará em colapso como um efeito dominó inevitável.",
                          "domain":  "dim1",
                          "domainLabel":  "Magnificação da Ameaça e Superestimação de Risco (MASR)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Fico repassando mentalmente o pior cenário possível dezenas de vezes antes de reuniões, viagens ou conversas delicadas.",
                          "domain":  "dim2",
                          "domainLabel":  "Ruminação Antecipatória e Hiperfoco no Perigo (RAHP)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Mesmo quando recebo dados estatísticos ou garantias lógicas de que o risco é mínimo, minha mente insiste: \"mas e se desta vez acontecer?\".",
                          "domain":  "dim2",
                          "domainLabel":  "Ruminação Antecipatória e Hiperfoco no Perigo (RAHP)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Perco o sono à noite imaginando desgraças futuras com meus familiares, finanças ou saúde.",
                          "domain":  "dim2",
                          "domainLabel":  "Ruminação Antecipatória e Hiperfoco no Perigo (RAHP)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Sinto que, se eu relaxar e parar de prever o pior, serei pego desprevenido e o desastre inevitavelmente acontecerá.",
                          "domain":  "dim2",
                          "domainLabel":  "Ruminação Antecipatória e Hiperfoco no Perigo (RAHP)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Acredito profundamente que, se eu enfrentar uma decepção grave ou rejeição, minha vida perderá o sentido e eu não aguentarei.",
                          "domain":  "dim3",
                          "domainLabel":  "Desamparo Preditivo e Sensação de Incompetência (DPSI)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Em vez de pensar em soluções práticas diante de uma crise, sinto uma paralisia imediata e sensação de impotência total.",
                          "domain":  "dim3",
                          "domainLabel":  "Desamparo Preditivo e Sensação de Incompetência (DPSI)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Subestimo sistematicamente minha capacidade de superação, esquecendo adversidades graves que já venci no passado.",
                          "domain":  "dim3",
                          "domainLabel":  "Desamparo Preditivo e Sensação de Incompetência (DPSI)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Dependo da aprovação e tranquilização contínua de outras pessoas para não afundar no desespero diante de dúvidas.",
                          "domain":  "dim3",
                          "domainLabel":  "Desamparo Preditivo e Sensação de Incompetência (DPSI)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Meu coração dispara e sinto um aperto no estômago apenas ao pensar em um problema que talvez aconteça semanas à frente.",
                          "domain":  "dim4",
                          "domainLabel":  "Reatividade Somática e Alarme Visceral (RSAV)",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Sinto tensão constante nos ombros, mandíbula travada ou dores musculares que aumentam quando fico prevendo crises.",
                          "domain":  "dim4",
                          "domainLabel":  "Reatividade Somática e Alarme Visceral (RSAV)",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Diante de incertezas, percebo episódios de respiração curta, mãos geladas ou sudorese fria repentina.",
                          "domain":  "dim4",
                          "domainLabel":  "Reatividade Somática e Alarme Visceral (RSAV)",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Fico tão fisicamente esgotado por sustos imaginados que termino o dia com a sensação de ter corrido uma maratona.",
                          "domain":  "dim4",
                          "domainLabel":  "Reatividade Somática e Alarme Visceral (RSAV)",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  34,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  51,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  66,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  80,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EFE_CE",
        "code":  "T-43",
        "shortTitle":  "EFE-CE (Fadiga Empática e Contágio...)",
        "fullTitle":  "Escala de Fadiga Empática e Contágio Emocional (EFE-CE / T-43)",
        "cardDescription":  "16 itens (4 dim.). Contágio Afetivo \u0026 Dor Vicária (CADV), Esgotamento Relacional \u0026 Sobrecarga Alostática (ERSA)....",
        "category":  "Cognição \u0026 Funções Executivas",
        "icon":  "cpu",
        "accentColor":  "indigo",
        "protocolPrefix":  "DM-COG-",
        "instruction":  "Apresentação Clínica do Instrumento: A Escala EFE-CE (T-43) foi desenvolvida para mapear o impacto do estresse vicário no sistema nervoso de profissionais de cuidado, terapeutas, líderes e indivíduos hiper-empáticos. Fundamentada nas investigações de neuroimagem de Tania Singe...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Raramente / Nunca",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Ocasionalmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Moderadamente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Quase Sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Contágio Afetivo \u0026 Dor Vicária (CADV)",
                              "desc":  "Tendência involuntária a absorver o sofrimento alheio como dor visceral e tensão corporal própria.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Esgotamento Relacional \u0026 Sobrecarga Alostática (ERSA)",
                              "desc":  "Depleção bioenergética, cansaço físico residual e sensação de dreno após exercer suporte emocional.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Entorpecimento Emocional Defensivo \u0026 Despersonalização (EEDD)",
                              "desc":  "Hipoativação protetora, perda de empatia espontânea e tendência ao cinismo defensivo diante da dor alheia.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Falha na Preservação de Limites \u0026 Compaixão Proativa (FPLC)",
                              "desc":  "Dificuldade em ancorar o Self, dizer não a sobrecargas alheias e converter a dor em ação lúcida sem autoflagelo.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando vejo alguém que estimo sofrendo ou chorando, sinto um aperto físico no peito ou estômago, como se o problema estivesse acontecendo diretamente comigo.",
                          "domain":  "dim1",
                          "domainLabel":  "Contágio Afetivo \u0026 Dor Vicária (CADV)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Fico revivendo mentalmente os relatos difíceis ou os problemas que ouvi de outras pessoas horas ou dias após a conversa ter acabado.",
                          "domain":  "dim1",
                          "domainLabel":  "Contágio Afetivo \u0026 Dor Vicária (CADV)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Tenho dificuldade em diferenciar onde termina a minha angústia e onde começa o sofrimento da pessoa com quem convivo ou atendo.",
                          "domain":  "dim1",
                          "domainLabel":  "Contágio Afetivo \u0026 Dor Vicária (CADV)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Notícias pesadas, tragédias coletivas ou histórias de violência afetam meu humor e minha disposição física por períodos prolongados.",
                          "domain":  "dim1",
                          "domainLabel":  "Contágio Afetivo \u0026 Dor Vicária (CADV)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Ao final do dia, sinto que minha energia vital foi completamente drenada pelas demandas emocionais de outras pessoas.",
                          "domain":  "dim2",
                          "domainLabel":  "Esgotamento Relacional \u0026 Sobrecarga Alostática (ERSA)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Mesmo após uma noite de sono, acordo sentindo um peso muscular ou esgotamento quando sei que terei que lidar com crises alheias.",
                          "domain":  "dim2",
                          "domainLabel":  "Esgotamento Relacional \u0026 Sobrecarga Alostática (ERSA)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Sinto uma vontade compulsiva de me isolar em um quarto escuro e em silêncio absoluto para evitar qualquer contato interpessoal.",
                          "domain":  "dim2",
                          "domainLabel":  "Esgotamento Relacional \u0026 Sobrecarga Alostática (ERSA)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Percebo sintomas físicos de estresse (tensão cervical, dor de cabeça, palpitações) diretamente associados ao papel de cuidador ou ouvinte.",
                          "domain":  "dim2",
                          "domainLabel":  "Esgotamento Relacional \u0026 Sobrecarga Alostática (ERSA)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Percebo que me tornei mais \"anestesiado\" ou frio diante de pessoas desabafando comigo, como se eu não conseguisse mais me importar.",
                          "domain":  "dim3",
                          "domainLabel":  "Entorpecimento Emocional Defensivo \u0026 Despersonalização (EEDD)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Sinto uma irritação ou impaciência interna involuntária quando alguém começa a relatar um drama pessoal ou uma dificuldade.",
                          "domain":  "dim3",
                          "domainLabel":  "Entorpecimento Emocional Defensivo \u0026 Despersonalização (EEDD)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Flagro-me agindo de maneira mecânica e burocrática ao oferecer suporte, sem presença emocional genuína.",
                          "domain":  "dim3",
                          "domainLabel":  "Entorpecimento Emocional Defensivo \u0026 Despersonalização (EEDD)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Sinto culpa retrospectiva ao perceber que perdi a capacidade de me comover como me comovia antes.",
                          "domain":  "dim3",
                          "domainLabel":  "Entorpecimento Emocional Defensivo \u0026 Despersonalização (EEDD)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Sinto remorso ou ansiedade extrema quando recuso pedidos de ajuda, mesmo quando meu corpo está no limite da exaustão.",
                          "domain":  "dim4",
                          "domainLabel":  "Falha na Preservação de Limites \u0026 Compaixão Proativa (FPLC)",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Costumo colocar as urgências e crises emocionais de outras pessoas sistematicamente à frente do meu próprio sono, alimentação ou descanso.",
                          "domain":  "dim4",
                          "domainLabel":  "Falha na Preservação de Limites \u0026 Compaixão Proativa (FPLC)",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Em vez de pensar em formas objetivas de amparo, fico paralisado pelo sofrimento alheio, sentindo-me impotente e desamparado.",
                          "domain":  "dim4",
                          "domainLabel":  "Falha na Preservação de Limites \u0026 Compaixão Proativa (FPLC)",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Tenho grande dificuldade em praticar rituais de descompressão ou relaxar sem a sensação de estar abandonando quem precisa de mim.",
                          "domain":  "dim4",
                          "domainLabel":  "Falha na Preservação de Limites \u0026 Compaixão Proativa (FPLC)",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  34,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  51,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  66,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  80,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EFICA",
        "code":  "T-42",
        "shortTitle":  "EFICA (Fenômeno do Impostor e Cal...)",
        "fullTitle":  "Escala de Fenômeno do Impostor e Calibração Atribucional (EFICA / T-42)",
        "cardDescription":  "20 itens (4 dim.). Desconto do Mérito \u0026 Atribuição Externa (DMAE), Pavor de Exposição \u0026 Medo da Fraude (PEMF),....",
        "category":  "Metacognição \u0026 Lógica",
        "icon":  "brain",
        "accentColor":  "blue",
        "protocolPrefix":  "DM-MET-",
        "instruction":  "Apresentação Clínica do Instrumento: A Escala EFICA (T-42) foi desenvolvida para mapear a discrepância entre conquistas objetivas e o sentimento subjetivo de fraude intelectual. Fundamentada nos modelos pioneiros de Pauline Clance (CIPS), na Teoria da Atribuição Causal de Bern...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo em Parte",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo em Parte",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Desconto do Mérito \u0026 Atribuição Externa (DMAE)",
                              "desc":  "Tendência a atribuir vitórias à sorte, facilidade da tarefa ou bondade de terceiros, subtraindo a competência própria.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Pavor de Exposição \u0026 Medo da Fraude (PEMF)",
                              "desc":  "Hipervigilância ao erro e ansiedade constante de que colegas e superiores descubram uma suposta incompetência.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Ciclo Impostor: Hiperpreparação \u0026 Procrastinação (CIHP)",
                              "desc":  "Oscilação entre trabalho extenuante (overworking) para compensar a insegurança e adiamento de tarefas por medo de falhar.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Incapacidade de Internalização Dopaminérgica (IID)",
                              "desc":  "Dificuldade neuroafetiva em vivenciar satisfação duradoura pós-sucesso, transformando conquistas em ansiedade pelo próximo teste.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando recebo um elogio por um bom trabalho, costumo achar que a pessoa está apenas sendo gentil ou que tem baixos padrões de exigência.",
                          "domain":  "dim1",
                          "domainLabel":  "Desconto do Mérito \u0026 Atribuição Externa (DMAE)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Ao ser aprovado em um processo seletivo ou promoção, sinto que tive sorte ou que os outros candidatos não eram qualificados o bastante.",
                          "domain":  "dim1",
                          "domainLabel":  "Desconto do Mérito \u0026 Atribuição Externa (DMAE)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Tenho grande dificuldade em reconhecer que minhas habilidades técnicas ou inteligência foram determinantes para o sucesso que alcancei.",
                          "domain":  "dim1",
                          "domainLabel":  "Desconto do Mérito \u0026 Atribuição Externa (DMAE)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Quando realizo algo com facilidade, concluo que aquilo não tem valor real e que qualquer pessoa faria o mesmo.",
                          "domain":  "dim1",
                          "domainLabel":  "Desconto do Mérito \u0026 Atribuição Externa (DMAE)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Costumo pensar: \"eu apenas estava no lugar certo na hora certa\", recusando a ideia de que me preparei deliberadamente para a oportunidade.",
                          "domain":  "dim1",
                          "domainLabel":  "Desconto do Mérito \u0026 Atribuição Externa (DMAE)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Vivo com o medo íntimo de que, em algum momento, as pessoas descubram o quão pouco eu realmente sei.",
                          "domain":  "dim2",
                          "domainLabel":  "Pavor de Exposição \u0026 Medo da Fraude (PEMF)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Evito aceitar novos desafios ou promoções por receio de não conseguir sustentar a expectativa alheia e ser desmascarado.",
                          "domain":  "dim2",
                          "domainLabel":  "Pavor de Exposição \u0026 Medo da Fraude (PEMF)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Quando alguém pede minha opinião técnica, sinto uma pontada de ansiedade, temendo dizer uma bobagem evidente.",
                          "domain":  "dim2",
                          "domainLabel":  "Pavor de Exposição \u0026 Medo da Fraude (PEMF)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Acredito que as pessoas ao meu redor têm uma imagem exageradamente positiva da minha inteligência e capacidade.",
                          "domain":  "dim2",
                          "domainLabel":  "Pavor de Exposição \u0026 Medo da Fraude (PEMF)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Um erro pequeno em uma entrega profissional me faz sentir humilhado e convicto de que minha fraude foi comprovada.",
                          "domain":  "dim2",
                          "domainLabel":  "Pavor de Exposição \u0026 Medo da Fraude (PEMF)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Trabalho muito mais horas do que meus colegas em tarefas equivalentes apenas para ter certeza absoluta de que não cometi falhas.",
                          "domain":  "dim3",
                          "domainLabel":  "Ciclo Impostor: Hiperpreparação \u0026 Procrastinação (CIHP)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Costumo procrastinar o início de projetos importantes por sentir que não saberei por onde começar e que meu trabalho será medíocre.",
                          "domain":  "dim3",
                          "domainLabel":  "Ciclo Impostor: Hiperpreparação \u0026 Procrastinação (CIHP)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Reviso documentos, e-mails ou relatórios dezenas de vezes antes de enviar, gastando tempo desproporcional com detalhes secundários.",
                          "domain":  "dim3",
                          "domainLabel":  "Ciclo Impostor: Hiperpreparação \u0026 Procrastinação (CIHP)",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Quando um projeto dá certo após noites em claro, penso: \"só deu certo porque me matei de trabalhar; meu talento por si só não bastaria\".",
                          "domain":  "dim3",
                          "domainLabel":  "Ciclo Impostor: Hiperpreparação \u0026 Procrastinação (CIHP)",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Se concluo uma tarefa no prazo sem sofrimento extenuante, sinto uma culpa incômoda de que ela não ficou boa o suficiente.",
                          "domain":  "dim3",
                          "domainLabel":  "Ciclo Impostor: Hiperpreparação \u0026 Procrastinação (CIHP)",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Quando atinjo uma meta relevante, sinto apenas um alívio fugaz de não ter fracassado, e não uma sensação sólida de orgulho.",
                          "domain":  "dim4",
                          "domainLabel":  "Incapacidade de Internalização Dopaminérgica (IID)",
                          "reverse":  false
                      },
                      {
                          "id":  17,
                          "text":  "Minutos após concluir uma conquista notável, minha mente já é invadida pela preocupação angustiante com o próximo obstáculo.",
                          "domain":  "dim4",
                          "domainLabel":  "Incapacidade de Internalização Dopaminérgica (IID)",
                          "reverse":  false
                      },
                      {
                          "id":  18,
                          "text":  "Raramente comemoro ou desfruto de minhas vitórias; sinto que comemorar é presunçoso ou atrai azar.",
                          "domain":  "dim4",
                          "domainLabel":  "Incapacidade de Internalização Dopaminérgica (IID)",
                          "reverse":  false
                      },
                      {
                          "id":  19,
                          "text":  "Mesmo tendo um histórico cumulativo de sucessos passados, começo cada novo projeto com a mesma sensação de que serei exposto.",
                          "domain":  "dim4",
                          "domainLabel":  "Incapacidade de Internalização Dopaminérgica (IID)",
                          "reverse":  false
                      },
                      {
                          "id":  20,
                          "text":  "Acho difícil incorporar meus diplomas, certificados e prêmios como partes genuínas do meu valor intrínseco.",
                          "domain":  "dim4",
                          "domainLabel":  "Incapacidade de Internalização Dopaminérgica (IID)",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  42,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  64,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  82,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  100,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "ECSCM",
        "code":  "T-41",
        "shortTitle":  "ECSCM (Camuflagem Social e Custo...)",
        "fullTitle":  "Escala de Camuflagem Social e Custo por Masking (ECSCM / T-41)",
        "cardDescription":  "18 itens (3 dim.). Compensação Ativa \u0026 Roteirização Social (dlPFC), Mascaramento e Supressão Comportamental (Co....",
        "category":  "Cognição \u0026 Funções Executivas",
        "icon":  "cpu",
        "accentColor":  "indigo",
        "protocolPrefix":  "DM-COG-",
        "instruction":  "Objetivo Psicoeducativo e Clínico: A Escala ECSCM foi desenvolvida com base nos instrumentos internacionais de referência para neurodivergência e cognição social — em especial o CAT-Q (Camouflaging Autistic Traits Questionnaire) de Laura Hull et al. (2020) e os estudos de Burn...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "1 Discordo Fortemente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "2 Discordo",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "3 Neutro / Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "4 Concordo",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "5 Concordo Fortemente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Compensação Ativa \u0026 Roteirização Social (dlPFC)",
                              "desc":  "Avalia o esforço voluntário de calcular regras de interação, memorizar roteiros e monitorar o contato visual.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Mascaramento e Supressão Comportamental (Controle Sensório-Motor)",
                              "desc":  "Mede a inibição forçada de movimentos regulatórios (stimming) e o silenciamento de sobrecargas sensoriais.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Assimilação \u0026 Custo Alostático de Burnout",
                              "desc":  "Avalia a fragmentação da identidade própria, o esgotamento físico extremo e a perda temporária de habilidades.",
                              "color":  "bg-amber-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Em conversas cotidianas, preciso pensar conscientemente sobre o contato visual (ex.: calcular quantos segundos olhar e quando desviar o olhar para não parecer invasivo(a)).",
                          "domain":  "dim1",
                          "domainLabel":  "Compensação Ativa \u0026 Roteirização Social (dlPFC)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Costumo ensaiar mentalmente falas, anedotas, perguntas ou respostas antes de entrar em situações sociais, reuniões ou telefonemas.",
                          "domain":  "dim1",
                          "domainLabel":  "Compensação Ativa \u0026 Roteirização Social (dlPFC)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Monitoro deliberadamente minha postura física e expressões faciais enquanto falo para garantir que pareço receptivo(a) e engajado(a).",
                          "domain":  "dim1",
                          "domainLabel":  "Compensação Ativa \u0026 Roteirização Social (dlPFC)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Aprendi a imitar a entonação, gestos, piadas ou o estilo de comunicação de pessoas populares ou carismáticas para me integrar melhor aos grupos.",
                          "domain":  "dim1",
                          "domainLabel":  "Compensação Ativa \u0026 Roteirização Social (dlPFC)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Preciso fazer um esforço analítico para não monopolizar a conversa com meus hiperfocos e para fazer perguntas sobre o outro, mesmo achando os tópicos triviais entediantes.",
                          "domain":  "dim1",
                          "domainLabel":  "Compensação Ativa \u0026 Roteirização Social (dlPFC)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Possuo um repertório pré-fabricado de frases-feitas e comentários genéricos sobre o clima ou o trânsito apenas para evitar o desconforto de silêncios sociais.",
                          "domain":  "dim1",
                          "domainLabel":  "Compensação Ativa \u0026 Roteirização Social (dlPFC)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Reprimo deliberadamente a vontade de balançar o corpo, mexer as mãos, estalar dedos ou tocar objetos calmantes quando estou em público.",
                          "domain":  "dim2",
                          "domainLabel":  "Mascaramento e Supressão Comportamental (Controle Sensório-Motor)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Suporto em silêncio luzes fluorescentes incômodas, zumbidos elétricos ou ruídos altos sem pedir para ajustá-los, para não parecer chato(a) ou exigente.",
                          "domain":  "dim2",
                          "domainLabel":  "Mascaramento e Supressão Comportamental (Controle Sensório-Motor)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Quando começo a sentir sobrecarga sensorial ou irritabilidade, finjo calma e normalidade até encontrar uma desculpa para ir ao banheiro me isolar.",
                          "domain":  "dim2",
                          "domainLabel":  "Mascaramento e Supressão Comportamental (Controle Sensório-Motor)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Forço sorrisos ou risadas automáticas quando outras pessoas riem de uma história, mesmo que eu não tenha compreendido o sentido ou a graça.",
                          "domain":  "dim2",
                          "domainLabel":  "Mascaramento e Supressão Comportamental (Controle Sensório-Motor)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Evito expressar minhas paixões e interesses com espontaneidade pelo receio de que as pessoas me achem infantil, obsessivo(a) ou estranho(a).",
                          "domain":  "dim2",
                          "domainLabel":  "Mascaramento e Supressão Comportamental (Controle Sensório-Motor)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Fico fisicamente tenso(a) e com a musculatura contraída para garantir que meu corpo pareça o mais imóvel e \"comportado\" possível.",
                          "domain":  "dim2",
                          "domainLabel":  "Mascaramento e Supressão Comportamental (Controle Sensório-Motor)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Após um dia de trabalho presencial ou um evento social, chego em casa com uma exaustão tão profunda que não consigo falar ou levantar do sofá por horas.",
                          "domain":  "dim3",
                          "domainLabel":  "Assimilação \u0026 Custo Alostático de Burnout",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Sinto com frequência que criei um \"personagem\" tão adaptado para ser aceito(a) que já não tenho clareza de quem sou quando estou totalmente sozinho(a).",
                          "domain":  "dim3",
                          "domainLabel":  "Assimilação \u0026 Custo Alostático de Burnout",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Em períodos de estresse cumulativo, percebo que perco habilidades que antes executava bem (dificuldade súbita para falar, cozinhar, organizar documentos ou cuidar de mim).",
                          "domain":  "dim3",
                          "domainLabel":  "Assimilação \u0026 Custo Alostático de Burnout",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Tenho a sensação de que as pessoas ao redor admiram apenas a minha máscara e que, se vissem minhas reais dificuldades, me abandonariam ou desprezariam.",
                          "domain":  "dim3",
                          "domainLabel":  "Assimilação \u0026 Custo Alostático de Burnout",
                          "reverse":  false
                      },
                      {
                          "id":  17,
                          "text":  "Apresento sintomas físicos frequentes (enxaquecas, dores crônicas, crises gástricas ou tensão cervical) após semanas de intensa convivência forçada.",
                          "domain":  "dim3",
                          "domainLabel":  "Assimilação \u0026 Custo Alostático de Burnout",
                          "reverse":  false
                      },
                      {
                          "id":  18,
                          "text":  "Sinto que estou constantemente à beira de um esgotamento total, no limite máximo de suportar a exigência de agir como uma pessoa neurotípica.",
                          "domain":  "dim3",
                          "domainLabel":  "Assimilação \u0026 Custo Alostático de Burnout",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  38,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  58,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  74,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  90,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EFASA",
        "code":  "T-40",
        "shortTitle":  "EFASA (Fawning, Apaziguamento Soc...)",
        "fullTitle":  "Escala de Fawning, Apaziguamento Social e Supressão da Autenticidade (EFASA / T-40)",
        "cardDescription":  "15 itens (3 dim.). Subjugação e Terror de Desaprovação, Hipervigilância Relacional e Leitura de Ameaça, Supress....",
        "category":  "Relacionamentos \u0026 Apego",
        "icon":  "users",
        "accentColor":  "rose",
        "protocolPrefix":  "DM-REL-",
        "instruction":  "Fundamentação Científica: A resposta de fawning (Pete Walker) é o quarto mecanismo primário de defesa do sistema nervoso mamífero, caracterizado pela submissão preventiva e pela anulação dos próprios limites para desarmar conflitos ou evitar rejeição social. Estudos de neuroim...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "1 Nunca",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "2 Raramente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "3 Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "4 Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "5 Sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Subjugação e Terror de Desaprovação",
                              "desc":  "Mapeia a incapacidade de dizer \"não\", a anulação da própria voz e o medo visceral de desagradar.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Hipervigilância Relacional e Leitura de Ameaça",
                              "desc":  "Mapeia o estado de sentinela pré-frontal, a leitura obsessiva de pistas sociais e a responsabilidade excessiva.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Supressão Somática e Auto-Sacrifício Compulsivo",
                              "desc":  "Mapeia a desconexão da própria vontade, a repressão da raiva adaptativa e o custo fisiológico crônico.",
                              "color":  "bg-amber-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Sinto uma ansiedade intensa ou aperto no peito diante da possibilidade de que alguém fique chateado, decepcionado ou irritado comigo.",
                          "domain":  "dim1",
                          "domainLabel":  "Subjugação e Terror de Desaprovação",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Digo \"sim\" para favores, convites ou demandas adicionais mesmo quando já estou física ou emocionalmente esgotado(a).",
                          "domain":  "dim1",
                          "domainLabel":  "Subjugação e Terror de Desaprovação",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Concordo verbalmente com opiniões ou decisões de terceiros com as quais discordo internamente, apenas para evitar qualquer atrito no ambiente.",
                          "domain":  "dim1",
                          "domainLabel":  "Subjugação e Terror de Desaprovação",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Peço desculpas compulsivamente por tudo, inclusive quando não tive qualquer responsabilidade sobre o problema ocorrido.",
                          "domain":  "dim1",
                          "domainLabel":  "Subjugação e Terror de Desaprovação",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Sinto que expressar uma recusa ou um limite pessoal pode levar à perda definitiva do afeto, abandono ou agressão de quem amo.",
                          "domain":  "dim1",
                          "domainLabel":  "Subjugação e Terror de Desaprovação",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Analiso obsessivamente as microexpressões faciais, o tom de voz e o tempo de resposta em mensagens para saber se cometi algum erro.",
                          "domain":  "dim2",
                          "domainLabel":  "Hipervigilância Relacional e Leitura de Ameaça",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Sinto-me hiper-responsável pelo clima emocional do ambiente e pelo bem-estar dos outros, sentindo culpa se alguém parece tenso.",
                          "domain":  "dim2",
                          "domainLabel":  "Hipervigilância Relacional e Leitura de Ameaça",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Tento antecipar as necessidades e vontades dos outros antes que eles peçam, tentando me manter indispensável para ser seguro(a).",
                          "domain":  "dim2",
                          "domainLabel":  "Hipervigilância Relacional e Leitura de Ameaça",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Quando alguém parece distante ou responde de forma monossilábica, entro imediatamente em pânico procurando o que fiz para ofendê-lo.",
                          "domain":  "dim2",
                          "domainLabel":  "Hipervigilância Relacional e Leitura de Ameaça",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Moldo minha postura, minha forma de falar e até minhas opiniões aos gostos da pessoa com quem estou para evitar ser rejeitado(a).",
                          "domain":  "dim2",
                          "domainLabel":  "Hipervigilância Relacional e Leitura de Ameaça",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Tenho imensa dificuldade de saber o que eu realmente quero, prefiro ou sinto quando estou na presença de outras pessoas.",
                          "domain":  "dim3",
                          "domainLabel":  "Supressão Somática e Auto-Sacrifício Compulsivo",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Engulo sentimentos legítimos de raiva ou incômodo por medo de que me rotulem como alguém egoísta, ingrato(a) ou problemático(a).",
                          "domain":  "dim3",
                          "domainLabel":  "Supressão Somática e Auto-Sacrifício Compulsivo",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Experimento queimação gástrica, aperto na garganta ou dores de cabeça tensionais após me forçar a ser complacente em uma situação.",
                          "domain":  "dim3",
                          "domainLabel":  "Supressão Somática e Auto-Sacrifício Compulsivo",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Sinto um ressentimento silencioso e amargo por sentir que sempre dou muito mais do que recebo nas relações, mas não consigo romper o ciclo.",
                          "domain":  "dim3",
                          "domainLabel":  "Supressão Somática e Auto-Sacrifício Compulsivo",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Sinto uma culpa corrosiva quando digo \"não\" ou quando escolho descansar em vez de atender prontamente a pedidos de terceiros.",
                          "domain":  "dim3",
                          "domainLabel":  "Supressão Somática e Auto-Sacrifício Compulsivo",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  32,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  48,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  62,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  75,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EJTRA",
        "code":  "T-39",
        "shortTitle":  "EJTRA (Janela de Tolerância e Reg...)",
        "fullTitle":  "Escala da Janela de Tolerância e Regulação Autonômica (EJTRA / T-39)",
        "cardDescription":  "15 itens (3 dim.). Hiperativação Simpática (Luta / Fuga / Sobrecarga), Hipoativação Vagal Dorsal (Colapso / Con....",
        "category":  "Regulação Emocional",
        "icon":  "compass",
        "accentColor":  "teal",
        "protocolPrefix":  "DM-REG-",
        "instruction":  "Esta escala autoaplicável avalia como o seu Sistema Nervoso Autônomo (SNA) reage diante de estressores cotidianos, mapeando sua Janela de Tolerância com base na Teoria Polivagal de Stephen Porges e nos modelos de regulação afetiva de Daniel Siegel. O teste avalia 3 dimensões f...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "1: Quase nunca",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "2: Raramente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "3: Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "4: Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "5: Quase sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Hiperativação Simpática (Luta / Fuga / Sobrecarga)",
                              "desc":  "Avalia a frequência de taquicardia, irritabilidade reativa, agitação e perda de controle executivo sob pressão.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Hipoativação Vagal Dorsal (Colapso / Congelamento / Dormência)",
                              "desc":  "Avalia a tendência a anestesiar emoções, paralisar iniciativas, dissociar ou sentir um vazio desvitalizado.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Amplitude e Resiliência Ventrovagal (Engajamento Social / Equilíbrio)",
                              "desc":  "Avalia a capacidade de se autorregular, retornar à calma, comunicar-se com autenticidade e manter a lucidez sob pressão.",
                              "color":  "bg-amber-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Diante de imprevistos ou divergências, meu coração dispara e sinto uma vontade incontrolável de reagir agressivamente ou fugir imediatamente da situação.",
                          "domain":  "dim1",
                          "domainLabel":  "Hiperativação Simpática (Luta / Fuga / Sobrecarga)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Sinto uma inquietação motora e tensão muscular contínua (mandíbula travada, ombros rígidos), como se estivesse sempre em alerta contra perigos invisíveis.",
                          "domain":  "dim1",
                          "domainLabel":  "Hiperativação Simpática (Luta / Fuga / Sobrecarga)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Pequenos ruídos, notificações ou demandas banais me causam sobressalto desproporcional e irritação imediata.",
                          "domain":  "dim1",
                          "domainLabel":  "Hiperativação Simpática (Luta / Fuga / Sobrecarga)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Quando fico contrariado ou sob estresse, perco a paciência com facilidade e digo coisas das quais me arrependo logo em seguida.",
                          "domain":  "dim1",
                          "domainLabel":  "Hiperativação Simpática (Luta / Fuga / Sobrecarga)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Minha mente se acelera com pensamentos catastróficos em cascata, tornando extremamente difícil conseguir relaxar ou dormir à noite.",
                          "domain":  "dim1",
                          "domainLabel":  "Hiperativação Simpática (Luta / Fuga / Sobrecarga)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Quando as exigências da vida se acumulam, sinto uma paralisia tão intensa que sou incapaz de começar até mesmo as tarefas mais simples.",
                          "domain":  "dim2",
                          "domainLabel":  "Hipoativação Vagal Dorsal (Colapso / Congelamento / Dormência)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Experiencio momentos em que minhas emoções simplesmente \"desligam\", deixando-me em um estado de dormência afetiva e distanciamento do mundo.",
                          "domain":  "dim2",
                          "domainLabel":  "Hipoativação Vagal Dorsal (Colapso / Congelamento / Dormência)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Sinto um cansaço físico e mental profundo (\"peso nos membros\") que não melhora mesmo após horas de descanso na cama.",
                          "domain":  "dim2",
                          "domainLabel":  "Hipoativação Vagal Dorsal (Colapso / Congelamento / Dormência)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Durante conflitos sérios, sinto como se estivesse observando a situação de fora do meu corpo (névoa mental ou sensação de irrealidade).",
                          "domain":  "dim2",
                          "domainLabel":  "Hipoativação Vagal Dorsal (Colapso / Congelamento / Dormência)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Tenho a sensação frequente de que nada vale a pena e de que não adianta me esforçar, caindo em um silêncio resignado e isolamento.",
                          "domain":  "dim2",
                          "domainLabel":  "Hipoativação Vagal Dorsal (Colapso / Congelamento / Dormência)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Consigo acolher frustrações ou notícias difíceis sem entrar em pânico nem me fechar em um mutismo hostil.",
                          "domain":  "dim3",
                          "domainLabel":  "Amplitude e Resiliência Ventrovagal (Engajamento Social / Equilíbrio)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Quando noto que meu corpo está tenso ou estressado, utilizo técnicas de respiração e ancoragem corporal para reestabelecer a calma.",
                          "domain":  "dim3",
                          "domainLabel":  "Amplitude e Resiliência Ventrovagal (Engajamento Social / Equilíbrio)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Sinto-me genuinamente seguro(a) na presença de pessoas queridas, conseguindo compartilhar vulnerabilidades com abertura e espontaneidade.",
                          "domain":  "dim3",
                          "domainLabel":  "Amplitude e Resiliência Ventrovagal (Engajamento Social / Equilíbrio)",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Após um momento de crise ou discussão tensa, meu corpo recupera o ritmo cardíaco normal e a tranquilidade em um tempo razoável.",
                          "domain":  "dim3",
                          "domainLabel":  "Amplitude e Resiliência Ventrovagal (Engajamento Social / Equilíbrio)",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Consigo manter o foco nas minhas metas e agir de acordo com meus valores fundamentais mesmo sentindo algum desconforto emocional passageiro.",
                          "domain":  "dim3",
                          "domainLabel":  "Amplitude e Resiliência Ventrovagal (Engajamento Social / Equilíbrio)",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  32,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  48,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  62,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  75,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "ECM_DC",
        "code":  "T-38",
        "shortTitle":  "ECM-DC (Consciência Metacognitiva...)",
        "fullTitle":  "Escala de Consciência Metacognitiva e Desfusão Cognitiva (ECM-DC / T-38)",
        "cardDescription":  "16 itens (4 dim.). Fusão Conceitual e Literalidade do Pensamento, Reatividade Emocional e Luta Interna contra P....",
        "category":  "Metacognição \u0026 Lógica",
        "icon":  "brain",
        "accentColor":  "blue",
        "protocolPrefix":  "DM-MET-",
        "instruction":  "Objetivo Psicoeducativo e Clínico: Este instrumento avalia a sua capacidade de se relacionar com a sua própria mente. Ele investiga o grau de Fusão Cognitiva (a tendência a tomar pensamentos negativos e previsões catastróficas como fatos consumados ou ordens irrevogáveis) vers...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Quase nunca",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Raramente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Quase sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Fusão Conceitual e Literalidade do Pensamento",
                              "desc":  "Avalia a tendência a confundir pensamentos com a realidade fática e acreditar piamente na veracidade absoluta das autocríticas.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Reatividade Emocional e Luta Interna contra Pensamentos",
                              "desc":  "Mede o esforço exaustivo para debater, suprimir ou silenciar pensamentos intrusivos e o consequente efeito rebote.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Dificuldade de Descentralização (Déficit de Decentering)",
                              "desc":  "Investiga a dificuldade em manter a perspectiva do observador consciente (Self-como-Contexto) diante de fluxos mentais intrusivos.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Aprisionamento da Ação e Bloqueio Orientado por Valores",
                              "desc":  "Mede a paralisia volitiva e o sacrifício de metas de longo prazo em troca do alívio imediato da esquiva experiencial.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando um pensamento autocrítico surge (ex: \"sou incapaz\" ou \"vou estragar tudo\"), sinto como se ele fosse uma verdade incontestável e não apenas uma hipótese mental.",
                          "domain":  "dim1",
                          "domainLabel":  "Fusão Conceitual e Literalidade do Pensamento",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Tenho dificuldade em separar o que realmente está acontecendo no ambiente externo daquilo que minha mente está prevendo ou imaginando.",
                          "domain":  "dim1",
                          "domainLabel":  "Fusão Conceitual e Literalidade do Pensamento",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "As narrativas que minha mente constrói sobre meus erros passados determinam quase instantaneamente meu humor e a sensação de valor próprio.",
                          "domain":  "dim1",
                          "domainLabel":  "Fusão Conceitual e Literalidade do Pensamento",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Sinto que meus pensamentos têm o poder de me controlar ou me forçar a agir contra a minha vontade para aliviar o desconforto.",
                          "domain":  "dim1",
                          "domainLabel":  "Fusão Conceitual e Literalidade do Pensamento",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Gasto muita energia psíquica tentando debater, refutar ou expulsar pensamentos intrusivos e desconfortáveis.",
                          "domain":  "dim2",
                          "domainLabel":  "Reatividade Emocional e Luta Interna contra Pensamentos",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Fico extremamente angustiado ou culpado simplesmente por ter certos pensamentos considerados \"ruins\", \"fracos\" ou \"inadequados\".",
                          "domain":  "dim2",
                          "domainLabel":  "Reatividade Emocional e Luta Interna contra Pensamentos",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Tento desesperadamente me distrair a qualquer custo para não ter que entrar em contato com os diálogos internos que me incomodam.",
                          "domain":  "dim2",
                          "domainLabel":  "Reatividade Emocional e Luta Interna contra Pensamentos",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Quando tento suprimir voluntariamente um pensamento angustiante, percebo que ele retorna com mais força e intensidade (efeito rebote).",
                          "domain":  "dim2",
                          "domainLabel":  "Reatividade Emocional e Luta Interna contra Pensamentos",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "É difícil para mim dar um passo atrás e apenas observar um pensamento doloroso passar como se fosse uma nuvem no céu.",
                          "domain":  "dim3",
                          "domainLabel":  "Dificuldade de Descentralização (Déficit de Decentering)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Costumo me identificar de tal forma com meus estados emocionais passageiros que me sinto totalmente engolido por eles.",
                          "domain":  "dim3",
                          "domainLabel":  "Dificuldade de Descentralização (Déficit de Decentering)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Quando um pensamento de medo surge, eu me percebo como sendo o próprio medo, esquecendo que sou o ser consciente que o está testemunhando.",
                          "domain":  "dim3",
                          "domainLabel":  "Dificuldade de Descentralização (Déficit de Decentering)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Tenho dificuldade em reconhecer mentalmente frases como \"estou tendo o pensamento de...\" e acabo assumindo que o pensamento sou eu.",
                          "domain":  "dim3",
                          "domainLabel":  "Dificuldade de Descentralização (Déficit de Decentering)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Deixo de realizar atividades importantes para o meu futuro ou para meus relacionamentos se minha mente me alertar de que vou me sentir desconfortável.",
                          "domain":  "dim4",
                          "domainLabel":  "Aprisionamento da Ação e Bloqueio Orientado por Valores",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Minhas decisões diárias são mais pautadas em fugir de pensamentos desagradáveis do que em construir aquilo que realmente tem valor para mim.",
                          "domain":  "dim4",
                          "domainLabel":  "Aprisionamento da Ação e Bloqueio Orientado por Valores",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Fico paralisado diante de decisões necessárias porque me perco ruminando todos os cenários catastróficos que meu cérebro projeta.",
                          "domain":  "dim4",
                          "domainLabel":  "Aprisionamento da Ação e Bloqueio Orientado por Valores",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Mesmo sabendo racionalmente o que preciso fazer, a enxurrada de autocríticas internas costuma sabotar o meu arranque de ação.",
                          "domain":  "dim4",
                          "domainLabel":  "Aprisionamento da Ação e Bloqueio Orientado por Valores",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  34,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  51,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  66,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  80,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EHNSC",
        "code":  "T-37",
        "shortTitle":  "EHNSC (Hipervigilância Neuroafeti...)",
        "fullTitle":  "Escala de Hipervigilância Neuroafetiva e Sensibilização Central (EHNSC / T-37)",
        "cardDescription":  "16 itens (4 dim.). Sobrecarga Sensorial e Falha de Filtragem Talâmica (Sensory Gating), Escaneamento Preditivo....",
        "category":  "Trauma \u0026 Esquemas",
        "icon":  "shield-alert",
        "accentColor":  "purple",
        "protocolPrefix":  "DM-TRM-",
        "instruction":  "A Hipervigilância Crônica é caracterizada pela falha do portão sensorial talâmico (sensory gating) e hiperatividade do eixo Locus Coeruleus-Amígdala, mantendo o organismo em alerta fisiológico permanente mesmo em ambientes seguros. Este instrumento investiga quatro dimensões n...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Sobrecarga Sensorial e Falha de Filtragem Talâmica (Sensory Gating)",
                              "desc":  "Avalia a permeabilidade do Núcleo Reticular Talâmico a estímulos irrelevantes e ruído sensorial ambiente.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Escaneamento Preditivo de Ameaça e Desconfiança Social",
                              "desc":  "Investiga a calibragem de predição de risco da amígdala e a antecipação crônica de perigo relacional.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Tônus Simpático Sustentado e Tensão Somática Crônica",
                              "desc":  "Mapeia a hiper-reatividade adrenérgica corporal e sintomas de sensibilização central espinomedular.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Dificuldade de Desativação Noturna e Bloqueio da Presença",
                              "desc":  "Analisa a incapacidade parassimpática de desativação (freio vagal) e a aversão ao relaxamento.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Sinto-me rapidamente sobrecarregado(a) ou irritado(a) por ruídos do ambiente que a maioria das pessoas parece ignorar com facilidade (conversas paralelas, barulhos contínuos, trânsito).",
                          "domain":  "dim1",
                          "domainLabel":  "Sobrecarga Sensorial e Falha de Filtragem Talâmica (Sensory Gating)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Luzes fortes, locais visualmente poluídos ou multidões provocam em mim um esgotamento mental e físico desproporcional.",
                          "domain":  "dim1",
                          "domainLabel":  "Sobrecarga Sensorial e Falha de Filtragem Talâmica (Sensory Gating)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Tenho um reflexo de sobressalto facilitado: assusto-me com facilidade extrema diante de ruídos repentinos, portas batendo ou pessoas se aproximando sem aviso.",
                          "domain":  "dim1",
                          "domainLabel":  "Sobrecarga Sensorial e Falha de Filtragem Talâmica (Sensory Gating)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Tenho grande dificuldade em manter a atenção focada em uma conversa ou tarefa quando há qualquer movimento ou ruído ao redor.",
                          "domain":  "dim1",
                          "domainLabel":  "Sobrecarga Sensorial e Falha de Filtragem Talâmica (Sensory Gating)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Quando entro em um ambiente novo, escaneio automaticamente as saídas, a disposição das pessoas e a atmosfera em busca de possíveis sinais de desconforto ou perigo.",
                          "domain":  "dim2",
                          "domainLabel":  "Escaneamento Preditivo de Ameaça e Desconfiança Social",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Costumo antecipar que as pessoas estão zangadas comigo ou me julgando negativamente com base em mudanças microscópicas no tom de voz ou expressões faciais.",
                          "domain":  "dim2",
                          "domainLabel":  "Escaneamento Preditivo de Ameaça e Desconfiança Social",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Mesmo em momentos em que tudo está correndo bem na minha vida, sinto uma inquietação interna de que \"algo terrível está prestes a acontecer\".",
                          "domain":  "dim2",
                          "domainLabel":  "Escaneamento Preditivo de Ameaça e Desconfiança Social",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Tenho enorme dificuldade em confiar plenamente em outras pessoas e relaxar a guarda, mantendo sempre uma reserva defensiva.",
                          "domain":  "dim2",
                          "domainLabel":  "Escaneamento Preditivo de Ameaça e Desconfiança Social",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Percebo com frequência que meus ombros, trapézios ou mandíbula estão travados e rígidos, mesmo quando estou supostamente descansando.",
                          "domain":  "dim3",
                          "domainLabel":  "Tônus Simpático Sustentado e Tensão Somática Crônica",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Costumo experimentar aceleração cardíaca, sensação de nó na garganta ou respiração curta e superficial sem uma causa física identificável.",
                          "domain":  "dim3",
                          "domainLabel":  "Tônus Simpático Sustentado e Tensão Somática Crônica",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Sofro de desconfortos físicos frequentes como cefaleias tensionais, bruxismo, queimação estomacal ou dores musculares difusas.",
                          "domain":  "dim3",
                          "domainLabel":  "Tônus Simpático Sustentado e Tensão Somática Crônica",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Minhas mãos ou pés tendem a ficar frios e úmidos durante o dia, refletindo um estado contínuo de ativação simpática vascular.",
                          "domain":  "dim3",
                          "domainLabel":  "Tônus Simpático Sustentado e Tensão Somática Crônica",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Ao me deitar para dormir, sinto que meu corpo permanece \"ligado na tomada\", impedindo que eu relaxe e adormeça com serenidade.",
                          "domain":  "dim4",
                          "domainLabel":  "Dificuldade de Desativação Noturna e Bloqueio da Presença",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Acordo com facilidade ao menor ruído durante a noite e desperto já em estado de prontidão e ansiedade matinal.",
                          "domain":  "dim4",
                          "domainLabel":  "Dificuldade de Desativação Noturna e Bloqueio da Presença",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Sinto uma aflição ou inquietação visceral quando tento fazer pausas ou simplesmente \"não fazer nada\", como se o descanso fosse uma vulnerabilidade perigosa.",
                          "domain":  "dim4",
                          "domainLabel":  "Dificuldade de Desativação Noturna e Bloqueio da Presença",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Sinto que estou sobrevivendo em regime de sentinela perpétua, privando-me de desfrutar a calma, a beleza e a presença real nos momentos cotidianos.",
                          "domain":  "dim4",
                          "domainLabel":  "Dificuldade de Desativação Noturna e Bloqueio da Presença",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  34,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  51,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  66,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  80,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EVT_DRI",
        "code":  "T-36",
        "shortTitle":  "EVT-DRI (Vínculo Traumático e Depen...)",
        "fullTitle":  "Escala de Vínculo Traumático e Dependência de Reforço Intermitente (EVT-DRI / T-36)",
        "cardDescription":  "16 itens (4 dim.). Sensibilidade ao Reforço Intermitente e Fixação por Migalhas (VTA \u0026 Accumbens), Pânico de Ab....",
        "category":  "Relacionamentos \u0026 Apego",
        "icon":  "users",
        "accentColor":  "rose",
        "protocolPrefix":  "DM-REL-",
        "instruction":  "Fundamentação Neuroclínica: O Vínculo Traumático (Trauma Bonding) é uma neuroadaptação paradoxal e profunda observada em relacionamentos disfuncionais caracterizados por desequilíbrio de poder e abuso intermitente (Dutton \u0026 Painter, 1981; Carnes, 1997). Quando o afeto é imprev...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Sensibilidade ao Reforço Intermitente e Fixação por Migalhas (VTA \u0026 Accumbens)",
                              "desc":  "Avalia a resposta dopaminérgica à incerteza afetiva e a dependência de ciclos de imprevisibilidade.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Pânico de Abandono e Resposta Fisiológica de Abstinência (Eixo HPA \u0026 Opioides)",
                              "desc":  "Mapeia sintomas corporais, hiperalerta autonômico e o desespero visceral diante da distância.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Racionalização Defensiva e Autoengano Protetivo (Inibição Pré-Frontal)",
                              "desc":  "Identifica justificativas automáticas, autoimputação de culpa e amnésia seletiva pós-crise.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Hipervigilância Relacional e Supressão de Limites (Apego Desorganizado \u0026 Esquemas)",
                              "desc":  "Avalia o estado de alerta constante, a perda da própria individualidade e a paralisia do término.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando a pessoa passa dias fria ou distante e subitamente me envia uma mensagem carinhosa, sinto uma euforia desproporcional que faz tudo parecer perfeito.",
                          "domain":  "dim1",
                          "domainLabel":  "Sensibilidade ao Reforço Intermitente e Fixação por Migalhas (VTA \u0026 Accumbens)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Percebo que a instabilidade e o receio de perder o afeto me deixam muito mais obcecado(a) do que quando vivo um relacionamento calmo e seguro.",
                          "domain":  "dim1",
                          "domainLabel":  "Sensibilidade ao Reforço Intermitente e Fixação por Migalhas (VTA \u0026 Accumbens)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Fico constantemente esperando pelo retorno daquela pessoa maravilhosa do início da relação ou daqueles momentos de intensa reconciliação.",
                          "domain":  "dim1",
                          "domainLabel":  "Sensibilidade ao Reforço Intermitente e Fixação por Migalhas (VTA \u0026 Accumbens)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Sinto que preciso me desdobrar e me anular continuamente para conseguir arrancar pequenos momentos de carinho, aprovação e atenção.",
                          "domain":  "dim1",
                          "domainLabel":  "Sensibilidade ao Reforço Intermitente e Fixação por Migalhas (VTA \u0026 Accumbens)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Quando nos desentendemos ou nos afastamos, sinto uma dor física no peito, enjoo, tremores ou um vazio angustiante que não consigo conter.",
                          "domain":  "dim2",
                          "domainLabel":  "Pânico de Abandono e Resposta Fisiológica de Abstinência (Eixo HPA \u0026 Opioides)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "A simples perspectiva de que o relacionamento termine definitivamente desperta em mim uma sensação de desamparo e pânico absoluto.",
                          "domain":  "dim2",
                          "domainLabel":  "Pânico de Abandono e Resposta Fisiológica de Abstinência (Eixo HPA \u0026 Opioides)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Quando tento me afastar, a angústia da ausência é tão insuportável que acabo quebrando o afastamento apenas para fazer a dor parar.",
                          "domain":  "dim2",
                          "domainLabel":  "Pânico de Abandono e Resposta Fisiológica de Abstinência (Eixo HPA \u0026 Opioides)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Sinto que não consigo focar no trabalho ou relaxar enquanto não tiver a confirmação explícita de que está tudo em paz entre nós.",
                          "domain":  "dim2",
                          "domainLabel":  "Pânico de Abandono e Resposta Fisiológica de Abstinência (Eixo HPA \u0026 Opioides)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Frequentemente culpo a mim mesmo(a) pela grosseria ou frieza da pessoa, pensando: \"se eu tivesse sido mais paciente, isso não aconteceria\".",
                          "domain":  "dim3",
                          "domainLabel":  "Racionalização Defensiva e Autoengano Protetivo (Inibição Pré-Frontal)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Costumo desculpar atitudes inaceitáveis da pessoa atribuindo-as ao estresse no trabalho, trauma de infância ou fases difíceis.",
                          "domain":  "dim3",
                          "domainLabel":  "Racionalização Defensiva e Autoengano Protetivo (Inibição Pré-Frontal)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Escondo de amigos ou familiares episódios graves de desrespeito ou humilhação vividos na relação por vergonha ou medo do julgamento deles.",
                          "domain":  "dim3",
                          "domainLabel":  "Racionalização Defensiva e Autoengano Protetivo (Inibição Pré-Frontal)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Prefiro me apegar a promessas de mudanças futuras da pessoa do que encarar o padrão real e contínuo de atitudes no presente.",
                          "domain":  "dim3",
                          "domainLabel":  "Racionalização Defensiva e Autoengano Protetivo (Inibição Pré-Frontal)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Vivo em constante estado de alerta (\"pisando em ovos\"), calculando cada palavra ou atitude para não despertar irritação ou rejeição.",
                          "domain":  "dim4",
                          "domainLabel":  "Hipervigilância Relacional e Supressão de Limites (Apego Desorganizado \u0026 Esquemas)",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Já tolerei violações de limites éticos e pessoais que no passado eu jurava que jamais aceitaria de ninguém.",
                          "domain":  "dim4",
                          "domainLabel":  "Hipervigilância Relacional e Supressão de Limites (Apego Desorganizado \u0026 Esquemas)",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Sinto que fui me desfazendo dos meus próprios gostos, objetivos e limites pessoais apenas para acomodar as exigências ou o humor do outro.",
                          "domain":  "dim4",
                          "domainLabel":  "Hipervigilância Relacional e Supressão de Limites (Apego Desorganizado \u0026 Esquemas)",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Mesmo exausto(a), triste e consciente do mal que a dinâmica me faz, sinto uma paralisia e incapacidade de dar um basta definitivo.",
                          "domain":  "dim4",
                          "domainLabel":  "Hipervigilância Relacional e Supressão de Limites (Apego Desorganizado \u0026 Esquemas)",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  34,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  51,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  66,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  80,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EMPC_ME",
        "code":  "T-35",
        "shortTitle":  "EMPC-ME (Perfeccionismo Clínico e M...)",
        "fullTitle":  "Escala Multidimensional de Perfeccionismo Clínico e Monitoramento de Erros (EMPC-ME / T-35)",
        "cardDescription":  "16 itens (4 dim.). Hiper-reatividade ao Erro e Autocrítica (dACC / ERN), Padrões Pessoais Inflexíveis e Tirania....",
        "category":  "Metacognição \u0026 Lógica",
        "icon":  "brain",
        "accentColor":  "blue",
        "protocolPrefix":  "DM-MET-",
        "instruction":  "Fundamentação Científica: Este instrumento integra as dimensões clássicas da Frost Multidimensional Perfectionism Scale (FMPS) e da Hewitt \u0026 Flett MPS com descobertas recentes da neurociência afetiva e eletrofisiologia sobre o Potencial Evocado Relacionado a Erros (ERN / dACC)...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Hiper-reatividade ao Erro e Autocrítica (dACC / ERN)",
                              "desc":  "Mede a intensidade da resposta somática e o alarme biológico diante de pequenas falhas e desvios.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Padrões Pessoais Inflexíveis e Tirania do \"Deveria\" (Horney \u0026 Young)",
                              "desc":  "Avalia a rigidez de cobrança interna, padrões absolutos e a dificuldade de aceitar o descanso.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Perfeccionismo Socialmente Prescrito e Medo da Rejeição (Hewitt \u0026 Flett)",
                              "desc":  "Avalia a percepção de exigência externa, hipervigilância relacional e medo de vergonha.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Dúvida Compulsiva e Procrastinação Paralisante (Frost / dlPFC)",
                              "desc":  "Avalia a checagem repetitiva, resíduo cognitivo e adiamento de tarefas por receio de imperfeição.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando percebo que cometi um pequeno erro em uma tarefa, sinto um aperto imediato no peito, no estômago ou uma intensa queimação interna.",
                          "domain":  "dim1",
                          "domainLabel":  "Hiper-reatividade ao Erro e Autocrítica (dACC / ERN)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Mesmo um deslize mínimo estraga completamente a minha satisfação com um trabalho que, em geral, ficou excelente.",
                          "domain":  "dim1",
                          "domainLabel":  "Hiper-reatividade ao Erro e Autocrítica (dACC / ERN)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Costumo me insultar mentalmente ou ruminar por horas/dias após cometer uma falha corriqueira que quase ninguém notou.",
                          "domain":  "dim1",
                          "domainLabel":  "Hiper-reatividade ao Erro e Autocrítica (dACC / ERN)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Tenho a sensação visceral de que, se eu falhar em algo importante, minha dignidade e meu valor como pessoa são destruídos.",
                          "domain":  "dim1",
                          "domainLabel":  "Hiper-reatividade ao Erro e Autocrítica (dACC / ERN)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Estabeleço metas para mim mesmo que são extremamente altas e quase impossíveis de atingir sem esgotamento.",
                          "domain":  "dim2",
                          "domainLabel":  "Padrões Pessoais Inflexíveis e Tirania do \"Deveria\" (Horney \u0026 Young)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Tenho extrema dificuldade em descansar ou relaxar sem sentir que \u0027deveria\u0027 estar sendo produtivo e útil.",
                          "domain":  "dim2",
                          "domainLabel":  "Padrões Pessoais Inflexíveis e Tirania do \"Deveria\" (Horney \u0026 Young)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Para mim, se algo não for feito da melhor maneira possível, é como se não tivesse nenhum valor (\u0027tudo ou nada\u0027).",
                          "domain":  "dim2",
                          "domainLabel":  "Padrões Pessoais Inflexíveis e Tirania do \"Deveria\" (Horney \u0026 Young)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Raramente comemoro ou sinto orgulho das minhas conquistas; foco imediatamente no que faltou ou poderia ter sido melhor.",
                          "domain":  "dim2",
                          "domainLabel":  "Padrões Pessoais Inflexíveis e Tirania do \"Deveria\" (Horney \u0026 Young)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Sinto que as pessoas importantes da minha vida esperam que eu seja impecável e nunca demonstre fraqueza.",
                          "domain":  "dim3",
                          "domainLabel":  "Perfeccionismo Socialmente Prescrito e Medo da Rejeição (Hewitt \u0026 Flett)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Tenho pavor de parecer incompetente diante dos outros e de perder a admiração ou o respeito de quem convive comigo.",
                          "domain":  "dim3",
                          "domainLabel":  "Perfeccionismo Socialmente Prescrito e Medo da Rejeição (Hewitt \u0026 Flett)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Acredito que, se eu errar em público ou expuser uma falha, as pessoas vão se decepcionar profundamente comigo.",
                          "domain":  "dim3",
                          "domainLabel":  "Perfeccionismo Socialmente Prescrito e Medo da Rejeição (Hewitt \u0026 Flett)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Escondo minhas dúvidas, medos e erros sob uma fachada de controle para evitar ser julgado.",
                          "domain":  "dim3",
                          "domainLabel":  "Perfeccionismo Socialmente Prescrito e Medo da Rejeição (Hewitt \u0026 Flett)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Reviso e checo repetidas vezes mensagens, e-mails ou relatórios antes de enviá-los, temendo que algo tenha saído errado.",
                          "domain":  "dim4",
                          "domainLabel":  "Dúvida Compulsiva e Procrastinação Paralisante (Frost / dlPFC)",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Costumo adiar o início de tarefas importantes porque sei que não terei tempo ou condições de fazê-las com a perfeição que desejo.",
                          "domain":  "dim4",
                          "domainLabel":  "Dúvida Compulsiva e Procrastinação Paralisante (Frost / dlPFC)",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Tenho grande dificuldade para considerar uma tarefa \u0027finalizada\u0027; sempre acho que mais uma revisão seria necessária.",
                          "domain":  "dim4",
                          "domainLabel":  "Dúvida Compulsiva e Procrastinação Paralisante (Frost / dlPFC)",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Fico tão paralisado pelo medo de fazer a escolha errada que acabo adiando decisões simples do cotidiano.",
                          "domain":  "dim4",
                          "domainLabel":  "Dúvida Compulsiva e Procrastinação Paralisante (Frost / dlPFC)",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  34,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  51,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  66,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  80,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EIU_AP",
        "code":  "T-34",
        "shortTitle":  "EIU-AP (Intolerância à Incerteza e...)",
        "fullTitle":  "Escala de Intolerância à Incerteza e Ansiedade Preditiva (EIU-AP / T-34)",
        "cardDescription":  "16 itens (4 dim.). Incerteza Inibitória e Paralisia de Ação, Incerteza Prospectiva e Hiperplanejamento, Aversão....",
        "category":  "Ansiedade \u0026 Estresse",
        "icon":  "activity",
        "accentColor":  "amber",
        "protocolPrefix":  "DM-EST-",
        "instruction":  "Aviso de Rigor e Privacidade Científica: Este instrumento psicoeducativo baseia-se na formulação clínica da Intolerance of Uncertainty Scale (IUS-12, Carleton et al., 2007; Dugas et al., 2004) e nos modelos neurobiológicos de Processamento Preditivo (Friston, Clark). O teste a...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Incerteza Inibitória e Paralisia de Ação",
                              "desc":  "Avalia o bloqueio executivo e a paralisia decisória diante de cenários abertos ou ambíguos.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Incerteza Prospectiva e Hiperplanejamento",
                              "desc":  "Avalia a necessidade compulsiva de prever o futuro, fazer checagens repetitivas e criar planos redundantes.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Aversão Afetiva e Catastrofização da Dúvida",
                              "desc":  "Avalia a tendência da amígdala a decodificar o desconhecido imediatamente como ameaça ou catástrofe.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Reatividade Interoceptiva e Sobrecarga Somática",
                              "desc":  "Avalia a resposta visceral da ínsula anterior (taquicardia, aperto gástrico, tensão muscular) disparada pela ambiguidade.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "A dúvida ou a falta de garantia absoluta me paralisa na hora de tomar decisões simples do dia a dia.",
                          "domain":  "dim1",
                          "domainLabel":  "Incerteza Inibitória e Paralisia de Ação",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Quando não tenho total certeza sobre o resultado de uma tarefa, costumo adiar seu início indefinidamente (procrastinação).",
                          "domain":  "dim1",
                          "domainLabel":  "Incerteza Inibitória e Paralisia de Ação",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "A menor ambiguidade no trabalho ou nos relacionamentos me faz duvidar das minhas capacidades e hesitar em agir.",
                          "domain":  "dim1",
                          "domainLabel":  "Incerteza Inibitória e Paralisia de Ação",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Prefiro perder uma oportunidade boa a correr o risco de enfrentar um desfecho que não consigo antecipar com clareza.",
                          "domain":  "dim1",
                          "domainLabel":  "Incerteza Inibitória e Paralisia de Ação",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Sinto uma necessidade imperiosa de prever com antecedência exata cada passo do que vai acontecer no meu dia.",
                          "domain":  "dim2",
                          "domainLabel":  "Incerteza Prospectiva e Hiperplanejamento",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Gasto tempo excessivo checando informações, mensagens ou avaliações na internet antes de tomar decisões simples.",
                          "domain":  "dim2",
                          "domainLabel":  "Incerteza Prospectiva e Hiperplanejamento",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Costumo criar mentalmente dezenas de cenários de contingência para me prevenir contra qualquer imprevisto.",
                          "domain":  "dim2",
                          "domainLabel":  "Incerteza Prospectiva e Hiperplanejamento",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Busco com frequência a aprovação ou a confirmação de outras pessoas para me certificar de que estou no caminho certo.",
                          "domain":  "dim2",
                          "domainLabel":  "Incerteza Prospectiva e Hiperplanejamento",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Quando não sei o desfecho de algo, minha mente automaticamente presume o pior cenário possível.",
                          "domain":  "dim3",
                          "domainLabel":  "Aversão Afetiva e Catastrofização da Dúvida",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "A frase \u0027precisamos conversar amanhã\u0027 ou a espera por um exame me gera uma angústia psíquica insuportável.",
                          "domain":  "dim3",
                          "domainLabel":  "Aversão Afetiva e Catastrofização da Dúvida",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Acho injusto que a vida seja tão imprevisível; sinto que imprevistos destroem minha paz interior.",
                          "domain":  "dim3",
                          "domainLabel":  "Aversão Afetiva e Catastrofização da Dúvida",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Considero que não ter controle total sobre uma situação equivale a estar em perigo real.",
                          "domain":  "dim3",
                          "domainLabel":  "Aversão Afetiva e Catastrofização da Dúvida",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Sinto sintomas físicos intensos (nó no estômago, taquicardia ou aperto no peito) diante de pendências sem resposta imediata.",
                          "domain":  "dim4",
                          "domainLabel":  "Reatividade Interoceptiva e Sobrecarga Somática",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Perco o sono com facilidade quando há alguma decisão aberta ou questão não resolvida na minha vida.",
                          "domain":  "dim4",
                          "domainLabel":  "Reatividade Interoceptiva e Sobrecarga Somática",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Fico agitado(a) e com tensão muscular contínua no pescoço ou mandíbula quando espero por respostas de outras pessoas.",
                          "domain":  "dim4",
                          "domainLabel":  "Reatividade Interoceptiva e Sobrecarga Somática",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Sinto uma exaustão corporal profunda após períodos em que precisei lidar com imprevistos ou mudanças de planos.",
                          "domain":  "dim4",
                          "domainLabel":  "Reatividade Interoceptiva e Sobrecarga Somática",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  34,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  51,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  66,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  80,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EGEAC",
        "code":  "T-33",
        "shortTitle":  "EGEAC (Granularidade Emocional e...)",
        "fullTitle":  "Escala de Granularidade Emocional e Alexitimia Clínica (EGEAC / T-33)",
        "cardDescription":  "16 itens (4 dim.). Identificação de Sentimentos e Diferenciação Somática (DIF), Dificuldade em Descrever e Nome....",
        "category":  "Regulação Emocional",
        "icon":  "compass",
        "accentColor":  "teal",
        "protocolPrefix":  "DM-REG-",
        "instruction":  "Este instrumento psicométrico avalia o perfil de leitura e diferenciação afetiva interna, a capacidade de identificar e nomear sentimentos (granularidade emocional), o grau de orientação pragmática externa (pensamento operatório) e a propensão à somatização somatossensorial, c...",
        "options":  [
                        {
                            "value":  0,
                            "label":  "Raramente / Discordo",
                            "desc":  ""
                        },
                        {
                            "value":  1,
                            "label":  "Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Quase sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Identificação de Sentimentos e Diferenciação Somática (DIF)",
                              "desc":  "Avalia a capacidade de distinguir sensações corporais fisiológicas de estados afetivos internos.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Dificuldade em Descrever e Nomear Sentimentos (DDF)",
                              "desc":  "Avalia a facilidade de colocar os afetos em palavras e comunicá-los a outras pessoas.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Pensamento Orientado Externamente e Cognição Operatória (POE)",
                              "desc":  "Avalia o foco excessivo no mundo factual e instrumental em detrimento da vida reflexiva interna.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Déficit de Granularidade e Diferenciação Afetiva (DGA)",
                              "desc":  "Avalia a carência de vocabulário e conceitos emocionais ricos para categorizar estados corporais complexos.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "1 Quando sinto desconfortos físicos (como aperto no peito, nó na garganta ou queimação gástrica), fico em dúvida se é uma reação física ou uma emoção.",
                          "domain":  "dim1",
                          "domainLabel":  "Identificação de Sentimentos e Diferenciação Somática (DIF)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "2 Frequentemente percebo agitação ou mal-estar no meu corpo, mas não consigo dizer qual emoção específica estou sentindo.",
                          "domain":  "dim1",
                          "domainLabel":  "Identificação de Sentimentos e Diferenciação Somática (DIF)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "3 Tenho sintomas ou dores físicas que aparecem em momentos de estresse, mas que os exames médicos normais não explicam.",
                          "domain":  "dim1",
                          "domainLabel":  "Identificação de Sentimentos e Diferenciação Somática (DIF)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "4 Quando me sinto angustiado ou incomodado, não sei discernir se é raiva, tristeza, medo ou cansaço: parece um bloco único e indistinto.",
                          "domain":  "dim1",
                          "domainLabel":  "Identificação de Sentimentos e Diferenciação Somática (DIF)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "5 Acho extremamente desafiador encontrar as palavras exatas para descrever o que sinto a um amigo, parceiro(a) ou terapeuta.",
                          "domain":  "dim2",
                          "domainLabel":  "Dificuldade em Descrever e Nomear Sentimentos (DDF)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "6 Pessoas próximas já me cobraram por não expressar verbalmente minhas emoções ou por parecer distante e inacessível.",
                          "domain":  "dim2",
                          "domainLabel":  "Dificuldade em Descrever e Nomear Sentimentos (DDF)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "7 Quando me perguntam \u0027Como você está?\u0027, prefiro resumir dizendo \u0027bem\u0027 ou \u0027normal\u0027, porque detalhar o que sinto soa artificial ou confuso.",
                          "domain":  "dim2",
                          "domainLabel":  "Dificuldade em Descrever e Nomear Sentimentos (DDF)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "8 Sinto que existe um muro invisível separando o que acontece dentro do meu organismo das palavras que saem pela minha voz.",
                          "domain":  "dim2",
                          "domainLabel":  "Dificuldade em Descrever e Nomear Sentimentos (DDF)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "9 Prefiro me concentrar em resolver problemas práticos e executar tarefas do que gastar tempo analisando meus sentimentos.",
                          "domain":  "dim3",
                          "domainLabel":  "Pensamento Orientado Externamente e Cognição Operatória (POE)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Tenho pouca paciência para filmes, livros ou conversas que giram em torno de dramas psicológicos ou dilemas sentimentais subjetivos.",
                          "domain":  "dim3",
                          "domainLabel":  "Pensamento Orientado Externamente e Cognição Operatória (POE)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Raramente me pego devaneando, fantasiando ou imaginando cenários hipotéticos; meu pensamento costuma ser estritamente funcional e objetivo.",
                          "domain":  "dim3",
                          "domainLabel":  "Pensamento Orientado Externamente e Cognição Operatória (POE)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Em situações de atrito relacional, busco focar nos fatos lógicos concretos e costumo achar que a reação emocional dos outros é exagerada ou irracional.",
                          "domain":  "dim3",
                          "domainLabel":  "Pensamento Orientado Externamente e Cognição Operatória (POE)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Para mim, palavras como \u0027mágoa\u0027, \u0027ressentimento\u0027, \u0027desencanto\u0027 e \u0027frustração\u0027 parecem significar basicamente a mesma coisa sem grande diferença prática.",
                          "domain":  "dim4",
                          "domainLabel":  "Déficit de Granularidade e Diferenciação Afetiva (DGA)",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Acho difícil saber exatamente o que causou meu mal-estar; só percebo que meu corpo \u0027travou\u0027 ou começou a doer horas depois do acontecimento.",
                          "domain":  "dim4",
                          "domainLabel":  "Déficit de Granularidade e Diferenciação Afetiva (DGA)",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Sinto que meu repertório de emoções diárias é restrito a poucos estados básicos: cansado, estressado, calmo ou irritado.",
                          "domain":  "dim4",
                          "domainLabel":  "Déficit de Granularidade e Diferenciação Afetiva (DGA)",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Quando algo dá errado, demoro para identificar se estou triste ou magoado, percebendo a reação quase exclusivamente como tensão física nos ombros ou cabeça.",
                          "domain":  "dim4",
                          "domainLabel":  "Déficit de Granularidade e Diferenciação Afetiva (DGA)",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  13,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  26,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  37,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  48,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "ISMRA",
        "code":  "T-32",
        "shortTitle":  "ISMRA (Sobrecarga Mental e Resídu...)",
        "fullTitle":  "Inventário de Sobrecarga Mental e Resíduo Atencional (ISMRA / T-32)",
        "cardDescription":  "16 itens (4 dim.). Resíduo Atencional e Fragmentação de Foco, Tensão de Zeigarnik e Intrusão de Pendências, Esg....",
        "category":  "Cognição \u0026 Funções Executivas",
        "icon":  "cpu",
        "accentColor":  "indigo",
        "protocolPrefix":  "DM-COG-",
        "instruction":  "Fundamentação Neuropsicológica: Este instrumento avalia o grau de esgotamento da memória de trabalho decorrente de tarefas não finalizadas (o clássico Efeito Zeigarnik ) e o Resíduo de Atenção (Sophie Leroy, 2009) provocado pela troca frequente de tarefas no córtex pré-frontal...",
        "options":  [
                        {
                            "value":  0,
                            "label":  "Quase nunca",
                            "desc":  ""
                        },
                        {
                            "value":  1,
                            "label":  "Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Quase sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Resíduo Atencional e Fragmentação de Foco",
                              "desc":  "Mede o grau em que tarefas anteriores continuam consumindo recursos atencionais na atividade presente.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Tensão de Zeigarnik e Intrusão de Pendências",
                              "desc":  "Avalia a frequência com que metas não finalizadas invadem a consciência em momentos inadequados.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Esgotamento da Memória de Trabalho e Sobrecarga Cognitiva",
                              "desc":  "Mensura a saturação da capacidade de processamento mental de curto prazo e a fadiga pré-frontal.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Dificuldade de Desconexão e Fechamento Psíquico",
                              "desc":  "Avalia a capacidade de desengajar os circuitos executivos após o expediente e permitir a recuperação neural.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Ao alternar entre duas atividades de trabalho, sinto que minha mente permanece presa nos detalhes da tarefa anterior.",
                          "domain":  "dim1",
                          "domainLabel":  "Resíduo Atencional e Fragmentação de Foco",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Tenho dificuldade para me aprofundar em um texto ou projeto porque pequenos lembretes de outras obrigações interrompem minha concentração.",
                          "domain":  "dim1",
                          "domainLabel":  "Resíduo Atencional e Fragmentação de Foco",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Sinto que passo o dia respondendo a notificações ou mensagens avulsas sem conseguir concluir um bloco ininterrupto de foco.",
                          "domain":  "dim1",
                          "domainLabel":  "Resíduo Atencional e Fragmentação de Foco",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "No final de uma jornada de trabalho, sinto um cansaço mental extremo mesmo sem ter realizado grandes esforços físicos.",
                          "domain":  "dim1",
                          "domainLabel":  "Resíduo Atencional e Fragmentação de Foco",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Tarefas que deixei inacabadas voltam repetidamente à minha mente de forma involuntária durante momentos de repouso ou lazer.",
                          "domain":  "dim2",
                          "domainLabel":  "Tensão de Zeigarnik e Intrusão de Pendências",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Sinto uma sensação incômoda de urgência ou inquietação interna quando sei que há listas de afazeres acumuladas.",
                          "domain":  "dim2",
                          "domainLabel":  "Tensão de Zeigarnik e Intrusão de Pendências",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Tenho a sensação de que meu cérebro trata qualquer pendência em aberto como uma crise que precisa de resolução imediata.",
                          "domain":  "dim2",
                          "domainLabel":  "Tensão de Zeigarnik e Intrusão de Pendências",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Quando sou interrompido abruptamente em uma tarefa, sinto forte irritabilidade ou extrema dificuldade para redirecionar minha atenção.",
                          "domain":  "dim2",
                          "domainLabel":  "Tensão de Zeigarnik e Intrusão de Pendências",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Esqueço com frequência informações que acabei de ler ou ouvir porque sinto que minha mente já está com a capacidade saturada.",
                          "domain":  "dim3",
                          "domainLabel":  "Esgotamento da Memória de Trabalho e Sobrecarga Cognitiva",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Tenho a impressão de que meu raciocínio está lento, como se houvesse \u0027processos demais rodando em segundo plano\u0027 na minha cabeça.",
                          "domain":  "dim3",
                          "domainLabel":  "Esgotamento da Memória de Trabalho e Sobrecarga Cognitiva",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Tomar decisões cotidianas simples (como escolher o que comer ou que roupa vestir) parece exigir uma energia desproporcional.",
                          "domain":  "dim3",
                          "domainLabel":  "Esgotamento da Memória de Trabalho e Sobrecarga Cognitiva",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Sinto que perco prazos ou esqueço compromissos a menos que anote tudo minuciosamente em lembretes externos.",
                          "domain":  "dim3",
                          "domainLabel":  "Esgotamento da Memória de Trabalho e Sobrecarga Cognitiva",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Ao me deitar para dormir, minha mente começa a repassar conversas, tarefas do dia seguinte e compromissos futuros, atrasando o sono.",
                          "domain":  "dim4",
                          "domainLabel":  "Dificuldade de Desconexão e Fechamento Psíquico",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Sinto culpa ou inquietação quando tento relaxar sem estar produzindo algo tangível.",
                          "domain":  "dim4",
                          "domainLabel":  "Dificuldade de Desconexão e Fechamento Psíquico",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Mesmo em finais de semana ou férias, continuo checando e-mails, grupos de trabalho ou listas de pendências por impulso.",
                          "domain":  "dim4",
                          "domainLabel":  "Dificuldade de Desconexão e Fechamento Psíquico",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Tenho dificuldade para encerrar mentalmente o expediente de trabalho, levando as preocupações profissionais para os momentos em família.",
                          "domain":  "dim4",
                          "domainLabel":  "Dificuldade de Desconexão e Fechamento Psíquico",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  13,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  26,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  37,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  48,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EDARR",
        "code":  "T-31",
        "shortTitle":  "EDARR (Escala Dimensional de Aned...)",
        "fullTitle":  "Escala Dimensional de Anedonia e Responsividade a Recompensas (EDARR / T-31)",
        "cardDescription":  "16 itens (4 dim.). Anedonia Antecipatória e Avolia Motivacional (\u0027Wanting\u0027 / Striatum), Anedonia Consumatória e....",
        "category":  "Humor \u0026 Existencial",
        "icon":  "sun",
        "accentColor":  "emerald",
        "protocolPrefix":  "DM-HUM-",
        "instruction":  "Esta escala autoaplicável avalia o grau de embotamento hedônico, a sensibilidade da circuitaria de recompensa e o impacto de frustrações crônicas na motivação. O instrumento discrimina a perda de desejo antecipatório ( Wanting / Dopamina ) da perda de prazer no momento da expe...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "dim1",
                              "label":  "Anedonia Antecipatória e Avolia Motivacional (\u0027Wanting\u0027 / Striatum)",
                              "desc":  "Avalia a capacidade de projetar prazer futuro, o entusiasmo antecipatório e a disposição energética para iniciar ações gratificantes.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dim2",
                              "label":  "Anedonia Consumatória e Embotamento Hedônico (\u0027Liking\u0027 / Opioides)",
                              "desc":  "Avalia a capacidade de saborear o momento presente e registrar deleite sensorial ou afetivo durante a realização da atividade.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "dim3",
                              "label":  "Hipersensibilidade Habenular à Frustração (Epitálamo \u0026 LHb)",
                              "desc":  "Mapeia a hiper-reatividade do centro antirrecompensa do cérebro, a aversão ao esforço e a tendência ao desânimo imediato após pequenos imprevistos.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "dim4",
                              "label":  "Responsividade Social e Conexão Afetiva (Ocitocina \u0026 Vínculo)",
                              "desc":  "Investiga o isolamento comportamental, o embotamento da empatia hedônica e a perda do prazer em trocas interpessoais.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Item 01 Quando penso em planos futuros ou finais de semana, tenho dificuldade em sentir empolgação ou expectativa positiva.",
                          "domain":  "dim1",
                          "domainLabel":  "Anedonia Antecipatória e Avolia Motivacional (\u0027Wanting\u0027 / Striatum)",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Item 02 Mesmo sabendo que uma atividade me faria bem, sinto que não vale a pena o esforço físico ou mental de sair de casa para fazê-la.",
                          "domain":  "dim1",
                          "domainLabel":  "Anedonia Antecipatória e Avolia Motivacional (\u0027Wanting\u0027 / Striatum)",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Item 03 Perdi o hábito de criar metas ou projetos pessoais porque uma voz interna me diz antecipadamente: \u0027nada disso vai adiantar\u0027.",
                          "domain":  "dim1",
                          "domainLabel":  "Anedonia Antecipatória e Avolia Motivacional (\u0027Wanting\u0027 / Striatum)",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Item 04 Preciso de um esforço de vontade desmedido para iniciar tarefas recreativas que antes começavam de forma espontânea e natural.",
                          "domain":  "dim1",
                          "domainLabel":  "Anedonia Antecipatória e Avolia Motivacional (\u0027Wanting\u0027 / Striatum)",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Item 05 Ao comer uma refeição saborosa ou minha comida favorita, percebo que ela tem gosto neutro ou sem graça em comparação ao passado.",
                          "domain":  "dim2",
                          "domainLabel":  "Anedonia Consumatória e Embotamento Hedônico (\u0027Liking\u0027 / Opioides)",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Item 06 Quando escuto músicas que costumavam me emocionar profundamente, sinto-as apenas como um barulho distante e sem impacto emocional.",
                          "domain":  "dim2",
                          "domainLabel":  "Anedonia Consumatória e Embotamento Hedônico (\u0027Liking\u0027 / Opioides)",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Item 07 Raramente consigo me sentir relaxado(a) e pleno(a) desfrutando de momentos de lazer; é como se houvesse uma névoa anestesiante contínua.",
                          "domain":  "dim2",
                          "domainLabel":  "Anedonia Consumatória e Embotamento Hedônico (\u0027Liking\u0027 / Opioides)",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Item 08 Mesmo quando uma situação engraçada acontece ao meu redor, sinto que meu riso é mecânico e não vem de dentro.",
                          "domain":  "dim2",
                          "domainLabel":  "Anedonia Consumatória e Embotamento Hedônico (\u0027Liking\u0027 / Opioides)",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Item 09 Basta um pequeno imprevisto ou contratempo para que eu desista totalmente de um plano e queira me isolar no quarto.",
                          "domain":  "dim3",
                          "domainLabel":  "Hipersensibilidade Habenular à Frustração (Epitálamo \u0026 LHb)",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Item 10 A sensação de desapontamento quando algo sai errado me parece física e desproporcionalmente dolorosa, drenando minha energia por dias.",
                          "domain":  "dim3",
                          "domainLabel":  "Hipersensibilidade Habenular à Frustração (Epitálamo \u0026 LHb)",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Item 11 Costumo superdimensionar a dificuldade de qualquer ação produtiva, antecipando que o cansaço superará de longe o ganho obtido.",
                          "domain":  "dim3",
                          "domainLabel":  "Hipersensibilidade Habenular à Frustração (Epitálamo \u0026 LHb)",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Item 12 Sinto que acumulei tantas decepções nos últimos meses que meu cérebro simplesmente \u0027desistiu\u0027 de tentar novas iniciativas.",
                          "domain":  "dim3",
                          "domainLabel":  "Hipersensibilidade Habenular à Frustração (Epitálamo \u0026 LHb)",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Item 13 Conversar com amigos ou familiares parece um fardo exaustivo, e prefiro inventar desculpas para permanecer sozinho(a).",
                          "domain":  "dim4",
                          "domainLabel":  "Responsividade Social e Conexão Afetiva (Ocitocina \u0026 Vínculo)",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Item 14 Tenho dificuldade em me alegrar com as boas notícias e vitórias das pessoas queridas ao meu redor, experimentando um distanciamento frio.",
                          "domain":  "dim4",
                          "domainLabel":  "Responsividade Social e Conexão Afetiva (Ocitocina \u0026 Vínculo)",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Item 15 Demonstrações de afeto físico (abraços, carinhos) não produzem o conforto acolhedor que outrora proporcionavam.",
                          "domain":  "dim4",
                          "domainLabel":  "Responsividade Social e Conexão Afetiva (Ocitocina \u0026 Vínculo)",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Item 16 Sinto que estou me tornando gradativamente invisível e distante dos círculos sociais aos quais pertencia, sem motivação para reverter isso.",
                          "domain":  "dim4",
                          "domainLabel":  "Responsividade Social e Conexão Afetiva (Ocitocina \u0026 Vínculo)",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  29,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  42,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  53,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  64,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EDA_AD",
        "code":  "T-30",
        "shortTitle":  "EDA-AD (Desamparo Aprendido e Agên...)",
        "fullTitle":  "Escala de Desamparo Aprendido e Agência Dopaminérgica (EDA-AD / T-30)",
        "cardDescription":  "16 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Humor \u0026 Existencial",
        "icon":  "sun",
        "accentColor":  "emerald",
        "protocolPrefix":  "DM-HUM-",
        "instruction":  "Fundamentação Teórica e Objetivo: Elaborada com base nas pesquisas sobre o desamparo aprendido (Maier \u0026 Seligman, 2016), no construto de Autoeficácia de Albert Bandura e nas neurociências da motivação dopaminérgica (Schultz; Panksepp), esta escala investiga a vulnerabilidade à...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Item 01 Quando enfrento um revés difícil, sinto de imediato que qualquer iniciativa minha para consertar a situação será inútil.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Item 02 Tenho a sensação frequente de que os rumos da minha vida são determinados por forças externas e que não tenho voz ativa.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Item 03 Diante de problemas acumulados, minha reação primária é me paralisar e esperar que a tempestade passe sozinha, sem agir.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Item 04 Quando algo dá errado, penso imediatamente que a culpa é um defeito irreparável meu e que as coisas nunca vão mudar.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Item 05 Sinto extrema dificuldade para \u0027dar a partida\u0027 em tarefas importantes, como se faltasse combustível biológico para o primeiro passo.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Item 06 A perspectiva de alcançar metas futuras raramente me gera entusiasmo ou motivação no momento presente.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Item 07 Mesmo tarefas corriqueiras (organizar uma mesa, responder um recado) parecem exigir um esforço físico e mental exaustivo.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Item 08 Percebo que perdi o interesse e a curiosidade por atividades que antes me mobilizavam com entusiasmo natural.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Item 09 Acredito que o êxito das outras pessoas decorre de pura sorte, e que meu esforço pessoal pouco altera minha realidade.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Item 10 Quando consigo alcançar um bom resultado, acho que foi mero acaso e tenho extrema dificuldade em reconhecer meu mérito.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Item 11 Sinto-me desamparado(a) e à mercê do humor ou das decisões arbitrárias de figuras de autoridade ao meu redor.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Item 12 Costumo abandonar planos na primeira barreira ou negativa, convencido(a) de que insistir seria pura perda de tempo.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Item 13 Mesmo quando estou desanimado(a), consigo quebrar um problema grande em uma micro-tarefa de 2 minutos e iniciar por ela.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Item 14 Acredito que, mesmo sob adversidades severas, sempre conservo a liberdade de escolher a minha atitude interior e meu próximo passo.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Item 15 Após um fracasso pontual, consigo analisar o que esteve sob meu controle e recalibrar minha estratégia em vez de desistir de tudo.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Item 16 Ao concluir uma tarefa difícil, sinto orgulho e registro conscientemente a sensação de que minha ação fez diferença.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  29,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  42,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  53,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  64,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "ISIDI",
        "code":  "T-29",
        "shortTitle":  "ISIDI (Sensibilidade Interoceptiv...)",
        "fullTitle":  "Inventário de Sensibilidade Interoceptiva e Decisão Intuitiva (ISIDI / T-29)",
        "cardDescription":  "16 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Cognição \u0026 Funções Executivas",
        "icon":  "cpu",
        "accentColor":  "indigo",
        "protocolPrefix":  "DM-COG-",
        "instruction":  "Fundamentação Teórica e Objetivo: Desenvolvido com base na Hipótese dos Marcadores Somáticos de Antonio Damasio, no Multidimensional Assessment of Interoceptive Awareness (MAIA) e nas neurociências da ínsula anterior, este instrumento investiga a sua competência biológica para...",
        "options":  [
                        {
                            "value":  0,
                            "label":  "Quase nunca",
                            "desc":  ""
                        },
                        {
                            "value":  1,
                            "label":  "Raramente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Quase sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "1 Percebo com facilidade as variações sutis no meu ritmo cardíaco e na respiração quando vivencio situações novas ou desafiadoras.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "2 Noto tensões físicas, nós na garganta ou contrações no estômago antes mesmo de entender conscientemente o que me incomoda.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "3 Consigo identificar com clareza em qual região do meu corpo as diferentes emoções (alegria, raiva, desconfiança, tranquilidade) se manifestam.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "4 Durante o dia, costumo fazer breves pausas para checar como meu corpo se sente por dentro (nível de energia, tensão muscular, conforto visceral).",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "5 Sei diferenciar quando uma sensação física é um aviso sóbrio de prudência ou apenas o medo ansioso de errar.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "6 Reconheço que a minha intuição autêntica traz calma e clareza imediata, enquanto a ansiedade vem acompanhada de urgência e pensamentos catastróficos.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "7 Quando sinto um desconforto diante de uma pessoa ou proposta, consigo observar o sinal sem entrar em pânico ou criar teorias conspiratórias.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "8 Evito tomar decisões cruciais quando percebo que meu corpo está agitado ou sob exaustão, esperando a poeira somática assentar.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "9 Ao ponderar alternativas, presto atenção em qual delas gera sensação de expansão/alívio e qual gera aperto/náusea no peito ou abdômen.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Costumo confiar no meu \u0027frio na barriga\u0027 como um dado relevante da realidade, unindo essa pista aos dados objetivos conhecidos.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Em escolhas relacionais ou profissionais complexas, a presença de uma sensação de serenidade interior tem peso substancial no meu caminho final.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Quando todos os argumentos lógicos parecem convincentes mas sinto um incômodo visceral inexplicável, prefiro pausar e investigar antes de assinar ou concordar.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Sinto segurança em bancar minhas decisões intuitivas mesmo quando outras pessoas demoram a compreender os motivos do meu posicionamento.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Consigo evitar a paralisia por excesso de análise, agindo com prontidão quando sinto que a conjuntura está madura.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Ao revisitar minha trajetória, percebo que os passos mais assertivos da minha vida foram acompanhados por uma certeza corporal límpida.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Respeito os limites e avisos do meu organismo em vez de me violentar para cumprir metas apenas por orgulho ou pressão externa.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  18,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  35,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  50,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  64,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "ERN_RV",
        "code":  "T-28",
        "shortTitle":  "ERN-RV (Resiliência Neurobiológica...)",
        "fullTitle":  "Escala de Resiliência Neurobiológica e Regulação Vagal (ERN-RV / T-28)",
        "cardDescription":  "16 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Regulação Emocional",
        "icon":  "compass",
        "accentColor":  "teal",
        "protocolPrefix":  "DM-REG-",
        "instruction":  "Esta escala autoaplicável avalia o seu perfil de resiliência e adaptação fisiológica ao estresse, ancorando-se nos princípios da Teoria Polivagal (Stephen Porges), na regulação do Eixo HPA e no modelo de Carga Alostática (Bruce McEwen). Instruções: Avalie com que frequência ca...",
        "options":  [
                        {
                            "value":  0,
                            "label":  "Quase nunca",
                            "desc":  ""
                        },
                        {
                            "value":  1,
                            "label":  "Raramente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Quase sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "1 Quando passo por um susto ou situação estressante, sinto que minha respiração e batimentos cardíacos voltam ao normal em poucos minutos.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "2 Consigo relaxar a musculatura do corpo (como ombros e mandíbula) e adormecer com serenidade mesmo após dias desgastantes.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "3 Meu corpo mantém digestão estável e ausência de dores viscerais ou tremores mesmo diante de prazos e pressões.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "4 Práticas de respiração lenta ou pequenas pausas conscientes me acalmam prontamente e diminuem minha inquietude interna.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "5 Diante de imprevistos, consigo desacelerar e avaliar diferentes saídas em vez de agir por puro impulso ou irritação.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "6 Reconheço pensamentos negativos ou autocríticos como hipóteses mentais transitórias, sem tomá-los como verdades literais.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "7 Quando uma tentativa ou plano falha, consigo abandonar a abordagem anterior e criar novas soluções sem paralisar pela culpa.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "8 Mantenho a mente focada no essencial e tomo decisões ponderadas mesmo sob cobrança externa ou incerteza.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "9 Acredito firmemente na minha capacidade de aprender novas habilidades e superar obstáculos com dedicação orientada.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Em meio a crises, concentro minha energia exclusivamente naquilo que posso controlar diretamente em vez de me queixar do incontrolável.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Encontro propósito e significado para seguir em frente mesmo quando as circunstâncias externas parecem injustas ou difíceis.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Consigo sustentar metas de longo prazo com disciplina, aceitando os desconfortos inevitáveis da trajetória.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Em dias complicados, consigo expressar vulnerabilidade e pedir apoio a amigos ou familiares sem vergonha tóxica.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Sinto que a presença, o tom de voz e o acolhimento de pessoas queridas me trazem segurança corporal e tranquilidade rápida.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Consigo estabelecer limites firmes nas minhas relações interpessoais sem medo exagerado de desaprovação ou rejeição.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Mantenho empatia, respeito e curiosidade pelas pessoas ao meu redor mesmo quando me sinto sob estresse moderado.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  18,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  35,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  50,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  64,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "PG_13",
        "code":  "",
        "shortTitle":  "PG-13 (Luto Prolongado e Apego Ro...)",
        "fullTitle":  "Inventário de Luto Prolongado e Apego Rompido (PG-13)",
        "cardDescription":  "13 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Relacionamentos \u0026 Apego",
        "icon":  "users",
        "accentColor":  "rose",
        "protocolPrefix":  "DM-REL-",
        "instruction":  "Como responder: Pense na perda mais dolorosa ou vínculo rompido que marcou sua trajetória recente (morte de um ente querido, término de relacionamento longo ou separação afetiva profunda). Indique com que frequência você experimentou os seguintes sentimentos, pensamentos e rea...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Quase nunca",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Raramente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Quase sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Sinto uma saudade avassaladora e um anseio doloroso (fissura afetiva) pela presença física de quem partiu.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Pensamentos e imagens da pessoa invadem minha mente de forma involuntária, sequestrando meu foco cotidiano.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Pego-me esperando ouvir os passos, a voz ou a chegada da pessoa, como se a perda ainda não fosse real.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Sinto que uma parte vital da minha própria identidade e da minha alma foi arrancada junto com a perda.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Tenho grande dificuldade em aceitar a irreversibilidade da separação ou do rompimento do vínculo.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Experimento um vazio existencial profundo e a sensação de que a vida perdeu o sentido ou o brilho.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Sinto-me desorientado(a) quanto ao meu futuro ou sem clareza sobre quem eu sou sem aquela convivência.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Evito ativamente lugares, conversas, fotos, datas ou objetos que me façam lembrar da pessoa ou do ocorrido.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Sinto amargura, mágoa crônica ou uma revolta intensa contra a vida ou circunstâncias relacionadas à perda.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Ao lembrar da ausência, sinto sintomas corporais intensos (nó na garganta, opressão torácica, palpitações ou fadiga extrema).",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Sinto-me emocionalmente anestesiado(a) ou com grande dificuldade de experimentar alegria genuína com outras pessoas.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Tenho dificuldade para confiar plenamente ou me conectar afetivamente com amigos, familiares ou novos círculos.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "A saudade e o sofrimento da ausência prejudicam seriamente meu trabalho, meus cuidados pessoais e meu dia a dia.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  28,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  42,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  54,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  65,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "TRAUMA_COMPLEXO_CPTSD",
        "code":  "",
        "shortTitle":  "Escala de Sintomas de Trauma Complexo e Di...",
        "fullTitle":  "Escala de Sintomas de Trauma Complexo e Dissociação (CPTSD / ITQ)",
        "cardDescription":  "15 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Trauma \u0026 Esquemas",
        "icon":  "shield-alert",
        "accentColor":  "purple",
        "protocolPrefix":  "DM-TRM-",
        "instruction":  "Diretrizes de Preenchimento: Pense em como você tem se sentido e funcionado nas últimas semanas e meses, especialmente considerando situações de estresse, conflitos ou memórias difíceis de sua história. Avalie cada afirmação selecionando o grau de frequência de 0 a 4. Este ins...",
        "options":  [
                        {
                            "value":  0,
                            "label":  "Nunca",
                            "desc":  ""
                        },
                        {
                            "value":  1,
                            "label":  "Raro",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Frequente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Quase Sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Memórias angustiantes, imagens mentais ou sensações físicas do passado invadem sua mente de forma repentina e incontrolável?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Você faz esforços intensos para evitar pensamentos, sentimentos, pessoas ou lugares que façam lembrar situações traumáticas ou dolorosas?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Você se sente constantemente em estado de alerta máximo ou com sobressaltos exagerados a ruídos e aproximações repentinas?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Quando sob pressão, você experimenta acessos de raiva repentinos ou, alternativamente, entra em paralisia e anestesia afetiva total?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Você tem dificuldade persistente em acalmar seu corpo e retornar ao equilíbrio fisiológico após sofrer uma chateação?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Carrega uma sensação profunda e crônica de ser uma pessoa \"defeituosa\", menor, fracassada ou indigna em comparação aos outros?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Sente vergonha tóxica e culpa difusa em relação a coisas que você não pôde controlar ou sobre a sua própria vulnerabilidade?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Tem extrema dificuldade em sentir proximidade emocional verdadeira ou confiar que as pessoas não irão trair ou machucar você?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Costuma se afastar ou cortar laços interpessoais preventivamente para evitar a dor de uma potencial rejeição futura?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Experimenta episódios de desconexão da realidade (desrealização) ou sente como se seu corpo e sua mente estivessem separados (despersonalização)?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Sente como se estivesse vivendo em \"piloto automático\", assistindo à própria vida de fora, especialmente sob conflitos?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Esses sintomas interferem significativamente na sua rotina de trabalho, nos estudos, na vida amorosa ou na capacidade de descansar?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Você tem a sensação de que perdeu o contato com quem você realmente é, como se sua identidade estivesse fragmentada em partes conflitantes?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Experimenta sintomas somáticos inexplicáveis quando sob tensão (dores corporais difusas, enxaquecas, distúrbios gástricos ou aperto torácico)?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Sente uma exaustão existencial crônica, como se a sua energia vital fosse drenada pelo simples ato de tentar manter o controle do dia a dia?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  17,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  33,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  47,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  60,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "RIGOR_EPISTE_AVANCA",
        "code":  "T-25",
        "shortTitle":  "Escala de Rigor Epistêmico e Dedução Avanç...",
        "fullTitle":  "Escala de Rigor Epistêmico e Dedução Avançada (EREDA — T-25)",
        "cardDescription":  "15 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Metacognição \u0026 Lógica",
        "icon":  "brain",
        "accentColor":  "blue",
        "protocolPrefix":  "DM-MET-",
        "instruction":  "Objetivo Clínico-Epistêmico: Esta escala autoaplicável avalia o seu grau de sofisticação lógica, controle inibitório e flexibilidade cognitiva diante de problemas formais complexos. O instrumento mensura três domínios avançados: (1) Domínio dos Quantificadores Universais e Exi...",
        "options":  [
                        {
                            "value":  0,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  1,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Neutro / Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando uma experiência importante falha, consigo reconhecer que se trata de um evento existencial isolado (∃ x ), sem transformar isso em uma regra universal punitiva de que \"tudo sempre dará errado\" (∀ x ).",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Percebo de imediato que refutar a afirmação universal \"todos os membros de um grupo têm a mesma intenção\" requer encontrar apenas um único contraexemplo real, e não provar que nenhum deles tem tal intenção.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Ao debater assuntos controversos, distingo com precisão a diferença entre \"alguns dados indicam um padrão\" e \"o padrão se aplica universalmente a todos os casos observados\".",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Se uma pessoa expressa um descontentamento específico sobre uma atitude minha, consigo delimitar a crítica àquele predicado pontual sem concluir que a relação inteira foi condenada.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Tenho clareza lógica de que a negação de \"nenhuma pessoa me compreende\" (¬∀ x ¬ C ( x )) é simplesmente \"existe alguém que me compreende\" (∃ x C ( x )), desarmando sentimentos de solidão absoluta.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Mesmo quando um cenário negativo é teoricamente possível (◇ Risco ), consigo evitar o impulso ansioso de reagir emocionalmente como se ele fosse inevitável ou necessário (□ Risco ).",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Consigo conceber mentalmente realidades alternativas (mundos possíveis contrafactuais) para avaliar com lucidez se minhas escolhas passadas foram razoáveis com as informações que eu dispunha na época.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Diferencio claramente obrigações lógicas fundamentais (como o Princípio de Não-Contradição) de convenções sociais contingentes que poderiam ser diferentes em outras culturas ou contextos.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Em momentos de incerteza sobre o futuro, aceito com serenidade a presença de variáveis contingentes fora do meu controle, sem exigir que tudo seja matematicamente determinado a priori.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Identifico rapidamente quando um argumento retórico tenta me forçar a aceitar uma suposição arbitrária como se ela fosse uma verdade logicamente necessária e imutável.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Consigo subir para a metalinguagem (observar o fato de estar tendo um pensamento) em vez de me fundir imediatamente ao conteúdo do pensamento e tomá-lo como fato objetivo no mundo.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Percebo a armadilha de paradoxos autorreferenciais como \"eu não confio em ninguém, inclusive nesta própria afirmação\" e sei que tentar resolver isso no mesmo nível linguístico só gera obsessão mental.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Reconheço que a incompletude formal provada por Kurt Gödel se aplica à vida humana: nem todas as verdades sobre quem eu sou ou para onde devo ir podem ser provadas antecipadamente por fórmulas mentais fechadas.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Abandonei a ilusão de perfeccionismo absoluto: sei que exigir de mim mesmo respostas infalíveis para todos os imprevistos da existência é violar os limites matemáticos e biológicos da própria razão.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Diante de dilemas profundos e sem resposta pronta, consigo agir com base nos meus valores essenciais em vez de me paralisar em ruminações circulares em busca de uma certeza impossível.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  17,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  33,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  47,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  60,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "VALIDACAO_PROPOSICIONAL",
        "code":  "",
        "shortTitle":  "Inventário de Validação Proposicional e Ra...",
        "fullTitle":  "Inventário de Validação Proposicional e Raciocínio Lógico Básico",
        "cardDescription":  "15 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Relacionamentos \u0026 Apego",
        "icon":  "users",
        "accentColor":  "rose",
        "protocolPrefix":  "DM-REL-",
        "instruction":  "Orientações: Responda às 15 questões abaixo pensando em como você tipicamente analisa informações, argumentos e decisões na sua rotina pessoal e profissional. Este teste é 100% privado : os dados são processados localmente no seu navegador e não são transmitidos a servidores e...",
        "options":  [
                        {
                            "value":  0,
                            "label":  "Raras vezes",
                            "desc":  ""
                        },
                        {
                            "value":  1,
                            "label":  "Ocasionalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Quase Sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando debato ou analiso um tema, garanto que termos fundamentais mantenham o mesmo significado do início ao fim, evitando trocar de sentido no meio da conversa (Princípio de Identidade).",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Compreendo com facilidade a diferença entre uma conjunção (\"E\") e uma disjunção (\"OU\"): se um resultado exige duas condições simultâneas, sei que a falta de uma invalida o todo.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Consigo separar a intensidade emocional (medo, empolgação, raiva) da validade objetiva dos argumentos que estou avaliando.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Percebo rapidamente quando sustento duas convicções mutuamente contraditórias e busco solucionar a incoerência em vez de usar desculpas (Princípio de Não-Contradição).",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Em uma condicional \"Se A, então B\", compreendo que o fato de B acontecer não prova obrigatoriamente que A ocorreu (evito a falácia de afirmação do consequente).",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Evito o pensamento dicotômico de \"tudo ou nada\" (ex: \"se não for perfeito, é um desastre\"), reconhecendo que a maioria das situações humanas admite gradações.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Ao analisar sentenças factuais bem definidas, reconheço que uma proposição ou é verdadeira ou é falsa, sem criar subterfúgios para escapar da realidade (Princípio do Terceiro Excluído).",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Reconheço que \"Se chover, a rua molha\" não autoriza concluir que \"Se não chover, a rua estará seca\" (evito a falácia da negação do antecedente).",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Quando alguém ataca a pessoa ou o caráter de quem fala em vez de rebater o argumento (falácia ad hominem), percebo a fraqueza lógica da réplica.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Consigo identificar prontamente a falácia do \"espantalho\", quando alguém caricature ou exagera o que eu disse para tentar refutar uma ideia que não defendi.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Em acordos e tomadas de decisão, diferencio claramente uma disjunção exclusiva (\"ou você escolhe A ou B, nunca ambos\") de uma inclusiva (\"A ou B, podendo ser os dois\").",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Evito generalizações apressadas: não tomo um caso isolado ou uma experiência negativa específica como uma lei universal e imutável sobre um grupo ou situação.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Se evidências empíricas sólidas provam que uma premissa minha estava incorreta, reformulo ou abandono a conclusão sem teimosia desnecessária.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Em relacionamentos ou negociações, analiso a estrutura exata das promessas (\"Se você fizer X, farei Y\") antes de assumir culpas ou cobranças indevidas.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Reconheço que sucessão temporal não implica causa: o fato de um evento ocorrer após outro não significa necessariamente que o primeiro causou o segundo.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  17,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  33,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  47,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  60,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "T_23",
        "code":  "T-23",
        "shortTitle":  "T-23 (Dependência de Validação E...)",
        "fullTitle":  "Inventário de Dependência de Validação Externa e Esquema de Aprovação (T-23)",
        "cardDescription":  "15 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Relacionamentos \u0026 Apego",
        "icon":  "users",
        "accentColor":  "rose",
        "protocolPrefix":  "DM-REL-",
        "instruction":  "Leia cada afirmação com atenção e assinale a opção que melhor representa sua experiência habitual.",
        "options":  [
                        {
                            "value":  0,
                            "label":  "Quase Nunca",
                            "desc":  ""
                        },
                        {
                            "value":  1,
                            "label":  "Raramente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Quase Sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando publico algo nas redes sociais ou envio uma mensagem importante, sinto uma inquietação interna imediata para checar curtidas, comentários ou confirmações de leitura.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Tenho imensa dificuldade em dizer \"não\" a pedidos alheios, mesmo quando estou física ou emocionalmente esgotado(a), temendo causar decepção ou atrito.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Diante de um olhar sério, tom de voz frio ou silêncio inesperado de alguém importante, sinto um aperto físico no peito/estômago e temo ter feito algo errado.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Preciso que figuras de autoridade, colegas ou parceiros verbalizem explicitamente que meu trabalho ou escolhas estão bons para que eu me sinta seguro(a).",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Muitas vezes adapto minhas opiniões, gostos ou postura ao que acredito que o grupo prefere, escondendo o que realmente penso para não ser excluído(a).",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Quando alguém discorda de mim com firmeza ou faz uma crítica pontual, sinto uma vergonha avassaladora, como se meu valor global tivesse sido invalidado.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Uma ausência prolongada de elogios, curtidas ou mensagens me faz presumir silenciosamente que caí em desgraça ou me tornei invisível.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Prefiro assumir tarefas que não são de minha responsabilidade ou tolerar desrespeito sutil a ter que confrontar e correr o risco de não ser querido(a).",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Fico ruminando por horas mensagens monossilábicas (\"ok\", \"tá\", visualizado sem resposta), imaginando se a pessoa está aborrecida comigo.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Minha autoconfiança é montanha-russa: um elogio me traz euforia profunda, mas uma desatenção alheia me afunda em desvalorização imediata.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Sinto que preciso estar constantemente performando utilidade, simpatia, perfeição ou entretenimento para justificar minha presença nos espaços.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Sinto uma culpa dilacerante quando priorizo minhas próprias necessidades ou estabeleço um limite claro com familiares, chefes ou amigos.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Reviso minuciosamente e-mails, conversas gravadas ou posts passados para conferir que imagem passei e me certificar de que soei agradável e admirável.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Escondo meus momentos de cansaço, fracasso ou tristeza profunda sob uma máscara de \"está tudo perfeito\" para que ninguém se afaste ou me ache fraco(a).",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Diante de uma desaprovação explícita, meu primeiro impulso instintivo é me desculpar excessivamente ou me submeter para reaver a afeição do outro a qualquer custo.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  17,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  33,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  47,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  60,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "RSD",
        "code":  "",
        "shortTitle":  "RSD (Disforia Sensível à Rejeiç...)",
        "fullTitle":  "Escala de Disforia Sensível à Rejeição (RSD) e Reatividade Afetiva",
        "cardDescription":  "15 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Relacionamentos \u0026 Apego",
        "icon":  "users",
        "accentColor":  "rose",
        "protocolPrefix":  "DM-REL-",
        "instruction":  "Leia cada afirmação com atenção e assinale a opção que melhor representa sua experiência habitual.",
        "options":  [
                        {
                            "value":  0,
                            "label":  "Nunca",
                            "desc":  ""
                        },
                        {
                            "value":  1,
                            "label":  "Raro",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Frequente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Quase Sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Uma crítica construtiva ou um feedback neutro no trabalho/estudo causa uma sensação imediata de esmagamento ou vergonha profunda?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Quando percebe que alguém pode estar chateado ou distante com você, sente um aperto físico no peito, nó no estômago ou falta de ar?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Você se esforça excessivamente para agradar a todos (people-pleasing) para evitar qualquer risco mínimo de rejeição ou desagrado?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Mensagens de texto não respondidas ou respostas curtas fazem você entrar em espirais de ruminação acreditando que fez algo de errado?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "A intensidade da sua dor emocional diante de um desentendimento interpessoal é tão avassaladora que você a descreve quase como uma dor física insuportável?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Você já deixou de tentar novas oportunidades profissionais, hobbies ou relacionamentos pelo medo paralisante de falhar ou não ser aceito?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Você costuma reexaminar conversas passadas na cabeça, caçando pistas invisíveis de que a outra pessoa possa ter se decepcionado com você?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Momentos de rejeição percebida provocam quedas repentinas de energia, vontade súbita de chorar ou impulsos explosivos de autoagressão verbal?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Você estabelece padrões de perfeccionismo implacáveis para si mesmo para garantir que ninguém encontre falhas para criticar?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Tem dificuldade em diferenciar um desentendimento corriqueiro de uma ruptura definitiva do relacionamento ou amizade?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Diante de desaprovação social, seu humor pode cair instantaneamente de animado e motivado para profundo desespero em questão de segundos?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Você prefere se isolar socialmente quando se sente vulnerável, temendo que qualquer interação resulte em mais rejeição?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Você frequentemente assume que o silêncio, a seriedade ou o cansaço dos outros são causados por raiva ou insatisfação com você?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Sente uma raiva interna intensa ou vergonha tóxica dirigida a si mesmo quando não atinge um padrão de excelência social ou profissional?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Você evita expor suas verdadeiras opiniões, sentimentos ou projetos criativos por medo antecipatório de ser ridicularizado ou julgado?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  17,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  33,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  47,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  60,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "ESCSA",
        "code":  "T-18",
        "shortTitle":  "ESCSA (Satisfação Conjugal e Segu...)",
        "fullTitle":  "Escala de Satisfação Conjugal e Segurança Afetiva (ESCSA / T-18)",
        "cardDescription":  "15 itens (3 dim.). Acolhimento e Responsividade Afetiva, Segurança de Vínculo e Autonomia, Intimidade e Conexão....",
        "category":  "Relacionamentos \u0026 Apego",
        "icon":  "users",
        "accentColor":  "rose",
        "protocolPrefix":  "DM-REL-",
        "instruction":  "Leia cada afirmação com atenção e assinale a opção que melhor representa sua experiência habitual.",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "ara",
                              "label":  "Acolhimento e Responsividade Afetiva",
                              "desc":  "Dimensão Acolhimento e Responsividade Afetiva.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "sva",
                              "label":  "Segurança de Vínculo e Autonomia",
                              "desc":  "Dimensão Segurança de Vínculo e Autonomia.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "icb",
                              "label":  "Intimidade e Conexão Biológica",
                              "desc":  "Dimensão Intimidade e Conexão Biológica.",
                              "color":  "bg-amber-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando compartilho minhas preocupações ou vulnerabilidades, sinto que meu parceiro(a) realmente escuta e valida meus sentimentos.",
                          "domain":  "ara",
                          "domainLabel":  "Acolhimento e Responsividade Afetiva",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Sinto-me seguro(a) quanto à permanência da nossa relação, sem a necessidade constante de checar se ainda sou amado(a).",
                          "domain":  "sva",
                          "domainLabel":  "Segurança de Vínculo e Autonomia",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "O contato físico espontâneo (abraços, mãos dadas, carinho) é frequente e ajuda a acalmar meus dias estressantes.",
                          "domain":  "icb",
                          "domainLabel":  "Intimidade e Conexão Biológica",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Sei que posso contar com o apoio incondicional do meu parceiro(a) nos momentos de crise de saúde ou sofrimento emocional.",
                          "domain":  "ara",
                          "domainLabel":  "Acolhimento e Responsividade Afetiva",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Não sinto ansiedade desmedida quando meu parceiro(a) passa um tempo distante ou engajado em projetos individuais.",
                          "domain":  "sva",
                          "domainLabel":  "Segurança de Vínculo e Autonomia",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Quando temos desentendimentos ou discussões, conseguimos nos reconectar e conversar com serenidade pouco tempo depois.",
                          "domain":  "icb",
                          "domainLabel":  "Intimidade e Conexão Biológica",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Sinto que sou uma prioridade evidente na vida e na rotina do meu parceiro(a).",
                          "domain":  "ara",
                          "domainLabel":  "Acolhimento e Responsividade Afetiva",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Consigo expressar divergências de opinião com franqueza sem temer retaliação, frieza ou ameaça de término.",
                          "domain":  "sva",
                          "domainLabel":  "Segurança de Vínculo e Autonomia",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Reservamos momentos de qualidade e intimidade a sós na nossa rotina semanal, mantendo o ambiente livre de telas e distrações.",
                          "domain":  "icb",
                          "domainLabel":  "Intimidade e Conexão Biológica",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Sinto que meu parceiro(a) se alegra verdadeiramente com as minhas conquistas profissionais e pessoais.",
                          "domain":  "ara",
                          "domainLabel":  "Acolhimento e Responsividade Afetiva",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Acredito profundamente na lealdade e na integridade ética do compromisso assumido entre nós dois.",
                          "domain":  "sva",
                          "domainLabel":  "Segurança de Vínculo e Autonomia",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Estar na presença do meu parceiro(a) gera uma sensação corporal de repouso, aconchego e tranquilidade fisiológica.",
                          "domain":  "icb",
                          "domainLabel":  "Intimidade e Conexão Biológica",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Nas conversas difíceis, meu parceiro(a) busca entender meu ponto de vista em vez de assumir postura defensiva ou acusatória.",
                          "domain":  "ara",
                          "domainLabel":  "Acolhimento e Responsividade Afetiva",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Sinto que nossa convivência fortalece minha autonomia pessoal em vez de me aprisionar em dependência emocional.",
                          "domain":  "sva",
                          "domainLabel":  "Segurança de Vínculo e Autonomia",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Nosso relacionamento opera como um \u0027porto seguro\u0027 para o qual posso retornar para recarregar as energias da vida.",
                          "domain":  "icb",
                          "domainLabel":  "Intimidade e Conexão Biológica",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  32,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  48,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  62,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  75,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EFDDE",
        "code":  "T-20",
        "shortTitle":  "EFDDE (Fadiga por Decisão e Deple...)",
        "fullTitle":  "Escala de Fadiga por Decisão e Depleção do Ego (EFDDE / T-20)",
        "cardDescription":  "15 itens (3 dim.). Efv, Icin, Psoe.",
        "category":  "Cognição \u0026 Funções Executivas",
        "icon":  "cpu",
        "accentColor":  "indigo",
        "protocolPrefix":  "DM-COG-",
        "instruction":  "Leia cada afirmação com atenção e assinale a opção que melhor representa sua experiência habitual.",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Nunca / Raro",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Ocasionalmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Muito Frequente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Quase Sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "efv",
                              "label":  "Efv",
                              "desc":  "Dimensão Efv.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "icin",
                              "label":  "Icin",
                              "desc":  "Dimensão Icin.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "psoe",
                              "label":  "Psoe",
                              "desc":  "Dimensão Psoe.",
                              "color":  "bg-amber-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Sinto que minha capacidade de ter paciência e autocontrole diminui drasticamente do início da manhã para o fim da tarde.",
                          "domain":  "efv",
                          "domainLabel":  "Efv",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "À noite, cedo com muito mais facilidade a compras desnecessárias, doces calóricos ou pedidos por impulso em aplicativos.",
                          "domain":  "icin",
                          "domainLabel":  "Icin",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Fico irritado(a) ou paralisado(a) quando alguém me pergunta \u0027o que você quer jantar?\u0027 após um dia de trabalho intenso.",
                          "domain":  "psoe",
                          "domainLabel":  "Psoe",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Termino o dia com a mente tão esgotada que até responder mensagens simples de amigos se torna um fardo cognitivo.",
                          "domain":  "efv",
                          "domainLabel":  "Efv",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Costumo perder a calma e ter reações impensadas em conversas difíceis que ocorrem após as 18 horas.",
                          "domain":  "icin",
                          "domainLabel":  "Icin",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Passo muito tempo navegando em catálogos de streaming ou lojas virtuais sem conseguir escolher nada concreto.",
                          "domain":  "psoe",
                          "domainLabel":  "Psoe",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Percebo que decisões que parecem simples pela manhã exigem um esforço desmedido quando adiadas para a noite.",
                          "domain":  "efv",
                          "domainLabel":  "Efv",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Mesmo sabendo que preciso dormir cedo, fico rolando feeds de redes sociais passivamente sem conseguir desligar a tela.",
                          "domain":  "icin",
                          "domainLabel":  "Icin",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Adio decisões importantes de trabalho simplesmente porque me sinto soterrado(a) pela quantidade de caminhos possíveis.",
                          "domain":  "psoe",
                          "domainLabel":  "Psoe",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Ao longo do dia, sinto que minha \u0027força de vontade\u0027 vai se esvaziando como a bateria de um celular.",
                          "domain":  "efv",
                          "domainLabel":  "Efv",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Fico muito mais propenso(a) a quebrar promessas de autocuidado (ir à academia, estudar) no turno da noite.",
                          "domain":  "icin",
                          "domainLabel":  "Icin",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Prefiro que outras pessoas decidam por mim detalhes banais de rotina para que eu não precise pensar.",
                          "domain":  "psoe",
                          "domainLabel":  "Psoe",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Sinto uma fadiga mental profunda mesmo em dias em que não pratiquei nenhum esforço físico pesado.",
                          "domain":  "efv",
                          "domainLabel":  "Efv",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Tomo decisões por cansaço apenas para \u0027livrar-me do assunto\u0027, mesmo sabendo que não escolhi a melhor alternativa.",
                          "domain":  "icin",
                          "domainLabel":  "Icin",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Diante de um formulário ou menu com muitas opções detalhadas, sinto vontade de fechar e desistir.",
                          "domain":  "psoe",
                          "domainLabel":  "Psoe",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  32,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  48,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  62,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  75,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "ISDE_HPA",
        "code":  "T-21",
        "shortTitle":  "ISDE-HPA (Sintomas de Desregulação d...)",
        "fullTitle":  "Inventário de Sintomas de Desregulação do Eixo HPA e Estresse Crônico (ISDE-HPA / T-21)",
        "cardDescription":  "15 itens (3 dim.). Hcf, Hef, Rnc.",
        "category":  "Ansiedade \u0026 Estresse",
        "icon":  "activity",
        "accentColor":  "amber",
        "protocolPrefix":  "DM-EST-",
        "instruction":  "Leia cada afirmação com atenção e assinale a opção que melhor representa sua experiência habitual.",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Nunca / Raro",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Ocasionalmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Muito Frequente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Quase Sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "hcf",
                              "label":  "Hcf",
                              "desc":  "Dimensão Hcf.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "hef",
                              "label":  "Hef",
                              "desc":  "Dimensão Hef.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "rnc",
                              "label":  "Rnc",
                              "desc":  "Dimensão Rnc.",
                              "color":  "bg-amber-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Mesmo sentindo cansaço físico intenso, ao me deitar meu cérebro acelera e não consigo \u0027desligar\u0027 o fluxo de pensamentos.",
                          "domain":  "hcf",
                          "domainLabel":  "Hcf",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Acordo pela manhã com a sensação de \u0027bateria zerada\u0027, sentindo que o sono não restaurou minha energia corporal.",
                          "domain":  "hef",
                          "domainLabel":  "Hef",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Experimento episódios de \u0027névoa mental\u0027 (brain fog), com dificuldade de concentração e esquecimento de termos simples durante momentos de pressão.",
                          "domain":  "rnc",
                          "domainLabel":  "Rnc",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Percebo taquicardia sutil, respiração curta ou aperto no peito mesmo em momentos de descanso ou repouso.",
                          "domain":  "hcf",
                          "domainLabel":  "Hcf",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Sinto uma queda drástica e incontrolável de energia no meio da tarde (entre 14h e 16h), precisando recorrer a açúcar ou café.",
                          "domain":  "hef",
                          "domainLabel":  "Hef",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Pequenos imprevistos ou barulhos repentinos no ambiente provocam uma reação de irritação ou sobressalto desproporcional.",
                          "domain":  "rnc",
                          "domainLabel":  "Rnc",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Acordo no meio da madrugada (frequentemente entre 2h e 4h) com o corpo em estado de prontidão e dificuldade para retornar ao sono.",
                          "domain":  "hcf",
                          "domainLabel":  "Hcf",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Sinto um peso físico nos membros e a sensação de que preciso de um esforço hercúleo para iniciar tarefas rotineiras do dia.",
                          "domain":  "hef",
                          "domainLabel":  "Hef",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Fico sobrecarregado(a) com facilidade em locais com muitos estímulos simultâneos (conversas paralelas, luzes fortes ou telas).",
                          "domain":  "rnc",
                          "domainLabel":  "Rnc",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Noto tensão muscular crônica involuntária, como mandíbula apertada (bruxismo/apertamento), ombros levantados ou mãos cerradas.",
                          "domain":  "hcf",
                          "domainLabel":  "Hcf",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Mesmo descansando nos finais de semana, a sensação de esgotamento e desânimo persiste logo no primeiro dia útil.",
                          "domain":  "hef",
                          "domainLabel":  "Hef",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Sinto que minha paciência relacional se esgotou e que minha capacidade de tolerar frustrações mínimas está muito rebaixada.",
                          "domain":  "rnc",
                          "domainLabel":  "Rnc",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Sinto uma urgência interna constante de estar sempre fazendo algo ou antecipando o próximo problema, com culpa ao tentar relaxar.",
                          "domain":  "hcf",
                          "domainLabel":  "Hcf",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Tenho episódios frequentes de tontura leve ao levantar rapidamente ou sensações súbitas de hipoglicemia/fraqueza física.",
                          "domain":  "hef",
                          "domainLabel":  "Hef",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Apresento desconfortos gástricos ou intestinais (cólicas, digestão lenta, refluxo) que se intensificam visivelmente sob estresse.",
                          "domain":  "rnc",
                          "domainLabel":  "Rnc",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  32,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  48,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  62,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  75,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EIPBE",
        "code":  "T-19",
        "shortTitle":  "EIPBE (Inércia Psíquica e Bloquei...)",
        "fullTitle":  "Escala de Inércia Psíquica e Bloqueio Executivo (EIPBE / T-19)",
        "cardDescription":  "15 itens (3 dim.). Daim, Ctps, Cetr.",
        "category":  "Cognição \u0026 Funções Executivas",
        "icon":  "cpu",
        "accentColor":  "indigo",
        "protocolPrefix":  "DM-COG-",
        "instruction":  "Leia cada afirmação com atenção e assinale a opção que melhor representa sua experiência habitual.",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Nunca / Raro",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Ocasionalmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Muito Frequente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Quase Sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "daim",
                              "label":  "Daim",
                              "desc":  "Dimensão Daim.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "ctps",
                              "label":  "Ctps",
                              "desc":  "Dimensão Ctps.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "cetr",
                              "label":  "Cetr",
                              "desc":  "Dimensão Cetr.",
                              "color":  "bg-amber-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Sinto uma barreira quase física para iniciar tarefas que considero monótonas ou burocráticas, mesmo sabendo de sua urgência.",
                          "domain":  "daim",
                          "domainLabel":  "Daim",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Tenho dificuldade para perceber a passagem do tempo, subestimando drasticamente o tempo necessário para concluir uma atividade.",
                          "domain":  "ctps",
                          "domainLabel":  "Ctps",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Alternar entre duas tarefas diferentes no mesmo dia consome tanta energia mental que me sinto exausto(a) rapidamente.",
                          "domain":  "cetr",
                          "domainLabel":  "Cetr",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Fico paralisado(a) diante de uma tela ou folha em branco querendo muito começar, mas sem conseguir dar o primeiro comando motor.",
                          "domain":  "daim",
                          "domainLabel":  "Daim",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Quando olho para uma lista de afazeres com muitos passos, sinto um colapso cognitivo e acabo não fazendo nenhum.",
                          "domain":  "ctps",
                          "domainLabel":  "Ctps",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Apenas consigo me mover e produzir sob a adrenalina intensa de um prazo final prestes a estourar.",
                          "domain":  "cetr",
                          "domainLabel":  "Cetr",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Passo horas em atividades automáticas (como rolar telas) em estado de ansiedade, querendo parar para trabalhar mas sem conseguir levantar.",
                          "domain":  "daim",
                          "domainLabel":  "Daim",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Tarefas que têm prazos para daqui a semanas parecem simplesmente não existir no meu cérebro até se tornarem emergências.",
                          "domain":  "ctps",
                          "domainLabel":  "Ctps",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Interrupções inesperadas no meio de uma tarefa me deixam profundamente desorientado(a) ou irritado(a) para retornar ao foco.",
                          "domain":  "cetr",
                          "domainLabel":  "Cetr",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Mesmo descansado(a) fisicamente, sinto que minha \u0027bateria de arranque\u0027 mental está descarregada para tarefas não estimulantes.",
                          "domain":  "daim",
                          "domainLabel":  "Daim",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Tenho a sensação crônica de que o dia passou num piscar de olhos sem que eu tenha conseguido realizar o que planejei.",
                          "domain":  "ctps",
                          "domainLabel":  "Ctps",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Recorro a estímulos intensos (cafeína em excesso, urgência artificial, música muito alta) para conseguir fazer meu cérebro engatar.",
                          "domain":  "cetr",
                          "domainLabel":  "Cetr",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Costumo me culpar profundamente por \u0027falta de vergonha\u0027 ou \u0027preguiça\u0027, embora sofra intensamente durante a inércia.",
                          "domain":  "daim",
                          "domainLabel":  "Daim",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Perco o fio da meada do meu planejamento se não tiver alarmes visuais ou lembretes táteis na minha frente o tempo todo.",
                          "domain":  "ctps",
                          "domainLabel":  "Ctps",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Iniciar uma tarefa é tão desgastante que, quando finalmente começo, prefiro trabalhar sem pausas por horas a fio com medo de travar de novo.",
                          "domain":  "cetr",
                          "domainLabel":  "Cetr",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  32,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  48,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  62,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  75,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "SONO",
        "code":  "",
        "shortTitle":  "Questionário de Higiene do Sono e Ritmo Ci...",
        "fullTitle":  "Questionário de Higiene do Sono e Ritmo Circadiano",
        "cardDescription":  "16 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Ansiedade \u0026 Estresse",
        "icon":  "activity",
        "accentColor":  "amber",
        "protocolPrefix":  "DM-EST-",
        "instruction":  "Como funciona: Responda às 16 afirmações abaixo considerando seus hábitos e sensações nas últimas 4 semanas . Seja sincero: não existem respostas certas ou erradas. O processamento é 100% anônimo e calculado diretamente no seu navegador.",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Uso telas brilhantes (celular, tablet, notebook ou TV) na cama ou nos 45 minutos anteriores a deitar para dormir.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Consumo cafeína (café, energéticos, refrigerantes de cola ou chá preto/verde) após as 14h ou 15h da tarde.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Ingiro bebidas alcoólicas à noite como forma de \u0027relaxar\u0027 ou pegar no sono mais rápido.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Faço refeições pesadas, calóricas ou com excesso de açúcar muito perto da hora de ir para a cama.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Meu quarto tem entradas incômodas de luz (frestas na cortina, luzes de aparelhos em stand-by ou postes de rua).",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Sinto o ambiente do quarto quente, abafado ou com temperatura desconfortável para o sono.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "O quarto é barulhento ou exposto a ruídos intermitentes que me despertam durante a madrugada.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Meu colchão ou travesseiro causam desconforto físico, dores musculares ou sensação de rigidez ao acordar.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Meus horários de dormir e acordar oscilam bastante entre os dias úteis e os fins de semana (mais de 1h30 a 2h de diferença).",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Costumo tirar cochilos longos (mais de 30-40 minutos) no meio ou final da tarde.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Passo a maior parte da manhã e início da tarde em ambientes fechados com pouca exposição à luz solar natural.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Permaneço na cama por longos períodos acordado, rolando de um lado para o outro sem conseguir dormir.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Quando apago as luzes, minha mente é invadida por preocupações sobre o dia seguinte, pendências ou problemas.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Costumo responder e-mails de trabalho, planejar metas ou estudar deitado na própria cama.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Sinto palpitações, tensão muscular na mandíbula ou ombros, ou respiração curta ao me deitar para dormir.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Fico monitorando obsessivamente o relógio durante a madrugada, calculando quantas horas ainda tenho para dormir.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  34,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  51,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  66,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  80,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "ISHA",
        "code":  "",
        "shortTitle":  "ISHA (Sensibilidade Sensorial do...)",
        "fullTitle":  "Inventário de Sensibilidade Sensorial do Adulto (ISHA)",
        "cardDescription":  "15 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Regulação Emocional",
        "icon":  "compass",
        "accentColor":  "teal",
        "protocolPrefix":  "DM-REG-",
        "instruction":  "Para cada uma das 15 situações abaixo, assinale a frequência com que você vivencia essas reações no seu dia a dia. Seja sincero com suas sensações: este teste é 100% privado e calculado exclusivamente no seu navegador.",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Sons repetitivos de fundo (mastigação, tique-taque de relógio, ar-condicionado barulhento ou conversas paralelas) me desconcentram a ponto de gerar irritação física.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Luzes brancas fortes, lâmpadas fluorescentes que piscam levemente ou o excesso de brilho de telas me causam dor de cabeça ou cansaço visual rápido.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Tenho dificuldade em entender o que uma pessoa está me dizendo se houver música tocando ou outras pessoas falando ao mesmo tempo no mesmo ambiente.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Sons agudos ou estridentes súbitos (sirenes, buzinas, portas batendo) provocam em mim um susto desproporcional ou dor física nos ouvidos.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Prefiro manter ambientes com iluminação suave, indireta ou penumbra para conseguir relaxar e trabalhar com foco.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Etiquetas de roupas, costuras grossas de meias ou tecidos sintéticos ásperos me incomodam a ponto de eu precisar cortá-los ou trocar de roupa.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Sinto repulsa ou grande desconforto com toques leves inesperados (como um roçar de pele ou um abraço surpresa de conhecidos).",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Sou extremamente sensível a odores fortes (perfumes intensos, produtos de limpeza, fumaça), sentindo náusea ou tontura facilmente.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Tenho intolerância acentuada a temperaturas extremas; calor excessivo ou frio moderado alteram meu humor e me deixam sem energia.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Determinadas texturas de alimentos (gosmentos, muito fibrosos ou secos) me provocam aflição sensorial na boca.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Após passar algumas horas em locais com muito estímulo (supermercados, shoppings, festas ou aeroportos), sinto uma exaustão desmedida.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Quando meu dia é repleto de barulho e demandas, sinto uma necessidade inegociável de me fechar em um quarto escuro e em silêncio absoluto para me recuperar.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Em ambientes muito movimentados, começo a me sentir confuso, com a mente lenta, como se meu cérebro estivesse sofrendo \u0027travamento de sistema\u0027.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Costumo usar fones com cancelamento de ruído, óculos escuros ou outros recursos de proteção para suportar o transporte ou a rua.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "As pessoas ao meu redor frequentemente comentam que sou \u0027exagerado\u0027, \u0027fresco\u0027 ou \u0027sensível demais\u0027 com coisas que parecem não incomodar ninguém.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  32,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  48,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  62,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  75,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "RUMINACAO",
        "code":  "",
        "shortTitle":  "Escala de Ruminação Mental e Pensamentos I...",
        "fullTitle":  "Escala de Ruminação Mental e Pensamentos Intrusivos",
        "cardDescription":  "16 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Humor \u0026 Existencial",
        "icon":  "sun",
        "accentColor":  "emerald",
        "protocolPrefix":  "DM-HUM-",
        "instruction":  "Indique com que frequência você se percebe reagindo aos seus pensamentos da forma descrita abaixo quando se sente triste, estressado ou sobrecarregado. Responda com base nas últimas semanas . Este instrumento é 100% confidencial e calculado localmente.",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Fico pensando repetidamente no quanto estou desmotivado, sem energia ou sem forças para cumprir minhas tarefas.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Fico analisando minuciosamente o quanto me sinto triste ou vazio por dentro, esperando o sentimento passar para agir.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Isolo-me fisicamente e passo horas deitado ou sentado apenas repassando o meu estado de cansaço mental.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Penso com frequência: \u0027É impossível me concentrar quando me sinto tão sobrecarregado assim\u0027.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Pergunto-me obsessivamente: \u0027Por que isso sempre acontece comigo e não com as outras pessoas?\u0027",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Fico repassando na mente conversas ou erros de anos atrás, pensando no que eu \u0027deveria ter dito ou feito\u0027.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Busco incessantemente encontrar \u0027a causa exata\u0027 de uma decepção antes de conseguir seguir em frente.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Sinto revolta e fico repassando mentalmente injustiças que cometeram contra mim no passado.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Cenários de tragédias repentinas ou fracassos humilhantes invadem minha mente sem aviso prévio.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Tenho pensamentos bizarros ou perturbadores e fico assustado achando que eles dizem algo sobre quem eu realmente sou.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Quando tento relaxar ou deitar para dormir, sou bombardeado por imagens ou preocupações incontroláveis.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Tento expulsar à força um pensamento indesejado e noto que ele volta ainda mais forte e frequente.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Minha voz interior diz com frequência que não sou bom o bastante, competente o suficiente ou digno de respeito.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Adio decisões importantes porque fico preso antecipando todos os possíveis erros e julgamentos alheios.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Comparo minhas fraquezas ocultas com o sucesso aparente dos outros nas redes sociais, sentindo-me inferior.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Passo tanto tempo analisando os problemas na minha cabeça que não sobra energia executiva para resolvê-los na prática.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  34,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  51,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  66,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  80,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "IREP",
        "code":  "",
        "shortTitle":  "IREP (Rigidez Epistêmica e Pensa...)",
        "fullTitle":  "Inventário de Rigidez Epistêmica e Pensamento Crítico (IREP)",
        "cardDescription":  "15 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Metacognição \u0026 Lógica",
        "icon":  "brain",
        "accentColor":  "blue",
        "protocolPrefix":  "DM-MET-",
        "instruction":  "Orientações de Preenchimento: Responda a cada uma das 15 afirmações indicando o quanto ela representa seu padrão real de pensamento na maior parte das discussões e análises cotidianas. Seja sincero: o objetivo não é ter uma pontuação perfeita, mas identificar potenciais pontos...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Costumo buscar ativamente artigos ou especialistas que discordam da minha opinião antes de formar uma convicção sólida.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Quando encontro uma notícia ou dado que contradiz o que penso, minha primeira reação é desqualificar a fonte como tendenciosa.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  true
                      },
                      {
                          "id":  3,
                          "text":  "Gosto de me perguntar: \u0027Qual seria o argumento mais inteligente e justo que meus oponentes usariam contra mim?\u0027.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Em temas polêmicos, prefiro consumir apenas canais, jornais ou perfis que confirmem o que eu já acredito.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  true
                      },
                      {
                          "id":  5,
                          "text":  "Se alguém me apresenta uma evidência estatística ou científica rigorosa contrária à minha crença, sou capaz de mudar de posição prontamente.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Sinto uma pontada física de raiva ou desconforto quando alguém critica duramente uma ideia que defendo com paixão.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  true
                      },
                      {
                          "id":  7,
                          "text":  "Consigo separar com clareza o meu valor como ser humano das teorias ou pontos de vista intelectuais que sustento.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Admitir que cometi um erro de julgamento em público me causa uma sensação profunda de humilhação e fraqueza.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  true
                      },
                      {
                          "id":  9,
                          "text":  "Para mim, ser corrigido por outra pessoa é um ganho de clareza mental, e não uma derrota moral pessoal.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Mesmo quando percebo no meio de um debate que estou sem argumentos, continuo defendendo minha tese apenas para não \u0027dar o braço a torcer\u0027.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  true
                      },
                      {
                          "id":  11,
                          "text":  "Tenho facilidade e tranquilidade em dizer abertamente: \u0027Eu não sei sobre esse assunto, preciso estudar mais\u0027.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Tenho tendência a opinar com extrema certeza sobre assuntos complexos de que tive pouco contato aprofundado.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  true
                      },
                      {
                          "id":  13,
                          "text":  "Reconheço que a realidade é cheia de nuances e que a maioria dos problemas não possui respostas simples em preto e branco.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Acredito sinceramente que quem discorda das minhas posições mais básicas é mal-intencionado ou ingênuo.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  true
                      },
                      {
                          "id":  15,
                          "text":  "Mantenho a curiosidade viva para rever ideias que defendi no passado e atualizar meus modelos mentais.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  32,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  48,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  62,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  75,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "ERQ",
        "code":  "",
        "shortTitle":  "Teste de Regulação Emocional (ERQ)",
        "fullTitle":  "Teste de Regulação Emocional (ERQ)",
        "cardDescription":  "10 itens (2 dim.). Reappraisal, Suppression.",
        "category":  "Regulação Emocional",
        "icon":  "compass",
        "accentColor":  "teal",
        "protocolPrefix":  "DM-REG-",
        "instruction":  "Leia cada afirmação com atenção e assinale a opção que melhor representa sua experiência habitual.",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Discordo um pouco",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Neutro",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo um pouco",
                            "desc":  ""
                        },
                        {
                            "value":  6,
                            "label":  "Concordo",
                            "desc":  ""
                        },
                        {
                            "value":  7,
                            "label":  "Concordo totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "reappraisal",
                              "label":  "Reappraisal",
                              "desc":  "Dimensão Reappraisal.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "suppression",
                              "label":  "Suppression",
                              "desc":  "Dimensão Suppression.",
                              "color":  "bg-indigo-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando quero sentir mais emoções positivas (como alegria ou diversão), eu mudo a maneira como estou pensando sobre a situação.",
                          "domain":  "reappraisal",
                          "domainLabel":  "Reappraisal",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Eu controlo minhas emoções não as expressando.",
                          "domain":  "suppression",
                          "domainLabel":  "Suppression",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Quando estou diante de uma situação estressante, eu me faço pensar sobre ela de uma forma que me ajude a ficar calmo(a).",
                          "domain":  "reappraisal",
                          "domainLabel":  "Reappraisal",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Quando sinto emoções positivas, eu tenho o cuidado de não expressá-las.",
                          "domain":  "suppression",
                          "domainLabel":  "Suppression",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Quando quero sentir menos emoções negativas (como tristeza ou raiva), eu mudo a maneira como estou pensando sobre a situação.",
                          "domain":  "reappraisal",
                          "domainLabel":  "Reappraisal",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Eu controlo minhas emoções mudando a forma como penso sobre a situação em que estou.",
                          "domain":  "reappraisal",
                          "domainLabel":  "Reappraisal",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Quando sinto emoções negativas, eu me certifico de não as demonstrar.",
                          "domain":  "suppression",
                          "domainLabel":  "Suppression",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Quando quero sentir mais emoções positivas, eu mudo o que estou pensando.",
                          "domain":  "reappraisal",
                          "domainLabel":  "Reappraisal",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Eu guardo minhas emoções para mim mesmo(a).",
                          "domain":  "suppression",
                          "domainLabel":  "Suppression",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Quando quero sentir menos emoções negativas, eu mudo o que estou pensando.",
                          "domain":  "reappraisal",
                          "domainLabel":  "Reappraisal",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  27,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  43,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  57,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  70,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "PROCRASTINACAO",
        "code":  "",
        "shortTitle":  "Escala de Nível de Procrastinação",
        "fullTitle":  "Escala de Nível de Procrastinação",
        "cardDescription":  "12 itens (4 dim.). Behavior, Emotion, Cognition.",
        "category":  "Cognição \u0026 Funções Executivas",
        "icon":  "cpu",
        "accentColor":  "indigo",
        "protocolPrefix":  "DM-COG-",
        "instruction":  "Leia cada afirmação com atenção e assinale a opção que melhor representa sua experiência habitual.",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Raramente ou nunca",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Quase sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "behavior",
                              "label":  "Behavior",
                              "desc":  "Dimensão Behavior.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "emotion",
                              "label":  "Emotion",
                              "desc":  "Dimensão Emotion.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "cognition",
                              "label":  "Cognition",
                              "desc":  "Dimensão Cognition.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "consequence",
                              "label":  "Consequence",
                              "desc":  "Dimensão Consequence.",
                              "color":  "bg-rose-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Eu adio o início de tarefas que preciso fazer.",
                          "domain":  "behavior",
                          "domainLabel":  "Behavior",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Muitas vezes, me pego realizando tarefas de baixa prioridade em vez daquelas que realmente importam.",
                          "domain":  "behavior",
                          "domainLabel":  "Behavior",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Quando tenho um prazo, costumo esperar até o último minuto para começar.",
                          "domain":  "behavior",
                          "domainLabel":  "Behavior",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Mesmo quando começo uma tarefa, me distraio facilmente com outras coisas.",
                          "domain":  "behavior",
                          "domainLabel":  "Behavior",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Eu me sinto culpado(a) ou ansioso(a) por não estar fazendo as tarefas que deveria.",
                          "domain":  "emotion",
                          "domainLabel":  "Emotion",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Eu digo a mim mesmo(a) \u0027farei isso amanhã\u0027, mesmo sabendo que seria melhor fazer hoje.",
                          "domain":  "cognition",
                          "domainLabel":  "Cognition",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "A procrastinação já me causou problemas (ex: notas mais baixas, estresse no trabalho, conflitos).",
                          "domain":  "consequence",
                          "domainLabel":  "Consequence",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Tenho dificuldade em tomar decisões, e isso me leva a adiar as coisas.",
                          "domain":  "cognition",
                          "domainLabel":  "Cognition",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Eu evito tarefas porque tenho medo de não fazê-las bem o suficiente (perfeccionismo).",
                          "domain":  "cognition",
                          "domainLabel":  "Cognition",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Eu evito tarefas porque as acho chatas ou desagradáveis.",
                          "domain":  "emotion",
                          "domainLabel":  "Emotion",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Minha produtividade é muito inconsistente; tenho picos de atividade e longos períodos de inércia.",
                          "domain":  "behavior",
                          "domainLabel":  "Behavior",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Eu me sinto sobrecarregado(a) com a quantidade de coisas que tenho para fazer, e isso me paralisa.",
                          "domain":  "emotion",
                          "domainLabel":  "Emotion",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  22,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  32,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  40,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  48,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "FUNCOES_EXECUTIVAS",
        "code":  "",
        "shortTitle":  "Rastreio de Funções Executivas (BRIEF-A )",
        "fullTitle":  "Rastreio de Funções Executivas (BRIEF-A )",
        "cardDescription":  "20 itens (8 dim.). Inibitório, Flexibilidade, Emocional.",
        "category":  "Cognição \u0026 Funções Executivas",
        "icon":  "cpu",
        "accentColor":  "indigo",
        "protocolPrefix":  "DM-COG-",
        "instruction":  "Leia cada afirmação com atenção e assinale a opção que melhor representa sua experiência habitual.",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Nunca",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Frequentemente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "inibitório",
                              "label":  "Inibitório",
                              "desc":  "Dimensão Inibitório.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "flexibilidade",
                              "label":  "Flexibilidade",
                              "desc":  "Dimensão Flexibilidade.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "emocional",
                              "label":  "Emocional",
                              "desc":  "Dimensão Emocional.",
                              "color":  "bg-amber-600"
                          },
                          {
                              "id":  "iniciação",
                              "label":  "Iniciação",
                              "desc":  "Dimensão Iniciação.",
                              "color":  "bg-rose-600"
                          },
                          {
                              "id":  "memória de trabalho",
                              "label":  "Memória De Trabalho",
                              "desc":  "Dimensão Memória De Trabalho.",
                              "color":  "bg-purple-600"
                          },
                          {
                              "id":  "organização",
                              "label":  "Organização",
                              "desc":  "Dimensão Organização.",
                              "color":  "bg-blue-600"
                          },
                          {
                              "id":  "planejamento",
                              "label":  "Planejamento",
                              "desc":  "Dimensão Planejamento.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "monitoramento",
                              "label":  "Monitoramento",
                              "desc":  "Dimensão Monitoramento.",
                              "color":  "bg-indigo-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Tenho dificuldade em resistir a impulsos (ex: compras, comida, interrupções).",
                          "domain":  "inibitório",
                          "domainLabel":  "Inibitório",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Falo ou ajo sem pensar e depois me arrependo.",
                          "domain":  "inibitório",
                          "domainLabel":  "Inibitório",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Fico facilmente irritado(a) com pequenas coisas.",
                          "domain":  "inibitório",
                          "domainLabel":  "Inibitório",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Tenho dificuldade em mudar de uma tarefa para outra.",
                          "domain":  "flexibilidade",
                          "domainLabel":  "Flexibilidade",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Fico preso(a) em uma única maneira de resolver um problema.",
                          "domain":  "flexibilidade",
                          "domainLabel":  "Flexibilidade",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Fico chateado(a) com mudanças inesperadas nos planos.",
                          "domain":  "flexibilidade",
                          "domainLabel":  "Flexibilidade",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Minhas reações emocionais são, às vezes, mais intensas do que a situação justifica.",
                          "domain":  "emocional",
                          "domainLabel":  "Emocional",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Tenho dificuldade em me acalmar depois de ficar chateado(a).",
                          "domain":  "emocional",
                          "domainLabel":  "Emocional",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Tenho dificuldade para começar tarefas, mesmo as importantes (procrastinação).",
                          "domain":  "iniciação",
                          "domainLabel":  "Iniciação",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Preciso de um empurrão para começar a fazer as coisas.",
                          "domain":  "iniciação",
                          "domainLabel":  "Iniciação",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Esqueço o que ia fazer ou dizer no meio de uma ação.",
                          "domain":  "memória de trabalho",
                          "domainLabel":  "Memória De Trabalho",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Tenho que reler a mesma página várias vezes para entender.",
                          "domain":  "memória de trabalho",
                          "domainLabel":  "Memória De Trabalho",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Perco a linha de raciocínio durante conversas.",
                          "domain":  "memória de trabalho",
                          "domainLabel":  "Memória De Trabalho",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Minha mesa, quarto ou local de trabalho são desorganizados.",
                          "domain":  "organização",
                          "domainLabel":  "Organização",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Tenho dificuldade em dividir uma tarefa grande em passos menores.",
                          "domain":  "planejamento",
                          "domainLabel":  "Planejamento",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Perco coisas com frequência (chaves, celular, documentos).",
                          "domain":  "organização",
                          "domainLabel":  "Organização",
                          "reverse":  false
                      },
                      {
                          "id":  17,
                          "text":  "Subestimo o tempo necessário para completar uma tarefa.",
                          "domain":  "planejamento",
                          "domainLabel":  "Planejamento",
                          "reverse":  false
                      },
                      {
                          "id":  18,
                          "text":  "Não percebo como meu comportamento afeta os outros até que alguém me diga.",
                          "domain":  "monitoramento",
                          "domainLabel":  "Monitoramento",
                          "reverse":  false
                      },
                      {
                          "id":  19,
                          "text":  "Cometo erros por descuido em tarefas que sei fazer bem.",
                          "domain":  "monitoramento",
                          "domainLabel":  "Monitoramento",
                          "reverse":  false
                      },
                      {
                          "id":  20,
                          "text":  "Só percebo que cometi um erro depois que já é tarde demais.",
                          "domain":  "monitoramento",
                          "domainLabel":  "Monitoramento",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  31,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  42,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  51,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  60,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "FRUSTRACAO",
        "code":  "",
        "shortTitle":  "Escala de Tolerância à Frustração e Impuls...",
        "fullTitle":  "Escala de Tolerância à Frustração e Impulsividade",
        "cardDescription":  "16 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Regulação Emocional",
        "icon":  "compass",
        "accentColor":  "teal",
        "protocolPrefix":  "DM-REG-",
        "instruction":  "Para cada uma das 16 afirmações abaixo, selecione a alternativa que melhor descreve o seu padrão típico de comportamento nas últimas semanas. Não existem respostas certas ou erradas. Responda com honestidade para obter um perfil neuropsicológico representativo.",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando uma tarefa começa a parecer chata ou desconfortável, sinto uma vontade quase incontrolável de largá-la imediatamente.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Tenho muita dificuldade em tolerar o tédio ou momentos em que nada estimulante está acontecendo.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Se algo exige esforço repetitivo sem recompensa à vista, perco rapidamente a paciência.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Prefiro desistir de um objetivo a suportar longos períodos de desconforto emocional ou físico.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Quando fico com raiva ou frustrado, ajo por impulso e falo coisas das quais me arrependo logo em seguida.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Diante de uma contrariedade ou decepção, sinto uma urgência avassaladora de fazer algo imediato para aliviar o sentimento.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Quando me sinto rejeitado ou criticado, perco a capacidade de pensar com clareza e reajo defensivamente.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Costumo descontar meu estresse em hábitos impulsivos (comida rápida, compras, telas ou tabaco).",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Tomo decisões importantes no calor do momento sem pesar adequadamente as consequências futuras.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Interrompo outras pessoas enquanto falam porque acho que vou esquecer o que ia dizer ou sinto urgência de responder.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Frequentemente compro coisas por impulso sem checar se realmente preciso delas ou se cabem no orçamento.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Entro em conflitos ou discussões desnecessárias simplesmente por não conseguir respirar antes de retrucar.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Fico desproporcionalmente irritado quando coisas cotidianas (filas, trânsito, sites lentos) me fazem esperar.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Tenho a sensação íntima de que a vida e as outras pessoas não deveriam ser tão difíceis ou lentas comigo.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Quando planejo algo e sai dos trilhos, sinto como se o universo estivesse sendo injusto comigo.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Custa-me muito aceitar que nem todos os meus desejos e ideias serão acatados no momento em que proponho.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  34,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  51,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  66,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  80,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EFP_ACT",
        "code":  "",
        "shortTitle":  "EFP-ACT (Flexibilidade Psicológica...)",
        "fullTitle":  "Escala de Flexibilidade Psicológica e Desfusão (EFP-ACT)",
        "cardDescription":  "15 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Cognição \u0026 Funções Executivas",
        "icon":  "cpu",
        "accentColor":  "indigo",
        "protocolPrefix":  "DM-COG-",
        "instruction":  "Para cada uma das 15 afirmações abaixo, selecione o grau de concordância com base em como você costuma se relacionar com seus pensamentos, angústias e decisões no seu dia a dia. Seja honesto consigo mesmo: não há respostas certas ou erradas. O teste é 100% privado e calculado...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Gasto uma quantidade enorme de energia tentando suprimir, esquecer ou evitar pensamentos e memórias que me causam angústia.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Muitas vezes deixo de fazer coisas que são importantes para mim simplesmente para não ter que lidar com a ansiedade ou o desconforto que elas despertam.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Acredito que preciso me livrar completamente das minhas inseguranças antes de poder ter uma vida plena ou dar passos significativos.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Recorro frequentemente a distrações compulsivas (telas, comida, trabalho excessivo) para não ter que encarar o que estou sentindo no peito.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Tenho medo dos meus próprios sentimentos dolorosos e sinto que, se permitir que eles venham, serei destruído por eles.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Quando minha mente diz coisas como \u0027você não é capaz\u0027 ou \u0027vai dar tudo errado\u0027, eu acredito imediatamente nisso como um fato inquestionável.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Costumo me perder nas minhas próprias preocupações e ruminações, esquecendo completamente do que está acontecendo ao meu redor no momento presente.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Sinto-me definido e aprisionado pelas histórias que conto sobre mim mesmo (\u0027sou fraco\u0027, \u0027sempre fui traumatizado\u0027, \u0027sou uma pessoa ansiosa\u0027).",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Fico facilmente emaranhado em discussões mentais intermináveis tentando provar para mim mesmo que estou certo ou prevendo possíveis desastres.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Tenho dificuldade em observar meus pensamentos como meros eventos mentais passageiros; eles parecem ordens urgentes que tenho de obedecer.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Sinto que estou vivendo no piloto automático, reagindo às pressões externas sem saber claramente quais são meus verdadeiros valores de vida.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Costumo abandonar ou adiar projetos e relacionamentos que importam para mim na primeira onda de dificuldade ou desmotivação.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Minhas escolhas diárias são guiadas muito mais pelo medo do fracasso e pela busca de alívio temporário do que por propósitos genuínos.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Tenho clareza do tipo de pessoa que desejo ser, mas minhas ações práticas raramente refletem esses compromissos profundos.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Frequentemente sinto um vazio existencial por perceber que estou apenas sobrevivendo e evitando riscos, em vez de construir uma vida com sentido.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  32,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  48,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  62,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  75,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "ESQUEMAS",
        "code":  "",
        "shortTitle":  "Teste de Esquemas Emocionais",
        "fullTitle":  "Teste de Esquemas Emocionais",
        "cardDescription":  "13 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Trauma \u0026 Esquemas",
        "icon":  "shield-alert",
        "accentColor":  "purple",
        "protocolPrefix":  "DM-TRM-",
        "instruction":  "Leia cada afirmação com atenção e assinale a opção que melhor representa sua experiência habitual.",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Não tem nada a ver comigo",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Parece um pouco comigo",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Parece muito comigo",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Sinto que as pessoas importantes na minha vida não serão capazes de continuar me oferecendo apoio e proteção.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Sinto que as pessoas vão se aproveitar de mim.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Sinto que não pertenço a lugar nenhum; sou diferente dos outros.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Sinto que sou fundamentalmente defeituoso(a) ou que, se os outros me conhecerem de verdade, não vão gostar de mim.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Sinto que sou um fracasso em comparação com os outros.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Sinto que não consigo dar conta das minhas responsabilidades do dia a dia sozinho(a).",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Tenho um medo constante de que uma catástrofe (financeira, médica, etc.) aconteça a qualquer momento.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Sinto que não consigo me separar da minha família ou de um parceiro(a) e ter uma identidade própria.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Frequentemente coloco as necessidades dos outros acima das minhas, a ponto de esquecer o que eu mesmo(a) quero.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Sinto uma pressão enorme para suprimir meus sentimentos e necessidades para evitar a desaprovação dos outros.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Sinto que preciso ser o(a) melhor em tudo que faço; não me permito errar.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Sinto que sou especial e que as regras normais não se aplicam a mim.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Tenho grande dificuldade em aceitar \u0027não\u0027 como resposta e em tolerar frustrações para atingir meus objetivos.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  20,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  27,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  33,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  39,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "DASS_21",
        "code":  "",
        "shortTitle":  "DASS-21 (Ansiedade, Depressão e Est...)",
        "fullTitle":  "Escala de Ansiedade, Depressão e Estresse (DASS-21)",
        "cardDescription":  "21 itens (3 dim.). Ansiedade, Depressão, Estresse.",
        "category":  "Ansiedade \u0026 Estresse",
        "icon":  "activity",
        "accentColor":  "amber",
        "protocolPrefix":  "DM-EST-",
        "instruction":  "Responda a cada item indicando o quanto ele se aplicou a você durante a última semana. Não há respostas certas ou erradas.",
        "options":  [
                        {
                            "value":  0,
                            "label":  "Não se aplicou a mim",
                            "desc":  ""
                        },
                        {
                            "value":  1,
                            "label":  "Aplicou-se em algum grau",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Aplicou-se consideravelmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Aplicou-se muito, ou na maioria das vezes",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "a",
                              "label":  "Ansiedade",
                              "desc":  "Dimensão Ansiedade.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "d",
                              "label":  "Depressão",
                              "desc":  "Dimensão Depressão.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "s",
                              "label":  "Estresse",
                              "desc":  "Dimensão Estresse.",
                              "color":  "bg-amber-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Achei difícil me acalmar.",
                          "domain":  "a",
                          "domainLabel":  "Ansiedade",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Senti minha boca seca.",
                          "domain":  "a",
                          "domainLabel":  "Ansiedade",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Não consegui sentir nenhum sentimento positivo.",
                          "domain":  "d",
                          "domainLabel":  "Depressão",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Tive dificuldade em respirar (ex: respiração ofegante, falta de ar sem ter feito esforço físico).",
                          "domain":  "a",
                          "domainLabel":  "Ansiedade",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Achei difícil ter a iniciativa para fazer as coisas.",
                          "domain":  "d",
                          "domainLabel":  "Depressão",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Tendi a reagir de forma exagerada às situações.",
                          "domain":  "s",
                          "domainLabel":  "Estresse",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Senti tremores (ex: nas mãos).",
                          "domain":  "a",
                          "domainLabel":  "Ansiedade",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Senti que estava usando muita energia nervosa.",
                          "domain":  "s",
                          "domainLabel":  "Estresse",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Preocupei-me com situações em que eu pudesse entrar em pânico e parecer ridículo(a).",
                          "domain":  "a",
                          "domainLabel":  "Ansiedade",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Senti que não tinha nada a esperar do futuro.",
                          "domain":  "d",
                          "domainLabel":  "Depressão",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Senti-me agitado(a).",
                          "domain":  "s",
                          "domainLabel":  "Estresse",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Achei difícil relaxar.",
                          "domain":  "s",
                          "domainLabel":  "Estresse",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Senti-me triste e deprimido(a).",
                          "domain":  "d",
                          "domainLabel":  "Depressão",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Fui intolerante com coisas que me impediam de continuar o que eu estava fazendo.",
                          "domain":  "s",
                          "domainLabel":  "Estresse",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Senti que estava prestes a entrar em pânico.",
                          "domain":  "a",
                          "domainLabel":  "Ansiedade",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "Não consegui me entusiasmar com nada.",
                          "domain":  "d",
                          "domainLabel":  "Depressão",
                          "reverse":  false
                      },
                      {
                          "id":  17,
                          "text":  "Senti que não tinha valor como pessoa.",
                          "domain":  "d",
                          "domainLabel":  "Depressão",
                          "reverse":  false
                      },
                      {
                          "id":  18,
                          "text":  "Senti que estava um pouco emotivo(a) demais.",
                          "domain":  "s",
                          "domainLabel":  "Estresse",
                          "reverse":  false
                      },
                      {
                          "id":  19,
                          "text":  "Eu estava ciente das batidas do meu coração na ausência de esforço físico (ex: sensação de aumento da frequência cardíaca, ou de pular uma batida).",
                          "domain":  "a",
                          "domainLabel":  "Ansiedade",
                          "reverse":  false
                      },
                      {
                          "id":  20,
                          "text":  "Senti-me assustado(a) sem motivo.",
                          "domain":  "a",
                          "domainLabel":  "Ansiedade",
                          "reverse":  false
                      },
                      {
                          "id":  21,
                          "text":  "Senti que a vida não tinha sentido.",
                          "domain":  "d",
                          "domainLabel":  "Depressão",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  18,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  35,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  49,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  63,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "BURNOUT",
        "code":  "",
        "shortTitle":  "Inventário de Sobrecarga e Burnout Clínico",
        "fullTitle":  "Inventário de Sobrecarga e Burnout Clínico",
        "cardDescription":  "12 itens (3 dim.). Exaustão Emocional, Despersonalização, Pe.",
        "category":  "Cognição \u0026 Funções Executivas",
        "icon":  "cpu",
        "accentColor":  "indigo",
        "protocolPrefix":  "DM-COG-",
        "instruction":  "Instrumento estruturado para avaliar sinais de esgotamento físico e mental, despersonalização/cinismo e sensação de ineficácia profissional decorrentes de estresse crônico desregulado.",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "ee",
                              "label":  "Exaustão Emocional",
                              "desc":  "Dimensão Exaustão Emocional.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "dp",
                              "label":  "Despersonalização",
                              "desc":  "Dimensão Despersonalização.",
                              "color":  "bg-indigo-600"
                          },
                          {
                              "id":  "pe",
                              "label":  "Pe",
                              "desc":  "Dimensão Pe.",
                              "color":  "bg-amber-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Sinto-me emocionalmente esgotado e drenado ao final de um dia normal de trabalho.",
                          "domain":  "ee",
                          "domainLabel":  "Exaustão Emocional",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Acordo cansado pela manhã só de pensar em ter que encarar mais uma jornada.",
                          "domain":  "ee",
                          "domainLabel":  "Exaustão Emocional",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Trabalhar em contato direto com pessoas ou demandas tem sido um esforço desgastante além da conta.",
                          "domain":  "ee",
                          "domainLabel":  "Exaustão Emocional",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Sinto que estou operando no meu limite absoluto físico e mental.",
                          "domain":  "ee",
                          "domainLabel":  "Exaustão Emocional",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Tenho me tornado mais frio, cínico ou insensível em relação aos problemas e pedidos das pessoas.",
                          "domain":  "dp",
                          "domainLabel":  "Despersonalização",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Preocupo-me com o fato de o trabalho estar endurecendo meu caráter e minha empatia.",
                          "domain":  "dp",
                          "domainLabel":  "Despersonalização",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Sinto vontade de me isolar e não responder mensagens profissionais mesmo em horário habitual.",
                          "domain":  "dp",
                          "domainLabel":  "Despersonalização",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Tenho a impressão de que trato algumas pessoas como se fossem meros objetos ou tarefas a liquidar.",
                          "domain":  "dp",
                          "domainLabel":  "Despersonalização",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Sinto que meu trabalho já não gera impacto real ou significado verdadeiro.",
                          "domain":  "pe",
                          "domainLabel":  "Pe",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Tenho dificuldade para me alegrar genuinamente quando concluo um projeto com sucesso.",
                          "domain":  "pe",
                          "domainLabel":  "Pe",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Duvido cada vez mais do valor e da qualidade daquilo que entrego.",
                          "domain":  "pe",
                          "domainLabel":  "Pe",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Sinto que estou apenas \u0027apagando incêndios\u0027 em vez de construir algo produtivo.",
                          "domain":  "pe",
                          "domainLabel":  "Pe",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  25,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  38,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  49,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  60,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EAGR",
        "code":  "",
        "shortTitle":  "EAGR (Autoeficácia Geral e Resil...)",
        "fullTitle":  "Escala de Autoeficácia Geral e Resiliência (EAGR)",
        "cardDescription":  "12 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Humor \u0026 Existencial",
        "icon":  "sun",
        "accentColor":  "emerald",
        "protocolPrefix":  "DM-HUM-",
        "instruction":  "Para cada uma das 12 afirmações a seguir, assinale a opção que melhor retrata como você realmente se posiciona diante de desafios, metas e momentos de adversidade. O cálculo é 100% privado, imediato e realizado localmente no seu dispositivo.",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Tenho certeza de que consigo encontrar maneiras de alcançar meus objetivos, mesmo quando os caminhos parecem bloqueados.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Quando me deparo com uma tarefa totalmente nova, sinto confiança de que sou capaz de aprender e executá-la com competência.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Costumo tomar a iniciativa para transformar minhas ideias em ações concretas, sem ficar paralisado esperando aprovação alheia.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Acredito que meu sucesso e bem-estar dependem prioritariamente do meu esforço, planejamento e disciplina diária.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Consigo manter o foco e perseverar em meus projetos mesmo quando os resultados demoram muito mais do que o planejado.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Quando cometo um erro ou sofro uma derrota, consigo me recuperar emocionalmente com relativa rapidez e tentar de novo.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Se alguém se opõe aos meus planos ou critica minhas decisões, encontro recursos internos para manter minhas convicções construtivas.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "As dificuldades e adversidades da vida funcionam para mim como estímulos de aprendizado, e não como motivos para desistir.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Mesmo diante de situações imprevisíveis ou crises súbitas, sou capaz de manter a calma e pensar em soluções práticas.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Quando enfrento um problema complexo, consigo dividi-lo em partes menores e resolver uma etapa de cada vez com lucidez.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Tenho facilidade em pensar em múltiplos planos alternativos (Plano B ou C) caso minha primeira estratégia falhe.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Confio plenamente na minha habilidade de lidar com o inesperado, pois confio nas minhas capacidades de adaptação cognitiva.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  25,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  38,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  49,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  60,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EAC",
        "code":  "",
        "shortTitle":  "Escala de Autocompaixão Clínica (EAC)",
        "fullTitle":  "Escala de Autocompaixão Clínica (EAC)",
        "cardDescription":  "15 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Humor \u0026 Existencial",
        "icon":  "sun",
        "accentColor":  "emerald",
        "protocolPrefix":  "DM-HUM-",
        "instruction":  "Instruções de Preenchimento: Leia atentamente cada uma das 15 afirmações abaixo e assinale a opção que melhor reflete como você costuma agir ou sentir na maior parte do tempo . Não há respostas certas ou erradas; a honestidade absoluta garante uma devolutiva clínica precisa. S...",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Quase Nunca",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Raramente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Quase Sempre",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando passo por momentos muito difíceis, procuro me dar o carinho, a paciência e a atenção de que preciso.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Quando cometo um erro ou algo dá errado, sou excessivamente rígido e implacável em meus julgamentos sobre mim mesmo.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  true
                      },
                      {
                          "id":  3,
                          "text":  "Procuro ser tolerante e compreensivo com meus próprios defeitos, limitações e imperfeições.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Costumo disparar insultos e pensamentos de desqualificação contra mim quando percebo que falhei em algo importante.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  true
                      },
                      {
                          "id":  5,
                          "text":  "Em vez de me punir quando as coisas não saem como planejado, procuro agir como meu próprio aliado protetor.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Quando estou me sentindo para baixo ou fracassado, costumo achar que todo mundo está feliz e que só eu sou um desastre.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  true
                      },
                      {
                          "id":  7,
                          "text":  "Lembro a mim mesmo que passar por crises, dúvidas e dores emocionais faz parte da vida de qualquer ser humano.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Tenho uma sensação de profunda vergonha e isolamento quando me deparo com minhas próprias vulnerabilidades.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  true
                      },
                      {
                          "id":  9,
                          "text":  "Procuro encarar minhas dificuldades pessoais como parte natural da condição humana, e não como uma falha moral exclusiva minha.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Quando algo doloroso acontece comigo, costumo pensar: \u0027Por que isso sempre tem que acontecer só comigo?\u0027.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  true
                      },
                      {
                          "id":  11,
                          "text":  "Quando algo me chateia, consigo reconhecer minhas emoções com curiosidade e equilíbrio, sem tentar fingir que nada aconteceu.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Quando me sinto triste ou frustrado, sou completamente engolido por esses sentimentos a ponto de perder a perspectiva.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  true
                      },
                      {
                          "id":  13,
                          "text":  "Consigo observar uma dor emocional presente como um estado passageiro, sem transformá-la no centro da minha identidade.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Costumo remoer obsessivamente erros do passado, aumentando a gravidade do problema na minha cabeça.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  true
                      },
                      {
                          "id":  15,
                          "text":  "Mantenho a mente aberta para aceitar que momentos de frustração vão passar, sem me desesperar de imediato.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  32,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  48,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  62,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  75,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "ATENCAO",
        "code":  "",
        "shortTitle":  "Como está sua Atenção?",
        "fullTitle":  "Como está sua Atenção?",
        "cardDescription":  "8 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Cognição \u0026 Funções Executivas",
        "icon":  "cpu",
        "accentColor":  "indigo",
        "protocolPrefix":  "DM-COG-",
        "instruction":  "Leia cada afirmação com atenção e assinale a opção que melhor representa sua experiência habitual.",
        "options":  [
                        {
                            "value":  3,
                            "label":  "Frequentemente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Às vezes",
                            "desc":  ""
                        },
                        {
                            "value":  1,
                            "label":  "Raramente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Com que frequência você comete erros por descuido em tarefas do dia a dia?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Tem dificuldade para manter a atenção em tarefas ou atividades?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Parece não escutar quando falam diretamente com você?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Não segue instruções ou não termina tarefas?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Tem dificuldade para organizar tarefas e atividades?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Evita ou se sente relutante em se envolver em tarefas que exigem esforço mental prolongado?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Perde objetos necessários para tarefas (chaves, celular, etc)?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Distrai-se facilmente com estímulos externos?",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  12,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  17,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  20,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  24,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "IAL",
        "code":  "",
        "shortTitle":  "IAL (Assertividade e Limites In...)",
        "fullTitle":  "Inventário de Assertividade e Limites Interpessoais (IAL)",
        "cardDescription":  "15 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Relacionamentos \u0026 Apego",
        "icon":  "users",
        "accentColor":  "rose",
        "protocolPrefix":  "DM-REL-",
        "instruction":  "Leia atentamente as 15 situações do cotidiano e assinale a frequência com que cada afirmação reflete seu comportamento habitual nas relações pessoais e profissionais. Seja sincero: o teste é 100% privado e calculado exclusivamente no seu navegador.",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Tenho grande dificuldade em recusar convites ou pedidos de favores, mesmo quando estou sobrecarregado ou sem tempo.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Concordo em assumir tarefas que não quero fazer por medo de que as pessoas fiquem magoadas, com raiva ou me achem egoísta.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Se um vendedor ou conhecido for insistente, sinto-me constrangido e acabo cedendo só para me livrar do desconforto da recusa.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Permito que colegas ou familiares invadam meu espaço pessoal ou meus horários de descanso sem expressar meu descontentamento.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Quando alguém me pede um favor abusivo, prefiro inventar desculpas mirabolantes em vez de dizer um \u0027não\u0027 simples e sereno.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Quando discordo da opinião da maioria em um grupo ou reunião de trabalho, prefiro me calar e fingir que concordo para evitar tensão.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Se um produto ou serviço vier errado (ex: comida fria ou cobrança indevida), prefiro não reclamar e arcar com o prejuízo.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Sinto vergonha ou desconforto intenso ao precisar pedir ajuda quando estou com dificuldades emocionais ou de trabalho.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Guardo mágoas e ressentimentos em silêncio por semanas em vez de ter uma conversa franca e respeitosa com a pessoa envolvida.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Se alguém cometer uma grosseria comigo, travo no momento e só horas depois fico ruminando mentalmente o que eu \u0027deveria ter dito\u0027.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Acumulo desconfortos em silêncio por muito tempo até que, por um motivo banal, explodo com grosseria ou sarcasmo desproporcional.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Sinto uma culpa profunda e corrosiva logo após me posicionar com firmeza diante de alguém que amo ou respeito.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Tenho o receio constante de que impor limites claros faça com que as pessoas se afastem ou deixem de gostar de mim.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Diante de um desentendimento, costumo pedir desculpas apressadas mesmo quando tenho certeza de que não fiz nada de errado.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Costumo colocar as vontades e necessidades de todas as outras pessoas em primeiro lugar, negligenciando meu próprio bem-estar.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  32,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  48,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  62,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  75,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "APEGO",
        "code":  "",
        "shortTitle":  "Teste de Estilo de Apego Adulto",
        "fullTitle":  "Teste de Estilo de Apego Adulto",
        "cardDescription":  "32 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Relacionamentos \u0026 Apego",
        "icon":  "users",
        "accentColor":  "rose",
        "protocolPrefix":  "DM-REL-",
        "instruction":  "Leia cada afirmação com atenção e assinale a opção que melhor representa sua experiência habitual.",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Sinto-me à vontade e valorizo a conexão próxima.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Preocupo-me que meu parceiro(a) não queira ser tão próximo(a) quanto eu gostaria.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Sinto-me um pouco desconfortável e prefiro manter certa independência.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Desejo muito a intimidade, mas ao mesmo tempo tenho medo de me machucar.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Respeitar sua necessidade, confiando que isso não afeta nosso vínculo.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Sentir ansiedade e medo de que seja um sinal de que ele(a) está se afastando.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Sentir um certo alívio e aproveitar a oportunidade para ter meu próprio espaço.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Ficar confuso(a) e inseguro(a), sem saber se devo me aproximar ou me afastar.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Tentar comunicar meus sentimentos e entender o ponto de vista do outro para resolver o problema.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Ficar muito reativo(a) emocionalmente e ter medo de que o conflito leve ao abandono.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Me fechar ou me afastar para evitar o confronto direto.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Reagir de forma imprevisível, às vezes com raiva, outras vezes me retraindo completamente.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Sinto-me confortável com a interdependência mútua em um relacionamento.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Gosto quando os outros dependem de mim, mas me preocupo se posso depender deles.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Prefiro ser autossuficiente e não gosto da ideia de depender de alguém.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  16,
                          "text":  "É uma ideia que me assusta e me atrai ao mesmo tempo; é complicado.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  17,
                          "text":  "Procuro meu parceiro(a) ou amigos próximos para obter conforto e apoio.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  18,
                          "text":  "Busco intensamente o apoio dos outros, mas me preocupo em ser um fardo.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  19,
                          "text":  "Prefiro lidar com meus problemas sozinho(a), sem envolver outras pessoas.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  20,
                          "text":  "Hesito em procurar apoio, pois não sei que tipo de reação vou receber.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  21,
                          "text":  "Uma fonte de segurança, crescimento e felicidade, apesar dos desafios.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  22,
                          "text":  "O centro da minha vida, mas também uma fonte constante de preocupação e insegurança.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  23,
                          "text":  "Importantes, mas não devem comprometer minha liberdade e individualidade.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  24,
                          "text":  "Confusos, imprevisíveis e potencialmente dolorosos.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  25,
                          "text":  "Sinto a dor, mas confio na minha capacidade de me recuperar e encontrar a felicidade novamente.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  26,
                          "text":  "Sinto-me devastado(a) e questiono meu próprio valor, demorando muito para superar.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  27,
                          "text":  "Sinto-me mais aliviado(a) do que triste e foco rapidamente em outras áreas da minha vida.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  28,
                          "text":  "Sinto uma montanha-russa de emoções intensas e contraditórias, demorando a encontrar estabilidade.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  29,
                          "text":  "Faço de forma aberta e direta, esperando que sejam considerados.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  30,
                          "text":  "Faço, mas com receio de parecer carente ou exigente demais.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  31,
                          "text":  "Tenho dificuldade em fazer; prefiro não \u0027incomodar\u0027 ou criar expectativas.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      },
                      {
                          "id":  32,
                          "text":  "Não tenho clareza sobre minhas próprias necessidades, ou tenho medo de expressá-las.",
                          "domain":  "geral",
                          "domainLabel":  "geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  68,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  102,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  132,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  160,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "EASE",
        "code":  "",
        "shortTitle":  "EASE (Ansiedade Social e Evasão...)",
        "fullTitle":  "Escala de Ansiedade Social e Evasão Afetiva (EASE)",
        "cardDescription":  "15 itens. Escala clínica do acervo de testes espelhada para aplicação trancada.",
        "category":  "Relacionamentos \u0026 Apego",
        "icon":  "users",
        "accentColor":  "rose",
        "protocolPrefix":  "DM-REL-",
        "instruction":  "Para cada uma das 15 afirmações abaixo, selecione a opção que melhor descreve como você se sentiu e se comportou nas últimas duas semanas diante de situações sociais (reuniões, conversas, apresentações, encontros ou interações com desconhecidos). Seja sincero: não há respostas...",
        "options":  [
                        {
                            "value":  0,
                            "label":  "0 Nada",
                            "desc":  ""
                        },
                        {
                            "value":  1,
                            "label":  "1 Leve",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "2 Moderado",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "3 Intenso",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "4 Extremo",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
    
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Sinto meu coração acelerar, garganta seca ou mãos trêmulas quando preciso falar com alguém que não conheço bem.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Tenho receio de ficar visivelmente vermelho(a), suar ou demonstrar que estou nervoso(a) diante dos outros.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Sinto um aperto no estômago, náusea ou desconforto visceral horas antes de participar de um evento social.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Minha voz falha, oscila ou soa trêmula quando preciso expressar uma opinião em grupo.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Sinto uma tensão muscular generalizada (mandíbula travada, ombros rígidos) apenas por estar cercado de pessoas.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Tenho a sensação constante de que as pessoas estão prestando atenção nas minhas falhas ou me avaliando criticamente.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Depois de interagir socialmente, fico repassando mentalmente a conversa por horas, punindo-me pelo que disse ou deixei de dizer.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Tenho pavor de passar vergonha, parecer ridículo(a) ou dizer algo inadequado em público.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Costumo presumir que os outros estão desinteressados ou secretamente entediados quando falo com eles.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Sinto que qualquer erro social que eu cometa destruirá de forma irreversível a imagem que as pessoas têm de mim.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  11,
                          "text":  "Já cancelei compromissos importantes ou deixei de ir a encontros sociais simplesmente para não ter que interagir.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  12,
                          "text":  "Evito sustentar contato visual direto com as pessoas porque sinto que meu olhar me deixa vulnerável ou exposto(a).",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  13,
                          "text":  "Prefiro me calar e fingir concordância a expressar uma opinião discordante que possa gerar confronto ou atenção sobre mim.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  14,
                          "text":  "Uso o smartphone, fones de ouvido ou fico isolado em cantos de salas para evitar que alguém se aproxime para conversar.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      },
                      {
                          "id":  15,
                          "text":  "Deixo de frequentar cursos, oportunidades de trabalho ou lugares que gosto para não ter que interagir com outras pessoas.",
                          "domain":  "geral",
                          "domainLabel":  "Geral",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  17,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  33,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  47,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  60,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    },
    {
        "id":  "ESC_REGULACAO_EMOCIONAL",
        "code":  "",
        "shortTitle":  "Escala de Regulação Emocional (ERQ)",
        "fullTitle":  "Escala de Regulação Emocional (ERQ)",
        "cardDescription":  "10 itens (2 dim.). Cr, Es.",
        "category":  "Regulação Emocional",
        "icon":  "compass",
        "accentColor":  "teal",
        "protocolPrefix":  "DM-REG-",
        "instruction":  "Leia cada afirmação com atenção e assinale a opção que melhor representa sua experiência habitual.",
        "options":  [
                        {
                            "value":  1,
                            "label":  "Discordo Totalmente",
                            "desc":  ""
                        },
                        {
                            "value":  2,
                            "label":  "Discordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  3,
                            "label":  "Neutro / Às Vezes",
                            "desc":  ""
                        },
                        {
                            "value":  4,
                            "label":  "Concordo Parcialmente",
                            "desc":  ""
                        },
                        {
                            "value":  5,
                            "label":  "Concordo Totalmente",
                            "desc":  ""
                        }
                    ],
        "subscales":  [
                          {
                              "id":  "cr",
                              "label":  "Cr",
                              "desc":  "Dimensão Cr.",
                              "color":  "bg-teal-600"
                          },
                          {
                              "id":  "es",
                              "label":  "Es",
                              "desc":  "Dimensão Es.",
                              "color":  "bg-indigo-600"
                          }
                      ],
        "items":  [
                      {
                          "id":  1,
                          "text":  "Quando quero sentir mais emoções positivas (como alegria ou entusiasmo), eu mudo a forma como penso sobre a situação.",
                          "domain":  "cr",
                          "domainLabel":  "Cr",
                          "reverse":  false
                      },
                      {
                          "id":  2,
                          "text":  "Eu guardo minhas emoções para mim mesmo(a).",
                          "domain":  "es",
                          "domainLabel":  "Es",
                          "reverse":  false
                      },
                      {
                          "id":  3,
                          "text":  "Quando quero sentir menos emoções negativas (como tristeza ou raiva), eu mudo a forma como penso sobre a situação.",
                          "domain":  "cr",
                          "domainLabel":  "Cr",
                          "reverse":  false
                      },
                      {
                          "id":  4,
                          "text":  "Quando estou sentindo emoções positivas, tomo cuidado para não demonstrá-las.",
                          "domain":  "es",
                          "domainLabel":  "Es",
                          "reverse":  false
                      },
                      {
                          "id":  5,
                          "text":  "Quando me deparo com uma situação estressante, eu me forço a pensar nela de uma forma que me ajude a manter a calma.",
                          "domain":  "cr",
                          "domainLabel":  "Cr",
                          "reverse":  false
                      },
                      {
                          "id":  6,
                          "text":  "Eu controlo minhas emoções não expressando o que realmente estou sentindo.",
                          "domain":  "es",
                          "domainLabel":  "Es",
                          "reverse":  false
                      },
                      {
                          "id":  7,
                          "text":  "Quando quero sentir mais emoções positivas, eu mudo o que a situação significa para mim.",
                          "domain":  "cr",
                          "domainLabel":  "Cr",
                          "reverse":  false
                      },
                      {
                          "id":  8,
                          "text":  "Eu controlo minhas emoções mudando a maneira como interpreto a situação em que me encontro.",
                          "domain":  "cr",
                          "domainLabel":  "Cr",
                          "reverse":  false
                      },
                      {
                          "id":  9,
                          "text":  "Quando estou sentindo emoções negativas, eu me esforço para não deixar transparecer.",
                          "domain":  "es",
                          "domainLabel":  "Es",
                          "reverse":  false
                      },
                      {
                          "id":  10,
                          "text":  "Quando quero sentir menos emoções negativas, eu tento mudar a forma como penso sobre o evento.",
                          "domain":  "cr",
                          "domainLabel":  "Cr",
                          "reverse":  false
                      }
                  ],
        "cutoffs":  [
                        {
                            "max":  21,
                            "label":  "Nível Baixo / Funcionalidade Preservada",
                            "badgeClass":  "bg-emerald-100 text-emerald-800 border-emerald-300",
                            "summary":  "Os indicadores avaliados situam-se na faixa basal ou adaptativa, sem evidência de sobrecarga clínica acentuada no momento."
                        },
                        {
                            "max":  32,
                            "label":  "Nível Leve a Moderado / Atenção Preventiva",
                            "badgeClass":  "bg-yellow-100 text-yellow-800 border-yellow-300",
                            "summary":  "Observam-se traços ou sintomas de intensidade leve a moderada que merecem monitoramento clínico e estratégias preventivas de regulação."
                        },
                        {
                            "max":  41,
                            "label":  "Nível Elevado / Impacto Funcional Relevante",
                            "badgeClass":  "bg-orange-100 text-orange-800 border-orange-300",
                            "summary":  "O padrão de respostas evidencia intensidade elevada com provável repercussão sobre o funcionamento emocional, cognitivo ou relacional, sugerindo intervenção clínica direcionada."
                        },
                        {
                            "max":  50,
                            "label":  "Nível Muito Elevado / Prioridade Clínica",
                            "badgeClass":  "bg-red-100 text-red-800 border-red-300",
                            "summary":  "Pontuação em faixa crítica, indicando sofrimento ou desregulação acentuada. Recomenda-se investigação neuropsicológica aprofundada e acompanhamento psicoterapêutico estruturado."
                        }
                    ],
        "references":  [
                           "American Psychiatric Association (2023). \u003cem\u003eManual Diagnóstico e Estatístico de Transtornos Mentais (DSM-5-TR)\u003c/em\u003e. Porto Alegre: Artmed.",
                           "Magalhães, D. (2026). \u003cem\u003eAcervo de Instrumentos Psicoeducativos e Rastreio Clínico em Neuropsicologia\u003c/em\u003e. Guaranésia: Clínica Deo Magalhães (CRP 04/42784)."
                       ]
    }
];
