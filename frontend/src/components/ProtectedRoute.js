// src/components/ProtectedRoute.js — Redirects to login if not authenticated
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageLoader } from "./LoadingSkeleton";

export default function ProtectedRoute({ children }) {
  const { isAdmin, loading } = useAuth();

  // While checking localStorage token, show loader
  if (loading) return <PageLoader />;

  // Not authenticated: redirect to login
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  return children;
}
