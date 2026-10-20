import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import { getProfile } from '@/lib/auth';
import { nzNow } from '@/lib/logic';
import { loadWorkshopRecords, formatDate } from '@/lib/workshopRecords';

// Real PDF file download for a workshop's history. Replaces relying on
// window.print(), which silently does nothing in phone in-app browsers and
// home-screen web apps.

const PAGE_W = 595.28; // A4
const PAGE_H = 841.89;
const MARGIN = 48;
const INK = rgb(0.106, 0.102, 0.122);
const MUTED = rgb(0.45, 0.45, 0.47);

// The built-in PDF fonts only cover Latin text; swap anything else (emoji
// etc.) for '?' rather than failing the whole export.
function safe(font: PDFFont, text: string) {
  let out = '';
  for (const ch of text.replace(/\s+/g, ' ')) {
    try {
      font.encodeText(ch);
      out += ch;
    } catch {
      out += '?';
    }
  }
  return out;
}

function wrap(font: PDFFont, size: number, text: string, width: number) {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= width || !line) line = next;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function GET(_req: Request, ctx: RouteContext<'/admin/workshops/[id]/pdf'>) {
  const { id } = await ctx.params;
  const profile = await getProfile();
  if (!profile || profile.role !== 'owner') return new Response('Not allowed', { status: 403 });

  const records = await loadWorkshopRecords(Number(id));
  if (!records) return new Response('Workshop not found', { status: 404 });

  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page: PDFPage = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;
  const ensure = (h: number) => {
    if (y - h < MARGIN) {
      page = doc.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - MARGIN;
    }
  };
  const text = (s: string, x: number, size: number, font = regular, color = INK) =>
    page.drawText(safe(font, s), { x, y: y - size, size, font, color });
  const rule = () => page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.5, color: rgb(0.85, 0.84, 0.82) });

  const title = records.label || 'Workshop';
  const exportedAt = nzNow().toLocaleString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });

  text(records.hub.name.toUpperCase(), MARGIN, 10, bold, MUTED);
  y -= 16;
  text(title, MARGIN, 20, bold);
  y -= 28;
  text(`${formatDate(records.start)} – ${formatDate(records.end)}`, MARGIN, 11);
  y -= 15;
  text(`Exported ${exportedAt} NZT`, MARGIN, 9, regular, MUTED);
  y -= 24;

  const heading = (s: string) => {
    ensure(40);
    y -= 8;
    text(s.toUpperCase(), MARGIN, 11, bold);
    y -= 18;
  };

  const contentW = PAGE_W - MARGIN * 2;
  const metaW = 150;
  const taskW = contentW - metaW - 12;

  if (records.checklists.length === 0 && !records.hasAwards && records.signOffs.length === 0) {
    text('No records for this workshop.', MARGIN, 11, regular, MUTED);
  }

  if (records.checklists.length > 0) heading('Checklists');
  for (const section of records.checklists) {
    ensure(40);
    y -= 4;
    text(section.title, MARGIN, 11.5, bold);
    y -= 18;
    for (const r of section.rows) {
      const lines = wrap(regular, 9.5, safe(regular, r.text), taskW);
      const h = lines.length * 12.5;
      ensure(h + 6);
      lines.forEach((l, i) => page.drawText(l, { x: MARGIN, y: y - 9.5 - i * 12.5, size: 9.5, font: regular, color: INK }));
      const meta = safe(regular, `${r.time} · ${r.by}`);
      const metaLines = wrap(regular, 8.5, meta, metaW);
      metaLines.forEach((l, i) =>
        page.drawText(l, { x: PAGE_W - MARGIN - regular.widthOfTextAtSize(l, 8.5), y: y - 9.5 - i * 12, size: 8.5, font: regular, color: MUTED })
      );
      y -= Math.max(h, metaLines.length * 12) + 6;
    }
    y -= 4;
    rule();
    y -= 8;
  }

  if (records.hasAwards && records.points.length > 0) {
    heading('Points');
    for (const { group, total } of records.points) {
      ensure(16);
      text(group.name, MARGIN, 10.5);
      const t = String(total);
      page.drawText(t, { x: PAGE_W - MARGIN - bold.widthOfTextAtSize(t, 10.5), y: y - 10.5, size: 10.5, font: bold, color: INK });
      y -= 16;
    }
    y -= 8;
  }

  if (records.signOffs.length > 0) {
    heading('Sign-offs');
    for (const s of records.signOffs) {
      ensure(16);
      text(s.title, MARGIN, 10.5);
      const meta = safe(regular, `${s.by} · ${s.time}`);
      page.drawText(meta, { x: PAGE_W - MARGIN - regular.widthOfTextAtSize(meta, 9), y: y - 10, size: 9, font: regular, color: MUTED });
      y -= 16;
    }
  }

  const pages = doc.getPages();
  pages.forEach((p, i) => {
    const label = `${records.hub.name} · ${title} · Page ${i + 1} of ${pages.length}`;
    p.drawText(safe(regular, label), { x: MARGIN, y: MARGIN / 2, size: 8, font: regular, color: MUTED });
  });

  const bytes = await doc.save();
  const filename = `${slug(`${records.hub.name} ${title} ${formatDate(records.start)}`)}.pdf`;
  return new Response(Buffer.from(bytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
