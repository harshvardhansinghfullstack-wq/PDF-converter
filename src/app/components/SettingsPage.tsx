'use client';

import React, { useState } from 'react';

const SettingsPage = () => {
  const [language, setLanguage] = useState('English'); // Default language
  const [emailNotifications, setEmailNotifications] = useState(true); // Email notifications enabled by default

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleEmailNotificationToggle = () => {
    setEmailNotifications(!emailNotifications);
  };

  const handleAccountDeletion = () => {
    // Add account deletion logic here (e.g., make an API call to delete the account)
    alert('Account deletion functionality to be implemented');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6 sm:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8 space-y-8">
        <h2 className="text-4xl font-semibold text-gray-800">Preferences</h2>

        {/* Language Section */}
        <section className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-700">Language</h3>
          <div className="flex items-center gap-6">
            <span className="text-lg text-gray-600">{language}</span>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Select Language"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              {/* Add more language options as necessary */}
            </select>
          </div>
        </section>

        {/* Email Notifications Section */}
        <section className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-700">Email Notifications</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              No longer wish to receive promotional emails from us? You can do so here.
            </span>
            <button
              onClick={handleEmailNotificationToggle}
              className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {emailNotifications ? 'Disable Emails' : 'Enable Emails'}
            </button>
          </div>
        </section>

        {/* Manage Account Section */}
        <section className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-700">Manage Account</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Delete your account permanently</span>
            <button
              onClick={handleAccountDeletion}
              className="text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Account
            </button>
          </div>
        </section>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
