/**
 * Manifesto Editorial Inteligente — Trilhas de Leitura Guiadas & Destaques
 * Autor: Deo Magalhães - Neuropsicólogo e Neurocientista (CRP 04/42784)
 */
(function () {
    const STORAGE_KEY = 'deo_trilhas_progresso_v1';

    const TRILHAS_LEITURA = [
        {
            id: 'foco-execucao-tdah',
            areaBadge: 'Funções Executivas & TDAH',
            categorySlug: 'tdah-tea',
            title: 'Atenção, Bloqueio Executivo & TDAH no Adulto',
            shortDesc: 'Da neuroquímica da dopamina à superação da paralisia de ação, sobrecarga mental e construção sustentável de rotinas.',
            subtitle: 'Uma jornada neuropsicológica para compreender por que procrastinar ou travar diante de tarefas importantes não é falha moral, mas um fenômeno dos circuitos fronto-estriatais.',
            coverImage: 'assets/imagens/hero-2.jpg',
            estimatedTime: '48 min de leitura total',
            clinicalRationale: 'Muitos adultos tentam corrigir a desorganização apenas com cobrança e força de vontade, agravando a exaustão pré-frontal. Esta trilha foi desenhada de baixo para cima: primeiro compreendemos o combustível neuroquímico da motivação (dopamina tônica e fásica), depois mapeamos a arquitetura executiva e o travamento do TDAH, investigamos como as trocas de tarefa e pendências abertas drenam a memória de trabalho e, por fim, consolidamos hábitos nos gânglios da base para poupar energia consciente.',
            steps: [
                {
                    role: 'Base Neuroquímica',
                    readTime: '8 min',
                    title: 'A Neurobiologia da Motivação: Dopamina Tônica, Fásica e o Mito da Falta de Vontade',
                    url: 'artigos/neurobiologia-motivacao-dopamina-tonica-fasica.html',
                    summary: 'Entenda como o cérebro calcula custo energético versus recompensa e por que oscilações dopaminérgicas alteram drasticamente a capacidade de iniciar tarefas.',
                    bridgeNote: 'Compreendido o papel da dopamina na iniciação, o próximo passo é observar como o córtex pré-frontal gerencia prioridades no TDAH adulto.'
                },
                {
                    role: 'Arquitetura Executiva',
                    readTime: '9 min',
                    title: 'Funções Executivas e TDAH no Adulto: Desconstruindo o Mito da Força de Vontade',
                    url: 'artigos/funcoes-executivas-tdah-adulto-mito-forca-vontade.html',
                    summary: 'Memória operacional, controle inibitório e flexibilidade cognitiva: o que realmente acontece quando o maestro cortical opera sob sobrecarga.',
                    bridgeNote: 'Quando essas funções entram em colapso diante de demandas complexas ou ambíguas, surge a paralisia executiva abordada a seguir.'
                },
                {
                    role: 'Mecanismo Clínico',
                    readTime: '8 min',
                    title: 'Bloqueio Executivo e Inércia no TDAH: Quando Querer Agir Não Basta',
                    url: 'artigos/bloqueio-executivo-tdah-inercia.html',
                    summary: 'A anatomia do travamento motor e decisório diante de tarefas urgentes e protocolos práticos de micro-ativação para destravar o início da ação.',
                    bridgeNote: 'Além do bloqueio interno, o ambiente contemporâneo fragmenta o foco a cada notificação — fenômeno explorado na etapa 4.'
                },
                {
                    role: 'Ecologia Atencional',
                    readTime: '7 min',
                    title: 'O Cérebro Fragmentado: Troca de Tarefas e o Custo Oculto do Resíduo de Atenção',
                    url: 'artigos/cerebro-fragmentado-troca-tarefas-residuo-atencao.html',
                    summary: 'Por que alternar rapidamente entre abas e mensagens reduz o QI funcional temporário e deixa rastros neurais que impedem o foco profundo.',
                    bridgeNote: 'Essas tarefas interrompidas permanecem ativas em segundo plano na mente, gerando o Efeito Zeigarnik analisado na próxima leitura.'
                },
                {
                    role: 'Carga Cognitiva',
                    readTime: '8 min',
                    title: 'A Neurobiologia do Efeito Zeigarnik e a Carga Cognitiva das Tarefas Inacabadas',
                    url: 'artigos/a-neurobiologia-do-efeito-zeigarnik-e-a-carga-cognitiva.html',
                    summary: 'Por que o cérebro mantém alarmes acesos para ciclos abertos mesmo na hora do descanso e como externalizar planos acalma a rede frontoparietal.',
                    bridgeNote: 'Para não depender da memória de trabalho a cada ação do dia, encerramos a trilha transferindo comportamentos para a automação subcortical.'
                },
                {
                    role: 'Integração & Autonomia',
                    readTime: '8 min',
                    title: 'A Arquitetura dos Hábitos e os Gânglios da Base: Automatizando a Rotina sem Exaustão',
                    url: 'artigos/arquitetura-habitos-ganglios-da-base.html',
                    summary: 'Como pistas contextuais e repetição consistente constroem trilhas neurais estáveis, liberando o córtex pré-frontal para decisões criativas.',
                    bridgeNote: 'Jornada teórica concluída! Utilize abaixo a escala clínica e o laboratório prático para mapear seu próprio perfil executivo.'
                }
            ],
            ecosystem: [
                {
                    type: 'Escala Psicométrica',
                    title: 'Rastreio de Bloqueio Executivo & Inércia',
                    desc: 'Avalie indicadores de paralisia de iniciação, memória de trabalho e regulação da atenção.',
                    url: 'testes/teste-bloqueio-executivo-tdah.html',
                    cta: 'Realizar Autoavaliação →'
                },
                {
                    type: 'Treino Cognitivo',
                    title: 'Desafio Stroop Neuro: Controle Inibitório',
                    desc: 'Exercite o freio atencional e a resistência à interferência em tempo real.',
                    url: 'jogos/jogo-stroop-neuro.html',
                    cta: 'Iniciar Treino →'
                },
                {
                    type: 'Ferramenta Clínica',
                    title: 'Descompositor Neurocognitivo de Tarefas',
                    desc: 'Quebre projetos paralisantes em micro-etapas compatíveis com sua energia atual.',
                    url: 'recursos/descompositor-tarefas.html',
                    cta: 'Abrir Ferramenta →'
                }
            ]
        },
        {
            id: 'vinculos-apego-relacoes',
            areaBadge: 'Vínculos & Apego',
            categorySlug: 'orientacao-familiar',
            title: 'Neuroquímica do Amor, Apego & Relações Íntimas',
            shortDesc: 'Da base segura de Bowlby e da biologia da ocitocina aos padrões adultos de insegurança, conflito e elaboração do luto.',
            subtitle: 'Compreenda como os primeiros mapas relacionais moldam a regulação afetiva a dois, a busca por validação e a reconstrução após rupturas.',
            coverImage: 'assets/imagens/hero-7.jpg',
            estimatedTime: '50 min de leitura total',
            clinicalRationale: 'Relações adultas raramente entram em crise por falta de afeto racional; elas colidem quando sistemas arcaicos de ameaça e apego assumem o volante. Esta sequência parte da fundação evolutiva da Base Segura, mergulha na neuroquímica que diferencia paixão efêmera de vínculo duradouro, examina como estilos inseguros buscam dopamina na aprovação alheia, analisa dinâmicas relacionais de alta reatividade e culmina na neurociência da reconstrução diante da perda.',
            steps: [
                {
                    role: 'Fundação Evolutiva',
                    readTime: '8 min',
                    title: 'A Base Segura de John Bowlby: Como o Vínculo Constrói a Coragem de Explorar o Mundo',
                    url: 'artigos/artigo-base-segura-bowlby.html',
                    summary: 'Por que a dependência saudável e a previsibilidade afetiva não geram fragilidade, mas constituem o alicerce biológico da autonomia humana.',
                    bridgeNote: 'Estabelecida a matriz do apego, avançamos para os neurotransmissores e neuropeptídeos que sustentam o laço amoroso.'
                },
                {
                    role: 'Neurobiologia Afetiva',
                    readTime: '8 min',
                    title: 'A Neuroquímica do Vínculo Amoroso: Ocitocina, Vasopressina e Cooperação Profunda',
                    url: 'artigos/neuroquimica-vinculo-amoroso-apego.html',
                    summary: 'A transição da tempestade dopaminérgica da paixão para a segurança calmante dos circuitos oxitocinérgicos de longo prazo.',
                    bridgeNote: 'Quando essa segurança primária falha, formam-se estratégias defensivas que reaparecem nos relacionamentos adultos.'
                },
                {
                    role: 'Clínica dos Padrões',
                    readTime: '9 min',
                    title: 'Teoria do Apego na Vida Adulta: Padrões Afetivos de Ansiedade, Esquiva e Segurança',
                    url: 'artigos/teoria-do-apego-na-vida-adulta-padroes-afetivos.html',
                    summary: 'Identifique a dança entre hiperativação ansiosa e desativação evitativa nos conflitos conjugais e como cultivar segurança adquirida.',
                    bridgeNote: 'Nos padrões inseguros, a autoestima passa a depender excessivamente do olhar externo — tema aprofundado na etapa 4.'
                },
                {
                    role: 'Regulação Social',
                    readTime: '8 min',
                    title: 'Insegurança de Apego, Validação Externa e o Circuito da Dopamina Social',
                    url: 'artigos/inseguranca-apego-validacao-externa-dopamina-social.html',
                    summary: 'Como o medo sutil de rejeição sequestra o sistema de recompensa e transforma aprovação alheia em necessidade compulsiva.',
                    bridgeNote: 'Em relações marcadas por feridas narcísicas ou hipersensibilidade, essas defesas podem assumir formas crônicas de culpa e vitimização.'
                },
                {
                    role: 'Dinâmicas Complexas',
                    readTime: '9 min',
                    title: 'Narcisismo Vulnerável, Vitimização e Culpa nas Relações Íntimas',
                    url: 'artigos/narcisismo-vulneravel-vitimizacao-culpa-relacoes.html',
                    summary: 'Diferencie fragilidade genuína de estratégias inconscientes de controle emocional e aprenda a sustentar limites com lucidez clínica.',
                    bridgeNote: 'Por fim, quando um vínculo significativo precisa ser encerrado ou é perdido, o cérebro atravessa a neurobiologia do luto.'
                },
                {
                    role: 'Ruptura & Travessia',
                    readTime: '8 min',
                    title: 'A Neurociência do Luto e do Vínculo Rompido: Como o Cérebro Reaprende a Habitar a Ausência',
                    url: 'artigos/a-neurociencia-do-luto-e-do-vinculo-rompido.html',
                    summary: 'Por que a perda aciona redes de dor física e abstinência no núcleo accumbens e como a neuroplasticidade reintegra a biografia afetiva.',
                    bridgeNote: 'Concluída a leitura, explore seu estilo predominante de vinculação nos instrumentos práticos abaixo.'
                }
            ],
            ecosystem: [
                {
                    type: 'Escala Psicométrica',
                    title: 'Inventário de Estilo de Apego Adulto',
                    desc: 'Mapeie suas dimensões de segurança, ansiedade relacional e evitação de intimidade.',
                    url: 'testes/teste-apego.html',
                    cta: 'Descobrir Perfil de Apego →'
                },
                {
                    type: 'Simulador Relacional',
                    title: 'Matriz de Conflitos & Cooperação',
                    desc: 'Experimente dilemas de confiança, reciprocidade e comunicação sob pressão.',
                    url: 'jogos/jogo-matriz-conflitos.html',
                    cta: 'Jogar Simulador →'
                }
            ]
        },
        {
            id: 'corpo-interocepcao-afetos',
            areaBadge: 'Neurociência dos Afetos',
            categorySlug: 'saude-mental',
            title: 'Corpo, Interocepção, Alexitimia & Regulação Emocional',
            shortDesc: 'Como o cérebro lê sinais viscerais, por que somatizamos quando faltam palavras e a ciência da regulação autonômica.',
            subtitle: 'Uma travessia pela ínsula anterior, marcadores somáticos de Damasio e nervos vagais para reconectar sensação física, palavra e equilíbrio afetivo.',
            coverImage: 'assets/imagens/hero-16.jpg',
            estimatedTime: '42 min de leitura total',
            clinicalRationale: 'Toda emoção começa como uma alteração fisiológica no corpo antes de se tornar um sentimento consciente. Quando bloqueamos a escuta visceral ou não possuímos vocabulário afetivo (alexitimia), o sofrimento não desaparece: ele transborda em tensão muscular, dor crônica e exaustão autonômica. Esta trilha guia você desde a percepção interoceptiva até a nomeação refinada das emoções e a ativação da segurança vagal.',
            steps: [
                {
                    role: 'Escuta Visceral',
                    readTime: '8 min',
                    title: 'A Neurobiologia da Intuição e dos Marcadores Somáticos: Como o Corpo Decide Antes da Razão',
                    url: 'artigos/a-neurobiologia-da-intuicao-e-dos-marcadores-somaticos.html',
                    summary: 'A hipótese de Antonio Damasio sobre como a ínsula anterior e o córtex pré-frontal ventromedial integram sinais viscerais na sabedoria prática.',
                    bridgeNote: 'Mas o que ocorre quando a ponte entre esses sinais viscerais e as áreas da linguagem está desconectada? Entramos no campo da alexitimia.'
                },
                {
                    role: 'Granularidade Afetiva',
                    readTime: '9 min',
                    title: 'A Neurobiologia da Alexitimia e a Desconexão Ínsulo-Pré-Frontal: Quando o Corpo Fala',
                    url: 'artigos/a-neurobiologia-da-alexitimia-e-a-desconexao-insulo-pre-frontal.html',
                    summary: 'Por que a baixa granularidade emocional amplifica a reatividade da amígdala e como dar nome preciso ao afeto reduz a descarga fisiológica.',
                    bridgeNote: 'Muitas vezes, mesmo sentindo a emoção, aprendemos culturalmente a engoli-la — confundindo regulação saudável com supressão.'
                },
                {
                    role: 'Manejo Emocional',
                    readTime: '8 min',
                    title: 'Regulação Emocional vs. Supressão: O Custo Neurofisiológico de Engolir o Choro',
                    url: 'artigos/regulacao-emocional-vs-supressao-engolir-choro.html',
                    summary: 'A diferença clínica entre reavaliação cognitiva (que acalma a amígdala) e supressão expressiva (que eleva a pressão simpática e o cortisol).',
                    bridgeNote: 'A supressão crônica e as expectativas de ameaça também modulam diretamente os circuitos cerebrais da dor física.'
                },
                {
                    role: 'Psicossomática Clínica',
                    readTime: '8 min',
                    title: 'Efeito Nocebo, Dor Psicogênica e as Vias Descendentes de Modulação da Dor',
                    url: 'artigos/efeito-nocebo-dor-psicogenica-vias-descendentes.html',
                    summary: 'Como estados emocionais, hipervigilância e crenças de vulnerabilidade alteram neurotransmissores reais na medula espinhal.',
                    bridgeNote: 'Para desarmar o alarme somático de forma duradoura, encerramos cultivando o circuito mamífero de cuidado e autocompaixão.'
                },
                {
                    role: 'Segurança Autonômica',
                    readTime: '9 min',
                    title: 'Neurobiologia da Autocompaixão: Como a Gentileza Interna Modula a Amígdala',
                    url: 'artigos/neurobiologia-autocompaixao-gentileza-amigdala.html',
                    summary: 'Longe da autoindulgência, entenda como trocar o autoataque pela postura compassiva estimula o freio vagal e restaura a resiliência.',
                    bridgeNote: 'Experimente agora avaliar sua precisão interoceptiva e treinar sua diferenciação afetiva nas ferramentas abaixo.'
                }
            ],
            ecosystem: [
                {
                    type: 'Escala Psicométrica',
                    title: 'Escala de Granularidade Emocional & Alexitimia',
                    desc: 'Avalie como você identifica, diferencia e traduz estados corporais em palavras.',
                    url: 'testes/teste-granularidade-emocional-alexitimia.html',
                    cta: 'Fazer Teste Clínico →'
                },
                {
                    type: 'Laboratório Afetivo',
                    title: 'Jogo da Granularidade Emocional',
                    desc: 'Treine o vocabulário emocional preciso diante de cenários complexos e sutis.',
                    url: 'jogos/jogo-granularidade-emocional.html',
                    cta: 'Praticar Agora →'
                },
                {
                    type: 'Biofeedback Guiado',
                    title: 'Pacer de Coerência Cardíaca & Tonus Vagal',
                    desc: 'Regule o sistema nervoso autônomo em 3 minutos com cadência respiratória guiada.',
                    url: 'recursos/coerencia-cardiaca-vagal.html',
                    cta: 'Iniciar Respiração →'
                }
            ]
        },
        {
            id: 'trauma-estresse-resiliencia',
            areaBadge: 'Trauma & Resiliência',
            categorySlug: 'saude-mental',
            title: 'Trauma Complexo, Burnout & Arquitetura da Resiliência',
            shortDesc: 'Do neurodesenvolvimento sob estresse precoce e colapso alostático à reativação da agência e neuroplasticidade.',
            subtitle: 'Entenda como adversidades prolongadas esculpem o eixo HPA, por que surgem a dissociação e a anedonia, e os caminhos científicos de reconstrução.',
            coverImage: 'assets/imagens/hero-12.jpg',
            estimatedTime: '52 min de leitura total',
            clinicalRationale: 'Quando um organismo atravessa estresse inescapável, respostas que hoje parecem sintomas — hipervigilância, anestesia afetiva, exaustão profunda — foram originalmente adaptações vitais de sobrevivência. Esta trilha percorre a linha do tempo neurobiológica do estresse crônico: das marcas precoces e do Trauma Complexo (CPTSD) ao desgaste do Burnout, passando pelo freio do desamparo e da habênula lateral, até alcançar os mecanismos ativos da resiliência psíquica.',
            steps: [
                {
                    role: 'Raízes do Alarme',
                    readTime: '9 min',
                    title: 'A Mente Hiperalerta: Trauma Precoce, Eixo HPA e Neurodesenvolvimento',
                    url: 'artigos/mente-hiperalerta-trauma-precoce-neurodesenvolvimento.html',
                    summary: 'Como ambientes imprevisíveis na infância calibram a amígdala para detectar perigo constante mesmo décadas depois.',
                    bridgeNote: 'Quando a exposição traumática é repetida e relacional, configura-se o quadro clínico específico do Trauma Complexo.'
                },
                {
                    role: 'Fragmentação & Defesa',
                    readTime: '9 min',
                    title: 'Neurobiologia do Trauma Complexo (CPTSD) e os Mecanismos da Dissociação',
                    url: 'artigos/neurobiologia-trauma-complexo-cptsd-dissociacao.html',
                    summary: 'Flashbacks emocionais sem imagem, desconexão corporal e o caminho clínico em fases para reintegrar segurança e identidade.',
                    bridgeNote: 'Na vida adulta, a hiperadaptação constante às demandas externas cobra um preço biológico cumulativo: a carga alostática.'
                },
                {
                    role: 'Colapso Energético',
                    readTime: '9 min',
                    title: 'Carga Alostática, Burnout e a Erosão da Plasticidade Sináptica',
                    url: 'artigos/carga-alostatica-burnout-plasticidade-sinaptica.html',
                    summary: 'Por que o esgotamento ocupacional e existencial não se cura em um fim de semana e como o estresse crônico retrai dendritos pré-frontais.',
                    bridgeNote: 'Sob estresse incontrolável prolongado, o cérebro ativa um mecanismo evolutivo de conservação passiva: o desamparo aprendido.'
                },
                {
                    role: 'Freio da Agência',
                    readTime: '8 min',
                    title: 'A Arquitetura Neural do Desamparo Aprendido e a Reativação Dopaminérgica',
                    url: 'artigos/a-arquitetura-neural-do-desamparo-aprendido.html',
                    summary: 'A descoberta de Maier e Seligman sobre o núcleo dorsal da rafe e como experiências reais de controle religam o córtex pré-frontal ventromedial.',
                    bridgeNote: 'Junto à perda de agência, frustrações sucessivas podem silenciar os circuitos do prazer por meio da habênula lateral.'
                },
                {
                    role: 'Silêncio da Recompensa',
                    readTime: '8 min',
                    title: 'A Neurobiologia da Anedonia e o Circuito Habenular: Quando a Frustração Desliga o Prazer',
                    url: 'artigos/a-neurobiologia-da-anedonia-e-o-circuito-habenular.html',
                    summary: 'Entenda o centro antirrecompensa do cérebro e por que a ativação comportamental gradual precede o retorno da motivação sentida.',
                    bridgeNote: 'Compreendidas todas as camadas da ferida e da exaustão, encerramos com a ciência ativa da reconstrução e da resiliência.'
                },
                {
                    role: 'Reconstrução Neural',
                    readTime: '9 min',
                    title: 'A Arquitetura Neurobiológica da Resiliência Psíquica: Plasticidade, Sentido e Regulação',
                    url: 'artigos/a-arquitetura-neurobiologica-da-resiliencia-psiquica.html',
                    summary: 'Resiliência não é invulnerabilidade estóica, mas flexibilidade regulatória, suporte vincular e neurogênese mediada por BDNF.',
                    bridgeNote: 'Utilize os recursos abaixo para avaliar indicadores de sobrecarga traumática e exercitar calibração de esforço.'
                }
            ],
            ecosystem: [
                {
                    type: 'Escala Psicométrica',
                    title: 'Rastreio Dimensional de Trauma Complexo (CPTSD)',
                    desc: 'Avalie indicadores de desregulação afetiva, auto-organização e hipervigilância.',
                    url: 'testes/teste-trauma-complexo-cptsd.html',
                    cta: 'Acessar Escala →'
                },
                {
                    type: 'Paradigma Experimental',
                    title: 'Equilíbrio de Esforço & Recompensa',
                    desc: 'Explore na prática como o cérebro pondera custo energético e recuperação.',
                    url: 'jogos/jogo-esforco-custo-beneficio.html',
                    cta: 'Experimentar Jogo →'
                }
            ]
        },
        {
            id: 'ruminacao-sono-restauracao',
            areaBadge: 'Saúde Mental & Sono',
            categorySlug: 'reabilitacao-cognitiva',
            title: 'Pensamentos Intrusivos, Rede DMN & Restauração no Sono',
            shortDesc: 'Por que a mente entra em loop ruminativo à noite e como o sono REM e o sistema glinfático limpam e reorganizam o cérebro.',
            subtitle: 'Conecte o funcionamento da Rede de Modo Padrão (Default Mode Network), o controle da ansiedade crônica e a neurobiologia profunda do descanso.',
            coverImage: 'assets/imagens/hero-5.jpg',
            estimatedTime: '41 min de leitura total',
            clinicalRationale: 'Ansiedade diurna e insônia noturna formam uma via de mão dupla: uma mente hiperconectada à Rede de Modo Padrão rumina o passado e antecipa catástrofes, impedindo a descida para as ondas lentas do sono; sem sono profundo e sono REM, a amígdala amanhece até 60% mais reativa no dia seguinte. Esta jornada ensina a desengajar o loop ruminativo e restaurar a higiene neurobiológica noturna.',
            steps: [
                {
                    role: 'Mente Errante',
                    readTime: '8 min',
                    title: 'Rede de Modo Padrão (DMN) e Pensamentos Intrusivos: Por Que a Mente Cria Tempestades no Silêncio',
                    url: 'artigos/rede-modo-padrao-dmn-pensamentos-intrusivos.html',
                    summary: 'O que acontece no córtex cingulado posterior quando não estamos focados em tarefas externas e como diferenciar pensamento intrusivo de intenção.',
                    bridgeNote: 'Quando essa rede opera acoplada aos circuitos de ameaça, instala-se o estado de alerta ansioso contínuo.'
                },
                {
                    role: 'Espiral Ansiosa',
                    readTime: '8 min',
                    title: 'Cérebro em Sobrecarga: Ruminação, Preocupação Antecipatória e Ansiedade Crônica',
                    url: 'artigos/cerebro-em-sobrecarga-ruminacao-ansiedade-cronica.html',
                    summary: 'Por que tentar resolver todos os cenários futuros mentalmente funciona como uma falsa segurança que perpetua a ansiedade.',
                    bridgeNote: 'Na vertente depressiva, esse mesmo circuito volta-se repetitivamente para perdas, autocrítica e arrependimentos.'
                },
                {
                    role: 'Desengajamento Cognitivo',
                    readTime: '8 min',
                    title: 'Ruminação Depressiva, Hiperconectividade da DMN e o Papel do Controle Pré-Frontal',
                    url: 'artigos/ruminacao-depressiva-dmn-controle-pre-frontal.html',
                    summary: 'Estratégias neurocognitivas e comportamentais para alternar da ruminação abstrata para a atenção presente e concreta.',
                    bridgeNote: 'Acalmado o ruído vigíl, descobrimos o trabalho extraordinário que o cérebro realiza durante os sonhos no sono REM.'
                },
                {
                    role: 'Alquimia Noturna',
                    readTime: '8 min',
                    title: 'Neurobiologia do Sono REM: Onde as Memórias Dolorosas Perdem o Gume Emocional',
                    url: 'artigos/neurobiologia-sono-rem-memorias-traumas.html',
                    summary: 'O único estado cerebral livre de noradrenalina capaz de consolidar aprendizados enquanto dissolve a carga visceral dos eventos difíceis.',
                    bridgeNote: 'Além da terapia afetiva do REM, o sono profundo de ondas lentas executa uma limpeza metabólica literal no tecido neural.'
                },
                {
                    role: 'Restauração Celular',
                    readTime: '9 min',
                    title: 'Sistema Glinfático e Sono Profundo: A Limpeza Metabólica Essencial do Cérebro',
                    url: 'artigos/sistema-glinfatico-sono-profundo-limpeza-cerebral.html',
                    summary: 'Como a glia e o líquido cefalorraquidiano removem subprodutos neurotóxicos durante a noite, protegendo a memória e a longevidade cognitiva.',
                    bridgeNote: 'Aplique o aprendizado mapeando sua tendência ruminativa e utilizando o registro estruturado de pensamentos.'
                }
            ],
            ecosystem: [
                {
                    type: 'Escala Psicométrica',
                    title: 'Inventário de Ruminação & Pensamento Repetitivo',
                    desc: 'Diferencie reflexão construtiva de ciclos ruminativos desgastantes.',
                    url: 'testes/teste-ruminacao.html',
                    cta: 'Avaliar Ruminação →'
                },
                {
                    type: 'Escala Clínica',
                    title: 'Índice de Qualidade Restauradora do Sono',
                    desc: 'Verifique latência, fragmentação noturna e recuperação cognitiva matinal.',
                    url: 'testes/teste-sono.html',
                    cta: 'Avaliar Meu Sono →'
                },
                {
                    type: 'Ferramenta TCC',
                    title: 'RPD Digital — Reestruturação de Pensamentos',
                    desc: 'Examine evidências e desacelere interpretações catastróficas passo a passo.',
                    url: 'recursos/rpd-digital.html',
                    cta: 'Abrir Diário Clínico →'
                }
            ]
        },
        {
            id: 'logica-pensamento-critico',
            areaBadge: 'Filosofia & Lógica',
            categorySlug: 'filosofia',
            title: 'Lógica Formal, Viés de Confirmação & Rigor Epistêmico',
            shortDesc: 'Dos operadores clássicos e teoremas de Gödel à defesa contra falácias, vieses cognitivos e polarização tribal.',
            subtitle: 'Uma formação intelectual concisa para afiar a clareza argumentativa, reconhecer limites da linguagem e cultivar humildade científica.',
            coverImage: 'assets/imagens/hero-10.jpg',
            estimatedTime: '46 min de leitura total',
            clinicalRationale: 'Pensar bem é também um ato de higiene mental. Tanto nas distorções cognitivas da clínica quanto no debate público inflamado pelas redes digitais, sofremos quando tomamos inferências apressadas por certezas absolutas. Esta trilha constrói o alicerce da lógica proposicional, explora os limites filosóficos da linguagem formal, disseca os atalhos evolutivos do viés de confirmação e culmina na ética do pensamento complexo.',
            steps: [
                {
                    role: 'Estrutura Formal',
                    readTime: '10 min',
                    title: 'Fundamentos da Lógica Clássica: Proposições, Operadores e Validade Dedutiva',
                    url: 'artigos/fundamentos-logica-classica-proposicoes-operadores.html',
                    summary: 'Identidade, não-contradição, terceiro excluído, condicionais (P → Q) e como distinguir forma lógica válida de retórica persuasiva.',
                    bridgeNote: 'Dominadas as regras clássicas de inferência, avançamos para os paradoxos e fronteiras descobertos no século XX.'
                },
                {
                    role: 'Filosofia da Linguagem',
                    readTime: '10 min',
                    title: 'Lógica Avançada e Filosofia da Linguagem: Gödel, Paradoxos e os Limites dos Sistemas',
                    url: 'artigos/logica-avancada-filosofia-linguagem-godel-paradoxos.html',
                    summary: 'Autorreferência, incompletude e por que nenhum sistema fechado consegue esgotar toda a riqueza da verdade e do sentido humano.',
                    bridgeNote: 'Fora dos sistemas ideais, o cérebro humano real opera sob pressão de tempo usando heurísticas sujeitas a vieses sistemáticos.'
                },
                {
                    role: 'Psicologia do Julgamento',
                    readTime: '9 min',
                    title: 'A Arquitetura do Pensamento Crítico e a Armadilha Neural do Viés de Confirmação',
                    url: 'artigos/arquitetura-pensamento-critico-vies-confirmacao.html',
                    summary: 'Por que nosso cérebro poupa glicose buscando apenas provas que confirmem crenças prévias — e como treinar o falseamento deliberado.',
                    bridgeNote: 'Quando o viés de confirmação se funde à necessidade grupal de pertencimento, emerge a neurobiologia da polarização.'
                },
                {
                    role: 'Cognição Social',
                    readTime: '8 min',
                    title: 'Polarização Política, Identidade Grupal e Neurociência do Comportamento',
                    url: 'artigos/polarizacao-politica-neurociencia-comportamento.html',
                    summary: 'Por que argumentos contrários à nossa tribo ativam o córtex insular como se fossem ameaças físicas e como restaurar o diálogo racional.',
                    bridgeNote: 'Para superar reducionismos binários, fechamos a trilha com a proposta pedagógica da complexidade de Edgar Morin.'
                },
                {
                    role: 'Síntese Epistêmica',
                    readTime: '9 min',
                    title: 'Filosofia da Educação e Pensamento Complexo em Edgar Morin',
                    url: 'artigos/filosofia-educacao-morin.html',
                    summary: 'Religar saberes fragmentados, tolerar a incerteza e educar uma inteligência capaz de contextualizar o humano em sua inteireza.',
                    bridgeNote: 'Coloque seu raciocínio dedutivo e sua flexibilidade epistêmica à prova no teste e no laboratório lógico abaixo.'
                }
            ],
            ecosystem: [
                {
                    type: 'Escala Cognitiva',
                    title: 'Avaliação de Rigor & Flexibilidade Epistêmica',
                    desc: 'Meça sua disposição para revisar crenças diante de novas evidências e evitar falácias.',
                    url: 'testes/teste-rigor-epistemico-avancado.html',
                    cta: 'Testar Rigor Epistêmico →'
                },
                {
                    type: 'Arena Dedutiva',
                    title: 'Desafio dos Silogismos & Inferência',
                    desc: 'Valide conclusões lógicas e identifique armadilhas formais contra o relógio.',
                    url: 'jogos/jogo-silogismos.html',
                    cta: 'Jogar Desafio Lógico →'
                }
            ]
        },
        {
            id: 'sentido-sociedade-existencia',
            areaBadge: 'Existencialismo & Cultura',
            categorySlug: 'desenvolvimento-pessoal',
            title: 'Sociedade do Cansaço, Modernidade Líquida & Sentido Vital',
            shortDesc: 'Um diálogo entre Bauman, Byung-Chul Han, psicologia existencial e Viktor Frankl para atravessar o vazio contemporâneo.',
            subtitle: 'Quando o mal-estar não é apenas um desequilíbrio individual, mas o sintoma de uma cultura hiperprodutiva carente de significado.',
            coverImage: 'assets/imagens/hero-14.jpg',
            estimatedTime: '44 min de leitura total',
            clinicalRationale: 'Nem toda angústia deve ser medicalizada ou tratada como defeito cognitivo: muitas vezes ela é a resposta lúcida de uma consciência diante da aceleração vazia. Esta trilha articula o diagnóstico sociológico contemporâneo (a liquidez dos vínculos em Bauman, a autoexploração em Byung-Chul Han e a indústria da insatisfação) com a resposta clínica da Psicologia Existencial e da Logoterapia de Viktor Frankl.',
            steps: [
                {
                    role: 'Diagnóstico Cultural I',
                    readTime: '8 min',
                    title: 'Modernidade Líquida em Zygmunt Bauman: Incerteza, Efemeridade e Fragilidade Humana',
                    url: 'artigos/modernidade-liquida-bauman.html',
                    summary: 'Como a dissolução das instituições sólidas transferiu para os ombros do indivíduo solitário o peso de reinventar-se sem descanso.',
                    bridgeNote: 'Nesse cenário fluido, a coerção externa deu lugar a um imperativo ainda mais exaustivo: a cobrança interna de performance.'
                },
                {
                    role: 'Diagnóstico Cultural II',
                    readTime: '9 min',
                    title: 'A Sociedade do Cansaço e a Tirania da Autoexploração Positiva',
                    url: 'artigos/sociedade-do-cansaso-tirania-autoexploracao.html',
                    summary: 'A análise de Byung-Chul Han sobre como o sujeito do desempenho torna-se simultaneamente senhor e escravo de si mesmo.',
                    bridgeNote: 'Ao lado da hiperprodutividade, o mercado captura o desejo prometendo plenitude em metas móveis que nunca saciam.'
                },
                {
                    role: 'Crítica do Desejo',
                    readTime: '8 min',
                    title: 'A Fábrica de Insatisfeitos: Consumo, Comparação e a Erosão do Contentamento',
                    url: 'artigos/fabrica-insatisfeitos.html',
                    summary: 'Por que a adaptação hedônica e a vitrine digital perpetuam a sensação crônica de estar sempre atrasado em relação à própria vida.',
                    bridgeNote: 'Desfeitas as ilusões de controle absoluto e consumo redentor, ficamos frente a frente com as condições reais da existência.'
                },
                {
                    role: 'Clínica Existencial',
                    readTime: '10 min',
                    title: 'Psicologia Existencial e os Dados da Existência: Liberdade, Finitude, Isolamento e Sentido',
                    url: 'artigos/psicologia-existencial-dados-da-existencia.html',
                    summary: 'Como encarar com coragem os quatro pilares inevitáveis da condição humana transforma angústia difusa em presença autêntica.',
                    bridgeNote: 'Para ancorar essa liberdade no cotidiano concreto, encerramos com a obra clínica e filosófica de Viktor Frankl.'
                },
                {
                    role: 'Bússola de Sentido',
                    readTime: '9 min',
                    title: 'Viktor Frankl e a Logoterapia: A Vontade de Sentido Diante do Sofrimento Inevitável',
                    url: 'artigos/artigo-viktor-frankl.html',
                    summary: 'Autotranscendência, valores de criação, vivência e atitude: por que quem encontra um porquê atravessa quase qualquer como.',
                    bridgeNote: 'Prossiga para a clarificação prática de valores existenciais e avaliação de esgotamento abaixo.'
                }
            ],
            ecosystem: [
                {
                    type: 'Ferramenta Reflexiva',
                    title: 'Bússola de Clarificação Existencial & Valores',
                    desc: 'Mapeie o alinhamento entre suas prioridades reais e a forma como você investe seu tempo.',
                    url: 'recursos/clarificacao-existencial.html',
                    cta: 'Iniciar Clarificação →'
                },
                {
                    type: 'Escala Clínica',
                    title: 'Inventário de Esgotamento & Burnout',
                    desc: 'Avalie exaustão emocional, distanciamento cínico e realização pessoal.',
                    url: 'testes/teste-burnout.html',
                    cta: 'Avaliar Nível de Desgaste →'
                }
            ]
        },
        {
            id: 'infancia-parentalidade-telas',
            areaBadge: 'Infância & Família',
            categorySlug: 'desenvolvimento-infantil',
            title: 'Neurodesenvolvimento Infantil, Parentalidade & Era Digital',
            shortDesc: 'Marcos maturacionais, sono, ansiedade infantil, educação com vínculo firme e proteção do cérebro em formação diante das telas.',
            subtitle: 'Um guia integrado para mães, pais, educadores e clínicos acompanharem o amadurecimento cortical da infância com ciência e afeto.',
            coverImage: 'assets/imagens/hero-3.jpg',
            estimatedTime: '47 min de leitura total',
            clinicalRationale: 'O cérebro infantil não é um cérebro adulto em miniatura: seu córtex pré-frontal levará mais de duas décadas para completar a mielinização, dependendo diretamente do empréstimo regulatório dos adultos cuidadores. Esta trilha organiza o olhar familiar desde os marcos esperados do neurodesenvolvimento e a base biológica do sono até o manejo da ansiedade, o treino lúdico das funções executivas, os limites construtivos e o equilíbrio saudável com o mundo digital.',
            steps: [
                {
                    role: 'Mapa Maturacional',
                    readTime: '9 min',
                    title: 'Guia de Desenvolvimento Infantil: Janelas Neuroplásticas e Sinais de Alerta Precoce',
                    url: 'artigos/guia-desenvolvimento-infantil-marcos-alerta.html',
                    summary: 'Linguagem, motricidade, reciprocidade social e quando uma variação individual merece avaliação neuropsicológica especializada.',
                    bridgeNote: 'Para que cada janela de aprendizagem se consolide em memória estável, um pilar fisiológico é inegociável: o sono infantil.'
                },
                {
                    role: 'Consolidação Neural',
                    readTime: '7 min',
                    title: 'Neurociência do Sono e da Memória Infantil: Onde o Cérebro da Criança Cresce',
                    url: 'artigos/neurociencia-sono-memoria-infantil.html',
                    summary: 'Como rotinas noturnas previsíveis protegem a maturação sináptica, o humor diurno e o rendimento escolar.',
                    bridgeNote: 'Compreendida a base fisiológica, olhamos para os medos e sintomas ansiosos que frequentemente desafiam a família.'
                },
                {
                    role: 'Co-regulação Afetiva',
                    readTime: '8 min',
                    title: 'Ansiedade Infantil sob a Lente da Neurociência: Acolher sem Superproteger',
                    url: 'artigos/ansiedade-infantil-neurociencia.html',
                    summary: 'Como validar o medo real da criança enquanto construímos gradualmente sua coragem de enfrentamento e autoeficácia.',
                    bridgeNote: 'No dia a dia, além da regulação emocional, a criança precisa exercitar ativamente o planejamento, a espera e a atenção.'
                },
                {
                    role: 'Estímulo Cotidiano',
                    readTime: '8 min',
                    title: 'Funções Executivas na Prática: Estimulando Foco, Flexibilidade e Autocontrole na Infância',
                    url: 'artigos/funcoes-executivas-na-pratica.html',
                    summary: 'Brincadeiras, combinados visuais e mediações simples que fortalecem a memória operacional e o controle de impulsos.',
                    bridgeNote: 'Quando surgem frustrações e comportamentos desafiadores, como educar sem recorrer nem ao grito punitivo nem à permissividade?'
                },
                {
                    role: 'Parentalidade Consciente',
                    readTime: '8 min',
                    title: 'Disciplina Positiva e Neurociência: Conexão Antes da Correção',
                    url: 'artigos/disciplina-positiva-neurociencia.html',
                    summary: 'Por que um cérebro infantil em tempestade límbica não aprende sob ameaça e como sustentar limites claros com dignidade.',
                    bridgeNote: 'Por fim, aplicamos todos esses princípios de vínculo e autorregulação ao maior desafio contemporâneo das famílias: as telas.'
                },
                {
                    role: 'Higiene Digital',
                    readTime: '7 min',
                    title: 'Equilíbrio Digital Infantil: Dopamina Rápida, Telas e Proteção do Brincar Real',
                    url: 'artigos/equilibrio-digital-infantil.html',
                    summary: 'Critérios práticos por faixa etária para preservar a atenção sustentada, a criatividade presencial e a convivência familiar.',
                    bridgeNote: 'Explore com as crianças os contos terapêuticos ilustrados e os jogos socioemocionais do nosso ecossistema.'
                }
            ],
            ecosystem: [
                {
                    type: 'Biblioteca Ilustrada',
                    title: 'Leitor Interativo de Storybooks Terapêuticos',
                    desc: 'Histórias ilustradas para trabalhar frustração, medo do escuro e regulação emocional em família.',
                    url: 'recursos/leitor-storybooks.html',
                    cta: 'Ler Histórias →'
                },
                {
                    type: 'Jogo Socioemocional',
                    title: 'O Jardim das Emoções',
                    desc: 'Atividade lúdica interativa para crianças reconhecerem e nomearem estados afetivos.',
                    url: 'jogos/jogo-jardim-das-emocoes.html',
                    cta: 'Brincar Agora →'
                }
            ]
        }
    ];

    const DESTAQUES_EDITORIAIS = [
        {
            badge: 'Neurociência dos Afetos • Leitura Essencial',
            title: 'A Neurobiologia da Alexitimia e a Desconexão Ínsulo-Pré-Frontal',
            thesis: '“Quando faltam palavras precisas para diferenciar o que sentimos, a amígdala permanece sem freio simbólico e o corpo assume a narrativa por meio da somatização e da fadiga autonômica.”',
            summary: 'Um mergulho clínico na comunicação entre a ínsula anterior e o córtex pré-frontal, explicando a teoria da granularidade emocional e como reconstruir a alfabetização afetiva na vida adulta.',
            url: 'artigos/a-neurobiologia-da-alexitimia-e-a-desconexao-insulo-pre-frontal.html',
            trackId: 'corpo-interocepcao-afetos',
            trackLabel: 'Trilha: Corpo & Regulação Afetiva',
            coverImage: 'assets/imagens/hero-16.jpg',
            tags: ['Alexitimia', 'Ínsula Anterior', 'Psicossomática']
        },
        {
            badge: 'Funções Executivas • Destaque Clínico',
            title: 'O Efeito Zeigarnik e a Carga Cognitiva das Tarefas Inacabadas',
            thesis: '“O cérebro não se cansa apenas pelo trabalho que você executa, mas sobretudo pelas dezenas de laços abertos que sua memória operacional tenta vigiar simultaneamente no escuro.”',
            summary: 'Compreenda os mecanismos frontoparietais da tensão psíquica de ciclos não concluídos, o resíduo atencional e o protocolo prático de fechamento cognitivo para restaurar o descanso mental.',
            url: 'artigos/a-neurobiologia-do-efeito-zeigarnik-e-a-carga-cognitiva.html',
            trackId: 'foco-execucao-tdah',
            trackLabel: 'Trilha: Atenção & TDAH no Adulto',
            coverImage: 'assets/imagens/hero-2.jpg',
            tags: ['Efeito Zeigarnik', 'Memória de Trabalho', 'Foco']
        },
        {
            badge: 'Trauma & Plasticidade • Ensaio de Profundidade',
            title: 'A Arquitetura Neural do Desamparo Aprendido e a Reativação da Agência',
            thesis: '“A descoberta revolucionária da neurociência contemporânea revelou que a passividade diante da dor é o reflexo primitivo padrão; o que aprendemos, na verdade, é a coragem ativa de exercer controle.”',
            summary: 'Da revisão histórica de Maier e Seligman sobre o núcleo dorsal da rafe às estratégias psicoterapêuticas para religar o córtex pré-frontal ventromedial após períodos de estresse inescapável.',
            url: 'artigos/a-arquitetura-neural-do-desamparo-aprendido.html',
            trackId: 'trauma-estresse-resiliencia',
            trackLabel: 'Trilha: Trauma & Resiliência',
            coverImage: 'assets/imagens/hero-12.jpg',
            tags: ['Desamparo Aprendido', 'Agência', 'Neuroplasticidade']
        },
        {
            badge: 'Filosofia & Cultura • Reflexão Crítica',
            title: 'A Sociedade do Cansaço e a Tirania Silenciosa da Autoexploração',
            thesis: '“O sujeito contemporâneo já não precisa de um vigia externo para exaurir suas forças: convencido de que é um projeto ilimitado de performance, ele cobra a si mesmo até o colapso.”',
            summary: 'Uma articulação entre a filosofia social de Byung-Chul Han, a neurobiologia do esgotamento pré-frontal e o resgate existencial do ócio contemplativo e dos limites humanos.',
            url: 'artigos/sociedade-do-cansaso-tirania-autoexploracao.html',
            trackId: 'sentido-sociedade-existencia',
            trackLabel: 'Trilha: Sociedade & Sentido Vital',
            coverImage: 'assets/imagens/hero-14.jpg',
            tags: ['Byung-Chul Han', 'Burnout', 'Existencialismo']
        }
    ];

    function getAllProgress() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    }

    function getTrackProgress(trackId) {
        const all = getAllProgress();
        const arr = all[trackId];
        return Array.isArray(arr) ? arr : [];
    }

    function toggleStepProgress(trackId, stepIndex) {
        const all = getAllProgress();
        const current = Array.isArray(all[trackId]) ? all[trackId] : [];
        const pos = current.indexOf(stepIndex);
        if (pos === -1) {
            current.push(stepIndex);
        } else {
            current.splice(pos, 1);
        }
        all[trackId] = current;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        } catch (e) {
            // Ignora falha de armazenamento privado
        }
        return current;
    }

    function markStepCompleted(trackId, stepIndex) {
        const all = getAllProgress();
        const current = Array.isArray(all[trackId]) ? all[trackId] : [];
        if (current.indexOf(stepIndex) === -1) {
            current.push(stepIndex);
            all[trackId] = current;
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
            } catch (e) {}
        }
        return current;
    }

    function resetTrackProgress(trackId) {
        const all = getAllProgress();
        delete all[trackId];
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
        } catch (e) {}
    }

    window.DeoTrilhas = {
        tracks: TRILHAS_LEITURA,
        highlights: DESTAQUES_EDITORIAIS,
        getTrackById: function (id) {
            return TRILHAS_LEITURA.find(function (t) { return t.id === id; }) || null;
        },
        getTrackProgress: getTrackProgress,
        toggleStepProgress: toggleStepProgress,
        markStepCompleted: markStepCompleted,
        resetTrackProgress: resetTrackProgress
    };
})();
