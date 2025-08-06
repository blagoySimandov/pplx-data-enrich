type Column = {
  name: string;
  abbreviation?: string;
  type?: string;
  description?: string;
};

export function buildFieldDescriptions(
  missingColumns: string[],
  columns: Column[],
  expectedSchema: Record<string, string>
): string {
  return columns
    .filter((col) => missingColumns.includes(col.name))
    .map((col) => {
      const abbrev = Object.keys(expectedSchema).find(
        (key) => expectedSchema[key] === col.name
      ) || col.abbreviation;
      return `- ${abbrev}: ${col.description || col.name} (${col.type || "text"})`;
    })
    .join("\n");
}

export function buildEnrichmentPrompt(
  availableData: Record<string, unknown>,
  schemaExample: string,
  fieldDescriptions: string,
  customInstructions?: string
): string {
  const baseQuery = `Given the following information: ${JSON.stringify(availableData)}, please find and provide the missing information.

CRITICAL: You MUST respond with ONLY a valid JSON object in this exact format:

${schemaExample}

Field descriptions:
${fieldDescriptions}

Requirements:
- Return ONLY valid JSON, no other text before or after
- Use the exact keys shown in the schema above
- If you cannot find information for a field, use "unknown" as the value
- For boolean fields, use true/false (not strings)
- For number fields, use actual numbers (not strings)
- Do not include any explanations, citations, or additional text outside the JSON`;

  return customInstructions ? `${customInstructions}\n\n${baseQuery}` : baseQuery;
}