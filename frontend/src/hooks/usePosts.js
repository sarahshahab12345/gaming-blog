// src/hooks/usePosts.js — Reusable hooks for fetching data
import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";

// ── Fetch paginated posts ────────────────────────────────────
export function usePosts({ page = 1, limit = 9, category = "", search = "" } = {}) {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit };
      if (category) params.category = category;
      if (search) params.search = search;
      const { data } = await api.get("/posts", { params });
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [page, limit, category, search]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  return { posts, pagination, loading, error, refetch: fetchPosts };
}

// ── Fetch single post by slug ────────────────────────────────
export function usePost(slug) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`/posts/${slug}`)
      .then(({ data }) => setPost(data))
      .catch((err) => setError(err.response?.data?.message || "Post not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  return { post, loading, error };
}

// ── Fetch all categories ─────────────────────────────────────
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories")
      .then(({ data }) => setCategories(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}

// ── Fetch comments for a post ────────────────────────────────
export function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/comments?postId=${postId}`);
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  return { comments, loading, refetch: fetchComments };
}
