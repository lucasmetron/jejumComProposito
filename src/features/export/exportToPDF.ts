import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FastingConfig, SpiritualFastEvent } from "../schedule/types";
import { FALLBACK_VERSES_NVT, VerseData } from "@/lib/verseService";

export function exportToPDF(
  events: SpiritualFastEvent[],
  config: FastingConfig,
  filename = "cronograma-jejum-com-proposito.pdf"
): void {
  if (!events || events.length === 0) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2; // 174mm
  let y = margin;

  // Header background banner
  doc.setFillColor(40, 98, 111); // primary color #28626f
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, "F");

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("JEJUM COM PROPÓSITO", margin + 8, y + 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Cronograma de Consagração & Oração", margin + 8, y + 18);

  const issueDate = `Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}`;
  doc.setFontSize(8);
  doc.text(issueDate, pageWidth - margin - 8, y + 18, { align: "right" });

  y += 34;

  // Purpose & Details Card
  doc.setFillColor(248, 249, 255); // background / surface
  doc.setDrawColor(193, 200, 201); // outline-variant
  doc.roundedRect(margin, y, contentWidth, 28, 2, 2, "FD");

  doc.setTextColor(13, 28, 45); // on-surface
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  const titleText = config.purposeTitle?.trim() ? config.purposeTitle.trim() : "Propósito Pessoal de Consagração";
  doc.text(`Propósito: ${titleText}`, margin + 6, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(65, 72, 73); // on-surface-variant

  const targetInfo = `Janela Alvo: ${config.targetHours}h | Frequência: ${events.length} sessões | Tipo: ${
    config.isAbsoluteFast ? "Jejum Absoluto (Sem Água)" : "Jejum com Água Permitida"
  }${config.rampUp ? " (Com Ramp-up)" : ""}`;
  doc.text(targetInfo, margin + 6, y + 15);

  if (config.intention?.trim()) {
    doc.setFont("helvetica", "italic");
    const intentionText = `Intenção: "${config.intention.trim()}"`;
    const splitIntention = doc.splitTextToSize(intentionText, contentWidth - 12);
    doc.text(splitIntention, margin + 6, y + 22);
  }

  y += 34;

  // Section Heading
  doc.setTextColor(40, 98, 111);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Sessões Programadas de Jejum", margin, y);
  y += 6;

  // Column X offsets (Balanced to prevent overflow)
  const colSession = margin + 4;       // 22mm
  const colDate = margin + 20;          // 38mm
  const colTime = margin + 68;          // 86mm
  const colDuration = margin + 110;     // 128mm
  const colHydration = margin + 138;    // 156mm (ends ~180mm, well inside 192mm)

  // Table Headers
  doc.setFillColor(229, 239, 255); // surface-container
  doc.rect(margin, y, contentWidth, 8, "F");

  doc.setTextColor(13, 28, 45);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text("Sessão", colSession, y + 5.5);
  doc.text("Data & Dia", colDate, y + 5.5);
  doc.text("Horário (Início - Fim)", colTime, y + 5.5);
  doc.text("Duração", colDuration, y + 5.5);
  doc.text("Hidratação", colHydration, y + 5.5);

  y += 8;

  // Table Rows
  doc.setFont("helvetica", "normal");
  events.forEach((event, idx) => {
    // Check if new page is needed
    if (y > 255) {
      doc.addPage();
      y = margin;
    }

    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 249, 255);
    }
    doc.rect(margin, y, contentWidth, 8, "F");

    doc.setTextColor(13, 28, 45);
    doc.setFontSize(8);

    // Session
    doc.text(`${event.sessionNumber}/${event.totalSessions}`, colSession, y + 5.5);

    // Date & Day
    const dateFormatted = format(event.start, "dd/MM/yyyy (EEE)", { locale: ptBR });
    doc.text(dateFormatted, colDate, y + 5.5);

    // Hours
    const hoursFormatted = `${format(event.start, "HH:mm")} às ${format(event.end, "HH:mm")}`;
    doc.text(hoursFormatted, colTime, y + 5.5);

    // Duration
    doc.text(`${event.targetHours} horas`, colDuration, y + 5.5);

    // Hydration
    if (event.isAbsoluteFast) {
      doc.setTextColor(186, 26, 26); // error
      doc.text("Sem Água", colHydration, y + 5.5);
    } else {
      doc.setTextColor(40, 98, 111); // primary
      doc.text("Água Permitida", colHydration, y + 5.5);
    }

    y += 8;
  });

  y += 8;

  // Obtain Versículo do Dia (from cache or daily rotation)
  let verseData: VerseData = FALLBACK_VERSES_NVT[0];
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const cached = localStorage.getItem("jejum_verse_of_the_day_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.data?.verse) {
          verseData = parsed.data;
        }
      }
    }
  } catch {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    verseData = FALLBACK_VERSES_NVT[dayOfYear % FALLBACK_VERSES_NVT.length];
  }

  // Calculate box height dynamically based on verse text size
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  const verseLines = doc.splitTextToSize(`"${verseData.verse}" — ${verseData.reference}`, contentWidth - 14);
  const reflectionText = verseData.reflection || "Mantenha-se em constante oração e comunhão com Deus durante toda a jornada de jejum.";
  const reflectionLines = doc.splitTextToSize(reflectionText, contentWidth - 14);

  const boxHeight = 16 + (verseLines.length * 3.8) + (reflectionLines.length * 3.5);

  if (y + boxHeight > 275) {
    doc.addPage();
    y = margin;
  }

  // Devotional Card
  doc.setFillColor(238, 244, 255);
  doc.setDrawColor(193, 200, 201);
  doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, "FD");

  // Title
  doc.setTextColor(40, 98, 111);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Versículo do Dia & Conselho Espiritual", margin + 6, y + 6);

  // Verse & Reference
  let textY = y + 11.5;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text(verseLines, margin + 6, textY);

  textY += (verseLines.length * 3.8) + 2;

  // Reflection / Guidance
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80, 90, 100);
  doc.text(reflectionLines, margin + 6, textY);

  // Trigger download
  doc.save(filename);
}
