import { ActionIcon, Box, Button, Container, Group, NumberInput, Select, Text, TextInput, ThemeIcon, Title, useMantineTheme, Modal } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronLeft, IconMail, IconUser } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export const SettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const profile = useAppStore((state) => state.profile);
  const updateProfile = useAppStore((state) => state.updateProfile);
  const clearAllData = useAppStore((state) => state.clearAllData);

  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      name: profile?.name || '',
      company: profile?.company || '',
      hourlyRate: profile?.hourlyRate || 13.5,
      startingTipBudget: profile?.startingTipBudget || 0,
      language: profile?.language || 'de',
    },
  });

  const handleSave = (values: typeof form.values) => {
    updateProfile({
      name: values.name,
      company: values.company,
      hourlyRate: Number(values.hourlyRate),
      startingTipBudget: Number(values.startingTipBudget),
      language: values.language as 'de' | 'en',
    });
    i18n.changeLanguage(values.language);
  };

  const handleClearData = () => {
    clearAllData();
    close();
    navigate('/onboarding');
  };

  return (
    <Box pb={100}>
      <Container size="sm" p="md">
        <Group align="center" mt="md" mb="xl">
          <ActionIcon variant="subtle" color="dark" onClick={() => navigate(-1)}>
            <IconChevronLeft size={24} />
          </ActionIcon>
          <Title order={2}>{t('settings.title')}</Title>
        </Group>

        <Box
          style={{
            backgroundColor: 'white',
            borderRadius: theme.radius.lg,
            padding: 24,
            border: `1px solid ${theme.colors.gray[2]}`,
            marginBottom: 24,
          }}
        >
          <Group wrap="nowrap">
            <ThemeIcon size={64} radius="xl" color="teal.9">
              <Text fw={700} size="xl">
                {profile?.name.substring(0, 2).toUpperCase()}
              </Text>
            </ThemeIcon>
            <Box>
              <Text fw={700} size="lg">{profile?.name}</Text>
              <Text size="sm" c="dimmed" mb="xs">{profile?.name.toLowerCase().replace(' ', '.')}@email.com</Text>
              <Group gap="xs">
                <Box style={{ backgroundColor: theme.colors.teal[0], color: theme.colors.teal[8], padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                  {profile?.company}
                </Box>
                <Box style={{ backgroundColor: theme.colors.gray[1], color: theme.colors.gray[7], padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                  {t('settings.since', { date: 'Mar 2026' })}
                </Box>
              </Group>
            </Box>
          </Group>
        </Box>

        <form onSubmit={form.onSubmit(handleSave)}>
          <Text size="xs" fw={700} c="dimmed" mb="xs" ml="sm">{t('settings.account')}</Text>
          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: theme.radius.lg,
              padding: '8px 20px',
              border: `1px solid ${theme.colors.gray[2]}`,
              marginBottom: 24,
            }}
          >
            <TextInput
              variant="unstyled"
              label={t('settings.displayName')}
              leftSection={<IconUser size={18} color={theme.colors.teal[5]} />}
              {...form.getInputProps('name')}
              styles={{ root: { borderBottom: `1px solid ${theme.colors.gray[2]}`, paddingBottom: 8, paddingTop: 8 } }}
            />
             <TextInput
              variant="unstyled"
              label={t('settings.company')}
              leftSection={<IconMail size={18} color={theme.colors.teal[5]} />}
              {...form.getInputProps('company')}
              styles={{ root: { paddingTop: 8 } }}
            />
          </Box>

          <Text size="xs" fw={700} c="dimmed" mb="xs" ml="sm">{t('settings.payDefaults')}</Text>
          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: theme.radius.lg,
              padding: '8px 20px',
              border: `1px solid ${theme.colors.gray[2]}`,
              marginBottom: 24,
            }}
          >
            <NumberInput
              variant="unstyled"
              label={t('settings.defaultHourlyRate')}
              description={t('settings.autoFills')}
              decimalScale={2}
              leftSection="€"
              {...form.getInputProps('hourlyRate')}
              styles={{ root: { borderBottom: `1px solid ${theme.colors.gray[2]}`, paddingBottom: 16, paddingTop: 8 } }}
            />
            <NumberInput
              variant="unstyled"
              label={t('settings.startingTipBudget')}
              description={t('settings.cashYouStart')}
              decimalScale={2}
              leftSection="€"
              {...form.getInputProps('startingTipBudget')}
              styles={{ root: { paddingTop: 8, paddingBottom: 8 } }}
            />
          </Box>

          <Text size="xs" fw={700} c="dimmed" mb="xs" ml="sm">{t('settings.app')}</Text>
          <Box
            style={{
              backgroundColor: 'white',
              borderRadius: theme.radius.lg,
              padding: '8px 20px',
              border: `1px solid ${theme.colors.gray[2]}`,
              marginBottom: 24,
            }}
          >
            <Select
              variant="unstyled"
              label={t('settings.language')}
              data={[
                { value: 'de', label: 'Deutsch' },
                { value: 'en', label: 'English' },
              ]}
              {...form.getInputProps('language')}
              styles={{ root: { paddingBottom: 8, paddingTop: 8 } }}
            />
          </Box>

          <Button type="submit" size="lg" radius="xl" color="teal.8" fullWidth mb="xl">
            {t('common.save')}
          </Button>
        </form>

        <Text size="xs" fw={700} c="red" mb="xs" ml="sm">{t('settings.dangerZone')}</Text>
        <Box
          style={{
            backgroundColor: 'white',
            borderRadius: theme.radius.lg,
            padding: 20,
            border: `1px solid ${theme.colors.red[2]}`,
            marginBottom: 24,
          }}
        >
          <Button color="red" variant="light" fullWidth onClick={open}>
            {t('settings.clearAllData')}
          </Button>
        </Box>

        <Modal opened={opened} onClose={close} title={t('settings.clearAllData')} centered>
          <Text mb="xl">{t('settings.clearAllDataConfirm')}</Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={close}>{t('settings.cancel')}</Button>
            <Button color="red" onClick={handleClearData}>{t('settings.delete')}</Button>
          </Group>
        </Modal>

      </Container>
    </Box>
  );
};
