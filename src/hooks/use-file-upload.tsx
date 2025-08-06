import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import type { DataRow, FileUploadInfo } from '../types';

export function useFileUpload() {
  const [uploadInfo, setUploadInfo] = useState<FileUploadInfo | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processCSV = useCallback(async (file: File): Promise<DataRow[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
            return;
          }
          
          const data = results.data as DataRow[];
          if (data.length === 0) {
            reject(new Error('CSV file is empty or contains no valid data'));
            return;
          }
          
          resolve(data);
        },
        error: (error) => {
          reject(new Error(`Failed to parse CSV: ${error.message}`));
        }
      });
    });
  }, []);

  const processJSON = useCallback(async (file: File): Promise<DataRow[]> => {
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      
      if (!Array.isArray(data)) {
        throw new Error('JSON must contain an array of objects');
      }
      
      if (data.length === 0) {
        throw new Error('JSON array is empty');
      }
      
      return data;
    } catch (error) {
      throw new Error(`Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);

  const uploadFile = useCallback(async (file: File, type: 'csv' | 'json'): Promise<DataRow[]> => {
    setIsProcessing(true);
    setUploadInfo({
      name: file.name,
      size: file.size,
      type: file.type
    });

    try {
      let data: DataRow[];
      
      if (type === 'csv') {
        data = await processCSV(file);
      } else {
        data = await processJSON(file);
      }

      setUploadInfo(prev => prev ? {
        ...prev,
        recordCount: data.length
      } : null);

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setUploadInfo(prev => prev ? {
        ...prev,
        error: errorMessage
      } : null);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [processCSV, processJSON]);

  const clearUpload = useCallback(() => {
    setUploadInfo(null);
  }, []);

  return {
    uploadInfo,
    isProcessing,
    uploadFile,
    clearUpload
  };
}