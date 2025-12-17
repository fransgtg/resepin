import React, { useState } from 'react';
import './AuthForm.css';
import { supabase } from '../supabaseClient';

const AuthForm = ({ onCancel, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Data Form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); 

  //LOGIKA BACKEND (SUPABASE)
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
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        
        alert('Akun berhasil dibuat! Anda otomatis login.');
        
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

        onLoginSuccess({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata.full_name || data.user.email.split('@')[0]
        });
      }
    } catch (error) {
      let msg = error.message;
      if (msg === 'Invalid login credentials') msg = 'Email atau password salah.';
      if (msg === 'User already registered') msg = 'Email ini sudah terdaftar.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">

        <h2 className="auth-title">
          {isRegister ? 'Buat Akun' : 'Selamat Datang'}
        </h2>
        <p className="auth-subtitle">
          {isRegister ? 'Gabung untuk akses resep lengkap.' : 'Silakan login untuk melanjutkan.'}
        </p>

        {errorMsg && (
          <div className="auth-error">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">

          {isRegister && (
            <input 
              type="text" 
              placeholder="Nama Lengkap" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="auth-input"
            />
          )}

          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="auth-input"
          />

          <button 
            type="submit" 
            disabled={loading}
            className="auth-btn-submit"
          >
            {loading ? 'Memproses...' : (isRegister ? 'Daftar Sekarang' : 'Masuk')}
          </button>
        </form>

        <p className="auth-footer">
          {isRegister ? 'Sudah punya akun? ' : 'Belum punya akun? '}
          <span 
            onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }}
            className="auth-link"
          >
            {isRegister ? 'Login' : 'Daftar'}
          </span>
        </p>

        <button 
          onClick={onCancel}
          className="auth-btn-cancel"
        >
          Nanti Saja
        </button>
      </div>
    </div>
  );
};

export default AuthForm;