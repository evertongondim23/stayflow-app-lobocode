import React from 'react';
import { Home, FileText, User, ShoppingBag } from 'lucide-react';

interface GuestBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function GuestBottomNav({ activeTab, onTabChange }: GuestBottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-slate-200 bg-white px-2 py-2.5 pb-safe">
      <button
        type="button"
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-0.5 transition-colors ${activeTab === 'home' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
        <span className="text-[10px] font-medium">Início</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('consumption')}
        className={`flex flex-col items-center gap-0.5 transition-colors ${activeTab === 'consumption' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <ShoppingBag size={22} strokeWidth={activeTab === 'consumption' ? 2.5 : 2} />
        <span className="text-[10px] font-medium text-center leading-tight">No quarto</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange('statement')}
        className={`flex flex-col items-center gap-0.5 transition-colors ${activeTab === 'statement' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <FileText size={22} strokeWidth={activeTab === 'statement' ? 2.5 : 2} />
        <span className="text-[10px] font-medium">Extrato</span>
      </button>

      <button
        type="button"
        onClick={() => document.dispatchEvent(new CustomEvent('toggle-profile'))}
        className="flex flex-col items-center gap-0.5 text-slate-400 transition-colors hover:text-slate-600"
      >
        <User size={22} />
        <span className="text-[10px] font-medium">Perfil</span>
      </button>
    </div>
  );
}
