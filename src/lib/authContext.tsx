import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Navigation logic
      if (!currentUser && router.pathname.startsWith('/protected')) {
        router.push('/signin');
      } else if (!currentUser && router.pathname.startsWith('/saved-stories')) {
        router.push('/signin');
      } else if (currentUser && router.pathname === '/signin') {
        router.push('/protected');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}