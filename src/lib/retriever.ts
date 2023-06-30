import { env } from "@/env.mjs";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Chroma } from "langchain/vectorstores/chroma";

type RetrieverOptions = {
  collection: string;
};

export function Retriever(options: RetrieverOptions) {
  const embeddings = new OpenAIEmbeddings();

  const chroma = new Chroma(embeddings, {
    collectionName: options.collection,
  });

  return chroma;
}
