'use client';

import { jsPDF } from 'jspdf';

export type ExportData = {
  hubName: string;
  workshopLabel: string;
  dateRange: string;
  exportedAt: string;
  checklists: { name: string; rows: { text: string; by: string; time: string }[] }[];
  points: { name: string; total: number }[];
  signOffs: { listName: string; by: string; time: string }[];
};

function buildPdf(data: ExportData): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const text = (
    str: string,
    { size = 11, bold = false, gray = 0, gap = 16 }: { size?: number; bold?: boolean; gray?: number; gap?: number } = {}
  ) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(gray);
    const lines: string[] = doc.splitTextToSize(str, maxWidth);
    lines.forEach((line) => {
      ensureSpace(gap);
      doc.text(line, margin, y);
      y += gap;
    });
  };

  text(data.hubName.toUpperCase(), { size: 9, bold: true, gray: 110, gap: 14 });
  text(data.workshopLabel, { size: 18, bold: true, gap: 24 });
  text(data.dateRange, { size: 10, gray: 90, gap: 14 });
  text(`Exported ${data.exportedAt} NZT`, { size: 9, gray: 140, gap: 22 });

  if (data.checklists.length > 0) {
    text('CHECKLISTS', { size: 11, bold: true, gap: 18 });
    data.checklists.forEach((list) => {
      ensureSpace(20);
      text(list.name, { size: 12, bold: true, gap: 16 });
      list.rows.forEach((r) => {
        text(r.text, { size: 10, gap: 13 });
        text(`${r.by} · ${r.time}`, { size: 9, gray: 120, gap: 16 });
      });
      y += 6;
    });
  }

  if (data.points.length > 0) {
    text('POINTS', { size: 11, bold: true, gap: 18 });
    data.points.forEach((p) => {
      text(`${p.name}: ${p.total}`, { size: 11, gap: 16 });
    });
    y += 6;
  }

  if (data.signOffs.length > 0) {
    text('SIGN-OFFS', { size: 11, bold: true, gap: 18 });
    data.signOffs.forEach((s) => {
      text(`${s.listName} — ${s.by} · ${s.time}`, { size: 10, gap: 15 });
    });
  }

  return doc;
}

export default function ExportPdfButton({ data, filename }: { data: ExportData; filename: string }) {
  return (
    <button
      onClick={() => buildPdf(data).save(filename)}
      className="no-print"
      style={{
        padding: '9px 15px',
        borderRadius: 99,
        border: '1px solid var(--border)',
        background: '#fff',
        font: "500 13px/1 var(--font-sans)",
        color: 'var(--accent)',
        whiteSpace: 'nowrap',
      }}
    >
      Download PDF
    </button>
  );
}
