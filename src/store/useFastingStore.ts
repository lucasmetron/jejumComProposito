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
  
  // Actions
  setConfig: (config: Partial<FastingConfig>) => void;
  generateSchedule: () => SpiritualFastEvent[];
  saveAndGenerateSchedule: () => SpiritualFastEvent[];
  rescheduleSchedule: (startOption: "today" | "tomorrow" | "custom", customStartDate?: string | Date) => SpiritualFastEvent[];
  interruptFast: (reason?: string, reflection?: string) => void;
  resetConfig: () => void;
  clearFastingData: () => void;
  setSelectedEventId: (id: string | null) => void;
  setSyncedCalendarEventIds: (ids: string[]) => void;
  setIsGoogleCalendarSynced: (synced: boolean) => void;
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
  distribution: "alternated",
  blockedDays: [],
  rampUp: false,
  isAbsoluteFast: false,
  purposeTitle: "",
  intention: "",
  syncedCalendarEventIds: [],
  isGoogleCalendarSynced: false,
};

export const useFastingStore = create<FastingStoreState>()(
  persist(
    (set, get) => ({
      hasConfigured: false,
      config: DEFAULT_CONFIG,
      events: [],
      selectedEventId: null,
      isGenerating: false,
      history: [],

      setConfig: (newConfig) => {
        set((state) => {
          const updatedConfig = { ...state.config, ...newConfig };
          if (state.hasConfigured) {
            const updatedEvents = generateSpiritualFastSchedule(updatedConfig);
            return {
              config: updatedConfig,
              events: updatedEvents,
            };
          }
          return { config: updatedConfig };
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
        set({
          events,
          hasConfigured: true,
        });
        return events;
      },

      rescheduleSchedule: (startOption: "today" | "tomorrow" | "custom", customStartDate?: string | Date) => {
        const { config } = get();
        const updatedConfig = {
          ...config,
          startOption,
          customStartDate: customStartDate !== undefined ? customStartDate : config.customStartDate,
        };
        const updatedEvents = generateSpiritualFastSchedule(updatedConfig);
        set({
          config: updatedConfig,
          events: updatedEvents,
          hasConfigured: true,
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

        set({
          hasConfigured: false,
          events: [],
          selectedEventId: null,
          config: DEFAULT_CONFIG,
          history: [historyEntry, ...history],
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
      },

      setSelectedEventId: (id) => {
        set({ selectedEventId: id });
      },

      setSyncedCalendarEventIds: (ids) => {
        set((state) => ({
          config: {
            ...state.config,
            syncedCalendarEventIds: ids,
            isGoogleCalendarSynced: ids.length > 0,
          },
        }));
      },

      setIsGoogleCalendarSynced: (synced) => {
        set((state) => ({
          config: {
            ...state.config,
            isGoogleCalendarSynced: synced,
          },
        }));
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
