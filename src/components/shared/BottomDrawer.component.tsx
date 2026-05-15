import type { DrawerProps } from '@mantine/core';
import { Drawer } from '@mantine/core';

type Props = Omit<DrawerProps, 'position' | 'size' | 'withinPortal' | 'padding'>;

export const BottomDrawer = (props: Props) => {
  return (
    <Drawer
      {...props}
      position="bottom"
      size="auto"
      withinPortal={false}
      padding="xl"
      styles={{
        content: {
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          boxShadow: '0 -10px 30px rgba(0,0,0,0.1)',
        },
        inner: {
          maxWidth: 430,
          left: '50%',
          transform: 'translateX(-50%)',
        },
        ...props.styles,
      }}
    />
  );
};
