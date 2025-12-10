import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './AddRecipeForm.css'; // [PENTING] Import CSS baru

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

    const formattedIngredients = ingredientsText.split('\n').map(l => l.trim()).filter(l => l).join('--');
    const formattedSteps = stepsText.split('\n').map(l => l.trim()).filter(l => l).join('--');

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
    <div className="add-recipe-overlay">
      <div className="add-recipe-card">
        
        {/* 1. Header (Tetap Diam) */}
        <div className="form-header">
          <h2 className="form-title">Tulis Resep Baru</h2>
          <button onClick={onCancel} className="btn-close">&times;</button>
        </div>

        {/* 2. Konten Scrollable */}
        <div className="form-scroll-content">
          <form id="recipeForm" onSubmit={handleSubmit}>
            <div className="form-grid">
              
              {/* KOLOM KIRI (Info Dasar) */}
              <div className="left-column">
                <div className="form-group">
                  <label className="form-label">Judul Resep</label>
                  <input className="form-input" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Ayam Woku Manado" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Kategori</label>
                  <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Link Gambar (URL)</label>
                  <input className="form-input" type="text" value={imgUrl} onChange={e => setImgUrl(e.target.value)} placeholder="https://..." />
                  
                  {/* Preview Gambar Kecil */}
                  <div className="image-preview-box">
                    {imgUrl ? (
                      <img src={imgUrl} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                    ) : (
                      <span>Preview gambar akan muncul di sini</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Sumber Referensi (Opsional)</label>
                  <input className="form-input" type="text" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="https://sumber-resep.com" />
                </div>
              </div>

              {/* KOLOM KANAN (Teks Panjang) */}
              <div className="right-column">
                <div className="form-group">
                  <label className="form-label">Bahan-bahan (Pisahkan dengan Enter)</label>
                  <textarea className="form-textarea" value={ingredientsText} onChange={e => setIngredientsText(e.target.value)} required placeholder="- 500gr Ayam&#10;- 2 siung Bawang Putih&#10;- Garam secukupnya" />
                </div>

                <div className="form-group">
                  <label className="form-label">Cara Membuat (Pisahkan dengan Enter)</label>
                  <textarea className="form-textarea" value={stepsText} onChange={e => setStepsText(e.target.value)} required placeholder="1. Cuci bersih ayam...&#10;2. Tumis bumbu halus...&#10;3. Masukkan ayam..." />
                </div>
              </div>

            </div>
          </form>
        </div>

        {/* 3. Footer (Tombol Simpan) */}
        <div className="form-footer">
          <button type="submit" form="recipeForm" className="btn-submit" disabled={loading}>
            {loading ? 'Sedang Menyimpan...' : 'Terbitkan Resep ✨'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddRecipeForm;