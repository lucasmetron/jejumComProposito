## 1. Setup do Projeto e Design System

- [ ] 1.1 Inicializar projeto Next.js com App Router, TypeScript e Tailwind CSS
- [ ] 1.2 Instalar e configurar dependências principais (`zustand`, `react-hook-form`, `@hookform/resolvers`, `zod`, `date-fns`, `jspdf`, `next-auth`, `lucide-react`)
- [ ] 1.3 Configurar Tailwind CSS, tokens de cores devocionais do Stitch e tipografia Google Sans
- [ ] 1.4 Criar componentes de UI reutilizáveis acessíveis (Button, Card, Input, RadioGroup, Checkbox, Slider, Accordion, Modal/Dialog)

## 2. Core Domain & Algoritmo de Agendamento (`src/features/schedule`)

- [ ] 2.1 Definir interfaces de domínio DDD (`SpiritualFastEvent`, `FastingConfig`) e schema Zod com mensagens devocionais em português
- [ ] 2.2 Implementar função pura `generateSpiritualFastSchedule` desacoplada do React cobrindo períodos, frequências, distribuição alternada/aleatória, dias bloqueados, progressão ramp-up e títulos orientadores de água
- [ ] 2.3 Criar testes unitários para validar todos os cenários e regras do algoritmo de agendamento

## 3. Gerenciamento de Estado Global (`src/store`)

- [ ] 3.1 Implementar `useFastingStore` com Zustand e middleware `persist` para sincronização com `localStorage`
- [ ] 3.2 Conectar ações da store com a geração e visualização reativa de cronogramas

## 4. Interfaces do Usuário e Páginas (`src/app` e `src/components`)

- [ ] 4.1 Criar Layout devocional global com TopNavBar e Footer 100% fiéis ao design Stitch
- [ ] 4.2 Desenvolver o Formulário do Configurador de Jejum com React Hook Form + Zod e controles avançados
- [ ] 4.3 Desenvolver a visualização de Prévia do Cronograma (cards de eventos, timeline, métricas e orientações de hidratação)
- [ ] 4.4 Desenvolver a página Sobre (`/sobre`) com fundamentação bíblica, propósito e orientações de saúde

## 5. Exportação e Integrações (`src/features/export` e `src/app/api`)

- [ ] 5.1 Implementar utilitário isolado `exportToPDF` com jsPDF para geração de documento devocional para impressão
- [ ] 5.2 Implementar utilitário isolado `exportToICS` para exportação de arquivo de calendário universal (.ics)
- [ ] 5.3 Configurar NextAuth.js com Google Provider e escopos OAuth do Google Calendar
- [ ] 5.4 Implementar endpoint de API `/api/calendar/sync` para inserção em lote dos eventos no Google Calendar

## 6. Verificação, Validação Visual e Polimento

- [ ] 6.1 Testar responsividade e fidelidade visual com os protótipos Stitch em desktop e mobile
- [ ] 6.2 Executar build e testes de integridade TypeScript/Lint
