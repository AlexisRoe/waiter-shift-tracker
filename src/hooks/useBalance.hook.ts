import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { calculateDurationHours } from '../utils/date.util';

export interface UnifiedTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'wage' | 'shiftTip' | 'manualTip' | 'withdrawal';
  label: string;
  subLabel?: string;
}

/**
 * Provides all balance / tip-jar calculations and transaction list data.
 * Extracted from BalanceScreen.
 */
export const useBalance = () => {
  const { t } = useTranslation();

  const shifts = useAppStore((state) => state.shifts) || [];
  const tipTransactions = useAppStore((state) => state.tipTransactions) || [];
  const profile = useAppStore((state) => state.profile);

  const [tab, setTab] = useState('All');

  // --- Monthly earnings ---
  const currentMonthShifts = useMemo(
    () => shifts.filter((s) => s?.date && dayjs(s.date).isSame(dayjs(), 'month')),
    [shifts],
  );

  const monthlyWage = useMemo(
    () =>
      currentMonthShifts.reduce((sum, s) => {
        return sum + calculateDurationHours(s.startTime, s.endTime) * (s.hourlyRate || 0);
      }, 0),
    [currentMonthShifts],
  );

  const monthlyTips = useMemo(
    () => currentMonthShifts.reduce((sum, s) => sum + (s.tips || 0), 0),
    [currentMonthShifts],
  );

  const monthlyTotal = monthlyWage + monthlyTips;

  // --- Tip jar ---
  const initialPot = profile?.startingTipBudget || 0;

  const tipsFromShiftsTotal = useMemo(
    () => shifts.reduce((sum, s) => sum + (s.tips || 0), 0),
    [shifts],
  );

  const externalTipsSum = useMemo(
    () => tipTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
    [tipTransactions],
  );

  const currentPot = initialPot + tipsFromShiftsTotal + externalTipsSum;

  const totalIn =
    initialPot +
    tipsFromShiftsTotal +
    tipTransactions.filter((t) => (t.amount || 0) > 0).reduce((s, t) => s + (t.amount || 0), 0);

  const totalOut = tipTransactions
    .filter((t) => (t.amount || 0) < 0)
    .reduce((s, t) => s + (t.amount || 0), 0);

  // --- Unified transaction list ---
  const allTransactions = useMemo(() => {
    const list: UnifiedTransaction[] = [];

    shifts.forEach((s) => {
      if (!s?.endTime) return;

      const duration = calculateDurationHours(s.startTime, s.endTime);
      const wage = duration * (s.hourlyRate || 0);

      list.push({
        id: `wage-${s.id}`,
        date: s.date,
        amount: wage,
        type: 'wage',
        label: t('balance.shiftWage'),
        subLabel: s.venue,
      });

      if ((s.tips || 0) > 0) {
        list.push({
          id: `tip-${s.id}`,
          date: s.date,
          amount: s.tips || 0,
          type: 'shiftTip',
          label: t('balance.shiftTip'),
          subLabel: s.venue,
        });
      }
    });

    tipTransactions.forEach((tt) => {
      if (!tt) return;
      list.push({
        id: tt.id,
        date: tt.date,
        amount: tt.amount || 0,
        type: (tt.amount || 0) >= 0 ? 'manualTip' : 'withdrawal',
        label: (tt.amount || 0) >= 0 ? t('balance.manualTip') : t('balance.withdrawal'),
        subLabel: tt.note,
      });
    });

    return list.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
  }, [shifts, tipTransactions, t]);

  // --- Filter by tab ---
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((tx) => {
      if (tab === 'All') return true;
      if (tab === 'Shifts') return tx.type === 'wage';
      if (tab === 'Tips') return tx.type !== 'wage';
      return true;
    });
  }, [allTransactions, tab]);

  // --- Group by month ---
  const grouped = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, tx) => {
        const month = dayjs(tx.date).format('MMMM YYYY').toUpperCase();
        if (!acc[month]) acc[month] = [];
        acc[month].push(tx);
        return acc;
      },
      {} as Record<string, UnifiedTransaction[]>,
    );
  }, [filteredTransactions]);

  return {
    tab,
    setTab,
    profile,
    currentPot,
    totalIn,
    totalOut,
    monthlyWage,
    monthlyTips,
    monthlyTotal,
    allTransactions,
    filteredTransactions,
    grouped,
  };
};
