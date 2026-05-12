import AddPhotoForm from "./AddPhotoForm.jsx";
import PhotoItem from "./PhotoItem.jsx";

export default function PhotoGrid({
  albumId,
  photos,
  hasMore,
  onLoadMore,
  onAddPhoto,
  onDeletePhoto,
  onSavePhoto,
}) {
  return (
    <>
      <AddPhotoForm albumId={albumId} onAdd={onAddPhoto} />

      <div className="photo-grid">
        {!photos && <p className="photo-grid__empty">Loading photos...</p>}
        {photos && photos.length === 0 && (
          <p className="photo-grid__empty">No photos.</p>
        )}

        {(photos || []).map((photo) => (
          <PhotoItem
            key={photo.id}
            photo={photo}
            onDelete={() => onDeletePhoto(photo.id, albumId)}
            onSave={(newTitle) => onSavePhoto(photo.id, albumId, newTitle)}
          />
        ))}
      </div>

      {hasMore !== false && photos && photos.length > 0 && (
        <div className="load-more">
          <button className="btn btn--ghost" onClick={onLoadMore}>
            Load More Photos
          </button>
        </div>
      )}
    </>
  );
}
