import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ key: process.env.VAPID_PUBLIC_KEY || "" });
}
