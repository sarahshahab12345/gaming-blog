// src/components/Pagination.js
export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages } = pagination;

  // Build page number array with ellipsis logic
  const getPages = () => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    const arr = [1];
    if (page > 3) arr.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) arr.push(i);
    if (page < pages - 2) arr.push("...");
    arr.push(pages);
    return arr;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 rounded-lg glass-card text-sm font-heading font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:border-gaming-accent/50 transition-all"
      >
        ← Prev
      </button>

      {/* Page numbers */}
      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="text-gaming-muted px-2">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-10 h-10 rounded-lg text-sm font-heading font-bold transition-all ${
              p === page
                ? "bg-gaming-accent text-white shadow-lg shadow-gaming-accent/30"
                : "glass-card hover:border-gaming-accent/50 text-gaming-muted hover:text-gaming-text"
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="px-4 py-2 rounded-lg glass-card text-sm font-heading font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:border-gaming-accent/50 transition-all"
      >
        Next →
      </button>
    </div>
  );
}
