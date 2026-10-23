# Planejamento de Ferramentas Neurocognitivas e Clínicas — Deo Magalhães

Este arquivo gerencia a esteira de desenvolvimento de microaplicações e utilitários terapêuticos executados 100% no navegador (sem necessidade de backend, com privacidade total em `localStorage` e download de relatórios).

---

## 📋 Fila e Status de Desenvolvimento

| ID | Ferramenta Clínica | Foco Clínico / Neuropsicológico | Arquivo | Status |
|---|---|---|---|---|
| **F-01** | **RPD Digital (Diário TCC)** | Reestruturação Cognitiva, Terapia Cognitivo-Comportamental | `recursos/rpd-digital.html` | ✅ Concluído |
| **F-02** | **Decompositor Anti-Procrastinação** | Funções Executivas, TDAH e Paralisia de Tarefas | `recursos/descompositor-tarefas.html` | ✅ Concluído |
| **F-03** | **Timer Neurodivergente & Ruído Marrom** | Atenção Sustentada, Modulação Acústica e Foco | `recursos/pomodoro-neuro.html` | ✅ Concluído |
| **F-04** | **Treinador de Coerência Cardíaca e Respiração Vagal** | Regulação do Sistema Nervoso Autônomo, Tomo Vagal e Ansiedade Aguda | `recursos/coerencia-cardiaca-vagal.html` | ✅ Concluído |
| **F-05** | **Matriz de Eisenhower Neurodivergente** | Priorização Rápida, Carga Cognitiva e Tomada de Decisão | `recursos/matriz-priorizacao-neuro.html` | ⏳ *Próximo da fila* |
| **F-06** | **Rastreador de Gatilhos e Sobrecarga Sensorial** | TEA, TDAH, Hipersensibilidade e Descompressão Guiada | `recursos/rastreador-sobrecarga-sensorial.html` | ⏳ Aguardando |
| **F-07** | **Calculadora de Higiene do Sono e Ritmo Circadiano** | Sono REM/NREM, Consolidação de Memória e Energia Diurna | `recursos/calculadora-sono-circadiano.html` | ⏳ Aguardando |
| **F-08** | **Termômetro da Impulsividade & STOP Técnica** | Controle Inibitório, Terapia Dialética Comportamental (DBT) | `recursos/termometro-impulsividade.html` | ⏳ Aguardando |

---

## 🛠️ Padrão Técnico de Implementação
1. **Visual:** Identidade institucional (`#005f73`, `#0a9396`, `#ee9b00`, `#f9f6ee`), top-bar, menu responsivo e rodapé oficial.
2. **Privacidade:** 100% Client-side. Nenhum dado do paciente é enviado para servidores externos.
3. **Áudio/Animação:** Web Audio API para tons suaves de biofeedback e CSS animado de alta precisão.
4. **Fundamentação:** Seção explicando o mecanismo neurobiológico do recurso.
5. **Integração:** Adição do card em `recursos.html` e `cards-artigos.html`.
