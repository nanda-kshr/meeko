'use client';
import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';
import Cookies from 'js-cookie';
import { AuthForm } from '@/components/AuthForm';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';
import { useRouter } from 'next/router';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const ref = useRef(null);
  const router = useRouter();
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const textReveal = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const letterAnimation = {
    initial: { y: 100, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      Cookies.set('meeken', token, { expires: 24, secure: true, sameSite: 'strict' });
      window.location.href = '/';
    } catch{
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      const userCredential = await signInWithPopup(auth, googleProvider);
      const token = await userCredential.user.getIdToken();
      Cookies.set('meeken', token, { expires: 24, secure: true, sameSite: 'strict' });
      router.push('/');
    } catch {
      setError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen pt-16 pb-24 md:pb-32 overflow-hidden bg-background text-foreground"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-card/60 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-2xl relative">
            <motion.h2
              className="text-4xl font-bold tracking-tight mb-6 overflow-hidden flex flex-wrap justify-center"
              variants={textReveal}
            >
              {['Welcome', 'to', 'MEEKO'].map((word, i) => (
                <span key={i} className="mr-4 overflow-hidden inline-block">
                  <motion.span
                    className="inline-block bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text"
                    variants={letterAnimation}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </motion.h2>

            <p className="text-center text-muted-foreground mb-8">Your digital companion, ready when you are</p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-center">
                {error}
              </div>
            )}

            <AuthForm
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              onSubmit={handleEmailSignIn}
            />

            <p className="text-center text-muted-foreground mt-6">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => window.location.href = '/signup'}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign Up
              </button>
            </p>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-input"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <GoogleSignInButton onClick={handleGoogleSignIn} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}