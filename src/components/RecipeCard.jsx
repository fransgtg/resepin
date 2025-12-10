import React from 'react';
import './RecipeGrid.css';

const RecipeCard = ({ title, img, category, loves, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      {/* Gambar Resep */}
      <img src={img} alt={title} loading="lazy" />
      
      {/* Overlay Teks di Bawah Gambar */}
      <div className="card-overlay">
        <h3 className="card-title">{title}</h3>
        
        {/* Bagian Info Tambahan (Kategori & Likes) */}
        <div className="card-info">
          {/* Badge Kategori */}
          <span className="card-badge">
            {category || 'Umum'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;