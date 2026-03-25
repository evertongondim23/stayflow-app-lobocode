import React, { useState, useCallback } from 'react';
import { Button, Card, CardContent, Input, Badge } from '../../components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger, DialogClose } from '../../components/ui/dialog';
import { Slider } from '../../components/ui/slider';
import { Switch } from '../../components/ui/switch';
import { Save, Info, Globe, Server, Key, Upload, Palette, X, Check, Search, Settings, RefreshCw, PlusCircle, CreditCard, Cloud, Filter, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Plug } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/canvasUtils';
import { toast } from 'sonner';

export function AdminSettings() {
  const [themeColor, setThemeColor] = useState('#0284c7'); // Default sky-600
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Cropper state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  // Integration Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Connection Wizard State
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [connectionStep, setConnectionStep] = useState<'form' | 'loading' | 'success'>('form');

  // Integrations Data (Stateful)
  const [integrations, setIntegrations] = useState([
    { id: 'booking', name: 'Booking.com', type: 'OTA', icon: Globe, description: 'Sincronize reservas, tarifas e disponibilidade em tempo real.', popular: true, status: 'connected', lastSync: '5 min atrás', color: '#003580', textColor: 'white' },
    { id: 'expedia', name: 'Expedia', type: 'OTA', icon: Globe, description: 'Conecte-se a uma das maiores agências de viagem do mundo.', popular: false, status: 'connected', lastSync: '5 min atrás', color: '#FFD200', textColor: 'slate-900' },
    { id: 'airbnb', name: 'Airbnb', type: 'OTA', icon: Globe, description: 'Gerencie suas listagens de casas e quartos automaticamente.', popular: true, status: 'disconnected', lastSync: 'Nunca', color: '#FF5A5F', textColor: 'white' },
    { id: 'stripe', name: 'Stripe', type: 'Pagamentos', icon: CreditCard, description: 'Processamento de pagamentos seguro para cartões de crédito.', popular: true, status: 'disconnected', lastSync: 'Nunca', color: '#635BFF', textColor: 'white' },
    { id: 'paypal', name: 'PayPal', type: 'Pagamentos', icon: CreditCard, description: 'Receba pagamentos via carteira digital global.', popular: false, status: 'disconnected', lastSync: 'Nunca', color: '#003087', textColor: 'white' },
    { id: 'cloudbeds', name: 'Cloudbeds', type: 'PMS', icon: Cloud, description: 'Sistema de gestão de propriedades tudo-em-um.', popular: false, status: 'disconnected', lastSync: 'Nunca', color: '#00A4E4', textColor: 'white' },
    { id: 'omnibees', name: 'Omnibees', type: 'Channel', icon: Server, description: 'Distribuição hoteleira e channel manager líder no Brasil.', popular: false, status: 'disconnected', lastSync: 'Nunca', color: '#F39200', textColor: 'white' },
  ]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSaveCroppedImage = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
        setLogoPreview(croppedImage);
        setIsCropping(false);
        setImageSrc(null);
        setZoom(1);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleCancelCrop = () => {
    setIsCropping(false);
    setImageSrc(null);
    setZoom(1);
  };

  // Integration Logic
  const handleStartConnection = (id: string) => {
    setSelectedIntegration(id);
    setConnectionStep('form');
  };

  const handleBackToGallery = () => {
    setSelectedIntegration(null);
    setConnectionStep('form');
  };

  const handleConnect = () => {
    setConnectionStep('loading');
    
    // Simulate API Call
    setTimeout(() => {
      setConnectionStep('success');
      
      // Update List Status
      setIntegrations(prev => prev.map(item => 
        item.id === selectedIntegration 
          ? { ...item, status: 'connected', lastSync: 'Agora mesmo' } 
          : item
      ));

      // Close modal after success
      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedIntegration(null);
        toast.success("Integração conectada com sucesso!");
      }, 1500);

    }, 2000);
  };

  const connectedIntegrations = integrations.filter(i => i.status === 'connected');
  
  const filteredIntegrations = integrations.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.type.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const activeIntegrationData = integrations.find(i => i.id === selectedIntegration);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Configurações Gerais</h1>
          <p className="text-slate-500">Dados do hotel, branding, regras operacionais e integrações.</p>
        </div>
        <Button 
          className="bg-sky-600 hover:bg-sky-700 gap-2"
          onClick={() => toast.success("Configurações salvas com sucesso!", {
            description: "As alterações foram aplicadas ao sistema."
          })}
        >
          <Save size={18} /> Salvar Alterações
        </Button>
      </div>

      <div className="space-y-6">
        
        {/* Branding Section */}
        <section>
          <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Palette size={20} className="text-sky-600" /> Branding & Visual
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Logo Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700">Logo do Hotel</label>
                  <div className="flex items-start gap-6">
                    <div className="w-32 h-32 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden relative group">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                      ) : (
                        <div className="text-center p-4">
                          <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                          <span className="text-xs text-slate-400">800x800px</span>
                        </div>
                      )}
                      
                      {!logoPreview && (
                         <input 
                           type="file" 
                           accept="image/*"
                           onChange={handleLogoUpload}
                           className="absolute inset-0 opacity-0 cursor-pointer"
                         />
                      )}
                      
                      {logoPreview && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <span className="text-white text-xs font-bold">Alterar</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm text-slate-600">
                        Carregue a logomarca do seu hotel para ser exibida nos e-mails, voucher e painel.
                      </p>
                      <p className="text-xs text-slate-400">
                        Formato recomendado: PNG ou JPG.<br/>
                        Tamanho ideal: 800x800px (quadrado).
                      </p>
                      <Button variant="outline" size="sm" className="relative">
                        Selecionar Arquivo
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Color Theme */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-slate-700">Cor Principal do Tema</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg shadow-sm border border-slate-200" style={{ backgroundColor: themeColor }}></div>
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <Input 
                          type="color" 
                          value={themeColor}
                          onChange={(e) => setThemeColor(e.target.value)}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input 
                          type="text" 
                          value={themeColor}
                          onChange={(e) => setThemeColor(e.target.value)}
                          className="font-mono uppercase"
                          maxLength={7}
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Essa cor será aplicada em botões, links e destaques em todas as telas do sistema.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Hotel Info Section */}
        <section>
          <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Info size={20} className="text-sky-600" /> Informações do Estabelecimento
          </h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome Fantasia</label>
                  <Input defaultValue="StayFlow Demo Hotel" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ</label>
                  <Input defaultValue="12.345.678/0001-90" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefone Principal</label>
                  <Input defaultValue="+55 11 3000-0000" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Endereço Completo</label>
                  <Input defaultValue="Av. Paulista, 1000 - São Paulo, SP" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                  <Input defaultValue="https://www.grandhoteldemo.com.br" icon={Globe} />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Operations Section */}
        <section>
          <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Key size={20} className="text-sky-600" /> Regras Operacionais
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Horário de Check-in</label>
                  <Input type="time" defaultValue="14:00" />
                  <p className="text-xs text-slate-500 mt-1">Horário padrão para início das diárias.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Horário de Check-out</label>
                  <Input type="time" defaultValue="12:00" />
                  <p className="text-xs text-slate-500 mt-1">Horário limite para liberação do quarto.</p>
                </div>
                <div className="col-span-2 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-800">Pré Check-in Online</h4>
                      <p className="text-sm text-slate-500">Permitir que hóspedes enviem documentos antecipadamente.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Integrations Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
              <Server size={20} className="text-sky-600" /> Integrações (PMS/Channel)
            </h2>
            <Button variant="ghost" size="sm" className="text-sky-600 hover:text-sky-700 hover:bg-sky-50">
              <RefreshCw size={16} className="mr-2" /> Sincronizar Tudo
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {/* List Header */}
              <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <div className="col-span-5 md:col-span-4">Parceiro</div>
                <div className="col-span-3 md:col-span-3">Status</div>
                <div className="col-span-4 md:col-span-3 hidden md:block">Última Sync</div>
                <div className="col-span-4 md:col-span-2 text-right">Ações</div>
              </div>

              {/* Connected Integrations List */}
              <div className="divide-y divide-slate-100">
                {connectedIntegrations.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    Nenhuma integração ativa no momento.
                  </div>
                ) : (
                  connectedIntegrations.map((integration) => (
                    <div key={integration.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors group">
                      <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm"
                          style={{ backgroundColor: integration.color, color: integration.textColor }}
                        >
                          {integration.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">{integration.name}</div>
                          <div className="text-xs text-slate-500">{integration.type}</div>
                        </div>
                      </div>
                      <div className="col-span-3 md:col-span-3">
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 shadow-none px-2 py-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                          Conectado
                        </Badge>
                      </div>
                      <div className="col-span-4 md:col-span-3 hidden md:block text-sm text-slate-500">
                        {integration.lastSync}
                      </div>
                      <div className="col-span-4 md:col-span-2 flex justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-sky-600" title="Configurações">
                          <Settings size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-sky-600" title="Sincronizar Agora">
                          <RefreshCw size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Footer Action */}
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full h-auto py-4 border-2 border-dashed border-slate-300 bg-white text-slate-500 hover:border-sky-500 hover:bg-sky-50 hover:text-sky-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md group"
                    >
                      <PlusCircle size={20} className="text-slate-400 group-hover:text-sky-600" />
                      <span className="font-medium">Adicionar Nova Integração</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="flex h-[min(85vh,56rem)] max-h-[90vh] w-full max-w-3xl flex-col gap-0 overflow-hidden bg-slate-50/50 p-0 sm:max-w-3xl">
                    
                    {/* GALLERY VIEW */}
                    {!selectedIntegration && (
                      <>
                        <div className="p-6 border-b border-slate-100 bg-white">
                          <DialogHeader>
                            <DialogTitle className="text-xl">Galeria de Integrações</DialogTitle>
                            <DialogDescription>
                              Conecte seu hotel às principais plataformas do mercado.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-6 flex gap-4">
                            <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <Input 
                                placeholder="Buscar integrações (ex: Booking, Stripe)..." 
                                className="pl-10 bg-slate-50 border-slate-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </div>
                            <div className="flex gap-2">
                               <Button 
                                 variant={selectedCategory === 'all' ? 'default' : 'outline'}
                                 onClick={() => setSelectedCategory('all')}
                                 size="sm"
                                 className={selectedCategory === 'all' ? 'bg-slate-800' : ''}
                               >
                                 Todos
                               </Button>
                               <Button 
                                 variant={selectedCategory === 'OTA' ? 'default' : 'outline'} 
                                 onClick={() => setSelectedCategory('OTA')}
                                 size="sm"
                                 className={selectedCategory === 'OTA' ? 'bg-slate-800' : ''}
                               >
                                 OTAs
                               </Button>
                               <Button 
                                 variant={selectedCategory === 'Pagamentos' ? 'default' : 'outline'} 
                                 onClick={() => setSelectedCategory('Pagamentos')}
                                 size="sm"
                                 className={selectedCategory === 'Pagamentos' ? 'bg-slate-800' : ''}
                               >
                                 Pagamentos
                               </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredIntegrations.map((integration) => (
                              <div key={integration.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow flex flex-col h-full">
                                 <div className="flex justify-between items-start mb-3">
                                    <div 
                                      className="p-2 rounded-lg border border-slate-100"
                                      style={{ backgroundColor: `${integration.color}15` }} // 10% opacity
                                    >
                                       <integration.icon size={24} style={{ color: integration.color }} />
                                    </div>
                                    {integration.popular && (
                                      <Badge variant="secondary" className="text-[10px] bg-amber-100 text-amber-700 hover:bg-amber-100">
                                        Popular
                                      </Badge>
                                    )}
                                 </div>
                                 <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                                   {integration.name}
                                   {integration.status === 'connected' && <CheckCircle2 size={14} className="text-emerald-500" />}
                                 </h3>
                                 <p className="text-xs text-slate-500 mb-4 flex-1 line-clamp-2">
                                   {integration.description}
                                 </p>
                                 
                                 {integration.status === 'connected' ? (
                                   <Button variant="outline" className="w-full border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800" disabled>
                                     <Check size={16} className="mr-2" /> Conectado
                                   </Button>
                                 ) : (
                                   <Button 
                                    className="w-full bg-slate-900 text-white hover:bg-sky-600 transition-colors" 
                                    size="sm"
                                    onClick={() => handleStartConnection(integration.id)}
                                   >
                                     Conectar
                                   </Button>
                                 )}
                              </div>
                            ))}
                            
                            {filteredIntegrations.length === 0 && (
                              <div className="col-span-full py-12 text-center text-slate-400">
                                <p>Nenhuma integração encontrada para "{searchQuery}".</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* CONNECTION WIZARD VIEW */}
                    {selectedIntegration && activeIntegrationData && (
                       <div className="flex min-h-0 flex-1 flex-col bg-white animate-in slide-in-from-right duration-300">
                          {/* Header */}
                          <div className="flex shrink-0 items-center gap-4 border-b border-slate-100 px-8 py-6">
                            <Button variant="ghost" size="icon" onClick={handleBackToGallery} className="-ml-2 shrink-0">
                              <ArrowLeft size={20} className="text-slate-500" />
                            </Button>
                            <div className="min-w-0 pr-10">
                              <h2 className="text-xl font-bold tracking-tight text-slate-800">
                                Configurar {activeIntegrationData.name}
                              </h2>
                              <p className="mt-1 text-sm text-slate-500">
                                Etapa 1 de 2: Credenciais
                              </p>
                            </div>
                          </div>

                          {connectionStep === 'form' && (
                            <>
                              <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-6 pt-10 sm:px-10">
                                <div className="animate-in fade-in zoom-in-95 mx-auto w-full max-w-md space-y-10 duration-300">
                                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-8 py-8 text-center shadow-sm">
                                     <div
                                        className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-md"
                                        style={{ backgroundColor: activeIntegrationData.color, color: activeIntegrationData.textColor }}
                                      >
                                        {activeIntegrationData.type === 'OTA' ? <Globe size={32} strokeWidth={2} /> : <CreditCard size={32} strokeWidth={2} />}
                                      </div>
                                      <h3 className="text-base font-semibold text-slate-900">
                                        Autenticação necessária
                                      </h3>
                                      <p className="mt-3 text-sm leading-relaxed text-slate-500">
                                        Para conectar o {activeIntegrationData.name}, insira suas credenciais de API abaixo.
                                      </p>
                                  </div>

                                  <div className="space-y-7">
                                    <div className="space-y-3">
                                      <label htmlFor="integration-client-id" className="text-sm font-medium text-slate-700">
                                        Client ID / Hotel ID
                                      </label>
                                      <Input id="integration-client-id" className="h-11 rounded-xl border-slate-200" placeholder="Ex: 12345678" />
                                    </div>
                                    <div className="space-y-3">
                                      <label htmlFor="integration-secret" className="text-sm font-medium text-slate-700">
                                        API Secret Key
                                      </label>
                                      <Input id="integration-secret" type="password" className="h-11 rounded-xl border-slate-200" placeholder="••••••••••••••••" />
                                    </div>
                                    <div className="flex gap-3 rounded-xl border border-amber-200/80 bg-amber-50 p-4 text-sm leading-snug text-amber-900">
                                      <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" aria-hidden />
                                      <p>
                                        Estas informações estão no painel do parceiro ({activeIntegrationData.name}).
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="shrink-0 border-t border-slate-100 bg-white px-8 py-5 shadow-[0_-4px_24px_-8px_rgba(15,23,42,0.08)] sm:px-10">
                                <div className="mx-auto w-full max-w-md">
                                  <Button
                                    type="button"
                                    className="h-12 w-full rounded-xl bg-slate-900 text-base font-semibold shadow-sm hover:bg-sky-600"
                                    onClick={handleConnect}
                                  >
                                    <Plug className="mr-2 size-5" />
                                    Integrar
                                  </Button>
                                  <p className="mt-3 text-center text-xs text-slate-400">
                                    Ao integrar, validaremos as credenciais em ambiente seguro.
                                  </p>
                                </div>
                              </div>
                            </>
                          )}

                          {connectionStep === 'loading' && (
                            <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
                              <div className="relative animate-in fade-in duration-300">
                                <div className="mx-auto h-16 w-16 rounded-full border-4 border-slate-100 border-t-sky-600 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Server size={20} className="text-slate-400" />
                                </div>
                              </div>
                              <div className="mt-8 space-y-2">
                                <h3 className="text-lg font-medium text-slate-900">Verificando conexão…</h3>
                                <p className="max-w-sm text-sm text-slate-500">
                                  Estamos validando suas credenciais com {activeIntegrationData.name}.
                                </p>
                              </div>
                            </div>
                          )}

                          {connectionStep === 'success' && (
                            <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center animate-in zoom-in-95 duration-300">
                              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                                <Check size={40} className="text-emerald-600" strokeWidth={2} />
                              </div>
                              <h3 className="text-2xl font-bold text-slate-900">Sucesso!</h3>
                              <p className="mt-3 max-w-sm text-slate-500">
                                A integração com <span className="font-semibold text-slate-900">{activeIntegrationData.name}</span> foi estabelecida.
                              </p>
                            </div>
                          )}
                       </div>
                    )}
                    
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </section>

      </div>

      {/* Image Crop Dialog */}
      <Dialog open={isCropping} onOpenChange={(open) => !open && handleCancelCrop()}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Ajustar Logo</DialogTitle>
             <DialogDescription>
              Ajuste o enquadramento da sua logomarca.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="relative w-full h-80 bg-slate-900 rounded-lg overflow-hidden">
              {imageSrc && (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  showGrid={true}
                />
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Zoom</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <Slider 
                value={[zoom]} 
                min={1} 
                max={3} 
                step={0.1} 
                onValueChange={(value) => setZoom(value[0])}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelCrop}>
              <X size={16} className="mr-2" /> Cancelar
            </Button>
            <Button onClick={handleSaveCroppedImage} className="bg-sky-600 hover:bg-sky-700">
              <Check size={16} className="mr-2" /> Confirmar Recorte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
