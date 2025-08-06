import { useState, useCallback } from "react";
import {
  Header,
  ColumnConfiguration,
  CustomInstructions,
  DataInput,
  ApiConfiguration,
  DataPreview,
  EnrichmentControls,
  ResultsDisplay,
  LoadingOverlay,
} from "./components";
import { useDataEnrichment, useLocalStorage } from "./hooks";
import type { DataRow, ColumnDefinition } from "./types";

function App() {
  const [columns, setColumns] = useState<ColumnDefinition[]>([]);
  const [data, setData] = useState<DataRow[]>([]);
  const [customInstructions, setCustomInstructions] = useLocalStorage(
    "prplx-custom-instructions",
    "",
  );
  const [apiKey, setApiKey] = useLocalStorage("prplx-api-key", "");

  const {
    isEnriching,
    progress,
    enrichedData,
    errors,
    enrichData,
    exportData,
    clearResults,
  } = useDataEnrichment();

  const canStartEnrichment = Boolean(
    columns.length > 0 && data.length > 0 && apiKey.trim() && !isEnriching,
  );

  const handleStartEnrichment = useCallback(async () => {
    if (!canStartEnrichment) return;

    clearResults();

    try {
      await enrichData(data, columns, apiKey, customInstructions);
    } catch (error) {
      console.error("Enrichment failed:", error);
    }
  }, [
    data,
    columns,
    apiKey,
    customInstructions,
    enrichData,
    clearResults,
    canStartEnrichment,
  ]);

  const handleExport = useCallback(
    (format: "csv" | "json") => {
      if (enrichedData.length > 0) {
        exportData(enrichedData, columns, format);
      }
    },
    [enrichedData, columns, exportData],
  );

  const totalMissingFields = data.reduce((total, row) => {
    return (
      total +
      columns.filter((col) => {
        const value = row[col.name];
        return !value || value.toString().trim() === "";
      }).length
    );
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Header />

        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ColumnConfiguration
              columns={columns}
              onColumnsChange={setColumns}
            />
            <CustomInstructions
              instructions={customInstructions}
              onInstructionsChange={setCustomInstructions}
            />
          </div>

          <DataInput data={data} onDataChange={setData} />

          <ApiConfiguration apiKey={apiKey} onApiKeyChange={setApiKey} />

          <DataPreview data={data} columns={columns} />

          <EnrichmentControls
            isEnriching={isEnriching}
            progress={progress}
            onStart={handleStartEnrichment}
            canStart={canStartEnrichment}
            totalMissing={totalMissingFields}
          />

          <ResultsDisplay
            data={enrichedData}
            columns={columns}
            errors={errors}
            onExport={handleExport}
          />
        </div>
      </div>
      <LoadingOverlay
        isVisible={isEnriching}
        message={progress.current || "Enriching your data with AI..."}
      />
    </div>
  );
}

export default App;
