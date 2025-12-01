import React from 'react';

// Menerima prop onClose untuk tombol kembali
const RecipeDetail = ({ recipe, onClose }) => {
  // Guard clause: Jika data belum ada, jangan render apa-apa
  if (!recipe) return null;

  // Helper: Membersihkan teks dari karakter aneh CSV (tanda kutip ganda, spasi berlebih)
  const cleanText = (text) => {
    if (!text) return "";
    return String(text).replace(/^"|"$/g, '').trim(); 
  };

  // Helper: Memastikan data selalu dalam bentuk Array
  const ensureArray = (data) => {
    if (Array.isArray(data)) return data; 
    if (typeof data === 'string') {
      // Jika format CSV dipisah '--', split. Jika tidak, jadikan satu item array.
      return data.includes('--') ? data.split('--') : [data];
    }
    return []; 
  };

  const ingredientsList = ensureArray(recipe.ingredients);
  const stepsList = ensureArray(recipe.steps);

  return (
    <div className="recipe-detail-container">
      
      {/* TOMBOL KEMBALI (Memanggil fungsi onClose dari App.jsx) */}
      <button 
        onClick={onClose}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#f3f4f6',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          fontWeight: 'bold',
          color: '#555',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.9rem',
          transition: 'background 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
      >
        ← Kembali ke Daftar
      </button>

      {/* --- HEADER: GAMBAR & JUDUL --- */}
      <div className="detail-header">
        <div className="detail-img-wrapper">
          {/* Gambar Resep */}
          <img 
            src={recipe.img || "https://placehold.co/600x400?text=No+Image"} 
            alt={recipe.title} 
            // Fallback jika gambar error
            onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Image+Error"; }}
          />
        </div>
        
        <div className="detail-title-info">
          <h1>{recipe.title}</h1>
          <div className="badges">
            <span className="badge orange">
              {recipe.category || 'Umum'}
            </span>
            {recipe.loves && (
              <span className="badge orange">
                ❤️ {recipe.loves} Suka
              </span>
            )}
          </div>
        </div>
      </div>

      {/* --- KONTEN: BAHAN & LANGKAH --- */}
      <div className="detail-content-card">
        <div className="lists-row">
          
          {/* KOLOM BAHAN-BAHAN */}
          <div className="list-column">
            <h3>Bahan-bahan:</h3>
            <ul>
              {ingredientsList.length > 0 ? (
                ingredientsList.map((ing, idx) => {
                  const txt = cleanText(ing);
                  // Hanya tampilkan jika teks tidak kosong
                  return txt ? <li key={idx}>{txt}</li> : null;
                })
              ) : (
                <li>Data bahan tidak tersedia.</li>
              )}
            </ul>
          </div>
          
          {/* KOLOM INFO MASAK & SUMBER */}
          <div className="list-column">
            <h3>Info Masak:</h3>
            <p style={{ lineHeight: '1.6', color: '#555', marginBottom: '15px' }}>
              Resep ini disajikan untuk inspirasi menu harian keluarga. 
              Pastikan bahan dicuci bersih sebelum dimasak.
            </p>
            
            {/* Link Sumber Asli (URL) */}
            {recipe.url && (
              <div style={{ marginTop: '10px' }}>
                <a 
                  href={recipe.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#f97316', 
                    fontWeight: 'bold', 
                    textDecoration: 'none', 
                    borderBottom: '1px dashed #f97316'
                  }}
                >
                  Lihat Sumber Asli &rarr;
                </a>
              </div>
            )}
          </div>
        </div>

        {/* KOLOM LANGKAH-LANGKAH */}
        <div className="steps-section">
          <h3>Langkah-langkah:</h3>
          <ol>
            {stepsList.length > 0 ? (
              stepsList.map((step, idx) => {
                const txt = cleanText(step);
                return txt ? <li key={idx}>{txt}</li> : null;
              })
            ) : (
              <li>Langkah memasak tidak tersedia.</li>
            )}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;