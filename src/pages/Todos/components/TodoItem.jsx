import { useState } from 'react';

export default function TodoItem({ todo, index, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onUpdate(todo.id, editTitle);
    setIsEditing(false);
  };

  return (
    <li className="album-item">
      <div className="album-item__content" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {isEditing ? (
          <div style={{ display: 'flex', gap: '10px', width: '100%', alignItems: 'center' }}>
            <input
              className="albums-search__input"
              style={{ flex: 1, margin: 0 }}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <button className="btn btn--primary btn--small" onClick={handleSave}>Save</button>
            <button className="btn btn--ghost btn--small" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <div style={{ flex: 1, textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#9ca3af' : '#e5e7eb' }}>
              <strong style={{ color: '#818cf8', marginRight: '5px' }}>#{index + 1}</strong> 
              <span style={{ fontSize: '0.85rem', color: '#6b7280', marginRight: '5px' }}>(ID: {todo.id})</span>
              {todo.title}
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <button className="btn btn--ghost btn--small" onClick={() => setIsEditing(true)}>Edit</button>
              <button className="btn btn--small" style={{ backgroundColor: '#dc2626', color: 'white', border: 'none' }} onClick={() => onDelete(todo.id)}>Delete</button>
            </div>
          </>
        )}
      </div>
    </li>
  );
}