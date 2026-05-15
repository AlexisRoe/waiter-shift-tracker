import { Box, Text, useMantineTheme } from '@mantine/core';
import dayjs from 'dayjs';
import type { DashboardPeriod, HeatmapCell } from '../../utils/dashboardCalculations.util';

interface Props {
  cells: HeatmapCell[];
  period: DashboardPeriod;
}

export const TipHeatmap = ({ cells, period }: Props) => {
  const theme = useMantineTheme();
  const maxValue = Math.max(...cells.map((c) => c.value), 0.01);

  const getCellColor = (value: number, isEmpty: boolean) => {
    if (isEmpty || value === 0) return theme.colors.gray[1];
    const intensity = value / maxValue;
    return `rgba(12, 166, 120, ${Math.max(0.15, intensity)})`;
  };

  const textColor = (value: number) => {
    if (value === 0) return 'dimmed';
    return value / maxValue >= 0.6 ? 'white' : 'dark.8';
  };

  if (period === 'month') {
    const firstDow = dayjs(cells[0]?.date).day();
    const offset = firstDow === 0 ? 6 : firstDow - 1;
    const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return (
      <Box>
        <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, mb: 4 }}>
          {Array.from({ length: 7 }, (_, i) => i).map((dayIndex) => (
            <Text key={`day-${dayIndex}`} size="xs" c="dimmed" ta="center">
              {dayLabels[dayIndex]}
            </Text>
          ))}
        </Box>
        <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {Array.from({ length: offset }, (_, i) => i).map((padIndex) => (
            <Box key={`pad-${padIndex}`} style={{ aspectRatio: '1' }} />
          ))}
          {cells.map((cell) => (
            <Box
              key={cell.date}
              style={{
                aspectRatio: '1',
                borderRadius: 6,
                backgroundColor: getCellColor(cell.value, cell.isEmpty),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={cell.isEmpty ? cell.label : `${cell.label}: €${cell.value.toFixed(2)}`}
            >
              <Text size="xs" fw={cell.value > 0 ? 600 : 400} c={textColor(cell.value)}>
                {cell.label}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (period === 'year') {
    return (
      <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {cells.map((cell) => (
          <Box
            key={cell.date}
            style={{
              borderRadius: 8,
              backgroundColor: getCellColor(cell.value, cell.isEmpty),
              minHeight: 64,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
            title={cell.isEmpty ? cell.label : `${cell.label}: €${cell.value.toFixed(2)}`}
          >
            <Text size="xs" fw={600} c={textColor(cell.value)}>
              {cell.label}
            </Text>
            {cell.value > 0 && (
              <Text size="xs" c={textColor(cell.value)}>
                €{cell.value.toFixed(0)}
              </Text>
            )}
          </Box>
        ))}
      </Box>
    );
  }

  // three-months: full-width grid of week tiles
  return (
    <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
      {cells.map((cell) => (
        <Box
          key={cell.date}
          style={{
            aspectRatio: '1',
            borderRadius: 8,
            backgroundColor: getCellColor(cell.value, cell.isEmpty),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
          title={cell.isEmpty ? cell.label : `${cell.label}: €${cell.value.toFixed(2)}`}
        >
          <Text size="xs" fw={600} c={textColor(cell.value)}>
            {cell.label}
          </Text>
          {cell.value > 0 && (
            <Text size="xs" c={textColor(cell.value)}>
              €{cell.value.toFixed(0)}
            </Text>
          )}
        </Box>
      ))}
    </Box>
  );
};
