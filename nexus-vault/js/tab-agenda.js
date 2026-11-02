/**
 * NEXUS VAULT — Aba 7: Gestão Clínica de Sessões, Agenda Google & Faturamento de Honorários
 * 100% Client-Side • Zero-Backend • LGPD Compliant • Sincronização Google Agenda
 *
 * Módulos Integrados:
 * 1. Sincronizador Multicamadas (API Local, Script Seed JS, Cache JSON, Arquivo iCal .ics e FileReader Nativo)
 * 2. Motor de Apuração Mensal por Paciente (Contagem de Sessões, Datas e Total a Cobrar)
 * 3. Hub de Cobrança Humanista com Integração WhatsApp (1-Click com Chave PIX)
 * 4. Emissor de Recibos Profissionais & Declarações de Comparecimento (ABNT / CRP 04/42784)
 * 5. Linha do Tempo Cronológica com Gestão de Faltas e Remarcações
 * 6. Gestor de Tabela de Honorários Individualizada e Exportação Contábil (CSV/JSON)
 */
(function (global) {
    'use strict';

    // =========================================================================
    // 1. CONSTANTES E CONFIGURAÇÕES PADRÃO
    // =========================================================================
    const DEFAULT_CONFIG = {
        defaultSessionPrice: 200,
        pixKey: 'contato@deomagalhaes.com.br',
        pixKeyType: 'email',
        pixBeneficiary: 'Deo Magalhães',
        pixBank: 'Banco Inter / NuBank',
        pixCity: 'Guaranésia, MG',
        clinicTitle: 'Deo Magalhães - Neuropsicólogo Clínico',
        clinicCrp: 'CRP 04/42784',
        calendarId: 'f518acb6bf4c0e38b2ae92bc8c85c007c9bcf00592b97233c53bfcbfbec2dcdd@group.calendar.google.com',
        autoMarkBilledOnWhatsApp: true,
        whatsappTemplate: 'Olá, {responsavel}! Tudo bem?\n\nPassando para compartilhar o demonstrativo de atendimentos de Neuropsicologia referente ao mês de *{mes_ano}* do paciente *{paciente}*:\n\n🗓️ *Sessões realizadas ({qtd_sessoes}):*\n{lista_datas}\n\n💰 *Valor total:* {valor_total} ({qtd_sessoes} sessões × {valor_unitario})\n🔑 *Chave PIX:* `{chave_pix}` ({beneficiario} - {banco})\n\nAssim que realizar o pagamento, por gentileza envie o comprovante por aqui. Caso necessite de recibo formal para imposto de renda ou reembolso de saúde, estou à disposição!\n\nUm abraço acolhedor,\n*Deo Magalhães • Neuropsicólogo (CRP 04/42784)*'
    };

    // Palavras-chave de compromissos que NÃO são pacientes clínicos por padrão
    const DEFAULT_IGNORED_KEYWORDS = [
        'apae', 'psiquiatra', 'consultoria ladoso', 'serelepe', 'reunião',
        'supervisão', 'almoço', 'pessoal', 'feriado', 'compromisso', 'estudo'
    ];

    // =========================================================================
    // 2. ESTADO DO MÓDULO
    // =========================================================================
    let state = {
        config: Object.assign({}, DEFAULT_CONFIG),
        selectedYear: new Date().getFullYear(),
        selectedMonth: new Date().getMonth(), // 0-indexed (0 = Jan, 10 = Nov)
        activeSubTab: 'faturamento', // 'faturamento', 'cronograma', 'pacientes'
        searchTerm: '',
        statusFilter: 'all', // 'all', 'pendente', 'cobrado', 'pago', 'isento'
        events: [],
        manualSessions: [],
        patientsConfig: {}, // { [pacienteNome]: { customPrice, guardian, phone, notes, isIgnored, category } }
        monthlyStatus: {},  // { [yearMonth_paciente]: { status, paidAmount, paymentDate, paymentMethod, receiptNum, notes } }
        lastSyncedAt: null,
        syncStatus: 'idle', // 'idle', 'loading', 'success', 'error'
        lastSyncSource: ''
    };

    // =========================================================================
    // 3. PERSISTÊNCIA LOCAL (LocalStorage VaultCore)
    // =========================================================================
    function loadState() {
        const C = global.VaultCore;
        if (!C || !C.store) return;
        const saved = C.store.get(C.STORAGE_KEYS.AGENDA, null);
        if (saved && typeof saved === 'object') {
            if (saved.config) state.config = Object.assign({}, DEFAULT_CONFIG, saved.config);
            if (saved.patientsConfig) state.patientsConfig = Object.assign({}, saved.patientsConfig);
            if (saved.monthlyStatus) state.monthlyStatus = Object.assign({}, saved.monthlyStatus);
            if (Array.isArray(saved.manualSessions)) state.manualSessions = saved.manualSessions;
            if (Array.isArray(saved.events) && saved.events.length > 0) state.events = saved.events;
            if (saved.lastSyncedAt) state.lastSyncedAt = saved.lastSyncedAt;
            if (saved.lastSyncSource) state.lastSyncSource = saved.lastSyncSource;
        }
    }

    function saveState() {
        const C = global.VaultCore;
        if (!C || !C.store) return;
        C.store.set(C.STORAGE_KEYS.AGENDA, {
            config: state.config,
            patientsConfig: state.patientsConfig,
            monthlyStatus: state.monthlyStatus,
            manualSessions: state.manualSessions,
            events: state.events,
            lastSyncedAt: state.lastSyncedAt,
            lastSyncSource: state.lastSyncSource
        });
    }

    // =========================================================================
    // 4. MOTOR MULTICAMADAS DE IMPORTAÇÃO E SINCRONIZAÇÃO
    // =========================================================================
    /**
     * Importa eventos estruturados mesclando com os existentes
     */
    function importEvents(eventsArray, lastSyncedAt, sourceName = 'Google Agenda', showToast = true) {
        if (!Array.isArray(eventsArray) || eventsArray.length === 0) return 0;

        const eventMap = new Map();
        // Preserva eventos já existentes
        state.events.forEach(e => {
            if (e && e.id) eventMap.set(e.id, e);
        });
        // Insere ou atualiza novos
        eventsArray.forEach(e => {
            if (e && e.id) eventMap.set(e.id, e);
        });

        state.events = Array.from(eventMap.values());
        state.lastSyncedAt = lastSyncedAt || new Date().toISOString();
        state.lastSyncSource = sourceName;
        state.syncStatus = 'success';
        saveState();

        if (showToast && global.VaultCore) {
            global.VaultCore.toast(`Sincronizado via ${sourceName}! ${eventsArray.length} atendimentos carregados.`, 'success');
        }

        renderSyncButtonState();
        render();
        return eventsArray.length;
    }

    /**
     * Sincronização automática com fallback inteligente
     */
    async function syncFromGoogleCalendar(interactive = true) {
        state.syncStatus = 'loading';
        renderSyncButtonState();

        // Camada 1: Tenta o Endpoint da API Local (scripts/server.ps1)
        // Se o servidor local estiver ativo, ele executa gcalendar ao vivo na nuvem!
        try {
            const apiUrls = [
                'http://localhost:8080/api/sync-gcalendar',
                '/api/sync-gcalendar'
            ];
            for (const url of apiUrls) {
                try {
                    const resp = await fetch(url, { cache: 'no-store' });
                    if (resp.ok) {
                        const data = await resp.json();
                        if (Array.isArray(data.events) && data.events.length > 0) {
                            importEvents(data.events, data.lastSyncedAt, 'Google Calendar (Ao Vivo)', interactive);
                            return true;
                        }
                    }
                } catch {
                    // segue para próxima tentativa
                }
            }
        } catch {
            // endpoint inativo
        }

        // Camada 2: Tenta ler o arquivo data/agenda-cache.json via fetch HTTP
        try {
            const cacheUrls = [
                'data/agenda-cache.json',
                '/nexus-vault/data/agenda-cache.json',
                '../nexus-vault/data/agenda-cache.json'
            ];
            for (const url of cacheUrls) {
                try {
                    const resp = await fetch(url, { cache: 'no-store' });
                    if (resp.ok) {
                        const data = await resp.json();
                        if (Array.isArray(data.events) && data.events.length > 0) {
                            importEvents(data.events, data.lastSyncedAt, 'Cache Local (agenda-cache.json)', interactive);
                            return true;
                        }
                    }
                } catch {
                    // segue para próxima tentativa
                }
            }
        } catch {
            // segue
        }

        // Camada 3: Carrega do Seed JS integrado (window.__VAULT_AGENDA_SEED__)
        // Funciona 100% mesmo em file:// sem nenhuma restrição de CORS!
        if (window.__VAULT_AGENDA_SEED__ && Array.isArray(window.__VAULT_AGENDA_SEED__.events) && window.__VAULT_AGENDA_SEED__.events.length > 0) {
            importEvents(window.__VAULT_AGENDA_SEED__.events, window.__VAULT_AGENDA_SEED__.lastSyncedAt, 'Cache Integrado da Agenda', interactive);
            return true;
        }

        // Camada 4: Se não encontrou dados e o usuário clicou interativamente, abre modal com opções guiadas
        state.syncStatus = 'error';
        renderSyncButtonState();

        if (interactive) {
            openSyncModal();
        }
        return false;
    }

    /**
     * Parser nativo para arquivos iCalendar (.ics) exportados do Google Agenda
     */
    function parseICalendar(icsContent) {
        const events = [];
        const lines = icsContent.split(/\r\n|\n|\r/);
        let inEvent = false;
        let current = {};

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('BEGIN:VEVENT')) {
                inEvent = true;
                current = { id: 'ics_' + Math.random().toString(36).substr(2, 9) };
            } else if (line.startsWith('END:VEVENT')) {
                if (current.summary && current.start) {
                    events.push(current);
                }
                inEvent = false;
            } else if (inEvent) {
                if (line.startsWith('SUMMARY:')) {
                    current.summary = line.substring(8).trim();
                } else if (line.startsWith('UID:')) {
                    current.id = line.substring(4).trim();
                } else if (line.startsWith('DTSTART')) {
                    const val = line.split(':')[1];
                    current.start = parseIcsDate(val);
                } else if (line.startsWith('DTEND')) {
                    const val = line.split(':')[1];
                    current.end = parseIcsDate(val);
                } else if (line.startsWith('STATUS:')) {
                    current.status = line.substring(7).trim().toLowerCase();
                }
            }
        }
        return events;
    }

    function parseIcsDate(icsDateStr) {
        if (!icsDateStr) return new Date().toISOString();
        if (icsDateStr.length === 8) {
            const y = icsDateStr.substr(0, 4);
            const m = icsDateStr.substr(4, 2);
            const d = icsDateStr.substr(6, 2);
            return `${y}-${m}-${d}T10:00:00`;
        }
        const y = icsDateStr.substr(0, 4);
        const m = icsDateStr.substr(4, 2);
        const d = icsDateStr.substr(6, 2);
        const h = icsDateStr.substr(9, 2) || '00';
        const min = icsDateStr.substr(11, 2) || '00';
        const s = icsDateStr.substr(13, 2) || '00';
        return `${y}-${m}-${d}T${h}:${min}:${s}Z`;
    }

    /**
     * Processa arquivo selecionado via FileReader nativo (sem restrições de CORS)
     */
    function handleFileSelected(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const content = evt.target.result;
            try {
                if (file.name.toLowerCase().endsWith('.ics')) {
                    const parsed = parseICalendar(content);
                    if (parsed.length > 0) {
                        importEvents(parsed, new Date().toISOString(), `Arquivo iCal (${file.name})`, true);
                    } else {
                        throw new Error('Nenhum evento encontrado no arquivo .ics.');
                    }
                } else {
                    const json = JSON.parse(content);
                    const events = Array.isArray(json) ? json : (json.events || []);
                    if (events.length > 0) {
                        importEvents(events, json.lastSyncedAt || new Date().toISOString(), `Arquivo JSON (${file.name})`, true);
                    } else {
                        throw new Error('Nenhum atendimento encontrado no JSON.');
                    }
                }
            } catch (err) {
                if (global.VaultCore) global.VaultCore.toast(`Erro ao ler arquivo: ${err.message}`, 'error');
            }
        };
        reader.readAsText(file);
    }

    // =========================================================================
    // 5. PROCESSAMENTO E APURAÇÃO DE SESSÕES
    // =========================================================================
    function getMonthKey(year, month) {
        const m = String(month + 1).padStart(2, '0');
        return `${year}-${m}`;
    }

    function formatBRL(val) {
        return (Number(val) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function formatDateBR(dateObj) {
        const d = String(dateObj.getDate()).padStart(2, '0');
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        return `${d}/${m}`;
    }

    function formatTimeBR(dateObj) {
        const h = String(dateObj.getHours()).padStart(2, '0');
        const min = String(dateObj.getMinutes()).padStart(2, '0');
        return `${h}:${min}`;
    }

    function isIgnoredTitle(title) {
        const clean = (title || '').trim().toLowerCase();
        if (!clean) return true;
        if (state.patientsConfig[title] && state.patientsConfig[title].isIgnored) {
            return true;
        }
        return DEFAULT_IGNORED_KEYWORDS.some(kw => clean === kw || clean.startsWith(kw + ' ') || clean.endsWith(' ' + kw));
    }

    /**
     * Retorna todos os atendimentos do mês selecionado estruturados
     */
    function getMonthlyReport() {
        const targetKey = getMonthKey(state.selectedYear, state.selectedMonth);
        const allSessions = [];

        // 1. Processar Eventos do Google Agenda
        state.events.forEach(ev => {
            if (!ev.start || ev.status === 'cancelled') return;
            const d = new Date(ev.start);
            if (isNaN(d.getTime())) return;

            if (d.getFullYear() === state.selectedYear && d.getMonth() === state.selectedMonth) {
                const title = (ev.summary || '').trim();
                allSessions.push({
                    id: ev.id,
                    source: 'gcal',
                    title: title,
                    date: d,
                    end: ev.end ? new Date(ev.end) : null,
                    htmlLink: ev.htmlLink,
                    isIgnored: isIgnoredTitle(title),
                    statusOverride: null
                });
            }
        });

        // 2. Processar Sessões Manuais do mês
        state.manualSessions.forEach(ms => {
            const d = new Date(ms.date);
            if (d.getFullYear() === state.selectedYear && d.getMonth() === state.selectedMonth) {
                allSessions.push({
                    id: ms.id,
                    source: 'manual',
                    title: ms.patient,
                    date: d,
                    end: ms.end ? new Date(ms.end) : null,
                    htmlLink: null,
                    isIgnored: false,
                    statusOverride: ms.status || 'realizada'
                });
            }
        });

        // Ordenar cronologicamente
        allSessions.sort((a, b) => a.date - b.date);

        // 3. Agrupar por Paciente
        const patientMap = new Map();

        allSessions.forEach(session => {
            if (session.isIgnored) return;

            const patientName = session.title;
            if (!patientMap.has(patientName)) {
                patientMap.set(patientName, {
                    name: patientName,
                    sessions: [],
                    customPrice: null,
                    guardian: '',
                    phone: '',
                    category: 'Neuropsicologia',
                    billingStatus: 'pendente',
                    paidAmount: 0,
                    paymentDate: '',
                    paymentMethod: 'PIX',
                    receiptNum: '',
                    notes: ''
                });
            }

            const pData = patientMap.get(patientName);
            pData.sessions.push(session);
        });

        // 4. Aplicar configurações persistidas de cada paciente e status do mês
        const patientReports = [];
        let totalSessionsCount = 0;
        let totalForecastBRL = 0;
        let totalReceivedBRL = 0;
        let totalPendingBRL = 0;

        patientMap.forEach((pData, patientName) => {
            const pConf = state.patientsConfig[patientName] || {};
            const statusKey = `${targetKey}_${patientName}`;
            const mStat = state.monthlyStatus[statusKey] || {};

            const unitPrice = (pConf.customPrice !== undefined && pConf.customPrice !== null && pConf.customPrice !== '')
                ? Number(pConf.customPrice)
                : Number(state.config.defaultSessionPrice);

            const sessionCount = pData.sessions.length;
            const totalToBill = sessionCount * unitPrice;
            const currentStatus = mStat.status || 'pendente';
            const effectivePaid = (currentStatus === 'pago') ? (mStat.paidAmount !== undefined ? Number(mStat.paidAmount) : totalToBill) : 0;

            pData.unitPrice = unitPrice;
            pData.sessionCount = sessionCount;
            pData.totalToBill = totalToBill;
            pData.guardian = pConf.guardian || '';
            pData.phone = pConf.phone || '';
            pData.category = pConf.category || 'Neuropsicologia';
            pData.clinicalNotes = pConf.notes || '';
            pData.billingStatus = currentStatus;
            pData.paidAmount = effectivePaid;
            pData.paymentDate = mStat.paymentDate || '';
            pData.paymentMethod = mStat.paymentMethod || 'PIX';
            pData.receiptNum = mStat.receiptNum || '';
            pData.statusNotes = mStat.notes || '';

            patientReports.push(pData);

            totalSessionsCount += sessionCount;
            totalForecastBRL += totalToBill;
            totalReceivedBRL += effectivePaid;
            if (currentStatus !== 'pago' && currentStatus !== 'isento') {
                totalPendingBRL += totalToBill;
            }
        });

        patientReports.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

        return {
            targetKey,
            patientReports,
            allSessions,
            totalSessionsCount,
            totalForecastBRL,
            totalReceivedBRL,
            totalPendingBRL,
            activePatientsCount: patientReports.length,
            recoveryRate: totalForecastBRL > 0 ? (totalReceivedBRL / totalForecastBRL) * 100 : 0
        };
    }

    // =========================================================================
    // 6. RENDERIZAÇÃO DA INTERFACE (HTML + TAILWIND)
    // =========================================================================
    function getMonthName(monthIdx) {
        const names = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return names[monthIdx] || '';
    }

    function renderSyncButtonState() {
        const btn = document.getElementById('btn-agenda-sync-trigger');
        if (!btn) return;
        if (state.syncStatus === 'loading') {
            btn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin text-cyan-300"></i><span>Sincronizando...</span>`;
            btn.classList.add('opacity-75');
        } else if (state.syncStatus === 'success') {
            btn.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i><span>Sincronizado</span>`;
            btn.classList.remove('opacity-75');
        } else if (state.syncStatus === 'error') {
            btn.innerHTML = `<i data-lucide="refresh-cw" class="w-4 h-4 text-amber-400"></i><span>Sincronizar Agenda</span>`;
            btn.classList.remove('opacity-75');
        } else {
            btn.innerHTML = `<i data-lucide="refresh-cw" class="w-4 h-4 text-sky-400"></i><span>Sincronizar Google Agenda</span>`;
            btn.classList.remove('opacity-75');
        }
        if (global.VaultCore) global.VaultCore.refreshIcons();
    }

    function render() {
        const root = document.getElementById('tab-panel-agenda');
        if (!root) return;

        const report = getMonthlyReport();
        const currentMonthName = getMonthName(state.selectedMonth);

        // Filtro em memória
        const filteredPatients = report.patientReports.filter(p => {
            const matchesSearch = !state.searchTerm ||
                p.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                p.guardian.toLowerCase().includes(state.searchTerm.toLowerCase());
            const matchesStatus = (state.statusFilter === 'all') || (p.billingStatus === state.statusFilter);
            return matchesSearch && matchesStatus;
        });

        // Formatação do último sync
        let syncLabel = 'Pronto para sincronizar';
        if (state.lastSyncedAt) {
            const syncD = new Date(state.lastSyncedAt);
            if (!isNaN(syncD.getTime())) {
                const src = state.lastSyncSource ? ` (${state.lastSyncSource})` : '';
                syncLabel = `Última sincronização: ${formatDateBR(syncD)} às ${formatTimeBR(syncD)}${src}`;
            }
        }

        root.innerHTML = `
            <div class="space-y-6">

                <!-- 1. TOPBAR DO MÓDULO DE AGENDAMENTOS E FATURAMENTO -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-5 shadow-xl">
                    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                        <!-- Título e Status de Sincronização -->
                        <div class="flex items-center gap-3">
                            <div class="w-11 h-11 rounded-xl bg-sky-500/15 border border-sky-500/35 flex items-center justify-center text-sky-400 shrink-0 shadow-lg shadow-sky-500/10">
                                <i data-lucide="calendar-check-2" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <h2 class="text-lg font-bold text-slate-100 tracking-tight">Gestão de Sessões &amp; Faturamento Clínico</h2>
                                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-sky-500/10 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                                        <i data-lucide="check" class="w-3 h-3 text-sky-400"></i>
                                        Google Calendar Sync
                                    </span>
                                </div>
                                <p class="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                                    <span>${syncLabel}</span>
                                    <span class="text-slate-600">•</span>
                                    <span class="font-mono text-cyan-400 text-[11px]">${report.totalSessionsCount} sessões no mês</span>
                                </p>
                            </div>
                        </div>

                        <!-- Controles Globais de Ação: Navegador de Mês + Botões -->
                        <div class="flex flex-wrap items-center gap-2">

                            <!-- Seletor Fluido de Mês/Ano -->
                            <div class="inline-flex items-center bg-[#090d16] border border-slate-700/80 rounded-xl p-1 shadow-inner">
                                <button type="button" id="btn-agenda-prev-month" title="Mês anterior"
                                    class="min-h-[36px] min-w-[36px] rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition">
                                    <i data-lucide="chevron-left" class="w-4 h-4"></i>
                                </button>
                                <span class="px-3 text-xs font-bold font-mono text-slate-200 whitespace-nowrap">
                                    ${currentMonthName} ${state.selectedYear}
                                </span>
                                <button type="button" id="btn-agenda-next-month" title="Próximo mês"
                                    class="min-h-[36px] min-w-[36px] rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition">
                                    <i data-lucide="chevron-right" class="w-4 h-4"></i>
                                </button>
                                <button type="button" id="btn-agenda-today" title="Voltar para o mês corrente"
                                    class="px-2 py-1 text-[11px] font-mono rounded-md hover:bg-slate-800 text-cyan-400 ml-1 border-l border-slate-800 transition">
                                    Hoje
                                </button>
                            </div>

                            <!-- Botão Sincronizar Google Agenda (Ao Vivo / Cache / Guiado) -->
                            <button type="button" id="btn-agenda-sync-trigger"
                                class="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/35 text-sky-200 font-semibold text-xs flex items-center gap-2 transition shadow-sm">
                                <i data-lucide="refresh-cw" class="w-4 h-4 text-sky-400"></i>
                                <span>Sincronizar Google Agenda</span>
                            </button>

                            <!-- Botão Carregar Arquivo da Agenda (.json ou .ics) -->
                            <button type="button" id="btn-agenda-pick-file-trigger" title="Carregar arquivo exportado do Google Agenda (.json ou .ics)"
                                class="min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition">
                                <i data-lucide="file-up" class="w-4 h-4 text-cyan-400"></i>
                                <span class="hidden sm:inline">Importar Arquivo</span>
                            </button>
                            <input type="file" id="input-agenda-file-picker" accept=".json,.ics,text/calendar,application/json" class="hidden">

                            <!-- Botão Adicionar Sessão Manual -->
                            <button type="button" id="btn-agenda-add-manual"
                                class="min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition">
                                <i data-lucide="plus" class="w-4 h-4 text-emerald-400"></i>
                                <span class="hidden sm:inline">Nova Sessão</span>
                            </button>

                            <!-- Botão Configurações & Chave PIX -->
                            <button type="button" id="btn-agenda-open-config" title="Configurações de Faturamento & PIX"
                                class="min-h-[40px] px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs flex items-center gap-1.5 transition">
                                <i data-lucide="settings" class="w-4 h-4 text-amber-400"></i>
                                <span class="hidden md:inline">Honorários &amp; PIX</span>
                            </button>

                            <!-- Botão Exportar CSV/Excel -->
                            <button type="button" id="btn-agenda-export-csv" title="Exportar para Excel / Contabilidade (.csv)"
                                class="min-h-[40px] px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs flex items-center gap-1 transition">
                                <i data-lucide="file-spreadsheet" class="w-4 h-4 text-emerald-400"></i>
                                <span class="hidden xl:inline">Exportar Planilha</span>
                            </button>
                        </div>
                    </div>

                    <!-- SUB-TABS: Faturamento • Cronograma • Pacientes & Valores -->
                    <div class="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800/80 overflow-x-auto text-xs">
                        <button type="button" data-agenda-subtab="faturamento"
                            class="min-h-[36px] px-4 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition ${state.activeSubTab === 'faturamento' ? 'bg-sky-500/20 border border-sky-400/50 text-sky-200 shadow-sm' : 'text-slate-400 hover:text-slate-200'}">
                            <i data-lucide="receipt" class="w-4 h-4"></i>
                            <span>Demonstrativo de Faturamento &amp; Cobrança</span>
                            <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900 border border-slate-700 text-cyan-300 font-mono">
                                ${report.patientReports.length}
                            </span>
                        </button>

                        <button type="button" data-agenda-subtab="cronograma"
                            class="min-h-[36px] px-4 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition ${state.activeSubTab === 'cronograma' ? 'bg-sky-500/20 border border-sky-400/50 text-sky-200 shadow-sm' : 'text-slate-400 hover:text-slate-200'}">
                            <i data-lucide="calendar" class="w-4 h-4"></i>
                            <span>Linha do Tempo Cronológica</span>
                            <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900 border border-slate-700 text-slate-400 font-mono">
                                ${report.totalSessionsCount}
                            </span>
                        </button>

                        <button type="button" data-agenda-subtab="pacientes"
                            class="min-h-[36px] px-4 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition ${state.activeSubTab === 'pacientes' ? 'bg-sky-500/20 border border-sky-400/50 text-sky-200 shadow-sm' : 'text-slate-400 hover:text-slate-200'}">
                            <i data-lucide="users" class="w-4 h-4"></i>
                            <span>Tabela de Honorários por Paciente</span>
                        </button>
                    </div>
                </div>

                <!-- 2. CARDS DE KPIS CLÍNICOS E FINANCEIROS -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

                    <!-- KPI 1: Faturamento Previsto Total -->
                    <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg">
                        <div class="flex items-center justify-between text-slate-400 mb-1">
                            <span class="text-xs font-mono uppercase tracking-wider">Faturamento Previsto</span>
                            <div class="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                                <i data-lucide="banknote" class="w-4 h-4"></i>
                            </div>
                        </div>
                        <div class="text-xl sm:text-2xl font-bold font-mono text-slate-100 tracking-tight">
                            ${formatBRL(report.totalForecastBRL)}
                        </div>
                        <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                            <span class="text-sky-400 font-semibold">${report.activePatientsCount} pacientes</span>
                            <span>•</span>
                            <span>Média: ${formatBRL(report.activePatientsCount > 0 ? report.totalForecastBRL / report.activePatientsCount : 0)}/paciente</span>
                        </div>
                    </div>

                    <!-- KPI 2: Total Liquidado / Recebido -->
                    <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg">
                        <div class="flex items-center justify-between text-slate-400 mb-1">
                            <span class="text-xs font-mono uppercase tracking-wider text-emerald-400">Honorários Recebidos</span>
                            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                <i data-lucide="check-circle" class="w-4 h-4"></i>
                            </div>
                        </div>
                        <div class="text-xl sm:text-2xl font-bold font-mono text-emerald-300 tracking-tight">
                            ${formatBRL(report.totalReceivedBRL)}
                        </div>
                        <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                            <span class="text-emerald-400 font-mono font-bold">${report.recoveryRate.toFixed(1)}%</span>
                            <span>liquidado</span>
                        </div>
                    </div>

                    <!-- KPI 3: Saldo Pendente a Receber -->
                    <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg">
                        <div class="flex items-center justify-between text-slate-400 mb-1">
                            <span class="text-xs font-mono uppercase tracking-wider text-amber-400">A Faturar / Pendente</span>
                            <div class="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                <i data-lucide="clock" class="w-4 h-4"></i>
                            </div>
                        </div>
                        <div class="text-xl sm:text-2xl font-bold font-mono text-amber-300 tracking-tight">
                            ${formatBRL(report.totalPendingBRL)}
                        </div>
                        <div class="text-[11px] text-slate-400 mt-1">
                            <span>Aguardando cobrança ou liquidação</span>
                        </div>
                    </div>

                    <!-- KPI 4: Volume de Sessões do Mês -->
                    <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg">
                        <div class="flex items-center justify-between text-slate-400 mb-1">
                            <span class="text-xs font-mono uppercase tracking-wider text-cyan-400">Volume de Atendimentos</span>
                            <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                                <i data-lucide="activity" class="w-4 h-4"></i>
                            </div>
                        </div>
                        <div class="text-xl sm:text-2xl font-bold font-mono text-cyan-300 tracking-tight">
                            ${report.totalSessionsCount} <span class="text-xs font-normal text-slate-400">sessões</span>
                        </div>
                        <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                            <span>Média de</span>
                            <span class="text-cyan-400 font-mono font-bold">${report.activePatientsCount > 0 ? (report.totalSessionsCount / report.activePatientsCount).toFixed(1) : 0}</span>
                            <span>sessões/paciente</span>
                        </div>
                    </div>

                </div>

                <!-- 3. CONTEÚDO DA SUB-ABA ATIVA -->
                ${renderSubTabContent(report, filteredPatients)}

            </div>

            <!-- MODAIS INTEGRADOS -->
            ${renderSyncModal()}
            ${renderWhatsAppModal()}
            ${renderReceiptModal()}
            ${renderConfigModal()}
            ${renderManualSessionModal()}
        `;

        attachEventListeners(report);
        if (global.VaultCore) global.VaultCore.refreshIcons();
    }

    // =========================================================================
    // 7. RENDERIZAÇÃO DAS SUB-ABAS
    // =========================================================================
    function renderSubTabContent(report, filteredPatients) {
        if (state.activeSubTab === 'cronograma') {
            return renderCronogramaView(report);
        }
        if (state.activeSubTab === 'pacientes') {
            return renderPacientesConfigView(report);
        }
        return renderFaturamentoView(report, filteredPatients);
    }

    /**
     * SUB-ABA 1: VISÃO DE FATURAMENTO & COBRANÇA (PRINCIPAL)
     */
    function renderFaturamentoView(report, filteredPatients) {
        return `
            <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">

                <!-- Barra de Filtros e Pesquisa em Tempo Real -->
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
                    <div class="relative flex-1 max-w-md">
                        <i data-lucide="search" class="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                        <input type="text" id="input-agenda-search"
                            value="${escapeHtml(state.searchTerm)}"
                            placeholder="Buscar paciente ou responsável..."
                            class="w-full min-h-[40px] pl-9 pr-4 py-2 rounded-xl bg-[#090d16] border border-slate-700 focus:border-sky-400 focus:outline-none text-xs text-slate-100 placeholder-slate-500 transition">
                    </div>

                    <!-- Filtro por Status Financeiro -->
                    <div class="flex items-center gap-1.5 overflow-x-auto text-xs">
                        <span class="text-slate-500 text-[11px] font-mono mr-1">Status:</span>
                        <button type="button" data-filter-status="all"
                            class="px-2.5 py-1 rounded-lg font-mono text-[11px] transition ${state.statusFilter === 'all' ? 'bg-slate-700 text-slate-100 font-bold' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}">
                            Todos (${report.patientReports.length})
                        </button>
                        <button type="button" data-filter-status="pendente"
                            class="px-2.5 py-1 rounded-lg font-mono text-[11px] transition ${state.statusFilter === 'pendente' ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold' : 'bg-slate-900 text-amber-400/80 hover:text-amber-300'}">
                            🟡 Pendentes
                        </button>
                        <button type="button" data-filter-status="cobrado"
                            class="px-2.5 py-1 rounded-lg font-mono text-[11px] transition ${state.statusFilter === 'cobrado' ? 'bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold' : 'bg-slate-900 text-sky-400/80 hover:text-sky-300'}">
                            🔵 Cobrados
                        </button>
                        <button type="button" data-filter-status="pago"
                            class="px-2.5 py-1 rounded-lg font-mono text-[11px] transition ${state.statusFilter === 'pago' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold' : 'bg-slate-900 text-emerald-400/80 hover:text-emerald-300'}">
                            🟢 Pagos
                        </button>
                    </div>
                </div>

                <!-- Tabela de Pacientes do Mês -->
                ${filteredPatients.length === 0 ? `
                    <div class="text-center py-12 space-y-3">
                        <div class="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                            <i data-lucide="inbox" class="w-6 h-6"></i>
                        </div>
                        <p class="text-sm font-semibold text-slate-300">Nenhum atendimento apurado para este mês ou filtro.</p>
                        <p class="text-xs text-slate-500 max-w-md mx-auto">
                            Clique em <strong class="text-sky-400">Sincronizar Google Agenda</strong> para atualizar ou <strong class="text-cyan-400">Importar Arquivo</strong> para carregar seus dados na hora.
                        </p>
                    </div>
                ` : `
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs text-slate-300 border-collapse">
                            <thead>
                                <tr class="border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-[#090d16]/50">
                                    <th class="py-3 px-3">Paciente / Responsável</th>
                                    <th class="py-3 px-3 text-center">Sessões Realizadas</th>
                                    <th class="py-3 px-3 text-center">Valor / Sessão</th>
                                    <th class="py-3 px-3 text-right">Total a Cobrar</th>
                                    <th class="py-3 px-3 text-center">Status de Pagamento</th>
                                    <th class="py-3 px-3 text-right">Ações Clínicas</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/60 font-sans">
                                ${filteredPatients.map(p => renderPatientRow(p)).join('')}
                            </tbody>
                        </table>
                    </div>
                `}

            </div>
        `;
    }

    function renderPatientRow(p) {
        const initials = p.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        const datesPreview = p.sessions.map(s => formatDateBR(s.date)).join(', ');

        let statusBadge = '';
        if (p.billingStatus === 'pago') {
            statusBadge = `<span class="px-2.5 py-1 rounded-full text-[11px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 mx-auto justify-center w-fit"><i data-lucide="check" class="w-3 h-3"></i>Pago</span>`;
        } else if (p.billingStatus === 'cobrado') {
            statusBadge = `<span class="px-2.5 py-1 rounded-full text-[11px] font-mono bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1 mx-auto justify-center w-fit"><i data-lucide="send" class="w-3 h-3"></i>Cobrado</span>`;
        } else if (p.billingStatus === 'isento') {
            statusBadge = `<span class="px-2.5 py-1 rounded-full text-[11px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1 mx-auto justify-center w-fit">Isento / Cortesia</span>`;
        } else {
            statusBadge = `<span class="px-2.5 py-1 rounded-full text-[11px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1 mx-auto justify-center w-fit"><i data-lucide="clock" class="w-3 h-3"></i>Pendente</span>`;
        }

        return `
            <tr class="hover:bg-slate-800/30 transition-colors group">

                <!-- Paciente + Responsável -->
                <td class="py-3 px-3">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/30 flex items-center justify-center font-mono font-bold text-xs text-sky-300 shrink-0 shadow-sm">
                            ${initials}
                        </div>
                        <div>
                            <div class="font-bold text-slate-100 flex items-center gap-2">
                                <span>${escapeHtml(p.name)}</span>
                                ${p.category ? `<span class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-400">${escapeHtml(p.category)}</span>` : ''}
                            </div>
                            <div class="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                                ${p.guardian ? `<span>Resp: <strong class="text-slate-300">${escapeHtml(p.guardian)}</strong></span>` : '<span class="text-slate-600">Responsável não informado</span>'}
                                ${p.phone ? `<span class="text-slate-600">•</span><span class="font-mono text-emerald-400">${escapeHtml(p.phone)}</span>` : ''}
                            </div>
                        </div>
                    </div>
                </td>

                <!-- Sessões Realizadas e Datas -->
                <td class="py-3 px-3 text-center">
                    <div class="inline-flex flex-col items-center">
                        <span class="px-2.5 py-0.5 rounded-lg bg-sky-500/10 border border-sky-500/25 font-mono font-bold text-sky-300 text-xs">
                            ${p.sessionCount} ${p.sessionCount === 1 ? 'sessão' : 'sessões'}
                        </span>
                        <span class="text-[10px] text-slate-400 mt-1 max-w-[150px] truncate" title="${datesPreview}">
                            ${datesPreview}
                        </span>
                    </div>
                </td>

                <!-- Valor da Sessão (Editável Inline) -->
                <td class="py-3 px-3 text-center font-mono">
                    <div class="inline-flex items-center gap-1">
                        <span class="text-slate-400 text-[11px]">R$</span>
                        <input type="number" step="5" min="0"
                            data-patient-price-input="${escapeHtml(p.name)}"
                            value="${p.unitPrice}"
                            title="Valor por sessão acordado para este paciente"
                            class="w-16 px-1.5 py-1 text-center font-mono font-bold rounded bg-[#090d16] border border-slate-700 focus:border-cyan-400 focus:outline-none text-xs text-cyan-300 transition">
                    </div>
                </td>

                <!-- Total a Cobrar -->
                <td class="py-3 px-3 text-right font-mono">
                    <div class="text-sm font-bold text-slate-100">
                        ${formatBRL(p.totalToBill)}
                    </div>
                    ${p.billingStatus === 'pago' ? `
                        <div class="text-[10px] text-emerald-400">Liquidado</div>
                    ` : `
                        <div class="text-[10px] text-amber-400/90">A receber</div>
                    `}
                </td>

                <!-- Status de Pagamento (Dropdown Rápido) -->
                <td class="py-3 px-3 text-center">
                    <div class="flex flex-col items-center gap-1">
                        ${statusBadge}
                        <select data-patient-status-select="${escapeHtml(p.name)}"
                            class="mt-1 bg-[#090d16] border border-slate-700 rounded px-1.5 py-0.5 text-[10px] font-mono text-slate-300 focus:outline-none focus:border-sky-400 cursor-pointer">
                            <option value="pendente" ${p.billingStatus === 'pendente' ? 'selected' : ''}>Mudar: 🟡 Pendente</option>
                            <option value="cobrado" ${p.billingStatus === 'cobrado' ? 'selected' : ''}>Mudar: 🔵 Cobrado</option>
                            <option value="pago" ${p.billingStatus === 'pago' ? 'selected' : ''}>Mudar: 🟢 Pago</option>
                            <option value="isento" ${p.billingStatus === 'isento' ? 'selected' : ''}>Mudar: 🟣 Isento</option>
                        </select>
                    </div>
                </td>

                <!-- Ações Clínicas -->
                <td class="py-3 px-3 text-right">
                    <div class="flex items-center justify-end gap-1.5">

                        <!-- Botão WhatsApp Cobrança -->
                        <button type="button" data-btn-whatsapp="${escapeHtml(p.name)}" title="Gerar demonstrativo humanista para WhatsApp"
                            class="min-h-[34px] px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 font-semibold text-xs flex items-center gap-1 transition">
                            <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
                            <span class="hidden sm:inline">WhatsApp</span>
                        </button>

                        <!-- Botão Recibo Formal -->
                        <button type="button" data-btn-receipt="${escapeHtml(p.name)}" title="Emitir Recibo / Declaração de Atendimento"
                            class="min-h-[34px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs flex items-center gap-1 transition">
                            <i data-lucide="receipt" class="w-3.5 h-3.5 text-sky-400"></i>
                            <span class="hidden md:inline">Recibo</span>
                        </button>

                    </div>
                </td>

            </tr>
        `;
    }

    /**
     * SUB-ABA 2: VISÃO DE LINHA DO TEMPO CRONOLÓGICA
     */
    function renderCronogramaView(report) {
        const sortedSessions = report.allSessions.slice();

        return `
            <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                        <h3 class="text-sm font-bold text-slate-100">Linha do Tempo Cronológica dos Atendimentos</h3>
                        <p class="text-xs text-slate-400">Visão sequencial das sessões realizadas e agendadas no mês selecionado.</p>
                    </div>
                    <span class="font-mono text-xs text-cyan-400 font-bold">${sortedSessions.length} registros</span>
                </div>

                ${sortedSessions.length === 0 ? `
                    <div class="text-center py-10 text-slate-500 text-xs">
                        Nenhum atendimento registrado nesta janela temporal.
                    </div>
                ` : `
                    <div class="space-y-2">
                        ${sortedSessions.map(s => {
                            const dateStr = s.date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
                            const timeStr = formatTimeBR(s.date);
                            const endTimeStr = s.end ? formatTimeBR(s.end) : '';
                            const isIgnored = s.isIgnored;

                            return `
                                <div class="p-3 rounded-xl ${isIgnored ? 'bg-slate-900/50 border border-slate-800/50 opacity-60' : 'bg-[#090d16] border border-slate-800 hover:border-slate-700'} flex items-center justify-between gap-3 transition">
                                    <div class="flex items-center gap-3">
                                        <div class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs font-bold text-sky-400 text-center shrink-0">
                                            <div>${dateStr}</div>
                                            <div class="text-[10px] text-slate-400 font-normal">${timeStr}${endTimeStr ? ` - ${endTimeStr}` : ''}</div>
                                        </div>
                                        <div>
                                            <div class="font-bold text-slate-100 flex items-center gap-2">
                                                <span>${escapeHtml(s.title)}</span>
                                                ${isIgnored ? '<span class="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-800 text-slate-400">Não Faturável</span>' : ''}
                                                ${s.source === 'manual' ? '<span class="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">Manual</span>' : ''}
                                            </div>
                                            <div class="text-[11px] text-slate-500">
                                                ${s.htmlLink ? `<a href="${s.htmlLink}" target="_blank" class="hover:text-cyan-400 flex items-center gap-1"><i data-lucide="external-link" class="w-3 h-3"></i>Abrir no Google Calendar</a>` : 'Registro interno'}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-2">
                                        ${!isIgnored ? `
                                            <button type="button" data-btn-whatsapp="${escapeHtml(s.title)}"
                                                class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-mono flex items-center gap-1 transition">
                                                <i data-lucide="message-circle" class="w-3 h-3"></i>
                                                <span class="hidden sm:inline">WhatsApp</span>
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}
            </div>
        `;
    }

    /**
     * SUB-ABA 3: GESTÃO DE CADASTRO E VALORES POR PACIENTE
     */
    function renderPacientesConfigView(report) {
        const allPatients = new Set(report.patientReports.map(p => p.name));
        Object.keys(state.patientsConfig).forEach(name => allPatients.add(name));
        const patientsList = Array.from(allPatients).sort((a, b) => a.localeCompare(b, 'pt-BR'));

        return `
            <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                        <h3 class="text-sm font-bold text-slate-100">Configuração de Honorários &amp; Contatos por Paciente</h3>
                        <p class="text-xs text-slate-400">Defina o valor por sessão específico, telefone de WhatsApp e nome do responsável legal.</p>
                    </div>
                    <div class="text-xs font-mono text-cyan-300">
                        Valor Padrão da Clínica: <strong>${formatBRL(state.config.defaultSessionPrice)}</strong>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs text-slate-300 border-collapse">
                        <thead>
                            <tr class="border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-[#090d16]/50">
                                <th class="py-2.5 px-3">Paciente</th>
                                <th class="py-2.5 px-3">Responsável Legal</th>
                                <th class="py-2.5 px-3">WhatsApp</th>
                                <th class="py-2.5 px-3 text-center">Valor Específico (R$)</th>
                                <th class="py-2.5 px-3 text-center">Classificação</th>
                                <th class="py-2.5 px-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60 font-sans">
                            ${patientsList.map(name => {
                                const conf = state.patientsConfig[name] || {};
                                const isIgnored = conf.isIgnored;
                                return `
                                    <tr class="hover:bg-slate-800/30 transition-colors">
                                        <td class="py-2.5 px-3 font-bold text-slate-100">
                                            ${escapeHtml(name)}
                                        </td>
                                        <td class="py-2.5 px-3">
                                            <input type="text" data-conf-guardian="${escapeHtml(name)}"
                                                value="${escapeHtml(conf.guardian || '')}"
                                                placeholder="Ex: Mãe / Pai..."
                                                class="w-full max-w-[180px] px-2 py-1 rounded bg-[#090d16] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400">
                                        </td>
                                        <td class="py-2.5 px-3 font-mono">
                                            <input type="text" data-conf-phone="${escapeHtml(name)}"
                                                value="${escapeHtml(conf.phone || '')}"
                                                placeholder="(35) 9..."
                                                class="w-36 px-2 py-1 rounded bg-[#090d16] border border-slate-700 text-xs text-emerald-300 focus:outline-none focus:border-cyan-400">
                                        </td>
                                        <td class="py-2.5 px-3 text-center font-mono">
                                            <input type="number" step="5" min="0" data-conf-price="${escapeHtml(name)}"
                                                value="${conf.customPrice !== undefined && conf.customPrice !== null ? conf.customPrice : ''}"
                                                placeholder="Padrão (${state.config.defaultSessionPrice})"
                                                class="w-28 px-2 py-1 rounded bg-[#090d16] border border-slate-700 text-xs text-center text-cyan-300 focus:outline-none focus:border-cyan-400">
                                        </td>
                                        <td class="py-2.5 px-3 text-center">
                                            <label class="inline-flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-400">
                                                <input type="checkbox" data-conf-ignore="${escapeHtml(name)}" ${isIgnored ? 'checked' : ''}
                                                    class="rounded border-slate-700 text-rose-500 focus:ring-0">
                                                <span>Ignorar do Faturamento</span>
                                            </label>
                                        </td>
                                        <td class="py-2.5 px-3 text-center">
                                            <button type="button" data-conf-save="${escapeHtml(name)}"
                                                class="px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold text-xs transition">
                                                Salvar
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // =========================================================================
    // 8. MODAIS INTERATIVOS
    // =========================================================================

    /**
     * MODAL 0: SINCRONIZAÇÃO ASSISTIDA & IMPORTADOR DE ARQUIVO
     */
    function renderSyncModal() {
        return `
            <div id="modal-agenda-sync" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                                <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-bold text-slate-100">Sincronização com o Google Calendar</h3>
                                <p class="text-xs text-slate-400">Opções para carregar e sincronizar seus atendimentos</p>
                            </div>
                        </div>
                        <button type="button" id="btn-close-sync-modal" class="min-h-[36px] min-w-[36px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <div class="space-y-3 text-xs text-slate-300">
                        <!-- Opção A: Importar Arquivo Local na hora -->
                        <div class="p-3.5 rounded-xl bg-[#090d16] border border-sky-500/30 space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="font-bold text-sky-300 flex items-center gap-1.5">
                                    <i data-lucide="file-up" class="w-4 h-4"></i>
                                    Opção 1: Selecionar Arquivo da Agenda (.json ou .ics)
                                </span>
                                <span class="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/60">Sem bloqueio CORS</span>
                            </div>
                            <p class="text-[11px] text-slate-400 leading-relaxed">
                                Selecione o arquivo <code class="font-mono text-cyan-300">agenda-cache.json</code> gerado em seu computador ou qualquer exportação <code class="font-mono text-cyan-300">.ics</code> do Google Calendar.
                            </p>
                            <button type="button" id="btn-sync-modal-choose-file"
                                class="w-full min-h-[38px] px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition">
                                <i data-lucide="upload" class="w-4 h-4"></i>
                                <span>Selecionar Arquivo da Agenda no Computador</span>
                            </button>
                        </div>

                        <!-- Opção B: Sincronização ao Vivo via Servidor Local -->
                        <div class="p-3.5 rounded-xl bg-[#090d16] border border-slate-800 space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="font-bold text-slate-200 flex items-center gap-1.5">
                                    <i data-lucide="server" class="w-4 h-4 text-emerald-400"></i>
                                    Opção 2: Sincronizar via Servidor Local (Ao Vivo)
                                </span>
                            </div>
                            <p class="text-[11px] text-slate-400 leading-relaxed">
                                Se o servidor local estiver em execução (<code class="font-mono text-slate-300">powershell scripts/server.ps1</code>), clique abaixo para buscar os dados ao vivo na nuvem do Google Agenda:
                            </p>
                            <button type="button" id="btn-sync-modal-retry-server"
                                class="w-full min-h-[38px] px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition">
                                <i data-lucide="refresh-cw" class="w-4 h-4 text-cyan-400"></i>
                                <span>Testar Conexão com Servidor Local</span>
                            </button>
                        </div>

                        <!-- Opção C: Comando PowerShell Direto -->
                        <div class="p-3.5 rounded-xl bg-[#090d16] border border-slate-800 space-y-2">
                            <span class="font-bold text-slate-300 flex items-center gap-1.5">
                                <i data-lucide="terminal" class="w-4 h-4 text-amber-400"></i>
                                Opção 3: Executar Atualização via Terminal
                            </span>
                            <div class="flex items-center gap-2">
                                <input type="text" readonly value="powershell scripts/sync-agenda-vault.ps1" id="input-sync-cmd-copy"
                                    class="w-full px-2.5 py-1.5 rounded bg-black/50 border border-slate-800 font-mono text-[11px] text-slate-300">
                                <button type="button" id="btn-copy-sync-cmd"
                                    class="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono shrink-0">
                                    Copiar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function openSyncModal() {
        const modal = document.getElementById('modal-agenda-sync');
        if (modal) modal.classList.remove('hidden');
    }

    /**
     * MODAL 1: MENSAGEM DE WHATSAPP COBRANÇA
     */
    function renderWhatsAppModal() {
        return `
            <div id="modal-agenda-whatsapp" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-xl p-5 sm:p-6 space-y-4 shadow-2xl">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                <i data-lucide="message-circle" class="w-4 h-4"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-bold text-slate-100">Demonstrativo de Sessões para WhatsApp</h3>
                                <p id="wa-modal-subtitle" class="text-xs text-slate-400"></p>
                            </div>
                        </div>
                        <button type="button" id="btn-close-wa-modal" class="min-h-[36px] min-w-[36px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <!-- Destinatário e Telefone -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                            <label class="block text-slate-400 font-mono text-[11px] mb-1">Destinatário (Responsável):</label>
                            <input type="text" id="wa-modal-input-recipient" class="w-full px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-slate-200">
                        </div>
                        <div>
                            <label class="block text-slate-400 font-mono text-[11px] mb-1">WhatsApp (DDD + Número):</label>
                            <input type="text" id="wa-modal-input-phone" placeholder="Ex: 35933003807" class="w-full px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-emerald-300 font-mono">
                        </div>
                    </div>

                    <!-- Texto Formatado da Mensagem -->
                    <div>
                        <div class="flex items-center justify-between text-slate-400 font-mono text-[11px] mb-1">
                            <span>Mensagem Formatada (Acolhedora &amp; Completa):</span>
                            <span class="text-slate-500">Editável antes do envio</span>
                        </div>
                        <textarea id="wa-modal-textarea" rows="9"
                            class="w-full p-3 rounded-xl bg-[#090d16] border border-slate-700 font-sans text-xs text-slate-200 leading-relaxed focus:border-emerald-400 focus:outline-none transition"></textarea>
                    </div>

                    <!-- Botões de Ação do Modal -->
                    <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                        <label class="inline-flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                            <input type="checkbox" id="wa-modal-check-mark-billed" checked class="rounded border-slate-700 text-sky-500">
                            <span>Marcar status como "Cobrado"</span>
                        </label>

                        <div class="flex items-center gap-2 ml-auto">
                            <button type="button" id="btn-wa-copy"
                                class="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition">
                                <i data-lucide="copy" class="w-4 h-4 text-cyan-300"></i>
                                <span>Copiar Texto</span>
                            </button>

                            <button type="button" id="btn-wa-open-chat"
                                class="min-h-[40px] px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition">
                                <i data-lucide="send" class="w-4 h-4"></i>
                                <span>Abrir no WhatsApp</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * MODAL 2: RECIBO CLÍNICO TIMBRADO / DECLARAÇÃO
     */
    function renderReceiptModal() {
        return `
            <div id="modal-agenda-receipt" class="hidden fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-2xl p-5 sm:p-7 space-y-5 shadow-2xl">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-800 no-print">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                                <i data-lucide="file-text" class="w-4 h-4"></i>
                            </div>
                            <div>
                                <h3 class="text-sm font-bold text-slate-100">Recibo Profissional de Atendimento Neuropsicológico</h3>
                                <p class="text-xs text-slate-400">Conformidade com CFP e normas para Reembolso e IRPF</p>
                            </div>
                        </div>
                        <button type="button" id="btn-close-receipt-modal" class="min-h-[36px] min-w-[36px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <!-- Folha do Recibo (Clean A4 Print Ready) -->
                    <div id="receipt-print-area" class="bg-white text-slate-900 rounded-xl p-6 sm:p-8 space-y-6 shadow-inner font-sans border border-slate-200">
                        <div class="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
                            <div>
                                <h4 class="text-lg font-bold tracking-tight text-slate-950 uppercase">${DEFAULT_CONFIG.clinicTitle}</h4>
                                <p class="text-xs font-mono text-slate-700 font-semibold">${DEFAULT_CONFIG.clinicCrp} • Especialista em Neurociências</p>
                                <p class="text-[11px] text-slate-600 mt-0.5">Membro da Sociedade Brasileira de Neuropsicologia (SBNp)</p>
                            </div>
                            <div class="text-right text-xs text-slate-600 font-mono">
                                <div>Guaranésia, MG</div>
                                <div>contato@deomagalhaes.com.br</div>
                            </div>
                        </div>

                        <div class="text-center py-1">
                            <h5 class="text-base font-bold uppercase tracking-widest text-slate-900">DECLARAÇÃO DE RECIBO DE HONORÁRIOS CLÍNICOS</h5>
                            <p id="receipt-doc-number" class="text-xs font-mono text-slate-600 mt-0.5"></p>
                        </div>

                        <div id="receipt-doc-body" class="text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3"></div>

                        <div class="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                            <div class="text-[11px] font-mono uppercase font-bold text-slate-700">Discriminação Detalhada dos Atendimentos:</div>
                            <div id="receipt-doc-sessions-list" class="text-xs text-slate-700 space-y-0.5"></div>
                        </div>

                        <div class="pt-8 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div id="receipt-doc-date" class="text-xs text-slate-600 font-serif"></div>
                            <div class="text-center">
                                <div class="w-48 border-b border-slate-900 mb-1"></div>
                                <div class="font-bold text-xs text-slate-900">Deo Magalhães</div>
                                <div class="text-[10px] font-mono text-slate-700">Neuropsicólogo Clínico • CRP 04/42784</div>
                            </div>
                        </div>
                    </div>

                    <!-- Botões de Ação do Recibo -->
                    <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-800 no-print">
                        <button type="button" id="btn-receipt-copy-text"
                            class="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition">
                            <i data-lucide="copy" class="w-4 h-4 text-cyan-300"></i>
                            <span>Copiar Texto</span>
                        </button>
                        <button type="button" id="btn-receipt-print"
                            class="min-h-[40px] px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition">
                            <i data-lucide="printer" class="w-4 h-4"></i>
                            <span>Imprimir / Salvar PDF</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * MODAL 3: CONFIGURAÇÕES DE HONORÁRIOS & CHAVE PIX
     */
    function renderConfigModal() {
        return `
            <div id="modal-agenda-config" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                                <i data-lucide="settings" class="w-4 h-4"></i>
                            </div>
                            <h3 class="text-sm font-bold text-slate-100">Configurações de Faturamento &amp; PIX</h3>
                        </div>
                        <button type="button" id="btn-close-config-modal" class="min-h-[36px] min-w-[36px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <form id="form-agenda-config" class="space-y-3.5 text-xs">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-slate-400 font-mono text-[11px] mb-1">Valor Padrão da Sessão (R$):</label>
                                <input type="number" step="5" min="0" id="cfg-default-price" value="${state.config.defaultSessionPrice}"
                                    class="w-full px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-cyan-300 font-mono font-bold">
                            </div>
                            <div>
                                <label class="block text-slate-400 font-mono text-[11px] mb-1">Tipo da Chave PIX:</label>
                                <select id="cfg-pix-type" class="w-full px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-slate-200">
                                    <option value="email" ${state.config.pixKeyType === 'email' ? 'selected' : ''}>E-mail</option>
                                    <option value="telefone" ${state.config.pixKeyType === 'telefone' ? 'selected' : ''}>Celular / Telefone</option>
                                    <option value="cpf" ${state.config.pixKeyType === 'cpf' ? 'selected' : ''}>CPF</option>
                                    <option value="aleatoria" ${state.config.pixKeyType === 'aleatoria' ? 'selected' : ''}>Chave Aleatória</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-slate-400 font-mono text-[11px] mb-1">Chave PIX Oficial:</label>
                            <input type="text" id="cfg-pix-key" value="${escapeHtml(state.config.pixKey)}"
                                class="w-full px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-emerald-300 font-mono">
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-slate-400 font-mono text-[11px] mb-1">Titular da Conta:</label>
                                <input type="text" id="cfg-beneficiary" value="${escapeHtml(state.config.pixBeneficiary)}"
                                    class="w-full px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-slate-200">
                            </div>
                            <div>
                                <label class="block text-slate-400 font-mono text-[11px] mb-1">Instituição Bancária:</label>
                                <input type="text" id="cfg-bank" value="${escapeHtml(state.config.pixBank)}"
                                    class="w-full px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-slate-200">
                            </div>
                        </div>

                        <div>
                            <label class="block text-slate-400 font-mono text-[11px] mb-1">Modelo de Mensagem de Cobrança WhatsApp:</label>
                            <textarea id="cfg-whatsapp-template" rows="4"
                                class="w-full p-2.5 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-[11px] text-slate-300 leading-relaxed">${escapeHtml(state.config.whatsappTemplate)}</textarea>
                            <span class="text-[10px] text-slate-500 font-mono">Tags aceitas: {paciente}, {responsavel}, {mes_ano}, {qtd_sessoes}, {lista_datas}, {valor_total}, {valor_unitario}, {chave_pix}, {beneficiario}, {banco}</span>
                        </div>

                        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                            <button type="submit"
                                class="min-h-[40px] px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition">
                                Salvar Configurações
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    /**
     * MODAL 4: ADICIONAR SESSÃO MANUAL
     */
    function renderManualSessionModal() {
        return `
            <div id="modal-agenda-manual" class="hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-md p-5 sm:p-6 space-y-4 shadow-2xl">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                <i data-lucide="plus-circle" class="w-4 h-4"></i>
                            </div>
                            <h3 class="text-sm font-bold text-slate-100">Registrar Sessão Manual</h3>
                        </div>
                        <button type="button" id="btn-close-manual-modal" class="min-h-[36px] min-w-[36px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center">
                            <i data-lucide="x" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <form id="form-agenda-manual" class="space-y-3 text-xs">
                        <div>
                            <label class="block text-slate-400 font-mono text-[11px] mb-1">Nome do Paciente *</label>
                            <input type="text" id="manual-patient" required placeholder="Ex: Leandro"
                                class="w-full px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-slate-100">
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-slate-400 font-mono text-[11px] mb-1">Data *</label>
                                <input type="date" id="manual-date" required
                                    class="w-full px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-slate-100 font-mono">
                            </div>
                            <div>
                                <label class="block text-slate-400 font-mono text-[11px] mb-1">Horário de Início *</label>
                                <input type="time" id="manual-time" required value="10:00"
                                    class="w-full px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-slate-100 font-mono">
                            </div>
                        </div>

                        <div>
                            <label class="block text-slate-400 font-mono text-[11px] mb-1">Status do Atendimento</label>
                            <select id="manual-status" class="w-full px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-slate-200">
                                <option value="realizada">Sessão Realizada</option>
                                <option value="falta_justificada">Falta Justificada</option>
                                <option value="falta_sem_aviso">Falta sem Aviso Prévio (Faturável)</option>
                                <option value="desmarcada">Desmarcada / Cancelada</option>
                            </select>
                        </div>

                        <div class="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                            <button type="submit"
                                class="min-h-[40px] px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition">
                                Adicionar Sessão
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    // =========================================================================
    // 9. EVENT LISTENERS E INTERATIVIDADE
    // =========================================================================
    function attachEventListeners(report) {
        const root = document.getElementById('tab-panel-agenda');
        if (!root) return;

        // --- Navegação de Mês ---
        const btnPrev = document.getElementById('btn-agenda-prev-month');
        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                if (state.selectedMonth === 0) {
                    state.selectedMonth = 11;
                    state.selectedYear--;
                } else {
                    state.selectedMonth--;
                }
                render();
            });
        }

        const btnNext = document.getElementById('btn-agenda-next-month');
        if (btnNext) {
            btnNext.addEventListener('click', () => {
                if (state.selectedMonth === 11) {
                    state.selectedMonth = 0;
                    state.selectedYear++;
                } else {
                    state.selectedMonth++;
                }
                render();
            });
        }

        const btnToday = document.getElementById('btn-agenda-today');
        if (btnToday) {
            btnToday.addEventListener('click', () => {
                const now = new Date();
                state.selectedYear = now.getFullYear();
                state.selectedMonth = now.getMonth();
                render();
            });
        }

        // --- Sincronização Google Agenda Trigger ---
        const btnSync = document.getElementById('btn-agenda-sync-trigger');
        if (btnSync) {
            btnSync.addEventListener('click', () => {
                syncFromGoogleCalendar(true);
            });
        }

        // --- Seletor de Arquivos Nativo (Importar Arquivo) ---
        const btnPickFile = document.getElementById('btn-agenda-pick-file-trigger');
        const filePicker = document.getElementById('input-agenda-file-picker');
        if (btnPickFile && filePicker) {
            btnPickFile.addEventListener('click', () => {
                filePicker.click();
            });
            filePicker.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    handleFileSelected(e.target.files[0]);
                }
            });
        }

        // --- Modal de Sincronização Assistida ---
        const btnCloseSyncModal = document.getElementById('btn-close-sync-modal');
        if (btnCloseSyncModal) {
            btnCloseSyncModal.addEventListener('click', () => {
                const modal = document.getElementById('modal-agenda-sync');
                if (modal) modal.classList.add('hidden');
            });
        }

        const btnSyncModalChooseFile = document.getElementById('btn-sync-modal-choose-file');
        if (btnSyncModalChooseFile && filePicker) {
            btnSyncModalChooseFile.addEventListener('click', () => {
                const modal = document.getElementById('modal-agenda-sync');
                if (modal) modal.classList.add('hidden');
                filePicker.click();
            });
        }

        const btnSyncModalRetryServer = document.getElementById('btn-sync-modal-retry-server');
        if (btnSyncModalRetryServer) {
            btnSyncModalRetryServer.addEventListener('click', async () => {
                const modal = document.getElementById('modal-agenda-sync');
                if (modal) modal.classList.add('hidden');
                const ok = await syncFromGoogleCalendar(true);
                if (!ok && global.VaultCore) {
                    global.VaultCore.toast('Servidor local não respondeu. Utilize a Opção 1 para carregar o arquivo.', 'warning');
                }
            });
        }

        const btnCopySyncCmd = document.getElementById('btn-copy-sync-cmd');
        if (btnCopySyncCmd) {
            btnCopySyncCmd.addEventListener('click', () => {
                const inp = document.getElementById('input-sync-cmd-copy');
                if (inp) {
                    inp.select();
                    navigator.clipboard.writeText(inp.value);
                    if (global.VaultCore) global.VaultCore.toast('Comando copiado! Execute no PowerShell.', 'success');
                }
            });
        }

        // --- Sub-Tabs ---
        root.querySelectorAll('[data-agenda-subtab]').forEach(btn => {
            btn.addEventListener('click', () => {
                state.activeSubTab = btn.getAttribute('data-agenda-subtab');
                render();
            });
        });

        // --- Pesquisa em Tempo Real ---
        const searchInput = document.getElementById('input-agenda-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                state.searchTerm = e.target.value;
                render();
            });
        }

        // --- Filtros de Status ---
        root.querySelectorAll('[data-filter-status]').forEach(btn => {
            btn.addEventListener('click', () => {
                state.statusFilter = btn.getAttribute('data-filter-status');
                render();
            });
        });

        // --- Edição Inline de Valor por Sessão ---
        root.querySelectorAll('[data-patient-price-input]').forEach(inp => {
            inp.addEventListener('change', (e) => {
                const pName = inp.getAttribute('data-patient-price-input');
                const val = parseFloat(e.target.value);
                if (!isNaN(val) && val >= 0) {
                    if (!state.patientsConfig[pName]) state.patientsConfig[pName] = {};
                    state.patientsConfig[pName].customPrice = val;
                    saveState();
                    render();
                    if (global.VaultCore) global.VaultCore.toast(`Valor para ${pName} atualizado para ${formatBRL(val)}`, 'success');
                }
            });
        });

        // --- Dropdown Rápido de Mudança de Status ---
        root.querySelectorAll('[data-patient-status-select]').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const pName = sel.getAttribute('data-patient-status-select');
                const newStatus = e.target.value;
                const statusKey = `${report.targetKey}_${pName}`;
                if (!state.monthlyStatus[statusKey]) state.monthlyStatus[statusKey] = {};
                state.monthlyStatus[statusKey].status = newStatus;
                if (newStatus === 'pago') {
                    state.monthlyStatus[statusKey].paymentDate = new Date().toISOString().split('T')[0];
                }
                saveState();
                render();
                if (global.VaultCore) global.VaultCore.toast(`Status de ${pName} alterado para ${newStatus.toUpperCase()}`, 'info');
            });
        });

        // --- Botão WhatsApp (Abrir Modal) ---
        root.querySelectorAll('[data-btn-whatsapp]').forEach(btn => {
            btn.addEventListener('click', () => {
                const pName = btn.getAttribute('data-btn-whatsapp');
                openWhatsAppModal(pName, report);
            });
        });

        // --- Botão Recibo (Abrir Modal) ---
        root.querySelectorAll('[data-btn-receipt]').forEach(btn => {
            btn.addEventListener('click', () => {
                const pName = btn.getAttribute('data-btn-receipt');
                openReceiptModal(pName, report);
            });
        });

        // --- Botão Nova Sessão Manual ---
        const btnAddManual = document.getElementById('btn-agenda-add-manual');
        if (btnAddManual) {
            btnAddManual.addEventListener('click', () => {
                const modal = document.getElementById('modal-agenda-manual');
                if (modal) {
                    modal.classList.remove('hidden');
                    const dateInp = document.getElementById('manual-date');
                    if (dateInp) {
                        const mStr = String(state.selectedMonth + 1).padStart(2, '0');
                        dateInp.value = `${state.selectedYear}-${mStr}-01`;
                    }
                }
            });
        }

        const btnCloseManual = document.getElementById('btn-close-manual-modal');
        if (btnCloseManual) {
            btnCloseManual.addEventListener('click', () => {
                const modal = document.getElementById('modal-agenda-manual');
                if (modal) modal.classList.add('hidden');
            });
        }

        const formManual = document.getElementById('form-agenda-manual');
        if (formManual) {
            formManual.addEventListener('submit', (e) => {
                e.preventDefault();
                const pName = document.getElementById('manual-patient').value.trim();
                const dateVal = document.getElementById('manual-date').value;
                const timeVal = document.getElementById('manual-time').value;
                const statusVal = document.getElementById('manual-status').value;

                if (!pName || !dateVal) return;

                const fullDate = new Date(`${dateVal}T${timeVal || '10:00'}:00`);
                state.manualSessions.push({
                    id: 'manual_' + Date.now(),
                    patient: pName,
                    date: fullDate.toISOString(),
                    status: statusVal
                });
                saveState();

                const modal = document.getElementById('modal-agenda-manual');
                if (modal) modal.classList.add('hidden');
                render();
                if (global.VaultCore) global.VaultCore.toast(`Sessão para ${pName} adicionada com sucesso!`, 'success');
            });
        }

        // --- Botão e Form de Configurações ---
        const btnOpenCfg = document.getElementById('btn-agenda-open-config');
        if (btnOpenCfg) {
            btnOpenCfg.addEventListener('click', () => {
                const modal = document.getElementById('modal-agenda-config');
                if (modal) modal.classList.remove('hidden');
            });
        }

        const btnCloseCfg = document.getElementById('btn-close-config-modal');
        if (btnCloseCfg) {
            btnCloseCfg.addEventListener('click', () => {
                const modal = document.getElementById('modal-agenda-config');
                if (modal) modal.classList.add('hidden');
            });
        }

        const formCfg = document.getElementById('form-agenda-config');
        if (formCfg) {
            formCfg.addEventListener('submit', (e) => {
                e.preventDefault();
                state.config.defaultSessionPrice = parseFloat(document.getElementById('cfg-default-price').value) || 200;
                state.config.pixKeyType = document.getElementById('cfg-pix-type').value;
                state.config.pixKey = document.getElementById('cfg-pix-key').value.trim();
                state.config.pixBeneficiary = document.getElementById('cfg-beneficiary').value.trim();
                state.config.pixBank = document.getElementById('cfg-bank').value.trim();
                state.config.whatsappTemplate = document.getElementById('cfg-whatsapp-template').value;
                saveState();

                const modal = document.getElementById('modal-agenda-config');
                if (modal) modal.classList.add('hidden');
                render();
                if (global.VaultCore) global.VaultCore.toast('Configurações clínicas salvas com sucesso!', 'success');
            });
        }

        // --- Botão de Salvar Configurações Individuais de Pacientes ---
        root.querySelectorAll('[data-conf-save]').forEach(btn => {
            btn.addEventListener('click', () => {
                const pName = btn.getAttribute('data-conf-save');
                const guardianInp = root.querySelector(`[data-conf-guardian="${pName}"]`);
                const phoneInp = root.querySelector(`[data-conf-phone="${pName}"]`);
                const priceInp = root.querySelector(`[data-conf-price="${pName}"]`);
                const ignoreChk = root.querySelector(`[data-conf-ignore="${pName}"]`);

                if (!state.patientsConfig[pName]) state.patientsConfig[pName] = {};

                if (guardianInp) state.patientsConfig[pName].guardian = guardianInp.value.trim();
                if (phoneInp) state.patientsConfig[pName].phone = phoneInp.value.trim();
                if (priceInp) {
                    const v = priceInp.value.trim();
                    state.patientsConfig[pName].customPrice = v ? parseFloat(v) : null;
                }
                if (ignoreChk) state.patientsConfig[pName].isIgnored = ignoreChk.checked;

                saveState();
                render();
                if (global.VaultCore) global.VaultCore.toast(`Cadastro de ${pName} atualizado!`, 'success');
            });
        });

        // --- Exportação CSV para Excel ---
        const btnExportCsv = document.getElementById('btn-agenda-export-csv');
        if (btnExportCsv) {
            btnExportCsv.addEventListener('click', () => {
                exportReportCsv(report);
            });
        }
    }

    // =========================================================================
    // 10. LÓGICA DE MODAIS DE WHATSAPP E RECIBO
    // =========================================================================
    function openWhatsAppModal(patientName, report) {
        const p = report.patientReports.find(item => item.name === patientName);
        if (!p) return;

        const modal = document.getElementById('modal-agenda-whatsapp');
        const subtitle = document.getElementById('wa-modal-subtitle');
        const recipientInp = document.getElementById('wa-modal-input-recipient');
        const phoneInp = document.getElementById('wa-modal-input-phone');
        const textarea = document.getElementById('wa-modal-textarea');

        if (!modal) return;

        subtitle.textContent = `${p.name} • ${p.sessionCount} sessões no mês de ${getMonthName(state.selectedMonth)} de ${state.selectedYear}`;
        recipientInp.value = p.guardian || p.name;
        phoneInp.value = p.phone || '';

        const datesFormatted = p.sessions.map(s => {
            const dateStr = formatDateBR(s.date);
            const timeStr = formatTimeBR(s.date);
            return `• ${dateStr} às ${timeStr}`;
        }).join('\n');

        const tpl = state.config.whatsappTemplate;
        const msg = tpl
            .replace(/{paciente}/g, p.name)
            .replace(/{responsavel}/g, recipientInp.value)
            .replace(/{mes_ano}/g, `${getMonthName(state.selectedMonth)}/${state.selectedYear}`)
            .replace(/{qtd_sessoes}/g, p.sessionCount)
            .replace(/{lista_datas}/g, datesFormatted)
            .replace(/{valor_total}/g, formatBRL(p.totalToBill))
            .replace(/{valor_unitario}/g, formatBRL(p.unitPrice))
            .replace(/{chave_pix}/g, state.config.pixKey)
            .replace(/{beneficiario}/g, state.config.pixBeneficiary)
            .replace(/{banco}/g, state.config.pixBank);

        textarea.value = msg;
        modal.classList.remove('hidden');

        const btnClose = document.getElementById('btn-close-wa-modal');
        if (btnClose) {
            btnClose.onclick = () => modal.classList.add('hidden');
        }

        const btnCopy = document.getElementById('btn-wa-copy');
        if (btnCopy) {
            btnCopy.onclick = async () => {
                try {
                    await navigator.clipboard.writeText(textarea.value);
                    if (global.VaultCore) global.VaultCore.toast('Mensagem copiada para a área de transferência!', 'success');
                } catch {
                    textarea.select();
                    document.execCommand('copy');
                    if (global.VaultCore) global.VaultCore.toast('Texto copiado!', 'success');
                }
            };
        }

        const btnOpenChat = document.getElementById('btn-wa-open-chat');
        if (btnOpenChat) {
            btnOpenChat.onclick = () => {
                const markBilled = document.getElementById('wa-modal-check-mark-billed').checked;
                if (markBilled) {
                    const statusKey = `${report.targetKey}_${p.name}`;
                    if (!state.monthlyStatus[statusKey]) state.monthlyStatus[statusKey] = {};
                    state.monthlyStatus[statusKey].status = 'cobrado';
                    saveState();
                }

                const phone = phoneInp.value.replace(/\D/g, '');
                if (phone) {
                    if (!state.patientsConfig[p.name]) state.patientsConfig[p.name] = {};
                    state.patientsConfig[p.name].phone = phoneInp.value.trim();
                    saveState();
                }

                const encodedText = encodeURIComponent(textarea.value);
                const waUrl = phone
                    ? `https://api.whatsapp.com/send?phone=55${phone.startsWith('55') ? phone.slice(2) : phone}&text=${encodedText}`
                    : `https://api.whatsapp.com/send?text=${encodedText}`;

                window.open(waUrl, '_blank');
                modal.classList.add('hidden');
                render();
            };
        }
    }

    function openReceiptModal(patientName, report) {
        const p = report.patientReports.find(item => item.name === patientName);
        if (!p) return;

        const modal = document.getElementById('modal-agenda-receipt');
        const docNumber = document.getElementById('receipt-doc-number');
        const docBody = document.getElementById('receipt-doc-body');
        const docSessions = document.getElementById('receipt-doc-sessions-list');
        const docDate = document.getElementById('receipt-doc-date');

        if (!modal) return;

        const receiptCode = `REC-${state.selectedYear}${String(state.selectedMonth + 1).padStart(2, '0')}-${p.name.replace(/[^A-Za-z]/g, '').slice(0, 4).toUpperCase()}`;
        docNumber.textContent = `Nº de Controle: ${receiptCode}`;

        const isPaid = p.billingStatus === 'pago';
        const receiverText = isPaid ? 'Recebi de' : 'Declaro para os devidos fins a cobrança de';
        const quittanceText = isPaid
            ? 'dando plena e rasa quitação pelo presente documento referente aos atendimentos prestados no período.'
            : 'aguardando a devida liquidação dos honorários clínicos profissionais acordados.';

        const guardianMention = p.guardian ? ` (representado por ${escapeHtml(p.guardian)})` : '';

        docBody.innerHTML = `
            <p>
                ${receiverText} <strong>${escapeHtml(p.name)}</strong>${guardianMention}, a importância de
                <strong class="text-base">${formatBRL(p.totalToBill)}</strong>, referente a
                <strong>${p.sessionCount} (${numberToWords(p.sessionCount)})</strong> sessões de atendimento neuropsicológico / intervenção clínica realizadas no mês de
                <strong>${getMonthName(state.selectedMonth)} de ${state.selectedYear}</strong>, ${quittanceText}
            </p>
        `;

        docSessions.innerHTML = p.sessions.map((s, idx) => {
            const dateStr = s.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
            const timeStr = formatTimeBR(s.date);
            return `<div><strong>${idx + 1}ª Sessão:</strong> ${dateStr} às ${timeStr} • Modalidade: Neuropsicologia Clínica</div>`;
        }).join('');

        const today = new Date();
        const dateFormattedExtenso = today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
        docDate.textContent = `Guaranésia - MG, ${dateFormattedExtenso}.`;

        modal.classList.remove('hidden');

        const btnClose = document.getElementById('btn-close-receipt-modal');
        if (btnClose) btnClose.onclick = () => modal.classList.add('hidden');

        const btnPrint = document.getElementById('btn-receipt-print');
        if (btnPrint) {
            btnPrint.onclick = () => {
                window.print();
            };
        }

        const btnCopy = document.getElementById('btn-receipt-copy-text');
        if (btnCopy) {
            btnCopy.onclick = async () => {
                const text = `RECIBO DE HONORÁRIOS CLÍNICOS - ${DEFAULT_CONFIG.clinicTitle}\n` +
                    `Nº ${receiptCode}\n\n` +
                    `${receiverText} ${p.name}${guardianMention}, o valor de ${formatBRL(p.totalToBill)} referente a ${p.sessionCount} sessões no mês de ${getMonthName(state.selectedMonth)}/${state.selectedYear}.\n\n` +
                    `Sessões:\n${p.sessions.map((s, i) => `${i + 1}. ${formatDateBR(s.date)} às ${formatTimeBR(s.date)}`).join('\n')}\n\n` +
                    `Guaranésia - MG, ${dateFormattedExtenso}\n` +
                    `Deo Magalhães • Neuropsicólogo CRP 04/42784`;
                try {
                    await navigator.clipboard.writeText(text);
                    if (global.VaultCore) global.VaultCore.toast('Recibo copiado para a área de transferência!', 'success');
                } catch {
                    if (global.VaultCore) global.VaultCore.toast('Texto selecionado para cópia manual.', 'info');
                }
            };
        }
    }

    // =========================================================================
    // 11. EXPORTAÇÃO CSV DE ALTA PRECISÃO (EXCEL COM BOM UTF-8)
    // =========================================================================
    function exportReportCsv(report) {
        const headers = [
            'Paciente',
            'Responsável',
            'Telefone',
            'Qtd Sessões',
            'Valor Unitário (BRL)',
            'Total a Cobrar (BRL)',
            'Status de Pagamento',
            'Datas das Sessões',
            'Mês/Ano de Competência'
        ];

        const rows = report.patientReports.map(p => {
            const dates = p.sessions.map(s => formatDateBR(s.date)).join(' | ');
            return [
                `"${p.name.replace(/"/g, '""')}"`,
                `"${(p.guardian || '').replace(/"/g, '""')}"`,
                `"${(p.phone || '').replace(/"/g, '""')}"`,
                p.sessionCount,
                p.unitPrice.toFixed(2).replace('.', ','),
                p.totalToBill.toFixed(2).replace('.', ','),
                `"${p.billingStatus.toUpperCase()}"`,
                `"${dates}"`,
                `"${getMonthName(state.selectedMonth)}/${state.selectedYear}"`
            ].join(';');
        });

        const csvContent = '\uFEFF' + headers.join(';') + '\n' + rows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `faturamento-clinico-${report.targetKey}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (global.VaultCore) {
            global.VaultCore.toast(`Planilha de faturamento (${report.targetKey}) exportada com sucesso!`, 'success');
        }
    }

    // =========================================================================
    // 12. UTILITÁRIOS
    // =========================================================================
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function numberToWords(num) {
        const words = ['zero', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'];
        return words[num] || String(num);
    }

    // =========================================================================
    // 13. INICIALIZAÇÃO DO MÓDULO
    // =========================================================================
    function init() {
        loadState();

        // Se houver __VAULT_AGENDA_SEED__ carregado via script tag (funciona nativamente em file:// e http://),
        // importa automaticamente garantindo que os atendimentos estejam na tela imediatamente!
        if (window.__VAULT_AGENDA_SEED__ && Array.isArray(window.__VAULT_AGENDA_SEED__.events) && window.__VAULT_AGENDA_SEED__.events.length > 0) {
            importEvents(window.__VAULT_AGENDA_SEED__.events, window.__VAULT_AGENDA_SEED__.lastSyncedAt, 'Cache Integrado', false);
        }

        render();

        // Tenta sincronização silenciosa via servidor local ou cache
        syncFromGoogleCalendar(false);

        // Ouve desbloqueio do Vault
        window.addEventListener('vault:unlocked', () => {
            loadState();
            if (window.__VAULT_AGENDA_SEED__ && Array.isArray(window.__VAULT_AGENDA_SEED__.events) && window.__VAULT_AGENDA_SEED__.events.length > 0) {
                importEvents(window.__VAULT_AGENDA_SEED__.events, window.__VAULT_AGENDA_SEED__.lastSyncedAt, 'Cache Integrado', false);
            }
            render();
            syncFromGoogleCalendar(false);
        });

        window.addEventListener('vault:tab-changed', (e) => {
            if (e.detail && e.detail.tab === 'agenda') {
                render();
            }
        });
    }

    global.VaultTabAgenda = {
        init,
        render,
        syncFromGoogleCalendar,
        importEvents,
        getMonthlyReport
    };

})(window);
