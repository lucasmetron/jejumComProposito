import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FastingConfig, SpiritualFastEvent } from "@/features/schedule/types";
import { generateSpiritualFastSchedule } from "@/features/schedule/generator";

export interface FastingStoreState {
  config: FastingConfig;
  events: SpiritualFastEvent[];
  selectedEventId: string | null;
  isGenerating: boolean;
  
  // Actions
  setConfig: (config: Partial<FastingConfig>) => void;
  generateSchedule: () => SpiritualFastEvent[];
  resetConfig: () => void;
  setSelectedEventId: (id: string | null) => void;
}

const DEFAULT_CONFIG: FastingConfig = {
  period: "weekly",
  durationDays: 7,
  targetHours: 16,
  frequencyDays: 3,
  startTime: "08:00",
  startOption: "tomorrow",
  distribution: "alternated",
  blockedDays: [],
  rampUp: false,
  isAbsoluteFast: false,
  purposeTitle: "",
  intention: "",
};

export const useFastingStore = create<FastingStoreState>()(
  persist(
    (set, get) => ({
      config: DEFAULT_CONFIG,
      events: [],
      selectedEventId: null,
      isGenerating: false,

      setConfig: (newConfig) => {
        set((state) => {
          const updatedConfig = { ...state.config, ...newConfig };
          // Automatically regenerate events when config updates
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

      resetConfig: () => {
        const events = generateSpiritualFastSchedule(DEFAULT_CONFIG);
        set({
          config: DEFAULT_CONFIG,
          events,
          selectedEventId: null,
        });
      },

      setSelectedEventId: (id) => {
        set({ selectedEventId: id });
      },
    }),
    {
      name: "jejum-proposito-storage",
      storage: createJSONStorage(() => localStorage),
      // Custom deserializer to convert ISO date strings back to Date objects in events
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
