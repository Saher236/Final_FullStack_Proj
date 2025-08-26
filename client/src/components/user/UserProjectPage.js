// client/src/components/user/UserProjectPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api";

export default function UserProjectPage() {
  const { userId, projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .get(`/projects/user/${userId}`)
      .then((res) => {
        const proj = res.data.find((p) => String(p.id) === String(projectId));
        setProject(proj || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId, projectId]);

  if (loading) {
    return <div className="max-w-5xl mx-auto px-6 py-10">Loading…</div>;
  }

  if (!project) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-red-600">Project not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative animated-bg">    
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/user/${userId}/projects`)}
          className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          ← Back to Projects
        </button>

        {/* Project Details */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-3">{project.title}</h1>
          <p className="text-gray-700 mb-4">{project.description}</p>

          <div className="flex flex-wrap gap-3">
            {project.github_link && (
              <a
                className="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700"
                href={project.github_link}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            )}
            {project.demo_link && (
              <a
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-500"
                href={project.demo_link}
                target="_blank"
                rel="noreferrer"
              >
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
