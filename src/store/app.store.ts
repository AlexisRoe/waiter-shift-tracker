import { del, get, set } from 'idb-keyval';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { PERSIST_STORAGE_NAME } from './persistKey';
import type {
  AppState,
  BalanceTab,
  Company,
  DashboardPeriod,
  Shift,
  TipTransaction,
  UserProfile,
} from './types';

const indexedDBStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await get(name);
    return value != null ? String(value) : null;
  },
  setItem: async (name: string, value: string) => {
    await set(name, value);
  },
  removeItem: async (name: string) => {
    await del(name);
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      companies: [],
      shifts: [],
      tipTransactions: [],
      isOnboarded: false,
      dashboardPeriod: 'month',
      balanceTab: 'All',
      _hasHydrated: false,

      setHasHydrated: (value: boolean) => set({ _hasHydrated: value }),
      setDashboardPeriod: (period: DashboardPeriod) => set({ dashboardPeriod: period }),
      setBalanceTab: (tab: BalanceTab) => set({ balanceTab: tab }),

      setProfile: (profile: UserProfile) => set(() => ({ profile, isOnboarded: true })),

      updateProfile: (updates: Partial<UserProfile>) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),

      addCompany: (company: Company) =>
        set((state) => ({ companies: [...state.companies, company] })),

      updateCompany: (id: string, updates: Partial<Company>) =>
        set((state) => ({
          companies: state.companies.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

      deleteCompany: (id: string) =>
        set((state) => ({
          companies: state.companies.filter((c) => c.id !== id),
        })),

      setDefaultCompany: (id: string) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, defaultCompanyId: id } : null,
        })),

      addShift: (shift: Shift) => set((state) => ({ shifts: [...state.shifts, shift] })),

      updateShift: (id: string, updates: Partial<Shift>) =>
        set((state) => ({
          shifts: state.shifts.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        })),

      deleteShift: (id: string) =>
        set((state) => ({
          shifts: state.shifts.filter((s) => s.id !== id),
        })),

      addTipTransaction: (transaction: TipTransaction) =>
        set((state) => ({
          tipTransactions: [...state.tipTransactions, transaction],
        })),

      deleteTipTransaction: (transaction: TipTransaction) =>
        set((state) => ({
          tipTransactions: state.tipTransactions.filter((tt) => tt.id !== transaction.id),
        })),

      clearAllData: () => {
        try {
          localStorage.removeItem(PERSIST_STORAGE_NAME);
        } catch {
          /* ignore */
        }
        set(() => ({
          profile: null,
          companies: [],
          shifts: [],
          tipTransactions: [],
          isOnboarded: false,
        }));
      },
    }),
    {
      name: PERSIST_STORAGE_NAME,
      storage: createJSONStorage(() => indexedDBStorage),
      partialize: (state) => ({
        profile: state.profile,
        companies: state.companies,
        shifts: state.shifts,
        tipTransactions: state.tipTransactions,
        isOnboarded: state.isOnboarded,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.error('[useAppStore] Rehydration from IndexedDB failed', error);
        }
        queueMicrotask(() => {
          useAppStore.getState().setHasHydrated(true);
        });
      },
    },
  ),
);
