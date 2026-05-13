import { useState } from "react";

export default function CreateAlbumForm({ onAdd }) {
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newAlbumTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd(newAlbumTitle);
      setNewAlbumTitle("");
    } catch {
      // error is surfaced by the parent
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="album-form">
      <h3 className="album-form__title">Create New Album</h3>
      <input
        type="text"
        placeholder="New album title..."
        value={newAlbumTitle}
        onChange={(e) => setNewAlbumTitle(e.target.value)}
        disabled={isSubmitting}
        required
      />
      <button
        type="submit"
        className="btn btn--primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Add Album"}
      </button>
    </form>
  );
}
