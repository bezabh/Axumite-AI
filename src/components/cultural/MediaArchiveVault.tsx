import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Archive, Upload, Search, ShieldCheck, Tag, 
  ExternalLink, Sparkles, Filter, CheckCircle2, User, Plus, X 
} from 'lucide-react';
import { MediaArchiveItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

const INITIAL_ARCHIVE_ITEMS: MediaArchiveItem[] = [
  {
    id: 'ARC-001',
    title: 'Historic Inscription of King Ezana (Trilingual Tablet)',
    titleTi: 'ጽሑፍ እምኒ ንጉስ ዕዛና',
    mediaType: 'manuscript_document',
    contributorName: 'Institute of Axumite Studies',
    contributorLocation: 'Aksum, Tigray',
    dateUploaded: '2026-08-10',
    era: '4th Century CE',
    tags: ['Ezana', 'Ge\'ez', 'Sabaean', 'Greek', 'Epigraphy'],
    description: 'Monumental 4th-century stone stele carved in three distinct ancient scripts: Ge\'ez vocalized, South Arabian Sabaean, and Ancient Greek.',
    descriptionTi: 'ብግእዝ፡ ብሳባውያንን ብጥንታዊ ግሪኽን ዝተጻሕፈ ናይ ንጉስ ዕዛና ታሪኻዊ ጽሑፍ እምኒ።',
    evidenceStatus: 'verified_historical',
    urlOrPath: '/assets/images/axumite_background_1786611272574.jpg',
  },
  {
    id: 'ARC-002',
    title: 'Vintage Photograph: Asmara Cinema Impero 1938',
    titleTi: 'ጥንታዊ ስእሊ፡ ሲነማ ኢምፔሮ ኣስመራ',
    mediaType: 'historical_photo',
    contributorName: 'Mussie Abraham',
    contributorLocation: 'Asmara, Eritrea',
    dateUploaded: '2026-08-12',
    era: '1930s Modernist Era',
    tags: ['Asmara', 'Art Deco', 'Cinema Impero', 'Architecture'],
    description: 'Archival silver gelatin photograph capturing the newly unveiled Art Deco Cinema Impero facade with classic rounded portholes.',
    descriptionTi: 'ናይ 1930ታት ናይ ሲነማ ኢምፔሮ ፍሉይ ናይ ኣርት ዲኮ ስነ-ህንጻ ዘርኢ ጥንታዊ ስእሊ።',
    evidenceStatus: 'verified_historical',
    urlOrPath: '/assets/images/axumite_background_1786611272574.jpg',
  },
  {
    id: 'ARC-003',
    title: 'Oral History: Salt Caravan Merchants of the Danakil',
    titleTi: 'ቃል ታሪኽ፡ ተጓዓዝቲ ጨው ናይ ዳናኪል',
    mediaType: 'oral_recording',
    contributorName: 'Tadesse Kahsay (Elder)',
    contributorLocation: 'Wukro / Berhale',
    dateUploaded: '2026-08-14',
    era: 'Late 20th Century',
    tags: ['Amole', 'Caravan', 'Danakil', 'Oral History'],
    description: 'Audio testimony recounting the 3-week camel caravan journeys transporting Amole salt bars up into highland markets.',
    descriptionTi: 'ናይ ዓሞሌ ጨው ነጋዶ ካብ ዳናኪል ክሳብ ደጋዊ ዕዳጋታት ዘካይድዎ ዝነበሩ ናይ ግመል ጉዕዞ ዘዘንቱ ናይ ቃል ታሪኽ።',
    evidenceStatus: 'oral_tradition',
    urlOrPath: '/assets/images/axumite_background_1786611272574.jpg',
  },
  {
    id: 'ARC-004',
    title: '14th-Century Illuminated Ge\'ez Gospel Manuscript',
    titleTi: 'ናይ 14 ክፍለዘመን ብኢድ ዝተጻሕፈ ወንጌል ግእዝ',
    mediaType: 'manuscript_document',
    contributorName: 'Debre Damo Monastery Archives',
    contributorLocation: 'Debre Damo',
    dateUploaded: '2026-08-15',
    era: '14th Century CE',
    tags: ['Vellum', 'Illuminated Manuscript', 'Yared', 'Monastery'],
    description: 'Hand-drawn natural mineral pigment illustrations on goat vellum preserving classical Ge\'ez liturgical chants and cross motifs.',
    descriptionTi: 'ብቖርበት ጤል ተሰሪሑ ብተፈጥሮኣዊ ሕብርታት ዝተሰለመ ጥንታዊ ናይ ግእዝ ማህደር።',
    evidenceStatus: 'verified_historical',
    urlOrPath: '/assets/images/axumite_background_1786611272574.jpg',
  },
];

export const MediaArchiveVault: React.FC = () => {
  const { language } = useLanguage();
  const [archiveItems, setArchiveItems] = useState<MediaArchiveItem[]>(INITIAL_ARCHIVE_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Contribution Form State
  const [newTitle, setNewTitle] = useState('');
  const [newMediaType, setNewMediaType] = useState<MediaArchiveItem['mediaType']>('historical_photo');
  const [newContributor, setNewContributor] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newEra, setNewEra] = useState('20th Century');
  const [newTags, setNewTags] = useState('Heritage, Family, Photo');
  const [newDescription, setNewDescription] = useState('');

  const filteredItems = archiveItems.filter((item) => {
    const matchesType = typeFilter === 'all' || item.mediaType === typeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleContributeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const payload = {
        title: newTitle,
        mediaType: newMediaType,
        contributorName: newContributor || 'Anonymous Contributor',
        contributorLocation: newLocation || 'Diaspora Community',
        era: newEra,
        tags: newTags.split(',').map(s => s.trim()),
        description: newDescription,
        evidenceStatus: 'community_submitted' as const,
      };

      const res = await fetch('/api/cultural/archive-contribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.item) {
        setArchiveItems([data.item, ...archiveItems]);
      } else {
        const localItem: MediaArchiveItem = {
          id: `ARC-${Date.now().toString().slice(-4)}`,
          ...payload,
          dateUploaded: new Date().toISOString().split('T')[0],
          urlOrPath: '/assets/images/axumite_background_1786611272574.jpg',
        };
        setArchiveItems([localItem, ...archiveItems]);
      }

      setShowUploadModal(false);
      setNewTitle('');
      setNewDescription('');
    } catch (err) {
      console.error('Archive upload error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-amber-950/30 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Archive className="w-4 h-4" />
            <span>Digital Memory & Preservation Vault</span>
          </div>
          <h3 className="text-2xl font-bold text-stone-100">
            {language === 'ti' ? 'ዲጂታል ናይ ቅርሲ ማህደር (Archive Vault)' : language === 'de' ? 'Digitales Kulturerbe- & Medienarchiv' : 'Digital Cultural Archive & Heritage Vault'}
          </h3>
          <p className="text-stone-400 text-sm mt-1 max-w-xl">
            {language === 'ti'
              ? 'ጥንታውያን ፎቶታት፡ ናይ ግእዝ ማህደራት፡ ናይ ቃል ታሪኽን ባህላዊ ቅርጽታትን ንዘላቒ ምዕቃብ ኣበርክቱ።'
              : language === 'de'
            ? 'Entdecken und bewahren Sie historische Fotografien, Manuskripte, Tonaufnahmen und Familienarchive.'
            : 'Explore, research, and contribute to the verified digital repository of manuscripts, oral histories, and vintage photographs.'}
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ti' ? 'ናይ ታሪኽ ሰነድ ኣበርክት' : language === 'de' ? 'Archivbeitrag einreichen' : 'Contribute Archive Item'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'historical_photo', label: 'Vintage Photos' },
            { id: 'manuscript_document', label: 'Ge\'ez Manuscripts' },
            { id: 'oral_recording', label: 'Oral Histories' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setTypeFilter(type.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                typeFilter === type.id ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search archive tags, era, or titles..."
            className="w-full bg-stone-950 border border-stone-700 text-stone-100 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-amber-500"
          />
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Archive Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-lg flex flex-col justify-between hover:border-amber-500/40 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded uppercase">
                  {item.mediaType.replace('_', ' ')} • {item.era}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                  item.evidenceStatus === 'verified_historical' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                }`}>
                  <ShieldCheck className="w-3 h-3" />
                  {item.evidenceStatus.replace('_', ' ')}
                </span>
              </div>

              <h4 className="text-lg font-bold text-stone-100">{item.title}</h4>
              {item.titleTi && (
                <p className="text-amber-300 font-geez text-sm font-semibold">{item.titleTi}</p>
              )}

              <p className="text-xs text-stone-300 leading-relaxed bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag, ti) => (
                  <span key={ti} className="text-[10px] font-mono px-2 py-0.5 bg-stone-800 text-stone-400 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Contributor Footer */}
            <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-amber-400" />
                <span>{item.contributorName} ({item.contributorLocation})</span>
              </span>
              <span className="font-mono text-stone-500">{item.dateUploaded}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Contribution Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <h3 className="font-bold text-stone-100 text-base flex items-center gap-2">
                  <Archive className="w-4 h-4 text-amber-400" />
                  <span>Contribute to Cultural Digital Archive</span>
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 hover:bg-stone-800 text-stone-400 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleContributeSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Item Title / Headline</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. 1960s Traditional Wedding Ceremony in Mendefera..."
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">Category</label>
                    <select
                      value={newMediaType}
                      onChange={(e) => setNewMediaType(e.target.value as any)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-2.5 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="historical_photo">Vintage Photograph</option>
                      <option value="manuscript_document">Manuscript / Text</option>
                      <option value="oral_recording">Oral History Audio</option>
                      <option value="traditional_song">Traditional Song</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">Era / Approximate Year</label>
                    <input
                      type="text"
                      value={newEra}
                      onChange={(e) => setNewEra(e.target.value)}
                      placeholder="e.g. 1955 or Late 19th Century"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">Your Name / Family Name</label>
                    <input
                      type="text"
                      value={newContributor}
                      onChange={(e) => setNewContributor(e.target.value)}
                      placeholder="e.g. Elsa Berhe"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">Origin City / Region</label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="e.g. Asmara / Frankfurt Diaspora"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Historical Context & Memory Description</label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Describe the significance, names of individuals, or circumstances of this artifact..."
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 bg-stone-800 text-stone-300 rounded-xl hover:bg-stone-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 text-stone-950 font-bold rounded-xl hover:bg-amber-400"
                  >
                    Submit to Digital Vault
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
