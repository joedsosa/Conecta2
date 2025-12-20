import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

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
// Semana iniciando lunes
function startOfWeekMonday(d: Date) {
  const x = startOfDay(d);
  const day = x.getDay(); // 0=domingo,1=lunes...
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  return x;
}

export async function GET(req: Request) {
  if (!isAdmin()) return NextResponse.json({ ok: false }, { status: 401 });

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
        hiredNotes: true,
      },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    totals: {
      totalAllTime,
      hiredThisWeek,
      hiredThisMonth,
      hiredThisYear,
      hiredLast7,
      hiredLast30,
      hiredLast365,
    },
    recentHires,
  });
}
