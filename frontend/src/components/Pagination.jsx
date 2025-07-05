function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '10px' }}>
      <div>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={page === p ? 'submit-button active' : 'submit-button'}
            style={{ margin: '0 5px', padding: '5px 10px', width: 'auto' }}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Pagination;