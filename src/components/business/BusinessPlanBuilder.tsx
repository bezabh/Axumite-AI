import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, Sparkles, Download, Copy, Check, FileText, 
  TrendingUp, ShieldAlert, Target, DollarSign, Layers, 
  Globe2, ArrowRight, RefreshCw, Printer
} from 'lucide-react';
import { BusinessPlan, BusinessIndustry, BusinessStage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface BusinessPlanBuilderProps {
  isPro: boolean;
  onOpenUpgradeModal: () => void;
}

const INDUSTRY_OPTIONS: { value: BusinessIndustry; labelEn: string; labelTi: string; labelDe: string }[] = [
  { value: 'technology_software', labelEn: 'Tech & Software Solutions', labelTi: 'ቴክኖሎጂን ሶፍትዌርን', labelDe: 'Technologie & Software' },
  { value: 'agribusiness_coffee', labelEn: 'Agribusiness & Premium Coffee', labelTi: 'ሕርሻን ብሉጽ ቡንን', labelDe: 'Agrarwirtschaft & Spezialitätenkaffee' },
  { value: 'tourism_hospitality', labelEn: 'Cultural Tourism & Hospitality', labelTi: 'ባህላዊ ቱሪዝምን ሆስፒታሊቲን', labelDe: 'Kulturtourismus & Gastgewerbe' },
  { value: 'import_export_logistics', labelEn: 'Import, Export & Logistics', labelTi: 'ኣታውን ወጻእን ሎጂስቲክስን', labelDe: 'Import, Export & Logistik' },
  { value: 'retail_ecommerce', labelEn: 'Retail & Modern E-Commerce', labelTi: 'ችርቻሮን ኢ-ኮሜርስን', labelDe: 'Einzelhandel & E-Commerce' },
  { value: 'renewable_energy', labelEn: 'Solar & Renewable Energy', labelTi: 'ጸሓያዊ ሓይሊ ኤሌክትሪክ', labelDe: 'Solar- & Erneuerbare Energien' },
  { value: 'diaspora_remittance_fintech', labelEn: 'Diaspora Fintech & Remittance', labelTi: 'ናይ ዲያስፖራ ፋይንቴክን ሓዋላን', labelDe: 'Diaspora-Fintech & Überweisungen' },
  { value: 'healthcare_pharmacy', labelEn: 'Healthcare & Medical Tech', labelTi: 'ጥዕናን መድሃኒትን', labelDe: 'Gesundheitswesen & Medizintechnik' },
];

export const BusinessPlanBuilder: React.FC<BusinessPlanBuilderProps> = ({ isPro, onOpenUpgradeModal }) => {
  const { language, t } = useLanguage();
  const [title, setTitle] = useState('');
  const [industry, setIndustry] = useState<BusinessIndustry>('technology_software');
  const [stage, setStage] = useState<BusinessStage>('seed_startup');
  const [targetRegion, setTargetRegion] = useState('Eritrea & Global Diaspora');
  const [currency, setCurrency] = useState('USD');
  const [userGoalPrompt, setUserGoalPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePlan, setActivePlan] = useState<BusinessPlan | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/business/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          industry,
          stage,
          targetRegion,
          currency,
          userGoalPrompt,
        }),
      });
      const data = await res.json();
      if (data.success && data.businessPlan) {
        setActivePlan(data.businessPlan);
      }
    } catch (err) {
      console.error('Failed to generate business plan:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!activePlan) return;
    const md = `# ${activePlan.title} - Business Plan\n\n## Executive Summary\n${activePlan.executiveSummary}\n\n## Problem & Solution\n**Problem:** ${activePlan.problemStatement}\n**Solution:** ${activePlan.solutionValueProp}\n\n## Market Opportunity\n- TAM: ${activePlan.targetMarket.tamSamSom.tam}\n- SAM: ${activePlan.targetMarket.tamSamSom.sam}\n- SOM: ${activePlan.targetMarket.tamSamSom.som}\n\n## Financial Highlights\n- Startup Capital: $${activePlan.financialHighlights.startupCapitalRequired.toLocaleString()}\n- Year 1 Revenue: $${activePlan.financialHighlights.year1Revenue.toLocaleString()}\n- Year 3 Revenue: $${activePlan.financialHighlights.year3Revenue.toLocaleString()}\n- Profit Margin: ${activePlan.financialHighlights.profitMarginPercent}%`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Generator Controls */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950/40 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Briefcase className="w-4 h-4" />
              <span>AI Sovereign Enterprise Engine</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-amber-100">
              {language === 'ti' ? 'ናይ ንግዲ መደብ መመንጨዊ (Business Plan)' : language === 'de' ? 'KI-Businessplan-Generator' : 'AI Business Plan Generator'}
            </h2>
            <p className="text-stone-300 text-sm mt-1 max-w-2xl">
              {language === 'ti' 
                ? 'ዝርዝር ናይ ንግዲ ስትራተጂ፡ ትንታነ ዕዳጋ (TAM/SAM/SOM)፡ SWOTን ናይ 3 ዓመት ፋይናንሳዊ ትንበያን ብAI ኣመንጭዉ።'
                : language === 'de'
                ? 'Erstellen Sie investorenreife Businesspläne mit Marktanalysen, SWOT, Meilensteinen und 3-Jahres-Finanzmodellen.'
                : 'Generate institutional, investor-grade business plans with SWOT matrices, TAM/SAM/SOM modeling, and 3-year cash flow forecasts.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs rounded-full font-medium">
              Gemini 3.7 Pro Engine
            </span>
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1.5">
              {language === 'ti' ? 'ስም ወይ ሓሳብ ንግዲ' : language === 'de' ? 'Geschäftsidee / Name' : 'Business Concept / Venture Name'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={language === 'ti' ? 'ንኣብነት: ቀይሕ ባሕሪ ዲጂታል ቡን ኤክስፖርት...' : language === 'de' ? 'z. B. Red Sea Coffee Exporters & Logistics...' : 'e.g. Red Sea Premium Coffee Export & Logistics...'}
              className="w-full bg-stone-900/90 border border-stone-700 focus:border-amber-500 text-stone-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1.5">
              {language === 'ti' ? 'ዓውዲ ንግዲ' : language === 'de' ? 'Branche' : 'Industry Sector'}
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value as BusinessIndustry)}
              className="w-full bg-stone-900/90 border border-stone-700 focus:border-amber-500 text-stone-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {INDUSTRY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {language === 'ti' ? opt.labelTi : language === 'de' ? opt.labelDe : opt.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1.5">
              {language === 'ti' ? 'ደረጃ ንግዲ' : language === 'de' ? 'Unternehmensphase' : 'Business Stage'}
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as BusinessStage)}
              className="w-full bg-stone-900/90 border border-stone-700 focus:border-amber-500 text-stone-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="idea">{language === 'ti' ? 'ሓሳብ ጥራይ (Idea)' : language === 'de' ? 'Ideenphase' : 'Concept / Ideation'}</option>
              <option value="seed_startup">{language === 'ti' ? 'ሓዳስ ጀማሪት (Seed Startup)' : language === 'de' ? 'Frühphasen-Startup' : 'Seed Stage Startup'}</option>
              <option value="sme_growth">{language === 'ti' ? 'ማእከላይ ንግዲ (SME Growth)' : language === 'de' ? 'Wachsender Mittelstand' : 'SME Growth'}</option>
              <option value="scaling_enterprise">{language === 'ti' ? 'ሰፊሕ ትካል (Enterprise)' : language === 'de' ? 'Skalierendes Unternehmen' : 'Scaling Enterprise'}</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1.5">
              {language === 'ti' ? 'ዒላማ ዕዳጋን ዞባን' : language === 'de' ? 'Zielregion' : 'Target Region / Geo'}
            </label>
            <input
              type="text"
              value={targetRegion}
              onChange={(e) => setTargetRegion(e.target.value)}
              placeholder="e.g. Asmara, Tigray, Gulf Region & Europe Diaspora"
              className="w-full bg-stone-900/90 border border-stone-700 focus:border-amber-500 text-stone-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1.5">
              {language === 'ti' ? 'ፍሉይ ሽቶታት ወይ ማስታወሻ' : language === 'de' ? 'Spezifische Ziele / Details' : 'Key Goals & Constraints (Optional)'}
            </label>
            <input
              type="text"
              value={userGoalPrompt}
              onChange={(e) => setUserGoalPrompt(e.target.value)}
              placeholder={language === 'ti' ? 'ንኣብነት: ኣብ ውሽጢ 6 ኣዋርሕ ናብ 1000 ዓማዊል ምብጻሕ...' : language === 'de' ? 'z. B. Ziel: 1000 Kunden im ersten Jahr...' : 'e.g. Focus on low initial CAPEX and mobile-first diaspora remittances...'}
              className="w-full bg-stone-900/90 border border-stone-700 focus:border-amber-500 text-stone-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !title.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{language === 'ti' ? 'AI እናሰርሐ ኣሎ...' : language === 'de' ? 'KI generiert Plan...' : 'Synthesizing Business Plan...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>{language === 'ti' ? 'ናይ ንግዲ መደብ ኣመንጭው' : language === 'de' ? 'Businessplan erstellen' : 'Generate Full Business Plan'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Business Plan Output */}
      {activePlan && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-8 shadow-2xl"
        >
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
            <div>
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-mono rounded-md uppercase tracking-wider">
                {activePlan.id} • {activePlan.industry}
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-stone-100 mt-1">{activePlan.title}</h3>
              <p className="text-stone-400 text-sm">
                {activePlan.targetRegion} • {activePlan.currency} Base • {new Date(activePlan.createdDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-lg transition-colors border border-stone-700"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-stone-400" />}
                <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-lg transition-colors border border-stone-700"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>{language === 'ti' ? '1. ጽሟቕ መብርሂ (Executive Summary)' : language === 'de' ? '1. Zusammenfassung (Executive Summary)' : '1. Executive Summary'}</span>
            </h4>
            <div className="bg-stone-950/80 border border-stone-800 rounded-xl p-5 text-stone-200 text-sm leading-relaxed space-y-3">
              <p>{activePlan.executiveSummary}</p>
              {activePlan.executiveSummaryTi && (
                <div className="pt-3 border-t border-stone-800/80 text-amber-100/90 font-geez">
                  <p>{activePlan.executiveSummaryTi}</p>
                </div>
              )}
              {language === 'de' && activePlan.executiveSummaryDe && (
                <div className="pt-3 border-t border-stone-800/80 text-stone-300">
                  <p>{activePlan.executiveSummaryDe}</p>
                </div>
              )}
            </div>
          </div>

          {/* Problem & Value Proposition Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-stone-950/60 border border-rose-500/20 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>{language === 'ti' ? 'ቀንዲ ጸገም (Problem Statement)' : language === 'de' ? 'Problemstellung' : 'Market Problem & Inefficiency'}</span>
              </div>
              <p className="text-stone-300 text-sm leading-relaxed">{activePlan.problemStatement}</p>
            </div>

            <div className="bg-stone-950/60 border border-emerald-500/20 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Target className="w-4 h-4" />
                <span>{language === 'ti' ? 'መፍትሒን ፍሉይ ዋጋን (Value Proposition)' : language === 'de' ? 'Lösung & Wertversprechen' : 'Solution & Value Proposition'}</span>
              </div>
              <p className="text-stone-300 text-sm leading-relaxed">{activePlan.solutionValueProp}</p>
            </div>
          </div>

          {/* TAM / SAM / SOM Market Opportunity */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-amber-400" />
              <span>{language === 'ti' ? '2. ዓቐን ዕዳጋ (Market Sizing: TAM / SAM / SOM)' : language === 'de' ? '2. Marktgröße (TAM / SAM / SOM)' : '2. Market Sizing (TAM / SAM / SOM)'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-xl text-center space-y-1">
                <span className="text-xs text-stone-400 font-mono uppercase tracking-wider">TAM (Total Market)</span>
                <div className="text-xl font-black text-amber-300">{activePlan.targetMarket.tamSamSom.tam}</div>
                <p className="text-xs text-stone-400">Total addressable market</p>
              </div>
              <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-xl text-center space-y-1">
                <span className="text-xs text-stone-400 font-mono uppercase tracking-wider">SAM (Serviceable)</span>
                <div className="text-xl font-black text-amber-400">{activePlan.targetMarket.tamSamSom.sam}</div>
                <p className="text-xs text-stone-400">Target regional reach</p>
              </div>
              <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-xl text-center space-y-1">
                <span className="text-xs text-stone-400 font-mono uppercase tracking-wider">SOM (Obtainable)</span>
                <div className="text-xl font-black text-emerald-400">{activePlan.targetMarket.tamSamSom.som}</div>
                <p className="text-xs text-stone-400">Year 1-3 capture goal</p>
              </div>
            </div>
          </div>

          {/* SWOT Analysis 2x2 Grid */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <span>{language === 'ti' ? '3. SWOT ትንታነ (Strengths, Weaknesses, Opportunities, Threats)' : language === 'de' ? '3. SWOT-Analyse' : '3. Comprehensive SWOT Matrix'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Strengths (ብርታዐታት)</span>
                <ul className="space-y-1 text-xs text-stone-200 list-disc list-inside">
                  {activePlan.swotAnalysis.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Weaknesses (ድኽመታት)</span>
                <ul className="space-y-1 text-xs text-stone-200 list-disc list-inside">
                  {activePlan.swotAnalysis.weaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Opportunities (ዕድላት)</span>
                <ul className="space-y-1 text-xs text-stone-200 list-disc list-inside">
                  {activePlan.swotAnalysis.opportunities.map((o, i) => (
                    <li key={i}>{o}</li>
                  ))}
                </ul>
              </div>

              {/* Threats */}
              <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Threats (ስግኣታት)</span>
                <ul className="space-y-1 text-xs text-stone-200 list-disc list-inside">
                  {activePlan.swotAnalysis.threats.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 3-Year Financial Forecast Highlights */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <span>{language === 'ti' ? '4. ፋይናንሳዊ ትንበያ (3-Year Financial Model)' : language === 'de' ? '4. 3-Jahres-Finanzprognose' : '4. 3-Year Financial Highlights & Unit Economics'}</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-stone-950/80 border border-stone-800 p-3 rounded-xl">
                <div className="text-[11px] text-stone-400">Initial Capital</div>
                <div className="text-base font-bold text-stone-100">${activePlan.financialHighlights.startupCapitalRequired.toLocaleString()}</div>
              </div>
              <div className="bg-stone-950/80 border border-stone-800 p-3 rounded-xl">
                <div className="text-[11px] text-stone-400">Year 1 Rev</div>
                <div className="text-base font-bold text-amber-300">${activePlan.financialHighlights.year1Revenue.toLocaleString()}</div>
              </div>
              <div className="bg-stone-950/80 border border-stone-800 p-3 rounded-xl">
                <div className="text-[11px] text-stone-400">Year 2 Rev</div>
                <div className="text-base font-bold text-amber-300">${activePlan.financialHighlights.year2Revenue.toLocaleString()}</div>
              </div>
              <div className="bg-stone-950/80 border border-stone-800 p-3 rounded-xl">
                <div className="text-[11px] text-stone-400">Year 3 Rev</div>
                <div className="text-base font-bold text-emerald-400">${activePlan.financialHighlights.year3Revenue.toLocaleString()}</div>
              </div>
              <div className="bg-stone-950/80 border border-stone-800 p-3 rounded-xl">
                <div className="text-[11px] text-stone-400">Break-Even</div>
                <div className="text-base font-bold text-cyan-300">{activePlan.financialHighlights.breakEvenMonths} mo</div>
              </div>
              <div className="bg-stone-950/80 border border-stone-800 p-3 rounded-xl">
                <div className="text-[11px] text-stone-400">Net Margin</div>
                <div className="text-base font-bold text-emerald-400">{activePlan.financialHighlights.profitMarginPercent}%</div>
              </div>
            </div>
          </div>

          {/* Operational Roadmap Milestones */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-amber-400 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span>{language === 'ti' ? '5. ስራሕ መደብን ዕላማታትን (Operational Milestones)' : language === 'de' ? '5. Operative Meilensteine' : '5. Operational Milestones & Execution Roadmap'}</span>
            </h4>
            <div className="space-y-2">
              {activePlan.operationalPlan.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-stone-950/60 border border-stone-800 p-3.5 rounded-xl">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-stone-300 text-sm">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
