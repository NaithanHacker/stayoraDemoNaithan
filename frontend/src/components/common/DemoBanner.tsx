import React, { useState } from 'react';
import { Sparkles, X, ShieldCheck } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-stayora-navy text-stayora-sand-light text-xs border-b border-stayora-gold/20 py-1.5 px-4 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stayora-gold/20 text-stayora-gold font-medium text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> Demo Website
          </span>
          <span className="hidden sm:inline text-stayora-sand/80">
            STAYORA is a luxury hospitality portfolio demonstration. All rates & reservations are simulated for client presentation.
          </span>
          <span className="sm:hidden text-stayora-sand/80 truncate">
            Portfolio showcase demo environment.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/admin/login"
            className="text-stayora-gold hover:underline flex items-center gap-1 font-medium text-[11px]"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Staff Portal
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="text-stayora-sand/50 hover:text-stayora-sand transition-colors p-0.5"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
