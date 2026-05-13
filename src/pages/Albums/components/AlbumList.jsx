import AlbumItem from "./AlbumItem.jsx";

export default function AlbumList({
  albums,
  openId,
  photosByAlbum,
  hasMoreByAlbum,
  onToggle,
  onLoadMore,
  onAddPhoto,
  onDeletePhoto,
  onSavePhoto,
}) {
  return (
    <ul className="album-list">
      {albums.map((album) => (
        <AlbumItem
          key={album.id}
          album={album}
          isOpen={openId === album.id}
          photos={photosByAlbum[album.id]}
          hasMore={hasMoreByAlbum[album.id]}
          onToggle={onToggle}
          onLoadMore={onLoadMore}
          onAddPhoto={onAddPhoto}
          onDeletePhoto={onDeletePhoto}
          onSavePhoto={onSavePhoto}
        />
      ))}
    </ul>
  );
}
