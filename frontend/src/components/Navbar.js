// src/components/Navbar.js — Top navigation bar
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCategories } from "../hooks/usePosts";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { categories } = useCategories();
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Add background when scrolled
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-gaming-bg/95 backdrop-blur-md shadow-lg shadow-gaming-accent/10 border-b border-gaming-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl">🎮</span>
            <span className="font-display text-2xl tracking-widest neon-purple group-hover:neon-text transition-all duration-300">
              PIXELGATE
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className="nav-link">Home</Link>
            {categories.slice(0, 5).map((cat) => (
              <Link key={cat._id} to={`/category/${cat.slug}`} className="nav-link">
                <span className="mr-1">{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games..."
                className="bg-gaming-surface border border-gaming-border rounded-full px-4 py-1.5 pr-10 text-sm text-gaming-text placeholder-gaming-muted focus:outline-none focus:border-gaming-accent transition-all w-48 focus:w-64"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gaming-muted hover:text-gaming-accent-light">
                🔍
              </button>
            </div>
          </form>

          {/* Admin button */}
          <div className="hidden md:flex items-center gap-3">
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" className="btn-ghost text-sm">Dashboard</Link>
                <button onClick={logout} className="btn-ghost text-sm text-red-400">Logout</button>
              </>
            ) : (
              <Link to="/admin/login" className="btn-primary text-sm">Admin</Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-gaming-text p-2"
          >
            <div className="w-6 h-0.5 bg-current mb-1.5 transition-all" style={{ transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <div className="w-6 h-0.5 bg-current mb-1.5 transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
            <div className="w-6 h-0.5 bg-current transition-all" style={{ transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-gaming-surface border-t border-gaming-border px-4 py-4 animate-slide-up">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games..."
                className="w-full bg-gaming-card border border-gaming-border rounded-full px-4 py-2 pr-10 text-sm focus:outline-none focus:border-gaming-accent"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">🔍</button>
            </div>
          </form>
          <div className="flex flex-col gap-2">
            <Link to="/" className="mobile-nav-link">🏠 Home</Link>
            {categories.map((cat) => (
              <Link key={cat._id} to={`/category/${cat.slug}`} className="mobile-nav-link">
                {cat.icon} {cat.name}
              </Link>
            ))}
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" className="mobile-nav-link">⚡ Dashboard</Link>
                <button onClick={logout} className="mobile-nav-link text-left text-red-400">🚪 Logout</button>
              </>
            ) : (
              <Link to="/admin/login" className="mobile-nav-link">🔐 Admin Login</Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        .nav-link {
          color: #94a3b8;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.875rem;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: all 0.2s;
        }
        .nav-link:hover { color: #a855f7; background: rgba(124,58,237,0.1); }
        .mobile-nav-link {
          color: #94a3b8;
          padding: 10px 12px;
          border-radius: 8px;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s;
          display: block;
        }
        .mobile-nav-link:hover { background: rgba(124,58,237,0.1); color: #a855f7; }
        .btn-primary {
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: white;
          padding: 6px 16px;
          border-radius: 6px;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 700;
          letter-spacing: 0.05em;
          transition: all 0.2s;
        }
        .btn-primary:hover { box-shadow: 0 0 15px rgba(124,58,237,0.5); transform: translateY(-1px); }
        .btn-ghost {
          color: #94a3b8;
          padding: 6px 12px;
          border-radius: 6px;
          font-family: 'Rajdhani', sans-serif;
          font-weight: 600;
          transition: all 0.2s;
        }
        .btn-ghost:hover { color: #e2e8f0; background: rgba(255,255,255,0.05); }
      `}</style>
    </nav>
  );
}
