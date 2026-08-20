import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Search, Sparkles, Copy, Check, Volume2, 
  Share2, Heart, RefreshCw, Feather, Award 
} from 'lucide-react';
import { TigrinyaProverb, CulturalPoem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export const INITIAL_PROVERBS: TigrinyaProverb[] = [
  {
    id: 'PRV-1',
    textTi: 'ሓሳብ ዘይብሉ ሰብ፡ ማይ ዘይብሉ ሩባ።',
    textGeez: 'ሓሳብ ዘይብሉ ሰብ፡ ማይ ዘይብሉ ሩባ።',
    transliteration: 'Hasab zeyblu seb, may zeyblu ruba.',
    englishTranslation: 'A person without purpose or reflection is like a dried-up riverbed without water.',
    germanTranslation: 'Ein Mensch ohne Nachdenken und Ziel ist wie ein ausgetrocknetes Flussbett ohne Wasser.',
    meaningAndContext: 'Teaches the supreme virtue of wisdom, foresight, and deliberate purpose in all human endeavors.',
    category: 'wisdom_and_patience',
    moralLesson: 'Cultivate deep thought and intentionality rather than drifting through life aimlessly.',
  },
  {
    id: 'PRV-2',
    textTi: 'ሓቢርካ እንተዘይተበሊዑ፡ በይኑ ዝበልዐ በይኑ ይመውት።',
    textGeez: 'ሓቢርካ እንተዘይተበሊዑ፡ በይኑ ዝበልዐ በይኑ ይመውት።',
    transliteration: 'Habirka entezey tebeliu, beynu zibel\'e beynu yemewt.',
    englishTranslation: 'If we do not share our food in community, he who eats alone will die alone without mourners.',
    germanTranslation: 'Wenn man Mahlzeiten nicht teilt: Wer alleine isst, stirbt auch einsam.',
    meaningAndContext: 'Celebrates hospitality, communal solidarity (Gursha), and caring for neighbors in times of both abundance and drought.',
    category: 'community_and_unity',
    moralLesson: 'Selfishness breeds isolation; generosity and communal sharing bring eternal strength.',
  },
  {
    id: 'PRV-3',
    textTi: 'ጻዕሪ ዘይብሉ ፍረ የብሉን።',
    textGeez: 'ጻዕሪ ዘይብሉ ፍረ የብሉን።',
    transliteration: 'Tsa\'eri zeyblu fire yeblun.',
    englishTranslation: 'Without diligent toil and patient perseverance, there is no harvest or fruit.',
    germanTranslation: 'Ohne Fleiß und beharrliche Mühe gibt es keine Ernte.',
    meaningAndContext: 'Encourages farmers, students, and craftsmen to embrace hard work and resilience.',
    category: 'hard_work_and_resilience',
    moralLesson: 'Great achievements are born solely through sustained commitment and discipline.',
  },
  {
    id: 'PRV-4',
    textTi: 'ንጉስ ብዘይ ህዝቢ፡ ገረብ ብዘይ ቆጽሊ።',
    textGeez: 'ንጉስ ብዘይ ህዝቢ፡ ገረብ ብዘይ ቆጽሊ።',
    transliteration: 'Nigus bzey hizbi, gereb bzey qotsli.',
    englishTranslation: 'A ruler without the love and support of the people is like a barren tree stripped of leaves.',
    germanTranslation: 'Ein Herrscher ohne sein Volk ist wie ein Baum ohne Blätter.',
    meaningAndContext: 'Ancient Axumite governance proverb stressing humble leadership, justice, and accountability to the community.',
    category: 'leadership_and_justice',
    moralLesson: 'True authority derives from the consent, trust, and well-being of the people.',
  },
  {
    id: 'PRV-5',
    textTi: 'ዓቕሊ ዘለዎ እምኒ የልስልስ።',
    textGeez: 'ዓቕሊ ዘለዎ እምኒ የልስልስ።',
    transliteration: 'Aqli zelewo emni yelsils.',
    englishTranslation: 'Patience and steady endurance can soften even the hardest granite rock.',
    germanTranslation: 'Geduld und Ausdauer können selbst den härtesten Granit erweichen.',
    meaningAndContext: 'Praises the noble quality of patience during adversity, trials, and long-term struggles.',
    category: 'wisdom_and_patience',
    moralLesson: 'Calm endurance consistently overcomes impossible obstacles where brute force fails.',
  },
];

export const ProverbsPoetryExplorer: React.FC = () => {
  const { language } = useLanguage();
  const [proverbs, setProverbs] = useState<TigrinyaProverb[]>(INITIAL_PROVERBS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [customPoemTopic, setCustomPoemTopic] = useState('');
  const [generatedPoem, setGeneratedPoem] = useState<CulturalPoem | null>(null);

  const filteredProverbs = proverbs.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.textTi.includes(searchQuery) ||
                          p.englishTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.transliteration.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleGeneratePoem = async () => {
    if (!customPoemTopic.trim()) return;
    setIsSynthesizing(true);
    try {
      const res = await fetch('/api/cultural/generate-poem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: customPoemTopic,
          poemType: 'zelesegna',
          targetLanguage: language,
        }),
      });
      const data = await res.json();
      if (data.success && data.poem) {
        setGeneratedPoem(data.poem);
      }
    } catch (err) {
      console.error('Poem error:', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950/30 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Living Oral Wisdom & Poetic Heritage</span>
        </div>
        <h3 className="text-2xl font-bold text-stone-100">
          {language === 'ti' ? 'ምስላታትን ቅኔን (Proverbs & Traditional Poetry)' : language === 'de' ? 'Sprichwörter & Traditionelle Poesie' : 'Tigrinya Proverbs & Poetic Archive'}
        </h3>
        <p className="text-stone-400 text-sm mt-1 max-w-2xl">
          {language === 'ti'
            ? 'ጥንታውያን ምስላታት ትግርኛ ምስ ትርጉሞምን ምሳሌያዊ ትምህርቶምን ተመሃሩ፡ ከምኡ’ውን ብAI ባህላዊ ግጥምታትን ቅኔን ኣመንጭዉ።'
            : language === 'de'
            ? 'Erforschen Sie die Weisheit tigrinischer Sprichwörter mit Lautschrift und Übersetzungen oder verfassen Sie traditionelle Poesie mit KI.'
            : 'Explore millennia of oral philosophy, moral teachings, transliterated phonetics, and AI-synthesized Zelesegna and Qene verses.'}
        </p>

        {/* Search & Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          <div className="sm:col-span-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search proverbs by Tigrinya, English meaning, or keyword..."
              className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-amber-500"
            />
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Categories (ኩሉ)</option>
              <option value="wisdom_and_patience">Wisdom & Patience (ጥበብን ዓቕልን)</option>
              <option value="community_and_unity">Community & Unity (ሕብረትን ሓድነትን)</option>
              <option value="hard_work_and_resilience">Work & Resilience (ጻዕርን ጽንዓትን)</option>
              <option value="leadership_and_justice">Leadership & Justice (ፍትሕን መሪሕነትን)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Proverbs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProverbs.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-lg flex flex-col justify-between hover:border-amber-500/40 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded uppercase">
                  {item.category.replace(/_/g, ' ')}
                </span>
                <button
                  onClick={() => handleCopy(`${item.textTi}\n${item.transliteration}\n"${item.englishTranslation}"`, item.id)}
                  className="text-stone-400 hover:text-amber-400 text-xs flex items-center gap-1 transition-colors"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? 'Copied' : 'Share'}</span>
                </button>
              </div>

              {/* Tigrinya Proverb */}
              <div className="text-lg font-bold text-amber-200 font-geez leading-relaxed">
                {item.textTi}
              </div>

              {/* Phonetic Transliteration */}
              <div className="text-xs text-stone-400 italic font-mono">
                "{item.transliteration}"
              </div>

              {/* Translations */}
              <div className="text-xs text-stone-200 leading-relaxed bg-stone-950 p-3.5 rounded-xl border border-stone-800/80 space-y-1.5">
                <div>
                  <span className="text-amber-400 font-semibold">English: </span>
                  {item.englishTranslation}
                </div>
                {language === 'de' && item.germanTranslation && (
                  <div className="pt-1.5 border-t border-stone-800 text-stone-300">
                    <span className="text-amber-400 font-semibold">Deutsch: </span>
                    {item.germanTranslation}
                  </div>
                )}
              </div>
            </div>

            {/* Moral Lesson Footer */}
            <div className="pt-3 border-t border-stone-800 text-[11px] text-emerald-400/90 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>{item.moralLesson}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Traditional Poetry Synthesizer Section */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-5 shadow-2xl">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <Feather className="w-4 h-4" />
          <span>AI Traditional Bard & Qene Poet</span>
        </div>
        <h4 className="text-xl font-bold text-stone-100">
          {language === 'ti' ? 'AI ናይ ባህላዊ ግጥምን ቅኔን መመንጨዊ' : language === 'de' ? 'KI-Poesie- & Qene-Generator' : 'AI Traditional Poetic & Qene Synthesizer'}
        </h4>
        <p className="text-stone-400 text-xs max-w-xl">
          Enter a theme (e.g. Ancient Stelae of Aksum, Red Sea sea-faring courage, or coffee ceremony hospitality) to compose authentic rhymed verses in Tigrinya with transliterations.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={customPoemTopic}
            onChange={(e) => setCustomPoemTopic(e.target.value)}
            placeholder="e.g. The Resilience of Ancient Highland Monasteries & Unity..."
            className="flex-1 bg-stone-950 border border-stone-700 text-stone-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleGeneratePoem}
            disabled={isSynthesizing || !customPoemTopic.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isSynthesizing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Composing Verses...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Compose Traditional Poem</span>
              </>
            )}
          </button>
        </div>

        {/* Output Poem */}
        {generatedPoem && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-stone-950 p-6 rounded-xl border border-amber-500/30 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase">{generatedPoem.poemType} • {generatedPoem.meterOrStyle}</span>
                <h5 className="text-lg font-bold text-stone-100 mt-0.5">{generatedPoem.titleEn}</h5>
                <p className="text-amber-300 font-geez text-sm">{generatedPoem.titleTi}</p>
              </div>
            </div>

            {/* Stanzas in Tigrinya & English */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <span className="text-xs font-bold text-amber-400 uppercase">ትግርኛ (Tigrinya Verses)</span>
                {generatedPoem.stanzas.map((stanza, idx) => (
                  <div key={idx} className="space-y-1 font-geez text-amber-100 text-sm leading-loose bg-stone-900/50 p-4 rounded-xl border border-stone-800">
                    {stanza.linesTi.map((l, li) => (
                      <p key={li}>{l}</p>
                    ))}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold text-stone-400 uppercase">English Translation & Imagery</span>
                {generatedPoem.stanzas.map((stanza, idx) => (
                  <div key={idx} className="space-y-1 text-stone-300 text-xs leading-relaxed bg-stone-900/50 p-4 rounded-xl border border-stone-800">
                    {stanza.linesEn.map((l, li) => (
                      <p key={li}>{l}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
