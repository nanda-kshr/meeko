'use client';
import { MoreVertical } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

interface StoryHeaderProps {
  author: string;
  title: string;
  genre: string;
}
export const formatTimestamp = (ts: string | Timestamp | undefined): string => {
  if (!ts) return 'Unknown date'; // Handle undefined
  if (typeof ts === 'string') {
    // Try parsing the string directly
    const date = new Date(ts);
    return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString();
  }
  if ('toDate' in ts && typeof ts.toDate === 'function') {
    // Handle Firestore Timestamp
    return ts.toDate().toLocaleDateString();
  }
  return 'Invalid date'; // Fallback for unexpected types
};

export const StoryHeader: React.FC<StoryHeaderProps> = ({ author, title, genre }) => {
  return (
    <div className="flex flex-col mb-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="text-sm font-semibold text-gray-800">@{author}</div>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreVertical size={20} />
        </button>
      </div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <div className="text-sm text-gray-600">
        Genre: <span className="font-medium">{genre}</span>
      </div>
    </div>
  );
};