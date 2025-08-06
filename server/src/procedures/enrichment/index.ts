import { createPerplexityClient, queryPerplexity } from "../../perplexity";
import { enrichmentQuerySchema } from "../../schema";
import { publicProcedure } from "../../trpc";
import {
  extractAvailableData,
  buildOutputSchema,
  buildFieldDescriptions,
  buildEnrichmentPrompt,
  parsePerplexityResponse,
  extractErrorMessage,
} from "./utils";

export const enrichmentQuery = publicProcedure
  .input(enrichmentQuerySchema)
  .mutation(async ({ input }) => {
    const {
      apiKey,
      rowData,
      missingColumns,
      columns,
      customInstructions = "",
      outputSchema,
    } = input;

    try {
      const client = createPerplexityClient(apiKey);
      const availableData = extractAvailableData(rowData);
      const { expectedSchema, schemaExample } = buildOutputSchema(
        missingColumns,
        columns,
        outputSchema,
      );

      const fieldDescriptions = buildFieldDescriptions(
        missingColumns,
        columns,
        expectedSchema,
      );

      const query = buildEnrichmentPrompt(
        availableData,
        schemaExample,
        fieldDescriptions,
        customInstructions,
      );

      const content = await queryPerplexity(client, query);

      const enrichmentData = parsePerplexityResponse(
        content,
        missingColumns,
        columns,
        expectedSchema,
      );

      return { success: true, data: enrichmentData };
    } catch (error) {
      const errorMessage = extractErrorMessage(error);

      return {
        success: false,
        error: errorMessage,
      };
    }
  });
