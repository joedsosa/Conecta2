import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL ?? null,
    TURSO_AUTH_TOKEN_EXISTS: !!process.env.TURSO_AUTH_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL ?? null,
    NODE_ENV: process.env.NODE_ENV ?? null,
  });
}
