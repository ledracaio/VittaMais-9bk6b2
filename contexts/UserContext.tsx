// Vitta+ User Context — contexts/UserContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

export interface UserPreferences {
  fontSize: 'normal' | 'grande' | 'extra-grande';
  theme: 'claro' | 'escuro';
  notifications: boolean;
  notificationTypes: {
    viagens: boolean;
    cursos: boolean;
    saude: boolean;
    mensagens: boolean;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  age: number;
  preferences: UserPreferences;
}

interface UserContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  getFontScale: () => number;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultUser: UserProfile = {
  name: 'Maria',
  email: 'maria.silva@email.com',
  phone: '(11) 9 8765-4321',
  city: 'São Paulo, SP',
  age: 65,
  preferences: {
    fontSize: 'normal',
    theme: 'claro',
    notifications: true,
    notificationTypes: {
      viagens: true,
      cursos: true,
      saude: true,
      mensagens: true,
    },
  },
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(defaultUser);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setUser((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...prefs },
    }));
  };

  const getFontScale = (): number => {
    switch (user.preferences.fontSize) {
      case 'grande': return 1.15;
      case 'extra-grande': return 1.3;
      default: return 1.0;
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, updatePreferences, getFontScale }}>
      {children}
    </UserContext.Provider>
  );
}
