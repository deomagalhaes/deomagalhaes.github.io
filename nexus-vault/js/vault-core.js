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
    const HANDOFF_AUTH_KEY = 'dm_vault_handoff';

    const STORAGE_KEYS = {
        BONSAI: 'dm_vault_bonsai',
        VIOLA: 'dm_vault_viola',
        DESFUSAO: 'dm_vault_desfusao',
        DESFUSAO_DRAFT: 'dm_vault_desfusao_draft',
        CONTOS: 'dm_vault_contos',
        AMBER_PREFS: 'dm_vault_amber_prefs',
        INDEPENDENCIA: 'dm_vault_independencia',
        PSICOMETRIA: 'dm_vault_psicometria',
        PROFILE: 'dm_vault_profile',
        AGENDA: 'dm_vault_agenda',
        META: 'dm_vault_meta'
    };

    const ALL_MANAGED_KEYS = [
        STORAGE_KEYS.BONSAI,
        STORAGE_KEYS.VIOLA,
        STORAGE_KEYS.DESFUSAO,
        STORAGE_KEYS.DESFUSAO_DRAFT,
        STORAGE_KEYS.CONTOS,
        STORAGE_KEYS.AMBER_PREFS,
        STORAGE_KEYS.INDEPENDENCIA,
        STORAGE_KEYS.PSICOMETRIA,
        STORAGE_KEYS.PROFILE,
        STORAGE_KEYS.AGENDA,
        STORAGE_KEYS.META
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
            if (constantTimeEquals(tok1 || '', expected) || constantTimeEquals(tok2 || '', expected)) {
                return true;
            }
            const rawHandoff = localStorage.getItem(HANDOFF_AUTH_KEY);
            if (rawHandoff) {
                localStorage.removeItem(HANDOFF_AUTH_KEY);
                const parsed = JSON.parse(rawHandoff);
                if (
                    parsed &&
                    typeof parsed.hash === 'string' &&
                    typeof parsed.ts === 'number' &&
                    Math.abs(Date.now() - parsed.ts) < 120000 &&
                    constantTimeEquals(parsed.hash, expected)
                ) {
                    sessionStorage.setItem(SESSION_AUTH_KEY, expected);
                    sessionStorage.setItem(SESSION_COMPAT_KEY, expected);
                    return true;
                }
            }
            return false;
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
            localStorage.removeItem(HANDOFF_AUTH_KEY);
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

    function getMeta() {
        return Object.assign({ autoLockEnabled: true, lastBackupAt: null, lastBackupSizeKB: null }, store.get(STORAGE_KEYS.META, {}) || {});
    }

    function updateMeta(partial) {
        const next = Object.assign(getMeta(), partial || {});
        store.set(STORAGE_KEYS.META, next);
        return next;
    }

    function updateBackupBadge() {
        const badge = document.getElementById('vault-backup-badge');
        if (!badge) return;
        const meta = getMeta();
        if (!meta.lastBackupAt) {
            badge.textContent = 'Backup: nunca exportado';
            badge.className = 'hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-amber-500/10 border border-amber-500/30 text-amber-300';
            badge.title = 'Exporte um backup completo (.json) para proteger seus dados locais (Alt+B).';
            return;
        }
        const diffDays = Math.floor((Date.now() - new Date(meta.lastBackupAt).getTime()) / 86400000);
        const label = diffDays <= 0 ? 'hoje' : (diffDays === 1 ? 'há 1 dia' : `há ${diffDays}d`);
        badge.textContent = `Backup: ${label}`;
        badge.title = `Último backup: ${new Date(meta.lastBackupAt).toLocaleString('pt-BR')} (${meta.lastBackupSizeKB || '?'} KB)`;
        if (diffDays >= 7) {
            badge.className = 'hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-amber-500/15 border border-amber-500/40 text-amber-300';
        } else {
            badge.className = 'hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-300';
        }
    }

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
        updateBackupBadge();
    }

    // =========================================================================
    // 4. BACKUP COMPLETO (.JSON) E EXPORTADOR .CSV (UTF-8 BOM)
    // =========================================================================
    function exportFullDatabase() {
        const now = new Date();
        const stamp = now.toISOString();
        const statsBefore = store.getStorageStats();
        updateMeta({ lastBackupAt: stamp, lastBackupSizeKB: statsBefore.vaultKB });

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
        updateStorageMeter();
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
    const VALID_TABS = ['psicometria', 'bonsai', 'viola', 'desfusao', 'contos', 'independencia', 'agenda'];

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
                    'ATENÇÃO: Deseja limpar todos os dados locais das 7 abas neste navegador? Recomendamos exportar um backup (.json) antes de prosseguir.'
                );
                if (!ok) return;
                ALL_MANAGED_KEYS.forEach((k) => localStorage.removeItem(k));
                updateStorageMeter();
                window.dispatchEvent(new CustomEvent('vault:restored'));
                toast('Dados locais do navegador redefinidos.', 'warning');
            });
        }

        // Auto-Lock por Inatividade (15 min)
        const INACTIVITY_LIMIT_MS = 15 * 60 * 1000;
        const INACTIVITY_WARN_MS = 14 * 60 * 1000;
        let inactivityWarnTimer = null;
        let inactivityLockTimer = null;

        const updateAutoLockUI = () => {
            const btn = document.getElementById('btn-vault-autolock');
            const lbl = document.getElementById('vault-autolock-label');
            const enabled = getMeta().autoLockEnabled !== false;
            if (btn) {
                btn.className = enabled
                    ? 'min-h-[40px] px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-300 text-xs font-mono flex items-center gap-1 transition'
                    : 'min-h-[40px] px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-amber-500/35 text-amber-300 text-xs font-mono flex items-center gap-1 transition';
                btn.title = enabled
                    ? 'Auto-Lock por Inatividade ATIVO (15 min) — Clique para pausar'
                    : 'Auto-Lock por Inatividade PAUSADO — Clique para reativar';
            }
            if (lbl) {
                lbl.textContent = enabled ? 'Auto-Lock 15m' : 'Auto-Lock OFF';
            }
        };

        const resetInactivityTimers = () => {
            if (inactivityWarnTimer) clearTimeout(inactivityWarnTimer);
            if (inactivityLockTimer) clearTimeout(inactivityLockTimer);
            if (!isUnlocked() || getMeta().autoLockEnabled === false) return;

            inactivityWarnTimer = setTimeout(() => {
                if (isUnlocked() && getMeta().autoLockEnabled !== false) {
                    toast('Inatividade detectada: o Vault será trancado em 60 segundos.', 'warning', 4500);
                }
            }, INACTIVITY_WARN_MS);

            inactivityLockTimer = setTimeout(() => {
                if (isUnlocked() && getMeta().autoLockEnabled !== false) {
                    lockVault();
                    toast('Vault trancado automaticamente após 15 minutos de inatividade.', 'info');
                }
            }, INACTIVITY_LIMIT_MS);
        };

        const toggleAutoLock = () => {
            const next = !(getMeta().autoLockEnabled !== false);
            updateMeta({ autoLockEnabled: next });
            updateAutoLockUI();
            if (next) {
                resetInactivityTimers();
                toast('Auto-Lock de segurança ativado (15 min).', 'success');
            } else {
                if (inactivityWarnTimer) clearTimeout(inactivityWarnTimer);
                if (inactivityLockTimer) clearTimeout(inactivityLockTimer);
                toast('Auto-Lock pausado para esta sessão.', 'warning');
            }
        };

        const btnAutoLock = document.getElementById('btn-vault-autolock');
        if (btnAutoLock) {
            btnAutoLock.addEventListener('click', toggleAutoLock);
        }
        ['pointerdown', 'keydown', 'scroll'].forEach((evtName) => {
            document.addEventListener(evtName, resetInactivityTimers, { passive: true });
        });
        window.addEventListener('vault:unlocked', () => {
            updateAutoLockUI();
            resetInactivityTimers();
        });
        updateAutoLockUI();

        // Command Palette Global (Ctrl+K / Alt+K)
        const paletteModal = document.getElementById('modal-command-palette');
        const paletteInput = document.getElementById('command-palette-input');
        const paletteList = document.getElementById('command-palette-list');
        let paletteSelectedIdx = 0;
        let paletteFiltered = [];

        const COMMAND_ITEMS = [
            { id: 'tab-psi', group: 'Módulos', title: '1. Estação Psicométrica (WASI • FDT • SRS-2)', hint: 'Alt+1', icon: 'brain-circuit', keywords: 'wasi fdt srs2 bpa ravlt laudo abnt neuropsicologia', run: () => switchTab('psicometria') },
            { id: 'tab-bon', group: 'Módulos', title: '2. Gestão Fitotécnica de Bonsai', hint: 'Alt+2', icon: 'trees', keywords: 'bonsai planta adubacao transplante bancada', run: () => switchTab('bonsai') },
            { id: 'tab-vio', group: 'Módulos', title: '3. Viola Cebolão & Violão (Canhoto)', hint: 'Alt+3', icon: 'music', keywords: 'viola violao cebolao acorde escala metronomo afinador', run: () => switchTab('viola') },
            { id: 'tab-des', group: 'Módulos', title: '4. Desfusão & Decisão 24h', hint: 'Alt+4', icon: 'scale', keywords: 'desfusao decisao clivagem tradeoff', run: () => switchTab('desfusao') },
            { id: 'tab-con', group: 'Módulos', title: '5. Contos Noturnos (Leitor Âmbar)', hint: 'Alt+5', icon: 'moon-star', keywords: 'contos historia dormir ambar sono', run: () => switchTab('contos') },
            { id: 'tab-ind', group: 'Módulos', title: '6. Independência Clínica & Mercado', hint: 'Alt+6', icon: 'trending-up', keywords: 'independencia fire renda passiva monte carlo alocador estresse', run: () => switchTab('independencia') },
            { id: 'tab-age', group: 'Módulos', title: '7. Sessões, Agenda & Faturamento', hint: 'Alt+7', icon: 'calendar-check-2', keywords: 'agenda sessoes faturamento pix recibo whatsapp paciente', run: () => switchTab('agenda') },
            { id: 'sub-laudo', group: 'Atalhos Rápidos', title: 'Psicometria → Compositor de Laudo ABNT', hint: 'Sub-aba', icon: 'file-spreadsheet', keywords: 'laudo tabela abnt png curva', run: () => { switchTab('psicometria'); setTimeout(() => { const b = document.querySelector('[data-psy-subtab="laudo"]'); if (b) b.click(); }, 40); } },
            { id: 'sub-mc', group: 'Atalhos Rápidos', title: 'Independência → Simulação Monte Carlo', hint: 'Sub-aba', icon: 'activity', keywords: 'monte carlo sorr ruina', run: () => { switchTab('independencia'); setTimeout(() => { const b = document.querySelector('[data-ind-subtab="montecarlo"]'); if (b) b.click(); }, 40); } },
            { id: 'act-radar', group: 'Sistema', title: 'Abrir Radar do Dia (Briefing Executivo)', hint: 'Alt+0', icon: 'radar', keywords: 'radar briefing resumo hoje status', run: () => openRadarBriefing() },
            { id: 'act-export', group: 'Sistema', title: 'Exportar Banco Completo (.json)', hint: 'Alt+B', icon: 'download-cloud', keywords: 'backup exportar json drive', run: () => exportFullDatabase() },
            { id: 'act-import', group: 'Sistema', title: 'Importar Banco (.json)', hint: 'Restaurar', icon: 'upload-cloud', keywords: 'importar restaurar json backup', run: () => { const f = document.getElementById('input-vault-import-json'); if (f) f.click(); } },
            { id: 'act-autolock', group: 'Sistema', title: 'Alternar Auto-Lock de Inatividade (15m)', hint: 'Segurança', icon: 'shield-check', keywords: 'autolock seguranca inatividade', run: () => toggleAutoLock() },
            { id: 'act-pin', group: 'Sistema', title: 'Alterar PIN Local (SHA-256)', hint: 'PIN', icon: 'key-round', keywords: 'pin senha hash sha256', run: () => { const b = document.getElementById('btn-vault-open-pin-modal'); if (b) b.click(); } },
            { id: 'act-lock', group: 'Sistema', title: 'Trancar Vault Agora', hint: 'Alt+L', icon: 'lock', keywords: 'trancar sair bloquear lock', run: () => lockVault() }
        ];

        function renderCommandPaletteList() {
            if (!paletteList) return;
            const q = (paletteInput ? paletteInput.value : '').trim().toLowerCase();
            paletteFiltered = COMMAND_ITEMS.filter((item) => {
                if (!q) return true;
                return (item.title + ' ' + item.group + ' ' + item.keywords).toLowerCase().includes(q);
            });
            if (paletteSelectedIdx >= paletteFiltered.length) paletteSelectedIdx = 0;

            if (paletteFiltered.length === 0) {
                paletteList.innerHTML = '<div class="px-4 py-6 text-center text-xs font-mono text-slate-500">Nenhum comando correspondente.</div>';
                return;
            }

            paletteList.innerHTML = paletteFiltered.map((item, idx) => {
                const active = idx === paletteSelectedIdx;
                return `
                    <button type="button" data-cmd-idx="${idx}"
                        class="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition ${active ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-100' : 'border border-transparent text-slate-300 hover:bg-slate-800/70'}">
                        <div class="flex items-center gap-3 min-w-0">
                            <i data-lucide="${esc(item.icon)}" class="w-4 h-4 ${active ? 'text-cyan-300' : 'text-slate-400'} shrink-0"></i>
                            <div class="min-w-0">
                                <div class="text-xs sm:text-sm font-medium truncate">${esc(item.title)}</div>
                                <div class="text-[10px] font-mono text-slate-500">${esc(item.group)}</div>
                            </div>
                        </div>
                        <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 shrink-0">${esc(item.hint)}</span>
                    </button>
                `;
            }).join('');

            paletteList.querySelectorAll('[data-cmd-idx]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const idx = parseInt(btn.getAttribute('data-cmd-idx'), 10);
                    const cmd = paletteFiltered[idx];
                    closeCommandPalette();
                    if (cmd && typeof cmd.run === 'function') cmd.run();
                });
            });
            refreshIcons(paletteList);
        }

        function openCommandPalette() {
            if (!isUnlocked() || !paletteModal) return;
            paletteSelectedIdx = 0;
            if (paletteInput) paletteInput.value = '';
            paletteModal.classList.remove('hidden');
            renderCommandPaletteList();
            if (paletteInput) setTimeout(() => paletteInput.focus(), 30);
        }

        function closeCommandPalette() {
            if (paletteModal) paletteModal.classList.add('hidden');
        }

        const btnPalette = document.getElementById('btn-vault-palette');
        if (btnPalette) btnPalette.addEventListener('click', openCommandPalette);
        if (paletteModal) {
            paletteModal.addEventListener('click', (e) => {
                if (e.target === paletteModal) closeCommandPalette();
            });
        }
        if (paletteInput) {
            paletteInput.addEventListener('input', () => {
                paletteSelectedIdx = 0;
                renderCommandPaletteList();
            });
            paletteInput.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (paletteFiltered.length > 0) {
                        paletteSelectedIdx = (paletteSelectedIdx + 1) % paletteFiltered.length;
                        renderCommandPaletteList();
                    }
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (paletteFiltered.length > 0) {
                        paletteSelectedIdx = (paletteSelectedIdx - 1 + paletteFiltered.length) % paletteFiltered.length;
                        renderCommandPaletteList();
                    }
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    const cmd = paletteFiltered[paletteSelectedIdx];
                    closeCommandPalette();
                    if (cmd && typeof cmd.run === 'function') cmd.run();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    closeCommandPalette();
                }
            });
        }

        // Radar do Dia / Briefing Executivo Cross-Módulos (Alt+0)
        const radarModal = document.getElementById('modal-vault-radar');
        const radarBody = document.getElementById('radar-body-content');
        const btnRadar = document.getElementById('btn-vault-radar');
        const btnCloseRadar = document.getElementById('btn-close-radar-modal');

        function openRadarBriefing() {
            if (!isUnlocked() || !radarModal || !radarBody) return;

            const psy = store.get(STORAGE_KEYS.PSICOMETRIA, {}) || {};
            const psyCases = Array.isArray(psy.cases) ? psy.cases : [];
            const activeCase = psyCases.find((c) => c.id === psy.activeCaseId) || psyCases[0];

            const bonsaiRaw = store.get(STORAGE_KEYS.BONSAI, {}) || {};
            const plants = Array.isArray(bonsaiRaw) ? bonsaiRaw : (Array.isArray(bonsaiRaw.plants) ? bonsaiRaw.plants : []);
            let fertLate = 0;
            let repotLate = 0;
            plants.forEach((p) => {
                if (p.lastFertilization && p.fertCycleDays) {
                    const due = addDaysISO(p.lastFertilization, Number(p.fertCycleDays) || 30);
                    if (daysDiffFromToday(due) < 0) fertLate++;
                }
                if (p.lastRepot && p.repotCycleMonths) {
                    const dueR = addMonthsISO(p.lastRepot, Number(p.repotCycleMonths) || 24);
                    if (daysDiffFromToday(dueR) < 0) repotLate++;
                }
            });

            const agenda = store.get(STORAGE_KEYS.AGENDA, {}) || {};
            const agendaEvents = Array.isArray(agenda.events) ? agenda.events.length : 0;
            const agendaManual = Array.isArray(agenda.manualSessions) ? agenda.manualSessions.length : 0;
            const patientsCfgCount = agenda.patientsConfig ? Object.keys(agenda.patientsConfig).length : 0;

            const desfusao = store.get(STORAGE_KEYS.DESFUSAO, []);
            const desfusaoArr = Array.isArray(desfusao) ? desfusao : (Array.isArray(desfusao.entries) ? desfusao.entries : []);
            const lastDesfusao = desfusaoArr[0] || null;

            const contos = store.get(STORAGE_KEYS.CONTOS, {}) || {};
            const savedStories = Array.isArray(contos.savedStories) ? contos.savedStories.length : 0;

            const ind = store.get(STORAGE_KEYS.INDEPENDENCIA, {}) || {};
            const patrimony = Number(ind.currentPatrimony) || 0;
            const weeklySess = Number(ind.weeklySessions) || 0;

            const stats = store.getStorageStats();
            const meta = getMeta();
            const backupText = meta.lastBackupAt
                ? `${new Date(meta.lastBackupAt).toLocaleString('pt-BR')} (${meta.lastBackupSizeKB || stats.vaultKB} KB)`
                : 'Nenhum backup exportado ainda neste navegador';

            radarBody.innerHTML = `
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div class="p-4 rounded-xl bg-[#090d16] border border-slate-800 space-y-2">
                        <div class="flex items-center justify-between text-xs font-mono text-cyan-300">
                            <span>1. PSICOMETRIA</span>
                            <button type="button" data-radar-go="psicometria" class="text-[11px] underline hover:text-cyan-200">Abrir</button>
                        </div>
                        <div class="text-2xl font-bold text-slate-100">${psyCases.length} <span class="text-xs font-normal text-slate-400">protocolos</span></div>
                        <div class="text-xs text-slate-400 truncate">Ativo: <strong class="text-slate-200">${esc(activeCase ? (activeCase.code || activeCase.label || 'Sem código') : 'Nenhum')}</strong></div>
                    </div>

                    <div class="p-4 rounded-xl bg-[#090d16] border border-slate-800 space-y-2">
                        <div class="flex items-center justify-between text-xs font-mono text-emerald-400">
                            <span>2. ACERVO BONSAI</span>
                            <button type="button" data-radar-go="bonsai" class="text-[11px] underline hover:text-emerald-300">Abrir</button>
                        </div>
                        <div class="text-2xl font-bold text-slate-100">${plants.length} <span class="text-xs font-normal text-slate-400">plantas</span></div>
                        <div class="text-xs ${fertLate + repotLate > 0 ? 'text-amber-300' : 'text-emerald-300'}">
                            ${fertLate} adubação(ões) • ${repotLate} transplante(s) atrasados
                        </div>
                    </div>

                    <div class="p-4 rounded-xl bg-[#090d16] border border-slate-800 space-y-2">
                        <div class="flex items-center justify-between text-xs font-mono text-sky-400">
                            <span>7. AGENDA &amp; HONORÁRIOS</span>
                            <button type="button" data-radar-go="agenda" class="text-[11px] underline hover:text-sky-300">Abrir</button>
                        </div>
                        <div class="text-2xl font-bold text-slate-100">${agendaEvents + agendaManual} <span class="text-xs font-normal text-slate-400">sessões/eventos</span></div>
                        <div class="text-xs text-slate-400">${patientsCfgCount} pacientes configurados</div>
                    </div>

                    <div class="p-4 rounded-xl bg-[#090d16] border border-slate-800 space-y-2">
                        <div class="flex items-center justify-between text-xs font-mono text-emerald-300">
                            <span>6. INDEPENDÊNCIA CLÍNICA</span>
                            <button type="button" data-radar-go="independencia" class="text-[11px] underline hover:text-emerald-200">Abrir</button>
                        </div>
                        <div class="text-xl font-bold text-slate-100">${formatBRL(patrimony)}</div>
                        <div class="text-xs text-slate-400">Meta simulada: ${weeklySess || '—'} sessões/sem</div>
                    </div>

                    <div class="p-4 rounded-xl bg-[#090d16] border border-slate-800 space-y-2">
                        <div class="flex items-center justify-between text-xs font-mono text-amber-400">
                            <span>4. DESFUSÃO &amp; DECISÃO 24H</span>
                            <button type="button" data-radar-go="desfusao" class="text-[11px] underline hover:text-amber-300">Abrir</button>
                        </div>
                        <div class="text-2xl font-bold text-slate-100">${desfusaoArr.length} <span class="text-xs font-normal text-slate-400">registros</span></div>
                        <div class="text-xs text-slate-400 truncate">${esc(lastDesfusao && (lastDesfusao.decision || lastDesfusao.action) ? (lastDesfusao.decision || lastDesfusao.action) : 'Sem decisão registrada')}</div>
                    </div>

                    <div class="p-4 rounded-xl bg-[#090d16] border border-slate-800 space-y-2">
                        <div class="flex items-center justify-between text-xs font-mono text-amber-300">
                            <span>5. CONTOS NOTURNOS</span>
                            <button type="button" data-radar-go="contos" class="text-[11px] underline hover:text-amber-200">Abrir</button>
                        </div>
                        <div class="text-2xl font-bold text-slate-100">${savedStories} <span class="text-xs font-normal text-slate-400">salvos</span></div>
                        <div class="text-xs text-slate-400">Leitor Âmbar Low-Blue-Light pronto</div>
                    </div>
                </div>

                <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div class="space-y-0.5">
                        <div class="text-xs font-mono text-slate-300">Saúde de Armazenamento &amp; Backup Portátil</div>
                        <div class="text-xs text-slate-400">Uso Vault: <strong class="text-cyan-300">${stats.vaultKB} KB</strong> (${stats.pctQuota}% da cota) • Último backup: <strong class="text-slate-200">${esc(backupText)}</strong></div>
                    </div>
                    <button type="button" id="radar-btn-export-now" class="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5">
                        <i data-lucide="download-cloud" class="w-4 h-4"></i>
                        <span>Exportar Backup Agora</span>
                    </button>
                </div>
            `;

            radarBody.querySelectorAll('[data-radar-go]').forEach((b) => {
                b.addEventListener('click', () => {
                    const tab = b.getAttribute('data-radar-go');
                    radarModal.classList.add('hidden');
                    switchTab(tab);
                });
            });
            const btnExpNow = document.getElementById('radar-btn-export-now');
            if (btnExpNow) {
                btnExpNow.addEventListener('click', () => {
                    exportFullDatabase();
                    radarModal.classList.add('hidden');
                });
            }

            radarModal.classList.remove('hidden');
            refreshIcons(radarBody);
        }

        if (btnRadar) btnRadar.addEventListener('click', openRadarBriefing);
        if (btnCloseRadar && radarModal) btnCloseRadar.addEventListener('click', () => radarModal.classList.add('hidden'));
        if (radarModal) {
            radarModal.addEventListener('click', (e) => {
                if (e.target === radarModal) radarModal.classList.add('hidden');
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

        // Atalhos Globais de Teclado (Ctrl+K, Alt+K, Alt+0, Alt+1..7, Alt+L, Alt+B)
        document.addEventListener('keydown', (e) => {
            if (!isUnlocked()) return;
            if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                openCommandPalette();
                return;
            }
            if (e.altKey && !e.ctrlKey && !e.metaKey) {
                if (e.key >= '1' && e.key <= '7') {
                    e.preventDefault();
                    const idx = parseInt(e.key, 10) - 1;
                    if (VALID_TABS[idx]) switchTab(VALID_TABS[idx]);
                } else if (e.key === '0') {
                    e.preventDefault();
                    openRadarBriefing();
                } else if (e.key.toLowerCase() === 'k') {
                    e.preventDefault();
                    openCommandPalette();
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
        getMeta,
        updateMeta,
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
