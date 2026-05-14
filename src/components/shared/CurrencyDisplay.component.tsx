import { Text, type TextProps } from '@mantine/core';
import { formatCurrency } from '../../utils/currency.util';

interface CurrencyDisplayProps extends TextProps {
  amount: number;
  showSign?: boolean;
}

export const CurrencyDisplay = ({ amount, showSign = false, ...props }: CurrencyDisplayProps) => {
  return <Text {...props}>{formatCurrency(amount, showSign)}</Text>;
};
