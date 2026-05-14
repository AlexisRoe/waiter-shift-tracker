import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Company, Shift, TipTransaction, UserProfile } from './types';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      companies: [],
      shifts: [],
      tipTransactions: [],
      isOnboarded: false,

      setProfile: (profile: UserProfile) =>
        set(() => ({ profile, isOnboarded: true })),

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

      addShift: (shift: Shift) =>
        set((state) => ({ shifts: [...state.shifts, shift] })),

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

      clearAllData: () =>
        set(() => ({
          profile: null,
          companies: [],
          shifts: [],
          tipTransactions: [],
          isOnboarded: false,
        })),
    }),
    {
      name: 'waiter-shift-tracker-storage',
    }
  )
);
