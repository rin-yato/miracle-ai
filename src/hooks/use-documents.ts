import { DB, Table } from "@/types/schema";

import { generateUrls as generateUrlsUtil } from "@/lib/generate-urls";
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
    // because of naming overlapse i temporary change to
    // generateUrlsUtil
    const response = await generateUrlsUtil(url);
    const sortedLinks: string[] = response.sort(
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
      loading: `Deleting document...`,
      success: `Document Deleted`,
      error: `Failed to delete document`,
    });
    swr.mutate();
  }

  async function toggleActivation(id: number, activation: boolean) {
    console.log("id", id);
    console.log("activation", activation);
    try {
      await toast.promise(axios.put(`/api/document/${id}`, { activation }), {
        loading: `Updating document...`,
        success: `Document Updated`,
        error: `Failed to update document`,
      });
      swr.mutate();
      return true;
    } catch (error) {
      swr.mutate();
      return false;
    }
  }

  async function retrain(id: number) {
    try {
      await toast.promise(axios.post(`/api/document/${id}`, {}), {
        loading: `Retraining document...`,
        success: `Document Retrained`,
        error: `Failed to retrain document`,
      });
      swr.mutate();
      return true;
    } catch (error) {
      swr.mutate();
      return false;
    }
  }

  return {
    documents: documents ?? [],
    generateUrls,
    addSource,
    deleteDocument,
    toggleActivation,
    retrain,
    ...swr,
  };
}
