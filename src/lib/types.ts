import { Timestamp } from 'firebase/firestore'
export interface Story {
    id: string;
    author: {
      id: string;
      name: string;
    };
    title: string;
    content: string;
    genre: string;
    savedAt?: string | Timestamp;
  }

