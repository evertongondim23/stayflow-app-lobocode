import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHotel } from '../../context/HotelContext';
import { Button, Card, CardContent, Avatar, AvatarFallback, AvatarImage } from '../../components/ui';
import { ArrowLeft, Save, Camera, Mail, Phone, User, ShieldAlert, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PATHS } from '../../routes';

export function GuestProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reservations, guests, updateGuestData } = useHotel();
  
  const reservation = reservations.find(r => r.id === id);
  const guest = guests.find(g => g.id === reservation?.guestId);

  // Refs for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local state for editing
  const [formData, setFormData] = useState({
    email: guest?.email || '',
    phone: guest?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (!reservation || !guest) return null;

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      updateGuestData(guest.id, formData);
      setLoading(false);
      toast.success('Dados atualizados com sucesso!');
    }, 1000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB.');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      // Simulate network delay
      setTimeout(() => {
        const base64String = reader.result as string;
        updateGuestData(guest.id, { avatarUrl: base64String });
        setUploading(false);
        toast.success('Foto de perfil atualizada!');
      }, 1500);
    };
    reader.onerror = () => {
      setUploading(false);
      toast.error('Erro ao ler o arquivo.');
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-safe">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center p-4 gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} className="text-slate-600" />
          </Button>
          <h1 className="text-lg font-bold text-slate-900">Meus Dados</h1>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-lg mx-auto">
        
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg relative overflow-hidden">
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                  <Loader2 className="animate-spin text-white" size={24} />
                </div>
              )}
              {guest.avatarUrl ? (
                <AvatarImage src={guest.avatarUrl} alt={guest.name} className="object-cover w-full h-full" />
              ) : null}
              <AvatarFallback className="bg-sky-600 text-white text-3xl font-bold">
                {guest.name.substring(0,2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <button 
              className="absolute bottom-0 right-0 bg-slate-900 text-white p-2.5 rounded-full border-2 border-white shadow-md hover:bg-slate-800 hover:scale-110 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 z-10"
              aria-label="Alterar foto de perfil"
              onClick={triggerFileInput}
              disabled={uploading}
            >
              <Camera size={16} />
            </button>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-900">{guest.name}</h2>
            <p className="text-slate-500 text-sm">Hóspede desde 2023</p>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <User size={16} /> Informações de Contato
          </h3>
          
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                  <Mail size={14} /> E-mail
                </label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                  <Phone size={14} /> Telefone / WhatsApp
                </label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Read-only Fields */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert size={16} /> Dados Protegidos
          </h3>
          <p className="text-xs text-slate-500 px-1">
            Para alterar estes dados, por favor dirija-se à recepção com um documento original.
          </p>
          
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-4 space-y-4 opacity-80">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Nome Completo</label>
                <div className="font-medium text-slate-700">{guest.name}</div>
              </div>
              <div className="border-t border-slate-200" />
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase">Documento (CPF/Passaporte)</label>
                <div className="font-medium text-slate-700">{guest.document || '---'}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button 
          className="w-full h-12 text-lg font-bold shadow-lg shadow-sky-900/10 sticky bottom-6" 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? (
             <span className="flex items-center gap-2">Salvando...</span>
          ) : (
             <span className="flex items-center gap-2"><Save size={18} /> Salvar Alterações</span>
          )}
        </Button>

        <Button 
          variant="outline" 
          className="w-full text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          onClick={() => {
            toast.success("Sessão encerrada com sucesso.");
            navigate(PATHS.home);
          }}
        >
          Sair da Conta
        </Button>

      </div>
    </div>
  );
}
