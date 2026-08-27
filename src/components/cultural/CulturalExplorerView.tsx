import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Landmark, Compass, Coffee, BookOpen, 
  Sparkles, Archive, Crown, Heart 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { HeritageMatrix } from './HeritageMatrix';
import { InteractiveHeritageMap } from './InteractiveHeritageMap';
import { TraditionsAndCustoms } from './TraditionsAndCustoms';
import { ProverbsPoetryExplorer } from './ProverbsPoetryExplorer';
import { CulturalStoryteller } from './CulturalStoryteller';
import { MediaArchiveVault } from './MediaArchiveVault';

interface CulturalExplorerViewProps {
  isPro?: boolean;
  onOpenUpgradeModal?: () => void;
}

export type CulturalSubTab = 
  | 'heritage_matrix' 
  | 'interactive_map' 
  | 'traditions_customs' 
  | 'proverbs_poetry' 
  | 'storyteller' 
  | 'media_archive';

export const CulturalExplorerView: React.FC<CulturalExplorerViewProps> = ({ 
  isPro = false, 
  onOpenUpgradeModal = () => {} 
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<CulturalSubTab>('heritage_matrix');

  const navItems = [
    { id: 'heritage_matrix', labelEn: 'Heritage Matrix', labelTi: 'ቅርሲታትን ታሪኽን', labelDe: 'Welterbestätten', icon: Landmark },
    { id: 'interactive_map', labelEn: 'Interactive Map', labelTi: 'ካርታ ውርሻታት', labelDe: 'Interaktive Karte', icon: Compass },
    { id: 'traditions_customs', labelEn: 'Arts & Buna Ritual', labelTi: 'ስነ-ስርዓት ቡንን ባህልን', labelDe: 'Künste & Kaffee', icon: Coffee },
    { id: 'proverbs_poetry', labelEn: 'Proverbs & Qene', labelTi: 'ምስላታትን ቅኔን', labelDe: 'Sprichwörter & Poesie', icon: BookOpen },
    { id: 'storyteller', labelEn: 'AI Storyteller', labelTi: 'AI ተራኺ ዛንታ', labelDe: 'KI-Geschichtenerzähler', icon: Sparkles },
    { id: 'media_archive', labelEn: 'Digital Archive', labelTi: 'ዲጂታል ማህደር', labelDe: 'Digitales Archiv', icon: Archive },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>TIGRAY LIVING HERITAGE & AI PRESERVATION</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-100 tracking-tight">
            {language === 'ti' ? 'ባህላውን ታሪኻውን ውርሻ ትግራይ (Cultural AI)' : language === 'de' ? 'Kulturerbe Tigray' : 'Tigray Cultural AI Experience'}
          </h1>
          <p className="text-stone-400 text-sm mt-1 max-w-2xl">
            {language === 'ti'
              ? 'ጥንታዊ ስልጣነ ኣክሱም፡ ይሓ፡ ውቕሮ፡ ገራዕልታ፡ መቐለ፡ ምስላታት ትግርኛ፡ ባህላዊ ሙዚቃን ዛንታታትን ብAI ንዘለኣለም ተዓቒቡ ይነብር።'
              : language === 'de'
              ? 'Erleben und bewahren Sie die reiche Geschichte, Architektur, Poesie, Kulinarik und Weisheiten von Tigray und Eritrea mit KI.'
              : 'Preserving millennia of civilization: archaeological monuments, oral wisdom, the Buna coffee ceremony, traditional music, and digital archives.'}
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
              onClick={() => setActiveTab(item.id as CulturalSubTab)}
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
          {activeTab === 'heritage_matrix' && (
            <motion.div key="matrix" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <HeritageMatrix />
            </motion.div>
          )}

          {activeTab === 'interactive_map' && (
            <motion.div key="map" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <InteractiveHeritageMap />
            </motion.div>
          )}

          {activeTab === 'traditions_customs' && (
            <motion.div key="traditions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <TraditionsAndCustoms />
            </motion.div>
          )}

          {activeTab === 'proverbs_poetry' && (
            <motion.div key="proverbs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ProverbsPoetryExplorer />
            </motion.div>
          )}

          {activeTab === 'storyteller' && (
            <motion.div key="storyteller" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <CulturalStoryteller />
            </motion.div>
          )}

          {activeTab === 'media_archive' && (
            <motion.div key="archive" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <MediaArchiveVault />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
