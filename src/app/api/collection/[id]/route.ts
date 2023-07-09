import { NextResponse } from "next/server";

import { chroma } from "@/lib/chroma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const client = chroma();
  const { id: collectionName } = params;

  try {
    await client.deleteCollection({ name: collectionName });
  } catch (error) {
    return NextResponse.json(error, {
      status: 400,
      statusText: "Bad Request",
    });
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

  const client = chroma();

  let collection;

  try {
    collection = await client.getOrCreateCollection({
      name: collectionName,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "Im not ok 😞",
        message: error,
      },
      {
        status: 400,
        statusText: "Bad Request",
      }
    );
  }

  return NextResponse.json({
    status: "OK",
    data: collection,
  });
}
