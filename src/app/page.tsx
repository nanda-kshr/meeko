//app/page.tsx 
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';


export default function Home() {
  const router = useRouter();
  useEffect(() => {
    onAuthStateChanged(auth, (user: User | null) => {
      console.log(user ? 'User signed in' : 'No user');
      if (user) {
        router.push('/fyp');
      } else {
        router.push('/signin');
      }
    });

    
  }, [router]);

  return null;
}