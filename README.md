# KidChart - Child Growth Tracker

A mobile-friendly web application for tracking children's growth measurements with WHO and NHS percentile charts.

## Features

- **Multiple Children Support**: Track growth for multiple children
- **Comprehensive Measurements**: Record height, weight, and head circumference
- **WHO/NHS Percentiles**: View growth charts with both WHO and NHS standards
- **Visual Charts**: Interactive percentile charts using Recharts
- **Mobile-First Design**: Fully responsive design optimized for mobile devices
- **Local Storage**: All data persists in browser localStorage (no backend required)
- **Percentile Feedback**: Automatic percentile range calculation for each measurement

## Tech Stack

Built with the same stack as your vestwise project:

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Recharts** for growth charts
- **localStorage** for data persistence

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd /Users/anicu/Projects/kidchart
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

### Running the Development Server

**Note**: If you encounter permission issues when starting the dev server (EPERM errors), you may need to:
- Check your firewall settings
- Disable Little Snitch or similar network monitoring tools temporarily
- Use a different port by editing `vite.config.ts`

```bash
npm run dev
```

The app will open at `http://127.0.0.1:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Usage

### Adding a Child

1. Click "Add Your First Child" (or "Add Another Child" if you already have children)
2. Enter the child's name, date of birth, and gender
3. Click "Add Child"

### Recording Measurements

1. Select the child from the dropdown (if you have multiple children)
2. Click "Add Measurement"
3. Enter the date and measurements (height, weight, and/or head circumference)
4. Click "Add Measurement" to save

### Viewing Growth Charts

1. Select a child
2. Choose which chart to view (Height, Weight, or Head)
3. The chart will display:
   - WHO/NHS percentile curves (3rd, 10th, 25th, 50th, 75th, 90th, 97th)
   - Your child's actual measurements as blue dots
   - Age in months on the x-axis

### Switching Between WHO and NHS Standards

1. Use the "Growth Standard" dropdown at the top
2. Select either WHO (international) or NHS (UK) standards
3. All charts will update automatically

### Viewing Measurement History

- Scroll down below the charts to see all recorded measurements
- Each measurement shows the date, age, values, and percentile ranges
- Click "Delete" to remove a measurement

## Data Persistence

All data is stored locally in your browser using localStorage. Your data:
- Persists across browser sessions
- Is never sent to any server
- Is specific to your browser and device
- Can be cleared by clearing browser data

## Mobile Support

The app is fully responsive and optimized for mobile devices:
- Touch-friendly buttons and forms
- Responsive charts that work on small screens
- Mobile-first design approach
- Add to home screen support (PWA)

## Project Structure

```
kidchart/
├── src/
│   ├── components/          # React components
│   │   ├── AddChildForm.tsx
│   │   ├── AddMeasurementForm.tsx
│   │   ├── GrowthChart.tsx
│   │   └── MeasurementList.tsx
│   ├── data/               # WHO percentile data
│   │   ├── whoHeightData.ts
│   │   ├── whoWeightData.ts
│   │   └── whoHeadCircumferenceData.ts
│   ├── utils/              # Utility functions
│   │   ├── calculations.ts
│   │   └── storage.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Future Enhancements

Potential improvements:
- Export data to PDF/CSV
- Complete NHS percentile data
- Photo attachments for measurements
- Multiple language support
- Sharing charts with healthcare providers
- Cloud sync (with user account)

## License

This is a personal project for tracking child growth measurements.

## Acknowledgments

- WHO growth standards data
- NHS growth standards data
- Recharts for beautiful charts
- Tailwind CSS for styling


