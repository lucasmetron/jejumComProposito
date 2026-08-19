"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useFastingStore } from "@/store/useFastingStore";

export function useUserPurposeSync() {
  const { data: session, status } = useSession();
  const hasConfigured = useFastingStore((s) => s.hasConfigured);
  const events = useFastingStore((s) => s.events);
  const loadFromCloud = useFastingStore((s) => s.loadFromCloud);
  const syncToCloud = useFastingStore((s) => s.syncToCloud);

  const syncedUserEmailRef = useRef<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) {
      syncedUserEmailRef.current = null;
      return;
    }

    const email = session.user.email.toLowerCase().trim();
    if (syncedUserEmailRef.current === email) {
      return;
    }

    async function syncUserData() {
      try {
        const res = await fetch("/api/user/purpose");
        if (!res.ok) return;

        const result = await res.json();
        const cloudData = result.data;

        if (
          cloudData &&
          cloudData.hasConfigured &&
          Array.isArray(cloudData.events) &&
          cloudData.events.length > 0
        ) {
          // Se na nuvem já existe um propósito configurado
          // Se o local estiver vazio ou sem propósito, carrega imediatamente da nuvem
          if (!hasConfigured || events.length === 0) {
            loadFromCloud(cloudData);
          } else {
            // Se ambos têm, mantém a sincronia com a nuvem
            loadFromCloud(cloudData);
          }
        } else if (hasConfigured && events.length > 0) {
          // Se o usuário configurou localmente antes de logar e a nuvem está vazia, envia para a nuvem
          await syncToCloud();
        }

        syncedUserEmailRef.current = email;
      } catch (err) {
        console.warn("Falha na sincronização de propósito com a nuvem:", err);
      }
    }

    syncUserData();
  }, [status, session, hasConfigured, events.length, loadFromCloud, syncToCloud]);
}
