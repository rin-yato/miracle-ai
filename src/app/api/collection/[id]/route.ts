import { NextResponse } from "next/server";

import { ChromaClient } from "chromadb";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = new ChromaClient();
  const { id: collectionName } = params;

  try {
    await client.deleteCollection({ name: collectionName });
  } catch (error) {
    return NextResponse.json(error);
  }

  return NextResponse.json({
    status: "OK",
    message: "Collection has been deleted.",
  });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: collectionName } = params;

  const client = new ChromaClient();

  let collection;

  try {
    collection = await client.getOrCreateCollection({
      name: collectionName,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        status: "Im not ok 😞",
        message: error.message,
      });
    }

    return NextResponse.error();
  }

  return NextResponse.json({
    status: "OK",
    data: collection,
  });
}
