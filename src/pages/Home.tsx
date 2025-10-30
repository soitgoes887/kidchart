import React, { useState } from 'react';
import { Child, Measurement, PercentileStandard, MeasurementType, STANDARD_LABELS } from '../types';
import { AddChildForm } from '../components/AddChildForm';
import { AddMeasurementForm } from '../components/AddMeasurementForm';
import { GrowthChart } from '../components/GrowthChart';
import { MeasurementList } from '../components/MeasurementList';
import { saveData, loadData, generateReadableId } from '../api/dataService';

interface HomeProps {
  children: Child[];
  selectedChildId: string | null;
  showAddChild: boolean;
  showAddMeasurement: boolean;
  selectedChart: MeasurementType;
  standard: PercentileStandard;
  onSetSelectedChildId: (id: string) => void;
  onSetShowAddChild: (show: boolean) => void;
  onSetShowAddMeasurement: (show: boolean) => void;
  onSetSelectedChart: (chart: MeasurementType) => void;
  onSetStandard: (standard: PercentileStandard) => void;
  onAddChild: (childData: Omit<Child, 'id' | 'measurements'>) => void;
  onAddMeasurement: (measurementData: Omit<Measurement, 'id' | 'ageInDays'>) => void;
  onDeleteMeasurement: (measurementId: string) => void;
  onDeleteChild: (childId: string) => void;
  onUpdateChildren: (children: Child[]) => void;
}

