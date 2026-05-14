import { ActionIcon, Box, Button, Container, Group, SegmentedControl, Text, Title, useMantineTheme } from '@mantine/core';
import { IconArrowDown, IconChevronLeft } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CurrencyDisplay } from '../components/shared/CurrencyDisplay.component';
import { useAppStore } from '../store/useAppStore';
import { calculateDurationHours } from '../utils/date.util';

export const BalanceScreen = () => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const shifts = useAppStore((state) => state.shifts);
  const tipTransactions = useAppStore((state) => state.tipTransactions);
  const profile = useAppStore((state) => state.profile);

  const [tab, setTab] = useState('All');

  const currentMonthShifts = shifts.filter((s) => dayjs(s.date).isSame(dayjs(), 'month'));
  const monthlyWage = currentMonthShifts.reduce((sum, s) => {
    return sum + calculateDurationHours(s.startTime, s.endTime) * s.hourlyRate;
  }, 0);
  const monthlyTips = currentMonthShifts.reduce((sum, s) => sum + (s.tips || 0), 0);
  const monthlyTotal = monthlyWage + monthlyTips;

  // Calculate tip jar
  const initialPot = profile?.startingTipBudget || 0;
  const tipsFromShifts = shifts.reduce((sum, s) => sum + (s.tips || 0), 0);
  const externalTipsSum = tipTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  const currentPot = initialPot + tipsFromShifts + externalTipsSum;
  const totalIn = initialPot + tipsFromShifts + tipTransactions.filter(t => t.amount > 0).reduce((s,t) => s+t.amount, 0);
  const totalOut = tipTransactions.filter(t => t.amount < 0).reduce((s,t) => s+t.amount, 0);

  return (
    <Box pb={100}>
      <Container size="sm" p="md">
        <Group align="center" mt="md" mb="xl">
          <ActionIcon variant="subtle" color="dark" onClick={() => navigate(-1)}>
            <IconChevronLeft size={24} />
          </ActionIcon>
          <Box>
            <Text size="xs" c="dimmed">
              Earnings & tip pot
            </Text>
            <Title order={2}>{t('balance.title')}</Title>
          </Box>
        </Group>

        <Box
          style={{
            backgroundColor: 'white',
            borderRadius: theme.radius.lg,
            padding: 24,
            border: `1px solid ${theme.colors.gray[2]}`,
            marginBottom: 24,
          }}
        >
          <Text size="xs" fw={700} c="dimmed" mb={4}>
            {t('balance.monthlyEarnings')}
          </Text>
          <CurrencyDisplay amount={monthlyTotal} fz={32} fw={800} lh={1.1} />
          <Text size="sm" c="dimmed">
            {dayjs().format('MMM YYYY')} · {t('balance.target')} 540€
          </Text>
        </Box>

        <Box
          style={{
            backgroundColor: theme.colors.yellow[0],
            borderRadius: theme.radius.lg,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <Group align="flex-start" wrap="nowrap" mb="xl">
            <Box
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                border: `8px solid ${theme.colors.yellow[4]}`,
                borderRightColor: theme.colors.yellow[2], // fake donut effect
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
              }}
            >
              <CurrencyDisplay amount={currentPot} size="xl" fw={800} lh={1} />
              <Text size="xs" fw={700} c="dimmed" mt={4}>
                {t('balance.inThePot')}
              </Text>
            </Box>
            
            <Box style={{ flex: 1 }}>
              <Text size="xs" fw={700} c="dimmed" mb={4}>
                {t('balance.tipJar')}
              </Text>
              <Text size="sm" mb="md" lh={1.4}>
                {t('balance.tipJarDesc')}
              </Text>
              <Group gap="xs">
                <Text size="xs" c="dimmed">
                  <Text span fw={600} c="dark">+{totalIn.toFixed(2)} €</Text> {t('balance.in')}
                </Text>
                <Text size="xs" c="dimmed">
                  <Text span fw={600} c="dark">{totalOut.toFixed(2)} €</Text> {t('balance.out')}
                </Text>
              </Group>
            </Box>
          </Group>

          <Button
            fullWidth
            color="dark"
            radius="xl"
            size="md"
            leftSection={<IconArrowDown size={18} />}
            onClick={() => navigate('/balance/tip', { state: { mode: 'withdraw' } })}
          >
            {t('balance.withdrawFromPot')}
          </Button>
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

        <Group justify="space-between" mb="md">
          <Text fw={700} c="dimmed" style={{ textTransform: 'uppercase' }}>
            {dayjs().format('MMM YYYY')}
          </Text>
        </Group>

      </Container>

      <Button
        size="lg"
        radius="xl"
        color="teal.8"
        leftSection={<IconArrowDown size={20} style={{ transform: 'rotate(180deg)' }} />}
        onClick={() => navigate('/balance/tip', { state: { mode: 'deposit' } })}
        style={{
          position: 'fixed',
          bottom: 100,
          right: 'calc(50% - 215px + 20px)',
          boxShadow: theme.shadows.md,
          zIndex: 10,
        }}
      >
        {t('balance.addTip')}
      </Button>
    </Box>
  );
};
