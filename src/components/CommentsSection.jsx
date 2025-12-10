import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const CommentsSection = ({ recipeId, currentUser, isAdmin }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // State Edit
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Helper ID
  const getCleanId = (id) => {
    if (!id) return null;
    const strId = String(id);
    if (strId.includes('dataset')) return null;
    return parseInt(strId.replace('db-', ''));
  };
  const cleanRecipeId = getCleanId(recipeId);

  // Helper Tanggal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const currentUserName = currentUser?.name || currentUser?.email?.split('@')[0];

  // --- FETCH ---
  const fetchComments = async () => {
    if (!cleanRecipeId) { setLoading(false); return; }
    
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('recipe_id', cleanRecipeId)
      .order('created_at', { ascending: false }); // Yang terbaru/diedit akan di atas

    if (!error) setComments(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchComments(); }, [cleanRecipeId]);

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    setSubmitting(true);

    const { error } = await supabase.from('comments').insert([{
      recipe_id: cleanRecipeId,
      user_name: currentUserName, 
      content: newComment
    }]);

    if (!error) {
      setNewComment('');
      fetchComments();
    } else {
      alert('Gagal: ' + error.message);
    }
    setSubmitting(false);
  };

  // --- DELETE ---
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus komentar ini?")) return;

    const { error } = await supabase.from('comments').delete().eq('id', id);

    if (!error) {
      setComments(comments.filter(c => c.id !== id));
    } else {
      alert("Gagal hapus: " + error.message);
    }
  };

  // --- START EDIT ---
  const startEditing = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.content);
  };

  // --- SAVE EDIT (UPDATE TANGGAL JUGA) ---
  const saveEdit = async (id) => {
    const { error } = await supabase
      .from('comments')
      .update({ 
        content: editText,
        // [BARU] Update tanggal menjadi waktu sekarang
        created_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (!error) {
      setEditingId(null);
      fetchComments(); // Refresh agar urutan dan tanggal terupdate
    } else {
      alert("Gagal update: " + error.message);
    }
  };

  return (
    <div className="comments-section" style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px dashed #eee' }}>
      <h3 style={{ color: '#151e32', marginBottom: '20px' }}>Komentar ({comments.length})</h3>

      {/* INPUT FORM */}
      {currentUser ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={cleanRecipeId ? "Tulis komentar..." : "Komentar nonaktif."}
            disabled={submitting || !cleanRecipeId}
            style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '2px solid #eee', fontFamily: 'Poppins' }}
          />
          <button type="submit" disabled={submitting || !newComment.trim()} style={{ marginTop: '10px', backgroundColor: '#f97316', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '50px', cursor: 'pointer' }}>
            {submitting ? 'Mengirim...' : 'Kirim'}
          </button>
        </form>
      ) : (
        <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '10px', textAlign: 'center', marginBottom: '20px' }}>Login untuk berkomentar.</div>
      )}

      {/* LIST KOMENTAR */}
      {loading ? <p>Memuat...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {comments.map((comment) => {
            const isOwner = currentUser && currentUserName === comment.user_name;
            const canEditOrDelete = isOwner || isAdmin;

            return (
              <div key={comment.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  
                  {/* Info User */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <div style={{ width: '30px', height: '30px', backgroundColor: isOwner ? '#f97316' : '#eee', color: isOwner ? 'white' : '#666', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {comment.user_name ? comment.user_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <strong style={{ color: '#151e32' }}>{comment.user_name}</strong>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#999', marginLeft: '40px' }}>
                      {/* Tanggal akan otomatis berubah jika baru diedit */}
                      {formatDate(comment.created_at)}
                    </div>
                  </div>

                  {/* Tombol Aksi */}
                  {canEditOrDelete && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {editingId === comment.id ? (
                        <>
                          <button onClick={() => saveEdit(comment.id)} style={{ color: 'green', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>Simpan</button>
                          <button onClick={() => setEditingId(null)} style={{ color: 'gray', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>Batal</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEditing(comment)} style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>Edit</button>
                          <button onClick={() => handleDelete(comment.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                            {isAdmin && !isOwner ? "Hapus (Admin)" : "Hapus"}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Konten */}
                <div style={{ marginTop: '10px', paddingLeft: '40px' }}>
                  {editingId === comment.id ? (
                    <textarea 
                      value={editText} 
                      onChange={(e) => setEditText(e.target.value)} 
                      style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ccc' }}
                    />
                  ) : (
                    <p style={{ margin: 0, color: '#555', lineHeight: '1.5' }}>{comment.content}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;