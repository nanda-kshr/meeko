'use client';
import { MoreVertical } from 'lucide-react';

interface StoryHeaderProps {
  author: string;
  timestamp: string;
}

export const StoryHeader: React.FC<StoryHeaderProps> = ({ author, timestamp }) => (
  <div className="flex items-center justify-between mb-4 flex-shrink-0">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
      <div>
        <div className="text-sm font-semibold text-gray-800">@{author}</div>
        <div className="text-xs text-gray-500">{timestamp}</div>
      </div>
    </div>
    <button className="text-gray-500 hover:text-gray-700">
      <MoreVertical size={20} />
    </button>
  </div>
);