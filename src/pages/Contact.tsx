import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">Get in Touch</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <p className="text-gray-700 dark:text-gray-300 text-center mb-8">
            Have questions, feedback, or suggestions? We'd love to hear from you!
          </p>

          <div className="space-y-6">
            <div className="border-l-4 border-orange-600 dark:border-orange-400 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
              <a
                href="mailto:hello@kidchart.com"
                className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors"
              >
                hello@kidchart.com
              </a>
            </div>

            <div className="border-l-4 border-amber-600 dark:border-amber-400 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Feedback</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We're constantly improving KidChart. If you have ideas for new features or improvements,
                please don't hesitate to reach out at hello@kidchart.com.
              </p>
            </div>

            <div className="border-l-4 border-green-600 dark:border-green-400 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bug Reports</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Found a calculation error or technical issue? Please report it so we can fix it quickly.
                Send us an email with details about what you experienced.
              </p>
            </div>

            <div className="border-l-4 border-blue-600 dark:border-blue-400 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Privacy</h3>
              <p className="text-gray-700 dark:text-gray-300">
                All your child's data is stored locally on your device. We never collect, store, or transmit
                any personal information or measurement data. Your privacy is our priority.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-gray-800 rounded-lg border-2 border-orange-200 dark:border-orange-600 p-8 text-center">
          <h2 className="text-2xl font-semibold text-orange-900 dark:text-orange-400 mb-4">
            Send us a message
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            For any inquiries, please email us at:
          </p>
          <a
            href="mailto:hello@kidchart.com"
            className="inline-block bg-orange-600 dark:bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors"
          >
            hello@kidchart.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
