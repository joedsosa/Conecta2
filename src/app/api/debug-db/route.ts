import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const runtime = "nodejs";

// Debug: Check what prisma instance we have
console.log("=== JOBS ROUTE LOADING ===");
console.log("Prisma instance exists:", !!prisma);
console.log("Prisma constructor:", prisma?.constructor?.name);
console.log("Has $adapter property:", !!(prisma as any).$adapter);

// Log environment
console.log("TURSO_DATABASE_URL:", process.env.TURSO_DATABASE_URL);
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("HAS_TOKEN:", Boolean(process.env.TURSO_AUTH_TOKEN));

function isAdmin() {
  return cookies().get("admin")?.value === "1";
}

export async function GET(req: Request) {
  try {
    console.log("=== JOBS GET REQUEST ===");
    
    const url = new URL(req.url);
    const wantsAdmin = url.searchParams.get("admin") === "1";
    const admin = isAdmin() && wantsAdmin;
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

    console.log("Query where clause:", JSON.stringify(where, null, 2));
    console.log("Attempting prisma.job.findMany()...");

    // Test with a simpler query first
    console.log("Testing with count() first...");
    const count = await prisma.job.count();
    console.log("Count successful:", count);

    // Now try the actual query
    const jobs = await prisma.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    console.log("FindMany successful, found", jobs.length, "jobs");
    return NextResponse.json(jobs);

  } catch (error: any) {
    console.error("=== JOBS GET ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Error meta:", error.meta);
    console.error("Full error:", error);
    
    // Check if it's a connection issue
    if (error.code === 'URL_INVALID') {
      console.error("URL_INVALID error detected!");
      console.error("This means Prisma is getting 'undefined' as the database URL");
      console.error("Possible causes:");
      console.error("1. Multiple PrismaClient instances");
      console.error("2. Adapter not properly initialized");
      console.error("3. Environment variables not loaded");
    }

    return NextResponse.json(
      { 
        error: "Database error",
        message: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  // ... keep existing POST code ...
}