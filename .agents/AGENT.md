# Diretrizes de UX & Padrões do Sistema - Jejum com Propósito

## 🔄 Regra Obrigatória de Loading & Feedback Visual (Modal + Spinner + Toast)

Sempre que a aplicação realizar qualquer operação assíncrona, salvamento, exclusão, recálculo, sincronização com APIs (Google Agenda, etc.) ou qualquer ação que demande processamento:

1. **Subir Modal de Loading de Tela Cheia com Spinner**:
   - Abrir imediatamente uma modal com backdrop blur e z-index alto (`z-[9999]`).
   - Conter um spinner circular animado (com o ícone de chama espiritual `Flame` no centro ou estilo próprio).
   - Exibir o texto descritivo do que está acontecendo (ex: *"Gerando Jejum..."*, *"Cancelando propósito e limpando Google Agenda..."*, *"Reajustando cronograma..."*).
   - **Tempo mínimo de visualização de 2 segundos**: Mesmo em ações instantâneas locais (sem Google Agenda), manter um delay mínimo de 2 segundos (`await Promise.all([task, new Promise(r => setTimeout(r, 2000))])`) para garantir feedback tátil e percepção de processamento ao usuário.

2. **Fechamento da Modal & Notificação Toast**:
   - Ao término do processamento (ou após os 2 segundos mínimos), **fechar a modal de loading**.
   - Disparar uma notificação Toast via `react-toastify`:
     - **Sucesso**: `toast.success("Mensagem de sucesso...", { position: "top-right", autoClose: 4000 })` com as cores primárias do sistema (`#28626f`).
     - **Erro**: `toast.error("Mensagem de erro detalhada...", { position: "top-right", autoClose: 5000 })`.
     - **Aviso**: `toast.warning("Mensagem de aviso...", { position: "top-right", autoClose: 4000 })`.

3. **Nenhum bloqueio silencioso**:
   - NUNCA executar requisições ou mutações de estado demoradas em segundo plano sem apresentar a modal de carregamento e o toast de conclusão ao usuário.
