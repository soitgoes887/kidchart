import { Measurement, Gender, PercentileStandard } from '../types';
import { formatAge, getPercentileData, determinePercentileRange } from '../utils/calculations';
import { formatDateDDMMYYYY } from '../utils/dateFormat';

interface MeasurementListProps {
  measurements: Measurement[];
  gender: Gender;
  standard: PercentileStandard;
  onDelete: (id: string) => void;
}

export const MeasurementList = ({
  measurements,
  gender,
  standard,
  onDelete,
}: MeasurementListProps) => {
  if (measurements.length === 0) {
    return (
      <div className="card text-center text-gray-500 dark:text-gray-400 py-8">
        No measurements recorded yet. Add your first measurement to get started!
      </div>
    );
  }

  const sortedMeasurements = [...measurements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="card">
      <h3 className="text-lg font-bold mb-4">Measurement History</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedMeasurements.map((measurement) => (
          <div
            key={measurement.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">{formatDateDDMMYYYY(measurement.date)}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatAge(measurement.ageInDays)}</p>
              </div>
              <button
                onClick={() => onDelete(measurement.id)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
              >
                Delete
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
              {measurement.height && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Height: </span>
                  <span className="font-medium">{measurement.height} cm</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">
                    {determinePercentileRange(
                      measurement.height,
                      measurement.ageInDays,
                      getPercentileData('height', gender, standard)
                    )}
                  </span>
                </div>
              )}
              {measurement.weight && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Weight: </span>
                  <span className="font-medium">{measurement.weight} kg</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">
                    {determinePercentileRange(
                      measurement.weight,
                      measurement.ageInDays,
                      getPercentileData('weight', gender, standard)
                    )}
                  </span>
                </div>
              )}
              {measurement.headCircumference && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Head: </span>
                  <span className="font-medium">{measurement.headCircumference} cm</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">
                    {determinePercentileRange(
                      measurement.headCircumference,
                      measurement.ageInDays,
                      getPercentileData('headCircumference', gender, standard)
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
