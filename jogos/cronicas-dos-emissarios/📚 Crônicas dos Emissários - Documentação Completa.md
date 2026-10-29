# 📚 Crônicas dos Emissários - Documentação Completa

## 🎮 Visão Geral

**Crônicas dos Emissários** é um jogo interativo focado no desenvolvimento de habilidades sociais e emocionais. Ambientado no reino mágico de Elara, o jogador assume o papel de um Emissário da Empatia, resolvendo conflitos através da compreensão, diálogo e alquimia emocional.

### 🌟 Características Principais

- **Sistema de Diálogos Ramificados**: Conversas complexas com múltiplas opções e consequências
- **Mini-game de Alquimia Emocional**: Misture emoções para criar poções que ajudam a resolver conflitos
- **Mundo Expansível**: Múltiplos cenários interconectados com NPCs únicos
- **Sistema de Progressão**: Experiência, níveis, conquistas e inventário
- **Arquitetura Modular**: Fácil adição de novos conteúdos sem modificar código principal

---

## 🏗️ Arquitetura do Sistema

### 📁 Estrutura de Arquivos

```
cronicas-dos-emissarios/
├── cronicas-dos-emissarios-expandido.html  # Arquivo principal do jogo
├── game-data.js                            # Dados modulares (cenários, personagens, quests)
├── game-engine.js                          # Motor principal do jogo
├── game-styles.css                         # Estilos customizados adicionais
├── assets/                                 # Recursos do site (CSS, JS, imagens)
│   ├── style.css                          # Estilos do site principal
│   ├── script.js                          # Scripts do site principal
│   ├── logo-deo.png                       # Logo profissional
│   └── favicon2.png                       # Favicon
└── DOCUMENTACAO-JOGO.md                   # Esta documentação
```

### 🔧 Componentes Principais

1. **HTML Principal** (`cronicas-dos-emissarios-expandido.html`)
   - Interface do usuário
   - Cabeçalho e rodapé profissionais
   - Estrutura das telas do jogo

2. **Dados do Jogo** (`game-data.js`)
   - Cenários e locais
   - Personagens (NPCs)
   - Missões (quests)
   - Poções e receitas
   - Itens e ferramentas
   - Sistema de conquistas

3. **Motor do Jogo** (`game-engine.js`)
   - Lógica principal
   - Gerenciamento de estado
   - Sistema de navegação
   - Controle de diálogos
   - Mini-games
   - Sistema de save/load

4. **Estilos Customizados** (`game-styles.css`)
   - Temas visuais
   - Animações
   - Responsividade
   - Efeitos especiais

---

## 🎯 Como Jogar

### 🚀 Início do Jogo

1. **Criação de Personagem**
   - Escolha um nome para seu Emissário
   - Selecione um avatar (🧝🧙🧑‍🚀👸🤴)
   - Confirme para iniciar a aventura

2. **Exploração do Mundo**
   - Navegue entre diferentes cenários
   - Converse com NPCs para descobrir problemas
   - Use itens especiais para obter informações adicionais

3. **Sistema de Diálogos**
   - Leia atentamente as falas dos personagens
   - Escolha respostas que demonstrem empatia e compreensão
   - Suas escolhas influenciam o desenvolvimento da história

4. **Alquimia Emocional**
   - Quando necessário, acesse o mini-game de poções
   - Combine duas emoções para criar uma poção específica
   - Use a poção para ajudar o personagem em dificuldade

### 🧪 Receitas de Poções

| Poção | Ingredientes | Efeito |
|-------|-------------|--------|
| **EMPATIA** | Tristeza + Calma | Compreender sentimentos alheios |
| **PACIÊNCIA** | Raiva + Calma | Resistir a provocações |
| **CORAGEM** | Medo + Alegria | Enfrentar desafios |
| **ESPERANÇA** | Tristeza + Esperança | Restaurar fé no futuro |
| **PERDÃO** | Raiva + Compaixão | Curar feridas emocionais |
| **AUTOCONFIANÇA** | Medo + Sabedoria | Fortalecer autoestima |
| **GRATIDÃO** | Alegria + Sabedoria | Transformar perspectivas |

### 🎒 Sistema de Inventário

