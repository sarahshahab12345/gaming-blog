// src/pages/admin/DashboardPage.js — Admin control panel
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useCategories } from "../../hooks/usePosts";
import SEO from "../../components/SEO";
import { toast } from "react-toastify";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { categories, loading: catsLoading } = useCategories();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [activeTab, setActiveTab] = useState("posts"); // posts | categories

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const { data } = await api.get("/posts/admin/all");
      setPosts(data);
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDeletePost = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/posts/${id}`);
      toast.success("Post deleted");
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"? Make sure no posts are using it.`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // Stats summary
  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  return (
    <div className="page-enter pt-24 pb-16">
      <SEO title="Admin Dashboard" />
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-4xl tracking-wider neon-purple">DASHBOARD</h1>
            <p className="text-gaming-muted text-sm mt-1">Welcome back, {user?.username} 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/posts/new"
              className="px-5 py-2.5 rounded-xl font-heading font-bold text-white text-sm uppercase tracking-wider transition-all"
              style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
            >
              + New Post
            </Link>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="px-4 py-2.5 rounded-xl font-heading font-bold text-sm text-red-400 border border-red-900/40 hover:bg-red-900/20 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Posts", value: posts.length, icon: "📝", color: "#7c3aed" },
            { label: "Published", value: publishedCount, icon: "✅", color: "#10b981" },
            { label: "Drafts", value: draftCount, icon: "📋", color: "#f59e0b" },
            { label: "Categories", value: categories.length, icon: "🗂", color: "#3b82f6" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: stat.color }} />
              </div>
              <div className="font-display text-4xl tracking-wider" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-gaming-muted text-xs font-heading uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gaming-border pb-4">
          {["posts", "categories"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg font-heading font-bold text-sm uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? "bg-gaming-accent text-white"
                  : "text-gaming-muted hover:text-gaming-text hover:bg-gaming-card"
              }`}
            >
              {tab === "posts" ? "📝 Posts" : "🗂 Categories"}
            </button>
          ))}
        </div>

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div>
            {loadingPosts ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="skeleton h-16 rounded-xl" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 text-gaming-muted">
                <p className="text-4xl mb-3">📝</p>
                <p className="font-heading">No posts yet. Create your first one!</p>
              </div>
            ) : (
              <div className="glass-card rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gaming-border">
                      <th className="text-left px-5 py-3 text-gaming-muted font-heading text-xs uppercase tracking-wider">Title</th>
                      <th className="text-left px-5 py-3 text-gaming-muted font-heading text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                      <th className="text-left px-5 py-3 text-gaming-muted font-heading text-xs uppercase tracking-wider hidden sm:table-cell">Date</th>
                      <th className="text-left px-5 py-3 text-gaming-muted font-heading text-xs uppercase tracking-wider">Status</th>
                      <th className="text-right px-5 py-3 text-gaming-muted font-heading text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr key={post._id} className="border-b border-gaming-border/50 hover:bg-gaming-card/50 transition-colors">
                        <td className="px-5 py-3">
                          <Link
                            to={`/post/${post.slug}`}
                            className="font-heading font-semibold text-gaming-text hover:text-gaming-accent-light transition-colors line-clamp-1"
                            target="_blank"
                          >
                            {post.title}
                          </Link>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell">
                          <span className="text-gaming-muted text-xs">{post.category?.name || "—"}</span>
                        </td>
                        <td className="px-5 py-3 hidden sm:table-cell">
                          <span className="text-gaming-muted text-xs">{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${post.published ? "bg-green-900/40 text-green-400" : "bg-yellow-900/40 text-yellow-400"}`}>
                            {post.published ? "Live" : "Draft"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/posts/edit/${post._id}`}
                              className="text-xs px-3 py-1.5 rounded-lg bg-gaming-accent/20 text-gaming-accent-light hover:bg-gaming-accent/40 transition-all font-heading font-bold"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeletePost(post._id, post.title)}
                              disabled={deletingId === post._id}
                              className="text-xs px-3 py-1.5 rounded-lg bg-red-900/20 text-red-400 hover:bg-red-900/40 transition-all font-heading font-bold disabled:opacity-50"
                            >
                              {deletingId === post._id ? "..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div>
            <div className="flex justify-end mb-4">
              <Link
                to="/admin/categories/new"
                className="px-4 py-2 rounded-lg font-heading font-bold text-sm text-white uppercase tracking-wider transition-all"
                style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
              >
                + New Category
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat._id} className="glass-card rounded-xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ background: cat.color + "22" }}
                    >
                      {cat.icon}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-gaming-text">{cat.name}</p>
                      <p className="text-gaming-muted text-xs">{cat.postCount || 0} posts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat._id, cat.name)}
                    className="text-xs px-2 py-1 rounded bg-red-900/20 text-red-400 hover:bg-red-900/40 transition-all"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
