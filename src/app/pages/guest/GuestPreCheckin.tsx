import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { useHotel } from '../../context/HotelContext';
import { Button, Card, CardContent } from '../../components/ui';
import { ArrowLeft, Check, Upload, PenTool, User, FileText, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { PATHS } from '../../routes';

const STEPS = [
  { id: 1, title: 'Dados', icon: User },
  { id: 2, title: 'Documento', icon: FileText },
  { id: 3, title: 'Assinatura', icon: PenTool },
];

export function GuestPreCheckin() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reservations, updateReservationStatus, updateGuestData, assignRoom } = useHotel();
  const sigPad = useRef<any>(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const reservation = reservations.find(r => r.id === id);

  if (!reservation) return <div>Reserva não encontrada</div>;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      finishPreCheckin();
    }
  };

  const finishPreCheckin = () => {
    if (sigPad.current?.isEmpty()) {
      toast.error('Por favor, assine para continuar.');
      return;
    }
    
    setLoading(true);
    // Simula upload da assinatura
    const signatureData = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
    updateGuestData(reservation.guestId, { signature: signatureData });

    setTimeout(() => {
      // Atualiza para CHECKED_IN para simular o fluxo completo de entrada
      // Em um cenário real, isso seria feito pela recepção, mas para este MVP o fluxo é contínuo
      if (!reservation.roomNumber) {
        assignRoom(reservation.id, '101'); // Atribui um quarto padrão para demonstração
      }
      updateReservationStatus(reservation.id, 'CHECKED_IN');
      
      toast.success('Check-in realizado com sucesso! Bem-vindo(a).');
      setLoading(false);
      navigate(PATHS.guest.dashboard(reservation.id));
    }, 1500);
  };

  const clearSignature = () => sigPad.current?.clear();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 font-sans">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(PATHS.home)}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-bold text-slate-900">Pré Check-in</h1>
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-between relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10" />
          {STEPS.map((s) => {
            const isActive = s.id === step;
            const isDone = s.id < step;
            return (
              <div key={s.id} className={`flex flex-col items-center gap-2 bg-slate-50 px-2`}>
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isActive ? 'border-sky-600 bg-sky-600 text-white' : 
                    isDone ? 'border-sky-600 bg-white text-sky-600' : 
                    'border-slate-300 bg-white text-slate-300'
                  }`}
                >
                  {isDone ? <Check size={16} /> : <s.icon size={16} />}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-sky-600' : 'text-slate-400'}`}>{s.title}</span>
              </div>
            );
          })}
        </div>

        {/* Content */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 pt-6">
            
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-8">
                <h2 className="text-lg font-bold text-slate-800">Confirme seus dados</h2>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <label className="text-xs text-slate-400 font-bold uppercase">Nome Completo</label>
                    <p className="text-slate-700 font-medium">João Silva</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <label className="text-xs text-slate-400 font-bold uppercase">E-mail</label>
                    <p className="text-slate-700 font-medium">joao@email.com</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                     <label className="text-xs text-slate-400 font-bold uppercase">Telefone</label>
                     <input type="tel" placeholder="(00) 00000-0000" className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 text-center">
                <h2 className="text-lg font-bold text-slate-800">Tirar Self com documento</h2>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => toast.success('Foto capturada com sucesso!')}>
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
                    <Camera size={32} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Toque para capturar</p>
                    <p className="text-xs text-slate-400">Posicione seu rosto e documento na moldura</p>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-8">
                <h2 className="text-lg font-bold text-slate-800">Assinatura Digital</h2>
                <p className="text-sm text-slate-500">Assine abaixo para concordar com os termos de hospedagem.</p>
                
                <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50 touch-none">
                  <SignatureCanvas 
                    ref={sigPad}
                    penColor="black"
                    canvasProps={{width: 320, height: 160, className: 'w-full h-40'}}
                    backgroundColor="transparent"
                  />
                </div>
                <div className="flex justify-end">
                  <button onClick={clearSignature} className="text-xs text-red-500 hover:underline">Limpar Assinatura</button>
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Actions */}
        <Button 
          className="w-full h-12 text-lg font-bold shadow-lg shadow-sky-900/10" 
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? 'Processando...' : step === 3 ? 'Finalizar Check-in' : 'Continuar'}
        </Button>

      </div>
    </div>
  );
}
