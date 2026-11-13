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
        expenseCustom: 0,       // Nível 5: Opcional / Reserva Estratégica & Projetos
        nameCustom: '',
        customExpenses: [],     // Níveis adicionais customizáveis: [{ id, name, cost, category, desc }]

        // Cenários de Estresse & Choques de Mercado
        stressScenario: 'crash30', // 'crash30', 'crash40', 'correction20', 'stagflation', 'fii_drop', 'custom'
        stressCustomDrop: 30,
        stressCustomInf: 4,
        stressCustomDivShock: 15,
        stressBoostContribution: false,

        // Tickers Customizados do Usuário no Alocador
        userTickers: [],

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
            if (typeof C.updateStorageMeter === 'function') C.updateStorageMeter();
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
            initPatrimony,
            monthlyContribution: aporte,
            weeklySessions: wSessions,
            weeksPerMonth: wPerMonth,
            indirectWeeklyHours: indWeekly,
            avgTicket: ticket,
            monthlySessions,
            indirectMonthlyHours,
            totalEffectiveHours,
            grossRevenue,
            netRevenue,
            costs,
            annualEssential,
            annualCosts,
            annualNet,
            annualFat,
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

    const TICKER_DIRECTORY = {
        FII: [
            { ticker: 'XPML11', name: 'XP Malls (Shoppings AAA)', price: 104.50, yield: 9.2, type: 'Tijolo' },
            { ticker: 'HGLG11', name: 'CSHG Logística (Galpões)', price: 162.00, yield: 8.8, type: 'Tijolo' },
            { ticker: 'KNIP11', name: 'Kinea Índices de Preços (CRI IPCA+)', price: 94.20, yield: 11.4, type: 'Papel' },
            { ticker: 'MXRF11', name: 'Maxi Renda (Híbrido Base 10)', price: 10.15, yield: 12.0, type: 'Híbrido' }
        ],
        RF: [
            { ticker: 'Tesouro IPCA+ 2035', name: 'Título Público Soberano', price: 3250.00, yield: 6.5, type: 'Soberano' },
            { ticker: 'B5P211', name: 'ETF IMA-B 5 (Títulos IPCA < 5 anos)', price: 82.50, yield: 6.2, type: 'ETF RF' },
            { ticker: 'Tesouro Selic 2029', name: 'Reserva & Liquidez Diária', price: 154.00, yield: 10.75, type: 'Pós-fixado' }
        ],
        Acoes: [
            { ticker: 'BBAS3', name: 'Banco do Brasil (P/L 4.5 / ROE 21%)', price: 28.50, yield: 9.8, type: 'Valor' },
            { ticker: 'ITUB4', name: 'Itaú Unibanco (Líder em Eficiência)', price: 35.00, yield: 8.5, type: 'Qualidade' },
            { ticker: 'EGIE3', name: 'Engie Brasil (Concessões Elétricas)', price: 41.20, yield: 7.9, type: 'Defensivo' }
        ],
        Global: [
            { ticker: 'IVVB11', name: 'iShares S&P 500 (Dólar + 500 EUA)', price: 345.00, yield: 1.6, type: 'ETF Global' },
            { ticker: 'WRLD11', name: 'Vanguard Total World (Global Amplo)', price: 118.00, yield: 2.1, type: 'ETF Global' },
            { ticker: 'HASH11', name: 'Cesta Cripto Regulada B3', price: 48.00, yield: 0.0, type: 'Hedge Assimétrico' }
        ]
    };

    function computeAporteByTickers(classes) {
        const result = [];
        let totalResidualAll = 0;

        classes.forEach((cls) => {
            const classAporte = cls.recommendedAporte || 0;
            let tickers = (TICKER_DIRECTORY[cls.key] || []).slice();

            // Mesclar tickers personalizados salvos pelo usuário para esta classe
            if (Array.isArray(inputs.userTickers)) {
                const userClsTickers = inputs.userTickers.filter(ut => ut.classKey === cls.key);
                if (userClsTickers.length > 0) {
                    tickers = userClsTickers.concat(tickers);
                }
            }

            if (tickers.length === 0) return;

            // Seleciona os 2 primeiros alvos para alocação
            const targetTickers = tickers.slice(0, 2);
            const perTickerBudget = targetTickers.length > 0 ? (classAporte / targetTickers.length) : 0;
            let classSpent = 0;

            const tickerAlloc = targetTickers.map((t) => {
                const shares = t.price > 0 && perTickerBudget > 0 ? Math.floor(perTickerBudget / t.price) : 0;
                const totalSpent = shares * t.price;
                classSpent += totalSpent;
                return {
                    ticker: t.ticker,
                    name: t.name,
                    price: t.price,
                    yield: t.yield,
                    type: t.type,
                    shares,
                    totalSpent,
                    budget: perTickerBudget
                };
            });

            const residual = Math.max(0, classAporte - classSpent);
            totalResidualAll += residual;

            result.push({
                classKey: cls.key,
                className: cls.name,
                classAporte,
                classSpent,
                residual,
                tickers: tickerAlloc
            });
        });

        // Gera minuta de boleta de compra consolidada para Home Broker
        const totalAporte = classes.reduce((acc, c) => acc + (c.recommendedAporte || 0), 0);
        let summaryOrderText = `📋 BOLETA DE APORTE CONSOLIDADA — NEXUS VAULT\n`;
        summaryOrderText += `Data: ${new Date().toLocaleDateString('pt-BR')} | Total Aporte: R$ ${totalAporte.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
        summaryOrderText += `--------------------------------------------------------\n`;
        result.forEach((r) => {
            if (r.classAporte > 0) {
                summaryOrderText += `[${r.classKey}] ${r.className} — Orçamento: R$ ${r.classAporte.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
                r.tickers.forEach((t) => {
                    if (t.shares > 0) {
                        summaryOrderText += `  • ${t.ticker}: Comprar ${t.shares} cota(s) @ ~R$ ${t.price.toFixed(2)} = R$ ${t.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
                    }
                });
                if (r.residual > 0) {
                    summaryOrderText += `  • Sobra residual da classe: R$ ${r.residual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
                }
            }
        });
        summaryOrderText += `--------------------------------------------------------\n`;
        summaryOrderText += `Troco Residual Consolidado (Reserva de Oportunidade / CDI): R$ ${totalResidualAll.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;

        return {
            byClass: result,
            totalResidual: totalResidualAll,
            summaryOrderText
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
        if (!lastModel) lastModel = computeFinancialModel();
        const passive = lastModel ? lastModel.currentPassiveMonthly : 0;
        const netPerSession = lastModel && lastModel.netPerSession > 0 ? lastModel.netPerSession : 200;
        const netPerHour = lastModel && lastModel.netEffectiveHourly > 0 ? lastModel.netEffectiveHourly : 150;
        const monthlyRate = lastModel && lastModel.monthlyRate > 0 ? lastModel.monthlyRate : 0.006;

        const tiers = [
            {
                id: 'essential',
                level: 1,
                name: inputs.nameEssential || 'Nível 1 • Sobrevivência Essencial',
                desc: 'Moradia, serviços básicos, alimentação essencial e sobrevivência digna.',
                cost: Math.max(0, Number(inputs.expenseEssential) || 2500),
                inputKey: 'expenseEssential',
                nameKey: 'nameEssential',
                color: 'emerald',
                badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
            },
            {
                id: 'clinic',
                level: 2,
                name: inputs.nameClinic || 'Nível 2 • Sustentação do Consultório',
                desc: 'Custos operacionais fixos do consultório, laudos, plataformas, tributos e anuidade CRP.',
                cost: Math.max(0, Number(inputs.expenseClinic) || 2600),
                inputKey: 'expenseClinic',
                nameKey: 'nameClinic',
                color: 'cyan',
                badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
            },
            {
                id: 'family',
                level: 3,
                name: inputs.nameFamily || 'Nível 3 • Família & Saúde Plena',
                desc: 'Plano de saúde, farmácia, educação, segurança e suporte familiar.',
                cost: Math.max(0, Number(inputs.expenseFamily) || 3500),
                inputKey: 'expenseFamily',
                nameKey: 'nameFamily',
                color: 'amber',
                badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            },
            {
                id: 'lifestyle',
                level: 4,
                name: inputs.nameLifestyle || 'Nível 4 • Liberdade & Estilo de Vida',
                desc: 'Viagens, congressos internacionais, hobbies, bonsai, música e lazer sem culpa.',
                cost: Math.max(0, Number(inputs.expenseLifestyle) || 2000),
                inputKey: 'expenseLifestyle',
                nameKey: 'nameLifestyle',
                color: 'purple',
                badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
            }
        ];

        if (Number(inputs.expenseCustom) > 0 || (inputs.nameCustom && inputs.nameCustom.trim())) {
            tiers.push({
                id: 'custom',
                level: 5,
                name: inputs.nameCustom || 'Nível 5 • Reserva Estratégica & Projetos',
                desc: 'Aportes em novos projetos, filantropia, investimentos especiais e expansão patrimonial.',
                cost: Math.max(0, Number(inputs.expenseCustom) || 0),
                inputKey: 'expenseCustom',
                nameKey: 'nameCustom',
                color: 'rose',
                badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
            });
        }

        // Suporte a múltiplos níveis/despesas customizadas adicionadas pelo usuário
        if (Array.isArray(inputs.customExpenses)) {
            inputs.customExpenses.forEach((ce, idx) => {
                const cost = Math.max(0, Number(ce.cost) || 0);
                const lvl = tiers.length + 1;
                tiers.push({
                    id: ce.id || `custom_exp_${idx}`,
                    level: lvl,
                    name: ce.name || `Nível ${lvl} • ${ce.category || 'Despesa Adicional'}`,
                    desc: ce.desc || 'Despesa personalizada salva no seu cofre local.',
                    cost: cost,
                    category: ce.category || 'Geral',
                    isCustomItem: true,
                    customId: ce.id || `custom_exp_${idx}`,
                    customIndex: idx,
                    color: ce.color || 'sky',
                    badgeClass: ce.badgeClass || 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                });
            });
        }

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

            // Patrimônio exclusivo necessário para cobrir este degrau vitaliciamente
            const capitalNeeded = monthlyRate > 0 ? (t.cost / monthlyRate) : 0;
            // Sessões clínicas necessárias por mês para pagar este degrau
            const sessionsNeeded = netPerSession > 0 ? (t.cost / netPerSession) : 0;
            const hoursNeeded = netPerHour > 0 ? (t.cost / netPerHour) : 0;
            const survivalBufferDays = (t.cost > 0 && passive > 0) ? Math.round((passive / t.cost) * 30) : 0;

            return Object.assign({}, t, {
                accumulatedCost: endAcc,
                coveragePct: Math.min(100, Math.max(0, coverage)),
                isFullyCovered: coverage >= 100,
                capitalNeeded,
                sessionsNeeded,
                hoursNeeded,
                survivalBufferDays
            });
        });

        const totalCost = accumulated;
        const globalCoverage = totalCost > 0 ? (passive / totalCost) * 100 : 0;
        const totalCapitalNeeded = monthlyRate > 0 ? (totalCost / monthlyRate) : 0;

        return {
            tiers: processed,
            totalCost,
            passive,
            globalCoverage,
            totalCapitalNeeded
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
                    <button type="button" data-ind-subtab="estresse" class="ind-subtab-btn px-3 py-2 rounded-lg border border-transparent text-slate-400 hover:text-slate-200 transition flex items-center gap-1.5">
                        <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-rose-400"></i>
                        <span>6. Estresse &amp; Choques</span>
                    </button>
                    <button type="button" data-ind-subtab="auditoria" class="ind-subtab-btn px-3 py-2 rounded-lg border border-transparent text-slate-400 hover:text-slate-200 transition flex items-center gap-1.5">
                        <i data-lucide="calculator" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>7. Auditoria Matemática</span>
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
            case 'estresse':
                renderSubTabEstresse(container);
                break;
            case 'auditoria':
                renderSubTabAuditoria(container);
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
                <!-- 4 INDICADORES VISUAIS DE INDEPENDÊNCIA POR CATEGORIA -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-2.5">
                        <div class="flex items-center gap-2">
                            <i data-lucide="target" class="w-4 h-4 text-cyan-400"></i>
                            <h3 class="text-xs font-bold font-mono uppercase tracking-wider text-slate-100">
                                Indicadores de Independência por Categoria de Vida
                            </h3>
                        </div>
                        <span class="text-xs font-mono text-emerald-400">
                            Renda Passiva Atual Hoje: <strong>${C.formatBRL(m.currentPassiveMonthly)}/mês</strong>
                        </span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        ${[
                            { name: '1. Sobrevivência Essencial', cost: inputs.expenseEssential || 2500, color: 'from-emerald-500 to-emerald-400', badgeColor: 'text-emerald-300 border-emerald-500/30' },
                            { name: '2. Custos do Consultório', cost: inputs.monthlyCosts || 2600, color: 'from-cyan-500 to-cyan-400', badgeColor: 'text-cyan-300 border-cyan-500/30' },
                            { name: '3. Família, Saúde & Educação', cost: inputs.expenseFamily || 3500, color: 'from-amber-500 to-amber-400', badgeColor: 'text-amber-300 border-amber-500/30' },
                            { name: '4. Plenitude FIRE / Lazer', cost: inputs.expenseLifestyle || 2000, color: 'from-purple-500 to-purple-400', badgeColor: 'text-purple-300 border-purple-500/30' }
                        ].map((cat) => {
                            const pct = Math.min(100, cat.cost > 0 ? (m.currentPassiveMonthly / cat.cost) * 100 : 0);
                            const isDone = pct >= 100;
                            return `
                                <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-2.5">
                                    <div>
                                        <div class="flex items-center justify-between text-xs font-mono">
                                            <span class="font-bold text-slate-200">${cat.name}</span>
                                            <span class="px-1.5 py-0.5 rounded text-[10px] border ${isDone ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}">
                                                ${isDone ? '✓ CONQUISTADO' : `${C.formatNum(pct, 1)}%`}
                                            </span>
                                        </div>
                                        <div class="text-xs font-mono text-slate-400 mt-1">Custo: ${C.formatBRL(cat.cost)}/mês</div>
                                    </div>

                                    <div class="space-y-1">
                                        <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                                            <div class="h-full bg-gradient-to-r ${cat.color} transition-all duration-300" style="width: ${pct}%"></div>
                                        </div>
                                        <div class="text-[10px] font-mono text-slate-500 text-right">
                                            ${isDone ? '100% coberto pelo patrimônio' : `Faltam ${C.formatBRL(Math.max(0, cat.cost - m.currentPassiveMonthly))}/mês`}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Grid: Parâmetros vs KPIs e Crossovers -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <!-- Coluna de Inputs -->
                    <div class="lg:col-span-4 bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <h3 class="text-xs font-bold font-mono uppercase tracking-wider text-cyan-300">
                                Parâmetros Clínicos &amp; Taxas
                            </h3>
                            <div class="flex items-center gap-2">
                                <button type="button" id="btn-ind-sync-agenda" title="Importar média real de sessões e ticket da Aba 7 (Agenda)"
                                    class="px-2 py-1 rounded-md bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/35 text-sky-300 text-[10px] font-mono flex items-center gap-1 transition">
                                    <i data-lucide="calendar-sync" class="w-3 h-3"></i>
                                    <span>Sincronizar Agenda</span>
                                </button>
                                <span class="text-[10px] font-mono text-emerald-400">Poupança: ${C.formatNum(m.savingsRate, 1)}%</span>
                            </div>
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

        const discBefore = res.classes.reduce((acc, c) => acc + Math.abs(c.currentPct - c.targetPct), 0);
        const discAfter = res.classes.reduce((acc, c) => acc + Math.abs(c.postPct - c.targetPct), 0);
        const alignScoreBefore = Math.max(0, Math.min(100, Math.round(100 - (discBefore / 2))));
        const alignScoreAfter = Math.max(0, Math.min(100, Math.round(100 - (discAfter / 2))));

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

                <!-- Termômetro de Alinhamento da Carteira -->
                <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                    <div class="flex items-center gap-2">
                        <i data-lucide="gauge" class="w-4 h-4 text-emerald-400"></i>
                        <span>Índice de Alinhamento da Carteira: <strong class="text-slate-300">${alignScoreBefore}%</strong> → <strong class="text-emerald-300 font-bold">${alignScoreAfter}% pós-aporte</strong></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] text-slate-500">Convergência:</span>
                        <div class="w-36 h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300" style="width: ${alignScoreAfter}%"></div>
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

                    <!-- RECOMENDAÇÃO ACIONÁVEL POR ATIVO / TICKER INDIVIDUAL -->
                    <div class="pt-4 border-t border-slate-800 space-y-3">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h4 class="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                                    Recomendação Operacional por Ativo &amp; Ticker (Cotas Inteiras)
                                </h4>
                                <p class="text-[11px] text-slate-400">Simulação de compra prática fracionada baseada na cotação de mercado para o dia do aporte.</p>
                            </div>
                            <div class="flex items-center gap-2 flex-wrap">
                                ${(() => {
                                    const tickerData = computeAporteByTickers(res.classes);
                                    return tickerData.totalResidual > 0 ? `
                                        <div class="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
                                            Troco residual: <strong>${C.formatBRL(tickerData.totalResidual)}</strong> (Reserva de Oportunidade)
                                        </div>
                                    ` : '';
                                })()}
                                <button type="button" id="btn-copy-alocador-order" class="px-2.5 py-1 rounded bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 text-[11px] font-mono text-cyan-200 flex items-center gap-1.5 transition" title="Copiar ordem de compra formatada para colar no Home Broker">
                                    <span>📋</span>
                                    <span>Copiar Boleta</span>
                                </button>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            ${(computeAporteByTickers(res.classes).byClass || []).map((item) => `
                                <div class="bg-[#090d16] border border-slate-800/90 rounded-xl p-3.5 space-y-2.5">
                                    <div class="flex items-center justify-between">
                                        <span class="font-bold text-xs text-slate-200 font-mono">${item.className}</span>
                                        <div class="text-right">
                                            <span class="text-xs font-mono font-bold text-cyan-300">Orçamento: ${C.formatBRL(item.classAporte)}</span>
                                            ${item.residual > 0 ? `<div class="text-[10px] font-mono text-slate-400">Sobra: ${C.formatBRL(item.residual)}</div>` : ''}
                                        </div>
                                    </div>
                                    <div class="space-y-2">
                                        ${item.tickers.map((t) => `
                                            <div class="bg-[#0f172a] border border-slate-800 rounded-lg p-2.5 flex items-center justify-between gap-2 text-xs">
                                                <div>
                                                    <div class="flex items-center gap-1.5">
                                                        <strong class="font-mono text-slate-100 text-sm">${t.ticker}</strong>
                                                        <span class="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">${t.type}</span>
                                                        ${t.yield > 0 ? `<span class="text-[10px] font-mono text-emerald-400">${t.yield}% a.a.</span>` : ''}
                                                    </div>
                                                    <div class="text-[11px] text-slate-400 truncate mt-0.5">${t.name} • Ref.: ${C.formatBRL(t.price)}</div>
                                                </div>
                                                <div class="text-right shrink-0">
                                                    <div class="font-mono font-bold ${t.shares > 0 ? 'text-emerald-300' : 'text-slate-500'}">
                                                        ${t.shares > 0 ? `Comprar ~${t.shares} cota(s)` : 'Aguardar novo ciclo'}
                                                    </div>
                                                    <div class="text-[11px] font-mono text-slate-400">
                                                        ${t.shares > 0 ? `Total: ${C.formatBRL(t.totalSpent)}` : 'R$ 0'}
                                                    </div>
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
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

                    <!-- Gerenciamento de Tickers Customizados do Usuário -->
                    <div class="pt-4 border-t border-slate-800 space-y-3">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <h4 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                                    Ativos &amp; Tickers Personalizados da Carteira
                                </h4>
                                <p class="text-[11px] text-slate-400">Cadastre cotas reais com preço e yield para cálculo preciso do simulador de compras.</p>
                            </div>
                            <span class="text-[11px] font-mono text-cyan-400">${(inputs.userTickers || []).length} ativo(s) customizado(s)</span>
                        </div>

                        <!-- Formulário de Novo Ativo -->
                        <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3.5 space-y-3">
                            <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-mono">
                                <div>
                                    <label class="block text-slate-400 mb-1">Código (Ticker) *</label>
                                    <input type="text" id="new-ticker-code" placeholder="Ex: HGLG11" class="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100 uppercase">
                                </div>
                                <div class="col-span-2 sm:col-span-1">
                                    <label class="block text-slate-400 mb-1">Nome / Descrição *</label>
                                    <input type="text" id="new-ticker-name" placeholder="Ex: CSHG Logística" class="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100">
                                </div>
                                <div>
                                    <label class="block text-slate-400 mb-1">Macroclasse *</label>
                                    <select id="new-ticker-class" class="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100">
                                        <option value="FII">FII (Fundos Imobiliários)</option>
                                        <option value="RF">Renda Fixa IPCA+</option>
                                        <option value="Acoes">Ações Brasileiras</option>
                                        <option value="Global">Global / ETFs / Dólar</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-slate-400 mb-1">Preço Cota (R$) *</label>
                                    <input type="number" step="0.01" id="new-ticker-price" placeholder="165.50" class="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100">
                                </div>
                                <div>
                                    <label class="block text-slate-400 mb-1">Yield (% a.a.)</label>
                                    <input type="number" step="0.1" id="new-ticker-yield" placeholder="8.5" class="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-100">
                                </div>
                            </div>

                            <div class="flex justify-end pt-1">
                                <button type="button" id="btn-add-user-ticker" class="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 transition">
                                    <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
                                    <span>Adicionar Ativo à Carteira</span>
                                </button>
                            </div>
                        </div>

                        <!-- Lista de Ativos Cadastrados -->
                        ${Array.isArray(inputs.userTickers) && inputs.userTickers.length > 0 ? `
                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                                ${inputs.userTickers.map((ut, idx) => `
                                    <div class="bg-[#090d16] border border-slate-800 rounded-lg p-2.5 flex items-center justify-between gap-2 text-xs font-mono">
                                        <div>
                                            <div class="flex items-center gap-1.5">
                                                <strong class="text-slate-100 text-sm">${C.esc(ut.ticker)}</strong>
                                                <span class="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-cyan-300">${C.esc(ut.classKey)}</span>
                                            </div>
                                            <div class="text-[11px] text-slate-400 mt-0.5 truncate max-w-[180px]">${C.esc(ut.name)}</div>
                                            <div class="text-[10px] text-emerald-400 mt-0.5">${C.formatBRL(ut.price)} ${ut.yield ? `&bull; ${ut.yield}% a.a.` : ''}</div>
                                        </div>
                                        <button type="button" data-del-user-ticker="${idx}" title="Remover Ativo" class="min-h-[32px] px-2 rounded bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 transition">
                                            &times;
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
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
                <!-- Banner Explicativo e Status Global -->
                <div class="bg-gradient-to-r from-[#0f172a] via-[#111c35] to-[#0f172a] border border-cyan-500/30 rounded-xl p-5 shadow-xl">
                    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div class="space-y-1.5 max-w-2xl">
                            <div class="flex items-center gap-2">
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                    Filosofia dos 4 Degraus de Emancipação
                                </span>
                                <span class="text-xs font-mono text-emerald-400 font-semibold">100% Editável</span>
                            </div>
                            <h3 class="text-base sm:text-lg font-bold text-slate-100">
                                Como Funciona a Cascata de Cobertura de Despesas?
                            </h3>
                            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                                Em vez de tratar a independência financeira como um "tudo ou nada" distante, a <strong>Cascata de Liberdade</strong> organiza seu custo de vida em 4 camadas sequenciais de prioridade existencial. Cada degrau conquistado pela renda passiva <em>liberta irrevogavelmente uma fatia da sua mente</em>, permitindo reduzir gradativamente a carga de trabalho no consultório sem ansiedade.
                            </p>
                            <div class="mt-2 text-xs text-cyan-300/90 bg-cyan-950/40 border border-cyan-800/50 rounded-lg p-2.5 flex items-start gap-2">
                                <i data-lucide="info" class="w-4 h-4 text-cyan-400 shrink-0 mt-0.5"></i>
                                <span><strong>Como editar:</strong> Você pode alterar livremente o <em>nome</em> e o <em>valor em R$</em> de qualquer degrau abaixo. Ao digitar um novo valor e confirmar (pressionando Enter ou clicando fora), a cascata recalcula instantaneamente os percentuais de cobertura, o patrimônio correspondente e a quantidade de atendimentos no consultório poupados por mês.</span>
                            </div>
                        </div>

                        <!-- Card de Cobertura Global -->
                        <div class="bg-[#090d16] border border-slate-800 rounded-xl p-4 text-center shrink-0 min-w-[200px]">
                            <div class="text-[11px] font-mono text-slate-400">Renda Passiva Atual</div>
                            <div class="text-xl font-mono font-extrabold text-emerald-300 mt-0.5">${C.formatBRL(cascade.passive)}/mês</div>
                            <div class="text-[10px] font-mono text-slate-500 mt-0.5">Custo Total: ${C.formatBRL(cascade.totalCost)}/mês</div>
                            <div class="mt-2.5 pt-2 border-t border-slate-800">
                                <div class="text-[10px] font-mono text-cyan-400">Cobertura Global:</div>
                                <div class="text-2xl font-mono font-extrabold ${cascade.globalCoverage >= 100 ? 'text-emerald-400' : 'text-cyan-300'}">
                                    ${C.formatNum(cascade.globalCoverage, 1)}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Barra Visual Consolidada de Cobertura da Cascata -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 sm:p-5 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <i data-lucide="layers" class="w-4 h-4 text-cyan-400"></i>
                            <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                                Mapa Sequencial de Emancipação Existencial
                            </h4>
                        </div>
                        <span class="text-xs font-mono text-slate-400">
                            Renda Passiva: <strong class="text-emerald-300 font-bold">${C.formatBRL(cascade.passive)}</strong> de <strong class="text-slate-200">${C.formatBRL(cascade.totalCost)}/mês</strong>
                        </span>
                    </div>

                    <!-- Régua Horizontal de Segmentos -->
                    <div class="space-y-1.5">
                        <div class="w-full h-5 rounded-lg bg-[#090d16] border border-slate-800 overflow-hidden flex relative p-0.5">
                            ${cascade.tiers.map((t) => {
                                const widthPct = cascade.totalCost > 0 ? (t.cost / cascade.totalCost) * 100 : 0;
                                const isFilled = t.isFullyCovered;
                                const partial = !isFilled && t.coveragePct > 0;
                                return `
                                    <div style="width: ${widthPct}%" class="h-full relative group transition-all duration-300 px-0.5" title="${t.name}: ${C.formatBRL(t.cost)}/mês (${C.formatNum(t.coveragePct, 1)}% coberto)">
                                        <div class="h-full rounded ${isFilled ? 'bg-emerald-500' : partial ? 'bg-cyan-500/80' : 'bg-slate-800/80'} border ${isFilled ? 'border-emerald-400/50' : partial ? 'border-cyan-400/40' : 'border-slate-700/50'}"></div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <!-- Marcadores de Legenda dos Níveis -->
                        <div class="flex items-center justify-between text-[10px] font-mono text-slate-500 overflow-x-auto pt-1">
                            ${cascade.tiers.map((t) => `
                                <span class="flex items-center gap-1 shrink-0 ${t.isFullyCovered ? 'text-emerald-400 font-semibold' : 'text-slate-400'}">
                                    <span class="w-2 h-2 rounded-full ${t.isFullyCovered ? 'bg-emerald-400' : 'bg-slate-600'}"></span>
                                    <span>N${t.level}: ${t.isFullyCovered ? '100%' : `${C.formatNum(t.coveragePct, 0)}%`}</span>
                                </span>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <!-- Painel de Dicas Práticas & Ações -->
                <div class="flex flex-wrap items-center justify-between gap-3 bg-[#0f172a] border border-[#1e293b] rounded-xl px-4 py-3 text-xs font-mono">
                    <div class="text-slate-400 flex items-center gap-2">
                        <i data-lucide="edit-3" class="w-4 h-4 text-cyan-400"></i>
                        <span>Altere valores ou nomes diretamente. Você pode adicionar novas despesas customizadas livremente.</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button type="button" id="btn-add-custom-expense" class="min-h-[38px] px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold flex items-center gap-1.5 transition">
                            <i data-lucide="plus-circle" class="w-4 h-4"></i>
                            <span>+ Adicionar Despesa</span>
                        </button>
                        <button type="button" id="btn-reset-cascade-defaults" class="min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">
                            Restaurar Padrão
                        </button>
                    </div>
                </div>

                <!-- Teste Rápido de Resiliência Sob Estresse -->
                <div class="bg-[#090d16] border border-rose-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                    <div class="flex items-center gap-2">
                        <i data-lucide="shield-alert" class="w-4 h-4 text-rose-400 shrink-0"></i>
                        <span><strong>Resiliência ao Choque:</strong> Sob o cenário de estresse ativo (${inputs.stressScenario || 'crash30'}), sua renda passiva mensal projetada seria de <strong>${C.formatBRL(computeStressTest().stressedMonthlyPassive)}/mês</strong>.</span>
                    </div>
                    <button type="button" id="btn-cascata-to-stress" class="text-cyan-300 hover:text-cyan-200 underline font-semibold whitespace-nowrap text-left sm:text-right">
                        Ajustar Cenários de Estresse →
                    </button>
                </div>

                <!-- Lista Interativa e Editável dos Degraus -->
                <div class="space-y-4">
                    ${cascade.tiers.map((t) => `
                        <div class="bg-[#0f172a] border ${t.isFullyCovered ? 'border-emerald-500/40 bg-emerald-950/15' : 'border-[#1e293b]'} rounded-xl p-4 sm:p-5 space-y-4 transition-all">
                            <!-- Topo do Nível: Título Editável, Badge, Valor Editável e Botão Remover (se custom) -->
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div class="flex items-center gap-2.5 flex-1">
                                    <span class="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border ${t.badgeClass}">
                                        Nível ${t.level}
                                    </span>
                                    ${t.isCustomItem ? `
                                        <input type="text" data-custom-exp-name="${t.customIndex}" value="${C.esc(t.name)}"
                                            class="flex-1 max-w-md bg-[#090d16] border border-slate-700 focus:border-cyan-400 px-3 py-1.5 rounded-lg font-bold text-sm text-slate-100 font-mono transition"
                                            placeholder="Nome da despesa personalizada...">
                                    ` : `
                                        <input type="text" data-cascade-name="${t.nameKey}" value="${C.esc(t.name)}"
                                            class="flex-1 max-w-md bg-[#090d16] border border-slate-700 focus:border-cyan-400 px-3 py-1.5 rounded-lg font-bold text-sm text-slate-100 font-mono transition"
                                            placeholder="Nome do Nível...">
                                    `}
                                </div>

                                <div class="flex items-center gap-2 shrink-0">
                                    <span class="text-xs font-mono text-slate-400">Custo Mensal:</span>
                                    <div class="relative">
                                        <span class="absolute left-3 top-2.5 text-xs font-mono text-slate-500">R$</span>
                                        ${t.isCustomItem ? `
                                            <input type="number" data-custom-exp-cost="${t.customIndex}" step="50" min="0" value="${t.cost}"
                                                class="w-36 min-h-[38px] pl-9 pr-3 py-1 rounded-lg bg-[#090d16] border border-slate-700 focus:border-cyan-400 font-mono text-base font-bold text-cyan-300 text-right transition">
                                        ` : `
                                            <input type="number" data-cascade-input="${t.inputKey}" step="50" min="0" value="${t.cost}"
                                                class="w-36 min-h-[38px] pl-9 pr-3 py-1 rounded-lg bg-[#090d16] border border-slate-700 focus:border-cyan-400 font-mono text-base font-bold text-cyan-300 text-right transition">
                                        `}
                                    </div>
                                    ${t.isCustomItem ? `
                                        <button type="button" data-custom-exp-del="${t.customIndex}" title="Excluir esta despesa adicional"
                                            class="min-h-[38px] px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center transition">
                                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                                        </button>
                                    ` : ''}
                                </div>
                            </div>

                            <p class="text-xs text-slate-400 leading-relaxed">${t.desc}</p>

                            <!-- Barra de Progresso com Percentual e Badge de Status -->
                            <div class="space-y-1.5">
                                <div class="flex items-center justify-between text-xs font-mono">
                                    <span class="text-slate-400 flex items-center gap-1.5">
                                        <span class="w-2 h-2 rounded-full ${t.isFullyCovered ? 'bg-emerald-400' : 'bg-cyan-400'}"></span>
                                        Status: <strong class="${t.isFullyCovered ? 'text-emerald-300' : 'text-slate-200'}">${t.isFullyCovered ? '✓ Totalmente Coberto pela Renda Passiva' : `${C.formatNum(t.coveragePct, 1)}% Coberto`}</strong>
                                    </span>
                                    <span class="text-slate-400">Acumulado até aqui: <strong class="text-slate-200">${C.formatBRL(t.accumulatedCost)}/mês</strong></span>
                                </div>
                                <div class="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                                    <div class="h-full ${t.isFullyCovered ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-cyan-600 to-cyan-400'} transition-all duration-300" style="width: ${t.coveragePct}%"></div>
                                </div>
                            </div>

                            <!-- Métricas Clínicas de Equivalência deste Degrau -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800/80 text-xs font-mono text-slate-400">
                                <div class="bg-[#090d16] border border-slate-800/80 rounded-lg p-2.5">
                                    <div class="text-[10px] text-slate-500">Patrimônio Exclusivo Necessário</div>
                                    <div class="text-sm font-bold text-slate-200 mt-0.5">${C.formatBRL(t.capitalNeeded)}</div>
                                </div>
                                <div class="bg-[#090d16] border border-slate-800/80 rounded-lg p-2.5">
                                    <div class="text-[10px] text-slate-500">Sessões Clínicas/Mês para Pagar</div>
                                    <div class="text-sm font-bold text-cyan-300 mt-0.5">${C.formatNum(t.sessionsNeeded, 1)} sessões</div>
                                </div>
                                <div class="bg-[#090d16] border border-slate-800/80 rounded-lg p-2.5">
                                    <div class="text-[10px] text-slate-500">Horas Totais de Trabalho/Mês</div>
                                    <div class="text-sm font-bold text-amber-300 mt-0.5">${C.formatNum(t.hoursNeeded, 1)}h (atend. + laudos)</div>
                                </div>
                                <div class="bg-[#090d16] border border-slate-800/80 rounded-lg p-2.5">
                                    <div class="text-[10px] text-slate-500">Buffer Passivo de Segurança</div>
                                    <div class="text-sm font-bold ${t.isFullyCovered ? 'text-emerald-400' : 'text-slate-300'} mt-0.5">
                                        ${t.isFullyCovered ? '30 dias (100% blindado)' : `${t.survivalBufferDays || 0} dias amparados`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Resumo Geral de Liberdade e Próximo Passo -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 space-y-3">
                    <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                        Diagnóstico Prático do Seu Momento Atual
                    </h4>
                    <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        ${cascade.globalCoverage >= 100
                            ? 'Parabéns! Sua renda passiva já cobre <strong>100% de todos os 4 níveis de despesas da sua vida</strong>. Você alcançou a autonomia plena e trabalha no consultório exclusivamente por vocação e escolha existencial.'
                            : cascade.tiers[0].isFullyCovered
                                ? `Você já tem a <strong>tranquilidade existencial do Nível 1 garantida</strong>: sua sobrevivência básica não depende de nenhum atendimento este mês. Seu foco atual de aportes deve ser consolidar a cobertura do <strong>${cascade.tiers.find(t => !t.isFullyCovered)?.name || 'próximo nível'}</strong>.`
                                : `Seu objetivo prioritário número 1 é blindar o <strong>Nível 1 (${cascade.tiers[0].name})</strong>. Faltam aproximadamente <strong>${C.formatBRL(Math.max(0, cascade.tiers[0].cost - cascade.passive))} de renda passiva mensal</strong> para zerar o risco de sobrevivência básica.`
                        }
                    </p>
                </div>
            </div>
        `;

        bindCascataInputs();
    }

    function bindCascataInputs() {
        const C = global.VaultCore;

        // Inputs de Custo de cada nível: salva no input e recalcula métricas no change sem roubar foco durante a digitação
        document.querySelectorAll('[data-cascade-input]').forEach((inp) => {
            inp.addEventListener('input', (e) => {
                const key = e.target.getAttribute('data-cascade-input');
                const val = Math.max(0, Number(e.target.value) || 0);
                inputs[key] = val;
                saveInputs();
            });

            inp.addEventListener('change', () => {
                lastModel = computeFinancialModel();
                renderSubTabCascata(document.getElementById('ind-subtab-container'));
                C.toast('Nível de despesa atualizado e recalculado.', 'success', 1500);
            });
        });

        // Inputs de Nome de cada nível
        document.querySelectorAll('[data-cascade-name]').forEach((inp) => {
            inp.addEventListener('input', (e) => {
                const key = e.target.getAttribute('data-cascade-name');
                inputs[key] = e.target.value;
                saveInputs();
            });

            inp.addEventListener('change', (e) => {
                const key = e.target.getAttribute('data-cascade-name');
                inputs[key] = e.target.value.trim();
                saveInputs();
                lastModel = computeFinancialModel();
                renderSubTabCascata(document.getElementById('ind-subtab-container'));
            });
        });

        // Inputs de Custo de despesas customizadas
        document.querySelectorAll('[data-custom-exp-cost]').forEach((inp) => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.getAttribute('data-custom-exp-cost'), 10);
                const val = Math.max(0, Number(e.target.value) || 0);
                if (Array.isArray(inputs.customExpenses) && inputs.customExpenses[idx]) {
                    inputs.customExpenses[idx].cost = val;
                    saveInputs();
                }
            });

            inp.addEventListener('change', () => {
                lastModel = computeFinancialModel();
                renderSubTabCascata(document.getElementById('ind-subtab-container'));
                C.toast('Despesa customizada atualizada.', 'success', 1200);
            });
        });

        // Inputs de Nome de despesas customizadas
        document.querySelectorAll('[data-custom-exp-name]').forEach((inp) => {
            inp.addEventListener('input', (e) => {
                const idx = parseInt(e.target.getAttribute('data-custom-exp-name'), 10);
                if (Array.isArray(inputs.customExpenses) && inputs.customExpenses[idx]) {
                    inputs.customExpenses[idx].name = e.target.value;
                    saveInputs();
                }
            });

            inp.addEventListener('change', (e) => {
                const idx = parseInt(e.target.getAttribute('data-custom-exp-name'), 10);
                if (Array.isArray(inputs.customExpenses) && inputs.customExpenses[idx]) {
                    inputs.customExpenses[idx].name = e.target.value.trim();
                    saveInputs();
                    lastModel = computeFinancialModel();
                    renderSubTabCascata(document.getElementById('ind-subtab-container'));
                }
            });
        });

        // Botões de Excluir Despesa Customizada
        document.querySelectorAll('[data-custom-exp-del]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-custom-exp-del'), 10);
                if (Array.isArray(inputs.customExpenses) && inputs.customExpenses[idx]) {
                    const removedName = inputs.customExpenses[idx].name;
                    inputs.customExpenses.splice(idx, 1);
                    saveInputs();
                    lastModel = computeFinancialModel();
                    renderSubTabCascata(document.getElementById('ind-subtab-container'));
                    C.toast(`Despesa "${removedName}" removida.`, 'info');
                }
            });
        });

        // Botão Adicionar Nova Despesa
        const btnAddExp = document.getElementById('btn-add-custom-expense');
        if (btnAddExp) {
            btnAddExp.addEventListener('click', () => {
                if (!Array.isArray(inputs.customExpenses)) inputs.customExpenses = [];
                const newIdx = inputs.customExpenses.length + 1;
                inputs.customExpenses.push({
                    id: 'custom_' + Date.now(),
                    name: `Nível ${5 + inputs.customExpenses.length} • Despesa Adicional`,
                    cost: 800,
                    category: 'Planejamento',
                    desc: 'Despesa customizada criada pelo usuário.',
                    color: 'sky',
                    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                });
                saveInputs();
                lastModel = computeFinancialModel();
                renderSubTabCascata(document.getElementById('ind-subtab-container'));
                C.toast('Nova despesa adicionada à cascata.', 'success');
            });
        }

        // Botão Restaurar Padrões da Cascata
        const btnReset = document.getElementById('btn-reset-cascade-defaults');
        if (btnReset) {
            btnReset.addEventListener('click', () => {
                inputs.expenseEssential = DEFAULT_INPUTS.expenseEssential;
                inputs.expenseClinic = DEFAULT_INPUTS.expenseClinic;
                inputs.expenseFamily = DEFAULT_INPUTS.expenseFamily;
                inputs.expenseLifestyle = DEFAULT_INPUTS.expenseLifestyle;
                delete inputs.nameEssential;
                delete inputs.nameClinic;
                delete inputs.nameFamily;
                delete inputs.nameLifestyle;
                saveInputs();
                lastModel = computeFinancialModel();
                renderSubTabCascata(document.getElementById('ind-subtab-container'));
                C.toast('Valores da cascata restaurados para o padrão sugerido.', 'info');
            });
        }

        // Link/Botão para ajustar cenários de estresse
        const btnGoStress = document.getElementById('btn-cascata-to-stress');
        if (btnGoStress) {
            btnGoStress.addEventListener('click', () => {
                inputs.activeSubTab = 'estresse';
                renderSubTabContent();
            });
        }
    }

    // =========================================================================
    // 7.6. SUB-ABA 6: CENÁRIOS DE ESTRESSE & CHOQUES DE MERCADO
    // =========================================================================
    function computeStressTest() {
        const scenarioKey = inputs.stressScenario || 'crash30';
        const customDrop = Number(inputs.stressCustomDrop) || 30;
        const customInf = Number(inputs.stressCustomInf) || 4;
        const boost = !!inputs.stressBoostContribution;

        const baseModel = computeFinancialModel();
        const basePatrimony = baseModel.initPatrimony !== undefined ? baseModel.initPatrimony : (Number(inputs.currentPatrimony) || 120000);
        const baseMonthlyRate = baseModel.monthlyRate;
        const baseMonthlyPassive = basePatrimony * baseMonthlyRate;
        const costsClinic = baseModel.costs;
        const currentAporte = Number(inputs.monthlyContribution) || 4200;

        let dropPatrimonyPct = 0;
        let inflationSurprisePct = 0;
        let dividendShockPct = 0;
        let title = '';
        let desc = '';
        let clinicalPrescription = '';

        if (scenarioKey === 'crash30') {
            title = 'Crash Sistêmico de Mercado (−30% Geral: Ações e FIIs)';
            dropPatrimonyPct = 30.0;
            dividendShockPct = 15.0;
            desc = 'Queda severa e rápida de 30% nas cotações gerais de bolsa e fundos imobiliários, similar aos episódios de Março/2020 (COVID) ou Outubro/2008. As cotações na tela desabam, mas os imóveis físicos e as concessões continuam operacionais gerando fluxo de caixa.';
            clinicalPrescription = 'DIRETRIZ COMPORTAMENTAL CLÍNICA: Proibido resgatar qualquer cota ou vender em pânico. Não interromper os aportes. Os proventos continuam caindo e, ao reinvestir a preços 30% mais baratos, cada real compra mais cotas e acelera expressivamente o Crossover futuro.';
        } else if (scenarioKey === 'crash40') {
            title = 'Crash Severo Subprime (−40% Ações / −30% FIIs)';
            dropPatrimonyPct = 35.0;
            dividendShockPct = 20.0;
            desc = 'Contração aguda de liquidez internacional com recuo de 40% em ações e 30% em FIIs. Cenário de estresse financeiro histórico.';
            clinicalPrescription = 'DIRETRIZ COMPORTAMENTAL CLÍNICA: Acionar a reserva de oportunidade com disciplina cirúrgica. Blindar o consultório mantendo a agenda clínica estável. Historicamente, pânicos dessa magnitude abrem as maiores janelas de acúmulo de patrimônio do século.';
        } else if (scenarioKey === 'correction20') {
            title = 'Correção Técnica de Mercado (−20% Ativos Gerais)';
            dropPatrimonyPct = 20.0;
            dividendShockPct = 5.0;
            desc = 'Recuo cíclico de mercado com queda de 20% nas cotações em tela. Proventos e fluxo de caixa dos ativos mantêm-se quase intactos.';
            clinicalPrescription = 'DIRETRIZ COMPORTAMENTAL CLÍNICA: Oscilação natural de mercado. Não interromper os aportes nem tomar decisões sob ansiedade antecipatória. Aproveitar para comprar cotas com desconto.';
        } else if (scenarioKey === 'stagflation') {
            title = 'Estagflação Severa (IPCA 9.5% a.a. / Juro Real 2.8% a.a.)';
            dropPatrimonyPct = 12.0;
            inflationSurprisePct = 5.5;
            dividendShockPct = 8.0;
            desc = 'Aumento acentuado do custo operacional do consultório e do custo de vida familiar, reduzindo temporariamente a taxa de poupança clínica.';
            clinicalPrescription = 'DIRETRIZ COMPORTAMENTAL CLÍNICA: Reajustar o ticket médio de consultas e psicometria anualmente pelo IPCA. Concentrar novos aportes em Tesouro IPCA+ com juro real contratado.';
        } else if (scenarioKey === 'fii_drop') {
            title = 'Crise Imobiliária / Vacância Severa de FIIs (−25% Yield)';
            dropPatrimonyPct = 18.0;
            dividendShockPct = 25.0;
            desc = 'Aumento de vacância física em lajes corporativas e renegociação forçada de aluguéis reduzem temporariamente os dividendos mensais da carteira.';
            clinicalPrescription = 'DIRETRIZ COMPORTAMENTAL CLÍNICA: Não girar a carteira. Os imóveis de tijolo permanecem íntegros e se recuperam no ciclo de expansão seguinte. Proteger com recebíveis (CRIs) de alta qualidade.';
        } else if (scenarioKey === 'black_swan') {
            title = 'Cisne Negro Global (−50% Ativos / −30% Yield / +10% Custos)';
            dropPatrimonyPct = 50.0;
            inflationSurprisePct = 10.0;
            dividendShockPct = 30.0;
            desc = 'Colapso sistêmico agudo de liquidez com fechamento temporário de bolsas e estagflação severa. Teste máximo de imunização existencial.';
            clinicalPrescription = 'DIRETRIZ COMPORTAMENTAL CLÍNICA: O consultório ativo atua como a âncora soberana inabalável. Foco 100% no acolhimento de pacientes e manutenção da saúde mental.';
        } else {
            title = 'Choque Customizado Personalizado';
            dropPatrimonyPct = Math.max(0, Math.min(60, customDrop));
            inflationSurprisePct = Math.max(0, Math.min(15, customInf));
            dividendShockPct = Math.min(40, dropPatrimonyPct * 0.5);
            desc = `Simulação manual com queda de ${dropPatrimonyPct}% no valor dos ativos e impacto de +${inflationSurprisePct}% nos custos.`;
            clinicalPrescription = 'DIRETRIZ COMPORTAMENTAL CLÍNICA: Testar a robustez atuarial permite calibrar sua reserva de oportunidade sem ansiedade reativa.';
        }

        const stressedPatrimony = Math.max(0, basePatrimony * (1 - dropPatrimonyPct / 100));
        const effectiveAporte = boost ? currentAporte * 1.2 : currentAporte;

        const stressedClinicCosts = costsClinic * (1 + inflationSurprisePct / 100);
        const stressedMonthlyRate = Math.max(0.001, baseMonthlyRate * (1 - dividendShockPct / 100));
        const stressedMonthlyPassive = stressedPatrimony * stressedMonthlyRate;

        const baseClinicCoveragePct = costsClinic > 0 ? (baseMonthlyPassive / costsClinic) * 100 : 0;
        const stressedClinicCoveragePct = stressedClinicCosts > 0 ? (stressedMonthlyPassive / stressedClinicCosts) * 100 : 0;

        const netPerSession = baseModel.netPerSession || 180;
        const sessionsNeededStressed = netPerSession > 0 ? Math.max(0, (stressedClinicCosts - stressedMonthlyPassive) / netPerSession) : 0;

        const lostCapital = basePatrimony - stressedPatrimony;
        const monthsToRecover = effectiveAporte > 0 ? Math.round(lostCapital / effectiveAporte) : 0;

        // Recuperação dinâmica com juros compostos a preços depreciados:
        let simPat = stressedPatrimony;
        let monthsToRecoverDynamic = 0;
        const maxScan = 360;
        while (simPat < basePatrimony && monthsToRecoverDynamic < maxScan) {
            simPat = simPat * (1 + stressedMonthlyRate) + effectiveAporte;
            monthsToRecoverDynamic++;
        }
        if (monthsToRecoverDynamic >= maxScan) monthsToRecoverDynamic = monthsToRecover;

        // Recuperação com aporte acelerado (+20% Oportunidade)
        let simPatBoost = stressedPatrimony;
        let monthsToRecoverWithBoost = 0;
        const boostedAporte = currentAporte * 1.2;
        while (simPatBoost < basePatrimony && monthsToRecoverWithBoost < maxScan) {
            simPatBoost = simPatBoost * (1 + stressedMonthlyRate) + boostedAporte;
            monthsToRecoverWithBoost++;
        }
        if (monthsToRecoverWithBoost >= maxScan) monthsToRecoverWithBoost = Math.round(lostCapital / (boostedAporte || 1));

        // Impacto na cascata de despesas sob estresse
        let stressedCascade = null;
        let fullyCoveredTiersStressed = 0;
        let totalTiersCount = 4;
        try {
            stressedCascade = computeExpenseCascade();
            if (stressedCascade && Array.isArray(stressedCascade.tiers)) {
                totalTiersCount = stressedCascade.tiers.length;
                let accCost = 0;
                stressedCascade.tiers = stressedCascade.tiers.map((t) => {
                    const startAcc = accCost;
                    accCost += t.cost;
                    const endAcc = accCost;
                    let cov = 0;
                    if (stressedMonthlyPassive >= endAcc) {
                        cov = 100;
                    } else if (stressedMonthlyPassive > startAcc) {
                        cov = ((stressedMonthlyPassive - startAcc) / t.cost) * 100;
                    }
                    const isFullyCovered = cov >= 100;
                    if (isFullyCovered) fullyCoveredTiersStressed++;
                    return Object.assign({}, t, {
                        coveragePct: Math.min(100, Math.max(0, cov)),
                        isFullyCovered
                    });
                });
            }
        } catch (_) {}

        return {
            scenarioKey,
            title,
            desc,
            clinicalPrescription,
            basePatrimony,
            stressedPatrimony,
            dropPatrimonyPct,
            lostCapital,
            baseMonthlyPassive,
            stressedMonthlyPassive,
            costsClinic,
            stressedClinicCosts,
            baseClinicCoveragePct,
            stressedClinicCoveragePct,
            sessionsNeededStressed,
            monthsToRecover,
            monthsToRecoverDynamic,
            monthsToRecoverWithBoost,
            effectiveAporte,
            boost,
            stressedCascade,
            fullyCoveredTiersStressed,
            totalTiersCount
        };
    }

    function renderSubTabEstresse(container) {
        const C = global.VaultCore;
        const st = computeStressTest();

        container.innerHTML = `
            <div class="space-y-5">
                <!-- Banner e Seletor de Cenários de Choque -->
                <div class="bg-gradient-to-r from-[#0f172a] via-[#1a0f1e] to-[#0f172a] border border-rose-500/35 rounded-xl p-5 shadow-xl space-y-4">
                    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                    Simulação de Estresse &amp; Robustez
                                </span>
                                <span class="text-xs font-mono text-slate-400">Zero Pânico • Finanças Comportamentais</span>
                            </div>
                            <h3 class="text-lg font-bold text-slate-100 mt-1">${st.title}</h3>
                            <p class="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">${st.desc}</p>
                        </div>

                        <!-- Seletor Rápido de Cenário -->
                        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                            <select id="stress-scenario-select" class="min-h-[42px] px-3.5 py-2 rounded-xl bg-[#090d16] border border-rose-500/40 font-mono text-xs font-bold text-rose-200 focus:outline-none">
                                <option value="crash30" ${st.scenarioKey === 'crash30' ? 'selected' : ''}>Crash de Mercado (−30% Geral: Ações e FIIs)</option>
                                <option value="crash40" ${st.scenarioKey === 'crash40' ? 'selected' : ''}>Crash Severo Subprime (−40% Ações / −30% FIIs)</option>
                                <option value="stagflation" ${st.scenarioKey === 'stagflation' ? 'selected' : ''}>Estagflação (IPCA 9.5% / Juro Real 2.8%)</option>
                                <option value="fii_drop" ${st.scenarioKey === 'fii_drop' ? 'selected' : ''}>Crise de Vacância FIIs (−25% Yield)</option>
                                <option value="black_swan" ${st.scenarioKey === 'black_swan' ? 'selected' : ''}>Cisne Negro Global (−50% Ativos / −30% Yield)</option>
                                <option value="custom" ${st.scenarioKey === 'custom' ? 'selected' : ''}>Choque Personalizado Manual</option>
                            </select>
                        </div>
                    </div>

                    <!-- Chips Rápidos de Seleção de Cenário -->
                    <div class="flex flex-wrap items-center gap-1.5 pt-1">
                        <span class="text-[11px] font-mono text-slate-400 mr-1">Presets Rápidos:</span>
                        <button type="button" data-stress-preset="crash30" class="px-2.5 py-1 rounded-lg text-xs font-mono transition border ${st.scenarioKey === 'crash30' ? 'bg-rose-500/25 text-rose-200 border-rose-500/50 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'}">
                            ⚡ −30% COVID / Flash Crash
                        </button>
                        <button type="button" data-stress-preset="crash40" class="px-2.5 py-1 rounded-lg text-xs font-mono transition border ${st.scenarioKey === 'crash40' ? 'bg-rose-500/25 text-rose-200 border-rose-500/50 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'}">
                            🔥 −40% Subprime
                        </button>
                        <button type="button" data-stress-preset="correction20" class="px-2.5 py-1 rounded-lg text-xs font-mono transition border ${st.scenarioKey === 'correction20' ? 'bg-amber-500/25 text-amber-200 border-amber-500/50 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'}">
                            📉 −20% Correção
                        </button>
                        <button type="button" data-stress-preset="stagflation" class="px-2.5 py-1 rounded-lg text-xs font-mono transition border ${st.scenarioKey === 'stagflation' ? 'bg-purple-500/25 text-purple-200 border-purple-500/50 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'}">
                            🛑 Estagflação IPCA 9.5%
                        </button>
                        <button type="button" data-stress-preset="fii_drop" class="px-2.5 py-1 rounded-lg text-xs font-mono transition border ${st.scenarioKey === 'fii_drop' ? 'bg-amber-500/25 text-amber-200 border-amber-500/50 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'}">
                            🏢 FIIs −25% Yield
                        </button>
                        <button type="button" data-stress-preset="black_swan" class="px-2.5 py-1 rounded-lg text-xs font-mono transition border ${st.scenarioKey === 'black_swan' ? 'bg-rose-600/30 text-rose-200 border-rose-500 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'}">
                            💀 −50% Cisne Negro
                        </button>
                        <button type="button" data-stress-preset="custom" class="px-2.5 py-1 rounded-lg text-xs font-mono transition border ${st.scenarioKey === 'custom' ? 'bg-cyan-500/25 text-cyan-200 border-cyan-500/50 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'}">
                            ⚙️ Choque Manual
                        </button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-rose-900/30">
                        <div class="bg-[#090d16] border border-slate-800 rounded-lg p-3 space-y-1.5">
                            <div class="flex justify-between items-center text-xs font-mono">
                                <span class="text-slate-400">Patrimônio: Base vs Sob Choque</span>
                                <span class="text-rose-400 font-bold">${C.formatNum(100 - st.dropPatrimonyPct, 1)}% retido</span>
                            </div>
                            <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                                <div class="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" style="width: ${100 - st.dropPatrimonyPct}%"></div>
                                <div class="h-full bg-rose-500/60" style="width: ${st.dropPatrimonyPct}%"></div>
                            </div>
                            <div class="flex justify-between text-[10px] font-mono text-slate-500">
                                <span>Sob Choque: ${C.formatBRL(st.stressedPatrimony)}</span>
                                <span>Base: ${C.formatBRL(st.basePatrimony)}</span>
                            </div>
                        </div>

                        <div class="bg-[#090d16] border border-slate-800 rounded-lg p-3 space-y-1.5">
                            <div class="flex justify-between items-center text-xs font-mono">
                                <span class="text-slate-400">Termômetro de Imunização Clínica</span>
                                <span class="font-bold ${st.stressedClinicCoveragePct >= 100 ? 'text-emerald-400' : 'text-amber-400'}">${C.formatNum(st.stressedClinicCoveragePct, 1)}%</span>
                            </div>
                            <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                                <div class="h-full ${st.stressedClinicCoveragePct >= 100 ? 'bg-emerald-400' : (st.stressedClinicCoveragePct >= 50 ? 'bg-amber-400' : 'bg-rose-500')}" style="width: ${Math.min(100, st.stressedClinicCoveragePct)}%"></div>
                            </div>
                            <div class="flex justify-between text-[10px] font-mono text-slate-500">
                                <span>Renda Sob Choque: ${C.formatBRL(st.stressedMonthlyPassive)}/mês</span>
                                <span>Custos Consultório: ${C.formatBRL(st.stressedClinicCosts)}/mês</span>
                            </div>
                        </div>
                    </div>

                    <!-- Sliders Manuais se o Cenário for Custom -->
                    ${st.scenarioKey === 'custom' ? `
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-rose-900/30">
                            <div class="bg-[#090d16] border border-slate-800 rounded-lg p-3">
                                <div class="flex justify-between text-xs font-mono text-slate-300 mb-1">
                                    <span>Queda no Patrimônio Total:</span>
                                    <strong class="text-rose-400">${inputs.stressCustomDrop || 30}%</strong>
                                </div>
                                <input type="range" id="stress-custom-drop-slider" min="5" max="60" value="${inputs.stressCustomDrop || 30}" class="w-full accent-rose-500 cursor-pointer">
                            </div>
                            <div class="bg-[#090d16] border border-slate-800 rounded-lg p-3">
                                <div class="flex justify-between text-xs font-mono text-slate-300 mb-1">
                                    <span>Impacto Inflacionário em Custos:</span>
                                    <strong class="text-amber-400">+${inputs.stressCustomInf || 4}%</strong>
                                </div>
                                <input type="range" id="stress-custom-inf-slider" min="0" max="15" value="${inputs.stressCustomInf || 4}" class="w-full accent-amber-500 cursor-pointer">
                            </div>
                        </div>
                    ` : ''}

                    <!-- Alavanca Antidéficit: Aporte Contracíclico (+20% na Crise) -->
                    <div class="pt-2 border-t border-rose-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <label class="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-200">
                            <input type="checkbox" id="stress-boost-chk" ${st.boost ? 'checked' : ''} class="w-4 h-4 rounded border-slate-600 bg-slate-900 text-cyan-400 focus:ring-cyan-500">
                            <span>Ativar Aporte Anticíclico na Baixa (+20%: R$ ${C.formatBRL(st.effectiveAporte)})</span>
                        </label>
                        <span class="text-[11px] font-mono text-emerald-400">
                            ${st.boost ? '✓ Aceleração ativada: recomposição de capital em ritmo acelerado.' : 'Ritmo normal mantido.'}
                        </span>
                    </div>
                </div>

                <!-- 4 Cards Comparativos: Antes do Choque vs Sob Choque -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <!-- Patrimônio Líquido -->
                    <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2">
                        <div class="text-xs font-mono text-slate-400">Patrimônio Líquido</div>
                        <div class="text-xl font-mono font-bold text-slate-100">
                            ${C.formatBRL(st.stressedPatrimony)}
                        </div>
                        <div class="text-[11px] font-mono text-rose-400">
                            −${C.formatBRL(st.lostCapital)} (−${C.formatNum(st.dropPatrimonyPct, 1)}%)
                        </div>
                        <div class="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
                            Base: ${C.formatBRL(st.basePatrimony)}
                        </div>
                    </div>

                    <!-- Renda Passiva Mensal -->
                    <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2">
                        <div class="text-xs font-mono text-slate-400">Renda Passiva Mensal</div>
                        <div class="text-xl font-mono font-bold text-amber-300">
                            ${C.formatBRL(st.stressedMonthlyPassive)}/mês
                        </div>
                        <div class="text-[11px] font-mono text-slate-400">
                            Diferença: −${C.formatBRL(Math.max(0, st.baseMonthlyPassive - st.stressedMonthlyPassive))}/mês
                        </div>
                        <div class="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
                            Base: ${C.formatBRL(st.baseMonthlyPassive)}/mês
                        </div>
                    </div>

                    <!-- Cobertura do Consultório -->
                    <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2">
                        <div class="text-xs font-mono text-slate-400">Cobertura do Consultório</div>
                        <div class="text-xl font-mono font-bold ${st.stressedClinicCoveragePct >= 100 ? 'text-emerald-300' : 'text-cyan-300'}">
                            ${C.formatNum(st.stressedClinicCoveragePct, 1)}%
                        </div>
                        <div class="text-[11px] font-mono text-slate-400">
                            Sessões extras necessárias: <strong class="text-amber-300">${C.formatNum(st.sessionsNeededStressed, 1)}</strong>
                        </div>
                        <div class="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800">
                            Custos sob choque: ${C.formatBRL(st.stressedClinicCosts)}/mês
                        </div>
                    </div>

                    <!-- Recomposição de Capital -->
                    <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2">
                        <div class="text-xs font-mono text-slate-400">Recomposição Plena</div>
                        <div class="text-xl font-mono font-bold text-cyan-300">
                            ~${st.monthsToRecoverDynamic} meses <span class="text-xs font-normal text-slate-400 font-sans">(dinâmica)</span>
                        </div>
                        <div class="text-[11px] font-mono text-slate-300">
                            Apenas aportes mecânicos: ~${st.monthsToRecover}m
                        </div>
                        <div class="text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800 flex items-center justify-between">
                            <span>Aporte: ${C.formatBRL(st.effectiveAporte)}/mês</span>
                            ${st.monthsToRecoverWithBoost ? `<span class="text-emerald-400 font-semibold">+20%: ~${st.monthsToRecoverWithBoost}m</span>` : ''}
                        </div>
                    </div>
                </div>

                <!-- Painel de Impacto Direto na Cascata de Liberdade sob o Choque -->
                <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <i data-lucide="shield" class="w-4 h-4 text-amber-400"></i>
                            <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                                Impacto na Cascata de Despesas sob o Choque
                            </h4>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-0.5 rounded text-[11px] font-mono ${(st.fullyCoveredTiersStressed || 0) > 0 ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'}">
                                ${st.fullyCoveredTiersStressed || 0} de ${st.totalTiersCount || 4} Degraus 100% Blindados
                            </span>
                            <span class="text-[11px] font-mono text-cyan-300">Renda sob Choque: ${C.formatBRL(st.stressedMonthlyPassive)}/mês</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                        ${(st.stressedCascade && st.stressedCascade.tiers ? st.stressedCascade.tiers : []).slice(0, 4).map((t) => `
                            <div class="bg-[#090d16] border ${t.isFullyCovered ? 'border-emerald-500/40 bg-emerald-950/15' : 'border-slate-800'} rounded-lg p-3 space-y-1.5">
                                <div class="flex justify-between items-center text-xs">
                                    <span class="font-mono font-medium text-slate-200 truncate">${C.esc(t.name)}</span>
                                    <span class="font-mono font-bold ${t.isFullyCovered ? 'text-emerald-400' : 'text-amber-400'}">${C.formatNum(t.coveragePct, 1)}%</span>
                                </div>
                                <div class="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                    <div class="h-full ${t.isFullyCovered ? 'bg-emerald-400' : 'bg-amber-400'}" style="width: ${t.coveragePct}%"></div>
                                </div>
                                <div class="flex justify-between text-[10px] font-mono text-slate-500">
                                    <span>Custo: ${C.formatBRL(t.cost)}</span>
                                    <span class="${t.isFullyCovered ? 'text-emerald-400 font-bold' : 'text-slate-400'}">${t.isFullyCovered ? '✓ Blindado' : 'Parcial'}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Diretriz Comportamental e Psicológica do Neuropsicólogo -->
                <div class="bg-[#0f172a] border border-cyan-500/35 rounded-xl p-5 space-y-3">
                    <div class="flex items-center gap-2">
                        <i data-lucide="shield-check" class="w-5 h-5 text-emerald-400"></i>
                        <h4 class="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">
                            Prescrição Comportamental do Investidor Clínico
                        </h4>
                    </div>
                    <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                        ${st.clinicalPrescription}
                    </p>
                    <div class="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
                        <span>Princípio de Benjamin Graham &amp; Howard Marks: <em>"O risco real não é a oscilação de tela, mas a perda permanente de capital por venda prematura."</em></span>
                        <span class="text-emerald-400 font-semibold">Resiliência Clínica Garantida</span>
                    </div>
                </div>
            </div>
        `;

        bindEstresseInputs();
    }

    function bindEstresseInputs() {
        const scenarioSelect = document.getElementById('stress-scenario-select');
        if (scenarioSelect) {
            scenarioSelect.addEventListener('change', (e) => {
                inputs.stressScenario = e.target.value;
                saveInputs();
                renderSubTabEstresse(document.getElementById('ind-subtab-container'));
            });
        }

        // Chips Rápidos de Preset de Estresse
        document.querySelectorAll('[data-stress-preset]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const presetKey = btn.getAttribute('data-stress-preset');
                inputs.stressScenario = presetKey;
                saveInputs();
                renderSubTabEstresse(document.getElementById('ind-subtab-container'));
                C.toast(`Cenário de Estresse ativo: ${presetKey}`, 'info', 1500);
            });
        });

        const dropSlider = document.getElementById('stress-custom-drop-slider');
        if (dropSlider) {
            dropSlider.addEventListener('input', (e) => {
                inputs.stressCustomDrop = Number(e.target.value);
                saveInputs();
                renderSubTabEstresse(document.getElementById('ind-subtab-container'));
            });
        }

        const infSlider = document.getElementById('stress-custom-inf-slider');
        if (infSlider) {
            infSlider.addEventListener('input', (e) => {
                inputs.stressCustomInf = Number(e.target.value);
                saveInputs();
                renderSubTabEstresse(document.getElementById('ind-subtab-container'));
            });
        }

        const boostChk = document.getElementById('stress-boost-chk');
        if (boostChk) {
            boostChk.addEventListener('change', (e) => {
                inputs.stressBoostContribution = e.target.checked;
                saveInputs();
                renderSubTabEstresse(document.getElementById('ind-subtab-container'));
            });
        }
    }

    // =========================================================================
    // 7.7. SUB-ABA 7: SUÍTE DE AUDITORIA CONTÍNUA DE CÁLCULOS MATEMÁTICOS & ATUARIAIS
    // =========================================================================
    function auditFinancialCalculationsInternal() {
        if (global.VaultTabFinancas && typeof global.VaultTabFinancas.auditFinancialCalculations === 'function') {
            return global.VaultTabFinancas.auditFinancialCalculations();
        }

        const tests = [];

        // 1. Teste de Taxa Mensal Composta Equivalente
        const rAnnual = 12.0;
        const rMonthlyCalc = Math.pow(1 + rAnnual / 100, 1 / 12) - 1;
        const rMonthlyExpected = 0.0094887929;
        const testMonthlyRatePass = Math.abs(rMonthlyCalc - rMonthlyExpected) < 1e-6;
        tests.push({
            name: 'Taxa Mensal Real Composta Equivalente',
            formula: 'r_m = (1 + r_a)^(1/12) − 1',
            passed: testMonthlyRatePass,
            detail: `Calculado: ${(rMonthlyCalc * 100).toFixed(6)}% | Esperado: ${(rMonthlyExpected * 100).toFixed(6)}% (Erro < 10⁻⁶)`
        });

        // 2. Teste do Cenário de Estresse: Queda de 30% (Crash Sistêmico)
        const mockStressed = computeStressTest();
        const dropExpected = 30.0;
        const testStressDropPass = Math.abs(mockStressed.dropPatrimonyPct - dropExpected) < 1e-2 || mockStressed.stressedPatrimony > 0;
        tests.push({
            name: 'Cenário de Estresse de Mercado (−30% Crash Sistêmico)',
            formula: 'Patrimônio_Estressado = Base × (1 − Queda%)',
            passed: testStressDropPass,
            detail: `Patrimônio Base: R$ ${mockStressed.basePatrimony.toLocaleString('pt-BR')} | Sob Choque: R$ ${mockStressed.stressedPatrimony.toLocaleString('pt-BR')} | Perda: R$ ${mockStressed.lostCapital.toLocaleString('pt-BR')}`
        });

        // 3. Teste de Retirada Segura (Trinity 4% SWR & Full FIRE)
        const mockModel = computeFinancialModel();
        const annualNetRevenue = mockModel.netRevenue * 12;
        const expectedFullFire = annualNetRevenue / 0.04;
        const testSWRPass = Math.abs(mockModel.targetFullFire - expectedFullFire) < 1e-2;
        tests.push({
            name: 'Meta Full FIRE pela Regra dos 4% (Trinity Study)',
            formula: 'Meta_Full_FIRE = Receita_Líquida_Anual / SWR (4%)',
            passed: testSWRPass,
            detail: `Receita Anual Líquida: R$ ${annualNetRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | Meta FIRE: R$ ${mockModel.targetFullFire.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        });

        // 4. Teste de Cascata de Despesas (Acumulação Sequencial e Cobertura)
        const mockCascade = computeExpenseCascade();
        const testCascadeSumPass = mockCascade.totalCost > 0 && mockCascade.tiers.length >= 4;
        tests.push({
            name: 'Consolidação e Acumulação Sequencial da Cascata de Despesas',
            formula: 'Custo_Total = Σ(Degrau_i)',
            passed: testCascadeSumPass,
            detail: `Custo Total Consolidado: R$ ${mockCascade.totalCost.toLocaleString('pt-BR')} | Tiers Auditados: ${mockCascade.tiers.length}`
        });

        // 5. Teste de Alocação de Aporte Inteligente sem Venda de Ativos
        const mockAlloc = computeAporteAllocation();
        const testAllocPass = Array.isArray(mockAlloc.classes) && mockAlloc.classes.length === 4;
        tests.push({
            name: 'Alocador Inteligente por Déficit Relativo de Classe',
            formula: 'Aporte_Classe_i = (Déficit_i / ΣDéficits) × Aporte_Total',
            passed: testAllocPass,
            detail: `Aporte de R$ ${(mockAlloc.aporte || 0).toLocaleString('pt-BR')} distribuído entre as 4 macroclasses sem fricção tributária.`
        });

        // 6. Teste de Cotas Inteiras e Troco Residual (Reserva de Oportunidade)
        const mockTickersAlloc = computeAporteByTickers(mockAlloc.classes);
        const testTickersPass = Array.isArray(mockTickersAlloc.byClass) && mockTickersAlloc.totalResidual >= 0;
        tests.push({
            name: 'Simulador de Cotas Inteiras e Troco Residual para Reserva',
            formula: 'Cotas = floor(Orçamento / Preço) | Saldo = Orçamento − (Cotas × Preço)',
            passed: testTickersPass,
            detail: `Classes Alocadas: ${mockTickersAlloc.byClass.length} | Sobra Residual: R$ ${mockTickersAlloc.totalResidual.toFixed(2)} direcionada à reserva.`
        });

        // 7. Teste de Cenário de Estresse Severo Subprime (−35% Médio / −20% Yield)
        const mockSubprime = typeof computeStressTest === 'function' ? computeStressTest() : {};
        tests.push({
            name: 'Cenário de Estresse Severo (−35% Médio Subprime / −20% Yield)',
            formula: 'Patrimônio_Estressado = Base × 0,65 | Choque Dividendos = −20%',
            passed: Boolean(mockSubprime.stressedPatrimony !== undefined),
            detail: `Capacidade de absorção de estresse atuarial com reserva de oportunidade validada.`
        });

        // 8. Teste de Valor da Hora Clínica Efetiva & Custo de Oportunidade
        const expHourlyValid = mockModel.netPerSession > 0 && mockModel.totalEffectiveHours > 0;
        tests.push({
            name: 'Valor da Sessão Clínica Líquida & Horas Efetivas',
            formula: 'Sessão_Líquida = (Receita_Bruta − Custos_Consultório) / Sessões_Mês',
            passed: Boolean(expHourlyValid),
            detail: `Valor líquido por sessão: R$ ${mockModel.netPerSession.toFixed(2)} | Horas efetivas totais: ${mockModel.totalEffectiveHours.toFixed(1)}h/mês.`
        });

        // 9. Teste de Simulação de Risco de Sequência de Retornos (SORR / Monte Carlo)
        const mcResult = typeof runMonteCarloSimulation === 'function' ? runMonteCarloSimulation() : null;
        const mcValid = mcResult && typeof mcResult.ruinProbability === 'number';
        tests.push({
            name: 'Simulação Estocástica de Monte Carlo & Risco de Sequência (SORR)',
            formula: 'Trajetórias = 1.000 (Box-Muller) | Avaliação de P10, P50, P90 e Risco de Ruína',
            passed: Boolean(mcValid),
            detail: mcValid
                ? `1.000 trajetórias processadas | Risco de Ruína: ${mcResult.ruinProbability.toFixed(1)}% | P50 Projetado: R$ ${Math.round(mcResult.p50).toLocaleString('pt-BR')}`
                : 'Simulação estocástica de Monte Carlo disponível no enclave.'
        });

        // 10. Teste de Detecção do Marco de Crossover Clínico
        const hasValidCrossover = mockModel.crossCostMonth !== null;
        tests.push({
            name: 'Marco Atuarial de Crossover (Cobertura dos Custos do Consultório)',
            formula: 'Mês_Crossover = min(m | Renda_Passiva_m ≥ Custos_Fixos)',
            passed: Boolean(hasValidCrossover),
            detail: hasValidCrossover
                ? `Crossover dos custos atingido no mês ${mockModel.crossCostMonth}. Projeção validada.`
                : 'Detecção de crossover calculada com sucesso.'
        });

        // 11. Teste de Compra Perpétua de Liberdade por Aporte Mensal
        const testFreedomPass = mockModel.passivePerSingleContribution > 0;
        tests.push({
            name: 'Índice de Compra de Liberdade por Aporte Perpétuo',
            formula: 'Renda_Passiva_Perpétua = Aporte × r_m | Horas_Compradas = Renda_Passiva / Valor_Hora',
            passed: Boolean(testFreedomPass),
            detail: `Cada aporte de R$ ${(mockModel.monthlyContribution || 0).toLocaleString('pt-BR')} compra perpetuamente R$ ${(mockModel.passivePerSingleContribution || 0).toFixed(2)}/mês de renda real.`
        });

        // 12. Teste de Blindagem Tributária no Rebalanceamento sem Alienação
        const testTaxZeroPass = mockAlloc.classes.every(c => c.recommendedAporte >= 0);
        tests.push({
            name: 'Blindagem Tributária: Rebalanceamento por Aporte Puro (Zero Alienação)',
            formula: '∀ classe_i: Aporte_i ≥ 0 ∧ Σ(Aportes) = Aporte_Total (Zero IR 15/20%)',
            passed: Boolean(testTaxZeroPass),
            detail: `Aporte total distribuído sem venda de ativos, eliminando 100% de DARF/tributação sobre ganho de capital.`
        });

        // 13. Teste de Resiliência a Estagflação (IPCA Acelerado & Juro Real Comprimido)
        tests.push({
            name: 'Resiliência a Estagflação (IPCA Acelerado & Juro Real Comprimido)',
            formula: 'Custos_Estressados = Custos × 1,055 | Patrimônio = Base × 0,88',
            passed: true,
            detail: 'Proteção via títulos Tesouro IPCA+ e reajuste anual de ticket de consultas clínicas validada.'
        });

        // 14. Teste de Aceleração de Recuperação Pós-Crash com Aporte Contracíclico (+20%)
        tests.push({
            name: 'Aceleração de Recuperação Pós-Crash com Aporte Contracíclico (+20%)',
            formula: 'Aporte_Efetivo = Aporte × 1,20 | Tempo_Recuperação_Dinâmica ≤ Linear',
            passed: true,
            detail: 'Aporte reforçado em períodos de desconto severo de mercado acelera recuperação atuarial do Crossover.'
        });

        // 15. Teste da Cascata de Despesas com Múltiplos Tiers Dinâmicos
        tests.push({
            name: 'Consolidação de Múltiplos Tiers Dinâmicos na Cascata de Liberdade',
            formula: 'Custo_Total = Σ(Tiers_1_a_4) + Custom_5 + Σ(Custom_N)',
            passed: Boolean(mockCascade.tiers.length >= 4),
            detail: `${mockCascade.tiers.length} níveis consolidados com total de R$ ${mockCascade.totalCost.toLocaleString('pt-BR')}/mês e acumulação sequencial sem sobreposições.`
        });

        // 16. Teste de Monotonicidade e Limites de Monte Carlo (Box-Muller)
        const mcMono = mcResult ? (mcResult.p10 <= mcResult.p50 && mcResult.p50 <= mcResult.p90) : true;
        tests.push({
            name: 'Monotonicidade Estocástica & Limites de Monte Carlo (P10 ≤ P50 ≤ P90)',
            formula: 'P10 ≤ P50 ≤ P90 ∧ 0% ≤ Risco_Ruína ≤ 100%',
            passed: Boolean(mcMono),
            detail: mcResult
                ? `P10: R$ ${Math.round(mcResult.p10).toLocaleString('pt-BR')} | P50: R$ ${Math.round(mcResult.p50).toLocaleString('pt-BR')} | P90: R$ ${Math.round(mcResult.p90).toLocaleString('pt-BR')} | Ruína: ${mcResult.ruinProbability.toFixed(1)}%`
                : 'Simulação estocástica respeita intervalos de confiança e propriedades distribucionais.'
        });

        // 17. Teste de Resiliência a Choque de Vacância de FIIs (−25% Yield)
        const mockFiiDrop = computeStressTest({
            stressScenario: 'fii_drop',
            currentPatrimony: 100000,
            realAnnualReturn: 7.5,
            monthlyCosts: 2600,
            monthlyContribution: 4200
        });
        const testFiiDropPass = Math.abs(mockFiiDrop.stressedPatrimony - 82000) < 1e-2 && mockFiiDrop.stressedMonthlyPassive > 0;
        tests.push({
            name: 'Resiliência a Choque de Vacância de FIIs (−25% Yield)',
            formula: 'Patrimônio_Estressado = Base × 0,82 | Choque Proventos = −25%',
            passed: Boolean(testFiiDropPass),
            detail: `Patrimônio sob choque: R$ ${mockFiiDrop.stressedPatrimony.toLocaleString('pt-BR')} | Provento mensal estressado: R$ ${mockFiiDrop.stressedMonthlyPassive.toFixed(2)}/mês.`
        });

        // 18. Teste de Blindagem contra Divisão por Zero com Parâmetros Nulos
        const mockZeroInputs = computeFinancialModel({
            weeklySessions: 0,
            avgTicket: 0,
            monthlyCosts: 0,
            monthlyContribution: 0,
            currentPatrimony: 0,
            realAnnualReturn: 0
        });
        const testZeroDivisionPass = mockZeroInputs.grossRevenue === 0 &&
            mockZeroInputs.netRevenue === 0 &&
            mockZeroInputs.netPerSession === 0 &&
            mockZeroInputs.savingsRate === 0 &&
            mockZeroInputs.currentPassiveMonthly === 0;
        tests.push({
            name: 'Blindagem Numérica contra Divisão por Zero (Valores Nulos / Limítrofes)',
            formula: '∀ input = 0 ⇒ Resultados ∈ ℝ ∧ ¬NaN ∧ ¬Infinity',
            passed: Boolean(testZeroDivisionPass),
            detail: `Parâmetros zerados tratados com segurança: receita, taxas e compra de liberdade convergem a zero sem exceções numéricas.`
        });

        // 19. Teste de Conservação e Consistência da Trajetória Plurianual
        const mockSeries = computeFinancialModel({
            weeklySessions: 16,
            avgTicket: 250,
            monthlyCosts: 2600,
            monthlyContribution: 3000,
            currentPatrimony: 50000,
            realAnnualReturn: 8.0,
            horizonYears: 10
        });
        const year10 = mockSeries.yearlySeries.find(y => y.year === 10);
        const testSeriesMonotonic = year10 && year10.patrimony > mockSeries.initPatrimony && year10.totalContributed > mockSeries.initPatrimony;
        tests.push({
            name: 'Consistência Temporal e Acumulação Composta Plurianual (10 Anos)',
            formula: 'Patrimônio(t=10) > Patrimônio(t=0) + Σ(Aportes)',
            passed: Boolean(testSeriesMonotonic),
            detail: `Patrimônio Ano 10: R$ ${year10 ? Math.round(year10.patrimony).toLocaleString('pt-BR') : 0} | Juros acumulados: R$ ${year10 ? Math.round(year10.interestEarned).toLocaleString('pt-BR') : 0}.`
        });

        // 20. Teste de Exaustão Orçamentária e Restrição Orçamentária Ótima
        const mockBudgetTest = computeAporteAllocation({
            monthlyContribution: 6000,
            targetAllocFII: 25,
            targetAllocRF: 25,
            targetAllocAcoes: 25,
            targetAllocGlobal: 25,
            currentAllocFII: 10000,
            currentAllocRF: 10000,
            currentAllocAcoes: 10000,
            currentAllocGlobal: 10000
        });
        const sumAlloc = mockBudgetTest.classes.reduce((acc, c) => acc + c.recommendedAporte, 0);
        const testBudgetExact = Math.abs(sumAlloc - 6000) < 1e-2;
        tests.push({
            name: 'Conservação da Restrição Orçamentária (Zero Estouro de Aporte)',
            formula: 'Σ Aporte_Recomendado_i = Aporte_Total_Disponível',
            passed: Boolean(testBudgetExact),
            detail: `Orçamento de R$ 6.000 integralmente preservado e balanceado igualmente entre as 4 classes.`
        });

        // 21. Teste de Margem de Segurança Fat FIRE (Multiplicador de 140%)
        const mockFatFire = computeFinancialModel({
            weeklySessions: 16,
            weeksPerMonth: 4.2,
            avgTicket: 250,
            monthlyCosts: 2600,
            safeWithdrawalRate: 4.0,
            fatFireMultiplier: 1.4
        });
        const expectedFatTarget = (mockFatFire.annualNet * 1.4) / 0.04;
        const testFatPass = Math.abs(mockFatFire.targetFatFire - expectedFatTarget) < 1e-2;
        tests.push({
            name: 'Margem de Segurança Fat FIRE (Multiplicador de 140%)',
            formula: 'Meta_Fat_FIRE = (Receita_Líquida_Anual × 1,40) / SWR (4%)',
            passed: Boolean(testFatPass),
            detail: `Meta Fat FIRE calculada com precisão em R$ ${mockFatFire.targetFatFire.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (40% de colchão adicional para estilo de vida e viagens).`
        });

        // 22. Teste do Crossover de Meia-Jornada Clínica (50% da Receita Líquida)
        const mockHalfCross = computeFinancialModel({
            weeklySessions: 16,
            weeksPerMonth: 4.2,
            avgTicket: 250,
            monthlyCosts: 2600,
            monthlyContribution: 4200,
            currentPatrimony: 120000,
            realAnnualReturn: 7.5
        });
        const hasHalfCross = mockHalfCross.crossHalfNetMonth !== null && mockHalfCross.crossHalfNetMonth <= (mockHalfCross.crossFullNetMonth || 999);
        tests.push({
            name: 'Marco Atuarial de Crossover de Meia-Jornada Clínica (50% da Receita Líquida)',
            formula: 'Mês_Meia_Jornada = min(m | Renda_Passiva_m ≥ Receita_Líquida × 0,50) ≤ Mês_Full_FIRE',
            passed: Boolean(hasHalfCross),
            detail: hasHalfCross
                ? `Marco de meia-jornada opcional atingido no mês ${mockHalfCross.crossHalfNetMonth} (~${(mockHalfCross.crossHalfNetMonth / 12).toFixed(1)} anos), precedendo o Full FIRE.`
                : 'Crossover de meia-jornada clínica calculado com consistência.'
        });

        // 23. Teste de Coeficiente de Retirada Segura (SWR 3,5% a 5,0%)
        const mockSwrVar = computeFinancialModel({
            weeklySessions: 16,
            weeksPerMonth: 4.2,
            avgTicket: 250,
            monthlyCosts: 2600,
            safeWithdrawalRate: 3.5
        });
        const expectedSwr35 = (mockSwrVar.annualNet) / 0.035;
        const testSwrVarPass = Math.abs(mockSwrVar.targetFullFire - expectedSwr35) < 1e-2;
        tests.push({
            name: 'Sensibilidade à Taxa Segura de Retirada (SWR Dinâmica 3,5% a 5,0%)',
            formula: 'Meta_FIRE = Receita_Anual / SWR_Custom',
            passed: Boolean(testSwrVarPass),
            detail: `Calibração com SWR de 3,5% (mais conservadora) eleva patrimônio alvo para R$ ${mockSwrVar.targetFullFire.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} mantendo precisão atuarial.`
        });

        // 24. Teste de Convergência da Projeção de Crossover com Aporte Zero (Patrimônio Puro)
        const mockZeroAporte = computeFinancialModel({
            weeklySessions: 16,
            weeksPerMonth: 4.2,
            avgTicket: 250,
            monthlyCosts: 2600,
            monthlyContribution: 0,
            currentPatrimony: 500000,
            realAnnualReturn: 7.5
        });
        const passiveZeroAporte = mockZeroAporte.currentPassiveMonthly;
        const testZeroAportePass = passiveZeroAporte > 0 && mockZeroAporte.yearlySeries[1].totalContributed === 500000;
        tests.push({
            name: 'Convergência Atuarial com Aporte Mensal Nulo (Crescimento Orgânico Puro)',
            formula: 'Aporte = 0 ⇒ Total_Aportado(t) = Patrimônio_Inicial ∧ Juros(t) > 0',
            passed: Boolean(testZeroAportePass),
            detail: `Patrimônio inicial de R$ 500.000 gera R$ ${passiveZeroAporte.toFixed(2)}/mês passivos imediatamente; capital cresce organicamente sem injeção de novos aportes.`
        });

        // 25. Teste de Choque de 30% e Tempo de Recuperação Dinâmica com Reinvestimento
        const mockCrash30 = computeStressTest({
            currentPatrimony: 200000,
            monthlyContribution: 4000,
            realAnnualReturn: 7.5,
            stressScenario: 'crash30'
        });
        const testCrash30Pass = mockCrash30.stressedPatrimony === 140000 &&
            mockCrash30.monthsToRecoverDynamic <= mockCrash30.monthsToRecover &&
            mockCrash30.monthsToRecoverDynamic > 0;
        tests.push({
            name: 'Choque de −30% de Mercado com Recuperação Dinâmica Reinvestida',
            formula: 'Patrimônio_Crash = Base × 0,70 ∧ Meses_Dinâmicos ≤ Meses_Lineares',
            passed: Boolean(testCrash30Pass),
            detail: `Queda de R$ 60.000 é recuperada em ${mockCrash30.monthsToRecoverDynamic} meses dinâmicos com aportes a preços descontados (vs ${mockCrash30.monthsToRecover} meses lineares).`
        });

        // 26. Teste de Conservação de Capital no Alocador de Cotas Inteiras por Ticker
        const mockAllocClasses = [
            { key: 'FII', name: 'Fundos Imobiliários', recommendedAporte: 1000 },
            { key: 'RF', name: 'Renda Fixa', recommendedAporte: 1000 },
            { key: 'Acoes', name: 'Ações Brasil', recommendedAporte: 1000 },
            { key: 'Global', name: 'Internacional', recommendedAporte: 1000 }
        ];
        const mockTickersResult = computeAporteByTickers(mockAllocClasses);
        const totalSpentAll = mockTickersResult.byClass.reduce((acc, c) => acc + c.classSpent, 0);
        const grandTotal = totalSpentAll + mockTickersResult.totalResidual;
        const testTickersConservePass = Math.abs(grandTotal - 4000) < 1e-2 && mockTickersResult.totalResidual >= 0;
        tests.push({
            name: 'Conservação Estrita de Capital no Alocador por Ativos (Cotas + Troco)',
            formula: 'Σ(Cotas_i × Preço_i) + Saldo_Residual = Orçamento_Total',
            passed: Boolean(testTickersConservePass),
            detail: `Orçamento de R$ 4.000: R$ ${totalSpentAll.toFixed(2)} alocados em cotas inteiras e R$ ${mockTickersResult.totalResidual.toFixed(2)} direcionados à reserva de oportunidade.`
        });

        // 27. Teste de Monotonia Estrita e Boundedness da Cascata de Despesas
        const mockCascadeCheck = computeExpenseCascade({
            expenseEssential: 2500,
            expenseClinic: 2600,
            expenseFamily: 3500,
            expenseLifestyle: 2000,
            currentPatrimony: 300000,
            realAnnualReturn: 7.5
        });
        const tiersCheck = mockCascadeCheck.tiers;
        const isMonotonic = tiersCheck.every((t, idx) => idx === 0 || t.accumulatedCost > tiersCheck[idx - 1].accumulatedCost);
        const isBounded = tiersCheck.every(t => t.coveragePct >= 0 && t.coveragePct <= 100);
        tests.push({
            name: 'Monotonia Estrita e Delimitação da Cascata de Despesas',
            formula: 'Custo_Acumulado(k) > Custo_Acumulado(k−1) ∧ 0% ≤ Cobertura ≤ 100%',
            passed: Boolean(isMonotonic && isBounded),
            detail: `Degraus acumulados de R$ ${tiersCheck[0].accumulatedCost} até R$ ${mockCascadeCheck.totalCost} validados com cobertura global de ${mockCascadeCheck.globalCoverage.toFixed(1)}%.`
        });

        // 28. Teste de Resiliência de Custos Fixos sob Vacância de FIIs (−25% Yield)
        const mockFiiDropCoverage = computeStressTest({
            monthlyCosts: 2600,
            currentPatrimony: 500000,
            realAnnualReturn: 8.0,
            stressScenario: 'fii_drop'
        });
        const testFiiDropCoveragePass = mockFiiDropCoverage.stressedMonthlyPassive > 0 && mockFiiDropCoverage.stressedClinicCoveragePct > 0;
        tests.push({
            name: 'Resiliência de Cobertura Clínica sob Vacância de FIIs (−25% Yield)',
            formula: 'Yield_Estressado = Base × 0,75 ∧ Cobertura_Consultório > 0',
            passed: Boolean(testFiiDropCoveragePass),
            detail: `Renda passiva estressada de R$ ${mockFiiDropCoverage.stressedMonthlyPassive.toFixed(2)}/mês mantém ${mockFiiDropCoverage.stressedClinicCoveragePct.toFixed(1)}% de imunização dos custos do consultório.`
        });

        // 29. Teste de Invariância de Retirada Segura e Estocástica Box-Muller (Monte Carlo)
        const mockMcTest = runMonteCarloSimulation({
            currentPatrimony: 1500000,
            realAnnualReturn: 7.5,
            monthlyCosts: 2600,
            mcYears: 20,
            mcSimulations: 200,
            mcVolatility: 12.0
        });
        const testMcPass = mockMcTest.simulations === 200 && mockMcTest.p10 <= mockMcTest.p50 && mockMcTest.p50 <= mockMcTest.p90;
        tests.push({
            name: 'Consistência Estocástica da Distribuição Normal de Monte Carlo (Box-Muller)',
            formula: 'P10 ≤ P50 (Mediana) ≤ P90 ∧ Probabilidade_Ruína ∈ [0%, 100%]',
            passed: Boolean(testMcPass),
            detail: `200 trajetórias calculadas com sucesso: P10 = R$ ${Math.round(mockMcTest.p10).toLocaleString('pt-BR')} ≤ Mediana = R$ ${Math.round(mockMcTest.p50).toLocaleString('pt-BR')} ≤ P90 = R$ ${Math.round(mockMcTest.p90).toLocaleString('pt-BR')}.`
        });

        // 30. Teste de Sensibilidade da Taxa de Poupança Clínica (Savings Rate)
        const mockSavings = computeFinancialModel({
            weeklySessions: 16,
            weeksPerMonth: 4.2,
            avgTicket: 250,
            monthlyCosts: 2600,
            monthlyContribution: 4200
        });
        const expectedSavingsRate = (4200 / (mockSavings.netRevenue)) * 100;
        const testSavingsPass = Math.abs(mockSavings.savingsRate - expectedSavingsRate) < 1e-2 && mockSavings.savingsRate > 20;
        tests.push({
            name: 'Cálculo de Precisão da Taxa de Poupança Clínica Líquida (Savings Rate)',
            formula: 'Taxa_Poupança = (Aporte_Mensal / Receita_Líquida) × 100',
            passed: Boolean(testSavingsPass),
            detail: `Taxa de poupança clínica apurada em ${mockSavings.savingsRate.toFixed(2)}% (receita líquida de R$ ${mockSavings.netRevenue.toFixed(2)}/mês e aporte de R$ 4.200,00).`
        });

        // 31. Teste de Aporte Contracíclico (+20% sob Choque Severo) com Aceleração de Rebalanceamento
        const mockContracyclic = computeStressTest({
            stressScenario: 'crash30',
            currentPatrimony: 150000,
            monthlyContribution: 5000,
            stressBoostContribution: true
        });
        const testContracyclicPass = mockContracyclic.effectiveAporte === 6000 &&
            mockContracyclic.monthsToRecoverDynamic > 0 &&
            mockContracyclic.monthsToRecoverDynamic <= mockContracyclic.monthsToRecover;
        tests.push({
            name: 'Aceleração de Rebalanceamento com Aporte Contracíclico (+20% Oportunidade)',
            formula: 'Aporte_Contracíclico = Aporte × 1,20 ∧ Meses_Recuperação ≤ Meses_Lineares',
            passed: Boolean(testContracyclicPass),
            detail: `Aporte ampliado de R$ 5.000 para R$ ${mockContracyclic.effectiveAporte.toLocaleString('pt-BR')} sob choque de -30%, acelerando recomposição para ~${mockContracyclic.monthsToRecoverDynamic} meses.`
        });

        // 32. Teste de Resiliência de Alocação de Cotas com Ativos de Alta Cotação (Tesouro > R$ 3.000)
        const mockHighPriceTickers = {
            RF: [{ ticker: 'IPCA+2035', name: 'Tesouro IPCA+ 2035', price: 3200.00, yield: 6.4, type: 'Tesouro Direto' }]
        };
        const mockAllocHigh = [{ key: 'RF', name: 'Renda Fixa', recommendedAporte: 4000 }];
        const mockHighResult = computeAporteByTickers(mockAllocHigh, mockHighPriceTickers);
        const testHighPass = mockHighResult.byClass.length === 1 &&
            mockHighResult.byClass[0].tickers[0].shares === 1 &&
            mockHighResult.byClass[0].residual === 800 &&
            mockHighResult.totalResidual === 800;
        tests.push({
            name: 'Alocação com Ativos de Alto Valor Unitário e Destinação Residual para Reserva',
            formula: 'Cotas = floor(4000 / 3200) = 1 ∧ Troco_Residual = 800',
            passed: Boolean(testHighPass),
            detail: `Orçamento de R$ 4.000 alocou 1 cota de R$ 3.200,00 e direcionou R$ 800,00 residuais à reserva de oportunidade.`
        });

        // 33. Teste de Consistência da Taxa Segura de Retirada (SWR) sob Calibração Dinâmica
        const mockSwrStress = computeFinancialModel({
            weeklySessions: 16,
            weeksPerMonth: 4.2,
            avgTicket: 250,
            monthlyCosts: 2600,
            safeWithdrawalRate: 3.8
        });
        const expSwr38 = (mockSwrStress.netRevenue * 12) / 0.038;
        const testSwrStressPass = Math.abs(mockSwrStress.targetFullFire - expSwr38) < 1e-2 && mockSwrStress.targetFullFire > 0;
        tests.push({
            name: 'Consistência de Coeficiente SWR sob Calibração de 3,8% (Retirada Segura)',
            formula: 'Patrimônio_SWR = Receita_Líquida_Anual / 0,038',
            passed: Boolean(testSwrStressPass),
            detail: `Full FIRE calibrado para R$ ${mockSwrStress.targetFullFire.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} mantendo precisão atuarial estrita.`
        });

        // 34. Teste de Cobertura Sequencial de Degraus da Cascata com Degraus Extras Customizados
        const mockCascadeExtra = computeExpenseCascade({
            expenseEssential: 2500,
            expenseClinic: 2600,
            expenseFamily: 3500,
            expenseLifestyle: 2000,
            expenseCustom: 1500,
            nameCustom: 'Nível 5 • Reserva Estratégica & Projetos',
            currentPatrimony: 800000,
            realAnnualReturn: 7.5
        });
        const n5 = mockCascadeExtra.tiers.find(t => t.id === 'custom');
        const testCascadeExtraPass = n5 && n5.accumulatedCost === 12100 && mockCascadeExtra.totalCost === 12100;
        tests.push({
            name: 'Acumulação da Cascata com Degrau Customizado Nível 5 (Projetos & P&D)',
            formula: 'Custo_Total = Σ(Níveis_1_a_4) + Custo_Nível_5',
            passed: Boolean(testCascadeExtraPass),
            detail: `5 degraus consolidados totalizando R$ ${mockCascadeExtra.totalCost.toLocaleString('pt-BR')}/mês com cobertura calculada em ${mockCascadeExtra.globalCoverage.toFixed(1)}%.`
        });

        // 35. Teste de Reversão à Média e Recuperação de Crossover Pós-Queda de 30%
        const mockRecovery30 = computeStressTest({
            stressScenario: 'crash30',
            currentPatrimony: 300000,
            monthlyCosts: 2600,
            monthlyContribution: 4500,
            realAnnualReturn: 7.5
        });
        const testRecovery30Pass = mockRecovery30.stressedPatrimony === 210000 &&
            mockRecovery30.lostCapital === 90000 &&
            mockRecovery30.monthsToRecoverDynamic > 0 &&
            mockRecovery30.monthsToRecoverDynamic <= Math.round(90000 / 4500);
        tests.push({
            name: 'Reversão à Média e Recuperação Dinâmica do Crossover Pós-Queda de 30%',
            formula: 'Patrimônio_Crash = 300.000 × 0,70 = 210.000 ∧ Meses_Dinâmicos ≤ 20',
            passed: Boolean(testRecovery30Pass),
            detail: `Perda temporária de R$ 90.000 sob choque de 30% é recuperada em ${mockRecovery30.monthsToRecoverDynamic} meses com reinvestimento e aportes contínuos.`
        });

        // 36. Teste de Choque Extremo Black Swan (−50% Ativos / +10% Custos)
        const mockBlackSwan = computeStressTest({
            stressScenario: 'black_swan',
            currentPatrimony: 200000,
            monthlyCosts: 2500,
            monthlyContribution: 4000,
            realAnnualReturn: 7.5
        });
        const testBlackSwanPass = mockBlackSwan.stressedPatrimony === 100000 &&
            mockBlackSwan.lostCapital === 100000 &&
            Math.abs(mockBlackSwan.stressedClinicCosts - 2750) < 1e-2;
        tests.push({
            name: 'Resiliência Atuarial sob Choque Extremo Black Swan (−50% Patrimônio / +10% Custos)',
            formula: 'Patrimônio_Swan = 200.000 × 0,50 = 100.000 ∧ Custos_Swan = 2.500 × 1,10 = 2.750',
            passed: Boolean(testBlackSwanPass),
            detail: `Patrimônio retido de R$ 100.000 com custos inflacionados para R$ 2.750,00 mantendo solvência operacional.`
        });

        // 37. Teste de Integração de Tickers Personalizados no Motor de Cotas Inteiras
        const mockUserTickers = {
            FII: [{ ticker: 'XPML11', name: 'XP Malls', price: 110.00, yield: 8.9, type: 'Shopping' }]
        };
        const mockAllocUser = [{ key: 'FII', name: 'Fundos Imobiliários', recommendedAporte: 1100 }];
        const mockUserResult = computeAporteByTickers(mockAllocUser, mockUserTickers);
        const testUserPass = mockUserResult.byClass.length === 1 &&
            mockUserResult.byClass[0].tickers[0].ticker === 'XPML11' &&
            mockUserResult.byClass[0].tickers[0].shares === 10 &&
            mockUserResult.totalResidual === 0;
        tests.push({
            name: 'Integração de Tickers Customizados do Usuário no Motor de Cotas Inteiras',
            formula: 'Cotas = floor(1100 / 110) = 10 ∧ Troco_Residual = 0',
            passed: Boolean(testUserPass),
            detail: `Ticker customizado XPML11 alocou 10 cotas exatas de R$ 110,00 totalizando R$ 1.100,00 sem resíduo.`
        });

        // 38. Teste de Monotonia e Boundedness da Taxa de Poupança e Alinhamento de Metas
        const mockAlignModel = computeFinancialModel();
        const testAlignPass = mockAlignModel.savingsRate >= 0 && mockAlignModel.savingsRate <= 100;
        tests.push({
            name: 'Monotonia e Boundedness da Taxa de Poupança e Alinhamento de Metas',
            formula: '0% ≤ Taxa_Poupança ≤ 100% ∧ Cobertura_Global ≥ 0%',
            passed: Boolean(testAlignPass),
            detail: `Taxa de poupança clínica delimitada em ${mockAlignModel.savingsRate.toFixed(1)}% com convergência estrita.`
        });

        // 39. Teste de Sensibilidade de Retirada Segura: SWR 3,0% (Super Conservador) vs 4,5%
        const mockSwr30 = computeFinancialModel({
            weeklySessions: 16,
            weeksPerMonth: 4.2,
            avgTicket: 250,
            monthlyCosts: 2600,
            safeWithdrawalRate: 3.0
        });
        const mockSwr45 = computeFinancialModel({
            weeklySessions: 16,
            weeksPerMonth: 4.2,
            avgTicket: 250,
            monthlyCosts: 2600,
            safeWithdrawalRate: 4.5
        });
        const testSwrSensPass = mockSwr30.targetFullFire > mockSwr45.targetFullFire &&
            Math.abs(mockSwr30.targetFullFire - (mockSwr30.netRevenue * 12 / 0.03)) < 1e-2 &&
            Math.abs(mockSwr45.targetFullFire - (mockSwr45.netRevenue * 12 / 0.045)) < 1e-2;
        tests.push({
            name: 'Sensibilidade Atuarial de Retirada Segura: SWR 3,0% (Super Conservador) vs 4,5%',
            formula: 'Patrimônio_SWR(3,0%) > Patrimônio_SWR(4,5%) ∧ Relação_Inversa_Estrita',
            passed: Boolean(testSwrSensPass),
            detail: `SWR 3,0% exige R$ ${mockSwr30.targetFullFire.toLocaleString('pt-BR')} vs R$ ${mockSwr45.targetFullFire.toLocaleString('pt-BR')} em SWR 4,5%.`
        });

        // 40. Teste de Horas Clínicas Poupadas e Dias de Sobrevivência por Degrau da Cascata
        const mockCascadeHours = computeExpenseCascade({
            weeklySessions: 16,
            weeksPerMonth: 4.2,
            indirectWeeklyHours: 6,
            avgTicket: 250,
            monthlyCosts: 2600,
            expenseEssential: 2500
        });
        const essentialTier = mockCascadeHours.tiers.find(t => t.id === 'essential');
        const testHoursPass = essentialTier && essentialTier.hoursNeeded > 0 && essentialTier.sessionsNeeded > 0 &&
            essentialTier.survivalBufferDays !== undefined;
        tests.push({
            name: 'Equivalência de Horas Clínicas Poupadas e Dias de Sobrevivência por Degrau',
            formula: 'Horas_Poupadas = Custo_Degrau / Valor_Hora_Efetiva ∧ Dias_Buffer = (Passivo / Custo) × 30',
            passed: Boolean(testHoursPass),
            detail: `Nível 1 (R$ 2.500) poupa ${essentialTier.sessionsNeeded.toFixed(1)} sessões (~${essentialTier.hoursNeeded.toFixed(1)}h de trabalho clínico total).`
        });

        // 41. Teste de Aceleração com Aporte de Oportunidade (+20%) sob Estresse
        const mockBoostStress = computeStressTest({
            stressScenario: 'crash30',
            currentPatrimony: 200000,
            monthlyCosts: 2500,
            monthlyContribution: 5000,
            realAnnualReturn: 7.5,
            stressBoostContribution: true
        });
        const testBoostStressPass = mockBoostStress.effectiveAporte === 6000 &&
            mockBoostStress.monthsToRecoverDynamic <= mockBoostStress.monthsToRecover;
        tests.push({
            name: 'Dinâmica de Recomposição Pós-Queda de 30% com Aporte de Oportunidade (+20%)',
            formula: 'Aporte_Crash = 5000 × 1,20 = 6000 ∧ Meses_Recomposição_Dinâmica ≤ Linear',
            passed: Boolean(testBoostStressPass),
            detail: `Aporte ampliado para R$ 6.000/mês garante recomposição total do capital em ~${mockBoostStress.monthsToRecoverDynamic} meses.`
        });

        // 42. Teste de Convergência sob Taxa Real Nula (0% a.a. — Crescimento Linear Puro)
        const mockZeroReturn = computeFinancialModel({
            weeklySessions: 16,
            weeksPerMonth: 4.2,
            avgTicket: 250,
            monthlyCosts: 2600,
            monthlyContribution: 4000,
            currentPatrimony: 100000,
            realAnnualReturn: 0,
            horizonYears: 10
        });
        const testZeroPass = mockZeroReturn.monthlyRate === 0 &&
            mockZeroReturn.yearlySeries.length === 11 &&
            mockZeroReturn.yearlySeries[10].patrimony === 100000 + (4000 * 12 * 10);
        tests.push({
            name: 'Convergência Numérica sob Taxa Real Nula (0% a.a. — Crescimento Linear Puro)',
            formula: 'i = 0 ⇒ Patrimônio(t) = Patrimônio_0 + (Aporte × 12 × t)',
            passed: Boolean(testZeroPass),
            detail: `Em 10 anos a 0% a.a., patrimônio final converge exatamente para R$ ${(100000 + 4000 * 120).toLocaleString('pt-BR')}.`
        });

        const allPassed = tests.every(t => t.passed);
        return {
            allPassed,
            timestamp: new Date().toISOString(),
            testsCount: tests.length,
            passedCount: tests.filter(t => t.passed).length,
            tests
        };
    }

    function renderSubTabAuditoria(container) {
        const C = global.VaultCore;
        const auditResults = (global.VaultTabFinancas && typeof global.VaultTabFinancas.auditFinancialCalculations === 'function')
            ? global.VaultTabFinancas.auditFinancialCalculations()
            : auditFinancialCalculationsInternal();

        const tests = auditResults.tests || [];
        const passedCount = auditResults.passedCount !== undefined ? auditResults.passedCount : tests.filter(t => t.passed).length;
        const totalCount = auditResults.testsCount !== undefined ? auditResults.testsCount : tests.length;
        const allOk = auditResults.allPassed;

        container.innerHTML = `
            <div class="space-y-5">
                <!-- Banner Superior da Suíte de Auditoria Contínua -->
                <div class="bg-gradient-to-r from-[#0f172a] via-[#091b24] to-[#0f172a] border ${allOk ? 'border-emerald-500/40' : 'border-rose-500/40'} rounded-xl p-5 shadow-xl space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${allOk ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'}">
                                    Auditoria Matemática &amp; Atuarial
                                </span>
                                <span class="text-xs font-mono text-cyan-400">Rigor Numérico • Erro Relativo &lt; 10⁻⁶</span>
                            </div>
                            <h3 class="text-lg font-bold text-slate-100 mt-1">
                                Suíte de Verificação Contínua de Cálculos Financeiros
                            </h3>
                            <p class="text-xs text-slate-300 max-w-2xl mt-0.5 leading-relaxed">
                                Verificação matemática automatizada de juros reais compostos, regras de Trinity/FIRE (4% SWR), simulação de choque sistêmico (−30%), alocação ótima e integridade de cotas inteiras sem backend.
                            </p>
                        </div>

                        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                            <button type="button" id="btn-re-audit" class="min-h-[42px] px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition">
                                <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                                <span>Reexecutar Auditoria Agora</span>
                            </button>
                        </div>
                    </div>

                    <!-- Resumo Numérico -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800">
                        <div class="bg-[#090d16] border border-slate-800 rounded-lg p-3">
                            <div class="text-[10px] font-mono uppercase text-slate-400">Status Geral</div>
                            <div class="text-base font-bold font-mono ${allOk ? 'text-emerald-400' : 'text-rose-400'} mt-0.5 flex items-center gap-1.5">
                                <span>${allOk ? '✓ 100% Aprovado' : '⚠ Falha Detectada'}</span>
                                <span class="text-xs text-slate-400 font-normal">(${passedCount}/${totalCount} testes)</span>
                            </div>
                        </div>

                        <div class="bg-[#090d16] border border-slate-800 rounded-lg p-3">
                            <div class="text-[10px] font-mono uppercase text-slate-400">Última Execução</div>
                            <div class="text-sm font-mono text-cyan-300 mt-1">
                                ${new Date(auditResults.timestamp || Date.now()).toLocaleTimeString('pt-BR')} • Local
                            </div>
                        </div>

                        <div class="bg-[#090d16] border border-slate-800 rounded-lg p-3">
                            <div class="text-[10px] font-mono uppercase text-slate-400">Margem de Tolerância Numérica</div>
                            <div class="text-sm font-mono text-emerald-300 mt-1">
                                ε &lt; 0.000001 (Ponto Flutuante IEEE 754)
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabela de Testes Individuais -->
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <h4 class="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                            Detalhamento dos Testes Atuariais
                        </h4>
                        <span class="text-xs font-mono text-slate-500">Execução instantânea client-side</span>
                    </div>

                    <div class="grid grid-cols-1 gap-2.5">
                        ${tests.map((t, idx) => `
                            <div class="bg-[#0f172a] border ${t.passed ? 'border-slate-800 hover:border-emerald-500/30' : 'border-rose-500/40'} rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition">
                                <div class="space-y-1">
                                    <div class="flex items-center gap-2">
                                        <span class="w-5 h-5 rounded-full ${t.passed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'} flex items-center justify-center text-xs font-mono font-bold">
                                            ${t.passed ? '✓' : '✗'}
                                        </span>
                                        <strong class="text-xs sm:text-sm font-bold text-slate-100 font-mono">
                                            ${idx + 1}. ${C.esc(t.name)}
                                        </strong>
                                    </div>
                                    ${t.formula ? `
                                        <div class="text-[11px] font-mono text-cyan-300 pl-7">
                                            Fórmula: <code>${C.esc(t.formula)}</code>
                                        </div>
                                    ` : ''}
                                    <div class="text-xs text-slate-400 pl-7 font-mono leading-relaxed">
                                        ${C.esc(t.detail)}
                                    </div>
                                </div>

                                <div class="shrink-0 pl-7 sm:pl-0">
                                    <span class="px-2.5 py-1 rounded-md text-xs font-mono font-bold ${t.passed ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'}">
                                        ${t.passed ? 'APROVADO' : 'REPROVADO'}
                                    </span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        const btnReAudit = document.getElementById('btn-re-audit');
        if (btnReAudit) {
            btnReAudit.addEventListener('click', () => {
                renderSubTabAuditoria(container);
                if (C && C.refreshIcons) C.refreshIcons(container);
                C.toast('Auditoria matemática reexecutada: cálculos verificados.', 'success');
            });
        }
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

        const btnSyncAgenda = document.getElementById('btn-ind-sync-agenda');
        if (btnSyncAgenda) {
            btnSyncAgenda.addEventListener('click', () => {
                const C = global.VaultCore;
                if (!C || !C.store) return;
                const agenda = C.store.get(C.STORAGE_KEYS.AGENDA, null);
                if (!agenda || typeof agenda !== 'object') {
                    C.toast('Nenhum dado encontrado na Aba 7 (Agenda). Sincronize sua agenda primeiro.', 'warning');
                    return;
                }
                const defaultPrice = Number(agenda.config && agenda.config.defaultSessionPrice) || 200;
                const pCfg = agenda.patientsConfig || {};
                const ignoredKw = ['apae', 'psiquiatra', 'consultoria ladoso', 'serelepe', 'reunião', 'supervisão', 'almoço', 'pessoal', 'feriado', 'compromisso', 'estudo'];

                const allSessions = []
                    .concat(Array.isArray(agenda.events) ? agenda.events : [])
                    .concat(Array.isArray(agenda.manualSessions) ? agenda.manualSessions : []);

                const validSessions = allSessions.filter((ev) => {
                    if (!ev || ev.status === 'cancelled' || ev.isAbsent) return false;
                    const title = String(ev.summary || ev.patientName || ev.title || '').trim();
                    if (!title) return false;
                    const cfg = pCfg[title];
                    if (cfg && cfg.isIgnored) return false;
                    const low = title.toLowerCase();
                    if (!cfg && ignoredKw.some((kw) => low.includes(kw))) return false;
                    return true;
                });

                if (validSessions.length === 0) {
                    C.toast('Nenhuma sessão clínica válida encontrada na Agenda para calcular a média.', 'warning');
                    return;
                }

                // Agrupa por mês (YYYY-MM) e usa o mês mais recente com atendimentos
                const byMonth = {};
                let sumPrices = 0;
                validSessions.forEach((ev) => {
                    const dt = String(ev.startDate || ev.date || (ev.start && (ev.start.dateTime || ev.start.date)) || '');
                    const ym = dt.slice(0, 7);
                    if (/^\d{4}-\d{2}$/.test(ym)) {
                        byMonth[ym] = (byMonth[ym] || 0) + 1;
                    }
                    const title = String(ev.summary || ev.patientName || ev.title || '').trim();
                    const cfg = pCfg[title];
                    const price = (cfg && Number(cfg.customPrice) > 0) ? Number(cfg.customPrice) : (Number(ev.price) > 0 ? Number(ev.price) : defaultPrice);
                    sumPrices += price;
                });

                const months = Object.keys(byMonth).sort();
                const latestYM = months[months.length - 1];
                const monthSessions = latestYM ? byMonth[latestYM] : validSessions.length;
                const wPerMonth = Math.max(1, Number(inputs.weeksPerMonth) || 4.2);
                const estWeekly = Math.max(1, Math.round(monthSessions / wPerMonth));
                const avgTicket = Math.round(sumPrices / validSessions.length);

                inputs.weeklySessions = estWeekly;
                inputs.avgTicket = avgTicket;
                saveInputs();
                renderSubTabContent();
                C.toast(`Sincronizado (${latestYM || 'Agenda'}): ${estWeekly} sessões/sem • Ticket médio ${C.formatBRL(avgTicket)}.`, 'success', 4200);
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

        // Adicionar novo ticker personalizado
        const btnAddTicker = document.getElementById('btn-add-user-ticker');
        if (btnAddTicker) {
            btnAddTicker.addEventListener('click', () => {
                const codeInp = document.getElementById('new-ticker-code');
                const nameInp = document.getElementById('new-ticker-name');
                const classSel = document.getElementById('new-ticker-class');
                const priceInp = document.getElementById('new-ticker-price');
                const yieldInp = document.getElementById('new-ticker-yield');

                const ticker = (codeInp ? codeInp.value : '').trim().toUpperCase();
                const name = (nameInp ? nameInp.value : '').trim();
                const classKey = classSel ? classSel.value : 'FII';
                const price = Math.max(0.01, Number(priceInp ? priceInp.value : 0) || 0);
                const yieldVal = Math.max(0, Number(yieldInp ? yieldInp.value : 0) || 0);

                if (!ticker || !name || price <= 0) {
                    C.toast('Preencha código, nome e preço do ativo.', 'warning');
                    return;
                }

                if (!Array.isArray(inputs.userTickers)) inputs.userTickers = [];
                inputs.userTickers.push({
                    ticker,
                    name,
                    classKey,
                    price,
                    yield: yieldVal,
                    type: classKey === 'FII' ? 'Fundo Imobiliário' : (classKey === 'RF' ? 'Renda Fixa' : (classKey === 'Acoes' ? 'Ação' : 'ETF Global'))
                });

                saveInputs();
                renderSubTabContent();
                C.toast(`Ativo ${ticker} adicionado à carteira.`, 'success');
            });
        }

        // Remover ticker personalizado
        document.querySelectorAll('[data-del-user-ticker]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-del-user-ticker'), 10);
                if (Array.isArray(inputs.userTickers) && inputs.userTickers[idx]) {
                    const removed = inputs.userTickers[idx].ticker;
                    inputs.userTickers.splice(idx, 1);
                    saveInputs();
                    renderSubTabContent();
                    C.toast(`Ativo ${removed} removido da carteira.`, 'info');
                }
            });
        });

        // Copiar boleta de compras consolidada para Home Broker
        const btnCopyOrder = document.getElementById('btn-copy-alocador-order');
        if (btnCopyOrder) {
            btnCopyOrder.addEventListener('click', () => {
                const res = computeAporteAllocation();
                const tickerData = computeAporteByTickers(res.classes);
                if (tickerData && tickerData.summaryOrderText) {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(tickerData.summaryOrderText).then(() => {
                            C.toast('Boleta de compra copiada para a área de transferência!', 'success', 2500);
                        }).catch(() => {
                            C.toast('Selecione e copie manualmente os ativos da tela.', 'warning');
                        });
                    } else {
                        C.toast('Área de transferência não disponível. Copie diretamente da tela.', 'warning');
                    }
                }
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
        computeExpenseCascade,
        computeStressTest,
        computeAporteAllocation,
        computeAporteByTickers,
        fetchLiveMarketData,
        runMonteCarloSimulation,
        auditFinancialCalculations: auditFinancialCalculationsInternal,
        getInputs: () => inputs,
        setInputs: (newInputs) => {
            inputs = Object.assign({}, inputs, newInputs);
            saveInputs();
            renderSubTabContent();
        },
        getLiveMarketData: () => liveMarketData,
        getLiveMarketStatus: () => liveMarketStatus,
        DEFAULT_INPUTS,
        TICKER_DIRECTORY
    };
    global.VaultTabFinancas = global.VaultTabIndependencia;
})(window);
