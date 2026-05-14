export default function PostSearch({ searchQuery, setSearchQuery }) {
  return (
    <div className="albums-search">
      <input
        className="albums-search__input"
        type="text"
        placeholder="Search by Title or ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: '100%', maxWidth: '400px' }}
      />
    </div>
  );
}