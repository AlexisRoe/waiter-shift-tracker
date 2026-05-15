import { Box, useMantineTheme } from '@mantine/core';
import type { PropsWithChildren } from 'react';

interface Props {
  color?: string;
}

export const TealPageHeader = ({ children, color }: PropsWithChildren<Props>) => {
  const theme = useMantineTheme();

  return (
    <Box
      style={{
        backgroundColor: color ?? theme.colors.teal[8],
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        padding: '72px 32px 24px 32px',
        color: 'white',
      }}
    >
      {children}
    </Box>
  );
};
