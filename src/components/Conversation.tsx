import React, { useState } from 'react';
import { ChevronLeft, Send } from 'lucide-react';
import { Message } from '@/types/types';

interface ConversationProps {
  message: Message;
  onClose: () => void;
  setCurrentMessage: (message: Message | null) => void;
}

const Conversation: React.FC<ConversationProps> = ({ message, setCurrentMessage }) => {
  const [messageText, setMessageText] = useState('');

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-800 flex items-center">
        <button onClick={() => setCurrentMessage(null)} className="mr-3">
          <ChevronLeft size={24} />
        </button>
        <img src={message.avatar} alt={message.user} className="w-8 h-8 rounded-full mr-3" />
        <h3 className="font-semibold">{message.user}</h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <div className="flex justify-start">
          <div className="bg-gray-800 rounded-lg rounded-tl-none p-3 max-w-xs">
            <p className="text-sm">Hi there! I really enjoyed your story.</p>
            <span className="text-xs text-gray-500 mt-1 block">10:30 AM</span>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-blue-600 rounded-lg rounded-tr-none p-3 max-w-xs">
            <p className="text-sm">Thank you! It was a life-changing experience.</p>
            <span className="text-xs text-gray-300 mt-1 block">10:32 AM</span>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-white focus:outline-none"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button 
            onClick={() => { if (messageText.trim()) alert("Message sent!"); setMessageText(''); }}
            className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center ${messageText.trim() ? 'bg-blue-500' : 'bg-gray-700'}`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;