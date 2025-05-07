
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Clean up auth state
  const cleanupAuthState = () => {
    localStorage.removeItem('supabase.auth.token');
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Defer data fetching to prevent deadlocks
          setTimeout(async () => {
            try {
              const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', currentSession.user.id)
                .single();
              
              if (error) throw error;
              setUserRole(data.role);
            } catch (error) {
              console.error('Error fetching user role:', error);
              setUserRole('user'); // Default to user role
            }
          }, 0);
        } else {
          setUserRole(null);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', currentSession.user.id)
            .single();
          
          if (error) throw error;
          setUserRole(data.role);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Clean up existing state
      cleanupAuthState();
      
      // Sign out globally first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success(`Welcome ${email}!`);
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Clean up existing state
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success('Account created successfully! You can now sign in.');
    } catch (error: any) {
      toast.error(error.message || 'Error signing up');
      console.error('Error signing up:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      // Clean up auth state
      cleanupAuthState();
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
      
      setSession(null);
      setUser(null);
      setUserRole(null);
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = userRole === 'admin';

  return (
    <AuthContext.Provider value={{
      session,
      user,
      userRole,
      isLoading,
      signIn,
      signUp,
      signOut,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
