import { Child } from '../types';

const STORAGE_KEY = 'kidchart_children';

export const saveChildren = (children: Child[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(children));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadChildren = (): Child[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return [];
  }
};

export const saveLocation = (location: string): void => {
  try {
    localStorage.setItem('kidchart_location', location);
  } catch (error) {
    console.error('Error saving location:', error);
  }
};

export const loadLocation = (): string => {
  try {
    return localStorage.getItem('kidchart_location') || 'WHO';
  } catch (error) {
    console.error('Error loading location:', error);
    return 'WHO';
  }
};
