import { NextResponse } from "next/server";

import { env } from "@/env.mjs";
import axios from "axios";
import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";
import { Documents } from "chromadb/dist/main/types";
import { convert } from "html-to-text";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Chroma } from "langchain/vectorstores/chroma";
import { z } from "zod";

const itemGetRequestSchema = z.object({
  collection: z.string(),
  id: z.string(),
});

export async function GET(request: Request) {
  const body = await request.json();
  const validatedBody = itemGetRequestSchema.parse(body);

  const { collection: collectionName, id } = validatedBody;

  const client = new ChromaClient();

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
  collection: z.string(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const validatedBody = createItemSchema.parse(body);

  // scrape website then load the document
  const response = await axios.get(validatedBody.url);
  const htmlContent = convert(response.data);

  // initialize splitter
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 150,
  });

  // create the document from the html content using the splitter
  const documents = await splitter.createDocuments(
    [htmlContent],
    [{ status: "active" }]
  );

  const store = await Chroma.fromDocuments(
    documents,
    new OpenAIEmbeddings({
      openAIApiKey: env.OPENAI_API_KEY,
    }),
    {
      collectionName: validatedBody.collection,
    }
  );

  return NextResponse.json({
    stauts: "OK",
    message: "Item created successfully",
  });
}
