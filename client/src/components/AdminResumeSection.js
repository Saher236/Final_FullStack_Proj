// client/src/components/AdminResumeSection.js

import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminResumeSection() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    api.get("/resumes/mine")
      .then(res => {
        if (res.data) {
          setContent(res.data.content || "");
          setExists(true);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setError(null);
    try {
      await api.post("/resumes", { content });
      setExists(true);
    } catch (err) { console.error(err); setError("Failed to save resume"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete your resume?")) return;
    try {
      await api.delete("/resumes");
      setContent(""); setExists(false);
    } catch (err) { console.error(err); setError("Failed to delete resume"); }
  };

  if (loading) return <p>Loading resume…</p>;

  return (
    <div className="container mb-5">
      {error && <div className="alert alert-danger">{error}</div>}
      <textarea className="form-control mb-3" rows="8" value={content} onChange={e=>setContent(e.target.value)} />
      <button className="btn btn-success me-2" onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : exists ? "Update Resume" : "Create Resume"}
      </button>
      {exists && <button className="btn btn-outline-danger" onClick={handleDelete}>Delete Resume</button>}
    </div>
  );
}
