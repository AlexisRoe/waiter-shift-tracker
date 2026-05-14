import { AreaChart } from '@mantine/charts';
import { useMantineTheme } from '@mantine/core';

interface EarningsTrendChartProps {
  data: { date: string; value: number }[];
}

export const EarningsTrendChart = ({ data }: EarningsTrendChartProps) => {
  const theme = useMantineTheme();

  return (
    <AreaChart
      h={160}
      data={data}
      dataKey="date"
      series={[{ name: 'value', color: theme.colors.teal[8] }]}
      curveType="linear"
      withXAxis={false}
      withYAxis={false}
      withDots={false}
      fillOpacity={0.05}
      strokeWidth={2}
    />
  );
};
