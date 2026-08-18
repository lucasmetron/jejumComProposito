"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { BookOpen, Sparkles } from "lucide-react";
import { VerseData, getDailyVerseCycleKey } from "@/lib/verseService";

interface VerseCache {
  dateKey: string;
  language: string;
  data: VerseData;
}

const STORAGE_KEY = "jejum_verse_of_the_day_cache";

interface VerseOfTheDayProps {
  initialVerse?: VerseData;
}

export function VerseOfTheDay({ initialVerse }: VerseOfTheDayProps) {
  const [verseData, setVerseData] = useState<VerseData | null>(initialVerse || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialVerse);

  useEffect(() => {
    // Se o servidor já forneceu o versículo inicial, salvamos no cache local e não precisamos fazer nova requisição
    if (initialVerse) {
      setVerseData(initialVerse);
      setIsLoading(false);
      try {
        const cycleKey = getDailyVerseCycleKey();
        const language = typeof navigator !== "undefined" ? navigator.language || "pt-BR" : "pt-BR";
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            dateKey: cycleKey,
            language,
            data: initialVerse,
          })
        );
      } catch {}
      return;
    }

    // Fallback caso não venha do servidor
    const fetchDailyVerse = async () => {
      const cycleKey = getDailyVerseCycleKey();
      const language = typeof navigator !== "undefined" ? navigator.language || "pt-BR" : "pt-BR";

      if (typeof window !== "undefined") {
        try {
          const cachedStr = localStorage.getItem(STORAGE_KEY);
          if (cachedStr) {
            const cached: VerseCache = JSON.parse(cachedStr);
            if (
              cached.dateKey === cycleKey &&
              cached.language === language &&
              cached.data &&
              cached.data.reference?.includes("NVT")
            ) {
              setVerseData(cached.data);
              setIsLoading(false);
              return;
            }
          }
        } catch {}
      }

      setIsLoading(true);
      try {
        const res = await fetch("/api/verse-of-the-day", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setVerseData(json.data);
            localStorage.setItem(
              STORAGE_KEY,
              JSON.stringify({
                dateKey: cycleKey,
                language,
                data: json.data,
              })
            );
          }
        }
      } catch (err) {
        console.error("Erro ao carregar versículo:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyVerse();
  }, [initialVerse]);

  return (
    <Card className="p-8 text-center relative overflow-hidden bg-gradient-to-b from-surface-container-lowest via-surface-container-lowest to-primary/5 dark:from-slate-900 dark:via-slate-900 dark:to-primary/10 border-outline-variant/30">
      <div className="flex flex-col items-center max-w-2xl mx-auto space-y-4">
        {/* Badge Versículo do Dia */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-fixed-dim text-xs font-semibold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Versículo do Dia</span>
        </div>

        {isLoading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3 animate-in fade-in duration-200">
            <div className="w-8 h-8 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin" />
            <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-secondary dark:text-gray-300">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span>Carregando versículo do dia...</span>
            </div>
          </div>
        ) : verseData ? (
          <div className="space-y-3 animate-in fade-in duration-300">
            {/* Texto do Versículo */}
            <blockquote className="text-xl md:text-2xl font-semibold text-on-surface dark:text-white leading-relaxed tracking-tight italic">
              &quot;{verseData.verse}&quot;
            </blockquote>

            {/* Referência Bíblica */}
            <div className="text-sm font-bold text-primary dark:text-primary-fixed-dim tracking-wide">
              — {verseData.reference}
            </div>

            {/* Reflexão Devocional */}
            {verseData.reflection && (
              <p className="text-xs md:text-sm text-on-surface-variant dark:text-gray-400 max-w-lg mx-auto leading-relaxed pt-1">
                {verseData.reflection}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-secondary dark:text-gray-400">
            &quot;O silêncio do corpo é a voz do espírito.&quot;
          </p>
        )}
      </div>
    </Card>
  );
}
