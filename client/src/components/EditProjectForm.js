// client/src/components/EditProjectForm.js

import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function EditProjectForm({ project, onUpdate, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    github_link: "",
    demo_link: "",
    image_url: "",
  });

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || "",
        description: project.description || "",
        github_link: project.github_link || "",
        demo_link: project.demo_link || "",
        image_url: project.image_url || "",
      });
    }
  }, [project]);

  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/projects/${project.id}`, form);
      onUpdate(data);
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  if (!project) return null;

  return (
    <div className="card p-3 mb-4">
      {/* 🔹 כותרת דינאמית */}
      <div className="d-flex justify-content-between align-items-start">
      </div>
      {/* 🔹 טופס */}
      <form onSubmit={submit}>
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Project Title</label>
          <input
            className="form-control"
            name="title"
            value={form.title}
            onChange={change}
            placeholder="Enter project title"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="4"
            name="description"
            value={form.description}
            onChange={change}
            placeholder="Brief description of the project"
            required
          />
        </div>

        {/* GitHub */}
        <div className="mb-3">
          <label className="form-label">GitHub Link</label>
          <input
            className="form-control"
            name="github_link"
            type="url"
            value={form.github_link}
            onChange={change}
            placeholder="https://github.com/..."
          />
        </div>

        {/* Demo */}
        <div className="mb-3">
          <label className="form-label">Demo Link</label>
          <input
            className="form-control"
            name="demo_link"
            type="url"
            value={form.demo_link}
            onChange={change}
            placeholder="https://your-live-demo.com"
          />
        </div>

        {/* Image */}
        <div className="mb-3">
          <label className="form-label">Project Image URL</label>
          <input
            className="form-control"
            name="image_url"
            type="url"
            value={form.image_url}
            onChange={change}
            placeholder="https://example.com/project.jpg"
          />
        </div>

        {/* Actions */}
        <div className="d-flex gap-2">
          <button className="btn btn-success" type="submit">
            Save Changes
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
