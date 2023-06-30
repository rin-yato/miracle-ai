import { Retriever } from "@/lib/retriever";

import { LangChainStream, StreamingTextResponse } from "ai";
import { PromptTemplate } from "langchain";
import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { z } from "zod";

const requiredSchema = z.object({
  question: z.string(),
  messages: z.array(z.any()),
  sessionId: z.string().default("default"),
  apiKey: z.string(),
});

export async function POST(request: Request) {
  const rawBody = await request.json();
  const rawChatId = request.headers.get("api-key");

  // validate all the required fields then extract them
  const validatedData = requiredSchema.parse({ ...rawBody, apiKey: rawChatId });
  const { apiKey, question, messages } = validatedData;

  const chat_history = messages
    .map((m) => `${m.role}: ${m.content}`)
    .join(",")
    .replaceAll("\n", " ");

  const retriever = Retriever({ collection: apiKey });

  const documents = (await retriever.similaritySearch(question, 1))
    .map((document) => document.pageContent)
    .join(" ")
    .trim()
    .replaceAll("\n", " ");

  const { handlers, stream } = LangChainStream();

  const model = new ChatOpenAI({
    temperature: 0,
    streaming: true,
    callbacks: [handlers],
  });

  const prompt = PromptTemplate.fromTemplate(
    `You are a helpful assistant that love to communicate. You are able to talk about any topic.
You are provided with an additional piece of information that you can use to answer the question.
You may use this information to answer the question BUT YOU ARE NOT LIMITED BY IT, so you CAN IGNORE THE INFORMATION COMPLETELY if you think it is not relevant.
You are also provided with a chat history that you can use to answer the question.
You must not lie to the user. You must answer the question truthfully. But you can make assumptions.

Additional Information: {documents}

Chat History: {chat_history}

Question: {question}

Your Answer:`
  );

  const qaChain = new LLMChain({
    llm: model,
    prompt,
    verbose: true,
  });

  qaChain.call({
    question,
    documents,
    chat_history,
  });

  return new StreamingTextResponse(stream);
}
