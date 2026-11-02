/**
 * NEXUS VAULT — Aba 6: Finanças & Independência Financeira (tab-financas.js)
 * Módulo 100% Client-Side • Zero-Backend • LGPD Compliant
 *
 * Provê interface canônica de finanças, atuarial e alocador inteligente,
 * harmonizado com tab-independencia.js para interoperabilidade total.
 */
(function (global) {
    'use strict';

    function init() {
        if (global.VaultTabIndependencia && typeof global.VaultTabIndependencia.init === 'function') {
            global.VaultTabIndependencia.init();
        }
    }

    function computeFinancialModel() {
        if (global.VaultTabIndependencia && typeof global.VaultTabIndependencia.computeFinancialModel === 'function') {
            return global.VaultTabIndependencia.computeFinancialModel();
        }
        return null;
    }

    function fetchLiveMarketData() {
        if (global.VaultTabIndependencia && typeof global.VaultTabIndependencia.fetchLiveMarketData === 'function') {
            return global.VaultTabIndependencia.fetchLiveMarketData();
        }
    }

    const api = {
        init,
        computeFinancialModel,
        fetchLiveMarketData
    };

    global.VaultTabFinancas = api;
    if (!global.VaultTabIndependencia) {
        global.VaultTabIndependencia = api;
    }
})(window);
