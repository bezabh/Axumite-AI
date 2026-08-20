import React, { useState } from 'react';
import { 
  Mic, X, Search, Sparkles, Navigation, Volume2, Shield, 
  Layers, HardDrive, Compass, Check, ArrowRight, BookOpen, 
  Terminal, Zap, MessageSquare, Play, HelpCircle
} from 'lucide-react';

interface VoiceCommandItem {
  category: 'navigation' | 'control' | 'cultural' | 'security';
  tigrinya: string;
  phonetic: string;
  english: string;
  actionDesc: string;
  actionDescTi: string;
  samplePrompt: string;
  tag: string;
}

interface VoiceCommandsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (commandText: string) => void;
}

const VOICE_COMMANDS: VoiceCommandItem[] = [
  // 1. Navigation & Tab Switching
  {
    category: 'navigation',
    tigrinya: 'ክፈት ቻት / ናብ ቻት ኪድ',
    phonetic: 'Kfet Chat / Nab Chat Kid',
    english: 'Open Chat / Go to Chat',
    actionDesc: 'Navigates directly to Obelisk AI Conversational Chat console.',
    actionDescTi: 'ቀጥታ ናብ Obelisk AI ናይ ምይይጥ ገጽ ይወስደኩም።',
    samplePrompt: 'ክፈት ቻት',
    tag: 'Navigation',
  },
  {
    category: 'navigation',
    tigrinya: 'ክፈት ትርጉም / ናብ ትርጉም',
    phonetic: 'Kfet Tirgum / Nab Tirgum',
    english: 'Open Translator / Go to Translate',
    actionDesc: 'Opens the Tigrinya, Ge\'ez & International Language AI Translator.',
    actionDescTi: 'ናይ ትግርኛ፡ ግዕዝን ኣህጉራውያን ቋንቋታትን ናይ ትርጉም ገጽ ይኸፍት።',
    samplePrompt: 'ክፈት ትርጉም',
    tag: 'Navigation',
  },
  {
    category: 'navigation',
    tigrinya: 'ክፈት ምስሊ / ናይ ምስሊ ስቱድዮ',
    phonetic: 'Kfet Misli / Nay Misli Studio',
    english: 'Open Vision Studio / Image Studio',
    actionDesc: 'Switches to Multimodal Vision Studio for artifact & image analysis.',
    actionDescTi: 'ናይ ምስሊ ትንታነን ስቱድዮን ገጽ ይኸፍት።',
    samplePrompt: 'ክፈት ምስሊ',
    tag: 'Navigation',
  },
  {
    category: 'navigation',
    tigrinya: 'ክፈት Prompt Forge / ናይ ስእሊ ፎርጅ',
    phonetic: 'Kfet Prompt Forge',
    english: 'Open Prompt Forge / AI Art Engine',
    actionDesc: 'Opens 8K Photorealistic Prompt Generation engine for Midjourney & Flux.',
    actionDescTi: 'ናይ 8K ፎቶሪያሊስቲክ ምስሊ መፍጠሪ ፕሮምፕት ስቱድዮ ይኸፍት።',
    samplePrompt: 'ክፈት Prompt Forge',
    tag: 'Navigation',
  },
  {
    category: 'navigation',
    tigrinya: 'ክፈት ታሪክ / ናይ ኣክሱም ታሪክ',
    phonetic: 'Kfet Tarik / Nay Axum Tarik',
    english: 'Open Axumite Heritage Timeline',
    actionDesc: 'Displays the chronological Axumite Kingdom Historical Timeline.',
    actionDescTi: 'ናይ ጥንታዊ መንግስቲ ኣክሱም ታሪካዊ መድረኻት ይኸፍት።',
    samplePrompt: 'ክፈት ታሪክ',
    tag: 'Navigation',
  },
  {
    category: 'navigation',
    tigrinya: 'ክፈት ፕሮፋይል / ኣካውንተይ',
    phonetic: 'Kfet Profile / Account-ey',
    english: 'Open Profile / Account Settings',
    actionDesc: 'Opens the User Profile, PRO Subscription, and settings panel.',
    actionDescTi: 'ናይ ተጠቃሚ ፕሮፋይልን ናይ ፕሮ ክፍሊትን ገጽ ይኸፍት።',
    samplePrompt: 'ክፈት ፕሮፋይል',
    tag: 'Navigation',
  },
  {
    category: 'navigation',
    tigrinya: 'ክፈት ደሕንነት / ናይ ቫልት ደሕንነት',
    phonetic: 'Kfet Dehninet / Nay Vault Dehninet',
    english: 'Open Security Center / Vault',
    actionDesc: 'Opens device encryption, biometric lock & sovereign vault settings.',
    actionDescTi: 'ናይ ደሕንነት፡ ባዮሜትሪክስን ምስጢራዊ ቫልትን መቆጻጸሪ ይኸፍት።',
    samplePrompt: 'ክፈት ደሕንነት',
    tag: 'Navigation',
  },
  {
    category: 'navigation',
    tigrinya: 'ክፈት ክፍሊት / ፕሮ ምዕባለ',
    phonetic: 'Kfet Kiflit / PRO Miebale',
    english: 'Open Payment / Upgrade PRO',
    actionDesc: 'Launches Bank of Eritrea, Nakfa, Stripe & Diaspora payment portal.',
    actionDescTi: 'ናይ ኤርትራ ባንክ፡ ናቕፋ፡ ስትራይፕን ዓለምለኸ ክፍሊትን መደብ ይኸፍት።',
    samplePrompt: 'ክፈት ክፍሊት',
    tag: 'Navigation',
  },

  // 2. Audio & Interactive Controls
  {
    category: 'control',
    tigrinya: 'ደው ኣብል / ድምጺ ኣጥፍእ / ስቕ በል',
    phonetic: 'Dew Abil / Dimtsi Atfie / Siki Bel',
    english: 'Stop Audio / Mute Speech',
    actionDesc: 'Immediately pauses and stops active Tigrinya neural voice playback.',
    actionDescTi: 'ዝስምዕ ዘሎ ናይ AI ድምጺ ብቕጽበት ደው የብሎ።',
    samplePrompt: 'ደው ኣብል',
    tag: 'Audio Control',
  },
  {
    category: 'control',
    tigrinya: 'ደግመሉ / ድምጺ ደግም / ዳግማይ ኣስምዓኒ',
    phonetic: 'Degmelu / Dimtsi Degim / Dagmai Asmeani',
    english: 'Replay Audio / Repeat Answer',
    actionDesc: 'Synthesizes and replays the current AI response via Tigrinya TTS audio.',
    actionDescTi: 'ነቲ ዝተዋህበ ናይ AI መልሲ ብድምጺ ደጊሙ የቃልሕ።',
    samplePrompt: 'ደግመሉ',
    tag: 'Audio Control',
  },
  {
    category: 'control',
    tigrinya: 'ኣጽሪ / ጽረዮ / ዳግማይ ጀምር',
    phonetic: 'Atsri / Tsireyo / Dagmai Jemir',
    english: 'Clear / Reset Voice Input',
    actionDesc: 'Clears current voice transcript, assistant output, and resets input box.',
    actionDescTi: 'ዝተቐድሐ ድምጽን ናይ ጽሑፍ መእተውን ብምሉእ የጽሪ።',
    samplePrompt: 'ኣጽሪ',
    tag: 'Control',
  },
  {
    category: 'control',
    tigrinya: 'ዕቘሮ / ኣብ ቫልት ኣቐምጦ',
    phonetic: 'Ikoro / Ab Vault Akemto',
    english: 'Save Insight / Store to Vault',
    actionDesc: 'Saves current response into local offline-encrypted insights vault.',
    actionDescTi: 'ነዚ መልሲ ኣብ ውሽጢ ውልቃዊ ምስጢራዊ ቫልት የቐምጦ።',
    samplePrompt: 'ዕቘሮ',
    tag: 'Vault',
  },

  // 3. Cultural & Language Inquiries
  {
    category: 'cultural',
    tigrinya: 'ብትግርኛ ተዛረበኒ',
    phonetic: 'Bi-Tigrinya Tezarebeni',
    english: 'Speak to me in Tigrinya',
    actionDesc: 'Instructs AI to converse purely in rich, culturally authentic Tigrinya.',
    actionDescTi: 'AI ብጽሩይን ጥዑምን ቋንቋ ትግርኛ ክምልሰልኩም ይእዝዞ።',
    samplePrompt: 'ብትግርኛ ተዛረበኒ። ከመይ ኣለኻ? ሎሚ እንታይ ክትሕግዘኒ ትኽእል?',
    tag: 'Language',
  },
  {
    category: 'cultural',
    tigrinya: 'ብግዕዝ ፊደል ተርጉመልኝ',
    phonetic: 'Bi-Ge\'ez Fidel Tergumelign',
    english: 'Translate to Ge\'ez Fidel Script',
    actionDesc: 'Generates ancient Ge\'ez script translation with pronunciation & phonetics.',
    actionDescTi: 'ናብ ጥንታዊ ግዕዝ ፊደል ምስ ናይ ድምጺ ኣደማምጻ ይትርጉም።',
    samplePrompt: 'ብግዕዝ ፊደል ተርጉመልኝ: "Peace and eternal glory to the kingdom of Axum"',
    tag: 'Heritage',
  },
  {
    category: 'cultural',
    tigrinya: 'ብዛዕባ ንጉስ እዛና ኣብርሃለይ',
    phonetic: 'Bizaeba Nigus Ezana Abrihaley',
    english: 'Explain King Ezana of Axum',
    actionDesc: 'Provides deep historical insight into King Ezana and the 4th-century trilingual inscription.',
    actionDescTi: 'ብዛዕባ ዓብዪ ንጉስ እዛናን ናይ 3-ቋንቋታት ታሪካዊ እምኒ ኣክሱምን ይገልጽ።',
    samplePrompt: 'ብትግርኛ ብዛዕባ ንጉስ እዛና፡ ዓበይቲ ዓወታቱን ሰነድ ኣክሱምን ኣብርሃለይ።',
    tag: 'History',
  },
  {
    category: 'cultural',
    tigrinya: 'ብዛዕባ ሓወልቲ ኣክሱም ንገረኒ',
    phonetic: 'Bizaeba Hawelti Axum Negereni',
    english: 'Tell me about Axum Obelisks',
    actionDesc: 'Details the megalithic architecture, granite quarries, and weight of Axum stelae.',
    actionDescTi: 'ብዛዕባ ክብደትን ምህንድስናን ዓበይቲ ሓወልትታት ኣክሱም ይዛረብ።',
    samplePrompt: 'ብትግርኛ ብዛዕባ ምህንድስና፡ ክብደትን ኣሰራርሓን ሓወልቲ ኣክሱም ተዛረበኒ።',
    tag: 'Architecture',
  },
  {
    category: 'cultural',
    tigrinya: 'ናይ ስእሊ Prompt ፍጠርለይ',
    phonetic: 'Nay Sili Prompt Fiterley',
    english: 'Create AI Image Prompt',
    actionDesc: 'Directs AI to craft an 8K cinematic image generation prompt for Midjourney.',
    actionDescTi: 'ን Midjourney ዝኸውን 8K ናይ ምስሊ መፍጠሪ መምርሒ የዳልወልኩም።',
    samplePrompt: 'ብትግርኛ ቋንቋ 8K Midjourney Image Prompt ን ወርቃዊ ዘውዲ ኣክሱም ኣዳሉወለይ።',
    tag: 'Creative AI',
  },

  // 4. Security & Offline
  {
    category: 'security',
    tigrinya: 'ኦፍላይን ሓበሬታ ሕተተኒ',
    phonetic: 'Offline Habereyta Hititeni',
    english: 'Query Offline Heritage Database',
    actionDesc: 'Retrieves verified proverbs, landmarks, and dictionaries without internet connection.',
    actionDescTi: 'ብዘይ ኢንተርነት ዝሰርሕ ናይ ትግርኛ ምስላታትን ታሪካዊ ሓበሬታን የቕርብ።',
    samplePrompt: 'ናይ ትግርኛ ጥንታዊ ምስላታትን ትርጉሞምን ንገረኒ።',
    tag: 'Offline',
  },
  {
    category: 'security',
    tigrinya: 'ደሕንነትን ቫልትን መርምር',
    phonetic: 'Dehninetn Vaultn Mermir',
    english: 'Check Security & Vault Status',
    actionDesc: 'Audits hardware encryption status, local vault bytes, and PIN authentication locks.',
    actionDescTi: 'ናይ ውሽጢ መሳርሒ ዕቝባን ምስጢራዊ ቁልፍን የረጋግጽ።',
    samplePrompt: 'ደሕንነት መርምር',
    tag: 'Security',
  },
];

