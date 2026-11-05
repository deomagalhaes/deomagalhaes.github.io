/**
 * NEXUS VAULT — Aba 1: Estação Avançada de Correção Neuropsicológica, Psicometria & Laudos ABNT/DSM-5-TR
 * Arquitetura 100% Client-Side (LocalStorage: dm_vault_psicometria) • Zero-Backend • Alta Precisão Estatística
 * Autor Institucional: Deo Magalhães - Neuropsicólogo e Neurocientista (CRP 04/42784)
 */
(function (global) {
    'use strict';

    // =========================================================================
    // 1. MOTOR MATEMÁTICO PSICOMÉTRICO DE ALTA PRECISÃO
    // =========================================================================

    /**
     * Função Erro de Gauss erf(x) — Aproximação de Abramowitz & Stegun (7.1.26)
     * Erro máximo absoluto < 1,5 × 10⁻⁷
     */
    function erf(x) {
        const sign = x < 0 ? -1 : 1;
        const absX = Math.abs(x);
        const p = 0.3275911;
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const t = 1.0 / (1.0 + p * absX);
        const poly = (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t;
        const y = 1.0 - poly * Math.exp(-absX * absX);
        return sign * y;
    }

    /**
     * CDF Normal Padrão Φ(z) → Probabilidade acumulada [0, 1]
     */
    function normCDF(z) {
        if (!Number.isFinite(z)) return null;
        if (z <= -8.5) return 0.000001;
        if (z >= 8.5) return 0.999999;
        return 0.5 * (1.0 + erf(z / Math.SQRT2));
    }

    /**
     * Converte Z-Score em Percentil numérico exato [0.01 .. 99.99]
     */
    function zToPercentile(z) {
        const p = normCDF(z);
        if (p === null) return null;
        const pct = p * 100.0;
        return Math.min(99.99, Math.max(0.01, pct));
    }

    /**
     * Formatação clínica do Percentil (ex.: "< 0,1", "> 99,9", inteiros ou 1 casa decimal)
     */
    function formatPercentileClinical(pct) {
        if (pct === null || pct === undefined || !Number.isFinite(Number(pct))) return '—';
        const v = Number(pct);
        if (v < 0.1) return '< 0,1';
        if (v > 99.9) return '> 99,9';
        if (v < 1 || v > 99) {
            return v.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        }
        const rounded1 = Math.round(v * 10) / 10;
        if (Math.abs(rounded1 - Math.round(rounded1)) < 0.05) {
            return String(Math.round(rounded1));
        }
        return rounded1.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }

    /**
     * Inversa Normal Racional (Probit) — Algoritmo de Peter J. Acklam
     * Converte Percentil (0,01 a 99,99) em Z-Score com erro relativo < 1,15 × 10⁻⁹
     */
    function percentileToZ(pctInput) {
        const pct = Number(pctInput);
        if (!Number.isFinite(pct) || pct <= 0 || pct >= 100) return null;
        const p = Math.min(0.999999, Math.max(0.000001, pct / 100.0));

        const a = [
            -3.969683028665376e+01,
             2.209460984245205e+02,
            -2.759285104469687e+02,
             1.383577518672690e+02,
            -3.066479806614716e+01,
             2.506628277459239e+00
        ];
        const b = [
            -5.447609879822406e+01,
             1.615858368580409e+02,
            -1.556989798598866e+02,
             6.680131188771972e+01,
            -1.328068155288572e+01
        ];
        const c = [
            -7.784894002430293e-03,
            -3.223964580411365e-01,
            -2.400758277161838e+00,
            -2.549732539343734e+00,
             4.374664141464968e+00,
             2.938163982698783e+00
        ];
        const d = [
             7.784695709041462e-03,
             3.224671290700398e-01,
             2.445134137142996e+00,
             3.754408661907416e+00
        ];

        const pLow = 0.02425;
        const pHigh = 1.0 - pLow;
        let q, r;

        if (p < pLow) {
            q = Math.sqrt(-2.0 * Math.log(p));
            return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                   ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1.0);
        } else if (p <= pHigh) {
            q = p - 0.5;
            r = q * q;
            return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
                   (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1.0);
        } else {
            q = Math.sqrt(-2.0 * Math.log(1.0 - p));
            return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
                    ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1.0);
        }
    }

    /**
     * Conversões Lineares Padronizadas a partir de Z
     */
    function calcZFromRaw(raw, mean, sd, inverted) {
        const x = Number(raw);
        const m = Number(mean);
        const s = Number(sd);
        if (!Number.isFinite(x) || !Number.isFinite(m) || !Number.isFinite(s) || s <= 0) return null;
        return inverted ? (m - x) / s : (x - m) / s;
    }

    function zToEP(z) { return Number.isFinite(z) ? 10 + 3 * z : null; }
    function epToZ(ep) { return Number.isFinite(ep) ? (ep - 10) / 3 : null; }
    function zToT(z) { return Number.isFinite(z) ? 50 + 10 * z : null; }
    function tToZ(t) { return Number.isFinite(t) ? (t - 50) / 10 : null; }
    function zToQI(z) { return Number.isFinite(z) ? 100 + 15 * z : null; }
    function qiToZ(qi) { return Number.isFinite(qi) ? (qi - 100) / 15 : null; }

    /**
     * Cálculo Psicométrico Real de Erro Padrão de Medida (EPM) e Intervalos de Confiança (IC 90% e IC 95%)
     * EPM = DP_escala × √(1 − rxx)
     */
    function calcConfidenceInterval(score, scaleSD, rxxInput, roundInt = true) {
        const val = Number(score);
        const sd = Number(scaleSD) || 15;
        const rxx = Math.min(0.999, Math.max(0.10, Number(rxxInput) || 0.90));
        if (!Number.isFinite(val)) return null;
        const sem = sd * Math.sqrt(1 - rxx);
        const margin95 = 1.96 * sem;
        const margin90 = 1.645 * sem;

        const fmt = (n) => roundInt ? Math.round(n) : Number(n.toFixed(1));
        const c95L = fmt(val - margin95);
        const c95H = fmt(val + margin95);
        const c90L = fmt(val - margin90);
        const c90H = fmt(val + margin90);

        const fmtBR = (n) => roundInt ? String(n) : n.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

        return {
            sem,
            rxx,
            ci95Low: c95L,
            ci95High: c95H,
            ci90Low: c90L,
            ci90High: c90H,
            label95: `${fmtBR(c95L)}–${fmtBR(c95H)}`,
            label90: `${fmtBR(c90L)}–${fmtBR(c90H)}`
        };
    }

    /**
     * Taxonomia 1: Escalas de Desempenho / Habilidade Cognitiva (DSM-5-TR / Wechsler — maior escore = melhor desempenho)
     * Cobertura contínua sem lacunas decimais:
     *   Z ≤ −2,00 (Pc ≤ 2)           → Inferior / Deficitário
     *  −2,00 < Z ≤ −1,38 (Pc 3–8)    → Limítrofe
     *  −1,38 < Z < −0,67 (Pc 9–24)   → Médio Inferior
     *  −0,67 ≤ Z ≤ +0,67 (Pc 25–74)  → Médio
     *  +0,67 < Z ≤ +1,31 (Pc 75–90)  → Médio Superior
     *  +1,31 < Z < +2,00 (Pc 91–97)  → Superior
     *   Z ≥ +2,00 (Pc ≥ 98)          → Muito Superior
     */
    function classifyCognitiveZ(z) {
        if (!Number.isFinite(z)) {
            return { label: '—', badge: 'bg-slate-800 text-slate-400 border-slate-700', tone: 'neutral' };
        }
        if (z <= -2.00) {
            return { label: 'Inferior / Deficitário', badge: 'bg-rose-950/60 text-rose-300 border-rose-500/40', tone: 'deficit' };
        }
        if (z <= -1.38) {
            return { label: 'Limítrofe', badge: 'bg-amber-950/60 text-amber-300 border-amber-500/40', tone: 'borderline' };
        }
        if (z < -0.67) {
            return { label: 'Médio Inferior', badge: 'bg-yellow-950/50 text-yellow-200 border-yellow-500/35', tone: 'low_avg' };
        }
        if (z <= 0.67) {
            return { label: 'Médio', badge: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/35', tone: 'average' };
        }
        if (z <= 1.31) {
            return { label: 'Médio Superior', badge: 'bg-cyan-950/50 text-cyan-300 border-cyan-500/35', tone: 'high_avg' };
        }
        if (z < 2.00) {
            return { label: 'Superior', badge: 'bg-sky-950/60 text-sky-300 border-sky-400/40', tone: 'superior' };
        }
        return { label: 'Muito Superior', badge: 'bg-indigo-950/60 text-indigo-300 border-indigo-400/40', tone: 'very_superior' };
    }

    /**
     * Taxonomia 2: Escalas Clínicas de Sintomatologia / Prejuízo Comportamental
     * Maior Escore T / Percentil = MAIOR gravidade clínica!
     */
    function classifySymptomT(tVal, mode = 'GENERAL') {
        const t = Number(tVal);
        if (!Number.isFinite(t)) {
            return { label: '—', detail: '', badge: 'bg-slate-800 text-slate-400 border-slate-700', level: 0 };
        }
        if (mode === 'SRS2') {
            if (t <= 59) {
                return {
                    label: 'Dentro dos Limites Normais',
                    detail: 'Sem elevação clínica sugestiva de TEA na reciprocidade social.',
                    badge: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/35',
                    level: 0
                };
            }
            if (t <= 65) {
                return {
                    label: 'Nível Leve',
                    detail: 'Deficiências clinicamente significativas leves a moderadas no comportamento social recíproco.',
                    badge: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
                    level: 1
                };
            }
            if (t <= 75) {
                return {
                    label: 'Nível Moderado',
                    detail: 'Deficiências substanciais na reciprocidade social, frequentes no TEA Nível 1/2.',
                    badge: 'bg-orange-950/60 text-orange-300 border-orange-500/45',
                    level: 2
                };
            }
            return {
                label: 'Nível Grave',
                detail: 'Deficiências severas na comunicação social recíproca e rigidez comportamental, fortemente associadas ao TEA.',
                badge: 'bg-rose-950/70 text-rose-300 border-rose-500/50',
                level: 3
            };
        }

        // Escala Clínica Geral de Sintomas (ex.: BRIEF-2, BDEFS, Achenbach, Conners)
        if (t < 60) {
            return {
                label: 'Dentro dos Limites Normais',
                detail: 'Ausência de elevação sintomatológica clinicamente significativa (T < 60).',
                badge: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/35',
                level: 0
            };
        }
        if (t < 65) {
            return {
                label: 'Elevação Leve / Subclínica',
                detail: 'Faixa de atenção clínica leve (T 60–64; Percentil 84–92).',
                badge: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
                level: 1
            };
        }
        if (t < 70) {
            return {
                label: 'Elevação Moderada / Potencialmente Clínica',
                detail: 'Prejuízo comportamental moderado (T 65–69; Percentil 93–97).',
                badge: 'bg-orange-950/60 text-orange-300 border-orange-500/45',
                level: 2
            };
        }
        return {
            label: 'Elevação Clinicamente Significativa (Grave)',
            detail: 'Prejuízo disfuncional acentuado (T ≥ 70; Percentil ≥ 98).',
            badge: 'bg-rose-950/70 text-rose-300 border-rose-500/50',
            level: 3
        };
    }

    /**
     * Constrói pacote completo de métricas psicométricas a partir de Z
     */
    function buildMetricsFromZ(z, opts = {}) {
        if (!Number.isFinite(z)) return null;
        const polarity = opts.polarity || 'SKILL'; // SKILL | SYMPTOM | SRS2
        const rxx = Number(opts.rxx) || 0.90;
        const pct = zToPercentile(z);
        const ep = zToEP(z);
        const t = zToT(z);
        const qi = zToQI(z);
        const ciQI = calcConfidenceInterval(qi, 15, rxx, true);
        const ciT = calcConfidenceInterval(t, 10, rxx, false);

        const classification = polarity === 'SKILL'
            ? classifyCognitiveZ(z)
            : classifySymptomT(t, polarity === 'SRS2' ? 'SRS2' : 'GENERAL');

        return {
            z,
            pct,
            pctFormatted: formatPercentileClinical(pct),
            ep,
            t,
            qi,
            ciQI,
            ciT,
            classification
        };
    }

    /**
     * Calculadora Automática de Idade Cronológica Exata (Anos, Meses e Dias)
     */
    function calcChronologicalAge(birthISO, evalISO) {
        if (!birthISO || !evalISO) return null;
        const bMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthISO.trim());
        const eMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(evalISO.trim());
        if (!bMatch || !eMatch) return null;

        const bY = Number(bMatch[1]), bM = Number(bMatch[2]), bD = Number(bMatch[3]);
        const eY = Number(eMatch[1]), eM = Number(eMatch[2]), eD = Number(eMatch[3]);

        const birthDate = new Date(bY, bM - 1, bD, 12, 0, 0);
        const evalDate = new Date(eY, eM - 1, eD, 12, 0, 0);
        if (isNaN(birthDate.getTime()) || isNaN(evalDate.getTime()) || evalDate < birthDate) {
            return null;
        }

        let years = eY - bY;
        let months = eM - bM;
        let days = eD - bD;

        if (days < 0) {
            // Número real de dias do mês imediatamente anterior à avaliação
            const prevMonthLastDay = new Date(eY, eM - 1, 0).getDate();
            days += prevMonthLastDay;
            months -= 1;
        }
        if (months < 0) {
            months += 12;
            years -= 1;
        }

        const totalMonths = years * 12 + months;
        const yTxt = `${years} ${years === 1 ? 'ano' : 'anos'}`;
        const mTxt = `${months} ${months === 1 ? 'mês' : 'meses'}`;
        const dTxt = `${days} ${days === 1 ? 'dia' : 'dias'}`;

        return {
            years,
            months,
            days,
            totalMonths,
            shortCode: `${years}a ${months}m ${days}d`,
            formatted: `${yTxt}, ${mTxt} e ${dTxt}`
        };
    }

    function parseNumInput(val) {
        if (val === null || val === undefined) return null;
        const s = String(val).trim().replace(',', '.');
        if (s === '') return null;
        const n = Number(s);
        return Number.isFinite(n) ? n : null;
    }

    function fmtSigned(val, decimals = 2) {
        if (val === null || val === undefined || !Number.isFinite(Number(val))) return '—';
        const n = Number(val);
        const absStr = Math.abs(n).toLocaleString('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
        if (Math.abs(n) < 0.0005) return '0,' + '0'.repeat(decimals);
        return (n > 0 ? '+' : '−') + absStr;
    }

    function fmtPlain(val, decimals = 1) {
        if (val === null || val === undefined || !Number.isFinite(Number(val))) return '—';
        return Number(val).toLocaleString('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    // =========================================================================
    // 2. ESTRUTURA DE DADOS, PROTOCOLOS E BIBLIOTECA DE NORMAS (dm_vault_psicometria)
    // =========================================================================

    const SUBTABS = [
        { id: 'wasi', label: 'A. WASI & Wechsler', icon: 'cpu' },
        { id: 'fdt', label: 'B. FDT (Cinco Dígitos)', icon: 'timer' },
        { id: 'srs2', label: 'C. SRS-2 (TEA / Social)', icon: 'users' },
        { id: 'bpa_ravlt', label: 'D. BPA-2 • RAVLT • Executivas', icon: 'layers' },
        { id: 'universal', label: 'E. Conversor & Normas', icon: 'calculator' },
        { id: 'laudo', label: 'F. Laudo ABNT & Curva PNG', icon: 'file-spreadsheet' }
    ];

    const COGNITIVE_DOMAINS = [
        'Inteligência Geral e Raciocínio',
        'Atenção e Velocidade de Processamento',
        'Funções Executivas',
        'Memória e Aprendizagem Episódica',
        'Linguagem e Compreensão Verbal',
        'Visuoconstrução e Percepção',
        'Cognição Social e Comportamento (Escalas Clínicas)'
    ];

    function createEmptyProtocol(code, evalISO) {
        const C = global.VaultCore;
        const today = evalISO || (C ? C.todayISO() : '2026-04-01');
        return {
            id: 'prot_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
            code: code || 'AV-2026-01',
            birthDate: '2016-11-14',
            evalDate: today,
            schooling: '4º Ano do Ensino Fundamental (Rede Privada)',
            handedness: 'Destro',
            informant: 'Genitores e Escola',
            referralReason: 'Investigação do perfil neurocognitivo, atencional, executivo e socioemocional.',
            clinicalData: {
                rawDumpText: '',
                referralReason: 'Investigação do perfil neurocognitivo, atencional, executivo e socioemocional.',
                anamneseHistory: '',
                familyHistory: '',
                behaviorObservation: '',
                diagnosticHypotheses: '',
                recommendations: '',
                isCollapsed: false,
                activeTab: 'smart_dump'
            },
            wasi: {
                voc: { raw: '', t: '', mode: 'T', mean: '', sd: '' },
                cub: { raw: '', t: '', mode: 'T', mean: '', sd: '' },
                sem: { raw: '', t: '', mode: 'T', mean: '', sd: '' },
                rm:  { raw: '', t: '', mode: 'T', mean: '', sd: '' },
                overrides: { qiv: '', qie: '', qit4: '', qit2: '' },
                rxx: { qiv: 0.93, qie: 0.94, qit4: 0.96, qit2: 0.93 }
            },
            wechsler: {
                scaleName: 'WISC-IV',
                icv: '', iop: '', imo: '', ivp: '', qit: '',
                iagManual: '', iccManual: '', rxx: 0.95
            },
            fdt: {
                pctConvention: 'EFFICIENCY', // EFFICIENCY (Pc 95 = ótimo) | RAW_TIME (Pc 95 = lento)
                leitura:     { time: '', errors: '0', mode: 'M_SD', mean: '', sd: '', pct: '' },
                contagem:    { time: '', errors: '0', mode: 'M_SD', mean: '', sd: '', pct: '' },
                escolha:     { time: '', errors: '0', mode: 'M_SD', mean: '', sd: '', pct: '' },
                alternancia: { time: '', errors: '0', mode: 'M_SD', mean: '', sd: '', pct: '' },
                inibicao:      { mode: 'M_SD', mean: '', sd: '', pct: '' },
                flexibilidade: { mode: 'M_SD', mean: '', sd: '', pct: '' }
            },
            srs2: {
                form: 'Idade Escolar (4–18 anos — Pais)',
                ps:  { raw: '', t: '', mean: '', sd: '' },
                cs:  { raw: '', t: '', mean: '', sd: '' },
                cos: { raw: '', t: '', mean: '', sd: '' },
                ms:  { raw: '', t: '', mean: '', sd: '' },
                prr: { raw: '', t: '', mean: '', sd: '' },
                cisT: '',
                totalT: ''
            },
            bpa2: {
                ac: { hits: '', errors: '', omissions: '', mode: 'PCT', pct: '', mean: '', sd: '' },
                ad: { hits: '', errors: '', omissions: '', mode: 'PCT', pct: '', mean: '', sd: '' },
                aa: { hits: '', errors: '', omissions: '', mode: 'PCT', pct: '', mean: '', sd: '' },
                ag: { mode: 'PCT', pct: '', mean: '', sd: '' }
            },
            ravlt: {
                a1: '', a2: '', a3: '', a4: '', a5: '',
                b1: '', a6: '', a7: '',
                recHits: '', recFP: '', recConvention: 'NET_35', // NET_35 (Acertos + (35 - FP) - 35) | HITS_MINUS_FP
                norms: {
                    total: { z: '', pct: '' },
                    alt:   { z: '', pct: '' },
                    a6:    { z: '', pct: '' },
                    a7:    { z: '', pct: '' },
                    rec:   { z: '', pct: '' }
                }
            },
            execScales: {
                snapInatCount: '', snapInatSum: '',
                snapHiperCount: '', snapHiperSum: '',
                snapTodCount: '', snapTodSum: '',
                bdefsName: 'BDEFS — Escala de Disfunções Executivas de Barkley (Escore Total)',
                bdefsRaw: '', bdefsPct: '', bdefsT: ''
            },
            report: {
                tableTitle: 'Tabela 1 – Síntese psicométrica dos instrumentos neuropsicológicos administrados',
                tableFootnote: 'Nota: DP = Desvio-Padrão; EP = Escore Ponderado (M = 10; DP = 3); Escore T (M = 50; DP = 10); QI / Padrão (M = 100; DP = 15); IC 95% = Intervalo de Confiança de 95% baseado no Erro Padrão de Medida (EPM). Nas escalas clínicas de sintomas (marcadas com *), escores mais elevados indicam maior severidade sintomatológica.',
                fontFamily: 'Times New Roman',
                groupBy: 'DOMAIN', // DOMAIN | INSTRUMENT | NONE
                columns: {
                    raw: true,
                    z: true,
                    ep: false,
                    t: true,
                    qi: true,
                    ci95: true,
                    pct: true,
                    classification: true
                },
                rows: [],
                customDraftText: ''
            }
        };
    }

    function createDefaultNormLibrary() {
        return [
            {
                id: 'norm_rey_copy_adult',
                instrument: 'Figura Complexa de Rey',
                subtest: 'Cópia (Precisão Visuoconstrutiva)',
                ageGroup: 'Adultos Jovens (18–39 anos)',
                mean: 32.8,
                sd: 3.1,
                inverted: false,
                polarity: 'SKILL',
                rxx: 0.86,
                domain: 'Visuoconstrução e Percepção'
            },
            {
                id: 'norm_rey_mem_adult',
                instrument: 'Figura Complexa de Rey',
                subtest: 'Memória Evocação Imediata (3 min)',
                ageGroup: 'Adultos Jovens (18–39 anos)',
                mean: 20.4,
                sd: 5.8,
                inverted: false,
                polarity: 'SKILL',
                rxx: 0.84,
                domain: 'Memória e Aprendizagem Episódica'
            },
            {
                id: 'norm_fas_phonemic',
                instrument: 'Fluência Verbal Fonêmica (FAS)',
                subtest: 'Total F + A + S (60s cada)',
                ageGroup: 'Adultos Ensino Superior',
                mean: 40.5,
                sd: 9.8,
                inverted: false,
                polarity: 'SKILL',
                rxx: 0.88,
                domain: 'Funções Executivas'
            },
            {
                id: 'norm_tmt_b_time',
                instrument: 'Teste de Trilhas (TMT)',
                subtest: 'Parte B — Tempo de Execução (s)',
                ageGroup: 'Adultos (20–39 anos)',
                mean: 64.2,
                sd: 18.5,
                inverted: true,
                polarity: 'SKILL',
                rxx: 0.85,
                domain: 'Funções Executivas'
            }
        ];
    }

    let appState = {
        activeSubTab: 'wasi',
        activeProtocolId: null,
        protocols: [],
        normLibrary: []
    };

    // Estado transitório da Calculadora Universal (Sub-Aba E)
    let universalState = {
        instrument: 'Figura Complexa de Rey',
        subtest: 'Cópia',
        domain: 'Visuoconstrução e Percepção',
        ageGroup: '',
        entryMode: 'RAW_NORM', // RAW_NORM | DIRECT_SCORE
        raw: '31',
        mean: '32.8',
        sd: '3.1',
        inverted: false,
        polarity: 'SKILL', // SKILL | SYMPTOM | SRS2
        rxx: '0.88',
        directType: 'PCT', // Z | PCT | T | EP | QI
        directVal: '50'
    };

    function loadState() {
        const C = global.VaultCore;
        const stored = C.store.get(C.STORAGE_KEYS.PSICOMETRIA, null);
        if (stored && typeof stored === 'object' && Array.isArray(stored.protocols) && stored.protocols.length > 0) {
            appState.protocols = stored.protocols.map(normalizeProtocol);
            appState.activeProtocolId = stored.activeProtocolId || appState.protocols[0].id;
            if (!appState.protocols.some((p) => p.id === appState.activeProtocolId)) {
                appState.activeProtocolId = appState.protocols[0].id;
            }
            appState.activeSubTab = SUBTABS.some((s) => s.id === stored.activeSubTab) ? stored.activeSubTab : 'wasi';
            appState.normLibrary = Array.isArray(stored.normLibrary) && stored.normLibrary.length > 0
                ? stored.normLibrary
                : createDefaultNormLibrary();
        } else {
            const firstProt = createEmptyProtocol('AV-2026-01');
            appState = {
                activeSubTab: 'wasi',
                activeProtocolId: firstProt.id,
                protocols: [firstProt],
                normLibrary: createDefaultNormLibrary()
            };
            saveState();
        }
    }

    function normalizeProtocol(p) {
        const base = createEmptyProtocol(p && p.code ? p.code : 'AV-2026-01');
        if (!p || typeof p !== 'object') return base;
        return {
            id: p.id || base.id,
            code: p.code || base.code,
            birthDate: p.birthDate ?? base.birthDate,
            evalDate: p.evalDate ?? base.evalDate,
            schooling: p.schooling ?? base.schooling,
            handedness: p.handedness ?? base.handedness,
            informant: p.informant ?? base.informant,
            referralReason: p.referralReason ?? base.referralReason,
            clinicalData: Object.assign({}, base.clinicalData, (p && p.clinicalData) || {}, {
                rawDumpText: (p && p.clinicalData && p.clinicalData.rawDumpText) || '',
                referralReason: (p && p.clinicalData && p.clinicalData.referralReason !== undefined)
                    ? p.clinicalData.referralReason
                    : (p && p.referralReason ? p.referralReason : base.clinicalData.referralReason),
                anamneseHistory: (p && p.clinicalData && p.clinicalData.anamneseHistory) || '',
                familyHistory: (p && p.clinicalData && p.clinicalData.familyHistory) || '',
                behaviorObservation: (p && p.clinicalData && p.clinicalData.behaviorObservation) || '',
                diagnosticHypotheses: (p && p.clinicalData && p.clinicalData.diagnosticHypotheses) || '',
                recommendations: (p && p.clinicalData && p.clinicalData.recommendations) || '',
                isCollapsed: Boolean(p && p.clinicalData && p.clinicalData.isCollapsed),
                activeTab: (p && p.clinicalData && p.clinicalData.activeTab) || 'smart_dump'
            }),
            wasi: Object.assign({}, base.wasi, p.wasi || {}, {
                voc: Object.assign({}, base.wasi.voc, (p.wasi && p.wasi.voc) || {}),
                cub: Object.assign({}, base.wasi.cub, (p.wasi && p.wasi.cub) || {}),
                sem: Object.assign({}, base.wasi.sem, (p.wasi && p.wasi.sem) || {}),
                rm:  Object.assign({}, base.wasi.rm,  (p.wasi && p.wasi.rm)  || {}),
                overrides: Object.assign({}, base.wasi.overrides, (p.wasi && p.wasi.overrides) || {}),
                rxx: Object.assign({}, base.wasi.rxx, (p.wasi && p.wasi.rxx) || {})
            }),
            wechsler: Object.assign({}, base.wechsler, p.wechsler || {}),
            fdt: Object.assign({}, base.fdt, p.fdt || {}, {
                leitura:     Object.assign({}, base.fdt.leitura,     (p.fdt && p.fdt.leitura) || {}),
                contagem:    Object.assign({}, base.fdt.contagem,    (p.fdt && p.fdt.contagem) || {}),
                escolha:     Object.assign({}, base.fdt.escolha,     (p.fdt && p.fdt.escolha) || {}),
                alternancia: Object.assign({}, base.fdt.alternancia, (p.fdt && p.fdt.alternancia) || {}),
                inibicao:      Object.assign({}, base.fdt.inibicao,      (p.fdt && p.fdt.inibicao) || {}),
                flexibilidade: Object.assign({}, base.fdt.flexibilidade, (p.fdt && p.fdt.flexibilidade) || {})
            }),
            srs2: Object.assign({}, base.srs2, p.srs2 || {}, {
                ps:  Object.assign({}, base.srs2.ps,  (p.srs2 && p.srs2.ps)  || {}),
                cs:  Object.assign({}, base.srs2.cs,  (p.srs2 && p.srs2.cs)  || {}),
                cos: Object.assign({}, base.srs2.cos, (p.srs2 && p.srs2.cos) || {}),
                ms:  Object.assign({}, base.srs2.ms,  (p.srs2 && p.srs2.ms)  || {}),
                prr: Object.assign({}, base.srs2.prr, (p.srs2 && p.srs2.prr) || {})
            }),
            bpa2: Object.assign({}, base.bpa2, p.bpa2 || {}, {
                ac: Object.assign({}, base.bpa2.ac, (p.bpa2 && p.bpa2.ac) || {}),
                ad: Object.assign({}, base.bpa2.ad, (p.bpa2 && p.bpa2.ad) || {}),
                aa: Object.assign({}, base.bpa2.aa, (p.bpa2 && p.bpa2.aa) || {}),
                ag: Object.assign({}, base.bpa2.ag, (p.bpa2 && p.bpa2.ag) || {})
            }),
            ravlt: Object.assign({}, base.ravlt, p.ravlt || {}, {
                norms: Object.assign({}, base.ravlt.norms, (p.ravlt && p.ravlt.norms) || {
                    total: Object.assign({}, base.ravlt.norms.total, (p.ravlt && p.ravlt.norms && p.ravlt.norms.total) || {}),
                    alt:   Object.assign({}, base.ravlt.norms.alt,   (p.ravlt && p.ravlt.norms && p.ravlt.norms.alt)   || {}),
                    a6:    Object.assign({}, base.ravlt.norms.a6,    (p.ravlt && p.ravlt.norms && p.ravlt.norms.a6)    || {}),
                    a7:    Object.assign({}, base.ravlt.norms.a7,    (p.ravlt && p.ravlt.norms && p.ravlt.norms.a7)    || {}),
                    rec:   Object.assign({}, base.ravlt.norms.rec,   (p.ravlt && p.ravlt.norms && p.ravlt.norms.rec)   || {})
                })
            }),
            execScales: Object.assign({}, base.execScales, p.execScales || {}),
            report: Object.assign({}, base.report, p.report || {}, {
                columns: Object.assign({}, base.report.columns, (p.report && p.report.columns) || {}),
                rows: Array.isArray(p.report && p.report.rows) ? p.report.rows : []
            })
        };
    }

    function saveState() {
        const C = global.VaultCore;
        C.store.set(C.STORAGE_KEYS.PSICOMETRIA, appState);
        const badge = document.getElementById('psy-save-status-badge');
        if (badge) {
            badge.textContent = `✓ Salvo às ${new Date().toLocaleTimeString('pt-BR')}`;
        }
    }

    function getActiveProtocol() {
        let found = appState.protocols.find((p) => p.id === appState.activeProtocolId);
        if (!found) {
            found = appState.protocols[0];
            appState.activeProtocolId = found.id;
        }
        return found;
    }

    /**
     * Insere ou atualiza linha na Tabela Mestra ABNT do protocolo ativo (evita duplicatas pela key única)
     */
    function upsertReportRow(rowObj) {
        const prot = getActiveProtocol();
        const rows = prot.report.rows;
        const idx = rows.findIndex((r) => r.uid === rowObj.uid);
        const normalized = {
            uid: rowObj.uid || ('row_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)),
            domain: rowObj.domain || 'Inteligência Geral e Raciocínio',
            instrument: rowObj.instrument || '',
            measure: rowObj.measure || '',
            raw: rowObj.raw !== undefined && rowObj.raw !== null ? String(rowObj.raw) : '—',
            z: Number.isFinite(rowObj.z) ? Number(rowObj.z) : null,
            ep: Number.isFinite(rowObj.ep) ? Number(rowObj.ep) : null,
            t: Number.isFinite(rowObj.t) ? Number(rowObj.t) : null,
            qi: Number.isFinite(rowObj.qi) ? Number(rowObj.qi) : null,
            ci95: rowObj.ci95 || '—',
            pct: rowObj.pct || '—',
            classification: rowObj.classification || '—',
            isSymptom: Boolean(rowObj.isSymptom),
            plotInCurve: rowObj.plotInCurve !== undefined ? Boolean(rowObj.plotInCurve) : !rowObj.isSymptom
        };
        if (idx >= 0) {
            rows[idx] = normalized;
        } else {
            rows.push(normalized);
        }
    }

    // =========================================================================
    // 3. MOTORES CLÍNICOS ESPECÍFICOS DOS INSTRUMENTOS NEUROPSICOLÓGICOS
    // =========================================================================

    function computeWasiSubtest(sub) {
        const raw = parseNumInput(sub.raw);
        let tVal = null;
        if (sub.mode === 'M_SD') {
            const m = parseNumInput(sub.mean);
            const sd = parseNumInput(sub.sd);
            if (raw !== null && m !== null && sd !== null && sd > 0) {
                const zLocal = (raw - m) / sd;
                tVal = 50 + 10 * zLocal;
            }
        } else {
            tVal = parseNumInput(sub.t);
        }
        if (tVal === null) return { raw, t: null, metrics: null };
        const z = tToZ(tVal);
        const metrics = buildMetricsFromZ(z, { polarity: 'SKILL', rxx: 0.90 });
        return { raw, t: tVal, z, metrics };
    }

    function computeWasiAll(prot) {
        const w = prot.wasi;
        const voc = computeWasiSubtest(w.voc);
        const cub = computeWasiSubtest(w.cub);
        const sem = computeWasiSubtest(w.sem);
        const rm  = computeWasiSubtest(w.rm);

        const sumVerbal = (voc.t !== null && sem.t !== null) ? (voc.t + sem.t) : null;
        const sumExec   = (cub.t !== null && rm.t !== null)  ? (cub.t + rm.t)  : null;
        const sumTotal4 = (sumVerbal !== null && sumExec !== null) ? (sumVerbal + sumExec) : null;
        const sumTotal2 = (voc.t !== null && rm.t !== null) ? (voc.t + rm.t) : null;

        // Estimativa psicométrica linear ajustada pela intercorrelação média da matriz WASI
        // (DP da soma de 2 subtestes T correlacionados r≈0,57 → DP_soma ≈ 17,72; 4 subtestes → DP_soma ≈ 31,0)
        const estQIV  = sumVerbal !== null ? Math.round(100 + 15 * ((sumVerbal - 100) / 17.72)) : null;
        const estQIE  = sumExec   !== null ? Math.round(100 + 15 * ((sumExec   - 100) / 17.55)) : null;
        const estQIT4 = sumTotal4 !== null ? Math.round(100 + 15 * ((sumTotal4 - 200) / 31.00)) : null;
        const estQIT2 = sumTotal2 !== null ? Math.round(100 + 15 * ((sumTotal2 - 100) / 17.40)) : null;

        const buildComp = (sumT, estQI, manualStr, rxxVal) => {
            const manual = parseNumInput(manualStr);
            const finalQI = manual !== null ? manual : estQI;
            const isManual = manual !== null;
            if (finalQI === null) {
                return { sumT, estQI, finalQI: null, isManual, rxx: rxxVal, metrics: null };
            }
            const z = qiToZ(finalQI);
            const metrics = buildMetricsFromZ(z, { polarity: 'SKILL', rxx: rxxVal });
            const ci = calcConfidenceInterval(finalQI, 15, rxxVal, true);
            return { sumT, estQI, finalQI, isManual, rxx: rxxVal, z, metrics, ci };
        };

        const qiv  = buildComp(sumVerbal, estQIV,  w.overrides.qiv,  Number(w.rxx.qiv)  || 0.93);
        const qie  = buildComp(sumExec,   estQIE,  w.overrides.qie,  Number(w.rxx.qie)  || 0.94);
        const qit4 = buildComp(sumTotal4, estQIT4, w.overrides.qit4, Number(w.rxx.qit4) || 0.96);
        const qit2 = buildComp(sumTotal2, estQIT2, w.overrides.qit2, Number(w.rxx.qit2) || 0.93);

        // Análise Intra-sujeito e Discrepâncias Clínicas
        const validSubs = [
            { code: 'VOC', name: 'Vocabulário', t: voc.t },
            { code: 'CUB', name: 'Cubos', t: cub.t },
            { code: 'SEM', name: 'Semelhanças', t: sem.t },
            { code: 'RM',  name: 'Raciocínio Matricial', t: rm.t }
        ].filter((s) => s.t !== null);

        let meanT = null, scatterT = null;
        let ipsative = [];
        if (validSubs.length >= 2) {
            const tArr = validSubs.map((s) => s.t);
            meanT = tArr.reduce((a, b) => a + b, 0) / tArr.length;
            scatterT = Math.max(...tArr) - Math.min(...tArr);
            ipsative = validSubs.map((s) => {
                const diff = s.t - meanT;
                let tag = 'Dentro da média pessoal';
                if (diff >= 7) tag = 'Força Relativa Intra-Sujeito (+ ≥ 7 pts T)';
                else if (diff <= -7) tag = 'Fraqueza Relativa Intra-Sujeito (− ≥ 7 pts T)';
                return { code: s.code, name: s.name, t: s.t, diff, tag };
            });
        }

        let deltaVE = null, deltaAlert = null;
        if (qiv.finalQI !== null && qie.finalQI !== null) {
            deltaVE = qiv.finalQI - qie.finalQI;
            const absD = Math.abs(deltaVE);
            const dir = deltaVE > 0 ? 'QIV > QIE (vantagem verbal-cristalizada)' : 'QIE > QIV (vantagem visuoperceptual-fluida)';
            if (absD >= 15) {
                deltaAlert = {
                    level: 'high',
                    text: `Discrepância clinicamente acentuada (Δ = ${fmtSigned(deltaVE, 0)} pontos; ${dir}). Diferença ≥ 15 pontos apresenta baixa frequência na amostra normativa (p < 0,01), sugerindo assimetria funcional importante — recomenda-se interpretar QIV e QIE separadamente com cautela ao resumir pelo QIT-4.`
                };
            } else if (absD >= 10) {
                deltaAlert = {
                    level: 'moderate',
                    text: `Diferença estatisticamente significativa (Δ = ${fmtSigned(deltaVE, 0)} pontos, p < 0,05; ${dir}). Oscilação relevante entre processos verbais e de execução.`
                };
            } else {
                deltaAlert = {
                    level: 'normal',
                    text: `Perfil intelectual harmônico entre os domínios verbal e de execução (Δ = ${fmtSigned(deltaVE, 0)} pontos; |Δ| < 10, sem discrepância estatisticamente significativa). O QIT-4 representa de modo coeso o funcionamento intelectual global.`
                };
            }
        }

        return { voc, cub, sem, rm, qiv, qie, qit4, qit2, meanT, scatterT, ipsative, deltaVE, deltaAlert };
    }

    function computeWechslerIndices(prot) {
        const w = prot.wechsler;
        const rxx = Number(w.rxx) || 0.95;
        const mk = (valStr, customRxx) => {
            const v = parseNumInput(valStr);
            if (v === null) return null;
            const z = qiToZ(v);
            return {
                score: v,
                z,
                metrics: buildMetricsFromZ(z, { polarity: 'SKILL', rxx: customRxx || rxx }),
                ci: calcConfidenceInterval(v, 15, customRxx || rxx, true)
            };
        };

        const icv = mk(w.icv, 0.94);
        const iop = mk(w.iop, 0.93);
        const imo = mk(w.imo, 0.92);
        const ivp = mk(w.ivp, 0.88);
        const qit = mk(w.qit, 0.96);

        // IAG (ICV + IOP) e ICC (IMO + IVP)
        const estIAG = (icv && iop) ? Math.round(100 + 15 * (((icv.score + iop.score) - 200) / 26.2)) : null;
        const estICC = (imo && ivp) ? Math.round(100 + 15 * (((imo.score + ivp.score) - 200) / 25.0)) : null;

        const iagVal = parseNumInput(w.iagManual) !== null ? parseNumInput(w.iagManual) : estIAG;
        const iccVal = parseNumInput(w.iccManual) !== null ? parseNumInput(w.iccManual) : estICC;

        const iag = iagVal !== null ? mk(iagVal, 0.95) : null;
        const icc = iccVal !== null ? mk(iccVal, 0.91) : null;

        let deltaIagIcc = null, iagIccNote = '';
        if (iag && icc) {
            deltaIagIcc = iag.score - icc.score;
            const absD = Math.abs(deltaIagIcc);
            if (deltaIagIcc >= 15) {
                iagIccNote = `Discrepância clínica expressiva IAG > ICC (Δ = +${Math.round(deltaIagIcc)} pts): capacidade intelectual conceitual superior à eficiência de memória operacional e velocidade de processamento — padrão frequentemente associado a sobrecarga atencional/executiva (ex.: TDAH, Dupla Excepcionalidade ou fadiga cognitiva), no qual o IAG estima melhor a inteligência geral que o QIT.`;
            } else if (absD >= 11) {
                iagIccNote = `Diferença estatisticamente significativa entre IAG e ICC (Δ = ${fmtSigned(deltaIagIcc, 0)} pts; p < 0,05).`;
            } else {
                iagIccNote = `Equilíbrio psicométrico entre raciocínio conceitual (IAG) e proficiência operacional/velocidade (ICC) (Δ = ${fmtSigned(deltaIagIcc, 0)} pts).`;
            }
        }

        return { icv, iop, imo, ivp, qit, iag, icc, estIAG, estICC, deltaIagIcc, iagIccNote };
    }

    function computeFdtRow(timeVal, rowCfg, pctConvention) {
        if (timeVal === null || !Number.isFinite(timeVal)) {
            return { time: null, metrics: null, effPctInput: null };
        }
        let z = null;
        let effPctInput = null;
        if (rowCfg.mode === 'PCT') {
            const pIn = parseNumInput(rowCfg.pct);
            if (pIn !== null && pIn > 0 && pIn < 100) {
                effPctInput = pctConvention === 'RAW_TIME'
                    ? Math.min(99.99, Math.max(0.01, 100 - pIn))
                    : pIn;
                z = percentileToZ(effPctInput);
            }
        } else {
            const m = parseNumInput(rowCfg.mean);
            const sd = parseNumInput(rowCfg.sd);
            if (m !== null && sd !== null && sd > 0) {
                // Menor tempo = melhor eficiência neurocognitiva → inversão automática!
                z = (m - timeVal) / sd;
            }
        }
        const metrics = z !== null ? buildMetricsFromZ(z, { polarity: 'SKILL', rxx: 0.88 }) : null;
        return { time: timeVal, z, metrics, effPctInput };
    }

    function computeFdtAll(prot) {
        const f = prot.fdt;
        const conv = f.pctConvention || 'EFFICIENCY';

        const tLeit = parseNumInput(f.leitura.time);
        const tCont = parseNumInput(f.contagem.time);
        const tEsc  = parseNumInput(f.escolha.time);
        const tAlt  = parseNumInput(f.alternancia.time);

        const eLeit = parseNumInput(f.leitura.errors) || 0;
        const eCont = parseNumInput(f.contagem.errors) || 0;
        const eEsc  = parseNumInput(f.escolha.errors) || 0;
        const eAlt  = parseNumInput(f.alternancia.errors) || 0;

        const tInib = (tEsc !== null && tLeit !== null) ? Number((tEsc - tLeit).toFixed(2)) : null;
        const tFlex = (tAlt !== null && tLeit !== null) ? Number((tAlt - tLeit).toFixed(2)) : null;
        const tPureShift = (tAlt !== null && tEsc !== null) ? Number((tAlt - tEsc).toFixed(2)) : null;

        const leitura     = Object.assign(computeFdtRow(tLeit, f.leitura, conv),     { errors: eLeit });
        const contagem    = Object.assign(computeFdtRow(tCont, f.contagem, conv),    { errors: eCont });
        const escolha     = Object.assign(computeFdtRow(tEsc,  f.escolha, conv),     { errors: eEsc });
        const alternancia = Object.assign(computeFdtRow(tAlt,  f.alternancia, conv), { errors: eAlt });
        const inibicao      = computeFdtRow(tInib, f.inibicao, conv);
        const flexibilidade = computeFdtRow(tFlex, f.flexibilidade, conv);

        const errosAuto = eLeit + eCont;
        const errosExec = eEsc + eAlt;

        // Análise automática de dissociação entre Processos Automáticos e Controlados
        let profileSummary = 'Preencha os tempos e parâmetros normativos (M/DP ou Percentil) para análise automática de dissociação executiva.';
        const autoZs = [leitura.z, contagem.z].filter((v) => v !== null && v !== undefined);
        const execZs = [escolha.z, alternancia.z, inibicao.z, flexibilidade.z].filter((v) => v !== null && v !== undefined);

        if (autoZs.length > 0 && execZs.length > 0) {
            const meanAuto = autoZs.reduce((a, b) => a + b, 0) / autoZs.length;
            const meanExec = execZs.reduce((a, b) => a + b, 0) / execZs.length;
            if (meanAuto >= -0.85 && meanExec <= -1.35) {
                profileSummary = `Dissociação Executiva Seletiva detectada: velocidade de processamento automático preservada (Z médio automático = ${fmtSigned(meanAuto)}) contrastando com lentificação significativa nos processos controlados de inibição/flexibilidade (Z médio executivo = ${fmtSigned(meanExec)}; erros executivos = ${errosExec}). Achado compatível com sobrecarga seletiva da rede frontoparietal de controle executivo, sem lentificação basal.`;
            } else if (meanAuto <= -1.35 && meanExec <= -1.35) {
                const inibPreserved = (inibicao.z !== null && inibicao.z > -1.0) && (flexibilidade.z !== null && flexibilidade.z > -1.0);
                profileSummary = inibPreserved
                    ? `Lentificação Basal de Velocidade de Processamento: etapas automáticas reduzidas (Z médio = ${fmtSigned(meanAuto)}), porém os índices líquidos de Inibição e Flexibilidade mostram-se preservados quando descontada a leitura basal.`
                    : `Comprometimento Global (Automático + Executivo): redução tanto na velocidade automática basal (Z médio = ${fmtSigned(meanAuto)}) quanto nos custos executivos controlados (Z médio = ${fmtSigned(meanExec)}; total de erros = ${errosAuto + errosExec}).`;
            } else {
                profileSummary = `Eficiência Atencional e Executiva Preservada: velocidade automática basal (Z médio = ${fmtSigned(meanAuto)}) e processos controlados de controle inibitório e flexibilidade cognitiva (Z médio = ${fmtSigned(meanExec)}) dentro ou acima dos parâmetros normativos esperados.`;
            }
        }

        return {
            leitura, contagem, escolha, alternancia, inibicao, flexibilidade,
            tInib, tFlex, tPureShift, errosAuto, errosExec, profileSummary
        };
    }

    function computeSrs2All(prot) {
        const s = prot.srs2;
        const evalSub = (item) => {
            const raw = parseNumInput(item.raw);
            let t = parseNumInput(item.t);
            if (t === null && raw !== null) {
                const m = parseNumInput(item.mean);
                const sd = parseNumInput(item.sd);
                if (m !== null && sd !== null && sd > 0) {
                    t = 50 + 10 * ((raw - m) / sd);
                }
            }
            const z = t !== null ? tToZ(t) : null;
            const pct = z !== null ? zToPercentile(z) : null;
            const sev = classifySymptomT(t, 'SRS2');
            return { raw, t, z, pct, pctFormatted: formatPercentileClinical(pct), sev };
        };

        const ps  = evalSub(s.ps);
        const cs  = evalSub(s.cs);
        const cos = evalSub(s.cos);
        const ms  = evalSub(s.ms);
        const prr = evalSub(s.prr);

        const allFourSocial = [ps.raw, cs.raw, cos.raw, ms.raw].every((v) => v !== null);
        const cisRaw = allFourSocial ? (ps.raw + cs.raw + cos.raw + ms.raw) : null;
        const prrRaw = prr.raw;
        const totalRaw = (cisRaw !== null && prrRaw !== null) ? (cisRaw + prrRaw) : null;

        const cisT = parseNumInput(s.cisT);
        const totalT = parseNumInput(s.totalT);

        const cisObj = {
            raw: cisRaw,
            t: cisT,
            z: cisT !== null ? tToZ(cisT) : null,
            pctFormatted: cisT !== null ? formatPercentileClinical(zToPercentile(tToZ(cisT))) : '—',
            sev: classifySymptomT(cisT, 'SRS2')
        };

        const totalObj = {
            raw: totalRaw,
            t: totalT,
            z: totalT !== null ? tToZ(totalT) : null,
            pctFormatted: totalT !== null ? formatPercentileClinical(zToPercentile(tToZ(totalT))) : '—',
            sev: classifySymptomT(totalT, 'SRS2')
        };

        return { ps, cs, cos, ms, prr, cisObj, totalObj };
    }

    function computeBpa2All(prot) {
        const b = prot.bpa2;
        const calcSub = (sub) => {
            const h = parseNumInput(sub.hits);
            const e = parseNumInput(sub.errors) || 0;
            const o = parseNumInput(sub.omissions) || 0;
            const pts = h !== null ? (h - e - o) : null;
            let z = null;
            if (sub.mode === 'M_SD') {
                const m = parseNumInput(sub.mean);
                const sd = parseNumInput(sub.sd);
                if (pts !== null && m !== null && sd !== null && sd > 0) {
                    z = (pts - m) / sd;
                }
            } else {
                const p = parseNumInput(sub.pct);
                if (p !== null && p > 0 && p < 100) {
                    z = percentileToZ(p);
                }
            }
            const metrics = z !== null ? buildMetricsFromZ(z, { polarity: 'SKILL', rxx: 0.87 }) : null;
            return { hits: h, errors: e, omissions: o, pts, z, metrics };
        };

        const ac = calcSub(b.ac);
        const ad = calcSub(b.ad);
        const aa = calcSub(b.aa);

        const agPts = (ac.pts !== null && ad.pts !== null && aa.pts !== null) ? (ac.pts + ad.pts + aa.pts) : null;
        let agZ = null;
        if (b.ag.mode === 'M_SD') {
            const m = parseNumInput(b.ag.mean);
            const sd = parseNumInput(b.ag.sd);
            if (agPts !== null && m !== null && sd !== null && sd > 0) agZ = (agPts - m) / sd;
        } else {
            const p = parseNumInput(b.ag.pct);
            if (p !== null && p > 0 && p < 100) agZ = percentileToZ(p);
        }
        const ag = { pts: agPts, z: agZ, metrics: agZ !== null ? buildMetricsFromZ(agZ, { polarity: 'SKILL', rxx: 0.91 }) : null };

        const totalErrors = (ac.hits !== null ? ac.errors : 0) + (ad.hits !== null ? ad.errors : 0) + (aa.hits !== null ? aa.errors : 0);
        const totalOmiss  = (ac.hits !== null ? ac.omissions : 0) + (ad.hits !== null ? ad.omissions : 0) + (aa.hits !== null ? aa.omissions : 0);

        let qualProfile = 'Insira Acertos, Erros e Omissões nas modalidades AC, AD e AA para análise qualitativa do estilo de resposta.';
        if (ac.pts !== null || ad.pts !== null || aa.pts !== null) {
            if (totalErrors === 0 && totalOmiss === 0) {
                qualProfile = 'Alta precisão inibitória e vigilância sustentada (zero erros por comissão e zero omissões registradas).';
            } else if (totalErrors > totalOmiss * 1.5 && totalErrors >= 4) {
                qualProfile = `Predomínio de Erros de Comissão / Impulsividade (${totalErrors} erros vs. ${totalOmiss} omissões): padrão sugestivo de estilo de resposta precipitado ou falha de freio inibitório na varredura visual.`;
            } else if (totalOmiss > totalErrors * 1.5 && totalOmiss >= 4) {
                qualProfile = `Predomínio de Omissões / Desatenção Visual (${totalOmiss} omissões vs. ${totalErrors} erros): padrão sugestivo de lapsos de atenção sustentada, lentificação de rastreio ou flutuação de vigilância.`;
            } else {
                qualProfile = `Distribuição equilibrada entre erros de comissão (${totalErrors}) e omissões (${totalOmiss}), sem viés impulsivo ou inatento desproporcional.`;
            }
        }

        return { ac, ad, aa, ag, totalErrors, totalOmiss, qualProfile };
    }

    function computeRavltAll(prot) {
        const r = prot.ravlt;
        const a1 = parseNumInput(r.a1);
        const a2 = parseNumInput(r.a2);
        const a3 = parseNumInput(r.a3);
        const a4 = parseNumInput(r.a4);
        const a5 = parseNumInput(r.a5);
        const b1 = parseNumInput(r.b1);
        const a6 = parseNumInput(r.a6);
        const a7 = parseNumInput(r.a7);

        const allA1A5 = [a1, a2, a3, a4, a5].every((v) => v !== null);
        const total = allA1A5 ? (a1 + a2 + a3 + a4 + a5) : null;
        const alt = (total !== null && a1 !== null) ? (total - 5 * a1) : null;
        const velEsq = (a7 !== null && a6 !== null && a6 > 0) ? (a7 / a6) : null;
        const ip = (b1 !== null && a1 !== null && a1 > 0) ? (b1 / a1) : null;
        const ir = (a6 !== null && a5 !== null && a5 > 0) ? (a6 / a5) : null;

        const recH = parseNumInput(r.recHits);
        const recFP = parseNumInput(r.recFP) || 0;
        let recNet = null;
        if (recH !== null) {
            if (r.recConvention === 'RAW_50_MINUS_35') {
                recNet = recH - 35;
            } else {
                // Acertos (0–15) + Rejeições Corretas (35 − FP) − 35 ≡ Acertos − FP
                recNet = recH - recFP;
            }
        }

        const evalNorm = (normObj) => {
            if (!normObj) return null;
            const zIn = parseNumInput(normObj.z);
            const pIn = parseNumInput(normObj.pct);
            let z = zIn;
            if (z === null && pIn !== null && pIn > 0 && pIn < 100) {
                z = percentileToZ(pIn);
            }
            return z !== null ? buildMetricsFromZ(z, { polarity: 'SKILL', rxx: 0.85 }) : null;
        };

        const norms = {
            total: evalNorm(r.norms.total),
            alt:   evalNorm(r.norms.alt),
            a6:    evalNorm(r.norms.a6),
            a7:    evalNorm(r.norms.a7),
            rec:   evalNorm(r.norms.rec)
        };

        // Interpretação neuropsicológica automática (Codificação vs. Consolidação Hipocampal vs. Resgate Pré-Frontal)
        let clinicalNote = 'Preencha as evocações A1–A5, B1, A6, A7 e Reconhecimento para análise do perfil mnêmico.';
        if (velEsq !== null) {
            if (velEsq >= 0.75) {
                clinicalNote = `Retenção Episódica Preservada (Velocidade de Esquecimento = ${fmtPlain(velEsq, 2)}): consolidação de longo prazo íntegra após intervalo de 20–30 minutos.`;
            } else if (recNet !== null && recNet >= 11) {
                clinicalNote = `Dissociação Evocação Livre vs. Reconhecimento (Vel. Esquecimento = ${fmtPlain(velEsq, 2)}; Reconhecimento Líquido = ${recNet}/15): queda na evocação livre tardia (A7) revertida mediante pistas de reconhecimento — perfil clássico de falha executiva de resgate/busca estratégica frontoestriatal, com armazenamento hipocampal preservado.`;
            } else {
                clinicalNote = `Declínio de Consolidação / Retenção Tardia (Vel. Esquecimento = ${fmtPlain(velEsq, 2)}): perda significativa do traço mnêmico entre A6 e A7 sem plena recuperação por pistas, sugerindo fragilidade de codificação profunda ou consolidação temporomesial.`;
            }
        }

        return { a1, a2, a3, a4, a5, b1, a6, a7, total, alt, velEsq, ip, ir, recNet, recH, recFP, norms, clinicalNote };
    }

    function computeUniversal() {
        const u = universalState;
        let z = null;
        if (u.entryMode === 'RAW_NORM') {
            const x = parseNumInput(u.raw);
            const m = parseNumInput(u.mean);
            const sd = parseNumInput(u.sd);
            z = calcZFromRaw(x, m, sd, Boolean(u.inverted));
        } else {
            const v = parseNumInput(u.directVal);
            if (v !== null) {
                if (u.directType === 'Z') z = v;
                else if (u.directType === 'PCT' && v > 0 && v < 100) z = percentileToZ(v);
                else if (u.directType === 'T') z = tToZ(v);
                else if (u.directType === 'EP') z = epToZ(v);
                else if (u.directType === 'QI') z = qiToZ(v);
            }
        }
        const rxx = Number(parseNumInput(u.rxx)) || 0.88;
        const metrics = z !== null ? buildMetricsFromZ(z, { polarity: u.polarity, rxx }) : null;
        return { z, rxx, metrics };
    }

    // =========================================================================
    // 4. INTERFACE PRINCIPAL: GESTÃO DE PROTOCOLOS, IDADE EXATA E SUB-ABAS
    // =========================================================================

    function mountShell() {
        const panel = document.getElementById('tab-panel-psicometria');
        if (!panel) return;

        panel.innerHTML = `
            <div class="space-y-5">
                <!-- BARRA SUPERIOR MULTI-PROTOCOLO (LGPD) & IDENTIFICAÇÃO CLÍNICA -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 no-print">
                    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/35 flex items-center justify-center text-cyan-300 shrink-0">
                                <i data-lucide="brain-circuit" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <h2 class="text-sm sm:text-base font-bold text-slate-100 tracking-tight">Estação de Psicometria, Correção &amp; Laudos ABNT / DSM-5-TR</h2>
                                    <span class="hidden lg:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">Acklam Probit + A&amp;S 7.1.26</span>
                                </div>
                                <p class="text-xs text-slate-400">Pastas locais codificadas por iniciais/código (LGPD) • Sincronizadas em <code class="font-mono text-cyan-300">dm_vault_psicometria</code></p>
                            </div>
                        </div>

                        <!-- Controles de Protocolo -->
                        <div class="flex flex-wrap items-center gap-1.5">
                            <span id="psy-save-status-badge" class="px-2 py-1 rounded text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30">✓ Salvo localmente</span>

                            <button type="button" id="btn-psy-save-manual" title="Forçar Salvamento no LocalStorage"
                                class="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs flex items-center gap-1 transition">
                                <i data-lucide="save" class="w-3.5 h-3.5 text-cyan-300"></i>
                                <span class="hidden sm:inline">Salvar</span>
                            </button>

                            <select id="psy-protocol-select" aria-label="Selecionar Protocolo"
                                class="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-cyan-500/40 text-cyan-200 font-mono text-xs font-semibold focus:outline-none focus:border-cyan-400">
                            </select>

                            <button type="button" id="btn-psy-new-prot" title="Novo Protocolo de Avaliação"
                                class="min-h-[38px] px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition">
                                <i data-lucide="folder-plus" class="w-3.5 h-3.5"></i>
                                <span>Novo</span>
                            </button>

                            <button type="button" id="btn-psy-demo-prot" title="Carregar Exemplo Clínico de Demonstração (WASI, FDT, SRS-2, BPA-2, RAVLT)"
                                class="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 text-xs font-semibold flex items-center gap-1 transition">
                                <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                                <span class="hidden sm:inline">Exemplo Clínico</span>
                            </button>

                            <button type="button" id="btn-psy-rename-prot" title="Renomear Código/Iniciais do Protocolo"
                                class="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs flex items-center gap-1 transition">
                                <i data-lucide="pencil" class="w-3.5 h-3.5 text-cyan-300"></i>
                                <span class="hidden sm:inline">Renomear</span>
                            </button>

                            <button type="button" id="btn-psy-dup-prot" title="Duplicar Protocolo Atual"
                                class="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs flex items-center gap-1 transition">
                                <i data-lucide="copy" class="w-3.5 h-3.5 text-emerald-300"></i>
                                <span class="hidden xl:inline">Duplicar</span>
                            </button>

                            <button type="button" id="btn-psy-export-prot" title="Exportar Protocolo Avulso (.json)"
                                class="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-300 text-xs flex items-center gap-1 transition">
                                <i data-lucide="file-down" class="w-3.5 h-3.5"></i>
                                <span class="hidden lg:inline">.JSON</span>
                            </button>

                            <button type="button" id="btn-psy-import-prot" title="Importar Protocolo Avulso (.json)"
                                class="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs flex items-center gap-1 transition">
                                <i data-lucide="file-up" class="w-3.5 h-3.5"></i>
                            </button>
                            <input type="file" id="input-psy-import-prot" accept=".json,application/json" class="hidden">

                            <button type="button" id="btn-psy-del-prot" title="Excluir Protocolo Atual"
                                class="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-1 transition">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Dados Demográficos + Calculadora de Idade Cronológica Exata -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
                        <div>
                            <label class="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">Data de Nascimento</label>
                            <input type="date" id="psy-birth-date"
                                class="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 focus:border-cyan-400 focus:outline-none font-mono text-xs text-slate-100">
                        </div>
                        <div>
                            <label class="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">Data da Avaliação</label>
                            <input type="date" id="psy-eval-date"
                                class="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 focus:border-cyan-400 focus:outline-none font-mono text-xs text-slate-100">
                        </div>
                        <div class="lg:col-span-2">
                            <label class="block text-[11px] font-mono uppercase tracking-wider text-cyan-400 mb-1">Idade Cronológica Exata Calculada</label>
                            <div id="psy-exact-age-box"
                                class="min-h-[38px] px-3 py-1.5 rounded-lg bg-cyan-950/30 border border-cyan-500/35 font-mono text-xs font-bold text-cyan-200 flex items-center justify-between gap-2">
                                <span>—</span>
                            </div>
                        </div>
                        <div>
                            <label class="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">Escolaridade</label>
                            <input type="text" id="psy-schooling" placeholder="Ex.: 4º Ano EF / Superior"
                                class="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 focus:border-cyan-400 focus:outline-none text-xs text-slate-100">
                        </div>
                        <div>
                            <label class="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">Lateralidade / Informante</label>
                            <div class="grid grid-cols-2 gap-1.5">
                                <select id="psy-handedness" aria-label="Lateralidade"
                                    class="min-h-[38px] px-2 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none">
                                    <option value="Destro">Destro</option>
                                    <option value="Canhoto">Canhoto</option>
                                    <option value="Ambidestro">Ambidestro</option>
                                    <option value="Indefinida">Indefinida</option>
                                </select>
                                <input type="text" id="psy-informant" placeholder="Informante"
                                    class="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- PAINEL CLÍNICO: ANAMNESE, OBSERVAÇÃO & FORMULAÇÃO DIAGNÓSTICA (ACIMA DOS BOTÕES DOS TESTES) -->
                <div id="psy-clinical-panel" class="no-print"></div>

                <!-- SUB-NAVEGAÇÃO DE MÓDULOS DE CORREÇÃO -->
                <div id="psy-subtabs-bar" class="flex flex-wrap items-center gap-2 bg-[#0f172a]/90 border border-[#1e293b] rounded-xl p-2 no-print"></div>

                <!-- PAINEL PSICOMÉTRICO SINTÉTICO (KPIs da Bateria Neuropsicológica) -->
                <div id="psy-battery-kpis-bar" class="hidden no-print"></div>

                <!-- CONTAINER DINÂMICO DA SUB-ABA ATIVA -->
                <div id="psy-subtab-viewport"></div>
            </div>
        `;

        bindTopProtocolEvents();
    }

    function renderHeaderAndSubtabs() {
        const C = global.VaultCore;
        const prot = getActiveProtocol();

        const sel = document.getElementById('psy-protocol-select');
        if (sel) {
            sel.innerHTML = appState.protocols.map((p) => {
                const count = (p.report && Array.isArray(p.report.rows)) ? p.report.rows.length : 0;
                const selected = p.id === prot.id ? 'selected' : '';
                return `<option value="${C.esc(p.id)}" ${selected}>${C.esc(p.code)} (${count} med.)</option>`;
            }).join('');
        }

        const bEl = document.getElementById('psy-birth-date');
        const eEl = document.getElementById('psy-eval-date');
        const sEl = document.getElementById('psy-schooling');
        const hEl = document.getElementById('psy-handedness');
        const iEl = document.getElementById('psy-informant');

        if (bEl && document.activeElement !== bEl) bEl.value = prot.birthDate || '';
        if (eEl && document.activeElement !== eEl) eEl.value = prot.evalDate || '';
        if (sEl && document.activeElement !== sEl) sEl.value = prot.schooling || '';
        if (hEl && document.activeElement !== hEl) hEl.value = prot.handedness || 'Destro';
        if (iEl && document.activeElement !== iEl) iEl.value = prot.informant || '';

        updateExactAgeBanner();
        renderBatteryKPIsBar();

        const bar = document.getElementById('psy-subtabs-bar');
        if (bar) {
            const rowCount = prot.report.rows.length;
            bar.innerHTML = SUBTABS.map((tab) => {
                const isActive = appState.activeSubTab === tab.id;
                const activeCls = isActive
                    ? 'bg-cyan-500/15 border-cyan-400/60 text-cyan-200 shadow-md shadow-cyan-500/10'
                    : 'bg-[#090d16]/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700';
                const badge = tab.id === 'laudo'
                    ? `<span class="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono ${rowCount > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}">${rowCount}</span>`
                    : '';
                return `
                    <button type="button" data-psy-subtab="${tab.id}"
                        class="min-h-[38px] px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${activeCls}">
                        <i data-lucide="${tab.icon}" class="w-3.5 h-3.5"></i>
                        <span>${C.esc(tab.label)}</span>
                        ${badge}
                    </button>
                `;
            }).join('');

            bar.querySelectorAll('[data-psy-subtab]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    appState.activeSubTab = btn.getAttribute('data-psy-subtab');
                    saveState();
                    renderAll();
                });
            });
        }
    }

    function updateExactAgeBanner() {
        const prot = getActiveProtocol();
        const box = document.getElementById('psy-exact-age-box');
        if (!box) return;
        const age = calcChronologicalAge(prot.birthDate, prot.evalDate);
        if (!age) {
            box.innerHTML = `<span class="text-slate-400 font-normal">Informe nascimento e avaliação válidos</span>`;
            return;
        }
        box.innerHTML = `
            <span class="truncate">${global.VaultCore.esc(age.formatted)}</span>
            <span class="px-2 py-0.5 rounded bg-slate-900/90 border border-cyan-500/30 text-[10px] text-cyan-300 shrink-0">${age.totalMonths} meses</span>
        `;
    }

    function renderBatteryKPIsBar() {
        const bar = document.getElementById('psy-battery-kpis-bar');
        if (!bar) return;
        const prot = getActiveProtocol();
        const C = global.VaultCore;

        const chips = [];

        // WASI QIT
        const wRows = (prot.report.rows || []).filter(r => r.tool && r.tool.includes('WASI'));
        const qitRow = wRows.find(r => r.measure && r.measure.includes('QIT'));
        if (qitRow && qitRow.z !== undefined) {
            chips.push({
                subtab: 'wasi',
                label: `WASI: ${qitRow.measure} = ${qitRow.derived || qitRow.raw} (Z: ${qitRow.z >= 0 ? '+' : ''}${C.formatNum(qitRow.z, 2)})`,
                badge: qitRow.classBadge || 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
            });
        }

        // FDT Inibição
        const fdtRows = (prot.report.rows || []).filter(r => r.tool && r.tool.includes('FDT'));
        const fdtInib = fdtRows.find(r => r.measure && r.measure.includes('Inibição'));
        if (fdtInib && fdtInib.z !== undefined) {
            chips.push({
                subtab: 'fdt',
                label: `FDT Inibição: Z ${fdtInib.z >= 0 ? '+' : ''}${C.formatNum(fdtInib.z, 2)} (${fdtInib.classLabel || 'Médio'})`,
                badge: fdtInib.classBadge || 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
            });
        }

        // SRS-2 Total T
        const srsRows = (prot.report.rows || []).filter(r => r.tool && r.tool.includes('SRS-2'));
        const srsTot = srsRows.find(r => r.measure && (r.measure.includes('Total') || r.measure.includes('Escore Total')));
        if (srsTot) {
            chips.push({
                subtab: 'srs2',
                label: `SRS-2 Total: T = ${srsTot.derived || srsTot.raw} (${srsTot.classLabel})`,
                badge: srsTot.classBadge || 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            });
        }

        // BPA-2 AG
        const bpaRows = (prot.report.rows || []).filter(r => r.tool && r.tool.includes('BPA-2'));
        const bpaAg = bpaRows.find(r => r.measure && r.measure.includes('Atenção Geral'));
        if (bpaAg) {
            chips.push({
                subtab: 'bpa_ravlt',
                label: `BPA-2 Atenção Geral: Z ${bpaAg.z >= 0 ? '+' : ''}${C.formatNum(bpaAg.z, 2)} (${bpaAg.classLabel})`,
                badge: bpaAg.classBadge || 'bg-sky-500/15 text-sky-300 border-sky-500/30'
            });
        }

        // RAVLT A7
        const ravltRows = (prot.report.rows || []).filter(r => r.tool && r.tool.includes('RAVLT'));
        const ravltA7 = ravltRows.find(r => r.measure && (r.measure.includes('A7') || r.measure.includes('Evocação Tardia')));
        if (ravltA7) {
            chips.push({
                subtab: 'bpa_ravlt',
                label: `RAVLT Memória Tardia: Z ${ravltA7.z >= 0 ? '+' : ''}${C.formatNum(ravltA7.z, 2)} (${ravltA7.classLabel})`,
                badge: ravltA7.classBadge || 'bg-purple-500/15 text-purple-300 border-purple-500/30'
            });
        }

        if (chips.length === 0) {
            bar.innerHTML = '';
            bar.className = 'hidden';
            return;
        }

        bar.className = 'bg-[#090d16] border border-slate-800 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono no-print';
        bar.innerHTML = `
            <div class="flex items-center gap-1.5 text-slate-400">
                <i data-lucide="gauge" class="w-4 h-4 text-cyan-400"></i>
                <span class="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Resumo Psicométrico da Bateria:</span>
            </div>
            <div class="flex flex-wrap items-center gap-1.5">
                ${chips.map(c => `
                    <button type="button" data-kpi-subtab="${c.subtab}" class="px-2.5 py-1 rounded-md text-[11px] font-semibold border ${c.badge} hover:brightness-125 transition" title="Clique para navegar até o instrumento">
                        ${C.esc(c.label)}
                    </button>
                `).join('')}
            </div>
        `;

        bar.querySelectorAll('[data-kpi-subtab]').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSubtab = btn.getAttribute('data-kpi-subtab');
                appState.activeSubTab = targetSubtab;
                saveState();
                renderAll();
            });
        });

        C.refreshIcons(bar);
    }

    // =========================================================================
    // 4.1. PAINEL CLÍNICO QUALITATIVO: TRIAGEM POR IA, ANAMNESE & LAUDOS
    // =========================================================================

    const RAW_DUMP_SAMPLE = `Examinando L. M., 9 anos, destro, cursando o 4º ano do Ensino Fundamental em escola privada.
Mãe e professora coordenadora relatam que a criança apresenta extrema dificuldade em manter o foco em sala de aula, perde com frequência materiais (estojo, apostilas, casaco), esquece recados e tem oscilação marcante nas notas, necessitando de mediação individual constante para iniciar e finalizar as tarefas propostas.
Na anamnese com os pais: gestação sem intercorrências, parto cesáreo a termo (39 semanas). Marcos do desenvolvimento psicomotor: marcha independente aos 12 meses e primeiras palavras aos 13 meses. Sono regular, sem enurese ou parassonias.
Histórico familiar: o pai relata que na infância era considerado muito disperso, agitado e tinha dificuldades escolares parecidas. Nega histórico de epilepsia ou deficiência intelectual na família.
Nas sessões presenciais de avaliação: o examinando compareceu pontual, mostrou-se afetuoso, comunicativo e com bom contato visual. Contudo, em provas com alta demanda de esforço mental sustentado e tarefas cronometradas (FDT e BPA-2), exibiu inquietação psicomotora marcante (mudava de posição na cadeira a todo instante, mexia nos pés e objetos da mesa) e estilo de resposta precipitado/impulsivo, embora aceitasse bem comandos para refazer e elogios contingentes.`;

    /**
     * Motor Heurístico Local de Processamento de Linguagem Natural (PLN) para Neuropsicologia
     * Funciona 100% client-side, offline, seguro e em conformidade estrita com a LGPD
     */
    function processClinicalTextHeuristically(rawText, prot) {
        const text = String(rawText || '').trim();
        if (!text) {
            return {
                referralReason: '',
                anamneseHistory: '',
                familyHistory: '',
                behaviorObservation: '',
                diagnosticHypotheses: '',
                recommendations: '',
                demographics: {}
            };
        }

        // 1. Extração Demográfica Automática
        const demographics = {};
        const ageMatch = text.match(/(\d{1,2})\s*anos/i);
        if (ageMatch) demographics.age = parseInt(ageMatch[1], 10);

        const schoolMatch = text.match(/(\d{1,2})[ºº°]\s*ano(?:\s*do\s*ensino\s*fundamental)?/i) ||
                            text.match(/ensino\s*(?:fundamental|médio|superior)/i);
        if (schoolMatch) demographics.schooling = schoolMatch[0];

        const handMatch = text.match(/\b(destr[oa]|canhot[oa]|ambidestr[oa])\b/i);
        if (handMatch) {
            const h = handMatch[1].toLowerCase();
            demographics.handedness = h.startsWith('destr') ? 'Destro' : (h.startsWith('canhot') ? 'Canhoto' : 'Ambidestro');
        }

        const infoMatch = text.match(/(?:mãe|pai|pais|professora?|escola|neuropediatra|genitores)/gi);
        if (infoMatch && infoMatch.length > 0) {
            const uniqueInfo = [...new Set(infoMatch.map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()))];
            demographics.informant = uniqueInfo.join(' e ');
        }

        // 2. Classificação de Sentenças em 6 Eixos Temáticos
        const rawSentences = text
            .split(/(?<=[.!?;\n])\s+/)
            .map((s) => s.trim())
            .filter((s) => s.length > 5);

        const buckets = {
            queixa: [],
            anamnese: [],
            family: [],
            behavior: [],
            hypotheses: [],
            recommendations: []
        };

        const KEYWORDS = {
            queixa: [
                'queixa', 'encaminh', 'motivo', 'procura', 'relat', 'escola', 'professora', 'professores',
                'desaten', 'dispers', 'foco', 'distra', 'concentra', 'perde', 'material', 'caderno', 'tarefa',
                'rendimento', 'nota', 'dificuldade', 'lentid', 'esquec', 'não para', 'inquiet', 'agita'
            ],
            anamnese: [
                'gesta', 'parto', 'cesár', 'normal', 'termo', 'semana', 'prematur', 'apgar', 'nasceu',
                'marcha', 'andou', 'passos', 'fala', 'palavra', 'linguagem', 'marco', 'desenvolvimento',
                'sono', 'dorme', 'alimenta', 'desfralde', 'fralda', 'enurese', 'retenç', 'repet'
            ],
            family: [
                'pai', 'mãe', 'pais', 'família', 'familiar', 'irmã', 'irmão', 'parente', 'patern', 'matern',
                'antecedente', 'genitor', 'crise', 'convuls', 'epilepsia', 'exame', 'audiometr', 'audiç',
                'visão', 'oftalmo', 'eeg', 'ressonânc', 'remédio', 'medicaç', 'nega histórico'
            ],
            behavior: [
                'sessão', 'sessões', 'consultório', 'avaliaç', 'examinador', 'apresentou', 'postura',
                'contato visual', 'olhar', 'cadeira', 'mesa', 'inquiet', 'mexia', 'perna', 'lápis',
                'impulsiv', 'pressa', 'precipit', 'frustra', 'tolerânc', 'desisti', 'cansou', 'fadiga',
                'colaborativ', 'afetuos', 'comunicativ', 'engajad', 'cooperativ', 'intermitente'
            ],
            hypotheses: [
                'hipótese', 'diagnóstic', 'suspeita', 'compatível', 'dsm', 'cid', 'tdah', 'tea', 'autismo',
                'dislexia', 'aprendizagem', 'altas habilidades', 'superdotaç', 'transtorno', 'déficit'
            ],
            recommendations: [
                'recomenda', 'indic', 'orienta', 'encaminh', 'intervenç', 'terapia', 'tcc', 'aba',
                'fono', 'psicopedag', 'neuropediatra', 'psiquiatra', 'adaptaç', 'tempo adicional', 'rotina'
            ]
        };

        rawSentences.forEach((sentence) => {
            const lower = sentence.toLowerCase();
            let bestCategory = null;
            let maxScore = 0;

            for (const [cat, words] of Object.entries(KEYWORDS)) {
                let score = 0;
                words.forEach((w) => {
                    if (lower.includes(w)) score += (cat === 'family' && (w === 'pai' || w === 'mãe') ? 1.4 : 1);
                });
                if (score > maxScore) {
                    maxScore = score;
                    bestCategory = cat;
                }
            }

            if (bestCategory && maxScore > 0) {
                buckets[bestCategory].push(sentence);
            } else {
                if (lower.includes('sessão') || lower.includes('teste')) buckets.behavior.push(sentence);
                else if (lower.includes('escola') || lower.includes('dia')) buckets.queixa.push(sentence);
                else buckets.anamnese.push(sentence);
            }
        });

        const referralReason = buckets.queixa.length > 0
            ? buckets.queixa.join(' ')
            : 'Avaliação neuropsicológica solicitada para investigação diagnóstica detalhada do perfil atencional, executivo, cognitivo e comportamental.';

        const anamneseHistory = buckets.anamnese.length > 0
            ? buckets.anamnese.join(' ')
            : 'Marcos do desenvolvimento psicomotor e trajetória escolar sem histórico de intercorrências atípicas marcantes pregressas.';

        const familyHistory = buckets.family.length > 0
            ? buckets.family.join(' ')
            : 'Histórico familiar e antecedentes de saúde sem relatos de síndromes congênitas ou eventos neurológicos graves na linhagem direta.';

        const behaviorObservation = buckets.behavior.length > 0
            ? buckets.behavior.join(' ')
            : 'O examinando compareceu pontualmente às sessões avaliativas, mantendo contato visual adequado, boa vinculação com o examinador e disposição colaborativa frente aos testes.';

        // 3. Formulação Heurística de Hipótese Diagnóstica (DSM-5-TR / CID-11)
        const fullLower = text.toLowerCase();
        let diagHypothesis = '';
        let recs = '';

        if (fullLower.includes('tdah') || (fullLower.includes('desaten') && fullLower.includes('inquiet')) || fullLower.includes('impulsiv')) {
            diagHypothesis = 'A convergência entre os relatos de anamnese, a observação comportamental clínica nas sessões e as queixas escolares/cotidianas aponta perfil compatível com os critérios do DSM-5-TR (314.01) e CID-11 (6A05.2) para Transtorno do Déficit de Atenção com Hiperatividade (TDAH), Apresentação Combinada, com impacto funcional evidente no controle inibitório e na sustentação atencional.';
            recs = '1. Encaminhamento a Neuropediatra / Psiquiatra da Infância para avaliação médica integrativa e definição de conduta terapêutica.\n2. Psicoterapia Cognitivo-Comportamental (TCC) voltada ao desenvolvimento de autorregulação e funções executivas.\n3. Plano de Suporte Pedagógico Escolar: fragmentação de atividades longas, assento preferencial na primeira fileira e tempo estendido (25% a 50%) em avaliações formais.\n4. Orientação parental para rotinas externas estruturadas e previsíveis em domicílio.';
        } else if (fullLower.includes('tea') || fullLower.includes('autis') || fullLower.includes('social') || fullLower.includes('rigidez')) {
            diagHypothesis = 'Os achados qualitativos da anamnese e a observação clínica convergem para hipótese diagnóstica de Transtorno do Espectro Autista (TEA), Nível 1 de Suporte (DSM-5-TR: 299.00 / CID-11: 6A02.0), evidenciado por peculiaridades na reciprocidade socioemocional e padrões de rigidez cognitiva/comportamental.';
            recs = '1. Acompanhamento médico especializado (Neurologista / Psiquiatra da Infância) para consolidação diagnóstica interdisciplinar.\n2. Psicoterapia baseada em ABA ou TCC focada em flexibilidade cognitiva e habilidades sociais.\n3. Suporte fonoaudiológico voltado à pragmática da comunicação.\n4. Acomodações sensoriais e rotinas escolares visualmente estruturadas.';
        } else if (fullLower.includes('dislex') || fullLower.includes('leitura') || fullLower.includes('escrita') || fullLower.includes('alfabetiz')) {
            diagHypothesis = 'Quadro clínico compatível com Transtorno Específico da Aprendizagem, com prejuízo na leitura (Dislexia do Desenvolvimento) e/ou na expressão escrita (DSM-5-TR: 315.00 / CID-11: 6A03.0), na presença de potencial cognitivo global preservado.';
            recs = '1. Intervenção fonoaudiológica e psicopedagógica continuada baseada no método fônico e instrução multissensorial.\n2. Adaptações avaliativas na escola: leitor de apoio, avaliações orais e dispensa de penalização em ortografia.\n3. Acompanhamento psicológico preventivo de ansiedade de desempenho acadêmico.';
        } else if (fullLower.includes('burnout') || fullLower.includes('cansaço') || fullLower.includes('trabalho') || fullLower.includes('sobrecarga')) {
            diagHypothesis = 'Sintomas neurocognitivos compatíveis com sobrecarga executiva e esgotamento emocional (Síndrome de Burnout / CID-11: QD85), com impacto secundário sobre a memória operacional e a sustentação atencional, sem evidência de transtorno neurocognitivo primário.';
            recs = '1. Acompanhamento médico para avaliação de ansiedade, regulação do humor e higiene do sono.\n2. Psicoterapia Cognitivo-Comportamental com foco em manejo de estresse ocupacional.\n3. Reorganização de rotina diária com pausas cognitivas programadas durante a jornada.';
        } else {
            diagHypothesis = 'Os dados clínicos apontam funcionamento cognitivo e adaptativo global preservado, recomendando-se monitoramento preventivo das demandas ambientais e estimulação neuropsicológica habitual.';
            recs = '1. Manutenção de estímulos psicopedagógicos e cognitivos adequados à faixa etária.\n2. Acompanhamento do desenvolvimento em consultas clínicas de rotina.';
        }

        if (buckets.hypotheses.length > 0) {
            diagHypothesis = buckets.hypotheses.join(' ') + '\n\n' + diagHypothesis;
        }
        if (buckets.recommendations.length > 0) {
            recs = buckets.recommendations.join('\n') + '\n\n' + recs;
        }

        return {
            referralReason,
            anamneseHistory,
            familyHistory,
            behaviorObservation,
            diagnosticHypotheses: diagHypothesis,
            recommendations: recs,
            demographics
        };
    }

    /**
     * Orquestrador de IA: Tenta Gemini 2.5 Flash com Fallback Heurístico Local transparente
     */
    async function parseRawClinicalTextWithAI(rawText, prot) {
        const C = global.VaultCore;
        const text = String(rawText || '').trim();
        if (!text) {
            throw new Error('Insira o texto corrido da entrevista para que a IA possa processar.');
        }

        const profile = (C && C.store && typeof C.store.getProfile === 'function') ? C.store.getProfile() : {};
        const apiKey = (profile && profile.geminiApiKey) ? String(profile.geminiApiKey).trim() : '';

        // Se NÃO houver chave cadastrada, usa o Motor Heurístico Local (100% offline e rápido)
        if (!apiKey) {
            return {
                mode: 'HEURISTIC_LOCAL',
                data: processClinicalTextHeuristically(text, prot)
            };
        }

        // Se HOUVER chave cadastrada, chama a API Gemini 2.5 Flash
        try {
            const prompt = `Você é um Neuropsicólogo Clínico Sênior (membro da SBNp e especialista pelo Conselho Federal de Psicologia).
O profissional forneceu as seguintes anotações brutas e livres de entrevista clínica, anamnese e observações das sessões (em texto corrido):

"""
${text}
"""

Sua tarefa é separar, catalogar, filtrar e redigir essas informações nos 5 eixos técnicos do laudo neuropsicológico (em linguagem formal, acadêmica e rigorosa nosológica DSM-5-TR / CID-11).
Além disso, extraia informações demográficas se mencionadas no texto.

Responda EXCLUSIVAMENTE com um objeto JSON válido (sem delimitadores markdown, sem texto antes ou depois) no seguinte formato:
{
  "demographics": {
    "approxAge": 9,
    "schooling": "4º Ano do Ensino Fundamental",
    "handedness": "Destro",
    "informant": "Mãe e Professora"
  },
  "referralReason": "Queixa principal, motivos do encaminhamento e objetivos da avaliação formal.",
  "anamneseHistory": "Marcos do desenvolvimento neuropsicomotor, parto, linguagem, histórico escolar e rotina.",
  "familyHistory": "Antecedentes familiares de transtornos neuropsiquiátricos, exames médicos e histórico de saúde.",
  "behaviorObservation": "Observações comportamentais durante as sessões (contato visual, persistência, tolerância à frustração, impulsividade motora/verbal e fadiga cognitiva).",
  "diagnosticHypotheses": "Síntese integrativa e hipóteses diagnósticas alinhadas aos critérios do DSM-5-TR e CID-11 fundamentadas nas queixas e observações.",
  "recommendations": "Diretrizes terapêuticas, encaminhamentos interdisciplinares, suporte pedagógico escolar e orientações parentais."
}`;

            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
            const resp = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.2,
                        maxOutputTokens: 2200,
                        responseMimeType: 'application/json'
                    }
                })
            });

            if (!resp.ok) {
                const errData = await resp.json().catch(() => ({}));
                const msg = (errData.error && errData.error.message) || `HTTP ${resp.status}`;
                console.warn('[Nexus Vault] Chamada Gemini API falhou, acionando motor heurístico local:', msg);
                return {
                    mode: 'HEURISTIC_FALLBACK',
                    data: processClinicalTextHeuristically(text, prot),
                    apiError: msg
                };
            }

            const resJson = await resp.json();
            const textResponse = (
                resJson.candidates &&
                resJson.candidates[0] &&
                resJson.candidates[0].content &&
                resJson.candidates[0].content.parts &&
                resJson.candidates[0].content.parts.map((p) => p.text || '').join('\n')
            ) || '';

            const parsed = JSON.parse(textResponse.replace(/^```json/i, '').replace(/```$/i, '').trim());
            return {
                mode: 'GEMINI_AI',
                data: parsed
            };
        } catch (err) {
            console.warn('[Nexus Vault] Erro no processamento Gemini, utilizando fallback heurístico:', err);
            return {
                mode: 'HEURISTIC_FALLBACK',
                data: processClinicalTextHeuristically(text, prot),
                apiError: err.message
            };
        }
    }

    const CLINICAL_PRESETS = {
        tdah: {
            label: 'Modelo TDAH (Criança / Adolescente)',
            referralReason: 'Encaminhado(a) por neuropediatra e coordenação pedagógica escolar devido a queixas persistentes de desatenção em sala de aula, oscilação acentuada no rendimento acadêmico, impulsividade motora, perda recorrente de materiais e dificuldade para iniciar e concluir atividades que exigem esforço mental sustentado.',
            anamneseHistory: 'Nascido(a) de parto cesáreo a termo (39 semanas), sem intercorrências pré ou perinatais. Marcos neuropsicomotores preservados: marcha independente aos 12 meses e aquisição de linguagem típica aos 14 meses. Sono regular. No contexto escolar, professores relatam inquietação física, necessidade de constantes intervenções verbais para manter o foco e lentidão na cópia em razão de dispersão frequente.',
            familyHistory: 'Genitor com relato retrospectivo de dificuldade atencional e inquietação motora na idade escolar, sem diagnóstico ou intervenção formal. Ausência de histórico familiar de doenças neurodegenerativas, crises convulsivas ou deficiência intelectual.',
            behaviorObservation: 'Apresentou-se receptivo(a), colaborativo(a) e com bom engajamento com o examinador. Contato visual adequado e discurso coerente. Durante tarefas cognitivas de maior demanda atencional e executiva sustentada, exibiu inquietação psicomotora (mudanças contínuas de postura, rotação de materiais), impaciência em itens cronometrados e estilo de resposta predominantemente impulsivo (FDT e BPA-2), beneficiando-se claramente de pausas breves estruturadas e reforçamento verbal contingente.',
            diagnosticHypotheses: 'A integração dos dados qualitativos (anamnese e observação comportamental clínica) com os achados psicométricos aponta perfil compatível com os critérios do DSM-5-TR (314.01) e CID-11 (6A05.2) para Transtorno do Déficit de Atenção com Hiperatividade (TDAH), Apresentação Combinada. Evidencia-se discrepância significativa entre capacidade intelectual global preservada e fragilidades marcantes no controle inibitório, flexibilidade mental e sustentação atencional.',
            recommendations: '1. Encaminhamento a Neuropediatra/Psiquiatra da Infância para avaliação médica integrativa e discussão de plano terapêutico interdisciplinar.\n2. Psicoterapia Cognitivo-Comportamental (TCC) voltada ao desenvolvimento de autorregulação e funções executivas.\n3. Plano de Suporte Pedagógico Escolar: fragmentação de tarefas extensas, assento preferencial na primeira fileira e tempo estendido (25% a 50%) em avaliações formais.\n4. Orientação parental para rotinas externas estruturadas e previsíveis.'
        },
        tea: {
            label: 'Modelo TEA (Socioemocional / Sensorial)',
            referralReason: 'Encaminhado(a) para investigação neuropsicológica especializada diante de dificuldades persistentes na reciprocidade socioemocional, comportamentos e interesses circunscritos, rigidez cognitiva a mudanças de rotina e reatividade sensorial atípica relatada pela família e escola.',
            anamneseHistory: 'Gestação sem intercorrências. Marcos motores atingidos na época esperada. No desenvolvimento da comunicação, relata-se atraso sutil no surgimento da linguagem funcional e predomínio de ecolalias transitórias na primeira infância. Dificuldade histórica em iniciar e manter brincadeiras colaborativas com pares, demonstrando preferência por atividades solitárias e estruturadas.',
            familyHistory: 'Histórico familiar materno de traços do fenótipo ampliado do autismo (rigidez cognitiva e preferência por isolamento social). Ausência de histórico de síndromes genéticas ou epilepsia.',
            behaviorObservation: 'Apresentou contato visual intermitente e modulado de maneira atípica. Discurso com prosódia particular e repertório lexical rebuscado. Em tarefas com regras estritas e bem delimitadas, exibiu excelente adesão; diante de instruções abertas ou imprevistos, demonstrou ansiedade e rigidez cognitiva. Sensibilidade perceptiva moderada a ruídos ambientais.',
            diagnosticHypotheses: 'Os achados da anamnese, observação clínica e instrumentos dimensionais de responsividade social (SRS-2) convergem para hipótese diagnóstica de Transtorno do Espectro Autista (TEA), Nível 1 de Suporte (DSM-5-TR: 299.00 / CID-11: 6A02.0), sem comprometimento intelectual associado.',
            recommendations: '1. Acompanhamento com Neuropediatra / Psiquiatra da Infância para consolidação diagnóstica interdisciplinar.\n2. Psicoterapia baseada em Análise do Comportamento Aplicada (ABA) ou TCC focada em habilidades sociais e flexibilidade cognitiva.\n3. Suporte fonoaudiológico voltado à pragmática da comunicação.\n4. Adequação ambiental escolar e acomodações sensoriais na rotina diária.'
        },
        aprendizagem: {
            label: 'Modelo Dificuldades de Aprendizagem / Dislexia',
            referralReason: 'Encaminhado(a) por psicopedagoga institucional devido a dificuldades acentuadas e persistentes na decodificação leitora, fluência de leitura e precisão ortográfica, em discrepância com o nível intelectual geral e oportunidades pedagógicas adequadas.',
            anamneseHistory: 'Desenvolvimento motor e linguístico prévio adequado. Dificuldades tornaram-se evidentes a partir da alfabetização formal (1º e 2º anos), com trocas fonológicas na escrita, lentidão na correspondência grafema-fonema e necessidade contínua de apoio especializado para aquisição de leitura.',
            familyHistory: 'Histórico paterno de dificuldades severas na aquisição de leitura e escrita durante a infância e adolescência escolar.',
            behaviorObservation: 'Examinando colaborativo, persistente em tarefas não-verbais e visuoespaciais. Diante de estímulos envolvendo leitura e escrita, demonstrou ansiedade, postura esquiva e esforço compensatório evidente com fadiga precoce.',
            diagnosticHypotheses: 'Quadro clínico compatível com Transtorno Específico da Aprendizagem, com prejuízo na leitura (Dislexia do Desenvolvimento) e prejuízo na expressão escrita (DSM-5-TR: 315.00 / CID-11: 6A03.0), na presença de potencial cognitivo global preservado.',
            recommendations: '1. Intervenção fonoaudiológica e psicopedagógica baseada no método fônico e instrução multissensorial estruturada.\n2. Adaptações avaliativas escolares (leitor de apoio ou avaliações orais, dispensa de penalização em ortografia).\n3. Reforço positivo da autoeficácia acadêmica e acompanhamento psicológico preventivo de ansiedade de desempenho.'
        },
        adulto: {
            label: 'Modelo Adulto (Sobrecarga / Queixa de Memória)',
            referralReason: 'Autoencaminhamento / Encaminhamento médico com queixas de declínio subjetivo na atenção, falhas frequentes de memória prospectiva no trabalho, fadiga mental e sensação crônica de sobrecarga executiva no cotidiano profissional.',
            anamneseHistory: 'Adulto em atividade profissional plena. Relata aumento substancial de demandas de trabalho nos últimos 12 meses associado a padrão de sono irregular, privação crônica de repouso e sintomas compatíveis com esgotamento ocupacional (Burnout).',
            familyHistory: 'Sem histórico familiar de demência precoce. Histórico familiar de transtornos do humor e ansiedade.',
            behaviorObservation: 'Postura colaborativa, discurso articulado e autocrítico quanto ao próprio desempenho. Ansiedade antecipatória evidente em subtestes de memória e cronometrados, solicitando frequente confirmação de correção pelo examinador.',
            diagnosticHypotheses: 'O perfil psicométrico evidencia preservação das funções corticais superiores e integridade mnemônica, com flutuações secundárias em tarefas de alta carga de memória de trabalho e controle atencional, configurando impacto de Sintomas Ansiosos / Esgotamento Ocupacional (CID-11: QD85) sobre as Funções Executivas, sem evidência de transtorno neurocognitivo primário.',
            recommendations: '1. Acompanhamento médico para manejo clínico dos sintomas de ansiedade e regulação do sono.\n2. Psicoterapia Cognitivo-Comportamental com foco em manejo de estresse ocupacional e regulação emocional.\n3. Estruturação de rotinas de higiene do sono e pausas cognitivas programadas durante a jornada de trabalho.'
        }
    };

    function countClinicalFilled(cd) {
        if (!cd) return 0;
        let count = 0;
        if (cd.referralReason && cd.referralReason.trim()) count++;
        if (cd.anamneseHistory && cd.anamneseHistory.trim()) count++;
        if (cd.familyHistory && cd.familyHistory.trim()) count++;
        if (cd.behaviorObservation && cd.behaviorObservation.trim()) count++;
        if ((cd.diagnosticHypotheses && cd.diagnosticHypotheses.trim()) || (cd.recommendations && cd.recommendations.trim())) count++;
        return count;
    }

    function renderClinicalPanel() {
        const host = document.getElementById('psy-clinical-panel');
        if (!host) return;
        const C = global.VaultCore;
        const prot = getActiveProtocol();
        const cd = prot.clinicalData;
        const filledCount = countClinicalFilled(cd);
        const isCollapsed = Boolean(cd.isCollapsed);
        const activeTab = cd.activeTab || 'smart_dump';

        const profile = (C && C.store && typeof C.store.getProfile === 'function') ? C.store.getProfile() : {};
        const hasGeminiKey = Boolean(profile && profile.geminiApiKey && String(profile.geminiApiKey).trim());

        const hasQ = Boolean(cd.referralReason && cd.referralReason.trim());
        const hasA = Boolean(cd.anamneseHistory && cd.anamneseHistory.trim());
        const hasF = Boolean(cd.familyHistory && cd.familyHistory.trim());
        const hasB = Boolean(cd.behaviorObservation && cd.behaviorObservation.trim());
        const hasH = Boolean((cd.diagnosticHypotheses && cd.diagnosticHypotheses.trim()) || (cd.recommendations && cd.recommendations.trim()));

        const dot = (filled) => filled
            ? `<span class="w-2 h-2 rounded-full bg-emerald-400 inline-block shadow-sm shadow-emerald-400/50"></span>`
            : `<span class="w-2 h-2 rounded-full bg-slate-700 inline-block"></span>`;

        let bodyHtml = '';
        if (!isCollapsed) {
            let activeContent = '';

            // ABA 1: SMART DUMP (TEXTO CORRIDO COM IA)
            if (activeTab === 'smart_dump') {
                const catalogCards = filledCount > 0 ? `
                    <div class="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                    ✓ Catalogação Ativa (${filledCount}/5 eixos)
                                </span>
                                <span class="text-xs font-semibold text-slate-200">Resultados da Triagem &amp; Rascunho do Laudo Gerado:</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <button type="button" id="btn-psy-dump-go-laudo"
                                    class="min-h-[34px] px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-cyan-500/20">
                                    <i data-lucide="printer" class="w-3.5 h-3.5"></i>
                                    <span>Ver Laudo Completo na Sub-aba F &rarr;</span>
                                </button>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                            <div class="p-3 rounded-xl bg-[#090d16] border border-slate-800 space-y-1">
                                <div class="flex items-center justify-between text-cyan-300 font-bold text-[11px]">
                                    <span>1. Queixa &amp; Encaminhamento</span>
                                    ${dot(hasQ)}
                                </div>
                                <p class="text-slate-300 line-clamp-3 text-[11px] leading-relaxed">${C.esc(cd.referralReason || 'Pendente de triagem.')}</p>
                            </div>

                            <div class="p-3 rounded-xl bg-[#090d16] border border-slate-800 space-y-1">
                                <div class="flex items-center justify-between text-cyan-300 font-bold text-[11px]">
                                    <span>2. Anamnese &amp; Desenvolvimento</span>
                                    ${dot(hasA)}
                                </div>
                                <p class="text-slate-300 line-clamp-3 text-[11px] leading-relaxed">${C.esc(cd.anamneseHistory || 'Pendente de triagem.')}</p>
                            </div>

                            <div class="p-3 rounded-xl bg-[#090d16] border border-slate-800 space-y-1">
                                <div class="flex items-center justify-between text-cyan-300 font-bold text-[11px]">
                                    <span>3. Antecedentes &amp; Saúde</span>
                                    ${dot(hasF)}
                                </div>
                                <p class="text-slate-300 line-clamp-3 text-[11px] leading-relaxed">${C.esc(cd.familyHistory || 'Pendente de triagem.')}</p>
                            </div>

                            <div class="p-3 rounded-xl bg-[#090d16] border border-slate-800 space-y-1">
                                <div class="flex items-center justify-between text-emerald-300 font-bold text-[11px]">
                                    <span>4. Observação na Sessão</span>
                                    ${dot(hasB)}
                                </div>
                                <p class="text-slate-300 line-clamp-3 text-[11px] leading-relaxed">${C.esc(cd.behaviorObservation || 'Pendente de triagem.')}</p>
                            </div>

                            <div class="p-3 rounded-xl bg-[#090d16] border border-slate-800 space-y-1 lg:col-span-2">
                                <div class="flex items-center justify-between text-amber-300 font-bold text-[11px]">
                                    <span>5. Hipóteses Diagnósticas (DSM-5-TR) &amp; Recomendações</span>
                                    ${dot(hasH)}
                                </div>
                                <p class="text-slate-300 line-clamp-3 text-[11px] leading-relaxed">${C.esc(cd.diagnosticHypotheses || cd.recommendations || 'Pendente de triagem.')}</p>
                            </div>
                        </div>
                    </div>
                ` : '';

                activeContent = `
                    <div class="space-y-3">
                        <div class="flex flex-wrap items-center justify-between gap-2 bg-[#090d16]/80 p-3 rounded-xl border border-slate-800">
                            <div class="flex items-center gap-2.5">
                                <div class="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                                </div>
                                <div>
                                    <h4 class="text-xs sm:text-sm font-bold text-slate-100">Janela Única de Texto Corrido • Triagem e Catalogação por IA</h4>
                                    <p class="text-[11px] text-slate-400">Cole ou digite todas as suas anotações livres da entrevista. A IA filtra, separa nos 5 eixos clínicos, formula hipóteses e redige o laudo.</p>
                                </div>
                            </div>

                            <div class="flex items-center gap-2">
                                ${hasGeminiKey
                                    ? `<span class="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-[10px] font-mono flex items-center gap-1.5">
                                           <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                           <span>Gemini 2.5 Flash Conectado</span>
                                       </span>`
                                    : `<span class="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/35 text-cyan-300 text-[10px] font-mono flex items-center gap-1.5" title="Processamento 100% no navegador sem sair da sua máquina">
                                           <i data-lucide="shield-check" class="w-3 h-3"></i>
                                           <span>Motor Local Heurístico (Offline &amp; LGPD)</span>
                                       </span>`
                                }
                                <button type="button" id="btn-psy-config-ai-key" title="Configurar ou alterar Chave API do Gemini"
                                    class="min-h-[30px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 border border-slate-700 transition">
                                    <i data-lucide="key" class="w-3 h-3 text-amber-300"></i>
                                    <span>${hasGeminiKey ? 'Chave API' : 'Usar Gemini API'}</span>
                                </button>
                            </div>
                        </div>

                        <!-- TEXTAREA CORRIDO -->
                        <div class="space-y-1.5">
                            <textarea id="psy-smart-dump-input" rows="8" placeholder="Cole aqui todas as suas anotações brutas de entrevista de anamnese e observações em sessão...

Exemplo:
Criança de 9 anos, 4º ano fundamental, destro. Mãe e professora relatam muita desatenção na escola, esquecimento de recados e perda de materiais. Gestação a termo sem problemas, andou com 1 ano e falou com 14 meses. Pai conta que era disperso na infância. Nas sessões, o examinando foi colaborativo e comunicativo, mas trocava de posição na cadeira o tempo todo e respondia com muita pressa e impulsividade nas tarefas cronometradas..."
                                class="w-full p-4 rounded-xl bg-[#090d16] border border-slate-700 focus:border-cyan-400 focus:outline-none text-xs sm:text-sm text-slate-100 leading-relaxed font-sans shadow-inner">${C.esc(cd.rawDumpText || '')}</textarea>
                        </div>

                        <!-- BARRA DE AÇÕES DA IA -->
                        <div class="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                            <div class="flex flex-wrap items-center gap-2">
                                <button type="button" id="btn-psy-run-ai-parser"
                                    class="min-h-[42px] px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition transform active:scale-95">
                                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                                    <span>⚡ Processar, Catalogar e Gerar Laudo com IA</span>
                                </button>

                                <button type="button" id="btn-psy-load-dump-example"
                                    class="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition">
                                    <i data-lucide="file-text" class="w-3.5 h-3.5 text-cyan-400"></i>
                                    <span>Carregar Exemplo de Texto Corrido</span>
                                </button>
                            </div>

                            <div class="flex items-center gap-2">
                                <button type="button" id="btn-psy-clear-dump"
                                    class="min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition">
                                    <i data-lucide="eraser" class="w-3.5 h-3.5"></i>
                                    <span>Limpar Caixa</span>
                                </button>
                            </div>
                        </div>

                        ${catalogCards}
                    </div>
                `;
            } else if (activeTab === 'queixa') {
                activeContent = `
                    <div class="space-y-2">
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <label for="psy-clinical-referral" class="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                                    <span>Queixa Principal &amp; Motivos do Encaminhamento</span>
                                    <span class="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.2 rounded">Seção II do Laudo</span>
                                </label>
                                <p class="text-[11px] text-slate-400">Demandas do paciente, família, escola ou médico assistente, com sintomas e prejuízos cotidianos.</p>
                            </div>
                        </div>
                        <textarea id="psy-clinical-referral" rows="5" placeholder="Queixa catalogada pela IA ou inserida manualmente..."
                            class="w-full p-3 rounded-xl bg-[#090d16] border border-slate-700 focus:border-cyan-400 focus:outline-none text-xs text-slate-100 leading-relaxed font-sans">${C.esc(cd.referralReason || '')}</textarea>
                    </div>
                `;
            } else if (activeTab === 'anamnese') {
                activeContent = `
                    <div class="space-y-2">
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <label for="psy-clinical-anamnese" class="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                                    <span>Marcos do Desenvolvimento, Histórico Escolar &amp; Rotina</span>
                                    <span class="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.2 rounded">Seção III do Laudo</span>
                                </label>
                                <p class="text-[11px] text-slate-400">Gestação, parto, marcos motores (marcha), linguagem, adaptação escolar e padrão de sono.</p>
                            </div>
                        </div>
                        <textarea id="psy-clinical-anamnese" rows="5" placeholder="Anamnese catalogada pela IA ou inserida manualmente..."
                            class="w-full p-3 rounded-xl bg-[#090d16] border border-slate-700 focus:border-cyan-400 focus:outline-none text-xs text-slate-100 leading-relaxed font-sans">${C.esc(cd.anamneseHistory || '')}</textarea>
                    </div>
                `;
            } else if (activeTab === 'antecedentes') {
                activeContent = `
                    <div class="space-y-2">
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <label for="psy-clinical-family" class="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                                    <span>Antecedentes Familiares, Histórico Clínico &amp; Saúde</span>
                                    <span class="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.2 rounded">Seção III do Laudo</span>
                                </label>
                                <p class="text-[11px] text-slate-400">Histórico familiar de TDAH, TEA, dificuldades de aprendizagem ou humor; exames audiológicos/visuais e medicações.</p>
                            </div>
                        </div>
                        <textarea id="psy-clinical-family" rows="5" placeholder="Histórico familiar e antecedentes catalogados pela IA..."
                            class="w-full p-3 rounded-xl bg-[#090d16] border border-slate-700 focus:border-cyan-400 focus:outline-none text-xs text-slate-100 leading-relaxed font-sans">${C.esc(cd.familyHistory || '')}</textarea>
                    </div>
                `;
            } else if (activeTab === 'observacao') {
                activeContent = `
                    <div class="space-y-2">
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <label for="psy-clinical-behavior" class="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                                    <span>Observação Comportamental durante as Sessões de Avaliação</span>
                                    <span class="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.2 rounded">Seção IV do Laudo</span>
                                </label>
                                <p class="text-[11px] text-slate-400">Contato visual, persistência, tolerância à frustração, inquietação motora, impulsividade e fadiga.</p>
                            </div>
                        </div>
                        <textarea id="psy-clinical-behavior" rows="5" placeholder="Observações das sessões catalogadas pela IA..."
                            class="w-full p-3 rounded-xl bg-[#090d16] border border-slate-700 focus:border-cyan-400 focus:outline-none text-xs text-slate-100 leading-relaxed font-sans">${C.esc(cd.behaviorObservation || '')}</textarea>
                    </div>
                `;
            } else if (activeTab === 'hipoteses') {
                activeContent = `
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                        <div class="space-y-1.5">
                            <label for="psy-clinical-hypotheses" class="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                                <span>Hipóteses Diagnósticas &amp; Raciocínio Clínico (DSM-5-TR / CID-11)</span>
                                <span class="text-[10px] font-mono text-amber-300 bg-amber-950/60 border border-amber-800/40 px-1.5 py-0.2 rounded">Seção VI</span>
                            </label>
                            <p class="text-[11px] text-slate-400">Formulação nosológica estruturada a partir da análise dos relatos e da testagem.</p>
                            <textarea id="psy-clinical-hypotheses" rows="5" placeholder="Hipóteses diagnósticas formuladas pela IA..."
                                class="w-full p-3 rounded-xl bg-[#090d16] border border-slate-700 focus:border-cyan-400 focus:outline-none text-xs text-slate-100 leading-relaxed font-sans">${C.esc(cd.diagnosticHypotheses || '')}</textarea>
                        </div>
                        <div class="space-y-1.5">
                            <label for="psy-clinical-recommendations" class="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                                <span>Diretrizes Terapêuticas, Recomendações &amp; Encaminhamentos</span>
                                <span class="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.2 rounded">Seção VII</span>
                            </label>
                            <p class="text-[11px] text-slate-400">Encaminhamentos interdisciplinares, suporte escolar e orientações parentais.</p>
                            <textarea id="psy-clinical-recommendations" rows="5" placeholder="Diretrizes terapêuticas sugeridas pela IA..."
                                class="w-full p-3 rounded-xl bg-[#090d16] border border-slate-700 focus:border-cyan-400 focus:outline-none text-xs text-slate-100 leading-relaxed font-sans">${C.esc(cd.recommendations || '')}</textarea>
                        </div>
                    </div>
                `;
            }

            bodyHtml = `
                <!-- SUB-TABS DO PAINEL CLÍNICO -->
                <div class="flex flex-wrap items-center gap-1.5 border-b border-slate-800/80 pb-3">
                    <button type="button" data-clinical-tab="smart_dump"
                        class="min-h-[32px] px-3.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${activeTab === 'smart_dump' ? 'bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 text-emerald-200 border border-emerald-500/50 shadow-sm shadow-emerald-500/20' : 'bg-[#090d16] text-slate-300 hover:text-slate-100 border border-slate-800'}">
                        <i data-lucide="sparkles" class="w-3.5 h-3.5 text-cyan-400"></i>
                        <span>⚡ Texto Corrido (IA Automática)</span>
                    </button>

                    <button type="button" data-clinical-tab="queixa"
                        class="min-h-[32px] px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${activeTab === 'queixa' ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40' : 'bg-[#090d16] text-slate-400 hover:text-slate-200 border border-slate-800'}">
                        ${dot(hasQ)}
                        <span>1. Queixa &amp; Encaminhamento</span>
                    </button>

                    <button type="button" data-clinical-tab="anamnese"
                        class="min-h-[32px] px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${activeTab === 'anamnese' ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40' : 'bg-[#090d16] text-slate-400 hover:text-slate-200 border border-slate-800'}">
                        ${dot(hasA)}
                        <span>2. Anamnese &amp; Desenvolvimento</span>
                    </button>

                    <button type="button" data-clinical-tab="antecedentes"
                        class="min-h-[32px] px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${activeTab === 'antecedentes' ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40' : 'bg-[#090d16] text-slate-400 hover:text-slate-200 border border-slate-800'}">
                        ${dot(hasF)}
                        <span>3. Antecedentes &amp; Saúde</span>
                    </button>

                    <button type="button" data-clinical-tab="observacao"
                        class="min-h-[32px] px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${activeTab === 'observacao' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40' : 'bg-[#090d16] text-slate-400 hover:text-slate-200 border border-slate-800'}">
                        ${dot(hasB)}
                        <span>4. Observação na Testagem</span>
                    </button>

                    <button type="button" data-clinical-tab="hipoteses"
                        class="min-h-[32px] px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${activeTab === 'hipoteses' ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40' : 'bg-[#090d16] text-slate-400 hover:text-slate-200 border border-slate-800'}">
                        ${dot(hasH)}
                        <span>5. Hipóteses &amp; Diretrizes</span>
                    </button>
                </div>

                <!-- CONTEÚDO ATIVO -->
                <div class="pt-1">
                    ${activeContent}
                </div>

                <!-- RODAPÉ COM ATALHO DE INTEGRAÇÃO -->
                <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                    <div class="flex items-center gap-2">
                        <i data-lucide="info" class="w-3.5 h-3.5 text-cyan-400 shrink-0"></i>
                        <span>O processamento por IA preenche os 5 eixos clínicos e redige automaticamente as seções do Laudo Oficial (Sub-aba F).</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button type="button" id="btn-psy-go-laudo-tab"
                            class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium text-xs flex items-center gap-1 border border-slate-700 transition">
                            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                            <span>Ver Rascunho no Laudo (Sub-aba F)</span>
                        </button>
                    </div>
                </div>
            `;
        }

        host.innerHTML = `
            <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
                <div class="flex flex-wrap items-center justify-between gap-3 ${!isCollapsed ? 'border-b border-slate-800/80 pb-3.5' : ''}">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0 shadow-md shadow-emerald-500/10">
                            <i data-lucide="sparkles" class="w-5 h-5 text-cyan-300"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2 flex-wrap">
                                <h3 class="text-sm sm:text-base font-bold text-slate-100 tracking-tight">Triagem Clínica por IA • Anamnese, Observação &amp; Laudos</h3>
                                <span class="px-2 py-0.5 rounded text-[10px] font-mono ${filledCount > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
                                    ${filledCount}/5 eixos catalogados
                                </span>
                                <span class="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">Extração Contínua Ativa</span>
                            </div>
                            <p class="text-xs text-slate-400">Cole o texto corrido das suas anotações de entrevista: a IA separa, cataloga e filtra em 5 eixos para compor o laudo em 1 clique.</p>
                        </div>
                    </div>

                    <!-- Ações Rápidas do Painel Clínico -->
                    <div class="flex flex-wrap items-center gap-2">
                        <select id="psy-clinical-presets" aria-label="Inserir Modelo Clínico Rápido"
                            class="min-h-[36px] px-2.5 py-1 rounded-lg bg-[#090d16] border border-emerald-500/40 text-emerald-300 text-xs font-semibold focus:outline-none focus:border-emerald-400">
                            <option value="">+ Modelos Rápidos Prontos...</option>
                            <option value="tdah">Modelo TDAH (Criança / Adolescente)</option>
                            <option value="tea">Modelo TEA (Socioemocional / Sensorial)</option>
                            <option value="aprendizagem">Modelo Dificuldades de Aprendizagem / Dislexia</option>
                            <option value="adulto">Modelo Adulto (Sobrecarga / Queixa de Memória)</option>
                            <option value="limpar">Limpar Todos os Campos Clínicos</option>
                        </select>

                        <button type="button" id="btn-psy-sync-clinical-laudo" title="Atualizar a Síntese Narrativa do Laudo com estes Dados Clínicos"
                            class="min-h-[36px] px-3.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-600/20">
                            <i data-lucide="sparkles" class="w-3.5 h-3.5"></i>
                            <span>Integrar ao Laudo</span>
                        </button>

                        <button type="button" id="btn-psy-toggle-clinical" title="${isCollapsed ? 'Expandir Painel Clínico' : 'Recolher Painel Clínico'}"
                            class="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs flex items-center gap-1 transition">
                            <i data-lucide="${isCollapsed ? 'chevron-down' : 'chevron-up'}" class="w-3.5 h-3.5"></i>
                            <span>${isCollapsed ? 'Expandir' : 'Recolher'}</span>
                        </button>
                    </div>
                </div>

                ${bodyHtml}
            </div>
        `;

        bindClinicalPanelEvents();
    }

    function bindClinicalPanelEvents() {
        const C = global.VaultCore;
        const prot = getActiveProtocol();
        const cd = prot.clinicalData;

        // Toggle Expandir / Recolher
        const btnToggle = document.getElementById('btn-psy-toggle-clinical');
        if (btnToggle) {
            btnToggle.addEventListener('click', () => {
                cd.isCollapsed = !cd.isCollapsed;
                saveState();
                renderClinicalPanel();
                if (C.refreshIcons) C.refreshIcons(document.getElementById('psy-clinical-panel'));
            });
        }

        // Troca de sub-abas internas
        const tabBtns = document.querySelectorAll('[data-clinical-tab]');
        tabBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-clinical-tab');
                cd.activeTab = target;
                saveState();
                renderClinicalPanel();
                if (C.refreshIcons) C.refreshIcons(document.getElementById('psy-clinical-panel'));
            });
        });

        // Configuração de Chave API Gemini
        const btnCfgKey = document.getElementById('btn-psy-config-ai-key');
        if (btnCfgKey) {
            btnCfgKey.addEventListener('click', () => {
                const profile = (C && C.store && typeof C.store.getProfile === 'function') ? C.store.getProfile() : {};
                const currentKey = profile.geminiApiKey || '';
                const newKey = window.prompt(
                    'Insira sua Gemini API Key (Google AI Studio) para processamento em nuvem via Gemini 2.5 Flash.\n\nSe deixar em branco, o Nexus Vault continuará utilizando o Motor Neuropsicológico Heurístico Local (100% offline e privado):',
                    currentKey
                );
                if (newKey === null) return;
                C.store.updateProfile({ geminiApiKey: newKey.trim() });
                renderClinicalPanel();
                if (C.refreshIcons) C.refreshIcons(document.getElementById('psy-clinical-panel'));
                C.toast(newKey.trim() ? 'Chave Gemini salva no perfil!' : 'Chave removida. Motor local ativado.', 'info');
            });
        }

        // Botão de Processamento com IA (Smart Dump)
        const btnRunAi = document.getElementById('btn-psy-run-ai-parser');
        if (btnRunAi) {
            btnRunAi.addEventListener('click', async () => {
                const inputDump = document.getElementById('psy-smart-dump-input');
                const rawText = inputDump ? inputDump.value : (cd.rawDumpText || '');
                if (!rawText || !rawText.trim() || rawText.trim().length < 15) {
                    C.toast('Digite ou cole suas anotações da entrevista (ao menos 2 frases) para que a IA possa analisar.', 'warning');
                    if (inputDump) inputDump.focus();
                    return;
                }

                btnRunAi.disabled = true;
                const oldContent = btnRunAi.innerHTML;
                btnRunAi.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i><span>Analisando e catalogando com IA...</span>`;
                if (C.refreshIcons) C.refreshIcons(btnRunAi);

                try {
                    const result = await parseRawClinicalTextWithAI(rawText, prot);
                    const d = result.data || {};

                    cd.rawDumpText = rawText;
                    cd.referralReason = d.referralReason || cd.referralReason;
                    cd.anamneseHistory = d.anamneseHistory || cd.anamneseHistory;
                    cd.familyHistory = d.familyHistory || cd.familyHistory;
                    cd.behaviorObservation = d.behaviorObservation || cd.behaviorObservation;
                    cd.diagnosticHypotheses = d.diagnosticHypotheses || cd.diagnosticHypotheses;
                    cd.recommendations = d.recommendations || cd.recommendations;

                    // Aplica dados demográficos detectados se não informados
                    if (d.demographics) {
                        if (d.demographics.schooling && (!prot.schooling || prot.schooling.includes('EF'))) {
                            prot.schooling = d.demographics.schooling;
                        }
                        if (d.demographics.handedness && !prot.handedness) {
                            prot.handedness = d.demographics.handedness;
                        }
                        if (d.demographics.informant && (!prot.informant || prot.informant === 'Genitores e Escola')) {
                            prot.informant = d.demographics.informant;
                        }
                    }

                    prot.referralReason = cd.referralReason;
                    prot.report.customDraftText = generateTechnicalNarrativeDraft(prot);
                    saveState();

                    const modeLabel = result.mode === 'GEMINI_AI'
                        ? 'Gemini 2.5 Flash'
                        : (result.mode === 'HEURISTIC_FALLBACK' ? 'Motor Local (Fallback)' : 'Motor Neuropsicológico Local');
                    C.toast(`Triagem concluída via ${modeLabel}! Os 5 eixos foram catalogados e o Laudo foi gerado.`, 'success', 3600);

                    renderHeaderAndSubtabs();
                    renderClinicalPanel();
                    if (C.refreshIcons) C.refreshIcons(document.getElementById('psy-clinical-panel'));
                } catch (err) {
                    C.toast('Erro no processamento da IA: ' + err.message, 'error');
                } finally {
                    btnRunAi.disabled = false;
                    btnRunAi.innerHTML = oldContent;
                    if (C.refreshIcons) C.refreshIcons(btnRunAi);
                }
            });
        }

        // Botão de Carregar Exemplo de Texto Corrido
        const btnLoadSample = document.getElementById('btn-psy-load-dump-example');
        if (btnLoadSample) {
            btnLoadSample.addEventListener('click', () => {
                const inputDump = document.getElementById('psy-smart-dump-input');
                if (inputDump) {
                    inputDump.value = RAW_DUMP_SAMPLE;
                }
                cd.rawDumpText = RAW_DUMP_SAMPLE;
                saveState();
                C.toast('Exemplo de anotação bruta carregado na janela. Clique em "Processar com IA" para testar!', 'info', 3200);
            });
        }

        // Botão de Limpar Caixa de Texto Corrido
        const btnClearDump = document.getElementById('btn-psy-clear-dump');
        if (btnClearDump) {
            btnClearDump.addEventListener('click', () => {
                const inputDump = document.getElementById('psy-smart-dump-input');
                if (inputDump) inputDump.value = '';
                cd.rawDumpText = '';
                saveState();
                C.toast('Caixa de anotações limpa.', 'info');
            });
        }

        // Botão direto para o Laudo
        const btnGoLaudo = document.getElementById('btn-psy-go-laudo-tab');
        const btnDumpGoLaudo = document.getElementById('btn-psy-dump-go-laudo');
        const handleGoLaudo = () => {
            prot.report.customDraftText = generateTechnicalNarrativeDraft(prot);
            appState.activeSubTab = 'laudo';
            saveState();
            renderAll();
            C.toast('Laudo técnico atualizado e aberto na Sub-aba F.', 'success');
        };
        if (btnGoLaudo) btnGoLaudo.addEventListener('click', handleGoLaudo);
        if (btnDumpGoLaudo) btnDumpGoLaudo.addEventListener('click', handleGoLaudo);

        // Seletor de Presets
        const selPreset = document.getElementById('psy-clinical-presets');
        if (selPreset) {
            selPreset.addEventListener('change', () => {
                const val = selPreset.value;
                if (!val) return;
                if (val === 'limpar') {
                    if (!window.confirm('Limpar todos os textos de anamnese, observação e hipóteses deste protocolo?')) {
                        selPreset.value = '';
                        return;
                    }
                    cd.rawDumpText = '';
                    cd.referralReason = '';
                    cd.anamneseHistory = '';
                    cd.familyHistory = '';
                    cd.behaviorObservation = '';
                    cd.diagnosticHypotheses = '';
                    cd.recommendations = '';
                    prot.report.customDraftText = '';
                    saveState();
                    renderClinicalPanel();
                    if (C.refreshIcons) C.refreshIcons(document.getElementById('psy-clinical-panel'));
                    C.toast('Campos clínicos limpos.', 'info');
                    return;
                }
                const pset = CLINICAL_PRESETS[val];
                if (pset) {
                    cd.referralReason = pset.referralReason;
                    cd.anamneseHistory = pset.anamneseHistory;
                    cd.familyHistory = pset.familyHistory;
                    cd.behaviorObservation = pset.behaviorObservation;
                    cd.diagnosticHypotheses = pset.diagnosticHypotheses;
                    cd.recommendations = pset.recommendations;
                    cd.isCollapsed = false;
                    prot.report.customDraftText = generateTechnicalNarrativeDraft(prot);
                    saveState();
                    renderClinicalPanel();
                    if (C.refreshIcons) C.refreshIcons(document.getElementById('psy-clinical-panel'));
                    C.toast(`Modelo "${pset.label}" aplicado com sucesso!`, 'success');
                }
            });
        }

        // Botão Integrar ao Laudo
        const btnSyncLaudo = document.getElementById('btn-psy-sync-clinical-laudo');
        if (btnSyncLaudo) {
            btnSyncLaudo.addEventListener('click', () => {
                prot.report.customDraftText = generateTechnicalNarrativeDraft(prot);
                saveState();
                C.toast('Dados clínicos, observações e hipóteses integrados com sucesso ao Laudo!', 'success');
                if (appState.activeSubTab === 'laudo') {
                    renderActiveSubTab();
                    if (C.refreshIcons) C.refreshIcons(document.getElementById('psy-subtab-viewport'));
                }
            });
        }

        // Eventos input em cada textarea
        const bindClinicalTextarea = (id, prop) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', () => {
                cd[prop] = el.value;
                if (prop === 'referralReason') {
                    prot.referralReason = el.value;
                }
                prot.report.customDraftText = '';
                saveState();
            });
        };

        bindClinicalTextarea('psy-smart-dump-input', 'rawDumpText');
        bindClinicalTextarea('psy-clinical-referral', 'referralReason');
        bindClinicalTextarea('psy-clinical-anamnese', 'anamneseHistory');
        bindClinicalTextarea('psy-clinical-family', 'familyHistory');
        bindClinicalTextarea('psy-clinical-behavior', 'behaviorObservation');
        bindClinicalTextarea('psy-clinical-hypotheses', 'diagnosticHypotheses');
        bindClinicalTextarea('psy-clinical-recommendations', 'recommendations');
    }

    function bindTopProtocolEvents() {
        const C = global.VaultCore;
        const sel = document.getElementById('psy-protocol-select');
        if (sel) {
            sel.addEventListener('change', () => {
                appState.activeProtocolId = sel.value;
                saveState();
                renderAll();
            });
        }

        const syncField = (id, prop) => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', () => {
                const prot = getActiveProtocol();
                prot[prop] = el.value;
                saveState();
                if (prop === 'birthDate' || prop === 'evalDate') {
                    updateExactAgeBanner();
                }
            });
        };
        syncField('psy-birth-date', 'birthDate');
        syncField('psy-eval-date', 'evalDate');
        syncField('psy-schooling', 'schooling');
        syncField('psy-handedness', 'handedness');
        syncField('psy-informant', 'informant');

        const btnManualSave = document.getElementById('btn-psy-save-manual');
        if (btnManualSave) {
            btnManualSave.addEventListener('click', () => {
                saveState();
                C.toast('Protocolo e laudo salvos no LocalStorage.', 'success');
            });
        }

        const btnNew = document.getElementById('btn-psy-new-prot');
        if (btnNew) {
            btnNew.addEventListener('click', () => {
                const nextNum = String(appState.protocols.length + 1).padStart(2, '0');
                const suggested = `AV-2026-${nextNum}`;
                const code = window.prompt('Código ou Iniciais do Novo Protocolo (LGPD):', suggested);
                if (!code || !code.trim()) return;
                const p = createEmptyProtocol(code.trim());
                appState.protocols.unshift(p);
                appState.activeProtocolId = p.id;
                saveState();
                renderAll();
                C.toast(`Protocolo "${p.code}" criado.`, 'success');
            });
        }

        const btnDemo = document.getElementById('btn-psy-demo-prot');
        if (btnDemo) {
            btnDemo.addEventListener('click', () => {
                const demoProt = createEmptyProtocol('DEMO-NEURO-TDAH');
                demoProt.patient = {
                    birthDateISO: '2016-04-12',
                    evalDateISO: '2026-10-20',
                    gender: 'M',
                    schooling: '5º Ano Fundamental',
                    handedness: 'Destra',
                    informant: 'Mãe e Professora'
                };
                demoProt.wasi.voc.raw = 32; demoProt.wasi.voc.t = 55;
                demoProt.wasi.cub.raw = 34; demoProt.wasi.cub.t = 58;
                demoProt.wasi.sem.raw = 28; demoProt.wasi.sem.t = 52;
                demoProt.wasi.rm.raw = 26;  demoProt.wasi.rm.t = 56;
                demoProt.fdt.leitura.time = 24; demoProt.fdt.leitura.errors = 0;
                demoProt.fdt.contagem.time = 28; demoProt.fdt.contagem.errors = 0;
                demoProt.fdt.escolha.time = 44; demoProt.fdt.escolha.errors = 1;
                demoProt.fdt.alternancia.time = 62; demoProt.fdt.alternancia.errors = 2;
                demoProt.srs2.rawPerception = 12;
                demoProt.srs2.rawCognition = 18;
                demoProt.srs2.rawCommunication = 26;
                demoProt.srs2.rawMotivation = 14;
                demoProt.srs2.rawRestricted = 19;
                demoProt.bpa.acRaw = 94;
                demoProt.bpa.adRaw = 76;
                demoProt.bpa.aaRaw = 82;
                demoProt.ravlt.rawA1 = 5;
                demoProt.ravlt.rawA2 = 8;
                demoProt.ravlt.rawA3 = 11;
                demoProt.ravlt.rawA4 = 12;
                demoProt.ravlt.rawA5 = 14;
                demoProt.ravlt.rawB1 = 5;
                demoProt.ravlt.rawA6 = 12;
                demoProt.ravlt.rawA7 = 11;

                demoProt.clinicalData = Object.assign({}, CLINICAL_PRESETS.tdah, {
                    isCollapsed: false,
                    activeTab: 'queixa'
                });
                demoProt.report.customDraftText = '';

                appState.protocols.unshift(demoProt);
                appState.activeProtocolId = demoProt.id;
                saveState();
                renderAll();
                C.toast('Protocolo de Demonstração "DEMO-NEURO-TDAH" carregado com sucesso!', 'success', 3000);
            });
        }

        const btnRen = document.getElementById('btn-psy-rename-prot');
        if (btnRen) {
            btnRen.addEventListener('click', () => {
                const prot = getActiveProtocol();
                const nw = window.prompt('Novo código / iniciais do protocolo:', prot.code);
                if (!nw || !nw.trim()) return;
                prot.code = nw.trim();
                saveState();
                renderHeaderAndSubtabs();
                C.toast('Protocolo renomeado.', 'info');
            });
        }

        const btnDup = document.getElementById('btn-psy-dup-prot');
        if (btnDup) {
            btnDup.addEventListener('click', () => {
                const prot = getActiveProtocol();
                const copy = JSON.parse(JSON.stringify(prot));
                copy.id = 'prot_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
                copy.code = prot.code + ' (Cópia)';
                appState.protocols.unshift(copy);
                appState.activeProtocolId = copy.id;
                saveState();
                renderAll();
                C.toast(`Protocolo duplicado como "${copy.code}".`, 'success');
            });
        }

        const btnExp = document.getElementById('btn-psy-export-prot');
        if (btnExp) {
            btnExp.addEventListener('click', () => {
                const prot = getActiveProtocol();
                const payload = {
                    app: 'dm-nexus-vault-psicometria-protocol',
                    exportedAt: new Date().toISOString(),
                    protocol: prot
                };
                const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const safeCode = prot.code.replace(/[^a-zA-Z0-9_-]/g, '_');
                a.href = url;
                a.download = `protocolo-${safeCode}.json`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 250);
                C.toast(`Protocolo "${prot.code}" exportado (.json).`, 'success');
            });
        }

        const btnImp = document.getElementById('btn-psy-import-prot');
        const inpImp = document.getElementById('input-psy-import-prot');
        if (btnImp && inpImp) {
            btnImp.addEventListener('click', () => inpImp.click());
            inpImp.addEventListener('change', (ev) => {
                const file = ev.target.files && ev.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const parsed = JSON.parse(String(e.target.result || ''));
                        const rawProt = parsed.protocol || parsed;
                        if (!rawProt || typeof rawProt !== 'object' || (!rawProt.code && !rawProt.wasi)) {
                            throw new Error('Arquivo JSON não corresponde a um protocolo psicométrico válido.');
                        }
                        const norm = normalizeProtocol(rawProt);
                        norm.id = 'prot_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
                        appState.protocols.unshift(norm);
                        appState.activeProtocolId = norm.id;
                        saveState();
                        renderAll();
                        C.toast(`Protocolo "${norm.code}" importado com sucesso.`, 'success');
                    } catch (err) {
                        C.toast('Erro ao importar protocolo: ' + err.message, 'error');
                    }
                };
                reader.readAsText(file, 'utf-8');
                inpImp.value = '';
            });
        }

        const btnDel = document.getElementById('btn-psy-del-prot');
        if (btnDel) {
            btnDel.addEventListener('click', () => {
                const prot = getActiveProtocol();
                if (appState.protocols.length <= 1) {
                    const resetOk = window.confirm(`Este é o único protocolo ativo. Deseja limpar todas as pontuações de "${prot.code}"?`);
                    if (!resetOk) return;
                    const fresh = createEmptyProtocol(prot.code);
                    appState.protocols = [fresh];
                    appState.activeProtocolId = fresh.id;
                    saveState();
                    renderAll();
                    C.toast('Protocolo reiniciado.', 'warning');
                    return;
                }
                if (!window.confirm(`Excluir permanentemente o protocolo "${prot.code}" deste navegador?`)) return;
                appState.protocols = appState.protocols.filter((p) => p.id !== prot.id);
                appState.activeProtocolId = appState.protocols[0].id;
                saveState();
                renderAll();
                C.toast(`Protocolo "${prot.code}" removido.`, 'warning');
            });
        }
    }

    // =========================================================================
    // 5. SUB-ABA A: WASI & ESCALAS WECHSLER (WISC-IV / WAIS-III)
    // =========================================================================

    function renderSubTabWasi(viewport) {
        const C = global.VaultCore;
        const prot = getActiveProtocol();
        const w = prot.wasi;
        const ww = prot.wechsler;

        const subDefs = [
            { key: 'voc', code: 'VOC', name: 'Vocabulário', domain: 'Compreensão Verbal / Inteligência Cristalizada (Gc)' },
            { key: 'cub', code: 'CUB', name: 'Cubos', domain: 'Organização Perceptual / Visuoconstrução (Gv)' },
            { key: 'sem', code: 'SEM', name: 'Semelhanças', domain: 'Raciocínio Verbal / Formação de Conceitos' },
            { key: 'rm',  code: 'RM',  name: 'Raciocínio Matricial', domain: 'Raciocínio Fluido Não-Verbal (Gf)' }
        ];

        viewport.innerHTML = `
            <div class="space-y-6">
                <!-- PAINEL 1: WASI -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-6 space-y-5">
                    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/35 font-mono text-[11px] font-bold text-cyan-300">WASI</span>
                                <h3 class="text-sm sm:text-base font-bold text-slate-100">Escala Wechsler Abreviada de Inteligência (Subtestes em Escore <em>T</em>: <em>M</em> = 50, <em>DP</em> = 10)</h3>
                            </div>
                            <p class="text-xs text-slate-400 mt-0.5">Insira o Escore <em>T</em> da tabela normativa (ou calcule por <em>M</em> e <em>DP</em> locais). As somas de <em>T</em>, QIs, IC 95% e discrepâncias intra-sujeito são atualizados em tempo real.</p>
                        </div>
                        <button type="button" id="btn-wasi-push-abnt"
                            class="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/15 transition">
                            <i data-lucide="table-properties" class="w-4 h-4"></i>
                            <span>Enviar WASI Completa para Tabela do Laudo (ABNT)</span>
                        </button>
                    </div>

                    <!-- Tabela de Entrada dos 4 Subtestes WASI -->
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                                    <th class="py-2 pr-3">Subteste WASI</th>
                                    <th class="py-2 px-2 w-24">Bruto (Opc.)</th>
                                    <th class="py-2 px-2 w-32">Modo Entrada</th>
                                    <th class="py-2 px-2 w-48">Escore <em>T</em> (ou <em>M</em> / <em>DP</em>)</th>
                                    <th class="py-2 px-2 text-center">Escore <em>Z</em></th>
                                    <th class="py-2 px-2 text-center">Ponderado Eq.</th>
                                    <th class="py-2 px-2 text-center">Percentil</th>
                                    <th class="py-2 pl-2">Classificação DSM-5-TR</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/60 text-xs">
                                ${subDefs.map((sd) => {
                                    const item = w[sd.key];
                                    return `
                                    <tr class="hover:bg-slate-900/40">
                                        <td class="py-2.5 pr-3">
                                            <div class="font-bold text-slate-100"><span class="font-mono text-cyan-300">${sd.code}</span> — ${sd.name}</div>
                                            <div class="text-[11px] text-slate-400">${sd.domain}</div>
                                        </td>
                                        <td class="py-2.5 px-2">
                                            <input type="text" inputmode="decimal" data-wasi-sub="${sd.key}" data-field="raw" value="${C.esc(item.raw)}" placeholder="Bruto"
                                                class="w-20 min-h-[36px] px-2.5 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-100 focus:border-cyan-400 focus:outline-none">
                                        </td>
                                        <td class="py-2.5 px-2">
                                            <select data-wasi-sub="${sd.key}" data-field="mode"
                                                class="w-full min-h-[36px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-[11px] text-slate-200 focus:border-cyan-400 focus:outline-none">
                                                <option value="T" ${item.mode !== 'M_SD' ? 'selected' : ''}>Escore T Direto</option>
                                                <option value="M_SD" ${item.mode === 'M_SD' ? 'selected' : ''}>Por M e DP</option>
                                            </select>
                                        </td>
                                        <td class="py-2.5 px-2">
                                            <div data-wasi-input-wrap="${sd.key}">
                                                ${item.mode === 'M_SD' ? `
                                                    <div class="flex items-center gap-1.5">
                                                        <input type="text" inputmode="decimal" data-wasi-sub="${sd.key}" data-field="mean" value="${C.esc(item.mean)}" placeholder="M"
                                                            class="w-20 min-h-[36px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-amber-200 focus:border-cyan-400 focus:outline-none">
                                                        <input type="text" inputmode="decimal" data-wasi-sub="${sd.key}" data-field="sd" value="${C.esc(item.sd)}" placeholder="DP"
                                                            class="w-20 min-h-[36px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-amber-200 focus:border-cyan-400 focus:outline-none">
                                                    </div>
                                                ` : `
                                                    <input type="text" inputmode="decimal" data-wasi-sub="${sd.key}" data-field="t" value="${C.esc(item.t)}" placeholder="T (ex: 55)"
                                                        class="w-28 min-h-[36px] px-2.5 py-1 rounded-lg bg-[#090d16] border border-cyan-500/40 font-mono text-xs font-bold text-cyan-200 focus:border-cyan-400 focus:outline-none">
                                                `}
                                            </div>
                                        </td>
                                        <td class="py-2.5 px-2 text-center font-mono text-slate-200" id="wasi-out-z-${sd.key}">—</td>
                                        <td class="py-2.5 px-2 text-center font-mono text-slate-300" id="wasi-out-ep-${sd.key}">—</td>
                                        <td class="py-2.5 px-2 text-center font-mono font-bold text-cyan-300" id="wasi-out-pct-${sd.key}">—</td>
                                        <td class="py-2.5 pl-2" id="wasi-out-cls-${sd.key}">—</td>
                                    </tr>`;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>

                    <!-- Índices Compostos WASI (QIV, QIE, QIT-4, QIT-2) -->
                    <div class="pt-2">
                        <div class="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2.5">Somas de Escores <em>T</em> &amp; Índices Compostos de QI (<em>M</em> = 100, <em>DP</em> = 15)</div>
                        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
                            ${[
                                { key: 'qiv',  title: 'QIV — QI Verbal', formula: 'Soma T (VOC + SEM)', rxxDef: '0,93' },
                                { key: 'qie',  title: 'QIE — QI de Execução', formula: 'Soma T (CUB + RM)', rxxDef: '0,94' },
                                { key: 'qit4', title: 'QIT-4 — QI Total (4 Sub.)', formula: 'Soma T (VOC+CUB+SEM+RM)', rxxDef: '0,96' },
                                { key: 'qit2', title: 'QIT-2 — QI Estimado (2 Sub.)', formula: 'Soma T (VOC + RM)', rxxDef: '0,93' }
                            ].map((c) => `
                                <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3.5 space-y-2.5">
                                    <div class="flex items-center justify-between">
                                        <span class="font-bold text-xs text-slate-100">${c.title}</span>
                                        <span class="text-[10px] font-mono text-slate-400">${c.formula}</span>
                                    </div>
                                    <div class="flex items-center justify-between text-xs bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800">
                                        <span class="text-slate-400">Soma <em>T</em>: <strong id="wasi-sum-${c.key}" class="font-mono text-cyan-300">—</strong></span>
                                        <span class="text-slate-400">Est. Linear: <strong id="wasi-est-${c.key}" class="font-mono text-slate-200">—</strong></span>
                                    </div>
                                    <div class="grid grid-cols-3 gap-2 items-end">
                                        <div class="col-span-2">
                                            <label class="block text-[10px] font-mono text-slate-400 mb-1">QI Manual (ou vazio = Est.)</label>
                                            <input type="text" inputmode="decimal" data-wasi-override="${c.key}" value="${C.esc(w.overrides[c.key])}" placeholder="Auto / Tabela Manual"
                                                class="w-full min-h-[34px] px-2.5 py-1 rounded-lg bg-[#0f172a] border border-cyan-500/35 font-mono text-xs font-bold text-cyan-200 focus:border-cyan-400 focus:outline-none">
                                        </div>
                                        <div>
                                            <label class="block text-[10px] font-mono text-slate-400 mb-1"><em>r<sub>xx</sub></em></label>
                                            <input type="text" inputmode="decimal" data-wasi-rxx="${c.key}" value="${C.esc(w.rxx[c.key])}"
                                                class="w-full min-h-[34px] px-2 py-1 rounded-lg bg-[#0f172a] border border-slate-700 font-mono text-xs text-slate-300 focus:border-cyan-400 focus:outline-none">
                                        </div>
                                    </div>
                                    <div id="wasi-comp-summary-${c.key}" class="pt-1 border-t border-slate-800/80 text-xs space-y-1"></div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Análise Intra-Sujeito e Discrepâncias Clínicas WASI -->
                    <div id="wasi-discrepancy-box" class="bg-[#090d16] border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs"></div>
                </div>

                <!-- PAINEL 2: WISC-IV / WAIS-III RÁPIDO (Índices Fatoriais + IAG vs ICC) -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-6 space-y-4">
                    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div class="flex items-center gap-3">
                            <select id="wechsler-scale-name"
                                class="min-h-[36px] px-3 py-1 rounded-lg bg-[#090d16] border border-cyan-500/40 font-mono text-xs font-bold text-cyan-300">
                                <option value="WISC-IV" ${ww.scaleName === 'WISC-IV' ? 'selected' : ''}>WISC-IV</option>
                                <option value="WAIS-III" ${ww.scaleName === 'WAIS-III' ? 'selected' : ''}>WAIS-III</option>
                                <option value="WISC-V" ${ww.scaleName === 'WISC-V' ? 'selected' : ''}>WISC-V (Índices)</option>
                                <option value="WAIS-IV" ${ww.scaleName === 'WAIS-IV' ? 'selected' : ''}>WAIS-IV (Índices)</option>
                            </select>
                            <div>
                                <h3 class="text-sm font-bold text-slate-100">Painel Rápido de Índices Fatoriais Wechsler + Discrepância IAG vs. ICC</h3>
                                <p class="text-xs text-slate-400">Essencial para diagnóstico diferencial de TDAH, Transtornos Específicos de Aprendizagem e Altas Habilidades / Dupla Excepcionalidade.</p>
                            </div>
                        </div>
                        <button type="button" id="btn-wechsler-push-abnt"
                            class="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-200 font-semibold text-xs flex items-center gap-1.5 transition">
                            <i data-lucide="plus-circle" class="w-4 h-4"></i>
                            <span>Enviar Índices Wechsler para Tabela ABNT</span>
                        </button>
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                        ${[
                            { key: 'icv', label: 'ICV (Comp. Verbal)' },
                            { key: 'iop', label: 'IOP (Org. Perceptual)' },
                            { key: 'imo', label: 'IMO (Mem. Operacional)' },
                            { key: 'ivp', label: 'IVP (Vel. Processam.)' },
                            { key: 'qit', label: 'QIT (QI Total)' },
                            { key: 'iagManual', label: 'IAG (Vazio = Auto)' },
                            { key: 'iccManual', label: 'ICC (Vazio = Auto)' }
                        ].map((f) => `
                            <div class="bg-[#090d16] border border-slate-800 rounded-xl p-2.5 space-y-1.5">
                                <label class="block text-[10px] font-mono text-slate-400 truncate" title="${f.label}">${f.label}</label>
                                <input type="text" inputmode="decimal" data-wech-field="${f.key}" value="${C.esc(ww[f.key])}" placeholder="Ex: 108"
                                    class="w-full min-h-[34px] px-2.5 py-1 rounded-lg bg-[#0f172a] border border-slate-700 font-mono text-xs font-bold text-cyan-200 focus:border-cyan-400 focus:outline-none">
                                <div id="wech-out-${f.key}" class="text-[11px] font-mono text-slate-400 leading-tight">—</div>
                            </div>
                        `).join('')}
                    </div>

                    <div id="wechsler-iag-icc-box" class="bg-[#090d16] border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300"></div>
                </div>
            </div>
        `;

        // Eventos WASI
        viewport.querySelectorAll('[data-wasi-sub]').forEach((el) => {
            const subKey = el.getAttribute('data-wasi-sub');
            const field = el.getAttribute('data-field');
            const evName = el.tagName === 'SELECT' ? 'change' : 'input';
            el.addEventListener(evName, () => {
                prot.wasi[subKey][field] = el.value;
                saveState();
                if (field === 'mode') {
                    renderSubTabWasi(viewport);
                    C.refreshIcons(viewport);
                } else {
                    refreshWasiOutputs();
                }
            });
        });

        viewport.querySelectorAll('[data-wasi-override]').forEach((el) => {
            el.addEventListener('input', () => {
                prot.wasi.overrides[el.getAttribute('data-wasi-override')] = el.value;
                saveState();
                refreshWasiOutputs();
            });
        });

        viewport.querySelectorAll('[data-wasi-rxx]').forEach((el) => {
            el.addEventListener('input', () => {
                prot.wasi.rxx[el.getAttribute('data-wasi-rxx')] = el.value;
                saveState();
                refreshWasiOutputs();
            });
        });

        const btnPushWasi = document.getElementById('btn-wasi-push-abnt');
        if (btnPushWasi) {
            btnPushWasi.addEventListener('click', () => {
                const res = computeWasiAll(prot);
                let count = 0;
                const subList = [
                    { key: 'voc', name: 'WASI — Vocabulário', dom: 'Linguagem e Compreensão Verbal', obj: res.voc },
                    { key: 'sem', name: 'WASI — Semelhanças', dom: 'Linguagem e Compreensão Verbal', obj: res.sem },
                    { key: 'cub', name: 'WASI — Cubos', dom: 'Visuoconstrução e Percepção', obj: res.cub },
                    { key: 'rm',  name: 'WASI — Raciocínio Matricial', dom: 'Inteligência Geral e Raciocínio', obj: res.rm }
                ];
                subList.forEach((s) => {
                    if (s.obj && s.obj.metrics) {
                        upsertReportRow({
                            uid: `wasi_${s.key}`,
                            domain: s.dom,
                            instrument: 'WASI',
                            measure: s.name.replace('WASI — ', ''),
                            raw: s.obj.raw !== null ? s.obj.raw : '—',
                            z: s.obj.z,
                            ep: s.obj.metrics.ep,
                            t: s.obj.t,
                            qi: null,
                            ci95: s.obj.metrics.ciT ? s.obj.metrics.ciT.label95 + ' (T)' : '—',
                            pct: s.obj.metrics.pctFormatted,
                            classification: s.obj.metrics.classification.label,
                            isSymptom: false,
                            plotInCurve: true
                        });
                        count++;
                    }
                });
                const compList = [
                    { key: 'qiv',  label: 'QI Verbal (QIV)', obj: res.qiv },
                    { key: 'qie',  label: 'QI de Execução (QIE)', obj: res.qie },
                    { key: 'qit4', label: 'QI Total — 4 Subtestes (QIT-4)', obj: res.qit4 },
                    { key: 'qit2', label: 'QI Estimado — 2 Subtestes (QIT-2)', obj: res.qit2 }
                ];
                compList.forEach((c) => {
                    if (c.obj && c.obj.metrics) {
                        upsertReportRow({
                            uid: `wasi_${c.key}`,
                            domain: 'Inteligência Geral e Raciocínio',
                            instrument: 'WASI',
                            measure: c.label,
                            raw: c.obj.sumT !== null ? `${Math.round(c.obj.sumT)} (ΣT)` : '—',
                            z: c.obj.z,
                            ep: null,
                            t: c.obj.metrics.t,
                            qi: c.obj.finalQI,
                            ci95: c.obj.ci ? c.obj.ci.label95 : '—',
                            pct: c.obj.metrics.pctFormatted,
                            classification: c.obj.metrics.classification.label,
                            isSymptom: false,
                            plotInCurve: true
                        });
                        count++;
                    }
                });
                if (count === 0) {
                    C.toast('Preencha ao menos um Escore T da WASI antes de enviar para o laudo.', 'warning');
                    return;
                }
                saveState();
                renderHeaderAndSubtabs();
                C.toast(`${count} medida(s) da WASI sincronizadas na Tabela ABNT!`, 'success');
            });
        }

        // Eventos Wechsler
        const scaleSel = document.getElementById('wechsler-scale-name');
        if (scaleSel) {
            scaleSel.addEventListener('change', () => {
                prot.wechsler.scaleName = scaleSel.value;
                saveState();
            });
        }
        viewport.querySelectorAll('[data-wech-field]').forEach((el) => {
            el.addEventListener('input', () => {
                prot.wechsler[el.getAttribute('data-wech-field')] = el.value;
                saveState();
                refreshWechslerOutputs();
            });
        });

        const btnPushWech = document.getElementById('btn-wechsler-push-abnt');
        if (btnPushWech) {
            btnPushWech.addEventListener('click', () => {
                const res = computeWechslerIndices(prot);
                const sName = prot.wechsler.scaleName || 'WISC-IV';
                const items = [
                    { key: 'icv', label: 'Índice de Compreensão Verbal (ICV)', dom: 'Linguagem e Compreensão Verbal', obj: res.icv },
                    { key: 'iop', label: 'Índice de Organização Perceptual (IOP)', dom: 'Visuoconstrução e Percepção', obj: res.iop },
                    { key: 'imo', label: 'Índice de Memória Operacional (IMO)', dom: 'Funções Executivas', obj: res.imo },
                    { key: 'ivp', label: 'Índice de Velocidade de Processamento (IVP)', dom: 'Atenção e Velocidade de Processamento', obj: res.ivp },
                    { key: 'iag', label: 'Índice de Habilidade Geral (IAG)', dom: 'Inteligência Geral e Raciocínio', obj: res.iag },
                    { key: 'icc', label: 'Índice de Proficiência Cognitiva (ICC)', dom: 'Atenção e Velocidade de Processamento', obj: res.icc },
                    { key: 'qit', label: 'QI Total (QIT)', dom: 'Inteligência Geral e Raciocínio', obj: res.qit }
                ];
                let count = 0;
                items.forEach((it) => {
                    if (it.obj && it.obj.metrics) {
                        upsertReportRow({
                            uid: `wech_${it.key}`,
                            domain: it.dom,
                            instrument: sName,
                            measure: it.label,
                            raw: '—',
                            z: it.obj.z,
                            ep: it.obj.metrics.ep,
                            t: it.obj.metrics.t,
                            qi: it.obj.score,
                            ci95: it.obj.ci ? it.obj.ci.label95 : '—',
                            pct: it.obj.metrics.pctFormatted,
                            classification: it.obj.metrics.classification.label,
                            isSymptom: false,
                            plotInCurve: true
                        });
                        count++;
                    }
                });
                if (count === 0) {
                    C.toast('Informe ao menos um índice padrão Wechsler para enviar.', 'warning');
                    return;
                }
                saveState();
                renderHeaderAndSubtabs();
                C.toast(`${count} índice(s) ${sName} enviados para a Tabela ABNT!`, 'success');
            });
        }

        refreshWasiOutputs();
        refreshWechslerOutputs();
    }

    function refreshWasiOutputs() {
        const C = global.VaultCore;
        const prot = getActiveProtocol();
        const res = computeWasiAll(prot);

        ['voc', 'cub', 'sem', 'rm'].forEach((k) => {
            const r = res[k];
            const zEl = document.getElementById(`wasi-out-z-${k}`);
            const epEl = document.getElementById(`wasi-out-ep-${k}`);
            const pctEl = document.getElementById(`wasi-out-pct-${k}`);
            const clsEl = document.getElementById(`wasi-out-cls-${k}`);
            if (!zEl) return;
            if (!r || !r.metrics) {
                zEl.textContent = '—';
                epEl.textContent = '—';
                pctEl.textContent = '—';
                clsEl.innerHTML = '<span class="text-slate-500">—</span>';
                return;
            }
            zEl.textContent = fmtSigned(r.z, 2);
            epEl.textContent = fmtPlain(r.metrics.ep, 1);
            pctEl.textContent = r.metrics.pctFormatted;
            clsEl.innerHTML = `<span class="inline-block px-2 py-0.5 rounded border text-[11px] font-semibold ${r.metrics.classification.badge}">${C.esc(r.metrics.classification.label)}</span>`;
        });

        ['qiv', 'qie', 'qit4', 'qit2'].forEach((ck) => {
            const comp = res[ck];
            const sumEl = document.getElementById(`wasi-sum-${ck}`);
            const estEl = document.getElementById(`wasi-est-${ck}`);
            const sumBox = document.getElementById(`wasi-comp-summary-${ck}`);
            if (!sumBox) return;
            sumEl.textContent = comp.sumT !== null ? fmtPlain(comp.sumT, 0) : '—';
            estEl.textContent = comp.estQI !== null ? String(comp.estQI) : '—';

            if (!comp.metrics) {
                sumBox.innerHTML = `<span class="text-slate-500">Aguardando subtestes...</span>`;
                return;
            }
            sumBox.innerHTML = `
                <div class="flex items-center justify-between">
                    <span class="text-slate-400">QI Final ${comp.isManual ? '(Manual)' : '(Est.)'}:</span>
                    <strong class="font-mono text-sm text-cyan-200">${Math.round(comp.finalQI)}</strong>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-slate-400">IC 95% (EPM ${fmtPlain(comp.ci.sem, 2)}):</span>
                    <span class="font-mono text-emerald-300">[${comp.ci.label95}]</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-slate-400">Percentil / <em>Z</em>:</span>
                    <span class="font-mono text-slate-200">Pc ${comp.metrics.pctFormatted} (${fmtSigned(comp.z, 2)})</span>
                </div>
                <div class="pt-1">
                    <span class="inline-block w-full text-center px-2 py-0.5 rounded border text-[11px] font-semibold ${comp.metrics.classification.badge}">
                        ${C.esc(comp.metrics.classification.label)}
                    </span>
                </div>
            `;
        });

        const discBox = document.getElementById('wasi-discrepancy-box');
        if (discBox) {
            if (res.ipsative.length === 0 && !res.deltaAlert) {
                discBox.innerHTML = `<span class="text-slate-500">Insira os Escores <em>T</em> dos subtestes para gerar a análise intra-sujeito de forças/fraquezas e discrepância QIV − QIE.</span>`;
            } else {
                const alertPalette = res.deltaAlert
                    ? (res.deltaAlert.level === 'high'
                        ? 'border-amber-500/40 bg-amber-950/30 text-amber-200'
                        : res.deltaAlert.level === 'moderate'
                            ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-200'
                            : 'border-emerald-500/35 bg-emerald-950/25 text-emerald-200')
                    : '';
                discBox.innerHTML = `
                    <div class="font-mono uppercase text-[11px] text-cyan-400">Análise Intra-Sujeito &amp; Discrepância Clínica WASI</div>
                    ${res.deltaAlert ? `<div class="p-2.5 rounded-lg border ${alertPalette}">${C.esc(res.deltaAlert.text)}</div>` : ''}
                    ${res.meanT !== null ? `
                        <div class="flex flex-wrap items-center gap-3 text-slate-300 pt-1">
                            <span>Média Pessoal <em>T</em>: <strong class="font-mono text-cyan-300">${fmtPlain(res.meanT, 1)}</strong></span>
                            <span>Amplitude / Dispersão (<em>T</em><sub>máx</sub> − <em>T</em><sub>mín</sub>): <strong class="font-mono ${res.scatterT >= 15 ? 'text-amber-300' : 'text-emerald-300'}">${fmtPlain(res.scatterT, 1)} pts</strong></span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                            ${res.ipsative.map((ip) => `
                                <div class="px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                                    <span><strong class="font-mono text-cyan-300">${ip.code}</strong> (${fmtSigned(ip.diff, 1)})</span>
                                    <span class="text-[10px] ${ip.diff >= 7 ? 'text-emerald-300 font-semibold' : ip.diff <= -7 ? 'text-rose-300 font-semibold' : 'text-slate-400'}">${C.esc(ip.tag)}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                `;
            }
        }
    }

    function refreshWechslerOutputs() {
        const C = global.VaultCore;
        const prot = getActiveProtocol();
        const res = computeWechslerIndices(prot);

        const map = {
            icv: res.icv,
            iop: res.iop,
            imo: res.imo,
            ivp: res.ivp,
            qit: res.qit,
            iagManual: res.iag,
            iccManual: res.icc
        };

        Object.keys(map).forEach((k) => {
            const el = document.getElementById(`wech-out-${k}`);
            if (!el) return;
            const obj = map[k];
            if (!obj || !obj.metrics) {
                el.innerHTML = '—';
                return;
            }
            const autoTag = (k === 'iagManual' && !parseNumInput(prot.wechsler.iagManual))
                ? `Auto: ${obj.score} • `
                : (k === 'iccManual' && !parseNumInput(prot.wechsler.iccManual))
                    ? `Auto: ${obj.score} • `
                    : '';
            el.innerHTML = `${autoTag}Pc <strong class="text-cyan-300">${obj.metrics.pctFormatted}</strong> • IC [${obj.ci.label95}]<br><span class="text-slate-300">${C.esc(obj.metrics.classification.label)}</span>`;
        });

        const box = document.getElementById('wechsler-iag-icc-box');
        if (box) {
            if (!res.iag || !res.icc) {
                box.innerHTML = `<span class="text-slate-500">Preencha ICV + IOP e IMO + IVP (ou IAG e ICC diretamente) para calcular a discrepância executivo-operacional <strong>Δ(IAG − ICC)</strong>.</span>`;
            } else {
                box.innerHTML = `
                    <div class="flex flex-wrap items-center gap-4 mb-1">
                        <span><strong>IAG:</strong> <span class="font-mono text-cyan-300">${res.iag.score}</span> (Pc ${res.iag.metrics.pctFormatted})</span>
                        <span><strong>ICC:</strong> <span class="font-mono text-cyan-300">${res.icc.score}</span> (Pc ${res.icc.metrics.pctFormatted})</span>
                        <span><strong>Δ(IAG − ICC):</strong> <span class="font-mono font-bold ${Math.abs(res.deltaIagIcc) >= 11 ? 'text-amber-300' : 'text-emerald-300'}">${fmtSigned(res.deltaIagIcc, 0)} pontos</span></span>
                    </div>
                    <p class="text-slate-300 leading-relaxed">${C.esc(res.iagIccNote)}</p>
                `;
            }
        }
    }

    // =========================================================================
    // 6. SUB-ABA B: FDT — TESTE DOS CINCO DÍGITOS (SEDÓ)
    // =========================================================================

    function renderSubTabFdt(viewport) {
        const C = global.VaultCore;
        const prot = getActiveProtocol();
        const f = prot.fdt;

        const baseRows = [
            { key: 'leitura',     title: '1. Leitura',     type: 'Automático (Velocidade)', hasErrors: true },
            { key: 'contagem',    title: '2. Contagem',    type: 'Automático (Velocidade)', hasErrors: true },
            { key: 'escolha',     title: '3. Escolha',     type: 'Controlado (Inibição / Stroop Numérico)', hasErrors: true },
            { key: 'alternancia', title: '4. Alternância', type: 'Controlado (Flexibilidade / Shifting)', hasErrors: true },
            { key: 'inibicao',      title: '5. Inibição (Escolha − Leitura)',      type: 'Índice Executivo Derivado', hasErrors: false },
            { key: 'flexibilidade', title: '6. Flexibilidade (Alternância − Leitura)', type: 'Índice Executivo Derivado', hasErrors: false }
        ];

        viewport.innerHTML = `
            <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-6 space-y-5">
                <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/35 font-mono text-[11px] font-bold text-cyan-300">FDT</span>
                            <h3 class="text-sm sm:text-base font-bold text-slate-100">Teste dos Cinco Dígitos (Five Digit Test — M. Sedó)</h3>
                        </div>
                        <p class="text-xs text-slate-400 mt-0.5">Cálculo instantâneo de <strong>Inibição</strong> e <strong>Flexibilidade</strong> com inversão automática de polaridade temporal (menor tempo = maior eficiência).</p>
                    </div>
                    <button type="button" id="btn-fdt-push-abnt"
                        class="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/15 transition">
                        <i data-lucide="table-properties" class="w-4 h-4"></i>
                        <span>Enviar 6 Medidas FDT para Tabela ABNT</span>
                    </button>
                </div>

                <!-- Seletor Explícito de Convenção de Percentil do Manual FDT -->
                <div class="bg-[#090d16] border border-cyan-500/30 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div class="text-xs space-y-0.5">
                        <div class="font-mono font-bold text-cyan-300">Convenção quando a entrada normativa for por Percentil do Manual FDT:</div>
                        <div class="text-slate-400">Evita erro de inversão! No modo <em>M</em> e <em>DP</em>, o sistema já calcula automaticamente <code class="font-mono text-emerald-300">Z = (M − Tempo) ÷ DP</code>.</div>
                    </div>
                    <select id="fdt-pct-convention"
                        class="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#0f172a] border border-cyan-500/40 font-mono text-xs text-cyan-200">
                        <option value="EFFICIENCY" ${f.pctConvention !== 'RAW_TIME' ? 'selected' : ''}>Percentil de Eficiência Clínica (Pc 95 = Ótimo / Pc 5 = Déficit)</option>
                        <option value="RAW_TIME" ${f.pctConvention === 'RAW_TIME' ? 'selected' : ''}>Percentil Bruto de Tempo/Lentidão (Pc 95 = Lento → Eficiência = 100 − Pc)</option>
                    </select>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                                <th class="py-2 pr-3">Etapa / Índice FDT</th>
                                <th class="py-2 px-2 w-28">Tempo (s)</th>
                                <th class="py-2 px-2 w-20">Erros</th>
                                <th class="py-2 px-2 w-32">Norma Por</th>
                                <th class="py-2 px-2 w-48">Parâmetros (M/DP ou Pc)</th>
                                <th class="py-2 px-2 text-center"><em>Z</em> Eficiência</th>
                                <th class="py-2 px-2 text-center">Escore <em>T</em></th>
                                <th class="py-2 px-2 text-center">Pc Eficiência</th>
                                <th class="py-2 pl-2">Classificação DSM-5-TR</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60 text-xs">
                            ${baseRows.map((r) => {
                                const cfg = f[r.key];
                                return `
                                <tr class="hover:bg-slate-900/40">
                                    <td class="py-2.5 pr-3">
                                        <div class="font-bold text-slate-100">${r.title}</div>
                                        <div class="text-[11px] text-slate-400">${r.type}</div>
                                    </td>
                                    <td class="py-2.5 px-2">
                                        ${r.hasErrors ? `
                                            <input type="text" inputmode="decimal" data-fdt-row="${r.key}" data-field="time" value="${C.esc(cfg.time)}" placeholder="Seg (s)"
                                                class="w-24 min-h-[36px] px-2.5 py-1 rounded-lg bg-[#090d16] border border-cyan-500/40 font-mono text-xs font-bold text-cyan-200 focus:border-cyan-400 focus:outline-none">
                                        ` : `
                                            <div id="fdt-derived-time-${r.key}" class="w-24 min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs font-bold text-amber-300 flex items-center">—</div>
                                        `}
                                    </td>
                                    <td class="py-2.5 px-2">
                                        ${r.hasErrors ? `
                                            <input type="text" inputmode="numeric" data-fdt-row="${r.key}" data-field="errors" value="${C.esc(cfg.errors)}" placeholder="0"
                                                class="w-16 min-h-[36px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-200 focus:border-cyan-400 focus:outline-none">
                                        ` : `<span class="text-slate-600 font-mono">—</span>`}
                                    </td>
                                    <td class="py-2.5 px-2">
                                        <select data-fdt-row="${r.key}" data-field="mode"
                                            class="w-full min-h-[36px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-[11px] text-slate-200">
                                            <option value="M_SD" ${cfg.mode !== 'PCT' ? 'selected' : ''}>Média e DP</option>
                                            <option value="PCT" ${cfg.mode === 'PCT' ? 'selected' : ''}>Percentil Manual</option>
                                        </select>
                                    </td>
                                    <td class="py-2.5 px-2">
                                        ${cfg.mode === 'PCT' ? `
                                            <input type="text" inputmode="decimal" data-fdt-row="${r.key}" data-field="pct" value="${C.esc(cfg.pct)}" placeholder="Percentil (1–99)"
                                                class="w-32 min-h-[36px] px-2.5 py-1 rounded-lg bg-[#090d16] border border-emerald-500/40 font-mono text-xs text-emerald-200">
                                        ` : `
                                            <div class="flex items-center gap-1.5">
                                                <input type="text" inputmode="decimal" data-fdt-row="${r.key}" data-field="mean" value="${C.esc(cfg.mean)}" placeholder="M (s)"
                                                    class="w-20 min-h-[36px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-200">
                                                <input type="text" inputmode="decimal" data-fdt-row="${r.key}" data-field="sd" value="${C.esc(cfg.sd)}" placeholder="DP (s)"
                                                    class="w-20 min-h-[36px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-200">
                                            </div>
                                        `}
                                    </td>
                                    <td class="py-2.5 px-2 text-center font-mono text-slate-200" id="fdt-out-z-${r.key}">—</td>
                                    <td class="py-2.5 px-2 text-center font-mono text-slate-300" id="fdt-out-t-${r.key}">—</td>
                                    <td class="py-2.5 px-2 text-center font-mono font-bold text-cyan-300" id="fdt-out-pct-${r.key}">—</td>
                                    <td class="py-2.5 pl-2" id="fdt-out-cls-${r.key}">—</td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Síntese Executiva FDT -->
                <div id="fdt-clinical-summary" class="bg-[#090d16] border border-slate-800 rounded-xl p-4 text-xs space-y-2"></div>
            </div>
        `;

        const convSel = document.getElementById('fdt-pct-convention');
        if (convSel) {
            convSel.addEventListener('change', () => {
                prot.fdt.pctConvention = convSel.value;
                saveState();
                refreshFdtOutputs();
            });
        }

        viewport.querySelectorAll('[data-fdt-row]').forEach((el) => {
            const rKey = el.getAttribute('data-fdt-row');
            const field = el.getAttribute('data-field');
            const evName = el.tagName === 'SELECT' ? 'change' : 'input';
            el.addEventListener(evName, () => {
                prot.fdt[rKey][field] = el.value;
                saveState();
                if (field === 'mode') {
                    renderSubTabFdt(viewport);
                    C.refreshIcons(viewport);
                } else {
                    refreshFdtOutputs();
                }
            });
        });

        const btnPush = document.getElementById('btn-fdt-push-abnt');
        if (btnPush) {
            btnPush.addEventListener('click', () => {
                const res = computeFdtAll(prot);
                const defs = [
                    { key: 'leitura',       label: 'Leitura (Velocidade Automática)', dom: 'Atenção e Velocidade de Processamento', err: res.leitura.errors },
                    { key: 'contagem',      label: 'Contagem (Velocidade Automática)', dom: 'Atenção e Velocidade de Processamento', err: res.contagem.errors },
                    { key: 'escolha',       label: 'Escolha (Atenção Seletiva / Inibição)', dom: 'Funções Executivas', err: res.escolha.errors },
                    { key: 'alternancia',   label: 'Alternância (Flexibilidade Cognitiva)', dom: 'Funções Executivas', err: res.alternancia.errors },
                    { key: 'inibicao',      label: 'Índice Executivo de Inibição (Escolha − Leitura)', dom: 'Funções Executivas', err: null },
                    { key: 'flexibilidade', label: 'Índice Executivo de Flexibilidade (Alternância − Leitura)', dom: 'Funções Executivas', err: null }
                ];
                let count = 0;
                defs.forEach((d) => {
                    const obj = res[d.key];
                    if (obj && obj.time !== null) {
                        const rawTxt = d.err !== null ? `${fmtPlain(obj.time, 1)}s (${d.err} err.)` : `${fmtPlain(obj.time, 1)}s`;
                        upsertReportRow({
                            uid: `fdt_${d.key}`,
                            domain: d.dom,
                            instrument: 'FDT (Cinco Dígitos)',
                            measure: d.label,
                            raw: rawTxt,
                            z: obj.z !== undefined ? obj.z : null,
                            ep: obj.metrics ? obj.metrics.ep : null,
                            t: obj.metrics ? obj.metrics.t : null,
                            qi: obj.metrics ? Math.round(obj.metrics.qi) : null,
                            ci95: obj.metrics && obj.metrics.ciT ? obj.metrics.ciT.label95 + ' (T)' : '—',
                            pct: obj.metrics ? obj.metrics.pctFormatted : '—',
                            classification: obj.metrics ? obj.metrics.classification.label : 'Registro Bruto',
                            isSymptom: false,
                            plotInCurve: Boolean(obj.metrics)
                        });
                        count++;
                    }
                });
                if (count === 0) {
                    C.toast('Informe ao menos os tempos em segundos do FDT antes de enviar.', 'warning');
                    return;
                }
                saveState();
                renderHeaderAndSubtabs();
                C.toast(`${count} etapa(s)/índice(s) do FDT enviados para a Tabela ABNT!`, 'success');
            });
        }

        refreshFdtOutputs();
    }

    function refreshFdtOutputs() {
        const C = global.VaultCore;
        const prot = getActiveProtocol();
        const res = computeFdtAll(prot);

        const inibEl = document.getElementById('fdt-derived-time-inibicao');
        const flexEl = document.getElementById('fdt-derived-time-flexibilidade');
        if (inibEl) inibEl.textContent = res.tInib !== null ? `${fmtPlain(res.tInib, 1)} s` : '—';
        if (flexEl) flexEl.textContent = res.tFlex !== null ? `${fmtPlain(res.tFlex, 1)} s` : '—';

        ['leitura', 'contagem', 'escolha', 'alternancia', 'inibicao', 'flexibilidade'].forEach((k) => {
            const obj = res[k];
            const zEl = document.getElementById(`fdt-out-z-${k}`);
            const tEl = document.getElementById(`fdt-out-t-${k}`);
            const pctEl = document.getElementById(`fdt-out-pct-${k}`);
            const clsEl = document.getElementById(`fdt-out-cls-${k}`);
            if (!zEl) return;
            if (!obj || !obj.metrics) {
                zEl.textContent = '—';
                tEl.textContent = '—';
                pctEl.textContent = '—';
                clsEl.innerHTML = '<span class="text-slate-500">—</span>';
                return;
            }
            zEl.textContent = fmtSigned(obj.z, 2);
            tEl.textContent = fmtPlain(obj.metrics.t, 1);
            pctEl.textContent = obj.metrics.pctFormatted;
            clsEl.innerHTML = `<span class="inline-block px-2 py-0.5 rounded border text-[11px] font-semibold ${obj.metrics.classification.badge}">${C.esc(obj.metrics.classification.label)}</span>`;
        });

        const sumBox = document.getElementById('fdt-clinical-summary');
        if (sumBox) {
            sumBox.innerHTML = `
                <div class="flex flex-wrap items-center gap-4 font-mono text-[11px] text-slate-300">
                    <span>Inibição Líquida: <strong class="text-amber-300">${res.tInib !== null ? fmtPlain(res.tInib, 1) + 's' : '—'}</strong></span>
                    <span>Flexibilidade Líquida: <strong class="text-amber-300">${res.tFlex !== null ? fmtPlain(res.tFlex, 1) + 's' : '—'}</strong></span>
                    <span>Custo Puro de Alternância (Alt. − Esc.): <strong class="text-cyan-300">${res.tPureShift !== null ? fmtPlain(res.tPureShift, 1) + 's' : '—'}</strong></span>
                    <span>Erros Automáticos: <strong>${res.errosAuto}</strong> | Erros Executivos: <strong class="${res.errosExec >= 5 ? 'text-rose-300' : 'text-emerald-300'}">${res.errosExec}</strong></span>
                </div>
                <p class="text-slate-200 leading-relaxed pt-1 border-t border-slate-800/80">${C.esc(res.profileSummary)}</p>
            `;
        }
    }

    // =========================================================================
    // 7. SUB-ABA C: SRS-2 — ESCALA DE RESPONSIVIDADE SOCIAL (2ª EDIÇÃO)
    // =========================================================================

    function renderSubTabSrs2(viewport) {
        const C = global.VaultCore;
        const prot = getActiveProtocol();
        const s = prot.srs2;

        const forms = [
            'Pré-Escolar (2a6m–4a6m)',
            'Idade Escolar (4–18 anos — Pais)',
            'Idade Escolar (4–18 anos — Professores)',
            'Adulto — Heterorrelato',
            'Adulto — Autorrelato'
        ];

        const subDefs = [
            { key: 'ps',  code: 'PS',  name: 'Percepção Social', desc: 'Captação de pistas sensoriais e pragmáticas sociais básicas' },
            { key: 'cs',  code: 'CS',  name: 'Cognição Social', desc: 'Interpretação mentalista / Teoria da Mente das pistas sociais' },
            { key: 'cos', code: 'CoS', name: 'Comunicação Social', desc: 'Reciprocidade comunicativa expressiva verbal e não-verbal' },
            { key: 'ms',  code: 'MS',  name: 'Motivação Social', desc: 'Engajamento espontâneo, iniciativa social e ansiedade interpessoal' },
            { key: 'prr', code: 'PRR', name: 'Padrões Restritos e Repetitivos', desc: 'Estereotipias, interesses circunscritos e inflexibilidade de rotina' }
        ];

        viewport.innerHTML = `
            <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-6 space-y-5">
                <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/35 font-mono text-[11px] font-bold text-amber-300">SRS-2 • Escala de Sintomas</span>
                            <h3 class="text-sm sm:text-base font-bold text-slate-100">Escala de Responsividade Social — 2ª Edição (Constantino &amp; Gruber)</h3>
                        </div>
                        <p class="text-xs text-slate-400 mt-0.5">Atenção à polaridade clínica invertida: na SRS-2, <strong>maior Escore <em>T</em> indica maior comprometimento na reciprocidade social</strong> (<em>T</em> ≤ 59 Normal | 60–65 Leve | 66–75 Moderado | ≥ 76 Grave).</p>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                        <select id="srs2-form-select"
                            class="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-cyan-500/40 text-xs font-mono text-cyan-200">
                            ${forms.map((fm) => `<option value="${C.esc(fm)}" ${s.form === fm ? 'selected' : ''}>${C.esc(fm)}</option>`).join('')}
                        </select>
                        <button type="button" id="btn-srs2-push-abnt"
                            class="min-h-[38px] px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition">
                            <i data-lucide="table-properties" class="w-4 h-4"></i>
                            <span>Enviar SRS-2 para Tabela ABNT</span>
                        </button>
                    </div>
                </div>

                <!-- 5 Subescalas de Intervenção -->
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                                <th class="py-2 pr-3">Subescala de Intervenção SRS-2</th>
                                <th class="py-2 px-2 w-24">Escore Bruto</th>
                                <th class="py-2 px-2 w-28">Escore <em>T</em> Tabela</th>
                                <th class="py-2 px-2 w-44">Ou Norma (M / DP)</th>
                                <th class="py-2 px-2 text-center">Percentil Sintoma</th>
                                <th class="py-2 pl-2">Classificação Clínica Oficial SRS-2</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60 text-xs">
                            ${subDefs.map((sd) => {
                                const it = s[sd.key];
                                return `
                                <tr class="hover:bg-slate-900/40">
                                    <td class="py-2.5 pr-3">
                                        <div class="font-bold text-slate-100"><span class="font-mono text-amber-300">${sd.code}</span> — ${sd.name}</div>
                                        <div class="text-[11px] text-slate-400">${sd.desc}</div>
                                    </td>
                                    <td class="py-2.5 px-2">
                                        <input type="text" inputmode="numeric" data-srs-sub="${sd.key}" data-field="raw" value="${C.esc(it.raw)}" placeholder="Bruto"
                                            class="w-20 min-h-[36px] px-2.5 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-100">
                                    </td>
                                    <td class="py-2.5 px-2">
                                        <input type="text" inputmode="decimal" data-srs-sub="${sd.key}" data-field="t" value="${C.esc(it.t)}" placeholder="T (ex: 68)"
                                            class="w-24 min-h-[36px] px-2.5 py-1 rounded-lg bg-[#090d16] border border-amber-500/40 font-mono text-xs font-bold text-amber-200">
                                    </td>
                                    <td class="py-2.5 px-2">
                                        <div class="flex items-center gap-1.5">
                                            <input type="text" inputmode="decimal" data-srs-sub="${sd.key}" data-field="mean" value="${C.esc(it.mean)}" placeholder="M"
                                                class="w-16 min-h-[36px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-800 font-mono text-xs text-slate-300">
                                            <input type="text" inputmode="decimal" data-srs-sub="${sd.key}" data-field="sd" value="${C.esc(it.sd)}" placeholder="DP"
                                                class="w-16 min-h-[36px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-800 font-mono text-xs text-slate-300">
                                        </div>
                                    </td>
                                    <td class="py-2.5 px-2 text-center font-mono text-slate-200" id="srs-out-pct-${sd.key}">—</td>
                                    <td class="py-2.5 pl-2" id="srs-out-sev-${sd.key}">—</td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Subescalas Compatíveis DSM-5-TR (CIS e PRR) + Escore Total SRS-2 -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
                    <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3.5 space-y-2">
                        <div class="text-xs font-bold text-slate-100">Comunicação e Interação Social (CIS — DSM-5-TR)</div>
                        <div class="text-[11px] text-slate-400">Soma automática bruta: <code class="font-mono text-cyan-300">PS + CS + CoS + MS</code> = <strong id="srs-cis-raw" class="font-mono text-slate-100">—</strong></div>
                        <div class="flex items-center gap-2">
                            <label class="text-[11px] font-mono text-slate-400">Escore <em>T</em> CIS:</label>
                            <input type="text" inputmode="decimal" id="srs-cis-t" value="${C.esc(s.cisT)}" placeholder="T da tabela"
                                class="w-28 min-h-[34px] px-2.5 py-1 rounded-lg bg-[#0f172a] border border-amber-500/40 font-mono text-xs font-bold text-amber-200">
                        </div>
                        <div id="srs-cis-badge" class="pt-1"></div>
                    </div>

                    <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3.5 space-y-2">
                        <div class="text-xs font-bold text-slate-100">Padrões Restritos e Repetitivos (PRR — DSM-5-TR)</div>
                        <div class="text-[11px] text-slate-400">Bruto espelhado de PRR: <strong id="srs-prr-mirror-raw" class="font-mono text-slate-100">—</strong></div>
                        <div class="text-xs text-slate-300">Escore <em>T</em> PRR: <strong id="srs-prr-mirror-t" class="font-mono text-amber-200">—</strong></div>
                        <div id="srs-prr-mirror-badge" class="pt-1"></div>
                    </div>

                    <div class="bg-[#090d16] border border-amber-500/35 rounded-xl p-3.5 space-y-2">
                        <div class="text-xs font-bold text-amber-200">Escore Total SRS-2</div>
                        <div class="text-[11px] text-slate-400">Soma automática bruta (<code class="font-mono text-cyan-300">CIS + PRR</code>): <strong id="srs-total-raw" class="font-mono text-slate-100">—</strong></div>
                        <div class="flex items-center gap-2">
                            <label class="text-[11px] font-mono text-slate-400">Escore <em>T</em> Total:</label>
                            <input type="text" inputmode="decimal" id="srs-total-t" value="${C.esc(s.totalT)}" placeholder="T Total"
                                class="w-28 min-h-[34px] px-2.5 py-1 rounded-lg bg-[#0f172a] border border-amber-500/50 font-mono text-xs font-bold text-amber-200">
                        </div>
                        <div id="srs-total-badge" class="pt-1"></div>
                    </div>
                </div>

                <!-- Gráfico Horizontal Visual de Faixas Clínicas SRS-2 (Cortes T=60, T=66, T=76) -->
                <div class="bg-[#090d16] border border-slate-800 rounded-xl p-4 space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <span class="text-xs font-mono uppercase tracking-wider text-amber-300">Perfil Gráfico de Severidade SRS-2 (Cortes Clínicos: <em>T</em> = 60 • <em>T</em> = 66 • <em>T</em> = 76)</span>
                        <div class="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                            <span class="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">≤59 Normal</span>
                            <span class="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30">60–65 Leve</span>
                            <span class="px-2 py-0.5 rounded bg-orange-950/60 text-orange-300 border border-orange-500/30">66–75 Moderado</span>
                            <span class="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30">≥76 Grave</span>
                        </div>
                    </div>
                    <div id="srs2-bars-container" class="space-y-2.5"></div>
                    <div id="srs2-narrative-box" class="pt-2 border-t border-slate-800 text-xs text-slate-300 leading-relaxed"></div>
                </div>
            </div>
        `;

        const formSel = document.getElementById('srs2-form-select');
        if (formSel) {
            formSel.addEventListener('change', () => {
                prot.srs2.form = formSel.value;
                saveState();
                refreshSrs2Outputs();
            });
        }

        viewport.querySelectorAll('[data-srs-sub]').forEach((el) => {
            el.addEventListener('input', () => {
                const k = el.getAttribute('data-srs-sub');
                const f = el.getAttribute('data-field');
                prot.srs2[k][f] = el.value;
                saveState();
                refreshSrs2Outputs();
            });
        });

        const cisTEl = document.getElementById('srs-cis-t');
        if (cisTEl) {
            cisTEl.addEventListener('input', () => {
                prot.srs2.cisT = cisTEl.value;
                saveState();
                refreshSrs2Outputs();
            });
        }

        const totTEl = document.getElementById('srs-total-t');
        if (totTEl) {
            totTEl.addEventListener('input', () => {
                prot.srs2.totalT = totTEl.value;
                saveState();
                refreshSrs2Outputs();
            });
        }

        const btnPush = document.getElementById('btn-srs2-push-abnt');
        if (btnPush) {
            btnPush.addEventListener('click', () => {
                const res = computeSrs2All(prot);
                const list = [
                    { key: 'ps',  label: 'Percepção Social (PS) *', obj: res.ps },
                    { key: 'cs',  label: 'Cognição Social (CS) *', obj: res.cs },
                    { key: 'cos', label: 'Comunicação Social (CoS) *', obj: res.cos },
                    { key: 'ms',  label: 'Motivação Social (MS) *', obj: res.ms },
                    { key: 'prr', label: 'Padrões Restritos e Repetitivos (PRR — DSM-5-TR) *', obj: res.prr },
                    { key: 'cis', label: 'Comunicação e Interação Social (CIS — DSM-5-TR) *', obj: res.cisObj },
                    { key: 'tot', label: 'Escore Total SRS-2 *', obj: res.totalObj }
                ];
                let count = 0;
                list.forEach((it) => {
                    if (it.obj && it.obj.t !== null) {
                        const ciT = calcConfidenceInterval(it.obj.t, 10, 0.92, false);
                        upsertReportRow({
                            uid: `srs2_${it.key}`,
                            domain: 'Cognição Social e Comportamento (Escalas Clínicas)',
                            instrument: `SRS-2 (${prot.srs2.form})`,
                            measure: it.label,
                            raw: it.obj.raw !== null ? it.obj.raw : '—',
                            z: it.obj.z,
                            ep: null,
                            t: it.obj.t,
                            qi: null,
                            ci95: ciT ? ciT.label95 + ' (T)' : '—',
                            pct: it.obj.pctFormatted || formatPercentileClinical(it.obj.pct),
                            classification: it.obj.sev.label,
                            isSymptom: true,
                            plotInCurve: false
                        });
                        count++;
                    }
                });
                if (count === 0) {
                    C.toast('Informe ao menos um Escore T da SRS-2 antes de enviar.', 'warning');
                    return;
                }
                saveState();
                renderHeaderAndSubtabs();
                C.toast(`${count} escala(s) da SRS-2 adicionadas à Tabela ABNT!`, 'success');
            });
        }

        refreshSrs2Outputs();
    }

    function refreshSrs2Outputs() {
        const C = global.VaultCore;
        const prot = getActiveProtocol();
        const res = computeSrs2All(prot);

        ['ps', 'cs', 'cos', 'ms', 'prr'].forEach((k) => {
            const obj = res[k];
            const pctEl = document.getElementById(`srs-out-pct-${k}`);
            const sevEl = document.getElementById(`srs-out-sev-${k}`);
            if (!pctEl) return;
            if (obj.t === null) {
                pctEl.textContent = '—';
                sevEl.innerHTML = '<span class="text-slate-500">—</span>';
            } else {
                pctEl.textContent = obj.pctFormatted;
                sevEl.innerHTML = `<span class="inline-block px-2 py-0.5 rounded border text-[11px] font-semibold ${obj.sev.badge}">${C.esc(obj.sev.label)}</span>`;
            }
        });

        const setEl = (id, txt) => { const e = document.getElementById(id); if (e) e.textContent = txt; };
        setEl('srs-cis-raw', res.cisObj.raw !== null ? String(res.cisObj.raw) : '—');
        setEl('srs-prr-mirror-raw', res.prr.raw !== null ? String(res.prr.raw) : '—');
        setEl('srs-prr-mirror-t', res.prr.t !== null ? fmtPlain(res.prr.t, 0) : '—');
        setEl('srs-total-raw', res.totalObj.raw !== null ? String(res.totalObj.raw) : '—');

        const cisBadge = document.getElementById('srs-cis-badge');
        if (cisBadge) {
            cisBadge.innerHTML = res.cisObj.t !== null
                ? `<span class="inline-block px-2.5 py-0.5 rounded border text-[11px] font-semibold ${res.cisObj.sev.badge}">${C.esc(res.cisObj.sev.label)} (Pc ${res.cisObj.pctFormatted})</span>`
                : '<span class="text-xs text-slate-500">Informe T CIS</span>';
        }
        const prrBadge = document.getElementById('srs-prr-mirror-badge');
        if (prrBadge) {
            prrBadge.innerHTML = res.prr.t !== null
                ? `<span class="inline-block px-2.5 py-0.5 rounded border text-[11px] font-semibold ${res.prr.sev.badge}">${C.esc(res.prr.sev.label)}</span>`
                : '<span class="text-xs text-slate-500">—</span>';
        }
        const totBadge = document.getElementById('srs-total-badge');
        if (totBadge) {
            totBadge.innerHTML = res.totalObj.t !== null
                ? `<span class="inline-block px-2.5 py-0.5 rounded border text-[11px] font-semibold ${res.totalObj.sev.badge}">${C.esc(res.totalObj.sev.label)} (Pc ${res.totalObj.pctFormatted})</span>`
                : '<span class="text-xs text-slate-500">Informe T Total</span>';
        }

        // Renderiza barras visuais (escala T de 35 a 95)
        const barsBox = document.getElementById('srs2-bars-container');
        if (barsBox) {
            const barItems = [
                { label: 'PS — Percepção Social', t: res.ps.t, sev: res.ps.sev },
                { label: 'CS — Cognição Social', t: res.cs.t, sev: res.cs.sev },
                { label: 'CoS — Comunicação Social', t: res.cos.t, sev: res.cos.sev },
                { label: 'MS — Motivação Social', t: res.ms.t, sev: res.ms.sev },
                { label: 'CIS (DSM-5-TR)', t: res.cisObj.t, sev: res.cisObj.sev },
                { label: 'PRR (DSM-5-TR)', t: res.prr.t, sev: res.prr.sev },
                { label: 'ESCORE TOTAL SRS-2', t: res.totalObj.t, sev: res.totalObj.sev }
            ].filter((b) => b.t !== null);

            if (barItems.length === 0) {
                barsBox.innerHTML = `<div class="text-xs text-slate-500">Insira os Escores <em>T</em> acima para visualizar o gráfico horizontal de severidade clínica.</div>`;
            } else {
                const posPct = (tVal) => Math.min(100, Math.max(2, ((tVal - 35) / 60) * 100));
                const cut60 = posPct(60).toFixed(1);
                const cut66 = posPct(66).toFixed(1);
                const cut76 = posPct(76).toFixed(1);

                barsBox.innerHTML = barItems.map((b) => {
                    const wPct = posPct(b.t).toFixed(1);
                    const barColor = b.sev.level === 0 ? 'bg-emerald-500'
                        : b.sev.level === 1 ? 'bg-amber-400'
                        : b.sev.level === 2 ? 'bg-orange-500'
                        : 'bg-rose-500';
                    return `
                        <div class="grid grid-cols-12 items-center gap-2 text-xs">
                            <div class="col-span-4 sm:col-span-3 font-medium text-slate-200 truncate">${C.esc(b.label)}</div>
                            <div class="col-span-6 sm:col-span-7 relative h-5 rounded-md bg-slate-900 border border-slate-800 overflow-hidden">
                                <div class="h-full ${barColor} transition-all duration-300" style="width:${wPct}%"></div>
                                <div class="absolute top-0 bottom-0 border-l border-dashed border-amber-300/70" style="left:${cut60}%" title="Corte T=60 (Leve)"></div>
                                <div class="absolute top-0 bottom-0 border-l border-dashed border-orange-400/80" style="left:${cut66}%" title="Corte T=66 (Moderado)"></div>
                                <div class="absolute top-0 bottom-0 border-l border-dashed border-rose-400/90" style="left:${cut76}%" title="Corte T=76 (Grave)"></div>
                            </div>
                            <div class="col-span-2 font-mono text-right text-slate-200"><em>T</em> = <strong>${fmtPlain(b.t, 0)}</strong></div>
                        </div>
                    `;
                }).join('');
            }
        }

        const narrBox = document.getElementById('srs2-narrative-box');
        if (narrBox) {
            if (res.totalObj.t === null && res.cisObj.t === null) {
                narrBox.textContent = 'Preencha o Escore T Total e/ou CIS para gerar a síntese clínica compatível com os critérios A e B do DSM-5-TR.';
            } else {
                const parts = [`Na Escala de Responsividade Social — 2ª Edição (SRS-2; formulário ${prot.srs2.form})`];
                if (res.totalObj.t !== null) {
                    parts.push(`o Escore Total atingiu T = ${fmtPlain(res.totalObj.t, 0)} (Percentil ${res.totalObj.pctFormatted}; Bruto = ${res.totalObj.raw ?? '—'}), situando-se na faixa "${res.totalObj.sev.label}" (${res.totalObj.sev.detail})`);
                }
                if (res.cisObj.t !== null || res.prr.t !== null) {
                    const dsmBits = [];
                    if (res.cisObj.t !== null) dsmBits.push(`Comunicação e Interação Social [Critério A DSM-5-TR]: T = ${fmtPlain(res.cisObj.t, 0)} (${res.cisObj.sev.label})`);
                    if (res.prr.t !== null) dsmBits.push(`Padrões Restritos e Repetitivos [Critério B DSM-5-TR]: T = ${fmtPlain(res.prr.t, 0)} (${res.prr.sev.label})`);
                    parts.push(`Nas dimensões compatíveis com o DSM-5-TR, observou-se ${dsmBits.join(' e ')}.`);
                }
                narrBox.textContent = parts.join(', ');
            }
        }
    }

    // =========================================================================
    // 8. SUB-ABA D: BPA-2, RAVLT & ESCALAS EXECUTIVAS (SNAP-IV / BDEFS)
    // =========================================================================

    function renderSubTabBpaRavlt(viewport) {
        const C = global.VaultCore;
        const prot = getActiveProtocol();
        const b = prot.bpa2;
        const r = prot.ravlt;
        const ex = prot.execScales;

        const bpaDefs = [
            { key: 'ac', code: 'AC', name: 'Atenção Concentrada', desc: 'Foco sustentado em estímulo-alvo único' },
            { key: 'ad', code: 'AD', name: 'Atenção Dividida', desc: 'Busca simultânea de múltiplos estímulos-alvo' },
            { key: 'aa', code: 'AA', name: 'Atenção Alternada', desc: 'Mudança periódica do estímulo-alvo a cada linha' }
        ];

        viewport.innerHTML = `
            <div class="space-y-6">
                <!-- BLOCO 1: BPA-2 (Rueda) -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-6 space-y-4">
                    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/35 font-mono text-[11px] font-bold text-cyan-300">BPA-2</span>
                                <h3 class="text-sm sm:text-base font-bold text-slate-100">Bateria Psicológica para Avaliação da Atenção (F. J. M. Rueda)</h3>
                            </div>
                            <p class="text-xs text-slate-400 mt-0.5">Fórmula automática <code class="font-mono text-cyan-300">Pontos = Acertos − Erros − Omissões</code> e <code class="font-mono text-cyan-300">Atenção Geral (AG) = AC + AD + AA</code>.</p>
                        </div>
                        <button type="button" id="btn-bpa-push-abnt"
                            class="min-h-[38px] px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition">
                            <i data-lucide="table-properties" class="w-4 h-4"></i>
                            <span>Enviar BPA-2 para Tabela ABNT</span>
                        </button>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                                    <th class="py-2 pr-3">Modalidade BPA-2</th>
                                    <th class="py-2 px-1.5 w-20">Acertos</th>
                                    <th class="py-2 px-1.5 w-20">Erros</th>
                                    <th class="py-2 px-1.5 w-20">Omissões</th>
                                    <th class="py-2 px-2 text-center w-24">Pontos</th>
                                    <th class="py-2 px-2 w-28">Norma</th>
                                    <th class="py-2 px-2 w-44">Pc ou (M / DP)</th>
                                    <th class="py-2 px-2 text-center"><em>Z</em> / <em>T</em></th>
                                    <th class="py-2 pl-2">Classificação DSM-5-TR</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/60 text-xs">
                                ${bpaDefs.map((d) => {
                                    const sub = b[d.key];
                                    return `
                                    <tr class="hover:bg-slate-900/40">
                                        <td class="py-2.5 pr-3">
                                            <div class="font-bold text-slate-100"><span class="font-mono text-cyan-300">${d.code}</span> — ${d.name}</div>
                                            <div class="text-[11px] text-slate-400">${d.desc}</div>
                                        </td>
                                        <td class="py-2 px-1.5">
                                            <input type="text" inputmode="numeric" data-bpa-sub="${d.key}" data-field="hits" value="${C.esc(sub.hits)}" placeholder="A"
                                                class="w-16 min-h-[34px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-100">
                                        </td>
                                        <td class="py-2 px-1.5">
                                            <input type="text" inputmode="numeric" data-bpa-sub="${d.key}" data-field="errors" value="${C.esc(sub.errors)}" placeholder="E"
                                                class="w-16 min-h-[34px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-rose-200">
                                        </td>
                                        <td class="py-2 px-1.5">
                                            <input type="text" inputmode="numeric" data-bpa-sub="${d.key}" data-field="omissions" value="${C.esc(sub.omissions)}" placeholder="O"
                                                class="w-16 min-h-[34px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-amber-200">
                                        </td>
                                        <td class="py-2 px-2 text-center font-mono font-bold text-cyan-300" id="bpa-pts-${d.key}">—</td>
                                        <td class="py-2 px-2">
                                            <select data-bpa-sub="${d.key}" data-field="mode"
                                                class="w-full min-h-[34px] px-1.5 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-[11px] text-slate-200">
                                                <option value="PCT" ${sub.mode !== 'M_SD' ? 'selected' : ''}>Percentil</option>
                                                <option value="M_SD" ${sub.mode === 'M_SD' ? 'selected' : ''}>M e DP</option>
                                            </select>
                                        </td>
                                        <td class="py-2 px-2">
                                            ${sub.mode === 'M_SD' ? `
                                                <div class="flex items-center gap-1">
                                                    <input type="text" inputmode="decimal" data-bpa-sub="${d.key}" data-field="mean" value="${C.esc(sub.mean)}" placeholder="M"
                                                        class="w-16 min-h-[34px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-200">
                                                    <input type="text" inputmode="decimal" data-bpa-sub="${d.key}" data-field="sd" value="${C.esc(sub.sd)}" placeholder="DP"
                                                        class="w-16 min-h-[34px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-200">
                                                </div>
                                            ` : `
                                                <input type="text" inputmode="decimal" data-bpa-sub="${d.key}" data-field="pct" value="${C.esc(sub.pct)}" placeholder="Percentil (1–99)"
                                                    class="w-28 min-h-[34px] px-2.5 py-1 rounded-lg bg-[#090d16] border border-cyan-500/40 font-mono text-xs text-cyan-200">
                                            `}
                                        </td>
                                        <td class="py-2 px-2 text-center font-mono text-slate-300" id="bpa-zt-${d.key}">—</td>
                                        <td class="py-2 pl-2" id="bpa-cls-${d.key}">—</td>
                                    </tr>`;
                                }).join('')}
                                <!-- Linha Atenção Geral (AG) -->
                                <tr class="bg-slate-900/60 font-semibold">
                                    <td class="py-2.5 pr-3" colspan="4">
                                        <span class="font-mono text-emerald-300">AG</span> — Atenção Geral (Soma Automática AC + AD + AA)
                                    </td>
                                    <td class="py-2.5 px-2 text-center font-mono font-bold text-emerald-300" id="bpa-pts-ag">—</td>
                                    <td class="py-2.5 px-2">
                                        <select data-bpa-sub="ag" data-field="mode"
                                            class="w-full min-h-[34px] px-1.5 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-[11px] text-slate-200">
                                            <option value="PCT" ${b.ag.mode !== 'M_SD' ? 'selected' : ''}>Percentil</option>
                                            <option value="M_SD" ${b.ag.mode === 'M_SD' ? 'selected' : ''}>M e DP</option>
                                        </select>
                                    </td>
                                    <td class="py-2.5 px-2">
                                        ${b.ag.mode === 'M_SD' ? `
                                            <div class="flex items-center gap-1">
                                                <input type="text" inputmode="decimal" data-bpa-sub="ag" data-field="mean" value="${C.esc(b.ag.mean)}" placeholder="M"
                                                    class="w-16 min-h-[34px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-200">
                                                <input type="text" inputmode="decimal" data-bpa-sub="ag" data-field="sd" value="${C.esc(b.ag.sd)}" placeholder="DP"
                                                    class="w-16 min-h-[34px] px-2 py-1 rounded-lg bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-200">
                                            </div>
                                        ` : `
                                            <input type="text" inputmode="decimal" data-bpa-sub="ag" data-field="pct" value="${C.esc(b.ag.pct)}" placeholder="Percentil AG"
                                                class="w-28 min-h-[34px] px-2.5 py-1 rounded-lg bg-[#090d16] border border-emerald-500/40 font-mono text-xs text-emerald-200">
                                        `}
                                    </td>
                                    <td class="py-2.5 px-2 text-center font-mono text-slate-300" id="bpa-zt-ag">—</td>
                                    <td class="py-2.5 pl-2" id="bpa-cls-ag">—</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div id="bpa-qual-box" class="bg-[#090d16] border border-slate-800 rounded-xl p-3 text-xs text-slate-300"></div>
                </div>

                <!-- BLOCO 2: RAVLT (Aprendizagem Auditivo-Verbal de Rey) -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-6 space-y-4">
                    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/35 font-mono text-[11px] font-bold text-cyan-300">RAVLT</span>
                                <h3 class="text-sm sm:text-base font-bold text-slate-100">Teste de Aprendizagem Auditivo-Verbal de Rey (Malloy-Diniz)</h3>
                            </div>
                            <p class="text-xs text-slate-400 mt-0.5">Calcula Σ(A1–A5), ALT, Velocidade de Esquecimento (A7 ÷ A6), Interferência Proativa (B1 ÷ A1), Retroativa (A6 ÷ A5) e Curva SVG.</p>
                        </div>
                        <button type="button" id="btn-ravlt-push-abnt"
                            class="min-h-[38px] px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition">
                            <i data-lucide="table-properties" class="w-4 h-4"></i>
                            <span>Enviar RAVLT para Tabela ABNT</span>
                        </button>
                    </div>

                    <div class="grid grid-cols-4 sm:grid-cols-8 gap-2">
                        ${['a1', 'a2', 'a3', 'a4', 'a5', 'b1', 'a6', 'a7'].map((tk) => `
                            <div class="bg-[#090d16] border border-slate-800 rounded-xl p-2 text-center">
                                <label class="block text-[10px] font-mono uppercase text-cyan-300 mb-1">${tk.toUpperCase()} (0–15)</label>
                                <input type="text" inputmode="numeric" data-ravlt-trial="${tk}" value="${C.esc(r[tk])}" placeholder="—"
                                    class="w-full min-h-[34px] px-1.5 py-1 rounded-lg bg-[#0f172a] border border-slate-700 font-mono text-center text-xs font-bold text-slate-100">
                            </div>
                        `).join('')}
                    </div>

                    <!-- Reconhecimento + Índices + Mini-Curva SVG -->
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                        <div class="lg:col-span-7 space-y-3">
                            <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-3 text-xs">
                                <select id="ravlt-rec-conv" class="min-h-[34px] px-2.5 py-1 rounded-lg bg-[#0f172a] border border-slate-700 font-mono text-[11px] text-cyan-200">
                                    <option value="NET_35" ${r.recConvention !== 'RAW_50_MINUS_35' ? 'selected' : ''}>Acertos Lista A (0–15) e Falsos Positivos (0–35)</option>
                                    <option value="RAW_50_MINUS_35" ${r.recConvention === 'RAW_50_MINUS_35' ? 'selected' : ''}>Total Bruto Reconhecimento (0–50) − 35</option>
                                </select>
                                <input type="text" inputmode="numeric" id="ravlt-rec-hits" value="${C.esc(r.recHits)}" placeholder="Acertos / Bruto"
                                    class="w-28 min-h-[34px] px-2.5 py-1 rounded-lg bg-[#0f172a] border border-slate-700 font-mono text-xs text-slate-100">
                                <input type="text" inputmode="numeric" id="ravlt-rec-fp" value="${C.esc(r.recFP)}" placeholder="Falsos Pos."
                                    class="w-24 min-h-[34px] px-2.5 py-1 rounded-lg bg-[#0f172a] border border-slate-700 font-mono text-xs text-rose-200 ${r.recConvention === 'RAW_50_MINUS_35' ? 'hidden' : ''}">
                                <span class="font-mono text-slate-300">REC Líquido: <strong id="ravlt-rec-net" class="text-cyan-300">—</strong></span>
                            </div>

                            <!-- Normas rápidas Z ou Percentil para as 5 medidas principais do RAVLT -->
                            <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3 space-y-2">
                                <div class="text-[11px] font-mono uppercase text-slate-400">Conversão Normativa Rápida RAVLT (informe <em>Z</em> ou Percentil consultado na faixa etária)</div>
                                <div class="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                                    ${[
                                        { key: 'total', label: 'Σ A1–A5' },
                                        { key: 'alt', label: 'ALT' },
                                        { key: 'a6', label: 'A6 (Pós-Int)' },
                                        { key: 'a7', label: 'A7 (Tardia)' },
                                        { key: 'rec', label: 'Reconhec.' }
                                    ].map((nk) => `
                                        <div class="p-2 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                                            <div class="font-mono font-bold text-cyan-300 text-[11px]">${nk.label}</div>
                                            <input type="text" inputmode="decimal" data-ravlt-norm="${nk.key}" data-nfield="pct" value="${C.esc(r.norms[nk.key].pct)}" placeholder="Pc (1–99)"
                                                class="w-full px-2 py-1 rounded bg-[#090d16] border border-slate-700 font-mono text-[11px] text-slate-200">
                                            <input type="text" inputmode="decimal" data-ravlt-norm="${nk.key}" data-nfield="z" value="${C.esc(r.norms[nk.key].z)}" placeholder="ou Z"
                                                class="w-full px-2 py-1 rounded bg-[#090d16] border border-slate-700 font-mono text-[11px] text-slate-300">
                                            <div id="ravlt-norm-out-${nk.key}" class="text-[10px] text-slate-400 truncate">—</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Curva SVG de Aprendizagem A1 -> A5 -> B1 -> A6 -> A7 + Índices -->
                        <div class="lg:col-span-5 bg-[#090d16] border border-slate-800 rounded-xl p-3.5 space-y-2.5">
                            <div class="text-[11px] font-mono uppercase text-cyan-400">Curva de Aprendizagem Episódica (A1→A5 • B1 • A6 • A7)</div>
                            <div id="ravlt-svg-wrap" class="w-full h-36 flex items-center justify-center bg-slate-950/70 rounded-lg border border-slate-800/80"></div>
                            <div id="ravlt-indices-grid" class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono"></div>
                        </div>
                    </div>

                    <div id="ravlt-clinical-note" class="bg-[#090d16] border border-slate-800 rounded-xl p-3 text-xs text-slate-300"></div>
                </div>

                <!-- BLOCO 3: ESCALAS EXECUTIVAS E ATENCIONAIS (SNAP-IV & BDEFS / ASRS) -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-6 space-y-4">
                    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div>
                            <h3 class="text-sm font-bold text-slate-100">Rastreio Comportamental &amp; Disfunção Executiva Ecológica (SNAP-IV / BDEFS / BRIEF-2)</h3>
                            <p class="text-xs text-slate-400">Apuração rápida de critérios sintomatológicos (SNAP-IV: corte ≥ 6 de 9 itens "Bastante/Demais") e escalas executivas ecológicas.</p>
                        </div>
                        <button type="button" id="btn-exec-push-abnt"
                            class="min-h-[36px] px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-200 font-semibold text-xs flex items-center gap-1.5 transition">
                            <i data-lucide="plus-circle" class="w-4 h-4"></i>
                            <span>Enviar Escalas Executivas para Tabela ABNT</span>
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3.5 space-y-2.5">
                            <div class="font-bold text-slate-100">SNAP-IV (26 itens — Mattos et al.)</div>
                            <div class="grid grid-cols-3 gap-2">
                                <div>
                                    <label class="block text-[10px] font-mono text-slate-400 mb-1">Desatenção (nº itens 2–3 /9)</label>
                                    <input type="text" inputmode="numeric" data-exec-f="snapInatCount" value="${C.esc(ex.snapInatCount)}" placeholder="Ex: 7"
                                        class="w-full min-h-[34px] px-2.5 py-1 rounded bg-[#0f172a] border border-slate-700 font-mono text-xs text-slate-100">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-mono text-slate-400 mb-1">Hiper/Impuls. (nº itens /9)</label>
                                    <input type="text" inputmode="numeric" data-exec-f="snapHiperCount" value="${C.esc(ex.snapHiperCount)}" placeholder="Ex: 5"
                                        class="w-full min-h-[34px] px-2.5 py-1 rounded bg-[#0f172a] border border-slate-700 font-mono text-xs text-slate-100">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-mono text-slate-400 mb-1">TOD Oposição (nº itens /8)</label>
                                    <input type="text" inputmode="numeric" data-exec-f="snapTodCount" value="${C.esc(ex.snapTodCount)}" placeholder="Ex: 2"
                                        class="w-full min-h-[34px] px-2.5 py-1 rounded bg-[#0f172a] border border-slate-700 font-mono text-xs text-slate-100">
                                </div>
                            </div>
                            <div id="snap-out-summary" class="text-[11px] font-mono text-slate-300 pt-1">—</div>
                        </div>

                        <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3.5 space-y-2.5">
                            <input type="text" data-exec-f="bdefsName" value="${C.esc(ex.bdefsName)}"
                                class="w-full px-2.5 py-1 rounded bg-[#0f172a] border border-slate-700 text-xs font-bold text-amber-200">
                            <div class="grid grid-cols-3 gap-2">
                                <div>
                                    <label class="block text-[10px] font-mono text-slate-400 mb-1">Escore Bruto</label>
                                    <input type="text" inputmode="decimal" data-exec-f="bdefsRaw" value="${C.esc(ex.bdefsRaw)}" placeholder="Bruto"
                                        class="w-full min-h-[34px] px-2.5 py-1 rounded bg-[#0f172a] border border-slate-700 font-mono text-xs text-slate-100">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-mono text-slate-400 mb-1">Percentil Sintoma</label>
                                    <input type="text" inputmode="decimal" data-exec-f="bdefsPct" value="${C.esc(ex.bdefsPct)}" placeholder="Ex: 96"
                                        class="w-full min-h-[34px] px-2.5 py-1 rounded bg-[#0f172a] border border-amber-500/40 font-mono text-xs text-amber-200">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-mono text-slate-400 mb-1">Ou Escore T</label>
                                    <input type="text" inputmode="decimal" data-exec-f="bdefsT" value="${C.esc(ex.bdefsT)}" placeholder="Ex: 68"
                                        class="w-full min-h-[34px] px-2.5 py-1 rounded bg-[#0f172a] border border-slate-700 font-mono text-xs text-slate-200">
                                </div>
                            </div>
                            <div id="bdefs-out-summary" class="text-[11px] font-mono text-slate-300 pt-1">—</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Eventos BPA-2
        viewport.querySelectorAll('[data-bpa-sub]').forEach((el) => {
            const k = el.getAttribute('data-bpa-sub');
            const f = el.getAttribute('data-field');
            const evName = el.tagName === 'SELECT' ? 'change' : 'input';
            el.addEventListener(evName, () => {
                prot.bpa2[k][f] = el.value;
                saveState();
                if (f === 'mode') {
                    renderSubTabBpaRavlt(viewport);
                    C.refreshIcons(viewport);
                } else {
                    refreshBpaRavltOutputs();
                }
            });
        });

        const btnBpaPush = document.getElementById('btn-bpa-push-abnt');
        if (btnBpaPush) {
            btnBpaPush.addEventListener('click', () => {
                const res = computeBpa2All(prot);
                const list = [
                    { key: 'ac', label: 'Atenção Concentrada (AC)', obj: res.ac },
                    { key: 'ad', label: 'Atenção Dividida (AD)', obj: res.ad },
                    { key: 'aa', label: 'Atenção Alternada (AA)', obj: res.aa },
                    { key: 'ag', label: 'Atenção Geral (AG)', obj: res.ag }
                ];
                let count = 0;
                list.forEach((it) => {
                    if (it.obj && it.obj.pts !== null) {
                        upsertReportRow({
                            uid: `bpa2_${it.key}`,
                            domain: 'Atenção e Velocidade de Processamento',
                            instrument: 'BPA-2',
                            measure: it.label,
                            raw: it.obj.pts,
                            z: it.obj.z,
                            ep: it.obj.metrics ? it.obj.metrics.ep : null,
                            t: it.obj.metrics ? it.obj.metrics.t : null,
                            qi: it.obj.metrics ? Math.round(it.obj.metrics.qi) : null,
                            ci95: it.obj.metrics && it.obj.metrics.ciT ? it.obj.metrics.ciT.label95 + ' (T)' : '—',
                            pct: it.obj.metrics ? it.obj.metrics.pctFormatted : '—',
                            classification: it.obj.metrics ? it.obj.metrics.classification.label : 'Registro Bruto',
                            isSymptom: false,
                            plotInCurve: Boolean(it.obj.metrics)
                        });
                        count++;
                    }
                });
                if (count === 0) {
                    C.toast('Informe ao menos os acertos da BPA-2 antes de enviar.', 'warning');
                    return;
                }
                saveState();
                renderHeaderAndSubtabs();
                C.toast(`${count} medida(s) da BPA-2 enviadas para a Tabela ABNT!`, 'success');
            });
        }

        // Eventos RAVLT
        viewport.querySelectorAll('[data-ravlt-trial]').forEach((el) => {
            el.addEventListener('input', () => {
                prot.ravlt[el.getAttribute('data-ravlt-trial')] = el.value;
                saveState();
                refreshBpaRavltOutputs();
            });
        });

        const recConv = document.getElementById('ravlt-rec-conv');
        if (recConv) {
            recConv.addEventListener('change', () => {
                prot.ravlt.recConvention = recConv.value;
                saveState();
                renderSubTabBpaRavlt(viewport);
                C.refreshIcons(viewport);
            });
        }
        const recH = document.getElementById('ravlt-rec-hits');
        if (recH) recH.addEventListener('input', () => { prot.ravlt.recHits = recH.value; saveState(); refreshBpaRavltOutputs(); });
        const recFP = document.getElementById('ravlt-rec-fp');
        if (recFP) recFP.addEventListener('input', () => { prot.ravlt.recFP = recFP.value; saveState(); refreshBpaRavltOutputs(); });

        viewport.querySelectorAll('[data-ravlt-norm]').forEach((el) => {
            el.addEventListener('input', () => {
                const nk = el.getAttribute('data-ravlt-norm');
                const nf = el.getAttribute('data-nfield');
                prot.ravlt.norms[nk][nf] = el.value;
                saveState();
                refreshBpaRavltOutputs();
            });
        });

        const btnRavltPush = document.getElementById('btn-ravlt-push-abnt');
        if (btnRavltPush) {
            btnRavltPush.addEventListener('click', () => {
                const res = computeRavltAll(prot);
                const list = [
                    { key: 'total', label: 'Escore Total de Aprendizagem (Σ A1–A5)', raw: res.total, m: res.norms.total },
                    { key: 'alt',   label: 'Aprendizagem ao Longo das Tentativas (ALT)', raw: res.alt, m: res.norms.alt },
                    { key: 'a6',    label: 'Evocação Pós-Interferência (A6)', raw: res.a6, m: res.norms.a6 },
                    { key: 'a7',    label: 'Evocação Tardia 30 min (A7)', raw: res.a7, m: res.norms.a7 },
                    { key: 'vel',   label: 'Velocidade de Esquecimento (A7 ÷ A6)', raw: res.velEsq !== null ? fmtPlain(res.velEsq, 2) : null, m: null },
                    { key: 'rec',   label: 'Reconhecimento Líquido', raw: res.recNet, m: res.norms.rec }
                ];
                let count = 0;
                list.forEach((it) => {
                    if (it.raw !== null && it.raw !== undefined) {
                        upsertReportRow({
                            uid: `ravlt_${it.key}`,
                            domain: 'Memória e Aprendizagem Episódica',
                            instrument: 'RAVLT',
                            measure: it.label,
                            raw: it.raw,
                            z: it.m ? it.m.z : null,
                            ep: it.m ? it.m.ep : null,
                            t: it.m ? it.m.t : null,
                            qi: it.m ? Math.round(it.m.qi) : null,
                            ci95: it.m && it.m.ciT ? it.m.ciT.label95 + ' (T)' : '—',
                            pct: it.m ? it.m.pctFormatted : '—',
                            classification: it.m ? it.m.classification.label : 'Índice Clínico',
                            isSymptom: false,
                            plotInCurve: Boolean(it.m)
                        });
                        count++;
                    }
                });
                if (count === 0) {
                    C.toast('Preencha as tentativas do RAVLT antes de enviar.', 'warning');
                    return;
                }
                saveState();
                renderHeaderAndSubtabs();
                C.toast(`${count} índice(s) do RAVLT enviados para a Tabela ABNT!`, 'success');
            });
        }

        // Eventos Escalas Executivas
        viewport.querySelectorAll('[data-exec-f]').forEach((el) => {
            el.addEventListener('input', () => {
                prot.execScales[el.getAttribute('data-exec-f')] = el.value;
                saveState();
                refreshBpaRavltOutputs();
            });
        });

        const btnExecPush = document.getElementById('btn-exec-push-abnt');
        if (btnExecPush) {
            btnExecPush.addEventListener('click', () => {
                let count = 0;
                const inat = parseNumInput(prot.execScales.snapInatCount);
                const hip = parseNumInput(prot.execScales.snapHiperCount);
                const tod = parseNumInput(prot.execScales.snapTodCount);
                if (inat !== null) {
                    upsertReportRow({
                        uid: 'snap_inat', domain: 'Cognição Social e Comportamento (Escalas Clínicas)',
                        instrument: 'SNAP-IV', measure: 'Desatenção (Critérios Positivos / 9) *',
                        raw: `${inat}/9`, z: null, ep: null, t: null, qi: null, ci95: '—', pct: '—',
                        classification: inat >= 6 ? 'Acima do Corte Clínico (≥ 6/9)' : 'Abaixo do Corte Clínico (< 6/9)',
                        isSymptom: true, plotInCurve: false
                    });
                    count++;
                }
                if (hip !== null) {
                    upsertReportRow({
                        uid: 'snap_hip', domain: 'Cognição Social e Comportamento (Escalas Clínicas)',
                        instrument: 'SNAP-IV', measure: 'Hiperatividade / Impulsividade (Critérios / 9) *',
                        raw: `${hip}/9`, z: null, ep: null, t: null, qi: null, ci95: '—', pct: '—',
                        classification: hip >= 6 ? 'Acima do Corte Clínico (≥ 6/9)' : 'Abaixo do Corte Clínico (< 6/9)',
                        isSymptom: true, plotInCurve: false
                    });
                    count++;
                }
                if (tod !== null) {
                    upsertReportRow({
                        uid: 'snap_tod', domain: 'Cognição Social e Comportamento (Escalas Clínicas)',
                        instrument: 'SNAP-IV', measure: 'Desafio e Oposição — TOD (Critérios / 8) *',
                        raw: `${tod}/8`, z: null, ep: null, t: null, qi: null, ci95: '—', pct: '—',
                        classification: tod >= 4 ? 'Acima do Corte Clínico (≥ 4/8)' : 'Abaixo do Corte Clínico (< 4/8)',
                        isSymptom: true, plotInCurve: false
                    });
                    count++;
                }

                const bPct = parseNumInput(prot.execScales.bdefsPct);
                const bT = parseNumInput(prot.execScales.bdefsT);
                let zSymp = null;
                if (bT !== null) zSymp = tToZ(bT);
                else if (bPct !== null && bPct > 0 && bPct < 100) zSymp = percentileToZ(bPct);
                if (zSymp !== null) {
                    const tFinal = zToT(zSymp);
                    const sev = classifySymptomT(tFinal, 'GENERAL');
                    upsertReportRow({
                        uid: 'exec_bdefs_main', domain: 'Cognição Social e Comportamento (Escalas Clínicas)',
                        instrument: prot.execScales.bdefsName || 'BDEFS / Escala Executiva',
                        measure: 'Índice Global de Disfunção Executiva *',
                        raw: prot.execScales.bdefsRaw || '—',
                        z: zSymp, ep: null, t: tFinal, qi: null, ci95: '—',
                        pct: formatPercentileClinical(zToPercentile(zSymp)),
                        classification: sev.label,
                        isSymptom: true, plotInCurve: false
                    });
                    count++;
                }

                if (count === 0) {
                    C.toast('Preencha SNAP-IV ou Percentil/T da escala executiva antes de enviar.', 'warning');
                    return;
                }
                saveState();
                renderHeaderAndSubtabs();
                C.toast(`${count} indicador(es) executivos enviados para a Tabela ABNT!`, 'success');
            });
        }

        refreshBpaRavltOutputs();
    }

    function refreshBpaRavltOutputs() {
        const C = global.VaultCore;
        const prot = getActiveProtocol();
        const bpa = computeBpa2All(prot);

        ['ac', 'ad', 'aa', 'ag'].forEach((k) => {
            const obj = bpa[k];
            const ptsEl = document.getElementById(`bpa-pts-${k}`);
            const ztEl = document.getElementById(`bpa-zt-${k}`);
            const clsEl = document.getElementById(`bpa-cls-${k}`);
            if (!ptsEl) return;
            ptsEl.textContent = obj.pts !== null ? String(obj.pts) : '—';
            if (!obj.metrics) {
                ztEl.textContent = '—';
                clsEl.innerHTML = '<span class="text-slate-500">—</span>';
            } else {
                ztEl.textContent = `${fmtSigned(obj.z, 2)} / T ${fmtPlain(obj.metrics.t, 0)}`;
                clsEl.innerHTML = `<span class="inline-block px-2 py-0.5 rounded border text-[11px] font-semibold ${obj.metrics.classification.badge}">Pc ${obj.metrics.pctFormatted} • ${C.esc(obj.metrics.classification.label)}</span>`;
            }
        });

        const qualBox = document.getElementById('bpa-qual-box');
        if (qualBox) qualBox.textContent = bpa.qualProfile;

        // RAVLT
        const rav = computeRavltAll(prot);
        const recNetEl = document.getElementById('ravlt-rec-net');
        if (recNetEl) recNetEl.textContent = rav.recNet !== null ? String(rav.recNet) : '—';

        ['total', 'alt', 'a6', 'a7', 'rec'].forEach((nk) => {
            const el = document.getElementById(`ravlt-norm-out-${nk}`);
            if (!el) return;
            const m = rav.norms[nk];
            el.innerHTML = m ? `<span class="text-cyan-300">Pc ${m.pctFormatted}</span> • ${C.esc(m.classification.label)}` : '—';
        });

        const indGrid = document.getElementById('ravlt-indices-grid');
        if (indGrid) {
            const cells = [
                { k: 'Σ A1–A5', v: rav.total !== null ? `${rav.total}/75` : '—' },
                { k: 'ALT', v: rav.alt !== null ? fmtSigned(rav.alt, 0) : '—' },
                { k: 'Vel. Esq (A7/A6)', v: rav.velEsq !== null ? fmtPlain(rav.velEsq, 2) : '—' },
                { k: 'IP (B1/A1)', v: rav.ip !== null ? fmtPlain(rav.ip, 2) : '—' },
                { k: 'IR (A6/A5)', v: rav.ir !== null ? fmtPlain(rav.ir, 2) : '—' },
                { k: 'REC Líquido', v: rav.recNet !== null ? `${rav.recNet}/15` : '—' }
            ];
            indGrid.innerHTML = cells.map((c) => `
                <div class="px-2 py-1.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span class="text-slate-400">${c.k}:</span>
                    <strong class="text-cyan-300">${c.v}</strong>
                </div>
            `).join('');
        }

        const svgWrap = document.getElementById('ravlt-svg-wrap');
        if (svgWrap) {
            const pts = [
                { lbl: 'A1', val: rav.a1 },
                { lbl: 'A2', val: rav.a2 },
                { lbl: 'A3', val: rav.a3 },
                { lbl: 'A4', val: rav.a4 },
                { lbl: 'A5', val: rav.a5 },
                { lbl: 'B1', val: rav.b1 },
                { lbl: 'A6', val: rav.a6 },
                { lbl: 'A7', val: rav.a7 }
            ];
            const validCount = pts.filter((p) => p.val !== null).length;
            if (validCount < 2) {
                svgWrap.innerHTML = `<span class="text-xs text-slate-500">Insira ao menos 2 etapas para plotar a curva de aprendizagem</span>`;
            } else {
                const W = 360, H = 128, padX = 28, padY = 18;
                const stepX = (W - padX * 2) / (pts.length - 1);
                const yOf = (v) => padY + ((15 - Math.min(15, Math.max(0, v))) / 15) * (H - padY * 2);

                const polyPts = pts
                    .map((p, i) => p.val !== null ? `${(padX + i * stepX).toFixed(1)},${yOf(p.val).toFixed(1)}` : null)
                    .filter(Boolean)
                    .join(' ');

                svgWrap.innerHTML = `
                    <svg viewBox="0 0 ${W} ${H}" class="w-full h-full">
                        <line x1="${padX}" y1="${yOf(15)}" x2="${W - padX}" y2="${yOf(15)}" stroke="#1e293b" stroke-dasharray="3,3"/>
                        <line x1="${padX}" y1="${yOf(7.5)}" x2="${W - padX}" y2="${yOf(7.5)}" stroke="#1e293b" stroke-dasharray="3,3"/>
                        <line x1="${padX}" y1="${yOf(0)}" x2="${W - padX}" y2="${yOf(0)}" stroke="#334155"/>
                        <polyline fill="none" stroke="#22d3ee" stroke-width="2.2" points="${polyPts}"/>
                        ${pts.map((p, i) => {
                            const cx = (padX + i * stepX).toFixed(1);
                            const cy = p.val !== null ? yOf(p.val).toFixed(1) : null;
                            const dotColor = p.lbl === 'B1' ? '#fbbf24' : '#22d3ee';
                            return `
                                <text x="${cx}" y="${H - 3}" text-anchor="middle" fill="#94a3b8" font-size="9" font-family="JetBrains Mono">${p.lbl}</text>
                                ${cy !== null ? `
                                    <circle cx="${cx}" cy="${cy}" r="3.5" fill="${dotColor}"/>
                                    <text x="${cx}" y="${Math.max(10, Number(cy) - 6)}" text-anchor="middle" fill="#e2e8f0" font-size="9" font-family="JetBrains Mono">${p.val}</text>
                                ` : ''}
                            `;
                        }).join('')}
                    </svg>
                `;
            }
        }

        const rNote = document.getElementById('ravlt-clinical-note');
        if (rNote) rNote.textContent = rav.clinicalNote;

        // SNAP-IV & BDEFS outputs
        const snapEl = document.getElementById('snap-out-summary');
        if (snapEl) {
            const inat = parseNumInput(prot.execScales.snapInatCount);
            const hip = parseNumInput(prot.execScales.snapHiperCount);
            const tod = parseNumInput(prot.execScales.snapTodCount);
            if (inat === null && hip === null && tod === null) {
                snapEl.textContent = 'Informe a contagem de itens pontuados como "Bastante (2)" ou "Demais (3)".';
            } else {
                const tags = [];
                if (inat !== null) tags.push(`Desatenção: ${inat}/9 (${inat >= 6 ? 'POSITIVO ≥6' : 'Negativo'})`);
                if (hip !== null) tags.push(`Hiperatividade: ${hip}/9 (${hip >= 6 ? 'POSITIVO ≥6' : 'Negativo'})`);
                if (tod !== null) tags.push(`TOD: ${tod}/8 (${tod >= 4 ? 'POSITIVO ≥4' : 'Negativo'})`);
                snapEl.textContent = tags.join(' • ');
            }
        }

        const bdefsEl = document.getElementById('bdefs-out-summary');
        if (bdefsEl) {
            const bPct = parseNumInput(prot.execScales.bdefsPct);
            const bT = parseNumInput(prot.execScales.bdefsT);
            let zS = null;
            if (bT !== null) zS = tToZ(bT);
            else if (bPct !== null && bPct > 0 && bPct < 100) zS = percentileToZ(bPct);
            if (zS === null) {
                bdefsEl.textContent = 'Informe Percentil (ex: 95) ou Escore T (ex: 66) de sintomas executivos.';
            } else {
                const tF = zToT(zS);
                const sev = classifySymptomT(tF, 'GENERAL');
                bdefsEl.innerHTML = `<em>Z</em> = ${fmtSigned(zS, 2)} • <em>T</em> = ${fmtPlain(tF, 1)} • Pc ${formatPercentileClinical(zToPercentile(zS))} → <strong class="text-amber-300">${C.esc(sev.label)}</strong>`;
            }
        }
    }

    // =========================================================================
    // 9. SUB-ABA E: CALCULADORA UNIVERSAL + BANCO PESSOAL DE NORMAS
    // =========================================================================

    function renderSubTabUniversal(viewport) {
        const C = global.VaultCore;
        const u = universalState;

        viewport.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Coluna Esquerda: Conversor Universal Bidirecional -->
                <div class="lg:col-span-7 bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-6 space-y-4">
                    <div class="border-b border-slate-800 pb-3">
                        <span class="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/35 font-mono text-[11px] font-bold text-cyan-300">Conversor Universal</span>
                        <h3 class="text-sm sm:text-base font-bold text-slate-100 mt-1">Calculadora Psicométrica para Qualquer Instrumento</h3>
                        <p class="text-xs text-slate-400">Rey, Stroop, TMT A/B, Torre de Londres, Fluência Verbal, BRIEF-2, BDEFS, ETDAH-AD, Vineland-3.</p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                            <label class="block text-[11px] font-mono text-slate-400 mb-1">Instrumento</label>
                            <input type="text" id="univ-instrument" value="${C.esc(u.instrument)}" placeholder="Ex: Figura Complexa de Rey"
                                class="w-full min-h-[36px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-slate-100">
                        </div>
                        <div>
                            <label class="block text-[11px] font-mono text-slate-400 mb-1">Subteste / Variável</label>
                            <input type="text" id="univ-subtest" value="${C.esc(u.subtest)}" placeholder="Ex: Cópia / Parte B Tempo"
                                class="w-full min-h-[36px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-slate-100">
                        </div>
                        <div>
                            <label class="block text-[11px] font-mono text-slate-400 mb-1">Domínio no Laudo ABNT</label>
                            <select id="univ-domain" class="w-full min-h-[36px] px-2.5 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-slate-200">
                                ${COGNITIVE_DOMAINS.map((d) => `<option value="${C.esc(d)}" ${u.domain === d ? 'selected' : ''}>${C.esc(d)}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-[11px] font-mono text-slate-400 mb-1">Polaridade Taxonômica</label>
                            <select id="univ-polarity" class="w-full min-h-[36px] px-2.5 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-cyan-200 font-semibold">
                                <option value="SKILL" ${u.polarity === 'SKILL' ? 'selected' : ''}>Habilidade Cognitiva (Maior Z = Melhor)</option>
                                <option value="SYMPTOM" ${u.polarity === 'SYMPTOM' ? 'selected' : ''}>Escala Clínica de Sintomas (Maior T = Maior Gravidade)</option>
                                <option value="SRS2" ${u.polarity === 'SRS2' ? 'selected' : ''}>Cortes Específicos SRS-2 (TEA)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Seletor de Modo de Entrada -->
                    <div class="flex flex-wrap items-center gap-2 pt-1">
                        <button type="button" id="btn-univ-mode-raw"
                            class="px-3 py-1.5 rounded-lg border text-xs font-semibold ${u.entryMode === 'RAW_NORM' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' : 'bg-[#090d16] border-slate-800 text-slate-400'}">
                            1. Por Pontuação Bruta + Norma (X, M, DP)
                        </button>
                        <button type="button" id="btn-univ-mode-direct"
                            class="px-3 py-1.5 rounded-lg border text-xs font-semibold ${u.entryMode === 'DIRECT_SCORE' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' : 'bg-[#090d16] border-slate-800 text-slate-400'}">
                            2. Por Escore Padronizado Direto (Pc, Z, T, EP, QI)
                        </button>
                    </div>

                    ${u.entryMode === 'RAW_NORM' ? `
                        <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3.5 space-y-3 text-xs">
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                <div>
                                    <label class="block text-[10px] font-mono text-cyan-300 mb-1">Pontuação Bruta (X)</label>
                                    <input type="text" inputmode="decimal" id="univ-raw" value="${C.esc(u.raw)}"
                                        class="w-full min-h-[36px] px-2.5 py-1 rounded-lg bg-[#0f172a] border border-cyan-500/40 font-mono font-bold text-cyan-200">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-mono text-slate-400 mb-1">Média Normativa (M)</label>
                                    <input type="text" inputmode="decimal" id="univ-mean" value="${C.esc(u.mean)}"
                                        class="w-full min-h-[36px] px-2.5 py-1 rounded-lg bg-[#0f172a] border border-slate-700 font-mono text-slate-100">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-mono text-slate-400 mb-1">Desvio-Padrão (DP)</label>
                                    <input type="text" inputmode="decimal" id="univ-sd" value="${C.esc(u.sd)}"
                                        class="w-full min-h-[36px] px-2.5 py-1 rounded-lg bg-[#0f172a] border border-slate-700 font-mono text-slate-100">
                                </div>
                                <div>
                                    <label class="block text-[10px] font-mono text-slate-400 mb-1">Fidedignidade (<em>r<sub>xx</sub></em>)</label>
                                    <input type="text" inputmode="decimal" id="univ-rxx" value="${C.esc(u.rxx)}"
                                        class="w-full min-h-[36px] px-2.5 py-1 rounded-lg bg-[#0f172a] border border-slate-700 font-mono text-slate-200">
                                </div>
                            </div>
                            <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
                                <label class="inline-flex items-center gap-2 cursor-pointer text-slate-200">
                                    <input type="checkbox" id="univ-inverted" class="rounded border-slate-600" ${u.inverted ? 'checked' : ''}>
                                    <span>Escala Invertida de Tempo / Erros (<code class="font-mono text-amber-300">Z = (M − X) ÷ DP</code>: menor valor = melhor desempenho)</span>
                                </label>
                            </div>
                        </div>
                    ` : `
                        <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                                <label class="block text-[10px] font-mono text-slate-400 mb-1">Tipo de Escore de Entrada</label>
                                <select id="univ-direct-type" class="w-full min-h-[36px] px-2.5 py-1 rounded-lg bg-[#0f172a] border border-slate-700 font-mono text-cyan-200">
                                    <option value="PCT" ${u.directType === 'PCT' ? 'selected' : ''}>Percentil (0,01 a 99,99)</option>
                                    <option value="Z" ${u.directType === 'Z' ? 'selected' : ''}>Escore Z (M=0, DP=1)</option>
                                    <option value="T" ${u.directType === 'T' ? 'selected' : ''}>Escore T (M=50, DP=10)</option>
                                    <option value="EP" ${u.directType === 'EP' ? 'selected' : ''}>Ponderado Wechsler (M=10, DP=3)</option>
                                    <option value="QI" ${u.directType === 'QI' ? 'selected' : ''}>QI / Padrão (M=100, DP=15)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-mono text-cyan-300 mb-1">Valor Consultado</label>
                                <input type="text" inputmode="decimal" id="univ-direct-val" value="${C.esc(u.directVal)}"
                                    class="w-full min-h-[36px] px-2.5 py-1 rounded-lg bg-[#0f172a] border border-cyan-500/40 font-mono font-bold text-cyan-200">
                            </div>
                            <div>
                                <label class="block text-[10px] font-mono text-slate-400 mb-1">Fidedignidade (<em>r<sub>xx</sub></em>)</label>
                                <input type="text" inputmode="decimal" id="univ-rxx" value="${C.esc(u.rxx)}"
                                    class="w-full min-h-[36px] px-2.5 py-1 rounded-lg bg-[#0f172a] border border-slate-700 font-mono text-slate-200">
                            </div>
                        </div>
                    `}

                    <!-- Matriz Simultânea de Resultados -->
                    <div id="univ-results-card" class="bg-[#090d16] border border-cyan-500/30 rounded-xl p-4 space-y-3"></div>

                    <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div class="flex items-center gap-2">
                            <input type="text" id="univ-age-group" value="${C.esc(u.ageGroup)}" placeholder="Faixa Etária/Escolaridade p/ salvar norma"
                                class="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-slate-200 w-56">
                            <button type="button" id="btn-univ-save-norm"
                                class="min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-semibold text-xs flex items-center gap-1.5">
                                <i data-lucide="bookmark-plus" class="w-3.5 h-3.5"></i>
                                <span>Salvar Norma na Biblioteca</span>
                            </button>
                        </div>

                        <button type="button" id="btn-univ-push-abnt"
                            class="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5">
                            <i data-lucide="plus-square" class="w-4 h-4"></i>
                            <span>Inserir na Tabela do Laudo (ABNT)</span>
                        </button>
                    </div>
                </div>

                <!-- Coluna Direita: Biblioteca Local de Normas Reutilizáveis -->
                <div class="lg:col-span-5 bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-6 space-y-4">
                    <div class="border-b border-slate-800 pb-3">
                        <h3 class="text-sm sm:text-base font-bold text-slate-100">Minha Biblioteca Local de Normas</h3>
                        <p class="text-xs text-slate-400">Clique em <strong>Carregar</strong> para aplicar instantaneamente Média, DP, Polaridade e Fidedignidade no conversor.</p>
                    </div>
                    <div id="univ-norm-library-list" class="space-y-2.5 max-h-[520px] overflow-y-auto pr-1"></div>
                </div>
            </div>
        `;

        const bindVal = (id, key, isCheckbox = false) => {
            const el = document.getElementById(id);
            if (!el) return;
            const ev = (el.tagName === 'SELECT' || isCheckbox) ? 'change' : 'input';
            el.addEventListener(ev, () => {
                universalState[key] = isCheckbox ? el.checked : el.value;
                refreshUniversalOutputs();
            });
        };

        bindVal('univ-instrument', 'instrument');
        bindVal('univ-subtest', 'subtest');
        bindVal('univ-domain', 'domain');
        bindVal('univ-polarity', 'polarity');
        bindVal('univ-raw', 'raw');
        bindVal('univ-mean', 'mean');
        bindVal('univ-sd', 'sd');
        bindVal('univ-rxx', 'rxx');
        bindVal('univ-inverted', 'inverted', true);
        bindVal('univ-direct-type', 'directType');
        bindVal('univ-direct-val', 'directVal');
        bindVal('univ-age-group', 'ageGroup');

        const btnModeRaw = document.getElementById('btn-univ-mode-raw');
        const btnModeDir = document.getElementById('btn-univ-mode-direct');
        if (btnModeRaw) btnModeRaw.addEventListener('click', () => { universalState.entryMode = 'RAW_NORM'; renderSubTabUniversal(viewport); C.refreshIcons(viewport); });
        if (btnModeDir) btnModeDir.addEventListener('click', () => { universalState.entryMode = 'DIRECT_SCORE'; renderSubTabUniversal(viewport); C.refreshIcons(viewport); });

        const btnSaveNorm = document.getElementById('btn-univ-save-norm');
        if (btnSaveNorm) {
            btnSaveNorm.addEventListener('click', () => {
                const m = parseNumInput(universalState.mean);
                const sd = parseNumInput(universalState.sd);
                if (m === null || sd === null || sd <= 0) {
                    C.toast('Para salvar uma norma, preencha Média (M) e Desvio-Padrão (DP > 0) válidos.', 'warning');
                    return;
                }
                const item = {
                    id: 'norm_' + Date.now(),
                    instrument: (universalState.instrument || 'Instrumento').trim(),
                    subtest: (universalState.subtest || 'Subteste').trim(),
                    ageGroup: (universalState.ageGroup || 'Faixa Geral').trim(),
                    mean: m,
                    sd: sd,
                    inverted: Boolean(universalState.inverted),
                    polarity: universalState.polarity,
                    rxx: Number(parseNumInput(universalState.rxx)) || 0.88,
                    domain: universalState.domain
                };
                appState.normLibrary.unshift(item);
                saveState();
                renderNormLibraryList();
                C.toast(`Norma "${item.instrument} — ${item.subtest}" salva na biblioteca!`, 'success');
            });
        }

        const btnPush = document.getElementById('btn-univ-push-abnt');
        if (btnPush) {
            btnPush.addEventListener('click', () => {
                const res = computeUniversal();
                if (!res.metrics) {
                    C.toast('Insira parâmetros psicométricos válidos antes de enviar para o laudo.', 'warning');
                    return;
                }
                const isSymp = universalState.polarity !== 'SKILL';
                const rawDisplay = universalState.entryMode === 'RAW_NORM' ? universalState.raw : '—';
                upsertReportRow({
                    uid: 'univ_' + Date.now(),
                    domain: universalState.domain,
                    instrument: universalState.instrument || 'Instrumento Clínico',
                    measure: (universalState.subtest || 'Escore Principal') + (isSymp ? ' *' : ''),
                    raw: rawDisplay,
                    z: res.z,
                    ep: res.metrics.ep,
                    t: res.metrics.t,
                    qi: isSymp ? null : Math.round(res.metrics.qi),
                    ci95: isSymp ? `${res.metrics.ciT.label95} (T)` : `${res.metrics.ciQI.label95}`,
                    pct: res.metrics.pctFormatted,
                    classification: res.metrics.classification.label,
                    isSymptom: isSymp,
                    plotInCurve: !isSymp
                });
                saveState();
                renderHeaderAndSubtabs();
                C.toast('Medida adicionada à Tabela ABNT do Laudo!', 'success');
            });
        }

        refreshUniversalOutputs();
        renderNormLibraryList();
    }

    function refreshUniversalOutputs() {
        const C = global.VaultCore;
        const card = document.getElementById('univ-results-card');
        if (!card) return;
        const res = computeUniversal();
        if (!res.metrics) {
            card.innerHTML = `<div class="text-xs text-slate-500">Preencha os valores acima para visualizar todas as conversões psicométricas simultâneas.</div>`;
            return;
        }
        const m = res.metrics;
        card.innerHTML = `
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
                <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div class="text-[10px] font-mono text-slate-400">Escore Z</div>
                    <div class="font-mono font-bold text-sm text-cyan-300 mt-0.5">${fmtSigned(m.z, 2)}</div>
                </div>
                <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div class="text-[10px] font-mono text-slate-400">Percentil Exato</div>
                    <div class="font-mono font-bold text-sm text-emerald-300 mt-0.5">${m.pctFormatted}</div>
                </div>
                <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div class="text-[10px] font-mono text-slate-400">Ponderado (EP)</div>
                    <div class="font-mono font-bold text-sm text-slate-100 mt-0.5">${fmtPlain(m.ep, 1)}</div>
                </div>
                <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div class="text-[10px] font-mono text-slate-400">Escore T</div>
                    <div class="font-mono font-bold text-sm text-amber-200 mt-0.5">${fmtPlain(m.t, 1)}</div>
                </div>
                <div class="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div class="text-[10px] font-mono text-slate-400">QI / Padrão</div>
                    <div class="font-mono font-bold text-sm text-sky-300 mt-0.5">${Math.round(m.qi)}</div>
                </div>
            </div>
            <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
                <div class="font-mono text-slate-300">
                    IC 95% QI: <strong class="text-cyan-200">[${m.ciQI.label95}]</strong> •
                    IC 90% QI: <span class="text-slate-400">[${m.ciQI.label90}]</span> •
                    IC 95% T: <span class="text-amber-200">[${m.ciT.label95}]</span>
                </div>
                <span class="px-2.5 py-1 rounded border font-semibold ${m.classification.badge}">${C.esc(m.classification.label)}</span>
            </div>
        `;
    }

    function renderNormLibraryList() {
        const C = global.VaultCore;
        const box = document.getElementById('univ-norm-library-list');
        if (!box) return;
        if (appState.normLibrary.length === 0) {
            box.innerHTML = `<div class="text-xs text-slate-500">Nenhuma norma salva na biblioteca ainda.</div>`;
            return;
        }
        box.innerHTML = appState.normLibrary.map((n) => `
            <div class="p-3 rounded-xl bg-[#090d16] border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-2 text-xs">
                <div class="space-y-0.5 min-w-0">
                    <div class="font-bold text-slate-100 truncate">${C.esc(n.instrument)} — <span class="text-cyan-300">${C.esc(n.subtest)}</span></div>
                    <div class="text-[11px] font-mono text-slate-400">
                        ${C.esc(n.ageGroup)} • M = ${fmtPlain(n.mean, 2)} • DP = ${fmtPlain(n.sd, 2)} • ${n.inverted ? 'Tempo/Invertida' : 'Direta'}
                    </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                    <button type="button" data-load-norm="${C.esc(n.id)}"
                        class="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-cyan-200 font-semibold text-[11px]">
                        Carregar
                    </button>
                    <button type="button" data-del-norm="${C.esc(n.id)}" title="Remover da biblioteca"
                        class="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/50 border border-slate-800 text-slate-400 hover:text-rose-300">
                        <i data-lucide="x" class="w-3.5 h-3.5"></i>
                    </button>
                </div>
            </div>
        `).join('');

        box.querySelectorAll('[data-load-norm]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-load-norm');
                const found = appState.normLibrary.find((x) => x.id === id);
                if (!found) return;
                universalState.entryMode = 'RAW_NORM';
                universalState.instrument = found.instrument;
                universalState.subtest = found.subtest;
                universalState.ageGroup = found.ageGroup;
                universalState.mean = String(found.mean);
                universalState.sd = String(found.sd);
                universalState.inverted = Boolean(found.inverted);
                universalState.polarity = found.polarity || 'SKILL';
                universalState.rxx = String(found.rxx || 0.88);
                universalState.domain = found.domain || COGNITIVE_DOMAINS[0];
                const vp = document.getElementById('psy-subtab-viewport');
                renderSubTabUniversal(vp);
                C.refreshIcons(vp);
                C.toast(`Norma "${found.subtest}" carregada no conversor!`, 'info');
            });
        });

        box.querySelectorAll('[data-del-norm]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-del-norm');
                appState.normLibrary = appState.normLibrary.filter((x) => x.id !== id);
                saveState();
                renderNormLibraryList();
                C.refreshIcons(box);
            });
        });

        C.refreshIcons(box);
    }

    // =========================================================================
    // 10. SUB-ABA F: TABELA ABNT NBR 14724, CURVA HIGH-DPI & RASCUNHO DO LAUDO
    // =========================================================================

    function getActiveTableColumns(colsCfg) {
        const defs = [
            { key: 'raw', label: 'Bruto', align: 'center' },
            { key: 'z', label: 'Escore Z', align: 'center' },
            { key: 'ep', label: 'Ponderado', align: 'center' },
            { key: 't', label: 'Escore T', align: 'center' },
            { key: 'qi', label: 'QI / Padrão', align: 'center' },
            { key: 'ci95', label: 'IC 95%', align: 'center' },
            { key: 'pct', label: 'Percentil', align: 'center' },
            { key: 'classification', label: 'Classificação Clínica', align: 'left' }
        ];
        return defs.filter((d) => Boolean(colsCfg[d.key]));
    }

    function formatCellForAbnt(row, colKey) {
        if (colKey === 'raw') return row.raw || '—';
        if (colKey === 'z') return row.z !== null && row.z !== undefined ? fmtSigned(row.z, 2) : '—';
        if (colKey === 'ep') return row.ep !== null && row.ep !== undefined ? fmtPlain(row.ep, 1) : '—';
        if (colKey === 't') return row.t !== null && row.t !== undefined ? fmtPlain(row.t, 1) : '—';
        if (colKey === 'qi') return row.qi !== null && row.qi !== undefined ? String(Math.round(row.qi)) : '—';
        if (colKey === 'ci95') return row.ci95 || '—';
        if (colKey === 'pct') return row.pct || '—';
        if (colKey === 'classification') return row.classification || '—';
        return '—';
    }

    /**
     * Gera HTML inline-styled estrito ABNT NBR 14724 / IBGE (Zero bordas verticais; topo/base 1.5pt; cabeçalho 1pt)
     * Compatível com colagem limpa em Microsoft Word, Google Docs e LibreOffice Writer
     */
    function buildAbntInlineHtml(prot) {
        const C = global.VaultCore;
        const rep = prot.report;
        const font = rep.fontFamily === 'Arial' ? 'Arial, Helvetica, sans-serif' : '"Times New Roman", Times, serif';
        const cols = getActiveTableColumns(rep.columns);
        const rows = rep.rows || [];
        const totalColSpan = cols.length + 2; // Instrumento + Medida + colunas selecionadas

        // Agrupamento opcional
        let grouped = [];
        if (rep.groupBy === 'DOMAIN') {
            const map = new Map();
            rows.forEach((r) => {
                const g = r.domain || 'Outras Medidas';
                if (!map.has(g)) map.set(g, []);
                map.get(g).push(r);
            });
            map.forEach((list, grp) => grouped.push({ groupTitle: grp, items: list }));
        } else if (rep.groupBy === 'INSTRUMENT') {
            const map = new Map();
            rows.forEach((r) => {
                const g = r.instrument || 'Instrumento';
                if (!map.has(g)) map.set(g, []);
                map.get(g).push(r);
            });
            map.forEach((list, grp) => grouped.push({ groupTitle: grp, items: list }));
        } else {
            grouped = [{ groupTitle: null, items: rows }];
        }

        const thBase = `padding:6px 8px;border-top:1.5pt solid #000000;border-bottom:1pt solid #000000;border-left:none;border-right:none;font-weight:bold;font-size:10.5pt;color:#000000;background:#ffffff;`;
        const tdBase = `padding:5px 8px;border:none;font-size:10pt;color:#000000;background:#ffffff;vertical-align:middle;`;

        let bodyRowsHtml = '';
        if (rows.length === 0) {
            bodyRowsHtml = `<tr><td colspan="${totalColSpan}" style="${tdBase}text-align:center;padding:14px;border-bottom:1.5pt solid #000000;font-style:italic;">Nenhuma medida inserida na tabela ainda. Envie resultados a partir das sub-abas A–E.</td></tr>`;
        } else {
            let flatCounter = 0;
            const totalRows = rows.length;
            grouped.forEach((grp) => {
                if (grp.groupTitle) {
                    bodyRowsHtml += `
                        <tr>
                            <td colspan="${totalColSpan}" style="padding:6px 8px 3px 8px;border:none;border-top:0.5pt solid #cbd5e1;font-weight:bold;font-style:italic;font-size:10pt;color:#111827;background:#f8fafc;">
                                ${C.esc(grp.groupTitle)}
                            </td>
                        </tr>
                    `;
                }
                grp.items.forEach((r) => {
                    flatCounter++;
                    const isLast = flatCounter === totalRows;
                    const bottomRule = isLast ? 'border-bottom:1.5pt solid #000000;' : 'border-bottom:none;';
                    bodyRowsHtml += `
                        <tr>
                            <td style="${tdBase}${bottomRule}text-align:left;">${C.esc(r.instrument)}</td>
                            <td style="${tdBase}${bottomRule}text-align:left;">${C.esc(r.measure)}</td>
                            ${cols.map((c) => {
                                const val = formatCellForAbnt(r, c.key);
                                const fw = (c.key === 'classification' || c.key === 'pct') ? 'font-weight:600;' : '';
                                return `<td style="${tdBase}${bottomRule}text-align:${c.align};${fw}">${C.esc(val)}</td>`;
                            }).join('')}
                        </tr>
                    `;
                });
            });
        }

        return `<div style="font-family:${font};color:#000000;background:#ffffff;max-width:100%;">
<p style="margin:0 0 6px 0;font-family:${font};font-size:11pt;font-weight:bold;color:#000000;text-align:left;line-height:1.35;">${C.esc(rep.tableTitle)}</p>
<table cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;border-left:none;border-right:none;font-family:${font};color:#000000;background:#ffffff;">
<thead>
<tr>
<th style="${thBase}text-align:left;">Instrumento</th>
<th style="${thBase}text-align:left;">Subteste / Índice Avaliado</th>
${cols.map((c) => `<th style="${thBase}text-align:${c.align};">${C.esc(c.label)}</th>`).join('')}
</tr>
</thead>
<tbody>
${bodyRowsHtml}
</tbody>
</table>
<p style="margin:6px 0 0 0;font-family:${font};font-size:9pt;color:#1f2937;text-align:justify;line-height:1.35;">${C.esc(rep.tableFootnote)}</p>
</div>`;
    }

    function buildAbntPlainTextTSV(prot) {
        const rep = prot.report;
        const cols = getActiveTableColumns(rep.columns);
        const headers = ['Domínio', 'Instrumento', 'Subteste / Índice', ...cols.map((c) => c.label)];
        const lines = [rep.tableTitle, headers.join('\t')];
        (rep.rows || []).forEach((r) => {
            const cells = [r.domain, r.instrument, r.measure, ...cols.map((c) => formatCellForAbnt(r, c.key))];
            lines.push(cells.join('\t'));
        });
        lines.push(rep.tableFootnote);
        return lines.join('\n');
    }

    async function copyAbntTableToClipboard(prot) {
        const C = global.VaultCore;
        const html = buildAbntInlineHtml(prot);
        const plain = buildAbntPlainTextTSV(prot);

        try {
            if (navigator.clipboard && typeof window.ClipboardItem !== 'undefined') {
                const item = new window.ClipboardItem({
                    'text/html': new Blob([html], { type: 'text/html' }),
                    'text/plain': new Blob([plain], { type: 'text/plain' })
                });
                await navigator.clipboard.write([item]);
                C.toast('Tabela ABNT copiada com formatação rica! Cole direto no Word ou Google Docs.', 'success');
                return;
            }
        } catch (_) {
            // Fallback DOM selection abaixo
        }

        const temp = document.createElement('div');
        temp.setAttribute('contenteditable', 'true');
        temp.style.position = 'fixed';
        temp.style.left = '-9999px';
        temp.style.top = '0';
        temp.style.background = '#ffffff';
        temp.innerHTML = html;
        document.body.appendChild(temp);

        const range = document.createRange();
        range.selectNodeContents(temp);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        let ok = false;
        try {
            ok = document.execCommand('copy');
        } catch (_) { ok = false; }
        sel.removeAllRanges();
        document.body.removeChild(temp);

        if (ok) {
            C.toast('Tabela ABNT copiada para a área de transferência!', 'success');
        } else {
            C.toast('Não foi possível copiar automaticamente neste navegador.', 'error');
        }
    }

    /**
     * Síntese Diagnóstica Assistida Integrativa baseada nos Instrumentos Preenchidos
     */
    function composeAssistedDiagnosticSynthesis(prot) {
        const bits = [];

        // Inteligência
        const wasi = computeWasiAll(prot);
        if (wasi.qit4.metrics) {
            bits.push(`potencial intelectual global na faixa ${wasi.qit4.metrics.classification.label} (QIT-4 = ${Math.round(wasi.qit4.finalQI)}, Percentil ${wasi.qit4.metrics.pctFormatted})`);
        } else if (wasi.qit2.metrics) {
            bits.push(`potencial intelectual estimado na faixa ${wasi.qit2.metrics.classification.label} (QIT-2 = ${Math.round(wasi.qit2.finalQI)})`);
        }

        // Funções Executivas e Atenção
        const fdt = computeFdtAll(prot);
        const bpa = computeBpa2All(prot);
        const execFragile = (fdt.inibicao.metrics && fdt.inibicao.metrics.classification.isImpaired) ||
                            (fdt.flexibilidade.metrics && fdt.flexibilidade.metrics.classification.isImpaired) ||
                            (bpa.ag.metrics && bpa.ag.metrics.classification.isImpaired);
        if (execFragile) {
            bits.push('evidências psicométricas convergentes de fragilidade nas funções executivas (controle inibitório, flexibilidade mental e/ou sustentação atencional)');
        } else if (fdt.leitura.time !== null) {
            bits.push('controle inibitório, flexibilidade cognitiva e velocidade operacional dentro dos limites esperados para a faixa etária');
        }

        // Memória Auditivo-Verbal
        const rav = computeRavltAll(prot);
        if (rav.total !== null) {
            if (rav.norms.total && rav.norms.total.classification.isImpaired) {
                bits.push('rebaixamento na eficiência de aprendizagem imediata de novos conteúdos auditivo-verbais');
            } else {
                bits.push('capacidade de retenção, armazenamento e evocação tardia de material verbal estruturado preservada');
            }
        }

        // Cognição Social e Reciprocidade
        const srs = computeSrs2All(prot);
        if (srs.totalObj.t !== null) {
            if (srs.totalObj.t >= 60) {
                bits.push(`elevação dimensional na responsividade socioemocional em grau ${srs.totalObj.sev.label} (T = ${fmtPlain(srs.totalObj.t, 0)})`);
            } else {
                bits.push('reciprocidade socioemocional, comunicação interpessoal e padrões comportamentais dentro dos limites normais');
            }
        }

        if (bits.length > 0) {
            return `A análise integrativa dos achados neuropsicológicos evidencia ${bits.join('; ')}. A correlação entre os relatos de anamnese, as observações comportamentais durante as sessões e o perfil quantitativo obtido nos instrumentos fundamenta as hipóteses diagnósticas e orienta as diretrizes terapêuticas apresentadas neste documento.`;
        }

        return 'Os dados clínicos qualitativos e os resultados psicométricos quantitativos devem ser interpretados conjuntamente em perspectiva biopsicossocial, considerando o impacto funcional das demandas ambientais sobre o funcionamento neurocognitivo do examinando.';
    }

    /**
     * Gerador Automático de Rascunho Técnico-Clínico em Português Acadêmico
     */
    function generateTechnicalNarrativeDraft(prot) {
        const C = global.VaultCore;
        const age = calcChronologicalAge(prot.birthDate, prot.evalDate);
        const cd = prot.clinicalData || {};
        const sections = [];

        // I. IDENTIFICAÇÃO E ENQUADRE METODOLÓGICO
        const evalBR = C.formatDateBR(prot.evalDate);
        const agePhrase = age ? `com idade cronológica exata de ${age.formatted} na data do exame (${evalBR})` : `avaliado(a) em ${evalBR}`;
        sections.push(
            `LAUDO / SÍNTESE DE AVALIAÇÃO NEUROPSICOLÓGICA (Protocolo ${prot.code})\n\n` +
            `I. IDENTIFICAÇÃO E ENQUADRE METODOLÓGICO\n` +
            `Examinando(a) ${agePhrase}, escolaridade informada "${prot.schooling || 'não informada'}", lateralidade ${prot.handedness || 'destra'}, tendo como fonte de informação complementar ${prot.informant || 'os responsáveis'}. Os testes administrados foram aferidos segundo tabelas normativas brasileiras vigentes, ajustadas para idade cronológica e/ou escolaridade, em consonância com a Resolução CFP nº 06/2019 e critérios diagnósticos do DSM-5-TR e CID-11.`
        );

        // II. QUEIXA PRINCIPAL E MOTIVO DO ENCAMINHAMENTO
        const refReason = (cd.referralReason && cd.referralReason.trim()) || (prot.referralReason && prot.referralReason.trim());
        if (refReason) {
            sections.push(`II. MOTIVO DO ENCAMINHAMENTO E QUEIXA PRINCIPAL\n${refReason}`);
        }

        // III. ANAMNESE E HISTÓRICO DE DESENVOLVIMENTO
        const anamBits = [];
        if (cd.anamneseHistory && cd.anamneseHistory.trim()) {
            anamBits.push(cd.anamneseHistory.trim());
        }
        if (cd.familyHistory && cd.familyHistory.trim()) {
            anamBits.push(`Antecedentes familiares e histórico de saúde: ${cd.familyHistory.trim()}`);
        }
        if (anamBits.length > 0) {
            sections.push(`III. HISTÓRICO CLÍNICO, DESENVOLVIMENTO E ANTECEDENTES\n${anamBits.join('\n\n')}`);
        }

        // IV. OBSERVAÇÃO COMPORTAMENTAL
        if (cd.behaviorObservation && cd.behaviorObservation.trim()) {
            sections.push(`IV. OBSERVAÇÃO COMPORTAMENTAL DURANTE O PROCESSO AVALIATIVO\n${cd.behaviorObservation.trim()}`);
        }

        // V. RESULTADOS DOS INSTRUMENTOS NEUROPSICOLÓGICOS PADRONIZADOS
        const psychParagraphs = [];

        // 1. WASI
        const wasi = computeWasiAll(prot);
        if (wasi.qit4.metrics || wasi.qit2.metrics || wasi.qiv.metrics || wasi.qie.metrics) {
            const bits = [];
            if (wasi.qit4.metrics) {
                bits.push(`QI Total de 4 Subtestes na faixa ${wasi.qit4.metrics.classification.label} (QIT-4 = ${Math.round(wasi.qit4.finalQI)}; Percentil ${wasi.qit4.metrics.pctFormatted}; IC 95% [${wasi.qit4.ci.label95}])`);
            } else if (wasi.qit2.metrics) {
                bits.push(`QI Estimado de 2 Subtestes na faixa ${wasi.qit2.metrics.classification.label} (QIT-2 = ${Math.round(wasi.qit2.finalQI)}; Percentil ${wasi.qit2.metrics.pctFormatted}; IC 95% [${wasi.qit2.ci.label95}])`);
            }
            if (wasi.qiv.metrics) {
                bits.push(`QI Verbal = ${Math.round(wasi.qiv.finalQI)} (Percentil ${wasi.qiv.metrics.pctFormatted}; IC 95% [${wasi.qiv.ci.label95}], faixa ${wasi.qiv.metrics.classification.label})`);
            }
            if (wasi.qie.metrics) {
                bits.push(`QI de Execução = ${Math.round(wasi.qie.finalQI)} (Percentil ${wasi.qie.metrics.pctFormatted}; IC 95% [${wasi.qie.ci.label95}], faixa ${wasi.qie.metrics.classification.label})`);
            }
            const subDetails = [
                { n: 'Vocabulário', o: wasi.voc },
                { n: 'Semelhanças', o: wasi.sem },
                { n: 'Cubos', o: wasi.cub },
                { n: 'Raciocínio Matricial', o: wasi.rm }
            ].filter((x) => x.o && x.o.metrics).map((x) => `${x.n} (T = ${fmtPlain(x.o.t, 0)}; Percentil ${x.o.metrics.pctFormatted}; ${x.o.metrics.classification.label})`);

            let pWasi = `No funcionamento intelectual avaliado pela Escala Wechsler Abreviada de Inteligência (WASI), observou-se ${bits.join(', ')}.`;
            if (subDetails.length > 0) {
                pWasi += ` Na análise específica dos subtestes, registraram-se os seguintes desempenhos: ${subDetails.join('; ')}.`;
            }
            if (wasi.deltaAlert) {
                pWasi += ` ${wasi.deltaAlert.text}`;
            }
            psychParagraphs.push(pWasi);
        }

        // 2. Wechsler (WISC-IV / WAIS-III)
        const wech = computeWechslerIndices(prot);
        if (wech.qit || wech.icv || wech.iop || wech.imo || wech.ivp) {
            const wParts = [];
            const pushIdx = (lbl, obj) => {
                if (obj && obj.metrics) {
                    wParts.push(`${lbl} = ${obj.score} (Percentil ${obj.metrics.pctFormatted}; IC 95% [${obj.ci.label95}], faixa ${obj.metrics.classification.label})`);
                }
            };
            pushIdx('QIT', wech.qit);
            pushIdx('ICV', wech.icv);
            pushIdx('IOP', wech.iop);
            pushIdx('IMO', wech.imo);
            pushIdx('IVP', wech.ivp);
            pushIdx('IAG', wech.iag);
            pushIdx('ICC', wech.icc);
            let pWech = `Na bateria ${prot.wechsler.scaleName}, obtiveram-se os seguintes índices compostos: ${wParts.join('; ')}.`;
            if (wech.iagIccNote) pWech += ` ${wech.iagIccNote}`;
            psychParagraphs.push(pWech);
        }

        // 3. Atenção (BPA-2) e Velocidade / Funções Executivas (FDT)
        const bpa = computeBpa2All(prot);
        if (bpa.ac.pts !== null || bpa.ad.pts !== null || bpa.aa.pts !== null) {
            const bBits = [
                { n: 'Atenção Concentrada (AC)', o: bpa.ac },
                { n: 'Atenção Dividida (AD)', o: bpa.ad },
                { n: 'Atenção Alternada (AA)', o: bpa.aa },
                { n: 'Atenção Geral (AG)', o: bpa.ag }
            ].filter((x) => x.o && x.o.pts !== null).map((x) =>
                x.o.metrics
                    ? `${x.n}: ${x.o.pts} pontos (Percentil ${x.o.metrics.pctFormatted}; Z = ${fmtSigned(x.o.z, 2)}, faixa ${x.o.metrics.classification.label})`
                    : `${x.n}: ${x.o.pts} pontos`
            );
            psychParagraphs.push(`Na Bateria Psicológica para Avaliação da Atenção (BPA-2), verificaram-se os seguintes resultados: ${bBits.join('; ')}. ${bpa.qualProfile}`);
        }

        const fdt = computeFdtAll(prot);
        if (fdt.leitura.time !== null || fdt.escolha.time !== null) {
            const fBits = [
                { n: 'Leitura', o: fdt.leitura },
                { n: 'Contagem', o: fdt.contagem },
                { n: 'Escolha', o: fdt.escolha },
                { n: 'Alternância', o: fdt.alternancia },
                { n: 'Inibição', o: fdt.inibicao },
                { n: 'Flexibilidade', o: fdt.flexibilidade }
            ].filter((x) => x.o && x.o.time !== null).map((x) =>
                x.o.metrics
                    ? `${x.n} (${fmtPlain(x.o.time, 1)}s; Percentil de eficiência ${x.o.metrics.pctFormatted}; Z = ${fmtSigned(x.o.z, 2)}, ${x.o.metrics.classification.label})`
                    : `${x.n} (${fmtPlain(x.o.time, 1)}s)`
            );
            psychParagraphs.push(`Na avaliação cronometrada de controle inibitório e flexibilidade cognitiva pelo Teste dos Cinco Dígitos (FDT), obtiveram-se: ${fBits.join('; ')}. ${fdt.profileSummary}`);
        }

        // 4. Memória Episódica (RAVLT)
        const rav = computeRavltAll(prot);
        if (rav.total !== null || rav.a6 !== null || rav.a7 !== null) {
            const rBits = [];
            if (rav.total !== null) {
                const m = rav.norms.total;
                rBits.push(`Escore Total Σ(A1–A5) = ${rav.total} pontos${m ? ` (Percentil ${m.pctFormatted}; ${m.classification.label})` : ''}`);
            }
            if (rav.alt !== null) rBits.push(`Índice ALT = ${rav.alt}`);
            if (rav.a6 !== null) {
                const m = rav.norms.a6;
                rBits.push(`Evocação Pós-Interferência A6 = ${rav.a6}${m ? ` (Percentil ${m.pctFormatted}; ${m.classification.label})` : ''}`);
            }
            if (rav.a7 !== null) {
                const m = rav.norms.a7;
                rBits.push(`Evocação Tardia A7 = ${rav.a7}${m ? ` (Percentil ${m.pctFormatted}; ${m.classification.label})` : ''}`);
            }
            if (rav.velEsq !== null) rBits.push(`Velocidade de Esquecimento (A7/A6) = ${fmtPlain(rav.velEsq, 2)}`);
            if (rav.recNet !== null) rBits.push(`Reconhecimento Líquido = ${rav.recNet}/15`);
            psychParagraphs.push(`Quanto à memória episódica auditivo-verbal (RAVLT), observaram-se: ${rBits.join('; ')}. ${rav.clinicalNote}`);
        }

        // 5. Cognição Social (SRS-2) e Escalas Executivas
        const srs = computeSrs2All(prot);
        if (srs.totalObj.t !== null || srs.cisObj.t !== null) {
            const sBits = [];
            if (srs.totalObj.t !== null) {
                sBits.push(`Escore Total SRS-2 com T = ${fmtPlain(srs.totalObj.t, 0)} (Percentil ${srs.totalObj.pctFormatted}; ${srs.totalObj.sev.label})`);
            }
            if (srs.cisObj.t !== null) {
                sBits.push(`Comunicação e Interação Social [DSM-5-TR] com T = ${fmtPlain(srs.cisObj.t, 0)} (${srs.cisObj.sev.label})`);
            }
            if (srs.prr.t !== null) {
                sBits.push(`Padrões Restritos e Repetitivos [DSM-5-TR] com T = ${fmtPlain(srs.prr.t, 0)} (${srs.prr.sev.label})`);
            }
            psychParagraphs.push(`Na investigação dimensional da reciprocidade socioemocional pela SRS-2 (${prot.srs2.form}), evidenciou-se ${sBits.join('; ')}.`);
        }

        // 6. Instrumentos Adicionais da Calculadora Universal presentes na Tabela ABNT
        const extraRows = (prot.report.rows || []).filter((r) => String(r.uid).startsWith('univ_'));
        if (extraRows.length > 0) {
            const exStr = extraRows.map((r) =>
                `${r.instrument} — ${r.measure.replace(' *', '')} (Bruto = ${r.raw}; Z = ${r.z !== null ? fmtSigned(r.z, 2) : '—'}; Percentil ${r.pct}; ${r.classification})`
            ).join('; ');
            psychParagraphs.push(`Nos instrumentos complementares administrados, registraram-se: ${exStr}.`);
        }

        if (psychParagraphs.length > 0) {
            sections.push(`V. ANÁLISE DOS INSTRUMENTOS NEUROPSICOLÓGICOS PADRONIZADOS\n\n` + psychParagraphs.join('\n\n'));
        }

        // VI. SÍNTESE INTEGRATIVA E HIPÓTESES DIAGNÓSTICAS (DSM-5-TR / CID-11)
        let diagText = '';
        if (cd.diagnosticHypotheses && cd.diagnosticHypotheses.trim()) {
            diagText = cd.diagnosticHypotheses.trim();
        } else {
            diagText = composeAssistedDiagnosticSynthesis(prot);
        }
        sections.push(`VI. SÍNTESE INTEGRATIVA E HIPÓTESES DIAGNÓSTICAS (DSM-5-TR / CID-11)\n${diagText}`);

        // VII. DIRETRIZES TERAPÊUTICAS E ENCAMINHAMENTOS
        if (cd.recommendations && cd.recommendations.trim()) {
            sections.push(`VII. DIRETRIZES TERAPÊUTICAS E ENCAMINHAMENTOS\n${cd.recommendations.trim()}`);
        }

        return sections.join('\n\n');
    }

    /**
     * Renderiza Curva Científica High-DPI (<canvas>) pronta para anexar ao Laudo (.PNG)
     */
    function drawHighDpiProfileCanvas() {
        const canvas = document.getElementById('psy-profile-canvas');
        if (!canvas) return;
        const prot = getActiveProtocol();
        const plotRows = (prot.report.rows || []).filter((r) => r.plotInCurve && r.z !== null && Number.isFinite(Number(r.z)));

        const dpr = Math.max(2, window.devicePixelRatio || 2);
        const cssW = 940;
        const cssH = Math.max(380, 150 + plotRows.length * 34);

        canvas.width = cssW * dpr;
        canvas.height = cssH * dpr;
        canvas.style.width = '100%';
        canvas.style.maxWidth = cssW + 'px';
        canvas.style.height = 'auto';

        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.scale(dpr, dpr);

        // Fundo Branco Científico Limpo p/ Impressão A4 e Word
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, cssW, cssH);

        const leftPad = 290;
        const rightPad = 76;
        const topPad = 72;
        const bottomPad = 48;
        const plotW = cssW - leftPad - rightPad;
        const plotH = cssH - topPad - bottomPad;

        const zMin = -3.0;
        const zMax = 3.0;
        const xOfZ = (zVal) => {
            const clamped = Math.min(zMax, Math.max(zMin, Number(zVal)));
            return leftPad + ((clamped - zMin) / (zMax - zMin)) * plotW;
        };

        // Cabeçalho do Gráfico
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 14px "Inter", Arial, sans-serif';
        ctx.fillText(`Perfil Neuropsicológico Padronizado (Escore Z) — Protocolo ${prot.code}`, 24, 28);

        const age = calcChronologicalAge(prot.birthDate, prot.evalDate);
        ctx.fillStyle = '#475569';
        ctx.font = '11px "Inter", Arial, sans-serif';
        ctx.fillText(
            `Faixa Média Normativa sombreada (Z entre −0,67 e +0,67 • Pc 25–74) | Cortes Clínicos: Z = −1,50 (Limítrofe) e Z = −2,00 (Deficitário)${age ? ' | Idade: ' + age.shortCode : ''}`,
            24,
            46
        );

        // Zona Normativa Média Sombreada (Z -0.67 a +0.67)
        const xAvgStart = xOfZ(-0.67);
        const xAvgEnd = xOfZ(0.67);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.11)';
        ctx.fillRect(xAvgStart, topPad, xAvgEnd - xAvgStart, plotH);

        // Zona Deficitária Sutil (Z <= -2.0)
        const xDefEnd = xOfZ(-2.0);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.07)';
        ctx.fillRect(leftPad, topPad, xDefEnd - leftPad, plotH);

        // Linhas Verticais de Grade e Cortes Clínicos
        const gridTicks = [
            { z: -3.0, label: '−3,0', sub: 'QI 55', dash: [2, 4], color: '#cbd5e1', width: 1 },
            { z: -2.0, label: '−2,0', sub: 'QI 70 (Pc 2)', dash: [6, 4], color: '#e11d48', width: 1.6 },
            { z: -1.5, label: '−1,5', sub: 'Limítrofe', dash: [4, 4], color: '#d97706', width: 1.3 },
            { z: -1.0, label: '−1,0', sub: 'QI 85', dash: [2, 4], color: '#cbd5e1', width: 1 },
            { z: 0.0,  label: '0,0',  sub: 'Média (Pc 50)', dash: [], color: '#0f172a', width: 1.4 },
            { z: 1.0,  label: '+1,0', sub: 'QI 115', dash: [2, 4], color: '#cbd5e1', width: 1 },
            { z: 2.0,  label: '+2,0', sub: 'QI 130 (Pc 98)', dash: [4, 4], color: '#0284c7', width: 1.2 },
            { z: 3.0,  label: '+3,0', sub: 'QI 145', dash: [2, 4], color: '#cbd5e1', width: 1 }
        ];

        gridTicks.forEach((tk) => {
            const x = xOfZ(tk.z);
            ctx.save();
            ctx.beginPath();
            ctx.setLineDash(tk.dash);
            ctx.strokeStyle = tk.color;
            ctx.lineWidth = tk.width;
            ctx.moveTo(x, topPad);
            ctx.lineTo(x, topPad + plotH);
            ctx.stroke();
            ctx.restore();

            ctx.fillStyle = tk.z === -2.0 ? '#be123c' : tk.z === -1.5 ? '#b45309' : '#334155';
            ctx.font = 'bold 10px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`Z ${tk.label}`, x, topPad - 8);

            ctx.fillStyle = '#64748b';
            ctx.font = '9.5px "Inter", Arial, sans-serif';
            ctx.fillText(tk.sub, x, topPad + plotH + 16);
        });

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.strokeRect(leftPad, topPad, plotW, plotH);

        if (plotRows.length === 0) {
            ctx.fillStyle = '#64748b';
            ctx.font = 'italic 13px "Inter", Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Envie subtestes cognitivos para a Tabela ABNT para gerar automaticamente a curva de perfil.', leftPad + plotW / 2, topPad + plotH / 2);
        } else {
            const rowStep = plotH / plotRows.length;
            const coords = plotRows.map((r, idx) => {
                const cy = topPad + rowStep * idx + rowStep / 2;
                const cx = xOfZ(r.z);
                return { r, cx, cy };
            });

            // Linhas horizontais guia suaves e rótulos à esquerda
            coords.forEach(({ r, cy }, idx) => {
                if (idx % 2 === 1) {
                    ctx.fillStyle = 'rgba(241, 245, 249, 0.55)';
                    ctx.fillRect(16, cy - rowStep / 2, leftPad - 18, rowStep);
                }
                ctx.beginPath();
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 0.8;
                ctx.moveTo(leftPad, cy);
                ctx.lineTo(leftPad + plotW, cy);
                ctx.stroke();

                const fullLabel = `${r.instrument ? r.instrument + ' • ' : ''}${r.measure}`;
                const trimmed = fullLabel.length > 42 ? fullLabel.slice(0, 40) + '…' : fullLabel;
                ctx.fillStyle = '#0f172a';
                ctx.font = '600 11px "Inter", Arial, sans-serif';
                ctx.textAlign = 'right';
                ctx.fillText(trimmed, leftPad - 10, cy + 4);

                // Valor Z + Pc à direita
                ctx.fillStyle = '#334155';
                ctx.font = '600 10px "JetBrains Mono", monospace';
                ctx.textAlign = 'left';
                ctx.fillText(`${fmtSigned(r.z, 2)} (Pc ${r.pct})`, leftPad + plotW + 8, cy + 3.5);
            });

            // Polilinha conectando o perfil neuropsicológico
            if (coords.length >= 2) {
                ctx.beginPath();
                ctx.strokeStyle = '#0f172a';
                ctx.lineWidth = 2.2;
                coords.forEach((pt, idx) => {
                    if (idx === 0) ctx.moveTo(pt.cx, pt.cy);
                    else ctx.lineTo(pt.cx, pt.cy);
                });
                ctx.stroke();
            }

            // Marcadores coloridos conforme zona clínica
            coords.forEach(({ r, cx, cy }) => {
                const z = Number(r.z);
                let fill = '#10b981'; // Médio
                if (z <= -2.0) fill = '#e11d48';
                else if (z <= -1.38) fill = '#f59e0b';
                else if (z < -0.67) fill = '#eab308';
                else if (z > 0.67) fill = '#0284c7';

                ctx.beginPath();
                ctx.arc(cx, cy, 5.2, 0, Math.PI * 2);
                ctx.fillStyle = fill;
                ctx.fill();
                ctx.lineWidth = 1.8;
                ctx.strokeStyle = '#ffffff';
                ctx.stroke();
            });
        }

        // Rodapé institucional discreto no gráfico exportado
        ctx.fillStyle = '#64748b';
        ctx.font = '10px "Inter", Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Deo Magalhães - Neuropsicólogo e Neurocientista (CRP 04/42784) • Síntese Gráfica Padronizada', 24, cssH - 12);

        ctx.restore();
    }

    function renderSubTabLaudo(viewport) {
        const C = global.VaultCore;
        const prot = getActiveProtocol();
        const rep = prot.report;
        const age = calcChronologicalAge(prot.birthDate, prot.evalDate);

        if (!rep.customDraftText) {
            rep.customDraftText = generateTechnicalNarrativeDraft(prot);
        }

        const colChecks = [
            { key: 'raw', label: 'Bruto' },
            { key: 'z', label: 'Escore Z' },
            { key: 'ep', label: 'Ponderado (EP)' },
            { key: 't', label: 'Escore T' },
            { key: 'qi', label: 'QI / Padrão' },
            { key: 'ci95', label: 'IC 95%' },
            { key: 'pct', label: 'Percentil' },
            { key: 'classification', label: 'Classificação' }
        ];

        viewport.innerHTML = `
            <div class="space-y-6">
                <!-- BARRA DE CONTROLE DO LAUDO (OCULTA NA IMPRESSÃO A4) -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-6 space-y-4 no-print">
                    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div>
                            <h3 class="text-sm sm:text-base font-bold text-slate-100">Painel Consolidado de Laudo: Tabela ABNT NBR 14724 • Curva High-DPI • Síntese Clínica</h3>
                            <p class="text-xs text-slate-400">Personalize colunas, reordene medidas, copie com estilo ABNT nativo para Word/Docs ou imprima em Folha A4.</p>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <button type="button" id="btn-copy-abnt-word"
                                class="min-h-[40px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition">
                                <i data-lucide="clipboard-check" class="w-4 h-4"></i>
                                <span>Copiar Tabela ABNT para Word / Google Docs</span>
                            </button>

                            <button type="button" id="btn-export-abnt-csv"
                                class="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 transition">
                                <i data-lucide="sheet" class="w-4 h-4"></i>
                                <span>Exportar CSV (Excel)</span>
                            </button>

                            <button type="button" id="btn-print-laudo-a4"
                                class="min-h-[40px] px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition">
                                <i data-lucide="printer" class="w-4 h-4"></i>
                                <span>Imprimir Laudo / PDF A4</span>
                            </button>
                        </div>
                    </div>

                    <!-- Configurações Tipográficas, Agrupamento e Colunas -->
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 text-xs">
                        <div class="lg:col-span-6">
                            <label class="block text-[11px] font-mono text-slate-400 mb-1">Título da Tabela ABNT</label>
                            <input type="text" id="abnt-title-input" value="${C.esc(rep.tableTitle)}"
                                class="w-full min-h-[36px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-slate-100">
                        </div>
                        <div class="lg:col-span-3">
                            <label class="block text-[11px] font-mono text-slate-400 mb-1">Tipografia da Folha A4</label>
                            <select id="abnt-font-select" class="w-full min-h-[36px] px-2.5 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-slate-200">
                                <option value="Times New Roman" ${rep.fontFamily !== 'Arial' ? 'selected' : ''}>Times New Roman (Clássico ABNT)</option>
                                <option value="Arial" ${rep.fontFamily === 'Arial' ? 'selected' : ''}>Arial (Moderno Limpo)</option>
                            </select>
                        </div>
                        <div class="lg:col-span-3">
                            <label class="block text-[11px] font-mono text-slate-400 mb-1">Agrupamento de Linhas</label>
                            <select id="abnt-group-select" class="w-full min-h-[36px] px-2.5 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-slate-200">
                                <option value="DOMAIN" ${rep.groupBy === 'DOMAIN' ? 'selected' : ''}>Por Domínio Cognitivo</option>
                                <option value="INSTRUMENT" ${rep.groupBy === 'INSTRUMENT' ? 'selected' : ''}>Por Instrumento</option>
                                <option value="NONE" ${rep.groupBy === 'NONE' ? 'selected' : ''}>Lista Contínua Sem Subtítulos</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[11px] font-mono text-slate-400 mb-1">Nota de Rodapé Normativa da Tabela</label>
                        <input type="text" id="abnt-footnote-input" value="${C.esc(rep.tableFootnote)}"
                            class="w-full min-h-[36px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-slate-300">
                    </div>

                    <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div class="flex flex-wrap items-center gap-3 text-xs">
                            <span class="font-mono text-[11px] text-cyan-300 uppercase">Colunas Visíveis:</span>
                            ${colChecks.map((cc) => `
                                <label class="inline-flex items-center gap-1.5 cursor-pointer text-slate-200">
                                    <input type="checkbox" data-abnt-col="${cc.key}" ${rep.columns[cc.key] ? 'checked' : ''} class="rounded border-slate-600">
                                    <span>${cc.label}</span>
                                </label>
                            `).join('')}
                        </div>

                        ${rep.rows.length > 0 ? `
                            <button type="button" id="btn-abnt-clear-rows"
                                class="px-3 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-300 text-xs">
                                Limpar Todas as Linhas (${rep.rows.length})
                            </button>
                        ` : ''}
                    </div>

                    <!-- Gerenciador Rápido de Ordem / Edição das Linhas -->
                    ${rep.rows.length > 0 ? `
                        <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3 space-y-1.5 max-h-60 overflow-y-auto">
                            <div class="text-[11px] font-mono uppercase text-slate-400 mb-1">Gerenciar Linhas da Tabela (Reordenar ↑/↓, Incluir na Curva Z, Editar ou Remover)</div>
                            ${rep.rows.map((r, idx) => `
                                <div class="flex flex-wrap items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
                                    <div class="flex items-center gap-2 min-w-0">
                                        <span class="font-mono text-[10px] text-slate-500">${idx + 1}.</span>
                                        <strong class="text-cyan-300">${C.esc(r.instrument)}</strong>
                                        <span class="text-slate-200 truncate">— ${C.esc(r.measure)}</span>
                                        <span class="font-mono text-[11px] text-emerald-300">(Pc ${C.esc(r.pct)} • ${C.esc(r.classification)})</span>
                                    </div>
                                    <div class="flex items-center gap-1 shrink-0">
                                        <label class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 cursor-pointer" title="Plotar na Curva de Perfil Z">
                                            <input type="checkbox" data-row-curve="${idx}" ${r.plotInCurve ? 'checked' : ''}>
                                            <span>Curva</span>
                                        </label>
                                        <button type="button" data-row-up="${idx}" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono" title="Subir">↑</button>
                                        <button type="button" data-row-down="${idx}" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono" title="Descer">↓</button>
                                        <button type="button" data-row-edit="${idx}" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px]">Editar</button>
                                        <button type="button" data-row-del="${idx}" class="px-2 py-0.5 rounded bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 font-mono" title="Remover">×</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>

                <!-- FOLHA A4 BRANCA CLÁSSICA DE PRÉ-VISUALIZAÇÃO E IMPRESSÃO ABNT -->
                <div id="psy-a4-sheet" class="bg-white text-black rounded-xl shadow-2xl p-6 sm:p-10 max-w-[1000px] mx-auto space-y-6 border border-slate-300">
                    <!-- Cabeçalho Técnico Visível na Folha A4 -->
                    <div style="border-bottom:1.5pt solid #000000;padding-bottom:10px;display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;font-family:${rep.fontFamily === 'Arial' ? 'Arial, sans-serif' : '"Times New Roman", serif'};">
                        <div>
                            <div style="font-size:13pt;font-weight:bold;color:#000000;">AVALIAÇÃO NEUROPSICOLÓGICA CLÍNICA — SÍNTESE PSICOMÉTRICA</div>
                            <div style="font-size:10pt;color:#1f2937;margin-top:2px;">
                                Protocolo: <strong>${C.esc(prot.code)}</strong> •
                                Data do Exame: <strong>${C.esc(C.formatDateBR(prot.evalDate))}</strong>
                                ${age ? ` • Idade Cronológica: <strong>${C.esc(age.formatted)}</strong>` : ''}
                            </div>
                            <div style="font-size:9.5pt;color:#374151;">
                                Escolaridade: ${C.esc(prot.schooling || '—')} • Lateralidade: ${C.esc(prot.handedness || '—')} • Informante: ${C.esc(prot.informant || '—')}
                            </div>
                        </div>
                        <div style="text-align:right;font-size:9.5pt;color:#111827;">
                            <strong>Deo Magalhães</strong><br>
                            Neuropsicólogo e Neurocientista • CRP 04/42784
                        </div>
                    </div>

                    <!-- Tabela Mestra Renderizada no Padrão Estrito ABNT NBR 14724 -->
                    <div id="abnt-white-paper-table-host">${buildAbntInlineHtml(prot)}</div>
                </div>

                <!-- CURVA DE PERFIL NEUROPSICOLÓGICO HIGH-DPI (<CANVAS>) -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-6 space-y-4">
                    <div class="flex flex-wrap items-center justify-between gap-3 no-print">
                        <div>
                            <h3 class="text-sm sm:text-base font-bold text-slate-100">Curva de Perfil Neuropsicológico High-DPI (Pronta para Anexar ao Laudo)</h3>
                            <p class="text-xs text-slate-400">Zona normativa média sombreada (<em>Z</em> −0,67 a +0,67 / Pc 25–74) e linhas tracejadas de alerta clínico em <em>Z</em> = −1,50 e <em>Z</em> = −2,00.</p>
                        </div>
                        <button type="button" id="btn-download-curve-png"
                            class="min-h-[38px] px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition">
                            <i data-lucide="image-down" class="w-4 h-4"></i>
                            <span>Baixar Gráfico p/ Laudo (.PNG)</span>
                        </button>
                    </div>
                    <div class="bg-white rounded-xl p-3 border border-slate-300 overflow-x-auto">
                        <canvas id="psy-profile-canvas"></canvas>
                    </div>
                </div>

                <!-- GERADOR AUTOMÁTICO DE RASCUNHO TÉCNICO PARA O LAUDO -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-4 sm:p-6 space-y-4 no-print">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 class="text-sm sm:text-base font-bold text-slate-100">Gerador Automático de Rascunho Técnico-Clínico para o Laudo</h3>
                            <p class="text-xs text-slate-400">Texto acadêmico-clínico em português com notação psicométrica completa entre parênteses, editável livremente.</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button type="button" id="btn-regen-draft"
                                class="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-semibold text-xs flex items-center gap-1.5">
                                <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
                                <span>Atualizar Rascunho com Dados Atuais</span>
                            </button>
                            <button type="button" id="btn-copy-draft"
                                class="min-h-[38px] px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5">
                                <i data-lucide="copy" class="w-3.5 h-3.5"></i>
                                <span>Copiar Texto Clínico</span>
                            </button>
                        </div>
                    </div>

                    <textarea id="psy-narrative-textarea" rows="11"
                        class="w-full p-4 rounded-xl bg-[#090d16] border border-slate-700 focus:border-cyan-400 focus:outline-none text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">${C.esc(rep.customDraftText)}</textarea>
                </div>
            </div>
        `;

        // Eventos do Painel de Laudo
        const titleInp = document.getElementById('abnt-title-input');
        if (titleInp) {
            titleInp.addEventListener('input', () => {
                rep.tableTitle = titleInp.value;
                saveState();
                const host = document.getElementById('abnt-white-paper-table-host');
                if (host) host.innerHTML = buildAbntInlineHtml(prot);
            });
        }

        const footInp = document.getElementById('abnt-footnote-input');
        if (footInp) {
            footInp.addEventListener('input', () => {
                rep.tableFootnote = footInp.value;
                saveState();
                const host = document.getElementById('abnt-white-paper-table-host');
                if (host) host.innerHTML = buildAbntInlineHtml(prot);
            });
        }

        const fontSel = document.getElementById('abnt-font-select');
        if (fontSel) {
            fontSel.addEventListener('change', () => {
                rep.fontFamily = fontSel.value;
                saveState();
                renderSubTabLaudo(viewport);
                C.refreshIcons(viewport);
            });
        }

        const grpSel = document.getElementById('abnt-group-select');
        if (grpSel) {
            grpSel.addEventListener('change', () => {
                rep.groupBy = grpSel.value;
                saveState();
                const host = document.getElementById('abnt-white-paper-table-host');
                if (host) host.innerHTML = buildAbntInlineHtml(prot);
            });
        }

        viewport.querySelectorAll('[data-abnt-col]').forEach((chk) => {
            chk.addEventListener('change', () => {
                const ck = chk.getAttribute('data-abnt-col');
                rep.columns[ck] = chk.checked;
                saveState();
                const host = document.getElementById('abnt-white-paper-table-host');
                if (host) host.innerHTML = buildAbntInlineHtml(prot);
            });
        });

        viewport.querySelectorAll('[data-row-curve]').forEach((chk) => {
            chk.addEventListener('change', () => {
                const idx = Number(chk.getAttribute('data-row-curve'));
                if (rep.rows[idx]) {
                    rep.rows[idx].plotInCurve = chk.checked;
                    saveState();
                    drawHighDpiProfileCanvas();
                }
            });
        });

        viewport.querySelectorAll('[data-row-up]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const idx = Number(btn.getAttribute('data-row-up'));
                if (idx > 0) {
                    const tmp = rep.rows[idx - 1];
                    rep.rows[idx - 1] = rep.rows[idx];
                    rep.rows[idx] = tmp;
                    saveState();
                    renderSubTabLaudo(viewport);
                    C.refreshIcons(viewport);
                }
            });
        });

        viewport.querySelectorAll('[data-row-down]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const idx = Number(btn.getAttribute('data-row-down'));
                if (idx < rep.rows.length - 1) {
                    const tmp = rep.rows[idx + 1];
                    rep.rows[idx + 1] = rep.rows[idx];
                    rep.rows[idx] = tmp;
                    saveState();
                    renderSubTabLaudo(viewport);
                    C.refreshIcons(viewport);
                }
            });
        });

        viewport.querySelectorAll('[data-row-edit]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const idx = Number(btn.getAttribute('data-row-edit'));
                const row = rep.rows[idx];
                if (!row) return;
                const newMeasure = window.prompt('Editar nome do Subteste / Índice:', row.measure);
                if (newMeasure === null) return;
                const newRaw = window.prompt('Editar Pontuação Bruta exibida:', row.raw);
                if (newRaw === null) return;
                const newPct = window.prompt('Editar Percentil exibido:', row.pct);
                if (newPct === null) return;
                const newCls = window.prompt('Editar Classificação Clínica:', row.classification);
                if (newCls === null) return;

                row.measure = newMeasure.trim() || row.measure;
                row.raw = newRaw.trim() || '—';
                row.pct = newPct.trim() || '—';
                row.classification = newCls.trim() || '—';
                saveState();
                renderSubTabLaudo(viewport);
                C.refreshIcons(viewport);
            });
        });

        viewport.querySelectorAll('[data-row-del]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const idx = Number(btn.getAttribute('data-row-del'));
                rep.rows.splice(idx, 1);
                saveState();
                renderHeaderAndSubtabs();
                renderSubTabLaudo(viewport);
                C.refreshIcons(viewport);
            });
        });

        const btnClear = document.getElementById('btn-abnt-clear-rows');
        if (btnClear) {
            btnClear.addEventListener('click', () => {
                if (!window.confirm('Remover todas as linhas atuais da Tabela ABNT deste protocolo?')) return;
                rep.rows = [];
                saveState();
                renderHeaderAndSubtabs();
                renderSubTabLaudo(viewport);
                C.refreshIcons(viewport);
            });
        }

        const btnCopyWord = document.getElementById('btn-copy-abnt-word');
        if (btnCopyWord) {
            btnCopyWord.addEventListener('click', () => copyAbntTableToClipboard(prot));
        }

        const btnCsv = document.getElementById('btn-export-abnt-csv');
        if (btnCsv) {
            btnCsv.addEventListener('click', () => {
                const cols = getActiveTableColumns(rep.columns);
                const headers = ['Domínio', 'Instrumento', 'Subteste / Índice', ...cols.map((c) => c.label)];
                const dataRows = (rep.rows || []).map((r) => [
                    r.domain,
                    r.instrument,
                    r.measure,
                    ...cols.map((c) => formatCellForAbnt(r, c.key))
                ]);
                const safeCode = prot.code.replace(/[^a-zA-Z0-9_-]/g, '_');
                C.exportCSV(`tabela-abnt-${safeCode}.csv`, headers, dataRows);
                C.toast('Planilha CSV exportada com codificação UTF-8 para Excel!', 'success');
            });
        }

        const btnPrint = document.getElementById('btn-print-laudo-a4');
        if (btnPrint) {
            btnPrint.addEventListener('click', () => window.print());
        }

        const btnPng = document.getElementById('btn-download-curve-png');
        if (btnPng) {
            btnPng.addEventListener('click', () => {
                const canvas = document.getElementById('psy-profile-canvas');
                if (!canvas) return;
                canvas.toBlob((blob) => {
                    if (!blob) return;
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    const safeCode = prot.code.replace(/[^a-zA-Z0-9_-]/g, '_');
                    a.href = url;
                    a.download = `curva-neuropsicologica-${safeCode}.png`;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }, 250);
                    C.toast('Gráfico High-DPI (.PNG) baixado e pronto para inserir no laudo!', 'success');
                }, 'image/png');
            });
        }

        const draftArea = document.getElementById('psy-narrative-textarea');
        if (draftArea) {
            draftArea.addEventListener('input', () => {
                rep.customDraftText = draftArea.value;
                saveState();
            });
        }

        const btnRegen = document.getElementById('btn-regen-draft');
        if (btnRegen && draftArea) {
            btnRegen.addEventListener('click', () => {
                const freshText = generateTechnicalNarrativeDraft(prot);
                rep.customDraftText = freshText;
                draftArea.value = freshText;
                saveState();
                C.toast('Rascunho técnico regenerado a partir de todos os instrumentos preenchidos!', 'success');
            });
        }

        const btnCopyDraft = document.getElementById('btn-copy-draft');
        if (btnCopyDraft && draftArea) {
            btnCopyDraft.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(draftArea.value);
                    C.toast('Síntese redacional copiada para a área de transferência!', 'success');
                } catch (_) {
                    draftArea.select();
                    document.execCommand('copy');
                    C.toast('Síntese redacional copiada!', 'success');
                }
            });
        }

        drawHighDpiProfileCanvas();
    }

    // =========================================================================
    // 11. ORQUESTRAÇÃO DE RENDERIZAÇÃO E CICLO DE VIDA DO MÓDULO
    // =========================================================================

    function renderActiveSubTab() {
        const vp = document.getElementById('psy-subtab-viewport');
        if (!vp) return;
        const tab = appState.activeSubTab || 'wasi';
        if (tab === 'wasi') renderSubTabWasi(vp);
        else if (tab === 'fdt') renderSubTabFdt(vp);
        else if (tab === 'srs2') renderSubTabSrs2(vp);
        else if (tab === 'bpa_ravlt') renderSubTabBpaRavlt(vp);
        else if (tab === 'universal') renderSubTabUniversal(vp);
        else if (tab === 'laudo') renderSubTabLaudo(vp);
    }

    function renderAll() {
        renderHeaderAndSubtabs();
        renderClinicalPanel();
        renderActiveSubTab();
        if (global.VaultCore && typeof global.VaultCore.refreshIcons === 'function') {
            global.VaultCore.refreshIcons();
        }
    }

    function init() {
        loadState();
        mountShell();
        renderAll();

        window.addEventListener('vault:restored', () => {
            loadState();
            renderAll();
        });

        window.addEventListener('vault:tab-changed', (ev) => {
            if (ev && ev.detail && ev.detail.tab === 'psicometria') {
                if (appState.activeSubTab === 'laudo') {
                    drawHighDpiProfileCanvas();
                }
            }
        });
    }

    global.VaultTabPsicometria = {
        init,
        renderAll,
        // Exposição da engine matemática para auditoria técnica se necessário
        math: {
            erf,
            normCDF,
            zToPercentile,
            percentileToZ,
            calcConfidenceInterval,
            classifyCognitiveZ,
            classifySymptomT,
            calcChronologicalAge
        }
    };
})(window);
