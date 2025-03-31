"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { LogOut, BookOpen, PlusCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import StoriesList from '@/components/stories/StoriesList';
import type { User as FirebaseUser } from "firebase/auth";

export default function ProfilePage() {
  const [user, setUser] = useState<FirebaseUser>();
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stories');
  const router = useRouter();

  // Ensure client-side execution and check auth state
  useEffect(() => {
    setIsClient(true);
    const token = Cookies.get('meeken');
    if (!token) {
      router.push('/signin');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        Cookies.remove('meeken');
        router.push('/signin');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Cookies.remove('meeken');
      router.push('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const tabVariants = {
    inactive: { opacity: 0.7, y: 5 },
    active: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  if (!isClient || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full"
          />
          <p className="text-blue-400 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
      {/* Fixed header with blur effect */}
      <motion.div 
        className="sticky top-0 z-10 bg-gray-900 bg-opacity-80 backdrop-blur-md px-4 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold">Profile</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </motion.button>
        </div>
      </motion.div>
      
      <motion.div
        className="container mx-auto px-4 py-6 max-w-2xl flex-grow overflow-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Header */}
        <motion.div 
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">{user?.displayName || 'Anonymous'}</h1>
          <p className="text-gray-400 mt-1 mb-3">{user?.email}</p>
        </motion.div>


        {/* Tabs Navigation */}
        <motion.div 
          className="flex border-b border-gray-700 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.button
            className={`px-4 py-3 flex items-center gap-2 ${activeTab === 'stories' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('stories')}
            variants={tabVariants}
            animate={activeTab === 'stories' ? 'active' : 'inactive'}
          >
            <BookOpen size={18} />
            Stories
          </motion.button>
        </motion.div>

        {/* Stories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {activeTab === 'stories' && 'Your Stories'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/post')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 text-sm"
            >
              <PlusCircle size={16} />
              New Story
            </motion.button>
          </div>
          
          <StoriesList />
        </motion.div>
      </motion.div>
      
      <Navbar />
    </div>
  );
}