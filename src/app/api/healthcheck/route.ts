import { NextRequest, NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    {
      status: "😳 EVERYTHING OK BRO.",
    },
    {
      headers: corsHeaders,
    }
  );
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
};

export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}
