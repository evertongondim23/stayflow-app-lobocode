import React, { useState } from 'react';
import { Button, Card, CardContent, Input } from '../../components/ui';
import { FileText, History, Clock, CheckCircle } from 'lucide-react';

export function AdminPolicies() {
  const [activeDoc, setActiveDoc] = useState('terms');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Termos e Políticas</h1>
          <p className="text-slate-500">Gerencie contratos, termos de uso e política de privacidade.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <History size={18} /> Histórico
          </Button>
          <Button className="bg-sky-600 hover:bg-sky-700 gap-2">
            Publicar Nova Versão
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Document Selection */}
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveDoc('terms')}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
              activeDoc === 'terms' 
                ? 'bg-white border-sky-200 shadow-md ring-1 ring-sky-100' 
                : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
              <FileText size={16} className="text-sky-600" /> Termos de Hospedagem
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-green-600 font-medium bg-green-50 px-1.5 rounded">v2.4 (Ativo)</span>
              <span className="text-slate-400">12/Out</span>
            </div>
          </button>

          <button 
            onClick={() => setActiveDoc('privacy')}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
              activeDoc === 'privacy' 
                ? 'bg-white border-sky-200 shadow-md ring-1 ring-sky-100' 
                : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
              <FileText size={16} className="text-sky-600" /> Política de Privacidade
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-green-600 font-medium bg-green-50 px-1.5 rounded">v1.0 (Ativo)</span>
              <span className="text-slate-400">01/Jan</span>
            </div>
          </button>

          <button 
            onClick={() => setActiveDoc('rules')}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
              activeDoc === 'rules' 
                ? 'bg-white border-sky-200 shadow-md ring-1 ring-sky-100' 
                : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
              <FileText size={16} className="text-sky-600" /> Regras Internas
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium bg-slate-100 px-1.5 rounded">Rascunho</span>
              <span className="text-slate-400">Hoje</span>
            </div>
          </button>
        </div>

        {/* Editor Area */}
        <Card className="md:col-span-3 h-full flex flex-col">
          <div className="border-b border-slate-100 p-4 bg-slate-50 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="font-bold">Editando:</span> 
              {activeDoc === 'terms' ? 'Termos de Hospedagem' : 
               activeDoc === 'privacy' ? 'Política de Privacidade' : 'Regras Internas'}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <Clock size={12} /> Salvo automaticamente às 14:30
            </div>
          </div>
          <CardContent className="p-0 flex-1 relative">
            <textarea 
              className="w-full h-full p-6 resize-none focus:outline-none text-slate-700 font-mono text-sm leading-relaxed"
              defaultValue={`1. DO CHECK-IN E CHECK-OUT\n\n1.1. O horário de check-in inicia-se às 14h00 e o check-out deve ser realizado até às 12h00.\n1.2. A permanência após o horário de check-out implicará na cobrança de meia diária até às 18h00 e diária completa após este horário.\n\n2. DO PAGAMENTO\n\n2.1. Aceitamos cartões de crédito, débito e dinheiro.\n2.2. O pagamento das diárias é feito no ato do check-in.`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}