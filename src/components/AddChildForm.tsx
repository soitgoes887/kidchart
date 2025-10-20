import { useState } from 'react';
import { Child } from '../types';
import { parseDateDDMMYYYY } from '../utils/dateFormat';

interface AddChildFormProps {
  onAddChild: (child: Omit<Child, 'id' | 'measurements'>) => void;
  onCancel: () => void;
}

export const AddChildForm = ({ onAddChild, onCancel }: AddChildFormProps) => {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [error, setError] = useState('');

  const handleDateChange = (value: string) => {
    // Allow only numbers and slashes
    const cleaned = value.replace(/[^\d/]/g, '');
    setDateOfBirth(cleaned);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && dateOfBirth) {
      const isoDate = parseDateDDMMYYYY(dateOfBirth);
      if (!isoDate) {
        setError('Please enter a valid date in DD/MM/YYYY format');
        return;
      }
      onAddChild({ name, dateOfBirth: isoDate, gender });
      setName('');
      setDateOfBirth('');
      setGender('male');
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card mb-6">
      <h2 className="text-xl font-bold mb-4">Add Child</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            required
          />
        </div>
        <div>
          <label htmlFor="dob" className="block text-sm font-medium mb-1">
            Date of Birth (DD/MM/YYYY)
          </label>
          <input
            type="text"
            id="dob"
            value={dateOfBirth}
            onChange={(e) => handleDateChange(e.target.value)}
            className="input-field"
            placeholder="DD/MM/YYYY"
            maxLength={10}
            required
          />
          {error && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="male"
                checked={gender === 'male'}
                onChange={(e) => setGender(e.target.value as 'male')}
                className="mr-2"
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="female"
                checked={gender === 'female'}
                onChange={(e) => setGender(e.target.value as 'female')}
                className="mr-2"
              />
              Female
            </label>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1">
            Add Child
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};
