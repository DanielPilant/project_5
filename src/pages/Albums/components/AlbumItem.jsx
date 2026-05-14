import PhotoGrid from "./PhotoGrid.jsx";

export default function AlbumItem({
  album,
  isOpen,
  photos,
  hasMore,
  onToggle,
  onLoadMore,
  onAddPhoto,
  onDeletePhoto,
  onSavePhoto,
}) {
  return (
    <li className="album-item">
      <button
        className="album-item__toggle"
        onClick={() => onToggle(album.id)}
      >
        <span className="album-item__id">ID: {album.id}</span>
        <span className="album-item__title">{album.title}</span>
      </button>
      {isOpen && (
        <div className="album-item__content">
          <PhotoGrid
            albumId={album.id}
            photos={photos}
            hasMore={hasMore}
            onLoadMore={onLoadMore}
            onAddPhoto={onAddPhoto}
            onDeletePhoto={onDeletePhoto}
            onSavePhoto={onSavePhoto}
          />
        </div>
      )}
    </li>
  );
}
