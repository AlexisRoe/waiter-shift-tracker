export interface Company {
  id: string;
  name: string;
  hourlyRate: number;
  createdAt: string; // ISO date
}

export interface UserProfile {
  name: string;
  defaultCompanyId: string;
  startingTipBudget: number;
  language: 'de' | 'en';
  maxMonthlyEarnings: number;
  minHourlyWage: number;
}

export interface Shift {
  id: string;
  date: string; // ISO date "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime?: string; // undefined = not ended yet
  companyId: string;
  venue: string; // usually same as company name, but kept for flexibility
  hourlyRate: number; // can differ from default
  tips: number; // earned during this shift
}

export interface TipTransaction {
  id: string;
  date: string;
  amount: number; // positive = tip in, negative = withdrawal
  note?: string;
}

export type DashboardPeriod = 'month' | 'three-months' | 'year';
export type BalanceTab = 'All' | 'Shifts' | 'Tips';

export interface AppState {
  profile: UserProfile | null;
  companies: Company[];
  shifts: Shift[];
  tipTransactions: TipTransaction[];
  isOnboarded: boolean;
  dashboardPeriod: DashboardPeriod;
  balanceTab: BalanceTab;
  /** True after `persist` finishes rehydrating from IndexedDB (not persisted). */
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setDashboardPeriod: (period: DashboardPeriod) => void;
  setBalanceTab: (tab: BalanceTab) => void;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addCompany: (company: Company) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  setDefaultCompany: (id: string) => void;
  addShift: (shift: Shift) => void;
  updateShift: (id: string, updates: Partial<Shift>) => void;
  deleteShift: (id: string) => void;
  addTipTransaction: (transaction: TipTransaction) => void;
  clearAllData: () => void;
}
