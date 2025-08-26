// client/src/components/user/UserProjectsPage.js

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../api";
import UserSectionNav from "./UserSectionNav";

/**
 * UserProjectsPage
 * Displays all projects of a specific user.
 * Features:
 * - Fetches user projects from API
 * - Shows project cards with title, description, links
 * - Links to project details page
 */
export default function UserProjectsPage() {
  const { userId } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get(`/projects/user/${userId}`)
      .then((res) => setProjects(res.data || []))
      .catch(() => setError("Failed to load projects"))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="min-h-screen relative animated-bg">    
      <div className="max-w-6xl mx-auto px-6 py-10">
        <UserSectionNav userId={userId} active="projects" />

        <h1 className="text-3xl font-bold mb-6">All Projects</h1>

        {loading && <p>Loading projects…</p>}
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition flex flex-col"
            >
              <h3 className="text-lg font-bold mb-2">{p.title}</h3>
              <p className="text-gray-600 mb-4 flex-grow">{p.description}</p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {p.github_link && (
                  <a
                    href={p.github_link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700"
                  >
                    GitHub
                  </a>
                )}
                {p.demo_link && (
                  <a
                    href={p.demo_link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-500"
                  >
                    Live
                  </a>
                )}
                <Link
                  to={`/user/${userId}/projects/${p.id}`}
                  className="ml-auto px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-500"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {!loading && !projects.length && (
          <p className="text-gray-500 mt-6">No projects yet.</p>
        )}
      </div>
    </div>
  );
}
