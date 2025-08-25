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

        // >>> NOVA LINHA: Inicia a música tema do menu <<<
        this.audioManager.playMusic('menu_theme');
        
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
        
        this.showScreen('characterCreation');
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
                if (character) {
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
            } else {
                if (node.reward) {
                    this.completeQuest(this.currentDialogue.questId);
                } else {
                    const button = document.createElement('button');
                    button.textContent = 'Continuar';
                    button.className = 'dialogue-option text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700';
                    button.onclick = () => {
                        this.audioManager.playSfx('click');
                        this.showScreen('world');
                    };
                    this.DOM.dialogue.options.appendChild(button);
                }
            }
        }
    }


    
    handleDialogueChoice(option) {
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

// ===== INICIALIZAÇÃO GLOBAL =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Carregando Crônicas dos Emissários...');
    
    // Verificar se os dados do jogo estão carregados
    if (typeof GAME_DATA === 'undefined') {
        console.error('❌ Dados do jogo não carregados! Verifique se game-data.js está incluído.');
        return;
    }
    
    // Inicializar o motor do jogo
    window.gameEngine = new EmissariesGameEngine();
    
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

// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

