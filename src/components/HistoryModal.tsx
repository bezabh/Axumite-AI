import React, { useState } from 'react';
import { 
  X, Clock, Trash2, Search, ChevronRight, Calendar, Sparkles, MessageSquare, Filter
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HistoryItem {
  id: string;
  query: string;
  previewSnippet?: string;
  timestamp: string;
  dateTag?: 'today' | 'week' | 'older';
  category: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPromptForChat?: (prompt: string) => void;
}

// Helper to highlight matching keywords within text using a subtle gold text highlight
const highlightMatch = (text: string, query: string) => {
  const trimmed = query.trim();
  if (!trimmed || !text) return text;

  // Split into unique non-empty search terms and escape regex special characters
  const terms = Array.from(new Set(trimmed.split(/\s+/).filter(Boolean)))
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (terms.length === 0) return text;

  const regex = new RegExp(`(${terms.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = terms.some(term => new RegExp(`^${term}$`, 'i').test(part));
        if (isMatch) {
          return (
            <mark
              key={i}
              className="bg-amber-500/20 text-[#FDE68A] font-semibold px-1 py-0.5 rounded border-b border-amber-400/60 transition-colors inline-block leading-normal"
            >
              {part}
            </mark>
          );
        }
        return part;
      })}
    </>
  );
};

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectPromptForChat,
}) => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'older'>('all');

  if (!isOpen) return null;

  // Retrieve saved chats from localStorage or use rich default archive
  let savedHistory: HistoryItem[] = [];
  try {
    const raw = localStorage.getItem('axumite_chat_history_archive');
    if (raw) {
      savedHistory = JSON.parse(raw);
    }
  } catch {
    savedHistory = [];
  }

  if (savedHistory.length === 0) {
    savedHistory = [
      {
        id: 'hist-1',
        query: 'ብዛዕባ ጥንታዊ ስልጣነ ኣኽሱምን ፊደል ግዕዝን ዝርዝር ታሪኻዊ መብርሂ ሃበኒ።',
        previewSnippet: 'ጥንታዊ ስልጣነ ኣኽሱም ሓደ ካብቶም ዓበይቲን ሓያላትን ሃጸያዊ መንግስታት ዓለም እዩ ነይሩ። ፊደል ግዕዝ ከኣ ፍሉይ ስርዓት ኣጸሓሕፋ ብምዃን...',
        timestamp: 'Today, 10:45 AM',
        dateTag: 'today',
        category: 'History & Ge\'ez',
      },
      {
        id: 'hist-2',
        query: 'How to register a tech startup business with sovereign data governance in Eritrea?',
        previewSnippet: 'Step-by-step guidance for business licensing, data sovereignty compliance, ministry of communication registry, and banking integration in Asmara...',
        timestamp: 'Today, 08:20 AM',
        dateTag: 'today',
        category: 'Legal & Tech',
      },
      {
        id: 'hist-3',
        query: 'ትርጉም ምስላታት ትግርኛ: "ኣይትሓግግ ኣይትበል ጽሓይ ዒራ\'ላ"',
        previewSnippet: 'እዚ ምስላ እዚ ኩነታት ከይተረጋገጸ ወይ ከይተፈተነ ቀዲምካ ተስፋ ምቑራጽ ወይ ምምኽናይ ከምዘየድሊ የመልክት...',
        timestamp: '3 days ago',
        dateTag: 'week',
        category: 'Proverbs & Wisdom',
      },
      {
        id: 'hist-4',
        query: 'Diagnose vehicle fault code P0300 cylinder misfire cause and spark plug inspection.',
        previewSnippet: 'P0300 indicates a random or multiple cylinder misfire. Common causes: worn spark plugs, ignition coil failure, low fuel pressure, or vacuum leak...',
        timestamp: '5 days ago',
        dateTag: 'week',
        category: 'Automotive',
      },
      {
        id: 'hist-5',
        query: 'AI prompt design for luxury golden architectural rendering in 8K.',
        previewSnippet: 'Master prompt with cinematic lighting, volumetric rays, obsidian and brushed gold textures, 8k resolution, photorealistic Unreal Engine 5...',
        timestamp: 'Aug 04, 2026',
        dateTag: 'older',
        category: 'Creative AI',
      },
    ];
  }

  const filtered = savedHistory.filter((item) => {
    // Keyword query or preview or category match
    const term = searchTerm.toLowerCase().trim();
    const matchesKeyword = !term || 
      item.query.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      (item.previewSnippet && item.previewSnippet.toLowerCase().includes(term));

    // Date filter match
    const matchesDate = 
      dateFilter === 'all' ||
      item.dateTag === dateFilter;

    return matchesKeyword && matchesDate;
  });

  const handleSelectHistoryItem = (query: string) => {
    if (onSelectPromptForChat) {
      onSelectPromptForChat(query);
      onClose();
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem('axumite_chat_history_archive');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-[#0C0E16] border border-[#B88E33]/60 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#111422] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-[#D4A738]/50 text-[#ECC359] flex items-center justify-center shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center space-x-2">
                <span>{language === 'ti' ? 'ታሪኽ ዕላልን ምርምርን' : 'Chat History & Archive'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'ti' ? 'ዝሓለፉ ሕቶታትን ውጽኢት ምርምርን ብቕጽበት ርኸቡ' : 'Filter past sessions by keyword or date range'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar & Date Filter Controls */}
        <div className="p-3.5 sm:p-4 bg-[#090A10] border-b border-slate-800/80 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#D4A738]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === 'ti' ? 'ብቃላት ወይ ትሕዝቶ ድለ...' : 'Search by keywords, topic, or content snippet...'}
                className="w-full pl-10 pr-4 py-2 bg-[#131724] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4A738]"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={handleClearHistory}
              title="Clear all chat history"
              className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all cursor-pointer shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'ti' ? 'ኣጽሪ' : 'Clear'}</span>
            </button>
          </div>

          {/* Date Range Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto text-[11px] font-bold">
            <span className="text-slate-400 mr-1 flex items-center space-x-1">
              <Filter className="w-3 h-3 text-[#D4A738]" />
              <span>{language === 'ti' ? 'ዕለት:' : 'Date:'}</span>
            </span>

            <button
              type="button"
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                dateFilter === 'all'
                  ? 'bg-amber-500/20 border-[#D4A738] text-[#F3E5AB]'
                  : 'bg-[#131724] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'ti' ? 'ኩሉ (All)' : 'All Time'}
            </button>

            <button
              type="button"
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                dateFilter === 'today'
                  ? 'bg-amber-500/20 border-[#D4A738] text-[#F3E5AB]'
                  : 'bg-[#131724] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'ti' ? 'ሎሚ (Today)' : 'Today'}
            </button>

            <button
              type="button"
              onClick={() => setDateFilter('week')}
              className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                dateFilter === 'week'
                  ? 'bg-amber-500/20 border-[#D4A738] text-[#F3E5AB]'
                  : 'bg-[#131724] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'ti' ? 'ዝሓለፈ 7 መዓልቲ' : 'Last 7 Days'}
            </button>

            <button
              type="button"
              onClick={() => setDateFilter('older')}
              className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                dateFilter === 'older'
                  ? 'bg-amber-500/20 border-[#D4A738] text-[#F3E5AB]'
                  : 'bg-[#131724] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {language === 'ti' ? 'ቀደም' : 'Older'}
            </button>
          </div>
        </div>

        {/* List of Chat Sessions with Snippet Previews */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">
                {language === 'ti' ? 'ምስዚ ዝሰማማዕ ታሪኽ ኣይተረኽበን።' : 'No matching archived sessions found.'}
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleSelectHistoryItem(item.query)}
                className="p-3.5 rounded-2xl bg-[#131624] hover:bg-[#1A1E30] border border-slate-800 hover:border-[#D4A738]/60 transition-all cursor-pointer space-y-2 group shadow-sm"
              >
                {/* Meta Top: Category + Timestamp */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#E5C158] bg-amber-950/50 px-2.5 py-0.5 rounded-md border border-[#D4A738]/30">
                    {item.category}
                  </span>
                  <span className="text-slate-400 text-[11px] flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{item.timestamp}</span>
                  </span>
                </div>

                {/* Main Query / Prompt Title */}
                <h4 className="text-xs sm:text-[13px] font-bold text-slate-100 group-hover:text-[#F3E5AB] transition-colors leading-snug">
                  "{highlightMatch(item.query, searchTerm)}"
                </h4>

                {/* Content Snippet / Preview */}
                {item.previewSnippet && (
                  <p className="text-[11.5px] text-slate-400 line-clamp-2 leading-relaxed bg-[#0B0C12]/80 p-2 rounded-xl border border-slate-800/60 font-mono">
                    {highlightMatch(item.previewSnippet, searchTerm)}
                  </p>
                )}

                {/* Action Footer */}
                <div className="flex items-center justify-end text-[11px] text-[#ECC359] font-bold space-x-1 group-hover:translate-x-1 transition-transform pt-0.5">
                  <span>{language === 'ti' ? 'ዕላል ቀጽል' : 'Resume Chat'}</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
