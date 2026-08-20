import React, { useState, useMemo } from 'react';
import { 
  Compass, Calendar, Award, Sparkles, BookOpen, Search, Filter, 
  ChevronRight, ArrowRight, Bookmark, Volume2, Shield, Landmark, 
  Coins, Crown, Flame, Ship, MapPin, CheckCircle2, Info, ExternalLink
} from 'lucide-react';
import { AxumiteMilestone } from '../types';

interface AxumiteTimelineProps {
  userTopic?: string;
  onSelectMilestoneForQuery?: (queryText: string) => void;
  onSaveInsight?: (item: any) => void;
}

export const AXUMITE_MILESTONES: AxumiteMilestone[] = [
  {
    id: 'axum-1',
    period: 'c. 400 BC – 100 AD',
    yearCentury: '4th Century BC - 1st Century AD',
    title: "Proto-Axumite Foundations & D'mt Transition",
    titleGeez: "መንግስቲ ዳዕማት ወይ መበቆል ኣክሱም",
    category: 'architecture',
    summary: 'The emergence of early Urban settlements at Yeha, Qohaito, and Matara with distinct South Arabian and Ge’ez epigraphic scripts.',
    details: 'During this formative era, ancient trade networks connected the Ethiopian and Eritrean highlands with the Red Sea. Architectural feats like the Great Temple of Yeha (built without mortar using massive dressed stones) laid the stonemasonry foundations for later Axumite stelae.',
    significance: 'Established early monumental stone architecture, Ge’ez linguistic roots, and agricultural terracing.',
    keyArtifacts: ['Temple of Yeha', 'Qohaito Dam Ruins', 'Early Ge’ez Inscriptions', 'Altar of Moon & Sun'],
    tags: ['proto-axumite', 'yeha', 'qohaito', 'architecture', 'geez', 'foundations'],
    keyFact: 'The Temple of Yeha is considered the oldest standing structure in sub-Saharan Africa, built around 700–500 BC.',
  },
  {
    id: 'axum-2',
    period: 'c. 100 AD – 270 AD',
    yearCentury: '1st - 3rd Century AD',
    title: 'Rise of the Sovereign Maritime Empire & Port of Adulis',
    titleGeez: 'ልዑላዊ መንግስቲ ኣክሱም ወወደብ ዓዱሊስ',
    category: 'maritime',
    summary: 'Documented in the Greco-Roman navigation text Periplus of the Erythraean Sea under King Zoskales as a major world trading power.',
    details: 'The ancient port of Adulis on the Red Sea (near modern Massawa) became the maritime engine of Axum. Axum traded ivory, gold, frankincense, obsidian, and spices with Egypt, Rome, Arabia, India, and Sri Lanka.',
    significance: 'Positioned Axum alongside Rome, Persia, and China as one of the four global powers of antiquity.',
    keyArtifacts: ['Adulis Port Complex', 'Roman Glassware Artifacts', 'Obsidian Blades', 'Ivory Carvings'],
    tags: ['adulis', 'zoskales', 'red-sea', 'maritime', 'trade', 'ivory', 'silk-road'],
    keyFact: 'Roman historian Mani wrote in the 3rd century AD that Axum was one of the four greatest empires in the world alongside Rome, Persia, and China.',
  },
  {
    id: 'axum-3',
    period: 'c. 270 AD – 300 AD',
    yearCentury: 'Late 3rd Century AD',
    title: 'Introduction of Sovereign Coinage (King Endubis)',
    titleGeez: 'ብረት መዓድን ወቕፊ ኣክሱም (ንጉሥ እንዳቢስ)',
    category: 'coinage',
    summary: 'King Endubis minted sub-Saharan Africa’s first gold, silver, and bronze imperial coins bearing Greek and Ge’ez legends.',
    details: 'Imperial coinage standardized economic trade across the Red Sea. Early gold coins featured the crescent moon and disk symbol of early Axumite religion, later replaced by the Christian cross under King Ezana.',
    significance: 'Demonstrated absolute economic sovereignty, state control over metallurgy, and prestige in international commerce.',
    keyArtifacts: ['Endubis Gold Coinage', 'Aphilas Silver Currency', 'Ge’ez Mints', 'Standardized Weights'],
    tags: ['endubis', 'coins', 'gold', 'currency', 'economy', 'aphilas', 'trade'],
    keyFact: 'Axum was the only ancient African state south of Egypt to design and mint its own distinct gold, silver, and bronze currency.',
  },
  {
    id: 'axum-4',
    period: 'c. 330 AD – 360 AD',
    yearCentury: 'Mid-4th Century AD',
    title: 'King Ezana’s Reign & Trilingual Inscriptions',
    titleGeez: 'ንጉሥ ዔዛና ወክርስቲያናዊ ትካል ወጽሑፋት',
    category: 'rulers',
    summary: 'King Ezana expanded the empire across Nubia and South Arabia, adopting Christianity and commissioning the famous Trilingual Ezana Stone.',
    details: 'Ezana commissioned stone stelae inscribed in three languages: Ge’ez, Sabaean, and Greek. The conversion of the empire led to the creation of Ge’ez liturgical music (credited to Saint Yared) and codification of Ge’ez script with vowels.',
    significance: 'Made Axum one of the earliest official Christian states in human history and codified the Ge’ez abugida writing system.',
    keyArtifacts: ['Ezana Trilingual Stone', 'Ezana Gold Coin with Cross', 'Early Ge’ez Vowelled Manuscripts'],
    tags: ['ezana', 'trilingual-stone', 'religion', 'geez-script', 'christianity', 'nubia'],
    keyFact: 'The Ezana Stone features identical royal decrees written in three scripts: Sabaean, Ge’ez, and Greek—acting as the Rosetta Stone of Axumite history.',
  },
  {
    id: 'axum-5',
    period: 'c. 350 AD – 550 AD',
    yearCentury: '4th - 6th Century AD',
    title: 'Golden Age of Stelae & Monolithic Stonemasonry',
    titleGeez: 'ዓበይቲ ሓወልትታትን ጥበባትን',
    category: 'architecture',
    summary: 'Creation of massive multi-story monolithic obelisks carved from single blocks of granite, representing multi-level palaces.',
    details: 'Axumite stone sculptors erected giant stelae without mortar, featuring carved false doors, windows, and structural locks. The Great Stele weighed over 500 tons and stood 33 meters tall—the largest single monolith humans ever attempted to erect in antiquity.',
    significance: 'Pinnacle of ancient engineering, subterranean tomb vaults, and royal funerary architecture.',
    keyArtifacts: ['Rome Stele (Stele 2)', 'King Ezana’s Stele (Stele 3)', 'Great Stele (Stele 1)', 'Tomb of the False Door'],
    tags: ['obelisk', 'stelae', 'granite', 'monolith', 'architecture', 'tombs', 'engineering'],
    keyFact: 'The Axumite obelisks were carved from solid granite quarries kilometers away and transported using ramps and trained war elephants.',
  },
  {
    id: 'axum-6',
    period: 'c. 520 AD – 550 AD',
    yearCentury: '6th Century AD',
    title: 'King Kaleb & Red Sea Imperial Dominance',
    titleGeez: 'ንጉሥ ካሌብ ወዓለምለኻዊ ሓይሊ መረብ',
    category: 'rulers',
    summary: 'King Kaleb (Ella Asbeha) launched a massive naval fleet across the Red Sea to protect trade networks and allies in Himyar (Yemen).',
    details: 'In alliance with Byzantine Emperor Justinian I, King Kaleb led a fleet of over 60 vessels to defeat Dhu Nuwas and secure maritime security across the Bab-el-Mandeb strait. Byzantium referred to Kaleb as the supreme protector of southern trade routes.',
    significance: 'Peak territorial footprint of the Axumite Empire spanning both sides of the Red Sea.',
    keyArtifacts: ['Palace of Ta’akha Maryam', 'Kaleb & Gebre Meskel Tombs', 'Justinian Coalition Treaties'],
    tags: ['kaleb', 'byzantium', 'himyar', 'red-sea', 'navy', 'conquest', 'justinian'],
    keyFact: 'King Kaleb minted gold coins engraved with the phrase "By the Grace of Christ", asserting imperial dominance across Africa and Arabia.',
  },
  {
    id: 'axum-7',
    period: 'c. 615 AD – 630 AD',
    yearCentury: '7th Century AD',
    title: 'The First Hijra & Righteous Refuge (King Armah / Najashi)',
    titleGeez: 'ፍትሓዊ ንጉሥ ኣርማሕ ወዕቝባ',
    category: 'religion',
    summary: 'King Armah (Najashi) granted asylum and sanctuary to the early companions of Prophet Muhammad escaping persecution in Mecca.',
    details: 'When Quraish envoys demanded the return of the refugees, King Armah drew a line in the sand and declared they were safe under Axumite law. This established the historical foundation of peaceful interfaith relations in the Horn of Africa.',
    significance: 'Cemented Axum’s global reputation for justice, diplomatic immunity, and religious tolerance.',
    keyArtifacts: ['Armah Silver Coinage', 'Negash Sanctuary Site', 'Royal Protection Charters'],
    tags: ['armah', 'najashi', 'hijra', 'asylum', 'diplomacy', 'mecca', 'sanctuary'],
    keyFact: 'Prophet Muhammad instructed his followers to seek refuge in Axum, describing its monarch as "a king under whom no one is wronged."',
  },
  {
    id: 'axum-8',
    period: 'c. 700 AD – 950 AD',
    yearCentury: '8th - 10th Century AD',
    title: 'Late Axumite Shift & Lasting Ge’ez Cultural Legacy',
    titleGeez: 'መወዳእታ መድረኽ ኣክሱም ወቅርሲ',
    category: 'maritime',
    summary: 'Shift of international maritime routes led to economic transformation, internal migration, and preservation of Ge’ez literature.',
    details: 'As Red Sea trade shifted toward internal agricultural highlands, Axumite culture evolved into the medieval monastic traditions, Ge’ez literary scholarship, and rock-hewn churches of later Horn of Africa kingdoms.',
    significance: 'Preserved ancient Ge’ez writing, liturgical chant, stone masonry traditions, and legal codes into the modern era.',
    keyArtifacts: ['Debre Damo Monastery', 'Ge’ez Illuminated Gospel Books', 'Ancient Terracing Systems'],
    tags: ['debre-damo', 'legacy', 'monasteries', 'geez-literature', 'preservation', 'history'],
    keyFact: 'The monastery of Debre Damo, built atop a sheer flat-topped mountain accessible only by climbing a leather rope, remains intact from late Axumite times.',
  },
];

