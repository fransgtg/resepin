import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './CommentsSection.css'; 

const CommentsSection = ({ recipeId, currentUser, isAdmin }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const cleanId = recipeId ? parseInt(String(recipeId).replace('db-', '')) : null;
  const currentUserName = currentUser?.name || currentUser?.email?.split('@')[0];

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const fetchComments = async () => {
    if (!cleanId) return setLoading(false);

    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('recipe_id', cleanId)
      .order('created_at', { ascending: false });

    setComments(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [cleanId]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);

    await supabase.from('comments').insert([
      {
        recipe_id: cleanId,
        user_name: currentUserName,
        content: newComment,
      },
    ]);

    setNewComment('');
    setSubmitting(false);
    fetchComments();
  };

  const deleteComment = async (id) => {
    if (!window.confirm('Hapus komentar ini?')) return;
    await supabase.from('comments').delete().eq('id', id);
    setComments(comments.filter((c) => c.id !== id));
  };

  const saveEdit = async (id) => {
    await supabase
      .from('comments')
      .update({ content: editText, created_at: new Date().toISOString() })
      .eq('id', id);

    setEditingId(null);
    fetchComments();
  };

  return (
    <div className="glass-comments-wrapper">
      <h3 className="glass-comments-title">💬 Komentar</h3>

      {/* Form komentar */}
      {currentUser ? (
        <form className="glass-comment-form" onSubmit={submitComment}>
          <textarea
            className="glass-input"
            placeholder="Tulis komentar kamu..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>

          <button
            className="glass-btn"
            type="submit"
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? 'Mengirim...' : 'Kirim Komentar'}
          </button>
        </form>
      ) : (
        <div className="glass-login-alert">
          Login untuk ikut berdiskusi 🗨️
        </div>
      )}

      {/* List komentar */}
      {loading ? (
        <p className="glass-loading">Memuat komentar...</p>
      ) : (
        <div className="glass-comments-list">
          {comments.map((comment) => {
            const isOwner = currentUserName === comment.user_name;
            const canEdit = isOwner || isAdmin;

            return (
              <div key={comment.id} className="glass-comment-card">
                <div className="glass-comment-header">
                  <div className="glass-user-info">
                    <div className={`glass-avatar ${isOwner ? 'owner' : ''}`}>
                      {comment.user_name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="glass-username">{comment.user_name}</p>
                      <p className="glass-date">{formatDate(comment.created_at)}</p>
                    </div>
                  </div>

                  {canEdit && (
                    <div className="glass-comment-actions">
                      {editingId === comment.id ? (
                        <>
                          <button onClick={() => saveEdit(comment.id)} className="glass-btn-small green">
                            Simpan
                          </button>
                          <button onClick={() => setEditingId(null)} className="glass-btn-small gray">
                            Batal
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setEditingId(comment.id); setEditText(comment.content); }} className="glass-btn-small blue">
                            Edit
                          </button>
                          <button onClick={() => deleteComment(comment.id)} className="glass-btn-small red">
                            Hapus
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {editingId === comment.id ? (
                  <textarea
                    className="glass-edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                ) : (
                  <p className="glass-comment-text">{comment.content}</p>
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