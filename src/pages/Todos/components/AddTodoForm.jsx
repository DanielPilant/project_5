import { useState } from 'react';

export default function AddTodoForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title);
    setTitle('');
  };

  return (
    <form className="album-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <h4 className="album-form__title">Create New Todo</h4>
      <input
        className="albums-search__input"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter todo title..."
        style={{ width: '100%', marginBottom: '10px', boxSizing: 'border-box' }}
      />
      <div style={{ display: 'flex', gap: '5px' }}>
        <button type="submit" className="btn btn--primary">Add</button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}