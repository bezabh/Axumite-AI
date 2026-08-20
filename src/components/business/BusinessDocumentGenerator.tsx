import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, Sparkles, Download, Copy, Check, Printer, 
  RefreshCw, ShieldCheck, DollarSign, Send, ArrowRight 
} from 'lucide-react';
import { BusinessDocument } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export const BusinessDocumentGenerator: React.FC = () => {
  const { language } = useLanguage();
  const [documentType, setDocumentType] = useState<'proposal' | 'invoice' | 'contract_nda' | 'pitch_deck_outline' | 'executive_report' | 'business_email'>('proposal');
  const [title, setTitle] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientOrg, setRecipientOrg] = useState('');
  const [senderName, setSenderName] = useState('Axumite Sovereign Solutions');
  const [senderOrg, setSenderOrg] = useState('Axumite Enterprise');
  const [totalAmount, setTotalAmount] = useState('4500');
  const [currency, setCurrency] = useState('USD');
  const [detailsPrompt, setDetailsPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [document, setDocument] = useState<BusinessDocument | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/business/document-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType,
          title,
          recipientName,
          recipientOrg,
          senderName,
          senderOrg,
          totalAmount: totalAmount ? Number(totalAmount) : undefined,
          currency,
          detailsPrompt,
        }),
      });
      const data = await res.json();
      if (data.success && data.document) {
        setDocument(data.document);
      }
    } catch (err) {
      console.error('Doc generator error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!document) return;
    const textToCopy = document.contentMarkdownEn;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase mb-1">
          <FileText className="w-4 h-4" />
          <span>Professional Contract & Document Synthesizer</span>
        </div>
        <h3 className="text-2xl font-bold text-stone-100">
          {language === 'ti' ? 'ወግዓዊ ናይ ንግዲ ሰነዳት መመንጨዊ' : language === 'de' ? 'Professioneller Geschäftsdokument-Generator' : 'AI Business Document & Contract Generator'}
        </h3>
        <p className="text-stone-400 text-sm mt-1 max-w-2xl">
          {language === 'ti'
            ? 'ናይ ንግዲ ፕሮፖዛል፡ ኢንቮይስ (ሕሳብ መሕተቲ)፡ ውዕል (NDA/Contract)፡ ናይ ኢንቨስትመንት ፒች ዲክ ብAI ብዝለዓለ ደረጃ ኣዳልዉ።'
            : language === 'de'
            ? 'Erstellen Sie verbindliche Angebote, Rechnungen, Geheimhaltungsvereinbarungen (NDA) und Pitch-Decks.'
            : 'Generate institutional invoices, client proposals, non-disclosure agreements, executive reports, and formal business letters.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
              {language === 'ti' ? 'ዓይነት ሰነድ' : language === 'de' ? 'Dokumenttyp' : 'Document Type'}
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as any)}
              className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 text-stone-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
            >
              <option value="proposal">Client Business Proposal (ፕሮፖዛል)</option>
              <option value="invoice">Commercial Invoice (ኢንቮይስ)</option>
              <option value="contract_nda">NDA / Service Agreement (ውዕል)</option>
              <option value="pitch_deck_outline">Pitch Deck Outline (ፒች ዲክ)</option>
              <option value="executive_report">Executive Report (ጸብጻብ)</option>
              <option value="business_email">Formal Business Email (ኢሜይል)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
              {language === 'ti' ? 'ኣርእስቲ ሰነድ' : language === 'de' ? 'Dokumenttitel' : 'Document Title'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Enterprise Cloud & AI Integration Proposal 2026..."
              className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 text-stone-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
              {language === 'ti' ? 'ተቐባሊ (Client / Partner)' : language === 'de' ? 'Empfänger Name' : 'Recipient / Client'}
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Samuel Kibreab"
              className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 text-stone-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
              {language === 'ti' ? 'ትካል ተቐባሊ' : language === 'de' ? 'Empfänger Organisation' : 'Recipient Company'}
            </label>
            <input
              type="text"
              value={recipientOrg}
              onChange={(e) => setRecipientOrg(e.target.value)}
              placeholder="e.g. Red Sea Trading Group"
              className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 text-stone-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
              {language === 'ti' ? 'መጠን ገንዘብ (እንተሃልዩ)' : language === 'de' ? 'Betrag / Währung' : 'Amount / Fee (Optional)'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="4500"
                className="w-2/3 bg-stone-950 border border-stone-700 focus:border-amber-500 text-stone-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
              />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-1/3 bg-stone-950 border border-stone-700 text-stone-100 rounded-xl px-2 py-2.5 text-xs focus:outline-none"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="ERN">ERN (ናቕፋ)</option>
                <option value="ETB">ETB (ብር)</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-stone-300 uppercase mb-1">
              {language === 'ti' ? 'ዝርዝር ረቋሒታት ወይ ዓንቀጻት' : language === 'de' ? 'Spezifische Klauseln / Details' : 'Key Deliverables, Terms & Clauses'}
            </label>
            <textarea
              rows={2}
              value={detailsPrompt}
              onChange={(e) => setDetailsPrompt(e.target.value)}
              placeholder="e.g. Include 12-month technical support, 50% advance payment terms, and confidentiality clauses..."
              className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 text-stone-100 rounded-xl px-4 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !title.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Drafting Document...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Official Document</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Document Preview */}
      {document && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900/90 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">{document.id} • {document.documentType}</span>
              <h4 className="text-2xl font-bold text-stone-100 mt-1">{document.title}</h4>
              <p className="text-stone-400 text-xs">
                To: {document.recipientName} {document.recipientOrg && `(${document.recipientOrg})`} • Date: {new Date(document.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-lg border border-stone-700"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-stone-400" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-lg border border-stone-700"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Document Content Rendering */}
          <div className="bg-stone-950 p-6 md:p-8 rounded-xl border border-stone-800 text-stone-200 text-sm whitespace-pre-wrap font-sans leading-relaxed space-y-4">
            {document.contentMarkdownEn}

            {document.contentMarkdownTi && (
              <div className="pt-6 border-t border-stone-800/80 font-geez text-amber-100/90">
                {document.contentMarkdownTi}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
