import { useState } from "react";
import {
  Key,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { trpc } from "../lib/trpc";

interface ApiConfigurationProps {
  apiKey: string;
  onApiKeyChange: (apiKey: string) => void;
}

export function ApiConfiguration({
  apiKey,
  onApiKeyChange,
}: ApiConfigurationProps) {
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<
    "valid" | "invalid" | null
  >(null);

  const validateApiKeyMutation = trpc.validateApiKey.useMutation();

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      setValidationResult("invalid");
      return;
    }

    setIsValidating(true);
    try {
      const result = await validateApiKeyMutation.mutateAsync({ apiKey });
      setValidationResult(result.valid ? "valid" : "invalid");
    } catch (error) {
      console.error("API key validation failed:", error);
      setValidationResult("invalid");
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyChange = (value: string) => {
    onApiKeyChange(value);
    setValidationResult(null);
  };

  return (
    <section className="card">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <Key className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-slate-800">
            API Configuration
          </h2>
        </div>
        <p className="text-slate-600 mt-2">
          Enter your Perplexity API key to enable data enrichment. Your key is
          stored locally and never sent to our servers.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="api-key"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Perplexity API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              id="api-key"
              value={apiKey}
              onChange={(e) => handleKeyChange(e.target.value)}
              className="input-field pr-24"
              placeholder="pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {validationResult && (
                <div className="mr-1">
                  {validationResult === "valid" ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                title={showKey ? "Hide key" : "Show key"}
              >
                {showKey ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {apiKey && (
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={validateApiKey}
                disabled={isValidating}
                className="btn-secondary text-sm"
              >
                {isValidating ? "Validating..." : "Test API Key"}
              </button>
              {validationResult === "valid" && (
                <p className="text-sm text-green-700 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  API key is valid
                </p>
              )}
              {validationResult === "invalid" && (
                <p className="text-sm text-red-700 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Invalid API key
                </p>
              )}
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">
            How to get your API key:
          </h4>
          <ol className="text-sm text-blue-800 space-y-1 ml-4">
            <li>1. Visit the Perplexity API dashboard</li>
            <li>2. Sign up or log in to your account</li>
            <li>3. Navigate to API keys section</li>
            <li>4. Generate a new API key</li>
            <li>5. Copy and paste it above</li>
          </ol>
          <a
            href="https://www.perplexity.ai/settings/api"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-blue-700 hover:text-blue-900 font-medium"
          >
            Get API Key
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h4 className="font-medium text-slate-800 mb-2 flex items-center gap-2">
            <Key className="w-4 h-4" />
            Privacy & Security
          </h4>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Your API key is stored locally in your browser</li>
            <li>• Keys are never transmitted to our servers</li>
            <li>• All API calls go directly to Perplexity</li>
            <li>• Clear your browser data to remove stored keys</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
