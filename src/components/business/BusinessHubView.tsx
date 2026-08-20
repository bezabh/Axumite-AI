import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, FileText, BarChart3, Megaphone, Calculator, 
  Bot, LayoutDashboard, Crown, Sparkles, TrendingUp 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { BusinessPlanBuilder } from './BusinessPlanBuilder';
import { MarketResearchTool } from './MarketResearchTool';
import { MarketingContentStudio } from './MarketingContentStudio';
import { FinancialBudgetingTool } from './FinancialBudgetingTool';
import { BusinessDocumentGenerator } from './BusinessDocumentGenerator';
import { BusinessDashboard } from './BusinessDashboard';
import { BusinessCopilotChat } from './BusinessCopilotChat';

interface BusinessHubViewProps {
  isPro?: boolean;
  onOpenUpgradeModal?: () => void;
}

export type BusinessSubTab = 
  | 'plan_builder' 
  | 'market_research' 
  | 'marketing_studio' 
  | 'financials' 
  | 'document_generator' 
  | 'dashboard' 
  | 'copilot_chat';

export const BusinessHubView: React.FC<BusinessHubViewProps> = ({ isPro = false, onOpenUpgradeModal = () => {} }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<BusinessSubTab>('plan_builder');

  const navItems = [
    { id: 'plan_builder', labelEn: 'Business Plan', labelTi: 'ናይ ንግዲ መደብ', labelDe: 'Businessplan', icon: FileText },
    { id: 'market_research', labelEn: 'Market Intelligence', labelTi: 'ዕዳጋ ትንታነ', labelDe: 'Marktforschung', icon: BarChart3 },
    { id: 'marketing_studio', labelEn: 'Marketing Studio', labelTi: 'ማርኬቲንግ ስቱድዮ', labelDe: 'Marketing-Studio', icon: Megaphone },
    { id: 'financials', labelEn: 'Financials & Pricing', labelTi: 'ፋይናንስን ባጀትን', labelDe: 'Finanzen & Preise', icon: Calculator },
    { id: 'document_generator', labelEn: 'Contracts & Invoices', labelTi: 'ሰነዳትን ኢንቮይስን', labelDe: 'Verträge & Rechnungen', icon: Briefcase },
    { id: 'dashboard', labelEn: 'CRM & Performance', labelTi: 'CRM ዳሽቦርድ', labelDe: 'CRM & Kennzahlen', icon: LayoutDashboard },
    { id: 'copilot_chat', labelEn: 'AI Business Advisor', labelTi: 'AI አማኻሪ', labelDe: 'KI-Unternehmensberater', icon: Bot },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>AXUMITE SOVEREIGN ENTERPRISE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-100 tracking-tight">
            {language === 'ti' ? 'AI ናይ ንግዲ መሻርኽቲ (Business Hub)' : language === 'de' ? 'KI-Business-Zentrum' : 'AI Business Hub & Enterprise Suite'}
          </h1>
          <p className="text-stone-400 text-sm mt-1 max-w-2xl">
            {language === 'ti'
              ? 'ካብ ሓሳብ ንግዲ ክሳብ ኣህጉራዊ ዕዳጋ፡ ናይ ንግዲ መደባት፡ ትንታነ ዕዳጋ፡ ፋይናንስ፡ ሰነዳትን ናይ ዓማዊል CRMን ብAI ተጠቐሙ።'
              : language === 'de'
              ? 'Von der Geschäftsidee bis zur Skalierung: Businesspläne, Marktanalysen, Finanzmodelle, Verträge und CRM mit modernster KI.'
              : 'Institutional suite for entrepreneurs, startups, and diaspora businesses: strategy, market research, cash flow modeling, legal drafts, and CRM.'}
          </p>
        </div>

        {!isPro && (
          <button
            onClick={onOpenUpgradeModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-xs font-bold rounded-xl shadow-lg hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer shrink-0"
          >
            <Crown className="w-4 h-4" />
            <span>{language === 'ti' ? 'ናብ Pro ክብ ኣብሉ' : language === 'de' ? 'Auf Pro upgraden' : 'Unlock Sovereign Pro'}</span>
          </button>
        )}
      </div>

      {/* Sub-Navigation Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-800/80 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as BusinessSubTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20'
                  : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800 hover:text-stone-100 border border-stone-800/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{language === 'ti' ? item.labelTi : language === 'de' ? item.labelDe : item.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      <div className="pt-2">
        <AnimatePresence mode="wait">
          {activeTab === 'plan_builder' && (
            <motion.div key="plan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <BusinessPlanBuilder isPro={isPro} onOpenUpgradeModal={onOpenUpgradeModal} />
            </motion.div>
          )}

          {activeTab === 'market_research' && (
            <motion.div key="market" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <MarketResearchTool />
            </motion.div>
          )}

          {activeTab === 'marketing_studio' && (
            <motion.div key="marketing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <MarketingContentStudio />
            </motion.div>
          )}

          {activeTab === 'financials' && (
            <motion.div key="financials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <FinancialBudgetingTool />
            </motion.div>
          )}

          {activeTab === 'document_generator' && (
            <motion.div key="docs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <BusinessDocumentGenerator />
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <BusinessDashboard />
            </motion.div>
          )}

          {activeTab === 'copilot_chat' && (
            <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <BusinessCopilotChat />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
