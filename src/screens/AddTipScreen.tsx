import { ActionIcon, Box, Button, Container, Group, NumberInput, Text, TextInput, Title, useMantineTheme } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconCalendarEvent, IconChevronLeft } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export const AddTipScreen = () => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode === 'withdraw' ? 'withdraw' : 'deposit';

  const addTipTransaction = useAppStore((state) => state.addTipTransaction);

  const form = useForm({
    initialValues: {
      amount: '' as unknown as number,
      date: new Date(),
      note: '',
    },
    validate: {
      amount: (val: number) => (val > 0 ? null : t('common.invalidNumber')),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    const amount = mode === 'withdraw' ? -Math.abs(values.amount) : Math.abs(values.amount);
    
    addTipTransaction({
      id: crypto.randomUUID(),
      date: dayjs(values.date).format('YYYY-MM-DD'),
      amount,
      note: values.note,
    });
    
    navigate(-1);
  };

  return (
    <Box pb={100}>
      <Container size="sm" p="md">
        <Group align="center" mt="md" mb="xl">
          <ActionIcon variant="subtle" color="dark" onClick={() => navigate(-1)}>
            <IconChevronLeft size={24} />
          </ActionIcon>
          <Title order={2}>
            {mode === 'withdraw' ? t('addTip.titleWithdraw') : t('addTip.titleDeposit')}
          </Title>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: theme.radius.lg,
              padding: 32,
              border: `1px solid ${theme.colors.gray[2]}`,
              marginBottom: 24,
              textAlign: 'center',
            }}
          >
            <Text size="xs" fw={700} c="dimmed" mb="md" style={{ textTransform: 'uppercase' }}>
              {t('addTip.amount')}
            </Text>
            
            <NumberInput
              variant="unstyled"
              size="xl"
              decimalScale={2}
              hideControls
              leftSection={<Text size="32px" c="dimmed">€</Text>}
              styles={{
                input: { fontSize: 48, fontWeight: 800, textAlign: 'center', height: 60 },
              }}
              {...form.getInputProps('amount')}
            />
          </Box>

          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: theme.radius.lg,
              padding: 20,
              border: `1px solid ${theme.colors.gray[2]}`,
              marginBottom: 24,
            }}
          >
            <DatePickerInput
              label={t('addTip.date')}
              leftSection={<IconCalendarEvent size={18} />}
              mb="md"
              {...form.getInputProps('date')}
            />

            <TextInput
              label={t('addTip.note')}
              description="Optional"
              placeholder={t('addTip.notePlaceholder')}
              {...form.getInputProps('note')}
            />
          </Box>

          <Button type="submit" size="lg" radius="xl" color="teal.8" fullWidth>
            {mode === 'withdraw' ? t('addTip.withdraw') : t('addTip.save')}
          </Button>
        </form>
      </Container>
    </Box>
  );
};
