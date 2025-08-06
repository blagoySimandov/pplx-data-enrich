export const messages = {
  header: {
    title: "Data Enrichment Framework",
    subtitle: "Supercharge your datasets with AI-powered enrichment using Perplexity. Upload your data and let our intelligent system fill in the missing pieces.",
    features: {
      csvSupport: "CSV & JSON Support",
      aiPowered: "AI-Powered Enrichment",
      exportResults: "Export Results"
    }
  },
  
  customInstructions: {
    title: "Custom Instructions",
    description: "Provide specific instructions to guide the AI on what kind of information to look for and how to prioritize the search.",
    fieldLabel: "Additional Instructions for Data Enrichment",
    placeholder: "E.g., 'Focus on finding the most recent professional information. Prioritize corporate email addresses over personal ones. Look for official business addresses when available.'",
    helpText: "These instructions will be included with each enrichment query to help the AI understand your specific requirements.",
    examples: {
      title: "Example Instructions",
      recent: {
        title: "Focus on Recent Data",
        instruction: "Please prioritize finding the most recent and up-to-date information available, especially for professional details and contact information."
      },
      business: {
        title: "Business Context",
        instruction: "Focus on business-related information and professional contexts. Look for corporate email addresses and official business addresses when available."
      },
      region: {
        title: "Specific Region",
        instruction: "Please focus on information from the United States and use US address formats. Prioritize US-based companies and contact details."
      }
    },
    useButton: "Use This",
    tips: {
      title: "Tips for Effective Instructions",
      list: [
        "• Be specific about the type of information you want (recent, official, etc.)",
        "• Mention any geographic or industry preferences",
        "• Specify data quality preferences (verified sources, official vs. personal)",
        "• Include any formatting or style requirements"
      ]
    }
  },

  dataInput: {
    title: "Data Input",
    description: "Upload your existing data in CSV or JSON format, or enter it manually. The system will identify missing fields automatically.",
    methods: {
      csv: "CSV Upload",
      json: "JSON Upload",
      manual: "Manual Entry"
    },
    upload: {
      csvText: "Click to upload CSV file",
      jsonText: "Click to upload JSON file",
      sizeLimit: "Supports files up to 10MB",
      formatRequirement: "Must be an array of objects"
    },
    fileStatus: {
      size: "Size:",
      records: "records"
    },
    manual: {
      fieldLabel: "JSON Data",
      placeholder: `[
  {
    "name": "John Doe",
    "company": "Acme Corp"
  },
  {
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
]`,
      instruction: "Enter your data as a JSON array of objects. Each object represents one record."
    },
    messages: {
      invalidData: "Data must be an array of objects",
      successLoaded: "Data loaded successfully",
      recordsReady: "records ready for enrichment"
    },
    actions: {
      clearData: "Clear Data"
    }
  },

  apiConfiguration: {
    title: "API Configuration",
    description: "Enter your Perplexity API key to enable data enrichment. Your key is stored locally and never sent to our servers.",
    fieldLabel: "Perplexity API Key",
    placeholder: "pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    tooltips: {
      hide: "Hide key",
      show: "Show key"
    },
    validation: {
      validating: "Validating...",
      testButton: "Test API Key",
      valid: "API key is valid",
      invalid: "Invalid API key"
    },
    instructions: {
      title: "How to get your API key:",
      steps: [
        "1. Visit the Perplexity API dashboard",
        "2. Sign up or log in to your account",
        "3. Navigate to API keys section",
        "4. Generate a new API key",
        "5. Copy and paste it above"
      ],
      getKeyButton: "Get API Key"
    },
    privacy: {
      title: "Privacy & Security",
      points: [
        "• Your API key is stored locally in your browser",
        "• Keys are never transmitted to our servers",
        "• All API calls go directly to Perplexity",
        "• Clear your browser data to remove stored keys"
      ]
    }
  },

  dataPreview: {
    title: "Data Preview",
    description: "Preview of your data showing the first 5 records with missing fields highlighted.",
    emptyState: {
      title: "No data to preview",
      message: "Upload data and configure columns to see a preview"
    },
    statistics: {
      totalRecords: "Total Records",
      dataCompleteness: "Data Completeness",
      missingFields: "Missing Fields"
    },
    table: {
      rowNumber: "#",
      missing: "(missing)"
    },
    summary: {
      showing: "Showing first 5 of",
      records: "records •",
      fieldsReady: "fields ready for enrichment"
    },
    complete: {
      title: "No Missing Data",
      message: "All configured columns have data. No enrichment needed."
    }
  },

  enrichmentControls: {
    title: "Enrichment",
    description: "Start the AI-powered data enrichment process to fill in missing information.",
    status: {
      ready: {
        title: "Ready for Enrichment",
        message: "missing fields found across your data that can be enriched."
      },
      prerequisite: "Complete all previous steps to start enrichment"
    },
    buttons: {
      start: "Start Enrichment",
      enriching: "Enriching...",
      stop: "Stop"
    },
    progress: {
      processing: "Processing",
      of: "of",
      queries: "queries",
      current: "current"
    },
    completion: {
      title: "Enrichment Complete!",
      processed: "Processed",
      message: "queries. Check the results below."
    },
    info: {
      model: "AI Model",
      modelName: "Perplexity Sonar Small 128K",
      estimatedTime: "Est. Time",
      seconds: "seconds",
      notAvailable: "N/A"
    }
  },

  resultsDisplay: {
    title: "Results",
    emptyState: {
      title: "No results yet",
      message: "Start the enrichment process to see results"
    },
    export: {
      csv: "CSV",
      json: "JSON"
    },
    statistics: {
      totalRecords: "Total Records",
      enrichedRecords: "Enriched Records",
      fieldsAdded: "Fields Added",
      errors: "Errors"
    },
    filter: {
      label: "Filter:",
      all: "All Records",
      enrichedOnly: "Enriched Only",
      errorsOnly: "Errors Only"
    },
    table: {
      rowNumber: "#",
      errorPrefix: "Error:",
      empty: "(empty)"
    },
    pagination: {
      showing: "Showing",
      to: "to",
      of: "of",
      records: "records",
      previous: "Previous",
      page: "Page",
      next: "Next"
    },
    errors: {
      title: "Enrichment Errors",
      row: "Row",
      andMore: "... and",
      moreErrors: "more errors"
    }
  },

  loadingOverlay: {
    defaultMessage: "Processing...",
    title: "AI Enrichment in Progress",
    description: "This may take a few moments depending on the amount of data"
  },

  columnConfiguration: {
    title: "Column Configuration",
    description: "Define the data fields you want to enrich. Each column needs a name and abbreviation for the AI response format.",
    emptyState: {
      message: "No columns configured yet"
    },
    buttons: {
      addDefault: "Add Default Columns",
      addCustom: "Add Custom Column",
      addColumn: "Add Column",
      clearAll: "Clear All",
      cancel: "Cancel",
      remove: "Remove column"
    },
    form: {
      columnName: "Column Name",
      columnNameRequired: "Column Name *",
      abbreviation: "Abbreviation",
      abbreviationRequired: "Abbreviation *",
      description: "Description",
      placeholders: {
        name: "e.g., Full Name",
        nameCustom: "e.g., LinkedIn Profile",
        abbreviation: "e.g., FN",
        abbreviationCustom: "e.g., LI",
        description: "Brief description",
        descriptionOptional: "Optional description"
      }
    },
    addForm: {
      title: "Add New Column"
    }
  },

  common: {
    loading: "Loading...",
    error: "Error",
    success: "Success",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    close: "Close"
  }
};