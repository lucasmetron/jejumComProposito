-- Criação da tabela de persistência do propósito de jejum do usuário
create table if not exists user_fasting (
  user_email text primary key,
  config jsonb not null,
  events jsonb not null,
  has_configured boolean default false,
  history jsonb default '[]'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ativação de Row Level Security (RLS)
alter table user_fasting enable row level security;

-- Política para permitir que o serviço backend acesse e sincronize os registros
create policy "Allow backend service access"
  on user_fasting
  for all
  using (true)
  with check (true);
