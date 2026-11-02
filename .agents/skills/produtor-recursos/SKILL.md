---
name: produtor-recursos
description: >-
  Agente construtor e mantenedor de ferramentas clínicas interativas (Psicometria ABNT/DSM-5-TR,
  ABA ABC, Desfusão Cognitiva/Existencial, Funções Executivas, Regulação Autonômica) em recursos/
  e ferramentas-clinicas/, bem como de módulos técnicos privados no Lab Pessoal Oculto (nexus-vault/).
  Ative esta skill sempre que o usuário pedir para criar, atualizar, auditar ou publicar recursos
  clínicos, calculadoras, diários interativos, quadros imprimíveis ou abas do Nexus Vault.
---

# Skill: Agente Produtor de Recursos Clínicos & Lab Pessoal

Esta skill orquestra o ciclo completo de engenharia client-side (Zero-Backend / 100% LGPD Compliant) para criação e evolução de utilitários clínicos públicos e módulos privados de alta produtividade no ecossistema `deomagalhaes.github.io`.

---

## 🧭 Passo 1: Identificação do Ambiente Alvo

Antes de escrever código, classifique o pedido em um dos dois ambientes estritamente isolados:

1. **Ambiente Público / Clínico (`recursos/<slug>.html` + Hubs públicos):**
   - Destinado a pacientes adultos/infantis e pais/cuidadores (ABA, Desfusão Cognitiva, Rotinas Executivas, Regulação Autonômica). **Atenção:** calculadoras de apuração psicométrica de testes restritos NÃO pertencem ao ambiente público.
   - Consulte a especificação detalhada em [references/prd-modulo-clinico.md](./references/prd-modulo-clinico.md).
   - Utilize como base estrutural o shell canônico em [resources/template-recurso-publico.html](./resources/template-recurso-publico.html) e os utilitários de persistência/exportação em [resources/storage-vault-engine.js](./resources/storage-vault-engine.js).
2. **Ambiente Privado / Lab Pessoal Oculto (`nexus-vault/`):**
   - Destinado exclusivamente ao uso pessoal e técnico-clínico restrito do administrador (incluindo a **Estação de Correção Neuropsicológica WASI, FDT, SRS-2, BPA-2, RAVLT & Gerador de Laudos ABNT**), protegido por PIN validado via SHA-256 e invisível a buscadores e visitantes públicos.
   - Consulte a especificação detalhada das 6 abas em [references/prd-nexus-vault.md](./references/prd-nexus-vault.md).

---

## 🛠️ Passo 2: Diretrizes de Engenharia (Proibido Código Mockado)

1. **Rigor Matemático e Algorítmico 100% Real:**
   - **Estatística e Psicometria:** Implementar cálculo exato de escore *Z*, Escore Ponderado (`10 + 3×Z`), Escore *T* (`50 + 10×Z`), QI (`100 + 15×Z`), função de distribuição cumulativa normal via aproximação de alta precisão de Abramowitz & Stegun (`erf`, erro máximo < 1,5 × 10⁻⁷) e inversa normal racional de Acklam (`probit`) para entrada direta por Percentil.
   - **Áudio Nativo:** Utilizar `Web Audio API` pura (`AudioContext`, síntese de cordas dedilhadas e escalonador *lookahead* de metrônomo sem *drift* de timer).
   - **Interoperabilidade de Dados:** Implementar exportação real em `.json` (Blob UTF-8), `.csv` (com BOM UTF-8 `\uFEFF` para abertura perfeita de acentos no Excel), cópia *rich-text* (`navigator.clipboard.write` com `text/html` + fallback) para colagem direta de tabelas ABNT no Word/Google Docs, e CSS `@media print` calibrado para folha A4 limpa.
2. **UX Mobile-First Operável com Uma Mão:**
   - Controles frequentes com altura mínima de `44px`, chips clicáveis para preenchimento instantâneo sem digitação longa, layout sem rolagem horizontal (`overflow-x: hidden`) e barra de ação rápida acessível em telas pequenas.
3. **Blindagem de Notação Científica em HTML:**
   - **PROIBIDO** usar delimitadores LaTeX (`$...$`, `$$...$$`, `\(...\)`) no HTML. Escreva fórmulas exclusivamente com Unicode nativo e tags HTML (`<em>Z</em> = (<em>X</em> − <em>M</em>) / <em>DP</em>`, `≤`, `≥`, `×`, `÷`).

---

## 🔄 Passo 3: Fluxo de Integração, Validação e Publicação

### Para Recursos do Ambiente Público (`recursos/<slug>.html`):
1. **Ler a Fila:** Verificar `ferramentas-planejamento.md` para identificar o ID (`F-XX`) ou registrar a nova ferramenta planejada.
2. **Construir a Aplicação:** Salvar em `recursos/<slug>.html` em **UTF-8 sem BOM**, incluindo fundamentação neurobiológica/clínica concisa ao final da ferramenta e disclaimer ético profissional.
3. **Integrar nos Hubs (Segregação Estrita):**
   - Adicionar o card com atributos `data-category` em `recursos.html`.
   - Se for um instrumento de uso clínico/terapêutico principal, adicionar ou atualizar seu destaque em `ferramentas-clinicas/index.html`.
   - **NUNCA** inserir cards de ferramentas em `cards-artigos.html`.
4. **Atualizar Fila e Sitemap:**
   - Marcar `✅ Concluído` em `ferramentas-planejamento.md`.
   - Executar `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/generate-sitemap.ps1`.

### Para Módulos do Lab Pessoal (`nexus-vault/`):
1. **Modularidade:** Manter o shell em `nexus-vault/index.html` (com `<meta name="robots" content="noindex, nofollow, noarchive">`) e a lógica desacoplada por domínio em `nexus-vault/js/`.
2. **Sincronização Unificada:** Garantir que toda nova chave de `localStorage` do Lab seja registrada no manifesto do **Exportar/Importar Banco de Dados Completo (`.json`)** para backup único no Google Drive.
3. **Verificação de Sigilo:** Confirmar zero links apontando para `nexus-vault` no DOM público, zero menção em `robots.txt` ou `sitemap.xml`, e zero nomes pessoais sensíveis fixos no código-fonte.

### Passo Final Obrigatório (Quality Gate):
Antes de encerrar ou realizar commit, execute sempre:
```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-quality-gate.ps1
```
Somente prossiga se o resultado for **Total de Erros: 0**.
