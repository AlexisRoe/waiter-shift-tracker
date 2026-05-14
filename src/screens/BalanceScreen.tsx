import {
  Box,
  Button,
  Container,
  Drawer,
  Group,
  SegmentedControl,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowDown, IconPlus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddTipForm } from '../components/shared/AddTipForm.component';
import { CurrencyDisplay } from '../components/shared/CurrencyDisplay.component';
import { useAppStore } from '../store/useAppStore';
import { calculateDurationHours } from '../utils/date.util';

interface UnifiedTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'wage' | 'shiftTip' | 'manualTip' | 'withdrawal';
  label: string;
  subLabel?: string;
}

export const BalanceScreen = () => {
  const { t } = useTranslation();
  const theme = useMantineTheme();

  const shifts = useAppStore((state) => state.shifts) || [];
  const tipTransactions = useAppStore((state) => state.tipTransactions) || [];
  const profile = useAppStore((state) => state.profile);

  const [tab, setTab] = useState('All');

  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [withdrawOpened, { open: openWithdraw, close: closeWithdraw }] = useDisclosure(false);

  // Derived data with safety
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

  // Calculate tip jar
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

  // Unified list of all transactions
  const allTransactions = useMemo(() => {
    const list: UnifiedTransaction[] = [];

    // Add shift-related transactions
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

    // Add manual transactions
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

  // Filter based on tab
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((tx) => {
      if (tab === 'All') return true;
      if (tab === 'Shifts') return tx.type === 'wage';
      if (tab === 'Tips') return tx.type !== 'wage';
      return true;
    });
  }, [allTransactions, tab]);

  // Group by month
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

  return (
    <Box pb={100}>
      <Container size="sm" p="md">
        {/* Tip Jar Section */}
        <Box
          style={{
            backgroundColor: theme.colors.teal[9],
            borderRadius: theme.radius.lg,
            padding: 24,
            marginBottom: 24,
            marginTop: 12,
            boxShadow: theme.shadows.md,
          }}
        >
          <Group align="flex-start" wrap="nowrap" mb="xl">
            <Box
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                border: `6px solid ${theme.colors.teal[6]}`,
                borderRightColor: theme.colors.teal[8],
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                flexShrink: 0,
              }}
            >
              <CurrencyDisplay amount={currentPot} size="lg" fw={800} lh={1} />
              <Text size="10px" fw={700} c="dimmed" mt={2}>
                {t('balance.inThePot')}
              </Text>
            </Box>

            <Box style={{ flex: 1 }}>
              <Text size="xs" fw={700} c="teal.1" mb={4} style={{ opacity: 0.8 }}>
                {t('balance.tipJar')}
              </Text>
              <Text size="sm" mb="md" lh={1.3} c="white">
                {t('balance.tipJarDesc')}
              </Text>
              <Group gap="xs">
                <Text size="xs" c="teal.1" style={{ opacity: 0.9 }}>
                  <Text span fw={600} c="white">
                    +{totalIn.toFixed(2)} €
                  </Text>{' '}
                  {t('balance.in')}
                </Text>
                <Text size="xs" c="teal.1" style={{ opacity: 0.9 }}>
                  <Text span fw={600} c="white">
                    {totalOut.toFixed(2)} €
                  </Text>{' '}
                  {t('balance.out')}
                </Text>
              </Group>
            </Box>
          </Group>

          {/* Monthly Earnings Card (Moved inside) */}
          <Box
            mb="xl"
            p="md"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: theme.radius.md,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Group justify="space-between" align="center">
              <Stack gap={0}>
                <Text size="10px" fw={700} c="teal.1" style={{ letterSpacing: 0.5, opacity: 0.8 }}>
                  {t('balance.monthlyEarnings').toUpperCase()}
                </Text>
                <Text size="xs" fw={500} c="white" style={{ opacity: 0.9 }}>
                  {dayjs().format('MMMM YYYY')} · {t('balance.target')}{' '}
                  {profile?.maxMonthlyEarnings || 540}€
                </Text>
              </Stack>
              <CurrencyDisplay amount={monthlyTotal} fz={20} fw={800} lh={1} c="white" />
            </Group>
          </Box>

          <Group grow>
            <Button
              variant="outline"
              color="white"
              radius="xl"
              size="xs"
              leftSection={<IconPlus size={16} />}
              onClick={openAdd}
              styles={{
                root: {
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                },
              }}
            >
              {t('balance.addTip')}
            </Button>
            <Button
              variant="outline"
              color="white"
              radius="xl"
              size="xs"
              leftSection={<IconArrowDown size={16} />}
              onClick={openWithdraw}
              styles={{
                root: {
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                },
              }}
            >
              {t('balance.withdrawFromPot')}
            </Button>
          </Group>
        </Box>

        <SegmentedControl
          value={tab}
          onChange={setTab}
          data={[
            { label: t('balance.all'), value: 'All' },
            { label: t('balance.shifts'), value: 'Shifts' },
            { label: t('balance.tipsAndPot'), value: 'Tips' },
          ]}
          fullWidth
          radius="xl"
          mb="xl"
        />

        {Object.keys(grouped).length === 0 ? (
          <Stack align="center" py={40} gap="xs">
            <Text fw={600} c="dimmed">
              {t('balance.noTransactions')}
            </Text>
            <Text size="sm" c="dimmed" ta="center" px="xl">
              {t('balance.emptyState')}
            </Text>
          </Stack>
        ) : (
          Object.entries(grouped).map(([month, txs]) => (
            <Box key={month} mb="xl">
              <Text fw={700} c="dimmed" size="xs" mb="md" style={{ letterSpacing: 1 }}>
                {month}
              </Text>
              <Stack gap="xs">
                {txs.map((tx) => (
                  <Group
                    key={tx.id}
                    justify="space-between"
                    p="md"
                    style={{
                      backgroundColor: 'white',
                      borderRadius: theme.radius.md,
                      border: `1px solid ${theme.colors.gray[1]}`,
                    }}
                  >
                    <Box>
                      <Text fw={600} size="sm">
                        {tx.label}
                      </Text>
                      <Group gap={6}>
                        <Text size="xs" c="dimmed">
                          {dayjs(tx.date).format('DD.MM.YYYY')}
                        </Text>
                        {tx.subLabel && (
                          <Text size="xs" c="dimmed">
                            · {tx.subLabel}
                          </Text>
                        )}
                      </Group>
                    </Box>
                    <Text fw={700} c={tx.amount < 0 ? 'red.7' : 'teal.8'}>
                      {tx.amount < 0 ? '-' : '+'}
                      {Math.abs(tx.amount).toFixed(2)} €
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Box>
          ))
        )}
      </Container>

      {/* Add Tip Drawer */}
      <Drawer
        opened={addOpened}
        onClose={closeAdd}
        title={<Text fw={700}>{t('addTip.titleDeposit')}</Text>}
        position="bottom"
        size="auto"
        withinPortal={false}
        padding="xl"
        styles={{
          content: {
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            boxShadow: '0 -10px 30px rgba(0,0,0,0.1)',
          },
        }}
      >
        <AddTipForm mode="deposit" onSuccess={closeAdd} onCancel={closeAdd} />
      </Drawer>

      {/* Withdraw Tip Drawer */}
      <Drawer
        opened={withdrawOpened}
        onClose={closeWithdraw}
        title={<Text fw={700}>{t('addTip.titleWithdraw')}</Text>}
        position="bottom"
        size="auto"
        withinPortal={false}
        padding="xl"
        styles={{
          content: {
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            boxShadow: '0 -10px 30px rgba(0,0,0,0.1)',
          },
        }}
      >
        <AddTipForm mode="withdraw" onSuccess={closeWithdraw} onCancel={closeWithdraw} />
      </Drawer>
    </Box>
  );
};
