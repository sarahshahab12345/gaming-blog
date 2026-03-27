// src/pages/admin/NewCategoryPage.js — Create a new category
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import SEO from "../../components/SEO";
import { toast } from "react-toastify";

const ICONS = ["🎮", "⚔️", "🏎️", "📱", "🧙", "♟️", "⚽", "🎯", "🔫", "🛡️", "🚀", "🏆", "🌍", "💀", "🤖"];
const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#6366f1", "#f59e0b"];

export default function NewCategoryPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "", icon: "🎮", color: "#7c3aed" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) { toast.error("Category name is required"); return; }
    setLoading(true);
    try {
      await api.post("/categories", form);
      toast.success("Category created! 🎮");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter pt-24 pb-16">
      <SEO title="New Category" />
      <div className="max-w-xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl tracking-wider neon-purple">NEW CATEGORY</h1>
          <Link to="/admin/dashboard" className="text-gaming-muted text-sm hover:text-gaming-text">← Back</Link>
        </div>

        {/* Preview */}
        <div className="flex items-center gap-4 glass-card rounded-xl p-4 mb-6">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{ background: form.color + "22", border: `2px solid ${form.color}55` }}>
            {form.icon}
          </div>
          <div>
            <p className="font-heading font-bold text-gaming-text">{form.name || "Category Name"}</p>
            <p className="text-gaming-muted text-xs">{form.description || "Description..."}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Strategy"
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief category description"
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setForm({ ...form, icon })}
                  className={`w-10 h-10 rounded-lg text-xl transition-all ${form.icon === icon ? "ring-2 ring-gaming-accent bg-gaming-accent/20" : "bg-gaming-card hover:bg-gaming-border"}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm({ ...form, color })}
                  className={`w-8 h-8 rounded-lg transition-all ${form.color === color ? "ring-2 ring-white scale-110" : ""}`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-heading font-bold text-white text-sm uppercase tracking-wider disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)" }}
          >
            {loading ? "Creating..." : "Create Category 🎮"}
          </button>
        </form>
      </div>

      <style>{`
        .form-label { display: block; color: #94a3b8; font-family: 'Rajdhani', sans-serif; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
        .form-input { width: 100%; background: rgba(10,10,15,0.8); border: 1px solid #2a2a3d; border-radius: 10px; padding: 10px 14px; color: #e2e8f0; font-size: 0.875rem; outline: none; transition: border-color 0.2s; }
        .form-input:focus { border-color: #7c3aed; }
        .form-input::placeholder { color: #64748b; }
      `}</style>
    </div>
  );
}
