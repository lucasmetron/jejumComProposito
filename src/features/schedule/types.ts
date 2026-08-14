export type FastingPeriod = "weekly" | "monthly" | "custom";

export type DistributionStrategy = "alternated" | "random";

export type StartOption = "today" | "tomorrow" | "custom";

export interface SpiritualFastEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  targetHours: number;
  isAbsoluteFast: boolean;
  sessionNumber: number;
  totalSessions: number;
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
}

export interface FastingConfig {
  period: FastingPeriod;
  durationDays: number; // Total number of days in the period window (e.g., 7 for weekly, 30 for monthly)
  targetHours: number; // Daily fasting window in hours (e.g., 12, 14, 16, 18, 24)
  frequencyDays: number; // Number of fasting days to schedule within the period
  startTime: string; // "08:00", "12:00", "18:00", or custom "HH:mm"
  timeMode?: "random" | "fixed"; // "random" (sorteio entre horários) or "fixed" (horário fixo)
  allowedStartTimes?: string[]; // Lista de horários participantes do sorteio (ex: ["08:00", "12:00", "18:00"])
  startOption: StartOption;
  customStartDate?: string | Date;
  distribution: DistributionStrategy;
  blockedDays: number[]; // Array of weekday numbers (0-6) that must NEVER be scheduled
  rampUp: boolean; // Gradual increase in fasting hours
  isAbsoluteFast: boolean; // true = absolute (no water), false = with water permitted
  purposeTitle?: string; // Optional custom name/dedication for the spiritual purpose
  intention?: string; // Prayer request or spiritual motive
}
