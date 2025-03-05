import React, { Dispatch, SetStateAction, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Image, Send, X } from 'lucide-react';
import { Page } from '@/types/types';

interface PostPageProps {
  storyContent: string;
  setStoryContent: (content: string) => void;
  setCurrentPage: Dispatch<SetStateAction<Page>>;
  onPost: () => void;
}

const PostPage: React.FC<PostPageProps> = ({
  storyContent,
  setStoryContent,
  setCurrentPage,
  onPost
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [characterCount, setCharacterCount] = useState(0);
  const MAX_CHARACTERS = 500;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostStory = () => {
    if (storyContent.trim()) {
      onPost();
      setStoryContent('');
      setCurrentPage('fyp');
      setImagePreview(null);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setStoryContent(content);
    setCharacterCount(content.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 p-4 max-w-2xl mx-auto"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center mb-6"
      >
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCurrentPage('fyp')} 
          className="mr-4 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft size={24} />
        </motion.button>
        <h1 className="text-2xl font-bold text-white">Share Your Story</h1>
      </motion.div>

      {/* Story Content Textarea */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <textarea
          className="w-full h-64 bg-gray-800 rounded-xl p-4 text-white border-2 border-transparent focus:border-blue-500 transition-all duration-300 resize-none placeholder-gray-500"
          placeholder="Write your anonymous story here..."
          value={storyContent}
          maxLength={MAX_CHARACTERS}
          onChange={handleContentChange}
        ></textarea>
        
        {/* Character Counter */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between text-sm text-gray-400 mt-2"
        >
          <span 
            className={`transition-colors ${
              characterCount > MAX_CHARACTERS * 0.9 ? 'text-red-500' : ''
            }`}
          >
            {characterCount} / {MAX_CHARACTERS} characters
          </span>
        </motion.div>
      </motion.div>

      {/* Image Upload Preview */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative mb-4"
          >
            <motion.button
              whileHover={{ rotate: 180 }}
              className="absolute top-2 right-2 bg-black/50 rounded-full p-1 z-10"
              onClick={() => setImagePreview(null)}
            >
              <X size={16} className="text-white" />
            </motion.button>
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-48 object-cover rounded-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between items-center"
      >
        {/* Image Upload Button */}
        <motion.label 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer hover:bg-gray-600 transition-colors"
        >
          <Image size={18} className="mr-2" />
          Add Image
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload}
          />
        </motion.label>

        {/* Post Story Button */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePostStory}
          disabled={!storyContent.trim()}
          className={`
            flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white 
            px-6 py-2 rounded-lg transition-all duration-300
            ${!storyContent.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'}
          `}
        >
          <Send size={18} className="mr-2" />
          Post Story
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default PostPage;