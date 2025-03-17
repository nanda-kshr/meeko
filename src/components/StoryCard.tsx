// components/stories/StoryCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User } from 'lucide-react';
import { Story } from './stories/StoriesList';

interface StoryCardProps {
  story: Story;
  onClick: () => void;
}

export default function StoryCard({ story, onClick }: StoryCardProps) {
  // Format the timestamp
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  // Get preview of content (first ~100 characters)
  const contentPreview = story.content.length > 100 
    ? `${story.content.substring(0, 100)}...` 
    : story.content;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-gray-800 rounded-lg p-4 cursor-pointer shadow-md"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg">
          {/* Using first line or first few words as "title" */}
          {story.content.split('\n')[0].substring(0, 60) + 
            (story.content.split('\n')[0].length > 60 ? '...' : '')}
        </h3>
      </div>
      
      <div className="text-gray-400 mb-4 text-sm">
        {contentPreview}
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <User size={14} />
          <span>{story.author.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{formatDate(story.timestamp)}</span>
        </div>
      </div>
    </motion.div>
  );
}