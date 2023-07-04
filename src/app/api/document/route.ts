import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { DB } from "@/types/schema";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { ChromaClient } from "chromadb";
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
  collection: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const validatedBody = createItemSchema.parse(body);

  // scrape website then load the document
  const response = await axios.get(validatedBody.url);
  const htmlContent = convert(response.data);

  // initialize supabase
  const supabase = createRouteHandlerClient<DB>({ cookies });

  // get current authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) {
    return NextResponse.json({
      status: "ERROR",
      message: "User not found",
    });
  }

  // create the document in the database
  const { data: newDocument } = await supabase
    .from("documents")
    .insert({
      url: validatedBody.url,
      activation: true,
      user_id: user.id,
      last_trained: new Date().toISOString(),
    })
    .select()
    .single();
  if (!newDocument?.id) {
    return NextResponse.json({
      status: "ERROR",
      message: "Document not created",
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
    [{ status: "active", id: newDocument.id.toString() }]
  );

  // Check if collection exists otherwise create it
  try {
    await axios.get("http://localhost:3000/api/collection/" + user.id);
  } catch (error) {
    return NextResponse.json({
      status: "ERROR",
      message: error,
    });
  }

  // Saving the document into chroma
  await Chroma.fromDocuments(
    documents,
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    }),
    {
      collectionName: user.id, // collection name is the user id
    }
  );

  return NextResponse.json({
    stauts: "OK",
    message: "Item created successfully",
  });
}
