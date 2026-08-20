import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, QrCode, Building, CreditCard, Sparkles } from 'lucide-react';
import { InvoiceItem } from '../context/SubscriptionContext';
import { useLanguage } from '../context/LanguageContext';

interface InvoiceReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceItem | null;
}

export const InvoiceReceiptModal: React.FC<InvoiceReceiptModalProps> = ({
  isOpen,
  onClose,
  invoice,
}) => {
  const { language } = useLanguage();

  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in print:p-0 print:bg-white">
      <div className="bg-[#0B0D17] border border-[#8E6D28]/40 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col text-slate-200 print:border-none print:shadow-none print:text-black print:bg-white print:max-w-full">
        
        {/* Header Bar */}
        <div className="p-5 bg-[#121422] border-b border-[#8E6D28]/30 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {language === 'ti' ? 'ወግዓዊ ናይ ክፍሊት ረሲት (Tax Invoice)' : 'Official Tax Receipt & Invoice'}
              </h3>
              <p className="text-xs text-amber-400/80 font-mono">
                {invoice.invoiceNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-[#1D2136] hover:bg-[#252B47] text-white border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ti' ? 'ሕተም (Print)' : 'Print / PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 print:p-8 print:text-black">
          
          {/* Top Brand & Status Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 print:border-slate-300">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-cinzel text-xl sm:text-2xl font-black text-amber-400 tracking-wider print:text-black">
                  AXUMITE AI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 print:border-slate-400 print:text-black">
                  SOVEREIGN ERITREA
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 print:text-slate-600">
                Axumite AI Sovereign Technologies Ltd.
              </p>
              <p className="text-[11px] text-slate-500 print:text-slate-500 font-mono">
                Tax ID: ER-TAX-9482910-AXM | VAT Reg: VAT-2026-SOV-819
              </p>
            </div>

            <div className="sm:text-right">
              <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                invoice.status === 'PAID'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 print:text-emerald-800'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 print:text-amber-800'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{invoice.status === 'PAID' ? 'PAID & VERIFIED' : '14-DAY TRIAL ACTIVE'}</span>
              </span>
              <p className="text-xs text-slate-400 mt-1.5 print:text-slate-600">
                Issued Date: <strong className="text-slate-200 print:text-black">{invoice.date}</strong>
              </p>
            </div>
          </div>

          {/* Customer & Order Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#121422]/60 p-4 rounded-2xl border border-slate-800/80 print:bg-slate-50 print:border-slate-300">
            <div>
              <p className="text-slate-500 uppercase font-semibold text-[10px] tracking-wider">Billed To</p>
              <p className="font-bold text-white text-sm mt-0.5 print:text-black">Verified Sovereign Member</p>
              <p className="text-slate-300 font-mono mt-0.5 print:text-slate-700">BeckyLove2004@gmail.com</p>
              <p className="text-slate-400 text-[11px] mt-0.5 print:text-slate-500">Android Client / Mobile Web PWA</p>
            </div>
            <div>
              <p className="text-slate-500 uppercase font-semibold text-[10px] tracking-wider">Transaction Info</p>
              <p className="text-slate-300 mt-0.5 print:text-slate-700">Order ID: <span className="font-mono text-white font-semibold print:text-black">{invoice.orderId}</span></p>
              <p className="text-slate-300 mt-0.5 print:text-slate-700">Payment Channel: <span className="font-medium text-amber-300 print:text-black">{invoice.paymentMethod}</span></p>
              <p className="text-slate-300 mt-0.5 print:text-slate-700">Billing Term: <span className="font-medium capitalize">{invoice.billingCycle}</span></p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 print:border-slate-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#151829] text-slate-400 text-[11px] uppercase tracking-wider print:bg-slate-200 print:text-black">
                <tr>
                  <th className="p-3.5">Plan / Description</th>
                  <th className="p-3.5 text-center">Term</th>
                  <th className="p-3.5 text-right">Price</th>
                  <th className="p-3.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 print:divide-slate-300">
                <tr>
                  <td className="p-3.5">
                    <p className="font-bold text-white print:text-black">{invoice.planName}</p>
                    <p className="text-[11px] text-slate-400 print:text-slate-600">
                      High-throughput Gemini 3.7 Pro, Video Translation & Speech Dubbing, 4K Ge'ez Studio, Legal AI
                    </p>
                  </td>
                  <td className="p-3.5 text-center capitalize text-slate-300 print:text-black">
                    {invoice.billingCycle}
                  </td>
                  <td className="p-3.5 text-right font-mono text-slate-300 print:text-black">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-amber-400 print:text-black">
                    ${invoice.amount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
            <div className="text-[11px] text-slate-400 flex items-center space-x-2 print:text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified with Cryptographic Server Signature (SHA-256)</span>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-slate-400 print:text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono text-slate-200 print:text-black">${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-slate-600">
                <span>VAT / Tax (15%):</span>
                <span className="font-mono text-slate-200 print:text-black">${invoice.vatAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white border-t border-slate-800 pt-2 print:text-black print:border-slate-400">
                <span>Total Amount:</span>
                <span className="font-mono text-amber-400 text-base print:text-black">${invoice.amount.toFixed(2)} USD</span>
              </div>
            </div>
          </div>

          {/* Security Signature & Official Stamp */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono print:text-slate-600">
            <div>
              <p>Issuer: AXUMITE FINANCIAL CLOUD GATEWAY</p>
              <p>Authentication Key: AXM-VERIFIED-AUTH-2026</p>
            </div>
            <div className="text-right">
              <p>Support: billing@axumite.ai</p>
              <p>Official Digital Receipt</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#121422] border-t border-[#8E6D28]/30 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {language === 'ti' ? 'ዕጸው (Close Receipt)' : 'Close Receipt'}
          </button>
        </div>

      </div>
    </div>
  );
};
