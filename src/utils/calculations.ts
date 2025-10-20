import { PercentileData, Gender, MeasurementType, PercentileStandard } from '../types';
import { whoHeightBoys, whoHeightGirls } from '../data/whoHeightData';
import { whoWeightBoys, whoWeightGirls } from '../data/whoWeightData';
import { whoHeadCircumferenceBoys, whoHeadCircumferenceGirls } from '../data/whoHeadCircumferenceData';

export const calculateAgeInDays = (dateOfBirth: string, measurementDate: string): number => {
  const dob = new Date(dateOfBirth);
  const measDate = new Date(measurementDate);
  const diffTime = Math.abs(measDate.getTime() - dob.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatAge = (days: number): string => {
  const years = Math.floor(days / 365);
  const remainingDays = days % 365;
  const months = Math.floor(remainingDays / 30);
  const remainingDaysAfterMonths = remainingDays % 30;

  if (years > 0) {
    return months > 0
      ? `${years}y ${months}m`
      : `${years} year${years > 1 ? 's' : ''}`;
  } else if (months > 0) {
    return remainingDaysAfterMonths > 0
      ? `${months}m ${remainingDaysAfterMonths}d`
      : `${months} month${months > 1 ? 's' : ''}`;
  } else {
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
};

// Helper function to adjust percentile data for different standards (placeholder)
// This creates variations of WHO data to demonstrate different standards
const adjustPercentileData = (
  data: PercentileData[],
  standard: PercentileStandard
): PercentileData[] => {
  // Each standard has slightly different percentile curves
  // These are PLACEHOLDER adjustments - replace with actual standard data
  const adjustments: Record<PercentileStandard, number> = {
    WHO: 1.0,        // Base (no adjustment)
    NHS: 1.0,        // NHS uses WHO for 0-4 years
    CDC: 1.02,       // CDC tends to be slightly higher
    Germany: 1.01,   // German children slightly taller on average
    Australia: 1.0,  // Australia uses WHO
    China: 0.97,     // Chinese standards tend to be slightly lower
    Japan: 0.96,     // Japanese standards tend to be lower
    France: 1.01,    // French standards slightly higher
  };

  const factor = adjustments[standard];

  return data.map((point) => ({
    ...point,
    p3: point.p3 ? point.p3 * factor : undefined,
    p10: point.p10 ? point.p10 * factor : undefined,
    p25: point.p25 ? point.p25 * factor : undefined,
    p50: point.p50 ? point.p50 * factor : undefined,
    p75: point.p75 ? point.p75 * factor : undefined,
    p90: point.p90 ? point.p90 * factor : undefined,
    p97: point.p97 ? point.p97 * factor : undefined,
  }));
};

export const getPercentileData = (
  measurementType: MeasurementType,
  gender: Gender,
  standard: PercentileStandard = 'WHO'
): PercentileData[] => {
  // TODO: Replace with actual data for each standard from official sources
  // Current implementation uses WHO data with adjustments as placeholder

  let baseData: PercentileData[];

  switch (measurementType) {
    case 'height':
      baseData = gender === 'male' ? whoHeightBoys : whoHeightGirls;
      break;
    case 'weight':
      baseData = gender === 'male' ? whoWeightBoys : whoWeightGirls;
      break;
    case 'headCircumference':
      baseData = gender === 'male' ? whoHeadCircumferenceBoys : whoHeadCircumferenceGirls;
      break;
    default:
      return [];
  }

  return adjustPercentileData(baseData, standard);
};

// Linear interpolation to get percentile values for any age
export const interpolatePercentile = (
  age: number,
  percentileData: PercentileData[]
): PercentileData | null => {
  if (percentileData.length === 0) return null;

  // If age is less than the first data point, return the first
  if (age <= percentileData[0].age) {
    return percentileData[0];
  }

  // If age is greater than the last data point, return the last
  if (age >= percentileData[percentileData.length - 1].age) {
    return percentileData[percentileData.length - 1];
  }

  // Find the two data points to interpolate between
  for (let i = 0; i < percentileData.length - 1; i++) {
    if (age >= percentileData[i].age && age <= percentileData[i + 1].age) {
      const p1 = percentileData[i];
      const p2 = percentileData[i + 1];
      const ratio = (age - p1.age) / (p2.age - p1.age);

      return {
        age,
        p3: p1.p3 && p2.p3 ? p1.p3 + ratio * (p2.p3 - p1.p3) : undefined,
        p10: p1.p10 && p2.p10 ? p1.p10 + ratio * (p2.p10 - p1.p10) : undefined,
        p25: p1.p25 && p2.p25 ? p1.p25 + ratio * (p2.p25 - p1.p25) : undefined,
        p50: p1.p50 && p2.p50 ? p1.p50 + ratio * (p2.p50 - p1.p50) : undefined,
        p75: p1.p75 && p2.p75 ? p1.p75 + ratio * (p2.p75 - p1.p75) : undefined,
        p90: p1.p90 && p2.p90 ? p1.p90 + ratio * (p2.p90 - p1.p90) : undefined,
        p97: p1.p97 && p2.p97 ? p1.p97 + ratio * (p2.p97 - p1.p97) : undefined,
      };
    }
  }

  return null;
};

export const determinePercentileRange = (
  value: number,
  ageInDays: number,
  percentileData: PercentileData[]
): string => {
  const interpolated = interpolatePercentile(ageInDays, percentileData);
  if (!interpolated) return 'N/A';

  if (interpolated.p3 && value < interpolated.p3) return '<3rd';
  if (interpolated.p10 && value < interpolated.p10) return '3rd-10th';
  if (interpolated.p25 && value < interpolated.p25) return '10th-25th';
  if (interpolated.p50 && value < interpolated.p50) return '25th-50th';
  if (interpolated.p75 && value < interpolated.p75) return '50th-75th';
  if (interpolated.p90 && value < interpolated.p90) return '75th-90th';
  if (interpolated.p97 && value < interpolated.p97) return '90th-97th';
  return '>97th';
};
