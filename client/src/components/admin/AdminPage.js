// client/src/components/admin/AdminPage.js

import React, { useEffect, useState } from "react";
import { api } from "../../api";
import AdminProjectForm from "./AdminProjectForm";
import AdminResumeSection from "./AdminResumeSection";
import AdminMessagesSection from "./AdminMessagesSection";
import AdminProfileSection from "./AdminProfileSection";
import AdminUserSection from "./AdminUserSection";
import AdminBlogPage from "./AdminBlogPage";
import AdminCommentsSection from "./AdminCommentsSection";

/**
 * AdminPage
 * Admin Dashboard
 * - Account settings
 * - Profile (About & Skills)
 * - Resume
 * - Projects CRUD
 * - Messages
 * - Blog
 * - Comments
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

  // CRUD handlers
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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">⚙️ Admin Panel</h2>
      </div>

      {/* Section Tabs */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { key: "user", label: "Account Settings" },
            { key: "profile", label: "Your Profile" },
            { key: "resume", label: "Your Resume" },
            { key: "projects", label: "Projects" },
            { key: "messages", label: "Contact Messages" },
            { key: "blog", label: "Manage Blog" },
            { key: "comments", label: "Comments" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded-md font-medium transition ${
                activeSection === tab.key
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => setActiveSection(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-100 text-red-700">
          {error}
        </div>
      )}

      {/* Sections */}
      {activeSection === "user" && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
          <AdminUserSection />
        </div>
      )}

      {activeSection === "profile" && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Your Profile (About & Skills)</h3>
          <AdminProfileSection />
        </div>
      )}

      {activeSection === "resume" && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Your Resume</h3>
          <AdminResumeSection />
        </div>
      )}

      {activeSection === "projects" && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {editingProject ? "Edit Project" : "Add New Project"}
            </h3>
            {editingProject && (
              <button
                className="px-3 py-1 rounded-md text-sm bg-gray-200 hover:bg-gray-300"
                onClick={() => setEditingProject(null)}
              >
                Cancel
              </button>
            )}
          </div>

          <AdminProjectForm
            project={editingProject}
            onSave={(p) => {
              editingProject
                ? handleProjectUpdated(p)
                : handleProjectAdded(p);
            }}
            onCancel={() => setEditingProject(null)}
          />

          <hr className="my-6" />
          <h3 className="text-lg font-semibold mb-4">Existing Projects</h3>

          {projects.length === 0 ? (
            <div className="text-gray-500">No projects yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-gray-200 rounded-lg">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3">Title</th>
                    <th className="p-3 hidden lg:table-cell">Links</th>
                    <th className="p-3 w-40">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{p.title}</td>
                      <td className="p-3 hidden lg:table-cell">
                        <div className="flex gap-2 flex-wrap">
                          {p.github_link && (
                            <a
                              href={p.github_link}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 bg-gray-800 text-white text-xs rounded-md"
                            >
                              GitHub
                            </a>
                          )}
                          {p.demo_link && (
                            <a
                              href={p.demo_link}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-md"
                            >
                              Live
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                            onClick={() => setEditingProject(p)}
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
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
      )}

      {activeSection === "messages" && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Contact Messages</h3>
          <AdminMessagesSection />
        </div>
      )}

      {activeSection === "blog" && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Manage Blog</h3>
          <AdminBlogPage />
        </div>
      )}

      {activeSection === "comments" && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Manage Comments</h3>
          <AdminCommentsSection />
        </div>
      )}
    </div>
  );
}
