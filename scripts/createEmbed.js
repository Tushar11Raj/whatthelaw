import { DirectoryLoader, PDFLoader } from "langchain/document_loaders";
import { Embeddings, OpenAIEmbeddings } from "langchain/embeddings";
import { SupabaseVectorStore } from "langchain/vectorstores";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { supabaseClient } from "../utils/supabaseClient.js";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// // Set the output file path
// const outputPath = path.join(__dirname, "output.log");

// // Open the output file for writing
// const output = fs.createWriteStream(outputPath, { flags: "a" });

// // Redirect console.log to the output file
// console.log = function () {
//   const message =
//     Array.from(arguments).join(" ") +
//     "\n-------------------------------------------------------------------------------------------------------------------------------\n";
//   output.write(message);
//   process.stdout.write(message);
// };

async function extractDataFromDocuments(pathToPdfs) {
  const loader = new DirectoryLoader(pathToPdfs, {
    ".pdf": (path) => new PDFLoader(path),
    ".txt": (path) => new TextLoader(path),
  });

  const docs = await loader.load();

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
  try {
    //load data from pdfs
    const docs = await extractDataFromDocuments("files");
    // console.log(docs);

    //split documents into chunks for openai context window
    const chunks = await splitDocsIntoChunks(docs);
    // console.log(chunks);

    //embed docs into supabase
    await embedDocuments(supabaseClient, chunks, new OpenAIEmbeddings());
  } catch (error) {
    console.log("[-] error occured: " + error);
  }
};

run();
