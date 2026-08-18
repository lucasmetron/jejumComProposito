import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft, Heart, ShieldAlert, CheckCircle2, Mail } from "lucide-react";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Termos de Uso - Jejum com Propósito",
  description:
    "Termos e condições de uso da plataforma Jejum com Propósito, incluindo orientações devocionais e isenções de saúde.",
};

export default function TermosPage() {
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
          <FileText className="w-4 h-4" />
          Termos & Condições
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-on-surface dark:text-white tracking-tight">
          Termos de Uso
        </h1>
        <p className="text-xs text-secondary dark:text-gray-400">
          Última atualização: {new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Conteúdo Principal */}
      <div className="space-y-8 text-sm text-on-surface-variant dark:text-gray-300 leading-relaxed">
        {/* 1. Aceitação dos Termos */}
        <Card className="p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-on-surface dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary dark:text-primary-fixed-dim" />
            1. Aceitação dos Termos
          </h2>
          <p>
            Ao acessar ou utilizar o aplicativo <strong>Jejum com Propósito</strong>, você concorda com estes Termos de Uso e com a nossa Política de Privacidade. Caso não concorde com qualquer disposição aqui presente, recomendamos a descontinuidade do uso.
          </p>
        </Card>

        {/* 2. Finalidade da Plataforma */}
        <Card className="p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-on-surface dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary dark:text-primary-fixed-dim" />
            2. Finalidade Exclusivamente Devocional e Espiritual
          </h2>
          <p>
            O <strong>Jejum com Propósito</strong> é um planejador destinado a organizar agendas de oração, estudo bíblico e abstinência com finalidade espiritual.
          </p>
          <p>
            A plataforma não oferece consultas médicas, diagnósticos, planos nutricionais ou prescrições alimentares de qualquer natureza.
          </p>
        </Card>

        {/* 3. Isenção de Responsabilidade Médica e Cuidado com a Saúde */}
        <Card className="p-6 md:p-8 space-y-4 border border-error/20 bg-error/5 dark:bg-red-950/20">
          <h2 className="text-lg font-bold text-error dark:text-red-400 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            3. Cuidado com o Templo do Espírito Santo & Isenção Médica
          </h2>
          <div className="space-y-3 text-xs md:text-sm">
            <p>
              O jejum bíblico é uma prática voluntária de fé. Enfatizamos que o corpo é o <em>Templo do Espírito Santo (1 Coríntios 6:19)</em> e deve ser guardado com sabedoria:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong>Condições Especiais:</strong> Gestantes, lactantes, pessoas com diabetes, histórico de transtornos alimentares ou condições de saúde pré-existentes <u>não devem</u> realizar jejuns prolongados sem autorização médica expressa.</li>
              <li><strong>Sinais do Corpo:</strong> Se sentir tonturas severas, desmaios, fraqueza extrema ou mal-estar, interrompa imediatamente a abstinência e procure assistência de saúde.</li>
              <li><strong>Hidratação:</strong> Recomendamos enfaticamente a manutenção da hidratação contínua com água durante as horas consagradas.</li>
            </ul>
          </div>
        </Card>

        {/* 4. Integração com Terceiros (Google Calendar) */}
        <Card className="p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-on-surface dark:text-white">
            4. Integração com o Google Calendar
          </h2>
          <p>
            A sincronização de escalas com o Google Calendar é um recurso opcional. O usuário é o único responsável pela autorização de acesso e pela manutenção da sua conta pessoal Google.
          </p>
        </Card>

        {/* 5. Modificações do Serviço */}
        <Card className="p-6 md:p-8 space-y-4">
          <h2 className="text-lg font-bold text-on-surface dark:text-white">
            5. Modificações e Disponibilidade
          </h2>
          <p>
            Buscamos manter o serviço em constante aprimoramento e disponibilidade. Contudo, atualizações e manutenções periódicas podem ocorrer sem aviso prévio.
          </p>
        </Card>

        {/* 6. Contato */}
        <Card className="p-6 md:p-8 space-y-3">
          <h2 className="text-lg font-bold text-on-surface dark:text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary dark:text-primary-fixed-dim" />
            6. Contato
          </h2>
          <p>
            Para esclarecimentos sobre estes Termos de Uso, envie um e-mail para:
          </p>
          <p className="font-semibold text-primary dark:text-primary-fixed-dim">
            lucasmetron@gmail.com
          </p>
        </Card>
      </div>
    </div>
  );
}
