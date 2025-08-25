// client/src/components/PostForm.js

import React, { useEffect, useState } from "react";
import { api } from "../../../api";

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
 * Form component used to create or edit blog posts.
 * Features:
 * - Add/edit title, slug, content, and thumbnail
 * - Auto-generates slug from title if left empty
 * - Supports cancel and save actions
 */
export default function PostForm({ post, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    thumbnail: "",
  });

  // Load post into form if editing
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

  // Save or update post
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
