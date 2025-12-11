import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './AddRecipeForm.css';

const AddRecipeForm = ({ onCancel, onSuccess, currentUser }) => {
  const [loading, setLoading] = useState(false);

  // State Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Olahan Ayam');
  const [sourceUrl, setSourceUrl] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [stepsText, setStepsText] = useState('');

  const categories = [
    "Olahan Ayam", "Olahan Ikan", "Olahan Kambing",
    "Olahan Sapi", "Olahan Tahu", "Olahan Telur",
    "Olahan Tempe", "Olahan Udang"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("Silakan login dulu!");
    setLoading(true);

    const formattedIngredients = ingredientsText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l)
      .join('--');

    const formattedSteps = stepsText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l)
      .join('--');

    const newRecipe = {
      title: title.trim(),
      category,
      url: sourceUrl.trim(),
      image_url: imgUrl.trim(),
      ingredients: formattedIngredients,
      steps: formattedSteps,
      user_id: currentUser.id
    };

    const { error } = await supabase.from('recipes').insert([newRecipe]);
    setLoading(false);

    if (error) {
      alert('Gagal: ' + error.message);
    } else {
      alert('Resep Berhasil Diterbitkan!');
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="dark-glass-overlay">

      {/* Tombol Close */}
      <button className="close-btn-x" onClick={onCancel}>
        ✕
      </button>

      <div className="dark-glass-card">

        {/* HEADER */}
        <div className="dark-glass-header">
          <h2>Tambah Resep Baru</h2>
          <p>Buat resep unggulanmu dan bagikan ke komunitas 📖✨</p>
        </div>

        {/* FORM SCROLL CONTENT */}
        <div className="dark-glass-scroll">
          <form onSubmit={handleSubmit} className="dark-glass-form-grid">

            {/* LEFT COLUMN */}
            <div className="form-col">
              <label>Judul Resep</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Ayam Woku Manado"
                required
              />

              <label>Kategori</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <label>Link Gambar (URL)</label>
              <input
                type="text"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                placeholder="https://..."
              />

              <div className="img-preview-box">
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt="Preview"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                ) : (
                  <span>Preview Gambar</span>
                )}
              </div>

              <label>Sumber Referensi (Opsional)</label>
              <input
                type="text"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://sumber-resep.com"
              />
            </div>

            {/* RIGHT COLUMN */}
            <div className="form-col">
              <label>Bahan-bahan (Enter untuk baris baru)</label>
              <textarea
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                required
                placeholder="- 500gr Ayam\n- 2 siung Bawang Putih"
              />

              <label>Cara Membuat (Enter untuk baris baru)</label>
              <textarea
                value={stepsText}
                onChange={(e) => setStepsText(e.target.value)}
                required
                placeholder="1. Cuci ayam...\n2. Tumis bumbu..."
              />
            </div>

          </form>
        </div>

        {/* FOOTER */}
        <div className="dark-glass-footer">
          <button type="submit" form="recipeForm" className="submit-btn" disabled={loading}>
            {loading ? "Menyimpan..." : "Terbitkan Resep ✨"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddRecipeForm;