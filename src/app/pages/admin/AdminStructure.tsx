import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Button, Card, CardContent, Input, Badge } from '../../components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger, DialogClose } from '../../components/ui/dialog';
import { Plus, Trash2, Edit2, BedDouble, Check, Hotel, ArrowUpCircle } from 'lucide-react';
import { toast } from 'sonner';

export function AdminStructure() {
  const { rooms } = useHotel();
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // Mock types for demo
  const roomTypes = [
    { id: 'standard', name: 'Standard', capacity: 2, basePrice: 250 },
    { id: 'deluxe', name: 'Deluxe', capacity: 3, basePrice: 350 },
    { id: 'suite', name: 'Suíte Presidencial', capacity: 4, basePrice: 800 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Estrutura e Quartos</h1>
          <p className="text-slate-500">Gerencie a capacidade física e tipos de acomodação.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">Gerenciar Tipos</Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-sky-600 hover:bg-sky-700 gap-2 shadow-sm transition-all hover:shadow-md">
                <Plus size={18} /> Novo Quarto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-slate-50 p-0 gap-0 overflow-hidden">
              <div className="bg-white p-6 border-b border-slate-100">
                <DialogHeader>
                  <DialogTitle className="text-xl text-slate-800 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                      <Hotel size={18} />
                    </div>
                    Adicionar Acomodação
                  </DialogTitle>
                  <DialogDescription className="text-slate-500">
                    Cadastre um novo quarto na estrutura do hotel.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Número do Quarto</label>
                    <Input placeholder="Ex: 305" className="bg-white font-mono" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Andar</label>
                    <div className="relative">
                      <Input placeholder="3" className="bg-white pl-9" />
                      <ArrowUpCircle size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Categoria</label>
                  <div className="grid grid-cols-1 gap-3">
                    {roomTypes.map((type) => (
                      <label key={type.id} className="cursor-pointer border border-slate-200 bg-white p-3 rounded-lg flex items-center justify-between hover:border-sky-500 hover:bg-sky-50 transition-all [&:has(input:checked)]:border-sky-600 [&:has(input:checked)]:bg-sky-50 [&:has(input:checked)]:shadow-sm">
                        <div className="flex items-center gap-3">
                          <input type="radio" name="roomType" className="accent-sky-600 w-4 h-4" defaultChecked={type.id === 'standard'} />
                          <div>
                            <span className="font-medium text-slate-900 block text-sm">{type.name}</span>
                            <span className="text-xs text-slate-500">Capacidade: {type.capacity} pax</span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">R$ {type.basePrice}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Status Inicial</label>
                  <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent">
                    <option value="AVAILABLE">Disponível</option>
                    <option value="MAINTENANCE">Manutenção (Bloqueado)</option>
                    <option value="CLEANING">Limpeza</option>
                  </select>
                </div>
              </div>

              <DialogFooter className="p-6 bg-white border-t border-slate-100">
                <DialogClose asChild>
                  <Button variant="ghost">Cancelar</Button>
                </DialogClose>
                <Button className="bg-sky-600 hover:bg-sky-700" onClick={() => {
                  toast.success("Quarto criado com sucesso!", {
                    description: "A nova unidade já está disponível no inventário."
                  });
                }}>
                  Salvar Quarto
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Room Types Summary */}
        <Card className="md:col-span-3">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-4">Tipos de Quarto</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {roomTypes.map(type => (
                <div key={type.id} className="p-4 border border-slate-200 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800">{type.name}</span>
                    <p className="text-sm text-slate-500">Capacidade: {type.capacity} pessoas</p>
                  </div>
                  <span className="text-sky-600 font-bold">R$ {type.basePrice}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Room List */}
        <Card className="md:col-span-3">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Número</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Andar</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Características</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rooms.map((room) => (
                    <tr key={room.number} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                        <BedDouble size={16} className="text-slate-400" />
                        {room.number}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-medium text-xs">
                          {room.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">{room.number.charAt(0)}º Andar</td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          room.status === 'OCCUPIED' ? 'destructive' : 
                          room.status === 'CLEANING' ? 'warning' : 'secondary'
                        }>
                          {room.status === 'OCCUPIED' ? 'Ocupado' : 
                           room.status === 'CLEANING' ? 'Limpeza' : 'Disponível'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {/* Mock features */}
                        <div className="flex gap-1">
                          <span title="Ar Condicionado" className="p-1 bg-slate-100 rounded"><Check size={12}/></span>
                          <span title="TV Smart" className="p-1 bg-slate-100 rounded"><Check size={12}/></span>
                          <span title="Frigobar" className="p-1 bg-slate-100 rounded"><Check size={12}/></span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
                          <Edit2 size={16}/>
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                          <Trash2 size={16}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