export const AxumiteTimeline: React.FC<AxumiteTimelineProps> = ({
  userTopic = '',
  onSelectMilestoneForQuery,
  onSaveInsight,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeMilestoneId, setActiveMilestoneId] = useState<string | null>('axum-5');

  // Compute matched milestone based on user's active prompt/topic in AssistanceSystem
  const topicMatchedMilestone = useMemo(() => {
    if (!userTopic || userTopic.trim().length < 2) return null;
    const cleanTopic = userTopic.toLowerCase();

    return AXUMITE_MILESTONES.find((m) => {
      const inTitle = m.title.toLowerCase().includes(cleanTopic);
      const inSummary = m.summary.toLowerCase().includes(cleanTopic);
      const inDetails = m.details.toLowerCase().includes(cleanTopic);
      const inTags = m.tags.some((t) => t.toLowerCase().includes(cleanTopic) || cleanTopic.includes(t));
      const inFact = m.keyFact.toLowerCase().includes(cleanTopic);
      return inTitle || inSummary || inDetails || inTags || inFact;
    });
  }, [userTopic]);

  // Filtered timeline list
  const filteredMilestones = useMemo(() => {
    return AXUMITE_MILESTONES.filter((m) => {
      const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
      const matchesSearch =
        searchTerm === '' ||
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.titleGeez.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.period.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const currentMilestone = useMemo(() => {
    return AXUMITE_MILESTONES.find((m) => m.id === activeMilestoneId) || AXUMITE_MILESTONES[0];
  }, [activeMilestoneId]);

  const handleSaveMilestoneFact = (milestone: AxumiteMilestone) => {
    if (onSaveInsight) {
      onSaveInsight({
        title: `[Axumite Timeline Fact] ${milestone.title}`,
        type: 'assistance',
        content: `Period: ${milestone.period} (${milestone.yearCentury})\nGe'ez Title: ${milestone.titleGeez}\n\nSummary:\n${milestone.summary}\n\nKey Fact:\n${milestone.keyFact}\n\nArtifacts:\n${milestone.keyArtifacts.join(', ')}`,
        tags: ['axum-history', milestone.category, ...milestone.tags],
      });
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'architecture':
        return <Landmark className="w-4 h-4 text-amber-400" />;
      case 'coinage':
        return <Coins className="w-4 h-4 text-[#F3E5AB]" />;
      case 'rulers':
        return <Crown className="w-4 h-4 text-amber-300" />;
      case 'religion':
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
      case 'maritime':
        return <Ship className="w-4 h-4 text-blue-400" />;
      default:
        return <Compass className="w-4 h-4 text-[#C5A059]" />;
    }
  };

  return (
    <div className="bg-[#060606] border border-[#8E6D28]/30 p-5 space-y-6 shadow-2xl stela-glow animate-fade-in">
      
      {/* Timeline Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#8E6D28]/30 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 bg-[#8E6D28]/25 border border-[#C5A059]/50 text-[#F3E5AB] text-[10px] font-bold tracking-[0.2em] uppercase flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>CHRONICLES OF AXUM • ታሪካዊ መድረኻት ኣክሱም</span>
            </span>
            <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono">
              1,000+ Year Historical Timeline
            </span>
          </div>

          <h2 className="serif-luxury text-xl sm:text-2xl font-bold tracking-[0.12em] text-slate-100 uppercase gold-gradient">
            AXUMITE CIVILIZATION HISTORICAL MILESTONES
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed max-w-2xl">
            Explore key eras of monumental obelisks, sovereign gold coinage, King Ezana’s decrees, and Red Sea maritime commerce. Select any milestone to inject ancient history context into the Voice Concierge.
          </p>
        </div>

        {/* Quick Search & Category Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by keyword, ruler, coins..."
              className="w-full bg-[#080808] border border-[#8E6D28]/40 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-gray-500 font-mono focus:outline-none focus:border-[#C5A059]"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Contextual Fact Banner (Appears when voice prompt matches a milestone) */}
      {topicMatchedMilestone && (
        <div className="bg-gradient-to-r from-[#18130B] via-[#0D0B07] to-[#080808] border-2 border-[#C5A059] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_20px_rgba(197,160,89,0.3)] animate-fade-in">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-[#8E6D28]/30 border border-[#C5A059] text-[#F3E5AB] flex-shrink-0">
              <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[#F3E5AB] uppercase tracking-wider">
                  🎯 Contextual Ancient Fact Matched To Your Active Voice Query
                </span>
                <span className="px-2 py-0.5 bg-[#8E6D28] text-black text-[10px] font-extrabold uppercase font-mono">
                  {topicMatchedMilestone.period}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                <strong>{topicMatchedMilestone.title}:</strong> {topicMatchedMilestone.keyFact}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveMilestoneId(topicMatchedMilestone.id);
              if (onSelectMilestoneForQuery) {
                onSelectMilestoneForQuery(`Tell me more about ${topicMatchedMilestone.title} (${topicMatchedMilestone.period}) and its historical significance in Axumite history.`);
              }
            }}
            className="px-3.5 py-2 bg-[#8E6D28] hover:bg-[#C5A059] text-black font-extrabold text-xs uppercase tracking-wider flex items-center space-x-1.5 flex-shrink-0 shadow-md transition-all"
          >
            <Volume2 className="w-4 h-4 text-black" />
            <span>Ask Voice Assistant About This</span>
          </button>
        </div>
      )}

      {/* Category Pills Bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 border-b border-[#8E6D28]/20 no-scrollbar">
        {[
          { id: 'all', label: 'All Eras (ኵሉ መድረኻት)', icon: <Compass className="w-3.5 h-3.5" /> },
          { id: 'architecture', label: '🏛️ Architecture & Stelae', icon: <Landmark className="w-3.5 h-3.5" /> },
          { id: 'coinage', label: '🪙 Sovereign Coinage', icon: <Coins className="w-3.5 h-3.5" /> },
          { id: 'rulers', label: '👑 Rulers & Edicts', icon: <Crown className="w-3.5 h-3.5" /> },
          { id: 'religion', label: '⛪ Religion & Culture', icon: <BookOpen className="w-3.5 h-3.5" /> },
          { id: 'maritime', label: '🚢 Red Sea Maritime Trade', icon: <Ship className="w-3.5 h-3.5" /> },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center space-x-1.5 border transition-all ${
              selectedCategory === cat.id
                ? 'bg-[#8E6D28] border-[#C5A059] text-black shadow-[0_0_10px_rgba(197,160,89,0.4)]'
                : 'bg-[#080808] border-[#8E6D28]/30 text-gray-400 hover:text-slate-200 hover:border-[#8E6D28]'
            }`}
          >
            {cat.icon}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* MAIN TIMELINE STAGE: Interactive Node Line (Left) + Milestone Deep Detail Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Vertical Timeline Node Pathway (5 Cols) */}
        <div className="lg:col-span-5 space-y-3 relative before:absolute before:top-4 before:bottom-4 before:left-5 before:w-0.5 before:bg-gradient-to-b before:from-[#8E6D28] before:via-[#C5A059]/40 before:to-[#8E6D28]/10">
          {filteredMilestones.map((milestone, idx) => {
            const isActive = milestone.id === activeMilestoneId;
            const isMatchedByVoice = topicMatchedMilestone?.id === milestone.id;

            return (
              <div
                key={milestone.id}
                onClick={() => setActiveMilestoneId(milestone.id)}
                className={`relative pl-12 pr-4 py-3.5 border cursor-pointer transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#18130B] to-[#0B0906] border-2 border-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.3)]'
                    : isMatchedByVoice
                    ? 'bg-[#141009] border-2 border-amber-400 animate-pulse'
                    : 'bg-[#080808] border-[#8E6D28]/25 hover:border-[#8E6D28] hover:bg-[#0E0C08]'
                }`}
              >
                {/* Timeline Dot Node */}
                <div
                  className={`absolute left-3.5 top-5 -translate-x-1/2 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-[#C5A059] border-white shadow-[0_0_10px_rgba(197,160,89,0.8)]'
                      : 'bg-[#060606] border-[#8E6D28]'
                  }`}
                >
                  {isActive && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest">
                      {milestone.period}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getCategoryIcon(milestone.category)}
                      {isMatchedByVoice && (
                        <span className="px-1.5 py-0.2 bg-amber-500 text-black text-[9px] font-extrabold uppercase">
                          MATCH
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className={`text-xs font-bold ${isActive ? 'text-[#F3E5AB]' : 'text-slate-200'}`}>
                    {milestone.title}
                  </h4>

                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                    {milestone.summary}
                  </p>
                </div>
              </div>
            );
          })}

          {filteredMilestones.length === 0 && (
            <div className="p-8 text-center bg-[#080808] border border-[#8E6D28]/30 text-gray-500 text-xs">
              No historical milestones found matching your search term.
            </div>
          )}
        </div>

        {/* Right Column: Milestone Deep Detail Inspector (7 Cols) */}
        <div className="lg:col-span-7 bg-[#080808] border-2 border-[#8E6D28]/40 p-5 sm:p-6 space-y-5 stela-glow sticky top-4">
          
          <div className="flex items-start justify-between border-b border-[#8E6D28]/30 pb-4 gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-[#8E6D28]/30 border border-[#C5A059] text-[#F3E5AB] text-[10px] font-bold font-mono uppercase">
                  {currentMilestone.period}
                </span>
                <span className="text-xs text-amber-300 font-mono">
                  {currentMilestone.yearCentury}
                </span>
              </div>
              
              <h3 className="serif-luxury text-lg sm:text-xl font-bold text-[#F3E5AB] tracking-wide gold-gradient">
                {currentMilestone.title}
              </h3>

              <div className="text-xs text-amber-200/80 font-mono font-semibold">
                📜 {currentMilestone.titleGeez}
              </div>
            </div>

            <div className="p-2.5 bg-[#14110B] border border-[#8E6D28] rounded-sm">
              {getCategoryIcon(currentMilestone.category)}
            </div>
          </div>

          {/* Quick Highlight Fact Box */}
          <div className="p-4 bg-gradient-to-r from-[#14110B] via-[#0E0C08] to-[#080808] border border-[#8E6D28]/50 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-[#F3E5AB] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Key Historical Fact & Provenance</span>
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed font-sans">
              "{currentMilestone.keyFact}"
            </p>
          </div>

          {/* Detailed Narrative */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#F3E5AB] uppercase tracking-wider flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Historical Context & Narrative</span>
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed bg-[#050505] p-3.5 border border-[#8E6D28]/20 font-sans">
              {currentMilestone.details}
            </p>
          </div>

          {/* Global Significance */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#F3E5AB] uppercase tracking-wider flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Global Historical Significance</span>
            </h4>
            <p className="text-xs text-amber-200/90 leading-relaxed font-mono bg-[#0A0805] p-3 border border-[#8E6D28]/30">
              {currentMilestone.significance}
            </p>
          </div>

          {/* Key Artifacts & Evidence */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#F3E5AB] uppercase tracking-wider flex items-center space-x-1">
              <Landmark className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Archaeological Evidence & Key Artifacts</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentMilestone.keyArtifacts.map((art, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-[#14110B] border border-[#8E6D28]/40 text-xs text-gray-200 font-mono flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{art}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Inspector Footer Actions */}
          <div className="pt-4 border-t border-[#8E6D28]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => {
                if (onSelectMilestoneForQuery) {
                  onSelectMilestoneForQuery(`Tell me a detailed historical overview about ${currentMilestone.title} (${currentMilestone.period}) in Axumite history.`);
                }
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-[#8E6D28] via-[#F3E5AB] to-[#C5A059] text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-md hover:scale-105 transition-all"
            >
              <Volume2 className="w-4 h-4 text-black" />
              <span>Ask Voice Concierge About This Milestone</span>
            </button>

            <button
              onClick={() => handleSaveMilestoneFact(currentMilestone)}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#050505] hover:bg-[#14110B] border border-[#8E6D28]/50 text-[#F3E5AB] font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Save Milestone Fact</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
