/**
 * NEXUS VAULT — Abas 3 e 4:
 *   • Aba 3: Protocolo Pessoal de Desfusão e Tomada de Decisão (Rigor Comportamental)
 *   • Aba 4: Gerador Estruturado de Cenas Terapêuticas e Contos Noturnos (+ Amber Reader & Gemini Local)
 *
 * REGRA DE SIGILO ESTRITO: Zero nomes próprios fixos no código-fonte. Rótulos familiares residem
 * exclusivamente no LocalStorage local do navegador do usuário (`dm_vault_profile`).
 */
(function (global) {
    'use strict';

    // =========================================================================
    // ABA 3 — PROTOCOLO DE DESFUSÃO COGNITIVA E TOMADA DE DECISÃO ESTRATÉGICA
    // =========================================================================
    let desfusaoHistory = [];

    function loadDesfusaoHistory() {
        const C = global.VaultCore;
        const arr = C.store.get(C.STORAGE_KEYS.DESFUSAO, []);
        desfusaoHistory = Array.isArray(arr) ? arr : [];
    }

    function saveDesfusaoHistory() {
        const C = global.VaultCore;
        C.store.set(C.STORAGE_KEYS.DESFUSAO, desfusaoHistory);
    }

    function getNeutralChildRef() {
        const prof = global.VaultCore.store.getProfile();
        const label = String(prof.childLabel || '').trim();
        return label || 'Criança / Ambiente Familiar';
    }

    function getAutonomicStatus(level) {
        const lv = Number(level) || 5;
        if (lv <= 3) {
            return {
                badge: '1–3 • Ventral Vagal / Córtex Pré-Frontal Íntegro',
                cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                latency: 'Deliberação liberada com clareza executiva.'
            };
        }
        if (lv <= 6) {
            return {
                badge: '4–6 • Alerta Simpático Moderado',
                cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                latency: 'Recomendado intervalo de 60 min e respiração fisiológica antes de responder.'
            };
        }
        return {
            badge: '7–10 • Hiperativação Amigdaliana (Risco de Erro Tático)',
            cls: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
            latency: 'MORATÓRIA OBRIGATÓRIA DE 12h A 24h: Nenhuma mensagem, ligação ou decisão irreversível agora.'
        };
    }

    function mountDesfusaoShell() {
        const panel = document.getElementById('tab-panel-desfusao');
        if (!panel) return;
        const C = global.VaultCore;
        const prof = C.store.getProfile();

        panel.innerHTML = `
            <div class="space-y-5 pb-20">
                <!-- Cabeçalho + Configuração Local de Referência Familiar (100% LocalStorage) -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">Rigor Comportamental & Estoico</span>
                            <span class="text-xs font-mono text-slate-400">Uso Rápido de Bolso</span>
                        </div>
                        <h2 class="text-lg sm:text-xl font-bold text-slate-100 mt-1">Protocolo de Desfusão Cognitiva, Trade-offs e Veredito 24h</h2>
                    </div>

                    <div class="flex flex-wrap items-center gap-2 bg-[#090d16] border border-slate-800 rounded-xl px-3 py-2">
                        <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400 shrink-0"></i>
                        <label for="df-profile-label" class="text-xs text-slate-400 whitespace-nowrap">Ref. de Proteção Local:</label>
                        <input type="text" id="df-profile-label" value="${C.esc(prof.childLabel || '')}"
                            placeholder="Criança / Ambiente Familiar"
                            class="min-h-[36px] px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-emerald-300 font-medium w-48 focus:outline-none focus:border-emerald-500">
                    </div>
                </div>

                <form id="desfusao-form" class="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <!-- Coluna Esquerda: Clivagem Fenomenológica + Trade-offs -->
                    <div class="lg:col-span-7 space-y-4">
                        <!-- Etapa 1: Fato vs Leitura Emocional -->
                        <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                            <div class="flex items-center justify-between">
                                <h3 class="text-sm font-bold font-mono uppercase tracking-wider text-cyan-300">1. Clivagem Fenomenológica</h3>
                                <span class="text-[11px] text-slate-400">Separar dado observável de fusão verbal</span>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-xs font-semibold text-slate-300 mb-1">Fato Objetivo Estrito *</label>
                                    <textarea id="df-strict-fact" rows="3" required
                                        placeholder="O que uma câmera registraria sem adjetivos, suposições de intenção ou leituras mentais?"
                                        class="w-full p-2.5 rounded-lg bg-[#090d16] border border-slate-700 text-xs sm:text-sm text-slate-100 focus:border-cyan-500"></textarea>
                                </div>
                                <div>
                                    <div class="flex items-center justify-between mb-1">
                                        <label class="block text-xs font-semibold text-slate-300">Leitura Emocional / Impulso Reativo *</label>
                                        <button type="button" id="btn-df-apply-defusion" class="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 transition">
                                            Desfusão ACT (Rótulo Mental)
                                        </button>
                                    </div>
                                    <textarea id="df-emotional-reading" rows="3" required
                                        placeholder="Qual narrativa de afronta, urgência de retrucar ou controle imediato apareceu?"
                                        class="w-full p-2.5 rounded-lg bg-[#090d16] border border-slate-700 text-xs sm:text-sm text-amber-100 focus:border-amber-500"></textarea>
                                    <div class="flex flex-wrap gap-1 mt-1.5" id="df-quick-chips-container">
                                        <button type="button" data-df-quick-chip="Estou notando a narrativa de que " class="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition">"Estou notando a narrativa..."</button>
                                        <button type="button" data-df-quick-chip="Acolho a sensação física de aperto sem transformá-la em ação impulsiva." class="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition">"Acolho sem impulso..."</button>
                                        <button type="button" data-df-quick-chip="O silêncio deliberado e a não-reação são minha maior autoridade e soberania." class="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition">"Silêncio é soberania..."</button>
                                        <button type="button" data-df-quick-chip="Sou a consciência calma que observa a emoção, e não a própria emoção passageira." class="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-300 hover:border-emerald-500/40 transition">"Sou quem observa..."</button>
                                        <button type="button" data-df-quick-chip="Esta urgência imediata é apenas química corporal transitória, não uma ordem de verdade." class="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-300 hover:border-amber-500/40 transition">"Química corporal..."</button>
                                    </div>
                                </div>
                            </div>

                            <!-- Auditoria de Distorções Cognitivas Rápidas (Beck + ACT) -->
                            <div class="space-y-1.5 pt-1 border-t border-slate-800/80">
                                <span class="text-[11px] font-semibold text-slate-300 block font-mono">Distorções Cognitivas em Jogo (Selecione as ativas):</span>
                                <div class="flex flex-wrap gap-1.5" id="df-distortions-chips">
                                    <label class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#090d16] border border-slate-800 text-[11px] text-slate-300 hover:border-slate-600 cursor-pointer">
                                        <input type="checkbox" value="Leitura Mental" class="w-3.5 h-3.5 rounded text-amber-500 bg-slate-900 border-slate-700">
                                        <span>Leitura Mental</span>
                                    </label>
                                    <label class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#090d16] border border-slate-800 text-[11px] text-slate-300 hover:border-slate-600 cursor-pointer">
                                        <input type="checkbox" value="Catastrofização" class="w-3.5 h-3.5 rounded text-amber-500 bg-slate-900 border-slate-700">
                                        <span>Catastrofização</span>
                                    </label>
                                    <label class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#090d16] border border-slate-800 text-[11px] text-slate-300 hover:border-slate-600 cursor-pointer">
                                        <input type="checkbox" value="Tudo ou Nada" class="w-3.5 h-3.5 rounded text-amber-500 bg-slate-900 border-slate-700">
                                        <span>Tudo ou Nada</span>
                                    </label>
                                    <label class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#090d16] border border-slate-800 text-[11px] text-slate-300 hover:border-slate-600 cursor-pointer">
                                        <input type="checkbox" value="Raciocínio Emocional" class="w-3.5 h-3.5 rounded text-amber-500 bg-slate-900 border-slate-700">
                                        <span>Raciocínio Emocional</span>
                                    </label>
                                    <label class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#090d16] border border-slate-800 text-[11px] text-slate-300 hover:border-slate-600 cursor-pointer">
                                        <input type="checkbox" value="Imperativo ('Deveria')" class="w-3.5 h-3.5 rounded text-amber-500 bg-slate-900 border-slate-700">
                                        <span>Imperativo ("Deveria")</span>
                                    </label>
                                    <label class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#090d16] border border-slate-800 text-[11px] text-slate-300 hover:border-slate-600 cursor-pointer">
                                        <input type="checkbox" value="Personalização" class="w-3.5 h-3.5 rounded text-amber-500 bg-slate-900 border-slate-700">
                                        <span>Personalização</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Âncora Estoica da Dicotomia do Controle -->
                            <div class="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs text-slate-300 flex items-start gap-2">
                                <i data-lucide="compass" class="w-4 h-4 text-cyan-400 shrink-0 mt-0.5"></i>
                                <div>
                                    <span class="font-bold text-cyan-300 font-mono">Dicotomia do Controle (Epicteto):</span>
                                    <span> O que o outro faz, fala ou sente está fora do seu controle. O que você diz, como responde e se protege a estabilidade familiar é 100% sua responsabilidade.</span>
                                </div>
                            </div>

                            <!-- As 3 Perguntas Socráticas de Blindagem Pré-Decisão -->
                            <div class="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs space-y-1.5">
                                <div class="flex items-center gap-2 text-amber-300 font-mono font-bold text-[11px] uppercase tracking-wider">
                                    <i data-lucide="help-circle" class="w-4 h-4 text-amber-400"></i>
                                    <span>Blindagem Socrática Pré-Decisão:</span>
                                </div>
                                <ul class="space-y-1 text-slate-300 text-[11px]">
                                    <li>• <strong>1. Perspectiva Temporal:</strong> Isso terá qualquer relevância real na sua vida daqui a 6 meses?</li>
                                    <li>• <strong>2. Ecologia Afetiva:</strong> Reagir agora alimenta a escalada ou constrói paz para quem você ama?</li>
                                    <li>• <strong>3. Soberania:</strong> Qual resposta (ou silêncio deliberado) fará você se orgulhar de si mesmo amanhã?</li>
                                </ul>
                            </div>

                            <!-- Slider de Ativação Fisiológica -->
                            <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3 space-y-2">
                                <div class="flex flex-wrap items-center justify-between gap-2">
                                    <label for="df-autonomic-slider" class="text-xs font-mono text-slate-300">
                                        Ativação Fisiológica / Autonômica Atual: <strong id="df-autonomic-val" class="text-cyan-300 text-sm">5/10</strong>
                                    </label>
                                    <span id="df-autonomic-badge" class="px-2 py-0.5 rounded text-[11px] font-mono border"></span>
                                </div>
                                <input type="range" id="df-autonomic-slider" min="1" max="10" value="5" class="w-full accent-cyan-400 cursor-pointer">
                                <p id="df-autonomic-hint" class="text-[11px] text-slate-400"></p>
                            </div>
                        </div>

                        <!-- Etapa 2: Matriz de Trade-offs e Custo de Oportunidade -->
                        <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                            <h3 class="text-sm font-bold font-mono uppercase tracking-wider text-amber-300">2. Análise de Trade-offs & Custo de Oportunidade</h3>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <!-- Cenário A: Reação Impulsiva -->
                                <div class="bg-rose-950/15 border border-rose-500/25 rounded-xl p-3 space-y-2.5">
                                    <div class="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                                        <i data-lucide="zap-off" class="w-4 h-4"></i>
                                        <span>Cenário A: Reagir Impulsivamente</span>
                                    </div>
                                    <textarea id="df-impulsive-text" rows="2"
                                        placeholder="Se eu reagir no impulso, o que perco em paz mental, tempo clínico e foco?"
                                        class="w-full p-2 rounded bg-[#090d16] border border-slate-800 text-xs text-slate-200"></textarea>

                                    <div>
                                        <div class="flex justify-between text-[11px] font-mono text-slate-400">
                                            <span>Perda de Paz & Foco</span>
                                            <span id="df-loss-val" class="text-rose-300 font-bold">8/10</span>
                                        </div>
                                        <input type="range" id="df-loss-slider" min="0" max="10" value="8" class="w-full accent-rose-500">
                                    </div>

                                    <div>
                                        <div class="flex justify-between text-[11px] font-mono text-slate-400">
                                            <span>Risco de Escalada / Ruído Futuro</span>
                                            <span id="df-esc-val" class="text-rose-300 font-bold">8/10</span>
                                        </div>
                                        <input type="range" id="df-esc-slider" min="0" max="10" value="8" class="w-full accent-rose-500">
                                    </div>
                                </div>

                                <!-- Cenário B: Intervenção Estratégica / Silêncio -->
                                <div class="bg-emerald-950/15 border border-emerald-500/25 rounded-xl p-3 space-y-2.5">
                                    <div class="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                                        <i data-lucide="compass" class="w-4 h-4"></i>
                                        <span>Cenário B: Estratégia / Silêncio Deliberado</span>
                                    </div>
                                    <textarea id="df-strategic-text" rows="2"
                                        placeholder="Qual o desconforto curto agora vs. o ganho composto em soberania e estabilidade?"
                                        class="w-full p-2 rounded bg-[#090d16] border border-slate-800 text-xs text-slate-200"></textarea>

                                    <div>
                                        <div class="flex justify-between text-[11px] font-mono text-slate-400">
                                            <span>Custo Imediato de Autocontrole</span>
                                            <span id="df-effort-val" class="text-amber-300 font-bold">4/10</span>
                                        </div>
                                        <input type="range" id="df-effort-slider" min="0" max="10" value="4" class="w-full accent-amber-400">
                                    </div>

                                    <div>
                                        <div class="flex justify-between text-[11px] font-mono text-slate-400">
                                            <span>Ganho Composto (30–90 dias)</span>
                                            <span id="df-gain-val" class="text-emerald-300 font-bold">9/10</span>
                                        </div>
                                        <input type="range" id="df-gain-slider" min="0" max="10" value="9" class="w-full accent-emerald-400">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Coluna Direita: Proteção Ambiental Infantil + Veredito Operacional 24h -->
                    <div class="lg:col-span-5 space-y-4">
                        <!-- Etapa 3: Filtro de Proteção Ambiental / Familiar -->
                        <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                            <div class="flex items-center justify-between gap-2">
                                <h3 class="text-sm font-bold font-mono uppercase tracking-wider text-emerald-300">
                                    3. Filtro de Proteção: <span id="df-dynamic-child-title" class="text-cyan-300">${C.esc(getNeutralChildRef())}</span>
                                </h3>
                            </div>
                            <p class="text-xs text-slate-400">A conduta escolhida deve passar pelos 4 critérios de preservação da ecologia afetiva:</p>

                            <div class="space-y-2 text-xs text-slate-200">
                                <label class="flex items-center gap-2.5 p-2 rounded-lg bg-[#090d16] border border-slate-800 cursor-pointer">
                                    <input type="checkbox" id="df-chk-routine" checked class="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-600">
                                    <span>Preserva integralmente rotina, horários e qualidade do sono?</span>
                                </label>
                                <label class="flex items-center gap-2.5 p-2 rounded-lg bg-[#090d16] border border-slate-800 cursor-pointer">
                                    <input type="checkbox" id="df-chk-shield" checked class="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-600">
                                    <span>Evita qualquer exposição a tensão verbal, pressa ou ruído relacional?</span>
                                </label>
                                <label class="flex items-center gap-2.5 p-2 rounded-lg bg-[#090d16] border border-slate-800 cursor-pointer">
                                    <input type="checkbox" id="df-chk-warmth" checked class="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-600">
                                    <span>Mantém previsibilidade afetiva e presença regulada do adulto?</span>
                                </label>
                                <label class="flex items-center gap-2.5 p-2 rounded-lg bg-[#090d16] border border-slate-800 cursor-pointer">
                                    <input type="checkbox" id="df-chk-documentation" checked class="w-4 h-4 rounded text-emerald-500 bg-slate-900 border-slate-600">
                                    <span>Comunicação externa restrita ao estritamente objetivo, breve e documentável?</span>
                                </label>
                            </div>
                        </div>

                        <!-- Etapa 4: Score Estratégico & Veredito 24h -->
                        <div class="bg-[#0f172a] border border-cyan-500/30 rounded-xl p-4 space-y-3">
                            <div class="flex items-center justify-between">
                                <h3 class="text-sm font-bold font-mono uppercase tracking-wider text-slate-100">4. Veredito Operacional (24h)</h3>
                                <span id="df-net-score-badge" class="px-2.5 py-1 rounded-full font-mono text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"></span>
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-emerald-300 mb-1">O que FAREI nas próximas 24h (Ação Deliberada) *</label>
                                <input type="text" id="df-do-action" required
                                    placeholder="Ex.: Responder apenas o ponto objetivo em 2 linhas amanhã às 10h e focar no estudo."
                                    class="w-full min-h-[42px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-xs sm:text-sm text-slate-100">
                            </div>

                            <div>
                                <label class="block text-xs font-semibold text-rose-300 mb-1">O que NÃO FAREI nas próximas 24h (Impulso Vetado) *</label>
                                <input type="text" id="df-dont-action" required
                                    placeholder="Ex.: Zero justificativas longas, zero ironia e zero checagem repetitiva de mensagens."
                                    class="w-full min-h-[42px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-xs sm:text-sm text-slate-100">
                            </div>

                            <div class="flex flex-wrap items-center gap-2 pt-1">
                                <button type="submit" class="flex-1 min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition">
                                    <i data-lucide="save" class="w-4 h-4"></i>
                                    <span>Registrar Veredito 24h</span>
                                </button>
                                <button type="button" id="btn-df-export-csv" class="min-h-[44px] px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 flex items-center gap-1.5" title="Exportar histórico em CSV">
                                    <i data-lucide="file-spreadsheet" class="w-4 h-4 text-cyan-400"></i>
                                    <span>CSV</span>
                                </button>
                                <button type="button" id="btn-df-export-json" class="min-h-[44px] px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 flex items-center gap-1.5" title="Exportar histórico em JSON">
                                    <i data-lucide="file-json" class="w-4 h-4 text-emerald-400"></i>
                                    <span>JSON</span>
                                </button>
                                <button type="button" id="btn-df-export-md" class="min-h-[44px] px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 flex items-center gap-1.5" title="Exportar histórico em Markdown">
                                    <i data-lucide="file-text" class="w-4 h-4 text-amber-400"></i>
                                    <span>MD</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                <!-- Histórico Local de Deliberações -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                        <div class="flex items-center gap-2">
                            <h3 class="text-sm font-bold font-mono uppercase tracking-wider text-slate-200">Histórico Local de Vereditos Registrados</h3>
                            <span id="df-history-count" class="text-xs font-mono text-cyan-300 font-semibold">0 registros</span>
                        </div>
                        <input type="text" id="df-history-search" placeholder="Buscar no histórico..."
                            class="min-h-[34px] px-3 py-1 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 w-full sm:w-60">
                    </div>

                    <!-- Métricas Rápidas do Histórico -->
                    <div id="df-history-metrics-bar" class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono"></div>

                    <div id="df-history-list" class="space-y-2"></div>
                </div>
            </div>
        `;

        bindDesfusaoEvents();
        updateDesfusaoLiveMetrics();
        renderDesfusaoHistory();
    }

    function updateDesfusaoLiveMetrics() {
        const autoLv = Number(document.getElementById('df-autonomic-slider').value);
        const loss = Number(document.getElementById('df-loss-slider').value);
        const esc = Number(document.getElementById('df-esc-slider').value);
        const effort = Number(document.getElementById('df-effort-slider').value);
        const gain = Number(document.getElementById('df-gain-slider').value);

        document.getElementById('df-autonomic-val').textContent = `${autoLv}/10`;
        document.getElementById('df-loss-val').textContent = `${loss}/10`;
        document.getElementById('df-esc-val').textContent = `${esc}/10`;
        document.getElementById('df-effort-val').textContent = `${effort}/10`;
        document.getElementById('df-gain-val').textContent = `${gain}/10`;

        const st = getAutonomicStatus(autoLv);
        const badgeEl = document.getElementById('df-autonomic-badge');
        badgeEl.textContent = st.badge;
        badgeEl.className = `px-2 py-0.5 rounded text-[11px] font-mono border ${st.cls}`;
        document.getElementById('df-autonomic-hint').textContent = st.latency;

        const netAdvantage = (gain + loss + esc) - effort;
        const netBadge = document.getElementById('df-net-score-badge');
        netBadge.textContent = `Vantagem Estratégica: ${netAdvantage >= 0 ? '+' : ''}${netAdvantage} pts`;
    }

    function renderDesfusaoHistory(filterText = '') {
        const listEl = document.getElementById('df-history-list');
        const cntEl = document.getElementById('df-history-count');
        const metricsEl = document.getElementById('df-history-metrics-bar');
        if (!listEl || !cntEl) return;
        const C = global.VaultCore;

        const totalCount = desfusaoHistory.length;
        cntEl.textContent = `${totalCount} registro${totalCount === 1 ? '' : 's'}`;

        if (metricsEl) {
            if (totalCount === 0) {
                metricsEl.innerHTML = '';
            } else {
                const sumAuto = desfusaoHistory.reduce((acc, i) => acc + (Number(i.autonomicLevel) || 5), 0);
                const avgAuto = (sumAuto / totalCount).toFixed(1);
                const passedFull = desfusaoHistory.filter(i => (i.checksPassed || 0) >= 3).length;
                const shieldRate = Math.round((passedFull / totalCount) * 100);
                metricsEl.innerHTML = `
                    <div class="bg-[#090d16] border border-slate-800 rounded-lg p-2 text-center">
                        <div class="text-[10px] text-slate-400">Vereditos Registrados</div>
                        <div class="text-sm font-bold text-cyan-300">${totalCount}</div>
                    </div>
                    <div class="bg-[#090d16] border border-slate-800 rounded-lg p-2 text-center">
                        <div class="text-[10px] text-slate-400">Ativação Média</div>
                        <div class="text-sm font-bold text-amber-300">${avgAuto}/10</div>
                    </div>
                    <div class="bg-[#090d16] border border-slate-800 rounded-lg p-2 text-center col-span-2 sm:col-span-1">
                        <div class="text-[10px] text-slate-400">Blindagem Familiar</div>
                        <div class="text-sm font-bold text-emerald-300">${shieldRate}% preservada</div>
                    </div>
                `;
            }
        }

        if (totalCount === 0) {
            listEl.innerHTML = `<p class="text-xs text-slate-500 italic py-2">Nenhum protocolo salvo ainda neste dispositivo.</p>`;
            return;
        }

        const q = String(filterText || '').toLowerCase().trim();
        const filtered = q
            ? desfusaoHistory.filter(item =>
                (item.strictFact && item.strictFact.toLowerCase().includes(q)) ||
                (item.emotionalReading && item.emotionalReading.toLowerCase().includes(q)) ||
                (item.doAction && item.doAction.toLowerCase().includes(q)) ||
                (item.dontAction && item.dontAction.toLowerCase().includes(q)) ||
                (item.date && item.date.includes(q))
              )
            : desfusaoHistory;

        if (filtered.length === 0) {
            listEl.innerHTML = `<p class="text-xs text-slate-500 italic py-2">Nenhum veredito encontrado para "${C.esc(filterText)}".</p>`;
            return;
        }

        listEl.innerHTML = filtered.map((item) => `
            <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div class="space-y-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                        <span class="text-cyan-400">${C.formatDateBR(item.date)} ${C.esc(item.time || '')}</span>
                        <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Ativação: ${item.autonomicLevel}/10</span>
                        <span class="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">Proteção: ${item.checksPassed}/4</span>
                        <span class="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300">Saldo: +${item.netAdvantage}</span>
                        ${Array.isArray(item.distortions) && item.distortions.length > 0 ? `
                            <span class="px-2 py-0.5 rounded bg-rose-500/15 text-rose-300">Distorções: ${item.distortions.map(C.esc).join(', ')}</span>
                        ` : ''}
                    </div>
                    <p class="text-xs text-slate-300"><strong>Fato:</strong> ${C.esc(item.strictFact)}</p>
                    <p class="text-xs text-emerald-300"><strong>FAREI (24h):</strong> ${C.esc(item.doAction)}</p>
                    <p class="text-xs text-rose-300"><strong>VETADO (24h):</strong> ${C.esc(item.dontAction)}</p>
                </div>
                <div class="flex items-center gap-1.5 self-end md:self-center shrink-0">
                    <button type="button" data-df-copy="${C.esc(item.id)}" class="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-mono">
                        Copiar MD
                    </button>
                    <button type="button" data-df-del="${C.esc(item.id)}" class="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs">
                        Excluir
                    </button>
                </div>
            </div>
        `).join('');

        listEl.querySelectorAll('[data-df-copy]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-df-copy');
                const target = desfusaoHistory.find((x) => x.id === id);
                if (!target) return;
                const md = [
                    `### Veredito 24h • ${C.formatDateBR(target.date)} ${target.time || ''}`,
                    `- **Ativação Autonômica:** ${target.autonomicLevel}/10`,
                    `- **Fato Objetivo:** ${target.strictFact}`,
                    `- **Leitura Emocional:** ${target.emotionalReading}`,
                    `- **Distorções:** ${Array.isArray(target.distortions) ? target.distortions.join(', ') : 'Nenhuma'}`,
                    `- **O QUE FAREI (24h):** ${target.doAction}`,
                    `- **O QUE NÃO FAREI (24h):** ${target.dontAction}`
                ].join('\n');
                navigator.clipboard.writeText(md).then(() => {
                    C.toast('Veredito copiado em Markdown para a área de transferência!', 'success');
                }).catch(() => {
                    C.toast('Não foi possível copiar automaticamente.', 'error');
                });
            });
        });

        listEl.querySelectorAll('[data-df-del]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-df-del');
                desfusaoHistory = desfusaoHistory.filter((x) => x.id !== id);
                saveDesfusaoHistory();
                renderDesfusaoHistory(document.getElementById('df-history-search') ? document.getElementById('df-history-search').value : '');
            });
        });
    }

    function bindDesfusaoEvents() {
        const C = global.VaultCore;

        const searchInp = document.getElementById('df-history-search');
        if (searchInp) {
            searchInp.addEventListener('input', (e) => {
                renderDesfusaoHistory(e.target.value);
            });
        }

        document.querySelectorAll('[data-df-quick-chip]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const phrase = btn.getAttribute('data-df-quick-chip');
                const emoArea = document.getElementById('df-emotional-reading');
                if (emoArea) {
                    if (!emoArea.value.trim()) {
                        emoArea.value = phrase;
                    } else if (!emoArea.value.includes(phrase)) {
                        emoArea.value = phrase + ' ' + emoArea.value.trim();
                    }
                    emoArea.focus();
                }
            });
        });

        const labelInput = document.getElementById('df-profile-label');
        labelInput.addEventListener('input', (e) => {
            const val = e.target.value;
            C.store.updateProfile({ childLabel: val });
            document.getElementById('df-dynamic-child-title').textContent = getNeutralChildRef();
            const storyChildIn = document.getElementById('ct-child-name');
            if (storyChildIn && document.activeElement !== storyChildIn) {
                storyChildIn.value = val;
            }
        });

        const btnDefuse = document.getElementById('btn-df-apply-defusion');
        if (btnDefuse) {
            btnDefuse.addEventListener('click', () => {
                const emoArea = document.getElementById('df-emotional-reading');
                let current = emoArea.value.trim();
                if (!current) {
                    current = 'tenho que resolver ou rebater isso imediatamente';
                }
                if (!current.startsWith('Estou notando o pensamento de que')) {
                    emoArea.value = `Estou notando o pensamento de que "${current}"... mas pensamentos são eventos cognitivos transitórios, não ordens motoras.`;
                }
                C.toast('Desfusão ACT aplicada à narrativa emocional.', 'info');
            });
        }

        ['df-autonomic-slider', 'df-loss-slider', 'df-esc-slider', 'df-effort-slider', 'df-gain-slider'].forEach((id) => {
            document.getElementById(id).addEventListener('input', updateDesfusaoLiveMetrics);
        });

        document.getElementById('desfusao-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const autoLv = Number(document.getElementById('df-autonomic-slider').value);
            const loss = Number(document.getElementById('df-loss-slider').value);
            const esc = Number(document.getElementById('df-esc-slider').value);
            const effort = Number(document.getElementById('df-effort-slider').value);
            const gain = Number(document.getElementById('df-gain-slider').value);
            const checks = ['df-chk-routine', 'df-chk-shield', 'df-chk-warmth', 'df-chk-documentation']
                .filter((id) => document.getElementById(id).checked).length;
            const distortions = Array.from(document.querySelectorAll('#df-distortions-chips input:checked'))
                .map((el) => el.value);

            const now = new Date();
            const record = {
                id: 'DF-' + Date.now(),
                date: C.todayISO(),
                time: now.toTimeString().slice(0, 5),
                strictFact: document.getElementById('df-strict-fact').value.trim(),
                emotionalReading: document.getElementById('df-emotional-reading').value.trim(),
                distortions,
                autonomicLevel: autoLv,
                impulsiveNotes: document.getElementById('df-impulsive-text').value.trim(),
                strategicNotes: document.getElementById('df-strategic-text').value.trim(),
                netAdvantage: (gain + loss + esc) - effort,
                checksPassed: checks,
                doAction: document.getElementById('df-do-action').value.trim(),
                dontAction: document.getElementById('df-dont-action').value.trim()
            };

            desfusaoHistory.unshift(record);
            saveDesfusaoHistory();
            e.target.reset();
            document.querySelectorAll('#df-distortions-chips input').forEach((el) => { el.checked = false; });
            document.getElementById('df-chk-routine').checked = true;
            document.getElementById('df-chk-shield').checked = true;
            document.getElementById('df-chk-warmth').checked = true;
            document.getElementById('df-chk-documentation').checked = true;
            updateDesfusaoLiveMetrics();
            renderDesfusaoHistory();
            C.store.remove('dm_vault_desfusao_draft');
            C.toast('Veredito operacional de 24h gravado com sucesso.', 'success');
        });

        // Auto-save de rascunho de desfusão
        const draftInputs = ['df-strict-fact', 'df-emotional-reading', 'df-impulsive-text', 'df-strategic-text', 'df-do-action', 'df-dont-action'];
        draftInputs.forEach((id) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => {
                    const draft = {};
                    draftInputs.forEach(k => {
                        const inp = document.getElementById(k);
                        if (inp) draft[k] = inp.value;
                    });
                    C.store.set('dm_vault_desfusao_draft', draft);
                });
            }
        });

        // Restaura rascunho salvo
        const savedDraft = C.store.get('dm_vault_desfusao_draft', null);
        if (savedDraft && typeof savedDraft === 'object') {
            draftInputs.forEach((k) => {
                if (savedDraft[k]) {
                    const el = document.getElementById(k);
                    if (el && !el.value) el.value = savedDraft[k];
                }
            });
        }

        document.getElementById('btn-df-export-csv').addEventListener('click', () => {
            const headers = ['Data', 'Hora', 'Ativação (1-10)', 'Proteção (0-4)', 'Saldo Estratégico', 'Distorções', 'Fato Estrito', 'Leitura Reativa', 'Farei (24h)', 'Não Farei (24h)'];
            const rows = desfusaoHistory.map((r) => [
                r.date, r.time, r.autonomicLevel, r.checksPassed, r.netAdvantage,
                (r.distortions || []).join('; '),
                r.strictFact, r.emotionalReading, r.doAction, r.dontAction
            ]);
            C.exportCSV(`protocolos-desfusao-${C.todayISO()}.csv`, headers, rows);
            C.toast('Histórico de desfusão exportado em CSV.', 'success');
        });

        const btnExportJson = document.getElementById('btn-df-export-json');
        if (btnExportJson) {
            btnExportJson.addEventListener('click', () => {
                C.exportJSON(`protocolos-desfusao-${C.todayISO()}.json`, {
                    exportDate: new Date().toISOString(),
                    totalRecords: desfusaoHistory.length,
                    history: desfusaoHistory
                });
                C.toast('Histórico de desfusão exportado em JSON.', 'success');
            });
        }

        const btnExportMd = document.getElementById('btn-df-export-md');
        if (btnExportMd) {
            btnExportMd.addEventListener('click', () => {
                if (desfusaoHistory.length === 0) {
                    C.toast('Nenhum veredito para exportar.', 'info');
                    return;
                }
                const sections = desfusaoHistory.map((item, idx) => [
                    `## ${idx + 1}. Veredito 24h • ${C.formatDateBR(item.date)} ${item.time || ''}`,
                    `- **Ativação Autonômica:** ${item.autonomicLevel}/10`,
                    `- **Filtro de Proteção Familiar:** ${item.checksPassed}/4 critérios`,
                    `- **Saldo Estratégico:** +${item.netAdvantage} pts`,
                    `- **Distorções Identificadas:** ${(item.distortions || []).join(', ') || 'Nenhuma'}`,
                    `\n### Fato Objetivo Estrito:`,
                    `> ${item.strictFact || '—'}`,
                    `\n### Narrativa Reativa / Leitura Emocional:`,
                    `> ${item.emotionalReading || '—'}`,
                    `\n### Resolução Operacional:`,
                    `- **O QUE FAREI (24h):** ${item.doAction}`,
                    `- **O QUE NÃO FAREI (24h):** ${item.dontAction}`,
                    `\n---`
                ].join('\n'));

                const fullDoc = [
                    `# Histórico Consolidado de Deliberação Estratégica & Desfusão ACT`,
                    `*Exportado em: ${new Date().toLocaleString('pt-BR')} • Total de Registros: ${desfusaoHistory.length}*`,
                    `\n---\n`,
                    ...sections
                ].join('\n\n');

                const blob = new Blob([fullDoc], { type: 'text/markdown;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `protocolos-desfusao-${C.todayISO()}.md`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                C.toast('Histórico exportado em Markdown com sucesso!', 'success');
            });
        }
    }

    // =========================================================================
    // ABA 4 — GERADOR ESTRUTURADO DE CENAS TERAPÊUTICAS E CONTOS NOTURNOS
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
        }
    };

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
        }
    };

    let savedStories = [];
    let currentComposedStory = { title: '', text: '', question: '', theme: '', scenario: '', source: 'Modular Offline' };
    let amberFontSizeRem = 1.25;

    // =========================================================================
    // SINTETIZADOR ACÚSTICO WEB AUDIO API (RELAXAMENTO PRÉ-SONO 100% OFFLINE)
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
            // Ruído Marrom Profundo (Brown Noise com filtro integrador)
            let lastOut = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5;
            }
        } else if (mode === 'rain') {
            // Chuva Mansa na Mata (Ruído Rosa com modulação estocástica)
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
        } else {
            // Ondas Suaves da Noite (modulação senoidal lenta de baixa frequência)
            let lastOut = 0.0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = output[i];
                const waveMod = Math.sin((i / bufferSize) * Math.PI * 4) * 0.35 + 0.65;
                output[i] *= waveMod * 3.0;
            }
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = mode === 'brown' ? 320 : (mode === 'rain' ? 800 : 420);

        soundGainNode = ctx.createGain();
        const volSlider = document.getElementById('audio-volume-slider');
        const volVal = volSlider ? parseInt(volSlider.value, 10) / 100 : 0.3;
        soundGainNode.gain.setValueAtTime(volVal * 0.22, ctx.currentTime);

        source.connect(filter);
        filter.connect(soundGainNode);
        soundGainNode.connect(ctx.destination);

        source.start();
        soundSourceNode = source;
        isRelaxAudioPlaying = true;
        updateAudioControlsUI(true);
    }

    function stopRelaxationAudio() {
        if (soundSourceNode) {
            try { soundSourceNode.stop(); soundSourceNode.disconnect(); } catch (_) {}
            soundSourceNode = null;
        }
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

    // =========================================================================
    // PALETAS TÉRMICAS LOW-BLUE-LIGHT DO LEITOR NOTURNO
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
        const pal = AMBER_PALETTES[themeKey] || AMBER_PALETTES.amber;
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
    }

    function loadStories() {
        const C = global.VaultCore;
        const arr = C.store.get(C.STORAGE_KEYS.CONTOS, []);
        savedStories = Array.isArray(arr) ? arr : [];
    }

    function saveStories() {
        const C = global.VaultCore;
        C.store.set(C.STORAGE_KEYS.CONTOS, savedStories);
    }

    function composeModularStory(params) {
        const th = STORY_THEMES[params.themeKey] || STORY_THEMES.frustracao;
        const sc = STORY_SCENARIOS[params.scenarioKey] || STORY_SCENARIOS.cerrado;
        const protagonist = params.childName ? params.childName : 'pequeno(a) viajante';
        const ageNum = Number(params.childAge) || 5;

        const paceNote = ageNum <= 4
            ? 'Cada palavra soava redonda, curtinha e mansa como um balanço devagar.'
            : 'O silêncio gostoso da noite deixava cada pensamento desacelerar sem nenhuma pressa.';

        const title = `${params.childName ? params.childName + ' e ' : 'O Segredo d'}o Descanso em ${sc.label.split('&')[0].trim()}`;

        const act1 = `${sc.opening} ${paceNote} Ali caminhava ${protagonist}, sentindo a grama macia sob os pés e observando as primeiras luzes suaves do entardecer.`;
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
        return {
            childName: document.getElementById('ct-child-name').value.trim(),
            childAge: Number(document.getElementById('ct-child-age').value) || 5,
            themeKey: document.getElementById('ct-theme').value,
            scenarioKey: document.getElementById('ct-scenario').value,
            metaphor: document.getElementById('ct-metaphor').value.trim(),
            question: document.getElementById('ct-question').value.trim()
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
        badgeEl.textContent = currentComposedStory.source;

        const paragraphs = currentComposedStory.text
            .split(/\n\s*\n/)
            .map((p) => p.trim())
            .filter(Boolean);

        bodyEl.innerHTML = paragraphs
            .map((p) => `<p class="leading-relaxed text-amber-100/90 text-sm sm:text-base">${C.esc(p)}</p>`)
            .join('');

        qEl.textContent = currentComposedStory.question;
    }

    function openAmberNightReader(storyObj) {
        const overlay = document.getElementById('amber-night-reader');
        if (!overlay) return;
        const C = global.VaultCore;
        const target = storyObj || currentComposedStory;

        document.getElementById('amber-reader-title').textContent = target.title;
        const body = document.getElementById('amber-reader-body');
        body.style.fontSize = `${amberFontSizeRem}rem`;
        body.innerHTML = target.text
            .split(/\n\s*\n/)
            .filter(Boolean)
            .map((p) => `<p class="mb-5 leading-[1.85]">${C.esc(p.trim())}</p>`)
            .join('');

        document.getElementById('amber-reader-question').textContent = target.question || '';
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeAmberNightReader() {
        const overlay = document.getElementById('amber-night-reader');
        if (overlay) overlay.classList.add('hidden');
        document.body.style.overflow = '';
        stopRelaxationAudio();
    }

    function renderSavedStoriesLibrary() {
        const listEl = document.getElementById('ct-library-list');
        const cntEl = document.getElementById('ct-library-count');
        if (!listEl || !cntEl) return;
        const C = global.VaultCore;

        cntEl.textContent = `${savedStories.length} conto${savedStories.length === 1 ? '' : 's'} salvo${savedStories.length === 1 ? '' : 's'}`;
        if (savedStories.length === 0) {
            listEl.innerHTML = `<p class="text-xs text-slate-500 italic py-2">Sua biblioteca local está vazia. Clique em "Favoritar na Biblioteca" para guardar contos especiais.</p>`;
            return;
        }

        listEl.innerHTML = savedStories.map((st) => `
            <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                        <span class="text-amber-300">${C.formatDateBR(st.date)}</span>
                        <span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300">${C.esc(st.theme)}</span>
                        <span class="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300">${C.esc(st.source)}</span>
                    </div>
                    <h4 class="text-sm font-bold text-amber-100 mt-1 truncate">${C.esc(st.title)}</h4>
                    <p class="text-xs text-slate-400 truncate mt-0.5">${C.esc(st.text.slice(0, 110))}…</p>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <button type="button" data-lib-read="${C.esc(st.id)}" class="min-h-[38px] px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold">
                        Modo Âmbar
                    </button>
                    <button type="button" data-lib-del="${C.esc(st.id)}" class="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs">
                        Excluir
                    </button>
                </div>
            </div>
        `).join('');

        listEl.querySelectorAll('[data-lib-read]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const found = savedStories.find((s) => s.id === btn.getAttribute('data-lib-read'));
                if (found) {
                    currentComposedStory = found;
                    renderStoryOutput();
                    openAmberNightReader(found);
                }
            });
        });

        listEl.querySelectorAll('[data-lib-del]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-lib-del');
                savedStories = savedStories.filter((s) => s.id !== id);
                saveStories();
                renderSavedStoriesLibrary();
            });
        });
    }

    function mountContosShell() {
        const panel = document.getElementById('tab-panel-contos');
        if (!panel) return;
        const C = global.VaultCore;
        const prof = C.store.getProfile();
        const initTheme = STORY_THEMES.frustracao;

        panel.innerHTML = `
            <div class="space-y-5 pb-20">
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">Co-Regulação Afetiva & Sono</span>
                            <span class="text-xs font-mono text-slate-400">4 Atos + Leitor Âmbar Low-Blue-Light</span>
                        </div>
                        <h2 class="text-lg sm:text-xl font-bold text-slate-100 mt-1">Gerador Estruturado de Cenas Terapêuticas & Contos Noturnos</h2>
                    </div>
                    <button type="button" id="btn-ct-open-amber" class="min-h-[44px] px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition">
                        <i data-lucide="moon-star" class="w-4 h-4"></i>
                        <span>Tela Cheia de Leitura Noturna Âmbar</span>
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <!-- Parâmetros Narrativos -->
                    <div class="lg:col-span-5 bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                        <h3 class="text-sm font-bold font-mono uppercase tracking-wider text-amber-300">Parâmetros da Cena Noturna</h3>

                        <div class="grid grid-cols-3 gap-2">
                            <div class="col-span-2">
                                <label class="block text-xs font-mono text-slate-400 mb-1">Nome / Apelido Opcional (Local)</label>
                                <input type="text" id="ct-child-name" value="${C.esc(prof.childLabel || '')}"
                                    placeholder="Pequeno(a) Explorador(a)"
                                    class="w-full min-h-[42px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-xs sm:text-sm text-amber-100">
                            </div>
                            <div>
                                <label class="block text-xs font-mono text-slate-400 mb-1">Idade</label>
                                <input type="number" id="ct-child-age" min="2" max="12" value="${Number(prof.childAge) || 5}"
                                    class="w-full min-h-[42px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-slate-100">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-mono text-slate-400 mb-1">Tema Emocional do Dia</label>
                            <select id="ct-theme" class="w-full min-h-[42px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-xs sm:text-sm text-slate-100">
                                ${Object.entries(STORY_THEMES).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-mono text-slate-400 mb-1">Arquétipo / Cenário</label>
                            <select id="ct-scenario" class="w-full min-h-[42px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-xs sm:text-sm text-slate-100">
                                ${Object.entries(STORY_SCENARIOS).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-mono text-slate-400 mb-1">Metáfora Comportamental Desejada</label>
                            <textarea id="ct-metaphor" rows="3"
                                class="w-full p-2.5 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-slate-200">${C.esc(initTheme.defaultMetaphor)}</textarea>
                        </div>

                        <div>
                            <label class="block text-xs font-mono text-slate-400 mb-1">Pergunta Reflexiva Suave para Dormir</label>
                            <textarea id="ct-question" rows="2"
                                class="w-full p-2.5 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-amber-200">${C.esc(initTheme.defaultQuestion)}</textarea>
                        </div>

                        <button type="button" id="btn-ct-recompose" class="w-full min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-100 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2">
                            <i data-lucide="sparkles" class="w-4 h-4 text-amber-400"></i>
                            <span>Atualizar Conto Modular & Prompt</span>
                        </button>
                    </div>

                    <!-- Saída Dupla: Conto Base 4 Atos + Prompt / Gemini API Local -->
                    <div class="lg:col-span-7 space-y-4">
                        <!-- Saída 1: Conto Completo Pronto para Leitura -->
                        <div class="bg-[#14100c] border border-amber-500/30 rounded-xl p-5 space-y-4 shadow-xl">
                            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                                <div>
                                    <span id="ct-story-source-badge" class="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">Motor Modular Offline</span>
                                    <h3 id="ct-story-title" class="text-base sm:text-lg font-bold text-amber-200 mt-1"></h3>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button type="button" id="btn-ct-save-fav" class="min-h-[38px] px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5">
                                        <i data-lucide="bookmark-plus" class="w-3.5 h-3.5"></i>
                                        <span>Favoritar na Biblioteca</span>
                                    </button>
                                </div>
                            </div>

                            <div id="ct-story-body" class="space-y-3 font-serif"></div>

                            <div class="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3.5">
                                <span class="text-[11px] font-mono uppercase tracking-wider text-amber-400 block mb-1">Pergunta Sussurrada de Conexão Final</span>
                                <p id="ct-story-question" class="text-sm italic text-amber-100"></p>
                            </div>
                        </div>

                        <!-- Saída 2: Prompt Estruturado + Integração Opcional Gemini API Client-Side -->
                        <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                            <div class="flex flex-wrap items-center justify-between gap-2">
                                <h3 class="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-cyan-300">Prompt Clínico-Literário & Geração Gemini API Opcional</h3>
                                <button type="button" id="btn-ct-copy-prompt" class="min-h-[36px] px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-cyan-300 flex items-center gap-1.5">
                                    <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                                    <span>Copiar Prompt</span>
                                </button>
                            </div>

                            <textarea id="ct-prompt-output" rows="4" readonly
                                class="w-full p-2.5 rounded-lg bg-[#090d16] border border-slate-800 font-mono text-[11px] text-slate-300"></textarea>

                            <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
                                <div class="sm:col-span-7">
                                    <input type="password" id="ct-gemini-key" value="${C.esc(prof.geminiApiKey || '')}"
                                        autocomplete="off"
                                        placeholder="Gemini API Key opcional (salva só no LocalStorage)..."
                                        class="w-full min-h-[42px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-200">
                                </div>
                                <div class="sm:col-span-5 flex gap-2">
                                    <button type="button" id="btn-ct-gemini-run" class="flex-1 min-h-[42px] px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition">
                                        <i data-lucide="wand-2" class="w-4 h-4"></i>
                                        <span>Gerar via Gemini 2.5</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Biblioteca Local de Contos Favoritos -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                    <div class="flex items-center justify-between">
                        <h3 class="text-sm font-bold font-mono uppercase tracking-wider text-slate-200">Biblioteca Local de Contos Favoritos</h3>
                        <span id="ct-library-count" class="text-xs font-mono text-slate-400">0 contos salvos</span>
                    </div>
                    <div id="ct-library-list" class="space-y-2"></div>
                </div>
            </div>
        `;

        bindContosEvents();
        updateModularAndPrompt();
        renderSavedStoriesLibrary();
    }

    function bindContosEvents() {
        const C = global.VaultCore;

        document.getElementById('ct-child-name').addEventListener('input', (e) => {
            const val = e.target.value;
            C.store.updateProfile({ childLabel: val });
            const dfIn = document.getElementById('df-profile-label');
            if (dfIn && document.activeElement !== dfIn) {
                dfIn.value = val;
                const titleEl = document.getElementById('df-dynamic-child-title');
                if (titleEl) titleEl.textContent = getNeutralChildRef();
            }
            updateModularAndPrompt();
        });

        document.getElementById('ct-child-age').addEventListener('change', (e) => {
            C.store.updateProfile({ childAge: Number(e.target.value) || 5 });
            updateModularAndPrompt();
        });

        document.getElementById('ct-theme').addEventListener('change', (e) => {
            const th = STORY_THEMES[e.target.value];
            if (th) {
                document.getElementById('ct-metaphor').value = th.defaultMetaphor;
                document.getElementById('ct-question').value = th.defaultQuestion;
            }
            updateModularAndPrompt();
        });

        document.getElementById('ct-scenario').addEventListener('change', updateModularAndPrompt);
        document.getElementById('ct-metaphor').addEventListener('input', updateModularAndPrompt);
        document.getElementById('ct-question').addEventListener('input', updateModularAndPrompt);
        document.getElementById('btn-ct-recompose').addEventListener('click', updateModularAndPrompt);

        document.getElementById('btn-ct-copy-prompt').addEventListener('click', () => {
            const txt = document.getElementById('ct-prompt-output').value;
            navigator.clipboard.writeText(txt).then(() => {
                C.toast('Prompt estruturado copiado para a área de transferência.', 'success');
            });
        });

        document.getElementById('btn-ct-gemini-run').addEventListener('click', generateWithGeminiLocal);

        document.getElementById('btn-ct-save-fav').addEventListener('click', () => {
            const entry = {
                id: 'CT-' + Date.now(),
                date: C.todayISO(),
                ...currentComposedStory
            };
            savedStories.unshift(entry);
            saveStories();
            renderSavedStoriesLibrary();
            C.toast('Conto salvo na Biblioteca Local!', 'success');
        });

        document.getElementById('btn-ct-open-amber').addEventListener('click', () => openAmberNightReader(currentComposedStory));

        // Controles do Overlay de Leitura Noturna Âmbar
        const btnCloseAmber = document.getElementById('btn-amber-close');
        const btnFontUp = document.getElementById('btn-amber-font-up');
        const btnFontDown = document.getElementById('btn-amber-font-down');

        if (btnCloseAmber) btnCloseAmber.addEventListener('click', closeAmberNightReader);
        if (btnFontUp) {
            btnFontUp.addEventListener('click', () => {
                amberFontSizeRem = Math.min(2.0, amberFontSizeRem + 0.15);
                document.getElementById('amber-reader-body').style.fontSize = `${amberFontSizeRem}rem`;
            });
        }
        if (btnFontDown) {
            btnFontDown.addEventListener('click', () => {
                amberFontSizeRem = Math.max(0.95, amberFontSizeRem - 0.15);
                document.getElementById('amber-reader-body').style.fontSize = `${amberFontSizeRem}rem`;
            });
        }

        // Paletas Térmicas Low-Blue-Light
        document.querySelectorAll('[data-amber-theme]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const themeKey = btn.getAttribute('data-amber-theme');
                applyAmberThermalPalette(themeKey);
            });
        });

        // Áudio Relaxante Pré-Sono Web Audio
        const btnAudioToggle = document.getElementById('btn-audio-toggle');
        const audioModeSelect = document.getElementById('audio-mode-select');
        const audioVolSlider = document.getElementById('audio-volume-slider');

        if (btnAudioToggle) {
            btnAudioToggle.addEventListener('click', () => {
                if (isRelaxAudioPlaying) {
                    stopRelaxationAudio();
                } else {
                    const mode = audioModeSelect ? audioModeSelect.value : 'brown';
                    startRelaxationAudio(mode);
                }
            });
        }

        if (audioModeSelect) {
            audioModeSelect.addEventListener('change', () => {
                if (isRelaxAudioPlaying) {
                    startRelaxationAudio(audioModeSelect.value);
                }
            });
        }

        if (audioVolSlider) {
            audioVolSlider.addEventListener('input', (e) => {
                setRelaxationVolume(parseInt(e.target.value, 10));
            });
        }
    }

    function init() {
        loadDesfusaoHistory();
        mountDesfusaoShell();
        if (global.VaultTabContos && typeof global.VaultTabContos.init === 'function') {
            global.VaultTabContos.init();
        } else {
            loadStories();
            mountContosShell();
        }

        window.addEventListener('vault:restored', () => {
            loadDesfusaoHistory();
            mountDesfusaoShell();
            if (global.VaultTabContos && typeof global.VaultTabContos.init === 'function') {
                global.VaultTabContos.init();
            } else {
                loadStories();
                mountContosShell();
            }
            global.VaultCore.refreshIcons();
        });
    }

    global.VaultTabDesfusaoContos = { init };
    global.VaultTabDesfusao = { init: () => { loadDesfusaoHistory(); mountDesfusaoShell(); } };
})(window);
