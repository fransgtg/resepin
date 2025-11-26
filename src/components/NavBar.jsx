import React from 'react';

// Ikon-ikon kecil kita simpan di dalam komponen yang memakainya agar rapi
const SearchIcon = () => (<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const ChevronDown = () => (<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>);

const Navbar = ({ onGoHome }) => {
  return (
    <nav className="navbar">
      {/* Klik logo reset ke Home */}
      <div className="logo" onClick={onGoHome} style={{ cursor: 'pointer' }}>Resepin</div>
      
      <div className="search-container">
        <input type="text" placeholder="Mau masak apa hari ini?" className="search-input" />
        <button className="search-btn"><SearchIcon /></button>
      </div>

      <div className="nav-links">
        <a href="#artikel">Artikel</a>
        <div className="menu-item" onClick={onGoHome} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          Resep <ChevronDown />
        </div>
        <a href="#login">Login/Register</a>
      </div>
    </nav>
  );
};

export default Navbar;