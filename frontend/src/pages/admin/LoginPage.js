// src/pages/admin/LoginPage.js — Admin login form
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import { toast } from "react-toastify";
import SEO from "../../components/SEO";

export default function LoginPage() {
  const { isAdmin, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      login(data);
      toast.success(`Welcome back, ${data.username}! 🎮`);
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <SEO title="Admin Login" />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gaming-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gaming-neon/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="glass-card rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-5xl block mb-3">🔐</span>
            <h1 className="font-display text-4xl tracking-wider neon-purple">ADMIN</h1>
            <p className="text-gaming-muted text-sm mt-1">Sign in to manage your blog</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gaming-muted text-xs font-heading font-bold uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@gamingblog.com"
                required
                autoComplete="email"
                className="w-full bg-gaming-bg border border-gaming-border rounded-xl px-4 py-3 text-gaming-text placeholder-gaming-muted focus:outline-none focus:border-gaming-accent transition-all"
              />
            </div>

            <div>
              <label className="block text-gaming-muted text-xs font-heading font-bold uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full bg-gaming-bg border border-gaming-border rounded-xl px-4 py-3 text-gaming-text placeholder-gaming-muted focus:outline-none focus:border-gaming-accent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-heading font-bold text-white text-sm uppercase tracking-wider transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                "Sign In 🎮"
              )}
            </button>
          </form>

          <p className="text-center text-gaming-muted text-xs mt-6">
            Default: admin@gamingblog.com / Admin@123456
          </p>
        </div>
      </div>
    </div>
  );
}
