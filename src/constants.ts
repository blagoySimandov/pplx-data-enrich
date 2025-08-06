import type { ColumnDefinition } from './types';

export const API_CONSTANTS = {
  PERPLEXITY_BASE_URL: "https://api.perplexity.ai",
  MODEL: "sonar-pro",
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.1,
  FILE_SIZE_LIMIT: 10 * 1024 * 1024, // 10MB
  PAGINATION_SIZE: 5,
  REQUEST_TIMEOUT: 30000, // 30 seconds
} as const;

export const DEFAULT_COLUMNS: ColumnDefinition[] = [
  { name: 'Full Name', abbreviation: 'FN', description: 'Complete name of the person' },
  { name: 'Address', abbreviation: 'AD', description: 'Physical address or location' },
  { name: 'Age', abbreviation: 'AG', description: 'Age in years' },
  { name: 'Phone Number', abbreviation: 'PH', description: 'Contact phone number' },
  { name: 'Email Address', abbreviation: 'EM', description: 'Email contact' },
  { name: 'Company', abbreviation: 'CO', description: 'Company or organization' },
  { name: 'Job Title', abbreviation: 'JT', description: 'Professional title or position' },
];

export const COLUMN_ABBREVIATIONS: Record<string, string[]> = {
  'FN': ['Full Name', 'Name', 'full_name', 'name'],
  'AD': ['Address', 'Location', 'address', 'location'],
  'AG': ['Age', 'age'],
  'PH': ['Phone', 'Phone Number', 'phone', 'phone_number', 'telephone'],
  'EM': ['Email', 'Email Address', 'email', 'email_address', 'mail'],
  'CO': ['Company', 'Organization', 'company', 'organization', 'employer'],
  'JT': ['Job Title', 'Title', 'Position', 'job_title', 'title', 'position', 'role'],
};

export const INPUT_METHODS = {
  CSV: 'csv',
  JSON: 'json',
  MANUAL: 'manual',
} as const;

export const FILTER_TYPES = {
  ALL: 'all',
  ENRICHED_ONLY: 'enriched',
  ERRORS_ONLY: 'errors',
} as const;

export const STORAGE_KEYS = {
  API_KEY: 'perplexity-api-key',
  COLUMNS: 'enrichment-columns',
  CUSTOM_INSTRUCTIONS: 'custom-instructions',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;