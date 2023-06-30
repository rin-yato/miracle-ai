import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

// We can construct an LLMChain from a PromptTemplate and an LLM.
const model = new OpenAI({ temperature: 0 });
const prompt = PromptTemplate.fromTemplate(
  `You are a helpful assistant that answers questions about the world.
You are provided with an additional piece of information that you can use to answer the question.
You may use this information to answer the question, or you may ignore it, if you think it is not relevant.

Additional information: {documents}

Question: {question}

Answer:`
);

export const qaChain = new LLMChain({ llm: model, prompt, verbose: true });
