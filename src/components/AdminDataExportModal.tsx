import React, { useState } from 'react';
import { 
  X, Download, FileSpreadsheet, FileText, Users, CreditCard, 
  Activity, ShieldCheck, Check, Sparkles, Database, Layers, 
  Clock, ArrowRight, Filter, AlertCircle, RefreshCw, Crown
} from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  getStoredManagedUsers, 
  getStoredPaymentTransactions, 
  getStoredLiveSessions, 
  getStoredAuditLogs,
  exportUsersToCSV,
  exportUsersToPDF,
  exportPaymentsToCSV,
  exportPaymentsToPDF,
  exportSystemLogsToCSV,
  exportSystemLogsToPDF,
  exportMasterExecutiveBundleToCSV
} from '../utils/adminDataExport';

interface AdminDataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

type ReportType = 'users' | 'payments' | 'system' | 'master';
type ExportFormat = 'csv' | 'pdf';

export const AdminDataExportModal: React.FC<AdminDataExportModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const { language } = useLanguage();
  const [selectedReport, setSelectedReport] = useState<ReportType>('users');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const users = getStoredManagedUsers();
  const payments = getStoredPaymentTransactions();
  const sessions = getStoredLiveSessions();
  const auditLogs = getStoredAuditLogs();

  const handleExecuteExport = (reportType?: ReportType, format?: ExportFormat) => {
    const targetReport = reportType || selectedReport;
    const targetFormat = format || selectedFormat;

    setIsExporting(true);
    setExportSuccessMessage(null);

    setTimeout(() => {
      try {
        if (targetReport === 'users') {
          if (targetFormat === 'csv') exportUsersToCSV(users, currentUser);
          else exportUsersToPDF(users, currentUser);
        } else if (targetReport === 'payments') {
          if (targetFormat === 'csv') exportPaymentsToCSV(payments, currentUser);
          else exportPaymentsToPDF(payments, currentUser);
        } else if (targetReport === 'system') {
          if (targetFormat === 'csv') exportSystemLogsToCSV(sessions, auditLogs, currentUser);
          else exportSystemLogsToPDF(sessions, auditLogs, currentUser);
        } else if (targetReport === 'master') {
          if (targetFormat === 'csv') exportMasterExecutiveBundleToCSV(currentUser);
          else {
            // For master PDF, we generate the comprehensive PDF
            exportUsersToPDF(users, currentUser);
            exportPaymentsToPDF(payments, currentUser);
            exportSystemLogsToPDF(sessions, auditLogs, currentUser);
          }
        }

        setExportSuccessMessage(
          language === 'ti' 
            ? 'ጸብጻብ ብዓወት ተሰሪሑ ወሪዱ ኣሎ!' 
            : `Successfully generated and downloaded ${targetReport.toUpperCase()} report in ${targetFormat.toUpperCase()} format.`
        );
      } catch (err) {
        console.error('Export failed', err);
      } finally {
        setIsExporting(false);
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-gradient-to-b from-[#141026] via-[#0E0B1A] to-[#0A0714] border border-[#8E6D28]/60 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        style={{ boxShadow: '0 0 50px rgba(197, 160, 89, 0.15)' }}
      >
        
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-[#8E6D28]/30 flex items-center justify-between bg-[#0B0816]">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#8E6D28]/40 to-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#F3E5AB] shadow-lg shadow-[#8E6D28]/20">
              <Download className="w-6 h-6 text-[#E1C47D]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black tracking-wide text-[#F3E5AB]">
                  {language === 'ti' ? 'ናይ ምሕደራ ዳታ ኤክስፖርት ማእከል (CSV / PDF)' : 'Enterprise Data Export & Audit Hub'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'ti' 
                  ? 'ናይ ተጠቀምቲ ምንቅስቓስ፣ ክፍሊታትን ናይ ሲስተም መዝገብን ንዝተፈላለየ መጽናዕቲ ምውራድ'
                  : 'Download offline audit-grade reports for user activity, payment summaries & system logs'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#181329] hover:bg-[#251E40] border border-[#8E6D28]/40 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          
          {/* Success Banner */}
          {exportSuccessMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/60 text-emerald-200 text-xs flex items-center justify-between animate-fadeIn">
              <div className="flex items-center space-x-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{exportSuccessMessage}</span>
              </div>
              <button 
                onClick={() => setExportSuccessMessage(null)}
                className="text-emerald-400 hover:text-emerald-100 text-xs underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Step 1: Select Dataset */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#E1C47D] flex items-center space-x-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>1. {language === 'ti' ? 'ዓይነት ጸብጻብ ምረጽ' : 'Select Target Data Domain'}</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">4 Modules Ready</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Card 1: Users Activity */}
              <div 
                onClick={() => setSelectedReport('users')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedReport === 'users'
                    ? 'bg-[#1C162E] border-[#C5A059] ring-2 ring-[#C5A059]/30 shadow-lg'
                    : 'bg-[#100C1F]/80 border-[#8E6D28]/30 hover:border-[#8E6D28] hover:bg-[#141026]'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                      <span>{language === 'ti' ? 'ተጠቃሚን ምንቅስቓስን' : 'User Activity & Directory'}</span>
                      {selectedReport === 'users' && <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {language === 'ti' 
                        ? 'ኩሎም ተጠቀምቲ፣ ናይ ቶከን ኣጠቓቕማ፣ መሰላትን ናይ ምስክርነት ኩነታትን'
                        : 'User registry, roles, token quotas, activity timestamps, and identity verification stats.'}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{users.length} Active Records</span>
                  <span className="text-purple-300">Detailed Telemetry</span>
                </div>
              </div>

              {/* Card 2: Payment & Revenue */}
              <div 
                onClick={() => setSelectedReport('payments')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedReport === 'payments'
                    ? 'bg-[#1C162E] border-[#C5A059] ring-2 ring-[#C5A059]/30 shadow-lg'
                    : 'bg-[#100C1F]/80 border-[#8E6D28]/30 hover:border-[#8E6D28] hover:bg-[#141026]'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                      <span>{language === 'ti' ? 'ክፍሊትን እቶትን' : 'Payment & Revenue Summaries'}</span>
                      {selectedReport === 'payments' && <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {language === 'ti' 
                        ? 'ናይ ERN/USD ዝርዝር ክፍሊት፣ ባንክታትን ኢንቮይስን ጸብጻብ'
                        : 'Transactions, invoices, ERN/USD currency settlements, gateways, and token disbursements.'}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{payments.length} Transactions</span>
                  <span className="text-amber-300">Multi-Currency</span>
                </div>
              </div>

              {/* Card 3: System Usage & Audit Logs */}
              <div 
                onClick={() => setSelectedReport('system')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedReport === 'system'
                    ? 'bg-[#1C162E] border-[#C5A059] ring-2 ring-[#C5A059]/30 shadow-lg'
                    : 'bg-[#100C1F]/80 border-[#8E6D28]/30 hover:border-[#8E6D28] hover:bg-[#141026]'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                      <span>{language === 'ti' ? 'ሲስተም ቴሌሜትሪን መዝገብን' : 'System Usage & Audit Logs'}</span>
                      {selectedReport === 'system' && <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {language === 'ti' 
                        ? 'ናይ ላይቭ ኖዳት፣ ናይ ጸጥታ ስጋኣት ነጥቢን ናይ ምሕደራ መዝገብን'
                        : 'Real-time connected nodes, threat indices, latency, and immutable administrative audit logs.'}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{sessions.length} Live Sessions • {auditLogs.length} Events</span>
                  <span className="text-emerald-300">Security Trail</span>
                </div>
              </div>

              {/* Card 4: Master Executive Bundle */}
              <div 
                onClick={() => setSelectedReport('master')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedReport === 'master'
                    ? 'bg-[#1C162E] border-[#C5A059] ring-2 ring-[#C5A059]/30 shadow-lg'
                    : 'bg-[#100C1F]/80 border-[#8E6D28]/30 hover:border-[#8E6D28] hover:bg-[#141026]'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-950 to-purple-950 border border-amber-400/60 text-amber-300 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                      <span>{language === 'ti' ? 'ማስተር ኩለ-መዳይ ጸብጻብ' : 'Master Executive Audit Bundle'}</span>
                      {selectedReport === 'master' && <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {language === 'ti' 
                        ? 'ኩሎም 3 መዳያት ኣብ ሓደ ዝተጠርነፈ ናይ ላዕለዎት ሓለፍቲ ሰነድ'
                        : 'All 3 domains consolidated in one master audit report for full offline compliance review.'}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Complete Sovereign Suite</span>
                  <span className="text-[#C5A059]">Executive Level</span>
                </div>
              </div>

            </div>
          </div>

          {/* Step 2: Select Format */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#E1C47D] mb-3 flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>2. {language === 'ti' ? 'ናይ ሰነድ ቅርጺ ምረጽ (CSV / PDF)' : 'Choose Export Format'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* CSV Option */}
              <button
                type="button"
                onClick={() => setSelectedFormat('csv')}
                className={`p-4 rounded-2xl border text-left flex items-start space-x-3.5 transition-all cursor-pointer ${
                  selectedFormat === 'csv'
                    ? 'bg-[#1C162E] border-emerald-500/80 ring-2 ring-emerald-500/20'
                    : 'bg-[#100C1F]/60 border-[#8E6D28]/30 hover:border-slate-500'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                    <span>CSV Spreadsheet (.csv)</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">EXCEL READY</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Raw tabular data with UTF-8 BOM encoding for Microsoft Excel, Google Sheets, Python & BI pipelines.
                  </p>
                </div>
              </button>

              {/* PDF Option */}
              <button
                type="button"
                onClick={() => setSelectedFormat('pdf')}
                className={`p-4 rounded-2xl border text-left flex items-start space-x-3.5 transition-all cursor-pointer ${
                  selectedFormat === 'pdf'
                    ? 'bg-[#1C162E] border-red-500/80 ring-2 ring-red-500/20'
                    : 'bg-[#100C1F]/60 border-[#8E6D28]/30 hover:border-slate-500'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                    <span>Executive Document (.pdf)</span>
                    <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-mono">A4 PRINTABLE</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    High-resolution official document with executive gold branding, KPI cards, zebra-striped tables and headers.
                  </p>
                </div>
              </button>

            </div>
          </div>

          {/* Preview Details Strip */}
          <div className="p-4 rounded-2xl bg-[#0B0816] border border-[#8E6D28]/30 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-[#C5A059]" />
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-[#F3E5AB]">Target: </span>
                <span className="capitalize">{selectedReport}</span> Report ({selectedFormat.toUpperCase()})
              </div>
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-3">
              <span>Encoding: UTF-8 / Standard A4</span>
              <span className="text-emerald-400">Offline Processing</span>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-[#8E6D28]/30 bg-[#0B0816] flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Authorized by {currentUser.name || 'Super Admin'}</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              {language === 'ti' ? 'ዕጸው' : 'Cancel'}
            </button>

            {/* Quick CSV Export */}
            <button
              onClick={() => handleExecuteExport(selectedReport, 'csv')}
              disabled={isExporting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1A1528] hover:bg-[#251E3B] border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 flex items-center space-x-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            {/* Quick PDF Export */}
            <button
              onClick={() => handleExecuteExport(selectedReport, 'pdf')}
              disabled={isExporting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1A1528] hover:bg-[#251E3B] border border-red-500/50 hover:border-red-400 text-red-300 flex items-center space-x-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5 text-red-400" />
              <span>Export PDF</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleExecuteExport(selectedReport, selectedFormat)}
              disabled={isExporting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#8E6D28] via-[#C5A059] to-[#8E6D28] hover:from-[#C5A059] hover:to-[#E1C47D] text-[#0A0814] flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-[#8E6D28]/30 active:scale-95 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{language === 'ti' ? 'ይዳሎ ኣሎ...' : 'Generating Report...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'ti' ? 'ጸብጻብ ኣውርድ' : `Download ${selectedFormat.toUpperCase()}`}</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
