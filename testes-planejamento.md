# Planejamento de Testes e Escalas Psicoeducativas — Deo Magalhães

Este arquivo gerencia a esteira de desenvolvimento de **Escalas Psicométricas e Testes Psicoeducativos Autoaplicáveis** para o site [deomagalhaes.com.br](https://deomagalhaes.com.br).

---

## 📋 Fila e Status de Produção

| ID | Instrumento / Escala | Domínio Clínico / Construto | Arquivo | Status |
|---|---|---|---|---|
| **T-01** | **DASS-21 (Depressão, Ansiedade e Estresse)** | Triagem Afetiva e Sintomatologia Emocional | `testes/teste-dass21.html` | ✅ Concluído |
| **T-02** | **Estilos de Apego na Vida Adulta** | Vínculos Afetivos, Esquivas e Ansiedade Relacional | `testes/teste-apego.html` | ✅ Concluído |
| **T-03** | **Inventário de Esquemas Iniciais Desadaptativos** | Terapia do Esquema e Padrões Psíquicos | `testes/teste-esquemas.html` | ✅ Concluído |
| **T-04** | **Escala de Funções Executivas e TDAH** | Córtex Pré-Frontal, Inibição e Atenção | `testes/teste-funcoes-executivas.html` | ✅ Concluído |
| **T-05** | **Inventário de Procrastinação e Ação** | Paralisia de Tarefas, Autoeficácia e Motivação | `testes/teste-procrastinacao.html` | ✅ Concluído |
| **T-06** | **Escala de Regulação Emocional (ERQ - Gross)** | Reavaliação Cognitiva vs. Supressão Expressiva | `testes/escala-regulacao-emocional.html` | ✅ Concluído |
| **T-07** | **Inventário de Sobrecarga e Burnout Clínico** | Exaustão Emocional, Despersonalização e Eficácia | `testes/teste-burnout.html` | ✅ Concluído |
| **T-08** | **Escala de Tolerância à Frustração e Impulsividade** | Controle Inibitório e Reatividade Emocional | `testes/teste-frustracao.html` | ✅ Concluído |
| **T-09** | **Questionário de Higiene do Sono e Ritmo Circadiano** | Insônia Comportamental e Cronotipo | `testes/teste-sono.html` | ✅ Concluído |
| **T-10** | **Escala de Ruminação Mental e Pensamentos Intrusivos** | Rede de Modo Padrão (DMN) e Ansiedade Cognitiva | `testes/teste-ruminacao.html` | ✅ Concluído |
| **T-11** | **Inventário de Ansiedade Social e Evasão Afetiva** | Medo de Avaliação Negativa e Fobia Social | `testes/teste-ansiedade-social.html` | ✅ Concluído |
| **T-12** | **Escala de Flexibilidade Psicológica e Desfusão (ACT)** | Aceitação, Valores e Rigidez Cognitiva | `testes/teste-flexibilidade-cognitiva.html` | ✅ Concluído |
| **T-13** | **Escala de Autoeficácia Geral e Resiliência Psíquica** | Agência Pessoal, Crença de Competência e Resiliência | `testes/teste-autoeficacia.html` | ✅ Concluído |
| **T-15** | **Inventário de Assertividade e Limites Interpessoais** | Comunicação Não-Violenta, Autoestima e Respeito aos Limites | `testes/teste-assertividade.html` | ✅ Concluído |
| **T-16** | **Escala de Autocompaixão Clínica (Neff)** | Autocrítica Tóxica vs. Acolhimento e Humanidade Compartilhada | `testes/teste-autocompaixao.html` | ✅ Concluído |
| **T-17** | **Inventário de Rigidez Epistêmica e Pensamento Crítico** | Viés de Confirmação, Dogmatismo e Flexibilidade Intelectual | `testes/teste-rigidez-epistemica.html` | ✅ Concluído |
| **T-18** | **Escala de Satisfação Conjugal e Segurança Afetiva (ESCSA)** | Vínculo de Parceria, Ocitocina e Resolução de Conflitos | `testes/teste-satisfacao-conjugal-apego.html` | ✅ Concluído |
| **T-19** | **Escala de Inércia Psíquica e Bloqueio Executivo (EIPBE)** | Bloqueio Executivo, Tônus Dopaminérgico e TDAH | `testes/teste-bloqueio-executivo-tdah.html` | ✅ Concluído |
| **T-20** | **Escala de Fadiga por Decisão e Depleção do Ego** | Esgotamento Pré-Frontal, Autocontrole e Heurísticas Impulsivas | `testes/teste-fadiga-decisao.html` | ✅ Concluído |
| **T-21** | **Inventário de Sintomas de Desregulação do Eixo HPA e Estresse Crônico** | Carga Alostática, Reatividade ao Estresse e Esgotamento Fisiológico | `testes/teste-desregulacao-eixo-hpa.html` | ✅ Concluído |
| **T-22** | **Escala de Disforia Sensível à Rejeição (RSD) e Reatividade Afetiva** | Vulnerabilidade Emocional, Hiper-reatividade Social e TDAH | `testes/teste-disforia-rejeicao.html` | ⏳ *Próximo da fila* |

---

## 🛠️ Padrão de Implementação dos Testes
1. **Instrumentação Científica:** Baseado em literatura validada (ex: Maslach Burnout Inventory, DASS-21, ERQ).
2. **Privacidade Absoluta:** 100% no navegador (Client-side), sem gravação de respostas em servidores externos.
3. **Cálculo Automático com Feedback Qualitativo:** Pontuação imediata categorizada (Leve, Moderado, Severo) com explicações neuroclínicas sobre cada dimensão.
4. **Orientações e Encaminhamento:** Recomendações práticas e botão direto para consulta ou agendamento especializado.
5. **Divulgação:** Inclusão do card em `cards-artigos.html` e atualização do `sitemap.xml`.
