import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // Helper untuk format data user
    const formatUser = (user) => {
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email.split('@')[0]
      };
    };

    // 1. Cek sesi saat ini
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) setCurrentUser(formatUser(session.user));
      } catch (error) {
        console.error('Auth Check Error:', error);
      } finally {
        setLoadingAuth(false);
      }
    };
    checkSession();

    // 2. Listener perubahan auth (Real-time)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session ? formatUser(session.user) : null);
      setLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return { currentUser, loadingAuth, logout };
};