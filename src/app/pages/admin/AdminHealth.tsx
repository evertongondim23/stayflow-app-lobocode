import React from 'react';
import { Button, Card, CardContent, Badge } from '../../components/ui';
import { Activity, Server, Database, Wifi, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export function AdminHealth() {
  const services = [
    { name: 'API Gateway', status: 'operational', latency: '45ms', uptime: '99.99%' },
    { name: 'Database Primary', status: 'operational', latency: '12ms', uptime: '99.95%' },
    { name: 'Storage Service', status: 'operational', latency: '120ms', uptime: '99.90%' },
    { name: 'Email Provider', status: 'degraded', latency: '800ms', uptime: '98.50%', message: 'High latency detected' },
    { name: 'Integration: Booking.com', status: 'operational', latency: '-', uptime: '99.00%' },
    { name: 'Integration: Stripe', status: 'operational', latency: '-', uptime: '100%' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Monitoramento do Sistema</h1>
          <p className="text-slate-500">Status em tempo real da infraestrutura e integrações.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw size={18} /> Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HealthCard 
          title="Saúde Geral" 
          status="Operational" 
          icon={Activity}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <HealthCard 
          title="Banco de Dados" 
          status="Healthy" 
          details="Conexões: 45/100"
          icon={Database}
          color="text-sky-600"
          bg="bg-sky-50"
        />
        <HealthCard 
          title="Integrações" 
          status="Warning" 
          details="Email Service Lento"
          icon={Wifi}
          color="text-orange-600"
          bg="bg-orange-50"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Serviço</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Latência</th>
                  <th className="px-6 py-4">Uptime (30d)</th>
                  <th className="px-6 py-4 text-right">Mensagem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {services.map((service) => (
                  <tr key={service.name} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-700 flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        service.status === 'operational' ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'
                      }`}></div>
                      {service.name}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={service.status === 'operational' ? 'default' : 'warning'}>
                        {service.status === 'operational' ? 'Operacional' : 'Degradado'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500">{service.latency}</td>
                    <td className="px-6 py-4 text-slate-600">{service.uptime}</td>
                    <td className="px-6 py-4 text-right text-orange-600 text-xs font-medium">
                      {service.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function HealthCard({ title, status, details, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-l-4 border-l-current" style={{borderLeftColor: status === 'Warning' ? '#f97316' : '#10b981'}}>
      <CardContent className="p-6 flex items-start justify-between">
        <div>
          <p className="text-slate-500 font-medium text-sm mb-1">{title}</p>
          <h3 className={`text-xl font-bold ${status === 'Warning' ? 'text-orange-700' : 'text-slate-800'}`}>
            {status}
          </h3>
          {details && <p className="text-xs text-slate-400 mt-2">{details}</p>}
        </div>
        <div className={`p-3 rounded-xl ${bg} ${color}`}>
          <Icon size={24} />
        </div>
      </CardContent>
    </Card>
  );
}