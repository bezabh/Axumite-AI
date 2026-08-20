import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Layers, RotateCw, CheckCircle, Plus, 
  Download, FileText, Filter, Check, Brain, BookOpen, Trash2
} from 'lucide-react';
import { Flashcard } from '../../types';
import { 
  getStoredFlashcards, 
  saveFlashcard, 
  toggleFlashcardMastery, 
  generateStudyMaterialAi 
} from '../../services/educationService';

export const StudyMaterialsHub: React.FC<{ preferredLanguage?: 'en' | 'ti' }> = ({
  preferredLanguage = 'ti',
}) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiSummary, setAiSummary] = useState<{ summaryEn: string; summaryTi: string; keyFormulasOrTerms?: string[] } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFrontEn, setNewFrontEn] = useState('');
  const [newBackEn, setNewBackEn] = useState('');
  const [newFrontTi, setNewFrontTi] = useState('');
  const [newBackTi, setNewBackTi] = useState('');

  useEffect(() => {
    setFlashcards(getStoredFlashcards());
  }, []);

  const filteredCards = flashcards.filter(c => selectedCategory === 'all' || c.category === selectedCategory);
  const currentCard: Flashcard | undefined = filteredCards[currentCardIdx] || filteredCards[0];

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIdx(prev => (prev + 1) % (filteredCards.length || 1));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCardIdx(prev => (prev - 1 + filteredCards.length) % (filteredCards.length || 1));
  };

  const handleToggleMastery = () => {
    if (!currentCard) return;
    const updated = toggleFlashcardMastery(currentCard.id);
    setFlashcards(updated);
  };

  const handleGenerateAi = async () => {
    if (!aiTopic.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const result = await generateStudyMaterialAi(aiTopic, 'flashcards', 'intermediate');
      if (result.flashcards) {
        result.flashcards.forEach((fc: any) => {
          saveFlashcard({
            topic: fc.topic || aiTopic,
            frontEn: fc.frontEn,
            backEn: fc.backEn,
            frontTi: fc.frontTi || fc.frontEn,
            backTi: fc.backTi || fc.backEn,
            category: fc.category || 'stem',
            isMastered: false,
          });
        });
        setFlashcards(getStoredFlashcards());
      }
      setAiSummary({
        summaryEn: result.summaryEn,
        summaryTi: result.summaryTi,
        keyFormulasOrTerms: result.keyFormulasOrTerms,
      });
      setAiTopic('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFrontEn || !newBackEn) return;
    saveFlashcard({
      topic: 'Custom Concept',
      frontEn: newFrontEn,
      backEn: newBackEn,
      frontTi: newFrontTi || newFrontEn,
      backTi: newBackTi || newBackEn,
      category: 'stem',
      isMastered: false,
    });
    setFlashcards(getStoredFlashcards());
    setShowAddModal(false);
    setNewFrontEn('');
    setNewBackEn('');
    setNewFrontTi('');
    setNewBackTi('');
  };

  const masteredCount = flashcards.filter(c => c.isMastered).length;

  return (
    <div className="space-y-6" id="study-materials-hub">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent p-6 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-zinc-100">
              {preferredLanguage === 'ti' ? 'AI ናይ መጽናዕቲ ካርታታትን ጽሟቕ ጽሑፋትን' : 'AI Study Materials & Flashcards'}
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
              Active Recall
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            {preferredLanguage === 'ti'
              ? 'ብ AI ዝዳለዉ ናይ ምዝካር ካርታታት (Flashcards)፡ ጽሟቕ ትሕዝቶታት መጽሓፍትን ናይ ፈተና መዳለውታትን።'
              : 'AI-generated bilingual flashcards, spaced repetition engine, and downloadable summary sheets.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            {preferredLanguage === 'ti' ? 'ዝተሓዙ ካርታታት:' : 'Mastered:'}{' '}
            <span className="text-amber-400 font-bold">{masteredCount}/{flashcards.length}</span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{preferredLanguage === 'ti' ? 'ካርታ ወስኽ' : 'New Card'}</span>
          </button>
        </div>
      </div>

      {/* AI Material Generator Input Bar */}
      <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full relative">
          <Brain className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={aiTopic}
            onChange={e => setAiTopic(e.target.value)}
            placeholder={
              preferredLanguage === 'ti'
                ? 'ዝኾነ ኣርእስቲ ጽሓፍ (ንኣብነት: Calculus Derivatives, Ge\'ez Verbs, Neural Networks)...'
                : 'Enter any topic to instantly generate 5 bilingual flashcards & cheat sheet...'
            }
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <button
          onClick={handleGenerateAi}
          disabled={!aiTopic.trim() || isGenerating}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-bold text-xs disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-md shrink-0"
        >
          {isGenerating ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>{preferredLanguage === 'ti' ? 'ብ AI ኣዳልው' : 'Generate with AI'}</span>
        </button>
      </div>

      {/* AI Summary Cheatsheet Box if available */}
      {aiSummary && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/90 rounded-2xl border border-amber-500/30 p-5 space-y-3"
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              {preferredLanguage === 'ti' ? 'AI ጽሟቕ መጽናዕቲ ወረቐት (Cheat Sheet)' : 'AI-Generated High-Yield Cheat Sheet'}
            </h3>
            <button
              onClick={() => setAiSummary(null)}
              className="text-xs text-zinc-400 hover:text-zinc-200"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-zinc-300">
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80">
              <p className="font-bold text-amber-400 mb-1">ትግርኛ (Summary):</p>
              {aiSummary.summaryTi}
            </div>
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80 font-mono">
              <p className="font-bold text-cyan-400 mb-1">English Derivation:</p>
              {aiSummary.summaryEn}
            </div>
          </div>
        </motion.div>
      )}

      {/* Category filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'stem', 'geez_language', 'computer_science', 'medicine'].map(cat => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentCardIdx(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-zinc-950 shadow-md'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            {cat === 'all' ? (preferredLanguage === 'ti' ? 'ኩሎም' : 'All Decks') : cat.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* 3D Flashcard Presentation Stage */}
      {currentCard ? (
        <div className="max-w-xl mx-auto space-y-4">
          <div
            onClick={handleFlip}
            className="cursor-pointer perspective-1000 min-h-[300px] sm:min-h-[340px] relative w-full select-none"
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="w-full h-full min-h-[300px] sm:min-h-[340px] rounded-3xl bg-zinc-900 border-2 border-amber-500/40 p-8 flex flex-col justify-between shadow-2xl relative preserve-3d group hover:border-amber-400 transition-colors"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  {currentCard.topic}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {currentCardIdx + 1} / {filteredCards.length}
                </span>
              </div>

              {/* Card Body Text */}
              <div className="py-6 text-center space-y-3">
                <div className="text-base sm:text-lg font-bold text-zinc-100 leading-relaxed">
                  {!isFlipped
                    ? (preferredLanguage === 'ti' ? currentCard.frontTi : currentCard.frontEn)
                    : (preferredLanguage === 'ti' ? currentCard.backTi : currentCard.backEn)}
                </div>

                <div className="text-xs text-zinc-400 font-mono">
                  {!isFlipped
                    ? (preferredLanguage === 'ti' ? currentCard.frontEn : currentCard.frontTi)
                    : (preferredLanguage === 'ti' ? currentCard.backEn : currentCard.backTi)}
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-800">
                <span className="flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" />
                  {preferredLanguage === 'ti' ? 'ንመልሲ ንምርኣይ ጠውቕ' : 'Click to flip'}
                </span>
                {currentCard.isMastered && (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {preferredLanguage === 'ti' ? 'ተሓዚዙ' : 'Mastered'}
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold transition-all"
            >
              {preferredLanguage === 'ti' ? '← ቀዳማይ' : '← Previous'}
            </button>

            <button
              onClick={handleToggleMastery}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                currentCard.isMastered
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-300'
              }`}
            >
              <Check className="w-4 h-4" />
              {currentCard.isMastered
                ? (preferredLanguage === 'ti' ? 'ተሓዚዙ እዩ ✓' : 'Mastered ✓')
                : (preferredLanguage === 'ti' ? 'ከም ዝተሓዘ ምልክት ግበር' : 'Mark as Mastered')}
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-semibold transition-all"
            >
              {preferredLanguage === 'ti' ? 'ቀጻሊ →' : 'Next →'}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-zinc-500 text-xs">
          {preferredLanguage === 'ti' ? 'ኣብዚ ክፍሊ ዝተረኽበ ካርታ የለን።' : 'No flashcards found in this category.'}
        </div>
      )}

      {/* Add Custom Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-zinc-100">
              {preferredLanguage === 'ti' ? 'ሓዲሽ ናይ መጽናዕቲ ካርታ ምፍጣር' : 'Create Custom Flashcard'}
            </h3>
            <form onSubmit={handleCreateCard} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Front (English Question)"
                value={newFrontEn}
                onChange={e => setNewFrontEn(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              />
              <textarea
                required
                rows={2}
                placeholder="Back (English Answer)"
                value={newBackEn}
                onChange={e => setNewBackEn(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
              />
              <input
                type="text"
                placeholder="ናይ ቅድሚት ሕቶ ብትግርኛ (Optional)"
                value={newFrontTi}
                onChange={e => setNewFrontTi(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
              />
              <textarea
                rows={2}
                placeholder="ናይ ድሕሪት መልሲ ብትግርኛ (Optional)"
                value={newBackTi}
                onChange={e => setNewBackTi(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 text-xs"
                >
                  {preferredLanguage === 'ti' ? 'ሰርዝ' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 text-xs font-bold"
                >
                  {preferredLanguage === 'ti' ? 'ፍጠር' : 'Create Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
