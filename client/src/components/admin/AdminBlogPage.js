// client/src/components/AdminBlogPage.js

import React, { useEffect, useState } from "react";
import { api } from "../../api";
import ProtectedRoute from "../common/ProtectedRoute";
import PostForm from "../common/blog/PostForm";

/**
 * AdminBlogPage
 * This component allows an admin to manage blog posts.
 * Features:
 * - List all posts created by the admin
 * - Create and edit posts using PostForm
 * - Delete posts with confirmation
 */
export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingPost, setEditingPost] = useState(null);

  // Fetch posts on page load
  const fetchPosts = () => {
    api
      .get("/posts/mine/list")
      .then((res) => setPosts(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load posts");
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Save new or updated post
  const handleSave = (updated) => {
    if (editingPost) {
      setPosts((ps) => ps.map((p) => (p.id === updated.id ? updated : p)));
      setMessage("Post updated successfully!");
    } else {
      setPosts((ps) => [updated, ...ps]);
      setMessage("Post created successfully!");
    }
    setEditingPost(null);
    setError("");
  };

  // Delete a post
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts((ps) => ps.filter((p) => p.id !== id));
      setMessage("Post deleted successfully!");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to delete post");
    }
  };

  return (
    <ProtectedRoute>
      <div className="container my-4">
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Form for creating or editing a post */}
        <PostForm
          post={editingPost}
          onSave={handleSave}
          onCancel={() => setEditingPost(null)}
        />

        {/* List of posts */}
        <ul className="list-group">
          {posts.map((p) => (
            <li
              key={p.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                {p.title} <small className="text-muted">({p.slug})</small>
              </span>
              <div>
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => setEditingPost(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {!posts.length && (
            <li className="list-group-item text-muted">No posts yet.</li>
          )}
        </ul>
      </div>
    </ProtectedRoute>
  );
}
