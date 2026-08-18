import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { BottomNavBar } from "@/components/layout/BottomNavBar";
import { Footer } from "@/components/layout/Footer";
import { PWARegister } from "@/components/pwa/PWARegister";

export const viewport: Viewport = {
  themeColor: "#28626f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Jejum com Propósito - Planejador de Jejum Espiritual",
  description:
    "Organize suas jornadas de oração e consagração com um cronograma devocional inteligente, sincronização com Google Calendar, exportação em PDF e acompanhamento personalizado.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Jejum com Propósito",
  },
  keywords: [
    "jejum espiritual",
    "jejum religioso",
    "consagração",
    "oração",
    "propósito",
    "google calendar sync",
    "planejador de jejum",
    "pwa",
  ],
  verification: {
    google: "fbih7y0D8xoXrQvJXsaJHDJBViuKHRW462m1gjCUZrI",
  },
};

import { Open_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`scroll-smooth ${openSans.variable} ${plusJakartaSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta
          name="google-site-verification"
          content="fbih7y0D8xoXrQvJXsaJHDJBViuKHRW462m1gjCUZrI"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Jejum com Propósito" />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-on-background dark:bg-slate-950 dark:text-gray-100 antialiased selection:bg-primary-fixed selection:text-on-primary-fixed transition-colors">
        <NextAuthProvider>
          <ThemeProvider>
            <PWARegister />
            <TopNavBar />
            <main className="flex-grow pt-[72px] pb-20 md:pb-8">{children}</main>
            <BottomNavBar />
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              className="!p-2.5"
              toastClassName="!rounded-2xl !p-2.5 !font-sans !shadow-lg dark:!bg-slate-900 dark:!text-white dark:!border dark:!border-white/10"
            />
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
