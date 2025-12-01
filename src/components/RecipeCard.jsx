import React from 'react';

const RecipeCard = ({ title, img, category, loves, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      {/* Gambar Resep */}
      <img src={img} alt={title} loading="lazy" />
      
      {/* Overlay Teks di Bawah Gambar */}
      <div className="card-overlay">
        <h3>{title}</h3>
        
        {/* Bagian Info Tambahan (Kategori & Likes) */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '10px', 
          fontSize: '0.85rem', 
          fontWeight: '500',
          color: '#fff' 
        }}>
          {/* Badge Kategori */}
          <span style={{ 
            backgroundColor: '#f97316', 
            padding: '4px 10px', 
            borderRadius: '20px',
            fontSize: '0.75rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {category || 'Umum'}
          </span>

          {/* Info Likes (Hanya tampil jika ada data loves) */}
          {loves ? (
            <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
              ❤️ {loves}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;