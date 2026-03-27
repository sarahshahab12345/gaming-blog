// src/pages/CategoryPage.js — Posts filtered by category
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import { usePosts } from "../hooks/usePosts";
import PostCard from "../components/PostCard";
import Pagination from "../components/Pagination";
import { PostGridSkeleton } from "../components/LoadingSkeleton";
import SEO from "../components/SEO";

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [page, setPage] = useState(1);

  // Fetch category details
  useEffect(() => {
    setPage(1);
    api.get(`/categories/${slug}`)
      .then(({ data }) => setCategory(data))
      .catch(console.error);
  }, [slug]);

  const { posts, pagination, loading } = usePosts({
    page,
    limit: 9,
    category: category?._id,
  });

  return (
    <div className="page-enter pt-24">
      <SEO
        title={category ? `${category.name} Games` : "Category"}
        description={category?.description || `Browse all ${slug} gaming posts.`}
      />

      <div className="max-w-7xl mx-auto px-4">
        {/* Category header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-gaming-muted text-sm mb-4">
            <Link to="/" className="hover:text-gaming-accent-light transition-colors">Home</Link>
            <span>›</span>
            <span className="text-gaming-text">{category?.name || slug}</span>
          </div>

          <div className="flex items-center gap-4">
            {category && (
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: category.color + "22", border: `2px solid ${category.color}55` }}
              >
                {category.icon}
              </div>
            )}
            <div>
              <h1 className="font-display text-5xl tracking-wider" style={{ color: category?.color || "#a855f7" }}>
                {category?.name?.toUpperCase() || slug.toUpperCase()}
              </h1>
              {category?.description && (
                <p className="text-gaming-muted mt-1">{category.description}</p>
              )}
            </div>
          </div>

          {pagination && (
            <p className="text-gaming-muted text-sm mt-4">
              {pagination.total} post{pagination.total !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* Posts grid */}
        {loading ? (
          <PostGridSkeleton count={6} />
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
        ) : (
          <div className="text-center py-24 text-gaming-muted">
            <p className="text-5xl mb-4">{category?.icon || "🎮"}</p>
            <p className="font-heading text-xl mb-2">No posts in this category yet</p>
            <Link to="/" className="text-gaming-accent-light underline text-sm">← Back to all posts</Link>
          </div>
        )}

        <Pagination pagination={pagination} onPageChange={setPage} />
      </div>
    </div>
  );
}
