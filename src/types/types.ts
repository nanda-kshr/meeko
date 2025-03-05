export type Story = {
  id: number;
  content: string;
  likes: number;
  comments: number;
  author: string;
  timestamp: string;
};

export type Message = {
  id: number;
  user: string;
  avatar: string;
  lastMessage: string;
  unread: boolean;
  time: string;
};

export type Comment = {
  id: number;
  user: string;
  avatar: string;
  content: string;
  time: string;
};
export type Page = 'fyp' | 'following' | 'post' | 'inbox' | 'saved' | 'comments' | 'signin' | 'signup';
