/**
 * NEXUS VAULT — Core Cryptographic, Storage & Sync Engine
 * Arquitetura 100% Client-Side (LocalStorage) • Zero-Backend • FIPS 180-4 SHA-256
 */
(function (global) {
    'use strict';

    const AUTH_SALT_PREFIX = 'dm_vault_auth_v1::';
    const DEFAULT_PIN_HASH = '354df90787ad93580dcc0ef9394ff7a37ec25f3388014fb210b3fb9431d023e5';
    const CUSTOM_PIN_KEY = 'dm_vault_custom_pin_hash';
    const SESSION_AUTH_KEY = 'dm_vault_auth_token';
    const SESSION_COMPAT_KEY = 'dm_vault_session';

    const STORAGE_KEYS = {
        BONSAI: 'dm_vault_bonsai',
        VIOLA: 'dm_vault_viola',
        DESFUSAO: 'dm_vault_desfusao',
        CONTOS: 'dm_vault_contos',
        INDEPENDENCIA: 'dm_vault_independencia',
        PSICOMETRIA: 'dm_vault_psicometria',
        PROFILE: 'dm_vault_profile'
    };

    const ALL_MANAGED_KEYS = [
        STORAGE_KEYS.BONSAI,
        STORAGE_KEYS.VIOLA,
        STORAGE_KEYS.DESFUSAO,
        STORAGE_KEYS.CONTOS,
        STORAGE_KEYS.INDEPENDENCIA,
        STORAGE_KEYS.PSICOMETRIA,
        STORAGE_KEYS.PROFILE
    ];

    // =========================================================================
    // 1. IMPLEMENTAÇÃO PURA FIPS 180-4 SHA-256 (Funciona em HTTPS e file://)
    // =========================================================================
    const SHA256_K = new Uint32Array([
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ]);

    function utf8ToBytes(str) {
        if (typeof TextEncoder !== 'undefined') {
            return new TextEncoder().encode(str);
        }
        const bytes = [];
        for (let i = 0; i < str.length; i++) {
            let code = str.charCodeAt(i);
            if (code < 0x80) {
                bytes.push(code);
            } else if (code < 0x800) {
                bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
            } else if (code < 0xd800 || code >= 0xe000) {
                bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
            } else {
                i++;
                code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
                bytes.push(
                    0xf0 | (code >> 18),
                    0x80 | ((code >> 12) & 0x3f),
                    0x80 | ((code >> 6) & 0x3f),
                    0x80 | (code & 0x3f)
                );
            }
        }
        return new Uint8Array(bytes);
    }

    function rotr(x, n) {
        return (x >>> n) | (x << (32 - n));
    }

    function sha256Hex(input) {
        const msg = utf8ToBytes(String(input));
        const bitLenHi = Math.floor((msg.length * 8) / 0x100000000);
        const bitLenLo = (msg.length * 8) >>> 0;

        const padLen = ((msg.length + 9 + 63) & ~63);
        const padded = new Uint8Array(padLen);
        padded.set(msg, 0);
        padded[msg.length] = 0x80;

        const view = new DataView(padded.buffer);
        view.setUint32(padLen - 8, bitLenHi, false);
        view.setUint32(padLen - 4, bitLenLo, false);

        let h0 = 0x6a09e667;
        let h1 = 0xbb67ae85;
        let h2 = 0x3c6ef372;
        let h3 = 0xa54ff53a;
        let h4 = 0x510e527f;
        let h5 = 0x9b05688c;
        let h6 = 0x1f83d9ab;
        let h7 = 0x5be0cd19;

        const w = new Uint32Array(64);

        for (let offset = 0; offset < padLen; offset += 64) {
            for (let i = 0; i < 16; i++) {
                w[i] = view.getUint32(offset + i * 4, false);
            }
            for (let i = 16; i < 64; i++) {
                const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
                const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
                w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
            }

            let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

            for (let i = 0; i < 64; i++) {
                const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
                const ch = (e & f) ^ (~e & g);
                const temp1 = (h + S1 + ch + SHA256_K[i] + w[i]) >>> 0;
                const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
                const maj = (a & b) ^ (a & c) ^ (b & c);
                const temp2 = (S0 + maj) >>> 0;

                h = g;
                g = f;
                f = e;
                e = (d + temp1) >>> 0;
                d = c;
                c = b;
                b = a;
                a = (temp1 + temp2) >>> 0;
            }

            h0 = (h0 + a) >>> 0;
            h1 = (h1 + b) >>> 0;
            h2 = (h2 + c) >>> 0;
            h3 = (h3 + d) >>> 0;
            h4 = (h4 + e) >>> 0;
            h5 = (h5 + f) >>> 0;
            h6 = (h6 + g) >>> 0;
            h7 = (h7 + h) >>> 0;
        }

        const toHex = (n) => (n >>> 0).toString(16).padStart(8, '0');
        return toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4) + toHex(h5) + toHex(h6) + toHex(h7);
    }

    function constantTimeEquals(a, b) {
        if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
        let diff = 0;
        for (let i = 0; i < a.length; i++) {
            diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
        }
        return diff === 0;
    }

    // =========================================================================
    // 2. AUTENTICAÇÃO E GESTÃO DE PIN LOCAL
    // =========================================================================
    function getExpectedPinHash() {
        try {
            const custom = localStorage.getItem(CUSTOM_PIN_KEY);
            if (custom && /^[a-f0-9]{64}$/.test(custom)) {
                return custom;
            }
        } catch (_) { /* ignore */ }
        return DEFAULT_PIN_HASH;
    }

    function hasCustomPin() {
        try {
            const custom = localStorage.getItem(CUSTOM_PIN_KEY);
            return Boolean(custom && /^[a-f0-9]{64}$/.test(custom));
        } catch (_) {
            return false;
        }
    }

    function computePinHash(pin) {
        return sha256Hex(AUTH_SALT_PREFIX + String(pin || '').trim());
    }

    function isUnlocked() {
        try {
            const expected = getExpectedPinHash();
            const tok1 = sessionStorage.getItem(SESSION_AUTH_KEY);
            const tok2 = sessionStorage.getItem(SESSION_COMPAT_KEY);
            return constantTimeEquals(tok1 || '', expected) || constantTimeEquals(tok2 || '', expected);
        } catch (_) {
            return false;
        }
    }

    function verifyPin(pin) {
        const candidate = computePinHash(pin);
        const expected = getExpectedPinHash();
        if (constantTimeEquals(candidate, expected)) {
            try {
                sessionStorage.setItem(SESSION_AUTH_KEY, expected);
                sessionStorage.setItem(SESSION_COMPAT_KEY, expected);
            } catch (_) { /* ignore */ }
            return true;
        }
        return false;
    }

    function lockVault() {
        try {
            sessionStorage.removeItem(SESSION_AUTH_KEY);
            sessionStorage.removeItem(SESSION_COMPAT_KEY);
        } catch (_) { /* ignore */ }
        syncAuthUI();
        toast('Vault trancado. Sessão encerrada com segurança.', 'info');
    }

    function encryptRouteForPin(pin) {
        const keyHex = sha256Hex('dm_vault_route_v1::' + String(pin || '').trim());
        const keyBytes = new Uint8Array(32);
        for (let i = 0; i < 32; i++) keyBytes[i] = parseInt(keyHex.substr(i * 2, 2), 16);
        const routeBytes = utf8ToBytes('nexus-vault/index.html');
        let outHex = '';
        for (let i = 0; i < routeBytes.length; i++) {
            outHex += (routeBytes[i] ^ keyBytes[i % keyBytes.length]).toString(16).padStart(2, '0');
        }
        return outHex;
    }

    function changeCustomPin(currentPin, newPin) {
        if (!verifyPin(currentPin)) {
            return { ok: false, error: 'PIN atual incorreto.' };
        }
        const cleaned = String(newPin || '').trim();
        if (cleaned.length < 4 || cleaned.length > 24) {
            return { ok: false, error: 'O novo PIN deve conter entre 4 e 24 caracteres.' };
        }
        const newHash = computePinHash(cleaned);
        const newRouteHex = encryptRouteForPin(cleaned);
        try {
            localStorage.setItem(CUSTOM_PIN_KEY, newHash);
            localStorage.setItem('dm_vault_custom_route_hex', newRouteHex);
            sessionStorage.setItem(SESSION_AUTH_KEY, newHash);
            sessionStorage.setItem(SESSION_COMPAT_KEY, newHash);
            updateStorageMeter();
            return { ok: true };
        } catch (err) {
            return { ok: false, error: 'Falha ao gravar no LocalStorage: ' + err.message };
        }
    }

    function resetCustomPinToDefault(currentPin) {
        if (!verifyPin(currentPin)) {
            return { ok: false, error: 'PIN atual incorreto.' };
        }
        try {
            localStorage.removeItem(CUSTOM_PIN_KEY);
            localStorage.removeItem('dm_vault_custom_route_hex');
            sessionStorage.setItem(SESSION_AUTH_KEY, DEFAULT_PIN_HASH);
            sessionStorage.setItem(SESSION_COMPAT_KEY, DEFAULT_PIN_HASH);
            updateStorageMeter();
            return { ok: true };
        } catch (err) {
            return { ok: false, error: err.message };
        }
    }

    // =========================================================================
    // 3. GERENCIADOR CENTRAL DE ESTADO (LocalStorage)
    // =========================================================================
    const store = {
        get(key, fallback) {
            try {
                const raw = localStorage.getItem(key);
                if (raw === null || raw === undefined) {
                    return typeof fallback === 'function' ? fallback() : JSON.parse(JSON.stringify(fallback ?? null));
                }
                return JSON.parse(raw);
            } catch (err) {
                console.warn('[VaultCore] Erro ao ler chave', key, err);
                return typeof fallback === 'function' ? fallback() : fallback;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                updateStorageMeter();
                window.dispatchEvent(new CustomEvent('vault:updated', { detail: { key } }));
                return true;
            } catch (err) {
                toast('Erro de armazenamento LocalStorage: ' + err.message, 'error');
                return false;
            }
        },
        remove(key) {
            try {
                localStorage.removeItem(key);
                updateStorageMeter();
                return true;
            } catch (_) {
                return false;
            }
        },
        getProfile() {
            return store.get(STORAGE_KEYS.PROFILE, {
                childLabel: '',
                childAge: 5,
                geminiApiKey: '',
                activeTab: 'psicometria'
            });
        },
        updateProfile(patch) {
            const current = store.getProfile();
            const next = Object.assign({}, current, patch);
            store.set(STORAGE_KEYS.PROFILE, next);
            return next;
        },
        getStorageStats() {
            let vaultBytes = 0;
            let totalBytes = 0;
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    const v = localStorage.getItem(k) || '';
                    const pairBytes = (k.length + v.length) * 2;
                    totalBytes += pairBytes;
                    if (k && k.startsWith('dm_vault_')) {
                        vaultBytes += pairBytes;
                    }
                }
            } catch (_) { /* ignore */ }
            const quotaBytes = 5 * 1024 * 1024;
            return {
                vaultBytes,
                totalBytes,
                vaultKB: (vaultBytes / 1024).toFixed(1),
                totalKB: (totalBytes / 1024).toFixed(1),
                pctQuota: Math.min(100, (totalBytes / quotaBytes) * 100).toFixed(1)
            };
        }
    };

    function updateStorageMeter() {
        const stats = store.getStorageStats();
        const kbEl = document.getElementById('vault-storage-kb');
        const barEl = document.getElementById('vault-storage-bar');
        if (kbEl) {
            kbEl.textContent = `${stats.vaultKB} KB`;
            kbEl.title = `Vault: ${stats.vaultKB} KB | Total LocalStorage: ${stats.totalKB} KB (${stats.pctQuota}% de ~5 MB)`;
        }
        if (barEl) {
            barEl.style.width = `${Math.max(3, parseFloat(stats.pctQuota))}%`;
        }
    }

    // =========================================================================
    // 4. BACKUP COMPLETO (.JSON) E EXPORTADOR .CSV (UTF-8 BOM)
    // =========================================================================
    function exportFullDatabase() {
        const dataPayload = {};
        ALL_MANAGED_KEYS.forEach((key) => {
            const raw = localStorage.getItem(key);
            if (raw !== null) {
                try {
                    dataPayload[key] = JSON.parse(raw);
                } catch (_) {
                    dataPayload[key] = raw;
                }
            }
        });

        const customHash = localStorage.getItem(CUSTOM_PIN_KEY);
        if (customHash) {
            dataPayload[CUSTOM_PIN_KEY] = customHash;
        }

        const canonicalData = JSON.stringify(dataPayload);
        const checksum = sha256Hex(canonicalData);
        const now = new Date();
        const stamp = now.toISOString();
        const fileStamp = stamp.slice(0, 16).replace('T', '-').replace(':', '');

        const envelope = {
            app: 'dm-nexus-vault',
            schemaVersion: '1.0.0',
            exportedAt: stamp,
            checksumSha256: checksum,
            data: dataPayload
        };

        const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json;charset=utf-8' });
        triggerDownload(blob, `nexus-vault-backup-${fileStamp}.json`);
        toast('Banco completo exportado (.json) com assinatura SHA-256.', 'success');
    }

    function importFullDatabaseFromFile(file, onSuccess) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (ev) {
            try {
                const parsed = JSON.parse(String(ev.target.result || ''));
                if (!parsed || typeof parsed !== 'object' || !parsed.data || typeof parsed.data !== 'object') {
                    throw new Error('Estrutura JSON inválida: objeto "data" ausente.');
                }

                if (parsed.checksumSha256) {
                    const recomputed = sha256Hex(JSON.stringify(parsed.data));
                    if (recomputed !== parsed.checksumSha256) {
                        const proceed = window.confirm(
                            'Aviso: O checksum SHA-256 do arquivo diverge do conteúdo (o arquivo pode ter sido editado manualmente). Deseja restaurar mesmo assim?'
                        );
                        if (!proceed) return;
                    }
                }

                let restoredCount = 0;
                ALL_MANAGED_KEYS.forEach((key) => {
                    if (Object.prototype.hasOwnProperty.call(parsed.data, key)) {
                        localStorage.setItem(key, JSON.stringify(parsed.data[key]));
                        restoredCount++;
                    }
                });

                if (parsed.data[CUSTOM_PIN_KEY] && /^[a-f0-9]{64}$/.test(parsed.data[CUSTOM_PIN_KEY])) {
                    localStorage.setItem(CUSTOM_PIN_KEY, parsed.data[CUSTOM_PIN_KEY]);
                    const exp = getExpectedPinHash();
                    sessionStorage.setItem(SESSION_AUTH_KEY, exp);
                    sessionStorage.setItem(SESSION_COMPAT_KEY, exp);
                }

                updateStorageMeter();
                window.dispatchEvent(new CustomEvent('vault:restored'));
                toast(`Backup restaurado com sucesso (${restoredCount} módulos sincronizados).`, 'success');
                if (typeof onSuccess === 'function') onSuccess();
            } catch (err) {
                toast('Falha ao importar banco JSON: ' + err.message, 'error', 5000);
            }
        };
        reader.onerror = function () {
            toast('Erro de leitura do arquivo selecionado.', 'error');
        };
        reader.readAsText(file, 'utf-8');
    }

    function exportCSV(filename, headers, rows) {
        const escapeCell = (val) => {
            const s = val === null || val === undefined ? '' : String(val);
            if (/[";\r\n]/.test(s)) {
                return '"' + s.replace(/"/g, '""') + '"';
            }
            return s;
        };
        const lines = [headers.map(escapeCell).join(';')];
        rows.forEach((row) => {
            lines.push(row.map(escapeCell).join(';'));
        });
        const csvContent = '\uFEFF' + lines.join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        triggerDownload(blob, filename);
    }

    function triggerDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 250);
    }

    // =========================================================================
    // 5. UTILITÁRIOS DE FORMATAÇÃO, DATAS E UI (Toasts, Abas, Ícones)
    // =========================================================================
    function esc(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function todayISO() {
        const d = new Date();
        const tzOffset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - tzOffset).toISOString().slice(0, 10);
    }

    function parseLocalISO(isoStr) {
        if (!isoStr || !/^\d{4}-\d{2}-\d{2}$/.test(isoStr)) return null;
        const [y, m, d] = isoStr.split('-').map(Number);
        return new Date(y, m - 1, d, 12, 0, 0);
    }

    function toLocalISO(dateObj) {
        if (!dateObj || isNaN(dateObj.getTime())) return '';
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const d = String(dateObj.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function addDaysISO(isoStr, days) {
        const dt = parseLocalISO(isoStr) || parseLocalISO(todayISO());
        dt.setDate(dt.getDate() + Number(days || 0));
        return toLocalISO(dt);
    }

    function addMonthsISO(isoStr, months) {
        const dt = parseLocalISO(isoStr) || parseLocalISO(todayISO());
        dt.setMonth(dt.getMonth() + Number(months || 0));
        return toLocalISO(dt);
    }

    function daysDiffFromToday(targetIso) {
        const target = parseLocalISO(targetIso);
        if (!target) return null;
        const now = parseLocalISO(todayISO());
        return Math.round((target.getTime() - now.getTime()) / 86400000);
    }

    function formatDateBR(isoStr) {
        if (!isoStr || !/^\d{4}-\d{2}-\d{2}/.test(isoStr)) return '—';
        const [y, m, d] = isoStr.slice(0, 10).split('-');
        return `${d}/${m}/${y}`;
    }

    function formatBRL(num) {
        const val = Number(num) || 0;
        return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function formatNum(num, decimals = 2) {
        const val = Number(num) || 0;
        return val.toLocaleString('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    function refreshIcons(rootEl) {
        if (global.lucide && typeof global.lucide.createIcons === 'function') {
            try {
                if (rootEl) {
                    global.lucide.createIcons({ attrs: {}, nameAttr: 'data-lucide' });
                } else {
                    global.lucide.createIcons();
                }
            } catch (_) { /* ignore */ }
        }
    }

    function toast(message, type = 'info', duration = 3400) {
        const root = document.getElementById('vault-toast-root');
        if (!root) return;

        const palette = {
            success: 'border-emerald-500/60 bg-slate-900/95 text-emerald-300',
            error: 'border-rose-500/60 bg-slate-900/95 text-rose-300',
            warning: 'border-amber-500/60 bg-slate-900/95 text-amber-300',
            info: 'border-cyan-500/60 bg-slate-900/95 text-cyan-200'
        };
        const icons = {
            success: 'check-circle-2',
            error: 'alert-octagon',
            warning: 'alert-triangle',
            info: 'terminal'
        };

        const item = document.createElement('div');
        item.className = `flex items-center gap-3 px-4 py-3 rounded-lg border shadow-2xl backdrop-blur-md text-xs sm:text-sm font-medium transition-all duration-200 translate-y-2 opacity-0 ${palette[type] || palette.info}`;
        item.innerHTML = `
            <i data-lucide="${icons[type] || 'terminal'}" class="w-4 h-4 shrink-0"></i>
            <span class="leading-snug">${esc(message)}</span>
        `;
        root.appendChild(item);
        refreshIcons(item);

        requestAnimationFrame(() => {
            item.classList.remove('translate-y-2', 'opacity-0');
        });

        setTimeout(() => {
            item.classList.add('opacity-0', 'translate-y-1');
            setTimeout(() => {
                if (item.parentNode) item.parentNode.removeChild(item);
            }, 220);
        }, duration);
    }

    // =========================================================================
    // 6. NAVEGAÇÃO ENTRE AS 6 ABAS & CONTROLE DO SHELL DE BLOQUEIO
    // =========================================================================
    const VALID_TABS = ['psicometria', 'bonsai', 'viola', 'desfusao', 'contos', 'independencia'];

    function switchTab(tabId, savePref = true) {
        const target = VALID_TABS.includes(tabId) ? tabId : 'psicometria';
        document.querySelectorAll('[data-vault-tab-btn]').forEach((btn) => {
            const active = btn.getAttribute('data-vault-tab-btn') === target;
            btn.setAttribute('aria-selected', active ? 'true' : 'false');
            if (active) {
                btn.classList.add('vault-tab-active');
            } else {
                btn.classList.remove('vault-tab-active');
            }
        });

        document.querySelectorAll('[data-vault-panel]').forEach((panel) => {
            const active = panel.getAttribute('data-vault-panel') === target;
            panel.classList.toggle('hidden', !active);
        });

        if (savePref) {
            store.updateProfile({ activeTab: target });
        }

        window.dispatchEvent(new CustomEvent('vault:tab-changed', { detail: { tab: target } }));
        refreshIcons();
    }

    function syncAuthUI() {
        const lockScreen = document.getElementById('vault-lock-screen');
        const appShell = document.getElementById('vault-app-shell');
        const pinInput = document.getElementById('vault-pin-input');
        const unlocked = isUnlocked();

        if (unlocked) {
            if (lockScreen) lockScreen.classList.add('hidden');
            if (appShell) appShell.classList.remove('hidden');
            updateStorageMeter();
            const prof = store.getProfile();
            switchTab(prof.activeTab || 'psicometria', false);
            window.dispatchEvent(new CustomEvent('vault:unlocked'));
        } else {
            if (appShell) appShell.classList.add('hidden');
            if (lockScreen) lockScreen.classList.remove('hidden');
            if (pinInput) {
                pinInput.value = '';
                setTimeout(() => pinInput.focus(), 60);
            }
        }
        refreshIcons();
    }

    function initShellEvents() {
        // Form de Login por PIN
        const authForm = document.getElementById('vault-auth-form');
        const pinInput = document.getElementById('vault-pin-input');
        const authError = document.getElementById('vault-auth-error');
        const authCard = document.getElementById('vault-auth-card');

        if (authForm) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const val = pinInput ? pinInput.value : '';
                if (verifyPin(val)) {
                    if (authError) authError.classList.add('hidden');
                    if (pinInput) pinInput.value = '';
                    syncAuthUI();
                    toast('Acesso autorizado via hash SHA-256.', 'success', 2400);
                } else {
                    if (authError) {
                        authError.textContent = 'Hash SHA-256 divergente. Verifique sua credencial.';
                        authError.classList.remove('hidden');
                    }
                    if (authCard) {
                        authCard.classList.remove('vault-shake');
                        void authCard.offsetWidth;
                        authCard.classList.add('vault-shake');
                    }
                    if (pinInput) {
                        pinInput.select();
                    }
                }
            });
        }

        // Botões de Abas
        document.querySelectorAll('[data-vault-tab-btn]').forEach((btn) => {
            btn.addEventListener('click', () => {
                switchTab(btn.getAttribute('data-vault-tab-btn'));
            });
        });

        // Botão Trancar
        const btnLock = document.getElementById('btn-vault-lock');
        if (btnLock) {
            btnLock.addEventListener('click', lockVault);
        }

        // Exportar / Importar Banco Completo
        const btnExportAll = document.getElementById('btn-vault-export-json');
        if (btnExportAll) {
            btnExportAll.addEventListener('click', exportFullDatabase);
        }

        const btnImportTrigger = document.getElementById('btn-vault-import-trigger');
        const fileImportInput = document.getElementById('input-vault-import-json');
        if (btnImportTrigger && fileImportInput) {
            btnImportTrigger.addEventListener('click', () => fileImportInput.click());
            fileImportInput.addEventListener('change', (e) => {
                const file = e.target.files && e.target.files[0];
                if (file) {
                    importFullDatabaseFromFile(file);
                }
                fileImportInput.value = '';
            });
        }

        // Limpeza Rápida Local
        const btnWipeAll = document.getElementById('btn-vault-wipe-all');
        if (btnWipeAll) {
            btnWipeAll.addEventListener('click', () => {
                const ok = window.confirm(
                    'ATENÇÃO: Deseja limpar todos os dados locais das 6 abas neste navegador? Recomendamos exportar um backup (.json) antes de prosseguir.'
                );
                if (!ok) return;
                ALL_MANAGED_KEYS.forEach((k) => localStorage.removeItem(k));
                updateStorageMeter();
                window.dispatchEvent(new CustomEvent('vault:restored'));
                toast('Dados locais do navegador redefinidos.', 'warning');
            });
        }

        // Modal Alterar PIN Local
        const modalPin = document.getElementById('modal-change-pin');
        const btnOpenPinModal = document.getElementById('btn-vault-open-pin-modal');
        const btnClosePinModal = document.getElementById('btn-close-pin-modal');
        const formChangePin = document.getElementById('form-change-pin');
        const btnResetDefaultPin = document.getElementById('btn-reset-default-pin');
        const badgePinStatus = document.getElementById('pin-custom-status-badge');

        const updatePinModalState = () => {
            if (badgePinStatus) {
                badgePinStatus.textContent = hasCustomPin()
                    ? 'Hash Customizado Ativo neste Navegador'
                    : 'Hash Padrão Institucional Ativo';
            }
            if (btnResetDefaultPin) {
                btnResetDefaultPin.classList.toggle('hidden', !hasCustomPin());
            }
        };

        if (btnOpenPinModal && modalPin) {
            btnOpenPinModal.addEventListener('click', () => {
                updatePinModalState();
                modalPin.classList.remove('hidden');
            });
        }
        if (btnClosePinModal && modalPin) {
            btnClosePinModal.addEventListener('click', () => modalPin.classList.add('hidden'));
        }
        if (formChangePin) {
            formChangePin.addEventListener('submit', (e) => {
                e.preventDefault();
                const cur = document.getElementById('input-current-pin').value;
                const nw = document.getElementById('input-new-pin').value;
                const nw2 = document.getElementById('input-confirm-pin').value;
                if (nw !== nw2) {
                    toast('A confirmação do novo PIN não coincide.', 'error');
                    return;
                }
                const res = changeCustomPin(cur, nw);
                if (res.ok) {
                    formChangePin.reset();
                    modalPin.classList.add('hidden');
                    toast('Hash SHA-256 do PIN atualizado localmente com sucesso.', 'success');
                } else {
                    toast(res.error, 'error');
                }
            });
        }
        if (btnResetDefaultPin) {
            btnResetDefaultPin.addEventListener('click', () => {
                const cur = document.getElementById('input-current-pin').value;
                if (!cur) {
                    toast('Informe o PIN atual no primeiro campo para restaurar o hash padrão.', 'warning');
                    return;
                }
                const res = resetCustomPinToDefault(cur);
                if (res.ok) {
                    formChangePin.reset();
                    modalPin.classList.add('hidden');
                    toast('PIN restaurado para o hash padrão.', 'info');
                } else {
                    toast(res.error, 'error');
                }
            });
        }

        // Atalhos Globais de Teclado (Alt+1..6, Alt+L, Alt+B)
        document.addEventListener('keydown', (e) => {
            if (!isUnlocked()) return;
            if (e.altKey && !e.ctrlKey && !e.metaKey) {
                if (e.key >= '1' && e.key <= '6') {
                    e.preventDefault();
                    const idx = parseInt(e.key, 10) - 1;
                    if (VALID_TABS[idx]) switchTab(VALID_TABS[idx]);
                } else if (e.key.toLowerCase() === 'l') {
                    e.preventDefault();
                    lockVault();
                } else if (e.key.toLowerCase() === 'b') {
                    e.preventDefault();
                    exportFullDatabase();
                }
            }
        });

        syncAuthUI();
    }

    global.VaultCore = {
        STORAGE_KEYS,
        sha256Hex,
        verifyPin,
        isUnlocked,
        lockVault,
        store,
        updateStorageMeter,
        exportFullDatabase,
        importFullDatabaseFromFile,
        exportCSV,
        esc,
        todayISO,
        addDaysISO,
        addMonthsISO,
        daysDiffFromToday,
        formatDateBR,
        formatBRL,
        formatNum,
        refreshIcons,
        toast,
        switchTab,
        initShellEvents
    };
})(window);
