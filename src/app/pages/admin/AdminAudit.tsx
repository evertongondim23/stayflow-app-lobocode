import React from 'react';
import { Button, Card, CardContent, Input, Badge } from '../../components/ui';
import { ShieldCheck, Search, Filter, Download } from 'lucide-react';

export function AdminAudit() {
  const logs = [
    { id: 1, user: 'Ana Receptionist', action: 'CHECK_IN', target: 'Reserva #1234', timestamp: '12/10/2023 14:32', ip: '192.168.1.15' },
    { id: 2, user: 'Carlos Manager', action: 'OVERRIDE_PRICE', target: 'Reserva #1234', details: 'Desconto autorizado (VIP)', timestamp: '12/10/2023 14:35', ip: '192.168.1.20' },
    { id: 3, user: 'Fernanda Finance', action: 'EXPORT_REPORT', target: 'Financeiro Set/23', timestamp: '12/10/2023 15:00', ip: '192.168.1.18' },
    { id: 4, user: 'System', action: 'AUTO_BACKUP', target: 'Database', timestamp: '12/10/2023 03:00', ip: 'localhost' },
    { id: 5, user: 'Ana Receptionist', action: 'GUEST_UPDATE', target: 'Hóspede: João Silva', details: 'Telefone alterado', timestamp: '12/10/2023 16:10', ip: '192.168.1.15' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Auditoria e Compliance</h1>
          <p className="text-slate-500">Registro imutável de todas as ações no sistema (LGPD).</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download size={18} /> Exportar Logs
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {/* Filters */}
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-4 rounded-t-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input placeholder="Buscar por usuário, ação ou alvo..." className="pl-10 bg-white" />
            </div>
            <Button variant="outline" className="bg-white gap-2 text-slate-600">
              <Filter size={18} /> Filtros Avançados
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 w-48">Data/Hora</th>
                  <th className="px-6 py-3">Usuário</th>
                  <th className="px-6 py-3">Ação</th>
                  <th className="px-6 py-3">Alvo/Detalhes</th>
                  <th className="px-6 py-3 text-right">IP Origem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-mono text-slate-500 text-xs">{log.timestamp}</td>
                    <td className="px-6 py-3 font-medium text-slate-700">{log.user}</td>
                    <td className="px-6 py-3">
                      <Badge variant="outline" className="font-mono text-xs bg-slate-50">
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      <div className="font-medium">{log.target}</div>
                      {log.details && <div className="text-xs text-slate-400 mt-0.5">{log.details}</div>}
                    </td>
                    <td className="px-6 py-3 text-right font-mono text-xs text-slate-400">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-400 rounded-b-xl">
            Mostrando 50 de 12.403 registros. Os logs são retidos por 5 anos conforme política de compliance.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}