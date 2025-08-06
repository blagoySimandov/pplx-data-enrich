import { useState, useCallback } from "react";
import type {
  DataRow,
  EnrichedDataRow,
  ColumnDefinition,
  EnrichmentProgress,
  EnrichmentError,
} from "../types";
import { trpc } from "../lib/trpc";

export function useDataEnrichment() {
  const [isEnriching, setIsEnriching] = useState(false);
  const [progress, setProgress] = useState<EnrichmentProgress>({
    total: 0,
    completed: 0,
    percentage: 0,
  });
  const [enrichedData, setEnrichedData] = useState<EnrichedDataRow[]>([]);
  const [errors, setErrors] = useState<EnrichmentError[]>([]);

  const enrichmentMutation = trpc.enrichmentQuery.useMutation();


  const identifyMissingData = useCallback(
    (data: DataRow[], columns: ColumnDefinition[]): Map<number, string[]> => {
      const missingDataMap = new Map<number, string[]>();
      const columnNames = columns.map((col) => col.name);

      data.forEach((row, index) => {
        const missingColumns = columnNames.filter((col) => {
          const value = row[col];
          return !value || value.toString().trim() === "";
        });

        if (missingColumns.length > 0) {
          missingDataMap.set(index, missingColumns);
        }
      });

      return missingDataMap;
    },
    [],
  );

  const enrichData = useCallback(
    async (
      data: DataRow[],
      columns: ColumnDefinition[],
      apiKey: string,
      customInstructions: string = "",
    ): Promise<EnrichedDataRow[]> => {
      setIsEnriching(true);
      setErrors([]);

      const enrichedDataCopy: EnrichedDataRow[] = data.map((row) => ({
        ...row,
      }));
      const missingDataMap = identifyMissingData(data, columns);
      const totalQueries = missingDataMap.size;
      let completedQueries = 0;

      setProgress({
        total: totalQueries,
        completed: 0,
        percentage: 0,
      });

      if (totalQueries === 0) {
        setIsEnriching(false);
        setEnrichedData(enrichedDataCopy);
        return enrichedDataCopy;
      }

      const newErrors: EnrichmentError[] = [];

      for (const [rowIndex, missingColumns] of missingDataMap.entries()) {
        setProgress((prev) => ({
          ...prev,
          current: `Processing row ${rowIndex + 1}...`,
        }));

        try {
          const result = await enrichmentMutation.mutateAsync({
            rowData: data[rowIndex],
            missingColumns,
            columns,
            apiKey,
            customInstructions,
          });

          if (!result.success) {
            throw new Error(result.error || 'Enrichment failed');
          }

          const enrichmentData = result.data;

          Object.entries(enrichmentData).forEach(([column, value]) => {
            enrichedDataCopy[rowIndex][column] = value;
            enrichedDataCopy[rowIndex][
              `_enriched_${column}` as keyof EnrichedDataRow
            ] = true;
          });

          const unenrichedColumns = missingColumns.filter(
            (col) => !enrichmentData[col],
          );
          if (unenrichedColumns.length > 0) {
            unenrichedColumns.forEach((col) => {
              newErrors.push({
                rowIndex,
                column: col,
                error: "No data found",
              });
            });
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          missingColumns.forEach((col) => {
            enrichedDataCopy[rowIndex][
              `_error_${col}` as keyof EnrichedDataRow
            ] = errorMessage;
            newErrors.push({
              rowIndex,
              column: col,
              error: errorMessage,
            });
          });
        }

        completedQueries++;
        const percentage = (completedQueries / totalQueries) * 100;
        setProgress({
          total: totalQueries,
          completed: completedQueries,
          percentage,
          current:
            completedQueries < totalQueries
              ? `Processing row ${rowIndex + 2}...`
              : "Completing...",
        });

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setErrors(newErrors);
      setEnrichedData(enrichedDataCopy);
      setIsEnriching(false);

      return enrichedDataCopy;
    },
    [identifyMissingData, enrichmentMutation],
  );

  const exportData = useCallback(
    (
      data: EnrichedDataRow[],
      columns: ColumnDefinition[],
      format: "csv" | "json",
    ) => {
      const cleanData = data.map((row) => {
        const cleanRow: Record<string, unknown> = {};
        columns.forEach((col) => {
          cleanRow[col.name] = row[col.name] || "";
        });
        return cleanRow;
      });

      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === "csv") {
        const headers = columns.map((col) => col.name);
        const csvRows = [
          headers.join(","),
          ...cleanData.map((row) =>
            headers
              .map((header) => {
                const value = row[header] || "";
                return `"${value.toString().replace(/"/g, '""')}"`;
              })
              .join(","),
          ),
        ];
        content = csvRows.join("\n");
        filename = "enriched_data.csv";
        mimeType = "text/csv";
      } else {
        content = JSON.stringify(cleanData, null, 2);
        filename = "enriched_data.json";
        mimeType = "application/json";
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [],
  );

  const clearResults = useCallback(() => {
    setEnrichedData([]);
    setErrors([]);
    setProgress({ total: 0, completed: 0, percentage: 0 });
  }, []);

  return {
    isEnriching,
    progress,
    enrichedData,
    errors,
    enrichData,
    exportData,
    clearResults,
  };
}

