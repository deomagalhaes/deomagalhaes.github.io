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
    }
];
