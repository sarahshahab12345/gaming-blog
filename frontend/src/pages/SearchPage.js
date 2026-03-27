// src/pages/SearchPage.js — Search results page
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { usePosts } from "../hooks/usePosts";
import PostCard from "../components/PostCard";
import Pagination from "../components/Pagination";
import { PostGridSkeleton } from "../components/LoadingSkeleton";
import SEO from "../components/SEO";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [inputValue, setInputValue] = useState(query);
  const [page, setPage] = useState(1);

  // Reset page when query changes
  useEffect(() => {
    setPage(1);
    setInputValue(query);
  }, [query]);

  const { posts, pagination, loading } = usePosts({ page, limit: 9, search: query });

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
  };

  return (
    <div className="page-enter pt-24">
      <SEO title={query ? `Search: "${query}"` : "Search"} description="Search gaming articles" />

      <div className="max-w-7xl mx-auto px-4">
        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h1 className="font-display text-4xl tracking-wider neon-purple mb-6">SEARCH</h1>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search posts, games, tags..."
              className="flex-1 bg-gaming-surface border border-gaming-border rounded-xl px-5 py-3 text-gaming-text placeholder-gaming-muted focus:outline-none focus:border-gaming-accent transition-all"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-heading font-bold text-white text-sm uppercase tracking-wider transition-all"
              style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
            >
              Search
            </button>
          </form>
        </div>

        {/* Results header */}
        {query && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-6 bg-gradient-to-b from-gaming-accent to-gaming-neon rounded-full" />
              <h2 className="font-heading font-bold text-xl text-gaming-text">
                Results for <span className="text-gaming-accent-light">"{query}"</span>
              </h2>
            </div>
            {!loading && pagination && (
              <p className="text-gaming-muted text-sm ml-4">
                {pagination.total} result{pagination.total !== 1 ? "s" : ""} found
              </p>
            )}
          </div>
        )}

        {/* Results */}
        {!query ? (
          <div className="text-center py-20 text-gaming-muted">
            <p className="text-5xl mb-4">🔍</p>
            <p className="font-heading text-lg">Type something to search</p>
          </div>
        ) : loading ? (
          <PostGridSkeleton count={6} />
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-gaming-muted">
            <p className="text-5xl mb-4">🎮</p>
            <p className="font-heading text-lg mb-2">No results found for "{query}"</p>
            <p className="text-sm">Try different keywords or browse categories</p>
          </div>
        )}

        <Pagination pagination={pagination} onPageChange={setPage} />
      </div>
    </div>
  );
}
