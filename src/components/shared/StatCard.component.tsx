import { Paper, Text } from '@mantine/core';

interface StatCardProps {
  label: string;
  value: React.ReactNode;
}

export const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <Paper p="md" shadow="sm">
      <Text size="xs" c="dimmed" fw={600} mb={4}>
        {label}
      </Text>
      <Text size="xl" fw={700}>
        {value}
      </Text>
    </Paper>
  );
};
