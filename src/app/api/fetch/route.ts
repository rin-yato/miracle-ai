import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body: { url: string } = await request.json();

  const response = await fetch(body.url);
  const html = await response.text();

  return NextResponse.json(html);
}
