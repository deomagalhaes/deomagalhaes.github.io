---
name: gerador-carrossel
description: Gera automaticamente roteiros de carrossel de 5 a 7 slides para Instagram, legendas com hashtags e exportações a partir de artigos de psicologia, neurociência ou storybooks infantis.
---

# Skill: Gerador Automatizado de Carrosséis para Redes Sociais

Esta skill formaliza o pipeline automatizado de transformação de ensaios aprofundados, artigos clínicos e storybooks infantis do site em carrosséis de alto impacto para o Instagram ([@deomagalhaesneuro](https://instagram.com/deomagalhaesneuro)).

---

## 🎯 Arquitetura da Narrativa (5 a 7 Slides)

Cada carrossel deve seguir a jornada neurocognitiva:
1. **Slide 1 — Capa / Gancho:** Título provocador que desafia o senso comum ou aborda uma dor oculta do cotidiano (destaque em âmbar `#ee9b00` e fundo petróleo `#005f73` ou escuro `#001219`).
2. **Slide 2 — O Problema Invisível:** Identificação imediata. A dor que o leitor sente mas não sabe nomear (ex: cansaço com culpa, rolar o feed sem descanso, reatividade emocional).
3. **Slide 3 — A Neurociência / Mecanismo:** A explicação biológica sem simplismo: receptores D2, eixo HPA, amígdala, desregulação do córtex pré-frontal, clivagem psicológica.
4. **Slide 4 — O Contraste ou Armadilha:** Dopamina Conquistada vs. Dopamina Barata; Sociedade Disciplinar vs. Sociedade do Desempenho; Medo Imaginado vs. Medo Real.
5. **Slide 5 — Síntese Prática (3 Passos):** Ações clínicas reais, fricção ambiental, exercícios de autotranquilização ou reestruturação de rotina.
6. **Slide 6 (ou 7) — Fechamento & CTA:** Convite para ler o artigo completo no site `deomagalhaes.com.br`, credenciais (Deo Magalhães • Neuropsicólogo CRP 04/42784) e pergunta aberta para comentários.

---

## 📋 Regras de Formatação e Identidade

* **Perfil:** `@deomagalhaesneuro`
* **Assinatura:** Deo Magalhães — Neuropsicólogo e Neurocientista (CRP 04/42784)
* **Paleta Institucional:**
  * Primária: `#005f73` (Deep Teal / Azul-petróleo)
  * Escuro de Contraste: `#001219` (Obsidian)
  * Destaque / Gancho: `#ee9b00` (Âmbar Ouro)
  * Secundária / Luz: `#0a9396` (Ciano Neural) e `#94d2bd` (Sálvia)
  * Neutro Suave: `#e9d8a6` e `#ffffff`
* **Resolução Padrão:** 1080 x 1080 px (1:1 Quadrado Instagram)
* **Legenda:**
  * Parágrafos curtos com espaçamento duplo para leitura fluida mobile
  * Gancho na 1ª linha
  * Pergunta de reflexão no final
  * Bloco de 12 a 15 hashtags estratégicas

---

## 🔄 Pipeline Unificado de Publicação

Sempre que um novo artigo clínico, storybook ou recurso for publicado:
1. **Página HTML:** Salva em `artigos/` ou `recursos/` com layout responsivo e sem o termo "Dr." antes do nome do profissional.
2. **Card Central:** Inserido no topo de `cards-artigos.html` e distribuído dinamicamente na Home e nas páginas de categoria.
3. **Roteiro Canônico de Carrossel:** Criado em `social/<data>-<slug>.md` estruturado no padrão canônico de **6 Slides**:
   - Slide 1: Capa / Gancho
   - Slide 2: A Dor Invisível / O Conflito Cotidiano
   - Slide 3: A Neurociência / Mecanismo Cerebral
   - Slide 4: O Contraste / A Armadilha Comportamental
   - Slide 5: Síntese Prática (3 Ações)
   - Slide 6: Fechamento & CTA para `deomagalhaes.com.br`
4. **Preset no Studio Visual:** Injetado automaticamente em `social/gerador.html` (`articleSelect` e objeto `PRESETS`) para renderização visual e download dos slides em lote (.PNG).
5. **SEO & Sitemap:** Atualizado via `scripts/generate-sitemap.ps1`.
6. **Deploy:** `git add`, `git commit` e `git push origin main`.

---

## 🛠️ Ferramenta Visual Integrada

O projeto conta com o **Studio Visual de Carrosséis** acessível em:
`social/index.html` (ou `social/gerador.html`).

O estúdio renderiza as imagens em 1080x1080 diretamente no navegador usando HTML5 Canvas com download em lote (.PNG) e cópia de legenda instantânea.
