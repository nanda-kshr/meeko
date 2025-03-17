'use client';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface SwipeButtonsProps {
  swipeCardAway: (direction: 'left' | 'right') => void;
}

export const SwipeButtons: React.FC<SwipeButtonsProps> = ({ swipeCardAway }) => (
  <>
    <button
      onClick={() => swipeCardAway('left')}
      className="bg-red-100 text-red-500 p-3 rounded-full shadow-md"
    >
      <ThumbsDown size={24} />
    </button>
    <button
      onClick={() => swipeCardAway('right')}
      className="bg-green-100 text-green-500 p-3 rounded-full shadow-md"
    >
      <ThumbsUp size={24} />
    </button>
  </>
);