"use client";
import React from 'react';
import { Globe, Plus, BookOpen, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const router = useRouter();

  const navItems = [
    { path: '/fyp', icon: Globe, label: 'FYP' },
    { path: '/post', icon: Plus, label: '', isMain: true },
    { path: '/saved', icon: BookOpen, label: 'Saved' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-muted py-3 px-2 z-50 dark:bg-dark-background dark:border-dark-muted">
      <div className="flex items-center justify-around relative">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center text-muted hover:text-text dark:text-dark-muted dark:hover:text-dark-text transition-colors ${
              item.isMain ? 'absolute left-1/2 -translate-x-1/2 -top-8' : ''
            }`}
          >
            {item.isMain ? (
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-md border-4 border-background dark:border-dark-background dark:shadow-dark-md">
                <item.icon size={32} className="text-background dark:text-dark-background" />
              </div>
            ) : (
              <>
                <item.icon size={24} />
                <span className="text-xs mt-1 font-body">{item.label}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navbar;