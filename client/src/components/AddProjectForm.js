// client/src/components/AddProjectForm.js
import React, { useState } from "react";
import { api } from "../api";

export default function AddProjectForm({ onProjectAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    github_link: "",
    demo_link: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(""); // ✅ הודעת הצלחה

  const change = (e) =>
    setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage("");
    try {
      const res = await api.post("/projects", formData);
      onProjectAdded(res.data);
      setFormData({
        title: "",
        description: "",
        github_link: "",
        demo_link: "",
        image_url: "",
      });
      setMessage("✅ Project added successfully!");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to add project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3 mb-4">
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={submit} noValidate>
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Project Title</label>
          <input
            className="form-control"
            name="title"
            value={formData.title}
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
            value={formData.description}
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
            value={formData.github_link}
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
            value={formData.demo_link}
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
            value={formData.image_url}
            onChange={change}
            placeholder="https://example.com/project.jpg"
          />
        </div>

        {/* Actions */}
        <div className="d-flex gap-2">
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Adding..." : "Add Project"}
          </button>
          <button
            type="reset"
            className="btn btn-outline-secondary"
            onClick={() =>
              setFormData({
                title: "",
                description: "",
                github_link: "",
                demo_link: "",
                image_url: "",
              })
            }
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
