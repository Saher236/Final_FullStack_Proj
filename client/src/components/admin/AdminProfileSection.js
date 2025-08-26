// client/src/components/admin/AdminProfileSection.js

import React, { useEffect, useState } from "react";
import { api } from "../../api";

/**
 * AdminProfileSection
 * Admin profile management (about, skills, birth year, location, languages).
 */
export default function AdminProfileSection() {
  const [form, setForm] = useState({
    about: "",
    skills: "",
    birth_year: "",
    location: "",
    languages: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/profiles/mine")
      .then((res) => {
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
      .catch(() => setError("Failed to load profile"));
  }, []);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await api.post("/profiles/mine", form);
      setMessage("✅ Profile saved successfully!");
    } catch {
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const age = form.birth_year
    ? new Date().getFullYear() - parseInt(form.birth_year)
    : null;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="space-y-4">
        {/* About */}
        <div>
          <label className="block font-medium">About</label>
          <textarea
            className="mt-1 w-full border rounded-md p-2"
            rows="3"
            name="about"
            value={form.about}
            onChange={change}
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block font-medium">Skills (comma separated)</label>
          <input
            className="mt-1 w-full border rounded-md p-2"
            name="skills"
            value={form.skills}
            onChange={change}
          />
        </div>

        {/* Year of Birth */}
        <div>
          <label className="block font-medium">Year of Birth</label>
          <input
            className="mt-1 w-full border rounded-md p-2"
            name="birth_year"
            value={form.birth_year}
            onChange={change}
          />
          {age && <small className="text-gray-500">Age: {age} years</small>}
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium">Location</label>
          <input
            className="mt-1 w-full border rounded-md p-2"
            name="location"
            value={form.location}
            onChange={change}
          />
        </div>

        {/* Languages */}
        <div>
          <label className="block font-medium">Languages (comma separated)</label>
          <input
            className="mt-1 w-full border rounded-md p-2"
            name="languages"
            value={form.languages}
            onChange={change}
          />
        </div>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving…" : "Save Profile"}
      </button>
    </div>
  );
}
