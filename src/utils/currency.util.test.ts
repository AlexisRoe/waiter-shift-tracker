import { describe, expect, it } from 'vitest';
import { formatCurrency } from './currency.util';

describe('formatCurrency', () => {
  it('should format positive numbers correctly', () => {
    // Note: Intl uses non-breaking space (0xA0) before the currency symbol in de-DE
    const result = formatCurrency(10);
    expect(result).toContain('10,00');
    expect(result).toContain('€');
  });

  it('should format negative numbers correctly', () => {
    const result = formatCurrency(-5.5);
    expect(result).toContain('-5,50');
    expect(result).toContain('€');
  });

  it('should show plus sign when showSign is true', () => {
    const result = formatCurrency(15, true);
    expect(result).toContain('+15,00');
    expect(result).toContain('€');
  });

  it('should not show plus sign for negative numbers even if showSign is true', () => {
    const result = formatCurrency(-15, true);
    expect(result).toContain('-15,00');
    expect(result).not.toContain('+-');
  });
});
