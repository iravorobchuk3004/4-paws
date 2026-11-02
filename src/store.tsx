import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// App state kept on the device: account, onboarding answers, saved animals,
// meeting applications, donations and notification settings.
export type User = { name: string; email: string; phone?: string; photo?: string };
export type Goal = 'adopt' | 'help' | 'found' | 'explore';
export type CaseUpdate = { at: number; text: string };
export type FoundCase = {
  id: string;
  createdAt: number;
  animal: string;
  location: string;
  photo?: string;
  help: string[];
  resolved?: boolean;
  updates: CaseUpdate[];
};
export type Donation = { id: string; amount: number; at: number };
export type Story = { id: string; at: number; petName: string; shelter: string; when: string; text: string; photo: string };

type Data = {
  seenIntro: boolean;
  user: User | null;
  goal: Goal;
  preferences: Record<string, string[]>;
  saved: string[];
  applications: string[];
  appliedAt: Record<string, number>;
  donated: Record<string, number>;
  donations: Donation[];
  reports: FoundCase[];
  inboxReadAt: number;
  // Treat Run mini-game: bones collected in total and the best single run.
  treats: number;
  bestRun: number;
  stories: Story[];
  notifications: { meetings: boolean; news: boolean };
};

type AppState = Data & {
  loaded: boolean;
  finishIntro: () => void;
  setUser: (user: User | null) => void;
  setGoal: (goal: Goal) => void;
  setPreferences: (preferences: Record<string, string[]>) => void;
  setNotifications: (patch: Partial<Data['notifications']>) => void;
  toggleSaved: (id: string) => void;
  apply: (id: string) => void;
  cancelApplication: (id: string) => void;
  donate: (id: string, amount: number) => void;
  addReport: (report: Omit<FoundCase, 'createdAt' | 'updates'>) => void;
  addReportUpdate: (id: string, text: string) => void;
  resolveReport: (id: string) => void;
  markInboxRead: () => void;
  addTreats: (bones: number) => void;
  addStory: (story: Omit<Story, 'id' | 'at'>) => Story;
  resetAll: () => void;
};

const STORAGE_KEY = '4paws/state/v2';

const initial: Data = {
  seenIntro: false,
  user: null,
  goal: 'adopt',
  // Nothing is pre-picked: matches stay neutral until the person answers the quiz.
  preferences: {},
  saved: [],
  applications: [],
  appliedAt: {},
  donated: {},
  donations: [],
  reports: [],
  inboxReadAt: 0,
  treats: 0,
  bestRun: 0,
  stories: [],
  notifications: { meetings: true, news: false },
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => raw && setData({ ...initial, ...JSON.parse(raw) }))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
  }, [data, loaded]);

  const patch = (p: Partial<Data> | ((d: Data) => Partial<Data>)) =>
    setData((d) => ({ ...d, ...(typeof p === 'function' ? p(d) : p) }));

  const value: AppState = {
    ...data,
    loaded,
    finishIntro: () => patch({ seenIntro: true }),
    setUser: (user) => patch({ user }),
    setGoal: (goal) => patch({ goal }),
    setPreferences: (preferences) => patch({ preferences }),
    setNotifications: (n) => patch((d) => ({ notifications: { ...d.notifications, ...n } })),
    toggleSaved: (id) =>
      patch((d) => ({ saved: d.saved.includes(id) ? d.saved.filter((s) => s !== id) : [...d.saved, id] })),
    apply: (id) =>
      patch((d) => ({
        applications: d.applications.includes(id) ? d.applications : [...d.applications, id],
        appliedAt: { ...d.appliedAt, [id]: Date.now() },
        saved: d.saved.includes(id) ? d.saved : [id, ...d.saved],
      })),
    cancelApplication: (id) => patch((d) => ({ applications: d.applications.filter((a) => a !== id) })),
    donate: (id, amount) =>
      patch((d) => ({
        donated: { ...d.donated, [id]: (d.donated[id] ?? 0) + amount },
        donations: [{ id, amount, at: Date.now() }, ...d.donations],
      })),
    addReport: (report) =>
      patch((d) => ({ reports: [{ ...report, createdAt: Date.now(), updates: [] }, ...d.reports] })),
    addReportUpdate: (id, text) =>
      patch((d) => ({
        reports: d.reports.map((r) => (r.id === id ? { ...r, updates: [...r.updates, { at: Date.now(), text }] } : r)),
      })),
    resolveReport: (id) =>
      patch((d) => ({ reports: d.reports.map((r) => (r.id === id ? { ...r, resolved: true } : r)) })),
    markInboxRead: () => patch({ inboxReadAt: Date.now() }),
    addStory: (story) => {
      const full = { ...story, id: `st-${Date.now()}`, at: Date.now() };
      patch((d) => ({ stories: [full, ...d.stories] }));
      return full;
    },
    addTreats: (bones) => patch((d) => ({ treats: d.treats + bones, bestRun: Math.max(d.bestRun, bones) })),
    // Keep the intro hidden after a reset: the person has already seen it.
    resetAll: () => setData({ ...initial, seenIntro: true }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export const formatDate = (at: number) =>
  new Date(at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) +
  ' · ' +
  new Date(at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

export const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
