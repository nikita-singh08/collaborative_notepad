import { NextResponse } from "next/server";

export async function GET() {
  const isConfigured = !!process.env.LIVEBLOCKS_SECRET_KEY;
  return NextResponse.json({ liveblocksConfigured: isConfigured });
}
