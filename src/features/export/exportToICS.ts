import { format } from "date-fns";
import { SpiritualFastEvent } from "../schedule/types";

function escapeICS(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function formatICSDate(date: Date): string {
  return format(date, "yyyyMMdd'T'HHmmss");
}

export function generateICSContent(events: SpiritualFastEvent[]): string {
  const now = new Date();
  const dtstamp = format(now, "yyyyMMdd'T'HHmmss'Z'");

  const vEvents = events.map((event) => {
    return [
      "BEGIN:VEVENT",
      `UID:${event.id}@jejumcomproposito.com`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${formatICSDate(event.start)}`,
      `DTEND:${formatICSDate(event.end)}`,
      `SUMMARY:${escapeICS(event.title)}`,
      `DESCRIPTION:${escapeICS(event.description)}`,
      "STATUS:CONFIRMED",
      "TRANSP:OPAQUE",
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:Lembrete do ${escapeICS(event.title)}`,
      "TRIGGER:-PT30M",
      "END:VALARM",
      "END:VEVENT",
    ].join("\r\n");
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Jejum com Proposito//Planejador Espiritual//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Jejum com Propósito",
    "X-WR-TIMEZONE:America/Sao_Paulo",
    ...vEvents,
    "END:VCALENDAR",
  ].join("\r\n");
}

export function exportToICS(events: SpiritualFastEvent[], filename = "cronograma-jejum-com-proposito.ics"): void {
  if (!events || events.length === 0) return;

  const content = generateICSContent(events);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
