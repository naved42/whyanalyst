import { useState, useEffect, useContext, createContext, useMemo } from 'react';
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  User,
  getIdToken
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSignedIn: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  getToken: () => Promise<string | null>;
  refreshUser: () => Promise<void>;
  role: 'admin' | 'user';
  status: 'active' | 'loading' | 'unauthenticated';
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isAdmin = useMemo(() => {
    // For now, treat the creator as admin, or use a specific email
    return user?.email === 'muhammadnaveedalijatt786@gmail.com';
  }, [user]);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const getToken = async () => {
    if (!user) return null;
    return await getIdToken(user);
  };

  const refreshUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser }); // Spread to create a new reference and trigger re-render
    }
  };

  const value = {
    user,
    loading,
    isSignedIn: !!user,
    isAdmin,
    signOut,
    getToken,
    refreshUser,
    role: isAdmin ? 'admin' as const : 'user' as const,
    status: loading ? 'loading' as const : (user ? 'active' as const : 'unauthenticated' as const),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

