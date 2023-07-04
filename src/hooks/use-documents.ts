import { DB, Table } from "@/types/schema";

import { getUser } from "@/lib/supabase";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { toast } from "react-hot-toast";
import useSwr from "swr";

async function getDocuments() {
  const supabase = createClientComponentClient<DB>();

  const user = await getUser();
  if (!user) {
    console.log("No user");
    return [];
  }

  const { data } = await supabase
    .from("documents")
    .select("*")
    .filter("user_id", "eq", user.id);

  return data ?? [];
}

export default function useDocument() {
  const { data: documents, ...swr } = useSwr<Table<"documents">>(
    "documents",
    getDocuments
  );

  async function generateUrls(url: string) {
    const response = await axios.post("/api/get-links", { url });
    const sortedLinks: string[] = response.data.data.sort(
      (a: string, b: string) => {
        return a.length - b.length;
      }
    );
    const data = sortedLinks.map((item: string) => {
      return {
        id: item,
        url: item,
      };
    });
    return data;
  }

  async function addSource(sources: string | string[]) {
    if (typeof sources === "string") {
      sources = [sources];
    }

    sources.forEach(async (source) => {
      toast.promise(axios.post("/api/document", { url: source }), {
        loading: `Adding ${source}`,
        success: () => {
          swr.mutate();
          return `Added ${source}`;
        },
        error: `Failed to add ${source}`,
      });
    });

    return true;
  }

  async function deleteDocument(id: number) {
    await toast.promise(axios.delete(`/api/document/${id}`), {
      loading: `Deleting ${id}`,
      success: `Deleted ${id}`,
      error: `Failed to delete ${id}`,
    });
    swr.mutate();
  }

  return {
    documents: documents ?? [],
    generateUrls,
    addSource,
    deleteDocument,
    ...swr,
  };
}
