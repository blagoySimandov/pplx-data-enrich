export interface DataRow {
  [key: string]: string | number | boolean | null | undefined;
}

export interface EnrichedDataRow extends DataRow {
  [key: `_enriched_${string}`]: boolean;
  [key: `_error_${string}`]: string;
}

export type ColumnType = "text" | "boolean" | "number";

export interface ColumnDefinition {
  name: string;
  abbreviation: string;
  type: ColumnType;
  description?: string;
}

export interface EnrichmentConfig {
  columns: ColumnDefinition[];
  perplexityApiKey: string;
  customInstructions: string;
  data: DataRow[];
}

export interface EnrichmentProgress {
  total: number;
  completed: number;
  current?: string;
  percentage: number;
}

export interface EnrichmentResult {
  success: boolean;
  data?: EnrichedDataRow[];
  error?: string;
  progress?: EnrichmentProgress;
}

export type InputMethod = "csv" | "json" | "manual";

export interface FileUploadInfo {
  name: string;
  size: number;
  type: string;
  recordCount?: number;
  error?: string;
}

export interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface EnrichmentError {
  rowIndex: number;
  column: string;
  error: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
