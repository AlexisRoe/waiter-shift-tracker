import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, Shift, TipTransaction, UserProfile } from './types';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      shifts: [],
      tipTransactions: [],
      isOnboarded: false,

      setProfile: (profile: UserProfile) =>
        set(() => ({ profile, isOnboarded: true })),

      updateProfile: (updates: Partial<UserProfile>) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
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
