## Why

A página `/proposito` é o coração da experiência do usuário, onde ele consagra seus dias e horários para Deus. Atualmente, a interface carrega termos técnicos ("algoritmo", "parâmetros", "janela de alimentação", "distribuição") e esconde o motivo espiritual (intenção de oração e título) dentro de um acordeão avançado no fim da página.

Esta proposta redefine a experiência de UX/UI da página `/proposito` sob a ótica de um produto estritamente espiritual e devocional:
1. Eleva a **intenção espiritual e o clamor** para o centro da consagração.
2. Substitui jargões nutricionais/fitness ("janela de alimentação", "jejum intermitente") por linguagem bíblica e devocional ("consagração", "tempo de oração e busca").
3. Oferece **modelos bíblicos rápidos** (Daniel, Ester, Consagração Semanal) além do modo personalizado.
4. Estrutura o cadastro em um fluxo intuitivo, fluido e responsivo.

## What Changes

- **Reposicionamento do Motivo Espiritual**: O título do propósito e a intenção de clamor passam a ter destaque imediato (ao invés de ficarem escondidos no rodapé de configurações avançadas).
- **Linguagem e Microcopy Devocional**:
  - Remoção de termos como "Janela de Alimentação", "Algoritmo", "Configurador técnico".
  - Adoção de termos como "Consagração Diária", "Horas de Abstinência & Oração", "Propósito de Clamor".
- **Presets e Modelos de Propósito Bíblico**:
  - Cards rápidos para iniciar modelos conhecidos (Jejum de Daniel 21 dias, Clamor de Ester 3 dias, Consagração Semanal 7 dias ou Livre).
- **Hierarquia Visual e Layout Responsivo**:
  - Resumo em tempo real do propósito com visual devotional (warm slate, teal devocional, bordas suaves).
  - Ajuste perfeito em dispositivos móveis (evitando quebras e botões comprimidos).
- **Lembretes de Oração e Hidratação Devocional**:
  - Foco em cuidar do corpo como "Templo do Espírito Santo" e alertas para momentos de oração no Google Agenda.

## Capabilities

### Modified Capabilities
- `spiritual-fast-planner-ui`: Atualiza os requisitos de UX, microcopy, hierarquia devocional, presets bíblicos e fluxo intuitivo na página `/proposito`.

## Impact

- **Código Afetado**:
  - `src/app/proposito/page.tsx`
  - `src/components/configurator/FastingConfiguratorForm.tsx`
  - `src/components/schedule/SchedulePreview.tsx`
  - `src/store/useFastingStore.ts` (suporte a presets e novo estado de intenção)
- **APIs/Dependências**: Nenhuma dependência externa nova necessária.
