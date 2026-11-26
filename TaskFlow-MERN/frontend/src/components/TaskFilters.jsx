export default function TaskFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  onReset,
}) {
  const hasActiveFilters =
    searchQuery.trim() !== '' || statusFilter !== 'all' || sortBy !== 'newest';

  return (
    <div className="filter-bar">
      <div className="filter-group search-box">
        <label>Search Tasks</label>
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Filter by Status</label>
        <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Sort By</label>
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="deadline">Earliest Deadline</option>
          <option value="priority">Highest Priority</option>
        </select>
      </div>

      {hasActiveFilters && (
        <div className="filter-group align-end">
          <button type="button" className="btn-reset" onClick={onReset}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
}