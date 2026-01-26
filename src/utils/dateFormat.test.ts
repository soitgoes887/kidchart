import { describe, it, expect } from 'vitest';
import {
  formatDateDDMMYYYY,
  parseDateDDMMYYYY,
  dateToStringDDMMYYYY,
} from './dateFormat';

describe('dateFormat', () => {
  describe('formatDateDDMMYYYY', () => {
    it('converts yyyy-mm-dd to dd/mm/yyyy', () => {
      expect(formatDateDDMMYYYY('2024-01-15')).toBe('15/01/2024');
      expect(formatDateDDMMYYYY('2024-12-25')).toBe('25/12/2024');
    });

    it('handles empty string', () => {
      expect(formatDateDDMMYYYY('')).toBe('');
    });

    it('pads single digit days and months', () => {
      expect(formatDateDDMMYYYY('2024-01-05')).toBe('05/01/2024');
      expect(formatDateDDMMYYYY('2024-03-01')).toBe('01/03/2024');
    });
  });

  describe('parseDateDDMMYYYY', () => {
    it('converts dd/mm/yyyy to yyyy-mm-dd', () => {
      expect(parseDateDDMMYYYY('15/01/2024')).toBe('2024-01-15');
      expect(parseDateDDMMYYYY('25/12/2024')).toBe('2024-12-25');
    });

    it('handles empty string', () => {
      expect(parseDateDDMMYYYY('')).toBe('');
    });

    it('returns empty for invalid format', () => {
      expect(parseDateDDMMYYYY('invalid')).toBe('');
      expect(parseDateDDMMYYYY('2024-01-15')).toBe('');
    });

    it('returns empty for invalid dates', () => {
      expect(parseDateDDMMYYYY('32/01/2024')).toBe('');
      expect(parseDateDDMMYYYY('15/13/2024')).toBe('');
      expect(parseDateDDMMYYYY('15/01/1800')).toBe('');
    });
  });

  describe('dateToStringDDMMYYYY', () => {
    it('converts Date object to dd/mm/yyyy', () => {
      const date = new Date(2024, 0, 15); // January 15, 2024
      expect(dateToStringDDMMYYYY(date)).toBe('15/01/2024');
    });

    it('pads single digit days and months', () => {
      const date = new Date(2024, 2, 5); // March 5, 2024
      expect(dateToStringDDMMYYYY(date)).toBe('05/03/2024');
    });
  });
});
