import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import PDFDocument from "pdfkit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAdmin() {
  return cookies().get("admin")?.value === "1";
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function startOfMonth(d: Date) {
  const x = startOfDay(d);
  x.setDate(1);
  return x;
}
function startOfYear(d: Date) {
  const x = startOfDay(d);
  x.setMonth(0, 1);
  return x;
}
function startOfWeekMonday(d: Date) {
  const x = startOfDay(d);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return x;
}

function fmtDateTime(d: Date) {
  return d.toLocaleString();
}
function fmtDate(d: Date) {
  return d.toLocaleDateString();
}

async function docToBuffer(doc: PDFDocument) {
  const chunks: Buffer[] = [];
  return await new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });
}

export async function GET(req: Request) {
  if (!isAdmin()) return NextResponse.json({ ok: false }, { status: 401 });

  const url = new URL(req.url);
  const title = url.searchParams.get("title") ?? "Informe de Contrataciones";

  const now = new Date();
  const weekStart = startOfWeekMonday(now);
  const monthStart = startOfMonth(now);
  const yearStart = startOfYear(now);

  const d7 = new Date(now); d7.setDate(d7.getDate() - 7);
  const d30 = new Date(now); d30.setDate(d30.getDate() - 30);
  const d365 = new Date(now); d365.setDate(d365.getDate() - 365);

  const baseWhere = {
    deletedAt: null,
    status: "FILLED" as const,
    filledAt: { not: null },
  };

  const [
    totalAllTime,
    hiredThisWeek,
    hiredThisMonth,
    hiredThisYear,
    hiredLast7,
    hiredLast30,
    hiredLast365,
    recentHires,
  ] = await Promise.all([
    prisma.job.count({ where: baseWhere }),
    prisma.job.count({ where: { ...baseWhere, filledAt: { gte: weekStart } } }),
    prisma.job.count({ where: { ...baseWhere, filledAt: { gte: monthStart } } }),
    prisma.job.count({ where: { ...baseWhere, filledAt: { gte: yearStart } } }),
    prisma.job.count({ where: { ...baseWhere, filledAt: { gte: d7 } } }),
    prisma.job.count({ where: { ...baseWhere, filledAt: { gte: d30 } } }),
    prisma.job.count({ where: { ...baseWhere, filledAt: { gte: d365 } } }),
    prisma.job.findMany({
      where: baseWhere,
      orderBy: { filledAt: "desc" },
      take: 30,
      select: {
        id: true,
        title: true,
        filledAt: true,
        hiredName: true,
        hiredContact: true,
      },
    }),
  ]);

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 48, left: 48, right: 48, bottom: 48 },
    info: { Title: title },
  });

  doc.fontSize(18).text(title, { align: "left" });
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor("#666").text(`Generado: ${fmtDateTime(now)}`);
  doc.fillColor("#000");
  doc.moveDown(1);

  doc.fontSize(13).text("Resumen");
  doc.moveDown(0.6);

  const leftX = doc.x;
  const colW = (doc.page.width - doc.page.margins.left - doc.page.margins.right - 12) / 2;
  const rowH = 52;

  function card(x: number, y: number, label: string, value: number, sub?: string) {
    doc.roundedRect(x, y, colW, rowH, 10).strokeColor("#DDD").lineWidth(1).stroke();
    doc.fontSize(10).fillColor("#666").text(label, x + 12, y + 10, { width: colW - 24 });
    doc.fontSize(20).fillColor("#000").text(String(value), x + 12, y + 22, { width: colW - 24 });
    if (sub) doc.fontSize(9).fillColor("#777").text(sub, x + 12, y + 40, { width: colW - 24 });
    doc.fillColor("#000");
  }

  const y0 = doc.y;
  card(leftX, y0, "Semana (lun–dom)", hiredThisWeek, `Desde ${fmtDate(weekStart)}`);
  card(leftX + colW + 12, y0, "Mes", hiredThisMonth, `Desde ${fmtDate(monthStart)}`);
  card(leftX, y0 + rowH + 10, "Año", hiredThisYear, `Desde ${fmtDate(yearStart)}`);
  card(leftX + colW + 12, y0 + rowH + 10, "Total histórico", totalAllTime);

  doc.y = y0 + (rowH * 2) + 26;

  doc.fontSize(11).text("Ventanas móviles");
  doc.moveDown(0.4);

  const y1 = doc.y;
  const smallW = (doc.page.width - doc.page.margins.left - doc.page.margins.right - 24) / 3;

  function smallCard(x: number, y: number, label: string, value: number) {
    doc.roundedRect(x, y, smallW, 44, 10).strokeColor("#DDD").lineWidth(1).stroke();
    doc.fontSize(9).fillColor("#666").text(label, x + 12, y + 10, { width: smallW - 24 });
    doc.fontSize(16).fillColor("#000").text(String(value), x + 12, y + 22, { width: smallW - 24 });
    doc.fillColor("#000");
  }

  smallCard(leftX, y1, "Últimos 7 días", hiredLast7);
  smallCard(leftX + smallW + 12, y1, "Últimos 30 días", hiredLast30);
  smallCard(leftX + (smallW + 12) * 2, y1, "Últimos 365 días", hiredLast365);

  doc.y = y1 + 60;

  doc.fontSize(13).text("Contrataciones recientes (últimas 30)");
  doc.moveDown(0.4);

  const tableX = doc.page.margins.left;
  const tableW = doc.page.width - doc.page.margins.left - doc.page.margins.right;

  const cols = [
    { key: "fecha", w: 80 },
    { key: "plaza", w: 210 },
    { key: "contratado", w: 130 },
    { key: "contacto", w: tableW - (80 + 210 + 130) },
  ];

  function drawRow(y: number, row: Record<string, string>, header = false) {
    const h = header ? 22 : 20;
    doc.rect(tableX, y, tableW, h).fillColor(header ? "#F5F5F5" : "#FFFFFF").fill();
    doc.fillColor("#000").strokeColor("#E5E5E5").rect(tableX, y, tableW, h).stroke();

    let x = tableX;
    doc.fontSize(9).fillColor(header ? "#333" : "#111");
    for (const c of cols) {
      doc.text(row[c.key] ?? "", x + 8, y + 6, { width: c.w - 16, ellipsis: true });
      x += c.w;
    }
    doc.fillColor("#000");
    return h;
  }

  let y = doc.y;
  drawRow(y, { fecha: "Fecha", plaza: "Plaza", contratado: "Contratado", contacto: "Contacto" }, true);
  y += 22;

  for (const r of recentHires) {
    if (y > doc.page.height - doc.page.margins.bottom - 40) {
      doc.addPage();
      y = doc.page.margins.top;
      drawRow(y, { fecha: "Fecha", plaza: "Plaza", contratado: "Contratado", contacto: "Contacto" }, true);
      y += 22;
    }

    y += drawRow(y, {
      fecha: r.filledAt ? fmtDate(new Date(r.filledAt)) : "—",
      plaza: `${r.title} (#${r.id})`,
      contratado: r.hiredName ?? "—",
      contacto: r.hiredContact ?? "—",
    });
  }

  doc.moveDown(2);
  doc.fontSize(9).fillColor("#666").text("© Sistema de Plazas · Reporte interno");

  const pdf = await docToBuffer(doc);

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="informe_contrataciones.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
