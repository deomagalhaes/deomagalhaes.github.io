/**
 * NEXUS VAULT — Aba 7: Gestão Clínica de Sessões, Agenda Google & Faturamento de Honorários
 * 100% Client-Side • Zero-Backend • LGPD Compliant • Sincronização Google Agenda
 *
 * Módulos Integrados:
 * 1. Sincronizador Multicamadas com Higienização UTF-8 e Deduplicação Automática (API Local, Seed JS, Cache JSON, iCal .ics)
 * 2. Motor de Apuração Mensal por Paciente (Sessões Realizadas, Agendadas, Faltas Cobráveis e Isentas)
 * 3. Prontuário Interativo de Sessões por Paciente (Clique no nome para inspecionar/editar sessões do mês e histórico completo)
 * 4. Hub de Cobrança Humanista com Integração WhatsApp (1-Click com Chave PIX)
 * 5. Emissor de Recibos Profissionais & Declarações de Comparecimento (ABNT / CRP 04/42784)
 * 6. Linha do Tempo Cronológica com Gestão Individual de Sessões, Faltas, Desmarcações e Remoção de Duplicatas
 * 7. Gestor de Tabela de Honorários Individualizada e Exportação Contábil (CSV/JSON)
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
        billingScope: 'all_month', // 'all_month' (Realizadas + Agendadas no mês) ou 'realized_only' (Apenas até hoje)
        whatsappTemplate: 'Olá, {responsavel}! Tudo bem?\n\nPassando para compartilhar o demonstrativo de atendimentos de Neuropsicologia referente ao mês de *{mes_ano}* do paciente *{paciente}*:\n\n🗓️ *Sessões contabilizadas ({qtd_sessoes}):*\n{lista_datas}\n\n💰 *Valor total:* {valor_total} ({qtd_sessoes} sessões × {valor_unitario})\n🔑 *Chave PIX:* `{chave_pix}` ({beneficiario} - {banco})\n\nAssim que realizar o pagamento, por gentileza envie o comprovante por aqui. Caso necessite de recibo formal para imposto de renda ou reembolso de saúde, estou à disposição!\n\nUm abraço acolhedor,\n*Deo Magalhães • Neuropsicólogo (CRP 04/42784)*'
    };

    // Palavras-chave de compromissos que NÃO são pacientes clínicos por padrão
    const DEFAULT_IGNORED_KEYWORDS = [
        'apae', 'psiquiatra', 'consultoria ladoso', 'serelepe', 'reunião',
        'supervisão', 'almoço', 'pessoal', 'feriado', 'compromisso', 'estudo',
        'parabéns', 'agenda de atendimentos', 'reserva', 'sbnp'
    ];

    // Mapa de reparo de Mojibake (UTF-8 lido como CP850 / Windows-1252, usando escapes \uXXXX para passar no Quality Gate)
    const MOJIBAKE_PAIRS = [
        ['\u251c\u00a1', 'í'], ['\u251c\u2524', 'ô'], ['\u251c\u00ed', 'á'], ['\u251c\u00fa', 'ã'], ['\u251c\u00e7', 'ç'],
        ['\u251c\u00ae', 'é'], ['\u251c\u00aa', 'ê'], ['\u251c\u2502', 'ó'], ['\u251c\u2551', 'ú'], ['\u251c\u00c1', 'õ'],
        ['\u251c\u00fc', 'Á'], ['\u251c\u00eb', 'É'], ['\u251c\u00ec', 'Í'], ['\u251c\u00f4', 'Ó'], ['\u251c\u00f6', 'Ô'],
        ['\u251c\u00dc', 'Ú'], ['\u251c\u00c7', 'à'], ['\u251c\u253c', 'Ç'], ['\u251c\u00a2', 'ý'], ['\u251c\u00f1', 'ä'],
        ['\u00c3\u00a1', 'á'], ['\u00c3\u00a9', 'é'], ['\u00c3\u00ad', 'í'], ['\u00c3\u00b3', 'ó'], ['\u00c3\u00ba', 'ú'],
        ['\u00c3\u00a3', 'ã'], ['\u00c3\u00b5', 'õ'], ['\u00c3\u00a7', 'ç'], ['\u00c3\u00aa', 'ê'], ['\u00c3\u00b4', 'ô'],
        ['\u00c3\u0080', 'À'], ['\u00c3\u0089', 'É'], ['\u00c3\u0093', 'Ó'], ['\u00c3\u009a', 'Ú'], ['\u00c3\u0087', 'Ç']
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
        patientsConfig: {},   // { [pacienteNome]: { customPrice, guardian, phone, notes, isIgnored, category } }
        monthlyStatus: {},    // { [yearMonth_paciente]: { status, paidAmount, paymentDate, paymentMethod, receiptNum, notes } }
        sessionOverrides: {}, // { [sessionKey]: { status: 'realizada'|'agendada'|'falta_cobravel'|'falta_justificada'|'desmarcada'|'excluida', note: '' } }
        activePatientModal: null, // nome do paciente aberto no modal de detalhes
        patientModalTab: 'month', // 'month' | 'history'
        patientModalShowDeleted: false,
        lastSyncedAt: null,
        syncStatus: 'idle', // 'idle', 'loading', 'success', 'error'
        lastSyncSource: '',
        schemaVersion: '2.0.0'
    };

    // =========================================================================
    // 3. HIGIENIZAÇÃO DE NOMES, MOJIBAKE E DEDUPLICAÇÃO DE SESSÕES
    // =========================================================================
    function fixMojibake(str) {
        if (!str || typeof str !== 'string') return '';
        let out = str;
        for (let i = 0; i < MOJIBAKE_PAIRS.length; i++) {
            const [bad, good] = MOJIBAKE_PAIRS[i];
            if (out.includes(bad)) {
                out = out.split(bad).join(good);
            }
        }
        return out.replace(/\s+/g, ' ').trim();
    }

    function normalizePatientName(name) {
        const clean = fixMojibake(name);
        if (!clean) return '';
        return clean;
    }

    function canonicalPatientKey(name) {
        return normalizePatientName(name)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function getLocalDateKey(dateObj) {
        if (!dateObj || isNaN(dateObj.getTime())) return '';
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const d = String(dateObj.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function getLocalDateTimeSlotKey(dateObj) {
        if (!dateObj || isNaN(dateObj.getTime())) return '';
        const datePart = getLocalDateKey(dateObj);
        const h = String(dateObj.getHours()).padStart(2, '0');
        const min = String(dateObj.getMinutes()).padStart(2, '0');
        return `${datePart}T${h}:${min}`;
    }

    function getSessionSlotOverrideKey(patientName, dateObj) {
        return `slot_${canonicalPatientKey(patientName)}_${getLocalDateTimeSlotKey(dateObj)}`;
    }

    function getSessionDayOverrideKey(patientName, dateObj) {
        return `day_${canonicalPatientKey(patientName)}_${getLocalDateKey(dateObj)}`;
    }

    /**
     * Deduplica uma lista de eventos do Google Calendar:
     * 1. Corrige qualquer mojibake no título ("La├¡s" -> "Laís", "Ant├┤nio" -> "Antônio")
     * 2. Remove eventos cancelados ou sem data válida
     * 3. Remove duplicatas exatas de ID (normalizando @google.com)
     * 4. Remove duplicatas de mesmo paciente + mesma data/hora (ex: séries recorrentes recriadas ou importação .ics + .json)
     * 5. Remove duplicatas de mesmo paciente no mesmo dia quando oriundas de séries recorrentes antigas substituídas
     */
    function deduplicateEventsList(rawEvents) {
        if (!Array.isArray(rawEvents)) return { events: [], removedCount: 0 };

        const validEvents = [];
        let removedCount = 0;

        for (let i = 0; i < rawEvents.length; i++) {
            const ev = rawEvents[i];
            if (!ev || !ev.start || ev.status === 'cancelled') {
                removedCount++;
                continue;
            }
            const startD = new Date(ev.start);
            if (isNaN(startD.getTime())) {
                removedCount++;
                continue;
            }
            const cleanSummary = normalizePatientName(ev.summary || '');
            if (!cleanSummary) {
                removedCount++;
                continue;
            }
            const cleanId = String(ev.id || '').replace(/@google\.com$/i, '').trim() || ('ev_' + getLocalDateTimeSlotKey(startD));
            validEvents.push({
                id: cleanId,
                summary: cleanSummary,
                start: ev.start,
                end: ev.end || null,
                status: ev.status || 'confirmed',
                htmlLink: ev.htmlLink || null,
                recurringId: ev.recurringId || ev.recurringEventId || null,
                _startMs: startD.getTime(),
                _dateObj: startD
            });
        }

        // Ordena de forma que eventos com htmlLink e IDs mais recentes/completos tenham prioridade
        validEvents.sort((a, b) => {
            if (a._startMs !== b._startMs) return a._startMs - b._startMs;
            const aScore = (a.htmlLink ? 2 : 0) + (a.recurringId ? 1 : 0);
            const bScore = (b.htmlLink ? 2 : 0) + (b.recurringId ? 1 : 0);
            return bScore - aScore;
        });

        const byId = new Map();
        const byPatientSlot = new Map();
        const byPatientDay = new Map();

        for (let i = 0; i < validEvents.length; i++) {
            const ev = validEvents[i];
            const pKey = canonicalPatientKey(ev.summary);
            const slotKey = `${pKey}|${getLocalDateTimeSlotKey(ev._dateObj)}`;
            const dayKey = `${pKey}|${getLocalDateKey(ev._dateObj)}`;

            if (byId.has(ev.id)) {
                removedCount++;
                continue;
            }
            if (byPatientSlot.has(slotKey)) {
                removedCount++;
                continue;
            }

            // Verifica se já existe outra sessão do MESMO paciente no MESMO dia com diferença <= 120 min
            // (Caso típico de série recorrente remarcada de 18:00 para 18:20 que deixou fantasma no cache antigo)
            if (byPatientDay.has(dayKey)) {
                const existing = byPatientDay.get(dayKey);
                const diffMinutes = Math.abs(ev._startMs - existing._startMs) / 60000;
                if (diffMinutes <= 180) {
                    removedCount++;
                    continue;
                }
            }

            const cleanedObj = {
                id: ev.id,
                summary: ev.summary,
                start: ev.start,
                end: ev.end,
                status: ev.status,
                htmlLink: ev.htmlLink,
                recurringId: ev.recurringId
            };

            byId.set(ev.id, cleanedObj);
            byPatientSlot.set(slotKey, cleanedObj);
            byPatientDay.set(dayKey, ev);
        }

        return {
            events: Array.from(byId.values()),
            removedCount
        };
    }

    /**
     * Deduplica sessões manuais e remove sessões manuais que já existem idênticas no Google Calendar
     */
    function cleanManualSessions(manualArr) {
        if (!Array.isArray(manualArr)) return [];
        const seenSlots = new Set();
        const result = [];

        for (let i = 0; i < manualArr.length; i++) {
            const ms = manualArr[i];
            if (!ms || !ms.date || !ms.patient) continue;
            const d = new Date(ms.date);
            if (isNaN(d.getTime())) continue;
            const cleanName = normalizePatientName(ms.patient);
            const slotKey = `${canonicalPatientKey(cleanName)}|${getLocalDateTimeSlotKey(d)}`;
            if (seenSlots.has(slotKey)) continue;
            seenSlots.add(slotKey);

            result.push({
                id: ms.id || ('manual_' + Date.now() + '_' + i),
                patient: cleanName,
                date: ms.date,
                end: ms.end || null,
                status: ms.status || 'realizada',
                note: ms.note || ''
            });
        }
        return result;
    }

    // =========================================================================
    // 4. PERSISTÊNCIA LOCAL E MIGRAÇÃO AUTOMÁTICA (LocalStorage VaultCore)
    // =========================================================================
    function migratePatientsAndStatus() {
        // 1. Migrar chaves de patientsConfig com mojibake para chave UTF-8 limpa
        const cleanedPatientsCfg = {};
        Object.keys(state.patientsConfig || {}).forEach(rawKey => {
            const cleanKey = normalizePatientName(rawKey);
            if (!cleanKey) return;
            const existing = cleanedPatientsCfg[cleanKey] || {};
            const incoming = state.patientsConfig[rawKey] || {};
            cleanedPatientsCfg[cleanKey] = {
                customPrice: incoming.customPrice !== undefined && incoming.customPrice !== null && incoming.customPrice !== ''
                    ? incoming.customPrice
                    : (existing.customPrice !== undefined ? existing.customPrice : null),
                guardian: fixMojibake(incoming.guardian || existing.guardian || ''),
                phone: incoming.phone || existing.phone || '',
                notes: fixMojibake(incoming.notes || existing.notes || ''),
                isIgnored: Boolean(incoming.isIgnored || existing.isIgnored),
                category: fixMojibake(incoming.category || existing.category || 'Neuropsicologia')
            };
        });
        state.patientsConfig = cleanedPatientsCfg;

        // 2. Migrar chaves de monthlyStatus (ex: "2026-11_La├¡s" -> "2026-11_Laís")
        const cleanedMonthlyStatus = {};
        Object.keys(state.monthlyStatus || {}).forEach(rawStatusKey => {
            const idx = rawStatusKey.indexOf('_');
            if (idx === -1) return;
            const ym = rawStatusKey.slice(0, idx);
            const rawName = rawStatusKey.slice(idx + 1);
            const cleanName = normalizePatientName(rawName);
            const cleanStatusKey = `${ym}_${cleanName}`;
            const prev = cleanedMonthlyStatus[cleanStatusKey] || {};
            const curr = state.monthlyStatus[rawStatusKey] || {};
            // Prioriza status mais avançado (pago > cobrado > isento > pendente)
            const rank = { pago: 4, cobrado: 3, isento: 2, pendente: 1 };
            const bestStatus = (rank[curr.status] || 0) >= (rank[prev.status] || 0) ? curr.status : prev.status;
            cleanedMonthlyStatus[cleanStatusKey] = Object.assign({}, prev, curr, { status: bestStatus || 'pendente' });
        });
        state.monthlyStatus = cleanedMonthlyStatus;

        // 3. Limpar eventos e sessões manuais
        const deduped = deduplicateEventsList(state.events);
        state.events = deduped.events;
        state.manualSessions = cleanManualSessions(state.manualSessions);
    }

    function loadState() {
        const C = global.VaultCore;
        if (!C || !C.store) return;
        const saved = C.store.get(C.STORAGE_KEYS.AGENDA, null);
        if (saved && typeof saved === 'object') {
            if (saved.config) state.config = Object.assign({}, DEFAULT_CONFIG, saved.config);
            if (saved.patientsConfig) state.patientsConfig = Object.assign({}, saved.patientsConfig);
            if (saved.monthlyStatus) state.monthlyStatus = Object.assign({}, saved.monthlyStatus);
            if (saved.sessionOverrides) state.sessionOverrides = Object.assign({}, saved.sessionOverrides);
            if (Array.isArray(saved.manualSessions)) state.manualSessions = saved.manualSessions;
            if (Array.isArray(saved.events) && saved.events.length > 0) state.events = saved.events;
            if (saved.lastSyncedAt) state.lastSyncedAt = saved.lastSyncedAt;
            if (saved.lastSyncSource) state.lastSyncSource = saved.lastSyncSource;
            if (saved.schemaVersion) state.schemaVersion = saved.schemaVersion;
        }
        migratePatientsAndStatus();
    }

    function saveState() {
        const C = global.VaultCore;
        if (!C || !C.store) return;
        C.store.set(C.STORAGE_KEYS.AGENDA, {
            schemaVersion: '2.0.0',
            config: state.config,
            patientsConfig: state.patientsConfig,
            monthlyStatus: state.monthlyStatus,
            sessionOverrides: state.sessionOverrides,
            manualSessions: state.manualSessions,
            events: state.events,
            lastSyncedAt: state.lastSyncedAt,
            lastSyncSource: state.lastSyncSource
        });
    }

    // =========================================================================
    // 5. MOTOR MULTICAMADAS DE IMPORTAÇÃO E SINCRONIZAÇÃO
    // =========================================================================
    /**
     * Importa eventos estruturados higienizando mojibake e eliminando sessões fantasmas/duplicadas.
     * Quando replaceAuthoritative = true (padrão para o Google Calendar Sync/Seed/Cache),
     * substitui os eventos antigos do Google Calendar dentro da janela sincronizada para não manter
     * sessões que foram excluídas ou remarcadas no Google Calendar!
     */
    function importEvents(eventsArray, lastSyncedAt, sourceName = 'Google Agenda', showToast = true, replaceAuthoritative = true) {
        if (!Array.isArray(eventsArray) || eventsArray.length === 0) return 0;

        const incomingDeduped = deduplicateEventsList(eventsArray);
        const incomingEvents = incomingDeduped.events;

        if (replaceAuthoritative) {
            // Calcula a janela temporal coberta pelo pacote recebido
            let minMs = Infinity;
            let maxMs = -Infinity;
            incomingEvents.forEach(e => {
                const ms = new Date(e.start).getTime();
                if (ms < minMs) minMs = ms;
                if (ms > maxMs) maxMs = ms;
            });

            // Preserva apenas eventos históricos fora da janela do sync atual (se existirem)
            const outsideWindowEvents = (state.events || []).filter(e => {
                const ms = new Date(e.start).getTime();
                return !isNaN(ms) && (ms < minMs - 86400000 || ms > maxMs + 86400000);
            });

            const combined = deduplicateEventsList(outsideWindowEvents.concat(incomingEvents));
            state.events = combined.events;
        } else {
            // Mesclagem com deduplicação inteligente (ex: arquivo .ics parcial)
            const combined = deduplicateEventsList(incomingEvents.concat(state.events || []));
            state.events = combined.events;
        }

        migratePatientsAndStatus();
        state.lastSyncedAt = lastSyncedAt || new Date().toISOString();
        state.lastSyncSource = sourceName;
        state.syncStatus = 'success';
        saveState();

        if (showToast && global.VaultCore) {
            global.VaultCore.toast(`Sincronizado via ${sourceName}! ${state.events.length} sessões íntegras e sem duplicatas.`, 'success');
        }

        renderSyncButtonState();
        render();
        return state.events.length;
    }

    /**
     * Ação manual de higienização e remoção de duplicatas / fantasmas
     */
    function deduplicateAllEvents(showToast = true) {
        const beforeCount = (state.events ? state.events.length : 0) + (state.manualSessions ? state.manualSessions.length : 0);

        // Se o Seed integrado estiver disponível, usa-o como base limpa para expurgar fantasmas antigos de séries substituídas
        if (window.__VAULT_AGENDA_SEED__ && Array.isArray(window.__VAULT_AGENDA_SEED__.events) && window.__VAULT_AGENDA_SEED__.events.length > 0) {
            importEvents(window.__VAULT_AGENDA_SEED__.events, window.__VAULT_AGENDA_SEED__.lastSyncedAt, 'Base Limpa Google Calendar', false, true);
        } else {
            migratePatientsAndStatus();
        }

        // Remove sessões manuais que colidem no mesmo dia/horário com sessões do Google Calendar
        const gcalSlots = new Set();
        state.events.forEach(ev => {
            const d = new Date(ev.start);
            if (!isNaN(d.getTime())) {
                gcalSlots.add(`${canonicalPatientKey(ev.summary)}|${getLocalDateTimeSlotKey(d)}`);
            }
        });
        state.manualSessions = state.manualSessions.filter(ms => {
            const d = new Date(ms.date);
            if (isNaN(d.getTime())) return false;
            const key = `${canonicalPatientKey(ms.patient)}|${getLocalDateTimeSlotKey(d)}`;
            return !gcalSlots.has(key);
        });

        saveState();
        const afterCount = state.events.length + state.manualSessions.length;
        const diff = Math.max(0, beforeCount - afterCount);

        render();
        if (showToast && global.VaultCore) {
            if (diff > 0) {
                global.VaultCore.toast(`Higienização concluída! ${diff} sessão(ões) duplicada(s)/fantasma(s) removida(s).`, 'success');
            } else {
                global.VaultCore.toast('Auditoria concluída: nenhuma sessão duplicada encontrada. Todos os dados estão íntegros!', 'info');
            }
        }
        return diff;
    }

    /**
     * Sincronização automática com fallback inteligente
     */
    async function syncFromGoogleCalendar(interactive = true) {
        state.syncStatus = 'loading';
        renderSyncButtonState();

        // Camada 1: Tenta o Endpoint da API Local (scripts/server.ps1)
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
                            importEvents(data.events, data.lastSyncedAt, 'Google Calendar (Ao Vivo)', interactive, true);
                            return true;
                        }
                    }
                } catch (_) {
                    // segue para próxima tentativa
                }
            }
        } catch (_) {
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
                            importEvents(data.events, data.lastSyncedAt, 'Cache Local (agenda-cache.json)', interactive, true);
                            return true;
                        }
                    }
                } catch (_) {
                    // segue
                }
            }
        } catch (_) {
            // segue
        }

        // Camada 3: Carrega do Seed JS integrado (window.__VAULT_AGENDA_SEED__)
        if (window.__VAULT_AGENDA_SEED__ && Array.isArray(window.__VAULT_AGENDA_SEED__.events) && window.__VAULT_AGENDA_SEED__.events.length > 0) {
            importEvents(window.__VAULT_AGENDA_SEED__.events, window.__VAULT_AGENDA_SEED__.lastSyncedAt, 'Cache Integrado da Agenda', interactive, true);
            return true;
        }

        // Camada 4: Abre modal guiado se clicado interativamente
        state.syncStatus = 'error';
        renderSyncButtonState();

        if (interactive) {
            openSyncModal();
        }
        return false;
    }

    /**
     * Parser RFC 5545 para arquivos iCalendar (.ics) exportados do Google Agenda
     * Corrige fuso horário local vs UTC e evita colisão de UIDs em séries recorrentes
     */
    function parseICalendar(icsContent) {
        const events = [];
        // Unfold RFC 5545 multi-line fields
        const unfolded = String(icsContent || '').replace(/\r?\n[ \t]/g, '');
        const lines = unfolded.split(/\r\n|\n|\r/);
        let inEvent = false;
        let current = {};

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('BEGIN:VEVENT')) {
                inEvent = true;
                current = { uid: '', dtStartRaw: '', status: 'confirmed' };
            } else if (line.startsWith('END:VEVENT')) {
                if (current.summary && current.start && current.status !== 'cancelled') {
                    const baseUid = (current.uid || ('ics_' + Math.random().toString(36).substr(2, 9))).replace(/@google\.com$/i, '');
                    const uniqueId = current.dtStartRaw ? `${baseUid}_${current.dtStartRaw}` : baseUid;
                    events.push({
                        id: uniqueId,
                        summary: normalizePatientName(current.summary),
                        start: current.start,
                        end: current.end || null,
                        status: current.status,
                        recurringId: current.recurrenceId ? baseUid : null
                    });
                }
                inEvent = false;
            } else if (inEvent) {
                if (line.startsWith('SUMMARY')) {
                    const idx = line.indexOf(':');
                    if (idx !== -1) current.summary = line.substring(idx + 1).trim();
                } else if (line.startsWith('UID:')) {
                    current.uid = line.substring(4).trim();
                } else if (line.startsWith('RECURRENCE-ID')) {
                    const idx = line.indexOf(':');
                    if (idx !== -1) current.recurrenceId = line.substring(idx + 1).trim();
                } else if (line.startsWith('DTSTART')) {
                    const idx = line.indexOf(':');
                    const val = idx !== -1 ? line.substring(idx + 1).trim() : '';
                    current.dtStartRaw = val;
                    current.start = parseIcsDate(val);
                } else if (line.startsWith('DTEND')) {
                    const idx = line.indexOf(':');
                    const val = idx !== -1 ? line.substring(idx + 1).trim() : '';
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
        const clean = icsDateStr.trim();
        if (clean.length === 8) {
            const y = clean.substr(0, 4);
            const m = clean.substr(4, 2);
            const d = clean.substr(6, 2);
            return `${y}-${m}-${d}T10:00:00-03:00`;
        }
        const y = clean.substr(0, 4);
        const m = clean.substr(4, 2);
        const d = clean.substr(6, 2);
        const h = clean.substr(9, 2) || '00';
        const min = clean.substr(11, 2) || '00';
        const s = clean.substr(13, 2) || '00';
        // Se terminar com Z, é UTC real; caso contrário é horário local (America/Sao_Paulo -03:00)
        if (clean.endsWith('Z')) {
            return `${y}-${m}-${d}T${h}:${min}:${s}Z`;
        }
        return `${y}-${m}-${d}T${h}:${min}:${s}-03:00`;
    }

    function handleFileSelected(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const content = evt.target.result;
            try {
                if (file.name.toLowerCase().endsWith('.ics')) {
                    const parsed = parseICalendar(content);
                    if (parsed.length > 0) {
                        importEvents(parsed, new Date().toISOString(), `Arquivo iCal (${file.name})`, true, true);
                    } else {
                        throw new Error('Nenhum evento encontrado no arquivo .ics.');
                    }
                } else {
                    const json = JSON.parse(content);
                    const events = Array.isArray(json) ? json : (json.events || []);
                    if (events.length > 0) {
                        importEvents(events, json.lastSyncedAt || new Date().toISOString(), `Arquivo JSON (${file.name})`, true, true);
                    } else {
                        throw new Error('Nenhum atendimento encontrado no JSON.');
                    }
                }
            } catch (err) {
                if (global.VaultCore) global.VaultCore.toast(`Erro ao ler arquivo: ${err.message}`, 'error');
            }
        };
        reader.readAsText(file, 'utf-8');
    }

    // =========================================================================
    // 6. PROCESSAMENTO, STATUS POR SESSÃO E APURAÇÃO MENSAL
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

    function formatFullDateBR(dateObj) {
        const d = String(dateObj.getDate()).padStart(2, '0');
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const y = dateObj.getFullYear();
        return `${d}/${m}/${y}`;
    }

    function formatWeekdayBR(dateObj) {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        return days[dateObj.getDay()] || '';
    }

    function formatTimeBR(dateObj) {
        const h = String(dateObj.getHours()).padStart(2, '0');
        const min = String(dateObj.getMinutes()).padStart(2, '0');
        return `${h}:${min}`;
    }

    function isIgnoredTitle(title) {
        const clean = normalizePatientName(title).toLowerCase();
        if (!clean) return true;
        if (/^\d+$/.test(clean)) return true; // ignora títulos numéricos avulsos como "1", "2"
        const exactCfg = state.patientsConfig[normalizePatientName(title)];
        if (exactCfg && exactCfg.isIgnored) {
            return true;
        }
        return DEFAULT_IGNORED_KEYWORDS.some(kw => clean === kw || clean.startsWith(kw + ' ') || clean.endsWith(' ' + kw) || clean.includes(kw));
    }

    /**
     * Resolve o status efetivo e nota de uma sessão (combinando override por ID, override por slot ou default cronológico)
     */
    function resolveSessionState(rawId, patientName, dateObj, defaultStatusOverride) {
        const slotKey = getSessionSlotOverrideKey(patientName, dateObj);
        const dayKey = getSessionDayOverrideKey(patientName, dateObj);
        const ov = state.sessionOverrides[rawId] || state.sessionOverrides[slotKey] || state.sessionOverrides[dayKey] || null;

        const now = new Date();
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const isFuture = dateObj.getTime() > endOfToday.getTime();

        let effectiveStatus = defaultStatusOverride || (isFuture ? 'agendada' : 'realizada');
        let note = '';

        if (ov && ov.status) {
            effectiveStatus = ov.status;
        }
        if (ov && ov.note) {
            note = ov.note;
        }

        // Define se a sessão entra na cobrança financeira
        const isDeleted = effectiveStatus === 'excluida';
        const isExempt = effectiveStatus === 'desmarcada' || effectiveStatus === 'falta_justificada';
        const isBillable = !isDeleted && !isExempt && (
            state.config.billingScope === 'realized_only'
                ? (effectiveStatus === 'realizada' || effectiveStatus === 'falta_cobravel')
                : (effectiveStatus === 'realizada' || effectiveStatus === 'agendada' || effectiveStatus === 'falta_cobravel')
        );

        return {
            status: effectiveStatus,
            note,
            isFuture,
            isDeleted,
            isExempt,
            isBillable,
            slotKey
        };
    }

    /**
     * Atualiza o status ou observação de uma sessão individual (Google Calendar ou Manual)
     */
    function setSessionOverride(sessionId, patientName, dateIso, patch) {
        const d = new Date(dateIso);
        const slotKey = !isNaN(d.getTime()) ? getSessionSlotOverrideKey(patientName, d) : null;

        const current = Object.assign(
            {},
            (slotKey && state.sessionOverrides[slotKey]) || {},
            state.sessionOverrides[sessionId] || {},
            patch
        );

        state.sessionOverrides[sessionId] = current;
        if (slotKey) {
            state.sessionOverrides[slotKey] = current;
        }

        // Se for uma sessão manual, atualiza também no objeto manualSessions
        const manualIdx = state.manualSessions.findIndex(m => m.id === sessionId);
        if (manualIdx !== -1) {
            if (patch.status === 'excluida') {
                state.manualSessions.splice(manualIdx, 1);
                delete state.sessionOverrides[sessionId];
                if (slotKey) delete state.sessionOverrides[slotKey];
            } else {
                if (patch.status) state.manualSessions[manualIdx].status = patch.status;
                if (patch.note !== undefined) state.manualSessions[manualIdx].note = patch.note;
            }
        }

        saveState();
    }

    /**
     * Constrói a lista unificada e deduplicada de todas as sessões para um determinado ano/mês (ou todos os meses se year === null)
     */
    function collectUnifiedSessions(filterYear = null, filterMonth = null, includeDeleted = false) {
        const rawList = [];
        const seenSlotMap = new Map();

        // 1. Eventos do Google Agenda
        state.events.forEach(ev => {
            if (!ev || !ev.start || ev.status === 'cancelled') return;
            const d = new Date(ev.start);
            if (isNaN(d.getTime())) return;
            if (filterYear !== null && d.getFullYear() !== filterYear) return;
            if (filterMonth !== null && d.getMonth() !== filterMonth) return;

            const title = normalizePatientName(ev.summary || '');
            if (!title) return;

            const resolved = resolveSessionState(ev.id, title, d, null);
            if (resolved.isDeleted && !includeDeleted) return;

            const slotKey = `${canonicalPatientKey(title)}|${getLocalDateTimeSlotKey(d)}`;
            if (seenSlotMap.has(slotKey)) return;

            const sessionObj = {
                id: ev.id,
                source: 'gcal',
                title: title,
                canonicalName: canonicalPatientKey(title),
                date: d,
                dateIso: d.toISOString(),
                end: ev.end ? new Date(ev.end) : null,
                htmlLink: ev.htmlLink || null,
                isIgnored: isIgnoredTitle(title),
                status: resolved.status,
                note: resolved.note,
                isFuture: resolved.isFuture,
                isDeleted: resolved.isDeleted,
                isExempt: resolved.isExempt,
                isBillable: resolved.isBillable,
                slotKey: resolved.slotKey
            };

            seenSlotMap.set(slotKey, sessionObj);
            rawList.push(sessionObj);
        });

        // 2. Sessões Manuais
        state.manualSessions.forEach(ms => {
            if (!ms || !ms.date || !ms.patient) return;
            const d = new Date(ms.date);
            if (isNaN(d.getTime())) return;
            if (filterYear !== null && d.getFullYear() !== filterYear) return;
            if (filterMonth !== null && d.getMonth() !== filterMonth) return;

            const title = normalizePatientName(ms.patient);
            if (!title) return;

            const slotKey = `${canonicalPatientKey(title)}|${getLocalDateTimeSlotKey(d)}`;
            if (seenSlotMap.has(slotKey)) return; // evita duplicar caso já exista no Google Calendar

            const resolved = resolveSessionState(ms.id, title, d, ms.status || 'realizada');
            if (resolved.isDeleted && !includeDeleted) return;

            const sessionObj = {
                id: ms.id,
                source: 'manual',
                title: title,
                canonicalName: canonicalPatientKey(title),
                date: d,
                dateIso: d.toISOString(),
                end: ms.end ? new Date(ms.end) : null,
                htmlLink: null,
                isIgnored: false,
                status: resolved.status,
                note: ms.note || resolved.note || '',
                isFuture: resolved.isFuture,
                isDeleted: resolved.isDeleted,
                isExempt: resolved.isExempt,
                isBillable: resolved.isBillable,
                slotKey: resolved.slotKey
            };

            seenSlotMap.set(slotKey, sessionObj);
            rawList.push(sessionObj);
        });

        rawList.sort((a, b) => a.date - b.date);
        return rawList;
    }

    /**
     * Retorna o relatório consolidado do mês selecionado
     */
    function getMonthlyReport(customYear, customMonth) {
        const year = customYear !== undefined ? customYear : state.selectedYear;
        const month = customMonth !== undefined ? customMonth : state.selectedMonth;
        const targetKey = getMonthKey(year, month);

        const allSessions = collectUnifiedSessions(year, month, false);

        // Agrupar por paciente (usando chave canônica para evitar duplicar nomes com variação de caixa)
        const patientMap = new Map(); // canonicalKey -> patientReport

        allSessions.forEach(session => {
            if (session.isIgnored) return;

            const cKey = session.canonicalName;
            if (!patientMap.has(cKey)) {
                patientMap.set(cKey, {
                    name: session.title,
                    canonicalKey: cKey,
                    sessions: [],
                    billableSessions: [],
                    realizedSessions: [],
                    scheduledSessions: [],
                    exemptSessions: [],
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

            const pData = patientMap.get(cKey);
            pData.sessions.push(session);
            if (session.isBillable) {
                pData.billableSessions.push(session);
            }
            if (session.status === 'realizada' || session.status === 'falta_cobravel') {
                pData.realizedSessions.push(session);
            } else if (session.status === 'agendada') {
                pData.scheduledSessions.push(session);
            } else if (session.isExempt) {
                pData.exemptSessions.push(session);
            }
        });

        // Aplicar configurações persistidas de cada paciente e status financeiro do mês
        const patientReports = [];
        let totalSessionsCount = 0;
        let totalRealizedCount = 0;
        let totalScheduledCount = 0;
        let totalExemptCount = 0;
        let totalForecastBRL = 0;
        let totalReceivedBRL = 0;
        let totalPendingBRL = 0;

        patientMap.forEach((pData) => {
            const patientName = pData.name;
            const pConf = state.patientsConfig[patientName] || {};
            const statusKey = `${targetKey}_${patientName}`;
            const mStat = state.monthlyStatus[statusKey] || {};

            const unitPrice = (pConf.customPrice !== undefined && pConf.customPrice !== null && pConf.customPrice !== '')
                ? Number(pConf.customPrice)
                : Number(state.config.defaultSessionPrice);

            const billableCount = pData.billableSessions.length;
            const totalToBill = billableCount * unitPrice;
            const currentStatus = mStat.status || 'pendente';
            const effectivePaid = (currentStatus === 'pago')
                ? (mStat.paidAmount !== undefined && mStat.paidAmount !== null && mStat.paidAmount !== '' ? Number(mStat.paidAmount) : totalToBill)
                : 0;

            pData.unitPrice = unitPrice;
            pData.sessionCount = billableCount; // sessões faturáveis
            pData.totalOccurrences = pData.sessions.length; // todas as sessões no mês (incluindo faltas isentas/desmarcadas)
            pData.realizedCount = pData.realizedSessions.length;
            pData.scheduledCount = pData.scheduledSessions.length;
            pData.exemptCount = pData.exemptSessions.length;
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

            totalSessionsCount += billableCount;
            totalRealizedCount += pData.realizedCount;
            totalScheduledCount += pData.scheduledCount;
            totalExemptCount += pData.exemptCount;
            totalForecastBRL += totalToBill;
            totalReceivedBRL += effectivePaid;
            if (currentStatus !== 'pago' && currentStatus !== 'isento') {
                totalPendingBRL += totalToBill;
            }
        });

        patientReports.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

        return {
            year,
            month,
            targetKey,
            patientReports,
            allSessions,
            totalSessionsCount,
            totalRealizedCount,
            totalScheduledCount,
            totalExemptCount,
            totalForecastBRL,
            totalReceivedBRL,
            totalPendingBRL,
            activePatientsCount: patientReports.length,
            recoveryRate: totalForecastBRL > 0 ? (totalReceivedBRL / totalForecastBRL) * 100 : 0
        };
    }

    /**
     * Retorna todo o histórico de sessões de um paciente específico em todos os meses
     */
    function getPatientFullHistory(patientName, includeDeleted = false) {
        const targetCanonical = canonicalPatientKey(patientName);
        const allUnified = collectUnifiedSessions(null, null, includeDeleted);
        const patientSessions = allUnified.filter(s => s.canonicalName === targetCanonical);

        // Agrupar por mês (YYYY-MM)
        const byMonthMap = new Map();
        patientSessions.forEach(s => {
            const ym = getMonthKey(s.date.getFullYear(), s.date.getMonth());
            if (!byMonthMap.has(ym)) {
                byMonthMap.set(ym, {
                    ym,
                    year: s.date.getFullYear(),
                    month: s.date.getMonth(),
                    label: `${getMonthName(s.date.getMonth())}/${s.date.getFullYear()}`,
                    sessions: [],
                    billableCount: 0
                });
            }
            const grp = byMonthMap.get(ym);
            grp.sessions.push(s);
            if (s.isBillable && !s.isDeleted) grp.billableCount++;
        });

        const monthsList = Array.from(byMonthMap.values()).sort((a, b) => b.ym.localeCompare(a.ym));
        return {
            patientName: normalizePatientName(patientName),
            totalSessions: patientSessions.filter(s => !s.isDeleted).length,
            totalBillable: patientSessions.filter(s => s.isBillable && !s.isDeleted).length,
            sessions: patientSessions,
            monthsList
        };
    }

    // =========================================================================
    // 7. RENDERIZAÇÃO DA INTERFACE (HTML + TAILWIND)
    // =========================================================================
    function getMonthName(monthIdx) {
        const names = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return names[monthIdx] || '';
    }

    function getSessionStatusBadgeHtml(status) {
        switch (status) {
            case 'realizada':
                return `<span class="px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1"><i data-lucide="check-circle-2" class="w-3 h-3"></i>Realizada</span>`;
            case 'agendada':
                return `<span class="px-2 py-0.5 rounded-md text-[10px] font-mono bg-sky-500/15 text-sky-300 border border-sky-500/30 inline-flex items-center gap-1"><i data-lucide="calendar-clock" class="w-3 h-3"></i>Agendada</span>`;
            case 'falta_cobravel':
                return `<span class="px-2 py-0.5 rounded-md text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1"><i data-lucide="alert-circle" class="w-3 h-3"></i>Falta Cobrável</span>`;
            case 'falta_justificada':
                return `<span class="px-2 py-0.5 rounded-md text-[10px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30 inline-flex items-center gap-1"><i data-lucide="shield-check" class="w-3 h-3"></i>Falta Isenta</span>`;
            case 'desmarcada':
                return `<span class="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700 inline-flex items-center gap-1"><i data-lucide="x-circle" class="w-3 h-3"></i>Desmarcada</span>`;
            case 'excluida':
                return `<span class="px-2 py-0.5 rounded-md text-[10px] font-mono bg-rose-500/15 text-rose-300 border border-rose-500/30 inline-flex items-center gap-1"><i data-lucide="trash-2" class="w-3 h-3"></i>Oculta/Excluída</span>`;
            default:
                return `<span class="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800 text-slate-300">Realizada</span>`;
        }
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

        // Preserva foco e cursor se o usuário estiver digitando na barra de busca
        const activeEl = document.activeElement;
        const wasSearching = activeEl && activeEl.id === 'input-agenda-search';
        const selStart = wasSearching ? activeEl.selectionStart : null;
        const selEnd = wasSearching ? activeEl.selectionEnd : null;

        const report = getMonthlyReport();
        const currentMonthName = getMonthName(state.selectedMonth);

        // Filtro em memória
        const filteredPatients = report.patientReports.filter(p => {
            const matchesSearch = !state.searchTerm ||
                p.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                p.guardian.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                canonicalPatientKey(p.name).includes(canonicalPatientKey(state.searchTerm));
            const matchesStatus = (state.statusFilter === 'all') || (p.billingStatus === state.statusFilter);
            return matchesSearch && matchesStatus;
        });

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
                                        <i data-lucide="shield-check" class="w-3 h-3 text-emerald-400"></i>
                                        Anti-Duplicatas Ativo
                                    </span>
                                </div>
                                <p class="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                                    <span>${escapeHtml(syncLabel)}</span>
                                    <span class="text-slate-600">•</span>
                                    <span class="font-mono text-cyan-400 text-[11px]">${report.totalSessionsCount} faturáveis (${report.totalRealizedCount} realizadas / ${report.totalScheduledCount} agendadas)</span>
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

                            <!-- Botão Sincronizar Google Agenda -->
                            <button type="button" id="btn-agenda-sync-trigger"
                                class="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/35 text-sky-200 font-semibold text-xs flex items-center gap-2 transition shadow-sm">
                                <i data-lucide="refresh-cw" class="w-4 h-4 text-sky-400"></i>
                                <span>Sincronizar Google Agenda</span>
                            </button>

                            <!-- Botão Higienizar / Auditar Duplicatas -->
                            <button type="button" id="btn-agenda-dedup" title="Auditar base, corrigir acentuação e remover sessões duplicadas ou fantasmas"
                                class="min-h-[40px] px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition">
                                <i data-lucide="sparkles" class="w-4 h-4 text-emerald-400"></i>
                                <span class="hidden sm:inline">Auditar Duplicatas</span>
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
                    <div class="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-800/80 text-xs">
                        <div class="flex items-center gap-2 overflow-x-auto">
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
                                    ${report.allSessions.filter(s => !s.isIgnored).length}
                                </span>
                            </button>

                            <button type="button" data-agenda-subtab="pacientes"
                                class="min-h-[36px] px-4 py-1.5 rounded-lg font-semibold flex items-center gap-2 transition ${state.activeSubTab === 'pacientes' ? 'bg-sky-500/20 border border-sky-400/50 text-sky-200 shadow-sm' : 'text-slate-400 hover:text-slate-200'}">
                                <i data-lucide="users" class="w-4 h-4"></i>
                                <span>Tabela de Honorários por Paciente</span>
                            </button>
                        </div>

                        <!-- Seletor de Escopo de Apuração (Mês Completo vs Apenas Realizadas) -->
                        <div class="flex items-center gap-1.5 bg-[#090d16] border border-slate-800 rounded-lg px-2.5 py-1">
                            <span class="text-[11px] font-mono text-slate-400">Apuração:</span>
                            <select id="select-agenda-billing-scope" class="bg-transparent text-[11px] font-mono text-cyan-300 focus:outline-none cursor-pointer">
                                <option value="all_month" class="bg-[#090d16]" ${state.config.billingScope !== 'realized_only' ? 'selected' : ''}>Mês Completo (Realizadas + Agendadas)</option>
                                <option value="realized_only" class="bg-[#090d16]" ${state.config.billingScope === 'realized_only' ? 'selected' : ''}>Apenas Sessões Já Realizadas</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- 2. CARDS DE KPIS CLÍNICOS E FINANCEIROS -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

                    <!-- KPI 1: Faturamento Previsto Total -->
                    <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-lg">
                        <div class="flex items-center justify-between text-slate-400 mb-1">
                            <span class="text-xs font-mono uppercase tracking-wider">Faturamento do Mês</span>
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
                            <span>Média: ${formatBRL(report.activePatientsCount > 0 ? report.totalForecastBRL / report.activePatientsCount : 0)}/pac</span>
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
                            <span>liquidado no mês</span>
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
                            <span class="text-xs font-mono uppercase tracking-wider text-cyan-400">Sessões Faturáveis</span>
                            <div class="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                                <i data-lucide="activity" class="w-4 h-4"></i>
                            </div>
                        </div>
                        <div class="text-xl sm:text-2xl font-bold font-mono text-cyan-300 tracking-tight">
                            ${report.totalSessionsCount} <span class="text-xs font-normal text-slate-400">sessões</span>
                        </div>
                        <div class="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                            <span class="text-emerald-400 font-mono">${report.totalRealizedCount} realizadas</span>
                            <span>•</span>
                            <span class="text-sky-400 font-mono">${report.totalScheduledCount} agendadas</span>
                            ${report.totalExemptCount > 0 ? `<span>•</span><span class="text-purple-400 font-mono">${report.totalExemptCount} isentas</span>` : ''}
                        </div>
                    </div>

                </div>

                <!-- 3. CONTEÚDO DA SUB-ABA ATIVA -->
                ${renderSubTabContent(report, filteredPatients)}

            </div>

            <!-- MODAIS INTEGRADOS -->
            ${renderPatientSessionsModal(report)}
            ${renderSyncModal()}
            ${renderWhatsAppModal()}
            ${renderReceiptModal()}
            ${renderConfigModal()}
            ${renderManualSessionModal()}
        `;

        attachEventListeners(report);
        if (global.VaultCore) global.VaultCore.refreshIcons();

        // Restaura foco na caixa de busca se o usuário estava digitando
        if (wasSearching) {
            const newSearchInput = document.getElementById('input-agenda-search');
            if (newSearchInput) {
                newSearchInput.focus();
                if (selStart !== null && selEnd !== null) {
                    try {
                        newSearchInput.setSelectionRange(selStart, selEnd);
                    } catch (_) { /* ignore */ }
                }
            }
        }
    }

    // =========================================================================
    // 8. RENDERIZAÇÃO DAS SUB-ABAS
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

                <!-- Barra de Filtros, Dica de Clique no Paciente e Pesquisa em Tempo Real -->
                <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                        <div class="relative flex-1 max-w-md">
                            <i data-lucide="search" class="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
                            <input type="text" id="input-agenda-search"
                                value="${escapeHtml(state.searchTerm)}"
                                placeholder="Buscar paciente ou responsável..."
                                class="w-full min-h-[40px] pl-9 pr-4 py-2 rounded-xl bg-[#090d16] border border-slate-700 focus:border-sky-400 focus:outline-none text-xs text-slate-100 placeholder-slate-500 transition">
                        </div>
                        <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[11px] text-sky-300">
                            <i data-lucide="mouse-pointer-click" class="w-3.5 h-3.5 text-sky-400 shrink-0"></i>
                            <span>Clique no <strong>nome do paciente</strong> para verificar e gerir cada sessão individualmente</span>
                        </div>
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
                            Clique em <strong class="text-sky-400">Sincronizar Google Agenda</strong> para atualizar ou navegue entre os meses nas setas superiores.
                        </p>
                    </div>
                ` : `
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs text-slate-300 border-collapse">
                            <thead>
                                <tr class="border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-[#090d16]/50">
                                    <th class="py-3 px-3">Paciente / Responsável</th>
                                    <th class="py-3 px-3 text-center">Sessões no Mês</th>
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
        const initials = p.name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase();
        const billableDatesPreview = p.billableSessions.map(s => formatDateBR(s.date)).join(', ');

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

                <!-- Paciente + Responsável (CLICÁVEL PARA ABRIR SESSÕES DO PACIENTE) -->
                <td class="py-3 px-3">
                    <div class="flex items-center gap-3">
                        <button type="button" data-open-patient-sessions="${escapeHtml(p.name)}"
                            title="Ver todas as sessões de ${escapeHtml(p.name)}"
                            class="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 hover:from-sky-500/35 hover:to-cyan-500/35 border border-sky-500/30 hover:border-sky-400 flex items-center justify-center font-mono font-bold text-xs text-sky-300 shrink-0 shadow-sm transition cursor-pointer">
                            ${escapeHtml(initials)}
                        </button>
                        <div>
                            <div class="font-bold text-slate-100 flex items-center gap-2 flex-wrap">
                                <button type="button" data-open-patient-sessions="${escapeHtml(p.name)}"
                                    title="Clique para verificar e gerenciar as sessões de ${escapeHtml(p.name)}"
                                    class="text-left font-bold text-slate-100 hover:text-sky-300 underline decoration-sky-500/40 hover:decoration-sky-300 underline-offset-4 flex items-center gap-1.5 transition cursor-pointer">
                                    <span>${escapeHtml(p.name)}</span>
                                    <i data-lucide="calendar-search" class="w-3.5 h-3.5 text-sky-400 opacity-75 group-hover:opacity-100 transition"></i>
                                </button>
                                ${p.category ? `<span class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-400">${escapeHtml(p.category)}</span>` : ''}
                            </div>
                            <div class="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                                ${p.guardian ? `<span>Resp: <strong class="text-slate-300">${escapeHtml(p.guardian)}</strong></span>` : '<span class="text-slate-600">Responsável não informado</span>'}
                                ${p.phone ? `<span class="text-slate-600">•</span><span class="font-mono text-emerald-400">${escapeHtml(p.phone)}</span>` : ''}
                            </div>
                        </div>
                    </div>
                </td>

                <!-- Sessões Faturáveis e Datas (CLICÁVEL TAMBÉM) -->
                <td class="py-3 px-3 text-center">
                    <button type="button" data-open-patient-sessions="${escapeHtml(p.name)}"
                        title="Clique para inspecionar datas, horários e status de cada sessão"
                        class="inline-flex flex-col items-center group/sess cursor-pointer hover:scale-[1.02] transition">
                        <div class="flex items-center gap-1">
                            <span class="px-2.5 py-0.5 rounded-lg bg-sky-500/10 group-hover/sess:bg-sky-500/25 border border-sky-500/25 group-hover/sess:border-sky-400/50 font-mono font-bold text-sky-300 text-xs transition">
                                ${p.sessionCount} ${p.sessionCount === 1 ? 'sessão' : 'sessões'}
                            </span>
                            ${p.exemptCount > 0 ? `<span class="px-1.5 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 font-mono text-[10px] text-purple-300" title="${p.exemptCount} falta(s)/desmarcação(ões) isenta(s)">+${p.exemptCount} isenta</span>` : ''}
                        </div>
                        <span class="text-[10px] text-slate-400 group-hover/sess:text-cyan-300 mt-1 max-w-[180px] truncate" title="${escapeHtml(billableDatesPreview || 'Nenhuma sessão faturável')}">
                            ${escapeHtml(billableDatesPreview || 'Sem sessões faturáveis')}
                        </span>
                    </button>
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
                    ` : p.billingStatus === 'isento' ? `
                        <div class="text-[10px] text-purple-400">Cortesia / Isento</div>
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

                        <!-- Botão Ver Sessões do Paciente -->
                        <button type="button" data-open-patient-sessions="${escapeHtml(p.name)}" title="Inspecionar e editar sessões de ${escapeHtml(p.name)}"
                            class="min-h-[34px] px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/35 text-sky-300 font-semibold text-xs flex items-center gap-1 transition">
                            <i data-lucide="calendar-search" class="w-3.5 h-3.5"></i>
                            <span class="hidden xl:inline">Sessões</span>
                        </button>

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
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                        <h3 class="text-sm font-bold text-slate-100">Linha do Tempo Cronológica dos Atendimentos</h3>
                        <p class="text-xs text-slate-400">Visão sequencial das sessões no mês. Clique no nome do paciente para abrir o prontuário de sessões dele ou altere o status diretamente.</p>
                    </div>
                    <span class="font-mono text-xs text-cyan-400 font-bold">${sortedSessions.length} registros no mês</span>
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
                                <div class="p-3 rounded-xl ${isIgnored ? 'bg-slate-900/50 border border-slate-800/50 opacity-60' : 'bg-[#090d16] border border-slate-800 hover:border-slate-700'} flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition">
                                    <div class="flex items-center gap-3">
                                        <div class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs font-bold text-sky-400 text-center shrink-0 min-w-[92px]">
                                            <div>${dateStr}</div>
                                            <div class="text-[10px] text-slate-400 font-normal">${timeStr}${endTimeStr ? ` - ${endTimeStr}` : ''}</div>
                                        </div>
                                        <div>
                                            <div class="font-bold text-slate-100 flex items-center gap-2 flex-wrap">
                                                ${!isIgnored ? `
                                                    <button type="button" data-open-patient-sessions="${escapeHtml(s.title)}"
                                                        class="font-bold text-slate-100 hover:text-sky-300 underline decoration-sky-500/40 underline-offset-4 flex items-center gap-1 transition cursor-pointer">
                                                        <span>${escapeHtml(s.title)}</span>
                                                        <i data-lucide="calendar-search" class="w-3.5 h-3.5 text-sky-400"></i>
                                                    </button>
                                                ` : `
                                                    <span>${escapeHtml(s.title)}</span>
                                                `}
                                                ${isIgnored ? '<span class="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-800 text-slate-400">Compromisso Não Faturável</span>' : getSessionStatusBadgeHtml(s.status)}
                                                ${s.source === 'manual' ? '<span class="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">Manual</span>' : ''}
                                            </div>
                                            <div class="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                                                ${s.htmlLink ? `<a href="${s.htmlLink}" target="_blank" class="hover:text-cyan-400 flex items-center gap-1"><i data-lucide="external-link" class="w-3 h-3"></i>Abrir no Google Calendar</a>` : '<span>Registro interno</span>'}
                                                ${s.note ? `<span class="text-slate-600">•</span><span class="text-amber-300/90 italic">${escapeHtml(s.note)}</span>` : ''}
                                            </div>
                                        </div>
                                    </div>

                                    ${!isIgnored ? `
                                        <div class="flex flex-wrap items-center gap-2 sm:justify-end">
                                            <select data-timeline-session-status="${escapeHtml(s.id)}"
                                                data-session-patient="${escapeHtml(s.title)}"
                                                data-session-date="${escapeHtml(s.dateIso)}"
                                                class="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-mono text-slate-200 focus:outline-none focus:border-sky-400 cursor-pointer">
                                                <option value="realizada" ${s.status === 'realizada' ? 'selected' : ''}>✅ Realizada (Cobrar)</option>
                                                <option value="agendada" ${s.status === 'agendada' ? 'selected' : ''}>🗓️ Agendada (Cobrar)</option>
                                                <option value="falta_cobravel" ${s.status === 'falta_cobravel' ? 'selected' : ''}>⚠️ Falta s/ Aviso (Cobrar)</option>
                                                <option value="falta_justificada" ${s.status === 'falta_justificada' ? 'selected' : ''}>🛡️ Falta Isenta (Não cobrar)</option>
                                                <option value="desmarcada" ${s.status === 'desmarcada' ? 'selected' : ''}>🚫 Desmarcada (Não cobrar)</option>
                                                <option value="excluida" ${s.status === 'excluida' ? 'selected' : ''}>🗑️ Excluir / Duplicada</option>
                                            </select>

                                            <button type="button" data-open-patient-sessions="${escapeHtml(s.title)}"
                                                class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-mono flex items-center gap-1 transition">
                                                <i data-lucide="user" class="w-3 h-3"></i>
                                                <span class="hidden md:inline">Paciente</span>
                                            </button>
                                        </div>
                                    ` : ''}
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
        const allPatientsMap = new Map();
        // Coleta todos os pacientes de todos os eventos (não apenas do mês atual)
        state.events.forEach(ev => {
            const name = normalizePatientName(ev.summary || '');
            if (name && !isIgnoredTitle(name)) {
                allPatientsMap.set(canonicalPatientKey(name), name);
            }
        });
        report.patientReports.forEach(p => {
            allPatientsMap.set(canonicalPatientKey(p.name), p.name);
        });
        Object.keys(state.patientsConfig).forEach(rawName => {
            const name = normalizePatientName(rawName);
            if (name) allPatientsMap.set(canonicalPatientKey(name), name);
        });

        const patientsList = Array.from(allPatientsMap.values()).sort((a, b) => a.localeCompare(b, 'pt-BR'));

        return `
            <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                        <h3 class="text-sm font-bold text-slate-100">Configuração de Honorários &amp; Contatos por Paciente</h3>
                        <p class="text-xs text-slate-400">Defina o valor por sessão específico, telefone de WhatsApp e nome do responsável legal. Clique no nome do paciente para ver todas as sessões dele.</p>
                    </div>
                    <div class="text-xs font-mono text-cyan-300">
                        Valor Padrão da Clínica: <strong>${formatBRL(state.config.defaultSessionPrice)}</strong>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs text-slate-300 border-collapse">
                        <thead>
                            <tr class="border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-[#090d16]/50">
                                <th class="py-2.5 px-3">Paciente (Clique p/ Sessões)</th>
                                <th class="py-2.5 px-3">Responsável Legal</th>
                                <th class="py-2.5 px-3">WhatsApp</th>
                                <th class="py-2.5 px-3 text-center">Valor Específico (R$)</th>
                                <th class="py-2.5 px-3 text-center">Classificação</th>
                                <th class="py-2.5 px-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60 font-sans">
                            ${patientsList.map((name, idx) => {
                                const conf = state.patientsConfig[name] || {};
                                const isIgnored = Boolean(conf.isIgnored);
                                const hist = getPatientFullHistory(name, false);
                                return `
                                    <tr class="hover:bg-slate-800/30 transition-colors" data-patient-conf-row="${idx}" data-patient-name="${escapeHtml(name)}">
                                        <td class="py-2.5 px-3 font-bold text-slate-100">
                                            <button type="button" data-open-patient-sessions="${escapeHtml(name)}"
                                                class="text-left font-bold text-slate-100 hover:text-sky-300 underline decoration-sky-500/40 underline-offset-4 flex items-center gap-1.5 transition cursor-pointer">
                                                <span>${escapeHtml(name)}</span>
                                                <span class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-900 border border-slate-700 text-cyan-300" title="Total de sessões registradas deste paciente">${hist.totalSessions} sess.</span>
                                            </button>
                                        </td>
                                        <td class="py-2.5 px-3">
                                            <input type="text" data-conf-field="guardian"
                                                value="${escapeHtml(conf.guardian || '')}"
                                                placeholder="Ex: Mãe / Pai..."
                                                class="w-full max-w-[180px] px-2 py-1 rounded bg-[#090d16] border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-400">
                                        </td>
                                        <td class="py-2.5 px-3 font-mono">
                                            <input type="text" data-conf-field="phone"
                                                value="${escapeHtml(conf.phone || '')}"
                                                placeholder="(35) 9..."
                                                class="w-36 px-2 py-1 rounded bg-[#090d16] border border-slate-700 text-xs text-emerald-300 focus:outline-none focus:border-cyan-400">
                                        </td>
                                        <td class="py-2.5 px-3 text-center font-mono">
                                            <input type="number" step="5" min="0" data-conf-field="price"
                                                value="${conf.customPrice !== undefined && conf.customPrice !== null ? conf.customPrice : ''}"
                                                placeholder="Padrão (${state.config.defaultSessionPrice})"
                                                class="w-28 px-2 py-1 rounded bg-[#090d16] border border-slate-700 text-xs text-center text-cyan-300 focus:outline-none focus:border-cyan-400">
                                        </td>
                                        <td class="py-2.5 px-3 text-center">
                                            <label class="inline-flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-400">
                                                <input type="checkbox" data-conf-field="ignore" ${isIgnored ? 'checked' : ''}
                                                    class="rounded border-slate-700 text-rose-500 focus:ring-0">
                                                <span>Ignorar do Faturamento</span>
                                            </label>
                                        </td>
                                        <td class="py-2.5 px-3 text-center">
                                            <div class="flex items-center justify-center gap-1.5">
                                                <button type="button" data-conf-save-row="${idx}"
                                                    class="px-3 py-1 rounded bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold text-xs transition">
                                                    Salvar
                                                </button>
                                                <button type="button" data-open-patient-sessions="${escapeHtml(name)}" title="Ver sessões de ${escapeHtml(name)}"
                                                    class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs transition">
                                                    <i data-lucide="calendar-search" class="w-3.5 h-3.5"></i>
                                                </button>
                                            </div>
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
    // 9. MODAIS INTERATIVOS (INCLUINDO PRONTUÁRIO DE SESSÕES DO PACIENTE)
    // =========================================================================

    /**
     * MODAL NOVO: PRONTUÁRIO E DETALHAMENTO DE SESSÕES POR PACIENTE
     * Aberto ao clicar no nome de qualquer paciente!
     */
    function renderPatientSessionsModal(report) {
        if (!state.activePatientModal) {
            return `<div id="modal-agenda-patient-sessions" class="hidden"></div>`;
        }

        const pName = normalizePatientName(state.activePatientModal);
        const cKey = canonicalPatientKey(pName);
        const pConf = state.patientsConfig[pName] || {};
        const unitPrice = (pConf.customPrice !== undefined && pConf.customPrice !== null && pConf.customPrice !== '')
            ? Number(pConf.customPrice)
            : Number(state.config.defaultSessionPrice);

        // Sessões do paciente no mês selecionado (incluindo excluídas se o toggle estiver ativo)
        const monthSessionsAll = collectUnifiedSessions(state.selectedYear, state.selectedMonth, state.patientModalShowDeleted)
            .filter(s => s.canonicalName === cKey);

        const activeMonthSessions = monthSessionsAll.filter(s => !s.isDeleted);
        const billableMonthSessions = activeMonthSessions.filter(s => s.isBillable);
        const realizedMonthSessions = activeMonthSessions.filter(s => s.status === 'realizada' || s.status === 'falta_cobravel');
        const scheduledMonthSessions = activeMonthSessions.filter(s => s.status === 'agendada');
        const exemptMonthSessions = activeMonthSessions.filter(s => s.isExempt);

        const totalMonthBill = billableMonthSessions.length * unitPrice;
        const statusKey = `${report.targetKey}_${pName}`;
        const mStat = state.monthlyStatus[statusKey] || {};
        const currentBillingStatus = mStat.status || 'pendente';

        // Histórico completo do paciente em todos os meses
        const fullHistory = getPatientFullHistory(pName, state.patientModalShowDeleted);
        const initials = pName.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase();
        const currentMonthLabel = `${getMonthName(state.selectedMonth)} de ${state.selectedYear}`;

        return `
            <div id="modal-agenda-patient-sessions" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">

                    <!-- Cabeçalho do Paciente -->
                    <div class="px-5 py-4 bg-[#090d16] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                        <div class="flex items-center gap-3">
                            <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500/25 to-cyan-500/20 border border-sky-500/40 flex items-center justify-center font-mono font-bold text-sm text-sky-300 shrink-0">
                                ${escapeHtml(initials)}
                            </div>
                            <div>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <h3 class="text-base sm:text-lg font-bold text-slate-100">${escapeHtml(pName)}</h3>
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-500/15 text-sky-300 border border-sky-500/30">
                                        ${escapeHtml(pConf.category || 'Neuropsicologia')}
                                    </span>
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-900 text-cyan-300 border border-slate-700">
                                        ${formatBRL(unitPrice)} / sessão
                                    </span>
                                </div>
                                <p class="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                                    <span>Responsável: <strong class="text-slate-200">${escapeHtml(pConf.guardian || 'Não informado')}</strong></span>
                                    <span>•</span>
                                    <span>WhatsApp: <strong class="font-mono text-emerald-400">${escapeHtml(pConf.phone || 'Não cadastrado')}</strong></span>
                                    <span>•</span>
                                    <span>Histórico Total: <strong class="font-mono text-cyan-300">${fullHistory.totalSessions} sessões</strong></span>
                                </p>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <!-- Navegador Rápido de Mês dentro do Modal -->
                            <div class="inline-flex items-center bg-[#0f172a] border border-slate-700 rounded-xl p-1 text-xs">
                                <button type="button" id="btn-pmodal-prev-month" title="Mês anterior"
                                    class="min-h-[30px] min-w-[30px] rounded-lg hover:bg-slate-800 text-slate-300 flex items-center justify-center">
                                    <i data-lucide="chevron-left" class="w-4 h-4"></i>
                                </button>
                                <span class="px-2.5 font-mono font-bold text-slate-200 text-[11px] whitespace-nowrap">
                                    ${getMonthName(state.selectedMonth)}/${state.selectedYear}
                                </span>
                                <button type="button" id="btn-pmodal-next-month" title="Próximo mês"
                                    class="min-h-[30px] min-w-[30px] rounded-lg hover:bg-slate-800 text-slate-300 flex items-center justify-center">
                                    <i data-lucide="chevron-right" class="w-4 h-4"></i>
                                </button>
                            </div>

                            <button type="button" id="btn-close-patient-sessions-modal" title="Fechar (Esc)"
                                class="min-h-[36px] min-w-[36px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition">
                                <i data-lucide="x" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>

                    <!-- KPIs do Paciente no Mês + Abas (Mês Selecionado vs Histórico Completo) -->
                    <div class="px-5 pt-3 pb-2 bg-[#0b111e] border-b border-slate-800/80 space-y-3">
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            <div class="p-3 rounded-xl bg-[#090d16] border border-slate-800/90">
                                <div class="text-[10px] font-mono uppercase text-slate-400">Sessões Faturáveis (${getMonthName(state.selectedMonth)})</div>
                                <div class="text-lg font-bold font-mono text-sky-300 mt-0.5">${billableMonthSessions.length} <span class="text-xs font-normal text-slate-400">sessões</span></div>
                                <div class="text-[10px] text-slate-500">${realizedMonthSessions.length} realizadas • ${scheduledMonthSessions.length} agendadas</div>
                            </div>
                            <div class="p-3 rounded-xl bg-[#090d16] border border-slate-800/90">
                                <div class="text-[10px] font-mono uppercase text-slate-400">Total a Cobrar no Mês</div>
                                <div class="text-lg font-bold font-mono text-emerald-300 mt-0.5">${formatBRL(totalMonthBill)}</div>
                                <div class="text-[10px] text-slate-500">${billableMonthSessions.length} × ${formatBRL(unitPrice)}</div>
                            </div>
                            <div class="p-3 rounded-xl bg-[#090d16] border border-slate-800/90">
                                <div class="text-[10px] font-mono uppercase text-slate-400">Faltas Isentas / Desmarcadas</div>
                                <div class="text-lg font-bold font-mono text-purple-300 mt-0.5">${exemptMonthSessions.length}</div>
                                <div class="text-[10px] text-slate-500">Não cobradas no fechamento</div>
                            </div>
                            <div class="p-3 rounded-xl bg-[#090d16] border border-slate-800/90">
                                <div class="text-[10px] font-mono uppercase text-slate-400 mb-1">Status Financeiro (${getMonthName(state.selectedMonth)})</div>
                                <select id="pmodal-status-select" data-pmodal-patient="${escapeHtml(pName)}"
                                    class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-slate-100 focus:outline-none focus:border-sky-400">
                                    <option value="pendente" ${currentBillingStatus === 'pendente' ? 'selected' : ''}>🟡 Pendente</option>
                                    <option value="cobrado" ${currentBillingStatus === 'cobrado' ? 'selected' : ''}>🔵 Cobrado</option>
                                    <option value="pago" ${currentBillingStatus === 'pago' ? 'selected' : ''}>🟢 Pago</option>
                                    <option value="isento" ${currentBillingStatus === 'isento' ? 'selected' : ''}>🟣 Isento / Cortesia</option>
                                </select>
                            </div>
                        </div>

                        <!-- Sub-navegação do Modal: Sessões do Mês vs Histórico Completo -->
                        <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <div class="flex items-center gap-2">
                                <button type="button" data-pmodal-tab="month"
                                    class="px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${state.patientModalTab === 'month' ? 'bg-sky-500/20 border border-sky-400/50 text-sky-200' : 'text-slate-400 hover:text-slate-200'}">
                                    <i data-lucide="calendar-days" class="w-3.5 h-3.5"></i>
                                    <span>Sessões em ${currentMonthLabel} (${activeMonthSessions.length})</span>
                                </button>
                                <button type="button" data-pmodal-tab="history"
                                    class="px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${state.patientModalTab === 'history' ? 'bg-sky-500/20 border border-sky-400/50 text-sky-200' : 'text-slate-400 hover:text-slate-200'}">
                                    <i data-lucide="history" class="w-3.5 h-3.5"></i>
                                    <span>Histórico Completo Todos os Meses (${fullHistory.totalSessions})</span>
                                </button>
                            </div>

                            <label class="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 cursor-pointer">
                                <input type="checkbox" id="chk-pmodal-show-deleted" ${state.patientModalShowDeleted ? 'checked' : ''}
                                    class="rounded border-slate-700 text-sky-500">
                                <span>Mostrar sessões excluídas/ocultas</span>
                            </label>
                        </div>
                    </div>

                    <!-- Corpo Rolável com a Lista de Sessões do Paciente -->
                    <div class="p-5 overflow-y-auto flex-1 space-y-4">
                        ${state.patientModalTab === 'history' ? renderPatientHistoryTabContent(fullHistory, unitPrice) : renderPatientMonthTabContent(pName, monthSessionsAll, currentMonthLabel)}
                    </div>

                    <!-- Rodapé de Ações Rápidas do Paciente -->
                    <div class="px-5 py-3.5 bg-[#090d16] border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <button type="button" id="btn-pmodal-add-session" data-pmodal-patient="${escapeHtml(pName)}"
                            class="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 font-semibold text-xs flex items-center gap-1.5 transition">
                            <i data-lucide="plus-circle" class="w-4 h-4"></i>
                            <span>+ Nova Sessão para ${escapeHtml(pName)}</span>
                        </button>

                        <div class="flex flex-wrap items-center gap-2">
                            <button type="button" id="btn-pmodal-whatsapp" data-pmodal-patient="${escapeHtml(pName)}"
                                class="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-600/15">
                                <i data-lucide="message-circle" class="w-4 h-4"></i>
                                <span>Cobrar / Demonstrativo WhatsApp</span>
                            </button>

                            <button type="button" id="btn-pmodal-receipt" data-pmodal-patient="${escapeHtml(pName)}"
                                class="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition">
                                <i data-lucide="receipt" class="w-4 h-4"></i>
                                <span>Emitir Recibo (${getMonthName(state.selectedMonth)})</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        `;
    }

    function renderPatientMonthTabContent(pName, monthSessions, currentMonthLabel) {
        if (monthSessions.length === 0) {
            return `
                <div class="text-center py-10 space-y-2 bg-[#090d16]/60 border border-slate-800/80 rounded-2xl">
                    <i data-lucide="calendar-x" class="w-8 h-8 text-slate-500 mx-auto"></i>
                    <p class="text-sm font-semibold text-slate-300">Nenhuma sessão encontrada para ${escapeHtml(pName)} em ${escapeHtml(currentMonthLabel)}.</p>
                    <p class="text-xs text-slate-500">Use as setas de mês no topo da janela ou clique em "+ Nova Sessão" abaixo.</p>
                </div>
            `;
        }

        return `
            <div class="space-y-2.5">
                ${monthSessions.map((s, idx) => {
                    const weekday = s.date.toLocaleDateString('pt-BR', { weekday: 'long' });
                    const dateBR = formatFullDateBR(s.date);
                    const timeStr = formatTimeBR(s.date);
                    const endTimeStr = s.end ? formatTimeBR(s.end) : '';

                    return `
                        <div class="p-3.5 rounded-xl ${s.isDeleted ? 'bg-rose-950/20 border border-rose-500/30 opacity-65' : s.isExempt ? 'bg-slate-900/70 border border-slate-800/80' : 'bg-[#090d16] border border-slate-800 hover:border-sky-500/40'} flex flex-col md:flex-row md:items-center justify-between gap-3 transition">
                            <div class="flex items-start sm:items-center gap-3">
                                <div class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs font-bold text-sky-400 flex items-center justify-center shrink-0">
                                    #${idx + 1}
                                </div>
                                <div>
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <span class="font-bold text-slate-100 text-xs sm:text-sm capitalize">${escapeHtml(weekday)}, ${dateBR}</span>
                                        <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300">
                                            ${timeStr}${endTimeStr ? ` – ${endTimeStr}` : ''}
                                        </span>
                                        ${getSessionStatusBadgeHtml(s.status)}
                                        ${s.source === 'manual' ? '<span class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">Manual</span>' : '<span class="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800">Google Agenda</span>'}
                                    </div>
                                    <div class="flex flex-wrap items-center gap-2 mt-1.5">
                                        <input type="text"
                                            data-pmodal-session-note="${escapeHtml(s.id)}"
                                            data-session-patient="${escapeHtml(s.title)}"
                                            data-session-date="${escapeHtml(s.dateIso)}"
                                            value="${escapeHtml(s.note || '')}"
                                            placeholder="Adicionar anotação da sessão (ex: Remarcada, Devolutiva, Atestado)..."
                                            class="w-full sm:w-72 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 focus:border-cyan-400 focus:outline-none text-[11px] text-slate-200 placeholder-slate-600">
                                        ${s.htmlLink ? `<a href="${s.htmlLink}" target="_blank" class="text-[11px] font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"><i data-lucide="external-link" class="w-3 h-3"></i>Ver no Calendar</a>` : ''}
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center gap-2 self-end md:self-center shrink-0">
                                <select data-pmodal-session-status="${escapeHtml(s.id)}"
                                    data-session-patient="${escapeHtml(s.title)}"
                                    data-session-date="${escapeHtml(s.dateIso)}"
                                    class="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-400 cursor-pointer">
                                    <option value="realizada" ${s.status === 'realizada' ? 'selected' : ''}>✅ Realizada (Faturar)</option>
                                    <option value="agendada" ${s.status === 'agendada' ? 'selected' : ''}>🗓️ Agendada (Faturar)</option>
                                    <option value="falta_cobravel" ${s.status === 'falta_cobravel' ? 'selected' : ''}>⚠️ Falta s/ Aviso (Faturar)</option>
                                    <option value="falta_justificada" ${s.status === 'falta_justificada' ? 'selected' : ''}>🛡️ Falta Isenta (Não cobrar)</option>
                                    <option value="desmarcada" ${s.status === 'desmarcada' ? 'selected' : ''}>🚫 Desmarcada (Não cobrar)</option>
                                    <option value="excluida" ${s.status === 'excluida' ? 'selected' : ''}>🗑️ Excluir / Duplicada</option>
                                </select>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function renderPatientHistoryTabContent(fullHistory, unitPrice) {
        if (fullHistory.monthsList.length === 0) {
            return `<div class="text-center py-8 text-xs text-slate-500">Nenhum histórico encontrado para este paciente.</div>`;
        }

        return `
            <div class="space-y-4">
                ${fullHistory.monthsList.map(mGrp => {
                    const statusKey = `${mGrp.ym}_${fullHistory.patientName}`;
                    const mStat = (state.monthlyStatus[statusKey] && state.monthlyStatus[statusKey].status) || 'pendente';
                    const monthTotalBRL = mGrp.billableCount * unitPrice;

                    return `
                        <div class="p-4 rounded-xl bg-[#090d16] border border-slate-800 space-y-2.5">
                            <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                                <div class="flex items-center gap-2">
                                    <span class="font-mono font-bold text-sm text-sky-300">${escapeHtml(mGrp.label)}</span>
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-900 border border-slate-700 text-cyan-300">
                                        ${mGrp.billableCount} faturáveis (${formatBRL(monthTotalBRL)})
                                    </span>
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${mStat === 'pago' ? 'bg-emerald-500/15 text-emerald-300' : mStat === 'cobrado' ? 'bg-sky-500/15 text-sky-300' : 'bg-amber-500/15 text-amber-300'}">
                                        ${escapeHtml(mStat)}
                                    </span>
                                </div>
                                <button type="button" data-pmodal-jump-month="${mGrp.year}-${mGrp.month}"
                                    class="text-xs font-mono text-sky-400 hover:text-sky-300 underline">
                                    Abrir este mês →
                                </button>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                ${mGrp.sessions.map(s => `
                                    <div class="px-3 py-2 rounded-lg bg-slate-900/70 border border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                                        <div>
                                            <span class="font-mono font-bold text-slate-200">${formatFullDateBR(s.date)}</span>
                                            <span class="text-slate-400 font-mono text-[11px] ml-1">${formatTimeBR(s.date)}</span>
                                        </div>
                                        ${getSessionStatusBadgeHtml(s.status)}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function openPatientSessionsModal(patientName) {
        if (!patientName) return;
        state.activePatientModal = normalizePatientName(patientName);
        render();
    }

    function closePatientSessionsModal() {
        state.activePatientModal = null;
        render();
    }

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

                        <div class="p-3.5 rounded-xl bg-[#090d16] border border-slate-800 space-y-2">
                            <span class="font-bold text-slate-300 flex items-center gap-1.5">
                                <i data-lucide="terminal" class="w-4 h-4 text-amber-400"></i>
                                Opção 3: Executar Atualização via Terminal
                            </span>
                            <div class="flex items-center gap-2">
                                <input type="text" readonly value="powershell -ExecutionPolicy Bypass -File scripts/sync-agenda-vault.ps1" id="input-sync-cmd-copy"
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

                    <div>
                        <div class="flex items-center justify-between text-slate-400 font-mono text-[11px] mb-1">
                            <span>Mensagem Formatada (Acolhedora &amp; Completa):</span>
                            <span class="text-slate-500">Editável antes do envio</span>
                        </div>
                        <textarea id="wa-modal-textarea" rows="9"
                            class="w-full p-3 rounded-xl bg-[#090d16] border border-slate-700 font-sans text-xs text-slate-200 leading-relaxed focus:border-emerald-400 focus:outline-none transition"></textarea>
                    </div>

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
                            <div class="text-[11px] font-mono uppercase font-bold text-slate-700">Discriminação Detalhada dos Atendimentos Faturados:</div>
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
                                <option value="realizada">✅ Sessão Realizada (Cobrável)</option>
                                <option value="agendada">🗓️ Sessão Agendada (Cobrável)</option>
                                <option value="falta_cobravel">⚠️ Falta sem Aviso Prévio (Cobrável)</option>
                                <option value="falta_justificada">🛡️ Falta Justificada (Não cobrar)</option>
                                <option value="desmarcada">🚫 Desmarcada / Cancelada (Não cobrar)</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-slate-400 font-mono text-[11px] mb-1">Observação (Opcional)</label>
                            <input type="text" id="manual-note" placeholder="Ex: Reposição de sessão, Devolutiva..."
                                class="w-full px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-slate-200">
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
    // 10. EVENT LISTENERS E INTERATIVIDADE
    // =========================================================================
    function attachEventListeners(report) {
        const root = document.getElementById('tab-panel-agenda');
        if (!root) return;

        const goPrevMonth = () => {
            if (state.selectedMonth === 0) {
                state.selectedMonth = 11;
                state.selectedYear--;
            } else {
                state.selectedMonth--;
            }
            render();
        };

        const goNextMonth = () => {
            if (state.selectedMonth === 11) {
                state.selectedMonth = 0;
                state.selectedYear++;
            } else {
                state.selectedMonth++;
            }
            render();
        };

        // --- Navegação de Mês ---
        const btnPrev = document.getElementById('btn-agenda-prev-month');
        if (btnPrev) btnPrev.addEventListener('click', goPrevMonth);

        const btnNext = document.getElementById('btn-agenda-next-month');
        if (btnNext) btnNext.addEventListener('click', goNextMonth);

        const btnToday = document.getElementById('btn-agenda-today');
        if (btnToday) {
            btnToday.addEventListener('click', () => {
                const now = new Date();
                state.selectedYear = now.getFullYear();
                state.selectedMonth = now.getMonth();
                render();
            });
        }

        // --- Escopo de Apuração (Mês Completo vs Apenas Realizadas) ---
        const selScope = document.getElementById('select-agenda-billing-scope');
        if (selScope) {
            selScope.addEventListener('change', (e) => {
                state.config.billingScope = e.target.value;
                saveState();
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

        // --- Botão Higienizar / Auditar Duplicatas ---
        const btnDedup = document.getElementById('btn-agenda-dedup');
        if (btnDedup) {
            btnDedup.addEventListener('click', () => {
                deduplicateAllEvents(true);
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

        // --- Clique no Nome do Paciente (Abre Modal de Sessões do Paciente) ---
        root.querySelectorAll('[data-open-patient-sessions]').forEach(btn => {
            btn.addEventListener('click', () => {
                const pName = btn.getAttribute('data-open-patient-sessions');
                openPatientSessionsModal(pName);
            });
        });

        // --- Controles de Dentro do Modal de Sessões do Paciente ---
        const modalPatient = document.getElementById('modal-agenda-patient-sessions');
        if (modalPatient && state.activePatientModal) {
            modalPatient.addEventListener('click', (e) => {
                if (e.target === modalPatient) closePatientSessionsModal();
            });

            const btnClosePModal = document.getElementById('btn-close-patient-sessions-modal');
            if (btnClosePModal) btnClosePModal.addEventListener('click', closePatientSessionsModal);

            const btnPModalPrev = document.getElementById('btn-pmodal-prev-month');
            if (btnPModalPrev) btnPModalPrev.addEventListener('click', goPrevMonth);

            const btnPModalNext = document.getElementById('btn-pmodal-next-month');
            if (btnPModalNext) btnPModalNext.addEventListener('click', goNextMonth);

            modalPatient.querySelectorAll('[data-pmodal-tab]').forEach(tBtn => {
                tBtn.addEventListener('click', () => {
                    state.patientModalTab = tBtn.getAttribute('data-pmodal-tab');
                    render();
                });
            });

            modalPatient.querySelectorAll('[data-pmodal-jump-month]').forEach(jBtn => {
                jBtn.addEventListener('click', () => {
                    const [y, m] = jBtn.getAttribute('data-pmodal-jump-month').split('-').map(Number);
                    state.selectedYear = y;
                    state.selectedMonth = m;
                    state.patientModalTab = 'month';
                    render();
                });
            });

            const chkShowDel = document.getElementById('chk-pmodal-show-deleted');
            if (chkShowDel) {
                chkShowDel.addEventListener('change', (e) => {
                    state.patientModalShowDeleted = e.target.checked;
                    render();
                });
            }

            const pmodalStatusSel = document.getElementById('pmodal-status-select');
            if (pmodalStatusSel) {
                pmodalStatusSel.addEventListener('change', (e) => {
                    const pName = pmodalStatusSel.getAttribute('data-pmodal-patient');
                    const newStatus = e.target.value;
                    const statusKey = `${report.targetKey}_${pName}`;
                    if (!state.monthlyStatus[statusKey]) state.monthlyStatus[statusKey] = {};
                    state.monthlyStatus[statusKey].status = newStatus;
                    if (newStatus === 'pago') {
                        state.monthlyStatus[statusKey].paymentDate = new Date().toISOString().split('T')[0];
                    }
                    saveState();
                    render();
                    if (global.VaultCore) global.VaultCore.toast(`Status de ${pName} atualizado para ${newStatus.toUpperCase()}`, 'success');
                });
            }

            // Alterar status de uma sessão individual dentro do modal do paciente
            modalPatient.querySelectorAll('[data-pmodal-session-status]').forEach(sel => {
                sel.addEventListener('change', (e) => {
                    const sId = sel.getAttribute('data-pmodal-session-status');
                    const pName = sel.getAttribute('data-session-patient');
                    const dateIso = sel.getAttribute('data-session-date');
                    const newStatus = e.target.value;
                    setSessionOverride(sId, pName, dateIso, { status: newStatus });
                    render();
                    if (global.VaultCore) {
                        global.VaultCore.toast(`Status da sessão atualizado para "${newStatus}". Faturamento recalculado!`, 'info');
                    }
                });
            });

            // Alterar anotação de uma sessão individual dentro do modal do paciente
            modalPatient.querySelectorAll('[data-pmodal-session-note]').forEach(inp => {
                inp.addEventListener('change', (e) => {
                    const sId = inp.getAttribute('data-pmodal-session-note');
                    const pName = inp.getAttribute('data-session-patient');
                    const dateIso = inp.getAttribute('data-session-date');
                    setSessionOverride(sId, pName, dateIso, { note: e.target.value.trim() });
                    if (global.VaultCore) {
                        global.VaultCore.toast('Observação da sessão salva.', 'success');
                    }
                });
            });

            // Botão + Nova Sessão pré-preenchida para o paciente
            const btnPModalAdd = document.getElementById('btn-pmodal-add-session');
            if (btnPModalAdd) {
                btnPModalAdd.addEventListener('click', () => {
                    const pName = btnPModalAdd.getAttribute('data-pmodal-patient');
                    openManualModalForPatient(pName);
                });
            }

            // Botão WhatsApp direto do modal do paciente
            const btnPModalWa = document.getElementById('btn-pmodal-whatsapp');
            if (btnPModalWa) {
                btnPModalWa.addEventListener('click', () => {
                    const pName = btnPModalWa.getAttribute('data-pmodal-patient');
                    openWhatsAppModal(pName, report);
                });
            }

            // Botão Recibo direto do modal do paciente
            const btnPModalRec = document.getElementById('btn-pmodal-receipt');
            if (btnPModalRec) {
                btnPModalRec.addEventListener('click', () => {
                    const pName = btnPModalRec.getAttribute('data-pmodal-patient');
                    openReceiptModal(pName, report);
                });
            }
        }

        // --- Alterar Status de Sessão na Linha do Tempo Cronológica ---
        root.querySelectorAll('[data-timeline-session-status]').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const sId = sel.getAttribute('data-timeline-session-status');
                const pName = sel.getAttribute('data-session-patient');
                const dateIso = sel.getAttribute('data-session-date');
                setSessionOverride(sId, pName, dateIso, { status: e.target.value });
                render();
                if (global.VaultCore) {
                    global.VaultCore.toast(`Sessão de ${pName} atualizada para "${e.target.value}".`, 'info');
                }
            });
        });

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
                openManualModalForPatient('');
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
                const pName = normalizePatientName(document.getElementById('manual-patient').value);
                const dateVal = document.getElementById('manual-date').value;
                const timeVal = document.getElementById('manual-time').value;
                const statusVal = document.getElementById('manual-status').value;
                const noteVal = (document.getElementById('manual-note').value || '').trim();

                if (!pName || !dateVal) return;

                const fullDate = new Date(`${dateVal}T${timeVal || '10:00'}:00`);
                const newId = 'manual_' + Date.now();
                state.manualSessions.push({
                    id: newId,
                    patient: pName,
                    date: fullDate.toISOString(),
                    status: statusVal,
                    note: noteVal
                });
                state.manualSessions = cleanManualSessions(state.manualSessions);
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

        // --- Botão de Salvar Configurações Individuais de Pacientes (por linha segura) ---
        root.querySelectorAll('[data-conf-save-row]').forEach(btn => {
            btn.addEventListener('click', () => {
                const rowIdx = btn.getAttribute('data-conf-save-row');
                const row = root.querySelector(`[data-patient-conf-row="${rowIdx}"]`);
                if (!row) return;
                const pName = row.getAttribute('data-patient-name');
                const guardianInp = row.querySelector('[data-conf-field="guardian"]');
                const phoneInp = row.querySelector('[data-conf-field="phone"]');
                const priceInp = row.querySelector('[data-conf-field="price"]');
                const ignoreChk = row.querySelector('[data-conf-field="ignore"]');

                if (!state.patientsConfig[pName]) state.patientsConfig[pName] = {};

                if (guardianInp) state.patientsConfig[pName].guardian = guardianInp.value.trim();
                if (phoneInp) state.patientsConfig[pName].phone = phoneInp.value.trim();
                if (priceInp) {
                    const v = priceInp.value.trim();
                    state.patientsConfig[pName].customPrice = v !== '' ? parseFloat(v) : null;
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

    function openManualModalForPatient(patientName) {
        const modal = document.getElementById('modal-agenda-manual');
        if (!modal) return;
        modal.classList.remove('hidden');
        const patInp = document.getElementById('manual-patient');
        if (patInp) patInp.value = patientName || '';
        const dateInp = document.getElementById('manual-date');
        if (dateInp) {
            const mStr = String(state.selectedMonth + 1).padStart(2, '0');
            const today = new Date();
            const dStr = (today.getFullYear() === state.selectedYear && today.getMonth() === state.selectedMonth)
                ? String(today.getDate()).padStart(2, '0')
                : '01';
            dateInp.value = `${state.selectedYear}-${mStr}-${dStr}`;
        }
    }

    // =========================================================================
    // 11. LÓGICA DE MODAIS DE WHATSAPP E RECIBO
    // =========================================================================
    function openWhatsAppModal(patientName, report) {
        const cKey = canonicalPatientKey(patientName);
        const p = report.patientReports.find(item => item.canonicalKey === cKey || item.name === patientName);
        if (!p) return;

        const modal = document.getElementById('modal-agenda-whatsapp');
        const subtitle = document.getElementById('wa-modal-subtitle');
        const recipientInp = document.getElementById('wa-modal-input-recipient');
        const phoneInp = document.getElementById('wa-modal-input-phone');
        const textarea = document.getElementById('wa-modal-textarea');

        if (!modal) return;

        subtitle.textContent = `${p.name} • ${p.sessionCount} sessões faturáveis em ${getMonthName(state.selectedMonth)} de ${state.selectedYear}`;
        recipientInp.value = p.guardian || p.name;
        phoneInp.value = p.phone || '';

        const datesFormatted = p.billableSessions.map(s => {
            const dateStr = formatDateBR(s.date);
            const timeStr = formatTimeBR(s.date);
            const extra = s.status === 'falta_cobravel' ? ' (Falta sem aviso prévio)' : '';
            return `• ${dateStr} (${formatWeekdayBR(s.date)}) às ${timeStr}${extra}`;
        }).join('\n');

        const tpl = state.config.whatsappTemplate;
        const msg = tpl
            .replace(/{paciente}/g, p.name)
            .replace(/{responsavel}/g, recipientInp.value)
            .replace(/{mes_ano}/g, `${getMonthName(state.selectedMonth)}/${state.selectedYear}`)
            .replace(/{qtd_sessoes}/g, p.sessionCount)
            .replace(/{lista_datas}/g, datesFormatted || '• Nenhuma sessão faturável no período')
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
                } catch (_) {
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
                    if (state.monthlyStatus[statusKey].status !== 'pago') {
                        state.monthlyStatus[statusKey].status = 'cobrado';
                    }
                    saveState();
                }

                const phone = phoneInp.value.replace(/\D/g, '');
                if (phone) {
                    if (!state.patientsConfig[p.name]) state.patientsConfig[p.name] = {};
                    state.patientsConfig[p.name].phone = phoneInp.value.trim();
                    if (recipientInp.value.trim() && recipientInp.value.trim() !== p.name) {
                        state.patientsConfig[p.name].guardian = recipientInp.value.trim();
                    }
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
        const cKey = canonicalPatientKey(patientName);
        const p = report.patientReports.find(item => item.canonicalKey === cKey || item.name === patientName);
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
        const receiverText = isPaid ? 'Recebi de' : 'Declaro para os devidos fins a apuração de honorários referentes a';
        const quittanceText = isPaid
            ? 'dando plena e rasa quitação pelo presente documento referente aos atendimentos prestados no período.'
            : 'aguardando a devida liquidação dos honorários clínicos profissionais acordados.';

        const guardianMention = p.guardian ? ` (responsável financeiro: ${escapeHtml(p.guardian)})` : '';

        docBody.innerHTML = `
            <p>
                ${receiverText} <strong>${escapeHtml(p.name)}</strong>${guardianMention}, a importância de
                <strong class="text-base">${formatBRL(p.totalToBill)}</strong>, referente a
                <strong>${p.sessionCount} (${numberToWords(p.sessionCount)})</strong> sessões de atendimento neuropsicológico / intervenção clínica no mês de
                <strong>${getMonthName(state.selectedMonth)} de ${state.selectedYear}</strong>, ${quittanceText}
            </p>
        `;

        docSessions.innerHTML = p.billableSessions.map((s, idx) => {
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
                    `Sessões:\n${p.billableSessions.map((s, i) => `${i + 1}. ${formatDateBR(s.date)} às ${formatTimeBR(s.date)}`).join('\n')}\n\n` +
                    `Guaranésia - MG, ${dateFormattedExtenso}\n` +
                    `Deo Magalhães • Neuropsicólogo CRP 04/42784`;
                try {
                    await navigator.clipboard.writeText(text);
                    if (global.VaultCore) global.VaultCore.toast('Recibo copiado para a área de transferência!', 'success');
                } catch (_) {
                    if (global.VaultCore) global.VaultCore.toast('Texto selecionado para cópia manual.', 'info');
                }
            };
        }
    }

    // =========================================================================
    // 12. EXPORTAÇÃO CSV DE ALTA PRECISÃO (EXCEL COM BOM UTF-8)
    // =========================================================================
    function exportReportCsv(report) {
        const headers = [
            'Paciente',
            'Responsável',
            'Telefone',
            'Sessões Faturáveis',
            'Sessões Realizadas',
            'Sessões Agendadas',
            'Faltas Isentas/Desmarcadas',
            'Valor Unitário (BRL)',
            'Total a Cobrar (BRL)',
            'Status de Pagamento',
            'Datas das Sessões Faturáveis',
            'Mês/Ano de Competência'
        ];

        const rows = report.patientReports.map(p => {
            const dates = p.billableSessions.map(s => `${formatDateBR(s.date)} ${formatTimeBR(s.date)}`).join(' | ');
            return [
                `"${p.name.replace(/"/g, '""')}"`,
                `"${(p.guardian || '').replace(/"/g, '""')}"`,
                `"${(p.phone || '').replace(/"/g, '""')}"`,
                p.sessionCount,
                p.realizedCount,
                p.scheduledCount,
                p.exemptCount,
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
    // 13. UTILITÁRIOS
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
        const words = ['zero', 'uma', 'duas', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze'];
        return words[num] || String(num);
    }

    // =========================================================================
    // 14. INICIALIZAÇÃO DO MÓDULO
    // =========================================================================
    let isInitialized = false;

    function init() {
        loadState();

        // Importa o Seed integrado substituindo eventos fantasmas antigos de séries recorrentes substituídas
        if (window.__VAULT_AGENDA_SEED__ && Array.isArray(window.__VAULT_AGENDA_SEED__.events) && window.__VAULT_AGENDA_SEED__.events.length > 0) {
            importEvents(window.__VAULT_AGENDA_SEED__.events, window.__VAULT_AGENDA_SEED__.lastSyncedAt, 'Cache Integrado', false, true);
        } else {
            render();
        }

        // Sincronização silenciosa via servidor local ou cache JSON
        syncFromGoogleCalendar(false);

        if (!isInitialized) {
            isInitialized = true;

            window.addEventListener('vault:unlocked', () => {
                loadState();
                if (window.__VAULT_AGENDA_SEED__ && Array.isArray(window.__VAULT_AGENDA_SEED__.events) && window.__VAULT_AGENDA_SEED__.events.length > 0) {
                    importEvents(window.__VAULT_AGENDA_SEED__.events, window.__VAULT_AGENDA_SEED__.lastSyncedAt, 'Cache Integrado', false, true);
                } else {
                    render();
                }
            });

            window.addEventListener('vault:tab-changed', (e) => {
                if (e.detail && e.detail.tab === 'agenda') {
                    render();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && state.activePatientModal) {
                    closePatientSessionsModal();
                }
            });
        }
    }

    global.VaultTabAgenda = {
        init,
        render,
        syncFromGoogleCalendar,
        importEvents,
        deduplicateAllEvents,
        openPatientSessionsModal,
        closePatientSessionsModal,
        getMonthlyReport,
        getPatientFullHistory
    };

})(window);
