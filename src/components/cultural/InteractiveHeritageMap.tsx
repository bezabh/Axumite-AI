import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Compass, Navigation, Layers, Info, 
  Sparkles, ExternalLink, ShieldCheck, ChevronRight 
} from 'lucide-react';
import { CulturalHeritageSite } from '../../types';
import { HERITAGE_SITES_DATA } from './HeritageMatrix';
import { useLanguage } from '../../context/LanguageContext';

export const InteractiveHeritageMap: React.FC = () => {
  const { language } = useLanguage();
  const [activeSite, setActiveSite] = useState<CulturalHeritageSite>(HERITAGE_SITES_DATA[0]);
  const [filterRegion, setFilterRegion] = useState<'all' | 'Tigray' | 'Eritrea'>('all');

  // Convert lat/lng coordinates to SVG viewbox percentages
  // Bounding box for Tigray & Eritrea: Lat 13.0 to 17.5 N, Lng 37.0 to 42.5 E
  const getSvgCoordinates = (lat: number, lng: number) => {
    const minLat = 13.0;
    const maxLat = 17.0;
    const minLng = 37.5;
    const maxLng = 41.5;

    const x = ((lng - minLng) / (maxLng - minLng)) * 700 + 50;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 500 + 50;
    return { x, y };
  };

  const visibleSites = HERITAGE_SITES_DATA.filter((s) => {
    if (filterRegion === 'all') return true;
    return s.region === filterRegion;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950/30 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Compass className="w-4 h-4" />
            <span>Cartographic Heritage Explorer</span>
          </div>
          <h3 className="text-2xl font-bold text-stone-100">
            {language === 'ti' ? 'ካርታ ጥንታውያን ታሪኻዊ ቦታታት' : language === 'de' ? 'Interaktive Kultur- & Welterbekarte' : 'Interactive Axumite & Red Sea Heritage Map'}
          </h3>
          <p className="text-stone-400 text-sm mt-1 max-w-xl">
            {language === 'ti'
              ? 'ካብ ወደብ ቀይሕ ባሕሪ ዓዱሊስን ባጽዕን ክሳብ ደጋዊ ማእከላት ኣክሱም፡ ይሓን ገራልታን ብካርታ ተዓዘቡ።'
              : language === 'de'
              ? 'Erforschen Sie die Handelskorridore, Festungen und Felsenkirchen des Horns von Afrika interaktiv.'
              : 'Explore the trade arteries, ancient ports, stelae fields, and highland monasteries across the historical Axumite landscape.'}
          </p>
        </div>

        {/* Region Filters */}
        <div className="flex items-center gap-2 bg-stone-900 p-1.5 rounded-xl border border-stone-800 self-start md:self-auto">
          {(['all', 'Tigray', 'Eritrea'] as const).map((reg) => (
            <button
              key={reg}
              onClick={() => setFilterRegion(reg)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterRegion === reg ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              {reg === 'all' ? 'All (ኩሉ)' : reg}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map + Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive SVG Canvas */}
        <div className="lg:col-span-8 bg-stone-950 border border-stone-800 rounded-2xl p-4 relative overflow-hidden shadow-2xl min-h-[520px] flex flex-col justify-between">
          {/* Map Top Metadata Ribbon */}
          <div className="flex items-center justify-between z-10 text-xs font-mono text-stone-400 pb-2 border-b border-stone-800/80">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Navigation className="w-3.5 h-3.5" />
              <span>Red Sea Coastal & Highland Escarpment (13°N - 17°N)</span>
            </span>
            <span>Historical Scale 1:250,000</span>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full h-[440px] flex items-center justify-center">
            <svg viewBox="0 0 800 600" className="w-full h-full select-none">
              <defs>
                {/* Gradient for Red Sea water */}
                <linearGradient id="seaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#082f49" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
                </linearGradient>
                {/* Terrain pattern */}
                <radialGradient id="highlandGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#78350f" stopOpacity="0.0" />
                </radialGradient>
              </defs>

              {/* Red Sea Geographic representation */}
              <path
                d="M 500,20 Q 560,180 680,380 L 800,450 L 800,0 L 450,0 Z"
                fill="url(#seaGrad)"
                stroke="#0284c7"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.6"
              />
              <text x="630" y="140" fill="#38bdf8" fontSize="14" fontWeight="bold" fontFamily="monospace" opacity="0.6" letterSpacing="3">
                RED SEA (ቀይሕ ባሕሪ)
              </text>

              {/* Highland Escarpment glow */}
              <circle cx="340" cy="320" r="220" fill="url(#highlandGlow)" />

              {/* Historic Caravan Trade Routes */}
              <path
                d="M 330,420 Q 380,330 450,220"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="6 6"
                opacity="0.5"
              />
              <path
                d="M 450,220 L 580,180"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="6 6"
                opacity="0.5"
              />
              <text x="370" y="340" fill="#f59e0b" fontSize="10" fontFamily="monospace" opacity="0.7">
                Ancient Adulis - Aksum Caravan Route
              </text>

              {/* Geographic Contour Lines */}
              <path d="M 120,480 Q 250,420 380,520" fill="none" stroke="#292524" strokeWidth="1" />
              <path d="M 200,260 Q 320,180 440,240" fill="none" stroke="#292524" strokeWidth="1" />

              {/* Site Pins */}
              {visibleSites.map((site) => {
                const { x, y } = getSvgCoordinates(site.coordinates.lat, site.coordinates.lng);
                const isSelected = activeSite.id === site.id;

                return (
                  <g
                    key={site.id}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => setActiveSite(site)}
                  >
                    {/* Pulsing ring on selection */}
                    {isSelected && (
                      <circle cx={x} cy={y} r="18" fill="#f59e0b" opacity="0.3" className="animate-ping" />
                    )}

                    {/* Outer Pin Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? "11" : "8"}
                      fill={isSelected ? "#f59e0b" : "#44403c"}
                      stroke={isSelected ? "#fef3c7" : "#d97706"}
                      strokeWidth="2"
                    />

                    {/* Inner Core */}
                    <circle cx={x} cy={y} r="4" fill={isSelected ? "#1c1917" : "#f59e0b"} />

                    {/* Site Label text */}
                    <text
                      x={x + 14}
                      y={y + 4}
                      fill={isSelected ? "#fef08a" : "#d6d3d1"}
                      fontSize={isSelected ? "12" : "10"}
                      fontWeight={isSelected ? "bold" : "normal"}
                      fontFamily="sans-serif"
                    >
                      {site.nearestCity} ({site.nameEn.split(' ')[0]})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Footer Legend */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-800/80">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Selected Heritage Landmark
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-600 inline-block" /> Documented Monument
              </span>
            </div>
            <span className="font-mono text-amber-400">Click any site pin to inspect</span>
          </div>
        </div>

        {/* Selected Site Detail Card */}
        <div className="lg:col-span-4 bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-5 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-semibold">
                {activeSite.region} • {activeSite.nearestCity}
              </span>
              {activeSite.unescoStatus && (
                <span className="text-[10px] px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full font-medium">
                  UNESCO
                </span>
              )}
            </div>

            <div>
              <h4 className="text-xl font-bold text-stone-100">{activeSite.nameEn}</h4>
              <p className="text-amber-300 font-geez text-sm mt-0.5">{activeSite.nameTi}</p>
              {language === 'de' && activeSite.nameDe && (
                <p className="text-stone-400 text-xs italic mt-0.5">{activeSite.nameDe}</p>
              )}
            </div>

            <p className="text-xs text-stone-300 leading-relaxed bg-stone-950 p-4 rounded-xl border border-stone-800/80">
              {activeSite.summaryEn}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-lg bg-stone-950 text-stone-300">
                <span className="text-stone-400">Historical Era</span>
                <span className="font-mono text-amber-400 font-semibold">{activeSite.era.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-stone-950 text-stone-300">
                <span className="text-stone-400">Coordinates</span>
                <span className="font-mono text-stone-300">{activeSite.coordinates.lat.toFixed(4)}° N, {activeSite.coordinates.lng.toFixed(4)}° E</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-stone-950 text-stone-300">
                <span className="text-stone-400">Evidence Type</span>
                <span className="text-emerald-400 font-semibold">{activeSite.evidenceType.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Key Archaeological Features:</span>
              <ul className="text-xs text-stone-300 space-y-1 list-disc list-inside">
                {activeSite.keyArtifactsOrFeatures.map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-800 text-xs text-stone-400">
            <span>Preservation guideline: </span>
            <span className="text-stone-300">{activeSite.visitingGuideNotes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
