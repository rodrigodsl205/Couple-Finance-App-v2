import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface Space {
  id: string;
  name: string;
  type?: string;
  created_by?: string;
}

interface SpacesContextType {
  currentSpace: Space | null;
  spaces: Space[];
  loading: boolean;
  setCurrentSpace: (space: Space) => void;
  refreshSpaces: () => Promise<void>;
}

const SpacesContext = createContext<SpacesContextType | undefined>(undefined);

export function SpacesProvider({ children }: { children: ReactNode }) {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [currentSpace, setCurrentSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('workspaces')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        setSpaces(data);
        if (!currentSpace) {
          setCurrentSpace(data[0]);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar espaços financeiros:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  return (
    <SpacesContext.Provider
      value={{
        currentSpace,
        spaces,
        loading,
        setCurrentSpace,
        refreshSpaces: fetchSpaces,
      }}
    >
      {children}
    </SpacesContext.Provider>
  );
}

export function useSpaces() {
  const context = useContext(SpacesContext);
  if (context === undefined) {
    throw new Error('useSpaces deve ser usado dentro de um SpacesProvider');
  }
  return context;
}