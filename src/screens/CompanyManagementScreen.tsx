import React, { useState } from 'react';
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  Drawer,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Title,
  Card,
  Badge,
  Paper,
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  IconChevronLeft,
  IconPlus,
  IconTrash,
  IconEdit,
  IconStar,
  IconStarFilled,
  IconBriefcase,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Company } from '../store/types';

export const CompanyManagementScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const companies = useAppStore((state) => state.companies);
  const shifts = useAppStore((state) => state.shifts);
  const profile = useAppStore((state) => state.profile);
  const addCompany = useAppStore((state) => state.addCompany);
  const updateCompany = useAppStore((state) => state.updateCompany);
  const deleteCompany = useAppStore((state) => state.deleteCompany);
  const setDefaultCompany = useAppStore((state) => state.setDefaultCompany);

  const [opened, { open, close }] = useDisclosure(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const form = useForm({
    initialValues: {
      name: '',
      hourlyRate: 14.6,
    },
    validate: {
      name: (val) => (val.trim().length > 0 ? null : t('common.required')),
      hourlyRate: (val) => (val > 0 ? null : t('common.invalidNumber')),
    },
  });

  const handleAdd = () => {
    setEditingCompany(null);
    form.reset();
    form.setValues({ name: '', hourlyRate: 14.6 });
    open();
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    form.setValues({ name: company.name, hourlyRate: company.hourlyRate });
    open();
  };

  const handleSubmit = (values: typeof form.values) => {
    if (editingCompany) {
      updateCompany(editingCompany.id, {
        name: values.name,
        hourlyRate: values.hourlyRate,
      });
    } else {
      const newCompany: Company = {
        id:
          typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : Math.random().toString(36).substring(2, 11),
        name: values.name,
        hourlyRate: values.hourlyRate,
        createdAt: new Date().toISOString(),
      };
      addCompany(newCompany);
    }
    close();
  };

  const isDeletable = (companyId: string) => {
    return !shifts.some((s) => s.companyId === companyId);
  };

  return (
    <Box style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Container size="sm" p="md">
        <Group align="center" mt="md" mb="xl">
          <ActionIcon
            variant="subtle"
            color="dark"
            onClick={() => navigate(-1)}
            size="lg"
            radius="xl"
          >
            <IconChevronLeft size={24} />
          </ActionIcon>
          <Title order={2} style={{ flex: 1 }}>
            {t('settings.manageCompanies')}
          </Title>
          <ActionIcon variant="filled" color="teal.8" size="lg" radius="xl" onClick={handleAdd}>
            <IconPlus size={20} />
          </ActionIcon>
        </Group>

        <Stack gap="md">
          {companies.map((company) => {
            const isDefault = profile?.defaultCompanyId === company.id;
            const deletable = isDeletable(company.id);

            return (
              <Card
                key={company.id}
                withBorder
                radius="lg"
                p="md"
                shadow="xs"
                style={{ backgroundColor: 'white' }}
              >
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <Box style={{ flex: 1 }}>
                    <Group gap="xs" mb={4}>
                      <Text fw={700} size="lg">
                        {company.name}
                      </Text>
                      {isDefault && (
                        <Badge
                          color="teal"
                          variant="light"
                          leftSection={<IconStarFilled size={12} />}
                        >
                          {t('settings.default')}
                        </Badge>
                      )}
                    </Group>
                    <Text size="sm" c="dimmed" fw={500}>
                      {t('shifts.hourlyRate')}: {company.hourlyRate.toFixed(2)}€ / h
                    </Text>
                  </Box>

                  <Group gap={4}>
                    {!isDefault && (
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={() => setDefaultCompany(company.id)}
                        title={t('settings.setAsDefault')}
                        radius="md"
                      >
                        <IconStar size={18} />
                      </ActionIcon>
                    )}
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => handleEdit(company)}
                      radius="md"
                    >
                      <IconEdit size={18} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      disabled={!deletable || isDefault}
                      onClick={() => deleteCompany(company.id)}
                      title={!deletable ? t('settings.cannotDeleteWithShifts') : ''}
                      radius="md"
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Card>
            );
          })}
        </Stack>

        {companies.length === 0 && (
          <Paper
            withBorder
            radius="lg"
            p={40}
            style={{ textAlign: 'center', backgroundColor: 'white', borderStyle: 'dashed' }}
            mt="xl"
          >
            <IconBriefcase size={48} opacity={0.2} style={{ marginBottom: 16 }} />
            <Text c="dimmed" fw={500}>
              {t('settings.noCompaniesYet')}
            </Text>
          </Paper>
        )}
      </Container>

      <Drawer
        opened={opened}
        onClose={close}
        position="bottom"
        size="auto"
        withinPortal={false}
        title={
          <Text fw={700} size="lg">
            {editingCompany ? t('settings.editCompany') : t('settings.addCompany')}
          </Text>
        }
        padding="xl"
        styles={{
          content: {
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            boxShadow: '0 -10px 30px rgba(0,0,0,0.1)',
          },
          inner: {
            zIndex: 2000,
          },
        }}
        overlayProps={{
          backgroundOpacity: 0.5,
          blur: 2,
        }}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="xl" pb="xl">
            <TextInput
              label={t('onboarding.companyName')}
              placeholder="e.g. Trattoria Sole"
              withAsterisk
              radius="md"
              size="md"
              {...form.getInputProps('name')}
            />

            <NumberInput
              label={t('onboarding.hourlySalary')}
              placeholder="13.50"
              decimalScale={2}
              withAsterisk
              radius="md"
              size="md"
              leftSection={
                <Text size="sm" fw={600}>
                  €
                </Text>
              }
              {...form.getInputProps('hourlyRate')}
            />

            <Button type="submit" color="teal.8" radius="xl" size="lg" fullWidth mt="md">
              {editingCompany ? t('common.save') : t('common.add')}
            </Button>

            <Button variant="subtle" color="gray" onClick={close} fullWidth radius="xl">
              {t('settings.cancel')}
            </Button>
          </Stack>
        </form>
      </Drawer>
    </Box>
  );
};
