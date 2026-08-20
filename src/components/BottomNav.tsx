import React from 'react';
import { AppTab } from '../types';
import { Home, MessageSquare, Plus, Clock, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  savedCount?: number;
  onOpenUserModal: () => void;
  onOpenDrawer?: () => void;
  onOpenHistory?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenUserModal,
  onOpenDrawer,
  onOpenHistory,
}) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-2 sm:bottom-3 left-0 right-0 z-40 px-3 sm:px-4 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        {/* Crisp White Elevated Floating Bar matching Reference Image */}
        <div className="relative rounded-full px-5 py-2 bg-white/95 backdrop-blur-xl border border-slate-100 shadow-[0_10px_30px_rgba(15,40,86,0.12)]">
          <nav 
            aria-label="Bottom Navigation Bar"
            className="flex items-center justify-between"
          >
            {/* 1. Home */}
            <button
              type="button"
              onClick={() => setActiveTab('premiere')}
              className="flex flex-col items-center justify-center py-1 px-2 group cursor-pointer transition-all active:scale-95"
              title={t.tabHome}
            >
              <Home 
                className={`w-5 h-5 transition-all ${
                  activeTab === 'premiere' 
                    ? 'text-[#194BFB] fill-current stroke-[2.5] scale-105' 
                    : 'text-slate-400 group-hover:text-slate-600'
                }`} 
              />
              <span className={`text-[10.5px] tracking-tight mt-0.5 transition-all ${
                activeTab === 'premiere' 
                  ? 'text-[#194BFB] font-bold' 
                  : 'text-slate-500 font-medium'
              }`}>
                {t.tabHome}
              </span>
            </button>

            {/* 2. Chats */}
            <button
              type="button"
              id="axumite-chat-tab-mobile"
              onClick={() => setActiveTab('chat')}
              className="flex flex-col items-center justify-center py-1 px-2 group cursor-pointer transition-all active:scale-95"
              title={t.tabChats}
            >
              <MessageSquare 
                className={`w-5 h-5 transition-all ${
                  activeTab === 'chat' 
                    ? 'text-[#194BFB] fill-current stroke-[2.5] scale-105' 
                    : 'text-slate-400 group-hover:text-slate-600'
                }`} 
              />
              <span className={`text-[10.5px] tracking-tight mt-0.5 transition-all ${
                activeTab === 'chat' 
                  ? 'text-[#194BFB] font-bold' 
                  : 'text-slate-500 font-medium'
              }`}>
                {t.tabChats}
              </span>
            </button>

            {/* 3. Center Elevated Plus Button (+) */}
            <button
              type="button"
              onClick={() => {
                if (onOpenDrawer) {
                  onOpenDrawer();
                } else {
                  setActiveTab('chat');
                }
              }}
              className="w-12 h-12 rounded-full bg-[#194BFB] hover:bg-[#133BD0] text-white flex items-center justify-center shadow-lg shadow-blue-500/40 -mt-6 border-3 border-white active:scale-90 transition-transform cursor-pointer group"
              title="Create & Tools Hub"
              aria-label="New Prompt & Tools"
            >
              <Plus className="w-6 h-6 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* 4. History */}
            <button
              type="button"
              onClick={() => {
                if (onOpenHistory) {
                  onOpenHistory();
                } else {
                  setActiveTab('saved');
                }
              }}
              className="flex flex-col items-center justify-center py-1 px-2 group cursor-pointer transition-all active:scale-95"
              title={t.tabHistory}
            >
              <Clock 
                className={`w-5 h-5 transition-all ${
                  activeTab === 'saved' 
                    ? 'text-[#194BFB] stroke-[2.5] scale-105' 
                    : 'text-slate-400 group-hover:text-slate-600'
                }`} 
              />
              <span className={`text-[10.5px] tracking-tight mt-0.5 transition-all ${
                activeTab === 'saved' 
                  ? 'text-[#194BFB] font-bold' 
                  : 'text-slate-500 font-medium'
              }`}>
                {t.tabHistory}
              </span>
            </button>

            {/* 5. Profile */}
            <button
              type="button"
              onClick={onOpenUserModal}
              className="flex flex-col items-center justify-center py-1 px-2 group cursor-pointer transition-all active:scale-95"
              title={t.tabProfile}
            >
              <User className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-all" />
              <span className="text-[10.5px] text-slate-500 font-medium tracking-tight mt-0.5">
                {t.tabProfile}
              </span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

