import React from 'react';
import RecipeCard from './RecipeCard';

const RecipeGrid = ({ loading, recipes, searchQuery, activeCategory, onRecipeClick, onAddRecipe }) => {
  
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Sedang menyajikan resep...</p>
      </div>
    );
  }

  return (
    <>
      <h3 style={{ marginBottom: '20px', color: '#151e32', fontFamily: 'Poppins, sans-serif' }}>
        {searchQuery 
          ? `Hasil Pencarian: "${searchQuery}"` 
          : (activeCategory === 'All' ? 'Inspirasi Menu Hari Ini' : `Koleksi ${activeCategory}`)
        }
      </h3>

      <div className="recipe-grid">
        {/* --- KARTU TAMBAH RESEP (SELALU MUNCUL) --- */}
        {/* Sekarang kartu ini muncul terus, baik saat search atau tidak */}
        <div 
          className="card add-recipe-card" 
          onClick={onAddRecipe}
          style={{
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '3px dashed #f97316', 
            backgroundColor: '#fff7ed',   
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{ 
            width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f97316', 
            color: 'white', fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            marginBottom: '15px', paddingBottom: '5px' 
          }}>
            +
          </div>
          <h3 style={{ color: '#f97316', margin: 0, fontSize: '1.1rem' }}>Tulis Resep Baru</h3>
        </div>

        {/* --- DAFTAR RESEP --- */}
        {recipes.length > 0 ? (
          recipes.map((item) => (
            <RecipeCard 
              key={item.id} 
              title={item.title} 
              img={item.img} 
              category={item.category} 
              onClick={() => onRecipeClick(item)} 
            />
          ))
        ) : (
          // Jika tidak ada hasil pencarian, tampilkan pesan TAPI kartu tambah resep tetap ada di atas
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '20px', color: '#888' }}>
            <p>Tidak ada resep lain ditemukan untuk "{searchQuery}".</p>
            <p style={{ fontSize: '0.9rem' }}>Tapi kamu bisa membuatnya sendiri dengan tombol di atas!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default RecipeGrid;