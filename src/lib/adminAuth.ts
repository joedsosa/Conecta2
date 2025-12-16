import { NextRequest } from "next/server";

export function assertAdmin(req: NextRequest) {
  const token =
    req.headers.get("x-admin-token") ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    throw new Error("ADMIN_TOKEN no está definido en .env");
  }

  if (!token || token !== expected) {
    return false;
  }

  return true;
}
