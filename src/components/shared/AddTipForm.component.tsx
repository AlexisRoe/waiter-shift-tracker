import { Box, Button, NumberInput, Text, TextInput, useMantineTheme } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconCalendarEvent } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';

interface AddTipFormProps {
  mode: 'deposit' | 'withdraw';
  onSuccess: () => void;
}

export const AddTipForm = ({ mode, onSuccess }: AddTipFormProps) => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
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
    
    onSuccess();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Box
        style={{
          backgroundColor: '#f8f9fa',
          borderRadius: theme.radius.lg,
          padding: 24,
          border: `1px solid ${theme.colors.gray[1]}`,
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        <Text size="xs" fw={700} c="dimmed" mb="xs" style={{ textTransform: 'uppercase' }}>
          {t('addTip.amount')}
        </Text>
        
        <NumberInput
          variant="unstyled"
          size="xl"
          placeholder="0.00"
          decimalScale={2}
          fixedDecimalScale
          hideControls
          suffix=" €"
          allowNegative={false}
          autoFocus
          styles={{
            input: { fontSize: 36, fontWeight: 800, textAlign: 'center', height: 50 },
          }}
          {...form.getInputProps('amount')}
        />
      </Box>

      <Box
        style={{
          backgroundColor: 'white',
          borderRadius: theme.radius.lg,
          padding: 16,
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
  );
};
