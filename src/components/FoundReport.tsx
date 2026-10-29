import { createContext, ReactNode, useContext, useState } from 'react';

import { useApp } from '@/store';

// Draft of a "found pet" report, shared by the three form steps and the confirmation.
export type FoundReport = {
  photos: string[];
  animal: string;
  condition: string;
  behaviour: string;
  description: string;
  location: string;
  landmark: string;
  when: string;
  help: string[];
  canKeep: string;
  situation: string;
  name: string;
  phone: string;
  coords?: { latitude: number; longitude: number };
  submitted?: boolean;
};

const now = new Date();
const initial: FoundReport = {
  photos: [],
  animal: 'Dog',
  condition: 'No visible injury',
  behaviour: 'Scared',
  description: '',
  location: '',
  landmark: '',
  when: `${now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`,
  help: ['Shelter place', 'Transport'],
  canKeep: 'For 24 hours',
  situation: '',
  name: '',
  phone: '',
};

type Ctx = { report: FoundReport; update: (patch: Partial<FoundReport>) => void };
const FoundContext = createContext<Ctx | null>(null);

export function useFoundReport() {
  const ctx = useContext(FoundContext);
  if (!ctx) throw new Error('useFoundReport must be used inside the found flow');
  return ctx;
}

export function FoundReportProvider({ children }: { children: ReactNode }) {
  const { user } = useApp();
  const [report, setReport] = useState({ ...initial, name: user?.name ?? '', phone: user?.phone ?? '' });
  const update = (patch: Partial<FoundReport>) => setReport((r) => ({ ...r, ...patch }));
  return <FoundContext.Provider value={{ report, update }}>{children}</FoundContext.Provider>;
}