const Home: React.FC<HomeProps> = ({
  children,
  selectedChildId,
  showAddChild,
  showAddMeasurement,
  selectedChart,
  standard,
  onSetSelectedChildId,
  onSetShowAddChild,
  onSetShowAddMeasurement,
  onSetSelectedChart,
  onSetStandard,
  onAddChild,
  onAddMeasurement,
  onDeleteMeasurement,
  onDeleteChild,
  onUpdateChildren,
}) => {
  const selectedChild = children.find((c) => c.id === selectedChildId);

  // Save/Load state
  const [dataId, setDataId] = useState('');
  const [loadId, setLoadId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [loadStatus, setLoadStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleSaveData = async () => {
    if (children.length === 0) {
      setSaveStatus({ type: 'error', message: 'No data to save' });
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000);
      return;
    }

    setIsSaving(true);
    try {
      const id = dataId || generateReadableId();
      await saveData(id, children);
      setDataId(id);

      // Create shareable URL
      const shareUrl = `${window.location.origin}${window.location.pathname}?id=${id}`;
      setSaveStatus({ type: 'success', message: `Saved! Share this URL: ${shareUrl}` });
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 10000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Failed to save data' });
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadData = async () => {
    if (!loadId.trim()) {
      setLoadStatus({ type: 'error', message: 'Please enter an ID' });
      setTimeout(() => setLoadStatus({ type: null, message: '' }), 3000);
      return;
    }

    setIsLoading(true);
    try {
      const data = await loadData(loadId.trim());
      onUpdateChildren(data.children || []);
      setDataId(loadId.trim());
      setLoadStatus({ type: 'success', message: 'Data loaded successfully!' });
      setTimeout(() => setLoadStatus({ type: null, message: '' }), 3000);
    } catch (error) {
      setLoadStatus({ type: 'error', message: 'Failed to load data. Check the ID and try again.' });
      setTimeout(() => setLoadStatus({ type: null, message: '' }), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Two-column layout: forms on left, charts on right (desktop only) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN - Forms and Controls */}
        <div className="space-y-6">
          {/* Location/Standard Selector */}
          <div className="card">
            <label className="block text-sm font-medium mb-2">Growth Standard</label>
            <select
              value={standard}
              onChange={(e) => onSetStandard(e.target.value as PercentileStandard)}
              className="input-field"
            >
              {(Object.keys(STANDARD_LABELS) as PercentileStandard[]).map((key) => (
                <option key={key} value={key}>
                  {STANDARD_LABELS[key]}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {standard === 'WHO' && 'WHO standards are used internationally and show 7 percentile lines'}
              {standard === 'NHS' && 'NHS/UK-WHO standards (England) show 9 centile lines based on WHO data'}
            </p>
          </div>

          {/* Child Selector and Management */}
          {children.length > 0 && (
            <div className="card">
              <label className="block text-sm font-medium mb-2">Select Child</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={selectedChildId || ''}
                  onChange={(e) => onSetSelectedChildId(e.target.value)}
                  className="input-field flex-1"
                >
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name} ({child.gender})
                    </option>
                  ))}
                </select>
                {selectedChild && (
                  <button
                    onClick={() => onDeleteChild(selectedChild.id)}
                    className="btn-secondary text-red-600 whitespace-nowrap"
                  >
                    Delete Child
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Add Child Form */}
          {showAddChild && (
            <AddChildForm onAddChild={onAddChild} onCancel={() => onSetShowAddChild(false)} />
          )}

          {/* Show add child button if no children or form is hidden */}
          {!showAddChild && (
            <div>
              <button onClick={() => onSetShowAddChild(true)} className="btn-primary w-full">
                {children.length === 0 ? 'Add Your First Child' : 'Add Another Child'}
              </button>
            </div>
          )}

          {/* Save/Load Data Section - Always visible */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Save/Load Data</h3>

            {/* Save Section */}
            <div className="mb-4">
              <button
                onClick={handleSaveData}
                disabled={isSaving || children.length === 0}
                className="btn-primary w-full bg-[#98971a] hover:bg-[#79740e] dark:bg-[#98971a] dark:hover:bg-[#79740e] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save Data'}
              </button>
              {dataId && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Current ID: <span className="font-mono font-semibold">{dataId}</span>
                </p>
              )}
              {saveStatus.type && (
                <div className={`mt-2 p-2 rounded text-sm ${saveStatus.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                  {saveStatus.message}
                </div>
              )}
            </div>

            {/* Load Section */}
            <div>
              <label className="block text-sm font-medium mb-2">Load Data by ID</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={loadId}
                  onChange={(e) => setLoadId(e.target.value)}
                  placeholder="Enter ID (e.g., happy-puppy-1234)"
                  className="input-field flex-1"
                />
                <button
                  onClick={handleLoadData}
                  disabled={isLoading || !loadId.trim()}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isLoading ? 'Loading...' : 'Load'}
                </button>
              </div>
              {loadStatus.type && (
                <div className={`mt-2 p-2 rounded text-sm ${loadStatus.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                  {loadStatus.message}
                </div>
              )}
            </div>
          </div>

          {/* Child Details and Measurements */}
          {selectedChild && (
            <>
              {/* Add Measurement Form */}
              {showAddMeasurement && (
                <AddMeasurementForm
                  childDateOfBirth={selectedChild.dateOfBirth}
                  onAddMeasurement={onAddMeasurement}
                  onCancel={() => onSetShowAddMeasurement(false)}
                />
              )}

              {!showAddMeasurement && (
                <div>
                  <button onClick={() => onSetShowAddMeasurement(true)} className="btn-primary w-full">
                    Add Measurement
                  </button>
                </div>
              )}

              {/* Measurement List */}
              <MeasurementList
                measurements={selectedChild.measurements}
                gender={selectedChild.gender}
                standard={standard}
                onDelete={onDeleteMeasurement}
              />
            </>
          )}

          {/* Empty State */}
          {children.length === 0 && !showAddChild && (
            <div className="card text-center py-12">
              <h2 className="text-xl font-bold mb-2">Welcome to KidChart!</h2>
              <p className="text-gray-600 mb-6">
                Start tracking your child's growth by adding their information above.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Charts */}
        <div className="space-y-6">
          {selectedChild && (
            <>
              {/* Chart Type Selector */}
              <div className="card">
                <label className="block text-sm font-medium mb-2">View Chart</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onSetSelectedChart('height')}
                    className={`py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                      selectedChart === 'height'
                        ? 'bg-[#d65d0e] text-[#fbf1c7] dark:bg-[#d65d0e] dark:text-[#fbf1c7] shadow-md transform scale-105'
                        : 'bg-[#ebdbb2] dark:bg-[#504945] text-[#3c3836] dark:text-[#ebdbb2] hover:bg-[#d5c4a1] dark:hover:bg-[#665c54]'
                    }`}
                  >
                    Height
                  </button>
                  <button
                    onClick={() => onSetSelectedChart('weight')}
                    className={`py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                      selectedChart === 'weight'
                        ? 'bg-[#d65d0e] text-[#fbf1c7] dark:bg-[#d65d0e] dark:text-[#fbf1c7] shadow-md transform scale-105'
                        : 'bg-[#ebdbb2] dark:bg-[#504945] text-[#3c3836] dark:text-[#ebdbb2] hover:bg-[#d5c4a1] dark:hover:bg-[#665c54]'
                    }`}
                  >
                    Weight
                  </button>
                  <button
                    onClick={() => onSetSelectedChart('headCircumference')}
                    className={`py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                      selectedChart === 'headCircumference'
                        ? 'bg-[#d65d0e] text-[#fbf1c7] dark:bg-[#d65d0e] dark:text-[#fbf1c7] shadow-md transform scale-105'
                        : 'bg-[#ebdbb2] dark:bg-[#504945] text-[#3c3836] dark:text-[#ebdbb2] hover:bg-[#d5c4a1] dark:hover:bg-[#665c54]'
                    }`}
                  >
                    Head
                  </button>
                </div>
              </div>

              {/* Growth Chart */}
              <GrowthChart
                measurements={selectedChild.measurements}
                measurementType={selectedChart}
                gender={selectedChild.gender}
                standard={standard}
                childName={selectedChild.name}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
