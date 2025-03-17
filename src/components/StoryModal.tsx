// components/stories/StoryModal.tsx
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar } from 'lucide-react';
import { Story } from './stories/StoriesList';

interface StoryModalProps {
  story: Story;
  onClose: () => void;
}

export default function StoryModal({ story, onClose }: StoryModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Format the timestamp
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Close on escape key
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          ref={modalRef}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h3 className="font-bold text-lg">Story Details</h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-4 overflow-y-auto flex-grow">
            {/* Author info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                <User size={20} className="text-gray-400" />
              </div>
              <div>
                <p className="font-medium">{story.author.name}</p>
                <p className="text-gray-400 text-sm flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(story.timestamp)}
                </p>
              </div>
            </div>
            
            {/* Story content */}
            <div className="whitespace-pre-wrap">
              {story.content}
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={onClose}
              className="w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}