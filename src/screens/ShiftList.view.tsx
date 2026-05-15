import { Box, Button, Container, Text, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BottomDrawer } from '../components/shared/BottomDrawer.component';
import { CurrencyDisplay } from '../components/shared/CurrencyDisplay.component';
import { ShiftForm } from '../components/shared/ShiftForm.component';
import { ShiftListItem } from '../components/shared/ShiftListItem.component';
import { TealPageHeader } from '../components/shared/TealPageHeader.component';
import { useShiftStats } from '../hooks/useShiftStats.hook';

export const ShiftListView = () => {
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedShiftId, setSelectedShiftId] = useState<string | undefined>();

  const { groupedShifts, sortedMonths, totalHours, totalEarnings, plannedShifts, closedShifts } =
    useShiftStats();

  const handleAddShift = () => {
    setSelectedShiftId(undefined);
    open();
  };

  const handleEditShift = (id: string) => {
    setSelectedShiftId(id);
    open();
  };

  return (
    <Box pb={100}>
      <TealPageHeader>
        {/* 2×2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
          <Box style={{ display: 'flex', justifyContent: 'center', padding: '0 8px 16px' }}>
            <Box>
              <Text size="xs" fw={700} opacity={0.8} tt="uppercase" lts={0.5} mb={4}>
                {t('shifts.thisMonth')}
              </Text>
              <CurrencyDisplay amount={totalEarnings} size="22px" fw={800} c="white" />
            </Box>
          </Box>
          <Box
            style={{
              borderLeft: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              justifyContent: 'center',
              padding: '0 8px 16px',
            }}
          >
            <Box>
              <Text size="xs" fw={700} opacity={0.8} tt="uppercase" lts={0.5} mb={4}>
                {t('shifts.hours')}
              </Text>
              <Text size="22px" fw={800}>
                {Math.round(totalHours)}h
              </Text>
            </Box>
          </Box>

          <Box
            style={{
              borderTop: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              justifyContent: 'center',
              padding: '16px 8px 0',
            }}
          >
            <Box>
              <Text size="xs" fw={700} opacity={0.8} tt="uppercase" lts={0.5} mb={4}>
                {t('shifts.planned')}
              </Text>
              <Text size="22px" fw={800}>
                {plannedShifts}
              </Text>
            </Box>
          </Box>
          <Box
            style={{
              borderLeft: '1px solid rgba(255,255,255,0.2)',
              borderTop: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              justifyContent: 'center',
              padding: '16px 8px 0',
            }}
          >
            <Box>
              <Text size="xs" fw={700} opacity={0.8} tt="uppercase" lts={0.5} mb={4}>
                {t('shifts.closed')}
              </Text>
              <Text size="22px" fw={800}>
                {closedShifts}
              </Text>
            </Box>
          </Box>
        </div>
      </TealPageHeader>

      <Container size="sm" p="md">
        <Box mt="md">
          {sortedMonths.length > 0 ? (
            sortedMonths.map((month) => (
              <Box key={month} mb="xl">
                <Text fw={700} size="xs" c="dimmed" tt="uppercase" mb="xs" ml="md" lts={1}>
                  {month}
                </Text>
                <Box
                  style={{
                    backgroundColor: 'white',
                    borderRadius: theme.radius.xl,
                    padding: '0 16px',
                    border: `1px solid ${theme.colors.gray[2]}`,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  }}
                >
                  {groupedShifts[month].map((shift, index) => (
                    <ShiftListItem
                      key={shift.id}
                      shift={shift}
                      onClick={() => handleEditShift(shift.id)}
                      isLast={index === groupedShifts[month].length - 1}
                    />
                  ))}
                </Box>
              </Box>
            ))
          ) : (
            <Box py={60} ta="center">
              <Text c="dimmed" size="lg" fw={500}>
                No shifts tracked yet.
              </Text>
              <Text c="dimmed" size="sm">
                Tap the button below to add your first shift!
              </Text>
            </Box>
          )}
        </Box>
      </Container>

      <Button
        size="lg"
        radius="xl"
        color="teal.8"
        leftSection={<IconPlus size={20} />}
        onClick={handleAddShift}
        style={{
          position: 'fixed',
          bottom: 100,
          right: 'calc(50% - 215px + 20px)',
          boxShadow: theme.shadows.md,
          zIndex: 10,
        }}
      >
        {t('shifts.newShift')}
      </Button>

      <BottomDrawer
        opened={opened}
        onClose={close}
        radius="lg"
        title={
          <Text fw={700} size="lg">
            {selectedShiftId ? t('shifts.editShift') : t('shifts.newShift')}
          </Text>
        }
      >
        <ShiftForm shiftId={selectedShiftId} onClose={close} />
      </BottomDrawer>
    </Box>
  );
};
