import {
  Play,
  Pause,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import type { EnrichmentProgress } from "../types";

interface EnrichmentControlsProps {
  isEnriching: boolean;
  progress: EnrichmentProgress;
  onStart: () => void;
  onStop?: () => void;
  canStart: boolean;
  totalMissing?: number;
}

export function EnrichmentControls({
  isEnriching,
  progress,
  onStart,
  onStop,
  canStart,
  totalMissing = 0,
}: EnrichmentControlsProps) {
  return (
    <section className="card">
      <div className="card-header">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-slate-800">Enrichment</h2>
        </div>
        <p className="text-slate-600 mt-2">
          Start the AI-powered data enrichment process to fill in missing
          information.
        </p>
      </div>

      <div className="space-y-6">
        {totalMissing > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-blue-800">
                  Ready for Enrichment
                </h4>
                <p className="text-sm text-blue-700">
                  {totalMissing} missing fields found across your data that can
                  be enriched.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <button
            onClick={onStart}
            disabled={!canStart || isEnriching}
            className={`btn-primary flex items-center gap-2 ${
              !canStart || isEnriching
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105 transform transition-transform"
            }`}
          >
            <Play className="w-5 h-5" />
            {isEnriching ? "Enriching..." : "Start Enrichment"}
          </button>

          {onStop && isEnriching && (
            <button
              onClick={onStop}
              className="btn-secondary flex items-center gap-2"
            >
              <Pause className="w-4 h-4" />
              Stop
            </button>
          )}

          {!canStart && !isEnriching && (
            <div className="text-sm text-slate-600 flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Complete all previous steps to start enrichment
            </div>
          )}
        </div>

        {isEnriching && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                  <span className="font-medium text-blue-900">Processing</span>
                </div>
                <span className="text-sm text-blue-700">
                  {progress.completed} of {progress.total} queries
                </span>
              </div>

              <div className="relative">
                <div className="w-full bg-blue-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-800">
                    {Math.round(progress.percentage)}%
                  </span>
                </div>
              </div>

              {progress.current && (
                <p className="text-sm text-blue-700 mt-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {progress.current}
                </p>
              )}
            </div>
          </div>
        )}

        {!isEnriching &&
          progress.total > 0 &&
          progress.completed === progress.total && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">
                    Enrichment Complete!
                  </h4>
                  <p className="text-sm text-green-700">
                    Processed {progress.completed} queries. Check the results
                    below.
                  </p>
                </div>
              </div>
            </div>
          )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700 mb-1">
              <Zap className="w-4 h-4" />
              <span className="font-medium">AI Model</span>
            </div>
            <p className="text-slate-600">Perplexity Sonar Small 128K</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700 mb-1">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Est. Time</span>
            </div>
            <p className="text-slate-600">
              {totalMissing > 0
                ? `~${Math.ceil(totalMissing * 2)} seconds`
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

