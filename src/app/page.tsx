// pages/index.tsx (Pages Router) or app/page.tsx (App Router)
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('sr-token');
    if (token) {
      router.push('/following');
    } else {
      router.push('/signin');
    }
  }, [router]);

  return null;
}