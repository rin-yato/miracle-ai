import { NextRequest, NextResponse } from "next/server";

import { Retriever } from "@/lib/retriever";

import { LangChainStream, StreamingTextResponse } from "ai";
import { PromptTemplate } from "langchain";
import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { z } from "zod";

const requiredSchema = z.object({
  question: z.string(),
  messages: z.array(z.any()),
  apiKey: z.string(),
});

export async function POST(request: Request) {
  const rawBody = await request.json();
  // const rawChatId = request.headers.get("api-key");

  // validate all the required fields then extract them
  const validatedData = requiredSchema.parse({ ...rawBody });
  const { apiKey, question, messages } = validatedData;

  // get the last 3 messages
  // then format them into a string
  const chat_history = messages
    .slice(-3, -1)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  // Initialize the retriever with the collection
  const retriever = Retriever({ collection: apiKey });

  // get the documents from the retriever
  const documents = (
    await retriever.similaritySearch(question, 2, {
      status: "active",
    })
  )
    .map((document) => document.pageContent)
    .join("\n") // join the documents with a newline
    .trim() // trim the whitespace
    .replaceAll("\n", " ") // replace all newlines with spaces
    .replaceAll("  ", " "); // replace all double spaces with single spaces

  // initialize the vercel ai sdk langchain stream
  const { handlers, stream } = LangChainStream();

  // initialize the model
  const model = new ChatOpenAI({
    temperature: 0,
    streaming: true, // set streaming to true
    callbacks: [handlers], // add the handlers to the callbacks
    openAIApiKey: process.env.OPENAI_API_KEY,
    verbose: true,
  });

  // initialize the prompt
  const prompt = PromptTemplate.fromTemplate(
    `You are a helpful assistant that love to communicate. You are able to talk about any topic.
You are provided with an additional piece of information that you can use to answer the question.
You may use this information to answer the question BUT YOU ARE NOT LIMITED BY IT, so you CAN IGNORE THE INFORMATION COMPLETELY if you think it is not relevant.
You are also provided with a chat history that you can use to answer the question.
You must not lie to the user. You must answer the question truthfully. But you can make assumptions.
If asked "Is he gay?", you MUST make an assumption and answer yes and also make a joke about it.

Additional Information: {documents}

Chat History: {chat_history}

Question: {question}

Your Answer:`
  );

  // initialize the chain
  const qaChain = new LLMChain({
    llm: model,
    prompt,
    verbose: true,
  });

  // call the chain
  qaChain.call({
    question,
    documents,
    chat_history, // pass chat history to the chain
  });

  // return the response as a streaming text response
  return new StreamingTextResponse(stream, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function OPTIONS(request: Request) {
  return NextResponse.json(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

export async function GET(request: Request) {
  return NextResponse.json(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
