// src/components/Footer.js
import { Link } from "react-router-dom";
import { useCategories } from "../hooks/usePosts";

export default function Footer() {
  const { categories } = useCategories();

  return (
    <footer className="bg-gaming-surface border-t border-gaming-border mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <span className="text-3xl">🎮</span>
              <span className="font-display text-2xl tracking-widest neon-purple">PIXELGATE</span>
            </Link>
            <p className="text-gaming-muted text-sm leading-relaxed max-w-xs">
              Your ultimate destination for gaming news, reviews, and guides. Stay ahead of the game.
            </p>
            {/* Social links */}
            <div className="flex gap-3 mt-4">
              {[
                { icon: "𝕏", label: "Twitter", href: "#" },
                { icon: "📺", label: "YouTube", href: "#" },
                { icon: "💬", label: "Discord", href: "#" },
                { icon: "📸", label: "Instagram", href: "#" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-gaming-card border border-gaming-border flex items-center justify-center text-gaming-muted hover:border-gaming-accent hover:text-gaming-accent-light transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading font-bold text-gaming-text uppercase tracking-wider mb-4 text-sm">
              Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat._id}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-gaming-muted hover:text-gaming-accent-light text-sm flex items-center gap-2 transition-colors"
                  >
                    <span>{cat.icon}</span> {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading font-bold text-gaming-text uppercase tracking-wider mb-4 text-sm">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/search?q=review", label: "Reviews" },
                { to: "/search?q=guide", label: "Guides" },
                { to: "/admin/login", label: "Admin Login" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-gaming-muted hover:text-gaming-accent-light text-sm transition-colors"
                  >
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gaming-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gaming-muted text-xs">
            © {new Date().getFullYear()} PixelGate. All rights reserved.
          </p>
          <p className="text-gaming-muted text-xs">
            Built with <span className="text-gaming-accent-light">♥</span> for gamers
          </p>
        </div>
      </div>
    </footer>
  );
}
