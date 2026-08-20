import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, BookOpen, Volume2, VolumeX, RefreshCw, 
  Baby, GraduationCap, Award, Compass, Heart, Share2, Copy, Check 
} from 'lucide-react';
import { CulturalStory } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

const STORY_THEMES = [
  { value: 'axumite_kings', labelEn: 'Ancient Axumite Kings & Queens (Ezana, Kaleb, Makeda)', labelTi: 'ነገስታት ኣክሱም (ዕዛና፡ ካሌብ፡ ማክዳ)', labelDe: 'Antike Könige von Aksum' },
  { value: 'wise_elders_folklore', labelEn: 'Highland Wisdom & Animal Fables', labelTi: 'ናይ እንስሳታትን ኣረጋውያንን ዛንታ', labelDe: 'Weisheitsmärchen & Tierfabeln' },
  { value: 'coffee_discovery', labelEn: 'The Discovery of Buna & Highland Herders', labelTi: 'ምርካብ ፍረ ቡንን ጓሶትን', labelDe: 'Die Entdeckung des Kaffees' },
  { value: 'red_sea_voyages', labelEn: 'Adulis Red Sea Navigators & Merchants', labelTi: 'ተጓዓዝቲ ባሕሪ ወደብ ዓዱሊስ', labelDe: 'Seefahrer & Händler von Adulis' },
  { value: 'sacred_monasteries', labelEn: 'The Nine Saints & Mountaintop Sanctuaries', labelTi: 'ተስዓቱ ቅዱሳንን ገዳማትን', labelDe: 'Die Neun Heiligen & Felsenklöster' },
];

export const CulturalStoryteller: React.FC = () => {
  const { language } = useLanguage();
  const [theme, setTheme] = useState(STORY_THEMES[0].value);
  const [audienceAge, setAudienceAge] = useState<'children' | 'youth' | 'elders'>('children');
  const [userPrompt, setUserPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStory, setActiveStory] = useState<CulturalStory | null>(null);
  const [isNarrating, setIsNarrating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateStory = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/cultural/storyteller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          audienceAge,
          targetLanguage: language,
          userPrompt,
        }),
      });
      const data = await res.json();
      if (data.success && data.story) {
        setActiveStory(data.story);
      }
    } catch (err) {
      console.error('Storyteller error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleAudioNarration = () => {
    if (!activeStory) return;
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not available.');
      return;
    }

    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = activeStory.contentEn;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsNarrating(false);
      utterance.onerror = () => setIsNarrating(false);
      setIsNarrating(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopyStory = () => {
    if (!activeStory) return;
    const fullStory = `# ${activeStory.titleEn} (${activeStory.titleTi})\n\n${activeStory.contentEn}\n\n## ትግርኛ\n${activeStory.contentTi}\n\n**Moral Lesson:** ${activeStory.moralLesson}`;
    navigator.clipboard.writeText(fullStory);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950/30 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Multilingual Cultural Storyteller & Oral Archive</span>
        </div>
        <h3 className="text-2xl font-bold text-stone-100">
          {language === 'ti' ? 'AI ናይ ባህልን ታሪኽን ተራኺ (Storyteller)' : language === 'de' ? 'Traditioneller KI-Geschichtenerzähler' : 'AI Cultural Heritage Storyteller'}
        </h3>
        <p className="text-stone-400 text-sm mt-1 max-w-2xl">
          {language === 'ti'
            ? 'ንህጻናትን ንዓበይትን ዝኸውን ናይ ቀደም ዛንታታት፡ ናይ ነገስታት ታሪኽን ምሳሌያዊ ትምህርትታትን ብትግርኛን እንግሊዝኛን ብAI ኣዳምጹ።'
            : language === 'de'
            ? 'Lassen Sie sich fesselnde Legenden, historische Fabeln und Überlieferungen für Kinder und Erwachsene erzählen.'
            : 'Listen to immersive tales of ancient kings, wise elders, seafaring merchants, and moral parables with voice narration.'}
        </p>

        {/* Generator Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
              {language === 'ti' ? 'ኣርእስቲ ወይ ቴማ ዛንታ' : language === 'de' ? 'Thema der Erzählung' : 'Story Lore & Era Theme'}
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 text-stone-100 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
            >
              {STORY_THEMES.map((th) => (
                <option key={th.value} value={th.value}>
                  {language === 'ti' ? th.labelTi : language === 'de' ? th.labelDe : th.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
              {language === 'ti' ? 'ዕድመ ተደመጽቲ' : language === 'de' ? 'Zielpublikum' : 'Audience Level'}
            </label>
            <select
              value={audienceAge}
              onChange={(e) => setAudienceAge(e.target.value as any)}
              className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 text-stone-100 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
            >
              <option value="children">Children's Bedtime Fable (ንህጻናት)</option>
              <option value="youth">Youth & Students (ንመንእሰያት)</option>
              <option value="elders">Elders & Scholarly Lore (ንዓበይቲ)</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
              {language === 'ti' ? 'ተወሳኺ ፍሉይ ሓሳብ (እንተደሊኹም)' : language === 'de' ? 'Spezifischer Fokus' : 'Specific Scene, Character or Moral (Optional)'}
            </label>
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="e.g. Include a gentle lesson on sharing food during the Buna coffee ceremony..."
              className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleGenerateStory}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Weaving Story Lore...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Narrate Cultural Tale</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Story Presentation */}
      {activeStory && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl"
        >
          {/* Story Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
            <div>
              <span className="text-xs font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded uppercase">
                {activeStory.era} • {activeStory.audienceAge}
              </span>
              <h4 className="text-2xl font-bold text-stone-100 mt-1">{activeStory.titleEn}</h4>
              <p className="text-amber-300 font-geez text-base font-semibold">{activeStory.titleTi}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleAudioNarration}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  isNarrating
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                }`}
              >
                {isNarrating ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isNarrating ? 'Stop Voice' : 'Listen Voice'}</span>
              </button>

              <button
                onClick={handleCopyStory}
                className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-xl border border-stone-700"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-stone-400" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Bilingual Story Text */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* English Version */}
            <div className="bg-stone-950 p-6 rounded-xl border border-stone-800 space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">English Story</span>
              <p className="text-sm text-stone-200 leading-relaxed whitespace-pre-wrap font-serif">
                {activeStory.contentEn}
              </p>
            </div>

            {/* Tigrinya Version */}
            <div className="bg-stone-950 p-6 rounded-xl border border-stone-800 space-y-3 font-geez">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-sans">ትግርኛ (Tigrinya)</span>
              <p className="text-sm text-amber-100/90 leading-loose whitespace-pre-wrap">
                {activeStory.contentTi}
              </p>
            </div>
          </div>

          {/* Moral Lesson Footer */}
          <div className="bg-gradient-to-r from-emerald-950/30 to-stone-950 border border-emerald-500/30 p-5 rounded-xl flex items-start gap-3">
            <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Moral Lesson & Wisdom</span>
              <p className="text-xs text-stone-200 mt-0.5">{activeStory.moralLesson}</p>
            </div>
          </div>

          {/* Cultural Vocabulary List */}
          {activeStory.vocabularyList && activeStory.vocabularyList.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Heritage Vocabulary Terms:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {activeStory.vocabularyList.map((voc, i) => (
                  <div key={i} className="bg-stone-950 p-3 rounded-lg border border-stone-800 text-xs">
                    <div className="font-bold text-amber-300 font-geez">{voc.wordTi} <span className="font-sans text-stone-400">({voc.wordEn})</span></div>
                    <div className="text-[11px] text-stone-400 mt-0.5">{voc.definition}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
