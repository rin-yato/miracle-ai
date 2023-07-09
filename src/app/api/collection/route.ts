import { NextResponse } from "next/server";

import { chroma } from "@/lib/chroma";

import { env } from "@/env.mjs";
import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import { z } from "zod";

export async function GET() {
  const client = new ChromaClient();

  const collections = await client.listCollections();

  return NextResponse.json({
    status: "OK",
    collections,
  });
}

const createCollectionSchema = z.object({
  collection: z.string(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const validatedBody = createCollectionSchema.parse(body);

  // initialize embedder fn
  const embeddingFunction = new OpenAIEmbeddingFunction({
    openai_api_key: env.OPENAI_API_KEY,
  });

  // create the collection
  const client = chroma();
  try {
    await client.createCollection({
      name: validatedBody.collection,
      embeddingFunction,
    });
  } catch (error) {
    return NextResponse.json(error, {
      status: 400,
      statusText: "Bad Request",
    });
  }

  return NextResponse.json(
    {
      status: "OK",
      message: "Collection Created.",
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Allow-Methods": "POST, OPTIONS",
      },
    }
  );
}
