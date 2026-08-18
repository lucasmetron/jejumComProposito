import { FastingConfig } from "./types";

export interface BiblicalPreset {
  id: string;
  name: string;
  subtitle: string;
  biblicalReference: string;
  badge: string;
  config: Partial<FastingConfig>;
}

export const BIBLICAL_PRESETS: BiblicalPreset[] = [
  {
    id: "daniel_21",
    name: "Jejum de Daniel",
    subtitle: "21 dias de consagração contínua para discernimento e favor de Deus",
    biblicalReference: "Daniel 10:2-3",
    badge: "21 Dias",
    config: {
      period: "custom",
      durationDays: 21,
      frequencyDays: 21,
      targetHours: 12,
      distribution: "random",
      purposeTitle: "Jejum de Daniel",
      intention: "Busca por discernimento espiritual, quebra de impedimentos e direção divina.",
      isAbsoluteFast: false,
      includeWaterReminders: true,
    },
  },
  {
    id: "ester_3",
    name: "Clamor de Ester",
    subtitle: "3 dias de clamor urgente por livramento, intercessão e causas impossíveis",
    biblicalReference: "Ester 4:16",
    badge: "3 Dias",
    config: {
      period: "custom",
      durationDays: 3,
      frequencyDays: 3,
      targetHours: 12,
      distribution: "random",
      purposeTitle: "Clamor de Ester",
      intention: "Intercessão urgente por causas impossíveis, livramento e favor sobrenatural.",
      isAbsoluteFast: false,
      includeWaterReminders: true,
    },
  },
  {
    id: "semanal_7",
    name: "Consagração Semanal",
    subtitle: "7 dias de busca equilibrada para renovo e fortalecimento espiritual",
    biblicalReference: "Salmos 63:1",
    badge: "7 Dias",
    config: {
      period: "weekly",
      durationDays: 7,
      frequencyDays: 3,
      targetHours: 12,
      distribution: "random",
      purposeTitle: "Consagração Semanal",
      intention: "Renovo da vida de oração, intimidade com o Espírito Santo e fortalecimento espiritual.",
      isAbsoluteFast: false,
      includeWaterReminders: true,
    },
  },
  {
    id: "custom",
    name: "Propósito Personalizado",
    subtitle: "Defina livremente a duração, dias e horários conforme seu chamado espiritual",
    biblicalReference: "Mateus 6:17-18",
    badge: "Livre",
    config: {
      purposeTitle: "",
      intention: "",
    },
  },
];
