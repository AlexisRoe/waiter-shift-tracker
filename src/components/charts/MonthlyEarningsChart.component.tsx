import { BarChart } from '@mantine/charts';
import { useMantineTheme } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface MonthlyEarningsChartProps {
  data: { month: string; wage: number; tips: number }[];
}

export const MonthlyEarningsChart = ({ data }: MonthlyEarningsChartProps) => {
  const theme = useMantineTheme();
  const { t } = useTranslation();

  return (
    <BarChart
      h={180}
      data={data}
      dataKey="month"
      type="stacked"
      series={[
        { name: 'wage', color: theme.colors.teal[8], label: t('balance.wage') },
        { name: 'tips', color: theme.colors.yellow[5], label: t('balance.tips') },
      ]}
      barProps={{ radius: [4, 4, 0, 0] }}
      withYAxis={false}
    />
  );
};
