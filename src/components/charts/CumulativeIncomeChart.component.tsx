import { AreaChart } from '@mantine/charts';
import { useMantineTheme } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { CumulativeDataPoint } from '../../utils/dashboardCalculations.util';

interface Props {
  data: CumulativeDataPoint[];
}

export const CumulativeIncomeChart = ({ data }: Props) => {
  const theme = useMantineTheme();
  const { t } = useTranslation();

  return (
    <AreaChart
      h={160}
      data={data}
      dataKey="label"
      series={[{ name: 'cumulative', color: theme.colors.teal[7], label: t('dashboard.income') }]}
      curveType="monotone"
      withXAxis={false}
      withYAxis={false}
      withDots={false}
      fillOpacity={0.15}
      strokeWidth={2}
    />
  );
};
