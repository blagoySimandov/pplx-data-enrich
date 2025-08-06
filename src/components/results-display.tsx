import { useState } from 'react';
import { BarChart3, Download, CheckCircle, XCircle, AlertCircle, Filter } from 'lucide-react';
import type { EnrichedDataRow, ColumnDefinition, EnrichmentError } from '../types';

interface ResultsDisplayProps {
  data: EnrichedDataRow[];
  columns: ColumnDefinition[];
  errors: EnrichmentError[];
  onExport: (format: 'csv' | 'json') => void;
}

export function ResultsDisplay({ data, columns, errors, onExport }: ResultsDisplayProps) {
  const [filter, setFilter] = useState<'all' | 'enriched' | 'errors'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!data.length) {
    return (
      <section className="card">
        <div className="card-header">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-slate-800">Results</h2>
          </div>
        </div>
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 mb-2">No results yet</p>
          <p className="text-sm text-slate-500">Start the enrichment process to see results</p>
        </div>
      </section>
    );
  }

  const columnNames = columns.map(col => col.name);
  
  let enrichedCount = 0;
  let totalEnrichedFields = 0;
  
  data.forEach(row => {
    let hasEnrichedFields = false;
    columnNames.forEach(col => {
      if (row[`_enriched_${col}` as keyof EnrichedDataRow]) {
        totalEnrichedFields++;
        hasEnrichedFields = true;
      }
    });
    if (hasEnrichedFields) enrichedCount++;
  });

  const filteredData = data.filter(row => {
    if (filter === 'all') return true;
    if (filter === 'enriched') {
      return columnNames.some(col => row[`_enriched_${col}` as keyof EnrichedDataRow]);
    }
    if (filter === 'errors') {
      return columnNames.some(col => row[`_error_${col}` as keyof EnrichedDataRow]);
    }
    return true;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getCellContent = (row: EnrichedDataRow, col: string) => {
    const value = row[col];
    const isEnriched = row[`_enriched_${col}` as keyof EnrichedDataRow];
    const error = row[`_error_${col}` as keyof EnrichedDataRow];

    if (error) {
      return {
        value: `Error: ${error}`,
        className: 'bg-red-50 text-red-700 border-l-2 border-red-300',
        icon: <XCircle className="w-4 h-4 text-red-500" />
      };
    }

    if (isEnriched) {
      return {
        value: value || '',
        className: 'bg-green-50 text-green-800 border-l-2 border-green-300',
        icon: <CheckCircle className="w-4 h-4 text-green-500" />
      };
    }

    if (!value || value.toString().trim() === '') {
      return {
        value: '(empty)',
        className: 'text-slate-400 italic',
        icon: null
      };
    }

    return {
      value: value.toString(),
      className: 'text-slate-800',
      icon: null
    };
  };

  return (
    <section className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-slate-800">Results</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onExport('csv')}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={() => onExport('json')}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              JSON
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-800">Total Records</h4>
            <p className="text-2xl font-bold text-blue-900 mt-1">{data.length}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-medium text-green-800">Enriched Records</h4>
            <p className="text-2xl font-bold text-green-900 mt-1">{enrichedCount}</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h4 className="font-medium text-purple-800">Fields Added</h4>
            <p className="text-2xl font-bold text-purple-900 mt-1">{totalEnrichedFields}</p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h4 className="font-medium text-red-800">Errors</h4>
            <p className="text-2xl font-bold text-red-900 mt-1">{errors.length}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Filter:</span>
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All Records' },
              { key: 'enriched', label: 'Enriched Only' },
              { key: 'errors', label: 'Errors Only' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  setFilter(key as typeof filter);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  filter === key
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b border-slate-200 sticky left-0 bg-slate-50 z-10">
                  #
                </th>
                {columnNames.map(col => (
                  <th key={col} className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b border-slate-200 min-w-[150px]">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedData.map((row, index) => (
                <tr key={startIndex + index} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-600 font-medium sticky left-0 bg-white z-10 border-r border-slate-200">
                    {startIndex + index + 1}
                  </td>
                  {columnNames.map(col => {
                    const { value, className, icon } = getCellContent(row, col);
                    return (
                      <td key={col} className={`px-4 py-3 text-sm ${className}`}>
                        <div className="flex items-center gap-2">
                          {icon}
                          <span className="truncate" title={value.toString()}>
                            {value}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} records
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h4 className="font-medium text-red-800">Enrichment Errors ({errors.length})</h4>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {errors.slice(0, 5).map((error, index) => (
                <p key={index} className="text-sm text-red-700">
                  Row {error.rowIndex + 1}, {error.column}: {error.error}
                </p>
              ))}
              {errors.length > 5 && (
                <p className="text-sm text-red-600 italic">
                  ... and {errors.length - 5} more errors
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}