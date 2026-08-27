import React, { useState } from 'react';
import { 
  X, FileText, Scale, Shield, Sparkles, BookOpen, 
  HelpCircle, ChevronRight, CheckCircle2, AlertTriangle, FileSignature
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LegalAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPromptForChat?: (prompt: string) => void;
}

export const LegalAdvisorModal: React.FC<LegalAdvisorModalProps> = ({
  isOpen,
  onClose,
  onSelectPromptForChat,
}) => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('commercial');

  if (!isOpen) return null;

  const LEGAL_CATEGORIES = [
    {
      id: 'commercial',
      title: language === 'ti' ? 'ናይ ንግዲ ምዝገባን ሕግን' : 'Commercial & Business Law',
      description: language === 'ti' 
        ? 'ናይ ንግዲ ፍቓድ ምውጻእ፣ ውዕል ምምስራት፣ ሕጊ ግብሪን ቀረጽን' 
        : 'Business registration, partnership agreements, taxation rules and licensing.',
      prompt: language === 'ti'
        ? 'እባክኻ ኣብ ትግራይን ዲያስፖራን ንግዲ ንምጅማር ዘድልዩ ሕጋዊ ቅጥዕታት፣ ምዝገባን ናይ ግብሪ ሕግታትን ብዝርዝር ግለጸለይ።'
        : 'Please provide a detailed legal overview of commercial registration requirements, trade licenses, and tax obligations.',
    },
    {
      id: 'tenancy',
      title: language === 'ti' ? 'ናይ ገዛ ክራይ ውዕልን ሕግን' : 'Tenancy & Property Contracts',
      description: language === 'ti'
        ? 'ሕጋዊ ውዕል ክራይ ገዛ፣ መሰል ተኻረይን ኣኻረይን፣ ቅጥዒ ውዕል'
        : 'Standard residential/commercial rental leases, landlord & tenant rights and clauses.',
      prompt: language === 'ti'
        ? 'ንክራይ ገዛ ዝኸውን ሕጋዊ ውዕል (Tenancy Agreement Template) ብትግርኛን እንግሊዝን መሰላት ክልቲኦም ወገናት ዝሓለወ ኣዳልወለይ።'
        : 'Draft a standard, legally protective residential tenancy agreement template in Tigrinya and English.',
    },
    {
      id: 'diaspora',
      title: language === 'ti' ? 'ናይ ዲያስፖራ ሕግን ኢንቨስትመንትን' : 'Diaspora Civic & Investment Regulations',
      description: language === 'ti'
        ? 'ሕጋዊ ወከልና (Power of Attorney)፣ ጉምሩክ፣ ሕጋዊ ሰነዳት ምርግጋጽ'
        : 'Power of attorney, consular notarizations, import customs, and diaspora investment incentives.',
      prompt: language === 'ti'
        ? 'ናይ ዲያስፖራ ሕጋዊ ወከልና (Power of Attorney) ከመይ ጌሩ ይዳሎን ኣብ ኤምባሲ ይረጋገጽን? ዝርዝር ቅጥዕታት ኣረድኣኒ።'
        : 'Explain the legal procedure and template for setting up a validated Power of Attorney through Eritrean diplomatic missions.',
    },
    {
      id: 'contract-review',
      title: language === 'ti' ? 'ምግምጋም ውዕል (Contract Review)' : 'AI Contract Review & Risk Assessment',
      description: language === 'ti'
        ? 'ናይ ዝኾነ ውዕል ጽሑፍ ምምርማር፣ ዘስግኡ ዓንቀጻት ምልላይ'
        : 'Upload or paste legal clauses to identify liabilities, ambiguity, and protective counter-clauses.',
      prompt: language === 'ti'
        ? 'ኣነ ዘቕርበልካ ሕጋዊ ውዕል መርሚርካ፣ ዘስግኡ ዓንቀጻትን ንዓይ ዝጠቕሙ መአረምታታትን ሓብረኒ።'
        : 'I will provide a contract or clause. Please audit it for potential liabilities, unfair terms, and suggest protective revisions.',
    },
  ];

  const handleAskLegalAi = (prompt: string) => {
    if (onSelectPromptForChat) {
      onSelectPromptForChat(prompt);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#0E0F1A] border-2 border-purple-600/50 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#141324] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/50 text-purple-300 flex items-center justify-center shadow-md">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <span>{language === 'ti' ? 'ኣማኻሪ ሕጊ (Legal & Civic Advisor AI)' : 'Legal & Civic Advisor AI'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'ti' ? 'ናይ ንግዲ፣ ውዕላት፣ ክራይ ገዛን ዲያስፖራን ሕጋዊ ሓበሬታ' : 'Commercial laws, tenancy contracts, diaspora regulations & AI contract audit'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-amber-950/30 border-b border-amber-500/20 px-4 py-2 flex items-center space-x-2 text-xs text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {language === 'ti'
              ? 'መዘኻኸሪ፡ እዚ ንሓበሬታን ምኽርን ዝሕግዝ AI ኮይኑ ወግዓዊ ፍርዳዊ ምኽሪ ኣብ ቤት ፍርዲ ወይ ምስ ሕጋዊ ጠበቓ ክረጋገጽ ኣለዎ።'
              : 'Disclaimer: AI legal guidance is informational. Always verify official binding documents with certified legal counsel.'}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {LEGAL_CATEGORIES.map((cat) => (
              <div 
                key={cat.id}
                className="p-4 rounded-xl bg-[#141526] border border-slate-800 hover:border-purple-500/50 transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <FileSignature className="w-4 h-4 text-purple-400 shrink-0" />
                    <h4 className="font-bold text-sm text-slate-100">{cat.title}</h4>
                  </div>
                  <button
                    onClick={() => handleAskLegalAi(cat.prompt)}
                    className="px-3 py-1.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                    <span>{language === 'ti' ? 'ብ AI ሕተት' : 'Ask AI'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  {cat.description}
                </p>
              </div>
            ))}
          </div>

          {/* Direct Prompt Box */}
          <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-2">
            <h4 className="text-sm font-bold text-purple-300 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>{language === 'ti' ? 'ናይ ብሕትኻ ሕጋዊ ሕቶ ምሕታት' : 'Custom Legal & Statutory Query'}</span>
            </h4>
            <p className="text-xs text-slate-300">
              {language === 'ti'
                ? 'ዝኾነ ዓይነት ፍሉይ ናይ ሕጊ ሕቶ ወይ ውዕል ኣእቲኻ ካብ ኣክሱማይት AI መልሲ ርኸብ።'
                : 'Ask any specific legal, contract, or regulatory question in Tigrinya or English.'}
            </p>
            <button
              onClick={() => {
                const prompt = language === 'ti' 
                  ? "ሰላም ኣክሱማይት AI፣ ናይ ሕጊ ምኽሪ ክሓተካ ደልየ ኣለኹ..."
                  : "Hello Axumite AI, I need expert legal guidance on...";
                handleAskLegalAi(prompt);
              }}
              className="w-full mt-2 py-2.5 bg-[#1E1B38] hover:bg-[#28244D] border border-purple-500/40 text-purple-200 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 cursor-pointer transition-all"
            >
              <span>{language === 'ti' ? 'ሕጋዊ ምኽሪ ዕላል ጀምር' : 'Start Legal Chat Session'}</span>
              <ChevronRight className="w-4 h-4 text-purple-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
