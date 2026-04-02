import React from 'react';
import { CreditCard, Key, MessageSquare } from 'lucide-react';
import { Button } from '../ui';

/** Defina como true para exibir Lançar Despesa / Mensagem / Trocar Quarto no painel do hóspede. */
export const SHOW_GUEST_DETAIL_QUICK_ACTIONS = false;

export interface GuestDetailQuickActionsProps {
  onLaunchExpense?: () => void;
  onMessage?: () => void;
  onChangeRoom?: () => void;
}

export function GuestDetailQuickActions({
  onLaunchExpense,
  onMessage,
  onChangeRoom,
}: GuestDetailQuickActionsProps) {
  if (!SHOW_GUEST_DETAIL_QUICK_ACTIONS) return null;

  return (
    <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
      <Button
        type="button"
        className="w-full bg-sky-600 hover:bg-sky-700 font-bold shadow-md"
        onClick={onLaunchExpense}
      >
        <CreditCard size={16} className="mr-2" /> Lançar Despesa
      </Button>
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          className="border-slate-200 hover:bg-white hover:text-sky-600"
          onClick={onMessage}
        >
          <MessageSquare size={16} className="mr-2" /> Mensagem
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-slate-200 hover:bg-white hover:text-red-600"
          onClick={onChangeRoom}
        >
          <Key size={16} className="mr-2" /> Trocar Quarto
        </Button>
      </div>
    </div>
  );
}
