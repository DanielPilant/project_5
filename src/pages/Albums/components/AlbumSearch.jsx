export default function AlbumSearch({ value, onChange }) {
  return (
    <div className="albums-search">
      <input
        type="text"
        className="albums-search__input"
        placeholder="Search by ID or Title..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
