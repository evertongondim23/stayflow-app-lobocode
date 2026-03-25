import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

// --- Types ---

export type ReservationStatus = 
  | 'INVITED'           // Convite enviado, pré-checkin não iniciado
  | 'PRECHECKIN_DONE'   // Dados preenchidos, aguardando recepção
  | 'CHECKED_IN'        // Hospedado
  | 'CHECKOUT_PENDING'  // Solicitou saída
  | 'CHECKED_OUT'       // Finalizado
  | 'NO_SHOW'           // Não compareceu
  | 'CANCELLED';        // Cancelado

export interface Log {
  id: string;
  reservationId?: string;
  action: string;
  details: string;
  timestamp: string;
  user: string; // 'Guest' | 'Reception' | 'System'
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  document?: string;
  signature?: string; // URL da assinatura
  avatarUrl?: string; // URL da foto de perfil
  notes?: string; // Observações internas
}

export interface Room {
  number: string;
  type: string; // 'Standard', 'Deluxe', 'Suite'
  status: 'VACANT_CLEAN' | 'VACANT_DIRTY' | 'OCCUPIED' | 'OUT_OF_ORDER';
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: 'accommodation' | 'food' | 'service' | 'other';
}

export interface Reservation {
  id: string;
  guestId: string;
  roomNumber?: string;
  status: ReservationStatus;
  checkInDate: string;
  checkOutDate: string;
  expenses: Expense[];
  balance: number; // Total a pagar
}

export interface RevenueStat {
  name: string;
  revenue: number;
  expenses: number;
}

interface HotelContextType {
  guests: Guest[];
  rooms: Room[];
  reservations: Reservation[];
  revenueStats: RevenueStat[];
  
  logs: Log[];
  currentUser: string;
  
  // Actions
  switchUser: (name: string) => void;
  updateReservationStatus: (id: string, status: ReservationStatus) => void;
  updateGuestData: (guestId: string, data: Partial<Guest>) => void;
  addExpense: (reservationId: string, description: string, amount: number, category?: Expense['category']) => void;
  assignRoom: (reservationId: string, roomNumber: string) => void;
  updateRoomStatus: (roomNumber: string, status: Room['status']) => void;
  addLog: (action: string, details: string, reservationId?: string, user?: string) => void;
  getGuestReservation: (guestId: string) => Reservation | undefined;
}

// --- Mock Data ---

const STAFF_USERS = ['Ana (Manhã)', 'Carlos (Tarde)', 'Sofia (Noite)', 'Gerente Geral'];

const INITIAL_GUESTS: Guest[] = [
  { id: 'g1', name: 'João Silva', email: 'joao@email.com', notes: 'Prefere andar alto.' },
  { id: 'g2', name: 'Maria Santos', email: 'maria@email.com', document: '123.456.789-00' },
  { id: 'g3', name: 'Carlos Oliveira', email: 'carlos@email.com', document: '987.654.321-99' },
];

const INITIAL_ROOMS: Room[] = [
  { number: '101', type: 'Standard', status: 'VACANT_CLEAN' },
  { number: '102', type: 'Deluxe', status: 'OCCUPIED' },
  { number: '201', type: 'Suite', status: 'OCCUPIED' },
  { number: '202', type: 'Standard', status: 'VACANT_DIRTY' },
  { number: '301', type: 'Standard', status: 'VACANT_CLEAN' },
  { number: '302', type: 'Deluxe', status: 'OUT_OF_ORDER' },
];

const INITIAL_RESERVATIONS: Reservation[] = [
  // João: Chegando (Pré-checkin pendente)
  { 
    id: 'res1', 
    guestId: 'g1', 
    status: 'INVITED', 
    checkInDate: '2023-10-25', 
    checkOutDate: '2023-10-28',
    expenses: [
      { id: 'e1', description: 'Diárias (3 noites)', amount: 600, date: '2023-10-25', category: 'accommodation' }
    ],
    balance: 600
  },
  // Maria: Hospedada (Aproveitando)
  { 
    id: 'res2', 
    guestId: 'g2', 
    roomNumber: '102',
    status: 'CHECKED_IN', 
    checkInDate: '2023-10-24', 
    checkOutDate: '2023-10-27',
    expenses: [
      { id: 'e2', description: 'Diárias (3 noites)', amount: 900, date: '2023-10-24', category: 'accommodation' },
      { id: 'e3', description: 'Room Service - Jantar', amount: 120, date: '2023-10-24', category: 'food' },
      { id: 'e4', description: 'Frigobar', amount: 45, date: '2023-10-25', category: 'food' }
    ],
    balance: 1065
  },
  // Carlos: Saída (Check-out)
  { 
    id: 'res3', 
    guestId: 'g3', 
    roomNumber: '201',
    status: 'CHECKOUT_PENDING', 
    checkInDate: '2023-10-20', 
    checkOutDate: '2023-10-25',
    expenses: [
      { id: 'e5', description: 'Diárias (5 noites)', amount: 2500, date: '2023-10-20', category: 'accommodation' }
    ],
    balance: 2500
  }
];

