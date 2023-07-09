import { NextResponse } from "next/server";

import {
  AI_PROMPT,
  NO_ANSWER_RESPONSE,
  WORD_COUNT,
} from "@/lib/constant/prompts";
import { Retriever } from "@/lib/retriever";

import { LangChainStream, StreamingTextResponse } from "ai";
import { OpenAI, PromptTemplate } from "langchain";
import { LLMChain } from "langchain/chains";
import { z } from "zod";

const requiredSchema = z.object({
  question: z.string(),
  messages: z.array(z.any()),
  userId: z.string(),
  prompt: z.string().optional(),
  noAnswer: z.string().optional(),
});

export async function POST(request: Request) {
  const rawBody = await request.json();

  // validate all the required fields then extract them
  const validatedData = requiredSchema.parse(rawBody);
  const { userId, noAnswer, prompt, question, messages } = validatedData;

  // get the last 3 messages
  // then format them into a string
  const chat_history = messages
    .slice(-3, -1)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  // Initialize the retriever with the collection
  const retriever = Retriever({ collection: userId });

  if (!retriever.collectionName) {
    return NextResponse.json("What u wanna ask? U don't have any documents!", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  // get the documents from the retriever
  const documents = (await retriever.similaritySearch(question, 2))
    .map((document) => document.pageContent)
    .join("\n") // join the documents with a newline
    .replaceAll("\n", " ") // replace all newlines with spaces
    .replaceAll("  ", " ") // replace all double spaces with single spaces
    .trim(); // trim the whitespace

  // initialize the vercel ai sdk langchain stream
  const { handlers, stream } = LangChainStream();

  // initialize the model
  const model = new OpenAI({
    temperature: 0,
    streaming: true, // set streaming to true
    callbacks: [handlers], // add the handlers to the callbacks
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  // initialize the prompt
  const promptTemplate = PromptTemplate.fromTemplate(
    `
Your task is: {ai_prompt}

You must respond in less than {word_count} words.

If you do not know the answer, you must respond with "{no_answer}".

You have been provided with additional information that may assist in answering the question, but you can choose to disregard it if you find it irrelevant. 
Additional Information: {documents}
    
Utilize the chat history to provide informed and honest responses.
Chat History: {chat_history}
    
Question: {question}
    
Answer:
`
  );

  // initialize the chain
  const qaChain = new LLMChain({
    llm: model,
    prompt: promptTemplate,
    verbose: true,
  });

  qaChain.call({
    question,
    documents,
    chat_history,
    word_count: WORD_COUNT,
    ai_prompt: prompt ?? AI_PROMPT,
    no_answer: noAnswer ?? NO_ANSWER_RESPONSE,
  });

  // return the response as a streaming text response
  return new StreamingTextResponse(stream, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