- **Diário da Empatia**: Registra informações sobre personagens
- **Lente da Compreensão**: Revela motivações ocultas
- **Cristal da Harmonia**: Detecta conflitos próximos
- **Pergaminho da Sabedoria**: Fornece dicas úteis
- **Amuleto de Proteção**: Reduz impacto de emoções negativas

---

## 🛠️ Como Adicionar Novos Conteúdos

### 📍 Adicionando Novos Cenários

1. **Abra o arquivo `game-data.js`**
2. **Localize a seção `scenarios`**
3. **Adicione um novo cenário seguindo este modelo:**

```javascript
NovoLocal: {
    name: 'Nome do Local',
    emoji: '🏰',  // Emoji representativo
    description: 'Descrição detalhada do local...',
    background: 'linear-gradient(135deg, #cor1 0%, #cor2 100%)',
    music: 'nome_da_trilha',
    connections: ['LocalConectado1', 'LocalConectado2'],
    npcs: ['id_npc1', 'id_npc2'],
    quests: ['id_quest1', 'id_quest2'],
    firstVisit: false
}
```

### 👥 Adicionando Novos Personagens

1. **Na seção `characters` do `game-data.js`**
2. **Adicione um novo personagem:**

```javascript
novo_personagem: {
    name: 'Nome do Personagem',
    title: 'Título/Profissão',
    emoji: '👨‍🎨',
    description: 'Descrição física e personalidade...',
    personality: 'Traços de personalidade principais',
    background: 'História pessoal do personagem',
    currentProblem: 'Problema atual que precisa resolver',
    dialogues: {
        intro: "Primeira fala do personagem...",
        problem: "Explicação do problema...",
        solution_attempt: "Reação à tentativa de solução..."
    },
    questId: 'id_da_quest_relacionada'
}
```

### 🎯 Adicionando Novas Missões

1. **Na seção `quests` do `game-data.js`**
2. **Crie uma nova quest:**

```javascript
nova_missao: {
    id: 'nova_missao',
    title: 'Título da Missão',
    description: 'Descrição do que o jogador deve fazer',
    scenario: 'LocalOndeAcontece',
    npc: 'personagem_relacionado',
    type: 'tipo_da_missao',  // emotional_support, conflict_resolution, etc.
    difficulty: 'beginner',  // beginner, intermediate, advanced
    requiredPotion: 'POCAO_NECESSARIA',
    status: 'available',     // available, active, completed, locked
    objectives: [
        'Objetivo 1',
        'Objetivo 2',
        'Objetivo 3'
    ],
    rewards: {
        experience: 150,
        items: ['item1', 'item2'],
        newLocation: 'NovoLocalDesbloqueado',
        achievement: 'conquista_especial'
    },
    dialogueTree: {
        start: {
            text: "Texto inicial do diálogo...",
            options: [
                { text: "Opção 1", next: "no_seguinte" },
                { text: "Opção 2", next: "outro_no" }
            ]
        },
        // Adicione mais nós conforme necessário
        minigame_success: {
            text: "Texto após sucesso no mini-game...",
            options: [
                { text: "Continuar", next: "quest_complete" }
            ]
        },
        quest_complete: {
            text: "Texto de conclusão da quest...",
            options: [],
            reward: true
        }
    }
}
```

### 🧪 Adicionando Novas Poções

1. **Na seção `potions` para ingredientes:**

```javascript
nova_emocao: {
    name: 'Nome da Emoção',
    color: '#HEX_COLOR',
    emoji: '😊',
    description: 'Descrição poética da emoção'
}
```

2. **Na seção `recipes` para receitas:**

```javascript
'NOVA_POCAO': {
    ingredients: ['emocao1', 'emocao2'],
    emoji: '🌟',
    description: 'O que esta poção representa',
    effect: 'Efeito prático da poção'
}
```

### 🎁 Adicionando Novos Itens

```javascript
novo_item: {
    name: 'Nome do Item',
    emoji: '🔮',
    description: 'Descrição detalhada do item',
    type: 'tool',  // tool, detector, knowledge, protection
    effect: 'Efeito quando usado'
}
```

---

## 🎨 Personalização Visual

