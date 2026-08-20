import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Download, Printer, ShieldCheck, Share2, Sparkles } from 'lucide-react';
import { Certificate } from '../../types';

interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
  preferredLanguage?: 'en' | 'ti';
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
  preferredLanguage = 'ti',
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          className="relative w-full max-w-4xl bg-zinc-950 border border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 flex flex-col"
          id="certificate-modal-container"
        >
          {/* Top Actions Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-bold text-zinc-100">
                {preferredLanguage === 'ti' ? 'ወግዓዊ ናይ ብቕዓት ምስክር ወረቐት' : 'Official Verified Certificate of Achievement'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-colors"
                id="print-cert-btn"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{preferredLanguage === 'ti' ? 'ሕተም / ኣውርድ' : 'Print / Save PDF'}</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Certificate Frame - Gold Trimmed Luxury Document */}
          <div
            ref={certRef}
            className="relative bg-gradient-to-b from-[#14120a] via-zinc-950 to-[#14120a] border-4 border-double border-amber-500/70 rounded-2xl p-6 sm:p-12 text-center space-y-6 shadow-2xl overflow-hidden print:border-amber-600"
          >
            {/* Background watermark seal */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <Award className="w-96 h-96 text-amber-400" />
            </div>

            {/* Header / Seal */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-mono uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                Axumite Sovereign Academy of Advanced AI
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500">
                CERTIFICATE OF ACADEMIC DISTINCTION
              </h1>
              <p className="text-xs text-amber-400/80 font-serif italic">
                ናይ ብቕዓትን ጽንዓትን ወግዓዊ ምስክር ወረቐት
              </p>
            </div>

            {/* Body */}
            <div className="space-y-4 max-w-2xl mx-auto py-2">
              <p className="text-xs text-zinc-400 uppercase tracking-wider">This is to officially certify that</p>
              
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 underline decoration-amber-500/60 underline-offset-8">
                {certificate.studentName || 'Becky Love (Sovereign Scholar)'}
              </h2>

              <p className="text-xs text-zinc-300 leading-relaxed pt-2">
                has demonstrated exceptional academic mastery, rigorous problem-solving competence, and successfully passed the comprehensive examination with a score of{' '}
                <strong className="text-amber-400">{certificate.scorePercent}% ({certificate.badgeLevel})</strong> in the course:
              </p>

              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-zinc-100">
                  {certificate.courseTitleEn}
                </h3>
                <p className="text-xs text-amber-400 font-serif">
                  {certificate.courseTitleTi}
                </p>
              </div>
            </div>

            {/* Footer Signature & Verification Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-amber-500/30 text-xs text-zinc-400 items-end">
              <div className="text-center sm:text-left space-y-1">
                <div className="font-serif italic text-amber-300 text-sm border-b border-zinc-700 pb-1">
                  {certificate.instructorName}
                </div>
                <p className="text-[11px]">Senior Faculty Lead</p>
              </div>

              {/* Sovereign Golden Seal */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center">
                  <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center border border-amber-400/50">
                    <ShieldCheck className="w-8 h-8 text-amber-400" />
                  </div>
                </div>
                <span className="text-[10px] text-amber-400 font-mono">SEAL OF AKSOUM</span>
              </div>

              <div className="text-center sm:text-right space-y-1">
                <div className="font-mono text-zinc-200 text-xs border-b border-zinc-700 pb-1">
                  {certificate.issueDate}
                </div>
                <p className="text-[11px] font-mono text-zinc-400 truncate">
                  ID: {certificate.certificateNumber}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
