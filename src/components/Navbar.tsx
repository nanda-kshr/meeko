"use client";
import React from 'react';
import { Globe, PenLine, BookOpen, User, Home } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { path: '/fyp', icon: Home, label: 'Home' },
    { path: '/discover', icon: Globe, label: 'Explore' },
    { path: '/post', icon: PenLine, label: 'Write' },
    { path: '/saved', icon: BookOpen, label: 'Saved' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-2 z-50 shadow-sm">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`relative flex flex-col items-center transition-transform ${
                isActive(item.path) ? 'text-black scale-110' : 'text-gray-500'
              } ${item.path === '/post' ? 'transform -translate-y-2' : ''}`}
            >
              {item.path === '/post' ? (
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shadow-md">
                  <item.icon size={20} className="text-white" />
                  <span className="absolute -bottom-5 text-xs font-medium text-black">
                    {item.label}
                  </span>
                </div>
              ) : (
                <>
                  <div className={`p-1 rounded-full ${isActive(item.path) ? 'bg-gray-100' : ''}`}>
                    <item.icon size={20} strokeWidth={2} className={isActive(item.path) ? 'text-black' : 'text-gray-500'} />
                  </div>
                  <span className={`text-xs mt-1 font-medium ${isActive(item.path) ? 'text-black' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;