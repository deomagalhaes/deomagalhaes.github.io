/**
 * NEXUS VAULT — Aba 6: Finanças & Independência Financeira (tab-financas.js)
 * Módulo 100% Client-Side • Zero-Backend • LGPD Compliant
 *
 * Provê interface canônica de engenharia financeira, atuária, simulação de estresse,
 * cascata de despesas editável e alocador inteligente de ativos,
 * perfeitamente integrado e harmonizado com tab-independencia.js.
 */
(function (global) {
    'use strict';

    /**
     * Inicializa a aba de finanças e independência clínica
     */
    function init() {
        if (global.VaultTabIndependencia && typeof global.VaultTabIndependencia.init === 'function') {
            global.VaultTabIndependencia.init();
        }
    }

    /**
     * Retorna o modelo atuarial completo com projeções de crossover,
     * taxas mensais reais compostas, compra de liberdade e SWR
     */
    function computeFinancialModel() {
        if (global.VaultTabIndependencia && typeof global.VaultTabIndependencia.computeFinancialModel === 'function') {
            return global.VaultTabIndependencia.computeFinancialModel();
        }
        return null;
    }

    /**
     * Retorna a cascata de despesas editável com tiers de sobrevivência,
     * consultório, família, estilo de vida e despesas personalizadas
     */
    function computeExpenseCascade() {
        if (global.VaultTabIndependencia && typeof global.VaultTabIndependencia.computeExpenseCascade === 'function') {
            return global.VaultTabIndependencia.computeExpenseCascade();
        }
        return null;
    }

    /**
     * Executa simulação de cenários de estresse de mercado:
     * -30% COVID/Flash Crash, -40% Subprime, -20% Correção, Estagflação, FIIs e Choque Manual
     */
    function computeStressTest() {
        if (global.VaultTabIndependencia && typeof global.VaultTabIndependencia.computeStressTest === 'function') {
            return global.VaultTabIndependencia.computeStressTest();
        }
        return null;
    }

    /**
     * Calcula o rebalanceamento inteligente de aporte pelas 4 macroclasses
     * sem venda de ativos (evitando fricção tributária)
     */
    function computeAporteAllocation() {
        if (global.VaultTabIndependencia && typeof global.VaultTabIndependencia.computeAporteAllocation === 'function') {
            return global.VaultTabIndependencia.computeAporteAllocation();
        }
        return null;
    }

    /**
     * Calcula as cotas inteiras a comprar de cada ativo/ticker específico
     * com alocação ótima e saldo residual para a reserva de oportunidade
     */
    function computeAporteByTickers(classes) {
        if (global.VaultTabIndependencia && typeof global.VaultTabIndependencia.computeAporteByTickers === 'function') {
            return global.VaultTabIndependencia.computeAporteByTickers(classes);
        }
        return null;
    }

    /**
     * Atualiza dados de mercado ao vivo via AwesomeAPI e endpoints públicos sem backend
     */
    async function fetchLiveMarketData() {
        if (global.VaultTabIndependencia && typeof global.VaultTabIndependencia.fetchLiveMarketData === 'function') {
            return global.VaultTabIndependencia.fetchLiveMarketData();
        }
        return null;
    }

    /**
     * Executa 1.000 trajetórias estocásticas de Monte Carlo (Box-Muller)
     * para avaliar risco de ruína e risco de sequência de retornos (SORR)
     */
    function runMonteCarloSimulation() {
        if (global.VaultTabIndependencia && typeof global.VaultTabIndependencia.runMonteCarloSimulation === 'function') {
            return global.VaultTabIndependencia.runMonteCarloSimulation();
        }
        return null;
    }

    const api = {
        init,
        computeFinancialModel,
        computeExpenseCascade,
        computeStressTest,
        computeAporteAllocation,
        computeAporteByTickers,
        fetchLiveMarketData,
        runMonteCarloSimulation
    };

    global.VaultTabFinancas = api;
    if (!global.VaultTabIndependencia) {
        global.VaultTabIndependencia = api;
    }
})(window);
