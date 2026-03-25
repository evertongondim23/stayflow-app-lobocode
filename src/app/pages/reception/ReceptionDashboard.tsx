import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHotel, Reservation, Room } from '../../context/HotelContext';
import { cn } from '../../components/ui/utils';
import { BrandLogo } from '../../components/BrandLogo';
import { PATHS } from '../../routes';
import { 
  Users, LogIn, LogOut, BedDouble, Search, 
  CheckCircle, AlertTriangle, XCircle, MoreVertical, 
  FileText, CreditCard, Key, MessageSquare, UserCog, ChevronUp,
  PieChart, BarChart2, TrendingUp, Activity, Clock, Wrench, Sparkles, Ban, CheckCircle2,
  ArrowLeftRight,
  LayoutGrid,
  DoorOpen,
  Zap,
  PanelRightOpen,
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart as RePieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { toast } from 'sonner';
import { Button, Card, CardContent, Input, Badge, Avatar, AvatarFallback } from '../../components/ui';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../../components/ui/sheet';
import { useIsMobile } from '../../components/ui/use-mobile';

// --- Sub-components defined outside to prevent re-mounting issues ---

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'INVITED': 'bg-slate-100 text-slate-600',
    'PRECHECKIN_DONE': 'bg-sky-100 text-sky-700',
    'CHECKED_IN': 'bg-emerald-100 text-emerald-700',
    'CHECKOUT_PENDING': 'bg-orange-100 text-orange-700',
    'CHECKED_OUT': 'bg-slate-200 text-slate-500',
  };
  
  const labels: Record<string, string> = {
    'INVITED': 'Aguardando',
    'PRECHECKIN_DONE': 'Pré Check-in OK',
    'CHECKED_IN': 'Hospedado',
    'CHECKOUT_PENDING': 'Saída Pendente',
    'CHECKED_OUT': 'Finalizado',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold border border-current/10 ${styles[status] || 'bg-gray-100'}`}>
      {labels[status] || status}
    </span>
  );
};

const Tooltip = ({ children, content }: { children: React.ReactNode; content?: string }) => {
  if (!content) return <>{children}</>;
  return (
    <span className="group relative flex items-center w-fit">
      {children}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs px-2 py-1 bg-slate-800 text-white text-xs rounded shadow-lg z-50 pointer-events-none">
        {content}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></span>
      </span>
    </span>
  );
};

function roomStatusMeta(status: Room['status']) {
  switch (status) {
    case 'VACANT_CLEAN':
      return {
        label: 'Limpo · disponível',
        chip: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80',
      };
    case 'VACANT_DIRTY':
      return {
        label: 'Sujo / arrumação',
        chip: 'bg-amber-50 text-amber-900 ring-1 ring-amber-200/80',
      };
    case 'OCCUPIED':
      return {
        label: 'Ocupado',
        chip: 'bg-sky-50 text-sky-900 ring-1 ring-sky-200/80',
      };
    case 'OUT_OF_ORDER':
      return {
        label: 'Manutenção',
        chip: 'bg-red-50 text-red-800 ring-1 ring-red-200/80',
      };
    default:
      return { label: status, chip: 'bg-slate-100 text-slate-700' };
  }
}

function roomSelectableForArrival(
  rm: Room,
  mode: 'assign' | 'change',
  currentRoom?: string
) {
  if (rm.status !== 'VACANT_CLEAN') return false;
  if (mode === 'change' && rm.number === currentRoom) return false;
  return true;
}

export function ReceptionDashboard() {
  const isMobile = useIsMobile();
  const { reservations, guests, rooms, updateReservationStatus, assignRoom, updateRoomStatus, addLog, currentUser, switchUser } = useHotel();
  const [activeTab, setActiveTab] = useState<'arrivals' | 'in_house' | 'departures' | 'rooms'>('arrivals');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'READY' | 'PENDING'>('ALL');
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  /** Painel de escolha de quarto nas Chegadas (disponíveis + visão completa). */
  const [roomPickerOpen, setRoomPickerOpen] = useState<{
    reservationId: string;
    mode: 'assign' | 'change';
    currentRoom?: string;
    filter: 'available' | 'all';
    query: string;
    selectedNumber: string | null;
  } | null>(null);

  const STAFF_LIST = ['Ana (Manhã)', 'Carlos (Tarde)', 'Sofia (Noite)', 'Gerente Geral'];

  // --- Filtering Logic ---
  const today = '2023-10-25'; // Mocked Today

  const getGuest = (id: string) => guests.find(g => g.id === id);
  const getRoom = (number?: string) => rooms.find(r => r.number === number);

  const arrivals = reservations.filter(r => 
    (r.status === 'INVITED' || r.status === 'PRECHECKIN_DONE') && 
    r.checkInDate <= today
  ).filter(r => {
    if (filterStatus === 'READY') return r.status === 'PRECHECKIN_DONE';
    if (filterStatus === 'PENDING') return r.status === 'INVITED';
    return true;
  }).filter(r => {
    const guest = getGuest(r.guestId);
    return guest?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           r.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // --- Actions ---

  const handleCheckIn = (reservationId: string) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res?.roomNumber) {
      toast.error('Atribua um quarto antes de realizar o check-in.');
      return;
    }
    updateReservationStatus(reservationId, 'CHECKED_IN');
    toast.success('Check-in realizado com sucesso!');
  };

  const handleQuickAssign = (reservationId: string) => {
    const cleanRoom = rooms.find(r => r.status === 'VACANT_CLEAN');
    if (cleanRoom) {
      assignRoom(reservationId, cleanRoom.number);
      toast.success(`Quarto ${cleanRoom.number} atribuído.`);
    } else {
      toast.error('Não há quartos limpos disponíveis automaticamente.');
    }
  };

  const openRoomPickerAssign = (reservationId: string) => {
    setRoomPickerOpen({
      reservationId,
      mode: 'assign',
      filter: 'available',
      query: '',
      selectedNumber: null,
    });
  };

  const openRoomPickerChange = (reservationId: string, currentRoom: string) => {
    setRoomPickerOpen({
      reservationId,
      mode: 'change',
      currentRoom,
      filter: 'available',
      query: '',
      selectedNumber: null,
    });
  };

  const closeRoomPicker = () => setRoomPickerOpen(null);

  const confirmRoomPicker = () => {
    if (!roomPickerOpen?.selectedNumber) {
      toast.error('Selecione um quarto na lista.');
      return;
    }
    if (
      roomPickerOpen.mode === 'change' &&
      roomPickerOpen.selectedNumber === roomPickerOpen.currentRoom
    ) {
      toast.error('Escolha um quarto diferente do atual.');
      return;
    }
    assignRoom(roomPickerOpen.reservationId, roomPickerOpen.selectedNumber);
    toast.success(`Quarto ${roomPickerOpen.selectedNumber} atribuído.`);
    setRoomPickerOpen(null);
  };

  /** Painel rico: abas Disponíveis / Todos + busca + seleção + confirmar. */
  const renderArrivalsRoomPickerPanel = (
    r: Reservation,
    guestLabel: string,
    layout: 'inline' | 'sheet' = 'inline'
  ) => {
    if (!roomPickerOpen || roomPickerOpen.reservationId !== r.id) return null;
    const st = roomPickerOpen;
    const q = st.query.trim().toLowerCase();
    const list = rooms
      .filter(
        (rm) =>
          !q ||
          rm.number.toLowerCase().includes(q) ||
          rm.type.toLowerCase().includes(q)
      )
      .filter((rm) =>
        st.filter === 'available' ? rm.status === 'VACANT_CLEAN' : true
      )
      .sort((a, b) => {
        const pickA = roomSelectableForArrival(a, st.mode, st.currentRoom)
          ? 0
          : 1;
        const pickB = roomSelectableForArrival(b, st.mode, st.currentRoom)
          ? 0
          : 1;
        if (pickA !== pickB) return pickA - pickB;
        return a.number.localeCompare(b.number, undefined, { numeric: true });
      });
    const availableTotal = rooms.filter(
      (rm) => rm.status === 'VACANT_CLEAN'
    ).length;

    const isSheet = layout === 'sheet';

    return (
      <div
        className={cn(
          isSheet
            ? 'flex min-h-0 w-full flex-1 flex-col gap-0'
            : 'w-full min-w-72 max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 ring-1 ring-slate-100'
        )}
      >
        {isSheet ? (
          <div className="mb-3 flex shrink-0 justify-end">
            <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-center">
              <p className="text-[10px] font-bold uppercase text-slate-500">
                UHs limpas
              </p>
              <p className="text-lg font-bold tabular-nums text-sky-700">
                {availableTotal}
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-4 flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {st.mode === 'assign' ? 'Atribuir quarto' : 'Trocar quarto'}
              </p>
              <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                {guestLabel}
              </p>
            </div>
            <div className="shrink-0 rounded-lg bg-slate-100 px-2.5 py-1 text-center">
              <p className="text-[10px] font-bold uppercase text-slate-500">
                UHs limpas
              </p>
              <p className="text-lg font-bold tabular-nums text-sky-700">
                {availableTotal}
              </p>
            </div>
          </div>
        )}

        <div className="mb-3 flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-bold transition-all sm:text-sm',
              st.filter === 'available'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            )}
            onClick={() =>
              setRoomPickerOpen((prev) =>
                prev ? { ...prev, filter: 'available' } : prev
              )
            }
          >
            <Sparkles size={14} className="shrink-0" />
            Disponíveis
          </button>
          <button
            type="button"
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-bold transition-all sm:text-sm',
              st.filter === 'all'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            )}
            onClick={() =>
              setRoomPickerOpen((prev) =>
                prev ? { ...prev, filter: 'all' } : prev
              )
            }
          >
            <LayoutGrid size={14} className="shrink-0" />
            Todos os quartos
          </button>
        </div>

        <p className="mb-2 text-[11px] leading-snug text-slate-500">
          {st.filter === 'available'
            ? 'Só UHs limpas e livres para entrada imediata.'
            : 'Visão completa do inventário; só quartos limpos podem ser selecionados.'}
        </p>

        <div className="relative mb-3">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <Input
            placeholder="Buscar número ou tipo..."
            value={st.query}
            onChange={(e) =>
              setRoomPickerOpen((prev) =>
                prev ? { ...prev, query: e.target.value } : prev
              )
            }
            className="h-10 border-slate-200 bg-slate-50/80 pl-10 text-sm"
          />
        </div>

        <div
          className={cn(
            'mb-4 rounded-xl border border-slate-100 bg-slate-50/50',
            isSheet
              ? 'min-h-0 flex-1 overflow-y-auto overscroll-contain'
              : 'max-h-52 overflow-y-auto'
          )}
        >
          {list.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              Nenhum quarto neste filtro.
              {st.filter === 'available' && (
                <button
                  type="button"
                  className="mt-3 block w-full text-xs font-semibold text-sky-600 underline hover:text-sky-800"
                  onClick={() =>
                    setRoomPickerOpen((prev) =>
                      prev ? { ...prev, filter: 'all' } : prev
                    )
                  }
                >
                  Ver todos os quartos
                </button>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 p-1">
              {list.map((rm) => {
                const meta = roomStatusMeta(rm.status);
                const selectable = roomSelectableForArrival(
                  rm,
                  st.mode,
                  st.currentRoom
                );
                const selected = st.selectedNumber === rm.number;
                return (
                  <li key={rm.number}>
                    <button
                      type="button"
                      disabled={!selectable}
                      onClick={() =>
                        selectable &&
                        setRoomPickerOpen((prev) =>
                          prev ? { ...prev, selectedNumber: rm.number } : prev
                        )
                      }
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors',
                        !selectable && 'cursor-not-allowed opacity-55',
                        selectable && 'hover:bg-white',
                        selected &&
                          selectable &&
                          'bg-sky-50 ring-1 ring-sky-300 ring-inset'
                      )}
                    >
                      <div
                        className={cn(
                          'flex size-10 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold',
                          selected && selectable
                            ? 'bg-sky-600 text-white'
                            : 'border border-slate-200 bg-white text-slate-800'
                        )}
                      >
                        {rm.number}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800">
                          {rm.type}
                        </p>
                        <span
                          className={cn(
                            'mt-0.5 inline-block rounded-md px-1.5 py-0.5 text-[10px] font-bold',
                            meta.chip
                          )}
                        >
                          {meta.label}
                        </span>
                      </div>
                      {selected && selectable ? (
                        <CheckCircle
                          size={18}
                          className="shrink-0 text-sky-600"
                        />
                      ) : (
                        <DoorOpen
                          size={16}
                          className={cn(
                            'shrink-0',
                            selectable ? 'text-slate-300' : 'text-slate-200'
                          )}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div
          className={cn(
            'flex flex-col gap-2 sm:flex-row sm:justify-end',
            isSheet && 'shrink-0 border-t border-slate-100 pt-4'
          )}
        >
          <Button
            variant="outline"
            type="button"
            className="order-2 border-slate-200 sm:order-1"
            onClick={closeRoomPicker}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="order-1 bg-sky-600 font-semibold hover:bg-sky-700 sm:order-2"
            disabled={!st.selectedNumber}
            onClick={confirmRoomPicker}
          >
            Confirmar quarto
            {st.selectedNumber ? ` ${st.selectedNumber}` : ''}
          </Button>
        </div>

        {st.mode === 'assign' && availableTotal > 0 && (
          <button
            type="button"
            className={cn(
              'mt-3 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-sky-700',
              isSheet && 'shrink-0'
            )}
            onClick={() => {
              handleQuickAssign(r.id);
              closeRoomPicker();
            }}
          >
            <Zap size={14} />
            Atribuir o próximo UH limpo automaticamente
          </button>
        )}
      </div>
    );
  };

  const activeRoomPickerReservation =
    roomPickerOpen &&
    reservations.find((x) => x.id === roomPickerOpen.reservationId);

  const renderArrivalsRoomPickerSheet = () => {
    if (!isMobile) return null;
    const res = activeRoomPickerReservation;
    const guestLabel = res
      ? getGuest(res.guestId)?.name ?? 'Hóspede'
      : '';
    return (
      <Sheet
        open={!!roomPickerOpen}
        onOpenChange={(open) => {
          if (!open) closeRoomPicker();
        }}
      >
        <SheetContent
          side="right"
          className="flex h-full max-h-[100dvh] w-full max-w-full flex-col gap-0 border-l border-slate-200 p-0 sm:max-w-md"
        >
          {roomPickerOpen && res ? (
            <>
              <SheetHeader className="space-y-1 border-b border-slate-100 px-4 py-4 text-left">
                <SheetTitle className="text-lg text-slate-900">
                  {stationRoomPickerTitle(roomPickerOpen)}
                </SheetTitle>
                <SheetDescription className="text-left text-slate-500">
                  <span className="font-medium text-slate-700">{guestLabel}</span>
                  {' — '}
                  escolha a UH ou feche pelo X.
                </SheetDescription>
              </SheetHeader>
              <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-3">
                {renderArrivalsRoomPickerPanel(res, guestLabel, 'sheet')}
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    );
  };

  function stationRoomPickerTitle(st: NonNullable<typeof roomPickerOpen>) {
    return st.mode === 'assign' ? 'Atribuir quarto' : 'Trocar quarto';
  }

  // --- Render Functions (now part of the main component body logic) ---

  const renderOccupancyReport = () => {
    if (!isReportOpen) return null;

    // Mock Data for Charts
    const occupancyData = [
      { name: 'Seg', ocupados: 12, livres: 8 },
      { name: 'Ter', ocupados: 15, livres: 5 },
      { name: 'Qua', ocupados: 18, livres: 2 },
      { name: 'Qui', ocupados: 14, livres: 6 },
      { name: 'Sex', ocupados: 19, livres: 1 },
      { name: 'Sab', ocupados: 20, livres: 0 },
      { name: 'Dom', ocupados: 10, livres: 10 },
    ];

    const roomStatusData = [
      { name: 'Limpos', value: 12, color: '#10b981' }, // emerald-500
      { name: 'Sujos', value: 5, color: '#f59e0b' },  // amber-500
      { name: 'Ocupados', value: 20, color: '#0ea5e9' }, // sky-500
      { name: 'Manutenção', value: 3, color: '#ef4444' }, // red-500
    ];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsReportOpen(false)}
        />

        {/* Modal Content */}
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 relative z-10">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <PieChart className="text-sky-600" /> Relatório de Ocupação
              </h2>
              <p className="text-slate-500 text-sm mt-1">Visão geral do hotel em tempo real</p>
            </div>
            <button 
              onClick={() => setIsReportOpen(false)}
              className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <XCircle size={24} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-6 overflow-y-auto space-y-8 bg-slate-50/50">
            
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <div className="p-3 bg-sky-50 text-sky-600 rounded-full mb-2">
                  <Activity size={24} />
                </div>
                <span className="text-3xl font-bold text-slate-800">85%</span>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Ocupação Hoje</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full mb-2">
                  <TrendingUp size={24} />
                </div>
                <span className="text-3xl font-bold text-slate-800">R$ 12k</span>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Receita Diária</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full mb-2">
                  <LogIn size={24} />
                </div>
                <span className="text-3xl font-bold text-slate-800">8</span>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Chegadas Pendentes</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-full mb-2">
                  <LogOut size={24} />
                </div>
                <span className="text-3xl font-bold text-slate-800">5</span>
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Saídas Pendentes</span>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Occupancy Trend */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <BarChart2 size={20} className="text-sky-600"/> Ocupação Semanal
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={occupancyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <RechartsTooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        cursor={{fill: '#f8fafc'}}
                      />
                      <Bar dataKey="ocupados" stackId="a" fill="#0ea5e9" radius={[0, 0, 4, 4]} name="Ocupados" />
                      <Bar dataKey="livres" stackId="a" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Livres" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Room Status */}
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <BedDouble size={20} className="text-sky-600"/> Status dos Quartos
                </h3>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={roomStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {roomStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Quick Actions Footer inside Modal */}
            <div className="flex justify-end pt-4">
              <Button onClick={() => setIsReportOpen(false)} variant="outline" className="mr-2">Fechar</Button>
              <Button className="bg-sky-600 hover:bg-sky-700">Exportar PDF</Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGuestDetailsPanel = () => {
    if (!selectedReservationId) return null;

    // Tenta achar nos dados reais, se não, procura nos mocks (para demonstração)
    const realRes = reservations.find(r => r.id === selectedReservationId);
    let displayRes: any = realRes;
    let displayGuest: any = realRes ? getGuest(realRes.guestId) : null;

    // Fallback para dados mockados se não achar (para funcionar com os itens mockados da lista)
    if (!displayRes) {
      // Mock data matching the list
      const mocks: any = {
        'res_mock_1': { id: 'res_mock_1', guestName: 'Maria Silva', roomNumber: '101', checkInDate: '2023-10-24', checkOutDate: '2023-10-28', balance: 450.00, status: 'CHECKED_IN', email: 'maria.silva@email.com', phone: '+55 11 99999-8888', guests: 2 },
        'res_mock_2': { id: 'res_mock_2', guestName: 'Roberto Almeida', roomNumber: '205', checkInDate: '2023-10-23', checkOutDate: '2023-10-26', balance: 120.50, status: 'CHECKED_IN', email: 'roberto@email.com', phone: '+55 21 98888-7777', guests: 1 },
        'res_mock_3': { id: 'res_mock_3', guestName: 'Carla e Família', roomNumber: '304', checkInDate: '2023-10-25', checkOutDate: '2023-10-30', balance: 0.00, status: 'CHECKED_IN', email: 'carla.fam@email.com', phone: '+55 31 97777-6666', guests: 4 },
      };
      const mock = mocks[selectedReservationId];
      if (mock) {
        displayRes = mock;
        displayGuest = { name: mock.guestName, email: mock.email, phone: mock.phone };
      }
    }

    if (!displayRes) return null;

    return (
      <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
        {/* Backdrop - Invisível, apenas para fechar ao clicar fora */}
        <div 
          className="absolute inset-0 pointer-events-auto"
          onClick={() => setSelectedReservationId(null)}
        />
        
        {/* Panel */}
        <div className="w-full max-w-md bg-white shadow-2xl h-full flex flex-col pointer-events-auto animate-in slide-in-from-right duration-300 border-l border-slate-200">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-4 ring-white shadow-sm">
                <AvatarFallback className="bg-sky-600 text-white text-xl font-bold">
                  {displayGuest?.name?.substring(0, 2).toUpperCase() || 'GU'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{displayGuest?.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={displayRes.status} />
                  <span className="text-xs text-slate-500 font-mono">#{displayRes.id.split('_')[1] || displayRes.id}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setSelectedReservationId(null)}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 p-2 rounded-full transition-colors"
            >
              <XCircle size={24} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1 tracking-wide">Quarto Atual</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-slate-800">{displayRes.roomNumber}</span>
                  <Badge variant="outline" className="bg-slate-50">Standard</Badge>
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1 tracking-wide">Saldo Devedor</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xl font-bold ${displayRes.balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    R$ {Number(displayRes.balance || 0).toFixed(2)}
                  </span>
                  <button className="text-xs text-sky-600 font-bold hover:underline">Ver</button>
                </div>
              </div>
            </div>

            {/* Dates & Info */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText size={16} className="text-sky-600"/> Dados da Estadia
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500">Check-in</span>
                  <span className="font-medium text-slate-800">{displayRes.checkInDate}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500">Check-out Previsto</span>
                  <span className="font-medium text-slate-800">{displayRes.checkOutDate}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500">Ocupantes</span>
                  <span className="font-medium text-slate-800">{displayRes.guests || 2} Adultos</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500">Email</span>
                  <span className="font-medium text-slate-800">{displayGuest?.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500">Telefone</span>
                  <span className="font-medium text-slate-800">{displayGuest?.phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Recent Consumption Mock */}
            <div>
              <div className="flex justify-between items-center mb-3">
                 <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard size={16} className="text-sky-600"/> Consumo Recente
                </h3>
                <Button size="sm" variant="ghost" className="h-6 text-xs text-sky-600">Ver Extrato</Button>
              </div>
              <div className="bg-slate-50 rounded-lg p-1 border border-slate-100 space-y-1">
                <div className="flex justify-between p-2 text-xs hover:bg-white rounded transition-colors">
                  <span>Frigobar - Água s/ Gás</span>
                  <span className="font-bold">R$ 8,00</span>
                </div>
                <div className="flex justify-between p-2 text-xs hover:bg-white rounded transition-colors">
                  <span>Restaurante - Jantar</span>
                  <span className="font-bold">R$ 120,00</span>
                </div>
                <div className="flex justify-between p-2 text-xs hover:bg-white rounded transition-colors">
                  <span>Lavanderia</span>
                  <span className="font-bold">R$ 45,00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-2">
            <Button className="w-full bg-sky-600 hover:bg-sky-700 font-bold shadow-md">
              <CreditCard size={16} className="mr-2"/> Lançar Despesa
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="border-slate-200 hover:bg-white hover:text-sky-600">
                <MessageSquare size={16} className="mr-2"/> Mensagem
              </Button>
              <Button variant="outline" className="border-slate-200 hover:bg-white hover:text-red-600">
                <Key size={16} className="mr-2"/> Trocar Quarto
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderArrivalsContent = () => {
    const readyCount = reservations.filter(r => r.status === 'PRECHECKIN_DONE' && r.checkInDate <= today).length;
    const pendingCount = reservations.filter(r => r.status === 'INVITED' && r.checkInDate <= today).length;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
              Chegadas do Dia
            </h2>
            <p className="text-slate-500 mt-1 font-medium">Gerencie o check-in e atribuição de quartos para hoje.</p>
          </div>
          
          <div className="flex flex-wrap gap-2 p-1 bg-white rounded-xl shadow-sm border border-slate-200">
            <button 
              onClick={() => setFilterStatus('ALL')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${filterStatus === 'ALL' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
            >
              Todas
            </button>
            <button 
              onClick={() => setFilterStatus('READY')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${filterStatus === 'READY' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-500 hover:bg-sky-50 hover:text-sky-600'}`}
            >
              <CheckCircle size={14} strokeWidth={3} />
              Prontos
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filterStatus === 'READY' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{readyCount}</span>
            </button>
            <button 
              onClick={() => setFilterStatus('PENDING')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${filterStatus === 'PENDING' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600'}`}
            >
              <AlertTriangle size={14} strokeWidth={3} />
              Pendentes
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${filterStatus === 'PENDING' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>{pendingCount}</span>
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <div className="relative flex-1 max-w-lg group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-sky-500 transition-colors" size={20} />
            <Input 
              placeholder="Buscar por nome, número da reserva..." 
              className="pl-12 h-12 bg-white shadow-sm border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-xs tracking-wider backdrop-blur-sm sticky top-0 z-10">
              <tr>
                <th className="p-5 pl-6">Hóspede</th>
                <th className="p-5">Status Pré Check-in</th>
                <th className="p-5">Quarto Atribuído</th>
                <th className="p-5 text-right pr-6">Ação Recomendada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {arrivals.length === 0 ? (
                 <tr>
                   <td colSpan={4} className="p-20 text-center">
                     <div className="flex flex-col items-center justify-center text-slate-400 animate-in zoom-in-95 duration-300">
                       <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                         <Search size={40} className="opacity-50" />
                       </div>
                       <p className="text-xl font-bold text-slate-700">Nenhuma chegada encontrada</p>
                       <p className="text-sm mt-2 max-w-xs mx-auto text-slate-500">Não encontramos reservas correspondentes aos filtros ou termo de busca atuais.</p>
                       <Button 
                         variant="outline" 
                         className="mt-6 border-slate-300 text-slate-600 hover:border-sky-500 hover:text-sky-600"
                         onClick={() => {setFilterStatus('ALL'); setSearchTerm('')}}
                       >
                         Limpar Filtros
                       </Button>
                     </div>
                   </td>
                 </tr>
              ) : arrivals.map((r, idx) => {
                const guest = getGuest(r.guestId);
                const assignedRoom = getRoom(r.roomNumber);
                const isReady = r.status === 'PRECHECKIN_DONE';
                
                return (
                  <tr 
                    key={r.id} 
                    className={`group transition-all duration-200 ${isReady ? 'hover:bg-sky-50/40' : 'hover:bg-slate-50'}`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <td className="p-5 pl-6">
                      <div className="flex items-center gap-4">
                        <Avatar className={`h-12 w-12 border-2 ${isReady ? 'border-sky-200' : 'border-slate-100'} shadow-sm`}>
                          <AvatarFallback className={`${isReady ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-500'} font-bold text-lg`}>
                            {guest?.name.substring(0,2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-slate-900 text-base flex items-center gap-2">
                            {guest?.name}
                            {guest?.notes && (
                              <Tooltip content={guest.notes}>
                                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse cursor-help"></span>
                              </Tooltip>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                             <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-auto border-slate-200 text-slate-400 font-mono">
                               #{r.id.split('_')[1] || r.id}
                             </Badge>
                             <span className="text-xs text-slate-400 flex items-center gap-1">
                               <Users size={12}/> {r.guests || 2}
                             </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      {isReady ? (
                        <div className="flex items-center gap-2.5">
                          <div className="bg-emerald-100 p-1.5 rounded-full text-emerald-600">
                             <CheckCircle size={16} strokeWidth={3} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-emerald-700">Completo</p>
                            <p className="text-xs text-emerald-600/70">Pronto para entrada</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5">
                           <div className="bg-orange-100 p-1.5 rounded-full text-orange-600">
                             <AlertTriangle size={16} strokeWidth={3} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-orange-700">Pendente</p>
                            <p className="text-xs text-orange-600/70">Documentos faltando</p>
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="p-5 align-top">
                      {r.roomNumber ? (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg shadow-sm border ${assignedRoom?.status === 'VACANT_CLEAN' ? 'bg-white border-emerald-200 text-emerald-700' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>
                             {r.roomNumber}
                           </div>
                           <div className="flex flex-col min-w-0">
                             <span className="text-xs font-bold text-slate-500 uppercase">Status UH</span>
                             {assignedRoom?.status === 'VACANT_CLEAN' ? (
                               <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                 <Sparkles size={12}/> Limpo
                               </span>
                             ) : (
                               <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
                                 <Clock size={12}/> Sujo
                               </span>
                             )}
                           </div>
                          </div>

                          {roomPickerOpen?.reservationId === r.id ? (
                            isMobile ? (
                              <div className="inline-flex max-w-full items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900">
                                <PanelRightOpen
                                  size={16}
                                  className="shrink-0 text-sky-600"
                                  aria-hidden
                                />
                                <span className="font-medium leading-snug">
                                  Painel deslizante aberto
                                </span>
                              </div>
                            ) : (
                              renderArrivalsRoomPickerPanel(
                                r,
                                guest?.name ?? 'Hóspede',
                                'inline'
                              )
                            )
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                openRoomPickerChange(r.id, r.roomNumber!)
                              }
                              className="inline-flex w-fit items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-sky-600 transition-colors hover:bg-sky-50 hover:text-sky-800"
                            >
                              <ArrowLeftRight size={14} aria-hidden />
                              Ver quartos e trocar
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {roomPickerOpen?.reservationId === r.id ? (
                            isMobile ? (
                              <div className="inline-flex max-w-full items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900">
                                <PanelRightOpen
                                  size={16}
                                  className="shrink-0 text-sky-600"
                                  aria-hidden
                                />
                                <span className="font-medium leading-snug">
                                  Painel deslizante aberto
                                </span>
                              </div>
                            ) : (
                              renderArrivalsRoomPickerPanel(
                                r,
                                guest?.name ?? 'Hóspede',
                                'inline'
                              )
                            )
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => openRoomPickerAssign(r.id)}
                                className="group/btn flex w-fit max-w-full items-center gap-3 rounded-xl border border-dashed border-slate-300 px-4 py-3 transition-all hover:border-sky-400 hover:bg-sky-50"
                              >
                                <div className="rounded-lg bg-slate-100 p-2 text-slate-400 transition-colors group-hover/btn:bg-sky-100 group-hover/btn:text-sky-600">
                                  <LayoutGrid size={18} />
                                </div>
                                <div className="text-left">
                                  <span className="block text-sm font-bold text-slate-700 group-hover/btn:text-sky-800">
                                    Ver quartos disponíveis
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    Escolha a UH antes do check-in
                                  </span>
                                </div>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickAssign(r.id)}
                                className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-slate-500 underline-offset-2 hover:text-sky-700 hover:underline"
                              >
                                <Zap size={14} />
                                Ou atribuir o próximo limpo automaticamente
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-5 text-right pr-6">
                      {isReady ? (
                         <Button 
                           size="default" 
                           className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-900/10 hover:shadow-emerald-900/20 transition-all hover:-translate-y-0.5" 
                           onClick={() => toast.success(`Iniciando Validação para ${guest?.name}...`)}
                         >
                           <CheckCircle size={18} className="mr-2" strokeWidth={2.5} /> Validar Entrada
                         </Button>
                      ) : (
                         <div className="flex justify-end gap-2">
                           <Button 
                             variant="outline" 
                             className="font-medium text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                             onClick={() => handleCheckIn(r.id)}
                           >
                             Check-in Manual
                           </Button>
                         </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderInHouseContent = () => {
    // Filtra dados reais do contexto
    const realInHouse = reservations.filter(r => r.status === 'CHECKED_IN');
    
    // Dados Mockados para demonstração visual (caso não haja reais)
    const MOCK_IN_HOUSE = [
      { id: 'res_mock_1', guestName: 'Maria Silva', room: '101', checkIn: '2023-10-24 14:30', checkOut: '2023-10-28', balance: 450.00, status: 'CHECKED_IN', notes: 'VIP' },
      { id: 'res_mock_2', guestName: 'Roberto Almeida', room: '205', checkIn: '2023-10-23 18:15', checkOut: '2023-10-26', balance: 120.50, status: 'CHECKED_IN', notes: '' },
      { id: 'res_mock_3', guestName: 'Carla e Família', room: '304', checkIn: '2023-10-25 10:00', checkOut: '2023-10-30', balance: 0.00, status: 'CHECKED_IN', notes: 'Berço extra' },
    ];

    // Usa dados reais se existirem, senão usa o mock para preencher a tela
    const displayData = realInHouse.length > 0 
      ? realInHouse.map(r => {
          const guest = getGuest(r.guestId);
          return {
            id: r.id,
            guestName: guest?.name || 'Hóspede Desconhecido',
            room: r.roomNumber || 'N/A',
            checkIn: r.checkInDate, // Simplificado
            checkOut: r.checkOutDate,
            balance: Math.random() * 500, // Simulação de saldo
            status: r.status,
            notes: guest?.notes
          };
        })
      : MOCK_IN_HOUSE;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
              Hospedados
            </h2>
             <p className="text-slate-500 mt-1 font-medium">Gestão de estadias em andamento e contas.</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="default" 
              className="gap-2 border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 transition-all font-medium"
              onClick={() => setIsReportOpen(true)}
            >
              <FileText size={18} /> Relatório de Ocupação
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-xs tracking-wider backdrop-blur-sm sticky top-0 z-10">
              <tr>
                <th className="p-5 pl-6">Quarto</th>
                <th className="p-5">Hóspede</th>
                <th className="p-5">Período</th>
                <th className="p-5">Saldo Atual</th>
                <th className="p-5 text-right pr-6">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayData.map((data, idx) => (
                <tr 
                  key={data.id} 
                  className="hover:bg-slate-50 transition-colors group"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <td className="p-5 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-mono font-bold text-lg text-slate-700 border border-slate-200 shadow-sm group-hover:border-sky-300 group-hover:text-sky-700 transition-colors">
                        {data.room}
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10 border border-slate-100 shadow-sm">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-teal-200 text-emerald-800 font-bold">
                          {data.guestName.substring(0,2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2 text-base">
                          {data.guestName}
                          {data.notes && (
                             <Tooltip content={data.notes}>
                               <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse cursor-help"></span>
                             </Tooltip>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-mono">ID: {data.id.split('_')[1] || data.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col text-xs gap-1.5">
                      <span className="text-slate-500 flex items-center gap-2 font-medium">
                        <LogIn size={14} className="text-emerald-500" /> 
                        <span>Entrada: <span className="text-slate-700">{data.checkIn}</span></span>
                      </span>
                      <span className="text-slate-500 flex items-center gap-2 font-medium">
                        <LogOut size={14} className="text-orange-500" /> 
                        <span>Saída: <span className="text-slate-700">{data.checkOut}</span></span>
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${data.balance > 0 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                         <CreditCard size={16} />
                      </div>
                      <span className={`font-mono font-bold text-base ${data.balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        R$ {data.balance.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 text-right pr-6">
                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button size="icon" variant="ghost" className="h-9 w-9 rounded-lg hover:bg-sky-50 text-slate-400 hover:text-sky-600 transition-colors">
                         <MessageSquare size={18} />
                       </Button>
                       <Button 
                         size="sm" 
                         variant="outline" 
                         className="text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 transition-all font-medium"
                         onClick={() => setSelectedReservationId(data.id)}
                       >
                         Gerenciar
                       </Button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderDeparturesContent = () => {
    // Mock Data for Departures
    const MOCK_DEPARTURES = [
      { id: 'res_out_1', guestName: 'João Souza', room: '104', checkOutTime: '11:00', balance: 0.00, status: 'CHECKOUT_PENDING', items: 3 },
      { id: 'res_out_2', guestName: 'Ana Pereira', room: '202', checkOutTime: '10:30', balance: 150.00, status: 'CHECKOUT_PENDING', items: 1 },
      { id: 'res_out_3', guestName: 'Carlos Lima', room: '301', checkOutTime: '09:45', balance: 0.00, status: 'CHECKED_OUT', items: 0 },
    ];

    // Filter logic (mock)
    const filteredDepartures = filterStatus === 'ALL' 
      ? MOCK_DEPARTURES 
      : MOCK_DEPARTURES.filter(d => d.status === (filterStatus === 'READY' ? 'CHECKED_OUT' : 'CHECKOUT_PENDING'));

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
              Saídas do Dia
            </h2>
             <p className="text-slate-500 mt-1 font-medium">Processamento de check-outs e fechamento de contas.</p>
          </div>
          
          <div className="flex flex-wrap gap-2 p-1 bg-white rounded-xl shadow-sm border border-slate-200">
            <button 
              onClick={() => setFilterStatus('ALL')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${filterStatus === 'ALL' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
            >
              Todas
            </button>
            <button 
              onClick={() => setFilterStatus('PENDING')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${filterStatus === 'PENDING' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600'}`}
            >
              <Clock size={14} strokeWidth={3} />
              Pendentes
            </button>
            <button 
              onClick={() => setFilterStatus('READY')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2 ${filterStatus === 'READY' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
            >
              <CheckCircle size={14} strokeWidth={3} />
              Finalizadas
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-xs tracking-wider backdrop-blur-sm sticky top-0 z-10">
              <tr>
                <th className="p-5 pl-6">Quarto</th>
                <th className="p-5">Hóspede</th>
                <th className="p-5">Horário Previsto</th>
                <th className="p-5">Saldo Pendente</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right pr-6">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDepartures.map((data, idx) => (
                <tr 
                  key={data.id} 
                  className="hover:bg-slate-50 transition-colors group"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <td className="p-5 pl-6">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-mono font-bold text-slate-700 border border-slate-200 shadow-sm text-lg">
                      {data.room}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                        <AvatarFallback className="bg-orange-100 text-orange-700 font-bold">
                          {data.guestName.substring(0,2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-slate-900 text-base">{data.guestName}</p>
                        <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                          <CreditCard size={10} /> {data.items} itens consumidos
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-slate-600 font-medium bg-slate-100 w-fit px-3 py-1 rounded-lg">
                      <Clock size={16} className="text-slate-400" />
                      {data.checkOutTime}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold text-lg ${data.balance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        R$ {data.balance.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="p-5">
                    {data.status === 'CHECKED_OUT' ? (
                      <Badge className="bg-slate-100 text-slate-500 border-slate-200 px-3 py-1 text-xs">
                        <CheckCircle size={12} className="mr-1" /> Finalizado
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-100 text-orange-700 border-orange-200 px-3 py-1 text-xs animate-pulse">
                        <Clock size={12} className="mr-1" /> Pendente
                      </Badge>
                    )}
                  </td>
                  <td className="p-5 text-right pr-6">
                    {data.status !== 'CHECKED_OUT' ? (
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-9 w-9 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                          onClick={() => toast.info('Extrato de consumo aberto.')}
                          title="Ver Extrato"
                        >
                          <FileText size={18} />
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-900/10 border-none transition-all hover:scale-105"
                          onClick={() => {
                            if (data.balance > 0) {
                              toast.warning(`Receba R$ ${data.balance.toFixed(2)} antes de finalizar.`);
                            } else {
                              toast.success(`Check-out de ${data.guestName} realizado!`);
                            }
                          }}
                        >
                          {data.balance > 0 ? 'Receber' : 'Check-out'}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex justify-end opacity-50 hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">Ver Recibo</Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderRoomsContent = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            Mapa de Quartos
          </h2>
          <p className="text-slate-500 mt-1 font-medium">Visão geral do status de limpeza e ocupação.</p>
        </div>
        
        <div className="flex gap-4 text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Limpo</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Sujo</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-sky-500"></div> Ocupado</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-400"></div> Manutenção</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {rooms.map((room, idx) => {
          const statusConfig: Record<string, any> = {
            'VACANT_CLEAN': { 
              bg: 'bg-white', 
              border: 'border-slate-200', 
              hoverBorder: 'hover:border-emerald-400', 
              text: 'text-emerald-600', 
              icon: Sparkles,
              shadow: 'hover:shadow-emerald-900/5'
            },
            'VACANT_DIRTY': { 
              bg: 'bg-white', 
              border: 'border-orange-200', 
              hoverBorder: 'hover:border-orange-400', 
              text: 'text-orange-600', 
              icon: Clock,
              shadow: 'hover:shadow-orange-900/5'
            },
            'OCCUPIED': { 
              bg: 'bg-sky-50', 
              border: 'border-sky-200', 
              hoverBorder: 'hover:border-sky-400', 
              text: 'text-sky-600', 
              icon: Users,
              shadow: 'hover:shadow-sky-900/10'
            },
            'OUT_OF_ORDER': { 
              bg: 'bg-slate-100', 
              border: 'border-slate-300', 
              hoverBorder: 'hover:border-slate-400', 
              text: 'text-slate-500', 
              icon: Wrench,
              shadow: 'hover:shadow-slate-900/5'
            }
          };
          
          const config = statusConfig[room.status] || statusConfig['VACANT_CLEAN'];
          const Icon = config.icon;
          
          return (
            <div 
              key={room.number} 
              className={`relative p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer shadow-sm hover:-translate-y-1 ${config.bg} ${config.border} ${config.hoverBorder} ${config.shadow}`}
              onClick={() => setSelectedRoomNumber(room.number)}
              style={{ animationDelay: `${idx * 20}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl font-bold text-slate-800 tracking-tighter">{room.number}</span>
                <div className={`p-1.5 rounded-lg ${room.status === 'OCCUPIED' ? 'bg-sky-200 text-sky-700' : 'bg-slate-100 text-slate-400'}`}>
                  <Icon size={16} />
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                 <span className={`text-[10px] font-black uppercase tracking-widest ${config.text}`}>
                  {room.status.replace('VACANT_', '').replace('_', ' ')}
                </span>
                <p className="text-xs font-medium text-slate-500 truncate">{room.type}</p>
              </div>
              
              {room.status === 'OCCUPIED' && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-sky-500 rounded-b-2xl opacity-50"></div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );

  const renderRoomManagementModal = () => {
    if (!selectedRoomNumber) return null;
    
    const room = getRoom(selectedRoomNumber);
    if (!room) return null;

    const currentStay = reservations.find(r => r.roomNumber === room.number && r.status === 'CHECKED_IN');
    const guest = currentStay ? getGuest(currentStay.guestId) : null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedRoomNumber(null);
      }}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Quarto {room.number}
                <span className="text-sm font-normal text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                  {room.type}
                </span>
              </h3>
            </div>
            <button onClick={() => setSelectedRoomNumber(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <XCircle size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Status Section */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Status Atual</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    updateRoomStatus(room.number, 'VACANT_CLEAN');
                    toast.success(`Quarto ${room.number} liberado.`);
                    setSelectedRoomNumber(null);
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${room.status === 'VACANT_CLEAN' ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <Sparkles size={20} />
                  <span className="text-sm font-medium">Limpo</span>
                </button>
                <button 
                   onClick={() => {
                    updateRoomStatus(room.number, 'VACANT_DIRTY');
                    toast.info(`Quarto ${room.number} marcado para limpeza.`);
                    setSelectedRoomNumber(null);
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${room.status === 'VACANT_DIRTY' ? 'bg-orange-50 border-orange-500 text-orange-700 ring-1 ring-orange-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <Clock size={20} />
                  <span className="text-sm font-medium">Sujo</span>
                </button>
                <button 
                   onClick={() => {
                    updateRoomStatus(room.number, 'OUT_OF_ORDER');
                    toast.warning(`Quarto ${room.number} interditado.`);
                    setSelectedRoomNumber(null);
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${room.status === 'OUT_OF_ORDER' ? 'bg-slate-100 border-slate-500 text-slate-700 ring-1 ring-slate-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <Wrench size={20} />
                  <span className="text-sm font-medium">Manutenção</span>
                </button>
                <button 
                  disabled={!!currentStay}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all opacity-50 cursor-not-allowed ${room.status === 'OCCUPIED' ? 'bg-sky-50 border-sky-500 text-sky-700 ring-1 ring-sky-500' : 'bg-white border-slate-200 text-slate-600'}`}
                >
                  <Users size={20} />
                  <span className="text-sm font-medium">Ocupado</span>
                </button>
              </div>
            </div>

            {/* Occupancy Details */}
            {currentStay && guest && (
              <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-sky-900 flex items-center gap-2">
                    <UserCog size={16} /> Hóspede Atual
                  </h4>
                  <button 
                    onClick={() => {
                      setSelectedRoomNumber(null);
                      setSelectedReservationId(currentStay.id);
                    }}
                    className="text-xs font-bold text-sky-600 hover:underline"
                  >
                    Ver Reserva
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 ring-2 ring-white">
                    <AvatarFallback className="bg-sky-200 text-sky-700 font-bold">
                      {guest.name.substring(0,2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900">{guest.name}</p>
                    <p className="text-xs text-slate-500">Sai em: {currentStay.checkOutDate}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Maintenance Notes */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Reportar Problema</label>
              <div className="flex gap-2">
                <Input placeholder="Ex: Ar condicionado não gela..." className="flex-1" />
                <Button size="icon" variant="outline" onClick={() => toast.success("Nota adicionada ao time de manutenção.")}>
                  <Wrench size={16} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
            <Button variant="ghost" onClick={() => setSelectedRoomNumber(null)}>Fechar</Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20">
        <div className="p-8 pb-4">
           <div className="space-y-3 mb-6">
             <BrandLogo variant="onDark" height={44} className="max-w-[240px]" />
             <span className="text-xs text-sky-400 font-bold uppercase tracking-widest">Painel recepção</span>
           </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Operação Diária</p>
          
          <button 
            onClick={() => setActiveTab('arrivals')} 
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === 'arrivals' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/50 translate-x-1' : 'hover:bg-slate-800 hover:text-white hover:translate-x-1'}`}
          >
            <LogIn size={20} className={activeTab === 'arrivals' ? 'text-sky-200' : 'text-slate-400 group-hover:text-white'} /> 
            <span className="font-medium">Chegadas</span>
            {reservations.filter(r => (r.status === 'INVITED' || r.status === 'PRECHECKIN_DONE') && r.checkInDate <= today).length > 0 && (
              <span className="ml-auto bg-sky-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {reservations.filter(r => (r.status === 'INVITED' || r.status === 'PRECHECKIN_DONE') && r.checkInDate <= today).length}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab('in_house')} 
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === 'in_house' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/50 translate-x-1' : 'hover:bg-slate-800 hover:text-white hover:translate-x-1'}`}
          >
            <Users size={20} className={activeTab === 'in_house' ? 'text-sky-200' : 'text-slate-400 group-hover:text-white'} /> 
            <span className="font-medium">Hospedados</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('departures')} 
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === 'departures' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/50 translate-x-1' : 'hover:bg-slate-800 hover:text-white hover:translate-x-1'}`}
          >
            <LogOut size={20} className={activeTab === 'departures' ? 'text-sky-200' : 'text-slate-400 group-hover:text-white'} /> 
            <span className="font-medium">Saídas</span>
          </button>
          
          <div className="my-6 border-t border-slate-800 mx-4"></div>
          
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gestão</p>
          
          <button 
            onClick={() => setActiveTab('rooms')} 
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === 'rooms' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/50 translate-x-1' : 'hover:bg-slate-800 hover:text-white hover:translate-x-1'}`}
          >
            <BedDouble size={20} className={activeTab === 'rooms' ? 'text-sky-200' : 'text-slate-400 group-hover:text-white'} /> 
            <span className="font-medium">Mapa de Quartos</span>
          </button>
        </nav>
        
        <div className="p-4 m-4 bg-slate-800/50 rounded-2xl border border-slate-800 relative">
           {isUserMenuOpen && (
             <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden animate-in slide-in-from-bottom-2 z-50">
               <div className="p-3 bg-slate-900/50 border-b border-slate-700">
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trocar Turno</p>
               </div>
               {STAFF_LIST.map(user => (
                 <button 
                   key={user}
                   className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-700 transition-colors flex items-center gap-3 ${currentUser === user ? 'text-sky-400 font-bold bg-slate-700/50' : 'text-slate-300'}`}
                   onClick={() => {
                     switchUser(user);
                     setIsUserMenuOpen(false);
                     toast.success(`Turno de ${user} iniciado.`);
                   }}
                 >
                   <div className={`w-2.5 h-2.5 rounded-full ring-2 ring-offset-2 ring-offset-slate-800 ${currentUser === user ? 'bg-sky-400 ring-sky-400' : 'bg-slate-600 ring-transparent'}`}></div>
                   {user}
                 </button>
               ))}
             </div>
           )}
           
           <button 
             className="flex items-center gap-3 w-full p-1 rounded-lg transition-colors group"
             onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
           >
             <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-slate-700 group-hover:border-sky-500 transition-colors shadow-lg">
                {currentUser.charAt(0)}
             </div>
             <div className="flex-1 text-left overflow-hidden">
               <p className="text-white text-sm font-bold truncate">{currentUser}</p>
               <p className="text-xs text-slate-400 truncate">Recepção</p>
             </div>
             <ChevronUp size={16} className={`text-slate-500 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
           </button>
           
           <Link
             to={PATHS.home}
             className="mt-4 flex items-center justify-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all w-full text-xs font-bold uppercase tracking-wide border border-transparent hover:border-red-500/20"
           >
             <LogOut size={14} />
             <span>Encerrar Sessão</span>
           </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto bg-slate-50/50">
        <div className="max-w-7xl mx-auto space-y-8">
          {activeTab === 'arrivals' && renderArrivalsContent()}
          {activeTab === 'rooms' && renderRoomsContent()}
          {activeTab === 'in_house' && renderInHouseContent()}
          {activeTab === 'departures' && renderDeparturesContent()}
        </div>
      </main>

      {/* Modals & Panels */}
      {renderOccupancyReport()}
      {renderGuestDetailsPanel()}
      {renderRoomManagementModal()}
      {activeTab === 'arrivals' && renderArrivalsRoomPickerSheet()}
    </div>
  );
}