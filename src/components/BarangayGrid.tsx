import React, { useState, useMemo } from 'react';
import { Search, MapPin, Thermometer, CloudRain, Droplets, Wind, Compass, ShieldAlert, X, Filter, Navigation, Waves, Sun, SunDim } from 'lucide-react';
import { Barangay } from '../types';

interface BarangayGridProps {
  barangays: Barangay[];
}

export const BarangayGrid: React.FC<BarangayGridProps> = ({ barangays }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'coastal' | 'highland' | 'alert'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'temp' | 'rain'>('name');
  const [selectedBarangay, setSelectedBarangay] = useState<Barangay | null>(null);

  // NOTE: Alupaye is excluded from coastalBarangays per municipal guidelines
  const coastalBarangays = ['Polo Iba', 'Polo Ila', 'Bantigue', 'Daungan (Poblacion)', 'Pinagbayanan'];
  const highlandBarangays = ['Añato', 'Bagumbungan Ila', 'Bagumbungan Iba', 'Ikirin', 'Malicboy Kan.', 'Malicboy Sil.', 'Palsabangon Ila'];

  // Compute dynamic landslide risk based on live real-time precipitation probability
  const parsedBarangays = useMemo(() => {
    return barangays.map(b => {
      const isHighland = highlandBarangays.includes(b.name);
      const rain = b.precipitationProbability || 0;
      let landslideRisk: Barangay['landslideRisk'] = 'Low';
      if (isHighland) {
        landslideRisk = rain > 85 ? 'High' : rain > 50 ? 'Moderate' : 'Low';
      }
      return {
        ...b,
        landslideRisk
      };
    });
  }, [barangays]);

  // Filter and sort barangays
  const filteredBarangays = useMemo(() => {
    let list = [...parsedBarangays];

    if (searchTerm.trim() !== '') {
      list = list.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (filterType === 'coastal') {
      list = list.filter(b => coastalBarangays.includes(b.name));
    } else if (filterType === 'highland') {
      list = list.filter(b => highlandBarangays.includes(b.name));
    } else if (filterType === 'alert') {
      list = list.filter(b => (b.floodLevel && b.floodLevel !== 'Normal') || b.landslideRisk === 'High');
    }

    if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'temp') {
      list.sort((a, b) => (b.temp || 0) - (a.temp || 0));
    } else if (sortBy === 'rain') {
      list.sort((a, b) => (b.precipitationProbability || 0) - (a.precipitationProbability || 0));
    }

    return list;
  }, [parsedBarangays, searchTerm, filterType, sortBy]);

  const getFloodBadgeStyle = (level?: string) => {
    switch (level) {
      case 'Advisory': return 'bg-amber/10 text-amber border-amber/30';
      case 'Watch': return 'bg-amber/20 text-amber border-amber/40';
      case 'Warning': return 'bg-orange-bright/15 text-cream border-orange-bright/35 animate-pulse';
      case 'Critical': return 'bg-orange-bright/25 text-cream border-orange-bright/45 animate-pulse font-bold';
      default: return 'bg-navy/15 text-steel border-steel/20';
    }
  };

  const getLandslideBadgeStyle = (level?: string) => {
    switch (level) {
      case 'High': return 'bg-orange-bright/20 text-cream border-orange-bright/40';
      case 'Moderate': return 'bg-amber/15 text-cream border-amber/35';
      default: return 'bg-navy/15 text-steel border-steel/25';
    }
  };

  return (
    <div className="space-y-5" id="barangay-section">
      <div className="flex flex-col md:flex-row items-center gap-4 justify-between bg-midnight border border-steel/25 rounded-2xl p-4 shadow-sm" id="barangay-controls">
        {/* Search */}
        <div className="relative w-full md:w-80" id="search-box">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-steel" size={16} />
          <input
            type="text"
            placeholder="Search Barangay..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-navy border border-steel/20 rounded-xl text-cream text-sm focus:outline-none focus:border-amber transition-colors font-mono"
            id="barangay-search"
          />
        </div>

        {/* Filter Presets */}
        <div className="flex flex-wrap gap-1.5 items-center w-full md:w-auto" id="filter-pills">
          {(['all', 'coastal', 'highland', 'alert'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold font-mono border transition-all cursor-pointer ${filterType === type ? 'bg-amber text-cream border-amber' : 'bg-navy text-steel border-steel/30 hover:bg-navy/60'}`}
              id={`btn-filter-${type}`}
            >
              {type === 'all' && `All Areas (${barangays.length})`}
              {type === 'coastal' && 'Coastal'}
              {type === 'highland' && 'Highlands'}
              {type === 'alert' && 'Active Warnings'}
            </button>
          ))}
        </div>

        {/* Sorting Selection */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end text-xs font-mono" id="sort-dropdown">
          <span className="text-steel flex items-center gap-1 font-bold"><Filter size={12} /> SORT:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-navy border border-steel/30 text-cream rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber cursor-pointer"
            id="sort-select"
          >
            <option value="name">Barangay Name (A-Z)</option>
            <option value="temp">Warmest Temp</option>
            <option value="rain">Rain Probability</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="barangay-grid-container">
        {filteredBarangays.map((b) => (
          <div
            key={b.name}
            onClick={() => setSelectedBarangay(b)}
            className="bg-navy border border-steel/25 hover:border-amber p-4 rounded-xl shadow-sm cursor-pointer transition-all hover:-translate-y-1 relative flex flex-col justify-between group"
            id={`card-${b.name.replace(/\s+/g, '-')}`}
          >
            <div>
              <div className="flex items-start justify-between mb-2.5" id="card-heading">
                <div className="flex items-center gap-1 text-cream font-bold text-sm font-mono truncate max-w-[75%]">
                  <MapPin size={13} className="text-amber flex-shrink-0 animate-pulse" />
                  <span>{b.name}</span>
                </div>
                {coastalBarangays.includes(b.name) && (
                  <span className="text-[9px] bg-amber/15 text-amber border border-amber/30 px-1.5 py-0.5 rounded font-mono">COAST</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] font-mono text-steel mb-3" id="card-telemetry">
                <div className="flex items-center gap-1">
                  <Thermometer size={11} className="text-amber" />
                  <span className="text-cream font-bold">{b.temp !== undefined ? `${b.temp}°C` : '—'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CloudRain size={11} className="text-steel" />
                  <span>Rain: {b.precipitationProbability !== undefined ? `${b.precipitationProbability}%` : '—'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Droplets size={11} className="text-steel" />
                  <span>Humid: {b.humidity !== undefined ? `${b.humidity}%` : '—'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind size={11} className="text-steel" />
                  <span className="truncate">Wind: {b.windSpeed !== undefined ? `${b.windSpeed}k/h` : '—'}</span>
                </div>
              </div>

              {coastalBarangays.includes(b.name) && b.tideLevel && (
                <div className="mb-3 flex items-center gap-1 text-[9px] text-amber font-mono font-bold bg-amber/5 border border-amber/20 px-2 py-1 rounded" id="card-tide">
                  <Waves size={10} className="animate-pulse" />
                  <span>Tide: {b.tideLevel}</span>
                </div>
              )}
            </div>

            <div className="border-t border-steel/15 pt-2.5 flex justify-between items-center text-[9px] font-mono" id="card-warnings-footer">
              <div>
                <span className="text-steel/60 block uppercase text-[8px] font-bold">FLOOD LEVEL</span>
                <span className={`px-1.5 py-0.5 rounded border ${getFloodBadgeStyle(b.floodLevel)}`}>
                  {b.floodLevel || 'Normal'}
                </span>
              </div>
              
              <div>
                <span className="text-steel/60 block uppercase text-[8px] font-bold">LANDSLIDE RISK</span>
                <span className={`px-1.5 py-0.5 rounded border ${getLandslideBadgeStyle(b.landslideRisk)}`}>
                  {b.landslideRisk || 'Low'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedBarangay && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="modal-overlay">
          <div className="bg-midnight border border-steel/30 w-full max-w-md rounded-2xl overflow-hidden shadow-xl animate-in fade-in duration-150" id="info-modal">
            <div className="bg-navy/30 p-4 border-b border-steel/20 flex items-center justify-between" id="modal-header-container">
              <div>
                <h3 className="text-base font-black text-cream font-mono">{selectedBarangay.name}</h3>
                <span className="text-[10px] text-steel font-mono">GPS: {selectedBarangay.lat}°N, {selectedBarangay.lon}°E</span>
              </div>
              <button 
                onClick={() => setSelectedBarangay(null)}
                className="p-1.5 rounded-lg bg-navy hover:bg-navy/50 border border-steel/30 text-steel hover:text-cream transition-colors cursor-pointer"
                id="btn-close-modal"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-5 space-y-5 text-cream" id="modal-content-container">
              <div className="grid grid-cols-2 gap-3 bg-navy/20 p-4 rounded-xl border border-steel/20 font-mono" id="modal-metrics">
                <div>
                  <span className="text-steel text-[9px] font-bold">TEMPERATURE</span>
                  <div className="text-2xl font-black text-cream mt-0.5">{selectedBarangay.temp !== undefined ? `${selectedBarangay.temp}°C` : '—'}</div>
                </div>
                <div className="border-l border-steel/20 pl-4">
                  <span className="text-steel text-[9px] font-bold">RAIN CHANCE</span>
                  <div className="text-2xl font-black text-amber mt-0.5">{selectedBarangay.precipitationProbability !== undefined ? `${selectedBarangay.precipitationProbability}%` : '—'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-mono border-b border-steel/20 pb-4" id="modal-details-grid">
                <div className="flex justify-between" id="modal-det-humidity">
                  <span className="text-steel flex items-center gap-1"><Droplets size={12} className="text-amber" /> Humidity</span>
                  <span className="text-cream font-bold">{selectedBarangay.humidity !== undefined ? `${selectedBarangay.humidity}%` : '—'}</span>
                </div>
                <div className="flex justify-between" id="modal-det-wind">
                  <span className="text-steel flex items-center gap-1"><Wind size={12} className="text-amber" /> Wind Speed</span>
                  <span className="text-cream font-bold">{selectedBarangay.windSpeed !== undefined ? `${selectedBarangay.windSpeed} km/h` : '—'}</span>
                </div>
                <div className="flex justify-between" id="modal-det-cloud">
                  <span className="text-steel flex items-center gap-1"><Compass size={12} className="text-amber" /> Cloud Cover</span>
                  <span className="text-cream font-bold">{selectedBarangay.cloudCover !== undefined ? `${selectedBarangay.cloudCover}%` : '—'}</span>
                </div>
                <div className="flex justify-between" id="modal-det-uv">
                  <span className="text-steel flex items-center gap-1"><Sun size={12} className="text-amber" /> UV Index</span>
                  <span className="text-cream font-bold">{selectedBarangay.uvIndex !== undefined ? selectedBarangay.uvIndex : '—'}</span>
                </div>
                <div className="flex justify-between" id="modal-det-sunrise">
                  <span className="text-steel flex items-center gap-1">🌅 Sunrise</span>
                  <span className="text-cream font-bold">{selectedBarangay.sunrise || '—'}</span>
                </div>
                <div className="flex justify-between" id="modal-det-sunset">
                  <span className="text-steel flex items-center gap-1">🌇 Sunset</span>
                  <span className="text-cream font-bold">{selectedBarangay.sunset || '—'}</span>
                </div>
                {coastalBarangays.includes(selectedBarangay.name) && (
                  <div className="flex justify-between col-span-2 border-t border-steel/10 pt-2" id="modal-det-tide">
                    <span className="text-steel flex items-center gap-1"><Waves size={12} className="text-amber animate-pulse" /> Coastal Tide Height</span>
                    <span className="text-amber font-black">{selectedBarangay.tideLevel || '—'}</span>
                  </div>
                )}
                <div className="flex justify-between col-span-2 border-t border-steel/10 pt-2" id="modal-det-risk">
                  <span className="text-steel flex items-center gap-1"><ShieldAlert size={12} className="text-amber" /> Landslide Risk Index</span>
                  <span className={`px-2 py-0.5 rounded border ${getLandslideBadgeStyle(selectedBarangay.landslideRisk)}`}>
                    {selectedBarangay.landslideRisk || 'Low'}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 text-xs font-mono" id="modal-actions-container">
                <a 
                  href={`https://www.google.com/maps?q=${selectedBarangay.lat},${selectedBarangay.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber text-cream font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-amber/90"
                  id="link-google-maps"
                >
                  <Navigation size={12} />
                  <span>Google Maps</span>
                </a>
                <button 
                  onClick={() => setSelectedBarangay(null)}
                  className="bg-navy border border-steel/20 text-steel hover:text-cream px-3 py-1.5 rounded-lg cursor-pointer"
                  id="btn-close-modal-footer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
