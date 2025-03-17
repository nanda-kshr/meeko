// components/Navbar.tsx
"use client";
import React from 'react';
import { Globe, Users, Plus, Mail, BookOpen, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const router = useRouter();

  const navItems = [
    { path: '/following', icon: Users, label: 'Following' },
    { path: '/fyp', icon: Globe, label: 'FYP' },
    { path: '/post', icon: Plus, label: '', isMain: true },
    { path: '/inbox', icon: Mail, label: 'Inbox' },
    { path: '/saved', icon: BookOpen, label: 'Saved' },
    { path: '/profile', icon: User, label: 'Profile' }, // Added Profile
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 py-3 px-2 z-50">
      <div className="flex items-center justify-around relative">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center text-gray-500 hover:text-white ${
              item.isMain ? 'absolute left-1/2 -translate-x-1/2 -top-8' : ''
            }`}
          >
            {item.isMain ? (
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg border-4 border-gray-900">
                <item.icon size={32} className="text-white" />
              </div>
            ) : (
              <>
                <item.icon size={24} />
                <span className="text-xs mt-1">{item.label}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navbar;