import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FastingConfig, SpiritualFastEvent } from "@/features/schedule/types";
import { generateSpiritualFastSchedule } from "@/features/schedule/generator";

export interface FastingHistoryItem {
  id: string;
  title: string;
  completedAt: string;
  status: "completed" | "interrupted";
  reason?: string;
  reflection?: string;
  totalDays: number;
  totalHours: number;
}

export interface FastingStoreState {
  hasConfigured: boolean;
  config: FastingConfig;
  events: SpiritualFastEvent[];
  selectedEventId: string | null;
  isGenerating: boolean;
  history: FastingHistoryItem[];
  isCloudSynced: boolean;

  // Actions
  setConfig: (config: Partial<FastingConfig>) => void;
  generateSchedule: () => SpiritualFastEvent[];
  saveAndGenerateSchedule: () => SpiritualFastEvent[];
  rescheduleSchedule: (
    startOption: "today" | "tomorrow" | "custom",
    customStartDate?: string | Date
  ) => SpiritualFastEvent[];
  interruptFast: (reason?: string, reflection?: string) => void;
  resetConfig: () => void;
  clearFastingData: () => void;
  setSelectedEventId: (id: string | null) => void;
  setSyncedCalendarEventIds: (ids: string[]) => void;
  setIsGoogleCalendarSynced: (synced: boolean) => void;
  loadFromCloud: (payload: {
    config: FastingConfig;
    events: SpiritualFastEvent[];
    hasConfigured: boolean;
    history?: FastingHistoryItem[];
  }) => void;
  syncToCloud: () => Promise<boolean>;
}

export const DEFAULT_CONFIG: FastingConfig = {
  period: "weekly",
  durationDays: 7,
  targetHours: 12,
  frequencyDays: 7,
  startTime: "08:00",
  timeMode: "random",
  allowedStartTimes: ["08:00", "12:00", "18:00"],
  startOption: "tomorrow",
  distribution: "random",
  blockedDays: [],
  rampUp: false,
  isAbsoluteFast: false,
  purposeTitle: "",
  intention: "",
  syncedCalendarEventIds: [],
  isGoogleCalendarSynced: false,
  includeWaterReminders: true,
};

// Helper interno para enviar dados ao backend de forma assíncrona e segura
export async function pushPurposeToCloud(state: {
  config: FastingConfig;
  events: SpiritualFastEvent[];
  hasConfigured: boolean;
  history: FastingHistoryItem[];
}) {
  try {
    const res = await fetch("/api/user/purpose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        config: state.config,
        events: state.events,
        hasConfigured: state.hasConfigured,
        history: state.history,
      }),
    });
    return res.ok;
  } catch (e) {
    console.warn("Aviso ao sincronizar propósito na nuvem:", e);
    return false;
  }
}

export const useFastingStore = create<FastingStoreState>()(
  persist(
    (set, get) => ({
      hasConfigured: false,
      config: DEFAULT_CONFIG,
      events: generateSpiritualFastSchedule(DEFAULT_CONFIG),
      selectedEventId: null,
      isGenerating: false,
      history: [],
      isCloudSynced: false,

      setConfig: (newConfig) => {
        set((state) => {
          const updatedConfig = { ...state.config, ...newConfig };
          const updatedEvents = generateSpiritualFastSchedule(updatedConfig);
          return {
            config: updatedConfig,
            events: updatedEvents,
          };
        });
      },

      generateSchedule: () => {
        const { config } = get();
        const events = generateSpiritualFastSchedule(config);
        set({ events });
        return events;
      },

      saveAndGenerateSchedule: () => {
        const { config } = get();
        const events = generateSpiritualFastSchedule(config);
        const newState = {
          events,
          hasConfigured: true,
        };
        set(newState);

        // Dispara sync na nuvem se autenticado
        pushPurposeToCloud({
          config,
          events,
          hasConfigured: true,
          history: get().history,
        });

        return events;
      },

      rescheduleSchedule: (
        startOption: "today" | "tomorrow" | "custom",
        customStartDate?: string | Date
      ) => {
        const { config } = get();
        const updatedConfig = {
          ...config,
          startOption,
          customStartDate: customStartDate !== undefined ? customStartDate : config.customStartDate,
        };
        const updatedEvents = generateSpiritualFastSchedule(updatedConfig);
        const newState = {
          config: updatedConfig,
          events: updatedEvents,
          hasConfigured: true,
        };
        set(newState);

        // Dispara sync na nuvem se autenticado
        pushPurposeToCloud({
          config: updatedConfig,
          events: updatedEvents,
          hasConfigured: true,
          history: get().history,
        });

        return updatedEvents;
      },

      interruptFast: (reason?: string, reflection?: string) => {
        const { config, events, history } = get();
        const historyEntry: FastingHistoryItem = {
          id: `hist-${Date.now()}`,
          title: config.purposeTitle || "Propósito Espiritual",
          completedAt: new Date().toISOString(),
          status: "interrupted",
          reason: reason || "Interrompido por imprevisto / saúde",
          reflection: reflection || "",
          totalDays: events.length,
          totalHours: events.reduce((acc, e) => acc + e.targetHours, 0),
        };

        const newHistory = [historyEntry, ...history];

        set({
          hasConfigured: false,
          events: [],
          selectedEventId: null,
          config: DEFAULT_CONFIG,
          history: newHistory,
        });

        // Dispara sync na nuvem se autenticado
        pushPurposeToCloud({
          config: DEFAULT_CONFIG,
          events: [],
          hasConfigured: false,
          history: newHistory,
        });
      },

      resetConfig: () => {
        const events = generateSpiritualFastSchedule(DEFAULT_CONFIG);
        set({
          config: DEFAULT_CONFIG,
          events,
          hasConfigured: true,
          selectedEventId: null,
        });
      },

      clearFastingData: () => {
        set({
          config: DEFAULT_CONFIG,
          events: [],
          hasConfigured: false,
          selectedEventId: null,
        });

        // Dispara sync na nuvem se autenticado
        pushPurposeToCloud({
          config: DEFAULT_CONFIG,
          events: [],
          hasConfigured: false,
          history: get().history,
        });
      },

      setSelectedEventId: (id) => {
        set({ selectedEventId: id });
      },

      setSyncedCalendarEventIds: (ids) => {
        set((state) => {
          const updatedConfig = {
            ...state.config,
            syncedCalendarEventIds: ids,
            isGoogleCalendarSynced: ids.length > 0,
          };
          // Sync changes
          pushPurposeToCloud({
            config: updatedConfig,
            events: state.events,
            hasConfigured: state.hasConfigured,
            history: state.history,
          });
          return { config: updatedConfig };
        });
      },

      setIsGoogleCalendarSynced: (synced) => {
        set((state) => {
          const updatedConfig = {
            ...state.config,
            isGoogleCalendarSynced: synced,
          };
          return { config: updatedConfig };
        });
      },

      loadFromCloud: (payload) => {
        const parsedEvents = (payload.events || []).map((e) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
        }));

        set({
          config: payload.config || DEFAULT_CONFIG,
          events: parsedEvents,
          hasConfigured: payload.hasConfigured ?? parsedEvents.length > 0,
          history: payload.history || [],
          isCloudSynced: true,
        });
      },

      syncToCloud: async () => {
        const { config, events, hasConfigured, history } = get();
        const success = await pushPurposeToCloud({
          config,
          events,
          hasConfigured,
          history,
        });
        if (success) {
          set({ isCloudSynced: true });
        }
        return success;
      },
    }),
    {
      name: "jejum-proposito-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && state.events) {
          state.events = state.events.map((e) => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
          }));
        }
      },
    }
  )
);
