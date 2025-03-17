'use client';
import { useRef } from 'react';

interface StoryContentProps {
  content: string;
}

export const StoryContent: React.FC<StoryContentProps> = ({ content }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={contentRef}
      className="flex-grow overflow-y-auto max-h-[50vh] pr-2 -mr-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300"
    >
      <div className="text-lg text-gray-800 font-normal">{content}</div>
    </div>
  );
};