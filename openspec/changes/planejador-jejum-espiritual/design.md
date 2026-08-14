## Context

O projeto é uma aplicação web moderna voltada ao público religioso e devocional para planejamento estruturado e saudável de jejuns espirituais. Ele deve ser implementado do zero utilizando Next.js (App Router, TypeScript, Tailwind CSS) com separação rígida de camadas, tipagem estrita, persistência local e integrações com Google Calendar, PDF e iCalendar (.ICS). O design visual deve seguir 100% o design system fornecido na pasta `stitch_planejador_de_jejum_espiritual` e a tipografia Google Sans.

## Goals / Non-Goals

**Goals:**
- Implementar arquitetura limpa (Clean Code / DDD) desacoplando o núcleo de domínio (`src/features/schedule/generator.ts`) de qualquer dependência do React ou do Next.js.
- Fornecer formulário reativo com React Hook Form e Zod com validações e mensagens devocionais em português.
- Persistir configurações e preferências no navegador usando Zustand (`persist` middleware).
- Renderizar as interfaces de Início (`/`), Configurador e Sobre (`/sobre`) com fidelidade total aos protótipos Stitch e tipografia Google Sans.
- Integrar autenticação Google OAuth via NextAuth.js com escopo `https://www.googleapis.com/auth/calendar.events` e endpoint `/api/calendar/sync`.
- Implementar geradores de PDF (jsPDF) e ICS (.ics) isolados para consumo no frontend.

**Non-Goals:**
- Armazenamento em banco de dados relacional remoto no backend (o estado de usuário e configurações é gerenciado localmente via Zustand/localStorage e autenticado sob demanda para sincronização do Google Calendar).
- Criação de rede social ou chat comunitário (foco estritamente no planejamento pessoal, propósito espiritual e ferramentas de exportação/sincronização).

## Decisions

### 1. Arquitetura em Camadas e Nomenclatura DDD
- **Decisão**: Organizar o código em camadas bem delimitadas:
  - `src/features/schedule`: Núcleo de domínio contendo tipos (`SpiritualFastEvent`, `FastingConfig`), schema Zod (`fastingConfigSchema`), e algoritmo puro de cálculo (`generator.ts`).
  - `src/features/export`: Utilitários puros para PDF (`exportToPDF.ts`) e iCal (`exportToICS.ts`).
  - `src/store`: Store Zustand (`useFastingStore`) com persistência no `localStorage`.
  - `src/components/ui`: Componentes atômicos reutilizáveis (botões, cards, selects, accordions, inputs, badges) com Tailwind CSS baseados no design Stitch.
  - `src/components/devotional`: Componentes compostos como calendário de visualização, timeline de horas, alertas de oração e hidratação.
  - `src/app`: Páginas (`/`, `/sobre`), rota de autenticação NextAuth (`/api/auth/[...nextauth]`) e sincronizador do Google Calendar (`/api/calendar/sync`).
- **Alternativas consideradas**: Monolito de componentes ou lógica embutida em hooks do React. Descartado para garantir testabilidade unitária e independência de framework do algoritmo.

### 2. Algoritmo Determinístico de Agendamento (`generator.ts`)
- **Decisão**: A função `generateSpiritualFastSchedule(config: FastingConfig): SpiritualFastEvent[]` opera como função pura:
  1. Cria um vetor de datas candidatas a partir da data inicial (`today` ou `tomorrow`) pelo período definido (`weekly` = 7 dias ou `monthly` = 30 dias, ou `customDays`).
  2. Filtra removendo dias marcados em `blockedDays` (0=Domingo, 1=Segunda, etc.).
  3. Aplica a estratégia de distribuição:
     - `alternated`: Seleciona dias com intervalo mínimo de 1 dia de descanso.
     - `random`: Seleciona dias distribuídos de forma equilibrada sem dias consecutivos sobrecarregados.
  4. Calcula os horários de início e término com base na hora selecionada (ex: 08:00, 12:00, 18:00) e na janela de horas alvo.
  5. Se `rampUp = true`, calcula duração progressiva (ex: de 60% a 100% das horas alvo ao longo das sessões).
  6. Define o título e descrição: Se `isAbsoluteFast = false`, adiciona "(Permitido Água)" e notas devocionais sobre hidratação; se `true`, formata como "(Sem Água)".
- **Alternativas consideradas**: Mutação direta de datas no estado do componente. Descartado por violar Clean Code e dificultar testes automatizados.

### 3. Design System e Tipografia Google Sans
- **Decisão**: Configurar a fonte Google Sans via Google Fonts/Next Font e importar os tokens de cor extraídos do design Stitch (`primary: #41646a`, `on-surface: #0d1c2d`, `background: #f8f9ff`, `surface-container-lowest: #ffffff`, etc.) no Tailwind CSS config.
- **Alternativas consideradas**: Usar fontes genéricas como Inter ou Roboto. Descartado porque a solicitação do usuário exige explicitamente a fonte Google Sans do print.

### 4. Integração Google Calendar e NextAuth.js
- **Decisão**: Configurar NextAuth.js v4/Auth.js com `GoogleProvider` configurado para solicitar acesso offline e escopo do Calendar:
  `scope: "openid email profile https://www.googleapis.com/auth/calendar.events"`.
  O `access_token` é retornado no callback JWT/session. A rota `/api/calendar/sync` valida a sessão do usuário no servidor e executa chamadas batch para a Google Calendar API v3 (`events.insert`).
- **Alternativas consideradas**: Fazer chamadas client-side diretas com gapi. Descartado por segurança, estabilidade de tokens e melhor tratamento de erros no servidor.

### 5. Exportação PDF e ICS
- **Decisão**: 
  - `exportToPDF`: Utiliza `jspdf` com layout limpo e tipografia consistente, gerando cabeçalho com propósito, tabela de datas, horário de início/fim e diretrizes espirituais.
  - `exportToICS`: Gera arquivo de texto `.ics` padrão RFC 5545 compatível universalmente (Google Agenda, Apple Calendar, Outlook).
- **Alternativas consideradas**: Depender de serviços externos de geração de PDF. Descartado por velocidade, privacidade e facilidade de execução 100% no cliente.

## Risks / Trade-offs

- **[Risk] Configurações de Frequência Incompatíveis com Dias Bloqueados** (ex: solicitar 6 dias na semana mas bloquear 3 dias) → *Mitigação*: Validação dinâmica no Zod e interface visual desabilitando opções incompatíveis ou exibindo alerta amigável de ajuste de propósito.
- **[Risk] Token de Acesso do Google Expirado durante Sync** → *Mitigação*: Implementar refresh token handling na configuração do NextAuth JWT callback e resposta amigável de reautenticação se o token falhar.
- **[Risk] Fuso Horário e Conversão de Datas** → *Mitigação*: Utilizar `date-fns` e objetos nativos `Date` com horários locais explícitos (mantendo consistência entre o horário selecionado pelo usuário e os eventos gerados).
