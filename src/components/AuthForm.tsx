'use client';
import React from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthFormProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="relative">
      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-background/30 pl-12 pr-4 py-4 rounded-xl border border-input focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none text-foreground"
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
        className="w-full bg-background/30 pl-12 pr-4 py-4 rounded-xl border border-input focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 outline-none text-foreground"
        required
      />
    </div>

    <motion.button
      type="submit"
      className="w-full gradient-bg text-primary-foreground px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <LogIn size={20} />
      Sign In
    </motion.button>
  </form>
);