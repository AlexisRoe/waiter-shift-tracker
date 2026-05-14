import { BarChart } from '@mantine/charts';
import { useMantineTheme } from '@mantine/core';

interface WeekdayBarChartProps {
  data: { day: string; hours: number }[];
}

export const WeekdayBarChart = ({ data }: WeekdayBarChartProps) => {
  const theme = useMantineTheme();

  return (
    <BarChart
      h={140}
      data={data}
      dataKey="day"
      series={[{ name: 'hours', color: theme.colors.teal[2] }]}
      withYAxis={false}
      barProps={{
        radius: [4, 4, 0, 0],
      }}
      xAxisProps={{
        tickLine: false,
        axisLine: false,
        tickMargin: 8,
      }}
    />
  );
};
