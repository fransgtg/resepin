import React, { useState } from 'react';

const AuthForm = ({ onCancel, onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  
  // State untuk menyimpan inputan form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State untuk pesan sukses registrasi
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isRegister) {
      // --- LOGIKA REGISTRASI ---
      // Di sini seharusnya ada request ke backend untuk simpan user baru.
      // Untuk simulasi, kita anggap sukses dan pindah ke mode Login.
      
      console.log("Registrasi Berhasil:", { name, email });
      setSuccessMessage(`Akun untuk ${name} berhasil dibuat! Silakan Login.`);
      
      // Pindah ke Form Login
      setIsRegister(false);
      
      // Reset password field agar user mengetik ulang saat login
      setPassword('');
      
    } else {
      // --- LOGIKA LOGIN ---
      // Di sini seharusnya ada request ke backend untuk cek kredensial.
      // Untuk simulasi, kita anggap sukses.
      
      const userName = name || (email.split('@')[0] || 'Pengguna');
      onLoginSuccess({ name: userName, email: email });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="btn-close" onClick={onCancel}>&times;</button>
        
        <div className="auth-header">
          <h2>{isRegister ? 'Daftar Akun Baru' : 'Selamat Datang Kembali'}</h2>
          <p>
            {isRegister 
              ? 'Silakan isi data diri Anda untuk bergabung.' 
              : 'Masuk untuk menyimpan resep favorit Anda.'}
          </p>
          
          {/* Tampilkan pesan sukses jika baru saja register */}
          {successMessage && !isRegister && (
            <div style={{ 
              backgroundColor: '#d1fae5', 
              color: '#065f46', 
              padding: '10px', 
              borderRadius: '8px',
              marginBottom: '15px',
              fontSize: '0.9rem'
            }}>
              {successMessage}
            </div>
          )}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input 
                type="text" 
                placeholder="Contoh: Anas Burhan" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="nama@email.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="********" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-submit">
            {isRegister ? 'Daftar Sekarang' : 'Masuk'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isRegister ? 'Sudah punya akun? ' : 'Belum punya akun? '}
            <span 
              className="toggle-link" 
              onClick={() => {
                setIsRegister(!isRegister);
                setSuccessMessage(''); // Hapus pesan jika user pindah manual
              }}
            >
              {isRegister ? 'Login di sini' : 'Daftar di sini'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;