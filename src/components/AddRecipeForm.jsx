import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const AddRecipeForm = ({ onCancel, onSuccess, currentUser }) => {
  const [loading, setLoading] = useState(false);
  
  // State Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Olahan Ayam');
  const [sourceUrl, setSourceUrl] = useState(''); // Link Sumber
  const [imgUrl, setImgUrl] = useState('');       // [BARU] Link Gambar
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

    const formattedIngredients = ingredientsText.split('\n').filter(line => line.trim() !== '').join('--');
    const formattedSteps = stepsText.split('\n').filter(line => line.trim() !== '').join('--');

    const newRecipe = {
      title: title,
      category: category,
      url: sourceUrl,
      image_url: imgUrl, // [BARU] Simpan URL gambar ke kolom image_url
      ingredients: formattedIngredients,
      steps: formattedSteps,
      loves: 0,
      user_id: currentUser.id
    };

    const { error } = await supabase.from('recipes').insert([newRecipe]);

    setLoading(false);

    if (error) {
      alert('Gagal menyimpan resep: ' + error.message);
    } else {
      alert('Resep berhasil diterbitkan!');
      onSuccess();
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '40px 20px', animation: 'fadeIn 0.5s ease-out'
    }}>
      <div className="auth-card" style={{ 
        width: '100%', maxWidth: '700px', textAlign: 'left', position: 'relative', backgroundColor: 'white', borderRadius: '30px', padding: '50px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
      }}>
        
        <button onClick={onCancel} style={{ position: 'absolute', top: '25px', right: '30px', background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: '#999' }}>&times;</button>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: '#151e32', fontSize: '2rem', marginBottom: '10px', fontFamily: 'Poppins, sans-serif' }}>Tulis Resep Baru</h2>
          <p style={{ color: '#666' }}>Bagikan resep lezatmu sesuai format standar.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#151e32' }}>Judul Resep</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Contoh: Ayam Woku Manado" required style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '2px solid #eee', fontSize: '1rem' }} />
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#151e32' }}>Kategori</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '2px solid #eee', fontSize: '1rem', backgroundColor: 'white' }}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            
            <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#151e32' }}>Link Sumber (URL)</label>
              <input type="text" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="https://sumber-resep.com/..." style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '2px solid #eee', fontSize: '1rem' }} />
            </div>
          </div>

          {/* [BARU] Input Link Gambar */}
          <div className="form-group">
            <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#151e32' }}>Link Gambar (URL)</label>
            <input 
              type="text" 
              value={imgUrl} 
              onChange={e => setImgUrl(e.target.value)} 
              placeholder="https://images.unsplash.com/..." 
              style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '2px solid #eee', fontSize: '1rem' }} 
            />
            {imgUrl && (
              <div style={{ marginTop: '10px', width: '100%', height: '200px', borderRadius: '15px', overflow: 'hidden', border: '2px dashed #eee' }}>
                <img src={imgUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>

          <div className="form-group">
            <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#151e32' }}>Bahan-bahan (Tekan Enter untuk baris baru)</label>
            <textarea rows="6" value={ingredientsText} onChange={e => setIngredientsText(e.target.value)} required style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '2px solid #eee', fontFamily: 'Poppins', fontSize: '1rem', resize: 'vertical' }} />
          </div>

          <div className="form-group">
            <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block', color: '#151e32' }}>Cara Membuat (Tekan Enter untuk baris baru)</label>
            <textarea rows="6" value={stepsText} onChange={e => setStepsText(e.target.value)} required style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '2px solid #eee', fontFamily: 'Poppins', fontSize: '1rem', resize: 'vertical' }} />
          </div>

          <button type="submit" disabled={loading} style={{ backgroundColor: '#f97316', color: 'white', padding: '18px', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', marginTop: '20px', transition: '0.3s', boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Menyimpan...' : 'Simpan Resep'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRecipeForm;