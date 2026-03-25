import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, CardContent, CardHeader, Avatar, AvatarFallback, AvatarImage, Badge } from '../../components/ui';
import { useHotel, Reservation } from '../../context/HotelContext';
import { toast } from 'sonner';
import { User, ArrowRight, Sparkles, Luggage, BedDouble, LogOut } from 'lucide-react';

export function GuestLogin() {
  const navigate = useNavigate();
  const { reservations, guests } = useHotel();
  const [code, setCode] = useState('');

  const handleLogin = (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    
    if (reservation) {
      // Small delay for effect
      toast.loading('Acessando reserva...');
      
      setTimeout(() => {
        toast.dismiss();
        toast.success(`Bem-vindo(a)!`);
        
        // Smart Redirect Logic based on Status
        if (reservation.status === 'INVITED' || reservation.status === 'PRECHECKIN_IN_PROGRESS') {
           navigate(`/guest/checkin/${reservation.id}`);
        } else {
           navigate(`/guest/dashboard/${reservation.id}`);
        }
      }, 800);
    } else {
      toast.error('Reserva não encontrada.');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(code.trim());
  };

  // Demo Profiles
  const demoProfiles = [
    {
      id: 'RES-001',
      icon: Luggage,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      title: 'João Silva',
      status: 'Chegando Agora',
      desc: 'Teste o fluxo de Pré Check-in e Assinatura Digital.',
      action: 'Iniciar Jornada'
    },
    {
      id: 'RES-002',
      icon: BedDouble,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      title: 'Maria Souza',
      status: 'Hospedada',
      desc: 'Visualize o Dashboard com Extrato e Serviços.',
      action: 'Acessar Quarto'
    },
    {
      id: 'RES-003',
      icon: LogOut,
      color: 'bg-orange-50 text-orange-600 border-orange-200',
      title: 'Carlos Pereira',
      status: 'Check-out',
      desc: 'Simule o pagamento e encerramento da conta.',
      action: 'Finalizar'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      
      {/* Header */}
      <div className="mb-8 text-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-widest mb-2">
          <Sparkles size={12} className="text-amber-500 fill-amber-500" /> Modo Demonstração
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Portal do Hóspede</h1>
        <p className="text-slate-500 max-w-sm mx-auto">Escolha um perfil abaixo para testar diferentes etapas da jornada.</p>
      </div>

      {/* Demo Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
        {demoProfiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => handleLogin(profile.id)}
            className="group relative flex flex-col text-left bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-sky-500 hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            {/* Hover Effect Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${profile.color}`}>
                  <profile.icon size={20} />
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold tracking-wider">
                  {profile.id}
                </Badge>
              </div>
              
              <h3 className="font-bold text-slate-800 text-lg group-hover:text-sky-600 transition-colors">{profile.title}</h3>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">{profile.status}</p>
              <p className="text-sm text-slate-600 leading-relaxed mb-4 min-h-[40px]">{profile.desc}</p>
              
              <div className="flex items-center text-sm font-semibold text-sky-600 group-hover:translate-x-1 transition-transform">
                {profile.action} <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Manual Input Fallback */}
      <div className="w-full max-w-sm animate-in fade-in duration-1000 delay-300">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-50 px-2 text-slate-400">Ou digite seu código</span>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="mt-6 flex gap-2">
          <Input 
            placeholder="Ex: RES-001" 
            value={code} 
            onChange={(e) => setCode(e.target.value)}
            className="bg-white"
          />
          <Button type="submit" variant="secondary" disabled={!code}>
            Entrar
          </Button>
        </form>
        
        <div className="text-center mt-8">
           <Button variant="link" className="text-slate-400 hover:text-slate-600" onClick={() => navigate('/')}>
             Voltar ao Menu Principal
           </Button>
        </div>
      </div>

    </div>
  );
}
