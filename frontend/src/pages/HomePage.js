// src/pages/HomePage.js — Main landing page
import { useState } from "react";
import { Link } from "react-router-dom";
import { usePosts, useCategories } from "../hooks/usePosts";
import PostCard from "../components/PostCard";
import Pagination from "../components/Pagination";
import { PostGridSkeleton, FeaturedSkeleton } from "../components/LoadingSkeleton";
import SEO from "../components/SEO";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const { posts, pagination, loading } = usePosts({ page, limit: 9 });
  const { categories } = useCategories();

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="page-enter">
      <SEO />

      {/* ── Hero Banner ── */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gaming-bg via-gaming-surface to-gaming-bg" />
          {/* Decorative blobs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gaming-accent/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gaming-neon/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "0.5s" }} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gaming-accent/10 border border-gaming-accent/30 text-gaming-accent-light text-xs font-heading font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-gaming-neon animate-pulse" />
            Level Up Your Gaming Knowledge
          </div>

          {/* Headline */}
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl tracking-wider mb-4">
            <span className="neon-purple">PIXEL</span>
            <span className="neon-text">GATE</span>
          </h1>
          <p className="text-gaming-muted text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            News · Reviews · Guides for the modern gamer. Stay ahead of the game.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#latest"
              className="px-8 py-3 rounded-xl font-heading font-bold text-white text-sm uppercase tracking-wider transition-all"
              style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}
            >
              🎮 Latest Posts
            </a>
            <a
              href="#categories"
              className="px-8 py-3 rounded-xl font-heading font-bold text-gaming-text text-sm uppercase tracking-wider border border-gaming-border hover:border-gaming-accent transition-all"
            >
              🗂 Browse Categories
            </a>
          </div>
        </div>
      </section>

      {/* ── Category Pills ── */}
      <section id="categories" className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat.slug}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card border border-gaming-border hover:border-gaming-accent/50 transition-all group"
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="font-heading font-bold text-sm text-gaming-muted group-hover:text-gaming-text transition-colors">
                {cat.name}
              </span>
              {cat.postCount > 0 && (
                <span className="text-xs bg-gaming-accent/20 text-gaming-accent-light px-2 py-0.5 rounded-full">
                  {cat.postCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Post ── */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-gaming-accent to-gaming-neon rounded-full" />
          <h2 className="font-heading font-bold text-2xl text-gaming-text uppercase tracking-wider">
            Featured
          </h2>
        </div>
        {loading ? <FeaturedSkeleton /> : featured && <PostCard post={featured} featured />}
      </section>

      {/* ── Latest Posts Grid ── */}
      <section id="latest" className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-gradient-to-b from-gaming-accent to-gaming-neon rounded-full" />
          <h2 className="font-heading font-bold text-2xl text-gaming-text uppercase tracking-wider">
            Latest Posts
          </h2>
        </div>

        {loading ? (
          <PostGridSkeleton count={6} />
        ) : rest.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gaming-muted">
            <p className="text-5xl mb-4">🎮</p>
            <p className="font-heading text-lg">No posts yet. Check back soon!</p>
          </div>
        )}

        <Pagination pagination={pagination} onPageChange={setPage} />
      </section>
    </div>
  );
}
