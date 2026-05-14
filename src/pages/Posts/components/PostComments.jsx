import { useState } from 'react';

export default function PostComments({ postId, comments, loading, currentUser, onAdd, onDelete, onEdit }) {
  const [newBody, setNewBody] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editBody, setEditBody] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newBody.trim()) return;
    onAdd(postId, newBody);
    setNewBody('');
  };

  const handleEditStart = (comment) => {
    setEditingId(comment.id);
    setEditBody(comment.body);
  };

  const handleEditSave = (commentId) => {
    if (!editBody.trim()) return;
    onEdit(postId, commentId, editBody);
    setEditingId(null);
  };

  return (
    <div style={{ marginTop: '15px', padding: '15px', background: '#0f172a', borderRadius: '8px' }}>
      <h4 style={{ margin: '0 0 15px 0' }}>Comments</h4>
      
      <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
        <textarea
          className="albums-search__input"
          placeholder="Write a comment..."
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          style={{ width: '100%', maxWidth: '100%', minHeight: '60px', margin: 0, resize: 'vertical', fontFamily: 'inherit' }}
        />
        <button type="submit" className="btn btn--primary btn--small" style={{ alignSelf: 'flex-start' }}>Send Comment</button>
      </form>

      {loading && <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Loading comments...</p>}
      
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {(comments || []).map(comment => {
          const isMyComment = comment.email === currentUser.email;
          const isEditingThis = editingId === comment.id;

          return (
            <li key={comment.id} style={{ padding: '10px', background: '#1f2937', borderRadius: '6px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong style={{ color: '#818cf8' }}>{comment.name}</strong>
                <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>{comment.email}</span>
              </div>
              
              {isEditingThis ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  <textarea
                    className="albums-search__input"
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    style={{ width: '100%', maxWidth: '100%', minHeight: '60px', margin: 0, resize: 'vertical', fontFamily: 'inherit' }}
                  />
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button className="btn btn--primary btn--small" onClick={() => handleEditSave(comment.id)}>Save</button>
                    <button className="btn btn--ghost btn--small" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{ margin: '5px 0', color: '#e5e7eb', whiteSpace: 'pre-wrap' }}>{comment.body}</p>
                  {isMyComment && (
                    <div style={{ display: 'flex', gap: '5px', marginTop: '8px' }}>
                      <button className="btn btn--ghost btn--small" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }} onClick={() => handleEditStart(comment)}>Edit</button>
                      <button className="btn btn--ghost btn--small" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', color: '#fca5a5' }} onClick={() => onDelete(postId, comment.id)}>Delete</button>
                    </div>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}