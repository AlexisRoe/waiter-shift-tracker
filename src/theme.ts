import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'teal',
  colors: {
    teal: [
      '#e4f6f8',
      '#d3ecef',
      '#aed9df',
      '#86c5cd',
      '#64b4bc',
      '#4ca8b3',
      '#3ca2ae',
      '#2b8d99',
      '#207e8a', // Primary base color close to screenshots
      '#0b6d7a',
    ],
  },
  fontFamily: 'Inter, system-ui, sans-serif',
  defaultRadius: 'lg',
  components: {
    Button: {
      defaultProps: {
        radius: 'xl',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'lg',
      },
      styles: {
        root: {
          border: '1px solid #ebecf0',
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg',
      },
    },
  },
  headings: {
    fontFamily: 'Inter, system-ui, sans-serif',
    sizes: {
      h1: { fontSize: rem(34), fontWeight: '700' },
      h2: { fontSize: rem(26), fontWeight: '700' },
      h3: { fontSize: rem(22), fontWeight: '600' },
    },
  },
});
