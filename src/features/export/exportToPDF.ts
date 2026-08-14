import { jsPDF } from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FastingConfig, SpiritualFastEvent } from "../schedule/types";

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
  let y = margin;

  // Header background banner
  doc.setFillColor(65, 100, 106); // primary color #41646a
  doc.roundedRect(margin, y, pageWidth - margin * 2, 28, 3, 3, "F");

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
  doc.roundedRect(margin, y, pageWidth - margin * 2, 28, 2, 2, "FD");

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
    const splitIntention = doc.splitTextToSize(intentionText, pageWidth - margin * 2 - 12);
    doc.text(splitIntention, margin + 6, y + 22);
  }

  y += 34;

  // Section Heading
  doc.setTextColor(65, 100, 106);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Sessões Programadas de Jejum", margin, y);
  y += 6;

  // Table Headers
  doc.setFillColor(229, 239, 255); // surface-container
  doc.rect(margin, y, pageWidth - margin * 2, 8, "F");

  doc.setTextColor(13, 28, 45);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Sessão", margin + 4, y + 5.5);
  doc.text("Data & Dia", margin + 26, y + 5.5);
  doc.text("Horário (Início - Fim)", margin + 80, y + 5.5);
  doc.text("Duração", margin + 130, y + 5.5);
  doc.text("Hidratação", margin + 155, y + 5.5);

  y += 8;

  // Table Rows
  doc.setFont("helvetica", "normal");
  events.forEach((event, idx) => {
    // Check if new page is needed
    if (y > 260) {
      doc.addPage();
      y = margin;
    }

    const isEven = idx % 2 === 0;
    if (isEven) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 249, 255);
    }
    doc.rect(margin, y, pageWidth - margin * 2, 8, "F");

    doc.setTextColor(13, 28, 45);
    doc.setFontSize(8.5);

    // Session
    doc.text(`${event.sessionNumber}/${event.totalSessions}`, margin + 4, y + 5.5);

    // Date & Day
    const dateFormatted = format(event.start, "dd/MM/yyyy (EEE)", { locale: ptBR });
    doc.text(dateFormatted, margin + 26, y + 5.5);

    // Hours
    const hoursFormatted = `${format(event.start, "HH:mm")} às ${format(event.end, "HH:mm")}`;
    doc.text(hoursFormatted, margin + 80, y + 5.5);

    // Duration
    doc.text(`${event.targetHours} horas`, margin + 130, y + 5.5);

    // Hydration
    if (event.isAbsoluteFast) {
      doc.setTextColor(186, 26, 26); // error / caution
      doc.text("Sem Água", margin + 155, y + 5.5);
    } else {
      doc.setTextColor(65, 100, 106); // primary
      doc.text("Água Permitida", margin + 155, y + 5.5);
    }

    y += 8;
  });

  y += 10;
  if (y > 255) {
    doc.addPage();
    y = margin;
  }

  // Devotional Footer Box
  doc.setFillColor(238, 244, 255);
  doc.setDrawColor(193, 200, 201);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 22, 2, 2, "FD");

  doc.setTextColor(65, 100, 106);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Conselho Espiritual & Cuidados", margin + 6, y + 6);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(91, 95, 94);
  const devotionalQuote =
    '"Porque onde estiver o vosso tesouro, aí estará também o vosso coração." (Lucas 12:34)\nMantenha-se em constante oração. Caso sinta algum mal-estar físico súbito, preserve sua saúde e busque orientação.';
  const splitQuote = doc.splitTextToSize(devotionalQuote, pageWidth - margin * 2 - 12);
  doc.text(splitQuote, margin + 6, y + 12);

  // Trigger download
  doc.save(filename);
}
