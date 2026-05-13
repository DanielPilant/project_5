import { useState } from "react";

export default function AddPhotoForm({ albumId, onAdd }) {
  const [newPhotoTitle, setNewPhotoTitle] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!newPhotoTitle.trim() || !newPhotoUrl.trim()) return;

    setIsAddingPhoto(true);
    try {
      await onAdd(albumId, newPhotoTitle, newPhotoUrl);
      setNewPhotoTitle("");
      setNewPhotoUrl("");
    } catch {
      // error is surfaced by the parent
    } finally {
      setIsAddingPhoto(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="album-form">
      <h4 className="album-form__title">Add Photo to Album</h4>
      <input
        type="text"
        placeholder="Photo title"
        value={newPhotoTitle}
        onChange={(e) => setNewPhotoTitle(e.target.value)}
        required
      />
      <input
        type="url"
        placeholder="Image URL"
        value={newPhotoUrl}
        onChange={(e) => setNewPhotoUrl(e.target.value)}
        required
      />
      <button
        type="submit"
        className="btn btn--primary"
        disabled={isAddingPhoto}
      >
        {isAddingPhoto ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
