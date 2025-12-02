import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthForm = ({ onCancel, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Data Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Khusus register

  // --- LOGIKA BACKEND (SUPABASE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isRegister) {
        // 1. REGISTER
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: { full_name: fullName }, // Simpan nama asli
          },
        });
        if (error) throw error;
        
        alert('Akun berhasil dibuat! Anda otomatis login.');
        
        // Kirim data user ke App.jsx
        if (data.user) {
          onLoginSuccess({
            id: data.user.id,
            email: data.user.email,
            name: fullName || 'User Baru'
          });
        }

      } else {
        // 2. LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (error) throw error;

        // Kirim data user ke App.jsx
        onLoginSuccess({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata.full_name || data.user.email.split('@')[0]
        });
      }
    } catch (error) {
      // Terjemahkan error umum agar enak dibaca
      let msg = error.message;
      if (msg === 'Invalid login credentials') msg = 'Email atau password salah.';
      if (msg === 'User already registered') msg = 'Email ini sudah terdaftar.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      backdropFilter: 'blur(3px)'
    }}>
      <div className="auth-card" style={{
        backgroundColor: 'white', padding: '40px', borderRadius: '20px',
        width: '90%', maxWidth: '400px', textAlign: 'center',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        
        {/* JUDUL */}
        <h2 style={{ color: '#151e32', marginBottom: '10px', fontFamily: 'Poppins, sans-serif' }}>
          {isRegister ? 'Buat Akun' : 'Selamat Datang'}
        </h2>
        <p style={{ color: '#888', marginBottom: '25px', fontSize: '0.9rem' }}>
          {isRegister ? 'Gabung untuk akses resep lengkap.' : 'Silakan login untuk melanjutkan.'}
        </p>

        {/* PESAN ERROR */}
        {errorMsg && (
          <div style={{ 
            backgroundColor: '#fee2e2', color: '#b91c1c', 
            padding: '10px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem' 
          }}>
            {errorMsg}
          </div>
        )}

        {/* FORM INPUT */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Input Nama (Hanya muncul saat Register) */}
          {isRegister && (
            <input 
              type="text" 
              placeholder="Nama Lengkap" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={{ 
                padding: '15px', borderRadius: '12px', border: '1px solid #ddd',
                backgroundColor: '#f9f9f9', fontSize: '1rem'
              }}
            />
          )}

          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ 
              padding: '15px', borderRadius: '12px', border: '1px solid #ddd',
              backgroundColor: '#f9f9f9', fontSize: '1rem'
            }}
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ 
              padding: '15px', borderRadius: '12px', border: '1px solid #ddd',
              backgroundColor: '#f9f9f9', fontSize: '1rem'
            }}
          />

          <button 
            type="submit" 
            disabled={loading}
            style={{
              marginTop: '10px',
              backgroundColor: '#f97316', color: 'white', padding: '15px',
              border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer',
              fontSize: '1rem', transition: '0.3s',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Memproses...' : (isRegister ? 'Daftar Sekarang' : 'Masuk')}
          </button>
        </form>

        {/* FOOTER / TOGGLE */}
        <p style={{ marginTop: '25px', fontSize: '0.9rem', color: '#666' }}>
          {isRegister ? 'Sudah punya akun? ' : 'Belum punya akun? '}
          <span 
            onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }}
            style={{ color: '#f97316', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegister ? 'Login' : 'Daftar'}
          </span>
        </p>

        <button 
          onClick={onCancel}
          style={{
            marginTop: '10px', background: 'none', border: 'none', 
            color: '#999', cursor: 'pointer', fontSize: '0.9rem'
          }}
        >
          Nanti Saja
        </button>
      </div>
    </div>
  );
};

export default AuthForm;