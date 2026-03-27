// src/App.js — Root component: routing & layout
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";

// Admin pages
import LoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import PostEditorPage from "./pages/admin/PostEditorPage";
import NewCategoryPage from "./pages/admin/NewCategoryPage";

// 404 page
function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gaming-muted gap-4">
      <span className="text-8xl">😵</span>
      <h1 className="font-display text-6xl tracking-wider text-gaming-accent">404</h1>
      <p className="font-heading text-xl">Page not found</p>
      <a href="/" className="text-gaming-accent-light underline">Go Home</a>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="dark"
            toastStyle={{ background: "#1a1a27", border: "1px solid #2a2a3d" }}
          />

          {/* Layout wrapper */}
          <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
              <Routes>
                {/* ── Public Routes ── */}
                <Route path="/" element={<HomePage />} />
                <Route path="/post/:slug" element={<PostPage />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/search" element={<SearchPage />} />

                {/* ── Admin Routes ── */}
                <Route path="/admin/login" element={<LoginPage />} />
                <Route
                  path="/admin/dashboard"
                  element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
                />
                <Route
                  path="/admin/posts/new"
                  element={<ProtectedRoute><PostEditorPage /></ProtectedRoute>}
                />
                <Route
                  path="/admin/posts/edit/:id"
                  element={<ProtectedRoute><PostEditorPage /></ProtectedRoute>}
                />
                <Route
                  path="/admin/categories/new"
                  element={<ProtectedRoute><NewCategoryPage /></ProtectedRoute>}
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}
