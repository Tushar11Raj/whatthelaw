import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { SupabaseVectorStore } from "langchain/vectorstores";
import { openai } from "@/utils/openaiClient";
import { supabaseClient } from "@/utils/supabaseClient";
import { makeChain } from "@/utils/makeChain";
import { LLMChain, ChatVectorDBQAChain, loadQAChain } from "langchain/chains";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const now = new Date(); // create a new Date object
  const currentTime = now.toLocaleTimeString(); // get the current time as a string
  console.log("chat.ts called@", currentTime);
  const { question, history } = req.body;

  if (!question) {
    return res.status(400).json({ message: "No question in the request" });
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll("\n", " ");

  /* create vectorstore*/
  const vectorStore = await SupabaseVectorStore.fromExistingIndex(
    supabaseClient,
    new OpenAIEmbeddings()
  );

  // const chain = ChatVectorDBQAChain.fromLLM(openai, vectorStore);
  const chain = makeChain(vectorStore);

  const response = await chain.call({
    question: sanitizedQuestion,
    chat_history: history || [],
  });

  console.log("response: ", response);
  // console.log("sourced docs: ", response.sourceDocuments);

  res.status(200).json({ data: response });
  // res.writeHead(200, {
  //   "Content-Type": "text/event-stream",
  //   "Cache-Control": "no-cache, no-transform",
  //   Connection: "keep-alive",
  // });

  // const sendData = (data: string) => {
  //   res.write(`data: ${data}\n\n`);
  // };

  // sendData(JSON.stringify({ data: "" }));

  // const model = openai;
  // // create the chain
  // const chain = makeChain(vectorStore, (token: string) => {
  //   sendData(JSON.stringify({ data: token }));
  // });

  // try {
  //   //Ask a question
  //   const response = await chain.call({
  //     question: sanitizedQuestion,
  //     chat_history: history || [],
  //   });
  //   const now = new Date(); // create a new Date object
  //   const currentTime = now.toLocaleTimeString(); // get the current time as a string

  //   console.log("response", response, " --@api/chat.ts 51 @", currentTime);
  // } catch (error) {
  //   console.log("error", error, "\n@api/chat.ts 53");
  // } finally {
  //   const now = new Date(); // create a new Date object
  //   const currentTime = now.toLocaleTimeString(); // get the current time as a string
  //   console.log("Data Sent Succesfully", " --@api/chat.ts 55 @", currentTime);
  //   sendData("[DONE]");
  //   res.end();
  // }
}
