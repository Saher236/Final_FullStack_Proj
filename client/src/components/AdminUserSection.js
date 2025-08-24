// client/src/components/AdminUserSection.js

import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminUserSection() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    github_url: "",
    linkedin_url: "",
    avatar_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // 📌 טוען את המשתמש המחובר
  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => {
        if (res.data) setForm(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load user data");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await api.put("/users/me", form);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading user info…</p>;

  return (
    <div className="container mb-4">
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">Profile updated!</div>}

      <div className="mb-3">
        <label className="form-label">Username</label>
        <input
          className="form-control"
          name="username"
          value={form.username}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          className="form-control"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">GitHub URL</label>
        <input
          className="form-control"
          name="github_url"
          value={form.github_url || ""}
          onChange={handleChange}
          placeholder="https://github.com/username"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">LinkedIn URL</label>
        <input
          className="form-control"
          name="linkedin_url"
          value={form.linkedin_url || ""}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/username"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Avatar URL</label>
        <input
          className="form-control"
          name="avatar_url"
          value={form.avatar_url || ""}
          onChange={handleChange}
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      {form.avatar_url && (
        <div className="text-center mb-3">
          <img
            src={form.avatar_url}
            alt="avatar preview"
            className="rounded-circle"
            style={{ width: 120, height: 120, objectFit: "cover" }}
          />
        </div>
      )}

      <button className="btn btn-success" onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}
