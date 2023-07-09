import { NextResponse } from "next/server";

import { chroma } from "@/lib/chroma";
import { scraper } from "@/lib/scraper";
import {
  getRouteHandlerUser,
  supabaseRouteHandler,
} from "@/lib/supabase.server";

import { env } from "@/env.mjs";
import axios from "axios";
import { OpenAIEmbeddingFunction } from "chromadb";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { nanoid } from "nanoid";
import { z } from "zod";

const itemGetRequestSchema = z.object({
  collection: z.string(),
  id: z.string(),
});

export async function GET(request: Request) {
  const body = await request.json();
  const validatedBody = itemGetRequestSchema.parse(body);

  const { collection: collectionName, id } = validatedBody;

  const client = chroma();

  const collection = await client.getCollection({
    name: collectionName,
  });

  const items = await collection.get({
    ids: id,
  });

  return NextResponse.json({
    status: "OK",
    items,
  });
}

const createItemSchema = z.object({
  url: z.string(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const validatedBody = createItemSchema.parse(body);

  // scrape website then load the document
  const htmlContent = await scraper(validatedBody.url);

  // get current authenticated user
  const user = await getRouteHandlerUser();

  // create the document in the database
  let newDocument;

  try {
    const { data } = await supabaseRouteHandler
      .from("documents")
      .insert({
        url: validatedBody.url,
        activation: true,
        user_id: user.id,
        last_trained: new Date().toISOString(),
      })
      .select()
      .single();

    if (!data?.id) {
      return NextResponse.json("Could not create document.", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    newDocument = data;
  } catch (error) {
    return NextResponse.json(error, {
      status: 400,
      statusText: "Bad Request",
    });
  }

  // initialize splitter
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 150,
  });

  // create the document from the html content using the splitter
  const documents = await splitter.createDocuments(
    [htmlContent],
    // default status is active, and the id is taken from supabase
    [{ id: newDocument.id.toString() }]
  );

  // Check if collection exists otherwise create it
  try {
    await axios.get("http://localhost:3000/api/collection/" + user.id);
  } catch (error) {
    return NextResponse.json(error, {
      status: 400,
      statusText: "Bad Request",
    });
  }

  // initialize openai embeddings
  const embedder = new OpenAIEmbeddingFunction({
    openai_api_key: env.OPENAI_API_KEY,
  });

  // initialize chroma
  const client = chroma();

  // get the collection
  const collection = await client.getCollection({
    name: user.id,
    embeddingFunction: embedder,
  });

  // Saving the document into chroma
  await collection.add({
    ids: documents.map((_) => nanoid()),
    documents: documents.map((document) => document.pageContent),
    metadatas: documents.map((document) => document.metadata),
  });

  return NextResponse.json({
    stauts: "OK",
    message: "Item created successfully",
  });
}
