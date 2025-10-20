import React from 'react';
import { Child, Measurement, PercentileStandard, MeasurementType, STANDARD_LABELS } from '../types';
import { AddChildForm } from '../components/AddChildForm';
import { AddMeasurementForm } from '../components/AddMeasurementForm';
import { GrowthChart } from '../components/GrowthChart';
import { MeasurementList } from '../components/MeasurementList';

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
}) => {
  const selectedChild = children.find((c) => c.id === selectedChildId);

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
              {standard === 'WHO' && 'WHO standards are used internationally'}
              {standard === 'NHS' && 'NHS standards are specific to the UK'}
              {standard === 'CDC' && 'CDC standards are used in the United States'}
              {standard === 'Germany' && 'German standards from Robert Koch Institute'}
              {standard === 'Australia' && 'Australian standards from APEG'}
              {standard === 'China' && 'Chinese standards from Ministry of Health'}
              {standard === 'Japan' && 'Japanese standards from Ministry of Health'}
              {standard === 'France' && 'French standards from National Nutrition Program'}
            </p>
          </div>

          {/* Child Selector and Management */}
          {children.length > 0 && (
            <div className="card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">Select Child</label>
                  <select
                    value={selectedChildId || ''}
                    onChange={(e) => onSetSelectedChildId(e.target.value)}
                    className="input-field"
                  >
                    {children.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.name} ({child.gender})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  {selectedChild && (
                    <button
                      onClick={() => onDeleteChild(selectedChild.id)}
                      className="btn-secondary text-red-600"
                    >
                      Delete Child
                    </button>
                  )}
                </div>
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
