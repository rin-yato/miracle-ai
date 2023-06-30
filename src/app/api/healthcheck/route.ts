import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "😳 EVERYTHING OK BRO.",
  });
}
