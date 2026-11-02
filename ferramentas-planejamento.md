# Planejamento de Ferramentas Neurocognitivas e Clínicas — Deo Magalhães

Este arquivo gerencia a esteira de desenvolvimento de microaplicações e utilitários clínicos/terapêuticos executados 100% no navegador (Zero-Backend, conformidade LGPD em `localStorage` e exportação de relatórios/backups).

---

## 📋 Fila e Status de Desenvolvimento (Módulo Público e Clínico)

| ID | Ferramenta Clínica | Público-Alvo | Foco Clínico / Neuropsicológico | Arquivo | Status |
|---|---|---|---|---|---|
| **F-01** | **RPD Digital (Diário TCC)** | Adultos | Reestruturação Cognitiva, Terapia Cognitivo-Comportamental | `recursos/rpd-digital.html` | ✅ Concluído |
| **F-02** | **Decompositor Anti-Procrastinação** | Adultos / TDAH | Funções Executivas, TDAH e Paralisia de Tarefas | `recursos/descompositor-tarefas.html` | ✅ Concluído |
| **F-03** | **Timer Neurodivergente & Ruído Marrom** | Adultos / TDAH | Atenção Sustentada, Modulação Acústica e Foco | `recursos/pomodoro-neuro.html` | ✅ Concluído |
| **F-04** | **Treinador de Coerência Cardíaca e Respiração Vagal** | Geral | Regulação do Sistema Nervoso Autônomo, Tomo Vagal e Ansiedade Aguda | `recursos/coerencia-cardiaca-vagal.html` | ✅ Concluído |
| **F-05** | **Matriz de Priorização Neurodivergente** | Adultos / TDAH | Priorização Rápida, Carga Cognitiva e Tomada de Decisão | `recursos/matriz-priorizacao-neuro.html` | ✅ Concluído |
| **F-06** | **Registrador Comportamental ABC (ABA)** | Pais e Cuidadores | Análise do Comportamento Aplicada (Antecedente-Comportamento-Consequência), Relatório PDF/CSV e WhatsApp | `recursos/registrador-abc-aba.html` | ✅ Concluído |
| **F-07** | **Diário de Clarificação Existencial e Desfusão Cognitiva** | Pacientes Adultos | Stepper Socrático (Fato vs. Hipótese, Interocepção, Auditoria de Evidências e Práxis/Valores) | `recursos/clarificacao-existencial.html` | ✅ Concluído |
| **F-08** | **Construtor Visual de Rotina & Economia de Fichas** | Infantil / Família | Previsibilidade Executiva, Reforçamento Positivo e Impressão A4 Limpa | `recursos/construtor-rotina-fichas.html` | ✅ Concluído |
| **F-09** | **Rastreador de Gatilhos e Sobrecarga Sensorial** | TEA / TDAH | Hipersensibilidade e Descompressão Guiada | `recursos/rastreador-sobrecarga-sensorial.html` | ⏳ *Próximo da fila* |
| **F-10** | **Calculadora de Higiene do Sono e Ritmo Circadiano** | Geral | Sono REM/NREM, Consolidação de Memória e Energia Diurna | `recursos/calculadora-sono-circadiano.html` | ⏳ Aguardando |
| **F-11** | **Termômetro da Impulsividade & Técnica STOP** | Adultos / DBT | Controle Inibitório, Terapia Dialética Comportamental (DBT) | `recursos/termometro-impulsividade.html` | ⏳ Aguardando |

---

## 🛠️ Padrão Técnico de Implementação (`produtor-recursos`)
1. **Visual e Identidade:** Paleta institucional sóbria (`#005f73`, `#0a9396`, `#1e293b`, `#ee9b00`, `#f8fafc`), `top-bar`, `<header id="main-header">` canônico, Lucide Icons, TailwindCSS e `<footer class="main-footer"><div class="container footer-grid">`.
2. **Privacidade Estrita (LGPD / Zero-Backend):** 100% Client-side (`localStorage`). Nenhum dado clínico é enviado para servidores externos. Exportação/Importação `.json`, `.csv` e impressão A4 (`@media print`).
3. **Rigor Matemático & Zero LaTeX Bruto:** Motores matemáticos e `Web Audio API` 100% implementados (zero placeholders). Fórmulas renderizadas exclusivamente em HTML semântico + Unicode nativo (`≤`, `≥`, `×`, `÷`, `−`).
4. **Fundamentação Clínica:** Seção explicando o mecanismo neurobiológico/comportamental do recurso + disclaimer ético profissional.
5. **Integração Taxonômica Estrita:** Adição do card **EXCLUSIVAMENTE** em `recursos.html` e (quando aplicável) no Hub Clínico `ferramentas-clinicas/index.html`. **PROIBIDO** inserir recursos em `cards-artigos.html`.
