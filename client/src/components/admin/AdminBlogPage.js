// client/src/components/admin/AdminBlogPage.js

import React, { useEffect, useState } from "react";
import { api } from "../../api";
import ProtectedRoute from "../common/ProtectedRoute";

/**
 * Utility: Generate a slug from a string (used for blog URLs).
 */
function slugify(s = "") {
  return s
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * PostForm
 * Internal component for creating or editing a blog post.
 */
function PostForm({ post, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    thumbnail: "",
  });

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title || "",
        slug: post.slug || "",
        content: post.content || "",
        thumbnail: post.thumbnail || "",
      });
    } else {
      setForm({ title: "", slug: "", content: "", thumbnail: "" });
    }
  }, [post]);

  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      slug: form.slug?.trim() ? form.slug.trim() : slugify(form.title),
      thumbnail: form.thumbnail?.trim() || null,
    };

    try {
      const { data } = post
        ? await api.put(`/posts/${post.id}`, payload)
        : await api.post("/posts", payload);

      onSave(data);
      setForm({ title: "", slug: "", content: "", thumbnail: "" });
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  return (
    <div className="card p-3 mb-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h4 className="mb-1">
            {post ? `Edit Post: ${post.title}` : "Add New Post"}
          </h4>
          {post?.slug && (
            <small className="text-muted">Slug: {post.slug}</small>
          )}
        </div>
        {post && (
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>

      <hr />

      <form onSubmit={submit}>
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            name="title"
            className="form-control"
            value={form.title}
            onChange={change}
            placeholder="Enter the blog post title"
            required
          />
        </div>

        {/* Slug */}
        <div className="mb-3">
          <label className="form-label">Slug (optional)</label>
          <input
            name="slug"
            className="form-control"
            value={form.slug}
            onChange={change}
            placeholder="If left blank, will be generated from title"
          />
        </div>

        {/* Content */}
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            name="content"
            className="form-control"
            rows="6"
            value={form.content}
            onChange={change}
            placeholder="Write the blog post content here..."
            required
          />
        </div>

        {/* Thumbnail */}
        <div className="mb-3">
          <label className="form-label">Thumbnail URL (optional)</label>
          <input
            name="thumbnail"
            type="url"
            className="form-control"
            value={form.thumbnail}
            onChange={change}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Actions */}
        <div className="d-flex gap-2">
          <button className="btn btn-success" type="submit">
            {post ? "Save Changes" : "Add Post"}
          </button>
          {onCancel && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

/**
 * AdminBlogPage
 * Allows admin to manage blog posts (CRUD).
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
      .catch(() => setError("Failed to load posts"));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Save new or updated post
  const handleSave = (updated) => {
    if (editingPost) {
      setPosts((ps) => ps.map((p) => (p.id === updated.id ? updated : p)));
      setMessage("✅ Post updated successfully!");
    } else {
      setPosts((ps) => [updated, ...ps]);
      setMessage("✅ Post created successfully!");
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
      setMessage("🗑️ Post deleted successfully!");
    } catch {
      setError("Failed to delete post");
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
        {message && (
          <div className="mb-4 p-3 rounded-md bg-green-100 text-green-700">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700">
            {error}
          </div>
        )}

        {/* Post Form */}
        <PostForm
          post={editingPost}
          onSave={handleSave}
          onCancel={() => setEditingPost(null)}
        />

        {/* Posts List */}
        <ul className="mt-6 divide-y divide-gray-200">
          {posts.map((p) => (
            <li key={p.id} className="flex justify-between items-center py-3">
              <span className="font-medium">
                {p.title} <small className="text-gray-500">({p.slug})</small>
              </span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => setEditingPost(p)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {!posts.length && (
            <li className="py-3 text-gray-500 text-center">No posts yet.</li>
          )}
        </ul>
      </div>
    </ProtectedRoute>
  );
}
