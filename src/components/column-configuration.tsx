import { useState } from "react";
import { Plus, X, Settings, Info } from "lucide-react";
import type { ColumnDefinition, ColumnType } from "../types";

interface ColumnConfigurationProps {
  columns: ColumnDefinition[];
  onColumnsChange: (columns: ColumnDefinition[]) => void;
}

export function ColumnConfiguration({
  columns,
  onColumnsChange,
}: ColumnConfigurationProps) {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [newColumn, setNewColumn] = useState({
    name: "",
    abbreviation: "",
    type: "text" as const,
    description: "",
  });

  const addPresetColumns = () => {
    const DEFAULT_COLUMNS: ColumnDefinition[] = [
      {
        name: "Full Name",
        abbreviation: "FN",
        type: "text",
        description: "Complete name of the person",
      },
      {
        name: "Address",
        abbreviation: "AD",
        type: "text",
        description: "Physical address or location",
      },
      { 
        name: "Age", 
        abbreviation: "AG", 
        type: "number",
        description: "Age in years" 
      },
      {
        name: "Phone Number",
        abbreviation: "PH",
        type: "text",
        description: "Contact phone number",
      },
      {
        name: "Email Address",
        abbreviation: "EM",
        type: "text",
        description: "Email contact",
      },
      {
        name: "Company",
        abbreviation: "CO",
        type: "text",
        description: "Company or organization",
      },
      {
        name: "Job Title",
        abbreviation: "JT",
        type: "text",
        description: "Professional title or position",
      },
    ];

    onColumnsChange(DEFAULT_COLUMNS);
  };

  const addCustomColumn = () => {
    if (newColumn.name.trim() && newColumn.abbreviation.trim()) {
      const updatedColumns = [
        ...columns,
        {
          name: newColumn.name.trim(),
          abbreviation: newColumn.abbreviation.trim().toUpperCase(),
          type: newColumn.type,
          description: newColumn.description.trim() || undefined,
        },
      ];
      onColumnsChange(updatedColumns);
      setNewColumn({ name: "", abbreviation: "", type: "text", description: "" });
      setShowCustomForm(false);
    }
  };

  const removeColumn = (index: number) => {
    const updatedColumns = columns.filter((_, i) => i !== index);
    onColumnsChange(updatedColumns);
  };

  const updateColumn = (
    index: number,
    field: keyof ColumnDefinition,
    value: string,
  ) => {
    const updatedColumns = columns.map((col, i) =>
      i === index ? { ...col, [field]: field === "type" ? value as ColumnType : value } : col,
    );
    onColumnsChange(updatedColumns);
  };

  return (
    <section className="card">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-slate-800">
            Column Configuration
          </h2>
        </div>
        <p className="text-slate-600 mt-2">
          Define the data fields you want to enrich. Each column needs a name
          and abbreviation for the AI response format.
        </p>
      </div>

      <div className="space-y-4">
        {columns.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-slate-50 rounded-lg p-6">
              <Info className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 mb-4">No columns configured yet</p>
              <button onClick={addPresetColumns} className="btn-primary mr-3">
                Add Default Columns
              </button>
              <button
                onClick={() => setShowCustomForm(true)}
                className="btn-secondary"
              >
                Add Custom Column
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {columns.map((column, index) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Column Name
                      </label>
                      <input
                        type="text"
                        value={column.name}
                        onChange={(e) =>
                          updateColumn(index, "name", e.target.value)
                        }
                        className="input-field"
                        placeholder="e.g., Full Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Abbreviation
                      </label>
                      <input
                        type="text"
                        value={column.abbreviation}
                        onChange={(e) =>
                          updateColumn(
                            index,
                            "abbreviation",
                            e.target.value.toUpperCase(),
                          )
                        }
                        className="input-field"
                        placeholder="e.g., FN"
                        maxLength={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Type
                      </label>
                      <select
                        value={column.type}
                        onChange={(e) =>
                          updateColumn(index, "type", e.target.value)
                        }
                        className="input-field"
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                      </select>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={column.description || ""}
                          onChange={(e) =>
                            updateColumn(index, "description", e.target.value)
                          }
                          className="input-field"
                          placeholder="Brief description"
                        />
                      </div>
                      <button
                        onClick={() => removeColumn(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove column"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCustomForm(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Column
              </button>
              {columns.length > 0 && (
                <button
                  onClick={() => onColumnsChange([])}
                  className="text-red-600 hover:text-red-800 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </>
        )}

        {showCustomForm && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-3">Add New Column</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Column Name *
                </label>
                <input
                  type="text"
                  value={newColumn.name}
                  onChange={(e) =>
                    setNewColumn((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="input-field"
                  placeholder="e.g., LinkedIn Profile"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Abbreviation *
                </label>
                <input
                  type="text"
                  value={newColumn.abbreviation}
                  onChange={(e) =>
                    setNewColumn((prev) => ({
                      ...prev,
                      abbreviation: e.target.value.toUpperCase(),
                    }))
                  }
                  className="input-field"
                  placeholder="e.g., LI"
                  maxLength={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Type *
                </label>
                <select
                  value={newColumn.type}
                  onChange={(e) =>
                    setNewColumn((prev) => ({ ...prev, type: e.target.value as ColumnType }))
                  }
                  className="input-field"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newColumn.description}
                  onChange={(e) =>
                    setNewColumn((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="input-field"
                  placeholder="Optional description"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={addCustomColumn}
                disabled={
                  !newColumn.name.trim() || !newColumn.abbreviation.trim()
                }
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Column
              </button>
              <button
                onClick={() => {
                  setShowCustomForm(false);
                  setNewColumn({ name: "", abbreviation: "", description: "" });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
