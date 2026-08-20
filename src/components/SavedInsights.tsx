import React, { useState } from 'react';
import { SavedItem } from '../types';
import { BookmarkCheck, Search, Trash2, Copy, Check, Download, Filter, MessageSquareText, Eye, Wand2, Languages, Palette } from 'lucide-react';

interface SavedInsightsProps {
  savedItems: SavedItem[];
  onDelete: (id: string) => void;
}

export const SavedInsights: React.FC<SavedInsightsProps> = ({ savedItems, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = savedItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag ? item.tags.includes(selectedTag) || item.type === selectedTag : true;
    return matchesSearch && matchesTag;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedItems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `AXUMITE_AI_Insights_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getTypeIcon = (type: SavedItem['type']) => {
    switch (type) {
      case 'chat': return <MessageSquareText className="w-4 h-4 text-amber-400" />;
      case 'vision': return <Eye className="w-4 h-4 text-emerald-400" />;
      case 'prompt': return <Wand2 className="w-4 h-4 text-purple-400" />;
      case 'translation': return <Languages className="w-4 h-4 text-blue-400" />;
      case 'calligraphy': return <Palette className="w-4 h-4 text-amber-300" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Search & Filter Bar */}
      <div className="bg-[#060606] p-4 border border-[#8E6D28]/25 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved insights..."
            className="w-full bg-[#080808] border border-[#8E6D28]/30 focus:border-[#C5A059] rounded-2xl pl-10 pr-3 py-2.5 text-xs text-slate-100 placeholder-gray-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all rounded-xl ${
              selectedTag === null
                ? 'bg-[#8E6D28]/20 text-[#F3E5AB] border border-[#8E6D28]/40'
                : 'bg-[#080808] text-gray-400 border border-[#8E6D28]/20'
            }`}
          >
            All
          </button>
          {['chat', 'calligraphy', 'vision', 'prompt', 'translation'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all rounded-xl ${
                selectedTag === tag
                  ? 'bg-[#8E6D28]/20 text-[#F3E5AB] border border-[#8E6D28]/40'
                  : 'bg-[#080808] text-gray-400 border border-[#8E6D28]/20'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* List of Items */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#060606] border border-[#8E6D28]/20 p-12 text-center space-y-3 rounded-3xl">
          <BookmarkCheck className="w-10 h-10 text-gray-600 mx-auto stroke-[1.5]" />
          <p className="text-xs font-medium text-gray-300 uppercase tracking-widest">
            {savedItems.length === 0 ? 'No saved insights yet.' : 'No matching insights found.'}
          </p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Click "Save" on any chat output, calligraphy pattern, vision analysis, prompt forge, or translation to bookmark it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#060606] border border-[#8E6D28]/20 hover:border-[#8E6D28] p-4 space-y-3 flex flex-col justify-between transition-all rounded-3xl shadow-md"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#8E6D28]/15">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(item.type)}
                    <span className="serif-luxury font-bold text-xs text-[#F3E5AB] truncate max-w-[200px]">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono">
                    {item.createdAt}
                  </span>
                </div>

                {/* Thumbnail if present (e.g. Calligraphy or Vision) */}
                {item.metadata?.thumbnailUrl && (
                  <div className="my-2 rounded-2xl overflow-hidden border border-[#8E6D28]/30 max-h-48 bg-black flex items-center justify-center">
                    <img 
                      src={item.metadata.thumbnailUrl} 
                      alt={item.title} 
                      className="w-full h-auto object-contain max-h-48"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="mt-2 text-xs text-gray-300 whitespace-pre-wrap line-clamp-6 font-sans leading-relaxed">
                  {item.content}
                </div>
              </div>

              <div className="pt-2 border-t border-[#8E6D28]/15 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#0D0D0E] text-gray-400 border border-[#8E6D28]/20 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(item.id, item.content)}
                    className="p-1.5 bg-[#0D0D0E] text-gray-400 hover:text-[#C5A059] border border-[#8E6D28]/20 rounded-lg transition-colors cursor-pointer"
                    title="Copy Content"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 bg-[#0D0D0E] text-gray-400 hover:text-rose-400 border border-[#8E6D28]/20 rounded-lg transition-colors cursor-pointer"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
