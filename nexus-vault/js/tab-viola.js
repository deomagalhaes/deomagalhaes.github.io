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
        viola_cebolao_d: {
            id: 'viola_cebolao_d',
            name: 'Viola Caipira — Cebolão em Ré (D - A - F# - D - A)',
            shortName: 'Viola Cebolão em Ré',
            isPaired: true,
            courses: [
                { num: 1, label: '1º Par (Prima)', note: 'D4', midi: [62, 62], pitchClass: 2, octaved: false },
                { num: 2, label: '2º Par (Segundinha)', note: 'A3', midi: [57, 57], pitchClass: 9, octaved: false },
                { num: 3, label: '3º Par (Turina)', note: 'F#3/F#4', midi: [54, 66], pitchClass: 6, octaved: true },
                { num: 4, label: '4º Par (Toeira)', note: 'D3/D4', midi: [50, 62], pitchClass: 2, octaved: true },
                { num: 5, label: '5º Par (Canotilho)', note: 'A2/A3', midi: [45, 57], pitchClass: 9, octaved: true }
            ]
        },
        viola_rio_abaixo: {
            id: 'viola_rio_abaixo',
            name: 'Viola Caipira — Rio Abaixo em Sol (D - B - G - D - G)',
            shortName: 'Viola Rio Abaixo (Sol)',
            isPaired: true,
            courses: [
                { num: 1, label: '1º Par (Prima)', note: 'D4', midi: [62, 62], pitchClass: 2, octaved: false },
                { num: 2, label: '2º Par (Segundinha)', note: 'B3', midi: [59, 59], pitchClass: 11, octaved: false },
                { num: 3, label: '3º Par (Turina)', note: 'G3/G4', midi: [55, 67], pitchClass: 7, octaved: true },
                { num: 4, label: '4º Par (Toeira)', note: 'D3/D4', midi: [50, 62], pitchClass: 2, octaved: true },
                { num: 5, label: '5º Par (Canotilho)', note: 'G2/G3', midi: [43, 55], pitchClass: 7, octaved: true }
            ]
        },
        viola_boiadeira: {
            id: 'viola_boiadeira',
            name: 'Viola Caipira — Boiadeira (D - A - F# - D - G)',
            shortName: 'Viola Boiadeira',
            isPaired: true,
            courses: [
                { num: 1, label: '1º Par (Prima)', note: 'D4', midi: [62, 62], pitchClass: 2, octaved: false },
                { num: 2, label: '2º Par (Segundinha)', note: 'A3', midi: [57, 57], pitchClass: 9, octaved: false },
                { num: 3, label: '3º Par (Turina)', note: 'F#3/F#4', midi: [54, 66], pitchClass: 6, octaved: true },
                { num: 4, label: '4º Par (Toeira)', note: 'D3/D4', midi: [50, 62], pitchClass: 2, octaved: true },
                { num: 5, label: '5º Par (Canotilho)', note: 'G2/G3', midi: [43, 55], pitchClass: 7, octaved: true }
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

    const DEFAULT_EAR_TRAINER_STATE = {
        mode: 'challenge',          // 'challenge' (Teste Cego) | 'peg' (Cravelha Manual)
        difficulty: 'intermediate', // 'beginner' (25..45 cents) | 'intermediate' (12..25) | 'advanced' (5..12) | 'legendary' (1.5..5)
        selectedCourseIdx: 2,       // 2 = 3º par Turina (G#3/G#4 oitavado por padrão)
        soundType: 'pluck',         // 'pluck' (Dedilhado periódico) | 'drone' (Ressonância contínua)
        score: 0,
        streak: 0,
        bestStreak: 0,
        totalTested: 0,
        correctCount: 0,
        // Desafio Auditivo Cego
        challengeActive: false,
        challengeCourseIdx: 2,
        challengeDetuneCents: 0,
        challengeUserGuess: null,
        challengeRevealed: false,
        challengeIsCorrect: false,
        // Cravelha Manual
        pegCourseIdx: 2,
        pegTargetCents: -24,
        pegUserCents: 0,
        pegValidated: false,
        pegResidualError: 0
    };

    const DEFAULT_PONTEIO_PLAYER_STATE = {
        activeId: 'pagode_brasilia',
        isPlaying: false,
        currentStepIdx: -1,
        playbackSpeed: 1.0,
        isLooping: true
    };

    const DEFAULT_TAB_EDITOR_PROJECTS = [
        {
            id: 'minha_moda_caipira',
            title: 'Minha Primeira Moda Caipira',
            author: 'Violeiro do Nexus',
            instrumentId: 'viola_cebolao_e',
            timeSignature: '2/4',
            bpm: 96,
            key: 'Mi Maior (E) Cebolão',
            updatedAt: '2026-11-06T14:00:00.000Z',
            steps: [
                { measure: 1, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 2 }], d: 0.22, rh: 'p+i', lh: '0-2', chord: 'A', ann: 'Abertura em Lá' },
                { measure: 1, beat: '1 e', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.22, rh: 'p+i', lh: '1-2', chord: 'E', ann: 'Terça de Mi' },
                { measure: 1, beat: '2', notes: [{ c: 0, f: 2 }, { c: 1, f: 4 }], d: 0.22, rh: 'p+i', lh: '1-2', chord: 'B7', ann: 'Terça de Si7' },
                { measure: 1, beat: '2 e', notes: [{ c: 0, f: 0 }, { c: 1, f: 2 }], d: 0.22, rh: 'p+i', lh: '0-2', chord: 'A', ann: 'Terça de Lá' },
                { measure: 2, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }], d: 0.22, rh: 'p+i', lh: '0-0', chord: 'E', ann: 'Cordas soltas E/B' },
                { measure: 2, beat: '1 e', notes: [{ c: 2, f: 1 }], d: 0.22, rh: 'p', lh: '1', chord: 'E', ann: 'Bordão Turina Lá' },
                { measure: 2, beat: '2', notes: [{ c: 3, f: 2 }], d: 0.22, rh: 'p', lh: '2', chord: 'B7', ann: 'Bordão Toeira Fá#' },
                { measure: 2, beat: '2 e', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }, { c: 2, f: 0 }, { c: 3, f: 0 }, { c: 4, f: 0 }], d: 0.35, rh: 'rasq', lh: '0-0-0-0-0', chord: 'E', ann: 'Rasqueado de Mi Maior' }
            ]
        },
        {
            id: 'ponteio_sextas_estradao',
            title: 'Ponteio em Sextas do Estradão',
            author: 'Tradicional Caipira',
            instrumentId: 'viola_cebolao_e',
            timeSignature: '2/4',
            bpm: 92,
            key: 'Mi Maior (E) Cebolão',
            updatedAt: '2026-11-06T14:00:00.000Z',
            steps: [
                { measure: 1, beat: '1', notes: [{ c: 0, f: 7 }, { c: 2, f: 7 }], d: 0.24, rh: 'p+i', lh: '1-2', chord: 'B7', ann: 'Sexta na 7ª casa (Si/Fá#)' },
                { measure: 1, beat: '1 e', notes: [{ c: 0, f: 5 }, { c: 2, f: 5 }], d: 0.24, rh: 'p+i', lh: '1-2', chord: 'A', ann: 'Sexta na 5ª casa (Lá/Mi)' },
                { measure: 1, beat: '2', notes: [{ c: 0, f: 4 }, { c: 2, f: 4 }], d: 0.24, rh: 'p+i', lh: '1-2', chord: 'G#m', ann: 'Sexta na 4ª casa (Sol#/Ré#)' },
                { measure: 1, beat: '2 e', notes: [{ c: 0, f: 2 }, { c: 2, f: 2 }], d: 0.24, rh: 'p+i', lh: '1-2', chord: 'F#m', ann: 'Sexta na 2ª casa (Fá#/Dó#)' },
                { measure: 2, beat: '1', notes: [{ c: 0, f: 0 }, { c: 2, f: 0 }], d: 0.28, rh: 'p+i', lh: '0-0', chord: 'E', ann: 'Sexta solta (Mi/Si)' },
                { measure: 2, beat: '1 e', notes: [], d: 0.20, rh: 'tap', lh: '—', chord: '', ann: 'Batida de Tampo [TAP]' },
                { measure: 2, beat: '2', notes: [{ c: 3, f: 2 }], d: 0.24, rh: 'p', lh: '2', chord: 'B7', ann: 'Bordão Fá#' },
                { measure: 2, beat: '2 e', notes: [{ c: 4, f: 0 }], d: 0.32, rh: 'p', lh: '0', chord: 'E', ann: 'Bordão Si solto' }
            ]
        },
        {
            id: 'cururu_rio_tiete',
            title: 'Cururu do Rio Tietê',
            author: 'Mestre Tião Carreiro',
            instrumentId: 'viola_cebolao_e',
            timeSignature: '2/4',
            bpm: 104,
            key: 'Mi Maior (E) Cebolão',
            updatedAt: '2026-11-06T14:00:00.000Z',
            steps: [
                { measure: 1, beat: '1', notes: [{ c: 4, f: 0 }], d: 0.20, rh: 'p', lh: '0', chord: 'B', ann: 'Bordão 5º Par' },
                { measure: 1, beat: '1 e', notes: [{ c: 3, f: 2 }], d: 0.20, rh: 'p', lh: '2', chord: 'B7', ann: 'Toeira 2ª casa' },
                { measure: 1, beat: '2', notes: [{ c: 2, f: 1 }], d: 0.20, rh: 'i', lh: '1', chord: 'E', ann: 'Repique de Turina' },
                { measure: 1, beat: '2 e', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }], d: 0.20, rh: 'p+i', lh: '0-0', chord: 'E', ann: 'Prima e Segundinha soltas' },
                { measure: 2, beat: '1', notes: [], d: 0.18, rh: 'tap', lh: '—', chord: '', ann: 'Batida seca no tampo' },
                { measure: 2, beat: '1 e', notes: [{ c: 1, f: 2 }], d: 0.20, rh: 'i', lh: '1', chord: 'B7', ann: 'Repique 2º Par' },
                { measure: 2, beat: '2', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }], d: 0.24, rh: 'p+i', lh: '0-0', chord: 'E', ann: 'Soltas agudas' },
                { measure: 2, beat: '2 e', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }, { c: 2, f: 0 }, { c: 3, f: 0 }, { c: 4, f: 0 }], d: 0.32, rh: 'rasq', lh: '0-0-0-0-0', chord: 'E', ann: 'Rasqueado firme' }
            ]
        },
        {
            id: 'guarania_pantaneira',
            title: 'Guarânia Pantaneira',
            author: 'Inspirado em Almir Sater',
            instrumentId: 'viola_cebolao_e',
            timeSignature: '3/4',
            bpm: 76,
            key: 'Mi Maior (E) Cebolão',
            updatedAt: '2026-11-06T14:00:00.000Z',
            steps: [
                { measure: 1, beat: '1', notes: [{ c: 3, f: 0 }], d: 0.32, rh: 'p', lh: '0', chord: 'E', ann: 'Baixo fundamental' },
                { measure: 1, beat: '2', notes: [{ c: 2, f: 0 }, { c: 1, f: 0 }], d: 0.30, rh: 'p+i', lh: '0-0', chord: 'E', ann: 'Arpejo central' },
                { measure: 1, beat: '3', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.32, rh: 'p+i', lh: '1-2', chord: 'E', ann: 'Terça lírica aguda' },
                { measure: 2, beat: '1', notes: [{ c: 4, f: 2 }], d: 0.32, rh: 'p', lh: '2', chord: 'B7', ann: 'Baixo em Fá#' },
                { measure: 2, beat: '2', notes: [{ c: 2, f: 3 }, { c: 1, f: 4 }], d: 0.30, rh: 'p+i', lh: '1-2', chord: 'B7', ann: 'Dueto harmônico' },
                { measure: 2, beat: '3', notes: [{ c: 0, f: 2 }, { c: 1, f: 4 }], d: 0.36, rh: 'p+i', lh: '1-2', chord: 'B7', ann: 'Suspensão romântica' }
            ]
        }
    ];

    const DEFAULT_TAB_EDITOR_STATE = {
        activeProjectId: 'minha_moda_caipira',
        currentStepIdx: 0,
        isPlaying: false,
        playbackSpeed: 1.0,
        isLooping: true,
        projects: DEFAULT_TAB_EDITOR_PROJECTS.slice()
    };

    // =========================================================================
    // ESTRUTURAS DE DADOS: ESCALAS MODAIS CAIPIRAS (FASE 8)
    // =========================================================================
    const DEFAULT_MODAL_TRAINER_STATE = {
        modeId: 'lydian',
        rootPc: 4,                  // 4 = Mi / E (default p/ Viola Cebolão em Mi)
        regionFilter: 'FULL_NECK',  // 'FULL_NECK' | 'SHAPE_OPEN' | 'SHAPE_MID' | 'SHAPE_HIGH' | 'CHARACTERISTIC_ONLY'
        activeExerciseId: 'linear', // 'linear' | 'characteristic' | 'arpeggio' | 'duads' | 'folia'
        currentStepIdx: -1,
        isPlaying: false,
        playbackSpeed: 1.0,
        isLooping: true
    };

    const MODAL_ROOTS = [
        { pc: 4, name: 'Mi (E)', label: 'Mi (E) — Afinação Cebolão em Mi / Violão 6ª corda' },
        { pc: 2, name: 'Ré (D)', label: 'Ré (D) — Afinação Cebolão em Ré / Viola Boiadeira' },
        { pc: 7, name: 'Sol (G)', label: 'Sol (G) — Afinação Rio Abaixo' },
        { pc: 9, name: 'Lá (A)', label: 'Lá (A) — Subdominante Pastoral' },
        { pc: 11, name: 'Si (B)', label: 'Si (B) — Dominante Caipira' },
        { pc: 0, name: 'Dó (C)', label: 'Dó (C) — Tom Natural' },
        { pc: 5, name: 'Fá (F)', label: 'Fá (F)' },
        { pc: 6, name: 'Fá# (F#)', label: 'Fá# (F#)' }
    ];

    const MODAL_SCALES = {
        lydian: {
            id: 'lydian',
            name: 'Modo Lídio',
            subtitle: 'A Mística das Folias e da Viola Celestial',
            badge: 'Folia & Cantiga',
            badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
            intervals: [0, 2, 4, 6, 7, 9, 11],
            degreeNames: ['1', '2', '3', '♯4', '5', '6', '7'],
            characteristicDegrees: ['♯4'],
            characteristicIntervals: [6],
            charDegreeLabel: '4ª Aumentada (♯4)',
            description: 'Sonoridade aérea, luminosa e transcendental, típica das Folias de Reis de Minas e Goiás e das introduções atmosféricas de Almir Sater. A 4ª aumentada (♯4 / trítono lídio) quebra a gravidade tonal sem gerar o peso da escala menor, criando uma ressonância mística e cósmica que brilha com intensidade sobre o acorde solto do Cebolão em Mi.',
            folkContext: 'Folias de Reis mineiras e goianas, Cantigas Medievais Sertanejas e Ponteios Pantaneiros',
            generatingChords: [
                { roman: 'I', name: 'E', namePT: 'Mi Maior (Acorde Aberto Solto)' },
                { roman: 'II', name: 'F#', namePT: 'Fá# Maior (Acorde Característico Lídio)' },
                { roman: 'vii', name: 'D#m', namePT: 'Ré# Menor (Subtônica Aérea)' }
            ],
            techniqueTip: 'Explore o 1º par (Prima) solto (E) e toque a nota ♯4 (Lá# / A#) no 2º par (casa 11) ou no 3º par (casa 3). O choque acústico suave entre a fundamental Mi e a quarta aumentada Lá# gera o clássico "brilho de serra" do sertão mineiro.'
        },
        mixolydian: {
            id: 'mixolydian',
            name: 'Modo Mixolídio',
            subtitle: 'A Matriz do Baião, Catira, Pagode e Repente',
            badge: 'Baião & Catira',
            badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
            intervals: [0, 2, 4, 5, 7, 9, 10],
            degreeNames: ['1', '2', '3', '4', '5', '6', '♭7'],
            characteristicDegrees: ['♭7'],
            characteristicIntervals: [10],
            charDegreeLabel: '7ª Menor (♭7)',
            description: 'A alma rítmica e cadenciada do sertão brasileiro. A 7ª menor (♭7) substitui a sensível clássica europeia, retirando o caráter erudito estrito e imprimindo o suingue sincopado do Cururu, Pagode de Viola de Tião Carreiro, Cateretê paulista e repente nordestino.',
            folkContext: 'Pagode Caipira paulista, Catira mineira, Baião e Repente nordestino',
            generatingChords: [
                { roman: 'I', name: 'E', namePT: 'Mi Maior (Tônica Sertaneja)' },
                { roman: '♭VII', name: 'D', namePT: 'Ré Maior (Acorde de Balanço Mixolídio)' },
                { roman: 'v', name: 'Bm', namePT: 'Si Menor (Dominante Modal Suave)' }
            ],
            techniqueTip: 'No ritmo de Pagode ou Cururu, alterne rapidamente entre a tríade de Mi Maior e o acorde de Ré Maior (♭VII). O salto melódico para a nota Ré (♭7) no 4º ou 1º par é o segredo motor do fraseado tião-carreiriano.'
        },
        dorian: {
            id: 'dorian',
            name: 'Modo Dórico',
            subtitle: 'O Lamento Sertanejo & Balanço do Cariri',
            badge: 'Lamento & Toada',
            badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
            intervals: [0, 2, 3, 5, 7, 9, 10],
            degreeNames: ['1', '2', '♭3', '4', '5', '6', '♭7'],
            characteristicDegrees: ['♭3', '6'],
            characteristicIntervals: [3, 9],
            charDegreeLabel: '3ª Menor (♭3) & 6ª Maior (6M)',
            description: 'O lamento profundo do sertanejo sem desespero ou vitimização. A combinação da 3ª menor (♭3) com a 6ª maior (6M) traz uma nobreza altiva à dor, imortalizada em obras como "Vaca Estrela e Boi Fubá" e toadas antigas do sertão profundo.',
            folkContext: 'Sertão do Cariri, Toadas de Despedida e Lamentos de Violeiros',
            generatingChords: [
                { roman: 'i', name: 'Em', namePT: 'Mi Menor (Tônica de Lamento)' },
                { roman: 'IV', name: 'A', namePT: 'Lá Maior (Acorde Iluminador da 6ª Maior)' },
                { roman: 'ii', name: 'F#m', namePT: 'Fá# Menor (Cadência Melancólica)' }
            ],
            techniqueTip: 'A transição entre o acorde Em (i) e A (IV maior) é a assinatura dórica. No ponteio, destaque a nota C# (6M) resolvendo suavemente na nota B (5J), gerando a sensação de consolo lírico.'
        },
        nordestino: {
            id: 'nordestino',
            name: 'Modo Nordestino (Escala Acústica / Lídio ♭7)',
            subtitle: 'O Encontro da Viola Caipira com o Forró Pé-de-Serra',
            badge: 'Ponteio Fronteiriço',
            badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
            intervals: [0, 2, 4, 6, 7, 9, 10],
            degreeNames: ['1', '2', '3', '♯4', '5', '6', '♭7'],
            characteristicDegrees: ['♯4', '♭7'],
            characteristicIntervals: [6, 10],
            charDegreeLabel: '4ª Aum (♯4) & 7ª Menor (♭7)',
            description: 'A síntese suprema entre a mística do Lídio e a cadência dançante do Mixolídio. Também conhecida como Escala Acústica (4º modo da Menor Melódica), é a assinatura do ponteio nordestino, aboio de vaqueiro e das canções épicas da literatura de cordel sertaneja.',
            folkContext: 'Forró Pé-de-Serra, Aboios do Sertão, Cantigas de Cordel e Viola Nordestina',
            generatingChords: [
                { roman: 'I7', name: 'E7', namePT: 'Mi com Sétima (Dominante Caipira)' },
                { roman: 'II', name: 'F#', namePT: 'Fá# Maior (Tensão Lídia)' },
                { roman: '♭VII', name: 'D', namePT: 'Ré Maior (Balanço Nordestino)' }
            ],
            techniqueTip: 'Execute ponteios velozes com palhetada alternada descendo da 7ª casa até as cordas soltas, enfatizando o trítono (A#) e a sétima menor (D) com apoio do polegar nos bordões.'
        },
        ionian: {
            id: 'ionian',
            name: 'Modo Jônio (Maior Caipira)',
            subtitle: 'A Clareza Cristalina do Cebolão em Mi Aberto',
            badge: 'Matriz Caipira',
            badgeColor: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
            intervals: [0, 2, 4, 5, 7, 9, 11],
            degreeNames: ['1', '2', '3', '4', '5', '6', '7'],
            characteristicDegrees: ['3', '7'],
            characteristicIntervals: [4, 11],
            charDegreeLabel: '3ª Maior (3M) & 7ª Maior (7M)',
            description: 'A afinação Cebolão em Mi da viola caipira já é, por natureza física, um acorde perfeito maior aberto. O Modo Jônio é a referência natural da música caipira de raiz, transmitindo serenidade, festa da colheita e religiosidade campestre.',
            folkContext: 'Modas de Viola de raiz, Toadas Românticas e Festas Tradicionais da Roça',
            generatingChords: [
                { roman: 'I', name: 'E', namePT: 'Mi Maior (Acorde Aberto Solto)' },
                { roman: 'IV', name: 'A', namePT: 'Lá Maior (Subdominante Pastoral)' },
                { roman: 'V7', name: 'B7', namePT: 'Si com Sétima (Dominante Caipira)' }
            ],
            techniqueTip: 'Aproveite a ressonância por simpatia das cordas soltas. O dueto em terças nos dois primeiros pares (Prima e Segundinha) é a marca registrada incontestável da afinação Cebolão.'
        },
        aeolian: {
            id: 'aeolian',
            name: 'Modo Eólio (Menor Natural)',
            subtitle: 'A Saudade Sertaneja & As Noites do Estradão',
            badge: 'Saudade & Noite',
            badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
            intervals: [0, 2, 3, 5, 7, 8, 10],
            degreeNames: ['1', '2', '♭3', '4', '5', '♭6', '♭7'],
            characteristicDegrees: ['♭6'],
            characteristicIntervals: [8],
            charDegreeLabel: '6ª Menor (♭6)',
            description: 'A expressão da saudade pura, dos causos de assombração na beira do fogo e das modas dramáticas sobre a vida dura no estradão de terra batida.',
            folkContext: 'Causos de Assombração, Modas Tristes e Canções Noturnas de Tropeiros',
            generatingChords: [
                { roman: 'i', name: 'Em', namePT: 'Mi Menor (Nostalgia Pura)' },
                { roman: 'iv', name: 'Am', namePT: 'Lá Menor (Subdominante Melancólica)' },
                { roman: '♭VI', name: 'C', namePT: 'Dó Maior (Acorde de Esperança)' }
            ],
            techniqueTip: 'Dedilhe os bordões graves (4º e 5º pares oitavados) com o polegar em toques apoiados, deixando-os vibrar enquanto a melodia chora nos pares agudos.'
        }
    };

    const MODAL_EXERCISES_INFO = {
        linear: {
            id: 'linear',
            title: 'Subida & Descida Linear',
            badge: 'Fundamentos de Digitação',
            desc: 'Subida contínua da tônica até a oitava e descida ao longo dos pares, fixando a memória muscular e visual dos shapes modais.'
        },
        characteristic: {
            id: 'characteristic',
            title: 'Foco na Nota Característica',
            badge: 'Cor Sonora do Modo',
            desc: 'Frase melódica caipira desenhada para enfatizar e isolar a nota característica (♯4 no Lídio, ♭7 no Mixolídio, 6M no Dórico).'
        },
        arpeggio: {
            id: 'arpeggio',
            title: 'Arpejo da Tríade + Cor Modal',
            badge: 'Conexão Harmônica',
            desc: 'Dedilhado do acorde fundamental enriquecido pela nota modal, conectando harmonia de base ao solo melódico.'
        },
        duads: {
            id: 'duads',
            title: 'Dueto em Terças / Sextas',
            badge: 'Ponteio Canônico a 2 Vozes',
            desc: 'Execução de duetos simultâneos nos pares 1 e 2 aplicando os graus modais em terças e sextas caipiras.'
        },
        folia: {
            id: 'folia',
            title: 'Fraseado Tradicional do Sertão',
            badge: 'Estilo & Cadência Autêntica',
            desc: 'Frase completa com síncopes sertanejas, repiques e cadência típica da tradição oral brasileira.'
        }
    };
        {
            id: 'minha_moda_caipira',
            title: 'Minha Primeira Moda Caipira',
            author: 'Violeiro do Nexus',
            instrumentId: 'viola_cebolao_e',
            timeSignature: '2/4',
            bpm: 96,
            key: 'Mi Maior (E) Cebolão',
            updatedAt: '2026-11-06T14:00:00.000Z',
            steps: [
                { measure: 1, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 2 }], d: 0.22, rh: 'p+i', lh: '0-2', chord: 'A', ann: 'Abertura em Lá' },
                { measure: 1, beat: '1 e', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.22, rh: 'p+i', lh: '1-2', chord: 'E', ann: 'Terça de Mi' },
                { measure: 1, beat: '2', notes: [{ c: 0, f: 2 }, { c: 1, f: 4 }], d: 0.22, rh: 'p+i', lh: '1-2', chord: 'B7', ann: 'Terça de Si7' },
                { measure: 1, beat: '2 e', notes: [{ c: 0, f: 0 }, { c: 1, f: 2 }], d: 0.22, rh: 'p+i', lh: '0-2', chord: 'A', ann: 'Terça de Lá' },
                { measure: 2, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }], d: 0.22, rh: 'p+i', lh: '0-0', chord: 'E', ann: 'Cordas soltas E/B' },
                { measure: 2, beat: '1 e', notes: [{ c: 2, f: 1 }], d: 0.22, rh: 'p', lh: '1', chord: 'E', ann: 'Bordão Turina Lá' },
                { measure: 2, beat: '2', notes: [{ c: 3, f: 2 }], d: 0.22, rh: 'p', lh: '2', chord: 'B7', ann: 'Bordão Toeira Fá#' },
                { measure: 2, beat: '2 e', notes: [], d: 0.22, rh: 'tap', lh: '—', chord: 'E', ann: 'Batida no tampo [TAP]' },
                { measure: 3, beat: '1', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.22, rh: 'p+i', lh: '1-2', chord: 'E', ann: 'Cascata de Mi' },
                { measure: 3, beat: '1 e', notes: [{ c: 0, f: 2 }, { c: 1, f: 4 }], d: 0.22, rh: 'p+i', lh: '1-2', chord: 'B7', ann: 'Descida em terças' },
                { measure: 3, beat: '2', notes: [{ c: 0, f: 0 }, { c: 1, f: 2 }], d: 0.22, rh: 'p+i', lh: '0-2', chord: 'A', ann: 'Resolução em Lá' },
                { measure: 3, beat: '2 e', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }], d: 0.24, rh: 'p+i', lh: '0-0', chord: 'E', ann: 'Acorde solto' },
                { measure: 4, beat: '1', notes: [{ c: 3, f: 2 }, { c: 4, f: 2 }], d: 0.28, rh: 'p', lh: '2-2', chord: 'B7', ann: 'Bordão Si' },
                { measure: 4, beat: '2', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }, { c: 2, f: 0 }, { c: 3, f: 0 }, { c: 4, f: 0 }], d: 0.60, rh: 'rasq', lh: '0', chord: 'E', ann: 'Rasqueado final de Mi' }
            ]
        },
        {
            id: 'ponteio_sextas_estradao',
            title: 'Ponteio em Sextas do Estradão',
            author: 'Violeiro do Nexus',
            instrumentId: 'viola_cebolao_e',
            timeSignature: '2/4',
            bpm: 88,
            key: 'Mi Maior (E) Cebolão',
            updatedAt: '2026-11-06T14:00:00.000Z',
            steps: [
                { measure: 1, beat: '1', notes: [{ c: 0, f: 0 }, { c: 2, f: 0 }], d: 0.25, rh: 'p+i', lh: '0-0', chord: 'E', ann: 'Sexta solta E/G#' },
                { measure: 1, beat: '1 e', notes: [{ c: 0, f: 2 }, { c: 2, f: 1 }], d: 0.25, rh: 'p+i', lh: '2-1', chord: 'F#m', ann: 'Sexta menor F#/A' },
                { measure: 1, beat: '2', notes: [{ c: 0, f: 4 }, { c: 2, f: 3 }], d: 0.25, rh: 'p+i', lh: '2-1', chord: 'G#m', ann: 'Sexta menor G#/B' },
                { measure: 1, beat: '2 e', notes: [{ c: 0, f: 5 }, { c: 2, f: 5 }], d: 0.30, rh: 'p+i', lh: '1-1', chord: 'A', ann: 'Sexta Maior A/C#' },
                { measure: 2, beat: '1', notes: [{ c: 0, f: 7 }, { c: 2, f: 7 }], d: 0.30, rh: 'p+i', lh: '1-1', chord: 'B', ann: 'Sexta Maior B/D#' },
                { measure: 2, beat: '1 e', notes: [{ c: 0, f: 5 }, { c: 2, f: 5 }], d: 0.25, rh: 'p+i', lh: '1-1', chord: 'A', ann: 'Retorno A/C#' },
                { measure: 2, beat: '2', notes: [{ c: 0, f: 4 }, { c: 2, f: 3 }], d: 0.25, rh: 'p+i', lh: '2-1', chord: 'G#m', ann: 'Passagem G#/B' },
                { measure: 2, beat: '2 e', notes: [{ c: 0, f: 2 }, { c: 2, f: 1 }], d: 0.25, rh: 'p+i', lh: '2-1', chord: 'F#m', ann: 'Passagem F#/A' },
                { measure: 3, beat: '1', notes: [{ c: 0, f: 0 }, { c: 2, f: 0 }], d: 0.35, rh: 'p+i', lh: '0-0', chord: 'E', ann: 'Resolução E/G#' },
                { measure: 3, beat: '1 e', notes: [{ c: 3, f: 2 }], d: 0.24, rh: 'p', lh: '2', chord: 'B7', ann: 'Bordão Toeira' },
                { measure: 3, beat: '2', notes: [{ c: 4, f: 2 }], d: 0.26, rh: 'p', lh: '2', chord: 'B7', ann: 'Canotilho Si' },
                { measure: 3, beat: '2 e', notes: [], d: 0.22, rh: 'tap', lh: '—', chord: 'E', ann: 'Batida no tampo [TAP]' },
                { measure: 4, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }, { c: 2, f: 0 }, { c: 3, f: 0 }, { c: 4, f: 0 }], d: 0.60, rh: 'rasq', lh: '0', chord: 'E', ann: 'Rasqueado de Mi' }
            ]
        },
        {
            id: 'cururu_duelo_tiete',
            title: 'Cururu do Rio Tietê',
            author: 'Violeiro do Nexus',
            instrumentId: 'viola_cebolao_e',
            timeSignature: '2/4',
            bpm: 108,
            key: 'Mi Maior (E) Cebolão',
            updatedAt: '2026-11-06T14:00:00.000Z',
            steps: [
                { measure: 1, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }], d: 0.18, rh: 'p+i', lh: '0-0', chord: 'E', ann: 'Abertura rápida' },
                { measure: 1, beat: '1 e', notes: [{ c: 0, f: 2 }, { c: 1, f: 2 }], d: 0.18, rh: 'p+i', lh: '1-1', chord: 'F#m', ann: 'Dueto de passagem' },
                { measure: 1, beat: '2', notes: [{ c: 0, f: 4 }, { c: 1, f: 4 }], d: 0.18, rh: 'p+i', lh: '1-1', chord: 'G#m', ann: 'Subida ligeira' },
                { measure: 1, beat: '2 e', notes: [{ c: 0, f: 5 }, { c: 1, f: 5 }], d: 0.20, rh: 'p+i', lh: '1-1', chord: 'A', ann: 'Apoio em Lá' },
                { measure: 2, beat: '1', notes: [{ c: 0, f: 7 }, { c: 1, f: 7 }], d: 0.20, rh: 'p+i', lh: '1-1', chord: 'B', ann: 'Repique agudo' },
                { measure: 2, beat: '1 e', notes: [{ c: 0, f: 5 }, { c: 1, f: 5 }], d: 0.18, rh: 'p+i', lh: '1-1', chord: 'A', ann: 'Descida' },
                { measure: 2, beat: '2', notes: [{ c: 0, f: 4 }, { c: 1, f: 4 }], d: 0.18, rh: 'p+i', lh: '1-1', chord: 'G#m', ann: 'Passagem' },
                { measure: 2, beat: '2 e', notes: [], d: 0.22, rh: 'tap', lh: '—', chord: 'E', ann: 'Batida de tampo [TAP]' },
                { measure: 3, beat: '1', notes: [{ c: 2, f: 1 }], d: 0.20, rh: 'p', lh: '1', chord: 'E', ann: 'Bordão Lá' },
                { measure: 3, beat: '1 e', notes: [{ c: 3, f: 2 }], d: 0.20, rh: 'p', lh: '2', chord: 'B7', ann: 'Bordão Fá#' },
                { measure: 3, beat: '2', notes: [{ c: 4, f: 2 }], d: 0.22, rh: 'p', lh: '2', chord: 'B7', ann: 'Canotilho Si' },
                { measure: 3, beat: '2 e', notes: [{ c: 4, f: 0 }], d: 0.22, rh: 'p', lh: '0', chord: 'E', ann: 'Canotilho solto Mi' },
                { measure: 4, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }, { c: 2, f: 0 }, { c: 3, f: 0 }, { c: 4, f: 0 }], d: 0.50, rh: 'rasq', lh: '0', chord: 'E', ann: 'Rasqueado firme' }
            ]
        },
        {
            id: 'guarania_pantaneira',
            title: 'Guarânia Pantaneira',
            author: 'Violeiro do Nexus',
            instrumentId: 'viola_cebolao_e',
            timeSignature: '3/4',
            bpm: 76,
            key: 'Mi Maior (E) Cebolão',
            updatedAt: '2026-11-06T14:00:00.000Z',
            steps: [
                { measure: 1, beat: '1', notes: [{ c: 4, f: 0 }], d: 0.32, rh: 'p', lh: '0', chord: 'E', ann: 'Baixo Mi no tempo 1' },
                { measure: 1, beat: '2', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }], d: 0.30, rh: 'i+m', lh: '0-0', chord: 'E', ann: 'Acorde solto' },
                { measure: 1, beat: '3', notes: [{ c: 2, f: 0 }], d: 0.28, rh: 'p', lh: '0', chord: 'E', ann: 'Turina solta' },
                { measure: 2, beat: '1', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.34, rh: 'p+i', lh: '1-2', chord: 'E', ann: 'Dueto lírico em terças' },
                { measure: 2, beat: '2', notes: [{ c: 0, f: 2 }, { c: 1, f: 4 }], d: 0.30, rh: 'p+i', lh: '1-2', chord: 'B7', ann: 'Terça de Si7' },
                { measure: 2, beat: '3', notes: [{ c: 0, f: 0 }, { c: 1, f: 2 }], d: 0.30, rh: 'p+i', lh: '0-2', chord: 'A', ann: 'Terça de Lá' },
                { measure: 3, beat: '1', notes: [{ c: 3, f: 2 }], d: 0.32, rh: 'p', lh: '2', chord: 'B7', ann: 'Bordão Si' },
                { measure: 3, beat: '2', notes: [{ c: 0, f: 2 }, { c: 1, f: 0 }], d: 0.30, rh: 'i+m', lh: '2-0', chord: 'B7', ann: 'Acorde Si7' },
                { measure: 3, beat: '3', notes: [], d: 0.25, rh: 'tap', lh: '—', chord: 'B7', ann: 'Batida leve no tampo' },
                { measure: 4, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }, { c: 2, f: 0 }, { c: 3, f: 0 }, { c: 4, f: 0 }], d: 0.70, rh: 'rasq', lh: '0', chord: 'E', ann: 'Rasqueado de Mi profundo' }
            ]
        }
    ];

    // =========================================================================
    // ESTRUTURAS DE DADOS: ANALISADOR DE TENSÃO & AÇÃO DE CORDAS (FASE 9)
    // =========================================================================
    const DEFAULT_TENSION_STATE = {
        presetId: 'viola_cebolao_e_media',
        scaleLengthMm: 580,             // Escala padrão de Viola Caipira: 580 mm (Violão: 650 mm)
        pitchOffsetSemitones: 0,        // -2 (Tom abaixo), -1 (1/2 tom abaixo), 0 (Nominal), +1 (1/2 tom acima)
        customGauges: null,             // Matriz com calibres personalizados caso editado pelo usuário
        stringMaterial: 'steel_bronze', // 'steel_bronze' | 'steel_nickel' | 'steel_stainless' | 'nylon_classical'
        actionMeasureNutTreble: 0.50,   // Medição 1º traste prima em mm
        actionMeasureNutBass: 0.65,     // Medição 1º traste bordão em mm
        actionMeasure12thTreble: 2.30,  // Medição 12º traste prima em mm
        actionMeasure12thBass: 2.70,    // Medição 12º traste bordão em mm
        targetActionProfile: 'caipira_versatil' // 'solo_baixo' | 'caipira_versatil' | 'rasqueado_alto'
    };

    const STRING_MATERIALS = {
        steel_bronze: { name: 'Bronze 85/15 Caipira / Phosphor Bronze', factor: 1.0, badge: 'Bronze / Ressonante', badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
        steel_nickel: { name: 'Aço Niquelado (Nickel-Plated Steel)', factor: 0.99, badge: 'Níquel / Macio', badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
        steel_stainless: { name: 'Aço Inox (Stainless Steel)', factor: 1.01, badge: 'Inox / Brilhante', badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
        nylon_classical: { name: 'Nylon Cristal / Silverplated Wound', factor: 1.0, badge: 'Nylon / Nobre', badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' }
    };

    const ACTION_TARGET_PROFILES = {
        solo_baixo: {
            id: 'solo_baixo',
            name: 'Solo & Ponteio Ágil (Ação Baixa)',
            badge: 'Ponteio Rápido / Baixa',
            badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
            description: 'Toque suave e veloz para ponteios em terças rápidas. Mínimo esforço para a mão de digitação e facilidade para pestanas prolongadas.',
            viola: { nutTreble: 0.45, nutBass: 0.55, fret12Treble: 1.90, fret12Bass: 2.30 },
            violao_nylon: { nutTreble: 0.65, nutBass: 0.75, fret12Treble: 2.60, fret12Bass: 3.20 },
            violao_aco: { nutTreble: 0.45, nutBass: 0.55, fret12Treble: 1.80, fret12Bass: 2.30 }
        },
        caipira_versatil: {
            id: 'caipira_versatil',
            name: 'Padrão Caipira Versátil (Recomendada)',
            badge: 'Equilíbrio Canônico / Média',
            badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
            description: 'A regulagem consagrada pelos mestres luthieres caipiras: excelente dinâmica tanto para ponteios límpidos quanto para batidas e rasqueados sem trastejamento.',
            viola: { nutTreble: 0.50, nutBass: 0.65, fret12Treble: 2.30, fret12Bass: 2.70 },
            violao_nylon: { nutTreble: 0.70, nutBass: 0.80, fret12Treble: 2.90, fret12Bass: 3.50 },
            violao_aco: { nutTreble: 0.50, nutBass: 0.60, fret12Treble: 2.10, fret12Bass: 2.60 }
        },
        rasqueado_alto: {
            id: 'rasqueado_alto',
            name: 'Batida Forte, Pagode & Rasqueado (Ação Alta)',
            badge: 'Batida Pesada / Alta',
            badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
            description: 'Mais espaço para oscilação das cordas em rasqueados enérgicos, repiques de Pagode de Viola e palhetadas vigorosas sem ruído nos trastes.',
            viola: { nutTreble: 0.55, nutBass: 0.70, fret12Treble: 2.70, fret12Bass: 3.20 },
            violao_nylon: { nutTreble: 0.75, nutBass: 0.85, fret12Treble: 3.20, fret12Bass: 3.90 },
            violao_aco: { nutTreble: 0.55, nutBass: 0.65, fret12Treble: 2.40, fret12Bass: 2.90 }
        }
    };

    const LINEAR_MASS_TABLE = {
        plain_steel: {
            get: (d) => 3.978 * Math.pow(d, 2)
        },
        wound_steel: {
            samplePoints: [
                { d: 0.018, mu: 0.00125 },
                { d: 0.019, mu: 0.00140 },
                { d: 0.022, mu: 0.00185 },
                { d: 0.024, mu: 0.00220 },
                { d: 0.026, mu: 0.00260 },
                { d: 0.028, mu: 0.00305 },
                { d: 0.030, mu: 0.00350 },
                { d: 0.032, mu: 0.00400 },
                { d: 0.034, mu: 0.00455 },
                { d: 0.038, mu: 0.00565 },
                { d: 0.042, mu: 0.00695 },
                { d: 0.047, mu: 0.00870 },
                { d: 0.053, mu: 0.01110 }
            ],
            get: function (d) {
                const pts = this.samplePoints;
                if (d <= pts[0].d) return pts[0].mu * Math.pow(d / pts[0].d, 2);
                if (d >= pts[pts.length - 1].d) return pts[pts.length - 1].mu * Math.pow(d / pts[pts.length - 1].d, 2);
                for (let i = 0; i < pts.length - 1; i++) {
                    if (d >= pts[i].d && d <= pts[i + 1].d) {
                        const ratio = (d - pts[i].d) / (pts[i + 1].d - pts[i].d);
                        return pts[i].mu + ratio * (pts[i + 1].mu - pts[i].mu);
                    }
                }
                return 3.22 * Math.pow(d, 2) + 0.00015;
            }
        },
        nylon_plain: {
            get: (d) => 0.578 * Math.pow(d, 2)
        },
        nylon_wound: {
            samplePoints: [
                { d: 0.028, mu: 0.00170 },
                { d: 0.029, mu: 0.00185 },
                { d: 0.032, mu: 0.00225 },
                { d: 0.035, mu: 0.00270 },
                { d: 0.038, mu: 0.00325 },
                { d: 0.043, mu: 0.00410 },
                { d: 0.045, mu: 0.00450 }
            ],
            get: function (d) {
                const pts = this.samplePoints;
                if (d <= pts[0].d) return pts[0].mu * Math.pow(d / pts[0].d, 2);
                if (d >= pts[pts.length - 1].d) return pts[pts.length - 1].mu * Math.pow(d / pts[pts.length - 1].d, 2);
                for (let i = 0; i < pts.length - 1; i++) {
                    if (d >= pts[i].d && d <= pts[i + 1].d) {
                        const ratio = (d - pts[i].d) / (pts[i + 1].d - pts[i].d);
                        return pts[i].mu + ratio * (pts[i + 1].mu - pts[i].mu);
                    }
                }
                return 2.15 * Math.pow(d, 2);
            }
        }
    };

    const TENSION_PRESETS = {
        viola_cebolao_e_leve: {
            id: 'viola_cebolao_e_leve',
            instrumentId: 'viola_cebolao_e',
            name: 'Viola Cebolão em Mi — Tensão Leve (.009 - .034)',
            badge: 'Toque Macio / Conforto',
            badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
            description: 'Ideal para dedos sensíveis, violas de tampo fino ou estudo prolongado sem fadiga muscular.',
            defaultScaleMm: 580,
            material: 'steel_nickel',
            courses: [
                { num: 1, label: '1º Par (Prima)', note: 'E4', strings: [{ gauge: 0.009, type: 'plain', midi: 64 }, { gauge: 0.009, type: 'plain', midi: 64 }] },
                { num: 2, label: '2º Par (Segundinha)', note: 'B3', strings: [{ gauge: 0.012, type: 'plain', midi: 59 }, { gauge: 0.012, type: 'plain', midi: 59 }] },
                { num: 3, label: '3º Par (Turina)', note: 'G#3/G#4', strings: [{ gauge: 0.019, type: 'wound', midi: 56 }, { gauge: 0.009, type: 'plain', midi: 68 }] },
                { num: 4, label: '4º Par (Toeira)', note: 'E3/E4', strings: [{ gauge: 0.026, type: 'wound', midi: 52 }, { gauge: 0.012, type: 'plain', midi: 64 }] },
                { num: 5, label: '5º Par (Canotilho)', note: 'B2/B3', strings: [{ gauge: 0.034, type: 'wound', midi: 47 }, { gauge: 0.015, type: 'plain', midi: 59 }] }
            ]
        },
        viola_cebolao_e_media: {
            id: 'viola_cebolao_e_media',
            instrumentId: 'viola_cebolao_e',
            name: 'Viola Cebolão em Mi — Tensão Média (.010 - .038)',
            badge: 'Padrão Consagrado / Luthier',
            badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
            description: 'O encordoamento canônico mais utilizado na viola brasileira. Equilíbrio perfeito entre ataque, volume, ressonância e pressão controlada no tampo.',
            defaultScaleMm: 580,
            material: 'steel_bronze',
            courses: [
                { num: 1, label: '1º Par (Prima)', note: 'E4', strings: [{ gauge: 0.010, type: 'plain', midi: 64 }, { gauge: 0.010, type: 'plain', midi: 64 }] },
                { num: 2, label: '2º Par (Segundinha)', note: 'B3', strings: [{ gauge: 0.013, type: 'plain', midi: 59 }, { gauge: 0.013, type: 'plain', midi: 59 }] },
                { num: 3, label: '3º Par (Turina)', note: 'G#3/G#4', strings: [{ gauge: 0.022, type: 'wound', midi: 56 }, { gauge: 0.010, type: 'plain', midi: 68 }] },
                { num: 4, label: '4º Par (Toeira)', note: 'E3/E4', strings: [{ gauge: 0.028, type: 'wound', midi: 52 }, { gauge: 0.013, type: 'plain', midi: 64 }] },
                { num: 5, label: '5º Par (Canotilho)', note: 'B2/B3', strings: [{ gauge: 0.038, type: 'wound', midi: 47 }, { gauge: 0.018, type: 'plain', midi: 59 }] }
            ]
        },
        viola_cebolao_e_pesada: {
            id: 'viola_cebolao_e_pesada',
            instrumentId: 'viola_cebolao_e',
            name: 'Viola Cebolão em Mi — Tensão Pesada (.011 - .042)',
            badge: 'Alta Projeção / Violeiro Raiz',
            badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
            description: 'Pressão alta para violeiros que tocam ao ar livre ou em duplas sem microfonação forte. Exige tampo reforçado e tensor metálico.',
            defaultScaleMm: 580,
            material: 'steel_bronze',
            courses: [
                { num: 1, label: '1º Par (Prima)', note: 'E4', strings: [{ gauge: 0.011, type: 'plain', midi: 64 }, { gauge: 0.011, type: 'plain', midi: 64 }] },
                { num: 2, label: '2º Par (Segundinha)', note: 'B3', strings: [{ gauge: 0.014, type: 'plain', midi: 59 }, { gauge: 0.014, type: 'plain', midi: 59 }] },
                { num: 3, label: '3º Par (Turina)', note: 'G#3/G#4', strings: [{ gauge: 0.024, type: 'wound', midi: 56 }, { gauge: 0.011, type: 'plain', midi: 68 }] },
                { num: 4, label: '4º Par (Toeira)', note: 'E3/E4', strings: [{ gauge: 0.030, type: 'wound', midi: 52 }, { gauge: 0.014, type: 'plain', midi: 64 }] },
                { num: 5, label: '5º Par (Canotilho)', note: 'B2/B3', strings: [{ gauge: 0.042, type: 'wound', midi: 47 }, { gauge: 0.020, type: 'plain', midi: 59 }] }
            ]
        },
        viola_cebolao_d_media: {
            id: 'viola_cebolao_d_media',
            instrumentId: 'viola_cebolao_d',
            name: 'Viola Cebolão em Ré — Tensão Média (.010 - .038)',
            badge: 'Afinação Baixa / Veludo',
            badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
            description: 'Afinação clássica tradicional da música sertaneja caipira dos anos 1940-60. Tensão mais baixa e som aveludado profundo.',
            defaultScaleMm: 580,
            material: 'steel_bronze',
            courses: [
                { num: 1, label: '1º Par (Prima)', note: 'D4', strings: [{ gauge: 0.010, type: 'plain', midi: 62 }, { gauge: 0.010, type: 'plain', midi: 62 }] },
                { num: 2, label: '2º Par (Segundinha)', note: 'A3', strings: [{ gauge: 0.013, type: 'plain', midi: 57 }, { gauge: 0.013, type: 'plain', midi: 57 }] },
                { num: 3, label: '3º Par (Turina)', note: 'F#3/F#4', strings: [{ gauge: 0.022, type: 'wound', midi: 54 }, { gauge: 0.010, type: 'plain', midi: 66 }] },
                { num: 4, label: '4º Par (Toeira)', note: 'D3/D4', strings: [{ gauge: 0.028, type: 'wound', midi: 50 }, { gauge: 0.013, type: 'plain', midi: 62 }] },
                { num: 5, label: '5º Par (Canotilho)', note: 'A2/A3', strings: [{ gauge: 0.038, type: 'wound', midi: 45 }, { gauge: 0.018, type: 'plain', midi: 57 }] }
            ]
        },
        viola_cebolao_d_pesada: {
            id: 'viola_cebolao_d_pesada',
            instrumentId: 'viola_cebolao_d',
            name: 'Viola Cebolão em Ré — Tensão Pesada (.011 - .042)',
            badge: 'Tião Carreiro Ré',
            badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
            description: 'Conjunto pesado ajustado para afinação em Ré. Compensa o tom a menos e entrega pegada firme com excelente tensão mecânica.',
            defaultScaleMm: 580,
            material: 'steel_bronze',
            courses: [
                { num: 1, label: '1º Par (Prima)', note: 'D4', strings: [{ gauge: 0.011, type: 'plain', midi: 62 }, { gauge: 0.011, type: 'plain', midi: 62 }] },
                { num: 2, label: '2º Par (Segundinha)', note: 'A3', strings: [{ gauge: 0.014, type: 'plain', midi: 57 }, { gauge: 0.014, type: 'plain', midi: 57 }] },
                { num: 3, label: '3º Par (Turina)', note: 'F#3/F#4', strings: [{ gauge: 0.024, type: 'wound', midi: 54 }, { gauge: 0.011, type: 'plain', midi: 66 }] },
                { num: 4, label: '4º Par (Toeira)', note: 'D3/D4', strings: [{ gauge: 0.030, type: 'wound', midi: 50 }, { gauge: 0.014, type: 'plain', midi: 62 }] },
                { num: 5, label: '5º Par (Canotilho)', note: 'A2/A3', strings: [{ gauge: 0.042, type: 'wound', midi: 45 }, { gauge: 0.020, type: 'plain', midi: 57 }] }
            ]
        },
        viola_rio_abaixo_media: {
            id: 'viola_rio_abaixo_media',
            instrumentId: 'viola_rio_abaixo',
            name: 'Viola Rio Abaixo em Sol — Tensão Média (.010 - .038)',
            badge: 'Pantanal & Mística',
            badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
            description: 'A afinação do diabo e das toadas pantaneiras. 5º par afinado no Sol grave.',
            defaultScaleMm: 580,
            material: 'steel_bronze',
            courses: [
                { num: 1, label: '1º Par (Prima)', note: 'D4', strings: [{ gauge: 0.010, type: 'plain', midi: 62 }, { gauge: 0.010, type: 'plain', midi: 62 }] },
                { num: 2, label: '2º Par (Segundinha)', note: 'B3', strings: [{ gauge: 0.013, type: 'plain', midi: 59 }, { gauge: 0.013, type: 'plain', midi: 59 }] },
                { num: 3, label: '3º Par (Turina)', note: 'G3/G4', strings: [{ gauge: 0.022, type: 'wound', midi: 55 }, { gauge: 0.010, type: 'plain', midi: 67 }] },
                { num: 4, label: '4º Par (Toeira)', note: 'D3/D4', strings: [{ gauge: 0.028, type: 'wound', midi: 50 }, { gauge: 0.013, type: 'plain', midi: 62 }] },
                { num: 5, label: '5º Par (Canotilho)', note: 'G2/G3', strings: [{ gauge: 0.038, type: 'wound', midi: 43 }, { gauge: 0.018, type: 'plain', midi: 55 }] }
            ]
        },
        viola_boiadeira_media: {
            id: 'viola_boiadeira_media',
            instrumentId: 'viola_boiadeira',
            name: 'Viola Boiadeira — Tensão Média (.010 - .038)',
            badge: 'Boiadeiro & Estrada',
            badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
            description: 'Afinação híbrida entre o Cebolão e o Rio Abaixo, com o 5º par em Sol grave.',
            defaultScaleMm: 580,
            material: 'steel_bronze',
            courses: [
                { num: 1, label: '1º Par (Prima)', note: 'D4', strings: [{ gauge: 0.010, type: 'plain', midi: 62 }, { gauge: 0.010, type: 'plain', midi: 62 }] },
                { num: 2, label: '2º Par (Segundinha)', note: 'A3', strings: [{ gauge: 0.013, type: 'plain', midi: 57 }, { gauge: 0.013, type: 'plain', midi: 57 }] },
                { num: 3, label: '3º Par (Turina)', note: 'F#3/F#4', strings: [{ gauge: 0.022, type: 'wound', midi: 54 }, { gauge: 0.010, type: 'plain', midi: 66 }] },
                { num: 4, label: '4º Par (Toeira)', note: 'D3/D4', strings: [{ gauge: 0.028, type: 'wound', midi: 50 }, { gauge: 0.013, type: 'plain', midi: 62 }] },
                { num: 5, label: '5º Par (Canotilho)', note: 'G2/G3', strings: [{ gauge: 0.038, type: 'wound', midi: 43 }, { gauge: 0.018, type: 'plain', midi: 55 }] }
            ]
        },
        viola_nylon_suave: {
            id: 'viola_nylon_suave',
            instrumentId: 'viola_cebolao_e',
            name: 'Viola Caipira — Nylon Suave (.022 - .038)',
            badge: 'Alívio Total de Tampo',
            badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
            description: 'Redução drástica de tensão mecânica (~34 kgf). Preserva violas centenárias e confere timbre doce de alaúde caipira.',
            defaultScaleMm: 580,
            material: 'nylon_classical',
            courses: [
                { num: 1, label: '1º Par (Prima)', note: 'E4', strings: [{ gauge: 0.022, type: 'nylon_plain', midi: 64 }, { gauge: 0.022, type: 'nylon_plain', midi: 64 }] },
                { num: 2, label: '2º Par (Segundinha)', note: 'B3', strings: [{ gauge: 0.026, type: 'nylon_plain', midi: 59 }, { gauge: 0.026, type: 'nylon_plain', midi: 59 }] },
                { num: 3, label: '3º Par (Turina)', note: 'G#3/G#4', strings: [{ gauge: 0.028, type: 'nylon_wound', midi: 56 }, { gauge: 0.022, type: 'nylon_plain', midi: 68 }] },
                { num: 4, label: '4º Par (Toeira)', note: 'E3/E4', strings: [{ gauge: 0.032, type: 'nylon_wound', midi: 52 }, { gauge: 0.026, type: 'nylon_plain', midi: 64 }] },
                { num: 5, label: '5º Par (Canotilho)', note: 'B2/B3', strings: [{ gauge: 0.038, type: 'nylon_wound', midi: 47 }, { gauge: 0.028, type: 'nylon_wound', midi: 59 }] }
            ]
        },
        violao_nylon_normal: {
            id: 'violao_nylon_normal',
            instrumentId: 'violao_padrao',
            name: 'Violão 6 Cordas — Nylon Tensão Normal (EJ45)',
            badge: 'Clássico / MPB',
            badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
            description: 'O padrão mundial do violão clássico de concerto. Tensão moderada (~39 kgf), flexibilidade e dinâmica expressiva.',
            defaultScaleMm: 650,
            material: 'nylon_classical',
            courses: [
                { num: 1, label: '1ª Corda (Mi)', note: 'E4', strings: [{ gauge: 0.0280, type: 'nylon_plain', midi: 64 }] },
                { num: 2, label: '2ª Corda (Si)', note: 'B3', strings: [{ gauge: 0.0322, type: 'nylon_plain', midi: 59 }] },
                { num: 3, label: '3ª Corda (Sol)', note: 'G3', strings: [{ gauge: 0.0403, type: 'nylon_plain', midi: 55 }] },
                { num: 4, label: '4ª Corda (Ré)', note: 'D3', strings: [{ gauge: 0.0290, type: 'nylon_wound', midi: 50 }] },
                { num: 5, label: '5ª Corda (Lá)', note: 'A2', strings: [{ gauge: 0.0350, type: 'nylon_wound', midi: 45 }] },
                { num: 6, label: '6ª Corda (Mi)', note: 'E2', strings: [{ gauge: 0.0430, type: 'nylon_wound', midi: 40 }] }
            ]
        },
        violao_nylon_alta: {
            id: 'violao_nylon_alta',
            instrumentId: 'violao_padrao',
            name: 'Violão 6 Cordas — Nylon Alta Tensão (EJ46 / Corum)',
            badge: 'Concerto / Ataque Firme',
            badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
            description: 'Tensão de ~44 kgf com resposta percussiva firme, ideal para solistas, flamenco e tocadores de pegada vigorosa.',
            defaultScaleMm: 650,
            material: 'nylon_classical',
            courses: [
                { num: 1, label: '1ª Corda (Mi)', note: 'E4', strings: [{ gauge: 0.0285, type: 'nylon_plain', midi: 64 }] },
                { num: 2, label: '2ª Corda (Si)', note: 'B3', strings: [{ gauge: 0.0327, type: 'nylon_plain', midi: 59 }] },
                { num: 3, label: '3ª Corda (Sol)', note: 'G3', strings: [{ gauge: 0.0410, type: 'nylon_plain', midi: 55 }] },
                { num: 4, label: '4ª Corda (Ré)', note: 'D3', strings: [{ gauge: 0.0300, type: 'nylon_wound', midi: 50 }] },
                { num: 5, label: '5ª Corda (Lá)', note: 'A2', strings: [{ gauge: 0.0360, type: 'nylon_wound', midi: 45 }] },
                { num: 6, label: '6ª Corda (Mi)', note: 'E2', strings: [{ gauge: 0.0440, type: 'nylon_wound', midi: 40 }] }
            ]
        },
        violao_aco_extralight: {
            id: 'violao_aco_extralight',
            instrumentId: 'violao_padrao',
            name: 'Violão Aço — Extra-Light (.010 - .047)',
            badge: 'Aço Confortável',
            badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
            description: 'Aço macio para violões folk e fingerstyle. Facilidade para pestanas e menor tensão sobre o cavalete (~58 kgf).',
            defaultScaleMm: 650,
            material: 'steel_bronze',
            courses: [
                { num: 1, label: '1ª Corda (Mi)', note: 'E4', strings: [{ gauge: 0.010, type: 'plain', midi: 64 }] },
                { num: 2, label: '2ª Corda (Si)', note: 'B3', strings: [{ gauge: 0.014, type: 'plain', midi: 59 }] },
                { num: 3, label: '3ª Corda (Sol)', note: 'G3', strings: [{ gauge: 0.023, type: 'wound', midi: 55 }] },
                { num: 4, label: '4ª Corda (Ré)', note: 'D3', strings: [{ gauge: 0.030, type: 'wound', midi: 50 }] },
                { num: 5, label: '5ª Corda (Lá)', note: 'A2', strings: [{ gauge: 0.039, type: 'wound', midi: 45 }] },
                { num: 6, label: '6ª Corda (Mi)', note: 'E2', strings: [{ gauge: 0.047, type: 'wound', midi: 40 }] }
            ]
        },
        violao_aco_light: {
            id: 'violao_aco_light',
            instrumentId: 'violao_padrao',
            name: 'Violão Aço — Light (.012 - .053)',
            badge: 'Folk Padrão / Dreadnought',
            badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
            description: 'O calibre padrão do violão folk acústico. Encorpado e potente, gerando cerca de 73 kgf de tensão constante.',
            defaultScaleMm: 650,
            material: 'steel_bronze',
            courses: [
                { num: 1, label: '1ª Corda (Mi)', note: 'E4', strings: [{ gauge: 0.012, type: 'plain', midi: 64 }] },
                { num: 2, label: '2ª Corda (Si)', note: 'B3', strings: [{ gauge: 0.016, type: 'plain', midi: 59 }] },
                { num: 3, label: '3ª Corda (Sol)', note: 'G3', strings: [{ gauge: 0.024, type: 'wound', midi: 55 }] },
                { num: 4, label: '4ª Corda (Ré)', note: 'D3', strings: [{ gauge: 0.032, type: 'wound', midi: 50 }] },
                { num: 5, label: '5ª Corda (Lá)', note: 'A2', strings: [{ gauge: 0.042, type: 'wound', midi: 45 }] },
                { num: 6, label: '6ª Corda (Mi)', note: 'E2', strings: [{ gauge: 0.053, type: 'wound', midi: 40 }] }
            ]
        }
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
        activeRhythmStepIdx: -1,     // Passo ativo da levada para feedback visual sincronizado
        reverseFretsViola: [0, 0, 0, 0, 0], // Digitação ativa no Dicionário Reverso p/ Viola (1º ao 5º par)
        reverseFretsViolao: [0, 0, 1, 2, 2, 0], // Digitação ativa no Dicionário Reverso p/ Violão (1ª à 6ª corda)
        earTrainer: Object.assign({}, DEFAULT_EAR_TRAINER_STATE),
        ponteioPlayer: Object.assign({}, DEFAULT_PONTEIO_PLAYER_STATE),
        tabEditor: Object.assign({}, DEFAULT_TAB_EDITOR_STATE),
        modalTrainer: Object.assign({}, DEFAULT_MODAL_TRAINER_STATE),
        tensionCalculator: Object.assign({}, DEFAULT_TENSION_STATE)
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
    let ponteioPlaybackTimer = null;
    let tabEditorPlaybackTimer = null;
    let activeTabEditorTimers = [];
    let modalPlaybackTimer = null;
    let activeModalTimers = [];

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
    // MOTOR DE ANÁLISE HARMÔNICA REVERSA & DICIONÁRIO DE ACORDES
    // =========================================================================
    const REVERSE_CHORD_FORMULAS = [
        // Tríades Fundamentais
        { suffix: '', fullName: 'Maior', intervals: [0, 4, 7], omissible: false, quality: 'major', tension: 'Repouso / Consonância' },
        { suffix: 'm', fullName: 'Menor', intervals: [0, 3, 7], omissible: false, quality: 'minor', tension: 'Repouso / Introspecção' },
        { suffix: 'dim', fullName: 'Diminuto', intervals: [0, 3, 6], omissible: false, quality: 'dim', tension: 'Tensão / Instabilidade' },
        { suffix: 'aug', fullName: 'Aumentado', intervals: [0, 4, 8], omissible: false, quality: 'aug', tension: 'Tensão Suspensa' },
        { suffix: 'sus4', fullName: 'Suspenso 4', intervals: [0, 5, 7], omissible: false, quality: 'sus', tension: 'Suspensão Melódica' },
        { suffix: 'sus2', fullName: 'Suspenso 2', intervals: [0, 2, 7], omissible: false, quality: 'sus', tension: 'Abertura Espacial' },
        { suffix: '5', fullName: 'Power Chord (Quinta)', intervals: [0, 7], omissible: false, quality: 'power', tension: 'Neutro / Vigor Acústico' },

        // Tétrades Canônicas da Viola e Violão
        { suffix: '7M', fullName: 'com Sétima Maior', intervals: [0, 4, 7, 11], omissible: true, quality: 'maj7', tension: 'Repouso Nobre / Lirismo' },
        { suffix: '7', fullName: 'com Sétima Dominante', intervals: [0, 4, 7, 10], omissible: true, quality: 'dom7', tension: 'Tensão Máxima Preparatória' },
        { suffix: 'm7', fullName: 'Menor com Sétima', intervals: [0, 3, 7, 10], omissible: true, quality: 'min7', tension: 'Afastamento Suave / Toada' },
        { suffix: 'm(7M)', fullName: 'Menor com Sétima Maior', intervals: [0, 3, 7, 11], omissible: true, quality: 'minmaj7', tension: 'Dramatismo Romântico' },
        { suffix: 'm7(♭5)', fullName: 'Meio-Diminuto', intervals: [0, 3, 6, 10], omissible: false, quality: 'halfdim', tension: 'Tensão Sensível / Passagem' },
        { suffix: 'dim7', fullName: 'Diminuto com Sétima', intervals: [0, 3, 6, 9], omissible: false, quality: 'dim7', tension: 'Tensão Simétrica Máxima' },
        { suffix: '6', fullName: 'com Sexta Maior', intervals: [0, 4, 7, 9], omissible: true, quality: 'maj6', tension: 'Repouso Bucólico / Folia' },
        { suffix: 'm6', fullName: 'Menor com Sexta', intervals: [0, 3, 7, 9], omissible: true, quality: 'min6', tension: 'Melancolia Caipira' },
        { suffix: '7sus4', fullName: 'com Sétima e Suspenso 4', intervals: [0, 5, 7, 10], omissible: true, quality: 'sus4', tension: 'Preparação Suspensa' },
        { suffix: '7(♯5)', fullName: 'com Sétima e Quinta Aumentada', intervals: [0, 4, 8, 10], omissible: false, quality: 'augdom', tension: 'Tensão Dominante Alterada' },
        { suffix: '7(♭5)', fullName: 'com Sétima e Quinta Diminuta', intervals: [0, 4, 6, 10], omissible: false, quality: 'altdom', tension: 'Tensão Cromática' },

        // Extensões e Adicionadas
        { suffix: 'add9', fullName: 'com Nona Adicionada', intervals: [0, 4, 7, 2], omissible: true, quality: 'add9', tension: 'Brilho Caipira / Ressonância' },
        { suffix: 'm(add9)', fullName: 'Menor com Nona Adicionada', intervals: [0, 3, 7, 2], omissible: true, quality: 'madd9', tension: 'Lírico / Ponteio Sentimental' },
        { suffix: '9', fullName: 'Dominante com Nona', intervals: [0, 4, 7, 10, 2], omissible: true, quality: 'dom9', tension: 'Preparação Encorpada' },
        { suffix: '7M(9)', fullName: 'com Sétima Maior e Nona', intervals: [0, 4, 7, 11, 2], omissible: true, quality: 'maj9', tension: 'Sofisticação e Nobreza' },
        { suffix: 'm9', fullName: 'Menor com Nona', intervals: [0, 3, 7, 10, 2], omissible: true, quality: 'min9', tension: 'Profundidade Espacial' },
        { suffix: '6/9', fullName: 'com Sexta e Nona', intervals: [0, 4, 7, 9, 2], omissible: true, quality: 'sixnine', tension: 'Repouso Cristalino' },
        { suffix: '7(♭9)', fullName: 'com Sétima e Nona Menor', intervals: [0, 4, 7, 10, 1], omissible: true, quality: 'domb9', tension: 'Tensão Dramática Caipira' },
        { suffix: '7(♯9)', fullName: 'com Sétima e Nona Aumentada', intervals: [0, 4, 7, 10, 3], omissible: true, quality: 'domsharp9', tension: 'Tensão Áspera de Raiz' },
        { suffix: 'm7(11)', fullName: 'Menor com Sétima e 11ª', intervals: [0, 3, 7, 10, 5], omissible: true, quality: 'min11', tension: 'Abertura Modal Moderna' },
        { suffix: '7(13)', fullName: 'Dominante com 13ª', intervals: [0, 4, 7, 10, 9], omissible: true, quality: 'dom13', tension: 'Tensão Orquestrada' },
        { suffix: '7(♭13)', fullName: 'Dominante com 13ª Menor', intervals: [0, 4, 7, 10, 8], omissible: true, quality: 'domb13', tension: 'Tensão Romântica' }
    ];

    const REVERSE_PRESETS = {
        viola_cebolao_e: [
            { name: 'E Aberto (Solto)', shape: [0, 0, 0, 0, 0], desc: 'Ressonância total da afinação Cebolão em Mi' },
            { name: 'B7 Tradicional', shape: [2, 4, 1, 2, 0], desc: 'Dominante fundamental da viola caipira' },
            { name: 'A Caipira', shape: [0, 2, 1, 0, -1], desc: 'Subdominante límpida com primas soltas' },
            { name: 'E7M Sofisticado', shape: [0, 4, 0, 0, 0], desc: 'Moda lenta com 7ª Maior no 2º par' },
            { name: 'F#m Caipira', shape: [2, 2, 1, 2, -1], desc: 'Relativa menor de Lá / ii de Mi' },
            { name: 'C#m Melódico', shape: [0, 2, 0, 0, 2], desc: 'Relativa menor melancólica de Mi' },
            { name: 'G#m / B', shape: [4, 4, 3, 4, 0], desc: 'Mediante encorpada com bordão solto' },
            { name: 'E7 Dominante', shape: [0, 3, 0, 0, 0], desc: 'Tensão para preparar o Lá (IV grau)' },
            { name: 'Aadd9 Brilhante', shape: [0, 0, 1, 0, 0], desc: 'Turina em Lá com primas em uníssono' },
            { name: 'B7(9) Tião Carreiro', shape: [2, 4, 3, 2, 2], desc: 'Pestana encorpada de pagode de viola' },
            { name: 'Eadd9 Aberto', shape: [2, 0, 0, 0, 0], desc: 'Fá# agudo no 1º par sobre Mi solto' },
            { name: 'D Aberto (Folia)', shape: [2, 3, 1, -1, 3], desc: 'Acorde modal ♭VII típico de folia e cururu' }
        ],
        violao_padrao: [
            { name: 'E Maior', shape: [0, 0, 1, 2, 2, 0], desc: 'Posição aberta clássica com 3 bordões' },
            { name: 'Am Tradicional', shape: [0, 1, 2, 2, 0, -1], desc: 'Relativa menor de Dó Maior' },
            { name: 'C Maior', shape: [0, 1, 0, 2, 3, -1], desc: 'Tônica basilar no 5º par (Lá)' },
            { name: 'D Maior', shape: [2, 3, 2, 0, -1, -1], desc: 'Tríade brilhante com baixo na 4ª corda' },
            { name: 'G Aberto', shape: [3, 0, 0, 0, 2, 3], desc: 'Acorde campestre de grande ressonância' },
            { name: 'B7 Aberto', shape: [2, 0, 2, 1, 2, -1], desc: 'Dominante de Mi Maior / Menor' },
            { name: 'Em7 Aberto', shape: [0, 3, 0, 2, 2, 0], desc: 'Harmonia lírica com 7ª menor solta' },
            { name: 'F7M Aberto', shape: [0, 1, 2, 3, -1, -1], desc: 'Bossa nova / sofisticação com 1ª solta' },
            { name: 'A7 Dominante', shape: [0, 2, 0, 2, 0, -1], desc: 'Tensão de preparação para Ré' },
            { name: 'Dm Melancólico', shape: [1, 3, 2, 0, -1, -1], desc: 'Menor doce com baixo em Ré' }
        ]
    };

    function getIntervalShortName(semitones) {
        const map = {
            0: 'T',
            1: '♭9',
            2: '9',
            3: '3m',
            4: '3M',
            5: '11',
            6: '♭5',
            7: '5J',
            8: '♯5',
            9: '6',
            10: '7m',
            11: '7M'
        };
        return map[semitones] || `${semitones}st`;
    }

    function getIntervalFullName(semitones) {
        const map = {
            0: 'Tônica (Raiz fundamental)',
            1: 'Segunda Menor / Nona Menor (♭9)',
            2: 'Segunda Maior / Nona (9)',
            3: 'Terça Menor (3m)',
            4: 'Terça Maior (3M)',
            5: 'Quarta Justa / Décima Primeira (11)',
            6: 'Quinta Diminuta / Trítono (♭5 / ♯11)',
            7: 'Quinta Justa (5J)',
            8: 'Quinta Aumentada / 13ª Menor (♯5 / ♭13)',
            9: 'Sexta Maior / 13ª (6 / 13)',
            10: 'Sétima Menor (7m)',
            11: 'Sétima Maior (7M)'
        };
        return map[semitones] || `${semitones} Semitons`;
    }

    function getIntervalColor(semitones) {
        if (semitones === 0) return '#10b981'; // Tônica (verde)
        if (semitones === 3 || semitones === 4) return '#06b6d4'; // Terças (ciano)
        if (semitones === 6 || semitones === 7 || semitones === 8) return '#f59e0b'; // Quintas (âmbar)
        if (semitones === 9 || semitones === 10 || semitones === 11) return '#a855f7'; // Sétimas / Sextas (roxo)
        return '#ec4899'; // Nonas / Onzenas (rosa choque)
    }

    function getKeyHarmonicFunctions(rootPc, suffix) {
        const keys = [
            { keyId: 'E_maj', root: 4, name: 'Mi Maior (E) — Viola Caipira', nativa: true },
            { keyId: 'A_maj', root: 9, name: 'Lá Maior (A) — Subdominante', nativa: false },
            { keyId: 'B_maj', root: 11, name: 'Si Maior (B) — Dominante', nativa: false }
        ];

        return keys.map((k) => {
            const degDiff = (rootPc - k.root + 12) % 12;
            let roman = '';
            let role = '';
            let badgeCol = '';

            if (degDiff === 0) {
                roman = 'I';
                role = 'Tônica de Repouso (Centro Harmônico)';
                badgeCol = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
            } else if (degDiff === 2) {
                roman = suffix.includes('m') ? 'ii' : 'II';
                role = suffix.includes('m') ? 'Superfônica (Subdominante Suave)' : 'Dominante Secundário (V/V)';
                badgeCol = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
            } else if (degDiff === 4) {
                roman = suffix.includes('m') ? 'iii' : 'III';
                role = 'Mediante (Harmonia Contemplativa)';
                badgeCol = 'bg-slate-700 text-slate-300 border-slate-600';
            } else if (degDiff === 5) {
                roman = 'IV';
                role = 'Subdominante (Afastamento Límpido)';
                badgeCol = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
            } else if (degDiff === 7) {
                roman = 'V';
                role = 'Dominante Primário (Tensão que pede Resolução no I)';
                badgeCol = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
            } else if (degDiff === 9) {
                roman = suffix.includes('m') ? 'vi' : 'VI';
                role = suffix.includes('m') ? 'Relativa Menor (Melancolia & Toadas)' : 'Submediante Maior';
                badgeCol = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
            } else if (degDiff === 11) {
                roman = 'viiø';
                role = 'Sensível / Meio-Diminuto';
                badgeCol = 'bg-slate-700 text-slate-400 border-slate-600';
            } else if (degDiff === 10) {
                roman = '♭VII';
                role = 'Subtônica Modal (Típico de Cururu e Folia)';
                badgeCol = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
            } else {
                roman = 'Ext.';
                role = 'Acorde Cromático de Passagem / Empréstimo';
                badgeCol = 'bg-slate-800 text-slate-400 border-slate-700';
            }

            return {
                keyName: k.name,
                roman: suffix ? `${roman}${suffix}` : roman,
                role,
                badgeCol,
                nativa: k.nativa
            };
        });
    }

    function analyzeReverseChord(inst, shape) {
        const active = [];
        shape.forEach((fret, cIdx) => {
            if (fret >= 0 && fret <= 14) {
                const course = inst.courses[cIdx];
                const midi = course.midi[0] + fret;
                const pc = (course.pitchClass + fret) % 12;
                active.push({
                    courseIdx: cIdx,
                    fret,
                    midi,
                    pc,
                    courseName: course.label,
                    noteName: NOTE_NAMES[pc],
                    noteNamePt: NOTE_NAMES_PT[pc],
                    octaved: course.octaved
                });
            }
        });

        if (active.length === 0) {
            return {
                found: false,
                empty: true,
                activeCount: 0,
                chordName: 'Nenhuma Corda Soando',
                chordNamePT: 'Braço Silenciado',
                details: 'Todas as cordas estão abafadas (X). Selecione casas ou clique no braço para identificar o acorde.',
                rootPc: null,
                bassPc: null,
                tones: [],
                alternatives: [],
                keyFunctions: []
            };
        }

        // Baixo: par/corda ativa de maior índice (fisicamente a mais grave)
        const bass = active.slice().reverse()[0];
        const bassPc = bass.pc;
        const bassName = NOTE_NAMES[bassPc];
        const bassNamePt = NOTE_NAMES_PT[bassPc];

        // Pitch classes únicas
        const uniquePcs = Array.from(new Set(active.map((a) => a.pc)));

        if (uniquePcs.length === 1) {
            const root = uniquePcs[0];
            return {
                found: true,
                empty: false,
                isUnison: true,
                activeCount: active.length,
                chordName: `${NOTE_NAMES[root]} (Uníssono / Oitavas)`,
                chordNamePT: `Nota ${NOTE_NAMES_PT[root]} em oitavas puras`,
                rootPc: root,
                bassPc: root,
                isInverted: false,
                inversionLabel: 'Uníssono Fundamental',
                quality: 'unison',
                tension: 'Consonância Pura',
                details: `Apenas a nota ${NOTE_NAMES[root]} está soando distribuída em ${active.length} corda(s)/par(es).`,
                tones: active.map((a) => ({
                    courseIdx: a.courseIdx,
                    courseName: a.courseName,
                    fret: a.fret,
                    noteName: a.noteName,
                    noteNamePt: a.noteNamePt,
                    role: 'T',
                    roleDesc: 'Tônica pura',
                    color: '#10b981',
                    isBass: a.courseIdx === bass.courseIdx
                })),
                alternatives: [],
                keyFunctions: getKeyHarmonicFunctions(root, '')
            };
        }

        // Avalia candidatos a tônica: testa cada pitch class presente
        const candidates = [];

        uniquePcs.forEach((candRoot) => {
            const relIntervals = uniquePcs
                .map((p) => (p - candRoot + 12) % 12)
                .sort((a, b) => a - b);

            REVERSE_CHORD_FORMULAS.forEach((formula) => {
                const formIntervals = formula.intervals;

                // Verifica se todos os intervalos tocados pertencem à fórmula
                const unknownIntervals = relIntervals.filter((i) => !formIntervals.includes(i));
                if (unknownIntervals.length > 0) return;

                // Verifica se a fórmula está suficientemente satisfeita
                let missing = formIntervals.filter((i) => !relIntervals.includes(i));
                if (formula.omissible && missing.length === 1 && missing[0] === 7) {
                    missing = [];
                }

                if (missing.length === 0) {
                    let score = 100;
                    if (candRoot === bassPc) {
                        score += 25; // Estado fundamental prioritário
                    }
                    if (!relIntervals.includes(7) && formIntervals.includes(7)) {
                        score -= 5;
                    }
                    if (formula.suffix === '' || formula.suffix === 'm') score += 15;
                    if (formula.suffix === '7' || formula.suffix === '7M' || formula.suffix === 'm7') score += 12;

                    candidates.push({
                        rootPc: candRoot,
                        formula,
                        score,
                        isInverted: candRoot !== bassPc,
                        bassPc
                    });
                }
            });
        });

        // Se não encontrou nenhuma fórmula completa, tenta com Díades / Intervalos de 2 notas
        if (candidates.length === 0 && uniquePcs.length === 2) {
            const interval = (uniquePcs[1] - uniquePcs[0] + 12) % 12;
            if (interval === 7 || interval === 5) {
                const root = interval === 7 ? uniquePcs[0] : uniquePcs[1];
                candidates.push({
                    rootPc: root,
                    formula: { suffix: '5', fullName: 'Power Chord (Díade de Quinta)', intervals: [0, 7], quality: 'power', tension: 'Neutro / Vigor' },
                    score: 80,
                    isInverted: root !== bassPc,
                    bassPc
                });
            }
        }

        candidates.sort((a, b) => b.score - a.score);

        if (candidates.length > 0) {
            const best = candidates[0];
            const root = best.rootPc;
            const formula = best.formula;
            const isInverted = best.isInverted;

            let inversionLabel = 'Estado Fundamental';
            if (isInverted) {
                const bassInterval = (bassPc - root + 12) % 12;
                if (bassInterval === 3 || bassInterval === 4) {
                    inversionLabel = '1ª Inversão (Baixo na Terça)';
                } else if (bassInterval === 6 || bassInterval === 7 || bassInterval === 8) {
                    inversionLabel = '2ª Inversão (Baixo na Quinta)';
                } else if (bassInterval === 10 || bassInterval === 11) {
                    inversionLabel = '3ª Inversão (Baixo na Sétima)';
                } else if (bassInterval === 1 || bassInterval === 2) {
                    inversionLabel = 'Baixo na Nona';
                } else {
                    inversionLabel = `Baixo em ${bassName}`;
                }
            }

            const chordName = isInverted
                ? `${NOTE_NAMES[root]}${formula.suffix}/${bassName}`
                : `${NOTE_NAMES[root]}${formula.suffix}`;

            const chordNamePT = isInverted
                ? `${NOTE_NAMES_PT[root]} ${formula.fullName} (Baixo em ${bassNamePt})`
                : `${NOTE_NAMES_PT[root]} ${formula.fullName}`;

            const tones = active.map((a) => {
                const interval = (a.pc - root + 12) % 12;
                return {
                    courseIdx: a.courseIdx,
                    courseName: a.courseName,
                    fret: a.fret,
                    noteName: a.noteName,
                    noteNamePt: a.noteNamePt,
                    role: getIntervalShortName(interval),
                    roleDesc: getIntervalFullName(interval),
                    color: getIntervalColor(interval),
                    isBass: a.courseIdx === bass.courseIdx
                };
            });

            const alternatives = [];
            const seenNames = new Set([chordName]);
            for (let i = 1; i < candidates.length; i++) {
                const c = candidates[i];
                const altName = c.isInverted
                    ? `${NOTE_NAMES[c.rootPc]}${c.formula.suffix}/${bassName}`
                    : `${NOTE_NAMES[c.rootPc]}${c.formula.suffix}`;
                if (!seenNames.has(altName)) {
                    seenNames.add(altName);
                    alternatives.push({
                        chordName: altName,
                        desc: `${NOTE_NAMES_PT[c.rootPc]} ${c.formula.fullName}`
                    });
                }
                if (alternatives.length >= 3) break;
            }

            return {
                found: true,
                empty: false,
                isUnison: false,
                activeCount: active.length,
                chordName,
                chordNamePT,
                rootPc: root,
                bassPc,
                isInverted,
                inversionLabel,
                quality: formula.quality,
                tension: formula.tension,
                details: `Identificado ${NOTE_NAMES[root]}${formula.suffix} a partir de ${uniquePcs.length} notas distintas (${uniquePcs.map((p) => NOTE_NAMES[p]).join(', ')}).`,
                tones,
                alternatives,
                keyFunctions: getKeyHarmonicFunctions(root, formula.suffix)
            };
        }

        // Caso de Cluster ou Acorde Híbrido Aberto
        const tones = active.map((a) => {
            const interval = (a.pc - bassPc + 12) % 12;
            return {
                courseIdx: a.courseIdx,
                courseName: a.courseName,
                fret: a.fret,
                noteName: a.noteName,
                noteNamePt: a.noteNamePt,
                role: a.pc === bassPc ? 'Baixo' : getIntervalShortName(interval),
                roleDesc: a.pc === bassPc ? 'Nota no Baixo' : getIntervalFullName(interval),
                color: getIntervalColor(interval),
                isBass: a.courseIdx === bass.courseIdx
            };
        });

        return {
            found: true,
            empty: false,
            isUnison: false,
            activeCount: active.length,
            chordName: `Acorde Aberto [${uniquePcs.map((p) => NOTE_NAMES[p]).join('·')}]/${bassName}`,
            chordNamePT: `Sonoridade Híbrida / Acorde Aberto com baixo em ${bassNamePt}`,
            rootPc: bassPc,
            bassPc,
            isInverted: false,
            inversionLabel: 'Baixo Referência',
            quality: 'cluster',
            tension: 'Ressonância Aberta / Polimodal',
            details: `Formação harmônica com ${uniquePcs.length} notas distintas (${uniquePcs.map((p) => NOTE_NAMES[p]).join(', ')}).`,
            tones,
            alternatives: [],
            keyFunctions: getKeyHarmonicFunctions(bassPc, '')
        };
    }

    function strumReverseChord() {
        const inst = INSTRUMENTS[state.instrumentId];
        const shape = inst.isPaired ? state.reverseFretsViola : state.reverseFretsViolao;

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

    function transposeReverseChord(delta) {
        const inst = INSTRUMENTS[state.instrumentId];
        const arr = inst.isPaired ? state.reverseFretsViola : state.reverseFretsViolao;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] >= 0) {
                arr[i] = Math.max(0, Math.min(14, arr[i] + delta));
            }
        }
        saveViolaState();
        renderFretboardSVG();
        renderReverseChordPanel();
    }

    function resetReverseChordToOpen() {
        const inst = INSTRUMENTS[state.instrumentId];
        if (inst.isPaired) {
            state.reverseFretsViola = [0, 0, 0, 0, 0];
        } else {
            state.reverseFretsViolao = [0, 0, 0, 0, 0, 0];
        }
        saveViolaState();
        renderFretboardSVG();
        renderReverseChordPanel();
    }

    function resetReverseChordToMute() {
        const inst = INSTRUMENTS[state.instrumentId];
        if (inst.isPaired) {
            state.reverseFretsViola = [-1, -1, -1, -1, -1];
        } else {
            state.reverseFretsViolao = [-1, -1, -1, -1, -1, -1];
        }
        saveViolaState();
        renderFretboardSVG();
        renderReverseChordPanel();
    }

    function loadReversePreset(shape) {
        const inst = INSTRUMENTS[state.instrumentId];
        if (inst.isPaired) {
            state.reverseFretsViola = shape.slice();
        } else {
            state.reverseFretsViolao = shape.slice();
        }
        state.displayMode = 'REVERSE';
        saveViolaState();
        renderFretboardSVG();
        renderReverseChordPanel();
        strumReverseChord();
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
        stopTabEditorPlayback();
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
    // BIBLIOTECA EXPANDIDA DE PONTEIOS & SOLOS CANÔNICOS DE VIOLA CAIPIRA (FASE 6)
    // =========================================================================
    const PONTEIOS_REPERTOIRE = [
        {
            id: 'pagode_brasilia',
            title: 'Pagode em Brasília',
            author: 'Tião Carreiro & Lourival dos Santos',
            rhythm: 'Pagode Caipira (2/4 sincopado)',
            key: 'Mi Maior (E) Cebolão',
            recommendedTuning: 'viola_cebolao_e',
            bpmDefault: 104,
            desc: 'O ponteio mais emblemático da viola caipira brasileira. Introdução histórica gravada em 1959 por Tião Carreiro & Pardinho, fundando o gênero Pagode de Viola. Caracteriza-se por repiques em cascata nos pares 1 e 2, com batida percussiva no tampo e síncopes cortadas.',
            techniqueTip: 'Use indicador (i) subindo na prima e polegar (p) descendo na segundinha. Na batida de tampo [TAP], utilize a lateral do polegar direito no tampo superior para estalar o ritmo característico de Tião Carreiro.',
            steps: [
                { measure: 1, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 2 }], d: 0.18, rh: 'p+i', lh: '0-2', ann: 'Abertura sincopada em Lá' },
                { measure: 1, beat: '1 e', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.20, rh: 'p+i', lh: '1-2', ann: 'Terça Maior de Mi (E)' },
                { measure: 1, beat: '2', notes: [{ c: 0, f: 2 }, { c: 1, f: 4 }], d: 0.18, rh: 'p+i', lh: '1-2', ann: 'Terça de Si com 7ª (B7)' },
                { measure: 1, beat: '2 e', notes: [{ c: 0, f: 0 }, { c: 1, f: 2 }], d: 0.20, rh: 'p+i', lh: '0-2', ann: 'Terça de Lá (A)' },
                { measure: 2, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }], d: 0.20, rh: 'p+i', lh: '0-0', ann: 'Cordas soltas E/B' },
                { measure: 2, beat: '1 e', notes: [{ c: 2, f: 1 }], d: 0.18, rh: 'p', lh: '1', ann: 'Turina Lá' },
                { measure: 2, beat: '2', notes: [{ c: 3, f: 2 }], d: 0.22, rh: 'p', lh: '2', ann: 'Toeira Fá#' },
                { measure: 2, beat: '2 e', notes: [], d: 0.22, rh: 'tap', lh: '—', ann: 'Batida percussiva no tampo' },
                { measure: 3, beat: '1', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.20, rh: 'p+i', lh: '1-2', ann: 'Cascata de Mi Maior' },
                { measure: 3, beat: '1 e', notes: [{ c: 0, f: 2 }, { c: 1, f: 4 }], d: 0.18, rh: 'p+i', lh: '1-2', ann: 'Terça de B7' },
                { measure: 3, beat: '2', notes: [{ c: 0, f: 0 }, { c: 1, f: 2 }], d: 0.18, rh: 'p+i', lh: '0-2', ann: 'Terça de A' },
                { measure: 3, beat: '2 e', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }], d: 0.22, rh: 'p+i', lh: '0-0', ann: 'Resolução solta' },
                { measure: 4, beat: '1', notes: [{ c: 3, f: 2 }, { c: 4, f: 2 }], d: 0.26, rh: 'p', lh: '2-2', ann: 'Bordão oitavado B/E' },
                { measure: 4, beat: '2', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }, { c: 2, f: 0 }, { c: 3, f: 0 }, { c: 4, f: 0 }], d: 0.50, rh: 'rasq', lh: '0', ann: 'Rasqueado em Mi Maior pleno' }
            ]
        },
        {
            id: 'chico_mineiro',
            title: 'Chico Mineiro',
            author: 'Tonico & Francisco Ribeiro',
            rhythm: 'Cururu / Moda Caipira (2/4)',
            key: 'Mi Maior (E) Cebolão',
            recommendedTuning: 'viola_cebolao_e',
            bpmDefault: 84,
            desc: 'O mais célebre lamento poético da música raiz brasileira. Gravado por Tonico & Tinoco em 1958, o solo sintetiza a essência do dueto caipira em terças diatônicas nos pares 1 e 2, evocando a saudade do companheiro de comitiva nas campinas de Minas Gerais.',
            techniqueTip: 'Mantenha o indicador (i) apoiado no 1º par e o polegar (p) no 2º par, beliscando simultaneamente como uma pinça macia. A sonoridade deve soar límpida, aveludada e sem pressa.',
            steps: [
                { measure: 1, beat: '1', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.26, rh: 'p+i', lh: '1-2', ann: 'Terça Mi Maior (Sol# + Mi)' },
                { measure: 1, beat: '1 e', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.26, rh: 'p+i', lh: '1-2', ann: 'Repouso na tônica Mi' },
                { measure: 1, beat: '2', notes: [{ c: 0, f: 5 }, { c: 1, f: 7 }], d: 0.26, rh: 'p+i', lh: '1-3', ann: 'Terça de Si com 7ª (Lá + Fá#)' },
                { measure: 1, beat: '2 e', notes: [{ c: 0, f: 7 }, { c: 1, f: 9 }], d: 0.30, rh: 'p+i', lh: '1-3', ann: 'Ponto alto: Terça aguda (Si + Sol#)' },
                { measure: 2, beat: '1', notes: [{ c: 0, f: 5 }, { c: 1, f: 7 }], d: 0.26, rh: 'p+i', lh: '1-3', ann: 'Descida melódica lírica' },
                { measure: 2, beat: '1 e', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.26, rh: 'p+i', lh: '1-2', ann: 'Terça de Mi Maior' },
                { measure: 2, beat: '2', notes: [{ c: 0, f: 2 }, { c: 1, f: 4 }], d: 0.26, rh: 'p+i', lh: '1-2', ann: 'Terça de passagem (Fá# + Ré#)' },
                { measure: 2, beat: '2 e', notes: [{ c: 0, f: 0 }, { c: 1, f: 2 }], d: 0.28, rh: 'p+i', lh: '0-2', ann: 'Terça de Lá (Mi + Dó#)' },
                { measure: 3, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }], d: 0.28, rh: 'p+i', lh: '0-0', ann: 'Resolução cordas soltas' },
                { measure: 3, beat: '1 e', notes: [{ c: 2, f: 1 }], d: 0.24, rh: 'p', lh: '1', ann: 'Bordão Turina Lá' },
                { measure: 3, beat: '2', notes: [{ c: 3, f: 2 }], d: 0.26, rh: 'p', lh: '2', ann: 'Toeira Fá#' },
                { measure: 3, beat: '2 e', notes: [{ c: 4, f: 2 }], d: 0.28, rh: 'p', lh: '2', ann: 'Canotilho Dó#' },
                { measure: 4, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }, { c: 2, f: 0 }, { c: 3, f: 0 }, { c: 4, f: 0 }], d: 0.60, rh: 'rasq', lh: '0', ann: 'Acorde Mi Maior aberto solene' }
            ]
        },
        {
            id: 'menino_porteira',
            title: 'O Menino da Porteira',
            author: 'Teddy Vieira & Luizinho',
            rhythm: 'Cururu Tradicional (2/4)',
            key: 'Mi Maior (E) Cebolão',
            recommendedTuning: 'viola_cebolao_e',
            bpmDefault: 92,
            desc: 'Um dos solos mais emblemáticos da cultura sertaneja. Imortalizado na gravação de Tião Carreiro & Pardinho (1955). Constitui o modelo canônico de execução de ponteio em sextas (Pares 1 e 3), evocando o trotar das boiadas no estradão de Ouro Fino.',
            techniqueTip: 'Toque com a mão direita em abertura de pinça larga: o polegar (p) no 3º par e o indicador (i) no 1º par, saltando sobre o 2º par sem tocá-lo. Na 5ª e 7ª casa, utilize a pestana do dedo 1 para prender ambos os pares simultaneamente.',
            steps: [
                { measure: 1, beat: '1', notes: [{ c: 0, f: 0 }, { c: 2, f: 0 }], d: 0.26, rh: 'p+i', lh: '0-0', ann: 'Sexta menor solta (Sol# + Mi)' },
                { measure: 1, beat: '1 e', notes: [{ c: 0, f: 2 }, { c: 2, f: 1 }], d: 0.26, rh: 'p+i', lh: '2-1', ann: 'Sexta maior (Lá + Fá#)' },
                { measure: 1, beat: '2', notes: [{ c: 0, f: 4 }, { c: 2, f: 3 }], d: 0.26, rh: 'p+i', lh: '2-1', ann: 'Sexta menor (Si + Sol#)' },
                { measure: 1, beat: '2 e', notes: [{ c: 0, f: 5 }, { c: 2, f: 5 }], d: 0.30, rh: 'p+i', lh: 'pest', ann: 'Sexta maior em pestana (Dó# + Lá)' },
                { measure: 2, beat: '1', notes: [{ c: 0, f: 7 }, { c: 2, f: 7 }], d: 0.30, rh: 'p+i', lh: 'pest', ann: 'Sexta aguda (Ré# + Si)' },
                { measure: 2, beat: '1 e', notes: [{ c: 0, f: 5 }, { c: 2, f: 5 }], d: 0.26, rh: 'p+i', lh: 'pest', ann: 'Retorno descendente' },
                { measure: 2, beat: '2', notes: [{ c: 0, f: 4 }, { c: 2, f: 3 }], d: 0.26, rh: 'p+i', lh: '2-1', ann: 'Sexta (Si + Sol#)' },
                { measure: 2, beat: '2 e', notes: [{ c: 0, f: 2 }, { c: 2, f: 1 }], d: 0.26, rh: 'p+i', lh: '2-1', ann: 'Sexta (Lá + Fá#)' },
                { measure: 3, beat: '1', notes: [{ c: 0, f: 0 }, { c: 2, f: 0 }], d: 0.28, rh: 'p+i', lh: '0-0', ann: 'Resolução em sextas soltas' },
                { measure: 3, beat: '1 e', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.28, rh: 'p+i', lh: '1-2', ann: 'Terça de Mi Maior' },
                { measure: 3, beat: '2', notes: [{ c: 3, f: 2 }], d: 0.24, rh: 'p', lh: '2', ann: 'Bordão Toeira Fá#' },
                { measure: 3, beat: '2 e', notes: [{ c: 4, f: 2 }], d: 0.26, rh: 'p', lh: '2', ann: 'Canotilho Dó#' },
                { measure: 4, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }, { c: 2, f: 0 }, { c: 3, f: 0 }, { c: 4, f: 0 }], d: 0.55, rh: 'rasq', lh: '0', ann: 'Fechamento Cururu em Mi Maior' }
            ]
        },
        {
            id: 'rei_do_gado',
            title: 'O Rei do Gado',
            author: 'Teddy Vieira / Tião Carreiro',
            rhythm: 'Moda de Viola / Cururu Forte (2/4)',
            key: 'Mi Maior (E) Cebolão',
            recommendedTuning: 'viola_cebolao_e',
            bpmDefault: 90,
            desc: 'A abertura mais imponente e triunfal de toda a discografia caipira. Introdução monumental da moda de viola lançada em 1961, combinando batida enérgica no tampo, terças cortantes partindo da 7ª casa e arremate poderoso nos bordões oitavados graves.',
            techniqueTip: 'Inicie com a batida de tampo [TAP] firme com a mão direita, atacando logo em seguida o dueto na 7ª casa com vigor. Tião Carreiro utilizava o peso do polegar de aço para dar a autoridade rítmica da moda.',
            steps: [
                { measure: 1, beat: '1', notes: [], d: 0.24, rh: 'tap', lh: '—', ann: 'Golpe percussivo no tampo' },
                { measure: 1, beat: '1 e', notes: [{ c: 0, f: 7 }, { c: 1, f: 9 }], d: 0.26, rh: 'p+i', lh: '1-3', ann: 'Ataque em Mi agudo (Si + Sol#)' },
                { measure: 1, beat: '2', notes: [{ c: 0, f: 5 }, { c: 1, f: 7 }], d: 0.24, rh: 'p+i', lh: '1-3', ann: 'Terça de B7 (Lá + Fá#)' },
                { measure: 1, beat: '2 e', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.26, rh: 'p+i', lh: '1-2', ann: 'Terça de Mi Maior' },
                { measure: 2, beat: '1', notes: [{ c: 0, f: 2 }, { c: 1, f: 4 }], d: 0.24, rh: 'p+i', lh: '1-2', ann: 'Descida Dó#/Fá#' },
                { measure: 2, beat: '1 e', notes: [{ c: 0, f: 0 }, { c: 1, f: 2 }], d: 0.24, rh: 'p+i', lh: '0-2', ann: 'Terça de Lá' },
                { measure: 2, beat: '2', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }], d: 0.26, rh: 'p+i', lh: '0-0', ann: 'Cordas soltas' },
                { measure: 2, beat: '2 e', notes: [{ c: 2, f: 1 }], d: 0.22, rh: 'p', lh: '1', ann: 'Bordão Turina Lá' },
                { measure: 3, beat: '1', notes: [{ c: 3, f: 2 }], d: 0.24, rh: 'p', lh: '2', ann: 'Toeira Mi oitavado' },
                { measure: 3, beat: '1 e', notes: [{ c: 4, f: 2 }], d: 0.24, rh: 'p', lh: '2', ann: 'Canotilho Si oitavado' },
                { measure: 3, beat: '2', notes: [{ c: 4, f: 0 }], d: 0.24, rh: 'p', lh: '0', ann: 'Si grave solto' },
                { measure: 3, beat: '2 e', notes: [{ c: 3, f: 2 }], d: 0.26, rh: 'p', lh: '2', ann: 'Resposta de bordão' },
                { measure: 4, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }, { c: 2, f: 0 }, { c: 3, f: 0 }, { c: 4, f: 0 }], d: 0.60, rh: 'rasq', lh: '0', ann: 'Acorde Mi Maior de majestade' }
            ]
        },
        {
            id: 'vaca_brejo',
            title: 'A Vaca Já Foi Pro Brejo',
            author: 'Tião Carreiro & Lourival dos Santos',
            rhythm: 'Pagode Caipira / Cururu Apressado (2/4)',
            key: 'Mi Maior (E) Cebolão',
            recommendedTuning: 'viola_cebolao_e',
            bpmDefault: 110,
            desc: 'Ponteio ágil, bem-humorado e mordaz, tornado clássico nacional nos anos 1970. Demonstra a lendária velocidade de repique de Tião Carreiro, com notas repetidas rápidas nas terças e síncopes cortadas com abafamento instantâneo da mão direita.',
            techniqueTip: 'Execute as notas duplas em semicolcheias rápidas. Na batida [TAP], corte a ressonância das cordas com a palma para produzir o estalo percussivo característico do pagode de Tião Carreiro.',
            steps: [
                { measure: 1, beat: '1', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.16, rh: 'p+i', lh: '1-2', ann: 'Ataque em Mi' },
                { measure: 1, beat: '1 e', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.16, rh: 'p+i', lh: '1-2', ann: 'Repique duplo' },
                { measure: 1, beat: '2', notes: [{ c: 0, f: 2 }, { c: 1, f: 4 }], d: 0.16, rh: 'p+i', lh: '1-2', ann: 'Terça de B7' },
                { measure: 1, beat: '2 e', notes: [{ c: 0, f: 0 }, { c: 1, f: 2 }], d: 0.18, rh: 'p+i', lh: '0-2', ann: 'Terça de Lá' },
                { measure: 2, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }], d: 0.18, rh: 'p+i', lh: '0-0', ann: 'Cordas soltas' },
                { measure: 2, beat: '1 e', notes: [{ c: 3, f: 2 }], d: 0.18, rh: 'p', lh: '2', ann: 'Bordão sincopado' },
                { measure: 2, beat: '2', notes: [], d: 0.20, rh: 'tap', lh: '—', ann: 'Corte percussivo no tampo' },
                { measure: 2, beat: '2 e', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.18, rh: 'p+i', lh: '1-2', ann: 'Retorno ao repique' },
                { measure: 3, beat: '1', notes: [{ c: 0, f: 2 }, { c: 1, f: 4 }], d: 0.18, rh: 'p+i', lh: '1-2', ann: 'Descida rápida' },
                { measure: 3, beat: '1 e', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }], d: 0.18, rh: 'p+i', lh: '0-0', ann: 'Resolução em Mi' },
                { measure: 3, beat: '2', notes: [{ c: 3, f: 2 }], d: 0.20, rh: 'p', lh: '2', ann: 'Toeira firme' },
                { measure: 3, beat: '2 e', notes: [{ c: 4, f: 2 }], d: 0.22, rh: 'p', lh: '2', ann: 'Canotilho Si' },
                { measure: 4, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }, { c: 2, f: 0 }, { c: 3, f: 0 }, { c: 4, f: 0 }], d: 0.50, rh: 'rasq', lh: '0', ann: 'Arremate caipira seco' }
            ]
        },
        {
            id: 'ferrugem',
            title: 'Ferrugem',
            author: 'Almir Sater',
            rhythm: 'Toada Instrumental Pantaneira (6/8)',
            key: 'Mi Maior (E) Cebolão',
            recommendedTuning: 'viola_cebolao_e',
            bpmDefault: 76,
            desc: 'A quintessência do lirismo contemporâneo de Almir Sater. Introdução que redefiniu a viola moderna nos anos 1980, mesclando o folclore pantaneiro, a milonga e o folk com cordas soltas ressoando como pedais celestiais contra notas presas nos agudos.',
            techniqueTip: 'Toque com as pontas e unhas com apoio generoso. Não abafe nenhuma corda solta; o segredo do toque de Almir Sater é permitir que o aço vibre continuamente em simpatia harmônica como uma harpa da serra.',
            steps: [
                { measure: 1, beat: '1', notes: [{ c: 0, f: 7 }, { c: 3, f: 0 }], d: 0.28, rh: 'p+i', lh: '3-0', ann: 'Nota Si aguda com pedal Mi solto' },
                { measure: 1, beat: '2', notes: [{ c: 1, f: 9 }], d: 0.26, rh: 'i', lh: '4', ann: 'Sol# cantando no 2º par' },
                { measure: 1, beat: '3', notes: [{ c: 2, f: 0 }], d: 0.26, rh: 'p', lh: '0', ann: 'Turina solta ressoando' },
                { measure: 1, beat: '4', notes: [{ c: 0, f: 5 }, { c: 1, f: 7 }], d: 0.28, rh: 'p+i', lh: '1-3', ann: 'Terça lírica de Si com 7ª' },
                { measure: 1, beat: '5', notes: [{ c: 3, f: 0 }], d: 0.26, rh: 'p', lh: '0', ann: 'Pedal grave Mi solto' },
                { measure: 1, beat: '6', notes: [{ c: 1, f: 7 }], d: 0.26, rh: 'i', lh: '3', ann: 'Sustentação Fá#' },
                { measure: 2, beat: '1', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.28, rh: 'p+i', lh: '1-2', ann: 'Terça lírica de Mi Maior' },
                { measure: 2, beat: '2', notes: [{ c: 2, f: 0 }], d: 0.26, rh: 'p', lh: '0', ann: 'Harmônico natural de corda solta' },
                { measure: 2, beat: '3', notes: [{ c: 0, f: 2 }, { c: 1, f: 4 }], d: 0.28, rh: 'p+i', lh: '1-2', ann: 'Dueto suave' },
                { measure: 2, beat: '4', notes: [{ c: 0, f: 0 }, { c: 1, f: 2 }], d: 0.28, rh: 'p+i', lh: '0-2', ann: 'Terça de Lá (Dó# + Mi)' },
                { measure: 2, beat: '5', notes: [{ c: 3, f: 0 }], d: 0.26, rh: 'p', lh: '0', ann: 'Pedal grave' },
                { measure: 2, beat: '6', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }], d: 0.32, rh: 'p+i', lh: '0-0', ann: 'Mi Maior puro' },
                { measure: 3, beat: '1', notes: [{ c: 2, f: 1 }], d: 0.30, rh: 'p', lh: '1', ann: 'Turina Lá doce' },
                { measure: 3, beat: '3', notes: [{ c: 3, f: 2 }], d: 0.30, rh: 'p', lh: '2', ann: 'Toeira Fá#' },
                { measure: 3, beat: '5', notes: [{ c: 4, f: 2 }], d: 0.32, rh: 'p', lh: '2', ann: 'Canotilho Dó#' },
                { measure: 4, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }, { c: 2, f: 0 }, { c: 3, f: 0 }, { c: 4, f: 0 }], d: 0.70, rh: 'rasq', lh: '0', ann: 'Ressonância final pantaneira' }
            ]
        },
        {
            id: 'tristeza_jeca',
            title: 'Tristeza do Jeca',
            author: 'Angelino de Oliveira',
            rhythm: 'Toada Sentimental (3/4)',
            key: 'Mi Maior (E) Cebolão',
            recommendedTuning: 'viola_cebolao_e',
            bpmDefault: 72,
            desc: 'A mais bela elegia da alma caipira paulista, nascida em 1918 em Botucatu. O solo é uma obra-prima de ternura melódica, retratando o amanhecer na roça e o canto solitário do sabiá entre os cafezais.',
            techniqueTip: 'Aplique um vibrato macio com a mão esquerda nas notas presas (casa 4 e casa 2). Deixe a nota respirar; a dinâmica deve soar como uma confissão íntima ao luar.',
            steps: [
                { measure: 1, beat: '1', notes: [{ c: 1, f: 0 }], d: 0.32, rh: 'p', lh: '0', ann: 'Entrada nostálgica em Si' },
                { measure: 1, beat: '2', notes: [{ c: 0, f: 0 }], d: 0.30, rh: 'i', lh: '0', ann: 'Prima Mi solta' },
                { measure: 1, beat: '3', notes: [{ c: 0, f: 2 }], d: 0.32, rh: 'i', lh: '1', ann: 'Nota Fá# de passagem' },
                { measure: 2, beat: '1', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.44, rh: 'p+i', lh: '1-2', ann: 'Terça lírica de Mi sustentada' },
                { measure: 2, beat: '3', notes: [{ c: 0, f: 2 }, { c: 1, f: 4 }], d: 0.34, rh: 'p+i', lh: '1-2', ann: 'Retorno Fá#/Ré#' },
                { measure: 3, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 2 }], d: 0.34, rh: 'p+i', lh: '0-2', ann: 'Terça Dó#/Mi' },
                { measure: 3, beat: '2', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }], d: 0.34, rh: 'p+i', lh: '0-0', ann: 'Mi Maior solto' },
                { measure: 3, beat: '3', notes: [{ c: 2, f: 1 }], d: 0.30, rh: 'p', lh: '1', ann: 'Bordão Turina Lá' },
                { measure: 4, beat: '1', notes: [{ c: 3, f: 2 }], d: 0.34, rh: 'p', lh: '2', ann: 'Toeira Fá#' },
                { measure: 4, beat: '2', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }, { c: 2, f: 0 }, { c: 3, f: 0 }, { c: 4, f: 0 }], d: 0.65, rh: 'rasq', lh: '0', ann: 'Lamento final com eco em Mi' }
            ]
        },
        {
            id: 'vaca_estrela',
            title: 'Vaca Estrela e Boi Fubá',
            author: 'Patativa do Assaré',
            rhythm: 'Lamento Sertanejo Modal (6/8)',
            key: 'Mi Menor / Modal Caipira (Em) Cebolão',
            recommendedTuning: 'viola_cebolao_e',
            bpmDefault: 68,
            desc: 'A tragédia poética do sertão profundo, escrita pelo poeta do Cariri Patativa do Assaré e consagrada na voz de Fagner. O ponteio explora a sonoridade modal caipira com o uso da terça menor (Sol natural no 2º e 3º par), simbolizando o gado perdido na seca impiedosa.',
            techniqueTip: 'Destaque o peso trágico nos bordões graves oitavados da 4ª e 5ª cordas. Na casa 3 do 2º par (Ré) e casa 1 (Dó), faça o fraseado choroso da escala modal nordestina.',
            steps: [
                { measure: 1, beat: '1', notes: [{ c: 3, f: 2 }], d: 0.30, rh: 'p', lh: '2', ann: 'Bordão fundamental Fá#' },
                { measure: 1, beat: '2', notes: [{ c: 1, f: 0 }], d: 0.26, rh: 'i', lh: '0', ann: 'Si solto de apoio' },
                { measure: 1, beat: '3', notes: [{ c: 0, f: 0 }], d: 0.28, rh: 'i', lh: '0', ann: 'Prima Mi solta' },
                { measure: 1, beat: '4', notes: [{ c: 1, f: 3 }], d: 0.32, rh: 'i', lh: '3', ann: 'Nota Ré modal' },
                { measure: 1, beat: '5', notes: [{ c: 1, f: 1 }], d: 0.30, rh: 'i', lh: '1', ann: 'Nota Dó sentimental' },
                { measure: 1, beat: '6', notes: [{ c: 1, f: 0 }], d: 0.32, rh: 'i', lh: '0', ann: 'Repouso em Si' },
                { measure: 2, beat: '1', notes: [{ c: 2, f: 0 }], d: 0.30, rh: 'p', lh: '0', ann: 'Turina solta (Sol natural modal)' },
                { measure: 2, beat: '3', notes: [{ c: 3, f: 2 }], d: 0.30, rh: 'p', lh: '2', ann: 'Toeira grave' },
                { measure: 2, beat: '5', notes: [{ c: 4, f: 2 }], d: 0.32, rh: 'p', lh: '2', ann: 'Canotilho Dó#' },
                { measure: 3, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }], d: 0.36, rh: 'p+i', lh: '0-0', ann: 'Dueto aberto modal' },
                { measure: 3, beat: '4', notes: [{ c: 3, f: 2 }], d: 0.32, rh: 'p', lh: '2', ann: 'Bordão do vaqueiro' },
                { measure: 4, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }, { c: 2, f: 0 }, { c: 3, f: 2 }, { c: 4, f: 2 }], d: 0.70, rh: 'rasq', lh: '2', ann: 'Acorde modal Mi Menor com eco' }
            ]
        },
        {
            id: 'canoeiro',
            title: 'Canoeiro',
            author: 'Almirante / Zé Carreiro & Carreirinho',
            rhythm: 'Cururu Tradicional Rápido (2/4)',
            key: 'Mi Maior (E) Cebolão',
            recommendedTuning: 'viola_cebolao_e',
            bpmDefault: 100,
            desc: 'O mais célebre cururu de desafio e navegação fluvial da música paulista. O ponteio retrata a remada cadenciada do canoeiro nas corredeiras do Rio Tietê, com subidas e descidas ágeis em terças nas primeiras casas.',
            techniqueTip: 'Pratique a transição rápida entre a 2ª, 4ª, 5ª e 7ª casa mantendo a pegada em 2/4 bem marcada. A batida no tampo no compasso 3 emula o bater dos remos na amurada de cedro da canoa.',
            steps: [
                { measure: 1, beat: '1', notes: [{ c: 0, f: 2 }, { c: 1, f: 4 }], d: 0.18, rh: 'p+i', lh: '1-2', ann: 'Saída da remada (Fá# + Ré#)' },
                { measure: 1, beat: '1 e', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.20, rh: 'p+i', lh: '1-2', ann: 'Impulso em Mi Maior' },
                { measure: 1, beat: '2', notes: [{ c: 0, f: 5 }, { c: 1, f: 7 }], d: 0.18, rh: 'p+i', lh: '1-3', ann: 'Avanço em Si com 7ª' },
                { measure: 1, beat: '2 e', notes: [{ c: 0, f: 7 }, { c: 1, f: 9 }], d: 0.22, rh: 'p+i', lh: '1-3', ann: 'Ponto alto da remada' },
                { measure: 2, beat: '1', notes: [{ c: 0, f: 5 }, { c: 1, f: 7 }], d: 0.20, rh: 'p+i', lh: '1-3', ann: 'Descida pelo rio' },
                { measure: 2, beat: '1 e', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.20, rh: 'p+i', lh: '1-2', ann: 'Retorno ao Mi' },
                { measure: 2, beat: '2', notes: [{ c: 0, f: 2 }, { c: 1, f: 4 }], d: 0.18, rh: 'p+i', lh: '1-2', ann: 'Passagem em Si7' },
                { measure: 2, beat: '2 e', notes: [{ c: 0, f: 0 }, { c: 1, f: 2 }], d: 0.20, rh: 'p+i', lh: '0-2', ann: 'Chegada ao remanso' },
                { measure: 3, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }], d: 0.20, rh: 'p+i', lh: '0-0', ann: 'Porto seguro solto' },
                { measure: 3, beat: '1 e', notes: [{ c: 3, f: 2 }], d: 0.18, rh: 'p', lh: '2', ann: 'Bordão do barqueiro' },
                { measure: 3, beat: '2', notes: [], d: 0.20, rh: 'tap', lh: '—', ann: 'Batida na amurada da canoa' },
                { measure: 3, beat: '2 e', notes: [{ c: 4, f: 2 }], d: 0.22, rh: 'p', lh: '2', ann: 'Canotilho firme' },
                { measure: 4, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }, { c: 2, f: 0 }, { c: 3, f: 0 }, { c: 4, f: 0 }], d: 0.55, rh: 'rasq', lh: '0', ann: 'Rasqueado triunfal de Cururu' }
            ]
        },
        {
            id: 'luar_sertao',
            title: 'Luar do Sertão',
            author: 'Catulo da Paixão Cearense / João Pernambuco',
            rhythm: 'Canção / Valsa Poética (3/4)',
            key: 'Mi Maior (E) Cebolão',
            recommendedTuning: 'viola_cebolao_e',
            bpmDefault: 74,
            desc: 'Considerada por Villa-Lobos como o segundo hino nacional do povo brasileiro. A melodia de João Pernambuco e os versos de Catulo ganham na viola caipira a doçura infinita da noite de luar nas matas virgens do sertão.',
            techniqueTip: 'Toque com ternário sereno de valsa: marque o baixo com o polegar (p) no primeiro tempo e cante a melodia nos tempos 2 e 3 com indicador e médio, sustentando a afinação aberta.',
            steps: [
                { measure: 1, beat: '1', notes: [{ c: 0, f: 4 }, { c: 3, f: 2 }], d: 0.36, rh: 'p+i', lh: '1-2', ann: 'Sol# agudo com bordão de apoio' },
                { measure: 1, beat: '2', notes: [{ c: 0, f: 2 }], d: 0.32, rh: 'i', lh: '1', ann: 'Fá# doce' },
                { measure: 1, beat: '3', notes: [{ c: 0, f: 0 }], d: 0.34, rh: 'i', lh: '0', ann: 'Prima Mi solta' },
                { measure: 2, beat: '1', notes: [{ c: 1, f: 0 }, { c: 4, f: 2 }], d: 0.36, rh: 'p+i', lh: '0-2', ann: 'Si com baixo no Canotilho' },
                { measure: 2, beat: '2', notes: [{ c: 0, f: 0 }], d: 0.32, rh: 'i', lh: '0', ann: 'Mi lírico' },
                { measure: 2, beat: '3', notes: [{ c: 0, f: 2 }], d: 0.34, rh: 'i', lh: '1', ann: 'Fá# de retorno' },
                { measure: 3, beat: '1', notes: [{ c: 0, f: 4 }, { c: 1, f: 5 }], d: 0.38, rh: 'p+i', lh: '1-2', ann: 'Terça plena sob o luar' },
                { measure: 3, beat: '2', notes: [{ c: 2, f: 1 }], d: 0.30, rh: 'p', lh: '1', ann: 'Turina Lá suave' },
                { measure: 3, beat: '3', notes: [{ c: 3, f: 2 }], d: 0.32, rh: 'p', lh: '2', ann: 'Toeira Mi' },
                { measure: 4, beat: '1', notes: [{ c: 0, f: 0 }, { c: 1, f: 0 }, { c: 2, f: 0 }, { c: 3, f: 0 }, { c: 4, f: 0 }], d: 0.65, rh: 'rasq', lh: '0', ann: 'Ressonância final enluarada' }
            ]
        }
    ];

    let activePonteioTimers = [];

    function stopPonteioPlayback() {
        if (ponteioPlaybackTimer) {
            clearTimeout(ponteioPlaybackTimer);
            ponteioPlaybackTimer = null;
        }
        activePonteioTimers.forEach((t) => clearTimeout(t));
        activePonteioTimers = [];
        state.ponteioPlayer.isPlaying = false;
        updatePonteioUI();
    }

    function playPonteioEvent(step) {
        if (!step) return;
        if (step.rh === 'tap') {
            playWoodTap(0, 0.9);
            return;
        }
        if (step.rh === 'rasq') {
            const inst = INSTRUMENTS[state.instrumentId];
            const numCourses = inst.courses.length;
            for (let c = numCourses - 1; c >= 0; c--) {
                const nt = (step.notes || []).find((n) => n.c === c);
                const fret = nt ? nt.f : 0;
                const delaySec = (numCourses - 1 - c) * 0.016;
                playCourseAtFret(c, fret, delaySec);
                flashFretCell(c, fret, delaySec * 1000);
            }
            return;
        }

        (step.notes || []).forEach((nt, idx) => {
            const slightDelay = idx === 0 ? 0 : 0.009;
            playCourseAtFret(nt.c, nt.f, slightDelay);
            flashFretCell(nt.c, nt.f, slightDelay * 1000);
        });
    }

    function scheduleNextPonteioStep() {
        if (!state.ponteioPlayer.isPlaying) return;

        const pt = PONTEIOS_REPERTOIRE.find((p) => p.id === state.ponteioPlayer.activeId);
        if (!pt || !pt.steps || pt.steps.length === 0) {
            stopPonteioPlayback();
            return;
        }

        const curIdx = state.ponteioPlayer.currentStepIdx;
        if (curIdx >= pt.steps.length) {
            if (state.ponteioPlayer.isLooping) {
                state.ponteioPlayer.currentStepIdx = 0;
                scheduleNextPonteioStep();
            } else {
                stopPonteioPlayback();
                state.ponteioPlayer.currentStepIdx = 0;
                updatePonteioUI();
                renderFretboardSVG();
            }
            return;
        }

        const step = pt.steps[curIdx];
        playPonteioEvent(step);
        highlightPonteioStep(curIdx);
        renderFretboardSVG();

        const speed = Math.max(0.25, state.ponteioPlayer.playbackSpeed || 1.0);
        const stepDurationMs = Math.round((step.d / speed) * 1000);

        state.ponteioPlayer.currentStepIdx = curIdx + 1;

        ponteioPlaybackTimer = setTimeout(() => {
            scheduleNextPonteioStep();
        }, stepDurationMs);
    }

    function playPonteio() {
        stopScalePlayback();
        stopProgressionPlayback();
        stopTabEditorPlayback();
        stopTunerTone();
        stopEarTrainerAudio();

        const pt = PONTEIOS_REPERTOIRE.find((p) => p.id === state.ponteioPlayer.activeId) || PONTEIOS_REPERTOIRE[0];
        if (!pt || !pt.steps || pt.steps.length === 0) return;

        if (state.ponteioPlayer.isPlaying) {
            pausePonteio();
            return;
        }

        state.ponteioPlayer.isPlaying = true;
        state.displayMode = 'PONTEIO';

        if (state.ponteioPlayer.currentStepIdx < 0 || state.ponteioPlayer.currentStepIdx >= pt.steps.length) {
            state.ponteioPlayer.currentStepIdx = 0;
        }

        renderFretboardSVG();
        updatePonteioUI();
        scheduleNextPonteioStep();
    }

    function pausePonteio() {
        if (ponteioPlaybackTimer) {
            clearTimeout(ponteioPlaybackTimer);
            ponteioPlaybackTimer = null;
        }
        state.ponteioPlayer.isPlaying = false;
        updatePonteioUI();
    }

    function resetPonteio() {
        stopPonteioPlayback();
        state.ponteioPlayer.currentStepIdx = 0;
        updatePonteioUI();
        renderFretboardSVG();
    }

    function stepPonteio(direction) {
        pausePonteio();
        const pt = PONTEIOS_REPERTOIRE.find((p) => p.id === state.ponteioPlayer.activeId) || PONTEIOS_REPERTOIRE[0];
        if (!pt || !pt.steps || pt.steps.length === 0) return;

        let target = state.ponteioPlayer.currentStepIdx + direction;
        if (target < 0) target = pt.steps.length - 1;
        if (target >= pt.steps.length) target = 0;

        state.ponteioPlayer.currentStepIdx = target;
        state.displayMode = 'PONTEIO';

        const step = pt.steps[target];
        playPonteioEvent(step);
        highlightPonteioStep(target);
        renderFretboardSVG();
        updatePonteioUI();
    }

    function jumpToPonteioStep(targetIdx) {
        pausePonteio();
        const pt = PONTEIOS_REPERTOIRE.find((p) => p.id === state.ponteioPlayer.activeId) || PONTEIOS_REPERTOIRE[0];
        if (!pt || !pt.steps || pt.steps.length === 0) return;

        if (targetIdx < 0 || targetIdx >= pt.steps.length) return;

        state.ponteioPlayer.currentStepIdx = targetIdx;
        state.displayMode = 'PONTEIO';

        const step = pt.steps[targetIdx];
        playPonteioEvent(step);
        highlightPonteioStep(targetIdx);
        renderFretboardSVG();
        updatePonteioUI();
    }

    function setPlaybackSpeed(speed) {
        state.ponteioPlayer.playbackSpeed = speed;
        saveViolaState();
        updatePonteioUI();
    }

    function togglePonteioLoop() {
        state.ponteioPlayer.isLooping = !state.ponteioPlayer.isLooping;
        saveViolaState();
        updatePonteioUI();
    }

    function selectPonteio(id) {
        stopPonteioPlayback();
        const pt = PONTEIOS_REPERTOIRE.find((p) => p.id === id);
        if (!pt) return;

        state.ponteioPlayer.activeId = id;
        state.ponteioPlayer.currentStepIdx = 0;
        state.displayMode = 'PONTEIO';
        saveViolaState();
        renderPonteiosSection();
        renderFretboardSVG();
    }

    function playPonteioSequence(ponteioId) {
        selectPonteio(ponteioId);
        playPonteio();
    }

    function highlightPonteioStep(stepIdx) {
        const container = document.getElementById('viola-tab-steps-scroll');
        if (!container) return;

        container.querySelectorAll('[data-tab-step]').forEach((col) => {
            const idx = parseInt(col.getAttribute('data-tab-step'), 10);
            if (idx === stepIdx) {
                col.classList.add('bg-amber-500/20', 'border-amber-400', 'ring-2', 'ring-amber-400/50', 'shadow-[0_0_15px_rgba(245,158,11,0.45)]');
                col.classList.remove('border-transparent');
                try {
                    col.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                } catch (e) {
                    // Fallback
                }
            } else {
                col.classList.remove('bg-amber-500/20', 'border-amber-400', 'ring-2', 'ring-amber-400/50', 'shadow-[0_0_15px_rgba(245,158,11,0.45)]');
                col.classList.add('border-transparent');
            }
        });

        // Atualiza a ficha do passo ativo
        const pt = PONTEIOS_REPERTOIRE.find((p) => p.id === state.ponteioPlayer.activeId);
        const step = pt && pt.steps ? pt.steps[stepIdx] : null;
        const infoEl = document.getElementById('viola-ponteio-step-info');
        if (infoEl && step) {
            infoEl.innerHTML = `
                <div class="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span class="text-amber-300 font-bold">Compasso ${step.measure}</span>
                    <span class="text-slate-500">•</span>
                    <span class="text-slate-300">Tempo: ${step.beat}</span>
                    <span class="text-slate-500">•</span>
                    <span class="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">Mão Dir: ${step.rh}</span>
                    <span class="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Mão Esq: ${step.lh}</span>
                    <span class="text-slate-400 font-sans italic">— ${step.ann}</span>
                </div>
            `;
        }
    }

    function updatePonteioUI() {
        const playBtn = document.getElementById('btn-viola-ponteio-play');
        if (playBtn) {
            playBtn.className = state.ponteioPlayer.isPlaying
                ? 'min-h-[40px] px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-slate-950 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-lg shadow-rose-600/30'
                : 'min-h-[40px] px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-600/30';
            playBtn.innerHTML = state.ponteioPlayer.isPlaying
                ? '<i data-lucide="pause" class="w-4 h-4"></i><span>Pausar Estudo</span>'
                : '<i data-lucide="play" class="w-4 h-4"></i><span>Tocar Ponteio</span>';
            if (global.VaultCore && global.VaultCore.refreshIcons) global.VaultCore.refreshIcons(playBtn);
        }

        const loopBtn = document.getElementById('btn-viola-ponteio-loop');
        if (loopBtn) {
            loopBtn.className = state.ponteioPlayer.isLooping
                ? 'min-h-[40px] px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 transition'
                : 'min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 font-mono text-xs flex items-center gap-1.5 transition';
        }

        // Velocidade ativa
        [0.5, 0.75, 1.0, 1.2].forEach((spd) => {
            const spdBtn = document.getElementById(`btn-viola-speed-${Math.round(spd * 100)}`);
            if (spdBtn) {
                const isActive = Math.abs(state.ponteioPlayer.playbackSpeed - spd) < 0.05;
                spdBtn.className = isActive
                    ? 'px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-mono text-xs font-bold shadow'
                    : 'px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 font-mono text-xs transition';
            }
        });

        // Atualiza cards de galeria
        const gallery = document.getElementById('viola-ponteios-gallery');
        if (gallery) {
            gallery.querySelectorAll('[data-ponteio-card]').forEach((card) => {
                const cardId = card.getAttribute('data-ponteio-card');
                if (cardId === state.ponteioPlayer.activeId) {
                    card.classList.add('border-amber-500', 'bg-amber-500/10', 'ring-1', 'ring-amber-500/40');
                    card.classList.remove('border-slate-800', 'bg-[#090d16]');
                } else {
                    card.classList.remove('border-amber-500', 'bg-amber-500/10', 'ring-1', 'ring-amber-500/40');
                    card.classList.add('border-slate-800', 'bg-[#090d16]');
                }
            });
        }
    }

    function renderPonteiosSection() {
        const container = document.getElementById('viola-ponteios-container');
        if (!container) return;

        const activePt = PONTEIOS_REPERTOIRE.find((p) => p.id === state.ponteioPlayer.activeId) || PONTEIOS_REPERTOIRE[0];
        const inst = INSTRUMENTS[state.instrumentId];

        // Ordem visual dos pares conforme perspectiva
        const courseOrder = state.viewPerspective === 'diagram'
            ? [0, 1, 2, 3, 4]
            : [4, 3, 2, 1, 0];

        const courseLabels = {
            0: '1º Par (Prima: Mi/E4)',
            1: '2º Par (Segundinha: Si/B3)',
            2: '3º Par (Turina: Sol#/G#3-4)',
            3: '4º Par (Toeira: Mi/E3-4)',
            4: '5º Par (Canotilho: Si/B2-3)'
        };

        const currentStep = (state.ponteioPlayer.currentStepIdx >= 0 && activePt.steps)
            ? activePt.steps[state.ponteioPlayer.currentStepIdx]
            : activePt.steps[0];

        let prevMeasure = -1;

        container.innerHTML = `
            <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3.5 sm:p-5 space-y-4 shadow-xl">
                <!-- Cabeçalho e Seleção Rápida -->
                <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">Fase 6 Concluída</span>
                            <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">10 Ponteios Canônicos Mapeados</span>
                            <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Tablatura Caipira Digital Interativa</span>
                        </div>
                        <h3 class="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wider font-mono mt-1 flex items-center gap-2">
                            <i data-lucide="disc-3" class="w-5 h-5 text-amber-400"></i>
                            Repertório Canônico de Ponteios & Solos de Viola Caipira
                        </h3>
                        <p class="text-xs text-slate-400 mt-0.5">Execução sequenciada nota a nota, controle de andamento didático, tablatura com dedilhado de mão direita e sincronização ao braço canhoto/destro</p>
                    </div>

                    <!-- Seletor de Ponteio Rápido -->
                    <div class="flex items-center gap-2">
                        <label for="viola-select-ponteio-quick" class="text-xs font-mono text-slate-400 whitespace-nowrap">Obra Ativa:</label>
                        <select id="viola-select-ponteio-quick" class="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-amber-500/40 text-amber-200 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-amber-400 transition cursor-pointer">
                            ${PONTEIOS_REPERTOIRE.map((p) => `
                                <option value="${p.id}" ${p.id === activePt.id ? 'selected' : ''}>
                                    ${p.title} (${p.author.split('&')[0].trim()})
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <!-- Barra de Transporte e Controles de Estudo -->
                <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
                    <div class="flex flex-wrap items-center gap-2">
                        <!-- Play/Pause -->
                        <button type="button" id="btn-viola-ponteio-play" class="min-h-[40px] px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-600/30">
                            <i data-lucide="${state.ponteioPlayer.isPlaying ? 'pause' : 'play'}" class="w-4 h-4"></i>
                            <span>${state.ponteioPlayer.isPlaying ? 'Pausar Estudo' : 'Tocar Ponteio'}</span>
                        </button>

                        <!-- Parar/Resetar -->
                        <button type="button" id="btn-viola-ponteio-stop" class="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-rose-300 font-mono text-xs font-medium flex items-center gap-1.5 transition">
                            <i data-lucide="square" class="w-3.5 h-3.5"></i>
                            <span>Parar &amp; Resetar</span>
                        </button>

                        <!-- Passo a Passo (Anterior e Próxima) -->
                        <div class="inline-flex rounded-lg bg-slate-800/80 border border-slate-700 p-0.5" role="group">
                            <button type="button" id="btn-viola-ponteio-step-prev" title="Nota Anterior" class="min-h-[36px] px-2.5 py-1 text-slate-300 hover:text-amber-300 hover:bg-slate-700/60 rounded-md font-mono text-xs flex items-center gap-1 transition">
                                <i data-lucide="chevron-left" class="w-4 h-4"></i>
                                <span>Anterior</span>
                            </button>
                            <button type="button" id="btn-viola-ponteio-step-next" title="Próxima Nota" class="min-h-[36px] px-2.5 py-1 text-slate-300 hover:text-amber-300 hover:bg-slate-700/60 rounded-md font-mono text-xs flex items-center gap-1 transition">
                                <span>Próxima</span>
                                <i data-lucide="chevron-right" class="w-4 h-4"></i>
                            </button>
                        </div>

                        <!-- Loop Toggle -->
                        <button type="button" id="btn-viola-ponteio-loop" class="min-h-[40px] px-3 py-1.5 rounded-lg ${state.ponteioPlayer.isLooping ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300' : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400'} font-mono text-xs font-bold flex items-center gap-1.5 transition">
                            <i data-lucide="repeat" class="w-3.5 h-3.5"></i>
                            <span>Loop ${state.ponteioPlayer.isLooping ? 'Ligado' : 'Desligado'}</span>
                        </button>
                    </div>

                    <!-- Controle de Velocidade Didática -->
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-mono text-slate-400">Andamento:</span>
                        <div class="inline-flex rounded-lg bg-slate-800/80 border border-slate-700 p-0.5" role="group">
                            <button type="button" id="btn-viola-speed-50" class="px-2.5 py-1 rounded ${Math.abs(state.ponteioPlayer.playbackSpeed - 0.5) < 0.05 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'} font-mono text-xs transition">50% Lento</button>
                            <button type="button" id="btn-viola-speed-75" class="px-2.5 py-1 rounded ${Math.abs(state.ponteioPlayer.playbackSpeed - 0.75) < 0.05 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'} font-mono text-xs transition">75%</button>
                            <button type="button" id="btn-viola-speed-100" class="px-2.5 py-1 rounded ${Math.abs(state.ponteioPlayer.playbackSpeed - 1.0) < 0.05 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'} font-mono text-xs transition">100% Real</button>
                            <button type="button" id="btn-viola-speed-120" class="px-2.5 py-1 rounded ${Math.abs(state.ponteioPlayer.playbackSpeed - 1.2) < 0.05 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'} font-mono text-xs transition">120% Mestre</button>
                        </div>

                        <!-- Botão Focar no Braço -->
                        <button type="button" id="btn-viola-focus-fretboard" class="min-h-[40px] px-3 py-1.5 rounded-lg bg-cyan-600/15 hover:bg-cyan-600/25 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold flex items-center gap-1.5 transition">
                            <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                            <span>Ver no Braço SVG</span>
                        </button>
                    </div>
                </div>

                <!-- Info do Passo em Execução -->
                <div id="viola-ponteio-step-info" class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                    <div class="flex flex-wrap items-center gap-2 text-xs font-mono">
                        <span class="text-amber-300 font-bold">Compasso ${currentStep.measure}</span>
                        <span class="text-slate-500">•</span>
                        <span class="text-slate-300">Tempo: ${currentStep.beat}</span>
                        <span class="text-slate-500">•</span>
                        <span class="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">Mão Dir: ${currentStep.rh}</span>
                        <span class="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Mão Esq: ${currentStep.lh}</span>
                        <span class="text-slate-400 font-sans italic">— ${currentStep.ann}</span>
                    </div>
                </div>

                <!-- Visualizador de Tablatura Digital Caipira Interativa -->
                <div class="space-y-1.5">
                    <div class="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span class="flex items-center gap-1.5">
                            <i data-lucide="music" class="w-3.5 h-3.5 text-amber-400"></i>
                            <span>Tablatura para Viola Caipira (Clique em qualquer coluna para ouvir e iluminar no braço):</span>
                        </span>
                        <span class="text-[11px] text-slate-500">p = polegar | i = indicador | p+i = dueto pinçado | rasq = rasqueado | tap = batida tampo</span>
                    </div>

                    <div class="bg-[#070b12] border border-slate-800 rounded-xl p-3 flex overflow-x-auto shadow-inner custom-scrollbar" id="viola-tab-steps-scroll" style="scrollbar-width: thin; scrollbar-color: #f59e0b #090d16;">
                        <!-- Coluna Fixa com Rótulos das Cordas -->
                        <div class="flex flex-col justify-between pr-3 border-r-2 border-slate-800 select-none sticky left-0 bg-[#070b12] z-10 shrink-0 min-w-[130px] sm:min-w-[150px]">
                            <div class="h-6 flex items-center text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Mão Direita</div>
                            ${courseOrder.map((cIdx) => `
                                <div class="h-7 flex items-center text-[11px] font-mono text-slate-300 font-semibold truncate" title="${courseLabels[cIdx]}">
                                    ${courseLabels[cIdx].split(' ')[0]} ${courseLabels[cIdx].split(' ')[1]} <span class="text-slate-500 ml-1 text-[10px]">${courseLabels[cIdx].split('(')[1].replace(')', '')}</span>
                                </div>
                            `).join('')}
                            <div class="h-6 flex items-center text-[10px] font-mono text-slate-500 uppercase tracking-wider">Compasso/Tempo</div>
                        </div>

                        <!-- Colunas dos Passos da Tablatura -->
                        <div class="flex items-stretch pl-2 gap-1 shrink-0">
                            ${activePt.steps.map((st, idx) => {
                                const isNewMeasure = st.measure !== prevMeasure;
                                prevMeasure = st.measure;
                                const isCurrent = state.ponteioPlayer.currentStepIdx === idx;

                                const rhColor = st.rh === 'p+i'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                    : (st.rh === 'p'
                                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                        : (st.rh === 'i'
                                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                            : (st.rh === 'rasq'
                                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                                : 'bg-rose-500/20 text-rose-300 border-rose-500/40')));

                                return `
                                    <div data-tab-step="${idx}" class="flex flex-col items-center justify-between min-w-[42px] sm:min-w-[48px] py-1 px-1 rounded-lg border ${isCurrent ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.45)]' : 'border-transparent hover:border-amber-500/40 hover:bg-slate-800/40'} ${isNewMeasure ? 'border-l border-l-amber-500/50 pl-2' : ''} cursor-pointer transition select-none group" title="Compasso ${st.measure} (${st.beat}): ${st.ann}">
                                        <!-- Mão Direita -->
                                        <div class="h-6 flex items-center justify-center">
                                            <span class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${rhColor}">${st.rh}</span>
                                        </div>

                                        <!-- Casas dos 5 Pares -->
                                        ${courseOrder.map((cIdx) => {
                                            const noteObj = (st.notes || []).find((n) => n.c === cIdx);
                                            if (st.rh === 'tap') {
                                                return `<div class="h-7 flex items-center justify-center text-slate-700 text-xs font-mono font-bold select-none">✕</div>`;
                                            }
                                            if (st.rh === 'rasq') {
                                                const fVal = noteObj ? noteObj.f : 0;
                                                return `
                                                    <div class="h-7 flex items-center justify-center">
                                                        <span class="w-6 h-6 flex items-center justify-center rounded font-mono font-bold text-xs bg-purple-900/40 text-purple-200 border border-purple-600/40 shadow-sm">${fVal}</span>
                                                    </div>
                                                `;
                                            }
                                            if (noteObj !== undefined) {
                                                return `
                                                    <div class="h-7 flex items-center justify-center">
                                                        <span class="w-6 h-6 flex items-center justify-center rounded font-mono font-bold text-xs bg-slate-800 group-hover:bg-amber-500/20 text-amber-300 border border-slate-700 group-hover:border-amber-400/60 shadow-sm">${noteObj.f}</span>
                                                    </div>
                                                `;
                                            }
                                            return `<div class="h-7 flex items-center justify-center text-slate-700 text-xs font-mono select-none">───</div>`;
                                        }).join('')}

                                        <!-- Compasso / Tempo -->
                                        <div class="h-6 flex items-center justify-center text-[10px] font-mono ${isNewMeasure ? 'text-amber-400 font-bold' : 'text-slate-500'}">
                                            ${isNewMeasure ? `C${st.measure}` : st.beat}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>

                <!-- Ficha Técnica e Dicas do Mestre Violeiro -->
                <div class="bg-[#090d16] border border-slate-800 rounded-xl p-4 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <span class="text-[11px] font-mono text-amber-400 font-semibold">${activePt.rhythm}</span>
                            <h4 class="text-base font-bold text-slate-100">${activePt.title}</h4>
                            <p class="text-xs text-slate-400 font-mono">Composição: ${activePt.author}</p>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700">Tom: ${activePt.key}</span>
                            <span class="px-2.5 py-1 rounded bg-slate-800 text-amber-300 text-xs font-mono border border-slate-700">Andamento Original: ${activePt.bpmDefault} BPM</span>
                        </div>
                    </div>

                    <p class="text-xs text-slate-300 leading-relaxed">${activePt.desc}</p>

                    <div class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs flex items-start gap-2.5">
                        <i data-lucide="sparkles" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5"></i>
                        <div>
                            <span class="font-bold text-amber-300 font-mono uppercase tracking-wider text-[11px]">Dica do Mestre Violeiro:</span>
                            <p class="text-slate-300 mt-0.5">${activePt.techniqueTip}</p>
                        </div>
                    </div>
                </div>

                <!-- Galeria Canônica de Ponteios Clássicos -->
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
                            <i data-lucide="library" class="w-4 h-4 text-amber-400"></i>
                            Galeria Completa de Obras Canônicas de Viola Caipira
                        </h4>
                        <span class="text-[11px] text-slate-500 font-mono">10 Clássicos Disponíveis</span>
                    </div>

                    <div id="viola-ponteios-gallery" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2.5">
                        ${PONTEIOS_REPERTOIRE.map((p) => {
                            const isSelected = p.id === activePt.id;
                            return `
                                <div data-ponteio-card="${p.id}" class="rounded-xl p-3 flex flex-col justify-between transition cursor-pointer border ${isSelected ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/40' : 'border-slate-800 bg-[#090d16] hover:border-amber-500/40'}">
                                    <div class="space-y-1">
                                        <div class="flex items-center justify-between text-[10px] font-mono">
                                            <span class="text-amber-400 font-semibold truncate">${p.rhythm.split('/')[0].trim()}</span>
                                            <span class="text-slate-500">${p.bpmDefault} BPM</span>
                                        </div>
                                        <h5 class="text-xs font-bold text-slate-100 truncate">${p.title}</h5>
                                        <p class="text-[10px] text-slate-400 font-mono truncate">${p.author}</p>
                                    </div>
                                    <div class="pt-2 mt-2 border-t border-slate-800/80">
                                        <button type="button" data-select-ponteio="${p.id}" class="w-full py-1 rounded-md text-[11px] font-mono font-bold transition flex items-center justify-center gap-1 ${isSelected ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'}">
                                            <i data-lucide="${isSelected ? 'check' : 'music-2'}" class="w-3 h-3"></i>
                                            <span>${isSelected ? 'Estudando' : 'Carregar'}</span>
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;

        if (global.VaultCore && global.VaultCore.refreshIcons) global.VaultCore.refreshIcons(container);

        // Bind events dos controles
        const quickSelect = document.getElementById('viola-select-ponteio-quick');
        if (quickSelect) {
            quickSelect.addEventListener('change', (e) => selectPonteio(e.target.value));
        }

        const playBtn = document.getElementById('btn-viola-ponteio-play');
        if (playBtn) playBtn.addEventListener('click', playPonteio);

        const stopBtn = document.getElementById('btn-viola-ponteio-stop');
        if (stopBtn) stopBtn.addEventListener('click', resetPonteio);

        const stepPrevBtn = document.getElementById('btn-viola-ponteio-step-prev');
        if (stepPrevBtn) stepPrevBtn.addEventListener('click', () => stepPonteio(-1));

        const stepNextBtn = document.getElementById('btn-viola-ponteio-step-next');
        if (stepNextBtn) stepNextBtn.addEventListener('click', () => stepPonteio(1));

        const loopBtn = document.getElementById('btn-viola-ponteio-loop');
        if (loopBtn) loopBtn.addEventListener('click', togglePonteioLoop);

        [0.5, 0.75, 1.0, 1.2].forEach((spd) => {
            const spdBtn = document.getElementById(`btn-viola-speed-${Math.round(spd * 100)}`);
            if (spdBtn) spdBtn.addEventListener('click', () => setPlaybackSpeed(spd));
        });

        const focusFretBtn = document.getElementById('btn-viola-focus-fretboard');
        if (focusFretBtn) {
            focusFretBtn.addEventListener('click', () => {
                state.displayMode = 'PONTEIO';
                saveViolaState();
                renderFretboardSVG();
                syncControlValues();
                const fretWrap = document.getElementById('viola-fretboard-svg-wrap');
                if (fretWrap) fretWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }

        // Clicabilidade nas colunas da tablatura
        container.querySelectorAll('[data-tab-step]').forEach((col) => {
            col.addEventListener('click', () => {
                const idx = parseInt(col.getAttribute('data-tab-step'), 10);
                jumpToPonteioStep(idx);
            });
        });

        // Seleção na galeria
        container.querySelectorAll('[data-select-ponteio]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-select-ponteio');
                selectPonteio(id);
            });
        });

        container.querySelectorAll('[data-ponteio-card]').forEach((card) => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-ponteio-card');
                selectPonteio(id);
            });
        });
    }

    // =========================================================================
    // GERADOR, EDITOR E EXPORTADOR DE TABLATURAS E DIAGRAMAS DE CIFRAS (FASE 7)
    // =========================================================================

    function getActiveTabProject() {
        if (!state.tabEditor || !Array.isArray(state.tabEditor.projects) || state.tabEditor.projects.length === 0) {
            state.tabEditor = Object.assign({}, DEFAULT_TAB_EDITOR_STATE, {
                projects: JSON.parse(JSON.stringify(DEFAULT_TAB_EDITOR_PROJECTS))
            });
        }
        const found = state.tabEditor.projects.find((p) => p.id === state.tabEditor.activeProjectId);
        return found || state.tabEditor.projects[0];
    }

    function stopTabEditorPlayback() {
        if (tabEditorPlaybackTimer) {
            clearTimeout(tabEditorPlaybackTimer);
            tabEditorPlaybackTimer = null;
        }
        activeTabEditorTimers.forEach((t) => clearTimeout(t));
        activeTabEditorTimers = [];
        state.tabEditor.isPlaying = false;
        updateTabEditorUIState();
    }

    function scheduleNextTabEditorStep() {
        if (!state.tabEditor.isPlaying) return;

        const proj = getActiveTabProject();
        if (!proj || !proj.steps || proj.steps.length === 0) {
            stopTabEditorPlayback();
            return;
        }

        const curIdx = state.tabEditor.currentStepIdx;
        if (curIdx >= proj.steps.length) {
            if (state.tabEditor.isLooping) {
                state.tabEditor.currentStepIdx = 0;
                scheduleNextTabEditorStep();
            } else {
                stopTabEditorPlayback();
                state.tabEditor.currentStepIdx = 0;
                updateTabEditorUIState();
                renderFretboardSVG();
            }
            return;
        }

        const step = proj.steps[curIdx];
        playPonteioEvent(step);
        highlightTabEditorStep(curIdx);
        renderFretboardSVG();

        const speed = Math.max(0.25, state.tabEditor.playbackSpeed || 1.0);
        const bpmFactor = 96 / Math.max(40, proj.bpm || 96);
        const stepDurationMs = Math.round(((step.d || 0.22) * bpmFactor / speed) * 1000);

        state.tabEditor.currentStepIdx = curIdx + 1;

        tabEditorPlaybackTimer = setTimeout(() => {
            scheduleNextTabEditorStep();
        }, stepDurationMs);
    }

    function playTabEditorPlayback() {
        stopScalePlayback();
        stopProgressionPlayback();
        stopTunerTone();
        stopEarTrainerAudio();
        stopPonteioPlayback();

        const proj = getActiveTabProject();
        if (!proj || !proj.steps || proj.steps.length === 0) return;

        if (state.tabEditor.isPlaying) {
            pauseTabEditorPlayback();
            return;
        }

        state.tabEditor.isPlaying = true;
        state.displayMode = 'TAB_EDITOR';

        if (state.tabEditor.currentStepIdx < 0 || state.tabEditor.currentStepIdx >= proj.steps.length) {
            state.tabEditor.currentStepIdx = 0;
        }

        renderFretboardSVG();
        updateTabEditorUIState();
        scheduleNextTabEditorStep();
    }

    function pauseTabEditorPlayback() {
        stopTabEditorPlayback();
    }

    function stepTabEditor(delta) {
        stopTabEditorPlayback();
        const proj = getActiveTabProject();
        if (!proj || !proj.steps || proj.steps.length === 0) return;

        let nextIdx = (state.tabEditor.currentStepIdx < 0 ? 0 : state.tabEditor.currentStepIdx) + delta;
        if (nextIdx < 0) nextIdx = proj.steps.length - 1;
        if (nextIdx >= proj.steps.length) nextIdx = 0;

        state.tabEditor.currentStepIdx = nextIdx;
        state.displayMode = 'TAB_EDITOR';

        const step = proj.steps[nextIdx];
        playPonteioEvent(step);
        highlightTabEditorStep(nextIdx);
        renderFretboardSVG();
        saveViolaState();
    }

    function jumpToTabEditorStep(idx) {
        stopTabEditorPlayback();
        const proj = getActiveTabProject();
        if (!proj || !proj.steps || idx < 0 || idx >= proj.steps.length) return;

        state.tabEditor.currentStepIdx = idx;
        state.displayMode = 'TAB_EDITOR';

        const step = proj.steps[idx];
        playPonteioEvent(step);
        highlightTabEditorStep(idx);
        renderFretboardSVG();
        saveViolaState();
    }

    function highlightTabEditorStep(stepIdx) {
        const container = document.getElementById('viola-tab-editor-grid');
        if (!container) return;

        container.querySelectorAll('[data-editor-step]').forEach((col) => {
            const idx = parseInt(col.getAttribute('data-editor-step'), 10);
            if (idx === stepIdx) {
                col.classList.add('bg-violet-500/25', 'border-violet-400', 'ring-2', 'ring-violet-400/50', 'shadow-[0_0_15px_rgba(168,85,247,0.45)]');
                col.classList.remove('border-slate-800');
                try {
                    col.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                } catch (_) {}
            } else {
                col.classList.remove('bg-violet-500/25', 'border-violet-400', 'ring-2', 'ring-violet-400/50', 'shadow-[0_0_15px_rgba(168,85,247,0.45)]');
                col.classList.add('border-slate-800');
            }
        });

        // Atualiza a ficha do passo ativo
        const proj = getActiveTabProject();
        if (!proj || !proj.steps || !proj.steps[stepIdx]) return;
        const curStep = proj.steps[stepIdx];
        const inst = INSTRUMENTS[state.instrumentId];

        const notesDesc = (curStep.notes && curStep.notes.length > 0)
            ? curStep.notes.map((n) => {
                const pc = (inst.courses[n.c].pitchClass + n.f) % 12;
                return `${inst.courses[n.c].num}ºP (${NOTE_NAMES[pc]} c.${n.f})`;
            }).join(' + ')
            : (curStep.rh === 'tap' ? 'Batida no Tampo [TAP]' : 'Pausa / Sem nota');

        const activeCard = document.getElementById('viola-tab-active-step-info');
        if (activeCard) {
            activeCard.innerHTML = `
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono text-xs font-bold border border-violet-500/30">
                            Compasso ${curStep.measure} • Tempo ${curStep.beat}
                        </span>
                        <span class="text-xs font-mono text-slate-300 font-semibold">
                            ${notesDesc}
                        </span>
                        ${curStep.chord ? `<span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">${curStep.chord}</span>` : ''}
                    </div>
                    <div class="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span>Mão Dir: <strong class="text-amber-400">${curStep.rh || 'p'}</strong></span>
                        <span>Mão Esq: <strong class="text-cyan-400">${curStep.lh || '—'}</strong></span>
                        <span>Duração: <strong class="text-slate-300">${Math.round(curStep.d * 1000)}ms</strong></span>
                    </div>
                </div>
            `;
        }
    }

    function toggleTabEditorLoop() {
        state.tabEditor.isLooping = !state.tabEditor.isLooping;
        saveViolaState();
        updateTabEditorUIState();
    }

    function setTabEditorSpeed(speed) {
        state.tabEditor.playbackSpeed = speed;
        saveViolaState();
        updateTabEditorUIState();
    }

    function updateTabEditorUIState() {
        const playBtn = document.getElementById('btn-viola-tab-play');
        if (playBtn) {
            playBtn.className = state.tabEditor.isPlaying
                ? 'min-h-[40px] px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg'
                : 'min-h-[40px] px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg';
            playBtn.innerHTML = state.tabEditor.isPlaying
                ? '<i data-lucide="pause" class="w-4 h-4"></i><span>Pausar</span>'
                : '<i data-lucide="play" class="w-4 h-4"></i><span>Tocar Obra</span>';
            if (global.VaultCore && global.VaultCore.refreshIcons) global.VaultCore.refreshIcons(playBtn);
        }

        const loopBtn = document.getElementById('btn-viola-tab-loop');
        if (loopBtn) {
            loopBtn.className = state.tabEditor.isLooping
                ? 'min-h-[40px] px-3 py-1.5 rounded-lg bg-violet-600/25 border border-violet-400 text-violet-200 text-xs font-mono font-semibold flex items-center gap-1 transition'
                : 'min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 text-xs font-mono flex items-center gap-1 transition';
        }

        [0.5, 0.75, 1.0, 1.25].forEach((spd) => {
            const btn = document.getElementById(`btn-viola-tab-speed-${Math.round(spd * 100)}`);
            if (btn) {
                const isActive = Math.abs((state.tabEditor.playbackSpeed || 1.0) - spd) < 0.05;
                btn.className = isActive
                    ? 'px-2 py-1 text-[11px] font-mono rounded bg-violet-600 text-white font-bold shadow'
                    : 'px-2 py-1 text-[11px] font-mono rounded bg-slate-800 text-slate-400 hover:text-slate-200';
            }
        });
    }

    function toggleTabEditorNote(courseIdx, fret) {
        const proj = getActiveTabProject();
        if (!proj || !proj.steps) return;
        const curIdx = state.tabEditor.currentStepIdx;
        if (curIdx < 0 || curIdx >= proj.steps.length) return;

        const step = proj.steps[curIdx];
        if (!Array.isArray(step.notes)) step.notes = [];

        if (step.rh === 'tap') {
            step.rh = 'p';
            step.ann = '';
        }

        const existingIdx = step.notes.findIndex((n) => n.c === courseIdx);
        if (existingIdx >= 0) {
            if (step.notes[existingIdx].f === fret) {
                step.notes.splice(existingIdx, 1);
            } else {
                step.notes[existingIdx].f = fret;
            }
        } else {
            step.notes.push({ c: courseIdx, f: fret });
            step.notes.sort((a, b) => a.c - b.c);
        }

        // Atualiza digitação e técnica
        if (step.notes.length === 0) {
            step.rh = 'p';
            step.lh = '—';
        } else if (step.notes.length === 1) {
            step.rh = step.notes[0].c === 0 ? 'i' : 'p';
            step.lh = String(step.notes[0].f);
        } else if (step.notes.length === 2) {
            step.rh = 'p+i';
            step.lh = `${step.notes[0].f}-${step.notes[1].f}`;
        } else {
            step.rh = 'rasq';
            step.lh = step.notes.map((n) => n.f).join('-');
        }

        // Tenta deduzir o acorde via Dicionário Reverso algorítmico
        const inst = INSTRUMENTS[state.instrumentId];
        if (step.notes.length >= 2) {
            const shape = inst.courses.map((_, idx) => {
                const nt = step.notes.find((n) => n.c === idx);
                return nt ? nt.f : -1;
            });
            const chordAnalysis = analyzeReverseChord(inst, shape);
            if (chordAnalysis && chordAnalysis.found && chordAnalysis.match) {
                step.chord = chordAnalysis.match.fullName ? chordAnalysis.match.fullName.split(' ')[0] : (chordAnalysis.rootName || '');
            }
        }

        proj.updatedAt = new Date().toISOString();
        saveViolaState();
        renderTabEditorSection();
        renderFretboardSVG();
    }

    function setTabEditorStepTech(rh) {
        const proj = getActiveTabProject();
        if (!proj || !proj.steps) return;
        const curIdx = state.tabEditor.currentStepIdx;
        if (curIdx < 0 || curIdx >= proj.steps.length) return;

        const step = proj.steps[curIdx];
        step.rh = rh;
        if (rh === 'tap') {
            step.notes = [];
            step.lh = '—';
            step.ann = 'Batida no tampo [TAP]';
            playWoodTap(0, 0.9);
        } else if (rh === 'rasq') {
            if (!step.notes || step.notes.length === 0) {
                const inst = INSTRUMENTS[state.instrumentId];
                step.notes = inst.courses.map((_, idx) => ({ c: idx, f: 0 }));
            }
            playPonteioEvent(step);
        }
        proj.updatedAt = new Date().toISOString();
        saveViolaState();
        renderTabEditorSection();
        renderFretboardSVG();
    }

    function addTabEditorStep(afterIdx) {
        const proj = getActiveTabProject();
        if (!proj || !proj.steps) return;

        const baseStep = proj.steps[afterIdx] || proj.steps[proj.steps.length - 1];
        const newStep = {
            measure: baseStep ? baseStep.measure : 1,
            beat: baseStep ? `${baseStep.beat}*` : '1',
            notes: [],
            d: 0.22,
            rh: 'p',
            lh: '—',
            chord: '',
            ann: ''
        };

        proj.steps.splice(afterIdx + 1, 0, newStep);
        state.tabEditor.currentStepIdx = afterIdx + 1;
        proj.updatedAt = new Date().toISOString();

        saveViolaState();
        renderTabEditorSection();
        renderFretboardSVG();
    }

    function duplicateTabEditorStep(idx) {
        const proj = getActiveTabProject();
        if (!proj || !proj.steps || idx < 0 || idx >= proj.steps.length) return;

        const cloned = JSON.parse(JSON.stringify(proj.steps[idx]));
        proj.steps.splice(idx + 1, 0, cloned);
        state.tabEditor.currentStepIdx = idx + 1;
        proj.updatedAt = new Date().toISOString();

        playPonteioEvent(cloned);
        saveViolaState();
        renderTabEditorSection();
        renderFretboardSVG();
    }

    function deleteTabEditorStep(idx) {
        const proj = getActiveTabProject();
        if (!proj || !proj.steps || proj.steps.length <= 1) return;

        proj.steps.splice(idx, 1);
        state.tabEditor.currentStepIdx = Math.max(0, Math.min(idx, proj.steps.length - 1));
        proj.updatedAt = new Date().toISOString();

        saveViolaState();
        renderTabEditorSection();
        renderFretboardSVG();
    }

    function clearTabEditorStep(idx) {
        const proj = getActiveTabProject();
        if (!proj || !proj.steps || idx < 0 || idx >= proj.steps.length) return;

        const step = proj.steps[idx];
        step.notes = [];
        step.rh = 'p';
        step.lh = '—';
        step.chord = '';
        step.ann = '';
        proj.updatedAt = new Date().toISOString();

        saveViolaState();
        renderTabEditorSection();
        renderFretboardSVG();
    }

    function addTabEditorMeasure() {
        const proj = getActiveTabProject();
        if (!proj || !proj.steps) return;

        const maxM = proj.steps.reduce((acc, s) => Math.max(acc, s.measure || 1), 1);
        const newM = maxM + 1;
        const sig = proj.timeSignature || '2/4';

        const beats = sig === '3/4'
            ? ['1', '2', '3']
            : (sig === '6/8'
                ? ['1', '2', '3', '4', '5', '6']
                : ['1', '1 e', '2', '2 e']);

        beats.forEach((b) => {
            proj.steps.push({
                measure: newM,
                beat: b,
                notes: [],
                d: sig === '3/4' ? 0.30 : 0.22,
                rh: 'p',
                lh: '—',
                chord: '',
                ann: ''
            });
        });

        state.tabEditor.currentStepIdx = proj.steps.length - beats.length;
        proj.updatedAt = new Date().toISOString();

        saveViolaState();
        renderTabEditorSection();
        renderFretboardSVG();
    }

    function addCaipiraThirdDuad() {
        const duads = computeDuadScaleSteps();
        if (!duads || duads.length === 0) return;
        const proj = getActiveTabProject();
        const curIdx = state.tabEditor.currentStepIdx;
        if (curIdx < 0 || curIdx >= proj.steps.length) return;

        // Pega o dueto da tônica ou 1º grau (Mi Maior)
        const d0 = duads[0];
        const step = proj.steps[curIdx];
        step.notes = [
            { c: d0.upperCourse, f: d0.upperFret },
            { c: d0.lowerCourse, f: d0.lowerFret }
        ];
        step.rh = 'p+i';
        step.lh = `${d0.upperFret}-${d0.lowerFret}`;
        step.ann = `Terça de ${d0.upperNote}/${d0.lowerNote}`;
        playPonteioEvent(step);

        proj.updatedAt = new Date().toISOString();
        saveViolaState();
        renderTabEditorSection();
        renderFretboardSVG();
    }

    function addCaipiraSixthDuad() {
        const origType = state.duadType;
        state.duadType = 'SIXTHS_1_3';
        const duads = computeDuadScaleSteps();
        state.duadType = origType;

        if (!duads || duads.length === 0) return;
        const proj = getActiveTabProject();
        const curIdx = state.tabEditor.currentStepIdx;
        if (curIdx < 0 || curIdx >= proj.steps.length) return;

        const d0 = duads[0];
        const step = proj.steps[curIdx];
        step.notes = [
            { c: d0.upperCourse, f: d0.upperFret },
            { c: d0.lowerCourse, f: d0.lowerFret }
        ];
        step.rh = 'p+i';
        step.lh = `${d0.upperFret}-${d0.lowerFret}`;
        step.ann = `Sexta de ${d0.upperNote}/${d0.lowerNote}`;
        playPonteioEvent(step);

        proj.updatedAt = new Date().toISOString();
        saveViolaState();
        renderTabEditorSection();
        renderFretboardSVG();
    }

    function createNewTabProject(templateKey, customTitle, customAuthor) {
        let baseProject = null;
        if (templateKey === 'sextas') {
            baseProject = DEFAULT_TAB_EDITOR_PROJECTS[1];
        } else if (templateKey === 'cururu') {
            baseProject = DEFAULT_TAB_EDITOR_PROJECTS[2];
        } else if (templateKey === 'guarania') {
            baseProject = DEFAULT_TAB_EDITOR_PROJECTS[3];
        } else if (templateKey === 'blank') {
            baseProject = {
                id: 'nova_obra_' + Date.now(),
                title: customTitle || 'Nova Composição Caipira',
                author: customAuthor || 'Violeiro do Nexus',
                instrumentId: state.instrumentId || 'viola_cebolao_e',
                timeSignature: '2/4',
                bpm: 92,
                key: 'Mi Maior (E) Cebolão',
                updatedAt: new Date().toISOString(),
                steps: [
                    { measure: 1, beat: '1', notes: [], d: 0.24, rh: 'p', lh: '—', chord: '', ann: '' },
                    { measure: 1, beat: '1 e', notes: [], d: 0.24, rh: 'p', lh: '—', chord: '', ann: '' },
                    { measure: 1, beat: '2', notes: [], d: 0.24, rh: 'p', lh: '—', chord: '', ann: '' },
                    { measure: 1, beat: '2 e', notes: [], d: 0.24, rh: 'p', lh: '—', chord: '', ann: '' },
                    { measure: 2, beat: '1', notes: [], d: 0.24, rh: 'p', lh: '—', chord: '', ann: '' },
                    { measure: 2, beat: '1 e', notes: [], d: 0.24, rh: 'p', lh: '—', chord: '', ann: '' },
                    { measure: 2, beat: '2', notes: [], d: 0.24, rh: 'p', lh: '—', chord: '', ann: '' },
                    { measure: 2, beat: '2 e', notes: [], d: 0.24, rh: 'p', lh: '—', chord: '', ann: '' }
                ]
            };
        } else {
            baseProject = DEFAULT_TAB_EDITOR_PROJECTS[0];
        }

        const newId = 'obra_' + Date.now();
        const newProj = JSON.parse(JSON.stringify(baseProject));
        newProj.id = newId;
        newProj.title = customTitle || newProj.title;
        newProj.author = customAuthor || newProj.author;
        newProj.instrumentId = state.instrumentId;
        newProj.updatedAt = new Date().toISOString();

        if (!Array.isArray(state.tabEditor.projects)) {
            state.tabEditor.projects = JSON.parse(JSON.stringify(DEFAULT_TAB_EDITOR_PROJECTS));
        }
        state.tabEditor.projects.unshift(newProj);
        state.tabEditor.activeProjectId = newId;
        state.tabEditor.currentStepIdx = 0;
        state.displayMode = 'TAB_EDITOR';

        saveViolaState();
        renderAll();
    }

    function deleteTabProject(projectId) {
        if (!state.tabEditor.projects || state.tabEditor.projects.length <= 1) {
            alert('Não é possível excluir a única composição salva no cofre.');
            return;
        }
        if (!confirm('Deseja realmente excluir esta composição do cofre?')) return;

        state.tabEditor.projects = state.tabEditor.projects.filter((p) => p.id !== projectId);
        state.tabEditor.activeProjectId = state.tabEditor.projects[0].id;
        state.tabEditor.currentStepIdx = 0;

        saveViolaState();
        renderAll();
    }

    function importPonteioToEditor(ponteioId) {
        const pt = PONTEIOS_REPERTOIRE.find((p) => p.id === ponteioId);
        if (!pt) return;

        const newId = 'ponteio_' + pt.id + '_' + Date.now();
        const clonedSteps = JSON.parse(JSON.stringify(pt.steps || []));

        const newProj = {
            id: newId,
            title: '[Solo] ' + pt.title,
            author: pt.author || 'Mestre Violeiro',
            instrumentId: pt.recommendedTuning || state.instrumentId || 'viola_cebolao_e',
            timeSignature: pt.rhythm && pt.rhythm.includes('3/4') ? '3/4' : (pt.rhythm && pt.rhythm.includes('6/8') ? '6/8' : '2/4'),
            bpm: pt.bpmDefault || 96,
            key: pt.key || 'Mi Maior (E) Cebolão',
            updatedAt: new Date().toISOString(),
            steps: clonedSteps
        };

        if (!Array.isArray(state.tabEditor.projects)) {
            state.tabEditor.projects = JSON.parse(JSON.stringify(DEFAULT_TAB_EDITOR_PROJECTS));
        }
        state.tabEditor.projects.unshift(newProj);
        state.tabEditor.activeProjectId = newId;
        state.tabEditor.currentStepIdx = 0;
        state.displayMode = 'TAB_EDITOR';

        saveViolaState();
        renderAll();

        const wrap = document.getElementById('viola-tab-editor-container');
        if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function renderTabEditorSection() {
        const container = document.getElementById('viola-tab-editor-container');
        if (!container) return;

        const proj = getActiveTabProject();
        const inst = INSTRUMENTS[proj.instrumentId || state.instrumentId];
        const numCourses = inst.courses.length;
        const courseOrder = state.viewPerspective === 'diagram'
            ? Array.from({ length: numCourses }, (_, i) => i)
            : Array.from({ length: numCourses }, (_, i) => numCourses - 1 - i);

        const currentStep = (state.tabEditor.currentStepIdx >= 0 && proj.steps)
            ? proj.steps[state.tabEditor.currentStepIdx]
            : (proj.steps ? proj.steps[0] : null);

        let prevMeasure = -1;

        container.innerHTML = `
            <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3.5 sm:p-5 space-y-4 shadow-xl">
                <!-- Cabeçalho e Gerenciador de Obras -->
                <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-violet-500/15 text-violet-300 border border-violet-500/30">Fase 7 Concluída</span>
                            <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Composição &amp; Tablatura Caipira</span>
                            <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Exportador Multiformato (ASCII / Canvas HD / PDF)</span>
                        </div>
                        <h3 class="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wider font-mono mt-1 flex items-center gap-2">
                            <i data-lucide="pen-tool" class="w-5 h-5 text-violet-400"></i>
                            Gerador, Editor e Exportador de Tablaturas e Cifras Caipiras
                        </h3>
                        <p class="text-xs text-slate-400 mt-0.5">Crie arranjos para 5 pares de viola ou 6 cordas de violão, edite clicando na tablatura ou no braço SVG virtual, aplique técnicas caipiras em 1 clique e exporte partituras em alta resolução</p>
                    </div>

                    <!-- Seletor de Obras e Ações Rápidas -->
                    <div class="flex flex-wrap items-center gap-2">
                        <select id="viola-select-tab-project" class="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#090d16] border border-violet-500/40 text-violet-200 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-violet-400 transition cursor-pointer">
                            ${(state.tabEditor.projects || []).map((p) => `
                                <option value="${p.id}" ${p.id === proj.id ? 'selected' : ''}>
                                    ${p.title} (${p.author || 'Violeiro'})
                                </option>
                            `).join('')}
                        </select>

                        <button type="button" id="btn-viola-tab-new" class="min-h-[38px] px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition shadow">
                            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                            <span>Nova</span>
                        </button>

                        <button type="button" id="btn-viola-tab-import-solo" class="min-h-[38px] px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono text-xs font-semibold flex items-center gap-1.5 transition">
                            <i data-lucide="download" class="w-3.5 h-3.5"></i>
                            <span class="hidden sm:inline">Clonar Solo</span>
                        </button>

                        <button type="button" id="btn-viola-tab-export-ascii" class="min-h-[38px] px-3 py-1.5 rounded-lg bg-cyan-600/15 hover:bg-cyan-600/25 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold flex items-center gap-1.5 transition">
                            <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
                            <span>ASCII</span>
                        </button>

                        <button type="button" id="btn-viola-tab-export-diagram" class="min-h-[38px] px-3 py-1.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-semibold flex items-center gap-1.5 transition">
                            <i data-lucide="image" class="w-3.5 h-3.5"></i>
                            <span>Canvas HD / PDF</span>
                        </button>

                        <button type="button" id="btn-viola-tab-delete" title="Excluir Composição" class="min-h-[38px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 border border-slate-700 hover:border-rose-700 text-rose-400 font-mono text-xs transition">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>
                </div>

                <!-- Metadados da Composição Ativa -->
                <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    <div>
                        <label class="block text-[10px] font-mono uppercase text-slate-400 mb-0.5">Título da Obra</label>
                        <input type="text" id="viola-tab-title-input" value="${proj.title || ''}" class="w-full px-2.5 py-1 rounded-md bg-[#0f172a] border border-slate-700 text-slate-100 text-xs font-mono font-bold focus:border-violet-400 outline-none">
                    </div>
                    <div>
                        <label class="block text-[10px] font-mono uppercase text-slate-400 mb-0.5">Autor / Arranjo</label>
                        <input type="text" id="viola-tab-author-input" value="${proj.author || ''}" class="w-full px-2.5 py-1 rounded-md bg-[#0f172a] border border-slate-700 text-slate-100 text-xs font-mono focus:border-violet-400 outline-none">
                    </div>
                    <div>
                        <label class="block text-[10px] font-mono uppercase text-slate-400 mb-0.5">Andamento &amp; Compasso</label>
                        <div class="flex items-center gap-1.5">
                            <input type="number" id="viola-tab-bpm-input" value="${proj.bpm || 96}" min="40" max="220" class="w-20 px-2 py-1 rounded-md bg-[#0f172a] border border-slate-700 text-cyan-300 text-xs font-mono font-bold outline-none">
                            <span class="text-xs font-mono text-slate-500">BPM</span>
                            <select id="viola-tab-sig-select" class="px-2 py-1 rounded-md bg-[#0f172a] border border-slate-700 text-slate-300 text-xs font-mono outline-none">
                                <option value="2/4" ${(proj.timeSignature || '2/4') === '2/4' ? 'selected' : ''}>2/4</option>
                                <option value="3/4" ${(proj.timeSignature || '') === '3/4' ? 'selected' : ''}>3/4</option>
                                <option value="4/4" ${(proj.timeSignature || '') === '4/4' ? 'selected' : ''}>4/4</option>
                                <option value="6/8" ${(proj.timeSignature || '') === '6/8' ? 'selected' : ''}>6/8</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex items-end justify-between sm:justify-end gap-2">
                        <span class="text-[11px] font-mono text-slate-400">Total: <strong class="text-violet-300">${proj.steps ? proj.steps.length : 0} tempos</strong></span>
                        <button type="button" id="btn-viola-tab-add-measure" class="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-violet-300 text-xs font-mono font-semibold flex items-center gap-1 transition">
                            <i data-lucide="plus-square" class="w-3.5 h-3.5"></i>
                            <span>+ Compasso</span>
                        </button>
                    </div>
                </div>

                <!-- Barra de Transporte e Controles do Reprodutor -->
                <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
                    <div class="flex flex-wrap items-center gap-2">
                        <button type="button" id="btn-viola-tab-play" class="min-h-[40px] px-4 py-1.5 rounded-lg ${state.tabEditor.isPlaying ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' : 'bg-violet-600 hover:bg-violet-500 text-white'} font-mono text-xs font-bold flex items-center gap-1.5 transition shadow-lg">
                            <i data-lucide="${state.tabEditor.isPlaying ? 'pause' : 'play'}" class="w-4 h-4"></i>
                            <span>${state.tabEditor.isPlaying ? 'Pausar' : 'Tocar Obra'}</span>
                        </button>

                        <button type="button" id="btn-viola-tab-stop" class="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-rose-300 font-mono text-xs font-medium flex items-center gap-1.5 transition">
                            <i data-lucide="square" class="w-3.5 h-3.5"></i>
                            <span>Resetar</span>
                        </button>

                        <div class="inline-flex rounded-lg bg-slate-800/80 border border-slate-700 p-0.5" role="group">
                            <button type="button" id="btn-viola-tab-step-prev" title="Tempo Anterior" class="min-h-[36px] px-2.5 py-1 text-slate-300 hover:text-violet-300 hover:bg-slate-700/60 rounded-md font-mono text-xs flex items-center gap-1 transition">
                                <i data-lucide="chevron-left" class="w-4 h-4"></i>
                                <span>Anterior</span>
                            </button>
                            <button type="button" id="btn-viola-tab-step-next" title="Próximo Tempo" class="min-h-[36px] px-2.5 py-1 text-slate-300 hover:text-violet-300 hover:bg-slate-700/60 rounded-md font-mono text-xs flex items-center gap-1 transition">
                                <span>Próximo</span>
                                <i data-lucide="chevron-right" class="w-4 h-4"></i>
                            </button>
                        </div>

                        <button type="button" id="btn-viola-tab-loop" class="min-h-[40px] px-3 py-1.5 rounded-lg ${state.tabEditor.isLooping ? 'bg-violet-600/25 border border-violet-400 text-violet-200' : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400'} font-mono text-xs font-bold flex items-center gap-1.5 transition">
                            <i data-lucide="repeat" class="w-3.5 h-3.5"></i>
                            <span>Loop ${state.tabEditor.isLooping ? 'Ligado' : 'Desligado'}</span>
                        </button>
                    </div>

                    <!-- Velocidades Didáticas -->
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-mono text-slate-400">Velocidade:</span>
                        <div class="inline-flex rounded-lg bg-slate-800/80 border border-slate-700 p-0.5" role="group">
                            <button type="button" id="btn-viola-tab-speed-50" class="px-2 py-1 rounded text-[11px] font-mono transition ${Math.abs(state.tabEditor.playbackSpeed - 0.5) < 0.05 ? 'bg-violet-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}">50%</button>
                            <button type="button" id="btn-viola-tab-speed-75" class="px-2 py-1 rounded text-[11px] font-mono transition ${Math.abs(state.tabEditor.playbackSpeed - 0.75) < 0.05 ? 'bg-violet-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}">75%</button>
                            <button type="button" id="btn-viola-tab-speed-100" class="px-2 py-1 rounded text-[11px] font-mono transition ${Math.abs(state.tabEditor.playbackSpeed - 1.0) < 0.05 ? 'bg-violet-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}">100%</button>
                            <button type="button" id="btn-viola-tab-speed-125" class="px-2 py-1 rounded text-[11px] font-mono transition ${Math.abs(state.tabEditor.playbackSpeed - 1.25) < 0.05 ? 'bg-violet-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}">125%</button>
                        </div>
                    </div>
                </div>

                <!-- Ações Rápidas de Técnicas Caipiras no Passo Ativo -->
                <div class="bg-[#090d16] border border-slate-800 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                    <div class="flex flex-wrap items-center gap-1.5">
                        <span class="text-slate-500 font-semibold uppercase text-[10px] mr-1">Técnicas 1-Clique:</span>
                        <button type="button" id="btn-viola-tab-tech-tap" title="Batida Percussiva no Tampo da Viola" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-rose-300 font-bold transition flex items-center gap-1">
                            <span>[TAP] Tampo</span>
                        </button>
                        <button type="button" id="btn-viola-tab-tech-rasq" title="Rasqueado Aberto em Todas as Cordas" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-purple-300 font-bold transition flex items-center gap-1">
                            <span>[RASQ] Rasqueado</span>
                        </button>
                        <button type="button" id="btn-viola-tab-tech-third" title="Inserir Dueto em Terça Diatônica nos Pares 1 e 2" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold transition flex items-center gap-1">
                            <span>[3ª] Terça Caipira</span>
                        </button>
                        <button type="button" id="btn-viola-tab-tech-sixth" title="Inserir Dueto em Sexta nos Pares 1 e 3" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold transition flex items-center gap-1">
                            <span>[6ª] Sexta Caipira</span>
                        </button>
                    </div>

                    <div class="flex flex-wrap items-center gap-1.5">
                        <button type="button" id="btn-viola-tab-step-add" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition">+ Tempo</button>
                        <button type="button" id="btn-viola-tab-step-dup" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition">Duplicar</button>
                        <button type="button" id="btn-viola-tab-step-clear" class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 hover:text-amber-300 transition">Limpar</button>
                        <button type="button" id="btn-viola-tab-step-del" class="px-2 py-1 rounded bg-slate-800 hover:bg-rose-950 border border-slate-700 hover:border-rose-700 text-rose-400 transition">Excluir</button>
                    </div>
                </div>

                <!-- Ficha do Passo Ativo -->
                <div id="viola-tab-active-step-info" class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs"></div>

                <!-- Grade Interativa de Tablatura -->
                <div class="space-y-1.5">
                    <div class="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span class="flex items-center gap-1.5">
                            <i data-lucide="grid" class="w-3.5 h-3.5 text-violet-400"></i>
                            <span>Pauta Digital (Clique para editar casa ou digite números 0..14):</span>
                        </span>
                        <span class="text-[11px] text-slate-500">Clique no Braço Virtual SVG para inserir notas no passo selecionado!</span>
                    </div>

                    <div class="bg-[#070b12] border border-slate-800 rounded-xl p-3 flex overflow-x-auto shadow-inner custom-scrollbar" id="viola-tab-editor-grid" style="scrollbar-width: thin; scrollbar-color: #8b5cf6 #090d16;">
                        <!-- Coluna Fixa com Rótulos das Cordas -->
                        <div class="flex flex-col justify-between pr-3 border-r-2 border-slate-800 select-none sticky left-0 bg-[#070b12] z-10 shrink-0 min-w-[125px] sm:min-w-[145px]">
                            <div class="h-6 flex items-center text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">Mão / Cifra</div>
                            ${courseOrder.map((cIdx) => {
                                const c = inst.courses[cIdx];
                                const cleanNote = c.note.split('/')[0];
                                return `
                                    <div class="h-7 flex items-center text-[11px] font-mono text-slate-300 font-semibold truncate" title="${c.label}">
                                        ${c.num}º ${cleanNote} <span class="text-slate-500 ml-1 text-[10px]">(${c.label.split('(')[1] ? c.label.split('(')[1].replace(')', '') : ''})</span>
                                    </div>
                                `;
                            }).join('')}
                            <div class="h-6 flex items-center text-[10px] font-mono text-slate-500 uppercase tracking-wider">Compasso/Tempo</div>
                        </div>

                        <!-- Colunas dos Passos da Tablatura -->
                        <div class="flex items-stretch pl-2 gap-1 shrink-0">
                            ${(proj.steps || []).map((st, idx) => {
                                const isNewMeasure = st.measure !== prevMeasure;
                                prevMeasure = st.measure;
                                const isCurrent = state.tabEditor.currentStepIdx === idx;

                                return `
                                    <div data-editor-step="${idx}" class="flex flex-col items-center justify-between min-w-[44px] sm:min-w-[50px] py-1 px-1 rounded-lg border ${isCurrent ? 'bg-violet-500/25 border-violet-400 ring-2 ring-violet-400/50 shadow-[0_0_15px_rgba(168,85,247,0.45)]' : 'border-slate-800 hover:border-violet-500/40 hover:bg-slate-800/40'} ${isNewMeasure ? 'border-l-2 border-l-violet-500/60 pl-2' : ''} cursor-pointer transition select-none group" title="Compasso ${st.measure} • Tempo ${st.beat}">
                                        <!-- Cifra ou Mão Direita -->
                                        <div class="h-6 flex items-center justify-center">
                                            <span class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${st.chord ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-300 border border-slate-700'}">${st.chord || st.rh || 'p'}</span>
                                        </div>

                                        <!-- Casas dos Pares / Cordas -->
                                        ${courseOrder.map((cIdx) => {
                                            const noteObj = (st.notes || []).find((n) => n.c === cIdx);
                                            if (st.rh === 'tap') {
                                                return `<div class="h-7 flex items-center justify-center text-rose-400 text-xs font-mono font-bold select-none">[TAP]</div>`;
                                            }
                                            if (st.rh === 'rasq') {
                                                const fVal = noteObj ? noteObj.f : 0;
                                                return `
                                                    <div class="h-7 flex items-center justify-center">
                                                        <span class="w-6 h-6 flex items-center justify-center rounded font-mono font-bold text-xs bg-purple-900/40 text-purple-200 border border-purple-600/40 shadow-sm">${fVal}</span>
                                                    </div>
                                                `;
                                            }
                                            if (noteObj !== undefined) {
                                                return `
                                                    <div class="h-7 flex items-center justify-center">
                                                        <span class="w-6 h-6 flex items-center justify-center rounded font-mono font-bold text-xs bg-violet-900/50 group-hover:bg-violet-500/20 text-violet-200 border border-violet-500/60 shadow-sm">${noteObj.f}</span>
                                                    </div>
                                                `;
                                            }
                                            return `<div class="h-7 flex items-center justify-center text-slate-700 text-xs font-mono select-none">───</div>`;
                                        }).join('')}

                                        <!-- Compasso / Tempo -->
                                        <div class="h-6 flex items-center justify-center text-[10px] font-mono ${isNewMeasure ? 'text-violet-400 font-bold' : 'text-slate-500'}">
                                            ${isNewMeasure ? `C${st.measure}` : st.beat}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (global.VaultCore && global.VaultCore.refreshIcons) global.VaultCore.refreshIcons(container);

        // Bind events dos metadados
        const titleInput = document.getElementById('viola-tab-title-input');
        if (titleInput) {
            titleInput.addEventListener('change', (e) => {
                proj.title = e.target.value.trim() || 'Sem Título';
                proj.updatedAt = new Date().toISOString();
                saveViolaState();
            });
        }

        const authorInput = document.getElementById('viola-tab-author-input');
        if (authorInput) {
            authorInput.addEventListener('change', (e) => {
                proj.author = e.target.value.trim() || 'Violeiro';
                proj.updatedAt = new Date().toISOString();
                saveViolaState();
            });
        }

        const bpmInput = document.getElementById('viola-tab-bpm-input');
        if (bpmInput) {
            bpmInput.addEventListener('change', (e) => {
                proj.bpm = Math.max(40, Math.min(220, parseInt(e.target.value, 10) || 96));
                proj.updatedAt = new Date().toISOString();
                saveViolaState();
            });
        }

        const sigSelect = document.getElementById('viola-tab-sig-select');
        if (sigSelect) {
            sigSelect.addEventListener('change', (e) => {
                proj.timeSignature = e.target.value;
                proj.updatedAt = new Date().toISOString();
                saveViolaState();
                renderTabEditorSection();
            });
        }

        const projSelect = document.getElementById('viola-select-tab-project');
        if (projSelect) {
            projSelect.addEventListener('change', (e) => {
                stopTabEditorPlayback();
                state.tabEditor.activeProjectId = e.target.value;
                state.tabEditor.currentStepIdx = 0;
                saveViolaState();
                renderAll();
            });
        }

        // Botões de Ação
        const newBtn = document.getElementById('btn-viola-tab-new');
        if (newBtn) newBtn.addEventListener('click', openNewTabProjectModal);

        const importBtn = document.getElementById('btn-viola-tab-import-solo');
        if (importBtn) importBtn.addEventListener('click', openImportPonteioModal);

        const exportAsciiBtn = document.getElementById('btn-viola-tab-export-ascii');
        if (exportAsciiBtn) exportAsciiBtn.addEventListener('click', openTabExportAsciiModal);

        const exportDiagramBtn = document.getElementById('btn-viola-tab-export-diagram');
        if (exportDiagramBtn) exportDiagramBtn.addEventListener('click', openTabExportDiagramModal);

        const deleteBtn = document.getElementById('btn-viola-tab-delete');
        if (deleteBtn) deleteBtn.addEventListener('click', () => deleteTabProject(proj.id));

        const addMeasureBtn = document.getElementById('btn-viola-tab-add-measure');
        if (addMeasureBtn) addMeasureBtn.addEventListener('click', addTabEditorMeasure);

        // Player de Transporte
        const playBtn = document.getElementById('btn-viola-tab-play');
        if (playBtn) playBtn.addEventListener('click', playTabEditorPlayback);

        const stopBtn = document.getElementById('btn-viola-tab-stop');
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                stopTabEditorPlayback();
                state.tabEditor.currentStepIdx = 0;
                highlightTabEditorStep(0);
                renderFretboardSVG();
            });
        }

        const stepPrevBtn = document.getElementById('btn-viola-tab-step-prev');
        if (stepPrevBtn) stepPrevBtn.addEventListener('click', () => stepTabEditor(-1));

        const stepNextBtn = document.getElementById('btn-viola-tab-step-next');
        if (stepNextBtn) stepNextBtn.addEventListener('click', () => stepTabEditor(1));

        const loopBtn = document.getElementById('btn-viola-tab-loop');
        if (loopBtn) loopBtn.addEventListener('click', toggleTabEditorLoop);

        [0.5, 0.75, 1.0, 1.25].forEach((spd) => {
            const btn = document.getElementById(`btn-viola-tab-speed-${Math.round(spd * 100)}`);
            if (btn) btn.addEventListener('click', () => setTabEditorSpeed(spd));
        });

        // Técnicas Caipiras 1-Clique
        const techTapBtn = document.getElementById('btn-viola-tab-tech-tap');
        if (techTapBtn) techTapBtn.addEventListener('click', () => setTabEditorStepTech('tap'));

        const techRasqBtn = document.getElementById('btn-viola-tab-tech-rasq');
        if (techRasqBtn) techRasqBtn.addEventListener('click', () => setTabEditorStepTech('rasq'));

        const techThirdBtn = document.getElementById('btn-viola-tab-tech-third');
        if (techThirdBtn) techThirdBtn.addEventListener('click', addCaipiraThirdDuad);

        const techSixthBtn = document.getElementById('btn-viola-tab-tech-sixth');
        if (techSixthBtn) techSixthBtn.addEventListener('click', addCaipiraSixthDuad);

        const stepAddBtn = document.getElementById('btn-viola-tab-step-add');
        if (stepAddBtn) stepAddBtn.addEventListener('click', () => addTabEditorStep(state.tabEditor.currentStepIdx));

        const stepDupBtn = document.getElementById('btn-viola-tab-step-dup');
        if (stepDupBtn) stepDupBtn.addEventListener('click', () => duplicateTabEditorStep(state.tabEditor.currentStepIdx));

        const stepClearBtn = document.getElementById('btn-viola-tab-step-clear');
        if (stepClearBtn) stepClearBtn.addEventListener('click', () => clearTabEditorStep(state.tabEditor.currentStepIdx));

        const stepDelBtn = document.getElementById('btn-viola-tab-step-del');
        if (stepDelBtn) stepDelBtn.addEventListener('click', () => deleteTabEditorStep(state.tabEditor.currentStepIdx));

        // Clicabilidade nas colunas de passo
        container.querySelectorAll('[data-editor-step]').forEach((col) => {
            col.addEventListener('click', () => {
                const idx = parseInt(col.getAttribute('data-editor-step'), 10);
                jumpToTabEditorStep(idx);
            });
        });

        highlightTabEditorStep(state.tabEditor.currentStepIdx >= 0 ? state.tabEditor.currentStepIdx : 0);
    }

    // =========================================================================
    // MOTOR DE EXPORTAÇÃO ASCII FORMATADO (.TAB / .TXT)
    // =========================================================================
    function generateTabAscii(project, isLeftHanded, viewPerspective) {
        const inst = INSTRUMENTS[project.instrumentId || state.instrumentId];
        const numCourses = inst.courses.length;
        const courseOrder = viewPerspective === 'diagram'
            ? Array.from({ length: numCourses }, (_, i) => i)
            : Array.from({ length: numCourses }, (_, i) => numCourses - 1 - i);

        const measuresMap = new Map();
        (project.steps || []).forEach((st, idx) => {
            const m = st.measure || 1;
            if (!measuresMap.has(m)) measuresMap.set(m, []);
            measuresMap.get(m).push({ step: st, idx });
        });

        const measureNumbers = Array.from(measuresMap.keys()).sort((a, b) => a - b);
        let out = '';

        out += `================================================================================\n`;
        out += `NEXUS VAULT — TABLATURA & PONTEIO CAIPIRA (FASE 7)\n`;
        out += `Obra: ${project.title || 'Sem Título'}\n`;
        out += `Compositor / Arranjo: ${project.author || 'Violeiro do Nexus'}\n`;
        out += `Instrumento: ${inst.name}\n`;
        out += `Afinação: ${inst.tuning} | Andamento: ${project.bpm || 96} BPM | Compasso: ${project.timeSignature || '2/4'}\n`;
        out += `Orientação: ${isLeftHanded ? 'Canhoto (Pestana à Direita)' : 'Destro (Pestana à Esquerda)'}\n`;
        out += `Exportado em: ${new Date().toLocaleDateString('pt-BR')} via Nexus Vault Studio\n`;
        out += `================================================================================\n\n`;

        // Agrupa de 2 em 2 compassos por linha de sistema
        const measuresPerRow = 2;
        for (let i = 0; i < measureNumbers.length; i += measuresPerRow) {
            const currentMeasures = measureNumbers.slice(i, i + measuresPerRow);
            out += `[ Compassos ${currentMeasures.join(' & ')} ]\n`;

            // Linha de Cifras
            let chordLine = 'Cifra : ';
            currentMeasures.forEach((m) => {
                const steps = measuresMap.get(m) || [];
                steps.forEach(({ step }) => {
                    const ch = step.chord || ' ';
                    chordLine += ch.padEnd(8, ' ');
                });
                chordLine += '| ';
            });
            out += chordLine.trimEnd() + '\n';

            // Linha de Mão Direita
            let rhLine = 'M.Dir : ';
            currentMeasures.forEach((m) => {
                const steps = measuresMap.get(m) || [];
                steps.forEach(({ step }) => {
                    const rh = step.rh || ' ';
                    rhLine += rh.padEnd(8, ' ');
                });
                rhLine += '| ';
            });
            out += rhLine.trimEnd() + '\n';

            // Linhas das Cordas
            courseOrder.forEach((cIdx) => {
                const course = inst.courses[cIdx];
                const cleanNote = course.note.split('/')[0];
                const prefix = `${course.num}º(${cleanNote})`.padEnd(7, ' ') + '|';
                let stringLine = prefix;

                currentMeasures.forEach((m) => {
                    const steps = measuresMap.get(m) || [];
                    steps.forEach(({ step }) => {
                        const nt = (step.notes || []).find((n) => n.c === cIdx);
                        let cell = '----';
                        if (step.rh === 'tap') {
                            cell = cIdx === 2 ? '[TAP]' : '----';
                        } else if (step.rh === 'rasq') {
                            cell = nt ? `-${nt.f}--` : '-0--';
                        } else if (nt) {
                            cell = `-${nt.f}--`;
                        }
                        stringLine += cell.padEnd(8, '-');
                    });
                    stringLine += '|';
                });
                out += stringLine + '\n';
            });

            // Linha de Tempos / Pulsos
            let beatLine = 'Tempo : ';
            currentMeasures.forEach((m) => {
                const steps = measuresMap.get(m) || [];
                steps.forEach(({ step }) => {
                    const b = step.beat || ' ';
                    beatLine += b.padEnd(8, ' ');
                });
                beatLine += '| ';
            });
            out += beatLine.trimEnd() + '\n\n';
        }

        out += `================================================================================\n`;
        out += `Legenda Mão Direita: p = Polegar, i = Indicador, p+i = Pinçado/Dueto,\n`;
        out += `tap = Batida no Tampo, rasq = Rasqueado aberto.\n`;
        out += `================================================================================\n`;

        return out;
    }

    // =========================================================================
    // MOTOR DE EXPORTAÇÃO GRÁFICA EM CANVAS HD & IMPRESSÃO / PDF
    // =========================================================================
    function renderTabDiagramCanvas(canvas, project, isLeftHanded, viewPerspective) {
        if (!canvas) return;
        const inst = INSTRUMENTS[project.instrumentId || state.instrumentId];
        const numCourses = inst.courses.length;
        const courseOrder = viewPerspective === 'diagram'
            ? Array.from({ length: numCourses }, (_, i) => i)
            : Array.from({ length: numCourses }, (_, i) => numCourses - 1 - i);

        const measuresMap = new Map();
        (project.steps || []).forEach((st, idx) => {
            const m = st.measure || 1;
            if (!measuresMap.has(m)) measuresMap.set(m, []);
            measuresMap.get(m).push({ step: st, idx });
        });

        const measureNumbers = Array.from(measuresMap.keys()).sort((a, b) => a - b);
        const measuresPerRow = 2;
        const totalRows = Math.ceil(measureNumbers.length / measuresPerRow);

        const dpr = 2;
        const width = 1100;
        const headerH = 140;
        const rowH = 175;
        const footerH = 65;
        const height = headerH + totalRows * rowH + footerH;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        // Fundo Estúdio Escuro Nobre
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#090d16');
        bgGrad.addColorStop(1, '#050811');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Moldura estúdio
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(16, 16, width - 32, height - 32);

        // Cabeçalho Artístico
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.fillText(project.title || 'Sem Título', 36, 52);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px "JetBrains Mono", monospace';
        const metaStr = `Compositor: ${project.author || 'Violeiro'}  •  Instrumento: ${inst.name}  •  Andamento: ${project.bpm || 96} BPM  •  Compasso: ${project.timeSignature || '2/4'}  •  Afinação: ${inst.tuning}`;
        ctx.fillText(metaStr, 36, 80);

        ctx.fillStyle = isLeftHanded ? '#fbbf24' : '#38bdf8';
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        const handText = isLeftHanded ? '★ MODO CANHOTO ATIVO (PESTANA À DIREITA)' : 'MODO DESTRO (PESTANA À ESQUERDA)';
        ctx.fillText(handText, 36, 104);

        ctx.strokeStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(36, 120);
        ctx.lineTo(width - 36, 120);
        ctx.stroke();

        // Pautas por Linha de Sistema
        const padX = 110;
        const usableW = width - padX - 45;

        for (let r = 0; r < totalRows; r++) {
            const currentMeasures = measureNumbers.slice(r * measuresPerRow, (r + 1) * measuresPerRow);
            const rowTopY = headerH + r * rowH + 20;
            const staveH = (numCourses - 1) * 18;

            // Rótulos laterais das cordas
            courseOrder.forEach((cIdx, rowIdx) => {
                const c = inst.courses[cIdx];
                const y = rowTopY + 25 + rowIdx * 18;
                ctx.fillStyle = '#64748b';
                ctx.font = 'bold 11px "JetBrains Mono", monospace';
                ctx.fillText(`${c.num}º ${c.note.split('/')[0]}`, 36, y + 4);

                // Linha da corda
                ctx.strokeStyle = '#334155';
                ctx.lineWidth = 1.2;
                ctx.beginPath();
                ctx.moveTo(padX, y);
                ctx.lineTo(width - 45, y);
                ctx.stroke();
            });

            // Barras duplas no início e fim da linha
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(padX, rowTopY + 25);
            ctx.lineTo(padX, rowTopY + 25 + staveH);
            ctx.stroke();

            // Renderiza cada compasso
            const measureW = usableW / currentMeasures.length;
            currentMeasures.forEach((m, mIdx) => {
                const mStartX = padX + mIdx * measureW;
                const mEndX = mStartX + measureW;
                const steps = measuresMap.get(m) || [];

                // Barra final de compasso
                ctx.strokeStyle = '#475569';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(mEndX, rowTopY + 25);
                ctx.lineTo(mEndX, rowTopY + 25 + staveH);
                ctx.stroke();

                // Número do compasso
                ctx.fillStyle = '#38bdf8';
                ctx.font = 'bold 11px "JetBrains Mono", monospace';
                ctx.fillText(`C.${m}`, mStartX + 8, rowTopY + 12);

                // Passos do compasso
                const stepW = measureW / Math.max(steps.length, 1);
                steps.forEach(({ step }, sIdx) => {
                    const stepX = mStartX + sIdx * stepW + stepW * 0.5;

                    // Cifra acima da pauta
                    if (step.chord) {
                        ctx.fillStyle = '#10b981';
                        ctx.font = 'bold 12px "JetBrains Mono", monospace';
                        ctx.textAlign = 'center';
                        ctx.fillText(step.chord, stepX, rowTopY + 14);
                    }

                    // Técnica mão direita abaixo da pauta
                    if (step.rh) {
                        ctx.fillStyle = '#f59e0b';
                        ctx.font = 'bold 10px "JetBrains Mono", monospace';
                        ctx.textAlign = 'center';
                        ctx.fillText(step.rh, stepX, rowTopY + 38 + staveH);
                    }

                    // Batida no tampo [TAP]
                    if (step.rh === 'tap') {
                        const tapY = rowTopY + 25 + staveH * 0.5;
                        ctx.fillStyle = '#e11d48';
                        ctx.beginPath();
                        ctx.arc(stepX, tapY, 10, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 8.5px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.fillText('TAP', stepX, tapY + 3);
                        return;
                    }

                    // Notas nas cordas
                    (step.notes || []).forEach((nt) => {
                        const visualIdx = courseOrder.indexOf(nt.c);
                        if (visualIdx >= 0) {
                            const noteY = rowTopY + 25 + visualIdx * 18;
                            ctx.fillStyle = '#0f172a';
                            ctx.beginPath();
                            ctx.arc(stepX, noteY, 8.5, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.strokeStyle = '#a855f7';
                            ctx.lineWidth = 2;
                            ctx.stroke();

                            ctx.fillStyle = '#ffffff';
                            ctx.font = 'bold 10px "JetBrains Mono", monospace';
                            ctx.textAlign = 'center';
                            ctx.fillText(String(nt.f), stepX, noteY + 3.5);
                        }
                    });
                });
            });
            ctx.textAlign = 'start';
        }

        // Rodapé
        ctx.fillStyle = '#64748b';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(`Nexus Vault • Estúdio Digital de Viola Caipira & Violão • deomagalhaes.com.br`, 36, height - 28);
    }

    // =========================================================================
    // MODAIS DE EXPORTAÇÃO E IMPORTAÇÃO
    // =========================================================================
    function showTabEditorModal(titleHtml, bodyHtml, footerButtonsHtml) {
        let overlay = document.getElementById('viola-tab-modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'viola-tab-modal-overlay';
            document.body.appendChild(overlay);
        }

        overlay.className = 'fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto';
        overlay.innerHTML = `
            <div class="bg-[#0f172a] border border-[#1e293b] rounded-2xl w-full max-w-4xl p-5 sm:p-6 space-y-4 shadow-2xl relative my-auto animate-in fade-in zoom-in-95">
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div class="flex items-center gap-2">
                        ${titleHtml}
                    </div>
                    <button type="button" id="btn-close-tab-modal" class="min-h-[36px] min-w-[36px] rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
                <div class="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                    ${bodyHtml}
                </div>
                <div class="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-slate-800">
                    ${footerButtonsHtml}
                </div>
            </div>
        `;

        const closeBtn = document.getElementById('btn-close-tab-modal');
        if (closeBtn) closeBtn.addEventListener('click', closeTabEditorModal);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeTabEditorModal();
        });

        if (global.VaultCore && global.VaultCore.refreshIcons) {
            global.VaultCore.refreshIcons(overlay);
        }
    }

    function closeTabEditorModal() {
        const overlay = document.getElementById('viola-tab-modal-overlay');
        if (overlay) {
            overlay.className = 'hidden';
            overlay.innerHTML = '';
        }
    }

    function openTabExportAsciiModal() {
        const proj = getActiveTabProject();
        const ascii = generateTabAscii(proj, state.isLeftHanded, state.viewPerspective);

        const titleHtml = `
            <i data-lucide="file-text" class="w-5 h-5 text-cyan-400"></i>
            <div>
                <h3 class="text-base font-bold text-slate-100">Exportar Tablatura ASCII (.tab / .txt)</h3>
                <p class="text-xs text-slate-400">Formato universal de texto com cifras, métrica e afinação formatada</p>
            </div>
        `;

        const bodyHtml = `
            <div class="space-y-2">
                <div class="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Pré-visualização da Tablatura:</span>
                    <span class="text-amber-300">${proj.steps ? proj.steps.length : 0} tempos mapeados</span>
                </div>
                <textarea id="viola-tab-ascii-output" readonly rows="16" class="w-full p-4 rounded-xl bg-[#090d16] border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed outline-none select-all focus:border-cyan-500">${ascii}</textarea>
            </div>
        `;

        const footerHtml = `
            <button type="button" id="btn-modal-copy-ascii" class="min-h-[40px] px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition">
                <i data-lucide="copy" class="w-4 h-4"></i>
                <span id="label-copy-ascii">Copiar Tablatura</span>
            </button>
            <button type="button" id="btn-modal-download-tab" class="min-h-[40px] px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition">
                <i data-lucide="download" class="w-4 h-4"></i>
                <span>Baixar Arquivo .tab</span>
            </button>
        `;

        showTabEditorModal(titleHtml, bodyHtml, footerHtml);

        const copyBtn = document.getElementById('btn-modal-copy-ascii');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const ta = document.getElementById('viola-tab-ascii-output');
                if (ta) {
                    navigator.clipboard.writeText(ta.value).then(() => {
                        const lbl = document.getElementById('label-copy-ascii');
                        if (lbl) lbl.textContent = '✓ Copiado com Sucesso!';
                        setTimeout(() => {
                            if (lbl) lbl.textContent = 'Copiar Tablatura';
                        }, 2500);
                    });
                }
            });
        }

        const dlBtn = document.getElementById('btn-modal-download-tab');
        if (dlBtn) {
            dlBtn.addEventListener('click', () => {
                const blob = new Blob([ascii], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                const slug = (proj.title || 'tablatura').toLowerCase().replace(/[^a-z0-9]/g, '_');
                a.href = url;
                a.download = `${slug}.tab`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        }
    }

    function openTabExportDiagramModal() {
        const proj = getActiveTabProject();
        const titleHtml = `
            <i data-lucide="image" class="w-5 h-5 text-violet-400"></i>
            <div>
                <h3 class="text-base font-bold text-slate-100">Diagrama Gráfico HD & Partitura (Canvas)</h3>
                <p class="text-xs text-slate-400">Renderização vetorial de alta definição para compartilhamento e impressão</p>
            </div>
        `;

        const bodyHtml = `
            <div class="space-y-3">
                <div class="w-full overflow-x-auto rounded-xl border border-slate-800 bg-[#090d16] p-2">
                    <canvas id="viola-tab-export-canvas" class="w-full h-auto select-none rounded shadow-lg"></canvas>
                </div>
            </div>
        `;

        const footerHtml = `
            <button type="button" id="btn-modal-download-png" class="min-h-[40px] px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 transition">
                <i data-lucide="download" class="w-4 h-4"></i>
                <span>Baixar Imagem HD (PNG)</span>
            </button>
            <button type="button" id="btn-modal-print-diagram" class="min-h-[40px] px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition">
                <i data-lucide="printer" class="w-4 h-4"></i>
                <span>Imprimir / Salvar em PDF</span>
            </button>
        `;

        showTabEditorModal(titleHtml, bodyHtml, footerHtml);

        const canvas = document.getElementById('viola-tab-export-canvas');
        if (canvas) {
            renderTabDiagramCanvas(canvas, proj, state.isLeftHanded, state.viewPerspective);
        }

        const dlBtn = document.getElementById('btn-modal-download-png');
        if (dlBtn && canvas) {
            dlBtn.addEventListener('click', () => {
                const dataUrl = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                const slug = (proj.title || 'partitura_caipira').toLowerCase().replace(/[^a-z0-9]/g, '_');
                a.href = dataUrl;
                a.download = `${slug}_nexus.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
        }

        const printBtn = document.getElementById('btn-modal-print-diagram');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                printTabProject(proj);
            });
        }
    }

    function printTabProject(project) {
        const inst = INSTRUMENTS[project.instrumentId || state.instrumentId];
        const ascii = generateTabAscii(project, state.isLeftHanded, state.viewPerspective);
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Por favor, permita pop-ups no seu navegador para imprimir a partitura.');
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="utf-8">
                <title>${project.title || 'Tablatura Caipira'} — Partitura / Nexus Vault</title>
                <style>
                    @page { size: A4 portrait; margin: 12mm; }
                    body { font-family: 'JetBrains Mono', Courier, monospace; background: #fff; color: #000; margin: 0; padding: 15px; }
                    h1 { font-family: Inter, sans-serif; font-size: 20px; margin: 0 0 6px 0; font-weight: 800; color: #111; }
                    .meta { font-family: Inter, sans-serif; font-size: 11px; color: #444; border-bottom: 2px solid #222; padding-bottom: 8px; margin-bottom: 12px; }
                    pre { font-size: 11px; line-height: 1.35; white-space: pre-wrap; word-break: break-all; margin: 0; }
                    .footer { font-family: Inter, sans-serif; font-size: 10px; color: #666; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 6px; }
                </style>
            </head>
            <body>
                <h1>${project.title || 'Composição Caipira'}</h1>
                <div class="meta">
                    <strong>Autor / Arranjo:</strong> ${project.author || 'Violeiro'} | 
                    <strong>Instrumento:</strong> ${inst.name} | 
                    <strong>Andamento:</strong> ${project.bpm || 96} BPM | 
                    <strong>Orientação:</strong> ${state.isLeftHanded ? 'Canhoto (Pestana à Direita)' : 'Destro'}
                </div>
                <pre>${ascii}</pre>
                <div class="footer">Gerado via Nexus Vault • Estúdio de Viola Caipira & Violão • deomagalhaes.com.br</div>
                <script>
                    window.onload = function() {
                        window.print();
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    function openImportPonteioModal() {
        const titleHtml = `
            <i data-lucide="download" class="w-5 h-5 text-amber-400"></i>
            <div>
                <h3 class="text-base font-bold text-slate-100">Clonar Solo Canônico da Biblioteca (Fase 6)</h3>
                <p class="text-xs text-slate-400">Importe um clássico para o Editor para personalizar, adicionar variações e exportar</p>
            </div>
        `;

        const bodyHtml = `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                ${PONTEIOS_REPERTOIRE.map((pt) => `
                    <button type="button" data-import-ponteio-id="${pt.id}" class="p-3 rounded-xl bg-[#090d16] border border-slate-800 hover:border-amber-400 text-left transition group">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold font-mono text-slate-200 group-hover:text-amber-300 transition">${pt.title}</span>
                            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">${pt.rhythm.split(' ')[0]}</span>
                        </div>
                        <div class="text-[11px] text-slate-400 mt-1">${pt.author}</div>
                        <div class="text-[10px] text-slate-400 line-clamp-2 mt-1">${pt.desc}</div>
                    </button>
                `).join('')}
            </div>
        `;

        const footerHtml = `
            <button type="button" onclick="document.getElementById('btn-close-tab-modal').click()" class="min-h-[38px] px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono">Cancelar</button>
        `;

        showTabEditorModal(titleHtml, bodyHtml, footerHtml);

        const overlay = document.getElementById('viola-tab-modal-overlay');
        if (overlay) {
            overlay.querySelectorAll('[data-import-ponteio-id]').forEach((btn) => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-import-ponteio-id');
                    closeTabEditorModal();
                    importPonteioToEditor(id);
                });
            });
        }
    }

    function openNewTabProjectModal() {
        const titleHtml = `
            <i data-lucide="plus-circle" class="w-5 h-5 text-violet-400"></i>
            <div>
                <h3 class="text-base font-bold text-slate-100">Nova Composição Caipira</h3>
                <p class="text-xs text-slate-400">Escolha um ponto de partida ou monte uma tablatura em branco</p>
            </div>
        `;

        const bodyHtml = `
            <form id="form-new-tab-proj" class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-mono text-slate-400 mb-1">Título da Música *</label>
                        <input type="text" id="new-tab-title" value="Minha Nova Moda de Viola" required class="w-full px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-xs font-mono text-slate-100 focus:border-violet-400 outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-mono text-slate-400 mb-1">Compositor / Arranjo</label>
                        <input type="text" id="new-tab-author" value="Violeiro do Nexus" class="w-full px-3 py-2 rounded-lg bg-[#090d16] border border-slate-700 text-xs font-mono text-slate-100 focus:border-violet-400 outline-none">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-mono text-slate-400 mb-1.5">Escolha o Padrão Inicial (Template)</label>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <label class="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-violet-500 cursor-pointer flex flex-col justify-between">
                            <div>
                                <input type="radio" name="new-tab-template" value="moda" checked class="accent-violet-500">
                                <span class="text-xs font-bold text-slate-200 ml-1.5">Moda Caipira</span>
                            </div>
                            <span class="text-[10px] text-slate-400 mt-1">Dueto em terças com batida no tampo [TAP] e rasqueado</span>
                        </label>

                        <label class="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-violet-500 cursor-pointer flex flex-col justify-between">
                            <div>
                                <input type="radio" name="new-tab-template" value="sextas" class="accent-violet-500">
                                <span class="text-xs font-bold text-slate-200 ml-1.5">Ponteio em Sextas</span>
                            </div>
                            <span class="text-[10px] text-slate-400 mt-1">Sextas clássicas nos pares 1 e 3 (estilo Menino da Porteira)</span>
                        </label>

                        <label class="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-violet-500 cursor-pointer flex flex-col justify-between">
                            <div>
                                <input type="radio" name="new-tab-template" value="cururu" class="accent-violet-500">
                                <span class="text-xs font-bold text-slate-200 ml-1.5">Cururu Veloz</span>
                            </div>
                            <span class="text-[10px] text-slate-400 mt-1">Repiques sincopados rápidos e quedas em bordão grave</span>
                        </label>

                        <label class="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-violet-500 cursor-pointer flex flex-col justify-between">
                            <div>
                                <input type="radio" name="new-tab-template" value="guarania" class="accent-violet-500">
                                <span class="text-xs font-bold text-slate-200 ml-1.5">Guarânia 3/4</span>
                            </div>
                            <span class="text-[10px] text-slate-400 mt-1">Compasso ternário lírico com dedilhados abertos</span>
                        </label>

                        <label class="p-2.5 rounded-lg bg-[#090d16] border border-slate-800 hover:border-violet-500 cursor-pointer flex flex-col justify-between sm:col-span-2">
                            <div>
                                <input type="radio" name="new-tab-template" value="blank" class="accent-violet-500">
                                <span class="text-xs font-bold text-slate-200 ml-1.5">Composição em Branco (Tablatura Limpa)</span>
                            </div>
                            <span class="text-[10px] text-slate-400 mt-1">Comece do zero com 2 compassos vazios prontos para digitação</span>
                        </label>
                    </div>
                </div>
            </form>
        `;

        const footerHtml = `
            <button type="button" onclick="document.getElementById('btn-close-tab-modal').click()" class="min-h-[40px] px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono">Cancelar</button>
            <button type="button" id="btn-submit-new-tab" class="min-h-[40px] px-5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5 transition">
                <i data-lucide="sparkles" class="w-4 h-4"></i>
                <span>Criar Composição</span>
            </button>
        `;

        showTabEditorModal(titleHtml, bodyHtml, footerHtml);

        const submitBtn = document.getElementById('btn-submit-new-tab');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const titleInput = document.getElementById('new-tab-title');
                const authorInput = document.getElementById('new-tab-author');
                const tplRadio = document.querySelector('input[name="new-tab-template"]:checked');
                const tplKey = tplRadio ? tplRadio.value : 'moda';
                const title = titleInput ? titleInput.value.trim() : 'Nova Composição';
                const author = authorInput ? authorInput.value.trim() : 'Violeiro';

                closeTabEditorModal();
                createNewTabProject(tplKey, title, author);
            });
        }
    }

    // =========================================================================
    // TREINADOR DE ESCALAS MODAIS CAIPIRAS (FASE 8)
    // =========================================================================

    function findBestFretForPitch(inst, targetPc, preferCourse = 0, minFret = 0, maxFret = 12) {
        let best = null;
        let minDistance = 999;
        inst.courses.forEach((c, cIdx) => {
            let f = (targetPc - c.pitchClass + 12) % 12;
            if (f < minFret && f + 12 <= maxFret) {
                f += 12;
            }
            if (f >= minFret && f <= maxFret) {
                const dist = Math.abs(cIdx - preferCourse);
                if (dist < minDistance) {
                    minDistance = dist;
                    best = { c: cIdx, f };
                }
            }
        });
        return best || { c: Math.min(preferCourse, inst.courses.length - 1), f: 0 };
    }

    function computeModalExerciseSteps(modeId, rootPc, exerciseId, inst) {
        const modalCfg = MODAL_SCALES[modeId] || MODAL_SCALES.lydian;
        const intervals = modalCfg.intervals;
        const degNames = modalCfg.degreeNames;
        const charIntervals = modalCfg.characteristicIntervals;
        const steps = [];

        const numCourses = inst.courses.length;
        const bassCourse = Math.min(3, numCourses - 1);

        if (exerciseId === 'linear') {
            // Subida e descida linear pelas cordas
            const degIndices = [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0];
            const preferProgression = [bassCourse, bassCourse, 2, 2, 1, 1, 1, 0, 0, 1, 1, 1, 2, 2, bassCourse];

            degIndices.forEach((dIdx, stepIdx) => {
                const isOctave = dIdx === 7;
                const interval = isOctave ? 12 : intervals[dIdx];
                const targetPc = (rootPc + interval) % 12;
                const degName = isOctave ? '8 (1)' : degNames[dIdx];
                const isChar = charIntervals.includes(interval % 12);
                const isRoot = (interval % 12) === 0;
                const prefC = preferProgression[stepIdx % preferProgression.length];

                const pos = findBestFretForPitch(inst, targetPc, prefC, 0, 12);
                const rh = pos.c === 0 ? 'i' : (pos.c >= bassCourse ? 'p' : 'i');

                steps.push({
                    c: pos.c,
                    f: pos.f,
                    d: 0.28,
                    rh,
                    lh: pos.f === 0 ? '0' : String(pos.f),
                    degree: degName,
                    noteName: NOTE_NAMES[targetPc],
                    isCharacteristic: isChar,
                    isRoot,
                    ann: isChar ? `★ ${degName} [Nota Característica]` : (isRoot ? 'Tônica' : `${degName}º Grau`)
                });
            });
        } else if (exerciseId === 'characteristic') {
            // Frase com foco e repetição na nota característica
            const charInt = charIntervals[0] !== undefined ? charIntervals[0] : 6;
            const thirdInt = intervals[2]; // 3ª
            const fifthInt = intervals[4]; // 5ª

            const phraseIntervals = [
                { int: 0, d: 0.32, ann: 'Tônica de partida' },
                { int: thirdInt, d: 0.28, ann: 'Terça do modo' },
                { int: fifthInt, d: 0.28, ann: 'Quinta Justa' },
                { int: charInt, d: 0.48, ann: `★ ${modalCfg.charDegreeLabel} [Cor Sonora Exclusiva]` },
                { int: fifthInt, d: 0.26, ann: 'Retorno à 5ª' },
                { int: thirdInt, d: 0.26, ann: 'Retorno à 3ª' },
                { int: charInt, d: 0.42, ann: `★ ${modalCfg.charDegreeLabel} [Reafirmação]` },
                { int: 12, d: 0.38, ann: 'Resolução na Tônica Aguda' },
                { int: fifthInt, d: 0.28, ann: 'Queda em 5ª' },
                { int: 0, d: 0.45, ann: 'Repouso na Fundamental' }
            ];

            phraseIntervals.forEach((item, idx) => {
                const targetPc = (rootPc + item.int) % 12;
                const isChar = charIntervals.includes(item.int % 12);
                const isRoot = (item.int % 12) === 0;
                const prefC = (item.int === 12 || isChar) ? 0 : (isRoot && idx > 0 ? bassCourse : 1);

                const pos = findBestFretForPitch(inst, targetPc, prefC, 0, 12);
                const rh = pos.c === 0 ? 'i' : (pos.c >= bassCourse ? 'p' : 'i');
                const degIdx = intervals.indexOf(item.int % 12);
                const degName = item.int === 12 ? '8' : (degIdx >= 0 ? degNames[degIdx] : '•');

                steps.push({
                    c: pos.c,
                    f: pos.f,
                    d: item.d,
                    rh,
                    lh: pos.f === 0 ? '0' : String(pos.f),
                    degree: degName,
                    noteName: NOTE_NAMES[targetPc],
                    isCharacteristic: isChar,
                    isRoot,
                    ann: item.ann
                });
            });
        } else if (exerciseId === 'arpeggio') {
            // Arpejo da Tríade Geradora + Nota Modal
            const thirdInt = intervals[2];
            const fifthInt = intervals[4];
            const charInt = charIntervals[0] !== undefined ? charIntervals[0] : 6;

            const arpPattern = [
                { int: 0, d: 0.30, ann: 'Tônica Fundamental' },
                { int: thirdInt, d: 0.28, ann: 'Terça Maior/Menor' },
                { int: fifthInt, d: 0.28, ann: 'Quinta Justa' },
                { int: charInt, d: 0.40, ann: `★ ${modalCfg.charDegreeLabel}` },
                { int: 12, d: 0.35, ann: 'Oitava Superior' },
                { int: charInt, d: 0.35, ann: `★ ${modalCfg.charDegreeLabel}` },
                { int: fifthInt, d: 0.28, ann: 'Quinta Justa' },
                { int: thirdInt, d: 0.28, ann: 'Terça' },
                { int: 0, d: 0.48, ann: 'Resolução Fundamental' }
            ];

            arpPattern.forEach((item) => {
                const targetPc = (rootPc + item.int) % 12;
                const isChar = charIntervals.includes(item.int % 12);
                const isRoot = (item.int % 12) === 0;
                const prefC = item.int === 12 ? 0 : (isRoot ? bassCourse : 1);

                const pos = findBestFretForPitch(inst, targetPc, prefC, 0, 12);
                const rh = pos.c === 0 ? 'i' : (pos.c >= bassCourse ? 'p' : 'i');
                const degIdx = intervals.indexOf(item.int % 12);
                const degName = item.int === 12 ? '8' : (degIdx >= 0 ? degNames[degIdx] : '•');

                steps.push({
                    c: pos.c,
                    f: pos.f,
                    d: item.d,
                    rh,
                    lh: pos.f === 0 ? '0' : String(pos.f),
                    degree: degName,
                    noteName: NOTE_NAMES[targetPc],
                    isCharacteristic: isChar,
                    isRoot,
                    ann: item.ann
                });
            });
        } else if (exerciseId === 'duads') {
            // Duetos em Terças/Sextas Modais nos dois primeiros pares (Prima e Segundinha)
            const cUpper = 0;
            const cLower = Math.min(1, numCourses - 1);
            const duadProgression = [0, 1, 2, 3, 4, 3, 2, 0];

            duadProgression.forEach((dIdx) => {
                const intUpper = intervals[dIdx];
                const pcUpper = (rootPc + intUpper) % 12;
                const degUpper = degNames[dIdx];
                const isChar = charIntervals.includes(intUpper);

                const lowerDegIdx = (dIdx - 2 + intervals.length) % intervals.length;
                const intLower = intervals[lowerDegIdx];
                const pcLower = (rootPc + intLower) % 12;

                const fUpper = (pcUpper - inst.courses[cUpper].pitchClass + 12) % 12;
                const fLower = (pcLower - inst.courses[cLower].pitchClass + 12) % 12;

                steps.push({
                    c: cUpper,
                    f: fUpper,
                    notes: [
                        { c: cUpper, f: fUpper },
                        { c: cLower, f: fLower }
                    ],
                    d: 0.36,
                    rh: 'p+i',
                    lh: `${fUpper}-${fLower}`,
                    degree: degUpper,
                    noteName: `${NOTE_NAMES[pcUpper]}+${NOTE_NAMES[pcLower]}`,
                    isCharacteristic: isChar,
                    isRoot: intUpper === 0,
                    ann: `Dueto Modal Grau ${degUpper} (${NOTE_NAMES[pcUpper]}/${NOTE_NAMES[pcLower]})`
                });
            });
        } else if (exerciseId === 'folia') {
            // Fraseado Tradicional com Cadência de Folia/Baião
            const charInt = charIntervals[0] !== undefined ? charIntervals[0] : 6;
            const thirdInt = intervals[2];
            const fifthInt = intervals[4];
            const secondInt = intervals[1];
            const seventhInt = intervals[6];

            const foliaPattern = [
                { int: 0, d: 0.22, ann: 'Bordão de ataque' },
                { int: 0, d: 0.20, ann: 'Repique rítmico' },
                { int: thirdInt, d: 0.22, ann: 'Terça ascendente' },
                { int: fifthInt, d: 0.22, ann: 'Quinta aberta' },
                { int: charInt, d: 0.38, ann: `★ Síncope na ${modalCfg.charDegreeLabel}` },
                { int: fifthInt, d: 0.20, ann: 'Corte rápido' },
                { int: charInt, d: 0.35, ann: 'Rebatida da cor modal' },
                { int: seventhInt, d: 0.22, ann: 'Passagem melódica' },
                { int: 12, d: 0.36, ann: 'Pico lírico da folia' },
                { int: fifthInt, d: 0.24, ann: 'Cascata descendente' },
                { int: thirdInt, d: 0.24, ann: 'Terça cadencial' },
                { int: secondInt, d: 0.24, ann: 'Apojatura de 2ª' },
                { int: 0, d: 0.50, ann: 'Acorde / Repouso Caipira' }
            ];

            foliaPattern.forEach((item) => {
                const targetPc = (rootPc + item.int) % 12;
                const isChar = charIntervals.includes(item.int % 12);
                const isRoot = (item.int % 12) === 0;
                const prefC = item.int === 12 ? 0 : (isRoot ? bassCourse : 1);

                const pos = findBestFretForPitch(inst, targetPc, prefC, 0, 12);
                const rh = pos.c === 0 ? 'i' : (pos.c >= bassCourse ? 'p' : 'i');
                const degIdx = intervals.indexOf(item.int % 12);
                const degName = item.int === 12 ? '8' : (degIdx >= 0 ? degNames[degIdx] : '•');

                steps.push({
                    c: pos.c,
                    f: pos.f,
                    d: item.d,
                    rh,
                    lh: pos.f === 0 ? '0' : String(pos.f),
                    degree: degName,
                    noteName: NOTE_NAMES[targetPc],
                    isCharacteristic: isChar,
                    isRoot,
                    ann: item.ann
                });
            });
        }

        return steps;
    }

    function playModalEvent(step) {
        if (!step) return;
        if (Array.isArray(step.notes) && step.notes.length > 0) {
            step.notes.forEach((n, idx) => {
                playCourseAtFret(n.c, n.f, idx * 0.012);
                flashFretCell(n.c, n.f, idx * 0.012);
            });
        } else if (step.c !== undefined && step.f !== undefined) {
            playCourseAtFret(step.c, step.f, 0);
            flashFretCell(step.c, step.f, 0);
        }
    }

    function stopModalPlayback() {
        if (modalPlaybackTimer) {
            clearTimeout(modalPlaybackTimer);
            modalPlaybackTimer = null;
        }
        activeModalTimers.forEach((t) => clearTimeout(t));
        activeModalTimers = [];
        state.modalTrainer.isPlaying = false;
        updateModalUIState();
    }

    function scheduleNextModalStep() {
        if (!state.modalTrainer.isPlaying) return;

        const inst = INSTRUMENTS[state.instrumentId];
        const steps = computeModalExerciseSteps(state.modalTrainer.modeId, state.modalTrainer.rootPc, state.modalTrainer.activeExerciseId, inst);
        if (!steps || steps.length === 0) {
            stopModalPlayback();
            return;
        }

        const curIdx = state.modalTrainer.currentStepIdx;
        if (curIdx >= steps.length) {
            if (state.modalTrainer.isLooping) {
                state.modalTrainer.currentStepIdx = 0;
                scheduleNextModalStep();
            } else {
                stopModalPlayback();
                state.modalTrainer.currentStepIdx = 0;
                updateModalUIState();
                renderFretboardSVG();
            }
            return;
        }

        const step = steps[curIdx];
        playModalEvent(step);
        highlightModalStep(curIdx);
        renderFretboardSVG();

        const speed = Math.max(0.25, state.modalTrainer.playbackSpeed || 1.0);
        const stepDurationMs = Math.round(((step.d || 0.28) / speed) * 1000);

        state.modalTrainer.currentStepIdx = curIdx + 1;

        modalPlaybackTimer = setTimeout(() => {
            scheduleNextModalStep();
        }, stepDurationMs);
    }

    function playModalPlayback() {
        stopScalePlayback();
        stopProgressionPlayback();
        stopTunerTone();
        stopEarTrainerAudio();
        stopPonteioPlayback();
        stopTabEditorPlayback();

        const inst = INSTRUMENTS[state.instrumentId];
        const steps = computeModalExerciseSteps(state.modalTrainer.modeId, state.modalTrainer.rootPc, state.modalTrainer.activeExerciseId, inst);
        if (!steps || steps.length === 0) return;

        if (state.modalTrainer.isPlaying) {
            pauseModalPlayback();
            return;
        }

        state.modalTrainer.isPlaying = true;
        state.displayMode = 'MODAL';

        if (state.modalTrainer.currentStepIdx < 0 || state.modalTrainer.currentStepIdx >= steps.length) {
            state.modalTrainer.currentStepIdx = 0;
        }

        renderFretboardSVG();
        updateModalUIState();
        scheduleNextModalStep();
    }

    function pauseModalPlayback() {
        stopModalPlayback();
    }

    function stepModalExercise(delta) {
        stopModalPlayback();
        const inst = INSTRUMENTS[state.instrumentId];
        const steps = computeModalExerciseSteps(state.modalTrainer.modeId, state.modalTrainer.rootPc, state.modalTrainer.activeExerciseId, inst);
        if (!steps || steps.length === 0) return;

        let nextIdx = (state.modalTrainer.currentStepIdx < 0 ? 0 : state.modalTrainer.currentStepIdx) + delta;
        if (nextIdx < 0) nextIdx = steps.length - 1;
        if (nextIdx >= steps.length) nextIdx = 0;

        state.modalTrainer.currentStepIdx = nextIdx;
        state.displayMode = 'MODAL';

        const step = steps[nextIdx];
        playModalEvent(step);
        highlightModalStep(nextIdx);
        renderFretboardSVG();
        saveViolaState();
    }

    function jumpToModalStep(idx) {
        stopModalPlayback();
        const inst = INSTRUMENTS[state.instrumentId];
        const steps = computeModalExerciseSteps(state.modalTrainer.modeId, state.modalTrainer.rootPc, state.modalTrainer.activeExerciseId, inst);
        if (!steps || idx < 0 || idx >= steps.length) return;

        state.modalTrainer.currentStepIdx = idx;
        state.displayMode = 'MODAL';

        const step = steps[idx];
        playModalEvent(step);
        highlightModalStep(idx);
        renderFretboardSVG();
        saveViolaState();
    }

    function highlightModalStep(stepIdx) {
        const container = document.getElementById('viola-modal-steps-ribbon');
        if (!container) return;

        container.querySelectorAll('[data-modal-step]').forEach((col) => {
            const idx = parseInt(col.getAttribute('data-modal-step'), 10);
            if (idx === stepIdx) {
                col.classList.add('bg-rose-500/25', 'border-rose-400', 'ring-2', 'ring-rose-400/50', 'shadow-[0_0_15px_rgba(244,63,94,0.45)]');
                col.classList.remove('border-slate-800');
                try {
                    col.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                } catch (_) {}
            } else {
                col.classList.remove('bg-rose-500/25', 'border-rose-400', 'ring-2', 'ring-rose-400/50', 'shadow-[0_0_15px_rgba(244,63,94,0.45)]');
                col.classList.add('border-slate-800');
            }
        });

        const activeCard = document.getElementById('viola-modal-active-step-info');
        if (activeCard) {
            const inst = INSTRUMENTS[state.instrumentId];
            const steps = computeModalExerciseSteps(state.modalTrainer.modeId, state.modalTrainer.rootPc, state.modalTrainer.activeExerciseId, inst);
            const curStep = steps && steps[stepIdx] ? steps[stepIdx] : null;
            if (curStep) {
                activeCard.innerHTML = `
                    <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded ${curStep.isCharacteristic ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40 font-bold' : (curStep.isRoot ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold' : 'bg-slate-800 text-slate-300')}">
                                Passo ${stepIdx + 1}/${steps.length} • Grau ${curStep.degree}
                            </span>
                            <span class="font-bold text-slate-100">
                                Nota: <strong class="${curStep.isCharacteristic ? 'text-rose-400' : (curStep.isRoot ? 'text-emerald-400' : 'text-cyan-300')}">${curStep.noteName}</strong>
                            </span>
                            <span class="text-slate-400 hidden sm:inline">— ${curStep.ann}</span>
                        </div>
                        <div class="flex items-center gap-3 text-slate-400 text-[11px]">
                            <span>Mão Dir: <strong class="text-amber-400">${curStep.rh || 'p'}</strong></span>
                            <span>Mão Esq: <strong class="text-cyan-400">${curStep.lh || '—'}</strong></span>
                        </div>
                    </div>
                `;
            }
        }
    }

    function toggleModalLoop() {
        state.modalTrainer.isLooping = !state.modalTrainer.isLooping;
        saveViolaState();
        updateModalUIState();
    }

    function setModalSpeed(speed) {
        state.modalTrainer.playbackSpeed = speed;
        saveViolaState();
        updateModalUIState();
    }

    function updateModalUIState() {
        const playBtn = document.getElementById('btn-viola-modal-play');
        if (playBtn) {
            playBtn.className = state.modalTrainer.isPlaying
                ? 'min-h-[40px] px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg'
                : 'min-h-[40px] px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg';
            playBtn.innerHTML = state.modalTrainer.isPlaying
                ? '<i data-lucide="pause" class="w-4 h-4"></i><span>Pausar</span>'
                : '<i data-lucide="play" class="w-4 h-4"></i><span>Tocar Exercício</span>';
            if (global.VaultCore && global.VaultCore.refreshIcons) global.VaultCore.refreshIcons(playBtn);
        }

        const loopBtn = document.getElementById('btn-viola-modal-loop');
        if (loopBtn) {
            loopBtn.className = state.modalTrainer.isLooping
                ? 'min-h-[40px] px-3 py-1.5 rounded-lg bg-rose-600/25 border border-rose-400 text-rose-200 text-xs font-mono font-semibold flex items-center gap-1 transition'
                : 'min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 text-xs font-mono flex items-center gap-1 transition';
        }

        [0.5, 0.75, 1.0, 1.2].forEach((spd) => {
            const btn = document.getElementById(`btn-viola-modal-speed-${Math.round(spd * 100)}`);
            if (btn) {
                const isActive = Math.abs((state.modalTrainer.playbackSpeed || 1.0) - spd) < 0.05;
                btn.className = isActive
                    ? 'px-2 py-1 text-[11px] font-mono rounded bg-rose-600 text-white font-bold shadow'
                    : 'px-2 py-1 text-[11px] font-mono rounded bg-slate-800 text-slate-400 hover:text-slate-200';
            }
        });
    }

    function playModalScalePreview() {
        stopScalePlayback();
        stopModalPlayback();
        stopProgressionPlayback();
        stopPonteioPlayback();
        stopTabEditorPlayback();

        const modalCfg = MODAL_SCALES[state.modalTrainer.modeId] || MODAL_SCALES.lydian;
        const rootPc = state.modalTrainer.rootPc;
        const inst = INSTRUMENTS[state.instrumentId];

        const notes = modalCfg.intervals.concat([12]);
        notes.forEach((interval, idx) => {
            const pc = (rootPc + interval) % 12;
            const prefC = interval === 12 ? 0 : (idx < 3 ? Math.min(3, inst.courses.length - 1) : 1);
            const pos = findBestFretForPitch(inst, pc, prefC, 0, 12);

            const timer = setTimeout(() => {
                playCourseAtFret(pos.c, pos.f, 0);
                flashFretCell(pos.c, pos.f, 0);
            }, idx * 240);
            activeModalTimers.push(timer);
        });
    }

    function playGeneratingChord(chordName) {
        stopModalPlayback();
        const inst = INSTRUMENTS[state.instrumentId];
        const rootLetter = chordName.replace(/m|7/g, '');
        const rootPc = NOTE_NAMES.indexOf(rootLetter);
        if (rootPc < 0) return;

        const isMinor = chordName.includes('m') && !chordName.includes('maj');
        const pitchClasses = isMinor ? [rootPc, (rootPc + 3) % 12, (rootPc + 7) % 12] : [rootPc, (rootPc + 4) % 12, (rootPc + 7) % 12];
        const shape = solveAlgorithmicVoicing(inst, rootPc, pitchClasses, 0);

        shape.forEach((fret, cIdx) => {
            if (fret >= 0) {
                playCourseAtFret(cIdx, fret, cIdx * 0.022);
                flashFretCell(cIdx, fret, cIdx * 0.022);
            }
        });
    }

    function renderModalScalesSection() {
        const container = document.getElementById('viola-modal-trainer-container');
        if (!container) return;

        const activeMode = MODAL_SCALES[state.modalTrainer.modeId] || MODAL_SCALES.lydian;
        const inst = INSTRUMENTS[state.instrumentId];
        const rootPc = state.modalTrainer.rootPc;
        const rootName = NOTE_NAMES[rootPc];
        const exerciseSteps = computeModalExerciseSteps(state.modalTrainer.modeId, rootPc, state.modalTrainer.activeExerciseId, inst);

        // Calcula notas do modo na tônica ativa
        const modeNotes = activeMode.intervals.map((semi, idx) => {
            const pc = (rootPc + semi) % 12;
            const deg = activeMode.degreeNames[idx];
            const isChar = activeMode.characteristicIntervals.includes(semi);
            const isRoot = semi === 0;
            return {
                deg,
                name: NOTE_NAMES[pc],
                namePT: NOTE_NAMES_PT[pc],
                isChar,
                isRoot
            };
        });

        container.innerHTML = `
            <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3.5 sm:p-5 space-y-4 shadow-xl">
                <!-- Cabeçalho e Apresentação -->
                <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">Fase 8 Concluída</span>
                            <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Modos Litúrgicos &amp; Folclóricos</span>
                            <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Treinador Guiado de Digitação &amp; Braço SVG</span>
                        </div>
                        <h3 class="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wider font-mono mt-1 flex items-center gap-2">
                            <i data-lucide="sparkles" class="w-5 h-5 text-rose-400"></i>
                            Treinador de Escalas Modais Caipiras (Modo Lídio, Mixolídio, Dórico &amp; Nordestino)
                        </h3>
                        <p class="text-xs text-slate-400 mt-0.5">Explore a riqueza modal do sertão brasileiro: mapeamento sonoro nas 14 casas com diferenciação cromática de notas características, tríades geradoras, exercícios guiados e suporte nativo ao modo Canhoto/Destro</p>
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                        <button type="button" id="btn-viola-modal-preview-scale" class="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-rose-600/15 hover:bg-rose-600/25 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold flex items-center gap-1.5 transition">
                            <i data-lucide="music-2" class="w-3.5 h-3.5"></i>
                            <span>Ouvir Escala Modal</span>
                        </button>
                        <button type="button" id="btn-viola-modal-to-fretboard" class="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-cyan-600/15 hover:bg-cyan-600/25 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold flex items-center gap-1.5 transition">
                            <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                            <span>Ver no Braço SVG</span>
                        </button>
                    </div>
                </div>

                <!-- Galeria dos 6 Modos Caipiras -->
                <div class="space-y-1.5">
                    <div class="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span class="uppercase tracking-wider font-bold text-[11px] text-slate-300">Escolha o Modo do Sertão:</span>
                        <span class="text-slate-500">Clique para selecionar e atualizar teoria &amp; shapes</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2">
                        ${Object.values(MODAL_SCALES).map((m) => {
                            const isSelected = m.id === state.modalTrainer.modeId;
                            return `
                                <div data-select-modal="${m.id}" class="rounded-xl p-3 flex flex-col justify-between transition cursor-pointer border ${isSelected ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500/50 shadow-md' : 'border-slate-800 bg-[#090d16] hover:border-slate-700'}">
                                    <div class="space-y-1">
                                        <div class="flex items-center justify-between">
                                            <span class="text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold tracking-wider ${m.badgeColor}">
                                                ${m.badge}
                                            </span>
                                            <span class="text-[10px] font-mono font-bold ${isSelected ? 'text-rose-400' : 'text-slate-500'}">
                                                ${m.characteristicDegrees.join(' & ')}
                                            </span>
                                        </div>
                                        <h4 class="text-xs font-bold font-mono text-slate-100 truncate mt-1">${m.name}</h4>
                                        <p class="text-[10px] text-slate-400 leading-snug line-clamp-2">${m.subtitle}</p>
                                    </div>
                                    <div class="pt-2 mt-2 border-t border-slate-800/80">
                                        <button type="button" data-modal-btn="${m.id}" class="w-full py-1 rounded-md text-[11px] font-mono font-bold transition flex items-center justify-center gap-1 ${isSelected ? 'bg-rose-600 text-white shadow' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'}">
                                            <i data-lucide="${isSelected ? 'check' : 'play-circle'}" class="w-3 h-3"></i>
                                            <span>${isSelected ? 'Ativo' : 'Praticar'}</span>
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Barra de Configuração: Tônica & Filtro de Região do Braço -->
                <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
                    <div class="flex flex-wrap items-center gap-3">
                        <div>
                            <label class="block text-[10px] font-mono uppercase text-slate-400 mb-0.5">Tônica Fundamental</label>
                            <select id="viola-modal-root-select" class="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#0f172a] border border-slate-700 text-emerald-300 font-mono text-xs font-bold focus:border-rose-400 outline-none cursor-pointer">
                                ${MODAL_ROOTS.map((r) => `
                                    <option value="${r.pc}" ${r.pc === rootPc ? 'selected' : ''}>
                                        ${r.label}
                                    </option>
                                `).join('')}
                            </select>
                        </div>

                        <div>
                            <label class="block text-[10px] font-mono uppercase text-slate-400 mb-0.5">Filtro de Região / Shapes do Braço</label>
                            <select id="viola-modal-region-filter" class="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#0f172a] border border-slate-700 text-slate-200 font-mono text-xs focus:border-rose-400 outline-none cursor-pointer">
                                <option value="FULL_NECK" ${state.modalTrainer.regionFilter === 'FULL_NECK' ? 'selected' : ''}>Braço Completo (Casas 0 a 14)</option>
                                <option value="SHAPE_OPEN" ${state.modalTrainer.regionFilter === 'SHAPE_OPEN' ? 'selected' : ''}>Posição Aberta (Casas 0 a 4)</option>
                                <option value="SHAPE_MID" ${state.modalTrainer.regionFilter === 'SHAPE_MID' ? 'selected' : ''}>Meio do Braço (Casas 4 a 9)</option>
                                <option value="SHAPE_HIGH" ${state.modalTrainer.regionFilter === 'SHAPE_HIGH' ? 'selected' : ''}>Ponteios Agudos (Casas 9 a 14)</option>
                                <option value="CHARACTERISTIC_ONLY" ${state.modalTrainer.regionFilter === 'CHARACTERISTIC_ONLY' ? 'selected' : ''}>Apenas Notas Características &amp; Tríades</option>
                            </select>
                        </div>
                    </div>

                    <!-- Ficha Resumo do Modo Ativo -->
                    <div class="flex items-center gap-2">
                        <div class="px-3 py-1 rounded-lg bg-[#0f172a] border border-slate-800 text-xs font-mono">
                            <span class="text-slate-500">Nota Característica:</span>
                            <strong class="text-rose-400 ml-1">${activeMode.charDegreeLabel}</strong>
                        </div>
                        <div class="px-3 py-1 rounded-lg bg-[#0f172a] border border-slate-800 text-xs font-mono">
                            <span class="text-slate-500">Tom:</span>
                            <strong class="text-emerald-300 ml-1">${rootName} ${activeMode.name}</strong>
                        </div>
                    </div>
                </div>

                <!-- Painel Teórico-Clínico & Musicologia do Sertão -->
                <div class="bg-[#090d16] border border-slate-800 rounded-xl p-4 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <div class="flex items-center gap-2">
                                <h4 class="text-base font-bold text-slate-100 font-mono">${rootName} ${activeMode.name}</h4>
                                <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${activeMode.badgeColor}">
                                    ${activeMode.badge}
                                </span>
                            </div>
                            <p class="text-xs text-rose-300/90 font-medium mt-0.5">${activeMode.subtitle}</p>
                        </div>
                        <div class="text-left sm:text-right text-xs font-mono text-slate-400">
                            <span class="text-slate-500 block text-[10px] uppercase">Tradição Folclórica</span>
                            <span class="text-slate-300">${activeMode.folkContext}</span>
                        </div>
                    </div>

                    <p class="text-xs text-slate-300 leading-relaxed">${activeMode.description}</p>

                    <!-- Notas Formadoras & Graus -->
                    <div class="space-y-1.5 pt-2 border-t border-slate-800/80">
                        <span class="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">Notas Formadoras &amp; Graus no Tom de ${rootName}:</span>
                        <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                            ${modeNotes.map((nt) => `
                                <div class="px-2.5 py-1.5 rounded-lg bg-[#0f172a] border ${nt.isChar ? 'border-rose-500/50 bg-rose-500/10' : (nt.isRoot ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-slate-800')} flex flex-col items-center justify-center font-mono">
                                    <div class="text-[10px] ${nt.isChar ? 'text-rose-400 font-bold' : (nt.isRoot ? 'text-emerald-400 font-bold' : 'text-slate-500')}">
                                        Grau ${nt.deg} ${nt.isChar ? '★' : ''}
                                    </div>
                                    <div class="text-sm font-bold text-slate-100">${nt.name}</div>
                                    <div class="text-[9px] text-slate-400">${nt.namePT}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Acordes Geradores e Característicos -->
                    <div class="space-y-1.5 pt-2 border-t border-slate-800/80">
                        <div class="flex items-center justify-between text-[11px] font-mono">
                            <span class="uppercase tracking-wider text-slate-400 font-semibold">Harmonia Geradora (Clique para ouvir o arpejo):</span>
                            <span class="text-slate-500">Ressonância no braço</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            ${activeMode.generatingChords.map((ch) => `
                                <button type="button" data-play-chord="${ch.name}" class="px-3 py-2 rounded-lg bg-[#0f172a] border border-slate-800 hover:border-amber-500/50 text-left transition group flex items-center justify-between">
                                    <div>
                                        <div class="flex items-center gap-1.5">
                                            <span class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-amber-300 font-bold">${ch.roman}</span>
                                            <strong class="text-sm font-bold font-mono text-slate-100 group-hover:text-amber-300 transition">${ch.name}</strong>
                                        </div>
                                        <span class="text-[10px] text-slate-400 block mt-0.5">${ch.namePT}</span>
                                    </div>
                                    <i data-lucide="volume-2" class="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition shrink-0"></i>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Dica do Mestre Violeiro -->
                    <div class="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs flex items-start gap-2.5">
                        <i data-lucide="sparkles" class="w-4 h-4 text-rose-400 shrink-0 mt-0.5"></i>
                        <div>
                            <span class="font-bold text-rose-300 font-mono uppercase tracking-wider text-[11px]">Dica do Mestre Violeiro:</span>
                            <p class="text-slate-300 mt-0.5">${activeMode.techniqueTip}</p>
                        </div>
                    </div>
                </div>

                <!-- Módulo de Exercícios Guiados de Digitação & Fraseados -->
                <div class="space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <h4 class="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                                <i data-lucide="list-music" class="w-4 h-4 text-rose-400"></i>
                                Exercícios Guiados de Digitação &amp; Fraseados Caipiras
                            </h4>
                            <p class="text-[11px] text-slate-400">Pratique com reprodução sincronizada ao braço SVG em andamentos escalonados</p>
                        </div>

                        <!-- Abas dos Exercícios -->
                        <div class="flex flex-wrap items-center gap-1.5">
                            ${Object.values(MODAL_EXERCISES_INFO).map((ex) => {
                                const isSelected = ex.id === state.modalTrainer.activeExerciseId;
                                return `
                                    <button type="button" data-modal-ex-tab="${ex.id}" class="px-2.5 py-1 rounded-md text-xs font-mono font-medium border transition ${
                                        isSelected
                                            ? 'bg-rose-600 text-white border-rose-500 shadow'
                                            : 'bg-[#090d16] border-slate-800 text-slate-400 hover:text-slate-200'
                                    }">
                                        ${ex.title}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Barra de Transporte do Exercício -->
                    <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
                        <div class="flex flex-wrap items-center gap-2">
                            <button type="button" id="btn-viola-modal-play" class="min-h-[40px] px-4 py-1.5 rounded-lg ${state.modalTrainer.isPlaying ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' : 'bg-rose-600 hover:bg-rose-500 text-white'} font-mono text-xs font-bold flex items-center gap-1.5 transition shadow-lg">
                                <i data-lucide="${state.modalTrainer.isPlaying ? 'pause' : 'play'}" class="w-4 h-4"></i>
                                <span>${state.modalTrainer.isPlaying ? 'Pausar' : 'Tocar Exercício'}</span>
                            </button>

                            <button type="button" id="btn-viola-modal-stop" class="min-h-[40px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-rose-300 font-mono text-xs font-medium flex items-center gap-1.5 transition">
                                <i data-lucide="square" class="w-3.5 h-3.5"></i>
                                <span>Resetar</span>
                            </button>

                            <div class="inline-flex rounded-lg bg-slate-800/80 border border-slate-700 p-0.5" role="group">
                                <button type="button" id="btn-viola-modal-step-prev" title="Nota Anterior" class="min-h-[36px] px-2.5 py-1 text-slate-300 hover:text-rose-300 hover:bg-slate-700/60 rounded-md font-mono text-xs flex items-center gap-1 transition">
                                    <i data-lucide="chevron-left" class="w-4 h-4"></i>
                                    <span>Anterior</span>
                                </button>
                                <button type="button" id="btn-viola-modal-step-next" title="Próxima Nota" class="min-h-[36px] px-2.5 py-1 text-slate-300 hover:text-rose-300 hover:bg-slate-700/60 rounded-md font-mono text-xs flex items-center gap-1 transition">
                                    <span>Próxima</span>
                                    <i data-lucide="chevron-right" class="w-4 h-4"></i>
                                </button>
                            </div>

                            <button type="button" id="btn-viola-modal-loop" class="min-h-[40px] px-3 py-1.5 rounded-lg ${state.modalTrainer.isLooping ? 'bg-rose-600/25 border border-rose-400 text-rose-200' : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400'} font-mono text-xs font-bold flex items-center gap-1.5 transition">
                                <i data-lucide="repeat" class="w-3.5 h-3.5"></i>
                                <span>Loop ${state.modalTrainer.isLooping ? 'Ligado' : 'Desligado'}</span>
                            </button>
                        </div>

                        <!-- Velocidades Didáticas -->
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-mono text-slate-400">Andamento:</span>
                            <div class="inline-flex rounded-lg bg-slate-800/80 border border-slate-700 p-0.5" role="group">
                                <button type="button" id="btn-viola-modal-speed-50" class="px-2 py-1 rounded text-[11px] font-mono transition ${Math.abs(state.modalTrainer.playbackSpeed - 0.5) < 0.05 ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}">50% Lento</button>
                                <button type="button" id="btn-viola-modal-speed-75" class="px-2 py-1 rounded text-[11px] font-mono transition ${Math.abs(state.modalTrainer.playbackSpeed - 0.75) < 0.05 ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}">75%</button>
                                <button type="button" id="btn-viola-modal-speed-100" class="px-2 py-1 rounded text-[11px] font-mono transition ${Math.abs(state.modalTrainer.playbackSpeed - 1.0) < 0.05 ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}">100% Real</button>
                                <button type="button" id="btn-viola-modal-speed-120" class="px-2 py-1 rounded text-[11px] font-mono transition ${Math.abs(state.modalTrainer.playbackSpeed - 1.2) < 0.05 ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}">120% Mestre</button>
                            </div>
                        </div>
                    </div>

                    <!-- Ficha da Nota / Passo em Foco -->
                    <div id="viola-modal-active-step-info" class="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs"></div>

                    <!-- Régua Visual Horizontal com Todos os Passos do Exercício -->
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between text-xs font-mono text-slate-400">
                            <span class="flex items-center gap-1.5">
                                <i data-lucide="music" class="w-3.5 h-3.5 text-rose-400"></i>
                                <span>Sequência das Notas (Clique em qualquer passo para soar a nota e iluminar no braço):</span>
                            </span>
                            <span class="text-[11px] text-slate-500">Destaque rosa = Nota Característica do Modo</span>
                        </div>

                        <div class="bg-[#070b12] border border-slate-800 rounded-xl p-3 flex overflow-x-auto shadow-inner custom-scrollbar" id="viola-modal-steps-ribbon" style="scrollbar-width: thin; scrollbar-color: #f43f5e #090d16;">
                            <div class="flex items-stretch gap-1.5 shrink-0">
                                ${exerciseSteps.map((st, idx) => {
                                    const isCurrent = state.modalTrainer.currentStepIdx === idx;
                                    const isChar = st.isCharacteristic;
                                    const isRoot = st.isRoot;

                                    return `
                                        <div data-modal-step="${idx}" class="flex flex-col items-center justify-between min-w-[54px] sm:min-w-[62px] p-2 rounded-xl border ${
                                            isCurrent
                                                ? 'bg-rose-500/25 border-rose-400 ring-2 ring-rose-400/50 shadow-[0_0_15px_rgba(244,63,94,0.45)]'
                                                : (isChar
                                                    ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400'
                                                    : (isRoot
                                                        ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400'
                                                        : 'border-slate-800 bg-[#090d16] hover:border-slate-700'))
                                        } cursor-pointer transition select-none group text-center" title="${st.ann}">
                                            <div class="text-[10px] font-mono font-bold ${isChar ? 'text-rose-400' : (isRoot ? 'text-emerald-400' : 'text-slate-500')}">
                                                ${st.degree} ${isChar ? '★' : ''}
                                            </div>

                                            <div class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm font-mono my-1 border ${
                                                isChar
                                                    ? 'bg-rose-600/30 text-rose-200 border-rose-500/60 shadow-sm'
                                                    : (isRoot
                                                        ? 'bg-emerald-600/30 text-emerald-200 border-emerald-500/60 shadow-sm'
                                                        : 'bg-slate-800 text-slate-200 border-slate-700')
                                            }">
                                                ${st.noteName}
                                            </div>

                                            <div class="text-[10px] font-mono text-slate-400 space-y-0.5">
                                                <div class="font-bold ${isChar ? 'text-rose-300' : 'text-cyan-300'}">
                                                    ${st.notes ? `P.1+2` : `${st.c + 1}ºP c.${st.f}`}
                                                </div>
                                                <div class="text-[9px] text-slate-500">
                                                    M.Dir: ${st.rh}
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (global.VaultCore && global.VaultCore.refreshIcons) global.VaultCore.refreshIcons(container);

        // Bind events dos seletores de modo
        container.querySelectorAll('[data-select-modal]').forEach((card) => {
            card.addEventListener('click', () => {
                const modeId = card.getAttribute('data-select-modal');
                if (modeId && MODAL_SCALES[modeId]) {
                    stopModalPlayback();
                    state.modalTrainer.modeId = modeId;
                    state.modalTrainer.currentStepIdx = 0;
                    state.displayMode = 'MODAL';
                    saveViolaState();
                    renderModalScalesSection();
                    renderFretboardSVG();
                }
            });
        });

        // Tônica
        const rootSel = document.getElementById('viola-modal-root-select');
        if (rootSel) {
            rootSel.addEventListener('change', (e) => {
                stopModalPlayback();
                state.modalTrainer.rootPc = parseInt(e.target.value, 10);
                state.modalTrainer.currentStepIdx = 0;
                saveViolaState();
                renderModalScalesSection();
                renderFretboardSVG();
            });
        }

        // Filtro de Região do Braço
        const regionSel = document.getElementById('viola-modal-region-filter');
        if (regionSel) {
            regionSel.addEventListener('change', (e) => {
                state.modalTrainer.regionFilter = e.target.value;
                saveViolaState();
                renderFretboardSVG();
            });
        }

        // Abas dos Exercícios
        container.querySelectorAll('[data-modal-ex-tab]').forEach((btn) => {
            btn.addEventListener('click', () => {
                stopModalPlayback();
                const exId = btn.getAttribute('data-modal-ex-tab');
                state.modalTrainer.activeExerciseId = exId;
                state.modalTrainer.currentStepIdx = 0;
                saveViolaState();
                renderModalScalesSection();
                renderFretboardSVG();
            });
        });

        // Botão Ouvir Escala Modal
        const previewBtn = document.getElementById('btn-viola-modal-preview-scale');
        if (previewBtn) previewBtn.addEventListener('click', playModalScalePreview);

        // Botão Ver no Braço SVG
        const toFretBtn = document.getElementById('btn-viola-modal-to-fretboard');
        if (toFretBtn) {
            toFretBtn.addEventListener('click', () => {
                state.displayMode = 'MODAL';
                saveViolaState();
                renderFretboardSVG();
                syncControlValues();
                const wrap = document.getElementById('viola-fretboard-svg-wrap');
                if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        }

        // Player do Exercício
        const playBtn = document.getElementById('btn-viola-modal-play');
        if (playBtn) playBtn.addEventListener('click', playModalPlayback);

        const stopBtn = document.getElementById('btn-viola-modal-stop');
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                stopModalPlayback();
                state.modalTrainer.currentStepIdx = 0;
                highlightModalStep(0);
                renderFretboardSVG();
            });
        }

        const stepPrevBtn = document.getElementById('btn-viola-modal-step-prev');
        if (stepPrevBtn) stepPrevBtn.addEventListener('click', () => stepModalExercise(-1));

        const stepNextBtn = document.getElementById('btn-viola-modal-step-next');
        if (stepNextBtn) stepNextBtn.addEventListener('click', () => stepModalExercise(1));

        const loopBtn = document.getElementById('btn-viola-modal-loop');
        if (loopBtn) loopBtn.addEventListener('click', toggleModalLoop);

        [0.5, 0.75, 1.0, 1.2].forEach((spd) => {
            const btn = document.getElementById(`btn-viola-modal-speed-${Math.round(spd * 100)}`);
            if (btn) btn.addEventListener('click', () => setModalSpeed(spd));
        });

        // Clicabilidade nos passos da régua
        container.querySelectorAll('[data-modal-step]').forEach((col) => {
            col.addEventListener('click', () => {
                const idx = parseInt(col.getAttribute('data-modal-step'), 10);
                jumpToModalStep(idx);
            });
        });

        // Botões de arpejo de acordes geradores
        container.querySelectorAll('[data-play-chord]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const ch = btn.getAttribute('data-play-chord');
                if (ch) playGeneratingChord(ch);
            });
        });

        highlightModalStep(state.modalTrainer.currentStepIdx >= 0 ? state.modalTrainer.currentStepIdx : 0);
    }

    // =========================================================================
    // ANALISADOR DE TENSÃO MECÂNICA & AÇÃO DE CORDAS (FASE 9)
    // =========================================================================

    function getActiveTensionPreset() {
        return TENSION_PRESETS[state.tensionCalculator.presetId] || TENSION_PRESETS.viola_cebolao_e_media;
    }

    function calculateLinearMass(gaugeInches, type) {
        if (type === 'plain') {
            return LINEAR_MASS_TABLE.plain_steel.get(gaugeInches);
        } else if (type === 'wound') {
            return LINEAR_MASS_TABLE.wound_steel.get(gaugeInches);
        } else if (type === 'nylon_plain') {
            return LINEAR_MASS_TABLE.nylon_plain.get(gaugeInches);
        } else if (type === 'nylon_wound') {
            return LINEAR_MASS_TABLE.nylon_wound.get(gaugeInches);
        }
        return LINEAR_MASS_TABLE.plain_steel.get(gaugeInches);
    }

    function calculateStringTension(gaugeInches, type, baseMidi, scaleLengthMm, semitoneOffset = 0, materialKey = 'steel_bronze') {
        const adjustedMidi = baseMidi + semitoneOffset;
        const freqHz = midiToFreq(adjustedMidi);
        const scaleMeters = scaleLengthMm / 1000.0;
        let mu = calculateLinearMass(gaugeInches, type);

        // Fator de densidade do material
        const mat = STRING_MATERIALS[materialKey];
        if (mat && mat.factor) {
            mu = mu * mat.factor;
        }

        // Fórmula de Mersenne: T = 4 * mu * L^2 * f^2 (em Newtons)
        const tensionNewtons = 4 * mu * Math.pow(scaleMeters, 2) * Math.pow(freqHz, 2);
        const tensionKgf = tensionNewtons / 9.80665;
        const tensionLbs = tensionKgf * 2.20462;

        return {
            gaugeInches,
            gaugeMm: gaugeInches * 25.4,
            type,
            freqHz,
            midi: adjustedMidi,
            noteName: NOTE_NAMES[adjustedMidi % 12] + Math.floor(adjustedMidi / 12 - 1),
            muKgM: mu,
            tensionNewtons,
            tensionKgf,
            tensionLbs
        };
    }

    function getActiveTensionCourses() {
        const preset = getActiveTensionPreset();
        const scaleMm = state.tensionCalculator.scaleLengthMm || preset.defaultScaleMm || 580;
        const semitoneOffset = state.tensionCalculator.pitchOffsetSemitones || 0;
        const materialKey = state.tensionCalculator.stringMaterial || preset.material || 'steel_bronze';
        const custom = state.tensionCalculator.customGauges;

        return preset.courses.map((course, cIdx) => {
            const stringsCalc = course.strings.map((str, sIdx) => {
                let gauge = str.gauge;
                let type = str.type;
                if (Array.isArray(custom) && custom[cIdx] && custom[cIdx][sIdx] !== undefined) {
                    gauge = custom[cIdx][sIdx];
                }
                const calc = calculateStringTension(gauge, type, str.midi, scaleMm, semitoneOffset, materialKey);
                return Object.assign({}, str, calc);
            });

            const courseTensionNewtons = stringsCalc.reduce((acc, s) => acc + s.tensionNewtons, 0);
            const courseTensionKgf = courseTensionNewtons / 9.80665;
            const courseTensionLbs = courseTensionKgf * 2.20462;

            return {
                num: course.num,
                label: course.label,
                note: course.note,
                strings: stringsCalc,
                tensionNewtons: courseTensionNewtons,
                tensionKgf: courseTensionKgf,
                tensionLbs: courseTensionLbs
            };
        });
    }

    function computeTensionSummary() {
        const courses = getActiveTensionCourses();
        const totalNewtons = courses.reduce((acc, c) => acc + c.tensionNewtons, 0);
        const totalKgf = totalNewtons / 9.80665;
        const totalLbs = totalKgf * 2.20462;

        const preset = getActiveTensionPreset();
        const diagnostic = analyzeStructuralTension(totalKgf, preset.instrumentId, state.tensionCalculator.stringMaterial || preset.material);

        return {
            courses,
            totalNewtons,
            totalKgf,
            totalLbs,
            diagnostic
        };
    }

    function analyzeStructuralTension(totalKgf, instrumentId, material) {
        const isViola = instrumentId.startsWith('viola_');
        const isNylon = material === 'nylon_classical';

        let safeThreshold, warningThreshold;
        if (isViola) {
            safeThreshold = 66.0;
            warningThreshold = 78.0;
        } else if (isNylon) {
            safeThreshold = 44.0;
            warningThreshold = 52.0;
        } else {
            // Violão Aço Folk
            safeThreshold = 75.0;
            warningThreshold = 86.0;
        }

        let status, color, badge, icon, summary, actionAdvice;
        const percent = Math.min(130, Math.round((totalKgf / safeThreshold) * 100));

        // Esforço mecânico no cavalete e braço
        const totalNewtons = totalKgf * 9.80665;
        const bridgeTorqueNm = totalNewtons * 0.014; // Alavanca média do cavalete ~14mm
        const breakAngleDeg = 30; // Ângulo médio de quebra sobre o rastilho
        const bridgeDownwardForceKgf = totalKgf * Math.sin(breakAngleDeg * Math.PI / 180);

        if (totalKgf <= safeThreshold) {
            status = 'SAFE';
            color = 'emerald';
            badge = 'Tensão Segura & Ressonância Ideal';
            icon = 'shield-check';
            summary = 'Carga axial e momento fletor perfeitamente equilibrados para a integridade do instrumento. Tampo harmônico livre para oscilar com ressonância plena, ataque limpo e sustentação prolongada.';
            actionAdvice = 'Configuração perfeita para preservação lutherística. A cola do cavalete opera com margem ampla de segurança e o braço mantém a curvatura (relief) estável.';
        } else if (totalKgf <= warningThreshold) {
            status = 'WARNING';
            color = 'amber';
            badge = 'Atenção: Tensão Moderada / Elevada';
            icon = 'alert-triangle';
            summary = 'Tensão mecânica elevada sobre o tampo. Em instrumentos de fábrica modernos com tensor ajustável duplo, a estrutura suporta bem, mas requer acompanhamento periódico do abaulamento ("belly bulge").';
            actionAdvice = isViola
                ? 'Em violas artesanais sem tensor metálico ou tampos finos de pinho, considere afinar 1/2 tom abaixo (Eb) ou migrar para encordoamento de Tensão Leve (.009) para prevenir aumento progressivo da ação de cordas.'
                : 'Monitore a altura no 12º traste. Se as cordas subirem ao longo dos meses, alivie a afinação ou revise o tensor.';
        } else {
            status = 'DANGER';
            color = 'rose';
            badge = 'Sobretensão Crítica: Risco Estrutural';
            icon = 'alert-octagon';
            summary = 'ALERTA DE LUTHIER: Sobretensão severa! A carga contínua ultrapassa a margem elástica do tampo e da lâmina de cola do cavalete, com risco de empenamento de braço e afundamento do leque harmônico.';
            actionAdvice = isViola
                ? 'Abaixe imediatamente a afinação para Cebolão em Ré (D) ou instale encordoamento leve (.009). Evite manter a viola afinada em Mi com calibres pesados se o instrumento não possuir reforço estrutural reforçado.'
                : 'PERIGO: Se for violão clássico com estrutura para nylon, o uso de cordas de aço arranca o cavalete e rompe o tampo harmônico!';
        }

        return {
            status,
            color,
            badge,
            icon,
            percent,
            safeThreshold,
            warningThreshold,
            axialCompressionKgf: totalKgf,
            bridgeTorqueNm,
            bridgeDownwardForceKgf,
            summary,
            actionAdvice
        };
    }

    function analyzeStringAction(measure12Treble, measure12Bass, measureNutTreble, measureNutBass, targetProfileKey, instrumentId) {
        const isViola = instrumentId.startsWith('viola_');
        const isViolaoNylon = instrumentId === 'violao_padrao' && state.tensionCalculator.stringMaterial === 'nylon_classical';
        const key = isViola ? 'viola' : (isViolaoNylon ? 'violao_nylon' : 'violao_aco');
        const profile = ACTION_TARGET_PROFILES[targetProfileKey] || ACTION_TARGET_PROFILES.caipira_versatil;
        const target = profile[key];

        // Diferenças no 12º traste (altura da corda ao traste em mm)
        const delta12Treble = measure12Treble - target.fret12Treble;
        const delta12Bass = measure12Bass - target.fret12Bass;

        // Desbaste no rastilho pelo teorema geométrico do braço: delta_rastilho = 2 * delta_12
        const saddleSandTreble = delta12Treble * 2;
        const saddleSandBass = delta12Bass * 2;

        // Diferenças no 1º traste (Pestana / Nut)
        const deltaNutTreble = measureNutTreble - target.nutTreble;
        const deltaNutBass = measureNutBass - target.nutBass;

        // Diagnóstico 12º Traste
        let action12Status = 'IDEAL';
        let action12Color = 'emerald';
        let action12Label = 'Ação Calibrada no 12º Traste';
        if (delta12Treble > 0.4 || delta12Bass > 0.4) {
            action12Status = 'HIGH';
            action12Color = 'amber';
            action12Label = 'Ação Alta / Cordas Afastadas';
        } else if (delta12Treble < -0.3 || delta12Bass < -0.3) {
            action12Status = 'LOW';
            action12Color = 'rose';
            action12Label = 'Ação Baixa / Risco de Trastejamento';
        }

        // Diagnóstico Pestana
        let nutStatus = 'IDEAL';
        let nutColor = 'emerald';
        let nutLabel = 'Pestana Calibrada';
        if (deltaNutTreble > 0.12 || deltaNutBass > 0.12) {
            nutStatus = 'HIGH';
            nutColor = 'amber';
            nutLabel = 'Pestana Alta (Dificulta primeiros acordes)';
        } else if (deltaNutTreble < -0.08 || deltaNutBass < -0.08) {
            nutStatus = 'LOW';
            nutColor = 'rose';
            nutLabel = 'Pestana Baixa (Zumbido em corda solta)';
        }

        return {
            target,
            delta12Treble,
            delta12Bass,
            saddleSandTreble,
            saddleSandBass,
            deltaNutTreble,
            deltaNutBass,
            action12Status,
            action12Color,
            action12Label,
            nutStatus,
            nutColor,
            nutLabel
        };
    }

    function playCourseTensionAudio(courseIdx) {
        const courses = getActiveTensionCourses();
        const course = courses[courseIdx];
        if (!course) return;

        course.strings.forEach((str, sIdx) => {
            const delay = sIdx === 0 ? 0 : 0.024;
            const detune = sIdx === 0 ? 0 : 0.8;
            pluckMidiNote(str.midi, delay, 1.8, detune, 0.24);
        });
    }

    function arpeggiateTensionAllCourses() {
        const courses = getActiveTensionCourses();
        // Dedilhado arpejado das cordas graves para as agudas
        const ordered = courses.slice().reverse();
        ordered.forEach((course, idx) => {
            const startTime = idx * 0.075;
            course.strings.forEach((str, sIdx) => {
                const subDelay = startTime + (sIdx === 0 ? 0 : 0.018);
                pluckMidiNote(str.midi, subDelay, 1.8, 0, 0.22);
            });
        });

        // Rasqueado final aberto de ressonância após o arpejo
        const sweepTime = ordered.length * 0.075 + 0.35;
        courses.forEach((course, idx) => {
            const strumDelay = sweepTime + idx * 0.015;
            course.strings.forEach((str) => {
                pluckMidiNote(str.midi, strumDelay, 2.2, 0, 0.15);
            });
        });
    }

    function generateLutherieReport() {
        const preset = getActiveTensionPreset();
        const summary = computeTensionSummary();
        const actionAnalysis = analyzeStringAction(
            state.tensionCalculator.actionMeasure12thTreble,
            state.tensionCalculator.actionMeasure12thBass,
            state.tensionCalculator.actionMeasureNutTreble,
            state.tensionCalculator.actionMeasureNutBass,
            state.tensionCalculator.targetActionProfile,
            preset.instrumentId
        );
        const profile = ACTION_TARGET_PROFILES[state.tensionCalculator.targetActionProfile] || ACTION_TARGET_PROFILES.caipira_versatil;
        const hand = state.isLeftHanded ? 'Canhoto (Pestana à Direita / Mão Esquerda dedilhando)' : 'Destro (Pestana à Esquerda)';
        const dateStr = new Date().toLocaleDateString('pt-BR');

        let report = `========================================================================\n`;
        report += `RELATÓRIO DE LUTHERIA DIGITAL & TENSÃO MECÂNICA — NEXUS VAULT\n`;
        report += `Autor: Deo Magalhães — Neuropsicólogo, Especialista e Violeiro\n`;
        report += `Data da Análise: ${dateStr}\n`;
        report += `========================================================================\n\n`;

        report += `[1] DADOS DO INSTRUMENTO & AFINAÇÃO:\n`;
        report += `  - Encordoamento: ${preset.name}\n`;
        report += `  - Orientação: ${hand}\n`;
        report += `  - Comprimento de Escala Vibrante: ${state.tensionCalculator.scaleLengthMm} mm\n`;
        report += `  - Material das Cordas: ${STRING_MATERIALS[state.tensionCalculator.stringMaterial || preset.material].name}\n`;
        report += `  - Transposição / Offset: ${state.tensionCalculator.pitchOffsetSemitones === 0 ? 'Afinação Nominal (0 semitons)' : (state.tensionCalculator.pitchOffsetSemitones > 0 ? `+${state.tensionCalculator.pitchOffsetSemitones} semitons` : `${state.tensionCalculator.pitchOffsetSemitones} semitons`)}\n\n`;

        report += `[2] DIAGNÓSTICO ESTRUTURAL DE TENSÃO MECÂNICA:\n`;
        report += `  - Tensão Total Acumulada: ${summary.totalKgf.toFixed(2)} kgf (${summary.totalNewtons.toFixed(1)} N / ${summary.totalLbs.toFixed(1)} lbs)\n`;
        report += `  - Status Construtivo: ${summary.diagnostic.badge}\n`;
        report += `  - Limite Seguro de Projeto: ≤ ${summary.diagnostic.safeThreshold.toFixed(1)} kgf | Limite Crítico: ≥ ${summary.diagnostic.warningThreshold.toFixed(1)} kgf\n`;
        report += `  - Carga Axial de Compressão no Braço: ${summary.diagnostic.axialCompressionKgf.toFixed(2)} kgf\n`;
        report += `  - Momento Fletor / Torque no Cavalete: ${summary.diagnostic.bridgeTorqueNm.toFixed(2)} N·m\n`;
        report += `  - Pressão Descendente no Rastilho: ${summary.diagnostic.bridgeDownwardForceKgf.toFixed(2)} kgf\n`;
        report += `  - Avaliação Lutherística: ${summary.diagnostic.summary}\n`;
        report += `  - Parecer Técnico: ${summary.diagnostic.actionAdvice}\n\n`;

        report += `[3] TABELA DE TENSÃO INDIVIDUAL POR PAR / CORDA:\n`;
        summary.courses.forEach((c) => {
            report += `  * ${c.label} [${c.note}] — Tensão do Par: ${c.tensionKgf.toFixed(2)} kgf (${c.tensionNewtons.toFixed(1)} N)\n`;
            c.strings.forEach((s, sIdx) => {
                const strDesc = c.strings.length > 1 ? (sIdx === 0 ? 'Corda A' : 'Corda B') : 'Corda Única';
                report += `      - ${strDesc}: .0${Math.round(s.gaugeInches * 1000)}" (${s.gaugeMm.toFixed(3)} mm) | ${s.noteName} (${s.freqHz.toFixed(1)} Hz) | ${s.tensionKgf.toFixed(2)} kgf\n`;
            });
        });
        report += `\n`;

        report += `[4] SIMULADOR DE AÇÃO & REGULAGEM DE PESTANA E RASTILHO:\n`;
        report += `  - Perfil Alvo: ${profile.name} (${profile.description})\n`;
        report += `  - Medição 1º Traste (Pestana): Prima = ${state.tensionCalculator.actionMeasureNutTreble.toFixed(2)} mm (Alvo: ${actionAnalysis.target.nutTreble.toFixed(2)} mm) | Bordão = ${state.tensionCalculator.actionMeasureNutBass.toFixed(2)} mm (Alvo: ${actionAnalysis.target.nutBass.toFixed(2)} mm)\n`;
        report += `  - Medição 12º Traste: Prima = ${state.tensionCalculator.actionMeasure12thTreble.toFixed(2)} mm (Alvo: ${actionAnalysis.target.fret12Treble.toFixed(2)} mm) | Bordão = ${state.tensionCalculator.actionMeasure12thBass.toFixed(2)} mm (Alvo: ${actionAnalysis.target.fret12Bass.toFixed(2)} mm)\n`;
        report += `  - Diagnóstico no 12º Traste: ${actionAnalysis.action12Label}\n`;
        report += `  - Ajuste Recomendado no Rastilho (Cavalete):\n`;
        if (actionAnalysis.saddleSandTreble > 0.1 || actionAnalysis.saddleSandBass > 0.1) {
            report += `      -> LIXAR base inferior do rastilho em osso: ${actionAnalysis.saddleSandTreble > 0.1 ? actionAnalysis.saddleSandTreble.toFixed(2) + ' mm no lado da prima' : 'manter prima'} | ${actionAnalysis.saddleSandBass > 0.1 ? actionAnalysis.saddleSandBass.toFixed(2) + ' mm no lado do bordão' : 'manter bordão'}.\n`;
        } else if (actionAnalysis.saddleSandTreble < -0.1 || actionAnalysis.saddleSandBass < -0.1) {
            report += `      -> CALÇAR rastilho em ${Math.abs(actionAnalysis.saddleSandTreble).toFixed(2)} mm ou confeccionar novo rastilho em osso mais alto.\n`;
        } else {
            report += `      -> Rastilho na altura ideal calibrada.\n`;
        }
        report += `  - Ajuste Recomendado na Pestana (Nut):\n`;
        if (actionAnalysis.deltaNutTreble > 0.08 || actionAnalysis.deltaNutBass > 0.08) {
            report += `      -> Aprofundar ranhuras da pestana com lima calibrada em ${Math.max(0, actionAnalysis.deltaNutTreble).toFixed(2)} mm (prima) e ${Math.max(0, actionAnalysis.deltaNutBass).toFixed(2)} mm (bordão).\n`;
        } else if (actionAnalysis.deltaNutTreble < -0.05 || actionAnalysis.deltaNutBass < -0.05) {
            report += `      -> Cuidado: ranhura muito funda na pestana. Preencher com pó de osso ou trocar pestana.\n`;
        } else {
            report += `      -> Pestana calibrada perfeitamente.\n`;
        }
        report += `\n`;

        if (state.isLeftHanded) {
            report += `[5] OBSERVAÇÃO CRÍTICA PARA TOCADORES CANHOTOS:\n`;
            report += `  - No modo Canhoto, o rastilho de osso DEVE possuir inclinação de oitava invertida em relação a instrumentos destros.\n`;
            report += `  - O ponto de apoio da 5ª corda (Canotilho) deve ficar de 1.5 mm a 2.5 mm mais distante da pestana do que o apoio da 1ª corda (Prima).\n`;
            report += `  - Inverter as cordas num cavalete destro padrão sem refazer o rastilho compromete irremediavelmente a afinação oitavada das casas 7 a 12.\n\n`;
        }

        report += `========================================================================\n`;
        report += `Nexus Vault — Lutheria & Acústica Musical — Deo Magalhães\n`;
        report += `========================================================================\n`;

        return report;
    }

    function copyLutherieReport() {
        const text = generateLutherieReport();
        const btn = document.getElementById('btn-viola-copy-report');
        const done = () => {
            if (btn) {
                const prev = btn.innerHTML;
                btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-300"></i><span>Relatório Copiado!</span>`;
                btn.classList.add('bg-emerald-600/30', 'border-emerald-400');
                if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
                setTimeout(() => {
                    btn.innerHTML = prev;
                    btn.classList.remove('bg-emerald-600/30', 'border-emerald-400');
                    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
                }, 2200);
            }
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done).catch(() => {
                fallbackCopy(text);
                done();
            });
        } else {
            fallbackCopy(text);
            done();
        }
    }

    function renderTensionCalculatorSection() {
        const container = document.getElementById('viola-tension-calculator-container');
        if (!container) return;

        const preset = getActiveTensionPreset();
        const summary = computeTensionSummary();
        const currentScale = state.tensionCalculator.scaleLengthMm || preset.defaultScaleMm || 580;
        const currentMaterialKey = state.tensionCalculator.stringMaterial || preset.material || 'steel_bronze';
        const currentOffset = state.tensionCalculator.pitchOffsetSemitones || 0;
        const hasCustomGauges = Array.isArray(state.tensionCalculator.customGauges);

        const actionAnalysis = analyzeStringAction(
            state.tensionCalculator.actionMeasure12thTreble,
            state.tensionCalculator.actionMeasure12thBass,
            state.tensionCalculator.actionMeasureNutTreble,
            state.tensionCalculator.actionMeasureNutBass,
            state.tensionCalculator.targetActionProfile,
            preset.instrumentId
        );
        const activeProfile = ACTION_TARGET_PROFILES[state.tensionCalculator.targetActionProfile] || ACTION_TARGET_PROFILES.caipira_versatil;

        // Indicador percentual da barra de tensão
        const maxGaugeTension = summary.diagnostic.warningThreshold * 1.25;
        const gaugePercent = Math.min(100, Math.max(10, Math.round((summary.totalKgf / maxGaugeTension) * 100)));
        const safePercent = Math.round((summary.diagnostic.safeThreshold / maxGaugeTension) * 100);
        const warnPercent = Math.round((summary.diagnostic.warningThreshold / maxGaugeTension) * 100);

        container.innerHTML = `
            <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3.5 sm:p-5 space-y-4 shadow-xl">
                <!-- Cabeçalho e Apresentação -->
                <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Fase 9 Concluída</span>
                            <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Física Acústica de Cordas (Mersenne)</span>
                            <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">Diagnóstico de Tampo &amp; Cavalete</span>
                            <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">Simulador de Ação Nut &amp; Saddle</span>
                        </div>
                        <h3 class="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wider font-mono mt-1 flex items-center gap-2">
                            <i data-lucide="scale" class="w-5 h-5 text-emerald-400"></i>
                            Analisador de Tensão Mecânica &amp; Ação de Cordas (String Tension &amp; Action Calculator)
                        </h3>
                        <p class="text-xs text-slate-400 mt-0.5">Cálculo de esforço físico por corda e par em kgf e Newtons, avaliação de fadiga do tampo e empenamento de cavalete, simulador de desbaste de rastilho e pestana em osso com compensação especial para Canhotos e Destros</p>
                    </div>

                    <div class="flex flex-wrap items-center gap-2">
                        <button type="button" id="btn-viola-tension-arpeggiate" class="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-cyan-600/15 hover:bg-cyan-600/25 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 transition">
                            <i data-lucide="volume-2" class="w-3.5 h-3.5"></i>
                            <span>Arpejar Instrumento</span>
                        </button>
                        <button type="button" id="btn-viola-copy-report" class="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-semibold flex items-center gap-1.5 transition">
                            <i data-lucide="clipboard" class="w-3.5 h-3.5"></i>
                            <span>Copiar Ficha de Lutheria</span>
                        </button>
                    </div>
                </div>

                <!-- Galeria dos 12 Presets Canônicos de Encordoamento -->
                <div class="space-y-1.5">
                    <div class="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span class="uppercase tracking-wider font-bold text-[11px] text-slate-300">Presets Canônicos de Encordoamento (1 Clique):</span>
                        <span class="text-slate-500">Selecione para carregar bitolas consagradas de fábrica</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                        ${Object.values(TENSION_PRESETS).map((p) => {
                            const isSelected = p.id === state.tensionCalculator.presetId;
                            return `
                                <div data-tension-preset="${p.id}" class="rounded-xl p-3 flex flex-col justify-between transition cursor-pointer border ${isSelected ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/50 shadow-md' : 'border-slate-800 bg-[#090d16] hover:border-slate-700'}">
                                    <div class="space-y-1">
                                        <div class="flex items-center justify-between">
                                            <span class="text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold tracking-wider ${p.badgeColor}">
                                                ${p.badge}
                                            </span>
                                            <span class="text-[10px] font-mono text-slate-400">
                                                ${p.defaultScaleMm} mm
                                            </span>
                                        </div>
                                        <h4 class="text-xs font-bold font-mono text-slate-100 mt-1 line-clamp-1">${p.name}</h4>
                                        <p class="text-[10px] text-slate-400 leading-snug line-clamp-2">${p.description}</p>
                                    </div>
                                    <div class="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between">
                                        <span class="text-[10px] font-mono ${isSelected ? 'text-emerald-400 font-bold' : 'text-slate-500'}">
                                            ${isSelected ? '● Ativo no Cálculo' : 'Carregar Preset'}
                                        </span>
                                        <span class="text-[10px] font-mono text-cyan-400 font-bold">
                                            ${p.courses.length} ${p.courses.length === 5 ? 'pares' : 'cordas'}
                                        </span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Barra de Parâmetros Globais de Lutheria (Escala, Material, Transposição) -->
                <div class="bg-[#090d16] border border-slate-800 rounded-xl p-3.5 space-y-3">
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                        <!-- Escala Vibrante -->
                        <div class="md:col-span-4 space-y-1">
                            <div class="flex items-center justify-between text-[11px] font-mono text-slate-400">
                                <label for="viola-scale-input" class="uppercase font-bold text-slate-300">Escala Vibrante (L):</label>
                                <span class="text-cyan-400 font-bold">${currentScale} mm</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <input type="number" id="viola-scale-input" min="500" max="700" step="5" value="${currentScale}" class="w-24 px-2 py-1 rounded bg-[#0f172a] border border-slate-700 text-xs font-mono text-slate-200 text-center font-bold">
                                <div class="flex flex-wrap gap-1">
                                    ${[580, 590, 600, 650].map((sVal) => `
                                        <button type="button" data-scale-val="${sVal}" class="px-1.5 py-1 text-[10px] font-mono rounded border ${currentScale === sVal ? 'bg-cyan-600 text-slate-950 font-bold border-cyan-400' : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'} transition">
                                            ${sVal}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Material da Corda -->
                        <div class="md:col-span-4 space-y-1">
                            <label for="viola-tension-material-select" class="block text-[11px] font-mono uppercase font-bold text-slate-300">Material do Encordoamento:</label>
                            <select id="viola-tension-material-select" class="w-full px-2.5 py-1.5 rounded-lg bg-[#0f172a] border border-slate-700 text-xs font-mono text-slate-200 focus:border-cyan-400 outline-none">
                                ${Object.entries(STRING_MATERIALS).map(([key, m]) => `
                                    <option value="${key}" ${key === currentMaterialKey ? 'selected' : ''}>${m.name}</option>
                                `).join('')}
                            </select>
                        </div>

                        <!-- Transposição / Afinação -->
                        <div class="md:col-span-4 space-y-1">
                            <div class="flex items-center justify-between text-[11px] font-mono text-slate-400">
                                <span class="uppercase font-bold text-slate-300">Tonalidade / Transposição:</span>
                                <span class="text-amber-400 font-bold">${currentOffset === 0 ? 'Nominal (0)' : (currentOffset > 0 ? `+${currentOffset} semitom` : `${currentOffset} semitons`)}</span>
                            </div>
                            <div class="inline-flex rounded-lg bg-[#0f172a] border border-slate-700 p-0.5 w-full justify-between" role="group">
                                <button type="button" data-pitch-offset="-2" class="px-2 py-1 text-[11px] font-mono rounded transition flex-1 text-center ${currentOffset === -2 ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'}">♭ -2</button>
                                <button type="button" data-pitch-offset="-1" class="px-2 py-1 text-[11px] font-mono rounded transition flex-1 text-center ${currentOffset === -1 ? 'bg-emerald-600 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'}">♭ -1 (Eb)</button>
                                <button type="button" data-pitch-offset="0" class="px-2 py-1 text-[11px] font-mono rounded transition flex-1 text-center ${currentOffset === 0 ? 'bg-cyan-600 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'}">Nominal (0)</button>
                                <button type="button" data-pitch-offset="1" class="px-2 py-1 text-[11px] font-mono rounded transition flex-1 text-center ${currentOffset === 1 ? 'bg-rose-600 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'}">♯ +1 (F)</button>
                            </div>
                        </div>
                    </div>

                    ${hasCustomGauges ? `
                        <div class="flex items-center justify-between p-2 rounded bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300">
                            <span>⚠ Calibres personalizados ativos (modificados pelo usuário).</span>
                            <button type="button" id="btn-viola-reset-gauges" class="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition text-[11px]">
                                Restaurar Calibres do Preset
                            </button>
                        </div>
                    ` : ''}
                </div>

                <!-- Painel de Diagnóstico Estrutural & Saúde do Tampo Harmônico -->
                <div class="bg-[#090d16] border border-slate-800 rounded-xl p-4 space-y-4">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-800">
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded border ${summary.diagnostic.color === 'emerald' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : (summary.diagnostic.color === 'amber' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' : 'bg-rose-500/15 text-rose-300 border-rose-500/30')}">
                                    ${summary.diagnostic.badge}
                                </span>
                                <h4 class="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">Diagnóstico Estrutural do Instrumento</h4>
                            </div>
                            <p class="text-xs text-slate-400 mt-0.5">Tensão acumulada calculada rigorosamente por <em>T</em> = 4 · μ · <em>L</em>² · <em>f</em>²</p>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-mono font-black ${summary.diagnostic.color === 'emerald' ? 'text-emerald-400' : (summary.diagnostic.color === 'amber' ? 'text-amber-400' : 'text-rose-400')}">
                                ${summary.totalKgf.toFixed(2)} kgf
                            </div>
                            <div class="text-[11px] font-mono text-slate-400">
                                ${summary.totalNewtons.toFixed(1)} N &bull; ${summary.totalLbs.toFixed(1)} lbs
                            </div>
                        </div>
                    </div>

                    <!-- Barra de Carga Mecânica Total (Gauge Visual) -->
                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between text-[11px] font-mono text-slate-400">
                            <span>Zona Segura (≤ ${summary.diagnostic.safeThreshold.toFixed(1)} kgf)</span>
                            <span>Zona Alerta (${summary.diagnostic.safeThreshold.toFixed(1)} – ${summary.diagnostic.warningThreshold.toFixed(1)} kgf)</span>
                            <span>Zona Crítica (&gt; ${summary.diagnostic.warningThreshold.toFixed(1)} kgf)</span>
                        </div>
                        <div class="h-4 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700 relative flex">
                            <!-- Faixa Verde -->
                            <div style="width: ${safePercent}%;" class="h-full bg-emerald-600/30 border-r border-emerald-500/50"></div>
                            <!-- Faixa Âmbar -->
                            <div style="width: ${warnPercent - safePercent}%;" class="h-full bg-amber-500/30 border-r border-amber-500/50"></div>
                            <!-- Faixa Vermelha -->
                            <div style="width: ${100 - warnPercent}%;" class="h-full bg-rose-600/30"></div>
                            <!-- Cursor Indicador -->
                            <div style="left: ${gaugePercent}%;" class="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] -ml-0.5"></div>
                        </div>
                    </div>

                    <!-- 3 Cards de Engenharia Mecânica de Lutheria -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div class="p-3 rounded-lg bg-[#0f172a] border border-slate-800 space-y-1">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-mono uppercase text-slate-400">Compressão Axial no Braço</span>
                                <i data-lucide="arrow-right-left" class="w-3.5 h-3.5 text-cyan-400"></i>
                            </div>
                            <div class="text-base font-bold font-mono text-cyan-300">${summary.diagnostic.axialCompressionKgf.toFixed(2)} kgf</div>
                            <p class="text-[10px] text-slate-400 leading-tight">Força longitudinal de tração constante sobre o tróculo e tensor metálico.</p>
                        </div>

                        <div class="p-3 rounded-lg bg-[#0f172a] border border-slate-800 space-y-1">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-mono uppercase text-slate-400">Torque / Cisalhamento no Cavalete</span>
                                <i data-lucide="rotate-cw" class="w-3.5 h-3.5 text-amber-400"></i>
                            </div>
                            <div class="text-base font-bold font-mono text-amber-300">${summary.diagnostic.bridgeTorqueNm.toFixed(2)} N·m</div>
                            <p class="text-[10px] text-slate-400 leading-tight">Momento de rotação que tenta levantar o cavalete e afundar a frente da boca.</p>
                        </div>

                        <div class="p-3 rounded-lg bg-[#0f172a] border border-slate-800 space-y-1">
                            <div class="flex items-center justify-between">
                                <span class="text-[10px] font-mono uppercase text-slate-400">Pressão Descendente no Tampo</span>
                                <i data-lucide="arrow-down" class="w-3.5 h-3.5 text-emerald-400"></i>
                            </div>
                            <div class="text-base font-bold font-mono text-emerald-300">${summary.diagnostic.bridgeDownwardForceKgf.toFixed(2)} kgf</div>
                            <p class="text-[10px] text-slate-400 leading-tight">Força vertical que excita o leque harmônico via ângulo de quebra de 30°.</p>
                        </div>
                    </div>

                    <!-- Caixa de Parecer Técnico do Luthier -->
                    <div class="p-3 rounded-lg border ${summary.diagnostic.color === 'emerald' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-200' : (summary.diagnostic.color === 'amber' ? 'bg-amber-500/5 border-amber-500/20 text-amber-200' : 'bg-rose-500/5 border-rose-500/20 text-rose-200')} space-y-1 text-xs">
                        <div class="font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
                            <i data-lucide="${summary.diagnostic.icon}" class="w-4 h-4"></i>
                            <span>Parecer Técnico do Especialista Violeiro:</span>
                        </div>
                        <p class="text-slate-300 leading-relaxed">${summary.diagnostic.summary}</p>
                        <p class="font-semibold mt-1">${summary.diagnostic.actionAdvice}</p>
                    </div>
                </div>

                <!-- Tabela Detalhada Par a Par / Corda a Corda -->
                <div class="bg-[#090d16] border border-slate-800 rounded-xl p-4 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <h4 class="text-xs font-bold font-mono text-slate-200 uppercase tracking-wider">Detalhamento Físico por Par / Corda</h4>
                            <p class="text-[11px] text-slate-400">Ajuste fino individual de calibres com recálculo instantâneo de tensão</p>
                        </div>
                        <div>
                            <span class="px-2 py-0.5 text-[10px] font-mono rounded ${state.isLeftHanded ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700'}">
                                ${state.isLeftHanded ? 'Disposição Canhota Ativa' : 'Disposição Destra'}
                            </span>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse text-xs font-mono">
                            <thead>
                                <tr class="border-b border-slate-800 text-[10px] uppercase text-slate-400">
                                    <th class="py-2 px-2">Par / Corda</th>
                                    <th class="py-2 px-2">Afinação Nominal</th>
                                    <th class="py-2 px-2">Calibre Individual (pol / mm)</th>
                                    <th class="py-2 px-2">Tipo de Corda</th>
                                    <th class="py-2 px-2">Tensão Individual</th>
                                    <th class="py-2 px-2">Tensão do Par</th>
                                    <th class="py-2 px-2 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/60">
                                ${summary.courses.map((c, cIdx) => `
                                    <tr class="hover:bg-slate-800/30 transition">
                                        <td class="py-2.5 px-2">
                                            <div class="font-bold text-slate-200">${c.label}</div>
                                            <div class="text-[10px] text-slate-400">${c.strings.length > 1 ? 'Par duplo' : 'Corda simples'}</div>
                                        </td>
                                        <td class="py-2.5 px-2">
                                            <span class="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30">${c.note}</span>
                                        </td>
                                        <td class="py-2.5 px-2 space-y-1">
                                            ${c.strings.map((str, sIdx) => `
                                                <div class="flex items-center gap-1.5">
                                                    <span class="w-16 font-bold text-slate-200">.0${Math.round(str.gaugeInches * 1000)}"</span>
                                                    <span class="text-[10px] text-slate-500">(${str.gaugeMm.toFixed(2)} mm)</span>
                                                    <div class="inline-flex rounded bg-[#0f172a] border border-slate-700">
                                                        <button type="button" data-gauge-delta="-0.001" data-cidx="${cIdx}" data-sidx="${sIdx}" class="px-1.5 py-0.5 text-[10px] hover:bg-slate-700 text-slate-300 font-bold">−.001</button>
                                                        <button type="button" data-gauge-delta="0.001" data-cidx="${cIdx}" data-sidx="${sIdx}" class="px-1.5 py-0.5 text-[10px] hover:bg-slate-700 text-slate-300 font-bold border-l border-slate-700">+.001</button>
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </td>
                                        <td class="py-2.5 px-2 text-[10px] text-slate-400 space-y-1">
                                            ${c.strings.map((str) => `
                                                <div>
                                                    <span class="px-1.5 py-0.5 rounded ${str.type === 'plain' ? 'bg-slate-800 text-slate-300' : (str.type === 'wound' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-indigo-500/15 text-indigo-300')}">
                                                        ${str.type === 'plain' ? 'Aço Liso' : (str.type === 'wound' ? 'Encapada' : (str.type === 'nylon_plain' ? 'Nylon Cristal' : 'Nylon Encapado'))}
                                                    </span>
                                                </div>
                                            `).join('')}
                                        </td>
                                        <td class="py-2.5 px-2 space-y-1 text-slate-300">
                                            ${c.strings.map((str) => `
                                                <div>
                                                    <span class="font-bold text-emerald-400">${str.tensionKgf.toFixed(2)} kgf</span>
                                                    <span class="text-[10px] text-slate-500">(${str.tensionNewtons.toFixed(1)} N)</span>
                                                </div>
                                            `).join('')}
                                        </td>
                                        <td class="py-2.5 px-2">
                                            <div class="font-bold text-sm text-cyan-300">${c.tensionKgf.toFixed(2)} kgf</div>
                                            <div class="text-[10px] text-slate-500">${c.tensionNewtons.toFixed(1)} N</div>
                                            <div class="w-20 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                                                <div style="width: ${Math.min(100, Math.round((c.tensionKgf / 22) * 100))}%;" class="h-full bg-cyan-500"></div>
                                            </div>
                                        </td>
                                        <td class="py-2.5 px-2 text-right">
                                            <button type="button" data-play-course-tension="${cIdx}" class="px-2.5 py-1.5 rounded-lg bg-cyan-600/15 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition flex items-center gap-1 ml-auto">
                                                <i data-lucide="play" class="w-3 h-3"></i>
                                                <span>Ouvir</span>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Simulador de Ação de Cordas (Nut & Saddle Setup Calculator) -->
                <div class="bg-[#090d16] border border-slate-800 rounded-xl p-4 space-y-4">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-800">
                        <div>
                            <div class="flex items-center gap-2">
                                <i data-lucide="ruler" class="w-4 h-4 text-amber-400"></i>
                                <h4 class="text-sm font-bold font-mono text-slate-100 uppercase tracking-wider">Simulador de Ação de Cordas &amp; Regulagem de Pestana e Rastilho</h4>
                            </div>
                            <p class="text-xs text-slate-400 mt-0.5">Insira as medidas em milímetros da altura das cordas no 1º e 12º traste para calcular o desbaste exato em osso</p>
                        </div>
                    </div>

                    <!-- Seletor de Perfil Alvo de Tocada -->
                    <div class="space-y-1.5">
                        <span class="text-[11px] font-mono uppercase font-bold text-slate-300">Perfil Alvo de Regulagem:</span>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            ${Object.values(ACTION_TARGET_PROFILES).map((prof) => {
                                const isProfActive = prof.id === state.tensionCalculator.targetActionProfile;
                                return `
                                    <div data-action-profile="${prof.id}" class="rounded-xl p-3 border cursor-pointer transition ${isProfActive ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500/50 shadow-md' : 'border-slate-800 bg-[#0f172a] hover:border-slate-700'}">
                                        <div class="flex items-center justify-between">
                                            <span class="text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold ${prof.badgeColor}">
                                                ${prof.badge}
                                            </span>
                                            <span class="text-[10px] font-mono font-bold ${isProfActive ? 'text-amber-400' : 'text-slate-500'}">
                                                ${isProfActive ? '● Ativo' : 'Escolher'}
                                            </span>
                                        </div>
                                        <h5 class="text-xs font-bold font-mono text-slate-200 mt-1">${prof.name}</h5>
                                        <p class="text-[10px] text-slate-400 leading-snug mt-1">${prof.description}</p>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Medições Reais do Instrumento (Inputs Interativos) -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <!-- Coluna 1: 1º Traste (Pestana / Nut) -->
                        <div class="bg-[#0f172a] border border-slate-800 rounded-lg p-3 space-y-3">
                            <div class="flex items-center justify-between pb-1 border-b border-slate-800/80">
                                <span class="text-xs font-mono font-bold text-cyan-300 uppercase">Pestana (1º Traste)</span>
                                <span class="text-[10px] font-mono px-1.5 py-0.5 rounded ${actionAnalysis.nutStatus === 'IDEAL' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'} font-bold">
                                    ${actionAnalysis.nutLabel}
                                </span>
                            </div>

                            <div class="space-y-2 text-xs font-mono">
                                <div>
                                    <div class="flex justify-between text-slate-300 mb-1">
                                        <span>1º Par (Prima):</span>
                                        <span class="font-bold text-cyan-400">${state.tensionCalculator.actionMeasureNutTreble.toFixed(2)} mm</span>
                                        <span class="text-[10px] text-slate-500">(Alvo: ${actionAnalysis.target.nutTreble.toFixed(2)} mm)</span>
                                    </div>
                                    <input type="range" id="viola-action-nut-treble" min="0.25" max="1.20" step="0.05" value="${state.tensionCalculator.actionMeasureNutTreble}" class="w-full accent-cyan-400 cursor-pointer">
                                </div>

                                <div>
                                    <div class="flex justify-between text-slate-300 mb-1">
                                        <span>5º Par (Bordão / Canotilho):</span>
                                        <span class="font-bold text-cyan-400">${state.tensionCalculator.actionMeasureNutBass.toFixed(2)} mm</span>
                                        <span class="text-[10px] text-slate-500">(Alvo: ${actionAnalysis.target.nutBass.toFixed(2)} mm)</span>
                                    </div>
                                    <input type="range" id="viola-action-nut-bass" min="0.30" max="1.40" step="0.05" value="${state.tensionCalculator.actionMeasureNutBass}" class="w-full accent-cyan-400 cursor-pointer">
                                </div>
                            </div>
                        </div>

                        <!-- Coluna 2: 12º Traste (Rastilho / Saddle) -->
                        <div class="bg-[#0f172a] border border-slate-800 rounded-lg p-3 space-y-3">
                            <div class="flex items-center justify-between pb-1 border-b border-slate-800/80">
                                <span class="text-xs font-mono font-bold text-amber-300 uppercase">Cavalete &amp; Rastilho (12º Traste)</span>
                                <span class="text-[10px] font-mono px-1.5 py-0.5 rounded ${actionAnalysis.action12Status === 'IDEAL' ? 'bg-emerald-500/20 text-emerald-300' : (actionAnalysis.action12Status === 'HIGH' ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300')} font-bold">
                                    ${actionAnalysis.action12Label}
                                </span>
                            </div>

                            <div class="space-y-2 text-xs font-mono">
                                <div>
                                    <div class="flex justify-between text-slate-300 mb-1">
                                        <span>1º Par (Prima):</span>
                                        <span class="font-bold text-amber-400">${state.tensionCalculator.actionMeasure12thTreble.toFixed(2)} mm</span>
                                        <span class="text-[10px] text-slate-500">(Alvo: ${actionAnalysis.target.fret12Treble.toFixed(2)} mm)</span>
                                    </div>
                                    <input type="range" id="viola-action-12th-treble" min="1.20" max="4.50" step="0.10" value="${state.tensionCalculator.actionMeasure12thTreble}" class="w-full accent-amber-400 cursor-pointer">
                                </div>

                                <div>
                                    <div class="flex justify-between text-slate-300 mb-1">
                                        <span>5º Par (Bordão / Canotilho):</span>
                                        <span class="font-bold text-amber-400">${state.tensionCalculator.actionMeasure12thBass.toFixed(2)} mm</span>
                                        <span class="text-[10px] text-slate-500">(Alvo: ${actionAnalysis.target.fret12Bass.toFixed(2)} mm)</span>
                                    </div>
                                    <input type="range" id="viola-action-12th-bass" min="1.40" max="5.00" step="0.10" value="${state.tensionCalculator.actionMeasure12thBass}" class="w-full accent-amber-400 cursor-pointer">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Instruções Técnicas de Ajuste em Oficina (Rastilho & Pestana) -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div class="p-3 rounded-lg bg-[#0f172a] border border-amber-500/30 text-xs font-mono space-y-1.5">
                            <div class="font-bold text-amber-300 flex items-center gap-1.5">
                                <i data-lucide="wrench" class="w-4 h-4"></i>
                                <span>Ajuste Recomendado no Rastilho (Cavalete):</span>
                            </div>
                            <div class="text-slate-300 text-[11px] leading-relaxed">
                                ${actionAnalysis.saddleSandTreble > 0.1 || actionAnalysis.saddleSandBass > 0.1 ? `
                                    Pela relação trigonométrica do braço, desbaste a base do rastilho em:
                                    <div class="my-1.5 p-2 rounded bg-amber-500/10 border border-amber-500/30 font-bold text-amber-300">
                                        Lado Prima: ${actionAnalysis.saddleSandTreble > 0.1 ? actionAnalysis.saddleSandTreble.toFixed(2) + ' mm' : '0.00 mm (manter)'} |
                                        Lado Bordão: ${actionAnalysis.saddleSandBass > 0.1 ? actionAnalysis.saddleSandBass.toFixed(2) + ' mm' : '0.00 mm (manter)'}
                                    </div>
                                    Apoie o rastilho de osso sobre uma lixa 400 em superfície de vidro plano, mantendo ângulo reto perfeito de 90° para não perder contato acústico com o fundo do cavalete.
                                ` : (actionAnalysis.saddleSandTreble < -0.1 || actionAnalysis.saddleSandBass < -0.1 ? `
                                    Rastilho excessivamente baixo! Calce a base com lâmina de madeira nobre de ${Math.abs(actionAnalysis.saddleSandTreble).toFixed(2)} mm ou confeccione novo rastilho em osso de boi natural.
                                ` : `
                                    Rastilho perfeitamente calibrado para o perfil alvo! Nenhuma alteração de altura necessária no cavalete.
                                `)}
                            </div>
                        </div>

                        <div class="p-3 rounded-lg bg-[#0f172a] border border-cyan-500/30 text-xs font-mono space-y-1.5">
                            <div class="font-bold text-cyan-300 flex items-center gap-1.5">
                                <i data-lucide="check-circle-2" class="w-4 h-4"></i>
                                <span>Ajuste Recomendado na Pestana (Nut):</span>
                            </div>
                            <div class="text-slate-300 text-[11px] leading-relaxed">
                                ${actionAnalysis.deltaNutTreble > 0.08 || actionAnalysis.deltaNutBass > 0.08 ? `
                                    As cordas soltas estão afastadas do 1º traste, tornando pestanas difíceis:
                                    <div class="my-1.5 p-2 rounded bg-cyan-500/10 border border-cyan-500/30 font-bold text-cyan-300">
                                        Aprofundar ranhuras em: Prima = ${Math.max(0, actionAnalysis.deltaNutTreble).toFixed(2)} mm | Bordão = ${Math.max(0, actionAnalysis.deltaNutBass).toFixed(2)} mm
                                    </div>
                                    Utilize limas calibradas de luthier (nut slotting files) inclinadas no ângulo da mão da viola (headstock angle).
                                ` : (actionAnalysis.deltaNutTreble < -0.05 || actionAnalysis.deltaNutBass < -0.05 ? `
                                    Ranhura da pestana muito baixa. Risco de trastejamento em corda solta. Preencha o sulco com pó de osso + cianoacrilato ou substitua a pestana.
                                ` : `
                                    Altura da pestana ideal no 1º traste. Digitação suave sem desafinação por pressão excessiva.
                                `)}
                            </div>
                        </div>
                    </div>

                    <!-- Compensação Especial para Canhotos -->
                    <div class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/40 text-xs font-mono space-y-1">
                        <div class="flex items-center gap-2 font-bold text-amber-300">
                            <i data-lucide="info" class="w-4 h-4"></i>
                            <span>Compensação de Entonação Canhota no Rastilho de Osso:</span>
                        </div>
                        <p class="text-slate-300 text-[11px] leading-relaxed">
                            ${state.isLeftHanded ? `
                                <strong>Modo Canhoto Ativo:</strong> O rastilho da viola deve ser invertido em espelho! O ponto de apoio da 5ª corda (Canotilho) deve ficar entre 1.5 e 2.5 mm mais distante da pestana do que a Prima para compensar a rigidez de flexão da corda grossa. Sem essa compensação, as notas tocadas além do 5º traste soarão desafinadas para sustenido.
                            ` : `
                                <strong>Modo Destro:</strong> O rastilho padrão possui o recuo de oitava voltado para o lado esquerdo (corda grave). Ao converter um instrumento para canhoto, nunca inverta apenas as cordas: troque ou retrabalhe o rastilho para inverter o ângulo de compensação.
                            `}
                        </p>
                    </div>
                </div>
            </div>
        `;

        // Eventos dos Presets
        container.querySelectorAll('[data-tension-preset]').forEach((el) => {
            el.addEventListener('click', () => {
                const pid = el.getAttribute('data-tension-preset');
                if (pid && TENSION_PRESETS[pid]) {
                    state.tensionCalculator.presetId = pid;
                    state.tensionCalculator.customGauges = null;
                    state.tensionCalculator.scaleLengthMm = TENSION_PRESETS[pid].defaultScaleMm;
                    state.tensionCalculator.stringMaterial = TENSION_PRESETS[pid].material;

                    // Se o preset for de violão e o instrumento atual for viola (ou vice-versa), sincroniza o instrumento
                    if (pid.startsWith('violao_') && state.instrumentId !== 'violao_padrao') {
                        state.instrumentId = 'violao_padrao';
                    } else if (pid.startsWith('viola_') && state.instrumentId === 'violao_padrao') {
                        state.instrumentId = TENSION_PRESETS[pid].instrumentId || 'viola_cebolao_e';
                    }

                    saveViolaState();
                    renderAll();
                }
            });
        });

        // Eventos de Escala (Botões e Input)
        container.querySelectorAll('[data-scale-val]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const sVal = parseInt(btn.getAttribute('data-scale-val'), 10);
                if (sVal) {
                    state.tensionCalculator.scaleLengthMm = sVal;
                    saveViolaState();
                    renderTensionCalculatorSection();
                }
            });
        });

        const scaleInput = document.getElementById('viola-scale-input');
        if (scaleInput) {
            scaleInput.addEventListener('change', (e) => {
                const sVal = parseInt(e.target.value, 10);
                if (sVal && sVal >= 450 && sVal <= 750) {
                    state.tensionCalculator.scaleLengthMm = sVal;
                    saveViolaState();
                    renderTensionCalculatorSection();
                }
            });
        }

        // Evento de Material
        const matSelect = document.getElementById('viola-tension-material-select');
        if (matSelect) {
            matSelect.addEventListener('change', (e) => {
                state.tensionCalculator.stringMaterial = e.target.value;
                saveViolaState();
                renderTensionCalculatorSection();
            });
        }

        // Eventos de Transposição
        container.querySelectorAll('[data-pitch-offset]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const offset = parseInt(btn.getAttribute('data-pitch-offset'), 10);
                state.tensionCalculator.pitchOffsetSemitones = offset;
                saveViolaState();
                renderTensionCalculatorSection();
            });
        });

        // Resetar calibres
        const resetGaugesBtn = document.getElementById('btn-viola-reset-gauges');
        if (resetGaugesBtn) {
            resetGaugesBtn.addEventListener('click', () => {
                state.tensionCalculator.customGauges = null;
                saveViolaState();
                renderTensionCalculatorSection();
            });
        }

        // Modificações finas de calibre (+- .001)
        container.querySelectorAll('[data-gauge-delta]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const delta = parseFloat(btn.getAttribute('data-gauge-delta'));
                const cIdx = parseInt(btn.getAttribute('data-cidx'), 10);
                const sIdx = parseInt(btn.getAttribute('data-sidx'), 10);

                if (!Array.isArray(state.tensionCalculator.customGauges)) {
                    state.tensionCalculator.customGauges = preset.courses.map((c) => c.strings.map((s) => s.gauge));
                }

                if (state.tensionCalculator.customGauges[cIdx] && state.tensionCalculator.customGauges[cIdx][sIdx] !== undefined) {
                    let cur = state.tensionCalculator.customGauges[cIdx][sIdx];
                    cur = Math.max(0.007, Math.min(0.065, Math.round((cur + delta) * 1000) / 1000));
                    state.tensionCalculator.customGauges[cIdx][sIdx] = cur;
                    saveViolaState();
                    renderTensionCalculatorSection();
                }
            });
        });

        // Botões de ouvir par individual
        container.querySelectorAll('[data-play-course-tension]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const cIdx = parseInt(btn.getAttribute('data-play-course-tension'), 10);
                playCourseTensionAudio(cIdx);
            });
        });

        // Botão Arpejar Instrumento
        const arpBtn = document.getElementById('btn-viola-tension-arpeggiate');
        if (arpBtn) arpBtn.addEventListener('click', arpeggiateTensionAllCourses);

        // Botão Copiar Relatório
        const copyBtn = document.getElementById('btn-viola-copy-report');
        if (copyBtn) copyBtn.addEventListener('click', copyLutherieReport);

        // Perfil Alvo de Ação
        container.querySelectorAll('[data-action-profile]').forEach((el) => {
            el.addEventListener('click', () => {
                const pId = el.getAttribute('data-action-profile');
                if (pId && ACTION_TARGET_PROFILES[pId]) {
                    state.tensionCalculator.targetActionProfile = pId;
                    saveViolaState();
                    renderTensionCalculatorSection();
                }
            });
        });

        // Sliders de Ação
        const nutTrebleSlider = document.getElementById('viola-action-nut-treble');
        if (nutTrebleSlider) {
            nutTrebleSlider.addEventListener('input', (e) => {
                state.tensionCalculator.actionMeasureNutTreble = parseFloat(e.target.value);
                saveViolaState();
                renderTensionCalculatorSection();
            });
        }

        const nutBassSlider = document.getElementById('viola-action-nut-bass');
        if (nutBassSlider) {
            nutBassSlider.addEventListener('input', (e) => {
                state.tensionCalculator.actionMeasureNutBass = parseFloat(e.target.value);
                saveViolaState();
                renderTensionCalculatorSection();
            });
        }

        const fret12TrebleSlider = document.getElementById('viola-action-12th-treble');
        if (fret12TrebleSlider) {
            fret12TrebleSlider.addEventListener('input', (e) => {
                state.tensionCalculator.actionMeasure12thTreble = parseFloat(e.target.value);
                saveViolaState();
                renderTensionCalculatorSection();
            });
        }

        const fret12BassSlider = document.getElementById('viola-action-12th-bass');
        if (fret12BassSlider) {
            fret12BassSlider.addEventListener('input', (e) => {
                state.tensionCalculator.actionMeasure12thBass = parseFloat(e.target.value);
                saveViolaState();
                renderTensionCalculatorSection();
            });
        }

        if (window.lucide && window.lucide.createIcons) {
            window.lucide.createIcons();
        }
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
        stopTabEditorPlayback();
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
    // TREINADOR AUDITIVO DE AFINAÇÃO & PARES OITAVADOS (FASE 5)
    // =========================================================================
    let earAudioNodes = {
        ctx: null,
        oscRef: null,
        oscHarmonic: null,
        oscTest: null,
        gainRef: null,
        gainHarmonic: null,
        gainTest: null,
        masterGain: null,
        pulseTimer: null,
        rafId: null,
        isPlaying: false,
        currentDetuneCents: 0,
        animPhase: 0,
        activeSoloMode: null // null (duo), 'ref', 'test', 'pure'
    };

    function getEarTrainerRank(score) {
        if (score >= 500) {
            return {
                title: 'Tião Carreiro Lendário',
                badge: '👑 Mestre Supremo',
                colorClass: 'text-amber-400 bg-amber-500/15 border-amber-500/40',
                progressPct: 100,
                nextGoal: 'Nível Máximo Alcançado'
            };
        }
        if (score >= 300) {
            const p = Math.round(((score - 300) / 200) * 100);
            return {
                title: 'Mestre Violeiro de Folia',
                badge: '🪕 Virtuoso do Aço',
                colorClass: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/40',
                progressPct: p,
                nextGoal: `${500 - score} pts para Tião Carreiro`
            };
        }
        if (score >= 150) {
            const p = Math.round(((score - 150) / 150) * 100);
            return {
                title: 'Boiadeiro Afinador',
                badge: '🐂 Ouvido de Ouro',
                colorClass: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/40',
                progressPct: p,
                nextGoal: `${300 - score} pts para Mestre Violeiro`
            };
        }
        if (score >= 50) {
            const p = Math.round(((score - 50) / 100) * 100);
            return {
                title: 'Peão Violeiro',
                badge: '🐎 Bom de Ouvido',
                colorClass: 'text-indigo-300 bg-indigo-500/15 border-indigo-500/40',
                progressPct: p,
                nextGoal: `${150 - score} pts para Boiadeiro`
            };
        }
        const p = Math.round((score / 50) * 100);
        return {
            title: 'Iniciante da Roça',
            badge: '🌾 Aprendiz de Viola',
            colorClass: 'text-slate-300 bg-slate-800 border-slate-700',
            progressPct: p,
            nextGoal: `${50 - score} pts para Peão Violeiro`
        };
    }

    function calculateBeatFrequency(courseIdx, detuneCents) {
        const inst = INSTRUMENTS[state.instrumentId];
        const course = inst.courses[courseIdx] || inst.courses[0];
        const isPaired = inst.isPaired && course.midi.length >= 2;
        const isOctaved = isPaired && course.octaved;

        let fTarget = 0;
        if (isOctaved) {
            // No par oitavado, a referência de interferência é o 2º harmônico do bordão
            fTarget = midiToFreq(course.midi[0]) * 2;
        } else {
            fTarget = midiToFreq(course.midi[0]);
        }
        const fActual = fTarget * Math.pow(2, detuneCents / 1200);
        return Math.abs(fTarget - fActual);
    }

    function stopEarTrainerAudio() {
        if (earAudioNodes.pulseTimer) {
            clearInterval(earAudioNodes.pulseTimer);
            earAudioNodes.pulseTimer = null;
        }
        if (earAudioNodes.rafId) {
            cancelAnimationFrame(earAudioNodes.rafId);
            earAudioNodes.rafId = null;
        }
        if (earAudioNodes.masterGain && earAudioNodes.ctx) {
            try {
                const now = earAudioNodes.ctx.currentTime;
                earAudioNodes.masterGain.gain.cancelScheduledValues(now);
                earAudioNodes.masterGain.gain.setValueAtTime(earAudioNodes.masterGain.gain.value, now);
                earAudioNodes.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
                setTimeout(() => {
                    try {
                        if (earAudioNodes.oscRef) earAudioNodes.oscRef.stop();
                        if (earAudioNodes.oscHarmonic) earAudioNodes.oscHarmonic.stop();
                        if (earAudioNodes.oscTest) earAudioNodes.oscTest.stop();
                    } catch (_) {}
                    earAudioNodes.oscRef = null;
                    earAudioNodes.oscHarmonic = null;
                    earAudioNodes.oscTest = null;
                    earAudioNodes.masterGain = null;
                }, 90);
            } catch (_) {}
        }
        earAudioNodes.isPlaying = false;
        earAudioNodes.activeSoloMode = null;
        updateEarTrainerPlayButtons();
    }

    function playEarTrainerSound(opts = {}) {
        stopEarTrainerAudio();
        stopPonteioPlayback();
        stopScalePlayback();
        stopProgressionPlayback();
        stopTunerTone();

        const ctx = ensureAudioContext();
        if (!ctx) return;
        earAudioNodes.ctx = ctx;

        const inst = INSTRUMENTS[state.instrumentId];
        const courseIdx = typeof opts.courseIdx === 'number'
            ? opts.courseIdx
            : (state.earTrainer.selectedCourseIdx >= 0 ? state.earTrainer.selectedCourseIdx : 2);
        const validCourseIdx = Math.max(0, Math.min(inst.courses.length - 1, courseIdx));
        const course = inst.courses[validCourseIdx];
        if (!course) return;

        const soundType = opts.soundType || state.earTrainer.soundType || 'pluck';
        const soloMode = opts.soloMode || null; // 'ref' | 'test' | 'pure' | null
        let detuneCents = typeof opts.detuneCents === 'number' ? opts.detuneCents : 0;
        if (soloMode === 'pure') detuneCents = 0;

        earAudioNodes.currentDetuneCents = detuneCents;
        earAudioNodes.activeSoloMode = soloMode;
        earAudioNodes.isPlaying = true;

        const isPaired = inst.isPaired && course.midi.length >= 2;
        const isOctaved = isPaired && course.octaved;

        let fRef = 0;
        let fTest = 0;
        if (isOctaved) {
            fRef = midiToFreq(course.midi[0]); // Bordão grave (G#3, E3, B2...)
            fTest = midiToFreq(course.midi[1]); // Cantadeira fina (G#4, E4, B3...)
        } else if (isPaired) {
            fRef = midiToFreq(course.midi[0]); // Uníssono
            fTest = midiToFreq(course.midi[1]);
        } else {
            fRef = midiToFreq(course.midi[0]); // Violão 6 cordas
            fTest = midiToFreq(course.midi[0]);
        }

        function triggerEmission(isPluck) {
            if (!earAudioNodes.isPlaying) return;
            const now = ctx.currentTime;
            const duration = isPluck ? 2.1 : 3600;

            const masterGain = ctx.createGain();
            const bodyFilter = ctx.createBiquadFilter();
            bodyFilter.type = 'lowpass';
            bodyFilter.frequency.setValueAtTime(isOctaved ? 3600 : 4200, now);
            bodyFilter.Q.setValueAtTime(1.2, now);

            // 1. Oscilador da Corda de Referência (Bordão ou Prima Base)
            const oscRef = ctx.createOscillator();
            const gRef = ctx.createGain();
            oscRef.type = 'triangle';
            oscRef.frequency.setValueAtTime(fRef, now);
            const refVol = (soloMode === 'test') ? 0 : 0.36;
            gRef.gain.setValueAtTime(refVol, now);
            oscRef.connect(gRef);
            gRef.connect(bodyFilter);

            // Harmônico 2 do bordão para pares oitavados (física real dos batimentos)
            let oscHarmonic = null;
            let gHarmonic = null;
            if (isOctaved && soloMode !== 'test') {
                oscHarmonic = ctx.createOscillator();
                gHarmonic = ctx.createGain();
                oscHarmonic.type = 'sawtooth';
                oscHarmonic.frequency.setValueAtTime(fRef * 2, now);
                gHarmonic.gain.setValueAtTime(0.12, now);
                oscHarmonic.connect(gHarmonic);
                gHarmonic.connect(bodyFilter);
            }

            // 2. Oscilador da Corda Testada / Móvel (com detune em cents)
            const oscTest = ctx.createOscillator();
            const gTest = ctx.createGain();
            oscTest.type = 'triangle';
            oscTest.frequency.setValueAtTime(fTest, now);
            oscTest.detune.setValueAtTime(earAudioNodes.currentDetuneCents, now);
            const testVol = (soloMode === 'ref') ? 0 : 0.34;
            gTest.gain.setValueAtTime(testVol, now);
            oscTest.connect(gTest);
            gTest.connect(bodyFilter);

            // Envelopes de volume
            if (isPluck) {
                masterGain.gain.setValueAtTime(0.0001, now);
                masterGain.gain.linearRampToValueAtTime(0.38, now + 0.008);
                masterGain.gain.exponentialRampToValueAtTime(0.18, now + 0.25);
                masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            } else {
                masterGain.gain.setValueAtTime(0.0001, now);
                masterGain.gain.linearRampToValueAtTime(0.24, now + 0.06);
            }

            bodyFilter.connect(masterGain);
            masterGain.connect(ctx.destination);

            oscRef.start(now);
            if (oscHarmonic) oscHarmonic.start(now);
            oscTest.start(now);

            if (isPluck) {
                oscRef.stop(now + duration + 0.05);
                if (oscHarmonic) oscHarmonic.stop(now + duration + 0.05);
                oscTest.stop(now + duration + 0.05);
            }

            earAudioNodes.oscRef = oscRef;
            earAudioNodes.oscHarmonic = oscHarmonic;
            earAudioNodes.oscTest = oscTest;
            earAudioNodes.masterGain = masterGain;
        }

        if (soundType === 'pluck') {
            triggerEmission(true);
            earAudioNodes.pulseTimer = setInterval(() => {
                if (!earAudioNodes.isPlaying) {
                    clearInterval(earAudioNodes.pulseTimer);
                    earAudioNodes.pulseTimer = null;
                    return;
                }
                triggerEmission(true);
            }, 2200);
        } else {
            triggerEmission(false);
        }

        startBeatsAnimation();
        updateEarTrainerPlayButtons();
    }

    function updateEarTrainerDetune(newCents) {
        earAudioNodes.currentDetuneCents = newCents;
        if (earAudioNodes.oscTest && earAudioNodes.ctx) {
            try {
                earAudioNodes.oscTest.detune.setValueAtTime(newCents, earAudioNodes.ctx.currentTime);
            } catch (_) {}
        }
        renderBeatsCanvas();
    }

    function startBeatsAnimation() {
        if (earAudioNodes.rafId) return;
        function loop() {
            if (!earAudioNodes.isPlaying) {
                earAudioNodes.rafId = null;
                return;
            }
            earAudioNodes.animPhase += 0.08;
            renderBeatsCanvas();
            earAudioNodes.rafId = requestAnimationFrame(loop);
        }
        earAudioNodes.rafId = requestAnimationFrame(loop);
    }

    function renderBeatsCanvas() {
        const canvas = document.getElementById('viola-beats-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const midY = h / 2;

        ctx.fillStyle = '#070b12';
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(w, midY);
        ctx.stroke();

        const isChallengeMode = state.earTrainer.mode === 'challenge';
        const isBlind = isChallengeMode && state.earTrainer.challengeActive && !state.earTrainer.challengeRevealed;

        if (isBlind) {
            ctx.fillStyle = 'rgba(6, 182, 212, 0.04)';
            ctx.fillRect(0, 0, w, h);

            ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            for (let x = 0; x < w; x += 3) {
                const y = midY + Math.sin((x * 0.05) + earAudioNodes.animPhase) * 16 * Math.cos(x * 0.01);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            ctx.fillStyle = '#38bdf8';
            ctx.font = '600 12px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('🎧 MODO TESTE CEGO ATIVO — ESCUTE A PULSAÇÃO DOS BATIMENTOS', w / 2, midY - 6);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '400 10px "Inter", sans-serif';
            ctx.fillText('A forma de onda e os cents exatos serão revelados logo após sua resposta', w / 2, midY + 14);
            return;
        }

        const courseIdx = isChallengeMode
            ? state.earTrainer.challengeCourseIdx
            : state.earTrainer.pegCourseIdx;
        const detuneCents = isChallengeMode
            ? state.earTrainer.challengeDetuneCents
            : (state.earTrainer.pegTargetCents + state.earTrainer.pegUserCents);

        const beatFreq = calculateBeatFrequency(courseIdx, detuneCents);
        const isPure = Math.abs(detuneCents) <= 1.2 || beatFreq < 0.15;

        const modFreq = Math.max(0.2, Math.min(12, beatFreq));
        const carrierCycles = 24;

        // 1. Envoltória modulada de batimento
        ctx.strokeStyle = isPure ? 'rgba(52, 211, 153, 0.55)' : 'rgba(251, 191, 36, 0.55)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);

        ctx.beginPath();
        for (let x = 0; x < w; x += 2) {
            const t = (x / w) * 2;
            const env = isPure
                ? 34
                : 38 * Math.abs(Math.cos(Math.PI * modFreq * t + (earAudioNodes.animPhase * 0.4)));
            const yTop = midY - env;
            if (x === 0) ctx.moveTo(x, yTop);
            else ctx.lineTo(x, yTop);
        }
        ctx.stroke();

        ctx.beginPath();
        for (let x = 0; x < w; x += 2) {
            const t = (x / w) * 2;
            const env = isPure
                ? 34
                : 38 * Math.abs(Math.cos(Math.PI * modFreq * t + (earAudioNodes.animPhase * 0.4)));
            const yBot = midY + env;
            if (x === 0) ctx.moveTo(x, yBot);
            else ctx.lineTo(x, yBot);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // 2. Onda composta resultante
        ctx.strokeStyle = isPure ? '#34d399' : '#22d3ee';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
            const t = (x / w) * 2;
            const env = isPure
                ? 34
                : 38 * Math.abs(Math.cos(Math.PI * modFreq * t + (earAudioNodes.animPhase * 0.4)));
            const carrier = Math.sin(2 * Math.PI * carrierCycles * t + earAudioNodes.animPhase);
            const y = midY + carrier * env;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // 3. Informações textuais técnicas
        ctx.font = '700 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'left';
        if (isPure) {
            ctx.fillStyle = '#34d399';
            ctx.fillText('● CONSONÂNCIA PURA • ZERO BATIMENTOS (Fase Estável)', 12, 18);
        } else {
            ctx.fillStyle = '#fbbf24';
            const sign = detuneCents > 0 ? '+' : '';
            ctx.fillText(`● BATIMENTO: ${beatFreq.toFixed(1)} Hz (${beatFreq.toFixed(1)} oscilações/segundo) • Desvio: ${sign}${detuneCents.toFixed(1)} cents`, 12, 18);
        }
    }

    function generateEarChallenge() {
        stopEarTrainerAudio();

        const inst = INSTRUMENTS[state.instrumentId];
        const numCourses = inst.courses.length;
        let cIdx = state.earTrainer.selectedCourseIdx;
        if (cIdx < 0 || cIdx >= numCourses) {
            // Sorteio aleatório entre os pares disponíveis
            cIdx = Math.floor(Math.random() * numCourses);
        }

        const diff = state.earTrainer.difficulty || 'intermediate';
        let detune = 0;
        const isTunedChance = diff === 'legendary' ? 0.20 : 0.25;
        const rollTuned = Math.random() < isTunedChance;

        if (!rollTuned) {
            let minC = 12;
            let maxC = 25;
            if (diff === 'beginner') { minC = 25; maxC = 45; }
            else if (diff === 'advanced') { minC = 5; maxC = 12; }
            else if (diff === 'legendary') { minC = 1.5; maxC = 4.8; }

            const val = minC + Math.random() * (maxC - minC);
            const sign = Math.random() < 0.5 ? -1 : 1;
            detune = parseFloat((sign * val).toFixed(1));
        }

        state.earTrainer.challengeActive = true;
        state.earTrainer.challengeCourseIdx = cIdx;
        state.earTrainer.challengeDetuneCents = detune;
        state.earTrainer.challengeUserGuess = null;
        state.earTrainer.challengeRevealed = false;
        state.earTrainer.challengeIsCorrect = false;

        saveViolaState();
        renderEarTrainerPanel();

        // Toca automaticamente o par desafiado
        playEarTrainerSound({
            courseIdx: cIdx,
            detuneCents: detune,
            soundType: state.earTrainer.soundType
        });
    }

    function submitEarChallengeAnswer(choice) {
        if (!state.earTrainer.challengeActive || state.earTrainer.challengeRevealed) return;

        const detune = state.earTrainer.challengeDetuneCents;
        let correctChoice = 'tuned';
        if (detune < -2.0) correctChoice = 'flat';
        else if (detune > 2.0) correctChoice = 'sharp';

        const isCorrect = (choice === correctChoice);
        state.earTrainer.challengeUserGuess = choice;
        state.earTrainer.challengeRevealed = true;
        state.earTrainer.challengeIsCorrect = isCorrect;
        state.earTrainer.totalTested++;

        if (isCorrect) {
            state.earTrainer.correctCount++;
            state.earTrainer.streak++;
            if (state.earTrainer.streak > state.earTrainer.bestStreak) {
                state.earTrainer.bestStreak = state.earTrainer.streak;
            }

            const diff = state.earTrainer.difficulty;
            let basePts = 15;
            if (diff === 'beginner') basePts = 10;
            else if (diff === 'advanced') basePts = 25;
            else if (diff === 'legendary') basePts = 40;

            const streakBonus = Math.min(25, (state.earTrainer.streak - 1) * 3);
            state.earTrainer.score += (basePts + streakBonus);
        } else {
            state.earTrainer.streak = 0;
        }

        saveViolaState();
        renderEarTrainerPanel();
        renderBeatsCanvas();
    }

    function playEarComparison(variant) {
        const cIdx = state.earTrainer.challengeCourseIdx;
        const detune = state.earTrainer.challengeDetuneCents;

        if (variant === 'detuned') {
            playEarTrainerSound({ courseIdx: cIdx, detuneCents: detune });
        } else if (variant === 'ref') {
            playEarTrainerSound({ courseIdx: cIdx, detuneCents: 0, soloMode: 'ref' });
        } else if (variant === 'test') {
            playEarTrainerSound({ courseIdx: cIdx, detuneCents: detune, soloMode: 'test' });
        } else if (variant === 'pure') {
            playEarTrainerSound({ courseIdx: cIdx, detuneCents: 0, soloMode: 'pure' });
        }
    }

    function startPegChallenge() {
        stopEarTrainerAudio();

        const inst = INSTRUMENTS[state.instrumentId];
        const numCourses = inst.courses.length;
        let cIdx = state.earTrainer.selectedCourseIdx;
        if (cIdx < 0 || cIdx >= numCourses) cIdx = 2; // Padrão Turina

        // Sorteia um desvio alvo entre -38 e +38 cents (fora de [-6, 6] para desafiar)
        const sign = Math.random() < 0.5 ? -1 : 1;
        const mag = 10 + Math.random() * 28;
        const targetCents = parseFloat((sign * mag).toFixed(1));

        state.earTrainer.pegCourseIdx = cIdx;
        state.earTrainer.pegTargetCents = targetCents;
        state.earTrainer.pegUserCents = 0;
        state.earTrainer.pegValidated = false;
        state.earTrainer.pegResidualError = 0;

        saveViolaState();
        renderEarTrainerPanel();

        playEarTrainerSound({
            courseIdx: cIdx,
            detuneCents: targetCents,
            soundType: state.earTrainer.soundType
        });
    }

    function adjustPegCents(delta) {
        let nextVal = state.earTrainer.pegUserCents + delta;
        nextVal = Math.max(-60, Math.min(60, parseFloat(nextVal.toFixed(1))));
        state.earTrainer.pegUserCents = nextVal;
        state.earTrainer.pegValidated = false;

        const effectiveDetune = state.earTrainer.pegTargetCents + nextVal;
        updateEarTrainerDetune(effectiveDetune);

        const valDisplay = document.getElementById('viola-ear-peg-value');
        if (valDisplay) {
            const s = nextVal > 0 ? '+' : '';
            valDisplay.textContent = `${s}${nextVal.toFixed(1)} cents`;
        }
        const slider = document.getElementById('viola-ear-peg-slider');
        if (slider) slider.value = String(nextVal);
    }

    function validatePegTuning() {
        const residual = Math.abs(state.earTrainer.pegTargetCents + state.earTrainer.pegUserCents);
        state.earTrainer.pegResidualError = parseFloat(residual.toFixed(1));
        state.earTrainer.pegValidated = true;
        state.earTrainer.totalTested++;

        if (residual <= 2.2) {
            state.earTrainer.correctCount++;
            state.earTrainer.streak++;
            if (state.earTrainer.streak > state.earTrainer.bestStreak) state.earTrainer.bestStreak = state.earTrainer.streak;
            state.earTrainer.score += 35;
        } else if (residual <= 6.0) {
            state.earTrainer.correctCount++;
            state.earTrainer.streak++;
            if (state.earTrainer.streak > state.earTrainer.bestStreak) state.earTrainer.bestStreak = state.earTrainer.streak;
            state.earTrainer.score += 20;
        } else if (residual <= 11.0) {
            state.earTrainer.correctCount++;
            state.earTrainer.score += 10;
        } else {
            state.earTrainer.streak = 0;
        }

        saveViolaState();
        renderEarTrainerPanel();
        renderBeatsCanvas();
    }

    function resetEarTrainerStats() {
        if (!confirm('Deseja realmente zerar a pontuação e histórico do Treinador Auditivo?')) return;
        state.earTrainer.score = 0;
        state.earTrainer.streak = 0;
        state.earTrainer.bestStreak = 0;
        state.earTrainer.totalTested = 0;
        state.earTrainer.correctCount = 0;
        saveViolaState();
        renderEarTrainerPanel();
    }

    function updateEarTrainerPlayButtons() {
        const toggleBtn = document.getElementById('btn-viola-ear-audio-toggle');
        if (!toggleBtn) return;
        if (earAudioNodes.isPlaying) {
            toggleBtn.className = 'min-h-[40px] px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-rose-950/40';
            toggleBtn.innerHTML = '<i data-lucide="square" class="w-4 h-4"></i><span>Parar Áudio</span>';
        } else {
            toggleBtn.className = 'min-h-[40px] px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition';
            toggleBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4"></i><span>Ouvir Par</span>';
        }
        if (global.VaultCore && global.VaultCore.refreshIcons) global.VaultCore.refreshIcons(toggleBtn);
    }

    function renderEarTrainerPanel() {
        const panel = document.getElementById('viola-ear-trainer-panel');
        if (!panel) return;

        const inst = INSTRUMENTS[state.instrumentId];
        const isPaired = inst.isPaired;
        const trainer = state.earTrainer;
        const rank = getEarTrainerRank(trainer.score);
        const accuracyPct = trainer.totalTested > 0
            ? Math.round((trainer.correctCount / trainer.totalTested) * 100)
            : 0;

        const isChallenge = trainer.mode === 'challenge';
        const isPeg = trainer.mode === 'peg';

        panel.innerHTML = `
            <!-- Topo do Módulo & Chaveador de Modo -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                    <div class="flex flex-wrap items-center gap-2">
                        <div class="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/35 flex items-center justify-center text-cyan-300">
                            <i data-lucide="headphones" class="w-4 h-4"></i>
                        </div>
                        <h3 class="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Treinador Auditivo de Afinação &amp; Pares Oitavados</h3>
                        <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Acústica de Batimentos Ondulatórios</span>
                    </div>
                    <p class="text-xs text-slate-400 mt-1">Treine o ouvido absoluto e relativo para detectar microtons em cents e identificar a ressonância pura entre bordões e cantadeiras na Viola e Violão.</p>
                </div>

                <div class="flex flex-wrap items-center gap-2">
                    <div class="inline-flex rounded-lg bg-[#090d16] border border-slate-700 p-0.5" role="group">
                        <button type="button" id="btn-viola-ear-mode-challenge" class="px-3 py-1.5 text-xs font-mono rounded-md font-semibold transition ${isChallenge ? 'bg-cyan-600 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'}">
                            🎯 Desafio Auditivo Cego
                        </button>
                        <button type="button" id="btn-viola-ear-mode-peg" class="px-3 py-1.5 text-xs font-mono rounded-md font-semibold transition ${isPeg ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'}">
                            🔧 Cravelha Manual (Simulador)
                        </button>
                    </div>

                    <button type="button" id="btn-viola-ear-audio-toggle" class="min-h-[40px] px-3.5 py-1.5 rounded-lg ${earAudioNodes.isPlaying ? 'bg-rose-600 text-white' : 'bg-cyan-600 text-slate-950'} font-mono text-xs font-bold flex items-center gap-1.5 transition">
                        <i data-lucide="${earAudioNodes.isPlaying ? 'square' : 'play'}" class="w-4 h-4"></i>
                        <span>${earAudioNodes.isPlaying ? 'Parar Áudio' : 'Ouvir Par'}</span>
                    </button>
                </div>
            </div>

            <!-- Placar de Maestria do Violeiro & Métricas -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#090d16] border border-slate-800 rounded-xl p-3.5">
                <div class="space-y-1">
                    <div class="text-[10px] font-mono uppercase tracking-wider text-slate-500">Patente do Violeiro</div>
                    <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded text-xs font-bold font-mono border ${rank.colorClass}">${rank.badge}</span>
                        <span class="text-xs font-semibold text-slate-200 truncate">${rank.title}</span>
                    </div>
                    <div class="text-[10px] text-slate-400 font-mono mt-1">${rank.nextGoal}</div>
                </div>

                <div class="space-y-1">
                    <div class="text-[10px] font-mono uppercase tracking-wider text-slate-500">Pontuação Total</div>
                    <div class="text-xl font-bold font-mono text-cyan-300">${trainer.score} <span class="text-xs font-normal text-slate-400">pts</span></div>
                    <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                        <div class="bg-cyan-400 h-full transition-all duration-300" style="width: ${rank.progressPct}%"></div>
                    </div>
                </div>

                <div class="space-y-1">
                    <div class="text-[10px] font-mono uppercase tracking-wider text-slate-500">Sequência Atual (Streak)</div>
                    <div class="text-xl font-bold font-mono ${trainer.streak > 2 ? 'text-amber-400' : 'text-slate-200'} flex items-center gap-1">
                        <span>${trainer.streak > 0 ? `🔥 ${trainer.streak}` : '0'}</span>
                        <span class="text-xs font-normal text-slate-500">acertos seguidos</span>
                    </div>
                    <div class="text-[10px] font-mono text-slate-400">Recorde Histórico: <strong class="text-slate-200">${trainer.bestStreak}</strong></div>
                </div>

                <div class="space-y-1 flex flex-col justify-between">
                    <div>
                        <div class="text-[10px] font-mono uppercase tracking-wider text-slate-500">Precisão Auditiva</div>
                        <div class="text-xl font-bold font-mono text-emerald-400">${accuracyPct}% <span class="text-xs font-normal text-slate-500">(${trainer.correctCount}/${trainer.totalTested})</span></div>
                    </div>
                    <div class="text-right">
                        <button type="button" id="btn-viola-ear-reset-stats" class="text-[10px] font-mono text-slate-500 hover:text-rose-400 underline transition">Zerar Estatísticas</button>
                    </div>
                </div>
            </div>

            <!-- Seletores de Configuração (Par, Dificuldade e Timbre) -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-[#090d16] border border-slate-800/80 rounded-xl p-3">
                <div>
                    <label class="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">Par / Corda Alvo</label>
                    <select id="viola-ear-course-select" class="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#0f172a] border border-slate-700 text-xs font-mono text-slate-200 focus:border-cyan-500">
                        <option value="-1" ${trainer.selectedCourseIdx === -1 ? 'selected' : ''}>🎲 Qualquer Par (Sorteio Aleatório)</option>
                        ${inst.courses.map((c, idx) => {
                            const desc = c.octaved ? 'Oitavado (Bordão + Requinta)' : 'Uníssono Puro';
                            return `<option value="${idx}" ${trainer.selectedCourseIdx === idx ? 'selected' : ''}>${c.label} — ${c.note} (${desc})</option>`;
                        }).join('')}
                    </select>
                </div>

                <div>
                    <label class="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">Dificuldade Perceptiva</label>
                    <select id="viola-ear-diff-select" class="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#0f172a] border border-slate-700 text-xs font-mono text-slate-200 focus:border-cyan-500">
                        <option value="beginner" ${trainer.difficulty === 'beginner' ? 'selected' : ''}>🌾 Iniciante (±25 a ±45 cents)</option>
                        <option value="intermediate" ${trainer.difficulty === 'intermediate' ? 'selected' : ''}>🐂 Boiadeiro (±12 a ±25 cents)</option>
                        <option value="advanced" ${trainer.difficulty === 'advanced' ? 'selected' : ''}>🪕 Mestre Violeiro (±5 a ±12 cents)</option>
                        <option value="legendary" ${trainer.difficulty === 'legendary' ? 'selected' : ''}>👑 Tião Carreiro (±1.5 a ±5 cents)</option>
                    </select>
                </div>

                <div>
                    <label class="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">Emissão Acústica</label>
                    <select id="viola-ear-sound-select" class="w-full min-h-[38px] px-2.5 py-1.5 rounded-lg bg-[#0f172a] border border-slate-700 text-xs font-mono text-slate-200 focus:border-cyan-500">
                        <option value="pluck" ${trainer.soundType === 'pluck' ? 'selected' : ''}>🪕 Dedilhado Periódico Caipira (Pluck)</option>
                        <option value="drone" ${trainer.soundType === 'drone' ? 'selected' : ''}>🔊 Ressonância Contínua (Drone)</option>
                    </select>
                </div>
            </div>

            <!-- Visualizador Osciloscópico de Batimentos Acústicos -->
            <div class="space-y-1.5">
                <div class="flex items-center justify-between text-[11px] font-mono">
                    <span class="text-slate-400">Interferência Ondulatória Acústica:</span>
                    <span class="text-slate-500">Batimento = |f₁ - f₂| • Modulação de Envoltória</span>
                </div>
                <div class="relative w-full rounded-lg overflow-hidden border border-slate-800 bg-[#070b12]">
                    <canvas id="viola-beats-canvas" width="680" height="110" class="w-full h-[110px] block"></canvas>
                </div>
            </div>

            <!-- CONTEÚDO ESPECÍFICO DO MODO SELECIONADO -->
            ${isChallenge ? renderChallengeBody(trainer, inst) : renderPegBody(trainer, inst)}
        `;

        bindEarTrainerEvents(panel);
        renderBeatsCanvas();
        if (global.VaultCore && global.VaultCore.refreshIcons) global.VaultCore.refreshIcons(panel);
    }

    function renderChallengeBody(trainer, inst) {
        const activeCourse = inst.courses[trainer.challengeCourseIdx] || inst.courses[2];
        const isOctaved = inst.isPaired && activeCourse.octaved;
        const octDesc = isOctaved
            ? 'Par Oitavado (Bordão grave vs Cantadeira fina)'
            : 'Par Uníssono (Duas cordas na mesma altura)';

        return `
            <div class="bg-[#090d16] border border-slate-800 rounded-xl p-4 space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                                Desafio Auditivo Cego
                            </span>
                            <span class="text-xs font-mono text-slate-300">Par: <strong class="text-cyan-300">${activeCourse.label}</strong> (${activeCourse.note})</span>
                        </div>
                        <p class="text-[11px] text-slate-400 mt-1">${octDesc} — Ouça a oscilação acústica e determine se a corda móvel está abaixo, afinada ou acima.</p>
                    </div>

                    <button type="button" id="btn-viola-ear-new-challenge" class="min-h-[40px] px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition shrink-0">
                        <i data-lucide="sparkles" class="w-4 h-4"></i>
                        <span>Novo Desafio de Ouvido</span>
                    </button>
                </div>

                ${!trainer.challengeActive ? `
                    <div class="text-center py-6 space-y-2">
                        <p class="text-xs font-mono text-slate-400">Pressione o botão acima para iniciar um novo desafio auditivo às cegas.</p>
                        <p class="text-[11px] text-slate-500">O sistema gerará uma desafinação controlada em microtons e tocará o par.</p>
                    </div>
                ` : `
                    <!-- Botões de Resposta do Teste Cego -->
                    <div class="space-y-2">
                        <div class="text-xs font-mono text-slate-300 font-semibold text-center sm:text-left">
                            Qual é o estado de afinação da corda móvel?
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <button type="button" data-ear-guess="flat" ${trainer.challengeRevealed ? 'disabled' : ''}
                                class="min-h-[50px] px-3 py-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-0.5 ${
                                    trainer.challengeRevealed
                                        ? (trainer.challengeDetuneCents < -2.0 ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-600 opacity-60')
                                        : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 hover:border-cyan-400 text-slate-200'
                                }">
                                <span class="text-base font-bold text-sky-400">🔻 Abaixo do Tom</span>
                                <span class="text-[10px] font-mono text-slate-400">Flat / Grave (Desafinado para baixo)</span>
                            </button>

                            <button type="button" data-ear-guess="tuned" ${trainer.challengeRevealed ? 'disabled' : ''}
                                class="min-h-[50px] px-3 py-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-0.5 ${
                                    trainer.challengeRevealed
                                        ? (Math.abs(trainer.challengeDetuneCents) <= 2.0 ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-600 opacity-60')
                                        : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 hover:border-emerald-400 text-slate-200'
                                }">
                                <span class="text-base font-bold text-emerald-400">🎯 Consonância Pura</span>
                                <span class="text-[10px] font-mono text-slate-400">In Tune (Perfeitamente Afinado • 0 batimentos)</span>
                            </button>

                            <button type="button" data-ear-guess="sharp" ${trainer.challengeRevealed ? 'disabled' : ''}
                                class="min-h-[50px] px-3 py-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-0.5 ${
                                    trainer.challengeRevealed
                                        ? (trainer.challengeDetuneCents > 2.0 ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-600 opacity-60')
                                        : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 hover:border-rose-400 text-slate-200'
                                }">
                                <span class="text-base font-bold text-amber-400">🔺 Acima do Tom</span>
                                <span class="text-[10px] font-mono text-slate-400">Sharp / Agudo (Desafinado para cima)</span>
                            </button>
                        </div>
                    </div>

                    <!-- Feedback Detalhado & Escuta Comparativa -->
                    ${trainer.challengeRevealed ? `
                        <div class="bg-[#0f172a] border ${trainer.challengeIsCorrect ? 'border-emerald-500/40 bg-emerald-950/15' : 'border-rose-500/40 bg-rose-950/15'} rounded-xl p-4 space-y-3">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="text-lg">${trainer.challengeIsCorrect ? '🎯' : '❌'}</span>
                                    <div>
                                        <div class="text-xs font-bold font-mono ${trainer.challengeIsCorrect ? 'text-emerald-300' : 'text-rose-300'}">
                                            ${trainer.challengeIsCorrect ? 'Parabéns, resposta exata!' : 'Não foi dessa vez! Continue apurando seu ouvido.'}
                                        </div>
                                        <div class="text-[11px] text-slate-300 mt-0.5">
                                            Desvio real medido: <strong class="font-mono ${trainer.challengeDetuneCents > 0 ? 'text-amber-300' : (trainer.challengeDetuneCents < 0 ? 'text-sky-300' : 'text-emerald-300')}">
                                                ${trainer.challengeDetuneCents > 0 ? '+' : ''}${trainer.challengeDetuneCents.toFixed(1)} cents
                                            </strong>
                                            • Frequência de Batimento: <strong class="font-mono text-cyan-300">${calculateBeatFrequency(trainer.challengeCourseIdx, trainer.challengeDetuneCents).toFixed(1)} Hz</strong>
                                        </div>
                                    </div>
                                </div>

                                <button type="button" id="btn-viola-ear-next-challenge" class="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition">
                                    <span>Próximo Desafio</span>
                                    <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                                </button>
                            </div>

                            <!-- Botões de Escuta Comparativa Ponto a Ponto -->
                            <div class="pt-2 border-t border-slate-800/80">
                                <div class="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">Laboratório de Escuta Comparativa:</div>
                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    <button type="button" data-ear-compare="detuned" class="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition text-center">
                                        🎧 Par Desafinado
                                    </button>
                                    <button type="button" data-ear-compare="ref" class="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition text-center">
                                        🎵 Só Bordão Puro
                                    </button>
                                    <button type="button" data-ear-compare="test" class="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition text-center">
                                        🪕 Só Cantadeira
                                    </button>
                                    <button type="button" data-ear-compare="pure" class="min-h-[36px] px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-mono text-emerald-200 transition text-center font-bold">
                                        ✨ Consonância Pura
                                    </button>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                `}
            </div>
        `;
    }

    function renderPegBody(trainer, inst) {
        const activeCourse = inst.courses[trainer.pegCourseIdx] || inst.courses[2];
        const isOctaved = inst.isPaired && activeCourse.octaved;
        const currentDetune = trainer.pegTargetCents + trainer.pegUserCents;
        const sign = trainer.pegUserCents > 0 ? '+' : '';
        const handAdvice = state.isLeftHanded
            ? 'Ergonomia Canhota: Mão Direita apoia o braço e gira a cravelha no topo; Mão Esquerda dedilha no tampo.'
            : 'Ergonomia Destra: Mão Esquerda apoia o braço e gira a cravelha; Mão Direita dedilha no tampo.';

        return `
            <div class="bg-[#090d16] border border-slate-800 rounded-xl p-4 space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                Simulador de Cravelha Manual
                            </span>
                            <span class="text-xs font-mono text-slate-300">Afinando: <strong class="text-amber-300">${activeCourse.label}</strong> (${activeCourse.note})</span>
                        </div>
                        <p class="text-[11px] text-slate-400 mt-1">${handAdvice}</p>
                    </div>

                    <button type="button" id="btn-viola-ear-new-peg" class="min-h-[40px] px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition shrink-0">
                        <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                        <span>Desafinar Corda Aleatoriamente</span>
                    </button>
                </div>

                <!-- Controle Tátil da Cravelha -->
                <div class="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <span class="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">Giro da Cravelha (Apertar / Soltar)</span>
                            <p class="text-[11px] text-slate-400">Gire a cravelha até que a modulação do batimento desacelere e atinja consonância cristalina pura.</p>
                        </div>
                        <div class="text-right">
                            <span class="text-[10px] font-mono text-slate-400 uppercase">Compensação Aplicada:</span>
                            <div id="viola-ear-peg-value" class="text-lg font-mono font-bold text-amber-300">${sign}${trainer.pegUserCents.toFixed(1)} cents</div>
                        </div>
                    </div>

                    <!-- Slider de Ajuste Contínuo -->
                    <input type="range" id="viola-ear-peg-slider" min="-60" max="60" step="0.5" value="${trainer.pegUserCents}"
                        class="w-full accent-amber-400 cursor-pointer">

                    <!-- Botões de Micro-Ajuste em Cents -->
                    <div class="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                        <div class="flex flex-wrap items-center gap-1.5">
                            <button type="button" data-peg-delta="-5" class="min-h-[36px] px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-mono text-xs text-slate-200 transition">−5 cents</button>
                            <button type="button" data-peg-delta="-1" class="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-mono text-xs text-slate-200 transition">−1</button>
                            <button type="button" id="btn-peg-zero" class="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-mono text-xs text-slate-400 transition">0 (Centro)</button>
                            <button type="button" data-peg-delta="1" class="min-h-[36px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-mono text-xs text-slate-200 transition">+1</button>
                            <button type="button" data-peg-delta="5" class="min-h-[36px] px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 font-mono text-xs text-slate-200 transition">+5 cents</button>
                        </div>

                        <button type="button" id="btn-viola-ear-validate-peg" class="min-h-[40px] px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition">
                            <i data-lucide="check-check" class="w-4 h-4"></i>
                            <span>Travar Cravelha &amp; Validar Afinação</span>
                        </button>
                    </div>
                </div>

                <!-- Feedback de Validação da Cravelha -->
                ${trainer.pegValidated ? `
                    <div class="bg-[#0f172a] border ${trainer.pegResidualError <= 5.0 ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-amber-500/40 bg-amber-950/20'} rounded-xl p-4 space-y-2">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="text-xl">${trainer.pegResidualError <= 2.2 ? '🏆' : (trainer.pegResidualError <= 5.0 ? '✨' : '⚠️')}</span>
                                <div>
                                    <div class="text-xs font-bold font-mono ${trainer.pegResidualError <= 5.0 ? 'text-emerald-300' : 'text-amber-300'}">
                                        ${trainer.pegResidualError <= 2.2 ? 'Ouvido Absoluto de Mestre Violeiro! Consonância pura impecável.' : (trainer.pegResidualError <= 5.0 ? 'Excelente Afinação! Corda perfeitamente pronta para o ponteio.' : 'Ainda há batimento perceptível. Ajuste fino necessário.')}
                                    </div>
                                    <div class="text-[11px] text-slate-300 mt-0.5">
                                        Erro residual: <strong class="font-mono text-cyan-300">${trainer.pegResidualError} cents</strong>
                                        • Batimento resultante: <strong class="font-mono text-amber-300">${calculateBeatFrequency(trainer.pegCourseIdx, currentDetune).toFixed(1)} Hz</strong>
                                    </div>
                                </div>
                            </div>

                            <button type="button" id="btn-viola-ear-next-peg" class="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition">
                                <span>Afinar Próxima Corda</span>
                                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    function bindEarTrainerEvents(panel) {
        // Alternância de Modo (Desafio Cego vs Cravelha Manual)
        const btnChallenge = panel.querySelector('#btn-viola-ear-mode-challenge');
        const btnPeg = panel.querySelector('#btn-viola-ear-mode-peg');
        if (btnChallenge) {
            btnChallenge.addEventListener('click', () => {
                if (state.earTrainer.mode !== 'challenge') {
                    stopEarTrainerAudio();
                    state.earTrainer.mode = 'challenge';
                    saveViolaState();
                    renderEarTrainerPanel();
                }
            });
        }
        if (btnPeg) {
            btnPeg.addEventListener('click', () => {
                if (state.earTrainer.mode !== 'peg') {
                    stopEarTrainerAudio();
                    state.earTrainer.mode = 'peg';
                    saveViolaState();
                    renderEarTrainerPanel();
                }
            });
        }

        // Botão Tocar / Parar Áudio
        const btnAudioToggle = panel.querySelector('#btn-viola-ear-audio-toggle');
        if (btnAudioToggle) {
            btnAudioToggle.addEventListener('click', () => {
                if (earAudioNodes.isPlaying) {
                    stopEarTrainerAudio();
                } else {
                    if (state.earTrainer.mode === 'challenge') {
                        if (!state.earTrainer.challengeActive) {
                            generateEarChallenge();
                        } else {
                            playEarTrainerSound({
                                courseIdx: state.earTrainer.challengeCourseIdx,
                                detuneCents: state.earTrainer.challengeDetuneCents,
                                soundType: state.earTrainer.soundType
                            });
                        }
                    } else {
                        playEarTrainerSound({
                            courseIdx: state.earTrainer.pegCourseIdx,
                            detuneCents: state.earTrainer.pegTargetCents + state.earTrainer.pegUserCents,
                            soundType: state.earTrainer.soundType
                        });
                    }
                }
            });
        }

        // Seletores de Configuração
        const courseSel = panel.querySelector('#viola-ear-course-select');
        if (courseSel) {
            courseSel.addEventListener('change', (e) => {
                stopEarTrainerAudio();
                state.earTrainer.selectedCourseIdx = parseInt(e.target.value, 10);
                saveViolaState();
                renderEarTrainerPanel();
            });
        }

        const diffSel = panel.querySelector('#viola-ear-diff-select');
        if (diffSel) {
            diffSel.addEventListener('change', (e) => {
                state.earTrainer.difficulty = e.target.value;
                saveViolaState();
            });
        }

        const soundSel = panel.querySelector('#viola-ear-sound-select');
        if (soundSel) {
            soundSel.addEventListener('change', (e) => {
                state.earTrainer.soundType = e.target.value;
                saveViolaState();
                if (earAudioNodes.isPlaying) {
                    const cIdx = state.earTrainer.mode === 'challenge'
                        ? state.earTrainer.challengeCourseIdx
                        : state.earTrainer.pegCourseIdx;
                    const detune = state.earTrainer.mode === 'challenge'
                        ? state.earTrainer.challengeDetuneCents
                        : (state.earTrainer.pegTargetCents + state.earTrainer.pegUserCents);
                    playEarTrainerSound({ courseIdx: cIdx, detuneCents: detune, soundType: e.target.value });
                }
            });
        }

        // Zerar Estatísticas
        const resetBtn = panel.querySelector('#btn-viola-ear-reset-stats');
        if (resetBtn) resetBtn.addEventListener('click', resetEarTrainerStats);

        // Modo Desafio Cego
        const newChallengeBtn = panel.querySelector('#btn-viola-ear-new-challenge');
        if (newChallengeBtn) newChallengeBtn.addEventListener('click', generateEarChallenge);

        const nextChallengeBtn = panel.querySelector('#btn-viola-ear-next-challenge');
        if (nextChallengeBtn) nextChallengeBtn.addEventListener('click', generateEarChallenge);

        panel.querySelectorAll('[data-ear-guess]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const guess = btn.getAttribute('data-ear-guess');
                submitEarChallengeAnswer(guess);
            });
        });

        panel.querySelectorAll('[data-ear-compare]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const comp = btn.getAttribute('data-ear-compare');
                playEarComparison(comp);
            });
        });

        // Modo Cravelha Manual
        const newPegBtn = panel.querySelector('#btn-viola-ear-new-peg');
        if (newPegBtn) newPegBtn.addEventListener('click', startPegChallenge);

        const nextPegBtn = panel.querySelector('#btn-viola-ear-next-peg');
        if (nextPegBtn) nextPegBtn.addEventListener('click', startPegChallenge);

        const pegSlider = panel.querySelector('#viola-ear-peg-slider');
        if (pegSlider) {
            pegSlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                state.earTrainer.pegUserCents = val;
                state.earTrainer.pegValidated = false;
                const effective = state.earTrainer.pegTargetCents + val;
                updateEarTrainerDetune(effective);
                const valDisplay = panel.querySelector('#viola-ear-peg-value');
                if (valDisplay) {
                    const s = val > 0 ? '+' : '';
                    valDisplay.textContent = `${s}${val.toFixed(1)} cents`;
                }
            });
        }

        panel.querySelectorAll('[data-peg-delta]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const delta = parseFloat(btn.getAttribute('data-peg-delta'));
                adjustPegCents(delta);
            });
        });

        const zeroBtn = panel.querySelector('#btn-peg-zero');
        if (zeroBtn) {
            zeroBtn.addEventListener('click', () => {
                adjustPegCents(-state.earTrainer.pegUserCents);
            });
        }

        const validatePegBtn = panel.querySelector('#btn-viola-ear-validate-peg');
        if (validatePegBtn) validatePegBtn.addEventListener('click', validatePegTuning);
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
        } else if (state.displayMode === 'REVERSE') {
            const shape = inst.isPaired ? state.reverseFretsViola : state.reverseFretsViolao;
            const analysis = analyzeReverseChord(inst, shape);

            shape.forEach((fret, cIdx) => {
                if (fret < 0) {
                    mutedCourses.add(cIdx);
                } else {
                    const pc = (inst.courses[cIdx].pitchClass + fret) % 12;
                    let role = '•';
                    let col = '#10b981';
                    if (analysis.rootPc !== null) {
                        const interval = (pc - analysis.rootPc + 12) % 12;
                        role = getIntervalShortName(interval);
                        col = getIntervalColor(interval);
                    } else if (analysis.bassPc !== null) {
                        const interval = (pc - analysis.bassPc + 12) % 12;
                        role = getIntervalShortName(interval);
                        col = getIntervalColor(interval);
                    }
                    const isBassCourse = analysis.bassPc !== null && cIdx === (analysis.tones.find((t) => t.isBass) || {}).courseIdx;
                    activeMarkers.push({
                        courseIdx: cIdx,
                        fret,
                        label: NOTE_NAMES[pc],
                        sub: role,
                        color: col,
                        stroke: isBassCourse ? '#f59e0b' : '#090d16',
                        strokeWidth: isBassCourse ? 3.2 : 2
                    });
                }
            });
        } else if (state.displayMode === 'PONTEIO') {
            const activePt = PONTEIOS_REPERTOIRE.find((p) => p.id === state.ponteioPlayer.activeId) || PONTEIOS_REPERTOIRE[0];
            const currentStep = (state.ponteioPlayer.currentStepIdx >= 0 && activePt && activePt.steps)
                ? activePt.steps[state.ponteioPlayer.currentStepIdx]
                : (activePt && activePt.steps ? activePt.steps[0] : null);

            // 1. Marcações fantasmas com todas as notas e posições do ponteio ao longo do braço
            const ghostSeen = new Set();
            if (activePt && activePt.steps) {
                activePt.steps.forEach((st) => {
                    (st.notes || []).forEach((nt) => {
                        const key = `${nt.c}_${nt.f}`;
                        if (!ghostSeen.has(key)) {
                            ghostSeen.add(key);
                            const pc = (inst.courses[nt.c].pitchClass + nt.f) % 12;
                            activeMarkers.push({
                                courseIdx: nt.c,
                                fret: nt.f,
                                label: NOTE_NAMES[pc],
                                sub: `${nt.c + 1}ºP`,
                                color: '#475569',
                                opacity: '0.35'
                            });
                        }
                    });
                });
            }

            // 2. Marcadores luminosos do passo em execução
            if (currentStep && currentStep.notes && currentStep.notes.length > 0) {
                currentStep.notes.forEach((nt) => {
                    const pc = (inst.courses[nt.c].pitchClass + nt.f) % 12;
                    const isAgudo = nt.c === 0;
                    activeMarkers.push({
                        courseIdx: nt.c,
                        fret: nt.f,
                        label: NOTE_NAMES[pc],
                        sub: currentStep.rh || (nt.c === 0 ? 'Prima' : 'Dueto'),
                        color: isAgudo ? '#f59e0b' : '#10b981',
                        stroke: '#ffffff',
                        strokeWidth: 3.2,
                        opacity: '1'
                    });
                });
            }
        } else if (state.displayMode === 'TAB_EDITOR') {
            const activeProj = getActiveTabProject();
            const currentStep = (state.tabEditor.currentStepIdx >= 0 && activeProj && activeProj.steps)
                ? activeProj.steps[state.tabEditor.currentStepIdx]
                : (activeProj && activeProj.steps ? activeProj.steps[0] : null);

            // 1. Marcações fantasmas com todas as notas da composição ao longo do braço
            const ghostSeen = new Set();
            if (activeProj && activeProj.steps) {
                activeProj.steps.forEach((st) => {
                    (st.notes || []).forEach((nt) => {
                        if (nt.c < numCourses) {
                            const key = `${nt.c}_${nt.f}`;
                            if (!ghostSeen.has(key)) {
                                ghostSeen.add(key);
                                const pc = (inst.courses[nt.c].pitchClass + nt.f) % 12;
                                activeMarkers.push({
                                    courseIdx: nt.c,
                                    fret: nt.f,
                                    label: NOTE_NAMES[pc],
                                    sub: `${nt.c + 1}ºP`,
                                    color: '#6366f1',
                                    opacity: '0.36'
                                });
                            }
                        }
                    });
                });
            }

            // 2. Marcadores luminosos do passo em edição ativa
            if (currentStep && currentStep.notes && currentStep.notes.length > 0) {
                currentStep.notes.forEach((nt) => {
                    if (nt.c < numCourses) {
                        const pc = (inst.courses[nt.c].pitchClass + nt.f) % 12;
                        const isAgudo = nt.c === 0;
                        activeMarkers.push({
                            courseIdx: nt.c,
                            fret: nt.f,
                            label: NOTE_NAMES[pc],
                            sub: currentStep.chord || currentStep.rh || (isAgudo ? 'Prima' : 'Dueto'),
                            color: isAgudo ? '#a855f7' : '#ec4899',
                            stroke: '#ffffff',
                            strokeWidth: 3.2,
                            opacity: '1'
                        });
                    }
                });
            }
        } else if (state.displayMode === 'MODAL') {
            const modalCfg = MODAL_SCALES[state.modalTrainer.modeId] || MODAL_SCALES.lydian;
            const rootPc = state.modalTrainer.rootPc;
            const region = state.modalTrainer.regionFilter || 'FULL_NECK';
            const curStepIdx = state.modalTrainer.currentStepIdx;
            const exerciseSteps = computeModalExerciseSteps(state.modalTrainer.modeId, rootPc, state.modalTrainer.activeExerciseId, inst);
            const activeStep = (curStepIdx >= 0 && exerciseSteps && exerciseSteps[curStepIdx]) ? exerciseSteps[curStepIdx] : null;

            inst.courses.forEach((c, cIdx) => {
                for (let f = 0; f <= maxFret; f++) {
                    if (region === 'SHAPE_OPEN' && (f < 0 || f > 4)) continue;
                    if (region === 'SHAPE_MID' && (f < 4 || f > 9)) continue;
                    if (region === 'SHAPE_HIGH' && (f < 9 || f > 14)) continue;

                    const pc = (c.pitchClass + f) % 12;
                    const interval = (pc - rootPc + 12) % 12;
                    const degreeIdx = modalCfg.intervals.indexOf(interval);

                    if (degreeIdx >= 0) {
                        const degName = modalCfg.degreeNames[degreeIdx];
                        const isChar = modalCfg.characteristicIntervals.includes(interval);
                        const isRoot = interval === 0;
                        const isThird = interval === 3 || interval === 4;
                        const isFifth = interval === 7;

                        if (region === 'CHARACTERISTIC_ONLY' && !isRoot && !isChar && !isThird && !isFifth) {
                            continue;
                        }

                        const isActiveStepNote = activeStep && (
                            (activeStep.notes && activeStep.notes.some((n) => n.c === cIdx && n.f === f)) ||
                            (activeStep.c === cIdx && activeStep.f === f)
                        );

                        let color = '#818cf8';
                        let stroke = '#090d16';
                        let strokeWidth = 2;
                        let opacity = activeStep ? (isActiveStepNote ? '1' : '0.36') : '1';

                        if (isRoot) {
                            color = '#10b981';
                            stroke = '#f59e0b';
                            strokeWidth = 3.2;
                        } else if (isChar) {
                            color = '#ec4899';
                            stroke = '#ffffff';
                            strokeWidth = 3;
                        } else if (isThird) {
                            color = '#06b6d4';
                        } else if (isFifth) {
                            color = '#f59e0b';
                        }

                        if (isActiveStepNote) {
                            stroke = '#ffffff';
                            strokeWidth = 3.8;
                            opacity = '1';
                        }

                        activeMarkers.push({
                            courseIdx: cIdx,
                            fret: f,
                            label: NOTE_NAMES[pc],
                            sub: isChar ? `★${degName}` : degName,
                            color,
                            stroke,
                            strokeWidth,
                            opacity
                        });
                    }
                }
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
            const strk = mk.stroke || '#090d16';
            const strkW = mk.strokeWidth || '2';
            markersSvg += `
                <g opacity="${op}" class="pointer-events-none">
                    <circle cx="${cx}" cy="${cy}" r="13.5" fill="${mk.color}" stroke="${strk}" stroke-width="${strkW}"/>
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

                if (state.displayMode === 'REVERSE') {
                    const arr = inst.isPaired ? state.reverseFretsViola : state.reverseFretsViolao;
                    arr[cIdx] = arr[cIdx] === f ? -1 : f;
                    saveViolaState();
                    renderFretboardSVG();
                    renderReverseChordPanel();
                } else if (state.displayMode === 'TAB_EDITOR') {
                    toggleTabEditorNote(cIdx, f);
                }
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

    function renderReverseChordPanel() {
        const analysisContainer = document.getElementById('viola-reverse-analysis-container');
        const selectorsContainer = document.getElementById('viola-reverse-course-selectors');
        const presetsContainer = document.getElementById('viola-reverse-presets-container');
        if (!analysisContainer || !selectorsContainer || !presetsContainer) return;

        const inst = INSTRUMENTS[state.instrumentId];
        const shape = inst.isPaired ? state.reverseFretsViola : state.reverseFretsViolao;
        const analysis = analyzeReverseChord(inst, shape);

        // 1. Diagnóstico do Acorde
        let tonesHtml = '';
        if (analysis.tones && analysis.tones.length > 0) {
            tonesHtml = `
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
                    ${analysis.tones.map((t) => `
                        <div class="px-2 py-1.5 rounded-lg bg-[#0f172a] border ${t.isBass ? 'border-amber-500/50' : 'border-slate-800'} text-xs font-mono flex items-center justify-between">
                            <div class="flex items-center gap-1.5">
                                <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${t.color}"></span>
                                <span class="font-bold text-slate-100">${t.noteName}</span>
                                ${t.isBass ? '<span class="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 font-sans font-semibold">Baixo</span>' : ''}
                            </div>
                            <span class="text-[10px] text-slate-400 font-semibold">${t.role}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            tonesHtml = `<p class="text-xs text-slate-500 italic">Nenhuma nota ativa nas cordas.</p>`;
        }

        let keyFuncHtml = '';
        if (analysis.keyFunctions && analysis.keyFunctions.length > 0) {
            keyFuncHtml = `
                <div class="space-y-1.5 pt-2 border-t border-slate-800/80">
                    <span class="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">Contexto nas Tonalidades Caipiras:</span>
                    <div class="grid grid-cols-1 gap-1.5">
                        ${analysis.keyFunctions.map((kf) => `
                            <div class="flex items-center justify-between px-2.5 py-1 rounded-md bg-[#0f172a] border border-slate-800 text-[11px] font-mono">
                                <span class="${kf.nativa ? 'text-emerald-300 font-bold' : 'text-slate-300'}">${kf.keyName}</span>
                                <div class="flex items-center gap-2">
                                    <span class="px-1.5 py-0.5 rounded border font-bold ${kf.badgeCol}">${kf.roman}</span>
                                    <span class="text-[10px] text-slate-400 hidden sm:inline">${kf.role.split('(')[0]}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        let altHtml = '';
        if (analysis.alternatives && analysis.alternatives.length > 0) {
            altHtml = `
                <div class="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <span class="text-slate-500">Alternativas / Enarmonias:</span>
                    ${analysis.alternatives.map((a) => `
                        <span class="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300" title="${a.desc}">${a.chordName}</span>
                    `).join('')}
                </div>
            `;
        }

        const isReversedMode = state.displayMode === 'REVERSE';

        analysisContainer.innerHTML = `
            <div class="space-y-3">
                <div class="flex items-start justify-between gap-2">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">Acorde Deduzido</span>
                            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">${analysis.inversionLabel || 'Fundamental'}</span>
                        </div>
                        <h3 class="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-300 tracking-tight mt-1">${analysis.chordName}</h3>
                        <p class="text-xs text-slate-300 font-medium">${analysis.chordNamePT}</p>
                    </div>
                    <div class="text-right">
                        <span class="text-[10px] font-mono text-slate-500 block">Qualidade Harmônica</span>
                        <span class="text-xs font-mono font-bold text-amber-300">${analysis.tension || 'Harmonia Aberta'}</span>
                    </div>
                </div>

                <p class="text-xs text-slate-400 leading-relaxed">${analysis.details}</p>

                <div class="space-y-1">
                    <span class="text-[11px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">Notas Formadoras & Intervalos:</span>
                    ${tonesHtml}
                </div>

                ${keyFuncHtml}
                ${altHtml}
            </div>
        `;

        // 2. Seletores por Corda / Par
        selectorsContainer.innerHTML = inst.courses.map((c, cIdx) => {
            const currentFret = shape[cIdx];
            const isMuted = currentFret < 0;
            const currentPc = isMuted ? null : (c.pitchClass + currentFret) % 12;
            const currentNote = isMuted ? 'Abafada' : `${NOTE_NAMES[currentPc]} (${NOTE_NAMES_PT[currentPc]})`;

            const fretOptions = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

            return `
                <div class="bg-[#0f172a] border border-slate-800 rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div class="flex items-center justify-between sm:w-44">
                        <span class="text-xs font-mono font-bold ${isMuted ? 'text-rose-400' : 'text-slate-200'}">${c.label}</span>
                        <span class="text-[11px] font-mono ${isMuted ? 'text-rose-400/80' : 'text-cyan-400 font-semibold'}">${isMuted ? '✕ Mudo' : currentNote}</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-1">
                        ${fretOptions.map((f) => {
                            const isSelected = currentFret === f;
                            let btnClass = 'w-7 h-7 text-[11px] font-mono rounded flex items-center justify-center font-bold transition ';
                            if (f === -1) {
                                btnClass += isSelected
                                    ? 'bg-rose-600 text-white shadow'
                                    : 'bg-slate-900 border border-slate-800 text-rose-400 hover:bg-slate-800';
                            } else if (f === 0) {
                                btnClass += isSelected
                                    ? 'bg-cyan-600 text-slate-950 shadow'
                                    : 'bg-slate-900 border border-slate-800 text-cyan-300 hover:bg-slate-800';
                            } else {
                                btnClass += isSelected
                                    ? 'bg-emerald-600 text-slate-950 shadow'
                                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800';
                            }
                            return `
                                <button type="button" data-reverse-course="${cIdx}" data-reverse-fret="${f}" class="${btnClass}">
                                    ${f === -1 ? 'X' : f}
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');

        selectorsContainer.querySelectorAll('[data-reverse-course]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const cIdx = parseInt(btn.getAttribute('data-reverse-course'), 10);
                const fret = parseInt(btn.getAttribute('data-reverse-fret'), 10);
                const arr = inst.isPaired ? state.reverseFretsViola : state.reverseFretsViolao;
                arr[cIdx] = fret;
                state.displayMode = 'REVERSE';
                saveViolaState();
                if (fret >= 0) {
                    playCourseAtFret(cIdx, fret, 0);
                    flashFretCell(cIdx, fret, 0);
                }
                renderFretboardSVG();
                renderReverseChordPanel();
            });
        });

        // 3. Presets Curados
        const presets = REVERSE_PRESETS[state.instrumentId] || REVERSE_PRESETS.viola_cebolao_e;
        presetsContainer.innerHTML = presets.map((p, idx) => `
            <button type="button" data-reverse-preset="${idx}" class="p-2 rounded-lg bg-[#0f172a] border border-slate-800 hover:border-amber-500/50 text-left transition group">
                <div class="text-xs font-bold font-mono text-slate-200 group-hover:text-amber-300 transition">${p.name}</div>
                <div class="text-[10px] text-slate-400 truncate mt-0.5">${p.desc}</div>
            </button>
        `).join('');

        presetsContainer.querySelectorAll('[data-reverse-preset]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-reverse-preset'), 10);
                const p = presets[idx];
                if (p && p.shape) {
                    loadReversePreset(p.shape);
                }
            });
        });

        const toFretBtn = document.getElementById('btn-viola-reverse-to-fretboard');
        if (toFretBtn) {
            toFretBtn.className = isReversedMode
                ? 'min-h-[40px] px-3.5 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-400 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition shadow'
                : 'min-h-[40px] px-3.5 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center gap-1.5 transition';
            toFretBtn.innerHTML = isReversedMode
                ? `<i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i><span>Ativo no Braço</span>`
                : `<i data-lucide="eye" class="w-4 h-4 text-cyan-400"></i><span>Editar no Braço</span>`;
        }

        if (global.VaultCore && global.VaultCore.refreshIcons) {
            global.VaultCore.refreshIcons(analysisContainer);
            if (toFretBtn) global.VaultCore.refreshIcons(toFretBtn);
        }
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
            if (!Array.isArray(state.reverseFretsViola) || state.reverseFretsViola.length !== 5) {
                state.reverseFretsViola = [0, 0, 0, 0, 0];
            }
            if (!Array.isArray(state.reverseFretsViolao) || state.reverseFretsViolao.length !== 6) {
                state.reverseFretsViolao = [0, 0, 1, 2, 2, 0];
            }
            if (saved.earTrainer && typeof saved.earTrainer === 'object') {
                state.earTrainer = Object.assign({}, DEFAULT_EAR_TRAINER_STATE, saved.earTrainer);
            } else {
                state.earTrainer = Object.assign({}, DEFAULT_EAR_TRAINER_STATE);
            }
            // Reseta variáveis transitórias de sessão do treinador auditivo
            state.earTrainer.challengeActive = false;
            state.earTrainer.challengeRevealed = false;
            state.earTrainer.pegValidated = false;

            if (saved.ponteioPlayer && typeof saved.ponteioPlayer === 'object') {
                state.ponteioPlayer = Object.assign({}, DEFAULT_PONTEIO_PLAYER_STATE, saved.ponteioPlayer, {
                    isPlaying: false,
                    currentStepIdx: -1
                });
            } else {
                state.ponteioPlayer = Object.assign({}, DEFAULT_PONTEIO_PLAYER_STATE);
            }

            if (saved.tabEditor && typeof saved.tabEditor === 'object') {
                state.tabEditor = Object.assign({}, DEFAULT_TAB_EDITOR_STATE, saved.tabEditor, {
                    isPlaying: false
                });
                if (!Array.isArray(state.tabEditor.projects) || state.tabEditor.projects.length === 0) {
                    state.tabEditor.projects = JSON.parse(JSON.stringify(DEFAULT_TAB_EDITOR_PROJECTS));
                }
            } else {
                state.tabEditor = Object.assign({}, DEFAULT_TAB_EDITOR_STATE, {
                    projects: JSON.parse(JSON.stringify(DEFAULT_TAB_EDITOR_PROJECTS))
                });
            }

            if (saved.modalTrainer && typeof saved.modalTrainer === 'object') {
                state.modalTrainer = Object.assign({}, DEFAULT_MODAL_TRAINER_STATE, saved.modalTrainer, {
                    isPlaying: false,
                    currentStepIdx: -1
                });
            } else {
                state.modalTrainer = Object.assign({}, DEFAULT_MODAL_TRAINER_STATE);
            }

            if (saved.tensionCalculator && typeof saved.tensionCalculator === 'object') {
                state.tensionCalculator = Object.assign({}, DEFAULT_TENSION_STATE, saved.tensionCalculator);
            } else {
                state.tensionCalculator = Object.assign({}, DEFAULT_TENSION_STATE);
            }
        }
    }

    function saveViolaState() {
        const C = global.VaultCore;
        const copy = Object.assign({}, state);
        delete copy.activeDuadStepIdx;
        delete copy.progressionPlaying;
        delete copy.progressionStepIdx;
        delete copy.activeRhythmStepIdx;
        if (copy.ponteioPlayer) {
            copy.ponteioPlayer = Object.assign({}, copy.ponteioPlayer, {
                isPlaying: false,
                currentStepIdx: -1
            });
        }
        if (copy.tabEditor) {
            copy.tabEditor = Object.assign({}, copy.tabEditor, {
                isPlaying: false
            });
        }
        if (copy.modalTrainer) {
            copy.modalTrainer = Object.assign({}, copy.modalTrainer, {
                isPlaying: false,
                currentStepIdx: -1
            });
        }
        if (copy.tensionCalculator) {
            copy.tensionCalculator = Object.assign({}, copy.tensionCalculator);
        }
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
                            <option value="viola_cebolao_e">Viola — Cebolão em Mi (E-B-G#-E-B)</option>
                            <option value="viola_cebolao_d">Viola — Cebolão em Ré (D-A-F#-D-A)</option>
                            <option value="viola_rio_abaixo">Viola — Rio Abaixo (D-B-G-D-G)</option>
                            <option value="viola_boiadeira">Viola — Boiadeira (D-A-F#-D-G)</option>
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

                        <button type="button" id="btn-viola-scroll-tension" class="min-h-[44px] px-3.5 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition">
                            <i data-lucide="scale" class="w-4 h-4 text-emerald-400"></i>
                            <span>Tensão &amp; Ação (Fase 9)</span>
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

                <!-- Treinador Auditivo de Afinação & Pares Oitavados (Fase 5) -->
                <div id="viola-ear-trainer-panel" class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-4"></div>

                <!-- Braço Interativo SVG -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-3 sm:p-4 space-y-3">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 pb-2 border-b border-slate-800">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">Projeção no Braço:</span>
                            <div class="inline-flex rounded-lg bg-[#090d16] border border-slate-700 p-0.5" role="group">
                                <button type="button" id="btn-viola-mode-chord" class="px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold transition text-slate-400 hover:text-slate-200">🎵 Campo Harmônico</button>
                                <button type="button" id="btn-viola-mode-duad" class="px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold transition text-slate-400 hover:text-slate-200">🪕 Escalas Duadas</button>
                                <button type="button" id="btn-viola-mode-reverse" class="px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold transition text-slate-400 hover:text-slate-200">🔍 Buscador Reverso</button>
                                <button type="button" id="btn-viola-mode-ponteio" class="px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold transition text-slate-400 hover:text-slate-200">🎼 Tablatura &amp; Ponteios</button>
                                <button type="button" id="btn-viola-mode-tab-editor" class="px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold transition text-slate-400 hover:text-slate-200">📝 Editor de Tablatura</button>
                                <button type="button" id="btn-viola-mode-modal" class="px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold transition text-slate-400 hover:text-slate-200">🌟 Modos Caipiras</button>
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                            <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Tônica</span>
                            <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>Nota Caract.</span>
                            <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>Terça</span>
                            <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>Quinta</span>
                            <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-purple-500"></span>Sétima / Sexta</span>
                            <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-violet-500"></span>Editor</span>
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

                <!-- Módulo de Dicionário & Buscador Reverso de Acordes (Canhoto & Destro) -->
                <div class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 space-y-4">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3 border-b border-slate-800">
                        <div>
                            <div class="flex items-center gap-2">
                                <i data-lucide="compass" class="w-4 h-4 text-emerald-400"></i>
                                <h3 class="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">Dicionário & Buscador Reverso de Acordes</h3>
                                <span class="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">Análise Harmônica Algorítmica</span>
                            </div>
                            <p class="text-xs text-slate-400 mt-0.5">Monte qualquer digitação nas cordas ou clique diretamente no braço. O motor deduz o nome do acorde, inversões, notas formadoras e função modal caipira.</p>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <button type="button" id="btn-viola-reverse-strum" class="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition">
                                <i data-lucide="volume-2" class="w-4 h-4"></i>
                                <span>Dedilhar Acorde</span>
                            </button>
                            <button type="button" id="btn-viola-reverse-to-fretboard" class="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center gap-1.5 transition">
                                <i data-lucide="eye" class="w-4 h-4 text-cyan-400"></i>
                                <span>Editar no Braço</span>
                            </button>
                            <button type="button" id="btn-viola-reverse-trans-down" title="Transpor -1 Semitom" class="min-h-[40px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 transition">♭ -1</button>
                            <button type="button" id="btn-viola-reverse-trans-up" title="Transpor +1 Semitom" class="min-h-[40px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 transition">♯ +1</button>
                            <button type="button" id="btn-viola-reverse-clear-open" title="Zerar todas as cordas para soltas (0)" class="min-h-[40px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 transition">Soltas (0)</button>
                            <button type="button" id="btn-viola-reverse-clear-mute" title="Abafar todas as cordas (X)" class="min-h-[40px] px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-rose-300 transition">Abafar (X)</button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        <!-- Coluna 1: Diagnóstico Harmônico do Acorde -->
                        <div id="viola-reverse-analysis-container" class="lg:col-span-5 bg-[#090d16] border border-slate-800 rounded-xl p-4 space-y-4"></div>

                        <!-- Coluna 2: Seletor Tátil por Corda & Presets Caipiras -->
                        <div class="lg:col-span-7 space-y-4">
                            <div class="bg-[#090d16] border border-slate-800 rounded-xl p-4 space-y-3">
                                <div class="flex items-center justify-between">
                                    <h4 class="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Digitação por Corda / Par</h4>
                                    <span class="text-[11px] font-mono text-slate-500">Clique nas casas para posicionar</span>
                                </div>
                                <div id="viola-reverse-course-selectors" class="space-y-2"></div>
                            </div>

                            <div class="bg-[#090d16] border border-slate-800 rounded-xl p-4 space-y-3">
                                <div class="flex items-center justify-between">
                                    <h4 class="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Presets Curados & Digitações Clássicas</h4>
                                    <span class="text-[11px] font-mono text-amber-400">1 Clique para carregar</span>
                                </div>
                                <div id="viola-reverse-presets-container" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"></div>
                            </div>
                        </div>
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

                <!-- Módulo de Ponteios e Intros Clássicas de Viola Caipira (Fase 6) -->
                <div id="viola-ponteios-container" class="space-y-4"></div>

                <!-- Módulo de Gerador, Editor e Exportador de Tablaturas e Cifras Caipiras (Fase 7) -->
                <div id="viola-tab-editor-container" class="space-y-4"></div>

                <!-- Módulo de Treinador de Escalas Modais Caipiras (Fase 8) -->
                <div id="viola-modal-trainer-container" class="space-y-4"></div>

                <!-- Módulo de Analisador de Tensão Mecânica e Calibre de Cordas (Fase 9) -->
                <div id="viola-tension-calculator-container" class="space-y-4"></div>

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

        const btnModeChord = document.getElementById('btn-viola-mode-chord');
        const btnModeDuad = document.getElementById('btn-viola-mode-duad');
        const btnModeReverse = document.getElementById('btn-viola-mode-reverse');
        const btnModePonteio = document.getElementById('btn-viola-mode-ponteio');
        if (btnModeChord && btnModeDuad && btnModeReverse) {
            btnModeChord.className = state.displayMode === 'CHORD'
                ? 'px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold bg-emerald-600 text-slate-950 shadow'
                : 'px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold text-slate-400 hover:text-slate-200';
            btnModeDuad.className = state.displayMode === 'DUAD'
                ? 'px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold bg-cyan-600 text-slate-950 shadow'
                : 'px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold text-slate-400 hover:text-slate-200';
            btnModeReverse.className = state.displayMode === 'REVERSE'
                ? 'px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold bg-amber-500 text-slate-950 shadow'
                : 'px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold text-slate-400 hover:text-slate-200';
            if (btnModePonteio) {
                btnModePonteio.className = state.displayMode === 'PONTEIO'
                    ? 'px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold bg-amber-400 text-slate-950 shadow'
                    : 'px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold text-slate-400 hover:text-slate-200';
            }
            const btnModeTabEditor = document.getElementById('btn-viola-mode-tab-editor');
            if (btnModeTabEditor) {
                btnModeTabEditor.className = state.displayMode === 'TAB_EDITOR'
                    ? 'px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold bg-violet-500 text-white shadow'
                    : 'px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold text-slate-400 hover:text-slate-200';
            }
            const btnModeModal = document.getElementById('btn-viola-mode-modal');
            if (btnModeModal) {
                btnModeModal.className = state.displayMode === 'MODAL'
                    ? 'px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold bg-rose-600 text-white shadow'
                    : 'px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold text-slate-400 hover:text-slate-200';
            }
        }
    }

    function bindEvents() {
        // Modos de Projeção no Braço
        const btnModeChord = document.getElementById('btn-viola-mode-chord');
        const btnModeDuad = document.getElementById('btn-viola-mode-duad');
        const btnModeReverse = document.getElementById('btn-viola-mode-reverse');
        const btnModePonteio = document.getElementById('btn-viola-mode-ponteio');
        const btnModeTabEditor = document.getElementById('btn-viola-mode-tab-editor');
        const btnModeModal = document.getElementById('btn-viola-mode-modal');
        if (btnModeChord && btnModeDuad && btnModeReverse) {
            btnModeChord.addEventListener('click', () => {
                if (state.displayMode !== 'CHORD') {
                    stopScalePlayback();
                    stopPonteioPlayback();
                    stopProgressionPlayback();
                    stopTabEditorPlayback();
                    stopModalPlayback();
                    state.displayMode = 'CHORD';
                    saveViolaState();
                    renderAll();
                    strumActiveChord();
                }
            });
            btnModeDuad.addEventListener('click', () => {
                if (state.displayMode !== 'DUAD') {
                    stopPonteioPlayback();
                    stopProgressionPlayback();
                    stopTabEditorPlayback();
                    stopModalPlayback();
                    state.displayMode = 'DUAD';
                    saveViolaState();
                    renderAll();
                }
            });
            btnModeReverse.addEventListener('click', () => {
                if (state.displayMode !== 'REVERSE') {
                    stopScalePlayback();
                    stopPonteioPlayback();
                    stopProgressionPlayback();
                    stopTabEditorPlayback();
                    stopModalPlayback();
                    state.displayMode = 'REVERSE';
                    saveViolaState();
                    renderAll();
                    strumReverseChord();
                }
            });
            if (btnModePonteio) {
                btnModePonteio.addEventListener('click', () => {
                    if (state.displayMode !== 'PONTEIO') {
                        stopScalePlayback();
                        stopProgressionPlayback();
                        stopTabEditorPlayback();
                        stopModalPlayback();
                        state.displayMode = 'PONTEIO';
                        saveViolaState();
                        renderAll();
                        const pWrap = document.getElementById('viola-ponteios-container');
                        if (pWrap) pWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            }
            if (btnModeTabEditor) {
                btnModeTabEditor.addEventListener('click', () => {
                    if (state.displayMode !== 'TAB_EDITOR') {
                        stopScalePlayback();
                        stopPonteioPlayback();
                        stopProgressionPlayback();
                        stopTabEditorPlayback();
                        stopModalPlayback();
                        state.displayMode = 'TAB_EDITOR';
                        saveViolaState();
                        renderAll();
                        const edWrap = document.getElementById('viola-tab-editor-container');
                        if (edWrap) edWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            }
            if (btnModeModal) {
                btnModeModal.addEventListener('click', () => {
                    if (state.displayMode !== 'MODAL') {
                        stopScalePlayback();
                        stopPonteioPlayback();
                        stopProgressionPlayback();
                        stopTabEditorPlayback();
                        stopModalPlayback();
                        state.displayMode = 'MODAL';
                        saveViolaState();
                        renderAll();
                        const mWrap = document.getElementById('viola-modal-trainer-container');
                        if (mWrap) mWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            }
        }

        // Ações Rápidas do Dicionário & Buscador Reverso
        const btnRevStrum = document.getElementById('btn-viola-reverse-strum');
        if (btnRevStrum) {
            btnRevStrum.addEventListener('click', strumReverseChord);
        }

        const btnRevToFret = document.getElementById('btn-viola-reverse-to-fretboard');
        if (btnRevToFret) {
            btnRevToFret.addEventListener('click', () => {
                state.displayMode = 'REVERSE';
                saveViolaState();
                renderAll();
                const wrap = document.getElementById('viola-fretboard-svg-wrap');
                if (wrap) wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        }

        const btnRevTransDown = document.getElementById('btn-viola-reverse-trans-down');
        if (btnRevTransDown) {
            btnRevTransDown.addEventListener('click', () => transposeReverseChord(-1));
        }

        const btnRevTransUp = document.getElementById('btn-viola-reverse-trans-up');
        if (btnRevTransUp) {
            btnRevTransUp.addEventListener('click', () => transposeReverseChord(1));
        }

        const btnRevClearOpen = document.getElementById('btn-viola-reverse-clear-open');
        if (btnRevClearOpen) {
            btnRevClearOpen.addEventListener('click', resetReverseChordToOpen);
        }

        const btnRevClearMute = document.getElementById('btn-viola-reverse-clear-mute');
        if (btnRevClearMute) {
            btnRevClearMute.addEventListener('click', resetReverseChordToMute);
        }

        const scrollTensionBtn = document.getElementById('btn-viola-scroll-tension');
        if (scrollTensionBtn) {
            scrollTensionBtn.addEventListener('click', () => {
                const el = document.getElementById('viola-tension-calculator-container');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

        document.getElementById('viola-select-instrument').addEventListener('change', (e) => {
            stopScalePlayback();
            stopPonteioPlayback();
            stopProgressionPlayback();
            stopTabEditorPlayback();
            stopModalPlayback();
            stopTunerTone();
            stopEarTrainerAudio();
            state.instrumentId = e.target.value;
            state.voicingVariantIdx = 0;

            // Sincroniza inteligentemente o preset de tensão com o instrumento selecionado
            if (state.instrumentId === 'violao_padrao' && !state.tensionCalculator.presetId.startsWith('violao_')) {
                state.tensionCalculator.presetId = 'violao_nylon_normal';
                state.tensionCalculator.scaleLengthMm = 650;
                state.tensionCalculator.customGauges = null;
                state.tensionCalculator.stringMaterial = 'nylon_classical';
            } else if (state.instrumentId === 'viola_cebolao_e' && state.tensionCalculator.presetId.startsWith('violao_')) {
                state.tensionCalculator.presetId = 'viola_cebolao_e_media';
                state.tensionCalculator.scaleLengthMm = 580;
                state.tensionCalculator.customGauges = null;
                state.tensionCalculator.stringMaterial = 'steel_bronze';
            } else if (state.instrumentId === 'viola_cebolao_d') {
                state.tensionCalculator.presetId = 'viola_cebolao_d_media';
                state.tensionCalculator.scaleLengthMm = 580;
                state.tensionCalculator.customGauges = null;
                state.tensionCalculator.stringMaterial = 'steel_bronze';
            } else if (state.instrumentId === 'viola_rio_abaixo') {
                state.tensionCalculator.presetId = 'viola_rio_abaixo_media';
                state.tensionCalculator.scaleLengthMm = 580;
                state.tensionCalculator.customGauges = null;
                state.tensionCalculator.stringMaterial = 'steel_bronze';
            } else if (state.instrumentId === 'viola_boiadeira') {
                state.tensionCalculator.presetId = 'viola_boiadeira_media';
                state.tensionCalculator.scaleLengthMm = 580;
                state.tensionCalculator.customGauges = null;
                state.tensionCalculator.stringMaterial = 'steel_bronze';
            }

            saveViolaState();
            renderAll();
        });

        const stopTunerBtn = document.getElementById('btn-viola-tuner-stop');
        if (stopTunerBtn) {
            stopTunerBtn.addEventListener('click', stopTunerTone);
        }

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
        renderEarTrainerPanel();
        renderFretboardSVG();
        renderHarmonicFieldPanel();
        renderDuadStrip();
        renderReverseChordPanel();
        renderProgressionStudyPanel();
        renderPonteiosSection();
        renderTabEditorSection();
        renderModalScalesSection();
        renderTensionCalculatorSection();
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
