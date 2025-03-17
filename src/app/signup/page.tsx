"use client";
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '@/config/firebase';
import { Mail, Lock, User, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';


export default function  SignUpPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName.trim()) {
      alert("Please enter your full name");
      return;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      const token = await userCredential.user.getIdToken();
      Cookies.set('sr-token', token, { expires: 24 }); 
      window.location.href = '/'
    } catch{
      alert('An unexpected error occurred');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const userCredential = await  signInWithPopup(auth, googleProvider);
      const token = await userCredential.user.getIdToken();
      Cookies.set('sr-token', token, { expires: 24 }); 
      window.location.href = '/'
    } catch{
      alert('An unexpected error occurred');
    }
  };

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: [0.175, 0.885, 0.32, 1.275]
      }
    }
  };

  return (
    <motion.section 
      initial="initial"
      animate="animate"
      className="relative min-h-screen pt-16 pb-24 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          variants={textVariants}
          className="max-w-md mx-auto bg-background/70 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-muted-foreground mt-2">Sign up to get started</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-accent/50 pl-12 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-200 outline-none"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-accent/50 pl-12 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-200 outline-none"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-accent/50 pl-12 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-200 outline-none"
                required
                minLength={6}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-accent/50 pl-12 pr-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all duration-200 outline-none"
                required
                minLength={6}
              />
            </div>
            
            <motion.button 
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Create Account
            </motion.button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <motion.button 
              type="button"
              onClick={handleGoogleSignUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-accent/50 hover:bg-accent text-foreground border border-border p-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign Up with Google
            </motion.button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account?{' '}
              <button 
                onClick={() => window.location.href = '/signin'} 
                className="text-primary hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
};