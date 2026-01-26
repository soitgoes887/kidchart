import { describe, it, expect } from 'vitest';
import {
  calculateAgeInDays,
  formatAge,
} from './calculations';

describe('calculations', () => {
  describe('calculateAgeInDays', () => {
    it('calculates days between two dates', () => {
      expect(calculateAgeInDays('2024-01-01', '2024-01-02')).toBe(1);
      expect(calculateAgeInDays('2024-01-01', '2024-01-31')).toBe(30);
    });

    it('handles same date', () => {
      expect(calculateAgeInDays('2024-01-01', '2024-01-01')).toBe(0);
    });

    it('calculates correctly across months', () => {
      expect(calculateAgeInDays('2024-01-15', '2024-02-15')).toBe(31);
    });

    it('calculates correctly across years', () => {
      expect(calculateAgeInDays('2023-01-01', '2024-01-01')).toBe(365);
    });
  });

  describe('formatAge', () => {
    it('formats days correctly', () => {
      expect(formatAge(1)).toBe('1 day');
      expect(formatAge(5)).toBe('5 days');
      expect(formatAge(29)).toBe('29 days');
    });

    it('formats months correctly', () => {
      expect(formatAge(30)).toBe('1 month');
      expect(formatAge(60)).toBe('2 months');
      expect(formatAge(90)).toBe('3 months');
    });

    it('formats months and days', () => {
      expect(formatAge(35)).toBe('1m 5d');
      expect(formatAge(75)).toBe('2m 15d');
    });

    it('formats years correctly', () => {
      expect(formatAge(365)).toBe('1 year');
      expect(formatAge(730)).toBe('2 years');
    });

    it('formats years and months', () => {
      expect(formatAge(395)).toBe('1y 1m');
      expect(formatAge(425)).toBe('1y 2m');
    });
  });
});
