import { Loader, Zap } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export function LoadingOverlay({ isVisible, message = 'Processing...' }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto">
              <Loader className="w-16 h-16 text-blue-600 animate-spin" />
            </div>
            <Zap className="w-8 h-8 text-yellow-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            AI Enrichment in Progress
          </h3>
          
          <p className="text-slate-600 mb-4">
            {message}
          </p>
          
          <div className="flex justify-center">
            <div className="flex space-x-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
          
          <p className="text-xs text-slate-500 mt-4">
            This may take a few moments depending on the amount of data
          </p>
        </div>
      </div>
    </div>
  );
}