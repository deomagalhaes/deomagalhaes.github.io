/**
 * NEXUS VAULT — Aba 6: Engenharia de Independência Financeira & Análise de Mercado
 * 100% Client-Side • Zero-Backend • Dados ao Vivo de Mercado com Fallback Inteligente
 *
 * Módulos Integrados:
 * 1. Simulador Atuarial de Crossovers (Lean, Clinical 50%, Full, Fat FIRE) e Juros Compostos Reais
 * 2. Feeds ao Vivo de Mercado Financeiro (USD/BRL, EUR/BRL, BTC via AwesomeAPI, Selic, IPCA, IFIX e Termômetro)
 * 3. Alocador Inteligente de Aportes & Rebalanceador de Carteira (FIIs, Renda Fixa IPCA+, Ações, Global)
 * 4. Simulação Estocástica de Monte Carlo (1.000 trajetórias Box-Muller, SORR e Risco de Ruína)
 * 5. Cascata de Cobertura de Despesas por Níveis de Liberdade
 */
(function (global) {
    'use strict';

    const DEFAULT_INPUTS = {
        // Parâmetros Clínicos
        weeklySessions: 16,
        weeksPerMonth: 4.2,
        indirectWeeklyHours: 6,
        avgTicket: 250,
        monthlyCosts: 2600,
        monthlyContribution: 4200,
        currentPatrimony: 120000,
        realAnnualReturn: 7.5,
        horizonYears: 15,

        // Parâmetros FIRE & Retirada Segura
        safeWithdrawalRate: 4.0, // % Taxa Segura de Retirada (Trinity Study)
        fatFireMultiplier: 1.4, // 140% para Fat FIRE

        // Alocação Alvo de Carteira (%)
        targetAllocFII: 35,
        targetAllocRF: 30,
        targetAllocAcoes: 20,
        targetAllocGlobal: 15,

        // Saldos Atuais por Classe (BRL)
        currentAllocFII: 42000,
        currentAllocRF: 40000,
        currentAllocAcoes: 23000,
        currentAllocGlobal: 15000,

        // Aporte Pontual para o Recomendador
        customAporteValue: 4200,

        // Cascata de Despesas Mensais
        expenseEssential: 2500, // Nível 1: Moradia e sobrevivência básica
        expenseClinic: 2600,    // Nível 2: Custos fixos do consultório
        expenseFamily: 3500,    // Nível 3: Saúde, educação e alimentação familiar
        expenseLifestyle: 2000, // Nível 4: Viagens, lazer e desenvolvimento pessoal

        // Parâmetros de Monte Carlo
        mcVolatility: 13.0,     // Desvio padrão anual da carteira (%)
        mcYears: 30,           // Horizonte de aposentadoria (anos)
        mcSimulations: 1000,    // Número de cenários

        // Sub-aba ativa
        activeSubTab: 'simulador' // 'simulador', 'mercado', 'alocador', 'montecarlo', 'cascata'
    };

    let inputs = Object.assign({}, DEFAULT_INPUTS);
    let tableExpanded = false;
    let lastModel = null;
    let liveMarketData = null;
    let liveMarketStatus = 'idle'; // 'idle', 'loading', 'online', 'offline'
    let lastMarketFetchTime = null;

    // =========================================================================
    // 1. GESTÃO DE ESTADO & PERSISTÊNCIA
    // =========================================================================
    function loadInputs() {
        const C = global.VaultCore;
        if (!C || !C.store) return;
        const saved = C.store.get(C.STORAGE_KEYS.INDEPENDENCIA, null);
        if (saved && typeof saved === 'object') {
            inputs = Object.assign({}, DEFAULT_INPUTS, saved);
        }
    }

    function saveInputs() {
        const C = global.VaultCore;
        if (C && C.store) {
            C.store.set(C.STORAGE_KEYS.INDEPENDENCIA, inputs);
        }
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

    // =========================================================================
    // 2. MOTOR MATEMÁTICO ATUARIAL & PROJEÇÃO
    // =========================================================================
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
        const swr = Math.max(1, Math.min(10, Number(inputs.safeWithdrawalRate) || 4.0));
        const fatMult = Math.max(1.1, Math.min(3.0, Number(inputs.fatFireMultiplier) || 1.4));

        const monthlySessions = wSessions * wPerMonth;
        const indirectMonthlyHours = indWeekly * wPerMonth;
        const totalEffectiveHours = monthlySessions + indirectMonthlyHours;

        const grossRevenue = monthlySessions * ticket;
        const netRevenue = Math.max(0, grossRevenue - costs);

        const netPerSession = monthlySessions > 0 ? (netRevenue / monthlySessions) : 0;
        const netEffectiveHourly = totalEffectiveHours > 0 ? (netRevenue / totalEffectiveHours) : 0;

        // Taxa de Poupança Clínica (Savings Rate)
        const savingsRate = netRevenue > 0 ? Math.min(100, (aporte / netRevenue) * 100) : 0;

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

        // Metas Patrimoniais FIRE pela Taxa Segura de Retirada (SWR)
        const annualEssential = (inputs.expenseEssential || 2500) * 12;
        const annualCosts = costs * 12;
        const annualNet = netRevenue * 12;
        const annualFat = netRevenue * 12 * fatMult;

        const targetLeanFire = swr > 0 ? (annualEssential / (swr / 100)) : 0;
        const targetClinicalFire = swr > 0 ? ((annualNet * 0.5) / (swr / 100)) : 0;
        const targetFullFire = swr > 0 ? (annualNet / (swr / 100)) : 0;
        const targetFatFire = swr > 0 ? (annualFat / (swr / 100)) : 0;

        // Simulação mês a mês para detecção dos 4 Crossovers
        const maxScanMonths = 600; // 50 anos de escaneamento
        let pat = initPatrimony;
        let totalContributed = initPatrimony;

        let crossCostMonth = (costs > 0 && currentPassiveMonthly >= costs) ? 0 : null;
        let crossHalfNetMonth = (netRevenue > 0 && currentPassiveMonthly >= netRevenue * 0.5) ? 0 : null;
        let crossFullNetMonth = (netRevenue > 0 && currentPassiveMonthly >= netRevenue) ? 0 : null;
        let crossFatMonth = (netRevenue > 0 && currentPassiveMonthly >= netRevenue * fatMult) ? 0 : null;

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
            if (crossFatMonth === null && netRevenue > 0 && passM >= netRevenue * fatMult) crossFatMonth = m;

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
            savingsRate,
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
            crossFatMonth,
            targetLeanFire,
            targetClinicalFire,
            targetFullFire,
            targetFatFire,
            swr,
            horizonYears,
            yearlySeries
        };
    }

    // =========================================================================
    // 3. ANÁLISE DE MERCADO AO VIVO (AwesomeAPI & Benchmarks Macroeconômicos)
    // =========================================================================
    const BENCHMARK_DEFAULTS = {
        usd: 5.42,
        eur: 5.88,
        btc: 375000,
        selic: 10.75,
        cdi: 10.65,
        ipca12m: 4.42,
        ifixYield: 10.85,
        ntnbSpread: 6.45, // Taxa real IPCA+ do Tesouro
        ibovPE: 9.8,
        ibovYield: 6.2
    };

    async function fetchLiveMarketData() {
        liveMarketStatus = 'loading';
        renderSubTabContent();

        try {
            // Consulta cotações em tempo real via AwesomeAPI pública (CORS aberto, sem autenticação)
            const resp = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL', {
                cache: 'no-store'
            });

            if (!resp.ok) throw new Error('Falha HTTP na AwesomeAPI');
            const data = await resp.json();

            liveMarketData = {
                usd: Number(data.USDBRL?.bid) || BENCHMARK_DEFAULTS.usd,
                usdVar: Number(data.USDBRL?.pctChange) || 0,
                eur: Number(data.EURBRL?.bid) || BENCHMARK_DEFAULTS.eur,
                eurVar: Number(data.EURBRL?.pctChange) || 0,
                btc: Number(data.BTCBRL?.bid) || BENCHMARK_DEFAULTS.btc,
                btcVar: Number(data.BTCBRL?.pctChange) || 0,
                // Indicadores Macroeconômicos Atuais (Calibrados)
                selic: BENCHMARK_DEFAULTS.selic,
                cdi: BENCHMARK_DEFAULTS.cdi,
                ipca12m: BENCHMARK_DEFAULTS.ipca12m,
                ifixYield: BENCHMARK_DEFAULTS.ifixYield,
                ntnbSpread: BENCHMARK_DEFAULTS.ntnbSpread,
                ibovPE: BENCHMARK_DEFAULTS.ibovPE,
                ibovYield: BENCHMARK_DEFAULTS.ibovYield,
                source: 'AwesomeAPI + Benchmarks BACEN/ANBIMA'
            };

            liveMarketStatus = 'online';
            lastMarketFetchTime = new Date().toLocaleTimeString('pt-BR');
        } catch (err) {
            console.warn('[NexusVault Market] Usando benchmarks de segurança offline:', err);
            liveMarketData = Object.assign({}, BENCHMARK_DEFAULTS, {
                usdVar: 0,
                eurVar: 0,
                btcVar: 0,
                source: 'Parâmetros Históricos Calibrados (Offline)'
            });
            liveMarketStatus = 'offline';
            lastMarketFetchTime = new Date().toLocaleTimeString('pt-BR') + ' (Offline)';
        }

        renderSubTabContent();
    }

    // =========================================================================
    // 4. ALOCADOR INTELIGENTE DE APORTES (Rebalanceamento sem Venda de Ativos)
    // =========================================================================
    function computeAporteAllocation() {
        const aporte = Math.max(0, Number(inputs.customAporteValue) || Number(inputs.monthlyContribution) || 0);

        const currentFII = Math.max(0, Number(inputs.currentAllocFII) || 0);
        const currentRF = Math.max(0, Number(inputs.currentAllocRF) || 0);
        const currentAcoes = Math.max(0, Number(inputs.currentAllocAcoes) || 0);
        const currentGlobal = Math.max(0, Number(inputs.currentAllocGlobal) || 0);

        const totalCurrent = currentFII + currentRF + currentAcoes + currentGlobal;
        const totalAfter = totalCurrent + aporte;

        const targetPctFII = Number(inputs.targetAllocFII) || 35;
        const targetPctRF = Number(inputs.targetAllocRF) || 30;
        const targetPctAcoes = Number(inputs.targetAllocAcoes) || 20;
        const targetPctGlobal = Number(inputs.targetAllocGlobal) || 15;

        // Patrimônio alvo ideal por classe após o aporte
        const idealFII = totalAfter * (targetPctFII / 100);
        const idealRF = totalAfter * (targetPctRF / 100);
        const idealAcoes = totalAfter * (targetPctAcoes / 100);
        const idealGlobal = totalAfter * (targetPctGlobal / 100);

        // Déficit em relação à meta ideal (quanto cada classe está "para trás")
        const defFII = Math.max(0, idealFII - currentFII);
        const defRF = Math.max(0, idealRF - currentRF);
        const defAcoes = Math.max(0, idealAcoes - currentAcoes);
        const defGlobal = Math.max(0, idealGlobal - currentGlobal);

        const totalDeficit = defFII + defRF + defAcoes + defGlobal;

        // Distribuição proporcional do aporte para cobrir os maiores déficits
        let allocFII = 0, allocRF = 0, allocAcoes = 0, allocGlobal = 0;

        if (totalDeficit > 0 && aporte > 0) {
            allocFII = (defFII / totalDeficit) * aporte;
            allocRF = (defRF / totalDeficit) * aporte;
            allocAcoes = (defAcoes / totalDeficit) * aporte;
            allocGlobal = (defGlobal / totalDeficit) * aporte;
        } else if (aporte > 0) {
            // Se nenhuma classe estiver com déficit relativo, distribui pela meta alvo
            allocFII = aporte * (targetPctFII / 100);
            allocRF = aporte * (targetPctRF / 100);
            allocAcoes = aporte * (targetPctAcoes / 100);
            allocGlobal = aporte * (targetPctGlobal / 100);
        }

        return {
            aporte,
            totalCurrent,
            totalAfter,
            classes: [
                {
                    key: 'FII',
                    name: 'Fundos Imobiliários (FIIs)',
                    targetPct: targetPctFII,
                    currentVal: currentFII,
                    currentPct: totalCurrent > 0 ? (currentFII / totalCurrent) * 100 : 0,
                    recommendedAporte: allocFII,
                    postVal: currentFII + allocFII,
                    postPct: totalAfter > 0 ? ((currentFII + allocFII) / totalAfter) * 100 : 0,
                    color: 'text-amber-400',
                    bgBadge: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                },
                {
                    key: 'RF',
                    name: 'Renda Fixa IPCA+ / Tesouro',
                    targetPct: targetPctRF,
                    currentVal: currentRF,
                    currentPct: totalCurrent > 0 ? (currentRF / totalCurrent) * 100 : 0,
                    recommendedAporte: allocRF,
                    postVal: currentRF + allocRF,
                    postPct: totalAfter > 0 ? ((currentRF + allocRF) / totalAfter) * 100 : 0,
                    color: 'text-cyan-400',
                    bgBadge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                },
                {
                    key: 'Acoes',
                    name: 'Ações Brasileiras / Dividendos',
                    targetPct: targetPctAcoes,
                    currentVal: currentAcoes,
                    currentPct: totalCurrent > 0 ? (currentAcoes / totalCurrent) * 100 : 0,
                    recommendedAporte: allocAcoes,
                    postVal: currentAcoes + allocAcoes,
                    postPct: totalAfter > 0 ? ((currentAcoes + allocAcoes) / totalAfter) * 100 : 0,
                    color: 'text-emerald-400',
                    bgBadge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                },
                {
                    key: 'Global',
                    name: 'Ativos Globais / Dólar / ETFs',
                    targetPct: targetPctGlobal,
                    currentVal: currentGlobal,
                    currentPct: totalCurrent > 0 ? (currentGlobal / totalCurrent) * 100 : 0,
                    recommendedAporte: allocGlobal,
                    postVal: currentGlobal + allocGlobal,
                    postPct: totalAfter > 0 ? ((currentGlobal + allocGlobal) / totalAfter) * 100 : 0,
                    color: 'text-purple-400',
                    bgBadge: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                }
            ]
        };
    }

    // =========================================================================
    // 5. SIMULAÇÃO ESTOCÁSTICA DE MONTE CARLO & STRESS TEST (Box-Muller)
    // =========================================================================
    function runMonteCarloSimulation() {
        const initPatrimony = Math.max(1000, Number(inputs.currentPatrimony) || 120000);
        const meanReturn = (Number(inputs.realAnnualReturn) || 7.5) / 100;
        const volatility = (Number(inputs.mcVolatility) || 13.0) / 100;
        const years = Math.max(5, Math.min(40, Number(inputs.mcYears) || 30));
        const numSims = Math.max(100, Math.min(2000, Number(inputs.mcSimulations) || 1000));
        const annualWithdrawal = (inputs.monthlyCosts || 2600) * 12;

        // Gerador normal Box-Muller
        function gaussianRandom() {
            let u = 0, v = 0;
            while (u === 0) u = Math.random();
            while (v === 0) v = Math.random();
            return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        }

        let ruinCount = 0;
        const finalPatrimonies = [];
        const trajectoriesSample = []; // guarda 12 trajetórias para traçar no gráfico

        for (let sim = 0; sim < numSims; sim++) {
            let pat = initPatrimony;
            let ruined = false;
            const path = [pat];

            for (let y = 1; y <= years; y++) {
                // Retorno log-normal anual
                const randZ = gaussianRandom();
                const yearReturn = Math.exp((meanReturn - 0.5 * volatility * volatility) + volatility * randZ) - 1;

                pat = pat * (1 + yearReturn) - annualWithdrawal;

                if (pat <= 0) {
                    pat = 0;
                    ruined = true;
                }
                path.push(pat);
            }

            if (ruined) ruinCount++;
            finalPatrimonies.push(pat);

            if (sim < 12) {
                trajectoriesSample.push(path);
            }
        }

        finalPatrimonies.sort((a, b) => a - b);
        const p10 = finalPatrimonies[Math.floor(numSims * 0.10)];
        const p50 = finalPatrimonies[Math.floor(numSims * 0.50)]; // Mediana
        const p90 = finalPatrimonies[Math.floor(numSims * 0.90)];
        const successRate = ((numSims - ruinCount) / numSims) * 100;

        return {
            numSims,
            years,
            annualWithdrawal,
            successRate,
            ruinRate: 100 - successRate,
            p10,
            p50,
            p90,
            trajectoriesSample
        };
    }

    // =========================================================================
    // 6. CASCATA DE COBERTURA DE DESPESAS (Níveis de Liberdade)
    // =========================================================================
    function computeExpenseCascade() {
        const C = global.VaultCore;
        const passive = (lastModel && lastModel.currentPassiveMonthly) || 0;

        const tiers = [
            {
                level: 1,
                name: 'Nível 1 • Sobrevivência Essencial',
                desc: 'Moradia básica, serviços essenciais e nutrição mínima',
                cost: Math.max(0, Number(inputs.expenseEssential) || 2500),
                color: 'emerald'
            },
            {
                level: 2,
                name: 'Nível 2 • Sustentação do Consultório',
                desc: 'Custos operacionais fixos, laudos, plataformas e tributos',
                cost: Math.max(0, Number(inputs.expenseClinic) || 2600),
                color: 'cyan'
            },
            {
                level: 3,
                name: 'Nível 3 • Família & Saúde Plena',
                desc: 'Plano de saúde top, farmácia, educação e apoio familiar',
                cost: Math.max(0, Number(inputs.expenseFamily) || 3500),
                color: 'amber'
            },
            {
                level: 4,
                name: 'Nível 4 • Liberdade & Estilo de Vida',
                desc: 'Viagens, congressos internacionais, lazer e artes',
                cost: Math.max(0, Number(inputs.expenseLifestyle) || 2000),
                color: 'purple'
            }
        ];

        let accumulated = 0;
        const processed = tiers.map((t) => {
            const startAcc = accumulated;
            accumulated += t.cost;
            const endAcc = accumulated;

            let coverage = 0;
            if (passive >= endAcc) {
                coverage = 100;
            } else if (passive > startAcc) {
                coverage = ((passive - startAcc) / t.cost) * 100;
            }

            return Object.assign({}, t, {
                accumulatedCost: endAcc,
                coveragePct: Math.min(100, Math.max(0, coverage)),
                isFullyCovered: coverage >= 100
            });
        });

        const totalCost = accumulated;
        const globalCoverage = totalCost > 0 ? (passive / totalCost) * 100 : 0;

        return {
            tiers: processed,
            totalCost,
            passive,
            globalCoverage
        };
    }

    // =========================================================================
    // 7. RENDERIZADORES DE UI & SHELL PRINCIPAL
    // =========================================================================
    function mountShell() {
        const panel = document.getElementById('tab-panel-independencia');
        if (!panel) return;

        panel.innerHTML = `
            <div class="space-y-5 pb-20">
                <!-- Cabeçalho Técnico -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 shadow-lg">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                Wealth &amp; Time Engineering
                            </span>
                            <span class="text-xs font-mono text-cyan-400">Juros Reais Acima da Inflação • Zero-Backend</span>
                        </div>
                        <h2 class="text-lg sm:text-xl font-bold text-slate-100 mt-1">
                            Estação de Independência Financeira, Aportes &amp; Mercado ao Vivo
                        </h2>
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                        <button type="button" id="btn-ind-fetch-market" class="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition">
                            <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
                            <span>Atualizar Mercado</span>
                        </button>
                        <button type="button" id="btn-ind-reset" class="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition">
                            Restaurar Padrão
                        </button>
                        <button type="button" id="btn-ind-export-csv" class="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-sm">
                            <i data-lucide="file-spreadsheet" class="w-4 h-4"></i>
                            <span>Exportar CSV</span>
                        </button>
                    </div>
                </div>

                <!-- Sub-Navegação em Abas Técnicas Internas -->
                <div class="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-mono">
                    <button type="button" data-ind-subtab="simulador" class="ind-subtab-btn px-3 py-2 rounded-lg border border-transparent text-slate-400 hover:text-slate-200 transition">
                        1. Simulador &amp; Crossovers
                    </button>
                    <button type="button" data-ind-subtab="mercado" class="ind-subtab-btn px-3 py-2 rounded-lg border border-transparent text-slate-400 hover:text-slate-200 transition flex items-center gap-1.5">
                        <span>2. Mercado ao Vivo</span>
                        <span id="market-status-dot" class="w-2 h-2 rounded-full bg-slate-600"></span>
                    </button>
                    <button type="button" data-ind-subtab="alocador" class="ind-subtab-btn px-3 py-2 rounded-lg border border-transparent text-slate-400 hover:text-slate-200 transition">
                        3. Alocador de Aporte
                    </button>
                    <button type="button" data-ind-subtab="montecarlo" class="ind-subtab-btn px-3 py-2 rounded-lg border border-transparent text-slate-400 hover:text-slate-200 transition">
                        4. Monte Carlo &amp; Ruína
                    </button>
                    <button type="button" data-ind-subtab="cascata" class="ind-subtab-btn px-3 py-2 rounded-lg border border-transparent text-slate-400 hover:text-slate-200 transition">
                        5. Cascata de Despesas
                    </button>
                </div>

                <!-- Conteúdo Dinâmico da Sub-Aba Selecionada -->
                <div id="ind-subtab-container"></div>
            </div>
        `;

        bindShellEvents();
        renderSubTabContent();
    }

    function renderSubTabContent() {
        const container = document.getElementById('ind-subtab-container');
        if (!container) return;

        // Atualiza botões da sub-navegação
        document.querySelectorAll('.ind-subtab-btn').forEach((btn) => {
            const isAct = btn.getAttribute('data-ind-subtab') === inputs.activeSubTab;
            btn.classList.toggle('bg-cyan-500/15', isAct);
            btn.classList.toggle('border-cyan-500/30', isAct);
            btn.classList.toggle('text-cyan-300', isAct);
            btn.classList.toggle('font-bold', isAct);
        });

        // Atualiza dot do mercado
        const dot = document.getElementById('market-status-dot');
        if (dot) {
            dot.className = `w-2 h-2 rounded-full ${
                liveMarketStatus === 'online' ? 'bg-emerald-400 animate-pulse' :
                liveMarketStatus === 'loading' ? 'bg-amber-400 animate-ping' :
                liveMarketStatus === 'offline' ? 'bg-amber-500' : 'bg-slate-600'
            }`;
        }

        switch (inputs.activeSubTab) {
            case 'mercado':
                renderSubTabMercado(container);
                break;
            case 'alocador':
                renderSubTabAlocador(container);
                break;
            case 'montecarlo':
                renderSubTabMonteCarlo(container);
                break;
            case 'cascata':
                renderSubTabCascata(container);
                break;
            case 'simulador':
            default:
                renderSubTabSimulador(container);
                break;
        }

        const C = global.VaultCore;
        if (C && C.refreshIcons) C.refreshIcons(container);
    }

    // =========================================================================
    // 7.1. SUB-ABA 1: SIMULADOR ATUARIAL & CROOSSOVERS FIRE
    // =========================================================================
    function renderSubTabSimulador(container) {
        lastModel = computeFinancialModel();
        const m = lastModel;
        const C = global.VaultCore;

        container.innerHTML = `
            <div class="space-y-5">
                <!-- Grid: Parâmetros vs KPIs e Crossovers -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <!-- Coluna de Inputs -->
                    <div class="lg:col-span-4 bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                        <div class="flex items-center justify-between">
                            <h3 class="text-xs font-bold font-mono uppercase tracking-wider text-cyan-300">
                                Parâmetros Clínicos &amp; Taxas
                            </h3>
                            <span class="text-[10px] font-mono text-emerald-400">Poupança: ${C.formatNum(m.savingsRate, 1)}%</span>
                        </div>

                        <div class="grid grid-cols-2 gap-2.5">
                            <div>
                                <label class="block text-[11px] font-mono text-slate-400 mb-1">Sessões / Semana</label>
                                <input type="number" id="ind-weekly-sessions" step="1" min="1" max="60" value="${inputs.weeklySessions}"
                                    class="w-full min-h-[40px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-slate-100">
                            </div>
                            <div>
                                <label class="block text-[11px] font-mono text-slate-400 mb-1">Semanas / Mês</label>
                                <input type="number" id="ind-weeks-month" step="0.1" min="1" max="4.5" value="${inputs.weeksPerMonth}"
                                    class="w-full min-h-[40px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-slate-100">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-2.5">
                            <div>
                                <label class="block text-[11px] font-mono text-slate-400 mb-1">Horas Laudos/Sem</label>
                                <input type="number" id="ind-indirect-hours" step="0.5" min="0" max="40" value="${inputs.indirectWeeklyHours}"
                                    class="w-full min-h-[40px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-slate-100">
                            </div>
                            <div>
                                <label class="block text-[11px] font-mono text-slate-400 mb-1">Ticket Médio (R$)</label>
                                <input type="number" id="ind-avg-ticket" step="10" min="0" value="${inputs.avgTicket}"
                                    class="w-full min-h-[40px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-emerald-300">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-2.5">
                            <div>
                                <label class="block text-[11px] font-mono text-slate-400 mb-1">Custos Consultório (R$)</label>
                                <input type="number" id="ind-monthly-costs" step="100" min="0" value="${inputs.monthlyCosts}"
                                    class="w-full min-h-[40px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-rose-300">
                            </div>
                            <div>
                                <label class="block text-[11px] font-mono text-slate-400 mb-1">Aporte Mensal (R$)</label>
                                <input type="number" id="ind-contribution" step="100" min="0" value="${inputs.monthlyContribution}"
                                    class="w-full min-h-[40px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-cyan-300">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-2.5">
                            <div>
                                <label class="block text-[11px] font-mono text-slate-400 mb-1">Patrimônio Atual (R$)</label>
                                <input type="number" id="ind-patrimony" step="1000" min="0" value="${inputs.currentPatrimony}"
                                    class="w-full min-h-[40px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-amber-300">
                            </div>
                            <div>
                                <label class="block text-[11px] font-mono text-slate-400 mb-1">Juro Real (% a.a.)</label>
                                <input type="number" id="ind-annual-return" step="0.1" min="0.5" max="25" value="${inputs.realAnnualReturn}"
                                    class="w-full min-h-[40px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-emerald-300">
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-2.5 pt-1">
                            <div>
                                <label class="block text-[11px] font-mono text-slate-400 mb-1">Taxa Retirada SWR (%)</label>
                                <input type="number" id="ind-swr" step="0.1" min="1" max="8" value="${inputs.safeWithdrawalRate}"
                                    class="w-full min-h-[40px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-sm text-purple-300">
                            </div>
                            <div>
                                <label class="block text-[11px] font-mono text-slate-400 mb-1">Horizonte Gráfico</label>
                                <div class="flex items-center gap-2 mt-1">
                                    <input type="range" id="ind-horizon-slider" min="5" max="30" value="${inputs.horizonYears}" class="w-full accent-cyan-400 cursor-pointer">
                                    <span id="ind-horizon-label" class="text-xs font-mono text-cyan-300 shrink-0">${inputs.horizonYears}a</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Coluna de KPIs, Compra de Liberdade e Crossovers -->
                    <div class="lg:col-span-8 space-y-4">
                        <!-- 3 KPIs Principais -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3.5">
                                <div class="text-xs text-slate-400">Receita Clínica Líquida</div>
                                <div class="text-xl font-mono font-bold text-emerald-300 mt-1">${C.formatBRL(m.netRevenue)}</div>
                                <div class="text-[11px] font-mono text-slate-400 mt-1">Bruta: ${C.formatBRL(m.grossRevenue)} (${C.formatNum(m.monthlySessions, 1)} sessões)</div>
                            </div>

                            <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3.5">
                                <div class="text-xs text-slate-400">Hora Clínica (Efetiva / Direta)</div>
                                <div class="text-xl font-mono font-bold text-cyan-300 mt-1">${C.formatBRL(m.netEffectiveHourly)}<span class="text-xs text-slate-400">/h total</span></div>
                                <div class="text-[11px] font-mono text-slate-400 mt-1">Sessão direta: ${C.formatBRL(m.netPerSession)} (${C.formatNum(m.totalEffectiveHours, 1)}h/mês)</div>
                            </div>

                            <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3.5">
                                <div class="text-xs text-slate-400">Renda Passiva Real Hoje</div>
                                <div class="text-xl font-mono font-bold text-amber-300 mt-1">${C.formatBRL(m.currentPassiveMonthly)}<span class="text-xs text-slate-400">/mês</span></div>
                                <div class="text-[11px] font-mono text-slate-400 mt-1">Já paga <strong>${C.formatNum(m.sessionsPaidToday, 2)} sessões/mês</strong> (${C.formatNum(m.currentCoveragePct, 1)}%)</div>
                            </div>
                        </div>

                        <!-- Card de Compra de Liberdade por Aporte -->
                        <div class="bg-gradient-to-r from-emerald-950/40 via-[#0f172a] to-cyan-950/30 border border-emerald-500/35 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div class="space-y-1">
                                <div class="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-1.5">
                                    <i data-lucide="hourglass" class="w-3.5 h-3.5"></i>
                                    <span>Compra Perpétua de Liberdade por Novo Aporte</span>
                                </div>
                                <p class="text-sm text-slate-200">
                                    Cada único aporte mensal de <strong class="font-mono text-cyan-300">${C.formatBRL(inputs.monthlyContribution)}</strong>
                                    (taxa real composta de <span class="font-mono text-emerald-300">${C.formatNum(m.monthlyRate * 100, 4)}% a.m.</span>)
                                    gera <strong class="font-mono text-emerald-300">${C.formatBRL(m.passivePerSingleContribution)}/mês</strong> perpétuos acima da inflação.
                                </p>
                                <p class="text-xs font-mono text-slate-400">
                                    ${m.contributionsForOneMonthlySession ? `${C.formatNum(m.contributionsForOneMonthlySession, 1)} aportes compram 1 sessão mensal vitalícia.` : ''}
                                </p>
                            </div>
                            <div class="bg-[#090d16]/90 border border-emerald-500/40 rounded-xl px-4 py-3 text-center shrink-0">
                                <div class="text-2xl font-mono font-extrabold text-emerald-300">${C.formatNum(m.sessionsBoughtPerContribution, 2)}</div>
                                <div class="text-[11px] font-mono text-slate-300">sessões/mês compradas p/ sempre</div>
                                <div class="text-[10px] font-mono text-cyan-400 mt-0.5">ou ${C.formatNum(m.effectiveHoursBoughtPerContribution, 2)}h totais/mês</div>
                            </div>
                        </div>

                        <!-- 4 Marcos FIRE Crossover -->
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-3">
                                <div class="text-[10px] font-mono text-slate-400 uppercase">C1 • Lean FIRE</div>
                                <div class="text-xs font-mono text-slate-300 mt-0.5">≥ ${C.formatBRL(m.costs)}</div>
                                <div class="text-xs font-mono font-bold text-slate-100 mt-1">${formatMonthYearFromOffset(m.crossCostMonth)}</div>
                            </div>

                            <div class="bg-[#0f172a] border border-amber-500/30 rounded-xl p-3">
                                <div class="text-[10px] font-mono text-amber-300 uppercase">C2 • Meia-Jornada</div>
                                <div class="text-xs font-mono text-amber-200 mt-0.5">≥ ${C.formatBRL(m.netRevenue * 0.5)}</div>
                                <div class="text-xs font-mono font-bold text-amber-200 mt-1">${formatMonthYearFromOffset(m.crossHalfNetMonth)}</div>
                            </div>

                            <div class="bg-[#0f172a] border border-cyan-500/40 rounded-xl p-3">
                                <div class="text-[10px] font-mono text-cyan-300 uppercase">C3 • Full FIRE</div>
                                <div class="text-xs font-mono text-cyan-200 mt-0.5">≥ ${C.formatBRL(m.netRevenue)}</div>
                                <div class="text-xs font-mono font-bold text-cyan-200 mt-1">${formatMonthYearFromOffset(m.crossFullNetMonth)}</div>
                            </div>

                            <div class="bg-[#0f172a] border border-purple-500/40 rounded-xl p-3">
                                <div class="text-[10px] font-mono text-purple-300 uppercase">C4 • Fat FIRE (140%)</div>
                                <div class="text-xs font-mono text-purple-200 mt-0.5">≥ ${C.formatBRL(m.netRevenue * inputs.fatFireMultiplier)}</div>
                                <div class="text-xs font-mono font-bold text-purple-200 mt-1">${formatMonthYearFromOffset(m.crossFatMonth)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Gráfico Interativo SVG de Curva de Cruzamento -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 class="text-sm font-bold font-mono uppercase tracking-wider text-slate-100">Curva de Crossover: Receita Clínica vs. Renda Passiva Real Mensal</h3>
                            <p class="text-xs text-slate-400">Passe o cursor sobre os anos para inspecionar patrimônio acumulado e cobertura da clínica</p>
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
                        <button type="button" id="btn-ind-toggle-table" class="min-h-[36px] px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-cyan-300">
                            ${tableExpanded ? 'Compactar Tabela' : `Expandir Todos (${m.yearlySeries.length} anos)`}
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

        renderSVGChart(m);
        renderAnnualTable(m);
        bindSimuladorInputs();
    }

    // =========================================================================
    // 7.2. SUB-ABA 2: ANÁLISE DE MERCADO AO VIVO & MACRO BENCHMARKS
    // =========================================================================
    function renderSubTabMercado(container) {
        const C = global.VaultCore;
        const d = liveMarketData || BENCHMARK_DEFAULTS;

        // Análise de Prêmio de Risco Real e Termômetro
        const realYieldNTNB = d.ntnbSpread || 6.45;
        const ifixSpreadOverSelic = (d.ifixYield || 10.85) - (d.selic || 10.75);

        let thermometerTitle = '';
        let thermometerDesc = '';
        let thermometerBadge = '';

        if (realYieldNTNB >= 6.2) {
            thermometerTitle = 'Janela Histórica em Renda Fixa IPCA+ Longa';
            thermometerDesc = 'Taxas reais acima de 6,0% a.a. acima da inflação representam prêmio de risco historicamente raro no Brasil (topo do percentil histórico). Excelente momento para travar aportes de longo prazo em títulos IPCA+ ou debêntures incentivadas de alta qualidade.';
            thermometerBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
        } else {
            thermometerTitle = 'Mercado em Equilíbrio Macroeconômico';
            thermometerDesc = 'Prêmios de risco reais em patamares neutros. Priorize diversificação sistemática e rebalanceamento passivo entre FIIs de tijolo de alta liquidez e ativos internacionais.';
            thermometerBadge = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
        }

        container.innerHTML = `
            <div class="space-y-5">
                <!-- Status do Feed ao Vivo -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5">
                        <span class="w-2.5 h-2.5 rounded-full ${liveMarketStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}"></span>
                        <div class="font-mono text-xs">
                            <span class="text-slate-300 font-bold">Fonte de Dados:</span>
                            <span class="text-cyan-300 ml-1">${d.source || 'AwesomeAPI'}</span>
                            <span class="text-slate-500 ml-2">(${lastMarketFetchTime ? `Última sincronização: ${lastMarketFetchTime}` : 'Aguardando sincronização'})</span>
                        </div>
                    </div>
                    <button type="button" id="btn-refresh-market-inline" class="min-h-[38px] px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5">
                        <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
                        <span>Buscar Cotações Agora</span>
                    </button>
                </div>

                <!-- Cotações de Câmbio & Cripto ao Vivo -->
                <div>
                    <h3 class="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">Câmbio &amp; Moedas Globais (Ao Vivo)</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4">
                            <div class="flex items-center justify-between text-xs text-slate-400 font-mono">
                                <span>Dólar Comercial (USD/BRL)</span>
                                <span class="${(d.usdVar || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-bold">
                                    ${(d.usdVar || 0) >= 0 ? '+' : ''}${C.formatNum(d.usdVar || 0, 2)}%
                                </span>
                            </div>
                            <div class="text-2xl font-mono font-bold text-cyan-300 mt-1">R$ ${C.formatNum(d.usd, 4)}</div>
                            <div class="text-[11px] font-mono text-slate-400 mt-1">Referência para alocação em ETFs e ativos globais</div>
                        </div>

                        <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4">
                            <div class="flex items-center justify-between text-xs text-slate-400 font-mono">
                                <span>Euro Comercial (EUR/BRL)</span>
                                <span class="${(d.eurVar || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-bold">
                                    ${(d.eurVar || 0) >= 0 ? '+' : ''}${C.formatNum(d.eurVar || 0, 2)}%
                                </span>
                            </div>
                            <div class="text-2xl font-mono font-bold text-purple-300 mt-1">R$ ${C.formatNum(d.eur, 4)}</div>
                            <div class="text-[11px] font-mono text-slate-400 mt-1">Poder de compra internacional para viagens e estudos</div>
                        </div>

                        <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4">
                            <div class="flex items-center justify-between text-xs text-slate-400 font-mono">
                                <span>Bitcoin (BTC/BRL)</span>
                                <span class="${(d.btcVar || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-bold">
                                    ${(d.btcVar || 0) >= 0 ? '+' : ''}${C.formatNum(d.btcVar || 0, 2)}%
                                </span>
                            </div>
                            <div class="text-2xl font-mono font-bold text-amber-300 mt-1">R$ ${C.formatNum(d.btc, 0)}</div>
                            <div class="text-[11px] font-mono text-slate-400 mt-1">Reserva descentralizada e hedge assimétrico</div>
                        </div>
                    </div>
                </div>

                <!-- Indicadores Macroeconômicos & Prêmios de Risco Brasil -->
                <div>
                    <h3 class="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2.5">Taxas de Juros &amp; Inflação Brasil (BACEN / ANBIMA)</h3>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5">
                            <div class="text-[11px] font-mono text-slate-400">Taxa Selic Meta</div>
                            <div class="text-xl font-mono font-bold text-emerald-400 mt-1">${C.formatNum(d.selic, 2)}% a.a.</div>
                            <div class="text-[10px] font-mono text-slate-500 mt-0.5">CDI aprox. ${C.formatNum(d.cdi, 2)}% a.a.</div>
                        </div>

                        <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5">
                            <div class="text-[11px] font-mono text-slate-400">Inflação IPCA (12 Meses)</div>
                            <div class="text-xl font-mono font-bold text-amber-400 mt-1">${C.formatNum(d.ipca12m, 2)}% a.a.</div>
                            <div class="text-[10px] font-mono text-slate-500 mt-0.5">Juro real Selic: ~${C.formatNum(d.selic - d.ipca12m, 2)}%</div>
                        </div>

                        <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5">
                            <div class="text-[11px] font-mono text-slate-400">Tesouro IPCA+ (NTN-B Média)</div>
                            <div class="text-xl font-mono font-bold text-cyan-400 mt-1">IPCA + ${C.formatNum(d.ntnbSpread, 2)}%</div>
                            <div class="text-[10px] font-mono text-slate-500 mt-0.5">Juro real líquido garantido</div>
                        </div>

                        <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5">
                            <div class="text-[11px] font-mono text-slate-400">IFIX Médio (Dividend Yield)</div>
                            <div class="text-xl font-mono font-bold text-purple-400 mt-1">${C.formatNum(d.ifixYield, 2)}% a.a.</div>
                            <div class="text-[10px] font-mono text-slate-500 mt-0.5">Isento de IR para PF</div>
                        </div>
                    </div>
                </div>

                <!-- Termômetro Estratégico de Alocação Clínica -->
                <div class="bg-[#0f172a] border border-cyan-500/35 rounded-xl p-5 space-y-3">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <i data-lucide="gauge" class="w-5 h-5 text-cyan-400"></i>
                            <h3 class="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">
                                Termômetro Estratégico de Aporte
                            </h3>
                        </div>
                        <span class="px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${thermometerBadge}">
                            ${thermometerTitle}
                        </span>
                    </div>

                    <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        ${thermometerDesc}
                    </p>

                    <div class="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
                        <span>Diferencial FIIs vs. CDI: <strong class="text-emerald-300">${ifixSpreadOverSelic >= 0 ? '+' : ''}${C.formatNum(ifixSpreadOverSelic, 2)} p.p.</strong></span>
                        <span>Rentabilidade Real Adotada na Aba: <strong class="text-cyan-300">${inputs.realAnnualReturn}% a.a.</strong></span>
                        <button type="button" id="btn-apply-market-rate" class="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs">
                            Aplicar IPCA+ de Mercado (${C.formatNum(d.ntnbSpread, 1)}% a.a.) no Simulador
                        </button>
                    </div>
                </div>
            </div>
        `;

        const btnRefresh = document.getElementById('btn-refresh-market-inline');
        if (btnRefresh) {
            btnRefresh.addEventListener('click', fetchLiveMarketData);
        }

        const btnApplyRate = document.getElementById('btn-apply-market-rate');
        if (btnApplyRate) {
            btnApplyRate.addEventListener('click', () => {
                inputs.realAnnualReturn = Number(d.ntnbSpread.toFixed(1));
                saveInputs();
                inputs.activeSubTab = 'simulador';
                renderSubTabContent();
                C.toast(`Juro real de ${inputs.realAnnualReturn}% a.a. aplicado ao simulador!`, 'success');
            });
        }
    }

    // =========================================================================
    // 7.3. SUB-ABA 3: RECOMENDADOR & REBALANCEADOR DE APORTES
    // =========================================================================
    function renderSubTabAlocador(container) {
        const C = global.VaultCore;
        const res = computeAporteAllocation();

        container.innerHTML = `
            <div class="space-y-5">
                <!-- Painel Superior: Valor a Aportar Este Mês -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span class="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">Rebalanceamento sem Venda de Ativos</span>
                        <h3 class="text-base font-bold text-slate-100 mt-0.5">Alocador Inteligente do Aporte Mensal</h3>
                        <p class="text-xs text-slate-400 mt-1">O algoritmo direciona 100% do novo capital para as classes que estão abaixo da meta percentual, sem gerar imposto ou fricção.</p>
                    </div>

                    <div class="flex items-center gap-3 shrink-0">
                        <div>
                            <label class="block text-[11px] font-mono text-slate-400 mb-1">Aporte Disponível Este Mês</label>
                            <input type="number" id="ind-custom-aporte" step="100" min="0" value="${inputs.customAporteValue}"
                                class="min-h-[42px] px-3.5 py-1.5 rounded-lg bg-[#090d16] border border-cyan-500/50 font-mono text-base font-bold text-cyan-300 w-44">
                        </div>
                    </div>
                </div>

                <!-- Tabela de Alocação Atual vs. Meta vs. Recomendação -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-4">
                    <div class="flex items-center justify-between">
                        <h4 class="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">Distribuição Recomendada do Aporte</h4>
                        <span class="text-xs font-mono text-slate-400">Patrimônio Pós-Aporte: <strong class="text-slate-100">${C.formatBRL(res.totalAfter)}</strong></span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        ${res.classes.map((cls) => `
                            <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
                                <div>
                                    <div class="flex items-center justify-between gap-2">
                                        <span class="px-2 py-0.5 rounded text-[10px] font-mono border ${cls.bgBadge}">${cls.key}</span>
                                        <span class="text-xs font-mono text-slate-400">Meta: <strong class="text-slate-200">${cls.targetPct}%</strong></span>
                                    </div>
                                    <div class="font-bold text-sm text-slate-200 mt-2">${cls.name}</div>
                                    <div class="text-xs font-mono text-slate-400 mt-1">Saldo Atual: ${C.formatBRL(cls.currentVal)} (${C.formatNum(cls.currentPct, 1)}%)</div>
                                </div>

                                <div class="mt-4 pt-3 border-t border-slate-800">
                                    <div class="text-[11px] font-mono text-slate-400">Aportar Este Mês:</div>
                                    <div class="text-xl font-mono font-bold ${cls.color} mt-0.5">${C.formatBRL(cls.recommendedAporte)}</div>
                                    <div class="text-[10px] font-mono text-slate-500 mt-1">Novo Saldo: ${C.formatBRL(cls.postVal)} (${C.formatNum(cls.postPct, 1)}%)</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Configuração Rápida das Metas e Saldos Atuais -->
                    <div class="pt-4 border-t border-slate-800 space-y-3">
                        <div class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">Ajuste de Metas Percentuais &amp; Saldos Atuais</div>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                            <div>
                                <label class="block text-slate-400 mb-1">FIIs Meta (%) / Saldo (R$)</label>
                                <div class="flex gap-1.5">
                                    <input type="number" id="ind-target-fii" value="${inputs.targetAllocFII}" class="w-16 px-2 py-1 rounded bg-[#090d16] border border-slate-700 text-center">
                                    <input type="number" id="ind-curr-fii" value="${inputs.currentAllocFII}" class="flex-1 px-2 py-1 rounded bg-[#090d16] border border-slate-700">
                                </div>
                            </div>

                            <div>
                                <label class="block text-slate-400 mb-1">Renda Fixa (%) / Saldo (R$)</label>
                                <div class="flex gap-1.5">
                                    <input type="number" id="ind-target-rf" value="${inputs.targetAllocRF}" class="w-16 px-2 py-1 rounded bg-[#090d16] border border-slate-700 text-center">
                                    <input type="number" id="ind-curr-rf" value="${inputs.currentAllocRF}" class="flex-1 px-2 py-1 rounded bg-[#090d16] border border-slate-700">
                                </div>
                            </div>

                            <div>
                                <label class="block text-slate-400 mb-1">Ações Brasil (%) / Saldo (R$)</label>
                                <div class="flex gap-1.5">
                                    <input type="number" id="ind-target-acoes" value="${inputs.targetAllocAcoes}" class="w-16 px-2 py-1 rounded bg-[#090d16] border border-slate-700 text-center">
                                    <input type="number" id="ind-curr-acoes" value="${inputs.currentAllocAcoes}" class="flex-1 px-2 py-1 rounded bg-[#090d16] border border-slate-700">
                                </div>
                            </div>

                            <div>
                                <label class="block text-slate-400 mb-1">Global/Dólar (%) / Saldo (R$)</label>
                                <div class="flex gap-1.5">
                                    <input type="number" id="ind-target-global" value="${inputs.targetAllocGlobal}" class="w-16 px-2 py-1 rounded bg-[#090d16] border border-slate-700 text-center">
                                    <input type="number" id="ind-curr-global" value="${inputs.currentAllocGlobal}" class="flex-1 px-2 py-1 rounded bg-[#090d16] border border-slate-700">
                                </div>
                            </div>
                        </div>

                        <div class="flex justify-end">
                            <button type="button" id="btn-save-alloc-settings" class="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold text-xs transition">
                                Salvar Parâmetros de Carteira
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        bindAlocadorInputs();
    }

    // =========================================================================
    // 7.4. SUB-ABA 4: SIMULAÇÃO DE MONTE CARLO & STRESS TEST (Box-Muller)
    // =========================================================================
    function renderSubTabMonteCarlo(container) {
        const C = global.VaultCore;
        const mc = runMonteCarloSimulation();

        container.innerHTML = `
            <div class="space-y-5">
                <!-- Cabeçalho Monte Carlo -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                Análise Estocástica • Box-Muller Normal
                            </span>
                            <span class="text-xs font-mono text-slate-400">Risco de Sequência de Retornos (SORR)</span>
                        </div>
                        <h3 class="text-base font-bold text-slate-100 mt-1">Simulação de Sobrevivência de Capital em 30 Anos</h3>
                    </div>

                    <div class="flex items-center gap-3">
                        <button type="button" id="btn-rerun-montecarlo" class="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition">
                            <i data-lucide="play" class="w-3.5 h-3.5"></i>
                            <span>Rodar 1.000 Cenários</span>
                        </button>
                    </div>
                </div>

                <!-- 3 KPIs de Probabilidade de Sucesso -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div class="bg-[#0f172a] border ${mc.successRate >= 90 ? 'border-emerald-500/40' : 'border-amber-500/40'} rounded-xl p-4">
                        <div class="text-xs text-slate-400">Probabilidade de Sucesso Perpétuo</div>
                        <div class="text-2xl font-mono font-extrabold ${mc.successRate >= 90 ? 'text-emerald-300' : 'text-amber-300'} mt-1">
                            ${C.formatNum(mc.successRate, 1)}%
                        </div>
                        <div class="text-[11px] font-mono text-slate-400 mt-1">Risco de ruína do capital: ${C.formatNum(mc.ruinRate, 1)}%</div>
                    </div>

                    <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
                        <div class="text-xs text-slate-400">Patrimônio Final Mediano (P50)</div>
                        <div class="text-2xl font-mono font-bold text-cyan-300 mt-1">${C.formatBRL(mc.p50)}</div>
                        <div class="text-[11px] font-mono text-slate-400 mt-1">Após ${mc.years} anos com retiradas anuais de ${C.formatBRL(mc.annualWithdrawal)}</div>
                    </div>

                    <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
                        <div class="text-xs text-slate-400">Pior Caso (P10) vs. Melhor Caso (P90)</div>
                        <div class="text-sm font-mono font-bold text-slate-200 mt-1.5">
                            P10: <span class="text-rose-400">${C.formatBRL(mc.p10)}</span>
                        </div>
                        <div class="text-sm font-mono font-bold text-slate-200 mt-0.5">
                            P90: <span class="text-emerald-400">${C.formatBRL(mc.p90)}</span>
                        </div>
                    </div>
                </div>

                <!-- Mini Gráfico de Trajetórias de Monte Carlo (SVG) -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                    <div class="flex items-center justify-between">
                        <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">Amostragem de Trajetórias Estocásticas</h4>
                        <span class="text-[11px] font-mono text-slate-400">Volatilidade Anual: ${inputs.mcVolatility}% a.a.</span>
                    </div>

                    <div class="w-full overflow-x-auto">
                        ${renderMonteCarloSVG(mc)}
                    </div>
                </div>
            </div>
        `;

        const btnRerun = document.getElementById('btn-rerun-montecarlo');
        if (btnRerun) {
            btnRerun.addEventListener('click', () => {
                renderSubTabContent();
                C.toast('1.000 cenários de Monte Carlo recalculados!', 'info');
            });
        }
    }

    function renderMonteCarloSVG(mc) {
        const svgW = 960;
        const svgH = 260;
        const padL = 70;
        const padR = 24;
        const padT = 20;
        const padB = 30;
        const plotW = svgW - padL - padR;
        const plotH = svgH - padT - padB;

        const allVals = mc.trajectoriesSample.flat();
        const maxVal = Math.max(...allVals, 100000);

        const getX = (yrIdx) => padL + (yrIdx / mc.years) * plotW;
        const getY = (val) => padT + plotH - (Math.min(maxVal, Math.max(0, val)) / maxVal) * plotH;

        let pathsSvg = '';
        const colors = ['#38bdf8', '#34d399', '#a78bfa', '#f472b6', '#fbbf24', '#60a5fa'];

        mc.trajectoriesSample.forEach((path, idx) => {
            const pts = path.map((val, yr) => `${getX(yr)},${getY(val)}`).join(' ');
            const c = colors[idx % colors.length];
            pathsSvg += `<polyline points="${pts}" fill="none" stroke="${c}" stroke-width="1.3" stroke-opacity="0.55"/>`;
        });

        // Linha de Zero (Ruína)
        const yZero = getY(0);

        return `
            <svg viewBox="0 0 ${svgW} ${svgH}" class="w-full h-auto select-none" role="img" aria-label="Simulação de Monte Carlo">
                <line x1="${padL}" y1="${yZero}" x2="${svgW - padR}" y2="${yZero}" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4 4"/>
                <text x="${padL - 6}" y="${yZero + 3}" text-anchor="end" fill="#f43f5e" font-family="JetBrains Mono, monospace" font-size="10">R$ 0 (Ruína)</text>
                ${pathsSvg}
                <text x="${svgW - padR}" y="${svgH - 10}" text-anchor="end" fill="#64748b" font-family="JetBrains Mono, monospace" font-size="10">${mc.years} anos</text>
            </svg>
        `;
    }

    // =========================================================================
    // 7.5. SUB-ABA 5: CASCATA DE COBERTURA DE DESPESAS (Níveis de Liberdade)
    // =========================================================================
    function renderSubTabCascata(container) {
        const C = global.VaultCore;
        const cascade = computeExpenseCascade();

        container.innerHTML = `
            <div class="space-y-5">
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <span class="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">Cascata de Emancipação Temporal</span>
                        <h3 class="text-base font-bold text-slate-100 mt-0.5">Quais despesas da sua vida o patrimônio atual já paga?</h3>
                        <p class="text-xs text-slate-400 mt-1">Renda Passiva Atual: <strong class="text-emerald-300 font-mono">${C.formatBRL(cascade.passive)}/mês</strong> (${C.formatNum(cascade.globalCoverage, 1)}% do custo total de ${C.formatBRL(cascade.totalCost)})</p>
                    </div>

                    <div class="w-44 bg-[#090d16] border border-slate-800 rounded-xl p-3 text-center">
                        <div class="text-[10px] font-mono text-slate-400">Cobertura Global</div>
                        <div class="text-xl font-mono font-bold ${cascade.globalCoverage >= 100 ? 'text-emerald-300' : 'text-cyan-300'}">
                            ${C.formatNum(cascade.globalCoverage, 1)}%
                        </div>
                    </div>
                </div>

                <!-- Lista dos 4 Níveis em Cascata -->
                <div class="space-y-3">
                    ${cascade.tiers.map((t) => `
                        <div class="bg-[#0f172a] border ${t.isFullyCovered ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-[#1e293b]'} rounded-xl p-4 space-y-2.5">
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${t.isFullyCovered ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'}">
                                            ${t.isFullyCovered ? '✓ 100% Coberto' : `${C.formatNum(t.coveragePct, 1)}% Coberto`}
                                        </span>
                                        <h4 class="font-bold text-sm text-slate-100">${t.name}</h4>
                                    </div>
                                    <p class="text-xs text-slate-400 mt-1">${t.desc}</p>
                                </div>
                                <div class="text-right shrink-0">
                                    <div class="text-base font-mono font-bold text-slate-100">${C.formatBRL(t.cost)}<span class="text-xs text-slate-400">/mês</span></div>
                                    <div class="text-[10px] font-mono text-slate-500">Acumulado: ${C.formatBRL(t.accumulatedCost)}</div>
                                </div>
                            </div>

                            <!-- Barra de Progresso do Nível -->
                            <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                                <div class="h-full ${t.isFullyCovered ? 'bg-emerald-400' : 'bg-cyan-400'} transition-all duration-300" style="width: ${t.coveragePct}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // =========================================================================
    // 8. GRÁFICO SVG DE CRUZAMENTO & TABELA ANUAL
    // =========================================================================
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
        const yMax = Math.max(m.netRevenue * 1.25, maxPassive * 1.08, m.costs * 1.2, 1000);

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

        // Linhas horizontais de referência
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
            btnToggle.textContent = tableExpanded ? 'Compactar Tabela' : `Expandir Todos (${m.yearlySeries.length} anos)`;
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

    // =========================================================================
    // 9. BINDINGS DE EVENTOS
    // =========================================================================
    function bindShellEvents() {
        const C = global.VaultCore;

        // Sub-Tabs
        document.querySelectorAll('[data-ind-subtab]').forEach((btn) => {
            btn.addEventListener('click', () => {
                inputs.activeSubTab = btn.getAttribute('data-ind-subtab');
                saveInputs();
                renderSubTabContent();
            });
        });

        // Botão Atualizar Mercado
        const btnFetchMarket = document.getElementById('btn-ind-fetch-market');
        if (btnFetchMarket) {
            btnFetchMarket.addEventListener('click', fetchLiveMarketData);
        }

        // Botão Restaurar
        const btnReset = document.getElementById('btn-ind-reset');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                inputs = Object.assign({}, DEFAULT_INPUTS);
                saveInputs();
                renderSubTabContent();
                C.toast('Parâmetros de independência financeira restaurados para o padrão.', 'info');
            });
        }

        // Botão Exportar CSV
        const btnExportCSV = document.getElementById('btn-ind-export-csv');
        if (btnExportCSV) {
            btnExportCSV.addEventListener('click', () => {
                if (!lastModel) lastModel = computeFinancialModel();
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
                C.toast('Projeção financeira exportada em CSV.', 'success');
            });
        }
    }

    function bindSimuladorInputs() {
        const mapIds = {
            'ind-weekly-sessions': 'weeklySessions',
            'ind-weeks-month': 'weeksPerMonth',
            'ind-indirect-hours': 'indirectWeeklyHours',
            'ind-avg-ticket': 'avgTicket',
            'ind-monthly-costs': 'monthlyCosts',
            'ind-contribution': 'monthlyContribution',
            'ind-patrimony': 'currentPatrimony',
            'ind-annual-return': 'realAnnualReturn',
            'ind-swr': 'safeWithdrawalRate',
            'ind-horizon-slider': 'horizonYears'
        };

        Object.entries(mapIds).forEach(([domId, prop]) => {
            const el = document.getElementById(domId);
            if (!el) return;
            el.addEventListener('input', (e) => {
                inputs[prop] = Number(e.target.value);
                if (prop === 'horizonYears') {
                    const lbl = document.getElementById('ind-horizon-label');
                    if (lbl) lbl.textContent = `${inputs.horizonYears}a`;
                }
                saveInputs();
                lastModel = computeFinancialModel();
                renderSVGChart(lastModel);
                renderAnnualTable(lastModel);
            });
        });

        const btnToggleTable = document.getElementById('btn-ind-toggle-table');
        if (btnToggleTable) {
            btnToggleTable.addEventListener('click', () => {
                tableExpanded = !tableExpanded;
                if (lastModel) renderAnnualTable(lastModel);
            });
        }
    }

    function bindAlocadorInputs() {
        const C = global.VaultCore;

        const customAporteInput = document.getElementById('ind-custom-aporte');
        if (customAporteInput) {
            customAporteInput.addEventListener('input', (e) => {
                inputs.customAporteValue = Number(e.target.value);
                saveInputs();
                renderSubTabContent();
            });
        }

        const btnSaveAlloc = document.getElementById('btn-save-alloc-settings');
        if (btnSaveAlloc) {
            btnSaveAlloc.addEventListener('click', () => {
                inputs.targetAllocFII = Number(document.getElementById('ind-target-fii').value) || 0;
                inputs.currentAllocFII = Number(document.getElementById('ind-curr-fii').value) || 0;

                inputs.targetAllocRF = Number(document.getElementById('ind-target-rf').value) || 0;
                inputs.currentAllocRF = Number(document.getElementById('ind-curr-rf').value) || 0;

                inputs.targetAllocAcoes = Number(document.getElementById('ind-target-acoes').value) || 0;
                inputs.currentAllocAcoes = Number(document.getElementById('ind-curr-acoes').value) || 0;

                inputs.targetAllocGlobal = Number(document.getElementById('ind-target-global').value) || 0;
                inputs.currentAllocGlobal = Number(document.getElementById('ind-curr-global').value) || 0;

                saveInputs();
                renderSubTabContent();
                C.toast('Metas e saldos de carteira atualizados com sucesso.', 'success');
            });
        }
    }

    // =========================================================================
    // 10. INICIALIZAÇÃO
    // =========================================================================
    function init() {
        loadInputs();
        mountShell();

        // Faz busca de mercado em segundo plano
        setTimeout(() => {
            fetchLiveMarketData();
        }, 300);

        window.addEventListener('vault:restored', () => {
            loadInputs();
            renderSubTabContent();
        });
    }

    global.VaultTabIndependencia = {
        init,
        computeFinancialModel,
        fetchLiveMarketData
    };
})(window);
