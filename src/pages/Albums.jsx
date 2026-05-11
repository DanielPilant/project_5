import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getUserAlbums, getAlbumPhotos } from '../api.js';

export default function Albums() {
  const { userId } = useParams();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null);
  const [photosByAlbum, setPhotosByAlbum] = useState({});

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getUserAlbums(userId);
        if (!cancelled) setAlbums(data);
      } catch {
        if (!cancelled) setError('Failed to load albums');
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
      setError('Failed to load photos');
    }
  }

  return (
    <div className="page">
      <h1>Albums</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {albums.map((album) => (
          <li key={album.id}>
            <button className="link-button" onClick={() => handleToggle(album.id)}>
              {album.title}
            </button>
            {openId === album.id && (
              <div className="photo-grid">
                {!photosByAlbum[album.id] && <p>Loading photos...</p>}
                {photosByAlbum[album.id] && photosByAlbum[album.id].length === 0 && (
                  <p>No photos.</p>
                )}
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
      <Link to="/home">Back to home</Link>
    </div>
  );
}