const MOCK_REVENUE_STATS: RevenueStat[] = [
  { name: 'Seg', revenue: 4000, expenses: 2400 },
  { name: 'Ter', revenue: 3000, expenses: 1398 },
  { name: 'Qua', revenue: 2000, expenses: 9800 },
  { name: 'Qui', revenue: 2780, expenses: 3908 },
  { name: 'Sex', revenue: 1890, expenses: 4800 },
  { name: 'Sáb', revenue: 2390, expenses: 3800 },
  { name: 'Dom', revenue: 3490, expenses: 4300 },
];

// --- Context ---

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export function HotelProvider({ children }: { children: ReactNode }) {
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [revenueStats] = useState<RevenueStat[]>(MOCK_REVENUE_STATS);
  const [logs, setLogs] = useState<Log[]>([]);
  const [currentUser, setCurrentUser] = useState<string>('Ana (Manhã)');

  const switchUser = (name: string) => {
    setCurrentUser(name);
    addLog('USER_SWITCH', `Turno iniciado por ${name}`, undefined, name);
  };

  const addLog = (action: string, details: string, reservationId?: string, user?: string) => {
    const newLog: Log = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      details,
      reservationId,
      user: user || currentUser, // Usa o usuário atual se não for especificado
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const updateReservationStatus = (id: string, status: ReservationStatus) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    
    const res = reservations.find(r => r.id === id);
    if (!res) return;

    // Lógica de atualização de quarto baseada no status
    if (status === 'CHECKED_OUT' && res.roomNumber) {
       updateRoomStatus(res.roomNumber, 'VACANT_DIRTY');
       addLog('CHECK_OUT', `Reserva finalizada. Quarto ${res.roomNumber} marcado como Sujo.`, id, 'System');
    } else if (status === 'CHECKED_IN' && res.roomNumber) {
       updateRoomStatus(res.roomNumber, 'OCCUPIED');
       addLog('CHECK_IN', `Check-in confirmado. Quarto ${res.roomNumber} ocupado.`, id, 'Reception');
    } else {
       addLog('STATUS_CHANGE', `Status alterado para ${status}`, id, 'System');
    }
  };

  const updateRoomStatus = (roomNumber: string, status: Room['status']) => {
    setRooms(prev => prev.map(room => room.number === roomNumber ? { ...room, status } : room));
  };

  const updateGuestData = (guestId: string, data: Partial<Guest>) => {
    setGuests(prev => prev.map(g => g.id === guestId ? { ...g, ...data } : g));
  };

  const addExpense = (reservationId: string, description: string, amount: number, category: Expense['category'] = 'other') => {
    setReservations(prev => prev.map(r => {
      if (r.id === reservationId) {
        const newExpense: Expense = {
          id: Math.random().toString(36).substr(2, 9),
          description,
          amount,
          date: new Date().toISOString().split('T')[0],
          category
        };
        addLog('EXPENSE_ADDED', `Despesa lançada: ${description} (R$ ${amount})`, reservationId, 'System');
        return {
          ...r,
          expenses: [...r.expenses, newExpense],
          balance: r.balance + amount
        };
      }
      return r;
    }));
  };

  const assignRoom = (reservationId: string, roomNumber: string) => {
    setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, roomNumber } : r));
    // Não muda status para OCCUPIED ainda, só quando confirmar Check-in. Mas reserva o quarto logicamente.
    // Para simplificar MVP, vamos assumir que atribuição já bloqueia visualmente na UI.
    addLog('ROOM_ASSIGN', `Quarto ${roomNumber} atribuído`, reservationId, 'Reception');
  };

  const getGuestReservation = (guestId: string) => {
    return reservations.find(r => r.guestId === guestId && r.status !== 'CHECKED_OUT');
  };

  return (
    <HotelContext.Provider value={{
      guests,
      rooms,
      reservations,
      revenueStats,
      logs,
      currentUser,
      switchUser,
      updateReservationStatus,
      updateGuestData,
      addExpense,
      assignRoom,
      updateRoomStatus,
      addLog,
      getGuestReservation
    }}>
      {children}
    </HotelContext.Provider>
  );
}

export function useHotel() {
  const context = useContext(HotelContext);
  if (context === undefined) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
}