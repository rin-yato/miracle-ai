import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import { NextResponse } from "next/server";
import { env } from "@/env.mjs";
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
    openai_api_key: env.OPENAI_KEY,
  });

  // create the collection
  const client = new ChromaClient();
  const createdCollection = await client.createCollection({
    name: validatedBody.collection,
    embeddingFunction,
  });

  return NextResponse.json({
    status: "OK",
    message: "Collection Created.",
    data: createdCollection,
  });
}
