import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function getNow(req: Request) {
  if (process.env.TEST_MODE === "1") {
    const h = req.headers.get("x-test-now-ms");
    if (h) return new Date(Number(h));
  }
  return new Date();
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const paste = await prisma.paste.findUnique({
    where: { id },
  });

  if (!paste) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = getNow(request);

  // Expiry check
  if (paste.expiresAt && paste.expiresAt <= now) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // View limit check
  if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Increment view count
  const updated = await prisma.paste.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });

  return NextResponse.json({
    content: updated.content,
    remaining_views:
      updated.maxViews !== null
        ? updated.maxViews - updated.viewCount
        : null,
    expires_at: updated.expiresAt,
  });
}
