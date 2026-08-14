import type { Metadata } from "next";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Jejum com Propósito - Planejador de Jejum Espiritual",
  description:
    "Organize suas jornadas de oração e consagração com um cronograma devocional inteligente, sincronização com Google Calendar, exportação em PDF e acompanhamento personalizado.",
  keywords: [
    "jejum espiritual",
    "jejum religioso",
    "consagração",
    "oração",
    "propósito",
    "google calendar sync",
    "planejador de jejum",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-on-background antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <NextAuthProvider>
          <TopNavBar />
          <main className="flex-grow pt-[84px]">{children}</main>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
