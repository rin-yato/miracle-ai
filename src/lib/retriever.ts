import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Chroma } from "langchain/vectorstores/chroma";

type RetrieverOptions = {
  collection: string;
};

export function Retriever(options: RetrieverOptions) {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const chroma = new Chroma(embeddings, {
    collectionName: options.collection,
    url: "http://188.166.229.246:8000"
  });

  return chroma;
}
