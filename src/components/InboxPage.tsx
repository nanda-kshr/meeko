import React, { Dispatch, SetStateAction } from 'react';
import { Search, Settings } from 'lucide-react';
import { MOCK_MESSAGES } from '@/utils/mockData';
import { Message, Page } from '@/types/types';

interface InboxPageProps {
  setCurrentMessage: (message: Message | null) => void;
  setCurrentPage: Dispatch<SetStateAction<Page>>;
}

const InboxPage: React.FC<InboxPageProps> = ({ setCurrentMessage, setCurrentPage }) => {
  return (
    <div className="bg-neutral-100 min-h-screen p-6 font-serif">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl border border-neutral-200">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h1 className="text-2xl font-bold text-neutral-800">Inbox</h1>
          <div className="flex items-center space-x-4">
            <button className="text-neutral-600 hover:text-neutral-900 transition-colors">
              <Search size={24} />
            </button>
            <button className="text-neutral-600 hover:text-neutral-900 transition-colors" onClick={() => setCurrentPage('settings')} >
              <Settings size={24} />
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-neutral-200">
          {MOCK_MESSAGES.map(message => (
            <div 
              key={message.id}
              className="flex items-center p-4 hover:bg-neutral-50 cursor-pointer group"
              onClick={() => setCurrentMessage(message)}
            >
              <div className="relative mr-4">
                <img 
                  src={message.avatar} 
                  alt={message.user} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-neutral-300"
                />
                {message.unread && (
                  <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className={`text-lg font-semibold ${message.unread ? 'text-neutral-900' : 'text-neutral-600'}`}>
                    {message.user}
                  </h3>
                  <span className="text-xs text-neutral-500 group-hover:text-neutral-700">
                    {message.time}
                  </span>
                </div>
                <p className={`text-sm ${message.unread ? 'text-neutral-800 font-medium' : 'text-neutral-500'}`}>
                  {message.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InboxPage;