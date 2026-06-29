import React from 'react';
import { 
  Sun, CloudSun, Cloud, CloudRain, CloudLightning, CloudRainWind, Snowflake,
  Droplets, Wind, Sunrise, Sunset, Eye, Clock
} from 'lucide-react';
import { CentralWeatherData, getWeatherCondition } from '../utils/weatherApi';

interface CurrentWeatherProps {
  weather: CentralWeatherData;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather }) => {
  const { current, hourly } = weather;
  const currentCondition = getWeatherCondition(current.weatherCode);

  // Get weather icons dynamically
  const getWeatherIcon = (iconName: string, size = 24, className = "") => {
    const props = { size, className };
    switch (iconName) {
      case 'Sun': return <Sun {...props} />;
      case 'CloudSun': return <CloudSun {...props} />;
      case 'Cloud': return <Cloud {...props} />;
      case 'CloudRain': return <CloudRain {...props} />;
      case 'CloudRainWind': return <CloudRainWind {...props} />;
      case 'CloudLightning': return <CloudLightning {...props} />;
      case 'Snowflake': return <Snowflake {...props} />;
      default: return <Cloud {...props} />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="current-weather-row">
      {/* Current Conditions Card */}
      <div className="lg:col-span-1 bg-midnight border border-steel/25 rounded-2xl p-5 shadow-sm flex flex-col justify-between" id="conditions-card">
        <div>
          <h2 className="text-sm font-black text-amber tracking-widest font-mono uppercase mb-4 flex items-center gap-2">
            <CloudSun size={16} /> CURRENT CONDITIONS
          </h2>
          
          <div className="flex items-baseline gap-2 mb-4" id="temp-display">
            <span className="text-5xl font-black font-mono text-cream leading-none">{current.temp}°C</span>
            <span className="text-steel text-xs font-mono">Feels like {current.feelsLike}°C</span>
          </div>

          <div className="flex items-center gap-3.5 bg-navy/20 border border-steel/20 p-3 rounded-xl mb-4" id="condition-box">
            <div className="text-amber shrink-0">{getWeatherIcon(currentCondition.icon, 36)}</div>
            <div>
              <div className="font-bold text-cream text-base">{currentCondition.text}</div>
              <div className="text-[10px] text-steel font-mono">Pagbilao Central Station</div>
            </div>
          </div>
        </div>

        {/* Detailed Specs Grid */}
        <div className="grid grid-cols-2 gap-4 border-t border-steel/15 pt-4 font-mono text-xs" id="specs-grid">
          <div className="flex items-center gap-2" id="spec-humidity">
            <Droplets className="text-amber" size={16} />
            <div>
              <div className="text-steel text-[8px] uppercase font-bold">HUMIDITY</div>
              <div className="text-cream font-bold">{current.humidity}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2" id="spec-wind">
            <Wind className="text-amber" size={16} />
            <div>
              <div className="text-steel text-[8px] uppercase font-bold">WIND</div>
              <div className="text-cream font-bold">{current.windSpeed} km/h</div>
            </div>
          </div>
          <div className="flex items-center gap-2" id="spec-clouds">
            <Cloud className="text-amber" size={16} />
            <div>
              <div className="text-steel text-[8px] uppercase font-bold">CLOUD COVER</div>
              <div className="text-cream font-bold">{current.cloudCover}%</div>
            </div>
          </div>
          <div className="flex items-center gap-2" id="spec-uv">
            <Sun className="text-amber" size={16} />
            <div>
              <div className="text-steel text-[8px] uppercase font-bold">UV INDEX</div>
              <div className="text-cream font-bold">{current.uvIndex} / {current.uvMax}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-steel/15 pt-2" id="spec-sunrise">
            <Sunrise className="text-amber" size={16} />
            <div>
              <div className="text-steel text-[8px] uppercase font-bold">SUNRISE</div>
              <div className="text-cream font-bold">{current.sunrise}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-steel/15 pt-2" id="spec-sunset">
            <Sunset className="text-amber" size={16} />
            <div>
              <div className="text-steel text-[8px] uppercase font-bold">SUNSET</div>
              <div className="text-cream font-bold">{current.sunset}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 24-Hour Forecast Scroll */}
      <div className="lg:col-span-2 bg-midnight border border-steel/25 rounded-2xl p-5 shadow-sm flex flex-col justify-between" id="hourly-forecast-card">
        <div>
          <h2 className="text-sm font-black text-amber tracking-widest font-mono uppercase mb-4 flex items-center gap-2">
            <Clock className="text-amber" size={16} /> 24-HOUR METEOROLOGICAL OUTLOOK
          </h2>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-steel/30 scrollbar-track-transparent" id="hourly-scroll">
            {hourly.map((item, idx) => {
              const cond = getWeatherCondition(item.rain > 30 ? 61 : item.cloudCover > 50 ? 3 : 0);
              return (
                <div 
                  key={idx}
                  className="flex-shrink-0 w-24 bg-navy/20 border border-steel/20 p-3 rounded-xl flex flex-col items-center justify-between font-mono hover:border-amber transition-colors"
                  id={`hour-${idx}`}
                >
                  <div className="text-steel text-[10px] font-bold">{item.time}</div>
                  <div className="text-amber my-2 shrink-0">{getWeatherIcon(cond.icon, 24)}</div>
                  <div className="text-cream font-black text-sm">{item.temp}°C</div>
                  
                  <div className="w-full mt-3 pt-2 border-t border-steel/15 text-[9px] space-y-1">
                    <div className="flex justify-between text-steel">
                      <span>Rain:</span>
                      <span className="text-amber font-bold">{item.rain}%</span>
                    </div>
                    <div className="flex justify-between text-steel">
                      <span>Wind:</span>
                      <span className="text-cream font-bold">{item.windSpeed}k</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-2 text-[10px] font-mono text-steel flex items-center gap-1.5 border-t border-steel/10 pt-3">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber animate-ping"></span>
          <span>Projections updated in real-time every 2 hours with global ECMWF parameters.</span>
        </div>
      </div>
    </div>
  );
};
