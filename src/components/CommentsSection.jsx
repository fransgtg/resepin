import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const CommentsSection = ({ recipeId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // --- 1. FETCH KOMENTAR (Saat resep dibuka) ---
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      // Ambil komentar yang ID resepnya cocok dengan resep yang sedang dibuka
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('recipe_id', recipeId) 
        .order('created_at', { ascending: false }); // Urutkan dari yang terbaru

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        setComments(data);
      }
      setLoading(false);
    };

    if (recipeId) fetchComments();
  }, [recipeId]); 

  // --- 2. KIRIM KOMENTAR ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);

    // Tentukan nama pengirim (Nama -> Email -> 'Pengguna')
    // Ini mencegah error jika user tidak punya properti 'name'
    const senderName = currentUser?.name || currentUser?.email?.split('@')[0] || 'Pengguna';

    const commentData = {
      recipe_id: recipeId,
      user_name: senderName, 
      content: newComment
    };

    // Simpan ke database Supabase
    const { data, error } = await supabase
      .from('comments')
      .insert([commentData])
      .select();

    if (error) {
      alert('Gagal mengirim komentar: ' + error.message);
      console.error(error);
    } else {
      // SUKSES: Tambahkan komentar baru ke daftar TAMPILAN (State)
      // Supaya langsung muncul tanpa perlu refresh halaman
      if (data && data.length > 0) {
        setComments([data[0], ...comments]); 
        setNewComment(''); // Bersihkan kolom input
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="comments-section" style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px dashed #eee' }}>
      <h3 style={{ color: '#151e32', marginBottom: '20px' }}>Komentar ({comments.length})</h3>

      {/* --- FORM INPUT --- */}
      {currentUser ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={`Tulis pendapatmu sebagai ${currentUser.name || currentUser.email}...`}
            disabled={submitting}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '15px',
              border: '2px solid #eee',
              minHeight: '100px',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.95rem',
              resize: 'vertical',
              backgroundColor: submitting ? '#f9f9f9' : 'white'
            }}
          />
          <button 
            type="submit"
            disabled={submitting || !newComment.trim()}
            style={{
              marginTop: '10px',
              backgroundColor: submitting ? '#ccc' : '#f97316',
              color: 'white',
              border: 'none',
              padding: '10px 25px',
              borderRadius: '50px',
              fontWeight: 'bold',
              cursor: submitting || !newComment.trim() ? 'not-allowed' : 'pointer',
              transition: '0.3s'
            }}
          >
            {submitting ? 'Mengirim...' : 'Kirim Komentar'}
          </button>
        </form>
      ) : (
        <div style={{ 
          backgroundColor: '#fff3cd', 
          border: '1px solid #ffeeba',
          color: '#856404',
          padding: '15px', 
          borderRadius: '10px', 
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          Silakan <strong>Login</strong> terlebih dahulu untuk menulis komentar.
        </div>
      )}

      {/* --- DAFTAR KOMENTAR --- */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#999' }}>Memuat komentar...</p>
      ) : comments.length > 0 ? (
        <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {comments.map((comment) => (
            <div key={comment.id} style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '15px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    width: '35px', height: '35px', borderRadius: '50%', 
                    backgroundColor: '#f97316', color: 'white', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '0.9rem'
                  }}>
                    {comment.user_name ? comment.user_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <strong style={{ color: '#151e32' }}>{comment.user_name}</strong>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#999' }}>
                  {new Date(comment.created_at).toLocaleDateString('id-ID', { 
                    day: 'numeric', month: 'short', year: 'numeric' 
                  })}
                </span>
              </div>
              <p style={{ margin: 0, color: '#555', lineHeight: '1.6', paddingLeft: '45px' }}>
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px', color: '#888', fontStyle: 'italic' }}>
          <p>Belum ada komentar di resep ini.</p>
          <p>Jadilah yang pertama memberikan ulasan!</p>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;