import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Building, 
  FileText, 
  LogOut
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { BrandLogo } from '../../components/BrandLogo';
import { PATHS } from '../../routes';

export function AdminLayout() {
  const location = useLocation();
  const { currentUser, switchUser } = useHotel();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navItems = [
    { path: PATHS.admin.dashboard, icon: LayoutDashboard, label: 'Dashboard' },
    { path: PATHS.admin.structure, icon: Building, label: 'Estrutura' },
    { path: PATHS.admin.users, icon: Users, label: 'Usuários' },
    { path: PATHS.admin.policies, icon: FileText, label: 'Políticas' },
    { path: PATHS.admin.settings, icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-800 flex flex-col gap-2">
          <BrandLogo variant="onDark" height={36} className="max-w-[200px]" />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Painel administrativo</span>
            <span className="text-xs text-slate-500 font-medium px-1.5 py-0.5 bg-slate-800 rounded">v1.0.0</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive(item.path)
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} className={isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs border border-slate-600">
              AD
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{currentUser}</p>
              <p className="text-xs text-slate-500 truncate">Administrador</p>
            </div>
          </div>
          <Link to={PATHS.home} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-full px-2 py-2 rounded-lg hover:bg-slate-800">
            <LogOut size={16} />
            <span className="text-sm">Sair para Recepção</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {navItems.find(i => isActive(i.path))?.label || 'Painel Administrativo'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              Sistema Operacional
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
