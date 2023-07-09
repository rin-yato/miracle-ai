import { NextResponse } from "next/server";

import { Retriever } from "@/lib/retriever";

import { ChromaClient } from "chromadb";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({
      status: "😳",
      message: "This route is not available in production.",
    });
  }

  const collection = Retriever({
    collection: "73da1ec8-8b7f-4f3e-92dd-0963ede6d7a5",
  });

  const client = new ChromaClient();
  const cc = await client.getCollection({
    name: "73da1ec8-8b7f-4f3e-92dd-0963ede6d7a5",
  });

  const res = await cc.get();

  return NextResponse.json(res);
}
