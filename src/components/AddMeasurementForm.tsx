import { useState } from 'react';
import { Measurement } from '../types';
import { calculateAgeInDays } from '../utils/calculations';

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
  // Use ISO format (YYYY-MM-DD) for the date input
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [headCircumference, setHeadCircumference] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && (height || weight || headCircumference)) {
      onAddMeasurement({
        date: date, // Already in ISO format
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        headCircumference: headCircumference ? parseFloat(headCircumference) : undefined,
      });
      setHeight('');
      setWeight('');
      setHeadCircumference('');
    }
  };

  const ageInDays = calculateAgeInDays(childDateOfBirth, date);
  const years = Math.floor(ageInDays / 365);
  const months = Math.floor((ageInDays % 365) / 30);

  return (
    <form onSubmit={handleSubmit} className="card mb-6">
      <h2 className="text-xl font-bold mb-4">Add Measurement</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Date
          </label>
          <div className="relative cursor-pointer" onClick={() => {
            const input = document.getElementById('date') as HTMLInputElement;
            if (input?.showPicker) {
              input.showPicker();
            } else {
              input?.focus();
            }
          }}>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={today}
              className="input-field cursor-pointer"
              required
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Age at measurement: {years > 0 && `${years}y `}
            {months}m
          </p>
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
