import { validateApiKeySchema } from "../../schema";
import { publicProcedure } from "../../trpc";
import { createPerplexityClient, queryPerplexity } from "../../perplexity";
import { tryCatch } from "../../util";

export const validateApiKey = publicProcedure
  .input(validateApiKeySchema)
  .mutation(async ({ input }) => {
    try {
      const client = createPerplexityClient(input.apiKey);
      const [result, err] = tryCatch(async () =>
        queryPerplexity(client, "test"),
      );
      if (err)
        return {
          valid: false,
          error: err,
        };

      return { valid: true, id: result };
    } catch (error) {
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (errorMessage.includes("400")) {
        errorMessage =
          "Invalid API key or request format. Please check your Perplexity API key.";
      }

      return {
        valid: false,
        error: errorMessage,
      };
    }
  });
