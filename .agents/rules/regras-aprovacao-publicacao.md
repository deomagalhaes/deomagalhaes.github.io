# Regra de Aprovação e Publicação com Botão de Confirmação — Deo Magalhães

Sempre que você concluir uma etapa de criação, edição, refatoração ou preparação prévia à publicação solicitada pelo usuário no ecossistema `deomagalhaes.github.io` (`deomagalhaes.com.br`), é **OBRIGATÓRIO** exibir um botão interativo de confirmação (`ask_question`) para que o usuário aprove o resultado para publicação com um único clique.

---

## 1. Princípio da Etapa de Pré-Publicação
Nenhum artefato prévio deve ser enviado para produção (`git push`) sem a conferência ativa do usuário. Após entregar a tarefa, exibir as alterações e os links clicáveis (conforme `regras-conferencia-ao-vivo.md`), o agente DEVE acionar o botão de confirmação para saber se o resultado ficou 100% e pode ser publicado.

---

## 2. Acionamento Obrigatório do Botão (`ask_question`)

Ao final da resposta de entrega da etapa e da tabela de links diretos para conferência, invoque a ferramenta `ask_question` com a seguinte estrutura padronizada:

```json
{
  "questions": [
    {
      "question": "O conteúdo foi conferido e está 100% aprovado para publicação em produção?",
      "options": [
        "(Recommended) Sim, está 100%! Pode publicar (Quality Gate + Git Commit + Push)",
        "Preciso de ajustes antes de publicar (descreverei no chat)"
      ],
      "is_multi_select": false
    }
  ]
}
```

---

## 3. Comportamento Imediato Após o Clique de Confirmação

Assim que o usuário selecionar a opção **"Sim, está 100%! Pode publicar..."**:

1. **Executar o Quality Gate Obrigatório:**
   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-quality-gate.ps1
   ```
   *Se houver qualquer erro no Quality Gate, interrompa a publicação, corrija a falha e reporte ao usuário.*

2. **Sincronização e Publicação no Git:**
   - Adicionar os arquivos específicos manipulados (ou conferir com `git status`):
     ```powershell
     git add <arquivos-modificados>
     ```
   - Criar commit semântico institucional claro:
     ```powershell
     git commit -m "Publica <tipo>: <nome/descrição do item>"
     ```
   - Realizar o push imediato para o repositório remoto:
     ```powershell
     git push origin main
     ```

3. **Confirmação Final com Links de Produção:**
   Apresentar ao usuário a confirmação do deploy com:
   - Hash do commit realizado.
   - Status do envio para `origin main`.
   - Links diretos do site no ar:
     - URL Canônica: `https://deomagalhaes.com.br/<slug>`
     - URL GitHub Pages: `https://deomagalhaes.github.io/<slug>`

---

## 4. Se o Usuário Solicitar Ajustes
Se o usuário optar por ajustes ou indicar correções:
1. Realizar as modificações solicitadas.
2. Apresentar novamente os links diretos para inspeção local (`file:///` e `Live Server`).
3. Invocar novamente a ferramenta `ask_question` com o botão de confirmação, repetindo o ciclo até a aprovação 100%.
