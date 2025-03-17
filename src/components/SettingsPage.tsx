// src/components/SettingsPage.tsx
import React, { Dispatch, SetStateAction } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Page } from '@/types/types';
import { useTheme } from '../context/ThemeContext';

interface SettingsPageProps {
  setCurrentPage: Dispatch<SetStateAction<Page>>;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ setCurrentPage }) => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: 'Light', value: 'light', colors: 'from-blue-500 to-teal-500' },
    { name: 'Dark', value: 'dark', colors: 'from-purple-600 to-blue-600' },
    { name: 'Creative', value: 'creative', colors: 'from-pink-600 to-red-600' }
  ];

  return (
    <div className="container mx-auto px-6 py-10 max-w-3xl">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => setCurrentPage('fyp')}
          className="mr-6 text-gray-700 hover:text-blue-500 transition-all duration-300 transform hover:scale-125 hover:rotate-12"
        >
          <ArrowLeft size={30} strokeWidth={2} />
        </button>
        <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Theme Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Choose Your Theme</h2>
        <div className="grid grid-cols-1 gap-4">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value as 'light' | 'dark' | 'creative')}
              className={`
                flex items-center justify-between p-4 rounded-lg transition-all duration-300
                ${theme === t.value ? `bg-gradient-to-r ${t.colors} text-white shadow-md scale-105` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
            >
              <span className="text-lg font-medium">{t.name}</span>
              {theme === t.value && (
                <span className="text-sm">✓ Active</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;