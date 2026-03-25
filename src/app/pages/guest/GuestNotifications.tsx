import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, CardContent } from '../../components/ui';
import { ArrowLeft, Bell, CheckCheck, Wifi, Coffee, Info, Tag, Clock } from 'lucide-react';
import { toast } from 'sonner';

// Mock Data for Notifications
const MOCK_NOTIFICATIONS = [
  { 
    id: 1, 
    type: 'info',
    title: 'Bem-vindo ao StayFlow', 
    message: 'Esperamos que você tenha uma estadia incrível! O café da manhã é servido das 6h às 10h.', 
    time: 'Há 2 horas', 
    read: true,
    icon: Info
  },
  { 
    id: 2, 
    type: 'wifi',
    title: 'Senha do Wi-Fi', 
    message: 'Conecte-se à rede "GrandGuest" utilizando a senha "guest2023".', 
    time: 'Há 1 hora', 
    read: false,
    icon: Wifi
  },
  { 
    id: 3, 
    type: 'promo',
    title: 'Happy Hour no Bar', 
    message: 'Drinks em dobro hoje até as 20h. Apresente este aviso ao garçom.', 
    time: 'Agora mesmo', 
    read: false,
    icon: Coffee
  },
];

export function GuestNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Todas as notificações foram marcadas como lidas.');
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-safe">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} className="text-slate-600" />
            </Button>
            <div>
               <h1 className="text-lg font-bold text-slate-900 leading-none">Notificações</h1>
               <span className="text-xs text-slate-500 font-medium">
                  {unreadCount > 0 ? `${unreadCount} nova(s)` : 'Nenhuma nova'}
               </span>
            </div>
          </div>
          {unreadCount > 0 && (
             <button onClick={markAllAsRead} className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
                <CheckCheck size={14} /> Marcar lidas
             </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
               <Bell size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-700">Tudo limpo por aqui</h3>
            <p className="text-slate-500 text-sm">Você não tem novas notificações no momento.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <Card 
               key={notif.id} 
               className={`transition-all duration-300 border overflow-hidden ${
                  notif.read ? 'bg-white border-slate-100 opacity-80' : 'bg-white border-sky-200 shadow-md shadow-sky-100'
               }`}
               onClick={() => markAsRead(notif.id)}
            >
               <div className={`h-1 w-full ${notif.read ? 'bg-slate-200' : 'bg-sky-500'}`} />
               <CardContent className="p-4 flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex shrink-0 items-center justify-center ${
                     notif.read ? 'bg-slate-100 text-slate-400' : 'bg-sky-50 text-sky-600'
                  }`}>
                     <notif.icon size={20} />
                  </div>
                  <div className="flex-1 space-y-1">
                     <div className="flex justify-between items-start">
                        <h3 className={`font-bold text-sm ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>
                           {notif.title}
                        </h3>
                        {!notif.read && (
                           <span className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-1.5" />
                        )}
                     </div>
                     <p className="text-sm text-slate-600 leading-relaxed">{notif.message}</p>
                     <div className="pt-2 flex items-center gap-1 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        <Clock size={10} /> {notif.time}
                     </div>
                  </div>
               </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
