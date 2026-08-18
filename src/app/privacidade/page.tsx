import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, Eye, CheckCircle2, ArrowLeft, Mail } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Política de Privacidade - Jejum com Propósito",
  description:
    "Transparência e segurança sobre a utilização de dados no Jejum com Propósito e integração com a Google Calendar API.",
};

export default function PrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto px-container-padding-mobile md:px-container-padding-desktop pb-section-gap flex flex-col gap-10 pt-4 md:pt-8">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-primary-fixed-dim transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao início</span>
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim text-xs font-semibold uppercase tracking-wider w-fit">
          <ShieldCheck className="w-4 h-4" />
          Privacidade & Proteção de Dados
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-on-surface dark:text-white tracking-tight">
          Política de Privacidade
        </h1>
        <p className="text-xs text-secondary dark:text-gray-400">
          Última atualização: {new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Conteúdo Principal */}
      <div className="space-y-8 text-sm text-on-surface-variant dark:text-gray-300 leading-relaxed">
        {/* 1. Visão Geral */}
        <Card className="p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-on-surface dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary dark:text-primary-fixed-dim" />
            1. Visão Geral e Nosso Compromisso
          </h2>
          <p>
            O <strong>Jejum com Propósito</strong> é um planejador devocional e espiritual desenvolvido para auxiliar cristãos a organizarem seus períodos de oração, consagração e abstinência com propósito e ordem.
          </p>
          <p>
            Temos um compromisso inegociável com a sua privacidade. Seus dados de fé, motivos de oração e horários são tratados com o máximo respeito, sigilo e discrição.
          </p>
        </Card>

        {/* 2. Dados Coletados */}
        <Card className="p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-on-surface dark:text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary dark:text-primary-fixed-dim" />
            2. Quais Dados Coletamos
          </h2>
          <p>Coletamos apenas as informações estritamente necessárias para o funcionamento do aplicativo:</p>
          <ul className="space-y-3 list-none pl-1">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-primary dark:text-primary-fixed-dim shrink-0 mt-0.5" />
              <div>
                <strong className="text-on-surface dark:text-white">Dados de Identificação Básica (via Login Google):</strong>
                <p className="text-xs text-secondary dark:text-gray-400 mt-0.5">
                  Nome, endereço de e-mail e foto de perfil pública fornecidos pela sua Conta Google para autenticação na sessão.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-primary dark:text-primary-fixed-dim shrink-0 mt-0.5" />
              <div>
                <strong className="text-on-surface dark:text-white">Parâmetros do Propósito Espiritual:</strong>
                <p className="text-xs text-secondary dark:text-gray-400 mt-0.5">
                  Título do propósito, intenção/motivo de oração, duração em dias, horários de início e término e preferência de lembretes de hidratação.
                </p>
              </div>
            </li>
          </ul>
        </Card>

        {/* 3. Integração com a Google Calendar API */}
        <Card className="p-6 md:p-8 space-y-4 border border-primary/20 bg-primary/5 dark:bg-primary/10">
          <h2 className="text-lg font-bold text-on-surface dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary dark:text-primary-fixed-dim" />
            3. Uso de Dados da Google Calendar API (Conformidade com a Política do Google)
          </h2>
          <p>
            Quando você opta por sincronizar sua escala com o <strong>Google Agenda</strong>, o aplicativo solicita a permissão <code>https://www.googleapis.com/auth/calendar.events</code>.
          </p>
          <p className="font-semibold text-on-surface dark:text-white">
            Como utilizamos esta permissão:
          </p>
          <ul className="space-y-2 text-xs md:text-sm pl-2">
            <li>• <strong>Criar eventos:</strong> Inserir em sua agenda os blocos de horário correspondentes às sessões de jejum e lembretes de oração/hidratação gerados por você.</li>
            <li>• <strong>Atualizar/Remover eventos criados pelo app:</strong> Atualizar os horários ou limpar eventos anteriores de escalas antigas quando você gera um novo cronograma.</li>
          </ul>
          <div className="p-3.5 rounded-xl bg-surface-container-lowest dark:bg-slate-900 border border-primary/20 text-xs space-y-2 mt-2">
            <p className="font-semibold text-primary dark:text-primary-fixed-dim">
              Declaração de Conformidade com a Política de Dados do Usuário do Google:
            </p>
            <p className="text-on-surface-variant dark:text-gray-300">
              O uso e a transferência para qualquer outro aplicativo das informações recebidas das APIs do Google pelo <strong>Jejum com Propósito</strong> estarão em estrita conformidade com a{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline hover:text-primary-fixed-dim"
              >
                Política de Dados do Usuário dos Serviços de API do Google
              </a>, incluindo os requisitos de <em>Uso Limitado (Limited Use Requirements)</em>.
            </p>
            <p className="text-on-surface-variant dark:text-gray-300">
              <strong>Não compartilhamos, não vendemos e não utilizamos seus dados do Google Agenda para publicidade, treinamento de modelos de inteligência artificial ou qualquer outra finalidade alheia ao agendamento de seus jejuns.</strong>
            </p>
          </div>
        </Card>

        {/* 4. Armazenamento e Segurança */}
        <Card className="p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-on-surface dark:text-white">
            4. Armazenamento, Segurança e Retenção
          </h2>
          <p>
            Suas configurações de escala e propósitos ficam armazenadas prioritariamente no armazenamento local do seu próprio navegador (<em>Local Storage</em>) e em tokens de sessão seguros e criptografados (<em>HTTPS / NextAuth</em>).
          </p>
          <p>
            Não mantemos servidores de rastreamento invasivo nem repassamos informações a terceiros.
          </p>
        </Card>

        {/* 5. Como Revogar o Acesso */}
        <Card className="p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-on-surface dark:text-white">
            5. Como Revogar o Acesso à Sua Conta Google
          </h2>
          <p>
            Você pode revogar a qualquer momento a permissão de acesso concedida ao aplicativo diretamente no painel de segurança da sua conta Google:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-xs md:text-sm pl-2">
            <li>Acesse a página de <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer" className="text-primary underline">Aplicativos com acesso à sua conta Google</a>.</li>
            <li>Localize o aplicativo <strong>Jejum com Propósito</strong>.</li>
            <li>Clique em <strong>Remover Acesso</strong>.</li>
          </ol>
        </Card>

        {/* 6. Contato */}
        <Card className="p-6 md:p-8 space-y-3">
          <h2 className="text-lg font-bold text-on-surface dark:text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary dark:text-primary-fixed-dim" />
            6. Dúvidas e Contato
          </h2>
          <p>
            Para qualquer dúvida referente a esta Política de Privacidade ou ao tratamento de seus dados, entre em contato através do e-mail do desenvolvedor responsável:
          </p>
          <p className="font-semibold text-primary dark:text-primary-fixed-dim">
            lucasmetron@gmail.com
          </p>
        </Card>
      </div>
    </div>
  );
}
