// Motor Comercial & Validador Criptográfico de Licença Vitalícia — Bonsai Mori PRO
window.BonsaiLicense = (function () {
  const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const SECRET_PEPPER = 'DEO_NEURO_BOTANY_2026_V1';
  const STORAGE_KEY = 'bonsai_mori_license_v1';

  // =========================================================================
  // CONFIGURAÇÃO COMERCIAL CENTRAL
  // Para iniciar a cobrança no futuro, altere `mode` de 'SHOWCASE_FREE' para 'COMMERCIAL_ACTIVE'
  // e aponte `checkoutUrl` para o seu link de pagamento (Mercado Pago / Asaas / Stripe / Kiwify).
  // =========================================================================
  const COMMERCIAL_CONFIG = {
    mode: 'SHOWCASE_FREE', // 'SHOWCASE_FREE' | 'COMMERCIAL_ACTIVE'
    productName: 'Bonsai Mori PRO — Licença Vitalícia',
    priceOriginal: 'R$ 97,00',
    priceCurrent: 'R$ 49,90',
    priceNote: 'Pagamento único • Acesso vitalício • Zero mensalidade',
    salesPageUrl: './licenca.html',
    checkoutUrl: './licenca.html#adquirir',
    supportWhatsapp: 'https://wa.me/5535933003807',
    freeLimits: {
      maxTrees: 3,
      allowBeforeAfter: false,
      allowFullSpeciesGuide: false,
      allowFullBackup: false,
      freeSpeciesPreviewCount: 8
    }
  };

  let cachedLicense = null;

  // SHA-256 compacto puro em JS (garante funcionamento idêntico em HTTPS, HTTP local e file:// offline)
  function sha256Bytes(asciiStr) {
    const bytes = new TextEncoder().encode(asciiStr);
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
    const H = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    const bitLen = bytes.length * 8;
    const padLen = ((bytes.length + 9 + 63) >> 6) << 6;
    const padded = new Uint8Array(padLen);
    padded.set(bytes);
    padded[bytes.length] = 0x80;
    const view = new DataView(padded.buffer);
    view.setUint32(padLen - 4, bitLen >>> 0, false);
    view.setUint32(padLen - 8, Math.floor(bitLen / 4294967296), false);

    const W = new Uint32Array(64);
    const rotr = (x, n) => (x >>> n) | (x << (32 - n));

    for (let i = 0; i < padLen; i += 64) {
      for (let t = 0; t < 16; t++) {
        W[t] = view.getUint32(i + t * 4, false);
      }
      for (let t = 16; t < 64; t++) {
        const s0 = rotr(W[t - 15], 7) ^ rotr(W[t - 15], 18) ^ (W[t - 15] >>> 3);
        const s1 = rotr(W[t - 2], 17) ^ rotr(W[t - 2], 19) ^ (W[t - 2] >>> 10);
        W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0;
      }

      let [a, b, c, d, e, f, g, h] = H;
      for (let t = 0; t < 64; t++) {
        const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        const ch = (e & f) ^ (~e & g);
        const temp1 = (h + S1 + ch + K[t] + W[t]) >>> 0;
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

      H[0] = (H[0] + a) >>> 0;
      H[1] = (H[1] + b) >>> 0;
      H[2] = (H[2] + c) >>> 0;
      H[3] = (H[3] + d) >>> 0;
      H[4] = (H[4] + e) >>> 0;
      H[5] = (H[5] + f) >>> 0;
      H[6] = (H[6] + g) >>> 0;
      H[7] = (H[7] + h) >>> 0;
    }

    const out = new Uint8Array(32);
    const outView = new DataView(out.buffer);
    for (let i = 0; i < 8; i++) outView.setUint32(i * 4, H[i], false);
    return out;
  }

  function computeSignatureBlocks(normalizedEmail, salt4) {
    const payload = 'BMORI_V1|' + normalizedEmail + '|' + salt4 + '|' + SECRET_PEPPER;
    const digest = sha256Bytes(payload);
    let sig = '';
    for (let i = 0; i < 8; i++) {
      sig += ALPHABET[digest[i] & 31];
    }
    return sig.slice(0, 4) + '-' + sig.slice(4, 8);
  }

  function verifyLicenseKey(email, rawKey) {
    const normEmail = String(email || '').trim().toLowerCase();
    const normKey = String(rawKey || '').trim().toUpperCase().replace(/\s+/g, '');
    if (!normEmail || !normEmail.includes('@')) {
      return { valid: false, reason: 'Informe o mesmo e-mail cadastrado na compra.' };
    }
    const parts = normKey.split('-');
    if (parts.length !== 4 || parts[0] !== 'BMORI' || parts[1].length !== 4 || parts[2].length !== 4 || parts[3].length !== 4) {
      return { valid: false, reason: 'Formato esperado: BMORI-XXXX-XXXX-XXXX.' };
    }
    const expected = computeSignatureBlocks(normEmail, parts[1]);
    const provided = parts[2] + '-' + parts[3];
    if (expected !== provided) {
      return { valid: false, reason: 'Chave inválida para o e-mail informado.' };
    }
    return {
      valid: true,
      email: normEmail,
      key: normKey,
      activatedAt: new Date().toISOString()
    };
  }

  function loadStoredLicense() {
    if (cachedLicense) return cachedLicense;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.email && parsed.key) {
          const check = verifyLicenseKey(parsed.email, parsed.key);
          if (check.valid) {
            cachedLicense = parsed;
            return cachedLicense;
          }
        }
      }
    } catch (_) {}
    return null;
  }

  function activateLicense(email, key) {
    const res = verifyLicenseKey(email, key);
    if (!res.valid) return res;
    const record = {
      email: res.email,
      key: res.key,
      activatedAt: res.activatedAt,
      plan: 'LIFETIME_PRO'
    };
    cachedLicense = record;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch (_) {}
    return { valid: true, license: record };
  }

  function deactivateLicense() {
    cachedLicense = null;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }

  function isLifetimeActivated() {
    return Boolean(loadStoredLicense());
  }

  function isShowcaseFreeMode() {
    return COMMERCIAL_CONFIG.mode === 'SHOWCASE_FREE';
  }

  // Verifica se o usuário tem direito aos recursos PRO neste momento
  function hasProAccess() {
    if (isLifetimeActivated()) return true;
    if (isShowcaseFreeMode()) return true;
    return false;
  }

  function canAddMoreTrees(currentTreeCount) {
    if (hasProAccess()) return true;
    return currentTreeCount < COMMERCIAL_CONFIG.freeLimits.maxTrees;
  }

  function getStatusSummary() {
    const lic = loadStoredLicense();
    if (lic) {
      return {
        tier: 'PRO_LIFETIME',
        badgeText: '👑 PRO Vitalício',
        headline: 'Licença Vitalícia PRO Ativa',
        description: 'Licenciada permanentemente para ' + lic.email + '.',
        email: lic.email,
        key: lic.key
      };
    }
    if (isShowcaseFreeMode()) {
      return {
        tier: 'SHOWCASE_DEMO',
        badgeText: '✨ Demo PRO Livre',
        headline: 'Acesso Completo Liberado (Fase de Demonstração)',
        description: 'Todos os recursos da Licença Vitalícia PRO estão temporariamente abertos para avaliação e demonstração gratuita.'
      };
    }
    return {
      tier: 'FREE_STARTER',
      badgeText: 'Plano Básico',
      headline: 'Plano Gratuito (Até ' + COMMERCIAL_CONFIG.freeLimits.maxTrees + ' Bonsais)',
      description: 'Adquira a Licença Vitalícia PRO (pagamento único) para desbloquear árvores ilimitadas, comparador Antes/Depois, backup completo e as 40 fichas fitotécnicas.'
    };
  }

  return {
    COMMERCIAL_CONFIG,
    verifyLicenseKey,
    loadStoredLicense,
    activateLicense,
    deactivateLicense,
    isLifetimeActivated,
    isShowcaseFreeMode,
    hasProAccess,
    canAddMoreTrees,
    getStatusSummary
  };
})();
