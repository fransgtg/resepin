import React from 'react';

const RecipeDetail = ({ recipe }) => {
  // 1. Guard Clause: Jika data resep kosong/loading, jangan render apa-apa
  // Ini mencegah error "Cannot read property of null"
  if (!recipe) return null;

  // 2. Helper: Membersihkan teks dari karakter aneh CSV (seperti kutip ganda)
  const cleanText = (text) => {
    if (!text) return "";
    return String(text).replace(/^"|"$/g, '').trim(); 
  };

  // 3. Helper: Memastikan data selalu dalam bentuk Array
  // Data CSV kadang terbaca sebagai string panjang "A--B--C". Kita perlu split jadi ["A", "B", "C"]
  const ensureArray = (data) => {
    if (Array.isArray(data)) return data; // Jika sudah array, aman
    if (typeof data === 'string') {
      // Cek apakah pemisahnya '--' (standar dataset kamu) atau ',' atau lainnya
      return data.includes('--') ? data.split('--') : [data];
    }
    return []; // Jika kosong/undefined, kembalikan array kosong biar tidak error di .map
  };

  const ingredientsList = ensureArray(recipe.ingredients);
  const stepsList = ensureArray(recipe.steps);

  return (
    <div className="recipe-detail-container">
      
      {/* --- HEADER (GAMBAR & JUDUL) --- */}
      <div className="detail-header">
        <div className="detail-img-wrapper">
          {/* Gunakan gambar dari data, atau placeholder jika kosong */}
          <img 
            src={recipe.img || "https://placehold.co/600x400?text=No+Image"} 
            alt={recipe.title || "Detail Resep"} 
            // Fallback jika URL gambar error
            onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Image+Error"; }}
          />
        </div>
        
        <div className="detail-title-info">
          {/* ID Resep (Opsional, untuk debug) */}
          <span style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '5px' }}>
            ID: {recipe.id}
          </span>

          <h1>{recipe.title || "Tanpa Judul"}</h1>
          
          <div className="badges">
            {/* Kategori */}
            <span className="badge orange">
              {recipe.category || 'Umum'}
            </span>
            
            {/* Rating / Loves */}
            {recipe.loves && (
              <span className="badge orange">
                ❤️ {recipe.loves} Suka
              </span>
            )}
          </div>
        </div>
      </div>

      {/* --- KONTEN (BAHAN & LANGKAH) --- */}
      <div className="detail-content-card">
        <div className="lists-row">
          
          {/* KOLOM BAHAN */}
          <div className="list-column">
            <h3>Bahan-bahan:</h3>
            <ul>
              {ingredientsList.length > 0 ? (
                ingredientsList.map((ing, idx) => {
                  const txt = cleanText(ing);
                  return txt ? <li key={idx}>{txt}</li> : null;
                })
              ) : (
                <li>Data bahan tidak tersedia.</li>
              )}
            </ul>
          </div>
          
          {/* KOLOM INFO TAMBAHAN / SUMBER */}
          <div className="list-column">
            <h3>Info Masak:</h3>
            <p style={{ lineHeight: '1.6', color: '#555', marginBottom: '15px' }}>
              Resep ini cocok untuk menu harian keluarga. 
              Pastikan bahan dicuci bersih dan sesuaikan rasa dengan selera.
            </p>
            
            {/* Link Sumber Asli (Jika ada di CSV) */}
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