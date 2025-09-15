// ===== CRÔNICAS DOS EMISSÁRIOS - MOTOR DO JOGO (VERSÃO FINAL) =====
// Sistema modular e expansível para gerenciamento do jogo

class EmissariesGameEngine {
    constructor() {
        this.gameState = {};
        this.cauldronPotions = [];
        this.currentDialogue = null;
        this.currentMinigame = null;
        this.audioManager = null;
        this.failedAttempts = 0; // Contador para dicas
        this.emotionalCombat = new EmotionalCombatSystem(this);
        
        // Elementos DOM
        this.DOM = {
            viewport: document.getElementById('game-viewport'),
            screens: {
                start: document.getElementById('start-screen'),
                characterCreation: document.getElementById('character-creation-screen'),
                world: document.getElementById('world-screen'),
                dialogue: document.getElementById('dialogue-screen'),
                minigame: document.getElementById('minigame-screen'),
                inventory: document.getElementById('inventory-screen'),
                worldMap: document.getElementById('world-map-screen')
            },
            
            // Botões principais
            worldMapButton: document.getElementById('world-map-button'), // << ADICIONAR
            closeMapButton: document.getElementById('close-map-button'), // << ADICIONAR
            startNewGameButton: document.getElementById('start-new-game-button'),
            continueGameButton: document.getElementById('continue-game-button'),
            mainMenuButton: document.getElementById('main-menu-button'),
            
            // Criação de personagem
            playerNameInput: document.getElementById('player-name'),
            avatarSelection: document.getElementById('avatar-selection'),
            confirmCharacterButton: document.getElementById('confirm-character-button'),
            
            // HUD do jogador
            playerHud: {
                avatar: document.getElementById('hud-avatar'),
                name: document.getElementById('hud-name')
            },
            
            // Cena do mundo
            scene: {
                title: document.getElementById('scene-title'),
                image: document.getElementById('scene-image'),
                description: document.getElementById('scene-description'),
                actions: document.getElementById('scene-actions')
            },

            
            
            // Sistema de diálogo
            dialogue: {
                npcSprite: document.getElementById('dialogue-npc-sprite'),
                npcName: document.getElementById('dialogue-npc-name'),
                npcTitle: document.getElementById('dialogue-npc-title'),
                text: document.getElementById('dialogue-text'),
                options: document.getElementById('dialogue-options'),
                backButton: document.getElementById('dialogue-back-button')
            },
            
            // Mini-game
            minigame: {
                goal: document.getElementById('minigame-goal'),
                potionsContainer: document.getElementById('potions-container'),
                cauldronLiquid: document.getElementById('cauldron-liquid'),
                bubblesContainer: document.getElementById('bubbles-container'),
                mixButton: document.getElementById('mix-button'),
                clearButton: document.getElementById('clear-button'),
                result: document.getElementById('minigame-result'),
                hintContainer: document.getElementById('hint-container')
            },
            
            // Inventário
            inventoryButton: document.getElementById('inventory-button'),
            inventoryContainer: document.getElementById('inventory-container'),
            closeInventoryButton: document.getElementById('close-inventory-button'),
            
            // Áudio
            sfx: {
                click: document.getElementById('sfx-click'),
                mix: document.getElementById('sfx-mix'),
                success: document.getElementById('sfx-success'),
                failure: document.getElementById('sfx-failure')
            }
        };
        
        this.init();
    }

        // ===== SISTEMA DE MAPA-MÚNDI =====
    showWorldMap() {
        this.audioManager.playSfx('click');
        // Futuramente, podemos adicionar lógica para mostrar/esconder mapas aqui
        this.showScreen('worldMap');
    }

