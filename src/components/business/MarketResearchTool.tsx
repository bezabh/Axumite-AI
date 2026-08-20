import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, Search, Users, Target, AlertTriangle, Lightbulb, 
  RefreshCw, TrendingUp, ShieldCheck, PieChart, Sparkles 
} from 'lucide-react';
import { MarketAnalysisReport, BusinessIndustry } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export const MarketResearchTool: React.FC = () => {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [industry, setIndustry] = useState<BusinessIndustry>('agribusiness_coffee');
  const [region, setRegion] = useState('Horn of Africa, Gulf & Europe Diaspora');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<MarketAnalysisReport | null>(null);

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/business/market-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, industry, region }),
      });
      const data = await res.json();
      if (data.success && data.report) {
        setReport(data.report);
      }
    } catch (err) {
      console.error('Market analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Market Intelligence & Competitor Matrix</span>
        </div>
        <h3 className="text-2xl font-bold text-stone-100">
          {language === 'ti' ? 'AI ናይ ዕዳጋን ተወዳደርትን ትንታነ' : language === 'de' ? 'KI-Markt- & Wettbewerbsanalyse' : 'AI Market & Competitor Intelligence'}
        </h3>
        <p className="text-stone-400 text-sm mt-1 max-w-xl">
          {language === 'ti'
            ? 'ናይ ዕዳጋ ኩነታት፡ ተወዳደርቲ ኩባንያታት፡ ናይ ዓማዊል ጠባያትን ስትራተጂካዊ ምኽርታትን ብዝርዝር ተረዱ።'
            : language === 'de'
            ? 'Verstehen Sie Branchentrends, Wettbewerbermatrizen, Zielgruppen-Personas und strategische Empfehlungen.'
            : 'Analyze regional and global industry trends, competitor pricing matrices, and customer persona archetypes.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
              {language === 'ti' ? 'ዓውዲ ወይ ናይ ዕዳጋ ሕቶ' : language === 'de' ? 'Marktsegment / Suchbegriff' : 'Sector or Product Query'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Specialty Highland Coffee Export to Germany & UAE..."
                className="w-full bg-stone-950 border border-stone-700 focus:border-cyan-500 text-stone-100 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none"
              />
              <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
              {language === 'ti' ? 'ዒላማ ዞባ' : language === 'de' ? 'Region' : 'Geographic Region'}
            </label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. Horn of Africa & Diaspora"
              className="w-full bg-stone-950 border border-stone-700 focus:border-cyan-500 text-stone-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !query.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-stone-950 font-bold rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Intelligence...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Market Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Report Output */}
      {report && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl"
        >
          <div className="pb-4 border-b border-stone-800">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{report.id}</span>
            <h4 className="text-2xl font-bold text-stone-100 mt-1">{report.query}</h4>
            <p className="text-stone-400 text-xs">{report.region} • Generated {new Date(report.generatedDate).toLocaleDateString()}</p>
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <h5 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Market Overview</h5>
            <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800 text-stone-200 text-sm leading-relaxed space-y-2">
              <p>{report.marketOverview}</p>
              {report.marketOverviewTi && (
                <p className="text-amber-200/90 pt-2 border-t border-stone-800/60 font-geez">{report.marketOverviewTi}</p>
              )}
            </div>
          </div>

          {/* Key Trends */}
          <div className="space-y-2">
            <h5 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Key Market Drivers & Trends</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {report.keyTrends.map((trend, i) => (
                <div key={i} className="bg-stone-950/60 border border-stone-800 p-3.5 rounded-xl flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-stone-300 text-xs leading-normal">{trend}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor Matrix Table */}
          <div className="space-y-2">
            <h5 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <PieChart className="w-4 h-4" />
              <span>Competitor Benchmarking Matrix</span>
            </h5>
            <div className="overflow-x-auto border border-stone-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 text-stone-400 uppercase font-mono border-b border-stone-800">
                  <tr>
                    <th className="p-3">Competitor</th>
                    <th className="p-3">Market Share</th>
                    <th className="p-3">Strengths</th>
                    <th className="p-3">Vulnerabilities</th>
                    <th className="p-3">Pricing Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 bg-stone-950/40 text-stone-200">
                  {report.competitorMatrix.map((comp, i) => (
                    <tr key={i} className="hover:bg-stone-900/60">
                      <td className="p-3 font-semibold text-stone-100">{comp.competitorName}</td>
                      <td className="p-3 text-cyan-400 font-mono">{comp.marketShare}</td>
                      <td className="p-3 text-emerald-400/90">{comp.strengths}</td>
                      <td className="p-3 text-rose-400/90">{comp.vulnerabilities}</td>
                      <td className="p-3 text-stone-300">{comp.pricingStrategy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Personas */}
          <div className="space-y-2">
            <h5 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>Target Customer Personas</span>
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.customerPersonas.map((persona, i) => (
                <div key={i} className="bg-stone-950/70 border border-stone-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-100 text-sm">{persona.name}</span>
                    <span className="text-[11px] px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-mono">{persona.budget}</span>
                  </div>
                  <p className="text-stone-400 text-xs italic">{persona.archetype}</p>
                  <div className="text-xs text-stone-300">
                    <span className="font-semibold text-stone-400">Needs: </span>
                    {persona.primaryNeeds.join(', ')}
                  </div>
                  <div className="text-xs text-cyan-300 bg-cyan-950/30 p-2 rounded-lg border border-cyan-500/20">
                    <span className="font-semibold text-cyan-400">Recommended Pitch: </span>
                    {persona.recommendedApproach}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Recommendations */}
          <div className="bg-gradient-to-r from-amber-950/30 to-stone-950 p-5 rounded-xl border border-amber-500/30 space-y-2">
            <h5 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Strategic Action Recommendations</span>
            </h5>
            <ul className="space-y-1.5 text-xs text-stone-200 list-disc list-inside">
              {report.strategicRecommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
};