export const VoiceCommandsModal: React.FC<VoiceCommandsModalProps> = ({
  isOpen,
  onClose,
  onExecuteCommand,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const filteredCommands = VOICE_COMMANDS.filter((cmd) => {
    const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
    const matchesSearch = 
      cmd.tigrinya.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.phonetic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.actionDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.actionDescTi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-[#09080D] border border-[#8E6D28]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-200"
      >
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#141009] via-[#1F170D] to-[#0D0B12] p-5 border-b border-[#8E6D28]/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shrink-0 shadow-inner">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-amber-300 font-serif tracking-wide">
                  ናይ ድምጺ ትእዛዛት መምርሒ
                </h2>
                <span className="text-[10px] bg-amber-400/15 border border-amber-400/30 text-amber-200 px-2 py-0.5 rounded-full font-mono font-bold">
                  CHEAT SHEET
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Voice Commands Cheat Sheet • Control AXUMITE AI via Tigrinya & English Speech
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#1A1624] hover:bg-[#282138] border border-[#44355A] text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 bg-[#0E0C14] border-b border-[#8E6D28]/20 space-y-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-amber-400/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ትእዛዝ ድለይ (Search Tigrinya or English voice commands)..."
              className="w-full bg-[#07060A] border border-[#8E6D28]/30 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-gray-500 focus:outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { id: 'all', label: 'ኩሎም (All)', icon: Layers },
              { id: 'navigation', label: 'ምምራሕ (Navigation)', icon: Navigation },
              { id: 'control', label: 'ምቁጽጻር (Controls)', icon: Volume2 },
              { id: 'cultural', label: 'ባህልን ቋንቋን (Heritage & AI)', icon: Sparkles },
              { id: 'security', label: 'ደሕንነት (Security & Vault)', icon: Shield },
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/60 shadow-sm'
                      : 'bg-[#15121F] hover:bg-[#1E192D] text-gray-400 border border-[#2D253E]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Commands Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-gray-500 space-y-2">
              <HelpCircle className="w-10 h-10 text-gray-600 mx-auto" />
              <p className="text-xs">ዝተረኽበ ናይ ድምጺ ትእዛዝ የለን (No voice commands matched search query)</p>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => (
              <div
                key={idx}
                className="bg-[#0F0D17] hover:bg-[#141120] border border-[#8E6D28]/25 hover:border-[#8E6D28]/60 rounded-2xl p-4 transition-all space-y-3 group shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  
                  {/* Left: Tigrinya & English Command Name */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-black text-amber-300 font-serif">
                        {cmd.tigrinya}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#1C1629] text-amber-200/90 border border-[#3C2F54]">
                        {cmd.tag}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px]">
                      <span className="text-gray-400 font-mono">
                        "{cmd.phonetic}"
                      </span>
                      <span className="text-gray-600">&bull;</span>
                      <span className="text-blue-300 font-medium">
                        "{cmd.english}"
                      </span>
                    </div>
                  </div>

                  {/* Right: Quick Action Buttons */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => {
                        onExecuteCommand(cmd.samplePrompt);
                        onClose();
                      }}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-[#8E6D28] to-[#C5A059] hover:brightness-110 active:scale-95 text-black font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-black" />
                      <span>ፈትኖ (Run)</span>
                    </button>
                  </div>

                </div>

                {/* Description & Usage */}
                <div className="pt-2 border-t border-[#231C32] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="text-gray-300">
                    <span className="text-[10px] text-amber-400/80 font-bold block uppercase tracking-wider">
                      ዕላማ (Action):
                    </span>
                    <p className="text-[11px] leading-relaxed text-slate-300 mt-0.5 font-sans">
                      {cmd.actionDescTi}
                    </p>
                  </div>

                  <div className="text-gray-400 font-sans">
                    <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">
                      English Details:
                    </span>
                    <p className="text-[11px] leading-relaxed text-gray-400 mt-0.5">
                      {cmd.actionDesc}
                    </p>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Modal Footer Info */}
        <div className="p-4 bg-[#0A0810] border-t border-[#8E6D28]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Click <strong>ፈትኖ (Run)</strong> on any command to test it instantly!</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-[#171322] hover:bg-[#231D33] border border-[#3C2F54] text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            ዕጾ (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
