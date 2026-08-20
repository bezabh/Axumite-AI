import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Megaphone, Sparkles, Copy, Check, Calendar, Share2, 
  Tag, RefreshCw, Send, MessageSquare, Instagram, Linkedin 
} from 'lucide-react';
import { MarketingCampaign, BusinessIndustry } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export const MarketingContentStudio: React.FC = () => {
  const { language } = useLanguage();
  const [campaignTitle, setCampaignTitle] = useState('');
  const [objective, setObjective] = useState<'brand_awareness' | 'lead_generation' | 'sales_conversion' | 'event_launch'>('sales_conversion');
  const [targetAudience, setTargetAudience] = useState('Diaspora entrepreneurs & local customers');
  const [platform, setPlatform] = useState<'facebook_instagram' | 'tiktok' | 'linkedin' | 'email_newsletter' | 'billboard_local'>('facebook_instagram');
  const [industry, setIndustry] = useState<BusinessIndustry>('technology_software');
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaign, setCampaign] = useState<MarketingCampaign | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!campaignTitle.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/business/marketing-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignTitle,
          objective,
          targetAudience,
          platform,
          industry,
        }),
      });
      const data = await res.json();
      if (data.success && data.campaign) {
        setCampaign(data.campaign);
      }
    } catch (err) {
      console.error('Marketing studio error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyAdText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950/30 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <Megaphone className="w-4 h-4" />
          <span>Multilingual Marketing & Ad Studio</span>
        </div>
        <h3 className="text-2xl font-bold text-stone-100">
          {language === 'ti' ? 'AI ናይ ማርኬቲንግን መወዓውዒታትን ስቱድዮ' : language === 'de' ? 'KI-Marketing- & Werbetext-Studio' : 'AI Marketing & Campaign Studio'}
        </h3>
        <p className="text-stone-400 text-sm mt-1 max-w-2xl">
          {language === 'ti'
            ? 'ብትግርኛ፡ እንግሊዝኛን ጀርመንን ስሓቢ ናይ ሶሻል ሜድያ ጽሑፋት፡ መወዓውዒታት፡ ናይ ኢሜይል ዘመቻታትን ስሎጋናትን ብAI ኣዳልዉ።'
            : language === 'de'
            ? 'Erstellen Sie mehrsprachige Werbetexte, Social-Media-Inhaltskalender, E-Mail-Kampagnen und Slogans.'
            : 'Generate high-converting ad copy, multilingual social posts, content calendar schedules, and memorable brand slogans.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
              {language === 'ti' ? 'ኣርእስቲ ዘመቻ ወይ ፍርያት' : language === 'de' ? 'Kampagnen- / Produkttitel' : 'Campaign Title / Offering'}
            </label>
            <input
              type="text"
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              placeholder="e.g. Axumite Gold Roast Coffee Launch Campaign..."
              className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 text-stone-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
              {language === 'ti' ? 'ቀንዲ ዕላማ' : language === 'de' ? 'Kampagnenziel' : 'Campaign Objective'}
            </label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value as any)}
              className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 text-stone-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
            >
              <option value="sales_conversion">Direct Sales Conversion</option>
              <option value="lead_generation">Lead & Customer Acquisition</option>
              <option value="brand_awareness">Brand Awareness & Trust</option>
              <option value="event_launch">Product / Event Launch</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
              {language === 'ti' ? 'ፕላትፎርም' : language === 'de' ? 'Plattform' : 'Primary Channel'}
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as any)}
              className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 text-stone-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
            >
              <option value="facebook_instagram">Instagram & Facebook</option>
              <option value="tiktok">TikTok & Video Reels</option>
              <option value="linkedin">LinkedIn B2B</option>
              <option value="email_newsletter">Email Newsletter</option>
              <option value="billboard_local">Local Print & Radio</option>
            </select>
          </div>

          <div className="lg:col-span-4">
            <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
              {language === 'ti' ? 'ዒላማ ዓማዊል' : language === 'de' ? 'Zielgruppe' : 'Target Audience Persona'}
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Tech-savvy professionals and diaspora consumers in Frankfurt, Stockholm, London, Asmara..."
              className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 text-stone-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !campaignTitle.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crafting High-Converting Copy...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Campaign & Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Campaign Output */}
      {campaign && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase">{campaign.id} • {campaign.platform}</span>
              <h4 className="text-2xl font-bold text-stone-100 mt-1">{campaign.campaignTitle}</h4>
              <p className="text-stone-400 text-xs">{campaign.targetAudience}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400">Est. Media Budget</span>
              <div className="text-xl font-bold text-emerald-400">${campaign.estimatedBudgetUsd}</div>
            </div>
          </div>

          {/* Slogans */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Catchy Brand Slogans</span>
            </h5>
            <div className="flex flex-wrap gap-2">
              {campaign.slogans.map((slogan, i) => (
                <div key={i} className="px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs rounded-full font-medium">
                  "{slogan}"
                </div>
              ))}
            </div>
          </div>

          {/* Ad Copies (Multilingual) */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-stone-200 uppercase tracking-wider">Multi-Channel Ad Copies</h5>
            <div className="space-y-4">
              {campaign.adCopies.map((ad, idx) => (
                <div key={idx} className="bg-stone-950/80 border border-stone-800 rounded-xl p-5 space-y-4">
                  {/* English Version */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-400 uppercase">English Ad Copy</span>
                      <button
                        onClick={() => copyAdText(`${ad.headlineEn}\n\n${ad.bodyEn}\n\n${ad.callToAction}\n${ad.hashtags.join(' ')}`, idx * 10 + 1)}
                        className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1"
                      >
                        {copiedIndex === idx * 10 + 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedIndex === idx * 10 + 1 ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="text-sm font-bold text-amber-300">{ad.headlineEn}</div>
                    <p className="text-xs text-stone-300 leading-relaxed">{ad.bodyEn}</p>
                  </div>

                  {/* Tigrinya Version */}
                  {ad.headlineTi && (
                    <div className="space-y-1.5 pt-3 border-t border-stone-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400/90 uppercase">ትግርኛ (Tigrinya)</span>
                        <button
                          onClick={() => copyAdText(`${ad.headlineTi}\n\n${ad.bodyTi}\n\n${ad.callToAction}\n${ad.hashtags.join(' ')}`, idx * 10 + 2)}
                          className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1"
                        >
                          {copiedIndex === idx * 10 + 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedIndex === idx * 10 + 2 ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="text-sm font-bold text-amber-200 font-geez">{ad.headlineTi}</div>
                      <p className="text-xs text-stone-300 font-geez leading-relaxed">{ad.bodyTi}</p>
                    </div>
                  )}

                  {/* German Version */}
                  {ad.headlineDe && (
                    <div className="space-y-1.5 pt-3 border-t border-stone-800/80">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-400 uppercase">Deutsch (German)</span>
                        <button
                          onClick={() => copyAdText(`${ad.headlineDe}\n\n${ad.bodyDe}\n\n${ad.callToAction}\n${ad.hashtags.join(' ')}`, idx * 10 + 3)}
                          className="text-xs text-stone-400 hover:text-stone-200 flex items-center gap-1"
                        >
                          {copiedIndex === idx * 10 + 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedIndex === idx * 10 + 3 ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="text-sm font-bold text-stone-200">{ad.headlineDe}</div>
                      <p className="text-xs text-stone-300 leading-relaxed">{ad.bodyDe}</p>
                    </div>
                  )}

                  {/* Footer & CTA */}
                  <div className="pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded font-semibold">
                      CTA: {ad.callToAction}
                    </span>
                    <div className="flex gap-1.5 text-cyan-400/90 font-mono">
                      {ad.hashtags.map((tag, tIdx) => (
                        <span key={tIdx}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Calendar */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Multi-Day Content Publishing Schedule</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {campaign.contentCalendarDays.map((cal, i) => (
                <div key={i} className="bg-stone-950/60 border border-stone-800 p-4 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-400">Day {cal.day}</span>
                    <span className="text-[11px] px-2 py-0.5 bg-stone-800 text-stone-300 rounded">{cal.postType}</span>
                  </div>
                  <div className="text-xs font-bold text-stone-200">{cal.theme}</div>
                  <p className="text-xs text-stone-400 italic">"{cal.hook}"</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
