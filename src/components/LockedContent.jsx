import React from 'react';

const LockedContent = ({ onLoginClick }) => {
  return (
    <div className="locked-content" style={{ marginTop: '20px', textAlign: 'center', padding: '40px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '20px' }}>
      <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔐</div>
      <h3 style={{ color: '#151e32', marginBottom: '10px' }}>Koleksi Resep Terkunci</h3>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Silakan login untuk mengakses ribuan resep nusantara secara gratis.
      </p>
      <button 
        className="btn-login-redirect" 
        onClick={onLoginClick}
        style={{
          backgroundColor: '#f97316', color: 'white', padding: '12px 30px', 
          border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer'
        }}
      >
        Login untuk Melihat Resep
      </button>
    </div>
  );
};

export default LockedContent;