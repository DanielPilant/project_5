import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUserAlbums, getAlbumPhotos } from "../api.js";

export default function Albums() {
  const { userId } = useParams(); //TODO: learn about this hook
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  // search state for photos of each album to avoid refetching when toggling
  const [searchQuery, setSearchQuery] = useState("");

  // cache photos by album id to avoid refetching
  const [photosByAlbum, setPhotosByAlbum] = useState({});

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getUserAlbums(userId);
        if (!cancelled) setAlbums(data);
      } catch {
        if (!cancelled) setError("Failed to load albums");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function handleToggle(albumId) {
    if (openId === albumId) {
      setOpenId(null);
      return;
    }
    setOpenId(albumId);
    if (photosByAlbum[albumId]) return;
    try {
      const data = await getAlbumPhotos(albumId);
      setPhotosByAlbum((prev) => ({ ...prev, [albumId]: data }));
    } catch {
      setError("Failed to load photos");
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
    <div className="page">
      <h1>Albums</h1>
      <div className="search-container" style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by ID or Title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "8px", width: "100%", maxWidth: "300px" }}
        />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {filteredAlbums.map((album) => (
          <li key={album.id}>
            <button
              className="link-button"
              onClick={() => handleToggle(album.id)}
            >
              {album.title}
            </button>
            {openId === album.id && (
              <div className="photo-grid">
                {!photosByAlbum[album.id] && <p>Loading photos...</p>}
                {photosByAlbum[album.id] &&
                  photosByAlbum[album.id].length === 0 && <p>No photos.</p>}
                {(photosByAlbum[album.id] || []).map((photo) => (
                  <figure key={photo.id}>
                    <img src={photo.thumbnailUrl} alt={photo.title} />
                    <figcaption>{photo.title}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
      {!loading && albums.length === 0 && <p>No albums.</p>}
      {!loading && albums.length > 0 && filteredAlbums.length === 0 && (
        <p>No albums match your search.</p>
      )}
      <Link to="/home">Back to home</Link>
    </div>
  );
}
