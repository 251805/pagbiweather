import React from 'react';
import { Calendar, Clock, RefreshCw } from 'lucide-react';

interface HeaderProps {
  lastUpdated: string;
  currentTime: string;
  currentDate: string;
  loading: boolean;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  currentTime,
  currentDate,
  loading,
  onRefresh
}) => {
  return (
    <header className="bg-midnight border border-steel/25 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6" id="dashboard-header">
      <div className="flex items-center gap-4 text-center md:text-left" id="header-identity">
        <div className="shrink-0 hidden sm:block" id="logo-container">
          <img
            src="https://raw.githubusercontent.com/251805/etcfile/main/PCCLogo.png"
            alt="Pagbilao Command Center Logo"
            className="w-14 h-14 object-contain"
            referrerPolicy="no-referrer"
            id="pcc-logo"
          />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-cream tracking-tight font-display">
            Pagbilao Command Center <span className="text-amber">Weather Hub</span>
          </h1>
          <div className="text-steel text-xs font-mono font-medium mt-1">
            Municipality of Pagbilao, Quezon &bull; 13.9714°N, 121.6869°E &bull; Sources: PAGASA &bull; Windy &bull; Open-Meteo
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-mono" id="header-hud">
        {/* Date */}
        <div className="flex items-center gap-2 border-r border-steel/20 pr-4 sm:pr-6" id="hud-date">
          <Calendar className="text-amber" size={16} />
          <div className="text-right">
            <div className="text-steel text-[9px] uppercase font-bold">CURRENT DATE</div>
            <div className="text-cream font-bold">{currentDate || '—'}</div>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center gap-2 border-r border-steel/20 pr-4 sm:pr-6" id="hud-clock">
          <Clock className="text-amber" size={16} />
          <div className="text-right">
            <div className="text-steel text-[9px] uppercase font-bold">EOC TIME (PST)</div>
            <div className="text-cream font-black text-sm">{currentTime || '00:00:00'}</div>
          </div>
        </div>

        {/* Manual Sync */}
        <div className="flex flex-col items-center sm:items-end gap-1" id="hud-sync-group">
          <button
            onClick={onRefresh}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber text-cream font-bold transition-all border border-amber hover:bg-amber/80 cursor-pointer disabled:opacity-50 text-[11px] shadow-sm`}
            id="btn-sync-feeds"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            <span>SYNC FEEDS</span>
          </button>
          <span className="text-[10px] text-steel italic">
            {lastUpdated ? `Synced: ${lastUpdated}` : 'Syncing...'}
          </span>
        </div>
      </div>
    </header>
  );
};
