import z from "zod";

export const enrichmentQuerySchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
  rowData: z.record(z.unknown()),
  missingColumns: z.array(z.string()),
  columns: z.array(
    z.object({
      name: z.string(),
      abbreviation: z.string().optional(),
      type: z.enum(["text", "boolean", "number"]).optional(),
      description: z.string().optional(),
    }),
  ),
  customInstructions: z.string().optional(),
  outputSchema: z.record(z.string()).optional(), // User-defined schema
});

export const validateApiKeySchema = z.object({
  apiKey: z.string().min(1, "API key is required"),
});
