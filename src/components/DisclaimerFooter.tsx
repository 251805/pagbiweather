import React from 'react';
import { MessageSquare, ShieldAlert } from 'lucide-react';

export const DisclaimerFooter: React.FC = () => {
  return (
    <footer className="space-y-6 pt-4" id="disclaimer-footer-section">
      {/* Contact Support Desktop Drawer / Float Button */}
      <div className="bg-midnight border border-steel/25 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4" id="support-banner">
        <div className="flex items-center gap-3 text-center sm:text-left" id="support-info">
          <div className="bg-amber/15 p-2 rounded-full border border-amber/30 text-amber">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="font-bold text-cream text-sm font-display">Need Immediate Emergency Assistance?</h3>
            <p className="text-[11px] text-steel font-mono mt-0.5">Chat directly with the Pagbilao Emergency Response Team dispatchers.</p>
          </div>
        </div>
        
        <a
          href="https://m.me/PagbilaoERT"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-amber hover:bg-amber/95 text-cream text-xs font-bold px-4 py-2.5 rounded-xl border border-amber/25 transition-all flex items-center gap-2 font-mono shadow-sm cursor-pointer"
          id="link-messenger-chat"
        >
          <MessageSquare size={14} />
          <span>CHAT WITH MDRRMO ERT</span>
        </a>
      </div>

      {/* Scrolling Hotlines Marquee */}
      <div className="bg-midnight border-y border-steel/25 py-2.5 overflow-hidden relative select-none shadow-inner" id="hotlines-marquee">
        <div className="animate-marquee whitespace-nowrap gap-10 font-mono text-xs font-black text-orange-bright" id="marquee-text">
          <span>📞 MUNICIPAL HOTLINES &mdash; MDRRMO: 0918-624-4564 | 🚒 BFP BUMBERO: 0923-442-4945 | 👮 PNP PULIS: 0998-598-5764 | 🏛️ LGU PAGBILAO: (042) 797-0937</span>
          <span>📞 MUNICIPAL HOTLINES &mdash; MDRRMO: 0918-624-4564 | 🚒 BFP BUMBERO: 0923-442-4945 | 👮 PNP PULIS: 0998-598-5764 | 🏛️ LGU PAGBILAO: (042) 797-0937</span>
          <span>📞 MUNICIPAL HOTLINES &mdash; MDRRMO: 0918-624-4564 | 🚒 BFP BUMBERO: 0923-442-4945 | 👮 PNP PULIS: 0998-598-5764 | 🏛️ LGU PAGBILAO: (042) 797-0937</span>
        </div>
      </div>

      {/* Official Disclaimer Footer */}
      <div className="bg-midnight border border-steel/25 rounded-2xl p-5 shadow-sm text-center font-mono space-y-2" id="official-disclaimer-box">
        <div className="flex items-center justify-center gap-2 text-amber text-xs font-black" id="disclaimer-heading">
          <ShieldAlert size={14} />
          <span>REAL-TIME METEOROLOGICAL DISCLAIMER</span>
        </div>
        <p className="text-[10px] text-steel max-w-2xl mx-auto leading-relaxed" id="disclaimer-text">
          Disclaimer: This page is an independent real-time meteorological portal for the Municipality of Pagbilao, Quezon. All data feeds are synchronized dynamically from open-source registries (PAGASA, Windy, Open-Meteo). For official municipal directives or active rescue dispatches, always consult the MDRRMO command posts directly.
        </p>
        <div className="text-[9px] text-steel/50 pt-2 border-t border-steel/10">
          Pagbilao Command Center Weather App &bull; Powered by Open-Meteo & Himawari Live Feeds
        </div>
      </div>
    </footer>
  );
};
