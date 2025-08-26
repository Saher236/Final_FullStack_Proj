// client/src/components/admin/AdminUserSection.js

import React, { useEffect, useState } from "react";
import { api } from "../../api";

/**
 * AdminUserSection
 * Handles account settings for the admin:
 * - Username & Email
 * - GitHub & LinkedIn
 * - Avatar (with live preview)
 */
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

  // Load user info
  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => res.data && setForm(res.data))
      .catch(() => setError("Failed to load user data"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Save updates
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await api.put("/users/me", form);
      setSuccess(true);
    } catch {
      setError("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading user info…</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">✅ Profile updated!</div>}

      <div className="space-y-4">
        {/* Username */}
        <div>
          <label className="block font-medium">Username</label>
          <input
            className="mt-1 w-full border rounded-md p-2"
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            className="mt-1 w-full border rounded-md p-2"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* GitHub */}
        <div>
          <label className="block font-medium">GitHub URL</label>
          <input
            className="mt-1 w-full border rounded-md p-2"
            name="github_url"
            value={form.github_url || ""}
            onChange={handleChange}
            placeholder="https://github.com/username"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block font-medium">LinkedIn URL</label>
          <input
            className="mt-1 w-full border rounded-md p-2"
            name="linkedin_url"
            value={form.linkedin_url || ""}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        {/* Avatar */}
        <div>
          <label className="block font-medium">Avatar URL</label>
          <input
            className="mt-1 w-full border rounded-md p-2"
            name="avatar_url"
            value={form.avatar_url || ""}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        {form.avatar_url && (
          <div className="text-center mt-4">
            <img
              src={form.avatar_url}
              alt="avatar preview"
              className="rounded-full shadow-md mx-auto"
              style={{ width: 120, height: 120, objectFit: "cover" }}
            />
          </div>
        )}
      </div>

      <button
        className="mt-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}
