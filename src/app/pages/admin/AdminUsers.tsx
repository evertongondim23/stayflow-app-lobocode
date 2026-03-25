import React from 'react';
import { Button, Input, Badge, Card, CardContent } from '../../components/ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger, DialogClose } from '../../components/ui/dialog';
import { Plus, Search, MoreVertical, Mail, Shield, Clock, Info, Trash2, Edit2, UserCheck, UserX, User } from 'lucide-react';
import { toast } from 'sonner';

export function AdminUsers() {
  const users = [
    { id: 1, name: 'Ana Receptionist', email: 'ana@hotel.com', role: 'Recepção', status: 'active', lastAccess: 'Agora' },
    { id: 2, name: 'Carlos Manager', email: 'carlos@hotel.com', role: 'Gerente', status: 'active', lastAccess: '2h atrás' },
    { id: 3, name: 'Fernanda Finance', email: 'financeiro@hotel.com', role: 'Financeiro', status: 'active', lastAccess: '1d atrás' },
    { id: 4, name: 'System Admin', email: 'admin@hotel.com', role: 'Admin', status: 'active', lastAccess: '5m atrás' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Usuários e Permissões</h1>
          <p className="text-slate-500">Gerencie o acesso da equipe ao sistema.</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-sky-600 hover:bg-sky-700 gap-2 shadow-sm transition-all hover:shadow-md">
              <Plus size={18} /> Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-slate-50 p-0 gap-0 overflow-hidden">
            <div className="bg-white p-6 border-b border-slate-100">
              <DialogHeader>
                <DialogTitle className="text-xl text-slate-800 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                    <Plus size={18} />
                  </div>
                  Adicionar Novo Usuário
                </DialogTitle>
                <DialogDescription className="text-slate-500">
                  Crie uma conta de acesso para um membro da equipe.
                </DialogDescription>
              </DialogHeader>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nome Completo</label>
                  <Input placeholder="Ex: João Silva" className="bg-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">E-mail Corporativo</label>
                  <Input placeholder="joao@hotel.com" type="email" className="bg-white" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Cargo / Função</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="relative cursor-pointer group">
                    <input type="radio" name="role" className="peer sr-only" defaultChecked />
                    <div className="p-4 rounded-xl border-2 border-slate-200 hover:border-sky-200 bg-white transition-all peer-checked:border-sky-600 peer-checked:bg-sky-50 flex flex-col gap-3 h-full shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-600 peer-checked:bg-sky-200 peer-checked:text-sky-700 transition-colors">
                          <User size={20} />
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 peer-checked:border-sky-600 peer-checked:border-[6px] transition-all"></div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">Recepção</span>
                        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Operacional & Check-in</span>
                      </div>
                    </div>
                  </label>
                  
                  <label className="relative cursor-pointer group">
                    <input type="radio" name="role" className="peer sr-only" />
                    <div className="p-4 rounded-xl border-2 border-slate-200 hover:border-sky-200 bg-white transition-all peer-checked:border-sky-600 peer-checked:bg-sky-50 flex flex-col gap-3 h-full shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="p-2 rounded-lg bg-slate-100 text-slate-600 peer-checked:bg-sky-200 peer-checked:text-sky-700 transition-colors">
                          <Shield size={20} />
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 peer-checked:border-sky-600 peer-checked:border-[6px] transition-all"></div>
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">Gerente</span>
                        <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Acesso Administrativo</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Senha Temporária</label>
                <div className="grid grid-cols-2 gap-6">
                  <Input placeholder="••••••••" type="password" className="bg-white" />
                  <p className="text-[10px] text-slate-500 flex items-center">
                    <Info size={12} className="mr-1 text-sky-600" />
                    O usuário deverá definir uma nova senha no primeiro acesso.
                  </p>
                </div>
              </div>

               <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-xs">
                <Info size={14} className="shrink-0" />
                <span>Novos usuários receberão um convite por e-mail com link de expiração de 24 horas.</span>
              </div>
            </div>

            <DialogFooter className="p-6 bg-white border-t border-slate-100">
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button className="bg-sky-600 hover:bg-sky-700" onClick={() => {
                toast.success("Convite enviado com sucesso!", {
                  description: "O usuário receberá as instruções por e-mail."
                });
              }}>
                Enviar Convite
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-100 flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input placeholder="Buscar usuário..." className="pl-10" />
            </div>
            <div className="flex gap-2 ml-auto">
               <Button variant="outline" size="sm" className="text-slate-600">
                 <FilterIcon className="mr-2" size={16} /> Filtros
               </Button>
            </div>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Função</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Último Acesso</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Shield size={16} className="text-slate-400" />
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 shadow-none">
                      Ativo
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-300" />
                      {user.lastAccess}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-sky-600">
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function FilterIcon({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}
