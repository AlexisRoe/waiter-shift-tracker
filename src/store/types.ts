export interface UserProfile {
  name: string;
  company: string;
  hourlyRate: number;
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
  venue: string;
  hourlyRate: number; // can differ from default
  tips: number; // earned during this shift
}

export interface TipTransaction {
  id: string;
  date: string;
  amount: number; // positive = tip in, negative = withdrawal
  note?: string;
}

export interface AppState {
  profile: UserProfile | null;
  shifts: Shift[];
  tipTransactions: TipTransaction[];
  isOnboarded: boolean;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addShift: (shift: Shift) => void;
  updateShift: (id: string, updates: Partial<Shift>) => void;
  deleteShift: (id: string) => void;
  addTipTransaction: (transaction: TipTransaction) => void;
  clearAllData: () => void;
}