### 🎨 Modificando Cores e Temas

1. **Abra `game-styles.css`**
2. **Modifique as variáveis CSS no início do arquivo:**

```css
:root {
    --primary-purple: #8b5cf6;  /* Cor principal roxa */
    --primary-blue: #3b82f6;    /* Cor principal azul */
    --primary-green: #10b981;   /* Cor principal verde */
    --primary-gold: #fbbf24;    /* Cor principal dourada */
    
    /* Modifique estas cores para alterar o tema */
}
```

### 🖼️ Adicionando Novos Backgrounds

1. **Para cenários, modifique a propriedade `background` em `game-data.js`:**

```javascript
background: 'linear-gradient(135deg, #cor1 0%, #cor2 50%, #cor3 100%)'
```

2. **Para efeitos especiais, adicione classes CSS em `game-styles.css`**

### 🎵 Adicionando Nova Música

1. **Na seção `audio.backgroundMusic` do `game-data.js`:**

```javascript
nova_trilha: "https://url-da-musica.mp3"
```

2. **Referencie no cenário:**

```javascript
music: 'nova_trilha'
```

---

## 🔧 Configurações Avançadas

### 💾 Sistema de Save

O jogo salva automaticamente o progresso no `localStorage` do navegador. Para resetar:

```javascript
localStorage.removeItem('emissariesChroniclesSave_v2');
```

### 🎮 Modificando Dificuldade

1. **Ajuste a experiência necessária para level up em `game-data.js`:**

```javascript
progression: {
    levels: {
        1: { name: 'Aprendiz', experience: 0, maxExperience: 100 },
        2: { name: 'Iniciante', experience: 100, maxExperience: 250 },
        // Modifique os valores conforme desejado
    }
}
```

### 🏆 Adicionando Conquistas

```javascript
nova_conquista: {
    name: 'Nome da Conquista',
    description: 'Como desbloquear esta conquista',
    emoji: '🏆',
    unlocked: false
}
```

---

## 🐛 Solução de Problemas

### ❌ Problemas Comuns

1. **Jogo não carrega:**
   - Verifique se todos os arquivos estão no mesmo diretório
   - Confirme que `game-data.js` está sendo carregado antes de `game-engine.js`

2. **Erro de sintaxe em JSON:**
   - Verifique vírgulas e chaves em `game-data.js`
   - Use um validador JSON online para verificar a sintaxe

3. **Personagem não aparece:**
   - Confirme que o ID do personagem está listado no array `npcs` do cenário
   - Verifique se o personagem está definido na seção `characters`

4. **Quest não funciona:**
   - Confirme que `questId` do personagem corresponde ao `id` da quest
   - Verifique se a poção necessária existe na seção `recipes`

### 🔍 Debug

Para ativar logs detalhados, abra o console do navegador (F12) e digite:

```javascript
window.gameEngine.gameState  // Ver estado atual do jogo
GAME_DATA                    // Ver todos os dados do jogo
```

---

## 📱 Responsividade e Acessibilidade

### 📱 Dispositivos Móveis

O jogo é totalmente responsivo e funciona em:
- Smartphones (320px+)
- Tablets (768px+)
- Desktops (1024px+)

### ♿ Acessibilidade

- **Navegação por teclado**: Todos os elementos são acessíveis via Tab
- **Leitores de tela**: Textos alternativos e labels apropriados
- **Contraste**: Cores seguem diretrizes WCAG 2.1
- **Movimento reduzido**: Respeita preferências do sistema

---

## 🚀 Deployment e Hospedagem

### 🌐 Hospedagem Simples

1. **GitHub Pages:**
   - Faça upload dos arquivos para um repositório GitHub
   - Ative GitHub Pages nas configurações
   - Acesse via `https://seuusuario.github.io/nome-do-repo`

2. **Netlify:**
   - Arraste a pasta do projeto para netlify.com
   - Receba URL automática
   - Configure domínio personalizado se desejar

3. **Servidor Local:**
   - Use Python: `python -m http.server 8000`
   - Use Node.js: `npx serve .`
   - Acesse via `http://localhost:8000`

### 🔒 Considerações de Segurança

