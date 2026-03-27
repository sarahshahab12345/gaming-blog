// src/components/PostCard.js — Reusable blog post card
import { Link } from "react-router-dom";
import { format } from "date-fns";

// Fallback image when no image is set
const FALLBACK = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600";

export default function PostCard({ post, featured = false }) {
  const imageUrl = post.image?.startsWith("/uploads")
    ? `${process.env.REACT_APP_API_URL?.replace("/api", "")}${post.image}`
    : post.image || FALLBACK;

  if (featured) {
    return (
      <Link to={`/post/${post.slug}`} className="group block relative overflow-hidden rounded-2xl h-[420px]">
        {/* Background image */}
        <img
          src={imageUrl}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => { e.target.src = FALLBACK; }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Category badge */}
        {post.category && (
          <div className="absolute top-4 left-4">
            <span
              className="text-xs font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full"
              style={{ background: post.category.color + "33", color: post.category.color, border: `1px solid ${post.category.color}66` }}
            >
              {post.category.icon} {post.category.name}
            </span>
          </div>
        )}

        {/* Content at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="font-heading font-bold text-2xl text-white mb-2 group-hover:text-gaming-accent-light transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-gray-300 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>👤 {post.author?.username}</span>
            <span>•</span>
            <span>📅 {format(new Date(post.createdAt), "MMM d, yyyy")}</span>
            <span>•</span>
            <span>👁 {post.views}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/post/${post.slug}`}
      className="group glass-card rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-gaming-accent/40"
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { e.target.src = FALLBACK; }}
        />
        {post.category && (
          <div className="absolute top-3 left-3">
            <span
              className="text-xs font-heading font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ background: post.category.color + "33", color: post.category.color, border: `1px solid ${post.category.color}66` }}
            >
              {post.category.icon} {post.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-heading font-bold text-lg text-gaming-text group-hover:text-gaming-accent-light transition-colors mb-2 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-gaming-muted text-sm line-clamp-3 flex-1 mb-4">{post.excerpt}</p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag-pill">{tag}</span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gaming-muted border-t border-gaming-border pt-3 mt-auto">
          <span>📅 {format(new Date(post.createdAt), "MMM d, yyyy")}</span>
          <div className="flex items-center gap-3">
            <span>👁 {post.views}</span>
            <span>❤️ {post.likeCount || post.likes?.length || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
