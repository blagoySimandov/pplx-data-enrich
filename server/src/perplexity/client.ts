import OpenAI from "openai";
import {
  PERPLEXITY_BASE_URL,
  MODEL,
  MAX_TOKENS,
  TEMPERATURE,
} from "./constants";

export function createPerplexityClient(apiKey: string): OpenAI {
  return new OpenAI({
    apiKey,
    baseURL: PERPLEXITY_BASE_URL,
  });
}

type PerplexityQueryOptions = {
  maxTokens?: number;
};

export async function queryPerplexity(
  client: OpenAI,
  prompt: string,
  options?: PerplexityQueryOptions,
): Promise<string> {
  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    max_tokens: options?.maxTokens ?? MAX_TOKENS,
    temperature: TEMPERATURE,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No response content from Perplexity API");
  }

  return content;
}
