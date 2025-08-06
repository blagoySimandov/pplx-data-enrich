export function extractAvailableData(rowData: Record<string, unknown>): Record<string, unknown> {
  const availableData: Record<string, unknown> = {};
  
  Object.entries(rowData).forEach(([key, value]) => {
    if (value && value.toString().trim() !== "") {
      availableData[key] = value;
    }
  });
  
  return availableData;
}