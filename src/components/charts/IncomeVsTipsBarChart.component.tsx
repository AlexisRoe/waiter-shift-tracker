import { BarChart } from '@mantine/charts';
import { useMantineTheme } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { IncomeVsTipsDataPoint } from '../../utils/dashboardCalculations.util';

interface Props {
  data: IncomeVsTipsDataPoint[];
}

export const IncomeVsTipsBarChart = ({ data }: Props) => {
  const theme = useMantineTheme();
  const { t } = useTranslation();

  return (
    <BarChart
      h={180}
      data={data}
      dataKey="label"
      type="stacked"
      series={[
        { name: 'income', color: theme.colors.teal[7], label: t('dashboard.income') },
        { name: 'tips', color: theme.colors.yellow[5], label: t('shifts.tips') },
      ]}
      barProps={{ radius: [4, 4, 0, 0] }}
      withYAxis={false}
      withLegend
      legendProps={{ verticalAlign: 'bottom', height: 36 }}
    />
  );
};
