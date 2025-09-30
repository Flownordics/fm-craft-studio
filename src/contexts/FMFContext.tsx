import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { FMFData, Player, Club, Competition } from '@/lib/fmfParser';

interface FMFContextType {
  data: FMFData | null;
  setData: (data: FMFData) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  updateClub: (id: string, updates: Partial<Club>) => void;
  updateCompetition: (id: string, updates: Partial<Competition>) => void;
  deletePlayer: (id: string) => void;
  deleteClub: (id: string) => void;
  deleteCompetition: (id: string) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}

const FMFContext = createContext<FMFContextType | undefined>(undefined);

export function FMFProvider({ children }: { children: ReactNode }) {
  const [data, setDataState] = useState<FMFData | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const setData = (newData: FMFData) => {
    setDataState(newData);
    setHasUnsavedChanges(false);
  };

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    if (!data) return;
    setDataState({
      ...data,
      players: data.players.map((p) => 
        p.id === id ? { ...p, ...updates } : p
      ),
    });
    setHasUnsavedChanges(true);
  };

  const updateClub = (id: string, updates: Partial<Club>) => {
    if (!data) return;
    setDataState({
      ...data,
      clubs: data.clubs.map((c) => 
        c.id === id ? { ...c, ...updates } : c
      ),
    });
    setHasUnsavedChanges(true);
  };

  const updateCompetition = (id: string, updates: Partial<Competition>) => {
    if (!data) return;
    setDataState({
      ...data,
      competitions: data.competitions.map((c) => 
        c.id === id ? { ...c, ...updates } : c
      ),
    });
    setHasUnsavedChanges(true);
  };

  const deletePlayer = (id: string) => {
    if (!data) return;
    setDataState({
      ...data,
      players: data.players.filter((p) => p.id !== id),
    });
    setHasUnsavedChanges(true);
  };

  const deleteClub = (id: string) => {
    if (!data) return;
    setDataState({
      ...data,
      clubs: data.clubs.filter((c) => c.id !== id),
    });
    setHasUnsavedChanges(true);
  };

  const deleteCompetition = (id: string) => {
    if (!data) return;
    setDataState({
      ...data,
      competitions: data.competitions.filter((c) => c.id !== id),
    });
    setHasUnsavedChanges(true);
  };

  return (
    <FMFContext.Provider
      value={{
        data,
        setData,
        updatePlayer,
        updateClub,
        updateCompetition,
        deletePlayer,
        deleteClub,
        deleteCompetition,
        hasUnsavedChanges,
        setHasUnsavedChanges,
      }}
    >
      {children}
    </FMFContext.Provider>
  );
}

export function useFMF() {
  const context = useContext(FMFContext);
  if (context === undefined) {
    throw new Error('useFMF must be used within a FMFProvider');
  }
  return context;
}
