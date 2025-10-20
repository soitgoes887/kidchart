import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { Measurement, MeasurementType, Gender, PercentileStandard } from '../types';
import { getPercentileData } from '../utils/calculations';

interface GrowthChartProps {
  measurements: Measurement[];
  measurementType: MeasurementType;
  gender: Gender;
  standard: PercentileStandard;
  childName: string;
}

export const GrowthChart = ({
  measurements,
  measurementType,
  gender,
  standard,
  childName,
}: GrowthChartProps) => {
  const percentileData = getPercentileData(measurementType, gender, standard);

  // Filter measurements that have the relevant data
  const relevantMeasurements = measurements.filter((m) => {
    switch (measurementType) {
      case 'height':
        return m.height !== undefined;
      case 'weight':
        return m.weight !== undefined;
      case 'headCircumference':
        return m.headCircumference !== undefined;
      default:
        return false;
    }
  });

  // Determine max age to decide on axis units
  const maxAgeInDays = relevantMeasurements.length > 0
    ? Math.max(...relevantMeasurements.map(m => m.ageInDays))
    : percentileData[percentileData.length - 1]?.age || 0;

  const useMonths = maxAgeInDays < 365;
  const ageDivisor = useMonths ? 30.44 : 365; // months or years
  const ageUnit = useMonths ? 'months' : 'years';

  // Combine percentile data with actual measurements
  const chartData: Array<{
    age: number;
    ageInDays?: number;
    date?: string;
    p3?: number;
    p10?: number;
    p25?: number;
    p50?: number;
    p75?: number;
    p90?: number;
    p97?: number;
    actual?: number;
  }> = percentileData.map((p) => {
    return {
      age: p.age / ageDivisor,
      p3: p.p3,
      p10: p.p10,
      p25: p.p25,
      p50: p.p50,
      p75: p.p75,
      p90: p.p90,
      p97: p.p97,
    };
  });

  // Add all actual measurements as separate data points
  relevantMeasurements.forEach((m) => {
    const value =
      measurementType === 'height'
        ? m.height
        : measurementType === 'weight'
        ? m.weight
        : m.headCircumference;

    if (value !== undefined) {
      chartData.push({
        age: m.ageInDays / ageDivisor,
        ageInDays: m.ageInDays,
        date: m.date,
        p3: undefined,
        p10: undefined,
        p25: undefined,
        p50: undefined,
        p75: undefined,
        p90: undefined,
        p97: undefined,
        actual: value,
      });
    }
  });

  chartData.sort((a, b) => a.age - b.age);

  const formatTooltipAge = (label: number, payload: any) => {
    // Check if this is a measurement point with ageInDays
    if (payload && payload.length > 0) {
      const dataPoint = payload[0].payload;
      if (dataPoint.ageInDays !== undefined) {
        const days = dataPoint.ageInDays;
        const years = Math.floor(days / 365);
        const remainingDays = days % 365;
        const months = Math.floor(remainingDays / 30);
        const remainingDaysAfterMonths = remainingDays % 30;

        if (years > 0) {
          if (months > 0) {
            return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
          }
          return `${years} year${years > 1 ? 's' : ''}`;
        } else if (months > 0) {
          if (remainingDaysAfterMonths > 0) {
            return `${months} month${months > 1 ? 's' : ''} ${remainingDaysAfterMonths} day${remainingDaysAfterMonths > 1 ? 's' : ''}`;
          }
          return `${months} month${months > 1 ? 's' : ''}`;
        } else {
          return `${days} day${days !== 1 ? 's' : ''}`;
        }
      }
    }
    // Fallback for percentile lines - convert back to years and months
    if (ageUnit === 'years') {
      const years = Math.floor(label);
      const monthsFraction = (label - years) * 12;
      const months = Math.round(monthsFraction);

      if (years > 0 && months > 0) {
        return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
      } else if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''}`;
      } else if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''}`;
      }
    } else {
      // ageUnit === 'months'
      const totalMonths = Math.round(label);
      const years = Math.floor(totalMonths / 12);
      const months = totalMonths % 12;

      if (years > 0 && months > 0) {
        return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
      } else if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''}`;
      } else {
        return `${totalMonths} month${totalMonths !== 1 ? 's' : ''}`;
      }
    }
    return `${Math.round(label)} ${ageUnit}`;
  };

  const CustomTooltipWithAge = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    // Get the age from the data point
    const dataPoint = payload[0].payload;
    const ageValue = dataPoint.age || 0;

    const label = formatTooltipAge(ageValue, payload);

    // Format date if available (for actual measurements)
    let dateLabel = '';
    if (dataPoint.date) {
      const date = new Date(dataPoint.date);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      dateLabel = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
          {label}
        </p>
        {dateLabel && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {dateLabel}
          </p>
        )}
        {payload.map((entry: any, index: number) => {
          if (entry.value !== undefined && entry.value !== null) {
            return (
              <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
                <span style={{ color: entry.color }}>{entry.name}: </span>
                {entry.value.toFixed(1)}
              </p>
            );
          }
          return null;
        })}
      </div>
    );
  };

  const getLabel = () => {
    switch (measurementType) {
      case 'height':
        return 'Height (cm)';
      case 'weight':
        return 'Weight (kg)';
      case 'headCircumference':
        return 'Head Circumference (cm)';
    }
  };

  const getTitle = () => {
    const typeLabel =
      measurementType === 'height'
        ? 'Height'
        : measurementType === 'weight'
        ? 'Weight'
        : 'Head Circumference';
    return `${typeLabel} - ${standard} Percentiles`;
  };

  if (relevantMeasurements.length === 0) {
    return (
      <div className="card text-center text-gray-500 dark:text-gray-400 py-8">
        No {measurementType} measurements recorded yet
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4">{getTitle()}</h3>
      <ResponsiveContainer width="100%" height={450} key={`${standard}-${measurementType}`}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" className="dark:stroke-gray-700" />
          <XAxis
            dataKey="age"
            label={{ value: `Age (${ageUnit})`, position: 'insideBottom', offset: -10 }}
            type="number"
            domain={['dataMin', 'dataMax']}
            allowDecimals={false}
            tickFormatter={(value) => Math.round(value).toString()}
            stroke="#6b7280"
            className="dark:stroke-gray-400"
          />
          <YAxis
            label={{ value: getLabel(), angle: -90, position: 'insideLeft' }}
            domain={['auto', 'auto']}
            stroke="#6b7280"
            className="dark:stroke-gray-400"
          />
          <Tooltip content={<CustomTooltipWithAge />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Line
            type="monotone"
            dataKey="p3"
            stroke="#fee2e2"
            strokeWidth={1}
            dot={false}
            name="3rd"
            connectNulls
            isAnimationActive={true}
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="p10"
            stroke="#fecaca"
            strokeWidth={1}
            dot={false}
            name="10th"
            connectNulls
            isAnimationActive={true}
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="p25"
            stroke="#fed7aa"
            strokeWidth={1}
            dot={false}
            name="25th"
            connectNulls
            isAnimationActive={true}
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="p50"
            stroke="#4ade80"
            strokeWidth={2}
            dot={false}
            name="50th (Median)"
            connectNulls
            isAnimationActive={true}
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="p75"
            stroke="#fed7aa"
            strokeWidth={1}
            dot={false}
            name="75th"
            connectNulls
            isAnimationActive={true}
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="p90"
            stroke="#fecaca"
            strokeWidth={1}
            dot={false}
            name="90th"
            connectNulls
            isAnimationActive={true}
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="p97"
            stroke="#fee2e2"
            strokeWidth={1}
            dot={false}
            name="97th"
            connectNulls
            isAnimationActive={true}
            animationDuration={800}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="none"
            strokeWidth={0}
            dot={{ fill: '#2563eb', r: 6, strokeWidth: 2, stroke: '#1e40af' }}
            name={childName}
            connectNulls={false}
            isAnimationActive={true}
            animationDuration={800}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
