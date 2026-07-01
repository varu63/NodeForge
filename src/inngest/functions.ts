import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI();

export const excute = inngest.createFunction(
  {
    id: "excute-ai",
    triggers: { event: "execute/ai" },
  },
  async ({ event, step }) => {
    const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
      model: google("gemini-2.0-flash"),
      system: "You are a helpful assisatant",
      prompt: "what  is 2+2 ?",
    });
    return step;
  },
 
);
