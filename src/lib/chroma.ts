import { ChromaClient } from "chromadb";

export function chroma() {
  const client = new ChromaClient({
    path: "http://188.166.229.246:8000"
  });

  return client;
}
