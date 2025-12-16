import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { user, pass } = await req.json();

  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    // cookie simple (para empezar). Luego la hacemos más segura si quieres.
    res.cookies.set("admin", "1", { httpOnly: true, path: "/" });
    return res;
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}
