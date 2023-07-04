import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { DB } from "@/types/schema";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { ChromaClient } from "chromadb";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = createRouteHandlerClient<DB>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) {
    return NextResponse.json("Unauthorized");
  }

  const client = new ChromaClient();
  const collection = await client.getCollection({
    name: user?.id,
  });

  try {
    await collection.delete({
      where: {
        id,
      },
    });
    await supabase.from("documents").delete().match({ id });
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
