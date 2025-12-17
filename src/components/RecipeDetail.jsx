import React from 'react';
import CommentsSection from './CommentsSection';
import { useModalHistory } from '../hooks/useModalHistory';
import './Detail.css';

const RecipeDetail = ({ recipe, onClose, currentUser, isAdmin, onDelete }) => {
  useModalHistory(onClose, !!recipe);

  if (!recipe) return null;

  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : recipe.ingredients?.split('--').map(item => item.trim()).filter(i => i) || [];

  const steps = Array.isArray(recipe.steps)
    ? recipe.steps
    : recipe.steps?.split('--').map(item => item.trim()).filter(s => s) || [];

  return (
    <div className="glass-overlay" onClick={onClose}>
      <div className="glass-card" onClick={(e) => e.stopPropagation()}>

        <button className="glass-close-btn" onClick={onClose} aria-label="Close">✕</button>

        <div className="glass-scroll-content">

          <div className="glass-header-simple">
            <span className="glass-badge">{recipe.category || "Umum"}</span>
            <h1 className="glass-title">{recipe.title}</h1>
            <div className="glass-meta">
              <span>🗓 {new Date(recipe.created_at || Date.now()).toLocaleDateString("id-ID", { dateStyle: "long" })}</span>
              {recipe.username && <span>👤 oleh {recipe.username}</span>}
            </div>
          </div>

          <div className="glass-body">

            {isAdmin && (
              <div className="glass-admin-box">
                <button 
                  onClick={() => { if(window.confirm('Hapus resep ini secara permanen?')) onDelete(); }} 
                  className="glass-delete-btn"
                >
                  Hapus Resep Ini 🗑️
                </button>
              </div>
            )}

            <div className="glass-grid">

              <div className="glass-section">
                <h3 className="glass-section-title">Bahan-bahan 🥕</h3>
                <ul className="glass-ingredients-list">
                  {ingredients.length > 0 ? ingredients.map((item, i) => (
                    <li key={i} className="glass-ingredient-item">
                      <span className="bullet-check">✔</span> 
                      <span>{item}</span>
                    </li>
                  )) : (
                    <li style={{color:'#aaa', fontStyle:'italic'}}>Tidak ada data bahan.</li>
                  )}
                </ul>
              </div>

              <div className="glass-section">
                <h3 className="glass-section-title">Cara Membuat 🍳</h3>
                <div className="glass-steps-container">
                  {steps.length > 0 ? steps.map((step, i) => (
                    <div key={i} className="glass-step-item">
                      <div className="glass-step-number">{i + 1}</div>
                      <div className="glass-step-text">{step}</div>
                    </div>
                  )) : (
                    <p style={{color:'#aaa', fontStyle:'italic'}}>Tidak ada langkah pembuatan.</p>
                  )}
                </div>
              </div>
            </div>

            {recipe.url && (
              <div className="glass-source-box">
                <p style={{marginBottom:'0.5rem', color:'#aaa'}}>Referensi:</p>
                <a href={recipe.url} target="_blank" rel="noopener noreferrer" className="glass-source-link">
                  Kunjungi Sumber Asli ↗
                </a>
              </div>
            )}

            <div style={{marginTop: '2rem'}}>
              <CommentsSection recipeId={recipe.id} currentUser={currentUser} isAdmin={isAdmin} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;