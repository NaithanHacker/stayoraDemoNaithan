import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const WhatsAppFloatingButton: React.FC = () => {
  const { settings, getWhatsAppUrl } = useSettings();
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappUrl = getWhatsAppUrl();

  return (
    <aside aria-label="Concierge WhatsApp Inquiries" className="fixed bottom-6 right-6 z-40 flex items-end flex-col space-y-2">
      {showTooltip && (
        <div className="bg-stayora-navy text-stayora-sand-light p-3 rounded-lg border border-stayora-gold/40 shadow-2xl text-xs max-w-xs animate-fadeIn relative">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-1 right-1 text-stayora-sand/50 hover:text-stayora-sand"
            aria-label="Dismiss Concierge WhatsApp notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="font-serif text-stayora-gold font-semibold mb-1">
            Concierge Instant WhatsApp
          </div>
          <p className="text-[11px] text-stayora-sand/80">
            Have a question regarding villa availability, private dining, or bespoke stays? Speak with our concierge desk on WhatsApp.
          </p>
        </div>
      )}

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-stayora-navy border border-stayora-gold/50 shadow-luxury hover:border-stayora-gold hover:shadow-gold-glow transition-all duration-300"
        aria-label="Connect with Stayora Concierge on WhatsApp"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <MessageSquare className="w-5 h-5 text-stayora-gold group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-stayora-sand-light group-hover:text-stayora-gold transition-colors">
          WhatsApp Concierge
        </span>
      </a>
    </aside>
  );
};
