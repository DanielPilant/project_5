import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  createAlbum,
  getAlbumPhotos,
  deletePhoto,
  updatePhoto,
  addPhoto,
} from "./api.js";
import { useAlbums } from "./hooks/useAlbums.js";
import AlbumSearch from "./components/AlbumSearch.jsx";
import CreateAlbumForm from "./components/CreateAlbumForm.jsx";
import AlbumList from "./components/AlbumList.jsx";
import "./albums.css";

export default function Albums() {
  const { userId } = useParams();
  const { albums, setAlbums, loading, error, setError } = useAlbums(userId);

  const [openId, setOpenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [hasMoreByAlbum, setHasMoreByAlbum] = useState({});
  const [photosByAlbum, setPhotosByAlbum] = useState({});

  async function handleToggle(albumId) {
    if (openId === albumId) {
      setOpenId(null);
      return;
    }

    setOpenId(albumId);

    if (photosByAlbum[albumId] && photosByAlbum[albumId].length > 0) {
      setPage(Math.ceil(photosByAlbum[albumId].length / 10));
      return;
    }

    setPage(1);

    try {
      const data = await getAlbumPhotos(albumId, 1);
      setPhotosByAlbum((prev) => ({ ...prev, [albumId]: data }));
      setHasMoreByAlbum((prev) => ({ ...prev, [albumId]: data.length === 10 }));
    } catch {
      setError("Failed to load photos");
    }
  }

  async function handleLoadMore() {
    const nextPage = page + 1;
    try {
      const data = await getAlbumPhotos(openId, nextPage);

      setPhotosByAlbum((prev) => ({
        ...prev,
        [openId]: [...prev[openId], ...data],
      }));

      setPage(nextPage);

      setHasMoreByAlbum((prev) => ({ ...prev, [openId]: data.length === 10 }));
    } catch {
      setError("Failed to load more photos");
    }
  }

  async function handleAddAlbum(title) {
    try {
      const newAlbum = await createAlbum(title, userId);
      setAlbums((prev) => [...prev, newAlbum]);
      alert("Album created successfully!");
    } catch (err) {
      setError(`Failed to create album: ${err.message}`);
      throw err;
    }
  }

  async function handleDeletePhoto(photoId, albumId) {
    try {
      await deletePhoto(photoId);
      setPhotosByAlbum((prev) => ({
        ...prev,
        [albumId]: prev[albumId].filter((p) => p.id !== photoId),
      }));
    } catch {
      alert("Failed to delete photo");
    }
  }

  async function handleSaveEditPhoto(photoId, albumId, newTitle) {
    try {
      const updatedPhoto = await updatePhoto(photoId, { title: newTitle });
      setPhotosByAlbum((prev) => ({
        ...prev,
        [albumId]: prev[albumId].map((p) =>
          p.id === photoId ? updatedPhoto : p,
        ),
      }));
    } catch {
      alert("Failed to update photo");
      throw new Error("Failed to update photo");
    }
  }

  async function handleAddPhoto(albumId, title, url) {
    try {
      const newPhoto = await addPhoto({
        albumId: albumId,
        title: title,
        url: url,
        thumbnailUrl: url,
      });

      setPhotosByAlbum((prev) => ({
        ...prev,
        [albumId]: [newPhoto, ...(prev[albumId] || [])],
      }));
    } catch {
      alert("Failed to add photo");
      throw new Error("Failed to add photo");
    }
  }

  const filteredAlbums = albums.filter((album) => {
    if (searchQuery.trim() === "") return true;
    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchTitle = album.title.toLowerCase().includes(lowerCaseQuery);
    const matchId = album.id.toString().includes(searchQuery);
    return matchTitle || matchId;
  });

  return (
    <div className="albums-page">
      <h1>Albums</h1>
      {loading && <p className="albums-empty">Loading...</p>}
      {error && <p className="error">{error}</p>}
      <AlbumSearch value={searchQuery} onChange={setSearchQuery} />
      <CreateAlbumForm onAdd={handleAddAlbum} />
      <AlbumList
        albums={filteredAlbums}
        openId={openId}
        photosByAlbum={photosByAlbum}
        hasMoreByAlbum={hasMoreByAlbum}
        onToggle={handleToggle}
        onLoadMore={handleLoadMore}
        onAddPhoto={handleAddPhoto}
        onDeletePhoto={handleDeletePhoto}
        onSavePhoto={handleSaveEditPhoto}
      />
      {!loading && albums.length === 0 && (
        <p className="albums-empty">No albums.</p>
      )}
      {!loading && albums.length > 0 && filteredAlbums.length === 0 && (
        <p className="albums-empty">No albums match your search.</p>
      )}
      <Link to="/home" className="back-link">
        Back to home
      </Link>
    </div>
  );
}
