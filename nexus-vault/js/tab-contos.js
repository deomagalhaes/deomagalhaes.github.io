/**
 * NEXUS VAULT — Aba 5: Gerador Estruturado de Cenas Terapêuticas e Contos Noturnos
 * Arquivo Canônico: 'nexus-vault/js/tab-contos.js'
 * 100% Client-Side • Zero-Backend • LGPD Compliant • Leitor Âmbar Offline Low-Blue-Light
 *
 * Módulos Integrados:
 * 1. Banco Expandido de 60 Metáforas Terapêuticas Comportamentais & Regulação Autonômica
 * 2. 14 Cenários Poéticos de Biomas Brasileiros e Céu Noturno
 * 3. Motor Modular Instantâneo de Geração Offline em 4 Atos Fluidos
 * 4. Sintetizador Acústico Web Audio API Pré-Sono (Ruído Marrom, Chuva Mansa, Ondas, Grilos) com Sleep Timer
 * 5. Leitor Âmbar Imersivo com Paletas Térmicas Melatonina, Auto-Scroll Lento e Gestão de Favoritos Local
 */
(function (global) {
    'use strict';

    // =========================================================================
    // 1. BANCO DE 60 METÁFORAS TERAPÊUTICAS COMPORTAMENTAIS INFANTIS
    // =========================================================================
    const STORY_THEMES = {
        frustracao: {
            label: '1. Frustração (Quando algo sai diferente do plano)',
            defaultMetaphor: 'A semente de ipê-dourado que precisou descansar na terra macia quando a chuva atrasou, descobrindo que raízes calmas florescem mais fortes.',
            defaultQuestion: 'Qual foi uma coisinha que hoje pareceu difícil, mas que o seu coração aprendeu a esperar com calma?',
            challengeAct: 'tentou construir uma ponte de gravetos brilhantes, mas uma brisa travessa soprou três vezes e desmontou o caminho bem no meio da brincadeira. O peito ficou apertado e as mãozinhas quiseram desistir na mesma hora.',
            breathCue: 'inspirou sentindo o cheiro doce da mata por quatro tempos lentos… e soprou devagarinho como quem embala uma folha pousando na água.'
        },
        espera: {
            label: '2. Espera & Paciência (O tempo orgânico das coisas boas)',
            defaultMetaphor: 'O casulo dourado na galhada silenciosa, que não pode ser aberto com pressa porque cada minuto quietinho pinta mais uma cor nas asas.',
            defaultQuestion: 'O que será gostoso imaginar crescendo devagarinho enquanto a gente descansa esta noite?',
            challengeAct: 'queria muito ver a flor-da-noite abrir suas pétalas prateadas imediatamente, batendo o pezinho no chão macio porque esperar parecia demorar um século inteiro.',
            breathCue: 'pôs a mão na barriga morna, puxou o ar bem mansinho contando um, dois, três… e soltou num suspiro comprido e tranquilo.'
        },
        coragem: {
            label: '3. Coragem Diante do Novo (Passos pequenos e seguros)',
            defaultMetaphor: 'A lanterninha do coração: ela não precisa iluminar a floresta inteira de uma vez, só precisa clarear o próximo passinho bem diante dos pés.',
            defaultQuestion: 'Onde você sente morar a sua lanterninha de coragem quando dá um passo novo?',
            challengeAct: 'chegou diante de uma trilha nova onde as árvores faziam sombras compridas e sons diferentes. Mesmo com curiosidade, deu meio passo para trás sentindo um friozinho na barriga.',
            breathCue: 'encheu o peito de ar fresco como um guardião tranquilo e soltou devagar, percebendo que os pés estavam firmes e seguros.'
        },
        separacao: {
            label: '4. Separação / Transição de Rotina (O Fio Dourado Invisível)',
            defaultMetaphor: 'O fio invisível de luz dourada que liga dois corações que se amam: ele estica por qualquer distância sem nunca arrebentar e sempre traz de volta o abraço.',
            defaultQuestion: 'Se você tocar o seu peito agora, consegue sentir o quentinho do nosso fio dourado guardado aí dentro?',
            challengeAct: 'precisava atravessar para uma clareira diferente na manhã seguinte e sentiu saudade adiantada, querendo guardar todo o carinho dentro do bolso para não faltar.',
            breathCue: 'abraçou os próprios ombros bem macio, puxou o ar sentindo o carinho guardado no peito e soprou suave como uma canção de ninar.'
        },
        raiva: {
            label: '5. Raiva & Vulcão Interno (Sopro que esfria a brasa)',
            defaultMetaphor: 'A pedrinha vulcânica que fica quente demais quando se assusta, mas que ao mergulhar no riacho da respiração longa se transforma num cristal liso e fresquinho.',
            defaultQuestion: 'Como o seu corpo fica gostoso e levinho depois que o vulcãozinho esfria e vira brisa?',
            challengeAct: 'sentiu uma onda muito quente subir da barriga até as bochechas quando nada saía do seu jeito, como se um pequeno vulcão quisesse soltar faíscas para todo lado.',
            breathCue: 'soprou comprido e suave pela boca três vezes seguidas, vendo cada faísca quente virar poeira prateada de estrelas.'
        },
        medo_escuro: {
            label: '6. Medo do Escuro (A noite como cobertor protetor)',
            defaultMetaphor: 'A noite é apenas o cobertor azul-marinho da natureza: ela apaga as luzes fortes só para as estrelas e os sonhos bonitos conseguirem aparecer.',
            defaultQuestion: 'Qual estrela mansa vai cuidar do seu sono enquanto os seus olhinhos descansam?',
            challengeAct: 'olhou para os cantinhos sombreados quando o sol se escondeu e imaginou formas estranhas nas folhas, querendo que o dia nunca terminasse.',
            breathCue: 'fechou os olhos por um segundo, ouviu a música calma da própria respiração lenta e sentiu o escuro macio abraçar o descanso.'
        },
        ciume_partilha: {
            label: '7. Ciúme / Partilha Afetiva (O coração que estica sem dividir)',
            defaultMetaphor: 'A luz de uma vela carinhosa: quando ela acende outra vela vizinha, o seu próprio fogo não diminui; pelo contrário, o quarto todo fica duas vezes mais quentinho e iluminado.',
            defaultQuestion: 'Como o amor cresce ainda mais quando a gente descobre que cabe todo mundo no mesmo abraço?',
            challengeAct: 'viu os carinhos serem divididos com outro bichinho na clareira e sentiu um aperto cinzento no peito, como se o seu cantinho estivesse ficando pequeno.',
            breathCue: 'puxou o ar enchendo o peito até sentir que o coração é uma casa gigante sem portas trancadas, soltando o ar com um sorriso sereno.'
        },
        perfeccionismo: {
            label: '8. Perfeccionismo & Medo de Errar (O rascunho de asas)',
            defaultMetaphor: 'A borboleta que começou com asas pequeninas e dobradas: nenhuma flor no jardim pergunta se uma pétala entortou no vento, porque a beleza está na vida dançando.',
            defaultQuestion: 'O que o seu coração sentiu de bom quando você se deu conta de que tentar já é uma vitória linda?',
            challengeAct: 'apagou o desenho de terra três vezes seguidas porque uma linha não ficou reta como queria, com vontade de rasgar a folha e não brincar mais.',
            breathCue: 'soltou as mãos bem moles ao lado do corpo, respirou fundo deixando a perfeição ir embora e acolheu o desenho com ternura.'
        },
        hiperatividade_sono: {
            label: '9. Desaceleração & Energia no Fim do Dia (O motorzinho do vagalume)',
            defaultMetaphor: 'O vagalume que correu o dia todo acendendo e apagando sua luzinha dourada, mas que para conseguir brilhar amanhã precisa pousar suave na folha de orvalho e apagar o motor.',
            defaultQuestion: 'Se o seu corpinho fosse um barquinho chegando na beira da praia, onde ele mais gosta de encostar para relaxar?',
            challengeAct: 'sentia as perninhas e os pensamentos pulando sem parar de um galho para o outro, como se a noite fosse dia e o descanso não pudesse chegar.',
            breathCue: 'deitou a cabeça no travesseiro, inspirou contando os pezinhos relaxando… soltou o ar sentindo a gravidade puxar o corpo num abraço fofo.'
        },
        tristeza_acolhida: {
            label: '10. Tristeza & Saudade Suave (A nuvenzinha de chuva boa)',
            defaultMetaphor: 'A nuvenzinha cinza que chora gotas mansas sobre a terra: depois que a chuva passa devagar, a terra fica perfumada e brotam sementinhas de alegria nova.',
            defaultQuestion: 'Você sabe que não tem problema nenhum ficar quietinho e com vontade de chorar um pouco no colinho seguro?',
            challengeAct: 'perdeu uma folhinha dourada especial trazida pelo vento e sentiu uma vontade quieta de não falar com ninguém, com o peito nublado de chuva.',
            breathCue: 'deixou um suspiro quentinho sair devagarzinho, recebendo um afago nas costas e sentindo a dorzinha virar carinho guardado.'
        },
        adaptacao_escola: {
            label: '11. Adaptação & Pertencimento (O voo e a volta para o ninho)',
            defaultMetaphor: 'O passarinho que sai do ninho para explorar galhos novos: ele voa pelo céu azul, faz amigos passarinhos e quando a tarde cai, o ninho acolhedor continua exatamente no mesmo lugar.',
            defaultQuestion: 'Qual foi uma brincadeira ou descoberta diferente que você viu hoje enquanto esteve fora do ninho?',
            challengeAct: 'ficou na porta da nova escolinha da floresta vendo todos os animais diferentes e sentiu vontade de correr de volta para os braços protetores da manhã.',
            breathCue: 'respirou fundo sentindo a coragem nas patinhas, tocou o coração para lembrar que o ninho espera por ele ao entardecer, e deu dois passos firmes.'
        },
        generosidade_desapego: {
            label: '12. Apego & Partilha de Brinquedos (O riacho que corre)',
            defaultMetaphor: 'O riacho transparente que deixa a água correr: a água fica sempre doce e pura porque viaja livre, enquanto poça parada e fechada fica turva.',
            defaultQuestion: 'Como é gostoso ver a alegria no rostinho de um amigo quando a gente empresta algo com amor?',
            challengeAct: 'segurou bem forte o barquinho de casca de noz quando outro bichinho se aproximou para ver, com medo de perder seu brinquedo favorito.',
            breathCue: 'olhou nos olhos gentis do amiguinho, respirou fundo sentindo paz e estendeu a mãozinha aberta com um gesto dócil.'
        },
        desconexao_telas: {
            label: '13. Desconexão Digital & Telas (O Sol que desliga os raios)',
            defaultMetaphor: 'O Sol dourado que recolhe cada raio brilhante ao entardecer para descansar nas colinas: ele desliga suas luzes fortes porque até o astro mais poderoso precisa dormir no escuro macio para acordar radiante.',
            defaultQuestion: 'Que imagem bonita o seu pensamento quer pintar quando as luzes das telas se apagam?',
            challengeAct: 'sentiu vontade de continuar olhando as cores rápidas da telinha mágica, com os olhinhos ardendo e o coração agitado querendo mais um pouquinho sem parar.',
            breathCue: 'fechou as pálpebras, respirou fundo sentindo um frescor gostoso entrar pelo nariz e soltou o ar imaginando uma cortina de veludo aconchegante descendo sobre os olhos.'
        },
        timidez_social: {
            label: '14. Timidez & Insegurança Social (A casinha do caracol)',
            defaultMetaphor: 'A conchinha do caracol que sabe a hora de guardar a cabecinha e a hora de espiar o mundo: não tem pressa nenhuma, quem gosta da gente espera com carinho o nosso tempo de sair.',
            defaultQuestion: 'Como é bom saber que você pode ser quietinho e ainda assim ser infinitamente amado e especial?',
            challengeAct: 'viu outros animais brincando em roda e ficou encolhido atrás do tronco, com as patinhas congeladas e a garganta travada sem conseguir dizer oi.',
            breathCue: 'abraçou o próprio peito com suavidade, inspirou sentindo segurança por dentro e soltou um suspiro mansa, sabendo que cada um tem seu tempo único.'
        },
        somatizacao_corpo: {
            label: '15. Nó na Garganta / Dorzinha Emocional na Barriga',
            defaultMetaphor: 'O balãozinho de sabão preso na barriga: ele só infla quando a gente guarda as palavrinhas que queriam ser ditas. Ao soprar com calma, a película se desfaz e vira perfume no ar.',
            defaultQuestion: 'Onde o seu corpinho mais gosta de receber carinho quando a barriga ou o peito ficam apertados?',
            challengeAct: 'sentiu a barriguinha dar nós e a garganta ficar seca antes da hora de dormir, como se uma pedra pequenininha estivesse parada bem no meio do peito.',
            breathCue: 'pôs as duas mãozinhas na barriga, sentiu o ar entrar quentinho como chá de camomila e soprou devagar, sentindo cada músculo derreter feito manteiga.'
        },
        luto_memoria: {
            label: '16. Memória Afetiva & Perda (A Caixinha de Estrelas)',
            defaultMetaphor: 'A caixinha de prata invisível que mora dentro do coração: tudo o que a gente ama de verdade fica guardado ali dentro para sempre em forma de estrela, e nada no universo pode apagar.',
            defaultQuestion: 'Qual lembrança gostosa faz o seu peito ficar quentinho como se quem você ama estivesse abraçando você agora?',
            challengeAct: 'olhou para o cantinho onde o brinquedo favorito ou o bichinho querido costumava ficar e sentiu um vazio comprido, com os olhinhos cheios de lágrimas mansas.',
            breathCue: 'levou a mãozinha ao lado esquerdo do peito, sentiu as batidinhas calmas do coração e soprou com ternura, mandando um abraço de luz pelo pensamento.'
        },
        autoestima_valor: {
            label: '17. Sentir-se Pequeno & Autoestima (A formiguinha e a flor)',
            defaultMetaphor: 'A formiguinha sábia que carregava uma pétala inteira de girassol: o tamanho do corpo nunca limitou a grandeza da sua coragem e da sua bondade.',
            defaultQuestion: 'Você percebe como o mundo fica mais alegre e bonito só porque você existe exatamente do seu jeitinho?',
            challengeAct: 'ouviu os bichos grandes pularem alto e sentiu que era pequeno demais para fazer coisas importantes, com vontade de se esconder debaixo de uma folha seca.',
            breathCue: 'ergueu a cabecinha de manso, inspirou enchendo o peito com o ar do universo e soltou com um sorriso orgulhoso, sentindo-se precioso e único.'
        },
        medo_tempestades: {
            label: '18. Medo de Trovões & Chuva Forte (O tambor da terra)',
            defaultMetaphor: 'O tambor dos gigantes da serra: eles tocam lá no alto para chamar as nuvens que lavam as folhas e dão de beber aos riachos. Debaixo do teto seguro, é só uma música que embala o sono.',
            defaultQuestion: 'Se os trovões fossem só um tambor tocando uma canção de ninar bem longe, qual som gostoso a gente ouve aqui dentro do quarto?',
            challengeAct: 'ouviu o estrondo do trovão fazer tremer o vidro da janela e puxou o lençol até o nariz, com o coração batendo rápido como as asas de um beija-flor.',
            breathCue: 'encolheu os ombrinhos e depois soltou tudo de uma vez com um suspiro longo, sentindo o peso gostoso do cobertor e o abrigo seguro da casa.'
        },
        sobrecarga_sensorial: {
            label: '19. Sobrecarga Sensorial / Barulhos & Agitação (A concha da tartaruguinha)',
            defaultMetaphor: 'A conchinha macia da tartaruga: quando o mundo lá fora faz sons altos demais e luzes fortes, ela pode recolher as patinhas para dentro do seu refúgio aveludado e ficar no silêncio manso até o coração sossegar.',
            defaultQuestion: 'Como é gostoso fechar os olhinhos agora e sentir o silêncio fofo abraçar os seus pensamentos?',
            challengeAct: 'ouviu muitos sons misturados na festa da floresta, com passos rápidos e conversas altas que faziam a cabecinha doer e as orelhas arderem de tanto barulho.',
            breathCue: 'tapou os ouvidos bem de leve com as mãos macias, puxou o ar fresquinho contando quatro tempos e soltou num suspiro de veludo, sentindo a tranquilidade voltar.'
        },
        expressao_timidez: {
            label: '20. Medo de Falar na Roda / Expressão com Amor (A flautinha do grilo)',
            defaultMetaphor: 'A flautinha de bambu do grilo cantor: ela não precisa tocar alto como o trovão para ser linda; um sopro doce e miudinho é capaz de emocionar a mata inteira com sua verdade singela.',
            defaultQuestion: 'Qual segredo ou história gostosa você mais gosta de contar quando se sente bem seguro e acolhido?',
            challengeAct: 'viu todos os animais sentados em roda esperando pela sua fala, sentiu a garganta dar um nó seco e as bochechas esquentarem como duas amoras maduras.',
            breathCue: 'pôs a mão no peito para sentir o calor do coração, puxou o ar bem devagarzinho e soltou soprando uma melodia mansa que destravou o sorriso.'
        },
        chegada_irmaozinho: {
            label: '21. Novo Bebê / Irmãozinho na Família (O ninho que ganha mais um ramo)',
            defaultMetaphor: 'A copa da sumaúma ancestral: quando nasce um galhinho novo, a árvore não tira a seiva de nenhum outro ramo; pelo contrário, suas raízes bebem mais água da terra e o abraço verde fica duas vezes mais generoso.',
            defaultQuestion: 'Como o amor da nossa família é mágico e consegue crescer cada dia mais sem faltar para ninguém?',
            challengeAct: 'olhou para o novo bebezinho no colo protetor e sentiu um friozinho estranho na barriga, com medo de que não sobrasse colo suficiente para o seu próprio descanso.',
            breathCue: 'aninhou-se bem pertinho do abraço protetor, respirou fundo sentindo o cheiro de carinho e soltou o ar sentindo-se infinitamente insubstituível e amado.'
        },
        transicao_rotina_tea: {
            label: '22. Mudança Imprevista de Rotina / Flexibilidade (A ponte de cipó e flores)',
            defaultMetaphor: 'O riacho da montanha que encontrou uma pedra grande no meio da trilha: em vez de brigar com a rocha, fez uma curva graciosa pelo musgo fresco e descobriu uma cachoeirinha linda que ninguém conhecia.',
            defaultQuestion: 'Que surpresa gostosa a gente pode descobrir quando a rota do dia muda um pouquinho?',
            challengeAct: 'descobriu que a brincadeira planejada precisou ser cancelada por causa da chuva inesperada, e o peito endureceu como gesso querendo que o tempo voltasse atrás.',
            breathCue: 'soltou o pescoço e os ombrinhos para os lados bem moles, encheu a barriga de ar macio e soltou soprando a rigidez para longe como plumas ao vento.'
        },
        pesadelos_monstros: {
            label: '23. Medo de Pesadelos & Monstros Noturnos (O sopro de luz prateada)',
            defaultMetaphor: 'A lanterna de cristal dos guardiões da noite: ela mostra que aquela sombra comprida na parede era apenas a orelha comprida do coelhinho de pelúcia dormindo na beira da cama.',
            defaultQuestion: 'Você sabe que este quarto é um castelo seguro e que nenhum sonho ruim pode entrar no nosso abraço?',
            challengeAct: 'acordou assustado imaginando uma criatura estranha no canto do quarto escuro, com as perninhas tensas e o coração batendo forte no peito.',
            breathCue: 'segurou firme a mão protetora ao seu lado, puxou o ar sentindo a luz suave das estrelas iluminar os olhos e soltou um suspiro quentinho e libertador.'
        },
        singularidade_diversidade: {
            label: '24. Orgulho da Singularidade & Neurodiversidade (O jacarandá das cores únicas)',
            defaultMetaphor: 'O jardim encantado onde cada flor tem um perfume e uma cor totalmente diferentes: a orquídea não tenta ser rosa, e a samambaia não quer dar frutos, porque o encanto da mata é cada uma brilhar do seu jeito único.',
            defaultQuestion: 'Qual é o superpoder ou detalhe do seu jeitinho que faz você ser uma pessoa tão especial e incrível?',
            challengeAct: 'percebeu que pensava e brincava de um modo diferente dos outros amiguinhos, sentindo-se como um peixinho tentando voar com os pássaros.',
            breathCue: 'abraçou o próprio peito com carinho, inspirou sentindo orgulho da sua própria imaginação brilhante e soltou um sorriso de paz e pertencimento.'
        },
        mentira_acolhimento: {
            label: '25. Medo da Punição & Verdade Curativa (A água límpida que lava a mancha)',
            defaultMetaphor: 'O riacho transparente da floresta: quando cai uma folhinha de terra, a água não grita nem quebra; ela simplesmente corre límpida, lava a mancha com doçura e tudo volta a brilhar transparente.',
            defaultQuestion: 'Você sabe que pode sempre me contar tudo com calma, porque a verdade é um abraço que conserta qualquer coisa?',
            challengeAct: 'escondeu o que aconteceu com medo de ver uma cara brava, sentindo o peito pesar como se carregasse uma mochila cheia de pedras pontudas.',
            breathCue: 'respirou fundo deixando o ar entrar puro, soltou os ombrinhos e sentiu o alívio gostoso de poder ser totalmente sincero e acolhido.'
        },
        despedida_fase: {
            label: '26. Mudança de Fase & Desapego Carinhoso (A jaquetinha que virou asas)',
            defaultMetaphor: 'O passarinho que adorava seu galho de bebê, mas que ao sentir as penas fortes percebeu que voar pelo céu aberto é ainda mais lindo do que ficar só no ninho.',
            defaultQuestion: 'Que coisa nova e gostosa você aprendeu a fazer que mostra como você já cresceu com coragem?',
            challengeAct: 'olhou para um brinquedo de quando era bem pequenininho e sentiu uma saudade esquisita, querendo que o tempo andasse para trás feito caranguejo.',
            breathCue: 'abraçou a lembrança com ternura, puxou o ar sorrindo e soprou suave como quem sopra uma semente de dente-de-leão rumo ao futuro.'
        },
        ansiedade_domingo: {
            label: '27. Ansiedade Antecipatória de Domingo / Nova Semana (O barquinho do agora)',
            defaultMetaphor: 'O barquinho de madeira na lagoa tranquila: ele não precisa navegar na água da próxima quarta-feira nem do mês que vem; ele só precisa flutuar suave na aguinha morna desta noite aqui.',
            defaultQuestion: 'Se amanhã for um presente surpresa guardado numa caixinha, o que a gente faz agora para descansar bem o corpinho?',
            challengeAct: 'começou a pensar em tudo o que precisava fazer na escolinha nos próximos dias, com a cabecinha acelerada feito locomotiva sem freio.',
            breathCue: 'deitou a bochecha no travesseiro macio, fechou os olhinhos, respirou bem devagar e pensou: agora é só o meu cobertor e o meu descanso.'
        },
        perder_jogos: {
            label: '28. Frustração em Jogos & Espírito Lúdico (A ciranda onde o riso vale mais)',
            defaultMetaphor: 'A roda da ciranda dos vaga-lumes: o mais gostoso da dança não é quem chega primeiro, mas sim dar as mãos, rodopiar e dar gargalhada quando todo mundo cai na relva macia.',
            defaultQuestion: 'Você percebe como o jogo mais divertido do mundo é aquele em que a gente brinca com carinho e se diverte junto?',
            challengeAct: 'perdeu a rodada da brincadeira e cruzou os braços com a boca amarrada, sentindo que se não vencesse nada mais valia a pena.',
            breathCue: 'soprou forte como quem sopra um balão de ar quente, desfez o nó do peito e sentiu a alegria de brincar de novo renascer leve.'
        },
        tiques_inquietacao: {
            label: '29. Inquietação Motora & Desaceleração Fisiológica (Os juncos da lagoa mansa)',
            defaultMetaphor: 'Os juncos verdes na margem do lago: quando o vento forte passa eles balançam ligeiro, mas assim que a brisa da noite chega, eles repousam imóveis espelhando a lua no silêncio.',
            defaultQuestion: 'Como o seu corpinho vai derretendo gostoso no colchão, como cera de vela morna descansando?',
            challengeAct: 'sentia os dedinhos, os pezinhos e o pescoço querendo se mexer sem parar, como se pequenas formiguinhas elétricas estivessem dançando na pele.',
            breathCue: 'esticou os braços e pernas bem compridos por cinco segundos e soltou tudo de uma vez num suspiro mole, sentindo o peso aconchegante da gravidade.'
        },
        gratidao_sono: {
            label: '30. Gratidão do Fim do Dia & Ritual de Boa-Noite (A cesta de vaga-lumes dourados)',
            defaultMetaphor: 'A cestinha invisível que a gente guarda no peito: antes de dormir, colocamos nela três momentos gostosos do dia, e cada um vira um vaga-lume dourado que brilha suave a noite inteira.',
            defaultQuestion: 'Quais foram três coisinhas simples de hoje que deixaram o seu coração quentinho de alegria?',
            challengeAct: 'lembrou de uma coisinha chata que aconteceu à tarde e quase esqueceu de todos os abraços, risadas e brincadeiras boas que também viveu.',
            breathCue: 'sorriu de olhos fechados, respirou fundo sentindo o calor dos momentos bons e soltou um agradecimento baixinho e tranquilo.'
        },
        autonomia_pequenos: {
            label: '31. Desejo de Autonomia & "Eu Faço Sozinho" (A avezinha das asas firmes)',
            defaultMetaphor: 'A avezinha jovem que aprende a quebrar a sementinha com o próprio bico: ela tenta uma, duas vezes com paciência, sabendo que quando precisar de ajuda tem sempre uma asa grande por perto.',
            defaultQuestion: 'Qual é uma coisa que você já consegue fazer sozinho com orgulho e segurança?',
            challengeAct: 'ficou zangado quando alguém tentou ajudá-lo a amarrar o sapato, querendo provar que já conseguia fazer tudo sozinho sem ninguém falar nada.',
            breathCue: 'respirou devagar sentindo a força nas mãozinhas, lembrou que pedir ajuda não diminui a nossa força e soltou um suspiro de serenidade.'
        },
        injustica_compreensao: {
            label: '32. Sentimento de "Não é Justo" & Equilíbrio (A balança sábia da montanha)',
            defaultMetaphor: 'A balança da coruja sábia da serra: às vezes um dia ganha um doce e outro dia ganha um descanso; a vida não é igualzinha em cada minuto, mas no final cabe todo o carinho e o cuidado do mundo.',
            defaultQuestion: 'O que o seu coração sente quando descobre que cada momento tem a sua hora certa e o seu presente?',
            challengeAct: 'ouviu um "agora não" para um passeio e achou o mundo a coisa mais injusta da galáxia, querendo bater o pé e gritar com o vento.',
            breathCue: 'pôs a mãozinha no peito, respirou sentindo o amor firme que cuida dos limites e soltou o ar sentindo paz e confiança no abraço protetor.'
        },
        birra_desregulacao: {
            label: '33. Birra & Desregulação Autonômica (A onda gigante que vira maré mansa)',
            defaultMetaphor: 'A onda gigante da praia que parecia querer derrubar os castelos de areia, mas que ao se espalhar na relva macia vai ficando fininha, transparente e morna até virar um espelho d’água onde a lua se deita tranquila.',
            defaultQuestion: 'Como o seu corpinho sente o alívio gostoso quando o choro forte vai embora e sobra só um abraço quentinho?',
            challengeAct: 'sentiu uma tempestade de vento quente soprar por dentro do peito, fazendo as mãos tremerem e a voz querer gritar bem alto porque nada cabia na paciência daquele instante.',
            breathCue: 'deitou a bochecha no peito protetor, sentiu o ar entrar quentinho como um cobertor e soltou um suspiro longo, sentindo a onda brava virar aguinha mansa.'
        },
        ansiedade_desempenho: {
            label: '34. Ansiedade de Desempenho & Avaliações Escolares (O pássaro que canta sem plateia)',
            defaultMetaphor: 'O sabiá-laranjeira no alto do galho florido: ele não canta para ganhar nota ou medalha de ninguém; canta simplesmente porque a música mora bonita dentro dele e voar é a sua alegria verdadeira.',
            defaultQuestion: 'Você sabe que o seu valor não depende de nenhuma nota ou prova, porque você já é precioso e amado do jeitinho que é?',
            challengeAct: 'pensou na tarefinha difícil da manhã seguinte e sentiu um friozinho apertado na garganta, com medo de esquecer as respostas e não conseguir acertar tudo.',
            breathCue: 'fechou os olhos, inspirou o ar fresco da noite enchendo o peito de calma e soltou o ar devagarzinho, lembrando que errar é só o jeito que a inteligência usa para aprender coisas novas.'
        },
        ciume_amigos: {
            label: '35. Exclusão em Brincadeiras & Ciúme de Amigos (O bosque das muitas árvores)',
            defaultMetaphor: 'O bosque encantado onde cabem todas as árvores: o jacarandá não fica triste quando a mangueira dá frutos, porque a mata inteira precisa da sombra, do perfume e do encanto de cada um para ser um refúgio acolhedor.',
            defaultQuestion: 'Como é bom lembrar que o seu espaço no coração dos amigos e de quem ama você é único e nunca pode ser tirado?',
            challengeAct: 'viu os amiguinhos cochichando e brincando em outra ponta da clareira e sentiu um aperto no peito, achando que ninguém mais se importava com a sua companhia.',
            breathCue: 'abraçou os joelhinhos devagar, respirou sentindo o próprio ar puro e doce preencher o coração, e lembrou de todos os sorrisos sinceros que já iluminaram o seu dia.'
        },
        atencao_dividida_pais: {
            label: '36. Disputa de Atenção dos Cuidadores (A lareira que aquece todos os cantos)',
            defaultMetaphor: 'O fogo manso da lareira da cabana: quando mais alguém se senta ao redor do tapete, o calor não diminui para quem já estava ali; o calor se espalha ainda mais gostoso e todo mundo fica protegido do frio juntos.',
            defaultQuestion: 'Você sente como o amor dos seus pais é infinito como o céu estrelado e cabe inteirinho ao seu redor em cada respiração?',
            challengeAct: 'sentiu vontade de chamar os pais dez vezes seguidas quando eles precisavam conversar com outra pessoa, com medo de que a atenção deles sumisse se ficasse em silêncio.',
            breathCue: 'pôs a mão no centro do peito, sentiu o calorzinho do amor que nunca vai embora e soltou o ar com a certeza de que está sempre seguro no mesmo ninho.'
        },
        medo_medico_injecao: {
            label: '37. Medo de Consultas Médicas & Vacinas (O escudo dos pequenos guerreiros)',
            defaultMetaphor: 'A gotinha de poção mágica guardada no escudo de luz: aquela picadinha pequenina de formiguinha dura só dois segundos, mas é um exército de escudos prateados que defende o corpinho contra qualquer fraqueza por anos inteiros.',
            defaultQuestion: 'Onde o seu corpinho guarda a coragem de leão para enfrentar um segundo de picadinha e depois ganhar um abraço de herói?',
            challengeAct: 'lembrou da salinha branca do médico e sentiu as perninhas congelarem com vontade de fugir para baixo da cama só de ver o estetoscópio gelado.',
            breathCue: 'apertou a mão quentinha de quem ama você, puxou o ar como quem cheira uma flor mágica e soprou como quem apaga uma velinha de aniversário, vencendo o medo num piscar de olhos.'
        },
        desapego_objeto_transicao: {
            label: '38. Desapego da Chupeta ou Objeto de Transição (A caixinha das lembranças queridas)',
            defaultMetaphor: 'O barquinho de papel que a gente solta no riacho manso: ele cumpriu sua missão linda de nos acalmar quando éramos bebês, e agora viaja livre enquanto nossas mãozinhas crescidas aprendem a segurar brinquedos ainda mais incríveis.',
            defaultQuestion: 'Qual é a brincadeira mais divertida que você adora fazer agora que já é uma criança maior e forte?',
            challengeAct: 'olhou para o objeto pequenino que sempre guardava na boca ou no colo e sentiu uma insegurança boba, sem saber como conseguiria adormecer sem aquele apoio antigo.',
            breathCue: 'abraçou o travesseiro macio bem apertadinho, respirou o perfume gostoso do quarto seguro e soltou o ar sentindo a força que já nasceu dentro do seu próprio peito.'
        },
        luto_pet: {
            label: '39. Perda de um Animalzinho Querido (A constelação dos amigos eternos)',
            defaultMetaphor: 'A estrelinha travessa que pisca lá no alto do céu: todo bichinho que parte da terra ganha asas de luz e corre por prados verdes sem fim, e sempre que a gente olha para o céu noturno, aquela luzinha carinhosa está abanando o rabinho de volta.',
            defaultQuestion: 'Qual é a lembrança mais divertida e engraçada do seu amiguinho que faz você sorrir por dentro com saudade gostosa?',
            challengeAct: 'olhou para o cantinho onde o bichinho costumava dormir encolhidinho e sentiu um silêncio doído, com uma lágrima descendo quentinha pela bochecha.',
            breathCue: 'deixou a lágrima escorrer sem medo, respirou fundo guardando toda a alegria daquele amor no coração e soprou mandando um beijinho de luz para as estrelas.'
        },
        seletividade_alimentar: {
            label: '40. Seletividade Alimentar & Curiosidade Sensorial (O banquete dos exploradores da floresta)',
            defaultMetaphor: 'O urso sábio que descobre novos frutos nas margens da floresta: ele não precisa comer tudo de uma vez; ele primeiro olha a cor bonita, cheira de mansinho, toca com a pontinha da pata e descobre sabores mágicos que dão superpoderes aos músculos.',
            defaultQuestion: 'Que cor ou textura diferente de comida nova foi legal você espiar ou cheirar hoje com curiosidade?',
            challengeAct: 'viu uma comidinha de cor verde ou diferente no prato e virou o rosto na hora, empurrando o garfo com birra antes mesmo de cheirar o sabor.',
            breathCue: 'respirou fundo sentindo o cheirinho gostoso da comida feita com carinho, relaxou a mandíbula e pensou: sou um explorador corajoso que pode experimentar devagarzinho.'
        },
        combinados_familiares: {
            label: '41. Cumprir Combinados & Cooperação Familiar (A bússola do navio em águas mansas)',
            defaultMetaphor: 'A bússola dourada do capitão da floresta: os combinados familiares não são correntes para prender, mas faróis que avisam onde estão as pedras para o barco navegar seguro e todo mundo chegar feliz na ilha dos brinquedos.',
            defaultQuestion: 'Qual foi um combinado gostoso que você ajudou a cumprir hoje e deixou todo mundo em casa com o coração quentinho?',
            challengeAct: 'quando ouviu que a hora da brincadeira tinha chegado ao fim para tomar banho e jantar, sentiu vontade de cruzar os braços e fingir que não ouviu o chamado.',
            breathCue: 'fechou os olhos, respirou contando mentalmente até quatro lembrando que quem sabe cooperar navega com firmeza, e estendeu a mãozinha com um sorriso confiante.'
        },
        perdao_reparacao: {
            label: '42. Reparação e Autoacolhimento após o Erro (A borracha mágica do carinho)',
            defaultMetaphor: 'O caderno dos pequenos pintores das estrelas: quando um traço sai torto no papel, a gente não joga a folha fora; a gente usa a borracha macia do abraço, pede desculpas e desenha uma borboleta colorida por cima.',
            defaultQuestion: 'Como é bom saber que quando a gente erra uma coisinha, um abraço de desculpa deixa tudo limpo e leve outra vez?',
            challengeAct: 'derrubou sem querer a torre de blocos ou falou uma palavra ríspida no momento de aperto, e logo sentiu um nó gelado na garganta, achando que todo mundo ficaria bravo para sempre.',
            breathCue: 'colocou a mão sobre o peito, soltou um suspiro comprido e suave sentindo que errar faz parte do aprendizado de todos os guardiões gentis.'
        },
        coragem_pedir_ajuda: {
            label: '43. Pedir Ajuda sem Medo (O canto de chamado dos passarinhos)',
            defaultMetaphor: 'Os filhotes de arara-azul na copa mais alta: eles não tentam carregar a semente mais pesada sozinhos. Quando a patinha cansa, eles abrem as asas e soltam um piado doce para a mãe e o pai voarem juntos ao lado.',
            defaultQuestion: 'Quando você precisa de uma mãozinha amiga, quem é a pessoa que você mais gosta de chamar com carinho?',
            challengeAct: 'tentou amarrar o tênis, alcançar um brinquedo no alto ou resolver uma tarefa difícil sozinho, ficando com os olhos cheios de água porque parecia difícil demais para um par de mãos apenas.',
            breathCue: 'respirou bem fundo, relaxou os ombros e percebeu que pedir ajuda com voz calma é o maior sinal de sabedoria e coragem.'
        },
        paciencia_irmaos: {
            label: '44. Convivência Fraterna & Espaço Partilhado (Os dois barquinhos no mesmo rio)',
            defaultMetaphor: 'Os dois pequenos castores na represa do riacho: quando um quer um galho e o outro quer o mesmo tronco, eles descobrem que juntando as forças conseguem construir um castelo d\'água duas vezes mais bonito e quentinho para dormir.',
            defaultQuestion: 'O que foi gostoso brincar ou conversar com seu irmão ou amiguinho hoje quando vocês dividiram com alegria?',
            challengeAct: 'viu o irmão ou o colega pegando o objeto que queria brincar bem naquela hora, e sentiu a mãozinha fechar querendo puxar de volta com força.',
            breathCue: 'soprou o ar devagarinho como quem sopra uma velinha mágica de aniversário, lembrando que a amizade vale mais do que qualquer brinquedo de plástico.'
        },
        desacelerar_corpo: {
            label: '45. Desaceleração Somática & Transição para o Sono (A locomotiva a vapor das estrelas)',
            defaultMetaphor: 'A locomotiva de brinquedo que viajou o dia inteiro apitando e correndo pelos trilhos de ferro: ao chegar na estação das nuvens douradas, o maquinista desliga o motor, o vapor sai num suspiro fofo e cada vagão pousa macio sobre o algodão da noite.',
            defaultQuestion: 'Qual pedacinho do seu corpo — os pezinhos, as pernas ou os ombros — está mais molinho e pronto para sonhar agora?',
            challengeAct: 'o relógio avisava que era hora de deitar, mas as perninhas ainda queriam pular na cama e os pensamentos continuavam rodando como um pião elétrico veloz.',
            breathCue: 'deitou a cabeça no travesseiro, soltou todo o peso do corpo sobre o colchão fofo e soltou o ar fazendo o som suave do vapor: ssshhhh… até tudo ficar imóvel e calmo.'
        },
        tolerancia_erro: {
            label: '46. Desfusão do Perfeccionismo & Flexibilidade (A teia de orvalho da aranha sábia)',
            defaultMetaphor: 'A pequena aranha tecelã da floresta: quando uma gota de chuva cai e deixa um fiozinho da teia torto, ela não desmancha tudo; ela nota que a gota brilha feito um diamante sob o luar justamente porque a teia é única e natural.',
            defaultQuestion: 'O que você fez hoje do seu jeitinho que ficou especial, mesmo sem ser perfeitinho?',
            challengeAct: 'estava desenhando ou montando um quebra-cabeça e, quando uma peça não encaixou reta como imaginava na cabeça, quis amassar o papel e jogar tudo no chão.',
            breathCue: 'olhou para o desenho com carinho, respirou fundo três vezes sentindo o ar fresco encher o peito e pensou: o meu melhor de hoje já é perfeito para o meu coração.'
        },
        despedida_telas: {
            label: '47. Despedida das Telas & Anoitecer Suave (O vilarejo dos olhinhos)',
            defaultMetaphor: 'O vilarejo encantado onde moram todas as cores: quando a lua sobe, o guardião apaga uma por uma as lanternas fortes das janelas para que os moradores consigam fechar as pálpebras em paz no escuro aveludado.',
            defaultQuestion: 'Qual sonho bonito você quer chamar para a sua cabecinha agora que os olhinhos descansam no escurinho macio?',
            challengeAct: 'queria continuar assistindo a mais um desenho brilhante na telinha, com os olhinhos piscando cansados e o corpo irritado querendo lutar contra a hora de dormir.',
            breathCue: 'fechou as pálpebras devagarinho, inspirou sentindo o ar fresco acalmar as bochechas e soltou num suspiro gostoso como quem desliga a última luzinha do castelo.'
        },
        irmandade_partilha: {
            label: '48. Conflitos de Convivência & Partilha de Espaço (Os dois riachos da mesma montanha)',
            defaultMetaphor: 'Os dois riachos transparentes que nascem no mesmo topo de serra: quando correm lado a lado, eles cantam uma melodia duas vezes mais alegre e descobrem que cabem todos os peixinhos e todas as brincadeiras na mesma correnteza de afeto.',
            defaultQuestion: 'Como o nosso abraço fica mais gostoso quando a gente decide rir e brincar junto sem disputar quem é o primeiro?',
            challengeAct: 'achou que o outro estava ocupando espaço demais no quarto e sentiu vontade de empurrar as almofadas e emburrar a carinha num canto.',
            breathCue: 'soltou o ar bem longo, tocou o próprio peito sentindo o calor do carinho fraterno e deu um sorriso manso que dissolveu a briga na hora.'
        },
        vozes_noite: {
            label: '49. Sons Noturnos Estranhos & Imaginação Serena (O vento artesão da madeira)',
            defaultMetaphor: 'O vento carpinteiro da serra: à noite ele passa suavemente pelas frestas das árvores e do telhado como quem afina uma viola caipira de madeira boa, tocando uma música de ninar que protege a casa.',
            defaultQuestion: 'Você sabe que cada estalo da casa é só a madeira descansando do calor do dia, exatamente como nós dois na cama quentinha?',
            challengeAct: 'ouviu um estalo na parede e o vento assobiar na janela, arregalando os olhos e achando que havia algo misterioso rondando o quarto.',
            breathCue: 'segurou bem firme a mão protetora ao lado, puxou o ar ouvindo o ritmo seguro da própria respiração e soltou relaxando os dedinhos dos pés até a testa.'
        },
        autocompaixao_pequenos: {
            label: '50. Autocompaixão Infantil & Dias Difíceis (O dia cinzento que ganha um abraço)',
            defaultMetaphor: 'A florzinha do campo que enfrentou um dia de vento forte e poeira: ela não fica zangada consigo mesma por ter dobrado um pouquinho as folhas; ela apenas recolhe as pétalas, descansa na noite fresca e sabe que amanhã o sol vai brilhar de novo para ela.',
            defaultQuestion: 'O que o seu coração mais precisa ouvir esta noite: que você é muito amado, ou que amanhã é uma página novinha em folha?',
            challengeAct: 'teve um dia em que quase tudo deu errado, levou bronca, tropeçou e achou que era a pessoa mais desastrada do mundo inteiro.',
            breathCue: 'abraçou o travesseiro com ternura, respirou fundo sentindo o abraço de perdão e acolhimento e soltou o ar dizendo baixinho: eu sou bom, eu sou querido, eu posso descansar.'
        },
        despedida_viagem: {
            label: '51. Volta para Casa & Fim de Passeio (A conchinha do retorno ao ninho)',
            defaultMetaphor: 'A tartaruguinha marinheira que viajou mares distantes e conheceu recifes coloridos: quando a maré baixa ela volta para a sua enseada quentinha, sabendo que todas as lembranças lindas viajaram com ela dentro do casco.',
            defaultQuestion: 'Qual foi o momento mais feliz do nosso passeio que você quer guardar dentro da sua caixinha secreta do coração?',
            challengeAct: 'ficou com o peito apertado e triste porque a viagem ou o fim de semana gostoso acabou, querendo que o tempo parasse no relógio.',
            breathCue: 'respirou o cheirinho familiar do próprio travesseiro, soltou os ombros pesados e sorriu lembrando que voltar para o ninho seguro é uma delícia.'
        },
        respiracao_ursinho: {
            label: '52. Ancoragem Corporal & O Ursinho na Barriga (A técnica da onda serena)',
            defaultMetaphor: 'O ursinho de pelúcia que viaja de barquinho sobre a barriguinha: quando o ar entra mansinho, o barquinho sobe até o céu; quando o ar sai suave, o barquinho desce descansando na água morna sem fazer marola.',
            defaultQuestion: 'Quantas ondas mansas o seu barquinho já fez até o seu corpinho ficar todo molinho e leve?',
            challengeAct: 'estava com o peito inquieto e as mãos agitadas, sem saber direito como fazer o corpo obedecer à ordem de desacelerar.',
            breathCue: 'pôs a mãozinha ou o bichinho sobre o umbigo, puxou o ar contando um, dois, três… e soltou devagarzinho observando o mar calmo do sono se abrir.'
        },
        separacao_noturna: {
            label: '53. Ansiedade de Separação Noturna (A âncora de luz na enseada mansa)',
            defaultMetaphor: 'A âncora dourada do barquinho na enseada: mesmo quando a noite fica toda escura e o capitão não vê o fundo, a âncora do amor dos pais continua firme, segura e segurando o barquinho com carinho para nada levá-lo embora.',
            defaultQuestion: 'Você consegue sentir como o nosso abraço fica coladinho em você mesmo quando cada um está no seu travesseiro?',
            challengeAct: 'olhou para a porta do quarto que começava a fechar devagarinho e sentiu um aperto no peito, querendo pular da cama dez vezes seguidas só para checar se os pais continuavam na sala ao lado.',
            breathCue: 'abraçou o cobertor bem fofinho, inspirou o ar quentinho como chá de hortelã e soltou o ar sentindo a âncora invisível do amor proteger o quarto inteiro.'
        },
        sensibilidade_tatil: {
            label: '54. Sensibilidade Tátil & Roupas/Etiquetas (O casaco macio do coelhinho da colina)',
            defaultMetaphor: 'O coelhinho da montanha que tinha as orelhas e a pele mais sensíveis de toda a floresta: quando uma folha áspera encostava nele, ele sabia que podia escolher a folha aveludada do musgo macio para repousar com calma sem precisar chorar.',
            defaultQuestion: 'Qual cantinho da sua cama é o mais gostoso e fofinho para a sua pele descansar sem nada pinicar?',
            challengeAct: 'sentiu a costura da meia ou a etiqueta do pijama pinicar como se fossem cem formiguinhas de ponta, ficando irritado e querendo arrancar tudo com raiva.',
            breathCue: 'passou a mãozinha devagar pela parte mais macia do lençol, respirou fundo sentindo a pele amolecer e soprou devagarinho desarmando qualquer cócega chata.'
        },
        acolhimento_choro: {
            label: '55. Acolhimento do Choro sem Vergonha (A chuva mansa que limpa a janela)',
            defaultMetaphor: 'A chuva doce de fim de tarde que lava a vidraça da cabana: as lágrimas são apenas água mansa que a natureza manda para limpar a poeira das preocupações. Depois que a gotinha cai no colinho acolhedor, a vista fica limpa e o céu se abre estrelado.',
            defaultQuestion: 'Você sabe que no nosso ninho você nunca precisa engolir o choro, e que uma lágrima no colinho sempre vira aconchego?',
            challengeAct: 'sentiu o queixo tremer e uma vontade imensa de chorar, mas apertou as bochechas com força achando que quem já é grandinho não pode chorar na frente dos outros.',
            breathCue: 'deixou as lágrimas escorrerem mansas e quentes, puxou o ar ouvindo uma voz carinhosa dizer "está tudo bem" e soltou um suspiro de alívio libertador.'
        },
        transicao_banho_refeicao: {
            label: '56. Transição de Brincadeira para o Banho/Jantar (O trem mágico que troca de estação)',
            defaultMetaphor: 'O trenzinho da floresta que viaja por estações encantadas: ele não precisa jogar fora os brinquedos da Estação das Brincadeiras; ele apenas estaciona na plataforma da Estação do Banho Quentinho, sabendo que amanhã o trem volta com força total.',
            defaultQuestion: 'O que foi mais legal guardar na memória do seu dia para continuar brincando na sua imaginação durante o banho e o sono?',
            challengeAct: 'estava no meio de uma construção com bloquinhos coloridos e, quando ouviu que o banho estava pronto, quis gritar e dizer que não ia sair dali de jeito nenhum.',
            breathCue: 'deu uma piscadinha para os blocos dizendo "até amanhã, amigos", respirou fundo sentindo o cheiro acolhedor do sabonete e deu três passos com um sorriso no rosto.'
        },
        perda_peca_brinquedo: {
            label: '57. Tolerância ao Perder Peça de Brinquedo (A expedição arqueológica na sala de estar)',
            defaultMetaphor: 'Os sábios exploradores da serra: quando uma pedrinha brilhante cai numa fresta, eles não cancelam a expedição; eles sabem que o brinquedo mais valioso de todos é a própria inteligência que inventa novas histórias incríveis.',
            defaultQuestion: 'Qual nova brincadeira mágica você consegue inventar com as peças que continuam na sua mãozinha?',
            challengeAct: 'procurou a rodinha do carrinho embaixo do tapete e não encontrou, sentindo uma frustração pesada subir pelo estômago querendo desistir de tudo.',
            breathCue: 'abriu as mãozinhas sobre as pernas, respirou fundo sentindo a calma encher os pulmões e pensou: sou muito maior e mais esperto do que uma pecinha perdida.'
        },
        tempestade_vento: {
            label: '58. Segurança Diante de Tempestades de Vento (As raízes profundas da sumaúma protetora)',
            defaultMetaphor: 'A sumaúma gigante que abraça o chão da mata: lá no alto os galhos dançam ao som da ventania, mas lá embaixo, onde as raízes abraçam a terra mãe, nada se mexe. A nossa casa é a raiz forte onde você está eternamente seguro.',
            defaultQuestion: 'Como é bom saber que lá fora o vento pode soprar forte, mas aqui dentro a nossa casinha é um escudo inquebrável?',
            challengeAct: 'ouviu as folhas estalarem e o vento assobiar forte nos vidros, puxando o cobertor com medo de que a casa balançasse como um galho fino.',
            breathCue: 'apoiou os pezinhos firmes no colchão, puxou o ar sentindo a solidez das paredes e soltou soprando de volta para o vento com coragem serena.'
        },
        sons_subitos: {
            label: '59. Medo de Trovões & Sons Súbitos Repentinos (Os tambores dos gigantes amigos das nuvens)',
            defaultMetaphor: 'Os grandes tambores de festa dos gigantes das montanhas: eles tocam lá no alto para comemorar a chegada da chuva que refresca as plantinhas. O barulho alto dura só um segundo e depois vem um silêncio gostoso de frescor.',
            defaultQuestion: 'Onde o seu peito mais gosta de se aconchegar quando o céu dá um estalo e logo depois sopra um ar fresquinho?',
            challengeAct: 'assustou-se com um trovão estalando perto da janela e sentiu o coração disparar como uma buzina assustada, querendo tapar a cabeça com tudo.',
            breathCue: 'abraçou forte o colinho seguro, inspirou contando um, dois, três e soltou relaxando os ombros, percebendo que o trovão já virou passado e sumiu na serra.'
        },
        cansaco_extremo: {
            label: '60. Autoaceitação Diante do Cansaço Extremo (O ninho que acolhe as asinhas pesadas)',
            defaultMetaphor: 'O beija-flor de penas esmeralda que bateu as asinhas cem mil vezes no ar: ele não precisa continuar voando quando a lua sobe; ele recolhe o biquinho, deita no ninho de paina e deixa as asinhas descansarem moles sem peso nenhum.',
            defaultQuestion: 'Você sente como suas pálpebras estão doces e pesadas, e como é gostoso entregar todo o cansaço para o sono cuidar?',
            challengeAct: 'estava tão cansado que tudo parecia irritante e difícil, tropeçando nos próprios pés e quase chorando só por ter que escovar os dentes.',
            breathCue: 'fechou os olhinhos pesados, soltou um bocejo bem gostoso e comprido, e sentiu o corpo afundar no abraço quentinho do travesseiro até adormecer em paz.'
        },
        interocepcao_sinais: {
            label: '61. Interocepção & Sinais Corporais Sutis (A bússola do marinheiro do corpo)',
            defaultMetaphor: 'A pequena bússola de latão dourado que o marinheiro carrega no bolso: ela não faz barulho, mas aponta suavemente para o norte quando o corpinho precisa de água fresca, comida quentinha ou descanso macio antes que a tempestade comece.',
            defaultQuestion: 'Qual sinalzinho manso o seu corpinho dá para você quando avisa que é hora de deitar e relaxar?',
            challengeAct: 'não percebeu que a sede e o cansaço estavam acumulando desde a tarde, sentindo o peito apertar de repente como se o mundo inteiro estivesse pesado demais sem motivo aparente.',
            breathCue: 'colocou a mãozinha na barriga, sentiu o ritmo manso da respiração como o vaivém do mar calmo e escutou o carinho que o corpo pedia.'
        },
        alexitimia_paleta: {
            label: '62. Nomear Sentimentos Misturados (A paleta de aquarelas da alma)',
            defaultMetaphor: 'O estojo de tintas do pintor da floresta: às vezes o azul da saudade e o amarelo da alegria se misturam numa gotinha verde de esperança. Não precisamos ter um sentimento só; nosso coração é grande o bastante para abrigar todas as cores do mundo.',
            defaultQuestion: 'Se você pudesse pintar a sensação gostosa deste momento com uma cor mágica, qual cor seria?',
            challengeAct: 'sentiu uma confusão de emoções no peito sem saber dizer se estava bravo, triste ou com saudade, com a garganta travada sem achar as palavras certas.',
            breathCue: 'respirou devagarzinho imaginando uma luz suave clarear o peito, sabendo que sentir tudo ao mesmo tempo é natural e acolhedor.'
        },
        espaco_fraterno: {
            label: '63. Rivalidade Fraterna & Espaço Pessoal (O arquipélago das ilhas encantadas)',
            defaultMetaphor: 'O arquipélago no mar tranquilo: cada ilha tem seus coqueiros e sua prainha única, e entre uma ilha e outra corre uma água límpida onde os peixinhos nadam juntos. Ter seu cantinho sagrado faz a brincadeira compartilhada ficar ainda mais especial.',
            defaultQuestion: 'Como é gostoso ter o seu espacinho único e depois se juntar para dar risada em família?',
            challengeAct: 'ficou irritado quando o irmãozinho ou primo invadiu a sua cabaninha de almofadas sem pedir licença, sentindo vontade de empurrar tudo com brava indignação.',
            breathCue: 'deu dois passos lentos para trás, puxou o ar puro enchendo o próprio espaço de tranquilidade e falou com voz calma e firme o que precisava.'
        },
        sensibilidade_tatil: {
            label: '64. Sensibilidade Tátil a Roupas & Etiquetas (O linho macio da fada tecelã)',
            defaultMetaphor: 'O linho macio da fada das florestas: a pele dos seres mais sensíveis é como pétala de rosa que sente até o menor grãozinho de areia. Essa delicadeza é um dom que ensina o mundo a tocar tudo com máxima gentileza e respeito.',
            defaultQuestion: 'Como o seu corpinho fica leve e solto agora que está com o pijama mais macio e gostoso do mundo?',
            challengeAct: 'sentiu uma costura ou etiqueta incomodar como se fosse uma farpinha no pescoço, ficando inquieto e querendo arrancar a roupa com aflição.',
            breathCue: 'respirou fundo sentindo o ar fresco afagar a pele, relaxou os ombros caídos e deixou o toque suave do lençol abraçar o descanso.'
        },
        transicao_ferias: {
            label: '65. Fim de Férias & Retorno à Rotina Escolar (O baú dos tesouros da andorinha)',
            defaultMetaphor: 'O baú encantado da andorinha viajante: ela recolhe conchinhas, pedrinhas brilhantes e risadas das suas viagens, guarda no coração e leva tudo consigo para iluminar os dias novos de aula e descobertas com os amigos.',
            defaultQuestion: 'Qual lembrança divertida das brincadeiras você vai levar guardada no peito para o seu novo dia amanhã?',
            challengeAct: 'olhou para os cadernos e sentiu um aperto de saudade dos dias livres no sol, querendo congelar o tempo para as férias não acabarem.',
            breathCue: 'abraçou o travesseiro com ternura, puxou o ar sentindo orgulho de tudo o que viveu e soprou mansinho, pronto para viver novas aventuras.'
        },
        rigidez_rota: {
            label: '66. Rigidez de Rota & Flexibilidade no Caminho (Os muitos atalhos do cervo saltador)',
            defaultMetaphor: 'Os caminhos floridos do cervo sábio: quando uma árvore caída fecha a trilha de sempre, ele salta com leveza por um atalho novo de musgo e encontra uma nascente secreta cheia de vaga-lumes dourados.',
            defaultQuestion: 'Que coisa interessante e diferente a gente conseguiu reparar hoje quando o caminho precisou mudar?',
            challengeAct: 'percebeu que o trajeto de carro ou a sequência do passeio não foi exatamente igual ao habitual e sentiu o peito endurecer em aflição.',
            breathCue: 'soltou o queixo e as mãozinhas bem moles, respirou sentindo que o coração pode ser flexível como bambu verde que dança no vento sem quebrar.'
        },
        sombras_noturnas: {
            label: '67. Desmistificar Sombras no Teto (A trupe de teatro dos vaga-lumes)',
            defaultMetaphor: 'O teatrinho de sombras da trupe dos vaga-lumes: aquela forma comprida na parede é apenas o galhinho do jasmineiro dançando ao vento lá fora contra a lua prateada, encenando uma dança amiga para desejar boa-noite.',
            defaultQuestion: 'Se aquela sombrinha no teto fosse um bichinho brincalhão dando tchau para você dormir, qual bichinho seria?',
            challengeAct: 'olhou para o reflexo na parede escura e o coração deu um pulo rápido imaginando um vulto misterioso onde só havia silêncio.',
            breathCue: 'olhou com curiosidade mansa, respirou fundo acendendo a luz da coragem nos olhos e sorriu ao ver que era só um galho amigo.'
        },
        cama_propria: {
            label: '68. Autonomia para Dormir a Noite Toda na Própria Cama (O capitão do navio dos sonhos)',
            defaultMetaphor: 'O capitão corajoso no seu próprio veleiro de algodão: o seu quarto é o navio mais seguro dos sete mares, com velas de lençol quentinho e uma âncora de amor que liga o seu berço direto ao quarto dos guardiões vizinhos.',
            defaultQuestion: 'Como é aconchegante e seguro navegar a noite inteira no seu próprio barquinho de paz?',
            challengeAct: 'acordou no meio da noite e sentiu vontade de correr assustado para outra cama, temendo ficar sozinho naquele quarto espaçoso.',
            breathCue: 'abraçou seu bichinho de pelúcia preferido, puxou o ar sentindo a proteção das paredes seguras e deitou a cabeça relaxando em sono profundo.'
        },
        vergonha_erro: {
            label: '69. Acolhimento da Vergonha após Queda ou Erro (O palhacinho gentil que reverencia o chão)',
            defaultMetaphor: 'O palhacinho gentil do circo das estrelas: quando ele tropeça e cai na relva macia, ele abre um sorriso bondoso, faz uma reverência engraçada para o chão e descobre que todo mundo tropeça para aprender a dançar melhor.',
            defaultQuestion: 'Você sabe como o seu jeitinho é perfeito, e como errar de vez em quando é apenas um jeito divertido de aprender?',
            challengeAct: 'tropeçou ou errou uma palavra na frente dos outros e sentiu as bochechas queimarem como duas brasas, com vontade de se esconder num buraco.',
            breathCue: 'deu uma risadinha suave para si mesmo, respirou fundo enchendo o peito de autoacolhimento e percebeu que o carinho continuava intacto.'
        },
        respiracao_choro: {
            label: '70. Regulação da Respiração no Ataque de Choro (A flor que desabrocha em quatro tempos)',
            defaultMetaphor: 'A flor-de-lótus da lagoa mansa: quando a chuva bate forte suas pétalas se fecham para proteger o coraçãozinho de pólen. Depois ela abre suave em quatro tempos lentos e perfuma toda a noite estrelada.',
            defaultQuestion: 'Como o ar entra fresquinho e sai macio quando você solta todo o arzinho velho do choro?',
            challengeAct: 'sentiu o soluço do choro acelerar a respiração em suspiros curtos e entrecortados, com o peito parecendo um tamborzinho descontrolado.',
            breathCue: 'segurou o ar por um instante calmo, e soltou devagarinho soprando uma bolha de sabão imaginária até o peito sossegar totalmente.'
        },
        urgencia_imediatismo: {
            label: '71. Impulsividade "Quero Agora" & Espera Fértil (O relojoeiro das sementes de carvalho)',
            defaultMetaphor: 'O relojoeiro ancestral das sementes de carvalho: nenhuma árvore majestosa nasce num estalar de dedos. O segredo da magia é deixar o tempo regar a terra em silêncio para que a madeira cresça forte e inquebrável.',
            defaultQuestion: 'O que o seu coração sente quando descobre que esperar um pouquinho torna a comemoração ainda mais saborosa?',
            challengeAct: 'queria que a resposta ou o brinquedo chegassem naquele exato segundo, ficando agitado e impaciente como água fervendo na panela.',
            breathCue: 'pôs a mão no centro do peito, respirou fundo sentindo a paciência firme de uma montanha e soltou o ar sereno como névoa da serra.'
        },
        conforto_silencio: {
            label: '72. Medo do Silêncio & Paz Interior (A canção suave que mora dentro da calma)',
            defaultMetaphor: 'A canção doce e sem palavras que mora dentro do silêncio: quando o quarto fica bem quietinho, não é vazio que existe ali; é um manto morno de veludo onde os pensamentos podem deitar sem pressa e sonhar bonito.',
            defaultQuestion: 'Como é suave ouvir a musiquinha mansa da sua própria respiração embalando o seu sono esta noite?',
            challengeAct: 'sentiu aflição com o silêncio da casa apagada, querendo barulhos ou luzes acesas para não se sentir sozinho na quietude da noite.',
            breathCue: 'fechou os olhinhos com doçura, escutou o arzinho gostoso entrando e saindo do nariz e sentiu o abraço fofo do silêncio acolher o seu descanso.'
        }
    };

    // =========================================================================
    // 2. 14 CENÁRIOS POÉTICOS BRASILEIROS E CÓSMICOS
    // =========================================================================
    const STORY_SCENARIOS = {
        cerrado: {
            label: 'Cerrado & Animais Brasileiros',
            opening: 'Quando o sol alaranjado se escondeu atrás das chapadas silenciosas do Cerrado, o vento morno passou penteando o capim-dourado e espalhando perfume de flor de pequi.',
            guide: 'um Lobo-Guará de passos macios e olhar muito calmo, amigo de uma corujinha-buraqueira sonolenta',
            closing: 'Nas veredas cristalinas, os buritis balançavam devagarinho, o Lobo-Guará se enroscou na relva macia e todo o Cerrado respirou num silêncio doce e profundo.'
        },
        pantanal: {
            label: 'Pantanal & Floresta das Águas Calmas',
            opening: 'À beira de uma baía espelhada do Pantanal onde vitórias-régias flutuavam como berços verdes gigantes, pequenas gotas de orvalho começavam a brilhar sob o luar prateado.',
            guide: 'uma Lontra gentil de pelo aveludado e um tuiuiú sábio de bico longo que sabia o momento exato de fechar as asas e dormir',
            closing: 'A água morna continuou cantando baixinho entre os camalotes, embalando cada peixinho e cada garça num sono sereno até o amanhecer.'
        },
        mata_atlantica: {
            label: 'Mata Atlântica & Mico-Leão Dourado',
            opening: 'Entre bromélias orvalhadas e orquídeas perfumadas nas encostas da Serra do Mar, os vaga-lumes acendiam pequenas lanternas douradas enquanto a brisa da tardinha trazia frescor de terra úmida.',
            guide: 'um pequeno Mico-Leão Dourado de pelo macio e uma preguiçinha de três dedos que conhecia a arte de não ter pressa nenhuma',
            closing: 'As folhas compridas das samambaias formaram um teto verde protetor, guardando o sono de todos os bichinhos com ternura e abrigo absoluto.'
        },
        amazonia: {
            label: 'Floresta Amazônica & Rio Manso',
            opening: 'Debaixo das copas majestosas de sumaúmas milenares, onde o grande rio corria como um espelho de prata escura, o canto de uma juriti sonolenta ecoava mansinho pelas margens.',
            guide: 'um Boto-Rosa brincalhão que agora descansava na água rasa e um Bicho-Preguiça sereno com sorriso acolhedor',
            closing: 'O murmúrio das águas profundas e o aroma gostoso de castanheira embalaram a clareira inteira num repouso seguro e tranquilo.'
        },
        caatinga: {
            label: 'Caatinga Serenada & Tatu-Bola Paciente',
            opening: 'Ao cair da noite no sertão, quando o calor forte do dia deu lugar a uma brisa deliciosa e fresca, os mandacarus abriram suas flores brancas sob uma abóbada de estrelas brilhantes.',
            guide: 'um Tatu-Bola de passos cuidadosos que sabia como se encolher feito bolinha para descansar em segurança total',
            closing: 'O luar iluminou as pedras acolhedoras da serra, e o silêncio manso do sertão envolveu cada toca num calorzinho de paz e abrigo.'
        },
        estrelas: {
            label: 'Viagem pelas Estrelas & Cruzeiro do Sul',
            opening: 'Lá no alto, onde as nuvens parecem travesseiros de algodão morno, um barquinho de madeira encantada deslizava silenciosamente pelo céu azul-profundo.',
            guide: 'a Estrela-Guia do Cruzeiro do Sul e uma pequena Lua crescente de sorriso acolhedor',
            closing: 'O barquinho ancorou numa nuvem macia e silenciosa, coberto por um lençol de poeira estelar morna que convidava os olhos a pesarem devagar.'
        },
        serra_canastra: {
            label: 'Serra da Canastra & Nascentes Cristalinas',
            opening: 'No alto dos campos de altitude da Canastra, onde o grande rio nasce mansinho como um fio de cristal entre pedras musgosas, uma névoa suave descia cobrindo as colinas de orvalho fresco.',
            guide: 'um Tamanduá-Bandeira de cauda imensa e felpuda, que se aconchegava numa curva do morro como um xale protetor',
            closing: 'A água da nascente continuou cantando uma canção de ninar milenar, e o vento puro da montanha guardou o descanso com paz incondicional.'
        },
        veadeiros: {
            label: 'Chapada dos Veadeiros & Jardim de Cristais',
            opening: 'Entre os cânions prateados e jardins secretos de flores do cerrado, pedras de quartzo refletiam a luz da lua cheia como pequenos vaga-lumes adormecidos.',
            guide: 'uma Arara-Canindé de penas aveludadas que pousava suave num galho alto para contemplar o silêncio do vale',
            closing: 'As cachoeiras distantes murmuravam um sussurro constante, embalando os pensamentos num ritmo lento de paz e serenidade.'
        },
        lencois: {
            label: 'Lençóis Maranhenses & Dunas de Vento Manso',
            opening: 'Sobre as dunas brancas como farinha fina, lagoas de água doce refletiam o céu estrelado enquanto o vento do mar soprava calmo e refrescante.',
            guide: 'um Maçarico-da-Praia de passos pequeninos que descansava na beira da água morna sem medo nenhum do mar',
            closing: 'O vento desenhou ondas suaves na areia branca e todo o areal adormeceu sob uma abóbada brilhante de constelações tranquilas.'
        },
        noronha: {
            label: 'Fernando de Noronha & Tartarugas Marinhas',
            opening: 'Nas águas mornas e esmeralda da Baía dos Porcos, as ondas beijavam as pedras vulcânicas com um ritmo de berço enquanto o pôr do sol dourava o Morro Dois Irmãos.',
            guide: 'uma Tartaruga-Marinha centenária de nado gracioso e olhar sereno, companheira de um golfinho brincalhão adormecido na enseada',
            closing: 'A maré mansa cobriu os corais com um véu morno de espuma branca, e o oceano inteiro sussurrou uma canção de ninar profunda.'
        },
        araucarias: {
            label: 'Floresta de Araucárias & Pinhão da Serra da Mantiqueira',
            opening: 'No alto dos contrafortes da Mantiqueira, onde copas de pinheiros ancestrais recortavam o céu límpido e frio, a brisa trazia cheiro gostoso de fogueira mansa e orvalho.',
            guide: 'uma Gralha-Azul sábia que descansava sobre um galho largo de pinheiro e um Esquilo serelepe aninhado num oco quentinho',
            closing: 'O manto de estrelas iluminou o topo das montanhas verdes, e o silêncio puro da serra guardou o descanso com calor e abrigo inabalável.'
        },
        jalapao: {
            label: 'Jalapão & Fervedouro de Águas Cristalinas',
            opening: 'No coração do cerrado dourado, onde a água pura brota da areia branca e não deixa ninguém afundar, o céu noturno refletia cada constelação num espelho d’água perfeito.',
            guide: 'uma Ariranha de pelo aveludado e passos tranquilos que conhecia o segredo de flutuar sem nenhum esforço',
            closing: 'A água morna do fervedouro continuou brotando num sussurro constante de borbulhas, embalando o corpinho numa sensação de leveza total.'
        },
        ilha_mel: {
            label: 'Ilha do Mel & Enseada dos Golfinhos Noturnos',
            opening: 'Na ponta da praia mansa da Ilha do Mel, onde o farol das Conchas gira um feixe suave sobre o mar prateado, a brisa do oceano soprava morna e perfumada de flor de restinga.',
            guide: 'um Golfinho-Cinza de respiração calma que nadava devagarinho acompanhado de uma Gaivota pousada na areia lisa',
            closing: 'As ondas pequenas beijaram a areia num ritmo manso de ninar, e o manto estrelado da baía cobriu o sono com tranquilidade absoluta.'
        },
        gruta_bonito: {
            label: 'Bonito & Nascente Cristalina do Rio Formoso',
            opening: 'Em meio às pedras de calcário azulado e matas silenciosas de Bonito, a nascente brotava tão pura e transparente que parecia água de vidro mágico sob a luz da lua.',
            guide: 'um Peixe-Piraputanga de cauda dourada que descansava sereno na sombra de uma planta aquática fresca',
            closing: 'A água continuou fluindo macia e silenciosa entre os seixos lisos, lavando todo o cansaço e ninando os pensamentos num sossego profundo.'
        }
    };

    let savedStories = [];
    let currentComposedStory = { title: '', text: '', question: '', theme: '', scenario: '', source: 'Modular Offline' };
    let amberFontSizeRem = 1.25;
    let activeAmberTheme = 'amber';
    let autoScrollInterval = null;
    let isAutoScrolling = false;
    let sleepTimerTimeout = null;

    const AMBER_PREFS_KEY = 'dm_vault_amber_prefs';

    function loadAmberPrefs() {
        const C = global.VaultCore;
        if (!C || !C.store) return;
        const saved = C.store.get(AMBER_PREFS_KEY, null);
        if (saved && typeof saved === 'object') {
            if (saved.fontSizeRem) amberFontSizeRem = Math.max(0.85, Math.min(2.4, Number(saved.fontSizeRem)));
            if (saved.theme && AMBER_PALETTES[saved.theme]) activeAmberTheme = saved.theme;
        }
    }

    function saveAmberPrefs() {
        const C = global.VaultCore;
        if (!C || !C.store) return;
        C.store.set(AMBER_PREFS_KEY, {
            fontSizeRem: amberFontSizeRem,
            theme: activeAmberTheme
        });
    }

    // =========================================================================
    // 3. SINTETIZADOR ACÚSTICO WEB AUDIO API PRÉ-SONO (OFFLINE NATIVO)
    // =========================================================================
    let audioCtx = null;
    let soundSourceNode = null;
    let soundGainNode = null;
    let isRelaxAudioPlaying = false;

    function getOrCreateAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContextClass();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function startRelaxationAudio(mode = 'brown') {
        const ctx = getOrCreateAudioContext();
        stopRelaxationAudio();

        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        if (mode === 'brown') {
            // Ruído Marrom Profundo com integração
            let lastOut = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5;
            }
        } else if (mode === 'rain') {
            // Chuva Mansa na Mata (Ruído rosa com modulação estocástica)
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
                b6 = white * 0.115926;
            }
        } else if (mode === 'wave') {
            // Ondas Noturnas Suaves (modulação senoidal lenta de baixa frequência)
            let lastOut = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                const waveMod = Math.sin((i / bufferSize) * Math.PI * 4) * 0.35 + 0.65;
                output[i] *= waveMod * 3.0;
            }
        } else {
            // Grilos & Brisa da Floresta
            let lastOut = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.015 * white)) / 1.015;
                lastOut = output[i];
                const cricketPulse = (i % (ctx.sampleRate / 8) < (ctx.sampleRate / 24)) ? (Math.sin(i * 0.3) * 0.08) : 0;
                output[i] = output[i] * 1.8 + cricketPulse;
            }
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = mode === 'brown' ? 320 : (mode === 'rain' ? 800 : (mode === 'wave' ? 420 : 650));

        soundGainNode = ctx.createGain();
        const volSlider = document.getElementById('audio-volume-slider');
        const volVal = volSlider ? parseInt(volSlider.value, 10) / 100 : 0.3;
        soundGainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
        soundGainNode.gain.linearRampToValueAtTime(volVal * 0.22, ctx.currentTime + 0.15);

        source.connect(filter);
        filter.connect(soundGainNode);
        soundGainNode.connect(ctx.destination);

        source.start();
        soundSourceNode = source;
        isRelaxAudioPlaying = true;
        updateAudioControlsUI(true);
    }

    function stopRelaxationAudio() {
        if (soundGainNode && audioCtx && audioCtx.state === 'running') {
            try {
                soundGainNode.gain.setValueAtTime(soundGainNode.gain.value, audioCtx.currentTime);
                soundGainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
            } catch (_) {}
        }
        setTimeout(() => {
            if (soundSourceNode) {
                try { soundSourceNode.stop(); soundSourceNode.disconnect(); } catch (_) {}
                soundSourceNode = null;
            }
        }, 220);
        isRelaxAudioPlaying = false;
        updateAudioControlsUI(false);
    }

    function setRelaxationVolume(valPercent) {
        if (!soundGainNode || !audioCtx) return;
        const norm = Math.max(0, Math.min(1, valPercent / 100));
        soundGainNode.gain.setValueAtTime(norm * 0.22, audioCtx.currentTime);
    }

    function updateAudioControlsUI(playing) {
        const icon = document.getElementById('audio-play-icon');
        const label = document.getElementById('audio-play-label');
        if (icon) icon.textContent = playing ? '■' : '▶';
        if (label) label.textContent = playing ? 'Pausar Som' : 'Áudio Relaxante';
    }

    function setSleepTimer(minutes) {
        if (sleepTimerTimeout) clearTimeout(sleepTimerTimeout);
        if (!minutes || minutes <= 0) return;

        sleepTimerTimeout = setTimeout(() => {
            stopSpeechNarration();
            stopAutoScroll();

            if (soundGainNode && audioCtx && isRelaxAudioPlaying) {
                // Fade out exponencial suave de 15 segundos
                soundGainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 15);
                setTimeout(() => {
                    stopRelaxationAudio();
                    if (global.VaultCore) global.VaultCore.toast('Timer de sono concluído: áudio desligado suavemente.', 'info', 3000);
                }, 15000);
            } else if (global.VaultCore) {
                global.VaultCore.toast('Timer de sono concluído: descanso noturno preservado.', 'info', 3000);
            }
        }, minutes * 60 * 1000);

        if (global.VaultCore) {
            global.VaultCore.toast(`Sleep timer ativado para ${minutes} minutos com desligamento suave.`, 'success', 2500);
        }
    }

    // =========================================================================
    // 4. PALETAS TÉRMICAS LOW-BLUE-LIGHT DO LEITOR NOTURNO
    // =========================================================================
    const AMBER_PALETTES = {
        amber: {
            bg: '#110b06',
            text: '#f5d5a3',
            title: '#fbdca8',
            boxBg: '#1b1209',
            boxBorder: 'rgba(146, 64, 14, 0.4)'
        },
        red: {
            bg: '#0c0402',
            text: '#fca5a5',
            title: '#f87171',
            boxBg: '#180806',
            boxBorder: 'rgba(185, 28, 28, 0.4)'
        },
        sage: {
            bg: '#07100b',
            text: '#bbf7d0',
            title: '#86efac',
            boxBg: '#0c1a11',
            boxBorder: 'rgba(5, 150, 105, 0.4)'
        },
        dark: {
            bg: '#020617',
            text: '#cbd5e1',
            title: '#f1f5f9',
            boxBg: '#0f172a',
            boxBorder: 'rgba(51, 65, 85, 0.6)'
        }
    };

    function applyAmberThermalPalette(themeKey) {
        if (AMBER_PALETTES[themeKey]) activeAmberTheme = themeKey;
        const pal = AMBER_PALETTES[activeAmberTheme] || AMBER_PALETTES.amber;
        const reader = document.getElementById('amber-night-reader');
        const title = document.getElementById('amber-reader-title');
        const body = document.getElementById('amber-reader-body');
        const qBox = document.getElementById('amber-reader-question-box');
        const qText = document.getElementById('amber-reader-question');

        if (reader) reader.style.backgroundColor = pal.bg;
        if (title) title.style.color = pal.title;
        if (body) body.style.color = pal.text;
        if (qBox) {
            qBox.style.backgroundColor = pal.boxBg;
            qBox.style.borderColor = pal.boxBorder;
        }
        if (qText) qText.style.color = pal.title;
        saveAmberPrefs();
    }

    function loadStories() {
        const C = global.VaultCore;
        if (!C || !C.store) return;
        const arr = C.store.get(C.STORAGE_KEYS.CONTOS, []);
        savedStories = Array.isArray(arr) ? arr : [];
    }

    function saveStories() {
        const C = global.VaultCore;
        if (!C || !C.store) return;
        C.store.set(C.STORAGE_KEYS.CONTOS, savedStories);
        if (typeof C.updateStorageMeter === 'function') C.updateStorageMeter();
    }

    // =========================================================================
    // 5. MOTOR MODULAR OFFLINE DE GERAÇÃO EM 4 ATOS
    // =========================================================================
    function composeModularStory(params) {
        const th = STORY_THEMES[params.themeKey] || STORY_THEMES.frustracao;
        const sc = STORY_SCENARIOS[params.scenarioKey] || STORY_SCENARIOS.cerrado;
        const protagonist = params.childName ? params.childName : 'pequeno(a) viajante';
        const ageNum = Number(params.childAge) || 5;

        const paceNote = ageNum <= 4
            ? 'Cada palavra soava redonda, curtinha e mansa como um balanço devagar.'
            : 'O silêncio gostoso da noite deixava cada pensamento desacelerar sem nenhuma pressa.';

        const title = `${params.childName ? params.childName + ' e ' : 'O Segredo d'}o Descanso em ${sc.label.split('&')[0].trim()}`;

        const act1 = `${sc.opening} ${paceNote} Ali caminhava ${protagonist}, sentindo a terra fresca sob os pés e observando as primeiras luzes douradas e calmas do entardecer.`;
        const act2 = `Mais cedo naquele dia, ${protagonist} ${th.challengeAct}`;
        const act3 = `Foi então que se aproximou ${sc.guide}. Com voz baixinha e acolhedora, mostrou um segredo da natureza: "${params.metaphor}". Juntos, praticaram a pausa mágica: ${protagonist} ${th.breathCue} Pouco a pouco, os ombros soltaram todo o peso e o coração encontrou um ritmo quentinho e seguro.`;
        const act4 = `${sc.closing} Agora, com as pálpebras ficando pesadas, calmas e protegidas, só restava o aconchego do travesseiro e a certeza de que amanhã será um dia gentil.`;

        const fullText = `${act1}\n\n${act2}\n\n${act3}\n\n${act4}`;

        return {
            title,
            text: fullText,
            question: params.question,
            theme: th.label,
            scenario: sc.label,
            source: 'Motor Modular Offline'
        };
    }

    function buildStructuredGeminiPrompt(params) {
        const th = STORY_THEMES[params.themeKey] || STORY_THEMES.frustracao;
        const sc = STORY_SCENARIOS[params.scenarioKey] || STORY_SCENARIOS.cerrado;
        const who = params.childName ? `Protagonista/Referência: ${params.childName} (${params.childAge} anos)` : `Criança de ${params.childAge} anos`;

        return [
            'Atue como um escritor de literatura infantil terapêutica e neuropsicólogo do desenvolvimento infantil.',
            `Escreva um CONTO NOTURNO DE INDUÇÃO AO SONO E REGULAÇÃO EMOCIONAL para ${who}.`,
            '',
            'PARÂMETROS CLÍNICOS E NARRATIVOS:',
            `- Tema Emocional do Dia: ${th.label}`,
            `- Cenário / Arquétipo: ${sc.label}`,
            `- Metáfora Comportamental Central: ${params.metaphor}`,
            `- Pergunta Final de Conexão Afetiva (sussurrada antes de dormir): "${params.question}"`,
            '',
            'ESTRUTURA OBRIGATÓRIA EM 4 ATOS FLUIDOS (sem subtítulos técnicos no texto):',
            '1. Ambientação sensorial serena, cores quentes de entardecer/noite, redução gradual de estímulos.',
            '2. Breve desafio emocional acolhido sem julgamento nem moralismo.',
            '3. Encontro com a metáfora viva e uma microprática respiratória lúdica embutida na cena.',
            '4. Desfecho hipnótico suave (ritmo lento, relaxamento muscular progressivo sutil) encerrando com a pergunta reflexiva final.',
            '',
            'Tom: poético, brasileiro, seguro, afetuoso, adequado para leitura em voz baixa na hora de dormir (350 a 500 palavras).'
        ].join('\n');
    }

    async function generateWithGeminiLocal() {
        const C = global.VaultCore;
        const keyInput = document.getElementById('ct-gemini-key');
        const apiKey = (keyInput ? keyInput.value : '').trim();

        if (!apiKey) {
            C.toast('Insira sua Gemini API Key local (salva apenas neste navegador) para usar a geração IA.', 'warning', 4200);
            return;
        }

        C.store.updateProfile({ geminiApiKey: apiKey });
        const params = collectStoryParams();
        const prompt = buildStructuredGeminiPrompt(params);
        const btn = document.getElementById('btn-ct-gemini-run');
        const origHtml = btn.innerHTML;

        try {
            btn.disabled = true;
            btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Tecendo conto inédito...</span>`;
            C.refreshIcons(btn);

            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
            const resp = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.78,
                        maxOutputTokens: 1400
                    }
                })
            });

            if (!resp.ok) {
                const errData = await resp.json().catch(() => ({}));
                throw new Error((errData.error && errData.error.message) || `HTTP ${resp.status}`);
            }

            const data = await resp.json();
            const generatedText = (
                data.candidates &&
                data.candidates[0] &&
                data.candidates[0].content &&
                data.candidates[0].content.parts &&
                data.candidates[0].content.parts.map((p) => p.text || '').join('\n')
            ) || '';

            if (!generatedText.trim()) {
                throw new Error('Resposta vazia da API Gemini.');
            }

            const sc = STORY_SCENARIOS[params.scenarioKey] || STORY_SCENARIOS.cerrado;
            const th = STORY_THEMES[params.themeKey] || STORY_THEMES.frustracao;

            currentComposedStory = {
                title: `Conto Inédito — ${sc.label}`,
                text: generatedText.trim(),
                question: params.question,
                theme: th.label,
                scenario: sc.label,
                source: 'Gemini 2.5 Flash (Client-Side)'
            };

            renderStoryOutput();
            C.toast('Conto inédito gerado via Gemini 2.5 Flash!', 'success');
        } catch (err) {
            C.toast('Erro na chamada Gemini API: ' + err.message, 'error', 5000);
        } finally {
            btn.disabled = false;
            btn.innerHTML = origHtml;
            C.refreshIcons(btn);
        }
    }

    function collectStoryParams() {
        const nameEl = document.getElementById('ct-child-name');
        const ageEl = document.getElementById('ct-child-age');
        const themeEl = document.getElementById('ct-theme');
        const scEl = document.getElementById('ct-scenario');
        const metaEl = document.getElementById('ct-metaphor');
        const qEl = document.getElementById('ct-question');

        return {
            childName: nameEl ? nameEl.value.trim() : '',
            childAge: ageEl ? (Number(ageEl.value) || 5) : 5,
            themeKey: themeEl ? themeEl.value : 'frustracao',
            scenarioKey: scEl ? scEl.value : 'cerrado',
            metaphor: metaEl ? metaEl.value.trim() : (STORY_THEMES.frustracao.defaultMetaphor),
            question: qEl ? qEl.value.trim() : (STORY_THEMES.frustracao.defaultQuestion)
        };
    }

    function updateModularAndPrompt() {
        const params = collectStoryParams();
        currentComposedStory = composeModularStory(params);
        const promptArea = document.getElementById('ct-prompt-output');
        if (promptArea) {
            promptArea.value = buildStructuredGeminiPrompt(params);
        }
        renderStoryOutput();
    }

    function renderStoryOutput() {
        const C = global.VaultCore;
        const titleEl = document.getElementById('ct-story-title');
        const badgeEl = document.getElementById('ct-story-source-badge');
        const bodyEl = document.getElementById('ct-story-body');
        const qEl = document.getElementById('ct-story-question');

        if (!titleEl || !bodyEl) return;
        titleEl.textContent = currentComposedStory.title;
        if (badgeEl) badgeEl.textContent = currentComposedStory.source;

        const paragraphs = currentComposedStory.text
            .split(/\n\s*\n/)
            .map((p) => p.trim())
            .filter(Boolean);

        bodyEl.innerHTML = paragraphs
            .map((p) => `<p class="leading-relaxed text-amber-100/90 text-sm sm:text-base">${C.esc(p)}</p>`)
            .join('');

        if (qEl) qEl.textContent = currentComposedStory.question;
    }

    // =========================================================================
    // 5.1. NARRADOR VOCAL SUAVE OFFLINE (WEB SPEECH API)
    // =========================================================================
    let speechUtterance = null;
    let isSpeaking = false;
    let speechKeepAliveTimer = null;
    let cachedVoices = [];

    function populateVoices() {
        if ('speechSynthesis' in window) {
            try {
                cachedVoices = window.speechSynthesis.getVoices() || [];
            } catch (_) {}
        }
    }
    if ('speechSynthesis' in window) {
        populateVoices();
        if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
            window.speechSynthesis.onvoiceschanged = populateVoices;
        }
    }

    function toggleSpeechNarration() {
        if (!('speechSynthesis' in window)) {
            if (global.VaultCore) global.VaultCore.toast('Síntese vocal não suportada neste navegador.', 'warning');
            return;
        }

        if (window.speechSynthesis.speaking) {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
                updateNarrateUI(true);
            } else {
                stopSpeechNarration();
            }
            return;
        }

        const bodyEl = document.getElementById('amber-reader-body');
        const questionEl = document.getElementById('amber-reader-question');
        const titleEl = document.getElementById('amber-reader-title');
        const textToRead = [
            titleEl ? titleEl.textContent : '',
            bodyEl ? bodyEl.textContent : '',
            questionEl ? ('Sussurro final de boa-noite: ' + questionEl.textContent) : ''
        ].filter(Boolean).join('. ');

        if (!textToRead.trim()) return;

        stopSpeechNarration();
        speechUtterance = new SpeechSynthesisUtterance(textToRead);
        speechUtterance.lang = 'pt-BR';
        const rateSelect = document.getElementById('amber-narrate-rate-select');
        speechUtterance.rate = rateSelect ? parseFloat(rateSelect.value) || 0.85 : 0.85; // Leitura compassada e suave
        speechUtterance.pitch = 0.95; // Tom morno para indução ao relaxamento

        const allVoices = cachedVoices.length > 0 ? cachedVoices : (window.speechSynthesis.getVoices() || []);
        const ptVoice = allVoices.find(v => v.lang && (v.lang.toLowerCase().startsWith('pt') || v.lang.toLowerCase().replace('_', '-').startsWith('pt-br')));
        if (ptVoice) speechUtterance.voice = ptVoice;

        speechUtterance.onend = () => {
            isSpeaking = false;
            if (speechKeepAliveTimer) { clearInterval(speechKeepAliveTimer); speechKeepAliveTimer = null; }
            updateNarrateUI(false);
        };
        speechUtterance.onerror = () => {
            isSpeaking = false;
            if (speechKeepAliveTimer) { clearInterval(speechKeepAliveTimer); speechKeepAliveTimer = null; }
            updateNarrateUI(false);
        };

        window.speechSynthesis.speak(speechUtterance);
        isSpeaking = true;
        updateNarrateUI(true);

        if (speechKeepAliveTimer) clearInterval(speechKeepAliveTimer);
        speechKeepAliveTimer = setInterval(() => {
            if (window.speechSynthesis && window.speechSynthesis.speaking) {
                window.speechSynthesis.pause();
                window.speechSynthesis.resume();
            } else {
                if (speechKeepAliveTimer) { clearInterval(speechKeepAliveTimer); speechKeepAliveTimer = null; }
            }
        }, 10000);
    }

    function stopSpeechNarration() {
        if ('speechSynthesis' in window) {
            try { window.speechSynthesis.cancel(); } catch (_) {}
        }
        if (speechKeepAliveTimer) {
            clearInterval(speechKeepAliveTimer);
            speechKeepAliveTimer = null;
        }
        isSpeaking = false;
        updateNarrateUI(false);
    }

    function updateNarrateUI(active) {
        const icon = document.getElementById('amber-narrate-icon');
        const label = document.getElementById('amber-narrate-label');
        if (icon) icon.textContent = active ? '⏹' : '🔊';
        if (label) label.textContent = active ? 'Parar Voz' : 'Narrador';
    }

    // =========================================================================
    // 6. LEITOR NOTURNO ÂMBAR DE TELA CHEIA (LOW-BLUE-LIGHT)
    // =========================================================================
    let readerKeyHandler = null;

    function changeAmberFontSize(delta) {
        amberFontSizeRem = Math.max(0.85, Math.min(2.4, Number((amberFontSizeRem + delta).toFixed(2))));
        const b = document.getElementById('amber-reader-body');
        if (b) b.style.fontSize = `${amberFontSizeRem}rem`;
        saveAmberPrefs();
    }

    function openAmberNightReader(storyObj) {
        loadAmberPrefs();
        const overlay = document.getElementById('amber-night-reader');
        if (!overlay) return;
        const C = global.VaultCore;

        let target = storyObj || currentComposedStory;
        if (!target || !target.text) {
            const params = collectStoryParams();
            target = composeModularStory(params);
            currentComposedStory = target;
        }

        const tEl = document.getElementById('amber-reader-title');
        const bEl = document.getElementById('amber-reader-body');
        const qEl = document.getElementById('amber-reader-question');
        const metaEl = document.getElementById('amber-reader-meta');

        if (tEl) tEl.textContent = target.title;
        if (bEl) {
            bEl.style.fontSize = `${amberFontSizeRem}rem`;
            const pars = target.text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
            bEl.innerHTML = pars.map((p) => `<p class="leading-relaxed my-4 text-justify font-serif">${C.esc(p)}</p>`).join('');
        }
        if (qEl) qEl.textContent = target.question;

        // Metadados de leitura suave (palavras e minutos estimados)
        if (metaEl && target.text) {
            const words = target.text.trim().split(/\s+/).filter(Boolean).length;
            const readMins = Math.max(1, Math.round(words / 130));
            metaEl.textContent = `⏱️ ~${readMins} min de leitura suave • ${words} palavras • ${target.source || 'Modo Offline'}`;
        }

        // Progresso de rolagem
        overlay.onscroll = () => {
            const maxScroll = overlay.scrollHeight - overlay.clientHeight;
            const pct = maxScroll > 0 ? (overlay.scrollTop / maxScroll) * 100 : 0;
            const pb = document.getElementById('amber-scroll-progress');
            if (pb) pb.style.width = `${pct}%`;
        };

        // Pausa autoscroll suave se o usuário rolar com o dedo ou mouse
        const handleManualScroll = () => {
            if (isAutoScrolling) {
                stopAutoScroll();
                updateAutoScrollUI(false);
            }
        };
        overlay.addEventListener('wheel', handleManualScroll, { passive: true });
        overlay.addEventListener('touchmove', handleManualScroll, { passive: true });

        // Atalhos de teclado no modo leitor noturno
        if (readerKeyHandler) {
            document.removeEventListener('keydown', readerKeyHandler);
        }
        readerKeyHandler = (e) => {
            if (overlay.classList.contains('hidden')) return;
            if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) return;
            if (e.key === 'Escape') {
                e.preventDefault();
                closeAmberNightReader();
            } else if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                toggleAutoScroll();
            } else if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                changeAmberFontSize(0.1);
            } else if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                changeAmberFontSize(-0.1);
            } else if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                toggleAmberFullscreen();
            } else if (e.key === 'm' || e.key === 'M') {
                e.preventDefault();
                toggleSpeechNarration();
            }
        };
        document.addEventListener('keydown', readerKeyHandler);

        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        applyAmberThermalPalette(activeAmberTheme);
        updateAutoScrollUI(false);
    }

    function closeAmberNightReader() {
        const overlay = document.getElementById('amber-night-reader');
        if (overlay) overlay.classList.add('hidden');
        document.body.style.overflow = '';
        stopAutoScroll();
        stopSpeechNarration();
        if (readerKeyHandler) {
            document.removeEventListener('keydown', readerKeyHandler);
            readerKeyHandler = null;
        }
        if (document.fullscreenElement) {
            try { document.exitFullscreen(); } catch (_) {}
        }
    }

    function updateAutoScrollUI(active) {
        const btn = document.getElementById('btn-amber-autoscroll');
        if (btn) {
            btn.textContent = active ? 'Pausar ⏸' : 'Auto ↓';
            btn.classList.toggle('bg-amber-500/30', active);
            btn.classList.toggle('border-amber-400', active);
        }
    }

    function toggleAutoScroll() {
        const reader = document.getElementById('amber-night-reader');
        if (!reader) return;
        if (isAutoScrolling) {
            stopAutoScroll();
            updateAutoScrollUI(false);
        } else {
            isAutoScrolling = true;
            updateAutoScrollUI(true);
            autoScrollInterval = setInterval(() => {
                reader.scrollBy({ top: 1, behavior: 'smooth' });
                if (reader.scrollTop + reader.clientHeight >= reader.scrollHeight - 5) {
                    stopAutoScroll();
                    updateAutoScrollUI(false);
                }
            }, 60);
        }
    }

    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
        isAutoScrolling = false;
        updateAutoScrollUI(false);
    }

    function toggleAmberFullscreen() {
        const overlay = document.getElementById('amber-night-reader');
        if (!overlay) return;
        if (!document.fullscreenElement) {
            if (overlay.requestFullscreen) {
                overlay.requestFullscreen().catch(() => {});
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
        }
    }

    function renderSavedStoriesLibrary() {
        const C = global.VaultCore;
        const listEl = document.getElementById('ct-saved-library-list');
        const countEl = document.getElementById('ct-library-count');
        if (!listEl) return;

        if (countEl) countEl.textContent = `${savedStories.length} contos salvos`;

        if (savedStories.length === 0) {
            listEl.innerHTML = `<p class="text-xs text-slate-500 italic py-2">Sua biblioteca local está vazia. Gere um conto acima e clique em 'Salvar na Biblioteca Local'.</p>`;
            return;
        }

        listEl.innerHTML = savedStories.map((item, idx) => `
            <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                <div class="min-w-0">
                    <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">${item.theme.split('(')[0].trim()}</span>
                        <span class="text-[11px] font-mono text-slate-400">${C.formatDateBR(item.createdAt)}</span>
                    </div>
                    <div class="font-bold text-sm text-slate-200 truncate mt-1">${C.esc(item.title)}</div>
                    <p class="text-xs text-slate-400 italic truncate mt-0.5">${C.esc(item.question)}</p>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                    <button type="button" data-read-saved="${idx}" class="min-h-[36px] px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1">
                        <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
                        <span>Ler</span>
                    </button>
                    <button type="button" data-del-saved="${idx}" class="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 text-xs">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            </div>
        `).join('');

        listEl.querySelectorAll('[data-read-saved]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-read-saved'), 10);
                if (savedStories[idx]) openAmberNightReader(savedStories[idx]);
            });
        });

        listEl.querySelectorAll('[data-del-saved]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-del-saved'), 10);
                if (confirm('Excluir este conto da biblioteca local?')) {
                    savedStories.splice(idx, 1);
                    saveStories();
                    renderSavedStoriesLibrary();
                    C.toast('Conto removido da biblioteca.', 'info');
                }
            });
        });

        C.refreshIcons(listEl);
    }

    // =========================================================================
    // 7. MONTAGEM DA INTERFACE NA ABA 5 (tab-panel-contos)
    // =========================================================================
    function mountContosShell() {
        const panel = document.getElementById('tab-panel-contos');
        if (!panel) return;
        const C = global.VaultCore;
        const prof = C.store.getProfile();

        panel.innerHTML = `
            <div class="space-y-5 pb-20">
                <!-- Cabeçalho -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">Pediatria do Sono &amp; Regulação Afetiva</span>
                            <span class="text-xs font-mono text-slate-400">60 Metáforas Comportamentais &amp; 14 Biomas</span>
                        </div>
                        <h2 class="text-lg sm:text-xl font-bold text-slate-100 mt-1">Gerador Estruturado de Cenas Terapêuticas &amp; Contos Noturnos</h2>
                    </div>

                    <div class="flex items-center gap-2">
                        <button type="button" id="btn-open-amber-now" class="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition">
                            <i data-lucide="moon" class="w-4 h-4"></i>
                            <span>Abrir Leitor Âmbar</span>
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <!-- Coluna Esquerda: Parâmetros Narrativos -->
                    <div class="lg:col-span-5 space-y-4">
                        <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                            <h3 class="text-sm font-bold font-mono uppercase tracking-wider text-amber-300">1. Parâmetros da Criança &amp; Cena</h3>

                            <div class="grid grid-cols-3 gap-2">
                                <div class="col-span-2">
                                    <label class="block text-xs font-semibold text-slate-300 mb-1">Nome do(a) Protagonista (Opcional)</label>
                                    <input type="text" id="ct-child-name" value="${C.esc(prof.childLabel || '')}" placeholder="Ex: Lucas, Sofia, Nina..."
                                        class="w-full min-h-[40px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-slate-100">
                                </div>
                                <div>
                                    <label class="block text-xs font-semibold text-slate-300 mb-1">Idade</label>
                                    <input type="number" id="ct-child-age" min="2" max="12" value="5"
                                        class="w-full min-h-[40px] px-2.5 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-center text-slate-100">
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-300 mb-1">Tema Emocional do Dia (60 Metáforas Clínicas) *</label>
                                <select id="ct-theme" class="w-full min-h-[42px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-amber-300">
                                    ${Object.entries(STORY_THEMES).map(([k, v]) => `
                                        <option value="${k}">${v.label}</option>
                                    `).join('')}
                                </select>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-300 mb-1">Arquétipo &amp; Bioma Brasileiro *</label>
                                <select id="ct-scenario" class="w-full min-h-[42px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-slate-200">
                                    ${Object.entries(STORY_SCENARIOS).map(([k, v]) => `
                                        <option value="${k}">${v.label}</option>
                                    `).join('')}
                                </select>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-300 mb-1">Metáfora Comportamental Central (Editável)</label>
                                <textarea id="ct-metaphor" rows="3" class="w-full p-2.5 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-slate-200"></textarea>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-slate-300 mb-1">Pergunta Final de Conexão Afetiva (Sussurrada)</label>
                                <input type="text" id="ct-question" class="w-full min-h-[40px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-amber-200 italic">
                            </div>

                            <button type="button" id="btn-ct-compose-offline" class="w-full min-h-[44px] px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition">
                                <i data-lucide="sparkles" class="w-4 h-4"></i>
                                <span>Compor Imediatamente (Motor Offline em 4 Atos)</span>
                            </button>
                        </div>

                        <!-- Opcional: Gemini Local -->
                        <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Geração Opcional via Gemini Local</span>
                                <span class="text-[10px] font-mono text-emerald-400">100% Client-Side</span>
                            </div>
                            <input type="password" id="ct-gemini-key" value="${C.esc(prof.geminiApiKey || '')}" placeholder="Cole sua Gemini API Key aqui..."
                                class="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-cyan-300 font-mono">
                            <button type="button" id="btn-ct-gemini-run" class="w-full min-h-[40px] px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition">
                                <i data-lucide="cpu" class="w-4 h-4"></i>
                                <span>Gerar Variação Inédita com Gemini 2.5 Flash</span>
                            </button>
                        </div>
                    </div>

                    <!-- Coluna Direita: Saída do Conto & Biblioteca -->
                    <div class="lg:col-span-7 space-y-4">
                        <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 sm:p-5 space-y-4">
                            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                                <div>
                                    <span id="ct-story-source-badge" class="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">Motor Modular</span>
                                    <h3 id="ct-story-title" class="text-base sm:text-lg font-bold text-amber-200 mt-1">Carregando...</h3>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button type="button" id="btn-ct-save-library" class="min-h-[38px] px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                                        <i data-lucide="bookmark" class="w-3.5 h-3.5"></i>
                                        <span>Salvar Favorito</span>
                                    </button>
                                    <button type="button" id="btn-ct-read-amber" class="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/10">
                                        <i data-lucide="book-open" class="w-4 h-4"></i>
                                        <span>Leitor Âmbar</span>
                                    </button>
                                </div>
                            </div>

                            <div id="ct-story-body" class="space-y-3 font-serif"></div>

                            <div class="bg-[#090d16] border border-amber-900/40 rounded-xl p-3.5 space-y-1">
                                <span class="text-[11px] font-mono uppercase tracking-wider text-amber-500/80">Sussurro Final de Conexão:</span>
                                <p id="ct-story-question" class="text-sm font-serif italic text-amber-200"></p>
                            </div>
                        </div>

                        <!-- Biblioteca Local de Contos Favoritos -->
                        <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                            <div class="flex items-center justify-between">
                                <h3 class="text-sm font-bold font-mono uppercase tracking-wider text-slate-200">Biblioteca Local de Contos Favoritos</h3>
                                <span id="ct-library-count" class="text-xs font-mono text-slate-400">0 contos salvos</span>
                            </div>
                            <div id="ct-saved-library-list" class="space-y-2 max-h-60 overflow-y-auto pr-1"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        bindContosEvents();
        updateModularAndPrompt();
        renderSavedStoriesLibrary();
        C.refreshIcons(panel);
    }

    function bindContosEvents() {
        const C = global.VaultCore;

        const themeSelect = document.getElementById('ct-theme');
        if (themeSelect) {
            themeSelect.addEventListener('change', () => {
                const th = STORY_THEMES[themeSelect.value] || STORY_THEMES.frustracao;
                const metaEl = document.getElementById('ct-metaphor');
                const qEl = document.getElementById('ct-question');
                if (metaEl) metaEl.value = th.defaultMetaphor;
                if (qEl) qEl.value = th.defaultQuestion;
                updateModularAndPrompt();
            });
            // Initial seed
            const th = STORY_THEMES[themeSelect.value] || STORY_THEMES.frustracao;
            const metaEl = document.getElementById('ct-metaphor');
            const qEl = document.getElementById('ct-question');
            if (metaEl) metaEl.value = th.defaultMetaphor;
            if (qEl) qEl.value = th.defaultQuestion;
        }

        const scSelect = document.getElementById('ct-scenario');
        if (scSelect) {
            scSelect.addEventListener('change', () => updateModularAndPrompt());
        }

        const btnCompose = document.getElementById('btn-ct-compose-offline');
        if (btnCompose) {
            btnCompose.addEventListener('click', () => {
                updateModularAndPrompt();
                C.toast('Conto modular offline composto em 4 atos!', 'success', 2000);
            });
        }

        const btnGemini = document.getElementById('btn-ct-gemini-run');
        if (btnGemini) {
            btnGemini.addEventListener('click', generateWithGeminiLocal);
        }

        const btnRead = document.getElementById('btn-ct-read-amber');
        if (btnRead) {
            btnRead.addEventListener('click', () => openAmberNightReader(currentComposedStory));
        }

        const btnOpenAmberNow = document.getElementById('btn-open-amber-now');
        if (btnOpenAmberNow) {
            btnOpenAmberNow.addEventListener('click', () => openAmberNightReader(currentComposedStory));
        }

        const btnSave = document.getElementById('btn-ct-save-library');
        if (btnSave) {
            btnSave.addEventListener('click', () => {
                const copy = Object.assign({}, currentComposedStory, {
                    id: 'CT-' + Date.now(),
                    createdAt: C.todayISO()
                });
                savedStories.unshift(copy);
                saveStories();
                renderSavedStoriesLibrary();
                C.toast('Conto salvo com sucesso na biblioteca local!', 'success');
            });
        }

        // Eventos do Modal Âmbar
        const btnAmberClose = document.getElementById('btn-amber-close');
        if (btnAmberClose) btnAmberClose.addEventListener('click', closeAmberNightReader);

        const btnAmberCopy = document.getElementById('btn-amber-copy-text');
        if (btnAmberCopy) {
            btnAmberCopy.addEventListener('click', () => {
                const target = currentComposedStory;
                if (!target || !target.text) return;
                const formatted = `${target.title}\n\n${target.text}\n\nSussurro final de boa-noite:\n"${target.question}"`;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(formatted).then(() => {
                        C.toast('Conto copiado com formatação de leitura!', 'success');
                    }).catch(() => {
                        C.toast('Selecione e copie o texto manualmente.', 'info');
                    });
                } else {
                    C.toast('Área de transferência não disponível.', 'warning');
                }
            });
        }

        // Atalhos de teclado no modo leitor âmbar (único listener consolidado)
        window.addEventListener('keydown', (e) => {
            const reader = document.getElementById('amber-night-reader');
            if (!reader || reader.classList.contains('hidden')) return;

            const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT';
            if (isInput) return;

            if (e.key === 'Escape') {
                closeAmberNightReader();
            } else if (e.code === 'Space') {
                e.preventDefault();
                toggleAutoScroll();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                stopAutoScroll();
                reader.scrollBy({ top: 90, behavior: 'smooth' });
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                stopAutoScroll();
                reader.scrollBy({ top: -90, behavior: 'smooth' });
            } else if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                amberFontSizeRem = Math.min(2.4, amberFontSizeRem + 0.1);
                const b = document.getElementById('amber-reader-body');
                if (b) b.style.fontSize = `${amberFontSizeRem}rem`;
                saveAmberPrefs();
            } else if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                amberFontSizeRem = Math.max(0.85, amberFontSizeRem - 0.1);
                const b = document.getElementById('amber-reader-body');
                if (b) b.style.fontSize = `${amberFontSizeRem}rem`;
                saveAmberPrefs();
            } else if (e.key.toLowerCase() === 'f') {
                e.preventDefault();
                toggleAmberFullscreen();
            } else if (e.key.toLowerCase() === 'm') {
                e.preventDefault();
                const btnAudio = document.getElementById('btn-audio-toggle');
                if (btnAudio) btnAudio.click();
            } else if (e.key.toLowerCase() === 'n') {
                e.preventDefault();
                toggleSpeechNarration();
            }
        });

        const btnAmberStar = document.getElementById('btn-amber-star');
        if (btnAmberStar) {
            btnAmberStar.addEventListener('click', () => {
                const target = currentComposedStory;
                if (!target || !target.text) return;
                const copy = Object.assign({}, target, {
                    id: 'CT-' + Date.now(),
                    createdAt: C.todayISO()
                });
                savedStories.unshift(copy);
                saveStories();
                renderSavedStoriesLibrary();
                C.toast('Conto salvo com sucesso na biblioteca local!', 'success');
            });
        }

        const btnAmberNarrate = document.getElementById('btn-amber-narrate');
        if (btnAmberNarrate) {
            btnAmberNarrate.addEventListener('click', toggleSpeechNarration);
        }

        const sleepSelect = document.getElementById('amber-sleep-timer-select');
        if (sleepSelect) {
            sleepSelect.addEventListener('change', () => {
                const mins = parseInt(sleepSelect.value, 10);
                setSleepTimer(mins);
            });
        }

        const btnFontUp = document.getElementById('btn-amber-font-up');
        if (btnFontUp) {
            btnFontUp.addEventListener('click', () => changeAmberFontSize(0.1));
        }

        const btnFontDown = document.getElementById('btn-amber-font-down');
        if (btnFontDown) {
            btnFontDown.addEventListener('click', () => changeAmberFontSize(-0.1));
        }

        const btnAutoScroll = document.getElementById('btn-amber-autoscroll');
        if (btnAutoScroll) {
            btnAutoScroll.addEventListener('click', toggleAutoScroll);
        }

        const btnFullscreen = document.getElementById('btn-amber-fullscreen');
        if (btnFullscreen) {
            btnFullscreen.addEventListener('click', toggleAmberFullscreen);
        }

        document.querySelectorAll('[data-amber-theme]').forEach((btn) => {
            btn.addEventListener('click', () => {
                applyAmberThermalPalette(btn.getAttribute('data-amber-theme'));
            });
        });

        const btnAudioToggle = document.getElementById('btn-audio-toggle');
        if (btnAudioToggle) {
            btnAudioToggle.addEventListener('click', () => {
                if (isRelaxAudioPlaying) {
                    stopRelaxationAudio();
                } else {
                    const sel = document.getElementById('audio-mode-select');
                    const mode = sel ? sel.value : 'brown';
                    startRelaxationAudio(mode);
                }
            });
        }

        const audioModeSelect = document.getElementById('audio-mode-select');
        if (audioModeSelect) {
            audioModeSelect.addEventListener('change', () => {
                if (isRelaxAudioPlaying) {
                    startRelaxationAudio(audioModeSelect.value);
                }
            });
        }

        const volSlider = document.getElementById('audio-volume-slider');
        if (volSlider) {
            volSlider.addEventListener('input', (e) => {
                setRelaxationVolume(parseInt(e.target.value, 10));
            });
        }
    }

    function init() {
        loadStories();
        mountContosShell();

        window.addEventListener('vault:restored', () => {
            loadStories();
            mountContosShell();
        });
    }

    const api = {
        init,
        openAmberNightReader,
        startRelaxationAudio,
        stopRelaxationAudio,
        setSleepTimer,
        toggleAutoScroll,
        toggleSpeechNarration,
        stopSpeechNarration
    };

    global.VaultTabContos = api;
})(window);
