import { ActionIcon, Box, Button, Container, Drawer, Group, SegmentedControl, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowDown, IconPlus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CurrencyDisplay } from '../components/shared/CurrencyDisplay.component';
import { AddTipForm } from '../components/shared/AddTipForm.component';
import { useAppStore } from '../store/useAppStore';
import { calculateDurationHours } from '../utils/date.util';

export const BalanceScreen = () => {
  const { t } = useTranslation();
  const theme = useMantineTheme();

  const shifts = useAppStore((state) => state.shifts);
  const tipTransactions = useAppStore((state) => state.tipTransactions);
  const profile = useAppStore((state) => state.profile);

  const [tab, setTab] = useState('All');
  
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [withdrawOpened, { open: openWithdraw, close: closeWithdraw }] = useDisclosure(false);

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
        {/* Tip Jar Section - Now at the Top */}
        <Box
          style={{
            backgroundColor: theme.colors.yellow[0],
            borderRadius: theme.radius.lg,
            padding: 24,
            marginBottom: 24,
            marginTop: 12,
          }}
        >
          <Group align="flex-start" wrap="nowrap" mb="xl">
            <Box
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                border: `6px solid ${theme.colors.yellow[4]}`,
                borderRightColor: theme.colors.yellow[2],
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
              <Text size="xs" fw={700} c="dimmed" mb={4}>
                {t('balance.tipJar')}
              </Text>
              <Text size="sm" mb="md" lh={1.3} c="dark">
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

          <Group grow>
            <Button 
              variant="filled" 
              color="teal.8" 
              radius="xl" 
              size="xs" 
              leftSection={<IconPlus size={16} />}
              onClick={openAdd}
            >
              {t('balance.addTip')}
            </Button>
            <Button 
              variant="filled" 
              color="dark" 
              radius="xl" 
              size="xs" 
              leftSection={<IconArrowDown size={16} />}
              onClick={openWithdraw}
            >
              {t('balance.withdrawFromPot')}
            </Button>
          </Group>
        </Box>

        {/* Monthly Earnings Section */}
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
            boxShadow: '0 -10px 30px rgba(0,0,0,0.1)'
          }
        }}
      >
        <AddTipForm mode="deposit" onSuccess={closeAdd} />
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
            boxShadow: '0 -10px 30px rgba(0,0,0,0.1)'
          }
        }}
      >
        <AddTipForm mode="withdraw" onSuccess={closeWithdraw} />
      </Drawer>
    </Box>
  );
};
