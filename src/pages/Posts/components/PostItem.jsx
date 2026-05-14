import PostComments from './PostComments';

export default function PostItem({ 
  post, index, currentUser,
  isSelected, isEditing, 
  onSelect, onEditStart, onEditSave, onEditCancel, onDelete,
  editTitle, setEditTitle, editBody, setEditBody,
  showComments, onToggleComments, comments, commentsLoading,
  onAddComment, onDeleteComment, onEditComment
}) {
  return (
    <li className="album-item" style={{ border: (isSelected || isEditing) ? '1px solid #6366f1' : '' }}>
      <div className="album-item__content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ flex: 1, fontWeight: (isSelected || isEditing) ? '600' : 'normal', color: (isSelected || isEditing) ? '#a5b4fc' : '#e5e7eb' }}>
            <strong style={{ color: '#818cf8', marginRight: '5px' }}>#{index + 1}</strong>
            <span style={{ fontSize: '0.8rem', color: '#6b7280', marginRight: '5px' }}>(ID: {post.id})</span>
            {post.title}
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button className="btn btn--primary btn--small" onClick={() => onSelect(post.id)}>
              {isSelected ? 'Collapse' : 'Expand'}
            </button>
            <button className="btn btn--ghost btn--small" onClick={() => onEditStart(post)}>Edit</button>
            <button className="btn btn--small" style={{ backgroundColor: '#dc2626', color: 'white', border: 'none' }} onClick={() => onDelete(post.id)}>Delete</button>
          </div>
        </div>

        {isSelected && (
          <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #2d3748' }}>
            <p style={{ color: '#d1d5db', lineHeight: '1.6', marginBottom: '15px', whiteSpace: 'pre-wrap' }}>{post.body}</p>
            
            <button className="btn btn--ghost btn--small" onClick={() => onToggleComments(post.id)}>
              {showComments ? 'Hide Comments' : 'Show Comments'}
            </button>

            {showComments && (
              <PostComments 
                postId={post.id}
                comments={comments}
                loading={commentsLoading}
                currentUser={currentUser}
                onAdd={onAddComment}
                onDelete={onDeleteComment}
                onEdit={onEditComment}
              />
            )}
          </div>
        )}

        {isEditing && (
          <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #2d3748' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'stretch' }}>
              <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Edit Title:</label>
              <input
                className="albums-search__input"
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{ width: '100%', maxWidth: '100%' }}
              />
              <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Edit Content:</label>
              <textarea
                className="albums-search__input"
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                style={{ width: '100%', maxWidth: '100%', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit' }}
              />
              <div style={{ display: 'flex', gap: '5px' }}>
                <button className="btn btn--primary btn--small" onClick={() => onEditSave(post.id)}>Save Changes</button>
                <button className="btn btn--ghost btn--small" onClick={onEditCancel}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}