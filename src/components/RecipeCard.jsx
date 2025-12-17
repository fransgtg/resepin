import React from 'react';
import './RecipeGrid.css';

const RecipeCard = ({ title, img, category, loves, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <img src={img} alt={title} loading="lazy" />
      <div className="card-overlay">
        <h3 className="card-title">{title}</h3>
        <div className="card-info">
          <span className="card-badge">
            {category || 'Umum'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;