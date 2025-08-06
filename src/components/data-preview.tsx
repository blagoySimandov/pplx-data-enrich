import { Eye, AlertCircle, CheckCircle, Database } from 'lucide-react';
import type { DataRow, ColumnDefinition } from '../types';

interface DataPreviewProps {
  data: DataRow[];
  columns: ColumnDefinition[];
}

export function DataPreview({ data, columns }: DataPreviewProps) {
  if (!data.length || !columns.length) {
    return (
      <section className="card">
        <div className="card-header">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-slate-800">Data Preview</h2>
          </div>
        </div>
        <div className="text-center py-12">
          <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 mb-2">No data to preview</p>
          <p className="text-sm text-slate-500">Upload data and configure columns to see a preview</p>
        </div>
      </section>
    );
  }

  const columnNames = columns.map(col => col.name);
  const previewRows = data.slice(0, 5);
  
  let totalMissing = 0;
  let totalFields = 0;

  data.map(row => {
    const analysis: Record<string, { value: unknown; missing: boolean }> = {};
    columnNames.forEach(col => {
      const value = row[col];
      const missing = !value || value.toString().trim() === '';
      analysis[col] = { value: missing ? null : value, missing };
      totalFields++;
      if (missing) totalMissing++;
    });
    return analysis;
  });

  const completenessPercentage = totalFields > 0 ? ((totalFields - totalMissing) / totalFields) * 100 : 0;

  return (
    <section className="card">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <Eye className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-slate-800">Data Preview</h2>
        </div>
        <p className="text-slate-600 mt-2">
          Preview of your data showing the first 5 records with missing fields highlighted.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-800">Total Records</h4>
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-1">{data.length}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-800">Data Completeness</h4>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-1">{completenessPercentage.toFixed(1)}%</p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h4 className="font-medium text-orange-800">Missing Fields</h4>
            </div>
            <p className="text-2xl font-bold text-orange-900 mt-1">{totalMissing}</p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b border-slate-200">
                  #
                </th>
                {columnNames.map(col => (
                  <th key={col} className="px-4 py-3 text-left text-sm font-medium text-slate-700 border-b border-slate-200">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {previewRows.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-600 font-medium">
                    {index + 1}
                  </td>
                  {columnNames.map(col => {
                    const value = row[col];
                    const isEmpty = !value || value.toString().trim() === '';
                    return (
                      <td
                        key={col}
                        className={`px-4 py-3 text-sm ${
                          isEmpty 
                            ? 'bg-red-50 text-red-600 italic border-l-2 border-red-200' 
                            : 'text-slate-800'
                        }`}
                      >
                        {isEmpty ? '(missing)' : value.toString()}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.length > 5 && (
          <div className="text-center py-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-slate-600">
              Showing first 5 of {data.length} records • 
              {totalMissing > 0 && (
                <span className="text-orange-600 font-medium ml-1">
                  {totalMissing} fields ready for enrichment
                </span>
              )}
            </p>
          </div>
        )}

        {totalMissing === 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-medium text-green-800">No Missing Data</h4>
                <p className="text-sm text-green-700">All configured columns have data. No enrichment needed.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}