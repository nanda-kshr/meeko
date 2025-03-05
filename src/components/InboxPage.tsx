import React from 'react';
import { Search, Settings } from 'lucide-react';
import { MOCK_MESSAGES } from '@/utils/mockData';
import { Message } from '@/types/types';

interface InboxPageProps {
  setCurrentMessage: (message: Message | null) => void;
}

const InboxPage: React.FC<InboxPageProps> = ({ setCurrentMessage }) => {
  return (
    <div className="flex-1 p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Inbox</h1>
        <div className="flex items-center">
          <button className="mr-2"><Search size={20} /></button>
          <button><Settings size={20} /></button>
        </div>
      </div>
      <div className="space-y-2">
        {MOCK_MESSAGES.map(message => (
          <div 
            key={message.id}
            className="flex items-center p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
            onClick={() => setCurrentMessage(message)}
          >
            <div className="relative mr-3">
              <img src={message.avatar} alt={message.user} className="w-12 h-12 rounded-full" />
              {message.unread && <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full"></div>}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className={`font-semibold ${message.unread ? 'text-white' : 'text-gray-300'}`}>
                  {message.user}
                </h3>
                <span className="text-xs text-gray-500">{message.time}</span>
              </div>
              <p className={`text-sm truncate ${message.unread ? 'text-gray-300' : 'text-gray-500'}`}>
                {message.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InboxPage;