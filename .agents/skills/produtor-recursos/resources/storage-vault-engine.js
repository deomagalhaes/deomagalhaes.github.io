/**
 * Motor Reutilizável de Persistência Local, Exportação LGPD e Criptografia SHA-256 (FIPS 180-4)
 * 100% Client-Side | Zero-Backend | Compatível com HTTPS e file://
 */
export const LocalVaultEngine = {
    readJSON(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (err) {
            console.error('Erro ao ler localStorage:', err);
            return fallback;
        }
    },

    writeJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    exportJSONFile(data, filenamePrefix = 'backup-clinico') {
        const stamp = new Date().toISOString().slice(0, 10);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filenamePrefix}-${stamp}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    },

    exportCSVFile(headers, rows, filenamePrefix = 'relatorio') {
        const escapeCell = (val) => {
            const str = val === null || val === undefined ? '' : String(val);
            return `"${str.replace(/"/g, '""')}"`;
        };
        const lines = [
            headers.map(escapeCell).join(';'),
            ...rows.map((r) => r.map(escapeCell).join(';'))
        ];
        // BOM UTF-8 (\uFEFF) garante acentuação perfeita no Microsoft Excel em português
        const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
        const stamp = new Date().toISOString().slice(0, 10);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filenamePrefix}-${stamp}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    },

    async copyRichHTML(htmlString, plainFallback) {
        if (navigator.clipboard && window.ClipboardItem) {
            const htmlBlob = new Blob([htmlString], { type: 'text/html' });
            const textBlob = new Blob([plainFallback], { type: 'text/plain' });
            await navigator.clipboard.write([
                new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob })
            ]);
            return true;
        }
        const temp = document.createElement('div');
        temp.innerHTML = htmlString;
        temp.style.position = 'fixed';
        temp.style.left = '-9999px';
        document.body.appendChild(temp);
        const range = document.createRange();
        range.selectNodeContents(temp);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        const ok = document.execCommand('copy');
        sel.removeAllRanges();
        temp.remove();
        return ok;
    },

    // SHA-256 puro FIPS 180-4 (funciona offline, em HTTPS e em file://)
    sha256Bytes(asciiOrUtf8String) {
        const utf8 = new TextEncoder().encode(asciiOrUtf8String);
        const K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        ];
        let H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
        const bitLen = utf8.length * 8;
        const padLen = ((utf8.length + 9 + 63) >> 6) << 6;
        const msg = new Uint8Array(padLen);
        msg.set(utf8);
        msg[utf8.length] = 0x80;
        const view = new DataView(msg.buffer);
        view.setUint32(padLen - 4, bitLen >>> 0, false);
        view.setUint32(padLen - 8, Math.floor(bitLen / 0x100000000), false);

        const rotr = (n, x) => (x >>> n) | (x << (32 - n));
        const W = new Uint32Array(64);

        for (let offset = 0; offset < padLen; offset += 64) {
            for (let i = 0; i < 16; i++) W[i] = view.getUint32(offset + i * 4, false);
            for (let i = 16; i < 64; i++) {
                const s0 = rotr(7, W[i - 15]) ^ rotr(18, W[i - 15]) ^ (W[i - 15] >>> 3);
                const s1 = rotr(17, W[i - 2]) ^ rotr(19, W[i - 2]) ^ (W[i - 2] >>> 10);
                W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
            }
            let [a, b, c, d, e, f, g, h] = H;
            for (let i = 0; i < 64; i++) {
                const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
                const ch = (e & f) ^ (~e & g);
                const temp1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
                const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
                const maj = (a & b) ^ (a & c) ^ (b & c);
                const temp2 = (S0 + maj) >>> 0;
                h = g; g = f; f = e; e = (d + temp1) >>> 0;
                d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
            }
            H = H.map((v, idx) => (v + [a, b, c, d, e, f, g, h][idx]) >>> 0);
        }
        const out = new Uint8Array(32);
        const outView = new DataView(out.buffer);
        H.forEach((word, i) => outView.setUint32(i * 4, word, false));
        return out;
    },

    sha256Hex(str) {
        return Array.from(this.sha256Bytes(str)).map((b) => b.toString(16).padStart(2, '0')).join('');
    }
};
