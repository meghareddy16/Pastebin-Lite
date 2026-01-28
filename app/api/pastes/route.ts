import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { content, ttl_seconds, max_views } = body;

    // ---- Validation ----
    if (typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "content must be a non-empty string" },
        { status: 400 }
      );
    }

    if (
      ttl_seconds !== undefined &&
      (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
    ) {
      return NextResponse.json(
        { error: "ttl_seconds must be an integer >= 1" },
        { status: 400 }
      );
    }

    if (
      max_views !== undefined &&
      (!Number.isInteger(max_views) || max_views < 1)
    ) {
      return NextResponse.json(
        { error: "max_views must be an integer >= 1" },
        { status: 400 }
      );
    }

    // ---- Expiry calculation ----
    let expiresAt: Date | null = null;
    if (ttl_seconds !== undefined) {
      expiresAt = new Date(Date.now() + ttl_seconds * 1000);
    }

    // ---- Create paste ----
    const id = nanoid(10);
    console.log(id);
    await prisma.paste.create({
      data: {
        id,
        content,
        expiresAt,
        maxViews: max_views ?? null,
      },
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`;

    return NextResponse.json({
      id,
      url: `${baseUrl}/p/${id}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
