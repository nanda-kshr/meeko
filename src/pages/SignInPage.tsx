import React, { Dispatch, SetStateAction, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup 
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Page } from '@/types/types';

interface SignInPageProps {
  setCurrentPage: Dispatch<SetStateAction<Page>>;
}

export const SignInPage: React.FC<SignInPageProps> = ({setCurrentPage}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setCurrentPage('fyp');
    } catch {
      alert('SignUp or Try Again Later');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setCurrentPage('fyp');
    } catch {
      alert('Some Error. Try Again Later');
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto flex flex-col items-center">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/20 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl"></div>
        </div>

        {/* Main content */}
        <div className="w-full max-w-md">
          <div className="bg-black/40 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-gray-400 mt-2">Sign in to continue to CidPhish</p>
            </div>

            {/* Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-6">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  placeholder="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/30 pl-12 pr-4 py-4 rounded-xl border border-white/10 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200 outline-none"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/30 pl-12 pr-4 py-4 rounded-xl border border-white/10 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200 outline-none"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-700 p-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <LogIn size={20} />
                Sign In
              </button>
              <p className="text-gray-400">
                Don&apos;t have an account?{' '}
                <button 
                  onClick={() => setCurrentPage('signup')} 
                  className="text-green-400 hover:text-green-300 font-medium transition-colors"
                >
                  Sign Up
                </button>
              </p>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black/40 text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button 
              onClick={handleGoogleSignIn}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
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
              Sign In with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;