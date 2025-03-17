"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { User, LogOut, Edit, BookOpen, PlusCircle, Users, Calendar } from 'lucide-react';
import Navbar from '@/components/Navbar';
import StoriesList from '@/components/stories/StoriesList';
import Image from 'next/image';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stories');
  const router = useRouter();

  // Ensure client-side execution and check auth state
  useEffect(() => {
    setIsClient(true);
    const token = Cookies.get('sr-token');
    if (!token) {
      router.push('/signin');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        Cookies.remove('sr-token');
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
      Cookies.remove('sr-token');
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

  const joinDate = user?.metadata?.creationTime 
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : 'Unknown';

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
          <div className="relative w-32 h-32 mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse" />
            <div className="absolute inset-1 rounded-full bg-gray-800" />
            <div className="absolute inset-2 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-gray-400" />
              )}
            </div>
          </div>
          <h1 className="text-3xl font-bold">{user?.displayName || 'Anonymous'}</h1>
          <p className="text-gray-400 mt-1 mb-3">{user?.email}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full flex items-center gap-2 text-sm"
            onClick={() => router.push('/profile/edit')}
          >
            <Edit size={16} />
            Edit Profile
          </motion.button>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-4 gap-2 text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-gray-800 rounded-xl p-4">
            <BookOpen size={20} className="mx-auto mb-1 text-blue-400" />
            <p className="text-xl font-semibold">0</p>
            <p className="text-gray-400 text-sm">Stories</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <Users size={20} className="mx-auto mb-1 text-purple-400" />
            <p className="text-xl font-semibold">0</p>
            <p className="text-gray-400 text-sm">Followers</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <Users size={20} className="mx-auto mb-1 text-green-400" />
            <p className="text-xl font-semibold">0</p>
            <p className="text-gray-400 text-sm">Following</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4">
            <Calendar size={20} className="mx-auto mb-1 text-yellow-400" />
            <p className="text-xl font-semibold">{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).getFullYear() : 'N/A'}</p>
            <p className="text-gray-400 text-sm">Joined</p>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div 
          className="bg-gray-800 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">About</h2>
            <p className="text-xs text-gray-400">Joined on {joinDate}</p>
          </div>
          <p className="text-gray-300">
            {user?.bio || 'No bio available yet. Edit your profile to add one!'}
          </p>
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
          <motion.button
            className={`px-4 py-3 flex items-center gap-2 ${activeTab === 'saved' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('saved')}
            variants={tabVariants}
            animate={activeTab === 'saved' ? 'active' : 'inactive'}
          >
            <BookOpen size={18} />
            Saved
          </motion.button>
          <motion.button
            className={`px-4 py-3 flex items-center gap-2 ${activeTab === 'drafts' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('drafts')}
            variants={tabVariants}
            animate={activeTab === 'drafts' ? 'active' : 'inactive'}
          >
            <BookOpen size={18} />
            Drafts
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
              {activeTab === 'saved' && 'Saved Stories'}
              {activeTab === 'drafts' && 'Draft Stories'}
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
          
          {activeTab === 'stories' && <StoriesList />}
          
          {activeTab === 'saved' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen size={64} className="text-gray-600 mb-4" />
              <h3 className="text-xl font-medium mb-2">No saved stories yet</h3>
              <p className="text-gray-400 max-w-sm mb-6">When you save stories, they'll appear here for you to read later.</p>
              <button onClick={() => router.push('/')} className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-sm">
                Browse Stories
              </button>
            </div>
          )}
          
          {activeTab === 'drafts' && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Edit size={64} className="text-gray-600 mb-4" />
              <h3 className="text-xl font-medium mb-2">No draft stories</h3>
              <p className="text-gray-400 max-w-sm mb-6">Start writing and save drafts to continue your work later.</p>
              <button onClick={() => router.push('/post')} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-sm">
                Start Writing
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
      
      <Navbar />
    </div>
  );
}