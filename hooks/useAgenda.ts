// Vitta+ useAgenda Hook — hooks/useAgenda.ts
import { useContext } from 'react';
import { AgendaContext } from '@/contexts/AgendaContext';

export function useAgenda() {
  const context = useContext(AgendaContext);
  if (!context) throw new Error('useAgenda must be used within AgendaProvider');
  return context;
}
