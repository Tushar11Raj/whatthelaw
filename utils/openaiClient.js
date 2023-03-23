import { OpenAI } from "langchain/llms";

if (!process.env.openai_key) {
  throw new Error("Missing OpenAI Credentials");
}

export const openai = new OpenAI({
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
