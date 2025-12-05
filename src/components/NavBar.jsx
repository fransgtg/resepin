import React from 'react';
import './NavBar.css'; 

const NavBar = ({ 
  onGoHome, 
  onLoginClick, 
  onArticleClick, 
  onRecipeClick, 
  onSearch, 
  currentUser, 
  onLogout
}) => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo" onClick={onGoHome}>Resepin</div>
      </div>

      <div className="navbar-center">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Mau masak apa hari ini?" 
            className="search-input"
            onChange={(e) => onSearch(e.target.value)}
          />
          <button className="search-btn">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="navbar-right">
        <span className="nav-link" onClick={onArticleClick}>Artikel</span>
        <span className="nav-link" onClick={onRecipeClick}>Resep</span>
        
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: '#e2e8f0' }}>
              Hi, {currentUser.name ? currentUser.name.split(' ')[0] : 'User'}
            </span>
            <button 
              className="login-btn btn-logout" 
              onClick={onLogout}
              title="Klik untuk keluar"
            >
              Log Out
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={onLoginClick}>
            Login/Register
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;