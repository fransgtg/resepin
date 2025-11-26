import React from 'react';

const RecipeDetail = ({ recipe }) => {
  // Guard clause: Jika data recipe kosong (misal belum loading), jangan render apa-apa
  if (!recipe) return null;

  return (
    <div className="recipe-detail-container">
      {/* --- BAGIAN ATAS: GAMBAR & JUDUL --- */}
      <div className="detail-header">
        <div className="detail-img-wrapper">
          <img src={recipe.img} alt={recipe.title} />
        </div>
        <div className="detail-title-info">
          <h1>{recipe.title}</h1>
          <div className="badges">
            <span className="badge orange">{recipe.time || 'Estimasi -'}</span>
            <span className="badge orange">{recipe.difficulty || 'Mudah'}</span>
          </div>
        </div>
      </div>

      {/* --- BAGIAN BAWAH: KONTEN KARTU --- */}
      <div className="detail-content-card">
        
        {/* Baris Daftar (Bahan & Alat) */}
        <div className="lists-row">
          {/* Kolom Bahan */}
          <div className="list-column">
            <h3>Bahan-bahan:</h3>
            <ul>
              {/* Cek apakah array ingredients ada isinya sebelum di-map */}
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))
              ) : (
                <li>Data bahan belum tersedia.</li>
              )}
            </ul>
          </div>
          
          {/* Kolom Alat */}
          <div className="list-column">
            <h3>Alat-alat:</h3>
            <ul>
              {recipe.tools && recipe.tools.length > 0 ? (
                recipe.tools.map((tool, idx) => (
                  <li key={idx}>{tool}</li>
                ))
              ) : (
                <li>Data alat belum tersedia.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bagian Langkah-langkah */}
        <div className="steps-section">
          <h3>Langkah-langkah:</h3>
          <ol>
            {recipe.steps && recipe.steps.length > 0 ? (
              recipe.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))
            ) : (
              <li>Langkah memasak belum tersedia.</li>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
};

// --- PENTING: Export Default agar bisa di-import di App.jsx ---
export default RecipeDetail;