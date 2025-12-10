import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Detail.css'; // Pastikan import CSS ini ada agar style komentar terbaca

const CommentsSection = ({ recipeId, currentUser, isAdmin }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const getCleanId = (id) => {
    if (!id) return null;
    const strId = String(id);
    if (strId.includes('dataset')) return null;
    return parseInt(strId.replace('db-', ''));
  };
  const cleanRecipeId = getCleanId(recipeId);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const currentUserName = currentUser?.name || currentUser?.email?.split('@')[0];

  const fetchComments = async () => {
    if (!cleanRecipeId) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('recipe_id', cleanRecipeId)
      .order('created_at', { ascending: false });

    if (!error) setComments(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchComments(); }, [cleanRecipeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;
    setSubmitting(true);

    const { error } = await supabase.from('comments').insert([{
      recipe_id: cleanRecipeId,
      user_name: currentUserName, 
      content: newComment
    }]);

    if (!error) { setNewComment(''); fetchComments(); } 
    else { alert('Gagal: ' + error.message); }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus komentar ini?")) return;
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (!error) { setComments(comments.filter(c => c.id !== id)); }
    else { alert("Gagal hapus: " + error.message); }
  };

  const startEditing = (comment) => {
    setEditingId(comment.id); setEditText(comment.content);
  };

  const saveEdit = async (id) => {
    const { error } = await supabase
      .from('comments')
      .update({ content: editText, created_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) { setEditingId(null); fetchComments(); }
    else { alert("Gagal update: " + error.message); }
  };

  return (
    <div className="comments-container">
      <h3 className="comments-title">Komentar ({comments.length})</h3>

      {currentUser ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <textarea
            className="comment-input"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={cleanRecipeId ? "Tulis komentar..." : "Komentar nonaktif untuk resep ini."}
            disabled={submitting || !cleanRecipeId}
          />
          <button type="submit" className="btn-submit-comment" disabled={submitting || !newComment.trim()}>
            {submitting ? 'Mengirim...' : 'Kirim Komentar'}
          </button>
        </form>
      ) : (
        <div className="login-alert">
          Silakan <strong>Login</strong> terlebih dahulu untuk ikut berdiskusi.
        </div>
      )}

      {loading ? <p style={{textAlign:'center', color:'#94a3b8'}}>Memuat komentar...</p> : (
        <div className="comments-list">
          {comments.map((comment) => {
            const isOwner = currentUser && currentUserName === comment.user_name;
            const canEditOrDelete = isOwner || isAdmin;

            return (
              <div key={comment.id} className="comment-card">
                <div className="comment-header">
                  <div className="comment-user-info">
                    <div className={`comment-avatar ${isOwner ? 'owner' : ''}`}>
                      {comment.user_name ? comment.user_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <span className="comment-username">{comment.user_name}</span>
                      <span className="comment-date">{formatDate(comment.created_at)}</span>
                    </div>
                  </div>

                  {canEditOrDelete && (
                    <div className="comment-actions">
                      {editingId === comment.id ? (
                        <>
                          <button onClick={() => saveEdit(comment.id)} className="btn-action btn-save">Simpan</button>
                          <button onClick={() => setEditingId(null)} className="btn-action btn-cancel">Batal</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEditing(comment)} className="btn-action btn-edit">Edit</button>
                          <button onClick={() => handleDelete(comment.id)} className="btn-action btn-delete">
                            {isAdmin && !isOwner ? "Hapus (Admin)" : "Hapus"}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {editingId === comment.id ? (
                  <textarea 
                    className="comment-edit-area"
                    value={editText} 
                    onChange={(e) => setEditText(e.target.value)} 
                    rows={3}
                  />
                ) : (
                  <p className="comment-text">{comment.content}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;