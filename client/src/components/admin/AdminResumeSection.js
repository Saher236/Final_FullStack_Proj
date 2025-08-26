// client/src/components/admin/AdminResumeSection.js

import React, { useEffect, useState } from "react";
import { api } from "../../api";

/**
 * AdminResumeSection
 * Allows the admin to manage their resume (create, update, delete).
 */
export default function AdminResumeSection() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [exists, setExists] = useState(false);

  // Load resume data
  useEffect(() => {
    api
      .get("/resumes/mine")
      .then((res) => {
        if (res.data) {
          setContent(res.data.content || "");
          setExists(true);
        }
      })
      .catch(() => setError("Failed to load resume"))
      .finally(() => setLoading(false));
  }, []);

  // Save or update resume
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await api.post("/resumes", { content });
      setExists(true);
      setMessage("✅ Resume saved successfully!");
    } catch {
      setError("Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  // Delete resume
  const handleDelete = async () => {
    if (!window.confirm("Delete your resume?")) return;
    try {
      await api.delete("/resumes");
      setContent("");
      setExists(false);
      setMessage("🗑️ Resume deleted successfully!");
    } catch {
      setError("Failed to delete resume");
    }
  };

  if (loading) return <p>Loading resume…</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <textarea
        className="w-full border rounded-md p-3 mb-4 min-h-[200px] focus:ring-2 focus:ring-indigo-400"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your resume here..."
      />

      <div className="flex gap-3">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : exists ? "Update Resume" : "Create Resume"}
        </button>

        {exists && (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={handleDelete}
          >
            Delete Resume
          </button>
        )}
      </div>
    </div>
  );
}
