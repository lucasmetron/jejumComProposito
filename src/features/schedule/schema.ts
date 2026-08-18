import { z } from "zod";

export const fastingConfigSchema = z
  .object({
    period: z.enum(["weekly", "monthly", "custom"], {
      required_error: "Selecione o período do seu propósito espiritual.",
    }),
    durationDays: z
      .union([z.number(), z.string()], {
        required_error: "Defina a duração total em dias.",
        invalid_type_error: "A duração deve ser um número válido.",
      })
      .refine(
        (val) => val !== "" && val !== undefined && val !== null && !isNaN(Number(val)),
        {
          message: "Defina a quantidade de dias do propósito.",
        }
      )
      .transform((val) => Number(val))
      .pipe(
        z
          .number()
          .min(1, "A duração deve ser de pelo menos 1 dia.")
          .max(40, "O período máximo de consagração é de 40 dias.")
      ),
    targetHours: z
      .number({
        required_error: "Informe a meta de horas diárias para o jejum.",
        invalid_type_error: "As horas devem ser um número válido.",
      })
      .min(1, "O período mínimo de jejum é de 1 hora.")
      .max(24, "A janela máxima diária é de 24 horas."),
    frequencyDays: z
      .number({
        required_error: "Escolha a frequência de dias para o seu propósito.",
        invalid_type_error: "A frequência deve ser um número válido.",
      })
      .min(1, "Escolha pelo menos 1 dia para seu propósito espiritual."),
    startTime: z
      .string({
        required_error: "Selecione o horário de início da consagração.",
      })
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Informe um horário no formato HH:mm válido.")
      .default("08:00"),
    timeMode: z.enum(["random", "fixed"]).default("random"),
    allowedStartTimes: z
      .array(z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/))
      .default(["08:00", "12:00", "18:00"]),
    startOption: z.enum(["today", "tomorrow", "custom"], {
      required_error: "Indique se deseja iniciar hoje ou amanhã.",
    }),
    customStartDate: z.union([z.string(), z.date()]).optional(),
    distribution: z
      .enum(["alternated", "random"], {
        required_error: "Selecione a distribuição dos dias (Alternado ou Aleatório).",
      })
      .default("random"),
    blockedDays: z
      .array(z.number().min(0).max(6), {
        required_error: "Lista de dias bloqueados inválida.",
      })
      .default([]),
    rampUp: z.boolean().default(false),
    isAbsoluteFast: z.boolean().default(false),
    purposeTitle: z
      .string()
      .max(80, "O título do propósito não deve ultrapassar 80 caracteres.")
      .optional()
      .default(""),
    intention: z
      .string()
      .max(500, "A intenção de oração não deve ultrapassar 500 caracteres.")
      .optional()
      .default(""),
    syncedCalendarEventIds: z.array(z.string()).optional().default([]),
    isGoogleCalendarSynced: z.boolean().optional().default(false),
    includeWaterReminders: z.boolean().optional().default(true),
  })
  .refine(
    (data) => {
      // Frequency cannot exceed total duration days
      return data.frequencyDays <= data.durationDays;
    },
    {
      message: "A quantidade de dias em jejum não pode ultrapassar o total de dias do período.",
      path: ["frequencyDays"],
    }
  )
  .refine(
    (data) => {
      // Ensure there are enough non-blocked days available
      const availableDaysPerWeek = 7 - data.blockedDays.length;
      if (availableDaysPerWeek <= 0) {
        return false;
      }
      return true;
    },
    {
      message: "Você não pode bloquear todos os 7 dias da semana.",
      path: ["blockedDays"],
    }
  );

export type FastingConfigInput = z.input<typeof fastingConfigSchema>;
export type FastingConfigOutput = z.infer<typeof fastingConfigSchema>;
