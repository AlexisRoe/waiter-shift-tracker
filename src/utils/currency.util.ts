/**
 * Formats a number as a currency string (Euro)
 * @param amount The amount to format
 * @param showSign Whether to show a + or - sign before the amount
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, showSign = false): string => {
  const sign = showSign && amount > 0 ? '+' : '';
  const formatted = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);

  return `${sign}${formatted}`;
};
