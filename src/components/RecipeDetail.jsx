import React, { useEffect } from 'react';
import CommentsSection from './CommentsSection'; // Pastikan file ini ada di folder yang sama

const RecipeDetail = ({ recipe, onClose, currentUser }) => {
  
  // Scroll ke paling atas saat detail dibuka
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!recipe) return null;

  return (
    <div className="recipe-detail-overlay" style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, overflowY: 'auto',
      display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
      paddingTop: '20px', paddingBottom: '20px', backdropFilter: 'blur(5px)'
    }}>
      <div className="recipe-detail-card" style={{
        backgroundColor: 'white', width: '90%', maxWidth: '800px',
        borderRadius: '20px', padding: '30px', position: 'relative',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        
        {/* Tombol Close */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '20px', right: '20px',
            backgroundColor: '#f3f4f6', border: 'none', borderRadius: '50%',
            width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#333'
          }}
        >
          ✕
        </button>

        {/* Header: Kategori & Judul */}
        <span style={{ 
          color: '#f97316', fontWeight: 'bold', textTransform: 'uppercase', 
          fontSize: '0.85rem', letterSpacing: '1px' 
        }}>
          {recipe.category}
        </span>
        <h1 style={{ marginTop: '10px', color: '#151e32', fontFamily: 'Poppins, sans-serif' }}>
          {recipe.title}
        </h1>

        {/* Gambar Resep */}
        <img 
          src={recipe.img} 
          alt={recipe.title} 
          style={{ 
            width: '100%', height: '350px', objectFit: 'cover', 
            borderRadius: '15px', margin: '20px 0' 
          }} 
        />

        {/* Konten Resep (Bahan & Langkah) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
          
          {/* Bahan-bahan */}
          <div className="ingredients">
            <h3 style={{ borderBottom: '3px solid #f97316', display: 'inline-block', marginBottom: '15px', paddingBottom: '5px' }}>
              Bahan-bahan
            </h3>
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#444' }}>
              {recipe.ingredients.map((ing, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>{ing}</li>
              ))}
            </ul>
          </div>

          {/* Langkah-langkah */}
          <div className="steps">
            <h3 style={{ borderBottom: '3px solid #f97316', display: 'inline-block', marginBottom: '15px', paddingBottom: '5px' }}>
              Cara Membuat
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {recipe.steps.map((step, index) => (
                <div key={index} style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ 
                    flexShrink: 0, width: '32px', height: '32px', 
                    backgroundColor: '#f97316', color: 'white', 
                    borderRadius: '50%', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' 
                  }}>
                    {index + 1}
                  </div>
                  <p style={{ margin: 0, lineHeight: '1.6', color: '#444' }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- FITUR KOMENTAR --- */}
        {/* Pastikan props recipeId terisi dengan benar */}
        <CommentsSection recipeId={recipe.id} currentUser={currentUser} />

      </div>
    </div>
  );
};

export default RecipeDetail;