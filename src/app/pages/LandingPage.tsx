import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotel } from '../context/HotelContext';
import { Button, Card, CardContent } from '../components/ui';
import { LogIn, Key, CreditCard, LayoutDashboard, ShieldCheck, ArrowLeft } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { PATHS } from '../routes';

export function LandingPage() {
  const navigate = useNavigate();
  const { reservations } = useHotel();

  // Helpers para encontrar as reservas mockadas corretas
  const invitedRes = reservations.find(r => r.status === 'INVITED'); // João
  const checkedInRes = reservations.find(r => r.status === 'CHECKED_IN'); // Maria
  const checkoutRes = reservations.find(r => r.status === 'CHECKOUT_PENDING' || (r.status === 'CHECKED_IN' && r.balance > 1000)); // Carlos (ou similar)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full space-y-8">
        <div className="flex justify-start">
          <Button
            variant="ghost"
            className="gap-2 text-slate-600 hover:text-sky-700 -ml-2"
            onClick={() => navigate(PATHS.home)}
          >
            <ArrowLeft size={18} />
            Voltar ao login
          </Button>
        </div>

        <div className="text-center space-y-4">
          <div className="flex justify-center py-2">
            <BrandLogo height={48} className="mx-auto max-h-12" />
          </div>
          <p className="text-slate-500 text-lg">Simule a jornada completa do hóspede e recepção.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Persona 1: João - Pré Check-in */}
          <Card className="hover:shadow-xl transition-shadow border-t-4 border-t-sky-500 cursor-pointer group" onClick={() => invitedRes && navigate(PATHS.guest.checkin(invitedRes.id))}>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto text-sky-600 group-hover:scale-110 transition-transform">
                <LogIn size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">João Silva</h3>
                <p className="text-sm text-sky-600 font-medium">Pré Check-in</p>
              </div>
              <p className="text-slate-500 text-sm">
                Acabou de receber o convite. Precisa enviar documentos e assinar.
              </p>
              <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                Iniciar Jornada
              </Button>
            </CardContent>
          </Card>

          {/* Persona 2: Maria - Estadia */}
          <Card className="hover:shadow-xl transition-shadow border-t-4 border-t-emerald-500 cursor-pointer group" onClick={() => checkedInRes && navigate(PATHS.guest.dashboard(checkedInRes.id))}>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 group-hover:scale-110 transition-transform">
                <Key size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Maria Santos</h3>
                <p className="text-sm text-emerald-600 font-medium">Hospedada</p>
              </div>
              <p className="text-slate-500 text-sm">
                Já está no quarto. Quer pedir room service e ver notificações.
              </p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Acessar Painel
              </Button>
            </CardContent>
          </Card>

          {/* Persona 3: Carlos - Check-out */}
          <Card className="hover:shadow-xl transition-shadow border-t-4 border-t-orange-500 cursor-pointer group" onClick={() => checkoutRes && navigate(PATHS.guest.dashboard(checkoutRes.id))}>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto text-orange-600 group-hover:scale-110 transition-transform">
                <CreditCard size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Carlos Oliveira</h3>
                <p className="text-sm text-orange-600 font-medium">Check-out</p>
              </div>
              <p className="text-slate-500 text-sm">
                Terminando a estadia. Precisa conferir extrato e pagar.
              </p>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Finalizar Estadia
              </Button>
            </CardContent>
          </Card>

        </div>

        <div className="pt-8 border-t border-slate-200">
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="gap-2" onClick={() => navigate(PATHS.reception)}>
              <LayoutDashboard size={18} />
              Acessar Painel da Recepção
            </Button>
            <Button variant="outline" className="gap-2 border-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => navigate(PATHS.admin.root)}>
              <ShieldCheck size={18} />
              Acessar Painel Admin
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}