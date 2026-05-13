import { useState } from "react";

export default function PhotoItem({ photo, onDelete, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editPhotoTitle, setEditPhotoTitle] = useState("");

  function startEditing() {
    setEditPhotoTitle(photo.title);
    setIsEditing(true);
  }

  async function handleSave() {
    try {
      await onSave(editPhotoTitle);
      setIsEditing(false);
    } catch {
      // error is surfaced by the parent
    }
  }

  return (
    <figure className="photo-item">
      <button
        type="button"
        className="photo-item__delete"
        onClick={onDelete}
        aria-label="Delete photo"
      >
        ×
      </button>

      <img
        src={photo.thumbnailUrl}
        alt={photo.title}
        className="photo-item__img"
      />

      <figcaption className="photo-item__caption">
        {isEditing ? (
          <div className="photo-item__edit">
            <input
              type="text"
              value={editPhotoTitle}
              onChange={(e) => setEditPhotoTitle(e.target.value)}
            />
            <div className="photo-item__actions">
              <button
                type="button"
                className="btn btn--primary btn--small"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <span className="photo-item__title">{photo.title}</span>
            <div className="photo-item__actions">
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={startEditing}
              >
                Edit
              </button>
            </div>
          </>
        )}
      </figcaption>
    </figure>
  );
}
