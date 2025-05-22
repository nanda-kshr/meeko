"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/config/firebase';
import { signOut } from 'firebase/auth';
import { motion } from 'framer-motion';
import { LogOut, BookOpen, PlusCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import StoriesList from '@/components/stories/StoriesList';
import { useAuth } from '@/lib/authContext';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('stories');
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const tabVariants = {
    inactive: { opacity: 0.7, y: 5 },
    active: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white text-black">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-12 h-12 border-4 border-t-transparent border-black rounded-full"
          />
          <p className="text-gray-700 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-black font-sans">
      {/* Fixed header with blur effect */}
      <motion.div 
        className="sticky top-0 z-10 bg-white bg-opacity-80 backdrop-blur-md px-4 py-4 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold">Profile</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm"
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
          <p className="text-gray-600 mt-1 mb-3">{user?.email}</p>
        </motion.div>


        {/* Tabs Navigation */}
        <motion.div 
          className="flex border-b border-gray-200 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.button
            className={`px-4 py-3 flex items-center gap-2 ${activeTab === 'stories' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}
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
              className="px-4 py-2 bg-black hover:bg-gray-800 rounded-lg flex items-center gap-2 text-sm text-white"
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