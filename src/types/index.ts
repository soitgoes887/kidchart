export interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  measurements: Measurement[];
}

export interface Measurement {
  id: string;
  date: string;
  ageInDays: number;
  height?: number; // in cm
  weight?: number; // in kg
  headCircumference?: number; // in cm
}

export type MeasurementType = 'height' | 'weight' | 'headCircumference';
export type PercentileStandard = 'WHO' | 'NHS' | 'CDC' | 'Germany' | 'Australia' | 'China' | 'Japan' | 'France';
export type Gender = 'male' | 'female';

export const STANDARD_LABELS: Record<PercentileStandard, string> = {
  WHO: 'International (WHO)',
  NHS: 'UK (NHS)',
  CDC: 'USA (CDC)',
  Germany: 'Germany (RKI)',
  Australia: 'Australia (APEG)',
  China: 'China (MOH)',
  Japan: 'Japan (MHLW)',
  France: 'France (PNNS)',
};

export interface PercentileData {
  age: number; // in days
  p3?: number;
  p10?: number;
  p25?: number;
  p50?: number;
  p75?: number;
  p90?: number;
  p97?: number;
}
