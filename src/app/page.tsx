//app/page.tsx 
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/fyp');
      } else {
        router.push('/signin');
      }
    }
  }, [user, loading, router]);

  return null;
}