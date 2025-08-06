import { useState } from "react";
import OpenAI from "openai";
import { API_CONSTANTS } from '../constants';

function usePerplexity() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (prompt: string, apiKey: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    const client = new OpenAI({
      apiKey,
      baseURL: API_CONSTANTS.PERPLEXITY_BASE_URL,
    });
    
    try {
      const response = await client.chat.completions.create({
        model: API_CONSTANTS.MODEL,
        messages: [{ role: "user", content: prompt }],
      });
      setLoading(false);
      return response.choices[0].message.content;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  return { generateResponse, loading, error };
}

export { usePerplexity };