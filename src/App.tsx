import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';

// Data & APIs
import { PAGBILAO_BARANGAYS } from './data/barangays';
import { fetchCentralWeather, fetchBarangaysWeather, CentralWeatherData } from './utils/weatherApi';
import { Barangay } from './types';

// Subcomponents
import { Header } from './components/Header';
import { CurrentWeather } from './components/CurrentWeather';
import { TideAndMap } from './components/TideAndMap';
import { SatelliteAndTraffic } from './components/SatelliteAndTraffic';
import { BarangayGrid } from './components/BarangayGrid';
import { DisclaimerFooter } from './components/DisclaimerFooter';

export default function App() {
  const [weatherData, setWeatherData] = useState<CentralWeatherData | null>(null);
  const [barangayData, setBarangayData] = useState<Barangay[]>(PAGBILAO_BARANGAYS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  // Sync both central and regional barangay weather feeds in real-time
  const syncWeatherFeeds = async () => {
    setLoading(true);
    setError(false);
    try {
      const [central, barangs] = await Promise.all([
        fetchCentralWeather(),
        fetchBarangaysWeather(PAGBILAO_BARANGAYS)
      ]);
      setWeatherData(central);
      setBarangayData(barangs);
    } catch (err) {
      console.error('Failed to synchronize real-time weather feeds:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clock tick (Philippine Standard Time HUD)
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }));
    };
    
    updateTime();
    const clockTimer = setInterval(updateTime, 1000);

    // Initial load
    syncWeatherFeeds();

    // Auto-refresh feeds every 10 minutes to remain strictly real-time
    const refreshTimer = setInterval(syncWeatherFeeds, 600000);

    return () => {
      clearInterval(clockTimer);
      clearInterval(refreshTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-navy text-cream font-sans selection:bg-amber selection:text-cream antialiased flex flex-col" id="app-viewport-root">
      
      {/* Top Banner Alert / Bulletin */}
      <div className="bg-midnight border-b border-steel/25 py-2 overflow-hidden text-xs font-mono relative z-10 shadow-sm" id="ticker-header">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between" id="ticker-container">
          <div className="flex items-center gap-2 text-orange-bright font-black" id="ticker-prefix">
            <ShieldAlert size={14} className="animate-pulse" />
            <span className="uppercase tracking-wider">EOC BULLETIN:</span>
          </div>
          <div className="text-steel font-bold text-[11px] truncate flex-1 ml-3" id="ticker-text">
            All 27 Barangay Incident Command Desks reported ACTIVE and operational. Monitoring coastal tide changes and localized rainfall.
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="grow max-w-7xl w-full mx-auto px-4 py-6 flex flex-col gap-6" id="dashboard-content-main">
        
        {/* Loading State */}
        {loading && !weatherData && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-midnight border border-steel/20 rounded-2xl shadow-sm min-h-[500px]" id="loading-state">
            <Loader2 className="text-amber animate-spin mb-4" size={48} />
            <h2 className="text-cream font-bold text-lg font-display">Synchronizing Live Meteorological Feeds</h2>
            <p className="text-xs text-steel mt-1 max-w-sm font-mono leading-relaxed">
              Fetching real-time Pagbilao coordinates and 27 localized barangay radar updates directly from Open-Meteo networks. Please wait...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !weatherData && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-midnight border border-steel/20 rounded-2xl shadow-sm min-h-[500px]" id="error-state">
            <AlertTriangle className="text-orange-bright animate-bounce mb-4" size={48} />
            <h2 className="text-cream font-bold text-lg font-display">Connection Sync Failed</h2>
            <p className="text-xs text-steel mt-1 max-w-md font-mono leading-relaxed">
              Could not establish secure connections to Open-Meteo or regional meteorological servers. Please check your network and attempt manual synchronization.
            </p>
            <button
              onClick={syncWeatherFeeds}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber hover:bg-amber/90 text-cream font-bold transition-all border border-amber/30 cursor-pointer shadow-md text-xs font-mono"
              id="btn-retry-sync"
            >
              <RefreshCw size={14} />
              <span>RETRY FEED CONNECTION</span>
            </button>
          </div>
        )}

        {/* Dashboard Panels */}
        {weatherData && (
          <>
            {/* Header HUD */}
            <Header
              lastUpdated={new Date().toLocaleTimeString()}
              currentTime={currentTime}
              currentDate={currentDate}
              loading={loading}
              onRefresh={syncWeatherFeeds}
            />

            {/* Dynamic Alerts Banner */}
            {weatherData.warnings.map((warn) => (
              <div 
                key={warn.id}
                className="p-4 bg-orange-bright/10 border border-orange-bright/35 text-cream rounded-xl flex items-start gap-3 relative overflow-hidden animate-pulse shadow-sm"
                id={`warning-alert-${warn.id}`}
              >
                <AlertTriangle className="flex-shrink-0 mt-0.5 text-orange-bright" size={18} />
                <div className="font-mono text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black uppercase tracking-wider text-orange-bright">{warn.title}</span>
                    <span className="text-[9px] uppercase bg-orange-bright/20 px-2 py-0.5 rounded font-black border border-orange-bright/30">
                      STATUS: {warn.level}
                    </span>
                    <span className="text-steel text-[10px] ml-auto">Reported: {warn.issuedAt}</span>
                  </div>
                  <p className="mt-1 text-steel leading-relaxed text-[11px] font-normal">{warn.description}</p>
                </div>
              </div>
            ))}

            {/* Current Conditions & Hourly Prognosis */}
            <CurrentWeather weather={weatherData} />

            {/* Tide spreadsheet & Dynamic Weather Maps */}
            <TideAndMap />

            {/* Himawari Satellite TIMELAPSE & Traffic Overlays */}
            <SatelliteAndTraffic />

            {/* Barangay Overwatch Grid */}
            <div className="bg-midnight border border-steel/25 rounded-2xl p-5 shadow-sm space-y-4" id="barangay-section-card">
              <div>
                <h2 className="text-sm font-black text-amber tracking-widest font-mono uppercase flex items-center gap-2">
                  🗺️ REGIONAL BARANGAY OVERWATCH (27 AREAS)
                </h2>
                <p className="text-[10px] text-steel font-mono mt-0.5">Real-time localized microclimate telemetry fetched dynamically from Open-Meteo servers</p>
              </div>
              <BarangayGrid barangays={barangayData} />
            </div>

            {/* Footer and Disclaimers */}
            <DisclaimerFooter />
          </>
        )}
      </main>
    </div>
  );
}
