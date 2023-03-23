import { supabaseClient } from "../utils/supabaseClient.js";
import { SupabaseVectorStore } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { VectorDBQAChain } from "langchain/chains";
import { openai } from "../utils/openaiClient.js";

const query =
  "My car was parked in a no parking zone. I think traffic police locked it. What should i do?";

const model = openai;

async function searchForDocs() {
  const vectorStore = await SupabaseVectorStore.fromExistingIndex(
    supabaseClient,
    new OpenAIEmbeddings(),
    {
      supabaseClient,
      tableName: "documents",
      queryName: "match_documents",
    }
  );

  /*uncomment below to test similarity search */
  //   const results = await vectorStore.similaritySearch(query, 2);

  //   console.log("results", results);

  const chain = VectorDBQAChain.fromLLM(model, vectorStore);

  //Ask a question
  const response = await chain.call({
    query: query,
  });

  console.log("response", response);
}

const run = async () => {
  await searchForDocs();
};

run();
