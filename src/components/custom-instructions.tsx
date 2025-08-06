import { MessageSquare, HelpCircle, Lightbulb } from 'lucide-react';

interface CustomInstructionsProps {
  instructions: string;
  onInstructionsChange: (instructions: string) => void;
}

export function CustomInstructions({ instructions, onInstructionsChange }: CustomInstructionsProps) {
  const examples = [
    {
      title: "Focus on Recent Data",
      instruction: "Please prioritize finding the most recent and up-to-date information available, especially for professional details and contact information."
    },
    {
      title: "Business Context",
      instruction: "Focus on business-related information and professional contexts. Look for corporate email addresses and official business addresses when available."
    },
    {
      title: "Specific Region",
      instruction: "Please focus on information from the United States and use US address formats. Prioritize US-based companies and contact details."
    }
  ];

  const applyExample = (instruction: string) => {
    onInstructionsChange(instruction);
  };

  return (
    <section className="card">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-slate-800">Custom Instructions</h2>
        </div>
        <p className="text-slate-600 mt-2">
          Provide specific instructions to guide the AI on what kind of information to look for and how to prioritize the search.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="custom-instructions" className="block text-sm font-medium text-slate-700 mb-2">
            Additional Instructions for Data Enrichment
          </label>
          <textarea
            id="custom-instructions"
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
            className="textarea-field h-32"
            placeholder="E.g., 'Focus on finding the most recent professional information. Prioritize corporate email addresses over personal ones. Look for official business addresses when available.'"
          />
          <p className="text-sm text-slate-500 mt-2">
            These instructions will be included with each enrichment query to help the AI understand your specific requirements.
          </p>
        </div>

        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <h4 className="font-medium text-slate-800">Example Instructions</h4>
          </div>
          <div className="grid gap-3">
            {examples.map((example, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h5 className="font-medium text-slate-800 text-sm mb-1">{example.title}</h5>
                    <p className="text-sm text-slate-600">{example.instruction}</p>
                  </div>
                  <button
                    onClick={() => applyExample(example.instruction)}
                    className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 rounded transition-colors whitespace-nowrap"
                  >
                    Use This
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Tips for Effective Instructions</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be specific about the type of information you want (recent, official, etc.)</li>
                <li>• Mention any geographic or industry preferences</li>
                <li>• Specify data quality preferences (verified sources, official vs. personal)</li>
                <li>• Include any formatting or style requirements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}