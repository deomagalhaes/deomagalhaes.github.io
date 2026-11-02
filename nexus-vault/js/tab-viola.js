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
        // Tonalidades Maiores
        { id: 'E_maj', root: 4, mode: 'major', label: 'Mi Maior (E) — Nativa Cebolão' },
        { id: 'A_maj', root: 9, mode: 'major', label: 'Lá Maior (A)' },
        { id: 'B_maj', root: 11, mode: 'major', label: 'Si Maior (B)' },
        { id: 'D_maj', root: 2, mode: 'major', label: 'Ré Maior (D)' },
        { id: 'G_maj', root: 7, mode: 'major', label: 'Sol Maior (G)' },
        { id: 'C_maj', root: 0, mode: 'major', label: 'Dó Maior (C)' },
        { id: 'F_maj', root: 5, mode: 'major', label: 'Fá Maior (F)' },
        { id: 'Bb_maj', root: 10, mode: 'major', label: 'Si♭ Maior (Bb)' },
        { id: 'Eb_maj', root: 3, mode: 'major', label: 'Mi♭ Maior (Eb)' },
        { id: 'Ab_maj', root: 8, mode: 'major', label: 'Lá♭ Maior (Ab)' },
        { id: 'Db_maj', root: 1, mode: 'major', label: 'Ré♭ / Dó# Maior (Db)' },
        { id: 'F#_maj', root: 6, mode: 'major', label: 'Fá# Maior (F#)' },
        // Tonalidades Menores Clássicas
        { id: 'C#m_min', root: 1, mode: 'minor', label: 'Dó# Menor (C#m) — Relativa de Mi' },
        { id: 'F#m_min', root: 6, mode: 'minor', label: 'Fá# Menor (F#m) — Relativa de Lá' },
        { id: 'G#m_min', root: 8, mode: 'minor', label: 'Sol# Menor (G#m) — Relativa de Si' },
        { id: 'Em_min', root: 4, mode: 'minor', label: 'Mi Menor (Em) — Relativa de Sol' },
        { id: 'Am_min', root: 9, mode: 'minor', label: 'Lá Menor (Am) — Relativa de Dó' },
        { id: 'Bm_min', root: 11, mode: 'minor', label: 'Si Menor (Bm) — Relativa de Ré' },
        { id: 'Dm_min', root: 2, mode: 'minor', label: 'Ré Menor (Dm) — Relativa de Fá' },
        { id: 'Gm_min', root: 7, mode: 'minor', label: 'Sol Menor (Gm) — Relativa de Si♭' },
        { id: 'Cm_min', root: 0, mode: 'minor', label: 'Dó Menor (Cm) — Relativa de Mi♭' }
    ];

    // Shapes curados e verificados acusticamente para Viola Cebolão em Mi (índice 0 = 1º par; -1 = abafada)
    const VIOLA_CHORD_SHAPES = {
        // Tríades Maiores
        'E_maj': [[0, 0, 0, 0, 0], [12, 12, 12, 12, 12], [4, 5, 4, 2, 2]],
        'F_maj': [[1, 1, 1, 1, 1], [5, 6, 5, 3, 3]],
        'F#_maj': [[2, 2, 2, 2, 2], [6, 7, 6, 4, 4]],
        'G_maj': [[3, 3, 3, 3, 3], [3, 0, 3, 3, 0], [7, 8, 7, 5, 5]],
        'G#_maj': [[4, 4, 4, 4, 4], [8, 9, 8, 6, 6]],
        'A_maj': [[0, 2, 1, 0, -1], [5, 5, 5, 5, 5], [9, 10, 9, 7, 7]],
        'A#_maj': [[6, 6, 6, 6, 6], [1, 3, 2, 1, -1]],
        'B_maj': [[2, 4, 3, 2, 0], [7, 7, 7, 7, 7], [11, 12, 11, 9, 9]],
        'C_maj': [[8, 8, 8, 8, 8], [3, 1, 4, 0, 1], [0, 1, 0, 2, 3]],
        'C#_maj': [[9, 9, 9, 9, 9], [4, 2, 5, 1, 2]],
        'D_maj': [[2, 3, 1, -1, 3], [10, 10, 10, 10, 10], [5, 3, 6, 2, 3]],
        'D#_maj': [[11, 11, 11, 11, 11], [6, 4, 7, 3, 4]],

        // Tríades Menores
        'E_min': [[0, 0, -1, 0, 0], [3, 0, -1, 0, 0], [12, 12, 11, 12, 12]],
        'F_min': [[1, 1, 4, 1, 1], [4, 6, 4, 3, 1]],
        'F#_min': [[2, 2, 1, 2, -1], [2, 2, 1, 2, 2], [5, 7, 5, 4, 2]],
        'G_min': [[3, 3, 2, 3, 3], [6, 8, 6, 5, 3]],
        'G#_min': [[4, 4, 3, 4, 0], [4, 4, 3, 4, 4], [7, 9, 7, 6, 4]],
        'A_min': [[0, 1, 1, 0, -1], [5, 5, 4, 5, 5]],
        'A#_min': [[1, 2, 2, 1, -1], [6, 6, 5, 6, 6]],
        'B_min': [[2, 3, 3, 2, 0], [7, 7, 6, 7, 7]],
        'C_min': [[8, 8, 7, 8, 8], [3, 4, 4, 3, 1]],
        'C#_min': [[0, 2, 0, 0, 2], [9, 9, 8, 9, 9], [4, 5, 5, 4, 2]],
        'D_min': [[1, 3, 1, -1, 3], [10, 10, 9, 10, 10], [5, 6, 6, 5, 3]],
        'D#_min': [[2, 4, 2, 1, -1], [11, 11, 10, 11, 11]],

        // Tríades Diminutas
        'D#_dim': [[2, 4, 1, -1, 4], [5, 4, 7, 5, -1]],
        'E_dim': [[3, 5, 2, 0, -1]],
        'F_dim': [[1, 3, 0, 2, -1]],
        'F#_dim': [[2, 1, 1, 2, -1]],
        'G_dim': [[3, 2, 2, 3, -1]],
        'G#_dim': [[4, 3, 3, 4, -1]],
        'A_dim': [[5, 4, 4, 5, -1]],
        'A#_dim': [[0, 2, 2, 2, -1], [6, 5, 5, 6, -1]],
        'B_dim': [[1, 3, 3, -1, 0], [7, 6, 6, 7, -1]],
        'C_dim': [[2, 4, 4, -1, 1]],
        'C#_dim': [[3, 2, 0, 2, 2], [9, 8, 8, 9, -1]],
        'D_dim': [[1, 3, 0, 0, -1]],

        // Tétrades: 7ª Maior (maj7)
        'E_maj7': [[0, 4, 0, 0, 0], [11, 12, 12, 12, 12], [4, 4, 4, 4, 2]],
        'F_maj7': [[0, 1, 1, 1, -1], [1, 1, 1, 2, 1]],
        'F#_maj7': [[1, 2, 2, 2, -1], [2, 6, 2, 2, 2]],
        'G_maj7': [[2, 0, 3, 3, 0], [3, 3, 3, 4, 3]],
        'G#_maj7': [[3, 4, 4, 4, -1], [4, 4, 4, 5, 4]],
        'A_maj7': [[0, 2, 0, 0, -1], [4, 2, 1, 0, -1], [5, 5, 5, 6, 5]],
        'A#_maj7': [[5, 6, 6, 6, -1], [6, 6, 6, 7, 6]],
        'B_maj7': [[2, 4, 2, 2, 0], [6, 4, 3, 2, 0], [7, 7, 7, 8, 7]],
        'C_maj7': [[0, 1, 4, 0, 1], [8, 8, 8, 9, 8]],
        'C#_maj7': [[1, 2, 5, 1, 2], [9, 9, 9, 10, 9]],
        'D_maj7': [[2, 2, 1, -1, 3], [10, 10, 10, 11, 10]],
        'D#_maj7': [[3, 3, 2, -1, 4], [11, 11, 11, 12, 11]],

        // Tétrades: Dominantes (7)
        'E_dom7': [[0, 3, 0, 0, 0], [10, 12, 12, 12, 12], [3, 0, 0, 0, 0]],
        'F_dom7': [[1, 4, 1, 1, 1], [1, 1, 1, 1, 0]],
        'F#_dom7': [[0, 2, 2, 2, -1], [2, 5, 2, 2, 2], [2, 2, 2, 0, 2]],
        'G_dom7': [[1, 0, 3, 3, 0], [3, 6, 3, 3, 3]],
        'G#_dom7': [[2, 4, 4, 4, 4], [4, 7, 4, 4, 4]],
        'A_dom7': [[3, 2, 1, 0, -1], [0, 2, 1, 3, -1], [5, 8, 5, 5, 5]],
        'A#_dom7': [[4, 3, 2, 1, -1], [6, 9, 6, 6, 6]],
        'B_dom7': [[2, 4, 1, 2, 0], [2, 0, 1, 2, 0], [7, 10, 7, 7, 7]],
        'C_dom7': [[3, 1, 2, 0, 1], [8, 11, 8, 8, 8]],
        'C#_dom7': [[4, 2, 3, 1, 2], [9, 12, 9, 9, 9]],
        'D_dom7': [[2, 1, 1, -1, 3], [10, 13, 10, 10, 10]],
        'D#_dom7': [[3, 2, 2, -1, 4], [11, 14, 11, 11, 11]],

        // Tétrades: Menores com 7ª (min7)
        'E_min7': [[0, 3, 11, 0, 0], [10, 12, 11, 12, 12]],
        'F_min7': [[1, 4, 0, 1, 1], [1, 1, 4, 3, 1]],
        'F#_min7': [[0, 2, 1, 2, -1], [2, 2, 1, 0, 2], [5, 5, 5, 4, 2]],
        'G_min7': [[1, 3, 2, 3, 3], [3, 3, 2, 1, 3]],
        'G#_min7': [[2, 4, 3, 4, 0], [4, 4, 3, 2, 0], [7, 7, 7, 6, 4]],
        'A_min7': [[3, 1, 1, 0, -1], [0, 1, 1, 3, -1], [5, 5, 4, 7, 5]],
        'A#_min7': [[4, 2, 2, 1, -1], [6, 6, 5, 8, 6]],
        'B_min7': [[2, 3, 1, 2, 0], [2, 0, 3, 0, 0], [7, 7, 6, 9, 7]],
        'C_min7': [[3, 4, 2, 3, 1], [8, 8, 7, 10, 8]],
        'C#_min7': [[0, 0, 0, 0, 2], [0, 2, 0, 0, 0], [4, 5, 4, 2, 2]],
        'D_min7': [[1, 1, 1, -1, 3], [10, 10, 9, 12, 10]],
        'D#_min7': [[2, 2, 2, -1, 4], [11, 11, 10, 13, 11]],

        // Tétrades: Meio-Diminutas (m7b5)
        'D#_m7b5': [[2, 2, 1, 1, -1], [2, 2, 1, -1, 4], [5, 4, 5, 3, -1]],
        'E_m7b5': [[3, 3, 2, 2, -1], [3, 5, 2, 0, -1]],
        'F_m7b5': [[4, 4, 3, 3, -1]],
        'F#_m7b5': [[2, 1, 1, 2, -1], [5, 5, 4, 4, -1]],
        'G_m7b5': [[3, 2, 2, 3, -1], [6, 6, 5, 5, -1]],
        'G#_m7b5': [[4, 3, 3, 4, -1], [7, 7, 6, 6, -1]],
        'A_m7b5': [[5, 4, 4, 5, -1], [8, 8, 7, 7, -1]],
        'A#_m7b5': [[0, 2, 0, 2, -1], [6, 5, 5, 6, -1]],
        'B_m7b5': [[1, 3, 1, -1, 0], [7, 6, 6, 7, -1]],
        'C_m7b5': [[2, 4, 2, -1, 1], [8, 7, 7, 8, -1]],
        'C#_m7b5': [[0, 2, 0, 3, 2], [3, 2, 0, 2, 2], [9, 8, 8, 9, -1]],
        'D_m7b5': [[1, 3, 1, 0, -1], [10, 9, 9, 10, -1]]
    };

    // Shapes curados para Violão Padrão 6 Cordas (índice 0 = 1ª corda/Mi aguda; -1 = abafada)
    const VIOLAO_CHORD_SHAPES = {
        // Tríades Maiores
        'E_maj': [[0, 0, 1, 2, 2, 0], [4, 5, 4, 2, -1, -1], [7, 9, 9, 9, 7, -1]],
        'F_maj': [[1, 1, 2, 3, 3, 1], [5, 6, 5, 3, -1, -1], [8, 10, 10, 10, 8, -1]],
        'F#_maj': [[2, 2, 3, 4, 4, 2], [9, 11, 11, 11, 9, -1]],
        'G_maj': [[3, 0, 0, 0, 2, 3], [3, 3, 4, 5, 5, 3], [7, 8, 7, 5, -1, -1], [10, 12, 12, 12, 10, -1]],
        'G#_maj': [[4, 4, 5, 6, 6, 4], [11, 13, 13, 13, 11, -1]],
        'A_maj': [[0, 2, 2, 2, 0, -1], [5, 5, 6, 7, 7, 5], [9, 10, 9, 7, -1, -1]],
        'A#_maj': [[1, 3, 3, 3, 1, -1], [6, 6, 7, 8, 8, 6]],
        'B_maj': [[2, 4, 4, 4, 2, -1], [7, 7, 8, 9, 9, 7]],
        'C_maj': [[0, 1, 0, 2, 3, -1], [3, 5, 5, 5, 3, -1], [8, 8, 9, 10, 10, 8]],
        'C#_maj': [[4, 6, 6, 6, 4, -1], [9, 9, 10, 11, 11, 9]],
        'D_maj': [[2, 3, 2, 0, -1, -1], [5, 7, 7, 7, 5, -1], [10, 10, 11, 12, 12, 10]],
        'D#_maj': [[6, 8, 8, 8, 6, -1], [11, 11, 12, 13, 13, 11]],

        // Tríades Menores
        'E_min': [[0, 0, 0, 2, 2, 0], [7, 8, 9, 9, 7, -1]],
        'F_min': [[1, 1, 1, 3, 3, 1], [8, 9, 10, 10, 8, -1]],
        'F#_min': [[2, 2, 2, 4, 4, 2], [9, 10, 11, 11, 9, -1]],
        'G_min': [[3, 3, 3, 5, 5, 3], [10, 11, 12, 12, 10, -1]],
        'G#_min': [[4, 4, 4, 6, 6, 4], [11, 12, 13, 13, 11, -1]],
        'A_min': [[0, 1, 2, 2, 0, -1], [5, 5, 5, 7, 7, 5]],
        'A#_min': [[1, 2, 3, 3, 1, -1], [6, 6, 6, 8, 8, 6]],
        'B_min': [[2, 3, 4, 4, 2, -1], [7, 7, 7, 9, 9, 7]],
        'C_min': [[3, 4, 5, 5, 3, -1], [8, 8, 8, 10, 10, 8]],
        'C#_min': [[4, 5, 6, 6, 4, -1], [9, 9, 9, 11, 11, 9]],
        'D_min': [[1, 3, 2, 0, -1, -1], [5, 6, 7, 7, 5, -1], [10, 10, 10, 12, 12, 10]],
        'D#_min': [[6, 7, 8, 8, 6, -1], [11, 11, 11, 13, 13, 11]],

        // Tríades Diminutas
        'D#_dim': [[2, 4, 2, 1, -1, -1]],
        'E_dim': [[0, 2, 0, 2, 1, -1]],
        'F_dim': [[1, 3, 1, 3, 2, -1]],
        'F#_dim': [[2, 1, 2, 4, -1, -1]],
        'G_dim': [[3, 2, 3, 5, -1, -1]],
        'G#_dim': [[4, 3, 4, 6, -1, -1]],
        'A_dim': [[5, 4, 5, 7, -1, -1]],
        'A#_dim': [[0, 2, 3, 2, 1, -1]],
        'B_dim': [[1, 3, 4, 3, 2, -1]],
        'C_dim': [[2, 4, 5, 4, 3, -1]],
        'C#_dim': [[0, 2, 0, 2, 4, -1]],
        'D_dim': [[1, 3, 1, 0, -1, -1]],

        // Tétrades: 7ª Maior (maj7)
        'E_maj7': [[0, 0, 1, 1, 2, 0], [7, 9, 8, 9, 7, -1]],
        'F_maj7': [[0, 1, 2, 2, -1, 1], [8, 10, 9, 10, 8, -1]],
        'F#_maj7': [[2, 2, 3, 3, -1, 2], [9, 11, 10, 11, 9, -1]],
        'G_maj7': [[2, 0, 0, 0, 2, 3], [10, 12, 11, 12, 10, -1]],
        'G#_maj7': [[4, 4, 5, 5, -1, 4], [11, 13, 12, 13, 11, -1]],
        'A_maj7': [[0, 2, 1, 2, 0, -1], [5, 5, 6, 6, -1, 5]],
        'A#_maj7': [[1, 3, 2, 3, 1, -1], [6, 6, 7, 7, -1, 6]],
        'B_maj7': [[2, 4, 3, 4, 2, -1], [7, 7, 8, 8, -1, 7]],
        'C_maj7': [[0, 0, 0, 2, 3, -1], [3, 5, 4, 5, 3, -1], [8, 8, 9, 9, -1, 8]],
        'C#_maj7': [[4, 6, 5, 6, 4, -1], [9, 9, 10, 10, -1, 9]],
        'D_maj7': [[2, 2, 2, 0, -1, -1], [5, 7, 6, 7, 5, -1], [10, 10, 11, 11, -1, 10]],
        'D#_maj7': [[6, 8, 7, 8, 6, -1], [11, 11, 12, 12, -1, 11]],

        // Tétrades: Dominantes (7)
        'E_dom7': [[0, 3, 1, 0, 2, 0], [0, 0, 1, 0, 2, 0], [7, 9, 7, 9, 7, -1]],
        'F_dom7': [[1, 4, 2, 1, 3, 1], [1, 1, 2, 1, 3, 1], [8, 10, 8, 10, 8, -1]],
        'F#_dom7': [[2, 2, 3, 2, 4, 2], [2, 5, 3, 2, 4, 2], [9, 11, 9, 11, 9, -1]],
        'G_dom7': [[1, 0, 0, 0, 2, 3], [3, 3, 4, 3, 5, 3], [10, 12, 10, 12, 10, -1]],
        'G#_dom7': [[4, 4, 5, 4, 6, 4], [11, 13, 11, 13, 11, -1]],
        'A_dom7': [[0, 2, 0, 2, 0, -1], [3, 2, 2, 2, 0, -1], [5, 5, 6, 5, 7, 5]],
        'A#_dom7': [[1, 3, 1, 3, 1, -1], [6, 6, 7, 6, 8, 6]],
        'B_dom7': [[2, 0, 2, 1, 2, -1], [2, 4, 2, 4, 2, -1], [7, 7, 8, 7, 9, 7]],
        'C_dom7': [[0, 1, 3, 2, 3, -1], [3, 5, 3, 5, 3, -1], [8, 8, 9, 8, 10, 8]],
        'C#_dom7': [[4, 6, 4, 6, 4, -1], [9, 9, 10, 9, 11, 9]],
        'D_dom7': [[2, 1, 2, 0, -1, -1], [5, 7, 5, 7, 5, -1], [10, 10, 11, 10, 12, 10]],
        'D#_dom7': [[6, 8, 6, 8, 6, -1], [11, 11, 12, 11, 13, 11]],

        // Tétrades: Menores com 7ª (min7)
        'E_min7': [[0, 3, 0, 0, 2, 0], [0, 0, 0, 0, 2, 0], [7, 8, 7, 9, 7, -1]],
        'F_min7': [[1, 1, 1, 1, 3, 1], [8, 9, 8, 10, 8, -1]],
        'F#_min7': [[2, 2, 2, 2, 4, 2], [9, 10, 9, 11, 9, -1]],
        'G_min7': [[3, 3, 3, 3, 5, 3], [10, 11, 10, 12, 10, -1]],
        'G#_min7': [[4, 4, 4, 4, 6, 4], [11, 12, 11, 13, 11, -1]],
        'A_min7': [[0, 1, 0, 2, 0, -1], [3, 1, 2, 2, 0, -1], [5, 5, 5, 5, 7, 5]],
        'A#_min7': [[1, 2, 1, 3, 1, -1], [6, 6, 6, 6, 8, 6]],
        'B_min7': [[2, 0, 2, 0, 2, -1], [2, 3, 2, 4, 2, -1], [7, 7, 7, 7, 9, 7]],
        'C_min7': [[3, 4, 3, 5, 3, -1], [8, 8, 8, 8, 10, 8]],
        'C#_min7': [[4, 5, 4, 6, 4, -1], [9, 9, 9, 9, 11, 9]],
        'D_min7': [[1, 1, 2, 0, -1, -1], [5, 6, 5, 7, 5, -1], [10, 10, 10, 10, 12, 10]],
        'D#_min7': [[6, 7, 6, 8, 6, -1], [11, 11, 11, 11, 13, 11]],

        // Tétrades: Meio-Diminutas (m7b5)
        'D#_m7b5': [[2, 2, 2, 1, -1, -1], [5, 7, 6, 7, 6, -1], [11, 10, 11, 11, -1, 11]],
        'E_m7b5': [[0, 3, 3, 2, -1, 0], [6, 8, 7, 8, 7, -1]],
        'F_m7b5': [[1, 0, 1, 1, -1, 1], [7, 9, 8, 9, 8, -1]],
        'F#_m7b5': [[2, 1, 2, 2, -1, 2], [0, 1, 2, 2, -1, 2]],
        'G_m7b5': [[3, 2, 3, 3, -1, 3]],
        'G#_m7b5': [[4, 3, 4, 4, -1, 4]],
        'A_m7b5': [[5, 4, 5, 5, -1, 5], [0, 1, 0, 1, 0, -1]],
        'A#_m7b5': [[0, 2, 1, 2, 1, -1], [6, 5, 6, 6, -1, 6]],
        'B_m7b5': [[1, 3, 2, 3, 2, -1], [1, 0, 2, 0, 2, -1], [7, 6, 7, 7, -1, 7]],
        'C_m7b5': [[2, 4, 3, 4, 3, -1], [8, 7, 8, 8, -1, 8]],
        'C#_m7b5': [[0, 2, 0, 2, 4, -1], [3, 5, 4, 5, 4, -1], [9, 8, 9, 9, -1, 9]],
        'D_m7b5': [[1, 1, 1, 0, -1, -1], [4, 6, 5, 6, 5, -1], [10, 9, 10, 10, -1, 10]]
    };

    let state = {
        instrumentId: 'viola_cebolao_e',
        isLeftHanded: true,          // Padrão: Canhoto (Pestana à direita, corpo à esquerda)
        viewPerspective: 'diagram',  // 'diagram' (1º par no topo) | 'player' (5º/6º grave no topo)
        displayMode: 'CHORD',        // 'CHORD' | 'DUAD' | 'FREE'
        harmonicExtension: 'triad',  // 'triad' (Tríades) | 'tetrad' (Tétrades com 7ª)
        selectedKeyId: 'E_maj',
        selectedDegreeIdx: 0,
        voicingVariantIdx: 0,
        duadType: 'SIXTHS_1_3',      // 'THIRDS_1_2' | 'THIRDS_2_3' | 'THIRDS_3_4' | 'SIXTHS_1_3' | 'SIXTHS_2_4'
        duadKeyId: 'E_maj',
        activeDuadStepIdx: -1,       // -1 = mostra escala toda; 0..7 = destaca grau em reprodução
        progressionId: 'cururu_moda', // Cadência ativa do módulo de progressões
        progressionPlaying: false,
        progressionStepIdx: -1,
        progressionLoop: true,
        progressionBeatsPerChord: 4,  // 2 | 4 | 8 tempos por acorde
        bpm: 92,
        timeSignature: '2/4',        // '2/4' | '3/4' | '4/4' | '6/8'
        subdivision: 2,              // 1 | 2 | 3 | 4
        metroMode: 'rhythm',         // 'rhythm' (Ritmo Caipira & Repique) | 'click' (Metrônomo Analítico)
        activeRhythmId: 'cururu',    // 'cururu' | 'pagode' | 'caterete' | 'guarania' | 'toada' | 'querencia'
        rhythmBoxVolume: 0.85,       // Volume da percussão de tampo/caixa (0.0 a 1.0)
        rhythmGuideClick: false,     // Tocar clique do metrônomo simultaneamente
        rhythmChordSync: true,       // Harmonizar bordão e rasqueado com o acorde ativo do campo harmônico
        activeRhythmStepIdx: -1      // Passo ativo da levada para feedback visual sincronizado
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
    let progressionTimerId = null;

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
        const isTetrad = state.harmonicExtension === 'tetrad';

        const qualities = isMajor
            ? (isTetrad 
                ? ['maj7', 'min7', 'min7', 'maj7', 'dom7', 'min7', 'm7b5']
                : ['maj', 'min', 'min', 'maj', 'maj', 'min', 'dim'])
            : (isTetrad
                ? ['min7', 'm7b5', 'maj7', 'min7', 'min7', 'maj7', 'dom7']
                : ['min', 'dim', 'maj', 'min', 'min', 'maj', 'maj']);

        const romans = isMajor
            ? (isTetrad
                ? ['I7M', 'ii7', 'iii7', 'IV7M', 'V7', 'vi7', 'viiø']
                : ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'])
            : (isTetrad
                ? ['i7', 'iiø', 'III7M', 'iv7', 'v7', 'VI7M', 'VII7']
                : ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']);

        return steps.map((semi, idx) => {
            const rootPc = (keyObj.root + semi) % 12;
            const qual = qualities[idx];
            const rootStr = NOTE_NAMES[rootPc];
            let suffix = '';
            let chordNamePT = '';
            let chordIntervals = [0, 4, 7];

            if (qual === 'maj') {
                suffix = '';
                chordNamePT = `${NOTE_NAMES_PT[rootPc]} Maior`;
                chordIntervals = [0, 4, 7];
            } else if (qual === 'min') {
                suffix = 'm';
                chordNamePT = `${NOTE_NAMES_PT[rootPc]} menor`;
                chordIntervals = [0, 3, 7];
            } else if (qual === 'dim') {
                suffix = '°';
                chordNamePT = `${NOTE_NAMES_PT[rootPc]} diminuto`;
                chordIntervals = [0, 3, 6];
            } else if (qual === 'maj7') {
                suffix = '7M';
                chordNamePT = `${NOTE_NAMES_PT[rootPc]} com 7ª Maior`;
                chordIntervals = [0, 4, 7, 11];
            } else if (qual === 'min7') {
                suffix = 'm7';
                chordNamePT = `${NOTE_NAMES_PT[rootPc]} menor com 7ª`;
                chordIntervals = [0, 3, 7, 10];
            } else if (qual === 'dom7') {
                suffix = '7';
                chordNamePT = `${NOTE_NAMES_PT[rootPc]} com 7ª dominante`;
                chordIntervals = [0, 4, 7, 10];
            } else if (qual === 'm7b5') {
                suffix = 'm7(♭5)';
                chordNamePT = `${NOTE_NAMES_PT[rootPc]} meio-diminuto`;
                chordIntervals = [0, 3, 6, 10];
            }

            const pitchClasses = chordIntervals.map((iv) => (rootPc + iv) % 12);

            return {
                degreeIndex: idx,
                roman: romans[idx],
                chordCode: `${rootStr}_${qual}`,
                chordName: `${rootStr}${suffix}`,
                chordNamePT,
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
        if (rel === 6) return '5b';
        if (rel === 7) return '5J';
        if (rel === 10) return '7m';
        if (rel === 11) return '7M';
        if (rel === 9 && chordObj.quality === 'dim') return '7d';
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
    // MOTOR DE ESTUDOS DE PROGRESSÃO HARMÔNICA & CADÊNCIAS
    // =========================================================================
    const HARMONIC_PROGRESSIONS = [
        {
            id: 'cururu_moda',
            title: 'Moda & Cururu Tradicional (I – IV – V7 – I)',
            style: 'Cururu / Moda Caipira',
            desc: 'Cadência basilar da música de raiz paulista e mineira. Tônica (repouso no 1º grau), Subdominante (afastamento no 4º grau), Dominante com 7ª (tensão máxima no 5º grau) e Resolução.',
            degrees: [0, 3, 4, 0],
            useTetrads: [false, false, true, false],
            functions: ['Tônica (Repouso)', 'Subdominante (Afastamento)', 'Dominante (Tensão)', 'Tônica (Resolução)']
        },
        {
            id: 'toada_amor',
            title: 'Toada Sentimental (I – V7 – IV – I)',
            style: 'Toada / Guarânia Lenta',
            desc: 'Movimento com cadência plagal final (IV – I), criando atmosfera nostálgica e doce típica das toadas líricas e guarânias.',
            degrees: [0, 4, 3, 0],
            useTetrads: [false, true, false, false],
            functions: ['Tônica', 'Dominante com 7ª', 'Subdominante Plagal', 'Tônica']
        },
        {
            id: 'turnaround_caipira',
            title: 'Turnaround / Lamento Caipira (I – vi – ii – V7)',
            style: 'Chora Viola / Canção Caipira',
            desc: 'Círculo harmônico com passagem pela relativa menor (vi) e segundo grau menor (ii). Gera condução fluida e sofisticada para introduções e pontes.',
            degrees: [0, 5, 1, 4],
            useTetrads: [true, true, true, true],
            functions: ['Tônica (I7M)', 'Relativa Menor (vi7)', 'Superfônica (ii7)', 'Dominante (V7)']
        },
        {
            id: 'moda_menor',
            title: 'Moda em Tom Menor (i – iv – V7 – i)',
            style: 'Violeiro Triste / Tom Menor',
            desc: 'Cadência dramática em tonalidade menor. No Cebolão em Mi, explora a força do acorde dominante com 7ª preparando o retorno à tônica menor.',
            degrees: [0, 3, 4, 0],
            forceMinor: true,
            useTetrads: [false, false, true, false],
            functions: ['Tônica Menor (i)', 'Subdominante Menor (iv)', 'Dominante com 7ª (V7)', 'Tônica Menor (i)']
        },
        {
            id: 'pop_sertanejo',
            title: 'Quatro Acordes Mágicos (I – V – vi – IV)',
            style: 'Sertanejo Romântico & Pop',
            desc: 'A progressão mais utilizada no cancioneiro popular. Combina a luminosidade do I e V com a introspecção do vi e a abertura do IV.',
            degrees: [0, 4, 5, 3],
            useTetrads: [false, false, false, false],
            functions: ['Tônica', 'Dominante', 'Relativa Menor', 'Subdominante']
        },
        {
            id: 'ii_v_i_jazz',
            title: 'Cadência II – V – I com Tétrades (ii7 – V7 – I7M)',
            style: 'Harmonia Funcional Avançada',
            desc: 'O ápice da harmonia funcional. Segundo grau menor com sétima, dominante com trítono e resolução suave na tônica com sétima maior.',
            degrees: [1, 4, 0],
            useTetrads: [true, true, true],
            functions: ['Subdominante (ii7)', 'Dominante (V7)', 'Tônica Nobre (I7M)']
        },
        {
            id: 'ponteado_ascendente',
            title: 'Ponteio Diatônico Ascendente (I – ii – iii – IV – V)',
            style: 'Ponteio Escalado / Repique',
            desc: 'Caminhada diatônica em graus conjuntos ascendentes pelo braço da viola, muito empregada em aberturas de pagode e repiques caipiras.',
            degrees: [0, 1, 2, 3, 4],
            useTetrads: [false, false, false, false, true],
            functions: ['Tônica (I)', 'Grau II (ii)', 'Grau III (iii)', 'Grau IV (IV)', 'Grau V (V7)']
        }
    ];

    function stopProgressionPlayback() {
        if (progressionTimerId) {
            clearTimeout(progressionTimerId);
            progressionTimerId = null;
        }
        state.progressionPlaying = false;
        state.progressionStepIdx = -1;
        updateProgressionUIState();
    }

    function playProgression() {
        if (state.progressionPlaying) {
            stopProgressionPlayback();
            return;
        }
        stopScalePlayback();
        stopPonteioPlayback();
        stopTunerTone();

        state.progressionPlaying = true;
        state.progressionStepIdx = 0;
        executeProgressionStep();
    }

    function executeProgressionStep() {
        if (!state.progressionPlaying) return;
        const prog = HARMONIC_PROGRESSIONS.find((p) => p.id === state.progressionId) || HARMONIC_PROGRESSIONS[0];
        const numSteps = prog.degrees.length;

        if (state.progressionStepIdx >= numSteps) {
            if (state.progressionLoop) {
                state.progressionStepIdx = 0;
            } else {
                stopProgressionPlayback();
                return;
            }
        }

        const stepIdx = state.progressionStepIdx;
        const degIdx = prog.degrees[stepIdx];
        const wantTetrad = prog.useTetrads[stepIdx];

        let keyId = state.selectedKeyId;
        if (prog.forceMinor) {
            const currKey = HARMONIC_KEYS.find((k) => k.id === keyId);
            if (currKey && currKey.mode !== 'minor') {
                const relMinor = HARMONIC_KEYS.find((k) => k.mode === 'minor' && (k.root === (currKey.root + 9) % 12));
                keyId = relMinor ? relMinor.id : 'C#m_min';
            }
        }

        const prevExt = state.harmonicExtension;
        state.harmonicExtension = wantTetrad ? 'tetrad' : 'triad';
        const field = getHarmonicField(keyId);
        state.harmonicExtension = prevExt;

        const chordObj = field[degIdx] || field[0];
        state.displayMode = 'CHORD';
        state.selectedDegreeIdx = degIdx;
        state.voicingVariantIdx = 0;

        renderFretboardSVG();
        updateProgressionUIState();

        const voicings = getChordVoicings(chordObj);
        const shape = voicings[0] || [0, 0, 0, 0, 0];
        const inst = INSTRUMENTS[state.instrumentId];
        let noteStep = 0;
        for (let cIdx = inst.courses.length - 1; cIdx >= 0; cIdx--) {
            const fret = shape[cIdx];
            if (fret >= 0) {
                playCourseAtFret(cIdx, fret, noteStep * 0.045);
                flashFretCell(cIdx, fret, noteStep * 45);
                noteStep++;
            }
        }

        const beatSec = 60 / Math.max(40, state.bpm);
        const chordDurationSec = beatSec * state.progressionBeatsPerChord;

        state.progressionStepIdx++;
        progressionTimerId = setTimeout(executeProgressionStep, Math.max(1000, chordDurationSec * 1000));
    }

    function updateProgressionUIState() {
        const playBtn = document.getElementById('btn-viola-play-progression');
        if (playBtn) {
            playBtn.innerHTML = state.progressionPlaying
                ? `<i data-lucide="square" class="w-4 h-4 text-rose-300"></i><span>Pausar Estudo</span>`
                : `<i data-lucide="play" class="w-4 h-4 text-slate-950"></i><span>Tocar Estudo da Progressão</span>`;
            playBtn.className = state.progressionPlaying
                ? 'min-h-[40px] px-4 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-200 font-bold text-xs flex items-center gap-2 transition'
                : 'min-h-[40px] px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition';
            if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
        }

        const loopBtn = document.getElementById('btn-viola-loop-progression');
        if (loopBtn) {
            loopBtn.className = state.progressionLoop
                ? 'min-h-[40px] px-3 py-1.5 rounded-lg bg-cyan-600/20 border border-cyan-400 text-cyan-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition'
                : 'min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 text-xs font-mono flex items-center gap-1.5 transition';
        }

        const ruler = document.getElementById('viola-progression-ruler');
        if (ruler) {
            const activeStep = state.progressionPlaying ? state.progressionStepIdx - 1 : -1;
            ruler.querySelectorAll('[data-prog-card-idx]').forEach((card) => {
                const cIdx = parseInt(card.getAttribute('data-prog-card-idx'), 10);
                if (cIdx === activeStep) {
                    card.classList.add('ring-2', 'ring-emerald-400', 'bg-emerald-500/20', 'border-emerald-400', 'shadow-lg');
                    card.classList.remove('bg-[#090d16]', 'border-slate-800');
                } else {
                    card.classList.remove('ring-2', 'ring-emerald-400', 'bg-emerald-500/20', 'border-emerald-400', 'shadow-lg');
                    card.classList.add('bg-[#090d16]', 'border-slate-800');
                }
            });
        }
    }

    function renderProgressionStudyPanel() {
        const container = document.getElementById('viola-progression-container');
        if (!container) return;

        const prog = HARMONIC_PROGRESSIONS.find((p) => p.id === state.progressionId) || HARMONIC_PROGRESSIONS[0];
        let keyId = state.selectedKeyId;
        if (prog.forceMinor) {
            const currKey = HARMONIC_KEYS.find((k) => k.id === keyId);
            if (currKey && currKey.mode !== 'minor') {
                const relMinor = HARMONIC_KEYS.find((k) => k.mode === 'minor' && (k.root === (currKey.root + 9) % 12));
                keyId = relMinor ? relMinor.id : 'C#m_min';
            }
        }
        const activeKeyObj = HARMONIC_KEYS.find((k) => k.id === keyId) || HARMONIC_KEYS[0];

        const chordsData = prog.degrees.map((degIdx, stepIdx) => {
            const wantTetrad = prog.useTetrads[stepIdx];
            const prevExt = state.harmonicExtension;
            state.harmonicExtension = wantTetrad ? 'tetrad' : 'triad';
            const field = getHarmonicField(keyId);
            state.harmonicExtension = prevExt;

            const chordObj = field[degIdx] || field[0];
            const voicings = getChordVoicings(chordObj);
            const activeShape = voicings[0] || [0, 0, 0, 0, 0];
            const shapeTxt = activeShape.map((f) => (f < 0 ? 'X' : f)).slice().reverse().join(' - ');

            return {
                stepIdx,
                barNum: stepIdx + 1,
                chordObj,
                shapeTxt,
                functionName: prog.functions[stepIdx] || ''
            };
        });

        container.innerHTML = `
            <div class="bg-[#090d16] border border-slate-800/80 rounded-xl p-3.5 space-y-3">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                                ${prog.style}
                            </span>
                            <span class="text-xs font-mono text-slate-400">Tonalidade de Estudo: <strong class="text-emerald-300">${activeKeyObj.label}</strong></span>
                        </div>
                        <h4 class="text-base font-bold text-slate-100 mt-1">${prog.title}</h4>
                        <p class="text-xs text-slate-400 mt-0.5 leading-relaxed">${prog.desc}</p>
                    </div>
                </div>

                <div id="viola-progression-ruler" class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    ${chordsData.map((item) => `
                        <div data-prog-card-idx="${item.stepIdx}"
                            class="bg-[#090d16] border border-slate-800 hover:border-emerald-500/40 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition group">
                            <div class="space-y-1">
                                <div class="flex items-center justify-between text-[10px] font-mono text-slate-500">
                                    <span>Compasso ${item.barNum}</span>
                                    <span class="text-emerald-400 font-semibold">${item.chordObj.roman}</span>
                                </div>
                                <div class="text-base sm:text-lg font-bold font-mono text-slate-100 group-hover:text-emerald-300 transition">
                                    ${item.chordObj.chordName}
                                </div>
                                <div class="text-[11px] font-mono text-cyan-300">
                                    ${item.chordObj.pitchClasses.map((p) => NOTE_NAMES[p]).join('·')}
                                </div>
                            </div>
                            <div class="pt-2 mt-2 border-t border-slate-800/80 space-y-1 text-[10px] font-mono">
                                <div class="text-slate-400 truncate">${item.functionName}</div>
                                <div class="text-amber-300/90 font-mono text-[10px]">Casas: ${item.shapeTxt}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        container.querySelectorAll('[data-prog-card-idx]').forEach((card) => {
            card.addEventListener('click', () => {
                stopProgressionPlayback();
                const stepIdx = parseInt(card.getAttribute('data-prog-card-idx'), 10);
                const stepData = chordsData[stepIdx];
                if (!stepData) return;

                state.displayMode = 'CHORD';
                state.selectedDegreeIdx = stepData.chordObj.degreeIndex;
                state.voicingVariantIdx = 0;
                renderFretboardSVG();
                saveViolaState();

                const voicings = getChordVoicings(stepData.chordObj);
                const shape = voicings[0] || [0, 0, 0, 0, 0];
                const inst = INSTRUMENTS[state.instrumentId];
                let noteStep = 0;
                for (let cIdx = inst.courses.length - 1; cIdx >= 0; cIdx--) {
                    const fret = shape[cIdx];
                    if (fret >= 0) {
                        playCourseAtFret(cIdx, fret, noteStep * 0.045);
                        flashFretCell(cIdx, fret, noteStep * 45);
                        noteStep++;
                    }
                }
            });
        });

        updateProgressionUIState();
    }

    // =========================================================================
    // BIBLIOTECA DE PONTEIOS & REPERTÓRIO CLÁSSICO DE VIOLA CAIPIRA
    // =========================================================================
    const PONTEIOS_REPERTOIRE = [
        {
            id: 'pagode_brasilia',
            title: 'Pagode em Brasília',
            author: 'Tião Carreiro & Lourival dos Santos',
            rhythm: 'Pagode Caipira (2/4 sincopado)',
            key: 'Mi Maior (E) Cebolão',
            desc: 'O mais célebre ponteio da viola brasileira. Introdução com repiques clássicos nos pares 1 e 2 descendo em cascata.',
            notes: [
                { c: 0, f: 0, d: 0.16 },
                { c: 1, f: 2, d: 0.16 },
                { c: 0, f: 4, d: 0.20 },
                { c: 0, f: 2, d: 0.16 },
                { c: 0, f: 0, d: 0.22 },
                { c: 1, f: 0, d: 0.16 },
                { c: 2, f: 1, d: 0.20 },
                { c: 3, f: 2, d: 0.26 },
                { c: 4, f: 2, d: 0.26 },
                { c: 0, f: 0, d: 0.45 }
            ]
        },
        {
            id: 'menino_porteira',
            title: 'O Menino da Porteira',
            author: 'Teddy Vieira & Luizinho',
            rhythm: 'Cururu / Toada em Mi Maior',
            key: 'Mi Maior (E) Cebolão',
            desc: 'Dueto lírico nas sextas clássicas (Pares 1 e 3), evocando o som das comitivas no estradão de Ouro Fino.',
            notes: [
                { c: 0, f: 0, d: 0.25 },
                { c: 2, f: 1, d: 0.25 },
                { c: 0, f: 2, d: 0.25 },
                { c: 2, f: 3, d: 0.25 },
                { c: 0, f: 4, d: 0.32 },
                { c: 2, f: 5, d: 0.32 },
                { c: 0, f: 2, d: 0.25 },
                { c: 2, f: 3, d: 0.25 },
                { c: 0, f: 0, d: 0.50 }
            ]
        },
        {
            id: 'tristeza_jeca',
            title: 'Tristeza do Jeca',
            author: 'Angelino de Oliveira',
            rhythm: 'Toada Lenta e Sentida',
            key: 'Mi Maior (E) Cebolão',
            desc: 'Exploração da ressonância de cordas soltas com terças e quintas abertas que soam como sinos sertanejos.',
            notes: [
                { c: 1, f: 0, d: 0.30 },
                { c: 0, f: 0, d: 0.30 },
                { c: 0, f: 2, d: 0.30 },
                { c: 0, f: 4, d: 0.45 },
                { c: 0, f: 2, d: 0.30 },
                { c: 0, f: 0, d: 0.30 },
                { c: 1, f: 2, d: 0.30 },
                { c: 0, f: 0, d: 0.55 }
            ]
        },
        {
            id: 'luar_sertao',
            title: 'Luar do Sertão',
            author: 'Catulo da Paixão Cearense / João Pernambuco',
            rhythm: 'Valsa / Toada Poética',
            key: 'Mi Maior (E) Cebolão',
            desc: 'Poesia da serra brasileira. Melodia lírica com sustentação harmônica limpa nos pares graves.',
            notes: [
                { c: 0, f: 4, d: 0.38 },
                { c: 0, f: 2, d: 0.38 },
                { c: 0, f: 0, d: 0.42 },
                { c: 1, f: 0, d: 0.32 },
                { c: 0, f: 0, d: 0.32 },
                { c: 0, f: 2, d: 0.42 },
                { c: 0, f: 0, d: 0.65 }
            ]
        }
    ];

    let activePonteioTimers = [];

    function stopPonteioPlayback() {
        activePonteioTimers.forEach((t) => clearTimeout(t));
        activePonteioTimers = [];
    }

    function playPonteioSequence(ponteioId) {
        stopScalePlayback();
        stopPonteioPlayback();
        stopProgressionPlayback();
        stopTunerTone();
        const pt = PONTEIOS_REPERTOIRE.find((p) => p.id === ponteioId);
        if (!pt) return;

        let cumSec = 0;
        pt.notes.forEach((nt) => {
            const tId = setTimeout(() => {
                playCourseAtFret(nt.c, nt.f, 0);
                flashFretCell(nt.c, nt.f, 0);
            }, cumSec * 1000);
            activePonteioTimers.push(tId);
            cumSec += nt.d;
        });
    }

    // =========================================================================
    // AFINADOR ACÚSTICO DE PRECISÃO (PITCH REFERENCE POR CORDA / PAR)
    // =========================================================================
    let tunerOsc = null;
    let tunerGain = null;
    let activeTunerCourse = null;

    function stopTunerTone() {
        if (tunerGain && audioCtx) {
            try {
                tunerGain.gain.setValueAtTime(tunerGain.gain.value, audioCtx.currentTime);
                tunerGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);
                setTimeout(() => {
                    if (tunerOsc) {
                        try { tunerOsc.stop(); } catch (_) {}
                        tunerOsc = null;
                    }
                    tunerGain = null;
                }, 130);
            } catch (_) {}
        }
        activeTunerCourse = null;
        renderTunerButtons();
    }

    function toggleTunerTone(courseIdx) {
        if (activeTunerCourse === courseIdx) {
            stopTunerTone();
            return;
        }
        stopTunerTone();
        stopPonteioPlayback();
        stopScalePlayback();
        stopProgressionPlayback();

        const inst = INSTRUMENTS[state.instrumentId];
        const course = inst.courses[courseIdx];
        if (!course) return;

        const ctx = ensureAudioContext();
        if (!ctx) return;

        const baseMidi = course.midi[0];
        const freq = midiToFreq(baseMidi);
        const now = ctx.currentTime;

        tunerOsc = ctx.createOscillator();
        tunerGain = ctx.createGain();

        tunerOsc.type = 'triangle';
        tunerOsc.frequency.setValueAtTime(freq, now);

        tunerGain.gain.setValueAtTime(0.0001, now);
        tunerGain.gain.linearRampToValueAtTime(0.24, now + 0.08);

        tunerOsc.connect(tunerGain);
        tunerGain.connect(ctx.destination);
        tunerOsc.start(now);

        activeTunerCourse = courseIdx;
        renderTunerButtons();
        flashFretCell(courseIdx, 0, 0);
    }

    function renderTunerButtons() {
        const wrap = document.getElementById('viola-tuner-buttons');
        if (!wrap) return;

        const inst = INSTRUMENTS[state.instrumentId];
        wrap.innerHTML = inst.courses.map((c, idx) => {
            const isRinging = activeTunerCourse === idx;
            return `
                <button type="button" data-tuner-course="${idx}"
                    class="min-h-[46px] px-2.5 py-1.5 rounded-lg border text-center font-mono transition ${
                        isRinging
                            ? 'bg-amber-500/25 border-amber-400 text-amber-200 ring-2 ring-amber-400/40 shadow-lg'
                            : 'bg-[#090d16] border-slate-800 hover:border-cyan-500/50 text-slate-200'
                    }">
                    <div class="text-[10px] text-slate-400">${c.label}</div>
                    <div class="text-sm font-bold text-cyan-300 mt-0.5 flex items-center justify-center gap-1">
                        <span>${c.note}</span>
                        ${isRinging ? '<span class="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>' : ''}
                    </div>
                </button>
            `;
        }).join('');

        wrap.querySelectorAll('[data-tuner-course]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-tuner-course'), 10);
                toggleTunerTone(idx);
            });
        });
    }

    // =========================================================================
    // BIBLIOTECA DE RITMOS TRADICIONAIS CAIPIRAS & LEVADAS DE VIOLA E VIOLÃO
    // =========================================================================
    const CAIPIRA_RHYTHMS = {
        cururu: {
            id: 'cururu',
            name: 'Cururu Tradicional',
            style: 'Cururu Paulista & Pantaneiro',
            timeSignature: '2/4',
            defaultBpm: 92,
            subdivision: 2,
            desc: 'Levada basilar dos desafios de viola caipira. Pulso cadenciado com batida percussiva no tampo e puxadas ascendentes.',
            handRoleLeft: 'Mão Esquerda dedilha com firmeza e percute no tampo',
            handRoleRight: 'Mão Direita dedilha com firmeza e percute no tampo',
            pattern: [
                { step: 0, beatLabel: '1', technique: 'thumb', sound: 'thumb', arrow: '↓', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Polegar Baixo', hint: 'Bordão grave' },
                { step: 1, beatLabel: '1 &', technique: 'index_up', sound: 'strum_up', arrow: '↑', colorClass: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30', label: 'Indicador Cima', hint: 'Pares agudos' },
                { step: 2, beatLabel: '2', technique: 'box_tap', sound: 'tap_box', arrow: '✕', colorClass: 'text-amber-400 bg-amber-500/15 border-amber-500/40', label: 'Batida no Tampo', hint: 'Percussão de caixa' },
                { step: 3, beatLabel: '2 &', technique: 'index_up', sound: 'strum_up', arrow: '↑', colorClass: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30', label: 'Indicador Cima', hint: 'Puxada ascendente' }
            ]
        },
        pagode: {
            id: 'pagode',
            name: 'Pagode de Viola (Tião Carreiro)',
            style: 'Pagode Caipira Sincopado',
            timeSignature: '2/4',
            defaultBpm: 96,
            subdivision: 4,
            desc: 'A síncopa magistral de Tião Carreiro. Revezamento virtuoso de repique de dedos no tampo, rasqueado e polegar nos bordões.',
            handRoleLeft: 'Mão Esquerda executa o repique duplo na caixa e dedilhado em leque',
            handRoleRight: 'Mão Direita executa o repique duplo na caixa e dedilhado em leque',
            pattern: [
                { step: 0, beatLabel: '1', technique: 'thumb', sound: 'thumb', arrow: '↓', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Polegar Baixo', hint: 'Bordão firme' },
                { step: 1, beatLabel: '1 e', technique: 'box_tap', sound: 'tap_box', arrow: '✕', colorClass: 'text-amber-400 bg-amber-500/15 border-amber-500/40', label: 'Repique Caixa', hint: 'Pancada no tampo' },
                { step: 2, beatLabel: '1 &', technique: 'thumb', sound: 'thumb', arrow: '↓', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Polegar Rápido', hint: 'Bordão sincopado' },
                { step: 3, beatLabel: '1 a', technique: 'index_up', sound: 'strum_up', arrow: '↑', colorClass: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30', label: 'Indicador Cima', hint: 'Pares 1 e 2' },
                { step: 4, beatLabel: '2', technique: 'rasqueado', sound: 'rasqueado', arrow: '↓', colorClass: 'text-emerald-300 bg-emerald-500/20 border-emerald-400', label: 'Rasqueado Baixo', hint: 'Todas as cordas' },
                { step: 5, beatLabel: '2 e', technique: 'box_tap', sound: 'tap_box', arrow: '✕', colorClass: 'text-amber-400 bg-amber-500/15 border-amber-500/40', label: 'Repique Caixa', hint: 'Pancada no tampo' },
                { step: 6, beatLabel: '2 &', technique: 'index_up', sound: 'strum_up', arrow: '↑', colorClass: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30', label: 'Indicador Cima', hint: 'Puxada ascendente' },
                { step: 7, beatLabel: '2 a', technique: 'thumb', sound: 'thumb', arrow: '↓', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Polegar Fecho', hint: 'Fechamento de ciclo' }
            ]
        },
        caterete: {
            id: 'caterete',
            name: 'Cateretê / Catira',
            style: 'Dança Ancestral Sertaneja',
            timeSignature: '2/4',
            defaultBpm: 104,
            subdivision: 2,
            desc: 'Ritmo rápido e saltado com corte percussivo abafando a ressonância das cordas com a palma da mão.',
            handRoleLeft: 'Mão Esquerda desfere o corte abafado seco e rasqueia',
            handRoleRight: 'Mão Direita desfere o corte abafado seco e rasqueia',
            pattern: [
                { step: 0, beatLabel: '1', technique: 'thumb', sound: 'thumb', arrow: '↓', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Polegar Forte', hint: 'Bordão de ataque' },
                { step: 1, beatLabel: '1 &', technique: 'index_up', sound: 'strum_up', arrow: '↑', colorClass: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30', label: 'Indicador Cima', hint: 'Pares agudos' },
                { step: 2, beatLabel: '2', technique: 'mute_chock', sound: 'chock', arrow: '■', colorClass: 'text-rose-400 bg-rose-500/15 border-rose-500/40', label: 'Abafado Seco', hint: 'Corte com a palma' },
                { step: 3, beatLabel: '2 &', technique: 'rasqueado', sound: 'rasqueado', arrow: '↓', colorClass: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30', label: 'Rasqueado Baixo', hint: 'Descida viva' }
            ]
        },
        guarania: {
            id: 'guarania',
            name: 'Guarânia Romântica',
            style: 'Balanço Ternário Lírico',
            timeSignature: '3/4',
            defaultBpm: 72,
            subdivision: 2,
            desc: 'Ondulação emotiva em compasso ternário com ressonância profunda de bordão e rasqueado aveludado.',
            handRoleLeft: 'Mão Esquerda conduz com suavidade extrema e dedilhado lírico',
            handRoleRight: 'Mão Direita conduz com suavidade extrema e dedilhado lírico',
            pattern: [
                { step: 0, beatLabel: '1', technique: 'thumb', sound: 'thumb', arrow: '↓', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Bordão Baixo', hint: 'Fundamental' },
                { step: 1, beatLabel: '1 &', technique: 'rest', sound: 'rest', arrow: '·', colorClass: 'text-slate-500 bg-slate-800/40 border-slate-700/40', label: 'Ressonância', hint: 'Deixar soar o baixo' },
                { step: 2, beatLabel: '2', technique: 'rasqueado', sound: 'rasqueado', arrow: '↓', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Rasqueado Suave', hint: 'Pares médios' },
                { step: 3, beatLabel: '2 &', technique: 'index_up', sound: 'strum_up', arrow: '↑', colorClass: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30', label: 'Indicador Cima', hint: 'Pares agudos' },
                { step: 4, beatLabel: '3', technique: 'rasqueado', sound: 'rasqueado', arrow: '↓', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Rasqueado Suave', hint: 'Pares médios' },
                { step: 5, beatLabel: '3 &', technique: 'index_up', sound: 'strum_up', arrow: '↑', colorClass: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30', label: 'Indicador Cima', hint: 'Pares agudos' }
            ]
        },
        toada: {
            id: 'toada',
            name: 'Toada Caipira (6/8)',
            style: 'Lamento Seresteiro em 6/8',
            timeSignature: '6/8',
            defaultBpm: 76,
            subdivision: 1,
            desc: 'Balanço ternário composto (dois pulsos de 3 colcheias). Alternância entre bordão grave, batida no tampo e dedilhado.',
            handRoleLeft: 'Mão Esquerda acentua os pulsos 1 e 4 com o corpo do instrumento',
            handRoleRight: 'Mão Direita acentua os pulsos 1 e 4 com o corpo do instrumento',
            pattern: [
                { step: 0, beatLabel: '1', technique: 'thumb', sound: 'thumb', arrow: '↓', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Polegar (Pulso 1)', hint: 'Bordão acentuado' },
                { step: 1, beatLabel: '2', technique: 'rasqueado', sound: 'rasqueado', arrow: '↓', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Dedos Baixo', hint: 'Pares médios' },
                { step: 2, beatLabel: '3', technique: 'index_up', sound: 'strum_up', arrow: '↑', colorClass: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30', label: 'Indicador Cima', hint: 'Pares agudos' },
                { step: 3, beatLabel: '4', technique: 'box_tap', sound: 'tap_box', arrow: '✕', colorClass: 'text-amber-400 bg-amber-500/15 border-amber-500/40', label: 'Tampo (Pulso 2)', hint: 'Pancada na caixa' },
                { step: 4, beatLabel: '5', technique: 'rasqueado', sound: 'rasqueado', arrow: '↓', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Dedos Baixo', hint: 'Pares médios' },
                { step: 5, beatLabel: '6', technique: 'index_up', sound: 'strum_up', arrow: '↑', colorClass: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30', label: 'Indicador Cima', hint: 'Pares agudos' }
            ]
        },
        querencia: {
            id: 'querencia',
            name: 'Querência / Valsa Caipira',
            style: 'Valsa de Rancho Tradicional',
            timeSignature: '3/4',
            defaultBpm: 108,
            subdivision: 1,
            desc: 'A clássica valsa caipira em três tempos: baixo forte na cabeça do compasso e duas batidas harmônicas nas cordas agudas.',
            handRoleLeft: 'Mão Esquerda marca o baixo no 1º tempo e rasqueia nos tempos 2 e 3',
            handRoleRight: 'Mão Direita marca o baixo no 1º tempo e rasqueia nos tempos 2 e 3',
            pattern: [
                { step: 0, beatLabel: '1', technique: 'thumb', sound: 'thumb', arrow: '↓', colorClass: 'text-emerald-400 bg-emerald-500/15 border-emerald-400', label: 'Baixo no Bordão', hint: 'Tônica no tempo 1' },
                { step: 1, beatLabel: '2', technique: 'rasqueado', sound: 'rasqueado', arrow: '↓', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Acorde Baixo', hint: 'Tempo 2' },
                { step: 2, beatLabel: '3', technique: 'rasqueado', sound: 'rasqueado', arrow: '↓', colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', label: 'Acorde Baixo', hint: 'Tempo 3' }
            ]
        }
    };

    // =========================================================================
    // SÍNTESE ACÚSTICA PERCUSSIVA & PALHETADA CAIPIRA (WEB AUDIO API)
    // =========================================================================
    function playWoodTap(startTimeOffset = 0, volume = 0.85) {
        const ctx = ensureAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime + Math.max(0, startTimeOffset);

        // 1. Ressonância oca de madeira do tampo de pinho/cedro da viola
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(148, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.052);

        oscGain.gain.setValueAtTime(0.0001, now);
        oscGain.gain.linearRampToValueAtTime(volume * 0.44, now + 0.002);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.065);

        // 2. Estalo seco percussivo de dedos batendo na caixa
        try {
            const bufferSize = Math.floor(ctx.sampleRate * 0.04);
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            const whiteNoise = ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(260, now);
            filter.Q.setValueAtTime(3.2, now);

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(volume * 0.52, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

            whiteNoise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(ctx.destination);

            whiteNoise.start(now);
            whiteNoise.stop(now + 0.045);
        } catch (_) {}
    }

    function playThumbBass(startTimeOffset = 0, volume = 0.85) {
        const ctx = ensureAudioContext();
        if (!ctx) return;
        const field = getHarmonicField(state.selectedKeyId);
        const chord = field[state.selectedDegreeIdx] || field[0];
        const inst = INSTRUMENTS[state.instrumentId];

        if (state.rhythmChordSync) {
            const voicings = getChordVoicings(chord);
            const shape = voicings[state.voicingVariantIdx % voicings.length];
            // Encontra a corda mais grave do acorde ativo que não esteja abafada
            let lowestIdx = -1;
            for (let i = inst.courses.length - 1; i >= 0; i--) {
                if (shape[i] >= 0) {
                    lowestIdx = i;
                    break;
                }
            }
            if (lowestIdx >= 0) {
                playCourseAtFret(lowestIdx, shape[lowestIdx], startTimeOffset);
                flashFretCell(lowestIdx, shape[lowestIdx], Math.max(0, startTimeOffset * 1000));
                return;
            }
        }

        // Fallback: bordão fundamental grave (B2/B3 na viola ou E2 no violão)
        const baseMidi = inst.isPaired ? 47 : 40;
        pluckMidiNote(baseMidi, startTimeOffset, 0.45, -1.8, volume * 0.28);
        if (inst.isPaired) {
            pluckMidiNote(baseMidi + 12, startTimeOffset + 0.005, 0.42, 1.8, volume * 0.24);
        }
    }

    function playRasqueado(startTimeOffset = 0, volume = 0.8) {
        const ctx = ensureAudioContext();
        if (!ctx) return;
        const field = getHarmonicField(state.selectedKeyId);
        const chord = field[state.selectedDegreeIdx] || field[0];
        const voicings = getChordVoicings(chord);
        const shape = voicings[state.voicingVariantIdx % voicings.length];
        const inst = INSTRUMENTS[state.instrumentId];

        let delayCount = 0;
        for (let cIdx = inst.courses.length - 1; cIdx >= 0; cIdx--) {
            const fret = shape[cIdx];
            if (fret >= 0) {
                playCourseAtFret(cIdx, fret, startTimeOffset + delayCount * 0.008);
                flashFretCell(cIdx, fret, Math.max(0, (startTimeOffset + delayCount * 0.008) * 1000));
                delayCount++;
            }
        }
    }

    function playIndexUp(startTimeOffset = 0, volume = 0.8) {
        const ctx = ensureAudioContext();
        if (!ctx) return;
        const field = getHarmonicField(state.selectedKeyId);
        const chord = field[state.selectedDegreeIdx] || field[0];
        const voicings = getChordVoicings(chord);
        const shape = voicings[state.voicingVariantIdx % voicings.length];
        const inst = INSTRUMENTS[state.instrumentId];

        let delayCount = 0;
        // Puxa as cordas agudas (pares 1 e 2 na viola)
        for (let cIdx = 0; cIdx < Math.min(2, inst.courses.length); cIdx++) {
            const fret = shape[cIdx];
            if (fret >= 0) {
                playCourseAtFret(cIdx, fret, startTimeOffset + delayCount * 0.007);
                flashFretCell(cIdx, fret, Math.max(0, (startTimeOffset + delayCount * 0.007) * 1000));
                delayCount++;
            }
        }
    }

    function playMuteChock(startTimeOffset = 0, volume = 0.8) {
        const ctx = ensureAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime + Math.max(0, startTimeOffset);

        try {
            const bufferSize = Math.floor(ctx.sampleRate * 0.032);
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = noiseBuffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(840, now);
            filter.Q.setValueAtTime(3.8, now);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(volume * 0.44, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            noise.start(now);
            noise.stop(now + 0.032);
        } catch (_) {}
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

    function scheduleMetronomeClick(subStepIndex, time, isGuideOnly = false) {
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
        let vol = isDownbeat ? 0.34 : (isMainBeat ? 0.22 : 0.09);
        if (isGuideOnly) vol *= 0.45; // Clique discreto quando em conjunto com ritmo caipira

        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(vol, time + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.048);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.055);

        if (isMainBeat && !isGuideOnly) {
            metroVisualQueue.push({ beat: beatNumber, time });
        }
    }

    function metroSchedulerTick() {
        if (!metroRunning || !audioCtx) return;
        const scheduleAheadSec = 0.1;

        if (state.metroMode === 'rhythm') {
            const rhythm = CAIPIRA_RHYTHMS[state.activeRhythmId] || CAIPIRA_RHYTHMS.cururu;
            const totalSteps = rhythm.pattern.length;

            while (metroNextNoteTime < audioCtx.currentTime + scheduleAheadSec) {
                const currentStepIdx = metroCurrentSubStep % totalSteps;
                const step = rhythm.pattern[currentStepIdx];
                const timeOffset = Math.max(0, metroNextNoteTime - audioCtx.currentTime);

                // Execução da síntese correspondente ao passo
                if (step.sound === 'tap_box') {
                    playWoodTap(timeOffset, state.rhythmBoxVolume);
                } else if (step.sound === 'thumb') {
                    playThumbBass(timeOffset, 0.85);
                } else if (step.sound === 'rasqueado') {
                    playRasqueado(timeOffset, 0.8);
                } else if (step.sound === 'strum_up') {
                    playIndexUp(timeOffset, 0.78);
                } else if (step.sound === 'chock') {
                    playMuteChock(timeOffset, 0.8);
                }

                // Clique guia analítico opcional
                if (state.rhythmGuideClick) {
                    if (step.beatLabel === '1' || step.beatLabel === '2' || step.beatLabel === '3' || step.beatLabel === '4') {
                        scheduleMetronomeClick(0, metroNextNoteTime, true);
                    }
                }

                // Fila visual para LEDs de tempo e régua de palhetada
                const beatsPerBar = getBeatsPerBar();
                const mainBeat = Math.floor((currentStepIdx / totalSteps) * beatsPerBar);
                metroVisualQueue.push({ beat: mainBeat, rhythmStep: currentStepIdx, time: metroNextNoteTime });

                // Duração do passo
                let secPerStep = 0;
                if (rhythm.timeSignature === '6/8') {
                    secPerStep = (60 / state.bpm) / 3;
                } else {
                    secPerStep = (60 / state.bpm) / rhythm.subdivision;
                }

                metroNextNoteTime += secPerStep;
                metroCurrentSubStep = (metroCurrentSubStep + 1) % totalSteps;
            }
        } else {
            // Modo Metrônomo Analítico Lookahead
            const totalSubStepsPerBar = getBeatsPerBar() * state.subdivision;
            while (metroNextNoteTime < audioCtx.currentTime + scheduleAheadSec) {
                scheduleMetronomeClick(metroCurrentSubStep, metroNextNoteTime, false);
                const secPerMainBeat = state.timeSignature === '6/8'
                    ? (60 / state.bpm) / 1.5
                    : (60 / state.bpm);
                metroNextNoteTime += secPerMainBeat / state.subdivision;
                metroCurrentSubStep = (metroCurrentSubStep + 1) % totalSubStepsPerBar;
            }
        }
    }

    function metroVisualLoop() {
        if (!metroRunning || !audioCtx) return;
        const currentTime = audioCtx.currentTime;
        let activeBeat = -1;
        let activeRhythmStep = -1;

        while (metroVisualQueue.length > 0 && metroVisualQueue[0].time <= currentTime) {
            activeBeat = metroVisualQueue[0].beat;
            if (metroVisualQueue[0].rhythmStep !== undefined) {
                activeRhythmStep = metroVisualQueue[0].rhythmStep;
            }
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

        if (activeRhythmStep >= 0) {
            document.querySelectorAll('[data-rhythm-step]').forEach((card) => {
                const stepIdx = parseInt(card.getAttribute('data-rhythm-step'), 10);
                if (stepIdx === activeRhythmStep) {
                    card.classList.add('ring-2', 'ring-emerald-400', 'bg-emerald-500/25', 'scale-[1.05]', 'shadow-[0_0_16px_rgba(52,211,153,0.4)]');
                    card.classList.remove('bg-[#090d16]', 'border-slate-800');
                } else {
                    card.classList.remove('ring-2', 'ring-emerald-400', 'bg-emerald-500/25', 'scale-[1.05]', 'shadow-[0_0_16px_rgba(52,211,153,0.4)]');
                    card.classList.add('bg-[#090d16]', 'border-slate-800');
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
            // Limpa destaques dos cards de ritmo
            document.querySelectorAll('[data-rhythm-step]').forEach((card) => {
                card.classList.remove('ring-2', 'ring-emerald-400', 'bg-emerald-500/25', 'scale-[1.05]', 'shadow-[0_0_16px_rgba(52,211,153,0.4)]');
                card.classList.add('bg-[#090d16]', 'border-slate-800');
            });
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
                        color: role === 'T' ? '#10b981' : (role.startsWith('3') ? '#06b6d4' : (role.startsWith('7') ? '#a855f7' : '#f59e0b'))
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
        const rhythmPanel = document.getElementById('viola-rhythm-panel');
        const rhythmSelectors = document.getElementById('viola-rhythm-selectors');
        const rhythmInfoBox = document.getElementById('viola-rhythm-info-box');
        const rhythmStrip = document.getElementById('viola-rhythm-strip');
        const rhythmHandGuide = document.getElementById('viola-rhythm-hand-guide');
        const classicSelects = document.getElementById('viola-classic-metro-selects');
        const modeRhythmBtn = document.getElementById('btn-viola-metro-mode-rhythm');
        const modeClickBtn = document.getElementById('btn-viola-metro-mode-click');

        if (bpmVal) bpmVal.textContent = `${state.bpm} BPM`;
        if (bpmSlider) bpmSlider.value = String(state.bpm);

        // Alternância visual de modo: Ritmo Caipira vs Metrônomo Analítico
        if (modeRhythmBtn && modeClickBtn) {
            if (state.metroMode === 'rhythm') {
                modeRhythmBtn.className = 'px-3 py-1.5 text-xs font-mono rounded-md font-semibold bg-emerald-600 text-slate-950 shadow';
                modeClickBtn.className = 'px-3 py-1.5 text-xs font-mono rounded-md font-semibold text-slate-400 hover:text-slate-200';
                if (rhythmPanel) rhythmPanel.classList.remove('hidden');
                if (classicSelects) classicSelects.classList.add('hidden');
            } else {
                modeRhythmBtn.className = 'px-3 py-1.5 text-xs font-mono rounded-md font-semibold text-slate-400 hover:text-slate-200';
                modeClickBtn.className = 'px-3 py-1.5 text-xs font-mono rounded-md font-semibold bg-cyan-600 text-slate-950 shadow';
                if (rhythmPanel) rhythmPanel.classList.add('hidden');
                if (classicSelects) classicSelects.classList.remove('hidden');
            }
        }

        if (playBtn) {
            const isRhythm = state.metroMode === 'rhythm';
            playBtn.className = metroRunning
                ? 'min-h-[40px] px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-rose-950/40'
                : (isRhythm
                    ? 'min-h-[40px] px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition'
                    : 'min-h-[40px] px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition');
            playBtn.innerHTML = metroRunning
                ? `<i data-lucide="square" class="w-4 h-4"></i><span>Parar ${isRhythm ? 'Levada' : 'Metrônomo'}</span>`
                : `<i data-lucide="play" class="w-4 h-4"></i><span>Tocar ${isRhythm ? 'Levada Caipira' : 'Metrônomo'}</span>`;
            global.VaultCore.refreshIcons(playBtn);
        }

        if (ledsWrap) {
            const beats = getBeatsPerBar();
            ledsWrap.innerHTML = Array.from({ length: beats }, (_, i) => `
                <div data-metro-led="${i}" class="w-3.5 h-3.5 rounded-full bg-slate-800 border border-slate-700 transition-all"></div>
            `).join('');
        }

        // Renderiza seletores e detalhes do Ritmo Caipira
        const currentRhythm = CAIPIRA_RHYTHMS[state.activeRhythmId] || CAIPIRA_RHYTHMS.cururu;

        if (rhythmSelectors) {
            rhythmSelectors.innerHTML = Object.values(CAIPIRA_RHYTHMS).map((r) => {
                const isSelected = r.id === state.activeRhythmId;
                return `
                    <button type="button" data-rhythm-choice="${r.id}"
                        class="min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition ${
                            isSelected
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-sm'
                                : 'bg-[#090d16] border-slate-800 hover:border-slate-700 text-slate-400'
                        }">
                        <span>${r.name}</span>
                        <span class="text-[10px] text-slate-500 ml-1">(${r.timeSignature})</span>
                    </button>
                `;
            }).join('');

            rhythmSelectors.querySelectorAll('[data-rhythm-choice]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const rId = btn.getAttribute('data-rhythm-choice');
                    const chosen = CAIPIRA_RHYTHMS[rId];
                    if (!chosen) return;
                    state.activeRhythmId = rId;
                    state.timeSignature = chosen.timeSignature;
                    state.subdivision = chosen.subdivision;
                    if (!metroRunning) {
                        state.bpm = chosen.defaultBpm;
                    }
                    metroCurrentSubStep = 0;
                    saveViolaState();
                    renderMetronomeControls();
                });
            });
        }

        if (rhythmInfoBox) {
            const handText = state.isLeftHanded ? currentRhythm.handRoleLeft : currentRhythm.handRoleRight;
            rhythmInfoBox.innerHTML = `
                <div>
                    <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            ${currentRhythm.style}
                        </span>
                        <span class="text-slate-400">Compasso: <strong class="text-emerald-300">${currentRhythm.timeSignature}</strong></span>
                        <span class="text-slate-400">• Sugerido: <strong class="text-cyan-300">${currentRhythm.defaultBpm} BPM</strong></span>
                    </div>
                    <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">${currentRhythm.desc}</p>
                </div>
                <div class="shrink-0 text-right sm:text-right text-[11px] text-amber-300/90 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                    <div class="text-[10px] text-slate-500 uppercase tracking-wider">Ergonomia (${state.isLeftHanded ? 'Canhoto' : 'Destro'})</div>
                    <div>${handText}</div>
                </div>
            `;
        }

        if (rhythmHandGuide) {
            rhythmHandGuide.textContent = state.isLeftHanded ? 'Mão Esquerda (Dedilha/Caixa)' : 'Mão Direita (Dedilha/Caixa)';
        }

        if (rhythmStrip) {
            rhythmStrip.innerHTML = currentRhythm.pattern.map((p) => `
                <div data-rhythm-step="${p.step}"
                    class="bg-[#090d16] border border-slate-800 rounded-xl p-2.5 flex flex-col items-center justify-between transition group cursor-default">
                    <div class="text-[10px] font-mono text-slate-500 font-bold mb-1">
                        ${p.beatLabel}
                    </div>
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-base border transition ${p.colorClass}">
                        ${p.arrow}
                    </div>
                    <div class="text-center mt-1.5 space-y-0.5">
                        <div class="text-[10px] font-mono font-semibold text-slate-200">${p.label}</div>
                        <div class="text-[9px] font-mono text-slate-500">${p.hint}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    function loadViolaState() {
        const C = global.VaultCore;
        const saved = C.store.get(C.STORAGE_KEYS.VIOLA, null);
        if (saved && typeof saved === 'object') {
            state = Object.assign({}, state, saved, {
                activeDuadStepIdx: -1,
                progressionPlaying: false,
                progressionStepIdx: -1,
                activeRhythmStepIdx: -1
            });
        }
    }

    function saveViolaState() {
        const C = global.VaultCore;
        const copy = Object.assign({}, state);
        delete copy.activeDuadStepIdx;
        delete copy.progressionPlaying;
        delete copy.progressionStepIdx;
        delete copy.activeRhythmStepIdx;
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

                <!-- Afinador Auditivo de Precisão (Pitch Reference) -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3 sm:p-4 space-y-2">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-800">
                        <div>
                            <div class="flex items-center gap-2">
                                <i data-lucide="radio" class="w-4 h-4 text-cyan-400"></i>
                                <h3 class="text-xs sm:text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Afinador Acústico de Precisão</h3>
                            </div>
                            <p class="text-[11px] text-slate-400 mt-0.5">Clique em qualquer par/corda para soar a nota de afinação pura como diapasão de referência</p>
                        </div>
                        <div>
                            <button type="button" id="btn-viola-tuner-stop" class="min-h-[36px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-rose-300 flex items-center gap-1.5 transition">
                                <i data-lucide="square" class="w-3.5 h-3.5 text-rose-400"></i>
                                <span>Silenciar Afinador</span>
                            </button>
                        </div>
                    </div>
                    <div id="viola-tuner-buttons" class="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 gap-2 pt-1"></div>
                </div>

                <!-- Braço Interativo SVG -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3 sm:p-4 space-y-2">
                    <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                        <span>Clique em qualquer par/casa para ouvir a síntese acústica real (pares 3º, 4º e 5º oitavados na Viola).</span>
                        <div class="flex items-center gap-2 font-mono text-[11px]">
                            <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Tônica</span>
                            <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>Terça / Escala</span>
                            <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Quinta</span>
                            <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>Sétima (7ª)</span>
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
                            <div class="flex flex-wrap items-center gap-2">
                                <div class="inline-flex rounded-lg bg-[#090d16] border border-slate-700 p-0.5" role="group">
                                    <button type="button" id="btn-viola-mode-triad" class="px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold transition ${state.harmonicExtension === 'triad' ? 'bg-emerald-600 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'}">Tríades</button>
                                    <button type="button" id="btn-viola-mode-tetrad" class="px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold transition ${state.harmonicExtension === 'tetrad' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}">Tétrades (7ª)</button>
                                </div>
                                <select id="viola-select-key" aria-label="Tonalidade do campo harmônico"
                                    class="min-h-[38px] px-2.5 py-1 rounded-lg bg-[#090d16] border border-slate-700 text-xs font-mono text-emerald-300">
                                    ${HARMONIC_KEYS.map((k) => `<option value="${k.id}" ${state.selectedKeyId === k.id ? 'selected' : ''}>${k.label}</option>`).join('')}
                                </select>
                            </div>
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

                <!-- Módulo de Estudos de Progressão Harmônica & Cadências -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <div class="flex items-center gap-2">
                                <i data-lucide="git-commit" class="w-4 h-4 text-emerald-400"></i>
                                <h3 class="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Estudos de Progressão Harmônica & Cadências</h3>
                            </div>
                            <p class="text-xs text-slate-400">Laboratório auditivo e prático de cadências caipiras, funções harmônicas e treino de transição de shapes</p>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <select id="viola-select-progression" aria-label="Selecione a progressão harmônica"
                                class="min-h-[40px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-xs font-mono text-emerald-300">
                                ${HARMONIC_PROGRESSIONS.map((p) => `<option value="${p.id}" ${state.progressionId === p.id ? 'selected' : ''}>${p.title}</option>`).join('')}
                            </select>

                            <select id="viola-select-prog-beats" aria-label="Tempos por acorde"
                                class="min-h-[40px] px-2.5 py-1.5 rounded-lg bg-[#090d16] border border-slate-700 text-xs font-mono text-slate-200">
                                <option value="2" ${state.progressionBeatsPerChord === 2 ? 'selected' : ''}>2 Tempos / Acorde</option>
                                <option value="4" ${state.progressionBeatsPerChord === 4 ? 'selected' : ''}>4 Tempos (Padrão)</option>
                                <option value="8" ${state.progressionBeatsPerChord === 8 ? 'selected' : ''}>8 Tempos (Lento)</option>
                            </select>

                            <button type="button" id="btn-viola-loop-progression" title="Alternar repetição contínua (Loop)"
                                class="min-h-[40px] px-3 py-1.5 rounded-lg ${state.progressionLoop ? 'bg-cyan-600/20 border border-cyan-400 text-cyan-200' : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400'} text-xs font-mono font-semibold flex items-center gap-1.5 transition">
                                <i data-lucide="repeat" class="w-3.5 h-3.5"></i>
                                <span>Loop</span>
                            </button>

                            <button type="button" id="btn-viola-play-progression" class="min-h-[40px] px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition">
                                <i data-lucide="play" class="w-4 h-4"></i>
                                <span>Tocar Estudo da Progressão</span>
                            </button>
                        </div>
                    </div>

                    <div id="viola-progression-container"></div>
                </div>

                <!-- Biblioteca de Repertório de Ponteios & Solos Clássicos -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <div class="flex items-center gap-2">
                                <i data-lucide="disc-3" class="w-4 h-4 text-amber-400"></i>
                                <h3 class="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Repertório Canônico de Ponteios (Viola Caipira)</h3>
                            </div>
                            <p class="text-xs text-slate-400">Execução sequenciada nota a nota com iluminação dinâmica no braço canhoto</p>
                        </div>
                        <button type="button" id="btn-viola-stop-ponteio" class="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-rose-300 flex items-center gap-1.5 transition">
                            <i data-lucide="square" class="w-3.5 h-3.5"></i>
                            <span>Interromper Ponteio</span>
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                        ${PONTEIOS_REPERTOIRE.map((p) => `
                            <div class="bg-[#090d16] border border-slate-800 hover:border-amber-500/40 rounded-xl p-3 flex flex-col justify-between transition group">
                                <div class="space-y-1.5">
                                    <div class="flex items-center justify-between text-[11px] font-mono">
                                        <span class="text-amber-400 font-semibold">${p.rhythm}</span>
                                        <span class="text-slate-500">${p.key}</span>
                                    </div>
                                    <h4 class="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition">${p.title}</h4>
                                    <p class="text-[11px] text-slate-400 font-mono">${p.author}</p>
                                    <p class="text-xs text-slate-400 line-clamp-2">${p.desc}</p>
                                </div>
                                <div class="pt-3 mt-2 border-t border-slate-800/80">
                                    <button type="button" data-play-ponteio="${p.id}" class="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition">
                                        <i data-lucide="play" class="w-3.5 h-3.5"></i>
                                        <span>Ouvir e Animar Braço</span>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Módulo de Ritmos Tradicionais Caipiras & Metrônomo Lookahead -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-4">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3 border-b border-slate-800">
                        <div>
                            <div class="flex items-center gap-2">
                                <i data-lucide="activity" class="w-4 h-4 text-emerald-400"></i>
                                <h3 class="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Ritmos Tradicionais Caipiras & Metrônomo</h3>
                            </div>
                            <p class="text-xs text-slate-400 mt-0.5">Síntese Web Audio precisa de batida no tampo, repique de caixa, rasqueado e guia direcional sincronizado</p>
                        </div>

                        <div class="flex flex-wrap items-center gap-2">
                            <div class="inline-flex rounded-lg bg-[#090d16] border border-slate-700 p-0.5" role="group">
                                <button type="button" id="btn-viola-metro-mode-rhythm" class="px-3 py-1.5 text-xs font-mono rounded-md font-semibold transition ${state.metroMode === 'rhythm' ? 'bg-emerald-600 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'}">
                                    Ritmo Caipira
                                </button>
                                <button type="button" id="btn-viola-metro-mode-click" class="px-3 py-1.5 text-xs font-mono rounded-md font-semibold transition ${state.metroMode === 'click' ? 'bg-cyan-600 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'}">
                                    Metrônomo Analítico
                                </button>
                            </div>

                            <button type="button" id="btn-viola-metro-toggle" class="min-h-[40px] px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition">
                                <i data-lucide="play" class="w-4 h-4"></i>
                                <span>Tocar Levada Caipira</span>
                            </button>
                        </div>
                    </div>

                    <!-- Seção de Ritmo Caipira Ativo -->
                    <div id="viola-rhythm-panel" class="${state.metroMode === 'rhythm' ? 'space-y-3' : 'hidden'}">
                        <!-- Seletores dos Ritmos Caipiras -->
                        <div class="flex flex-wrap items-center gap-2" id="viola-rhythm-selectors"></div>

                        <!-- Info do Ritmo & Orientação Ergonômica -->
                        <div id="viola-rhythm-info-box" class="bg-[#090d16] border border-slate-800/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-mono"></div>

                        <!-- Régua Visual de Palhetadas / Repiques -->
                        <div>
                            <div class="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                                <span>Padrão de Palhetada & Repique no Tampo (1 Compasso):</span>
                                <span class="text-emerald-400 font-semibold" id="viola-rhythm-hand-guide"></span>
                            </div>
                            <div id="viola-rhythm-strip" class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2"></div>
                        </div>
                    </div>

                    <!-- Barra de Andamento (BPM) & Ajustes de Mixagem -->
                    <div class="bg-[#090d16] border border-slate-800/80 rounded-xl p-3 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        <div class="flex items-center gap-3 shrink-0">
                            <div>
                                <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400">Andamento</span>
                                <div id="viola-bpm-display" class="text-xl font-mono font-bold text-cyan-300">92 BPM</div>
                            </div>
                            <div id="viola-metro-leds" class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0f172a] border border-slate-800"></div>
                        </div>

                        <div class="flex-1 max-w-xl space-y-2">
                            <input type="range" id="viola-bpm-slider" min="40" max="220" value="92"
                                class="w-full accent-cyan-400 cursor-pointer">
                            <div class="flex flex-wrap items-center gap-1.5">
                                <button type="button" data-bpm-delta="-5" class="min-h-[34px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 font-mono text-xs text-slate-200">−5</button>
                                <button type="button" data-bpm-delta="-1" class="min-h-[34px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 font-mono text-xs text-slate-200">−1</button>
                                <button type="button" data-bpm-delta="1" class="min-h-[34px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 font-mono text-xs text-slate-200">+1</button>
                                <button type="button" data-bpm-delta="5" class="min-h-[34px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 font-mono text-xs text-slate-200">+5</button>
                                <button type="button" id="btn-viola-tap-tempo" class="min-h-[34px] px-2.5 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 font-mono text-xs text-amber-300">Tap Tempo</button>

                                <div id="viola-classic-metro-selects" class="inline-flex items-center gap-1.5 ${state.metroMode === 'click' ? '' : 'hidden'}">
                                    <select id="viola-metro-sig" aria-label="Compasso" class="min-h-[34px] px-2 py-0.5 rounded bg-[#0f172a] border border-slate-700 font-mono text-xs text-slate-200">
                                        <option value="2/4">2/4 Pagode / Cururu</option>
                                        <option value="3/4">3/4 Moda / Guarânia</option>
                                        <option value="4/4">4/4 Toada / Padrão</option>
                                        <option value="6/8">6/8 Ternário / Ponteio</option>
                                    </select>
                                    <select id="viola-metro-sub" aria-label="Subdivisão" class="min-h-[34px] px-2 py-0.5 rounded bg-[#0f172a] border border-slate-700 font-mono text-xs text-slate-200">
                                        <option value="1">1x Semínima</option>
                                        <option value="2">2x Colcheia</option>
                                        <option value="3">3x Tercina</option>
                                        <option value="4">4x Semicolcheia</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Opções de Mixagem Acústica Caipira -->
                        <div class="flex flex-wrap items-center gap-2 pt-2 xl:pt-0 border-t xl:border-t-0 border-slate-800">
                            <label class="flex items-center gap-1.5 text-xs font-mono text-slate-300 cursor-pointer" title="Harmonizar palhetada com o acorde ativo no Campo Harmônico">
                                <input type="checkbox" id="check-viola-rhythm-chord-sync" ${state.rhythmChordSync ? 'checked' : ''} class="accent-emerald-500 rounded cursor-pointer">
                                <span>Harmonizar Acorde</span>
                            </label>

                            <label class="flex items-center gap-1.5 text-xs font-mono text-slate-300 cursor-pointer" title="Ouvir clique do metrônomo analítico junto ao ritmo">
                                <input type="checkbox" id="check-viola-rhythm-guide-click" ${state.rhythmGuideClick ? 'checked' : ''} class="accent-cyan-500 rounded cursor-pointer">
                                <span>Clique Guia</span>
                            </label>

                            <div class="flex items-center gap-1.5 pl-2 border-l border-slate-800">
                                <span class="text-[10px] font-mono text-slate-400">Caixa:</span>
                                <input type="range" id="viola-slider-box-vol" min="0" max="100" value="${Math.round(state.rhythmBoxVolume * 100)}"
                                    class="w-16 accent-amber-400 cursor-pointer" title="Volume da batida no tampo da viola">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        bindEvents();
    }

    function syncControlValues() {
        const instSel = document.getElementById('viola-select-instrument');
        if (instSel) instSel.value = state.instrumentId;
        const keySel = document.getElementById('viola-select-key');
        if (keySel) keySel.value = state.selectedKeyId;
        const duadSel = document.getElementById('viola-select-duad-type');
        if (duadSel) duadSel.value = state.duadType;
        const duadKeySel = document.getElementById('viola-select-duad-key');
        if (duadKeySel) duadKeySel.value = state.duadKeyId;

        const metroSig = document.getElementById('viola-metro-sig');
        if (metroSig) metroSig.value = state.timeSignature;
        const metroSub = document.getElementById('viola-metro-sub');
        if (metroSub) metroSub.value = String(state.subdivision);

        const chordSync = document.getElementById('check-viola-rhythm-chord-sync');
        if (chordSync) chordSync.checked = state.rhythmChordSync;
        const guideClick = document.getElementById('check-viola-rhythm-guide-click');
        if (guideClick) guideClick.checked = state.rhythmGuideClick;
        const boxSlider = document.getElementById('viola-slider-box-vol');
        if (boxSlider) boxSlider.value = String(Math.round(state.rhythmBoxVolume * 100));

        const progSel = document.getElementById('viola-select-progression');
        if (progSel) progSel.value = state.progressionId;
        const progBeatsSel = document.getElementById('viola-select-prog-beats');
        if (progBeatsSel) progBeatsSel.value = String(state.progressionBeatsPerChord);

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
            stopPonteioPlayback();
            stopProgressionPlayback();
            stopTunerTone();
            state.instrumentId = e.target.value;
            state.voicingVariantIdx = 0;
            saveViolaState();
            renderAll();
        });

        const stopTunerBtn = document.getElementById('btn-viola-tuner-stop');
        if (stopTunerBtn) {
            stopTunerBtn.addEventListener('click', stopTunerTone);
        }

        const stopPonteioBtn = document.getElementById('btn-viola-stop-ponteio');
        if (stopPonteioBtn) {
            stopPonteioBtn.addEventListener('click', stopPonteioPlayback);
        }

        document.querySelectorAll('[data-play-ponteio]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-play-ponteio');
                playPonteioSequence(id);
            });
        });

        const btnTriad = document.getElementById('btn-viola-mode-triad');
        const btnTetrad = document.getElementById('btn-viola-mode-tetrad');
        if (btnTriad && btnTetrad) {
            btnTriad.addEventListener('click', () => {
                if (state.harmonicExtension !== 'triad') {
                    state.harmonicExtension = 'triad';
                    state.voicingVariantIdx = 0;
                    saveViolaState();
                    mountShell();
                    renderAll();
                    strumActiveChord();
                }
            });
            btnTetrad.addEventListener('click', () => {
                if (state.harmonicExtension !== 'tetrad') {
                    state.harmonicExtension = 'tetrad';
                    state.voicingVariantIdx = 0;
                    saveViolaState();
                    mountShell();
                    renderAll();
                    strumActiveChord();
                }
            });
        }

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
            stopProgressionPlayback();
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
            stopProgressionPlayback();
            state.displayMode = 'DUAD';
            state.duadType = e.target.value;
            saveViolaState();
            renderAll();
        });

        document.getElementById('viola-select-duad-key').addEventListener('change', (e) => {
            stopScalePlayback();
            stopProgressionPlayback();
            state.displayMode = 'DUAD';
            state.duadKeyId = e.target.value;
            saveViolaState();
            renderAll();
        });

        document.getElementById('btn-viola-play-duads').addEventListener('click', () => {
            stopProgressionPlayback();
            renderAll();
            playDuadScale();
        });

        // Estudos de Progressão Harmônica & Cadências
        const progSelect = document.getElementById('viola-select-progression');
        if (progSelect) {
            progSelect.addEventListener('change', (e) => {
                stopProgressionPlayback();
                state.progressionId = e.target.value;
                saveViolaState();
                renderProgressionStudyPanel();
            });
        }

        const progBeats = document.getElementById('viola-select-prog-beats');
        if (progBeats) {
            progBeats.addEventListener('change', (e) => {
                state.progressionBeatsPerChord = parseInt(e.target.value, 10) || 4;
                saveViolaState();
            });
        }

        const loopProgBtn = document.getElementById('btn-viola-loop-progression');
        if (loopProgBtn) {
            loopProgBtn.addEventListener('click', () => {
                state.progressionLoop = !state.progressionLoop;
                saveViolaState();
                updateProgressionUIState();
            });
        }

        const playProgBtn = document.getElementById('btn-viola-play-progression');
        if (playProgBtn) {
            playProgBtn.addEventListener('click', () => {
                playProgression();
            });
        }

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

        const metroSigEl = document.getElementById('viola-metro-sig');
        if (metroSigEl) {
            metroSigEl.addEventListener('change', (e) => {
                state.timeSignature = e.target.value;
                metroCurrentSubStep = 0;
                saveViolaState();
                renderMetronomeControls();
            });
        }

        const metroSubEl = document.getElementById('viola-metro-sub');
        if (metroSubEl) {
            metroSubEl.addEventListener('change', (e) => {
                state.subdivision = parseInt(e.target.value, 10) || 2;
                metroCurrentSubStep = 0;
                saveViolaState();
                renderMetronomeControls();
            });
        }

        // Modos do Metrônomo: Ritmo Caipira vs Analítico
        const btnModeRhythm = document.getElementById('btn-viola-metro-mode-rhythm');
        const btnModeClick = document.getElementById('btn-viola-metro-mode-click');
        if (btnModeRhythm && btnModeClick) {
            btnModeRhythm.addEventListener('click', () => {
                if (state.metroMode !== 'rhythm') {
                    state.metroMode = 'rhythm';
                    const cur = CAIPIRA_RHYTHMS[state.activeRhythmId] || CAIPIRA_RHYTHMS.cururu;
                    state.timeSignature = cur.timeSignature;
                    state.subdivision = cur.subdivision;
                    metroCurrentSubStep = 0;
                    saveViolaState();
                    renderMetronomeControls();
                }
            });
            btnModeClick.addEventListener('click', () => {
                if (state.metroMode !== 'click') {
                    state.metroMode = 'click';
                    metroCurrentSubStep = 0;
                    saveViolaState();
                    renderMetronomeControls();
                }
            });
        }

        const chordSyncCheck = document.getElementById('check-viola-rhythm-chord-sync');
        if (chordSyncCheck) {
            chordSyncCheck.addEventListener('change', (e) => {
                state.rhythmChordSync = e.target.checked;
                saveViolaState();
            });
        }

        const guideClickCheck = document.getElementById('check-viola-rhythm-guide-click');
        if (guideClickCheck) {
            guideClickCheck.addEventListener('change', (e) => {
                state.rhythmGuideClick = e.target.checked;
                saveViolaState();
            });
        }

        const boxVolSlider = document.getElementById('viola-slider-box-vol');
        if (boxVolSlider) {
            boxVolSlider.addEventListener('input', (e) => {
                state.rhythmBoxVolume = (parseInt(e.target.value, 10) || 85) / 100;
                saveViolaState();
            });
        }

        document.getElementById('btn-viola-metro-toggle').addEventListener('click', toggleMetronome);
    }

    function renderAll() {
        syncControlValues();
        renderTunerButtons();
        renderFretboardSVG();
        renderHarmonicFieldPanel();
        renderDuadStrip();
        renderProgressionStudyPanel();
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
