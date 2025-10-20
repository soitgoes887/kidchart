import { useState } from 'react';
import { Measurement } from '../types';
import { calculateAgeInDays } from '../utils/calculations';
import { getTodayDDMMYYYY, parseDateDDMMYYYY } from '../utils/dateFormat';

interface AddMeasurementFormProps {
  childDateOfBirth: string;
  onAddMeasurement: (measurement: Omit<Measurement, 'id' | 'ageInDays'>) => void;
  onCancel: () => void;
}

export const AddMeasurementForm = ({
  childDateOfBirth,
  onAddMeasurement,
  onCancel,
}: AddMeasurementFormProps) => {
  const [date, setDate] = useState(getTodayDDMMYYYY());
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [headCircumference, setHeadCircumference] = useState('');
  const [error, setError] = useState('');

  const handleDateChange = (value: string) => {
    // Allow only numbers and slashes
    const cleaned = value.replace(/[^\d/]/g, '');
    setDate(cleaned);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && (height || weight || headCircumference)) {
      const isoDate = parseDateDDMMYYYY(date);
      if (!isoDate) {
        setError('Please enter a valid date in DD/MM/YYYY format');
        return;
      }
      onAddMeasurement({
        date: isoDate,
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        headCircumference: headCircumference ? parseFloat(headCircumference) : undefined,
      });
      setHeight('');
      setWeight('');
      setHeadCircumference('');
      setError('');
    }
  };

  const isoDate = parseDateDDMMYYYY(date);
  const ageInDays = isoDate ? calculateAgeInDays(childDateOfBirth, isoDate) : 0;
  const years = Math.floor(ageInDays / 365);
  const months = Math.floor((ageInDays % 365) / 30);

  return (
    <form onSubmit={handleSubmit} className="card mb-6">
      <h2 className="text-xl font-bold mb-4">Add Measurement</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Date (DD/MM/YYYY)
          </label>
          <input
            type="text"
            id="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="input-field"
            placeholder="DD/MM/YYYY"
            maxLength={10}
            required
          />
          {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
          {!error && isoDate && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Age at measurement: {years > 0 && `${years}y `}
              {months}m
            </p>
          )}
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-medium mb-1">
            Height (cm)
          </label>
          <input
            type="number"
            id="height"
            step="0.1"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="input-field"
            placeholder="e.g., 75.5"
          />
        </div>
        <div>
          <label htmlFor="weight" className="block text-sm font-medium mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            id="weight"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="input-field"
            placeholder="e.g., 10.2"
          />
        </div>
        <div>
          <label htmlFor="headCirc" className="block text-sm font-medium mb-1">
            Head Circumference (cm)
          </label>
          <input
            type="number"
            id="headCirc"
            step="0.1"
            value={headCircumference}
            onChange={(e) => setHeadCircumference(e.target.value)}
            className="input-field"
            placeholder="e.g., 45.0"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1">
            Add Measurement
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};
