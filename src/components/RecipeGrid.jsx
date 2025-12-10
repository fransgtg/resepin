import React from 'react';
import RecipeCard from './RecipeCard';
import './RecipeGrid.css'; // Pastikan import CSS

const RecipeGrid = ({ loading, recipes, searchQuery, activeCategory, onRecipeClick, onAddRecipe }) => {
  
  if (loading) {
    return (
      <div className="grid-loading">
        <p className="grid-loading-text">Sedang menyajikan resep...</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="grid-title">
        {searchQuery 
          ? `Hasil Pencarian: "${searchQuery}"` 
          : (activeCategory === 'All' ? 'Inspirasi Menu Hari Ini' : `Koleksi ${activeCategory}`)
        }
      </h3>

      <div className="recipe-grid">
        {/* --- KARTU TAMBAH RESEP (SELALU MUNCUL) --- */}
        <div 
          className="card add-recipe-card" 
          onClick={onAddRecipe}
        >
          <div className="add-icon-circle">
            +
          </div>
          <h3 className="add-text">Tulis Resep Baru</h3>
        </div>

        {/* --- DAFTAR RESEP --- */}
        {recipes.length > 0 ? (
          recipes.map((item) => (
            <RecipeCard 
              key={item.id} 
              title={item.title} 
              img={item.img} 
              category={item.category}
              // Jika Anda punya properti loves, pass ke sini: loves={item.likes}
              onClick={() => onRecipeClick(item)} 
            />
          ))
        ) : (
          // Jika tidak ada hasil pencarian
          <div className="grid-empty">
            <p>Tidak ada resep lain ditemukan untuk "{searchQuery}".</p>
            <p className="grid-empty-sub">Tapi kamu bisa membuatnya sendiri dengan tombol di atas!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default RecipeGrid;