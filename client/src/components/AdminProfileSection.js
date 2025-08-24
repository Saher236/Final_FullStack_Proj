// client/src/components/AdminProfileSection.js

import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminProfileSection() {
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/profiles/mine")
      .then(res => {
        if (res.data) {
          setAbout(res.data.about || "");
          setSkills(res.data.skills || "");
          setAvatar(res.data.avatar_url || "");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setError(null);
    try {
      await api.post("/profiles/mine", { about, skills, avatar_url: avatar });
    } catch (err) {
      console.error(err);
      setError("Failed to save profile");
    } finally { setSaving(false); }
  };

  if (loading) return <p>Loading profile…</p>;

  return (
    <div className="container mb-5">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label className="form-label">About</label>
        <textarea className="form-control" rows="5" value={about} onChange={e=>setAbout(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Skills (comma separated)</label>
        <input className="form-control" value={skills} onChange={e=>setSkills(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label">Avatar URL (optional)</label>
        <input className="form-control" value={avatar} onChange={e=>setAvatar(e.target.value)} />
      </div>

      <button className="btn btn-success" onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save Profile"}
      </button>
    </div>
  );
}
