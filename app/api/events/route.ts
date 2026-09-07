import { NextRequest, NextResponse } from "next/server";
const allowed = new Set(["demo_opened", "quickstart_opened"]);
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin)
    return new NextResponse(null, { status: 403 });
  if (Number(request.headers.get("content-length") ?? 0) > 128)
    return new NextResponse(null, { status: 413 });
  const text = await request.text();
  if (text.length > 128) return new NextResponse(null, { status: 413 });
  try {
    const data = JSON.parse(text);
    if (
      !data ||
      Object.keys(data).join() !== "event" ||
      !allowed.has(data.event)
    )
      return new NextResponse(null, { status: 400 });
    // Fixed event names only: never log request bodies, URLs, IPs or cookies here.
    console.info(JSON.stringify({ kind: "argon_funnel", event: data.event }));
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 400 });
  }
}
