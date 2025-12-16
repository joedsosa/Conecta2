import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

function isAdmin() {
  return cookies().get("admin")?.value === "1";
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdmin()) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  const body = await req.json();

  const job = await prisma.job.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      location: body.location ?? null,
      type: body.type ?? null,
      active: body.active ?? true,
    },
  });

  return NextResponse.json(job);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAdmin()) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  await prisma.job.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
