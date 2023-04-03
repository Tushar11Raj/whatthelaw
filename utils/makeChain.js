import { OpenAI } from "langchain/llms";
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from "langchain/chains";
import { HNSWLib, SupabaseVectorStore } from "langchain/vectorstores";
import { PromptTemplate } from "langchain/prompts";
import { BufferMemory } from "langchain/memory";

const memory = new BufferMemory();

const CONDENSE_PROMPT =
  PromptTemplate.fromTemplate(`Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`);

const QA_PROMPT = PromptTemplate.fromTemplate(
  `You are an AI assistant and a personal lawyer. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided. If you think you can answer simple conversational questions without the use of the given context go ahead and answer them.
If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer.
If the question is not related to Indian Law or the context provided, politely inform them that you are tuned to only answer questions that are related to Indian Law.
You can also write applications if asked to. To write application use the context provided.
Question: {question}
=========
{context}
=========
Answer in Markdown:`
);

export const makeChain = (vectorstore) => {
  const questionGenerator = new LLMChain({
    llm: new OpenAI({ temperature: 0.7 }),
    prompt: CONDENSE_PROMPT,
  });
  const docChain = loadQAChain(
    new OpenAI({
      temperature: 0.7,
    }),
    { prompt: QA_PROMPT }
  );

  return new ChatVectorDBQAChain({
    vectorstore,
    combineDocumentsChain: docChain,
    questionGeneratorChain: questionGenerator,
    returnSourceDocuments: true,
    verbose: true,
    memory: memory,
    k: 5,
  });
};
