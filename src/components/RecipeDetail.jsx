import React from 'react';
import './Detail.css'; // Import CSS gabungan
import CommentsSection from './CommentsSection';

const RecipeDetail = ({ recipe, onClose, currentUser, onDelete, isAdmin }) => {
  if (!recipe) return null;

  return (
    <div className="recipe-modal-overlay">
      <div className="recipe-modal-card">
        
        <button onClick={onClose} className="recipe-modal-close-btn">&times;</button>

        {/* HEADER */}
        <div className="recipe-modal-header">
          <span className="recipe-category-badge">{recipe.category || 'Resep Lezat'}</span>
          <h1 className="recipe-modal-title">{recipe.title}</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Diposting pada {new Date(recipe.created_at || Date.now()).toLocaleDateString('id-ID', { dateStyle: 'long' })}
          </p>
        </div>

        {/* GAMBAR */}
        <div className="recipe-image-wrapper">
          <img 
            src={recipe.img || recipe.image_url || "https://via.placeholder.com/800x400?text=No+Image"} 
            alt={recipe.title} 
            className="recipe-modal-img"
            onError={(e) => e.target.src = "https://via.placeholder.com/800x400?text=Image+Error"}
          />
        </div>

        {/* ADMIN PANEL */}
        {isAdmin && (
          <div className="admin-actions-area">
            <p className="admin-label">⚠️ Area Admin</p>
            <button onClick={onDelete} className="btn-delete-recipe">Hapus Resep Ini</button>
          </div>
        )}

        {/* KONTEN */}
        <div className="recipe-content-grid">
          {/* Bahan */}
          <div className="recipe-column">
            <h3 className="section-title">Bahan-bahan</h3>
            <ul className="ingredients-list">
              {recipe.ingredients && recipe.ingredients.map((item, index) => (
                <li key={index} className="ingredient-item">
                  <span className="bullet-point">•</span>{item}
                </li>
              ))}
            </ul>
          </div>

          {/* Langkah */}
          <div className="recipe-column">
            <h3 className="section-title">Cara Membuat</h3>
            <div className="steps-container">
              {recipe.steps && recipe.steps.map((step, index) => (
                <div key={index} className="step-item">
                  <div className="step-number">{index + 1}</div>
                  <p className="step-text">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SUMBER */}
        {recipe.url && (
          <div className="source-link-container">
            <a href={recipe.url} target="_blank" rel="noopener noreferrer" className="source-link">
              Kunjungi Sumber Asli &rarr;
            </a>
          </div>
        )}

        {/* KOMENTAR */}
        <CommentsSection 
          recipeId={recipe.id} 
          currentUser={currentUser} 
          isAdmin={isAdmin} 
        />

      </div>
    </div>
  );
};

export default RecipeDetail;