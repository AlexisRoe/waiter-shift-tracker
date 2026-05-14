import {
  Box,
  Button,
  Container,
  Group,
  SegmentedControl,
  Text,
  ThemeIcon,
  useMantineTheme,
} from '@mantine/core';
import { IconPlus, IconTrendingUp } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { EarningsTrendChart } from '../components/charts/EarningsTrendChart.component';
import { WeekdayBarChart } from '../components/charts/WeekdayBarChart.component';
import { MonthlyEarningsChart } from '../components/charts/MonthlyEarningsChart.component';
import { CurrencyDisplay } from '../components/shared/CurrencyDisplay.component';
import { useAppStore } from '../store/useAppStore';
import { calculateDurationHours } from '../utils/date.util';

export const DashboardScreen = () => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const profile = useAppStore((state) => state.profile);
  const shifts = useAppStore((state) => state.shifts);

  const [period, setPeriod] = useState('Month');

  // Basic stats calc (mocked logic for the specific period for brevity)
  const currentMonthShifts = shifts.filter((s) => dayjs(s.date).isSame(dayjs(), 'month'));
  const totalHours = currentMonthShifts.reduce(
    (sum, s) => sum + calculateDurationHours(s.startTime, s.endTime),
    0,
  );
  const totalEarnings = currentMonthShifts.reduce((sum, s) => {
    const hours = calculateDurationHours(s.startTime, s.endTime);
    return sum + hours * s.hourlyRate + (s.tips || 0);
  }, 0);
  const monthlyWage = currentMonthShifts.reduce((sum, s) => {
    return sum + calculateDurationHours(s.startTime, s.endTime) * s.hourlyRate;
  }, 0);
  const monthlyTips = currentMonthShifts.reduce((sum, s) => sum + (s.tips || 0), 0);
  const avgHourly = totalHours > 0 ? totalEarnings / totalHours : 0;

  // Mock data for charts to match screenshots visually
  const trendData = Array.from({ length: 14 }).map((_, i) => ({
    date: dayjs()
      .subtract(13 - i, 'day')
      .format('MMM D'),
    value: Math.random() * 100 + 50,
  }));

  const weekdayData = [
    { day: 'M', hours: 4 },
    { day: 'T', hours: 5 },
    { day: 'W', hours: 2 },
    { day: 'T', hours: 6 },
    { day: 'F', hours: 8 },
    { day: 'S', hours: 10 }, // Sat is best
    { day: 'S', hours: 7 },
  ];

  const monthlyChartData = [
    { month: 'Nov', wage: 270, tips: 100 },
    { month: 'Dec', wage: 330, tips: 139 },
    { month: 'Jan', wage: 400, tips: 130 },
    { month: 'Feb', wage: 320, tips: 78 },
    { month: 'Mar', wage: 200, tips: 46 },
    { month: dayjs().format('MMM'), wage: monthlyWage, tips: monthlyTips },
  ];

  return (
    <Box>
      <Box
        style={{
          backgroundColor: theme.colors.teal[8],
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
          padding: '40px 24px 32px',
          color: 'white',
        }}
      >
        <Group justify="space-between" align="flex-start" mb={32}>
          <Box>
            <Text size="lg" fw={500} mb={4}>
              {t('dashboard.greeting', { name: profile?.name })}
            </Text>
          </Box>
          <ThemeIcon size={48} radius="xl" color="teal.9">
            <Text fw={700} size="lg">
              {profile?.name.substring(0, 2).toUpperCase()}
            </Text>
          </ThemeIcon>
        </Group>

        <SegmentedControl
          value={period}
          onChange={setPeriod}
          data={[
            { label: t('dashboard.week'), value: 'Week' },
            { label: t('dashboard.month'), value: 'Month' },
            { label: t('dashboard.year'), value: 'Year' },
          ]}
          fullWidth
          radius="xl"
          color="teal.9"
          style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
          mb="xl"
          styles={{
            label: { color: 'white' },
          }}
        />

        <Text size="sm" opacity={0.8} mb={4}>
          {t('dashboard.totalEarnings', { period: dayjs().format('MMMM YYYY') })}
        </Text>
        <CurrencyDisplay amount={totalEarnings} fz={42} fw={800} lh={1.1} mb="md" />

        <Group gap="xs" mb="xl">
          <IconTrendingUp size={16} />
          <Text size="sm">
            +117 % {t('dashboard.vsLastPeriod', { period: t(`dashboard.${period.toLowerCase()}`) })}
          </Text>
        </Group>

        <Group grow align="flex-start">
          <Box style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 12 }}>
            <Text size="xs" opacity={0.8} mb={4}>
              {t('dashboard.shifts')}
            </Text>
            <Text size="xl" fw={700}>
              {currentMonthShifts.length}
            </Text>
          </Box>
          <Box style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 12 }}>
            <Text size="xs" opacity={0.8} mb={4}>
              {t('dashboard.hours')}
            </Text>
            <Text size="xl" fw={700}>
              {Math.round(totalHours)}h
            </Text>
          </Box>
          <Box style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 12 }}>
            <Text size="xs" opacity={0.8} mb={4}>
              {t('dashboard.avgHour')}
            </Text>
            <CurrencyDisplay amount={avgHourly} size="xl" fw={700} />
          </Box>
        </Group>
      </Box>

      <Container size="sm" p="md" mt={-10}>
        <Box
          style={{
            backgroundColor: 'white',
            borderRadius: theme.radius.lg,
            padding: 20,
            boxShadow: theme.shadows.sm,
            marginBottom: 16,
          }}
        >
          <Group justify="space-between" mb="lg">
            <Text fw={700}>{t('dashboard.earningsTrend')}</Text>
            <Text size="xs" c="dimmed">
              {t('dashboard.last14Days')}
            </Text>
          </Group>
          <EarningsTrendChart data={trendData} />
        </Box>

        <Box
          style={{
            backgroundColor: 'white',
            borderRadius: theme.radius.lg,
            padding: 20,
            boxShadow: theme.shadows.sm,
            marginBottom: 32,
          }}
        >
          <Group justify="space-between" mb="lg">
            <Text fw={700}>{t('dashboard.hoursByWeekday')}</Text>
            <Box
              style={{
                backgroundColor: theme.colors.teal[0],
                color: theme.colors.teal[8],
                padding: '4px 8px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {t('dashboard.bestDay', { day: 'Sat' })}
            </Box>
          </Group>
          <WeekdayBarChart data={weekdayData} />
        </Box>

        <Box
          style={{
            backgroundColor: 'white',
            borderRadius: theme.radius.lg,
            padding: 20,
            boxShadow: theme.shadows.sm,
            marginBottom: 32,
          }}
        >
          <Group justify="space-between" mb="lg">
            <Text fw={700}>{t('balance.monthlyEarnings')}</Text>
            <Text size="xs" c="dimmed">
              {dayjs().format('MMMM YYYY')}
            </Text>
          </Group>
          <MonthlyEarningsChart data={monthlyChartData} />
        </Box>
      </Container>

      <Button
        size="lg"
        radius="xl"
        color="teal.8"
        leftSection={<IconPlus size={20} />}
        onClick={() => navigate('/shifts/new')}
        style={{
          position: 'fixed',
          bottom: 100,
          right: 'calc(50% - 215px + 20px)', // adjust for max-width
          boxShadow: theme.shadows.md,
          zIndex: 10,
        }}
      >
        {t('dashboard.logShift')}
      </Button>
    </Box>
  );
};
