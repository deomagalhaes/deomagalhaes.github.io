/**
 * NEXUS VAULT — Aba 1: Gestão Fitotécnica de Bonsai (Capacidade: +100 Plantas)
 * Controle de Adubação, Transplante/Raiz, Substrato, Bancadas e Operação em Lote Mobile One-Handed
 */
(function (global) {
    'use strict';

    const SPECIES_DICT = [
        { popular: 'Jabuticabeira Sabará', scientific: 'Plinia cauliflora' },
        { popular: 'Caliandra Rosa', scientific: 'Calliandra brevipes' },
        { popular: 'Caliandra Vermelha', scientific: 'Calliandra tweedii' },
        { popular: 'Pitangueira', scientific: 'Eugenia uniflora' },
        { popular: 'Junípero Shimpaku', scientific: 'Juniperus chinensis' },
        { popular: 'Junípero Procumbens', scientific: 'Juniperus procumbens nana' },
        { popular: 'Acer Palmatum', scientific: 'Acer palmatum' },
        { popular: 'Acer Burgeriano (Tridente)', scientific: 'Acer buergerianum' },
        { popular: 'Bougainvillea (Primavera)', scientific: 'Bougainvillea glabra' },
        { popular: 'Ficus Tiger Bark', scientific: 'Ficus microcarpa' },
        { popular: 'Ulmus (Olmo Chinês)', scientific: 'Ulmus parvifolia' },
        { popular: 'Azaleia Satsuki', scientific: 'Rhododendron indicum' },
        { popular: 'Piracanta', scientific: 'Pyracantha coccinea' },
        { popular: 'Serissa', scientific: 'Serissa foetida' },
        { popular: 'Cerejeira do Rio Grande', scientific: 'Eugenia involucrata' },
        { popular: 'Araçá Amarelo', scientific: 'Psidium cattleianum' },
        { popular: 'Ipê-Amarelo', scientific: 'Handroanthus albus' },
        { popular: 'Amoreira', scientific: 'Morus nigra' },
        { popular: 'Romãzeira Anã', scientific: 'Punica granatum nana' },
        { popular: 'Pinheiro Negro', scientific: 'Pinus thunbergii' }
    ];

    const SUBSTRATE_PRESETS = [
        '60% Caqueira / 30% Pinus / 10% Pedrisco',
        '70% Caqueira / 20% Casca Pinus / 10% Carvão',
        '50% Akadama / 30% Púmice / 20% Rocha Vulcânica',
        '50% Caqueira / 40% Turfa Fibrosa / 10% Areia Grossa'
    ];

    const STAGES = ['Muda', 'Pré-bonsai', 'Bonsai', 'Yamadori'];
    const POTS = ['Cerâmica', 'Treino', 'Escorredor/Chão', 'Laje'];

    let plants = [];
    let selectedIds = new Set();
    let filters = {
        search: '',
        species: 'ALL',
        bench: 'ALL',
        stage: 'ALL',
        statusMode: 'ALL', // ALL | OVERDUE | FERT_OVERDUE | REPOT_OVERDUE | NEXT_7D
        sortBy: 'URGENCY'  // URGENCY | ID | SPECIES | BENCH
    };
    let editingId = null;

    function createInitialPlants() {
        const C = global.VaultCore;
        const t = C.todayISO();
        return [
            {
                id: 'B-001',
                popularName: 'Jabuticabeira Sabará',
                scientificName: 'Plinia cauliflora',
                bench: 'Sol Pleno A',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '60% Caqueira / 30% Pinus / 10% Pedrisco',
                lastFertilization: C.addDaysISO(t, -36),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -18),
                repotCycleMonths: 24,
                lastStyling: C.addDaysISO(t, -75),
                nextInterventionDate: C.addDaysISO(t, 4),
                nextInterventionType: 'Poda de limpeza interna + Biogold',
                notes: 'Tronco descascando uniforme; manter rega abundante no verão.',
                logs: [
                    { date: C.addDaysISO(t, -36), type: 'Adubação (+30d)', detail: 'Osmocote 15-09-12 + Torta de mamona' },
                    { date: C.addDaysISO(t, -75), type: 'Estilização', detail: 'Seleção de patamares secundários' }
                ]
            },
            {
                id: 'B-002',
                popularName: 'Caliandra Rosa',
                scientificName: 'Calliandra brevipes',
                bench: 'Sol Pleno A',
                stage: 'Bonsai',
                pot: 'Cerâmica',
                substrate: '60% Caqueira / 30% Pinus / 10% Pedrisco',
                lastFertilization: C.addDaysISO(t, -12),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -25),
                repotCycleMonths: 24,
                lastStyling: C.addDaysISO(t, -40),
                nextInterventionDate: C.addDaysISO(t, 2),
                nextInterventionType: 'Transplante e poda de raízes finas',
                notes: 'Raízes já preenchendo drenagem do vaso esmaltado oval.',
                logs: [
                    { date: C.addDaysISO(t, -12), type: 'Adubação (+30d)', detail: 'Adubo orgânico líquido NPK balanceado' }
                ]
            },
            {
                id: 'B-003',
                popularName: 'Junípero Shimpaku',
                scientificName: 'Juniperus chinensis',
                bench: 'Sol Pleno B',
                stage: 'Pré-bonsai',
                pot: 'Treino',
                substrate: '50% Akadama / 30% Púmice / 20% Rocha Vulcânica',
                lastFertilization: C.addDaysISO(t, -50),
                fertCycleDays: 45,
                lastRepot: C.addMonthsISO(t, -14),
                repotCycleMonths: 36,
                lastStyling: C.addDaysISO(t, -60),
                nextInterventionDate: C.addDaysISO(t, 14),
                nextInterventionType: 'Revisão de arame de cobre (evitar marca)',
                notes: 'Shari principal tratado com calda sulfocálcica.',
                logs: [
                    { date: C.addDaysISO(t, -50), type: 'Adubação (+45d)', detail: 'Bokashi fermentado em sachês' },
                    { date: C.addDaysISO(t, -60), type: 'Estilização', detail: 'Aramação completa de ramos primários' }
                ]
            },
            {
                id: 'B-004',
                popularName: 'Pitangueira',
                scientificName: 'Eugenia uniflora',
                bench: 'Engorda / Chão',
                stage: 'Yamadori',
                pot: 'Escorredor/Chão',
                substrate: '70% Caqueira / 20% Casca Pinus / 10% Carvão',
                lastFertilization: C.addDaysISO(t, -18),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -10),
                repotCycleMonths: 18,
                lastStyling: C.addDaysISO(t, -90),
                nextInterventionDate: C.addDaysISO(t, 20),
                nextInterventionType: 'Seleção de brotações de sacrifício',
                notes: 'Nebari de 14 cm em consolidação no escorredor.',
                logs: [
                    { date: C.addDaysISO(t, -18), type: 'Adubação (+30d)', detail: 'Adubação rica em nitrogênio para engorda' }
                ]
            },
            {
                id: 'B-005',
                popularName: 'Acer Burgeriano (Tridente)',
                scientificName: 'Acer buergerianum',
                bench: 'Meia-Sombra 50%',
                stage: 'Bonsai',
                pot: 'Laje',
                substrate: '50% Akadama / 30% Púmice / 20% Rocha Vulcânica',
                lastFertilization: C.addDaysISO(t, -8),
                fertCycleDays: 45,
                lastRepot: C.addMonthsISO(t, -13),
                repotCycleMonths: 12,
                lastStyling: C.addDaysISO(t, -30),
                nextInterventionDate: C.addDaysISO(t, 5),
                nextInterventionType: 'Pinçagem de entrenós curtos',
                notes: 'Bosque de 5 troncos sobre laje de ardósia.',
                logs: [
                    { date: C.addDaysISO(t, -8), type: 'Adubação (+45d)', detail: 'Pellets orgânicos de liberação lenta' }
                ]
            },
            {
                id: 'B-006',
                popularName: 'Bougainvillea (Primavera)',
                scientificName: 'Bougainvillea glabra',
                bench: 'Sol Pleno B',
                stage: 'Muda',
                pot: 'Treino',
                substrate: '60% Caqueira / 30% Pinus / 10% Pedrisco',
                lastFertilization: C.addDaysISO(t, -5),
                fertCycleDays: 30,
                lastRepot: C.addMonthsISO(t, -4),
                repotCycleMonths: 12,
                lastStyling: C.addDaysISO(t, -25),
                nextInterventionDate: C.addDaysISO(t, 25),
                nextInterventionType: 'Movimento inicial de tronco com arame alumínio',
                notes: 'Estaca lenhosa com ótima resposta radicular.',
                logs: [
                    { date: C.addDaysISO(t, -5), type: 'Adubação (+30d)', detail: 'Forth Bonsai diluído metade da dose' }
                ]
            }
        ];
    }

    function normalizePlant(p, idx) {
        const C = global.VaultCore;
        const logs = Array.isArray(p.logs) ? p.logs : (Array.isArray(p.history) ? p.history : []);
        return {
            id: String(p.id || `B-${String(idx + 1).padStart(3, '0')}`).trim(),
            popularName: String(p.popularName || 'Espécie sem nome').trim(),
            scientificName: String(p.scientificName || '').trim(),
            bench: String(p.bench || 'Geral').trim(),
            stage: STAGES.includes(p.stage) ? p.stage : 'Pré-bonsai',
            pot: POTS.includes(p.pot) ? p.pot : 'Treino',
            substrate: String(p.substrate || SUBSTRATE_PRESETS[0]).trim(),
            lastFertilization: p.lastFertilization || C.todayISO(),
            fertCycleDays: Number(p.fertCycleDays) || 30,
            lastRepot: p.lastRepot || C.todayISO(),
            repotCycleMonths: Number(p.repotCycleMonths) || 24,
            lastStyling: p.lastStyling || '',
            nextInterventionDate: p.nextInterventionDate || '',
            nextInterventionType: String(p.nextInterventionType || p.nextInterventionNote || '').trim(),
            notes: String(p.notes || '').trim(),
            logs
        };
    }

    function loadData() {
        const C = global.VaultCore;
        const raw = localStorage.getItem(C.STORAGE_KEYS.BONSAI);
        if (raw === null) {
            plants = createInitialPlants();
            saveData(false);
        } else {
            const parsed = C.store.get(C.STORAGE_KEYS.BONSAI, []);
            plants = Array.isArray(parsed) ? parsed.map(normalizePlant) : [];
        }
        // Remove seleções órfãs
        const validSet = new Set(plants.map((p) => p.id));
        selectedIds.forEach((id) => {
            if (!validSet.has(id)) selectedIds.delete(id);
        });
    }

    function saveData(notify = false) {
        const C = global.VaultCore;
        C.store.set(C.STORAGE_KEYS.BONSAI, plants);
        if (notify) C.toast('Acervo de Bonsai salvo localmente.', 'success', 2000);
    }

    function computePlantMetrics(p) {
        const C = global.VaultCore;
        const nextFertIso = C.addDaysISO(p.lastFertilization, p.fertCycleDays);
        const fertDiff = C.daysDiffFromToday(nextFertIso);

        const nextRepotIso = C.addMonthsISO(p.lastRepot, p.repotCycleMonths);
        const repotDiff = C.daysDiffFromToday(nextRepotIso);

        const customDiff = p.nextInterventionDate ? C.daysDiffFromToday(p.nextInterventionDate) : null;

        const isFertOverdue = fertDiff !== null && fertDiff < 0;
        const isRepotOverdue = repotDiff !== null && repotDiff < 0;
        const isAnyOverdue = isFertOverdue || isRepotOverdue || (customDiff !== null && customDiff < 0);

        const isDue7d =
            (fertDiff !== null && fertDiff >= 0 && fertDiff <= 7) ||
            (repotDiff !== null && repotDiff >= 0 && repotDiff <= 7) ||
            (customDiff !== null && customDiff >= 0 && customDiff <= 7);

        const urgencyScore = Math.min(
            fertDiff ?? 9999,
            repotDiff ?? 9999,
            customDiff ?? 9999
        );

        return {
            nextFertIso,
            fertDiff,
            nextRepotIso,
            repotDiff,
            customDiff,
            isFertOverdue,
            isRepotOverdue,
            isAnyOverdue,
            isDue7d,
            urgencyScore
        };
    }

    function generateNextId() {
        let maxNum = 0;
        plants.forEach((p) => {
            const m = /^B-(\d+)$/i.exec(p.id);
            if (m) {
                const n = parseInt(m[1], 10);
                if (n > maxNum) maxNum = n;
            }
        });
        return `B-${String(maxNum + 1).padStart(3, '0')}`;
    }

    function getFilteredPlants() {
        const q = filters.search.trim().toLowerCase();
        const enriched = plants.map((p) => ({ plant: p, m: computePlantMetrics(p) }));

        const filtered = enriched.filter(({ plant: p, m }) => {
            if (filters.species !== 'ALL' && p.popularName !== filters.species) return false;
            if (filters.bench !== 'ALL' && p.bench !== filters.bench) return false;
            if (filters.stage !== 'ALL' && p.stage !== filters.stage) return false;

            if (filters.statusMode === 'OVERDUE' && !(m.isFertOverdue || m.isRepotOverdue)) return false;
            if (filters.statusMode === 'FERT_OVERDUE' && !m.isFertOverdue) return false;
            if (filters.statusMode === 'REPOT_OVERDUE' && !m.isRepotOverdue) return false;
            if (filters.statusMode === 'NEXT_7D' && !m.isDue7d) return false;

            if (q) {
                const hay = `${p.id} ${p.popularName} ${p.scientificName} ${p.bench} ${p.substrate} ${p.nextInterventionType} ${p.notes}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });

        filtered.sort((a, b) => {
            if (filters.sortBy === 'ID') return a.plant.id.localeCompare(b.plant.id, 'pt-BR', { numeric: true });
            if (filters.sortBy === 'SPECIES') return a.plant.popularName.localeCompare(b.plant.popularName, 'pt-BR');
            if (filters.sortBy === 'BENCH') return a.plant.bench.localeCompare(b.plant.bench, 'pt-BR');
            return a.m.urgencyScore - b.m.urgencyScore;
        });

        return filtered;
    }

    // =========================================================================
    // AÇÕES EM LOTE (BATCH ACTIONS) E MANEJO RÁPIDO
    // =========================================================================
    function applyBatchFertilization(cycleDays) {
        if (selectedIds.size === 0) return;
        const C = global.VaultCore;
        const today = C.todayISO();
        let count = 0;

        plants.forEach((p) => {
            if (selectedIds.has(p.id)) {
                p.lastFertilization = today;
                p.fertCycleDays = cycleDays;
                const nextDt = C.addDaysISO(today, cycleDays);
                p.logs.unshift({
                    date: today,
                    type: `Adubação (+${cycleDays}d)`,
                    detail: `Lote registrado • Próxima prevista em ${C.formatDateBR(nextDt)}`
                });
                count++;
            }
        });

        saveData(false);
        renderAll();
        C.toast(`Adubação (+${cycleDays} dias) registrada em ${count} planta(s)!`, 'success');
    }

    function applyBatchRepot() {
        if (selectedIds.size === 0) return;
        const C = global.VaultCore;
        const today = C.todayISO();
        let count = 0;

        plants.forEach((p) => {
            if (selectedIds.has(p.id)) {
                p.lastRepot = today;
                const nextDt = C.addMonthsISO(today, p.repotCycleMonths || 24);
                p.logs.unshift({
                    date: today,
                    type: 'Transplante / Raiz',
                    detail: `Transplante registrado em lote • Próximo ciclo em ${C.formatDateBR(nextDt)}`
                });
                count++;
            }
        });

        saveData(false);
        renderAll();
        C.toast(`Transplante registrado hoje em ${count} planta(s)!`, 'success');
    }

    function applyBatchSchedule(dateIso, typeText) {
        if (selectedIds.size === 0 || !dateIso) return;
        const C = global.VaultCore;
        const today = C.todayISO();
        let count = 0;

        plants.forEach((p) => {
            if (selectedIds.has(p.id)) {
                p.nextInterventionDate = dateIso;
                p.nextInterventionType = typeText || 'Manejo programado';
                p.logs.unshift({
                    date: today,
                    type: 'Agendamento',
                    detail: `Agendado para ${C.formatDateBR(dateIso)}: ${p.nextInterventionType}`
                });
                count++;
            }
        });

        saveData(false);
        renderAll();
        C.toast(`Intervenção agendada para ${count} planta(s).`, 'success');
    }

    function deleteSelectedBatch() {
        if (selectedIds.size === 0) return;
        const ok = window.confirm(`Deseja excluir permanentemente ${selectedIds.size} planta(s) selecionada(s)?`);
        if (!ok) return;
        const removed = selectedIds.size;
        plants = plants.filter((p) => !selectedIds.has(p.id));
        selectedIds.clear();
        saveData(false);
        renderAll();
        global.VaultCore.toast(`${removed} planta(s) removida(s) do acervo.`, 'warning');
    }

    function exportBonsaiCSV() {
        const C = global.VaultCore;
        const targetList = selectedIds.size > 0
            ? plants.filter((p) => selectedIds.has(p.id)).map((p) => ({ plant: p, m: computePlantMetrics(p) }))
            : getFilteredPlants();

        const headers = [
            'ID', 'Nome Popular', 'Nome Científico', 'Bancada/Setor', 'Estágio', 'Vaso', 'Substrato',
            'Última Adubação', 'Ciclo Adubação (d)', 'Próx. Adubação', 'Saldo Adubação (d)',
            'Último Transplante', 'Ciclo Transplante (m)', 'Próx. Transplante', 'Última Estilização',
            'Próx. Intervenção', 'Tipo Intervenção', 'Observações'
        ];

        const rows = targetList.map(({ plant: p, m }) => [
            p.id, p.popularName, p.scientificName, p.bench, p.stage, p.pot, p.substrate,
            p.lastFertilization, p.fertCycleDays, m.nextFertIso, m.fertDiff,
            p.lastRepot, p.repotCycleMonths, m.nextRepotIso, p.lastStyling,
            p.nextInterventionDate, p.nextInterventionType, p.notes
        ]);

        C.exportCSV(`bonsai-acervo-${C.todayISO()}.csv`, headers, rows);
        C.toast(`Exportado CSV com ${rows.length} planta(s).`, 'success');
    }

    function clonePlantBatch(sourcePlant, copies) {
        const C = global.VaultCore;
        const qty = Math.max(1, Math.min(100, parseInt(copies, 10) || 1));
        const today = C.todayISO();
        for (let i = 0; i < qty; i++) {
            const newId = generateNextId();
            plants.push({
                ...JSON.parse(JSON.stringify(sourcePlant)),
                id: newId,
                logs: [
                    {
                        date: today,
                        type: 'Cadastro em Lote',
                        detail: `Clonado a partir de ${sourcePlant.id} (${sourcePlant.popularName})`
                    }
                ]
            });
        }
        saveData(false);
        renderAll();
        C.toast(`${qty} muda(s)/exemplar(es) clonados com IDs sequenciais!`, 'success');
    }

    // =========================================================================
    // RENDERIZAÇÃO DE INTERFACE E SHELL DA ABA 1
    // =========================================================================
    function formatStatusBadge(daysDiff, labelPrefix) {
        if (daysDiff === null || isNaN(daysDiff)) {
            return `<span class="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-400">—</span>`;
        }
        if (daysDiff < 0) {
            return `<span class="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">${labelPrefix ? labelPrefix + ': ' : ''}${Math.abs(daysDiff)}d atraso</span>`;
        }
        if (daysDiff === 0) {
            return `<span class="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">${labelPrefix ? labelPrefix + ': ' : ''}HOJE</span>`;
        }
        if (daysDiff <= 7) {
            return `<span class="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-500/15 text-amber-200 border border-amber-500/30">${labelPrefix ? labelPrefix + ': ' : ''}em ${daysDiff}d</span>`;
        }
        return `<span class="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">${labelPrefix ? labelPrefix + ': ' : ''}+${daysDiff}d</span>`;
    }

    function stageColorClass(stage) {
        switch (stage) {
            case 'Bonsai': return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
            case 'Pré-bonsai': return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
            case 'Yamadori': return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
            default: return 'bg-slate-700/50 text-slate-300 border-slate-600';
        }
    }

    function mountShell() {
        const panel = document.getElementById('tab-panel-bonsai');
        if (!panel) return;

        panel.innerHTML = `
            <div class="space-y-5 pb-28">
                <!-- Cabeçalho Técnico + Ações Principais -->
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-[#0f172a] border border-[#1e293b] rounded-xl p-4">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Módulo Fitotécnico</span>
                            <span class="text-xs font-mono text-slate-400">Alta Densidade • +100 Exemplares</span>
                        </div>
                        <h2 class="text-lg sm:text-xl font-bold text-slate-100 mt-1">Gestão de Acervo de Bonsai, Ciclos Nutricionais e Bancadas</h2>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                        <button type="button" id="btn-bonsai-new" class="min-h-[44px] px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-sm flex items-center gap-2 transition">
                            <i data-lucide="plus-circle" class="w-4 h-4"></i>
                            <span>Nova Planta</span>
                        </button>
                        <button type="button" id="btn-bonsai-export-csv" class="min-h-[44px] px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium flex items-center gap-2 transition">
                            <i data-lucide="file-spreadsheet" class="w-4 h-4 text-cyan-400"></i>
                            <span>Exportar CSV</span>
                        </button>
                    </div>
                </div>

                <!-- 4 KPIs Interativos em Tempo Real -->
                <div id="bonsai-kpi-grid" class="grid grid-cols-2 lg:grid-cols-4 gap-3"></div>

                <!-- Barra de Busca Instantânea + Filtros Combináveis -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div class="md:col-span-4 relative">
                            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none"></i>
                            <input type="text" id="bonsai-search" placeholder="Buscar ID (B-001), espécie, substrato, nota..."
                                class="w-full min-h-[44px] pl-10 pr-3 py-2 rounded-lg bg-[#090d16] border border-[#1e293b] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500">
                        </div>
                        <div class="md:col-span-3">
                            <select id="bonsai-filter-species" aria-label="Filtrar por espécie"
                                class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-[#1e293b] text-sm text-slate-200 focus:outline-none focus:border-cyan-500">
                                <option value="ALL">Todas as Espécies</option>
                            </select>
                        </div>
                        <div class="md:col-span-2">
                            <select id="bonsai-filter-bench" aria-label="Filtrar por bancada"
                                class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-[#1e293b] text-sm text-slate-200 focus:outline-none focus:border-cyan-500">
                                <option value="ALL">Todas Bancadas</option>
                            </select>
                        </div>
                        <div class="md:col-span-3 flex gap-2">
                            <select id="bonsai-filter-stage" aria-label="Filtrar por estágio"
                                class="w-1/2 min-h-[44px] px-2.5 py-2 rounded-lg bg-[#090d16] border border-[#1e293b] text-sm text-slate-200 focus:outline-none focus:border-cyan-500">
                                <option value="ALL">Estágio: Todos</option>
                                <option value="Muda">Muda</option>
                                <option value="Pré-bonsai">Pré-bonsai</option>
                                <option value="Bonsai">Bonsai</option>
                                <option value="Yamadori">Yamadori</option>
                            </select>
                            <select id="bonsai-sort-by" aria-label="Ordenar por"
                                class="w-1/2 min-h-[44px] px-2.5 py-2 rounded-lg bg-[#090d16] border border-[#1e293b] text-sm text-slate-200 focus:outline-none focus:border-cyan-500">
                                <option value="URGENCY">Ordem: Urgência</option>
                                <option value="ID">Ordem: Código ID</option>
                                <option value="SPECIES">Ordem: Espécie</option>
                                <option value="BENCH">Ordem: Bancada</option>
                            </select>
                        </div>
                    </div>

                    <!-- Chips Rápidos de Filtro + Seleção de Lote Mobile -->
                    <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                        <div class="flex flex-wrap items-center gap-2">
                            <button type="button" data-bonsai-status-chip="ALL" class="min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold border transition">
                                Todos
                            </button>
                            <button type="button" data-bonsai-status-chip="OVERDUE" class="min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5">
                                <i data-lucide="flame" class="w-3.5 h-3.5 text-rose-400"></i>
                                <span>Atrasados (Adubação / Transplante)</span>
                            </button>
                            <button type="button" data-bonsai-status-chip="NEXT_7D" class="min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5">
                                <i data-lucide="calendar-clock" class="w-3.5 h-3.5 text-amber-400"></i>
                                <span>Próximos 7 Dias</span>
                            </button>
                        </div>

                        <div class="flex flex-wrap items-center gap-2">
                            <button type="button" id="btn-bonsai-select-visible" class="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-cyan-300 flex items-center gap-1.5">
                                <i data-lucide="check-square" class="w-3.5 h-3.5"></i>
                                <span>Selecionar Visíveis</span>
                            </button>
                            <button type="button" id="btn-bonsai-clear-sel" class="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-400">
                                Limpar Seleção
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Lista / Tabela Responsiva de Plantas -->
                <div id="bonsai-list-container" class="space-y-2"></div>

                <!-- Barra Flutuante de Ação em Lote (Thumb-Friendly One-Handed Smartphone) -->
                <div id="bonsai-batch-bar" class="hidden fixed bottom-16 md:bottom-4 left-3 right-3 md:left-6 md:right-6 z-40 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/50 rounded-2xl p-3 shadow-2xl">
                    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div class="flex items-center justify-between lg:justify-start gap-3">
                            <span id="bonsai-batch-count" class="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-mono text-xs font-bold">0 selecionadas</span>
                            <span class="text-xs text-slate-400 hidden sm:inline">Manejo instantâneo com registro automático no histórico individual</span>
                        </div>
                        <div class="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
                            <button type="button" id="btn-batch-fert-30" class="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition">
                                <i data-lucide="sprout" class="w-4 h-4"></i>
                                <span>Adubação Hoje (+30d)</span>
                            </button>
                            <button type="button" id="btn-batch-fert-45" class="min-h-[44px] px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition">
                                <i data-lucide="leaf" class="w-4 h-4"></i>
                                <span>Adubação Hoje (+45d)</span>
                            </button>
                            <button type="button" id="btn-batch-repot" class="min-h-[44px] px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition">
                                <i data-lucide="layers" class="w-4 h-4"></i>
                                <span>Transplante Hoje</span>
                            </button>
                            <button type="button" id="btn-batch-schedule-toggle" class="min-h-[44px] px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition">
                                <i data-lucide="calendar-plus" class="w-4 h-4"></i>
                                <span>Agendar Lote</span>
                            </button>
                            <button type="button" id="btn-batch-delete" class="min-h-[44px] px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-semibold text-xs flex items-center justify-center gap-1.5 col-span-2 sm:col-span-1 transition">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                <span>Excluir</span>
                            </button>
                        </div>
                    </div>
                    <!-- Subbarra expansível de agendamento em lote -->
                    <div id="bonsai-batch-schedule-box" class="hidden mt-3 pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
                        <input type="date" id="batch-sched-date" class="min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-xs font-mono text-slate-100">
                        <input type="text" id="batch-sched-type" placeholder="Ex.: Desfolha parcial, Aramação, Calda sulfocálcica..."
                            class="flex-1 min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-slate-100">
                        <button type="button" id="btn-batch-sched-apply" class="min-h-[44px] px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs">
                            Confirmar Agendamento
                        </button>
                    </div>
                </div>
            </div>

            <!-- Modal de Cadastro / Edição / Clonagem de Lote / Histórico -->
            <div id="bonsai-modal" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl">
                    <div class="sticky top-0 z-10 bg-[#0f172a]/95 backdrop-blur border-b border-[#1e293b] px-5 py-4 flex items-center justify-between">
                        <div>
                            <h3 id="bonsai-modal-title" class="text-base sm:text-lg font-bold text-slate-100">Ficha Fitotécnica da Planta</h3>
                            <p class="text-xs text-slate-400">Campos integrados ao motor de alertas e histórico individual</p>
                        </div>
                        <button type="button" id="btn-bonsai-modal-close" class="min-h-[40px] min-w-[40px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <form id="bonsai-form" class="p-5 space-y-4">
                        <datalist id="bonsai-species-datalist">
                            ${SPECIES_DICT.map((s) => `<option value="${s.popular}">${s.scientific}</option>`).join('')}
                        </datalist>

                        <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
                            <div class="sm:col-span-3">
                                <label class="block text-xs font-mono text-slate-400 mb-1">Código ID *</label>
                                <input type="text" id="bf-id" required class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-cyan-300">
                            </div>
                            <div class="sm:col-span-5">
                                <label class="block text-xs font-mono text-slate-400 mb-1">Espécie (Nome Popular) *</label>
                                <input type="text" id="bf-popular" list="bonsai-species-datalist" required placeholder="Ex.: Jabuticabeira Sabará"
                                    class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-sm text-slate-100">
                            </div>
                            <div class="sm:col-span-4">
                                <label class="block text-xs font-mono text-slate-400 mb-1">Nome Científico</label>
                                <input type="text" id="bf-scientific" placeholder="Ex.: Plinia cauliflora"
                                    class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-sm italic text-slate-300">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label class="block text-xs font-mono text-slate-400 mb-1">Bancada / Setor *</label>
                                <input type="text" id="bf-bench" required placeholder="Ex.: Sol Pleno A"
                                    class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-sm text-slate-100">
                            </div>
                            <div>
                                <label class="block text-xs font-mono text-slate-400 mb-1">Estágio Evolutivo</label>
                                <select id="bf-stage" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-sm text-slate-100">
                                    ${STAGES.map((st) => `<option value="${st}">${st}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-mono text-slate-400 mb-1">Tipo de Vaso</label>
                                <select id="bf-pot" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-sm text-slate-100">
                                    ${POTS.map((pt) => `<option value="${pt}">${pt}</option>`).join('')}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-mono text-slate-400 mb-1">Composição de Substrato</label>
                            <input type="text" id="bf-substrate" placeholder="Ex.: 60% Caqueira / 30% Pinus / 10% Pedrisco"
                                class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-sm text-slate-100">
                            <div class="flex flex-wrap gap-1.5 mt-1.5">
                                ${SUBSTRATE_PRESETS.map((pr) => `<button type="button" data-sub-preset="${pr}" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700">${pr}</button>`).join('')}
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
                            <div>
                                <label class="block text-xs font-mono text-slate-400 mb-1">Última Adubação</label>
                                <input type="date" id="bf-last-fert" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-100">
                            </div>
                            <div>
                                <label class="block text-xs font-mono text-slate-400 mb-1">Ciclo Adubação</label>
                                <select id="bf-fert-cycle" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-100">
                                    <option value="30">A cada 30 dias</option>
                                    <option value="45">A cada 45 dias</option>
                                    <option value="15">A cada 15 dias (líquido)</option>
                                    <option value="60">A cada 60 dias (inverno)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-mono text-slate-400 mb-1">Último Transplante</label>
                                <input type="date" id="bf-last-repot" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-100">
                            </div>
                            <div>
                                <label class="block text-xs font-mono text-slate-400 mb-1">Ciclo Transplante</label>
                                <select id="bf-repot-cycle" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-100">
                                    <option value="12">12 meses (1 ano)</option>
                                    <option value="18">18 meses (1,5 ano)</option>
                                    <option value="24" selected>24 meses (2 anos)</option>
                                    <option value="36">36 meses (3 anos)</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label class="block text-xs font-mono text-slate-400 mb-1">Última Estilização / Arame</label>
                                <input type="date" id="bf-last-styling" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-100">
                            </div>
                            <div>
                                <label class="block text-xs font-mono text-slate-400 mb-1">Próxima Intervenção (Data)</label>
                                <input type="date" id="bf-next-date" class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-100">
                            </div>
                            <div>
                                <label class="block text-xs font-mono text-slate-400 mb-1">Tipo da Próxima Intervenção</label>
                                <input type="text" id="bf-next-type" placeholder="Ex.: Retirar arame de cobre"
                                    class="w-full min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-slate-100">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-mono text-slate-400 mb-1">Observações Fitotécnicas</label>
                            <textarea id="bf-notes" rows="2" placeholder="Vigor apical, evolução do nebari, pragas tratadas, vaso futuro..."
                                class="w-full px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-sm text-slate-100"></textarea>
                        </div>

                        <!-- Clonador Rápido de Lote de Mudas (Visível ao editar exemplar existente) -->
                        <div id="bonsai-clone-panel" class="hidden bg-slate-900/80 border border-cyan-500/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <p class="text-xs font-semibold text-cyan-300">Clonar Planta (Lote de Mudas / Estacas)</p>
                                <p class="text-[11px] text-slate-400">Cria cópias idênticas na mesma bancada/substrato com códigos sequenciais automáticos.</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <input type="number" id="bf-clone-qty" min="1" max="100" value="10"
                                    class="w-20 min-h-[40px] px-2.5 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-center text-slate-100">
                                <button type="button" id="btn-bf-clone-exec" class="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs whitespace-nowrap">
                                    Gerar Clones
                                </button>
                            </div>
                        </div>

                        <!-- Histórico de Manejos da Planta -->
                        <div id="bonsai-history-section" class="hidden border-t border-slate-800 pt-3 space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-mono uppercase tracking-wider text-slate-400">Histórico de Manejos Registrados</span>
                                <div class="flex gap-1.5">
                                    <input type="text" id="bf-quick-log-input" placeholder="Registrar manejo avulso hoje..."
                                        class="px-2.5 py-1 rounded bg-[#090d16] border border-slate-700 text-xs text-slate-200">
                                    <button type="button" id="btn-bf-add-log" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-emerald-300 border border-slate-700">+ Log</button>
                                </div>
                            </div>
                            <div id="bf-logs-list" class="max-h-36 overflow-y-auto space-y-1 pr-1"></div>
                        </div>

                        <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                            <button type="button" id="btn-bf-delete-single" class="hidden min-h-[44px] px-4 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                                Excluir Exemplar
                            </button>
                            <div class="flex items-center gap-2 ml-auto">
                                <button type="button" id="btn-bf-cancel" class="min-h-[44px] px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm">
                                    Cancelar
                                </button>
                                <button type="submit" class="min-h-[44px] px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-sm">
                                    Salvar Ficha
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;

        bindEvents();
    }

    function renderKPIs() {
        const grid = document.getElementById('bonsai-kpi-grid');
        if (!grid) return;

        let fertOverdue = 0;
        let repotOverdue = 0;
        let due7d = 0;
        const stageCounts = { Muda: 0, 'Pré-bonsai': 0, Bonsai: 0, Yamadori: 0 };

        plants.forEach((p) => {
            const m = computePlantMetrics(p);
            if (m.isFertOverdue) fertOverdue++;
            if (m.isRepotOverdue) repotOverdue++;
            if (m.isDue7d) due7d++;
            stageCounts[p.stage] = (stageCounts[p.stage] || 0) + 1;
        });

        grid.innerHTML = `
            <button type="button" data-kpi-filter="ALL" class="text-left bg-[#0f172a] hover:bg-slate-900 border ${filters.statusMode === 'ALL' ? 'border-cyan-500/60' : 'border-[#1e293b]'} rounded-xl p-3.5 transition">
                <div class="flex items-center justify-between text-xs text-slate-400">
                    <span>Total no Acervo</span>
                    <i data-lucide="trees" class="w-4 h-4 text-emerald-400"></i>
                </div>
                <div class="text-2xl font-mono font-bold text-slate-100 mt-1">${plants.length}</div>
                <div class="text-[11px] font-mono text-slate-400 mt-1 truncate">
                    ${stageCounts['Bonsai'] || 0} Bonsai • ${stageCounts['Pré-bonsai'] || 0} Pré • ${stageCounts['Muda'] || 0} Mudas
                </div>
            </button>

            <button type="button" data-kpi-filter="FERT_OVERDUE" class="text-left bg-[#0f172a] hover:bg-slate-900 border ${filters.statusMode === 'FERT_OVERDUE' ? 'border-rose-500' : 'border-[#1e293b]'} rounded-xl p-3.5 transition">
                <div class="flex items-center justify-between text-xs text-slate-400">
                    <span>Atrasadas Adubação</span>
                    <i data-lucide="sprout" class="w-4 h-4 ${fertOverdue > 0 ? 'text-rose-400' : 'text-slate-500'}"></i>
                </div>
                <div class="text-2xl font-mono font-bold ${fertOverdue > 0 ? 'text-rose-400' : 'text-emerald-400'} mt-1">${fertOverdue}</div>
                <div class="text-[11px] text-slate-400 mt-1">Clique para filtrar adubação vencida</div>
            </button>

            <button type="button" data-kpi-filter="REPOT_OVERDUE" class="text-left bg-[#0f172a] hover:bg-slate-900 border ${filters.statusMode === 'REPOT_OVERDUE' ? 'border-rose-500' : 'border-[#1e293b]'} rounded-xl p-3.5 transition">
                <div class="flex items-center justify-between text-xs text-slate-400">
                    <span>Atrasadas Transplante</span>
                    <i data-lucide="layers" class="w-4 h-4 ${repotOverdue > 0 ? 'text-rose-400' : 'text-slate-500'}"></i>
                </div>
                <div class="text-2xl font-mono font-bold ${repotOverdue > 0 ? 'text-rose-400' : 'text-emerald-400'} mt-1">${repotOverdue}</div>
                <div class="text-[11px] text-slate-400 mt-1">Ciclo radicular (12 a 36 meses)</div>
            </button>

            <button type="button" data-kpi-filter="NEXT_7D" class="text-left bg-[#0f172a] hover:bg-slate-900 border ${filters.statusMode === 'NEXT_7D' ? 'border-amber-500' : 'border-[#1e293b]'} rounded-xl p-3.5 transition">
                <div class="flex items-center justify-between text-xs text-slate-400">
                    <span>Intervenções (7 dias)</span>
                    <i data-lucide="bell-ring" class="w-4 h-4 text-amber-400"></i>
                </div>
                <div class="text-2xl font-mono font-bold text-amber-300 mt-1">${due7d}</div>
                <div class="text-[11px] text-slate-400 mt-1">Janela preventiva da semana</div>
            </button>
        `;

        grid.querySelectorAll('[data-kpi-filter]').forEach((btn) => {
            btn.addEventListener('click', () => {
                filters.statusMode = btn.getAttribute('data-kpi-filter');
                renderAll();
            });
        });
    }

    function syncFilterSelects() {
        const spSel = document.getElementById('bonsai-filter-species');
        const bnSel = document.getElementById('bonsai-filter-bench');
        const C = global.VaultCore;

        if (spSel) {
            const speciesSet = Array.from(new Set(plants.map((p) => p.popularName))).sort((a, b) => a.localeCompare(b, 'pt-BR'));
            if (filters.species !== 'ALL' && !speciesSet.includes(filters.species)) filters.species = 'ALL';
            spSel.innerHTML = `<option value="ALL">Todas as Espécies (${speciesSet.length})</option>` +
                speciesSet.map((s) => `<option value="${C.esc(s)}" ${filters.species === s ? 'selected' : ''}>${C.esc(s)}</option>`).join('');
        }

        if (bnSel) {
            const benchSet = Array.from(new Set(plants.map((p) => p.bench))).sort((a, b) => a.localeCompare(b, 'pt-BR'));
            if (filters.bench !== 'ALL' && !benchSet.includes(filters.bench)) filters.bench = 'ALL';
            bnSel.innerHTML = `<option value="ALL">Todas Bancadas (${benchSet.length})</option>` +
                benchSet.map((b) => `<option value="${C.esc(b)}" ${filters.bench === b ? 'selected' : ''}>${C.esc(b)}</option>`).join('');
        }

        document.querySelectorAll('[data-bonsai-status-chip]').forEach((chip) => {
            const code = chip.getAttribute('data-bonsai-status-chip');
            const active = filters.statusMode === code || (code === 'OVERDUE' && (filters.statusMode === 'FERT_OVERDUE' || filters.statusMode === 'REPOT_OVERDUE'));
            chip.className = active
                ? 'min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold border border-cyan-400 bg-cyan-500/20 text-cyan-200 flex items-center gap-1.5 transition'
                : 'min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition';
        });
    }

    function renderPlantList() {
        const container = document.getElementById('bonsai-list-container');
        if (!container) return;
        const C = global.VaultCore;
        const list = getFilteredPlants();

        if (list.length === 0) {
            container.innerHTML = `
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-8 text-center space-y-2">
                    <p class="text-sm font-semibold text-slate-300">Nenhuma planta encontrada para os filtros ativos.</p>
                    <p class="text-xs text-slate-500">Limpe os filtros ou cadastre um novo exemplar no acervo.</p>
                </div>
            `;
            updateBatchBar();
            return;
        }

        container.innerHTML = list.map(({ plant: p, m }) => {
            const checked = selectedIds.has(p.id);
            const borderCls = checked
                ? 'border-cyan-500 bg-cyan-950/20'
                : (m.isAnyOverdue ? 'border-rose-500/35 bg-[#0f172a]' : 'border-[#1e293b] bg-[#0f172a]');

            return `
                <div class="border ${borderCls} rounded-xl p-3 sm:px-4 sm:py-3 transition hover:border-slate-600 flex flex-col lg:flex-row lg:items-center gap-3">
                    <!-- Checkbox amplo (One-Handed Touch) + Identificação -->
                    <div class="flex items-start sm:items-center gap-3 lg:w-[32%] shrink-0">
                        <label class="min-w-[44px] min-h-[44px] -m-1 flex items-center justify-center cursor-pointer shrink-0" title="Selecionar ${C.esc(p.id)}">
                            <input type="checkbox" data-plant-check="${C.esc(p.id)}" ${checked ? 'checked' : ''}
                                class="w-5 h-5 rounded border-slate-600 bg-slate-900 text-cyan-500 focus:ring-cyan-500 cursor-pointer">
                        </label>
                        <div class="min-w-0 flex-1">
                            <div class="flex flex-wrap items-center gap-1.5">
                                <span class="font-mono text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded">${C.esc(p.id)}</span>
                                <span class="px-2 py-0.5 rounded text-[11px] font-medium border ${stageColorClass(p.stage)}">${C.esc(p.stage)}</span>
                                <span class="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">${C.esc(p.bench)}</span>
                            </div>
                            <div class="font-semibold text-sm sm:text-base text-slate-100 truncate mt-1">${C.esc(p.popularName)}</div>
                            <div class="text-xs italic text-slate-400 truncate">${C.esc(p.scientificName || p.pot)} • Vaso: ${C.esc(p.pot)}</div>
                        </div>
                    </div>

                    <!-- Indicadores Fitotécnicos (Adubação / Transplante / Substrato) -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1 text-xs">
                        <div class="bg-[#090d16]/80 border border-slate-800/90 rounded-lg p-2">
                            <div class="flex items-center justify-between gap-1">
                                <span class="text-[11px] text-slate-400">Adubação (${p.fertCycleDays}d)</span>
                                ${formatStatusBadge(m.fertDiff, '')}
                            </div>
                            <div class="font-mono text-[11px] text-slate-300 mt-1">Últ.: ${C.formatDateBR(p.lastFertilization)} → Próx.: ${C.formatDateBR(m.nextFertIso)}</div>
                        </div>

                        <div class="bg-[#090d16]/80 border border-slate-800/90 rounded-lg p-2">
                            <div class="flex items-center justify-between gap-1">
                                <span class="text-[11px] text-slate-400">Transplante (${p.repotCycleMonths}m)</span>
                                ${formatStatusBadge(m.repotDiff, '')}
                            </div>
                            <div class="font-mono text-[11px] text-slate-300 mt-1">Últ.: ${C.formatDateBR(p.lastRepot)} • ${C.esc(p.substrate.slice(0, 26))}${p.substrate.length > 26 ? '…' : ''}</div>
                        </div>

                        <div class="bg-[#090d16]/80 border border-slate-800/90 rounded-lg p-2">
                            <div class="flex items-center justify-between gap-1">
                                <span class="text-[11px] text-slate-400">Próx. Manejo</span>
                                ${p.nextInterventionDate ? formatStatusBadge(m.customDiff, '') : '<span class="text-[11px] font-mono text-slate-500">Livre</span>'}
                            </div>
                            <div class="text-[11px] text-slate-300 truncate mt-1" title="${C.esc(p.nextInterventionType || p.notes)}">
                                ${C.esc(p.nextInterventionType || p.notes || 'Sem pendência específica')}
                            </div>
                        </div>
                    </div>

                    <!-- Botões Rápidos Individuais (1-Tap Adubar + Editar) -->
                    <div class="flex items-center justify-end gap-1.5 shrink-0 pt-1 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                        <button type="button" data-quick-fert="${C.esc(p.id)}" title="Registrar Adubação Hoje (+${p.fertCycleDays}d)"
                            class="min-h-[42px] px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition">
                            <i data-lucide="sprout" class="w-3.5 h-3.5"></i>
                            <span>+${p.fertCycleDays}d</span>
                        </button>
                        <button type="button" data-edit-plant="${C.esc(p.id)}" title="Abrir Ficha Completa / Clonar / Histórico"
                            class="min-h-[42px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition">
                            <i data-lucide="sliders-horizontal" class="w-3.5 h-3.5 text-cyan-400"></i>
                            <span>Ficha</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Listeners dos itens renderizados
        container.querySelectorAll('[data-plant-check]').forEach((chk) => {
            chk.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-plant-check');
                if (e.target.checked) selectedIds.add(id);
                else selectedIds.delete(id);
                renderPlantList();
            });
        });

        container.querySelectorAll('[data-quick-fert]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-quick-fert');
                const target = plants.find((item) => item.id === id);
                if (!target) return;
                const today = C.todayISO();
                target.lastFertilization = today;
                target.logs.unshift({
                    date: today,
                    type: `Adubação (+${target.fertCycleDays}d)`,
                    detail: 'Adubação rápida individual registrada'
                });
                saveData(false);
                renderAll();
                C.toast(`${target.id} (${target.popularName}) adubada hoje (+${target.fertCycleDays}d).`, 'success', 2200);
            });
        });

        container.querySelectorAll('[data-edit-plant]').forEach((btn) => {
            btn.addEventListener('click', () => openModal(btn.getAttribute('data-edit-plant')));
        });

        updateBatchBar();
        C.refreshIcons(container);
    }

    function updateBatchBar() {
        const bar = document.getElementById('bonsai-batch-bar');
        const cnt = document.getElementById('bonsai-batch-count');
        if (!bar || !cnt) return;
        if (selectedIds.size > 0) {
            bar.classList.remove('hidden');
            cnt.textContent = `${selectedIds.size} selecionada${selectedIds.size > 1 ? 's' : ''}`;
        } else {
            bar.classList.add('hidden');
        }
    }

    function openModal(plantId) {
        const modal = document.getElementById('bonsai-modal');
        if (!modal) return;
        const C = global.VaultCore;
        editingId = plantId || null;
        const existing = editingId ? plants.find((p) => p.id === editingId) : null;

        document.getElementById('bonsai-modal-title').textContent = existing
            ? `Editar Exemplar ${existing.id} — ${existing.popularName}`
            : 'Cadastrar Nova Planta no Acervo';

        document.getElementById('bf-id').value = existing ? existing.id : generateNextId();
        document.getElementById('bf-popular').value = existing ? existing.popularName : '';
        document.getElementById('bf-scientific').value = existing ? existing.scientificName : '';
        document.getElementById('bf-bench').value = existing ? existing.bench : 'Sol Pleno A';
        document.getElementById('bf-stage').value = existing ? existing.stage : 'Pré-bonsai';
        document.getElementById('bf-pot').value = existing ? existing.pot : 'Treino';
        document.getElementById('bf-substrate').value = existing ? existing.substrate : SUBSTRATE_PRESETS[0];
        document.getElementById('bf-last-fert').value = existing ? existing.lastFertilization : C.todayISO();
        document.getElementById('bf-fert-cycle').value = String(existing ? existing.fertCycleDays : 30);
        document.getElementById('bf-last-repot').value = existing ? existing.lastRepot : C.todayISO();
        document.getElementById('bf-repot-cycle').value = String(existing ? existing.repotCycleMonths : 24);
        document.getElementById('bf-last-styling').value = existing ? existing.lastStyling : '';
        document.getElementById('bf-next-date').value = existing ? existing.nextInterventionDate : '';
        document.getElementById('bf-next-type').value = existing ? existing.nextInterventionType : '';
        document.getElementById('bf-notes').value = existing ? existing.notes : '';

        const clonePanel = document.getElementById('bonsai-clone-panel');
        const histSection = document.getElementById('bonsai-history-section');
        const delBtn = document.getElementById('btn-bf-delete-single');

        if (existing) {
            clonePanel.classList.remove('hidden');
            histSection.classList.remove('hidden');
            delBtn.classList.remove('hidden');
            renderModalLogs(existing);
        } else {
            clonePanel.classList.add('hidden');
            histSection.classList.add('hidden');
            delBtn.classList.add('hidden');
        }

        modal.classList.remove('hidden');
        C.refreshIcons(modal);
    }

    function renderModalLogs(plant) {
        const listEl = document.getElementById('bf-logs-list');
        if (!listEl) return;
        const C = global.VaultCore;
        if (!plant.logs || plant.logs.length === 0) {
            listEl.innerHTML = `<p class="text-xs text-slate-500 italic">Nenhum manejo registrado ainda.</p>`;
            return;
        }
        listEl.innerHTML = plant.logs.map((lg) => `
            <div class="flex items-center justify-between gap-2 text-xs bg-[#090d16] border border-slate-800 rounded px-2.5 py-1.5">
                <div>
                    <span class="font-mono text-cyan-400">${C.formatDateBR(lg.date)}</span>
                    <span class="font-semibold text-slate-200 ml-1.5">${C.esc(lg.type)}</span>
                    <span class="text-slate-400 ml-1">— ${C.esc(lg.detail)}</span>
                </div>
            </div>
        `).join('');
    }

    function closeModal() {
        const modal = document.getElementById('bonsai-modal');
        if (modal) modal.classList.add('hidden');
        editingId = null;
    }

    function bindEvents() {
        const C = global.VaultCore;

        document.getElementById('btn-bonsai-new').addEventListener('click', () => openModal(null));
        document.getElementById('btn-bonsai-export-csv').addEventListener('click', exportBonsaiCSV);

        document.getElementById('bonsai-search').addEventListener('input', (e) => {
            filters.search = e.target.value;
            renderPlantList();
        });

        document.getElementById('bonsai-filter-species').addEventListener('change', (e) => {
            filters.species = e.target.value;
            renderPlantList();
        });

        document.getElementById('bonsai-filter-bench').addEventListener('change', (e) => {
            filters.bench = e.target.value;
            renderPlantList();
        });

        document.getElementById('bonsai-filter-stage').addEventListener('change', (e) => {
            filters.stage = e.target.value;
            renderPlantList();
        });

        document.getElementById('bonsai-sort-by').addEventListener('change', (e) => {
            filters.sortBy = e.target.value;
            renderPlantList();
        });

        document.querySelectorAll('[data-bonsai-status-chip]').forEach((chip) => {
            chip.addEventListener('click', () => {
                filters.statusMode = chip.getAttribute('data-bonsai-status-chip');
                renderAll();
            });
        });

        document.getElementById('btn-bonsai-select-visible').addEventListener('click', () => {
            const visible = getFilteredPlants();
            visible.forEach(({ plant }) => selectedIds.add(plant.id));
            renderPlantList();
            C.toast(`${visible.length} planta(s) visível(is) selecionada(s).`, 'info', 2000);
        });

        document.getElementById('btn-bonsai-clear-sel').addEventListener('click', () => {
            selectedIds.clear();
            renderPlantList();
        });

        // Ações em lote
        document.getElementById('btn-batch-fert-30').addEventListener('click', () => applyBatchFertilization(30));
        document.getElementById('btn-batch-fert-45').addEventListener('click', () => applyBatchFertilization(45));
        document.getElementById('btn-batch-repot').addEventListener('click', applyBatchRepot);
        document.getElementById('btn-batch-delete').addEventListener('click', deleteSelectedBatch);

        const schedBox = document.getElementById('bonsai-batch-schedule-box');
        document.getElementById('btn-batch-schedule-toggle').addEventListener('click', () => {
            schedBox.classList.toggle('hidden');
            const dtIn = document.getElementById('batch-sched-date');
            if (!dtIn.value) dtIn.value = C.addDaysISO(C.todayISO(), 7);
        });

        document.getElementById('btn-batch-sched-apply').addEventListener('click', () => {
            const dt = document.getElementById('batch-sched-date').value;
            const tp = document.getElementById('batch-sched-type').value.trim();
            applyBatchSchedule(dt, tp);
            schedBox.classList.add('hidden');
        });

        // Modal e Autopreenchimento Botânico
        document.getElementById('btn-bonsai-modal-close').addEventListener('click', closeModal);
        document.getElementById('btn-bf-cancel').addEventListener('click', closeModal);

        document.getElementById('bf-popular').addEventListener('input', (e) => {
            const val = e.target.value.trim().toLowerCase();
            const found = SPECIES_DICT.find((s) => s.popular.toLowerCase() === val);
            const sciInput = document.getElementById('bf-scientific');
            if (found && !sciInput.value.trim()) {
                sciInput.value = found.scientific;
            }
        });

        document.querySelectorAll('[data-sub-preset]').forEach((btn) => {
            btn.addEventListener('click', () => {
                document.getElementById('bf-substrate').value = btn.getAttribute('data-sub-preset');
            });
        });

        document.getElementById('btn-bf-add-log').addEventListener('click', () => {
            if (!editingId) return;
            const target = plants.find((p) => p.id === editingId);
            const inp = document.getElementById('bf-quick-log-input');
            if (!target || !inp.value.trim()) return;
            target.logs.unshift({
                date: C.todayISO(),
                type: 'Manejo Técnico',
                detail: inp.value.trim()
            });
            inp.value = '';
            saveData(false);
            renderModalLogs(target);
        });

        document.getElementById('btn-bf-clone-exec').addEventListener('click', () => {
            if (!editingId) return;
            const src = plants.find((p) => p.id === editingId);
            const qty = document.getElementById('bf-clone-qty').value;
            if (!src) return;
            closeModal();
            clonePlantBatch(src, qty);
        });

        document.getElementById('btn-bf-delete-single').addEventListener('click', () => {
            if (!editingId) return;
            if (!window.confirm(`Excluir o exemplar ${editingId}?`)) return;
            plants = plants.filter((p) => p.id !== editingId);
            selectedIds.delete(editingId);
            saveData(false);
            closeModal();
            renderAll();
            C.toast('Exemplar excluído.', 'warning');
        });

        document.getElementById('bonsai-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const newId = document.getElementById('bf-id').value.trim();
            const conflict = plants.find((p) => p.id.toLowerCase() === newId.toLowerCase() && p.id !== editingId);
            if (conflict) {
                C.toast(`Já existe uma planta com o código ${newId}.`, 'error');
                return;
            }

            const existing = editingId ? plants.find((p) => p.id === editingId) : null;
            const record = normalizePlant({
                id: newId,
                popularName: document.getElementById('bf-popular').value,
                scientificName: document.getElementById('bf-scientific').value,
                bench: document.getElementById('bf-bench').value,
                stage: document.getElementById('bf-stage').value,
                pot: document.getElementById('bf-pot').value,
                substrate: document.getElementById('bf-substrate').value,
                lastFertilization: document.getElementById('bf-last-fert').value,
                fertCycleDays: Number(document.getElementById('bf-fert-cycle').value),
                lastRepot: document.getElementById('bf-last-repot').value,
                repotCycleMonths: Number(document.getElementById('bf-repot-cycle').value),
                lastStyling: document.getElementById('bf-last-styling').value,
                nextInterventionDate: document.getElementById('bf-next-date').value,
                nextInterventionType: document.getElementById('bf-next-type').value,
                notes: document.getElementById('bf-notes').value,
                logs: existing ? existing.logs : [{ date: C.todayISO(), type: 'Cadastro Inicial', detail: 'Exemplar incluído no acervo' }]
            }, plants.length);

            if (existing) {
                const idx = plants.findIndex((p) => p.id === editingId);
                plants[idx] = record;
            } else {
                plants.unshift(record);
            }

            saveData(true);
            closeModal();
            renderAll();
        });
    }

    function renderAll() {
        renderKPIs();
        syncFilterSelects();
        renderPlantList();
        global.VaultCore.refreshIcons();
    }

    function init() {
        mountShell();
        loadData();
        renderAll();

        window.addEventListener('vault:restored', () => {
            loadData();
            renderAll();
        });
    }

    global.VaultTabBonsai = { init, renderAll };
})(window);
