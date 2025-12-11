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
        name: user.user_metadata?.full_name || user.email.split('@')[0],
        avatar_url: user.user_metadata?.avatar_url
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

  // === FUNGSI LOGOUT YANG DIPERBAIKI ===
  const logout = async () => {
    try {
      // Coba logout server (abaikan jika error 403/network)
      await supabase.auth.signOut();
    } catch (error) {
      console.warn("Logout server error (diabaikan):", error);
    } finally {
      // LANGKAH WAJIB: Bersihkan sisi Client (Browser)
      setCurrentUser(null);
      
      // Hapus token yang nyangkut di Local Storage
      // (Ini membersihkan semua data local storage aplikasi Anda)
      localStorage.clear(); 
      
      // Refresh halaman / Redirect ke Home agar state benar-benar bersih
      window.location.href = '/';
    }
  };

  return { currentUser, loadingAuth, logout };
};