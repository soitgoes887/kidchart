import { useState, useEffect } from 'react';
import { Child, Measurement, PercentileStandard, MeasurementType } from './types';
import { KidChartIcon } from './components/KidChartLogo';
import { saveChildren, loadChildren, saveLocation, loadLocation } from './utils/storage';
import { calculateAgeInDays } from './utils/calculations';
import { loadData } from './api/dataService';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [showAddChild, setShowAddChild] = useState(false);
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);
  const [selectedChart, setSelectedChart] = useState<MeasurementType>('height');
  const [standard, setStandard] = useState<PercentileStandard>('WHO');

  // Load data on mount
  useEffect(() => {
    const loadInitialData = async () => {
      // Check if there's an 'id' parameter in the URL
      const urlParams = new URLSearchParams(window.location.search);
      const sharedId = urlParams.get('id');

      if (sharedId) {
        // If there's a shared ID, load data from the API
        try {
          const data = await loadData(sharedId);
          if (data.children && data.children.length > 0) {
            setChildren(data.children);
            setSelectedChildId(data.children[0].id);
            // Clear the URL parameter after loading
            window.history.replaceState({}, '', window.location.pathname);
          }
        } catch (error) {
          console.error('Failed to load shared data:', error);
          // Fall back to local storage if loading fails
          const loadedChildren = loadChildren();
          setChildren(loadedChildren);
          if (loadedChildren.length > 0) {
            setSelectedChildId(loadedChildren[0].id);
          }
        }
      } else {
        // No shared ID, load from local storage
        const loadedChildren = loadChildren();
        setChildren(loadedChildren);
        if (loadedChildren.length > 0) {
          setSelectedChildId(loadedChildren[0].id);
        }
      }

      setStandard(loadLocation() as PercentileStandard);
    };

    loadInitialData();
  }, []);

  // Save data when children change
  useEffect(() => {
    if (children.length > 0) {
      saveChildren(children);
    }
  }, [children]);

  // Save location when it changes
  useEffect(() => {
    saveLocation(standard);
  }, [standard]);

  const selectedChild = children.find((c) => c.id === selectedChildId);

  const handleAddChild = (childData: Omit<Child, 'id' | 'measurements'>) => {
    const newChild: Child = {
      ...childData,
      id: Date.now().toString(),
      measurements: [],
    };
    setChildren([...children, newChild]);
    setSelectedChildId(newChild.id);
    setShowAddChild(false);
  };

  const handleAddMeasurement = (measurementData: Omit<Measurement, 'id' | 'ageInDays'>) => {
    if (!selectedChild) return;

    const newMeasurement: Measurement = {
      ...measurementData,
      id: Date.now().toString(),
      ageInDays: calculateAgeInDays(selectedChild.dateOfBirth, measurementData.date),
    };

    const updatedChildren = children.map((child) =>
      child.id === selectedChildId
        ? { ...child, measurements: [...child.measurements, newMeasurement] }
        : child
    );

    setChildren(updatedChildren);
    setShowAddMeasurement(false);
  };

  const handleDeleteMeasurement = (measurementId: string) => {
    if (!selectedChild) return;

    const updatedChildren = children.map((child) =>
      child.id === selectedChildId
        ? {
            ...child,
            measurements: child.measurements.filter((m) => m.id !== measurementId),
          }
        : child
    );

    setChildren(updatedChildren);
  };

  const handleDeleteChild = (childId: string) => {
    const updatedChildren = children.filter((c) => c.id !== childId);
    setChildren(updatedChildren);
    if (selectedChildId === childId) {
      setSelectedChildId(updatedChildren.length > 0 ? updatedChildren[0].id : null);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            children={children}
            selectedChildId={selectedChildId}
            showAddChild={showAddChild}
            showAddMeasurement={showAddMeasurement}
            selectedChart={selectedChart}
            standard={standard}
            onSetSelectedChildId={setSelectedChildId}
            onSetShowAddChild={setShowAddChild}
            onSetShowAddMeasurement={setShowAddMeasurement}
            onSetSelectedChart={setSelectedChart}
            onSetStandard={setStandard}
            onAddChild={handleAddChild}
            onAddMeasurement={handleAddMeasurement}
            onDeleteMeasurement={handleDeleteMeasurement}
            onDeleteChild={handleDeleteChild}
            onUpdateChildren={setChildren}
          />
        );
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return (
          <Home
            children={children}
            selectedChildId={selectedChildId}
            showAddChild={showAddChild}
            showAddMeasurement={showAddMeasurement}
            selectedChart={selectedChart}
            standard={standard}
            onSetSelectedChildId={setSelectedChildId}
            onSetShowAddChild={setShowAddChild}
            onSetShowAddMeasurement={setShowAddMeasurement}
            onSetSelectedChart={setSelectedChart}
            onSetStandard={setStandard}
            onAddChild={handleAddChild}
            onAddMeasurement={handleAddMeasurement}
            onDeleteMeasurement={handleDeleteMeasurement}
            onDeleteChild={handleDeleteChild}
            onUpdateChildren={setChildren}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf1c7] dark:bg-[#282828]">
      {/* Header */}
      <header className="bg-[#d65d0e] dark:bg-[#d65d0e] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            {/* Logo and Brand */}
            <div
              className="flex items-center space-x-2 md:space-x-3 cursor-pointer"
              onClick={() => setCurrentPage('home')}
            >
              {/* Logo Icon */}
              <KidChartIcon className="w-8 h-8 md:w-10 md:h-10 drop-shadow-md" />

              <div>
                <h1 className="text-xl md:text-2xl font-bold text-[#fbf1c7] dark:text-[#fbf1c7] tracking-tight">
                  KidChart
                </h1>
                <p className="text-xs text-[#f9f5d7] dark:text-[#f9f5d7] hidden sm:block">
                  Track your child's growth journey
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-wrap justify-end gap-2 sm:gap-3 md:gap-0 md:space-x-8">
              <button
                onClick={() => setCurrentPage('home')}
                className={`text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  currentPage === 'home'
                    ? 'text-[#fbf1c7] dark:text-[#fbf1c7] border-b-2 border-[#fbf1c7] dark:border-[#fbf1c7] pb-1'
                    : 'text-[#ebdbb2] dark:text-[#ebdbb2] hover:text-[#fbf1c7] dark:hover:text-[#fbf1c7]'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('about')}
                className={`text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  currentPage === 'about'
                    ? 'text-[#fbf1c7] dark:text-[#fbf1c7] border-b-2 border-[#fbf1c7] dark:border-[#fbf1c7] pb-1'
                    : 'text-[#ebdbb2] dark:text-[#ebdbb2] hover:text-[#fbf1c7] dark:hover:text-[#fbf1c7]'
                }`}
              >
                About
              </button>
              <button
                onClick={() => setCurrentPage('contact')}
                className={`text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  currentPage === 'contact'
                    ? 'text-[#fbf1c7] dark:text-[#fbf1c7] border-b-2 border-[#fbf1c7] dark:border-[#fbf1c7] pb-1'
                    : 'text-[#ebdbb2] dark:text-[#ebdbb2] hover:text-[#fbf1c7] dark:hover:text-[#fbf1c7]'
                }`}
              >
                Contact
              </button>
            </nav>
          </div>
        </div>
      </header>

      {renderPage()}
    </div>
  );
}

export default App;
