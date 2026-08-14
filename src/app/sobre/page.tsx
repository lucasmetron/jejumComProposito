import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  Droplets,
  BookOpen,
  Sunset,
  CheckCircle2,
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Flame,
} from "lucide-react";

export const metadata = {
  title: "Sobre o Propósito - Jejum com Propósito",
  description:
    "Compreenda a fundamentação espiritual, a importância da quietude e orientações práticas para sua jornada de jejum e oração.",
};

export default function SobrePage() {
  return (
    <div className="max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop pb-section-gap flex flex-col gap-16 md:gap-20">
      {/* 1. Hero Section */}
      <section className="flex flex-col items-center text-center max-w-4xl mx-auto gap-4 pt-4 md:pt-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container dark:bg-slate-800 text-on-secondary-container dark:text-primary-fixed-dim text-xs font-semibold uppercase tracking-widest border border-outline-variant/30 dark:border-white/10">
          <Flame className="w-4 h-4 text-primary dark:text-primary-fixed-dim" />
          Fundamentação & Devoção
        </div>

        <h1 className="text-3xl md:text-5xl font-light text-on-surface dark:text-white tracking-tight">
          Compreendendo o Propósito
        </h1>

        <p className="text-sm md:text-base text-on-surface-variant dark:text-gray-300 max-w-2xl leading-relaxed">
          O jejum não é apenas a abstenção de alimentos, mas um convite à quietude. É o espaço que
          criamos internamente para escutar com mais clareza, alinhando nossas intenções com nossa
          espiritualidade.
        </p>
      </section>

      {/* 2. Nossa Missão */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
        <div className="md:col-span-6 flex flex-col gap-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low dark:bg-slate-900 border border-outline-variant/30 dark:border-white/10 w-fit text-xs font-semibold text-primary dark:text-primary-fixed-dim">
            <HeartHandshake className="w-4 h-4" />
            Nossa Missão
          </div>

          <h2 className="text-2xl md:text-3xl font-normal text-on-surface dark:text-white leading-snug">
            Criar um santuário digital para a sua prática de fé.
          </h2>

          <div className="text-xs md:text-sm text-on-surface-variant dark:text-gray-300 space-y-4 leading-relaxed">
            <p>
              Em um mundo saturado de ruído e distrações constantes, o <strong>Jejum com Propósito</strong> nasce
              do desejo de oferecer uma ferramenta que não dispute sua atenção, mas que a apoie de
              forma discreta e respeitosa.
            </p>
            <p>
              Acreditamos no <em>&quot;Minimalismo Refinado&quot;</em> — a interface atua como
              uma companheira silenciosa durante seus períodos de oração e consagração, permitindo que você foque no que é essencial: seu relacionamento com Deus.
            </p>
          </div>
        </div>

        <div className="md:col-span-6 bg-surface-container-low dark:bg-slate-900 border border-outline-variant/30 dark:border-white/10 rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-primary dark:text-primary-fixed-dim" />
            <h3 className="text-lg font-semibold text-on-surface dark:text-white">Pilares da Plataforma</h3>
          </div>

          <div className="space-y-4 text-xs md:text-sm text-on-surface-variant dark:text-gray-300">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary dark:text-primary-fixed-dim flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-on-surface dark:text-white block mb-0.5">Desacoplamento e Privacidade</strong>
                Seus propósitos e anotações permanecem salvos em seu dispositivo no navegador ou sincronizados
                somente onde você autorizar explicitamente.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary dark:text-primary-fixed-dim flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-on-surface dark:text-white block mb-0.5">Segurança e Saúde</strong>
                Encorajamos a hidratação contínua e a adaptação progressiva (ramp-up) para evitar
                sobrecargas ao corpo.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary dark:text-primary-fixed-dim flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-on-surface dark:text-white block mb-0.5">Integração Prática</strong>
                Exportação para PDF imprimível, arquivo iCal (.ics) e sincronização com Google Agenda
                para manter seu compromisso acessível no seu dia a dia.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Como se Organizar (Bento Grid) */}
      <section className="flex flex-col gap-8">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-normal text-on-surface dark:text-white">Como se Organizar</h2>
          <p className="text-xs md:text-sm text-on-surface-variant dark:text-gray-400">
            A preparação do ambiente e da mente é fundamental para manter o foco e a constância.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 md:p-8 flex flex-col gap-4 hover:border-primary/50 dark:hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-fixed-dim">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-on-surface dark:text-white mb-1.5">1. Defina a Intenção</h3>
              <p className="text-xs md:text-sm text-on-surface-variant dark:text-gray-400 leading-relaxed">
                Antes de iniciar, tenha clareza sobre o propósito deste jejum. É por direção,
                gratidão, família ou cura? Escreva sua intenção no configurador.
              </p>
            </div>
          </Card>

          <Card className="p-8 flex flex-col gap-4 hover:border-primary/50 dark:hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-fixed-dim">
              <Sunset className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-on-surface dark:text-white mb-1.5">2. Prepare o Espaço</h3>
              <p className="text-xs md:text-sm text-on-surface-variant dark:text-gray-400 leading-relaxed">
                Encontre momentos de silêncio e afaste-se do excesso de notificações. O ambiente
                externo influencia diretamente sua concentração espiritual.
              </p>
            </div>
          </Card>

          <Card className="p-8 flex flex-col gap-4 hover:border-primary/50 dark:hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-fixed-dim">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-on-surface dark:text-white mb-1.5">3. Respeite o Ritmo</h3>
              <p className="text-xs md:text-sm text-on-surface-variant dark:text-gray-400 leading-relaxed">
                O jejum espiritual não é uma competição de resistência física. Ouça seu corpo, utilize
                o recurso de adaptação gradual se for iniciante e mantenha a oração no centro.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* 4. Orientações Práticas */}
      <section className="bg-surface-container-low dark:bg-slate-900 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-10 border border-outline-variant/30 dark:border-white/10">
        <div className="md:w-1/3 flex flex-col gap-3">
          <h2 className="text-2xl font-normal text-on-surface dark:text-white">Orientações Práticas</h2>
          <p className="text-xs md:text-sm text-on-surface-variant dark:text-gray-400 leading-relaxed">
            Dicas essenciais para manter a constância, o bem-estar e o foco durante o seu período de
            consagração.
          </p>
        </div>

        <div className="md:w-2/3 flex flex-col gap-4">
          <div className="flex gap-4 p-5 bg-surface-container-lowest dark:bg-slate-800 rounded-2xl border border-outline-variant/20 dark:border-white/5">
            <Droplets className="w-5 h-5 text-primary dark:text-primary-fixed-dim flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-on-surface dark:text-white">Hidratação é Fundamental</h4>
              <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-1">
                Mantenha a ingestão de água constante para evitar dores de cabeça e fadiga durante as horas consagradas.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-surface-container-lowest dark:bg-slate-800 rounded-2xl border border-outline-variant/20 dark:border-white/5">
            <BookOpen className="w-5 h-5 text-primary dark:text-primary-fixed-dim flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-on-surface dark:text-white">Associe a Palavra</h4>
              <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-1">
                Substitua o tempo de redes sociais pela leitura das escrituras e meditação focada na sua intenção.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-surface-container-lowest dark:bg-slate-800 rounded-2xl border border-outline-variant/20 dark:border-white/5">
            <Sunset className="w-5 h-5 text-primary dark:text-primary-fixed-dim flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-on-surface dark:text-white">O Retorno Gradual</h4>
              <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-1">
                Quebre o jejum com alimentos leves e nutritivos, finalizando o período em espírito de gratidão.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="text-center p-8 md:p-12 bg-surface-container-high dark:bg-slate-900 rounded-3xl border border-outline-variant/30 dark:border-white/10 flex flex-col items-center gap-5">
        <h2 className="text-2xl md:text-3xl font-normal text-on-surface dark:text-white">
          Pronto para dar o primeiro passo em sua consagração?
        </h2>
        <p className="text-xs md:text-sm text-on-surface-variant dark:text-gray-400 max-w-lg">
          Configure sua duração, janelas horárias e intenção no planejador e acompanhe sua jornada.
        </p>
        <Link href="/proposito">
          <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
            Ir para o Configurador de Propósito
          </Button>
        </Link>
      </section>
    </div>
  );
}
