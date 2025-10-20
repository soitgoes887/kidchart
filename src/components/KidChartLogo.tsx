import React from 'react';

// Icon only version for header
export const KidChartIcon: React.FC<{ className?: string }> = ({
  className = ''
}) => {
  return (
    <svg width="40" height="40" viewBox="0 0 80 80" className={className}>
      <circle cx="40" cy="40" r="40" fill="#d65d0e" />
      <rect x="20" y="45" width="8" height="15" fill="#fabd2f" rx="2"/>
      <rect x="32" y="35" width="8" height="25" fill="#fabd2f" rx="2"/>
      <rect x="44" y="25" width="8" height="35" fill="#fabd2f" rx="2"/>
      <circle cx="40" cy="25" r="10" fill="#fabd2f"/>
    </svg>
  );
};
