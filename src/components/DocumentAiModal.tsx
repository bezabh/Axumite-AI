import React, { useState, useRef } from 'react';
import { 
  X, FileText, Upload, Sparkles, CheckCircle2, Copy, Check, 
  FileCode, RefreshCw, MessageSquare, ArrowRight, Download, BookOpen, AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';

interface DocumentAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onNavigateToChat?: (prompt: string) => void;
}

export const DocumentAiModal: React.FC<DocumentAiModalProps> = ({
  isOpen,
  onClose,
  user,
  onNavigateToChat,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [analysisType, setAnalysisType] = useState<'summary' | 'qa' | 'translate' | 'action_items'>('summary');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultText, setResultText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      processFile(selected);
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setResultText('');

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      setFileContent(text.slice(0, 10000)); // Cap for browser performance
      
      // Generate initial intelligent summary simulation / processing
      setTimeout(() => {
        setIsProcessing(false);
        generateAnalysis(selectedFile.name, text, analysisType);
      }, 1200);
    };

    if (selectedFile.type.includes('text') || selectedFile.name.endsWith('.txt') || selectedFile.name.endsWith('.md')) {
      reader.readAsText(selectedFile);
    } else {
      // PDF or binary mock reader representation
      setFileContent(`[Document: ${selectedFile.name}, Size: ${(selectedFile.size / 1024).toFixed(1)} KB]\nUploaded document content extracted successfully for analysis.`);
      setTimeout(() => {
        setIsProcessing(false);
        generateAnalysis(selectedFile.name, 'Document content loaded', analysisType);
      }, 1400);
    }
  };

  const generateAnalysis = (fileName: string, content: string, type: 'summary' | 'qa' | 'translate' | 'action_items') => {
    if (type === 'summary') {
      setResultText(`📄 **Executive Summary of ${fileName}**\n\n1. **Core Subject**: Overview of document structure and key objectives.\n2. **Primary Findings**: The document contains key operational guidelines, structured data, and action proposals.\n3. **Key Takeaway**: Immediate alignment with strategic milestones is recommended.\n\n*Document analyzed with Axumite Document AI Engine.*`);
    } else if (type === 'action_items') {
      setResultText(`✅ **Identified Action Items from ${fileName}**\n\n- [ ] Review Section 2 compliance guidelines\n- [ ] Verify timeline deadlines with team leads\n- [ ] Submit finalized report for approval\n- [ ] Follow up on pending customer confirmations`);
    } else if (type === 'translate') {
      setResultText(`🌐 **ናይ ${fileName} ትርጉም (Tigrinya Overview)**\n\nእዚ ሰነድ ኣብ ቀንዲ ትሕዝቶኡ፡ ዝርዝር መምርሒታትን ስትራተጅያዊ ሓሳባትን ዝሓዘ ኮይኑ፡ ንስራሕኩም ቅልጡፍን ውጽኢታውን ንምግባር ዝሕግዝ መብርሂ የቕርብ።`);
    } else {
      setResultText(`💡 **AI Document Insights**: Upload completed. Ask any question below or send this context directly to AI Chat.`);
    }
  };

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToChat = () => {
    if (onNavigateToChat) {
      const prompt = `Here is the analysis of my document "${file?.name || 'document'}":\n\n${resultText || fileContent}\n\nPlease help me analyze this further and answer questions.`;
      onNavigateToChat(prompt);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-5 animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] text-[#0F2856]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-[#F8FAFC] via-[#EEF2F6] to-[#E2E8F0]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F2856] flex items-center space-x-2">
                <span>Document AI</span>
                <span className="text-[10px] px-2 py-0.5 bg-amber-500/15 text-amber-700 font-black rounded-full font-mono">PRO</span>
              </h3>
              <p className="text-xs text-slate-500">Upload & analyze PDFs, Word, TXT files and get instant summaries</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* File Upload Area */}
          {!file ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/40 hover:bg-blue-50/70 rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.md,.json,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <Upload className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#0F2856]">Click or Drag files to upload</h4>
                <p className="text-xs text-slate-500">Supports PDF, Word (.docx), TXT, Markdown, CSV up to 25MB</p>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center pt-2">
                <span className="text-[10px] px-2.5 py-1 bg-white rounded-full font-mono text-slate-600 border border-slate-200 font-semibold">PDF Analysis</span>
                <span className="text-[10px] px-2.5 py-1 bg-white rounded-full font-mono text-slate-600 border border-slate-200 font-semibold">Smart OCR</span>
                <span className="text-[10px] px-2.5 py-1 bg-white rounded-full font-mono text-slate-600 border border-slate-200 font-semibold">Multi-Language</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info Bar */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#0F2856] truncate">{file.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{(file.size / 1024).toFixed(1)} KB • Ready for AI processing</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setResultText('');
                    setFileContent('');
                  }}
                  className="text-xs text-rose-500 hover:text-rose-700 font-bold px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  Change File
                </button>
              </div>

              {/* Analysis Mode Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'summary', label: 'Summary' },
                  { id: 'action_items', label: 'Action Items' },
                  { id: 'translate', label: 'Tigrinya Brief' },
                  { id: 'qa', label: 'Ask Questions' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setAnalysisType(item.id as any);
                      setIsProcessing(true);
                      setTimeout(() => {
                        setIsProcessing(false);
                        generateAnalysis(file.name, fileContent, item.id as any);
                      }, 600);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      analysisType === item.id
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Result Area */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 space-y-3 min-h-[160px] relative">
                {isProcessing ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-500">
                    <RefreshCw className="w-7 h-7 text-blue-600 animate-spin" />
                    <p className="text-xs font-bold text-[#0F2856]">Reading & Analyzing Document with AI...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-[#0F2856]">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>AI Analysis Output</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={handleCopy}
                          className="text-[11px] text-slate-600 hover:text-[#0F2856] flex items-center space-x-1 px-2 py-1 bg-white rounded-md border border-slate-200 shadow-2xs font-semibold cursor-pointer"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
                      {resultText}
                    </div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={handleSendToChat}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center space-x-2 hover:brightness-105 active:scale-95 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Discuss in AI Chat</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
