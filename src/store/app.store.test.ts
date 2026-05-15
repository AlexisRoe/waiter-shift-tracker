import { beforeEach, describe, expect, it } from 'vitest';
import { useAppStore } from './app.store';
import type { Company, Shift, TipTransaction, UserProfile } from './types';

function makeProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    name: 'Test User',
    defaultCompanyId: 'c1',
    startingTipBudget: 0,
    language: 'de',
    maxMonthlyEarnings: 603,
    minHourlyWage: 14.6,
    ...overrides,
  };
}

function makeCompany(overrides: Partial<Company> = {}): Company {
  return {
    id: 'c1',
    name: 'Test Company',
    hourlyRate: 14,
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeShift(overrides: Partial<Shift> = {}): Shift {
  return {
    id: 's1',
    date: '2026-05-01',
    startTime: '18:00',
    endTime: '22:00',
    companyId: 'c1',
    venue: 'Test Venue',
    hourlyRate: 14,
    tips: 10,
    ...overrides,
  };
}

function makeTipTransaction(overrides: Partial<TipTransaction> = {}): TipTransaction {
  return {
    id: 't1',
    date: '2026-05-01',
    amount: 20,
    ...overrides,
  };
}

beforeEach(() => {
  useAppStore.setState({
    profile: null,
    companies: [],
    shifts: [],
    tipTransactions: [],
    isOnboarded: false,
    dashboardPeriod: 'month',
    balanceTab: 'All',
    _hasHydrated: false,
  });
});

describe('useAppStore', () => {
  describe('setHasHydrated', () => {
    it('sets the hydration flag', () => {
      useAppStore.getState().setHasHydrated(true);
      expect(useAppStore.getState()._hasHydrated).toBe(true);
    });
  });

  describe('setProfile', () => {
    it('sets the profile and marks onboarded', () => {
      const profile = makeProfile();
      useAppStore.getState().setProfile(profile);
      expect(useAppStore.getState().profile).toEqual(profile);
      expect(useAppStore.getState().isOnboarded).toBe(true);
    });
  });

  describe('updateProfile', () => {
    it('merges partial updates into existing profile', () => {
      useAppStore.getState().setProfile(makeProfile({ name: 'Original' }));
      useAppStore.getState().updateProfile({ name: 'Updated' });
      expect(useAppStore.getState().profile?.name).toBe('Updated');
      expect(useAppStore.getState().profile?.defaultCompanyId).toBe('c1');
    });

    it('does nothing when profile is null', () => {
      useAppStore.getState().updateProfile({ name: 'Ignored' });
      expect(useAppStore.getState().profile).toBeNull();
    });
  });

  describe('addCompany / updateCompany / deleteCompany', () => {
    it('adds a company', () => {
      useAppStore.getState().addCompany(makeCompany());
      expect(useAppStore.getState().companies).toHaveLength(1);
    });

    it('updates a company by id', () => {
      useAppStore.getState().addCompany(makeCompany({ id: 'c1', name: 'Old Name' }));
      useAppStore.getState().updateCompany('c1', { name: 'New Name' });
      expect(useAppStore.getState().companies[0].name).toBe('New Name');
    });

    it('deletes a company by id', () => {
      useAppStore.getState().addCompany(makeCompany({ id: 'c1' }));
      useAppStore.getState().deleteCompany('c1');
      expect(useAppStore.getState().companies).toHaveLength(0);
    });
  });

  describe('addShift / updateShift / deleteShift', () => {
    it('adds a shift', () => {
      useAppStore.getState().addShift(makeShift());
      expect(useAppStore.getState().shifts).toHaveLength(1);
    });

    it('updates a shift by id', () => {
      useAppStore.getState().addShift(makeShift({ id: 's1', tips: 10 }));
      useAppStore.getState().updateShift('s1', { tips: 25 });
      expect(useAppStore.getState().shifts[0].tips).toBe(25);
    });

    it('deletes a shift by id', () => {
      useAppStore.getState().addShift(makeShift({ id: 's1' }));
      useAppStore.getState().deleteShift('s1');
      expect(useAppStore.getState().shifts).toHaveLength(0);
    });
  });

  describe('addTipTransaction', () => {
    it('appends a tip transaction', () => {
      useAppStore.getState().addTipTransaction(makeTipTransaction());
      expect(useAppStore.getState().tipTransactions).toHaveLength(1);
      expect(useAppStore.getState().tipTransactions[0].amount).toBe(20);
    });
  });

  describe('setDashboardPeriod / setBalanceTab', () => {
    it('updates the dashboard period', () => {
      useAppStore.getState().setDashboardPeriod('year');
      expect(useAppStore.getState().dashboardPeriod).toBe('year');
    });

    it('updates the balance tab', () => {
      useAppStore.getState().setBalanceTab('Shifts');
      expect(useAppStore.getState().balanceTab).toBe('Shifts');
    });
  });

  describe('clearAllData', () => {
    it('resets all data state', () => {
      useAppStore.getState().setProfile(makeProfile());
      useAppStore.getState().addShift(makeShift());
      useAppStore.getState().clearAllData();
      const state = useAppStore.getState();
      expect(state.profile).toBeNull();
      expect(state.shifts).toHaveLength(0);
      expect(state.companies).toHaveLength(0);
      expect(state.tipTransactions).toHaveLength(0);
      expect(state.isOnboarded).toBe(false);
    });
  });
});
