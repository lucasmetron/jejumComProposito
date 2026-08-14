import { describe, expect, it } from "vitest";
import { generateSpiritualFastSchedule } from "../generator";
import { FastingConfig } from "../types";

describe("Spiritual Fast Schedule Generator", () => {
  const baseConfig: FastingConfig = {
    period: "weekly",
    durationDays: 7,
    targetHours: 16,
    frequencyDays: 3,
    startTime: "08:00",
    startOption: "today",
    distribution: "alternated",
    blockedDays: [],
    rampUp: false,
    isAbsoluteFast: false,
  };

  it("should generate the requested number of fasting events within the period", () => {
    const events = generateSpiritualFastSchedule(baseConfig);
    expect(events).toHaveLength(3);
    expect(events[0].targetHours).toBe(16);
    expect(events[0].title).toContain("(Permitido Água)");
    expect(events[0].description).toContain("Plano de Hidratação");
  });

  it("should NEVER schedule events on blocked days", () => {
    // Block Sunday (0) and Saturday (6)
    const config: FastingConfig = {
      ...baseConfig,
      durationDays: 14,
      frequencyDays: 5,
      blockedDays: [0, 6],
    };

    const events = generateSpiritualFastSchedule(config);
    expect(events.length).toBeGreaterThan(0);
    for (const event of events) {
      expect(event.dayOfWeek).not.toBe(0);
      expect(event.dayOfWeek).not.toBe(6);
    }
  });

  it("should respect alternated distribution spacing", () => {
    const config: FastingConfig = {
      ...baseConfig,
      durationDays: 7,
      frequencyDays: 3,
      distribution: "alternated",
    };

    const events = generateSpiritualFastSchedule(config);
    expect(events).toHaveLength(3);
    // Verify there is at least 1 day between sequential events when possible
    for (let i = 1; i < events.length; i++) {
      const diffMs = events[i].start.getTime() - events[i - 1].start.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      expect(diffDays).toBeGreaterThanOrEqual(1.5);
    }
  });

  it("should implement gradual ramp-up when rampUp is true", () => {
    const config: FastingConfig = {
      ...baseConfig,
      durationDays: 7,
      frequencyDays: 4,
      targetHours: 16,
      rampUp: true,
    };

    const events = generateSpiritualFastSchedule(config);
    expect(events).toHaveLength(4);
    // First session should be lower than target, last session should reach target (16h)
    expect(events[0].targetHours).toBeLessThan(16);
    expect(events[events.length - 1].targetHours).toBe(16);
    // Durations should be non-decreasing
    for (let i = 1; i < events.length; i++) {
      expect(events[i].targetHours).toBeGreaterThanOrEqual(events[i - 1].targetHours);
    }
  });

  it("should format title and description appropriately for absolute fast (no water)", () => {
    const config: FastingConfig = {
      ...baseConfig,
      isAbsoluteFast: true,
      purposeTitle: "Jejum de Daniel",
    };

    const events = generateSpiritualFastSchedule(config);
    expect(events[0].title).toContain("Jejum de Daniel");
    expect(events[0].title).toContain("(Sem Água)");
    expect(events[0].description).toContain("Jejum Absoluto (Sem Água)");
  });

  it("should support timeMode random by rotating through allowedStartTimes", () => {
    const config: FastingConfig = {
      ...baseConfig,
      durationDays: 7,
      frequencyDays: 3,
      timeMode: "random",
      allowedStartTimes: ["08:00", "12:00", "18:00"],
    };

    const events = generateSpiritualFastSchedule(config);
    expect(events).toHaveLength(3);
    expect(events[0].start.getHours()).toBe(8);
    expect(events[1].start.getHours()).toBe(12);
    expect(events[2].start.getHours()).toBe(18);
  });

  it("should support timeMode fixed by keeping the same startTime for all sessions", () => {
    const config: FastingConfig = {
      ...baseConfig,
      durationDays: 7,
      frequencyDays: 3,
      timeMode: "fixed",
      startTime: "12:00",
    };

    const events = generateSpiritualFastSchedule(config);
    expect(events).toHaveLength(3);
    for (const event of events) {
      expect(event.start.getHours()).toBe(12);
      expect(event.start.getMinutes()).toBe(0);
    }
  });
});

