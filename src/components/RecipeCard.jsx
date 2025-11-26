import React from 'react';

const RecipeCard = ({ title, img }) => {
  return (
    <div className="card">
      <img 
        src={img} 
        alt={title} 
        loading="lazy" /* Performa lebih cepat */
      />
      <div className="card-overlay">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default RecipeCard;