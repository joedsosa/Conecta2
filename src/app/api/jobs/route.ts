import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

function isAdmin() {
  return cookies().get("admin")?.value === "1";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const all = url.searchParams.get("all") === "1";

  const jobs = await prisma.job.findMany({
    where: all && isAdmin() ? {} : { active: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  if (!isAdmin()) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const job = await prisma.job.create({
    data: {
      title: body.title,
      description: body.description,
      location: body.location ?? null,
      type: body.type ?? null,
      active: body.active ?? true,
    },
  });

  return NextResponse.json(job, { status: 201 });
}