    travelToMap(mapId) {
        this.audioManager.playSfx('success');
        this.gameState.currentMap = mapId;

        // Encontra o primeiro cenário (menor nível) do mapa de destino
        let firstSceneOfMap = null;
        let lowestLevel = Infinity;

        for (const sceneId in GAME_DATA.scenarios) {
            const scenario = GAME_DATA.scenarios[sceneId];
            if (scenario.mapId === mapId && scenario.level < lowestLevel) {
                lowestLevel = scenario.level;
                firstSceneOfMap = sceneId;
            }
        }

        if (firstSceneOfMap) {
            this.renderScene(firstSceneOfMap);
            this.showScreen('world');
        } else {
            console.error(`Não foi possível encontrar um cenário inicial para o mapa: ${mapId}`);
            // Volta para o mapa anterior em caso de erro
            this.showScreen('world');
        }
    }

    
    // ===== INICIALIZAÇÃO =====
    init() {
        console.log('🎮 Inicializando Crônicas dos Emissários v2.1.0...');
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Configurar áudio
        this.setupAudio();
        
        // Verificar jogo salvo
        this.checkForSavedGame();
        
        // Configurar sistemas
        this.setupCharacterCreation();
        this.setupMinigame();
        this.setupInventory();

        
        console.log('✅ Jogo inicializado com sucesso!');
    }

    
    setupEventListeners() {
        // Botões principais
        if (this.DOM.startNewGameButton) {
            this.DOM.startNewGameButton.onclick = () => this.newGame();
        }
        if (this.DOM.continueGameButton) {
            this.DOM.continueGameButton.onclick = () => this.continueGame();
        }
        if (this.DOM.mainMenuButton) {
            this.DOM.mainMenuButton.onclick = () => this.goToMainMenu();
        }
        
        // Mini-game
        if (this.DOM.minigame.mixButton) {
            this.DOM.minigame.mixButton.onclick = () => this.mixPotions();
        }
        if (this.DOM.minigame.clearButton) {
            this.DOM.minigame.clearButton.onclick = () => this.clearCauldron();
        }
        
        // Inventário
        if (this.DOM.inventoryButton) {
            this.DOM.inventoryButton.onclick = () => this.showInventory();
        }
        if (this.DOM.closeInventoryButton) {
            this.DOM.closeInventoryButton.onclick = () => this.hideInventory();
        }
        
        // Criação de personagem
        if (this.DOM.confirmCharacterButton) {
            this.DOM.confirmCharacterButton.onclick = () => this.confirmCharacter();
        }
        
        // Botão voltar do diálogo
        if (this.DOM.dialogue.backButton) {
            this.DOM.dialogue.backButton.onclick = () => {
                this.audioManager.playSfx('click');
                this.audioManager.playMusic('menu_theme');
                this.showScreen('world');
            };
        }

        // >>> ADICIONAR ESTAS LINHAS <<< botões do mapa mundi
        if (this.DOM.worldMapButton) {
            this.DOM.worldMapButton.onclick = () => this.showWorldMap();
        }
        if (this.DOM.closeMapButton) {
            this.DOM.closeMapButton.onclick = () => this.showScreen('world');
        }

        // ===== SISTEMA DE FACÇÕES E REPUTAÇÃO =====

// Função para inicializar o sistema de facções
function initializeFactionSystem() {
    if (!gameState.factionReputation) {
        gameState.factionReputation = {
            cristalinos: 0,
            fluidos: 0,
            equilibristas: 0
        };
    }
}

// Função para atualizar reputação com facção
function updateFactionReputation(factionId, change, reason = '') {
    if (!gameState.factionReputation) {
        initializeFactionSystem();
    }
    
    const oldRep = gameState.factionReputation[factionId];
    gameState.factionReputation[factionId] = Math.max(-100, Math.min(100, oldRep + change));
    const newRep = gameState.factionReputation[factionId];
    
    // Log da mudança de reputação
    if (change !== 0) {
        const factionName = GAME_DATA.factions[factionId].name;
        const changeText = change > 0 ? `+${change}` : `${change}`;
        const emoji = GAME_DATA.factions[factionId].emoji;
        
        showNotification(`${emoji} ${factionName}: ${changeText} reputação`, 
                        change > 0 ? 'success' : 'warning');
        
        // Verificar mudanças de nível de reputação
        const oldLevel = getReputationLevel(oldRep);
        const newLevel = getReputationLevel(newRep);
        
        if (oldLevel !== newLevel) {
            showNotification(`Status com ${factionName}: ${newLevel}`, 'info');
        }
    }
    
    saveGameState();
    updateFactionDisplay();
}

// Função para obter nível de reputação
function getReputationLevel(reputation) {
    if (reputation >= 81) return 'Venerado';
    if (reputation >= 51) return 'Aliado';
    if (reputation >= 21) return 'Amigável';
    if (reputation >= -20) return 'Neutro';
    if (reputation >= -50) return 'Desconfiado';
    return 'Hostil';
}

// Função para obter cor do nível de reputação
function getReputationColor(reputation) {
    if (reputation >= 81) return '#10B981'; // Verde escuro
    if (reputation >= 51) return '#34D399'; // Verde
    if (reputation >= 21) return '#6EE7B7'; // Verde claro
    if (reputation >= -20) return '#9CA3AF'; // Cinza
    if (reputation >= -50) return '#F59E0B'; // Laranja
    return '#EF4444'; // Vermelho
}

// Função para verificar se pode interagir com facção
function canInteractWithFaction(factionId) {
    const reputation = gameState.factionReputation[factionId] || 0;
    return reputation > -100; // Apenas "Hostil" completo bloqueia interação
}

// Função para atualizar display das facções
function updateFactionDisplay() {
    const factionContainer = document.getElementById('faction-status');
    if (!factionContainer) return;
    
    let html = '<div class="faction-reputation-panel">';
    html += '<h3>🏛️ Status das Facções</h3>';
    
    Object.keys(GAME_DATA.factions).forEach(factionId => {
        const faction = GAME_DATA.factions[factionId];
        const reputation = gameState.factionReputation[factionId] || 0;
        const level = getReputationLevel(reputation);
        const color = getReputationColor(reputation);
        
        html += `
            <div class="faction-status-item" style="border-left: 4px solid ${color}">
                <div class="faction-header">
                    <span class="faction-emoji">${faction.emoji}</span>
                    <span class="faction-name">${faction.name}</span>
                    <span class="reputation-level" style="color: ${color}">${level}</span>
                </div>
                <div class="reputation-bar">
                    <div class="reputation-fill" style="width: ${(reputation + 100) / 2}%; background-color: ${color}"></div>
                </div>
                <div class="reputation-value">${reputation > 0 ? '+' : ''}${reputation}</div>
            </div>
        `;
    });
    
    html += '</div>';
    factionContainer.innerHTML = html;
}

// Função para processar escolhas de diálogo com impacto em facções
function processDialogueChoice(choice, questId) {
    // Processar mudanças de reputação
    if (choice.factionChange) {
        Object.keys(choice.factionChange).forEach(factionId => {
            updateFactionReputation(factionId, choice.factionChange[factionId], 
                                  `Escolha de diálogo em ${questId}`);
        });
    }
    
    // Continuar com processamento normal de diálogo
    if (choice.next) {
        const quest = GAME_DATA.quests[questId];
        if (quest && quest.dialogueTree && quest.dialogueTree[choice.next]) {
            displayDialogue(quest.dialogueTree[choice.next], questId);
        }
    }
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const container = document.getElementById('notification-container') || document.body;
    container.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Modificar função de inicialização do jogo para incluir facções
const originalInitializeGame = initializeGame;
function initializeGame() {
    originalInitializeGame();
    initializeFactionSystem();
    updateFactionDisplay();
}

// Modificar função de carregamento de cenário para verificar acesso por facção
function canAccessScenario(scenarioId) {
    const scenario = GAME_DATA.scenarios[scenarioId];
    if (!scenario) return false;
    
    // Verificar se o cenário pertence a uma facção
    const factionScenarios = {
        'LaboratorioCristalino': 'cristalinos',
        'JardimFluido': 'fluidos',
        'SalaoEquilibrio': 'equilibristas'
    };
    
    const requiredFaction = factionScenarios[scenarioId];
    if (requiredFaction) {
        const reputation = gameState.factionReputation[requiredFaction] || 0;
        if (reputation < -50) { // Desconfiado ou pior
            showNotification(`${GAME_DATA.factions[requiredFaction].emoji} Acesso negado: reputação insuficiente com ${GAME_DATA.factions[requiredFaction].name}`, 'error');
            return false;
        }
    }
    
    return true;
}
        
        // Música de fundo (ativar com interação do usuário)
        document.body.addEventListener('click', () => {
            this.startBackgroundMusic();
        }, { once: true });

    // Listener para os botões de seleção de mapa
        document.getElementById('map-selection-container').addEventListener('click', (e) => {
            if (e.target.matches('.map-option-button')) {
                const mapId = e.target.dataset.map;
                this.travelToMap(mapId);
            }
        });
    }
    
    setupAudio() {
        this.audioManager = {
            currentMusic: null,
            musicVolume: 0.3,
            sfxVolume: 0.5,
            
            playMusic: (trackName) => {
                const music = document.getElementById('bg-music');
                const newTrackSrc = GAME_DATA.audio.backgroundMusic[trackName];

                // Se a música pedida já estiver tocando, não faz nada.
                if (this.audioManager.currentMusic && this.audioManager.currentMusic.src === newTrackSrc && !this.audioManager.currentMusic.paused) {
                    return;
                }

                if (this.audioManager.currentMusic) {
                    this.audioManager.currentMusic.pause();
                }
                
                if (music && newTrackSrc) {
                    music.src = newTrackSrc;
                    music.volume = this.audioManager.musicVolume;
                    music.loop = true;
                    music.play().catch(e => console.log('Música requer interação do usuário para começar.'));
                    this.audioManager.currentMusic = music;
                }
            },

            
            playSfx: (soundName) => {
                const sound = this.DOM.sfx[soundName];
                if (sound) {
                    sound.currentTime = 0;
                    sound.volume = this.audioManager.sfxVolume;
                    sound.play().catch(e => {});
                }
            }
        };
    }
    
    startBackgroundMusic() {
        const currentScenario = this.gameState.currentScene;
        if (currentScenario && GAME_DATA.scenarios[currentScenario]) {
            const musicTrack = GAME_DATA.scenarios[currentScenario].music;
            if (musicTrack) {
                this.audioManager.playMusic(musicTrack);
            }
        }
    }
    
    // ===== GERENCIAMENTO DE ESTADO =====
    saveGame() {
        try {
            localStorage.setItem(GAME_DATA.saveKey, JSON.stringify(this.gameState));
            console.log('💾 Jogo salvo com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao salvar jogo:', error);
        }
    }
    
    loadGame() {
        try {
            const savedData = localStorage.getItem(GAME_DATA.saveKey);
            if (savedData) {
                this.gameState = JSON.parse(savedData);
                console.log('📂 Jogo carregado com sucesso!');
                return true;
            }
        } catch (error) {
            console.error('❌ Erro ao carregar jogo:', error);
        }
        return false;
    }
    
    checkForSavedGame() {
        const hasSavedGame = localStorage.getItem(GAME_DATA.saveKey);
        if (this.DOM.continueGameButton) {
            this.DOM.continueGameButton.classList.toggle('hidden', !hasSavedGame);
        }
    }
    
    // ===== NAVEGAÇÃO ENTRE TELAS =====
    showScreen(screenName) {
        // Esconder todas as telas
        Object.values(this.DOM.screens).forEach(screen => {
            if (screen) {
                screen.classList.add('hidden');
            }
        });
        
        // Mostrar tela solicitada
        if (this.DOM.screens[screenName]) {
            this.DOM.screens[screenName].classList.remove('hidden');
            this.DOM.screens[screenName].classList.add('fade-in');
            
            // Remover classe de animação após completar
            setTimeout(() => {
                this.DOM.screens[screenName].classList.remove('fade-in');
            }, 500);
        }
    }
    
    // ===== INÍCIO E CONTINUAÇÃO DO JOGO =====
    newGame() {
        this.audioManager.playSfx('click');
        
        // Inicializar estado do jogo
        this.gameState = {
            player: { 
                name: '', 
                avatar: '', 
                level: 1, 
                experience: 0,
                maxExperience: 100
            },
            currentMap: 'elara',
            currentScene: 'VilaDaForja',
            visitedScenes: ['VilaDaForja'],
            inventory: [],
            completedQuests: [],
            activeQuests: [],
            unlockedScenarios: ['VilaDaForja'], // Começar apenas com Vila da Forja
            achievements: {},
            statistics: {
                questsCompleted: 0,
                potionsMixed: 0,
                conflictsResolved: 0,
                charactersHelped: 0
            }
        };
        
        // Inicializar conquistas
        Object.keys(GAME_DATA.achievements).forEach(achievementId => {
            this.gameState.achievements[achievementId] = false;
        });
        
         this.showScreen('worldMap');
    }
    
    continueGame() {
        this.audioManager.playSfx('click');
        
        if (this.loadGame()) {
            this.updateHud();
            this.renderScene(this.gameState.currentScene);
            this.showScreen('world');
        } else {
            alert('Erro ao carregar jogo salvo. Iniciando novo jogo...');
            this.newGame();
        }
    }
    
    goToMainMenu() {
        this.audioManager.playSfx('click');
        this.showScreen('start');
        this.checkForSavedGame();
    }
    
    // ===== CRIAÇÃO DE PERSONAGEM =====
    setupCharacterCreation() {
        let selectedAvatar = null;
        
        // Seleção de avatar
        if (this.DOM.avatarSelection) {
            this.DOM.avatarSelection.addEventListener('click', (e) => {
                const avatarDiv = e.target.closest('[data-avatar]');
                if (!avatarDiv) return;
                
                // Remover seleção anterior
                this.DOM.avatarSelection.querySelectorAll('.selected-avatar').forEach(el => {
                    el.classList.remove('selected-avatar', 'bg-purple-500/50', 'ring-4', 'ring-purple-400');
                });
                
                // Adicionar nova seleção
                avatarDiv.classList.add('selected-avatar', 'bg-purple-500/50', 'ring-4', 'ring-purple-400');
                selectedAvatar = avatarDiv.dataset.avatar;
                this.gameState.player.avatar = selectedAvatar;
                this.checkCharacterConfirmation();
            });
        }
        
        // Input do nome
        if (this.DOM.playerNameInput) {
            this.DOM.playerNameInput.addEventListener('input', (e) => {
                this.gameState.player.name = e.target.value.trim();
                this.checkCharacterConfirmation();
            });
        }
    }
    
    checkCharacterConfirmation() {
        const isValid = this.gameState.player.name && this.gameState.player.avatar;
        if (this.DOM.confirmCharacterButton) {
            this.DOM.confirmCharacterButton.disabled = !isValid;
            
            if (isValid) {
                this.DOM.confirmCharacterButton.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                this.DOM.confirmCharacterButton.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }
    }
    
    confirmCharacter() {
        if (this.gameState.player.name && this.gameState.player.avatar) {
            this.audioManager.playSfx('success');
            
            // Adicionar item inicial
            this.addToInventory('diario_empatia');
            
            this.saveGame();
            this.updateHud();
            this.renderScene(this.gameState.currentScene);
            this.showScreen('world');
            
            // Mostrar dica inicial
            this.showTip(GAME_DATA.narrative.tips[0]);
        }
    }
    
    // ===== SISTEMA DE HUD (VERSÃO ATUALIZADA) =====
    updateHud() {
        if (!this.gameState || !this.gameState.player) return;

        const player = this.gameState.player;
        const levelData = GAME_DATA.progression.levels[player.level];

        // Atualiza o avatar
        if (this.DOM.playerHud.avatar) {
            this.DOM.playerHud.avatar.textContent = player.avatar;
        }
        // Atualiza o nome
        if (this.DOM.playerHud.name) {
            this.DOM.playerHud.name.textContent = player.name;
        }

        // >>> NOVA LÓGICA PARA ATUALIZAR NÍVEL E TÍTULO <<<
        // Encontra o elemento de nível/título no HTML
        const levelDisplay = document.querySelector('#hud-level-title'); 
        if (levelDisplay && levelData) {
            levelDisplay.textContent = `Nível ${player.level} - ${levelData.name}`;
        }
    }

    
    // ===== RENDERIZAÇÃO DE CENÁRIOS (VERSÃO CORRIGIDA) =====
    renderScene(sceneId) {
        const scenario = GAME_DATA.scenarios[sceneId];
        if (!scenario) {
            console.error(`❌ Cenário não encontrado: ${sceneId}`);
            return;
        }

        // >>> PASSO 1: ATUALIZAR O ESTADO PRIMEIRO <<<
        // Esta é a mudança crucial. Garante que o resto da função
        // use a informação da cena correta (a nova).
        this.gameState.currentScene = sceneId;

        // Marcar como visitado (agora que o estado está correto)
        if (!this.gameState.visitedScenes.includes(sceneId)) {
            this.gameState.visitedScenes.push(sceneId);
        }
        
        // >>> PASSO 2: RENDERIZAR A INTERFACE DEPOIS DA ATUALIZAÇÃO <<<
        // Atualizar elementos visuais da cena
        if (this.DOM.scene.title) {
            this.DOM.scene.title.textContent = scenario.name;
        }
        if (this.DOM.scene.image) {
            this.DOM.scene.image.textContent = scenario.emoji;
        }
        if (this.DOM.scene.description) {
            this.DOM.scene.description.textContent = scenario.description;
        }
        
        // Aplicar background do cenário
        const gameScreen = document.querySelector('.game-screen');
        if (gameScreen && scenario.background) {
            gameScreen.style.background = scenario.background;
        }
        
        // Tocar música do cenário
        if (scenario.music) {
            this.audioManager.playMusic(scenario.music);
        }
        
        // Renderizar ações disponíveis (AGORA COM O ESTADO CORRETO)
        // Esta função agora funcionará corretamente.
        this.renderSceneActions(scenario);
        
        // Salvar progresso no final
        this.saveGame();
        
        console.log(`🗺️ Renderizando cenário: ${scenario.name}`);
    }

    
renderSceneActions(scenario) {
    if (!this.DOM.scene.actions) return;
    
    this.DOM.scene.actions.innerHTML = '';
    
    // Ações de NPCs disponíveis
    if (scenario.npcs) {
        scenario.npcs.forEach(npcId => {
            const character = GAME_DATA.characters[npcId];
            if (!character) return;

            const quest = GAME_DATA.quests[character.questId];
            let canShow = true;

            // ===== LÓGICA ADICIONADA AQUI =====
            // Se a missão do NPC requer que outra missão esteja completa, verificamos.
            if (quest && quest.requiredCompletedQuest) {
                if (!this.gameState.completedQuests.includes(quest.requiredCompletedQuest)) {
                    canShow = false; // Não mostre este NPC ainda.
                }
            }
            // ===================================

            if (canShow) {
                let buttonText = `${character.emoji} Conversar com ${character.name}`;
                const isQuestCompleted = this.gameState.completedQuests.includes(character.questId);

                if (isQuestCompleted) {
                    buttonText += " ✅";
                }

                const button = this.createActionButton(
                    buttonText,
                    () => this.startDialogue(npcId),
                    'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                );

                if (isQuestCompleted) {
                    button.classList.add('opacity-70', 'hover:opacity-100');
                    button.title = "Você já ajudou este personagem.";
                }

                this.DOM.scene.actions.appendChild(button);
            }
        });
    }
        
        // Ações de exploração (Lógica de Nível)
        if (scenario.connections) {
            const currentScenarioData = GAME_DATA.scenarios[this.gameState.currentScene];

            scenario.connections.forEach(connectionId => {
                const connectedScenario = GAME_DATA.scenarios[connectionId];
                
                // A verificação crucial é se o cenário de destino pertence ao mapa atual.
                if (connectedScenario && connectedScenario.mapId === this.gameState.currentMap && this.gameState.unlockedScenarios.includes(connectionId)) {
                    
                    let buttonText = "";
                    const currentLevel = currentScenarioData.level || 0;
                    const destinationLevel = connectedScenario.level || 0;

                    if (destinationLevel > currentLevel) {
                        buttonText = `Ir para ${connectedScenario.name} →`;
                    } else if (destinationLevel < currentLevel) {
                        buttonText = `← Voltar para ${connectedScenario.name}`;
                    } else {
                        buttonText = `Visitar ${connectedScenario.name}`;
                    }

                    const button = this.createActionButton(
                        buttonText,
                        () => this.travelToScene(connectionId),
                        'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                    );
                    this.DOM.scene.actions.appendChild(button);
                }
            });
        }
    }


    
    renderSpecialActions(scenario) {
        // Verificar se o jogador tem itens que desbloqueiam ações especiais
        if (this.hasItem('cristal_harmonia')) {
            const button = this.createActionButton(
                '💎 Usar Cristal da Harmonia',
                () => this.useItem('cristal_harmonia'),
                'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
            );
            this.DOM.scene.actions.appendChild(button);
        }
        
        if (this.hasItem('lente_compreensao')) {
            const button = this.createActionButton(
                '🔍 Usar Lente da Compreensão',
                () => this.useItem('lente_compreensao'),
                'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'
            );
            this.DOM.scene.actions.appendChild(button);
        }
    }
    
    createActionButton(text, onClick, classes = '') {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = `magical-font text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${classes}`;
        button.onclick = () => {
            this.audioManager.playSfx('click');
            onClick();
        };
        return button;
    }
    
    travelToScene(sceneId) {
        this.renderScene(sceneId);
        this.showTip('Você chegou a um novo local. Explore e converse com os habitantes!');
    }
    
    // ===== SISTEMA DE DIÁLOGOS =====
    startDialogue(npcId) {
        const character = GAME_DATA.characters[npcId];
        if (!character) {
            console.error(`❌ Personagem não encontrado: ${npcId}`);
            return;
        }
        
        this.currentDialogue = {
            character: character,
            questId: character.questId,
            currentNode: 'start'
        };
        
        // Resetar tentativas falhadas para novo diálogo
        this.failedAttempts = 0;
        
        // Atualizar informações do NPC
        if (this.DOM.dialogue.npcSprite) {
            this.DOM.dialogue.npcSprite.textContent = character.emoji;
        }
        if (this.DOM.dialogue.npcName) {
            this.DOM.dialogue.npcName.textContent = character.name;
        }
        if (this.DOM.dialogue.npcTitle) {
            this.DOM.dialogue.npcTitle.textContent = character.title;
        }
        
        // Renderizar primeiro nó do diálogo
        this.renderDialogueNode('start');
        
        this.showScreen('dialogue');
    }
    
    renderDialogueNode(nodeId) {
        // Se o nó for para encerrar o diálogo, simplesmente volte para o mundo.
        if (nodeId === 'end_dialogue') {
            this.showScreen('world');
            return;
        }

        const quest = GAME_DATA.quests[this.currentDialogue.questId];
        if (!quest || !quest.dialogueTree || !quest.dialogueTree[nodeId]) {
            console.error(`❌ Nó de diálogo não encontrado: ${nodeId}`);
            return;
        }
        
        const node = quest.dialogueTree[nodeId];
        
        if (this.DOM.dialogue.text) {
            this.DOM.dialogue.text.textContent = node.text;
        }
        
        if (this.DOM.dialogue.options) {
            this.DOM.dialogue.options.innerHTML = '';
        
            if (node.options && node.options.length > 0) {
                node.options.forEach((option, index) => {
                    let showOption = true;
                    let buttonText = option.text;
                    let effectiveNext = option.next;

                    // Lógica de verificação de item
                    if (option.requiresItem) {
                        if (this.hasItem(option.requiresItem)) {
                            // O jogador TEM o item.
                            if (option.hiddenText) {
                                buttonText += option.hiddenText;
                            }
                            // Se esta opção é para quem TEM o item, não mostre a opção de falha.
                            if (option.requirementFails) {
                                showOption = false;
                            }
                        } else {
                            // O jogador NÃO TEM o item.
                            // Se esta opção é para quem NÃO TEM o item, mostre-a.
                            if (option.requirementFails) {
                                effectiveNext = option.next;
                            } else {
                                // Se não for a opção de falha, esconda-a.
                                showOption = false;
                            }
                        }
                    }

                    if (showOption) {
                        const button = document.createElement('button');
                        button.textContent = buttonText;
                        button.className = 'dialogue-option text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 w-full text-left bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 mb-2';
                        
                        if (option.requiresItem && !option.requirementFails) {
                            button.classList.add('magical-glow', 'text-yellow-300');
                        }

                        button.onclick = () => {
                            this.audioManager.playSfx('click');
                            // Usamos a variável effectiveNext que foi determinada pela lógica
                            this.handleDialogueChoice({ ...option, next: effectiveNext });
                        };
                        this.DOM.dialogue.options.appendChild(button);
                    }
                });
// VERSÃO CORRIGIDA
            } else {
                // Se for um nó final (sem opções de diálogo)
                if (node.reward) {
                    // Se o nó final tem uma recompensa, a missão está completa.
                    this.completeQuest(this.currentDialogue.questId);
                    
                    // CRUCIAL: Redesenha a cena atual para refletir as mudanças (novo local, checkmark no NPC).
                    this.renderScene(this.gameState.currentScene); 
                    this.showScreen('world'); // Mostra a tela do mundo já atualizada.

                } else {
                    // Se for um nó final sem recompensa (um diálogo simples que termina).
                    const button = document.createElement('button');
                    button.textContent = 'Continuar';
                    button.className = 'dialogue-option text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700';
                    button.onclick = () => {
                        this.audioManager.playSfx('click');
                        this.showScreen('world'); // Aqui está correto, pois nada mudou no estado do mundo.
                    };
                    this.DOM.dialogue.options.appendChild(button);
                }
            }

        }
    }


    
    handleDialogueChoice(option) {
        
            if (option.choiceId) {
        const questId = this.currentDialogue.questId;

        // Verificação específica para iniciar o combate emocional
        if (questId === 'diplomacia_convergente' && option.choiceId === 'iniciar_conflito') {
            console.log("🚦 Reconhecida escolha de iniciar conflito. Chamando sistema de combate...");
            
            // Chama o método para iniciar o combate emocional
            // O 'true' como retorno indica que a ação foi tratada e o fluxo normal deve parar.
            const combatStarted = this.emotionalCombat.startEmotionalCombat('conflito_cristalino', 'mediador_anciao');
            
            if (combatStarted) {
                // Se o combate iniciou, não prossiga para o próximo nó de diálogo.
                return; 
            } else {
                console.error("❌ Falha ao iniciar o combate emocional. Verifique a questId e o tipo.");
            }
        }
    }

        if (option.next) {
            // Verificar se precisa de mini-game
            if (option.next === 'minigame_trigger' || option.next === 'minigame_start') {
                this.startMinigameFromDialogue();
            } else {
                this.renderDialogueNode(option.next);
            }
        } else {
            // Voltar ao mundo
            this.showScreen('world');
        }
    }
    
    startMinigameFromDialogue() {
        const quest = GAME_DATA.quests[this.currentDialogue.questId];
        if (quest && quest.requiredPotion) {
            this.startMinigame(quest.requiredPotion, this.currentDialogue);
        }
    }
    
    // ===== SISTEMA DE MINI-GAME =====
    setupMinigame() {
        this.createPotionButtons();
    }
    
    createPotionButtons() {
        if (!this.DOM.minigame.potionsContainer) return;
        
        this.DOM.minigame.potionsContainer.innerHTML = '';
        
        Object.entries(GAME_DATA.potions).forEach(([potionId, potion]) => {
            const button = document.createElement('button');
            button.className = 'potion-bottle bg-gradient-to-b from-white to-gray-200 border-4 border-gray-400 rounded-lg p-4 text-center transition-all duration-300 hover:shadow-lg';
            button.dataset.potionId = potionId;
            button.innerHTML = `
                <div class="text-4xl mb-2">${potion.emoji}</div>
                <div class="text-sm font-bold text-gray-800">${potion.name}</div>
                <div class="w-8 h-8 rounded-full mx-auto mt-2" style="background-color: ${potion.color}"></div>
            `;
            button.title = potion.description;
            
            button.onclick = () => this.addPotionToCauldron(potionId);
            
            this.DOM.minigame.potionsContainer.appendChild(button);
        });
    }
    
    startMinigame(targetRecipe, returnDialogue) {
        this.currentMinigame = {
            targetRecipe: targetRecipe,
            returnDialogue: returnDialogue
        };
        
        // Resetar contador de tentativas para novo mini-game
        this.failedAttempts = 0;
        
        const recipe = GAME_DATA.recipes[targetRecipe];
        if (this.DOM.minigame.goal && recipe) {
            this.DOM.minigame.goal.textContent = `Crie a poção "${targetRecipe}" para ajudar ${returnDialogue.character.name}. ${recipe.description}`;
        }
        
        // Limpar caldeirão e dicas
        this.clearCauldron();
        this.clearHints();
        
        this.showScreen('minigame');
    }
    
    addPotionToCauldron(potionId) {
        if (this.cauldronPotions.length >= 2) {
            this.showTip('O caldeirão já está cheio! Misture as poções ou limpe o caldeirão.');
            return;
        }
        
        if (this.cauldronPotions.includes(potionId)) {
            this.showTip('Esta poção já está no caldeirão!');
            return;
        }
        
        this.audioManager.playSfx('click');
        this.cauldronPotions.push(potionId);
        this.updateCauldronVisuals();
        this.updateMinigameButtons();
        
        console.log(`🧪 Adicionada poção: ${GAME_DATA.potions[potionId].name}`);
    }
    
    updateCauldronVisuals() {
        if (!this.DOM.minigame.cauldronLiquid) return;
        
        const numPotions = this.cauldronPotions.length;
        
        if (numPotions === 0) {
            this.DOM.minigame.cauldronLiquid.style.background = 'transparent';
            this.DOM.minigame.cauldronLiquid.style.height = '0%';
        } else if (numPotions === 1) {
            const color = GAME_DATA.potions[this.cauldronPotions[0]].color;
            this.DOM.minigame.cauldronLiquid.style.background = color;
            this.DOM.minigame.cauldronLiquid.style.height = '40%';
        } else {
            const color1 = GAME_DATA.potions[this.cauldronPotions[0]].color;
            const color2 = GAME_DATA.potions[this.cauldronPotions[1]].color;
            this.DOM.minigame.cauldronLiquid.style.background = `linear-gradient(45deg, ${color1}, ${color2})`;
            this.DOM.minigame.cauldronLiquid.style.height = '70%';
        }
    }
    
    updateMinigameButtons() {
        // Atualizar botões de poções
        document.querySelectorAll('#potions-container .potion-bottle').forEach(button => {
            const potionId = button.dataset.potionId;
            const isDisabled = this.cauldronPotions.length >= 2 || this.cauldronPotions.includes(potionId);
            
            button.disabled = isDisabled;
            button.classList.toggle('disabled', isDisabled);
        });
        
        // Atualizar botões de ação
        if (this.DOM.minigame.mixButton) {
            this.DOM.minigame.mixButton.disabled = this.cauldronPotions.length !== 2;
        }
        if (this.DOM.minigame.clearButton) {
            this.DOM.minigame.clearButton.disabled = this.cauldronPotions.length === 0;
        }
    }
    
    mixPotions() {
        if (this.cauldronPotions.length !== 2) return;
        
        this.audioManager.playSfx('mix');
        this.animateMixing();
        
        // Verificar se a receita está correta
        const targetRecipe = GAME_DATA.recipes[this.currentMinigame.targetRecipe];
        const isCorrect = this.checkRecipe(this.cauldronPotions, targetRecipe.ingredients);
        
        // Atualizar estatísticas
        this.gameState.statistics.potionsMixed++;
        
        setTimeout(() => {
            if (isCorrect) {
                this.audioManager.playSfx('success');
                if (this.DOM.minigame.result) {
                    this.DOM.minigame.result.innerHTML = `
                        <div class="bg-green-500/20 border-2 border-green-400 rounded-lg p-6">
                            <div class="text-6xl mb-4">${targetRecipe.emoji}</div>
                            <p class="text-green-400 text-xl magical-font mb-2">Sucesso!</p>
                            <p class="text-white elegant-font">Você criou ${this.currentMinigame.targetRecipe}!</p>
                            <p class="text-slate-300 text-sm mt-2">${targetRecipe.effect}</p>
                        </div>
                    `;
                }
                
                // Resetar contador de falhas após sucesso
                this.failedAttempts = 0;
                
                setTimeout(() => {
                    this.renderDialogueNode('minigame_success');
                    this.showScreen('dialogue');
                }, 2000);
            } else {
                this.audioManager.playSfx('failure');
                this.failedAttempts++;
                
                if (this.DOM.minigame.result) {
                    this.DOM.minigame.result.innerHTML = `
                        <div class="bg-red-500/20 border-2 border-red-400 rounded-lg p-6">
                            <p class="text-red-400 text-xl magical-font mb-2">Oops!</p>
                            <p class="text-white elegant-font">A mistura não deu certo.</p>
                            <p class="text-slate-300 text-sm mt-2">Tente uma combinação diferente.</p>
                        </div>
                    `;
                }
                
                // Mostrar dica após 2 tentativas falhadas
                if (this.failedAttempts >= 2) {
                    this.showHint(targetRecipe.hint);
                }
                
                setTimeout(() => {
                    this.clearCauldron();
                    if (this.DOM.minigame.result) {
                        this.DOM.minigame.result.innerHTML = '';
                    }
                }, 3000);
            }
        }, 1000);
    }
    
    showHint(hintText) {
        if (this.DOM.minigame.hintContainer && hintText) {
            this.DOM.minigame.hintContainer.innerHTML = `
                <div class="bg-yellow-500/20 border-2 border-yellow-400 rounded-lg p-4 mt-4">
                    <div class="flex items-center mb-2">
                        <span class="text-2xl mr-2">💡</span>
                        <span class="text-yellow-400 font-bold">Dica do Sábio</span>
                    </div>
                    <p class="text-white text-sm">${hintText}</p>
                </div>
            `;
        }
    }
    
    clearHints() {
        if (this.DOM.minigame.hintContainer) {
            this.DOM.minigame.hintContainer.innerHTML = '';
        }
    }
    
    checkRecipe(ingredients, targetIngredients) {
        if (ingredients.length !== targetIngredients.length) return false;
        
        const sortedIngredients = [...ingredients].sort();
        const sortedTarget = [...targetIngredients].sort();
        
        return sortedIngredients.every((ingredient, index) => ingredient === sortedTarget[index]);
    }
    
    animateMixing() {
        if (!this.DOM.minigame.bubblesContainer) return;
        
        this.DOM.minigame.bubblesContainer.innerHTML = '';
        
        for (let i = 0; i < 20; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.style.width = `${Math.random() * 15 + 5}px`;
            bubble.style.height = bubble.style.width;
            bubble.style.left = `${Math.random() * 90}%`;
            bubble.style.animationDelay = `${Math.random() * 2}s`;
            bubble.style.animationDuration = `${Math.random() * 2 + 2}s`;
            this.DOM.minigame.bubblesContainer.appendChild(bubble);
        }
        
        // Remover bolhas após animação
        setTimeout(() => {
            if (this.DOM.minigame.bubblesContainer) {
                this.DOM.minigame.bubblesContainer.innerHTML = '';
            }
        }, 4000);
    }
    
    clearCauldron() {
        this.cauldronPotions = [];
        this.updateCauldronVisuals();
        this.updateMinigameButtons();
        this.audioManager.playSfx('click');
    }
    
    // ===== SISTEMA DE INVENTÁRIO =====
    setupInventory() {
        // Inventário já configurado nos event listeners
    }
    
    showInventory() {
        this.renderInventory();
        this.showScreen('inventory');
    }
    
    hideInventory() {
        this.showScreen('world');
    }
    
    renderInventory() {
        if (!this.DOM.inventoryContainer) return;
        
        this.DOM.inventoryContainer.innerHTML = '';
        
        if (this.gameState.inventory.length === 0) {
            this.DOM.inventoryContainer.innerHTML = `
                <div class="col-span-full text-center text-slate-400 py-8">
                    <div class="text-6xl mb-4">📦</div>
                    <p class="elegant-font">Seu inventário está vazio.</p>
                </div>
            `;
            return;
        }
        
        this.gameState.inventory.forEach(itemId => {
            const item = GAME_DATA.items[itemId];
            if (item) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'inventory-item text-center cursor-pointer bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-lg p-4 hover:scale-105 transition-transform';
                itemDiv.innerHTML = `
                    <div class="text-4xl mb-2">${item.emoji}</div>
                    <div class="text-sm font-bold text-gray-800">${item.name}</div>
                `;
                itemDiv.title = item.description;
                itemDiv.onclick = () => this.useItem(itemId);
                
                this.DOM.inventoryContainer.appendChild(itemDiv);
            }
        });
    }
    
    addToInventory(itemId) {
        if (!this.gameState.inventory.includes(itemId)) {
            this.gameState.inventory.push(itemId);
            const item = GAME_DATA.items[itemId];
            this.showTip(`Novo item adquirido: ${item.name}!`);
            this.saveGame();
        }
    }
    
    hasItem(itemId) {
        return this.gameState.inventory.includes(itemId);
    }
    
    useItem(itemId) {
        const item = GAME_DATA.items[itemId];
        if (!item) return;
        
        this.audioManager.playSfx('click');
        
        switch (itemId) {
            case 'cristal_harmonia':
                this.showTip('O cristal brilha suavemente, revelando tensões emocionais próximas...');
                break;
            case 'lente_compreensao':
                this.showTip('Através da lente, você vê além das aparências e compreende motivações ocultas...');
                break;
            case 'diario_empatia':
                this.showTip('Você consulta seu diário, relembrando as histórias e sentimentos das pessoas que conheceu...');
                break;
            case 'semente_esperanca':
                this.showTip('A semente brilha com uma luz suave, lembrando você de que sempre há esperança para crescimento...');
                break;
            default:
                this.showTip(`Você usa ${item.name}. ${item.effect}`);
        }
    }
    
    // ===== SISTEMA DE QUESTS =====
    completeQuest(questId) {
        const quest = GAME_DATA.quests[questId];
        if (!quest) return;
        
        // Marcar quest como completa
        if (!this.gameState.completedQuests.includes(questId)) {
            this.gameState.completedQuests.push(questId);
        }
        
        // Remover das quests ativas
        this.gameState.activeQuests = this.gameState.activeQuests.filter(id => id !== questId);
        
        // Aplicar recompensas
        if (quest.rewards) {
            // Experiência
            if (quest.rewards.experience) {
                this.gainExperience(quest.rewards.experience);
            }
            
            // Itens
            if (quest.rewards.items) {
                quest.rewards.items.forEach(itemId => {
                    this.addToInventory(itemId);
                });
            }
            
            // Novos locais
            if (quest.rewards.newLocation) {
                this.unlockLocation(quest.rewards.newLocation);
            }
            
            // Conquistas
            if (quest.rewards.achievement) {
                this.unlockAchievement(quest.rewards.achievement);
            }

            // >>> NOVO BLOCO PARA DESBLOQUEIOS ESPECIAIS <<<
    if (quest.dialogueTree.quest_complete.unlocks === "world_map") {
        this.gameState.unlockedFeatures = this.gameState.unlockedFeatures || [];
        if (!this.gameState.unlockedFeatures.includes("world_map")) {
            this.gameState.unlockedFeatures.push("world_map");
            document.getElementById('world-map-button').classList.remove('hidden');
            this.showTip("🏆 Novo Recurso Desbloqueado: Mapa-Múndi!");
        }
        }
        }
        
        // Atualizar estatísticas
        this.gameState.statistics.questsCompleted++;
        this.gameState.statistics.charactersHelped++;
        
        // Verificar conquistas
        this.checkAchievements();
        
        this.audioManager.playSfx('success');
        this.saveGame();
        
        console.log(`✅ Quest completada: ${quest.title}`);
    }
    
    // ===== SISTEMA DE PROGRESSÃO (VERSÃO CORRIGIDA) =====
    gainExperience(amount) {
        if (!amount) return;

        this.gameState.player.experience += amount;
        this.showTip(`+${amount} XP ganho!`);

        // Usar um loop 'while' para permitir múltiplos leveis de uma vez
        let currentLevelData = GAME_DATA.progression.levels[this.gameState.player.level];
        
        while (currentLevelData && this.gameState.player.experience >= currentLevelData.maxExperience) {
            // Deduz o XP necessário para o level up
            this.gameState.player.experience -= currentLevelData.maxExperience;
            
            // Sobe de nível
            this.levelUp();

            // Atualiza os dados para a próxima verificação do loop
            currentLevelData = GAME_DATA.progression.levels[this.gameState.player.level];
        }
        
        this.saveGame(); // Salva o estado após todas as atualizações
    }

    levelUp() {
        this.gameState.player.level++;
        const newLevelData = GAME_DATA.progression.levels[this.gameState.player.level];
        
        if (newLevelData) {
            // A propriedade maxExperience agora é lida do novo nível para a próxima verificação
            this.audioManager.playSfx('success');
            this.showTip(`🎉 Level Up! Você agora é Nível ${this.gameState.player.level}: ${newLevelData.name}!`);
        } else {
            // Chegou ao nível máximo
            console.log("Nível máximo alcançado!");
            // Zera a experiência para não acumular infinitamente
            this.gameState.player.experience = 0;
        }
        this.updateHud();
        // Atualiza o HUD para mostrar o novo nível (se você tiver um campo para isso)
        // Ex: document.getElementById('hud-level').textContent = `Nível ${this.gameState.player.level}`;
    }

    
    unlockLocation(locationId) {
        if (!this.gameState.unlockedScenarios.includes(locationId)) {
            this.gameState.unlockedScenarios.push(locationId);
            const location = GAME_DATA.scenarios[locationId];
            this.showTip(`🗺️ Novo local desbloqueado: ${location.name}!`);
        }
    }
    
    unlockAchievement(achievementId) {
        if (!this.gameState.achievements[achievementId]) {
            this.gameState.achievements[achievementId] = true;
            const achievement = GAME_DATA.achievements[achievementId];
            this.showTip(`🏆 Conquista desbloqueada: ${achievement.name}!`);
        }
    }
    
    checkAchievements() {
        // Primeiro Emissário
        if (this.gameState.statistics.questsCompleted >= 1) {
            this.unlockAchievement('primeiro_emissario');
        }
        
        // Alquimista Emocional
        if (this.gameState.statistics.potionsMixed >= 5) {
            this.unlockAchievement('alquimista_emocional');
        }
        
        // Mediador Mestre
        if (this.gameState.statistics.conflictsResolved >= 3) {
            this.unlockAchievement('mediador_mestre');
        }
        
        // Explorador de Elara
        if (this.gameState.visitedScenes.length >= Object.keys(GAME_DATA.scenarios).length) {
            this.unlockAchievement('explorador_elara');
        }
        
        // Sábio Empático
        if (this.gameState.completedQuests.length >= Object.keys(GAME_DATA.quests).length) {
            this.unlockAchievement('sabio_empatico');
        }
    }
    
    // ===== SISTEMA DE DICAS =====
    showTip(message) {
        // Criar elemento de dica
        const tipDiv = document.createElement('div');
        tipDiv.className = 'fixed top-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm elegant-font';
        tipDiv.style.animation = 'slideInRight 0.5s ease-out';
        tipDiv.textContent = message;
        
        document.body.appendChild(tipDiv);
        
        // Remover após 4 segundos
        setTimeout(() => {
            tipDiv.style.animation = 'slideOutRight 0.5s ease-in';
            setTimeout(() => {
                if (document.body.contains(tipDiv)) {
                    document.body.removeChild(tipDiv);
                }
            }, 500);
        }, 4000);
    }
    
    // ===== UTILITÁRIOS =====
    getRandomTip() {
        const tips = GAME_DATA.narrative.tips;
        return tips[Math.floor(Math.random() * tips.length)];
    }
}

// ===== SISTEMA DE COMBATE EMOCIONAL =====
class EmotionalCombatSystem {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.isActive = false;
        this.currentOpponent = null;
        this.playerStates = null;
        this.opponentStates = null;
        this.actionCount = 0;
        this.aggressiveActionCount = 0;
        this.hintCount = 0;
        this.currentQuestId = null; // << ADICIONAR: Para saber qual quest de combate está ativa
        this.currentNodeId = null;  // << ADICIONAR: Para rastrear o diálogo
    }

    // ADICIONAR ESTES MÉTODOS NA CLASSE EmotionalCombatSystem:

showDialogue(dialogueNode) {
    const dialogueContainer = document.getElementById('emotional-dialogue');
    const actionsContainer = document.getElementById('emotional-actions');
    
    if (!dialogueNode) {
        console.error("Nó de diálogo inválido. Encerrando combate.");
        this.endEmotionalCombat('failure');
        return;
    }

    dialogueContainer.innerHTML = `<p class="dialogue-text">${dialogueNode.text}</p>`;
    
    if (dialogueNode.isEnd) {
        // Limpa os botões de opção antes de encerrar.
        actionsContainer.innerHTML = ''; 
        this.endEmotionalCombat(dialogueNode.outcome);
        return;
    }

    const optionsHTML = dialogueNode.options.map((option, index) => {
        const action = GAME_DATA.emotionalActions[option.action];
        const actionInfo = action ? `<span class="action-info">${action.emoji} ${action.name}</span>` : '';
        return `
            <button class="dialogue-option" onclick="gameEngine.emotionalCombat.selectOption(${index})">
                ${option.text}
                ${actionInfo}
            </button>
        `;
    }).join('');
    
    actionsContainer.innerHTML = optionsHTML;
}

updateEmotionalBars() {
    ['calma', 'empatia', 'assertividade', 'resiliencia'].forEach(emotion => {
        const playerBar = document.querySelector(`.player-states .${emotion}`);
        const opponentBar = document.querySelector(`.opponent-states .${emotion}`);
        
        if (playerBar) {
            playerBar.style.width = `${this.playerStates[emotion]}%`;
            playerBar.parentElement.nextElementSibling.textContent = `${this.playerStates[emotion]}/100`;
        }
        
        if (opponentBar) {
            opponentBar.style.width = `${this.opponentStates[emotion]}%`;
            opponentBar.parentElement.nextElementSibling.textContent = `${this.opponentStates[emotion]}/100`;
        }
    });
}

showActionFeedback(message) {
    const feedbackContainer = document.getElementById('emotional-feedback');
    feedbackContainer.innerHTML = `<p class="action-feedback">${message}</p>`;
    
    setTimeout(() => {
        feedbackContainer.innerHTML = '';
    }, 3000);
}

checkLoseConditions() {
    const quest = GAME_DATA.quests.conflito_cristalino;
    const conditions = quest.emotionalCombat.loseConditions;
    
    return this.playerStates.calma <= conditions.selfCalma ||
           this.opponentStates.assertividade >= conditions.opponentAssertividade ||
           this.aggressiveActionCount >= conditions.aggressiveActions;
}

getCurrentDialogueNode() {
    // Implementar lógica para rastrear nó atual do diálogo
    return GAME_DATA.quests.conflito_cristalino.dialogueTree.start;
}

    startEmotionalCombat(questId, opponentId) {
        const quest = GAME_DATA.quests[questId];
         if (!quest || quest.type !== 'emotional_combat' || !GAME_DATA.emotionalStates || !GAME_DATA.emotionalActions) {
            console.error("❌ Combate não pode iniciar. Verifique se a quest, emotionalStates e emotionalActions estão definidos em GAME_DATA.");
            return false;
         }

        this.isActive = true;
        this.currentOpponent = opponentId;
        this.playerStates = { ...GAME_DATA.emotionalStates.akari };
        this.opponentStates = { ...GAME_DATA.emotionalStates[opponentId] };
        this.actionCount = 0;
        this.aggressiveActionCount = 0;
        this.hintCount = 0;
        this.currentQuestId = questId; // << ADICIONAR
        this.currentNodeId = 'start';  // << ADICIONAR
        this.emotionalCombat = new EmotionalCombatSystem(this);


        this.renderEmotionalCombatUI();
        this.showDialogue(quest.dialogueTree.start);
        return true;
    }

    renderEmotionalCombatUI() {
        this.gameEngine.showScreen('dialogue'); // Garante que a tela de diálogo está visível!
        const combatHTML = `
            <div id="emotional-combat-container" class="emotional-combat">
                <div class="emotional-states">
                    <div class="player-states">
                        <h3>🧙 Akari</h3>
                        <div class="emotion-bar">
                            <span>🧘 Calma:</span>
                            <div class="bar"><div class="fill calma" style="width: ${this.playerStates.calma}%"></div></div>
                            <span>${this.playerStates.calma}/100</span>
                        </div>
                        <div class="emotion-bar">
                            <span>💙 Empatia:</span>
                            <div class="bar"><div class="fill empatia" style="width: ${this.playerStates.empatia}%"></div></div>
                            <span>${this.playerStates.empatia}/100</span>
                        </div>
                        <div class="emotion-bar">
                            <span>⚡ Assertividade:</span>
                            <div class="bar"><div class="fill assertividade" style="width: ${this.playerStates.assertividade}%"></div></div>
                            <span>${this.playerStates.assertividade}/100</span>
                        </div>
                        <div class="emotion-bar">
                            <span>🛡️ Resiliência:</span>
                            <div class="bar"><div class="fill resiliencia" style="width: ${this.playerStates.resiliencia}%"></div></div>
                            <span>${this.playerStates.resiliencia}/100</span>
                        </div>
                    </div>
                    <div class="opponent-states">
                        <h3>💎 ${GAME_DATA.characters[this.currentOpponent].name}</h3>
                        <div class="emotion-bar">
                            <span>🧘 Calma:</span>
                            <div class="bar"><div class="fill calma" style="width: ${this.opponentStates.calma}%"></div></div>
                            <span>${this.opponentStates.calma}/100</span>
                        </div>
                        <div class="emotion-bar">
                            <span>💙 Empatia:</span>
                            <div class="bar"><div class="fill empatia" style="width: ${this.opponentStates.empatia}%"></div></div>
                            <span>${this.opponentStates.empatia}/100</span>
                        </div>
                        <div class="emotion-bar">
                            <span>⚡ Assertividade:</span>
                            <div class="bar"><div class="fill assertividade" style="width: ${this.opponentStates.assertividade}%"></div></div>
                            <span>${this.opponentStates.assertividade}/100</span>
                        </div>
                        <div class="emotion-bar">
                            <span>🛡️ Resiliência:</span>
                            <div class="bar"><div class="fill resiliencia" style="width: ${this.opponentStates.resiliencia}%"></div></div>
                            <span>${this.opponentStates.resiliencia}/100</span>
                        </div>
                    </div>
                </div>
                <div id="emotional-dialogue" class="dialogue-container"></div>
                <div id="emotional-actions" class="actions-container"></div>
                <div id="emotional-feedback" class="feedback-container"></div>
            </div>
        `;

        // O elemento correto para modificar é o 'viewport' da tela de diálogo, não a tela inteira.
    const dialogueScreenContent = document.getElementById('dialogue-screen').querySelector('.dialogue-viewport');
    if (dialogueScreenContent) {
        dialogueScreenContent.innerHTML = combatHTML;
    } else {
        // Fallback caso a estrutura seja diferente
        this.gameEngine.DOM.screens.dialogue.innerHTML = combatHTML;
    }
}

    selectOption(optionIndex) {
        const currentQuest = GAME_DATA.quests.conflito_cristalino;
        const currentNode = currentQuest.dialogueTree[this.currentNodeId];
        const selectedOption = currentNode.options[optionIndex];
        
        this.actionCount++;
        
        if (selectedOption.action) { // << CORRIGIDO: Verifica se a ação existe
            this.applyEmotionalAction(selectedOption.action);
        }
        
        // Aplicar efeitos da ação
        if (selectedOption.action !== 'attack') {
            this.applyEmotionalAction(selectedOption.action);
        }
        
        // Verificar condições de vitória/derrota
        if (this.checkWinConditions()) {
            this.endEmotionalCombat('success');
            return;
        }
        
        if (this.checkLoseConditions()) {
            this.endEmotionalCombat('failure');
            return;
        }
        
        // Mostrar dicas após duas tentativas falhadas
        if (this.actionCount >= 2 && this.hintCount === 0) {
            this.showHint();
            this.hintCount++;
        }
        
        const nextNodeId = selectedOption.next;
        if (nextNodeId && currentQuest.dialogueTree[nextNodeId]) {
            this.currentNodeId = nextNodeId; // << ATUALIZA O RASTREADOR
            const nextNode = currentQuest.dialogueTree[nextNodeId];
            this.showDialogue(nextNode); // << CORRIGIDO: Chama o método correto
        } else {
            console.log("Fim do ramo de diálogo do combate.");
            // Potencialmente encerrar o combate se não houver próximo nó
        }
    }

    applyEmotionalAction(actionId) {
        const action = GAME_DATA.emotionalActions[actionId];
        if (!action) return;
        
        // Aplicar efeitos no jogador
        Object.keys(action.effects.self).forEach(emotion => {
            this.playerStates[emotion] = Math.max(0, Math.min(100, 
                this.playerStates[emotion] + action.effects.self[emotion]
            ));
        });
        
        // Aplicar efeitos no oponente
        Object.keys(action.effects.opponent).forEach(emotion => {
            this.opponentStates[emotion] = Math.max(0, Math.min(100, 
                this.opponentStates[emotion] + action.effects.opponent[emotion]
            ));
        });
        
        // Atualizar UI
        this.updateEmotionalBars();
        
        // Mostrar feedback da ação
        this.showActionFeedback(action.message);
    }

    showHint() {
        const hintMessage = "💡 Dica: Tente usar ações que demonstrem empatia e compreensão. Evite respostas agressivas que podem escalar o conflito.";
        this.showActionFeedback(hintMessage);
    }

    checkWinConditions() {
        const quest = GAME_DATA.quests.conflito_cristalino;
        const conditions = quest.emotionalCombat.winConditions;
        
        return this.playerStates.calma >= conditions.selfCalma &&
               this.opponentStates.empatia >= conditions.opponentEmpatia;
    }

    // ===== DENTRO DA CLASSE EmotionalCombatSystem =====

endEmotionalCombat(outcome) {
    this.isActive = false;
    
    // 1. Processar o resultado da missão (sucesso ou falha)
    if (outcome === 'success') {
        // Mostra a notificação de sucesso
        this.showActionFeedback("🎉 Conflito resolvido com sucesso! Você demonstrou excelente inteligência emocional.");
        
        // Completa a missão e aplica as recompensas (positivas)
        // Usamos a questId que salvamos no início do combate
        this.gameEngine.completeQuest(this.currentQuestId); 
        
    } else { // 'failure'
        // Mostra a notificação de falha
        this.showActionFeedback("😔 O conflito não foi resolvido. Tente uma abordagem mais empática na próxima vez.");
        
        // Aqui você pode aplicar penalidades se quiser, como perder reputação.
        // Exemplo: this.gameEngine.updateReputation('equilibristas', -10);
        // Por enquanto, apenas falhar é suficiente.
    }
    
    // 2. Agendar o retorno ao mundo do jogo após um breve atraso para o jogador ler o feedback.
    setTimeout(() => {
        // Limpa qualquer resquício da UI de combate da tela de diálogo.
        // Isso evita que a UI antiga reapareça se o jogador entrar em outro diálogo.
        const dialogueScreenContent = document.getElementById('dialogue-screen').querySelector('.dialogue-viewport');
        if (dialogueScreenContent) {
            dialogueScreenContent.innerHTML = ''; // Limpa o conteúdo
        }

        // CRUCIAL: Renderiza a cena do mundo ATUALIZADA.
        // Isso vai mostrar o checkmark de "missão completa" no NPC, se for o caso.
        this.gameEngine.renderScene(this.gameEngine.gameState.currentScene);
        
        // FINALMENTE: Mostra a tela do mundo, escondendo a tela de diálogo.
        this.gameEngine.showScreen('world');

    }, 3500); // Aumentei um pouco o tempo para 3.5 segundos para dar tempo de ler a mensagem final.
}

}
// Adicionar método para iniciar combate emocional
// (Adicione este método dentro da classe EmissariesGameEngine)
// Adicionar método ao protótipo da classe EmissariesGameEngine
EmissariesGameEngine.prototype.startEmotionalCombat = function(questId, opponentId) {
    return this.emotionalCombat.startEmotionalCombat(questId, opponentId);
};

// Função para verificar e exibir o botão do mapa-múndi
function checkAndShowMapButton() {
    // Verificar se o progresso do jogador permite exibir o botão
    const act1Completed = localStorage.getItem('act1Completed') === 'true';

    // Se o progresso permitir, exibir o botão
    if (act1Completed) {
        showMapButton();
    }
}

// Função para exibir o botão do mapa-múndi (sempre visível)
function showMapButton() {
    const mapButton = document.getElementById('world-map-button');
    if (mapButton) {
        mapButton.classList.remove('hidden');
        mapButton.style.display = 'block';
    }
}

// Função para verificar se o jogador pode acessar a expansão
function canAccessExpansion() {
    const act1Completed = localStorage.getItem('act1Completed') === 'true';
    if (!act1Completed) {
        alert('⚠️ Você precisa concluir o Ato 1 para acessar a expansão!');
        return false;
    }
    return true;
}

// Adicionar evento ao botão do mapa-múndi para verificar acesso à expansão
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Carregando Crônicas dos Emissários...');
    
    // Inicializar o motor do jogo
    window.gameEngine = new EmissariesGameEngine();

    // Garantir que o botão do mapa-múndi esteja sempre visível
    showMapButton();

    // Adicionar lógica ao botão para verificar acesso à expansão
    const mapButton = document.getElementById('world-map-button');
    if (mapButton) {
        mapButton.addEventListener('click', () => {
            if (!canAccessExpansion()) {
                // Impedir acesso à expansão se o Ato 1 não foi concluído
                return;
            }
            console.log('🌍 Acessando o mapa-múndi...');
        });
    }   

    console.log('✅ Jogo carregado com sucesso!');
});

