// Vitta+ Health Context — contexts/HealthContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { HealthLog, MoodLevel, mockHealthLogs } from '@/services/healthService';

interface HealthContextType {
  logs: HealthLog[];
  addLog: (log: Omit<HealthLog, 'id'>) => void;
  getTodayLog: () => HealthLog | undefined;
  getAverageMood: () => number;
}

export const HealthContext = createContext<HealthContextType | undefined>(undefined);

export function HealthProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<HealthLog[]>(mockHealthLogs);

  const addLog = (log: Omit<HealthLog, 'id'>) => {
    const newLog: HealthLog = {
      ...log,
      id: `log-${Date.now()}`,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const getTodayLog = (): HealthLog | undefined => {
    const today = new Date().toISOString().split('T')[0];
    return logs.find((l) => l.date === today);
  };

  const getAverageMood = (): number => {
    if (logs.length === 0) return 0;
    const recent = logs.slice(0, 7);
    const sum = recent.reduce((acc, l) => acc + l.mood, 0);
    return Math.round((sum / recent.length) * 10) / 10;
  };

  return (
    <HealthContext.Provider value={{ logs, addLog, getTodayLog, getAverageMood }}>
      {children}
    </HealthContext.Provider>
  );
}
