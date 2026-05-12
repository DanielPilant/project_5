import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { createAlbum, getUserAlbums, getAlbumPhotos } from "../api.js";

export default function Albums() {
  const { userId } = useParams(); //TODO: learn about this hook
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  // search state for photos of each album to avoid refetching when toggling
  const [searchQuery, setSearchQuery] = useState("");

  // photo albums pages
  const [page, setPage] = useState(1);
  const [hasMoreByAlbum, setHasMoreByAlbum] = useState({});

  //CRUD
  // create:
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const filteredAlbums = albums.filter((album) => {
    if (searchQuery.trim() === "") return true;
    const lowerCaseQuery = searchQuery.toLowerCase();
    const matchTitle = album.title.toLowerCase().includes(lowerCaseQuery);
    const matchId = album.id.toString().includes(searchQuery);
    return matchTitle || matchId;
  });

  async function handleAddAlbum(e) {
    e.preventDefault(); // מונע מהדפדפן לרענן את העמוד
    if (!newAlbumTitle.trim()) return;

    setIsSubmitting(true);
    try {
      const newAlbum = await createAlbum(newAlbumTitle, userId);

      setAlbums((prev) => [...prev, newAlbum]);

      setNewAlbumTitle("");
      alert("Album created successfully!");
    } catch (err) {
      setError(`Failed to create album: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h1>Albums</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="search-container" style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by ID or Title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "8px", width: "100%", maxWidth: "300px" }}
        />
      </div>
      <form
        onSubmit={handleAddAlbum}
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #ccc",
        }}
      >
        <h3>Create New Album</h3>
        <input
          type="text"
          placeholder="New album title..."
          value={newAlbumTitle}
          onChange={(e) => setNewAlbumTitle(e.target.value)}
          disabled={isSubmitting}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Add Album"}
        </button>
      </form>
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
              <>
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

                {hasMoreByAlbum[album.id] !== false &&
                  photosByAlbum[album.id] &&
                  photosByAlbum[album.id].length > 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "15px",
                        marginBottom: "15px",
                      }}
                    >
                      <button
                        onClick={handleLoadMore}
                        style={{ padding: "8px 16px", cursor: "pointer" }}
                      >
                        Load More Photos
                      </button>
                    </div>
                  )}
              </>
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
