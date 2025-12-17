import React from 'react';
import './LockedContent.css';

const LockedContent = ({ onLoginClick }) => {
  return (
    <div className="locked-content">
      <div className="locked-icon">🔐</div>
      
      <h3 className="locked-title">Koleksi Resep Terkunci</h3>
      
      <p className="locked-text">
        Silakan login untuk mengakses ribuan resep nusantara secara gratis dan simpan menu favoritmu.
      </p>
      
      <button 
        className="btn-login-redirect" 
        onClick={onLoginClick}
      >
        Login untuk Melihat Resep
      </button>
    </div>
  );
};

export default LockedContent;