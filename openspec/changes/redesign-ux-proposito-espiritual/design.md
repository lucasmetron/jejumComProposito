## Context

A interface atual de `/proposito` organiza a configuração em blocos sequenciais técnicos. Para transformar a experiência em um fluxo verdadeiramente espiritual, precisamos reordenar a hierarquia das seções, refinar o design visual e adequar todo o vocabulário.

## Goals / Non-Goals

**Goals:**
- Colocar a **Intenção & Dedicação do Propósito** no topo como primeira etapa essencial da consagração.
- Fornecer **Presets Bíblicos Interativos** (Daniel 21 dias, Ester 3 dias, Consagração Semanal 7 dias, Livre) que preenchem automaticamente os campos com 1 clique.
- Substituir termos de nutrição/fitness ("janela de alimentação", "algoritmo") por termos espirituais ("abstinência e oração", "consagração diária").
- Apresentar um resumo devocional em tempo real em formato de card inspirado, demonstrando como ficará o propósito.
- Assegurar responsividade impecável em mobile e desktop com a paleta warm/spiritual dark/light mode.

**Non-Goals:**
- Não alterar a lógica interna determinística do algoritmo de agendamento (`generator.ts`), apenas adaptar inputs e nomes amigáveis.
- Não remover as opções de personalização avançada (como bloqueio de dias e ramp-up), apenas mantê-las organizadas de forma limpa.

## Decisions

### 1. Novo Fluxo em 4 Etapas Visuais Claras
- **Card 1: O Coração do Propósito (Motivo & Modelo Bíblico)**
  - Seleção de modelo rápido (Presets Bíblicos) + Campo de Título e Motivo de Oração/Clamor.
- **Card 2: Tempo de Consagração (Duração & Frequência)**
  - Total de dias do propósito e quantidade de dias de jejum, com microcopy orientando a perseverança.
- **Card 3: Janela de Abstinência & Oração (Horas & Início)**
  - Quantidade de horas diárias de busca e consagração + horário de início da oração.
- **Card 4: Sincronização & Lembretes de Oração (Google Agenda & Hidratação)**
  - Integração com Google Agenda para notificar horários de oração e cuidado com o corpo.
- **Acordeão: Ajustes Especiais da Escala (Avançado)**
  - Dias bloqueados da semana, distribuição e início gradual.

### 2. Presets Bíblicos
- **Jejum de Daniel**: 21 dias, 12h/dia, distribuição saudável, título "Jejum de Daniel".
- **Clamor de Ester**: 3 dias intensos, 12h/dia, título "Clamor e Intercessão de Ester".
- **Consagração Semanal**: 7 dias (ex: 3 dias na semana), 12h/dia, título "Consagração Semanal".
- **Propósito Livre**: Customizável do zero.

## Risks / Trade-offs

- *[Risco]* Usuários experientes podem querer ir direto para números sem preencher títulos.
  - *Mitigação*: Título e intenção continuam opcionais com sugestões/placeholders inspiradores.
