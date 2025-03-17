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
    <div className="flex flex-col h-full bg-[#F0F0F0] font-serif text-gray-900">
      <div className="p-4 border-b-2 border-gray-400 flex items-center bg-[#D3D3D3] shadow-md">
        <button 
          onClick={() => setCurrentMessage(null)} 
          className="mr-3 hover:bg-gray-300 p-1 rounded-full transition-colors"
        >
          <ChevronLeft size={24} className="text-gray-700" />
        </button>
        <img 
          src={message.avatar} 
          alt={message.user} 
          className="w-10 h-10 rounded-full mr-3 border-2 border-gray-500 shadow-sm" 
        />
        <h3 className="font-bold text-lg text-gray-800">{message.user}</h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#EDEDED]">
        <div className="flex justify-start">
          <div className="bg-white rounded-lg rounded-tl-none p-3 max-w-xs shadow-md border border-gray-300">
            <p className="text-sm">Hi there! I really enjoyed your story.</p>
            <span className="text-xs text-gray-600 mt-1 block text-right">10:30 AM</span>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="bg-[#E0E0E0] rounded-lg rounded-tr-none p-3 max-w-xs shadow-md border border-gray-300">
            <p className="text-sm">Thank you! It was a life-changing experience.</p>
            <span className="text-xs text-gray-700 mt-1 block text-right">10:32 AM</span>
          </div>
        </div>
      </div>
      <div className="p-4 border-t-2 border-gray-400 bg-[#D3D3D3]">
        <div className="flex items-center">
          <input
            type="text"
            className="flex-1 bg-white rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 border border-gray-400 shadow-inner"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button 
            onClick={() => { if (messageText.trim()) alert("Message sent!"); setMessageText(''); }}
            className={`ml-2 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${messageText.trim() ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-400 text-gray-600'}`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Conversation;