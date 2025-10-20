import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">About KidChart</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-orange-600 dark:text-orange-400 mb-4">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            KidChart was created to help parents track and understand their children's growth patterns using
            internationally recognized WHO and NHS growth standards.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Every child grows at their own pace, and monitoring growth helps ensure healthy development.
            KidChart makes it easy to record measurements and visualize them on percentile charts, giving
            you clear insights into your child's growth journey.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-orange-600 dark:text-orange-400 mb-4">What We Offer</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Growth Tracking</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Record height, weight, and head circumference measurements for multiple children.
                Track their growth over time with easy-to-use forms and automatic age calculations.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">WHO & NHS Standards</h3>
              <p className="text-gray-700 dark:text-gray-300">
                View your child's measurements against WHO (World Health Organization) or NHS (UK)
                growth standards with percentile charts showing the 3rd, 10th, 25th, 50th, 75th, 90th, and 97th percentiles.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Visual Insights</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Interactive charts help you visualize your child's growth patterns and compare them to
                standard percentile curves. See exactly where your child falls on the growth chart.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Privacy First</h3>
              <p className="text-gray-700 dark:text-gray-300">
                All your data is stored locally on your device. No accounts, no servers, no data collection.
                Your child's information stays completely private and under your control.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-orange-600 dark:text-orange-400 mb-4">Key Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>Track multiple children with individual growth records</li>
            <li>Record height, weight, and head circumference measurements</li>
            <li>Automatic age calculation and percentile determination</li>
            <li>Interactive growth charts with percentile curves</li>
            <li>DD/MM/YYYY date format for international users</li>
            <li>Dark mode support for comfortable viewing</li>
            <li>Responsive design - works on mobile, tablet, and desktop</li>
            <li>Local storage - your data never leaves your device</li>
          </ul>
        </div>

        <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm">
            <strong>Disclaimer:</strong> KidChart provides growth tracking for informational purposes only.
            Growth charts and percentiles are references and should not replace professional medical advice.
            Please consult with your pediatrician or healthcare provider for personalized guidance about your child's growth and development.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
