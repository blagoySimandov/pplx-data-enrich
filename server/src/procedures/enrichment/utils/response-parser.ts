type Column = {
  name: string;
  abbreviation?: string;
};

function parseJsonResponse(
  content: string,
  expectedSchema: Record<string, string>,
  missingColumns: string[],
): Record<string, string> {
  const enrichmentData: Record<string, string> = {};
  const jsonResponse = JSON.parse(content.trim());

  Object.entries(expectedSchema).forEach(([abbrev, columnName]) => {
    if (
      jsonResponse[abbrev] !== undefined &&
      missingColumns.includes(columnName)
    ) {
      const value = jsonResponse[abbrev];
      enrichmentData[columnName] = String(value);
    }
  });

  return enrichmentData;
}

function parseLegacyResponse(
  content: string,
  columns: Column[],
  missingColumns: string[],
): Record<string, string> {
  const enrichmentData: Record<string, string> = {};
  const lines = content.split("\n").filter((line) => line.trim());

  const abbreviationMap: Record<string, string> = {};
  columns.forEach((col) => {
    if (col.abbreviation) {
      abbreviationMap[col.abbreviation.toUpperCase()] = col.name;
    }
  });

  lines.forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex <= 0) return;

    const abbreviation = line.substring(0, colonIndex).trim().toUpperCase();
    const value = line.substring(colonIndex + 1).trim();

    if (!value) return;

    const columnName = abbreviationMap[abbreviation];
    if (columnName && missingColumns.includes(columnName)) {
      enrichmentData[columnName] = value;
    }
  });

  return enrichmentData;
}

export function parsePerplexityResponse(
  content: string,
  missingColumns: string[],
  columns: Column[],
  expectedSchema: Record<string, string>,
): Record<string, string> {
  try {
    return parseJsonResponse(content, expectedSchema, missingColumns);
  } catch {
    return parseLegacyResponse(content, columns, missingColumns);
  }
}

