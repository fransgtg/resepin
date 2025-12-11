import React from "react";
import RecipeCard from "./RecipeCard";
import "./RecipeGrid.css";

const RecipeGrid = ({
  loading,
  recipes,
  searchQuery,
  activeCategory,
  activeSort,
  onRecipeClick,
  onAddRecipe,
}) => {
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
          : activeCategory === "Perwakilan"
          ? "Inspirasi Menu Hari Ini"
          : activeCategory === "All"
          ? "Semua Resep"
          : `Koleksi ${activeCategory}`}
      </h3>

      <div className="recipe-grid">

        {/* CARD TAMBAH RESEP */}
        {onAddRecipe && (
          <div className="card add-recipe-card" onClick={onAddRecipe}>
            <div className="add-icon-circle">+</div>
            <h3 className="add-text">Tulis Resep Baru</h3>
          </div>
        )}

        {/* LIST RESEP */}
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
          <div className="grid-empty">
            <p>Tidak ada resep ditemukan.</p>
            <p className="grid-empty-sub">Silakan coba filter lain.</p>
          </div>
        )}

      </div>
    </>
  );
};

export default RecipeGrid;