- Todos os dados são armazenados localmente no navegador
- Nenhuma informação pessoal é coletada ou transmitida
- O jogo funciona completamente offline após carregamento inicial

---

## 📈 Métricas e Analytics

### 📊 Dados Coletados Localmente

O jogo rastreia automaticamente:
- Quests completadas
- Poções criadas
- Conflitos resolvidos
- Personagens ajudados
- Tempo de jogo
- Cenários visitados

### 📈 Implementando Analytics Externos

Para adicionar Google Analytics ou similar:

1. **Adicione o código de tracking no `<head>` do HTML**
2. **Implemente eventos customizados no `game-engine.js`:**

```javascript
// Exemplo de evento customizado
gtag('event', 'quest_completed', {
    'quest_name': questId,
    'player_level': this.gameState.player.level
});
```

---

## 🤝 Contribuindo

### 🎯 Como Contribuir

1. **Reporte bugs** através de issues detalhadas
2. **Sugira melhorias** com descrições claras
3. **Contribua com conteúdo** seguindo os padrões estabelecidos
4. **Teste em diferentes dispositivos** e navegadores

### 📝 Padrões de Código

- **JavaScript**: Use ES6+ e comentários descritivos
- **CSS**: Siga a metodologia BEM para classes
- **JSON**: Mantenha estrutura consistente em `game-data.js`
- **Documentação**: Atualize esta documentação ao adicionar features

---

## 📚 Recursos Educacionais

### 🧠 Habilidades Desenvolvidas

- **Empatia**: Compreender perspectivas diferentes
- **Comunicação**: Escolher palavras adequadas para cada situação
- **Resolução de Conflitos**: Mediar disputas de forma construtiva
- **Inteligência Emocional**: Reconhecer e gerenciar emoções
- **Paciência**: Lidar com situações frustrantes
- **Autoconhecimento**: Refletir sobre próprias reações

### 📖 Base Teórica

O jogo é baseado em:
- **Teoria da Inteligência Emocional** (Daniel Goleman)
- **Comunicação Não-Violenta** (Marshall Rosenberg)
- **Psicologia Positiva** (Martin Seligman)
- **Teoria da Autodeterminação** (Deci & Ryan)

---

## 🔮 Roadmap Futuro

### 🎯 Próximas Features

- [ ] **Sistema de Multiplayer**: Resolver conflitos em equipe
- [ ] **Editor Visual**: Interface para criar conteúdo sem código
- [ ] **Modo História**: Campanha principal com narrativa linear
- [ ] **Sistema de Badges**: Conquistas visuais compartilháveis
- [ ] **Integração com LMS**: Compatibilidade com plataformas educacionais
- [ ] **Relatórios de Progresso**: Analytics detalhados para educadores
- [ ] **Versão Mobile App**: Aplicativo nativo para iOS/Android
- [ ] **Localização**: Suporte para múltiplos idiomas

### 🌟 Visão de Longo Prazo

Transformar "Crônicas dos Emissários" em uma plataforma completa de desenvolvimento socioemocional, utilizada em escolas, empresas e terapias, promovendo um mundo mais empático e compreensivo.

---

## 📞 Suporte e Contato

### 🆘 Precisa de Ajuda?

- **Email**: contato@deomagalhaes.com.br
- **WhatsApp**: (35) 9 3300-3807
- **Instagram**: @deomagalhaesneuro

### 🤝 Parcerias e Licenciamento

Para uso comercial, parcerias educacionais ou licenciamento, entre em contato através dos canais oficiais.

---

## 📄 Licença e Créditos

### 📜 Licença

Este projeto é desenvolvido para fins educacionais e terapêuticos. Todos os direitos reservados a Deo Magalhães - Neuropsicólogo CRP 04/42784.

### 🙏 Créditos

- **Desenvolvimento**: Manus AI
- **Conceito e Supervisão**: Deo Magalhães
- **Fontes**: Google Fonts (Cinzel, MedievalSharp, Press Start 2P)
- **Framework CSS**: Tailwind CSS
- **Inspiração**: Jogos educacionais e terapia lúdica

---

*Desenvolvido com ❤️ para ensinar habilidades sociais e promover a empatia no mundo.*

