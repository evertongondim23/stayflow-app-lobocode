import React from 'react';
import { Home, FileText, User } from 'lucide-react';

interface GuestBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function GuestBottomNav({ activeTab, onTabChange }: GuestBottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center z-40 pb-safe">
      <button 
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
        <span className="text-[10px] font-medium">Início</span>
      </button>

      <button 
        onClick={() => onTabChange('statement')}
        className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'statement' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <FileText size={24} strokeWidth={activeTab === 'statement' ? 2.5 : 2} />
        <span className="text-[10px] font-medium">Extrato</span>
      </button>

      {/* O botão de perfil pode ser apenas um atalho visual ou abrir o menu lateral/modal */}
      <button 
        onClick={() => document.dispatchEvent(new CustomEvent('toggle-profile'))}
        className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600"
      >
        <User size={24} />
        <span className="text-[10px] font-medium">Perfil</span>
      </button>
    </div>
  );
}
