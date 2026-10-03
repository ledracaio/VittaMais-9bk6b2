// Vitta+ Agenda Context — contexts/AgendaContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

export type AgendaItemType = 'viagem' | 'curso' | 'consulta' | 'lembrete';

export interface AgendaItem {
  id: string;
  type: AgendaItemType;
  typeLabel: string;
  title: string;
  subtitle: string;
  date: string;
  dateLabel: string;
  time: string;
  color: string;
  icon: string;
  confirmed: boolean;
}

interface AgendaContextType {
  items: AgendaItem[];
  addItem: (item: Omit<AgendaItem, 'id'>) => void;
  removeItem: (id: string) => void;
  getUpcomingItems: () => AgendaItem[];
}

export const AgendaContext = createContext<AgendaContextType | undefined>(undefined);

const initialItems: AgendaItem[] = [
  {
    id: 'agenda-1',
    type: 'viagem',
    typeLabel: 'Viagem',
    title: 'Cruzeiro pelo Mediterrâneo',
    subtitle: 'Itália, Grécia e Croácia — Consultor: Bruno Lima',
    date: '2025-09-15',
    dateLabel: '15 de Setembro',
    time: '08:00',
    color: '#E07A5F',
    icon: 'flight',
    confirmed: false,
  },
  {
    id: 'agenda-2',
    type: 'curso',
    typeLabel: 'Curso',
    title: 'Finanças na Aposentadoria',
    subtitle: 'Prof. Ricardo Alves — Online ao vivo',
    date: '2025-07-10',
    dateLabel: '10 de Julho',
    time: '14:00',
    color: '#C9922A',
    icon: 'school',
    confirmed: true,
  },
  {
    id: 'agenda-3',
    type: 'consulta',
    typeLabel: 'Teleconsulta',
    title: 'Teleconsulta com Dra. Beatriz',
    subtitle: 'Clínica geral — Por videochamada',
    date: '2025-07-08',
    dateLabel: '8 de Julho',
    time: '10:30',
    color: '#B05070',
    icon: 'video-call',
    confirmed: true,
  },
  {
    id: 'agenda-4',
    type: 'lembrete',
    typeLabel: 'Lembrete',
    title: 'Tomar remédio — Pressão',
    subtitle: 'Diário às 8h',
    date: '2025-07-07',
    dateLabel: 'Amanhã',
    time: '08:00',
    color: '#1A6B6B',
    icon: 'notifications',
    confirmed: true,
  },
  {
    id: 'agenda-5',
    type: 'lembrete',
    typeLabel: 'Lembrete',
    title: 'Ligar para filha',
    subtitle: 'Aniversário dela esta semana',
    date: '2025-07-09',
    dateLabel: '9 de Julho',
    time: '18:00',
    color: '#4A8FA8',
    icon: 'phone',
    confirmed: true,
  },
];

export function AgendaProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<AgendaItem[]>(initialItems);

  const addItem = (item: Omit<AgendaItem, 'id'>) => {
    const newItem: AgendaItem = {
      ...item,
      id: `agenda-${Date.now()}`,
    };
    setItems((prev) => [...prev, newItem].sort((a, b) => a.date.localeCompare(b.date)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getUpcomingItems = (): AgendaItem[] => {
    return items.sort((a, b) => a.date.localeCompare(b.date));
  };

  return (
    <AgendaContext.Provider value={{ items, addItem, removeItem, getUpcomingItems }}>
      {children}
    </AgendaContext.Provider>
  );
}
