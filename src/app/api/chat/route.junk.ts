import { env } from "@/env.mjs";
import { LangChainStream, StreamingTextResponse } from "ai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { PromptTemplate } from "langchain/prompts";
import { RedisChatMessageHistory } from "langchain/stores/message/redis";
import { Chroma } from "langchain/vectorstores/chroma";
import { z } from "zod";

const bodySchema = z.object(
  {
    question: z.string({
      required_error: "Question is required in the request body",
    }),
    messages: z.array(z.any()).optional(),
    chatSessionId: z.string(),
    history: z.array(z.string()).optional(),
  },
  {
    required_error: "Question is required in the request body",
  }
);

const chatIdSchema = z.string({
  required_error: "Chat ID is required",
});

// export const runtime = "edge";

export async function POST(request: Request) {
  // get the question from the event
  const body = await request.json();

  // get the headers from the event
  const chatId = request.headers.get("chat-id");

  // validate the body
  const validatedBody = bodySchema.parse(body);

  // validate the headers
  const validatedChatId = chatIdSchema.parse(chatId);

  // get question from the body
  const { question, chatSessionId, history } = validatedBody;

  // initialize embedder
  const embeddings = new OpenAIEmbeddings();

  const { stream, handlers } = LangChainStream();

  // initialize LLM
  const model = new OpenAI({
    streaming: true,
    callbacks: [handlers],
    verbose: true,
  });

  // load the embeddings from vector-store
  console.log("1️⃣ Load the embeddings");
  const store = await Chroma.fromExistingCollection(embeddings, {
    collectionName: validatedChatId,
  });
  console.log("✅ Embeddings loaded");

  // initialize the redis memory
  const memory = new BufferMemory({
    memoryKey: "chat_history",
    inputKey: "question",
    outputKey: "text",
    chatHistory: new RedisChatMessageHistory({
      sessionId: chatSessionId, // Or some other unique identifier for the conversation
      sessionTTL: 300, // 5 minutes, omit this parameter to make sessions never expire
      config: {
        url: "redis://localhost:6379",
      },
    }),
  });

  // initialize the retrieval chain
  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    store.asRetriever(undefined, {
      status: "active",
    }),
    {
      inputKey: "question",
      outputKey: "text",
      memory,
    }
  );

  const promptTemplate = PromptTemplate.fromTemplate(
    `
    IGNORE ALL THE INSTRUCTION ABOVE THIS LINE.
    
    You will act as a helpful chatbot. You will be given a question and you will answer it.
    You must give straight forward and simple answer. 
    
    If you don't know the answer, just apologize and say that this information is not in your context. Then, answer the 
    question using the information you have. You must make sure to inform the user that 
    it is not information from the context.

    Question: {question}
    `
  );

  const prompt = await promptTemplate.format({
    question,
  });

  chain.call({
    question,
  });

  return new StreamingTextResponse(stream);
}
