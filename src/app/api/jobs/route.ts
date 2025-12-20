import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const runtime = "nodejs";

function isAdmin() {
  return cookies().get("admin")?.value === "1";
}

export async function GET(req: Request) {
  const url = new URL(req.url);

  const wantsAdmin = url.searchParams.get("admin") === "1"; // ✅ nuevo
  const admin = isAdmin() && wantsAdmin;                    // ✅ cambia esto

  const all = url.searchParams.get("all") === "1";
  const deleted = url.searchParams.get("deleted") === "1";
  const filled = url.searchParams.get("filled") === "1";

  let where: any;

  if (!admin) {
    where = { deletedAt: null, active: true, status: "OPEN" };
  } else {
    if (deleted) where = { deletedAt: { not: null } };
    else if (filled) where = { deletedAt: null, status: "FILLED" };
    else if (all) where = {};
    else where = { deletedAt: null };
  }

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}


export async function POST(req: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await req.json();

  const job = await prisma.job.create({
    data: {
      title: body.title,
      description: body.description,
      location: body.location ?? null,
      type: body.type ?? null,
      active: body.active ?? true,
      status: "OPEN",
      deletedAt: null,
      audits: {
        create: {
          action: "CREATE",
          actor: process.env.ADMIN_USER ?? "admin",
          meta: JSON.stringify({ body }),
        },
      },
    },
  });

  return NextResponse.json(job, { status: 201 });
}
