import type { DataRow, ColumnDefinition, PerplexityResponse } from '../types';
import { API_CONSTANTS } from '../constants';

export interface PerplexityQueryParams {
  rowData: DataRow;
  missingColumns: string[];
  columns: ColumnDefinition[];
  apiKey: string;
  customInstructions?: string;
}

export const enrichmentQuery = async ({
  rowData,
  missingColumns,
  columns,
  apiKey,
  customInstructions = ''
}: PerplexityQueryParams): Promise<Record<string, string>> => {
  const availableData: Record<string, unknown> = {};
  Object.entries(rowData).forEach(([key, value]) => {
    if (value && value.toString().trim() !== '') {
      availableData[key] = value;
    }
  });

  const requestedFields = missingColumns.map(col => {
    const columnDef = columns.find(c => c.name === col);
    const abbrev = columnDef?.abbreviation || col.substring(0, 2).toUpperCase();
    return `${abbrev}:${col}`;
  }).join('\n');

  const baseQuery = `Given the following information: ${JSON.stringify(availableData)}, please find and provide the missing information in this exact format (no spaces after the colon):\n${requestedFields}\n\nSeparate multiple items with three newlines. Only return the requested fields in the specified format.`;
  
  const query = customInstructions 
    ? `${customInstructions}\n\n${baseQuery}`
    : baseQuery;

  const response = await fetch(`${API_CONSTANTS.PERPLEXITY_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        {
          role: 'user',
          content: query
        }
      ],
      max_tokens: API_CONSTANTS.MAX_TOKENS,
      temperature: API_CONSTANTS.TEMPERATURE
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Perplexity API error (${response.status}): ${errorText}`);
  }

  const result: PerplexityResponse = await response.json();
  const content = result.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error('No response content from Perplexity API');
  }

  return parsePerplexityResponse(content, missingColumns);
};

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_CONSTANTS.PERPLEXITY_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1
      })
    });

    return response.ok || response.status === 400; // 400 might be valid key but bad request
  } catch {
    return false;
  }
};

const parsePerplexityResponse = (content: string, missingColumns: string[]): Record<string, string> => {
  const enrichmentData: Record<string, string> = {};
  const lines = content.split('\n').filter(line => line.trim());

  lines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const abbreviation = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();

      if (!value) return;

      const columnAbbreviations: Record<string, string[]> = {
        'FN': ['Full Name', 'Name', 'full_name', 'name'],
        'AD': ['Address', 'Location', 'address', 'location'],
        'AG': ['Age', 'age'],
        'PH': ['Phone', 'Phone Number', 'phone', 'phone_number', 'telephone'],
        'EM': ['Email', 'Email Address', 'email', 'email_address', 'mail'],
        'CO': ['Company', 'Organization', 'company', 'organization', 'employer'],
        'JT': ['Job Title', 'Title', 'Position', 'job_title', 'title', 'position', 'role'],
      };

      const possibleColumns = columnAbbreviations[abbreviation] || [abbreviation];
      const matchingColumn = missingColumns.find(col => 
        possibleColumns.some(possible => 
          col.toLowerCase().includes(possible.toLowerCase()) || 
          possible.toLowerCase().includes(col.toLowerCase())
        )
      );

      if (matchingColumn) {
        enrichmentData[matchingColumn] = value;
      }
    }
  });

  return enrichmentData;
};