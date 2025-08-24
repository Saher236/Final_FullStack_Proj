// client/src/components/AdminBlogPage.js

import React, { useEffect, useState } from "react";
import { api } from "../api";
import ProtectedRoute from "./ProtectedRoute";
import PostForm from "./PostForm";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [editingPost, setEditingPost] = useState(null);

  const fetchPosts = () => {
    api.get("/posts/mine/list")
      .then(res => setPosts(res.data))
      .catch(err => { console.error(err); setError("Failed to load posts"); });
  };
  useEffect(() => { fetchPosts(); }, []);

  const handleSave = updated => {
    if (editingPost) setPosts(ps => ps.map(p => p.id === updated.id ? updated : p));
    else setPosts(ps => [updated, ...ps]);
    setEditingPost(null);
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this post?")) return;
    try { await api.delete(`/posts/${id}`); setPosts(ps => ps.filter(p => p.id !== id)); }
    catch (err) { console.error(err); alert("Failed to delete post"); }
  };

  return (
    <ProtectedRoute>
      <div className="container my-4">
        {error && <div className="alert alert-danger">{error}</div>}
        <PostForm post={editingPost} onSave={handleSave} onCancel={() => setEditingPost(null)} />

        <ul className="list-group">
          {posts.map(p => (
            <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{p.title} <small className="text-muted">({p.slug})</small></span>
              <div>
                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setEditingPost(p)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ProtectedRoute>
  );
}

