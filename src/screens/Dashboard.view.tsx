import { Box, Container, Group, SegmentedControl, Text, useMantineTheme } from '@mantine/core';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { CumulativeIncomeChart } from '../components/charts/CumulativeIncomeChart.component';
import { IncomeVsTipsBarChart } from '../components/charts/IncomeVsTipsBarChart.component';
import { TipHeatmap } from '../components/charts/TipHeatmap.component';
import { CurrencyDisplay } from '../components/shared/CurrencyDisplay.component';
import { TealPageHeader } from '../components/shared/TealPageHeader.component';
import { type DashboardPeriod, useDashboardStats } from '../hooks/useDashboardStats.hook';
import { useAppStore } from '../store/app.store';

export const DashboardView = () => {
  const { t } = useTranslation();
  const theme = useMantineTheme();

  const period = useAppStore((state) => state.dashboardPeriod);
  const setPeriod = useAppStore((state) => state.setDashboardPeriod);

  const { stats, earningsChange, cumulativeData, groupedBarData, heatmapData, hasShifts } =
    useDashboardStats(period);

  const periodLabel =
    period === 'month'
      ? dayjs().format('MMMM YYYY')
      : period === 'three-months'
        ? t('dashboard.period3Months')
        : dayjs().format('YYYY');

  const heatmapTitle =
    period === 'month'
      ? t('dashboard.tipsByDay')
      : period === 'three-months'
        ? t('dashboard.tipsByWeek')
        : t('dashboard.tipsByMonth');

  const notEnough = t('dashboard.notEnoughData');

  return (
    <Box>
      <TealPageHeader>
        <Text size="sm" opacity={0.8} mb={4}>
          {t('dashboard.totalEarnings', { period: periodLabel })}
        </Text>
        <CurrencyDisplay amount={stats.totalEarnings} fz={42} fw={800} lh={1.1} mb="md" />

        <Group gap="xs" mb="xl">
          {earningsChange !== null ? (
            <>
              {earningsChange >= 0 ? <IconTrendingUp size={16} /> : <IconTrendingDown size={16} />}
              <Text size="sm">
                {earningsChange >= 0 ? '+' : ''}
                {earningsChange} %{' '}
                {t('dashboard.vsLastPeriod', {
                  period:
                    period === 'month'
                      ? t('dashboard.month')
                      : period === 'three-months'
                        ? t('dashboard.period3Months')
                        : t('dashboard.year'),
                })}
              </Text>
            </>
          ) : (
            <Text size="sm" opacity={0.7}>
              {t('dashboard.noPrognosisData')}
            </Text>
          )}
        </Group>

        <SegmentedControl
          value={period}
          onChange={(val) => setPeriod(val as DashboardPeriod)}
          data={[
            { label: t('dashboard.month'), value: 'month' },
            { label: t('dashboard.period3Months'), value: 'three-months' },
            { label: t('dashboard.year'), value: 'year' },
          ]}
          fullWidth
          radius="xl"
          color="teal.9"
          style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
          styles={{
            label: { color: 'white' },
          }}
        />
      </TealPageHeader>

      <Container size="sm" p="md" mt={-10}>
        {/* EARNINGS section */}
        <Box
          style={{
            backgroundColor: theme.colors.teal[0],
            borderRadius: 16,
            padding: 20,
            marginBottom: 12,
            marginTop: 24,
          }}
        >
          <Text size="xs" fw={700} c="teal.6" mb={12} tt="uppercase">
            {t('dashboard.sectionEarnings')}
          </Text>
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <Box>
              <Text size="xs" c="dimmed" mb={4}>
                {t('dashboard.totalIncome')}
              </Text>
              <CurrencyDisplay amount={stats.totalEarnings} size="xl" fw={700} c="teal.8" />
            </Box>
            <Box />
            <Box>
              <Text size="xs" c="dimmed" mb={4}>
                {t('dashboard.avgPerShift')}
              </Text>
              {stats.avgMoneyPerShift !== null ? (
                <CurrencyDisplay amount={stats.avgMoneyPerShift} size="xl" fw={700} c="teal.8" />
              ) : (
                <Text size="xl" fw={700} c="teal.8">
                  {notEnough}
                </Text>
              )}
            </Box>
          </Box>
        </Box>

        {/* SHIFTS section */}
        <Box
          style={{
            backgroundColor: theme.colors.teal[0],
            borderRadius: 16,
            padding: 20,
            marginBottom: 12,
          }}
        >
          <Text size="xs" fw={700} c="teal.6" mb={12} tt="uppercase">
            {t('dashboard.sectionShifts')}
          </Text>
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <Box>
              <Text size="xs" c="dimmed" mb={4}>
                {t('dashboard.shifts')}
              </Text>
              <Text size="xl" fw={700} c="teal.8">
                {stats.totalShifts}
              </Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed" mb={4}>
                {t('dashboard.hours')}
              </Text>
              <Text size="xl" fw={700} c="teal.8">
                {Math.round(stats.totalHours * 10) / 10}h
              </Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed" mb={4}>
                {t('dashboard.avgHoursPerShift')}
              </Text>
              <Text size="xl" fw={700} c="teal.8">
                {stats.avgHoursPerShift !== null
                  ? `${Math.round(stats.avgHoursPerShift * 10) / 10}h`
                  : notEnough}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* TIPS section */}
        <Box
          style={{
            backgroundColor: theme.colors.teal[0],
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <Text size="xs" fw={700} c="teal.6" mb={12} tt="uppercase">
            {t('dashboard.sectionTips')}
          </Text>
          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <Box>
              <Text size="xs" c="dimmed" mb={4}>
                {t('dashboard.totalTips')}
              </Text>
              <CurrencyDisplay amount={stats.totalTips} size="xl" fw={700} c="teal.8" />
            </Box>
            <Box>
              <Text size="xs" c="dimmed" mb={4}>
                {t('dashboard.tipEfficiency')}
              </Text>
              <Text size="xl" fw={700} c="teal.8">
                {stats.tipEfficiency !== null ? `${stats.tipEfficiency.toFixed(1)}%` : notEnough}
              </Text>
            </Box>
            <Box>
              <Text size="xs" c="dimmed" mb={4}>
                {t('dashboard.avgTip')}
              </Text>
              {stats.avgTipPerShift !== null ? (
                <CurrencyDisplay amount={stats.avgTipPerShift} size="xl" fw={700} c="teal.8" />
              ) : (
                <Text size="xl" fw={700} c="teal.8">
                  {notEnough}
                </Text>
              )}
            </Box>
          </Box>
        </Box>

        {/* Cumulative Income Chart */}
        <Box
          style={{
            backgroundColor: 'white',
            borderRadius: theme.radius.lg,
            padding: 20,
            boxShadow: theme.shadows.sm,
            marginBottom: 16,
          }}
        >
          <Text fw={700} mb="md">
            {t('dashboard.cumulativeIncome')}
          </Text>
          {hasShifts ? (
            <CumulativeIncomeChart data={cumulativeData} />
          ) : (
            <Text size="sm" c="dimmed" ta="center" py="xl">
              {t('dashboard.noShiftsYet')}
            </Text>
          )}
        </Box>

        {/* Income vs Tips Bar Chart */}
        <Box
          style={{
            backgroundColor: 'white',
            borderRadius: theme.radius.lg,
            padding: 20,
            boxShadow: theme.shadows.sm,
            marginBottom: 16,
          }}
        >
          <Text fw={700} mb="md">
            {t('dashboard.incomeVsTips')}
          </Text>
          {hasShifts ? (
            <IncomeVsTipsBarChart data={groupedBarData} />
          ) : (
            <Text size="sm" c="dimmed" ta="center" py="xl">
              {t('dashboard.noShiftsYet')}
            </Text>
          )}
        </Box>

        {/* Tip Heatmap */}
        <Box
          style={{
            backgroundColor: 'white',
            borderRadius: theme.radius.lg,
            padding: 20,
            boxShadow: theme.shadows.sm,
            marginBottom: 32,
          }}
        >
          <Text fw={700} mb="md">
            {heatmapTitle}
          </Text>
          {hasShifts ? (
            <TipHeatmap cells={heatmapData} period={period} />
          ) : (
            <Text size="sm" c="dimmed" ta="center" py="xl">
              {t('dashboard.noShiftsYet')}
            </Text>
          )}
        </Box>
      </Container>
    </Box>
  );
};
