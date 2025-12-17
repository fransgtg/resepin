import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useModalHistory } from '../hooks/useModalHistory';
import './AddRecipeForm.css';

const AddRecipeForm = ({ onCancel, onSuccess, currentUser }) => {
  useModalHistory(onCancel, true);

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Olahan Ayam');
  const [sourceUrl, setSourceUrl] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [stepsText, setStepsText] = useState('');

  const categories = [
    "Olahan Ayam","Olahan Ikan","Olahan Kambing","Olahan Sapi",
    "Olahan Tahu","Olahan Telur","Olahan Tempe","Olahan Udang"
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
      alert('Resep Berhasil Diterbitkan! ✨');
      if (onSuccess) onSuccess();
      else onCancel();
    }
  };

  return (
    <div className="dark-glass-overlay" onClick={onCancel}>
      <div className="dark-glass-card" onClick={(e) => e.stopPropagation()}>

        <button className="close-btn-x" onClick={onCancel} aria-label="Close">✕</button>

        <div className="dark-glass-header">
          <h2>Tambah Resep Baru</h2>
          <p>Bagikan resep andalanmu kepada komunitas 📖✨</p>
        </div>

        <div className="dark-glass-scroll">
          <form id="recipeForm" onSubmit={handleSubmit} className="dark-glass-form-grid">
            <div className="form-col">
              <div className="form-group">
                <label>Judul Resep</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Contoh: Ayam Bakar Madu"
                  required
                />
              </div>

              <div className="form-group">
                <label>Kategori</label>
                <div className="select-wrapper">
                  <select 
                    className="form-control"
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Link Gambar (URL)</label>
                <input
                  type="url"
                  className="form-control"
                  value={imgUrl}
                  onChange={e => setImgUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              {imgUrl && (
                <div className="img-preview-box">
                  <img 
                    src={imgUrl} 
                    alt="Preview" 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src="https://via.placeholder.com/400x300?text=Gambar+Error";
                    }} 
                  />
                </div>
              )}

              <div className="form-group">
                <label>Sumber / Referensi (Opsional)</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={sourceUrl} 
                  onChange={e => setSourceUrl(e.target.value)}
                  placeholder="Youtube, Instagram, dll" 
                />
              </div>
            </div>

            <div className="form-col">
              <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label>Bahan-bahan</label>
                <textarea 
                  className="form-control"
                  style={{ flex: 1 }}
                  value={ingredientsText} 
                  onChange={e => setIngredientsText(e.target.value)} 
                  required 
                  placeholder={"- 500gr Ayam Potong\n- 3 Siung Bawang Putih\n- 1 Sdt Garam..."}
                />
              </div>

              <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label>Cara Membuat</label>
                <textarea 
                  className="form-control"
                  style={{ flex: 1 }}
                  value={stepsText} 
                  onChange={e => setStepsText(e.target.value)} 
                  required 
                  placeholder={"1. Cuci bersih ayam...\n2. Haluskan bumbu...\n3. Ungkep ayam hingga matang..."}
                />
              </div>
            </div>

          </form>
        </div>

        <div className="dark-glass-footer">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Batal
          </button>
          <button 
            type="submit" 
            form="recipeForm"
            className="submit-btn" 
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Terbitkan Resep ✨"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecipeForm;