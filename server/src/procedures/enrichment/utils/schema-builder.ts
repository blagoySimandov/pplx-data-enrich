type Column = {
  name: string;
  abbreviation?: string;
  type?: string;
  description?: string;
};

export interface SchemaResult {
  expectedSchema: Record<string, string>;
  schemaExample: string;
}

export function buildOutputSchema(
  missingColumns: string[],
  columns: Column[],
  userSchema?: Record<string, string>
): SchemaResult {
  if (userSchema) {
    return {
      expectedSchema: userSchema,
      schemaExample: JSON.stringify(userSchema, null, 2),
    };
  }

  const expectedSchema: Record<string, string> = {};
  
  missingColumns.forEach((col) => {
    const columnDef = columns.find((c) => c.name === col);
    const abbrev = columnDef?.abbreviation || col.substring(0, 2).toUpperCase();
    expectedSchema[abbrev] = col;
  });

  const schemaExample = JSON.stringify(
    Object.keys(expectedSchema).reduce((acc, abbrev) => {
      acc[abbrev] = "example_value_here";
      return acc;
    }, {} as Record<string, string>),
    null,
    2
  );

  return { expectedSchema, schemaExample };
}