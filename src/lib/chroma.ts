import { ChromaClient } from "chromadb";

export function chroma() {
  const client = new ChromaClient();

  return client;
}
