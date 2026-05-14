import {
  AppShell,
  Text,
  Title,
  Button,
  Stack,
  Container,
  Paper,
  Group,
  useMantineTheme,
} from '@mantine/core';

function App() {
  const theme = useMantineTheme();

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header
        style={{
          borderBottom: `1px solid ${theme.colors.gray[2]}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Title order={3} c="blue.6">
          Shift Tracker
        </Title>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="sm" p={0}>
          <Stack gap="xl" mt="xl">
            <Paper shadow="sm" radius="md" p="xl" withBorder style={{ textAlign: 'center' }}>
              <Title order={2} mb="xs">
                Hello, Waiter!
              </Title>
              <Text c="dimmed" mb="lg">
                Your offline-first PWA for tracking shifts and income.
              </Text>

              <Button fullWidth size="lg" radius="xl" color="blue">
                Start New Shift
              </Button>
            </Paper>

            <Group grow align="flex-start">
              <Paper shadow="sm" radius="md" p="md" withBorder>
                <Text size="sm" c="dimmed" fw={500}>
                  This Week
                </Text>
                <Text size="xl" fw={700}>
                  €0.00
                </Text>
              </Paper>

              <Paper shadow="sm" radius="md" p="md" withBorder>
                <Text size="sm" c="dimmed" fw={500}>
                  Hours
                </Text>
                <Text size="xl" fw={700}>
                  0h
                </Text>
              </Paper>
            </Group>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
