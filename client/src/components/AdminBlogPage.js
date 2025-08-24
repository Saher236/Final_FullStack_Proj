// client/src/components/AdminBlogPage.js
import React, { useEffect, useState } from "react";
import { api } from "../api";
import ProtectedRoute from "./ProtectedRoute";
import PostForm from "./PostForm";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");   // ✅ הודעת הצלחה
  const [editingPost, setEditingPost] = useState(null);

  const fetchPosts = () => {
    api.get("/posts/mine/list")
      .then(res => setPosts(res.data))
      .catch(err => { 
        console.error(err); 
        setError("❌ Failed to load posts"); 
      });
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSave = updated => {
    if (editingPost) {
      setPosts(ps => ps.map(p => p.id === updated.id ? updated : p));
      setMessage("✅ Post updated successfully!");
    } else {
      setPosts(ps => [updated, ...ps]);
      setMessage("✅ Post created successfully!");
    }
    setEditingPost(null);
    setError("");
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this post?")) return;
    try { 
      await api.delete(`/posts/${id}`); 
      setPosts(ps => ps.filter(p => p.id !== id)); 
      setMessage("🗑️ Post deleted successfully!");
      setError("");
    }
    catch (err) { 
      console.error(err); 
      setError("❌ Failed to delete post"); 
    }
  };

  return (
    <ProtectedRoute>
      <div className="container my-4">
        {/* ✅ הודעות */}
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <PostForm 
          post={editingPost} 
          onSave={handleSave} 
          onCancel={() => setEditingPost(null)} 
        />

        <ul className="list-group">
          {posts.map(p => (
            <li 
              key={p.id} 
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{p.title} <small className="text-muted">({p.slug})</small></span>
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
