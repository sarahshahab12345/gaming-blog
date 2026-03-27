// src/pages/admin/PostEditorPage.js — Create or Edit a blog post
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../utils/api";
import { useCategories } from "../../hooks/usePosts";
import SEO from "../../components/SEO";
import { toast } from "react-toastify";

const FALLBACK = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400";

export default function PostEditorPage() {
  const { id } = useParams(); // present when editing
  const navigate = useNavigate();
  const isEdit = !!id;

  const { categories } = useCategories();

  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: "",          // comma-separated string in the form
    published: true,
    metaTitle: "",
    metaDescription: "",
    imageUrl: "",      // remote URL option
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(isEdit);

  // Load existing post data when editing
  useEffect(() => {
    if (!isEdit) return;
    api.get("/posts/admin/all").then(({ data }) => {
      const post = data.find((p) => p._id === id);
      if (!post) { toast.error("Post not found"); navigate("/admin/dashboard"); return; }
      setForm({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || "",
        category: post.category?._id || "",
        tags: post.tags?.join(", ") || "",
        published: post.published,
        metaTitle: post.metaTitle || "",
        metaDescription: post.metaDescription || "",
        imageUrl: post.image || "",
      });
      setImagePreview(post.image || "");
    }).catch(() => toast.error("Failed to load post"))
      .finally(() => setFetchingPost(false));
  }, [id, isEdit, navigate]);

  // Show preview when file selected
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content || !form.category) {
      toast.error("Title, content, and category are required");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("excerpt", form.excerpt);
      formData.append("category", form.category);
      formData.append("tags", JSON.stringify(form.tags.split(",").map((t) => t.trim()).filter(Boolean)));
      formData.append("published", form.published);
      formData.append("metaTitle", form.metaTitle);
      formData.append("metaDescription", form.metaDescription);

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (form.imageUrl) {
        formData.append("image", form.imageUrl);
      }

      if (isEdit) {
        await api.put(`/posts/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Post updated! ✅");
      } else {
        await api.post("/posts", formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Post created! 🎮");
      }

      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingPost) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="spinner" />
    </div>
  );

  return (
    <div className="page-enter pt-24 pb-16">
      <SEO title={isEdit ? "Edit Post" : "New Post"} />
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl tracking-wider neon-purple">
              {isEdit ? "EDIT POST" : "NEW POST"}
            </h1>
            <p className="text-gaming-muted text-sm mt-1">
              {isEdit ? "Update your post details" : "Create a new blog post"}
            </p>
          </div>
          <Link
            to="/admin/dashboard"
            className="text-gaming-muted text-sm hover:text-gaming-text transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="form-label">Post Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter an engaging title..."
              className="form-input"
              required
            />
          </div>

          {/* Category & Published */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="form-input" required>
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`relative w-12 h-6 rounded-full transition-all ${form.published ? "bg-gaming-accent" : "bg-gaming-border"}`}
                  onClick={() => setForm((f) => ({ ...f, published: !f.published }))}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.published ? "translate-x-6" : ""}`}
                  />
                </div>
                <span className="font-heading font-bold text-sm text-gaming-text">
                  {form.published ? "Published" : "Draft"}
                </span>
              </label>
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="form-label">Featured Image</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm text-gaming-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gaming-accent/20 file:text-gaming-accent-light file:font-heading file:font-bold file:cursor-pointer hover:file:bg-gaming-accent/40"
                />
                <p className="text-gaming-muted text-xs mt-2">Or paste a URL below:</p>
                <input
                  type="url"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="form-input mt-2"
                />
              </div>
              {/* Preview */}
              {(imagePreview || form.imageUrl) && (
                <img
                  src={imagePreview || form.imageUrl}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-xl border border-gaming-border"
                  onError={(e) => { e.target.src = FALLBACK; }}
                />
              )}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="form-label">Content * (HTML supported)</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={14}
              placeholder="<p>Write your post content here. HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt; are supported.</p>"
              className="form-input font-mono text-sm resize-y"
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="form-label">Excerpt (Short description for cards)</label>
            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              rows={3}
              placeholder="A short description shown on post cards and search results..."
              className="form-input resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="action, gaming, 2024, review"
              className="form-input"
            />
          </div>

          {/* SEO */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-heading font-bold text-gaming-text mb-4 flex items-center gap-2">
              <span>🔍</span> SEO Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="form-label">Meta Title</label>
                <input
                  type="text"
                  name="metaTitle"
                  value={form.metaTitle}
                  onChange={handleChange}
                  placeholder="Leave blank to use post title"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Meta Description</label>
                <textarea
                  name="metaDescription"
                  value={form.metaDescription}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Leave blank to use excerpt"
                  className="form-input resize-none"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-heading font-bold text-white text-sm uppercase tracking-wider transition-all disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}
            >
              {loading ? "Saving..." : isEdit ? "Update Post ✅" : "Publish Post 🎮"}
            </button>
            <Link
              to="/admin/dashboard"
              className="px-6 py-3 rounded-xl font-heading font-bold text-gaming-muted text-sm uppercase tracking-wider border border-gaming-border hover:border-gaming-accent/50 transition-all"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <style>{`
        .form-label {
          display: block;
          color: #94a3b8;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }
        .form-input {
          width: 100%;
          background: rgba(10,10,15,0.8);
          border: 1px solid #2a2a3d;
          border-radius: 10px;
          padding: 10px 14px;
          color: #e2e8f0;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus { border-color: #7c3aed; }
        .form-input::placeholder { color: #64748b; }
        select.form-input option { background: #12121a; }
      `}</style>
    </div>
  );
}
