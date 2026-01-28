import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // simple DB check
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false },
      { status: 500 }
    );
  }
}
