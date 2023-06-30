import { ChromaClient } from "chromadb";
import { NextResponse } from "next/server";

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
  const collection = await client.getCollection({
    name: collectionName,
  });

  const collectionItems = await collection.get();

  return NextResponse.json({
    status: "OK",
    data: collectionItems,
  });
}
