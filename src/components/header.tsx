import { Database, Sparkles } from 'lucide-react';
import { messages } from '../messages';

export function Header() {
  return (
    <header className="card text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="relative">
          <Database className="w-8 h-8 text-blue-600 animate-float" />
          <Sparkles className="w-4 h-4 text-indigo-500 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <h1 className="text-4xl font-bold gradient-text">
          {messages.header.title}
        </h1>
      </div>
      <p className="text-slate-600 text-lg max-w-2xl mx-auto">
        {messages.header.subtitle}
      </p>
      <div className="mt-6 flex justify-center gap-6 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>{messages.header.features.csvSupport}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>{messages.header.features.aiPowered}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span>{messages.header.features.exportResults}</span>
        </div>
      </div>
    </header>
  );
}