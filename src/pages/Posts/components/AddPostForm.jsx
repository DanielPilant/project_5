import { useState } from 'react';

export default function AddPostForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    onAdd({ title, body });
    setTitle('');
    setBody('');
  };

  return (
    <form className="album-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <h4 className="album-form__title">Create New Post</h4>
      <input
        className="albums-search__input"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post Title..."
        style={{ width: '100%', maxWidth: '100%', marginBottom: '10px' }}
      />
      <textarea
        className="albums-search__input"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post Content..."
        style={{ width: '100%', maxWidth: '100%', minHeight: '120px', marginBottom: '10px', resize: 'vertical', fontFamily: 'inherit' }}
      />
      <div style={{ display: 'flex', gap: '5px' }}>
        <button type="submit" className="btn btn--primary">Publish Post</button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}