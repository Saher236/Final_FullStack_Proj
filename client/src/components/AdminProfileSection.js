// client/src/components/AdminProfileSection.js
import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminProfileSection() {
  const [form, setForm] = useState({
    about: "",
    skills: "",
    birth_year: "",
    location: "",
    languages: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/profiles/mine")
      .then(res => {
        if (res.data) {
          setForm({
            about: res.data.about || "",
            skills: res.data.skills || "",
            birth_year: res.data.birth_year || "",
            location: res.data.location || "",
            languages: Array.isArray(res.data.languages)
              ? res.data.languages.join(", ")
              : res.data.languages || "",
          });
        }
      })
      .catch(err => {
        console.error(err);
        setError("❌ Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, []);

  const change = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await api.post("/profiles/mine", form);
      setMessage("✅ Profile saved successfully!");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading profile…</p>;

  // גיל מחושב
  const age = form.birth_year
    ? new Date().getFullYear() - parseInt(form.birth_year)
    : null;

  return (
    <div className="container mb-5">
      <h5>Your Profile (About & Skills)</h5>

      {/* 🔹 הודעות */}
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* About */}
      <div className="mb-3">
        <label className="form-label">About</label>
        <textarea
          className="form-control"
          rows="3"
          name="about"
          value={form.about}
          onChange={change}
        />
      </div>

      {/* Skills */}
      <div className="mb-3">
        <label className="form-label">Skills (comma separated)</label>
        <input
          className="form-control"
          name="skills"
          value={form.skills}
          onChange={change}
        />
      </div>

      {/* Year of Birth */}
      <div className="mb-3">
        <label className="form-label">Year of Birth</label>
        <input
          className="form-control"
          name="birth_year"
          value={form.birth_year}
          onChange={change}
        />
        {age && <small className="text-muted">Calculated Age: {age} years</small>}
      </div>

      {/* Location */}
      <div className="mb-3">
        <label className="form-label">Location</label>
        <input
          className="form-control"
          name="location"
          value={form.location}
          onChange={change}
        />
      </div>

      {/* Languages */}
      <div className="mb-3">
        <label className="form-label">Languages (comma separated)</label>
        <input
          className="form-control"
          name="languages"
          value={form.languages}
          onChange={change}
        />
      </div>

      <button
        className="btn btn-success"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving…" : "Save Profile"}
      </button>
    </div>
  );
}