// ===== ESTILOS CSS ADICIONAIS PARA ANIMAÇÕES =====
const additionalStyles = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .game-screen {
        transition: background 1s ease-in-out;
    }
    
    .inventory-item:hover {
        transform: scale(1.05) rotate(2deg);
    }
    
    .potion-bottle:active {
        transform: scale(0.95);
    }
    
    .dialogue-option:hover {
        transform: translateX(10px);
    }
    
    .bubble {
        position: absolute;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 100%);
        border-radius: 50%;
        animation: rise 4s infinite ease-in;
        opacity: 0;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
    
    @keyframes rise {
        0% { 
            transform: translateY(0) scale(0.5); 
            opacity: 1; 
        }
        50% { 
            opacity: 0.8; 
            transform: translateY(-75px) scale(0.8);
        }
        100% { 
            transform: translateY(-150px) scale(1.2); 
            opacity: 0; 
        }
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .disabled {
        filter: grayscale(80%) brightness(0.6);
        transform: scale(0.9);
        cursor: not-allowed !important;
    }
    
    #dialogue-back-button {
        background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 1rem;
    }
    
    #dialogue-back-button:hover {
        background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    #hint-container {
        margin-top: 1rem;
    }
`;

// ===== SISTEMA DE REPUTAÇÃO =====
class ReputationSystem {
    constructor() {
        this.reputation = GAME_DATA.reputation;
    }

    // Modifica reputação baseada em ação
    modifyReputation(action, scenario = null, faction = null) {
        const modifier = this.reputation.modifiers[action] || 0;
        
        if (scenario && this.reputation.scenarios[scenario] !== undefined) {
            this.reputation.scenarios[scenario] = Math.max(0, Math.min(100, 
                this.reputation.scenarios[scenario] + modifier));
            
            // Propaga influência para cenários conectados
            this.propagateInfluence(scenario, modifier * 0.3);
        }
        
        if (faction && this.reputation.factions[faction] !== undefined) {
            this.reputation.factions[faction] = Math.max(-100, Math.min(100, 
                this.reputation.factions[faction] + modifier));
        }
        
        // Atualiza interface
        this.updateReputationDisplay();
        
        // Verifica desbloqueios
        this.checkUnlocks();
        
        console.log(`Reputação modificada: ${action} (${modifier > 0 ? '+' : ''}${modifier})`);
    }

    // Propaga influência entre cenários conectados
    propagateInfluence(sourceScenario, influence) {
        const scenario = GAME_DATA.scenarios[sourceScenario];
        if (!scenario || !scenario.connections) return;
        
        scenario.connections.forEach(connectedScenario => {
            if (this.reputation.scenarios[connectedScenario] !== undefined) {
                this.reputation.scenarios[connectedScenario] = Math.max(0, Math.min(100,
                    this.reputation.scenarios[connectedScenario] + influence));
            }
        });
    }

    // Obtém nível de reputação em texto
    getReputationLevel(value) {
        if (value >= 80) return { level: 'Herói', color: '#10B981' };
        if (value >= 60) return { level: 'Respeitado', color: '#3B82F6' };
        if (value >= 40) return { level: 'Neutro', color: '#6B7280' };
        if (value >= 20) return { level: 'Desconfiado', color: '#F59E0B' };
        return { level: 'Hostil', color: '#EF4444' };
    }

    // Verifica se o jogador pode acessar conteúdo baseado em reputação
    canAccess(requirements) {
        if (!requirements) return true;
        
        // Verifica reputação de cenário
        if (requirements.scenario) {
            for (const [scenario, minRep] of Object.entries(requirements.scenario)) {
                if (this.reputation.scenarios[scenario] < minRep) return false;
            }
        }
        
        // Verifica reputação de facção
        if (requirements.faction) {
            for (const [faction, minRep] of Object.entries(requirements.faction)) {
                if (this.reputation.factions[faction] < minRep) return false;
            }
        }
        
        return true;
    }

    // Atualiza display de reputação na interface
    updateReputationDisplay() {
        const reputationPanel = document.getElementById('reputation-panel');
        if (!reputationPanel) return;
        
        let html = '<h3>🏆 Reputação</h3>';
        
        // Reputação por cenário
        html += '<div class="reputation-section"><h4>Comunidades</h4>';
        for (const [scenario, value] of Object.entries(this.reputation.scenarios)) {
            const level = this.getReputationLevel(value);
            const scenarioData = GAME_DATA.scenarios[scenario];
            if (scenarioData) {
                html += `
                    <div class="reputation-item">
                        <span>${scenarioData.emoji} ${scenarioData.name}</span>
                        <span style="color: ${level.color}">${level.level} (${value})</span>
                    </div>
                `;
            }
        }
        html += '</div>';
        
        // Reputação por facção
        html += '<div class="reputation-section"><h4>Facções</h4>';
        for (const [faction, value] of Object.entries(this.reputation.factions)) {
            const level = this.getReputationLevel(Math.abs(value));
            const factionData = GAME_DATA.factions[faction];
            if (factionData) {
                html += `
                    <div class="reputation-item">
                        <span>⚔️ ${factionData.name}</span>
                        <span style="color: ${level.color}">${level.level} (${value})</span>
                    </div>
                `;
            }
        }
        html += '</div>';
        
        reputationPanel.innerHTML = html;
    }

    // Verifica desbloqueios baseados em reputação
    checkUnlocks() {
        // Verifica ranks de facção
        for (const [factionId, factionData] of Object.entries(GAME_DATA.factions)) {
            const currentRep = this.reputation.factions[factionId];
            const currentRank = this.getFactionRank(factionId);
            
            factionData.ranks.forEach(rank => {
                if (currentRep >= rank.minReputation && !gameState.unlockedRanks.includes(`${factionId}_${rank.name}`)) {
                    this.unlockFactionRank(factionId, rank);
                }
            });
        }
    }

    // Obtém rank atual em uma facção
    getFactionRank(factionId) {
        const reputation = this.reputation.factions[factionId];
        const faction = GAME_DATA.factions[factionId];
        if (!faction) return null;
        
        let currentRank = null;
        faction.ranks.forEach(rank => {
            if (reputation >= rank.minReputation) {
                currentRank = rank;
            }
        });
        
        return currentRank;
    }

    // Desbloqueia novo rank de facção
    unlockFactionRank(factionId, rank) {
        const rankId = `${factionId}_${rank.name}`;
        if (gameState.unlockedRanks.includes(rankId)) return;
        
        gameState.unlockedRanks.push(rankId);
        
        // Aplica benefícios do rank
        rank.benefits.forEach(benefit => {
            this.applyRankBenefit(benefit);
        });
        
        // Mostra notificação
        showNotification(`🎉 Novo Rank Desbloqueado: ${rank.name} nos ${GAME_DATA.factions[factionId].name}!`);
    }

    // Aplica benefício de rank
    applyRankBenefit(benefit) {
        switch (benefit) {
            case 'acesso_biblioteca_basica':
                gameState.unlockedFeatures.push('biblioteca_basica');
                break;
            case 'receitas_avancadas':
                gameState.unlockedFeatures.push('receitas_avancadas');
                break;
            case 'meditacao_guiada':
                gameState.unlockedFeatures.push('meditacao_guiada');
                break;
            case 'visao_emocional':
                gameState.unlockedFeatures.push('visao_emocional');
                break;
            case 'influencia_comunitaria':
                gameState.unlockedFeatures.push('influencia_comunitaria');
                break;
            case 'harmonia_perfeita':
                gameState.unlockedFeatures.push('harmonia_perfeita');
                break;
            case 'lideranca_facção':
                gameState.unlockedFeatures.push('lideranca_facção');
                break;
        }
    }
}

// ===== SISTEMA DE INFLUÊNCIA ENTRE CENÁRIOS =====
class InfluenceSystem {
    constructor() {
        this.influences = new Map();
    }

    // Registra uma influência entre cenários
    addInfluence(sourceScenario, targetScenario, type, strength) {
        const key = `${sourceScenario}_${targetScenario}`;
        this.influences.set(key, { type, strength, timestamp: Date.now() });
    }

    // Calcula efeitos de influência
    calculateInfluenceEffects(scenario) {
        let effects = {
            economicBoost: 0,
            socialHarmony: 0,
            culturalExchange: 0,
            conflictSpillover: 0
        };

        for (const [key, influence] of this.influences.entries()) {
            const [source, target] = key.split('_');
            if (target === scenario) {
                switch (influence.type) {
                    case 'positive_resolution':
                        effects.economicBoost += influence.strength * 0.1;
                        effects.socialHarmony += influence.strength * 0.15;
                        break;
                    case 'cultural_exchange':
                        effects.culturalExchange += influence.strength * 0.2;
                        break;
                    case 'conflict_spillover':
                        effects.conflictSpillover += influence.strength * 0.1;
                        effects.socialHarmony -= influence.strength * 0.1;
                        break;
                }
            }
        }

        return effects;
    }
}

// ===== SISTEMA DE DIÁLOGOS AVANÇADOS =====
class AdvancedDialogueSystem {
    constructor() {
        this.dialogueHistory = new Map();
        this.emotionalStates = new Map();
    }

    // Processa diálogo com base na reputação e estado emocional
    processDialogue(npcId, dialogueOption, context = {}) {
        const npc = GAME_DATA.characters[npcId];
        if (!npc) return null;

        // Verifica reputação com o NPC
        const reputation = reputationSystem.reputation.scenarios[context.scenario] || 50;
        const factionRep = context.faction ? reputationSystem.reputation.factions[context.faction] : 0;

        // Calcula modificadores de diálogo
        let dialogueModifiers = {
            trust: this.calculateTrust(npcId, reputation, factionRep),
            empathy: this.calculateEmpathy(context),
            wisdom: this.calculateWisdom(context)
        };

        // Gera resposta baseada nos modificadores
        return this.generateResponse(npc, dialogueOption, dialogueModifiers, context);
    }

    // Calcula nível de confiança do NPC
    calculateTrust(npcId, reputation, factionRep) {
        let trust = reputation / 100; // Base na reputação do cenário
        
        // Ajusta baseado na reputação de facção se relevante
        if (factionRep !== 0) {
            trust += (factionRep / 100) * 0.3;
        }

        // Considera histórico de interações
        const history = this.dialogueHistory.get(npcId) || [];
        const positiveInteractions = history.filter(h => h.outcome === 'positive').length;
        const negativeInteractions = history.filter(h => h.outcome === 'negative').length;
        
        trust += (positiveInteractions - negativeInteractions) * 0.1;

        return Math.max(0, Math.min(1, trust));
    }

    // Calcula nível de empatia demonstrada
    calculateEmpathy(context) {
        let empathy = 0.5; // Base neutra

        // Verifica se o jogador tem itens que aumentam empatia
        if (gameState.inventory.includes('cristal_empatia')) {
            empathy += 0.3;
        }

        // Verifica habilidades desbloqueadas
        if (gameState.unlockedFeatures.includes('visao_emocional')) {
            empathy += 0.2;
        }

        return Math.max(0, Math.min(1, empathy));
    }

    // Calcula nível de sabedoria demonstrada
    calculateWisdom(context) {
        let wisdom = 0.3; // Base baixa

        // Verifica se o jogador tem itens de sabedoria
        if (gameState.inventory.includes('pergaminho_mediacao')) {
            wisdom += 0.4;
        }

        // Verifica quests completadas que demonstram sabedoria
        const wisdomQuests = ['conhecimento_supremo', 'teste_sabedoria', 'harmonia_perdida'];
        const completedWisdomQuests = wisdomQuests.filter(q => gameState.completedQuests.includes(q));
        wisdom += completedWisdomQuests.length * 0.1;

        return Math.max(0, Math.min(1, wisdom));
    }

    // Gera resposta do NPC baseada nos modificadores
    generateResponse(npc, dialogueOption, modifiers, context) {
        // Registra interação no histórico
        const history = this.dialogueHistory.get(npc.name) || [];
        history.push({
            option: dialogueOption,
            modifiers: modifiers,
            timestamp: Date.now(),
            outcome: this.determineOutcome(modifiers)
        });
        this.dialogueHistory.set(npc.name, history);

        // Retorna dados para o sistema de diálogo processar
        return {
            npc: npc,
            modifiers: modifiers,
            availableOptions: this.getAvailableOptions(npc, modifiers, context),
            emotionalState: this.getEmotionalState(npc.name)
        };
    }

    // Determina resultado da interação
    determineOutcome(modifiers) {
        const average = (modifiers.trust + modifiers.empathy + modifiers.wisdom) / 3;
        if (average >= 0.7) return 'positive';
        if (average >= 0.4) return 'neutral';
        return 'negative';
    }

    // Obtém opções de diálogo disponíveis baseadas nos modificadores
    getAvailableOptions(npc, modifiers, context) {
        let options = ['standard_greeting'];

        // Opções baseadas em confiança
        if (modifiers.trust >= 0.6) {
            options.push('personal_question', 'offer_help');
        }

        // Opções baseadas em empatia
        if (modifiers.empathy >= 0.7) {
            options.push('emotional_support', 'deep_understanding');
        }

        // Opções baseadas em sabedoria
        if (modifiers.wisdom >= 0.6) {
            options.push('wise_counsel', 'philosophical_discussion');
        }

        // Opções especiais de facção
        if (context.faction && reputationSystem.reputation.factions[context.faction] >= 25) {
            options.push('faction_business', 'faction_knowledge');
        }

        return options;
    }

    // Obtém estado emocional atual do NPC
    getEmotionalState(npcId) {
        return this.emotionalStates.get(npcId) || 'neutral';
    }

    // Define estado emocional do NPC
    setEmotionalState(npcId, state) {
        this.emotionalStates.set(npcId, state);
    }
}

// ===== INICIALIZAÇÃO DOS NOVOS SISTEMAS =====
// Adicionar no final do arquivo, antes do export:

// Instancia os novos sistemas
let reputationSystem;
let influenceSystem;
let advancedDialogueSystem;

// Função para inicializar os novos sistemas
function initializeAct2Systems() {
    reputationSystem = new ReputationSystem();
    influenceSystem = new InfluenceSystem();
    advancedDialogueSystem = new AdvancedDialogueSystem();
    
    // Adiciona campos necessários ao gameState se não existirem
    if (!gameState.unlockedRanks) {
        gameState.unlockedRanks = [];
    }
    if (!gameState.unlockedFeatures) {
        gameState.unlockedFeatures = [];
    }
    
    console.log('Sistemas do Ato 2 inicializados com sucesso!');
}

// Função para salvar dados dos novos sistemas
function saveAct2Data() {
    const act2Data = {
        reputation: reputationSystem.reputation,
        influences: Array.from(influenceSystem.influences.entries()),
        dialogueHistory: Array.from(advancedDialogueSystem.dialogueHistory.entries()),
        emotionalStates: Array.from(advancedDialogueSystem.emotionalStates.entries()),
        unlockedRanks: gameState.unlockedRanks,
        unlockedFeatures: gameState.unlockedFeatures
    };
    
    localStorage.setItem('act2_data', JSON.stringify(act2Data));
}

// Função para carregar dados dos novos sistemas
function loadAct2Data() {
    const savedData = localStorage.getItem('act2_data');
    if (!savedData) return;
    
    try {
        const act2Data = JSON.parse(savedData);
        
        if (act2Data.reputation) {
            reputationSystem.reputation = act2Data.reputation;
        }
        
        if (act2Data.influences) {
            influenceSystem.influences = new Map(act2Data.influences);
        }
        
        if (act2Data.dialogueHistory) {
            advancedDialogueSystem.dialogueHistory = new Map(act2Data.dialogueHistory);
        }
        
        if (act2Data.emotionalStates) {
            advancedDialogueSystem.emotionalStates = new Map(act2Data.emotionalStates);
        }
        
        if (act2Data.unlockedRanks) {
            gameState.unlockedRanks = act2Data.unlockedRanks;
        }
        
        if (act2Data.unlockedFeatures) {
            gameState.unlockedFeatures = act2Data.unlockedFeatures;
        }
        
        console.log('Dados do Ato 2 carregados com sucesso!');
    } catch (error) {
        console.error('Erro ao carregar dados do Ato 2:', error);
    }
}


// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

