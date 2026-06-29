import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, FastForward, ExternalLink, ShieldAlert, Navigation } from 'lucide-react';

export const SatelliteAndTraffic: React.FC = () => {
  // Satellite States
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playSpeed, setPlaySpeed] = useState<'1x' | '3x'>('1x');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalFrames = 12;

  // Generate Himawari image URL for a frame (1 to 12)
  const getImageUrl = (frame: number) => {
    return `https://src.meteopilipinas.gov.ph/repo/mtsat-colored/24hour/${frame}-him-colored.png`;
  };

  // Handle timelapse loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = playSpeed === '1x' ? 800 : 250;
      timerRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev >= totalFrames ? 1 : prev + 1));
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playSpeed]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="satellite-and-traffic-row">
      {/* Satellite Timelapse Loop */}
      <div className="bg-midnight border border-steel/25 rounded-2xl p-5 shadow-sm flex flex-col justify-between" id="satellite-card">
        <div>
          <h2 className="text-sm font-black text-amber tracking-widest font-mono uppercase mb-4 flex items-center gap-2">
            🛰️ SATELLITE TIMELAPSE (HIMAWARI)
          </h2>

          <div className="relative aspect-video rounded-xl border border-steel/20 overflow-hidden bg-navy flex items-center justify-center group" id="satellite-viewport">
            {/* Main Image */}
            <img 
              src={getImageUrl(currentFrame)} 
              alt={`Himawari Satellite Loop Frame ${currentFrame}`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              id="satellite-display-image"
            />
            {/* Status indicators */}
            <div className="absolute top-3 left-3 bg-cream/80 backdrop-blur-sm px-2.5 py-1 rounded font-mono text-[9px] text-white flex items-center gap-1.5 border border-steel/30" id="satellite-status-badge">
              <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-orange-bright animate-pulse' : 'bg-steel'}`}></span>
              <span>FRAME {currentFrame} / {totalFrames}</span>
            </div>
            
            <div className="absolute top-3 right-3 bg-cream/80 backdrop-blur-sm px-2.5 py-1 rounded font-mono text-[9px] text-white border border-steel/30">
              PAGASA HIM-COLORED 24H FEED
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-3 bg-navy/20 border border-steel/20 rounded-xl p-3 mt-4 text-xs font-mono" id="satellite-controls">
            <div className="flex items-center gap-2" id="play-pause-buttons">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-amber hover:bg-amber/80 text-cream rounded-lg font-bold border border-amber/30 transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                id="btn-toggle-play"
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>
              
              <button
                onClick={() => setPlaySpeed(playSpeed === '1x' ? '3x' : '1x')}
                className="p-2 bg-navy border border-steel/30 hover:border-amber hover:text-amber text-cream rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                id="btn-toggle-speed"
              >
                <FastForward size={12} />
                <span>SPEED: {playSpeed}</span>
              </button>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-[50%]" id="satellite-frames-scroller">
              {Array.from({ length: totalFrames }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentFrame(i + 1);
                  }}
                  className={`w-6 h-6 rounded border font-bold text-[9px] flex items-center justify-center cursor-pointer transition-all ${currentFrame === i + 1 ? 'bg-amber text-cream border-amber' : 'bg-navy/40 text-steel border-steel/20 hover:border-steel'}`}
                  id={`btn-frame-select-${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* PAGASA Links */}
          <div className="grid grid-cols-2 gap-3 mt-4 text-[11px] font-mono" id="pagasa-links">
            <a 
              href="https://www.pagasa.dost.gov.ph/weather/weather-advisory" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-navy border border-steel/20 hover:border-amber hover:text-amber p-2 rounded-lg flex items-center justify-between text-cream transition-all cursor-pointer"
              id="link-pagasa-advisory"
            >
              <span className="flex items-center gap-1.5"><ShieldAlert size={12} className="text-amber" /> PAGASA Advisory</span>
              <ExternalLink size={10} />
            </a>
            <a 
              href="https://www.pagasa.dost.gov.ph/tropical-cyclone/severe-weather-bulletin/1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-navy border border-steel/20 hover:border-amber hover:text-amber p-2 rounded-lg flex items-center justify-between text-cream transition-all cursor-pointer"
              id="link-pagasa-bulletin"
            >
              <span className="flex items-center gap-1.5"><ShieldAlert size={12} className="text-amber" /> Severe Bulletin</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
        <div className="text-[10px] text-steel font-mono mt-3">
          TIMELAPSE interval: ~2 hours. Real-time frames cached from PAGASA satellite hubs.
        </div>
      </div>

      {/* Waze Live Highway Map */}
      <div className="bg-midnight border border-steel/25 rounded-2xl p-5 shadow-sm flex flex-col justify-between" id="traffic-card">
        <div>
          <h2 className="text-sm font-black text-amber tracking-widest font-mono uppercase mb-4 flex items-center gap-2">
            <Navigation className="text-amber animate-bounce" size={16} /> MAHARLIKA HIGHWAY: PAGBILAO LIVE MAP
          </h2>

          <div className="aspect-video rounded-xl border border-steel/20 overflow-hidden bg-navy relative" id="traffic-viewport">
            <iframe
              src="https://embed.waze.com/iframe?zoom=15&lat=13.979412&lon=121.800453&ct=livemap"
              className="w-full h-full border-0 absolute inset-0"
              title="Waze Maharlika Highway Live Map"
              referrerPolicy="no-referrer"
              loading="lazy"
              id="waze-traffic-iframe"
            />
          </div>
        </div>
        <div className="text-[10px] text-steel font-mono mt-3">
          Road condition updates & traffic density streams fetched from Waze Live Map indices.
        </div>
      </div>
    </div>
  );
};
