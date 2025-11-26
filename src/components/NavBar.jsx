import React from 'react';

/* --- IKON SVG --- */
const SearchIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const ChevronDown = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);
// Ikon Log Out (Pintu Keluar)
const LogoutIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

/* --- KOMPONEN NAVBAR --- */
const NavBar = ({ onGoHome, onLoginClick, currentUser, onLogout }) => {
  return (
    <nav className="navbar">
      {/* BAGIAN KIRI: Logo */}
      <div className="navbar-left">
        <div className="logo" onClick={onGoHome} style={{ cursor: 'pointer' }}>
          Resepin
        </div>
      </div>
      
      {/* BAGIAN TENGAH: Search Bar */}
      <div className="navbar-center search-container">
        <input 
          type="text" 
          placeholder="Mau masak apa hari ini?" 
          className="search-input" 
        />
        <button className="search-btn">
          <SearchIcon />
        </button>
      </div>

      {/* BAGIAN KANAN: Menu Navigasi */}
      <div className="navbar-right nav-links">
        <a href="#artikel" className="nav-link">Artikel</a>
        
        <div 
          className="menu-item nav-link" 
          onClick={onGoHome} 
          style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
        >
          Resep <ChevronDown />
        </div>
        
        {/* LOGIKA TOMBOL LOGIN / LOGOUT SEDERHANA */}
        {currentUser ? (
          /* JIKA SUDAH LOGIN: Tampilkan Tombol Log Out Langsung */
          <div 
            className="menu-item login-btn" 
            onClick={onLogout} // Pastikan ini terhubung ke props onLogout
            style={{ 
              backgroundColor: '#ef4444', // Merah
              borderColor: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            title="Klik untuk keluar"
          >
            <LogoutIcon />
            Log Out
          </div>
        ) : (
          /* JIKA BELUM LOGIN: Tampilkan Tombol Login/Register */
          <div 
            className="menu-item login-btn" 
            onClick={onLoginClick}
            style={{ cursor: 'pointer' }}
          >
            Login/Register
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;