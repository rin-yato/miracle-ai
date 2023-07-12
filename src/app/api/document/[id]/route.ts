import { NextResponse } from "next/server";

import { chroma } from "@/lib/chroma";
import { scraper } from "@/lib/scraper";
import {
  getRouteHandlerUser,
  supabaseRouteHandler,
} from "@/lib/supabase.server";

import { env } from "@/env.mjs";
import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { nanoid } from "nanoid";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const user = await getRouteHandlerUser();
  if (!user?.id) {
    return NextResponse.json(null, {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  const client = chroma();

  const collection = await client.getCollection({
    name: user?.id,
  });

  try {
    await collection.delete({
      where: {
        id,
      },
    });
    await supabaseRouteHandler.from("documents").delete().match({ id });
  } catch (error) {
    return NextResponse.json({
      status: "ERROR",
      message: error,
    });
  }

  return NextResponse.json({
    status: "OK",
    message: "Item deleted",
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const user = await getRouteHandlerUser();

  const { data: documentToUpdate } = await supabaseRouteHandler
    .from("documents")
    .select("*")
    .match({ id })
    .single();

  if (!documentToUpdate || !documentToUpdate?.url) {
    return NextResponse.json(null, {
      status: 400,
      statusText: "Document not found",
    });
  }

  // initialize openai embedding
  const embedder = new OpenAIEmbeddingFunction({
    openai_api_key: env.OPENAI_API_KEY,
  });

  const client = chroma();

  const collection = await client.getCollection({
    name: user.id,
    embeddingFunction: embedder,
  });

  // scrape website then load the document
  const htmlContent = await scraper(documentToUpdate.url);

  // initialize splitter
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 150,
  });

  const documents = await splitter.createDocuments(
    [htmlContent],
    // id is taken from supabase
    [{ id }]
  );

  try {
    await collection.delete({
      where: {
        id,
      },
    });
    await collection.add({
      ids: documents.map((_) => nanoid()),
      documents: documents.map((document) => document.pageContent),
      metadatas: documents.map((document) => document.metadata),
    });
    await supabaseRouteHandler
      .from("documents")
      .update({
        last_trained: new Date().toISOString(),
      })
      .match({ id });
  } catch (error) {
    return NextResponse.json(error, {
      status: 400,
      statusText: "Bad Request",
    });
  }

  return NextResponse.json({
    status: "OK",
  });
}
