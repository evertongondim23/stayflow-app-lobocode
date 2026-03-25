import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHotel } from '../../context/HotelContext';
import { Button, Input, Card, CardContent, CardHeader, Badge } from '../../components/ui';
import { Check, ChevronRight, ChevronLeft, Upload, PenTool, FileText, User, Calendar, Flag, Smartphone } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { toast } from 'sonner';

export function PreCheckin() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reservations, guests, updateGuestData, updateReservationStatus } = useHotel();
  
  const reservation = reservations.find(r => r.id === id);
  const guest = guests.find(g => g.id === reservation?.guestId);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: guest?.name || '',
    email: guest?.email || '',
    phone: guest?.phone || '',
    birthDate: guest?.birthDate || '',
    nationality: guest?.nationality || '',
    docType: 'CPF',
    docNumber: '',
  });
  const [docFile, setDocFile] = useState<File | null>(null);
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  if (!reservation || !guest) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <h2 className="text-xl font-bold text-slate-800">Reserva não encontrada</h2>
                <Button variant="link" onClick={() => navigate('/')} className="mt-4">Voltar</Button>
            </div>
        </div>
    );
  }

  const nextStep = () => {
      if (step === 1) {
          if (!formData.name || !formData.email || !formData.docNumber) {
              toast.error("Por favor, preencha os campos obrigatórios.");
              return;
          }
      }
      setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  const handleFinish = () => {
    if (!termsAccepted) {
      toast.error('Você precisa aceitar os termos para continuar.');
      return;
    }
    
    // Save signature if canvas has content
    let finalSignature = signatureData;
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        finalSignature = sigCanvas.current.toDataURL();
    }

    if (!finalSignature && step === 3) { // Force signature check if on signature step
         toast.error('A assinatura é obrigatória.');
         return;
    }

    // Update context
    updateGuestData(guest.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      birthDate: formData.birthDate,
      nationality: formData.nationality,
      documentType: formData.docType as any,
      documentNumber: formData.docNumber,
      documentUrl: docFile ? URL.createObjectURL(docFile) : undefined, // Mock
      signatureUrl: finalSignature || undefined,
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString()
    });

    updateReservationStatus(reservation.id, 'PRECHECKIN_DONE');
    
    toast.success('Pré Check-in realizado com sucesso!');
    navigate(`/guest/dashboard/${reservation.id}`);
  };

  const steps = [
    { num: 1, title: 'Dados', icon: User },
    { num: 2, title: 'Documento', icon: Upload },
    { num: 3, title: 'Assinatura', icon: PenTool },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Progress Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-4 shadow-sm">
        <div className="max-w-xl mx-auto">
             <div className="flex justify-between items-center mb-6">
                 <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
                     <ChevronLeft />
                 </button>
                 <span className="font-semibold text-slate-800">Pré Check-in</span>
                 <div className="w-8" /> {/* Spacer */}
             </div>

             <div className="flex justify-between relative px-2">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 translate-y-[-50%]" />
                <div 
                    className="absolute top-1/2 left-0 h-0.5 bg-orange-500 -z-10 transition-all duration-500 translate-y-[-50%]" 
                    style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                />
                
                {steps.map((s) => (
                    <div key={s.num} className="flex flex-col items-center bg-white px-2">
                    <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        step >= s.num 
                            ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200' 
                            : 'bg-white border-slate-200 text-slate-300'
                        }`}
                    >
                        {step > s.num ? <Check size={16} /> : <span className="text-xs font-bold">{s.num}</span>}
                    </div>
                    <span className={`text-[10px] mt-1 font-medium uppercase tracking-wide ${step >= s.num ? 'text-orange-600' : 'text-slate-300'}`}>
                        {s.title}
                    </span>
                    </div>
                ))}
            </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto p-4 pb-32">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Step 1: Personal Data */}
            {step === 1 && (
                <div className="space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-slate-800">Seus Dados</h2>
                        <p className="text-slate-500 text-sm">Confirme suas informações para agilizar o atendimento.</p>
                    </div>

                    <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Nome Completo</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                <Input 
                                    className="pl-10 h-11 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-orange-500/20" 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                    placeholder="Seu nome"
                                />
                            </div>
                        </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Nascimento</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <Input 
                                        className="pl-10 h-11 bg-slate-50 border-slate-200" 
                                        value={formData.birthDate} 
                                        onChange={e => setFormData({...formData, birthDate: e.target.value})} 
                                        placeholder="DD/MM/AAAA"
                                    />
                                </div>
                            </div>
                             <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Nacionalidade</label>
                                <div className="relative">
                                    <Flag className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <Input 
                                        className="pl-10 h-11 bg-slate-50 border-slate-200" 
                                        value={formData.nationality} 
                                        onChange={e => setFormData({...formData, nationality: e.target.value})} 
                                        placeholder="Brasileira"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Email</label>
                            <Input 
                                className="h-11 bg-slate-50 border-slate-200" 
                                value={formData.email} 
                                onChange={e => setFormData({...formData, email: e.target.value})} 
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Celular</label>
                             <div className="relative">
                                <Smartphone className="absolute left-3 top-3 text-slate-400" size={18} />
                                <Input 
                                    className="pl-10 h-11 bg-slate-50 border-slate-200" 
                                    value={formData.phone} 
                                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                        </div>

                         <div className="pt-2">
                             <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Documento de Identidade</label>
                             <div className="flex gap-2 mb-2">
                                {['CPF', 'RG', 'PASSPORT'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFormData({...formData, docType: type})}
                                        className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${
                                            formData.docType === type 
                                            ? 'bg-sky-50 border-sky-500 text-sky-700' 
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {type === 'PASSPORT' ? 'Passaporte' : type}
                                    </button>
                                ))}
                             </div>
                             <Input 
                                className="h-11 bg-slate-50 border-slate-200 font-mono tracking-wide" 
                                value={formData.docNumber} 
                                onChange={e => setFormData({...formData, docNumber: e.target.value})} 
                                placeholder="Número do documento"
                            />
                         </div>
                    </div>
                </div>
            )}

            {/* Step 2: Upload */}
            {step === 2 && (
                <div className="space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-slate-800">Foto do Documento</h2>
                        <p className="text-slate-500 text-sm">Envie uma foto legível do seu documento (Frente e Verso se possível).</p>
                    </div>

                    <div 
                        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden group ${
                            docFile ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-orange-400 hover:bg-orange-50'
                        }`}
                    >
                        <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                            onChange={(e) => {
                                if (e.target.files?.[0]) setDocFile(e.target.files[0]);
                            }}
                            accept="image/*,application/pdf"
                        />
                        
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                            docFile ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-500'
                        }`}>
                             {docFile ? <Check size={32} /> : <Upload size={32} />}
                        </div>
                        
                        <div className="text-center z-10">
                             {docFile ? (
                                 <>
                                    <p className="font-semibold text-emerald-800 text-lg">Arquivo selecionado!</p>
                                    <p className="text-emerald-600 text-sm mt-1">{docFile.name}</p>
                                    <p className="text-xs text-emerald-500/70 mt-4">Toque para alterar</p>
                                 </>
                             ) : (
                                 <>
                                     <p className="font-semibold text-slate-700 text-lg">Toque para enviar</p>
                                     <p className="text-slate-400 text-sm mt-1">JPG, PNG ou PDF</p>
                                 </>
                             )}
                        </div>
                    </div>
                    
                    <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 flex gap-3">
                         <div className="bg-white p-2 rounded-full h-fit shadow-sm text-sky-500">
                             <FileText size={16} />
                         </div>
                         <div className="text-xs text-sky-800">
                             <p className="font-semibold mb-1">Por que pedimos isso?</p>
                             <p className="opacity-80">Conforme a legislação hoteleira vigente, precisamos manter cópia digital dos documentos de todos os hóspedes.</p>
                         </div>
                    </div>
                </div>
            )}

            {/* Step 3: Signature & Terms */}
            {step === 3 && (
                <div className="space-y-6">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-slate-800">Finalizar</h2>
                        <p className="text-slate-500 text-sm">Assine abaixo para concordar com a Ficha Nacional de Registro de Hóspedes (FNRH).</p>
                    </div>

                    <div className="space-y-4">
                        <div className="border border-slate-300 rounded-2xl overflow-hidden bg-white shadow-sm relative">
                            <SignatureCanvas 
                                ref={sigCanvas}
                                canvasProps={{
                                    className: 'w-full h-64 bg-white cursor-crosshair',
                                }}
                                onEnd={() => setSignatureData(sigCanvas.current?.toDataURL() || null)}
                            />
                            <div className="absolute bottom-3 right-3">
                                 <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-slate-400 hover:text-red-500 text-xs bg-slate-50 hover:bg-red-50 border border-slate-200"
                                    onClick={() => {
                                        sigCanvas.current?.clear();
                                        setSignatureData(null);
                                    }}
                                >
                                    Limpar
                                </Button>
                            </div>
                            {!signatureData && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-slate-200 text-2xl font-bold opacity-30 rotate-[-10deg]">
                                    Assine aqui
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                         <label className="flex items-start gap-3 cursor-pointer">
                            <div className="relative flex items-center mt-0.5">
                                <input 
                                    type="checkbox" 
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 shadow-sm transition-all checked:border-orange-500 checked:bg-orange-500 hover:border-orange-400"
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                />
                                <Check size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
                            </div>
                            <span className="text-sm text-slate-600 leading-tight">
                                Declaro que as informações são verdadeiras e aceito os <a href="#" className="text-sky-600 font-medium underline">Termos de Hospedagem</a> e <a href="#" className="text-sky-600 font-medium underline">Políticas do Hotel</a>.
                            </span>
                        </label>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 z-20">
          <div className="max-w-xl mx-auto flex gap-3">
              {step > 1 && (
                  <Button 
                    variant="outline" 
                    onClick={prevStep} 
                    className="flex-1 h-12 border-slate-200 text-slate-600"
                  >
                      Voltar
                  </Button>
              )}
              
              {step < 3 ? (
                   <Button 
                        onClick={nextStep} 
                        className="flex-[2] h-12 bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-200"
                    >
                        Continuar
                    </Button>
              ) : (
                  <Button 
                    onClick={handleFinish} 
                    className={`flex-[2] h-12 shadow-lg transition-all ${
                        termsAccepted && signatureData 
                        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 text-white' 
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                    disabled={!termsAccepted || !signatureData}
                  >
                     <Check className="mr-2" size={18} /> Finalizar Pré Check-in
                  </Button>
              )}
          </div>
      </div>
    </div>
  );
}
