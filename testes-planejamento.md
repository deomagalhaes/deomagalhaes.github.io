# Planejamento de Testes e Escalas Psicoeducativas — Deo Magalhães

Este arquivo gerencia a esteira de desenvolvimento de **Escalas Psicométricas e Testes Psicoeducativos Autoaplicáveis** para o site [deomagalhaes.com.br](https://deomagalhaes.com.br).

---

## 📋 Fila e Status de Produção

| ID | Instrumento / Escala | Domínio Clínico / Construto | Arquivo | Status |
|---|---|---|---|---|
| **T-01** | **DASS-21 (Depressão, Ansiedade e Estresse)** | Triagem Afetiva e Sintomatologia Emocional | `artigos/teste-dass21.html` | ✅ Concluído |
| **T-02** | **Estilos de Apego na Vida Adulta** | Vínculos Afetivos, Esquivas e Ansiedade Relacional | `artigos/teste-apego.html` | ✅ Concluído |
| **T-03** | **Inventário de Esquemas Iniciais Desadaptativos** | Terapia do Esquema e Padrões Psíquicos | `artigos/teste-esquemas.html` | ✅ Concluído |
| **T-04** | **Escala de Funções Executivas e TDAH** | Córtex Pré-Frontal, Inibição e Atenção | `artigos/teste-funcoes-executivas.html` | ✅ Concluído |
| **T-05** | **Inventário de Procrastinação e Ação** | Paralisia de Tarefas, Autoeficácia e Motivação | `artigos/teste-procrastinacao.html` | ✅ Concluído |
| **T-06** | **Escala de Regulação Emocional (ERQ - Gross)** | Reavaliação Cognitiva vs. Supressão Expressiva | `recursos/escala-regulacao-emocional.html` | ✅ Concluído |
| **T-07** | **Inventário de Sobrecarga e Burnout Clínico** | Exaustão Emocional, Despersonalização e Eficácia | `artigos/teste-burnout.html` | ✅ Concluído |
| **T-08** | **Escala de Tolerância à Frustração e Impulsividade** | Controle Inibitório e Reatividade Emocional | `artigos/teste-frustracao.html` | ✅ Concluído |
| **T-09** | **Questionário de Higiene do Sono e Ritmo Circadiano** | Insônia Comportamental e Cronotipo | `artigos/teste-sono.html` | ✅ Concluído |
| **T-10** | **Escala de Ruminação Mental e Pensamentos Intrusivos** | Rede de Modo Padrão (DMN) e Ansiedade Cognitiva | `artigos/teste-ruminacao.html` | ✅ Concluído |
| **T-11** | **Inventário de Ansiedade Social e Evasão Afetiva** | Medo de Avaliação Negativa e Fobia Social | `artigos/teste-ansiedade-social.html` | ✅ Concluído |
| **T-12** | **Escala de Flexibilidade Psicológica e Desfusão (ACT)** | Aceitação, Valores e Rigidez Cognitiva | `artigos/teste-flexibilidade-cognitiva.html` | ✅ Concluído |
| **T-13** | **Escala de Autoeficácia Geral e Resiliência Psíquica** | Agência Pessoal, Crença de Competência e Resiliência | `artigos/teste-autoeficacia.html` | ✅ Concluído |
| **T-15** | **Inventário de Assertividade e Limites Interpessoais** | Comunicação Não-Violenta, Autoestima e Respeito aos Limites | `artigos/teste-assertividade.html` | ✅ Concluído |
| **T-16** | **Escala de Autocompaixão Clínica (Neff)** | Autocrítica Tóxica vs. Acolhimento e Humanidade Compartilhada | `artigos/teste-autocompaixao.html` | ✅ Concluído |
| **T-17** | **Inventário de Rigidez Epistêmica e Pensamento Crítico** | Viés de Confirmação, Dogmatismo e Flexibilidade Intelectual | `artigos/teste-rigidez-epistemica.html` | ✅ Concluído |
| **T-18** | **Escala de Satisfação Conjugal e Segurança Afetiva (ESCSA)** | Vínculo de Parceria, Ocitocina e Resolução de Conflitos | `artigos/teste-satisfacao-conjugal-apego.html` | ✅ Concluído |
| **T-19** | **Escala de Inércia Psíquica e Arranque Motor** | Bloqueio Executivo, Tônus Dopaminérgico e TDAH | `artigos/teste-bloqueio-executivo.html` | ⏳ *Próximo da fila* |

---

## 🛠️ Padrão de Implementação dos Testes
1. **Instrumentação Científica:** Baseado em literatura validada (ex: Maslach Burnout Inventory, DASS-21, ERQ).
2. **Privacidade Absoluta:** 100% no navegador (Client-side), sem gravação de respostas em servidores externos.
3. **Cálculo Automático com Feedback Qualitativo:** Pontuação imediata categorizada (Leve, Moderado, Severo) com explicações neuroclínicas sobre cada dimensão.
4. **Orientações e Encaminhamento:** Recomendações práticas e botão direto para consulta ou agendamento especializado.
5. **Divulgação:** Inclusão do card em `cards-artigos.html` e atualização do `sitemap.xml`.
