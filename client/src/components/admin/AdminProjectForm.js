// client/src/components/admin/AdminProjectForm.js
import React, { useEffect, useState } from "react";
import { api } from "../../api";

/**
 * AdminProjectForm
 * Unified form for both adding and editing projects.
 * Props:
 * - project: (optional) existing project object → triggers edit mode
 * - onSave: callback(project) → called after successful save (add or update)
 * - onCancel: callback() → called when canceling edit (only relevant in edit mode)
 */
export default function AdminProjectForm({ project, onSave, onCancel }) {
  const isEditing = Boolean(project);

  const [form, setForm] = useState({
    title: "",
    description: "",
    github_link: "",
    demo_link: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Prefill form when editing
  useEffect(() => {
    if (isEditing && project) {
      setForm({
        title: project.title || "",
        description: project.description || "",
        github_link: project.github_link || "",
        demo_link: project.demo_link || "",
        image_url: project.image_url || "",
      });
    }
  }, [isEditing, project]);

  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      let res;
      if (isEditing) {
        res = await api.put(`/projects/${project.id}`, form);
        setMessage("Project updated successfully!");
      } else {
        res = await api.post("/projects", form);
        setMessage("Project added successfully!");
        setForm({
          title: "",
          description: "",
          github_link: "",
          demo_link: "",
          image_url: "",
        });
      }
      onSave(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">
      <h5 className="text-lg font-bold mb-4">
        {isEditing ? "Edit Project" : "Add New Project"}
      </h5>

      {message && <div className="p-2 mb-3 bg-green-100 text-green-700 rounded">{message}</div>}
      {error && <div className="p-2 mb-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={submit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Project Title</label>
          <input
            className="w-full border rounded-md px-3 py-2 mt-1"
            name="title"
            value={form.title}
            onChange={change}
            placeholder="Enter project title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full border rounded-md px-3 py-2 mt-1"
            rows="4"
            name="description"
            value={form.description}
            onChange={change}
            placeholder="Brief description of the project"
            required
          />
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-sm font-medium">GitHub Link</label>
          <input
            className="w-full border rounded-md px-3 py-2 mt-1"
            name="github_link"
            type="url"
            value={form.github_link}
            onChange={change}
            placeholder="https://github.com/..."
          />
        </div>

        {/* Demo */}
        <div>
          <label className="block text-sm font-medium">Demo Link</label>
          <input
            className="w-full border rounded-md px-3 py-2 mt-1"
            name="demo_link"
            type="url"
            value={form.demo_link}
            onChange={change}
            placeholder="https://your-live-demo.com"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium">Project Image URL</label>
          <input
            className="w-full border rounded-md px-3 py-2 mt-1"
            name="image_url"
            type="url"
            value={form.image_url}
            onChange={change}
            placeholder="https://example.com/project.jpg"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Saving…" : isEditing ? "Save Changes" : "Add Project"}
          </button>
          {isEditing && (
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
          {!isEditing && (
            <button
              type="reset"
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
              onClick={() =>
                setForm({
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
          )}
        </div>
      </form>
    </div>
  );
}