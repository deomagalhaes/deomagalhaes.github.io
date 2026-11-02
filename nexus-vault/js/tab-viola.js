/**
 * NEXUS VAULT — Aba 2: Estúdio de Viola Caipira (Cebolão em Mi) & Violão — Modo Canhoto Nativo
 * Braço SVG Espelhado p/ Canhoto, Síntese Acústica Web Audio (Pares Oitavados), Campo Harmônico,
 * Escalas Duadas (Terças e Sextas) e Metrônomo Lookahead de Alta Precisão.
 */
(function (global) {
    'use strict';

    const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const NOTE_NAMES_PT = ['Dó', 'Dó#', 'Ré', 'Ré#', 'Mi', 'Fá', 'Fá#', 'Sol', 'Sol#', 'Lá', 'Lá#', 'Si'];

    // Definição acústica exata dos instrumentos (índice 0 = 1º par/corda mais aguda)
    const INSTRUMENTS = {
        viola_cebolao_e: {
            id: 'viola_cebolao_e',
            name: 'Viola Caipira — Cebolão em Mi (E - B - G# - E - B)',
            shortName: 'Viola Cebolão em Mi',
            isPaired: true,
            courses: [
                { num: 1, label: '1º Par (Prima)', note: 'E4', midi: [64, 64], pitchClass: 4, octaved: false },
                { num: 2, label: '2º Par (Segundinha)', note: 'B3', midi: [59, 59], pitchClass: 11, octaved: false },
                { num: 3, label: '3º Par (Turina)', note: 'G#3/G#4', midi: [56, 68], pitchClass: 8, octaved: true },
                { num: 4, label: '4º Par (Toeira)', note: 'E3/E4', midi: [52, 64], pitchClass: 4, octaved: true },
                { num: 5, label: '5º Par (Canotilho)', note: 'B2/B3', midi: [47, 59], pitchClass: 11, octaved: true }
            ]
        },
        violao_padrao: {
            id: 'violao_padrao',
            name: 'Violão Padrão 6 Cordas (E - A - D - G - B - E)',
            shortName: 'Violão Padrão',
            isPaired: false,
            courses: [
                { num: 1, label: '1ª Corda (Mi)', note: 'E4', midi: [64], pitchClass: 4, octaved: false },
                { num: 2, label: '2ª Corda (Si)', note: 'B3', midi: [59], pitchClass: 11, octaved: false },
                { num: 3, label: '3ª Corda (Sol)', note: 'G3', midi: [55], pitchClass: 7, octaved: false },
                { num: 4, label: '4ª Corda (Ré)', note: 'D3', midi: [50], pitchClass: 2, octaved: false },
                { num: 5, label: '5ª Corda (Lá)', note: 'A2', midi: [45], pitchClass: 9, octaved: false },
                { num: 6, label: '6ª Corda (Bordão)', note: 'E2', midi: [40], pitchClass: 4, octaved: false }
            ]
        }
    };

    const HARMONIC_KEYS = [
        { id: 'E_maj', root: 4, mode: 'major', label: 'Mi Maior (E) — Nativa Cebolão' },
        { id: 'A_maj', root: 9, mode: 'major', label: 'Lá Maior (A)' },
        { id: 'B_maj', root: 11, mode: 'major', label: 'Si Maior (B)' },
        { id: 'D_maj', root: 2, mode: 'major', label: 'Ré Maior (D)' },
        { id: 'G_maj', root: 7, mode: 'major', label: 'Sol Maior (G)' },
        { id: 'C_maj', root: 0, mode: 'major', label: 'Dó Maior (C)' },
        { id: 'C#m_min', root: 1, mode: 'minor', label: 'Dó# Menor (C#m)' },
        { id: 'F#m_min', root: 6, mode: 'minor', label: 'Fá# Menor (F#m)' },
        { id: 'G#m_min', root: 8, mode: 'minor', label: 'Sol# Menor (G#m)' },
        { id: 'Em_min', root: 4, mode: 'minor', label: 'Mi Menor (Em)' },
        { id: 'Am_min', root: 9, mode: 'minor', label: 'Lá Menor (Am)' }
    ];

    // Shapes curados e verificados acusticamente (índice 0 = 1º par/corda mais aguda; -1 = abafada)
    const VIOLA_CHORD_SHAPES = {
        'E_maj': [[0, 0, 0, 0, 0], [12, 12, 12, 12, 12]],
        'F#_min': [[2, 2, 1, 2, -1], [5, 7, 5, 4, -1]],
        'G#_min': [[4, 4, 3, 4, 0], [7, 9, 7, 6, -1]],
        'A_maj': [[0, 2, 1, 0, -1], [5, 5, 5, 5, 5]],
        'B_maj': [[2, 4, 3, 2, 0], [7, 7, 7, 7, 7]],
        'B_dom7': [[2, 4, 1, 2, 0], [2, 0, 1, 2, 0]],
        'C#_min': [[0, 2, 0, 0, 2], [4, 5, 4, 2, 2]],
        'D#_dim': [[2, 4, 1, -1, 4], [5, 4, 7, 5, -1]],
        'D_maj': [[2, 3, 1, -1, 3], [10, 10, 10, 10, 10]],
        'E_min': [[0, 0, 3, 0, 0], [3, 5, 3, 2, 0]],
        'G_maj': [[3, 3, 3, 3, 3], [3, 0, 3, 3, 0]],
        'C_maj': [[8, 8, 8, 8, 8], [3, 1, 4, 0, 1]],
        'A_min': [[0, 1, 1, 0, -1], [5, 5, 4, 5, 5]],
        'B_min': [[2, 3, 3, 2, 0], [7, 7, 6, 7, 7]],
        'D_min': [[1, 3, 1, -1, 3], [5, 6, 5, 3, 3]],
        'F_maj': [[1, 1, 1, 1, 1], [5, 6, 4, 5, -1]],
        'F#_dim': [[2, 1, 1, 2, -1]],
        'G#_dim': [[4, 3, 3, 4, -1]],
        'C#_dim': [[3, 2, 0, 2, 2]],
        'A#_dim': [[0, 2, 2, 2, -1]],
        'E_dim': [[3, 5, 2, 0, -1]],
        'B_dim': [[1, 3, 3, -1, 0]],
        'D#_min': [[2, 4, 2, 1, -1]],
        'A#_min': [[1, 2, 2, 1, -1]]
    };

    const VIOLAO_CHORD_SHAPES = {
        'E_maj': [[0, 0, 1, 2, 2, 0]],
        'E_min': [[0, 0, 0, 2, 2, 0]],
        'F_maj': [[1, 1, 2, 3, 3, 1]],
        'F#_min': [[2, 2, 2, 4, 4, 2]],
        'F#_dim': [[2, 1, 2, 4, -1, -1]],
        'G_maj': [[3, 0, 0, 0, 2, 3], [3, 3, 4, 5, 5, 3]],
        'G#_min': [[4, 4, 4, 6, 6, 4]],
        'G#_dim': [[4, 3, 4, 6, -1, -1]],
        'A_maj': [[0, 2, 2, 2, 0, -1], [5, 5, 6, 7, 7, 5]],
        'A_min': [[0, 1, 2, 2, 0, -1]],
        'A#_dim': [[0, 2, 3, 2, 1, -1]],
        'B_maj': [[2, 4, 4, 4, 2, -1], [7, 7, 8, 9, 9, 7]],
        'B_min': [[2, 3, 4, 4, 2, -1]],
        'B_dim': [[1, 3, 4, 3, 2, -1]],
        'C_maj': [[0, 1, 0, 2, 3, -1], [3, 5, 5, 5, 3, -1]],
        'C#_min': [[4, 5, 6, 6, 4, -1]],
        'C#_dim': [[0, 2, 0, 2, 4, -1]],
        'D_maj': [[2, 3, 2, 0, -1, -1], [5, 7, 7, 7, 5, -1]],
        'D_min': [[1, 3, 2, 0, -1, -1]],
        'D#_min': [[6, 7, 8, 8, 6, -1]],
        'D#_dim': [[2, 4, 2, 1, -1, -1]],
        'E_dim': [[0, 2, 0, 2, 1, -1]]
    };

    let state = {
        instrumentId: 'viola_cebolao_e',
        isLeftHanded: true,          // Padrão: Canhoto (Pestana à direita, corpo à esquerda)
        viewPerspective: 'diagram',  // 'diagram' (1º par no topo) | 'player' (5º/6º grave no topo)
        displayMode: 'CHORD',        // 'CHORD' | 'DUAD' | 'FREE'
        selectedKeyId: 'E_maj',
        selectedDegreeIdx: 0,
        voicingVariantIdx: 0,
        duadType: 'SIXTHS_1_3',      // 'THIRDS_1_2' | 'THIRDS_2_3' | 'THIRDS_3_4' | 'SIXTHS_1_3' | 'SIXTHS_2_4'
        duadKeyId: 'E_maj',
        activeDuadStepIdx: -1,       // -1 = mostra escala toda; 0..7 = destaca grau em reprodução
        bpm: 92,
        timeSignature: '2/4',        // '2/4' | '3/4' | '4/4' | '6/8'
        subdivision: 2               // 1 | 2 | 3 | 4
    };

    // Estado do Web Audio API e Metrônomo Lookahead
    let audioCtx = null;
    let metroRunning = false;
    let metroTimerId = null;
    let metroNextNoteTime = 0;
    let metroCurrentSubStep = 0;
    let metroVisualQueue = [];
    let metroRafId = null;
    let tapTimestamps = [];
    let scalePlayTimers = [];

    function ensureAudioContext() {
        if (!audioCtx) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (Ctx) audioCtx = new Ctx();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function midiToFreq(midi) {
        return 440 * Math.pow(2, (midi - 69) / 12);
    }

    // Síntese acústica realista de corda dedilhada (com ressonância de tampo e par oitavado na viola)
    function pluckMidiNote(midi, startTimeOffset = 0, duration = 1.9, detuneCents = 0, gainLevel = 0.22) {
        const ctx = ensureAudioContext();
        if (!ctx) return;

        const now = ctx.currentTime + Math.max(0, startTimeOffset);
        const freq = midiToFreq(midi);

        const masterGain = ctx.createGain();
        const bodyFilter = ctx.createBiquadFilter();
        bodyFilter.type = 'lowpass';
        bodyFilter.frequency.setValueAtTime(Math.min(5800, freq * 6.5), now);
        bodyFilter.frequency.exponentialRampToValueAtTime(Math.max(420, freq * 1.8), now + duration * 0.75);
        bodyFilter.Q.setValueAtTime(1.4, now);

        // Oscilador fundamental + harmônico rico de aço (viola/violão)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'triangle';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(freq, now);
        osc2.frequency.setValueAtTime(freq, now);
        osc1.detune.setValueAtTime(detuneCents, now);
        osc2.detune.setValueAtTime(detuneCents + 1.5, now);

        const g1 = ctx.createGain();
        const g2 = ctx.createGain();
        g1.gain.value = 0.72;
        g2.gain.value = 0.28;

        // Envelope de ataque de unha/dedeira rápido + decaimento natural
        masterGain.gain.setValueAtTime(0.0001, now);
        masterGain.gain.linearRampToValueAtTime(gainLevel, now + 0.006);
        masterGain.gain.exponentialRampToValueAtTime(gainLevel * 0.42, now + 0.18);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc1.connect(g1);
        osc2.connect(g2);
        g1.connect(bodyFilter);
        g2.connect(bodyFilter);
        bodyFilter.connect(masterGain);
        masterGain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration + 0.03);
        osc2.stop(now + duration + 0.03);
    }

    function playCourseAtFret(courseIdx, fret, delaySec = 0) {
        if (fret < 0) return;
        const inst = INSTRUMENTS[state.instrumentId];
        const course = inst.courses[courseIdx];
        if (!course) return;

        if (inst.isPaired && course.midi.length === 2) {
            pluckMidiNote(course.midi[0] + fret, delaySec, 1.85, -1.6, 0.17);
            pluckMidiNote(course.midi[1] + fret, delaySec + 0.011, 1.85, 1.6, 0.16);
        } else {
            pluckMidiNote(course.midi[0] + fret, delaySec, 1.95, 0, 0.24);
        }
    }

    // =========================================================================
    // MOTOR TEÓRICO: CAMPO HARMÔNICO E VOICINGS REAIS
    // =========================================================================
    function getHarmonicField(keyId) {
        const keyObj = HARMONIC_KEYS.find((k) => k.id === keyId) || HARMONIC_KEYS[0];
        const isMajor = keyObj.mode === 'major';
        const steps = isMajor ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10];
        const qualities = isMajor
            ? ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim']
            : ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj'];
        const romans = isMajor
            ? ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
            : ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

        return steps.map((semi, idx) => {
            const rootPc = (keyObj.root + semi) % 12;
            const qual = qualities[idx];
            const rootStr = NOTE_NAMES[rootPc];
            const suffix = qual === 'min' ? 'm' : (qual === 'dim' ? '°' : '');
            const chordIntervals = qual === 'maj' ? [0, 4, 7] : (qual === 'min' ? [0, 3, 7] : [0, 3, 6]);
            const pitchClasses = chordIntervals.map((iv) => (rootPc + iv) % 12);

            return {
                degreeIndex: idx,
                roman: romans[idx],
                chordCode: `${rootStr}_${qual}`,
                chordName: `${rootStr}${suffix}`,
                chordNamePT: `${NOTE_NAMES_PT[rootPc]}${qual === 'min' ? ' menor' : (qual === 'dim' ? ' dim' : ' Maior')}`,
                rootPc,
                quality: qual,
                pitchClasses
            };
        });
    }

    // Solver algorítmico de fallback caso alguma variante extra seja solicitada
    function solveAlgorithmicVoicing(inst, rootPc, pitchClasses, baseFret = 0) {
        const frets = inst.courses.map((c) => {
            for (let f = baseFret; f <= baseFret + 4; f++) {
                const pc = (c.pitchClass + f) % 12;
                if (pitchClasses.includes(pc)) return f;
            }
            for (let f = 0; f <= 12; f++) {
                const pc = (c.pitchClass + f) % 12;
                if (pitchClasses.includes(pc)) return f;
            }
            return -1;
        });
        return frets;
    }

    function getChordVoicings(chordObj) {
        const inst = INSTRUMENTS[state.instrumentId];
        const dict = inst.isPaired ? VIOLA_CHORD_SHAPES : VIOLAO_CHORD_SHAPES;
        const curated = dict[chordObj.chordCode];
        if (curated && curated.length > 0) {
            return curated;
        }
        return [
            solveAlgorithmicVoicing(inst, chordObj.rootPc, chordObj.pitchClasses, 0),
            solveAlgorithmicVoicing(inst, chordObj.rootPc, chordObj.pitchClasses, 4)
        ];
    }

    function getIntervalRole(pc, chordObj) {
        const rel = (pc - chordObj.rootPc + 12) % 12;
        if (rel === 0) return 'T';
        if (rel === 3) return '3m';
        if (rel === 4) return '3M';
        if (rel === 6) return '5°';
        if (rel === 7) return '5J';
        if (rel === 10) return '7m';
        return '';
    }

    function strumActiveChord() {
        const field = getHarmonicField(state.selectedKeyId);
        const chord = field[state.selectedDegreeIdx] || field[0];
        const voicings = getChordVoicings(chord);
        const shape = voicings[state.voicingVariantIdx % voicings.length];
        const inst = INSTRUMENTS[state.instrumentId];

        // Dedilha do bordão mais grave até a prima mais aguda
        let step = 0;
        for (let cIdx = inst.courses.length - 1; cIdx >= 0; cIdx--) {
            const fret = shape[cIdx];
            if (fret >= 0) {
                playCourseAtFret(cIdx, fret, step * 0.048);
                flashFretCell(cIdx, fret, step * 48);
                step++;
            }
        }
    }

    // =========================================================================
    // MOTOR DE ESCALAS DUADAS (TERÇAS E SEXTAS — VIOLA CEBOLÃO EM MI)
    // =========================================================================
    const DUAD_CONFIGS = {
        SIXTHS_1_3: { label: 'Sextas — Pares 1 e 3 (Clássica Ponteio)', upperCourse: 0, lowerCourse: 2, intervalType: '6th' },
        SIXTHS_2_4: { label: 'Sextas — Pares 2 e 4 (Médio-Grave)', upperCourse: 1, lowerCourse: 3, intervalType: '6th' },
        THIRDS_3_4: { label: 'Terças — Pares 3 e 4 (Encorpada)', upperCourse: 2, lowerCourse: 3, intervalType: '3rd' },
        THIRDS_2_3: { label: 'Terças — Pares 2 e 3 (Central)', upperCourse: 1, lowerCourse: 2, intervalType: '3rd' },
        THIRDS_1_2: { label: 'Terças — Pares 1 e 2 (Aguda / Brilhante)', upperCourse: 0, lowerCourse: 1, intervalType: '3rd' }
    };

    const DUAD_KEYS = [
        { id: 'E_maj', root: 4, mode: 'major', label: 'Mi Maior (E)' },
        { id: 'A_maj', root: 9, mode: 'major', label: 'Lá Maior (A)' },
        { id: 'B_maj', root: 11, mode: 'major', label: 'Si Maior (B)' },
        { id: 'D_maj', root: 2, mode: 'major', label: 'Ré Maior (D)' },
        { id: 'G#m_min', root: 8, mode: 'minor', label: 'Sol# Menor (G#m)' }
    ];

    function computeDuadScaleSteps() {
        const inst = INSTRUMENTS[state.instrumentId];
        const cfg = DUAD_CONFIGS[state.duadType] || DUAD_CONFIGS.SIXTHS_1_3;
        const keyObj = DUAD_KEYS.find((k) => k.id === state.duadKeyId) || DUAD_KEYS[0];
        const scaleOffsets = keyObj.mode === 'major' ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10];
        const degreeRomans = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

        const uCourse = inst.courses[Math.min(cfg.upperCourse, inst.courses.length - 1)];
        const lCourse = inst.courses[Math.min(cfg.lowerCourse, inst.courses.length - 1)];
        const uBaseMidi = uCourse.midi[0];
        const lBaseMidi = lCourse.midi[0];

        // Gera candidatos diatônicos em múltiplas oitavas e seleciona os 8 passos jogáveis (casas 0..14)
        const candidates = [];
        for (let oct = 2; oct <= 6; oct++) {
            for (let deg = 0; deg < 7; deg++) {
                const baseRootMidi = 12 * oct + keyObj.root;
                if (cfg.intervalType === '3rd') {
                    const lowerMidi = baseRootMidi + scaleOffsets[deg];
                    const thirdDeg = deg + 2;
                    const upperMidi = baseRootMidi + (thirdDeg >= 7 ? scaleOffsets[thirdDeg - 7] + 12 : scaleOffsets[thirdDeg]);
                    const fLower = lowerMidi - lBaseMidi;
                    const fUpper = upperMidi - uBaseMidi;
                    if (fLower >= 0 && fLower <= 14 && fUpper >= 0 && fUpper <= 14) {
                        candidates.push({
                            degIdx: deg,
                            roman: degreeRomans[deg],
                            upperCourse: cfg.upperCourse,
                            lowerCourse: cfg.lowerCourse,
                            upperFret: fUpper,
                            lowerFret: fLower,
                            upperNote: NOTE_NAMES[upperMidi % 12],
                            lowerNote: NOTE_NAMES[lowerMidi % 12],
                            sortPitch: lowerMidi
                        });
                    }
                } else {
                    // Sextas: melodia na corda aguda e sexta abaixo (terça invertida = +2 graus - 12 semitons) na grave
                    const upperMidi = baseRootMidi + scaleOffsets[deg];
                    const thirdDeg = deg + 2;
                    const sixthBelowMidi = baseRootMidi + (thirdDeg >= 7 ? scaleOffsets[thirdDeg - 7] + 12 : scaleOffsets[thirdDeg]) - 12;
                    const fUpper = upperMidi - uBaseMidi;
                    const fLower = sixthBelowMidi - lBaseMidi;
                    if (fUpper >= 0 && fUpper <= 14 && fLower >= 0 && fLower <= 14) {
                        candidates.push({
                            degIdx: deg,
                            roman: degreeRomans[deg],
                            upperCourse: cfg.upperCourse,
                            lowerCourse: cfg.lowerCourse,
                            upperFret: fUpper,
                            lowerFret: fLower,
                            upperNote: NOTE_NAMES[upperMidi % 12],
                            lowerNote: NOTE_NAMES[sixthBelowMidi % 12],
                            sortPitch: upperMidi
                        });
                    }
                }
            }
        }

        candidates.sort((a, b) => a.sortPitch - b.sortPitch);
        // Prioriza começar na tônica (degIdx === 0) se houver 8 graus a partir dela; caso contrário usa os 8 primeiros passos do braço
        const rootStartIdx = candidates.findIndex((c) => c.degIdx === 0 && candidates.length - candidates.indexOf(c) >= 8);
        const start = rootStartIdx >= 0 ? rootStartIdx : 0;
        return candidates.slice(start, start + 8).map((item, idx) => ({
            ...item,
            stepNumber: idx + 1
        }));
    }

    function stopScalePlayback() {
        scalePlayTimers.forEach((t) => clearTimeout(t));
        scalePlayTimers = [];
        state.activeDuadStepIdx = -1;
    }

    function playDuadScale() {
        stopScalePlayback();
        state.displayMode = 'DUAD';
        const steps = computeDuadScaleSteps();
        if (steps.length === 0) return;

        const beatMs = Math.round((60 / Math.max(40, state.bpm)) * 1000);
        steps.forEach((st, idx) => {
            const tId = setTimeout(() => {
                state.activeDuadStepIdx = idx;
                playCourseAtFret(st.lowerCourse, st.lowerFret, 0);
                playCourseAtFret(st.upperCourse, st.upperFret, 0.022);
                renderFretboardSVG();
                renderDuadStrip();
            }, idx * beatMs);
            scalePlayTimers.push(tId);
        });

        const endTimer = setTimeout(() => {
            state.activeDuadStepIdx = -1;
            renderFretboardSVG();
            renderDuadStrip();
        }, steps.length * beatMs + 350);
        scalePlayTimers.push(endTimer);
    }

    // =========================================================================
    // METRÔNOMO DE ALTA PRECISÃO (WEB AUDIO API LOOKAHEAD SCHEDULER)
    // =========================================================================
    function getBeatsPerBar() {
        if (state.timeSignature === '2/4') return 2;
        if (state.timeSignature === '3/4') return 3;
        if (state.timeSignature === '6/8') return 6;
        return 4;
    }

    function scheduleMetronomeClick(subStepIndex, time) {
        const ctx = ensureAudioContext();
        if (!ctx) return;

        const sub = state.subdivision;
        const beatsPerBar = getBeatsPerBar();
        const isMainBeat = (subStepIndex % sub) === 0;
        const beatNumber = Math.floor(subStepIndex / sub) % beatsPerBar;
        const isDownbeat = isMainBeat && beatNumber === 0;
        const isSecondaryAccent = isMainBeat && state.timeSignature === '6/8' && beatNumber === 3;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = isDownbeat ? 'triangle' : 'sine';

        const freq = isDownbeat ? 1180 : (isSecondaryAccent ? 880 : (isMainBeat ? 740 : 520));
        const vol = isDownbeat ? 0.34 : (isMainBeat ? 0.22 : 0.09);

        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(vol, time + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.048);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.055);

        if (isMainBeat) {
            metroVisualQueue.push({ beat: beatNumber, time });
        }
    }

    function metroSchedulerTick() {
        if (!metroRunning || !audioCtx) return;
        const scheduleAheadSec = 0.1;
        const totalSubStepsPerBar = getBeatsPerBar() * state.subdivision;

        while (metroNextNoteTime < audioCtx.currentTime + scheduleAheadSec) {
            scheduleMetronomeClick(metroCurrentSubStep, metroNextNoteTime);
            const secPerMainBeat = state.timeSignature === '6/8'
                ? (60 / state.bpm) / 1.5
                : (60 / state.bpm);
            metroNextNoteTime += secPerMainBeat / state.subdivision;
            metroCurrentSubStep = (metroCurrentSubStep + 1) % totalSubStepsPerBar;
        }
    }

    function metroVisualLoop() {
        if (!metroRunning || !audioCtx) return;
        const currentTime = audioCtx.currentTime;
        let activeBeat = -1;
        while (metroVisualQueue.length > 0 && metroVisualQueue[0].time <= currentTime) {
            activeBeat = metroVisualQueue[0].beat;
            metroVisualQueue.shift();
        }
        if (activeBeat >= 0) {
            document.querySelectorAll('[data-metro-led]').forEach((led) => {
                const idx = parseInt(led.getAttribute('data-metro-led'), 10);
                if (idx === activeBeat) {
                    led.className = idx === 0
                        ? 'w-5 h-5 rounded-full bg-emerald-400 shadow-[0_0_14px_#34d399] scale-110 transition-all duration-75'
                        : 'w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] scale-105 transition-all duration-75';
                } else {
                    led.className = 'w-4 h-4 rounded-full bg-slate-800 border border-slate-700 transition-all duration-150';
                }
            });
        }
        metroRafId = requestAnimationFrame(metroVisualLoop);
    }

    function toggleMetronome() {
        if (metroRunning) {
            metroRunning = false;
            if (metroTimerId) clearInterval(metroTimerId);
            if (metroRafId) cancelAnimationFrame(metroRafId);
            metroVisualQueue = [];
            renderMetronomeControls();
            return;
        }
        const ctx = ensureAudioContext();
        if (!ctx) return;
        metroRunning = true;
        metroCurrentSubStep = 0;
        metroNextNoteTime = ctx.currentTime + 0.04;
        metroTimerId = setInterval(metroSchedulerTick, 25);
        metroRafId = requestAnimationFrame(metroVisualLoop);
        renderMetronomeControls();
    }

    // =========================================================================
    // RENDERIZADOR SVG DO BRAÇO (ESPELHADO NATIVAMENTE PARA CANHOTO)
    // =========================================================================
    function flashFretCell(courseIdx, fret, delayMs = 0) {
        setTimeout(() => {
            const el = document.querySelector(`[data-fret-hit="${courseIdx}-${fret}"]`);
            if (!el) return;
            el.setAttribute('stroke-opacity', '1');
            setTimeout(() => {
                if (el) el.setAttribute('stroke-opacity', '0');
            }, 340);
        }, delayMs);
    }

    function renderFretboardSVG() {
        const wrap = document.getElementById('viola-fretboard-svg-wrap');
        if (!wrap) return;

        const inst = INSTRUMENTS[state.instrumentId];
        const numCourses = inst.courses.length;
        const maxFret = 14;
        const svgW = 1080;
        const svgH = numCourses === 5 ? 250 : 280;

        const padLeft = 68;
        const padRight = 68;
        const topY = 44;
        const botY = svgH - 42;
        const boardW = svgW - padLeft - padRight;
        const nutSlotW = 46;
        const frettedW = boardW - nutSlotW;
        const fretStepW = frettedW / maxFret;
        const rowStepY = (botY - topY) / (numCourses - 1);

        // Coordenada X central de cada casa f (0..14) e linha do traste
        // CANHOTO (isLeftHanded = true): Casa 0 (Pestana) à DIREITA, Casa 14 (Corpo) à ESQUERDA!
        const getNutLineX = () => state.isLeftHanded ? (svgW - padRight - nutSlotW) : (padLeft + nutSlotW);
        const getFretLineX = (f) => {
            if (state.isLeftHanded) {
                return getNutLineX() - f * fretStepW;
            }
            return getNutLineX() + f * fretStepW;
        };
        const getCellCenterX = (f) => {
            if (f === 0) {
                return state.isLeftHanded ? (getNutLineX() + nutSlotW * 0.5) : (getNutLineX() - nutSlotW * 0.5);
            }
            if (state.isLeftHanded) {
                return getNutLineX() - (f - 0.5) * fretStepW;
            }
            return getNutLineX() + (f - 0.5) * fretStepW;
        };

        const getRowY = (courseIdx) => {
            const visualRow = state.viewPerspective === 'diagram'
                ? courseIdx
                : (numCourses - 1 - courseIdx);
            return topY + visualRow * rowStepY;
        };

        // Coleta marcadores ativos conforme modo (CHORD ou DUAD)
        const activeMarkers = [];
        const mutedCourses = new Set();

        if (state.displayMode === 'CHORD') {
            const field = getHarmonicField(state.selectedKeyId);
            const chord = field[state.selectedDegreeIdx] || field[0];
            const voicings = getChordVoicings(chord);
            const shape = voicings[state.voicingVariantIdx % voicings.length];

            shape.forEach((fret, cIdx) => {
                if (fret < 0) {
                    mutedCourses.add(cIdx);
                } else {
                    const pc = (inst.courses[cIdx].pitchClass + fret) % 12;
                    const role = getIntervalRole(pc, chord);
                    activeMarkers.push({
                        courseIdx: cIdx,
                        fret,
                        label: NOTE_NAMES[pc],
                        sub: role,
                        color: role === 'T' ? '#10b981' : (role.startsWith('3') ? '#06b6d4' : '#f59e0b')
                    });
                }
            });
        } else if (state.displayMode === 'DUAD') {
            const duads = computeDuadScaleSteps();
            duads.forEach((st, idx) => {
                const isHighlighted = state.activeDuadStepIdx === -1 || state.activeDuadStepIdx === idx;
                const opacity = isHighlighted ? '1' : '0.32';
                const colUpper = state.activeDuadStepIdx === idx ? '#34d399' : '#06b6d4';
                const colLower = state.activeDuadStepIdx === idx ? '#fbbf24' : '#0ea5e9';
                activeMarkers.push({
                    courseIdx: st.upperCourse,
                    fret: st.upperFret,
                    label: `${st.stepNumber}º`,
                    sub: st.upperNote,
                    color: colUpper,
                    opacity
                });
                activeMarkers.push({
                    courseIdx: st.lowerCourse,
                    fret: st.lowerFret,
                    label: `${st.stepNumber}º`,
                    sub: st.lowerNote,
                    color: colLower,
                    opacity
                });
            });
        }

        // Construção SVG
        const nutX = getNutLineX();
        const bodyEndX = getFretLineX(maxFret);
        const rectX = Math.min(nutX, bodyEndX);
        const rectW = Math.abs(nutX - bodyEndX);

        let inlaysSvg = '';
        [3, 5, 7, 9, 12].forEach((f) => {
            const cx = getCellCenterX(f);
            if (f === 12) {
                inlaysSvg += `<circle cx="${cx}" cy="${topY + (botY - topY) * 0.3}" r="5.5" fill="#334155" opacity="0.85"/>`;
                inlaysSvg += `<circle cx="${cx}" cy="${topY + (botY - topY) * 0.7}" r="5.5" fill="#334155" opacity="0.85"/>`;
            } else {
                inlaysSvg += `<circle cx="${cx}" cy="${(topY + botY) / 2}" r="6" fill="#334155" opacity="0.85"/>`;
            }
        });

        let fretsSvg = '';
        for (let f = 1; f <= maxFret; f++) {
            const fx = getFretLineX(f);
            fretsSvg += `<line x1="${fx}" y1="${topY - 8}" x2="${fx}" y2="${botY + 8}" stroke="#475569" stroke-width="2"/>`;
        }
        // Pestana (Nut) destacada
        fretsSvg += `<line x1="${nutX}" y1="${topY - 10}" x2="${nutX}" y2="${botY + 10}" stroke="#e2e8f0" stroke-width="5" stroke-linecap="round"/>`;

        // Numeração das casas no topo e base
        let fretNumsSvg = '';
        for (let f = 0; f <= maxFret; f++) {
            const cx = getCellCenterX(f);
            const highlightNum = [0, 3, 5, 7, 9, 12].includes(f);
            fretNumsSvg += `<text x="${cx}" y="22" text-anchor="middle" fill="${highlightNum ? '#38bdf8' : '#64748b'}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="${highlightNum ? '700' : '500'}">${f === 0 ? 'SOLTA' : f + 'ª'}</text>`;
        }

        // Indicador direcional Canhoto vs Destro no rodapé do SVG
        const dirText = state.isLeftHanded
            ? '← CORPO / BOCA DO INSTRUMENTO (Mão Esquerda Dedilha)          PESTANA / MÃO DIREITA NA ESCALA →'
            : '← PESTANA / MÃO ESQUERDA NA ESCALA          CORPO / BOCA DO INSTRUMENTO (Mão Direita Dedilha) →';

        // Cordas / Pares Duplos da Viola Caipira
        let stringsSvg = '';
        inst.courses.forEach((c, cIdx) => {
            const y = getRowY(cIdx);
            const xStart = Math.min(bodyEndX, getCellCenterX(0));
            const xEnd = Math.max(bodyEndX, getCellCenterX(0));
            const thickness = 1.3 + cIdx * 0.38;

            if (inst.isPaired) {
                stringsSvg += `<line x1="${xStart}" y1="${y - 2}" x2="${xEnd}" y2="${y - 2}" stroke="#94a3b8" stroke-width="1.2" opacity="0.9"/>`;
                stringsSvg += `<line x1="${xStart}" y1="${y + 2}" x2="${xEnd}" y2="${y + 2}" stroke="${c.octaved ? '#cbd5e1' : '#94a3b8'}" stroke-width="${c.octaved ? thickness + 0.5 : 1.2}" opacity="0.95"/>`;
            } else {
                stringsSvg += `<line x1="${xStart}" y1="${y}" x2="${xEnd}" y2="${y}" stroke="#cbd5e1" stroke-width="${thickness}"/>`;
            }

            // Rótulo lateral da corda/par próximo à pestana
            const labelX = state.isLeftHanded ? (svgW - 14) : 14;
            const anchor = state.isLeftHanded ? 'end' : 'start';
            const isMuted = mutedCourses.has(cIdx);
            stringsSvg += `
                <text x="${labelX}" y="${y + 4}" text-anchor="${anchor}" fill="${isMuted ? '#f43f5e' : '#e2e8f0'}" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700">
                    ${isMuted ? '✕ ' : ''}${c.num}º ${c.note.split('/')[0]}
                </text>
            `;
        });

        // Marcadores ativos (Acordes ou Escalas Duadas)
        let markersSvg = '';
        activeMarkers.forEach((mk) => {
            const cx = getCellCenterX(mk.fret);
            const cy = getRowY(mk.courseIdx);
            const op = mk.opacity || '1';
            markersSvg += `
                <g opacity="${op}" class="pointer-events-none">
                    <circle cx="${cx}" cy="${cy}" r="13.5" fill="${mk.color}" stroke="#090d16" stroke-width="2"/>
                    <text x="${cx}" y="${mk.sub ? cy - 0.5 : cy + 4}" text-anchor="middle" fill="#090d16" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="800">${mk.label}</text>
                    ${mk.sub ? `<text x="${cx}" y="${cy + 9}" text-anchor="middle" fill="#090d16" font-family="JetBrains Mono, monospace" font-size="7.5" font-weight="700">${mk.sub}</text>` : ''}
                </g>
            `;
        });

        // Camada interativa clicável em TODAS as cordas x casas (0..14)
        let hitAreasSvg = '';
        inst.courses.forEach((c, cIdx) => {
            const cy = getRowY(cIdx);
            for (let f = 0; f <= maxFret; f++) {
                const cx = getCellCenterX(f);
                const pc = (c.pitchClass + f) % 12;
                const noteLabel = `${NOTE_NAMES[pc]} (${c.label} • Casa ${f})`;
                hitAreasSvg += `
                    <g class="cursor-pointer group" data-click-course="${cIdx}" data-click-fret="${f}">
                        <title>Tocar ${noteLabel}</title>
                        <rect x="${cx - fretStepW * 0.46}" y="${cy - rowStepY * 0.44}" width="${fretStepW * 0.92}" height="${rowStepY * 0.88}" fill="transparent"/>
                        <circle data-fret-hit="${cIdx}-${f}" cx="${cx}" cy="${cy}" r="15.5" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-opacity="0"/>
                    </g>
                `;
            }
        });

        wrap.innerHTML = `
            <svg viewBox="0 0 ${svgW} ${svgH}" class="w-full h-auto select-none" role="img" aria-label="Braço interativo espelhado para canhoto">
                <defs>
                    <linearGradient id="woodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#141c2e"/>
                        <stop offset="50%" stop-color="#0d1424"/>
                        <stop offset="100%" stop-color="#141c2e"/>
                    </linearGradient>
                </defs>
                <rect x="${rectX}" y="${topY - 10}" width="${rectW}" height="${botY - topY + 20}" rx="4" fill="url(#woodGrad)" stroke="#1e293b" stroke-width="1.5"/>
                ${inlaysSvg}
                ${fretsSvg}
                ${fretNumsSvg}
                ${stringsSvg}
                ${markersSvg}
                ${hitAreasSvg}
                <text x="${svgW / 2}" y="${svgH - 10}" text-anchor="middle" fill="#94a3b8" font-family="JetBrains Mono, monospace" font-size="10.5">${dirText}</text>
            </svg>
        `;

        wrap.querySelectorAll('[data-click-course]').forEach((node) => {
            node.addEventListener('click', () => {
                const cIdx = parseInt(node.getAttribute('data-click-course'), 10);
                const f = parseInt(node.getAttribute('data-click-fret'), 10);
                playCourseAtFret(cIdx, f, 0);
                flashFretCell(cIdx, f, 0);
            });
        });
    }

    function renderHarmonicFieldPanel() {
        const container = document.getElementById('viola-harmonic-degrees');
        const infoBox = document.getElementById('viola-active-chord-info');
        if (!container || !infoBox) return;

        const field = getHarmonicField(state.selectedKeyId);
        const activeChord = field[state.selectedDegreeIdx] || field[0];
        const voicings = getChordVoicings(activeChord);

        container.innerHTML = field.map((deg, idx) => {
            const isSelected = state.displayMode === 'CHORD' && state.selectedDegreeIdx === idx;
            return `
                <button type="button" data-deg-btn="${idx}"
                    class="min-h-[54px] px-2.5 py-2 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                        isSelected
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-lg'
                            : 'bg-[#090d16] border-slate-800 hover:border-slate-600 text-slate-300'
                    }">
                    <span class="text-[11px] font-mono text-slate-400">${deg.roman}</span>
                    <span class="text-sm sm:text-base font-bold font-mono">${deg.chordName}</span>
                </button>
            `;
        }).join('');

        const activeShape = voicings[state.voicingVariantIdx % voicings.length];
        const shapeTxt = activeShape.map((f) => (f < 0 ? 'X' : f)).slice().reverse().join(' - ');

        infoBox.innerHTML = `
            <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <span class="text-xs font-mono text-emerald-400">${activeChord.roman} Grau • ${activeChord.chordNamePT}</span>
                    <div class="text-sm font-mono text-slate-200 mt-0.5">
                        Notas: <strong class="text-cyan-300">${activeChord.pitchClasses.map((p) => NOTE_NAMES[p]).join(' – ')}</strong>
                        <span class="text-slate-500 mx-1.5">|</span>
                        Casas (grave→agudo): <strong class="text-amber-300">${shapeTxt}</strong>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    ${voicings.length > 1 ? `
                        <button type="button" id="btn-viola-cycle-voicing" class="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-cyan-300">
                            Shape ${(state.voicingVariantIdx % voicings.length) + 1}/${voicings.length}
                        </button>
                    ` : ''}
                    <button type="button" id="btn-viola-strum" class="min-h-[40px] px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5">
                        <i data-lucide="volume-2" class="w-4 h-4"></i>
                        <span>Dedilhar Acorde</span>
                    </button>
                </div>
            </div>
        `;

        container.querySelectorAll('[data-deg-btn]').forEach((btn) => {
            btn.addEventListener('click', () => {
                stopScalePlayback();
                state.displayMode = 'CHORD';
                state.selectedDegreeIdx = parseInt(btn.getAttribute('data-deg-btn'), 10);
                state.voicingVariantIdx = 0;
                saveViolaState();
                renderAll();
                strumActiveChord();
            });
        });

        const cycleBtn = document.getElementById('btn-viola-cycle-voicing');
        if (cycleBtn) {
            cycleBtn.addEventListener('click', () => {
                state.displayMode = 'CHORD';
                state.voicingVariantIdx = (state.voicingVariantIdx + 1) % voicings.length;
                saveViolaState();
                renderAll();
                strumActiveChord();
            });
        }

        const strumBtn = document.getElementById('btn-viola-strum');
        if (strumBtn) {
            strumBtn.addEventListener('click', () => {
                state.displayMode = 'CHORD';
                renderFretboardSVG();
                strumActiveChord();
            });
        }

        global.VaultCore.refreshIcons(infoBox);
    }

    function renderDuadStrip() {
        const strip = document.getElementById('viola-duad-strip');
        if (!strip) return;

        const steps = computeDuadScaleSteps();
        strip.innerHTML = steps.map((st, idx) => {
            const active = state.displayMode === 'DUAD' && state.activeDuadStepIdx === idx;
            return `
                <button type="button" data-duad-step="${idx}"
                    class="min-h-[54px] px-2.5 py-1.5 rounded-lg border text-left font-mono transition ${
                        active
                            ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 scale-[1.02]'
                            : 'bg-[#090d16] border-slate-800 hover:border-cyan-500/50 text-slate-300'
                    }">
                    <div class="flex items-center justify-between text-[10px] text-slate-400">
                        <span>${st.stepNumber}º (${st.roman})</span>
                        <span class="text-cyan-400">${st.lowerNote}+${st.upperNote}</span>
                    </div>
                    <div class="text-xs font-bold text-slate-100 mt-0.5">
                        Par ${st.upperCourse + 1}: <span class="text-emerald-300">${st.upperFret}</span> | Par ${st.lowerCourse + 1}: <span class="text-amber-300">${st.lowerFret}</span>
                    </div>
                </button>
            `;
        }).join('');

        strip.querySelectorAll('[data-duad-step]').forEach((btn) => {
            btn.addEventListener('click', () => {
                stopScalePlayback();
                const idx = parseInt(btn.getAttribute('data-duad-step'), 10);
                const st = steps[idx];
                if (!st) return;
                state.displayMode = 'DUAD';
                state.activeDuadStepIdx = idx;
                playCourseAtFret(st.lowerCourse, st.lowerFret, 0);
                playCourseAtFret(st.upperCourse, st.upperFret, 0.02);
                renderFretboardSVG();
                renderDuadStrip();
            });
        });
    }

    function renderMetronomeControls() {
        const bpmVal = document.getElementById('viola-bpm-display');
        const bpmSlider = document.getElementById('viola-bpm-slider');
        const playBtn = document.getElementById('btn-viola-metro-toggle');
        const ledsWrap = document.getElementById('viola-metro-leds');

        if (bpmVal) bpmVal.textContent = `${state.bpm} BPM`;
        if (bpmSlider) bpmSlider.value = String(state.bpm);

        if (playBtn) {
            playBtn.className = metroRunning
                ? 'min-h-[44px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition'
                : 'min-h-[44px] px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition';
            playBtn.innerHTML = metroRunning
                ? `<i data-lucide="square" class="w-4 h-4"></i><span>Parar Metrônomo</span>`
                : `<i data-lucide="play" class="w-4 h-4"></i><span>Iniciar Metrônomo</span>`;
            global.VaultCore.refreshIcons(playBtn);
        }

        if (ledsWrap) {
            const beats = getBeatsPerBar();
            ledsWrap.innerHTML = Array.from({ length: beats }, (_, i) => `
                <div data-metro-led="${i}" class="w-4 h-4 rounded-full bg-slate-800 border border-slate-700 transition-all"></div>
            `).join('');
        }
    }

    function loadViolaState() {
        const C = global.VaultCore;
        const saved = C.store.get(C.STORAGE_KEYS.VIOLA, null);
        if (saved && typeof saved === 'object') {
            state = Object.assign({}, state, saved, { activeDuadStepIdx: -1 });
        }
    }

    function saveViolaState() {
        const C = global.VaultCore;
        const copy = Object.assign({}, state);
        delete copy.activeDuadStepIdx;
        C.store.set(C.STORAGE_KEYS.VIOLA, copy);
    }

    function mountShell() {
        const panel = document.getElementById('tab-panel-viola');
        if (!panel) return;

        panel.innerHTML = `
            <div class="space-y-5 pb-20">
                <!-- Barra Superior de Instrumento e Orientação Canhota -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
                    <div>
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Lutheria & Acústica Digital</span>
                            <span id="viola-hand-badge" class="px-2 py-0.5 text-[11px] font-mono rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">Modo Canhoto Ativo (Espelhado)</span>
                        </div>
                        <h2 class="text-lg sm:text-xl font-bold text-slate-100 mt-1">Estúdio de Viola Caipira (Cebolão em Mi) & Violão</h2>
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                        <select id="viola-select-instrument" aria-label="Selecionar instrumento"
                            class="min-h-[44px] px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-xs sm:text-sm font-medium text-slate-100 focus:border-cyan-500">
                            <option value="viola_cebolao_e">Viola Caipira — Cebolão em Mi (E-B-G#-E-B)</option>
                            <option value="violao_padrao">Violão Padrão 6 Cordas (E-A-D-G-B-E)</option>
                        </select>

                        <button type="button" id="btn-viola-toggle-hand" class="min-h-[44px] px-3.5 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition">
                            <i data-lucide="flip-horizontal-2" class="w-4 h-4"></i>
                            <span id="label-viola-hand">Canhoto (Pestana à Direita)</span>
                        </button>

                        <button type="button" id="btn-viola-toggle-persp" class="min-h-[44px] px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition">
                            <i data-lucide="arrow-up-down" class="w-4 h-4 text-cyan-400"></i>
                            <span id="label-viola-persp">1º Par no Topo</span>
                        </button>
                    </div>
                </div>

                <!-- Braço Interativo SVG -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3 sm:p-4 space-y-2">
                    <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                        <span>Clique em qualquer par/casa para ouvir a síntese acústica real (pares 3º, 4º e 5º oitavados na Viola).</span>
                        <div class="flex items-center gap-2 font-mono text-[11px]">
                            <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Tônica</span>
                            <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>Terça / Escala</span>
                            <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Quinta</span>
                        </div>
                    </div>
                    <div id="viola-fretboard-svg-wrap" class="w-full overflow-x-auto pb-1"></div>
                </div>

                <!-- Grid Inferior: Campo Harmônico + Escalas Duadas + Metrônomo -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <!-- Coluna 1: Campo Harmônico + Shapes -->
                    <div class="lg:col-span-6 bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <h3 class="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Campo Harmônico & Shapes</h3>
                                <p class="text-xs text-slate-400">Toque em um grau para projetar no braço canhoto e dedilhar</p>
                            </div>
                            <select id="viola-select-key" aria-label="Tonalidade do campo harmônico"
                                class="min-h-[40px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-xs font-mono text-emerald-300">
                                ${HARMONIC_KEYS.map((k) => `<option value="${k.id}">${k.label}</option>`).join('')}
                            </select>
                        </div>

                        <div id="viola-harmonic-degrees" class="grid grid-cols-4 sm:grid-cols-7 gap-2"></div>
                        <div id="viola-active-chord-info" class="bg-[#090d16] border border-slate-800 rounded-xl p-3"></div>
                    </div>

                    <!-- Coluna 2: Escalas Duadas (Terças e Sextas da Viola) -->
                    <div class="lg:col-span-6 bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h3 class="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Escalas Duadas (Terças & Sextas)</h3>
                                <p class="text-xs text-slate-400">Ponteio tradicional mapeado do 1º ao 8º grau</p>
                            </div>
                            <button type="button" id="btn-viola-play-duads" class="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5">
                                <i data-lucide="music-2" class="w-4 h-4"></i>
                                <span>Tocar Escala Duada</span>
                            </button>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <select id="viola-select-duad-type" aria-label="Tipo de escala duada"
                                class="min-h-[40px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-xs text-slate-200">
                                ${Object.entries(DUAD_CONFIGS).map(([id, cfg]) => `<option value="${id}">${cfg.label}</option>`).join('')}
                            </select>
                            <select id="viola-select-duad-key" aria-label="Tonalidade da escala duada"
                                class="min-h-[40px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-xs font-mono text-cyan-300">
                                ${DUAD_KEYS.map((k) => `<option value="${k.id}">${k.label}</option>`).join('')}
                            </select>
                        </div>

                        <div id="viola-duad-strip" class="grid grid-cols-2 sm:grid-cols-4 gap-2"></div>
                    </div>
                </div>

                <!-- Metrônomo Lookahead Nativo -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div class="flex items-center gap-4">
                            <div>
                                <span class="text-[11px] font-mono uppercase tracking-wider text-slate-400">Metrônomo Web Audio Lookahead</span>
                                <div id="viola-bpm-display" class="text-2xl font-mono font-bold text-cyan-300">92 BPM</div>
                            </div>
                            <div id="viola-metro-leds" class="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#090d16] border border-slate-800"></div>
                        </div>

                        <div class="flex-1 max-w-xl space-y-2">
                            <input type="range" id="viola-bpm-slider" min="40" max="220" value="92"
                                class="w-full accent-cyan-400 cursor-pointer">
                            <div class="flex flex-wrap items-center gap-1.5">
                                <button type="button" data-bpm-delta="-5" class="min-h-[38px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 font-mono text-xs text-slate-200">−5</button>
                                <button type="button" data-bpm-delta="-1" class="min-h-[38px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 font-mono text-xs text-slate-200">−1</button>
                                <button type="button" data-bpm-delta="1" class="min-h-[38px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 font-mono text-xs text-slate-200">+1</button>
                                <button type="button" data-bpm-delta="5" class="min-h-[38px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 font-mono text-xs text-slate-200">+5</button>
                                <button type="button" id="btn-viola-tap-tempo" class="min-h-[38px] px-3 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 font-mono text-xs text-amber-300">Tap Tempo</button>

                                <select id="viola-metro-sig" aria-label="Compasso" class="min-h-[38px] px-2.5 py-1 rounded bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-200">
                                    <option value="2/4">2/4 Pagode / Cururu</option>
                                    <option value="3/4">3/4 Moda / Guarânia</option>
                                    <option value="4/4">4/4 Toada / Padrão</option>
                                    <option value="6/8">6/8 Ternário / Ponteio</option>
                                </select>

                                <select id="viola-metro-sub" aria-label="Subdivisão" class="min-h-[38px] px-2.5 py-1 rounded bg-[#090d16] border border-slate-700 font-mono text-xs text-slate-200">
                                    <option value="1">1x Semínima</option>
                                    <option value="2" selected>2x Colcheia (Dedilhado)</option>
                                    <option value="3">3x Tercina</option>
                                    <option value="4">4x Semicolcheia (Pagode)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <button type="button" id="btn-viola-metro-toggle" class="min-h-[44px] px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2">
                                <i data-lucide="play" class="w-4 h-4"></i>
                                <span>Iniciar Metrônomo</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        bindEvents();
    }

    function syncControlValues() {
        document.getElementById('viola-select-instrument').value = state.instrumentId;
        document.getElementById('viola-select-key').value = state.selectedKeyId;
        document.getElementById('viola-select-duad-type').value = state.duadType;
        document.getElementById('viola-select-duad-key').value = state.duadKeyId;
        document.getElementById('viola-metro-sig').value = state.timeSignature;
        document.getElementById('viola-metro-sub').value = String(state.subdivision);

        const handBadge = document.getElementById('viola-hand-badge');
        const handLabel = document.getElementById('label-viola-hand');
        if (state.isLeftHanded) {
            handBadge.textContent = 'Modo Canhoto Ativo (Espelhado)';
            handBadge.className = 'px-2 py-0.5 text-[11px] font-mono rounded bg-amber-500/20 text-amber-300 border border-amber-500/40';
            handLabel.textContent = 'Canhoto (Pestana à Direita)';
        } else {
            handBadge.textContent = 'Modo Destro (Consulta Externa)';
            handBadge.className = 'px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700';
            handLabel.textContent = 'Destro (Pestana à Esquerda)';
        }

        const perspLabel = document.getElementById('label-viola-persp');
        perspLabel.textContent = state.viewPerspective === 'diagram'
            ? 'Diagrama (1º Agudo no Topo)'
            : 'Visão Músico (Grave no Topo)';
    }

    function bindEvents() {
        document.getElementById('viola-select-instrument').addEventListener('change', (e) => {
            stopScalePlayback();
            state.instrumentId = e.target.value;
            state.voicingVariantIdx = 0;
            saveViolaState();
            renderAll();
        });

        document.getElementById('btn-viola-toggle-hand').addEventListener('click', () => {
            state.isLeftHanded = !state.isLeftHanded;
            saveViolaState();
            renderAll();
        });

        document.getElementById('btn-viola-toggle-persp').addEventListener('click', () => {
            state.viewPerspective = state.viewPerspective === 'diagram' ? 'player' : 'diagram';
            saveViolaState();
            renderAll();
        });

        document.getElementById('viola-select-key').addEventListener('change', (e) => {
            stopScalePlayback();
            state.displayMode = 'CHORD';
            state.selectedKeyId = e.target.value;
            state.selectedDegreeIdx = 0;
            state.voicingVariantIdx = 0;
            saveViolaState();
            renderAll();
            strumActiveChord();
        });

        document.getElementById('viola-select-duad-type').addEventListener('change', (e) => {
            stopScalePlayback();
            state.displayMode = 'DUAD';
            state.duadType = e.target.value;
            saveViolaState();
            renderAll();
        });

        document.getElementById('viola-select-duad-key').addEventListener('change', (e) => {
            stopScalePlayback();
            state.displayMode = 'DUAD';
            state.duadKeyId = e.target.value;
            saveViolaState();
            renderAll();
        });

        document.getElementById('btn-viola-play-duads').addEventListener('click', () => {
            renderAll();
            playDuadScale();
        });

        // Metrônomo
        document.getElementById('viola-bpm-slider').addEventListener('input', (e) => {
            state.bpm = Math.max(40, Math.min(220, parseInt(e.target.value, 10) || 92));
            saveViolaState();
            renderMetronomeControls();
        });

        document.querySelectorAll('[data-bpm-delta]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const delta = parseInt(btn.getAttribute('data-bpm-delta'), 10);
                state.bpm = Math.max(40, Math.min(220, state.bpm + delta));
                saveViolaState();
                renderMetronomeControls();
            });
        });

        document.getElementById('btn-viola-tap-tempo').addEventListener('click', () => {
            const now = performance.now();
            tapTimestamps = tapTimestamps.filter((t) => now - t < 3000);
            tapTimestamps.push(now);
            if (tapTimestamps.length >= 2) {
                let sum = 0;
                for (let i = 1; i < tapTimestamps.length; i++) {
                    sum += tapTimestamps[i] - tapTimestamps[i - 1];
                }
                const avgMs = sum / (tapTimestamps.length - 1);
                state.bpm = Math.max(40, Math.min(220, Math.round(60000 / avgMs)));
                saveViolaState();
                renderMetronomeControls();
            }
        });

        document.getElementById('viola-metro-sig').addEventListener('change', (e) => {
            state.timeSignature = e.target.value;
            metroCurrentSubStep = 0;
            saveViolaState();
            renderMetronomeControls();
        });

        document.getElementById('viola-metro-sub').addEventListener('change', (e) => {
            state.subdivision = parseInt(e.target.value, 10) || 2;
            metroCurrentSubStep = 0;
            saveViolaState();
            renderMetronomeControls();
        });

        document.getElementById('btn-viola-metro-toggle').addEventListener('click', toggleMetronome);
    }

    function renderAll() {
        syncControlValues();
        renderFretboardSVG();
        renderHarmonicFieldPanel();
        renderDuadStrip();
        renderMetronomeControls();
    }

    function init() {
        loadViolaState();
        mountShell();
        renderAll();

        window.addEventListener('vault:restored', () => {
            loadViolaState();
            renderAll();
        });
    }

    global.VaultTabViola = { init, renderAll };
})(window);
