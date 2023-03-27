import { OpenAI } from "langchain/llms";
import { ChatOpenAI } from "langchain/chat_models";

if (!process.env.openai_key) {
  throw new Error("Missing OpenAI Credentials");
}

export const openai = new ChatOpenAI({
  temperature: 0,
});

export const openaiStream = new OpenAI({
  temperature: 0,
  streaming: true,
  callbackManager: {
    handleNewToken(token) {
      console.log(token);
    },
  },
});
