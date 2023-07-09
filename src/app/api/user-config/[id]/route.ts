import { NextResponse } from "next/server";

import { supabaseRouteHandler } from "@/lib/supabase.server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data } = await supabaseRouteHandler
      .from("configs")
      .select("*")
      .eq("user_id", params.id)
      .single();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error, {
      status: 400,
      statusText: "Bad Request",
    });
  }
}
