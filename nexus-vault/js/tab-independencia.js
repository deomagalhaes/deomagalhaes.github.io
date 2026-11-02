/**
 * NEXUS VAULT — Aba 5: Simulador de Independência Clínica vs. Renda Passiva
 * Motor atuarial de equivalência composta real, Compra de Liberdade por Aporte,
 * Detecção Exata de Crossovers (Custo Fixo / 50% / 100%), Gráfico SVG Interativo e Tabela Anual.
 */
(function (global) {
    'use strict';

    const DEFAULT_INPUTS = {
        weeklySessions: 16,
        weeksPerMonth: 4.2,
        indirectWeeklyHours: 6,
        avgTicket: 250,
        monthlyCosts: 2600,
        monthlyContribution: 4200,
        currentPatrimony: 120000,
        realAnnualReturn: 7.5,
        horizonYears: 15
    };

    let inputs = Object.assign({}, DEFAULT_INPUTS);
    let tableExpanded = false;
    let lastModel = null;

    function loadInputs() {
        const C = global.VaultCore;
        const saved = C.store.get(C.STORAGE_KEYS.INDEPENDENCIA, null);
        if (saved && typeof saved === 'object') {
            inputs = Object.assign({}, DEFAULT_INPUTS, saved);
        }
    }

    function saveInputs() {
        const C = global.VaultCore;
        C.store.set(C.STORAGE_KEYS.INDEPENDENCIA, inputs);
    }

    function formatMonthYearFromOffset(monthsFromNow) {
        if (monthsFromNow === null || monthsFromNow === undefined) return 'Acima de 50 anos';
        if (monthsFromNow <= 0) return 'Já atingido hoje!';
        const d = new Date();
        d.setMonth(d.getMonth() + monthsFromNow);
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const yrs = Math.floor(monthsFromNow / 12);
        const remM = monthsFromNow % 12;
        const durTxt = yrs > 0 ? `${yrs}a ${remM}m` : `${remM} meses`;
        return `${monthNames[d.getMonth()]}/${d.getFullYear()} (${durTxt})`;
    }

    function computeFinancialModel() {
        const wSessions = Math.max(0, Number(inputs.weeklySessions) || 0);
        const wPerMonth = Math.max(1, Number(inputs.weeksPerMonth) || 4.2);
        const indWeekly = Math.max(0, Number(inputs.indirectWeeklyHours) || 0);
        const ticket = Math.max(0, Number(inputs.avgTicket) || 0);
        const costs = Math.max(0, Number(inputs.monthlyCosts) || 0);
        const aporte = Math.max(0, Number(inputs.monthlyContribution) || 0);
        const initPatrimony = Math.max(0, Number(inputs.currentPatrimony) || 0);
        const annualRatePct = Math.max(0, Math.min(40, Number(inputs.realAnnualReturn) || 0));
        const horizonYears = Math.max(1, Math.min(30, parseInt(inputs.horizonYears, 10) || 15));

        const monthlySessions = wSessions * wPerMonth;
        const indirectMonthlyHours = indWeekly * wPerMonth;
        const totalEffectiveHours = monthlySessions + indirectMonthlyHours;

        const grossRevenue = monthlySessions * ticket;
        const netRevenue = Math.max(0, grossRevenue - costs);

        const netPerSession = monthlySessions > 0 ? (netRevenue / monthlySessions) : 0;
        const netEffectiveHourly = totalEffectiveHours > 0 ? (netRevenue / totalEffectiveHours) : 0;

        // Taxa mensal real equivalente composta: (1 + i_a)^(1/12) - 1
        const monthlyRate = annualRatePct > 0
            ? (Math.pow(1 + annualRatePct / 100, 1 / 12) - 1)
            : 0;

        // Compra de Liberdade por Aporte Único
        const passivePerSingleContribution = aporte * monthlyRate;
        const sessionsBoughtPerContribution = netPerSession > 0
            ? (passivePerSingleContribution / netPerSession)
            : 0;
        const effectiveHoursBoughtPerContribution = netEffectiveHourly > 0
            ? (passivePerSingleContribution / netEffectiveHourly)
            : 0;
        const contributionsForOneMonthlySession = passivePerSingleContribution > 0 && netPerSession > 0
            ? (netPerSession / passivePerSingleContribution)
            : null;

        // Cobertura atual pelo patrimônio já investido hoje
        const currentPassiveMonthly = initPatrimony * monthlyRate;
        const sessionsPaidToday = netPerSession > 0 ? (currentPassiveMonthly / netPerSession) : 0;
        const currentCoveragePct = netRevenue > 0 ? ((currentPassiveMonthly / netRevenue) * 100) : 0;

        // Simulação mês a mês até 600 meses (50 anos) para detecção exata dos 3 Crossovers
        const maxScanMonths = Math.max(horizonYears * 12, 600);
        let pat = initPatrimony;
        let totalContributed = initPatrimony;

        let crossCostMonth = (costs > 0 && currentPassiveMonthly >= costs) ? 0 : null;
        let crossHalfNetMonth = (netRevenue > 0 && currentPassiveMonthly >= netRevenue * 0.5) ? 0 : null;
        let crossFullNetMonth = (netRevenue > 0 && currentPassiveMonthly >= netRevenue) ? 0 : null;

        const yearlySeries = [{
            year: 0,
            month: 0,
            patrimony: initPatrimony,
            contributedTotal: initPatrimony,
            realInterestTotal: 0,
            passiveMonthly: currentPassiveMonthly,
            sessionsCovered: sessionsPaidToday,
            coveragePct: currentCoveragePct
        }];

        for (let m = 1; m <= maxScanMonths; m++) {
            const interest = pat * monthlyRate;
            pat = pat + interest + aporte;
            totalContributed += aporte;
            const passM = pat * monthlyRate;

            if (crossCostMonth === null && costs > 0 && passM >= costs) crossCostMonth = m;
            if (crossHalfNetMonth === null && netRevenue > 0 && passM >= netRevenue * 0.5) crossHalfNetMonth = m;
            if (crossFullNetMonth === null && netRevenue > 0 && passM >= netRevenue) crossFullNetMonth = m;

            if (m % 12 === 0 && (m / 12) <= horizonYears) {
                const yr = m / 12;
                yearlySeries.push({
                    year: yr,
                    month: m,
                    patrimony: pat,
                    contributedTotal: totalContributed,
                    realInterestTotal: pat - totalContributed,
                    passiveMonthly: passM,
                    sessionsCovered: netPerSession > 0 ? (passM / netPerSession) : 0,
                    coveragePct: netRevenue > 0 ? ((passM / netRevenue) * 100) : 0
                });
            }
        }

        return {
            monthlySessions,
            indirectMonthlyHours,
            totalEffectiveHours,
            grossRevenue,
            netRevenue,
            costs,
            netPerSession,
            netEffectiveHourly,
            monthlyRate,
            annualRatePct,
            passivePerSingleContribution,
            sessionsBoughtPerContribution,
            effectiveHoursBoughtPerContribution,
            contributionsForOneMonthlySession,
            currentPassiveMonthly,
            sessionsPaidToday,
            currentCoveragePct,
            crossCostMonth,
            crossHalfNetMonth,
            crossFullNetMonth,
            horizonYears,
            yearlySeries
        };
    }

    function mountShell() {
        const panel = document.getElementById('tab-panel-independencia');
        if (!panel) return;

        panel.innerHTML = `
            <div class="space-y-5 pb-20">
                <!-- Cabeçalho -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Engenharia de Liberdade de Tempo</span>
                            <span class="text-xs font-mono text-slate-400">Juros Reais Acima da Inflação</span>
                        </div>
                        <h2 class="text-lg sm:text-xl font-bold text-slate-100 mt-1">Simulador de Independência Clínica vs. Renda Passiva Perpétua</h2>
                    </div>
                    <div class="flex items-center gap-2">
                        <button type="button" id="btn-ind-reset" class="min-h-[42px] px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300">
                            Restaurar Padrão
                        </button>
                        <button type="button" id="btn-ind-export-csv" class="min-h-[42px] px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5">
                            <i data-lucide="file-spreadsheet" class="w-4 h-4"></i>
                            <span>Exportar Projeção CSV</span>
                        </button>
                    </div>
                </div>

                <!-- Grid Principal: Parâmetros Operacionais vs KPIs e Compra de Liberdade -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <!-- Painel de Inputs -->
                    <div class="lg:col-span-4 bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                        <h3 class="text-sm font-bold font-mono uppercase tracking-wider text-cyan-300">Parâmetros Clínicos & Patrimoniais</h3>

                        <div class="grid grid-cols-2 gap-2.5">
                            <div>
                                <label class="block text-[11px] font-mono text-slate-400 mb-1">Sessões / Semana</label>
                                <input type="number" id="ind-weekly-sessions" step="1" min="1" max="60"
                                    class="w-full min-h-[42px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-slate-100">
                            </div>
                            <div>
                                <label class="block text-[11px] font-mono text-slate-400 mb-1">Semanas / Mês</label>
                                <input type="number" id="ind-weeks-month" step="0.1" min="1" max="4.5"
                                    class="w-full min-h-[42px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-slate-100">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-2.5">
                            <div>
                                <label class="block text-[11px] font-mono text-slate-400 mb-1">Horas Indiretas/Sem (Laudos)</label>
                                <input type="number" id="ind-indirect-hours" step="0.5" min="0" max="40"
                                    class="w-full min-h-[42px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-slate-100">
                            </div>
                            <div>
                                <label class="block text-[11px] font-mono text-slate-400 mb-1">Ticket Médio (BRL)</label>
                                <input type="number" id="ind-avg-ticket" step="10" min="0"
                                    class="w-full min-h-[42px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-emerald-300">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-2.5">
                            <div>
                                <label class="block text-[11px] font-mono text-slate-400 mb-1">Custos + Impostos/Mês</label>
                                <input type="number" id="ind-monthly-costs" step="100" min="0"
                                    class="w-full min-h-[42px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-rose-300">
                            </div>
                            <div>
                                <label class="block text-[11px] font-mono text-slate-400 mb-1">Aporte Mensal (BRL)</label>
                                <input type="number" id="ind-contribution" step="100" min="0"
                                    class="w-full min-h-[42px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-cyan-300">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-2.5">
                            <div>
                                <label class="block text-[11px] font-mono text-slate-400 mb-1">Patrimônio Investido Hoje</label>
                                <input type="number" id="ind-patrimony" step="1000" min="0"
                                    class="w-full min-h-[42px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-amber-300">
                            </div>
                            <div>
                                <label class="block text-[11px] font-mono text-slate-400 mb-1">Juro Real Líquido (% a.a.)</label>
                                <input type="number" id="ind-annual-return" step="0.1" min="0.5" max="25"
                                    class="w-full min-h-[42px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-emerald-300">
                            </div>
                        </div>

                        <div class="pt-1">
                            <div class="flex items-center justify-between text-xs font-mono text-slate-300 mb-1">
                                <span>Horizonte do Gráfico</span>
                                <span id="ind-horizon-label" class="text-cyan-300 font-bold">15 anos</span>
                            </div>
                            <input type="range" id="ind-horizon-slider" min="1" max="30" value="15" class="w-full accent-cyan-400 cursor-pointer">
                        </div>
                    </div>

                    <!-- Painel de KPIs, Compra de Liberdade e Marcos de Crossover -->
                    <div class="lg:col-span-8 space-y-4">
                        <div id="ind-kpi-cards" class="grid grid-cols-1 sm:grid-cols-3 gap-3"></div>
                        <div id="ind-freedom-card" class="bg-gradient-to-r from-emerald-950/40 via-[#0f172a] to-cyan-950/30 border border-emerald-500/35 rounded-xl p-4"></div>
                        <div id="ind-crossovers-grid" class="grid grid-cols-1 sm:grid-cols-3 gap-3"></div>
                    </div>
                </div>

                <!-- Gráfico Interativo SVG de Cruzamento -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 class="text-sm font-bold font-mono uppercase tracking-wider text-slate-100">Curva de Crossover: Receita Clínica Líquida vs. Renda Passiva Real Mensal</h3>
                            <p class="text-xs text-slate-400">Passe o cursor ou toque sobre os anos para inspecionar patrimônio acumulado e sessões compradas</p>
                        </div>
                        <div class="flex flex-wrap items-center gap-3 text-[11px] font-mono">
                            <span class="inline-flex items-center gap-1.5 text-emerald-300"><span class="w-3 h-1 bg-emerald-400 inline-block"></span>Renda Passiva Real</span>
                            <span class="inline-flex items-center gap-1.5 text-cyan-300"><span class="w-3 h-0.5 border-t-2 border-dashed border-cyan-400 inline-block"></span>100% Receita Líquida</span>
                            <span class="inline-flex items-center gap-1.5 text-amber-300"><span class="w-3 h-0.5 border-t-2 border-dashed border-amber-400 inline-block"></span>50% Meia-Jornada</span>
                        </div>
                    </div>

                    <div id="ind-chart-tooltip" class="min-h-[34px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-800 font-mono text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2"></div>
                    <div id="ind-svg-chart-wrap" class="w-full overflow-x-auto"></div>
                </div>

                <!-- Tabela Anual Expansível -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                    <div class="flex items-center justify-between">
                        <h3 class="text-sm font-bold font-mono uppercase tracking-wider text-slate-200">Evolução Patrimonial Real Ano a Ano</h3>
                        <button type="button" id="btn-ind-toggle-table" class="min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-cyan-300">
                            Expandir Todos os Anos
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse font-mono text-xs">
                            <thead>
                                <tr class="border-b border-slate-800 text-slate-400">
                                    <th class="py-2 px-2">Ano</th>
                                    <th class="py-2 px-2">Total Aportado</th>
                                    <th class="py-2 px-2">Juros Reais Acum.</th>
                                    <th class="py-2 px-2">Patrimônio Real</th>
                                    <th class="py-2 px-2">Renda Passiva/Mês</th>
                                    <th class="py-2 px-2">Sessões Pagas/Mês</th>
                                    <th class="py-2 px-2">% Independência</th>
                                </tr>
                            </thead>
                            <tbody id="ind-annual-tbody" class="divide-y divide-slate-800/60"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        syncInputsToDOM();
        bindEvents();
    }

    function syncInputsToDOM() {
        document.getElementById('ind-weekly-sessions').value = inputs.weeklySessions;
        document.getElementById('ind-weeks-month').value = inputs.weeksPerMonth;
        document.getElementById('ind-indirect-hours').value = inputs.indirectWeeklyHours;
        document.getElementById('ind-avg-ticket').value = inputs.avgTicket;
        document.getElementById('ind-monthly-costs').value = inputs.monthlyCosts;
        document.getElementById('ind-contribution').value = inputs.monthlyContribution;
        document.getElementById('ind-patrimony').value = inputs.currentPatrimony;
        document.getElementById('ind-annual-return').value = inputs.realAnnualReturn;
        document.getElementById('ind-horizon-slider').value = inputs.horizonYears;
        document.getElementById('ind-horizon-label').textContent = `${inputs.horizonYears} anos`;
    }

    function renderMetricsAndCards(m) {
        const C = global.VaultCore;

        document.getElementById('ind-kpi-cards').innerHTML = `
            <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3.5">
                <div class="text-xs text-slate-400">Receita Clínica Líquida / Mês</div>
                <div class="text-xl font-mono font-bold text-emerald-300 mt-1">${C.formatBRL(m.netRevenue)}</div>
                <div class="text-[11px] font-mono text-slate-400 mt-1">Bruta: ${C.formatBRL(m.grossRevenue)} (${C.formatNum(m.monthlySessions, 1)} sessões)</div>
            </div>

            <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3.5">
                <div class="text-xs text-slate-400">Hora Clínica Líquida (Efetiva vs Direta)</div>
                <div class="text-xl font-mono font-bold text-cyan-300 mt-1">${C.formatBRL(m.netEffectiveHourly)}<span class="text-xs text-slate-400">/h total</span></div>
                <div class="text-[11px] font-mono text-slate-400 mt-1">Sessão direta: ${C.formatBRL(m.netPerSession)} (${C.formatNum(m.totalEffectiveHours, 1)}h totais/mês)</div>
            </div>

            <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3.5">
                <div class="text-xs text-slate-400">Renda Passiva Atual (Hoje)</div>
                <div class="text-xl font-mono font-bold text-amber-300 mt-1">${C.formatBRL(m.currentPassiveMonthly)}<span class="text-xs text-slate-400">/mês</span></div>
                <div class="text-[11px] font-mono text-slate-400 mt-1">Já paga <strong>${C.formatNum(m.sessionsPaidToday, 2)} sessões/mês</strong> (${C.formatNum(m.currentCoveragePct, 1)}%)</div>
            </div>
        `;

        const aportesP1Sessao = m.contributionsForOneMonthlySession
            ? `${C.formatNum(m.contributionsForOneMonthlySession, 1)} aportes compram 1 sessão mensal vitalícia`
            : 'Ajuste o aporte para calcular equivalência';

        document.getElementById('ind-freedom-card').innerHTML = `
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div class="space-y-1">
                    <div class="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">Índice de Compra de Liberdade por Novo Aporte</div>
                    <p class="text-sm text-slate-200">
                        Cada único aporte mensal de <strong class="font-mono text-cyan-300">${C.formatBRL(inputs.monthlyContribution)}</strong>
                        (taxa composta real de <span class="font-mono text-emerald-300">${C.formatNum(m.monthlyRate * 100, 4)}% a.m.</span>)
                        gera <strong class="font-mono text-emerald-300">${C.formatBRL(m.passivePerSingleContribution)}/mês</strong> perpétuos.
                    </p>
                    <p class="text-xs font-mono text-slate-400">${aportesP1Sessao} (Fórmula: dividendos_do_aporte ÷ valor_líquido_sessão).</p>
                </div>
                <div class="bg-[#090d16]/90 border border-emerald-500/40 rounded-xl px-4 py-3 text-center shrink-0">
                    <div class="text-2xl font-mono font-extrabold text-emerald-300">${C.formatNum(m.sessionsBoughtPerContribution, 2)}</div>
                    <div class="text-[11px] font-mono text-slate-300">sessões/mês compradas p/ sempre</div>
                    <div class="text-[10px] font-mono text-cyan-400 mt-0.5">ou ${C.formatNum(m.effectiveHoursBoughtPerContribution, 2)} horas totais/mês</div>
                </div>
            </div>
        `;

        document.getElementById('ind-crossovers-grid').innerHTML = `
            <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5">
                <div class="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>C1 • Custos Fixos Cobertos</span>
                    <span class="text-slate-300">≥ ${C.formatBRL(m.costs)}</span>
                </div>
                <div class="text-sm font-mono font-bold text-slate-100 mt-1.5">${formatMonthYearFromOffset(m.crossCostMonth)}</div>
            </div>

            <div class="bg-[#0f172a] border border-amber-500/30 rounded-xl p-3.5">
                <div class="flex items-center justify-between text-[11px] font-mono text-amber-300">
                    <span>C2 • Meia-Jornada (50%)</span>
                    <span>≥ ${C.formatBRL(m.netRevenue * 0.5)}</span>
                </div>
                <div class="text-sm font-mono font-bold text-amber-200 mt-1.5">${formatMonthYearFromOffset(m.crossHalfNetMonth)}</div>
            </div>

            <div class="bg-[#0f172a] border border-cyan-500/40 rounded-xl p-3.5">
                <div class="flex items-center justify-between text-[11px] font-mono text-cyan-300">
                    <span>C3 • Crossover 100% Clínica</span>
                    <span>≥ ${C.formatBRL(m.netRevenue)}</span>
                </div>
                <div class="text-sm font-mono font-bold text-cyan-200 mt-1.5">${formatMonthYearFromOffset(m.crossFullNetMonth)}</div>
            </div>
        `;
    }

    function renderSVGChart(m) {
        const wrap = document.getElementById('ind-svg-chart-wrap');
        const tooltip = document.getElementById('ind-chart-tooltip');
        if (!wrap || !tooltip) return;
        const C = global.VaultCore;

        const series = m.yearlySeries;
        const svgW = 960;
        const svgH = 300;
        const padL = 78;
        const padR = 32;
        const padT = 24;
        const padB = 38;
        const plotW = svgW - padL - padR;
        const plotH = svgH - padT - padB;

        const maxPassive = Math.max(...series.map((s) => s.passiveMonthly));
        const yMax = Math.max(m.netRevenue * 1.18, maxPassive * 1.08, m.costs * 1.2, 1000);

        const getX = (yr) => padL + (yr / m.horizonYears) * plotW;
        const getY = (val) => padT + plotH - (Math.min(yMax, Math.max(0, val)) / yMax) * plotH;

        // Grade horizontal Y
        let gridSvg = '';
        for (let i = 0; i <= 4; i++) {
            const val = (yMax / 4) * i;
            const y = getY(val);
            gridSvg += `
                <line x1="${padL}" y1="${y}" x2="${svgW - padR}" y2="${y}" stroke="#1e293b" stroke-width="1"/>
                <text x="${padL - 8}" y="${y + 4}" text-anchor="end" fill="#64748b" font-family="JetBrains Mono, monospace" font-size="10">
                    ${(val / 1000).toFixed(1)}k
                </text>
            `;
        }

        // Linhas horizontais de referência (Custo, 50% e 100% Receita Líquida)
        const yNet100 = getY(m.netRevenue);
        const yNet50 = getY(m.netRevenue * 0.5);
        const yCost = getY(m.costs);

        const refLinesSvg = `
            <line x1="${padL}" y1="${yCost}" x2="${svgW - padR}" y2="${yCost}" stroke="#64748b" stroke-width="1.2" stroke-dasharray="3 4"/>
            <line x1="${padL}" y1="${yNet50}" x2="${svgW - padR}" y2="${yNet50}" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="5 4"/>
            <line x1="${padL}" y1="${yNet100}" x2="${svgW - padR}" y2="${yNet100}" stroke="#06b6d4" stroke-width="2" stroke-dasharray="6 4"/>
        `;

        // Polígono e curva da Renda Passiva Real
        const pts = series.map((s) => `${getX(s.year)},${getY(s.passiveMonthly)}`).join(' ');
        const areaPts = `${getX(0)},${getY(0)} ${pts} ${getX(m.horizonYears)},${getY(0)}`;

        // Pinos de Crossover se ocorrerem dentro do horizonte
        let pinsSvg = '';
        const addPin = (monthVal, targetVal, color, tag) => {
            if (monthVal !== null && monthVal > 0 && (monthVal / 12) <= m.horizonYears) {
                const cx = getX(monthVal / 12);
                const cy = getY(targetVal);
                pinsSvg += `
                    <g>
                        <circle cx="${cx}" cy="${cy}" r="7" fill="${color}" stroke="#090d16" stroke-width="2"/>
                        <text x="${cx}" y="${cy - 11}" text-anchor="middle" fill="${color}" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700">${tag}</text>
                    </g>
                `;
            }
        };
        addPin(m.crossCostMonth, m.costs, '#94a3b8', 'C1');
        addPin(m.crossHalfNetMonth, m.netRevenue * 0.5, '#fbbf24', 'C2 50%');
        addPin(m.crossFullNetMonth, m.netRevenue, '#22d3ee', 'C3 100%');

        // Pontos anuais interativos
        let dotsSvg = '';
        series.forEach((s, idx) => {
            const cx = getX(s.year);
            const cy = getY(s.passiveMonthly);
            dotsSvg += `
                <g class="cursor-pointer" data-ind-year-idx="${idx}">
                    <line x1="${cx}" y1="${padT}" x2="${cx}" y2="${padT + plotH}" stroke="#38bdf8" stroke-width="1" stroke-opacity="0" data-ind-vline="${idx}"/>
                    <circle cx="${cx}" cy="${cy}" r="4.5" fill="#10b981" stroke="#090d16" stroke-width="1.5"/>
                    <rect x="${cx - (plotW / Math.max(2, series.length)) * 0.48}" y="${padT}" width="${(plotW / Math.max(2, series.length)) * 0.96}" height="${plotH}" fill="transparent"/>
                    <text x="${cx}" y="${svgH - 12}" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono, monospace" font-size="10">${s.year}a</text>
                </g>
            `;
        });

        wrap.innerHTML = `
            <svg viewBox="0 0 ${svgW} ${svgH}" class="w-full h-auto select-none" role="img" aria-label="Gráfico de cruzamento de independência clínica">
                <defs>
                    <linearGradient id="passiveAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#10b981" stop-opacity="0.34"/>
                        <stop offset="100%" stop-color="#10b981" stop-opacity="0.02"/>
                    </linearGradient>
                </defs>
                ${gridSvg}
                ${refLinesSvg}
                <polygon points="${areaPts}" fill="url(#passiveAreaGrad)"/>
                <polyline points="${pts}" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                ${pinsSvg}
                ${dotsSvg}
            </svg>
        `;

        const showYearTooltip = (idx) => {
            const item = series[idx] || series[series.length - 1];
            tooltip.innerHTML = `
                <span><strong class="text-cyan-300">Ano ${item.year}</strong> • Patrimônio Real: <strong class="text-amber-300">${C.formatBRL(item.patrimony)}</strong></span>
                <span>Renda Passiva: <strong class="text-emerald-300">${C.formatBRL(item.passiveMonthly)}/mês</strong> (${C.formatNum(item.coveragePct, 1)}% da clínica • <strong>${C.formatNum(item.sessionsCovered, 1)} sessões/mês</strong>)</span>
            `;
            wrap.querySelectorAll('[data-ind-vline]').forEach((ln) => {
                ln.setAttribute('stroke-opacity', ln.getAttribute('data-ind-vline') === String(idx) ? '0.65' : '0');
            });
        };

        showYearTooltip(series.length - 1);

        wrap.querySelectorAll('[data-ind-year-idx]').forEach((g) => {
            const idx = parseInt(g.getAttribute('data-ind-year-idx'), 10);
            g.addEventListener('mouseenter', () => showYearTooltip(idx));
            g.addEventListener('click', () => showYearTooltip(idx));
        });
    }

    function renderAnnualTable(m) {
        const tbody = document.getElementById('ind-annual-tbody');
        const btnToggle = document.getElementById('btn-ind-toggle-table');
        if (!tbody) return;
        const C = global.VaultCore;

        const rowsToShow = tableExpanded
            ? m.yearlySeries
            : m.yearlySeries.filter((s, i) => i === 0 || s.year % 2 === 0 || i === m.yearlySeries.length - 1);

        if (btnToggle) {
            btnToggle.textContent = tableExpanded ? 'Compactar Tabela' : `Expandir Todos (${m.yearlySeries.length} linhas)`;
        }

        tbody.innerHTML = rowsToShow.map((s) => {
            const reached = s.coveragePct >= 100;
            return `
                <tr class="${reached ? 'bg-emerald-950/20' : 'hover:bg-slate-900/60'}">
                    <td class="py-2 px-2 font-bold text-cyan-300">Ano ${s.year}</td>
                    <td class="py-2 px-2 text-slate-300">${C.formatBRL(s.contributedTotal)}</td>
                    <td class="py-2 px-2 text-emerald-400">${C.formatBRL(s.realInterestTotal)}</td>
                    <td class="py-2 px-2 font-semibold text-amber-200">${C.formatBRL(s.patrimony)}</td>
                    <td class="py-2 px-2 font-bold text-emerald-300">${C.formatBRL(s.passiveMonthly)}</td>
                    <td class="py-2 px-2 text-slate-200">${C.formatNum(s.sessionsCovered, 1)} sessões</td>
                    <td class="py-2 px-2">
                        <span class="px-2 py-0.5 rounded text-[11px] ${reached ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-300'}">
                            ${C.formatNum(s.coveragePct, 1)}%
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function recalculateAndRender() {
        lastModel = computeFinancialModel();
        renderMetricsAndCards(lastModel);
        renderSVGChart(lastModel);
        renderAnnualTable(lastModel);
    }

    function bindEvents() {
        const C = global.VaultCore;
        const mapIds = {
            'ind-weekly-sessions': 'weeklySessions',
            'ind-weeks-month': 'weeksPerMonth',
            'ind-indirect-hours': 'indirectWeeklyHours',
            'ind-avg-ticket': 'avgTicket',
            'ind-monthly-costs': 'monthlyCosts',
            'ind-contribution': 'monthlyContribution',
            'ind-patrimony': 'currentPatrimony',
            'ind-annual-return': 'realAnnualReturn',
            'ind-horizon-slider': 'horizonYears'
        };

        Object.entries(mapIds).forEach(([domId, prop]) => {
            const el = document.getElementById(domId);
            el.addEventListener('input', (e) => {
                inputs[prop] = Number(e.target.value);
                if (prop === 'horizonYears') {
                    document.getElementById('ind-horizon-label').textContent = `${inputs.horizonYears} anos`;
                }
                saveInputs();
                recalculateAndRender();
            });
        });

        document.getElementById('btn-ind-toggle-table').addEventListener('click', () => {
            tableExpanded = !tableExpanded;
            if (lastModel) renderAnnualTable(lastModel);
        });

        document.getElementById('btn-ind-reset').addEventListener('click', () => {
            inputs = Object.assign({}, DEFAULT_INPUTS);
            saveInputs();
            syncInputsToDOM();
            recalculateAndRender();
            C.toast('Parâmetros financeiros restaurados para o padrão.', 'info');
        });

        document.getElementById('btn-ind-export-csv').addEventListener('click', () => {
            if (!lastModel) return;
            const headers = ['Ano', 'Total Aportado (BRL)', 'Juros Reais Acumulados (BRL)', 'Patrimônio Real (BRL)', 'Renda Passiva Mensal (BRL)', 'Sessões Cobertas/Mês', '% Independência Clínica'];
            const rows = lastModel.yearlySeries.map((s) => [
                s.year,
                s.contributedTotal.toFixed(2),
                s.realInterestTotal.toFixed(2),
                s.patrimony.toFixed(2),
                s.passiveMonthly.toFixed(2),
                s.sessionsCovered.toFixed(2),
                s.coveragePct.toFixed(2)
            ]);
            C.exportCSV(`simulacao-independencia-clinica-${C.todayISO()}.csv`, headers, rows);
            C.toast('Projeção anual exportada em CSV.', 'success');
        });
    }

    function init() {
        loadInputs();
        mountShell();
        recalculateAndRender();

        window.addEventListener('vault:restored', () => {
            loadInputs();
            syncInputsToDOM();
            recalculateAndRender();
        });
    }

    global.VaultTabIndependencia = { init, recalculateAndRender };
})(window);
