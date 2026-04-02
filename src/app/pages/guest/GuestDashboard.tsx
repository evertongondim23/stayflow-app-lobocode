import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHotel } from '../../context/HotelContext';
import { Button, Card, CardContent, Avatar, AvatarFallback } from '../../components/ui';
import { 
  Bell, Wifi, Coffee, SprayCan, Wrench, 
  ArrowRight, Clock, MapPin, Menu, FileText, Calendar, AlertCircle, FileCheck, Check,
  CreditCard, QrCode, MessageSquareWarning, Star, Download, Minus, Plus,
} from 'lucide-react';
import { toast } from 'sonner';
import { GuestBottomNav } from '../../components/guest/GuestBottomNav';
import { PATHS } from '../../routes';
import { GUEST_ROOM_CONSUMPTION_CATALOG } from '../../data/guestRoomConsumptionCatalog';

const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export function GuestDashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reservations, guests, rooms, addExpense, updateReservationStatus } = useHotel();
  
  const [activeTab, setActiveTab] = useState('home');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | null>(null);
  /** Quantidade por item do catálogo "No quarto" (padrão 1). */
  const [roomItemQty, setRoomItemQty] = useState<Record<string, number>>({});

  // Load Data
  const reservation = reservations.find(r => r.id === id);
  const guest = guests.find(g => g.id === reservation?.guestId);
  const room = rooms.find(r => r.number === reservation?.roomNumber);

  // Profile Listener (from BottomNav)
  useEffect(() => {
    const handleProfileNav = () =>
      reservation?.id && navigate(PATHS.guest.profile(reservation.id));
    document.addEventListener('toggle-profile', handleProfileNav);
    return () => document.removeEventListener('toggle-profile', handleProfileNav);
  }, [reservation, navigate]);

  if (!reservation || !guest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Reserva não encontrada</h2>
        <Button onClick={() => navigate(PATHS.home)}>Voltar ao Início</Button>
      </div>
    );
  }

  // --- Actions ---

  const handleServiceRequest = (service: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Enviando solicitação...',
        success: `${service} solicitado com sucesso!`,
        error: 'Erro ao solicitar'
      }
    );
  };

  const handleCheckout = () => {
    if (reservation.balance > 0) {
      toast.error('Há pendências financeiras. Verifique seu extrato.');
      setActiveTab('statement');
      return;
    }
    
    // Simula Check-out Digital
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Processando check-out...',
        success: () => {
           updateReservationStatus(reservation.id, 'CHECKED_OUT');
           setActiveTab('home'); // Volta para home para ver a tela de despedida
           return 'Check-out realizado com sucesso! Boa viagem.';
        },
        error: 'Erro ao processar'
      }
    );
  };

  // --- Renders ---

  const renderHeader = () => (
    <div className="bg-white border-b border-slate-100 p-6 sticky top-0 z-20 flex justify-between items-center shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Olá, {guest.name.split(' ')[0]}</h1>
        <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
          <MapPin size={12} /> StayFlow
        </p>
      </div>
      <div className="flex gap-3 items-center">
        <button 
          onClick={() => navigate(PATHS.guest.notifications(reservation.id))}
          className="relative p-2 text-slate-400 hover:text-sky-600 transition-colors bg-slate-50 rounded-full border border-slate-100"
        >
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
        </button>
        
        <div 
          className="cursor-pointer group flex items-center gap-2 bg-slate-50 hover:bg-slate-100 rounded-full pr-3 pl-1 py-1 border border-slate-100 transition-all"
          onClick={() => navigate(PATHS.guest.profile(reservation.id))}
        >
           <Avatar className="w-8 h-8 border border-white shadow-sm">
             <AvatarFallback className="bg-sky-600 text-white text-xs font-bold">
               {guest.name.substring(0,2).toUpperCase()}
             </AvatarFallback>
           </Avatar>
           <Menu size={16} className="text-slate-400" />
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="p-6 space-y-6 pb-24 animate-in fade-in duration-500">
      
      {/* Status Card */}
      {['INVITED', 'PRECHECKIN_DONE'].includes(reservation.status) && (
        <Card className="bg-sky-600 text-white border-none shadow-lg shadow-sky-200">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">Check-in Pendente</h2>
            <p className="text-sky-100 mb-6 text-sm">Complete seu cadastro para agilizar sua entrada.</p>
            <Button onClick={() => navigate(PATHS.guest.checkin(reservation.id))} className="w-full bg-white text-sky-600 hover:bg-sky-50 font-bold">
              Realizar Check-in <ArrowRight size={16} className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {reservation.status === 'CHECKED_IN' && (
        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-none shadow-xl overflow-hidden relative group cursor-default">
            <div className="absolute top-0 right-0 p-32 bg-sky-500/20 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-sky-500/30"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start mb-4">
                 <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Seu Quarto</p>
                 <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                    <Check size={12} /> Check-in Confirmado
                 </span>
              </div>
              <div className="flex justify-between items-end">
                <h2 className="text-5xl font-bold tracking-tighter">{room?.number || '---'}</h2>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-slate-300 text-sm font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                    <Wifi size={14} /> guest2023
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section: Your Stay Details */}
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm space-y-4">
             <div className="flex justify-between items-start">
               <div>
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                   <Calendar size={18} className="text-sky-600" />
                   Sua Estadia
                 </h3>
                 <p className="text-xs text-slate-400 mt-1">Horário de entrada: 14:00</p>
               </div>
               <Button variant="outline" size="sm" className="h-8 text-xs gap-1 border-slate-200" onClick={() => toast.success('Comprovante enviado para seu e-mail!')}>
                 <FileCheck size={14} className="text-sky-600" /> 
                 <span className="hidden sm:inline">Comprovante</span>
               </Button>
             </div>
             
             <div className="grid grid-cols-2 gap-4 pt-2">
               <div className="bg-slate-50 p-3 rounded-lg">
                 <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Entrada</span>
                 <span className="font-semibold text-slate-700">{new Date(reservation.checkInDate).toLocaleDateString('pt-BR')}</span>
               </div>
               <div className="bg-slate-50 p-3 rounded-lg">
                 <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Saída</span>
                 <span className="font-semibold text-slate-700">{new Date(reservation.checkOutDate).toLocaleDateString('pt-BR')}</span>
               </div>
             </div>
          </div>

          {/* Section: Partial Balance */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-slate-200 rounded-xl p-5 shadow-lg shadow-slate-200 flex justify-between items-center cursor-pointer hover:shadow-xl transition-all" onClick={() => setActiveTab('statement')}>
             <div>
               <p className="text-xs text-slate-400 font-medium uppercase mb-1 flex items-center gap-1"><Clock size={12}/> Conta Parcial</p>
               <p className="text-2xl font-bold text-white tracking-tight">R$ {reservation.balance.toFixed(2)}</p>
             </div>
             <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <ArrowRight size={20} className="text-white" />
             </div>
          </div>

           {/* Section: Notifications / Alerts */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm ml-1 flex items-center gap-2">
              <Bell size={16} className="text-sky-600"/> Avisos e Pendências
            </h3>
            
            {/* Aviso de Checkout Próximo (Simulação se faltar 1 dia) */}
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 items-start">
              <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                 <Clock size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900">Check-out amanhã às 12h</p>
                <p className="text-xs text-amber-700 mt-1 leading-relaxed">Evite filas! Você pode solicitar seu check-out diretamente pelo app e deixar a chave na caixa expressa.</p>
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl flex gap-3 items-start">
               <div className="bg-sky-100 p-2 rounded-full text-sky-600">
                 <AlertCircle size={16} />
               </div>
              <div>
                <p className="text-sm font-bold text-sky-900">Comunicado: Piscina</p>
                <p className="text-xs text-sky-700 mt-1 leading-relaxed">A piscina estará fechada para manutenção nesta quarta-feira das 09h às 11h.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Serviços Expressos</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleServiceRequest('Limpeza de Quarto')} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-sky-200 transition-all text-left group">
                <div className="w-10 h-10 bg-sky-50 rounded-lg flex items-center justify-center text-sky-600 mb-3 group-hover:scale-110 transition-transform">
                  <SprayCan size={20} />
                </div>
                <span className="font-semibold text-slate-700 block">Limpeza</span>
                <span className="text-xs text-slate-400">Arrumação e toalhas</span>
              </button>

              <button onClick={() => handleServiceRequest('Manutenção')} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all text-left group">
                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 mb-3 group-hover:scale-110 transition-transform">
                  <Wrench size={20} />
                </div>
                <span className="font-semibold text-slate-700 block">Manutenção</span>
                <span className="text-xs text-slate-400">Reparos técnicos</span>
              </button>
              
              <button onClick={() => handleServiceRequest('Room Service')} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-rose-200 transition-all text-left group col-span-2">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                    <Coffee size={20} />
                  </div>
                  <div>
                     <span className="font-semibold text-slate-700 block">Room Service</span>
                     <span className="text-xs text-slate-400">Cardápio 24h</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {reservation.status === 'CHECKOUT_PENDING' && (
        <Card className="bg-orange-50 border-orange-200">
           <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold text-orange-900 mb-2">Aguardando Saída</h3>
              <p className="text-orange-700">A recepção já foi notificada. Um funcionário irá até o quarto conferir o frigobar.</p>
           </CardContent>
        </Card>
      )}

      {reservation.status === 'CHECKED_OUT' && (
        <div className="space-y-6 text-center pt-8 animate-in slide-in-from-bottom-8 duration-700">
           <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-6 shadow-lg shadow-emerald-100">
             <Check size={48} />
           </div>
           
           <div>
             <h2 className="text-3xl font-bold text-slate-900 mb-2">Estadia Finalizada!</h2>
             <p className="text-slate-500 text-lg">Obrigado por escolher o StayFlow.</p>
             <div className="inline-block bg-slate-100 px-4 py-1 rounded-full text-xs text-slate-500 mt-4 font-mono">
                Saída: {new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
             </div>
           </div>

           <Card className="border-slate-100 shadow-sm text-left overflow-hidden">
             <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">Documentos</div>
             <CardContent className="p-0">
               <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-100" onClick={() => toast.success('Recibo baixado!')}>
                 <div className="flex items-center gap-3">
                    <div className="bg-sky-50 p-2 rounded text-sky-600"><FileText size={20} /></div>
                    <span className="font-medium text-slate-700">Recibo / Nota Fiscal</span>
                 </div>
                 <Download size={16} className="text-slate-300" />
               </button>
               <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors" onClick={() => toast.success('Histórico baixado!')}>
                 <div className="flex items-center gap-3">
                    <div className="bg-purple-50 p-2 rounded text-purple-600"><Clock size={20} /></div>
                    <span className="font-medium text-slate-700">Histórico de Estadia</span>
                 </div>
                 <Download size={16} className="text-slate-300" />
               </button>
             </CardContent>
           </Card>

           <div className="bg-gradient-to-br from-sky-50 to-white rounded-xl p-6 border border-sky-100 shadow-sm">
             <h3 className="font-bold text-slate-800 mb-4">Como foi sua experiência?</h3>
             <div className="flex justify-center gap-2">
               {[1,2,3,4,5].map(star => (
                 <button key={star} className="text-sky-200 hover:text-amber-400 transition-colors transform hover:scale-110 duration-200" onClick={() => toast.success('Obrigado pela avaliação!')}>
                   <Star size={32} fill="currentColor" />
                 </button>
               ))}
             </div>
           </div>
           
           <Button variant="ghost" onClick={() => navigate(PATHS.home)} className="text-slate-400 hover:text-slate-600">Voltar ao Início</Button>
        </div>
      )}

    </div>
  );

  const canRegisterRoomConsumption = ['CHECKED_IN', 'CHECKOUT_PENDING'].includes(
    reservation.status,
  );

  const getRoomItemQty = (itemId: string) => roomItemQty[itemId] ?? 1;

  const bumpRoomItemQty = (itemId: string, delta: number) => {
    setRoomItemQty((prev) => {
      const cur = prev[itemId] ?? 1;
      const next = Math.min(99, Math.max(1, cur + delta));
      return { ...prev, [itemId]: next };
    });
  };

  const renderConsumption = () => (
    <div className="animate-in fade-in slide-in-from-right-8 space-y-6 p-6 pb-28 duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Consumo no quarto</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          Informe o que você consumiu (frigobar, amenities, etc.). Os valores serão
          lançados no seu extrato para conferência na recepção.
        </p>
      </div>

      {!canRegisterRoomConsumption ? (
        <Card className="border-amber-100 bg-amber-50/80">
          <CardContent className="p-6 text-center">
            <p className="text-sm font-medium text-amber-900">
              Disponível após o check-in no hotel.
            </p>
            <p className="mt-2 text-xs text-amber-800/90">
              Conclua seu pré-check-in ou aguarde a confirmação da recepção.
            </p>
            <Button
              variant="outline"
              className="mt-4 border-amber-200 bg-white text-amber-900 hover:bg-amber-50"
              onClick={() => setActiveTab('home')}
            >
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            {GUEST_ROOM_CONSUMPTION_CATALOG.map((item) => {
              const qty = getRoomItemQty(item.id);
              const lineTotal = item.price * qty;
              const unitSuffix = item.unit ? ` (${item.unit})` : '';
              const description =
                qty === 1
                  ? `Quarto — ${item.label}${unitSuffix}`
                  : `Quarto — ${qty}× ${item.label}${unitSuffix}`;

              return (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <div className="min-w-0 flex-1 text-left">
                    <p className="font-semibold text-slate-800">{item.label}</p>
                    {item.unit && (
                      <p className="mt-0.5 text-xs text-slate-400">{item.unit}</p>
                    )}
                    <p className="mt-2 text-sm text-slate-500">
                      {formatBRL(item.price)}
                      {item.unit ? <span className="text-slate-400"> / {item.unit}</span> : null}
                    </p>
                    {qty > 1 && (
                      <p className="mt-1 text-sm font-semibold tabular-nums text-sky-700">
                        Subtotal {formatBRL(lineTotal)}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col items-stretch justify-between gap-2">
                    <div
                      className="flex h-10 items-stretch overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                      role="group"
                      aria-label={`Quantidade de ${item.label}`}
                    >
                      <button
                        type="button"
                        className="flex w-9 items-center justify-center text-slate-600 transition-colors hover:bg-slate-200/80 disabled:opacity-40"
                        aria-label="Diminuir quantidade"
                        disabled={qty <= 1}
                        onClick={() => bumpRoomItemQty(item.id, -1)}
                      >
                        <Minus size={16} strokeWidth={2.5} />
                      </button>
                      <span className="flex min-w-[2rem] items-center justify-center border-x border-slate-200 bg-white text-sm font-bold tabular-nums text-slate-900">
                        {qty}
                      </span>
                      <button
                        type="button"
                        className="flex w-9 items-center justify-center text-slate-600 transition-colors hover:bg-slate-200/80 disabled:opacity-40"
                        aria-label="Aumentar quantidade"
                        disabled={qty >= 99}
                        onClick={() => bumpRoomItemQty(item.id, 1)}
                      >
                        <Plus size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="h-9 shrink-0 px-3 text-xs font-semibold"
                      onClick={() => {
                        addExpense(
                          reservation.id,
                          description,
                          lineTotal,
                          item.category,
                        );
                        toast.success('Item lançado na sua conta.', {
                          description:
                            qty === 1
                              ? `${item.label} · ${formatBRL(lineTotal)}`
                              : `${qty}× ${item.label} · ${formatBRL(lineTotal)}`,
                        });
                        setRoomItemQty((prev) => ({ ...prev, [item.id]: 1 }));
                      }}
                    >
                      Adicionar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('statement')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            Ver extrato completo
            <ArrowRight size={16} />
          </button>
        </>
      )}
    </div>
  );

  const renderStatement = () => (
    <div className="p-6 space-y-6 pb-24 animate-in slide-in-from-right-8 duration-300">
      <h2 className="text-2xl font-bold text-slate-900">Extrato</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {reservation.expenses.map((expense, i) => (
             <div key={i} className="p-4 flex justify-between items-center group">
                <div>
                   <p className="font-medium text-slate-800">{expense.description}</p>
                   <p className="text-xs text-slate-400">{expense.date}</p>
                </div>
                <div className="flex items-center gap-3">
                   <span className="font-mono text-slate-600">R$ {expense.amount.toFixed(2)}</span>
                   <button 
                     onClick={() => toast('Para contestar, contate a recepção (Ramal 9).', { icon: <MessageSquareWarning size={16} /> })} 
                     className="text-slate-200 hover:text-red-500 transition-colors p-1"
                     title="Contestar Item"
                   >
                     <MessageSquareWarning size={18}/>
                   </button>
                </div>
             </div>
          ))}
        </div>
        <div className="bg-slate-50 p-4 flex justify-between items-center border-t border-slate-100">
           <span className="font-bold text-slate-700">Total</span>
           <span className="font-bold text-slate-900 text-xl">R$ {reservation.balance.toFixed(2)}</span>
        </div>
      </div>

      {reservation.balance > 0 ? (
         <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <p className="font-bold text-slate-800">Escolha a forma de pagamento:</p>
            <div className="grid grid-cols-2 gap-3">
               <Button 
                 variant={paymentMethod === 'pix' ? 'default' : 'outline'} 
                 className={`h-20 flex-col gap-2 border-2 ${paymentMethod === 'pix' ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white' : 'border-slate-200 text-slate-600'}`} 
                 onClick={() => setPaymentMethod('pix')}
               >
                  <QrCode size={24} /> 
                  <span className="text-xs font-bold uppercase">PIX</span>
               </Button>
               <Button 
                 variant={paymentMethod === 'card' ? 'default' : 'outline'} 
                 className={`h-20 flex-col gap-2 border-2 ${paymentMethod === 'card' ? 'bg-sky-600 hover:bg-sky-700 border-sky-600 text-white' : 'border-slate-200 text-slate-600'}`} 
                 onClick={() => setPaymentMethod('card')}
               >
                  <CreditCard size={24} /> 
                  <span className="text-xs font-bold uppercase">Cartão</span>
               </Button>
            </div>
            
            {paymentMethod && (
               <Button 
                 className="w-full h-14 text-lg font-bold mt-4 shadow-xl shadow-sky-900/10" 
                 onClick={() => {
                    // Simulação de processamento
                    toast.promise(
                      new Promise(resolve => setTimeout(resolve, 1500)),
                      {
                        loading: 'Processando pagamento...',
                        success: () => {
                           addExpense(reservation.id, 'Pagamento via App', -reservation.balance);
                           setPaymentMethod(null);
                           return 'Pagamento confirmado!';
                        },
                        error: 'Erro no pagamento'
                      }
                    );
                 }}
               >
                 Pagar R$ {reservation.balance.toFixed(2)}
               </Button>
            )}
         </div>
      ) : reservation.status === 'CHECKED_IN' ? (
         <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-emerald-50 text-emerald-700 p-6 rounded-xl text-center font-medium border border-emerald-100 flex flex-col items-center gap-2">
               <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <Check size={24} />
               </div>
               <span className="text-lg font-bold">Conta quitada!</span>
               <p className="text-sm opacity-80">Você já pode finalizar sua estadia.</p>
            </div>
            <Button className="w-full h-14 text-lg bg-orange-500 hover:bg-orange-600 shadow-xl shadow-orange-500/20 font-bold" onClick={handleCheckout}>
               Finalizar Check-out Digital
            </Button>
            <p className="text-xs text-center text-slate-400">Ao finalizar, sua saída será registrada imediatamente e a chave digital será desativada.</p>
         </div>
      ) : null}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {renderHeader()}
      
      {activeTab === 'home'
        ? renderHome()
        : activeTab === 'consumption'
          ? renderConsumption()
          : renderStatement()}

      <GuestBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
