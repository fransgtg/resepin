import React from 'react';
import CommentsSection from './CommentsSection'; // Pastikan path ini sesuai dengan struktur folder Anda

const RecipeDetail = ({ recipe, onClose, currentUser, onDelete, isAdmin }) => {
  if (!recipe) return null;

  return (
    <div className="recipe-detail-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      padding: '20px', animation: 'fadeIn 0.3s ease-out'
    }}>
      {/* Kartu Modal */}
      <div className="recipe-detail-card" style={{
        backgroundColor: 'white', borderRadius: '25px', width: '100%', maxWidth: '800px',
        maxHeight: '90vh', overflowY: 'auto', padding: '40px', position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        
        {/* Tombol Close (X) */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '25px', right: '25px',
          background: 'white', border: '1px solid #eee', borderRadius: '50%', width: '40px', height: '40px',
          fontSize: '1.5rem', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)', zIndex: 10
        }}>
          &times;
        </button>

        {/* --- HEADER --- */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span style={{ 
            backgroundColor: '#fff7ed', color: '#c2410c', padding: '6px 16px', 
            borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '0.5px', textTransform: 'uppercase' 
          }}>
            {recipe.category || 'Resep Lezat'}
          </span>
          <h1 style={{ margin: '20px 0 10px', color: '#151e32', fontSize: '2.2rem', fontFamily: 'Poppins, sans-serif' }}>
            {recipe.title}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Diposting pada {new Date(recipe.created_at || Date.now()).toLocaleDateString('id-ID', { dateStyle: 'long' })}
          </p>
        </div>

        {/* --- GAMBAR --- */}
        <div style={{ width: '100%', height: '350px', borderRadius: '20px', overflow: 'hidden', marginBottom: '30px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
          <img 
            src={recipe.img || recipe.image_url || "https://via.placeholder.com/800x400?text=No+Image"} 
            alt={recipe.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            onError={(e) => e.target.src = "https://via.placeholder.com/800x400?text=Image+Error"}
          />
        </div>

        {/* --- TOMBOL ADMIN (Hapus Resep) --- */}
        {isAdmin && (
          <div style={{ marginBottom: '30px', textAlign: 'center', padding: '15px', backgroundColor: '#fee2e2', borderRadius: '15px', border: '1px dashed #ef4444' }}>
            <p style={{ color: '#b91c1c', marginBottom: '10px', fontWeight: 'bold' }}>Area Admin</p>
            <button 
              onClick={onDelete}
              style={{
                backgroundColor: '#ef4444', color: 'white', border: 'none',
                padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)'
              }}
            >
              Hapus Resep Ini
            </button>
          </div>
        )}

        {/* --- KONTEN RESEP (2 Kolom di Layar Besar) --- */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', marginBottom: '40px' }}>
          
          {/* Kolom Kiri: Bahan */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h3 style={{ borderLeft: '4px solid #f97316', paddingLeft: '15px', marginBottom: '20px', color: '#151e32', fontSize: '1.4rem' }}>
              Bahan-bahan
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {recipe.ingredients && recipe.ingredients.map((item, index) => (
                <li key={index} style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9', color: '#475569', display: 'flex', alignItems: 'start' }}>
                  <span style={{ color: '#f97316', marginRight: '10px', fontWeight: 'bold' }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom Kanan: Cara Membuat */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h3 style={{ borderLeft: '4px solid #f97316', paddingLeft: '15px', marginBottom: '20px', color: '#151e32', fontSize: '1.4rem' }}>
              Cara Membuat
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {recipe.steps && recipe.steps.map((step, index) => (
                <div key={index} style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ 
                    minWidth: '32px', height: '32px', backgroundColor: '#f97316', color: 'white', 
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 4px 6px rgba(249, 115, 22, 0.2)'
                  }}>
                    {index + 1}
                  </div>
                  <p style={{ margin: '5px 0 0', color: '#475569', lineHeight: '1.7' }}>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- LINK SUMBER --- */}
        {recipe.url && (
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <a 
              href={recipe.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ color: '#007bff', textDecoration: 'none', borderBottom: '1px solid #007bff', paddingBottom: '2px' }}
            >
              Kunjungi Sumber Asli &rarr;
            </a>
          </div>
        )}

        {/* --- KOMENTAR SECTION --- */}
        {/* Meneruskan props isAdmin agar tombol hapus komentar muncul */}
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