import { useState } from 'react';
import { Upload, FileText, Code, Edit3, CheckCircle, XCircle, Loader } from 'lucide-react';
import { useFileUpload } from '../hooks';
import type { DataRow, InputMethod } from '../types';

interface DataInputProps {
  data: DataRow[];
  onDataChange: (data: DataRow[]) => void;
}

export function DataInput({ data, onDataChange }: DataInputProps) {
  const [activeMethod, setActiveMethod] = useState<InputMethod>('csv');
  const [manualInput, setManualInput] = useState('');
  const { uploadInfo, isProcessing, uploadFile, clearUpload } = useFileUpload();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'csv' | 'json') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsedData = await uploadFile(file, type);
      onDataChange(parsedData);
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  const handleManualInput = () => {
    if (!manualInput.trim()) {
      onDataChange([]);
      return;
    }

    try {
      const parsedData = JSON.parse(manualInput);
      if (Array.isArray(parsedData)) {
        onDataChange(parsedData);
      } else {
        throw new Error('Data must be an array of objects');
      }
    } catch (error) {
      console.error('Manual input parsing error:', error);
    }
  };

  const clearData = () => {
    onDataChange([]);
    setManualInput('');
    clearUpload();
    
    const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
    fileInputs.forEach(input => {
      input.value = '';
    });
  };

  const methodOptions = [
    { id: 'csv', label: 'CSV Upload', icon: FileText },
    { id: 'json', label: 'JSON Upload', icon: Code },
    { id: 'manual', label: 'Manual Entry', icon: Edit3 }
  ] as const;

  return (
    <section className="card">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <Upload className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-slate-800">Data Input</h2>
        </div>
        <p className="text-slate-600 mt-2">
          Upload your existing data in CSV or JSON format, or enter it manually. The system will identify missing fields automatically.
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          {methodOptions.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveMethod(id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                activeMethod === id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {activeMethod === 'csv' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleFileUpload(e, 'csv')}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer block">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 mb-2">Click to upload CSV file</p>
                <p className="text-sm text-slate-500">Supports files up to 10MB</p>
              </label>
            </div>
            {uploadInfo && activeMethod === 'csv' && (
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  {isProcessing ? (
                    <Loader className="w-5 h-5 text-blue-600 animate-spin mt-0.5" />
                  ) : uploadInfo.error ? (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{uploadInfo.name}</p>
                    <p className="text-sm text-slate-600">
                      Size: {(uploadInfo.size / 1024).toFixed(2)} KB
                      {uploadInfo.recordCount && ` • ${uploadInfo.recordCount} records`}
                    </p>
                    {uploadInfo.error && (
                      <p className="text-sm text-red-600 mt-1">{uploadInfo.error}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeMethod === 'json' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
              <input
                type="file"
                accept=".json"
                onChange={(e) => handleFileUpload(e, 'json')}
                className="hidden"
                id="json-upload"
              />
              <label htmlFor="json-upload" className="cursor-pointer block">
                <Code className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 mb-2">Click to upload JSON file</p>
                <p className="text-sm text-slate-500">Must be an array of objects</p>
              </label>
            </div>
            {uploadInfo && activeMethod === 'json' && (
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  {isProcessing ? (
                    <Loader className="w-5 h-5 text-blue-600 animate-spin mt-0.5" />
                  ) : uploadInfo.error ? (
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{uploadInfo.name}</p>
                    <p className="text-sm text-slate-600">
                      Size: {(uploadInfo.size / 1024).toFixed(2)} KB
                      {uploadInfo.recordCount && ` • ${uploadInfo.recordCount} records`}
                    </p>
                    {uploadInfo.error && (
                      <p className="text-sm text-red-600 mt-1">{uploadInfo.error}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeMethod === 'manual' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="manual-input" className="block text-sm font-medium text-slate-700 mb-2">
                JSON Data
              </label>
              <textarea
                id="manual-input"
                value={manualInput}
                onChange={(e) => {
                  setManualInput(e.target.value);
                  handleManualInput();
                }}
                className="textarea-field h-48"
                placeholder={`[\n  {\n    "Full Name": "John Doe",\n    "Company": "Acme Corp"\n  },\n  {\n    "Full Name": "Jane Smith",\n    "Address": "123 Main St"\n  }\n]`}
              />
              <p className="text-sm text-slate-500 mt-2">
                Enter your data as a JSON array of objects. Each object represents one record.
              </p>
            </div>
          </div>
        )}

        {data.length > 0 && (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Data loaded successfully</p>
                <p className="text-sm text-green-700">{data.length} records ready for enrichment</p>
              </div>
            </div>
            <button
              onClick={clearData}
              className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50 transition-colors text-sm font-medium"
            >
              Clear Data
            </button>
          </div>
        )}
      </div>
    </section>
  );
}