import { createContext, ReactNode, useContext, useState } from 'react';

// In-memory app state: saved animals, meeting applications and donations. Resets when the app restarts.
type AppState = {
  saved: string[];
  applications: string[];
  donated: Record<string, number>;
  toggleSaved: (id: string) => void;
  apply: (id: string) => void;
  donate: (id: string, amount: number) => void;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState(['luna', 'molly', 'milo']);
  const [applications, setApplications] = useState<string[]>([]);

  const toggleSaved = (id: string) =>
    setSaved((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  const apply = (id: string) => {
    setApplications((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setSaved((prev) => (prev.includes(id) ? prev : [id, ...prev]));
  };

  const [donated, setDonated] = useState<Record<string, number>>({});
  const donate = (id: string, amount: number) =>
    setDonated((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + amount }));

  return (
    <AppContext.Provider value={{ saved, applications, donated, toggleSaved, apply, donate }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
