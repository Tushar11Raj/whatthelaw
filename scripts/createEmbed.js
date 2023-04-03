import { DirectoryLoader, PDFLoader } from "langchain/document_loaders";
import { Embeddings, OpenAIEmbeddings } from "langchain/embeddings";
import { SupabaseVectorStore } from "langchain/vectorstores";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { supabaseClient } from "../utils/supabaseClient.js";
import fs from "fs";

function redirectConsoleToFile(filename) {
  const stream = fs.createWriteStream(filename, { flags: "a" });
  const oldConsoleLog = console.log;

  console.log = (...args) => {
    const message = args.map((arg) => JSON.stringify(arg)).join(" ");
    stream.write(message + "\n");
    oldConsoleLog.apply(console, args);
  };
}

async function extractDataFromDocuments(pathToPdfs) {
  const loader = new DirectoryLoader(pathToPdfs, {
    ".pdf": (path) =>
      new PDFLoader(path, {
        splitPages: true,
      }),
    ".txt": (path) => new TextLoader(path),
  });

  const docs = await loader.load();

  docs.forEach((document) => {
    document.pageContent = document.pageContent.replace(/\n/g, " ");
  });

  return docs;
}

async function splitDocsIntoChunks(docs) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 200,
  });
  return await textSplitter.splitDocuments(docs);
}

async function embedDocuments(client, chunks, embeddings) {
  console.log("creating embeddings...");
  await SupabaseVectorStore.fromDocuments(client, chunks, embeddings);
  console.log("embeddings successfully stored in supabase");
}

export const run = async () => {
  redirectConsoleToFile("createEmbedLog.json");
  try {
    //load data from pdfs
    const docs = await extractDataFromDocuments("files");
    console.log(docs);

    // //split documents into chunks for openai context window
    // const chunks = await splitDocsIntoChunks(docs);
    // // console.log(chunks);

    // //embed docs into supabase
    // await embedDocuments(supabaseClient, chunks, new OpenAIEmbeddings());
  } catch (error) {
    console.log("[-] error occured: " + error);
  }
};

run();
