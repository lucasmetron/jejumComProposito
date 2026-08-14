import { addDays, addHours, format, isSameDay, parse, setHours, setMinutes, setSeconds } from "date-fns";
import { FastingConfig, SpiritualFastEvent } from "./types";

/**
 * Pure domain function to generate a spiritual fasting schedule.
 * Decoupled from React and any UI framework.
 */
export function generateSpiritualFastSchedule(config: FastingConfig): SpiritualFastEvent[] {
  const {
    durationDays,
    frequencyDays,
    targetHours,
    startTime,
    startOption,
    customStartDate,
    distribution,
    blockedDays = [],
    rampUp = false,
    isAbsoluteFast = false,
    purposeTitle,
    intention,
    timeMode = "random",
    allowedStartTimes = ["08:00", "12:00", "18:00"],
  } = config;

  // 1. Determine base start date
  let baseDate = new Date();
  if (startOption === "tomorrow") {
    baseDate = addDays(baseDate, 1);
  } else if (startOption === "custom" && customStartDate) {
    if (typeof customStartDate === "string") {
      const parts = customStartDate.split("-").map(Number);
      if (parts.length === 3) {
        baseDate = new Date(parts[0], parts[1] - 1, parts[2]);
      } else {
        baseDate = new Date(customStartDate);
      }
    } else {
      baseDate = customStartDate;
    }
  }

  // Parse start hour & minute
  const [startHourStr, startMinuteStr] = (startTime || "08:00").split(":");
  const startHour = parseInt(startHourStr, 10) || 8;
  const startMinute = parseInt(startMinuteStr, 10) || 0;

  // 2. Build list of candidate eligible days within the duration
  const eligibleDates: Date[] = [];
  for (let i = 0; i < durationDays; i++) {
    const candidate = addDays(baseDate, i);
    const dayOfWeek = candidate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    if (!blockedDays.includes(dayOfWeek)) {
      eligibleDates.push(candidate);
    }
  }

  if (eligibleDates.length === 0) {
    return [];
  }

  // 3. Select target dates according to frequency and distribution strategy
  const targetCount = Math.min(frequencyDays, eligibleDates.length);
  const selectedDates: Date[] = [];

  if (targetCount === eligibleDates.length) {
    selectedDates.push(...eligibleDates);
  } else if (distribution === "alternated") {
    // Alternated: try to pick with at least 1 day gap
    let lastPickedIndex = -2;
    for (let i = 0; i < eligibleDates.length && selectedDates.length < targetCount; i++) {
      if (i >= lastPickedIndex + 2) {
        selectedDates.push(eligibleDates[i]);
        lastPickedIndex = i;
      }
    }

    // If couldn't fill targetCount due to tight constraints, backfill remaining eligible days
    if (selectedDates.length < targetCount) {
      for (const date of eligibleDates) {
        if (selectedDates.length >= targetCount) break;
        if (!selectedDates.some((d) => isSameDay(d, date))) {
          selectedDates.push(date);
        }
      }
      // Re-sort chronologically
      selectedDates.sort((a, b) => a.getTime() - b.getTime());
    }
  } else {
    // Random / Healthy balanced spacing across the period
    const step = eligibleDates.length / targetCount;
    for (let i = 0; i < targetCount; i++) {
      const index = Math.min(Math.floor(i * step + step / 4), eligibleDates.length - 1);
      const chosen = eligibleDates[index];
      if (!selectedDates.some((d) => isSameDay(d, chosen))) {
        selectedDates.push(chosen);
      }
    }

    // If any duplicates caused length shortfall, fill remaining
    if (selectedDates.length < targetCount) {
      for (const date of eligibleDates) {
        if (selectedDates.length >= targetCount) break;
        if (!selectedDates.some((d) => isSameDay(d, date))) {
          selectedDates.push(date);
        }
      }
      selectedDates.sort((a, b) => a.getTime() - b.getTime());
    }
  }

  // 4. Calculate hours progression (ramp-up logic)
  const calculateSessionHours = (sessionIndex: number, total: number): number => {
    if (!rampUp || total <= 1) {
      return targetHours;
    }

    // Ramp up starts from 60% of target (min 4h) and climbs linearly to 100% on the final session
    const minHours = Math.max(4, Math.round(targetHours * 0.6));
    const step = (targetHours - minHours) / (total - 1);
    const calculated = Math.round(minHours + step * sessionIndex);
    return Math.min(calculated, targetHours);
  };

  // 5. Build SpiritualFastEvent objects
  return selectedDates.map((date, index) => {
    const sessionHours = calculateSessionHours(index, selectedDates.length);

    let currentStartHour = startHour;
    let currentStartMinute = startMinute;

    if (timeMode === "random") {
      const timesPool =
        allowedStartTimes && allowedStartTimes.length > 0
          ? allowedStartTimes
          : ["08:00", "12:00", "18:00"];
      const timeChoice = timesPool[index % timesPool.length];
      const [hStr, mStr] = timeChoice.split(":");
      currentStartHour = parseInt(hStr, 10) || 8;
      currentStartMinute = parseInt(mStr, 10) || 0;
    }

    // Set precise start timestamp
    let eventStart = setSeconds(setMinutes(setHours(date, currentStartHour), currentStartMinute), 0);
    let eventEnd = addHours(eventStart, sessionHours);

    const waterSuffix = isAbsoluteFast ? "(Sem Água)" : "(Permitido Água)";
    const defaultTitle = isAbsoluteFast
      ? "Propósito de Jejum Absoluto"
      : "Propósito de Jejum";

    const customTitlePrefix = purposeTitle?.trim() ? purposeTitle.trim() : defaultTitle;
    const title = `${customTitlePrefix} ${waterSuffix} - Sessão ${index + 1}/${selectedDates.length}`;

    let hydrationGuidance = "";
    if (isAbsoluteFast) {
      hydrationGuidance = "⚠️ Modalidade: Jejum Absoluto (Sem Água).\nAbstenção total de líquidos durante esta sessão. Mantenha vigília e atenção redobrada.";
    } else if (config.includeWaterReminders !== false) {
      const waterGlassCount = Math.max(1, Math.floor(sessionHours / 2));
      const totalMl = waterGlassCount * 250;

      const waterTimes: string[] = [];
      for (let h = 2; h < sessionHours; h += 2) {
        const waterTime = addHours(eventStart, h);
        waterTimes.push(format(waterTime, "HH:mm"));
      }

      const scheduleStr =
        waterTimes.length > 0
          ? `\n💧 Horários sugeridos de hidratação (1 copo / 250ml): ${waterTimes.join(", ")}`
          : "";

      hydrationGuidance = `💧 Plano de Hidratação (~${totalMl}ml recomendados):\nBeba aproximadamente 250ml a cada 2 horas para proteger a saúde renal e manter o foco espiritual.${scheduleStr}`;
    } else {
      hydrationGuidance = "💧 Modalidade: Com Água (Lembretes específicos de hidratação desativados).";
    }

    const intentionNote = intention?.trim() ? `\n\n🙏 Motivo / Intenção de Oração: ${intention.trim()}` : "";

    const description = [
      `Jornada de Jejum Espiritual - Sessão ${index + 1} de ${selectedDates.length}`,
      `Duração da sessão: ${sessionHours} horas (${format(eventStart, "HH:mm")} às ${format(eventEnd, "HH:mm")})`,
      "",
      hydrationGuidance,
      intentionNote,
    ]
      .filter(Boolean)
      .join("\n");

    return {
      id: `fast-event-${format(eventStart, "yyyyMMdd-HHmm")}-${index + 1}`,
      title,
      description,
      start: eventStart,
      end: eventEnd,
      targetHours: sessionHours,
      isAbsoluteFast,
      sessionNumber: index + 1,
      totalSessions: selectedDates.length,
      dayOfWeek: eventStart.getDay(),
    };
  });
}
