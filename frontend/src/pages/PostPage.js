// src/pages/PostPage.js — Single blog post view
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { usePost, useComments } from "../hooks/usePosts";
import { PageLoader } from "../components/LoadingSkeleton";
import SEO from "../components/SEO";
import api from "../utils/api";
import { toast } from "react-toastify";

const FALLBACK = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200";

export default function PostPage() {
  const { slug } = useParams();
  const { post, loading, error } = usePost(slug);
  const { comments, loading: commentsLoading, refetch: refetchComments } = useComments(post?._id);

  // Like state
  const [liked, setLiked] = useState(() => !!localStorage.getItem(`liked-${slug}`));
  const [likeCount, setLikeCount] = useState(null);

  // Comment form state
  const [form, setForm] = useState({ name: "", email: "", content: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleLike = async () => {
    try {
      const sessionId = localStorage.getItem("sessionId") || Math.random().toString(36).slice(2);
      localStorage.setItem("sessionId", sessionId);

      const { data } = await api.post(`/posts/${post._id}/like`, { sessionId });
      setLiked(data.liked);
      setLikeCount(data.likes);
      if (data.liked) localStorage.setItem(`liked-${slug}`, "1");
      else localStorage.removeItem(`liked-${slug}`);
    } catch {
      toast.error("Could not process like");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.content) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/comments", { postId: post._id, ...form });
      toast.success("Comment posted! 🎮");
      setForm({ name: "", email: "", content: "" });
      refetchComments();
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;
  if (error) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-gaming-muted">
      <span className="text-5xl">😕</span>
      <p className="font-heading text-xl">{error}</p>
      <Link to="/" className="text-gaming-accent-light underline">Go Home</Link>
    </div>
  );

  const imageUrl = post.image?.startsWith("/uploads")
    ? `${process.env.REACT_APP_API_URL?.replace("/api", "")}${post.image}`
    : post.image || FALLBACK;

  return (
    <div className="page-enter pt-16">
      <SEO
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        image={imageUrl}
        type="article"
      />

      {/* ── Hero ── */}
      <div className="relative h-[50vh] overflow-hidden">
        <img src={imageUrl} alt={post.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = FALLBACK; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-gaming-bg via-gaming-bg/60 to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto px-4 -mt-24 relative z-10 pb-16">
        {/* Category */}
        {post.category && (
          <Link
            to={`/category/${post.category.slug}`}
            className="inline-flex items-center gap-1 text-xs font-heading font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4"
            style={{ background: post.category.color + "33", color: post.category.color, border: `1px solid ${post.category.color}66` }}
          >
            {post.category.icon} {post.category.name}
          </Link>
        )}

        {/* Title */}
        <h1 className="font-heading font-bold text-3xl sm:text-4xl text-gaming-text mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gaming-muted mb-6 pb-6 border-b border-gaming-border">
          <span>👤 {post.author?.username}</span>
          <span>📅 {format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
          <span>👁 {post.views} views</span>
          {/* Like button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all text-xs font-bold ${
              liked
                ? "bg-red-500/20 border-red-500/50 text-red-400"
                : "border-gaming-border hover:border-red-500/50 hover:text-red-400"
            }`}
          >
            {liked ? "❤️" : "🤍"} {likeCount ?? (post.likes?.length || 0)}
          </button>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => <span key={tag} className="tag-pill">#{tag}</span>)}
          </div>
        )}

        {/* Body */}
        <article
          className="prose-gaming"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* ── Comments ── */}
        <section className="mt-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-gaming-accent to-gaming-neon rounded-full" />
            <h2 className="font-heading font-bold text-xl text-gaming-text uppercase tracking-wider">
              Comments ({comments.length})
            </h2>
          </div>

          {/* Comment list */}
          {commentsLoading ? (
            <p className="text-gaming-muted text-sm">Loading comments...</p>
          ) : comments.length > 0 ? (
            <div className="space-y-4 mb-8">
              {comments.map((c) => (
                <div key={c._id} className="glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-bold text-gaming-text">{c.name}</span>
                    <span className="text-xs text-gaming-muted">
                      {format(new Date(c.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="text-gaming-muted text-sm">{c.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gaming-muted text-sm mb-8">No comments yet. Be the first! 🎮</p>
          )}

          {/* Comment form */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="font-heading font-bold text-lg text-gaming-text mb-4">Leave a Comment</h3>
            <form onSubmit={handleComment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email *"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <textarea
                placeholder="Write your comment... *"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={4}
                className="input-field resize-none"
                required
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-lg font-heading font-bold text-white text-sm uppercase tracking-wider transition-all disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
              >
                {submitting ? "Posting..." : "Post Comment 🎮"}
              </button>
            </form>
          </div>
        </section>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          background: rgba(10,10,15,0.8);
          border: 1px solid #2a2a3d;
          border-radius: 8px;
          padding: 10px 14px;
          color: #e2e8f0;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus { border-color: #7c3aed; }
        .input-field::placeholder { color: #64748b; }
      `}</style>
    </div>
  );
}
