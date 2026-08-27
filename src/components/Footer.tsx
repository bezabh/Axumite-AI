import React from 'react';
import { ShieldCheck, Sparkles, Globe, Mail, Phone, MapPin, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  logoSrc?: string;
}

export const Footer: React.FC<FooterProps> = ({ logoSrc }) => {
  let isTigrinya = true;
  try {
    const { language } = useLanguage();
    isTigrinya = language === 'ti' || language === 'ti_tg';
  } catch {
    isTigrinya = true;
  }

  return (
    <footer className="w-full bg-[#08070B] border-t border-[#8E6D28]/30 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-slate-300 font-sans">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand Attribution */}
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
          {logoSrc && (
            <div className="w-12 h-12 rounded-xl border border-[#C5A059] p-0.5 bg-black shrink-0 shadow-lg">
              <img src={logoSrc} alt="AXUMITE AI Emblem" className="w-full h-full rounded-lg object-cover" />
            </div>
          )}
          <div>
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="serif-luxury font-bold text-amber-300 text-sm tracking-widest">
                AXUMITE AI
              </span>
              <span className="text-xs text-[#E5A93C] font-semibold">&bull; ኣኩሱማይት ኪንግደም ኣብ መባእታና ሰረትናን</span>
            </div>
            
            <div className="text-xs text-gray-400 mt-1 flex items-center justify-center sm:justify-start space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {isTigrinya 
                  ? 'ዝቕጽል ወለዶ ብዙሕ-ዓይነታዊ AI & ልዑላዊ ናይ ቅርሲ ብልሒ' 
                  : 'Next-Generation Multimodal AI & Sovereign Heritage Intelligence'}
              </span>
            </div>
          </div>
        </div>

        {/* Developer Contact Card */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-xs bg-[#110E18] border border-[#2B2338] px-4 py-3 rounded-2xl text-slate-300">
          <div className="flex items-center space-x-1.5 text-[#E5A93C] font-bold">
            <User className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
            <span>በዛብህ ኣብርሃ ወልደገብርኤል</span>
          </div>
          <span className="hidden sm:inline text-gray-600">&bull;</span>
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <a href="mailto:beckylove2004@gmail.com" className="hover:text-amber-300">
              beckylove2004@gmail.com
            </a>
          </div>
          <span className="hidden sm:inline text-gray-600">&bull;</span>
          <div className="flex items-center space-x-1.5 text-slate-300 font-mono">
            <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <a href="tel:+4915214451691" className="hover:text-amber-300">
              +4915214451691
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-[1400px] mx-auto border-t border-[#1C1628] mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
        <div className="flex items-center space-x-2">
          <span>© {new Date().getFullYear()} AXUMITE AI &bull; ደቨሎፐር: በዛብህ ኣብርሃ ወልደገብርኤል</span>
          <span>&bull;</span>
          <span className="flex items-center space-x-1 text-slate-400">
            <MapPin className="w-3 h-3 text-[#E5A93C]" />
            <span>Regensburg, Bavaria, Germany</span>
          </span>
        </div>
        <div className="flex items-center space-x-2 text-amber-400/90 font-serif">
          <Globe className="w-3.5 h-3.5" />
          <span>ኣኩሱማይት ኪንግደም ኣብ መባእታና ሰረትናን</span>
        </div>
      </div>
    </footer>
  );
};
