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
export type PercentileStandard = 'WHO' | 'NHS';
export type Gender = 'male' | 'female';

export const STANDARD_LABELS: Record<PercentileStandard, string> = {
  WHO: 'International (WHO)',
  NHS: 'England (NHS/UK-WHO)',
};

export interface PercentileData {
  age: number; // in days
  // WHO centiles
  p3?: number;
  p10?: number;
  p25?: number;
  p50?: number;
  p75?: number;
  p90?: number;
  p97?: number;
  // NHS/UK-WHO centiles (additional)
  p0_4?: number;  // 0.4th centile
  p2?: number;    // 2nd centile
  p9?: number;    // 9th centile
  p91?: number;   // 91st centile
  p98?: number;   // 98th centile
  p99_6?: number; // 99.6th centile
}
