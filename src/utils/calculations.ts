import { PercentileData, Gender, MeasurementType, PercentileStandard } from '../types';
import { whoHeightBoys, whoHeightGirls } from '../data/whoHeightData';
import { whoWeightBoys, whoWeightGirls } from '../data/whoWeightData';
import { whoHeadCircumferenceBoys, whoHeadCircumferenceGirls } from '../data/whoHeadCircumferenceData';
import { nhsHeightBoys, nhsHeightGirls } from '../data/nhsHeightData';
import { nhsWeightBoys, nhsWeightGirls } from '../data/nhsWeightData';
import { nhsHeadCircumferenceBoys, nhsHeadCircumferenceGirls } from '../data/nhsHeadCircumferenceData';

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

export const getPercentileData = (
  measurementType: MeasurementType,
  gender: Gender,
  standard: PercentileStandard = 'WHO'
): PercentileData[] => {
  let baseData: PercentileData[];

  // Use official WHO or NHS data based on standard selected
  if (standard === 'NHS') {
    // Use NHS/UK-WHO specific data with 0.4th, 2nd, 9th, 25th, 50th, 75th, 91st, 98th, 99.6th centiles
    switch (measurementType) {
      case 'height':
        baseData = gender === 'male' ? nhsHeightBoys : nhsHeightGirls;
        break;
      case 'weight':
        baseData = gender === 'male' ? nhsWeightBoys : nhsWeightGirls;
        break;
      case 'headCircumference':
        baseData = gender === 'male' ? nhsHeadCircumferenceBoys : nhsHeadCircumferenceGirls;
        break;
      default:
        return [];
    }
    return baseData;
  }

  // Use official WHO data (default)
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

  return baseData;
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
        // WHO centiles
        p3: p1.p3 && p2.p3 ? p1.p3 + ratio * (p2.p3 - p1.p3) : undefined,
        p10: p1.p10 && p2.p10 ? p1.p10 + ratio * (p2.p10 - p1.p10) : undefined,
        p25: p1.p25 && p2.p25 ? p1.p25 + ratio * (p2.p25 - p1.p25) : undefined,
        p50: p1.p50 && p2.p50 ? p1.p50 + ratio * (p2.p50 - p1.p50) : undefined,
        p75: p1.p75 && p2.p75 ? p1.p75 + ratio * (p2.p75 - p1.p75) : undefined,
        p90: p1.p90 && p2.p90 ? p1.p90 + ratio * (p2.p90 - p1.p90) : undefined,
        p97: p1.p97 && p2.p97 ? p1.p97 + ratio * (p2.p97 - p1.p97) : undefined,
        // NHS centiles
        p0_4: p1.p0_4 && p2.p0_4 ? p1.p0_4 + ratio * (p2.p0_4 - p1.p0_4) : undefined,
        p2: p1.p2 && p2.p2 ? p1.p2 + ratio * (p2.p2 - p1.p2) : undefined,
        p9: p1.p9 && p2.p9 ? p1.p9 + ratio * (p2.p9 - p1.p9) : undefined,
        p91: p1.p91 && p2.p91 ? p1.p91 + ratio * (p2.p91 - p1.p91) : undefined,
        p98: p1.p98 && p2.p98 ? p1.p98 + ratio * (p2.p98 - p1.p98) : undefined,
        p99_6: p1.p99_6 && p2.p99_6 ? p1.p99_6 + ratio * (p2.p99_6 - p1.p99_6) : undefined,
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

  // Check if this is NHS data (has p0_4, p2, p9 fields) or WHO data (has p3, p10 fields)
  const isNHS = interpolated.p0_4 !== undefined || interpolated.p2 !== undefined || interpolated.p9 !== undefined;

  if (isNHS) {
    // NHS centiles: 0.4th, 2nd, 9th, 25th, 50th, 75th, 91st, 98th, 99.6th
    if (interpolated.p0_4 && value < interpolated.p0_4) return '<0.4th';
    if (interpolated.p2 && value < interpolated.p2) return '0.4th-2nd';
    if (interpolated.p9 && value < interpolated.p9) return '2nd-9th';
    if (interpolated.p25 && value < interpolated.p25) return '9th-25th';
    if (interpolated.p50 && value < interpolated.p50) return '25th-50th';
    if (interpolated.p75 && value < interpolated.p75) return '50th-75th';
    if (interpolated.p91 && value < interpolated.p91) return '75th-91st';
    if (interpolated.p98 && value < interpolated.p98) return '91st-98th';
    if (interpolated.p99_6 && value < interpolated.p99_6) return '98th-99.6th';
    return '>99.6th';
  } else {
    // WHO centiles: 3rd, 10th, 25th, 50th, 75th, 90th, 97th
    if (interpolated.p3 && value < interpolated.p3) return '<3rd';
    if (interpolated.p10 && value < interpolated.p10) return '3rd-10th';
    if (interpolated.p25 && value < interpolated.p25) return '10th-25th';
    if (interpolated.p50 && value < interpolated.p50) return '25th-50th';
    if (interpolated.p75 && value < interpolated.p75) return '50th-75th';
    if (interpolated.p90 && value < interpolated.p90) return '75th-90th';
    if (interpolated.p97 && value < interpolated.p97) return '90th-97th';
    return '>97th';
  }
};
