## Why

O jejum espiritual é uma prática milenar de devoção e consagração presente em diversas tradições religiosas, exigindo disciplina, constância e planejamento saudável. No entanto, fiéis enfrentam dificuldades ao conciliar rotinas diárias com cronogramas de oração, hidratação adequada e compromissos cotidianos sem comprometer o propósito.

Esta aplicação Next.js fornece um planejador completo e inteligente de jejuns espirituais, permitindo a personalização de períodos (semanais/mensais), janelas de horas alvo, frequências, distribuições espaçadas, bloqueio de dias e progressão gradual (ramp-up). Além disso, oferece exportação em múltiplos formatos (PDF, iCal/ICS) e sincronização nativa com o Google Calendar via OAuth (NextAuth.js), tudo com uma experiência visual devocional, minimalista e acessível orientada ao design system "Jejum com Propósito" e tipografia Google Sans.

## What Changes

- **Setup do Projeto & Design System**:
  - Inicialização do Next.js (App Router, TypeScript, Tailwind CSS).
  - Configuração da tipografia "Google Sans" e paleta de cores temática devocional (tons de ardósia, teal espiritual e superfícies suaves extraídas do design Stitch).
  - Implementação de componentes base acessíveis (estilo shadcn/ui customizado: Button, Card, Dialog/Modal, Accordion, Checkbox, RadioGroup, Slider, Toast).
- **Core Domain & Algoritmo de Agendamento (`spiritual-fast-schedule-generator`)**:
  - Implementação de função pura desacoplada do React (`generateSpiritualFastSchedule`) em TypeScript com Domain-Driven Design (DDD).
  - Suporte a regras de distribuição: Período (semanal/mensal), Frequência, Horas Alvo, Horários de Início pré-definidos (8h, 12h, 18h) ou personalizados, Início (Hoje/Amanhã), Distribuição (Alternado com pulo $\ge 1$ dia ou Aleatório saudável), Bloqueio de Dias da semana, Ramp-up progressivo e Jejum Absoluto (sem água) vs. Jejum com Água (título orientador para hidratação e foco espiritual).
- **Interface e Experiência do Usuário (`spiritual-fast-planner-ui`)**:
  - Página Inicial (`/`), Página do Configurador (`/` ou modal/fluxo integrado) e Página Sobre (`/sobre`), seguindo 100% o design da pasta `stitch_planejador_de_jejum_espiritual`.
  - Formulário tipado e validado com React Hook Form + Zod com mensagens em português devocional (ex: "Escolha pelo menos um dia para seu propósito").
  - Gerenciamento de estado global com Zustand persistido no `localStorage`.
  - Visualização de prévia do cronograma gerado em lista e calendário devocional interativo.
- **Exportação e Sincronização (`spiritual-fast-export-and-sync`)**:
  - Autenticação Google OAuth via NextAuth.js / Auth.js com escopo `calendar.events`.
  - Rota de API `/api/calendar/sync` para envio seguro de eventos `SpiritualFastEvent` para a conta Google Calendar do usuário.
  - Módulos utilitários clientes isolados para exportação de cronograma em `.pdf` (via jsPDF) e `.ics` (iCalendar universal).

## Capabilities

### New Capabilities
- `spiritual-fast-schedule-generator`: Algoritmo puro de domínio para cálculo e distribuição de eventos de jejum espiritual (`SpiritualFastEvent`) com base em frequência, período, janelas de horas, ramp-up, dias bloqueados e orientação de hidratação.
- `spiritual-fast-planner-ui`: Interface de usuário devocional completa em Next.js App Router (páginas `/` e `/sobre`), formulário com React Hook Form + Zod, estado global persistente via Zustand, e layout 100% aderente ao design Stitch com fonte Google Sans.
- `spiritual-fast-export-and-sync`: Sincronização direta com a API do Google Calendar (NextAuth OAuth) e exportadores clientes desacoplados para PDF e arquivo .ICS.

### Modified Capabilities

*(Nenhuma capacidade existente modificada - projeto inicial)*

## Impact

- **Código e Arquitetura**: Novo projeto Next.js estruturado com `/src/app`, `/src/components`, `/src/features`, `/src/store`, `/src/lib`, `/src/types`.
- **Dependências**: `next`, `react`, `react-dom`, `zustand`, `react-hook-form`, `@hookform/resolvers`, `zod`, `next-auth`, `date-fns`, `jspdf`, `lucide-react` / ícones Material Symbols.
- **APIs Externas**: Google Calendar API v3 (Google Cloud Console OAuth 2.0).
