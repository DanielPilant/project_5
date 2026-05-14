export default function TodoFilters({ 
  searchQuery, setSearchQuery, 
  filterStatus, setFilterStatus, 
  sortBy, setSortBy 
}) {
  return (
    <div className="albums-search" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <input
        className="albums-search__input"
        style={{ flex: '1 1 200px' }}
        type="text"
        placeholder="Search by Title or ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <select 
        className="albums-search__input" 
        style={{ width: 'auto', flex: '0 1 auto' }}
        value={filterStatus} 
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="all">Show All</option>
        <option value="completed">Completed Only</option>
        <option value="active">Active Only</option>
      </select>
      
      <select 
        className="albums-search__input" 
        style={{ width: 'auto', flex: '0 1 auto' }}
        value={sortBy} 
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="id">Sort by ID</option>
        <option value="title">Sort by Title (A-Z)</option>
        <option value="completed">Sort by Status</option>
      </select>
    </div>
  );
}