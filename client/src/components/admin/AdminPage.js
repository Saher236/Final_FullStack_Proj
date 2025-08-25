// client/src/components/AdminPage.js

import React, { useEffect, useState } from "react";
import { api } from "../../api";
import AddProjectForm from "./projects/AddProjectForm";
import EditProjectForm from "./projects/EditProjectForm";
import AdminResumeSection from "./AdminResumeSection";
import AdminMessagesSection from "./AdminMessagesSection";
import AdminProfileSection from "./AdminProfileSection";
import AdminUserSection from "./AdminUserSection";
import AdminBlogPage from "./AdminBlogPage";

/**
 * AdminPage
 * The main admin dashboard that manages all sections:
 * - Account settings
 * - Profile (About & Skills)
 * - Resume
 * - Projects (CRUD)
 * - Messages
 * - Blog
 */
export default function AdminPage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [activeSection, setActiveSection] = useState("user");

  // Fetch projects for admin
  const fetchProjects = () => {
    api
      .get("/projects/mine")
      .then((res) => setProjects(res.data))
      .catch((err) => {
        console.error("Error loading projects:", err);
        setError("Failed to load projects");
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // CRUD project handlers
  const handleProjectAdded = (p) => setProjects((prev) => [p, ...prev]);
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  };
  const handleProjectUpdated = (up) => {
    setProjects((prev) => prev.map((p) => (p.id === up.id ? up : p)));
    setEditingProject(null);
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="mb-0">Admin Panel</h3>
      </div>

      {/* Section Tabs */}
      <div className="card shadow-sm p-3 mb-4">
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          <button
            className={`btn ${
              activeSection === "user" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setActiveSection("user")}
          >
            Account Settings
          </button>
          <button
            className={`btn ${
              activeSection === "profile" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setActiveSection("profile")}
          >
            Your Profile
          </button>
          <button
            className={`btn ${
              activeSection === "resume" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setActiveSection("resume")}
          >
            Your Resume
          </button>
          <button
            className={`btn ${
              activeSection === "projects" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setActiveSection("projects")}
          >
            Projects
          </button>
          <button
            className={`btn ${
              activeSection === "messages" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setActiveSection("messages")}
          >
            Contact Messages
          </button>
          <button
            className={`btn ${
              activeSection === "blog" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setActiveSection("blog")}
          >
            Manage Blog
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Sections */}
      {activeSection === "user" && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">Account Settings</h5>
            <AdminUserSection />
          </div>
        </div>
      )}

      {activeSection === "profile" && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">Your Profile (About & Skills)</h5>
            <AdminProfileSection />
          </div>
        </div>
      )}

      {activeSection === "resume" && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">Your Resume</h5>
            <AdminResumeSection />
          </div>
        </div>
      )}

      {activeSection === "projects" && (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="card-title mb-0">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h5>
              {editingProject && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setEditingProject(null)}
                >
                  Cancel
                </button>
              )}
            </div>

            {editingProject ? (
              <EditProjectForm
                project={editingProject}
                onUpdate={handleProjectUpdated}
                onCancel={() => setEditingProject(null)}
              />
            ) : (
              <AddProjectForm onProjectAdded={handleProjectAdded} />
            )}

            <hr className="my-4" />
            <h5 className="card-title mb-3">Existing Projects</h5>

            {projects.length === 0 ? (
              <div className="text-muted">No projects yet.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th className="d-none d-lg-table-cell">Links</th>
                      <th style={{ width: 130 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p) => (
                      <tr key={p.id}>
                        <td>{p.title}</td>
                        <td className="d-none d-lg-table-cell">
                          <div className="d-flex flex-wrap gap-2">
                            {p.github_link && (
                              <a
                                href={p.github_link}
                                target="_blank"
                                rel="noreferrer"
                                className="badge text-bg-dark text-decoration-none"
                              >
                                GitHub
                              </a>
                            )}
                            {p.demo_link && (
                              <a
                                href={p.demo_link}
                                target="_blank"
                                rel="noreferrer"
                                className="badge text-bg-primary text-decoration-none"
                              >
                                Live
                              </a>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setEditingProject(p)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(p.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSection === "messages" && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">Contact Messages</h5>
            <AdminMessagesSection />
          </div>
        </div>
      )}

      {activeSection === "blog" && (
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">Manage Blog</h5>
            <AdminBlogPage />
          </div>
        </div>
      )}
    </div>
  );
}