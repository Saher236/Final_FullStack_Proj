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
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {post ? `Edit Post: ${post.title}` : "Add New Post"}
      </h3>

      <form onSubmit={submit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            className="w-full border rounded px-3 py-2"
            value={form.title}
            onChange={change}
            placeholder="Enter blog title"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium mb-1">Slug (optional)</label>
          <input
            name="slug"
            className="w-full border rounded px-3 py-2"
            value={form.slug}
            onChange={change}
            placeholder="If left blank, will be generated automatically"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            name="content"
            rows="5"
            className="w-full border rounded px-3 py-2"
            value={form.content}
            onChange={change}
            placeholder="Write the blog content here..."
            required
          />
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail URL</label>
          <input
            name="thumbnail"
            type="url"
            className="w-full border rounded px-3 py-2"
            value={form.thumbnail}
            onChange={change}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            type="submit"
          >
            {post ? "Save Changes" : "Add Post"}
          </button>
          {onCancel && (
            <button
              type="button"
              className="px-4 py-2 border rounded hover:bg-gray-100"
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
 */
export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingPost, setEditingPost] = useState(null);

  const fetchPosts = () => {
    api
      .get("/posts/mine/list")
      .then((res) => setPosts(res.data))
      .catch(() => setError("Failed to load posts"));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSave = (updated) => {
    if (editingPost) {
      setPosts((ps) => ps.map((p) => (p.id === updated.id ? updated : p)));
      setMessage("✅ Post updated successfully!");
    } else {
      setPosts((ps) => [updated, ...ps]);
      setMessage("✅ Post created successfully!");
    }
    setEditingPost(null);
  };

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
      <div className="max-w-4xl mx-auto p-6">
        {message && <div className="mb-4 p-3 rounded bg-green-100 text-green-700">{message}</div>}
        {error && <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{error}</div>}

        <PostForm
          post={editingPost}
          onSave={handleSave}
          onCancel={() => setEditingPost(null)}
        />

        <div className="bg-white shadow rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-3">Your Posts</h4>
          {posts.length === 0 ? (
            <p className="text-gray-500">No posts yet.</p>
          ) : (
            <ul className="divide-y">
              {posts.map((p) => (
                <li key={p.id} className="flex justify-between items-center py-3">
                  <span className="font-medium">
                    {p.title} <small className="text-gray-500">({p.slug})</small>
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => setEditingPost(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
