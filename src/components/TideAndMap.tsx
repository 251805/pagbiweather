import React, { useState } from 'react';
import { Compass, ExternalLink, Map, Maximize2 } from 'lucide-react';

export const TideAndMap: React.FC = () => {
  const [mapProvider, setMapProvider] = useState<'windy' | 'ventusky'>('windy');

  const LAT = 13.9714;
  const LON = 121.6869;

  const windyUrl = `https://embed.windy.com/embed2.html?lat=${LAT}&lon=${LON}&detailLat=${LAT}&detailLon=${LON}&width=650&height=450&zoom=11&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=true&metricWind=default&metricTemp=default&radarRange=-1`;
  const ventuskyUrl = `https://www.ventusky.com/?p=${LAT};${LON};8&l=temperature-2m`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="tide-and-map-row">
      {/* Tide Information */}
      <div className="bg-midnight border border-steel/25 rounded-2xl p-5 shadow-sm flex flex-col justify-between" id="tide-card">
        <div>
          <div className="flex items-center justify-between mb-4" id="tide-header">
            <div>
              <h2 className="text-sm font-black text-amber tracking-widest font-mono uppercase flex items-center gap-2">
                🌊 TIDE & HYDROLOGICAL LEVELS
              </h2>
              <p className="text-[10px] text-steel font-mono mt-0.5">High/low tidal updates for Pagbilao Bay shoreline</p>
            </div>
            <a 
              href="https://www.tide-forecast.com/locations/Pagbilao/tides/latest" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-cream hover:text-amber font-mono underline flex items-center gap-1 cursor-pointer"
              id="tide-forecast-link"
            >
              <span>Full Tide Data</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="h-64 rounded-xl border border-steel/20 overflow-hidden bg-navy" id="tide-iframe-box">
            <iframe 
              src="https://docs.google.com/spreadsheets/d/e/2PACX-1vTSjbOrTAfSXraI2IFkerl2nC4ks8ICcpT9omyK2LRz8R5jKw5bf-2Zl5_zhNbo0F5u0q5Aqm8AWRZh/pubhtml?gid=0&single=true&widget=true&headers=false"
              className="w-full h-full border-0"
              title="Pagbilao Tide Chart Spreadsheets"
              referrerPolicy="no-referrer"
              loading="lazy"
              id="tide-doc-iframe"
            />
          </div>
        </div>
        <div className="text-[10px] text-steel font-mono mt-3">
          Tide height tables synchronized daily from verified naval meteorological logs.
        </div>
      </div>

      {/* Weather Map Provider */}
      <div className="bg-midnight border border-steel/25 rounded-2xl p-5 shadow-sm flex flex-col justify-between" id="map-provider-card">
        <div>
          <div className="flex items-center justify-between mb-4" id="map-header">
            <div>
              <h2 className="text-sm font-black text-amber tracking-widest font-mono uppercase flex items-center gap-2">
                <Map size={16} /> GEOGRAPHIC WEATHER PORTALS
              </h2>
              <p className="text-[10px] text-steel font-mono mt-0.5">Live wind stream & radar telemetry overlays</p>
            </div>
            
            <div className="flex gap-1.5 items-center bg-navy/30 border border-steel/20 p-1 rounded-lg text-[10px] font-mono" id="provider-selector">
              <button
                onClick={() => setMapProvider('windy')}
                className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${mapProvider === 'windy' ? 'bg-amber text-cream shadow-sm' : 'text-steel hover:text-cream'}`}
                id="btn-select-windy"
              >
                Windy
              </button>
              <button
                onClick={() => setMapProvider('ventusky')}
                className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${mapProvider === 'ventusky' ? 'bg-amber text-cream shadow-sm' : 'text-steel hover:text-cream'}`}
                id="btn-select-ventusky"
              >
                Ventusky
              </button>
            </div>
          </div>

          <div className="h-64 rounded-xl border border-steel/20 overflow-hidden bg-navy relative" id="map-iframe-box">
            {mapProvider === 'windy' ? (
              <iframe
                src={windyUrl}
                className="w-full h-full border-0 absolute"
                title="Windy Live Radar Layer"
                referrerPolicy="no-referrer"
                loading="lazy"
                id="windy-iframe-map"
              />
            ) : (
              <iframe
                src={ventuskyUrl}
                className="w-full h-full border-0 absolute"
                title="Ventusky Live Temperature and Precipitation Layer"
                referrerPolicy="no-referrer"
                loading="lazy"
                id="ventusky-iframe-map"
                allow="geolocation; microphone; camera; midi; encrypted-media; fullscreen"
              />
            )}
          </div>
        </div>
        <div className="text-[10px] text-steel font-mono mt-3 flex justify-between items-center">
          <span>Coordinates: {LAT}°N, {LON}°E &bull; Feed: Live</span>
          <a
            href={mapProvider === 'windy' ? windyUrl : ventuskyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber hover:underline flex items-center gap-1 font-bold"
            id="map-external-link"
          >
            <span>Open in New Tab</span>
            <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </div>
  );
};
