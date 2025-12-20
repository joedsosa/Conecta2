import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

function isAdmin() {
  return cookies().get("admin")?.value === "1";
}

const ACTOR = () => process.env.ADMIN_USER ?? "admin";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!isAdmin()) return NextResponse.json({ ok: false }, { status: 401 });

  const id = params.id; // ← QUITAR Number(), id ya es string
  const body = await req.json();

  // flags soportados:
  // body.restore === true  -> restaura (quita deletedAt)
  // body.fill === true     -> marcar como FILLED con hired info
  // body.unfill === true   -> regresar a OPEN

  if (body.restore === true) {
    const job = await prisma.job.update({
      where: { id }, // ← id es string
      data: {
        deletedAt: null,
        deletedBy: null,
        audits: { create: { action: "RESTORE", actor: ACTOR() } },
      },
    });
    return NextResponse.json(job);
  }

  if (body.fill === true) {
    const job = await prisma.job.update({
      where: { id }, // ← id es string
      data: {
        status: "FILLED",
        filledAt: new Date(),
        active: false, // opcional: ya no visible
        hiredName: body.hiredName ?? null,
        hiredContact: body.hiredContact ?? null,
        hiredNotes: body.hiredNotes ?? null,
        audits: {
          create: {
            action: "FILL",
            actor: ACTOR(),
            meta: JSON.stringify({
              hiredName: body.hiredName,
              hiredContact: body.hiredContact,
            }),
          },
        },
      },
    });
    return NextResponse.json(job);
  }

  if (body.unfill === true) {
    const job = await prisma.job.update({
      where: { id }, // ← id es string
      data: {
        status: "OPEN",
        filledAt: null,
        hiredName: null,
        hiredContact: null,
        hiredNotes: null,
        audits: { create: { action: "UNFILL", actor: ACTOR() } },
      },
    });
    return NextResponse.json(job);
  }

  // update normal
  const job = await prisma.job.update({
    where: { id }, // ← id es string
    data: {
      title: body.title,
      description: body.description,
      location: body.location ?? null,
      type: body.type ?? null,
      active: body.active ?? true,
      audits: {
        create: { action: "UPDATE", actor: ACTOR(), meta: JSON.stringify({ body }) },
      },
    },
  });

  return NextResponse.json(job);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!isAdmin()) return NextResponse.json({ ok: false }, { status: 401 });

  const id = params.id; // ← QUITAR Number(), id ya es string

  await prisma.job.update({
    where: { id }, // ← id es string
    data: {
      deletedAt: new Date(),
      deletedBy: ACTOR(),
      active: false, // para que no salga nunca en público
      audits: { create: { action: "SOFT_DELETE", actor: ACTOR() } },
    },
  });

  return NextResponse.json({ ok: true });
}