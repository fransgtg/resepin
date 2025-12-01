import React, { useState } from 'react';

/* --- IKON SVG --- */
const SearchIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

// Ikon Logout (Pintu Keluar)
const LogoutIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const NavBar = ({ 
  onGoHome, 
  onLoginClick, 
  onArticleClick, 
  onRecipeClick, 
  onSearch,
  currentUser, 
  onLogout 
}) => {

  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = (e) => {
    const text = e.target.value;
    setSearchInput(text);
    onSearch(text);        // ⬅ KIRIM DATA KE App.js
  };

  return (
    <nav className="navbar">

      {/* BAGIAN KIRI: LOGO */}
      <div className="navbar-left">
        <div className="logo" onClick={onGoHome} style={{ cursor: 'pointer' }}>
          Resepin
        </div>
      </div>

      {/* BAGIAN TENGAH: SEARCH BAR */}
      <div className="navbar-center search-container">
        <input 
          type="text" 
          placeholder="Mau masak apa hari ini?" 
          className="search-input"
          value={searchInput}
          onChange={handleSearchChange}   // ⬅ REAL-TIME SEARCH
        />
        <button className="search-btn">
          <SearchIcon />
        </button>
      </div>

      {/* BAGIAN KANAN */}
      <div className="navbar-right nav-links">

        <div className="nav-link" onClick={onArticleClick}>
          Artikel
        </div>

        <div className="menu-item nav-link" onClick={onRecipeClick}>
          Resep
        </div>

        {currentUser ? (
          <div 
            className="menu-item login-btn"
            onClick={onLogout}
            style={{
              backgroundColor: '#ef4444',
              borderColor: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <LogoutIcon />
            Log Out
          </div>
        ) : (
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